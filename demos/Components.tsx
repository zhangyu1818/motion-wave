import { useDeferredValue, useRef } from 'react'
import { useControls, button, folder, Leva } from 'leva'
import { bezier as bezierControl } from '@leva-ui/plugin-bezier'
import { spring as springControl } from '@leva-ui/plugin-spring'

import { type Story } from '@ladle/react'

import { Wave, MotionWave, type WaveTransition, type WaveHandler } from '../src'
import { defaultConfig } from './defaultConfig'

const useMotionControls = (
  name: string,
  defaultValue: Record<string, unknown> = {},
  defaultType: 'spring' | 'tween' = 'tween'
) => {
  const controls = useControls(
    'Motion',
    {
      [name]: folder(
        {
          type: {
            value: defaultType,
            options: ['tween', 'spring'],
          },
          ...defaultValue,
          bezier: bezierControl({
            handles: 'ease',
            render: get => get(`Motion.${name}.type`) === 'tween',
          }),
          spring: springControl({
            value: {
              friction: 10,
              mass: 1,
              tension: 20,
            },
            render: get => get(`Motion.${name}.type`) === 'spring',
          }),
        },
        { collapsed: true }
      ),
    },
    {
      collapsed: true,
    }
  )

  const { type, bezier, spring, ...rest } = controls

  if (type === 'tween') {
    return {
      type: 'tween',
      ease: bezier,
      ...rest,
    } as WaveTransition
  } else {
    return {
      type: 'spring',
      damping: spring.friction,
      mass: spring.mass,
      stiffness: spring.tension,
      ...rest,
    } as WaveTransition
  }
}

export const WaveExample: Story = () => {
  const controls = useControls({
    ...defaultConfig,
    start: button(() => {
      handler.current?.start()
    }),
    stop: button(() => {
      handler.current?.stop()
    }),
  })

  const values = useDeferredValue(controls)
  const handler = useRef<WaveHandler>(null)

  return (
    <>
      <Wave ref={handler} width={innerWidth} height={innerHeight} {...values} />
      <Leva hideCopyButton />
    </>
  )
}
WaveExample.storyName = 'Wave'

export const MotionWaveExample: Story = () => {
  const defaultControls = useControls(
    'initial',
    { ...defaultConfig, frequency: 0.4, color: '#FF7F50' },
    {
      collapsed: true,
    }
  )

  const { hide } = useControls({
    hide: {
      value: false,
      options: [true, false],
    },
  })

  const controls = useControls('Animation', {
    frequency: {
      value: 0.2,
      min: 0,
      max: 10,
      step: 0.01,
    },
    amplitude: {
      value: 150,
      min: 0,
      max: innerHeight / 2,
    },
    phase: {
      value: 4,
      step: 1,
    },
    offset: {
      value: 50,
      min: -innerHeight,
      max: innerHeight,
    },
    speed: {
      value: 4,
      step: 1,
    },
    color: {
      value: '#00A86B',
    },
  })

  const { frequency, amplitude, phase, offset, speed, color } =
    useDeferredValue(controls)

  const frequencyConfig = useMotionControls('frequency', {
    duration: 8,
    loopDelay: 3,
  })
  const amplitudeConfig = useMotionControls('amplitude', {
    loopDelay: 3,
  })
  const phaseConfig = useMotionControls('phase', {
    duration: 10,
  })
  const offsetConfig = useMotionControls('offset', {
    duration: 2,
  })
  const speedConfig = useMotionControls('speed', {
    duration: 10,
    loopDelay: 3,
  })
  const colorConfig = useMotionControls('color', {
    duration: 6,
    loopDelay: 2,
  })

  return (
    <>
      {!hide && (
        <MotionWave
          width={innerWidth}
          height={innerHeight}
          initialConfig={defaultControls}
          motionConfig={{
            frequency: {
              value: frequency,
              ...frequencyConfig,
            },
            amplitude: {
              value: amplitude,
              ...amplitudeConfig,
            },
            phase: {
              value: phase,
              ...phaseConfig,
            },
            offset: {
              value: offset,
              ...offsetConfig,
            },
            speed: {
              value: speed,
              ...speedConfig,
            },
            color: {
              value: color,
              ...colorConfig,
            },
          }}
        />
      )}
      <Leva collapsed hideCopyButton />
    </>
  )
}

MotionWaveExample.storyName = 'MotionWave'
