---
title: 日志记录、事件和诊断
shortTitle: 日志、事件和诊断
description: 日志记录、事件和诊断
date: 2025-07-16 09:50:11
categories: [.NET, EF CORE]
tags: [.NET]
order: 8
---

## 日志记录、事件和诊断

### 简单日志记录

简单日志记录是EF Core提供的一种**快速、开箱即用的日志输出方式**，用于开发者在**调试阶段**方便地查看 EF Core 的行为（如 SQL 执行、跟踪状态、模型验证等）。它使用的是 `.NET 的日志记录系统（ILogger）`，但不需要复杂配置，**一行代码即可启用**。

#### 使用方法

EF Core 提供了一个名为 `LogTo()` 的扩展方法，可以直接在 `DbContextOptionsBuilder` 上使用，将 EF Core 的内部日志输出到你指定的任何 `Action<string>` 方法。最常见的用法是输出到控制台。

**语法：**

```C#
public virtual DbContextOptionsBuilder LogTo (Action<string> writer,
                                             LogLevel minimumLevel = LogLevel.Debug,
                                             DbContextLoggerOptions options = DbContextLoggerOptions.None);

public virtual DbContextOptionsBuilder LogTo (Action<string> writer,
                                             IEnumerable<string> categories,
                                             LogLevel minimumLevel = LogLevel.Debug,
                                             DbContextLoggerOptions options = DbContextLoggerOptions.None);
```

**`writer`** (`Action<string>`)：一个委托，用于接收 EF Core 生成的日志字符串。最常用的是 `Console.WriteLine` 或 `Debug.WriteLine`。

**`minimumLevel`** (`LogLevel`)：指定要记录的最低日志级别。只有级别等于或高于此值的消息才会被记录。常见的级别有：

- `Trace` (最详细)
- `Debug`
- `Information` (默认 SQL 查询在此级别)
- `Warning`
- `Error`
- `Critical` (最不详细)

**`categories`** (`IEnumerable<string>`)：可选参数，用于指定要记录的日志类别。这允许你过滤掉不关心的日志信息，只关注特定类型的事件（例如，只看 SQL 命令）。常见的类别在 `Microsoft.EntityFrameworkCore.DbLoggerCategory` 类中定义，例如：

- `DbLoggerCategory.Database.Command.Name`：此类别包含实际执行的 SQL 命令。
- `DbLoggerCategory.Query.Name`：此类别包含 LINQ 查询如何被翻译的信息。

**`options`** (`DbContextLoggerOptions`)：可选参数，提供额外的日志选项，例如 `EnableSensitiveDataLogging`。

**使用示例：**

通常在 `DbContext` 类的 `OnConfiguring` 方法中配置简单日志记录。

**示例1：将所有信息级别以上的日志记录输出到控制台**

```C#
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging; // 引入此命名空间

public class Blog
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class MyDbContext : DbContext
{
    public DbSet<Blog> Blogs { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder
            .UseSqlServer("YourConnectionString")
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
        Console.WriteLine($"Found {blogs.Count} blogs.");
    }
}
```

当你运行 `PerformSimpleQuery` 方法时，你会在控制台看到类似以下的输出（取决于你的数据库和具体操作）：

```C#
info: Microsoft.EntityFrameworkCore.Database.Command[20100]
      Executed DbCommand (1ms) [Parameters=[], CommandType='Text', CommandTimeout='30']
      SELECT [b].[Id], [b].[Name]
      FROM [Blogs] AS [b]
Found X blogs.
```

这清楚地显示了 EF Core 执行的 SQL 查询。

**示例2：只记录SQL命令，并启用敏感数据日志**

如果你想看到查询的参数值（例如，`WHERE Id = 1` 中的 `1`），你需要启用敏感数据日志。

> [!WARNING]
>
> 生产环境慎用！

```C#
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq; // for FirstOrDefaultAsync

public class MyDbContextWithSensitiveLogging : DbContext
{
    public DbSet<Blog> Blogs { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder
            .UseSqlServer("YourConnectionString")
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
        var blog = await context.Blogs.FirstOrDefaultAsync(b => b.Id == blogId);
        if (blog != null)
        {
            Console.WriteLine($"Found blog: {blog.Name}");
        }
    }
}
```

此时，控制台输出可能包含参数值：

```C#
info: Microsoft.EntityFrameworkCore.Database.Command[20100]
      Executed DbCommand (1ms) [Parameters=[@__blogId_0='1'], CommandType='Text', CommandTimeout='30']
      SELECT TOP(1) [b].[Id], [b].[Name]
      FROM [Blogs] AS [b]
      WHERE [b].[Id] = @__blogId_0
Found blog: ...
```

