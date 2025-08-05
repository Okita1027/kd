---
title: Zustand
shortTitle: Zustand
description: 
date: 2024-06-16 22:29:35
categories: [前端,React]
tags: []
---

# Zustand(旧)

[ZUSTAND 中文文档 | ZUSTAND](https://awesomedevin.github.io/zustand-vue/)

## 快速上手

安装依赖：`npm i zustand`

```jsx
import { create } from "zustand";

const useStore = create((set) => {
    return {
        count: 1,
        inc: () => {
            set((state) => ({ count: state.count + 1 }));
        },
        dec: () => {
            set((state) => ({ count: state.count - 1 }));
        },
    };
});

export default useStore;
```

```jsx
import useCounterStore from "./store/useCounterStore";

function App() {
    const { count, inc, dec } = useCounterStore();
    return (
        <div>
            <button onClick={dec}>-</button>
            {count}
            <button onClick={inc}>+</button>
        </div>
    );
}

export default App;
```

## 异步支持

对于异步操作的支持不需要特殊的操作，直接在函数中编写异步逻辑，最后把接口的数据放到set函数中返回即可

```jsx
import { create } from "zustand";

const URL = "http://geek.itheima.net/v1_0/channels";

const useChannelStore = create((set) => {
    return {
        channelList: [],
        fetchChannelList: async () => {
            const res = await fetch(URL);
            const jsonData = await res.json();
            set({ channelList: jsonData.data.channels });
        },
    };
});

export default useChannelStore;
```

```jsx
import { useEffect } from "react";
import useChannelStore from "./store/useChannelStore";

function App() {
    const { channelList, fetchChannelList } = useChannelStore();

    useEffect(() => {
        fetchChannelList();
    }, [fetchChannelList]);
    return (
        <div>
            <ul>
                {channelList.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
```

## 切片模式

切片模式(Slice Pattern)是一种组织和模块化状态管理逻辑的方式,它可以更好地将复杂的状态划分为多个独立的"切片"。这种模式有助于提高代码的可维护性、可重用性和可测试性。

```jsx
const URL = "http://geek.itheima.net/v1_0/channels";

const useChannelStore = (set) => {
    return {
        channelList: [],
        fetchChannelList: async () => {
            const res = await fetch(URL);
            const jsonData = await res.json();
            set({ channelList: jsonData.data.channels });
        },
    };
};

export default useChannelStore;
```

```jsx
const useCounterStore = (set) => {
    return {
        count: 1,
        inc: () => {
            set((state) => ({ count: state.count + 1 }));
        },
        dec: () => {
            set((state) => ({ count: state.count - 1 }));
        },
    };
};

export default useCounterStore;
```

```jsx
import { create } from "zustand";

import useCounterStore from "./useCounterStore";
import useChannelStore from "./useChannelStore";

const useStore = create((set, get) => ({
    ...useCounterStore(set, get),
    ...useChannelStore(set, get),
}));

export default useStore;
```

## 对接DevTools

> 简单的调试我们可以安装一个 名称为 simple-zustand-devtools 的调试工具

1. 安装

`npm i simple-zustand-devtools -D`

2. 配置

```jsx
import create from 'zustand'
// 导入核心方法
import { mountStoreDevtool } from 'simple-zustand-devtools'

// 省略部分代码...

// 开发环境开启调试
if (process.env.NODE_ENV === 'development') {
    mountStoreDevtool('channelStore', useChannelStore)
}

export default useChannelStore
```

3. 使用

![img](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/react/202406171508204.png)

# Zustand(新)

> [简介 | Zustand 中文网](https://zustand.nodejs.cn/docs/getting-started/introduction)

**Zustand** 是一个用于 React 应用的状态管理库，它的名字在德语中意思是“状态”。

与其他大型状态管理库（如 Redux）相比，Zustand 的主要特点是：

- **极简的 API**：它没有 Redux 那样复杂的 `action`、`reducer`、`middleware` 等概念。你只需一个函数就能创建并管理你的状态。
- **不使用 Context API**：Zustand 通过 Hook 的方式在组件外部创建状态，然后直接在组件内部使用，这避免了 React Context 带来的重新渲染问题，因为它只在状态真正变化时才会通知组件更新。
- **无样板代码**：告别了大量的配置文件和繁琐的设置。创建一个 Zustand store 非常简单，就像写一个 JavaScript 对象一样。
- **响应式**：它会订阅你的组件，当状态发生改变时，只有使用了该状态的组件才会重新渲染，而不是整个应用。

## 快速上手

Zustand 的工作方式非常简单，主要围绕一个核心概念：**Store（状态仓库）**。

### 基本使用

1. 创建 Store

你使用 `create` 函数来创建一个 store。这个函数接收一个回调，其中包含 `set` 和 `get` 两个方法。

- `set`：用于更新状态。你可以传递一个新状态对象，或者一个接收当前状态作为参数的函数来更新状态。
- `get`：用于获取当前状态。

```JS
// stores/counterStore.js
import { create } from 'zustand';

// 创建一个名为 useCounterStore 的 Hook
const useCounterStore = create((set, get) => ({
  count: 0,
  // 定义更新 count 的方法
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  // 也可以访问其他状态来更新
  reset: () => set({ count: 0 }),
}));

export default useCounterStore;
```

2. 在组件中使用store

在组件中，你可以直接像使用 React Hook 一样使用你创建的 `useCounterStore`。

- **选择性订阅**：你可以选择性地订阅你需要的状态，而不是整个 store。这是 Zustand 高效渲染的关键。
- **两种获取状态的方式**：
  1. **直接获取**：像 `const { count, increment } = useCounterStore();` 这样。
  2. **函数选择器**：推荐使用这种方式，因为它能确保只有当选定的状态变化时，组件才会重新渲染。

```JSX
// components/Counter.jsx
import React from 'react';
import useCounterStore from '../stores/counterStore';

function Counter() {
  // 使用函数选择器只获取 count，当 count 变化时才重新渲染
  const count = useCounterStore(state => state.count);
  const increment = useCounterStore(state => state.increment);
  const decrement = useCounterStore(state => state.decrement);

  return (
    <div>
      <h2>计数器: {count}</h2>
      <button onClick={increment}>加 1</button>
      <button onClick={decrement}>减 1</button>
    </div>
  );
}

export default Counter;
```

### 异步操作

可以在 Store 中定义一个异步函数，然后直接在组件中调用它。

```TS
import { create } from 'zustand';

interface BearState {
  bears: number;
  fetchBears: () => Promise<void>;
}

const useBearStore = create<BearState>((set) => ({
  bears: 0,
  fetchBears: async () => {
    // 假设这是一个异步 API 调用
    const response = await fetch('https://api.example.com/bears');
    const data = await response.json();
    set({ bears: data.count });
  },
}));
```



## 指南

### 更新状态

| 更新方式                 | 行为说明                     |
| ------------------------ | ---------------------------- |
| `set({ key: val })`      | ✅ 扁平更新，浅层合并         |
| `set((state) => ...)`    | ✅ 推荐方式，适合依赖当前状态 |
| `set({ user: { ... } })` | ⚠️ 替换整个对象，注意深合并   |

#### 扁平更新

“**扁平更新**”指的是用 `set` 方法更新状态时，**直接传入对象**（而不是嵌套地合并）来修改状态。这种方式类似于 React 的 `useState` 的行为，会浅层合并原有状态和新状态。

```TS
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,
  title: 'Zustand',
  setCount: (count) => set({ count }),         // 👈 扁平更新
  setTitle: (title) => set({ title }),         // 👈 扁平更新
}))
```

```TSX
function Counter() {
  const { count, setCount } = useStore()
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}
```

`set({ count })` 只是更新 `count` 字段，其他字段（比如 `title`）会保留。

#### 深度嵌套对象

##### 正常方法

与 React 或 Redux 类似，正常方法是复制状态对象的每一级。这是通过扩展运算符 `...` 完成的，并通过手动将其与新状态值合并。

```TS
  normalInc: () =>
    set((state) => ({
      deep: {
        ...state.deep,
        nested: {
          ...state.deep.nested,
          obj: {
            ...state.deep.nested.obj,
            count: state.deep.nested.obj.count + 1
          }
        }
      }
    })),
```

##### 使用Immer

```TS
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

const useStore = create(
  immer((set) => ({
    user: {
      name: 'Tom',
      address: {
        city: 'Shanghai',
        zip: '200000'
      }
    },
    updateCity: (city) =>
      set((state) => {
        state.user.address.city = city // ✅ 类似直接修改，内部自动生成不可变数据
      })
  }))
)
```

##### 使用optics-ts

专门用于在 **TypeScript 中安全访问和更新深度嵌套对象**

```TS
import { optics, set } from 'optics-ts'

type State = {
  user: {
    address: {
      city: string
      zip: string
    }
  }
}

const state: State = {
  user: {
    address: {
      city: 'Shanghai',
      zip: '200000'
    }
  }
}

const cityOptic = optics<State>().user.address.city

const newState = set(cityOptic)(state, 'Beijing')

// newState = { user: { address: { city: 'Beijing', zip: '200000' } } }
```

在Zustand中的用法：

```TS
const useStore = create((set) => ({
  state: { user: { address: { city: 'Shanghai' } } },
  setCity: (city) =>
    set((s) => ({
      state: set(optics<typeof s>().state.user.address.city)(s, city),
    })),
}))
```

##### 使用Ramda

Ramda 是一个通用的函数式编程库，目标是让数据变换更声明式、更纯粹。

```TS
import * as R from 'ramda'

const state = {
  user: {
    address: {
      city: 'Shanghai',
      zip: '200000'
    }
  }
}

// 访问
R.path(['user', 'address', 'city'], state) // => 'Shanghai'

// 更新
const newState = R.assocPath(['user', 'address', 'city'], 'Beijing', state)

```

### 不可变状态与合并

#### 不可变更新

与 React 的 `useState` 一样，我们需要不可变地更新状态。

这是一个典型的例子：

```TS
import { create } from 'zustand'

const useCountStore = create((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 })),
}))
```

`set` 函数用于更新存储中的状态。因为状态是不可变的，所以应该是这样的：

```JS
set((state) => ({ ...state, count: state.count + 1 }))
```

但是，由于这是一种常见模式，`set` 实际上合并了状态，我们可以跳过 `...state` 部分：

```JS
set((state) => ({ count: state.count + 1 }))
```

#### 浅合并

当你调用 `set(newState)` 或者 `set(callback)` 时，Zustand 默认会**浅合并**你提供的新状态对象和旧状态对象。这意味着它会用新对象中的属性来覆盖旧对象中的同名属性，而保留旧对象中没有在新对象中出现的属性。

```TS
import { create } from 'zustand';

interface State {
  count: number;
  theme: 'light' | 'dark';
}

const useStore = create<State>((set) => ({
  count: 0,
  theme: 'light',
  // 这里的 set 函数默认会合并
  setTheme: (newTheme: 'light' | 'dark') => set({ theme: newTheme }),
}));
```

当你调用 `useStore.getState().setTheme('dark')` 时，`set` 内部收到的对象是 `{ theme: 'dark' }`。Zustand 会将它与旧状态 `{ count: 0, theme: 'light' }` 进行合并，结果是 `{ count: 0, theme: 'dark' }`。**`count` 属性被保留了，这就是浅合并。**

#### 覆盖合并

`set((state) => newState, true)`。

`set` 的第二个参数是一个可选的布尔值。当这个参数被设为 `true` 时，它会**关闭**Zustand 的默认浅合并行为，转而执行**完全覆盖**。

- `set(newState, false)` **(或不传，默认)**：执行**浅合并**，保留旧状态中未被新状态覆盖的属性。
- `set(newState, true)`：执行**完全覆盖**，旧状态会被 `newState` 完全替换，任何未包含在 `newState` 中的属性都会丢失。

```TS
const useStore = create<State>((set) => ({
  count: 0,
  theme: 'light',
  // 这是一个会覆盖整个状态的函数
  setCountAndTheme: (newCount: number, newTheme: 'light' | 'dark') => {
    // 这里的第二个参数设为 true，表示完全覆盖旧状态
    set({ count: newCount, theme: newTheme }, true);
  },
}));

// 假设我们这样使用
const store = useStore.getState();

// 原始状态: { count: 0, theme: 'light' }
console.log(store.count, store.theme); // 0, 'light'

// 调用 set({ theme: 'dark' }, true)
store.set({ theme: 'dark' }, true);

// 此时，count 属性会丢失，因为新状态没有包含它
// 新状态: { theme: 'dark' }
console.log(store.count, store.theme); // undefined, 'dark'
```

在这个例子中，因为我们使用了 `set({ theme: 'dark' }, true)`，Zustand 不会去合并 `count` 属性，而是直接用 `{ theme: 'dark' }` 替换了整个 Store 的状态，导致 `count` 消失了。

### 自动生成选择器

扁平结构：可以自动生成 selector（性能高）

嵌套结构：配合 `optics-ts`、`immer` 做不可变更新，selector 还是手动写清晰些

使用工具自动生成，不影响 devtools、调试体验

### 重置状态

Zustand 没有 `reset()` 内置函数，但你可以通过保留 `initialState` 来实现“安全、稳定、类型友好”的状态重置。

#### 手动保存初始状态并提供reset方法

```TS
import { create } from 'zustand'

const initialState = {
  count: 0,
  user: {
    name: '',
    age: 0
  }
}

const useStore = create((set) => ({
  ...initialState,

  // 你可以更新 state
  increment: () => set((state) => ({ count: state.count + 1 })),

  // 自定义 reset 方法
  reset: () => set(initialState)
}))
```

```TS
const reset = useStore((state) => state.reset)
reset()  // 会重置为 initialState
```

#### 结合`getState()`实现更灵活的reset

```TS
const useStore = create((set, get) => {
  const initial = {
    count: 0,
    user: { name: '', age: 0 }
  }

  return {
    ...initial,
    increment: () => set({ count: get().count + 1 }),
    reset: () => set(initial)  // 从闭包中取 initial
  }
})
```

#### `zustand-reset`中间件

[zustand-reset](https://github.com/pmndrs/zustand/discussions/1221) 是社区方案，适合大型 store 的模块化重置，或者使用多 store 的场景，不推荐在简单项目中使用。

#### 创建store时动态保存初始状态

```TS
const useStore = create((set, get) => {
  const initial = {
    count: 0,
    user: { name: '', age: 0 }
  }

  return {
    ...initial,
    reset: () => set(() => ({ ...initial }))
  }
})
```

### 使用props初始化状态

**使用 props 初始化状态** 是指在 React 组件中，利用从父组件传递下来的 **props** 作为组件内部 **state** 的初始值。

当一个组件第一次被创建并挂载到 DOM 上时，它会从父组件那里接收一组数据（即 props），然后将其中一部分或全部数据赋值给自己的内部状态。

#### 作用

这种模式的核心价值在于**状态的独立性**，它将外部数据（props）和内部数据（state）分离开来。

1. **提供了初始值**：这是最直接的用途。你不需要在组件内部硬编码初始数据，而是让父组件灵活地决定初始状态是什么。这使得组件更加通用和可复用。
2. **隔离了状态变化**：一旦状态被初始化，它就独立于 props。即使父组件后续重新渲染并传递了不同的 props，子组件的内部状态也不会自动更新。这有效地防止了父组件的改变意外地影响子组件的内部状态。
3. **支持内部状态管理**：这种模式让组件可以独立地处理用户交互。例如，一个表单组件从 props 接收初始值，但之后用户的输入只改变表单内部的状态，不会反向影响父组件。

简而言之，它允许你创建一个**可控的、有初始值的、但之后可以自由变化的组件**。

#### 使用场景

1. 创建有初始值的表单组件

当你需要创建一个表单，其输入框或选择器的初始值由外部数据决定时。用户在表单中的任何输入都会改变内部状态，但不会影响外部数据。

**例子**：一个编辑用户资料的表单。

```TS
// 父组件提供初始数据
<UserEditForm userData={{ name: "Alice", email: "alice@example.com" }} />

// UserEditForm 内部，使用 userData 初始化表单状态
const [name, setName] = useState(userData.name);
const [email, setEmail] = useState(userData.email);
```

2. 实现一个可以被用户修改的计数器或开关

当一个组件需要一个由父组件决定的初始值，但之后可以独立地由用户交互来改变其值时。

**例子**：一个点赞按钮组件。

```TS
// 父组件提供初始点赞数
<LikeButton initialCount={100} />

// LikeButton 内部，使用 initialCount 初始化状态
const [count, setCount] = useState(initialCount);
// 用户点击后，count 会独立地增加，不再受 initialCount 变化的影响
```

3. 将数据从“受控”转为”非受控”

这种模式常用于将一个**受控组件**（状态由父组件完全控制）转换为一个**非受控组件**（状态由自己内部管理）。组件的初始状态是受控的，但之后的行为是独立的。

**例子**：一个具有可拖动边界的面板。

```TS
// 父组件决定面板的初始位置
<ResizablePanel initialWidth={200} />

// ResizablePanel 内部，使用 initialWidth 初始化状态
const [width, setWidth] = useState(initialWidth);
// 之后用户拖动面板时，width 只会在内部变化
```

#### 示例

一个 `UserProfile` 组件，它从父组件接收 `initialName` 和 `initialAge` 作为 props。

```TS
// 父组件
<UserProfile initialName="Alice" initialAge={30} />
```

在 `UserProfile` 内部，它会将这两个 props 的值赋给自己的状态。

```TS
import React, { useState } from 'react';

interface UserProfileProps {
  initialName: string;
  initialAge: number;
}

function UserProfile({ initialName, initialAge }: UserProfileProps) {
  // 使用 props 的值作为 useState 的初始值
  const [name, setName] = useState<string>(initialName);
  const [age, setAge] = useState<number>(initialAge);

  // ... 之后组件内部可以独立地修改 name 和 age
}
```



### 切片模式

当你的状态越来越复杂，Zustand 的 store 会变得臃肿。切片模式的目的就是：

| 优点           | 描述                                          |
| -------------- | --------------------------------------------- |
| ✅ 模块化       | 把状态拆成小的 slice，每个 slice 专注一个功能 |
| ✅ 可读性更高   | 每个模块职责单一，便于维护                    |
| ✅ 支持类型提示 | 类型推导清晰，不容易出错                      |
| ✅ 可组合       | 多个 slice 合并成一个大的 store               |

**使用流程：**

1. 定义每个Slice（模块）

```TS
// slices/counterSlice.ts
export interface CounterSlice {
  count: number
  increment: () => void
}

export const createCounterSlice = (set): CounterSlice => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
})
```

```TS
// slices/userSlice.ts
export interface UserSlice {
  user: { name: string }
  setUser: (user: { name: string }) => void
}

export const createUserSlice = (set): UserSlice => ({
  user: { name: '' },
  setUser: (user) => set({ user })
})
```

2. 组合多个Slice生成一个Store

```TS
// store/index.ts
import { create } from 'zustand'
import { createCounterSlice, CounterSlice } from './slices/counterSlice'
import { createUserSlice, UserSlice } from './slices/userSlice'

// 通过联合类型合并多个 slice 成完整 AppState
type AppState = CounterSlice & UserSlice

export const useStore = create<AppState>()((set) => ({
  ...createCounterSlice(set),
  ...createUserSlice(set),
}))
```

3. 使用

```TS
const count = useStore((s) => s.count)
const increment = useStore((s) => s.increment)

const user = useStore((s) => s.user)
const setUser = useStore((s) => s.setUser)
```

### `useShallow`防止重新渲染

#### 重新渲染

**重新渲染**指的是 React 组件因为某些变化而再次执行其渲染函数（即函数组件的整个函数体）。这个过程会生成新的虚拟 DOM（Virtual DOM）树，然后 React 会将新的虚拟 DOM 与旧的进行比较，找出差异，最后只更新真实 DOM 中发生变化的部分。

重新渲染的主要触发条件有三个：

1. **状态（State）变化**：组件内部的状态 (`useState`) 发生变化。
2. **属性（Props）变化**：父组件重新渲染时，向子组件传递了新的属性。
3. **上下文（Context）变化**：组件订阅的 React Context 发生变化。

在大多数情况下，重新渲染是 React 保持 UI 与数据同步的正常工作机制。但如果重新渲染过于频繁，或者渲染了本不需要更新的组件，就会造成不必要的性能开销，导致应用卡顿。

**一个常见的性能问题是：** 当一个组件订阅了 Zustand Store 的所有状态，而 Store 中只有一个不相关的属性改变时，该组件也会重新渲染。即使它只使用了 Store 中的一小部分数据，但因为整个 Store 对象的引用改变了，它仍会被通知更新。

#### 使用方法

`useShallow`作用是**只在状态的浅层内容发生变化时才触发组件重新渲染**。它通过执行**浅比较**来优化性能。

假设 Zustand Store 的状态是 `{ count: 0, theme: 'light' }`。

- **第一次渲染**：选择器返回 `{ count: 0 }`。组件正常渲染。
- **Store 状态变为 `{ count: 0, theme: 'dark' }`**：
  - 选择器再次执行，返回 `{ count: 0 }`。
  - `useShallow` 将 `{ count: 0 }` 与上一次返回的 `{ count: 0 }` 进行浅比较。
  - 因为 `count` 的值没有变化，`useShallow` 判断它们是相等的，所以**阻止了组件重新渲染**。
- **Store 状态变为 `{ count: 1, theme: 'dark' }`**：
  - 选择器再次执行，返回 `{ count: 1 }`。
  - `useShallow` 将 `{ count: 1 }` 与上一次返回的 `{ count: 0 }` 进行浅比较。
  - 因为 `count` 的值变了，`useShallow` 判断它们不相等，所以**允许组件重新渲染**。

使用 `useShallow` 的语法非常简单，你只需将选择器函数包裹在 `useShallow` 中即可:

```TSX
import React from 'react';
import { create } from 'zustand';
import { useShallow } from 'zustand/react'; // 从 zustand/react 导入 useShallow

// 假设我们的 Store 有多个属性
interface MyState {
  count: number;
  theme: 'light' | 'dark';
  user: {
    name: string;
  };
}

const useMyStore = create<MyState>(() => ({
  count: 0,
  theme: 'light',
  user: {
    name: 'Alice',
  },
}));

function MyComponent() {
  // 使用 useShallow，只选择 count 和 user.name
  // 当 theme 变化时，这个组件不会重新渲染
  // 当 user.name 变化时，这个组件会重新渲染
  // 当 count 变化时，这个组件会重新渲染
  const { count, userName } = useMyStore(
    useShallow((state) => ({
      count: state.count,
      userName: state.user.name,
    })),
  );
  
  console.log('MyComponent 重新渲染了！');

  return (
    <div>
      <p>计数: {count}</p>
      <p>用户名: {userName}</p>
    </div>
  );
}
```



## API



## 钩子



## 中间件

### combine

`combine` 中间件是 Zustand 提供的一个实用工具，它的主要作用是**将状态（State）和方法（Actions/Methods）分开定义，然后将它们组合成一个完整的 Store 对象**。这使得状态和逻辑的组织更加清晰，尤其是在 TypeScript 环境下，能提供更好的类型推断和代码可读性。

#### 问题引入

`combine` 旨在解决一个特定的 TypeScript 痛点：当你在 `create` 函数中定义状态和方法时，所有属性都混在一起。

```TSX
// 没有使用 combine 的代码
import { create } from 'zustand';

interface MyState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

const useMyStore = create<MyState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
```

在这个例子中，`count` 和 `increment` 属于同一个对象，但它们的角色不同（一个表示状态，一个表示方法）。当 Store 变得复杂时，这种模式会使代码变得难以管理。

`combine` 中间件通过一种更结构化的方式来解决这个问题：

```TS
const nextStateCreatorFn = combine(initialState, additionalStateCreatorFn)
```

1. **它接收一个初始状态对象。**
2. **它接收一个返回方法的函数。**
3. **它将两者合并成一个 Store 对象。**

#### 基本用法

```TSX
import { create } from 'zustand';
import { combine } from 'zustand/middleware';

// 1. 定义状态的类型
interface State {
  count: number;
  text: string;
}

// 2. 定义方法的类型
interface Actions {
  increment: () => void;
  setText: (newText: string) => void;
}

// 3. 将状态和方法合并
type MyStore = State & Actions;

// 4. 创建 Store
const useMyStore = create<MyStore>(
  // 使用 combine 中间件
  combine<State, Actions>(
    // 第一个参数：初始状态
    {
      count: 0,
      text: 'hello',
    },
    // 第二个参数：返回方法的函数，它接收 set 和 get 作为参数
    (set) => ({
      increment: () => set((state) => ({ count: state.count + 1 })),
      setText: (newText: string) => set({ text: newText }),
    })
  )
);
```

#### 结合切片使用

```TSX
// slices/counterSlice.ts
import { StateCreator } from 'zustand';
import { combine } from 'zustand/middleware';

// 状态类型
interface CounterState {
    count: number;
}

// 方法类型
interface CounterActions {
    increment: () => void;
}

// 切片函数
export const createCounterSlice: StateCreator<
    CounterState & CounterActions, // 整个切片的类型
    [['zustand/combine', CounterState, CounterActions]] // combine 的类型参数
> = combine<CounterState, CounterActions>(
    // 初始状态
    {
        count: 0,
    },
    // 方法
    (set) => ({
        increment: () => set((state) => ({ count: state.count + 1 })),
    })
);


// store/useAppStore.ts
import { create } from 'zustand';
import { createCounterSlice } from './slices/counterSlice';
import { createAuthSlice } from './slices/authSlice';

// 组合所有切片的类型
type AppState = CounterState & CounterActions & AuthState & AuthActions;

const useAppStore = create<AppState>()((...a) => ({
    ...createCounterSlice(...a),
    ...createAuthSlice(...a),
}));
```

A. `StateCreator<CounterState & CounterActions, ...>`

- **`StateCreator`** 是 Zustand 提供的核心类型，用于创建 Store 或切片。它的完整类型签名是 `StateCreator<T, A, B, C>`，其中：
  - `T`：最终 Store 的**状态类型**。
  - `A`、`B`、`C`：可选的中间件类型参数。
- 在这里，`T` 是 `CounterState & CounterActions`。这行代码告诉 TypeScript：
  - 最终创建的 Store 对象将同时包含 `CounterState` 中定义的所有属性（`count: number`）。
  - 以及 `CounterActions` 中定义的所有属性（`increment: () => void`）。
- 这是对最终 Store 形状的一个**整体描述**。

B. `[['zustand/combine', CounterState, CounterActions]]`

- 这是 `StateCreator` 的第二个类型参数，它是一个**中间件的类型元组**。
- 这个类型元组的格式是 `[['中间件名称', 类型1, 类型2, ...]]`。它的作用是告诉 TypeScript，这个 `StateCreator` 将**被哪个中间件包装**，以及该中间件的**类型参数是什么**。
- 在这里，`[['zustand/combine', CounterState, CounterActions]]` 告诉 TypeScript：
  1. 这个 `StateCreator` 将被 `zustand/combine` 中间件所包装。
  2. `combine` 中间件接收两个类型参数，分别是 `CounterState` 和 `CounterActions`。

### devtools



### immer

简化不可变的嵌套数据的修改

```TS
const nextStateCreatorFn = immer(stateCreatorFn)
```

### persist

`persist` 中间件的核心作用是**将你的 Store 状态持久化到浏览器中**，比如 `localStorage` 或 `sessionStorage`。这意味着即使你刷新页面，Store 的状态也不会丢失，而是会从持久化存储中自动恢复。

#### 问题引入

在没有 `persist` 中间件的情况下，当你的应用重新加载（比如用户刷新了页面），Zustand Store 会被重置为它的初始状态。这对于许多应用场景来说是不希望发生的，比如：

- **用户登录状态**：你希望用户登录后，即使刷新页面也保持登录状态。
- **购物车内容**：用户不小心关闭了页面，重新打开后购物车里的商品还在。
- **应用主题设置**：用户选择的深色主题，希望在下次访问时依然生效。

`persist` 中间件就是为了解决这些问题而生的。它为你自动处理了以下工作：

1. **保存状态**：当 Store 的状态发生变化时，它会自动将最新的状态保存到你指定的存储中（默认是 `localStorage`）。
2. **恢复状态**：当应用加载时，它会首先检查存储中是否有已保存的状态。如果有，它会用这个状态来初始化 Store，而不是使用默认的初始状态。
3. **异步恢复**：`persist` 是异步的，它允许你在状态恢复完成之前，显示一个加载状态，以防止 UI 闪烁。

#### 基本用法

最简单的用法是直接使用 `persist`，它会默认将状态以 Store 的名字作为键，存储在 `localStorage` 中：

```TSX
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  isLoggedIn: boolean;
  username: string;
  login: (name: string) => void;
  logout: () => void;
}

// 整个 Store 函数被包裹在 persist 中
const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      username: '',
      login: (name) => set({ isLoggedIn: true, username: name }),
      logout: () => set({ isLoggedIn: false, username: '' }),
    }),
    {
      // persist 的配置对象
      name: 'user-storage', // 在 localStorage 中的键名，必须唯一
    }
  )
);
```

- 当 `login` 方法被调用时，`isLoggedIn` 和 `username` 的新值会被自动保存到 `localStorage` 中，键名是 `'user-storage'`。
- 当页面刷新时，`useUserStore` 会首先检查 `localStorage`，发现 `'user-storage'` 存在，就会用里面的值来初始化 Store，而不是使用 `isLoggedIn: false, username: ''`。

#### 配置选项

[persist | Zustand 中文网](https://zustand.nodejs.cn/docs/middlewares/persist#persiststatecreatorfn)

- **`name`**: 必须的，存储的键名。
- **`storage`**: 可选，用于指定不同的存储引擎，比如 `sessionStorage`。

```TSX
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useCartStore = create<CartState>()(
  persist(
    (set) => ({ ... }),
    {
      name: 'cart-storage',
      // 使用 sessionStorage 而不是默认的 localStorage
      storage: createJSONStorage(() => sessionStorage), 
    }
  )
);
```

- **`partialize`**: 可选，用于**只选择 Store 中的部分状态**进行持久化。这在你不希望所有状态都被保存时非常有用。

```TSX
const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      showModal: false, // 这个状态不希望被持久化
      // ...
    }),
    {
      name: 'settings-storage',
      // 只持久化 theme 状态
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
```

- **`onRehydrateStorage`**: 可选，当状态从存储中恢复时，可以执行一些逻辑。这常用于在状态恢复完成前显示一个加载状态。

```TSX
const useHydrationStore = create<HydrationState>()(
  persist(
    (set) => ({ hasHydrated: false, ... }),
    {
      name: 'hydration-storage',
      onRehydrateStorage: (state) => {
        console.log('开始从存储中恢复状态');
        // 返回一个函数，在恢复完成后调用
        return (state, error) => {
          if (error) {
            console.log('状态恢复失败', error);
          } else {
            console.log('状态恢复成功');
            state?.setHasHydrated(true); // 可以在这里更新一个加载状态
          }
        };
      },
    }
  )
);
```

---

| 选项         | 类型                                    | 说明                                                         |
| ------------ | --------------------------------------- | ------------------------------------------------------------ |
| `name`       | `string`                                | 存储的 key 名（必填）                                        |
| `storage`    | `Storage`                               | 默认是 `localStorage`，也可以用 `sessionStorage`、`AsyncStorage` |
| `partialize` | `(state) => any`                        | 持久化部分状态                                               |
| `version`    | `number`                                | 状态版本（配合 `migrate` 使用）                              |
| `migrate`    | `(persistedState, version) => newState` | 状态版本迁移函数                                             |
| `merge`      | `(persisted, current) => newState`      | 合并 persisted 和 fresh state 的逻辑                         |

### redux



### subscribeWithSelector

