---
title: DbContext配置和初始化
shortTitle: DbContext
description: DbContext配置和初始化
date: 2025-07-12 17:37:33
categories: [.NET, EF CORE]
tags: [.NET]
order: 1
---

## DbContext

`DbContext` 是 EF Core 的核心，它扮演着以下几个关键角色：

- **数据库会话 (Database Session)**：`DbContext` 的一个实例代表了与数据库的一次会话或工作单元。在这个会话中，你可以加载实体、跟踪它们的更改、保存数据。
- **DbSet 集合**：你的 `DbContext` 子类会包含 `DbSet<TEntity>` 属性，每个 `DbSet` 对应数据库中的一个表，并允许你对该表中的实体执行 LINQ 查询和 CRUD 操作。
  - 例如：`public DbSet<Product> Products { get; set; }` 意味着你的数据库有一个 `Products` 表，你可以通过 `_context.Products` 来访问和操作它。
- **变更跟踪 (Change Tracking)**：这是 EF Core 最强大的功能之一。`DbContext` 会自动跟踪从数据库加载的实体以及你添加到它的新实体。当这些实体发生变化时，`DbContext` 会记录这些变化，并在你调用 `SaveChanges()` 或 `SaveChangesAsync()` 时，生成相应的 SQL INSERT、UPDATE 或 DELETE 语句来同步数据库。
- **查询和保存数据**：它是你与数据库交互的主要入口点。你可以通过它执行 LINQ 查询、添加新实体、更新现有实体、删除实体，并将这些更改持久化到数据库。

### 生命周期

`DbContext` 实例的生命周期通常是**短暂的**，并且每个工作单元（或每个 HTTP 请求）都应该使用**一个新的** `DbContext` 实例

```MERMAID
sequenceDiagram
    participant Request
    participant DI
    participant DbContext
    participant Database

    Request->>DI: 需要 AppDbContext
    DI->>DbContext: 创建新实例（Scoped）
    DbContext->>Database: 打开连接
    loop 请求处理
        Request->>DbContext: 执行查询/更新
        DbContext->>Database: 发送SQL
    end
    Request->>DbContext: 操作完成
    DbContext->>Database: 关闭连接
    DI->>DbContext: 调用 Dispose()
```

1. **创建（Creation）**

- **触发时机**：首次从 DI 容器解析时（如控制器构造函数注入）
- **关键操作**：
  - 建立数据库连接池连接
  - 初始化变更跟踪器

2. **使用（Usage）**

- **请求内共享**：同一请求中的 Repository/Service 使用相同的 DbContext
- **变更跟踪**：所有查询的实体默认被跟踪（除非显式使用 `AsNoTracking`）

3. **释放（Disposal）**

- **自动触发**：请求结束时 ASP.NET Core 自动调用 `Dispose()`
- **关键操作**：
  - 关闭数据库连接
  - 清理变更跟踪器
  - 释放所有资源

**为什么是短暂的？**

- **变更跟踪**：一个 `DbContext` 实例会跟踪它加载的所有实体。如果一个实例存活时间过长，它跟踪的实体数量会不断增加，导致内存占用增多，性能下降。
- **并发问题**：`DbContext` 不是线程安全的。多个线程同时使用同一个 `DbContext` 实例可能导致数据不一致或其他不可预测的行为。
- **数据陈旧**：长时间存活的 `DbContext` 可能持有旧的数据，无法反映数据库中的最新更改。

**如何在 .NET Core 中管理？**

- 在 ASP.NET Core 中，`DbContext` 通常通过**依赖注入 (Dependency Injection - DI)** 进行注册和管理。
- 默认情况下，`DbContext` 会被注册为 **`Scoped` (作用域)** 生命周期。这意味着在每个 HTTP 请求的生命周期内，只会创建一个 `DbContext` 实例。请求结束，`DbContext` 实例就会被销毁。这完美符合“每个工作单元使用一个新实例”的最佳实践。