**示例3：输出到调试窗口**

如果你在 Visual Studio 中开发，并希望日志输出到“输出”窗口的“调试”部分，可以使用 `Debug.WriteLine`。

```C#
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Diagnostics; // 引入此命名空间

public class MyDbContextWithDebugLogging : DbContext
{
    public DbSet<Blog> Blogs { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder
            .UseSqlServer("YourConnectionString")
            // 输出到调试窗口
            .LogTo(message => Debug.WriteLine(message), LogLevel.Information);
    }
}
```

#### 优缺点

**优点**

- **配置简单**：只需一行代码即可启用，无需额外的包或复杂的配置。
- **快速调试**：非常适合在开发过程中快速查看生成的 SQL 或诊断基本问题。
- **低开销**：对于简单的需求，其开销相对较低。

**缺点**

- **功能有限**：
  - 不支持日志滚动、文件大小限制等高级文件日志功能。
  - 不支持结构化日志（JSON、XML），难以被日志分析工具解析。
  - 无法轻松地与现有的日志框架（如 Serilog、NLog、log4net）集成。
  - 不适用于生产环境中的全面日志监控。
- **不适合生产**：在生产环境中，你通常需要更健壮、可配置和可扩展的日志解决方案，例如结合 `Microsoft.Extensions.Logging` 和一个成熟的日志提供程序（如 Application Insights、Seq、ELK Stack）。

#### 与`Microsoft.Extensions.Logging`的关系

`LogTo()` 方法实际上是 `Microsoft.Extensions.Logging` 抽象的一个简化包装。在内部，它仍然使用 `Microsoft.Extensions.Logging`。如果你在 ASP.NET Core 应用程序中，或者已经使用了 `Microsoft.Extensions.Logging` 进行全面的日志配置，那么通常**不需要**再显式使用 `LogTo()`。你应该通过配置 `appsettings.json` 来控制 `Microsoft.EntityFrameworkCore` 类别的日志级别。

例如，在`appsettings.json`中，可以这样配置来显示 EF Core 的 SQL 命令：

```JSON
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.EntityFrameworkCore.Database.Command": "Information" // 显示 SQL 命令
    }
  }
}
```

### `Microsoft.Extensions.Logging`

#### 定义

`Microsoft.Extensions.Logging` 是 .NET 的**官方日志记录抽象库**。
 EF Core 并没有自己实现日志系统，而是直接基于这个标准库。

也就是说： EF Core 的所有日志，最终都是通过 ILogger 写出去的。

#### 日志级别

日志级别用于指示日志消息的重要性或严重性。它们从最不重要到最重要排序：

- **`Trace` (跟踪)**：最详细的日志，通常包含敏感数据。
- **`Debug` (调试)**：调试信息和生产诊断所需的值。
- **`Information` (信息)**：一般流程和事件的记录。EF Core 的 SQL 命令默认在此级别。
- **`Warning` (警告)**：应用程序中可能导致问题或不正常的事件。
- **`Error` (错误)**：当前操作失败，但应用程序可能继续运行。
- **`Critical` (严重)**：应用程序或系统崩溃或需要立即关注的事件。
- **`None` (无)**：不记录任何消息。

#### 日志类别

日志类别通常是执行日志记录的类的**完全限定名称**。它们用于对日志消息进行分组和过滤。EF Core 使用自己的特定类别来组织其日志输出。

例如：

- `Microsoft.EntityFrameworkCore`：EF Core 核心日志。
- `Microsoft.EntityFrameworkCore.Database.Command`：实际执行的 SQL 命令。
- `Microsoft.EntityFrameworkCore.Query`：LINQ 查询的翻译过程。
- `Microsoft.EntityFrameworkCore.Update`：`SaveChanges` 过程的详细信息。

#### 日志提供程序

日志提供程序是实际将日志消息写入特定目标（如控制台、文件、数据库等）的组件。`Microsoft.Extensions.Logging` 默认提供了多种内置提供程序：

- **Console (控制台)**：将日志输出到控制台。
- **Debug (调试窗口)**：将日志输出到调试窗口（如 Visual Studio 的“输出”窗口）。
- **EventSource / EventLog (事件源 / 事件日志)**：将日志写入 Windows 事件日志或 EventSource。
- **Azure App Services Diagnostics (Azure 应用服务诊断)**：用于 Azure 应用服务。

你也可以集成第三方的日志提供程序，如：

- **Serilog**：功能强大的结构化日志框架，支持多种接收器 (sinks)。
- **NLog**：另一个流行的日志框架，功能丰富。

#### 配置`Microsoft.Extensions.Logging`

日志通常在 `Program.cs` 或 `Startup.cs` 中进行配置，通过依赖注入系统管理 `ILoggerFactory` 和 `ILogger` 实例。

