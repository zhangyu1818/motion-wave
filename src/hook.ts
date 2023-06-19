import * as React from 'react'

import { createWave } from './createWave'
import type { WaveHandler, WaveConfig } from './createWave'

export const useLayoutEffect =
  typeof window !== 'undefined' && window.document
    ? React.useLayoutEffect
    : // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {}

export const useWave = (config: WaveConfig, ref?: unknown) => {
  const { frequency, amplitude, phase, speed, offset, color } = config

  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const handler = React.useRef<WaveHandler>()

  useLayoutEffect(() => {
    if (!handler.current) {
      handler.current = createWave(canvasRef.current!, {
        frequency,
        amplitude,
        phase,
        speed,
        offset,
        color,
      })
      handler.current.start()
    } else {
      handler.current.setConfig({
        frequency,
        amplitude,
        phase,
        speed,
        offset,
        color,
      })
    }
    return () => {
      handler.current?.stop()
    }
  }, [amplitude, color, frequency, offset, phase, speed])

  useLayoutEffect(() => {
    if (typeof ref === 'function') {
      ref(handler.current)
      return () => {
        ref(null)
      }
    } else if (typeof ref === 'object' && ref !== null && 'current' in ref) {
      ref.current = handler.current
      return () => {
        ref.current = null
      }
    }
  }, [])

  return [canvasRef, handler] as const
}
