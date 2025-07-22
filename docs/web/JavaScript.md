---
title: TypeScript
shortTitle: TypeScript
description: 
date: 2024-06-16 22:30:07
categories: [前端,JavaScript]
tags: []
---

[现代 JavaScript 教程](https://zh.javascript.info/)

[简介 - JavaScript教程 - 廖雪峰的官方网站](https://liaoxuefeng.com/books/javascript/introduction/index.html)

## 基础语法

### 运算符

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

`for...in` 循环用于遍历对象**可枚举属性的键（key）**。它会遍历对象自身的所有可枚举属性，以及它原型链上所有可枚举的属性。

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

## OOP

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

#### 箭头函数没有自己的this

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

#### 短路效应

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

### Symbol类型

[symbol 类型](https://zh.javascript.info/symbol)

#### symbol

根据规范，只有两种原始类型可以用作对象属性键：

- 字符串类型
- symbol 类型

否则，如果使用另一种类型，例如数字，它会被自动转换为字符串。所以 `obj[1]` 与 `obj["1"]` 相同，而 `obj[true]` 与 `obj["true"]` 相同。

---

“symbol” 值表示唯一的标识符。

可以使用 `Symbol()` 来创建这种类型的值：

```JS
let id = Symbol();
```

创建时，我们可以给 symbol 一个描述（也称为 symbol 名），这在代码调试时非常有用

```JS
// id 是描述为 "id" 的 symbol
let id = Symbol("id");
```

symbol 保证是唯一的。即使我们创建了许多具有相同描述的 symbol，它们的值也是不同。描述只是一个标签，不影响任何东西。

例如，这里有两个描述相同的 symbol —— 它们不相等：

```JS
let id1 = Symbol("id");
let id2 = Symbol("id");

alert(id1 == id2); // false
```

---

**symbol 不会被自动转换为字符串**

JavaScript 中大多数值都支持字符串的隐式转换。例如`alert` 任何值，都可以生效。symbol 比较特殊，它不会被自动转换。

例如，这个 `alert` 将会提示出错：

```JS
let id = Symbol("id");
alert(id); // 类型错误：无法将 symbol 值转换为字符串。
```

这是一种防止混乱的“语言保护”，因为字符串和 symbol 有本质上的不同，不应该意外地将它们转换成另一个。

如果我们真的想显示一个 symbol，我们需要在它上面调用 `.toString()`，如下所示：

```JS
let id = Symbol("id");
alert(id.toString()); // Symbol(id)，现在它有效了
```

或者获取 `symbol.description` 属性，只显示描述（description）：

```JS
let id = Symbol("id");
alert(id.description); // id
```

#### "隐藏属性"

symbol 允许我们创建对象的“隐藏”属性，代码的任何其他部分都不能意外访问或重写这些属性。

例如，如果我们使用的是属于第三方代码的 `user` 对象，我们想要给它们添加一些标识符。

我们可以给它们使用 symbol 键：

```JS
let user = { // 属于另一个代码
  name: "John"
};

let id = Symbol("id");

user[id] = 1;

alert( user[id] ); // 我们可以使用 symbol 作为键来访问数据
```

使用 `Symbol("id")` 作为键，比起用字符串 `"id"` 来有什么好处呢？

由于 `user` 对象属于另一个代码库，所以向它们添加字段是不安全的，因为我们可能会影响代码库中的其他预定义行为。但 symbol 属性不会被意外访问到。第三方代码不会知道新定义的 symbol，因此将 symbol 添加到 `user` 对象是安全的。

另外，假设另一个脚本希望在 `user` 中有自己的标识符，以实现自己的目的。

那么，该脚本可以创建自己的 `Symbol("id")`，像这样：

```JS
let id = Symbol("id");

user[id] = "Their id value";
```

我们的标识符和它们的标识符之间不会有冲突，因为 symbol 总是不同的，即使它们有相同的名字。

……但如果我们处于同样的目的，使用字符串 `"id"` 而不是用 symbol，那么 **就会** 出现冲突：

```JS
let user = { name: "John" };

// 我们的脚本使用了 "id" 属性。
user.id = "Our id value";

// ……另一个脚本也想将 "id" 用于它的目的……

user.id = "Their id value"
// 砰！无意中被另一个脚本重写了 id！
```

---

##### 对象字面量中的symbol

如果我们要在对象字面量 `{...}` 中使用 symbol，则需要使用方括号把它括起来。

就像这样：

```JS
let id = Symbol("id");

let user = {
  name: "John",
  [id]: 123 // 而不是 "id"：123
};
```

这是因为我们需要变量 `id` 的值作为键，而不是字符串 “id”。

##### 不参与循环

symbol 属性不参与 `for..in` 循环。

```JS
let id = Symbol("id");
let user = {
  name: "John",
  age: 30,
  [id]: 123
};

for (let key in user) alert(key); // name, age（没有 symbol）

// 使用 symbol 任务直接访问
alert("Direct: " + user[id]); // Direct: 123
```

[Object.keys(user)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) 也会忽略它们。这是一般“隐藏符号属性”原则的一部分。如果另一个脚本或库遍历我们的对象，它不会意外地访问到符号属性。

相反，[Object.assign](https://developer.mozilla.org/zh/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) 会同时复制字符串和 symbol 属性：

```JS
let id = Symbol("id");
let user = {
  [id]: 123
};

let clone = Object.assign({}, user);

alert( clone[id] ); // 123
```

#### 全局Symbol



#### 系统Symbol