##### `appsettings.json`

在 `appsettings.json` 文件中配置日志级别和类别：

```JSON
{
  "Logging": {
    "LogLevel": {
      "Default": "Information", // 默认日志级别
      "Microsoft.AspNetCore": "Warning", // ASP.NET Core 相关日志级别
      "Microsoft.EntityFrameworkCore": "Information", // EF Core 的所有日志级别
      "Microsoft.EntityFrameworkCore.Database.Command": "Information" // 特别是 EF Core 生成的 SQL 命令，设置为 Information 以显示
    },
    "Console": { // 控制台日志提供程序的配置
      "IncludeScopes": false
    },
    "Debug": { // 调试窗口日志提供程序的配置
      "IncludeScopes": false
    }
  }
}
```

##### `Program.cs`

通过 `Host.CreateDefaultBuilder` 来配置日志。

```CS
// Program.cs
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

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureLogging(logging =>
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
                logging.AddFilter("Microsoft.EntityFrameworkCore.Database.Command", LogLevel.Information); // 确保 SQL 命令在调试模式下可见
                #endif
            })
            .ConfigureServices((hostContext, services) =>
            {
                services.AddDbContext<MyDbContext>(options =>
                {
                    options.UseSqlServer(hostContext.Configuration.GetConnectionString("DefaultConnection"));

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
```

##### 在控制器或服务中使用`ILogger`

一旦配置好 `Microsoft.Extensions.Logging`，你可以在任何需要日志记录的类中通过依赖注入获取 `ILogger<T>` 实例：

```CS
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

public class MyService
{
    private readonly MyDbContext _context;
    private readonly ILogger<MyService> _logger; // 注入 ILogger

    public MyService(MyDbContext context, ILogger<MyService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<Blog>> GetAllBlogs()
    {
        _logger.LogInformation("Attempting to retrieve all blogs."); // 记录自定义信息日志

        var blogs = await _context.Blogs.ToListAsync();

        _logger.LogDebug($"Retrieved {blogs.Count} blogs from the database."); // 记录调试日志

        return blogs;
    }

    public async Task AddNewBlog(string name)
    {
        try
        {
            var newBlog = new Blog { Name = name };
            _context.Blogs.Add(newBlog);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Successfully added new blog: {name} with ID: {newBlog.Id}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error adding new blog: {name}"); // 记录错误日志，并包含异常信息
            throw;
        }
    }
}
```

通过`ILogger<T>`，可以使用各种扩展方法（`LogTrace`、`LogDebug`、`LogInformation`、`LogWarning`、`LogError`、`LogCritical`）来记录不同级别的日志。

#### `EnableSensitiveDataLogging()` 和 `EnableDetailedErrors()`

**`options.EnableSensitiveDataLogging()`**：

- **作用**：让 EF Core 在日志中包含查询参数的实际值。例如，`WHERE Id = @p0` 会变成 `WHERE Id = 123`。
- **风险**：如果参数包含用户密码、信用卡号等敏感信息，这些信息将写入日志，造成安全漏洞。
- **最佳实践**：**仅在开发和调试环境中使用**。在生产环境中，始终禁用此功能。

**`options.EnableDetailedErrors()`**：

- **作用**：当 EF Core 遇到错误时，提供更详细的错误信息，这对于诊断问题非常有帮助。例如，如果查询失败，它可能会提供更多关于为什么无法翻译查询的细节。
- **最佳实践**：在开发和测试环境中启用。在生产环境中，你可能希望捕获更通用的错误信息，并避免将过多的内部细节暴露给日志，尽管这通常比敏感数据日志的风险低。

### 事件

**事件**提供了一种机制，让你能够在数据保存生命周期的特定时刻插入自定义逻辑。它们就像是钩子，允许你在 EF Core 执行某些操作之前或之后运行自己的代码。

EF Core 并没有使用传统的 .NET 事件（如 `event` 关键字），
 而是基于 `DiagnosticSource` 与 .NET 的观察者模式（`IObserver<T>`）来**发布运行时事件**。

#### 事件类型

1. **`DbContext` 上的传统 .NET 事件**：`SavingChanges` 和 `SavedChanges`。
2. **拦截器 (Interceptors)**：EF Core 5.0 引入的更强大、更灵活的事件机制。

##### `DbContext` 上的传统 .NET 事件

`DbContext` 类本身提供了两个直接的 .NET 事件，你可以像订阅任何普通 .NET 事件一样订阅它们。

