---
title: DbContext配置和初始化
shortTitle: DbContext配置
description: DbContext配置和初始化
date: 2025-07-12 17:37:33
categories: [.NET, EF CORE]
tags: [.NET]
order: 1
---

## DbContext配置和初始化

### 概述

`DbContext` 是 EF Core 的核心，它扮演着以下几个关键角色：

- **数据库会话 (Database Session)**：`DbContext` 的一个实例代表了与数据库的一次会话或工作单元。在这个会话中，你可以加载实体、跟踪它们的更改、保存数据。
- **DbSet 集合**：你的 `DbContext` 子类会包含 `DbSet<TEntity>` 属性，每个 `DbSet` 对应数据库中的一个表，并允许你对该表中的实体执行 LINQ 查询和 CRUD 操作。
  - 例如：`public DbSet<Product> Products { get; set; }` 意味着你的数据库有一个 `Products` 表，你可以通过 `_context.Products` 来访问和操作它。
- **变更跟踪 (Change Tracking)**：这是 EF Core 最强大的功能之一。`DbContext` 会自动跟踪从数据库加载的实体以及你添加到它的新实体。当这些实体发生变化时，`DbContext` 会记录这些变化，并在你调用 `SaveChanges()` 或 `SaveChangesAsync()` 时，生成相应的 SQL INSERT、UPDATE 或 DELETE 语句来同步数据库。
- **查询和保存数据**：它是你与数据库交互的主要入口点。你可以通过它执行 LINQ 查询、添加新实体、更新现有实体、删除实体，并将这些更改持久化到数据库。

#### 生命周期

`DbContext` 实例的生命周期通常是**短暂的**，并且每个工作单元（或每个 HTTP 请求）都应该使用**一个新的** `DbContext` 实例。这是 EF Core 的设计哲学，也是大多数 Web 应用程序的最佳实践。

- **为什么是短暂的？**
  - **变更跟踪**：一个 `DbContext` 实例会跟踪它加载的所有实体。如果一个实例存活时间过长，它跟踪的实体数量会不断增加，导致内存占用增多，性能下降。
  - **并发问题**：`DbContext` 不是线程安全的。多个线程同时使用同一个 `DbContext` 实例可能导致数据不一致或其他不可预测的行为。
  - **数据陈旧**：长时间存活的 `DbContext` 可能持有旧的数据，无法反映数据库中的最新更改。
- **如何在 .NET Core 中管理？**
  - 在 ASP.NET Core 中，`DbContext` 通常通过**依赖注入 (Dependency Injection - DI)** 进行注册和管理。
  - 默认情况下，`DbContext` 会被注册为 **`Scoped` (作用域)** 生命周期。这意味着在每个 HTTP 请求的生命周期内，只会创建一个 `DbContext` 实例。请求结束，`DbContext` 实例就会被销毁。这完美符合“每个工作单元使用一个新实例”的最佳实践。

#### 使用方式

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

  这种方式更加灵活，可以从配置源（如 `appsettings.json`）获取连接字符串，并且方便地集成到 ASP.NET Core 的整个 DI 体系中。

> DbContext 非线程安全，仅在单一线程或请求中使用。

### 上下文池

“上下文池”是 EF Core 提供的一种**性能优化技术**，它旨在解决创建和初始化 `DbContext` 实例可能带来的开销，特别是在高并发的 Web 应用程序中。

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

#### 查询缓存

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

#### 使用方式

在 `Program.cs`中，将 `AddDbContext` 替换为 `AddDbContextPool`：

```C#
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// ... 获取连接字符串 ...

// 启用 DbContext 池
builder.Services.AddDbContextPool<ApplicationDbContext>(options =>
    options.UseMySql(connectionString,
        ServerVersion.AutoDetect(connectionString))
);

// ... 其他服务和应用配置 ...
```

#### 注意事项

- **仅适用于 `DbContext` 类型具有无参构造函数或只接受 `DbContextOptions<TContext>` 参数的构造函数。**（这是最常见的，通常不是问题）

- **不适用于每个请求都传递配置信息给 `DbContext` 的场景。** 因为池化的实例是预先配置好的。

- **状态管理**：

  - `DbContext` 从池中取出时会**被重置**，这意味着你**不能**依赖 `DbContext` 实例在不同请求之间维护任何自定义状态。如果你在 `DbContext` 中添加了自定义字段并期望它们在重用时保持状态，那将是个问题。

  - EF Core 会确保重置其**内部**状态（如变更跟踪器），但如果你有自定义的业务逻辑在 `DbContext` 构造函数中执行，并且这些逻辑是昂贵的或有副作用的，那么池化可能不会带来太大收益，或者需要额外小心。

- **并发访问**：池化的 `DbContext` 实例仍然**不是线程安全的**。每个请求从池中获取一个实例，使用完毕后归还。在单个请求内部，不要在多个线程间共享同一个 `DbContext` 实例。

- **池的大小**：默认情况下，池的大小是有限的。如果并发请求数超出池的容量，新的 `DbContext` 实例仍然会被创建。你可以通过 `options.UsePooledDbContextFactory` 来配置池的最大大小（但这通常不是直接通过 `AddDbContextPool` 的参数）。
