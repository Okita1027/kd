---
title: JavaScript
shortTitle: JavaScript基础篇
description: JavaScript基础篇
date: 2024-06-16 22:30:07
categories: [前端,JavaScript]
tags: []
---

[现代 JavaScript 教程](https://zh.javascript.info/)

[简介 - JavaScript教程 - 廖雪峰的官方网站](https://liaoxuefeng.com/books/javascript/introduction/index.html)

[JavaScript 指南 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide)

## 基础语法

### 变量与类型

#### 假值

- `false`
- `undefined`
- `null`
- `0`
- `NaN`
- 空字符串（`""`）

#### `let`和`var`

| 特性             | `var`                          | `let`                                |
| ---------------- | ------------------------------ | ------------------------------------ |
| **作用域**       | 函数作用域（Function Scope）   | 块级作用域（Block Scope）            |
| **变量提升**     | 有，初始化为 `undefined`       | 有，但不初始化（存在**暂时性死区**） |
| **重复声明**     | 可以重复声明                   | 不可以重复声明                       |
| **绑定到全局**   | 是，全局变量变成 `window` 属性 | 否，不会变成 `window` 的属性         |
| **适合使用场景** | 旧代码或函数作用域的变量       | 建议使用，行为更安全、现代           |

##### 作用域

`var` 在函数内有效，`let` 在块 `{}` 内有效。

```JS
if (true) {
  var x = 10;
  let y = 20;
}
console.log(x); // 10 ✅
console.log(y); // ❌ ReferenceError
```

##### 变量提升

`var` 声明的变量会被提升并自动初始化为 `undefined`。

`let` 声明的变量虽然提升了，但在**声明之前不可访问**（称为**暂时性死区（TDZ）**）

```JS
console.log(a); // undefined ✅
var a = 5;

console.log(b); // ❌ ReferenceError: Cannot access 'b' before initialization
let b = 10;
```

##### 重复声明
```JS
var x = 1;
var x = 2; // ✅ 合法

let y = 1;
let y = 2; // ❌ SyntaxError: Identifier 'y' has already been declared
```


##### 全局对象属性
```JS
var a = 1;
let b = 2;

console.log(window.a); // 1 ✅
console.log(window.b); // undefined ❌
```

##### 

#### Symbol类型

##### 特性

###### 独一无二

这是 `Symbol` 最根本的特性。每次调用 `Symbol()` 函数，都会返回一个全新的、与其他所有 `Symbol` 值（包括其他 `Symbol()` 调用和字符串）都不同的值。

```JS
const s1 = Symbol();
const s2 = Symbol();
console.log(s1 === s2); // false (即使没有描述或描述相同，它们也是不同的)

const s3 = Symbol('description');
const s4 = Symbol('description');
console.log(s3 === s4); // false (描述仅用于调试，不影响唯一性)
```

###### 不可变

`Symbol` 一旦创建，其值就不能被改变。

###### 无法隐式转为字符串
```JS
const s = Symbol('id');
console.log("Your id is " + s); // TypeError
```
避免了隐式转换带来的混乱。需要显式调用 `.toString()`。

###### 可作为对象属性名

`Symbol` 值可以作为对象的属性名。使用方括号语法来定义和访问 `Symbol` 属性。

```JS
const myId = Symbol('user_id');
const user = {
  name: 'Alice',
  [myId]: 'unique_alice_id_123' // 使用 Symbol 作为属性名
};
console.log(user[myId]); // unique_alice_id_123
console.log(user.name); // Alice
```

###### 不可枚举

`Symbol` 属性默认情况下是不可枚举的。这意味着它们不会出现在以下遍历方法的结果中：

- `for...in` 循环
- `Object.keys()`
- `Object.values()`
- `Object.entries()`
- `JSON.stringify()`

```JS
const secretKey = Symbol('secret');
const data = {
  publicData: 'hello',
  [secretKey]: 'hidden_value'
};

for (const key in data) {
  console.log(key); // 输出: publicData
}
console.log(Object.keys(data));     // ['publicData']
console.log(JSON.stringify(data));  // {"publicData":"hello"}
```

###### 可访问性

尽管默认不可枚举，但 `Symbol` 属性并非完全私有，它们可以通过特定的反射方法被获取到：

- `Object.getOwnPropertySymbols(obj)`：返回一个数组，包含对象自身的所有 `Symbol` 属性键。
- `Reflect.ownKeys(obj)`：返回一个数组，包含对象自身的所有属性键（包括字符串和 `Symbol`）。

```JS
const symbols = Object.getOwnPropertySymbols(data);
console.log(symbols); // [Symbol(secret)]
console.log(data[symbols[0]]); // hidden_value
console.log(Reflect.ownKeys(data)); // ['publicData', Symbol(secret)]
```

###### 全局注册表

`Symbol` 可以通过 `Symbol.for()` 方法在全局注册表中注册和获取。

- `Symbol.for(key)`：根据 `key` 从全局注册表中查找或创建 `Symbol`。相同 `key` 总是返回同一个 `Symbol` 实例。
- `Symbol.keyFor(symbol)`：返回全局注册表中 `Symbol` 对应的 `key`。

```JS
const globalSym1 = Symbol.for('myApp.config');
const globalSym2 = Symbol.for('myApp.config');
console.log(globalSym1 === globalSym2); // true (指向同一个 Symbol 实例)
console.log(Symbol.keyFor(globalSym1)); // 'myApp.config'
```

##### 使用场景

###### 避免属性名冲突

这是 `Symbol` 最核心的用途之一。当你有多个模块、库或插件需要向同一个对象添加属性时，使用 `Symbol` 作为属性名可以确保彼此不会覆盖对方的属性，从而避免意外的 bug。

- **场景**：
  - 为第三方库或框架提供的对象**添加自定义数据或元信息**，而不干扰其内部属性。
  - 在一个大型项目中，不同团队开发的模块可能需要给共享的配置对象或上下文对象添加各自的内部属性。
  - 实现插件系统，插件通过 `Symbol` 向宿主对象注册自己的扩展点。

案例代码：

```JS
// 假设这是第三方库代码 (lib.js)
const _LIB_ID = Symbol('lib_internal_id');
function attachLibData(obj) {
  obj[_LIB_ID] = Math.random();
  console.log('Lib data attached:', obj[_LIB_ID]);
}

// 你的应用代码 (app.js)
const MY_APP_FLAG = Symbol('my_app_flag');
const targetObject = {};
attachLibData(targetObject); // 库添加数据

targetObject.name = 'Test';
targetObject[MY_APP_FLAG] = true; // 你添加数据

console.log(targetObject); // { name: "Test", [Symbol(lib_internal_id)]: ..., [Symbol(my_app_flag)]: true }
// 尽管两者都向 targetObject 添加了属性，但由于使用了不同的 Symbol，它们不会冲突。
```

###### 定义对象的“伪私有”属性

在 ES2022 的 `#` 私有字段出现之前，`Symbol` 是实现对象“私有”属性的常见方式之一。即使现在有了 `#`，`Symbol` 仍然有用：

**场景**：

- 为普通对象（非类实例）添加一些不希望被常规遍历（如 `for...in`）发现的内部状态或标记。
- 定义一些“只供内部团队使用但又不绝对私有”的属性，这些属性可以通过 `Object.getOwnPropertySymbols` 发现，用于调试或特定工具访问。

**注意**：`#` 私有字段是更严格的私有化方案，仅限于类内部。`Symbol` 属性可以通过反射被访问，因此被称为“伪私有”。

###### 自定义内置行为

这是 `Symbol` 最强大和高级的应用，它允许开发者**自定义对象的一些内置行为**。这些预定义的 `Symbol` 值作为语言内部操作的“钩子”，通过在对象上实现对应的 `Symbol` 属性，可以改变这些操作的默认行为。

**`Symbol.iterator`**：使对象可迭代，从而能被 `for...of` 循环、展开运算符 (`...`)、`Array.from()` 等使用。

- **场景**：当你需要一个自定义对象能够像数组一样被遍历时。

```JS
class DataContainer {
  constructor(...data) {
    this.data = data;
  }
  // 让 DataContainer 实例成为一个可迭代对象
  *[Symbol.iterator]() { // 使用生成器函数简化迭代器实现
    yield* this.data; // 委托给内部数组的迭代器
  }
}
const container = new DataContainer(10, 20, 30);
for (const item of container) {
  console.log(item); // 10, 20, 30
}
console.log([...container]); // [10, 20, 30]
```

---

**`Symbol.toStringTag`**：用于自定义 `Object.prototype.toString()` 的返回值。

- **场景**：当你希望 `Object.prototype.toString.call(myObj)` 返回一个更有意义的字符串，而不是 `[object Object]` 时。

```JS
class CustomType {
  get [Symbol.toStringTag]() {
    return 'MyCustomType';
  }
}
const instance = new CustomType();
console.log(Object.prototype.toString.call(instance)); // [object MyCustomType]
```

---

**`Symbol.toPrimitive`**：定义对象转换为原始值（如数字、字符串、布尔值）时的行为。

- **场景**：当你需要自定义对象在进行算术运算或字符串拼接时的行为。

```JS
const temperature = {
  value: 25,
  unit: 'Celsius',
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return this.value;
    }
    if (hint === 'string') {
      return `${this.value}°${this.unit}`;
    }
    return this.value; // default
  }
};
console.log(+temperature);       // 25 (转换为数字)
console.log(`${temperature}`);   // "25°Celsius" (转换为字符串)
console.log(temperature + 5);    // 30 (25 + 5)
```

**`Symbol.asyncIterator`**：使对象可异步迭代，配合 `for await...of` 循环。

**`Symbol.hasInstance`**：自定义 `instanceof` 操作符的行为。

**`Symbol.match`, `Symbol.replace`, `Symbol.search`, `Symbol.split`**：用于自定义字符串方法的行为。

###### 常量定义

有时也会用 `Symbol` 来定义一些常量，因为 `Symbol` 的独一无二性确保了这些常量即使值相同，它们在程序中也是不同的标识符，避免了“魔法字符串”或数字的重复定义可能带来的混淆。

> “**魔法字符串**”（Magic String）是一个贬义词，用来形容在代码中**直接硬编码（hardcode）的、没有明确含义或解释的字符串字面量**。它之所以被称为“魔法”，是因为它的存在和作用看起来像是凭空出现，没有通过常量、变量或枚举等方式被赋予清晰的命名，导致阅读代码的人难以立即理解它的用途和含义。

```JS
const EVENT_TYPE_CLICK = Symbol('click');
const EVENT_TYPE_FOCUS = Symbol('focus');

// 保证即使描述相同，也是不同的事件类型
function handleEvent(eventType) {
  if (eventType === EVENT_TYPE_CLICK) {
    console.log('Clicked!');
  } else if (eventType === EVENT_TYPE_FOCUS) {
    console.log('Focused!');
  }
}

handleEvent(EVENT_TYPE_CLICK);
```



### 模板字符串

**模板字符串 (Template Literals)** 是 ES6 (ECMAScript 2015) 引入的一种增强型字符串字面量。它提供了一种更简洁、更灵活的方式来创建字符串，解决了传统字符串拼接的一些痛点。

#### 基本用法

模板字符串使用**反引号**（```）包裹，而不是普通字符串使用的单引号 `'` 或双引号 `"`。

```JS
const str = `这是一个模板字符串`;
```

#### 特性用法

##### 多行字符串

普通字符串需要使用 `\n` 来换行，模板字符串可以直接换行：

```JS
const multiLine = `这是第一行
这是第二行`;
```

##### 插值表达式

在模板字符串中可以使用 `${}` 插入变量或表达式：

```JS
const name = "小明";
const age = 22;
const message = `你好，我是${name}，今年${age}岁。`;
console.log(message); // 输出：你好，我是小明，今年22岁。
```

```JS
const x = 5;
const y = 10;
const result = `总和是：${x + y}`; // 总和是：15
```

##### 调用函数

可以在 `${}` 中调用函数：

```JS
function greet(name) {
  return `你好，${name}`;
}

const message = `${greet("小红")}`; // 你好，小红
```

##### 嵌套对象属性

```JS
const person = { name: "张三", age: 30 };
const info = `姓名：${person.name}，年龄：${person.age}`;
```

### 运算与比较

#### `**`

`**` 运算符是指数运算符（Exponentiation Operator），用于计算一个数的幂。它的语法是：

```ts
base ** exponent
```

其中：

- `base` 是底数
- `exponent` 是指数

示例：

```ts
console.log(2 ** 3);   // 输出: 8 (2的3次方)
console.log(10 ** 2);  // 输出: 100 (10的平方)
console.log(3 ** 0.5); // 输出: 1.732... (3的平方根)
```

#### `==`

**抽象相等**：允许类型转换后进行比较。通常不推荐，因为它可能导致意外结果。

#### `===`

**严格相等**：不进行类型转换。类型和值必须都相等。但在 `NaN` 和 `+0/-0` 上有特殊行为。

`NAN` VS `NAN`: false
`+0` VS `-0`: true

#### `Object.is()`

**值相等**：与 `===` 类似，但正确处理了 `NaN` 和 `+0/-0`。
`NAN` VS `NAN`: true
`+0` VS `-0`: false

#### `??`

`a ?? b` 的结果是：

- 如果 `a` 是已定义的，则结果为 `a`，
- 如果 `a` 不是已定义的，则结果为 `b`。

换句话说，如果第一个参数不是 `null/undefined`，则 `??` 返回第一个参数。否则，返回第二个参数。

空值合并运算符并不是什么全新的东西。它只是一种获得两者中的第一个“已定义的”值的不错的语法。

我们可以使用我们已知的运算符重写 `result = a ?? b`，像这样：

```JS
result = (a !== null && a !== undefined) ? a : b;
```

`??` 的常见使用场景是提供默认值。

例如，在这里，如果 `user` 的值不为 `null/undefined` 则显示 `user`，否则显示 `匿名`：

```JS
let user;

alert(user ?? "匿名"); // 匿名（user 未定义）
```

### 循环与迭代

#### for、do...while、while

#### label、break、continue

`label` 语句 是 JavaScript 中相对少见但很有用的语法，主要用于配合 `break` 和 `continue` 语句，在**多层循环**或**嵌套结构**中控制流程跳转。

**语法：**

```JS
labelName: {
  // 代码块
}

labelName:
for (...) {
  // 循环体
}
```

**示例1：用于`break`跳出多重循环**

```JS
outerLoop: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) {
      break outerLoop; // 直接跳出 outerLoop
    }
    console.log(`i = ${i}, j = ${j}`);
  }
}
=================输出结果=================
i = 0, j = 0
i = 0, j = 1
i = 0, j = 2
i = 1, j = 0
```

**示例2：用于`continue`跳过当前外层循环的迭代**

```JS
outerLoop: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) {
      continue outerLoop; // 跳过当前的 i，进入下一个 i
    }
    console.log(`i = ${i}, j = ${j}`);
  }
}
=================输出结果==================
i = 0, j = 0
i = 1, j = 0
i = 2, j = 0
```

> [!note]
>
> `label` 名称必须是一个合法标识符。
>
> 不能用于 `if`、`switch`、`try` 等非循环/代码块语句上。
>
> `label` 不常用，**滥用会导致代码可读性差**，应谨慎使用。
>
> 更推荐用函数封装或优化逻辑结构替代复杂跳出。



---



| 特性               | `for...in`                         | `for...of`                       |
| ------------------ | ---------------------------------- | -------------------------------- |
| 遍历内容           | 对象的 **键名**（索引/属性名）     | 可迭代对象的 **键值**（值本身）  |
| 适用结构           | 对象、数组、字符串等（会遍历键名） | 数组、字符串、Set、Map、类数组等 |
| 是否可用于对象     | ✅ 可遍历对象的键                   | ❌ 报错（除非对象实现了迭代器）   |
| 数组适用性         | 不推荐（遍历索引，有副作用）       | 推荐（直接遍历元素值）           |
| 是否按顺序遍历数组 | ❌ 不保证顺序                       | ✅ 保证顺序                       |
| 是否继承属性       | ✅ 会遍历原型链上的属性             | ❌ 只遍历自身属性                 |

#### for...in

`for...in` 循环用于遍历对象**可枚举属性的键**。它会遍历对象自身的所有可枚举属性，以及它原型链上所有可枚举的属性。

**语法：**

```JS
for (variable in object) {
  // code to be executed for each enumerable property key
}
```

**特点：**

1. **遍历目标**：主要用于遍历**普通对象**的属性名（键）。
2. **遍历内容**：返回的是属性的**字符串类型键**。
3. **原型链**：会遍历到**原型链上的可枚举属性**。这是 `for...in` 经常引起意外行为的地方。
4. **顺序不确定**：遍历的顺序是**不确定**的，尤其是在跨浏览器和引擎时。虽然现代 JavaScript 引擎通常会保持数字键的升序，然后是创建顺序，但仍不应依赖此行为。
5. **不推荐用于数组**：
   - 遍历的不是数组的元素值，而是**索引（字符串类型）**。
   - 会遍历到数组原型链上的属性（例如，如果你手动给 `Array.prototype` 添加了属性）。
   - 遍历顺序不保证是数字顺序。

```JS
const obj = { a: 1, b: 2, c: 3 };
for (let key in obj) {
  console.log(key);         // 输出：a b c
  console.log(obj[key]);    // 输出：1 2 3
}
```

```JS
const myObject = {
  a: 1,
  b: 2,
  c: 3
};

for (const key in myObject) {
  console.log(`Key: ${key}, Value: ${myObject[key]}`);
}
// 输出:
// Key: a, Value: 1
// Key: b, Value: 2
// Key: c, Value: 3

// -----------------------------------------------------

const myArray = ['apple', 'banana', 'orange'];
// 不推荐这样遍历数组，但为了演示其行为：
for (const index in myArray) {
  console.log(`Index (string): ${index}, Value: ${myArray[index]}`);
}
// 输出:
// Index (string): 0, Value: apple
// Index (string): 1, Value: banana
// Index (string): 2, Value: orange

// -----------------------------------------------------

// 带有原型链属性的示例
function Person(name) {
  this.name = name;
}
Person.prototype.age = 30; // 添加到原型链

const p = new Person('Alice');
p.city = 'New York';

for (const key in p) {
  // 通常会使用 hasOwnProperty 过滤原型链上的属性
  if (p.hasOwnProperty(key)) {
    console.log(`Own Property Key: ${key}, Value: ${p[key]}`);
  } else {
    console.log(`Prototype Property Key: ${key}, Value: ${p[key]}`);
  }
}
// 输出:
// Own Property Key: name, Value: Alice
// Own Property Key: city, Value: New York
// Prototype Property Key: age, Value: 30 (如果没有 hasOwnProperty 检查)
```

> [!note]
>
> 使用 `for...in` 遍历对象时，**始终结合 `hasOwnProperty()` 方法**来过滤掉继承自原型链的属性，以避免不必要的副作用。

---

#### for...of

`for...of` 循环是 ES6 (ECMAScript 2015) 引入的，用于遍历**可迭代对象（Iterable）** 的**元素值**。

**语法：**

```JS
for (variable of iterable) {
  // code to be executed for each element value
}
```

**特点：**

1. **遍历目标**：主要用于遍历**可迭代对象**（Iterable）的**元素值**。
   - **数组 (Array)**
   - **字符串 (String)**
   - **Map**
   - **Set**
   - **arguments 对象**
   - **NodeList** (在浏览器环境中)
   - 任何实现了 `Symbol.iterator` 方法的自定义对象。
2. **遍历内容**：直接返回可迭代对象的**元素值**。
3. **不遍历原型链**：它只会遍历对象自身的元素，**不会遍历原型链**。
4. **遍历顺序**：按照可迭代对象定义的迭代顺序进行，例如数组的索引顺序，字符串的字符顺序。
5. **简洁高效**：语法更简洁，避免了 `for` 循环中手动管理索引的繁琐，也避免了 `for...in` 的陷阱。

```JS
const myArray = ['apple', 'banana', 'orange'];
for (const value of myArray) {
  console.log(`Array Value: ${value}`);
}
// 输出:
// Array Value: apple
// Array Value: banana
// Array Value: orange

// -----------------------------------------------------

const myString = "hello";
for (const char of myString) {
  console.log(`String Character: ${char}`);
}
// 输出:
// String Character: h
// String Character: e
// String Character: l
// String Character: l
// String Character: o

// -----------------------------------------------------

const mySet = new Set([1, 2, 2, 3]);
for (const item of mySet) {
  console.log(`Set Item: ${item}`);
}
// 输出:
// Set Item: 1
// Set Item: 2
// Set Item: 3

// -----------------------------------------------------

const myMap = new Map([['name', 'Alice'], ['age', 30]]);
for (const [key, value] of myMap) { // 使用解构赋值获取键值对
  console.log(`Map Entry: ${key} -> ${value}`);
}
// 输出:
// Map Entry: name -> Alice
// Map Entry: age -> 30
```

---

#### 自定义可迭代对象



```JS
const myIterable = {
  data: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => ({
        value: this.data[index],
        done: index++ >= this.data.length
      })
    };
  }
};

for (let val of myIterable) {
  console.log(val);
}

```



## 函数

### arguments对象

**类数组对象**：

- 它有 `length` 属性，表示传入参数的数量。
- 可以通过索引访问参数，例如 `arguments[0]`、`arguments[1]`。
- **重要提示**：它不是真正的数组！它没有数组的 `push`、`pop`、`forEach`、`map` 等方法。

**动态绑定**： 在**非严格模式**下，`arguments` 对象中的元素与对应的命名参数是**同步的**。这意味着如果你修改了 `arguments[i]` 的值，对应的命名参数的值也会改变，反之亦然。

```JS
function showArgs(a, b) {
  console.log('Before change:');
  console.log('a:', a, 'b:', b); // a: 1 b: 2
  console.log('arguments[0]:', arguments[0], 'arguments[1]:', arguments[1]); // arguments[0]: 1 arguments[1]: 2

  arguments[0] = 10; // 修改 arguments[0]
  b = 20;            // 修改命名参数 b

  console.log('After change:');
  console.log('a:', a, 'b:', b); // a: 10 b: 20 (a 随 arguments[0] 改变，b 改变自身)
  console.log('arguments[0]:', arguments[0], 'arguments[1]:', arguments[1]); // arguments[0]: 10 arguments[1]: 20 (arguments[1] 随 b 改变)
}

showArgs(1, 2);
```

**然而，在严格模式下，这种同步特性被移除**。修改 `arguments` 不会影响命名参数，修改命名参数也不会影响 `arguments`。

```JS
function showArgsStrict(a, b) {
  "use strict"; // 启用严格模式
  console.log('Before change (Strict Mode):');
  console.log('a:', a, 'b:', b);
  console.log('arguments[0]:', arguments[0], 'arguments[1]:', arguments[1]);

  arguments[0] = 10;
  b = 20;

  console.log('After change (Strict Mode):');
  console.log('a:', a, 'b:', b); // a: 1 b: 20 (a 保持不变，b 改变自身)
  console.log('arguments[0]:', arguments[0], 'arguments[1]:', arguments[1]); // arguments[0]: 10 arguments[1]: 2 (arguments[1] 保持不变)
}

showArgsStrict(1, 2);
```

> 由于现代 JavaScript 代码多运行在严格模式下（尤其是 ES Modules 默认就是严格模式），因此**不应该依赖这种动态绑定特性**。

3. **箭头函数没有 `arguments` 对象**： 箭头函数不会绑定自己的 `arguments` 对象。它们会从**外层非箭头函数**继承 `arguments` 对象。

```JS
function outerFunc() {
  console.log(arguments); // 外层函数的 arguments

  const innerArrowFunc = () => {
    console.log(arguments); // 继承 outerFunc 的 arguments
  };
  innerArrowFunc();
}
outerFunc(1, 2, 3);
```

**常见用途**

1. **处理不定数量的参数**： 当你不确定函数会被传入多少个参数时，`arguments` 对象可以帮助你访问所有传入的参数。

```JS
function sumAll() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

console.log(sumAll(1, 2, 3));      // 输出: 6
console.log(sumAll(10, 20, 30, 40)); // 输出: 100
```

2. **将 `arguments` 转换为真正的数组**： 由于 `arguments` 是类数组对象，有时你需要它拥有数组的完整方法。你可以通过以下方式将其转换为数组：

   - ES6 `Array.from()`【推荐】

     ```JS
     function logArguments() {
       const argsArray = Array.from(arguments);
       console.log(argsArray); // [1, 2, 3]
       console.log(argsArray.pop()); // 3
     }
     logArguments(1, 2, 3);
     ```

   - **ES6 展开运算符 `...`** (推荐)

     ```JS
     function logArgumentsSpread() {
       const argsArray = [...arguments];
       console.log(argsArray); // [4, 5, 6]
       console.log(argsArray.shift()); // 4
     }
     logArgumentsSpread(4, 5, 6);
     ```

   - 旧方法：`Array.prototype.slice.call()`

     ```JS
     function logArgumentsOld() {
       const argsArray = Array.prototype.slice.call(arguments);
       console.log(argsArray); // [7, 8, 9]
     }
     logArgumentsOld(7, 8, 9);
     ```

---

现代 JavaScript 中的替代方案：剩余参数 (`...rest`)

虽然 `arguments` 对象在旧代码中很常见，但在现代 JavaScript 中，我们有了更强大、更推荐的替代方案：**剩余参数 (Rest Parameters)**。

**剩余参数 (`...rest`) 的优势：**

1. **真正的数组**：剩余参数收集的是一个真正的数组，可以直接使用数组的所有方法，无需额外转换。
2. **更清晰的语义**：通过函数签名明确地声明了函数可以接受额外的参数。
3. **只包含未命名的参数**：它只收集那些没有被明确命名的参数。
4. **不包含旧版 `arguments` 对象的同步行为**（即默认在严格模式下）。

```JS
// 使用剩余参数替代 arguments
function sumAllModern(...numbers) {
  // numbers 现在是一个真正的数组
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sumAllModern(1, 2, 3));      // 输出: 6
console.log(sumAllModern(10, 20, 30, 40)); // 输出: 100

// 剩余参数可以与命名参数混合使用
function greetPeople(greeting, ...names) {
  names.forEach(name => console.log(`${greeting}, ${name}!`));
}
greetPeople('Hello', 'Alice', 'Bob', 'Charlie');
// 输出:
// Hello, Alice!
// Hello, Bob!
// Hello, Charlie!
```

### 标签函数

当你在一个模板字符串前面放置一个函数名（这个函数就是“标签函数”）时，JavaScript 不会直接将模板字符串解析成一个普通的字符串，而是会调用这个标签函数，并将模板字符串的内容分解成两个部分传递给它：

1. **字符串数组 (String Array)**：一个包含模板字符串中**所有静态字符串部分**的数组。这些静态字符串是插值表达式 (`${...}`) 之间的部分，以及开头和结尾的部分。
2. **表达式值 (Expression Values)**：后续的参数是模板字符串中**所有插值表达式的值**。

#### 语法形式

一个标签函数通常接收的参数如下：

```JS
function tagFunction(strings, ...expressions) {
  // strings 是一个数组，包含静态字符串
  // expressions 是一个数组，包含所有插值表达式的值
  // ... 你可以在这里自定义如何处理这些部分
}
```

示例代码：

```JS
function tag(strings, ...values) {
  console.log(strings); // 字符串部分的数组
  console.log(values);  // 表达式插值结果
  return strings[0] + values[0] + strings[1];
}

const name = "小明";
const age = 22;

const result = tag`我叫${name}，我今年${age}岁。`;
console.log(result);
```

输出结果：

```JS
[ '我叫', '，我今年', '岁。' ]
[ '小明', 22 ]
我叫小明，我今年22岁。
```

#### `raw`属性

`strings` 数组还有一个特殊的 `raw` 属性，它包含了原始的、未处理的字符串形式。例如，`\n` 在 `strings` 中会被解析为换行符，但在 `strings.raw` 中它就是字面量的 `\n`。

```JS
function inspectRaw(strings, ...values) {
  console.log('Processed strings:', strings);
  console.log('Raw strings:', strings.raw);
  return 'Check console.';
}

inspectRaw`Hello\nWorld! ${123}`;
// 输出:
// Processed strings: [ 'Hello\nWorld! ', '' ]
// Raw strings: [ 'Hello\\nWorld! ', '' ]
```

### 生成器函数

**生成器 (Generators)** 是一种特殊类型的函数，它允许你**暂停执行并在稍后恢复执行**。这使得它们非常适合处理**惰性计算 (lazy computation)** 和**异步操作**。生成器函数通过使用 `function*` 语法定义，并在其函数体内使用 `yield` 关键字来暂停和产出值。
#### 问题引入
传统的 JavaScript 函数在被调用时，会一直运行到返回（或抛出错误）为止，期间不能暂停。但很多场景需要一种能够“中断”和“恢复”执行流的机制：

- **处理无限序列**：例如，斐波那契数列、无穷递增的 ID。你不能一次性生成所有值。

- **惰性计算**：只在需要时才计算下一个值，节省内存和计算资源。

- **简化异步代码**：与 async/await 类似，生成器（结合 co 库或手动实现）可以把异步回调地狱（callback hell）扁平化，使其看起来像同步代码。虽然现在 async/await 更常用，但生成器是其底层原理之一。
#### 关键特性
| 特性           | 描述                                                         |
| -------------- | ------------------------------------------------------------ |
| `function*`    | 声明生成器函数                                               |
| `yield`        | 暂停函数执行，并返回一个值                                   |
| `yield*`       | 委托给另一个生成器                                           |
| `.next()`      | 继续执行到下一个 `yield`，返回 `{ value, done }` 对象        |
| 可用于异步控制 | 和 `async/await` 类似，可用于控制异步流程（与 `co` 等库结合使用） |
#### 使用方式
1. 定义：通过 function* 语法定义生成器函数。
```JS
function* myGenerator() {
  // ...
}
```
2. 创建迭代器：调用生成器函数并不会立即执行其内部代码，而是会返回一个生成器迭代器 (Generator Iterator) 对象。
```JS
const generatorObject = myGenerator();
```
3. 暂停与恢复
- 当你调用迭代器的 next() 方法时，生成器函数会从上次暂停的地方（或从头开始）执行，直到遇到第一个 yield 表达式。

- yield 关键字会暂停生成器函数的执行，并把紧跟在 yield 后面的表达式的值作为 next() 方法的返回对象的 value 属性返回。

- next() 方法返回的是一个对象，包含两个属性：value（yield 产出的值）和 done（一个布尔值，表示生成器是否已完成）。

- 当再次调用 next() 时，生成器函数会从上次 yield 暂停的地方继续执行，直到遇到下一个 yield 或 return 语句。
4. 完成
- 如果生成器函数执行完毕，没有更多的 yield 表达式，或者遇到了 return 语句，next() 方法返回的对象的 done 属性会变为 true。

- return 语句会使生成器完成，并将其后的值作为 value 属性返回。之后再调用 next()，value 属性将是 undefined。
---
示例代码：
```JS
function* countGenerator() {
  console.log('Start generator');
  yield 1; // 第一次暂停，产出 1
  console.log('After first yield');
  yield 2; // 第二次暂停，产出 2
  console.log('After second yield');
  yield 3; // 第三次暂停，产出 3
  console.log('End generator');
  return 'Finished!'; // 返回最终值
}

const iterator = countGenerator(); // 调用生成器函数，返回迭代器对象

console.log('First next() call:');
console.log(iterator.next()); // { value: 1, done: false }
// 控制台输出: Start generator

console.log('Second next() call:');
console.log(iterator.next()); // { value: 2, done: false }
// 控制台输出: After first yield

console.log('Third next() call:');
console.log(iterator.next()); // { value: 3, done: false }
// 控制台输出: After second yield

console.log('Fourth next() call (after last yield):');
console.log(iterator.next()); // { value: 'Finished!', done: true } (return 的值)
// 控制台输出: End generator

console.log('Fifth next() call (generator is done):');
console.log(iterator.next()); // { value: undefined, done: true }
```
#### 遍历生成器
生成器函数返回的迭代器对象是可迭代的 (Iterable)。这意味着你可以使用 for...of 循环来遍历生成器产出的所有值，而无需手动调用 next()。
```javascript
function* fibonacciGenerator() {
  let a = 0;
  let b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b]; // 数组解构赋值，交换并计算下一个斐波那契数
  }
}

// 遍历前 10 个斐波那契数
let count = 0;
for (const num of fibonacciGenerator()) {
  if (count >= 10) {
    break; // 限制只取前 10 个
  }
  console.log(num);
  count++;
}
// 输出: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34
```
> 注意，如果没有 break，fibonacciGenerator 会生成一个无限序列。

#### 迭代器方法
##### `next()`的可选参数
next() 方法可以接受一个可选参数，这个参数会作为上次 yield 表达式的返回值传递回生成器内部。这允许你向生成器“发送”数据。

可以使用`next(true)`来重置生成器

```javascript
function* interactiveGenerator() {
  const name = yield 'What is your name?';
  const age = yield `Hello, ${name}! How old are you?`;
  return `So, ${name}, you are ${age} years old.`;
}

const it = interactiveGenerator();

console.log(it.next());       // { value: 'What is your name?', done: false }
console.log(it.next('Alice')); // { value: 'Hello, Alice! How old are you?', done: false }
console.log(it.next(30));     // { value: 'So, Alice, you are 30 years old.', done: true }
```
##### `throw()`
在生成器内部抛出一个错误，并暂停生成器。如果生成器内部没有捕获该错误，它会向外冒泡。
##### `return()`
提前终止生成器，并返回一个带有给定 value 和 done: true 的对象。

#### `yield*`

**`yield*` 表达式**用于委托给另一个[`generator`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function*) 或可迭代对象。

##### `yield*`表达式的值

`yield*` 是一个表达式，不是语句，所以它会有自己的值，`yield*` 表达式本身的值是当迭代器关闭时返回的值（即`done`为`true`时）。

```JS
function* g4() {
  yield* [1, 2, 3];
  return "foo";
}

var result;

function* g5() {
  result = yield* g4();
}

var iterator = g5();

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true },
// 此时 g4() 返回了 { value: "foo", done: true }

console.log(result); // "foo"
```

##### 委托给其他生成器

以下代码中，`g1()` `yield` 出去的每个值都会在 `g2()` 的 `next()` 方法中返回，就像那些 `yield` 语句是写在 `g2()` 里一样。

```javascript
function* g1() {
  yield 2;
  yield 3;
  yield 4;
}

function* g2() {
  yield 1;
  yield* g1();
  yield 5;
}

var iterator = g2();

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: 4, done: false }
console.log(iterator.next()); // { value: 5, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

##### 委托给其他可迭代对象

除了生成器对象这一种可迭代对象，`yield*` 还可以 `yield` 其他任意的可迭代对象，比如说数组、字符串、`arguments` 对象等等。

```JS
function* g3() {
  yield* [1, 2];
  yield* "34";
  yield* arguments;
}

var iterator = g3(5, 6);

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: "3", done: false }
console.log(iterator.next()); // { value: "4", done: false }
console.log(iterator.next()); // { value: 5, done: false }
console.log(iterator.next()); // { value: 6, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

### 预定义的函数

#### 数值处理
| 函数                | 作用          |
| ----------------- | ----------- |
| `parseInt(str)`   | 将字符串解析为整数   |
| `parseFloat(str)` | 将字符串解析为浮点数  |
| `isNaN(value)`    | 判断是否为 `NaN` |
| `isFinite(value)` | 判断是否为有限数字   |
| `Number(value)`   | 显式转换为数字     |
```JS
parseInt("123abc");     // 123
parseFloat("3.14px");   // 3.14
isNaN("abc");           // true
isFinite(1000);         // true
```
#### 字符串处理
| 函数                     | 作用         |
| ---------------------- | ---------- |
| `encodeURI(uri)`       | 对 URI 编码   |
| `decodeURI(uri)`       | 对 URI 解码   |
| `encodeURIComponent()` | 对 URI 组件编码 |
| `decodeURIComponent()` | 对 URI 组件解码 |
| `escape(str)` ✅过时      | 编码字符串      |
| `unescape(str)` ✅过时    | 解码字符串      |
#### 控制执行函数
| 函数                    | 作用         |
| --------------------- | ---------- |
| `setTimeout(fn, ms)`  | 延迟执行函数（一次） |
| `setInterval(fn, ms)` | 每隔一段时间执行函数 |
| `clearTimeout(id)`    | 清除超时定时器    |
| `clearInterval(id)`   | 清除间隔定时器    |
#### 数学函数
Math.round(3.5);     // 4
Math.floor(3.9);     // 3
Math.ceil(3.1);      // 4
Math.max(1, 5, 10);  // 10
Math.random();       // 0~1 之间的随机数
#### 全局函数
| 函数             | 作用                 |
| -------------- | ------------------ |
| `eval(code)`   | 执行一段 JS 字符串（⚠️不推荐） |
| `alert(msg)`   | 弹出提示框（浏览器环境）       |
| `prompt(msg)`  | 弹出输入框（浏览器）         |
| `confirm(msg)` | 弹出确认框（浏览器）         |
#### 类型转换器
| 函数               | 说明           |
| ---------------- | ------------ |
| `String(value)`  | 转换为字符串       |
| `Number(value)`  | 转换为数字        |
| `Boolean(value)` | 转换为布尔值       |
| `Object(value)`  | 转换为对象        |
| `typeof`         | 返回值的类型（不是函数） |

## 集合
### WeakMap
#### 特点
WeakMap = “不可遍历 + 对象弱引用键 + 安全私有数据结构”
| 特性        | 说明                                       |
| --------- | ---------------------------------------- |
| 键只能是对象    | 原始值（如字符串、数字）不能作为键                        |
| 不可遍历      | 无法使用 `forEach`、`for...of`、`keys()` 等方法遍历 |
| 弱引用键      | 如果对象为NULL并且没有其他引用，键值会被垃圾回收                      |
| 适合做私有数据存储 | 可为对象关联额外信息且不暴露                           |

---
**不可以枚举的原因：**

WeakMap 和 WeakSet 不可枚举的原因正是由于它们的“弱”特性。如果它们是可枚举的，那么在遍历时，垃圾回收器可能会在遍历过程中回收掉某个键或成员。这会导致遍历结果的不确定性和不稳定性，这在编程中是不可接受的。因此，设计者决定牺牲可枚举性来换取弱引用的优势。

WeakMap 的方法：
- weakMap.set(key, value): 设置键值对。

- weakMap.get(key): 获取键对应的值。

- weakMap.has(key): 检查是否存在某个键。

- weakMap.delete(key): 删除某个键值对。
#### 使用场景
##### 存储DOM元素元数据
当你需要为一个 DOM 元素添加一些额外的数据，而又不想直接修改 DOM 元素本身（可能导致内存泄漏，因为你手动存储的引用会阻止 DOM 元素被回收）时，WeakMap 是理想选择。
```javascript
const elementData = new WeakMap();
const myDiv = document.getElementById('myDiv');
elementData.set(myDiv, { clickCount: 0 });

myDiv.addEventListener('click', () => {
  let data = elementData.get(myDiv);
  data.clickCount++;
  console.log('Click count:', data.clickCount);
});

// 当 myDiv 从 DOM 中被移除，且没有其他地方引用它时，
// 它将被垃圾回收，同时 elementData 中对应的条目也会自动消失。
```
##### 私有数据
在不使用 Symbol 或 class 私有字段的情况下，可以使用 WeakMap 来实现对象的私有数据，因为外部无法访问 WeakMap 的键。
##### 缓存
当缓存的数据需要与对象的生命周期同步时。
### WeakSet
#### 特点
WeakSet = “只能存对象 + 成员弱引用 + 无法遍历” 的简化版 Set，适合做对象标记用途
| 特性      | 说明                                             |
| ------- | ---------------------------------------------- |
| 成员只能是对象 | 基本类型（如字符串、数字）不允许加入                             |
| 成员是弱引用  | 对象若无其他引用，会被自动垃圾回收                              |
| 不可遍历    | 不能用 `for...of`、`forEach`、`.size`、`.keys()` 等方法 |
| 无法清空    | 没有 `.clear()` 方法                               |
| 不可序列化   | 不能 JSON.stringify()                            |
---
WeakSet 的方法：
- weakSet.add(value): 添加一个对象作为成员。

- weakSet.has(value): 检查是否存在某个成员。

- weakSet.delete(value): 删除某个成员。
#### 使用场景
##### 标记已访问的对象
在图遍历或循环引用检测中，可以用来跟踪已经访问过的对象，避免无限循环，同时不阻止对象被回收。
##### 事件监听器管理
当需要跟踪哪些对象注册了特定的事件监听器时，如果这些对象本身可能被销毁，使用 WeakSet 可以确保当对象被回收时，其在集合中的引用也会自动消失。

## 面向对象

### construct、get、set、toString

定义这三个方法直接写名字就行了，前面不需要加`function`

```javascript
class Color {
  constructor(r, g, b) {
    this.values = [r, g, b];
  }
  get red() {
    return this.values[0];
  }
  set red(value) {
    this.values[0] = value;
  }
  toString() {
      return this.values;
  }
}

const red = new Color(255, 0, 0);
red.red = 0;
console.log(red.red); // 0
```
这就像是对象有了一个 red 属性——但实际上，实例上并没有这样的属性！实例只有两个方法，分别以 get 和 set 为前缀，而这使得我们可以像操作属性一样操作它们。

如果一个字段仅有一个 getter 而没有 setter，它将是只读的。
```js
class Color {
  constructor(r, g, b) {
    this.values = [r, g, b];
  }
  get red() {
    return this.values[0];
  }
}

const red = new Color(255, 0, 0);
red.red = 0;
console.log(red.red); // 255
```
> [!note]
> 在严格模式下，red.red = 0 这一行将抛出类型错误：“Cannot set property red of #<Color> which has only a getter”。在非严格模式下，赋值将被静默忽略。

### (静态)公有字段/方法
默认情况下，类的所有属性和方法都是公共的。这意味着它们可以从类的外部直接访问、读取和修改。
声明方式：
- 在构造函数中使用 this.propertyName = value;
- 在类体中直接写 propertyName = value; (ES2019 Class Fields 提案，已是标准)
```JS
class Person {
  // 公共实例字段 (Class Fields 语法)
  name = 'Anonymous';
  age = 0;

  constructor(name, age) {
    // 也可以在构造函数中定义公共实例字段
    this.name = name;
    this.age = age;
  }

  greet() {
    console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
  }
}

const alice = new Person('Alice', 30);
console.log(alice.name);   // 输出: Alice (公共，可直接访问)
alice.age = 31;            // 公共，可直接修改
console.log(alice.age);    // 输出: 31
alice.greet();             // 输出: Hello, my name is Alice and I am 31 years old.
```
### (静态)私有字段/方法
私有字段是 ES2022 (ES13) 引入的语言特性，允许你在类中声明真正私有的属性和方法。这些私有成员只能在类的内部访问，从外部无法直接访问。
声明方式：
- #propertyName = value;
- #methodName() { ... }
```JS
class Calculator {
  #pi = 3.14159; // 私有字段
  #validateNumber(num) { // 私有方法
    if (typeof num !== 'number' || isNaN(num)) {
      throw new Error('Input must be a valid number.');
    }
  }

  add(a, b) {
    this.#validateNumber(a); // 内部调用私有方法
    this.#validateNumber(b);
    return a + b;
  }

  // 公共方法可以访问私有字段
  getPi() {
    return this.#pi;
  }
}

const calc = new Calculator();
console.log(calc.add(5, 3)); // 输出: 8
// console.log(calc.#pi); // SyntaxError
// calc.#validateNumber(10); // SyntaxError
```
### `this`

#### this不受限制

在 JavaScript 中，`this` 关键字与其他大多数编程语言中的不同。JavaScript 中的 `this` 可以用于任何函数，即使它不是对象的方法。

下面这样的代码没有语法错误：

```JS
function sayHi() {
  alert( this.name );
}
```

`this` 的值是在代码运行时计算出来的，它取决于代码上下文。

例如，这里相同的函数被分配给两个不同的对象，在调用中有着不同的 “this” 值：

```JS
let user = { name: "John" };
let admin = { name: "Admin" };

function sayHi() {
  alert( this.name );
}

// 在两个对象中使用相同的函数
user.f = sayHi;
admin.f = sayHi;

// 这两个调用有不同的 this 值
// 函数内部的 "this" 是“点符号前面”的那个对象
user.f(); // John（this == user）
admin.f(); // Admin（this == admin）

admin['f'](); // Admin（使用点符号或方括号语法来访问这个方法，都没有关系。）
```

**在没有对象的情况下调用：**`this == undefined`

```JS
function sayHi() {
  alert(this);
}

sayHi(); // undefined
```

在这种情况下，严格模式下的 `this` 值为 `undefined`。如果我们尝试访问 `this.name`，将会报错。

在非严格模式的情况下，`this` 将会是 **全局对象**（浏览器中的 `window`)