- **`SavingChanges` 事件**：
  - **触发时机**：在 `SaveChanges()` 或 `SaveChangesAsync()` **开始执行之前**触发。
  - **用途**：最常用于在数据被发送到数据库之前进行**预处理**。例如，自动填充审计字段、执行业务验证或实现软删除逻辑。
  - **事件参数**：`SavingChangesEventArgs`。你可以通过 `context.ChangeTracker.Entries()` 访问所有当前被跟踪的实体及其状态。
  - **可取消**：你可以设置 `SavingChangesEventArgs.Cancel = true` 来取消当前的 `SaveChanges` 操作。
- **`SavedChanges` 事件**：
  - **触发时机**：在 `SaveChanges()` 或 `SaveChangesAsync()` **成功完成之后**触发。
  - **用途**：最常用于在数据持久化后执行**后续操作**。例如，更新缓存、发布领域事件、或进行日志记录。
  - **事件参数**：`SavedChangesEventArgs`，它包含了受影响的实体数量 (`EntitiesSavedCount`)。

**示例：订阅并使用`SavingChanges`和`SavedChanges`**

```CS
using Microsoft.EntityFrameworkCore;
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
    public DbSet<Product> Products { get; set; } = null!;

    public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
    {
        // 在 DbContext 构造函数中订阅事件
        // SavingChanges 事件处理程序
        SavingChanges += (sender, args) =>
        {
            Console.WriteLine("--- SavingChanges Event Fired ---");
            var context = (MyDbContext)sender!;

            foreach (var entry in context.ChangeTracker.Entries())
            {
                if (entry.Entity is Product product) // 确保是 Product 实体
                {
                    switch (entry.State)
                    {
                        case EntityState.Added:
                            product.CreatedDate = DateTime.UtcNow;
                            Console.WriteLine($"  Product '{product.Name}' (ID: {product.Id}) is being Added. Setting CreatedDate.");
                            break;
                        case EntityState.Modified:
                            product.LastModifiedDate = DateTime.UtcNow;
                            Console.WriteLine($"  Product '{product.Name}' (ID: {product.Id}) is being Modified. Setting LastModifiedDate.");
                            break;
                        case EntityState.Deleted:
                            // 实现软删除逻辑：
                            // 如果是删除操作，将其状态改为 Modified，并设置 IsDeleted 为 true
                            if (!product.IsDeleted) // 避免重复标记
                            {
                                entry.State = EntityState.Modified; // 更改状态为 Modified
                                product.IsDeleted = true; // 设置软删除标记
                                Console.WriteLine($"  Product '{product.Name}' (ID: {product.Id}) intercepted for Soft Delete.");
                            }
                            break;
                    }
                }
            }
            Console.WriteLine("--- End SavingChanges Event ---");
        };

        // SavedChanges 事件处理程序
        SavedChanges += (sender, args) =>
        {
            Console.WriteLine($"--- SavedChanges Event Fired ---");
            Console.WriteLine($"  {args.EntitiesSavedCount} entities successfully saved to database.");
            Console.WriteLine("--- End SavedChanges Event ---");
        };
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("YourConnectionString");
    }
}

public async Task PerformProductOperations()
{
    using (var context = new MyDbContext(new DbContextOptionsBuilder<MyDbContext>().UseSqlServer("YourConnectionString").Options))
    {
        // 添加一个新产品
        var newProduct = new Product { Name = "New Widget", Price = 25.00m };
        context.Products.Add(newProduct);
        Console.WriteLine("\n--- Saving New Product ---");
        await context.SaveChangesAsync();
        Console.WriteLine("New Product saved.\n");

        // 修改一个产品
        var existingProduct = await context.Products.FirstAsync();
        existingProduct.Price = 30.00m;
        Console.WriteLine("\n--- Saving Modified Product ---");
        await context.SaveChangesAsync();
        Console.WriteLine("Modified Product saved.\n");

        // 删除一个产品 (会被软删除)
        context.Products.Remove(existingProduct);
        Console.WriteLine("\n--- Saving Deleted Product (Soft Delete) ---");
        await context.SaveChangesAsync();
        Console.WriteLine("Deleted Product saved (soft deleted).\n");

        // 验证软删除
        var deletedProduct = await context.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == existingProduct.Id);
        Console.WriteLine($"\nIs product {deletedProduct?.Name} soft deleted? {deletedProduct?.IsDeleted}"); // Should be True
    }
}
```

**传统事件的优缺点**

- **优点**：
  - **简单易用**：对于简单的事件处理，直接订阅 `DbContext` 上的事件非常直观。
  - **直接访问 `DbContext`**：事件处理器可以直接访问触发事件的 `DbContext` 实例及其变更跟踪器。
