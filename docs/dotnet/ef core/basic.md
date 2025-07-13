---
title: 基础篇
shortTitle: 基础篇
description: EF CORE
date: 2025-07-12 17:37:33
categories: [.NET, EF CORE]
tags: [.NET]
---

## DbContext配置和初始化

### 概述

#### 定义

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
- **如何在 ASP.NET Core 中管理？**
  - 在 ASP.NET Core 中，`DbContext` 通常通过**依赖注入 (Dependency Injection - DI)** 进行注册和管理。
  - 默认情况下，`DbContext` 会被注册为 **`Scoped` (作用域)** 生命周期。这意味着在每个 HTTP 请求的生命周期内，只会创建一个 `DbContext` 实例。请求结束，`DbContext` 实例就会被销毁。这完美符合“每个工作单元使用一个新实例”的最佳实践。

#### 使用方式

`DbContext` 的配置主要通过重写 `OnConfiguring` 方法或更常见的通过**依赖注入**在 `Program.cs` (或 `Startup.cs`) 中进行。

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

- **通过依赖注入 (`Program.cs` / `Startup.cs`) (Web 应用推荐)**：

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

#### 池的必要性

虽然 `DbContext` 实例应该是短暂的，但每次创建新的 `DbContext` 实例，EF Core 都需要执行一些初始化工作，例如：

- **创建新的 `DbContext` 对象**。
- **注册服务**：`DbContext` 内部有很多服务（如变更跟踪器、查询编译器等），这些服务在 `DbContext` 首次创建时可能需要初始化。
- **模型构建 (Model Building)**：尽管模型构建大部分工作只在应用程序生命周期内执行一次，但某些与 `DbContext` 实例相关的组件可能仍有少量初始化。

在高并发环境下，如果每秒钟有成百上千个请求，每次请求都完全从零开始创建一个 `DbContext` 实例，这些看似微小的开销累计起来也会变得可观。

**上下文池的目标**就是通过**重用现有但空闲的 `DbContext` 实例**来消除这部分初始化开销，从而提升应用程序的性能和吞吐量。

#### 工作原理

1. **创建池**：EF Core 会在应用程序启动时创建一个 `DbContext` 实例的池子。
2. **获取实例**：当应用程序需要一个 `DbContext` 实例时，它会首先尝试从池中获取一个**空闲的、未被使用的实例**。
3. **重置状态**：从池中取出的 `DbContext` 实例会被重置到其“干净”状态（即没有实体被跟踪），然后才被应用程序使用。
4. **归还实例**：当 `DbContext` 实例被使用完毕（例如，HTTP 请求结束，作用域被销毁），它不会被立即销毁，而是被**归还到池中**，等待下一次重用。

#### 使用方式

在 `Program.cs` (或 `Startup.cs`) 中，将 `AddDbContext` 替换为 `AddDbContextPool`：

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
- - `DbContext` 从池中取出时会**被重置**，这意味着你**不能**依赖 `DbContext` 实例在不同请求之间维护任何自定义状态。如果你在 `DbContext` 中添加了自定义字段并期望它们在重用时保持状态，那将是个问题。
  - EF Core 会确保重置其**内部**状态（如变更跟踪器），但如果你有自定义的业务逻辑在 `DbContext` 构造函数中执行，并且这些逻辑是昂贵的或有副作用的，那么池化可能不会带来太大收益，或者需要额外小心。
- **并发访问**：池化的 `DbContext` 实例仍然**不是线程安全的**。每个请求从池中获取一个实例，使用完毕后归还。在单个请求内部，不要在多个线程间共享同一个 `DbContext` 实例。
- **池的大小**：默认情况下，池的大小是有限的。如果并发请求数超出池的容量，新的 `DbContext` 实例仍然会被创建。你可以通过 `options.UsePooledDbContextFactory` 来配置池的最大大小（但这通常不是直接通过 `AddDbContextPool` 的参数）。

## 创建模型

### 概述

#### 定义

EF Core 模型是 EF Core 用于**理解你的实体类（C# 对象）如何与数据库表、列、关系以及约束等对应起来**的映射信息。

当你用 LINQ 查询数据时，EF Core 就是依据这个模型将你的 C# 代码翻译成 SQL；当你调用 `SaveChanges()` 时，它也是依据这个模型生成 INSERT/UPDATE/DELETE 语句。

