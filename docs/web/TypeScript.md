---
title: TypeScript（旧）
shortTitle: TypeScript(旧)
description: TypeScript(旧)
date: 2024-06-16 22:30:07
categories: [前端,TypeScript]
tags: []
---
## 快速上手

### 问题引入
```javascript
function test(obj) {    
}
```
obj 可能只是个字符串
```javascript
test('hello, world')
```
obj 也有可能是个函数
```javascript
test(()=>console.log('hello, world'))
```
obj 类型不确定，就给后期使用者带来了麻烦，一旦参数传不对，代码就崩溃了
动态类型意味着

- 运行代码时才知道发生什么 (running the code to see what happens)

静态类型意味着

- 在代码运行前，就对它的行为做出预测 (make predications about what code is expected before it runs)

下面的 typescript 代码，就在代码运行前对参数加入了约束限制
```typescript
function test(msg : string) {
}
```

- 限制了参数只能做 string 那些事
```typescript
function test(msg : Function) {
  msg()
}
```

- 限制了参数只能做函数那些事

### 编译运行
安装 typescript 编译器
```
npm install -g typescript
```
编写 ts 代码
```typescript
function hello(msg: string) {
  console.log(msg)
}

hello('hello,world')
```
执行 tsc 编译命令
```
tsc xxx.ts
```
编译生成 js 代码，编译后进行了类型擦除
```javascript
function hello(msg) {
    console.log(msg);
}
hello('hello,world');
```
再来一个例子，用 interface 定义用户类型
```typescript
interface User {
  name: string,
  age: number
}

function test(u: User): void {
  console.log(u.name)
  console.log(u.age)
}

test({ name: 'zhangs', age: 18 })
```
编译后
```javascript
function test(u) {
    console.log(u.name);
    console.log(u.age);
}
test({ name: 'zhangs', age: 18 });
```
可见，typescript 属于编译时实施类型检查（静态类型）的技术
### WebStorm下的运行方式

1. 安装ts: `npm install -g typescript`
2. 安装直接运行所需依赖包： `npm install -g ts-node`
3. 在设置中安装安装插件后重启![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171447404.png)
4. 界面中出现运行按钮

---

![插件已不可用，需要按照上图进行配置](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171447854.png "插件已不可用，需要按照上图进行配置")
## 常用类型
| 类型 | 例 | 备注 |
| --- | --- | --- |
| 字符串类型 | string |  |
| 数字类型 | number |  |
| 布尔类型 | boolean |  |
| 数组类型 | number[],string[], boolean[] 依此类推 |  |
| 任意类型 | any | 相当于又回到了没有类型的时代 |
| 复杂类型 | type 与 interface |  |
| 函数类型 | () => void | 对函数的参数和返回值进行说明 |
| 字面量类型 | "a"&#124;"b"&#124;"c" | 限制变量或参数的取值 |
| nullish类型 | null 与 undefined |  |
| 泛型 | `<T>`，`<T extends 父类型>` |  |

### 标注位置
#### 标注变量
```typescript
let message: string = 'hello,world'
```

- 一般可以省略，因为可以根据后面的字面量推断出前面变量类型
```typescript
let message = 'hello,world'
```
#### 标注参数
```typescript
function greet(name: string) {
    
}
```
很多时候，都能够推断出参数类型
```typescript
const names = ['Alice', 'Bob', 'Eve']
const lowercaseNames = names.map((e: string) => e.toLowerCase())
```

- 可以用类型推断，推断出 e 是 string 类型
#### 标注返回值
```typescript
function add(a: number, b: number) : number {
    return a + b
}
```

- 一般也可以省略，因为可以根据返回值做类型推断
### 复杂类型
#### type
```typescript
type Cat = {
  name: string,
  age: number
}

const c1: Cat = { name: '小白', age: 1 }
const c2: Cat = { name: '小花' }					  // 错误: 缺少 age 属性
const c3: Cat = { name: '小黑', age: 1, sex: '公' } // 错误: 多出 sex 属性
```
> [!note]
>
> 中文出现乱码解决方案：Help -> Edit Custom VM Options -> 添加：-Dfile.encoding=utf-8

#### interface
当一个对象类型被多次使用时，一般会使用接口（interface）来描述对象的类型，达到复用的目的。
```typescript
interface Cat {
  name: string,	// 逗号可加可不加
  age: number
}

const c1: Cat = { name: '小白', age: 1 }
const c2: Cat = { name: '小花' }					  // 错误: 缺少 age 属性
const c3: Cat = { name: '小黑', age: 1, sex: '公' } // 错误: 多出 sex 属性
```
如果两个接口之间有相同的属性或方法，可以将公共的属性或方法抽离出来，通过继承来实现复用。
比如，这两个接口都有 x、y 两个属性，重复写两次，可以，但很繁琐。
![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171447472.png)
更好的方式：
![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171447502.png)
解释：

1. 使用 extends（继承）关键字实现了接口 Point3D 继承 Point2D。
2. 继承后，Point3D 有了 Point2D 的所有属性和方法（此时Point3D 同时有 x、y、z 三个属性）。
#### type 对比 interface
interface（接口）和 type（类型别名）的对比： 

- 相同点:

   - 都可以定义对象的结构
   - 都可以用于函数类型定义
   - 都可以被`implements`

   ```ts
   type Person = { name: string; age: number };
   interface Person { name: string; age: number }
   
   type SayHi = (name: string) => void;
   interface SayHi { (name: string): void; }
   
   class Student implements Person {
     name = "Tom";
     age = 20;
   }
   ```

- 不同点： 

   - `interface` 支持 **继承**（extends）和多继承：

      ```ts
      interface A { a: string }
      interface B { b: number }
      interface C extends A, B { c: boolean }
      ```

   - `type` 只能通过交叉类型（`&`）组合：

     ```ts
     type A = { a: string }
     type B = { b: number }
     type C = A & B & { c: boolean }
     ```

   - `interface` 可以多次声明并**自动合并**：

      ```ts
      interface Animal {
        name: string;
      }
      interface Animal {
        age: number;
      }
      
      const dog: Animal = { name: "Dog", age: 3 };
      ```

   - `type` 不能重复声明同名类型，否则会报错：

      ```ts
      type Animal = { name: string };
      // ❌ 报错：重复标识符
      // type Animal = { age: number };
      ```

   - `interface`，只能为对象指定类型。 

   - `type`别名，不仅可以为对象指定类型，实际上可以为任意类型指定别名。

![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171447897.png)

#### 对象类型

JS 中的对象是由属性和方法构成的，而 TS 中对象的类型就是在描述对象的结构（有什么类型的属性和方法）。对象类型的写法：
![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171447645.png)
解释：

1. 直接使用 {} 来描述对象结构。属性采用属性名: 类型的形式；方法采用方法名(): 返回值类型的形式。
2. 如果方法有参数，就在方法名后面的小括号中指定参数类型（比如：greet(name: string): void）。
3. 在一行代码中指定对象的多个属性类型时，使用 ;（分号）来分隔。
- 如果一行代码只指定一个属性类型（通过换行来分隔多个属性类型），可以去掉 ;（分号）
- 方法的类型也可以使用箭头函数形式（比如：{ sayHi: () => void }）。
### 其它类型
#### 元组
场景：在地图中，使用经纬度坐标来标记位置信息。
可以使用数组来记录坐标，那么，该数组中只有两个元素，并且这两个元素都是数值类型。
![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171447459.png)
使用 number[] 的缺点：不严谨，因为该类型的数组中可以出现任意多个数字。
更好的方式：元组（Tuple）。
![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171447415.png)
元组类型是另一种类型的数组，它确切地知道包含多少个元素，以及特定索引对应的类型。
解释：

1. 元组类型可以确切地标记出有多少个元素，以及每个元素的类型。
2. 该示例中，元素有两个元素，每个元素的类型都是 number。
#### 函数类型
函数的类型实际上指的是：函数参数和返回值的类型。
为函数指定类型的两种方式：

1. 单独指定参数、返回值的类型
2. 同时指定参数、返回值的类型

