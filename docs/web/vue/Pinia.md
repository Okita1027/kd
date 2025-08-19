---
title: Pinia
shortTitle: Pinia
description: Pinia
date: 2024-06-16 22:30:39
categories: [前端, Vue]
tags: [Vue]
---

## Pinia(2024)

### 搭建环境

1. 安装依赖`npm install pinia`
2. 操作`src/main.ts`

```typescript
import { createApp } from 'vue'
import App from './App.vue'

/* 引入createPinia，用于创建pinia */
import { createPinia } from 'pinia'

/* 创建pinia */
const pinia = createPinia()
const app = createApp(App)

/* 使用插件 */{}
app.use(pinia)
app.mount('#app')
```

3. 查看效果

![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/vue/202406171501322.png)

### 存储、读取数据

1.  `Store`是一个保存 **状态**、**业务逻辑** 的实体，每个组件都可以**读取、写入**它。 
2.  它有三个概念：`state`、`getter`、`action`，相当于组件中的： `data`、 `computed` 和 `methods`。 
3.  具体编码

```typescript
// 引入defineStore用于创建store
import {defineStore} from 'pinia'

// 定义并暴露一个store，钩子式命名use???Store
export const useCountStore = defineStore('count',{
  // 动作
  actions:{},
  // 状态
  state(){
    return {
      sum:6
    }
  },
  // 计算
  getters:{}
})
```

4. 组件中使用`state`属性

```vue
<template>
  <h2>当前求和为：{{ sumStore.sum }}</h2>	// 写法1
  <h2>当前求和为：{{ sumStore.$state.sum }}</h2>	// 写法2 
</template>

<script setup lang="ts" name="Count">
  // 引入对应的useXxxxxStore	
  import {useSumStore} from '@/store/sum'

  // 调用useXxxxxStore得到对应的store
  const sumStore = useSumStore()
</script>
```

### 修改属性

1.  第一种修改方式，直接修改 

```typescript
countStore.sum = 666
countSotre.$state.sum = 667
```

2.  第二种修改方式：批量修改 

```typescript
countStore.$patch({
  sum: 999,
  school: 'atguigu'
})
```

3.  第三种修改方式：借助`action`修改（`action`中可以编写一些业务逻辑） 

```typescript
import { defineStore } from 'pinia'

export const useCountStore = defineStore('count', {
  actions:{
    increment(value: number) {
      if (this.sum < 24) {
        this.sum += value;
      }
    },
    decrement(value: number) {
      if (this.sum > -12) {
        this.sum -= value;
      }
    }
  }
})
```

组件中调用`action`即可 

```javascript
// 使用countStore
const countStore = useCountStore()

// 调用对应action
function minus() {
  count.decrement(num.value)
}
```

### storeToRefs

- 借助`storeToRefs`将`store`中的数据转为`ref`对象，方便在模板中使用。

```vue
<template>
	<div class="count">
		<h2>当前求和为：{{sum}}</h2>
	</div>
</template>

<script setup lang="ts" name="Count">
  import { useCountStore } from '@/store/count'
  /* 引入storeToRefs */
  import { storeToRefs } from 'pinia'

	/* 得到countStore */
  const countStore = useCountStore()
  /* 使用storeToRefs转换countStore，随后解构 */
  const {sum} = storeToRefs(countStore)
</script>
```

#### toRefs

`toRefs` 函数来自 Vue 的响应式系统，它用于将一个响应式对象转换为一个普通对象，其中每个属性都是一个响应式引用。这通常在你想要将响应式对象的属性传递给独立的响应式属性时使用，保证它们保持响应性。
当你解构响应式对象时会丢失它的响应性，`toRefs` 可以帮助保持属性的响应性。

```javascript
import { reactive, toRefs } from 'vue';

const state = reactive({
  count: 0,
  title: 'Hello'
});

// 解构会丢失响应性
const { count, title } = state;

// 使用toRefs保持响应性
const { count, title } = toRefs(state);
```

在这个例子中，`toRefs` 允许你将 `state` 对象的每个属性转换为可以直接在 `setup` 函数以外单独使用的响应式引用。

#### storeToRefs

`storeToRefs` 是 Pinia 提供的一个函数，用于在组件中使用 Pinia store 时保留响应性。它类似于 `toRefs`，但专门为 Pinia store 设计。当你在组件中使用解构来获取 Pinia store 中的状态时，`storeToRefs` 确保每个解构出的状态都是响应式的。

```javascript
import { useMyStore } from '@/stores/myStore';
import { storeToRefs } from 'pinia';

const myStore = useMyStore();
const { count, title } = storeToRefs(myStore);
```