#### 箭头函数的this

如果在这样箭头函数中引用 `this`，`this` 值取决于外部“正常的”函数。

举个例子，这里的 `arrow()` 使用的 `this` 来自于外部的 `user.sayHi()` 方法：

```JS
let user = {
  firstName: "Ilya",
  sayHi() {
    let arrow = () => alert(this.firstName);
    arrow();
  }
};

user.sayHi(); // Ilya
```

### 不存在的属性

#### `?.`短路效应

如果 `?.` 左边部分不存在，就会立即停止运算（“短路效应”）。

因此，如果在 `?.` 的右侧有任何进一步的函数调用或操作，它们均不会执行。

```JS
let user = null;
let x = 0;

user?.sayHi(x++); // 没有 "user"，因此代码执行没有到达 sayHi 调用和 x++

alert(x); // 0，值没有增加
```

#### 其它变体`?.()` `?.[]`

可选链 `?.` 不是一个运算符，而是一个特殊的语法结构。它还可以与函数和方括号一起使用。

例如，将 `?.()` 用于调用一个可能不存在的函数。

```JS
let userAdmin = {
  admin() {
    alert("I am admin");
  }
};

let userGuest = {};

userAdmin.admin?.(); // I am admin

userGuest.admin?.(); // 啥都没发生（没有这样的方法）
```