### 使用方法

#### 基本依赖注入

`DbContext` 的配置主要通过重写 `OnConfiguring` 方法或更常见的通过**依赖注入**在 `Program.cs`中进行。

- **`OnConfiguring` 方法 (主要用于控制台应用或简单场景)**：

  ```C#
  public class ApplicationDbContext : DbContext
  {
      protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
      {
          // 配置使用 SQL Server 数据库，并指定连接字符串
          optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=MyDatabase;Trusted_Connection=True;");
      }
      public DbSet<Product> Products { get; set; }
  }
  ```

- **通过依赖注入 (`Program.cs`) (Web 应用推荐)**：

  ```C#
  // Program.cs
  builder.Services.AddDbContext<ApplicationDbContext>(options =>
      options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)) // 使用 MySQL
      // options.UseSqlServer(connectionString) // 或使用 SQL Server
      // .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking) // 可选：配置默认查询行为
  );
  ```

  这种方式更灵活，可以从配置源（如 `appsettings.json`）获取连接字符串，并且方便地集成到 .NET Core 的整个 DI 体系中。

> DbContext 非线程安全，仅在单一线程或请求中使用。

#### 使用new进行基本DbContext实例化

通过依赖注入 (DI) 容器注册和使用 `DbContext` 是**最推荐和最常见**的做法，但在某些特定场景下，你可能需要手动使用 `new` 关键字来初始化 `DbContext` 实例。

这种手动初始化方式通常用于：

- **控制台应用程序**：没有内置的 DI 容器。
- **单元测试或集成测试**：需要直接控制 `DbContext` 实例。
- **一次性脚本**：快速执行一些数据库操作，无需完整的 Web 应用上下文。
- **后台任务/非 HTTP 请求上下文**：在需要独立于当前请求生命周期的 `DbContext` 实例时（尽管更推荐使用 `IDbContextFactory<TDbContext>`）。

---

当你使用 `new` 关键字初始化 `DbContext` 时，你需要提供数据库连接配置。这通常通过重写 `DbContext` 类中的 `OnConfiguring` 方法来完成。

1. 修改`DbContext`类

在你的 `ApplicationDbContext` 类中，添加一个**无参数构造函数**，并重写 `OnConfiguring` 方法来配置数据库连接。

```C#
// ApplicationDbContext.cs
using Microsoft.EntityFrameworkCore;
using DEMO_CRUD.Models.Entity; // 假设你的实体定义在这里

public class ApplicationDbContext : DbContext
{
    // 1. 无参数构造函数 (重要，用于手动 new)
    public ApplicationDbContext()
    {
    }

    // 2. 带有 DbContextOptions 的构造函数 (用于 DI)
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // DbSets 保持不变
    public DbSet<Book> Books { get; set; }
    public DbSet<Author> Authors { get; set; }
    public DbSet<Publisher> Publishers { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<BookCategory> BookCategories { get; set; }

    // 3. 重写 OnConfiguring 方法来配置数据库连接
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // 如果 DbContextOptions 还没有被配置 (即通过无参构造函数创建时)
        if (!optionsBuilder.IsConfigured)
        {
            // 直接在这里提供连接字符串和数据库提供程序
            string connectionString = "Server=localhost;Port=3306;Database=your_database_name;Uid=your_username;Pwd=your_password;";
            optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));

            // 可选：启用敏感数据日志（仅用于开发/调试）
            // optionsBuilder.EnableSensitiveDataLogging();
        }
    }

    // 4. OnModelCreating 保持不变 (用于模型配置)
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ... 你的 Fluent API 配置或 ApplyConfigurationsFromAssembly ...
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
```

- 上面的无参构造函数可以换成有参构造：让`connectionString`从外部传进来。

