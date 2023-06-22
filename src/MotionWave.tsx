import * as React from 'react'
import { animate } from 'from-to.js'

import { useWave, useLayoutEffect } from './hook'

import type { Controls, Bezier, Spring } from 'from-to.js'
import type { WaveConfig } from './createWave'

type SupportedMotionConfig = Omit<WaveConfig, ''>

export type WaveTransition = (Bezier | Spring) & { delay?: number }

type MotionConfig = {
  [P in keyof SupportedMotionConfig]?: WaveTransition & {
    value: NonNullable<WaveConfig[P]>
  }
}

type MotionMap = {
  [P in keyof SupportedMotionConfig]?: {
    controls: Controls
    transition: WaveTransition
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
      if (motionConfig) {
        Object.entries(motionConfig).forEach(([key, config]) => {
          const motionKey = key as keyof SupportedMotionConfig
          const currentValue = canvasHandler.current!.currentConfig[motionKey]
          const { value: nextValue, ...transition } = config

          const { transition: lastTransition, controls: lastControls } =
            motionMap.current[motionKey] ?? {}

          const shouldAnimate =
            (lastTransition &&
              JSON.stringify(lastTransition) !== JSON.stringify(transition)) ||
            (currentValue !== undefined && currentValue !== nextValue)

          if (shouldAnimate) {
            lastControls?.stop()

            const controls = animate(currentValue, nextValue, {
              loop: true,
              ...transition,
              onUpdate: value => {
                canvasHandler.current?.setConfig({
                  [key]: value,
                })
              },
            })

            motionMap.current[motionKey] = {
              controls,
              transition,
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
