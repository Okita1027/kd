## 装饰器

**装饰器（Decorators）** 是一种特殊类型的声明，它能够**附加到类声明、方法、访问器、属性或参数上**。它们本质上是**函数**，在运行时被调用，并能够**修改或扩展**其所附加声明的行为。

可以把装饰器想象成一个“包装器”或“元数据注入器”。它们让你可以在**不修改原始类/方法代码**的情况下，为其添加额外的功能、修改其元数据或观察其行为。

- **语法**：装饰器使用 `@expression` 这种形式，其中 `expression` 必须求值为一个函数。这个函数会在运行时被调用，并获得被装饰声明的信息。
- **执行时机**：装饰器在**运行时**执行，但它们是在**编译时**（TypeScript 编译成 JavaScript 时）被处理和注入的。

### 启用装饰器

由于装饰器是实验性特性，你需要在 `tsconfig.json` 中进行配置才能使用它们：

```JSON
{
  "compilerOptions": {
    "target": "ES5",             /* 或更高版本，如 ES2015 */
    "experimentalDecorators": true, /* 启用实验性装饰器 */
    "emitDecoratorMetadata": true  /* (可选) 启用发射装饰器元数据，用于反射，如 TypeORM、Angular DI */
  }
}
```

### 装饰器结构

```TS
type Decorator = (
  value: DecoratedValue,
  context: {
    kind: string;
    name: string | symbol;
    addInitializer?(initializer: () => void): void;
    static?: boolean;
    private?: boolean;
    access: {
      get?(): unknown;
      set?(value: unknown): void;
    };
  }
) => void | ReplacementValue;
```

上面代码中，`Decorator`是装饰器的类型定义。它是一个函数，使用时会接收到`value`和`context`两个参数。

- `value`：所装饰的对象。
- `context`：上下文对象，TypeScript 提供一个原生接口`ClassMethodDecoratorContext`，描述这个对象。

```TS
function decorator(value: any, context: ClassMethodDecoratorContext) {
  // ...
}
```

上面是一个装饰器函数，其中第二个参数`context`的类型就可以写成`ClassMethodDecoratorContext`。

`context`对象的属性，根据所装饰对象的不同而不同，其中只有两个属性（`kind`和`name`）是必有的，其他都是可选的。

（1）`kind`：字符串，表示所装饰对象的类型，可能取以下的值。

- 'class'
- 'method'
- 'getter'
- 'setter'
- 'field'
- 'accessor'

这表示一共有六种类型的装饰器。

（2）`name`：字符串或者 Symbol 值，所装饰对象的名字，比如类名、属性名等。

（3）`addInitializer()`：函数，用来添加类的初始化逻辑。以前，这些逻辑通常放在构造函数里面，对方法进行初始化，现在改成以函数形式传入`addInitializer()`方法。注意，`addInitializer()`没有返回值。

（4）`private`：布尔值，表示所装饰的对象是否为类的私有成员。

（5）`static`：布尔值，表示所装饰的对象是否为类的静态成员。

（6）`access`：一个对象，包含了某个值的 get 和 set 方法。

### 类装饰器

类装饰器的类型描述如下。

```TS
type ClassDecorator = (
  value: Function,
  context: {
    kind: "class";
    name: string | undefined;
    addInitializer(initializer: () => void): void;
  }
) => Function | void;
```

类装饰器接受两个参数：`value`（当前类本身）和`context`（上下文对象）。其中，`context`对象的`kind`属性固定为字符串`class`。

类装饰器一般用来对类进行操作，可以不返回任何值，请看下面的例子。

```TS
function Greeter(value, context) {
  if (context.kind === "class") {
    value.prototype.greet = function () {
      console.log("你好");
    };
  }
}

@Greeter
class User {}

let u = new User();
u.greet(); // "你好"
```

上面示例中，类装饰器`@Greeter`在类`User`的原型对象上，添加了一个`greet()`方法，实例就可以直接使用该方法。

类装饰器可以返回一个函数，替代当前类的构造方法:

```TS
function countInstances(value: any, context: any) {
  let instanceCount = 0; // ① 闭包变量，用于跟踪实例数量

  const wrapper = function (...args: any[]) { // ② 替代原始构造函数的新构造函数
    instanceCount++; // 每次调用新构造函数时，实例计数递增
    const instance = new value(...args); // ③ 使用原始构造函数创建实际实例
    instance.count = instanceCount; // ④ 为新实例添加一个 'count' 属性
    return instance;
  } as unknown as typeof MyClass; // ⑤ 类型断言，确保 TypeScript 认为这是 MyClass 的构造函数

  wrapper.prototype = value.prototype; // ⑥ 关键一步：将新构造函数的原型指向原始构造函数的原型
  return wrapper; // ⑦ 返回新构造函数，替换掉原始类
}

@countInstances
class MyClass {}

const inst1 = new MyClass();
inst1 instanceof MyClass; // true
inst1.count; // 1
```

> [!NOTE]
>
> 上例为了确保新构造方法继承定义在`MyClass`的原型之上的成员，特别加入`A`行，确保两者的原型对象是一致的。否则，新的构造函数`wrapper`的原型对象，与`MyClass`不同，通不过`instanceof`运算符。

类装饰器也可以返回一个新的类，替代原来所装饰的类：

```TS
function countInstances(value: any, context: any) {
  let instanceCount = 0;

  return class extends value {
    constructor(...args: any[]) {
      super(...args);
      instanceCount++;
      this.count = instanceCount;
    }
  };
}

@countInstances
class MyClass {}

const inst1 = new MyClass();
inst1 instanceof MyClass; // true
inst1.count; // 1
```

上面示例中，`@countInstances`返回一个`MyClass`的子类。

下面的例子是通过类装饰器，禁止使用`new`命令新建类的实例:

```TS
function functionCallable(
  value as any, {kind} as any
) {
  if (kind === 'class') {
    return function (...args) {
      if (new.target !== undefined) {
        throw new TypeError('This function can’t be new-invoked');
      }
      return new value(...args);
    }
  }
}

@functionCallable
class Person {
  constructor(name) {
    this.name = name;
  }
}
const robin = Person('Robin');
robin.name // 'Robin'
```

上面示例中，类装饰器`@functionCallable`返回一个新的构造方法，里面判断`new.target`是否不为空，如果是的，就表示通过`new`命令调用，从而报错。

类装饰器的上下文对象`context`的`addInitializer()`方法，用来定义一个类的初始化函数，在类完全定义结束后执行。

```TS
function customElement(name: string) {
  return <Input extends new (...args: any) => any>(
    value: Input,
    context: ClassDecoratorContext
  ) => {
    context.addInitializer(function () {
      customElements.define(name, value);
    });
  };
}

@customElement("hello-world")
class MyComponent extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `<h1>Hello World</h1>`;
  }
}
```

上面示例中，类`MyComponent`定义完成后，会自动执行类装饰器`@customElement()`给出的初始化函数，该函数会将当前类注册为指定名称（本例为`<hello-world>`）的自定义 HTML 元素。

### 方法装饰器

方法装饰器用来装饰类的方法（method）。它的类型描述如下:

```TS
type ClassMethodDecorator = (
  value: Function,
  context: {
    kind: "method";
    name: string | symbol;
    static: boolean;
    private: boolean;
    access: { get: () => unknown };
    addInitializer(initializer: () => void): void;
  }
) => Function | void;
```

根据上面的类型，方法装饰器是一个函数，接受两个参数：`value`和`context`。

参数`value`是方法本身，参数`context`是上下文对象，有以下属性。

- `kind`：值固定为字符串`method`，表示当前为方法装饰器。
- `name`：所装饰的方法名，类型为字符串或 Symbol 值。
- `static`：布尔值，表示是否为静态方法。该属性为只读属性。
- `private`：布尔值，表示是否为私有方法。该属性为只读属性。
- `access`：对象，包含了方法的存取器，但是只有`get()`方法用来取值，没有`set()`方法进行赋值。
- `addInitializer()`：为方法增加初始化函数。

方法装饰器会改写类的原始方法，实质等同于下面的操作:

```TS
function trace(decoratedMethod) {
  // ...
}

class C {
  @trace
  toString() {
    return "C";
  }
}

// `@trace` 等同于
// C.prototype.toString = trace(C.prototype.toString);
```

上面示例中，`@trace`是方法`toString()`的装饰器，它的效果等同于最后一行对`toString()`的改写。

如果方法装饰器返回一个新的函数，就会替代所装饰的原始函数。