- 可以创建 `DbContextOptions`，并可以显式调用构造函数：

  ```CS
  var contextOptions = new DbContextOptionsBuilder<ApplicationDbContext>()
      .UseSqlServer(@"Server=(localdb)\mssqllocaldb;Database=Test;ConnectRetryCount=0")
      .Options;
  
  using var context = new ApplicationDbContext(contextOptions);
  ```

2. 在代码中使用`new`初始化

现在，你可以在任何地方使用 `new` 关键字来创建 `ApplicationDbContext` 的实例。**记住，手动创建的 `DbContext` 实例需要手动管理其生命周期，通常使用 `using` 语句来确保它被正确释放**

```CS
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DEMO_CRUD.Models.Entity; // 确保引用了你的实体命名空间

public class Program
{
    public static async Task Main(string[] args)
    {
        Console.WriteLine("手动初始化 DbContext 示例开始...");

        // 使用 'using' 语句确保 DbContext 实例被正确释放
        await using (var context = new ApplicationDbContext())
        {
            try
            {
                // 确保数据库存在并应用所有挂起的迁移（可选，但推荐在启动时做）
                // 仅在手动初始化且不需要 migrations cli 时使用
                // await context.Database.MigrateAsync();
                Console.WriteLine("数据库连接成功。");

                // 添加一个新的 Author
                var newAuthor = new Author { Name = "New Author " + Guid.NewGuid().ToString().Substring(0, 4) };
                context.Authors.Add(newAuthor);
                await context.SaveChangesAsync();
                Console.WriteLine($"添加新作者: {newAuthor.Name}, ID: {newAuthor.Id}");

                // 查询所有书籍
                var books = await context.Books.Include(b => b.Author).ToListAsync();
                Console.WriteLine("\n当前所有书籍:");
                foreach (var book in books)
                {
                    Console.WriteLine($"- ID: {book.Id}, Title: {book.Title}, Author: {book.Author?.Name ?? "N/A"}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"发生错误: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
            }
        }

        Console.WriteLine("\n手动初始化 DbContext 示例结束.");
    }
}
```

#### 使用DbContext工厂`IDbContextFactory<TDbContext>`

1. 定义`ApplicationDbContext`

```CS
// ApplicationDbContext.cs
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
}
```

2. 注册DbContext工厂

```CS
// Program.cs
builder.Services.AddDbContextFactory<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 4, 4)),  // 指定MySQL版本
        mySqlOptions => mySqlOptions.EnableRetryOnFailure()  // 可选：启用重试
    ));
```

3. 使用

> [!IMPORTANT]
>
> 请注意，以这种方式创建的 `DbContext` 实例并非由应用程序的服务提供程序进行管理，因此必须由应用程序释放。
>
> 推荐使用`using`关键字

```CS
// 假设您有一个后台服务（BackgroundService），需要定期查询数据库
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

public class MyBackgroundService : BackgroundService
{
    private readonly IDbContextFactory<AppDbContext> _dbContextFactory;
    private readonly ILogger<MyBackgroundService> _logger;

    public MyBackgroundService(IDbContextFactory<AppDbContext> dbContextFactory, ILogger<MyBackgroundService> logger)
    {
        _dbContextFactory = dbContextFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            // 使用using语句创建并自动Dispose DbContext
            using var dbContext = _dbContextFactory.CreateDbContext();

            try
            {
                // 示例：查询用户
                var users = await dbContext.Users.ToListAsync(stoppingToken);
                _logger.LogInformation("Found {Count} users.", users.Count);

                // 示例：添加用户
                var newUser = new User { Name = "New User" };
                dbContext.Users.Add(newUser);
                await dbContext.SaveChangesAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in background task.");
            }

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);  // 每分钟执行一次
        }
    }
}
```

### `DbContextOptions`

`DbContextOptions<TContext>`（或其非泛型版本`DbContextOptions`）是Entity Framework Core (EF Core)中的一个核心配置类，用于定义和传递`DbContext`的各种选项和行为。它本质上是一个构建器（Builder），允许您在创建DbContext实例时指定：

