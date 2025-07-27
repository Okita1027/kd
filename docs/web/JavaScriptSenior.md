---
title: JavaScript
shortTitle: JavaScript高级篇
description: JavaScript高级篇
date: 2025-07-25 15:33:07
categories: [前端,JavaScript]
tags: []
---

## 原型与原型链

| 名称                                | 说明                                   |
| ----------------------------------- | -------------------------------------- |
| `obj.__proto__`                     | 实例对象的原型，非标准，不推荐直接使用 |
| `Function.prototype`                | 函数的原型对象                         |
| `Object.getPrototypeOf(obj)`        | 获取 `obj` 的原型                      |
| `Object.setPrototypeOf(obj, proto)` | 设置对象原型                           |
| `obj.hasOwnProperty(key)`           | 判断属性是否在实例自身而不是原型上     |

### 原型

每个 JavaScript **对象**（除了少数例外，如 `null` 或通过 `Object.create(null)` 创建的对象）都有一个内部属性，被称为它的**原型**。这个原型本身也是一个对象。

- **`[[Prototype]]` (内部属性)**：这是 ECMAScript 规范中定义的内部属性，表示一个对象的原型。你无法直接访问这个内部属性。
- **`__proto__` (非标准/已废弃)**：这是大多数浏览器实现的一个非标准的属性，用于直接访问或设置一个对象的 `[[Prototype]]`。**不推荐在生产代码中直接使用它**，因为它性能较差且可能引起兼容性问题。
- **`Object.getPrototypeOf()` (标准方法)**：这是获取一个对象原型的**标准和推荐**方法。
- **`Object.prototype` (所有对象的终点)**：所有普通对象的原型链最终都会指向 `Object.prototype`。`Object.prototype` 的原型是 `null`，标志着原型链的终点。

**函数与原型：**

**所有函数**都有一个特殊的 `prototype` 属性（注意：这里是小写的 `p`），它指向一个对象，这个对象就是当函数作为构造函数（使用 `new` 关键字）创建实例时，所有实例会继承的**原型对象**。

这个`prototype`属性有一个`constructor`（构造函数）属性，指向函数自身。

```JS
function Person(name) {
  this.name = name;
}

// Person 函数的 prototype 属性，它是一个对象
console.log(typeof Person.prototype); // "object"
console.log(Person.prototype.constructor === Person); // true

const alice = new Person('Alice');

// alice 对象的 [[Prototype]] 指向 Person.prototype
console.log(Object.getPrototypeOf(alice) === Person.prototype); // true

// Person.prototype 的原型是 Object.prototype
console.log(Object.getPrototypeOf(Person.prototype) === Object.prototype); // true

// Object.prototype 的原型是 null (原型链的终点)
console.log(Object.getPrototypeOf(Object.prototype)); // null
```

### 原型链

当你在一个对象上访问一个属性或方法时，JavaScript 引擎会按照以下顺序查找它：

1. **首先，在对象自身查找**：如果找到该属性，则直接返回。
2. **沿着原型链向上查找**：如果对象自身没有该属性，引擎会沿着该对象的 `[[Prototype]]` 向上查找。
3. **重复步骤 2**：如果原型对象也没有该属性，则会继续查找原型对象的原型，直到达到原型链的末端（即 `null`）。
4. **返回 `undefined`**：如果查找到原型链的末端仍未找到该属性，则返回 `undefined`。

这种从一个对象到其原型，再到原型的原型，层层向上查找的链接关系，就构成了**原型链**。

示意图：

```JS
// 假设有以下关系：
// alice -> Person.prototype -> Object.prototype -> null

alice.name       // 在 alice 自身找到
alice.sayHello() // 在 Person.prototype 上找到 (如果定义了)
alice.toString() // 在 Object.prototype 上找到
```

示例查找过程：

```JS
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  console.log(`${this.name} makes a sound.`);
};

function Dog(name, breed) {
  Animal.call(this, name); // 继承 Animal 的属性
  this.breed = breed;
}

// 关键步骤：设置 Dog.prototype 继承 Animal.prototype
// Object.create() 是最推荐的继承方式，它创建了一个新对象，
// 并将其原型设置为传入的参数。
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog; // 修正 constructor 指向 Dog

Dog.prototype.bark = function() {
  console.log(`${this.name} barks!`);
};

const myDog = new Dog('Buddy', 'Golden Retriever');

// 1. 访问 myDog.name
console.log(myDog.name); // 'Buddy' (在 myDog 自身找到)

// 2. 访问 myDog.bark()
myDog.bark(); // 'Buddy barks!' (在 Dog.prototype 上找到)

// 3. 访问 myDog.speak()
myDog.speak(); // 'Buddy makes a sound.' (在 Dog.prototype 的原型 Animal.prototype 上找到)

// 4. 访问 myDog.toString()
console.log(myDog.toString()); // '[object Object]' (在 Animal.prototype 的原型 Object.prototype 上找到)

// 5. 访问 myDog.nonExistentProperty
console.log(myDog.nonExistentProperty); // undefined (查找到 null 也未找到)

// 查看原型链：
console.log(Object.getPrototypeOf(myDog) === Dog.prototype);                 // true
console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype);      // true
console.log(Object.getPrototypeOf(Animal.prototype) === Object.prototype);   // true
console.log(Object.getPrototypeOf(Object.prototype) === null);               // true
```

