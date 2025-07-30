### useId

`useId()`可以生成传递给无障碍属性的唯一ID:

```TSX
const id = useId()
```

> [!important]
>
> **不要使用 `useId` 来生成列表中的 key**。[key 应该由你的数据生成](https://zh-hans.react.dev/learn/rendering-lists#where-to-get-your-key)。

### useLayoutEffect

`useLayoutEffect` 的语法与 `useEffect` 完全相同：

```TSX
useLayoutEffect(setup, dependencies?);
```

- `setup`：这是一个函数，包含你想要执行的副作用逻辑。它可以返回一个可选的清理函数（cleanup function）。
- `dependencies` (可选)：一个依赖项数组。只有当数组中的任何一个值发生变化时，`setup` 函数才会重新执行。

| 特性     | useLayoutEffect                                              | useEffect                                                    |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 执行时机 | DOM 更新后，浏览器绘制前（同步执行，会阻塞浏览器绘制）       | DOM 更新后，浏览器绘制后（异步执行，不会阻塞浏览器绘制）     |
| 主用途   | 需要读取 DOM 布局信息（如元素尺寸、位置、滚动条）并同步修改 DOM，以避免视觉闪烁或不一致。 | 处理大多数副作用，如数据获取、订阅、设置定时器、日志记录等。不涉及 DOM 测量或需要同步修改 DOM 的场景。 |
| 用户体验 | 如果内部操作耗时，可能导致页面卡顿或闪烁，因为它会阻塞浏览器的绘制流程。 | 通常更流畅，因为它不会阻塞浏览器绘制，用户能更快看到 UI 响应。 |

### useOptimistic

用于实现**乐观 UI 更新**：即用户操作立即反映到界面上（假装操作已经成功），然后再等待实际异步操作完成后同步数据。

在实际开发中，我们经常需要这样一种体验：

> 用户点击“点赞”按钮 → UI 立即+1 → 然后再异步发送请求 → 请求成功后确认更新

如果不使用乐观更新，用户要等请求返回，UI 才更新，体验很差。

**基本语法**

```TSX
const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
```

**参数**

- `state`：初始时和没有挂起操作时要返回的值。
- `updateFn(currentState, optimisticValue)`：一个函数，接受当前 `state` 和传递给 `addOptimistic` 的乐观值，并返回结果乐观状态。它必须是一个纯函数。`updateFn` 接受两个参数：`currentState` 和 `optimisticValue`。返回值将是 `currentState` 和 `optimisticValue` 的合并值。

**返回值**

- `optimisticState`：结果乐观状态。除非有操作挂起，否则它等于 `state`，在这种情况下，它等于 `updateFn` 返回的值。
- `addOptimistic`：触发乐观更新时调用的 dispatch 函数。它接受一个可以是任何类型的参数 `optimisticValue`，并以 `state` 和 `optimisticValue` 作为参数来调用 `updateFn`。

### useTransition

`useTransition` 是一个 Hook，它允许你将某些状态更新标记为**“过渡（Transitions）”**。

- **紧急更新（Urgent Updates）**：用户交互相关的更新，比如输入框的打字、点击按钮后的即时反馈，这些更新应该立即响应，保持 UI 的流畅性。
- **过渡更新（Transition Updates）**：非紧急的更新，例如在输入框输入后，根据输入内容过滤一个大型列表，或者点击一个选项卡后加载新数据。这些操作可能需要一些时间，如果立即处理，可能会导致 UI 卡顿。

`useTransition` 的核心思想：**让 React 知道哪些状态更新可以放在后台执行，不阻塞用户的紧急交互。** 当一个过渡更新正在进行时，它不会阻止浏览器响应其他紧急更新（比如用户的输入），从而保持应用的响应性。

**基本语法**

```TSX
const [isPending, startTransition] = useTransition()
```

`useTransition` 没有参数，返回一个包含两个元素的数组：

1. **`isPending`** (boolean): 一个布尔值，指示当前是否有**待处理的过渡更新**。
2. **`startTransition`** (function): 一个函数，你用来**包裹**你想要标记为过渡的状态更新。

**示例代码**

```TSX
import React, { useState, useTransition } from 'react';

function MyComponent() {
  const [isPending, startTransition] = useTransition(); // 获取 isPending 状态和 startTransition 函数
  const [inputValue, setInputValue] = useState(''); // 紧急状态：用于输入框
  const [displayValue, setDisplayValue] = useState(''); // 过渡状态：用于显示搜索结果等耗时操作

  const handleChange = (e) => {
    // 1. 紧急更新：立即更新输入框的值，保持响应
    setInputValue(e.target.value);

    // 2. 过渡更新：将耗时的操作包裹在 startTransition 中
    startTransition(() => {
      // 在这里执行可能耗时的状态更新，React 会将其视为低优先级
      setDisplayValue(e.target.value);
    });
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue} // 绑定到紧急状态，保证输入流畅
        onChange={handleChange}
        placeholder="快速输入，观察性能..."
      />
      {isPending && <div style={{ color: 'gray' }}>Loading results...</div>} {/* 当有过渡更新时显示加载状态 */}
      <hr />
      {/* displayValue 的更新可能滞后于 inputValue，但不会阻塞输入 */}
      <ComplexDisplay value={displayValue} />
    </div>
  );
}

// 模拟一个渲染开销较大的组件
function ComplexDisplay({ value }) {
  const items = React.useMemo(() => {
    console.log(`--- Rendering ComplexDisplay for: "${value}" ---`);
    const list = [];
    for (let i = 0; i < 10000; i++) { // 模拟大量计算
      list.push(<li key={i}>{value} - Item {i}</li>);
    }
    return list;
  }, [value]);

  return (
    <div>
      <h3>Displaying: "{value}"</h3>
      <ul>{items}</ul>
    </div>
  );
}
```

在上面的 `SearchComponent` 例子中：

1. 用户在 `<input>` 中打字：
   - `setInputValue(e.target.value)` 是一个**紧急更新**。输入框会立即响应，保持流畅的打字体验。
2. `startTransition(() => { setDisplayValue(e.target.value); })` 是一个**过渡更新**：
   - `setDisplayValue` 会触发 `ComplexDisplay` 组件的重新渲染，而这个组件模拟了一个耗时的操作。
   - 由于它被包裹在 `startTransition` 中，React 会将这个更新视为非紧急。
   - 如果用户在 `ComplexDisplay` 还在渲染旧值时继续快速打字，新的 `setInputValue` 会被优先处理，而 `ComplexDisplay` 的渲染可能会被中断或延迟，以确保输入框的响应性。
   - `isPending` 状态会在过渡开始时变为 `true`，并在过渡完成时变为 `false`，你可以用它来显示一个加载指示器，告诉用户后台有操作正在进行。