```JS
let key = "firstName";

let user1 = {
  firstName: "John"
};

let user2 = null;

alert( user1?.[key] ); // John
alert( user2?.[key] ); // undefined
```

**可以使用** `?.` **来安全地读取或删除，但不能写入**

可选链 `?.` 不能用在赋值语句的左侧

```JS
let user = null;

user?.name = "John"; // Error，不起作用
// 因为它在计算的是：undefined = "John"
```


## Promise
Promise 是一种用于处理异步操作的对象。它代表了一个异步操作的最终完成（或失败）及其结果值
### 问题引入
JavaScript 是单线程的，这意味着它一次只能执行一个任务。对于像网络请求（Ajax）、文件读取、定时器等耗时操作，如果同步执行，会导致页面卡死，用户体验极差。因此，这些操作通常都是异步的。

传统上，异步操作通过回调函数来处理：
```JS
// 传统回调函数示例：回调地狱
getData('api/users', function(users) {
  getPosts(users[0].id, function(posts) {
    getComments(posts[0].id, function(comments) {
      console.log('Got all data:', { users, posts, comments });
    }, function(err) {
      console.error('Error getting comments:', err);
    });
  }, function(err) {
    console.error('Error getting posts:', err);
  });
}, function(err) {
  console.error('Error getting users:', err);
});
```
这种层层嵌套的回调函数结构，被称为“回调地狱”，它导致代码难以阅读、调试和错误处理。Promise 就是为了解决这个问题而诞生的。
### Promise的三种状态
1. Pending (进行中)：初始状态，既不是成功也不是失败。异步操作正在进行。

