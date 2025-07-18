import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as n,o as i,b as d}from"./app-BeHCP7Xm.js";const s={},t=d(`<h2 id="日志记录、事件和诊断" tabindex="-1"><a class="header-anchor" href="#日志记录、事件和诊断"><span>日志记录、事件和诊断</span></a></h2><h3 id="简单日志记录" tabindex="-1"><a class="header-anchor" href="#简单日志记录"><span>简单日志记录</span></a></h3><p>简单日志记录是EF Core提供的一种<strong>快速、开箱即用的日志输出方式</strong>，用于开发者在<strong>调试阶段</strong>方便地查看 EF Core 的行为（如 SQL 执行、跟踪状态、模型验证等）。它使用的是 <code>.NET 的日志记录系统（ILogger）</code>，但不需要复杂配置，<strong>一行代码即可启用</strong>。</p><h4 id="使用方法" tabindex="-1"><a class="header-anchor" href="#使用方法"><span>使用方法</span></a></h4><p>EF Core 提供了一个名为 <code>LogTo()</code> 的扩展方法，可以直接在 <code>DbContextOptionsBuilder</code> 上使用，将 EF Core 的内部日志输出到你指定的任何 <code>Action&lt;string&gt;</code> 方法。最常见的用法是输出到控制台。</p><p><strong>语法：</strong></p><div class="language-C# line-numbers-mode" data-ext="C#" data-title="C#"><pre class="language-C#"><code>public virtual DbContextOptionsBuilder LogTo (Action&lt;string&gt; writer,
                                             LogLevel minimumLevel = LogLevel.Debug,
                                             DbContextLoggerOptions options = DbContextLoggerOptions.None);

public virtual DbContextOptionsBuilder LogTo (Action&lt;string&gt; writer,
                                             IEnumerable&lt;string&gt; categories,
                                             LogLevel minimumLevel = LogLevel.Debug,
                                             DbContextLoggerOptions options = DbContextLoggerOptions.None);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong><code>writer</code></strong> (<code>Action&lt;string&gt;</code>)：一个委托，用于接收 EF Core 生成的日志字符串。最常用的是 <code>Console.WriteLine</code> 或 <code>Debug.WriteLine</code>。</p><p><strong><code>minimumLevel</code></strong> (<code>LogLevel</code>)：指定要记录的最低日志级别。只有级别等于或高于此值的消息才会被记录。常见的级别有：</p><ul><li><code>Trace</code> (最详细)</li><li><code>Debug</code></li><li><code>Information</code> (默认 SQL 查询在此级别)</li><li><code>Warning</code></li><li><code>Error</code></li><li><code>Critical</code> (最不详细)</li></ul><p><strong><code>categories</code></strong> (<code>IEnumerable&lt;string&gt;</code>)：可选参数，用于指定要记录的日志类别。这允许你过滤掉不关心的日志信息，只关注特定类型的事件（例如，只看 SQL 命令）。常见的类别在 <code>Microsoft.EntityFrameworkCore.DbLoggerCategory</code> 类中定义，例如：</p><ul><li><code>DbLoggerCategory.Database.Command.Name</code>：此类别包含实际执行的 SQL 命令。</li><li><code>DbLoggerCategory.Query.Name</code>：此类别包含 LINQ 查询如何被翻译的信息。</li></ul><p><strong><code>options</code></strong> (<code>DbContextLoggerOptions</code>)：可选参数，提供额外的日志选项，例如 <code>EnableSensitiveDataLogging</code>。</p><p><strong>使用示例：</strong></p><p>通常在 <code>DbContext</code> 类的 <code>OnConfiguring</code> 方法中配置简单日志记录。</p><p><strong>示例1：将所有信息级别以上的日志记录输出到控制台</strong></p><div class="language-C# line-numbers-mode" data-ext="C#" data-title="C#"><pre class="language-C#"><code>using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging; // 引入此命名空间

public class Blog
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class MyDbContext : DbContext
{
    public DbSet&lt;Blog&gt; Blogs { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder
            .UseSqlServer(&quot;YourConnectionString&quot;)
            // 将所有 Information 级别及以上的日志输出到控制台
            .LogTo(Console.WriteLine, LogLevel.Information);
    }
}

public async Task PerformSimpleQuery()
{
    using (var context = new MyDbContext())
    {
        // 这将触发一个 SQL SELECT 查询，其信息会输出到控制台
        var blogs = await context.Blogs.ToListAsync();
        Console.WriteLine($&quot;Found {blogs.Count} blogs.&quot;);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当你运行 <code>PerformSimpleQuery</code> 方法时，你会在控制台看到类似以下的输出（取决于你的数据库和具体操作）：</p><div class="language-C# line-numbers-mode" data-ext="C#" data-title="C#"><pre class="language-C#"><code>info: Microsoft.EntityFrameworkCore.Database.Command[20100]
      Executed DbCommand (1ms) [Parameters=[], CommandType=&#39;Text&#39;, CommandTimeout=&#39;30&#39;]
      SELECT [b].[Id], [b].[Name]
      FROM [Blogs] AS [b]
Found X blogs.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这清楚地显示了 EF Core 执行的 SQL 查询。</p><p><strong>示例2：只记录SQL命令，并启用敏感数据日志</strong></p><p>如果你想看到查询的参数值（例如，<code>WHERE Id = 1</code> 中的 <code>1</code>），你需要启用敏感数据日志。</p><div class="hint-container warning"><p class="hint-container-title">注意</p><p>生产环境慎用！</p></div><div class="language-C# line-numbers-mode" data-ext="C#" data-title="C#"><pre class="language-C#"><code>using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq; // for FirstOrDefaultAsync

public class MyDbContextWithSensitiveLogging : DbContext
{
    public DbSet&lt;Blog&gt; Blogs { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder
            .UseSqlServer(&quot;YourConnectionString&quot;)
            // 只记录 Database.Command 类别的信息日志
            .LogTo(Console.WriteLine, new[] { DbLoggerCategory.Database.Command.Name }, LogLevel.Information)
            // 启用敏感数据日志，这会显示 SQL 参数值
            .EnableSensitiveDataLogging();
    }
}

public async Task PerformQueryWithParameters()
{
    using (var context = new MyDbContextWithSensitiveLogging())
    {
        var blogId = 1;
        var blog = await context.Blogs.FirstOrDefaultAsync(b =&gt; b.Id == blogId);
        if (blog != null)
        {
            Console.WriteLine($&quot;Found blog: {blog.Name}&quot;);
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时，控制台输出可能包含参数值：</p><div class="language-C# line-numbers-mode" data-ext="C#" data-title="C#"><pre class="language-C#"><code>info: Microsoft.EntityFrameworkCore.Database.Command[20100]
      Executed DbCommand (1ms) [Parameters=[@__blogId_0=&#39;1&#39;], CommandType=&#39;Text&#39;, CommandTimeout=&#39;30&#39;]
      SELECT TOP(1) [b].[Id], [b].[Name]
      FROM [Blogs] AS [b]
      WHERE [b].[Id] = @__blogId_0
Found blog: ...
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>示例3：输出到调试窗口</strong></p><p>如果你在 Visual Studio 中开发，并希望日志输出到“输出”窗口的“调试”部分，可以使用 <code>Debug.WriteLine</code>。</p><div class="language-C# line-numbers-mode" data-ext="C#" data-title="C#"><pre class="language-C#"><code>using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Diagnostics; // 引入此命名空间

public class MyDbContextWithDebugLogging : DbContext
{
    public DbSet&lt;Blog&gt; Blogs { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder
            .UseSqlServer(&quot;YourConnectionString&quot;)
            // 输出到调试窗口
            .LogTo(message =&gt; Debug.WriteLine(message), LogLevel.Information);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="优缺点" tabindex="-1"><a class="header-anchor" href="#优缺点"><span>优缺点</span></a></h4><p><strong>优点</strong></p><ul><li><strong>配置简单</strong>：只需一行代码即可启用，无需额外的包或复杂的配置。</li><li><strong>快速调试</strong>：非常适合在开发过程中快速查看生成的 SQL 或诊断基本问题。</li><li><strong>低开销</strong>：对于简单的需求，其开销相对较低。</li></ul><p><strong>缺点</strong></p><ul><li><strong>功能有限</strong>： <ul><li>不支持日志滚动、文件大小限制等高级文件日志功能。</li><li>不支持结构化日志（JSON、XML），难以被日志分析工具解析。</li><li>无法轻松地与现有的日志框架（如 Serilog、NLog、log4net）集成。</li><li>不适用于生产环境中的全面日志监控。</li></ul></li><li><strong>不适合生产</strong>：在生产环境中，你通常需要更健壮、可配置和可扩展的日志解决方案，例如结合 <code>Microsoft.Extensions.Logging</code> 和一个成熟的日志提供程序（如 Application Insights、Seq、ELK Stack）。</li></ul><h4 id="与microsoft-extensions-logging的关系" tabindex="-1"><a class="header-anchor" href="#与microsoft-extensions-logging的关系"><span>与<code>Microsoft.Extensions.Logging</code>的关系</span></a></h4><p><code>LogTo()</code> 方法实际上是 <code>Microsoft.Extensions.Logging</code> 抽象的一个简化包装。在内部，它仍然使用 <code>Microsoft.Extensions.Logging</code>。如果你在 ASP.NET Core 应用程序中，或者已经使用了 <code>Microsoft.Extensions.Logging</code> 进行全面的日志配置，那么通常<strong>不需要</strong>再显式使用 <code>LogTo()</code>。你应该通过配置 <code>appsettings.json</code> 来控制 <code>Microsoft.EntityFrameworkCore</code> 类别的日志级别。</p><p>例如，在<code>appsettings.json</code>中，可以这样配置来显示 EF Core 的 SQL 命令：</p><div class="language-JSON line-numbers-mode" data-ext="JSON" data-title="JSON"><pre class="language-JSON"><code>{
  &quot;Logging&quot;: {
    &quot;LogLevel&quot;: {
      &quot;Default&quot;: &quot;Information&quot;,
      &quot;Microsoft.EntityFrameworkCore.Database.Command&quot;: &quot;Information&quot; // 显示 SQL 命令
    }
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="microsoft-extensions-logging" tabindex="-1"><a class="header-anchor" href="#microsoft-extensions-logging"><span><code>Microsoft.Extensions.Logging</code></span></a></h3><h4 id="定义" tabindex="-1"><a class="header-anchor" href="#定义"><span>定义</span></a></h4><p><code>Microsoft.Extensions.Logging</code> 是 .NET 的<strong>官方日志记录抽象库</strong>。<br> EF Core 并没有自己实现日志系统，而是直接基于这个标准库。</p><p>也就是说： EF Core 的所有日志，最终都是通过 ILogger 写出去的。</p><h4 id="日志级别" tabindex="-1"><a class="header-anchor" href="#日志级别"><span>日志级别</span></a></h4><p>日志级别用于指示日志消息的重要性或严重性。它们从最不重要到最重要排序：</p><ul><li><strong><code>Trace</code> (跟踪)</strong>：最详细的日志，通常包含敏感数据。</li><li><strong><code>Debug</code> (调试)</strong>：调试信息和生产诊断所需的值。</li><li><strong><code>Information</code> (信息)</strong>：一般流程和事件的记录。EF Core 的 SQL 命令默认在此级别。</li><li><strong><code>Warning</code> (警告)</strong>：应用程序中可能导致问题或不正常的事件。</li><li><strong><code>Error</code> (错误)</strong>：当前操作失败，但应用程序可能继续运行。</li><li><strong><code>Critical</code> (严重)</strong>：应用程序或系统崩溃或需要立即关注的事件。</li><li><strong><code>None</code> (无)</strong>：不记录任何消息。</li></ul><h4 id="日志类别" tabindex="-1"><a class="header-anchor" href="#日志类别"><span>日志类别</span></a></h4><p>日志类别通常是执行日志记录的类的<strong>完全限定名称</strong>。它们用于对日志消息进行分组和过滤。EF Core 使用自己的特定类别来组织其日志输出。</p><p>例如：</p><ul><li><code>Microsoft.EntityFrameworkCore</code>：EF Core 核心日志。</li><li><code>Microsoft.EntityFrameworkCore.Database.Command</code>：实际执行的 SQL 命令。</li><li><code>Microsoft.EntityFrameworkCore.Query</code>：LINQ 查询的翻译过程。</li><li><code>Microsoft.EntityFrameworkCore.Update</code>：<code>SaveChanges</code> 过程的详细信息。</li></ul><h4 id="日志提供程序" tabindex="-1"><a class="header-anchor" href="#日志提供程序"><span>日志提供程序</span></a></h4><p>日志提供程序是实际将日志消息写入特定目标（如控制台、文件、数据库等）的组件。<code>Microsoft.Extensions.Logging</code> 默认提供了多种内置提供程序：</p><ul><li><strong>Console (控制台)</strong>：将日志输出到控制台。</li><li><strong>Debug (调试窗口)</strong>：将日志输出到调试窗口（如 Visual Studio 的“输出”窗口）。</li><li><strong>EventSource / EventLog (事件源 / 事件日志)</strong>：将日志写入 Windows 事件日志或 EventSource。</li><li><strong>Azure App Services Diagnostics (Azure 应用服务诊断)</strong>：用于 Azure 应用服务。</li></ul><p>你也可以集成第三方的日志提供程序，如：</p><ul><li><strong>Serilog</strong>：功能强大的结构化日志框架，支持多种接收器 (sinks)。</li><li><strong>NLog</strong>：另一个流行的日志框架，功能丰富。</li></ul><h4 id="配置microsoft-extensions-logging" tabindex="-1"><a class="header-anchor" href="#配置microsoft-extensions-logging"><span>配置<code>Microsoft.Extensions.Logging</code></span></a></h4><p>日志通常在 <code>Program.cs</code> 中进行配置，通过依赖注入系统管理 <code>ILoggerFactory</code> 和 <code>ILogger</code> 实例。</p><h5 id="appsettings-json" tabindex="-1"><a class="header-anchor" href="#appsettings-json"><span><code>appsettings.json</code></span></a></h5><p>在 <code>appsettings.json</code> 文件中配置日志级别和类别：</p><div class="language-JSON line-numbers-mode" data-ext="JSON" data-title="JSON"><pre class="language-JSON"><code>{
  &quot;Logging&quot;: {
    &quot;LogLevel&quot;: {
      &quot;Default&quot;: &quot;Information&quot;, // 默认日志级别
      &quot;Microsoft.AspNetCore&quot;: &quot;Warning&quot;, // ASP.NET Core 相关日志级别
      &quot;Microsoft.EntityFrameworkCore&quot;: &quot;Information&quot;, // EF Core 的所有日志级别
      &quot;Microsoft.EntityFrameworkCore.Database.Command&quot;: &quot;Information&quot; // 特别是 EF Core 生成的 SQL 命令，设置为 Information 以显示
    },
    &quot;Console&quot;: { // 控制台日志提供程序的配置
      &quot;IncludeScopes&quot;: false
    },
    &quot;Debug&quot;: { // 调试窗口日志提供程序的配置
      &quot;IncludeScopes&quot;: false
    }
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="program-cs" tabindex="-1"><a class="header-anchor" href="#program-cs"><span><code>Program.cs</code></span></a></h5><p>通过 <code>Host.CreateDefaultBuilder</code> 来配置日志。</p><div class="language-CS line-numbers-mode" data-ext="CS" data-title="CS"><pre class="language-CS"><code>// Program.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging; // 确保引用

public class Program
{
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =&gt;
        Host.CreateDefaultBuilder(args)
            .ConfigureLogging(logging =&gt;
            {
                // 清除所有默认的日志提供程序（可选，如果你想完全控制）
                // logging.ClearProviders();

                // 添加控制台日志提供程序
                logging.AddConsole();
                // 添加调试窗口日志提供程序
                logging.AddDebug();

                // 在开发环境，你可能希望启用敏感数据日志和详细错误
                // 注意：在生产环境禁用这些！
                #if DEBUG // 仅在调试构建中启用
                logging.AddFilter(&quot;Microsoft.EntityFrameworkCore.Database.Command&quot;, LogLevel.Information); // 确保 SQL 命令在调试模式下可见
                #endif
            })
            .ConfigureServices((hostContext, services) =&gt;
            {
                services.AddDbContext&lt;MyDbContext&gt;(options =&gt;
                {
                    options.UseSqlServer(hostContext.Configuration.GetConnectionString(&quot;DefaultConnection&quot;));

                    // 仅在开发环境或调试时启用敏感数据日志和详细错误
                    // 这与 LogTo() 中的 .EnableSensitiveDataLogging() 作用相同
                    if (hostContext.HostingEnvironment.IsDevelopment())
                    {
                        options.EnableSensitiveDataLogging();
                        options.EnableDetailedErrors();
                    }
                });
                // ... 其他服务
            });
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="在控制器或服务中使用ilogger" tabindex="-1"><a class="header-anchor" href="#在控制器或服务中使用ilogger"><span>在控制器或服务中使用<code>ILogger</code></span></a></h5><p>一旦配置好 <code>Microsoft.Extensions.Logging</code>，你可以在任何需要日志记录的类中通过依赖注入获取 <code>ILogger&lt;T&gt;</code> 实例：</p><div class="language-CS line-numbers-mode" data-ext="CS" data-title="CS"><pre class="language-CS"><code>using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

public class MyService
{
    private readonly MyDbContext _context;
    private readonly ILogger&lt;MyService&gt; _logger; // 注入 ILogger

    public MyService(MyDbContext context, ILogger&lt;MyService&gt; logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task&lt;List&lt;Blog&gt;&gt; GetAllBlogs()
    {
        _logger.LogInformation(&quot;Attempting to retrieve all blogs.&quot;); // 记录自定义信息日志

        var blogs = await _context.Blogs.ToListAsync();

        _logger.LogDebug($&quot;Retrieved {blogs.Count} blogs from the database.&quot;); // 记录调试日志

        return blogs;
    }

    public async Task AddNewBlog(string name)
    {
        try
        {
            var newBlog = new Blog { Name = name };
            _context.Blogs.Add(newBlog);
            await _context.SaveChangesAsync();
            _logger.LogInformation($&quot;Successfully added new blog: {name} with ID: {newBlog.Id}&quot;);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $&quot;Error adding new blog: {name}&quot;); // 记录错误日志，并包含异常信息
            throw;
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过<code>ILogger&lt;T&gt;</code>，可以使用各种扩展方法（<code>LogTrace</code>、<code>LogDebug</code>、<code>LogInformation</code>、<code>LogWarning</code>、<code>LogError</code>、<code>LogCritical</code>）来记录不同级别的日志。</p><h4 id="enablesensitivedatalogging-和-enabledetailederrors" tabindex="-1"><a class="header-anchor" href="#enablesensitivedatalogging-和-enabledetailederrors"><span><code>EnableSensitiveDataLogging()</code> 和 <code>EnableDetailedErrors()</code></span></a></h4><p><strong><code>options.EnableSensitiveDataLogging()</code></strong>：</p><ul><li><strong>作用</strong>：让 EF Core 在日志中包含查询参数的实际值。例如，<code>WHERE Id = @p0</code> 会变成 <code>WHERE Id = 123</code>。</li><li><strong>风险</strong>：如果参数包含用户密码、信用卡号等敏感信息，这些信息将写入日志，造成安全漏洞。</li><li><strong>最佳实践</strong>：<strong>仅在开发和调试环境中使用</strong>。在生产环境中，始终禁用此功能。</li></ul><p><strong><code>options.EnableDetailedErrors()</code></strong>：</p><ul><li><strong>作用</strong>：当 EF Core 遇到错误时，提供更详细的错误信息，这对于诊断问题非常有帮助。例如，如果查询失败，它可能会提供更多关于为什么无法翻译查询的细节。</li><li><strong>最佳实践</strong>：在开发和测试环境中启用。在生产环境中，你可能希望捕获更通用的错误信息，并避免将过多的内部细节暴露给日志，尽管这通常比敏感数据日志的风险低。</li></ul><h3 id="事件" tabindex="-1"><a class="header-anchor" href="#事件"><span>事件</span></a></h3><p><strong>事件</strong>提供了一种机制，让你能够在数据保存生命周期的特定时刻插入自定义逻辑。它们就像是钩子，允许你在 EF Core 执行某些操作之前或之后运行自己的代码。</p><p>EF Core 并没有使用传统的 .NET 事件（如 <code>event</code> 关键字），<br> 而是基于 <code>DiagnosticSource</code> 与 .NET 的观察者模式（<code>IObserver&lt;T&gt;</code>）来<strong>发布运行时事件</strong>。</p><h4 id="事件类型" tabindex="-1"><a class="header-anchor" href="#事件类型"><span>事件类型</span></a></h4><ol><li><strong><code>DbContext</code> 上的传统 .NET 事件</strong>：<code>SavingChanges</code> 和 <code>SavedChanges</code>。</li><li><strong>拦截器 (Interceptors)</strong>：EF Core 5.0 引入的更强大、更灵活的事件机制。</li></ol><h5 id="dbcontext-上的传统-net-事件" tabindex="-1"><a class="header-anchor" href="#dbcontext-上的传统-net-事件"><span><code>DbContext</code> 上的传统 .NET 事件</span></a></h5><p><code>DbContext</code> 类本身提供了两个直接的 .NET 事件，你可以像订阅任何普通 .NET 事件一样订阅它们。</p><ul><li><strong><code>SavingChanges</code> 事件</strong>： <ul><li><strong>触发时机</strong>：在 <code>SaveChanges()</code> 或 <code>SaveChangesAsync()</code> <strong>开始执行之前</strong>触发。</li><li><strong>用途</strong>：最常用于在数据被发送到数据库之前进行<strong>预处理</strong>。例如，自动填充审计字段、执行业务验证或实现软删除逻辑。</li><li><strong>事件参数</strong>：<code>SavingChangesEventArgs</code>。你可以通过 <code>context.ChangeTracker.Entries()</code> 访问所有当前被跟踪的实体及其状态。</li><li><strong>可取消</strong>：你可以设置 <code>SavingChangesEventArgs.Cancel = true</code> 来取消当前的 <code>SaveChanges</code> 操作。</li></ul></li><li><strong><code>SavedChanges</code> 事件</strong>： <ul><li><strong>触发时机</strong>：在 <code>SaveChanges()</code> 或 <code>SaveChangesAsync()</code> <strong>成功完成之后</strong>触发。</li><li><strong>用途</strong>：最常用于在数据持久化后执行<strong>后续操作</strong>。例如，更新缓存、发布领域事件、或进行日志记录。</li><li><strong>事件参数</strong>：<code>SavedChangesEventArgs</code>，它包含了受影响的实体数量 (<code>EntitiesSavedCount</code>)。</li></ul></li></ul><p><strong>示例：订阅并使用<code>SavingChanges</code>和<code>SavedChanges</code></strong></p><div class="language-CS line-numbers-mode" data-ext="CS" data-title="CS"><pre class="language-CS"><code>using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking; // For EntityEntry

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastModifiedDate { get; set; }
    public bool IsDeleted { get; set; } // 用于软删除
}

public class MyDbContext : DbContext
{
    public DbSet&lt;Product&gt; Products { get; set; } = null!;

    public MyDbContext(DbContextOptions&lt;MyDbContext&gt; options) : base(options)
    {
        // 在 DbContext 构造函数中订阅事件
        // SavingChanges 事件处理程序
        SavingChanges += (sender, args) =&gt;
        {
            Console.WriteLine(&quot;--- SavingChanges Event Fired ---&quot;);
            var context = (MyDbContext)sender!;

            foreach (var entry in context.ChangeTracker.Entries())
            {
                if (entry.Entity is Product product) // 确保是 Product 实体
                {
                    switch (entry.State)
                    {
                        case EntityState.Added:
                            product.CreatedDate = DateTime.UtcNow;
                            Console.WriteLine($&quot;  Product &#39;{product.Name}&#39; (ID: {product.Id}) is being Added. Setting CreatedDate.&quot;);
                            break;
                        case EntityState.Modified:
                            product.LastModifiedDate = DateTime.UtcNow;
                            Console.WriteLine($&quot;  Product &#39;{product.Name}&#39; (ID: {product.Id}) is being Modified. Setting LastModifiedDate.&quot;);
                            break;
                        case EntityState.Deleted:
                            // 实现软删除逻辑：
                            // 如果是删除操作，将其状态改为 Modified，并设置 IsDeleted 为 true
                            if (!product.IsDeleted) // 避免重复标记
                            {
                                entry.State = EntityState.Modified; // 更改状态为 Modified
                                product.IsDeleted = true; // 设置软删除标记
                                Console.WriteLine($&quot;  Product &#39;{product.Name}&#39; (ID: {product.Id}) intercepted for Soft Delete.&quot;);
                            }
                            break;
                    }
                }
            }
            Console.WriteLine(&quot;--- End SavingChanges Event ---&quot;);
        };

        // SavedChanges 事件处理程序
        SavedChanges += (sender, args) =&gt;
        {
            Console.WriteLine($&quot;--- SavedChanges Event Fired ---&quot;);
            Console.WriteLine($&quot;  {args.EntitiesSavedCount} entities successfully saved to database.&quot;);
            Console.WriteLine(&quot;--- End SavedChanges Event ---&quot;);
        };
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(&quot;YourConnectionString&quot;);
    }
}

public async Task PerformProductOperations()
{
    using (var context = new MyDbContext(new DbContextOptionsBuilder&lt;MyDbContext&gt;().UseSqlServer(&quot;YourConnectionString&quot;).Options))
    {
        // 添加一个新产品
        var newProduct = new Product { Name = &quot;New Widget&quot;, Price = 25.00m };
        context.Products.Add(newProduct);
        Console.WriteLine(&quot;\\n--- Saving New Product ---&quot;);
        await context.SaveChangesAsync();
        Console.WriteLine(&quot;New Product saved.\\n&quot;);

        // 修改一个产品
        var existingProduct = await context.Products.FirstAsync();
        existingProduct.Price = 30.00m;
        Console.WriteLine(&quot;\\n--- Saving Modified Product ---&quot;);
        await context.SaveChangesAsync();
        Console.WriteLine(&quot;Modified Product saved.\\n&quot;);

        // 删除一个产品 (会被软删除)
        context.Products.Remove(existingProduct);
        Console.WriteLine(&quot;\\n--- Saving Deleted Product (Soft Delete) ---&quot;);
        await context.SaveChangesAsync();
        Console.WriteLine(&quot;Deleted Product saved (soft deleted).\\n&quot;);

        // 验证软删除
        var deletedProduct = await context.Products.AsNoTracking().FirstOrDefaultAsync(p =&gt; p.Id == existingProduct.Id);
        Console.WriteLine($&quot;\\nIs product {deletedProduct?.Name} soft deleted? {deletedProduct?.IsDeleted}&quot;); // Should be True
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>传统事件的优缺点</strong></p><ul><li><strong>优点</strong>： <ul><li><strong>简单易用</strong>：对于简单的事件处理，直接订阅 <code>DbContext</code> 上的事件非常直观。</li><li><strong>直接访问 <code>DbContext</code></strong>：事件处理器可以直接访问触发事件的 <code>DbContext</code> 实例及其变更跟踪器。</li></ul></li><li><strong>缺点</strong>： <ul><li><strong>侵入性</strong>：你需要在 <code>DbContext</code> 派生类的构造函数中订阅这些事件，这可能会使 <code>DbContext</code> 类变得臃肿，并与业务逻辑耦合。</li><li><strong>难以复用</strong>：如果你有多个 <code>DbContext</code> 类型或需要在多个应用程序中使用相同的事件处理逻辑，复用性较差。</li><li><strong>同步限制</strong>：这些事件本质上是同步的，尽管你可以在处理器中调用异步方法，但事件本身不会等待这些异步操作完成，可能会导致意外行为。</li></ul></li></ul><h5 id="拦截器" tabindex="-1"><a class="header-anchor" href="#拦截器"><span>拦截器</span></a></h5><h6 id="定义-1" tabindex="-1"><a class="header-anchor" href="#定义-1"><span>定义</span></a></h6><p><strong>拦截器</strong>是 EF Core 5.0 引入的更强大、更推荐的事件处理机制。它们提供了一种非侵入式的方式，让你可以在 EF Core 操作的不同阶段插入自定义逻辑，并且设计得更易于复用和组合。</p><p>拦截器通过实现特定的接口来工作，例如：</p><table><thead><tr><th>接口名称</th><th>拦截对象</th><th>常见用途</th></tr></thead><tbody><tr><td><code>IDbCommandInterceptor</code></td><td>SQL 命令执行</td><td>捕捉执行前后、修改 SQL</td></tr><tr><td><code>ISaveChangesInterceptor</code></td><td>SaveChanges 执行前后</td><td>自动设置审计字段、阻止保存</td></tr><tr><td><code>IConnectionInterceptor</code></td><td>数据库连接打开/关闭</td><td>捕捉连接时长、记录连接次数</td></tr><tr><td><code>IMaterializationInterceptor</code></td><td>实体实例化过程</td><td>控制对象创建、替换属性值</td></tr><tr><td><code>ITransactionInterceptor</code></td><td>数据库事务</td><td>捕捉事务开始/提交/回滚</td></tr><tr><td><code>IQueryExpressionInterceptor</code></td><td>查询表达式树</td><td>修改 LINQ 表达式（高阶用法）</td></tr></tbody></table><p>每个拦截器接口都提供了多个方法，对应着操作的同步和异步版本，以及操作前 (<code>-ing</code>) 和操作后 (<code>-ed</code>) 的钩子。</p><h6 id="使用步骤" tabindex="-1"><a class="header-anchor" href="#使用步骤"><span>使用步骤</span></a></h6><ol><li>创建一个拦截器类</li></ol><div class="language-CS line-numbers-mode" data-ext="CS" data-title="CS"><pre class="language-CS"><code>public class MyCommandInterceptor : DbCommandInterceptor
{
    public override InterceptionResult&lt;DbDataReader&gt; ReaderExecuting(
        DbCommand command,
        CommandEventData eventData,
        InterceptionResult&lt;DbDataReader&gt; result)
    {
        Console.WriteLine($&quot;[拦截器] 正在执行 SQL: {command.CommandText}&quot;);
        return base.ReaderExecuting(command, eventData, result);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以重写：</p><ul><li><code>ReaderExecuting</code>：执行 SELECT 时触发</li><li><code>NonQueryExecuting</code>：执行 INSERT/UPDATE/DELETE 时触发</li><li><code>ScalarExecuting</code>：执行返回单值的 SQL（如 COUNT）</li></ul><ol start="2"><li>将拦截器注册到DbContext</li></ol><p>在 <code>Program.cs</code> 或 <code>DbContext</code> 注册：</p><div class="language-CS line-numbers-mode" data-ext="CS" data-title="CS"><pre class="language-CS"><code>builder.Services.AddDbContext&lt;AppDbContext&gt;(options =&gt;
{
    options
        .UseSqlServer(&quot;your-connection-string&quot;)
        .AddInterceptors(new MyCommandInterceptor());
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="示例" tabindex="-1"><a class="header-anchor" href="#示例"><span>示例</span></a></h6><p><strong>记录SQL执行时间：</strong></p><div class="language-CS line-numbers-mode" data-ext="CS" data-title="CS"><pre class="language-CS"><code>public class TimingInterceptor : DbCommandInterceptor
{
    private readonly Stopwatch _stopwatch = new();

    public override InterceptionResult&lt;int&gt; NonQueryExecuting(
        DbCommand command,
        CommandEventData eventData,
        InterceptionResult&lt;int&gt; result)
    {
        _stopwatch.Restart();
        return base.NonQueryExecuting(command, eventData, result);
    }

    public override int NonQueryExecuted(
        DbCommand command,
        CommandExecutedEventData eventData,
        int result)
    {
        _stopwatch.Stop();
        Console.WriteLine($&quot;[执行耗时] {command.CommandText} =&gt; {_stopwatch.ElapsedMilliseconds}ms&quot;);
        return base.NonQueryExecuted(command, eventData, result);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>自动添加创建时间：</strong></p><div class="language-CS line-numbers-mode" data-ext="CS" data-title="CS"><pre class="language-CS"><code>public class AuditSaveChangesInterceptor : SaveChangesInterceptor
{
    public override ValueTask&lt;InterceptionResult&lt;int&gt;&gt; SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult&lt;int&gt; result,
        CancellationToken cancellationToken = default)
    {
        var context = eventData.Context;
        var entries = context.ChangeTracker.Entries()
            .Where(e =&gt; e.State == EntityState.Added &amp;&amp; e.Entity is IHasCreatedTime);

        foreach (var entry in entries)
        {
            ((IHasCreatedTime)entry.Entity).CreatedTime = DateTime.UtcNow;
        }

        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }
}

public interface IHasCreatedTime
{
    DateTime CreatedTime { get; set; }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p>使用 <code>ISaveChangesInterceptor</code> 实现审计和软删除</p><p>与之前使用传统事件的例子功能类似，但用拦截器实现。</p><div class="language-CS line-numbers-mode" data-ext="CS" data-title="CS"><pre class="language-CS"><code>using Microsoft.EntityFrameworkCore.Diagnostics; // 引入此命名空间

public class AuditSaveChangesInterceptor : ISaveChangesInterceptor
{
    // 同步 BeforeSave
    public InterceptionResult&lt;int&gt; SavingChanges(DbContextEventData eventData, InterceptionResult&lt;int&gt; result)
    {
        PerformAudit(eventData.Context!); // 调用异步方法，但这里是同步执行
        return result;
    }

    // 异步 BeforeSave
    public ValueTask&lt;InterceptionResult&lt;int&gt;&gt; SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult&lt;int&gt; result,
        CancellationToken cancellationToken = default)
    {
        PerformAudit(eventData.Context!);
        return new ValueTask&lt;InterceptionResult&lt;int&gt;&gt;(result);
    }

    // 同步 AfterSave
    public int SavedChanges(SaveChangesCompletedEventData eventData, int result)
    {
        Console.WriteLine($&quot;Interceptor: {eventData.EntitiesSaved} entities saved successfully.&quot;);
        return result;
    }

    // 异步 AfterSave
    public ValueTask&lt;int&gt; SavedChangesAsync(
        SaveChangesCompletedEventData eventData,
        int result,
        CancellationToken cancellationToken = default)
    {
        Console.WriteLine($&quot;Interceptor Async: {eventData.EntitiesSaved} entities saved successfully.&quot;);
        return new ValueTask&lt;int&gt;(result);
    }

    // 辅助方法，包含核心逻辑
    private void PerformAudit(DbContext context)
    {
        Console.WriteLine(&quot;--- Interceptor: SavingChanges Event ---&quot;);
        foreach (var entry in context.ChangeTracker.Entries())
        {
            if (entry.Entity is Product product)
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        product.CreatedDate = DateTime.UtcNow;
                        Console.WriteLine($&quot;  Interceptor: Product &#39;{product.Name}&#39; is being Added. Setting CreatedDate.&quot;);
                        break;
                    case EntityState.Modified:
                        product.LastModifiedDate = DateTime.UtcNow;
                        Console.WriteLine($&quot;  Interceptor: Product &#39;{product.Name}&#39; is being Modified. Setting LastModifiedDate.&quot;);
                        break;
                    case EntityState.Deleted:
                        if (!product.IsDeleted)
                        {
                            entry.State = EntityState.Modified; // 更改状态为 Modified
                            product.IsDeleted = true; // 设置软删除标记
                            Console.WriteLine($&quot;  Interceptor: Product &#39;{product.Name}&#39; intercepted for Soft Delete.&quot;);
                        }
                        break;
                }
            }
        }
        Console.WriteLine(&quot;--- Interceptor: End SavingChanges Event ---&quot;);
    }

    // 其他 ISaveChangesInterceptor 接口方法（这里省略，通常返回 result）
    public void SaveChangesFailed(DbContextErrorEventData eventData) { }
    public ValueTask SaveChangesFailedAsync(DbContextErrorEventData eventData, CancellationToken cancellationToken = default) =&gt; ValueTask.CompletedTask;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>注册拦截器</strong></p><p>需要在 <code>DbContext</code> 配置时注册拦截器。</p><div class="language-CS line-numbers-mode" data-ext="CS" data-title="CS"><pre class="language-CS"><code>// 在 DbContext.OnConfiguring 中注册
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    optionsBuilder
        .UseSqlServer(&quot;YourConnectionString&quot;)
        .AddInterceptors(new AuditSaveChangesInterceptor()); // 注册拦截器实例
}

// 在 ASP.NET Core Startup.cs/Program.cs 中注册 (更常见)
public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton&lt;AuditSaveChangesInterceptor&gt;(); // 拦截器本身可以作为单例服务
    services.AddDbContext&lt;MyDbContext&gt;(options =&gt;
    {
        options.UseSqlServer(&quot;YourConnectionString&quot;)
               .AddInterceptors(services.GetRequiredService&lt;AuditSaveChangesInterceptor&gt;()); // 从 DI 获取并注册
    });
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="侦听器" tabindex="-1"><a class="header-anchor" href="#侦听器"><span>侦听器</span></a></h3><p>“侦听器”允许你在 EF Core 的内部操作执行过程中的特定点<strong>拦截、修改甚至阻止</strong>这些操作。</p><h4 id="作用" tabindex="-1"><a class="header-anchor" href="#作用"><span>作用</span></a></h4><p><strong>命令 (Command) 拦截：</strong> 在执行数据库命令之前、之后或执行失败时进行拦截。这是最常用的拦截类型。</p><ul><li><p><strong>用途：</strong></p></li><li><p><strong>记录 SQL 日志：</strong> 捕获并记录 EF Core 生成的所有 SQL 语句。</p></li><li><p><strong>修改 SQL：</strong> 动态地修改将要执行的 SQL 命令，例如为所有查询自动添加 <code>WHERE TenantId = @p0</code> 来实现多租户。</p></li><li><p><strong>模拟命令执行结果：</strong> 不实际执行命令，而是直接返回一个预设的结果，非常适合用于测试。</p></li></ul><p><strong>连接 (Connection) 拦截：</strong> 在打开或关闭数据库连接时进行拦截。</p><p><strong>事务 (Transaction) 拦截：</strong> 在开始、提交、回滚或创建保存点时进行拦截。</p><p><strong>保存更改 (SaveChanges) 拦截：</strong> 在调用 <code>SaveChanges()</code> 的过程中进行拦截，允许你在实体状态改变或实际写入数据库前后执行逻辑。</p><ul><li><strong>用途：</strong><ul><li><strong>自动审计：</strong> 自动为实现了某个接口（如 <code>IAuditable</code>）的实体设置 <code>CreatedAt</code> 和 <code>UpdatedAt</code> 字段。</li><li><strong>软删除 (Soft Delete)：</strong> 拦截删除操作，将其转换为对 <code>IsDeleted</code> 标志位的更新操作。</li></ul></li></ul><h4 id="侦听器接口" tabindex="-1"><a class="header-anchor" href="#侦听器接口"><span>侦听器接口</span></a></h4><p>EF Core 提供了一系列接口，每个接口对应一种拦截类型。你通常不需要实现整个接口，而是可以继承自 EF Core 提供的基类（如 <code>SaveChangesInterceptor</code>, <code>DbCommandInterceptor</code>），然后只重写你感兴趣的方法。</p><table><thead><tr><th>接口名称</th><th>拦截对象</th><th>常见用途</th></tr></thead><tbody><tr><td><code>IDbCommandInterceptor</code></td><td>SQL 命令执行</td><td>捕捉执行前后、修改 SQL</td></tr><tr><td><code>ISaveChangesInterceptor</code></td><td>SaveChanges 执行前后</td><td>自动设置审计字段、阻止保存</td></tr><tr><td><code>IConnectionInterceptor</code></td><td>数据库连接打开/关闭</td><td>捕捉连接时长、记录连接次数</td></tr><tr><td><code>IMaterializationInterceptor</code></td><td>实体实例化过程</td><td>控制对象创建、替换属性值</td></tr><tr><td><code>ITransactionInterceptor</code></td><td>数据库事务</td><td>捕捉事务开始/提交/回滚</td></tr><tr><td><code>IQueryExpressionInterceptor</code></td><td>查询表达式树</td><td>修改 LINQ 表达式（高阶用法）</td></tr></tbody></table><blockquote><p>每个拦截方法通常都有同步和异步两个版本（例如 <code>ReaderExecuting</code> 和 <code>ReaderExecutingAsync</code>）。你应该根据你的代码是同步还是异步来重写对应的方法。</p></blockquote><h4 id="使用方式" tabindex="-1"><a class="header-anchor" href="#使用方式"><span>使用方式</span></a></h4><p>案例：实现自动审计日志（设置创建和更新时间）</p><h5 id="定义需要审计的实体接口" tabindex="-1"><a class="header-anchor" href="#定义需要审计的实体接口"><span>定义需要审计的实体接口</span></a></h5><div class="language-CS line-numbers-mode" data-ext="CS" data-title="CS"><pre class="language-CS"><code>public interface IAuditable
{
    DateTime CreatedAt { get; set; }
    DateTime UpdatedAt { get; set; }
}

// 你的实体类实现这个接口
public class Product : IAuditable
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="创建侦听器类" tabindex="-1"><a class="header-anchor" href="#创建侦听器类"><span>创建侦听器类</span></a></h5><p>创建一个继承自 <code>SaveChangesInterceptor</code> 的新类。</p><div class="language-CS line-numbers-mode" data-ext="CS" data-title="CS"><pre class="language-CS"><code>using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.ChangeTracking;

// 继承自 SaveChangesInterceptor
public class AuditableEntityInterceptor : SaveChangesInterceptor
{
    // 重写 SavingChangesAsync 方法，它在 SaveChangesAsync 执行时被调用
    public override InterceptionResult&lt;int&gt; SavingChanges(
        DbContextEventData eventData,
        InterceptionResult&lt;int&gt; result)
    {
        SetAuditProperties(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    // 同时重写异步版本
    public override ValueTask&lt;InterceptionResult&lt;int&gt;&gt; SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult&lt;int&gt; result,
        CancellationToken cancellationToken = default)
    {
        SetAuditProperties(eventData.Context);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private void SetAuditProperties(DbContext? dbContext)
    {
        if (dbContext == null) return;

        // 获取所有被跟踪的实体条目
        var entries = dbContext.ChangeTracker.Entries&lt;IAuditable&gt;();

        foreach (var entry in entries)
        {
            // 当实体被添加时
            if (entry.State == EntityState.Added)
            {
                entry.Property(p =&gt; p.CreatedAt).CurrentValue = DateTime.UtcNow;
                entry.Property(p =&gt; p.UpdatedAt).CurrentValue = DateTime.UtcNow;
            }
            // 当实体被修改时
            else if (entry.State == EntityState.Modified)
            {
                entry.Property(p =&gt; p.UpdatedAt).CurrentValue = DateTime.UtcNow;
            }
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="在dbcontext中注册侦听器" tabindex="-1"><a class="header-anchor" href="#在dbcontext中注册侦听器"><span>在<code>DbContext</code>中注册侦听器</span></a></h5><p>有两种主要方式来注册这个侦听器：</p><ul><li><p><strong>作为服务注册到DI容器【推荐】</strong></p><p>这种方式让你的侦听器可以享受依赖注入的好处，比如注入其他服务 (<code>ILogger</code>, <code>IHttpContextAccessor</code> 等)。</p><ol><li>将侦听器注册为服务(<code>Program.cs</code>)</li></ol><div class="language-CS line-numbers-mode" data-ext="CS" data-title="CS"><pre class="language-CS"><code>var builder = WebApplication.CreateBuilder(args);

// 将侦听器注册为 Scoped 服务
builder.Services.AddScoped&lt;AuditableEntityInterceptor&gt;();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li><strong>在 <code>AddDbContext</code> 中添加侦听器</strong> (<code>Program.cs</code>)</li></ol><div class="language-CS line-numbers-mode" data-ext="CS" data-title="CS"><pre class="language-CS"><code>builder.Services.AddDbContext&lt;ApplicationDbContext&gt;((serviceProvider, options) =&gt;
{
    // 从服务容器中解析侦听器
    var interceptor = serviceProvider.GetRequiredService&lt;AuditableEntityInterceptor&gt;();

    options.UseSqlServer(connectionString)
           .AddInterceptors(interceptor); // 添加侦听器
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong>直接在 <code>OnConfiguring</code> 中实例化和添加</strong></p><p>这种方式比较简单，但侦听器本身无法使用 DI。</p><div class="language-CS line-numbers-mode" data-ext="CS" data-title="CS"><pre class="language-CS"><code>// 在你的 DbContext 类中
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    optionsBuilder.AddInterceptors(new AuditableEntityInterceptor());
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h4 id="侦听器执行顺序与作用域" tabindex="-1"><a class="header-anchor" href="#侦听器执行顺序与作用域"><span>侦听器执行顺序与作用域</span></a></h4><p><strong>执行顺序：</strong> 如果你注册了多个相同类型的侦听器，它们会按照注册的顺序依次执行。</p><p><strong>作用域与生命周期：</strong></p><ul><li>当你使用 <code>AddDbContext</code>（非池化）时，侦听器通常和 <code>DbContext</code> 一样是 <code>Scoped</code> 的。</li><li>当你使用 <code>AddDbContextPool</code>（池化）时，情况就变得复杂了。如果你的侦听器是无状态的（像上面的 <code>AuditableEntityInterceptor</code>），你可以将其注册为<strong>单例 (Singleton)</strong> 以获得最佳性能。但如果你的侦听器需要持有请求级别的状态（例如，依赖 <code>IHttpContextAccessor</code>），你<strong>必须</strong>将其注册为 <code>Scoped</code>，并且在 <code>AddDbContextPool</code> 时要小心，因为池化的 <code>DbContext</code> 可能会跨越多个作用域，这可能导致侦听器状态不正确。对于有状态的侦听器，通常建议配合<strong>非池化</strong>的 <code>AddDbContext</code> 使用。</li></ul><h4 id="侦听器与拦截器" tabindex="-1"><a class="header-anchor" href="#侦听器与拦截器"><span>侦听器与拦截器</span></a></h4><table><thead><tr><th>对比维度</th><th>拦截器（Interceptor）</th><th>侦听器（Listener）</th></tr></thead><tbody><tr><td><strong>本质</strong></td><td>插入逻辑，<strong>修改/阻止</strong> 框架内部行为</td><td>被动监听，<strong>观察/记录</strong> 框架发出的事件</td></tr><tr><td><strong>是否能影响原始行为</strong></td><td>✅ 可以（如阻止数据库操作、修改命令）</td><td>❌ 不可以（只能记录或处理通知）</td></tr><tr><td><strong>典型实现方式</strong></td><td>实现如 <code>IDbCommandInterceptor</code> / <code>ISaveChangesInterceptor</code> 等接口</td><td>通过 <code>DiagnosticListener</code> + <code>IObserver</code> 等监听系统事件</td></tr><tr><td><strong>用途</strong></td><td>安全检查、日志审计、命令修改、行为替换</td><td>记录 SQL、性能分析、监控、调试</td></tr><tr><td><strong>EF Core 中的应用</strong></td><td>插入 SaveChanges、ExecuteCommand 等流程逻辑</td><td>监听 EF 内部事件（如执行 SQL、失败）</td></tr><tr><td><strong>ASP.NET Core 中的应用</strong></td><td>中间件、过滤器（Filter）、授权拦截器</td><td>日志系统、诊断源（如 ASP.NET Core 请求事件）</td></tr><tr><td><strong>运行时性能影响</strong></td><td>中等（可能增加处理逻辑）</td><td>极低（一般只读，不干预行为）</td></tr><tr><td><strong>是否支持异步操作</strong></td><td>✅ 支持异步拦截</td><td>✅ 支持异步事件侦听</td></tr><tr><td><strong>框架级别支持</strong></td><td>EF Core、ASP.NET Core、HttpClient、SignalR 等均提供拦截器接口</td><td>DiagnosticSource 是 .NET 系统性日志机制，广泛支持</td></tr></tbody></table><h2 id="诊断侦听器" tabindex="-1"><a class="header-anchor" href="#诊断侦听器"><span>诊断侦听器</span></a></h2><h3 id="定义-2" tabindex="-1"><a class="header-anchor" href="#定义-2"><span>定义</span></a></h3><p>这个概念比我们之前讨论的日志记录和拦截器要更底层一些。如果说日志记录是看「报表」，拦截器是当「检查员」，那么诊断侦听器就是直接在 EF Core 的「神经系统」上挂载一个「监听设备」。它能让你捕获到非常原始、非常核心的诊断事件。</p><p><code>DiagnosticListener</code> 是 .NET 提供的一种 <strong>发布/订阅（Pub/Sub）机制</strong>：</p><ul><li>EF Core 会将关键操作（如 SQL 执行、模型验证）以<strong>事件</strong>的形式“发布”出去；</li><li>我们可以通过 <code>DiagnosticListener</code> 注册一个“<strong>侦听器</strong>”，来<strong>监听这些事件并做出响应</strong>。</li></ul><table><thead><tr><th>特性</th><th>简单日志记录 (LogTo)</th><th>拦截器 (Interceptors)</th><th>诊断侦听器 (Diagnostic Listeners)</th></tr></thead><tbody><tr><td>抽象层级</td><td>高 (封装好的字串)</td><td>中 (强型别的物件和方法)</td><td>低 (原始事件名称和匿名负载)</td></tr><tr><td>主要目的</td><td>被动观察 (为了人类阅读)</td><td>主动干预 (为了改变行为)</td><td>被动观察 (为了机器处理/遥测)</td></tr><tr><td>能否修改行为</td><td>否</td><td>是 (可以修改、阻止、替换)</td><td>否</td></tr><tr><td>效能开销</td><td>中 (尤其在高 LogLevel 时)</td><td>中 (有方法呼叫和逻辑执行的开销)</td><td>低 (若无订阅者则开销极小)</td></tr><tr><td>典型用例</td><td>开发时快速调试 SQL</td><td>软删除、审计、多租户查询改写</td><td>整合 APM 工具 (如 Application Insights)、自订遥测、细粒度的效能分析</td></tr><tr><td>与 DI 整合</td><td>自动与 ILoggerFactory 整合</td><td>易于作为服务注册和注入</td><td>需要手动订阅，但观察者本身可以透过 DI 创建</td></tr></tbody></table><h3 id="使用方法-1" tabindex="-1"><a class="header-anchor" href="#使用方法-1"><span>使用方法</span></a></h3><ol><li><strong>创建一个观察者</strong></li></ol><p>你需要创建一个类，实现 <code>IObserver&lt;KeyValuePair&lt;string, object&gt;&gt;</code> 介面。这个观察者就是你的“监听设备”。</p><div class="language-CS line-numbers-mode" data-ext="CS" data-title="CS"><pre class="language-CS"><code>using System.Diagnostics;

public class MyEfCoreDiagnosticObserver : IObserver&lt;KeyValuePair&lt;string, object&gt;&gt;
{
    // 当没有更多事件时被呼叫（通常在应用程式关闭时）
    public void OnCompleted()
    {
        // 可选：执行清理工作
        Console.WriteLine(&quot;Diagnostic observer completed.&quot;);
    }

    // 当发生错误时被呼叫
    public void OnError(Exception error)
    {
        // 可选：记录错误
        Console.WriteLine($&quot;Diagnostic error: {error.Message}&quot;);
    }

    // 每当有新事件发布时，这个方法就会被呼叫
    public void OnNext(KeyValuePair&lt;string, object&gt; value)
    {
        // value.Key 是事件的名称
        // value.Value 是事件的负载 (payload)
        
        // 我们只对 EF Core 命令执行之前的事件感兴趣
        if (value.Key == &quot;Microsoft.EntityFrameworkCore.Database.Command.CommandExecuting&quot;)
        {
            // 从负载物件中提取资料
            // 注意：你需要知道负载物件有哪些属性，这通常需要查阅官方文件
            var command = GetProperty&lt;DbCommand&gt;(value.Value, &quot;Command&quot;);
            var context = GetProperty&lt;DbContext&gt;(value.Value, &quot;Context&quot;);

            if (command != null)
            {
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine($&quot;[Diagnostic Listener] Executing command: {command.CommandText}&quot;);
                Console.ResetColor();
            }
        }
    }

    // 一个辅助方法，用来安全地从匿名负载物件中获取属性
    private T? GetProperty&lt;T&gt;(object? payload, string propertyName)
    {
        return payload?.GetType().GetProperty(propertyName)?.GetValue(payload) as T;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li><strong>订阅 <code>DiagnosticListener</code></strong></li></ol><p>在你的应用程式启动时（例如 <code>Program.cs</code>），你需要找到 EF Core 的 <code>DiagnosticListener</code> 并把你的观察者订阅上去。</p><div class="language-CS line-numbers-mode" data-ext="CS" data-title="CS"><pre class="language-CS"><code>// 在 Program.cs 的某个地方

// 创建你的观察者实例
var myObserver = new MyEfCoreDiagnosticObserver();

// 订阅所有 .NET 的 DiagnosticSource 事件
DiagnosticListener.AllListeners.Subscribe(listener =&gt;
{
    // 我们只对名为 &quot;Microsoft.EntityFrameworkCore&quot; 的 listener 感兴趣
    if (listener.Name == &quot;Microsoft.EntityFrameworkCore&quot;)
    {
        // 将我们的观察者附加到这个 listener 上
        listener.Subscribe(myObserver);
    }
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>完成这两步后，每次 EF Core 执行一个资料库命令之前，<code>OnNext</code> 方法就会被触发，并印出黄色的 SQL 叙述。</p><ol start="3"><li><strong>应用启动时注册</strong></li></ol><p>在 <code>Program.cs</code> 或任意应用启动位置调用即可。</p><div class="language-CS line-numbers-mode" data-ext="CS" data-title="CS"><pre class="language-CS"><code>DiagnosticListener.AllListeners.Subscribe(new EfCoreDiagnosticSourceObserver());
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="关键事件名称" tabindex="-1"><a class="header-anchor" href="#关键事件名称"><span>关键事件名称</span></a></h3><p>EF Core 的事件名称都定义在 <code>DbLoggerCategory</code> 的子类别中。一些常见的事件前缀包括：</p><ul><li><code>Microsoft.EntityFrameworkCore.Database.Command.*</code> (如 <code>CommandExecuting</code>, <code>CommandExecuted</code>, <code>CommandFailed</code>)</li><li><code>Microsoft.EntityFrameworkCore.Database.Connection.*</code> (如 <code>ConnectionOpening</code>, <code>ConnectionClosed</code>)</li><li><code>Microsoft.EntityFrameworkCore.Database.Transaction.*</code> (如 <code>TransactionStarted</code>, <code>TransactionCommitted</code>)</li><li><code>Microsoft.EntityFrameworkCore.ChangeTracking.*</code> (如 <code>DetectChangesStarting</code>, <code>SaveChangesStarting</code>)</li><li><code>Microsoft.EntityFrameworkCore.Query.*</code> (如 <code>QueryExecuting</code>)</li></ul>`,158),l=[t];function r(o,a){return i(),n("div",null,l)}const u=e(s,[["render",r],["__file","log.html.vue"]]),b=JSON.parse('{"path":"/dotnet/ef%20core/log.html","title":"日志记录、事件和诊断","lang":"zh-CN","frontmatter":{"title":"日志记录、事件和诊断","shortTitle":"日志、事件和诊断","description":"日志记录、事件和诊断","date":"2025-07-16T09:50:11.000Z","categories":[".NET","EF CORE"],"tags":[".NET"],"order":8},"headers":[{"level":2,"title":"日志记录、事件和诊断","slug":"日志记录、事件和诊断","link":"#日志记录、事件和诊断","children":[{"level":3,"title":"简单日志记录","slug":"简单日志记录","link":"#简单日志记录","children":[]},{"level":3,"title":"Microsoft.Extensions.Logging","slug":"microsoft-extensions-logging","link":"#microsoft-extensions-logging","children":[]},{"level":3,"title":"事件","slug":"事件","link":"#事件","children":[]},{"level":3,"title":"侦听器","slug":"侦听器","link":"#侦听器","children":[]}]},{"level":2,"title":"诊断侦听器","slug":"诊断侦听器","link":"#诊断侦听器","children":[{"level":3,"title":"定义","slug":"定义-2","link":"#定义-2","children":[]},{"level":3,"title":"使用方法","slug":"使用方法-1","link":"#使用方法-1","children":[]},{"level":3,"title":"关键事件名称","slug":"关键事件名称","link":"#关键事件名称","children":[]}]}],"git":{"createdTime":1752646617000,"updatedTime":1752830607000,"contributors":[{"name":"Zhiyun Qin","email":"96156298+Okita1027@users.noreply.github.com","commits":4}]},"readingTime":{"minutes":22.68,"words":6805},"filePathRelative":"dotnet/ef core/log.md","localizedDate":"2025年7月16日"}');export{u as comp,b as data};