### [[Prototype]]与prototype

**`[[Prototype]]`** (通过 `Object.getPrototypeOf(XXX)`或`XXX.__proto` 访问)：

- 是**每个对象**都拥有的**内部属性**，指向它的原型。
- 它用于在查找属性时**构成原型链**。
- 实例对象（如 `alice` 和 `myDog`）的 `[[Prototype]]` 会指向其构造函数的 `prototype` 属性。

**`prototype`** (仅存在于**函数**上的属性)：

- 是**函数**才有的一个**公共属性**。
- 它指向一个对象，这个对象就是通过该函数作为构造函数创建的**所有实例所共享的原型对象**。
- 它用于在创建新实例时，**设置实例的 `[[Prototype]]`**。

简而言之：**`prototype` 是一个函数的属性，它指向一个将被用作实例原型的对象。`[[Prototype]]` 是一个对象的内部链接，它指向该对象的原型。**

### class与原型链

ES6 引入的 `class` 语法（`class MyClass extends BaseClass {}`）仅仅是原型继承的**语法糖**。在底层，JavaScript 依然使用原型和原型链来实现继承。

```JS
class Person {
    constructor(name) {
        this.name = name;
    }

    sayHello() {
        console.log(`你好, 我是 ${this.name}`);
    }

    static create(name: string) {
        return new Person(name);
    }
}

class Student extends Person {
    constructor(name, grade) {
        super(name);
        this.grade = grade;
    }
    study() {
        console.log(`${this.name}的年级是${this.grade}`);
    }
}

const student = new Student('小明', '3');
console.log(Object.getPrototypeOf(Student.prototype) === Person.prototype); // true
```

这表明 `class` 语法并没有改变 JavaScript 的继承本质，只是提供了一种更符合传统面向对象语言习惯的写法。

function + 原型链写法：

```JS
// 父类（Person）：类声明与构造函数
function Person(name) {
    this.name = name;
    
    // 私有变量（闭包）
    const privateAge = 30;
    this.getAge = function () {
        return privateAge; // 只能通过方法访问
    };
}

// 静态方法
Person.create = function (name) {
    return new Person(name);
};

// 父类方法（挂载到 prototype）
Person.prototype.sayHello = function () {
    console.log(`你好，我是${this.name}`);
};

// 子类（Student）
function Student(name, grade) {
    // 调用父类构造函数（相当于 super(name)）
    Person.call(this, name);
    this.grade = grade;
}

// 继承父类原型（实现 extends）
Student.prototype = Object.create(Person.prototype);
// Student.prototype.constructor = Student;

// 子类方法
Student.prototype.study = function () {
    console.log(`${this.name}的年级是${this.grade}`);
};

// 测试
const student = new Student('小明', '3');
student.sayHello();
student.study();
```

---

| 特性           | `class` 语法         | `function` + `prototype` 实现         |
| :------------- | :------------------- | :------------------------------------ |
| **构造函数**   | `constructor()`      | `function Person(name) { ... }`       |
| **方法定义**   | `sayHello() { ... }` | `Person.prototype.sayHello = ...`     |
| **继承**       | `extends`            | `Object.create` + `Parent.call(this)` |
| **静态方法**   | `static method()`    | `Person.staticMethod = ...`           |
| **私有字段**   | `#字段名`            | 闭包函数                              |
| **super 调用** | `super.method()`     | `Parent.prototype.method.call(this)`  |

## 属性的可枚举性和所有权

| 方法/操作                      | 仅自身属性 | 自身 & 继承属性 | 仅可枚举 | 可枚举 & 不可枚举 |
| ------------------------------ | ---------- | --------------- | -------- | ----------------- |
| for...in                       | ✅          | ✅               | ✅        | ❌                 |
| Object.keys()                  | ✅          | ❌               | ✅        | ❌                 |
| Object.values()                | ✅          | ❌               | ✅        | ❌                 |
| Object.entries()               | ✅          | ❌               | ✅        | ❌                 |
| Object.getOwnPropertyNames()   | ✅          | ❌               | ❌        | ✅                 |
| Object.getOwnPropertySymbols() | ✅          | ❌               | ❌        | ✅                 |
| Reflect.ownKeys()              | ✅          | ❌               | ❌        | ✅ (包括 Symbol)   |
| obj.propertyName (访问)        | ✅          | ✅               | ✅        | ✅                 |

