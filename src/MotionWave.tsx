import * as React from 'react'

import { useWave, useLayoutEffect } from './hook'

import type { Controls, Options } from 'from-to.js'
import type { WaveConfig } from './createWave'

type SupportedMotionConfig = WaveConfig

export type WaveTransition = Options<unknown>

export type MotionConfig = {
  [P in keyof SupportedMotionConfig]?:
    | (WaveTransition & {
        value: NonNullable<SupportedMotionConfig[P]>
      })
    | SupportedMotionConfig[P]
}

type MotionMap = {
  [P in keyof SupportedMotionConfig]?: {
    controls: Controls
    transition: MotionConfig
  }
}

export interface MotionWaveProps
  extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  initialConfig: WaveConfig
  motionConfig?: MotionConfig
}

export const MotionWave = React.memo(
  React.forwardRef<unknown, MotionWaveProps>((props, ref) => {
    const {
      width = innerWidth,
      height = innerHeight,
      initialConfig,
      motionConfig,
      ...restProps
    } = props

    const defaultConfig = React.useMemo(() => initialConfig, [])

    const [canvasRef, canvasHandler] = useWave(defaultConfig, ref)

    const motionMap = React.useRef<MotionMap>({})

    useLayoutEffect(() => {
      if (motionConfig && canvasHandler.current) {
        Object.entries(motionConfig).forEach(([key, config]) => {
          const motionKey = key as keyof SupportedMotionConfig
          const currentValue = canvasHandler.current!.currentConfig[motionKey]

          let nextValue, transition

          if (typeof config === 'object' && config !== null) {
            const { value, ...nextTransition } = config
            nextValue = value
            transition = nextTransition
          } else {
            nextValue = config
            transition = {}
          }

          const { transition: lastTransition, controls: lastControls } =
            motionMap.current[motionKey] ?? {}

          const shouldAnimate =
            (lastTransition &&
              JSON.stringify(lastTransition) !== JSON.stringify(transition)) ||
            (currentValue !== undefined && currentValue !== nextValue)

          if (shouldAnimate) {
            lastControls?.stop()

            const controls = canvasHandler.current!.motionTo(
              motionKey,
              nextValue,
              {
                ...transition,
              }
            )

            motionMap.current[motionKey] = {
              controls,
              transition: transition as MotionConfig,
            }
          }
        })
      }
    }, [JSON.stringify(motionConfig)])

    useLayoutEffect(() => {
      return () => {
        if (motionMap.current) {
          Object.values(motionMap.current).forEach(({ controls }) => {
            controls.stop()
          })
        }
      }
    }, [])

    return (
      <canvas ref={canvasRef} width={width} height={height} {...restProps} />
    )
  })
)