```TS
function replaceMethod() {
  return function () {
    return `How are you, ${this.name}?`;
  };
}

class Person {
  constructor(name) {
    this.name = name;
  }

  @replaceMethod
  hello() {
    return `Hi ${this.name}!`;
  }
}

const robin = new Person("Robin");

robin.hello(); // 'How are you, Robin?'
```

上面示例中，装饰器`@replaceMethod`返回的函数，就成为了新的`hello()`方法。

下面是另一个例子。

```TS
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  @log
  greet() {
    console.log(`Hello, my name is ${this.name}.`);
  }
}

function log(originalMethod: any, context: ClassMethodDecoratorContext) {
  const methodName = String(context.name);

  function replacementMethod(this: any, ...args: any[]) {
    console.log(`LOG: Entering method '${methodName}'.`);
    const result = originalMethod.call(this, ...args);
    console.log(`LOG: Exiting method '${methodName}'.`);
    return result;
  }

  return replacementMethod;
}

const person = new Person("张三");
person.greet();
// "LOG: Entering method 'greet'."
// "Hello, my name is 张三."
// "LOG: Exiting method 'greet'."
```

上面示例中，装饰器`@log`的返回值是一个函数`replacementMethod`，替代了原始方法`greet()`。在`replacementMethod()`内部，通过执行`originalMethod.call()`完成了对原始方法的调用。

利用方法装饰器，可以将类的方法变成延迟执行。

```TS
function delay(milliseconds: number = 0) {
  return function (value, context) {
    if (context.kind === "method") {
      return function (...args: any[]) {
        setTimeout(() => {
          value.apply(this, args);
        }, milliseconds);
      };
    }
  };
}

class Logger {
  @delay(1000)
  log(msg: string) {
    console.log(`${msg}`);
  }
}

let logger = new Logger();
logger.log("Hello World");
```

上面示例中，方法装饰器`@delay(1000)`将方法`log()`的执行推迟了 1 秒（1000 毫秒）。这里真正的方法装饰器，是`delay()`执行后返回的函数，`delay()`的作用是接收参数，用来设置推迟执行的时间。这种通过高阶函数返回装饰器的做法，称为“工厂模式”，即可以像工厂那样生产出一个模子的装饰器。

方法装饰器的参数`context`对象里面，有一个`addInitializer()`方法。它是一个钩子方法，用来在类的初始化阶段，添加回调函数。这个回调函数就是作为`addInitializer()`的参数传入的，它会在构造方法执行期间执行，早于属性（field）的初始化。

下面是`addInitializer()`方法的一个例子。我们知道，类的方法往往需要在构造方法里面，进行`this`的绑定。

```TS
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;

    // greet() 绑定 this
    this.greet = this.greet.bind(this);
  }

  greet() {
    console.log(`Hello, my name is ${this.name}.`);
  }
}

const g = new Person("张三").greet;
g(); // "Hello, my name is 张三."
```

上面例子中，类`Person`的构造方法内部，将`this`与`greet()`方法进行了绑定。如果没有这一行，将`greet()`赋值给变量`g`进行调用，就会报错了。

`this`的绑定必须放在构造方法里面，因为这必须在类的初始化阶段完成。现在，它可以移到方法装饰器的`addInitializer()`里面。

```TS
function bound(originalMethod: any, context: ClassMethodDecoratorContext) {
  const methodName = context.name;
  if (context.private) {
    throw new Error(`不能绑定私有方法 ${methodName as string}`);
  }
  context.addInitializer(function () {
    this[methodName] = this[methodName].bind(this);
  });
}
```

上面示例中，绑定`this`转移到了`addInitializer()`方法里面。

下面再看一个例子，通过`addInitializer()`将选定的方法名，放入一个集合。

```TS
function collect(value, { name, addInitializer }) {
  addInitializer(function () {
    if (!this.collectedMethodKeys) {
      this.collectedMethodKeys = new Set();
    }
    this.collectedMethodKeys.add(name);
  });
}

class C {
  @collect
  toString() {}

  @collect
  [Symbol.iterator]() {}
}

const inst = new C();
inst.collectedMethodKeys; // new Set(['toString', Symbol.iterator])
```

上面示例中，方法装饰器`@collect`会将所装饰的成员名字，加入一个 Set 集合`collectedMethodKeys`。

### 属性装饰器



### getter/setter装饰器



### accessor装饰器



### 装饰器的执行顺序