### 可枚举性

**可枚举性**是一个布尔值特性，它决定了属性是否可以通过特定的遍历方法（如 `for...in` 循环或 `Object.keys()`）被访问到。

**`enumerable: true` (可枚举)**：

- 表示该属性在对象的大多数**迭代操作**中是可见的。
- 可以通过 `for...in` 循环遍历。
- 会出现在 `Object.keys()`、`Object.values()`、`Object.entries()` 的结果中。
- 会被 `JSON.stringify()` 序列化（如果属性值是可序列化的）。
- 这是通过直接赋值（`obj.prop = value`）或对象字面量（`{ prop: value }`）创建的属性的**默认特性**。

```JS
const myObject = {
  a: 1,
  b: 2
};

for (let key in myObject) {
  console.log(key); // 输出: a, b
}
console.log(Object.keys(myObject)); // ['a', 'b']
console.log(JSON.stringify(myObject)); // {"a":1,"b":2}
```

**`enumerable: false` (不可枚举)**：

- 表示该属性在上述迭代操作中是**不可见**的。
- 通常用于内部属性，不希望它们在外部被轻易发现或修改，但又不希望完全私有化。
- 通过 `Object.defineProperty()` 或 `Object.defineProperties()` 方法可以显式地将属性设置为不可枚举。
- 许多内置对象的原型属性（如 `Object.prototype.toString`）以及通过 `Symbol()` 创建的属性（作为对象键）默认都是不可枚举的。

```JS
const myObject = {
  name: 'Alice'
};

// 使用 Object.defineProperty 定义一个不可枚举属性
Object.defineProperty(myObject, 'id', {
  value: 'uuid-123',
  writable: true,     // 可写
  configurable: true, // 可配置
  enumerable: false   // 不可枚举
});

console.log(myObject.id); // uuid-123 (仍然可以访问和修改)

for (let key in myObject) {
  console.log(key); // 输出: name (id 不会被遍历到)
}
console.log(Object.keys(myObject)); // ['name']
console.log(Object.values(myObject)); // ['Alice']
console.log(JSON.stringify(myObject)); // {"name":"Alice"} (id 不会被序列化)

// 但可以通过 Object.getOwnPropertyDescriptors 或 Object.getOwnPropertyNames 看到它
console.log(Object.getOwnPropertyNames(myObject)); // ['name', 'id']
```

### 所有权

**所有权**指的是一个属性是直接定义在对象自身上，还是定义在它的原型链上。

#### 自身属性

- 直接定义在对象实例上的属性。
- 可以通过 `Object.hasOwnProperty(propertyName)` 方法来检查。
- `Object.keys()`、`Object.values()`、`Object.entries()`、`Object.getOwnPropertyNames()`、`Object.getOwnPropertySymbols()` 都只返回对象的自身属性（无论可枚举与否）。

```JS
const obj = {
  name: 'Bob' // 自身属性
};
Object.defineProperty(obj, 'hidden', { value: 123, enumerable: false }); // 自身属性，但不可枚举

console.log(obj.hasOwnProperty('name'));   // true
console.log(obj.hasOwnProperty('hidden')); // true
console.log(obj.hasOwnProperty('toString')); // false (toString 在原型链上)
```

#### 继承属性/原型链

定义在对象的原型链上的属性。当访问一个对象属性时，如果对象自身没有该属性，JavaScript 引擎会沿着原型链向上查找。

`for...in` 循环会遍历**可枚举的自身属性和可枚举的继承属性**。

```JS
const proto = {
  protoProp: 'I am from prototype',
  anotherProtoProp: 'Also from prototype'
};

const myObject = Object.create(proto); // myObject 继承自 proto
myObject.ownProp = 'I am my own property'; // myObject 的自身属性

for (let key in myObject) {
  console.log(key); // 输出: ownProp, protoProp, anotherProtoProp
}

// 区分自身属性和继承属性
console.log(myObject.hasOwnProperty('ownProp'));       // true
console.log(myObject.hasOwnProperty('protoProp'));     // false
console.log(myObject.hasOwnProperty('toString'));      // false

// 只获取自身的可枚举属性
console.log(Object.keys(myObject)); // ['ownProp']
```