2. Fulfilled (已成功)：表示异步操作成功完成。此时，Promise 会有一个结果值 (value)。

3. Rejected (已失败)：表示异步操作失败。此时，Promise 会有一个拒绝原因 (reason)，通常是一个 Error 对象。

Promise 的状态一旦从 Pending 变为 Fulfilled 或 Rejected，就不可逆转。也就是说，一个 Promise 只能成功一次或失败一次。

### 使用方法

基本语法：

```js
const promise = new Promise((resolve, reject) => {
  // 异步操作
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve("操作成功");
    } else {
      reject("操作失败");
    }
  }, 1000);
});

promise
  .then(result => console.log(result))      // 成功时调用
  .catch(error => console.error(error))     // 失败时调用
  .finally(() => console.log("完成"));       // 不论成功失败都会调用
```

#### 创建Promise
使用 new Promise() 构造函数来创建 Promise 实例。构造函数接受一个名为**执行器 (executor)** 的函数作为参数。执行器函数本身会接收两个参数：

- resolve：一个函数，当异步操作成功时调用，将 Promise 的状态从 Pending 变为 Fulfilled，并传递成功的结果值。

- reject：一个函数，当异步操作失败时调用，将 Promise 的状态从 Pending 变为 Rejected，并传递失败的原因。
```js
const myPromise = new Promise((resolve, reject) => {
  // 模拟一个异步操作，例如 1 秒后成功
  setTimeout(() => {
    const success = true; // 假设操作成功
    if (success) {
      resolve('Data fetched successfully!'); // 成功时调用 resolve
    } else {
      reject(new Error('Failed to fetch data.')); // 失败时调用 reject
    }
  }, 1000);
});
```