- **缺点**：
  - **侵入性**：你需要在 `DbContext` 派生类的构造函数中订阅这些事件，这可能会使 `DbContext` 类变得臃肿，并与业务逻辑耦合。
  - **难以复用**：如果你有多个 `DbContext` 类型或需要在多个应用程序中使用相同的事件处理逻辑，复用性较差。
  - **同步限制**：这些事件本质上是同步的，尽管你可以在处理器中调用异步方法，但事件本身不会等待这些异步操作完成，可能会导致意外行为。

##### 拦截器

###### 定义

**拦截器**是 EF Core 5.0 引入的更强大、更推荐的事件处理机制。它们提供了一种非侵入式的方式，让你可以在 EF Core 操作的不同阶段插入自定义逻辑，并且设计得更易于复用和组合。

拦截器通过实现特定的接口来工作，例如：

| 接口名称                      | 拦截对象             | 常见用途                     |
| ----------------------------- | -------------------- | ---------------------------- |
| `IDbCommandInterceptor`       | SQL 命令执行         | 捕捉执行前后、修改 SQL       |
| `ISaveChangesInterceptor`     | SaveChanges 执行前后 | 自动设置审计字段、阻止保存   |
| `IConnectionInterceptor`      | 数据库连接打开/关闭  | 捕捉连接时长、记录连接次数   |
| `IMaterializationInterceptor` | 实体实例化过程       | 控制对象创建、替换属性值     |
| `ITransactionInterceptor`     | 数据库事务           | 捕捉事务开始/提交/回滚       |
| `IQueryExpressionInterceptor` | 查询表达式树         | 修改 LINQ 表达式（高阶用法） |

每个拦截器接口都提供了多个方法，对应着操作的同步和异步版本，以及操作前 (`-ing`) 和操作后 (`-ed`) 的钩子。

###### 使用步骤

1. 创建一个拦截器类

```CS
public class MyCommandInterceptor : DbCommandInterceptor
{
    public override InterceptionResult<DbDataReader> ReaderExecuting(
        DbCommand command,
        CommandEventData eventData,
        InterceptionResult<DbDataReader> result)
    {
        Console.WriteLine($"[拦截器] 正在执行 SQL: {command.CommandText}");
        return base.ReaderExecuting(command, eventData, result);
    }
}
```

可以重写：

- `ReaderExecuting`：执行 SELECT 时触发
- `NonQueryExecuting`：执行 INSERT/UPDATE/DELETE 时触发
- `ScalarExecuting`：执行返回单值的 SQL（如 COUNT）

2. 将拦截器注册到DbContext

在 `Program.cs` 或 `DbContext` 注册：

```CS
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options
        .UseSqlServer("your-connection-string")
        .AddInterceptors(new MyCommandInterceptor());
});
```

###### 示例

**记录SQL执行时间：**

```CS
public class TimingInterceptor : DbCommandInterceptor
{
    private readonly Stopwatch _stopwatch = new();

    public override InterceptionResult<int> NonQueryExecuting(
        DbCommand command,
        CommandEventData eventData,
        InterceptionResult<int> result)
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
        Console.WriteLine($"[执行耗时] {command.CommandText} => {_stopwatch.ElapsedMilliseconds}ms");
        return base.NonQueryExecuted(command, eventData, result);
    }
}
```

**自动添加创建时间：**

```CS
public class AuditSaveChangesInterceptor : SaveChangesInterceptor
{
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        var context = eventData.Context;
        var entries = context.ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Added && e.Entity is IHasCreatedTime);

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

```

---

使用 `ISaveChangesInterceptor` 实现审计和软删除

与之前使用传统事件的例子功能类似，但用拦截器实现。

