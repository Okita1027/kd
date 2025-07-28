---
title: TypeScript
shortTitle: TypeScript
description: 
date: 2024-06-16 22:30:07
categories: [前端,TypeScript]
tags: []
---

> [TypeScript 阮一峰 | 阮一峰 TypeScript 教程](https://typescript.p6p.net/)
>
> [TypeScript 中文教程 | 从类型入门到架构设计](https://ts.p6p.net/)
>
> [TypeScript 中文网: 手册 - TypeScript 手册](https://ts.nodejs.cn/docs/handbook/intro.html)
>
> [TypeScript 教程 - 网道](https://wangdoc.com/typescript/)



```MERMAID
mindmap
  root((TypeScript 知识体系))
    基础语法
      标准类型
        字符串 string
        数字 number
        布尔 boolean
        空值 void
        任意 any/unknown
        空类型 null/undefined
        never 类型
      类型注解
      类型推断
      类型断言
      联合类型/交叉类型
      字面量类型
    对象类型
      接口 interface
      类型别名 type
      可选属性
      只读属性
      索引签名
      扩展与合并
    函数类型
      参数类型
      返回值类型
      可选参数/默认值
      剩余参数
      函数重载
    类与面向对象
      类定义
      构造函数
      访问修饰符 public/private/protected
      只读属性 readonly
      静态属性 static
      抽象类 abstract
      接口实现 implements
      继承 extends
    高级类型
      keyof/typeof
      泛型 Generics
        泛型约束
        泛型工具类型
      条件类型
      映射类型
      索引访问类型
      类型守卫
        typeof 判断
        in 判断
        instanceof 判断
        自定义类型保护
    模块化
      import/export
      声明文件 .d.ts
      命名空间 namespace
    工具类型
      Partial<T>
      Required<T>
      Readonly<T>
      Pick<T>
      Omit<T>
      Record<K, T>
      ReturnType<T>
      Parameters<T>
      Awaited<T>
    配置与编译
      tsconfig.json
        compilerOptions
        include/exclude
        strict 模式
      编译流程
      Babel + TS
    类型检查机制
      类型兼容性
      类型收窄
      类型拓宽
      类型擦除
      类型系统 vs 值运行时
    实践与生态
      与 JavaScript 互操作
      React 中使用 TypeScript
      Vue 中使用 TypeScript
      Node.js 中使用 TypeScript
      常见库的类型声明

```

## 基本使用

### 类型声明

### 类型推断

### 值与类型

某些 关键字 同时拥有 值与类型 这两种描述

## 类型系统

### 基本类型

JavaScript 语言（注意，不是 TypeScript）将值分成 8 种类型。

- boolean
- string
- number
- bigint
- symbol
- object
- undefined
- null

TypeScript 继承了 JavaScript 的类型设计，以上 8 种类型可以看作 TypeScript 的基本类型。

注意，上面所有类型的名称都是小写字母，首字母大写的`Number`、`String`、`Boolean`等在 JavaScript 语言中都是内置对象，而不是类型名称。

另外，undefined 和 null 既可以作为值，也可以作为类型，取决于在哪里使用它们。

这 8 种基本类型是 TypeScript 类型系统的基础，复杂类型由它们组合而成。

---

#### boolean

#### string

#### number

`number`类型包含所有整数和浮点数。

```TS
const x: number = 123;
const y: number = 3.14;
const z: number = 0xffff;
```

上面示例中，整数、浮点数和非十进制数都属于 number 类型。

---

#### bigint

bigint 类型包含所有的大整数。

```TS
const x: bigint = 123n;
const y: bigint = 0xffffn;
```

上面示例中，变量`x`和`y`就属于 bigint 类型。

bigint 与 number 类型不兼容。

```TS
const x: bigint = 123; // 报错
const y: bigint = 3.14; // 报错
```

上面示例中，`bigint`类型赋值为整数和小数，都会报错。

> bigint 类型是 ES2020 标准引入的。如果使用这个类型，TypeScript 编译的目标 JavaScript 版本不能低于 ES2020（即编译参数`target`不低于`es2020`）。

---

#### symbol

symbol 类型包含所有的 Symbol 值。

```TS
const x: symbol = Symbol();
```

上面示例中，`Symbol()`函数的返回值就是 symbol 类型。

---

#### object

根据 JavaScript 的设计，object 类型包含了所有对象、数组和函数。

```TS
const x: object = { foo: 123 };
const y: object = [1, 2, 3];
const z: object = (n: number) => n + 1;
```

上面示例中，对象、数组、函数都属于 object 类型。

---

#### undefined

#### null

undefined 和 null 是两种独立类型，它们各自都只有一个值。

undefined 类型只包含一个值`undefined`，表示未定义（即还未给出定义，以后可能会有定义）。

```TS
let x: undefined = undefined;
```

上面示例中，变量`x`就属于 undefined 类型。两个`undefined`里面，第一个是类型，第二个是值。

null 类型也只包含一个值`null`，表示为空（即此处没有值）。

```TS
const x: null = null;
```

上面示例中，变量`x`就属于 null 类型。

> [!NOTE]
>
> 如果没有声明类型的变量，被赋值为`undefined`或`null`，它们的类型会被推断为`any`。

```TS
let a = undefined; // any
const b = undefined; // any

let c = null; // any
const d = null; // any
```

如果希望避免这种情况，则需要打开编译选项`strictNullChecks`。

```TS
// 打开编译设置 strictNullChecks
let a = undefined; // undefined
const b = undefined; // undefined

let c = null; // null
const d = null; // null
```

上面示例中，打开编译设置`strictNullChecks`以后，赋值为`undefined`的变量会被推断为`undefined`类型，赋值为`null`的变量会被推断为`null`类型。

### 包装对象类型

JavaScript 的 8 种类型之中，`undefined`和`null`其实是两个特殊值，`object`属于复合类型，剩下的五种属于原始类型（primitive value），代表最基本的、不可再分的值。

- boolean
- string
- number
- bigint
- symbol

上面这五种原始类型的值，都有对应的包装对象（wrapper object）。所谓“包装对象”，指的是这些值在需要时，会自动产生的对象。

五种包装对象之中，symbol 类型和 bigint 类型无法直接获取它们的包装对象（即`Symbol()`和`BigInt()`不能作为构造函数使用），但是剩下三种可以。

- `Boolean()`
- `String()`
- `Number()`

> [!NOTE]
>
> `String()`只有当作构造函数使用时（即带有`new`命令调用），才会返回包装对象。如果当作普通函数使用（不带有`new`命令），返回就是一个普通字符串。其他两个构造函数`Number()`和`Boolean()`也是如此。

### Object与object

##### Object

大写的`Object`类型代表 JavaScript 语言里面的广义对象。所有可以转成对象的值，都是`Object`类型，这囊括了几乎所有的值。

```TS
let obj: Object;

obj = true;
obj = "hi";
obj = 1;
obj = { foo: 123 };
obj = [1, 2];
obj = (a: number) => a + 1;
```

上面示例中，原始类型值、对象、数组、函数都是合法的`Object`类型。

事实上，除了`undefined`和`null`这两个值不能转为对象，其他任何值都可以赋值给`Object`类型。

```TS
let obj: Object;

obj = undefined; // 报错
obj = null; // 报错
```

上面示例中，`undefined`和`null`赋值给`Object`类型，就会报错。

另外，空对象`{}`是`Object`类型的简写形式，所以使用`Object`时常常用空对象代替。

```TS
let obj: {};

obj = true;
obj = "hi";
obj = 1;
obj = { foo: 123 };
obj = [1, 2];
obj = (a: number) => a + 1;
```

上面示例中，变量`obj`的类型是空对象`{}`，就代表`Object`类型。

##### object

小写的`object`类型代表 JavaScript 里面的狭义对象，即可以用字面量表示的对象，只包含*对象、数组和函数*，不包括原始类型的值。

```TS
let obj: object;

obj = { foo: 123 };
obj = [1, 2];
obj = (a: number) => a + 1;
obj = true; // 报错
obj = "hi"; // 报错
obj = 1; // 报错
```

上面示例中，`object`类型不包含原始类型值，只包含对象、数组和函数。

大多数时候，我们使用对象类型，只希望包含真正的对象，不希望包含原始类型。所以，建议总是使用小写类型`object`，不使用大写类型`Object`。

> [!NOTE]
>
> 无论是大写的`Object`类型，还是小写的`object`类型，都只包含 JavaScript 内置对象原生的属性和方法，用户自定义的属性和方法都不存在于这两个类型之中。

```TS
const o1: Object = { foo: 0 };
const o2: object = { foo: 0 };

o1.toString(); // 正确
o1.foo; // 报错

o2.toString(); // 正确
o2.foo; // 报错
```

上面示例中，`toString()`是对象的原生方法，可以正确访问。`foo`是自定义属性，访问就会报错。

### undefined和null

`undefined`和`null`既是值，又是类型。

作为值，它们有一个特殊的地方：任何其他类型的变量都可以赋值为`undefined`或`null`。

```TS
let age: number = 24;

age = null; // 正确
age = undefined; // 正确
```

上面代码中，变量`age`的类型是`number`，但是赋值为`null`或`undefined`并不报错。

这并不是因为`undefined`和`null`包含在`number`类型里面，而是故意这样设计，任何类型的变量都可以赋值为`undefined`和`null`，以便跟 JavaScript 的行为保持一致。

JavaScript 的行为是，变量如果等于`undefined`就表示还没有赋值，如果等于`null`就表示值为空。所以，TypeScript 就允许了任何类型的变量都可以赋值为这两个值。

但是有时候，这并不是开发者想要的行为，也不利于发挥类型系统的优势。

```TS
const obj: object = undefined;
obj.toString(); // 编译不报错，运行就报错
```

上面示例中，变量`obj`等于`undefined`，编译不会报错。但是，实际执行时，调用`obj.toString()`就报错了，因为`undefined`不是对象，没有这个方法。

为了避免这种情况，及早发现错误，TypeScript 提供了一个编译选项`strictNullChecks`。只要打开这个选项，`undefined`和`null`就不能赋值给其他类型的变量（除了`any`类型和`unknown`类型）。

下面是 tsc 命令打开这个编译选项的例子:

```TS
// tsc --strictNullChecks app.ts

let age: number = 24;

age = null; // 报错
age = undefined; // 报错
```

上面示例中，打开`--strictNullChecks`以后，`number`类型的变量`age`就不能赋值为`undefined`和`null`。

这个选项在配置文件`tsconfig.json`的写法如下:

```json
{
  "compilerOptions": {
    "strictNullChecks": true
    // ...
  }
}
```

打开`strictNullChecks`以后，`undefined`和`null`这两种值也不能互相赋值了。

```ts
// 打开 strictNullChecks

let x: undefined = null; // 报错
let y: null = undefined; // 报错
```

总之，打开`strictNullChecks`以后，`undefined`和`null`只能赋值给自身，或者`any`类型和`unknown`类型的变量。

```ts
let x: any = undefined;
let y: unknown = null;
```

### 值类型

TypeScript 规定，单个值也是一种类型，称为“值类型”。

```ts
let x: "hello";

x = "hello"; // 正确
x = "world"; // 报错
```

上面示例中，变量`x`的类型是字符串`hello`，导致它只能赋值为这个字符串，赋值为其他字符串就会报错。

TypeScript 推断类型时，遇到`const`命令声明的变量，如果代码里面没有注明类型，就会推断该变量是值类型。

```ts
// x 的类型是 "https"
const x = "https";

// y 的类型是 string
const y: string = "https";
```

上面示例中，变量`x`是`const`命令声明的，TypeScript 就会推断它的类型是值`https`，而不是`string`类型。

这样推断是合理的，因为`const`命令声明的变量，一旦声明就不能改变，相当于常量。值类型就意味着不能赋为其他值。

> [!NOTE]
>
> `const`命令声明的变量，如果赋值为对象，并不会推断为值类型。

```ts
// x 的类型是 { foo: number }
const x = { foo: 1 };
```

上面示例中，变量`x`没有被推断为值类型，而是推断属性`foo`的类型是`number`。这是因为 JavaScript 里面，`const`变量赋值为对象时，属性值是可以改变的。

值类型可能会出现一些很奇怪的报错:

```ts
const x: 5 = 4 + 1; // 报错
```

上面示例中，等号左侧的类型是数值`5`，等号右侧`4 + 1`的类型，TypeScript 推测为`number`。由于`5`是`number`的子类型，`number`是`5`的父类型，父类型不能赋值给子类型，所以报错了

但是，反过来是可以的，子类型可以赋值给父类型:

```ts
let x: 5 = 5;
let y: number = 4 + 1;

x = y; // 报错
y = x; // 正确
```

如果一定要让子类型可以赋值为父类型的值，就要用到类型断言:

```ts
const x: 5 = (4 + 1) as 5; // 正确
```

### `type`

`type`命令用来定义一个类型的别名。

```ts
type Age = number;

let age: Age = 55;
```

上面示例中，`type`命令为`number`类型定义了一个别名`Age`。这样就能像使用`number`一样，使用`Age`作为类型。

别名不允许重名。

```ts
type Color = "red";
type Color = "blue"; // 报错
```

### `typeof`

#### 语法

语法: `typeof operand` 或 `typeof(operand)`。

```ts
// 作为一元操作符
console.log(typeof 42); // "number"

// 带有括号
console.log(typeof("hello")); // "string"
```

`typeof` 的返回值始终是**一个字符串**。它的返回值主要包括以下几种：

| 类型      | 示例                    | 返回值      | 说明                                   |
| --------- | ----------------------- | ----------- | -------------------------------------- |
| string    | abc', ""                | "string"    | 字符串类型                             |
| number    | 42, 3.14, NaN, Infinity | "number"    | 数字类型（包括特殊值 NaN 和 Infinity） |
| boolean   | true, false             | "boolean"   | 布尔类型                               |
| bigint    | 10n                     | "bigint"    | 大整数类型（ES11 新增）                |
| symbol    | Symbol('foo')           | "symbol"    | 符号类型（ES6 新增）                   |
| undefined | undefined, 未声明的变量 | "undefined" | 未定义类型                             |
| object    | {}, [], null            | "object"    | 对象类型（包括数组和 null）            |
| function  | function() {}           | "function"  | 函数类型                               |

#### 需注意的类型

##### null => object



##### NaN => number



##### 数组 => object



##### 

### 特殊类型

#### any

对于开发者没有指定类型、TypeScript 必须自己推断类型的那些变量，如果无法推断出类型，TypeScript 就会认为该变量的类型是`any`。

```TS
function add(x, y) {
  return x + y;
}

add(1, [1, 2, 3]); // 不报错
```

TypeScript 提供了一个编译选项`noImplicitAny`，打开该选项，只要推断出`any`类型就会报错。

```BASH
tsc --noImplicitAny app.ts
```

这里有一个特殊情况，即使打开了`noImplicitAny`，使用`let`和`var`命令声明变量，但不赋值也不指定类型，是不会报错的。

```TS
var x; // 不报错
let y; // 不报错
```

```TS
let x;

x = 123;
x = { foo: "hello" };
```

由于这个原因，建议使用`let`和`var`声明变量时，如果不赋值，就一定要显式声明类型，否则可能存在安全隐患。

`const`命令没有这个问题，因为 JavaScript 语言规定`const`声明变量时，必须同时进行初始化（赋值）。

```TS
const x; // 报错
```

**污染问题：**

`any`类型除了关闭类型检查，还有一个很大的问题，就是它会“污染”其他变量。它可以赋值给其他任何类型的变量（因为没有类型检查），导致其他变量出错。

```TS
let x: any = "hello";
let y: number;

y = x; // 不报错

y * 123; // 不报错
y.toFixed(); // 不报错
```

#### unknown

为了解决`any`类型“污染”其他变量的问题，TypeScript 3.0 引入了[`unknown`类型](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type)。它与`any`含义相同，表示类型不确定，可能是任意类型，但是它的使用有一些限制，不像`any`那样自由，可以视为严格版的`any`。

`unknown`跟`any`的相似之处，在于所有类型的值都可以分配给`unknown`类型。

```TS
let x: unknown;

x = true; // 正确
x = 42; // 正确
x = "Hello World"; // 正确
```

---

`unknown`类型跟`any`类型的不同之处在于，它不能直接使用。主要有以下几个限制。

1. `unknown`类型的变量，不能直接赋值给其他类型的变量（除了`any`类型和`unknown`类型）。

```TS
let v: unknown = 123;

let v1: boolean = v; // 报错
let v2: number = v; // 报错
```

2. 不能直接调用`unknown`类型变量的方法和属性。

```TS
let v1: unknown = { foo: 123 };
v1.foo; // 报错

let v2: unknown = "hello";
v2.trim(); // 报错

let v3: unknown = (n = 0) => n + 1;
v3(); // 报错
```

3. `unknown`类型变量能够进行的运算是有限的，只能进行比较运算（运算符`==`、`===`、`!=`、`!==`、`||`、`&&`、`?`）、取反运算（运算符`!`）、`typeof`运算符和`instanceof`运算符这几种，其他运算都会报错。

```TS
let a: unknown = 1;

a + 1; // 报错
a === 1; // 正确
```

---

unknown的正确用法：

只有经过“类型缩小”，`unknown`类型变量才可以使用。所谓“类型缩小”，就是缩小`unknown`变量的类型范围，确保不会出错

```TS
let a: unknown = 1;

if (typeof a === "number") {
  let r = a + 10; // 正确
}
```

上面示例中，`unknown`类型的变量`a`经过`typeof`运算以后，能够确定实际类型是`number`，就能用于加法运算了。这就是“类型缩小”，即将一个不确定的类型缩小为更明确的类型。

下面是另外一个例子：

```TS
let s: unknown = "hello";

if (typeof s === "string") {
  s.length; // 正确
}
```

上面示例中，确定变量`s`的类型为字符串以后，才能调用它的`length`属性。

这样设计的目的是，只有明确`unknown`变量的实际类型，才允许使用它，防止像`any`那样可以随意乱用，“污染”其他变量。类型缩小以后再使用，就不会报错。

总之，`unknown`可以看作是更安全的`any`。一般来说，凡是需要设为`any`类型的地方，通常都应该优先考虑设为`unknown`类型。

在集合论上，`unknown`也可以视为所有其他类型（除了`any`）的全集，所以它和`any`一样，也属于 TypeScript 的顶层类型。

#### never

`never`类型的使用场景，主要是在一些类型运算之中，保证类型运算的完整性，详见后面章节。另外，不可能返回值的函数，返回值的类型就可以写成`never`

如果一个变量可能有多种类型（即联合类型），通常需要使用分支处理每一种类型。这时，处理所有可能的类型之后，剩余的情况就属于`never`类型。

```TS
function fn(x: string | number) {
  if (typeof x === "string") {
    // ...
  } else if (typeof x === "number") {
    // ...
  } else {
    x; // never 类型
  }
}
```

---

`never`类型的一个重要特点是，可以赋值给任意其他类型。

```TS
function f(): never {
  throw new Error("Error");
}

let v1: number = f(); // 不报错
let v2: string = f(); // 不报错
let v3: boolean = f(); // 不报错
```

上面示例中，函数`f()`会抛错，所以返回值类型可以写成`never`，即不可能返回任何值。各种其他类型的变量都可以赋值为`f()`的运行结果（`never`类型）。

为什么`never`类型可以赋值给任意其他类型呢？这也跟集合论有关，空集是任何集合的子集。TypeScript 就相应规定，任何类型都包含了`never`类型。因此，`never`类型是任何其他类型所共有的，TypeScript 把这种情况称为“底层类型”（bottom type）。

总之，TypeScript 有两个“顶层类型”（`any`和`unknown`），但是“底层类型”只有`never`唯一一个。

### 联合类型

#### 语法

联合类型（union types）指的是多个类型组成的一个新类型，使用符号`|`表示。

联合类型`A|B`表示，任何一个类型只要属于`A`或`B`，就属于联合类型`A|B`。

```TS
let x: string | number;

x = 123; // 正确
x = "abc"; // 正确
```

联合类型可以与值类型相结合，表示一个变量的值有若干种可能。
```typescript
let setting: true | false;

let gender: "male" | "female";

let rainbowColor: "赤" | "橙" | "黄" | "绿" | "青" | "蓝" | "紫";
```

前面提到，打开编译选项`strictNullChecks`后，其他类型的变量不能赋值为`undefined`或`null`。这时，如果某个变量确实可能包含空值，就可以采用联合类型的写法。

```ts
let name: string | null;

name = "John";
name = null;
```

#### 类型缩小

联合类型变量的强大之处在于，TypeScript 能够通过**类型缩小 (Type Narrowing)** 来智能地推断出在特定代码块中该变量的具体类型。当你对联合类型变量进行类型检查时，TypeScript 编译器会自动“缩小”其类型范围。

常见的类型缩小方式包括：

- **`typeof` 类型保护**：检查值的基本类型。

```ts
function printIdInfo(id: string | number) {
  if (typeof id === "string") {
    // 在这里，TypeScript 知道 id 的类型是 string
    console.log("ID is a string, length: " + id.length); // 可以安全地访问 string 的属性和方法
  } else {
    // 在这里，TypeScript 知道 id 的类型是 number
    console.log("ID is a number, value: " + id.toFixed(2)); // 可以安全地访问 number 的属性和方法
  }
}

printIdInfo("hello");
printIdInfo(123.456);
```

- **`instanceof` 类型保护**：检查值是否是某个类的实例。

```ts
class Dog { bark() { console.log('Woof!'); } }
class Cat { meow() { console.log('Meow!'); } }

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark(); // OK, animal is Dog
  } else {
    animal.meow(); // OK, animal is Cat
  }
}

makeSound(new Dog());
makeSound(new Cat());
```

- **`in` 操作符类型保护**：检查对象是否包含某个属性。

```ts
type Car = { drive: () => void; };
type Bike = { pedal: () => void; };

function move(vehicle: Car | Bike) {
  if ('drive' in vehicle) {
    vehicle.drive(); // OK, vehicle is Car
  } else {
    vehicle.pedal(); // OK, vehicle is Bike
  }
}
```

- **字面量类型保护 (Equality Narrowing)**：通过比较字面量值来缩小类型。

```ts
type Status = "success" | "error" | "pending";

function handleStatus(status: Status) {
  if (status === "success") {
    console.log("Operation successful!"); // status 是 "success"
  } else if (status === "error") {
    console.log("Operation failed.");    // status 是 "error"
  } else {
    console.log("Operation pending..."); // status 是 "pending"
  }
}
```

- **用户自定义类型保护**：通过返回 `arg is Type` 的函数来定义自己的类型保护。

```ts
function isNumber(x: any): x is number {
  return typeof x === "number";
}

function processValue(value: string | number) {
  if (isNumber(value)) {
    console.log(value * 2); // OK, value is number
  } else {
    console.log(value.toUpperCase()); // OK, value is string
  }
}
```

### 交叉类型

#### 语法

交叉类型（intersection types）指的多个类型组成的一个新类型，使用符号`&`表示。

交叉类型`A&B`表示，任何一个类型必须同时属于`A`和`B`，才属于交叉类型`A&B`，即交叉类型同时满足`A`和`B`的特征。

```ts
let x: number & string;
```

上面示例中，变量`x`同时是数值和字符串，这当然是不可能的，所以 TypeScript 会认为`x`的类型实际是`never`。

交叉类型的主要用途是表示对象的合成:

```ts
// 定义两个基本类型
interface A {
  propA: string;
}

interface B {
  propB: number;
}

// 定义一个交叉类型 C，它同时拥有 A 的 propA 和 B 的 propB
type C = A & B;

const obj: C = {
  propA: "hello",
  propB: 123
};

console.log(obj.propA); // "hello"
console.log(obj.propB); // 123

// 如果缺少任何一个属性，TypeScript 都会报错
// const obj2: C = { propA: "world" }; // Error: Property 'propB' is missing
```

交叉类型也可以用于函数签名，表示一个函数需要同时满足多个函数签名。这在函数重载的场景下很有用，尽管通常更推荐使用函数重载的语法。

```ts
type F1 = (a: number) => string;
type F2 = (b: string) => number;

type FCombined = F1 & F2; // 这表示一个函数需要同时满足这两个签名
// 但实际使用中，通常用函数重载语法更清晰

// 实际使用 FCombined 时，会发现它的调用规则变得非常严格，因为它必须同时满足两个签名：
// 比如，它不能只有一个 number 参数返回 string，也不能只有一个 string 参数返回 number。
// 这种情况通常只出现在复杂的高阶函数类型推导中。
// let fn: FCombined;
// fn = (x: number | string) => { /* ... */ return typeof x === 'number' ? 'str' : 1; }
// console.log(fn(5));
// console.log(fn('test'));
```

#### 属性冲突

##### 原始类型冲突

如果属性是原始类型（`string`, `number`, `boolean`, `symbol`, `bigint`, `null`, `undefined`），并且类型不兼容，那么结果类型将是 `never`。这意味着这个交叉类型实际上是不可构造的，你无法创建一个符合这种类型的值。

```ts
interface ConflictingA {
  id: string;
}
interface ConflictingB {
  id: number;
}

type Conflicting = ConflictingA & ConflictingB;
// id 的类型将是 string & number，结果是 never

// const objC: Conflicting = { id: "abc" }; // Error: Type 'string' is not assignable to type 'never'.
// const objC2: Conflicting = { id: 123 }; // Error: Type 'number' is not assignable to type 'never'.
// 你无法创建符合 Conflicting 类型的值，因为 id 既要字符串又要数字，这是不可能的。
```

##### 对象类型冲突

如果属性是对象类型，并且同名属性的类型不兼容，那么交叉类型会尝试递归地合并这些属性的类型。

```ts
interface SettingsA {
  config: { timeout: number; };
}
interface SettingsB {
  config: { retries: number; };
}

type CombinedSettings = SettingsA & SettingsB;
// config 的类型将是 { timeout: number; } & { retries: number; }
// 最终是 { timeout: number; retries: number; }

const s: CombinedSettings = {
  config: {
    timeout: 1000,
    retries: 3
  }
};
```

##### 函数签名冲突

如果交叉类型合并了同名的函数属性，并且这些函数的参数列表不同，则最终类型会是这些函数签名的**重载合并**。

```ts
interface LoggerA {
  log(message: string): void;
}
interface LoggerB {
  log(errorCode: number): void;
}

type CombinedLogger = LoggerA & LoggerB;

const logger: CombinedLogger = {
  log(arg: string | number) {
    if (typeof arg === 'string') {
      console.log(`String Log: ${arg}`);
    } else {
      console.log(`Error Log: ${arg}`);
    }
  }
};

logger.log("Hello World"); // OK
logger.log(500);         // OK
```

### 块级类型声明

TypeScript 支持块级类型声明，即类型可以声明在代码块（用大括号表示）里面，并且只在当前代码块有效。

```TS
if (true) {
  type T = number;
  let v: T = 5;
} else {
  type T = string;
  let v: T = "hello";
}
```

上面示例中，存在两个代码块，其中分别有一个类型`T`的声明。这两个声明都只在自己的代码块内部有效，在代码块外部无效。

### 类型的兼容

TypeScript 的类型存在兼容关系，某些类型可以兼容其他类型。

```TS
type T = number | string;

let a: number = 1;
let b: T = a;
```

上面示例中，变量`a`和`b`的类型是不一样的，但是变量`a`赋值给变量`b`并不会报错。这时，我们就认为，`b`的类型兼容`a`的类型。

TypeScript 为这种情况定义了一个专门术语。如果类型`A`的值可以赋值给类型`B`，那么类型`A`就称为类型`B`的子类型（subtype）。在上例中，类型`number`就是类型`number|string`的子类型。

TypeScript 的一个规则是，凡是可以使用父类型的地方，都可以使用子类型，但是反过来不行。

```TS
let a: "hi" = "hi";
let b: string = "hello";

b = a; // 正确
a = b; // 报错
```

之所以有这样的规则，是因为子类型继承了父类型的所有特征，所以可以用在父类型的场合。但是，子类型还可能有一些父类型没有的特征，所以父类型不能用在子类型的场合。

## 数组

### 单类型数组

#### `T[]` 

这是最常见和推荐的方式，表示一个特定类型的元素组成的数组。

```TS
// 声明一个只包含数字的数组
let numbers: number[] = [1, 2, 3, 4];

// 声明一个只包含字符串的数组
let names: string[] = ["Alice", "Bob", "Charlie"];

// 声明一个只包含布尔值的数组
let flags: boolean[] = [true, false, true];

// 尝试添加不符合类型的值会报错
// numbers.push("hello"); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
```

#### `Array<T>`

这种方式使用**泛型**（Generics）来定义数组类型，效果与 `[]` 语法相同。

```TS
let scores: Array<number> = [90, 85, 92];
let users: Array<{ name: string; age: number }> = [
  { name: "David", age: 30 },
  { name: "Eve", age: 25 },
];
```

### 多类型数组

如果你需要一个数组中可以包含多种不同类型（但这些类型是预先确定的）的元素，可以使用**联合类型**。

```TS
// 数组可以包含数字或字符串
let mixedData: (number | string)[] = [1, "hello", 2, "world"];

// 或者使用泛型写法
let mixedData2: Array<number | string> = [3, "typescript", 4];

// 尝试添加其他类型的值会报错
// mixedData.push(true); // Error: Argument of type 'boolean' is not assignable to parameter of type 'string | number'.
```

### 只读数组

#### `readonly` `T[]`

```TS
const arr: readonly number[] = [0, 1];

arr[1] = 2; // 报错
arr.push(3); // 报错
delete arr[0]; // 报错
```

#### `ReadonlyArray<T>`

```TS
const a1: ReadonlyArray<number> = [0, 1];
```

> [!NOTE]
>
> `readonly`关键字不能与数组的泛型写法一起使用。

```TS
// 报错
const arr: readonly Array<number> = [0, 1];
```

#### `Readonly<T[]>`

```TS
const a2: Readonly<number[]> = [0, 1];
```

#### `as const`

仅仅在声明变量时(`=`的左边)写const是没有用的，必须在赋值阶段用`as const`标记

```TS
const array = [1, 2]
array[1] = 3;	// 可行

const arr = [0, 1] as const;
arr[0] = [2]; // 报错
```

> [!note]
>
> 这里用`as const`生成的既是 数组 ，也是 元组，因为它是 值类型

#### 普通数组与只读数组

TypeScript 将`readonly number[]`与`number[]`视为两种不一样的类型，后者是前者的子类型。

这是因为只读数组没有`pop()`、`push()`之类会改变原数组的方法，所以`number[]`的方法数量要多于`readonly number[]`，这意味着`number[]`其实是`readonly number[]`的子类型。

我们知道，子类型继承了父类型的所有特征，并加上了自己的特征，所以子类型`number[]`可以用于所有使用父类型的场合，反过来就不行。

```TS
let a1: number[] = [0, 1];
let a2: readonly number[] = a1; // 正确

a1 = a2; // 报错
```

### 数组的类型推断

如果数组变量没有声明类型，TypeScript 就会推断数组成员的类型。这时，推断行为会因为值的不同，而有所不同。

如果变量的初始值是空数组，那么 TypeScript 会推断数组类型是`any[]`。

```TS
// 推断为 any[]
const arr = [];
```

后面，为这个数组赋值时，TypeScript 会自动更新类型推断。

```TS
const arr = [];
arr; // 推断为 any[]

arr.push(123);
arr; // 推断类型为 number[]

arr.push("abc");
arr; // 推断类型为 (string|number)[]
```

> [!NOTE]
>
> 类型推断的自动更新只发生初始值为空数组的情况。如果初始值不是空数组，类型推断就不会更新。

```TS
// 推断类型为 number[]
const arr = [123];

arr.push("abc"); // 报错
```

## 元组

**元组**是数组的一种特殊形式，它**明确指定了数组中每个索引位置上元素的类型和数组的长度**。元组的长度是固定的。

```TS
const s: [string, string, boolean] = ["a", "b", true];
```

### 只读元组

元组也可以是只读的，不允许修改，有两种写法。

```TS
// 写法一
type t = readonly [number, string];

// 写法二
type t = Readonly<[number, string]>;

// 写法三
const t = [1, true] as const
```

跟数组一样，只读元组是元组的父类型。所以，元组可以替代只读元组，而只读元组不能替代元组。

```TS
type t1 = readonly [number, number];
type t2 = [number, number];

let x: t2 = [1, 2];
let y: t1 = x; // 正确

x = y; // 报错
```



### 可选成员

可选成员必须声明在末尾

```TS
type t = [number, number?]	// 正确
type t = [number, string?, boolean]	//错误
```



### 数量推断

如果没有可选成员和扩展运算符，TypeScript 会推断出元组的成员数量（即元组长度）。

```TS
function f(point: [number, number]) {
  if (point.length === 3) {
    // 报错
    // ...
  }
}
```



如果包含了可选成员，TypeScript 会推断出可能的成员数量。

```TS
function f(point: [number, number?, number?]) {
  if (point.length === 4) {
    // 报错
    // ...
  }
}
```



如果使用了扩展运算符，TypeScript 就无法推断出成员数量。

```TS
const myTuple: [...string[]] = ["a", "b", "c"];

if (myTuple.length === 4) {
  // 正确
  // ...
}
```

上面示例中`myTuple`只有三个成员，但是 TypeScript 推断不出它的成员数量，因为它的类型用到了扩展运算符，TypeScript 把`myTuple`当成数组看待，而数组的成员数量是不确定的。

一旦扩展运算符使得元组的成员数量无法推断，TypeScript 内部就会把该元组当成数组处理。

## 函数

如果变量被赋值为一个函数，变量的类型有两种写法。

```TS
// 写法一
const hello = function (txt: string) {
  console.log("hello " + txt);
};

// 写法二
const hello: (txt: string) => void = function (txt) {
  console.log("hello " + txt);
};
```

### Function类型

TypeScript 提供 Function 类型表示函数，任何函数都属于这个类型。

Function 类型的函数可以接受任意数量的参数，每个参数的类型都是`any`，返回值的类型也是`any`，代表没有任何约束，所以不建议使用这个类型，给出函数详细的类型声明会更好

```TS
function doSomething(f: Function) {
  return f(1, 2, 3);
}
```

### 参数类型

#### 可选参数



#### 默认参数



#### 剩余参数

rest 参数表示函数剩余的所有参数，它可以是数组（剩余参数类型相同），也可能是元组（剩余参数类型不同）。

```TS
// rest 参数为数组
function joinNumbers(...nums: number[]) {
  // ...
}

// rest 参数为元组
function f(...args: [boolean, number]) {
  // ...
}
```

rest 参数甚至可以嵌套。

```TS
function f(...args: [boolean, ...string[]]) {
  // ...
}
```



#### 只读参数



## 对象

### 属性名的索引类型

索引签名有两种主要形式：**字符串索引签名** 和 **数字索引签名**。

```TS
interface MyObject {
  // 字符串索引签名
  [key: string]: number;

  // 数字索引签名 (通常用于表示类数组对象或字典，键为数字)
  // [index: number]: string; // 示例：键是数字，值是字符串
}
```

`[key: string]`: 这部分定义了**键（属性名）的类型**。它可以是 `string` 或 `number`（或 `symbol`，但较少用作通用索引）。

`: number`: 这部分定义了**值（属性值）的类型**。

#### 字符串索引签名

字符串索引签名是最常见的形式，它表示一个对象可以有任意数量的字符串属性，并且这些属性的值都必须是指定类型。

示例：定义一个字符串到数字的字典

```TS
interface StringToNumberDictionary {
  [key: string]: number; // 任何字符串键都对应一个数字值
  length?: number; // 可以有其他明确定义的属性，但其类型必须与索引签名兼容
  // name: string; // Error: Property 'name' of type 'string' is not assignable to 'string' index type 'number'.
                   // 如果 name 属性存在，它的值类型必须是 number，因为索引签名规定了所有字符串属性的值都是 number。
}

let scores: StringToNumberDictionary = {
  "math": 95,
  "english": 88,
  "science": 92
};

console.log(scores["math"]); // 95
scores.history = 78;          // OK
// scores.chemistry = "ninety"; // Error: Type 'string' is not assignable to type 'number'.

// 也可以有可选属性，只要其类型兼容
scores.length = 3; // OK
```

> [!important]
>
> 当一个接口同时定义了索引签名和明确的属性时，**明确属性的类型必须是索引签名值类型的子类型**（或者说，必须兼容索引签名值类型）。
>
> 这是因为索引签名表示“所有”字符串键的属性值类型。如果你有一个明确的属性 `name: string`，但索引签名是 `[key: string]: number`，那么 `name` 的值既要满足 `string` 又要满足 `number`，这是不可能的，除非 `string` 是 `number` 的子类型（显然不是），或者 `number` 是 `string` 的子类型（也不是）。所以，它们必须兼容。
>
> **例子中的 `length?: number;` 是兼容的，因为它本身就是 `number` 类型，符合 `[key: string]: number` 的要求。**

#### 数字索引签名

数字索引签名表示一个对象可以用数字作为键来索引，并且这些数字键对应的值都必须是指定类型。这在处理类数组对象或当数字键有特殊含义时很有用。

示例：定义一个数字到字符串的映射

```ts
interface StringArray {
  [index: number]: string; // 任何数字键都对应一个字符串值
}

let myArray: StringArray = ["Hello", "World"]; // 数组本身就是数字索引的，并且值都是字符串

console.log(myArray[0]); // "Hello"
myArray[2] = "TypeScript"; // OK

// 也可以像操作数组一样操作
// myArray.push("!"); // 尽管语法允许，但实际上，索引签名不会直接赋予数组方法。
                      // 如果你想要一个真正的数组，直接使用 string[] 或 Array<string>。
```

> [!note]
>
> 数字属性名自动转换为字符串。因此，`obj[100]` 和 `obj["100"]` 是等价的。这意味着，如果一个接口同时定义了**字符串索引签名**和**数字索引签名**，那么**数字索引签名定义的值类型必须是字符串索引签名值类型的子类型**。

#### 总结

1. `[key: string]: ValueType;` 定义所有字符串键的属性值类型。
2. `[index: number]: ValueType;` 定义所有数字键的属性值类型。
3. 如果同时存在，数字索引签名值类型必须是字符串索引签名值类型的子类型。
4. 明确定义的属性类型必须兼容索引签名值类型。

### 结构类型原则

只要对象 B 满足 对象 A 的结构特征，TypeScript 就认为对象 B 兼容对象 A 的类型，这称为“结构类型”原则（structual typing）。

```TS
const A = {
  x: number;
};

const B = {
  x: number;
  y: number;
};
```

上面示例中，对象`A`只有一个属性`x`，类型为`number`。对象`B`满足这个特征，因此兼容对象`A`，只要可以使用`A`的地方，就可以使用`B`。

```TS
const B = {
  x: 1,
  y: 1,
};

const A: { x: number } = B; // 正确
```

上面示例中，`A`和`B`并不是同一个类型，但是`B`可以赋值给`A`，因为`B`满足`A`的结构特征。

根据“结构类型”原则，TypeScript 检查某个值是否符合指定类型时，并不是检查这个值的类型名（即“名义类型”），而是检查这个值的结构是否符合要求（即“结构类型”）。

TypeScript 之所以这样设计，是为了符合 JavaScript 的行为。JavaScript 并不关心对象是否严格相似，只要某个对象具有所要求的属性，就可以正确运行。

如果类型 B 可以赋值给类型 A，TypeScript 就认为 B 是 A 的子类型（subtyping），A 是 B 的父类型。子类型满足父类型的所有结构特征，同时还具有自己的特征。凡是可以使用父类型的地方，都可以使用子类型，即子类型兼容父类型。

### 严格字面量检查

如果对象使用字面量表示，会触发 TypeScript 的严格字面量检查（strict object literal checking）。如果字面量的结构跟类型定义的不一样（比如多出了未定义的属性），就会报错。

```TS
const point: {
  x: number;
  y: number;
} = {
  x: 1,
  y: 1,
  z: 1, // 报错
};
```

上面示例中，等号右边是一个对象的字面量，这时会触发严格字面量检查。只要有类型声明中不存在的属性（本例是`z`），就会导致报错。

如果等号右边不是字面量，而是一个变量，根据结构类型原则，是不会报错的:

```TS
const myPoint = {
  x: 1,
  y: 1,
  z: 1,
};

const point: {
  x: number;
  y: number;
} = myPoint; // 正确
```

上面示例中，等号右边是一个变量，就不会触发严格字面量检查，从而不报错。

TypeScript 对字面量进行严格检查的目的，主要是防止拼写错误。一般来说，字面量大多数来自手写，容易出现拼写错误，或者误用 API。

```TS
type Options = {
  title: string;
  darkMode?: boolean;
};

const Obj: Options = {
  title: "我的网页",
  darkmode: true, // 报错
};
```

上面示例中，属性`darkMode`拼写错了，成了`darkmode`。如果没有严格字面量规则，就不会报错，因为`darkMode`是可选属性，根据结构类型原则，任何对象只要有`title`属性，都认为符合`Options`类型。

规避严格字面量检查，可以使用中间变量。

```TS
let myOptions = {
  title: "我的网页",
  darkmode: true,
};

const Obj: Options = myOptions;
```

上面示例中，创建了一个中间变量`myOptions`，就不会触发严格字面量规则，因为这时变量`obj`的赋值，不属于直接字面量赋值。

如果你确认字面量没有错误，也可以使用类型断言规避严格字面量检查。

```TS
const Obj: Options = {
  title: "我的网页",
  darkmode: true,
} as Options;
```

上面示例使用类型断言`as Options`，告诉编译器，字面量符合 Options 类型，就能规避这条规则。

如果允许字面量有多余属性，可以像下面这样在类型里面定义一个通用属性。

```TS
let x: {
  foo: number;
  [x: string]: any;
};

x = { foo: 1, baz: 2 }; // Ok
```

上面示例中，变量`x`的类型声明里面，有一个属性的字符串索引（`[x: string]`），导致任何字符串属性名都是合法的。

由于严格字面量检查，字面量对象传入函数必须很小心，不能有多余的属性。

```TS
interface Point {
  x: number;
  y: number;
}

function computeDistance(point: Point) {
  /*...*/
}

computeDistance({ x: 1, y: 2, z: 3 }); // 报错
computeDistance({ x: 1, y: 2 }); // 正确
```

上面示例中，对象字面量传入函数`computeDistance()`时，不能有多余的属性，否则就通不过严格字面量检查。

编译器选项`suppressExcessPropertyErrors`，可以关闭多余属性检查。下面是它在 `tsconfig.json` 文件里面的写法。

```json
{
  "compilerOptions": {
    "suppressExcessPropertyErrors": true
  }
}
```

### 最小可选属性规则

如果一个对象的所有属性都是可选的，会触发最小可选属性规则。

```TS
type Options = {
  a?: number;
  b?: number;
  c?: number;
};

const obj: Options = {
  d: 123, // 报错
};
```

上面示例中，类型`Options`是一个对象，它的所有属性都是可选的，这导致任何对象实际都符合`Options`类型。

为了避免这种情况，TypeScript 添加了最小可选属性规则，规定这时属于`Options`类型的对象，必须至少存在一个可选属性，不能所有可选属性都不存在。这就是为什么上例的`myObj`对象会报错的原因。

这条规则无法通过中间变量规避。

```TS
const myOptions = { d: 123 };

const obj: Options = myOptions; // 报错
```

### 空对象

空对象是 TypeScript 的一种特殊值，也是一种特殊类型。

```TS
const obj = {};
obj.prop = 123; // 报错
```

上面示例中，变量`obj`的值是一个空对象，然后对`obj.prop`赋值就会报错。

原因是这时 TypeScript 会推断变量`obj`的类型为空对象，实际执行的是下面的代码。

```TS
const obj: {} = {};
```

空对象没有自定义属性，所以对自定义属性赋值就会报错。空对象只能使用继承的属性，即继承自原型对象`Object.prototype`的属性。

```TS
obj.toString(); // 正确
```

上面示例中，`toString()`方法是一个继承自原型对象的方法，TypeScript 允许在空对象上使用。



这种空对象的写法其实在 JavaScript 很常见：先声明一个空对象，然后向空对象添加属性。但是，TypeScript 不允许动态添加属性，所以对象不能分步生成，必须生成时一次性声明所有属性。

```TS
// 错误
const pt = {};
pt.x = 3;
pt.y = 4;

// 正确
const pt = {
  x: 3,
  y: 4,
};
```

如果确实需要分步声明，一个比较好的方法是，使用扩展运算符（`...`）合成一个新对象。

```TS
const pt0 = {};
const pt1 = { x: 3 };
const pt2 = { y: 4 };

const pt = {
  ...pt0,
  ...pt1,
  ...pt2,
};
```

## interface

### 声明的内容

#### 可选属性

#### 只读属性

#### 索引签名

#### 函数

#### 类

接口可以约束类必须实现（`implements`）的公共方法和属性。

```TS
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date(); // 必须有 currentTime 属性
  setTime(d: Date) {              // 必须有 setTime 方法
    this.currentTime = d;
  }
  constructor(h: number, m: number) {}
}

// class DigitalClock implements ClockInterface {
//   // Error: Class 'DigitalClock' incorrectly implements interface 'ClockInterface'.
//   // Property 'currentTime' is missing in type 'DigitalClock' but required in type 'ClockInterface'.
//   setTime(d: Date) { /* ... */ }
// }
```

> [!NOTE]
>
> 接口只检查类的**实例部分**。类的静态部分（如构造函数）不会被接口检查。

### interface的继承

#### 继承interface

#### 继承type

#### 继承class

### 接口声明的合并

多个同名接口会合并成一个接口:

```TS
interface Box {
  height: number;
  width: number;
}

interface Box {
  length: number;
}
```

上面示例中，两个`Box`接口会合并成一个接口，同时有`height`、`width`和`length`三个属性。

### `interface` 对比 `type`

#### 相同点

| 功能                       | 例子                                  |
| -------------------------- | ------------------------------------- |
| 定义对象结构               | `{ name: string, age: number }`       |
| 给函数定义类型             | `(x: number) => string`               |
| 使用泛型                   | `interface Box<T> { value: T }`       |
| 在类中用 `implements` 实现 | `class Foo implements Bar`            |
| 定义数组或类数组结构       | `{ [index: number]: string }`         |
| 可选属性/只读属性          | `name?: string; readonly age: number` |

#### 不同点

##### 定义能力

```TS
// ✅ type 可定义原始类型
type Name = string;

// ❌ interface 只能用于对象结构
interface Name { } // 没有实际意义
```

##### 联合与交叉类型

```TS
// ✅ type
type A = { a: number };
type B = { b: string };
type C = A | B; // 联合类型
type D = A & B; // 交叉类型

// ❌ interface 不支持联合/交叉
```

##### 映射类型

```TS
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

type Maybe<T> = T extends string ? string[] : T;
```

这些都只能用 `type`，`interface` 无法处理。

##### 声明合并

```TS
interface Point {
  x: number;
}
interface Point {
  y: number;
}

const p: Point = { x: 1, y: 2 }; // 合并为 { x, y }
```

适用于第三方库扩展（比如增强 `Window`、`Express.Request`）

##### 类实现

```TS
interface Animal {
  name: string;
  speak(): void;
}

class Dog implements Animal {
  name = "dog";
  speak() { console.log("wang"); }
}
```

虽然 `type` 也可以用于 `implements`，但语义上更倾向使用 `interface`。

#### 一览表

| 比较维度           | `interface`                            | `type`                                         |
| ------------------ | -------------------------------------- | ---------------------------------------------- |
| 🧾 定义方式         | `interface A {}`                       | `type A = {...}`                               |
| 🧩 定义对象结构     | ✅ 是，专门用于对象描述                 | ✅ 是                                           |
| 🧪 定义原始类型     | ❌ 不支持（不能定义 `type A = string`） | ✅ 支持原始、联合、交叉、函数、元组等所有类型   |
| ➕ 扩展（继承）方式 | `extends`，支持多继承                  | 通过交叉类型 `&` 扩展                          |
| 🔁 声明合并         | ✅ 支持（多次声明自动合并）             | ❌ 不支持，重复定义同名会报错                   |
| 🧠 映射类型支持     | ❌ 不支持映射类型                       | ✅ 支持，如 `Partial<T>`、`Record<K, V>` 等     |
| ❓ 条件类型         | ❌ 不支持                               | ✅ 支持 `T extends U ? X : Y`                   |
| ⛓ 联合/交叉类型    | ❌ 不支持定义联合类型                   | ✅ type A \| B       type A & B                 |
| 📦 元组、函数类型   | ✅ 函数支持；元组不直观                 | ✅ 全部支持                                     |
| 🧱 类 `implements`  | ✅ 推荐用 interface                     | ✅ 也支持                                       |
| 🧬 泛型支持         | ✅ 支持                                 | ✅ 支持                                         |
| 💥 编译性能         | 高（更快）                             | 稍慢（功能更强泛型更多，类型复杂）             |
| ✅ 最佳使用场景     | 描述类、对象结构、公共 API 结构等      | 高级类型操作、类型变换、联合类型、实用工具类型 |

#### 最佳实践

| 使用场景                             | 建议使用      | 理由                                      |
| ------------------------------------ | ------------- | ----------------------------------------- |
| 面向对象编程，描述类结构             | `interface`   | 语义清晰，支持继承合并，实现类约束        |
| 定义简单的对象或函数类型             | 任意          | 都可以                                    |
| 需要联合、交叉、映射、条件等高级类型 | `type`        | 只有 type 支持                            |
| 多次声明、拓展类型（如全局 Window）  | `interface`   | 支持声明合并                              |
| 构建组件 Props，配合工具类型         | 通常用 `type` | 更灵活，可用 `Pick`、`Omit`、`Partial` 等 |
| 定义复杂数据结构或变换工具类型       | `type`        | 支持类型计算                              |

## 类

### 属性索引与函数

类允许定义属性索引。

```TS
class MyClass {
  [s: string]: boolean | ((s: string) => boolean);

  get(s: string) {
    return this[s] as boolean;
  }
}
```

上面示例中，`[s:string]`表示所有属性名类型为字符串的属性，它们的属性值要么是布尔值，要么是返回布尔值的函数。

注意，由于类的方法是一种特殊属性（属性值为函数的属性），所以属性索引的类型定义也涵盖了方法。如果一个对象同时定义了属性索引和方法，那么前者必须包含后者的类型。

```TS
class MyClass {
  [s: string]: boolean;
  f() {
    // 报错
    return true;
  }
}
```

上面示例中，属性索引的类型里面不包括方法，导致后面的方法`f()`定义直接报错。正确的写法是下面这样。

```TS
class MyClass {
  [s: string]: boolean | (() => boolean);
  f() {
    return true;
  }
}
```

### 类中的`interface`

#### `implements`

interface 接口或 type 别名，可以用对象的形式，为 class 指定一组检查条件。然后，类使用 implements 关键字，表示当前类满足这些外部类型条件的限制。

```TS
interface Country {
  name: string;
  capital: string;
}
// 或者
type Country = {
  name: string;
  capital: string;
};

class MyCountry implements Country {
  name = "";
  capital = "";
}
```

上面示例中，`interface`或`type`都可以定义一个对象类型。类`MyCountry`使用`implements`关键字，表示该类的实例对象满足这个外部类型。

interface 只是指定检查条件，如果不满足这些条件就会报错。它并不能代替 class 自身的类型声明。

```TS
interface A {
  get(name: string): boolean;
}

class B implements A {
  get(s) {
    // s 的类型是 any
    return true;
  }
}
```

上面示例中，类`B`实现了接口`A`，但是后者并不能代替`B`的类型声明。因此，`B`的`get()`方法的参数`s`的类型是`any`，而不是`string`。`B`类依然需要声明参数`s`的类型。

```TS
class B implements A {
  get(s: string) {
    return true;
  }
}
```

下面是另一个例子:

```TS
interface A {
  x: number;
  y?: number;
}

class B implements A {
  x = 0;
}

const b = new B();
b.y = 10; // 报错
```

上面示例中，接口`A`有一个可选属性`y`，类`B`没有声明这个属性，所以可以通过类型检查。但是，如果给`B`的实例对象的属性`y`赋值，就会报错。所以，`B`类还是需要声明可选属性`y`。

***

类可以定义接口没有声明的方法和属性:

```TS
interface Point {
  x: number;
  y: number;
}

class MyPoint implements Point {
  x = 1;
  y = 1;
  z: number = 1;
}
```

上面示例中，`MyPoint`类实现了`Point`接口，但是内部还定义了一个额外的属性`z`，这是允许的，表示除了满足接口给出的条件，类还有额外的条件。

---

`implements`关键字后面，不仅可以是接口，也可以是另一个类。这时，后面的类将被当作接口。

```TS
class Car {
  id: number = 1;
  move(): void {}
}

class MyCar implements Car {
  id = 2; // 不可省略
  move(): void {} // 不可省略
}
```

---

interface 描述的是类的对外接口，也就是实例的公开属性和公开方法，不能定义私有的属性和方法。这是因为 TypeScript 设计者认为，私有属性是类的内部实现，接口作为模板，不应该涉及类的内部代码写法。

```TS
interface MyInterface {
  // private myPrivateProperty: string; // Error: An interface property cannot be private or protected.
  // protected myProtectedProperty: string; // Error: An interface property cannot be private or protected.

  public myPublicProperty: string; // OK (public 是默认的，通常省略)
  myAnotherPublicProperty: number; // OK (默认就是 public)
}
```

#### 实现多个接口

类可以实现多个接口（其实是接受多重限制），每个接口之间使用逗号分隔。

```TS
class Car implements MotorVehicle, Flyable, Swimmable {
  // ...
}
```

#### 类与接口的合并

TypeScript 不允许两个同名的类，但是如果一个类和一个接口同名，那么接口会被合并进类。

```TS
class A {
  x: number = 1;
}

interface A {
  y: number;
}

let a = new A();
a.y = 10;

a.x; // 1
a.y; // 10
```

### 实例属性的简写形式

实际开发中，很多实例属性的值，是通过构造方法传入的,常规写法：

```TS
class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
```

这样的写法等于对同一个属性要声明两次类型，一次在类的头部，另一次在构造方法的参数里面。这有些累赘，TypeScript 就提供了一种简写形式:

```TS
class Point {
  constructor(public x: number, public y: number) {}
}

const p = new Point(10, 10);
p.x; // 10
p.y; // 10
```

上面示例中，构造方法的参数`x`前面有`public`修饰符，这时 TypeScript 就会自动声明一个公开属性`x`，不必在构造方法里面写任何代码，同时还会设置`x`的值为构造方法的参数值。注意，这里的`public`不能省略。

除了`public`修饰符，构造方法的参数名只要有`private`、`protected`、`readonly`修饰符，都会自动声明对应修饰符的实例属性。

```TS
class A {
  constructor(
    public a: number,
    protected b: number,
    private c: number,
    readonly d: number
  ) {}
}

// 编译结果
class A {
  a;
  b;
  c;
  d;
  constructor(a, b, c, d) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
  }
}
```

上面示例中，从编译结果可以看到，构造方法的`a`、`b`、`c`、`d`会生成对应的实例属性。

`readonly`还可以与其他三个可访问性修饰符，一起使用。

```TS
class A {
  constructor(
    public readonly x: number,
    protected readonly y: number,
    private readonly z: number
  ) {}
}
```

## 泛型

### 类型别名中的泛型

```TS
type Nullable<T> = T | undefined | null;
```

上面示例中，`Nullable<T>`是一个泛型，只要传入一个类型，就可以得到这个类型与`undefined`和`null`的一个联合类型。

### 类型参数的默认值

类型参数可以设置默认值。使用时，如果没有给出类型参数的值，就会使用默认值。

```TS
function getFirst<T = string>(arr: T[]): T {
  return arr[0];
}
```

上面示例中，`T = string`表示类型参数的默认值是`string`。调用`getFirst()`时，如果不给出`T`的值，TypeScript 就认为`T`等于`string`。

但是，因为 TypeScript 会从实际参数推断出`T`的值，从而覆盖掉默认值，所以下面的代码不会报错。

```TS
getFirst([1, 2, 3]); // 正确
```

上面示例中，实际参数是`[1, 2, 3]`，TypeScript 推断 T 等于`number`，从而覆盖掉默认值`string`。

类型参数的默认值，往往用在类中:

```TS
class Generic<T = string> {
  list: T[] = [];

  add(t: T) {
    this.list.push(t);
  }
}
```

上面示例中，类`Generic`有一个类型参数`T`，默认值为`string`。这意味着，属性`list`默认是一个字符串数组，方法`add()`的默认参数是一个字符串。

```TS
const g = new Generic();

g.add(4); // 报错
g.add("hello"); // 正确
```

上面示例中，新建`Generic`的实例`g`时，没有给出类型参数`T`的值，所以`T`就等于`string`。因此，向`add()`方法传入一个数值会报错，传入字符串就不会。

### 类型参数的约束条件

很多类型参数并不是无限制的，对于传入的类型存在约束条件。

```TS
function comp<Type>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  }
  return b;
}
```

上面示例中，类型参数 Type 有一个隐藏的约束条件：它必须存在`length`属性。如果不满足这个条件，就会报错。

TypeScript 提供了一种语法，允许在类型参数上面写明约束条件，如果不满足条件，编译时就会报错。这样也可以有良好的语义，对类型参数进行说明。

```TS
function comp<T extends { length: number }>(a: T, b: T) {
  if (a.length >= b.length) {
    return a;
  }
  return b;
}
```

上面示例中，`T extends { length: number }`就是约束条件，表示类型参数 T 必须满足`{ length: number }`，否则就会报错。

```TS
comp([1, 2], [1, 2, 3]); // 正确
comp("ab", "abc"); // 正确
comp(1, 2); // 报错
```

*同时指定约束和默认值：*

```TS
// 定义一个基础接口，确保泛型类型具有 value 属性
interface Wrapper<T> {
  value: T;
}

// Box 接口：T 必须是字符串或数字 (约束)，默认为字符串 (默认值)
interface Box<T extends string | number = string> extends Wrapper<T> {
  label: string;
}

// 1. 不指定 T，使用默认类型 string
const box1: Box = {
  value: "hello", // T 默认为 string
  label: "Message"
};
// const boxError1: Box = { value: 123, label: "Invalid" }; // Error: Type 'number' is not assignable to type 'string'.

// 2. 明确指定 T 为 number (符合约束)
const box2: Box<number> = {
  value: 42, // T 明确为 number
  label: "Answer"
};

// 3. 明确指定 T 为 boolean (不符合约束)
// const boxError2: Box<boolean> = { value: true, label: "Boolean Box" }; // Error: Type 'boolean' does not satisfy the constraint 'string | number'.
```

## Enum

### 成员的值

#### 值类型

##### 数值

成员的值可以是任意数值，但不能是大整数（Bigint）

```TS
enum Color {
  Red = 90,
  Green = 0.5,
  Blue = 7n, // 报错
}
```

##### 字符串

```TS
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```

> [!NOTE]
>
> 字符串枚举的所有成员值，都必须显式设置。如果没有设置，成员值默认为数值，且位置必须在字符串成员之前。

```TS
enum Foo {
  A, // 0
  B = "hello",
  C, // 报错
}
```

上面示例中，`A`之前没有其他成员，所以可以不设置初始值，默认等于`0`；`C`之前有一个字符串成员，必须`C`必须有初始值，不赋值就报错了。

##### 混合使用

```TS
enum Enum {
  One = "One",
  Two = "Two",
  Three = 3,
  Four = 4,
}
```



#### 可重复

```TS
enum Color {
  Red = 0,
  Green = 0,
  Blue = 0,
}
```

#### 可运算

```TS
enum asd {
  a = 2 >> 3,
  b = 3 + 3,
}
```

#### 只读

Enum 成员值都是只读的，不能重新赋值。

```TS
enum Color {
  Red,
  Green,
  Blue,
}

Color.Red = 4; // 报错
```

为了让这一点更醒目，通常会在 enum 关键字前面加上`const`修饰，表示这是常量，不能再次赋值。

```TS
const enum Color {
  Red,
  Green,
  Blue,
}
```

加上`const`的特点：

1. 在编译时会被 **内联为具体值**，不生成额外代码。
2. 无法使用 `Color[0]` 这种反查语法。
3. 不能和 `computed`（计算值）组合。

编译前：

```TS
const enum season {
	winter,
	autumn,
}

enum day {
	Friday,
	Wednesday,
}


const a = season.winter

const b = day.Friday
```

编译后：

```JS
var day;
(function (day) {
    day[day["Friday"] = 0] = "Friday";
    day[day["Wednesday"] = 1] = "Wednesday";
})(day || (day = {}));
day.Friday = 1;
var a = 0 /* season.winter */;
var b = day.Friday;
```



### 同名Enum的合并

多个同名的 Enum 结构会自动合并。

```TS
enum Foo {
  A,
}

enum Foo {
  B = 1,
}

enum Foo {
  C = 2,
}

// 等同于
enum Foo {
  A,
  B = 1，
  C = 2
}
```

上面示例中，`Foo`分成三段定义，系统会自动把它们合并。

#### 注意点

1. Enum 结构合并时，只允许其中一个的首成员省略初始值，否则报错:

```TS
enum Foo {
  A,
}

enum Foo {
  B, // 报错
}
```

2. 同名 Enum 合并时，不能有同名成员，否则报错:

```TS
enum Foo {
  A,
  B,
}

enum Foo {
  B = 1, // 报错
  C,
}
```

3. 所有定义必须同为 const 枚举或者非 const 枚举，不允许混合使用:

```TS
// 正确
enum E {
  A,
}
enum E {
  B = 1,
}

// 正确
const enum E {
  A,
}
const enum E {
  B = 1,
}

// 报错
enum E {
  A,
}
const enum E2 {
  B = 1,
}
```

### 反向映射

数值 Enum 存在反向映射，即可以通过成员值获得成员名。

```TS
enum Weekdays {
  Monday = 1,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

console.log(Weekdays[3]); // Wednesday
```

上面示例中，Enum 成员`Wednesday`的值等于 3，从而可以从成员值`3`取到对应的成员名`Wednesday`，这就叫反向映射。

这是因为 TypeScript 会将上面的 Enum 结构，编译成下面的 JavaScript 代码。

```JS
var Weekdays;
(function (Weekdays) {
  Weekdays[(Weekdays["Monday"] = 1)] = "Monday";
  Weekdays[(Weekdays["Tuesday"] = 2)] = "Tuesday";
  Weekdays[(Weekdays["Wednesday"] = 3)] = "Wednesday";
  Weekdays[(Weekdays["Thursday"] = 4)] = "Thursday";
  Weekdays[(Weekdays["Friday"] = 5)] = "Friday";
  Weekdays[(Weekdays["Saturday"] = 6)] = "Saturday";
  Weekdays[(Weekdays["Sunday"] = 7)] = "Sunday";
})(Weekdays || (Weekdays = {}));
```