#### 使用Promise

##### `then()`

`then()` 方法用于注册当 Promise 成功或失败时要执行的回调函数。它可以接受两个可选参数：

- `onFulfilled` (或 `successCallback`)：当 Promise 成功（`Fulfilled`）时调用的函数。
- `onRejected` (或 `failureCallback`)：当 Promise 失败（`Rejected`）时调用的函数。

**链式调用`then()`**

`then()` 方法总是返回一个新的 Promise。这使得你可以将多个异步操作**链式地连接起来**，形成一个线性的、更易读的流程，从而摆脱回调地狱。

```js
function fetchUser(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`User ${userId} fetched.`);
      resolve({ id: userId, name: `User ${userId} Name` });
    }, 500);
  });
}

function fetchPosts(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`Posts for user ${userId} fetched.`);
      // 模拟有时会失败
      if (userId === 102) {
        reject(new Error('Failed to fetch posts for user 102'));
      } else {
        resolve([{ postId: 1001, userId: userId, title: 'Post 1' }]);
      }
    }, 700);
  });
}

fetchUser(101)
  .then(user => {
    console.log('User:', user);
    return fetchPosts(user.id); // 返回一个新的 Promise，继续链式调用
  })
  .then(posts => {
    console.log('Posts:', posts);
    // 可以在这里进行更多操作
    return 'All data processed!';
  })
  .then(finalResult => {
    console.log('Final Result:', finalResult);
  })
  .catch(error => { // 统一处理链中任何环节的错误
    console.error('An error occurred in the chain:', error.message);
  });
/*
输出示例：
User 101 fetched.
User: { id: 101, name: 'User 101 Name' }
Posts for user 101 fetched.
Posts: [ { postId: 1001, userId: 101, title: 'Post 1' } ]
Final Result: All data processed!
*/

// 带有错误的链式调用
fetchUser(102)
  .then(user => {
    console.log('User:', user);
    return fetchPosts(user.id);
  })
  .then(posts => {
    console.log('Posts:', posts);
  })
  .catch(error => {
    console.error('An error occurred in the chain (with error user):', error.message);
  });
/*
输出示例：
User 102 fetched.
User: { id: 102, name: 'User 102 Name' }
An error occurred in the chain (with error user): Failed to fetch posts for user 102
*/
```