- **数据库提供者**：如MySQL、SQL Server等（通过扩展方法如`UseMySql`）。
- **连接字符串**：数据库连接细节。
- **高级配置**：如查询日志、异常重试、敏感数据日志、查询跟踪行为、模型缓存等。
- **扩展性**：可以自定义行为，例如启用懒加载、配置连接池大小等。

#### 在DI中配置DbContextOptions

这是最常见的方式。在注册DbContext工厂时，使用lambda构建选项：

```CS
// Program.cs
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Storage;  // 如果使用Pomelo提供者

var builder = WebApplication.CreateBuilder(args);

// 注册DbContext工厂，并配置DbContextOptions
builder.Services.AddDbContextFactory<AppDbContext>(options =>
{
    // 核心：使用MySQL提供者
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),  // 从appsettings.json获取连接字符串
        new MySqlServerVersion(new Version(8, 4, 4)),  // 指定MySQL服务器版本（匹配您的8.4.4）
        mySqlOptions =>
        {
            // 可选：MySQL特定配置
            mySqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,  // 失败重试次数
                maxRetryDelay: TimeSpan.FromSeconds(10),  // 最大延迟
                errorNumbersToAdd: null  // 可添加特定MySQL错误码
            );
            mySqlOptions.CharSet(CharSet.Utf8mb4);  // 设置字符集，推荐utf8mb4以支持表情符号等
        }
    );

    // 通用EF Core选项配置
    options.EnableSensitiveDataLogging();  // 启用敏感数据日志（开发环境用，生产禁用）
    options.EnableDetailedErrors();  // 详细错误信息（开发用）
    options.LogTo(Console.WriteLine, LogLevel.Information);  // 将EF Core日志输出到控制台

    // 可选：禁用查询跟踪（提高性能，如果不需ChangeTracker）
    // options = options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);

    // 可选：启用懒加载（需安装Microsoft.EntityFrameworkCore.Proxies包）
    // options.UseLazyLoadingProxies();
});

// 其他服务注册...

var app = builder.Build();
app.Run();
```

在您的`AppDbContext`类中，通常只需在构造函数中接收它：

```CS
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // ... 其他代码如DbSet<User>等
}
```



#### 常见的数据库提供程序