![单独指定参数、返回值的类型](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171448880.png "单独指定参数、返回值的类型")
![同时指定参数、返回值的类型](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171448817.png "同时指定参数、返回值的类型")
解释：当函数作为表达式时，可以通过类似箭头函数形式的语法来为函数添加类型。 
注意：这种形式只适用于函数表达式。
![如果函数没有返回值，那么，函数返回值类型为：void](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171448314.png "如果函数没有返回值，那么，函数返回值类型为：void")

```typescript
// 没有传入参数时才去使用默认参数
function add(a:number = 10, b:number = 20):number {
 return a + b
}
// 有可选参数时不能有默认参数，严格模式下可选参数会报错
function add1(a: number = 10, b?: number): number {
 return a + b
}
console.log(add1(1)); // 1 + undefined => NaN
add(1) // 21
```
```typescript
interface Obj {
 user: number[],
 add: (this:Obj, num:number) => void
}
// ts 可以定义 this 的类型，在 js 中无法使用，必须是第一个参数定义 this 的类型
let obj: Obj = {
 user: [1, 2],
 add(this: Obj, num: number) {
 this.user.push(num)
 },
}
obj.add(4)
console.log(obj);
//{ user: [ 1, 2, 4 ], add: [Function: add] }
```
#### 字面量类型
思考以下代码，两个变量的类型分别是什么？

![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171448481.png)

通过 TS 类型推论机制，可以得到答案：

1. 变量 str1 的类型为：string。
2. 变量 str2 的类型为：'Hello TS'。

解释：

- str1 是一个变量（let），它的值可以是任意字符串，所以类型为：string。
- str2 是一个常量（const），它的值不能变化只能是 'Hello TS'，所以，它的类型为：'Hello TS'。
> 注意：此处的 'Hello TS'是一个字面量类型。也就是说某个特定的字符串也可以作为 TS 中的类型。
除字符串外，任意的 JS 字面量（比如，对象、数字等）都可以作为类型使用。

使用模式：字面量类型配合联合类型一起使用。
使用场景：用来表示一组明确的可选值列表。
```typescript
function printText(s: string, alignment: "left" | "right" | "center") {
  console.log(s, alignment)
}

printText('hello', 'left')
printText('hello', 'aaa') // 错误: 取值只能是 left | right | center
```
优势：相比于 string 类型，使用字面量类型更加精确、严谨。
#### 枚举
枚举的功能类似于字面量类型+联合类型组合的功能，也可以表示一组明确的可选值。
枚举：定义一组命名常量。它描述一个值，该值可以是这些命名常量中的一个。
![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171448484.png)
解释：

1. 使用 `enum`关键字定义枚举。
2. 约定枚举名称、枚举中的值以大写字母开头。
3. 枚举中的多个值之间通过 ,（逗号）分隔。
4. 定义好枚举后，直接使用枚举名称作为类型注解。

---

形参 direction 的类型为枚举 Direction，实参的值就应该是枚举 Direction 成员的任意一个。 
![访问枚举成员](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171448071.png "访问枚举成员")
解释：类似于 JS 中的对象，直接通过点（.)语法访问枚举的成员。

---

把枚举成员作为了函数的实参，它的值是什么呢？
![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171448252.png)
解释：通过将鼠标移入 Direction.Up，可以看到枚举成员 Up 的值为 0。 
注意：枚举成员是有值的，默认为：从 0 开始自增的数值。 
我们把，枚举成员的值为数字的枚举，称为：数字枚举。 
当然，也可以给枚举中的成员初始化值。
![枚举成员的初始化](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171448704.png "枚举成员的初始化")

---

字符串枚举：枚举成员的值是字符串。
![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171448379.png)
注意：字符串枚举没有自增长行为，因此，字符串枚举的每个成员必须有初始值。

---

枚举是 TS 为数不多的非 JavaScript 类型级扩展（不仅仅是类型）的特性之一。 
因为：其他类型仅仅被当做类型，而枚举不仅用作类型，还提供值（枚举成员都是有值的）。 
也就是说，其他的类型会在编译为 JS 代码时自动移除。但是，枚举类型会被编译为 JS 代码！ 
![TS->JS](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171448592.png "TS->JS")
说明：枚举与前面讲到的字面量类型+联合类型组合的功能类似，都用来表示一组明确的可选值列表。 
一般情况下，推荐使用字面量类型+联合类型组合的方式，因为相比枚举，这种方式更加直观、简洁、高效。

#### any
原则：**不推荐使用 any**！这会让 TypeScript 变为 “AnyScript”（失去 TS 类型保护的优势）。 因为当值的类型为 any 时，可以对该值进行任意操作，并且不会有代码提示。 
![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171448624.png)
解释：以上操作都不会有任何类型错误提示，即使可能存在错误！ 
尽可能的避免使用 any 类型，除非临时使用 any 来“避免”书写很长、很复杂的类型！ 
其他隐式具有 any 类型的情况：1 声明变量不提供类型也不提供默认值 2 函数参数不加类型。 
注意：因为不推荐使用 any，所以，这两种情况下都应该提供类型！

#### never
在 TypeScript 中， never 是一种特殊的类型，表示永远不会发生的值或类型。它通常用于表示一些绝对不可能出现的情况，例如永远不会返回的函数类型或在某些条件下绝对不会发生的值。 

1. 这里， throwError 函数永远不会正常返回，它总是会抛出一个错误，因此其返回类型是 never 。
```typescript
// 并不是没有返回值，而是抛出错误，因此此时用 never 比 void 更合适
function throwError(): never {
  throw new Error('error')
}
throwError()
// 死循环也可以用never
function xx():never {
  while(true) {
  }
}
```

2. 由于 never 表示不可能的情况，因此在联合类型中，如果其中一个分支的类型是 never ，那么该联合类型实际上将被缩减为其他分支的类型。
```typescript
type InvalidType = string | never;
let invalidValue: InvalidType;
invalidValue = "hello"; // 正常赋值
// invalidValue = throwError("Something went wrong"); // 报错：Type 'never' is not assignable to type 'string'.
```

3. 在条件类型中，如果条件判断为 false ，则分配类型为 never 。
```typescript
type MyType<T> = T extends string ? string : never;
let str: MyType<number>; // 类型为 never
```

4. 兜底判断
```typescript
type a = '唱' | '跳' | 'rap' | '篮球'
function kun(value:a) {
  switch (value) {
    case '唱':
      break
    case '跳':
      break
    case 'rap':
      break
    //case '篮球':
    //break
    default:
      // 兜底逻辑
      const error :never = value // 此时报错
      break
  }
}
kun('篮球')
```
#### typeof
JS 中提供了 typeof 操作符，用来在 JS 中获取数据的类型。 
![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171448800.png)
TS 也提供了 typeof 操作符：可以在**类型上下文**中引用变量或属性的类型（类型查询）。 
使用场景：根据已有变量的值，获取该值的类型，来简化类型书写。
![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171448433.png)解释：

1. 使用 typeof 操作符来获取变量 p 的类型，结果与第一种（对象字面量形式的类型）相同。
2. typeof 出现在类型注解的位置（参数名称的冒号后面）所处的环境就在类型上下文（区别于 JS 代码）。
3. 注意：typeof 只能用来查询变量或属性的类型，无法查询其他形式的类型（比如，函数调用的类型）。
#### nullish
```typescript
function test(x?: string | null) {
  console.log(x?.toUpperCase())
}

test('aaa')
test(null)
test()
```

- x?: string | null 表示可能是 undefined 或者是 string 或者是 null
#### Symbol
Symbol 是一种基本数据类型，用于创建独一无二的标识符。它是 ECMAScript 6（ES6）引入的新特性，并且也被 TypeScript 支持。 Symbol 可以用于创建对象属性、类成员、和其他上下文中，以确保它们的唯一性，从而避免命名冲突和混淆。

1. 使用 Symbol() 函数可以创建一个新的 Symbol。每个 Symbol 都是唯一的，不能通过常规的方法进行比较。 