##### `catch()`

`catch()` 方法是 `then(null, onRejected)` 的简写形式，专门用于处理 Promise 被拒绝（`Rejected`）的情况。它通常放在 Promise 链的末尾，用于统一捕获前面所有 `then()` 链中可能抛出的错误。

```js
somePromiseReturningFunction()
  .then(data => {
    // 处理数据
  })
  .catch(error => {
    console.error('Caught an error:', error); // 捕获并处理任何错误
  });
```

> [!NOTE]
>
> 强烈建议总是在 Promise 链的末尾添加 `.catch()` 来处理错误，以避免未捕获的 Promise 拒绝。

##### `finally()`

`finally()` 方法在 Promise 无论成功还是失败后都会执行。它通常用于执行一些清理操作，例如停止加载指示器。

```js
somePromiseReturningFunction()
  .then(data => {
    console.log('Success:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  })
  .finally(() => {
    console.log('Promise finished, performing cleanup.'); // 无论成功或失败都会执行
  });
```

`finally()` 回调不接受任何参数，因为它不知道 Promise 是成功还是失败，也不会改变 Promise 的最终状态和值。

### 常见静态方法

`Promise` 构造函数本身也提供了一些有用的静态方法，用于处理多个 Promise：

##### `Promise.all(iterable)`

- **用途**：接受一个 Promise 可迭代对象（通常是 Promise 数组），并返回一个新的 Promise。
- **行为**：
  - 当**所有**传入的 Promise 都成功时，新的 Promise 才会成功，其结果是一个数组，包含所有 Promise 的成功结果，顺序与传入的 Promise 顺序一致。
  - 只要其中**任何一个** Promise 失败，`Promise.all` 返回的 Promise 就会立即失败，并返回第一个失败 Promise 的原因。
