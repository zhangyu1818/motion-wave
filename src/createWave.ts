import { animate, type Options as MotionOptions } from 'from-to.js'

export interface WaveConfig {
  frequency: number
  amplitude: number
  phase?: number
  speed?: number
  offset?: number
  color?: string
}

export type WaveHandler = ReturnType<typeof createWave>

type Clear = {
  current: null | (() => void)
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

export const createWave = (canvas: HTMLCanvasElement, config: WaveConfig) => {
  const waveConfigs: WaveConfig = { ...config }

  const clear: Clear = {
    current: null,
  }

  let distance = 0

  function draw() {
    stop()

    const {
      frequency,
      amplitude,
      phase = 0,
      speed = 1,
      offset = 0,
      color,
    } = waveConfigs

    const ctx = canvas.getContext('2d')!

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.beginPath()
    ctx.moveTo(0, canvas.height / 2)

    const offsetY = canvas.height / 2 + offset

    const calcY = (
      x: number,
      offsetY: number,
      amplitude: number,
      frequency: number,
      distance: number,
      phase: number
    ) =>
      offsetY +
      amplitude *
        Math.sin(
          ((2 * Math.PI * frequency) / 1000) * x + distance / 100 + phase
        )

    const step = clamp(canvas.width / 80 / frequency, 1, canvas.width)
    let lastX = 0
    let lastY = calcY(lastX, offsetY, amplitude, frequency, distance, phase)

    ctx.moveTo(lastX, lastY)

    for (let x = step; x < canvas.width; x += step) {
      const cp1X = lastX + (x - lastX) / 3
      const cp1Y = calcY(cp1X, offsetY, amplitude, frequency, distance, phase)

      const cp2X = x + (x - lastX) / 3
      const cp2Y = calcY(cp2X, offsetY, amplitude, frequency, distance, phase)

      ctx.bezierCurveTo(
        cp1X,
        cp1Y,
        cp2X,
        cp2Y,
        x,
        calcY(x, offsetY, amplitude, frequency, distance, phase)
      )

      lastX = x
      lastY = calcY(x, offsetY, amplitude, frequency, distance, phase)
    }

    const nextX = canvas.width
    const nextY = calcY(nextX, offsetY, amplitude, frequency, distance, phase)

    const cp1X = lastX + (nextX - lastX) / 3
    const cp1Y = calcY(cp1X, offsetY, amplitude, frequency, distance, phase)

    const cp2X = nextX - (nextX - lastX) / 3
    const cp2Y = calcY(cp2X, offsetY, amplitude, frequency, distance, phase)

    ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, nextX, nextY)

    ctx.lineTo(canvas.width, canvas.height)
    ctx.lineTo(0, canvas.height)
    ctx.closePath()

    ctx.fillStyle = color ?? getComputedStyle(canvas).fill
    ctx.fill()

    distance += speed

    const handle = requestAnimationFrame(draw)

    clear.current = () => cancelAnimationFrame(handle)
  }

  function stop() {
    clear.current?.()
  }

  function setConfig(config: Partial<WaveConfig>) {
    Object.assign(waveConfigs, config)
  }

  function motionTo<K extends keyof WaveConfig>(
    key: K,
    value: WaveConfig[K],
    options: MotionOptions<WaveConfig[K]>
  ) {
    const currentValue = waveConfigs[key] ?? value
    return animate(currentValue, value, {
      ...options,
      onUpdate(latest) {
        setConfig({ [key]: latest })
        options.onUpdate?.(latest)
      },
    })
  }

  function reset() {
    Object.assign(waveConfigs, config)
    distance = 0
  }

  function resize(width: number, height: number) {
    canvas.width = width
    canvas.height = height
  }

  return {
    start: () => draw(),
    setConfig,
    motionTo,
    stop,
    reset,
    resize,
    currentConfig: waveConfigs,
  }
}
