import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as e,d as a,o as l}from"./app-CN29avzT.js";const i={};function t(d,n){return l(),e("div",null,n[0]||(n[0]=[a(`<h2 id="原型链" tabindex="-1"><a class="header-anchor" href="#原型链"><span>原型链</span></a></h2><table><thead><tr><th>名称</th><th>说明</th></tr></thead><tbody><tr><td><code>obj.__proto__</code></td><td>实例对象的原型，非标准，不推荐直接使用</td></tr><tr><td><code>Function.prototype</code></td><td>函数的原型对象</td></tr><tr><td><code>Object.getPrototypeOf(obj)</code></td><td>获取 <code>obj</code> 的原型</td></tr><tr><td><code>Object.setPrototypeOf(obj, proto)</code></td><td>设置对象原型</td></tr><tr><td><code>obj.hasOwnProperty(key)</code></td><td>判断属性是否在实例自身而不是原型上</td></tr></tbody></table><h3 id="原型" tabindex="-1"><a class="header-anchor" href="#原型"><span>原型</span></a></h3><p>每个 JavaScript <strong>对象</strong>（除了少数例外，如 <code>null</code> 或通过 <code>Object.create(null)</code> 创建的对象）都有一个内部属性，被称为它的<strong>原型</strong>。这个原型本身也是一个对象。</p><ul><li><strong><code>[[Prototype]]</code> (内部属性)</strong>：这是 ECMAScript 规范中定义的内部属性，表示一个对象的原型。</li><li><strong><code>__proto__</code> (非标准/已废弃)</strong>：这是大多数浏览器实现的一个非标准的属性，用于直接访问或设置一个对象的 <code>[[Prototype]]</code>。<strong>不推荐在生产代码中直接使用它</strong>，因为它性能较差且可能引起兼容性问题。</li><li><strong><code>Object.getPrototypeOf()</code> (标准方法)</strong>：这是获取一个对象原型的<strong>标准和推荐</strong>方法。</li><li><strong><code>Object.prototype</code> (所有对象的终点)</strong>：所有普通对象的原型链最终都会指向 <code>Object.prototype</code>。<code>Object.prototype</code> 的原型是 <code>null</code>，标志着原型链的终点。</li></ul><p><strong>函数与原型：</strong></p><p><strong>所有函数</strong>都有一个特殊的 <code>prototype</code> 属性（注意：这里是小写的 <code>p</code>），它指向一个对象，这个对象就是当函数作为构造函数（使用 <code>new</code> 关键字）创建实例时，所有实例会继承的<strong>原型对象</strong>。</p><p>这个<code>prototype</code>属性有一个<code>constructor</code>（构造函数）属性，指向函数自身。</p><div class="language-JS line-numbers-mode" data-highlighter="prismjs" data-ext="JS"><pre><code class="language-JS"><span class="line">function Person(name) {</span>
<span class="line">  this.name = name;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// Person 函数的 prototype 属性，它是一个对象</span>
<span class="line">console.log(typeof Person.prototype); // &quot;object&quot;</span>
<span class="line">console.log(Person.prototype.constructor === Person); // true</span>
<span class="line"></span>
<span class="line">const alice = new Person(&#39;Alice&#39;);</span>
<span class="line"></span>
<span class="line">// alice 对象的 [[Prototype]] 指向 Person.prototype</span>
<span class="line">console.log(Object.getPrototypeOf(alice) === Person.prototype); // true</span>
<span class="line"></span>
<span class="line">// Person.prototype 的原型是 Object.prototype</span>
<span class="line">console.log(Object.getPrototypeOf(Person.prototype) === Object.prototype); // true</span>
<span class="line"></span>
<span class="line">// Object.prototype 的原型是 null (原型链的终点)</span>
<span class="line">console.log(Object.getPrototypeOf(Object.prototype)); // null</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="原型链-1" tabindex="-1"><a class="header-anchor" href="#原型链-1"><span>原型链</span></a></h3><p>当你在一个对象上访问一个属性或方法时，JavaScript 引擎会按照以下顺序查找它：</p><ol><li><strong>首先，在对象自身查找</strong>：如果找到该属性，则直接返回。</li><li><strong>沿着原型链向上查找</strong>：如果对象自身没有该属性，引擎会沿着该对象的 <code>[[Prototype]]</code> 向上查找。</li><li><strong>重复步骤 2</strong>：如果原型对象也没有该属性，则会继续查找原型对象的原型，直到达到原型链的末端（即 <code>null</code>）。</li><li><strong>返回 <code>undefined</code></strong>：如果查找到原型链的末端仍未找到该属性，则返回 <code>undefined</code>。</li></ol><p>这种从一个对象到其原型，再到原型的原型，层层向上查找的链接关系，就构成了<strong>原型链</strong>。</p><p>示意图：</p><div class="language-JS line-numbers-mode" data-highlighter="prismjs" data-ext="JS"><pre><code class="language-JS"><span class="line">// 假设有以下关系：</span>
<span class="line">// alice -&gt; Person.prototype -&gt; Object.prototype -&gt; null</span>
<span class="line"></span>
<span class="line">alice.name       // 在 alice 自身找到</span>
<span class="line">alice.sayHello() // 在 Person.prototype 上找到 (如果定义了)</span>
<span class="line">alice.toString() // 在 Object.prototype 上找到</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>示例查找过程：</p><div class="language-JS line-numbers-mode" data-highlighter="prismjs" data-ext="JS"><pre><code class="language-JS"><span class="line">function Animal(name) {</span>
<span class="line">  this.name = name;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">Animal.prototype.speak = function() {</span>
<span class="line">  console.log(\`\${this.name} makes a sound.\`);</span>
<span class="line">};</span>
<span class="line"></span>
<span class="line">function Dog(name, breed) {</span>
<span class="line">  Animal.call(this, name); // 继承 Animal 的属性</span>
<span class="line">  this.breed = breed;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 关键步骤：设置 Dog.prototype 继承 Animal.prototype</span>
<span class="line">// Object.create() 是最推荐的继承方式，它创建了一个新对象，</span>
<span class="line">// 并将其原型设置为传入的参数。</span>
<span class="line">Dog.prototype = Object.create(Animal.prototype);</span>
<span class="line">Dog.prototype.constructor = Dog; // 修正 constructor 指向 Dog</span>
<span class="line"></span>
<span class="line">Dog.prototype.bark = function() {</span>
<span class="line">  console.log(\`\${this.name} barks!\`);</span>
<span class="line">};</span>
<span class="line"></span>
<span class="line">const myDog = new Dog(&#39;Buddy&#39;, &#39;Golden Retriever&#39;);</span>
<span class="line"></span>
<span class="line">// 1. 访问 myDog.name</span>
<span class="line">console.log(myDog.name); // &#39;Buddy&#39; (在 myDog 自身找到)</span>
<span class="line"></span>
<span class="line">// 2. 访问 myDog.bark()</span>
<span class="line">myDog.bark(); // &#39;Buddy barks!&#39; (在 Dog.prototype 上找到)</span>
<span class="line"></span>
<span class="line">// 3. 访问 myDog.speak()</span>
<span class="line">myDog.speak(); // &#39;Buddy makes a sound.&#39; (在 Dog.prototype 的原型 Animal.prototype 上找到)</span>
<span class="line"></span>
<span class="line">// 4. 访问 myDog.toString()</span>
<span class="line">console.log(myDog.toString()); // &#39;[object Object]&#39; (在 Animal.prototype 的原型 Object.prototype 上找到)</span>
<span class="line"></span>
<span class="line">// 5. 访问 myDog.nonExistentProperty</span>
<span class="line">console.log(myDog.nonExistentProperty); // undefined (查找到 null 也未找到)</span>
<span class="line"></span>
<span class="line">// 查看原型链：</span>
<span class="line">console.log(Object.getPrototypeOf(myDog) === Dog.prototype);                 // true</span>
<span class="line">console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype);      // true</span>
<span class="line">console.log(Object.getPrototypeOf(Animal.prototype) === Object.prototype);   // true</span>
<span class="line">console.log(Object.getPrototypeOf(Object.prototype) === null);               // true</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="prototype-与prototype" tabindex="-1"><a class="header-anchor" href="#prototype-与prototype"><span>[[Prototype]]与prototype</span></a></h3><p><strong><code>[[Prototype]]</code></strong> (通过 <code>Object.getPrototypeOf(XXX)</code>或<code>XXX.__proto</code> 访问)：</p><ul><li>是<strong>每个对象</strong>都拥有的<strong>内部属性</strong>，指向它的原型。</li><li>它用于在查找属性时<strong>构成原型链</strong>。</li><li>实例对象（如 <code>alice</code> 和 <code>myDog</code>）的 <code>[[Prototype]]</code> 会指向其构造函数的 <code>prototype</code> 属性。</li></ul><p><strong><code>prototype</code></strong> (仅存在于<strong>函数</strong>上的属性)：</p><ul><li>是<strong>函数</strong>才有的一个<strong>公共属性</strong>。</li><li>它指向一个对象，这个对象就是通过该函数作为构造函数创建的<strong>所有实例所共享的原型对象</strong>。</li><li>它用于在创建新实例时，<strong>设置实例的 <code>[[Prototype]]</code></strong>。</li></ul><p>简而言之：<strong><code>prototype</code> 是一个函数的属性，它指向一个将被用作实例原型的对象。<code>[[Prototype]]</code> 是一个对象的内部链接，它指向该对象的原型。</strong></p><h3 id="class类与原型链" tabindex="-1"><a class="header-anchor" href="#class类与原型链"><span>class类与原型链</span></a></h3><p>ES6 引入的 <code>class</code> 语法（<code>class MyClass extends BaseClass {}</code>）仅仅是原型继承的<strong>语法糖</strong>。在底层，JavaScript 依然使用原型和原型链来实现继承。</p><div class="language-JS line-numbers-mode" data-highlighter="prismjs" data-ext="JS"><pre><code class="language-JS"><span class="line">class Person {</span>
<span class="line">    constructor(name) {</span>
<span class="line">        this.name = name;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    sayHello() {</span>
<span class="line">        console.log(\`你好, 我是 \${this.name}\`);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    static create(name: string) {</span>
<span class="line">        return new Person(name);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">class Student extends Person {</span>
<span class="line">    constructor(name, grade) {</span>
<span class="line">        super(name);</span>
<span class="line">        this.grade = grade;</span>
<span class="line">    }</span>
<span class="line">    study() {</span>
<span class="line">        console.log(\`\${this.name}的年级是\${this.grade}\`);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">const student = new Student(&#39;小明&#39;, &#39;3&#39;);</span>
<span class="line">console.log(Object.getPrototypeOf(Student.prototype) === Person.prototype); // true</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这表明 <code>class</code> 语法并没有改变 JavaScript 的继承本质，只是提供了一种更符合传统面向对象语言习惯的写法。</p><p>function + 原型链写法：</p><div class="language-JS line-numbers-mode" data-highlighter="prismjs" data-ext="JS"><pre><code class="language-JS"><span class="line">// 父类（Person）：类声明与构造函数</span>
<span class="line">function Person(name) {</span>
<span class="line">    this.name = name;</span>
<span class="line">    </span>
<span class="line">    // 私有变量（闭包）</span>
<span class="line">    const privateAge = 30;</span>
<span class="line">    this.getAge = function () {</span>
<span class="line">        return privateAge; // 只能通过方法访问</span>
<span class="line">    };</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 静态方法</span>
<span class="line">Person.create = function (name) {</span>
<span class="line">    return new Person(name);</span>
<span class="line">};</span>
<span class="line"></span>
<span class="line">// 父类方法（挂载到 prototype）</span>
<span class="line">Person.prototype.sayHello = function () {</span>
<span class="line">    console.log(\`你好，我是\${this.name}\`);</span>
<span class="line">};</span>
<span class="line"></span>
<span class="line">// 子类（Student）</span>
<span class="line">function Student(name, grade) {</span>
<span class="line">    // 调用父类构造函数（相当于 super(name)）</span>
<span class="line">    Person.call(this, name);</span>
<span class="line">    this.grade = grade;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 继承父类原型（实现 extends）</span>
<span class="line">Student.prototype = Object.create(Person.prototype);</span>
<span class="line">// Student.prototype.constructor = Student;</span>
<span class="line"></span>
<span class="line">// 子类方法</span>
<span class="line">Student.prototype.study = function () {</span>
<span class="line">    console.log(\`\${this.name}的年级是\${this.grade}\`);</span>
<span class="line">};</span>
<span class="line"></span>
<span class="line">// 测试</span>
<span class="line">const student = new Student(&#39;小明&#39;, &#39;3&#39;);</span>
<span class="line">student.sayHello();</span>
<span class="line">student.study();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><table><thead><tr><th style="text-align:left;">特性</th><th style="text-align:left;"><code>class</code> 语法</th><th style="text-align:left;"><code>function</code> + <code>prototype</code> 实现</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>构造函数</strong></td><td style="text-align:left;"><code>constructor()</code></td><td style="text-align:left;"><code>function Person(name) { ... }</code></td></tr><tr><td style="text-align:left;"><strong>方法定义</strong></td><td style="text-align:left;"><code>sayHello() { ... }</code></td><td style="text-align:left;"><code>Person.prototype.sayHello = ...</code></td></tr><tr><td style="text-align:left;"><strong>继承</strong></td><td style="text-align:left;"><code>extends</code></td><td style="text-align:left;"><code>Object.create</code> + <code>Parent.call(this)</code></td></tr><tr><td style="text-align:left;"><strong>静态方法</strong></td><td style="text-align:left;"><code>static method()</code></td><td style="text-align:left;"><code>Person.staticMethod = ...</code></td></tr><tr><td style="text-align:left;"><strong>私有字段</strong></td><td style="text-align:left;"><code>#字段名</code></td><td style="text-align:left;">闭包函数</td></tr><tr><td style="text-align:left;"><strong>super 调用</strong></td><td style="text-align:left;"><code>super.method()</code></td><td style="text-align:left;"><code>Parent.prototype.method.call(this)</code></td></tr></tbody></table><h2 id="属性的可枚举性和所有权" tabindex="-1"><a class="header-anchor" href="#属性的可枚举性和所有权"><span>属性的可枚举性和所有权</span></a></h2><table><thead><tr><th>方法/操作</th><th>仅自身属性</th><th>自身 &amp; 继承属性</th><th>仅可枚举</th><th>可枚举 &amp; 不可枚举</th></tr></thead><tbody><tr><td>for...in</td><td>✅</td><td>✅</td><td>✅</td><td>❌</td></tr><tr><td>Object.keys()</td><td>✅</td><td>❌</td><td>✅</td><td>❌</td></tr><tr><td>Object.values()</td><td>✅</td><td>❌</td><td>✅</td><td>❌</td></tr><tr><td>Object.entries()</td><td>✅</td><td>❌</td><td>✅</td><td>❌</td></tr><tr><td>Object.getOwnPropertyNames()</td><td>✅</td><td>❌</td><td>❌</td><td>✅</td></tr><tr><td>Object.getOwnPropertySymbols()</td><td>✅</td><td>❌</td><td>❌</td><td>✅</td></tr><tr><td>Reflect.ownKeys()</td><td>✅</td><td>❌</td><td>❌</td><td>✅ (包括 Symbol)</td></tr><tr><td>obj.propertyName (访问)</td><td>✅</td><td>✅</td><td>✅</td><td>✅</td></tr></tbody></table><h3 id="可枚举性" tabindex="-1"><a class="header-anchor" href="#可枚举性"><span>可枚举性</span></a></h3><p><strong>可枚举性</strong>是一个布尔值特性，它决定了属性是否可以通过特定的遍历方法（如 <code>for...in</code> 循环或 <code>Object.keys()</code>）被访问到。</p><p><strong><code>enumerable: true</code> (可枚举)</strong>：</p><ul><li>表示该属性在对象的大多数<strong>迭代操作</strong>中是可见的。</li><li>可以通过 <code>for...in</code> 循环遍历。</li><li>会出现在 <code>Object.keys()</code>、<code>Object.values()</code>、<code>Object.entries()</code> 的结果中。</li><li>会被 <code>JSON.stringify()</code> 序列化（如果属性值是可序列化的）。</li><li>这是通过直接赋值（<code>obj.prop = value</code>）或对象字面量（<code>{ prop: value }</code>）创建的属性的<strong>默认特性</strong>。</li></ul><div class="language-JS line-numbers-mode" data-highlighter="prismjs" data-ext="JS"><pre><code class="language-JS"><span class="line">const myObject = {</span>
<span class="line">  a: 1,</span>
<span class="line">  b: 2</span>
<span class="line">};</span>
<span class="line"></span>
<span class="line">for (let key in myObject) {</span>
<span class="line">  console.log(key); // 输出: a, b</span>
<span class="line">}</span>
<span class="line">console.log(Object.keys(myObject)); // [&#39;a&#39;, &#39;b&#39;]</span>
<span class="line">console.log(JSON.stringify(myObject)); // {&quot;a&quot;:1,&quot;b&quot;:2}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong><code>enumerable: false</code> (不可枚举)</strong>：</p><ul><li>表示该属性在上述迭代操作中是<strong>不可见</strong>的。</li><li>通常用于内部属性，不希望它们在外部被轻易发现或修改，但又不希望完全私有化。</li><li>通过 <code>Object.defineProperty()</code> 或 <code>Object.defineProperties()</code> 方法可以显式地将属性设置为不可枚举。</li><li>许多内置对象的原型属性（如 <code>Object.prototype.toString</code>）以及通过 <code>Symbol()</code> 创建的属性（作为对象键）默认都是不可枚举的。</li></ul><div class="language-JS line-numbers-mode" data-highlighter="prismjs" data-ext="JS"><pre><code class="language-JS"><span class="line">const myObject = {</span>
<span class="line">  name: &#39;Alice&#39;</span>
<span class="line">};</span>
<span class="line"></span>
<span class="line">// 使用 Object.defineProperty 定义一个不可枚举属性</span>
<span class="line">Object.defineProperty(myObject, &#39;id&#39;, {</span>
<span class="line">  value: &#39;uuid-123&#39;,</span>
<span class="line">  writable: true,     // 可写</span>
<span class="line">  configurable: true, // 可配置</span>
<span class="line">  enumerable: false   // 不可枚举</span>
<span class="line">});</span>
<span class="line"></span>
<span class="line">console.log(myObject.id); // uuid-123 (仍然可以访问和修改)</span>
<span class="line"></span>
<span class="line">for (let key in myObject) {</span>
<span class="line">  console.log(key); // 输出: name (id 不会被遍历到)</span>
<span class="line">}</span>
<span class="line">console.log(Object.keys(myObject)); // [&#39;name&#39;]</span>
<span class="line">console.log(Object.values(myObject)); // [&#39;Alice&#39;]</span>
<span class="line">console.log(JSON.stringify(myObject)); // {&quot;name&quot;:&quot;Alice&quot;} (id 不会被序列化)</span>
<span class="line"></span>
<span class="line">// 但可以通过 Object.getOwnPropertyDescriptors 或 Object.getOwnPropertyNames 看到它</span>
<span class="line">console.log(Object.getOwnPropertyNames(myObject)); // [&#39;name&#39;, &#39;id&#39;]</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="所有权" tabindex="-1"><a class="header-anchor" href="#所有权"><span>所有权</span></a></h3><p><strong>所有权</strong>指的是一个属性是直接定义在对象自身上，还是定义在它的原型链上。</p><h4 id="自身属性" tabindex="-1"><a class="header-anchor" href="#自身属性"><span>自身属性</span></a></h4><ul><li>直接定义在对象实例上的属性。</li><li>可以通过 <code>Object.hasOwnProperty(propertyName)</code> 方法来检查。</li><li><code>Object.keys()</code>、<code>Object.values()</code>、<code>Object.entries()</code>、<code>Object.getOwnPropertyNames()</code>、<code>Object.getOwnPropertySymbols()</code> 都只返回对象的自身属性（无论可枚举与否）。</li></ul><div class="language-JS line-numbers-mode" data-highlighter="prismjs" data-ext="JS"><pre><code class="language-JS"><span class="line">const obj = {</span>
<span class="line">  name: &#39;Bob&#39; // 自身属性</span>
<span class="line">};</span>
<span class="line">Object.defineProperty(obj, &#39;hidden&#39;, { value: 123, enumerable: false }); // 自身属性，但不可枚举</span>
<span class="line"></span>
<span class="line">console.log(obj.hasOwnProperty(&#39;name&#39;));   // true</span>
<span class="line">console.log(obj.hasOwnProperty(&#39;hidden&#39;)); // true</span>
<span class="line">console.log(obj.hasOwnProperty(&#39;toString&#39;)); // false (toString 在原型链上)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="继承属性-原型链" tabindex="-1"><a class="header-anchor" href="#继承属性-原型链"><span>继承属性/原型链</span></a></h4><p>定义在对象的原型链上的属性。当访问一个对象属性时，如果对象自身没有该属性，JavaScript 引擎会沿着原型链向上查找。</p><p><code>for...in</code> 循环会遍历<strong>可枚举的自身属性和可枚举的继承属性</strong>。</p><div class="language-JS line-numbers-mode" data-highlighter="prismjs" data-ext="JS"><pre><code class="language-JS"><span class="line">const proto = {</span>
<span class="line">  protoProp: &#39;I am from prototype&#39;,</span>
<span class="line">  anotherProtoProp: &#39;Also from prototype&#39;</span>
<span class="line">};</span>
<span class="line"></span>
<span class="line">const myObject = Object.create(proto); // myObject 继承自 proto</span>
<span class="line">myObject.ownProp = &#39;I am my own property&#39;; // myObject 的自身属性</span>
<span class="line"></span>
<span class="line">for (let key in myObject) {</span>
<span class="line">  console.log(key); // 输出: ownProp, protoProp, anotherProtoProp</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 区分自身属性和继承属性</span>
<span class="line">console.log(myObject.hasOwnProperty(&#39;ownProp&#39;));       // true</span>
<span class="line">console.log(myObject.hasOwnProperty(&#39;protoProp&#39;));     // false</span>
<span class="line">console.log(myObject.hasOwnProperty(&#39;toString&#39;));      // false</span>
<span class="line"></span>
<span class="line">// 只获取自身的可枚举属性</span>
<span class="line">console.log(Object.keys(myObject)); // [&#39;ownProp&#39;]</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,50)]))}const r=s(i,[["render",t]]),p=JSON.parse('{"path":"/web/javascript/senior.html","title":"JavaScript","lang":"zh-CN","frontmatter":{"title":"JavaScript","shortTitle":"高级篇","description":"JavaScript高级篇","date":"2025-07-25T15:33:07.000Z","categories":["前端","JavaScript"],"tags":[],"order":5},"git":{"createdTime":1753436153000,"updatedTime":1754732279000,"contributors":[{"name":"Okita1027","username":"Okita1027","email":"96156298+Okita1027@users.noreply.github.com","commits":9,"url":"https://github.com/Okita1027"}]},"readingTime":{"minutes":7.46,"words":2237},"filePathRelative":"web/javascript/senior.md"}');export{r as comp,p as data};