```CS
using Microsoft.EntityFrameworkCore.Diagnostics; // 引入此命名空间

public class AuditSaveChangesInterceptor : ISaveChangesInterceptor
{
    // 同步 BeforeSave
    public InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
    {
        PerformAudit(eventData.Context!); // 调用异步方法，但这里是同步执行
        return result;
    }

    // 异步 BeforeSave
    public ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        PerformAudit(eventData.Context!);
        return new ValueTask<InterceptionResult<int>>(result);
    }

    // 同步 AfterSave
    public int SavedChanges(SaveChangesCompletedEventData eventData, int result)
    {
        Console.WriteLine($"Interceptor: {eventData.EntitiesSaved} entities saved successfully.");
        return result;
    }

    // 异步 AfterSave
    public ValueTask<int> SavedChangesAsync(
        SaveChangesCompletedEventData eventData,
        int result,
        CancellationToken cancellationToken = default)
    {
        Console.WriteLine($"Interceptor Async: {eventData.EntitiesSaved} entities saved successfully.");
        return new ValueTask<int>(result);
    }

    // 辅助方法，包含核心逻辑
    private void PerformAudit(DbContext context)
    {
        Console.WriteLine("--- Interceptor: SavingChanges Event ---");
        foreach (var entry in context.ChangeTracker.Entries())
        {
            if (entry.Entity is Product product)
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        product.CreatedDate = DateTime.UtcNow;
                        Console.WriteLine($"  Interceptor: Product '{product.Name}' is being Added. Setting CreatedDate.");
                        break;
                    case EntityState.Modified:
                        product.LastModifiedDate = DateTime.UtcNow;
                        Console.WriteLine($"  Interceptor: Product '{product.Name}' is being Modified. Setting LastModifiedDate.");
                        break;
                    case EntityState.Deleted:
                        if (!product.IsDeleted)
                        {
                            entry.State = EntityState.Modified; // 更改状态为 Modified
                            product.IsDeleted = true; // 设置软删除标记
                            Console.WriteLine($"  Interceptor: Product '{product.Name}' intercepted for Soft Delete.");
                        }
                        break;
                }
            }
        }
        Console.WriteLine("--- Interceptor: End SavingChanges Event ---");
    }

    // 其他 ISaveChangesInterceptor 接口方法（这里省略，通常返回 result）
    public void SaveChangesFailed(DbContextErrorEventData eventData) { }
    public ValueTask SaveChangesFailedAsync(DbContextErrorEventData eventData, CancellationToken cancellationToken = default) => ValueTask.CompletedTask;
}
```

**注册拦截器**

需要在 `DbContext` 配置时注册拦截器。

```CS
// 在 DbContext.OnConfiguring 中注册
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    optionsBuilder
        .UseSqlServer("YourConnectionString")
        .AddInterceptors(new AuditSaveChangesInterceptor()); // 注册拦截器实例
}

// 在 ASP.NET Core Startup.cs/Program.cs 中注册 (更常见)
public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton<AuditSaveChangesInterceptor>(); // 拦截器本身可以作为单例服务
    services.AddDbContext<MyDbContext>(options =>
    {
        options.UseSqlServer("YourConnectionString")
               .AddInterceptors(services.GetRequiredService<AuditSaveChangesInterceptor>()); // 从 DI 获取并注册
    });
}
```

### 侦听器

“侦听器”允许你在 EF Core 的内部操作执行过程中的特定点**拦截、修改甚至阻止**这些操作。

#### 作用

**命令 (Command) 拦截：** 在执行数据库命令之前、之后或执行失败时进行拦截。这是最常用的拦截类型。

- **用途：**

  - **记录 SQL 日志：** 捕获并记录 EF Core 生成的所有 SQL 语句。

  - **修改 SQL：** 动态地修改将要执行的 SQL 命令，例如为所有查询自动添加 `WHERE TenantId = @p0` 来实现多租户。

  - **模拟命令执行结果：** 不实际执行命令，而是直接返回一个预设的结果，非常适合用于测试。

**连接 (Connection) 拦截：** 在打开或关闭数据库连接时进行拦截。

**事务 (Transaction) 拦截：** 在开始、提交、回滚或创建保存点时进行拦截。

**保存更改 (SaveChanges) 拦截：** 在调用 `SaveChanges()` 的过程中进行拦截，允许你在实体状态改变或实际写入数据库前后执行逻辑。

- **用途：**
  - **自动审计：** 自动为实现了某个接口（如 `IAuditable`）的实体设置 `CreatedAt` 和 `UpdatedAt` 字段。
  - **软删除 (Soft Delete)：** 拦截删除操作，将其转换为对 `IsDeleted` 标志位的更新操作。

#### 侦听器接口

EF Core 提供了一系列接口，每个接口对应一种拦截类型。你通常不需要实现整个接口，而是可以继承自 EF Core 提供的基类（如 `SaveChangesInterceptor`, `DbCommandInterceptor`），然后只重写你感兴趣的方法。

| 接口名称                      | 拦截对象             | 常见用途                     |
| ----------------------------- | -------------------- | ---------------------------- |
| `IDbCommandInterceptor`       | SQL 命令执行         | 捕捉执行前后、修改 SQL       |
| `ISaveChangesInterceptor`     | SaveChanges 执行前后 | 自动设置审计字段、阻止保存   |
| `IConnectionInterceptor`      | 数据库连接打开/关闭  | 捕捉连接时长、记录连接次数   |
| `IMaterializationInterceptor` | 实体实例化过程       | 控制对象创建、替换属性值     |
| `ITransactionInterceptor`     | 数据库事务           | 捕捉事务开始/提交/回滚       |
| `IQueryExpressionInterceptor` | 查询表达式树         | 修改 LINQ 表达式（高阶用法） |