```typescript
let a1:symbol = Symbol(1)
let a2:symbol = Symbol(1)
// console.log(a1 === a2) // false
// console.log(a1 == a2) // false 因为内存地址都是不同的
// Symbol.for 去全局 symbol 有没有注册过这个 key，如果有直接拿来用，没有就去创建一个
// console.log(Symbol.for('a') === Symbol.for('a')); // true
let obj = {
  name: 1,
  a1: 111,
  a2: 222
}
// console.log(obj); // { name: 1, a1: 111, a2: 222 }
let obj2 = {
  name: 1,
  [a1]: 111, // 使用索引签名
  [a2]: 222
}
console.log(obj2); // { name: 1, [Symbol(1)]: 111, [Symbol(1)]: 222 }
// for in 不能读到 Symbol
for(let key in obj) {
  console.log(key); // name
}
// keys 读不到 Symbol，只能读到 name
console.log(Object.keys(obj));
// getOwnPropertyNames 读不到 Symbol，只能读到 name
console.log(Object.getOwnPropertyNames(obj));
// getOwnPropertySymbols 读到 Symbol，但又读不到 name 了
console.log(Object.getOwnPropertySymbols(obj));
// Reflect.ownKeys 可以读到 Symbol 和 name
console.log(Reflect.ownKeys(obj));
```

2. **Symbol 用作对象属性： **Symbol 可以用作对象的属性名，以避免属性名冲突。因为 Symbol 是唯一的，所以不会意外覆盖其他属性。
```typescript
const myObj = {
 [mySymbol]: "This is a Symbol property"
};
console.log(myObj[mySymbol]); // Output: This is a Symbol property
```

3. **内置 Symbols：** TypeScript 和 JavaScript 提供了一些预定义的内置 Symbols，例如 Symbol.iterator 、 Symbol、toStringTag 等，用于指定对象的特定行为或元信息。
4. **Symbol 作为类成员：** Symbol 可以用作类的成员，用于定义私有成员或特定的行为。
```typescript
const _privateSymbol = Symbol("private");
class MyClass {
 private[_privateSymbol] = "This is a private symbol property";
}
const instance = new MyClass();
console.log(instance[_privateSymbol]); // Output: This is a private symbol property
```

5. **Symbols 作为属性键的限制：** 使用 Symbol 作为属性键可以在一定程度上限制外部对属性的访问。但并不是绝对的私有性，因为使用 Object.getOwnPropertySymbols() 仍然可以获取到对象的 Symbol 属性。
```typescript
const obj = {
 [mySymbol]: "This is a Symbol property"
};
const symbolKeys = Object.getOwnPropertySymbols(obj);
console.log(obj[symbolKeys[0]]); // Output: This is a Symbol property
```
### 生成器
```typescript
function * generator() {
 yield Promise.resolve('xx')
 yield 1;
 yield 2;
 yield '3';
}
const man = generator();
console.log(man.next()); // { value: Promise { 'xx' }, done: false }
console.log(man.next()); // { value: 1, done: false }
console.log(man.next()); // { value: 2, done: false }
console.log(man.next()); // { value: '3', done: false }
console.log(man.next()); // { value: undefined, done: true }
```
### 迭代器
```typescript
const myArray = [1, 2, 3];
const iterator = myArray[Symbol.iterator]();

console.log(iterator.next());  // 输出: { value: 1, done: false }
console.log(iterator.next());  // 输出: { value: 2, done: false }
console.log(iterator.next());  // 输出: { value: 3, done: false }
console.log(iterator.next());  // 输出: { value: undefined, done: true }
```
```typescript
// Set
let set:Set<number> = new Set([1,1,2,2,3,3])
console.log(set); // Set(3) { 1, 2, 3 }
// Map
let map:Map<any,any> = new Map()
let Arr = [1,2,4]
map.set(Arr,'xx')
// 这里是将 Arr 数组当作 map 元素的 key，'xx' 是 value 插入到 map 中，所以在获取数据的时候用的是 Arr
console.log(map.get(Arr)); // xx
// 伪数组
function args() {
 console.log(arguments);
}
// let list = document.querySelectorAll('div'); // 需要浏览器环境，node 环境不支持
```
```typescript
let set:Set<number> = new Set([1,1,2,2,3,3])
let map:Map<any,any> = new Map()
let Arr = [1,2,4]
map.set(Arr,'xx')
const each = (value:any) => {
 let i:any = value[Symbol.iterator]()
 let next:any = {done:false}
 while(!next.done){
 next = i.next()
 if(!next.done) {
 console.log(next.value)
 }
 }
}
each(map) // [ [ 1, 2, 4 ], 'xx' ] 输出 key value 的数组
each(set) // 1 2 3
```
#### 语法糖

##### `for...of` 循环
`for...of` 循环是一种用于遍历可迭代对象的语法糖形式，它会自动调用迭代器的 `next()` 方法来遍历对象的元素。使用 `for...of` 循环可以避免手动调用 `next()` 方法，并且代码更加简洁易读。例如： 

```typescript
const myArray = [1, 2, 3];
for (const item of myArray) {
  console.log(item);
}
```

##### 扩展运算符`...`
扩展运算符 `...` 可以将可迭代对象展开成独立的元素，从而可以方便地在函数调用、数组字面量等地方使用。扩展运算符在实现迭代器时尤其有用。例如： 

```typescript
const myArray = [1, 2, 3];
const newArray = [...myArray];
console.log(newArray);  // 输出: [1, 2, 3]
```

##### 解构赋值
解构赋值可以从可迭代对象中提取值并赋值给变量，这样可以方便地获取迭代器返回的元素。例如： 

```typescript
const myArray = [1, 2, 3];
const [first, second, third] = myArray;
console.log(first);    // 输出: 1
console.log(second);   // 输出: 2
console.log(third);    // 输出: 3
```
### 类型别名
类型别名（自定义类型）：为任意类型起别名。
使用场景：当同一类型（复杂）被多次使用时，可以通过类型别名，简化该类型的使用。

![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171449009.png)

解释：

1. 使用 **type** 关键字来创建类型别名。
2. 类型别名（比如，此处的 CustomArray），可以是任意合法的变量名称。
3. 创建类型别名后，直接使用该类型别名作为变量的类型注解即可
### 可选属性
如果需要某个属性可选，可以用下面的语法
```typescript
interface Cat {
  name: string,
  age?: number
}

const c1: Cat = { name: '小白', age: 1 }
const c2: Cat = { name: '小花' }					  // 正确: age 属性可选
```

- 可选属性要注意处理 undefined 值

![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171449293.png)
可选参数：在可传可不传的参数名称后面添加 ?（问号)。 
注意：可选参数只能出现在参数列表的最后，也就是说可选参数后面不能再出现必选参数。

对象的属性或方法，也可以是可选的，此时就用到可选属性了。 
![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171449370.png)
比如，我们在使用 axios({ … }) 时，如果发送 GET 请求，method 属性就可以省略。 
可选属性的语法与函数可选参数的语法一致，都使用 ?（问号)来表示

### 类型推论
在 TS 中，某些没有明确指出类型的地方，TS 的类型推论机制会帮助提供类型。 
换句话说：由于类型推论的存在，这些地方，类型注解可以省略不写！ 
发生类型推论的 2 种常见场景：1 声明变量并初始化时 2 决定函数返回值时。 
![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171449592.png)
注意：这两种情况下，类型注解可以省略不写！ 
推荐：能省略类型注解的地方就省略（充分利用TS类型推论的能力，提升开发效率)。 
技巧：如果不知道类型，可以通过鼠标放在变量名称上，利用 IDE 的提示来查看类型。

### 类型断言
有时候你会比 TS 更加明确一个值的类型，此时，可以使用类型断言来指定更具体的类型。 
例如：
![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171449463.png)
注意：getElementById 方法返回值的类型是 HTMLElement，该类型只包含所有标签公共的属性或方法，不包含 a 标签特有的 href 等属性。 
因此，这个**类型太宽泛（不具体）**，无法操作 href 等 a 标签特有的属性或方法。 
解决方式：这种情况下就需要使用类型断言指定更加具体的类型。
![使用类型断言](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171449325.png "使用类型断言")解释：

1. 使用 as 关键字实现类型断言。
2. 关键字 as 后面的类型是一个更加具体的类型（HTMLAnchorElement 是 HTMLElement 的子类型）。
3. 通过类型断言，aLink 的类型变得更加具体，这样就可以访问 a 标签特有的属性或方法了。
另一种语法，使用 <> 语法，这种语法形式不常用,知道即可。

![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171449714.png)
> 技巧：在浏览器控制台，通过 console.dir() 打印 DOM 元素，在属性列表的最后面，即可看到该元素的类型。

