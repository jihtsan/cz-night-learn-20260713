import { useEffect, useRef } from 'react'
import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'

type ColorBendsProps = {
  className?: string
  rotation?: number
  speed?: number
  colors?: string[]
  scale?: number
  frequency?: number
  warpStrength?: number
  mouseInfluence?: number
  parallax?: number
  noise?: number
  intensity?: number
  bandWidth?: number
}

const MAX_COLORS = 5

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

const fragmentShader = `
#define MAX_COLORS ${MAX_COLORS}
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRotation;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
uniform float uIntensity;
uniform float uBandWidth;
varying vec2 vUv;

void main() {
  float time = uTime * uSpeed;
  vec2 point = vUv * 2.0 - 1.0;
  point += uPointer * uParallax * 0.1;
  vec2 rotated = vec2(
    point.x * uRotation.x - point.y * uRotation.y,
    point.x * uRotation.y + point.y * uRotation.x
  );
  vec2 q = vec2(rotated.x * (uCanvas.x / uCanvas.y), rotated.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(time) - 7.56;
  q += (uPointer - rotated) * uMouseInfluence * 0.2;

  vec2 ripple = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
  q += (ripple - q) * 0.15;

  vec3 color = vec3(0.0);
  float alpha = 0.0;
  vec2 samplePoint = q;

  for (int i = 0; i < MAX_COLORS; ++i) {
    if (i >= uColorCount) break;
    samplePoint -= 0.01;
    vec2 r = sin(1.5 * (samplePoint.yx * uFrequency) + 2.0 * cos(samplePoint * uFrequency));
    vec2 warped = samplePoint + (r - samplePoint) * uWarpStrength;
    float distanceField = length(
      warped + sin(5.0 * warped.y * uFrequency - 3.0 * time + float(i)) / 4.0
    );
    float weight = 1.0 - exp(-uBandWidth / exp(uBandWidth * distanceField));
    color += uColors[i] * weight;
    alpha = max(alpha, weight);
  }

  color = clamp(color * uIntensity, 0.0, 1.0);
  if (uNoise > 0.0001) {
    float grain = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453);
    color = clamp(color + (grain - 0.5) * uNoise, 0.0, 1.0);
  }

  gl_FragColor = vec4(color * alpha, alpha);
}
`

function toColorVector(hex: string) {
  const value = hex.replace('#', '').trim()
  const parts = value.length === 3
    ? [value[0] + value[0], value[1] + value[1], value[2] + value[2]]
    : [value.slice(0, 2), value.slice(2, 4), value.slice(4, 6)]
  return new Vector3(...parts.map((part) => Number.parseInt(part, 16) / 255))
}

// Adapted from React Bits Color Bends (MIT + Commons Clause).
function ColorBends({
  className = '',
  rotation = 90,
  speed = 0.14,
  colors = ['#a855f7', '#713cff', '#d946ef'],
  scale = 1,
  frequency = 1,
  warpStrength = 1,
  mouseInfluence = 0.45,
  parallax = 0.35,
  noise = 0.08,
  intensity = 1.15,
  bandWidth = 5.5,
}: ColorBendsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scene = new Scene()
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const geometry = new PlaneGeometry(2, 2)
    const colorVectors = Array.from({ length: MAX_COLORS }, () => new Vector3())
    colors.slice(0, MAX_COLORS).forEach((color, index) => colorVectors[index].copy(toColorVector(color)))

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      premultipliedAlpha: true,
      uniforms: {
        uCanvas: { value: new Vector2(1, 1) },
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uRotation: { value: new Vector2(1, 0) },
        uColorCount: { value: Math.min(colors.length, MAX_COLORS) },
        uColors: { value: colorVectors },
        uScale: { value: scale },
        uFrequency: { value: frequency },
        uWarpStrength: { value: warpStrength },
        uPointer: { value: new Vector2() },
        uMouseInfluence: { value: mouseInfluence },
        uParallax: { value: parallax },
        uNoise: { value: noise },
        uIntensity: { value: intensity },
        uBandWidth: { value: bandWidth },
      },
    })

    const renderer = new WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' })
    renderer.outputColorSpace = SRGBColorSpace
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    container.appendChild(renderer.domElement)

    const mesh = new Mesh(geometry, material)
    scene.add(mesh)

    const handleResize = () => {
      const width = container.clientWidth || 1
      const height = container.clientHeight || 1
      renderer.setSize(width, height, false)
      material.uniforms.uCanvas.value.set(width, height)
    }

    const pointerTarget = new Vector2()
    const pointerCurrent = new Vector2()
    const handlePointerMove = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect()
      pointerTarget.set(
        ((event.clientX - bounds.left) / (bounds.width || 1)) * 2 - 1,
        -(((event.clientY - bounds.top) / (bounds.height || 1)) * 2 - 1),
      )
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)
    if (!reduceMotion) container.addEventListener('pointermove', handlePointerMove)
    handleResize()

    const startTime = performance.now()
    let frame = 0
    const render = () => {
      const elapsed = (performance.now() - startTime) / 1000
      material.uniforms.uTime.value = elapsed
      const radians = (rotation * Math.PI) / 180
      material.uniforms.uRotation.value.set(Math.cos(radians), Math.sin(radians))
      pointerCurrent.lerp(pointerTarget, 0.055)
      material.uniforms.uPointer.value.copy(pointerCurrent)
      renderer.render(scene, camera)
      if (!reduceMotion) frame = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      container.removeEventListener('pointermove', handlePointerMove)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
  }, [bandWidth, colors, frequency, intensity, mouseInfluence, noise, parallax, rotation, scale, speed, warpStrength])

  return <div ref={containerRef} className={`size-full overflow-hidden ${className}`} aria-hidden="true" />
}

export { ColorBends }