这个模型包括：

- **实体类型 (Entity Types)**：对应数据库中的表。通常是你的 C# 类。
- **属性 (Properties)**：对应数据库表中的列。通常是你的 C# 类的属性。
- **主键 (Primary Keys)**：用于唯一标识实体。
- **外键 (Foreign Keys) 和关系 (Relationships)**：定义实体之间如何关联（例如，一个订单对应多个订单项）。
- **索引 (Indexes)**：用于优化查询性能。
- **数据类型映射**：C# 类型如何映射到数据库的特定数据类型（例如，`string` 到 `NVARCHAR`，`decimal` 到 `DECIMAL(18,2)`）。
- **约束 (Constraints)**：例如，非空约束、唯一约束等。

#### 使用方式

**约定：**

这是最基础也是最“隐式”的方式。当你什么都不做时，EF Core 会根据一组**默认约定**来推断你的 C# 类和属性的映射关系。

- **约定是如何工作的？** EF Core 会扫描你的 `DbContext` 中的 `DbSet<TEntity>` 属性。对于每个 `TEntity`，它会假设：
  - `TEntity` 类对应一个同名的数据库表（例如，`DbSet<Product>` 对应 `Products` 表）。
  - 类的公共属性对应表的列。
  - 名为 `Id` 或 `<ClassName>Id` 的整数属性会被认为是**主键**。
  - 一个实体类中包含另一个实体类的导航属性（例如 `Order` 类包含 `Customer Customer` 属性），并且有对应的外键属性（例如 `CustomerId`），EF Core 会尝试推断**关系**。
- **优点**：简单、快速，无需额外配置，适合简单的实体映射。
- **缺点**：灵活性有限，对于不符合约定的场景无能为力。

---

**数据注解：**

数据注解是通过在实体类和属性上应用 C# **特性 (Attributes)** 来配置模型的。它比约定更具表现力，允许你覆盖某些默认约定。

- **如何工作？** 你在类或属性前面加上特定的特性，如 `[Key]`, `[Required]`, `[MaxLength(100)]`, `[Table("MyCustomTable")]`, `[Column("MyColumnName", TypeName = "decimal(18,2)")]` 等。
- **优点**：
  - **直观且代码内联**：映射信息直接写在实体类旁边，易于理解。
  - **对简单配置很方便**：对于常见的约束和命名约定，数据注解非常简洁。
- **缺点**：
  - **污染实体类**：映射细节与业务逻辑混合在一起，可能使实体类变得臃肿。
  - **限制性**：不能表达所有可能的模型配置（例如复合主键、复杂的索引、多对多关系的中间表等）。
  - **不易重构**：如果需要重用实体类而又不想带上特定的数据库映射，数据注解就不太方便。

---

**Fluent API：**

这是最强大和最灵活的配置模型的方式。你可以在 `DbContext` 的 `OnModelCreating` 方法中使用一系列链式调用的 API 来详细配置你的模型。

- **如何工作？** 你在 `ApplicationDbContext` 的 `OnModelCreating` 方法中，通过 `modelBuilder` 对象来配置实体。

```C#
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // 配置 Product 实体
    modelBuilder.Entity<Product>(entity =>
    {
        // 指定表名
        entity.ToTable("Products");

        // 配置主键
        entity.HasKey(e => e.Id);

        // 配置 Name 属性
        entity.Property(e => e.Name)
              .IsRequired()
              .HasMaxLength(150);

        // 配置 Price 属性
        entity.Property(e => e.Price)
              .HasColumnType("decimal(18, 2)");

        // 配置关系 (例如，Product 属于某个 Category)
        // entity.HasOne(p => p.Category)
        //       .WithMany(c => c.Products)
        //       .HasForeignKey(p => p.CategoryId);
    });

    // 也可以配置其他实体...
    // modelBuilder.Entity<Order>(entity => { /* ... */ });
}
```

**优点**：

- **强大的灵活性**：可以表达约定和数据注解无法表达的所有模型配置。
- **干净的实体类**：将映射细节与实体类的业务逻辑分离，保持实体类简洁。
- **易于集中管理**：所有的数据库映射配置都集中在 `DbContext` 中，便于管理和审查。
- **解决重用问题**：同一个实体类可以根据不同的 `DbContext` 或配置，映射到不同的数据库结构。