## 高级类型
> 关于 TypeScript 与 JavaScript 中的类语法不是重点，class 相关语法只是起到辅助作用，更重要的是前面的 interface

### class
#### 基本语法
```typescript
class User {
    name: string;	// 分号可以省略
    // 构造函数
    constructor(name: string) {
        this.name = name
    }
}

const u = new User('张三')
```
其实会被编译成这个样子（默认 --target=es3）
```javascript
var User = /** @class */ (function () {
    function User(name) {
        this.name = name;
    }
    return User;
}());
var u = new User('张三');
```
所以 js 中的 class，并不等价于 java 中的 class，它还是基于原型实现的。
##### 方法
```typescript
class User {
  readonly name: string;

  constructor(name: string) {
    this.name = name
  }

  hello(name : String) : void {
    console.log(`hello ${name}`);
  }

  study() {	// 默认返回值为void
    console.log(`[${this.name}]正在学习`)
  }
}

const u = new User('张三')
u.study()
```
##### get，set
```typescript
class User {
  _name: string;	// _代表私有属性

  constructor(name: string) {
    this._name = name
  }

  get name() {
    return this._name
  }

  set name(name: string) {
    this._name = name
  }
}

const u = new User('张三')
console.log(u.name)
u.name = '李四'
console.log(u.name)
```

- 注意，需要在编译时加上 `tsc --target es6 .\xxx.ts` 选项
- es6 等价于 es2015，再此之上还有 es2016 ... es2022
##### 继承
类继承的两种方式：1 extends（继承父类） 2 implements（实现接口）。 
说明：JS 中只有 extends，而 implements 是 TS 提供的。
![extends](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171450437.png "extends")
解释：

1. 通过 extends 关键字实现继承。
2. 子类 Dog 继承父类 Animal，则 Dog 的实例对象 dog 就同时具有了父类 Animal 和 子类 Dog 的所有属性和方法。

---

类继承的两种方式：1 extends（继承父类） 2 implements（实现接口）。
![implements](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171450786.png "implements")
解释：

1. 通过 implements 关键字让 class 实现接口。
2. Person 类实现接口 Singable 意味着，Person 类中必须提供 Singable 接口中指定的所有方法和属性。
##### 类与接口
```typescript
interface User {
  name: string
  study(course: string): void
}

class UserImpl implements User {
  name: string;
  constructor(name: string) {
    this.name = name
  }
  study(course: string) {
    console.log(`[${this.name}]正在学习[${course}]`)
  }
  foo() { }
}

const user: User = new UserImpl('张三')
user.study('Typescript')
user.foo() // 错误，必须是接口中定义的方法
```
##### 继承与接口
```typescript
interface Flyable {
  fly(): void
}

class Animal {
  name: string;
  constructor(name: string) {
    this.name = name
  }
}

class Bird extends Animal implements Flyable {
  fly() {
    console.log(`${this.name}在飞翔`)
  }
}

const b: Flyable & Animal = new Bird("小花")
b.fly()
```

- Flyable & Animal 表示变量是 flyable 类型，同时也是 Animal 类型
##### 方法重写
```typescript
class Father {
  study(): void {
    console.log(`father study`)
  }
}

class Son extends Father {  
  study(): void {
    super.study()
    console.log(`son study`)
  }
}

const f: Father = new Son()
f.study()
```
#### 成员可见性
类成员可见性：可以使用 TS 来控制 class 的方法或属性对于 class 外的代码是否可见。 
可见性修饰符包括：1 public（公有的） 2 protected（受保护的） 3 private（私有的）。

![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171450353.png)

1. public：表示公有的、公开的，公有成员可以被任何地方访问，默认可见性。

解释：

- 在类属性或方法前面添加 public 关键字，来修饰该属性或方法是共有的。
- 因为 public 是默认可见性，所以，可以直接省略
2. protected：表示受保护的，仅对其声明所在类和子类中（非实例对象）可见。

![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171450650.png)
解释：

- 在类属性或方法前面添加 protected 关键字，来修饰该属性或方法是受保护的。
- 在子类的方法内部可以通过 this 来访问父类中受保护的成员，但是，**对实例不可见！**
3. private：表示私有的，只在当前类中可见，对实例对象以及子类也是不可见的。

![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171450800.png)
解释：

- 在类属性或方法前面添加 private 关键字，来修饰该属性或方法是私有的。
- 私有的属性或方法只在当前类中可见，对子类和实例对象也都是不可见的！
#### 只读属性
readonly：表示只读，用来防止在构造函数之外对属性进行赋值，这个属性ts特有。
```typescript
class User {
  readonly name: string;
  readonly age: number = 18;
  
  constructor(name: string) {
      this.name = name
  }
}

const u = new User('张三')
u.name = '李四'				// 编译错误
```
解释：

1. 使用 readonly 关键字修饰该属性是只读的，注意**只能修饰属性不能修饰方法**。
2. 注意：属性 age 后面的类型注解（比如，此处的 number）如果不加，则 age 的类型为 18 （字面量类型）。
3. **接口或者 {} 表示的对象类型，也可以使用 readonly**。
#### 抽象
特点：

- 抽象类不能被实例化。 
- 抽象类**可以包含抽象方法和非抽象方法**。抽象方法只有方法签名，没有实际的实现，需要在子类中进行实现。非抽象方法可以有实际的实现，子类可以直接继承或覆盖它。 
- 任何包含抽象方法的类都必须声明为抽象类。 
- 子类继承抽象类时，必须实现父类中的抽象方法
### **类型兼容性**
#### 鸭子类型
两种类型系统：

1. Structural Type System（结构化类型系统） 
2. Nominal Type System（标明类型系统）。 

TS 采用的是结构化类型系统，也叫做 duck typing（**鸭子类型**），类型检查关注的是值所具有的形状。 
也就是说，在结构类型系统中，如果两个对象具有相同的形状，则认为它们属于同一类型。
![案例1](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171450228.png "案例1")
解释：

1. Point 和 Point2D 是两个名称不同的类。
2. 变量 p 的类型被显示标注为 Point 类型，但是它的值却是 Point2D 的实例，并且没有类型错误。
3. 因为 TS 是结构化类型系统，只检查 Point 和 Point2D 的结构是否相同（相同，都具有 x 和 y 两个属性，属性类型也相同）。
4. 但如果在 Nominal Type System 中（比如C#、Java 等），它们是不同的类，类型无法兼容。
```typescript
interface Cat {
  name: string
}

function test(cat: Cat) {
  console.log(cat.name)
}

const c1 = { name: '小白', age: 1 } 
test(c1)
```
const c1 并没有声明类型为 Cat，但它与 Cat 类型有一样的属性，也可以被当作是 Cat 类型

---

**注意：**在结构化类型系统中，如果两个对象具有相同的形状，则认为它们属于同一类型，这种说法并不准确。
更准确的说法：对于对象类型来说，y 的成员至少与 x 相同，则 x 兼容 y（**成员多的可以赋值给少的**）
![成员多的赋值给少的](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171450605.png "成员多的赋值给少的")
解释：

1. Point3D 的成员至少与 Point 相同，则 Point 兼容 Point3D。
2. 所以，成员多的 Point3D 可以赋值给成员少的 Point。
#### 接口兼容性
除了 class 之外，TS 中的其他类型也存在相互兼容的情况，包括接口兼容性、函数兼容性 等。

- 接口之间的兼容性，类似于 class。并且，class 和 interface 之间也可以兼容。![接口之间的兼容性](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171450172.png "接口之间的兼容性")
#### 函数兼容性
函数之间兼容性比较复杂，需要考虑：**参数个数** 、**参数类型 **、**返回值类型**

1. 参数个数，参数多的兼容参数少的（或者说，参数少的可以赋值给多的）。

![函数之间的兼容性](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171450559.png "函数之间的兼容性")
解释：

- 参数少的可以赋值给参数多的，所以，f1 可以赋值给 f2。
- 数组 forEach 方法的第一个参数是回调函数，该示例中类型为：(value: string, index: number, array: string[]) => void。
- 在 JS 中省略用不到的函数参数实际上是很常见的，这样的使用方式，促成了 TS 中函数类型之间的兼容性。
- 并且因为回调函数是有类型的，所以，TS 会自动推导出参数 item、index、array 的类型。
2. 参数类型，相同位置的参数类型要相同（原始类型）或兼容（对象类型）。

