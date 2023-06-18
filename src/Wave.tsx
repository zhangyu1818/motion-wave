import * as React from 'react'
import { useWave } from './hook'

import type { WaveConfig } from './createWave'

export type WaveProps = React.CanvasHTMLAttributes<HTMLCanvasElement> &
  WaveConfig

export const Wave = React.memo(
  React.forwardRef<unknown, WaveProps>((props, ref) => {
    const {
      width = innerWidth,
      height = innerHeight,
      frequency,
      amplitude,
      phase,
      speed,
      offset,
      color,
      ...restProps
    } = props

    const [canvasRef] = useWave(
      {
        frequency,
        amplitude,
        phase,
        speed,
        offset,
        color,
      },
      ref
    )

    return (
      <canvas ref={canvasRef} width={width} height={height} {...restProps} />
    )
  })
)