- **使用场景：**当多个不相关的异步操作都必须成功才能继续下一步时。

```js
const p1 = Promise.resolve(3);
const p2 = 42; // 非 Promise 值也会被包装成 Promise
const p3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

Promise.all([p1, p2, p3])
  .then(values => {
    console.log(values); // 输出: [3, 42, "foo"]
  })
  .catch(error => {
    console.error(error);
  });

// 带有失败的 Promise.all
const p4 = new Promise((resolve, reject) => setTimeout(reject, 200, 'Error in p4'));
const p5 = Promise.resolve('Success in p5');

Promise.all([p1, p4, p5])
  .then(values => {
    console.log(values);
  })
  .catch(error => {
    console.error('Promise.all failed:', error); // 输出: Promise.all failed: Error in p4
  });
```

---

##### `Promise.race(iterable)`

- **用途**：接受一个 Promise 可迭代对象，并返回一个新的 Promise。
- **行为**：当传入的 Promise 中**任何一个**最早解决（成功或失败）时，`Promise.race` 返回的 Promise 就会以那个 Promise 的结果（值或原因）立即解决。
- **使用场景**：当只需要最快完成的异步操作的结果时（例如，从多个 CDN 获取资源，或者设置请求超时）。

```js
const promise1 = new Promise((resolve) => setTimeout(resolve, 500, 'one'));
const promise2 = new Promise((resolve) => setTimeout(resolve, 100, 'two'));

Promise.race([promise1, promise2])
  .then(value => {
    console.log(value); // 输出: two (因为它更快)
  });

const promise3 = new Promise((resolve) => setTimeout(resolve, 500, 'three'));
const promise4 = new Promise((_, reject) => setTimeout(reject, 100, 'four error'));

Promise.race([promise3, promise4])
  .then(value => {
    console.log(value);
  })
  .catch(error => {
    console.error('Promise.race failed:', error); // 输出: Promise.race failed: four error (它更快失败)
  });
```

---

##### `Promise.any(iterable)`

**用途**：接受一个 Promise 可迭代对象，并返回一个新的 Promise。

**行为**：

- 当传入的 Promise 中**任何一个**成功时，`Promise.any` 返回的 Promise 就会立即成功，并返回第一个成功 Promise 的结果。
- 只有当**所有**传入的 Promise 都失败时，它才会失败，并返回一个 `AggregateError`，其中包含所有失败的原因。

**使用场景：**当多个异步操作中，只要有一个成功就足够时。

```js
const pA = new Promise((resolve) => setTimeout(resolve, 200, 'A resolved'));
const pB = new Promise((_, reject) => setTimeout(reject, 100, 'B rejected'));
const pC = new Promise((_, reject) => setTimeout(reject, 300, 'C rejected'));

Promise.any([pB, pC, pA])
  .then(value => {
    console.log(value); // 输出: A resolved (因为A是第一个成功的，即使B和C更快失败)
  })
  .catch(error => {
    console.error('Promise.any failed:', error);
  });

const pD = new Promise((_, reject) => setTimeout(reject, 100, 'D rejected'));
const pE = new Promise((_, reject) => setTimeout(reject, 50, 'E rejected'));

Promise.any([pD, pE])
  .then(value => {
    console.log(value);
  })
  .catch(error => {
    console.error('All failed:', error); // 输出: All failed: AggregateError: All promises were rejected
    console.log(error.errors); // [ 'D rejected', 'E rejected' ] (具体失败原因)
  });
```

---

##### `Promise.allSettled(iterable)`

- **用途**：接受一个 Promise 可迭代对象，并返回一个新的 Promise。
- **行为**：当**所有**传入的 Promise 都已解决（无论是成功还是失败）时，`Promise.allSettled` 返回的 Promise 才会成功。其结果是一个数组，每个元素都是一个对象，描述了对应 Promise 的最终状态和结果（`status: 'fulfilled'` 和 `value` 或 `status: 'rejected'` 和 `reason`）。
- **使用场景**：当你需要知道所有异步操作的结果，无论它们成功还是失败时（例如，发送一系列独立日志请求，然后统计每个请求的状态）。

```js
const pSuccess = Promise.resolve('Success data');
const pFailure = new Promise((_, reject) => setTimeout(reject, 100, 'Failure reason'));
const pPending = new Promise(() => {}); // 一个永远不会解决的 Promise

Promise.allSettled([pSuccess, pFailure, pPending])
  .then(results => {
    console.log(results);
    /*
    输出:
    [
      { status: 'fulfilled', value: 'Success data' },
      { status: 'rejected', reason: 'Failure reason' },
      // pPending 永远不会解决，所以 Promise.allSettled 永远不会 resolve
      // 如果没有 pPending，它会在 pSuccess 和 pFailure 都解决后立即返回
    ]
    */
  });

// Corrected Example without infinite pending:
const pSuccess2 = Promise.resolve('Success data 2');
const pFailure2 = new Promise((_, reject) => setTimeout(reject, 100, 'Failure reason 2'));

Promise.allSettled([pSuccess2, pFailure2])
  .then(results => {
    console.log(results);
    /*
    输出:
    [
      { status: 'fulfilled', value: 'Success data 2' },
      { status: 'rejected', reason: 'Failure reason 2' }
    ]
    */
  });
```

### async/await

`async/await` 是 ES2017 引入的语法糖，它建立在 Promise 的基础上，使得异步代码的编写变得更像同步代码，极大地提高了可读性。

#### 语法形式

```js
async function loadData() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

#### 核心特性

##### async函数

- 总是返回Promise
- 返回值会自动包装为Promise

```js
async function foo() { return 1; }
// 等价于
function foo() { return Promise.resolve(1); }
```

##### await表达式

- 只能用在async函数中
- 会暂停async函数执行，等待Promise解决
- 对非Promise值也会自动包装

##### 错误处理

```js
async function getUser() {
  try {
    const user = await fetchUser();
    const posts = await fetchPosts(user.id);
    return { user, posts };
  } catch (error) {
    // 统一处理所有await错误
    console.log('Failed:', error);
    throw error; // 可以选择继续抛出
  }
}
```

#### 转换关系

##### async/await -> Promise

```js
async function example() {
  await a();
  b();
}

// 等价于
function example() {
  return a().then(b);
}
```

##### Promise -> async/await

```js
function example() {
  return fetchData()
    .then(data => process(data))
    .catch(err => handleError(err));
}

// 转换为
async function example() {
  try {
    const data = await fetchData();
    return process(data);
  } catch (err) {
    return handleError(err);
  }
}
```

### 时序

#### 总览

JavaScript 的时序模型是基于其**单线程**、**事件循环（Event Loop）** 和 **任务队列（Task Queues）** 的特性。

当你看到一段代码时，可以按照以下步骤来推断执行顺序：

1. **执行所有同步代码**。
2. **收集宏任务和微任务**：当遇到异步 API 时，将其回调函数注册到对应的宏任务队列或微任务队列中。
3. **清空微任务队列**：在所有同步代码执行完毕后，立即执行微任务队列中的所有任务。
4. **执行下一个宏任务**：当微任务队列清空后，从宏任务队列中取出并执行一个宏任务。
5. **重复 3 和 4**：继续循环，直到两个队列都清空。

| 类型                    | 执行时间                 | 例子                                                 |
| ----------------------- | ------------------------ | ---------------------------------------------------- |
| 同步代码                | 立即执行                 | `console.log()`、赋值语句                            |
| 异步宏任务（macrotask） | 一轮事件循环执行完后     | `setTimeout`、`setInterval`、`requestAnimationFrame` |
| 异步微任务（microtask） | 当前宏任务完成后立即执行 | `Promise.then`、`queueMicrotask`、`MutationObserver` |

示例代码：

```JS
console.log('Global Start'); // 同步任务 1

setTimeout(() => {
  console.log('Macro A - setTimeout'); // 宏任务 A
}, 0);

Promise.resolve()
  .then(() => {
    console.log('Micro B - Promise.then'); // 微任务 B
  })
  .then(() => {
    console.log('Micro C - Promise.then 2'); // 微任务 C (在 B 之后加入微任务队列)
  });

setTimeout(() => {
  console.log('Macro D - setTimeout 2'); // 宏任务 D
}, 0);

console.log('Global End'); // 同步任务 2