![案例1](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171450042.png "案例1")
解释：函数类型 F2 兼容函数类型 F1，因为 F1 和 F2 的第一个参数类型相同。
![案例2](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171451724.png "案例2")
解释：

- 注意，此处与前面讲到的接口兼容性冲突。
- 技巧：将对象拆开，把每个属性看做一个参数，参数少的（f2）可以赋值给参数多的（f3）
3. 返回值类型，只关注返回值类型本身即可：

![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171451609.png)解释：

1. 如果返回值类型是原始类型，此时两个类型要相同，比如，左侧类型 F5 和 F6。
2. 如果返回值类型是对象类型，此时成员多的可以赋值给成员少的，比如，右侧类型 F7 和 F8。
### 交叉类型
交叉类型（&）和接口继承（extends）的对比： 

- 相同点：都可以实现对象类型的组合。 
- 不同点：两种方式实现类型组合时，对于同名属性之间，处理类型冲突的方式不同。

![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171451368.png)
说明：以上代码，接口继承会报错（类型不兼容）；交叉类型没有错误，可以简单的理解为：

![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171451195.png)

### 泛型
#### 基本使用
下面的几个类型声明显然有一定的相似性
```typescript
interface RefString {
  value: string
}

interface RefNumber {
  value: number
}

interface RefBoolean {
  value: boolean
}

const r1: RefString = { value: 'hello' }
const r2: RefNumber = { value: 123 }
const r3: RefBoolean = { value: true }
```
```typescript
interface Ref<T> {
  value: T
}

const r1: Ref<string> = { value: 'hello' }
const r2: Ref<number> = { value: 123 }
const r3: Ref<boolean> = { value: true }
```

- 泛型的要点就是 `<类型参数>`，把【类型】也当作一个变化的要素，像参数一样传递过来，这样就可以派生出结构相似的新类
#### 泛型函数
```typescript
function ref<T>(n: T): Ref<T> {
  return { value: n }
}

const v1 = ref("hello"); 	// Ref<string>
const v2 = ref(123.3333);	// Ref<number>

v1.value.toLocaleLowerCase()
v2.value.toFixed(2)
```
![调用泛型函数](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171451630.png "调用泛型函数")
![简化调用泛型函数](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171451201.png "简化调用泛型函数")

#### 泛型接口
泛型接口：接口也可以配合泛型来使用，以增加其灵活性，增强其复用性![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171451883.png)解释：

1. 在接口名称的后面添加 <类型变量>，那么，这个接口就变成了泛型接口。
2. 接口的类型变量，对接口中所有其他成员可见，也就是接口中所有成员都可以使用类型变量。
3. 使用泛型接口时，需要显式指定具体的类型（比如，此处的 IdFunc）。
4. 此时，id 方法的参数和返回值类型都是 number；ids 方法的返回值类型是 number[]。

---

![JS 中的数组在 TS 中就是一个泛型接口](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171451332.png "JS 中的数组在 TS 中就是一个泛型接口")
```typescript
// 声明一个数组变量并指定元素类型为 number
let numbers: number[] = [1, 2, 3, 4, 5];
// 使用泛型接口 Array<T> 来表示数组
let numbersGeneric: Array<number> = [1, 2, 3, 4, 5];
```
解释：当我们在使用数组时，TS 会根据数组的不同类型，来自动将类型变量设置为相应的类型。 
技巧：可以通过 Ctrl + 鼠标左键（Mac：option + 鼠标左键）来查看具体的类型信息。
#### 泛型约束
泛型约束：默认情况下，泛型函数的类型变量 Type 可以代表多个类型，这导致无法访问任何属性。 比如，id('a') 调用函数时获取参数的长度：

![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171451632.png)

解释：Type 可以代表任意类型，无法保证一定存在 length 属性，比如 number 类型就没有 length。 此时，就需要为泛型添加约束来**收缩类型**（缩窄类型取值范围)
添加泛型约束收缩类型，主要有以下两种方式：1->指定更加具体的类型 2->添加约束。

1. **指定更加具体的类型**

![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171451660.png)

比如，将类型修改为 Type[]（Type 类型的数组)，因为只要是数组就一定存在 length 属性，因此就可以访问了。

2. **添加约束**

![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171451673.png)
解释：

1. 创建描述约束的接口 ILength，该接口要求提供 length 属性。
2. 通过 extends 关键字使用该接口，为泛型（类型变量）添加约束。
3. 该约束表示：传入的类型必须具有 length 属性。

**注意**：传入的实参（比如，数组）只要有 length 属性即可，这也符合前面讲到的接口的类型兼容性。
泛型的类型变量可以有多个，并且类型变量之间还可以约束（比如，第二个类型变量受第一个类型变量约束）。 比如，创建一个函数来获取对象中属性的值：![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171452408.png)解释：

1. 添加了第二个类型变量 Key，两个类型变量之间使用（**,**）**逗号**分隔。
2. `keyof` 关键字接收一个对象类型，生成其键名称（可能是字符串或数字）的联合类型。
```typescript
interface Person {
    name: string;
    age: number;
    address: string;
}
// 这里的PersonKeys类型为 "name" | "age" | "address"
type PersonKeys = keyof Person; 
```

3. 本示例中 keyof Type 实际上获取的是 person 对象所有键的联合类型，也就是：'name' | 'age'。
4. 类型变量 Key 受 Type 约束，可以理解为：Key 只能是 Type 所有键中的任意一个，或者说只能访问对象中存在的属性。
#### 泛型工具
泛型工具类型：TS 内置了一些常用的工具类型，来简化 TS 中的一些常见操作。
说明：它们都是基于泛型实现的（泛型适用于多种类型，更加通用），并且是内置的，可以直接在代码中使用。这些工具类型有很多，主要学习以下几个：

1. ``Partial<Type>``
2. `Readonly<Type>`
3. `Pick<Type, Keys>`
4. `Record<Keys, Type>`
##### ``Partial<Type>``
``Partial<Type>`` 用来构造（创建）一个类型，将 Type 的所有属性设置为可选。 

![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171452342.png)

解释：构造出来的新类型 PartialProps 结构和 Props 相同，但所有属性都变为可选的。

##### `Readonly<Type>`
`Readonly<Type>` 用来构造一个类型，将 Type 的所有属性都设置为 readonly（只读）。

![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171452243.png) 

解释：构造出来的新类型 ReadonlyProps 结构和 Props 相同，但所有属性都变为只读的。

![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171452716.png)

当我们想重新给 id 属性赋值时，就会报错：无法分配到 "id" ，因为它是只读属性。

##### `Pick<Type, Keys>`
`Pick<Type, Keys>` 从 Type 中选择一组属性来构造新类型。

![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171452091.png)

解释：

1. Pick 工具类型有两个类型变量：1->表示**选择谁的属性** 2->表示**选择哪几个属性**。
2. 其中第二个类型变量，如果只选择一个则只传入该属性名即可。
3. 第二个类型变量传入的属性**只能是第一个类型变量中存在的属性**。
4. 构造出来的新类型 PickProps，只有 id 和 title 两个属性类型。
##### Record<Keys, Type>
`Record<Keys,Type>` 构造一个对象类型，属性键为 Keys，属性类型为 Type。

![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171452942.png)
解释：

1. Record 工具类型有两个类型变量：1->表示**对象有哪些属性** 2->**表示对象属性的类型**。
2. 构建的新对象类型 RecordObj 表示：这个对象有三个属性分别为a/b/c，属性值的类型都是 string[]。
### 索引签名类型
绝大多数情况下，我们都可以在使用对象前就确定对象的结构，并为对象添加准确的类型。 
使用场景：当无法确定对象中有哪些属性（或者说对象中可以出现任意多个属性），此时，就用到索引签名类型了。![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171452712.png)
解释：

1. 使用 `[key: string]` 来约束该接口中允许出现的属性名称。表示只要是 string 类型的属性名称，都可以出现在对象中。
2. 这样，对象 obj 中就可以出现任意多个属性（比如，a、b 等）。
3. **key 只是一个占位符**，可以换成任意合法的变量名称。
4. 隐藏的前置知识：JS 中对象（{}）的键是 string 类型的。

---