> 每个拦截方法通常都有同步和异步两个版本（例如 `ReaderExecuting` 和 `ReaderExecutingAsync`）。你应该根据你的代码是同步还是异步来重写对应的方法。

#### 使用方式

案例：实现自动审计日志（设置创建和更新时间）

##### 定义需要审计的实体接口

```CS
public interface IAuditable
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
```

##### 创建侦听器类

创建一个继承自 `SaveChangesInterceptor` 的新类。

```CS
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.ChangeTracking;

// 继承自 SaveChangesInterceptor
public class AuditableEntityInterceptor : SaveChangesInterceptor
{
    // 重写 SavingChangesAsync 方法，它在 SaveChangesAsync 执行时被调用
    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData,
        InterceptionResult<int> result)
    {
        SetAuditProperties(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    // 同时重写异步版本
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        SetAuditProperties(eventData.Context);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private void SetAuditProperties(DbContext? dbContext)
    {
        if (dbContext == null) return;

        // 获取所有被跟踪的实体条目
        var entries = dbContext.ChangeTracker.Entries<IAuditable>();

        foreach (var entry in entries)
        {
            // 当实体被添加时
            if (entry.State == EntityState.Added)
            {
                entry.Property(p => p.CreatedAt).CurrentValue = DateTime.UtcNow;
                entry.Property(p => p.UpdatedAt).CurrentValue = DateTime.UtcNow;
            }
            // 当实体被修改时
            else if (entry.State == EntityState.Modified)
            {
                entry.Property(p => p.UpdatedAt).CurrentValue = DateTime.UtcNow;
            }
        }
    }
}
```

##### 在`DbContext`中注册侦听器

有两种主要方式来注册这个侦听器：

- **作为服务注册到DI容器【推荐】**

  这种方式让你的侦听器可以享受依赖注入的好处，比如注入其他服务 (`ILogger`, `IHttpContextAccessor` 等)。

  1. 将侦听器注册为服务(`Program.cs`)

  ```CS
  var builder = WebApplication.CreateBuilder(args);
  
  // 将侦听器注册为 Scoped 服务
  builder.Services.AddScoped<AuditableEntityInterceptor>();
  ```

  2. **在 `AddDbContext` 中添加侦听器** (`Program.cs`)

  ```CS
  builder.Services.AddDbContext<ApplicationDbContext>((serviceProvider, options) =>
  {
      // 从服务容器中解析侦听器
      var interceptor = serviceProvider.GetRequiredService<AuditableEntityInterceptor>();
  
      options.UseSqlServer(connectionString)
             .AddInterceptors(interceptor); // 添加侦听器
  });
  ```

- **直接在 `OnConfiguring` 中实例化和添加**

  这种方式比较简单，但侦听器本身无法使用 DI。

  ```CS
  // 在你的 DbContext 类中
  protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
  {
      optionsBuilder.AddInterceptors(new AuditableEntityInterceptor());
  }
  ```

#### 侦听器执行顺序与作用域

**执行顺序：** 如果你注册了多个相同类型的侦听器，它们会按照注册的顺序依次执行。

**作用域与生命周期：**

- 当你使用 `AddDbContext`（非池化）时，侦听器通常和 `DbContext` 一样是 `Scoped` 的。
- 当你使用 `AddDbContextPool`（池化）时，情况就变得复杂了。如果你的侦听器是无状态的（像上面的 `AuditableEntityInterceptor`），你可以将其注册为**单例 (Singleton)** 以获得最佳性能。但如果你的侦听器需要持有请求级别的状态（例如，依赖 `IHttpContextAccessor`），你**必须**将其注册为 `Scoped`，并且在 `AddDbContextPool` 时要小心，因为池化的 `DbContext` 可能会跨越多个作用域，这可能导致侦听器状态不正确。对于有状态的侦听器，通常建议配合**非池化**的 `AddDbContext` 使用。

## 诊断侦听器

### 定义

这个概念比我们之前讨论的日志记录和拦截器要更底层一些。如果说日志记录是看「报表」，拦截器是当「检查员」，那么诊断侦听器就是直接在 EF Core 的「神经系统」上挂载一个「监听设备」。它能让你捕获到非常原始、非常核心的诊断事件。

`DiagnosticListener` 是 .NET 提供的一种 **发布/订阅（Pub/Sub）机制**：

- EF Core 会将关键操作（如 SQL 执行、模型验证）以**事件**的形式“发布”出去；
- 我们可以通过 `DiagnosticListener` 注册一个“**侦听器**”，来**监听这些事件并做出响应**。

