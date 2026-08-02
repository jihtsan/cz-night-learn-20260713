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
        <div className="pointer-events-none absolute inset-[19%] rounded-full border border-dashed border-[#cfd3dc]/80" />
        <div className="pointer-events-none absolute inset-1/2 size-[4.35rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff_0%,#eceff5_72%,#dfe3eb_100%)] shadow-[0_14px_35px_rgba(67,75,91,.16)]" />

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
              className="group absolute left-1/2 top-1/2 grid -translate-x-1/2 place-items-center overflow-hidden rounded-full border-[3px] border-white bg-[#e8ebf1] shadow-[0_9px_24px_rgba(48,52,61,.18)] ring-1 ring-black/5 transition-shadow hover:shadow-[0_12px_30px_rgba(45,52,68,.28)] focus-visible:outline-none"
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