在 JS 中数组是一类特殊的对象，特殊在**数组的键（索引）是数值类型**。
并且，数组也可以出现任意多个元素。所以，在数组对应的泛型接口中，也用到了索引签名类型。
![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171452674.png)
解释：

1. MyArray 接口模拟原生的数组接口，并使用`[n: number]`来作为索引签名类型。
2. 该索引签名类型表示：只要是 number 类型的键（索引）都可以出现在数组中，或者说数组中可以有任意多个元素。
3. 同时也符合数组索引是 number 类型这一前提。
### 映射类型
映射类型：基于旧类型创建新类型（对象类型），减少重复、提高开发效率。
比如，类型 PropKeys 有 x/y/z，另一个类型 Type1 中也有 x/y/z，并且 Type1 中 x/y/z 的类型相同：
![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171452593.png)
这样书写没错，但 x/y/z 重复书写了两次。像这种情况，就可以使用映射类型来进行简化。	
![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171452935.png)
解释：

1. 映射类型是基于索引签名类型的，所以，该语法类似于索引签名类型，也使用了 []。
2. `Key in PropKeys` 表示 Key 可以是 PropKeys 联合类型中的任意一个，类似于 forin(let k in obj)。
3. 使用映射类型创建的新对象类型 Type2 和类型 Type1 结构完全相同。
4. 注意：**映射类型只能在类型别名中使用，不能在接口中使用**。

---

映射类型除了根据**联合类型**创建新类型外，还可以根据**对象类型**来创建：
![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171452890.png)
解释：

1. 首先，先执行 `keyof Props` 获取到对象类型 Props 中所有键的联合类型即，'a' | 'b' | 'c'。
2. 然后，`Key in ...` 就表示 Key 可以是 Props 中所有的键名称中的任意一个。

![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171452657.png)

---

实际上，前面讲到的泛型工具类型（比如，`Partial<Type>`）都是基于映射类型实现的。 
比如，`Partial<Type>` 的实现：
![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171453943.png)解释：

1. `keyof T` 即 keyof Props 表示获取 Props 的所有键，也就是：'a' | 'b' | 'c'。
2. 在 [] 后面添加 `**?**`（问号），表示将这些属性变为**可选**的，以此来实现 Partial 的功能。
3. 冒号后面的`T[P]` **表示获取 T 中每个键对应的类型**。比如，如果是 'a' 则类型是 number；如果是 'b' 则类型是 string。
4. 最终，新类型 PartialProps 和旧类型 Props 结构完全相同，只是让所有类型都变为可选了。

---

刚刚用到的 T[P] 语法，在 TS 中叫做索引查询（访问）类型。 
作用：用来查询属性的类型。
![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171453380.png)解释：Props['a'] 表示查询类型 Props 中属性 'a' 对应的类型 number。所以，TypeA 的类型为 number。 
注意：[] 中的属性必须存在于被查询类型中，否则就会报错。

---

索引查询类型的其他使用方式：同时查询多个索引的类型 
![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171453515.png)
解释：使用字符串字面量的联合类型，获取属性 a 和 b 对应的类型，结果为： string | number。 
![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171453247.png)
解释：使用 `keyof` 操作符获取 Props 中所有键对应的类型，结果为： string | number | boolean。

## 类型声明文件
### 概述
今天几乎所有的 JavaScript 应用都会引入许多第三方库来完成任务需求。
这些第三方库不管是否是用 TS 编写的，最终都要编译成 JS 代码，才能发布给开发者使用。
我们知道是 TS 提供了类型，才有了代码提示和类型保护等机制。
但在项目开发中使用第三方库时，你会发现它们几乎都有相应的 TS 类型，这些类型是怎么来的呢？类型声明文件
**类型声明文件：用来为已存在的 JS 库提供类型信息。**
这样在 TS 项目中使用这些库时，就像用 TS 一样，都会有代码提示、类型保护等机制了。

1. TS 的两种文件类型
2. 类型声明文件的使用说明
### 2种文件类型
TS 中有两种文件类型：1->`.ts` 文件	2->`.d.ts` 文件。

- ts 文件：
   1. **既包含类型信息又可执行代码**。
   2. 可以被编译为 .js 文件，然后，执行代码。
   3. 用途：编写程序代码的地方。
- 文件：
   4. 只包含类型信息的类型声明文件。
   5. **不会生成 .js 文件**，仅用于**提供类型信息**。
   6. 用途：为 JS 提供类型信息。

总结：`.ts` 是 implementation（代码实现文件）；`.d.ts` 是 declaration（类型声明文件）。
如果要为 JS 库提供类型信息，要使用 .d.ts 文件。
### 使用说明
在使用 TS 开发项目时，类型声明文件的使用包括以下两种方式：

1. 使用已有的类型声明文件
   1. 内置类型声明文件
   2. 第三方库的类型声明文件
2. 创建自己的类型声明文件
   1. 项目内共享类型
   2. 为已有JS文件提供类型声明

学习顺序：先会用（别人的）再会写（自己的）。
#### 使用已有的类型声明文件
##### 内置类型声明文件
**TS 为 JS 运行时可用的所有标准化内置 API 都提供了声明文件**。 
比如，在使用数组时，数组所有方法都会有相应的代码提示以及类型信息： ![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171453025.png)
实际上这都是 TS 提供的内置类型声明文件。 
可以通过 Ctrl + 鼠标左键（Mac：option + 鼠标左键）来查看内置类型声明文件内容。 
比如，查看 forEach 方法的类型声明，VSCode 中会自动跳转到 lib.es5**.d.ts **类型声明文件中。 
当然，像 window、document 等 BOM、DOM API 也都有相应的类型声明（lib.dom**.d.ts**)。

##### 第三方库的类型声明文件
目前，几乎所有常用的第三方库都有相应的类型声明文件。
第三方库的类型声明文件有两种存在形式：**库自带类型声明文件、由 DefinitelyTyped 提供。**

1. 库自带类型声明文件：比如，axios。

![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171453888.png)
解释：这种情况下，正常导入该库，**TS 就会自动加载库自己的类型声明文件**，以提供该库的类型声明。

2. 由 DefinitelyTyped 提供。