| 特性         | 简单日志记录 (LogTo)       | 拦截器 (Interceptors)           | 诊断侦听器 (Diagnostic Listeners)                            |
| ------------ | -------------------------- | ------------------------------- | ------------------------------------------------------------ |
| 抽象层级     | 高 (封装好的字串)          | 中 (强型别的物件和方法)         | 低 (原始事件名称和匿名负载)                                  |
| 主要目的     | 被动观察 (为了人类阅读)    | 主动干预 (为了改变行为)         | 被动观察 (为了机器处理/遥测)                                 |
| 能否修改行为 | 否                         | 是 (可以修改、阻止、替换)       | 否                                                           |
| 效能开销     | 中 (尤其在高 LogLevel 时)  | 中 (有方法呼叫和逻辑执行的开销) | 低 (若无订阅者则开销极小)                                    |
| 典型用例     | 开发时快速调试 SQL         | 软删除、审计、多租户查询改写    | 整合 APM 工具 (如 Application Insights)、自订遥测、细粒度的效能分析 |
| 与 DI 整合   | 自动与 ILoggerFactory 整合 | 易于作为服务注册和注入          | 需要手动订阅，但观察者本身可以透过 DI 创建                   |

### 使用方法

1. **创建一个观察者**

你需要创建一个类，实现 `IObserver<KeyValuePair<string, object>>` 介面。这个观察者就是你的“监听设备”。

```CS
using System.Diagnostics;

public class MyEfCoreDiagnosticObserver : IObserver<KeyValuePair<string, object>>
{
    // 当没有更多事件时被呼叫（通常在应用程式关闭时）
    public void OnCompleted()
    {
        // 可选：执行清理工作
        Console.WriteLine("Diagnostic observer completed.");
    }

    // 当发生错误时被呼叫
    public void OnError(Exception error)
    {
        // 可选：记录错误
        Console.WriteLine($"Diagnostic error: {error.Message}");
    }

    // 每当有新事件发布时，这个方法就会被呼叫
    public void OnNext(KeyValuePair<string, object> value)
    {
        // value.Key 是事件的名称
        // value.Value 是事件的负载 (payload)
        
        // 我们只对 EF Core 命令执行之前的事件感兴趣
        if (value.Key == "Microsoft.EntityFrameworkCore.Database.Command.CommandExecuting")
        {
            // 从负载物件中提取资料
            // 注意：你需要知道负载物件有哪些属性，这通常需要查阅官方文件
            var command = GetProperty<DbCommand>(value.Value, "Command");
            var context = GetProperty<DbContext>(value.Value, "Context");

            if (command != null)
            {
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine($"[Diagnostic Listener] Executing command: {command.CommandText}");
                Console.ResetColor();
            }
        }
    }

    // 一个辅助方法，用来安全地从匿名负载物件中获取属性
    private T? GetProperty<T>(object? payload, string propertyName)
    {
        return payload?.GetType().GetProperty(propertyName)?.GetValue(payload) as T;
    }
}
```

2. **订阅 `DiagnosticListener`**

在你的应用程式启动时（例如 `Program.cs`），你需要找到 EF Core 的 `DiagnosticListener` 并把你的观察者订阅上去。

```CS
// 在 Program.cs 的某个地方

// 创建你的观察者实例
var myObserver = new MyEfCoreDiagnosticObserver();

// 订阅所有 .NET 的 DiagnosticSource 事件
DiagnosticListener.AllListeners.Subscribe(listener =>
{
    // 我们只对名为 "Microsoft.EntityFrameworkCore" 的 listener 感兴趣
    if (listener.Name == "Microsoft.EntityFrameworkCore")
    {
        // 将我们的观察者附加到这个 listener 上
        listener.Subscribe(myObserver);
    }
});
```

完成这两步后，每次 EF Core 执行一个资料库命令之前，`OnNext` 方法就会被触发，并印出黄色的 SQL 叙述。

3. **应用启动时注册**

在 `Program.cs` 或任意应用启动位置调用即可。

```CS
DiagnosticListener.AllListeners.Subscribe(new EfCoreDiagnosticSourceObserver());
```

### 关键事件名称

EF Core 的事件名称都定义在 `DbLoggerCategory` 的子类别中。一些常见的事件前缀包括：

- `Microsoft.EntityFrameworkCore.Database.Command.*` (如 `CommandExecuting`, `CommandExecuted`, `CommandFailed`)
- `Microsoft.EntityFrameworkCore.Database.Connection.*` (如 `ConnectionOpening`, `ConnectionClosed`)
- `Microsoft.EntityFrameworkCore.Database.Transaction.*` (如 `TransactionStarted`, `TransactionCommitted`)
- `Microsoft.EntityFrameworkCore.ChangeTracking.*` (如 `DetectChangesStarting`, `SaveChangesStarting`)
- `Microsoft.EntityFrameworkCore.Query.*` (如 `QueryExecuting`)



