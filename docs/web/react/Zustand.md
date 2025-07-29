---
title: Zustand
shortTitle: Zustand
description: 
date: 2024-06-16 22:29:35
categories: [前端,React]
tags: []
---

## Zustand

[ZUSTAND 中文文档 | ZUSTAND](https://awesomedevin.github.io/zustand-vue/)

### 快速上手

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

### 异步支持

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

### 切片模式

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

### 对接DevTools

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

## 