[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/) 是一个 github 仓库，用来**提供高质量 TypeScript 类型声明**。
可以通过 npm/yarn 来下载该仓库提供的 TS 类型声明包，这些包的名称格式为：**@types/***。
比如，@types/react、@types/lodash 等。
说明：在实际项目开发时，如果你使用的第三方库没有自带的声明文件，VSCode 会给出明确的提示。
![image.png](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/typescript/202406171453505.png)
解释：当安装 @types/* 类型声明包后，**TS 也会自动加载该类声明包**，以提供该库的类型声明。
补充：TS 官方文档提供了一个[页面](https://www.typescriptlang.org/dt)，可以来查询 @types/* 库。
#### 创建自己的类型声明文件
##### 项目内共享类型
如果多个 .ts 文件中都用到同一个类型，此时可以创建 .d.ts 文件提供该类型，实现类型共享。
操作步骤：

1. 创建 index.d.ts 类型声明文件。
2. 创建需要共享的类型，并使用 export 导出（TS 中的类型也可以使用 import/export 实现模块化功能）。
3. 在需要使用共享类型的 .ts 文件中，通过 import 导入即可（.d.ts 后缀导入时，直接省略）。
##### 为已有JS文件提供类型声明

1. 在将 JS 项目[迁移](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)到 TS 项目时，为了让已有的 .js 文件有类型声明。 
2. 成为库作者，创建库给其他人使用。 

注意：类型声明文件的编写与模块化方式相关，不同的模块化方式有不同的写法。但由于历史原因，JS 模块化的发展经历过多种变化（AMD、CommonJS、UMD、ESModule 等），而 TS 支持各种模块化形式的类型声明。这就导致 ，类型声明文件[相关内容](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)又多又杂。 
演示：基于最新的 ESModule（import/export）来为已有 .js 文件，创建类型声明文件。 
开发环境准备：使用 webpack 搭建，通过 ts-loader 处理 .ts 文件。

---

说明：TS 项目中也可以使用 .js 文件。 
说明：在导入 .js 文件时，TS 会自动加载与 .js 同名的 .d.ts 文件，以提供类型声明。 
declare 关键字：用于类型声明，为其他地方（比如，.js 文件）已存在的变量声明类型，而不是创建一个新的变量。 

1. 对于 type、interface 等这些明确就是 TS 类型的（只能在 TS 中使用的），可以省略 declare 关键字。 
2. 对于 let、function 等具有双重含义（在 JS、TS 中都能用），应该使用 declare 关键字，明确指定此处用于类型声明。
## 配置文件
```json
"compilerOptions": {
  "incremental": true, // TS编译器在第一次编译之后会生成一个存储编译信息的文件，第二次编译会在第一次的基础上进行增量编译，可以提高编译的速度
  "tsBuildInfoFile": "./buildFile", // 增量编译文件的存储位置
  "diagnostics": true, // 打印诊断信息
  "target": "ES5", // 目标语言的版本（指定编译 js 的版本）
  "module": "CommonJS", // 生成代码的模板标准
  "outFile": "./app.js", // 将多个相互依赖的文件生成一个文件，可以用在AMD模块中，即开启时应设置"module": "AMD",
  "lib": ["DOM", "ES2015", "ScriptHost", "ES2019.Array"], // TS需要引用的库，即声明文件，es5 默认引用dom、es5、scripthost,如需要使用es的高级版本特性，通常都需要配置，如es8的数组新特性需要引入"ES2019.Array",
  "allowJS": true, // 允许编译器编译JS，JSX文件
  "checkJs": true, // 允许在JS文件中报错，通常与allowJS一起使用
  "outDir": "./dist", // 指定输出目录
  "rootDir": "./", // 指定输出文件目录(用于输出)，用于控制输出目录结构
  "declaration": true, // 生成声明文件，开启后会自动生成声明文件
  "declarationDir": "./file", // 指定生成声明文件存放目录
  "emitDeclarationOnly": true, // 只生成声明文件，而不会生成js文件
  "sourceMap": true, // 生成目标文件的sourceMap文件（代码源文件）
  "inlineSourceMap": true, // 生成目标文件的inline SourceMap，inline SourceMap会包含在生成的js文件中
  "declarationMap": true, // 为声明文件生成sourceMap
  "typeRoots": [], // 声明文件目录，默认时node_modules/@types
  "types": [], // 加载的声明文件包
  "removeComments":true, // 在编译过程中删除文件中的注释
  "noEmit": true, // 不输出文件,即编译后不会生成任何js文件
  "noEmitOnError": true, // 发送错误时不输出任何文件
  "noEmitHelpers": true, // 不生成helper函数，减小体积，需要额外安装，常配合importHelpers一起使用
  "importHelpers": true, // 通过tslib引入helper函数，文件必须是模块
  "downlevelIteration": true, // 降级遍历器实现，如果目标源是es3/5，那么遍历器会有降级的实现
  "strict": true, // 开启所有严格的类型检查
  "alwaysStrict": true, // 在代码中注入'use strict'
  "noImplicitAny": true, // 不允许隐式的any类型
  "strictNullChecks": true, // 不允许把null、undefined赋值给其他类型的变量
  "strictFunctionTypes": true, // 不允许函数参数双向协变
  "strictPropertyInitialization": true, // 类的实例属性必须初始化
  "strictBindCallApply": true, // 严格的bind/call/apply检查
  "noImplicitThis": true, // 不允许this有隐式的any类型
  "noUnusedLocals": true, // 检查只声明、未使用的局部变量(只提示不报错)
  "noUnusedParameters": true, // 检查未使用的函数参数(只提示不报错)
  "noFallthroughCasesInSwitch": true, // 防止switch语句贯穿(即如果没有break语句后面不会执行)
  "noImplicitReturns": true, //每个分支都会有返回值
  "esModuleInterop": true, // 允许export=导出，由import from 导入
  "allowUmdGlobalAccess": true, // 允许在模块中全局变量的方式访问umd模块
  "moduleResolution": "node", // 模块解析策略，ts默认用node的解析策略，即相对的方式导入
  "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
  "paths": { // 路径映射，相对于baseUrl
    // 如使用jq时不想使用默认版本，而需要手动指定版本，可进行如下配置
    "jquery": ["node_modules/jquery/dist/jquery.min.js"]
  },
  "rootDirs": ["src","out"], // 将多个目录放在一个虚拟目录下，用于运行时，即编译后引入文件的位置可能发生变化，这也设置可以虚拟src和out在同一个目录下，不用再去改变路径也不会报错
  "listEmittedFiles": true, // 打印输出文件
  "listFiles": true// 打印编译的文件(包括引用的声明文件)
}
// 指定一个匹配列表（属于自动指定该路径下的所有ts相关文件）
"include": [
  "src/**/*"
],
// 指定一个排除列表（include的反向操作）
"exclude": [
  "demo.ts"
],
// 指定哪些文件使用该配置（属于手动一个个指定文件）
"files": [
  "demo.ts"
]
```
```typescript
"compilerOptions": {
  "incremental": true, // TS编译器在第一次编译之后会生成一个存储编译信息的文件，第二次编译会在第一次的基础上进行增量编译，可以提高编译的速度
  "tsBuildInfoFile": "./buildFile", // 增量编译文件的存储位置
  "diagnostics": true, // 打印诊断信息 
  "target": "ES5", // 目标语言的版本
  "module": "CommonJS", // 生成代码的模板标准
  "outFile": "./app.js", // 将多个相互依赖的文件生成一个文件，可以用在AMD模块中，即开启时应设置"module": "AMD",
  "lib": ["DOM", "ES2015", "ScriptHost", "ES2019.Array"], // TS需要引用的库，即声明文件，es5 默认引用dom、es5、scripthost,如需要使用es的高级版本特性，通常都需要配置，如es8的数组新特性需要引入"ES2019.Array",
  "allowJS": true, // 允许编译器编译JS，JSX文件
  "checkJs": true, // 允许在JS文件中报错，通常与allowJS一起使用
  "outDir": "./dist", // 指定输出目录
  "rootDir": "./", // 指定输出文件目录(用于输出)，用于控制输出目录结构
  "declaration": true, // 生成声明文件，开启后会自动生成声明文件
  "declarationDir": "./file", // 指定生成声明文件存放目录
  "emitDeclarationOnly": true, // 只生成声明文件，而不会生成js文件
  "sourceMap": true, // 生成目标文件的sourceMap文件
  "inlineSourceMap": true, // 生成目标文件的inline SourceMap，inline SourceMap会包含在生成的js文件中
  "declarationMap": true, // 为声明文件生成sourceMap
  "typeRoots": [], // 声明文件目录，默认时node_modules/@types
  "types": [], // 加载的声明文件包
  "removeComments":true, // 删除注释 
  "noEmit": true, // 不输出文件,即编译后不会生成任何js文件
  "noEmitOnError": true, // 发送错误时不输出任何文件
  "noEmitHelpers": true, // 不生成helper函数，减小体积，需要额外安装，常配合importHelpers一起使用
  "importHelpers": true, // 通过tslib引入helper函数，文件必须是模块
  "downlevelIteration": true, // 降级遍历器实现，如果目标源是es3/5，那么遍历器会有降级的实现
  "strict": true, // 开启所有严格的类型检查
  "jsx": "preserve", // 指定 jsx 格式
  "resolveJsonModule": true, //设置true则可以直接import导入本地的json文件,例如import pathOptions from './table.json'
  "alwaysStrict": true, // 在代码中注入'use strict'
  "noImplicitAny": true, // 不允许隐式的any类型
  "strictNullChecks": true, // 不允许把null、undefined赋值给其他类型的变量
  "strictFunctionTypes": true, // 不允许函数参数双向协变
  "strictPropertyInitialization": true, // 类的实例属性必须初始化
  "strictBindCallApply": true, // 严格的bind/call/apply检查
  "noImplicitThis": true, // 不允许this有隐式的any类型
  "noUnusedLocals": true, // 检查只声明、未使用的局部变量(只提示不报错)
  "noUnusedParameters": true, // 检查未使用的函数参数(只提示不报错)
  "noFallthroughCasesInSwitch": true, // 防止switch语句贯穿(即如果没有break语句后面不会执行)
  "noImplicitReturns": true, //每个分支都会有返回值
  "esModuleInterop": true, // 允许export=导出，由import from 导入
  "allowUmdGlobalAccess": true, // 允许在模块中全局变量的方式访问umd模块
  "moduleResolution": "node", // 模块解析策略，ts默认用node的解析策略，即相对的方式导入
  "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
  "paths": { // 路径映射，相对于baseUrl
    // 如使用jq时不想使用默认版本，而需要手动指定版本，可进行如下配置
    "jquery": ["node_modules/jquery/dist/jquery.min.js"]
  },
  "rootDirs": ["src","out"], // 将多个目录放在一个虚拟目录下，用于运行时，即编译后引入文件的位置可能发生变化，这也设置可以虚拟src和out在同一个目录下，不用再去改变路径也不会报错
  "listEmittedFiles": true, // 打印输出文件
  "listFiles": true// 打印编译的文件(包括引用的声明文件)
}
```
## 命名空间
在 TypeScript 中，命名空间（Namespace）是一种用于组织和管理代码的机制，它可以避免全局作用域下的命名冲突， 并将相关的代码封装在一个命名空间内。 
任何包含顶级 `import` 或者 `export` 的文件都被当成一个模块。相反地，如果一个文件不带有顶级的`import`或者`export`声名的文件都被当成一个模块。
以下是命名空间的基本用法和特点：

1. 创建命名空间：

使用`namespace`创建命名空间
```typescript
namespace MyNamespace {
  export const message = "Hello from MyNamespace";
  export function greet(name: string): string {
    return Hello, ${name}!;
  }
}
```

2. 访问命名空间中的成员：
通过使用命名空间名称来访问其中的成员：
```typescript
console.log(MyNamespace.message); // 输出：Hello from MyNamespace
console.log(MyNamespace.greet("Alice")); // 输出：Hello, Alice!
```

3. 嵌套命名空间：
命名空间可以嵌套，以便更好地组织代码：
```typescript
namespace OuterNamespace {
  export namespace InnerNamespace {
    export const value = 42;
  }
}
console.log(OuterNamespace.InnerNamespace.value); // 输出：42
```

4. 使用 export 关键字：
在命名空间中，如果要在外部访问命名空间中的成员，需要使用 `export` 关键字进行导出。然后在外部文件中进行 `import {space2} from './index2.ts'`导入。此时会在 `index.js`中用到 `define` ，需要在 `tsconfig.json` 中将 `"module"`改为 `CommonJS` ，才可以正常编译。
5. 别名
```typescript
namespace A {
 export namespace B {
 export const c = 1
 }
}
// 以下方式不可以通过 ts-node 去编译，会报错
import AAA = A.B
console.log(AAA.c); // 1
```

6. 合并命名空间
```typescript
namespace A {
 export const c = 1
}
namespace A {
 export const d = 2
}
```

7. /// `<reference>` 三斜线指令

在分散的文件中使用命名空间时，可以使用 /// `<reference>` 指令引入其他文件中的命名空间：（注意在使用三斜线指令时， tscofig 中不能设置 "moduleDetection": "force" ）
```typescript
/// <reference path="path/to/other/file.ts" />
```
需要注意的是，在现代 TypeScript 中，命名空间的使用已经逐渐被模块化替代。模块化使用 `import` 和 `export` 关键字来管理代码，更加推荐用于组织项目的代码结构。
## 类的混入
Mixin（混入）是一种在面向对象编程中，通过将一个或多个功能组合到一个类中的方式来实现代码重用的技术。Mixin 可以被认为是一种水平扩展，它可以让一个类在不继承其他类的情况下获得其他类的功能。

1. **对象复制**： 最简单的方式是通过复制一个对象的属性和方法到另一个对象来实现混入。这可以使用 Object.assign() 方法或自定义的复制函数来实现。
- 优点：对象复制是一种简单且直观的方式，可以很容易地将一个对象的功能复制到另一个对象中。它不会影响原型链，因此不会对对象的原型链产生任何影响。
- 缺点：对象复制通常是静态的，即在对象创建时就确定了对象的功能。如果需要在运行时动态添加新的功能，对象复制就显得不够灵活。
```typescript
const mixin = {
  someFunction: function() {
    // 实现某个功能
  },
  someVariable: 123
};