// 预期输出顺序：
// 1. Global Start (同步)
// 2. Global End (同步)
// 3. Micro B - Promise.then (微任务队列清空，B 先)
// 4. Micro C - Promise.then 2 (微任务队列清空，C 后)
// 5. Macro A - setTimeout (宏任务队列取出第一个)
// 6. Macro D - setTimeout 2 (宏任务队列取出第二个)
```



#### 宏任务队列

宏任务是构成事件循环的每一次循环的基本单位。每个宏任务执行完毕后，事件循环会检查微任务队列，然后才会执行下一个宏任务。

**宏任务的特点：**

- **执行时机**：在每次事件循环中，JavaScript 引擎会从宏任务队列中取出**一个**任务来执行。
- **优先级**：相对较低。
- **常见来源**：
  - **`setTimeout()`**：定时器回调。
  - **`setInterval()`**：定时器回调。
  - **I/O 操作**：例如，Node.js 中的文件读写、网络请求回调（在浏览器中，`fetch` 等网络请求本身的完成事件是宏任务，但其 `.then()` 回调是微任务）。
  - **UI 渲染**：浏览器中页面的重绘和重排。
  - **`MessageChannel`**：跨浏览器 / Node.js 的消息通信。
  - **`requestAnimationFrame()`**：动画帧回调（在某些实现中，它被视为宏任务的一种特殊形式，或者在下次重绘前执行）。

示例代码：

```JS
console.log('Script start'); // 同步任务 1

setTimeout(() => {
  console.log('setTimeout callback (Macro A)'); // 宏任务 A
}, 0);

setTimeout(() => {
  console.log('setTimeout callback (Macro B)'); // 宏任务 B
}, 0);

console.log('Script end'); // 同步任务 2
```

1. `'Script start'` 同步执行。
2. 两个 `setTimeout` 回调被注册为宏任务，并进入宏任务队列。
3. `'Script end'` 同步执行。
4. 主线程（调用栈）空闲。事件循环开始。
5. 事件循环从宏任务队列中取出**第一个**宏任务 (Macro A) 并执行。
6. 事件循环从宏任务队列中取出**第二个**宏任务 (Macro B) 并执行。

输出结果：

```JS
Script start
Script end
setTimeout callback (Macro A)
setTimeout callback (Macro B)
```



#### 微任务队列

微任务是在当前宏任务执行结束后、下一个宏任务开始之前执行的任务。它们具有更高的优先级。

**微任务的特点：**

- **执行时机**：在每个宏任务执行完毕后，JavaScript 引擎会立即检查微任务队列，并**一次性执行完所有**在队列中的微任务。只有当微任务队列清空后，事件循环才会考虑执行下一个宏任务。
- **优先级**：**高优先级**。
- **常见来源**：
  - **`Promise` 的回调**：`.then()`, `.catch()`, `.finally()`。
  - **`MutationObserver`**：用于观察 DOM 树变化的 API。
  - **`queueMicrotask()`**：显式地将一个函数添加到微任务队列。
  - **`async/await` 中的 `await` 后的代码**（`await` 后面的部分会作为微任务执行）。

示例代码：

```JS
console.log('Script start'); // 同步任务 1

setTimeout(() => {
  console.log('setTimeout callback (Macro A)'); // 宏任务 A
}, 0);

Promise.resolve()
  .then(() => {
    console.log('Promise.then callback (Micro B)'); // 微任务 B
  })
  .then(() => {
    console.log('Promise.then callback 2 (Micro C)'); // 微任务 C
  });

console.log('Script end'); // 同步任务 2
```

1. `'Script start'` 同步执行。
2. `setTimeout` 回调被注册为宏任务 (Macro A)，进入宏任务队列。
3. `Promise.resolve()` 立即解决，其 `.then()` 回调 (Micro B) 被注册为微任务，进入微任务队列。
4. Micro B 内部的 `.then()` 又注册了一个微任务 (Micro C)，进入微任务队列。
5. `'Script end'` 同步执行。
6. 主线程（调用栈）空闲。事件循环开始。
7. **首先清空微任务队列**：执行 Micro B，然后执行 Micro C。
8. 微任务队列清空。
9. 事件循环从宏任务队列中取出**下一个**宏任务 (Macro A) 并执行。

输出结果：

```JS
Script start
Script end
Promise.then callback (Micro B)
Promise.then callback 2 (Micro C)
setTimeout callback (Macro A)
```

## 类型化数组

### 概述

在 JavaScript 中，**类型化数组 (Typed Arrays)** 是一种专门用于处理**二进制数据**的数组状结构。它们提供了一种高效的方式来存储和操作固定大小的数值数据，例如字节、整数、浮点数等。

与常规的 JavaScript 数组（它们可以存储任何类型的值，并且是动态大小的）不同，类型化数组是：

- **定长 (Fixed-length)**：一旦创建，其长度就不能改变。
- **同构 (Homogeneous)**：所有元素都必须是同一种特定的数值类型（例如，都是 32 位整数，或者都是 64 位浮点数）。
- **直接的内存访问**：它们直接操作底层的二进制数据缓冲区，这使得它们在处理大量数值数据时效率远高于常规数组。

类型化数组通常用于高性能场景，例如：

- **WebGL 和 Canvas 2D 图像处理**：操作像素数据。
- **音频和视频处理**：处理原始音频样本或视频帧。
- **WebSocket 和 WebRTC**：发送和接收二进制数据。
- **WebAssembly (Wasm)**：与 WebAssembly 模块进行高效的数据交换。
- **文件操作**：在浏览器或 Node.js 中处理文件流。

### 组成部分

#### ArrayBuffer(原始二进制数据缓冲区)

`ArrayBuffer` 是一个**固定长度的原始二进制数据缓冲区**。它本身不直接存储任何数据，也无法直接读写。它就像一块内存区域，你需要通过视图来访问其中的数据。

```JS
const buffer = new ArrayBuffer(16); // 创建一个 16 字节的 ArrayBuffer
console.log(buffer.byteLength); // 16
```

#### DataView(数据视图)

`DataView` 允许你以**不同类型**（如 8 位整数、16 位浮点数等）和**自定义字节序**（大端序或小端序）来读写 `ArrayBuffer` 中的数据。它提供了对缓冲区的精细控制，但相对不那么方便批量操作。

```JS
const buffer = new ArrayBuffer(16);
const view = new DataView(buffer);

view.setInt32(0, 12345678, false); // 在偏移量 0 处写入一个 32 位整数 (大端序)
console.log(view.getInt32(0, false)); // 12345678 (读取大端序)

view.setFloat64(4, 3.14159, true); // 在偏移量 4 处写入一个 64 位浮点数 (小端序)
console.log(view.getFloat64(4, true)); // 3.14159 (读取小端序)
```

#### Typed Array View(类型化数组视图)

类型化数组视图是**最常用**的方式来操作 `ArrayBuffer`。它们提供了一种像普通数组一样便捷的接口，来操作特定类型的数值数据。每个视图都绑定到一个 `ArrayBuffer`，并自动处理字节序和数据类型。

##### 构造函数一览表

| 类型              | 每个元素大小（字节） | 范围                           | 用途                             |
| ----------------- | -------------------- | ------------------------------ | -------------------------------- |
| Int8Array         | 1                    | -128 ~ 127                     | 有符号 8 位整数                  |
| Uint8Array        | 1                    | 0 ~ 255                        | 无符号 8 位整数（最常用）        |
| Uint8ClampedArray | 1                    | 0 ~ 255                        | 超出范围时“夹住”（用于图像像素） |
| Int16Array        | 2                    | -32,768 ~ 32,767               | 16 位整数                        |
| Uint16Array       | 2                    | 0 ~ 65,535                     | 无符号 16 位整数                 |
| Int32Array        | 4                    | -2,147,483,648 ~ 2,147,483,647 | 32 位整数                        |
| Uint32Array       | 4                    | 0 ~ 4,294,967,295              | 无符号 32 位整数                 |
| Float32Array      | 4                    | 单精度浮点数                   | WebGL 顶点坐标                   |
| Float64Array      | 8                    | 双精度浮点数                   | 高精度计算                       |

##### 创建方式

###### 直接创建

创建一个新的内部 `ArrayBuffer`

```JS
const uint8 = new Uint8Array(5); // 创建一个包含 5 个 8 位无符号整数的数组，默认值为 0
console.log(uint8); // Uint8Array [0, 0, 0, 0, 0]
uint8[0] = 255;
uint8[1] = 100;
console.log(uint8); // Uint8Array [255, 100, 0, 0, 0]
```

###### 从现有 `ArrayBuffer` 创建

```JS
const buffer = new ArrayBuffer(12); // 12 字节
const int32View = new Int32Array(buffer); // 12字节 / 4字节/Int32 = 3个Int32
console.log(int32View.length); // 3

int32View[0] = 10;
int32View[1] = 20;
int32View[2] = 30;
console.log(int32View); // Int32Array [10, 20, 30]

// 不同的视图可以共享同一个 ArrayBuffer
const uint8View = new Uint8Array(buffer); // 12个8位无符号整数
console.log(uint8View.length); // 12
console.log(uint8View[0]); // 10 (因为 int32View[0] 的 10 占据了前 4 个字节)
console.log(uint8View[4]); // 20 的第一个字节
```

###### 从其他类型化数组或数组状对象创建

```JS
const arr = [1, 2, 3, 256];
const uint8FromArr = new Uint8Array(arr); // 256 会被截断到 0 (256 % 256)
console.log(uint8FromArr); // Uint8Array [1, 2, 3, 0]

const float32FromUint8 = new Float32Array(uint8FromArr);
console.log(float32FromUint8); // Float32Array [1, 2, 3, 0]
```