| 数据库系统              | 配置示例                                     | NuGet 程序包                                                 |
| :---------------------- | :------------------------------------------- | :----------------------------------------------------------- |
| SQL Server 或 Azure SQL | `.UseSqlServer(connectionString)`            | [Microsoft.EntityFrameworkCore.SqlServer](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.SqlServer/) |
| Azure Cosmos DB         | `.UseCosmos(connectionString, databaseName)` | [Microsoft.EntityFrameworkCore.Cosmos](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.Cosmos/) |
| SQLite                  | `.UseSqlite(connectionString)`               | [Microsoft.EntityFrameworkCore.Sqlite](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.Sqlite/) |
| EF Core 内存中数据库    | `.UseInMemoryDatabase(databaseName)`         | [Microsoft.EntityFrameworkCore.InMemory](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.InMemory/) |
| PostgreSQL*             | `.UseNpgsql(connectionString)`               | [Npgsql.EntityFrameworkCore.PostgreSQL](https://www.nuget.org/packages/Npgsql.EntityFrameworkCore.PostgreSQL/) |
| MySQL/MariaDB*          | `.UseMySql(connectionString)`                | [Pomelo.EntityFrameworkCore.MySql](https://www.nuget.org/packages/Pomelo.EntityFrameworkCore.MySql/) |
| Oracle*                 | `.UseOracle(connectionString)`               | [Oracle.EntityFrameworkCore](https://www.nuget.org/packages/Oracle.EntityFrameworkCore/) |

> [!warning]
>
> EF Core 内存中数据库不是为生产用途设计的。 此外，它可能不是测试的最佳选择。 有关详细信息，请参阅[使用 EF Core 的测试代码](https://learn.microsoft.com/zh-cn/ef/core/testing/)。

#### `DbContextOptionsBuilder`的常见方法

| DbContextOptionsBuilder 方法                                 | 作用                                     | 了解更多                                                     |
| :----------------------------------------------------------- | :--------------------------------------- | :----------------------------------------------------------- |
| [UseQueryTrackingBehavior](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.entityframeworkcore.dbcontextoptionsbuilder.usequerytrackingbehavior) | 设置查询的默认跟踪行为                   | [查询跟踪行为](https://learn.microsoft.com/zh-cn/ef/core/querying/tracking) |
| [LogTo](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.entityframeworkcore.dbcontextoptionsbuilder.logto) | 获取 EF Core 日志的一种简单方法          | [日志记录、事件和诊断](https://learn.microsoft.com/zh-cn/ef/core/logging-events-diagnostics/) |
| [UseLoggerFactory](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.entityframeworkcore.dbcontextoptionsbuilder.useloggerfactory) | 注册 `Microsoft.Extensions.Logging` 工厂 | [日志记录、事件和诊断](https://learn.microsoft.com/zh-cn/ef/core/logging-events-diagnostics/) |
| [EnableSensitiveDataLogging](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.entityframeworkcore.dbcontextoptionsbuilder.enablesensitivedatalogging) | 在异常和日志记录中包括应用程序数据       | [日志记录、事件和诊断](https://learn.microsoft.com/zh-cn/ef/core/logging-events-diagnostics/) |
| [EnableDetailedErrors](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.entityframeworkcore.dbcontextoptionsbuilder.enabledetailederrors) | 更详细的查询错误（以性能为代价）         | [日志记录、事件和诊断](https://learn.microsoft.com/zh-cn/ef/core/logging-events-diagnostics/) |
| [ConfigureWarnings](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.entityframeworkcore.dbcontextoptionsbuilder.configurewarnings) | 忽略或引发警告和其他事件                 | [日志记录、事件和诊断](https://learn.microsoft.com/zh-cn/ef/core/logging-events-diagnostics/) |
| [AddInterceptors](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.entityframeworkcore.dbcontextoptionsbuilder.addinterceptors) | 注册 EF Core 侦听器                      | [日志记录、事件和诊断](https://learn.microsoft.com/zh-cn/ef/core/logging-events-diagnostics/) |
| [UseLazyLoadingProxies](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.entityframeworkcore.proxiesextensions.uselazyloadingproxies) | 使用动态代理进行延迟加载                 | [延迟加载](https://learn.microsoft.com/zh-cn/ef/core/querying/related-data/lazy) |
| [UseChangeTrackingProxies](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.entityframeworkcore.proxiesextensions.usechangetrackingproxies) | 使用动态代理进行更改跟踪                 | 即将推出...                                                  |

### `DbContextPool`

**`DbContext` 池（DbContext Pooling）** 是一种性能优化机制，它允许框架重用 `DbContext` 实例，而不是每次都创建和销毁，从而减少了内存分配和 GC 压力。

#### 作用

虽然 `DbContext` 实例应该是短暂的，但每次创建新的 `DbContext` 实例，EF Core 都需要执行一些初始化工作，例如：

- **创建新的 `DbContext` 对象**。
- **注册服务**：`DbContext` 内部有很多服务（如变更跟踪器、查询编译器等），这些服务在 `DbContext` 首次创建时可能需要初始化。
- **模型构建 (Model Building)**：尽管模型构建大部分工作只在应用程序生命周期内执行一次，但某些与 `DbContext` 实例相关的组件可能仍有少量初始化。

在高并发环境下，如果每秒钟有成百上千个请求，每次请求都完全从零开始创建一个 `DbContext` 实例，这些看似微小的开销累计起来也会变得可观。

**上下文池的目标**就是通过**重用现有但空闲的 `DbContext` 实例**来消除这部分初始化开销，从而提升应用程序的性能和吞吐量。

#### 工作流程

1. **创建池**：EF Core 会在应用程序启动时创建一个 `DbContext` 实例的池子。
2. **获取实例**：当应用程序需要一个 `DbContext` 实例时，它会首先尝试从池中获取一个**空闲的、未被使用的实例**。
3. **重置状态**：从池中取出的 `DbContext` 实例会被重置到其“干净”状态（即没有实体被跟踪），然后才被应用程序使用。
4. **归还实例**：当 `DbContext` 实例被使用完毕（例如，HTTP 请求结束，作用域被销毁），它不会被立即销毁，而是被**归还到池中**，等待下一次重用。


#### 配置方式

在 `Program.cs`中，将 `AddDbContext` 替换为 `AddDbContextPool`：

```C#
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// ... 获取连接字符串 ...

// 启用 DbContext 池
builder.Services.AddDbContextPool<ApplicationDbContext>(options =>
{
    options.UseMySql(connectionString,
        ServerVersion.AutoDetect(connectionString))
}, poolSize: 128);	// 设置池子的大小

// ... 其他服务和应用配置 ...
```

> EF Core 会维护一个池，默认最多保留 **1024 个上下文实例**

#### 注意事项

- **仅适用于 `DbContext` 类型具有无参构造函数或只接受 `DbContextOptions<TContext>` 参数的构造函数。**（这是最常见的，通常不是问题）

- **不适用于每个请求都传递配置信息给 `DbContext` 的场景。** 因为池化的实例是预先配置好的。

- **状态管理**：

  - `DbContext` 从池中取出时会**被重置**，这意味着你**不能**依赖 `DbContext` 实例在不同请求之间维护任何自定义状态。如果你在 `DbContext` 中添加了自定义字段并期望它们在重用时保持状态，那将是个问题。

  - EF Core 会确保重置其**内部**状态（如变更跟踪器），但如果你有自定义的业务逻辑在 `DbContext` 构造函数中执行，并且这些逻辑是昂贵的或有副作用的，那么池化可能不会带来太大收益，或者需要额外小心。

- **并发访问**：池化的 `DbContext` 实例仍然**不是线程安全的**。每个请求从池中获取一个实例，使用完毕后归还。在单个请求内部，不要在多个线程间共享同一个 `DbContext` 实例。

- **池的大小**：默认情况下，池的大小是有限的。如果并发请求数超出池的容量，新的 `DbContext` 实例仍然会被创建。你可以通过 `options.UsePooledDbContextFactory` 来配置池的最大大小（但这通常不是直接通过 `AddDbContextPool` 的参数）。

### 查询缓存与参数化

当你使用 LINQ 查询（例如 `_context.Books.Where(b => b.Id == 1).ToList()`）时，EF Core 需要执行一系列复杂的步骤才能将其发送到数据库并获取结果：

1. **LINQ 表达式树解析**：将你的 C# LINQ 代码解析成一个表达式树。
2. **SQL 翻译**：将表达式树翻译成相应的数据库 SQL 查询语句。
3. **SQL 编译**：数据库收到 SQL 语句后，会对其进行编译，生成一个高效的执行计划。
4. **结果集物化**：从数据库获取结果集，并将其转换（物化）为 C# 实体对象。

**查询计划缓存**就是指 EF Core 及其底层的数据库驱动程序会缓存步骤 2 和 3 的结果。

**工作流程：**

1. **首次执行**：当一个特定的 LINQ 查询首次执行时，EF Core 会完成所有上述步骤，并将生成的 SQL 语句及其编译后的数据库执行计划存储在内存中。

2. **后续执行**：当具有**相同结构**但**不同参数值**的 LINQ 查询再次执行时：

   - EF Core 会识别出它与已缓存的查询结构相同。

   - 它会重用之前翻译好的 SQL 语句模板。

   - 数据库也会重用之前编译好的执行计划，只是将新的参数值传递给它。

### 动态构造的查询

#### if条件判断+LINQ表达式

#### `Expression`表达式树

##### 概念

`Expression` 表达式 代表了**可执行代码的数据结构化表示**。

简单来说，它将你通常编写的 C# 代码（例如方法调用、算术运算、属性访问、Lambda 表达式等）转换成了一个可以被程序在运行时分析、修改、编译和执行的**对象模型**。

它就像是在程序中创建一个「代码的 AST（抽象语法树）」，而不是立即执行它。

**Expression的家族结构：**

| 类型                    | 作用                                        |
| ----------------------- | ------------------------------------------- |
| `Expression`（抽象类）  | 所有表达式的基类                            |
| `Expression<TDelegate>` | 用于表示 Lambda 表达式                      |
| `ParameterExpression`   | 变量、参数，如 `x`                          |
| `ConstantExpression`    | 常量，如 `"张三"`、123                      |
| `MemberExpression`      | 属性或字段，如 `x.Name`                     |
| `BinaryExpression`      | 二元运算，如 `x.Age > 18`                   |
| `LambdaExpression`      | Lambda 表达式本体，如 `x => x.Name == "张"` |

##### 使用案例

示例1：基本构造一个`X => X.AGE > 18`

等价于：

```CS
Expression<Func<User, bool>> expr = x => x.Age > 18;
```

构造方式：

```CS
// 参数 x
var param = Expression.Parameter(typeof(User), "x");

// 属性 x.Age
var ageProp = Expression.Property(param, "Age");

// 常量 18
var const18 = Expression.Constant(18);

// 比较 x.Age > 18
var body = Expression.GreaterThan(ageProp, const18);

// 构建 lambda
var lambda = Expression.Lambda<Func<User, bool>>(body, param);
```

执行表达式：

```CS
var func = lambda.Compile(); // 转换为可执行委托
bool result = func(new User { Age = 20 }); // true
```

---

示例2：组合多个条件（用于动态查询）

比如：`x => x.Name.Contains("张") && x.Age > 18`

```CS
var param = Expression.Parameter(typeof(User), "x");

var nameProp = Expression.Property(param, "Name");
var containsMethod = typeof(string).GetMethod("Contains", [typeof(string)]);
var nameCondition = Expression.Call(nameProp, containsMethod!, Expression.Constant("张"));

var ageProp = Expression.Property(param, "Age");
var ageCondition = Expression.GreaterThan(ageProp, Expression.Constant(18));

var body = Expression.AndAlso(nameCondition, ageCondition);

var lambda = Expression.Lambda<Func<User, bool>>(body, param);
```

---

示例3：动态过滤字符串（字段名称和值运行时决定）

```CS
public static Expression<Func<T, bool>> BuildEqualExpression<T>(string fieldName, object value)
{
    var param = Expression.Parameter(typeof(T), "x");
    var property = Expression.Property(param, fieldName);
    var constant = Expression.Constant(value);
    var body = Expression.Equal(property, constant);
    return Expression.Lambda<Func<T, bool>>(body, param);
}
```

```CS
var expr = BuildEqualExpression<User>("Name", "张三");
var list = context.Users.Where(expr).ToList();
```

##### 动态组合表达式（借助LinqKit的`PredicateBuilder`）

```CS
using LinqKit;

var predicate = PredicateBuilder.New<User>();

if (!string.IsNullOrEmpty(name))
    predicate = predicate.And(u => u.Name.Contains(name));

if (age.HasValue)
    predicate = predicate.And(u => u.Age == age.Value);

var result = context.Users.AsExpandable().Where(predicate).ToList();

```

### 已编译的模型

已编译模型是将 `DbContext` 的元数据提前编译并缓存为 .NET IL 代码或对象，以避免运行时重复构建模型（Model Building）。

#### 问题引入

当你首次运行 EF Core 应用程序时，或者第一次使用 `DbContext` 实例时，EF Core 需要执行一个重要的步骤：**构建其内部的数据库模型**。这个过程涉及到：

1. **扫描你的实体类**：识别所有的 `DbSet` 属性。
2. **应用约定 (Conventions)**：根据默认规则推断实体之间的关系、主键、属性类型等。
3. **应用数据注解 (Data Annotations)**：处理你在实体类上定义的 `[Table]`, `[Key]`, `[Required]` 等特性。
4. **应用 Fluent API 配置**：执行你在 `OnModelCreating` 方法中定义的所有配置（包括通过 `IEntityTypeConfiguration` 应用的配置）。
5. **生成内部元数据**：创建 EF Core 运行时使用的所有内部模型元数据结构。

对于包含大量实体、复杂关系或广泛配置的大型模型来说，这个模型构建过程可能会相当耗时，导致应用程序的**首次请求响应时间 (TTFB - Time To First Byte)** 变长，或者在应用程序启动时有明显的延迟。

**已编译的模型就是为了解决这个“启动时模型构建开销”的问题而诞生的。**

#### 工作原理

已编译模型的核心思想是：**将模型构建的逻辑从运行时提前到编译时或构建时，并将构建好的模型序列化为 C# 代码。**

具体步骤如下：

1. **生成模型代码**：EF Core 命令行工具 (CLI) 会分析你的 `DbContext` 和实体，然后生成一个包含模型定义的 C# 文件。这个生成的文件包含一个经过优化、预先构建的模型表示。
2. **编译生成代码**：这个生成的 C# 文件会被编译到你的应用程序程序集中。
3. **运行时加载**：当应用程序启动时，EF Core 会直接加载这个预编译的模型，而不是在运行时动态构建它。这大大减少了模型初始化的时间。

#### 使用场景

| 场景                                 | 是否推荐                         |
| ------------------------------------ | -------------------------------- |
| 模型实体类数量非常多（>100个）       | ✅ 强烈推荐                       |
| 短生命周期服务 / 云函数              | ✅ 推荐                           |
| 模型配置复杂，首次构建很慢           | ✅ 推荐                           |
| 小型项目 / 内网后台 / 轻量接口       | ❌ 一般不需要                     |
| 使用 Code-First + Migration 动态变更 | ⚠️ 谨慎使用（需同步重新编译模型） |

#### 使用步骤

1. 安装工具包

```BASH
dotnet add package Microsoft.EntityFrameworkCore.Design
```

2. 创建一个类用于模型编译

```CS
public class MyDbContext : DbContext
{
    public DbSet<User> Users => Set<User>();

    public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(x => x.Name);
        // 可添加其他模型配置
    }
}
```

3. 生成已编译模型的代码（CLI命令）

```BASH
dotnet ef dbcontext optimize --output-dir CompiledModels
```

会在项目中生成一个包含 `.cs` 文件的目录，例如：

```TXT
CompiledModels/
  MyDbContextModel.cs
```

4. 在运行时使用已经编译的模型

```CS
var options = new DbContextOptionsBuilder<MyDbContext>()
    .UseSqlServer("YourConnectionString")
    .UseModel(MyDbContextModel.Instance) // 指定使用已编译模型
    .Options;

using var db = new MyDbContext(options);
```

#### 注意事项

1. **模型一旦修改，需要重新生成编译模型**

- 否则运行时报错或模型不同步。

- 修改模型实体类或 Fluent API 后必须重新运行：

  ```BASH
  dotnet ef dbcontext optimize
  ```

2. **和 Migration 共存**

- 已编译模型是优化运行时性能，不影响迁移管理，只要保持一致即可。

3. **不能与 `UseLazyLoadingProxies` 混用**

- 懒加载代理不兼容已编译模型。