const obj = {};
Object.assign(obj, mixin);

// 现在 obj 拥有了 mixin 的功能
obj.someFunction();
console.log(obj.someVariable);
```

2. **原型链**： 通过修改对象的原型链来实现混入。可以创建一个拥有所需功能的辅助对象，并将其设置为目标对象的原型。这样目标对象就可以通过原型链访问辅助对象的属性和方法。
- 优点：原型链混入可以实现动态继承，即在运行时动态地改变对象的原型链。这意味着可以在任何时候向对象添加新的功能。
- 缺点：原型链混入可能会影响对象的整个原型链，从而导致一些意外的行为。另外，由于 JavaScript 对象可以动态地改变原型链，因此可能会导致一些性能问题。
```typescript
const mixin = {
  someFunction: function() {
    // 实现某个功能
  },
  someVariable: 123
};

const obj = {};
Object.setPrototypeOf(obj, mixin);

// 现在 obj 拥有了 mixin 的功能
obj.someFunction();
console.log(obj.someVariable);
```
总结：原型链混入更适合需要动态继承的场景，而对象复制更适合静态的功能复制

3. **类继承**： 在 ES6 中，可以通过类继承来实现混入。可以定义一个拥有所需功能的基类，并让目标类继承这个基类。这样目标类就可以获得基类的功能。
```typescript
class Mixin {
  someFunction() {
    // 实现某个功能
  }
  get someVariable() {
    return 123;
  }
}

class MyClass extends Mixin {
  // MyClass 继承了 Mixin 的功能
}

const obj = new MyClass();
obj.someFunction();
console.log(obj.someVariable);
```
使用Mixin可以在不修改原有类结构的情况下，将多个功能组合到一个类中，提高代码的重用性和可维护性。但需要注意避免混入过多的功能，以免造成代码复杂性和命名冲突。
## 装饰器

### 访问器装饰器

### 参数装饰器
参数装饰器是应用于类方法参数的装饰器，它接收3个参数：目标对象、方法名称和参数在函数参数列表中的索引。
```javascript
function logParameter(target, methodName, parameterIndex) {
    console.log(`Parameter '${parameterIndex}' of ${methodName} in ${target.constructor.name} has been decorated`);
}

class MyClass {
    myMethod(@logParameter arg1, @logParameter arg2) {
        // 方法体
    }
}

// 输出: Parameter '0' of myMethod in MyClass has been decorated
// 输出: Parameter '1' of myMethod in MyClass has been decorated
```
### 类装饰器
类装饰器是应用于类构造函数的装饰器，它接收一个参数：目标类的构造函数。
```javascript
function logClass(target) {
    console.log(`Class ${target.name} has been decorated`);
}

@logClass
class MyClass {
    // 类定义
}

// 输出: Class MyClass has been decorated
```
### 方法装饰器
方法装饰器是应用于类方法的装饰器，它接收3个参数：目标对象、方法名称和属性描述符。
```javascript
function logMethod(target, methodName, descriptor) {
    console.log(`Method ${methodName} in ${target.constructor.name} has been decorated`);
}

class MyClass {
    @logMethod
    myMethod() {
        // 方法体
    }
}

// 输出: Method myMethod in MyClass has been decorated
```
### 属性装饰器
属性装饰器是应用于类属性的装饰器，它接收2个参数：目标对象和属性名。
```javascript
function logProperty(target, propertyName) {
    console.log(`Property ${propertyName} in ${target.constructor.name} has been decorated`);
}

class MyClass {
    @logProperty
    myProperty = 123;
}

// 输出: Property myProperty in MyClass has been decorated
```
### 装饰器工厂
装饰器工厂是一个返回装饰器的函数，允许我们动态创建装饰器。
```javascript
function logFactory(message) {
    return function(target, methodName, descriptor) {
        console.log(`${message} - Method ${methodName} in ${target.constructor.name} has been decorated`);
    };
}

class MyClass {
    @logFactory('Log message')
    myMethod() {
        // 方法体
    }
}

// 输出: Log message - Method myMethod in MyClass has been decorated
```

### 装饰器组合

装饰器可以组合使⽤，执⾏顺序为：先【由上到下】的执⾏所有的装饰器⼯⼚，依次获取到装饰 器，然后再【由下到上】执⾏所有的装饰器。
