import * as React from 'react'
import {
  LayoutGroup,
  delay,
  motion,
  useAnimate,
  useReducedMotion,
  type AnimationSequence,
  type Transition,
} from 'motion/react'

export type RadialIntroItem = {
  id: number
  name: string
  handle: string
  src: string
  href: string
}

type RadialIntroProps = {
  orbitItems: RadialIntroItem[]
  stageSize?: number
  imageSize?: number
  className?: string
}

const springTransition: Transition = {
  delay: 0,
  stiffness: 300,
  damping: 35,
  type: 'spring',
  restSpeed: 0.01,
  restDelta: 0.01,
}

const spinTransition = {
  duration: 30,
  ease: 'linear' as const,
  repeat: Infinity,
}

const selectAll = (root: Element, selector: string) => Array.from(root.querySelectorAll(selector))
const angleOf = (element: Element) => Number((element as HTMLElement).dataset.angle || 0)
const armOf = (element: Element) => (element as HTMLElement).closest('[data-arm]') as HTMLElement | null

// Adapted from Animate UI's Radial Intro community component (MIT).
function RadialIntro({ orbitItems, stageSize = 260, imageSize = 48, className }: RadialIntroProps) {
  const step = 360 / orbitItems.length
  const [scope, animate] = useAnimate()
  const reduceMotion = useReducedMotion()

  React.useEffect(() => {
    const root = scope.current
    if (!root) return

    const arms = selectAll(root, '[data-arm]')
    const profileLinks = selectAll(root, '[data-arm-image]')
    const stops: Array<() => void> = []
    const introTransition: Transition = reduceMotion ? { duration: 0 } : springTransition

    const orbitPlacementSequence: AnimationSequence = [
      ...arms.map((element) => [
        element,
        { rotate: angleOf(element) },
        { ...introTransition, at: 0 },
      ] as AnimationSequence[number]),
      ...profileLinks.map((profileLink) => [
        profileLink,
        { rotate: -angleOf(armOf(profileLink)!), opacity: 1 },
        { ...introTransition, at: 0 },
      ] as AnimationSequence[number]),
    ]

    const liftDelay = reduceMotion ? 0 : 0.25
    const placementDelay = reduceMotion ? 0 : 0.7
    const spinDelay = reduceMotion ? 0 : 1.3

    const liftTimer = delay(() => animate(profileLinks, { top: 0 }, introTransition), liftDelay)
    const placementTimer = delay(() => animate(orbitPlacementSequence), placementDelay)

    if (!reduceMotion) {
      const spinTimer = delay(() => {
        arms.forEach((element) => {
          const angle = angleOf(element)
          const controls = animate(element, { rotate: [angle, angle + 360] }, spinTransition)
          stops.push(() => controls.cancel())
        })

        profileLinks.forEach((profileLink) => {
          const angle = angleOf(armOf(profileLink)!)
          const controls = animate(profileLink, { rotate: [-angle, -angle - 360] }, spinTransition)
          stops.push(() => controls.cancel())
        })
      }, spinDelay)
      stops.push(() => spinTimer())
    }

    stops.push(() => liftTimer(), () => placementTimer())
    return () => stops.forEach((stop) => stop())
  }, [animate, orbitItems, reduceMotion, scope, step])

  return (
    <LayoutGroup>
      <motion.div
        ref={scope}
        className={className}
        style={{ width: stageSize, height: stageSize }}
        initial={false}
      >
        <div className="pointer-events-none absolute inset-[19%] rounded-full border border-dashed border-[#a855f7]/45 shadow-[0_0_30px_rgba(168,85,247,.1)]" />
        <div className="pointer-events-none absolute inset-1/2 size-[4.35rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle_at_35%_30%,#352044_0%,#1d1627_72%,#120e19_100%)] shadow-[0_14px_38px_rgba(109,40,217,.28)]" />

        {orbitItems.map((item, index) => (
          <motion.div
            key={item.id}
            data-arm
            data-angle={index * step}
            className="absolute inset-0 will-change-transform"
            style={{ zIndex: orbitItems.length - index }}
            layoutId={`radial-arm-${item.id}`}
          >
            <motion.a
              data-arm-image
              href={item.href}
              target="_blank"
              rel="noreferrer"
              title={`${item.name} · ${item.handle}`}
              aria-label={`在 X 上查看 ${item.name}`}
              className="group absolute left-1/2 top-1/2 grid -translate-x-1/2 place-items-center overflow-hidden rounded-full border-[3px] border-[#2b2138] bg-[#18121f] shadow-[0_9px_24px_rgba(0,0,0,.32)] ring-1 ring-[#a855f7]/25 transition-shadow hover:shadow-[0_10px_30px_rgba(168,85,247,.32)] focus-visible:outline-none"
              style={{
                width: imageSize,
                height: imageSize,
                opacity: index === 0 ? 1 : 0,
              }}
              layoutId={`radial-profile-${item.id}`}
            >
              <span className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#1d1d1f] to-[#656b78] text-xs font-bold text-white">
                {item.name.slice(0, 1)}
              </span>
              <img
                src={item.src}
                alt=""
                draggable={false}
                referrerPolicy="no-referrer"
                className="relative size-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(event) => { event.currentTarget.style.display = 'none' }}
              />
            </motion.a>
          </motion.div>
        ))}
      </motion.div>
    </LayoutGroup>
  )
}

export { RadialIntro }