在这个例子中，`storeToRefs` 用于从 Pinia store 中获取响应式的 `count` 和 `title`。这样，当 `count` 和 `title` 在 store 中更新时，它们在组件中的引用也会更新。
总的来说，`toRefs` 用于 Vue 的响应式对象，而 `storeToRefs` 专门用于 Pinia store。二者都用于创建响应式引用，但它们的应用场景和所处理的对象类型不同。使用时应根据你的具体场景和状态管理的选择来决定使用哪一个。

### getters

1.  概念：当`state`中的数据，需要经过处理后再使用时，可以使用`getters`配置。 
2.  追加`getters`配置。

```typescript
// 引入defineStore用于创建store
import {defineStore} from 'pinia'

// 定义并暴露一个store
export const useCountStore = defineStore('count',{
  // 动作
  actions:{
    /************/
  },
  // 状态
  state(){
    return {
      sum:1,
      school:'atguigu'
    }
  },
  // 计算
  getters:{
    bigSum:(state):number => state.sum * 10,
    upperSchool():string{
      return this. school.toUpperCase()
    }
  }
})
```

3. 组件中读取数据

```typescript
let {sum,school,bigSum,upperSchool} = storeToRefs(countStore)
```

### $subscribe

#### 基本语法

通过 store 的 `$subscribe()` 方法侦听 `state` 及其变化

```typescript
multiDataStore.$subscribe((mutation, state) => {
  console.log('mutation->', mutation) // 本次修改的信息
  console.log('state->', state) // 真正的数据
})
```

#### localstorage案例（组合式）

localstorage是存储在本地的数据，即使关闭浏览器，下次打开数据依然存在。

```vue
<script setup lang="ts">
import {useMultiDataStore} from "@/store/MultiData.ts"
import {storeToRefs} from "pinia";

const multiDataStore = useMultiDataStore()
const {multiData} = storeToRefs(multiDataStore)

multiDataStore.$subscribe((mutation, state) => {
  console.log('mutation=>', mutation) // 本次修改的信息
  console.log('state=>', state) // 真正的数据
  // localStorage.setItem('multiData', JSON.stringify(multiData.value))
})

function addData() {
  multiData.value.push(Math.floor(Math.random() * 10))
  localStorage.setItem('multiData', JSON.stringify(multiData.value));
}
</script>

<template>
  <h3>{{multiData}}</h3>
  <button @click="addData">addData</button>
</template>
```

```typescript
import {defineStore} from "pinia";

export const useMultiDataStore = defineStore('multiData', {
    state() {
        return {
            // multiData: [1,2,3]
            multiData: JSON.parse(localStorage.getItem('multiData') as string) || []
        }
    }
})
```

#### localstorage案例（选项式）

```typescript
import {defineStore} from "pinia";
import {ref} from "vue"

export const useMultiDataStore = defineStore('multiData', {
    state: () => {
        const multiData = ref(
            JSON.parse(localStorage.getItem('multiData') as string) || []);
        return {
            multiData
        };
    }
});
```

#### 对比watch/watchEffect

`$subscribe`是Pinia状态管理库提供的方法，用于订阅状态的变化。它允许你在状态发生变化时执行自定义的回调函数。$subscribe适用于在整个应用程序中监听状态的变化，并执行一些额外的逻辑，例如记录日志/触发副作用等。
watch和watchEffect是Vue的响应式系统提供的功能，用于监听特定的数据变化。

- watch用于监听指定的数据源，并在数据发生变化时执行回调函数。你可以指定要监听的数据、回调函数以及其他选项，例如deep选项来深度监听对象的变化、immediate选项来立即执行回调函数等。watch的使用场景包括监听单个数据的变化、跟踪特定数据的状态、执行异步操作等。
- watchEffect用于监听响应式数据的变化，并自动追踪其依赖关系。它会立即执行传入的回调函数，并在回调函数内部自动追踪依赖的数据。当依赖的数据发生变化时，回调函数会被重新执行。watchEffect的使用场景包括处理副作用、触发异步操作、自动追踪响应式数据的变化等。

总结

- $subscribe用于订阅状态的变化，适用于整个应用程序的状态管理，可以执行自定义的回调函数。
- watch用于监听指定的数据源，提供更细粒度的控制和选项，适用于监听单个数据的变化。
- watchEffect用于监听响应式数据的变化，并自动追踪其依赖关系，适用于处理副作用和自动追踪数据的变化。

在实际使用中，你可以根据具体的需求和场景选择适合的方法。如果你需要订阅整个状态的变化或执行一些全局的逻辑，可以使用$subscribe。如果你只关注某个特定数据的变化，并需要更多的选项和控制，可以使用watch。如果你需要处理副作用或自动追踪响应式数据的变化，可以使用watchEffect。
