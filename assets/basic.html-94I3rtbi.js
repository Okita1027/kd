import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as e,d as i,o as a}from"./app-CN29avzT.js";const l={};function d(c,s){return a(),e("div",null,s[0]||(s[0]=[i(`<h2 id="索引器" tabindex="-1"><a class="header-anchor" href="#索引器"><span>索引器</span></a></h2><p>索引器允许你像访问数组或字典那样，通过索引（或其他键）来访问类或结构体的实例。这使得你的自定义类型能够表现出集合的行为，从而提供更直观、更自然的 API。</p><p>简单来说，<strong>索引器让你的对象能够使用方括号 <code>[]</code> 语法</strong>。</p><h3 id="问题引入" tabindex="-1"><a class="header-anchor" href="#问题引入"><span>问题引入</span></a></h3><p>考虑一个场景，你有一个表示“学生列表”的类 <code>StudentList</code>，或者一个表示“配置参数”的类 <code>Configuration</code>。你希望能够通过学生的编号来获取学生对象，或者通过参数名来获取配置值，就像你访问数组元素或字典键值那样：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// 理想中的使用方式：</span>
<span class="line">StudentList students = new StudentList();</span>
<span class="line">Student s = students[101]; // 获取学号为101的学生</span>
<span class="line"></span>
<span class="line">Configuration config = new Configuration();</span>
<span class="line">string dbHost = config[&quot;DatabaseHost&quot;]; // 获取名为 &quot;DatabaseHost&quot; 的配置</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果没有索引器，你可能需要这样写：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">Student s = students.GetStudentById(101);</span>
<span class="line">string dbHost = config.GetSetting(&quot;DatabaseHost&quot;);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>虽然也能实现功能，但使用索引器 <code>[]</code> 语法显然更简洁、更符合直觉，尤其当你的类型在概念上代表一个项目的集合时。</p><h3 id="语法" tabindex="-1"><a class="header-anchor" href="#语法"><span>语法</span></a></h3><p>索引器定义看起来很像属性 (Properties)，但有几个关键的区别：</p><ul><li><strong>没有显式的名称</strong>：索引器没有显式的名字，它使用关键字 <code>this</code>。</li><li><strong>使用方括号 <code>[]</code></strong>：在 <code>this</code> 关键字后面跟着方括号 <code>[]</code>，方括号里定义了索引器的参数。</li><li><strong>参数列表</strong>：索引器可以接受一个或多个参数，这些参数可以是任何类型（<code>int</code>, <code>string</code>, <code>Guid</code> 等）。这是索引器与属性的主要区别，属性不能接受参数。</li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public class MyCollection&lt;T&gt;</span>
<span class="line">{</span>
<span class="line">    private T[] _items = new T[10];</span>
<span class="line"></span>
<span class="line">    // 声明一个索引器，接受一个 int 类型的索引</span>
<span class="line">    public T this[int index]</span>
<span class="line">    {</span>
<span class="line">        get</span>
<span class="line">        {</span>
<span class="line">            // 在这里实现获取逻辑</span>
<span class="line">            if (index &gt;= 0 &amp;&amp; index &lt; _items.Length)</span>
<span class="line">            {</span>
<span class="line">                return _items[index];</span>
<span class="line">            }</span>
<span class="line">            throw new IndexOutOfRangeException(&quot;Index is out of range.&quot;);</span>
<span class="line">        }</span>
<span class="line">        set</span>
<span class="line">        {</span>
<span class="line">            // 在这里实现设置逻辑</span>
<span class="line">            if (index &gt;= 0 &amp;&amp; index &lt; _items.Length)</span>
<span class="line">            {</span>
<span class="line">                _items[index] = value;</span>
<span class="line">            }</span>
<span class="line">            else</span>
<span class="line">            {</span>
<span class="line">                throw new IndexOutOfRangeException(&quot;Index is out of range.&quot;);</span>
<span class="line">            }</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="get和set访问器" tabindex="-1"><a class="header-anchor" href="#get和set访问器"><span><code>get</code>和<code>set</code>访问器</span></a></h3><p>和属性一样，索引器也有 <code>get</code> 和 <code>set</code> 访问器，它们定义了如何读取和写入通过索引访问的值。</p><ul><li><strong><code>get</code> 访问器</strong>：当通过索引读取值时被调用。它必须返回索引器类型的值。</li><li><strong><code>set</code> 访问器</strong>：当通过索引赋值时被调用。隐式参数 <code>value</code> 包含了要赋给索引的值。</li></ul><p>示例1：基于整数索引的<code>StudentCollection</code></p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public class Student</span>
<span class="line">{</span>
<span class="line">    public int Id { get; set; }</span>
<span class="line">    public string Name { get; set; } = string.Empty;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">public class StudentCollection</span>
<span class="line">{</span>
<span class="line">    private List&lt;Student&gt; _students = new List&lt;Student&gt;();</span>
<span class="line"></span>
<span class="line">    public StudentCollection()</span>
<span class="line">    {</span>
<span class="line">        _students.Add(new Student { Id = 101, Name = &quot;Alice&quot; });</span>
<span class="line">        _students.Add(new Student { Id = 102, Name = &quot;Bob&quot; });</span>
<span class="line">        _students.Add(new Student { Id = 103, Name = &quot;Charlie&quot; });</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    // 索引器：通过学号（Id）获取或设置学生</span>
<span class="line">    public Student? this[int studentId]</span>
<span class="line">    {</span>
<span class="line">        get</span>
<span class="line">        {</span>
<span class="line">            // 查找匹配学号的学生</span>
<span class="line">            return _students.FirstOrDefault(s =&gt; s.Id == studentId);</span>
<span class="line">        }</span>
<span class="line">        set</span>
<span class="line">        {</span>
<span class="line">            // 如果要设置（更新）学生，先找到旧的学生</span>
<span class="line">            var existingStudent = _students.FirstOrDefault(s =&gt; s.Id == studentId);</span>
<span class="line">            if (existingStudent != null)</span>
<span class="line">            {</span>
<span class="line">                // 找到则移除旧的，添加新的</span>
<span class="line">                _students.Remove(existingStudent);</span>
<span class="line">                if (value != null)</span>
<span class="line">                {</span>
<span class="line">                    _students.Add(value);</span>
<span class="line">                }</span>
<span class="line">            }</span>
<span class="line">            else if (value != null)</span>
<span class="line">            {</span>
<span class="line">                // 找不到旧的，直接添加新的</span>
<span class="line">                _students.Add(value);</span>
<span class="line">            }</span>
<span class="line">            // 如果 value 是 null 且找不到 existingStudent，则不执行任何操作</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    // 也可以添加一个只读的索引器，或者只写索引器</span>
<span class="line">    public int this[string studentName] // 重载索引器，通过姓名查找</span>
<span class="line">    {</span>
<span class="line">        get</span>
<span class="line">        {</span>
<span class="line">            return _students.FirstOrDefault(s =&gt; s.Name.Equals(studentName, StringComparison.OrdinalIgnoreCase))?.Id ?? -1;</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 使用 StudentCollection</span>
<span class="line">public class IndexerExample</span>
<span class="line">{</span>
<span class="line">    public static void Run()</span>
<span class="line">    {</span>
<span class="line">        StudentCollection students = new StudentCollection();</span>
<span class="line"></span>
<span class="line">        // 使用索引器获取学生</span>
<span class="line">        Student? student101 = students[101];</span>
<span class="line">        if (student101 != null)</span>
<span class="line">        {</span>
<span class="line">            Console.WriteLine($&quot;Student 101: {student101.Name}&quot;); // Output: Student 101: Alice</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        Student? student104 = students[104];</span>
<span class="line">        if (student104 == null)</span>
<span class="line">        {</span>
<span class="line">            Console.WriteLine(&quot;Student 104 not found initially.&quot;); // Output: Student 104 not found initially.</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        // 使用索引器设置（更新/添加）学生</span>
<span class="line">        students[101] = new Student { Id = 101, Name = &quot;Alice Smith&quot; }; // 更新 Alice</span>
<span class="line">        students[104] = new Student { Id = 104, Name = &quot;David&quot; };     // 添加 David</span>
<span class="line"></span>
<span class="line">        Console.WriteLine($&quot;Updated Student 101: {students[101]?.Name}&quot;); // Output: Updated Student 101: Alice Smith</span>
<span class="line">        Console.WriteLine($&quot;New Student 104: {students[104]?.Name}&quot;);     // Output: New Student 104: David</span>
<span class="line"></span>
<span class="line">        // 使用重载的索引器</span>
<span class="line">        int charlieId = students[&quot;Charlie&quot;];</span>
<span class="line">        Console.WriteLine($&quot;Charlie&#39;s ID: {charlieId}&quot;); // Output: Charlie&#39;s ID: 103</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>示例2：基于字符串键的 <code>ConfigurationManager</code></p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public class ConfigurationManager</span>
<span class="line">{</span>
<span class="line">    private Dictionary&lt;string, string&gt; _settings = new Dictionary&lt;string, string&gt;();</span>
<span class="line"></span>
<span class="line">    public ConfigurationManager()</span>
<span class="line">    {</span>
<span class="line">        _settings.Add(&quot;DatabaseHost&quot;, &quot;localhost&quot;);</span>
<span class="line">        _settings.Add(&quot;Port&quot;, &quot;5432&quot;);</span>
<span class="line">        _settings.Add(&quot;Username&quot;, &quot;admin&quot;);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    // 索引器：通过字符串键获取或设置配置值</span>
<span class="line">    public string? this[string key]</span>
<span class="line">    {</span>
<span class="line">        get</span>
<span class="line">        {</span>
<span class="line">            _settings.TryGetValue(key, out string? value);</span>
<span class="line">            return value;</span>
<span class="line">        }</span>
<span class="line">        set</span>
<span class="line">        {</span>
<span class="line">            if (value == null)</span>
<span class="line">            {</span>
<span class="line">                _settings.Remove(key); // 如果设置为 null，则移除</span>
<span class="line">            }</span>
<span class="line">            else</span>
<span class="line">            {</span>
<span class="line">                _settings[key] = value; // 添加或更新</span>
<span class="line">            }</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 使用 ConfigurationManager</span>
<span class="line">public class ConfigExample</span>
<span class="line">{</span>
<span class="line">    public static void Run()</span>
<span class="line">    {</span>
<span class="line">        ConfigurationManager config = new ConfigurationManager();</span>
<span class="line"></span>
<span class="line">        Console.WriteLine($&quot;DB Host: {config[&quot;DatabaseHost&quot;]}&quot;); // Output: DB Host: localhost</span>
<span class="line">        Console.WriteLine($&quot;Port: {config[&quot;Port&quot;]}&quot;);           // Output: Port: 5432</span>
<span class="line"></span>
<span class="line">        config[&quot;DatabaseHost&quot;] = &quot;production.db.com&quot;; // 更新</span>
<span class="line">        config[&quot;TimeoutSeconds&quot;] = &quot;60&quot;;              // 添加新键</span>
<span class="line"></span>
<span class="line">        Console.WriteLine($&quot;Updated DB Host: {config[&quot;DatabaseHost&quot;]}&quot;); // Output: Updated DB Host: production.db.com</span>
<span class="line">        Console.WriteLine($&quot;Timeout: {config[&quot;TimeoutSeconds&quot;]}&quot;);      // Output: Timeout: 60</span>
<span class="line"></span>
<span class="line">        config[&quot;Port&quot;] = null; // 移除 Port 设置</span>
<span class="line">        Console.WriteLine($&quot;Port after removal: {config[&quot;Port&quot;] ?? &quot;N/A&quot;}&quot;); // Output: Port after removal: N/A</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="特点-注意事项" tabindex="-1"><a class="header-anchor" href="#特点-注意事项"><span>特点&amp;注意事项</span></a></h3><ul><li><strong>可以重载</strong>：你可以为一个类定义多个索引器，只要它们的参数签名（数量、类型和顺序）不同即可。例如，一个类可以同时拥有 <code>this[int index]</code> 和 <code>this[string key]</code>。</li><li><strong>不限于整数索引</strong>：索引器的参数可以是任何类型，这使得它比传统数组索引更灵活。</li><li><strong>参数数量</strong>：索引器可以接受多个参数，形成多维索引器（例如 <code>this[int row, int col]</code>，类似于访问二维数组）。</li><li><strong>访问修饰符</strong>：索引器本身可以有 <code>public</code>, <code>protected</code>, <code>internal</code>, <code>private</code> 等访问修饰符。<code>get</code> 和 <code>set</code> 访问器也可以有更严格的访问修饰符（例如 <code>public string this[int i] { get; private set; }</code>）。</li><li><strong>静态索引器</strong>：索引器不能是静态的。它们是实例成员，与特定对象关联。</li><li><strong>接口中的索引器</strong>：接口可以声明索引器，以便实现该接口的类必须提供对应的索引器实现。</li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public interface IMyCollection&lt;T&gt;</span>
<span class="line">{</span>
<span class="line">    T this[int index] { get; set; }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><strong>错误处理</strong>：在索引器的 <code>get</code> 和 <code>set</code> 访问器中，你应该进行必要的参数验证和错误处理（例如，索引越界检查，如上述示例所示），并抛出适当的异常。</li><li><strong>与属性的区别</strong>： <ul><li><strong>名称</strong>：属性有名称 (<code>Name</code>、<code>Age</code>)；索引器没有，使用 <code>this[]</code>。</li><li><strong>参数</strong>：属性不能接受参数；索引器必须接受至少一个参数。</li></ul></li></ul><h2 id="解构赋值" tabindex="-1"><a class="header-anchor" href="#解构赋值"><span>解构赋值</span></a></h2><p>解构赋值允许你<strong>将一个对象或元组 (tuple) 的属性或元素，一次性地分解 (deconstruct) 到单独的变量中</strong>。</p><h3 id="语法-1" tabindex="-1"><a class="header-anchor" href="#语法-1"><span>语法</span></a></h3><p>解构赋值的语法使用括号 <code>()</code> 来包裹你想要接收值的变量列表，然后使用 <code>=</code> 运算符将其赋值给要解构的对象。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">(string firstName, string lastName, int age) = person;</span>
<span class="line"></span>
<span class="line">// 或者使用 var 关键字进行类型推断 (更常用)</span>
<span class="line">(var firstName, var lastName, var age) = person;</span>
<span class="line"></span>
<span class="line">// 甚至更简洁，如果所有变量都是新声明的且类型可以推断</span>
<span class="line">var (firstName, lastName, age) = person;</span>
<span class="line"></span>
<span class="line">Console.WriteLine($&quot;Name: {firstName} {lastName}, Age: {age}&quot;);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="使用场景" tabindex="-1"><a class="header-anchor" href="#使用场景"><span>使用场景</span></a></h3><h4 id="解构元组" tabindex="-1"><a class="header-anchor" href="#解构元组"><span>解构元组</span></a></h4><p><strong>元组 (Tuple)</strong> 是 C# 7.0 引入的另一个特性，它提供了一种轻量级的方式来表示一个具有多个元素的匿名数据结构。解构赋值是与元组结合使用的最常见场景。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// 定义一个返回元组的方法</span>
<span class="line">public (string name, decimal price) GetProductDetails()</span>
<span class="line">{</span>
<span class="line">    // 假设从数据库或API获取数据</span>
<span class="line">    return (&quot;Laptop&quot;, 1200.50m);</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 调用方法并解构返回值</span>
<span class="line">var (productName, productPrice) = GetProductDetails();</span>
<span class="line"></span>
<span class="line">Console.WriteLine($&quot;Product: {productName}, Price: {productPrice}&quot;);</span>
<span class="line"></span>
<span class="line">// 你也可以忽略不关心的元素，使用下划线 \`_\`</span>
<span class="line">var (nameOnly, _) = GetProductDetails(); // 忽略 price</span>
<span class="line">Console.WriteLine($&quot;Product Name: {nameOnly}&quot;);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="结构自定义对象" tabindex="-1"><a class="header-anchor" href="#结构自定义对象"><span>结构自定义对象</span></a></h4><p>要使一个自定义类或结构体能够被解构，你需要为它提供一个或多个 <strong><code>Deconstruct</code> 方法</strong>。<code>Deconstruct</code> 方法是一个特殊的公共方法，它必须：</p><ul><li><strong>没有返回值类型</strong>（即 <code>void</code>）。</li><li>接受一系列 <strong><code>out</code> 参数</strong>，这些 <code>out</code> 参数的顺序和类型决定了解构赋值时变量的顺序和类型。</li></ul><p>示例：为 <code>Person</code> 类添加 <code>Deconstruct</code> 方法</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public class Person</span>
<span class="line">{</span>
<span class="line">    public string FirstName { get; set; }</span>
<span class="line">    public string LastName { get; set; }</span>
<span class="line">    public int Age { get; set; }</span>
<span class="line"></span>
<span class="line">    public Person(string firstName, string lastName, int age)</span>
<span class="line">    {</span>
<span class="line">        FirstName = firstName;</span>
<span class="line">        LastName = lastName;</span>
<span class="line">        Age = age;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    // Deconstruct 方法：用于解构赋值</span>
<span class="line">    // 注意：方法名必须是 Deconstruct，且所有参数都必须是 out 参数</span>
<span class="line">    public void Deconstruct(out string firstName, out string lastName)</span>
<span class="line">    {</span>
<span class="line">        firstName = FirstName;</span>
<span class="line">        lastName = LastName;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public void Deconstruct(out string firstName, out string lastName, out int age)</span>
<span class="line">    {</span>
<span class="line">        firstName = FirstName;</span>
<span class="line">        lastName = LastName;</span>
<span class="line">        age = Age;</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">Person person = new Person(&quot;Jane&quot;, &quot;Doe&quot;, 25);</span>
<span class="line"></span>
<span class="line">// 使用第一个 Deconstruct 方法 (只解构名和姓)</span>
<span class="line">var (fName, lName) = person;</span>
<span class="line">Console.WriteLine($&quot;Deconstructed: {fName} {lName}&quot;);</span>
<span class="line"></span>
<span class="line">// 使用第二个 Deconstruct 方法 (解构名、姓和年龄)</span>
<span class="line">var (fName2, lName2, pAge) = person;</span>
<span class="line">Console.WriteLine($&quot;Deconstructed: {fName2} {lName2}, {pAge}&quot;);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>[!TIP]</p><p>一个类可以定义<strong>多个 <code>Deconstruct</code> 方法重载</strong>，允许你以不同的方式解构同一个对象，只需要它们的 <code>out</code> 参数签名不同即可。</p></blockquote><h3 id="忽略元素" tabindex="-1"><a class="header-anchor" href="#忽略元素"><span><code>_</code>忽略元素</span></a></h3><p>当你不关心解构结果中的某个或某些元素时，可以使用下划线 <code>_</code> 作为<strong>丢弃变量 (discard variable)</strong> 来忽略它们。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// GetProductDetails() 返回 (string name, decimal price)</span>
<span class="line">var (productName, _) = GetProductDetails(); // 只需要名字，忽略价格</span>
<span class="line"></span>
<span class="line">// 从 Person 对象中只获取年龄</span>
<span class="line">var (_, _, ageOnly) = person; // 忽略 FirstName 和 LastName</span>
<span class="line">Console.WriteLine($&quot;Age Only: {ageOnly}&quot;);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p><strong>示例：组合使用（解构+模式匹配）</strong></p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// 假设有一个 Item 元组</span>
<span class="line">public (string type, int quantity, decimal unitPrice) GetItem(int itemId)</span>
<span class="line">{</span>
<span class="line">    if (itemId == 1) return (&quot;Book&quot;, 2, 15.00m);</span>
<span class="line">    if (itemId == 2) return (&quot;Pen&quot;, 10, 0.50m);</span>
<span class="line">    return (&quot;Unknown&quot;, 0, 0m);</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 使用 switch 表达式和解构</span>
<span class="line">string itemDescription = GetItem(1) switch</span>
<span class="line">{</span>
<span class="line">    (&quot;Book&quot;, var qty, var price) when qty &gt; 1 =&gt; $&quot;Multiple books: {qty} @ {price:C}&quot;, // C# 8.0+</span>
<span class="line">    (&quot;Book&quot;, _, var price) =&gt; $&quot;Single book @ {price:C}&quot;,</span>
<span class="line">    (&quot;Pen&quot;, var qty, _) =&gt; $&quot;Pens: {qty}&quot;,</span>
<span class="line">    var (type, qty, _) when type == &quot;Unknown&quot; &amp;&amp; qty == 0 =&gt; &quot;Item not found or invalid.&quot;,</span>
<span class="line">    _ =&gt; &quot;Other item type.&quot;</span>
<span class="line">};</span>
<span class="line"></span>
<span class="line">Console.WriteLine(itemDescription); // Output: Multiple books: 2 @ $15.00</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="linq" tabindex="-1"><a class="header-anchor" href="#linq"><span>LINQ</span></a></h2><p><strong>LINQ（语言集成查询）</strong> 是 C# 提供的一种统一的数据访问方式，允许你对数组、集合、数据库、XML 等数据源使用 <strong>类似 SQL 的语法</strong> 进行查询和转换。</p><h3 id="语法形式" tabindex="-1"><a class="header-anchor" href="#语法形式"><span>语法形式</span></a></h3><h4 id="查询语法" tabindex="-1"><a class="header-anchor" href="#查询语法"><span>查询语法</span></a></h4><p>查询语法是一种更接近 SQL 的声明式语法，它使用一系列关键字（如 <code>from</code>、<code>where</code>、<code>select</code>、<code>group by</code>、<code>join</code> 等）来构建查询。</p><p>结构：</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">from &lt;range_variable&gt; in &lt;data_source&gt;</span>
<span class="line">where &lt;condition&gt;</span>
<span class="line">orderby &lt;ordering_expression&gt;</span>
<span class="line">select &lt;result_expression&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>示例：</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">List&lt;int&gt; numbers = new List&lt;int&gt; { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };</span>
<span class="line"></span>
<span class="line">// 查找所有偶数，并按降序排序</span>
<span class="line">var evenNumbers = from num in numbers // 从 numbers 集合中迭代每个元素为 num</span>
<span class="line">                  where num % 2 == 0   // 筛选条件：num 是偶数</span>
<span class="line">                  orderby num descending // 排序：按 num 降序</span>
<span class="line">                  select num;         // 投影：选择 num 作为结果</span>
<span class="line"></span>
<span class="line">Console.WriteLine(&quot;Even numbers (Query Syntax):&quot;);</span>
<span class="line">foreach (var n in evenNumbers)</span>
<span class="line">{</span>
<span class="line">    Console.WriteLine(n);</span>
<span class="line">}</span>
<span class="line">// Output: 10, 8, 6, 4, 2</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="方法语法-扩展方法语法" tabindex="-1"><a class="header-anchor" href="#方法语法-扩展方法语法"><span>方法语法/扩展方法语法</span></a></h4><p>方法语法是 LINQ 更常用的形式，它使用 <strong>扩展方法 (Extension Methods)</strong> 和 <strong>Lambda 表达式 (Lambda Expressions)</strong> 来构建查询。这种语法更加紧凑和灵活，并且所有查询语法最终都会被编译器转换为方法语法。</p><p>示例：</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">List&lt;int&gt; numbers = new List&lt;int&gt; { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };</span>
<span class="line"></span>
<span class="line">// 查找所有奇数，并按升序排序</span>
<span class="line">var oddNumbers = numbers.Where(num =&gt; num % 2 != 0) // Where 是扩展方法，num =&gt; num % 2 != 0 是 Lambda 表达式</span>
<span class="line">                        .OrderBy(num =&gt; num)       // OrderBy 也是扩展方法</span>
<span class="line">                        .ToList();                 // ToList() 将查询结果立即执行并转换为 List</span>
<span class="line"></span>
<span class="line">Console.WriteLine(&quot;Odd numbers (Method Syntax):&quot;);</span>
<span class="line">foreach (var n in oddNumbers)</span>
<span class="line">{</span>
<span class="line">    Console.WriteLine(n);</span>
<span class="line">}</span>
<span class="line">// Output: 1, 3, 5, 7, 9</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>推荐使用：</strong> 大多数情况下，<strong>方法语法</strong> 更受青睐，因为它更灵活，可读性在复杂链式操作中更好，并且与函数式编程模式更契合。不过，在某些复杂的 <code>join</code> 或 <code>group by</code> 场景下，查询语法可能会更清晰。</p><h3 id="基本操作符" tabindex="-1"><a class="header-anchor" href="#基本操作符"><span>基本操作符</span></a></h3><p>LINQ 提供了丰富的操作符来执行各种查询任务。这些操作符都是定义在 <code>System.Linq.Enumerable</code> (针对 LINQ to Objects) 或 <code>System.Linq.Queryable</code> (针对 LINQ to Entities) 类中的扩展方法。</p><h4 id="过滤" tabindex="-1"><a class="header-anchor" href="#过滤"><span>过滤</span></a></h4><p><strong><code>Where()</code></strong>: 根据指定条件筛选元素。</p><ul><li><strong>查询语法</strong>: <code>where &lt;condition&gt;</code></li><li><strong>方法语法</strong>: <code>.Where(item =&gt; condition)</code></li></ul><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">var usersOlderThan30 = users.Where(u =&gt; u.Age &gt; 30);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="投影" tabindex="-1"><a class="header-anchor" href="#投影"><span>投影</span></a></h4><p><strong><code>Select()</code></strong>: 转换元素的形状，选择特定属性或创建新对象。</p><ul><li><strong>查询语法</strong>: <code>select &lt;new_object_or_property&gt;</code></li><li><strong>方法语法</strong>: <code>.Select(item =&gt; new { /* new shape */ })</code></li></ul><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">// 只选择用户名</span>
<span class="line">var userNames = users.Select(u =&gt; u.Name);</span>
<span class="line"></span>
<span class="line">// 投影到匿名类型</span>
<span class="line">var userInfos = users.Select(u =&gt; new { u.Name, u.Email });</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="排序" tabindex="-1"><a class="header-anchor" href="#排序"><span>排序</span></a></h4><p><strong><code>OrderBy()</code> / <code>OrderByDescending()</code></strong>: 升序或降序排序。</p><p><strong><code>ThenBy()</code> / <code>ThenByDescending()</code></strong>: 对已排序的结果进行二级排序。</p><ul><li><strong>查询语法</strong>: <code>orderby &lt;expression&gt; [ascending/descending]</code></li></ul><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">var sortedUsers = users.OrderBy(u =&gt; u.Age).ThenByDescending(u =&gt; u.Name);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="分组" tabindex="-1"><a class="header-anchor" href="#分组"><span>分组</span></a></h4><p><strong><code>GroupBy()</code></strong>: 根据一个或多个键对元素进行分组。</p><ul><li><strong>查询语法</strong>: <code>group &lt;element&gt; by &lt;key_expression&gt;</code></li></ul><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">var usersByCity = users.GroupBy(u =&gt; u.City);</span>
<span class="line"></span>
<span class="line">foreach (var group in usersByCity)</span>
<span class="line">{</span>
<span class="line">    Console.WriteLine($&quot;Users in {group.Key}:&quot;);</span>
<span class="line">    foreach (var user in group)</span>
<span class="line">    {</span>
<span class="line">        Console.WriteLine($&quot;  - {user.Name}&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="连接" tabindex="-1"><a class="header-anchor" href="#连接"><span>连接</span></a></h4><p><strong><code>Join()</code></strong>: 将两个序列中的元素基于匹配的键进行关联。</p><ul><li><strong>查询语法</strong>: <code>join &lt;item_b&gt; in &lt;collection_b&gt; on &lt;key_a&gt; equals &lt;key_b&gt;</code></li></ul><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">var orders = new List&lt;Order&gt;(); // 假设 Order 有 UserId</span>
<span class="line">var usersWithOrders = users.Join(orders,</span>
<span class="line">                                 user =&gt; user.Id,       // 用户表的键</span>
<span class="line">                                 order =&gt; order.UserId, // 订单表的键</span>
<span class="line">                                 (user, order) =&gt; new { user.Name, order.OrderId }); // 组合结果</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="分区" tabindex="-1"><a class="header-anchor" href="#分区"><span>分区</span></a></h4><p><strong><code>Take()</code></strong>: 获取序列开头的指定数量的元素。</p><p><strong><code>Skip()</code></strong>: 跳过序列开头的指定数量的元素。</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">var firstFiveUsers = users.Take(5);</span>
<span class="line">var usersAfterFirstFive = users.Skip(5);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="聚合" tabindex="-1"><a class="header-anchor" href="#聚合"><span>聚合</span></a></h4><p><strong><code>Count()</code> / <code>LongCount()</code></strong>: 获取元素数量。</p><p><strong><code>Sum()</code></strong>: 计算数值的总和。</p><p><strong><code>Min()</code></strong>: 获取最小值。</p><p><strong><code>Max()</code></strong>: 获取最大值。</p><p><strong><code>Average()</code></strong>: 计算平均值。</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">var totalUsers = users.Count();</span>
<span class="line">var averageAge = users.Average(u =&gt; u.Age);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="元素操作" tabindex="-1"><a class="header-anchor" href="#元素操作"><span>元素操作</span></a></h4><p><strong><code>First()</code> / <code>FirstOrDefault()</code></strong>: 获取序列的第一个元素。<code>FirstOrDefault()</code> 在没有找到元素时返回默认值（引用类型为 null，值类型为 0 等）。</p><p><strong><code>Single()</code> / <code>SingleOrDefault()</code></strong>: 获取序列中唯一的元素。如果序列包含多个元素或没有元素，<code>Single()</code> 会抛出异常；<code>SingleOrDefault()</code> 在没有找到时返回默认值，找到多个时抛异常。</p><p><strong><code>Any()</code></strong>: 检查序列中是否有任何元素满足条件。</p><p><strong><code>All()</code></strong>: 检查序列中所有元素是否都满足条件。</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">var firstUser = users.FirstOrDefault();</span>
<span class="line">bool hasAdmins = users.Any(u =&gt; u.Role == &quot;Admin&quot;);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="延迟执行" tabindex="-1"><a class="header-anchor" href="#延迟执行"><span>延迟执行</span></a></h3><p>大多数 LINQ 查询操作符（如 <code>Where</code>、<code>Select</code>、<code>OrderBy</code>、<code>GroupBy</code>）都实现了<strong>延迟执行</strong>。这意味着：</p><ul><li>当你编写一个 LINQ 查询时，它<strong>不会立即执行</strong>。它只是构建了一个查询的定义或<strong>查询表达式树</strong>。</li><li>查询只有在<strong>实际需要结果时才会被执行</strong>。这通常发生在以下几种情况： <ul><li><strong>遍历结果时</strong>：例如，使用 <code>foreach</code> 循环。</li><li><strong>调用聚合方法时</strong>：例如 <code>Count()</code>、<code>Sum()</code>、<code>Average()</code>。</li><li><strong>调用转换方法时</strong>：例如 <code>ToList()</code>、<code>ToArray()</code>、<code>ToDictionary()</code>。</li></ul></li></ul><p><strong>优点：</strong></p><ul><li><strong>性能优化</strong>：只有在必要时才执行查询。如果查询结果从未使用，则不会产生开销。</li><li><strong>链式操作效率</strong>：可以多次追加 LINQ 操作符，所有操作都会在一次执行中合并，而不是每次操作都扫描数据。</li><li><strong>与数据库的集成</strong>：对于 LINQ to Entities (EF Core)，这意味着查询表达式树会被发送到数据库提供程序，由它<strong>一次性翻译成单个 SQL 查询</strong>并在数据库端执行，而不是分多次从数据库拉取数据到内存再处理。</li></ul><p>示例：延迟执行</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">List&lt;int&gt; numbers = new List&lt;int&gt; { 1, 2, 3, 4, 5 };</span>
<span class="line"></span>
<span class="line">Console.WriteLine(&quot;Defining query...&quot;);</span>
<span class="line">// 这里只是定义了查询，尚未执行</span>
<span class="line">var query = numbers.Where(n =&gt; n &gt; 2).Select(n =&gt; n * 10);</span>
<span class="line"></span>
<span class="line">Console.WriteLine(&quot;Query defined, not executed yet.&quot;);</span>
<span class="line"></span>
<span class="line">// 第一次执行：遍历</span>
<span class="line">Console.WriteLine(&quot;Executing query (first time)...&quot;);</span>
<span class="line">foreach (var item in query)</span>
<span class="line">{</span>
<span class="line">    Console.WriteLine(item);</span>
<span class="line">}</span>
<span class="line">// Output: 30, 40, 50</span>
<span class="line"></span>
<span class="line">// 在此期间，原始集合被修改</span>
<span class="line">numbers.Add(6);</span>
<span class="line">numbers.Add(7);</span>
<span class="line"></span>
<span class="line">// 第二次执行：再次遍历</span>
<span class="line">Console.WriteLine(&quot;Executing query (second time, after modification)...&quot;);</span>
<span class="line">foreach (var item in query)</span>
<span class="line">{</span>
<span class="line">    Console.WriteLine(item); // 结果会包含 60 和 70</span>
<span class="line">}</span>
<span class="line">// Output: 30, 40, 50, 60, 70 (因为查询是延迟执行的，每次执行都基于当前 numbers 集合)</span>
<span class="line"></span>
<span class="line">// 立即执行：使用 ToList()</span>
<span class="line">Console.WriteLine(&quot;Executing query immediately with ToList()...&quot;);</span>
<span class="line">var immediateResult = numbers.Where(n =&gt; n &gt; 2).Select(n =&gt; n * 10).ToList();</span>
<span class="line">// 此时查询已经执行并将结果存储在 immediateResult 中</span>
<span class="line"></span>
<span class="line">numbers.Add(8); // 此时再添加，不会影响 immediateResult</span>
<span class="line"></span>
<span class="line">Console.WriteLine(&quot;Immediate result:&quot;);</span>
<span class="line">foreach (var item in immediateResult)</span>
<span class="line">{</span>
<span class="line">    Console.WriteLine(item); // 结果不包含 80</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="linq与ef-core" tabindex="-1"><a class="header-anchor" href="#linq与ef-core"><span>LINQ与EF Core</span></a></h3><p>当你在 EF Core 中使用 LINQ 时，你使用的是 <strong>LINQ to Entities</strong>。它的工作原理是：</p><ol><li>你编写的 LINQ 查询会被 EF Core 转换为一个<strong>表达式树</strong>。</li><li>EF Core 的查询提供程序会<strong>解析这个表达式树</strong>。</li><li>将其<strong>翻译成相应的 SQL 语句</strong>。</li><li>将 SQL 语句发送到数据库执行。</li><li>从数据库获取结果，并将其<strong>物化 (materialize)</strong> 为 C# 实体对象。</li></ol><p><strong>关键概念</strong></p><ul><li><strong><code>IEnumerable&lt;T&gt;</code></strong>: 代表内存中的可迭代集合。<code>LINQ to Objects</code> 使用它。</li><li><strong><code>IQueryable&lt;T&gt;</code></strong>: 代表一个可查询的数据源。<code>LINQ to Entities</code>（以及其他 LINQ 提供程序，如 LINQ to SQL）使用它。</li></ul><p>当你在 EF Core 中通过 <code>DbContext.DbSet&lt;T&gt;</code> 启动查询时，例如 <code>context.Products</code>，它返回的是一个 <strong><code>IQueryable&lt;Product&gt;</code></strong>。</p><p>当你对 <code>IQueryable&lt;T&gt;</code> 应用 LINQ 操作符时（如 <code>Where()</code>、<code>OrderBy()</code>），它们会继续返回 <code>IQueryable&lt;T&gt;</code>，并且<strong>不执行数据库查询</strong>。只有当你执行了会触发查询的操作（如 <code>ToList()</code>、<code>FirstOrDefault()</code>、<code>Count()</code>）时，EF Core 才会生成 SQL 并与数据库交互。</p><p>示例:</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">using Microsoft.EntityFrameworkCore;</span>
<span class="line">using System.Linq;</span>
<span class="line">using System.Threading.Tasks;</span>
<span class="line"></span>
<span class="line">public class Product</span>
<span class="line">{</span>
<span class="line">    public int Id { get; set; }</span>
<span class="line">    public string Name { get; set; } = string.Empty;</span>
<span class="line">    public decimal Price { get; set; }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">public class MyDbContext : DbContext</span>
<span class="line">{</span>
<span class="line">    public DbSet&lt;Product&gt; Products { get; set; } = null!;</span>
<span class="line">    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =&gt;</span>
<span class="line">        optionsBuilder.UseSqlServer(&quot;YourConnectionString&quot;);</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">public async Task QueryProductsWithLinqToEntities()</span>
<span class="line">{</span>
<span class="line">    using (var context = new MyDbContext())</span>
<span class="line">    {</span>
<span class="line">        // 这是一个 IQueryable&lt;Product&gt;，此时没有执行数据库查询</span>
<span class="line">        var query = context.Products</span>
<span class="line">                           .Where(p =&gt; p.Price &gt; 50)</span>
<span class="line">                           .OrderBy(p =&gt; p.Name);</span>
<span class="line"></span>
<span class="line">        Console.WriteLine(&quot;Query defined for database, not executed yet.&quot;);</span>
<span class="line"></span>
<span class="line">        // 调用 ToListAsync() 会触发 SQL 查询并从数据库获取数据</span>
<span class="line">        Console.WriteLine(&quot;Executing database query...&quot;);</span>
<span class="line">        var expensiveProducts = await query.ToListAsync();</span>
<span class="line"></span>
<span class="line">        Console.WriteLine(&quot;Products fetched from database:&quot;);</span>
<span class="line">        foreach (var product in expensiveProducts)</span>
<span class="line">        {</span>
<span class="line">            Console.WriteLine($&quot;- {product.Name} (Price: {product.Price})&quot;);</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当上述代码执行时，EF Core 会将 <code>Where(p =&gt; p.Price &gt; 50).OrderBy(p =&gt; p.Name)</code> 翻译成一个 SQL <code>SELECT</code> 语句，其中包含 <code>WHERE Price &gt; 50</code> 和 <code>ORDER BY Name</code> 子句，并在数据库中执行一次。</p><hr><p>并非所有的 LINQ 操作符或复杂的表达式都能被 EF Core 翻译成 SQL：</p><ul><li><strong>服务器端求值 (Server-side Evaluation)</strong>：EF Core 尽可能地将查询翻译成 SQL，并在数据库服务器上执行。这是最高效的方式。</li><li><strong>客户端求值 (Client-side Evaluation)</strong>：如果 EF Core 无法将 LINQ 表达式翻译成 SQL，它会先从数据库中拉取数据到内存，然后<strong>在内存中</strong>执行剩余的 LINQ 操作。</li></ul><p><strong>什么时候会发生客户端求值？</strong></p><ul><li>当你使用 C# 特有的方法或逻辑，这些逻辑没有对应的 SQL 函数时（例如，某些复杂的字符串操作、自定义方法）。</li><li>当你明确调用 <code>AsEnumerable()</code> 或 <code>ToList()</code> 等方法，强制将数据拉取到内存后。</li></ul><p><strong>客户端求值的危害：</strong></p><ul><li><strong>性能问题</strong>：如果在大数据集上发生客户端求值，可能导致从数据库拉取<strong>大量不必要的数据</strong>到应用程序内存，造成网络I/O和内存开销。</li><li><strong>潜在错误</strong>：有时客户端求值可能导致意外的结果。</li></ul><p><strong>最佳实践</strong>：</p><ul><li><strong>尽量让查询在服务器端执行</strong>：这意味着尽量使用 EF Core 能够翻译成 SQL 的 LINQ 操作和表达式。</li><li><strong>监控日志</strong>：通过 EF Core 的日志，你可以看到生成的 SQL。如果发现 SQL 查询没有包含你预期过滤或排序，那可能就是发生了客户端求值。</li></ul><h2 id="部分类-方法" tabindex="-1"><a class="header-anchor" href="#部分类-方法"><span>部分类/方法</span></a></h2><h3 id="部分类" tabindex="-1"><a class="header-anchor" href="#部分类"><span>部分类</span></a></h3><p><strong>部分类</strong>允许你将一个类的定义分散到多个物理文件中。在编译时，这些分散的部分会被编译器合并成一个完整的类。</p><h4 id="语法-2" tabindex="-1"><a class="header-anchor" href="#语法-2"><span>语法</span></a></h4><p>要定义一个部分类，你需要在类的每个部分定义前面加上 <code>partial</code> 关键字。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// File: MyClass.Part1.cs</span>
<span class="line">public partial class MyClass</span>
<span class="line">{</span>
<span class="line">    public void Method1()</span>
<span class="line">    {</span>
<span class="line">        Console.WriteLine(&quot;Method1 from Part1&quot;);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public int Property1 { get; set; }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// File: MyClass.Part2.cs</span>
<span class="line">public partial class MyClass</span>
<span class="line">{</span>
<span class="line">    public void Method2()</span>
<span class="line">    {</span>
<span class="line">        Console.WriteLine(&quot;Method2 from Part2&quot;);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public string Property2 { get; set; }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// File: MyClass.Part3.cs</span>
<span class="line">public partial class MyClass</span>
<span class="line">{</span>
<span class="line">    public MyClass() // 构造函数也可以在任何部分定义</span>
<span class="line">    {</span>
<span class="line">        Console.WriteLine(&quot;MyClass instance created.&quot;);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public void CommonMethod()</span>
<span class="line">    {</span>
<span class="line">        Method1();</span>
<span class="line">        Method2();</span>
<span class="line">        Console.WriteLine(&quot;CommonMethod from Part3&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当编译上述代码时，C# 编译器会将所有带有 <code>partial</code> 关键字且名称相同的类定义合并成一个单一的 <code>MyClass</code> 类。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// 编译后，MyClass 看起来就像这样 (逻辑上)</span>
<span class="line">public class MyClass</span>
<span class="line">{</span>
<span class="line">    public MyClass()</span>
<span class="line">    {</span>
<span class="line">        Console.WriteLine(&quot;MyClass instance created.&quot;);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public void Method1()</span>
<span class="line">    {</span>
<span class="line">        Console.WriteLine(&quot;Method1 from Part1&quot;);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public int Property1 { get; set; }</span>
<span class="line"></span>
<span class="line">    public void Method2()</span>
<span class="line">    {</span>
<span class="line">        Console.WriteLine(&quot;Method2 from Part2&quot;);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public string Property2 { get; set; }</span>
<span class="line"></span>
<span class="line">    public void CommonMethod()</span>
<span class="line">    {</span>
<span class="line">        Method1();</span>
<span class="line">        Method2();</span>
<span class="line">        Console.WriteLine(&quot;CommonMethod from Part3&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用时，与普通类没有区别：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">MyClass obj = new MyClass();</span>
<span class="line">obj.Method1();</span>
<span class="line">obj.Method2();</span>
<span class="line">obj.CommonMethod();</span>
<span class="line">obj.Property1 = 10;</span>
<span class="line">obj.Property2 = &quot;Test&quot;;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="使用场景-1" tabindex="-1"><a class="header-anchor" href="#使用场景-1"><span>使用场景</span></a></h4><h5 id="多团队并行开发" tabindex="-1"><a class="header-anchor" href="#多团队并行开发"><span>多团队并行开发</span></a></h5><h5 id="代码生成器协作" tabindex="-1"><a class="header-anchor" href="#代码生成器协作"><span>代码生成器协作</span></a></h5><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">// 文件1：Form.Designer.cs（自动生成）</span>
<span class="line">public partial class MainForm</span>
<span class="line">{</span>
<span class="line">    private Button button1;</span>
<span class="line">    private void InitializeComponent() { /* 设计器代码 */ }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 文件2：Form.cs（手动编写）</span>
<span class="line">public partial class MainForm</span>
<span class="line">{</span>
<span class="line">    private void button1_Click(object sender, EventArgs e)</span>
<span class="line">    {</span>
<span class="line">        MessageBox.Show(&quot;Button clicked!&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="大型类的逻辑分组" tabindex="-1"><a class="header-anchor" href="#大型类的逻辑分组"><span>大型类的逻辑分组</span></a></h5><h4 id="注意事项" tabindex="-1"><a class="header-anchor" href="#注意事项"><span>注意事项</span></a></h4><ul><li><strong>所有部分都必须用 <code>partial</code> 关键字标记。</strong></li><li><strong>所有部分必须在同一个程序集和命名空间中。</strong></li><li><strong>访问修饰符必须一致</strong>：如果一个部分声明为 <code>public partial class MyClass</code>，那么所有其他部分也必须声明为 <code>public partial class MyClass</code>。</li><li><strong>基类和接口</strong>：如果一个部分声明了基类或接口，那么其他部分不能声明不同的基类。但是，其他部分可以声明额外的接口。最终的类会实现所有部分声明的接口。</li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// File 1</span>
<span class="line">public partial class MyClass : BaseClass, IInterface1 { }</span>
<span class="line">// File 2</span>
<span class="line">public partial class MyClass : IInterface2 { } // OK, 最终 MyClass 继承 BaseClass 并实现 IInterface1, IInterface2</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><strong>成员合并</strong>：所有字段、属性、方法、事件和构造函数等成员都会被合并。</li><li><strong>同一个成员不能在多个部分中定义</strong>：例如，你不能在 <code>MyClass.Part1.cs</code> 中定义 <code>Method1()</code>，又在 <code>MyClass.Part2.cs</code> 中定义一个同名的 <code>Method1()</code>。</li><li><strong>构造函数</strong>：可以定义在任何一个部分。如果定义了多个，它们会根据普通的构造函数重载规则进行合并。</li><li><strong>泛型参数</strong>：所有部分必须使用相同的泛型参数。</li></ul><h3 id="部分方法" tabindex="-1"><a class="header-anchor" href="#部分方法"><span>部分方法</span></a></h3><p>部分方法允许你在一个部分类中声明一个方法的签名，而在另一个部分类中选择性地提供其实现。</p><p>部分方法的主要目的是为了<strong>支持代码生成器</strong>。它们提供了一种<strong>钩子 (hook)</strong> 机制，让自动生成的代码可以调用由开发者手动实现的方法。</p><ul><li><strong>代码生成器集成</strong>：一个代码生成器可以生成一个调用部分方法的模板。如果开发者提供了该部分的实现，那么代码就会执行；如果没有提供，编译器会<strong>自动移除</strong>对该部分方法的所有调用，从而避免了未实现方法的编译错误和运行时开销。</li><li><strong>可选的行为</strong>：允许你定义一个方法，它在某些情况下（当有实现时）执行特定逻辑，而在其他情况下（当没有实现时）被完全忽略。</li></ul><h4 id="语法-3" tabindex="-1"><a class="header-anchor" href="#语法-3"><span>语法</span></a></h4><p>部分方法需要满足以下条件：</p><ul><li><strong>必须定义在 <code>partial class</code> 中。</strong></li><li><strong>方法声明必须是 <code>partial</code> 关键字。</strong></li><li><strong>必须是 <code>void</code> 返回类型。</strong> (C# 9.0 之后放宽了此限制，可以有非 <code>void</code> 返回类型，但必须有实现)</li><li><strong>不能有访问修饰符</strong>（隐式为 <code>private</code>）。</li><li><strong>必须是声明 (Declaration) 和实现 (Implementation) 分开。</strong> 声明只有方法签名，实现包含方法体。</li><li><strong>声明和实现可以在同一个部分类中，但通常在不同的部分类中。</strong></li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// File: MyClass.Generated.cs (由代码生成器生成)</span>
<span class="line">public partial class MyClass</span>
<span class="line">{</span>
<span class="line">    // 部分方法的声明 (没有方法体)</span>
<span class="line">    partial void OnInitialized(); // 必须是 void (C# 9.0之前)</span>
<span class="line"></span>
<span class="line">    public void Initialize()</span>
<span class="line">    {</span>
<span class="line">        Console.WriteLine(&quot;MyClass.Initialize() called by generated code.&quot;);</span>
<span class="line">        // 生成的代码在这里调用部分方法</span>
<span class="line">        OnInitialized(); // 如果没有实现，这行调用在编译时会被移除</span>
<span class="line">        Console.WriteLine(&quot;MyClass.Initialize() finished.&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// File: MyClass.UserCode.cs (由开发者手动编写)</span>
<span class="line">public partial class MyClass</span>
<span class="line">{</span>
<span class="line">    // 部分方法的实现 (可以有方法体)</span>
<span class="line">    partial void OnInitialized()</span>
<span class="line">    {</span>
<span class="line">        Console.WriteLine(&quot;OnInitialized() called from user code.&quot;);</span>
<span class="line">        // 这里可以添加自定义的初始化逻辑</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    // C# 9.0+ 允许非 void 返回值，但必须有实现</span>
<span class="line">    partial int GetConfigValue(string key);</span>
<span class="line"></span>
<span class="line">    // GetConfigValue 的实现</span>
<span class="line">    partial int GetConfigValue(string key)</span>
<span class="line">    {</span>
<span class="line">        if (key == &quot;Timeout&quot;) return 1000;</span>
<span class="line">        return 0;</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><strong>如果部分方法只有声明，没有实现</strong>：编译器会移除所有对该部分方法的调用。这意味着，即使你调用了 <code>OnInitialized()</code>，如果它的实现不存在，这行代码也会在编译时被优化掉，不会产生任何运行时开销。</li><li><strong>如果部分方法有实现</strong>：那么它就是一个普通的私有方法，其调用会正常执行。</li></ul><h4 id="使用场景-2" tabindex="-1"><a class="header-anchor" href="#使用场景-2"><span>使用场景</span></a></h4><h5 id="轻量级事件钩子" tabindex="-1"><a class="header-anchor" href="#轻量级事件钩子"><span>轻量级事件钩子</span></a></h5><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">// 文件1：Entity.Generated.cs（工具生成）</span>
<span class="line">public partial class Entity</span>
<span class="line">{</span>
<span class="line">    partial void OnCreated(); // 无实际实现</span>
<span class="line"></span>
<span class="line">    public Entity()</span>
<span class="line">    {</span>
<span class="line">        OnCreated(); // 如果开发者未实现，编译器会移除该调用</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 文件2：Entity.Extensions.cs（手动扩展）</span>
<span class="line">public partial class Entity</span>
<span class="line">{</span>
<span class="line">    partial void OnCreated()</span>
<span class="line">    {</span>
<span class="line">        Console.WriteLine(&quot;Entity created!&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="条件编译扩展" tabindex="-1"><a class="header-anchor" href="#条件编译扩展"><span>条件编译扩展</span></a></h5><p>利用<strong>预处理器指令 (Preprocessor Directives)</strong> 来控制源代码在编译时哪些部分被包含或排除。它允许你根据定义的符号 (symbols) 来编译不同的代码块，从而适应不同的构建配置、目标平台或特性集。</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">public partial class Logger</span>
<span class="line">{</span>
<span class="line">    partial void LogDebug(string message);</span>
<span class="line"></span>
<span class="line">    public void Log(string message)</span>
<span class="line">    {</span>
<span class="line">#if DEBUG</span>
<span class="line">        LogDebug(message); // 仅在DEBUG模式下生效</span>
<span class="line">#endif</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="注意事项-1" tabindex="-1"><a class="header-anchor" href="#注意事项-1"><span>注意事项</span></a></h4><ul><li><strong>必须定义在 <code>partial class</code> 中。</strong></li><li><strong>声明和实现都必须使用 <code>partial</code> 关键字。</strong></li><li><strong>访问修饰符</strong>：部分方法的声明和实现都不能有访问修饰符。它们隐式是 <code>private</code> 的。</li><li><strong>返回类型</strong>： <ul><li><strong>C# 9.0 之前</strong>：部分方法必须返回 <code>void</code>。</li><li><strong>C# 9.0 及以后</strong>：部分方法可以有非 <code>void</code> 返回类型，但<strong>如果是非 <code>void</code> 返回类型，则它必须有一个实现</strong>。如果没有实现，编译器会报错。</li></ul></li><li><strong>参数</strong>：部分方法的参数可以包含 <code>in</code>, <code>ref</code>, <code>out</code> 关键字。声明和实现中的参数签名必须完全匹配。</li><li><strong>静态/实例</strong>：部分方法可以是静态的，也可以是实例方法。</li><li><strong>泛型</strong>：部分方法可以是泛型方法。</li><li><strong>委托</strong>：不能直接将部分方法转换为委托，因为它在没有实现时可能被移除。</li><li><strong>不能是 <code>virtual</code>、<code>abstract</code>、<code>override</code>、<code>new</code>、<code>extern</code> 成员。</strong></li></ul>`,161)]))}const p=n(l,[["render",d]]),u=JSON.parse('{"path":"/dotnet/C_/basic.html","title":"C#语法","lang":"zh-CN","frontmatter":{"title":"C#语法","shortTitle":"语法","description":"C#语法","date":"2025-07-12T18:56:33.000Z","categories":[".NET","C#"],"tags":[".NET"]},"git":{"createdTime":1752450498000,"updatedTime":1754732279000,"contributors":[{"name":"Okita1027","username":"Okita1027","email":"96156298+Okita1027@users.noreply.github.com","commits":5,"url":"https://github.com/Okita1027"}]},"readingTime":{"minutes":21.64,"words":6491},"filePathRelative":"dotnet/C#/basic.md"}');export{p as comp,u as data};
