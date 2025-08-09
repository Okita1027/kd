import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as e,d as a,o as i}from"./app-CN29avzT.js";const l={};function t(d,s){return i(),e("div",null,s[0]||(s[0]=[a(`<h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p><a href="https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/apis?view=aspnetcore-8.0" target="_blank" rel="noopener noreferrer">API 概述 | Microsoft Learn</a></p><p>ASP.NET Core 支持两种创建 API 的方法：基于控制器的方法和最小 API。 API 项目中的控制器是派生自<code>ControllerBase</code>的类。 最小 API 在 Lambda 或方法中使用逻辑处理程序定义终结点。</p><p>最小 API 的设计默认隐藏了主机类，并通过将函数作为 Lambda 表达式的扩展方法专注于配置和扩展性。 控制器是可以通过构造函数注入或属性注入采用依赖关系的类，通常遵循面向对象的模式。 最小 API 通过访问服务提供程序等一系列其他方法支持依赖关系注入。</p><hr><p>示例实体类代码：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">namespace APIWithControllers;</span>
<span class="line"></span>
<span class="line">public class WeatherForecast</span>
<span class="line">{</span>
<span class="line">    public DateOnly Date { get; set; }</span>
<span class="line"></span>
<span class="line">    public int TemperatureC { get; set; }</span>
<span class="line"></span>
<span class="line">    public int TemperatureF =&gt; 32 + (int)(TemperatureC / 0.5556);</span>
<span class="line"></span>
<span class="line">    public string? Summary { get; set; }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>基于控制器的示例代码：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">namespace APIWithControllers;</span>
<span class="line"></span>
<span class="line">public class Program</span>
<span class="line">{</span>
<span class="line">    public static void Main(string[] args)</span>
<span class="line">    {</span>
<span class="line">        var builder = WebApplication.CreateBuilder(args);</span>
<span class="line"></span>
<span class="line">        builder.Services.AddControllers();</span>
<span class="line">        var app = builder.Build();</span>
<span class="line"></span>
<span class="line">        app.UseHttpsRedirection();</span>
<span class="line"></span>
<span class="line">        app.MapControllers();</span>
<span class="line"></span>
<span class="line">        app.Run();</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">using Microsoft.AspNetCore.Mvc;</span>
<span class="line"></span>
<span class="line">namespace APIWithControllers.Controllers;</span>
<span class="line">[ApiController]</span>
<span class="line">[Route(&quot;[controller]&quot;)]</span>
<span class="line">public class WeatherForecastController : ControllerBase</span>
<span class="line">{</span>
<span class="line">    private static readonly string[] Summaries = new[]</span>
<span class="line">    {</span>
<span class="line">        &quot;Freezing&quot;, &quot;Bracing&quot;, &quot;Chilly&quot;, &quot;Cool&quot;, &quot;Mild&quot;, &quot;Warm&quot;, &quot;Balmy&quot;, &quot;Hot&quot;, &quot;Sweltering&quot;, &quot;Scorching&quot;</span>
<span class="line">    };</span>
<span class="line"></span>
<span class="line">    private readonly ILogger&lt;WeatherForecastController&gt; _logger;</span>
<span class="line"></span>
<span class="line">    public WeatherForecastController(ILogger&lt;WeatherForecastController&gt; logger)</span>
<span class="line">    {</span>
<span class="line">        _logger = logger;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    [HttpGet(Name = &quot;GetWeatherForecast&quot;)]</span>
<span class="line">    public IEnumerable&lt;WeatherForecast&gt; Get()</span>
<span class="line">    {</span>
<span class="line">        return Enumerable.Range(1, 5).Select(index =&gt; new WeatherForecast</span>
<span class="line">        {</span>
<span class="line">            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),</span>
<span class="line">            TemperatureC = Random.Shared.Next(-20, 55),</span>
<span class="line">            Summary = Summaries[Random.Shared.Next(Summaries.Length)]</span>
<span class="line">        })</span>
<span class="line">        .ToArray();</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最小 API 示例代码：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">namespace MinimalAPI;</span>
<span class="line"></span>
<span class="line">public class Program</span>
<span class="line">{</span>
<span class="line">    public static void Main(string[] args)</span>
<span class="line">    {</span>
<span class="line">        var builder = WebApplication.CreateBuilder(args);</span>
<span class="line"></span>
<span class="line">        var app = builder.Build();</span>
<span class="line"></span>
<span class="line">        app.UseHttpsRedirection();</span>
<span class="line"></span>
<span class="line">        var summaries = new[]</span>
<span class="line">        {</span>
<span class="line">            &quot;Freezing&quot;, &quot;Bracing&quot;, &quot;Chilly&quot;, &quot;Cool&quot;, &quot;Mild&quot;, &quot;Warm&quot;, &quot;Balmy&quot;, &quot;Hot&quot;, &quot;Sweltering&quot;, &quot;Scorching&quot;</span>
<span class="line">        };</span>
<span class="line"></span>
<span class="line">        app.MapGet(&quot;/weatherforecast&quot;, (HttpContext httpContext) =&gt;</span>
<span class="line">        {</span>
<span class="line">            var forecast = Enumerable.Range(1, 5).Select(index =&gt;</span>
<span class="line">                new WeatherForecast</span>
<span class="line">                {</span>
<span class="line">                    Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),</span>
<span class="line">                    TemperatureC = Random.Shared.Next(-20, 55),</span>
<span class="line">                    Summary = summaries[Random.Shared.Next(summaries.Length)]</span>
<span class="line">                })</span>
<span class="line">                .ToArray();</span>
<span class="line">            return forecast;</span>
<span class="line">        });</span>
<span class="line"></span>
<span class="line">        app.Run();</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>基于控制器的 API 有一些功能还没有被最小 API 所支持或实现。 其中包括:</p><ul><li>不提供对模型绑定的内置支持（<a href="https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.mvc.modelbinding.imodelbinderprovider" target="_blank" rel="noopener noreferrer">IModelBinderProvider</a>、<a href="https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.mvc.modelbinding.imodelbinder" target="_blank" rel="noopener noreferrer">IModelBinder</a>）。 可以使用自定义绑定填充码添加支持。</li><li>不提供对验证的内置支持 (<a href="https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.mvc.modelbinding.validation.imodelvalidator" target="_blank" rel="noopener noreferrer">IModelValidator</a>)。</li><li>不支持<a href="https://learn.microsoft.com/zh-cn/aspnet/core/mvc/advanced/app-parts?view=aspnetcore-8.0" target="_blank" rel="noopener noreferrer">应用程序部件</a>或<a href="https://learn.microsoft.com/zh-cn/aspnet/core/mvc/controllers/application-model?view=aspnetcore-8.0" target="_blank" rel="noopener noreferrer">应用程序模型</a>。 无法应用或生成自己的约定。</li><li>没有内置视图呈现支持。 我们建议使用 <a href="https://learn.microsoft.com/zh-cn/aspnet/core/tutorials/razor-pages/razor-pages-start?view=aspnetcore-8.0" target="_blank" rel="noopener noreferrer">Razor Pages</a> 来呈现视图。</li><li>不支持 <a href="https://www.nuget.org/packages/Microsoft.AspNetCore.JsonPatch/" target="_blank" rel="noopener noreferrer">JsonPatch</a></li><li>不支持 <a href="https://www.nuget.org/packages/Microsoft.AspNetCore.OData/" target="_blank" rel="noopener noreferrer">OData</a></li></ul><h2 id="基于控制器的api" tabindex="-1"><a class="header-anchor" href="#基于控制器的api"><span>基于控制器的API</span></a></h2><h3 id="操作返回类型" tabindex="-1"><a class="header-anchor" href="#操作返回类型"><span>操作返回类型</span></a></h3><p>ASP.NET Core 提供以下 Web API 控制器操作返回类型选项：</p><ul><li><a href="https://learn.microsoft.com/zh-cn/aspnet/core/web-api/action-return-types?view=aspnetcore-8.0#specific-type" target="_blank" rel="noopener noreferrer">特定类型</a></li><li><a href="https://learn.microsoft.com/zh-cn/aspnet/core/web-api/action-return-types?view=aspnetcore-8.0#iactionresult-type" target="_blank" rel="noopener noreferrer">IActionResult</a></li><li><a href="https://learn.microsoft.com/zh-cn/aspnet/core/web-api/action-return-types?view=aspnetcore-8.0#actionresultt-type" target="_blank" rel="noopener noreferrer">ActionResult</a></li><li><a href="https://learn.microsoft.com/zh-cn/aspnet/core/web-api/action-return-types?view=aspnetcore-8.0#httpresults-type" target="_blank" rel="noopener noreferrer">HttpResults</a></li></ul><table><thead><tr><th>类型</th><th>适用场景</th><th>示例</th></tr></thead><tbody><tr><td><code>IActionResult</code></td><td>✅ 最通用，返回多种响应类型</td><td><code>return Ok(obj);</code></td></tr><tr><td><code>ActionResult&lt;T&gt;</code></td><td>✅ 推荐用于 Web API</td><td><code>return obj;</code> 或 <code>NotFound()</code></td></tr><tr><td>具体实现类（如 <code>OkResult</code>）</td><td>返回具体 HTTP 状态码</td><td><code>return new OkResult();</code></td></tr><tr><td>实体对象（T）</td><td>简单 API 返回对象（隐式 200）</td><td><code>return user;</code></td></tr><tr><td><code>Task&lt;T&gt;</code> / <code>Task&lt;IActionResult&gt;</code></td><td>异步方法返回类型</td><td><code>async Task&lt;IActionResult&gt;</code></td></tr><tr><td><code>void</code>（不推荐）</td><td>无返回值动作（如日志）</td><td><code>void DoSomething()</code></td></tr></tbody></table><h4 id="iactionresult" tabindex="-1"><a class="header-anchor" href="#iactionresult"><span><code>IActionResult</code></span></a></h4><p><strong>用途</strong>：这是一个<strong>接口</strong>，表示一个抽象的动作结果。它提供了最大的灵活性，允许你返回各种 HTTP 响应类型，包括不同的状态码、JSON、文件、重定向等。</p><p><strong>行为</strong>：你需要实例化一个实现了 <code>IActionResult</code> 的具体类（例如 <code>OkResult</code>, <code>NotFoundResult</code>, <code>JsonResult</code>, <code>StatusCodeResult</code> 等），并从方法中返回它。</p><p><strong>适用场景</strong>：当你需要根据业务逻辑返回多种不同的 HTTP 状态码或内容类型时，这是<strong>最灵活也是最常用的返回类型</strong>。</p><p><strong>控制器基类提供的辅助方法</strong>：<code>ControllerBase</code> 和 <code>Controller</code> 提供了许多便利的辅助方法来创建 <code>IActionResult</code> 实例，例如：</p><table><thead><tr><th>返回方法 / 类</th><th>状态码</th><th>说明</th></tr></thead><tbody><tr><td><code>Ok()</code> / <code>Ok(object)</code></td><td>200</td><td>成功，带或不带数据</td></tr><tr><td><code>Created()</code> / <code>CreatedAtAction()</code>/<code>CreatedAtRoute()</code></td><td>201</td><td>创建成功，并附带位置头部</td></tr><tr><td><code>NoContent()</code></td><td>204</td><td>操作成功但无内容返回</td></tr><tr><td><code>BadRequest()</code></td><td>400</td><td>客户端请求错误</td></tr><tr><td><code>Unauthorized()</code></td><td>401</td><td>未授权</td></tr><tr><td><code>Forbid()</code></td><td>403</td><td>权限不足</td></tr><tr><td><code>NotFound()</code></td><td>404</td><td>资源未找到</td></tr><tr><td><code>Conflict()</code></td><td>409</td><td>冲突（如资源已存在）</td></tr><tr><td><code>StatusCode(500)</code></td><td>任意</td><td>返回自定义状态码</td></tr><tr><td><code>File()</code></td><td>200</td><td>返回文件内容</td></tr><tr><td><code>Redirect()</code></td><td>302</td><td>重定向到其他 URL</td></tr><tr><td><code>Content()</code></td><td>200</td><td>返回纯文本</td></tr><tr><td><code>Json()</code></td><td>200</td><td>返回 JSON（Razor 页面专用）</td></tr></tbody></table><h4 id="actionresult-t" tabindex="-1"><a class="header-anchor" href="#actionresult-t"><span><code>ActionResult&lt;T&gt;</code></span></a></h4><p><strong>用途</strong>：结合了 <code>IActionResult</code> 的灵活性和直接返回数据类型 <code>T</code> 的简洁性。</p><p><strong>行为</strong>：可以直接返回类型 <code>T</code> 的实例，此时它会被序列化为 JSON 并返回 200 OK。也可以返回任何 <code>IActionResult</code> 类型，实现灵活的状态码和内容。</p><p><strong>适用场景</strong>：当你的 API 通常返回<strong>特定类型的数据</strong>，但偶尔也需要返回像 404 Not Found、400 Bad Request 这样的<strong>状态码结果</strong>时，这是<strong>最推荐的返回类型</strong>。</p><p>示例：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">[HttpGet(&quot;{id}&quot;)]</span>
<span class="line">public ActionResult&lt;Product&gt; GetProduct(int id) // 返回 Product 或 IActionResult</span>
<span class="line">{</span>
<span class="line">    var product = _productService.GetProductById(id);</span>
<span class="line"></span>
<span class="line">    if (product == null)</span>
<span class="line">    {</span>
<span class="line">        return NotFound(); // 返回 404 Not Found，这里隐式转换为 ActionResult&lt;Product&gt;</span>
<span class="line">    }</span>
<span class="line">    return product; // 直接返回 Product 对象，会返回 200 OK 和产品 JSON</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>对比 <code>IActionResult</code></strong>:</p><ul><li><code>IActionResult</code> 只能返回 <code>IActionResult</code> 对象。</li><li><code>ActionResult&lt;T&gt;</code> <strong>既可以返回 <code>T</code> 对象，也可以返回 <code>IActionResult</code> 对象</strong>。当返回 <code>T</code> 对象时，它会自动包装成 <code>OkObjectResult</code>（返回 200 OK）。</li></ul><h4 id="异步返回类型" tabindex="-1"><a class="header-anchor" href="#异步返回类型"><span>异步返回类型</span></a></h4><blockquote><p>[!NOTE]</p><p>对于任何涉及 I/O 操作（数据库、网络请求）的动作方法，都应使用异步模式，以避免阻塞线程池并提高应用程序的吞吐量。</p></blockquote><p><code>Task&lt;T&gt;</code>、<code>Task&lt;IActionResult&gt;</code>、<code>Task&lt;ActionResult&lt;T&gt;&gt;</code></p><p><strong>用途</strong>：当你的动作方法执行异步操作（例如，数据库访问、调用外部 API）时，应使用这些异步返回类型。</p><p><strong>行为</strong>：与同步版本类似，但它们返回一个表示异步操作的任务。</p><p><strong>适用场景</strong>：几乎所有的 Web API 动作方法都应是异步的，以提高服务器的并发处理能力。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">[HttpGet(&quot;{id}&quot;)]</span>
<span class="line">public async Task&lt;ActionResult&lt;Product&gt;&gt; GetProductAsync(int id)</span>
<span class="line">{</span>
<span class="line">    var product = await _productService.GetProductByIdAsync(id);</span>
<span class="line">    if (product == null)</span>
<span class="line">    {</span>
<span class="line">        return NotFound();</span>
<span class="line">    }</span>
<span class="line">    return product;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">[HttpPost]</span>
<span class="line">public async Task&lt;IActionResult&gt; CreateProductAsync([FromBody] Product product)</span>
<span class="line">{</span>
<span class="line">    if (!ModelState.IsValid)</span>
<span class="line">    {</span>
<span class="line">        return BadRequest(ModelState);</span>
<span class="line">    }</span>
<span class="line">    await _productService.AddProductAsync(product);</span>
<span class="line">    return CreatedAtAction(nameof(GetProductAsync), new { id = product.Id }, product);</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="特定类型" tabindex="-1"><a class="header-anchor" href="#特定类型"><span>特定类型</span></a></h4><p>最基本的操作返回基元或复杂数据类型（例如<code>string</code>或自定义对象）</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">[HttpGet]</span>
<span class="line">public Task&lt;List&lt;Product&gt;&gt; Get() =&gt;</span>
<span class="line">    _productContext.Products.OrderBy(p =&gt; p.Name).ToListAsync();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>自定义状态码与响应</strong></p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">return StatusCode(418, new</span>
<span class="line">{</span>
<span class="line">    code = 418,</span>
<span class="line">    message = &quot;I&#39;m a teapot ☕&quot;</span>
<span class="line">});</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>文件、下载内容</strong></p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public IActionResult Download()</span>
<span class="line">{</span>
<span class="line">    var fileBytes = System.IO.File.ReadAllBytes(&quot;report.pdf&quot;);</span>
<span class="line">    return File(fileBytes, &quot;application/pdf&quot;, &quot;report.pdf&quot;);</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>链接位置（201 Created）</strong></p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">return CreatedAtAction(nameof(Get), new { id = user.Id }, user);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language-txt line-numbers-mode" data-highlighter="prismjs" data-ext="txt"><pre><code class="language-txt"><span class="line">// 响应头中包含：</span>
<span class="line">Location: /api/user/123</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>统一封装格式（自定义Result）</strong></p><div class="language-JSON line-numbers-mode" data-highlighter="prismjs" data-ext="JSON"><pre><code class="language-JSON"><span class="line">// 常见的响应格式</span>
<span class="line">{</span>
<span class="line">  &quot;code&quot;: 0,</span>
<span class="line">  &quot;message&quot;: &quot;成功&quot;,</span>
<span class="line">  &quot;data&quot;: { ... }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">// 响应类定义</span>
<span class="line">public class ApiResponse&lt;T&gt;</span>
<span class="line">{</span>
<span class="line">    public int Code { get; set; } = 0;</span>
<span class="line">    public string Message { get; set; } = &quot;成功&quot;;</span>
<span class="line">    public T Data { get; set; }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">// 最终返回结果</span>
<span class="line">return Ok(new ApiResponse&lt;User&gt; { Data = user });</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="处理json-patch请求" tabindex="-1"><a class="header-anchor" href="#处理json-patch请求"><span>处理JSON Patch请求</span></a></h3><p><a href="https://learn.microsoft.com/zh-cn/aspnet/core/web-api/jsonpatch?view=aspnetcore-8.0" target="_blank" rel="noopener noreferrer">ASP.NET Core Web API 中的 JSON 修补程序 | Microsoft Learn</a></p><h4 id="nuget安装newtonsoftjson" tabindex="-1"><a class="header-anchor" href="#nuget安装newtonsoftjson"><span>NuGet安装<code>NewtonsoftJson</code></span></a></h4><p>JSON Patch基于 <code>Newtonsoft.Json</code>，并且需要 <a href="https://www.nuget.org/packages/Microsoft.AspNetCore.Mvc.NewtonsoftJson/" target="_blank" rel="noopener noreferrer"><code>Microsoft.AspNetCore.Mvc.NewtonsoftJson</code></a> NuGet 包。</p><ul><li><p>安装 <a href="https://www.nuget.org/packages/Microsoft.AspNetCore.Mvc.NewtonsoftJson/" target="_blank" rel="noopener noreferrer"><code>Microsoft.AspNetCore.Mvc.NewtonsoftJson</code></a> NuGet 包。</p><div class="language-BASH line-numbers-mode" data-highlighter="prismjs" data-ext="BASH"><pre><code class="language-BASH"><span class="line">dotnet add package Microsoft.AspNetCore.JsonPatch</span>
<span class="line">dotnet add package Microsoft.AspNetCore.Mvc.NewtonsoftJson # 如果你依赖 Newtonsoft.Json 或遇到问题</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>调用 <a href="https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.extensions.dependencyinjection.newtonsoftjsonmvcbuilderextensions.addnewtonsoftjson" target="_blank" rel="noopener noreferrer">AddNewtonsoftJson</a>、配置 JSON Patch :</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">// Program.cs</span>
<span class="line">var builder = WebApplication.CreateBuilder(args);</span>
<span class="line"></span>
<span class="line">// 如果使用 Controllers</span>
<span class="line">builder.Services.AddControllers()</span>
<span class="line">    .AddNewtonsoftJson(); // 添加 Newtonsoft.Json 支持，这对 JsonPatchDocument 绑定是必需的</span>
<span class="line"></span>
<span class="line">// 如果使用 Minimal APIs</span>
<span class="line">// Minimal APIs 通常默认支持 System.Text.Json，JsonPatchDocument 应该可以直接绑定。</span>
<span class="line">// 但如果你在 Minimal APIs 中也引入了 Newtonsoft.Json，并希望其处理 Json Patch，</span>
<span class="line">// 可能需要更复杂的设置，或直接使用 System.Text.Json。</span>
<span class="line">// 对于 System.Text.Json，确保你有 Microsoft.AspNetCore.JsonPatch 包即可，通常无需额外 AddJson()。</span>
<span class="line"></span>
<span class="line">var app = builder.Build();</span>
<span class="line">// ...</span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><blockquote><p>[!important]</p><p>对于默认使用 <code>System.Text.Json</code> 的 .NET 6+ 应用，通常<strong>只需要安装 <code>Microsoft.AspNetCore.JsonPatch</code> 包即可</strong>，<code>AddNewtonsoftJson()</code> 只有当你明确想要使用 <code>Newtonsoft.Json</code> 进行所有 JSON 处理时才需要。<code>Microsoft.AspNetCore.JsonPatch</code> 内部会自动适配 <code>System.Text.Json</code>。</p></blockquote><blockquote><p>JsonPatch 要求将 <code>Content-Type</code> 标头设置为 <code>application/json-patch+json</code>。</p></blockquote><h4 id="处理json-patch" tabindex="-1"><a class="header-anchor" href="#处理json-patch"><span>处理JSON Patch</span></a></h4><ol><li>定义DTO或者实体类</li></ol><p>这个类代表了你想要部分修改的资源。<code>JsonPatchDocument&lt;T&gt;</code> 中的 <code>T</code> 必须是这个类型。</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">// Models/Product.cs</span>
<span class="line">public class Product</span>
<span class="line">{</span>
<span class="line">    public int Id { get; set; }</span>
<span class="line">    public string Name { get; set; } = string.Empty;</span>
<span class="line">    public decimal Price { get; set; }</span>
<span class="line">    public string Description { get; set; } = string.Empty;</span>
<span class="line">    public bool IsAvailable { get; set; }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>创建一个 <code>HttpPatch</code> 动作方法</li></ol><p>这个方法将接收一个 <code>JsonPatchDocument&lt;T&gt;</code> 作为请求体。</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">using Microsoft.AspNetCore.JsonPatch;</span>
<span class="line">using Microsoft.AspNetCore.Mvc;</span>
<span class="line">using System.Collections.Generic;</span>
<span class="line">using System.Linq;</span>
<span class="line"></span>
<span class="line">[ApiController]</span>
<span class="line">[Route(&quot;api/[controller]&quot;)]</span>
<span class="line">public class ProductsController : ControllerBase</span>
<span class="line">{</span>
<span class="line">    // 模拟数据存储</span>
<span class="line">    private static List&lt;Product&gt; _products = new List&lt;Product&gt;</span>
<span class="line">    {</span>
<span class="line">        new Product { Id = 1, Name = &quot;Laptop&quot;, Price = 1200.00m, Description = &quot;Powerful machine&quot;, IsAvailable = true },</span>
<span class="line">        new Product { Id = 2, Name = &quot;Mouse&quot;, Price = 25.00m, Description = &quot;Wireless mouse&quot;, IsAvailable = false }</span>
<span class="line">    };</span>
<span class="line"></span>
<span class="line">    // GET /api/products/{id}</span>
<span class="line">    [HttpGet(&quot;{id}&quot;)]</span>
<span class="line">    public ActionResult&lt;Product&gt; GetProduct(int id)</span>
<span class="line">    {</span>
<span class="line">        var product = _products.FirstOrDefault(p =&gt; p.Id == id);</span>
<span class="line">        if (product == null) return NotFound();</span>
<span class="line">        return Ok(product);</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    // PATCH /api/products/{id}</span>
<span class="line">    // Content-Type 必须是 application/json-patch+json</span>
<span class="line">    [HttpPatch(&quot;{id}&quot;)]</span>
<span class="line">    public IActionResult PatchProduct(int id, [FromBody] JsonPatchDocument&lt;Product&gt; patchDoc)</span>
<span class="line">    {</span>
<span class="line">        // 1. 从数据存储中获取要更新的原始对象</span>
<span class="line">        var productToUpdate = _products.FirstOrDefault(p =&gt; p.Id == id);</span>
<span class="line">        if (productToUpdate == null)</span>
<span class="line">        {</span>
<span class="line">            return NotFound();</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        // 2. 将 JsonPatchDocument 应用到原始对象</span>
<span class="line">        // ApplyTo 方法会根据 patchDoc 中描述的操作，修改 productToUpdate 对象。</span>
<span class="line">        // ModelState 是用于捕获应用操作时可能产生的验证错误。</span>
<span class="line">        patchDoc.ApplyTo(productToUpdate, ModelState);</span>
<span class="line"></span>
<span class="line">        // 3. 检查模型状态 (Model State)</span>
<span class="line">        // 如果 JsonPatch 操作本身（例如，尝试修改不存在的路径）导致验证错误，</span>
<span class="line">        // 或者应用补丁后，更新后的对象违反了数据注解验证规则，ModelState.IsValid 会是 false。</span>
<span class="line">        if (!ModelState.IsValid)</span>
<span class="line">        {</span>
<span class="line">            return BadRequest(ModelState); // [ApiController] 会将此格式化为 ProblemDetails</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        // 4. (可选) 重新验证整个对象</span>
<span class="line">        // 如果你的对象有更复杂的验证逻辑（例如，跨字段的验证），</span>
<span class="line">        // 建议在应用补丁后再次手动触发验证。</span>
<span class="line">        TryValidateModel(productToUpdate);</span>
<span class="line">        if (!ModelState.IsValid)</span>
<span class="line">        {</span>
<span class="line">            return BadRequest(ModelState);</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        // 5. 保存更新后的对象到数据存储</span>
<span class="line">        // 模拟保存，实际中可能是 _dbContext.SaveChanges() 或更新 repository</span>
<span class="line">        // _products.RemoveAll(p =&gt; p.Id == id);</span>
<span class="line">        // _products.Add(productToUpdate);</span>
<span class="line"></span>
<span class="line">        // 6. 返回成功响应</span>
<span class="line">        return NoContent(); // 204 No Content 是 PATCH 成功的常见响应</span>
<span class="line">        // 如果你希望返回更新后的资源，也可以返回 Ok(productToUpdate);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>客户端发送JSON Patch请求</li></ol><p>客户端发送 <code>PATCH</code> 请求，并且 <code>Content-Type</code> 头必须设置为 <strong><code>application/json-patch+json</code></strong>。请求体是一个 JSON 数组，每个元素都是一个操作对象。</p><p>JSON Patch 操作类型 (RFC 6902)：</p><table><thead><tr><th>操作 (op)</th><th>描述</th><th>必需字段</th><th>示例</th></tr></thead><tbody><tr><td>add</td><td>添加值到数组末尾或对象属性</td><td>path, value</td><td>{ &quot;op&quot;: &quot;add&quot;, &quot;path&quot;: &quot;/tags/-&quot;, &quot;value&quot;: &quot;new&quot; }</td></tr><tr><td>remove</td><td>移除值或属性</td><td>path</td><td>{ &quot;op&quot;: &quot;remove&quot;, &quot;path&quot;: &quot;/price&quot; }</td></tr><tr><td>replace</td><td>替换值或属性</td><td>path, value</td><td>{ &quot;op&quot;: &quot;replace&quot;, &quot;path&quot;: &quot;/name&quot;, &quot;value&quot;: &quot;Updated Product&quot; }</td></tr><tr><td>copy</td><td>从一个路径复制值到另一个路径</td><td>from, path</td><td>{ &quot;op&quot;: &quot;copy&quot;, &quot;from&quot;: &quot;/oldName&quot;, &quot;path&quot;: &quot;/newName&quot; }</td></tr><tr><td>move</td><td>从一个路径移动值到另一个路径</td><td>from, path</td><td>{ &quot;op&quot;: &quot;move&quot;, &quot;from&quot;: &quot;/oldProp&quot;, &quot;path&quot;: &quot;/newProp&quot; }</td></tr><tr><td>test</td><td>测试路径中的值是否与给定值相等</td><td>path, value</td><td>{ &quot;op&quot;: &quot;test&quot;, &quot;path&quot;: &quot;/status&quot;, &quot;value&quot;: &quot;active&quot; }</td></tr></tbody></table><p>客户端请求示例：</p><p>假设要更新 <code>id</code> 为 1 的产品：</p><ol><li>将 <code>Name</code> 从 &quot;Laptop&quot; 修改为 &quot;Super Laptop&quot;。</li><li>将 <code>Price</code> 修改为 <code>1300.00</code>。</li><li>将 <code>IsAvailable</code> 设置为 <code>true</code>。</li></ol><div class="language-HTTP line-numbers-mode" data-highlighter="prismjs" data-ext="HTTP"><pre><code class="language-HTTP"><span class="line">PATCH /api/products/1 HTTP/1.1</span>
<span class="line">Content-Type: application/json-patch+json</span>
<span class="line">Host: localhost:5000</span>
<span class="line"></span>
<span class="line">[</span>
<span class="line">  { &quot;op&quot;: &quot;replace&quot;, &quot;path&quot;: &quot;/name&quot;, &quot;value&quot;: &quot;Super Laptop&quot; },</span>
<span class="line">  { &quot;op&quot;: &quot;replace&quot;, &quot;path&quot;: &quot;/price&quot;, &quot;value&quot;: 1300.00 },</span>
<span class="line">  { &quot;op&quot;: &quot;replace&quot;, &quot;path&quot;: &quot;/isAvailable&quot;, &quot;value&quot;: true }</span>
<span class="line">]</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>更多示例：</p><ul><li><p>添加新属性 (如果 <code>Product</code> 类支持动态属性)：</p><div class="language-JSON line-numbers-mode" data-highlighter="prismjs" data-ext="JSON"><pre><code class="language-JSON"><span class="line">[</span>
<span class="line">  { &quot;op&quot;: &quot;add&quot;, &quot;path&quot;: &quot;/color&quot;, &quot;value&quot;: &quot;red&quot; }</span>
<span class="line">]</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>移除属性</p><div class="language-JSON line-numbers-mode" data-highlighter="prismjs" data-ext="JSON"><pre><code class="language-JSON"><span class="line">[</span>
<span class="line">  { &quot;op&quot;: &quot;remove&quot;, &quot;path&quot;: &quot;/description&quot; }</span>
<span class="line">]</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>添加到数组（假设 <code>Product</code> 有个 <code>Tags</code> 属性是 <code>List&lt;string&gt;</code>）、插入到指定索引</p><div class="language-JSON line-numbers-mode" data-highlighter="prismjs" data-ext="JSON"><pre><code class="language-JSON"><span class="line">[</span>
<span class="line">  { &quot;op&quot;: &quot;add&quot;, &quot;path&quot;: &quot;/tags/-&quot;, &quot;value&quot;: &quot;electronics&quot; }, // &quot;-&quot; 表示添加到数组末尾</span>
<span class="line">  { &quot;op&quot;: &quot;add&quot;, &quot;path&quot;: &quot;/tags/0&quot;, &quot;value&quot;: &quot;new_tag_at_start&quot; }</span>
<span class="line">]</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>测试操作（如果<code>test</code>失败，整个Patch都会失败）</p><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code class="language-json"><span class="line"><span class="token punctuation">[</span></span>
<span class="line">  <span class="token punctuation">{</span> <span class="token property">&quot;op&quot;</span><span class="token operator">:</span> <span class="token string">&quot;test&quot;</span><span class="token punctuation">,</span> <span class="token property">&quot;path&quot;</span><span class="token operator">:</span> <span class="token string">&quot;/isAvailable&quot;</span><span class="token punctuation">,</span> <span class="token property">&quot;value&quot;</span><span class="token operator">:</span> <span class="token boolean">false</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token comment">// 只有当 isAvailable 为 false 时才继续</span></span>
<span class="line">  <span class="token punctuation">{</span> <span class="token property">&quot;op&quot;</span><span class="token operator">:</span> <span class="token string">&quot;replace&quot;</span><span class="token punctuation">,</span> <span class="token property">&quot;path&quot;</span><span class="token operator">:</span> <span class="token string">&quot;/name&quot;</span><span class="token punctuation">,</span> <span class="token property">&quot;value&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Unavailable Item&quot;</span> <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">]</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h3 id="格式化响应数据" tabindex="-1"><a class="header-anchor" href="#格式化响应数据"><span>格式化响应数据</span></a></h3><table><thead><tr><th>格式</th><th>MIME 类型</th><th>默认支持</th><th>常用格式化器</th></tr></thead><tbody><tr><td>JSON</td><td><code>application/json</code></td><td>✅</td><td><code>System.Text.Json</code> 或 <code>Newtonsoft.Json</code></td></tr><tr><td>XML</td><td><code>application/xml</code></td><td>❌</td><td>需手动添加 <code>XmlSerializerOutputFormatter</code></td></tr><tr><td>纯文本</td><td><code>text/plain</code></td><td>✅</td><td><code>StringOutputFormatter</code></td></tr><tr><td>HTML</td><td><code>text/html</code>（Razor）</td><td>✅</td><td>视图引擎自动处理</td></tr></tbody></table><h4 id="如何支持xml格式" tabindex="-1"><a class="header-anchor" href="#如何支持xml格式"><span>如何支持XML格式</span></a></h4><ol><li><p>安装NuGet包</p><div class="language-BASH line-numbers-mode" data-highlighter="prismjs" data-ext="BASH"><pre><code class="language-BASH"><span class="line">dotnet add package Microsoft.AspNetCore.Mvc.Formatters.Xml</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div></li><li><p>配置XML格式化器</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">// Program.cs</span>
<span class="line">var builder = WebApplication.CreateBuilder(args);</span>
<span class="line"></span>
<span class="line">builder.Services.AddControllers(options =&gt;</span>
<span class="line">{</span>
<span class="line">    // 添加 XmlSerializerInputFormatter 用于处理 XML 请求体</span>
<span class="line">    options.InputFormatters.Add(new XmlSerializerInputFormatter(options));</span>
<span class="line">    // 添加 XmlSerializerOutputFormatter 用于生成 XML 响应</span>
<span class="line">    options.OutputFormatters.Add(new XmlSerializerOutputFormatter());</span>
<span class="line">});</span>
<span class="line"></span>
<span class="line">var app = builder.Build();</span>
<span class="line">// ...</span>
<span class="line">app.Run();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><p>现在，当客户端发送 <code>Accept: application/xml</code> 请求头时，如果动作方法返回一个对象，ASP.NET Core 会尝试将其序列化为 XML。</p><h3 id="自定义格式化程序" tabindex="-1"><a class="header-anchor" href="#自定义格式化程序"><span>自定义格式化程序</span></a></h3><p><strong>自定义格式化程序</strong>允许你将控制器返回的数据对象，<strong>序列化为除默认 JSON/XML 外的其他格式</strong>，例如：</p><ul><li>CSV</li><li>Markdown</li><li>YAML</li><li>Excel</li><li>自定义 MIME 类型（如 <code>application/vnd.company+json</code>）等</li></ul><p><strong>实现方法：</strong></p><ol><li>继承 <code>TextOutputFormatter</code> 或 <code>OutputFormatter</code></li><li>重写关键方法：<code>CanWriteResult()</code> 和 <code>WriteResponseBodyAsync()</code></li><li>设置支持的内容类型和编码</li><li>注册到 <code>MvcOptions.OutputFormatters</code> 中</li></ol><h3 id="分析器" tabindex="-1"><a class="header-anchor" href="#分析器"><span>分析器</span></a></h3><table><thead><tr><th>类型</th><th>说明</th><th>示例</th></tr></thead><tbody><tr><td><strong>编译器分析器</strong></td><td>Roslyn 提供的内置 C# 编译器分析器</td><td>空变量警告、未使用的 <code>using</code></td></tr><tr><td><strong>.NET SDK 分析器</strong></td><td>微软官方提供的代码质量分析器（默认启用）</td><td><code>CA</code> 系列警告，如 <code>CA2007</code></td></tr><tr><td><strong>ASP.NET Core 分析器</strong></td><td>对 ASP.NET 使用习惯的特定检查</td><td>JSON 序列化、Controller 注解等问题</td></tr><tr><td><strong>第三方分析器</strong></td><td>社区或公司自定义规范检查</td><td>StyleCop、SonarAnalyzer、ReSharper</td></tr><tr><td><strong>源生成器 + 分析器</strong></td><td>分析源代码并生成代码</td><td>Swashbuckle、Mapster、EF Core 生成器</td></tr></tbody></table><h4 id="禁用分析器" tabindex="-1"><a class="header-anchor" href="#禁用分析器"><span>禁用分析器</span></a></h4><p>在代码中使用 <code>#pragma warning</code>：</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">#pragma warning disable CA2007</span>
<span class="line">await DoSomethingAsync();</span>
<span class="line">#pragma warning restore CA2007</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 <code>.editorconfig</code> 中禁用：</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">dotnet_diagnostic.CA2007.severity = none</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="定制分析器" tabindex="-1"><a class="header-anchor" href="#定制分析器"><span>定制分析器</span></a></h4><ol><li><p><strong><code>GlobalUsings</code> 文件</strong>：在解决方案资源管理器中右键点击项目 -&gt; “属性” -&gt; “代码分析” -&gt; “通用” 或 “规则集”，可以配置哪些规则集应用于项目。</p></li><li><p><strong><code>.editorconfig</code> 文件</strong>：这是最推荐的方式，因为它可以在团队中共享编码风格和分析器规则，并且对 IDE 具有很好的支持。你可以在 <code>.editorconfig</code> 文件中针对特定的规则 ID 配置其严重级别（<code>error</code>, <code>warning</code>, <code>suggestion</code>, <code>info</code>, <code>silent</code> 或 <code>none</code>）。</p><p><strong>示例 <code>.editorconfig</code> 条目</strong>：</p><div class="language-INI line-numbers-mode" data-highlighter="prismjs" data-ext="INI"><pre><code class="language-INI"><span class="line"># 强制将所有 CS8019 警告提升为错误</span>
<span class="line">dotnet_diagnostic.CS8019.severity = error</span>
<span class="line"></span>
<span class="line"># 禁用 SA1600 (Missing XML comment for publicly visible type or member)</span>
<span class="line">dotnet_diagnostic.SA1600.severity = none</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>项目文件 (<code>.csproj</code>)</strong>：你也可以在 <code>.csproj</code> 文件中通过 <code>&lt;NoWarn&gt;</code> 或 <code>&lt;WarningsAsErrors&gt;</code> 属性来抑制或提升某些警告。但这通常不如 <code>.editorconfig</code> 灵活和推荐。</p><div class="language-XML line-numbers-mode" data-highlighter="prismjs" data-ext="XML"><pre><code class="language-XML"><span class="line">&lt;Project Sdk=&quot;Microsoft.NET.Sdk.Web&quot;&gt;</span>
<span class="line">  &lt;PropertyGroup&gt;</span>
<span class="line">    &lt;TargetFramework&gt;net8.0&lt;/TargetFramework&gt;</span>
<span class="line">    &lt;ImplicitUsings&gt;enable&lt;/ImplicitUsings&gt;</span>
<span class="line">    &lt;WarningsAsErrors&gt;$(WarningsAsErrors);CS0618&lt;/WarningsAsErrors&gt;</span>
<span class="line">    &lt;NoWarn&gt;$(NoWarn);CA1000&lt;/NoWarn&gt;</span>
<span class="line">  &lt;/PropertyGroup&gt;</span>
<span class="line">  &lt;/Project&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><h3 id="httprepl" tabindex="-1"><a class="header-anchor" href="#httprepl"><span>HttpRepl</span></a></h3><p><code>HttpRepl</code> 是一个微软提供的 <strong>命令行工具</strong>，用于探索和调试 ASP.NET Core Web API。全称是 <strong>HTTP REPL（Read-Eval-Print-Loop）</strong>。</p><p>它像是 Web API 的“命令行浏览器”，你可以：</p><ul><li>连接到 Web API 端点</li><li>浏览控制器和操作</li><li>发起 GET、POST、PUT、DELETE 请求</li><li>自动提示路由、参数、可用 HTTP 动作</li><li>用交互方式测试接口，而不需要 Postman、curl 或 Swagger</li></ul><h2 id="最小api" tabindex="-1"><a class="header-anchor" href="#最小api"><span>最小API</span></a></h2><h2 id="openapi" tabindex="-1"><a class="header-anchor" href="#openapi"><span>OpenAPI</span></a></h2>`,103)]))}const c=n(l,[["render",t]]),p=JSON.parse('{"path":"/dotnet/dotnet%20core/api%20interface.html","title":"API接口","lang":"zh-CN","frontmatter":{"title":"API接口","shortTitle":"API接口","description":"API接口","date":"2025-07-12T11:08:18.000Z","categories":[".NET",".NET CORE"],"tags":[".NET"],"order":5},"git":{"createdTime":1752290312000,"updatedTime":1753197204000,"contributors":[{"name":"Okita1027","username":"Okita1027","email":"96156298+Okita1027@users.noreply.github.com","commits":7,"url":"https://github.com/Okita1027"}]},"readingTime":{"minutes":12.09,"words":3626},"filePathRelative":"dotnet/dotnet core/api interface.md"}');export{c as comp,p as data};
