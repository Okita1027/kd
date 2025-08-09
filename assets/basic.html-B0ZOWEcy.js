import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as e,d as a,o as i}from"./app-CN29avzT.js";const l={};function d(c,n){return i(),e("div",null,n[0]||(n[0]=[a(`<h2 id="依赖注入" tabindex="-1"><a class="header-anchor" href="#依赖注入"><span>依赖注入</span></a></h2><h3 id="服务注册" tabindex="-1"><a class="header-anchor" href="#服务注册"><span>服务注册</span></a></h3><p><strong>常见注册方式：</strong></p><ul><li><code>AddSingleton&lt;TService, TImplementation&gt;()</code><ul><li><strong>生命周期：</strong> 单例。在整个应用程序的生命周期中只创建一次实例。</li><li><strong>适用场景：</strong> 无状态服务、配置对象、缓存服务等。</li></ul></li><li><code>AddScoped&lt;TService, TImplementation&gt;()</code><ul><li><strong>生命周期：</strong> 作用域。在每个请求（例如，Web 请求）或每个作用域内只创建一次实例。</li><li><strong>适用场景：</strong> 与特定请求相关的服务，如数据库上下文（DbContext）。</li></ul></li><li><code>AddTransient&lt;TService, TImplementation&gt;()</code><ul><li><strong>生命周期：</strong> 瞬时。每次请求该服务时都会创建一个新的实例。</li><li><strong>适用场景：</strong> 轻量级、无状态的服务，每次使用都需要新实例的场景。</li></ul></li></ul><blockquote><p>在使用<code>builder.Services.AddTransient&lt;IMyService, MyService&gt;()</code>注册服务后，注入时必须使用<code>IMyService</code>，若使用<code>MyService</code>则会报错。</p><p><strong>不推荐</strong>的注册方式：可以忽略接口，直接注入实现类<code>AddScoped&lt;TImplementation&gt;</code></p></blockquote><h3 id="服务消费" tabindex="-1"><a class="header-anchor" href="#服务消费"><span>服务消费</span></a></h3><h4 id="构造函数注入" tabindex="-1"><a class="header-anchor" href="#构造函数注入"><span>构造函数注入</span></a></h4><p>这是推荐和最常用的方式。DI 容器会在创建对象时自动解析其构造函数中声明的依赖项。</p><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">//如果是Razor页面，继承的应该是PageModel</span>
<span class="line">public class MyController : Controller</span>
<span class="line">{</span>
<span class="line">    private readonly IMyService _myService;</span>
<span class="line"></span>
<span class="line">    public MyController(IMyService myService) // 构造函数注入</span>
<span class="line">    {</span>
<span class="line">        _myService = myService;</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="方法注入" tabindex="-1"><a class="header-anchor" href="#方法注入"><span>方法注入</span></a></h4><p>将依赖项作为方法参数传递。适用于某个方法需要特定依赖项，但整个类不需要的情况。</p><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">public class MyClass</span>
<span class="line">{</span>
<span class="line">    public void DoWork(ILogger logger)</span>
<span class="line">    {</span>
<span class="line">        logger.LogInformation(&quot;Doing work.&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="属性注入" tabindex="-1"><a class="header-anchor" href="#属性注入"><span>属性注入</span></a></h4><p>通过公共属性注入依赖项。通常需要手动从容器中解析，或者使用特定的IOC容器扩展。在 .NET 的内置 DI 中不直接支持属性注入，除非手动从 <code>IServiceProvider</code> 解析。</p><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">// 不推荐的方式</span>
<span class="line">public class MyClass</span>
<span class="line">{</span>
<span class="line">    public IMyService MyService { get; set; } // 属性</span>
<span class="line">}</span>
<span class="line">// 然后在某处手动解析并赋值</span>
<span class="line">// myClass.MyService = serviceProvider.GetService&lt;IMyService&gt;();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="iserviceprovider" tabindex="-1"><a class="header-anchor" href="#iserviceprovider"><span>IServiceProvider</span></a></h3><p><code>IServiceProvider</code> 是 DI 容器的核心接口，它提供了获取服务实例的能力。</p><ul><li><strong><code>GetService&lt;TService&gt;()</code>：</strong> 获取服务的实例。如果服务未注册或无法解析，则返回 <code>null</code>。</li><li><strong><code>GetRequiredService&lt;TService&gt;()</code>：</strong> 获取服务的实例。如果服务未注册或无法解析，则抛出异常。</li></ul><p>通常不建议直接在应用程序代码中频繁使用 <code>IServiceProvider</code> 进行服务定位（Service Location），因为这会降低代码的解耦性。它主要用于框架内部、需要动态解析服务的场景，或者在 <code>Program.cs</code> (或 <code>Startup.cs</code>) 中配置依赖时。</p><h3 id="处理多个实现类的服务注册" tabindex="-1"><a class="header-anchor" href="#处理多个实现类的服务注册"><span>处理多个实现类的服务注册</span></a></h3><h4 id="默认注册-后注册的会覆盖先注册的" tabindex="-1"><a class="header-anchor" href="#默认注册-后注册的会覆盖先注册的"><span>默认注册（后注册的会覆盖先注册的）</span></a></h4><p>如果简单地多次注册同一个接口，<strong>后注册的实现会覆盖先注册的实现。</strong> 在这种情况下，只有最后注册的那个会被解析。</p><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">// Program.cs</span>
<span class="line">builder.Services.AddTransient&lt;IMyService, MyServiceA&gt;(); // MyServiceA 被注册</span>
<span class="line">builder.Services.AddTransient&lt;IMyService, MyServiceB&gt;(); // MyServiceB 覆盖了 MyServiceA</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种情况下，任何依赖 <code>IMyService</code> 的构造函数都会得到 <code>MyServiceB</code> 的实例。</p><h4 id="注册所有实现-通过-ienumerable-t-解析" tabindex="-1"><a class="header-anchor" href="#注册所有实现-通过-ienumerable-t-解析"><span>注册所有实现，通过 <code>IEnumerable&lt;T&gt;</code> 解析</span></a></h4><p>如果想解析<strong>所有注册的 <code>IMyService</code> 实现</strong>，可以将它们全部注册，然后在需要的地方注入 <code>IEnumerable&lt;IMyService&gt;</code>。</p><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">// Program.cs</span>
<span class="line">builder.Services.AddTransient&lt;IMyService, MyServiceA&gt;();</span>
<span class="line">builder.Services.AddTransient&lt;IMyService, MyServiceB&gt;();</span>
<span class="line"></span>
<span class="line">// ... 然后在消费者类中这样注入：</span>
<span class="line">public class MyConsumer</span>
<span class="line">{</span>
<span class="line">    private readonly IEnumerable&lt;IMyService&gt; _services;</span>
<span class="line"></span>
<span class="line">    public MyConsumer(IEnumerable&lt;IMyService&gt; services) // 注入所有实现</span>
<span class="line">    {</span>
<span class="line">        _services = services;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public void ExecuteAll()</span>
<span class="line">    {</span>
<span class="line">        foreach (var service in _services)</span>
<span class="line">        {</span>
<span class="line">            service.DoSomething(); // 会依次调用 MyServiceA 和 MyServiceB 的 DoSomething</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在有用到 策略模式 的场景，需要根据运行时条件选择执行哪个服务，或者需要对所有注册的服务执行某个操作。</p><h4 id="按照名称注入" tabindex="-1"><a class="header-anchor" href="#按照名称注入"><span>按照名称注入</span></a></h4><h5 id="手动实现工厂模式" tabindex="-1"><a class="header-anchor" href="#手动实现工厂模式"><span>手动实现工厂模式</span></a></h5><p>手动注册一个 Func&lt;string, IService&gt;，在它内部根据名称返回不同实现。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// 假设您需要一个工厂来提供命名服务</span>
<span class="line">public interface IMyServiceFactory</span>
<span class="line">{</span>
<span class="line">    IMyService GetService(string name);</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">public class MyServiceFactory : IMyServiceFactory</span>
<span class="line">{</span>
<span class="line">    private readonly IServiceProvider _serviceProvider; // 可以注入 IServiceProvider 来手动获取服务</span>
<span class="line"></span>
<span class="line">    public MyServiceFactory(IServiceProvider serviceProvider)</span>
<span class="line">    {</span>
<span class="line">        _serviceProvider = serviceProvider;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public IMyService GetService(string name)</span>
<span class="line">    {</span>
<span class="line">        return name switch</span>
<span class="line">        {</span>
<span class="line">            &quot;ServiceA&quot; =&gt; _serviceProvider.GetRequiredService&lt;MyServiceA&gt;(),</span>
<span class="line">            &quot;ServiceB&quot; =&gt; _serviceProvider.GetRequiredService&lt;MyServiceB&gt;(),</span>
<span class="line">            _ =&gt; throw new ArgumentException(&quot;Unknown service name&quot;)</span>
<span class="line">        };</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// Program.cs</span>
<span class="line">builder.Services.AddTransient&lt;MyServiceA&gt;(); // 先注册具体类型</span>
<span class="line">builder.Services.AddTransient&lt;MyServiceB&gt;();</span>
<span class="line">builder.Services.AddSingleton&lt;IMyServiceFactory, MyServiceFactory&gt;(); // 注册工厂</span>
<span class="line"></span>
<span class="line">// ... 然后在消费者类中这样注入和使用：</span>
<span class="line">public class MyConsumerWithNamedService</span>
<span class="line">{</span>
<span class="line">    private readonly IMyServiceFactory _factory;</span>
<span class="line"></span>
<span class="line">    public MyConsumerWithNamedService(IMyServiceFactory factory)</span>
<span class="line">    {</span>
<span class="line">        _factory = factory;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public void UseServiceA()</span>
<span class="line">    {</span>
<span class="line">        _factory.GetService(&quot;ServiceA&quot;).DoSomething();</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p>接口和实现类：</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">public interface IMessageSender</span>
<span class="line">{</span>
<span class="line">    void Send(string message);</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">public class EmailSender : IMessageSender</span>
<span class="line">{</span>
<span class="line">    public void Send(string message) =&gt; Console.WriteLine($&quot;Email: {message}&quot;);</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">public class SmsSender : IMessageSender</span>
<span class="line">{</span>
<span class="line">    public void Send(string message) =&gt; Console.WriteLine($&quot;SMS: {message}&quot;);</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注册服务：</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">builder.Services.AddTransient&lt;EmailSender&gt;();</span>
<span class="line">builder.Services.AddTransient&lt;SmsSender&gt;();</span>
<span class="line"></span>
<span class="line">builder.Services.AddTransient&lt;Func&lt;string, IMessageSender&gt;&gt;(serviceProvider =&gt; key =&gt;</span>
<span class="line">{</span>
<span class="line">    return key switch</span>
<span class="line">    {</span>
<span class="line">        &quot;email&quot; =&gt; serviceProvider.GetRequiredService&lt;EmailSender&gt;(),</span>
<span class="line">        &quot;sms&quot; =&gt; serviceProvider.GetRequiredService&lt;SmsSender&gt;(),</span>
<span class="line">        _ =&gt; throw new ArgumentException(&quot;Invalid message sender type&quot;)</span>
<span class="line">    };</span>
<span class="line">});</span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用示例：</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">public class MyController</span>
<span class="line">{</span>
<span class="line">    private readonly IMessageSender _sender;</span>
<span class="line"></span>
<span class="line">    public MyController(Func&lt;string, IMessageSender&gt; senderFactory)</span>
<span class="line">    {</span>
<span class="line">        _sender = senderFactory(&quot;sms&quot;); // 或 &quot;email&quot;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public void Notify()</span>
<span class="line">    {</span>
<span class="line">        _sender.Send(&quot;Hello!&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="使用-namedserviceprovider-自定义容器-封装一层" tabindex="-1"><a class="header-anchor" href="#使用-namedserviceprovider-自定义容器-封装一层"><span>使用 NamedServiceProvider 自定义容器（封装一层）</span></a></h5><p>手动维护一个字典，把实现类按名称注册起来，适合多个实例的场景。</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">public class NamedServiceProvider&lt;T&gt;</span>
<span class="line">{</span>
<span class="line">    private readonly IServiceProvider _serviceProvider;</span>
<span class="line">    private readonly Dictionary&lt;string, Type&gt; _namedServices;</span>
<span class="line"></span>
<span class="line">    public NamedServiceProvider(IServiceProvider serviceProvider)</span>
<span class="line">    {</span>
<span class="line">        _serviceProvider = serviceProvider;</span>
<span class="line">        _namedServices = new()</span>
<span class="line">        {</span>
<span class="line">            [&quot;email&quot;] = typeof(EmailSender),</span>
<span class="line">            [&quot;sms&quot;] = typeof(SmsSender)</span>
<span class="line">        };</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public T Get(string name)</span>
<span class="line">    {</span>
<span class="line">        if (_namedServices.TryGetValue(name, out var type))</span>
<span class="line">        {</span>
<span class="line">            return (T)_serviceProvider.GetRequiredService(type);</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        throw new KeyNotFoundException($&quot;No service registered with the name &#39;{name}&#39;&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>Program.cs</code>注册</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">builder.Services.AddTransient&lt;EmailSender&gt;();</span>
<span class="line">builder.Services.AddTransient&lt;SmsSender&gt;();</span>
<span class="line">builder.Services.AddSingleton&lt;NamedServiceProvider&lt;IMessageSender&gt;&gt;();</span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="生命周期" tabindex="-1"><a class="header-anchor" href="#生命周期"><span>生命周期</span></a></h3><table><thead><tr><th>生命周期</th><th>方法</th><th>含义</th></tr></thead><tbody><tr><td>Singleton</td><td><code>AddSingleton&lt;T&gt;()</code></td><td>全局唯一实例，应用整个生命周期共享</td></tr><tr><td>Scoped</td><td><code>AddScoped&lt;T&gt;()</code></td><td>每个请求（或组件作用域）创建一个实例</td></tr><tr><td>Transient</td><td><code>AddTransient&lt;T&gt;()</code></td><td>每次请求服务时创建新实例</td></tr></tbody></table><h3 id="使用流程" tabindex="-1"><a class="header-anchor" href="#使用流程"><span>使用流程</span></a></h3><ol><li><p>定义要交给容器管理的接口与实现类</p></li><li><p>在主启动类中进行注册<code>builder.Services.Add生命周期&lt;接口，实现类&gt;</code></p><blockquote><p>可以忽略接口，直接注入实现类，但不推荐这么做</p></blockquote></li><li><p>在要使用注入的类的构造函数中进行声明</p></li></ol><h2 id="本机aot" tabindex="-1"><a class="header-anchor" href="#本机aot"><span>本机AOT</span></a></h2><h4 id="定义" tabindex="-1"><a class="header-anchor" href="#定义"><span>定义</span></a></h4><ul><li>传统：.NET 应用程序发布后包含的是<strong>中间语言 (IL) 代码</strong>。当这些应用在用户电脑上运行时，需要安装 .NET 运行时环境 (CLR)。CLR 中的 <strong>JIT (Just-In-Time) 编译器</strong>会在运行时将 IL 代码动态编译成机器码。</li><li>本机AOT：在<strong>应用程序发布时</strong>，直接将 .NET 代码（包括您自己的代码和应用程序用到的 .NET 运行时组件）编译成<strong>平台特定的、独立的机器码</strong>。最终产物是一个可以直接在目标操作系统上运行的单一可执行文件。</li></ul><h4 id="作用" tabindex="-1"><a class="header-anchor" href="#作用"><span>作用</span></a></h4><ul><li><strong>启动速度飞快：</strong> 代码已经预编译成机器码，省去了 JIT 编译的开销，应用程序启动时间大大缩短。这对于<strong>命令行工具、无服务器函数（Serverless Functions）和微服务冷启动</strong>等场景至关重要。</li><li><strong>内存占用更低：</strong> AOT 编译通常能进行更激进的优化，并移除未使用的框架代码，从而减少运行时内存消耗。这在<strong>资源受限的容器环境</strong>中非常有益。</li><li><strong>部署包更小：</strong> 尽管可执行文件包含了必要的运行时组件，但因为它去除了 JIT 编译器和许多不必要的框架部分，最终生成的单个文件通常比传统的“自包含”部署方式（包含完整的 JIT 和运行时库）要小。</li><li><strong>部署更简便：</strong> 只有一个文件，部署和分发变得异常简单。您无需担心目标机器上是否安装了正确版本的 .NET 运行时。</li><li><strong>更高的安全性：</strong> 不包含 JIT 编译器可以减少某些潜在的攻击面。</li></ul><h4 id="适用场景" tabindex="-1"><a class="header-anchor" href="#适用场景"><span>适用场景</span></a></h4><p><strong>适用：</strong></p><ul><li><strong>对启动速度有严格要求</strong>的应用：如高性能 Web API 的微服务（尤其是在云上，冷启动时间很重要）、Serverless 函数。</li><li><strong>对内存占用有严格要求</strong>的应用：如部署在 Docker 容器、Kubernetes 集群中的微服务。</li><li><strong>需要极简部署</strong>的应用：如命令行工具、单个可执行文件的桌面应用。</li><li><strong>资源受限的环境：</strong> 例如物联网 (IoT) 设备。</li></ul><p><strong>不推荐：</strong></p><ul><li><p><strong>依赖大量运行时动态特性</strong>的应用：</p><ul><li><p><strong>反射：</strong> 如果您的代码或依赖库大量使用反射来动态创建类型、方法调用（如通过 <code>Activator.CreateInstance</code> 或动态调用私有成员）。</p></li><li><p><strong>动态代码生成：</strong> 使用 <code>System.Reflection.Emit</code> 命名空间下的功能。</p></li><li><p><strong><code>dynamic</code> 关键字：</strong> 不支持。</p></li><li><p><strong>运行时加载外部程序集：</strong> 比如插件系统。</p></li><li><p><strong>依赖第三方库：</strong> 某些第三方库可能没有完全兼容 AOT，或者其内部使用了 AOT 不支持的动态特性。</p></li></ul></li><li><p><strong>项目编译时间要求严格</strong>：AOT 编译过程比 JIT 耗时更长。</p></li><li><p><strong>需要调试本机代码</strong>：调试 AOT 编译后的程序比调试 IL 代码要复杂。</p></li><li><p><strong>开发迭代频繁</strong>且<strong>部署环境变化大</strong>：每次针对不同平台发布，都需要重新编译。</p></li></ul><h4 id="使用方法" tabindex="-1"><a class="header-anchor" href="#使用方法"><span>使用方法</span></a></h4><blockquote><p>版本：.NET 8.0</p></blockquote><ol><li>配置<code>.csproj</code></li></ol><div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre><code class="language-xml"><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Project</span> <span class="token attr-name">Sdk</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>Microsoft.NET.Sdk.Web<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span></span>
<span class="line">  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>PropertyGroup</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">    <span class="token comment">&lt;!-- 添加行 --&gt;</span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>PublishAot</span><span class="token punctuation">&gt;</span></span>true<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>PublishAot</span><span class="token punctuation">&gt;</span></span> </span>
<span class="line">  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>PropertyGroup</span><span class="token punctuation">&gt;</span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Project</span><span class="token punctuation">&gt;</span></span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>发布命令</li></ol><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">dotnet publish <span class="token parameter variable">-c</span> Release <span class="token parameter variable">-r</span> win-x64 --self-contained <span class="token boolean">true</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><ul><li><p><code>-c Release</code>：指定以 Release 配置发布，以便进行优化。</p></li><li><p><code>-r &lt;RID&gt;</code>：指定<strong>目标运行时标识符</strong>。这是最重要的部分，它告诉 .NET 您要为哪个操作系统和 CPU 架构编译。常见的 RID 包括：</p><ul><li><p><code>win-x64</code> (Windows 64位)</p></li><li><p><code>linux-x64</code> (Linux 64位)</p></li><li><p><code>osx-arm64</code> (macOS M1/M2 芯片)</p></li><li><p><code>linux-arm64</code> (ARM64 Linux)</p></li></ul></li><li><p><code>--self-contained true</code>：这个标志是必需的，它确保生成的可执行文件包含了所有必要的 .NET 运行时组件，成为一个独立的应用程序。</p></li></ul><p>执行完毕后，可以在项目的 <code>bin/Release/net8.0/&lt;RID&gt;/publish/</code> 文件夹下找到编译好的单一可执行文件。</p><h2 id="中间件" tabindex="-1"><a class="header-anchor" href="#中间件"><span>中间件</span></a></h2><h3 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h3><p><strong>定义：</strong> 中间件是构成 ASP.NET Core 应用程序请求管道的软件组件。</p><p><strong>功能：</strong> 每个中间件都负责处理特定的任务，例如：</p><ul><li>处理静态文件（CSS、JS、图片）。</li><li>将 HTTP 请求重定向到 HTTPS。</li><li>进行用户认证（识别用户是谁）。</li><li>进行用户授权（判断用户是否有权限）。</li><li>记录日志。</li><li>处理错误。</li><li>路由请求到特定的控制器、Razor Pages 或 Blazor 组件。</li></ul><p><strong>链式处理：</strong> 中间件按照你在 <code>Program.cs</code> 中定义的顺序排列成一个链条（或管道）。请求从链条的一端进入，依次经过每个中间件，直到某个中间件处理并生成响应，或者到达终结点（Endpoint）。</p><hr><p><strong>工作原理</strong></p><p>想象一个请求从浏览器发出，到达您的 ASP.NET Core 应用：</p><ol><li><strong>请求进入：</strong> HTTP 请求首先到达管道中的第一个中间件。</li><li><strong>前置处理：</strong> 第一个中间件执行其逻辑（例如，检查请求头）。</li><li><strong>传递控制：</strong> 如果这个中间件需要将请求继续传递给下一个中间件，它会调用 <code>_next(context)</code>。</li><li><strong>循环往复：</strong> 请求会这样依次经过管道中的所有中间件，直到到达一个“终结点中间件”（例如，路由中间件找到一个控制器或 Razor Page，并将其执行）。</li><li><strong>生成响应：</strong> 终结点生成响应。</li><li><strong>后置处理：</strong> 响应会沿着管道<strong>反向</strong>流回，途经之前请求流经的每个中间件，执行它们在 <code>_next(context)</code> <strong>之后</strong>的逻辑（例如，记录响应状态、压缩响应）。</li><li><strong>响应返回：</strong> 响应最终返回给客户端。</li></ol><p>如果某个中间件决定自己处理并生成响应（例如，<code>UseExceptionHandler</code> 捕获到错误并显示错误页面，或者 <code>UseStaticFiles</code> 找到了一个静态文件），它就不会调用 <code>_next(context)</code>。这会<strong>短路 (Short-Circuit)</strong> 管道，请求不会再往下传递，响应会直接流回。</p><hr><p><strong>常见的中间件</strong></p><ul><li><strong><code>app.UseExceptionHandler(&quot;/Error&quot;)</code>：</strong> 捕获应用程序中的未处理异常，并将其重定向到指定的错误处理路径。</li><li><strong><code>app.UseHttpsRedirection()</code>：</strong> 强制将所有 HTTP 请求重定向到 HTTPS。</li><li><strong><code>app.UseStaticFiles()</code>：</strong> 启用静态文件服务，允许客户端访问 <code>wwwroot</code> 文件夹中的 CSS、JavaScript、图片等文件。</li><li><strong><code>app.UseRouting()</code>：</strong> 根据定义的路由（如 <code>MapGet</code>, <code>MapControllers</code>, <code>MapRazorPages</code>），将请求路由到正确的处理程序。</li><li><strong><code>app.UseAuthentication()</code>：</strong> 识别当前请求的用户身份。</li><li><strong><code>app.UseAuthorization()</code>：</strong> 检查用户是否有权限访问请求的资源。</li><li><strong><code>app.UseAntiforgery()</code>：</strong> 防止跨站请求伪造 (CSRF) 攻击。</li></ul><hr><h3 id="自定义中间件" tabindex="-1"><a class="header-anchor" href="#自定义中间件"><span>自定义中间件</span></a></h3><ol><li><p>创建中间件类</p><p>一个自定义中间件通常是一个公共类，它满足以下条件：</p><ul><li><strong>构造函数：</strong> 接收一个 <code>RequestDelegate</code> 类型的参数，命名为 <code>next</code>。这个 <code>next</code> 委托代表了管道中的下一个中间件。</li><li><strong><code>Invoke</code> 方法：</strong> 包含中间件的核心逻辑。它必须是 <code>public</code>、<code>async</code>，并返回 <code>Task</code>，接收 <code>HttpContext</code> 作为参数。</li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public class MyCustomLoggingMiddleware</span>
<span class="line">{</span>
<span class="line">    private readonly RequestDelegate _next;</span>
<span class="line">    private readonly ILogger&lt;MyCustomLoggingMiddleware&gt; _logger;</span>
<span class="line"></span>
<span class="line">    public MyCustomLoggingMiddleware(RequestDelegate next, ILogger&lt;MyCustomLoggingMiddleware&gt; logger)</span>
<span class="line">    {</span>
<span class="line">        _next = next;</span>
<span class="line">        _logger = logger;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public async Task InvokeAsync(HttpContext context)</span>
<span class="line">    {</span>
<span class="line">        // --- 请求进入管道时的逻辑 (前置处理) ---</span>
<span class="line">        _logger.LogInformation($&quot;Request START: {context.Request.Method} {context.Request.Path}&quot;);</span>
<span class="line"></span>
<span class="line">        // 将请求传递给管道中的下一个中间件</span>
<span class="line">        await _next(context);</span>
<span class="line"></span>
<span class="line">        // --- 响应离开管道时的逻辑 (后置处理) ---</span>
<span class="line">        _logger.LogInformation($&quot;Request END: {context.Request.Method} {context.Request.Path} - Status Code: {context.Response.StatusCode}&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>将中间件添加到请求管道</p><ul><li>方式1：直接使用<code>UseMiddleware&lt;T&gt;()</code></li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">// ...</span>
<span class="line">var app = builder.Build();</span>
<span class="line"></span>
<span class="line">// 在这里添加你的自定义中间件</span>
<span class="line">app.UseMiddleware&lt;MyCustomLoggingMiddleware&gt;();</span>
<span class="line"></span>
<span class="line">// ... 其他框架中间件 (如 UseStaticFiles, UseRouting, UseAuthentication, UseAuthorization) ...</span>
<span class="line"></span>
<span class="line">app.MapGet(&quot;/&quot;, () =&gt; &quot;Hello World!&quot;); // 终结点</span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>方式2：使用扩展方法</p><blockquote><p>为了代码的简洁性和可重用性，通常会为自定义中间件创建一个扩展方法。<em>推荐此方法</em></p></blockquote><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// 在一个单独的静态文件 (例如 Extensions/MyMiddlewareExtensions.cs)</span>
<span class="line">public static class MyMiddlewareExtensions</span>
<span class="line">{</span>
<span class="line">    public static IApplicationBuilder UseMyCustomLogging(this IApplicationBuilder builder)</span>
<span class="line">    {</span>
<span class="line">        return builder.UseMiddleware&lt;MyCustomLoggingMiddleware&gt;();</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">// ...</span>
<span class="line">var app = builder.Build();</span>
<span class="line"></span>
<span class="line">// 使用你的扩展方法添加中间件</span>
<span class="line">app.UseMyCustomLogging(); // 看起来更简洁</span>
<span class="line"></span>
<span class="line">// ... 其他框架中间件 ...</span>
<span class="line"></span>
<span class="line">app.MapGet(&quot;/&quot;, () =&gt; &quot;Hello World!&quot;);</span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul></li></ol><h3 id="中间件的执行顺序" tabindex="-1"><a class="header-anchor" href="#中间件的执行顺序"><span>中间件的执行顺序</span></a></h3><p>中间件的执行是<strong>顺序依赖</strong>的：</p><ol><li><strong>功能依赖：</strong> 某些中间件需要其他中间件已经完成工作才能正常运行。比如，<strong>授权 (Authorization)</strong> 中间件必须在 <strong>认证 (Authentication)</strong> 中间件之后，因为它需要知道用户是谁（认证的结果）才能判断用户是否有权限。</li><li><strong>效率：</strong> 放在前面的中间件如果能短路请求（比如 <code>UseStaticFiles</code>），就能避免后面的复杂逻辑（如路由、控制器执行）被不必要的触发，从而提高效率。</li><li><strong>安全性：</strong> 像错误处理、HTTPS 重定向等安全相关的中间件，通常需要放在非常靠前的位置，以便能尽早介入并处理问题。</li></ol><p>典型的中间件顺序：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">var builder = WebApplication.CreateBuilder(args);</span>
<span class="line">// 1. 服务注册 (builder.Services.Add...) - 提前完成所有依赖注入的配置</span>
<span class="line">// ...</span>
<span class="line"></span>
<span class="line">var app = builder.Build();</span>
<span class="line"></span>
<span class="line">// --- HTTP 请求管道开始 ---</span>
<span class="line"></span>
<span class="line">// 2. 异常/错误处理 (Error Handling) - 最早介入，捕获所有后续错误</span>
<span class="line">// 必须放在管道的最前面，这样它才能捕获到后面所有中间件的异常。</span>
<span class="line">if (app.Environment.IsDevelopment())</span>
<span class="line">{</span>
<span class="line">    app.UseDeveloperExceptionPage(); // 开发环境显示详细错误页面</span>
<span class="line">    // 或者您之前看到的 app.UseMigrationsEndPoint(); 在开发环境显示迁移UI</span>
<span class="line">}</span>
<span class="line">else</span>
<span class="line">{</span>
<span class="line">    app.UseExceptionHandler(&quot;/Error&quot;); // 生产环境显示友好错误页面</span>
<span class="line">    app.UseHsts(); // 强制使用 HTTPS</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 3. HTTPS 重定向 (HTTPS Redirection) - 确保安全连接</span>
<span class="line">// 任何 HTTP 请求都会被重定向到 HTTPS。</span>
<span class="line">app.UseHttpsRedirection();</span>
<span class="line"></span>
<span class="line">// 4. 静态文件服务 (Static Files) - 快速响应静态资源</span>
<span class="line">// 如果请求的是静态文件（如 .html, .css, .js, 图片），则直接返回并短路管道，无需执行后续复杂逻辑。</span>
<span class="line">app.UseStaticFiles();</span>
<span class="line"></span>
<span class="line">// 5. Cookie 策略 (Cookie Policy) - 管理 Cookie 行为 (如果需要)</span>
<span class="line">// app.UseCookiePolicy(); // 示例：处理 GDPR 同意、Cookie 安全属性</span>
<span class="line"></span>
<span class="line">// 6. 路由 (Routing) - 决定请求去哪里</span>
<span class="line">// 必须放在认证和授权之前，因为它会解析路由信息，并将终结点信息附加到 HttpContext 上，</span>
<span class="line">// 供后续的认证和授权中间件使用。</span>
<span class="line">app.UseRouting();</span>
<span class="line"></span>
<span class="line">// 7. CORS (Cross-Origin Resource Sharing) - 处理跨域请求 (如果需要)</span>
<span class="line">// 必须在 UseAuthentication/UseAuthorization 之前，但在 UseRouting 之后，</span>
<span class="line">// 因为它可能需要知道目标终结点的信息。</span>
<span class="line">// app.UseCors();</span>
<span class="line"></span>
<span class="line">// 8. 认证 (Authentication) - 识别用户身份 (Who is the user?)</span>
<span class="line">// 解析用户的身份凭证（如 Cookie、JWT Token），并将用户身份附加到 HttpContext.User 上。</span>
<span class="line">// 它不会拒绝请求，只是设置用户身份。</span>
<span class="line">app.UseAuthentication();</span>
<span class="line"></span>
<span class="line">// 9. 授权 (Authorization) - 判断用户权限 (Can the user do this?)</span>
<span class="line">// 根据用户身份和定义好的策略，判断用户是否有权限访问请求的资源。如果无权，则拒绝请求。</span>
<span class="line">app.UseAuthorization();</span>
<span class="line"></span>
<span class="line">// 10. 会话 (Session) - 管理用户会话状态 (如果需要)</span>
<span class="line">// app.UseSession();</span>
<span class="line"></span>
<span class="line">// 11. 缓存 (Caching) 和压缩 (Compression) - 优化响应 (如果需要)</span>
<span class="line">// 通常在授权之后，因为它们处理的是响应内容。</span>
<span class="line">// app.UseResponseCaching();</span>
<span class="line">// app.UseResponseCompression();</span>
<span class="line"></span>
<span class="line">// 12. 终结点映射 (Endpoint Mapping) - 实际执行业务逻辑</span>
<span class="line">// 这是管道的“末端”，请求到达这里后，会被路由到控制器、Razor Pages、Minimal API 或 Blazor 组件，</span>
<span class="line">// 从而执行具体的业务逻辑并生成响应。</span>
<span class="line">app.MapRazorPages();</span>
<span class="line">app.MapControllers(); // 或 app.MapDefaultControllerRoute();</span>
<span class="line">app.MapGet(&quot;/api/hello&quot;, () =&gt; &quot;Hello from API!&quot;);</span>
<span class="line">app.MapRazorComponents&lt;App&gt;(); // 如果有 Blazor</span>
<span class="line"></span>
<span class="line">// 13. 防伪造 (Anti-forgery) - 保护表单/交互式组件 (如果有表单或 Blazor Server)</span>
<span class="line">// 必须在终结点映射之后，因为它需要访问 HttpContext.GetEndpoint() 来判断是否需要应用防伪造令牌。</span>
<span class="line">app.UseAntiforgery();</span>
<span class="line"></span>
<span class="line">// --- HTTP 请求管道结束 ---</span>
<span class="line"></span>
<span class="line">// 启动应用程序</span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>简化的记忆方式：</strong></p><ol><li><strong>安全 &amp; 诊断 (Early)</strong>：错误处理、HTTPS 重定向、HSTS。</li><li><strong>静态资源 (Quick Exit)</strong>：静态文件服务。</li><li><strong>核心功能前置 (Setup)</strong>：Cookie 策略、路由、CORS。</li><li><strong>身份 &amp; 权限 (Who &amp; What)</strong>：认证、授权。</li><li><strong>业务逻辑 &amp; 终结点 (Core Logic)</strong>：Map Razor Pages/Controllers/Minimal APIs。</li><li><strong>安全后置 (Late Security)</strong>：防伪造。</li></ol><blockquote><p>中间件的顺序错误可能会导致应用程序行为异常，甚至出现安全漏洞</p></blockquote><h3 id="中间件条件执行分支" tabindex="-1"><a class="header-anchor" href="#中间件条件执行分支"><span>中间件条件执行分支</span></a></h3><h4 id="概述-1" tabindex="-1"><a class="header-anchor" href="#概述-1"><span>概述</span></a></h4><p>在某些场景下，您可能不希望所有请求都经过整个主中间件管道。例如：</p><ul><li><strong>API 路径与 UI 路径：</strong> 您的应用程序可能同时提供 Web UI（Razor Pages/MVC）和 RESTful API。API 请求可能需要认证、授权和速率限制，但不需要像 <code>UseStaticFiles</code> 或 <code>UseAntiforgery</code> 这样的 UI 相关中间件。</li><li><strong>管理后台与普通用户端：</strong> 管理后台路径可能需要更严格的 IP 限制或不同的认证方案。</li><li><strong>健康检查终结点：</strong> 某些 <code>/health</code> 或 <code>/status</code> 路径的请求可能只需要极简的响应，无需经过完整的认证、授权或日志记录中间件，以提高效率。</li><li><strong>特定文件类型：</strong> 针对特定的文件下载请求，可能只需要极少的中间件处理。</li></ul><p>通过分支，您可以为满足特定条件的请求创建一条<strong>定制的、更高效的管道</strong>，避免不必要的中间件执行。</p><h4 id="使用方式" tabindex="-1"><a class="header-anchor" href="#使用方式"><span>使用方式</span></a></h4><h5 id="map-基于请求路径的分支" tabindex="-1"><a class="header-anchor" href="#map-基于请求路径的分支"><span><code>Map()</code> - 基于请求路径的分支</span></a></h5><p><code>Map()</code> 方法根据请求的<strong>完整路径</strong>（或路径的开头部分）来匹配请求，如果匹配成功，则执行分支中的中间件。匹配的路径<strong>不</strong>会被传递给分支中的中间件，即分支内部的路由是基于分支的根路径。</p><ul><li><strong>特点：</strong> 路径精确匹配（或匹配前缀），一旦匹配成功，请求就不会再回到主管道。</li><li><strong>语法：</strong> <code>app.Map(&quot;/path&quot;, branch =&gt; { /* 配置分支管道 */ });</code></li><li>DEMO: 为/api路径创建独立管道</li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">var builder = WebApplication.CreateBuilder(args);</span>
<span class="line"></span>
<span class="line">// 注册服务</span>
<span class="line">builder.Services.AddAuthentication(); // 主管道和分支可能都用到的认证服务</span>
<span class="line">builder.Services.AddAuthorization();</span>
<span class="line">builder.Services.AddControllers(); // 如果API使用控制器</span>
<span class="line"></span>
<span class="line">var app = builder.Build();</span>
<span class="line"></span>
<span class="line">// --- 主管道中间件 ---</span>
<span class="line">app.UseHttpsRedirection();</span>
<span class="line">app.UseStaticFiles(); // 静态文件，API请求通常不需要</span>
<span class="line">app.UseRouting(); // 主路由必须在 Map() 之前，才能让 Map() 捕捉到路径</span>
<span class="line"></span>
<span class="line">// --- 分支管道：针对 /api 路径 ---</span>
<span class="line">app.Map(&quot;/api&quot;, apiApp =&gt;</span>
<span class="line">{</span>
<span class="line">    // apiApp 是一个新的 IApplicationBuilder 实例，用于配置此分支的管道</span>
<span class="line">    Console.WriteLine(&quot;Request mapped to /api branch.&quot;);</span>
<span class="line"></span>
<span class="line">    // 1. 先进行认证（可能与主管道不同）</span>
<span class="line">    apiApp.UseAuthentication();</span>
<span class="line">    // 2. 再进行授权</span>
<span class="line">    apiApp.UseAuthorization();</span>
<span class="line">    // 3. 配置API路由</span>
<span class="line">    apiApp.UseEndpoints(endpoints =&gt;</span>
<span class="line">    {</span>
<span class="line">        endpoints.MapControllers(); // 映射 API 控制器</span>
<span class="line">        endpoints.MapGet(&quot;/api/status&quot;, () =&gt; &quot;API is healthy!&quot;); // 映射一个API Minimal Endpoint</span>
<span class="line">    });</span>
<span class="line"></span>
<span class="line">    // 注意：这里的中间件只会在 /api 路径下执行</span>
<span class="line">});</span>
<span class="line">// --- /api 路径的请求，一旦进入分支，就不会再回到这里及后面的主管道中间件 ---</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">// --- 主管道剩余中间件（只处理未被分支截获的请求）---</span>
<span class="line">app.UseAuthentication(); // 主管道的认证</span>
<span class="line">app.UseAuthorization();  // 主管道的授权</span>
<span class="line">app.MapRazorPages();     // 主管道的 Razor Pages</span>
<span class="line">app.MapControllers();    // 主管道的 MVC 控制器</span>
<span class="line">app.MapGet(&quot;/&quot;, () =&gt; &quot;Hello from Main App!&quot;);</span>
<span class="line"></span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在这个例子中，访问 <code>/api/products</code> 的请求会进入 <code>apiApp.Map(&quot;/api&quot;, ...)</code> 定义的分支，执行其中的认证、授权和 API 路由，而不会执行主管道中的 <code>MapRazorPages</code> 等。</p><h5 id="mapwhen-基于条件判断" tabindex="-1"><a class="header-anchor" href="#mapwhen-基于条件判断"><span><code>MapWhen()</code> - 基于条件判断</span></a></h5><p><code>MapWhen()</code> 方法允许您根据一个任意的 <code>Predicate&lt;HttpContext&gt;</code>（一个返回布尔值的函数）来匹配请求。如果条件为 <code>true</code>，则请求进入分支；否则，请求继续在主管道中流动。</p><ul><li><strong>特点：</strong> 条件非常灵活，可以是任何请求属性（路径、查询参数、请求头等）。一旦匹配成功，请求不会再回到主管道。</li><li><strong>语法：</strong> <code>app.MapWhen(context =&gt; context.Request.Query.ContainsKey(&quot;admin&quot;), branch =&gt; { /* 配置分支管道 */ });</code></li><li>DEMO：基于查询参数<code>admin=true</code>的分支</li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">// ...</span>
<span class="line">var app = builder.Build();</span>
<span class="line"></span>
<span class="line">app.UseHttpsRedirection();</span>
<span class="line">app.UseStaticFiles();</span>
<span class="line">app.UseRouting();</span>
<span class="line"></span>
<span class="line">// --- 分支管道：当查询参数包含 &quot;admin=true&quot; 时 ---</span>
<span class="line">app.MapWhen(context =&gt; context.Request.Query.ContainsKey(&quot;admin&quot;) &amp;&amp; context.Request.Query[&quot;admin&quot;] == &quot;true&quot;, adminApp =&gt;</span>
<span class="line">{</span>
<span class="line">    Console.WriteLine(&quot;Request mapped to admin branch.&quot;);</span>
<span class="line"></span>
<span class="line">    // 管理员专用中间件，例如：</span>
<span class="line">    adminApp.Use(async (context, next) =&gt;</span>
<span class="line">    {</span>
<span class="line">        // 模拟一个简单的 IP 检查</span>
<span class="line">        if (context.Connection.RemoteIpAddress?.ToString() != &quot;127.0.0.1&quot;)</span>
<span class="line">        {</span>
<span class="line">            context.Response.StatusCode = 403; // Forbidden</span>
<span class="line">            await context.Response.WriteAsync(&quot;Access Denied for Admin Interface!&quot;);</span>
<span class="line">            return; // 短路，不调用 next</span>
<span class="line">        }</span>
<span class="line">        await next();</span>
<span class="line">    });</span>
<span class="line">    // 假设管理分支有自己的认证/授权或特定的路由</span>
<span class="line">    adminApp.UseAuthentication();</span>
<span class="line">    adminApp.UseAuthorization();</span>
<span class="line">    adminApp.MapGet(&quot;/admin&quot;, () =&gt; &quot;Welcome to the Admin Panel!&quot;);</span>
<span class="line">    // 注意：此处的 /admin 路径是基于主管道的 /admin，而不是分支的根</span>
<span class="line">});</span>
<span class="line">// --- 如果条件不满足，请求会继续通过下面的主管道中间件 ---</span>
<span class="line"></span>
<span class="line">app.UseAuthentication(); // 主管道认证</span>
<span class="line">app.UseAuthorization();  // 主管道授权</span>
<span class="line">app.MapRazorPages();</span>
<span class="line">app.MapGet(&quot;/&quot;, () =&gt; &quot;Hello from Main App!&quot;);</span>
<span class="line"></span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在本例中：访问 <code>/?admin=true</code> 会进入管理员分支，而访问 <code>/</code> 则不会。</p><h5 id="usewhen-基于条件判断-请求可能回到主管道" tabindex="-1"><a class="header-anchor" href="#usewhen-基于条件判断-请求可能回到主管道"><span><code>UseWhen()</code> - 基于条件判断（请求可能回到主管道）</span></a></h5><p><code>UseWhen()</code> 类似于 <code>MapWhen()</code>，也是基于一个条件。但最大的区别是：如果分支中的中间件调用了 <code>_next()</code>，请求会回到主管道，并继续执行 <code>UseWhen()</code> 之后的主管道中间件。</p><ul><li><strong>特点：</strong> 条件灵活，分支结束后可以回到主管道。适用于在特定条件下<strong>插入额外的中间件</strong>，而不是完全替换管道。</li><li><strong>语法：</strong> <code>app.UseWhen(context =&gt; context.Request.Query.ContainsKey(&quot;debug&quot;), builder =&gt; { /* 配置分支管道 */ });</code></li><li>示例: 在调试模式下添加额外日志</li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">// ...</span>
<span class="line">var app = builder.Build();</span>
<span class="line"></span>
<span class="line">app.UseHttpsRedirection();</span>
<span class="line">app.UseStaticFiles();</span>
<span class="line"></span>
<span class="line">// --- 在请求包含 &quot;debug=true&quot; 时，插入额外的日志中间件 ---</span>
<span class="line">app.UseWhen(context =&gt; context.Request.Query.ContainsKey(&quot;debug&quot;) &amp;&amp; context.Request.Query[&quot;debug&quot;] == &quot;true&quot;, debugApp =&gt;</span>
<span class="line">{</span>
<span class="line">    Console.WriteLine(&quot;Request entering debug logging branch.&quot;);</span>
<span class="line">    debugApp.Use(async (context, next) =&gt;</span>
<span class="line">    {</span>
<span class="line">        // 这是一个简单的自定义日志中间件</span>
<span class="line">        Console.WriteLine($&quot;[DEBUG LOG]: Request Path: {context.Request.Path}&quot;);</span>
<span class="line">        await next(); // 调用下一个中间件，请求会回到主管道</span>
<span class="line">        Console.WriteLine($&quot;[DEBUG LOG]: Response Status: {context.Response.StatusCode}&quot;);</span>
<span class="line">    });</span>
<span class="line">    // 可以在这里添加其他只在调试时启用的中间件</span>
<span class="line">});</span>
<span class="line">// --- 无论是否进入 debug 分支，请求都会继续执行下面的主管道中间件 ---</span>
<span class="line"></span>
<span class="line">app.UseRouting();</span>
<span class="line">app.UseAuthentication();</span>
<span class="line">app.UseAuthorization();</span>
<span class="line">app.MapRazorPages();</span>
<span class="line">app.MapGet(&quot;/&quot;, () =&gt; &quot;Hello from Main App!&quot;);</span>
<span class="line"></span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在本例中：访问 <code>/?debug=true</code> 会看到额外的调试日志，然后继续完成请求；访问 <code>/</code> 则不会。</p><h5 id="小结" tabindex="-1"><a class="header-anchor" href="#小结"><span>小结</span></a></h5><p><strong><code>Map()</code>：</strong> 当希望<strong>完全隔离</strong>基于<strong>固定路径前缀</strong>的请求时，使用 <code>Map()</code>。一旦匹配，请求就只在该分支中处理，不会回到主管道。</p><p><strong><code>MapWhen()</code>：</strong> 当希望<strong>完全隔离</strong>基于<strong>任意条件</strong>的请求时，使用 <code>MapWhen()</code>。一旦匹配，请求就只在该分支中处理，不会回到主管道。</p><p><strong><code>UseWhen()</code>：</strong> 当希望在特定条件下<strong>插入额外的中间件逻辑</strong>，但随后请求<strong>仍然需要继续通过主管道</strong>时，使用 <code>UseWhen()</code>。</p><h3 id="速率限制中间件" tabindex="-1"><a class="header-anchor" href="#速率限制中间件"><span>速率限制中间件</span></a></h3><p><strong>定义</strong></p><p>根据预定义的规则，<strong>限制客户端在特定时间段内向服务器发送请求的次数</strong>。如果客户端的请求频率超过了限制，中间件就会阻止这些请求，通常返回 HTTP 状态码 <code>429 Too Many Requests</code>。</p><h4 id="限流算法" tabindex="-1"><a class="header-anchor" href="#限流算法"><span>限流算法</span></a></h4><h5 id="固定窗口" tabindex="-1"><a class="header-anchor" href="#固定窗口"><span>固定窗口</span></a></h5><ul><li><strong>固定窗口 (Fixed Window):</strong> 在固定的时间窗口内（例如，每分钟）允许一定数量的请求。一旦窗口开始，它会持续到时间结束，然后重置计数器。</li></ul><h5 id="滑动窗口" tabindex="-1"><a class="header-anchor" href="#滑动窗口"><span>滑动窗口</span></a></h5><ul><li><strong>滑动窗口 (Sliding Window):</strong> 类似于固定窗口，但窗口会随着时间滑动，而不是固定。通常通过在窗口内维护多个固定大小的子窗口来实现。</li></ul><h5 id="令牌桶" tabindex="-1"><a class="header-anchor" href="#令牌桶"><span>令牌桶</span></a></h5><ul><li><strong>令牌桶 (Token Bucket):</strong> 应用程序以固定速率填充“令牌桶”，每个请求消耗一个令牌。如果桶中没有令牌，请求就会被拒绝。</li></ul><h5 id="并发限制" tabindex="-1"><a class="header-anchor" href="#并发限制"><span>并发限制</span></a></h5><ul><li><strong>并发限制 (Concurrency Limit):</strong> 限制同时处理的请求数量，而不是每秒的请求数量。</li></ul><h4 id="使用步骤" tabindex="-1"><a class="header-anchor" href="#使用步骤"><span>使用步骤</span></a></h4><h5 id="服务注册-program-cs-的-builder-services-部分" tabindex="-1"><a class="header-anchor" href="#服务注册-program-cs-的-builder-services-部分"><span>服务注册 (<code>Program.cs</code> 的 <code>builder.Services</code> 部分)</span></a></h5><p>需要在 DI 容器中注册速率限制服务，并定义一个或多个<strong>策略 (Policies)</strong>。策略是命名规则，定义了限制的类型和参数。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">var builder = WebApplication.CreateBuilder(args);</span>
<span class="line"></span>
<span class="line">// 注册速率限制服务</span>
<span class="line">builder.Services.AddRateLimiter(rateLimiterOptions =&gt;</span>
<span class="line">{</span>
<span class="line">    // 定义一个名为 &quot;fixed&quot; 的全局固定窗口策略</span>
<span class="line">    rateLimiterOptions.AddFixedWindowLimiter(&quot;fixed&quot;, options =&gt;</span>
<span class="line">    {</span>
<span class="line">        options.PermitLimit = 5; // 在每个窗口内允许5个请求</span>
<span class="line">        options.Window = TimeSpan.FromSeconds(10); // 窗口大小为10秒</span>
<span class="line">        options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst; // 队列处理顺序</span>
<span class="line">        options.QueueLimit = 0; // 队列大小为0，即不排队，直接拒绝</span>
<span class="line">    });</span>
<span class="line"></span>
<span class="line">    // 定义一个名为 &quot;sliding&quot; 的滑动窗口策略</span>
<span class="line">    rateLimiterOptions.AddSlidingWindowLimiter(&quot;sliding&quot;, options =&gt;</span>
<span class="line">    {</span>
<span class="line">        options.PermitLimit = 10; // 在每个窗口内允许10个请求</span>
<span class="line">        options.Window = TimeSpan.FromSeconds(15); // 窗口大小为15秒</span>
<span class="line">        options.SegmentsPerWindow = 3; // 每个窗口分3段</span>
<span class="line">        options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;</span>
<span class="line">        options.QueueLimit = 2; // 队列大小为2，即允许2个请求排队等待</span>
<span class="line">    });</span>
<span class="line"></span>
<span class="line">    // 定义一个名为 &quot;token&quot; 的令牌桶策略</span>
<span class="line">    rateLimiterOptions.AddTokenBucketLimiter(&quot;token&quot;, options =&gt;</span>
<span class="line">    {</span>
<span class="line">        options.TokenLimit = 20; // 令牌桶最大容量</span>
<span class="line">        options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;</span>
<span class="line">        options.QueueLimit = 5; // 队列大小</span>
<span class="line">        options.ReplenishmentPeriod = TimeSpan.FromSeconds(1); // 每秒补充令牌</span>
<span class="line">        options.TokensPerPeriod = 2; // 每秒补充2个令牌</span>
<span class="line">        options.AutoReplenishment = true; // 自动补充</span>
<span class="line">    });</span>
<span class="line"></span>
<span class="line">    // 定义一个名为 &quot;concurrency&quot; 的并发策略</span>
<span class="line">    rateLimiterOptions.AddConcurrencyLimiter(&quot;concurrency&quot;, options =&gt;</span>
<span class="line">    {</span>
<span class="line">        options.PermitLimit = 3; // 允许同时处理3个请求</span>
<span class="line">        options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;</span>
<span class="line">        options.QueueLimit = 1; // 队列大小为1</span>
<span class="line">    });</span>
<span class="line"></span>
<span class="line">    // 还可以设置全局拒绝策略 (Fallback Policy)</span>
<span class="line">    rateLimiterOptions.RejectionStatusCode = 429; // 当请求被拒绝时返回 429 状态码</span>
<span class="line">});</span>
<span class="line"></span>
<span class="line">// ... 其他服务注册 ...</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="中间件配置-program-cs-的-app-部分" tabindex="-1"><a class="header-anchor" href="#中间件配置-program-cs-的-app-部分"><span>中间件配置 (<code>Program.cs</code> 的 <code>app</code> 部分)</span></a></h5><p>注册策略后，需要在 HTTP 请求管道中启用速率限制中间件。可以将其应用于整个应用程序，或者应用于特定的终结点。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">// ...</span>
<span class="line">var app = builder.Build();</span>
<span class="line"></span>
<span class="line">// --- 启用速率限制中间件 ---</span>
<span class="line">// 通常放在 UseRouting() 之后，UseAuthentication/UseAuthorization 之前或之后，取决于你的需求。</span>
<span class="line">// 如果你想限制未认证的请求，可以放在认证中间件之前。</span>
<span class="line">app.UseRateLimiter(); // 启用速率限制中间件</span>
<span class="line"></span>
<span class="line">// ... 其他中间件配置 (UseAuthentication, UseAuthorization 等) ...</span>
<span class="line"></span>
<span class="line">// --- 应用速率限制策略到终结点 ---</span>
<span class="line"></span>
<span class="line">// 1. 应用全局策略（如果定义了默认策略）</span>
<span class="line">// rateLimiterOptions.GlobalLimiter = PartitionedRateLimiter.Create&lt;HttpContext, string&gt;(httpContext =&gt;</span>
<span class="line">//     RateLimitPartition.GetFixedWindowLimiter(</span>
<span class="line">//         partitionKey: httpContext.User.Identity?.Name ?? httpContext.Request.Headers.Host.ToString(),</span>
<span class="line">//         factory: partition =&gt; new FixedWindowRateLimiterOptions</span>
<span class="line">//         {</span>
<span class="line">//             PermitLimit = 5,</span>
<span class="line">//             Window = TimeSpan.FromSeconds(10)</span>
<span class="line">//         }));</span>
<span class="line"></span>
<span class="line">// 2. 应用命名策略到特定的 Minimal API 终结点</span>
<span class="line">app.MapGet(&quot;/limited-fixed&quot;, () =&gt; &quot;Fixed window limited!&quot;).RequireRateLimiting(&quot;fixed&quot;);</span>
<span class="line">app.MapGet(&quot;/limited-sliding&quot;, () =&gt; &quot;Sliding window limited!&quot;).RequireRateLimiting(&quot;sliding&quot;);</span>
<span class="line">app.MapGet(&quot;/limited-token&quot;, () =&gt; &quot;Token bucket limited!&quot;).RequireRateLimiting(&quot;token&quot;);</span>
<span class="line">app.MapGet(&quot;/limited-concurrency&quot;, () =&gt; &quot;Concurrency limited!&quot;).RequireRateLimiting(&quot;concurrency&quot;);</span>
<span class="line"></span>
<span class="line">// 3. 应用策略到控制器或 Razor Pages</span>
<span class="line">// [EnableRateLimiting(&quot;fixed&quot;)]</span>
<span class="line">// public class MyController : ControllerBase { ... }</span>
<span class="line">// 或</span>
<span class="line">// endpoints.MapControllers().RequireRateLimiting(&quot;fixed&quot;);</span>
<span class="line"></span>
<span class="line">app.MapGet(&quot;/&quot;, () =&gt; &quot;Hello World!&quot;);</span>
<span class="line"></span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="配置速率限制的生效位置" tabindex="-1"><a class="header-anchor" href="#配置速率限制的生效位置"><span>配置速率限制的生效位置</span></a></h4><p><strong>全局：</strong> 如果你在 <code>AddRateLimiter</code> 中配置了 <code>rateLimiterOptions.GlobalLimiter</code>，那么所有未明确指定策略的请求都会受此限制。</p><p><strong>按命名策略：</strong> 通过 <code>RequireRateLimiting(&quot;YourPolicyName&quot;)</code> 应用到特定的 Minimal API 终结点、Controller 或 Action。</p><p><strong>按自定义分区：</strong> 你可以基于请求的特征（如用户 ID、IP 地址、API Key 等）来创建动态的限制分区。</p><h4 id="客户端被限流后的响应码" tabindex="-1"><a class="header-anchor" href="#客户端被限流后的响应码"><span>客户端被限流后的响应码</span></a></h4><p>当请求被速率限制中间件拒绝时，默认会返回 <code>429 Too Many Requests</code> HTTP 状态码。此外，响应头中可能包含以下信息：</p><ul><li><code>Retry-After</code>: 告诉客户端多久之后可以重试。</li><li><code>RateLimit-Limit</code>: 当前窗口允许的最大请求数。</li><li><code>RateLimit-Remaining</code>: 当前窗口剩余的请求数。</li><li><code>RateLimit-Reset</code>: 当前窗口何时重置的时间戳。</li></ul><h4 id="速率限制分区" tabindex="-1"><a class="header-anchor" href="#速率限制分区"><span>速率限制分区</span></a></h4><p>分区就是将传入的请求流分成多个独立的组，并对每个组应用自己的速率限制计数器。</p><h5 id="使用方法-1" tabindex="-1"><a class="header-anchor" href="#使用方法-1"><span>使用方法</span></a></h5><p>通过 <code>PartitionedRateLimiter.Create&lt;TResource, TPartitionKey&gt;()</code> 方法来创建基于分区的速率限制器。这个方法接受两个主要的参数：</p><ol><li><strong><code>TResource</code></strong>: 通常是 <code>HttpContext</code>，表示您要限制的资源。</li><li><strong><code>TPartitionKey</code></strong>: 这是定义分区的键的类型。例如，如果您想按用户名分区，<code>TPartitionKey</code> 可以是 <code>string</code>。</li><li><strong><code>Func&lt;TResource, TPartitionKey&gt; keyProducer</code></strong>: 一个委托，用于从资源（<code>HttpContext</code>）中提取分区键。</li><li><strong><code>Func&lt;TPartitionKey, RateLimitPartition&lt;TPartitionKey&gt;&gt; partitionFactory</code></strong>: 一个工厂函数，根据生成的分区键来创建或获取一个 <code>RateLimitPartition</code>。这个 <code>RateLimitPartition</code> 定义了具体的分区策略（例如，固定窗口、滑动窗口等）。</li></ol><p><strong>核心思想：<strong>对于每个传入的请求，您提供一个函数来</strong>识别</strong>这个请求属于哪个“组”（分区键），然后根据这个“组”来<strong>应用</strong>预先定义的速率限制策略。</p><p>DEMO:按用户（或 IP 地址）进行分区</p><p>根据用户的身份（如果已登录）或其 IP 地址来限制请求。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">var builder = WebApplication.CreateBuilder(args);</span>
<span class="line"></span>
<span class="line">// 1. 注册认证服务（以便我们可以获取用户身份）</span>
<span class="line">builder.Services.AddAuthentication(options =&gt;</span>
<span class="line">{</span>
<span class="line">    options.DefaultScheme = &quot;Bearer&quot;; // 假设使用 Bearer token 认证</span>
<span class="line">}).AddJwtBearer(&quot;Bearer&quot;, options =&gt;</span>
<span class="line">{</span>
<span class="line">    // 配置 JWT Bearer 选项，例如 Authority, Audience 等</span>
<span class="line">    options.Authority = builder.Configuration[&quot;Jwt:Authority&quot;];</span>
<span class="line">    options.Audience = builder.Configuration[&quot;Jwt:Audience&quot;];</span>
<span class="line">});</span>
<span class="line">builder.Services.AddAuthorization();</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">// 2. 注册速率限制服务并定义分区策略</span>
<span class="line">builder.Services.AddRateLimiter(rateLimiterOptions =&gt;</span>
<span class="line">{</span>
<span class="line">    // 定义一个名为 &quot;UserOrIpPolicy&quot; 的分区速率限制策略</span>
<span class="line">    rateLimiterOptions.AddPolicy(&quot;UserOrIpPolicy&quot;, httpContext =&gt;</span>
<span class="line">    {</span>
<span class="line">        // 从 HttpContext 中提取分区键</span>
<span class="line">        // 优先使用用户的唯一标识（如果已认证），否则使用 IP 地址</span>
<span class="line">        string partitionKey = httpContext.User.Identity?.IsAuthenticated == true</span>
<span class="line">                              ? httpContext.User.Identity.Name! // 如果用户已认证，使用其用户名作为分区键</span>
<span class="line">                              : httpContext.Connection.RemoteIpAddress?.ToString() ?? &quot;unknown_ip&quot;; // 否则使用IP地址</span>
<span class="line"></span>
<span class="line">        Console.WriteLine($&quot;Request from partition: {partitionKey}&quot;); // 调试输出</span>
<span class="line"></span>
<span class="line">        // 根据分区键返回一个具体的速率限制策略</span>
<span class="line">        // 假设每个用户或IP地址在10秒内最多允许5个请求</span>
<span class="line">        return RateLimitPartition.GetFixedWindowLimiter(</span>
<span class="line">            partitionKey: partitionKey, // 传入当前请求的分区键</span>
<span class="line">            factory: partition =&gt; new FixedWindowRateLimiterOptions</span>
<span class="line">            {</span>
<span class="line">                PermitLimit = 5,           // 每个分区允许5个请求</span>
<span class="line">                Window = TimeSpan.FromSeconds(10), // 窗口大小10秒</span>
<span class="line">                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,</span>
<span class="line">                QueueLimit = 0             // 不排队，直接拒绝</span>
<span class="line">            });</span>
<span class="line">    });</span>
<span class="line"></span>
<span class="line">    // 定义一个默认的拒绝状态码</span>
<span class="line">    rateLimiterOptions.RejectionStatusCode = 429; // Too Many Requests</span>
<span class="line">});</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">var app = builder.Build();</span>
<span class="line"></span>
<span class="line">// --- 中间件管道配置 ---</span>
<span class="line">app.UseHttpsRedirection();</span>
<span class="line">app.UseStaticFiles();</span>
<span class="line">app.UseRouting();</span>
<span class="line"></span>
<span class="line">app.UseAuthentication(); // 确保认证中间件在速率限制之前，以便可以获取用户身份</span>
<span class="line">app.UseAuthorization();</span>
<span class="line"></span>
<span class="line">app.UseRateLimiter(); // 启用速率限制中间件</span>
<span class="line"></span>
<span class="line">// 3. 将策略应用到终结点</span>
<span class="line">app.MapGet(&quot;/api/data&quot;, () =&gt; &quot;Here&#39;s your data!&quot;).RequireRateLimiting(&quot;UserOrIpPolicy&quot;);</span>
<span class="line">app.MapGet(&quot;/&quot;, () =&gt; &quot;Hello from Main App!&quot;);</span>
<span class="line"></span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="限流算法-vs-限流分区" tabindex="-1"><a class="header-anchor" href="#限流算法-vs-限流分区"><span>限流算法 VS 限流分区</span></a></h5><p><strong>速率限制算法</strong>定义了<strong>如何</strong>计算和管理请求的额度。它们是数学模型，用来决定在特定时间内允许多少请求通过，以及当超过限制时如何处理（例如，拒绝、排队）。</p><p>简而言之：算法是决定“计费方式”和“允许多少流量”的规则。</p><hr><p><strong>速率限制分区</strong>定义了<strong>对谁</strong>（或对哪种类型的请求）应用独立的速率限制。它允许您将总的请求流量划分为多个独立的逻辑组，每个组都拥有自己独立的速率限制计数器，并可以应用不同的限流算法。</p><p>简而言之：分区是定义“独立账户”的机制，每个“账户”有自己的“流量套餐”。</p><h4 id="被限流后的处理方式" tabindex="-1"><a class="header-anchor" href="#被限流后的处理方式"><span>被限流后的处理方式</span></a></h4><h5 id="默认的处理方式" tabindex="-1"><a class="header-anchor" href="#默认的处理方式"><span>默认的处理方式</span></a></h5><p>当请求被速率限制器拒绝时，默认情况下会发生以下情况：</p><ol><li><strong>HTTP 状态码 429:</strong> 服务器会返回一个 <code>HTTP 429 Too Many Requests</code> 的状态码。这是标准的 HTTP 状态码，明确告诉客户端请求因发送过多而被拒绝。</li><li><strong>默认响应体:</strong> 响应体通常是空的，或者包含一个非常简单的文本，例如 &quot;Too Many Requests&quot;。</li><li><strong>响应头:</strong> 响应头中可能会包含一些有用的信息，帮助客户端理解限制并知道何时可以重试： <ul><li><code>Retry-After</code>: 这个响应头告诉客户端在多久之后可以安全地重试请求（通常是一个秒数或一个 HTTP 日期）。</li><li><code>RateLimit-Limit</code>: 指示在当前时间窗口内允许的最大请求数。</li><li><code>RateLimit-Remaining</code>: 指示当前时间窗口内还剩余多少个请求。</li><li><code>RateLimit-Reset</code>: 指示当前时间窗口何时重置的时间戳（通常是 Unix 时间戳或 HTTP 日期）。</li></ul></li></ol><h5 id="自定义处理方式" tabindex="-1"><a class="header-anchor" href="#自定义处理方式"><span>自定义处理方式</span></a></h5><p>速率限制中间件允许你通过配置 <code>RateLimiterOptions.RejectionStatusCode</code> 和 <code>RateLimiterOptions.OnRejected</code> 回调来定制被拒绝请求的处理方式。</p><ol><li>自定义拒绝状态码（<code>RejectionStatusCode</code>）</li></ol><p>可以设置当请求被拒绝时返回的 HTTP 状态码。虽然 <code>429</code> 是标准且推荐的，但如果你有特殊需求，可以更改它。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">builder.Services.AddRateLimiter(rateLimiterOptions =&gt;</span>
<span class="line">{</span>
<span class="line">    // ... 你的限流策略定义 ...</span>
<span class="line"></span>
<span class="line">    // 设置全局的拒绝状态码</span>
<span class="line">    rateLimiterOptions.RejectionStatusCode = StatusCodes.Status429TooManyRequests; // 默认就是 429</span>
<span class="line">    // 如果你非要用别的，例如：</span>
<span class="line">    // rateLimiterOptions.RejectionStatusCode = StatusCodes.Status503ServiceUnavailable;</span>
<span class="line">});</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>自定义拒绝行为（<code>OnRejected</code>回调）</li></ol><p><code>OnRejected</code> 是一个异步回调函数，它会在请求被限流器拒绝时执行。你可以在这里完全控制发送给客户端的响应。</p><p>可以做的事情包括：</p><ul><li><strong>发送自定义的 JSON 错误信息:</strong> 而不是空的响应体。</li><li><strong>记录详细日志:</strong> 记录是哪个请求、哪个 IP、哪个用户因为限流而被拒绝了。</li><li><strong>发送通知:</strong> 例如，向管理员发送邮件或通知，表明某个 IP 或用户正在触发大量的限流。</li><li><strong>重定向:</strong> 将用户重定向到另一个页面（虽然对于 429 响应不太常见）。</li></ul><p>DEMO:发送自定义 JSON 错误信息和记录日志</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">using System.Text.Json;</span>
<span class="line">using Microsoft.AspNetCore.Http; // 确保引用此命名空间获取 StatusCodes</span>
<span class="line"></span>
<span class="line">builder.Services.AddRateLimiter(rateLimiterOptions =&gt;</span>
<span class="line">{</span>
<span class="line">    rateLimiterOptions.AddFixedWindowLimiter(&quot;myFixedPolicy&quot;, options =&gt;</span>
<span class="line">    {</span>
<span class="line">        options.PermitLimit = 5;</span>
<span class="line">        options.Window = TimeSpan.FromSeconds(10);</span>
<span class="line">        options.QueueLimit = 0;</span>
<span class="line">    });</span>
<span class="line"></span>
<span class="line">    rateLimiterOptions.RejectionStatusCode = StatusCodes.Status429TooManyRequests;</span>
<span class="line"></span>
<span class="line">    // 定义自定义拒绝行为</span>
<span class="line">    rateLimiterOptions.OnRejected = async (context, cancellationToken) =&gt;</span>
<span class="line">    {</span>
<span class="line">        // 1. 记录日志</span>
<span class="line">        var logger = context.HttpContext.RequestServices.GetRequiredService&lt;ILoggerFactory&gt;()</span>
<span class="line">                           .CreateLogger(&quot;RateLimiting&quot;);</span>
<span class="line">        logger.LogWarning($&quot;Request rejected by rate limiter for {context.Lease.PartitionKey?.ToString()} &quot; +</span>
<span class="line">                          $&quot;Path: {context.HttpContext.Request.Path}, &quot; +</span>
<span class="line">                          $&quot;IP: {context.HttpContext.Connection.RemoteIpAddress}&quot;);</span>
<span class="line"></span>
<span class="line">        // 2. 自定义响应体</span>
<span class="line">        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;</span>
<span class="line">        context.HttpContext.Response.ContentType = &quot;application/json&quot;;</span>
<span class="line"></span>
<span class="line">        var responseContent = new</span>
<span class="line">        {</span>
<span class="line">            Status = StatusCodes.Status429TooManyRequests,</span>
<span class="line">            Message = &quot;Too Many Requests. Please try again later.&quot;,</span>
<span class="line">            RetryAfterSeconds = (int)context.Lease.RetryAfter.TotalSeconds // 如果可用，提供重试时间</span>
<span class="line">        };</span>
<span class="line"></span>
<span class="line">        await context.HttpContext.Response.WriteAsync(JsonSerializer.Serialize(responseContent), cancellationToken);</span>
<span class="line"></span>
<span class="line">        // 你也可以手动设置 Retry-After 响应头</span>
<span class="line">        context.HttpContext.Response.Headers.RetryAfter = context.Lease.RetryAfter.TotalSeconds.ToString();</span>
<span class="line">    };</span>
<span class="line">});</span>
<span class="line"></span>
<span class="line">// ... 其他服务和中间件配置 ...</span>
<span class="line"></span>
<span class="line">var app = builder.Build();</span>
<span class="line"></span>
<span class="line">app.UseRateLimiter(); // 启用速率限制中间件</span>
<span class="line"></span>
<span class="line">app.MapGet(&quot;/limited-endpoint&quot;, () =&gt; &quot;You got through!&quot;).RequireRateLimiting(&quot;myFixedPolicy&quot;);</span>
<span class="line"></span>
<span class="line">app.MapGet(&quot;/&quot;, () =&gt; &quot;Hello World!&quot;);</span>
<span class="line"></span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="启用-禁用的注解" tabindex="-1"><a class="header-anchor" href="#启用-禁用的注解"><span>启用/禁用的注解</span></a></h4><h5 id="enableratelimiting-policyname" tabindex="-1"><a class="header-anchor" href="#enableratelimiting-policyname"><span>[EnableRateLimiting(&quot;PolicyName&quot;)]</span></a></h5><p><code>EnableRateLimiting</code> 属性用于在控制器或 Action 方法上<strong>启用</strong>速率限制，并指定要使用的<strong>命名策略 (Named Policy)</strong>。</p><ul><li><strong>作用：</strong> 将之前在 <code>AddRateLimiter</code> 中定义的某个命名策略应用到这个控制器或 Action 上。</li><li><strong>应用位置：</strong><ul><li><strong>控制器类级别：</strong> 如果应用在整个控制器类上，那么该控制器下的所有 Action 方法都会默认应用此速率限制策略。</li><li><strong>Action 方法级别：</strong> 如果应用在某个特定的 Action 方法上，那么只有该方法会应用此策略。方法上的属性会覆盖控制器类上的属性。</li></ul></li></ul><p>DEMO:假设<code>Program.cs</code> 中定义了一个名为 &quot;myFixedPolicy&quot; 的速率限制策略：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">builder.Services.AddRateLimiter(rateLimiterOptions =&gt;</span>
<span class="line">{</span>
<span class="line">    rateLimiterOptions.AddFixedWindowLimiter(&quot;myFixedPolicy&quot;, options =&gt;</span>
<span class="line">    {</span>
<span class="line">        options.PermitLimit = 5;</span>
<span class="line">        options.Window = TimeSpan.FromSeconds(10);</span>
<span class="line">        options.QueueLimit = 0;</span>
<span class="line">    });</span>
<span class="line">    rateLimiterOptions.RejectionStatusCode = StatusCodes.Status429TooManyRequests;</span>
<span class="line">});</span>
<span class="line">// ...</span>
<span class="line">app.UseRateLimiter(); // 启用中间件</span>
<span class="line">// ...</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在，可以在控制器中使用 <code>[EnableRateLimiting(&quot;myFixedPolicy&quot;)]</code>：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">using Microsoft.AspNetCore.Mvc;</span>
<span class="line">using Microsoft.AspNetCore.RateLimiting; // 引入命名空间</span>
<span class="line"></span>
<span class="line">[ApiController]</span>
<span class="line">[Route(&quot;[controller]&quot;)]</span>
<span class="line">// 在控制器级别应用 &quot;myFixedPolicy&quot;</span>
<span class="line">[EnableRateLimiting(&quot;myFixedPolicy&quot;)]</span>
<span class="line">public class ProductsController : ControllerBase</span>
<span class="line">{</span>
<span class="line">    [HttpGet]</span>
<span class="line">    public IActionResult GetProducts()</span>
<span class="line">    {</span>
<span class="line">        // 这个方法会受到 &quot;myFixedPolicy&quot; 的限制</span>
<span class="line">        return Ok(&quot;List of products.&quot;);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    [HttpGet(&quot;{id}&quot;)]</span>
<span class="line">    // 这个方法也会受到 &quot;myFixedPolicy&quot; 的限制，因为它继承了控制器级别的设置</span>
<span class="line">    public IActionResult GetProductById(int id)</span>
<span class="line">    {</span>
<span class="line">        return Ok($&quot;Product with ID {id}.&quot;);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    [HttpGet(&quot;popular&quot;)]</span>
<span class="line">    // 如果您想在这个特定 Action 上使用不同的策略，可以再次应用属性：</span>
<span class="line">    // [EnableRateLimiting(&quot;anotherPolicy&quot;)]</span>
<span class="line">    public IActionResult GetPopularProducts()</span>
<span class="line">    {</span>
<span class="line">        return Ok(&quot;List of popular products.&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="disableratelimiting" tabindex="-1"><a class="header-anchor" href="#disableratelimiting"><span>[DisableRateLimiting]</span></a></h5><p><code>DisableRateLimiting</code> 属性用于在控制器或 Action 方法上<strong>禁用</strong>速率限制。</p><ul><li><strong>作用：</strong> 明确表示该控制器或 Action 不受任何速率限制策略的影响，即使在父级（控制器级别或全局）已经应用了速率限制。</li><li><strong>应用位置：</strong><ul><li><strong>控制器类级别：</strong> 如果应用在整个控制器类上，则该控制器下的所有 Action 方法都不会受到速率限制。</li><li><strong>Action 方法级别：</strong> 如果应用在某个特定的 Action 方法上，则只有该方法会禁用速率限制。方法上的属性会覆盖控制器类或全局的设置。</li></ul></li></ul><p>DEMO:承接上面(EnableRateLimiting)的例子，如果不希望 <code>GetProductById</code> 方法受到速率限制：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">using Microsoft.AspNetCore.Mvc;</span>
<span class="line">using Microsoft.AspNetCore.RateLimiting;</span>
<span class="line"></span>
<span class="line">[ApiController]</span>
<span class="line">[Route(&quot;[controller]&quot;)]</span>
<span class="line">[EnableRateLimiting(&quot;myFixedPolicy&quot;)] // 整个控制器应用 &quot;myFixedPolicy&quot;</span>
<span class="line">public class ProductsController : ControllerBase</span>
<span class="line">{</span>
<span class="line">    [HttpGet]</span>
<span class="line">    public IActionResult GetProducts()</span>
<span class="line">    {</span>
<span class="line">        return Ok(&quot;List of products.&quot;);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    [HttpGet(&quot;{id}&quot;)]</span>
<span class="line">    // 在 Action 级别禁用速率限制，覆盖了控制器级别的 &quot;myFixedPolicy&quot;</span>
<span class="line">    [DisableRateLimiting]</span>
<span class="line">    public IActionResult GetProductById(int id)</span>
<span class="line">    {</span>
<span class="line">        // 这个方法不会受到任何速率限制</span>
<span class="line">        return Ok($&quot;Product with ID {id}.&quot;);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    [HttpGet(&quot;popular&quot;)]</span>
<span class="line">    public IActionResult GetPopularProducts()</span>
<span class="line">    {</span>
<span class="line">        return Ok(&quot;List of popular products.&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在最小API中的用法</p><p><code>EnableRateLimiting</code> 和 <code>DisableRateLimiting</code> 也可以用于 Minimal API 终结点：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">// ...</span>
<span class="line">app.UseRateLimiter(); // 启用中间件</span>
<span class="line"></span>
<span class="line">// 为 Minimal API 终结点应用命名策略</span>
<span class="line">app.MapGet(&quot;/api/data&quot;, () =&gt; &quot;Data for you!&quot;)</span>
<span class="line">    .RequireRateLimiting(&quot;myFixedPolicy&quot;);</span>
<span class="line"></span>
<span class="line">// 为 Minimal API 终结点禁用速率限制</span>
<span class="line">app.MapGet(&quot;/api/health&quot;, () =&gt; &quot;I&#39;m healthy!&quot;)</span>
<span class="line">    .DisableRateLimiting(); // 即使有全局策略，这个终结点也不会被限速</span>
<span class="line"></span>
<span class="line">// ...</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="最小api中的中间件" tabindex="-1"><a class="header-anchor" href="#最小api中的中间件"><span>最小API中的中间件</span></a></h3><h4 id="执行流程" tabindex="-1"><a class="header-anchor" href="#执行流程"><span>执行流程</span></a></h4><p>最小 API 应用程序同样通过 <code>app.Use...()</code> 方法来构建其中间件管道。当一个 HTTP 请求到达时，它会从管道的开始处（通常是 <code>Program.cs</code> 中 <code>app.Build()</code> 之后的第一行 <code>app.Use...()</code>）开始，依次经过每个配置的中间件。</p><p>每个中间件在处理完自己的逻辑后，会调用 <code>await _next(context);</code> 将控制权传递给管道中的下一个中间件。最终，请求会到达一个 <strong>终结点 (Endpoint)</strong>（也就是你用 <code>app.MapGet()</code>、<code>app.MapPost()</code> 等定义的回调函数），终结点处理完请求并生成响应后，响应会沿管道反向流回，途经那些在 <code>_next(context)</code> 之后有逻辑的中间件，直到返回给客户端。</p><h4 id="使用方法-2" tabindex="-1"><a class="header-anchor" href="#使用方法-2"><span>使用方法</span></a></h4><p>在最小 API 应用程序中添加中间件非常直接，只需在 <code>Program.cs</code> 文件中，<code>var app = builder.Build();</code> 之后，在你的 <code>app.Map...()</code> 终结点定义之前，调用相应的 <code>app.Use...()</code> 方法。</p><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">// Program.cs</span>
<span class="line">var builder = WebApplication.CreateBuilder(args);</span>
<span class="line"></span>
<span class="line">// --- 1. 服务注册阶段 (builder.Services.Add...) ---</span>
<span class="line">// 在这里注册你的服务和DI配置</span>
<span class="line">builder.Services.AddAuthentication(); // 例如，注册认证服务</span>
<span class="line">builder.Services.AddAuthorization();</span>
<span class="line">builder.Services.AddRateLimiter(options =&gt; { /* ... */ }); // 注册速率限制策略</span>
<span class="line">builder.Services.AddProblemDetails(); // 注册 ProblemDetails 服务，用于规范化错误响应</span>
<span class="line"></span>
<span class="line">var app = builder.Build();</span>
<span class="line"></span>
<span class="line">// --- 2. 中间件管道配置阶段 (app.Use...) ---</span>
<span class="line"></span>
<span class="line">// 异常处理 (通常在最前面)</span>
<span class="line">if (app.Environment.IsDevelopment())</span>
<span class="line">{</span>
<span class="line">    app.UseDeveloperExceptionPage(); // 开发环境显示详细错误</span>
<span class="line">}</span>
<span class="line">else</span>
<span class="line">{</span>
<span class="line">    // 在生产环境使用 ProblemDetails 中间件来处理异常</span>
<span class="line">    // 它会捕获异常并生成符合 RFC 7807 规范的 JSON 错误响应</span>
<span class="line">    app.UseExceptionHandler(); // 需要 ProblemDetails 服务支持</span>
<span class="line">    // 或 app.UseExceptionHandler(&quot;/Error&quot;); // 如果使用传统的错误页面</span>
<span class="line">    app.UseHsts();</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// HTTPS 重定向</span>
<span class="line">app.UseHttpsRedirection();</span>
<span class="line"></span>
<span class="line">// 静态文件服务</span>
<span class="line">app.UseStaticFiles();</span>
<span class="line"></span>
<span class="line">// 速率限制 (如果在认证之前需要，就在这里；如果限制认证用户，可能在认证之后)</span>
<span class="line">app.UseRateLimiter(); // 启用速率限制中间件</span>
<span class="line"></span>
<span class="line">// 路由 (必须在认证/授权之前)</span>
<span class="line">app.UseRouting();</span>
<span class="line"></span>
<span class="line">// 认证 (Who is the user?)</span>
<span class="line">app.UseAuthentication();</span>
<span class="line"></span>
<span class="line">// 授权 (Can the user do this?)</span>
<span class="line">app.UseAuthorization();</span>
<span class="line"></span>
<span class="line">// --- 3. 终结点定义阶段 (app.Map...) ---</span>
<span class="line">// 在这里定义你的最小 API 终结点</span>
<span class="line">app.MapGet(&quot;/&quot;, () =&gt; &quot;Hello Minimal API World!&quot;);</span>
<span class="line"></span>
<span class="line">app.MapGet(&quot;/weatherforecast&quot;, () =&gt;</span>
<span class="line">{</span>
<span class="line">    var forecast =  Enumerable.Range(1, 5).Select(index =&gt;</span>
<span class="line">        new WeatherForecast</span>
<span class="line">        (</span>
<span class="line">            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),</span>
<span class="line">            Random.Shared.Next(-20, 55),</span>
<span class="line">            Summary[Random.Shared.Next(Summary.Length)]</span>
<span class="line">        ))</span>
<span class="line">        .ToArray();</span>
<span class="line">    return forecast;</span>
<span class="line">})</span>
<span class="line">.WithName(&quot;GetWeatherForecast&quot;)</span>
<span class="line">.WithOpenApi()</span>
<span class="line">.RequireAuthorization(); // 这个终结点需要授权</span>
<span class="line"></span>
<span class="line">app.MapGet(&quot;/limited-data&quot;, () =&gt; &quot;Limited data here!&quot;)</span>
<span class="line">    .RequireRateLimiting(&quot;myFixedPolicy&quot;); // 应用速率限制策略</span>
<span class="line"></span>
<span class="line">// --- 4. 运行应用程序 ---</span>
<span class="line">app.Run();</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">// --- 其他定义 (例如 WeatherForecast 记录) ---</span>
<span class="line">record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)</span>
<span class="line">{</span>
<span class="line">    public int TemperatureF =&gt; 32 + (int)(TemperatureC / 0.5556);</span>
<span class="line">}</span>
<span class="line">static readonly string[] Summary = new[]</span>
<span class="line">{</span>
<span class="line">    &quot;Freezing&quot;, &quot;Bracing&quot;, &quot;Chilly&quot;, &quot;Cool&quot;, &quot;Mild&quot;, &quot;Warm&quot;, &quot;Balmy&quot;, &quot;Hot&quot;, &quot;Sweltering&quot;, &quot;Scorching&quot;</span>
<span class="line">};</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="注意事项" tabindex="-1"><a class="header-anchor" href="#注意事项"><span>注意事项</span></a></h4><p><strong>顺序至关重要：</strong> 和所有 ASP.NET Core 应用程序一样，中间件的顺序决定了它们的执行顺序。例如，<code>app.UseRouting()</code> 必须在 <code>app.UseAuthentication()</code> 和 <code>app.UseAuthorization()</code> 之前。</p><p><strong>终结点特有的中间件：</strong> 最小 API 允许你通过链式调用<code>.Use()</code> 来为<strong>特定终结点</strong>添加中间件。这些中间件只会在请求匹配到该终结点时执行。</p><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">app.MapGet(&quot;/specific-path&quot;, () =&gt; &quot;Specific endpoint!&quot;)</span>
<span class="line">    .Use(async (context, next) =&gt;</span>
<span class="line">    {</span>
<span class="line">        Console.WriteLine(&quot;This middleware only runs for /specific-path&quot;);</span>
<span class="line">        await next(context);</span>
<span class="line">    });</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这与全局 <code>app.Use()</code> 不同，后者应用于所有请求。</p><p><strong>内联中间件：</strong> 你可以在 <code>Program.cs</code> 中直接使用 <code>app.Use()</code> 来定义匿名（内联）中间件，而无需创建单独的中间件类。这对于简单的日志、自定义头部添加等非常方便。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">app.Use(async (context, next) =&gt;</span>
<span class="line">{</span>
<span class="line">    Console.WriteLine($&quot;Request received: {context.Request.Path}&quot;);</span>
<span class="line">    await next(context);</span>
<span class="line">    Console.WriteLine($&quot;Response sent: {context.Response.StatusCode}&quot;);</span>
<span class="line">});</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>服务解析：</strong> 在内联中间件或终结点处理程序中，你可以直接通过方法参数来接收 DI 容器中注册的服务：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">app.MapGet(&quot;/myservice&quot;, (IMyService myService) =&gt;</span>
<span class="line">{</span>
<span class="line">    myService.DoSomething();</span>
<span class="line">    return &quot;Service called!&quot;;</span>
<span class="line">});</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>或者在内联中间件中通过 <code>context.RequestServices.GetService&lt;T&gt;()</code> 来手动解析。</p><h3 id="响应缓存中间件" tabindex="-1"><a class="header-anchor" href="#响应缓存中间件"><span>响应缓存中间件</span></a></h3><p><strong>响应缓存中间件</strong>是一个内置的中间件，它允许你的应用程序<strong>缓存服务器的 HTTP 响应</strong>。当客户端再次请求相同的资源时，如果缓存有效，服务器可以直接从缓存中返回响应，而不需要重新执行完整的业务逻辑（如数据库查询、计算等）。</p><h4 id="工作原理" tabindex="-1"><a class="header-anchor" href="#工作原理"><span>工作原理</span></a></h4><p>响应缓存中间件的工作原理主要基于 <strong>HTTP 缓存头</strong>，特别是 <code>Cache-Control</code> 和 <code>Vary</code> 头部。</p><ol><li><strong>第一次请求：</strong><ul><li>客户端发送请求到服务器。</li><li>请求经过响应缓存中间件。</li><li>中间件将请求传递给管道的后续部分（例如，控制器或 Minimal API 终结点）。</li><li>终结点生成响应。</li><li>响应在返回给客户端之前再次经过响应缓存中间件。</li><li>如果响应包含适当的缓存指令（例如 <code>Cache-Control: public,max-age=60</code>），中间件会将其<strong>存储在服务器的内存缓存中</strong>。</li><li>响应返回给客户端。</li></ul></li><li><strong>后续请求（缓存有效）：</strong><ul><li>客户端再次发送相同请求。</li><li>请求到达响应缓存中间件。</li><li>中间件检查内部缓存。</li><li>如果找到一个有效的、匹配的缓存响应，中间件会<strong>直接从缓存中取出响应并返回给客户端</strong>，而不会将请求传递给管道的后续部分。</li><li><strong>短路：</strong> 这样就“短路”了后续的认证、授权、路由、业务逻辑执行等环节，大大提高了效率。</li></ul></li><li><strong>缓存失效：</strong><ul><li>当缓存时间过期（<code>max-age</code> 到期）或者服务器端数据发生变化（需要通过其他机制使缓存失效，例如通过改变 URL 或手动清除缓存）时，缓存将失效。</li><li>下次请求时，将重新执行完整的流程，生成新的响应并更新缓存。</li></ul></li></ol><h4 id="使用方式-1" tabindex="-1"><a class="header-anchor" href="#使用方式-1"><span>使用方式</span></a></h4><h5 id="服务注册-1" tabindex="-1"><a class="header-anchor" href="#服务注册-1"><span>服务注册</span></a></h5><p>将响应缓存服务添加到 .NET Core 的依赖注入 (DI) 容器中。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">var builder = WebApplication.CreateBuilder(args);</span>
<span class="line"></span>
<span class="line">// 添加响应缓存服务</span>
<span class="line">builder.Services.AddResponseCaching();</span>
<span class="line"></span>
<span class="line">// ... 其他服务注册 ...</span>
<span class="line"></span>
<span class="line">var app = builder.Build();</span>
<span class="line">// ...</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>AddResponseCaching()</code> 默认使用内存缓存来存储响应。你也可以通过重载来配置缓存选项，例如设置默认的缓存大小限制等。</p><h5 id="中间件配置" tabindex="-1"><a class="header-anchor" href="#中间件配置"><span>中间件配置</span></a></h5><p>在管道中启用响应缓存中间件。它应该放在 <strong><code>UseStaticFiles()</code> 之后</strong>（静态文件通常由自己的中间件处理），并且在 <strong><code>UseRouting()</code> 之前</strong>（因为缓存逻辑需要在路由匹配之前介入）。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">// ...</span>
<span class="line">var app = builder.Build();</span>
<span class="line"></span>
<span class="line">app.UseHttpsRedirection();</span>
<span class="line">app.UseStaticFiles();</span>
<span class="line"></span>
<span class="line">// 启用响应缓存中间件</span>
<span class="line">app.UseResponseCaching();</span>
<span class="line"></span>
<span class="line">app.UseRouting();</span>
<span class="line">app.UseAuthentication();</span>
<span class="line">app.UseAuthorization();</span>
<span class="line"></span>
<span class="line">// ... 你的终结点定义 ...</span>
<span class="line"></span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="配置缓存指令-在何处应用缓存" tabindex="-1"><a class="header-anchor" href="#配置缓存指令-在何处应用缓存"><span>配置缓存指令（在何处应用缓存）</span></a></h5><p>光有中间件还不够，还需要告诉 ASP.NET Core <strong>哪些响应可以被缓存，以及如何缓存</strong>。这通常通过以下方式实现：</p><h6 id="使用-responsecache-属性-针对-mvc-razor-pages-api-控制器" tabindex="-1"><a class="header-anchor" href="#使用-responsecache-属性-针对-mvc-razor-pages-api-控制器"><span>使用 <code>[ResponseCache]</code> 属性 (针对 MVC/Razor Pages/API 控制器):</span></a></h6><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">using Microsoft.AspNetCore.Mvc;</span>
<span class="line">using System;</span>
<span class="line"></span>
<span class="line">[ApiController]</span>
<span class="line">[Route(&quot;[controller]&quot;)]</span>
<span class="line">public class ProductsController : ControllerBase</span>
<span class="line">{</span>
<span class="line">    [HttpGet]</span>
<span class="line">    [ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any, NoStore = false)]</span>
<span class="line">    public IActionResult GetAllProducts()</span>
<span class="line">    {</span>
<span class="line">        // 模拟从数据库获取数据</span>
<span class="line">        Console.WriteLine($&quot;Getting all products from DB at {DateTime.Now}&quot;);</span>
<span class="line">        return Ok(new { Timestamp = DateTime.Now, Products = new[] { &quot;Product A&quot;, &quot;Product B&quot; } });</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    [HttpGet(&quot;{id}&quot;)]</span>
<span class="line">    [ResponseCache(Duration = 30, Location = ResponseCacheLocation.Client)]</span>
<span class="line">    public IActionResult GetProductById(int id)</span>
<span class="line">    {</span>
<span class="line">        // 这个响应只在客户端缓存30秒</span>
<span class="line">        Console.WriteLine($&quot;Getting product {id} from DB at {DateTime.Now}&quot;);</span>
<span class="line">        return Ok(new { Timestamp = DateTime.Now, ProductId = id, Name = $&quot;Product {id}&quot; });</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    [HttpGet(&quot;volatile&quot;)]</span>
<span class="line">    [ResponseCache(NoStore = true, Duration = 0)] // 不缓存此响应</span>
<span class="line">    public IActionResult GetVolatileData()</span>
<span class="line">    {</span>
<span class="line">        return Ok(new { Timestamp = DateTime.Now, Data = &quot;This data changes frequently.&quot; });</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p><strong><code>Duration</code></strong>: 缓存的秒数。</p></li><li><p><strong><code>Location</code></strong>: 响应可以在哪里缓存。</p><ul><li><p><code>Any</code> (默认): 可以在客户端和任何共享缓存（如代理服务器）中缓存。</p></li><li><p><code>Client</code>: 只能在客户端（浏览器）中缓存。</p></li><li><p><code>None</code>: 不缓存。</p></li></ul></li><li><p><strong><code>NoStore</code></strong>: 设置 <code>Cache-Control: no-store</code> 头，表示不应缓存响应的任何部分。</p></li><li><p><strong><code>VaryByHeader</code></strong>: 如果响应因某个请求头而异（例如 <code>Accept-Encoding</code>），则可以在这里指定。</p></li><li><p><strong><code>VaryByQueryKeys</code></strong>: 如果响应因某个查询字符串参数而异，则可以在这里指定。例如，<code>VaryByQueryKeys = new string[] { &quot;category&quot; }</code> 意味着 <code>/products?category=food</code> 和 <code>/products?category=drinks</code> 会被单独缓存。</p></li></ul><h6 id="使用-cacheoutput-扩展方法-针对-minimal-api" tabindex="-1"><a class="header-anchor" href="#使用-cacheoutput-扩展方法-针对-minimal-api"><span>使用 <code>.CacheOutput()</code> 扩展方法 (针对 Minimal API):</span></a></h6><p>对于 Minimal API，你可以在终结点定义时使用 <code>CacheOutput()</code> 扩展方法。</p><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">// Program.cs</span>
<span class="line">// ...</span>
<span class="line">app.UseResponseCaching();</span>
<span class="line">app.UseRouting();</span>
<span class="line">// ...</span>
<span class="line"></span>
<span class="line">app.MapGet(&quot;/cached-minimal-api&quot;, () =&gt;</span>
<span class="line">{</span>
<span class="line">    Console.WriteLine($&quot;Executing minimal API at {DateTime.Now}&quot;);</span>
<span class="line">    return Results.Ok(new { Timestamp = DateTime.Now, Message = &quot;This is cached.&quot; });</span>
<span class="line">})</span>
<span class="line">.CacheOutput(policy =&gt; policy.Expire(TimeSpan.FromSeconds(60))); // 缓存60秒</span>
<span class="line"></span>
<span class="line">app.MapGet(&quot;/cached-by-query&quot;, (string? category) =&gt;</span>
<span class="line">{</span>
<span class="line">    Console.WriteLine($&quot;Executing minimal API with category: {category} at {DateTime.Now}&quot;);</span>
<span class="line">    return Results.Ok(new { Timestamp = DateTime.Now, Category = category, Message = &quot;Varies by category.&quot; });</span>
<span class="line">})</span>
<span class="line">.CacheOutput(policy =&gt; policy.Expire(TimeSpan.FromSeconds(30)).VaryByQuery(&quot;category&quot;)); // 缓存30秒，并根据 &quot;category&quot; 查询参数变化</span>
<span class="line"></span>
<span class="line">app.MapGet(&quot;/no-cache&quot;, () =&gt;</span>
<span class="line">{</span>
<span class="line">    Console.WriteLine($&quot;Executing no-cache API at {DateTime.Now}&quot;);</span>
<span class="line">    return Results.Ok(new { Timestamp = DateTime.Now, Message = &quot;This is never cached.&quot; });</span>
<span class="line">})</span>
<span class="line">.CacheOutput(policy =&gt; policy.NoCache()); // 不缓存</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="注意点" tabindex="-1"><a class="header-anchor" href="#注意点"><span>注意点</span></a></h4><ul><li><strong>不是所有响应都适合缓存：</strong> 包含敏感用户数据、频繁变化或高度个性化的响应不应被缓存。</li><li><strong>缓存过期和失效：</strong> 确保你理解缓存的过期机制 (<code>Duration</code>)，并有策略来<strong>使缓存失效</strong>（例如，当数据更新时）。直接改变 URL 或在 <code>ResponseCache</code> 属性中配置 <code>VaryByQueryKeys</code> 是常见的失效策略。</li><li><strong>认证与授权：</strong> 缓存的响应是针对<strong>所有</strong>客户端的。如果你的响应根据用户身份或权限而不同，那么缓存可能会导致安全问题或不一致的数据。在这种情况下，你需要确保缓存的键包含了所有影响响应的因素（例如，通过 <code>Vary</code> 头），或者避免缓存这些响应。</li><li><strong>动态内容：</strong> 除非你精心管理 <code>Vary</code> 头或分区，否则通常不建议缓存依赖于请求头、Cookie 或查询字符串的动态内容。</li><li><strong>缓存位置：</strong> <code>ResponseCacheLocation</code> 决定了响应可以在哪里被缓存。<code>Any</code> 最激进，可能被共享代理缓存。<code>Client</code> 只在用户浏览器缓存。</li></ul><h3 id="请求与响应操作" tabindex="-1"><a class="header-anchor" href="#请求与响应操作"><span>请求与响应操作</span></a></h3><p>这俩东西框架已经封装好了，一般不需要手动写相关代码。</p><h4 id="流" tabindex="-1"><a class="header-anchor" href="#流"><span>流</span></a></h4><h4 id="管道" tabindex="-1"><a class="header-anchor" href="#管道"><span>管道</span></a></h4><h3 id="请求解压缩中间件" tabindex="-1"><a class="header-anchor" href="#请求解压缩中间件"><span>请求解压缩中间件</span></a></h3><h4 id="定义-1" tabindex="-1"><a class="header-anchor" href="#定义-1"><span>定义</span></a></h4><p><strong>请求解压缩中间件</strong>是 ASP.NET Core 管道中的一个组件，它负责检测传入 HTTP 请求中是否包含已压缩的请求体。如果请求体被压缩了，中间件会根据 <code>Content-Encoding</code> 头部指示的压缩算法（例如 Gzip 或 Brotli）自动对其进行解压缩，然后将解压后的数据流传递给应用程序的后续部分（例如，Minimal API、MVC 控制器）。</p><p>这样，应用程序代码就可以直接处理解压后的原始数据，而无需手动编写解压缩逻辑。</p><h4 id="使用方法-3" tabindex="-1"><a class="header-anchor" href="#使用方法-3"><span>使用方法</span></a></h4><h5 id="服务注册-program-cs-的-builder-services-部分-1" tabindex="-1"><a class="header-anchor" href="#服务注册-program-cs-的-builder-services-部分-1"><span>服务注册 (<code>Program.cs</code> 的 <code>builder.Services</code> 部分)</span></a></h5><p>将请求解压缩服务添加到 ASP.NET Core 的依赖注入 (DI) 容器中</p><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">// Program.cs</span>
<span class="line">var builder = WebApplication.CreateBuilder(args);</span>
<span class="line"></span>
<span class="line">// 添加请求解压缩服务</span>
<span class="line">builder.Services.AddRequestDecompression();</span>
<span class="line"></span>
<span class="line">// ... 其他服务注册，例如 AddControllers(), AddEndpointsApiExplorer() ...</span>
<span class="line"></span>
<span class="line">var app = builder.Build();</span>
<span class="line">// ...</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>AddRequestDecompression()</code> 方法默认支持 <strong>Gzip</strong> 和 <strong>Brotli</strong> 压缩算法。你也可以通过重载来配置支持的压缩算法或添加自定义算法。</p><p>DEMO:配置请求解压缩选项</p><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">builder.Services.AddRequestDecompression(options =&gt;</span>
<span class="line">{</span>
<span class="line">    // 默认已启用 Gzip 和 Brotli</span>
<span class="line">    options.Providers.Add&lt;BrotliRequestDecompressionProvider&gt;();</span>
<span class="line">    options.Providers.Add&lt;GzipRequestDecompressionProvider&gt;();</span>
<span class="line"></span>
<span class="line">    // 如果你不希望它在压缩失败时抛出异常，可以设置为 false</span>
<span class="line">    options.EnableRequestBodyCompression = true; // 默认为 true</span>
<span class="line">    // options.SkipDecompressionWhenBodyLengthIsZero = true; // 默认为 true</span>
<span class="line">});</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="中间件配置-program-cs-的-app-部分-1" tabindex="-1"><a class="header-anchor" href="#中间件配置-program-cs-的-app-部分-1"><span>中间件配置 (<code>Program.cs</code> 的 <code>app</code> 部分)</span></a></h5><p>在管道中启用请求解压缩中间件。它应该放置在管道中较早的位置，通常在需要读取请求体的中间件之前。</p><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">// Program.cs</span>
<span class="line">// ...</span>
<span class="line">var app = builder.Build();</span>
<span class="line"></span>
<span class="line">app.UseHttpsRedirection();</span>
<span class="line">app.UseStaticFiles();</span>
<span class="line"></span>
<span class="line">// 启用请求解压缩中间件</span>
<span class="line">// 应该在任何尝试读取或解析请求体的中间件之前</span>
<span class="line">app.UseRequestDecompression();</span>
<span class="line"></span>
<span class="line">app.UseRouting();</span>
<span class="line">app.UseAuthentication();</span>
<span class="line">app.UseAuthorization();</span>
<span class="line"></span>
<span class="line">// ... 你的终结点定义 ...</span>
<span class="line"></span>
<span class="line">// 示例：一个接受 POST 请求的 Minimal API 终结点</span>
<span class="line">app.MapPost(&quot;/data&quot;, async (HttpRequest request) =&gt;</span>
<span class="line">{</span>
<span class="line">    // 这里的 request.Body 会自动是解压后的流</span>
<span class="line">    using var reader = new StreamReader(request.Body);</span>
<span class="line">    var content = await reader.ReadToEndAsync();</span>
<span class="line">    Console.WriteLine($&quot;Received decompressed content: {content.Length} chars.&quot;);</span>
<span class="line">    return Results.Ok($&quot;Received decompressed content: {content}&quot;);</span>
<span class="line">});</span>
<span class="line"></span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="客户端如何发送压缩请求" tabindex="-1"><a class="header-anchor" href="#客户端如何发送压缩请求"><span>客户端如何发送压缩请求</span></a></h4><p>客户端需要设置 <code>Content-Encoding</code> 请求头，并实际对请求体进行压缩。</p><p>DEMO: (使用 C# <code>HttpClient</code> 发送 Gzip 压缩请求)：</p><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">using System.IO.Compression;</span>
<span class="line">using System.Net.Http.Headers;</span>
<span class="line">using System.Text;</span>
<span class="line"></span>
<span class="line">public class MyApiClient</span>
<span class="line">{</span>
<span class="line">    private readonly HttpClient _httpClient;</span>
<span class="line"></span>
<span class="line">    public MyApiClient(HttpClient httpClient)</span>
<span class="line">    {</span>
<span class="line">        _httpClient = httpClient;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public async Task SendCompressedData(string url, string data)</span>
<span class="line">    {</span>
<span class="line">        using var memoryStream = new MemoryStream();</span>
<span class="line">        // 使用 GZipStream 压缩数据</span>
<span class="line">        using (var gzipStream = new GZipStream(memoryStream, CompressionMode.Compress, true))</span>
<span class="line">        using (var writer = new StreamWriter(gzipStream, Encoding.UTF8))</span>
<span class="line">        {</span>
<span class="line">            await writer.WriteAsync(data);</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        memoryStream.Position = 0; // 重置流位置到开始</span>
<span class="line"></span>
<span class="line">        // 创建 HttpContent</span>
<span class="line">        var content = new StreamContent(memoryStream);</span>
<span class="line">        // 设置 Content-Type</span>
<span class="line">        content.Headers.ContentType = new MediaTypeHeaderValue(&quot;application/json&quot;);</span>
<span class="line">        // 设置 Content-Encoding 头，告知服务器数据已压缩</span>
<span class="line">        content.Headers.ContentEncoding.Add(&quot;gzip&quot;);</span>
<span class="line"></span>
<span class="line">        // 发送 POST 请求</span>
<span class="line">        var response = await _httpClient.PostAsync(url, content);</span>
<span class="line"></span>
<span class="line">        response.EnsureSuccessStatusCode();</span>
<span class="line">        Console.WriteLine($&quot;Compressed request sent. Response: {await response.Content.ReadAsStringAsync()}&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 在 Program.cs 或其他地方调用</span>
<span class="line">// var client = new MyApiClient(new HttpClient());</span>
<span class="line">// await client.SendCompressedData(&quot;https://localhost:7199/data&quot;, &quot;This is some large data that will be compressed.&quot;);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="基于工厂的中间件" tabindex="-1"><a class="header-anchor" href="#基于工厂的中间件"><span>基于工厂的中间件</span></a></h3><p>中间件通常有两种实现方式：一种是直接在 <code>InvokeAsync</code> 方法中注入依赖（称为<strong>约定式中间件</strong>或<strong>请求管道中间件</strong>），另一种就是我们现在要讨论的基于工厂的方式。</p><p>基于工厂的中间件允许你通过<strong>依赖注入 (DI)</strong> 来更灵活地管理中间件自身的生命周期和其内部依赖的生命周期。</p><h4 id="问题引入" tabindex="-1"><a class="header-anchor" href="#问题引入"><span>问题引入</span></a></h4><p>自定义中间件是这样写的：</p><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">public class MyMiddleware</span>
<span class="line">{</span>
<span class="line">    private readonly RequestDelegate _next;</span>
<span class="line">    private readonly IMyService _myService; // 假设 IMyService 是单例或瞬态服务</span>
<span class="line"></span>
<span class="line">    // 构造函数注入依赖</span>
<span class="line">    public MyMiddleware(RequestDelegate next, IMyService myService)</span>
<span class="line">    {</span>
<span class="line">        _next = next;</span>
<span class="line">        _myService = myService; // 这个 MyService 实例的生命周期由 DI 容器决定</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public async Task InvokeAsync(HttpContext context)</span>
<span class="line">    {</span>
<span class="line">        // 使用 _myService</span>
<span class="line">        _myService.DoSomething();</span>
<span class="line">        await _next(context);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种标准方式非常方便。但它有一个潜在的“陷阱”：<strong>如果 <code>IMyService</code> 是一个作用域 (Scoped) 服务，那么每次 HTTP 请求，<code>MyMiddleware</code> 都会被实例化一次。</strong> 这通常不是问题，因为中间件本身就是按请求生命周期处理的。</p><p>然而，如果你的中间件<strong>自己有一些很重的初始化操作</strong>，或者它需要依赖于<strong>另一个生命周期更长的服务</strong>，比如一个单例服务，你可能不希望每次请求都重新创建中间件实例。</p><p>基于工厂的中间件就是为了解决这种场景：它允许你<strong>控制中间件的实例化方式</strong>，并且可以在中间件自身的构造函数中注入<strong>单例服务</strong>，而在 <code>InvokeAsync</code> 方法中通过 <code>HttpContext</code> 获取<strong>作用域服务</strong>。</p><h4 id="实现方法" tabindex="-1"><a class="header-anchor" href="#实现方法"><span>实现方法</span></a></h4><p>基于工厂的中间件需要实现 <code>IMiddleware</code> 接口。</p><ol><li>定义基于工厂的中间类</li></ol><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">using Microsoft.AspNetCore.Http;</span>
<span class="line">using System.Threading.Tasks;</span>
<span class="line">using Microsoft.Extensions.Logging; // 假设你需要日志</span>
<span class="line"></span>
<span class="line">// 1. 定义中间件接口和实现</span>
<span class="line">public interface IMyService</span>
<span class="line">{</span>
<span class="line">    void LogOperation(string message);</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">public class MyScopedService : IMyService</span>
<span class="line">{</span>
<span class="line">    private readonly ILogger&lt;MyScopedService&gt; _logger;</span>
<span class="line">    private readonly Guid _instanceId;</span>
<span class="line"></span>
<span class="line">    public MyScopedService(ILogger&lt;MyScopedService&gt; logger)</span>
<span class="line">    {</span>
<span class="line">        _logger = logger;</span>
<span class="line">        _instanceId = Guid.NewGuid();</span>
<span class="line">        _logger.LogInformation($&quot;MyScopedService instance {_instanceId} created.&quot;);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public void LogOperation(string message)</span>
<span class="line">    {</span>
<span class="line">        _logger.LogInformation($&quot;Scoped service {_instanceId}: {message}&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">// 这是基于工厂的中间件类，实现了 IMiddleware 接口</span>
<span class="line">public class FactoryBasedLoggingMiddleware : IMiddleware</span>
<span class="line">{</span>
<span class="line">    private readonly ILogger&lt;FactoryBasedLoggingMiddleware&gt; _logger;</span>
<span class="line">    private readonly Guid _instanceId;</span>
<span class="line"></span>
<span class="line">    // 构造函数：这里只能注入单例服务或自行创建的对象</span>
<span class="line">    // RequestDelegate _next 参数不再在构造函数中，因为它是在 InvokeAsync 中提供的</span>
<span class="line">    public FactoryBasedLoggingMiddleware(ILogger&lt;FactoryBasedLoggingMiddleware&gt; logger)</span>
<span class="line">    {</span>
<span class="line">        _logger = logger;</span>
<span class="line">        _instanceId = Guid.NewGuid(); // 用于观察中间件实例的生命周期</span>
<span class="line">        _logger.LogInformation($&quot;FactoryBasedLoggingMiddleware instance {_instanceId} created (probably once).&quot;);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    // InvokeAsync 方法：通过 HttpContext.RequestServices 获取作用域服务</span>
<span class="line">    public async Task InvokeAsync(HttpContext context, RequestDelegate next)</span>
<span class="line">    {</span>
<span class="line">        // 可以在这里通过 HttpContext 获取作用域（或瞬态）服务</span>
<span class="line">        // 这个 IMyService 是针对当前请求作用域的实例</span>
<span class="line">        var myScopedService = context.RequestServices.GetRequiredService&lt;IMyService&gt;();</span>
<span class="line"></span>
<span class="line">        _logger.LogInformation($&quot;Middleware {_instanceId} handling request for {context.Request.Path}.&quot;);</span>
<span class="line">        myScopedService.LogOperation(&quot;Request started in FactoryBasedLoggingMiddleware.&quot;);</span>
<span class="line"></span>
<span class="line">        await next(context); // 调用管道中的下一个中间件</span>
<span class="line"></span>
<span class="line">        myScopedService.LogOperation(&quot;Request finished in FactoryBasedLoggingMiddleware.&quot;);</span>
<span class="line">        _logger.LogInformation($&quot;Middleware {_instanceId} finished request for {context.Request.Path}. Status: {context.Response.StatusCode}&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>注册服务和中间件到DI容器</li></ol><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">// Program.cs</span>
<span class="line">var builder = WebApplication.CreateBuilder(args);</span>
<span class="line"></span>
<span class="line">// 注册你的 Scoped 服务</span>
<span class="line">builder.Services.AddScoped&lt;IMyService, MyScopedService&gt;();</span>
<span class="line"></span>
<span class="line">// 注册基于工厂的中间件本身</span>
<span class="line">// 由于它实现了 IMiddleware，你需要像注册其他服务一样注册它</span>
<span class="line">// 这里我们注册为 Transient，这意味着每次通过 UseMiddleware&lt;T&gt;() 引用它时，都会尝试创建一个新实例。</span>
<span class="line">// 但因为 UseMiddleware&lt;T&gt;() 在内部会缓存 IMiddlewareFactory，</span>
<span class="line">// 实际上这个 IMiddleware 实例的生命周期取决于你是如何添加它的。</span>
<span class="line">builder.Services.AddTransient&lt;FactoryBasedLoggingMiddleware&gt;();</span>
<span class="line"></span>
<span class="line">// ... 其他服务注册 ...</span>
<span class="line"></span>
<span class="line">var app = builder.Build();</span>
<span class="line"></span>
<span class="line">// --- 中间件管道配置 ---</span>
<span class="line"></span>
<span class="line">// 使用 UseMiddleware&lt;T&gt;() 添加基于工厂的中间件</span>
<span class="line">// ASP.NET Core 内部会使用 IServiceProvider 来解析 FactoryBasedLoggingMiddleware 实例。</span>
<span class="line">app.UseMiddleware&lt;FactoryBasedLoggingMiddleware&gt;();</span>
<span class="line"></span>
<span class="line">app.MapGet(&quot;/&quot;, () =&gt; &quot;Hello World!&quot;);</span>
<span class="line"></span>
<span class="line">// ... 其他终结点 ...</span>
<span class="line"></span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h4 id="基于工厂中间件的生命周期和依赖注入" tabindex="-1"><a class="header-anchor" href="#基于工厂中间件的生命周期和依赖注入"><span>基于工厂中间件的生命周期和依赖注入</span></a></h4><ul><li><strong>中间件自身的生命周期：</strong> 当你使用 <code>app.UseMiddleware&lt;T&gt;()</code> 时，ASP.NET Core 内部会使用 <code>IMiddlewareFactory</code>（默认实现是 <code>MiddlewareFactory</code>）来创建中间件实例。默认情况下，<code>IMiddlewareFactory</code> 会从根服务提供者 (Root Service Provider) 请求中间件的实例。 <ul><li>如果你将 <code>FactoryBasedLoggingMiddleware</code> 注册为 <code>AddSingleton</code>：那么中间件实例只会被创建一次，并在整个应用程序生命周期中重用。它的构造函数依赖（如 <code>ILogger</code>）也会是单例的。</li><li>如果你将 <code>FactoryBasedLoggingMiddleware</code> 注册为 <code>AddTransient</code> 或 <code>AddScoped</code>：虽然注册的是 <code>Transient</code> 或 <code>Scoped</code>，但 <code>app.UseMiddleware&lt;T&gt;()</code> 默认情况下会<strong>缓存第一个解析到的实例</strong>并在所有请求中重用这个实例。这意味着即使你注册为 <code>Transient</code> 或 <code>Scoped</code>，它实际上也可能表现得像一个单例。 <ul><li><strong>例外：</strong> 如果你是在一个分支管道 (<code>app.Map()</code>, <code>app.MapWhen()</code>, <code>app.UseWhen()</code>) 中使用 <code>app.UseMiddleware&lt;T&gt;()</code>，并且该分支通过 <code>app.ApplicationServices.CreateScope()</code> 创建了新的作用域，那么中间件的生命周期可能更符合你注册的服务生命周期。但通常情况下，它的生命周期是单例的。</li></ul></li></ul></li><li><strong>中间件内部依赖的生命周期：</strong><ul><li>通过构造函数注入的依赖 (<code>ILogger</code>): 这些依赖的生命周期与中间件实例的生命周期一致。如果中间件是单例的，那么构造函数注入的依赖也必须是单例的，或者能够被单例依赖（即不能注入作用域或瞬态服务）。</li><li>通过 <code>InvokeAsync</code> 方法注入（通过 <code>HttpContext.RequestServices.GetRequiredService&lt;T&gt;()</code> 或作为 <code>InvokeAsync</code> 参数）的依赖 (<code>IMyService</code>): 这些依赖的生命周期<strong>与当前请求的作用域一致</strong>。这意味着你可以安全地在 <code>InvokeAsync</code> 中获取作用域服务（如 <code>DbContext</code>），而不用担心生命周期冲突。</li></ul></li></ul><hr><h4 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h4><p>基于工厂的中间件（实现 <code>IMiddleware</code> 接口）提供了一种更灵活的方式来管理中间件本身的依赖注入。</p><ul><li><strong>优点：</strong><ul><li>允许在中间件的<strong>构造函数中注入单例服务</strong>，避免每次请求都创建中间件实例，从而优化性能。</li><li>允许在 <code>InvokeAsync</code> 方法中<strong>按请求作用域获取服务</strong>（如数据库上下文），而不会引起生命周期冲突。</li><li>更清晰地分离了中间件的生命周期管理和其内部依赖的生命周期管理。</li></ul></li><li><strong>缺点：</strong><ul><li>比传统的约定式中间件稍微复杂一点。</li></ul></li></ul><p>在大多数情况下，传统的约定式中间件（构造函数直接注入 <code>RequestDelegate next</code> 和所有依赖）已经足够，因为它更简洁。但当你的中间件有复杂的初始化逻辑，或其依赖的生命周期需要更精细的控制时，基于工厂的中间件就显得非常有用。</p><h3 id="使用第三方容器的基于工厂的中间件" tabindex="-1"><a class="header-anchor" href="#使用第三方容器的基于工厂的中间件"><span>使用第三方容器的基于工厂的中间件</span></a></h3><h2 id="主机" tabindex="-1"><a class="header-anchor" href="#主机"><span>主机</span></a></h2><p>在<strong>最小 API (Minimal API)</strong> 架构中，<code>WebApplication</code> 和 <code>WebApplicationBuilder</code> 是构建和运行 ASP.NET Core 应用程序的<strong>首选和最简洁</strong>的方式。它们是 ASP.NET Core 团队对泛型主机进行简化和优化的结果，专为 Web 应用设计。</p><h3 id="webapplicationbuilder" tabindex="-1"><a class="header-anchor" href="#webapplicationbuilder"><span>WebApplicationBuilder</span></a></h3><p><strong>角色：</strong> 负责<strong>构建</strong> <code>WebApplication</code> 实例。它是配置和注册应用程序所有服务和中间件的起点。</p><p><strong>创建方式：</strong> 通过静态方法 <code>WebApplication.CreateBuilder(args)</code> 创建。</p><p><strong>功能：</strong></p><ul><li><strong>自动配置：</strong> <code>CreateBuilder</code> 方法会自动进行大量默认配置，包括： <ul><li>使用 <strong>Kestrel</strong> 作为默认 Web 服务器。</li><li>从 <code>appsettings.json</code>、<code>appsettings.{EnvironmentName}.json</code>、环境变量和命令行参数加载配置。</li><li>配置默认的日志提供程序（如控制台、调试输出、EventSource）。</li><li>启用依赖注入 (DI)。</li></ul></li><li><strong><code>builder.Services</code>：</strong> 提供一个 <code>IServiceCollection</code> 实例，用于向 DI 容器注册应用程序的服务。</li><li><strong><code>builder.Configuration</code>：</strong> 提供对应用程序配置的访问。</li><li><strong><code>builder.Environment</code>：</strong> 提供对当前运行环境（如 <code>Development</code>、<code>Production</code>）的访问。</li><li><strong><code>builder.Logging</code>：</strong> 配置日志。</li><li><strong><code>builder.WebHost</code>：</strong> 允许对底层的 Web 主机进行更底层的配置（例如更改 Kestrel 选项、绑定 URL 等），虽然在 <code>WebApplicationBuilder</code> 中大部分常用配置已被简化。</li></ul><h3 id="webapplication" tabindex="-1"><a class="header-anchor" href="#webapplication"><span>WebApplication</span></a></h3><p><strong>角色：</strong> 代表了<strong>已构建完成且可运行</strong>的 ASP.NET Core 应用程序实例（也就是<strong>主机</strong>本身）。它包含了配置好的服务容器和请求处理管道。</p><p><strong>创建方式：</strong> 通过 <code>builder.Build()</code> 方法从 <code>WebApplicationBuilder</code> 创建。</p><p><strong>功能：</strong></p><ul><li><strong>中间件管道配置：</strong> 通过一系列 <code>app.Use...()</code> 方法来定义 HTTP 请求的管道。</li><li><strong>终结点路由：</strong> 通过 <code>app.MapGet()</code>、<code>app.MapPost()</code> 等方法定义 Minimal API 终结点，或通过 <code>app.MapControllers()</code>、<code>app.MapRazorPages()</code> 映射 MVC/Razor Pages。</li><li><strong>运行应用程序：</strong> 调用 <code>app.Run()</code> 来启动 Web 服务器并开始监听 HTTP 请求。</li><li><strong><code>app.Services</code>：</strong> 运行时服务提供者（<code>IServiceProvider</code>）。</li><li><strong><code>app.Configuration</code>：</strong> 运行时配置。</li><li><strong><code>app.Lifetime</code>：</strong> 应用程序生命周期事件。</li></ul><hr><p><code>WebApplication</code> 和 <code>WebApplicationBuilder</code> 是 .NET 6+ 时代 ASP.NET Core Web 应用最推荐的启动方式，它们在简洁性、自动化配置和开发体验上达到了最佳平衡。它在内部封装了泛型主机和 Web 主机的大部分复杂性。</p><h3 id="泛型主机" tabindex="-1"><a class="header-anchor" href="#泛型主机"><span>泛型主机</span></a></h3><p><strong>泛型主机 (Generic Host)</strong> 是 .NET Core 2.1 引入的，它是一个<strong>通用且不限于 Web 应用</strong>的宿主模型。它设计的目标是为所有类型的 .NET 应用程序（包括控制台应用、后台服务、ASP.NET Core Web 应用等）提供一个统一的生命周期、配置、DI 和日志管理框架。</p><p><strong>核心概念</strong></p><ul><li><strong><code>IHost</code> 接口：</strong> 代表了泛型主机实例。</li><li><strong><code>IHostBuilder</code> 接口：</strong> 用于构建 <code>IHost</code> 实例。</li></ul><p><strong>创建和配置方式</strong></p><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">// Program.cs (泛型主机，不一定用于Web，但Web应用底层也用它)</span>
<span class="line">using Microsoft.Extensions.Hosting; // 核心命名空间</span>
<span class="line"></span>
<span class="line">public class Program</span>
<span class="line">{</span>
<span class="line">    public static void Main(string[] args)</span>
<span class="line">    {</span>
<span class="line">        CreateHostBuilder(args).Build().Run();</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public static IHostBuilder CreateHostBuilder(string[] args) =&gt;</span>
<span class="line">        Host.CreateDefaultBuilder(args) // 默认配置，包括配置、日志、DI</span>
<span class="line">            .ConfigureServices((hostContext, services) =&gt; // 配置应用程序的服务</span>
<span class="line">            {</span>
<span class="line">                // 注册后台服务</span>
<span class="line">                services.AddHostedService&lt;MyBackgroundService&gt;();</span>
<span class="line">                // 注册其他服务...</span>
<span class="line">            })</span>
<span class="line">            .ConfigureAppConfiguration((hostContext, config) =&gt; // 配置应用程序配置</span>
<span class="line">            {</span>
<span class="line">                // config.AddJsonFile(...)</span>
<span class="line">            })</span>
<span class="line">            .ConfigureLogging((hostContext, logging) =&gt; // 配置日志</span>
<span class="line">            {</span>
<span class="line">                // logging.AddConsole()</span>
<span class="line">            })</span>
<span class="line">            .ConfigureWebHostDefaults(webBuilder =&gt; // 如果要添加Web功能，需要这个扩展</span>
<span class="line">            {</span>
<span class="line">                webBuilder.UseStartup&lt;Startup&gt;(); // 旧版或更复杂的Web配置</span>
<span class="line">                // 或者直接 webBuilder.UseKestrel().UseUrls(...)</span>
<span class="line">            });</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// Startup.cs (如果使用 UseStartup)</span>
<span class="line">public class Startup</span>
<span class="line">{</span>
<span class="line">    public void ConfigureServices(IServiceCollection services)</span>
<span class="line">    {</span>
<span class="line">        // Add Web-specific services</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public void Configure(IApplicationBuilder app)</span>
<span class="line">    {</span>
<span class="line">        // Configure Web-specific middleware pipeline</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>关键特性</strong></p><ul><li><strong>通用性：</strong> 可以运行任何基于 .NET Core 的应用，不局限于 Web。</li><li><strong>统一抽象：</strong> 为配置、日志、DI、生命周期管理等提供了一致的接口。</li><li><strong><code>IHostedService</code>：</strong> 这是泛型主机的一大亮点，用于运行后台任务和长时间运行的服务，与 Web 请求生命周期解耦。</li><li><strong>可扩展性：</strong> 通过 <code>ConfigureServices</code>, <code>ConfigureAppConfiguration</code>, <code>ConfigureLogging</code>, <code>ConfigureWebHostDefaults</code> 等方法链式配置。</li></ul><p><strong>小结</strong></p><p>泛型主机是 ASP.NET Core 应用程序更底层、更通用的宿主框架。虽然 <code>WebApplication.CreateBuilder</code> 在 Web 应用中简化了它的用法，但理解泛型主机有助于深入理解 ASP.NET Core 的架构，尤其是在构建后台服务或非 Web 应用时非常有用。它提供了一个更模块化、可测试的应用程序结构。</p><h3 id="web主机" tabindex="-1"><a class="header-anchor" href="#web主机"><span>Web主机</span></a></h3><p><strong>Web 主机 (Web Host)</strong> 是 ASP.NET Core 1.x 和 2.0 时代的<strong>旧版 Web 专用主机模型</strong>。它由 <code>Microsoft.AspNetCore.WebHost</code> 类和 <code>IWebHost</code> 接口组成。</p><p><strong>创建和配置方式</strong></p><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">// Program.cs (Web主机 - 旧版)</span>
<span class="line">using Microsoft.AspNetCore.Hosting; // 核心命名空间</span>
<span class="line"></span>
<span class="line">public class Program</span>
<span class="line">{</span>
<span class="line">    public static void Main(string[] args)</span>
<span class="line">    {</span>
<span class="line">        CreateWebHostBuilder(args).Build().Run();</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =&gt;</span>
<span class="line">        WebHost.CreateDefaultBuilder(args) // 默认配置Web相关服务</span>
<span class="line">            .UseStartup&lt;Startup&gt;(); // 指定Startup类来配置服务和请求管道</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// Startup.cs (与泛型主机中的Startup类似，但更紧密耦合于Web)</span>
<span class="line">public class Startup</span>
<span class="line">{</span>
<span class="line">    public void ConfigureServices(IServiceCollection services)</span>
<span class="line">    {</span>
<span class="line">        // Add Web-specific services</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public void Configure(IApplicationBuilder app)</span>
<span class="line">    {</span>
<span class="line">        // Configure Web-specific middleware pipeline</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>关键特性</strong></p><ul><li><strong>Web 专用：</strong> 只能用于托管 Web 应用程序。</li><li><strong><code>Startup</code> 类：</strong> 这是 Web 主机（以及早期泛型主机中）配置服务和中间件的核心。<code>Startup</code> 类包含 <code>ConfigureServices</code> 和 <code>Configure</code> 方法。</li><li><strong>已弃用：</strong> 在 .NET Core 2.1 引入泛型主机后，Web 主机已被标记为<strong>过时 (deprecated)</strong>。尽管它仍然可以工作，但官方推荐使用泛型主机（或其简化形式 <code>WebApplication</code>）。</li></ul><p><strong>小结</strong></p><p>Web 主机是 ASP.NET Core 发展早期用于托管 Web 应用的专用宿主。它已被更通用、更强大的<strong>泛型主机</strong>及其在 .NET 6+ 中的简化版本 <strong><code>WebApplication</code></strong> 所取代。在新的项目中，你几乎不会再手动创建 Web 主机。</p><hr><p>这三者代表了 ASP.NET Core <strong>主机模型</strong> 的演进：</p><ol><li><strong>Web 主机 (ASP.NET Core 1.x - 2.0)</strong>：最初的 Web 应用专用宿主。</li><li><strong>泛型主机 (ASP.NET Core 2.1+)</strong>：为了提供一个通用的宿主模型，将 Web 主机的功能提取并通用化，使其可以托管任何类型的 .NET 应用，并通过 <code>ConfigureWebHostDefaults</code> 扩展来支持 Web 功能。</li><li><strong>WebApplication 和 WebApplicationBuilder (ASP.NET Core 6.0+)</strong>：在泛型主机之上，进一步为 Web 应用提供了一个<strong>高度优化和简化的抽象</strong>。它隐藏了 <code>IHostBuilder</code> 和 <code>IHost</code> 的大部分底层细节，直接在 <code>Program.cs</code> 中提供了简洁的配置和启动体验，尤其适合最小 API 和更简单的 Web 应用，但其底层仍然是基于泛型主机构建的。</li></ol><h2 id="配置" tabindex="-1"><a class="header-anchor" href="#配置"><span>配置</span></a></h2><h3 id="配置提供程序" tabindex="-1"><a class="header-anchor" href="#配置提供程序"><span>配置提供程序</span></a></h3><h4 id="文件提供程序" tabindex="-1"><a class="header-anchor" href="#文件提供程序"><span>文件提供程序</span></a></h4><ul><li><code>appsettings.json</code>：默认的主配置文件。</li><li><code>appsettings.{EnvironmentName}.json</code>：环境特定文件（例如 <code>appsettings.Development.json</code> 用于开发环境，<code>appsettings.Production.json</code> 用于生产环境）。</li><li>可以通过 <code>AddXmlFile()</code> 或 <code>AddIniFile()</code> 添加其他格式的文件。</li></ul><h4 id="环境变量提供程序" tabindex="-1"><a class="header-anchor" href="#环境变量提供程序"><span>环境变量提供程序</span></a></h4><ul><li>从操作系统环境变量中读取配置。这是在生产环境管理敏感信息（如连接字符串、API 密钥）的<strong>推荐方式</strong>，因为环境变量不会被提交到版本控制。键名通常遵循约定，例如 <code>MySettings__Setting1</code>。</li></ul><h4 id="命令行参数提供程序" tabindex="-1"><a class="header-anchor" href="#命令行参数提供程序"><span>命令行参数提供程序</span></a></h4><ul><li>从应用启动时的命令行参数中读取配置，例如 <code>dotnet run --Logging:LogLevel:Default Debug</code>。 <ul><li><code>dotnet run MyKey=&quot;Using =&quot; Position:Title=Cmd Position:Name=Cmd_Rick</code></li><li><code>dotnet run /MyKey &quot;Using /&quot; /Position:Title=Cmd /Position:Name=Cmd_Rick</code></li><li><code>dotnet run --MyKey &quot;Using --&quot; --Position:Title=Cmd --Position:Name=Cmd_Rick</code></li></ul></li></ul><h4 id="用户秘密提供程序-user-secrets" tabindex="-1"><a class="header-anchor" href="#用户秘密提供程序-user-secrets"><span>用户秘密提供程序 (User Secrets)</span></a></h4><ul><li><p>用于存储敏感信息。这些秘密存储在本地用户配置文件的一个 JSON 文件中，不会被提交到源代码管理。</p></li><li><p><strong>使用方式：</strong></p><ul><li><p>在 Visual Studio 中，右键点击你的项目 (<code>.csproj</code> 文件) -&gt; 选择 &quot;管理用户机密&quot; (Manage User Secrets)。</p><p>Visual Studio 会自动为你的项目创建一个 <code>UserSecretsId</code>，并打开一个名为 <code>secrets.json</code> 的文件。</p></li><li><p>在你的项目根目录（包含 <code>.csproj</code> 文件的目录）下，运行以下命令：<code>dotnet user-secrets init</code>,这个命令会在你的 <code>.csproj</code> 文件中添加一个 <code>&lt;UserSecretsId&gt;</code> 元素，例如：</p><div class="language-XML line-numbers-mode" data-highlighter="prismjs" data-ext="XML"><pre><code class="language-XML"><span class="line">&lt;PropertyGroup&gt;</span>
<span class="line">  &lt;UserSecretsId&gt;your-unique-guid-here&lt;/UserSecretsId&gt;</span>
<span class="line">&lt;/PropertyGroup&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后，你可以打开 <code>secrets.json</code> 文件进行编辑。要打开它，可以运行：<code>dotnet user-secrets open</code></p></li></ul></li></ul><h3 id="配置加载顺序与覆盖规则" tabindex="-1"><a class="header-anchor" href="#配置加载顺序与覆盖规则"><span>配置加载顺序与覆盖规则</span></a></h3><p>配置提供程序是有优先级的，<strong>后添加或加载的提供程序会覆盖前面提供程序中的相同键的值</strong>。</p><p><strong><code>WebApplication.CreateBuilder</code>（或 <code>Host.CreateDefaultBuilder</code>）的默认加载顺序：</strong></p><ol><li><code>appsettings.json</code></li><li><code>appsettings.{EnvironmentName}.json</code> (例如 <code>appsettings.Development.json</code>)</li><li>用户秘密 (User Secrets) <strong>（仅在 <code>Development</code> 环境中加载）</strong></li><li>环境变量</li><li>命令行参数</li></ol><h3 id="在程序中读取-使用配置" tabindex="-1"><a class="header-anchor" href="#在程序中读取-使用配置"><span>在程序中读取/使用配置</span></a></h3><p>配置系统将所有加载的键值对组织成一个<strong>层次结构</strong>。可以通过 <code>IConfiguration</code> 接口访问这些数据。</p><ul><li><strong><code>IConfiguration</code></strong>：表示整个配置的根对象。</li><li><strong><code>IConfigurationSection</code></strong>：表示配置层次结构中的一个子部分。</li><li><strong>键名约定</strong>： <ul><li>使用<strong>冒号 <code>:</code></strong> 分隔层次结构中的部分。例如：<code>Logging:LogLevel:Default</code>。</li><li>在 JSON 文件中，这对应于嵌套的对象。</li></ul></li></ul><p>配置文件案例<code>appsettings.json</code></p><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code class="language-json"><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">&quot;Logging&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">&quot;LogLevel&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">&quot;Default&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Information&quot;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">&quot;Microsoft.AspNetCore&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Warning&quot;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;AllowedHosts&quot;</span><span class="token operator">:</span> <span class="token string">&quot;*&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;ConnectionStrings&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">&quot;DefaultConnection&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Server=(localdb)\\\\mssqllocaldb;Database=MyDb;Trusted_Connection=True;&quot;</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;MyCustomSettings&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">&quot;WelcomeMessage&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Hello from config!&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">&quot;FeatureToggle&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">&quot;ApiKeys&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">&quot;GoogleMaps&quot;</span><span class="token operator">:</span> <span class="token string">&quot;your-google-maps-key&quot;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">&quot;OpenWeather&quot;</span><span class="token operator">:</span> <span class="token string">&quot;your-open-weather-key&quot;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="直接通过iconfiguration访问" tabindex="-1"><a class="header-anchor" href="#直接通过iconfiguration访问"><span>直接通过<code>IConfiguration</code>访问</span></a></h4><p>这是最直接的方式，可以将 <code>IConfiguration</code> 服务注入到您的类中，然后通过键名获取值。</p><h5 id="configuration-key" tabindex="-1"><a class="header-anchor" href="#configuration-key"><span>configuration[&quot;key&quot;]</span></a></h5><ul><li>Web API 写法：</li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">using Microsoft.AspNetCore.Mvc;</span>
<span class="line">using Microsoft.Extensions.Configuration; // 确保引入此命名空间</span>
<span class="line"></span>
<span class="line">[ApiController]</span>
<span class="line">[Route(&quot;[controller]&quot;)]</span>
<span class="line">public class ConfigController : ControllerBase</span>
<span class="line">{</span>
<span class="line">    private readonly IConfiguration _configuration;</span>
<span class="line"></span>
<span class="line">    // 构造函数注入 IConfiguration</span>
<span class="line">    public ConfigController(IConfiguration configuration)</span>
<span class="line">    {</span>
<span class="line">        _configuration = configuration;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    [HttpGet(&quot;direct&quot;)]</span>
<span class="line">    public IActionResult GetDirectConfigInfo()</span>
<span class="line">    {</span>
<span class="line">        // 直接通过键名访问配置</span>
<span class="line">        var defaultLogLevel = _configuration[&quot;Logging:LogLevel:Default&quot;];</span>
<span class="line">        var connectionString = _configuration.GetConnectionString(&quot;DefaultConnection&quot;); // 快捷方法获取连接字符串</span>
<span class="line">        var welcomeMessage = _configuration[&quot;MyCustomSettings:WelcomeMessage&quot;];</span>
<span class="line">        var googleMapsKey = _configuration[&quot;MyCustomSettings:ApiKeys:GoogleMaps&quot;];</span>
<span class="line"></span>
<span class="line">        return Ok(new</span>
<span class="line">        {</span>
<span class="line">            DefaultLogLevel = defaultLogLevel,</span>
<span class="line">            ConnectionString = connectionString,</span>
<span class="line">            WelcomeMessage = welcomeMessage,</span>
<span class="line">            GoogleMapsKey = googleMapsKey</span>
<span class="line">        });</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>最小 API 写法</li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">// ...</span>
<span class="line">var app = builder.Build();</span>
<span class="line">// ...</span>
<span class="line"></span>
<span class="line">// 直接通过 IConfiguration 访问</span>
<span class="line">app.MapGet(&quot;/config-info-direct&quot;, (IConfiguration config) =&gt;</span>
<span class="line">{</span>
<span class="line">    var defaultLogLevel = config[&quot;Logging:LogLevel:Default&quot;];</span>
<span class="line">    var connectionString = config.GetConnectionString(&quot;DefaultConnection&quot;);</span>
<span class="line">    var welcomeMessage = config[&quot;MyCustomSettings:WelcomeMessage&quot;];</span>
<span class="line">    var openWeatherKey = config[&quot;MyCustomSettings:ApiKeys:OpenWeather&quot;];</span>
<span class="line"></span>
<span class="line">    return Results.Ok(new</span>
<span class="line">    {</span>
<span class="line">        DefaultLogLevel = defaultLogLevel,</span>
<span class="line">        ConnectionString = connectionString,</span>
<span class="line">        WelcomeMessage = welcomeMessage,</span>
<span class="line">        OpenWeatherKey = openWeatherKey</span>
<span class="line">    });</span>
<span class="line">});</span>
<span class="line"></span>
<span class="line">// ...</span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="getvalue" tabindex="-1"><a class="header-anchor" href="#getvalue"><span>GetValue</span></a></h5><p>语法：<code>GetValue&lt;T&gt;(string key, T defaultValue = default)</code></p><p>作用：这是获取单个配置值的<strong>推荐方式</strong>，因为它提供了<strong>类型安全</strong>和<strong>默认值</strong>的功能。</p><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">// 获取字符串值，如果不存在则为 null</span>
<span class="line">string? welcomeMessage = _configuration.GetValue&lt;string&gt;(&quot;MyCustomSettings:WelcomeMessage&quot;);</span>
<span class="line"></span>
<span class="line">// 获取布尔值，如果不存在则为 false</span>
<span class="line">bool featureToggle = _configuration.GetValue&lt;bool&gt;(&quot;MyCustomSettings:FeatureToggle&quot;);</span>
<span class="line"></span>
<span class="line">// 获取整数值，如果不存在则为 8080</span>
<span class="line">int appPort = _configuration.GetValue&lt;int&gt;(&quot;App:Port&quot;, 8080);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>对比<code>configuration[&quot;key&quot;]</code></strong></p><ul><li><code>_configuration[&quot;key&quot;]</code> 总是返回 <code>string?</code> 类型。如果键不存在，它返回 <code>null</code>。您需要手动进行类型转换和空值检查。</li><li><code>GetValue&lt;T&gt;()</code> 提供了类型转换和默认值处理，让代码更简洁、更安全。</li></ul><h5 id="getsection" tabindex="-1"><a class="header-anchor" href="#getsection"><span>GetSection</span></a></h5><p><strong>作用：</strong> 获取配置层次结构中的一个<strong>子部分（Section）</strong>。这个子部分本身也是一个 <code>IConfigurationSection</code> 接口的实例，而 <code>IConfigurationSection</code> 又继承自 <code>IConfiguration</code>。这意味着可以像操作整个配置一样操作一个子节点。</p><p><strong>使用方法</strong></p><ul><li>提供字节的键，如<code>MyCustSettings</code></li><li>返回一个<code>IConfigurationSection</code>对象，该对象包含指定字节下的配置</li></ul><p><strong>案例</strong></p><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">// 获取 &quot;MyCustomSettings&quot; 这个配置节</span>
<span class="line">IConfigurationSection mySettingsSection = _configuration.GetSection(&quot;MyCustomSettings&quot;);</span>
<span class="line"></span>
<span class="line">// 现在，您可以通过这个子节访问其内部的键，就像访问根配置一样</span>
<span class="line">string? welcomeMessageFromSection = mySettingsSection[&quot;WelcomeMessage&quot;]; // &quot;Hello from config!&quot;</span>
<span class="line">bool featureToggleFromSection = mySettingsSection.GetValue&lt;bool&gt;(&quot;FeatureToggle&quot;); // true</span>
<span class="line"></span>
<span class="line">// 获取更深层次的子节</span>
<span class="line">IConfigurationSection apiKeysSection = mySettingsSection.GetSection(&quot;ApiKeys&quot;);</span>
<span class="line">string? googleMapsKey = apiKeysSection[&quot;GoogleMaps&quot;]; // &quot;your-google-maps-key&quot;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="getchildren" tabindex="-1"><a class="header-anchor" href="#getchildren"><span>GetChildren</span></a></h5><p><strong>作用：</strong> 获取当前配置节下<strong>所有直接子节</strong>的集合。它返回一个 <code>IEnumerable&lt;IConfigurationSection&gt;</code>。</p><p><strong>如何使用：</strong> 在 <code>IConfiguration</code> 实例（可以是根配置，也可以是某个 <code>IConfigurationSection</code>）上调用。</p><p><strong>案例</strong>:</p><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code class="language-json"><span class="line"><span class="token comment">// appsettings.json</span></span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">&quot;ConnectionStrings&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">&quot;DefaultConnection&quot;</span><span class="token operator">:</span> <span class="token string">&quot;...&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">&quot;ReportingConnection&quot;</span><span class="token operator">:</span> <span class="token string">&quot;...&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">&quot;AnalyticsConnection&quot;</span><span class="token operator">:</span> <span class="token string">&quot;...&quot;</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;FeatureToggles&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">&quot;FeatureA&quot;</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">&quot;FeatureB&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">IConfigurationSection connectionStringsSection = _configuration.GetSection(&quot;ConnectionStrings&quot;);</span>
<span class="line"></span>
<span class="line">// 遍历所有连接字符串</span>
<span class="line">foreach (var connection in connectionStringsSection.GetChildren())</span>
<span class="line">{</span>
<span class="line">    Console.WriteLine($&quot;Connection Name: {connection.Key}, Value: {connection.Value}&quot;);</span>
<span class="line">    // Output:</span>
<span class="line">    // Connection Name: DefaultConnection, Value: ...</span>
<span class="line">    // Connection Name: ReportingConnection, Value: ...</span>
<span class="line">    // Connection Name: AnalyticsConnection, Value: ...</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 也可以直接在根配置上获取顶级子节</span>
<span class="line">foreach (var topLevelSection in _configuration.GetChildren())</span>
<span class="line">{</span>
<span class="line">    Console.WriteLine($&quot;Top Level Section: {topLevelSection.Key}&quot;);</span>
<span class="line">    // Output:</span>
<span class="line">    // Top Level Section: Logging</span>
<span class="line">    // Top Level Section: AllowedHosts</span>
<span class="line">    // Top Level Section: ConnectionStrings</span>
<span class="line">    // Top Level Section: MyCustomSettings</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p><strong>注意：</strong> <code>GetChildren()</code> 只返回<strong>直接的子节</strong>，不递归。如果您需要递归遍历整个配置树，需要自己编写递归逻辑。</p></blockquote><h5 id="exists" tabindex="-1"><a class="header-anchor" href="#exists"><span>Exists</span></a></h5><p><strong>作用：</strong> 检查当前的 <code>IConfigurationSection</code> 是否<strong>存在</strong>。</p><p><strong>如何使用：</strong> 在 <code>IConfigurationSection</code> 实例上调用。</p><p><strong>案例</strong>:</p><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">IConfigurationSection optionalFeatureSection = _configuration.GetSection(&quot;OptionalFeatures:FeatureZ&quot;);</span>
<span class="line"></span>
<span class="line">if (optionalFeatureSection.Exists())</span>
<span class="line">{</span>
<span class="line">    Console.WriteLine(&quot;FeatureZ configuration exists.&quot;);</span>
<span class="line">    bool featureZEnabled = optionalFeatureSection.GetValue&lt;bool&gt;(&quot;IsEnabled&quot;);</span>
<span class="line">    // ... 使用 FeatureZ 的其他配置 ...</span>
<span class="line">}</span>
<span class="line">else</span>
<span class="line">{</span>
<span class="line">    Console.WriteLine(&quot;FeatureZ configuration does not exist. Using default behavior.&quot;);</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>对比<code>== NULL</code></strong></p><ul><li><code>_configuration.GetSection(&quot;SomeSection&quot;)</code> 即使 <code>SomeSection</code> 不存在，也会返回一个非 <code>null</code> 的 <code>IConfigurationSection</code> 实例。这个实例的 <code>Value</code> 属性会是 <code>null</code>，但它本身不是 <code>null</code>。</li><li>所以，直接 <code>if (_configuration.GetSection(&quot;SomeSection&quot;) == null)</code> 是<strong>无效的</strong>。必须使用 <code>Exists()</code> 方法来正确检查子节是否存在。</li></ul><h4 id="使用选项模式" tabindex="-1"><a class="header-anchor" href="#使用选项模式"><span>使用选项模式</span></a></h4><p>选项模式是一种更结构化、类型安全且易于维护的配置访问方式。它将配置值绑定到普通的 C# 类上。</p><ol><li>定义选项类</li></ol><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Models/MyCustomSettings.cs</span>
<span class="line">public class MyCustomSettings</span>
<span class="line">{</span>
<span class="line">    // 定义常量以方便引用配置节的名称，减少硬编码字符串</span>
<span class="line">    public const string SectionName = &quot;MyCustomSettings&quot;;</span>
<span class="line"></span>
<span class="line">    public string WelcomeMessage { get; set; } = string.Empty;</span>
<span class="line">    public bool FeatureToggle { get; set; }</span>
<span class="line">    public ApiKeys ApiKeys { get; set; } = new ApiKeys(); // 嵌套对象</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">public class ApiKeys</span>
<span class="line">{</span>
<span class="line">    public string GoogleMaps { get; set; } = string.Empty;</span>
<span class="line">    public string OpenWeather { get; set; } = string.Empty;</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>在<code>Program.cs</code>中绑定配置</li></ol><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">var builder = WebApplication.CreateBuilder(args);</span>
<span class="line"></span>
<span class="line">// ... 其他服务注册 ...</span>
<span class="line"></span>
<span class="line">// 绑定 MyCustomSettings 配置节到 MyCustomSettings 类</span>
<span class="line">// IConfiguration.GetSection(SectionName) 获取名为 &quot;MyCustomSettings&quot; 的配置子节</span>
<span class="line">builder.Services.Configure&lt;MyCustomSettings&gt;(builder.Configuration.GetSection(MyCustomSettings.SectionName));</span>
<span class="line"></span>
<span class="line">// ...</span>
<span class="line">var app = builder.Build();</span>
<span class="line">// ...</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>在服务或控制器中注入并使用选项</li></ol><p>可以通过注入 <code>IOptions&lt;T&gt;</code>、<code>IOptionsSnapshot&lt;T&gt;</code> 或 <code>IOptionsMonitor&lt;T&gt;</code> 来获取配置。</p><ul><li><strong><code>IOptions&lt;T&gt;</code></strong><ul><li>最常用。它是一个单例服务，提供配置的<strong>快照</strong>。配置在应用启动时加载一次，之后不会改变。</li><li>使用场景：简单且不经常变化的配置</li></ul></li><li><strong><code>IOptionsSnapshot&lt;T&gt;</code></strong><ul><li>作用域服务。它在<strong>每个请求</strong>中都会创建一个新的 <code>T</code> 实例，并会从配置源中重新加载最新的配置值。这对于在请求生命周期内需要最新配置的场景有用（但文件内容变化通常需要重启应用才能生效）。</li><li>使用场景：<strong>每个请求需要最新配置</strong>，且无需订阅实时变化的场景</li></ul></li><li><strong><code>IOptionsMonitor&lt;T&gt;</code></strong><ul><li>单例服务。允许您获取<strong>最新</strong>的配置值，并且可以<strong>订阅配置更改通知</strong>（例如，如果 <code>appsettings.json</code> 文件在运行时发生变化，<code>IOptionsMonitor</code> 能够检测到并通知）。适用于需要运行时热重载配置的场景。</li><li><strong>需要在运行时监听配置更改并作出响应</strong>的场景</li></ul></li></ul><hr><p>Web API 写法：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">using Microsoft.AspNetCore.Mvc;</span>
<span class="line">using Microsoft.Extensions.Options; // 确保引入此命名空间</span>
<span class="line"></span>
<span class="line">[ApiController]</span>
<span class="line">[Route(&quot;[controller]&quot;)]</span>
<span class="line">public class OptionsConfigController : ControllerBase</span>
<span class="line">{</span>
<span class="line">    private readonly MyCustomSettings _settingsSnapshot; // 使用 IOptionsSnapshot</span>
<span class="line">    private readonly IOptionsMonitor&lt;MyCustomSettings&gt; _settingsMonitor; // 使用 IOptionsMonitor</span>
<span class="line"></span>
<span class="line">    // 构造函数注入 IOptionsSnapshot 和 IOptionsMonitor</span>
<span class="line">    public OptionsConfigController(</span>
<span class="line">        IOptionsSnapshot&lt;MyCustomSettings&gt; optionsSnapshot,</span>
<span class="line">        IOptionsMonitor&lt;MyCustomSettings&gt; optionsMonitor)</span>
<span class="line">    {</span>
<span class="line">        _settingsSnapshot = optionsSnapshot.Value; // 获取配置快照</span>
<span class="line">        _settingsMonitor = optionsMonitor;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    [HttpGet(&quot;options-snapshot&quot;)]</span>
<span class="line">    public IActionResult GetOptionsSnapshotInfo()</span>
<span class="line">    {</span>
<span class="line">        // 每次请求都会获取最新的快照</span>
<span class="line">        var currentSettings = _settingsSnapshot;</span>
<span class="line">        return Ok(new</span>
<span class="line">        {</span>
<span class="line">            currentSettings.WelcomeMessage,</span>
<span class="line">            currentSettings.FeatureToggle,</span>
<span class="line">            GoogleMapsKey = currentSettings.ApiKeys.GoogleMaps,</span>
<span class="line">            Source = &quot;IOptionsSnapshot&quot;</span>
<span class="line">        });</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    [HttpGet(&quot;options-monitor&quot;)]</span>
<span class="line">    public IActionResult GetOptionsMonitorInfo()</span>
<span class="line">    {</span>
<span class="line">        // 可以获取最新的配置值，如果文件在运行时更改，这里会反映出来</span>
<span class="line">        var currentSettings = _settingsMonitor.CurrentValue;</span>
<span class="line">        return Ok(new</span>
<span class="line">        {</span>
<span class="line">            currentSettings.WelcomeMessage,</span>
<span class="line">            currentSettings.FeatureToggle,</span>
<span class="line">            OpenWeatherKey = currentSettings.ApiKeys.OpenWeather,</span>
<span class="line">            Source = &quot;IOptionsMonitor&quot;</span>
<span class="line">        });</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最小API写法：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">// ...</span>
<span class="line">var app = builder.Build();</span>
<span class="line">// ...</span>
<span class="line"></span>
<span class="line">// 使用 IOptionsSnapshot</span>
<span class="line">app.MapGet(&quot;/options-info-snapshot&quot;, (IOptionsSnapshot&lt;MyCustomSettings&gt; optionsSnapshot) =&gt;</span>
<span class="line">{</span>
<span class="line">    var settings = optionsSnapshot.Value;</span>
<span class="line">    return Results.Ok(new</span>
<span class="line">    {</span>
<span class="line">        settings.WelcomeMessage,</span>
<span class="line">        settings.FeatureToggle,</span>
<span class="line">        GoogleMapsKey = settings.ApiKeys.GoogleMaps,</span>
<span class="line">        Source = &quot;IOptionsSnapshot Minimal API&quot;</span>
<span class="line">    });</span>
<span class="line">});</span>
<span class="line"></span>
<span class="line">// 使用 IOptionsMonitor</span>
<span class="line">app.MapGet(&quot;/options-info-monitor&quot;, (IOptionsMonitor&lt;MyCustomSettings&gt; optionsMonitor) =&gt;</span>
<span class="line">{</span>
<span class="line">    var settings = optionsMonitor.CurrentValue; // 获取当前最新值</span>
<span class="line">    return Results.Ok(new</span>
<span class="line">    {</span>
<span class="line">        settings.WelcomeMessage,</span>
<span class="line">        settings.FeatureToggle,</span>
<span class="line">        OpenWeatherKey = settings.ApiKeys.OpenWeather,</span>
<span class="line">        Source = &quot;IOptionsMonitor Minimal API&quot;</span>
<span class="line">    });</span>
<span class="line">});</span>
<span class="line"></span>
<span class="line">// ...</span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="通过依赖注入将配置传递给其他组件" tabindex="-1"><a class="header-anchor" href="#通过依赖注入将配置传递给其他组件"><span>通过依赖注入将配置传递给其他组件</span></a></h4><p>如果自定义服务需要直接访问 <code>IConfiguration</code> 或配置的某个子节，您可以直接将其注入到服务的构造函数中。</p><ul><li>Web API 写法</li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Services/MyDataService.cs</span>
<span class="line">public class MyDataService</span>
<span class="line">{</span>
<span class="line">    private readonly IConfiguration _configuration;</span>
<span class="line">    private readonly MyCustomSettings _settings; // 也可以注入 IOptions&lt;MyCustomSettings&gt;</span>
<span class="line"></span>
<span class="line">    public MyDataService(IConfiguration configuration, IOptions&lt;MyCustomSettings&gt; settings)</span>
<span class="line">    {</span>
<span class="line">        _configuration = configuration;</span>
<span class="line">        _settings = settings.Value;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public string GetDataBasedOnConfig()</span>
<span class="line">    {</span>
<span class="line">        var dbName = _configuration[&quot;ConnectionStrings:DefaultConnection&quot;];</span>
<span class="line">        var welcomeMsg = _settings.WelcomeMessage;</span>
<span class="line">        return $&quot;Using DB: {dbName}, Welcome: {welcomeMsg}&quot;;</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// Program.cs</span>
<span class="line">builder.Services.AddScoped&lt;MyDataService&gt;(); // 注册服务</span>
<span class="line">// ...</span>
<span class="line"></span>
<span class="line">// Controllers/DataController.cs</span>
<span class="line">[ApiController]</span>
<span class="line">[Route(&quot;[controller]&quot;)]</span>
<span class="line">public class DataController : ControllerBase</span>
<span class="line">{</span>
<span class="line">    private readonly MyDataService _dataService;</span>
<span class="line"></span>
<span class="line">    public DataController(MyDataService dataService)</span>
<span class="line">    {</span>
<span class="line">        _dataService = dataService;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    [HttpGet(&quot;data-from-service&quot;)]</span>
<span class="line">    public IActionResult GetServiceData()</span>
<span class="line">    {</span>
<span class="line">        return Ok(_dataService.GetDataBasedOnConfig());</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>最小API写法</li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">// ...</span>
<span class="line">builder.Services.AddScoped&lt;MyDataService&gt;(); // 注册服务 (MyDataService 类如上定义)</span>
<span class="line">// ...</span>
<span class="line"></span>
<span class="line">app.MapGet(&quot;/data-from-minimal-service&quot;, (MyDataService dataService) =&gt;</span>
<span class="line">{</span>
<span class="line">    return Results.Ok(dataService.GetDataBasedOnConfig());</span>
<span class="line">});</span>
<span class="line">// ...</span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="在razor-pages访问配置" tabindex="-1"><a class="header-anchor" href="#在razor-pages访问配置"><span>在Razor Pages访问配置</span></a></h3><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">// .CSHTML</span>
<span class="line">@page</span>
<span class="line">@model Test5Model</span>
<span class="line">@using Microsoft.Extensions.Configuration</span>
<span class="line">@inject IConfiguration Configuration</span>
<span class="line"></span>
<span class="line">Configuration value for &#39;MyKey&#39;: @Configuration[&quot;MyKey&quot;]</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="在mvc视图文件访问配置" tabindex="-1"><a class="header-anchor" href="#在mvc视图文件访问配置"><span>在MVC视图文件访问配置</span></a></h3><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// .CSHTML</span>
<span class="line">@using Microsoft.Extensions.Configuration</span>
<span class="line">@inject IConfiguration Configuration</span>
<span class="line"></span>
<span class="line">Configuration value for &#39;MyKey&#39;: @Configuration[&quot;MyKey&quot;]</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="在program-cs中访问配置" tabindex="-1"><a class="header-anchor" href="#在program-cs中访问配置"><span>在<code>Program.cs</code>中访问配置</span></a></h3><div class="language-JSON line-numbers-mode" data-highlighter="prismjs" data-ext="JSON"><pre><code class="language-JSON"><span class="line">// appsettings.json</span>
<span class="line">{</span>
<span class="line">  ...</span>
<span class="line">  &quot;KeyOne&quot;: &quot;Key One Value&quot;,</span>
<span class="line">  &quot;KeyTwo&quot;: 1999,</span>
<span class="line">  &quot;KeyThree&quot;: true</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">//Program.cs</span>
<span class="line">var builder = WebApplication.CreateBuilder(args);</span>
<span class="line"></span>
<span class="line">var key1 = builder.Configuration.GetValue&lt;string&gt;(&quot;KeyOne&quot;);</span>
<span class="line"></span>
<span class="line">var app = builder.Build();</span>
<span class="line"></span>
<span class="line">app.MapGet(&quot;/&quot;, () =&gt; &quot;Hello World!&quot;);</span>
<span class="line"></span>
<span class="line">var key2 = app.Configuration.GetValue&lt;int&gt;(&quot;KeyTwo&quot;);</span>
<span class="line">var key3 = app.Configuration.GetValue&lt;bool&gt;(&quot;KeyThree&quot;);</span>
<span class="line"></span>
<span class="line">app.Logger.LogInformation(&quot;KeyOne: {KeyOne}&quot;, key1);</span>
<span class="line">app.Logger.LogInformation(&quot;KeyTwo: {KeyTwo}&quot;, key2);</span>
<span class="line">app.Logger.LogInformation(&quot;KeyThree: {KeyThree}&quot;, key3);</span>
<span class="line"></span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="选项" tabindex="-1"><a class="header-anchor" href="#选项"><span>选项</span></a></h2><h3 id="使用方法-4" tabindex="-1"><a class="header-anchor" href="#使用方法-4"><span>使用方法</span></a></h3><p><a href="#%E4%BD%BF%E7%94%A8%E9%80%89%E9%A1%B9%E6%A8%A1%E5%BC%8F">选项模式</a></p><h3 id="选项验证" tabindex="-1"><a class="header-anchor" href="#选项验证"><span>选项验证</span></a></h3><p>选项模式还支持对配置值进行验证，确保它们是有效的。这有助于在应用程序启动时捕获错误配置，而不是在运行时。</p><ol><li>为选项类添加验证属性</li></ol><p>可以使用 <code>System.ComponentModel.DataAnnotations</code> 属性。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">using System.ComponentModel.DataAnnotations;</span>
<span class="line"></span>
<span class="line">public class EmailSettings</span>
<span class="line">{</span>
<span class="line">    public const string SectionName = &quot;EmailSettings&quot;;</span>
<span class="line"></span>
<span class="line">    [Required(ErrorMessage = &quot;SMTP Server is required.&quot;)]</span>
<span class="line">    [StringLength(100, MinimumLength = 5, ErrorMessage = &quot;SMTP Server must be between 5 and 100 characters.&quot;)]</span>
<span class="line">    public string SmtpServer { get; set; } = string.Empty;</span>
<span class="line"></span>
<span class="line">    [Range(1, 65535, ErrorMessage = &quot;SMTP Port must be between 1 and 65535.&quot;)]</span>
<span class="line">    public int SmtpPort { get; set; }</span>
<span class="line"></span>
<span class="line">    [Required(ErrorMessage = &quot;Sender Email is required.&quot;)]</span>
<span class="line">    [EmailAddress(ErrorMessage = &quot;Invalid sender email format.&quot;)]</span>
<span class="line">    public string SenderEmail { get; set; } = string.Empty;</span>
<span class="line"></span>
<span class="line">    public string SenderName { get; set; } = string.Empty;</span>
<span class="line">    public bool EnableSsl { get; set; }</span>
<span class="line">    public Credentials Credentials { get; set; } = new Credentials();</span>
<span class="line">}</span>
<span class="line">// Credentials 类也可以添加验证属性</span>
<span class="line">public class Credentials</span>
<span class="line">{</span>
<span class="line">    [Required(ErrorMessage = &quot;Username is required.&quot;)]</span>
<span class="line">    public string Username { get; set; } = string.Empty;</span>
<span class="line">    [Required(ErrorMessage = &quot;Password is required.&quot;)]</span>
<span class="line">    public string Password { get; set; } = string.Empty;</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>在<code>Program.cs</code>中添加验证</li></ol><p>使用 <code>Services.AddOptions&lt;T&gt;().Bind(Configuration.GetSection(&quot;SectionName&quot;)).ValidateDataAnnotations();</code>。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">var builder = WebApplication.CreateBuilder(args);</span>
<span class="line"></span>
<span class="line">// ... 其他服务注册 ...</span>
<span class="line"></span>
<span class="line">// 绑定 EmailSettings 并添加数据注解验证</span>
<span class="line">builder.Services.AddOptions&lt;EmailSettings&gt;()</span>
<span class="line">    .Bind(builder.Configuration.GetSection(EmailSettings.SectionName))</span>
<span class="line">    .ValidateDataAnnotations(); // 启用数据注解验证</span>
<span class="line"></span>
<span class="line">// 你也可以添加自定义的验证逻辑：</span>
<span class="line">// .Validate(options =&gt; { /* 自定义验证逻辑 */ return options.SmtpPort != 0; }, &quot;Port cannot be zero.&quot;)</span>
<span class="line"></span>
<span class="line">// 默认情况下，如果验证失败，应用程序会在启动时抛出异常并终止。</span>
<span class="line">// 你可以通过 .ValidateOnStart() 来明确在启动时进行验证（这通常是默认行为）</span>
<span class="line">// .ValidateOnStart()</span>
<span class="line"></span>
<span class="line">// ...</span>
<span class="line">var app = builder.Build();</span>
<span class="line">// ...</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果配置不满足验证规则，应用程序将在启动时抛出 <code>OptionsValidationException</code> 异常，并显示详细的验证错误信息。</p><h2 id="环境" tabindex="-1"><a class="header-anchor" href="#环境"><span>环境</span></a></h2><h3 id="概述-2" tabindex="-1"><a class="header-anchor" href="#概述-2"><span>概述</span></a></h3><p><strong>环境</strong>是一个字符串值，它表示应用程序当前运行的上下文。框架和您的代码都可以使用这个环境字符串来执行不同的行为或加载不同的配置。</p><p>三个主要的环境名称：</p><ol><li><strong>Development (开发)</strong>： <ul><li><strong>特点</strong>：用于应用程序开发阶段。</li><li><strong>常见用途</strong>： <ul><li>启用详细的错误页面（如 <code>DeveloperExceptionPage</code>）。</li><li>启用热重载和文件更改监视。</li><li>使用本地开发数据库。</li><li>禁用缓存，方便即时看到更改。</li><li>更详细的日志输出（如 <code>Debug</code> 或 <code>Trace</code> 级别）。</li><li>可能跳过 HTTPS 重定向，方便本地调试。</li></ul></li></ul></li><li><strong>Staging (分阶段/预生产)</strong>： <ul><li><strong>特点</strong>：用于部署到生产环境之前的测试环境。它应该尽可能地模仿生产环境，但通常用于最终的 QA、性能测试和用户验收测试 (UAT)。</li><li><strong>常见用途</strong>： <ul><li>禁用开发相关的调试功能。</li><li>启用生产级别的错误处理（友好的错误页面）。</li><li>连接到独立的测试数据库或预生产数据库。</li><li>启用缓存。</li><li>更简洁的日志输出（如 <code>Information</code> 或 <code>Warning</code> 级别）。</li><li>强制 HTTPS。</li></ul></li></ul></li><li><strong>Production (生产)</strong>： <ul><li><strong>特点</strong>：应用程序最终用户使用的真实运行环境。</li><li><strong>常见用途</strong>： <ul><li>启用健壮的错误处理和用户友好的错误页面。</li><li>禁用任何可能泄露敏感信息的调试功能。</li><li>连接到生产数据库。</li><li>优化性能（如启用响应压缩、缓存）。</li><li>精简的日志输出（通常是 <code>Information</code> 或 <code>Error</code> 级别）。</li><li>严格的安全措施（如 HSTS、CORS 策略）。</li></ul></li></ul></li></ol><p>除了这些约定好的环境，您也可以定义自己的自定义环境名称（例如 <code>QA</code>、<code>UAT</code>、<code>Testing</code> 等）。</p><h3 id="设置环境" tabindex="-1"><a class="header-anchor" href="#设置环境"><span>设置环境</span></a></h3><h4 id="launchsettings-json" tabindex="-1"><a class="header-anchor" href="#launchsettings-json"><span><code>launchSettings.json</code></span></a></h4><ul><li><p>仅限开发环境</p></li><li><p>每个启动配置文件 (<code>profile</code>) 都可以有自己的 <code>environmentVariables</code> 设置。</p></li><li><p><strong>优先级</strong>：<strong>最低</strong>（仅在本地开发工具中使用，部署后无效）。</p></li></ul><div class="language-JSON line-numbers-mode" data-highlighter="prismjs" data-ext="JSON"><pre><code class="language-JSON"><span class="line">// Properties/launchSettings.json</span>
<span class="line">{</span>
<span class="line">  &quot;profiles&quot;: {</span>
<span class="line">    &quot;MyWebApp&quot;: {</span>
<span class="line">      &quot;commandName&quot;: &quot;Project&quot;,</span>
<span class="line">      &quot;launchBrowser&quot;: true,</span>
<span class="line">      &quot;applicationUrl&quot;: &quot;https://localhost:7001;http://localhost:5001&quot;,</span>
<span class="line">      &quot;environmentVariables&quot;: {</span>
<span class="line">        &quot;ASPNETCORE_ENVIRONMENT&quot;: &quot;Development&quot; // 这里设置了开发环境</span>
<span class="line">      },</span>
<span class="line">      &quot;dotnetRunMessages&quot;: true</span>
<span class="line">    },</span>
<span class="line">    &quot;StagingProfile&quot;: { // 您可以添加自定义配置文件</span>
<span class="line">      &quot;commandName&quot;: &quot;Project&quot;,</span>
<span class="line">      &quot;launchBrowser&quot;: true,</span>
<span class="line">      &quot;applicationUrl&quot;: &quot;https://localhost:7002;http://localhost:5002&quot;,</span>
<span class="line">      &quot;environmentVariables&quot;: {</span>
<span class="line">        &quot;ASPNETCORE_ENVIRONMENT&quot;: &quot;Staging&quot; // 这是一个示例，用于本地模拟分阶段环境</span>
<span class="line">      }</span>
<span class="line">    }</span>
<span class="line">  }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="在代码中设置" tabindex="-1"><a class="header-anchor" href="#在代码中设置"><span>在代码中设置</span></a></h4><p>优先级比<code>launchSettings.json</code>中设置要高一级</p><p>若要在代码中设置环境，请在创建 <a href="https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.builder.webapplicationbuilder" target="_blank" rel="noopener noreferrer">WebApplicationBuilder</a> 时使用 <a href="https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.builder.webapplicationoptions.environmentname#microsoft-aspnetcore-builder-webapplicationoptions-environmentname" target="_blank" rel="noopener noreferrer">WebApplicationOptions.EnvironmentName</a>，如以下示例所示：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// 在代码中设置环境变量</span>
<span class="line">var builder = WebApplication.CreateBuilder(new WebApplicationOptions</span>
<span class="line">{</span>
<span class="line">    EnvironmentName = Environments.Staging</span>
<span class="line">}); </span>
<span class="line"></span>
<span class="line">// Add services to the container.</span>
<span class="line">builder.Services.AddRazorPages();</span>
<span class="line"></span>
<span class="line">var app = builder.Build();</span>
<span class="line"></span>
<span class="line">// Configure the HTTP request pipeline.</span>
<span class="line">if (!app.Environment.IsDevelopment())</span>
<span class="line">{</span>
<span class="line">    app.UseExceptionHandler(&quot;/Error&quot;);</span>
<span class="line">    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.</span>
<span class="line">    app.UseHsts();</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">app.UseHttpsRedirection();</span>
<span class="line">app.UseStaticFiles();</span>
<span class="line"></span>
<span class="line">app.UseRouting();</span>
<span class="line"></span>
<span class="line">app.UseAuthorization();</span>
<span class="line"></span>
<span class="line">app.MapRazorPages();</span>
<span class="line"></span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="操作系统环境变量" tabindex="-1"><a class="header-anchor" href="#操作系统环境变量"><span>操作系统环境变量</span></a></h4><ul><li><p>在部署到服务器（Windows Server、Linux、Azure App Service、Docker 等）时，通常通过设置操作系统的环境变量来指定环境。</p></li><li><p><strong>优先级</strong>：<strong>中等</strong>（会覆盖 <code>launchSettings.json</code>）</p></li><li><p>Windows (CMD/PowerShell)：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token builtin class-name">set</span> <span class="token assign-left variable">ASPNETCORE_ENVIRONMENT</span><span class="token operator">=</span>Production</span>
<span class="line">dotnet run</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>Linux/Mac OS(Bash/Zsh)</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line"><span class="token builtin class-name">export</span> <span class="token assign-left variable">ASPNETCORE_ENVIRONMENT</span><span class="token operator">=</span>Production</span>
<span class="line">dotnet run</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>Docker:在 <code>Dockerfile</code> 或 <code>docker-compose.yml</code> 中使用 <code>ENV</code> 或 <code>environment</code>。</p><div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre><code class="language-docker"><span class="line"><span class="token comment"># Dockerfile</span></span>
<span class="line"><span class="token instruction"><span class="token keyword">ENV</span> ASPNETCORE_ENVIRONMENT=Production</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h4 id="命令行参数" tabindex="-1"><a class="header-anchor" href="#命令行参数"><span>命令行参数</span></a></h4><ul><li>可以在启动应用程序时，通过命令行参数直接覆盖环境。</li><li><strong>优先级</strong>：<strong>最高</strong>（会覆盖所有其他方式）。</li><li><strong>格式</strong>：<code>--ASPNETCORE_ENVIRONMENT=Production</code></li></ul><div class="language-BASH line-numbers-mode" data-highlighter="prismjs" data-ext="BASH"><pre><code class="language-BASH"><span class="line">dotnet run --ASPNETCORE_ENVIRONMENT=Staging</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><blockquote><p>环境变量的命名遵循特定的约定：<strong>点号 <code>:</code> 被替换为双下划线 <code>__</code>。</strong></p><p>要设置 <code>Logging:LogLevel:Default</code>，环境变量名应为 <code>Logging__LogLevel__Default</code>。</p></blockquote><h3 id="在代码中访问环境" tabindex="-1"><a class="header-anchor" href="#在代码中访问环境"><span>在代码中访问环境</span></a></h3><p>通过注入 <code>IWebHostEnvironment</code> (对于 Web 应用) 或 <code>IHostEnvironment</code> (对于通用主机) 来访问当前环境信息。</p><div class="language-csharp line-numbers-mode" data-highlighter="prismjs" data-ext="cs"><pre><code class="language-csharp"><span class="line"><span class="token comment">// Program.cs</span></span>
<span class="line"><span class="token keyword">using</span> <span class="token namespace">Microsoft<span class="token punctuation">.</span>AspNetCore<span class="token punctuation">.</span>Hosting</span><span class="token punctuation">;</span> <span class="token comment">// 用于 IWebHostEnvironment</span></span>
<span class="line"><span class="token keyword">using</span> <span class="token namespace">Microsoft<span class="token punctuation">.</span>Extensions<span class="token punctuation">.</span>Hosting</span><span class="token punctuation">;</span> <span class="token comment">// 用于 IHostEnvironment 及其扩展方法</span></span>
<span class="line"></span>
<span class="line"><span class="token class-name"><span class="token keyword">var</span></span> builder <span class="token operator">=</span> WebApplication<span class="token punctuation">.</span><span class="token function">CreateBuilder</span><span class="token punctuation">(</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 在 builder 阶段获取环境信息</span></span>
<span class="line"><span class="token comment">// builder.Environment 是 IWebHostEnvironment 的实例</span></span>
<span class="line">Console<span class="token punctuation">.</span><span class="token function">WriteLine</span><span class="token punctuation">(</span><span class="token interpolation-string"><span class="token string">$&quot;Current environment (builder stage): </span><span class="token interpolation"><span class="token punctuation">{</span><span class="token expression language-csharp">builder<span class="token punctuation">.</span>Environment<span class="token punctuation">.</span>EnvironmentName</span><span class="token punctuation">}</span></span><span class="token string">&quot;</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">Console<span class="token punctuation">.</span><span class="token function">WriteLine</span><span class="token punctuation">(</span><span class="token interpolation-string"><span class="token string">$&quot;Is Development? </span><span class="token interpolation"><span class="token punctuation">{</span><span class="token expression language-csharp">builder<span class="token punctuation">.</span>Environment<span class="token punctuation">.</span><span class="token function">IsDevelopment</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span><span class="token punctuation">}</span></span><span class="token string">&quot;</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">Console<span class="token punctuation">.</span><span class="token function">WriteLine</span><span class="token punctuation">(</span><span class="token interpolation-string"><span class="token string">$&quot;Is Staging? </span><span class="token interpolation"><span class="token punctuation">{</span><span class="token expression language-csharp">builder<span class="token punctuation">.</span>Environment<span class="token punctuation">.</span><span class="token function">IsStaging</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span><span class="token punctuation">}</span></span><span class="token string">&quot;</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">Console<span class="token punctuation">.</span><span class="token function">WriteLine</span><span class="token punctuation">(</span><span class="token interpolation-string"><span class="token string">$&quot;Is Production? </span><span class="token interpolation"><span class="token punctuation">{</span><span class="token expression language-csharp">builder<span class="token punctuation">.</span>Environment<span class="token punctuation">.</span><span class="token function">IsProduction</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span><span class="token punctuation">}</span></span><span class="token string">&quot;</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// ... 服务注册 ...</span></span>
<span class="line"></span>
<span class="line"><span class="token class-name"><span class="token keyword">var</span></span> app <span class="token operator">=</span> builder<span class="token punctuation">.</span><span class="token function">Build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 在 app 阶段获取环境信息</span></span>
<span class="line"><span class="token comment">// app.Environment 也是 IWebHostEnvironment 的实例</span></span>
<span class="line">Console<span class="token punctuation">.</span><span class="token function">WriteLine</span><span class="token punctuation">(</span><span class="token interpolation-string"><span class="token string">$&quot;Current environment (app stage): </span><span class="token interpolation"><span class="token punctuation">{</span><span class="token expression language-csharp">app<span class="token punctuation">.</span>Environment<span class="token punctuation">.</span>EnvironmentName</span><span class="token punctuation">}</span></span><span class="token string">&quot;</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// ... 中间件管道配置 ...</span></span>
<span class="line"></span>
<span class="line">app<span class="token punctuation">.</span><span class="token function">Run</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Web API:在控制器或服务中，通过构造函数注入 <code>IWebHostEnvironment</code>。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">using Microsoft.AspNetCore.Mvc;</span>
<span class="line">using Microsoft.AspNetCore.Hosting; // 确保引入此命名空间</span>
<span class="line"></span>
<span class="line">[ApiController]</span>
<span class="line">[Route(&quot;[controller]&quot;)]</span>
<span class="line">public class EnvironmentController : ControllerBase</span>
<span class="line">{</span>
<span class="line">    private readonly IWebHostEnvironment _env;</span>
<span class="line"></span>
<span class="line">    // 构造函数注入 IWebHostEnvironment</span>
<span class="line">    public EnvironmentController(IWebHostEnvironment env)</span>
<span class="line">    {</span>
<span class="line">        _env = env;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    [HttpGet(&quot;info&quot;)]</span>
<span class="line">    public IActionResult GetEnvironmentInfo()</span>
<span class="line">    {</span>
<span class="line">        return Ok(new</span>
<span class="line">        {</span>
<span class="line">            EnvironmentName = _env.EnvironmentName,</span>
<span class="line">            IsDevelopment = _env.IsDevelopment(),</span>
<span class="line">            IsStaging = _env.IsStaging(),</span>
<span class="line">            IsProduction = _env.IsProduction(),</span>
<span class="line">            ContentRootPath = _env.ContentRootPath, // 应用程序内容的根目录</span>
<span class="line">            WebRootPath = _env.WebRootPath // 静态文件的根目录 (wwwroot)</span>
<span class="line">        });</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    [HttpGet(&quot;feature&quot;)]</span>
<span class="line">    public IActionResult GetFeatureBasedOnEnvironment()</span>
<span class="line">    {</span>
<span class="line">        if (_env.IsDevelopment())</span>
<span class="line">        {</span>
<span class="line">            return Ok(&quot;This is a development-only feature enabled.&quot;);</span>
<span class="line">        }</span>
<span class="line">        else if (_env.IsStaging())</span>
<span class="line">        {</span>
<span class="line">            return Ok(&quot;This is a staging-specific feature enabled.&quot;);</span>
<span class="line">        }</span>
<span class="line">        else if (_env.IsProduction())</span>
<span class="line">        {</span>
<span class="line">            return Ok(&quot;This is a production-only feature enabled. Be careful!&quot;);</span>
<span class="line">        }</span>
<span class="line">        else</span>
<span class="line">        {</span>
<span class="line">            return Ok($&quot;This is for custom environment: {_env.EnvironmentName}.&quot;);</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最小API: 在 Minimal API 终结点中，直接通过方法参数注入 <code>IWebHostEnvironment</code>。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">// ...</span>
<span class="line">var app = builder.Build();</span>
<span class="line">// ...</span>
<span class="line"></span>
<span class="line">app.MapGet(&quot;/environment-info-minimal&quot;, (IWebHostEnvironment env) =&gt;</span>
<span class="line">{</span>
<span class="line">    return Results.Ok(new</span>
<span class="line">    {</span>
<span class="line">        EnvironmentName = env.EnvironmentName,</span>
<span class="line">        IsDevelopment = env.IsDevelopment(),</span>
<span class="line">        IsStaging = env.IsStaging(),</span>
<span class="line">        IsProduction = env.IsProduction(),</span>
<span class="line">        ContentRootPath = env.ContentRootPath,</span>
<span class="line">        WebRootPath = env.WebRootPath</span>
<span class="line">    });</span>
<span class="line">});</span>
<span class="line"></span>
<span class="line">app.MapGet(&quot;/environment-feature-minimal&quot;, (IWebHostEnvironment env) =&gt;</span>
<span class="line">{</span>
<span class="line">    if (env.IsDevelopment())</span>
<span class="line">    {</span>
<span class="line">        return Results.Ok(&quot;Minimal API: Development feature is active.&quot;);</span>
<span class="line">    }</span>
<span class="line">    else if (env.IsStaging())</span>
<span class="line">    {</span>
<span class="line">        return Results.Ok(&quot;Minimal API: Staging feature is active.&quot;);</span>
<span class="line">    }</span>
<span class="line">    else if (env.IsProduction())</span>
<span class="line">    {</span>
<span class="line">        return Results.Ok(&quot;Minimal API: Production feature is active. Be cautious!&quot;);</span>
<span class="line">    }</span>
<span class="line">    else</span>
<span class="line">    {</span>
<span class="line">        return Results.Ok($&quot;Minimal API: Custom environment feature for {env.EnvironmentName}.&quot;);</span>
<span class="line">    }</span>
<span class="line">});</span>
<span class="line">// ...</span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="日志记录与监视" tabindex="-1"><a class="header-anchor" href="#日志记录与监视"><span>日志记录与监视</span></a></h2><h3 id="日志记录" tabindex="-1"><a class="header-anchor" href="#日志记录"><span>日志记录</span></a></h3><h4 id="核心组件" tabindex="-1"><a class="header-anchor" href="#核心组件"><span>核心组件</span></a></h4><ul><li><strong>ILogger</strong>：日志记录接口，用于写入日志。</li><li><strong>ILoggerProvider</strong>：日志提供程序，决定日志的输出目标（如控制台、文件、第三方服务）。</li><li><strong>ILoggerFactory</strong>：工厂类，用于创建 ILogger 实例。</li></ul><h4 id="日志类别" tabindex="-1"><a class="header-anchor" href="#日志类别"><span>日志类别</span></a></h4><p><strong>日志类别</strong>是一个字符串，用于<strong>标识日志消息的来源或生成该日志的组件</strong>。可以把它看作是日志的“命名空间”或“标签”，用来给日志消息分组。</p><p><strong>作用：</strong></p><ul><li><strong>过滤和控制</strong>：日志系统可以根据日志类别来应用不同的过滤规则和日志级别。比如，你可以设置所有来自 <code>Microsoft.EntityFrameworkCore</code> 类别的日志只记录 <code>Warning</code> 级别及以上的信息，而你自己的业务逻辑（例如 <code>MyApp.Services.OrderService</code> 类别）可以记录更详细的 <code>Debug</code> 级别信息。</li><li><strong>组织和查找</strong>：在大量的日志输出中，日志类别能帮助你快速识别是哪个部分的代码产生了这条日志，方便问题定位和分析。</li><li><strong>可读性</strong>：日志输出中通常会包含类别信息，让日志本身更容易理解。</li></ul><h5 id="确定日志类别的方法" tabindex="-1"><a class="header-anchor" href="#确定日志类别的方法"><span><strong>确定日志类别的方法</strong></span></a></h5><ol><li><strong>通过泛型参数 <code>ILogger&lt;T&gt;</code> 自动推断 (推荐方式)</strong>： 这是最常见也是推荐的方式。当你通过依赖注入获取 <code>ILogger&lt;T&gt;</code> 实例时，<code>T</code> 的**完全限定名（包括命名空间和类名）**就会自动成为该 <code>ILogger</code> 实例的日志类别。</li></ol><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// C# 代码中</span>
<span class="line">using Microsoft.Extensions.Logging;</span>
<span class="line"></span>
<span class="line">namespace MyWebApp.Services</span>
<span class="line">{</span>
<span class="line">    public class OrderService</span>
<span class="line">    {</span>
<span class="line">        private readonly ILogger&lt;OrderService&gt; _logger; // 这里的 T 是 OrderService</span>
<span class="line"></span>
<span class="line">        public OrderService(ILogger&lt;OrderService&gt; logger)</span>
<span class="line">        {</span>
<span class="line">            _logger = logger;</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        public void ProcessOrder(int orderId)</span>
<span class="line">        {</span>
<span class="line">            _logger.LogInformation(&quot;Processing order {OrderId}&quot;, orderId); // 这个日志的类别就是 &quot;MyWebApp.Services.OrderService&quot;</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li><strong>通过 <code>ILoggerFactory.CreateLogger(string categoryName)</code> 手动指定 (较少用)</strong>： 如果你需要更灵活地控制类别名称，或者你的代码不是通过 DI 获取 <code>ILogger</code>，你可以直接向 <code>ILoggerFactory</code> 提供一个字符串作为类别名称。</li></ol><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs 或某个需要创建日志器的地方</span>
<span class="line">using Microsoft.Extensions.Logging;</span>
<span class="line"></span>
<span class="line">public class MyStartupClass</span>
<span class="line">{</span>
<span class="line">    private readonly ILogger _logger;</span>
<span class="line"></span>
<span class="line">    public MyStartupClass(ILoggerFactory loggerFactory)</span>
<span class="line">    {</span>
<span class="line">        // 手动指定日志类别为 &quot;MyWebApp.Startup&quot;</span>
<span class="line">        _logger = loggerFactory.CreateLogger(&quot;MyWebApp.Startup&quot;);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public void Configure()</span>
<span class="line">    {</span>
<span class="line">        _logger.LogInformation(&quot;Application configuration started.&quot;); // 这个日志的类别就是 &quot;MyWebApp.Startup&quot;</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="匹配规则" tabindex="-1"><a class="header-anchor" href="#匹配规则"><span>匹配规则</span></a></h4><p>配置文件：</p><div class="language-JSON line-numbers-mode" data-highlighter="prismjs" data-ext="JSON"><pre><code class="language-JSON"><span class="line">// appsettings.json</span>
<span class="line">{</span>
<span class="line">  &quot;Logging&quot;: {</span>
<span class="line">    &quot;LogLevel&quot;: {</span>
<span class="line">      &quot;Default&quot;: &quot;Information&quot;,                  // 所有未指定类别的日志</span>
<span class="line">      &quot;Microsoft&quot;: &quot;Warning&quot;,                    // 所有以 &quot;Microsoft&quot; 开头的类别</span>
<span class="line">      &quot;Microsoft.AspNetCore.Hosting&quot;: &quot;Information&quot;, // 更具体的 &quot;Microsoft.AspNetCore.Hosting&quot; 类别</span>
<span class="line">      &quot;MyWebApp.Controllers.HomeController&quot;: &quot;Debug&quot;, // 针对特定的控制器</span>
<span class="line">      &quot;MyWebApp.Services&quot;: &quot;Debug&quot;               // 针对整个 MyWebApp.Services 命名空间下的所有类别</span>
<span class="line">    },</span>
<span class="line">    // ... 提供程序配置 ...</span>
<span class="line">  }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>日志类别匹配是<strong>从最具体到最不具体</strong>的原则。</p><p>如果一个日志消息的类别是 <code>MyWebApp.Services.OrderService</code>：</p><ul><li>它会优先尝试匹配 <code>MyWebApp.Services.OrderService</code> 的配置。</li><li>如果没有，会尝试匹配 <code>MyWebApp.Services</code> 的配置。</li><li>再没有，会尝试匹配 <code>MyWebApp</code> 的配置。</li><li>最后，会回退到 <code>Default</code> 的配置。</li></ul><h4 id="日志级别" tabindex="-1"><a class="header-anchor" href="#日志级别"><span>日志级别</span></a></h4><p>按严重程度递增：</p><ul><li><code>Trace (0)</code>：<strong>最详细的日志</strong>，可能包含非常底层的细节，甚至敏感数据。通常只在开发和深度调试时使用，不适合生产环境。</li><li><code>Debug (1)</code>：用于<strong>调试目的</strong>，包含足以诊断问题的详细信息。在开发环境中比较常用。</li><li><code>Information (2)</code>：<strong>跟踪应用程序的常规流</strong>。例如，HTTP 请求进入、服务启动、用户登录成功等事件。这是生产环境中最常见的默认级别。</li><li><code>Warning (3)</code>：表示<strong>非致命错误</strong>或潜在问题。应用程序可以继续运行，但可能存在需要注意的情况，例如数据不一致、某个操作未按预期完成等。</li><li><code>Error (4)</code>：表示<strong>当前操作失败的错误或异常</strong>。例如，数据库连接失败、外部 API 调用失败。这些错误通常需要开发人员介入。</li><li><code>Critical (5)</code>：表示应用程序或托管环境中的<strong>灾难性故障</strong>。通常意味着应用程序无法继续正常运行，需要立即关注，例如内存耗尽、主数据库崩溃。</li><li><code>None (6)</code>：表示<strong>不记录任何日志</strong>。</li></ul><p>默认最低级别：<em>Information</em>，即只记录 Information 及以上级别的日志。</p><h4 id="日志事件id" tabindex="-1"><a class="header-anchor" href="#日志事件id"><span>日志事件ID</span></a></h4><h5 id="概述-3" tabindex="-1"><a class="header-anchor" href="#概述-3"><span>概述</span></a></h5><p>**定义：**事件 ID 是一个整数值，用于唯一标识日志记录中的特定事件类型，帮助开发者分类和跟踪日志消息。</p><p><strong>作用：</strong></p><ul><li><strong>事件分类</strong>：为日志消息分配一个编号，便于区分不同类型的事件（如用户登录、数据库错误）。</li><li><strong>日志分析</strong>：在日志分析工具（如 ELK、Serilog）中通过事件 ID 过滤或查询特定事件。</li><li><strong>调试和监控</strong>：提供标准化方式，快速定位问题。</li></ul><p><strong>类型</strong>：EventId 结构体，包含 Id（整数）和可选的 Name（字符串描述）。</p><h5 id="事件id结构" tabindex="-1"><a class="header-anchor" href="#事件id结构"><span>事件ID结构</span></a></h5><p>类定义：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public struct EventId</span>
<span class="line">{</span>
<span class="line">    public int Id { get; }</span>
<span class="line">    public string Name { get; }</span>
<span class="line">    public EventId(int id, string name = null);</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建方式：</p><ul><li>直接使用整数：new EventId(1001)。</li><li>带名称：new EventId(1001, &quot;UserLogin&quot;)。</li></ul><p>默认值：如果不指定，EventId 默认值为 0，名称为 null。</p><h5 id="使用方法-5" tabindex="-1"><a class="header-anchor" href="#使用方法-5"><span>使用方法</span></a></h5><ul><li>完整方法</li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">void Log&lt;TState&gt;(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func&lt;TState, Exception, string&gt; formatter);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><ul><li>便捷方法(例如LogInfomartion)</li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">void LogInformation(EventId eventId, string message, params object[] args);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>案例：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public class UserController : ControllerBase</span>
<span class="line">{</span>
<span class="line">    private readonly ILogger&lt;UserController&gt; _logger;</span>
<span class="line"></span>
<span class="line">    // 定义事件 ID 为常量或枚举，方便管理和避免魔术数字</span>
<span class="line">    public static class EventIds</span>
<span class="line">    {</span>
<span class="line">        public const int UserLoginSuccess = 1001;</span>
<span class="line">        public const int UserLoginFailed = 1002;</span>
<span class="line">        public const int DatabaseError = 2001;</span>
<span class="line">        public const int UserNotFound = 3001;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public UserController(ILogger&lt;UserController&gt; logger)</span>
<span class="line">    {</span>
<span class="line">        _logger = logger;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    [HttpPost(&quot;login&quot;)]</span>
<span class="line">    public IActionResult Login(string username, string password)</span>
<span class="line">    {</span>
<span class="line">        // 模拟登录逻辑</span>
<span class="line">        if (username == &quot;admin&quot; &amp;&amp; password == &quot;password&quot;)</span>
<span class="line">        {</span>
<span class="line">            // 记录日志时使用事件ID</span>
<span class="line">            _logger.LogInformation(EventIds.UserLoginSuccess, &quot;User {Username} logged in successfully.&quot;, username);</span>
<span class="line">            return Ok(&quot;Login successful!&quot;);</span>
<span class="line">        }</span>
<span class="line">        else</span>
<span class="line">        {</span>
<span class="line">            // 记录日志时使用事件ID</span>
<span class="line">            _logger.LogWarning(EventIds.UserLoginFailed, &quot;User {Username} login failed due to invalid credentials.&quot;, username);</span>
<span class="line">            return Unauthorized(&quot;Invalid credentials.&quot;);</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    [HttpGet(&quot;{id}&quot;)]</span>
<span class="line">    public IActionResult GetUser(int id)</span>
<span class="line">    {</span>
<span class="line">        if (id &lt;= 0)</span>
<span class="line">        {</span>
<span class="line">            // 记录日志时使用事件ID</span>
<span class="line">            _logger.LogWarning(EventIds.UserNotFound, &quot;Attempted to retrieve user with invalid ID: {UserId}.&quot;, id);</span>
<span class="line">            return BadRequest(&quot;Invalid user ID.&quot;);</span>
<span class="line">        }</span>
<span class="line">        // ... 数据库操作 ...</span>
<span class="line">        try</span>
<span class="line">        {</span>
<span class="line">            // 模拟数据库异常</span>
<span class="line">            throw new InvalidOperationException(&quot;Database connection issue.&quot;);</span>
<span class="line">        }</span>
<span class="line">        catch (Exception ex)</span>
<span class="line">        {</span>
<span class="line">            // 记录日志时使用事件ID</span>
<span class="line">            _logger.LogError(EventIds.DatabaseError, ex, &quot;Database error occurred while fetching user {UserId}.&quot;, id);</span>
<span class="line">            return StatusCode(500, &quot;Internal server error.&quot;);</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="配置方式" tabindex="-1"><a class="header-anchor" href="#配置方式"><span>配置方式</span></a></h4><div class="language-JSON line-numbers-mode" data-highlighter="prismjs" data-ext="JSON"><pre><code class="language-JSON"><span class="line">// appsettings.json</span>
<span class="line">{</span>
<span class="line">  &quot;Logging&quot;: {</span>
<span class="line">    &quot;LogLevel&quot;: {</span>
<span class="line">      &quot;Default&quot;: &quot;Information&quot;,        // 默认所有提供程序和所有分类器的最低级别</span>
<span class="line">      &quot;Microsoft&quot;: &quot;Warning&quot;,          // 所有以 &quot;Microsoft&quot; 开头的分类器（如框架内部日志）设置为 Warning 级别</span>
<span class="line">      &quot;Microsoft.Hosting.Lifetime&quot;: &quot;Information&quot;, // 专门针对主机生命周期日志，保持 Information 级别</span>
<span class="line">      &quot;System&quot;: &quot;Warning&quot;,             // 所有以 &quot;System&quot; 开头的分类器设置为 Warning 级别</span>
<span class="line">      &quot;MyWebApp.Services.OrderService&quot;: &quot;Debug&quot; // 针对您自己的 OrderService，输出 Debug 级别日志</span>
<span class="line">    },</span>
<span class="line">    // 您也可以为特定的提供程序配置日志级别，这会覆盖上面 LogLevel 下的全局设置</span>
<span class="line">    &quot;Console&quot;: {</span>
<span class="line">      &quot;LogLevel&quot;: {</span>
<span class="line">        &quot;Default&quot;: &quot;Information&quot; // 控制台提供程序默认只输出 Information 及以上</span>
<span class="line">      }</span>
<span class="line">    },</span>
<span class="line">    &quot;Debug&quot;: {</span>
<span class="line">      &quot;LogLevel&quot;: {</span>
<span class="line">        &quot;Default&quot;: &quot;Debug&quot; // 调试窗口提供程序默认输出 Debug 及以上</span>
<span class="line">      }</span>
<span class="line">    }</span>
<span class="line">  },</span>
<span class="line">  &quot;AllowedHosts&quot;: &quot;*&quot;</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="注册日志服务" tabindex="-1"><a class="header-anchor" href="#注册日志服务"><span>注册日志服务</span></a></h4><p>在 <code>Program.cs</code> 中调用 <code>WebApplication.CreateBuilder(args)</code> 时，它会<strong>自动</strong>配置并注册默认的日志提供程序（控制台、调试等），并从 <code>appsettings.json</code> 加载日志配置。在大多数情况下，您不需要额外编写代码来注册它们。</p><p>如果您需要<strong>自定义</strong>日志行为，例如清除默认提供程序、添加新的提供程序或进行更高级的配置，可以使用 <code>builder.Logging</code> 对象：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">var builder = WebApplication.CreateBuilder(args);</span>
<span class="line"></span>
<span class="line">// builder.Logging 允许您进一步配置日志系统</span>
<span class="line">// builder.Logging.ClearProviders(); // 清除所有默认提供程序，如果您想完全自定义</span>
<span class="line">// builder.Logging.AddConsole();    // 重新添加控制台提供程序</span>
<span class="line">// builder.Logging.AddDebug();      // 添加调试提供程序</span>
<span class="line">// builder.Logging.AddEventSourceLogger(); // 添加事件源提供程序</span>
<span class="line"></span>
<span class="line">// 您也可以在这里以编程方式配置最低级别，这会覆盖 appsettings.json 中的 Default 级别</span>
<span class="line">// builder.Logging.SetMinimumLevel(LogLevel.Information);</span>
<span class="line"></span>
<span class="line">// ... 其他服务注册 ...</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="使用日志" tabindex="-1"><a class="header-anchor" href="#使用日志"><span>使用日志</span></a></h4><p>记录日志的方式是通过<strong>依赖注入 <code>ILogger&lt;T&gt;</code></strong>。</p><p>Web API案例</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">using Microsoft.AspNetCore.Mvc;</span>
<span class="line">using Microsoft.Extensions.Logging; // 确保引入此命名空间</span>
<span class="line"></span>
<span class="line">[ApiController]</span>
<span class="line">[Route(&quot;[controller]&quot;)]</span>
<span class="line">public class ProductsController : ControllerBase</span>
<span class="line">{</span>
<span class="line">    private readonly ILogger&lt;ProductsController&gt; _logger; // 注入 ILogger&lt;ProductsController&gt;</span>
<span class="line"></span>
<span class="line">    public ProductsController(ILogger&lt;ProductsController&gt; logger)</span>
<span class="line">    {</span>
<span class="line">        _logger = logger;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    [HttpGet(&quot;{id}&quot;)]</span>
<span class="line">    public IActionResult GetProduct(int id)</span>
<span class="line">    {</span>
<span class="line">        // 记录不同级别的日志，只有当前配置允许的级别才会被输出</span>
<span class="line">        _logger.LogTrace($&quot;Trace: Getting product with ID {id}&quot;); // 通常只在 Trace 级别启用时才记录</span>
<span class="line">        _logger.LogDebug($&quot;Debug: Fetching product {id} from database.&quot;); // 通常只在 Debug 级别启用时才记录</span>
<span class="line"></span>
<span class="line">        if (id &lt;= 0)</span>
<span class="line">        {</span>
<span class="line">            _logger.LogWarning(&quot;Warning: Invalid product ID received: {ProductId}. Must be positive.&quot;, id); // 使用结构化日志</span>
<span class="line">            return BadRequest(&quot;Invalid product ID.&quot;);</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        // 模拟获取产品</span>
<span class="line">        var product = new { Id = id, Name = $&quot;Product {id}&quot;, Price = 99.99 };</span>
<span class="line">        if (product == null)</span>
<span class="line">        {</span>
<span class="line">            _logger.LogError(&quot;Error: Product with ID {ProductId} not found.&quot;, id); // 记录错误</span>
<span class="line">            return NotFound();</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        _logger.LogInformation(&quot;Information: Successfully retrieved product {ProductId}.&quot;, id);</span>
<span class="line">        return Ok(product);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    [HttpPost]</span>
<span class="line">    public IActionResult CreateProduct([FromBody] object newProduct)</span>
<span class="line">    {</span>
<span class="line">        try</span>
<span class="line">        {</span>
<span class="line">            // 模拟产品创建失败，并抛出异常</span>
<span class="line">            throw new InvalidOperationException(&quot;Simulated product creation failure.&quot;);</span>
<span class="line">            // _logger.LogInformation(&quot;Product created successfully.&quot;);</span>
<span class="line">            // return CreatedAtAction(nameof(GetProduct), new { id = 1 }, newProduct);</span>
<span class="line">        }</span>
<span class="line">        catch (Exception ex)</span>
<span class="line">        {</span>
<span class="line">            // 记录 Critical 级别日志，并传入异常对象，日志提供程序会格式化异常信息</span>
<span class="line">            _logger.LogCritical(ex, &quot;Critical: An unhandled exception occurred during product creation for product {ProductData}.&quot;, newProduct);</span>
<span class="line">            return StatusCode(500, &quot;An internal server error occurred.&quot;);</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最小API案例</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">// ...</span>
<span class="line">var app = builder.Build();</span>
<span class="line">// ...</span>
<span class="line"></span>
<span class="line">app.MapGet(&quot;/items/{id}&quot;, (int id, ILogger&lt;Program&gt; logger) =&gt; // 注入 ILogger&lt;Program&gt;</span>
<span class="line">{</span>
<span class="line">    logger.LogDebug(&quot;Minimal API Debug: Attempting to get item {ItemId}.&quot;, id);</span>
<span class="line"></span>
<span class="line">    if (id &lt;= 0)</span>
<span class="line">    {</span>
<span class="line">        logger.LogWarning(&quot;Minimal API Warning: Invalid item ID {ItemId} received.&quot;, id);</span>
<span class="line">        return Results.BadRequest(&quot;Invalid item ID.&quot;);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    // 模拟获取数据</span>
<span class="line">    var item = new { Id = id, Name = $&quot;Item {id}&quot;, Description = &quot;A sample item.&quot; };</span>
<span class="line">    if (item == null)</span>
<span class="line">    {</span>
<span class="line">        logger.LogError(&quot;Minimal API Error: Item with ID {ItemId} not found.&quot;, id);</span>
<span class="line">        return Results.NotFound();</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    logger.LogInformation(&quot;Minimal API Information: Item {ItemId} retrieved successfully.&quot;, id);</span>
<span class="line">    return Results.Ok(item);</span>
<span class="line">});</span>
<span class="line"></span>
<span class="line">app.MapPost(&quot;/items&quot;, (ILogger&lt;Program&gt; logger) =&gt;</span>
<span class="line">{</span>
<span class="line">    try</span>
<span class="line">    {</span>
<span class="line">        throw new Exception(&quot;Minimal API: Simulated item creation error.&quot;);</span>
<span class="line">    }</span>
<span class="line">    catch (Exception ex)</span>
<span class="line">    {</span>
<span class="line">        logger.LogCritical(ex, &quot;Minimal API Critical: Failed to create item.&quot;);</span>
<span class="line">        return Results.StatusCode(500); // Internal Server Error</span>
<span class="line">    }</span>
<span class="line">});</span>
<span class="line"></span>
<span class="line">// ...</span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="第三方日志记录提供程序" tabindex="-1"><a class="header-anchor" href="#第三方日志记录提供程序"><span>第三方日志记录提供程序</span></a></h4><h5 id="serilog" tabindex="-1"><a class="header-anchor" href="#serilog"><span>Serilog</span></a></h5><h5 id="nlog" tabindex="-1"><a class="header-anchor" href="#nlog"><span>NLog</span></a></h5><h3 id="http日志记录" tabindex="-1"><a class="header-anchor" href="#http日志记录"><span>HTTP日志记录</span></a></h3><h4 id="概述-4" tabindex="-1"><a class="header-anchor" href="#概述-4"><span>概述</span></a></h4><p>HTTP 日志记录是一种中间件，用于记录传入 HTTP 请求和 HTTP 响应的相关信息。 HTTP 日志记录可以记录：</p><ul><li>HTTP 请求信息</li><li>公共属性</li><li>标头</li><li>正文</li><li>HTTP 响应信息</li></ul><p>HTTP 日志记录可以：</p><ul><li>记录所有请求和响应，或者仅记录满足特定条件的请求和响应。</li><li>选择要记录请求和响应的哪些部分。</li><li>允许您从日志中删除敏感信息。</li></ul><blockquote><p>HTTP 日志记录 <em><strong>会降低应用的性能</strong></em>，尤其是在记录请求和响应正文时。 在选择要记录的字段时请考虑性能影响。 测试所选日志记录属性的性能影响。</p></blockquote><h4 id="使用方法-6" tabindex="-1"><a class="header-anchor" href="#使用方法-6"><span>使用方法</span></a></h4><ol><li>添加HTTP日志服务（AddHttpLogging）</li></ol><p>需要在应用程序的服务集合中注册 HTTP 日志服务。这是配置日志记录行为的地方。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">using Microsoft.AspNetCore.HttpLogging; // 确保引入此命名空间</span>
<span class="line"></span>
<span class="line">var builder = WebApplication.CreateBuilder(args);</span>
<span class="line"></span>
<span class="line">// 添加 HTTP 日志服务并进行配置</span>
<span class="line">builder.Services.AddHttpLogging(logging =&gt;</span>
<span class="line">{</span>
<span class="line">    // 1. 配置要记录哪些字段</span>
<span class="line">    // HttpLoggingFields 枚举允许您选择要记录的HTTP数据类型。</span>
<span class="line">    // 您可以使用 | 运算符组合多个字段。</span>
<span class="line">    logging.LoggingFields = HttpLoggingFields.RequestHeaders | // 记录请求头</span>
<span class="line">                            HttpLoggingFields.RequestBody |    // 记录请求体</span>
<span class="line">                            HttpLoggingFields.ResponseBody |   // 记录响应体</span>
<span class="line">                            HttpLoggingFields.RequestPath |    // 记录请求路径</span>
<span class="line">                            HttpLoggingFields.RequestQuery |   // 记录查询字符串</span>
<span class="line">                            HttpLoggingFields.ResponseStatusCode; // 记录响应状态码</span>
<span class="line"></span>
<span class="line">    // 如果要记录所有字段（非常详细，慎用！），可以使用 HttpLoggingFields.All</span>
<span class="line">    // logging.LoggingFields = HttpLoggingFields.All;</span>
<span class="line"></span>
<span class="line">    // 2. 配置敏感信息隐藏 (非常重要！推荐！)</span>
<span class="line">    // 防止敏感信息（如认证令牌、密码）泄露到日志中。</span>
<span class="line">    // 指定请求头或响应头名称，这些头的值将不会被记录。</span>
<span class="line">    logging.RequestHeaders.Add(&quot;Authorization&quot;); // 隐藏 Authorization 请求头的值</span>
<span class="line">    logging.RequestHeaders.Add(&quot;Cookie&quot;);       // 隐藏 Cookie 请求头的值</span>
<span class="line">    logging.ResponseHeaders.Add(&quot;Set-Cookie&quot;);  // 隐藏 Set-Cookie 响应头的值</span>
<span class="line">    logging.ResponseHeaders.Add(&quot;X-Api-Key&quot;);   // 如果您有自定义的API密钥头，也要隐藏</span>
<span class="line"></span>
<span class="line">    // 3. 限制请求体/响应体的大小 (推荐！)</span>
<span class="line">    // 防止因为请求或响应体过大而导致日志文件剧增或性能问题。</span>
<span class="line">    // 超过此大小的部分将被截断。设置为 -1 表示不限制（慎用）。</span>
<span class="line">    logging.RequestBodyLogLimit = 4096; // 限制请求体最大记录 4KB (4 * 1024 字节)</span>
<span class="line">    logging.ResponseBodyLogLimit = 4096; // 限制响应体最大记录 4KB</span>
<span class="line"></span>
<span class="line">    // 4. 配置要跳过日志记录的路径 (可选)</span>
<span class="line">    // 例如，跳过健康检查或静态文件的日志</span>
<span class="line">    // logging.MediaTypeOptions.AddText(&quot;text/plain&quot;); // 可以添加更多要作为文本记录的MediaType</span>
<span class="line">});</span>
<span class="line"></span>
<span class="line">// ... 其他服务注册，如 AddControllers(), AddSwaggerGen() 等 ...</span>
<span class="line"></span>
<span class="line">var app = builder.Build();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>添加HTTP日志中间件</li></ol><p>服务注册完成后，您需要在应用程序的请求处理管道中添加 HTTP 日志中间件。这个中间件应该放置在管道的<strong>早期位置</strong>，以便它能捕获到所有后续中间件处理的请求和响应。</p><p><strong>最佳实践：</strong> 通常放在 <code>UseDeveloperExceptionPage()</code> 或 <code>UseExceptionHandler()</code> 之后，但要在 <code>UseRouting()</code> 和 <code>UseStaticFiles()</code> 等其他处理请求的中间件之前。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">// ...</span>
<span class="line">var app = builder.Build();</span>
<span class="line"></span>
<span class="line">// 开发环境的异常处理页</span>
<span class="line">if (app.Environment.IsDevelopment())</span>
<span class="line">{</span>
<span class="line">    app.UseDeveloperExceptionPage();</span>
<span class="line">    app.UseSwagger();</span>
<span class="line">    app.UseSwaggerUI();</span>
<span class="line">}</span>
<span class="line">else</span>
<span class="line">{</span>
<span class="line">    app.UseExceptionHandler(&quot;/Error&quot;); // 生产环境友好的错误页面</span>
<span class="line">    app.UseHsts();</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">app.UseHttpsRedirection();</span>
<span class="line"></span>
<span class="line">// **关键步骤：添加 HTTP 日志中间件**</span>
<span class="line">// 通常放在 UseHttpsRedirection() 之后，但要早于处理路由、认证等的中间件</span>
<span class="line">app.UseHttpLogging();</span>
<span class="line"></span>
<span class="line">app.UseStaticFiles(); // 处理静态文件</span>
<span class="line">app.UseRouting();     // 路由匹配</span>
<span class="line"></span>
<span class="line">app.UseAuthorization(); // 认证和授权</span>
<span class="line"></span>
<span class="line">app.MapControllers();   // 映射控制器路由</span>
<span class="line">app.MapRazorPages();    // 映射 Razor Pages 路由</span>
<span class="line">app.MapDefaultControllerRoute(); // 如果是MVC</span>
<span class="line"></span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="日志输出的目的地" tabindex="-1"><a class="header-anchor" href="#日志输出的目的地"><span>日志输出的目的地</span></a></h4><p>HTTP 日志记录中间件会将捕获到的日志发送到应用程序配置的 <strong><code>ILogger</code> 提供程序</strong>。这意味着，如果您配置了控制台日志提供程序、调试窗口日志提供程序或集成了 Serilog/NLog，HTTP 日志就会出现在这些目标的输出中。</p><p><strong>示例输出（取决于ILogger配置和格式化器）</strong></p><p>在控制台中，可能会看到类似这样的日志（通常以 <code>Microsoft.AspNetCore.HttpLogging.HttpLoggingMiddleware</code> 作为分类器）：</p><div class="language-LOG line-numbers-mode" data-highlighter="prismjs" data-ext="LOG"><pre><code class="language-LOG"><span class="line">info: Microsoft.AspNetCore.HttpLogging.HttpLoggingMiddleware[1]</span>
<span class="line">      Request:</span>
<span class="line">        Method: POST</span>
<span class="line">        Path: /api/products</span>
<span class="line">        Query: ?source=web</span>
<span class="line">        Headers:</span>
<span class="line">          Accept: [application/json]</span>
<span class="line">          Content-Type: [application/json]</span>
<span class="line">          Authorization: [***REDACTED***] // 被隐藏的敏感头</span>
<span class="line">        Body: {&quot;name&quot;:&quot;New Product&quot;,&quot;price&quot;:19.99}</span>
<span class="line"></span>
<span class="line">info: Microsoft.AspNetCore.HttpLogging.HttpLoggingMiddleware[2]</span>
<span class="line">      Response:</span>
<span class="line">        StatusCode: 201</span>
<span class="line">        Headers:</span>
<span class="line">          Content-Type: [application/json; charset=utf-8]</span>
<span class="line">          Date: [Thu, 10 Jul 2025 12:00:00 GMT]</span>
<span class="line">        Body: {&quot;id&quot;:101,&quot;name&quot;:&quot;New Product&quot;,&quot;price&quot;:19.99}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="注意事项-最佳实践" tabindex="-1"><a class="header-anchor" href="#注意事项-最佳实践"><span>注意事项&amp;最佳实践</span></a></h4><p><strong>敏感数据处理 (Data Redaction)</strong>：</p><ul><li><strong>极其重要！</strong> HTTP 日志非常容易泄露敏感数据，如用户凭据、会话令牌、信用卡信息等。</li><li><strong>务必使用 <code>logging.RequestHeaders.Add(&quot;HeaderName&quot;)</code> 和 <code>logging.ResponseHeaders.Add(&quot;HeaderName&quot;)</code> 来隐藏这些头的值。</strong></li><li>对于请求体和响应体中的敏感数据，您需要自行处理，例如在记录日志之前进行脱敏，或者在生产环境中限制记录体的大小并仅记录必要的头部信息。</li><li>默认情况下，<code>Authorization</code>、<code>Cookie</code>、<code>Proxy-Authorization</code>、<code>WWW-Authenticate</code>、<code>Set-Cookie</code> 头的值会被自动隐藏。但您应该根据您的应用自定义额外的敏感头。</li></ul><p><strong>性能影响 (Performance Impact)</strong>：</p><ul><li>记录请求体和响应体（特别是大型体）会产生显著的性能开销，因为它涉及读取整个流并将其缓冲到内存中。</li><li>在<strong>生产环境</strong>中，请<strong>谨慎启用</strong> <code>HttpLoggingFields.RequestBody</code> 和 <code>HttpLoggingFields.ResponseBody</code>。通常，您可能只需要记录头部、路径和状态码。</li><li>使用 <code>RequestBodyLogLimit</code> 和 <code>ResponseBodyLogLimit</code> 来限制记录体的大小，可以减轻部分性能影响。</li></ul><p><strong>日志量控制</strong>：</p><ul><li>在高流量应用程序中，HTTP 日志会产生大量的日志数据，这可能迅速填满磁盘、增加日志管理成本。</li><li>通过调整 <code>HttpLoggingFields</code> 来限制记录的详细程度。</li><li>结合 <code>ILogger</code> 的日志级别过滤功能，例如，可以将 <code>Microsoft.AspNetCore.HttpLogging.HttpLoggingMiddleware</code> 类别的日志级别在生产环境中设置为 <code>Warning</code> 或 <code>Error</code>，只记录异常的 HTTP 流量。</li></ul><p><strong>放置位置</strong>：</p><ul><li><code>UseHttpLogging()</code> 应该放在请求管道的早期，以便捕获到尽可能多的请求和响应信息。</li><li>通常放在异常处理中间件（<code>UseDeveloperExceptionPage()</code> 或 <code>UseExceptionHandler()</code>）之后，这样 HTTP 日志不会因为处理异常而中断，也能记录到异常导致的状态码。</li><li>放在认证/授权中间件之前，可以记录未认证/未授权的请求。</li></ul><p><strong>与自定义日志的互补</strong>：</p><ul><li>HTTP 日志记录提供了网络层面的视图。您仍然需要在业务逻辑层使用 <code>ILogger&lt;T&gt;</code> 来记录应用程序内部的详细操作和业务事件。两者是互补的。</li></ul><h3 id="w3c记录器" tabindex="-1"><a class="header-anchor" href="#w3c记录器"><span>W3C记录器</span></a></h3><h4 id="概述-5" tabindex="-1"><a class="header-anchor" href="#概述-5"><span>概述</span></a></h4><p>W3CLogger 是一个以 <a href="https://www.w3.org/TR/WD-logfile.html" target="_blank" rel="noopener noreferrer">W3C 标准格式</a>写入日志文件的中间件。 相关日志包含有关 HTTP 请求和 HTTP 响应的信息。 W3CLogger 提供以下内容的日志：</p><ul><li>HTTP 请求信息</li><li>公共属性</li><li>标头</li><li>HTTP 响应信息</li><li>有关请求/响应对的元数据（开始日期/时间，所用时间）</li></ul><p>在以下几种方案中，W3CLogger 很有价值：</p><ul><li>记录传入请求和响应的相关信息。</li><li>筛选请求和响应的哪些部分被记录。</li><li>筛选要记录的头。</li></ul><blockquote><p>W3CLogger 可能会降低应用的性能。 在选择要记录的字段时考虑性能影响 - 记录的属性越多，性能降低越多。 测试所选日志记录属性的性能影响。</p></blockquote><p><strong>文件格式：</strong></p><p>W3C 扩展日志文件格式是一种文本格式，用于记录 Web 服务器的活动。它的特点是：</p><ul><li><p><strong>结构化</strong>：日志文件通常以 <code>#Fields:</code> 行开头，明确列出后面数据行中每个字段的名称。例如：</p><div class="language-LOG line-numbers-mode" data-highlighter="prismjs" data-ext="LOG"><pre><code class="language-LOG"><span class="line">#Fields: date time s-ip cs-method cs-uri-stem cs-uri-query s-port cs-username c-ip cs(User-Agent) sc-status time-taken</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p><strong>可扩展</strong>：您可以定义自己的字段。</p></li><li><p><strong>易于解析</strong>：由于其结构化特性，各种日志分析工具（如 Log Parser、ELK Stack、Splunk）可以轻松地解析和处理 W3C 格式的日志。</p></li></ul><p>日志示例：</p><div class="language-LOG line-numbers-mode" data-highlighter="prismjs" data-ext="LOG"><pre><code class="language-LOG"><span class="line">#Fields: date time s-ip cs-method cs-uri-stem cs-uri-query s-port cs-username c-ip cs(User-Agent) sc-status time-taken</span>
<span class="line">2025-07-10 17:30:00 127.0.0.1 GET /api/products - 443 - 127.0.0.1 Mozilla/5.0+(Windows+NT+10.0)+... 200 15</span>
<span class="line">2025-07-10 17:30:01 127.0.0.1 POST /api/orders - 443 - 127.0.0.1 curl/7.81.0 201 250</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="使用方法-7" tabindex="-1"><a class="header-anchor" href="#使用方法-7"><span>使用方法</span></a></h4><ol><li>添加W3C日志服务</li></ol><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">// Program.cs</span>
<span class="line">using Microsoft.AspNetCore.HttpLogging; // W3CLogger也在此命名空间下</span>
<span class="line"></span>
<span class="line">var builder = WebApplication.CreateBuilder(args);</span>
<span class="line"></span>
<span class="line">// 添加 W3C 日志服务并进行配置</span>
<span class="line">builder.Services.AddW3CLogging(logging =&gt;</span>
<span class="line">{</span>
<span class="line">    // 1. 配置要记录哪些字段</span>
<span class="line">    // W3CLoggingFields 枚举允许您选择要记录的字段。</span>
<span class="line">    // 您可以使用 | 运算符组合多个字段。</span>
<span class="line">    logging.LoggingFields = W3CLoggingFields.All; // 记录所有标准 W3C 字段</span>
<span class="line"></span>
<span class="line">    // 也可以选择性记录，例如：</span>
<span class="line">    // logging.LoggingFields = W3CLoggingFields.Date |</span>
<span class="line">    //                         W3CLoggingFields.Time |</span>
<span class="line">    //                         W3CLoggingFields.ClientIpAddress |</span>
<span class="line">    //                         W3CLoggingFields.Method |</span>
<span class="line">    //                         W3CLoggingFields.UriStem |</span>
<span class="line">    //                         W3CLoggingFields.UriQuery |</span>
<span class="line">    //                         W3CLoggingFields.ServerPort |</span>
<span class="line">    //                         W3CLoggingFields.UserAgent |</span>
<span class="line">    //                         W3CLoggingFields.StatusCode |</span>
<span class="line">    //                         W3CLoggingFields.TimeTaken;</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">    // 2. 配置日志文件管理</span>
<span class="line">    logging.FileSizeLimit = 10 * 1024 * 1024; // 每个日志文件最大 10 MB (10 * 1024 * 1024 bytes)</span>
<span class="line">    logging.RetainedFileCountLimit = 50;      // 最多保留 50 个日志文件</span>
<span class="line">    logging.FileName = &quot;my-app-access-&quot;;     // 日志文件名前缀，例如：my-app-access-20250710.log</span>
<span class="line">    logging.LogDirectory = Path.Combine(AppContext.BaseDirectory, &quot;logs&quot;, &quot;w3c&quot;); // 日志存储目录</span>
<span class="line">                                                                                 // AppContext.BaseDirectory 是应用程序的根目录</span>
<span class="line"></span>
<span class="line">    // 3. 配置日志刷新间隔</span>
<span class="line">    logging.FlushInterval = TimeSpan.FromSeconds(2); // 每 2 秒刷新一次日志到磁盘，防止数据丢失（但也增加I/O）</span>
<span class="line"></span>
<span class="line">    // 4. 是否跳过静态文件的日志 (可选，通常推荐)</span>
<span class="line">    // 默认为 false，这意味着静态文件请求也会被记录。</span>
<span class="line">    // 如果设置为 true，则对静态文件（如 .css, .js, .png）的请求将不会被记录。</span>
<span class="line">    logging.SkipSuccessfulStaticFileRequests = true;</span>
<span class="line"></span>
<span class="line">    // 5. 配置要忽略的请求路径 (可选)</span>
<span class="line">    // logging.IgnorePaths.Add(&quot;/healthz&quot;); // 忽略健康检查路径的日志</span>
<span class="line">});</span>
<span class="line"></span>
<span class="line">// ... 其他服务注册 ...</span>
<span class="line"></span>
<span class="line">var app = builder.Build();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>添加W3C日志中间件</li></ol><p>服务注册完成后，您需要在应用程序的请求处理管道中添加 W3C 日志中间件。<strong>这个中间件必须放置在管道的早期位置，才能捕获到尽可能多的请求信息，特别是要在 <code>UseStaticFiles()</code> 和 <code>UseRouting()</code> 之前。</strong></p><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">// Program.cs</span>
<span class="line">// ...</span>
<span class="line">var app = builder.Build();</span>
<span class="line"></span>
<span class="line">// 开发环境的异常处理页</span>
<span class="line">if (app.Environment.IsDevelopment())</span>
<span class="line">{</span>
<span class="line">    app.UseDeveloperExceptionPage();</span>
<span class="line">    app.UseSwagger();</span>
<span class="line">    app.UseSwaggerUI();</span>
<span class="line">}</span>
<span class="line">else</span>
<span class="line">{</span>
<span class="line">    app.UseExceptionHandler(&quot;/Error&quot;);</span>
<span class="line">    app.UseHsts();</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">app.UseHttpsRedirection();</span>
<span class="line"></span>
<span class="line">// **关键步骤：添加 W3C 日志中间件**</span>
<span class="line">// W3CLogger 必须放在 UseStaticFiles() 和 UseRouting() 之前，</span>
<span class="line">// 这样才能记录所有进入应用程序的请求，包括静态文件和未路由的请求。</span>
<span class="line">app.UseW3CLogging();</span>
<span class="line"></span>
<span class="line">app.UseStaticFiles(); // 处理静态文件</span>
<span class="line">app.UseRouting();     // 路由匹配</span>
<span class="line"></span>
<span class="line">app.UseAuthorization();</span>
<span class="line">app.MapControllers();</span>
<span class="line">app.MapRazorPages();</span>
<span class="line"></span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="w3c-vs-http" tabindex="-1"><a class="header-anchor" href="#w3c-vs-http"><span>W3C VS HTTP</span></a></h4><table><thead><tr><th>特性</th><th>HTTP 日志记录 (HttpLoggingMiddleware)</th><th>W3C 记录器 (W3CLoggingMiddleware)</th></tr></thead><tbody><tr><td>日志格式</td><td>输出到标准的 ILogger，格式由所选的 ILogger 提供程序（如 Console, Serilog）决定。通常是结构化 JSON 或自定义文本。</td><td>W3C 扩展日志文件格式（纯文本，带有 #Fields 头部）。</td></tr><tr><td>输出目的地</td><td>应用程序配置的 ILogger 提供程序（控制台、调试窗口、文件、数据库、云日志等）。</td><td>专门的文件系统路径（通过 LogDirectory 配置）。</td></tr><tr><td>记录内容</td><td>可配置记录请求头/体、响应头/体、路径、查询字符串、状态码等。对请求体和响应体支持更细致的控制和截断。</td><td>主要记录 HTTP 请求的元数据：日期、时间、IP、方法、URI、状态码、处理时间、用户代理等。通常不记录请求/响应体。</td></tr><tr><td>性能/资源</td><td>记录请求/响应体时可能产生较大性能开销。</td><td>通常性能开销较小，因为它主要记录元数据，不缓存整个体。</td></tr><tr><td>适用场景</td><td>开发调试、问题诊断、需要查看请求/响应体内容的场景。可以与现有日志聚合工具无缝集成。</td><td>兼容现有 W3C 日志分析工具、需要与传统 Web 服务器日志统一、专注于 Web 访问分析和审计的场景。</td></tr><tr><td>敏感数据处理</td><td>通过 RequestHeaders.Add 等方法对头进行 <em><strong>REDACTED</strong></em> 处理。对体需手动处理或限制大小。</td><td>记录的字段不包含请求/响应体，敏感数据风险相对较小。</td></tr><tr><td>中间件顺序</td><td>放在异常处理之后，路由之前。</td><td>必须放在 UseStaticFiles() 和 UseRouting() 之前，以确保捕获所有进入应用的请求。</td></tr></tbody></table><h4 id="注意事项-最佳实践-1" tabindex="-1"><a class="header-anchor" href="#注意事项-最佳实践-1"><span>注意事项&amp;最佳实践</span></a></h4><ul><li><strong>文件存储和清理</strong>：W3C 记录器将日志写入本地文件。在生产环境中，请确保您有适当的策略来： <ul><li><strong>监控磁盘空间</strong>：防止日志文件填满磁盘。</li><li><strong>定期归档和删除旧文件</strong>：<code>RetainedFileCountLimit</code> 可以帮助自动管理，但对于长期存储，您可能需要将它们传输到对象存储或日志聚合系统。</li></ul></li><li><strong>性能</strong>：虽然 W3C 记录器本身的开销比记录完整请求体/响应体的 HTTP 日志记录要小，但频繁的磁盘 I/O 仍然会产生一定影响。<code>FlushInterval</code> 的设置会影响写入频率和潜在的数据丢失风险。</li><li><strong>日志分析</strong>：为了充分利用 W3C 格式日志，您需要使用能够解析这种格式的工具（如 Log Parser、自定义脚本或集成到 ELK Stack 等日志聚合平台）。</li><li><strong>与 <code>ILogger</code> 分离</strong>：W3C 记录器不会将日志输出到您常规的 <code>ILogger</code> 提供程序。它们是独立的日志流。这意味着应用程序内部的业务逻辑日志和 Web 访问日志是分开管理的。</li><li><strong>不记录请求/响应体</strong>：请记住，W3C 记录器通常不记录请求或响应的实际内容。如果需要这些内容进行调试，应该使用前面讲过的 <strong>HTTP 日志记录中间件</strong>。</li></ul><h3 id="健康检查" tabindex="-1"><a class="header-anchor" href="#健康检查"><span>健康检查</span></a></h3><h4 id="健康状态等级" tabindex="-1"><a class="header-anchor" href="#健康状态等级"><span>健康状态等级</span></a></h4><table><thead><tr><th>类型</th><th>说明</th><th>典型应用</th></tr></thead><tbody><tr><td>✅ <code>Healthy</code></td><td>一切正常</td><td>默认健康检查返回</td></tr><tr><td>⚠️ <code>Degraded</code></td><td>可用但性能或稳定性下降</td><td>比如响应慢、空间快满</td></tr><tr><td>❌ <code>Unhealthy</code></td><td>无法使用或严重问题</td><td>连接失败、崩溃、依赖项不可用</td></tr></tbody></table><p><strong>状态码映射</strong></p><ul><li><code>HealthStatus.Healthy</code> -&gt; HTTP 200 OK</li><li><code>HealthStatus.Degraded</code> -&gt; HTTP 200 OK (但通常监控系统会将其视为警告)</li><li><code>HealthStatus.Unhealthy</code> -&gt; HTTP 503 Service Unavailable</li></ul><h4 id="健康检查类型" tabindex="-1"><a class="header-anchor" href="#健康检查类型"><span>健康检查类型</span></a></h4><table><thead><tr><th>类型</th><th>说明</th></tr></thead><tbody><tr><td>一般健康检查（General health checks）</td><td>检查应用基本运行状态，例如 Redis、数据库等</td></tr><tr><td>活跃性检查（Liveness probe）</td><td>检查应用是否存活，通常用于判断是否重启容器</td></tr><tr><td>就绪性检查（Readiness probe）</td><td>检查应用是否准备好接收流量，常用于服务注册或负载均衡</td></tr></tbody></table><h4 id="使用方法-8" tabindex="-1"><a class="header-anchor" href="#使用方法-8"><span>使用方法</span></a></h4><ol><li>安装NuGet包</li></ol><p>对于基本的健康检查，您不需要额外的 NuGet 包，因为核心功能已包含在 <code>Microsoft.AspNetCore.App</code> 元包中。 如果您需要检查 SQL Server、Redis 等特定依赖项，则可能需要安装相应的扩展包，例如：</p><ul><li><code>Microsoft.Extensions.Diagnostics.HealthChecks.SqlServer</code></li><li><code>Microsoft.Extensions.Diagnostics.HealthChecks.Redis</code></li><li><code>AspNetCore.HealthChecks.UI</code> (用于健康检查仪表板)</li><li><code>AspNetCore.HealthChecks.Publisher.Prometheus</code> (用于 Prometheus 集成)</li></ul><ol start="2"><li>在 <code>Program.cs</code> 中注册健康检查服务</li></ol><p>使用 <code>AddHealthChecks()</code> 扩展方法注册健康检查服务，并定义要执行的检查项。</p><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">// Program.cs</span>
<span class="line">using Microsoft.Extensions.Diagnostics.HealthChecks; // 确保引入此命名空间</span>
<span class="line"></span>
<span class="line">var builder = WebApplication.CreateBuilder(args);</span>
<span class="line"></span>
<span class="line">// 关键步骤：注册健康检查服务</span>
<span class="line">builder.Services.AddHealthChecks()</span>
<span class="line">    // 1. 添加一个简单的存活检查 (Liveness Check)</span>
<span class="line">    // 这是一个最基本的检查，只返回 HealthStatus.Healthy</span>
<span class="line">    .AddCheck(&quot;liveness&quot;, () =&gt; HealthCheckResult.Healthy(&quot;A simple liveness check.&quot;), new[] { &quot;live&quot; })</span>
<span class="line"></span>
<span class="line">    // 2. 添加一个依赖项检查 - 数据库连接</span>
<span class="line">    // 需要安装 Microsoft.Extensions.Diagnostics.HealthChecks.SqlServer NuGet 包</span>
<span class="line">    .AddSqlServer(</span>
<span class="line">        connectionString: builder.Configuration.GetConnectionString(&quot;DefaultConnection&quot;)!,</span>
<span class="line">        healthQuery: &quot;SELECT 1;&quot;, // 用于检查连接的SQL查询</span>
<span class="line">        name: &quot;SQL Server DB&quot;,    // 检查项的名称</span>
<span class="line">        failureStatus: HealthStatus.Degraded, // 失败时返回 Degraded 而不是 Unhealthy</span>
<span class="line">        tags: new[] { &quot;db&quot;, &quot;ready&quot; }) // 标签，用于分组和过滤检查</span>
<span class="line"></span>
<span class="line">    // 3. 添加一个自定义的健康检查,自定义逻辑请看下一个小节</span>
<span class="line">    // 实现 IHealthCheck 接口或使用 lambda 表达式</span>
<span class="line">    .AddCheck&lt;MyCustomHealthCheck&gt;(&quot;My Custom Service&quot;, tags: new[] { &quot;custom&quot;, &quot;ready&quot; })</span>
<span class="line"></span>
<span class="line">    // 4. 添加一个外部 API 检查 (例如，检查某个外部服务的可达性)</span>
<span class="line">    // 可以使用 AddUrlGroup 或 AddCheck 来实现</span>
<span class="line">    .AddUrlGroup(</span>
<span class="line">        uri: new Uri(&quot;https://api.example.com/health&quot;), // 外部API的健康检查端点</span>
<span class="line">        name: &quot;External API&quot;,</span>
<span class="line">        failureStatus: HealthStatus.Unhealthy,</span>
<span class="line">        tags: new[] { &quot;external&quot; });</span>
<span class="line"></span>
<span class="line">// 注册自定义健康检查类 (如果使用 AddCheck&lt;T&gt; 方式)</span>
<span class="line">builder.Services.AddSingleton&lt;MyCustomHealthCheck&gt;();</span>
<span class="line"></span>
<span class="line">// ... 其他服务注册 ...</span>
<span class="line"></span>
<span class="line">var app = builder.Build();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>在 <code>Program.cs</code> 中映射健康检查终结点</li></ol><p>注册服务后，您需要通过 <code>MapHealthChecks()</code> 扩展方法将健康检查暴露为 HTTP 终结点。</p><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">// Program.cs</span>
<span class="line">// ...</span>
<span class="line">var app = builder.Build();</span>
<span class="line"></span>
<span class="line">// ... 中间件管道配置 ...</span>
<span class="line"></span>
<span class="line">app.UseHttpsRedirection();</span>
<span class="line">app.UseAuthorization();</span>
<span class="line">app.MapControllers();</span>
<span class="line"></span>
<span class="line">// **关键步骤：映射健康检查终结点**</span>
<span class="line"></span>
<span class="line">// 1. 映射一个基本的健康检查终结点</span>
<span class="line">// 默认返回所有注册的健康检查的状态</span>
<span class="line">app.MapHealthChecks(&quot;/healthz&quot;);</span>
<span class="line"></span>
<span class="line">// 2. 映射一个更详细的健康检查终结点，包含具体组件的状态</span>
<span class="line">// 可以使用 Predicate 过滤要显示的检查项 (基于标签)</span>
<span class="line">app.MapHealthChecks(&quot;/healthz/ready&quot;, new HealthCheckOptions</span>
<span class="line">{</span>
<span class="line">    Predicate = healthCheck =&gt; healthCheck.Tags.Contains(&quot;ready&quot;), // 只显示带有 &quot;ready&quot; 标签的检查</span>
<span class="line">    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse // 使用 HealthChecks.UI 的响应写入器</span>
<span class="line">});</span>
<span class="line"></span>
<span class="line">// 3. 映射一个只显示 Liveness 检查的终结点</span>
<span class="line">app.MapHealthChecks(&quot;/healthz/live&quot;, new HealthCheckOptions</span>
<span class="line">{</span>
<span class="line">    Predicate = healthCheck =&gt; healthCheck.Tags.Contains(&quot;live&quot;)</span>
<span class="line">});</span>
<span class="line"></span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="自定义健康检查逻辑" tabindex="-1"><a class="header-anchor" href="#自定义健康检查逻辑"><span>自定义健康检查逻辑</span></a></h4><p>可以创建一个类，实现 <code>IHealthCheck</code> 接口，编写自己的健康检查逻辑。</p><div class="language-c# line-numbers-mode" data-highlighter="prismjs" data-ext="c#"><pre><code class="language-c#"><span class="line">// MyCustomHealthCheck.cs</span>
<span class="line">using Microsoft.Extensions.Diagnostics.HealthChecks;</span>
<span class="line"></span>
<span class="line">public class MyCustomHealthCheck : IHealthCheck</span>
<span class="line">{</span>
<span class="line">    public Task&lt;HealthCheckResult&gt; CheckHealthAsync(</span>
<span class="line">        HealthCheckContext context,</span>
<span class="line">        CancellationToken cancellationToken = default)</span>
<span class="line">    {</span>
<span class="line">        // 模拟一个随机的健康检查结果</span>
<span class="line">        var isHealthy = Random.Shared.Next(0, 2) == 0; // 50% 概率健康</span>
<span class="line"></span>
<span class="line">        if (isHealthy)</span>
<span class="line">        {</span>
<span class="line">            return Task.FromResult(HealthCheckResult.Healthy(&quot;My custom service is healthy.&quot;));</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        // 可以返回 Unhealthy 或 Degraded</span>
<span class="line">        // Unhealthy: 服务无法正常工作，需要立即关注或重启</span>
<span class="line">        // Degraded: 服务功能受限，但仍可部分工作</span>
<span class="line">        return Task.FromResult(</span>
<span class="line">            HealthCheckResult.Unhealthy(&quot;My custom service is unhealthy. Simulated failure.&quot;));</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="响应格式" tabindex="-1"><a class="header-anchor" href="#响应格式"><span>响应格式</span></a></h4><p>当您访问健康检查终结点时，默认会返回一个简单的 JSON 响应，指示应用程序的总体健康状态。</p><ul><li>简单响应示例 (<code>/healthz</code>):</li></ul><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code class="language-json"><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">&quot;status&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Healthy&quot;</span> <span class="token comment">// 或 &quot;Unhealthy&quot;, &quot;Degraded&quot;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>详细响应示例（<code>/healthz/ready</code> 使用 <code>UIResponseWriter</code>）</li></ul><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code class="language-json"><span class="line"><span class="token punctuation">{</span></span>
<span class="line">  <span class="token property">&quot;status&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Degraded&quot;</span><span class="token punctuation">,</span> <span class="token comment">// 总体状态</span></span>
<span class="line">  <span class="token property">&quot;totalDuration&quot;</span><span class="token operator">:</span> <span class="token string">&quot;00:00:00.0150000&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token property">&quot;entries&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">&quot;liveness&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">&quot;status&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Healthy&quot;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> <span class="token string">&quot;A simple liveness check.&quot;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">&quot;duration&quot;</span><span class="token operator">:</span> <span class="token string">&quot;00:00:00.0001000&quot;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">&quot;SQL Server DB&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">&quot;status&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Healthy&quot;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> <span class="token string">&quot;SQL Server DB is healthy.&quot;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">&quot;duration&quot;</span><span class="token operator">:</span> <span class="token string">&quot;00:00:00.0050000&quot;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">&quot;My Custom Service&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">&quot;status&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Unhealthy&quot;</span><span class="token punctuation">,</span> <span class="token comment">// 模拟失败</span></span>
<span class="line">      <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> <span class="token string">&quot;My custom service is unhealthy. Simulated failure.&quot;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">&quot;duration&quot;</span><span class="token operator">:</span> <span class="token string">&quot;00:00:00.0005000&quot;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">&quot;External API&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">&quot;status&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Healthy&quot;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">&quot;description&quot;</span><span class="token operator">:</span> <span class="token string">&quot;External API is healthy.&quot;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">&quot;duration&quot;</span><span class="token operator">:</span> <span class="token string">&quot;00:00:00.0020000&quot;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="注意事项-最佳实践-2" tabindex="-1"><a class="header-anchor" href="#注意事项-最佳实践-2"><span>注意事项&amp;最佳实践</span></a></h4><ol><li><p><strong>轻量级和快速</strong>：健康检查应该尽可能地轻量级和快速。避免在健康检查中执行耗时的操作，如复杂的数据库查询或长时间的外部 API 调用。如果检查项很慢，可能会导致监控系统误判服务不健康。</p></li><li><p><strong>区分 Liveness 和 Readiness</strong>：</p><ul><li><p><strong>Liveness Probe</strong> 应该只检查应用程序本身是否活着（例如，Web 服务器是否响应）。不要在 Liveness Probe 中检查外部依赖项，因为如果依赖项暂时不可用，您不希望应用程序被无谓地重启。</p></li><li><p><strong>Readiness Probe</strong> 应该检查应用程序是否已准备好接收流量，包括其依赖项的可达性。</p></li></ul></li><li><p><strong>标签 (Tags)</strong>：充分利用 <code>tags</code> 来对健康检查进行分类。这允许您创建多个健康检查终结点，每个终结点只报告特定类型的检查（例如，<code>/healthz/live</code> 用于 Liveness，<code>/healthz/ready</code> 用于 Readiness）。</p></li><li><p><strong>响应写入器</strong>：默认的健康检查响应非常简洁。对于人工查看或更高级的监控系统，考虑使用 <code>UIResponseWriter</code> 或自定义响应写入器来提供更详细的信息。</p></li><li><p><strong>安全性</strong>：健康检查终结点通常是公开的。确保它们不暴露任何敏感信息。如果需要，可以通过网络策略、API 网关或认证来保护它们。</p></li><li><p><strong>外部依赖项</strong>：当检查外部依赖项时，考虑其瞬时故障的可能性。如果一个依赖项只是暂时不可用，您可能希望返回 <code>Degraded</code> 而不是 <code>Unhealthy</code>，以避免不必要的服务重启。</p></li><li><p><strong>与监控系统集成</strong>：将健康检查终结点配置到您的容器编排平台（Kubernetes 的 <code>livenessProbe</code> 和 <code>readinessProbe</code>）、负载均衡器或云监控服务中。</p></li></ol><h2 id="httpcontext" tabindex="-1"><a class="header-anchor" href="#httpcontext"><span>HttpContext</span></a></h2><p><strong>定义</strong>：HttpContext 是 ASP.NET Core 中的核心类，封装了 HTTP 请求和响应的上下文信息，包含请求、响应、会话、用户身份等数据。</p><p><strong>作用</strong>：</p><ul><li>提供对当前 HTTP 请求和响应的访问。</li><li>存储请求生命周期内的上下文数据（如认证信息、会话状态）。</li><li>在中间件、控制器、Razor Pages 等中用于处理请求和生成响应。</li></ul><p><strong>生命周期</strong>：每个 HTTP 请求创建一个新的 HttpContext 实例，请求结束后销毁。</p><h3 id="httprequest" tabindex="-1"><a class="header-anchor" href="#httprequest"><span>HttpRequest</span></a></h3><p>通过<code>HttpContext.Request</code>，可以访问和读取所有关于传入请求的信息。</p><p><strong>主要属性：</strong></p><ul><li><p><strong><code>Method</code></strong>：获取请求的 HTTP 方法，例如 &quot;GET&quot;, &quot;POST&quot;, &quot;PUT&quot;, &quot;DELETE&quot; 等。</p></li><li><p><strong><code>Path</code></strong>：获取请求的 URL 路径，不包括域名和查询字符串。</p></li><li><p><strong><code>Query</code></strong>：获取请求的<strong>查询字符串参数集合</strong> (<code>IQueryCollection</code>)。您可以按键访问参数值。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">string productId = HttpContext.Request.Query[&quot;productId&quot;]; // 获取 &quot;?productId=123&quot; 中的 &quot;123&quot;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p><strong><code>Headers</code></strong>：获取请求的<strong>头部信息集合</strong> (<code>IHeaderDictionary</code>)。您可以按键访问头部值。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">string userAgent = HttpContext.Request.Headers[&quot;User-Agent&quot;].ToString();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p><strong><code>Body</code></strong>：获取请求体的<strong>输入流</strong> (<code>Stream</code>)。当客户端发送 POST 或 PUT 请求，并且请求体中包含数据（如 JSON、表单数据、文件）时，您需要从这个流中读取。</p><p>读取 <code>Body</code> 是一个异步操作。通常会使用 <code>StreamReader</code> 或特定的模型绑定器来处理。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// 读取请求体为字符串（慎用大请求体）</span>
<span class="line">using var reader = new StreamReader(HttpContext.Request.Body);</span>
<span class="line">string requestBody = await reader.ReadToEndAsync();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong><code>ContentLength</code></strong>：获取请求体内容的长度（以字节为单位）。</p></li><li><p><strong><code>ContentType</code></strong>：获取请求体的 MIME 类型，例如 &quot;application/json&quot;, &quot;application/x-www-form-urlencoded&quot; 等。</p></li><li><p><strong><code>IsHttps</code></strong>：指示请求是否通过 HTTPS 安全连接发送。</p></li><li><p><strong><code>Host</code></strong>：获取请求的主机名（域名和端口）。</p></li></ul><h3 id="httpresponse" tabindex="-1"><a class="header-anchor" href="#httpresponse"><span>HttpResponse</span></a></h3><p>通过<code>HttpResponse</code>，您可以写入响应内容、设置状态码和头部信息。</p><ul><li><p><strong><code>StatusCode</code></strong>：设置 HTTP 响应状态码，例如 200 (OK), 404 (Not Found), 500 (Internal Server Error) 等。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">HttpContext.Response.StatusCode = 200;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p><strong><code>Headers</code></strong>：获取响应的<strong>头部信息集合</strong> (<code>IHeaderDictionary</code>)。您可以设置自定义响应头。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">HttpContext.Response.Headers.Add(&quot;X-Custom-Header&quot;, &quot;MyValue&quot;);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p><strong><code>Body</code></strong>：获取响应体的<strong>输出流</strong> (<code>Stream</code>)。您将数据写入此流以发送给客户端。</p><p>写入 <code>Body</code> 是一个异步操作。通常会使用 <code>StreamWriter</code> 或通过 <code>ControllerBase</code> 提供的 <code>Ok()</code>, <code>Json()</code> 等方法来间接写入。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// 直接写入字符串到响应体</span>
<span class="line">await HttpContext.Response.WriteAsync(&quot;Hello, World!&quot;);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong><code>ContentType</code></strong>：设置响应体的 MIME 类型，例如 &quot;application/json&quot;, &quot;text/plain&quot;, &quot;text/html&quot; 等。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">HttpContext.Response.ContentType = &quot;application/json&quot;;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p><strong><code>ContentLength</code></strong>：设置响应体的长度（以字节为单位）。通常在写入 <code>Body</code> 后由框架自动计算。</p></li><li><p><strong><code>Redirect()</code></strong>：执行 HTTP 重定向，将客户端引导到另一个 URL。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">HttpContext.Response.Redirect(&quot;/login&quot;);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li></ul><h3 id="requestaborted" tabindex="-1"><a class="header-anchor" href="#requestaborted"><span>RequestAborted</span></a></h3><p><code>HttpContext.RequestAborted</code> 是一个 <code>CancellationToken</code>（取消令牌）。它表示<strong>客户端取消了请求</strong>（例如，用户关闭了浏览器标签页，或者网络连接中断）。</p><p><strong>用途</strong>：在执行长时间运行的异步操作时，您应该<strong>监听这个令牌</strong>。如果令牌被取消，意味着客户端不再等待响应，您可以安全地终止当前操作，释放资源，避免不必要的计算。这对于服务器资源管理和性能优化至关重要。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public async Task&lt;IActionResult&gt; DownloadLargeFile()</span>
<span class="line">{</span>
<span class="line">    // 假设这是一个耗时的文件生成或下载操作</span>
<span class="line">    for (int i = 0; i &lt; 100; i++)</span>
<span class="line">    {</span>
<span class="line">        // 检查客户端是否已取消请求</span>
<span class="line">        if (HttpContext.RequestAborted.IsCancellationRequested)</span>
<span class="line">        {</span>
<span class="line">            _logger.LogWarning(&quot;Client cancelled download for large file.&quot;);</span>
<span class="line">            return new EmptyResult(); // 返回空结果或适当的错误</span>
<span class="line">        }</span>
<span class="line">        await Task.Delay(100, HttpContext.RequestAborted); // 模拟耗时操作，并传递取消令牌</span>
<span class="line">        // 写入部分数据到响应流</span>
<span class="line">        await HttpContext.Response.WriteAsync($&quot;Part {i}\\n&quot;);</span>
<span class="line">        await HttpContext.Response.Body.FlushAsync(); // 刷新缓冲区</span>
<span class="line">    }</span>
<span class="line">    return Ok(&quot;File downloaded successfully.&quot;);</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上面的例子中，<code>Task.Delay</code> 和 <code>HttpContext.Response.WriteAsync</code> 等异步操作通常会接受 <code>CancellationToken</code> 参数。当 <code>RequestAborted</code> 被触发时，这些操作就会抛出 <code>OperationCanceledException</code>，您可以捕获它来处理取消逻辑。</p><h3 id="abort" tabindex="-1"><a class="header-anchor" href="#abort"><span>Abort</span></a></h3><p><code>HttpContext.Abort()</code> 方法用于<strong>立即终止当前 HTTP 请求的处理</strong>。</p><p>当处于某种异常或不可恢复的状态，需要立即关闭连接并停止处理请求时使用。它会阻止进一步的中间件或终结点执行。</p><p><strong>注意</strong></p><ul><li>这是一个<strong>非常粗暴</strong>的操作，因为它会直接关闭底层 TCP 连接，可能导致客户端收到不完整的响应或连接错误。</li><li>通常情况下，您应该优先通过设置 <code>HttpContext.Response.StatusCode</code> 并返回一个 <code>IActionResult</code> 来优雅地结束请求（例如 <code>BadRequest()</code>, <code>NotFound()</code>, <code>StatusCode(500)</code>），而不是使用 <code>Abort()</code>。</li><li><code>Abort()</code> 在某些极端的错误场景下才会被考虑使用，例如，当检测到恶意请求或服务器资源耗尽，需要紧急切断连接时。</li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public IActionResult UnsafeOperation()</span>
<span class="line">{</span>
<span class="line">    if (Environment.IsProduction() &amp;&amp; HttpContext.Request.IsLocal()) // 假设只允许本地访问</span>
<span class="line">    {</span>
<span class="line">        _logger.LogError(&quot;Unauthorized access attempt detected from non-local IP. Aborting request.&quot;);</span>
<span class="line">        HttpContext.Abort(); // 立即终止连接</span>
<span class="line">        // 后续代码将不会执行</span>
<span class="line">        return Content(&quot;Should not reach here&quot;);</span>
<span class="line">    }</span>
<span class="line">    return Ok(&quot;Allowed access.&quot;);</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>大多数情况下，使用 <code>return Unauthorized()</code> 或 <code>return Forbid()</code> 来处理访问控制，它们会发送一个标准的 HTTP 响应，而不是粗暴地终止连接。</p><h3 id="user" tabindex="-1"><a class="header-anchor" href="#user"><span>User</span></a></h3><p><code>HttpContext.User</code> 属性是一个 <code>ClaimsPrincipal</code> 对象，它代表了<strong>当前 HTTP 请求的用户的身份信息</strong>。它是 .NET Core <strong>认证和授权机制的核心</strong>。</p><p><strong>用途</strong>：</p><ul><li><strong>身份识别</strong>：获取当前用户的用户名、ID 或其他标识信息。</li><li><strong>角色检查</strong>：判断用户是否属于某个角色。</li><li><strong>权限检查</strong>：根据用户的声明（Claims）判断用户是否有权执行某个操作。</li></ul><p><strong>组成</strong>：</p><ul><li><strong><code>ClaimsPrincipal</code></strong>：可以包含一个或多个 <code>ClaimsIdentity</code>。</li><li><strong><code>ClaimsIdentity</code></strong>：代表一个身份，包含一组与该身份相关的<strong>声明 (Claims)</strong>。</li><li><strong><code>Claim</code></strong>：一个键值对，表示用户的一个属性或事实，例如用户的姓名、电子邮件、角色、权限等。</li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">using System.Security.Claims; // 确保引入此命名空间</span>
<span class="line"></span>
<span class="line">public IActionResult GetUserProfile()</span>
<span class="line">{</span>
<span class="line">    // 检查用户是否已认证</span>
<span class="line">    if (HttpContext.User.Identity?.IsAuthenticated ?? false)</span>
<span class="line">    {</span>
<span class="line">        string userName = HttpContext.User.Identity.Name; // 获取用户名</span>
<span class="line">        // 获取用户ID声明（假设在登录时添加了 ClaimTypes.NameIdentifier）</span>
<span class="line">        string userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;</span>
<span class="line"></span>
<span class="line">        // 检查用户是否在 &quot;Admin&quot; 角色中</span>
<span class="line">        bool isAdmin = HttpContext.User.IsInRole(&quot;Admin&quot;);</span>
<span class="line"></span>
<span class="line">        // 获取自定义声明（如果存在）</span>
<span class="line">        string department = HttpContext.User.FindFirst(&quot;Department&quot;)?.Value;</span>
<span class="line"></span>
<span class="line">        return Ok($&quot;User: {userName}, ID: {userId}, IsAdmin: {isAdmin}, Department: {department}&quot;);</span>
<span class="line">    }</span>
<span class="line">    else</span>
<span class="line">    {</span>
<span class="line">        return Unauthorized(&quot;User not authenticated.&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="features" tabindex="-1"><a class="header-anchor" href="#features"><span>Features</span></a></h3><p><code>HttpContext.Features</code> 是一个 <code>IFeatureCollection</code>，它是一个<strong>低级别的、键值对集合</strong>，用于<strong>访问和操作当前请求的特定功能和能力</strong>。</p><p><strong>作用：</strong></p><ul><li>.NET Core 的许多底层功能（如请求/响应处理、连接信息、认证状态）都是通过“特性”（Feature）来实现的。</li><li><code>Features</code> 提供了一种灵活的机制来扩展和定制请求管道的行为，而无需修改 <code>HttpContext</code> 的核心接口。</li><li>它允许中间件和低层组件在请求处理过程中<strong>暴露和发现特定功能</strong>。</li></ul><p><strong>使用方式：</strong></p><p>使用泛型方法 <code>Get&lt;TFeature&gt;()</code> 来获取特定类型的特性接口。</p><ul><li><strong><code>IHttpRequestFeature</code></strong>：提供对请求方法、路径、协议等基本信息的访问。</li><li><strong><code>IHttpResponseFeature</code></strong>：提供对响应状态码、头部等基本信息的访问。</li><li><strong><code>IHttpConnectionFeature</code></strong>：提供连接信息，如本地和远程 IP 地址。</li><li><strong><code>IExceptionHandlerFeature</code></strong>：在异常处理中间件中获取异常信息。</li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">using Microsoft.AspNetCore.Http.Features; // 确保引入此命名空间</span>
<span class="line"></span>
<span class="line">public IActionResult GetConnectionInfo()</span>
<span class="line">{</span>
<span class="line">    // 获取连接特性</span>
<span class="line">    var connectionFeature = HttpContext.Features.Get&lt;IHttpConnectionFeature&gt;();</span>
<span class="line"></span>
<span class="line">    if (connectionFeature != null)</span>
<span class="line">    {</span>
<span class="line">        string remoteIp = connectionFeature.RemoteIpAddress?.ToString() ?? &quot;N/A&quot;;</span>
<span class="line">        int remotePort = connectionFeature.RemotePort;</span>
<span class="line">        string localIp = connectionFeature.LocalIpAddress?.ToString() ?? &quot;N/A&quot;;</span>
<span class="line">        int localPort = connectionFeature.LocalPort;</span>
<span class="line"></span>
<span class="line">        return Ok($&quot;Client IP: {remoteIp}:{remotePort}, Server IP: {localIp}:{localPort}&quot;);</span>
<span class="line">    }</span>
<span class="line">    else</span>
<span class="line">    {</span>
<span class="line">        return StatusCode(500, &quot;Connection feature not available.&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在大多数高层应用代码中，可能不会直接与 <code>Features</code> 交互，而是通过 <code>HttpContext.Request</code>、<code>HttpContext.Response</code> 等更高级别的属性来访问信息，因为这些属性已经封装了对底层特性的访问。然而，在编写自定义中间件或深度定制框架行为时，<code>Features</code> 变得非常有用。</p><h2 id="路由" tabindex="-1"><a class="header-anchor" href="#路由"><span>路由</span></a></h2><h3 id="约定式路由" tabindex="-1"><a class="header-anchor" href="#约定式路由"><span>约定式路由</span></a></h3><blockquote><p>[!CAUTION]</p><p>若在控制类上标记了[ApiController]，则该类不会匹配约定式路由</p></blockquote><p>默认的路由匹配格式：<code>{controller=Home}/{action=Index}/{id?}</code></p><h4 id="基础使用" tabindex="-1"><a class="header-anchor" href="#基础使用"><span>基础使用</span></a></h4><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">app.UseEndpoints(endpoints =&gt;</span>
<span class="line">{</span>
<span class="line">    // 定义一个名为 &quot;default&quot; 的约定式路由</span>
<span class="line">    endpoints.MapControllerRoute(</span>
<span class="line">        name: &quot;default&quot;,</span>
<span class="line">        pattern: &quot;{controller=Home}/{action=Index}/{id?}&quot;); // 路由模板</span>
<span class="line"></span>
<span class="line">    // 如果有其他约定式路由，可以继续添加，顺序很重要</span>
<span class="line">    // endpoints.MapControllerRoute(</span>
<span class="line">    //     name: &quot;blog&quot;,</span>
<span class="line">    //     pattern: &quot;blog/{year}/{month?}/{slug?}&quot;);</span>
<span class="line"></span>
<span class="line">    // 如果有 Razor Pages，也需要映射，它们默认也使用约定路由</span>
<span class="line">    endpoints.MapRazorPages();</span>
<span class="line">});</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="复杂配置" tabindex="-1"><a class="header-anchor" href="#复杂配置"><span>复杂配置</span></a></h4><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// ========== 复杂约定式路由模式 ==========</span>
<span class="line">// 1. 多层嵌套路由</span>
<span class="line">app.MapControllerRoute(</span>
<span class="line">    name: &quot;nested_resource&quot;,</span>
<span class="line">    pattern: &quot;{controller}/{id:int}/{subController}/{subId:int?}&quot;,</span>
<span class="line">    defaults: new { action = &quot;Index&quot; });</span>
<span class="line"></span>
<span class="line">// 2. 文件路径路由</span>
<span class="line">app.MapControllerRoute(</span>
<span class="line">    name: &quot;file_path&quot;,</span>
<span class="line">    pattern: &quot;files/{*filePath}&quot;,</span>
<span class="line">    defaults: new { controller = &quot;Files&quot;, action = &quot;Get&quot; });</span>
<span class="line"></span>
<span class="line">// 3. 多语言路由</span>
<span class="line">app.MapControllerRoute(</span>
<span class="line">    name: &quot;localized&quot;,</span>
<span class="line">    pattern: &quot;{culture:regex(^[a-z]{{2}}-[A-Z]{{2}}$)}/{controller=Home}/{action=Index}/{id?}&quot;);</span>
<span class="line"></span>
<span class="line">// 4. 子域名路由</span>
<span class="line">app.MapControllerRoute(</span>
<span class="line">    name: &quot;subdomain&quot;,</span>
<span class="line">    pattern: &quot;{controller=Home}/{action=Index}/{id?}&quot;,</span>
<span class="line">    defaults: new { subdomain = &quot;api&quot; });</span>
<span class="line"></span>
<span class="line">// 5. 日期路由</span>
<span class="line">app.MapControllerRoute(</span>
<span class="line">    name: &quot;date_route&quot;,</span>
<span class="line">    pattern: &quot;archive/{year:int:min(2000):max(2030)}/{month:int:min(1):max(12)}/{day:int:min(1):max(31)}/{controller=Archive}/{action=Index}&quot;);</span>
<span class="line"></span>
<span class="line">// 6. 分页路由</span>
<span class="line">app.MapControllerRoute(</span>
<span class="line">    name: &quot;paging&quot;,</span>
<span class="line">    pattern: &quot;{controller}/page/{page:int:min(1)}/{action=Index}&quot;);</span>
<span class="line"></span>
<span class="line">// 7. 默认路由（最后定义）</span>
<span class="line">app.MapControllerRoute(</span>
<span class="line">    name: &quot;default&quot;,</span>
<span class="line">    pattern: &quot;{controller=Home}/{action=Index}/{id?}&quot;);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="自定义路由约定" tabindex="-1"><a class="header-anchor" href="#自定义路由约定"><span>自定义路由约定</span></a></h4><ol><li>自定义约定类</li></ol><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// 1:API控制器约定</span>
<span class="line">public class ApiControllerConvention : IControllerModelConvention</span>
<span class="line">{</span>
<span class="line">    public void Apply(ControllerModel controller)</span>
<span class="line">    {</span>
<span class="line">        // 为所有以Api结尾的控制器添加api/前缀</span>
<span class="line">        if (controller.ControllerName.EndsWith(&quot;Api&quot;))</span>
<span class="line">        {</span>
<span class="line">            controller.Selectors.Add(new SelectorModel</span>
<span class="line">            {</span>
<span class="line">                AttributeRouteModel = new AttributeRouteModel</span>
<span class="line">                {</span>
<span class="line">                    Template = $&quot;api/{controller.ControllerName[..^3].ToLower()}&quot;</span>
<span class="line">                }</span>
<span class="line">            });</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 2:CRUD操作约定</span>
<span class="line">public class CrudActionConvention : IActionModelConvention</span>
<span class="line">{</span>
<span class="line">    public void Apply(ActionModel action)</span>
<span class="line">    {</span>
<span class="line">        var controllerName = action.Controller.ControllerName.ToLower();</span>
<span class="line">        var actionName = action.ActionName.ToLower();</span>
<span class="line"></span>
<span class="line">        // 为CRUD操作定义标准路由</span>
<span class="line">        switch (actionName)</span>
<span class="line">        {</span>
<span class="line">            case &quot;index&quot;:</span>
<span class="line">            case &quot;list&quot;:</span>
<span class="line">            case &quot;getall&quot;:</span>
<span class="line">                action.Selectors.Add(CreateSelector($&quot;{controllerName}&quot;, &quot;GET&quot;));</span>
<span class="line">                break;</span>
<span class="line">            case &quot;details&quot;:</span>
<span class="line">            case &quot;get&quot;:</span>
<span class="line">            case &quot;getbyid&quot;:</span>
<span class="line">                action.Selectors.Add(CreateSelector($&quot;{controllerName}/{{id}}&quot;, &quot;GET&quot;));</span>
<span class="line">                break;</span>
<span class="line">            case &quot;create&quot;:</span>
<span class="line">            case &quot;add&quot;:</span>
<span class="line">                action.Selectors.Add(CreateSelector($&quot;{controllerName}&quot;, &quot;POST&quot;));</span>
<span class="line">                break;</span>
<span class="line">            case &quot;update&quot;:</span>
<span class="line">            case &quot;edit&quot;:</span>
<span class="line">                action.Selectors.Add(CreateSelector($&quot;{controllerName}/{{id}}&quot;, &quot;PUT&quot;));</span>
<span class="line">                break;</span>
<span class="line">            case &quot;delete&quot;:</span>
<span class="line">            case &quot;remove&quot;:</span>
<span class="line">                action.Selectors.Add(CreateSelector($&quot;{controllerName}/{{id}}&quot;, &quot;DELETE&quot;));</span>
<span class="line">                break;</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    private SelectorModel CreateSelector(string template, string httpMethod)</span>
<span class="line">    {</span>
<span class="line">        return new SelectorModel</span>
<span class="line">        {</span>
<span class="line">            AttributeRouteModel = new AttributeRouteModel { Template = template },</span>
<span class="line">            ActionConstraints = { new HttpMethodActionConstraint(new[] { httpMethod }) }</span>
<span class="line">        };</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 3. 版本化控制器约定</span>
<span class="line">public class VersionedControllerConvention : IControllerModelConvention</span>
<span class="line">{</span>
<span class="line">    public void Apply(ControllerModel controller)</span>
<span class="line">    {</span>
<span class="line">        var controllerName = controller.ControllerName;</span>
<span class="line">        </span>
<span class="line">        // 检查控制器名称是否包含版本信息</span>
<span class="line">        var versionMatch = System.Text.RegularExpressions.Regex.Match(controllerName, @&quot;V(\\d+)$&quot;);</span>
<span class="line">        if (versionMatch.Success)</span>
<span class="line">        {</span>
<span class="line">            var version = versionMatch.Groups[1].Value;</span>
<span class="line">            var baseName = controllerName.Substring(0, controllerName.Length - versionMatch.Length);</span>
<span class="line">            </span>
<span class="line">            controller.Selectors.Add(new SelectorModel</span>
<span class="line">            {</span>
<span class="line">                AttributeRouteModel = new AttributeRouteModel</span>
<span class="line">                {</span>
<span class="line">                    Template = $&quot;api/v{version}/{baseName.ToLower()}&quot;</span>
<span class="line">                }</span>
<span class="line">            });</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>添加服务</li></ol><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs 添加服务</span>
<span class="line">builder.Services.AddControllers(options =&gt;</span>
<span class="line">{</span>
<span class="line">    // 自定义约定</span>
<span class="line">    options.Conventions.Add(new ApiControllerConvention());</span>
<span class="line">    options.Conventions.Add(new CrudActionConvention());</span>
<span class="line">    options.Conventions.Add(new VersionedControllerConvention());</span>
<span class="line">});</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="特性路由" tabindex="-1"><a class="header-anchor" href="#特性路由"><span>特性路由</span></a></h3><h4 id="类注解" tabindex="-1"><a class="header-anchor" href="#类注解"><span>类注解</span></a></h4><p>[Route]</p><p>可以用在方法上</p><ul><li><p>如果模板以 <code>/</code> 开头**：表示这是一个<strong>完整且独立的路径</strong>，会忽略控制器级别的 <code>[Route]</code>。</p></li><li><p>如果模板不以 <code>/</code> 开头：表示这是一个<strong>相对路径</strong>，会追加到控制器级别的 <code>[Route]</code> 之后。</p></li></ul><p>可以定义多个 <code>[Route]</code> 特性，使一个动作方法响应多个 URL。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">[Route(&quot;products&quot;)]</span>
<span class="line">[Route(&quot;items&quot;)]</span>
<span class="line">public IActionResult GetAllProducts() { /* ... */ } // 可响应 /products 或 /items</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="方法注解" tabindex="-1"><a class="header-anchor" href="#方法注解"><span>方法注解</span></a></h4><p><strong>[HttpGet]、[HttpPost]、[HttpPut]、[HttpDelete]</strong></p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">[HttpGet] // 继承控制器路由</span>
<span class="line">public IActionResult Get() { /* GET /api/products */ }</span>
<span class="line"></span>
<span class="line">[HttpGet(&quot;popular&quot;)] // 追加到控制器路由后</span>
<span class="line">public IActionResult GetPopular() { /* GET /api/products/popular */ }</span>
<span class="line"></span>
<span class="line">[HttpGet(&quot;/latest-products&quot;)] // 独立路由</span>
<span class="line">public IActionResult GetLatest() { /* GET /latest-products */ }</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p><strong>PUT VS PATCH</strong></p><table><thead><tr><th>特性</th><th><code>[HttpPut]</code></th><th><code>[HttpPatch]</code></th></tr></thead><tbody><tr><td>语义</td><td>替换整个资源（完整更新）</td><td>局部更新资源的一部分字段（部分更新）</td></tr><tr><td>使用场景</td><td>客户端发送整个对象进行覆盖</td><td>客户端只发送部分字段进行更新</td></tr><tr><td>请求方法</td><td><code>PUT</code></td><td><code>PATCH</code></td></tr><tr><td>请求体格式</td><td>通常为完整 JSON 对象</td><td>通常为 JSON Patch 格式或部分 JSON 对象</td></tr></tbody></table><hr><p><code>[AcceptVerbs(...)]</code>支持多种请求方式，如：<code>[AcceptVerbs(&quot;GET&quot;, &quot;Post&quot;)]</code></p><h4 id="方法参数注解" tabindex="-1"><a class="header-anchor" href="#方法参数注解"><span>方法参数注解</span></a></h4><p>[FromRoute] [FromQuery]</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">[HttpGet(&quot;{id}&quot;)]</span>
<span class="line">public IActionResult GetProduct([FromRoute] int id) { /* ... */ } // &#39;id&#39; 从路由模板中的 {id} 获取</span>
<span class="line">[HttpGet(&quot;search&quot;)]</span>
<span class="line">public IActionResult SearchProducts([FromQuery] string name, [FromQuery] int minPrice) { /* ... */ } // 匹配 /search?name=abc&amp;minPrice=100</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>[FromBody]</p><p>在一个动作方法中，<strong>只能有一个参数</strong>被标记为 <code>[FromBody]</code>。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">[HttpPost]</span>
<span class="line">public IActionResult CreateProduct([FromBody] Product product) { /* ... */ } // &#39;product&#39; 对象从请求体中反序列化</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>[FromForm]</p><p>指定参数值从 <strong>HTML 表单数据</strong>中获取（<code>application/x-www-form-urlencoded</code> 或 <code>multipart/form-data</code>）。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">[HttpPost(&quot;upload&quot;)]</span>
<span class="line">public IActionResult UploadFile([FromForm] IFormFile file, [FromForm] string description) { /* ... */ }</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>[FromHeader]</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">[HttpGet(&quot;status&quot;)]</span>
<span class="line">public IActionResult GetStatus([FromHeader(Name = &quot;X-My-Custom-Header&quot;)] string customHeader) { /* ... */ }</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>[FromServices]</p><p>即使在 <code>AddControllers</code> 时没有明确配置，这也是默认行为之一，但显式使用可以增加代码可读性。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">[HttpGet]</span>
<span class="line">public IActionResult Get([FromServices] ILogger&lt;MyController&gt; logger) { /* ... */ } // 从DI容器获取日志服务</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="路由模板" tabindex="-1"><a class="header-anchor" href="#路由模板"><span>路由模板</span></a></h3><p>一个路由模板由一个或多个段组成，这些段由 <code>/</code> 分隔。每个段可以是：</p><ol><li>字面量段</li></ol><p>字面量段是 URL 中必须<strong>精确匹配</strong>的固定字符串。</p><p><strong>示例</strong>：</p><ul><li>模板：<code>api/products</code></li><li>匹配的 URL：<code>/api/products</code></li><li>不匹配的 URL：<code>/api/items</code></li></ul><ol start="2"><li>参数段</li></ol><p>参数段用大括号 <code>{}</code> 包裹，表示 URL 中这部分是一个<strong>可变的值</strong>。路由系统会捕获这个值，并将其作为路由数据传递给你的终结点代码</p><p><strong>基本参数</strong>：</p><ul><li>模板：<code>products/{id}</code></li><li>匹配的 URL：<code>/products/123</code> (捕获 <code>id = &quot;123&quot;</code>)</li><li>匹配的 URL：<code>/products/abc</code> (捕获 <code>id = &quot;abc&quot;</code>)</li></ul><p><strong>可选参数</strong>：通过在参数名后添加问号 <code>?</code> 来表示。如果 URL 中没有提供这个参数，它将是 <code>null</code> 或其默认值。</p><ul><li>模板：<code>products/{id?}</code></li><li>匹配的 URL：<code>/products/123</code> (捕获 <code>id = &quot;123&quot;</code>)</li><li>匹配的 URL：<code>/products</code> (捕获 <code>id = null</code>)</li></ul><p><strong>带默认值的参数</strong>：通过在参数名后添加 <code>=</code> 来指定一个默认值。这也会使参数变为可选。</p><ul><li>模板：<code>{controller=Home}/{action=Index}/{id?}</code></li><li>匹配的 URL：<code>/</code> (匹配 <code>controller = &quot;Home&quot;</code>, <code>action = &quot;Index&quot;</code>, <code>id = null</code>)</li><li>匹配的 URL：<code>/Products</code> (匹配 <code>controller = &quot;Products&quot;</code>, <code>action = &quot;Index&quot;</code>, <code>id = null</code>)</li><li>匹配的 URL：<code>/Products/Detail</code> (匹配 <code>controller = &quot;Products&quot;</code>, <code>action = &quot;Detail&quot;</code>, <code>id = null</code>)</li></ul><h3 id="路由约束" tabindex="-1"><a class="header-anchor" href="#路由约束"><span>路由约束</span></a></h3><p><strong>常用的内置约束</strong>：</p><ul><li><strong><code>int</code></strong>：只匹配整数。 <ul><li>模板：<code>products/{id:int}</code></li><li>匹配：<code>/products/123</code></li><li>不匹配：<code>/products/abc</code></li></ul></li><li><code>double</code>: 匹配浮点数</li><li><strong><code>guid</code></strong>：只匹配 GUID 格式的字符串。 <ul><li>模板：<code>items/{itemId:guid}</code></li><li>匹配：<code>/items/a1b2c3d4-e5f6-7890-1234-567890abcdef</code></li></ul></li><li><strong><code>bool</code></strong>：只匹配布尔值 (<code>true</code>, <code>false</code>)。</li><li><strong><code>datetime</code></strong>：只匹配日期时间格式的字符串。</li><li><strong><code>alpha</code></strong>：只匹配字母字符。 <ul><li>模板：<code>users/{username:alpha}</code></li><li>匹配：<code>/users/john</code></li><li>不匹配：<code>/users/john123</code></li></ul></li><li><strong><code>minlength(length)</code> / <code>maxlength(length)</code> / <code>length(min, max)</code></strong>：限制字符串长度。 <ul><li>模板：<code>codes/{code:length(5)}</code> (精确长度为5)</li></ul></li><li><strong><code>min(value)</code> / <code>max(value)</code> / <code>range(min, max)</code></strong>：限制数字范围。</li><li><strong><code>regex(pattern)</code></strong>：使用正则表达式进行匹配。 <ul><li>模板：<code>articles/{year:regex(^\\\\d{{4}}$)}</code> (匹配4位数字的年份)</li><li><strong>注意</strong>：在 C# 字符串中，正则表达式中的 <code>\\</code> 和 <code>{}</code> 需要转义。</li></ul></li></ul><p><strong>组合约束</strong>：你可以为同一个参数应用多个约束，用 <code>:</code> 分隔。</p><ul><li>模板：<code>posts/{year:int:min(2000)}/{month:int:range(1,12)}</code></li></ul><h3 id="特殊路由段" tabindex="-1"><a class="header-anchor" href="#特殊路由段"><span>特殊路由段</span></a></h3><p><strong>控制器类</strong></p><p><strong><code>[controller]</code></strong>：在特性路由中，它是一个占位符，在运行时会被替换为控制器类名（不带 &quot;Controller&quot; 后缀）。</p><p>如果 <code>ProductsController</code> 定义了 <code>[Route(&quot;api/[controller]&quot;)]</code>，则其基路由是 <code>/api/products</code>。</p><p><strong><code>[action]</code></strong>：在特性路由中，它是一个占位符，在运行时会被替换为动作方法的名称。</p><p>如果 <code>ProductsController</code> 中的 <code>GetById()</code> 方法定义了 <code>[HttpGet(&quot;[action]/{id}&quot;)]</code>，则其路由可能是 <code>/api/products/GetById/{id}</code>。</p><hr><p><strong>通配符</strong></p><p>作用：用于匹配 URL 路径的剩余部分。</p><p><strong><code>{*param}</code></strong>：捕获所有剩余的路径段，但不包括路径分隔符 <code>/</code>。</p><ul><li>模板：<code>files/{*path}</code></li><li>匹配：<code>/files/documents/report.pdf</code> (捕获 <code>path = &quot;documents/report.pdf&quot;</code>)</li><li>如果 URL 是 <code>/files/documents/sub/report.pdf</code>，<code>path</code> 仍为 <code>&quot;documents/sub/report.pdf&quot;</code>。</li></ul><p><strong><code>{**param}</code></strong>：捕获所有剩余的路径段，<strong>包括路径分隔符 <code>/</code></strong>。这在代理或处理文件路径时非常有用。</p><ul><li>模板：<code>catchall/{**filepath}</code></li><li>匹配：<code>/catchall/folder/subfolder/file.txt</code> (捕获 <code>filepath = &quot;folder/subfolder/file.txt&quot;</code>)</li></ul><hr><h3 id="url生成" tabindex="-1"><a class="header-anchor" href="#url生成"><span>URL生成</span></a></h3><p>URL 生成允许你在代码（控制器、视图、Razor Pages）中动态地构建指向应用程序内部资源的 URL。这与路由匹配（将传入 URL 映射到代码）是相反的过程。 URL 生成主要通过 <code>Microsoft.AspNetCore.Mvc.IUrlHelper</code> 接口及其实现类来完成。在控制器、视图和 Razor Pages 中，你可以通过不同的方式访问到这个功能。</p><h4 id="controller中使用" tabindex="-1"><a class="header-anchor" href="#controller中使用"><span>Controller中使用</span></a></h4><p>在继承 <code>Controller</code> 或 <code>ControllerBase</code> 的控制器中，你可以直接通过 <code>Url</code> 属性访问 <code>IUrlHelper</code> 接口的方法。</p><p><code>Url.Action()</code></p><ul><li><p><strong>用途</strong>：生成指向另一个<strong>控制器动作方法</strong>的 URL。</p></li><li><p><strong>参数</strong>：</p><ul><li><code>actionName</code> (string)：目标动作方法的名称。</li><li><code>controllerName</code> (string, optional)：目标控制器的名称。如果省略，默认为当前控制器。</li><li><code>routeValues</code> (object, optional)：一个匿名对象，包含作为路由参数或查询字符串的附加数据。</li><li><code>protocol</code> (string, optional)：例如 &quot;http&quot; 或 &quot;https&quot;。</li><li><code>host</code> (string, optional)：主机名。</li><li><code>fragment</code> (string, optional)：URL 片段（<code>#</code> 后面的部分）。</li></ul></li><li><p>示例：</p></li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public class ProductsController : Controller</span>
<span class="line">{</span>
<span class="line">    public IActionResult GetProduct(int id)</span>
<span class="line">    {</span>
<span class="line">        // 生成指向 ProductController 的 Details 动作的 URL</span>
<span class="line">        // 假设 Details 动作路由是 /Products/Details/{id}</span>
<span class="line">        string productDetailsUrl = Url.Action(&quot;Details&quot;, &quot;Products&quot;, new { id = 123 });</span>
<span class="line">        // 结果可能为: /Products/Details/123</span>
<span class="line"></span>
<span class="line">        // 生成指向当前控制器的另一个动作（例如 Index）的 URL</span>
<span class="line">        string indexUrl = Url.Action(&quot;Index&quot;);</span>
<span class="line">        // 结果可能为: /Products/Index</span>
<span class="line"></span>
<span class="line">        // 生成带有协议和主机的完整 URL</span>
<span class="line">        string absoluteUrl = Url.Action(&quot;Details&quot;, &quot;Products&quot;, new { id = 456 }, protocol: Request.Scheme, host: Request.Host.Host);</span>
<span class="line">        // 结果可能为: https://localhost:5001/Products/Details/456</span>
<span class="line"></span>
<span class="line">        return View();</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public IActionResult Details(int id) { return View(); }</span>
<span class="line">    public IActionResult Index() { return View(); }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p><code>Url.RouteUrl()</code></p><p><strong>用途</strong>：生成指向一个<strong>命名路由 (Named Route)</strong> 的 URL。命名路由是在 <code>Program.cs</code> 的 <code>MapControllerRoute</code> 或 <code>MapRazorPages</code> 中通过 <code>name</code> 参数定义的路由。</p><p><strong>参数</strong>：与 <code>Url.Action()</code> 类似，但第一个参数是路由名称。</p><p>示例：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs中定义了一个路由</span>
<span class="line">endpoints.MapControllerRoute(</span>
<span class="line">    name: &quot;productDetailsRoute&quot;,</span>
<span class="line">    pattern: &quot;products-info/{id}&quot;,</span>
<span class="line">    defaults: new { controller = &quot;Products&quot;, action = &quot;Details&quot; });</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// 在控制器中生成 URL：</span>
<span class="line">public class ProductsController : Controller</span>
<span class="line">{</span>
<span class="line">    public IActionResult SomeAction()</span>
<span class="line">    {</span>
<span class="line">        string namedRouteUrl = Url.RouteUrl(&quot;productDetailsRoute&quot;, new { id = 789 });</span>
<span class="line">        // 结果可能为: /products-info/789</span>
<span class="line">        return View();</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p><code>Url.Page()</code></p><p><strong>用途</strong>：生成指向 <strong>Razor Pages</strong> 的 URL。</p><p><strong>参数</strong>：</p><ul><li><code>pageName</code> (string)：Razor Page 的路径（不带 <code>.cshtml</code> 扩展名），例如 <code>/Products/Details</code>。如果页面在区域中，需要加上 <code>/AreaName/PageName</code>。</li><li><code>routeValues</code> (object, optional)：路由值。</li><li><code>protocol</code>, <code>host</code>, <code>fragment</code>：同 <code>Url.Action()</code>。</li><li><code>handler</code> (string, optional)：指定 Razor Page 中的处理程序方法（例如 <code>OnGet</code>、<code>OnPost</code> 对应的命名处理程序）。</li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public class MyController : Controller</span>
<span class="line">{</span>
<span class="line">    public IActionResult SomePageAction()</span>
<span class="line">    {</span>
<span class="line">        // 生成指向 Pages/About.cshtml 的 URL</span>
<span class="line">        string aboutPageUrl = Url.Page(&quot;/About&quot;);</span>
<span class="line">        // 结果可能为: /About</span>
<span class="line"></span>
<span class="line">        // 生成指向 Pages/Products/Details.cshtml 并带参数的 URL</span>
<span class="line">        string productPageUrl = Url.Page(&quot;/Products/Details&quot;, new { id = 10 });</span>
<span class="line">        // 结果可能为: /Products/Details/10</span>
<span class="line"></span>
<span class="line">        // 生成指向 Admin 区域的 Pages/Dashboard.cshtml 的 URL</span>
<span class="line">        string adminDashboardUrl = Url.Page(&quot;/Dashboard&quot;, new { area = &quot;Admin&quot; });</span>
<span class="line">        // 结果可能为: /Admin/Dashboard</span>
<span class="line"></span>
<span class="line">        return View();</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="razor-pages中使用" tabindex="-1"><a class="header-anchor" href="#razor-pages中使用"><span>Razor Pages中使用</span></a></h4><p><code>Url</code> Helper 属性</p><p>与控制器中类似，视图中也直接暴露了 <code>Url</code> 属性，你可以使用 <code>Url.Action()</code>, <code>Url.RouteUrl()</code>, <code>Url.Page()</code> 等方法。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">&lt;a href=&quot;@Url.Action(&quot;Details&quot;, &quot;Products&quot;, new { id = 1 })&quot;&gt;View Product 1&lt;/a&gt;</span>
<span class="line">&lt;a href=&quot;@Url.Page(&quot;/Contact&quot;)&quot;&gt;Contact Us&lt;/a&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Tag Helpers</strong></p><p>Tag Helpers 是一种更推荐、更 HTML 友好的方式来生成 URL。它们将服务器端代码注入到 HTML 标签中，使 HTML 保持整洁。</p><ul><li><p><strong><code>asp-action</code>, <code>asp-controller</code>, <code>asp-route-\\*</code></strong>：用于生成指向控制器动作的 URL。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">&lt;a asp-action=&quot;Details&quot; asp-controller=&quot;Products&quot; asp-route-id=&quot;123&quot;&gt;View Product&lt;/a&gt;</span>
<span class="line">&lt;a asp-action=&quot;Index&quot; asp-route-page=&quot;2&quot;&gt;Go to Page 2&lt;/a&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong><code>asp-page</code>, <code>asp-page-handler</code>, <code>asp-route-\\*</code></strong>：用于生成指向 Razor Pages 的 URL。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">&lt;a asp-page=&quot;/About&quot;&gt;About Us&lt;/a&gt;</span>
<span class="line">&lt;a asp-page=&quot;/Products/Details&quot; asp-route-id=&quot;456&quot;&gt;Product Page&lt;/a&gt;</span>
<span class="line">&lt;a asp-area=&quot;Admin&quot; asp-page=&quot;/Dashboard&quot;&gt;Admin Dashboard&lt;/a&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong><code>asp-route</code></strong>：用于生成指向命名路由的 URL。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">&lt;a asp-route=&quot;productDetailsRoute&quot; asp-route-id=&quot;789&quot;&gt;Product Info (Named Route)&lt;/a&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li></ul><h4 id="url-生成时的路由值优先级" tabindex="-1"><a class="header-anchor" href="#url-生成时的路由值优先级"><span>URL 生成时的路由值优先级</span></a></h4><ol><li><strong>匹配路由模板的参数</strong>：如果提供的路由值名称与当前匹配的路由模板中的参数名一致（例如 <code>{id}</code>），那么它会被作为路由参数包含在 URL 路径中。</li><li><strong>剩余作为查询字符串</strong>：如果提供的路由值名称<strong>不</strong>匹配路由模板中的任何参数名，那么它将作为<strong>查询字符串参数</strong>添加到 URL 的末尾。</li><li><strong>默认值</strong>：如果路由模板中的某个参数有默认值，并且你没有在 <code>routeValues</code> 中为它提供值，那么它将使用默认值。</li></ol><p>示例：假设路由模板是 <code>products/{id}</code></p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Url.Action(&quot;Details&quot;, &quot;Products&quot;, new { id = 10, category = &quot;Electronics&quot; });</span>
<span class="line">// 结果: /products/10?category=Electronics</span>
<span class="line">// &#39;id&#39; 匹配路由参数，&#39;category&#39; 不匹配，成为查询字符串。</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="注意事项-1" tabindex="-1"><a class="header-anchor" href="#注意事项-1"><span>注意事项</span></a></h4><ul><li><strong>区域 (Areas)</strong>：如果你在区域内部工作或需要生成指向区域内资源的 URL，记住要显式地在 <code>routeValues</code> 中包含 <code>area</code> 参数，例如 <code>new { area = &quot;Admin&quot; }</code>。</li><li><strong>当前路由值</strong>：默认情况下，URL 生成方法会继承当前请求的路由值。例如，如果你在 <code>/Products/Details/123</code> 页面中调用 <code>Url.Action(&quot;Edit&quot;)</code>，它可能会尝试生成 <code>/Products/Edit/123</code>。如果你不希望继承某些路由值，可以明确地将其设置为 <code>null</code> 或一个空字符串。</li><li><strong>协议和主机</strong>：默认生成的 URL 是相对路径。如果需要生成绝对 URL（包含 <code>http://</code> 或 <code>https://</code> 和域名），你需要提供 <code>protocol</code> 和 <code>host</code> 参数。通常从 <code>Request.Scheme</code> 和 <code>Request.Host.Value</code> 获取。</li><li><strong>HTTPS 重定向</strong>：在生产环境中，通常会强制使用 HTTPS。生成的 URL 也应该反映这一点。</li><li><strong>最小 API 的 URL 生成</strong>：对于最小 API，通常会给终结点命名，然后通过 <code>LinkGenerator</code> 服务来生成 URL。</li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">app.MapGet(&quot;/users/{id}&quot;, (int id) =&gt; Results.Ok($&quot;User {id}&quot;))</span>
<span class="line">   .WithName(&quot;GetUserById&quot;); // 给终结点命名</span>
<span class="line"></span>
<span class="line">// 在其他地方注入 LinkGenerator</span>
<span class="line">app.MapGet(&quot;/generate-link&quot;, (LinkGenerator linker) =&gt;</span>
<span class="line">{</span>
<span class="line">    var url = linker.GetPathByName(&quot;GetUserById&quot;, new { id = 5 });</span>
<span class="line">    return Results.Ok($&quot;Link to user 5: {url}&quot;); // 结果可能为 /users/5</span>
<span class="line">});</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="参数转换器" tabindex="-1"><a class="header-anchor" href="#参数转换器"><span>参数转换器</span></a></h3><p>允许你在路由匹配发生时，<strong>动态地修改路由参数的值</strong>。这通常用于将路由中的特定命名约定（如 Kebab-case）转换为 C# 中常用的命名约定（如 PascalCase 或 CamelCase），或者执行其他简单的字符串转换。</p><h4 id="自定义参数转换器" tabindex="-1"><a class="header-anchor" href="#自定义参数转换器"><span>自定义参数转换器</span></a></h4><h4 id="模型绑定器" tabindex="-1"><a class="header-anchor" href="#模型绑定器"><span>模型绑定器</span></a></h4><h3 id="区域路由" tabindex="-1"><a class="header-anchor" href="#区域路由"><span>区域路由</span></a></h3><p>用于MVC</p><hr><h3 id="路由组" tabindex="-1"><a class="header-anchor" href="#路由组"><span>路由组</span></a></h3><blockquote><p>.NET 7.0及以上版本开始生效</p></blockquote><h4 id="问题引入-1" tabindex="-1"><a class="header-anchor" href="#问题引入-1"><span>问题引入</span></a></h4><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// 没有路由组之前的重复配置</span>
<span class="line">app.MapGet(&quot;/users&quot;, () =&gt; &quot;List all users&quot;)</span>
<span class="line">   .RequireAuthorization(&quot;AdminPolicy&quot;)</span>
<span class="line">   .WithOpenApi();</span>
<span class="line"></span>
<span class="line">app.MapGet(&quot;/users/{id}&quot;, (int id) =&gt; $&quot;Get user {id}&quot;)</span>
<span class="line">   .RequireAuthorization(&quot;AdminPolicy&quot;)</span>
<span class="line">   .WithOpenApi();</span>
<span class="line"></span>
<span class="line">app.MapPost(&quot;/users&quot;, () =&gt; &quot;Create a new user&quot;)</span>
<span class="line">   .RequireAuthorization(&quot;AdminPolicy&quot;)</span>
<span class="line">   .WithOpenApi();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>RequireAuthorization(&quot;AdminPolicy&quot;)</code> 和 <code>WithOpenApi()</code> 被重复应用了三次。如果配置项更多，这种重复会非常严重。</p><p>路由组提供了一种<strong>链式调用 (Fluent API)</strong> 的方式，将这些共同的配置应用到整个组。</p><p>主要用于<strong>最小 API (Minimal APIs)</strong>。它允许你将一组相关的终结点（Endpoint）组织在一起，并对它们统一应用配置，例如：</p><ul><li><strong>共同的前缀 (Prefix)</strong></li><li><strong>共同的中间件 (Middleware)</strong></li><li><strong>共同的元数据 (Metadata)</strong>（如 <code>[Authorize]</code>, <code>[Produces]</code> 等）</li><li><strong>共同的命名约定 (Name Convention)</strong></li><li><strong>共同的 OpenAPI/Swagger 文档标签 (Tags)</strong></li></ul><h4 id="使用方法-9" tabindex="-1"><a class="header-anchor" href="#使用方法-9"><span>使用方法</span></a></h4><p>路由组的核心是 <code>app.MapGroup()</code> 方法。</p><p>示例1：基本使用</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">var app = WebApplication.CreateBuilder(args).Build();</span>
<span class="line"></span>
<span class="line">// 创建一个路由组，并指定一个共同的前缀</span>
<span class="line">var usersApi = app.MapGroup(&quot;/users&quot;); // &quot;/users&quot; 是这个组所有终结点的共同前缀</span>
<span class="line"></span>
<span class="line">// 在组内定义终结点，它们的路由会自动加上 &quot;/users&quot; 前缀</span>
<span class="line">usersApi.MapGet(&quot;/&quot;, () =&gt; &quot;List all users&quot;); // 路由: GET /users</span>
<span class="line">usersApi.MapGet(&quot;/{id}&quot;, (int id) =&gt; $&quot;Get user {id}&quot;); // 路由: GET /users/{id}</span>
<span class="line">usersApi.MapPost(&quot;/&quot;, () =&gt; &quot;Create a new user&quot;); // 路由: POST /users</span>
<span class="line"></span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在本例中：<code>usersApi</code> 组下的所有 <code>MapGet</code> 和 <code>MapPost</code> 终结点都会自动以 <code>/users</code> 为前缀。</p><hr><p>示例2：将常用的 <code>RequireAuthorization()</code>, <code>WithTags()</code>, <code>WithOpenApi()</code> 等方法应用到整个路由组</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">var app = WebApplication.CreateBuilder(args).Build();</span>
<span class="line"></span>
<span class="line">// 启用授权</span>
<span class="line">app.UseAuthorization();</span>
<span class="line">app.UseAuthentication(); // 认证也通常是必需的</span>
<span class="line"></span>
<span class="line">// 为组添加认证和授权策略</span>
<span class="line">app.MapGroup(&quot;/users&quot;)</span>
<span class="line">   .RequireAuthorization(&quot;AdminPolicy&quot;) // 要求所有 /users 相关的 API 都需要 AdminPolicy 授权</span>
<span class="line">   .WithTags(&quot;Users API&quot;)             // 将所有 /users 相关的 API 在 Swagger 中归类到 &quot;Users API&quot; 标签下</span>
<span class="line">   .WithOpenApi()                     // 为组内所有 API 生成 OpenAPI 规范</span>
<span class="line">   .MapGet(&quot;/&quot;, () =&gt; &quot;List all users&quot;)</span>
<span class="line">   .MapGet(&quot;/{id}&quot;, (int id) =&gt; $&quot;Get user {id}&quot;)</span>
<span class="line">   .MapPost(&quot;/&quot;, () =&gt; &quot;Create a new user&quot;);</span>
<span class="line"></span>
<span class="line">// 示例：另一个不需要授权的公共 API</span>
<span class="line">app.MapGet(&quot;/products&quot;, () =&gt; &quot;List all products&quot;);</span>
<span class="line"></span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在，<code>&quot;/users&quot;</code> 组内的所有终结点都继承了 <code>RequireAuthorization(&quot;AdminPolicy&quot;)</code> 和 <code>WithTags(&quot;Users API&quot;)</code> 等配置，大大减少了重复代码。</p><hr><p>示例3：路由组可以嵌套，这使得组织更复杂的 API 结构成为可能</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">var adminApi = app.MapGroup(&quot;/admin&quot;)</span>
<span class="line">                   .RequireAuthorization(&quot;AdminRole&quot;); // 管理员通用授权</span>
<span class="line"></span>
<span class="line">var userManagement = adminApi.MapGroup(&quot;/users&quot;)</span>
<span class="line">                             .WithTags(&quot;Admin Users&quot;); // 管理员用户接口</span>
<span class="line"></span>
<span class="line">userManagement.MapGet(&quot;/&quot;, () =&gt; &quot;Admin: Get all users&quot;);</span>
<span class="line">userManagement.MapDelete(&quot;/{id}&quot;, (int id) =&gt; $&quot;Admin: Delete user {id}&quot;);</span>
<span class="line"></span>
<span class="line">var productManagement = adminApi.MapGroup(&quot;/products&quot;)</span>
<span class="line">                               .WithTags(&quot;Admin Products&quot;); // 管理员产品接口</span>
<span class="line"></span>
<span class="line">productManagement.MapPost(&quot;/&quot;, () =&gt; &quot;Admin: Create product&quot;);</span>
<span class="line">productManagement.MapPut(&quot;/{id}&quot;, (int id) =&gt; $&quot;Admin: Update product {id}&quot;);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><code>GET /admin/users</code> 将需要 <code>AdminRole</code> 授权，并带有 &quot;Admin Users&quot; 标签。</li><li><code>POST /admin/products</code> 将需要 <code>AdminRole</code> 授权，并带有 &quot;Admin Products&quot; 标签。</li></ul><hr><p>示例4：将控制器添加到路由组</p><p>虽然路由组主要用于最小 API，但你也可以将控制器映射到路由组中，并利用路由组的共同配置。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">var app = WebApplication.CreateBuilder(args).Build();</span>
<span class="line">builder.Services.AddControllers(); // 添加控制器支持</span>
<span class="line"></span>
<span class="line">var apiGroup = app.MapGroup(&quot;/api&quot;)</span>
<span class="line">                  .WithTags(&quot;API Endpoints&quot;)</span>
<span class="line">                  .RequireAuthorization(); // 所有 /api 下的控制器都需要授权</span>
<span class="line"></span>
<span class="line">// 映射控制器到路由组</span>
<span class="line">apiGroup.MapControllers(); // 这会将所有控制器映射到 /api/ 前缀下，并继承组的配置</span>
<span class="line"></span>
<span class="line">app.Run();</span>
<span class="line"></span>
<span class="line">// Controllers/MyController.cs</span>
<span class="line">[ApiController]</span>
<span class="line">[Route(&quot;[controller]&quot;)] // 注意这里是相对路由，会继承组的 /api 前缀</span>
<span class="line">public class MyController : ControllerBase</span>
<span class="line">{</span>
<span class="line">    // GET /api/my</span>
<span class="line">    [HttpGet]</span>
<span class="line">    public string Get() =&gt; &quot;Hello from MyController!&quot;;</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过 <code>apiGroup.MapControllers()</code>，<code>MyController</code> 的路由 <code>[controller]</code>（即 <code>my</code>）会组合到 <code>api</code> 组的前缀下，形成 <code>/api/my</code>。同时，<code>MyController</code> 下的所有动作方法也会继承 <code>apiGroup</code> 上配置的 <code>WithTags(&quot;API Endpoints&quot;)</code> 和 <code>RequireAuthorization()</code>。</p><hr><p><strong>中间件顺序</strong>：在路由组上添加的中间件（例如 <code>RequireAuthorization()</code>）只对组内的终结点生效，并且在这些终结点被匹配之后执行。它们是在 <strong>终结点管道 (Endpoint Pipeline)</strong> 中执行的，而不是全局请求管道（<code>app.Use...</code>）的一部分。</p><h2 id="异常处理" tabindex="-1"><a class="header-anchor" href="#异常处理"><span>异常处理</span></a></h2><table><thead><tr><th>方式</th><th>场景</th><th>特点</th></tr></thead><tbody><tr><td><code>UseExceptionHandler</code> 中间件</td><td><strong>全局统一处理异常</strong></td><td>✅ 推荐方式，返回标准 JSON（ProblemDetails）</td></tr><tr><td><code>UseDeveloperExceptionPage</code></td><td><strong>开发调试使用</strong></td><td>展示详细错误堆栈，仅限开发环境</td></tr><tr><td>控制器中 <code>try-catch</code></td><td>局部业务逻辑处理</td><td>对于可预见异常可局部处理</td></tr><tr><td>实现 <code>IExceptionFilter</code></td><td>控制器层的统一异常过滤</td><td>可返回自定义格式 JSON</td></tr><tr><td>自定义中间件处理异常</td><td>深度定制</td><td>高自由度，需自行编写逻辑</td></tr></tbody></table><h3 id="useexceptionhandler中间件" tabindex="-1"><a class="header-anchor" href="#useexceptionhandler中间件"><span><code>UseExceptionHandler</code>中间件</span></a></h3><ol><li><p><code>Program.cs</code>注册</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">if (!app.Environment.IsDevelopment())</span>
<span class="line">{</span>
<span class="line">    app.UseExceptionHandler(&quot;/error&quot;);</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>创建统一错误控制器</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">[ApiController]</span>
<span class="line">public class ErrorController : ControllerBase</span>
<span class="line">{</span>
<span class="line">    [Route(&quot;/error&quot;)]</span>
<span class="line">    public IActionResult Error()</span>
<span class="line">    {</span>
<span class="line">        var feature = HttpContext.Features.Get&lt;IExceptionHandlerFeature&gt;();</span>
<span class="line">        var exception = feature?.Error;</span>
<span class="line"></span>
<span class="line">        // 可记录日志</span>
<span class="line">        // _logger.LogError(exception, &quot;未处理异常&quot;);</span>
<span class="line"></span>
<span class="line">        return Problem(</span>
<span class="line">            detail: exception?.Message,</span>
<span class="line">            statusCode: 500,</span>
<span class="line">            title: &quot;服务器内部错误&quot;</span>
<span class="line">        );</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>响应数据格式参考</p><div class="language-JSON line-numbers-mode" data-highlighter="prismjs" data-ext="JSON"><pre><code class="language-JSON"><span class="line">{</span>
<span class="line">  &quot;type&quot;: &quot;about:blank&quot;,</span>
<span class="line">  &quot;title&quot;: &quot;服务器内部错误&quot;,</span>
<span class="line">  &quot;status&quot;: 500,</span>
<span class="line">  &quot;detail&quot;: &quot;对象引用未设置到对象的实例。&quot;,</span>
<span class="line">  &quot;instance&quot;: &quot;/api/product/5&quot;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">{</span>
<span class="line">  &quot;status&quot;: 500,</span>
<span class="line">  &quot;error&quot;: &quot;服务器错误&quot;,</span>
<span class="line">  &quot;detail&quot;: &quot;数据库连接失败&quot;,</span>
<span class="line">  &quot;path&quot;: &quot;/api/user/1&quot;</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h3 id="usedeveloperexceptionpage" tabindex="-1"><a class="header-anchor" href="#usedeveloperexceptionpage"><span><code>UseDeveloperExceptionPage</code></span></a></h3><p>仅开发时使用</p><p>会输出完整堆栈、异常类型、请求详情</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">if (app.Environment.IsDevelopment())</span>
<span class="line">{</span>
<span class="line">    app.UseDeveloperExceptionPage(); // 仅在开发环境使用</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="局部try-catch" tabindex="-1"><a class="header-anchor" href="#局部try-catch"><span>局部<code>try-catch</code></span></a></h3><h3 id="自定义异常过滤器" tabindex="-1"><a class="header-anchor" href="#自定义异常过滤器"><span>自定义异常过滤器</span></a></h3><ol><li>自定义异常过滤器</li></ol><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public class ArgumentExceptionFilter : IExceptionFilter</span>
<span class="line">{</span>
<span class="line">    public void OnException(ExceptionContext context)</span>
<span class="line">    {</span>
<span class="line">        if (context.Exception is ArgumentException argumentException)</span>
<span class="line">        {</span>
<span class="line">            context.Result = new BadRequestObjectResult(new</span>
<span class="line">            {</span>
<span class="line">                Title = &quot;参数异常——来自ArgumentExceptionFilter&quot;,</span>
<span class="line">                Detail = argumentException.Message,</span>
<span class="line">                StatusCode = 400</span>
<span class="line">            });</span>
<span class="line"></span>
<span class="line">            context.ExceptionHandled = true;</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>注册服务</li></ol><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">builder.Services.AddControllers(options =&gt;</span>
<span class="line">{</span>
<span class="line">    options.Filters.Add(new ArgumentExceptionFilter());</span>
<span class="line">});</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="自定义异常处理中间件" tabindex="-1"><a class="header-anchor" href="#自定义异常处理中间件"><span>自定义异常处理中间件</span></a></h3><h2 id="发出http请求" tabindex="-1"><a class="header-anchor" href="#发出http请求"><span>发出HTTP请求</span></a></h2><h3 id="httpclient" tabindex="-1"><a class="header-anchor" href="#httpclient"><span><code>HttpClient</code></span></a></h3><h3 id="ihttpclientfactory" tabindex="-1"><a class="header-anchor" href="#ihttpclientfactory"><span><code>IHttpClientFactory</code></span></a></h3><h2 id="静态文件" tabindex="-1"><a class="header-anchor" href="#静态文件"><span>静态文件</span></a></h2><h3 id="默认配置" tabindex="-1"><a class="header-anchor" href="#默认配置"><span>默认配置</span></a></h3><p><code>wwwroot</code>是默认的静态文件根目录,结构如下：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">MyProject/</span>
<span class="line">├── wwwroot/</span>
<span class="line">│   ├── index.html</span>
<span class="line">│   ├── css/</span>
<span class="line">│   │   └── style.css</span>
<span class="line">│   └── js/</span>
<span class="line">│       └── app.js</span>
<span class="line">├── Program.cs</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在<code>Program.cs</code>中启用中间件</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">var app = builder.Build();</span>
<span class="line"></span>
<span class="line">app.UseStaticFiles(); // 启用静态文件功能</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>请求示例：</p><table><thead><tr><th>请求路径</th><th>实际访问文件路径</th></tr></thead><tbody><tr><td><code>/index.html</code></td><td><code>wwwroot/index.html</code></td></tr><tr><td><code>/css/style.css</code></td><td><code>wwwroot/css/style.css</code></td></tr><tr><td><code>/js/app.js</code></td><td><code>wwwroot/js/app.js</code></td></tr></tbody></table><h3 id="自定义静态文件目录" tabindex="-1"><a class="header-anchor" href="#自定义静态文件目录"><span>自定义静态文件目录</span></a></h3><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">app.UseStaticFiles(new StaticFileOptions</span>
<span class="line">{</span>
<span class="line">    FileProvider = new PhysicalFileProvider(</span>
<span class="line">        Path.Combine(builder.Environment.ContentRootPath, &quot;MyStaticFiles&quot;)),</span>
<span class="line">    RequestPath = &quot;/files&quot;</span>
<span class="line">});</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>假设存在目录：<code>MyStaticFiles/image.png</code></p><p>请求路径为：<code>/files/image.png</code></p><h3 id="配置默认首页" tabindex="-1"><a class="header-anchor" href="#配置默认首页"><span>配置默认首页</span></a></h3><p>默认情况下，访问 <code>/</code> 并不会自动返回 <code>index.html</code>，需要启用默认文件中间件：</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">app.UseDefaultFiles();  // 匹配 index.html、default.html 等</span>
<span class="line">app.UseStaticFiles();   // 提供静态文件服务</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p><code>/</code> → 自动返回 <code>/index.html</code>（如果存在）</p></li><li><blockquote><p>[!important]</p><p>必须先 UseDefaultFiles 再 UseStaticFiles。</p></blockquote></li></ul><h3 id="配置目录浏览" tabindex="-1"><a class="header-anchor" href="#配置目录浏览"><span>配置目录浏览</span></a></h3><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">app.UseDirectoryBrowser(new DirectoryBrowserOptions</span>
<span class="line">{</span>
<span class="line">    FileProvider = new PhysicalFileProvider(</span>
<span class="line">        Path.Combine(builder.Environment.ContentRootPath, &quot;MyStaticFiles&quot;)),</span>
<span class="line">    RequestPath = &quot;/browse&quot;</span>
<span class="line">});</span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>访问 /browse/ 会展示该目录下的所有文件链接。</p><blockquote><p>[!WARNING]</p><p>不要用于生产环境</p></blockquote><h3 id="客户端缓存优化" tabindex="-1"><a class="header-anchor" href="#客户端缓存优化"><span>客户端缓存优化</span></a></h3><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">app.UseStaticFiles(new StaticFileOptions</span>
<span class="line">{</span>
<span class="line">    OnPrepareResponse = ctx =&gt;</span>
<span class="line">    {</span>
<span class="line">    	// max-age=604800 表示缓存 7 天（单位：秒）</span>
<span class="line">        ctx.Context.Response.Headers.Append(&quot;Cache-Control&quot;, &quot;public,max-age=604800&quot;);</span>
<span class="line">    }</span>
<span class="line">});</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="限制访问文件类型" tabindex="-1"><a class="header-anchor" href="#限制访问文件类型"><span>限制访问文件类型</span></a></h3><p>配置 StaticFileOptions 中间件来自定义访问控制，例如限制 <code>.config</code>、<code>.cs</code> 文件：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">app.UseStaticFiles(new StaticFileOptions</span>
<span class="line">{</span>
<span class="line">    OnPrepareResponse = ctx =&gt;</span>
<span class="line">    {</span>
<span class="line">        var path = ctx.File.Name;</span>
<span class="line">        if (path.EndsWith(&quot;.cs&quot;) || path.EndsWith(&quot;.json&quot;))</span>
<span class="line">        {</span>
<span class="line">            ctx.Context.Response.StatusCode = StatusCodes.Status403Forbidden;</span>
<span class="line">            ctx.Context.Response.ContentLength = 0;</span>
<span class="line">            ctx.Context.Response.Body = Stream.Null;</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line">});</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="非标准文件类型的处理" tabindex="-1"><a class="header-anchor" href="#非标准文件类型的处理"><span>非标准文件类型的处理</span></a></h3><p>通过配置 <code>StaticFileOptions</code> 的 <code>ContentTypeProvider</code> 属性来 添加或覆盖 MIME 类型映射:</p><p>需要创建一个 <code>FileExtensionContentTypeProvider</code> 实例，并向其 <code>Mappings</code> 字典添加自定义的扩展名到 MIME 类型的映射。</p><p>案例：假设有以下非标准文件类型</p><ul><li><code>wwwroot/data/mydata.custom</code>，你希望它以 <code>text/plain</code> 格式提供。</li><li><code>wwwroot/assets/model.gltf</code>，你希望它以 <code>model/gltf+json</code> 格式提供。</li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// Program.cs</span>
<span class="line">using Microsoft.AspNetCore.StaticFiles; // 确保引用此命名空间</span>
<span class="line"></span>
<span class="line">var builder = WebApplication.CreateBuilder(args);</span>
<span class="line">var app = builder.Build();</span>
<span class="line"></span>
<span class="line">// 创建一个内容类型提供者</span>
<span class="line">var contentTypeProvider = new FileExtensionContentTypeProvider();</span>
<span class="line"></span>
<span class="line">// 添加或覆盖 MIME 类型映射</span>
<span class="line">// 对于 .custom 文件，映射到 text/plain</span>
<span class="line">contentTypeProvider.Mappings[&quot;.custom&quot;] = &quot;text/plain&quot;;</span>
<span class="line">// 对于 .gltf 文件，映射到 model/gltf+json (如果默认没有，或想覆盖)</span>
<span class="line">contentTypeProvider.Mappings[&quot;.gltf&quot;] = &quot;model/gltf+json&quot;;</span>
<span class="line">// 对于 .wasm 文件，通常是默认支持的，但你也可以明确添加</span>
<span class="line">contentTypeProvider.Mappings[&quot;.wasm&quot;] = &quot;application/wasm&quot;;</span>
<span class="line">// 对于 .webp 图片</span>
<span class="line">contentTypeProvider.Mappings[&quot;.webp&quot;] = &quot;image/webp&quot;;</span>
<span class="line">// 移除某个默认的映射 (例如，如果你不希望 .js 文件以 text/javascript 提供，可以移除它)</span>
<span class="line">// contentTypeProvider.Mappings.Remove(&quot;.js&quot;);</span>
<span class="line"></span>
<span class="line">// 将自定义的 ContentTypeProvider 传递给 UseStaticFiles</span>
<span class="line">app.UseStaticFiles(new StaticFileOptions</span>
<span class="line">{</span>
<span class="line">    ContentTypeProvider = contentTypeProvider</span>
<span class="line">});</span>
<span class="line"></span>
<span class="line">// 其他中间件和路由映射</span>
<span class="line">app.UseRouting();</span>
<span class="line">app.UseAuthorization();</span>
<span class="line">app.MapControllers(); // 或 MapRazorPages() 等</span>
<span class="line"></span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p><strong><code>FileExtensionContentTypeProvider</code>工作原理</strong></p><ul><li><code>FileExtensionContentTypeProvider</code> 内部维护了一个字典，将文件扩展名（不含点，例如 &quot;txt&quot;）映射到相应的 MIME 类型字符串。</li><li>当你通过 <code>contentTypeProvider.Mappings[&quot;.extension&quot;] = &quot;mime/type&quot;;</code> 添加映射时，它会自动处理扩展名开头的点，并将其添加到内部字典。</li><li>当静态文件中间件需要确定一个文件的 <code>Content-Type</code> 时，它会查询这个 <code>ContentTypeProvider</code>。如果找到匹配的扩展名，就使用对应的 MIME 类型。如果没有找到，它会回退到默认行为（通常是 <code>application/octet-stream</code>）。</li></ul>`,801)]))}const r=s(l,[["render",d]]),o=JSON.parse('{"path":"/dotnet/dotnet%20core/basic.html","title":"基础篇","lang":"zh-CN","frontmatter":{"title":"基础篇","shortTitle":"基础篇","description":".NET CORE","date":"2025-07-08T17:08:18.000Z","categories":[".NET",".NET CORE"],"tags":[".NET"],"order":2},"git":{"createdTime":1752103775000,"updatedTime":1753263421000,"contributors":[{"name":"Okita1027","username":"Okita1027","email":"96156298+Okita1027@users.noreply.github.com","commits":18,"url":"https://github.com/Okita1027"}]},"readingTime":{"minutes":115.77,"words":34730},"filePathRelative":"dotnet/dotnet core/basic.md"}');export{r as comp,o as data};
