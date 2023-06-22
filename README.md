# Motion Wave 🌊

![npm bundle size](https://img.shields.io/bundlephobia/minzip/motion-wave)

---

English | [简体中文](./README-zh_CN.md)

Out-of-the-box, an easy way to animate your waves 🤩

[**demo**](https://zhangyu1818.github.io/motion-wave/)

## Features ✨

- The wave component is used directly!
- Smooth animations to give your waves more texture!
- Create waves through Hook for more customization!
- Not using React? It's available for vanilla JavaScript as well!

## Install 📦

```shell
pnpm install motion-wave
```

## WaveConfig parameters

**frequency**

- type: `number`
- wave cycle

**amplitude**

- type: `number`
- wave height

**phase**

- type: `number`
- wave horizontal position

**speed**

- type: `number`
- Wave animation speed

**offset**

- type: `number`
- wave vertical position

**color**

- type: `string`
- wave color

## Component usage

**`<Wave />`**

```jsx
function App() {
  return (
    <Wave
      width={innerWidth}
      height={innerHeight}
      frequency={0.5}
      amplitude={200}
      color='#FF7F50'
    />
  )
}
```

**`<MotionWave />`**

[![Edit dreamy-booth-tw5w5k](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/dreamy-booth-tw5w5k?fontsize=14&hidenavigation=1&theme=dark)

```jsx
function App() {
  return (
    <MotionWave
      width={innerWidth}
      height={innerHeight}
      initialConfig={{
        frequency: 0.8,
        amplitude: 200,
        speed: 1,
        color: '#FF7F50',
      }}
      motionConfig={{
        frequency: {
          value: 0.2,
          duration: 5,
          type: 'tween',
          ease: 'easeOut',
        },
        amplitude: {
          value: 150,
          duration: 3,
        },
        speed: {
          value: 5,
          duration: 8,
        },
        color: {
          value: '#00A86B',
          duration: 6,
        },
      }}
    />
  )
}
```

For detailed configuration of `MotionConfig`, please refer to [from-to](https://github.com/zhangyu1818/from-to).

## Hook

```
useWave(config:WaveConfig, ref?: unknown)
```

Example:

```jsx
const Wave = props => {
  const [canvasRef, handler] = useWave(props)

  return (
    <div>
      <button onClick={() => handler.current.stop()}>stop</button>
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  )
}
```

## createWave for Vanilla JavaScript

```
createWave(canvas: HTMLCanvasElement, config: WaveConfig)
```

Example:

```js
const handler = createWave(document.querySelector('#canvas'), {
  frequency: 1,
  amplitude: 200,
})
```

## LICENSE

[MIT License](https://github.com/zhangyu1818/motion-wave/blob/main/LICENSE)

---

Made with ❤️‍🩹 in Chengdu
