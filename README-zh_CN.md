# Motion Wave 🌊

---

[English](./README-zh_CN.md) | 简体中文

开箱即用，简单的方式让你的波浪动起来 🤩

[**demo**](https://zhangyu1818.github.io/motion-wave/)

## 功能 ✨

- 波浪组件直接使用！
- 流畅的动画，让你的波浪更有质感！
- 通过 Hook 创建波浪，更具自定义！
- 不用 React？原生也能用！

## 安装 📦

```shell
pnpm install motion-wave
```

## WaveConfig 配置参数

**frequency**

- 类型：`number`
- 波浪周期

**amplitude**

- 类型: `number`
- 波浪高度

**phase**

- 类型: `number`
- 波浪水平位置

**speed**

- 类型: `number`
- 波浪动画速度

**offset**

- 类型: `number`
- 波浪上下位置

**color**

- 类型: `string`
- 波浪颜色

## 组件使用

**<Wave/ >**

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

**<MotionWave/ >**

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
          repeat: Infinity,
          repeatType: 'reverse',
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

`MotionConfig`的详细配置，请参阅[framer-motion](https://www.framer.com/motion/transition/)。

## Hook

```
useWave(config:WaveConfig, ref: unknown)
```

示例:

```jsx
const Wave = props => {
  const [canvasRef, handler] = useWave(props, ref)

  return (
    <div>
      <button onClick={() => handler.current.stop()}>stop</button>
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  )
}
```

## createWave 原生使用

```
createWave(canvas: HTMLCanvasElement, config: WaveConfig)
```

示例:

```js
const handler = createWave(document.querySelector('#canvas'), {
  frequency: 1,
  amplitude: 200,
})
```

## LICENSE

[MIT License](https://github.com/zhangyu1818/motion-wave/blob/main/LICENSE)
