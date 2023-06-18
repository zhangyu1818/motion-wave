export const defaultConfig = {
  frequency: {
    value: 0.8,
    min: 0,
    max: 10,
    step: 0.01,
  },
  amplitude: {
    value: 200,
    min: 0,
    max: innerHeight / 2,
  },
  phase: {
    value: 0,
    step: 1,
  },
  offset: {
    value: 0,
    min: -innerHeight,
    max: innerHeight,
  },
  speed: {
    value: 1,
    step: 1,
  },
  color: {
    value: '#000',
  },
}