**缺点**：

- **代码量较大**：对于简单的映射，Fluent API 可能会显得冗余。
- **学习曲线**：需要熟悉一系列的 Fluent API 方法。

---

**三者的结合使用：**

EF Core 允许你同时使用这三种方式，并且它们之间有**优先级**：

**Fluent API > 数据注解 > 约定**

这意味着：

1. 如果某个配置在**Fluent API** 中指定了，它会覆盖数据注解和约定的设置。
2. 如果某个配置在**数据注解**中指定了，它会覆盖约定的设置。
3. 如果某个配置**只通过约定**推断，那就按照约定来。

这种优先级机制使得你可以根据需求的复杂程度灵活选择配置方式。对于大多数项目，一个常见的策略是：

- **让约定做大部分工作**，特别是对于简单的表名和主键。
- **使用数据注解**来处理一些简单的覆盖，比如 `[Required]`、`[MaxLength]` 等。
- **使用 Fluent API**来处理复杂的映射、关系配置，或者当数据注解无法满足需求时。

### 实体类型

**实体类型 (Entity Type)** 是指一个普通的 .NET 类，EF Core 知道如何将其**映射**到数据库中的**表**或**视图**。

当 EF Core 构建模型时，它会识别出这些实体类型，并将它们作为数据库模型中的“表”来对待，然后基于它们的属性来推断出“列”。

#### 使用方式

##### DbSet

只要你在 `DbContext` 类中包含一个**公共的 `DbSet<TEntity>` 属性**，EF Core 就会自动将 `TEntity` 识别为一个实体类型。

```CS
public class ApplicationDbContext : DbContext
{
    // EF Core 会发现 DbSet<Product>，并将 Product 识别为实体类型
    public DbSet<Product> Products { get; set; }

    // EF Core 也会发现 DbSet<Category>，并将其识别为实体类型
    public DbSet<Category> Categories { get; set; }
}

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; } // 这是导航属性
}

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<Product> Products { get; set; } // 这是导航属性
}
```

##### Fluent API

通过在 `OnModelCreating` 方法中使用 Fluent API 来**显式**地将一个类添加到模型中，而无需在 `DbContext` 中创建 `DbSet` 属性。

这在某些高级场景中非常有用，例如：

- 你想映射一个**没有主键**的类（这在 EF Core 5.0 之后变得可能，称为**无键实体类型**）。
- 你希望将一个类映射到数据库中的**视图**或**存储过程**，而不是表。

假设你有一个 `ProductView` 类，你只想将其映射到数据库中的一个只读视图，而不希望它出现在 `DbContext` 的 `DbSet` 属性中

```CS
public class ApplicationDbContext : DbContext
{
    // 这里没有 DbSet<ProductView> 属性

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // 显式地将 ProductView 注册为实体类型
        modelBuilder.Entity<ProductView>(eb =>
        {
            // 它是一个“无键实体类型”
            eb.HasNoKey(); 
            // 映射到数据库中的一个视图
            eb.ToView("AllProductsView"); 
        });

        // 也可以像这样添加一个普通的实体类型
        // modelBuilder.Entity<Product>();
    }
}

public class ProductView
{
    public int ProductId { get; set; }
    public string ProductName { get; set; }
    public string CategoryName { get; set; }
}
```

#### 实体类型的满足条件

为了被 EF Core 识别并映射为实体类型，一个类必须满足一些基本条件：

- 它必须是一个**类**（不能是接口或抽象类）。
- 它不能是**静态类**。
- 它必须有一个**公共的无参构造函数**，或者 EF Core 能够找到一个可以调用的构造函数来创建实例。
- 它不能被 `[NotMapped]` 特性标记，或者在 Fluent API 中被配置为忽略。

### 实体属性



### 钥匙



### 生成的值



### 阴影和索引器属性



### 关系



### 索引和约束



### 继承



### 序列



### 支持字段



### 值转换



### 值比较器



### 数据种子设定



### 实体类型构造函数



### 高级表映射



### 从属实体类型



### 空间数据



### 批量配置



### 具有相同DbContext的交替模型



## 管理数据库架构



## 查询数据



## 保存数据



## 更改耿总



## 日志记录、事件和诊断









