---
title: 基础篇
shortTitle: 基础篇
description: EF CORE
date: 2025-07-12 17:37:33
categories: [.NET, EF CORE]
tags: [.NET]
order: 2
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

在 EF Core 中，**实体属性 (Entity Property)** 是指一个实体类型（C# 类）的属性，EF Core 知道如何将其**映射**到数据库中的**列**。

当 EF Core 构建模型时，它会识别出这些实体属性，并将它们作为数据库表中的“列”来对待。

#### 使用方式

##### 约定

这是默认的行为。EF Core 会自动将实体类型中**所有公共的、具有公共 getter 和 setter 的属性**视为实体属性，并将其映射到数据库表中同名的列。

```CS
public class Product
{
    public int Id { get; set; }        // 将映射到名为 'Id' 的列
    public string Name { get; set; }   // 将映射到名为 'Name' 的列
    public decimal Price { get; set; } // 将映射到名为 'Price' 的列
    public DateTime CreatedDate { get; set; } // 将映射到名为 'CreatedDate' 的列
}
```

**默认映射约定：**

- **列名**：通常与属性名相同。
- **数据类型**：EF Core 会根据 C# 类型推断最合适的数据库数据类型（例如，`int` 到 `INT`，`string` 到 `NVARCHAR(MAX)`，`decimal` 到 `DECIMAL`）。
- **可空性**：
  - C# **值类型**（`int`, `decimal`, `DateTime` 等）**默认是非空的**（`NOT NULL`），除非它们是可空类型（`int?`, `decimal?`, `DateTime?`）。
  - C# **引用类型**（`string`, `byte[]`, 复杂对象等）**默认是可空的**（`NULL`）。

##### 字段发现

EF Core 能够发现没有公共 getter 或 setter 的**字段**，并将它们映射到数据库列。这在实现**封装**或**值对象**模式时非常有用。

- **约定**：EF Core 会按优先级顺序查找与属性同名的私有字段、受保护字段等。
- **`[BackingField]` 特性**：可以显式指定一个属性使用哪个后备字段。
- **`UsePropertyAccessMode` (Fluent API)**：配置访问属性或字段的方式。

```CS
public class Product
{
    private string _name; // 私有字段作为 Name 属性的后备字段

    public int Id { get; set; }

    public string Name // 公共属性，但没有 setter
    {
        get => _name;
        set => _name = value ?? throw new ArgumentNullException(nameof(value));
    }

    public void UpdateName(string newName)
    {
        Name = newName; // 只能通过方法修改名称
    }

    // 也可以直接映射字段（不推荐直接映射私有字段，通常通过属性映射）
    // [Column("Description")]
    // private string _description;
}
```

#### 配置实体属性

当默认约定不满足需求时，你可以使用**数据注解**或 **Fluent API** 来详细配置实体属性的映射。

##### 数据注解

在属性上添加特性来配置。

- **`[Key]`**：标记为主键（如果属性名不是 `Id` 或 `<ClassName>Id`）。
- **`[Required]`**：标记为非空列（针对引用类型，如 `string`）。
- **`[MaxLength(length)]` / `[StringLength(length)]`**：指定字符串列的最大长度。`MaxLength` 不会在数据库中创建检查约束，而 `StringLength` 会。`MaxLength` 更常用。
- **`[Column("ColumnName", TypeName = "DbDataType")]`**：
  - `"ColumnName"`：指定数据库列的名称，覆盖默认的属性名。
  - `TypeName = "DbDataType"`：指定数据库的精确数据类型（例如 `decimal(18,2)`, `varchar(255)`）。
- **`[NotMapped]`**：告诉 EF Core **不要**将该属性映射到数据库列。
- **`[DatabaseGenerated(DatabaseGeneratedOption.Identity/Computed/None)]`**：
  - `Identity`：数据库自动生成值（如自增 ID）。
  - `Computed`：数据库在每次更新时计算值（如 SQL Server 的计算列）。
  - `None`：应用程序提供值，数据库不自动生成。
- **`[ConcurrencyCheck]`**：用于乐观并发控制。当实体被修改时，该列的值会被检查。

```CS
public class Product
{
    [Key] // 将 Id 标记为主键
    public int ProductId { get; set; } // 约定不会自动发现它为主键，需要 [Key]

    [Required] // 映射为 NOT NULL
    [MaxLength(200)] // 映射为 NVARCHAR(200)
    [Column("ProductName")] // 映射为数据库中的 'ProductName' 列
    public string Name { get; set; } = string.Empty;

    [Column(TypeName = "decimal(10, 2)")] // 映射为 DECIMAL(10, 2)
    public decimal Price { get; set; }

    [NotMapped] // 不映射到数据库列
    public string DisplayInfo { get; set; } = string.Empty;

    [DatabaseGenerated(DatabaseGeneratedOption.Computed)] // 假设这是个计算列
    public DateTime LastModified { get; set; }
}
```

##### Fluent API

在 `DbContext` 的 `OnModelCreating` 方法中使用链式调用的 API 来配置。Fluent API 提供了比数据注解更细粒度的控制，并且不会“污染”你的实体类。

- **`HasColumnName("ColumnName")`**：指定列名。
- **`HasColumnType("DbDataType")`**：指定数据库的精确数据类型。
- **`IsRequired()`**：标记为非空。
- **`HasMaxLength(length)`**：指定字符串最大长度。
- **`IsConcurrencyToken()`**：标记为并发令牌。
- **`HasDefaultValue(value)` / `HasDefaultValueSql("SQL_EXPRESSION")`**：设置列的默认值。
- **`ValueGeneratedOnAdd()` / `ValueGeneratedOnUpdate()` / `ValueGeneratedNever()`**：与 `DatabaseGenerated` 特性类似，控制值生成行为。
- **`Ignore(p => p.Property)`**：告诉 EF Core 忽略该属性，不映射到数据库列。

```C#
public class ApplicationDbContext : DbContext
{
    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity =>
        {
            // 配置主键
            entity.HasKey(e => e.ProductId); // 如果主键名为 ProductId 而不是 Id

            // 配置 Name 属性
            entity.Property(e => e.Name)
                  .HasColumnName("ProductName") // 列名为 ProductName
                  .HasMaxLength(200)           // 最大长度 200
                  .IsRequired();               // 非空

            // 配置 Price 属性
            entity.Property(e => e.Price)
                  .HasColumnType("decimal(10, 2)"); // 精确数据类型

            // 忽略 DisplayInfo 属性
            entity.Ignore(e => e.DisplayInfo);

            // 配置 CreatedDate 属性，使其在添加时自动生成值
            entity.Property(e => e.CreatedDate)
                  .HasDefaultValueSql("CURRENT_TIMESTAMP"); // 使用数据库的当前时间函数
                                                              // 对于MySQL，可能需要 NOW() 或 CURRENT_TIMESTAMP()
                                                              // 对于SQL Server，是 GETDATE()
        });
    }
}
```

#### 值的转换

有时，C# 类型和数据库类型之间没有直接的映射，或者你需要以不同的方式存储数据。**值转换**允许你在属性值进出数据库时进行转换。

**示例场景**：

- 将 C# 枚举 (`enum`) 存储为数据库中的字符串。
- 将复杂的 C# 对象（例如 `List<string>`）序列化为 JSON 字符串存储在数据库的单个文本列中。
- 将 `DateTime` 存储为 UTC 时间。

**配置方式**：通常通过 Fluent API `HasConversion()` 方法。



示例：枚举到字符串

```C#
public enum ProductStatus { OutOfStock, InStock, Discontinued }

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public ProductStatus Status { get; set; } // 枚举类型
}

public class ApplicationDbContext : DbContext
{
    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>()
            .Property(e => e.Status)
            .HasConversion<string>(); // 将 ProductStatus 枚举存储为字符串
            // 也可以使用 .HasConversion(
            //    v => v.ToString(),
            //    v => (ProductStatus)Enum.Parse(typeof(ProductStatus), v)
            // );
    }
}	
```

### 主键

#### 默认约定

EF Core 遵循以下约定来推断主键：

- **`Id` 属性**：如果实体类中有一个名为 `Id` 的属性（不区分大小写，例如 `id`, `ID`），并且其类型是数值类型（`int`, `long`, `Guid` 等），EF Core 会将其约定为主键。
- **`<ClassName>Id` 属性**：如果实体类中有一个名为 `<ClassName>Id` 的属性（例如，`Product` 类中有 `ProductId`），并且其类型是数值类型，EF Core 也会将其约定为主键。

```C#
public class Product
{
    // EF Core 会约定 Id 为主键
    public int Id { get; set; }
    public string Name { get; set; }
}

public class Order
{
    // EF Core 会约定 OrderId 为主键
    public int OrderId { get; set; }
    public DateTime OrderDate { get; set; }
}
```

#### 手动配置

当默认约定不适用时（例如，你的主键不叫 `Id` 或 `<ClassName>Id`，或者你想使用复合主键），你可以使用**数据注解**或 **Fluent API** 来显式配置键。

##### 数据注解

使用 `[Key]` 特性来标记一个或多个属性为主键。

**单个主键**

```C#
public class Customer
{
    [Key] // 明确指定 CustomerId 为主键
    public int CustomerId { get; set; }
    public string Name { get; set; }
}
```

**复合主键**：如果主键由多个属性组成，你需要将 `[Key]` 特性应用于所有构成复合主键的属性。EF Core 会按照属性名的字母顺序来确定这些键的顺序。

```C#
public class OrderItem
{
    [Key] // 构成复合主键的第一部分
    public int OrderId { get; set; }

    [Key] // 构成复合主键的第二部分
    public int ProductId { get; set; }

    public int Quantity { get; set; }
}
```

> [!TIP]
>
> 使用数据注解定义复合主键时，`[Key]` 的顺序并不重要，EF Core 会根据约定来处理。但通常建议保持一致性，例如按照字母顺序。

##### Fluent API

在 `DbContext` 的 `OnModelCreating` 方法中使用 `HasKey()` 方法来配置键。Fluent API 是定义键，特别是复合主键，最清晰和灵活的方式。

**单个主键**

```C#
public class ApplicationDbContext : DbContext
{
    public DbSet<Customer> Customers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Customer>()
            .HasKey(c => c.CustomerId); // 明确指定 CustomerId 为主键
    }
}
```

**复合主键**：使用 `HasKey()` 方法，并传入一个匿名对象，其中包含所有构成复合主键的属性。属性的顺序在匿名对象中**决定了复合主键的列顺序**。

```C#
public class ApplicationDbContext : DbContext
{
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<OrderItem>()
            // 明确指定 OrderId 和 ProductId 共同构成复合主键
            // 这里的顺序很重要，它决定了数据库中复合主键的列顺序
            .HasKey(oi => new { oi.OrderId, oi.ProductId });
    }
}
```

#### 主键类型和值生成

主键的类型会影响其值的生成方式。

- **整数类型 (`int`, `long`)**：

  - **默认**：EF Core 默认将整数主键配置为**数据库自动生成**（例如 SQL Server 的 `IDENTITY`，MySQL 的 `AUTO_INCREMENT`）。这意味着当你 `Add()` 一个新实体并 `SaveChanges()` 时，数据库会自动分配 ID。
  - **覆盖**：你可以通过数据注解 `[DatabaseGenerated(DatabaseGeneratedOption.None)]` 或 Fluent API `ValueGeneratedNever()` 来告诉 EF Core，主键值应由应用程序提供，而不是数据库生成。

  ```C#
  public class MyEntity
  {
      [Key]
      [DatabaseGenerated(DatabaseGeneratedOption.None)] // 值由应用程序提供
      public int Id { get; set; }
      public string Name { get; set; }
  }
  // 或者 Fluent API
  // modelBuilder.Entity<MyEntity>().Property(e => e.Id).ValueGeneratedNever();
  ```

#### 替代键

除了主键之外，你还可以定义**替代键 (Alternate Keys)**。替代键是一个或一组属性，它们的值也**必须是唯一的**，但它们**不是主键**。在数据库中，替代键通常通过**唯一索引 (Unique Index)** 来实现。

替代键主要用于：

- **强制唯一性**：确保某个列或某些列的组合是唯一的。
- **作为外键的目标**：有时候，外键可能不是指向另一个表的主键，而是指向其替代键。

**配置方式（仅能使用Fluent API）**

```C#
public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id); // 定义主键

            // 定义替代键：Email 地址必须是唯一的
            entity.HasAlternateKey(u => u.Email)
                  .HasName("AK_User_Email"); // 可以给替代键命名（可选）

            // 也可以定义复合替代键
            // entity.HasAlternateKey(u => new { u.FirstName, u.LastName });
        });
    }
}

public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
}
```



### 生成的值

#### 定义

**生成的值**是指在实体保存到数据库时，**数据库系统自身**负责为某个属性（对应数据库列）生成其值。应用程序不需要在发送数据之前显式地提供这个值。

这主要分为两种情况：

1. **添加时生成 (Value Generated On Add)**：值只在实体**第一次插入**数据库时生成。最常见的例子是**自增主键 (Identity)**，或者数据库生成的 GUID。
2. **更新时生成 (Value Generated On Update)**：值在实体**每次更新**时都会重新生成。常见的例子是**时间戳 (Timestamp)** 或 **最后修改时间**列，它们会在每次更新行时自动更新为当前时间。
3. **始终生成 (Value Generated On Add Or Update)**：值在实体**添加和更新**时都会生成。这通常也是时间戳/修改时间列。

#### 默认约定

EF Core 会根据某些约定来推断值的生成方式：

- **整数类型的主键 (`int`, `long`)**：默认约定为 `ValueGeneratedOnAdd`，映射到数据库的自增列（例如 SQL Server 的 `IDENTITY`，MySQL 的 `AUTO_INCREMENT`）。
- **GUID 类型的主键 (`Guid`)**：默认约定为 `ValueGeneratedNever`，即值由应用程序生成（通常是 `Guid.NewGuid()`）。如果你想让数据库生成 GUID，需要显式配置。
- **具有 `byte[]` 类型且名为 `RowVersion` 或 `Timestamp` 的属性**：默认约定为 `ValueGeneratedOnAddOrUpdate`，并标记为**并发令牌 (Concurrency Token)**，映射到数据库的 `TIMESTAMP` 或 `ROWVERSION` 类型，用于乐观并发控制。

#### 手动配置

当默认约定不符合你的需求时，你可以使用**数据注解**或 **Fluent API** 来显式配置属性的值生成行为。

##### 数据注解

使用 `[DatabaseGenerated]` 特性来控制值的生成。

- **`[DatabaseGenerated(DatabaseGeneratedOption.Identity)]`**：

  - 表示值在**添加时**由数据库生成。

  - 最常用于整数主键。

    ```C#
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // 数据库自增ID
        public int Id { get; set; }
        public string Name { get; set; }
    }
    ```

- **`[DatabaseGenerated(DatabaseGeneratedOption.Computed)]`**：

  - 表示值在**添加或更新时**由数据库计算生成。

  - 适用于 SQL Server 的计算列、数据库的默认值函数等。

  - EF Core 不会尝试在插入或更新时为这些列发送值。

    ```C#
    public class Order
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)] // 假设这是数据库中的计算列 (Quantity * UnitPrice)
        public decimal TotalPrice { get; set; }
    
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)] // 数据库的 NOW() 或 GETDATE() 函数
        public DateTime LastUpdated { get; set; }
    }
    ```

- **`[DatabaseGenerated(DatabaseGeneratedOption.None)]`**：

  - 表示值**从不**由数据库生成。

  - 值必须始终由**应用程序**提供。

  - 常用于 GUID 主键（当你希望在客户端生成 GUID）或非自增的自定义 ID。

    ```C#
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)] // Id 由应用程序生成，不自增
        public int Id { get; set; }
        public string Username { get; set; }
    }
    ```

##### Fluent API

在 `DbContext` 的 `OnModelCreating` 方法中使用链式调用的方法来配置。Fluent API 提供了更细粒度的控制，并且可以指定数据库的默认值或计算逻辑。

- **`ValueGeneratedOnAdd()`**：

  - 表示值在**添加时**生成

    ```C#
    modelBuilder.Entity<Product>()
        .Property(p => p.Id)
        .ValueGeneratedOnAdd(); // 对应 DatabaseGeneratedOption.Identity
    ```

- **`ValueGeneratedOnUpdate()`**：

  - 表示值在**更新时**生成

    ```C#
    modelBuilder.Entity<Order>()
        .Property(o => o.LastUpdated)
        .ValueGeneratedOnUpdate(); // 对应 DatabaseGeneratedOption.Computed，当仅需更新时
    ```

- **`ValueGeneratedOnAddOrUpdate()`**：

  - 表示值在**添加和更新时**都生成（这是 `DatabaseGeneratedOption.Computed` 的默认行为）

    ```C#
    modelBuilder.Entity<Order>()
        .Property(o => o.TotalPrice)
        .ValueGeneratedOnAddOrUpdate(); // 对应 DatabaseGeneratedOption.Computed
    ```

- **`ValueGeneratedNever()`**：

  - 表示值**从不**由数据库生成，始终由应用程序提供

    ```C#
    modelBuilder.Entity<User>()
        .Property(u => u.Id)
        .ValueGeneratedNever(); // 对应 DatabaseGeneratedOption.None
    ```

- **`HasDefaultValue(value)`**：

  - 设置列的**默认值**。EF Core 会在应用程序不提供值时使用此默认值

    ```C#
    modelBuilder.Entity<Product>()
        .Property(p => p.IsAvailable)
        .HasDefaultValue(true); // 如果不提供 IsAvailable，默认为 true
    ```

- **`HasDefaultValueSql("SQL_EXPRESSION")`**：

  - 设置列的**默认值**，使用**原始 SQL 表达式**。这是最强大的方式，可以利用数据库的内置函数

    ```c#
    modelBuilder.Entity<Product>()
        .Property(p => p.CreatedDate)
        .HasDefaultValueSql("CURRENT_TIMESTAMP"); // MySQL: CURRENT_TIMESTAMP, SQL Server: GETDATE()
    ```

- **`HasComputedColumnSql("SQL_EXPRESSION")`**：

  - 将列配置为数据库中的**计算列**，并提供计算列的 SQL 表达式。

  - 这个属性会自动被标记为 `ValueGeneratedOnAddOrUpdate`

    ```c#
    modelBuilder.Entity<Order>()
        .Property(o => o.TotalPrice)
        .HasComputedColumnSql("Quantity * UnitPrice"); // 数据库计算 TotalPrice
    ```

  - 还可以添加 `(bool stored)` 参数，例如 `HasComputedColumnSql("...", true)` 表示存储计算列（提高查询性能，但增加存储空间和写操作开销）。

#### 并发令牌

EF Core 使用**并发令牌**来实现**乐观并发控制**。当多个用户同时尝试修改同一条数据时，可以防止“丢失更新”的问题。

**工作原理**：

1. 当一个实体被从数据库读取时，其并发令牌的值也会被读取。
2. 当尝试更新或删除该实体时，EF Core 会在 WHERE 子句中包含并发令牌的原始值。
3. 如果更新成功，数据库会为并发令牌生成一个新值。
4. 如果并发令牌的原始值与数据库中的当前值不匹配（说明在读取后有其他用户修改了数据），更新或删除操作将失败，并抛出 `DbUpdateConcurrencyException` 异常。应用程序可以捕获此异常并处理冲突。

**配置方式**：

- **约定**：`byte[]` 类型的属性，如果命名为 `RowVersion` 或 `Timestamp`，会被自动配置为并发令牌和 `ValueGeneratedOnAddOrUpdate`。
- **数据注解**：使用 `[ConcurrencyCheck]` 特性。
- **Fluent API**：使用 `IsConcurrencyToken()` 方法。

```c#
public class Item
{
    public int Id { get; set; }
    public string Name { get; set; }

    // 约定会将其配置为并发令牌
    public byte[] RowVersion { get; set; } = null!; // 必须是非空且字节数组

    // 或者使用数据注解
    // [ConcurrencyCheck]
    // public DateTime LastUpdated { get; set; } // 可以是任何类型，但需要自行管理更新

    // 或者 Fluent API
    // modelBuilder.Entity<Item>()
    //     .Property(i => i.LastUpdated)
    //     .IsConcurrencyToken()
    //     .ValueGeneratedOnAddOrUpdate(); // 确保值在每次更新时生成
}
```

### 阴影和索引器属性

这两类属性是 EF Core 中相对高级但非常有用的概念，它们让你能够处理传统 C# 类中不直接存在，但在数据库层面又需要映射的属性。

#### 阴影属性

**阴影属性**是一种特殊的实体属性，它**不**在你的 C# 实体类中定义。相反，它只存在于 EF Core 的**模型**中，并对应数据库表中的一列。

**使用场景：**

- **数据库需要但 C# 实体不需要的属性**：有些数据库列可能只是为了内部操作或审计目的而存在，并不直接对应到 C# 实体类的业务逻辑属性。例如，`LastUpdatedUtc` 或 `CreatedByUserId`，你可能不希望它们出现在每个实体类中，但希望 EF Core 能够管理它们。
- **不希望污染实体类**：你希望保持 C# 实体类的简洁，只包含核心业务逻辑属性，而将一些数据库持久化相关的属性隐藏起来。
- **通用属性**：你可能想为多个实体类型添加相同的行为（如审计字段），而无需在每个 C# 类中都声明这些属性。
- **并发令牌**：在某些情况下，阴影属性也可以用作并发令牌。

**配置方式：**

阴影属性只能通过 **Fluent API** 来配置，因为它们不在 C# 类中。

示例：假设你希望 `Product` 表有一个 `LastUpdated` 列，记录产品最后更新的时间，但你不想在 `Product` 类中暴露这个属性。

```C#
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
}

public class ApplicationDbContext : DbContext
{
    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>()
            // 定义一个名为 "LastUpdated" 的阴影属性
            .Property<DateTime>("LastUpdated") // 属性名和类型
            .HasColumnType("datetime")         // 可以指定数据库类型
            .HasDefaultValueSql("CURRENT_TIMESTAMP") // 例如，添加时默认当前时间
            .ValueGeneratedOnAddOrUpdate(); // 并在添加或更新时由数据库生成值
    }
}
```

> 在上面的配置示例中，我们使用了 `HasDefaultValueSql` 和 `ValueGeneratedOnAddOrUpdate`，这意味着数据库会为你管理 `LastUpdated` 的值，你通常不需要手动设置。手动设置适用于**不**希望数据库自动生成值的阴影属性。

**使用方式：**

由于阴影属性不在 C# 实体类中，你不能直接通过 `product.LastUpdated` 来访问它。你需要通过 EF Core 的 `Entry` API 来访问

- 设置值（在添加、更新前）

  ```C#
  public async Task AddProductWithShadowProperty(Product product)
  {
      // 在保存前，手动为阴影属性赋值
      _context.Entry(product).Property("LastUpdated").CurrentValue = DateTime.UtcNow;
      _context.Products.Add(product);
      await _context.SaveChangesAsync();
  }
  ```

- 读取值

  ```C#
  public async Task<DateTime> GetProductLastUpdated(int productId)
  {
      var product = await _context.Products.FindAsync(productId);
      if (product != null)
      {
          // 从 EF Core Entry 获取阴影属性的值
          var lastUpdated = _context.Entry(product).Property("LastUpdated").CurrentValue;
          return (DateTime)lastUpdated;
      }
      return DateTime.MinValue; // 或抛出异常
  }
  ```

- 在LINQ查询中使用：使用 `EF.Property` 静态方法在 LINQ 查询中引用阴影属性。

  ```C#
  using Microsoft.EntityFrameworkCore;
  
  public async Task<List<Product>> GetRecentlyUpdatedProducts(DateTime threshold)
  {
      return await _context.Products
          .Where(p => EF.Property<DateTime>(p, "LastUpdated") > threshold)
          .OrderByDescending(p => EF.Property<DateTime>(p, "LastUpdated"))
          .ToListAsync();
  }
  ```

#### 索引器属性

**索引器属性**是一种特殊的实体属性，它允许你的实体类作为**属性包 (Property Bag)** 使用，而不是定义固定的属性列表。它的数据以键值对的形式存储，并通过索引器 `[key]` 进行访问。

主要使用场景：

- **灵活的、动态的或半结构化的数据**：当你的实体数据模型不完全固定，或者有些属性是动态添加的，无法在编译时确定所有列名时。例如，一个“设置”或“配置”实体，其键值对内容可能经常变化。
- **不确定的列名**：当数据库表中的列名可能经常变化，或者你不想硬编码到 C# 类中时。
- **映射到现有非固定模式的数据库**：当你需要与一个模式不严格的现有数据库交互时。

**配置方式：**

索引器属性也只能通过 **Fluent API** 来配置。

首先，你的 C# 实体类需要定义一个**索引器**。

```C#
public class Settings
{
    public int Id { get; set; } // 主键

    // 定义一个索引器，允许通过字符串键访问属性
    public object? this[string name]
    {
        get => _settings.GetValueOrDefault(name);
        set => _settings[name] = value;
    }

    private readonly Dictionary<string, object?> _settings = new();
}

public class ApplicationDbContext : DbContext
{
    public DbSet<Settings> Settings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Settings>()
            .HasKey(s => s.Id);

        // 告诉 EF Core 这是一个索引器实体类型
        modelBuilder.Entity<Settings>()
            .HasIndexerProperty<string>("Theme"); // 定义一个名为 "Theme" 的索引器属性（列）
        
        modelBuilder.Entity<Settings>()
            .HasIndexerProperty<int>("PageSize"); // 定义一个名为 "PageSize" 的索引器属性（列）

        // 可以继续添加更多索引器属性...
    }
}
```

在这个例子中，`Settings` 类并不直接有 `Theme` 或 `PageSize` 属性，但通过索引器和 Fluent API 的配置，EF Core 知道如何将 `settings["Theme"]` 映射到数据库的 `Theme` 列。

**使用方式：**

可以像使用普通属性一样使用索引器语法 `entity["key"]` 来读取和设置值，EF Core 会负责映射。

- 创建和设置值

  ```C#
  public async Task AddSettings()
  {
      var settings = new Settings();
      settings.Id = 1;
      settings["Theme"] = "Dark"; // 通过索引器设置值
      settings["PageSize"] = 20;
  
      _context.Settings.Add(settings);
      await _context.SaveChangesAsync();
  }
  ```

- 读取值

  ```C#
  public async Task<string?> GetThemeSetting(int settingsId)
  {
      var settings = await _context.Settings.FindAsync(settingsId);
      if (settings != null)
      {
          return settings["Theme"] as string; // 通过索引器读取值
      }
      return null;
  }
  ```

- 在LINQ查询中使用:`EF.Property`

  ```C#
  using Microsoft.EntityFrameworkCore;
  
  public async Task<List<Settings>> GetDarkThemeSettings()
  {
      return await _context.Settings
          .Where(s => EF.Property<string>(s, "Theme") == "Dark")
          .ToListAsync();
  }
  ```

  

### 关系

在 EF Core 中，**关系**是指两个实体类型之间逻辑上的关联，它映射到数据库中表与表之间的关联，通常通过**外键 (Foreign Key)** 实现。

一个关系通常由以下几个部分组成：

1. **导航属性 (Navigation Properties)**：在 C# 实体类中，它们是引用相关实体或相关实体集合的属性。它们使得你可以从一个实体轻松访问其相关的实体。
2. **外键属性 (Foreign Key Property)**：在 C# 实体类中，它是一个普通属性，其值存储了相关实体的主键值。在数据库中，它对应外键列。
3. **主体 (Principal) 和依赖 (Dependent) 端**：
   - **主体端 (Principal End)**：拥有主键（PK）的实体。
   - **依赖端 (Dependent End)**：拥有外键（FK）的实体，该外键指向主体端的主键。

#### 多对多

从 EF Core 5.0 开始，你不再需要显式定义联结实体类和 `DbSet`。你可以在两个实体类型中各有一个 `ICollection<T>` 导航属性。

```C#
public class Student // 主体端之一
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    // 导航属性：一个学生可以有多个课程
    public ICollection<Course> Courses { get; set; } = new List<Course>();
}

public class Course // 主体端之二
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;

    // 导航属性：一个课程可以被多个学生选修
    public ICollection<Student> Students { get; set; } = new List<Student>();
}
```

EF Core 会自动为你创建并管理一个名为 `CourseStudent`（或类似名称）的联结表。

**如果联结表需要额外的属性 (例如 `EnrollmentDate`)，你仍然需要显式定义联结实体类：**

```C#
public class Student
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}

public class Course
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}

public class Enrollment // 联结实体类
{
    public int StudentId { get; set; }
    public Student Student { get; set; } = null!;

    public int CourseId { get; set; }
    public Course Course { get; set; } = null!;

    public DateTime EnrollmentDate { get; set; } // 联结表的额外属性
}
```

#### 关系发现约定

EF Core 会通过**约定**来尝试自动发现和配置关系：

1. **导航属性**：EF Core 会查找实体类型中的导航属性（引用其他实体类型）。
2. **外键属性名约定**：
   - **`<导航属性名>Id`**：例如，`Product` 中的 `CategoryId` 会被约定为 `Category` 导航属性的外键。
   - **`<相关实体主键名>`**：例如，`Product` 中的 `Category` 导航属性的默认外键将是 `Category.Id`。
3. **类型匹配**：外键属性的类型应与主体实体主键的类型匹配。

**外键的可空性**：

- 如果外键属性是**非空**的（例如 `int CategoryId`），则该关系被视为**必需的 (Required)**。这意味着 `Product` 实例必须始终关联一个 `Category`。
- 如果外键属性是**可空**的（例如 `int? CategoryId`），则该关系被视为**可选的 (Optional)**。这意味着 `Product` 实例可以不关联任何 `Category`。

#### 手动配置

当默认约定不满足需求时，你可以使用**数据注解**或 **Fluent API** 来显式配置关系。Fluent API 是配置复杂关系的推荐方式。

##### 数据注解

- **`[ForeignKey("ForeignKeyName")]`**：应用于导航属性，指定外键属性的名称。

- **`[Required]`**：应用于导航属性，表示关系是必需的。

- **`[InverseProperty("NavigationPropertyName")]`**：在多对一或一对一关系中，如果两个实体有多个导航属性指向对方，此特性用于消除歧义，告诉 EF Core 哪个导航属性与哪个外键对应。

  ```C#
  public class Category
  {
      public int Id { get; set; }
      public string Name { get; set; } = string.Empty;
      public ICollection<Product> Products { get; set; } = new List<Product>();
  }
  
  public class Product
  {
      public int Id { get; set; }
      public string Name { get; set; } = string.Empty;
      public decimal Price { get; set; }
  
      // 外键属性，被约定发现
      public int CategoryId { get; set; }
  
      // 导航属性，被约定发现
      [Required] // 可选：如果希望 Product 必须有 Category
      public Category Category { get; set; } = null!;
  }
  ```

##### Fluent API

Fluent API 提供了最强大和清晰的方式来配置关系，尤其是在处理复杂关系、复合外键、或者需要精确控制级联删除行为时。

主要方法链：`HasOne / HasMany / WithOne / WithMany / HasForeignKey / HasPrincipalKey / OnDelete`。

*当你配置关系时，需要从关系的一端开始，然后描述它与另一端的关系:*

- `modelBuilder.Entity<DependentEntity>()`：从依赖端开始配置。
- `HasOne(d => d.PrincipalNavigation)`：依赖端有一个主体导航属性（一对一或一对多中的“一”）。
- `HasMany(d => d.DependentCollectionNavigation)`：依赖端有一个集合导航属性（多对多）。
- `modelBuilder.Entity<PrincipalEntity>()`：从主体端开始配置。
- `HasOne(p => p.DependentNavigation)`：主体端有一个依赖导航属性（一对一或多对一中的“一”）。
- `HasMany(p => p.DependentCollectionNavigation)`：主体端有一个集合导航属性（一对多或多对多）。

*然后，使用 `With...` 方法来描述另一端：*

- `WithOne(p => p.DependentNavigation)`：主体端有一个导航属性指向当前依赖端。
- `WithMany(p => p.pCollectionNavigation)`：主体端有一个集合导航属性指向当前依赖端。

*最后，配置外键和级联删除：*

- `HasForeignKey(d => d.ForeignKeyProperty)`：指定外键属性。
- `HasPrincipalKey(p => p.PrincipalKeyProperty)`：如果外键不引用主键，而是引用替代键，则使用此方法。
- `IsRequired()`：使外键非空，关系必需。
- `OnDelete(DeleteBehavior)`：配置级联删除行为。
  - `DeleteBehavior.NoAction` (或 `ClientNoAction`)：不执行任何操作。
  - `DeleteBehavior.Restrict` (或 `ClientSetNull`): 阻止删除主体，如果存在依赖项。
  - `DeleteBehavior.SetNull`：删除主体时，将依赖项的外键设置为 NULL。
  - `DeleteBehavior.Cascade`：删除主体时，也删除依赖项。**（默认行为，也是最危险的）**

一对多 示例：

```C#
public class ApplicationDbContext : DbContext
{
    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>() // 从依赖端 Product 开始
            .HasOne(p => p.Category)      // Product 有一个 Category
            .WithMany(c => c.Products)    // Category 有多个 Products
            .HasForeignKey(p => p.CategoryId) // Product 的 CategoryId 是外键
            .IsRequired()                 // Category 是必需的 (ProductId 不能为 NULL)
            .OnDelete(DeleteBehavior.Restrict); // 如果删除 Category，阻止删除，防止 Product 变为孤立
    }
}
```

一对一 示例：

```C#
public class ApplicationDbContext : DbContext
{
    public DbSet<Person> People { get; set; }
    public DbSet<Passport> Passports { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Person>()
            .HasOne(p => p.Passport) // Person 有一个 Passport (Passport 是依赖端)
            .WithOne(ps => ps.Person) // Passport 也有一个 Person
            .HasForeignKey<Passport>(ps => ps.PersonId) // Passport 的 PersonId 是外键
            .IsRequired() // 关系是必需的 (Passport 必须有 Person)
            .OnDelete(DeleteBehavior.Cascade); // 删除 Person，也删除其 Passport
    }
}
```

多对多 示例(带联结实体)：

```C#
public class ApplicationDbContext : DbContext
{
    public DbSet<Student> Students { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<Enrollment> Enrollments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // 配置 Enrollment 联结实体的主键
        modelBuilder.Entity<Enrollment>()
            .HasKey(e => new { e.StudentId, e.CourseId });

        // 配置 Student 和 Enrollment 的关系
        modelBuilder.Entity<Enrollment>()
            .HasOne(e => e.Student)
            .WithMany(s => s.Enrollments)
            .HasForeignKey(e => e.StudentId);

        // 配置 Course 和 Enrollment 的关系
        modelBuilder.Entity<Enrollment>()
            .HasOne(e => e.Course)
            .WithMany(c => c.Enrollments)
            .HasForeignKey(e => e.CourseId);
    }
}
```

#### 级联删除行为

它决定了当主体端实体被删除时，依赖端实体会发生什么。默认行为通常是 `Cascade`，这在生产环境中可能是危险的。

- **`Cascade` (级联删除)**：删除主体时，所有相关的依赖实体也会被删除。**（默认行为）**
- **`Restrict` (限制删除)**：如果存在相关的依赖实体，则**阻止**主体实体的删除。**（推荐在无法确定级联行为时使用）**
- **`SetNull` (设置为空)**：删除主体时，将依赖实体中对应的外键设置为 NULL。**（仅适用于可选关系，即外键属性是可空的）**
- **`NoAction` / `ClientNoAction` (无操作)**：数据库层不执行任何操作。EF Core 客户端也不会执行任何操作。通常用于需要手动管理删除依赖项的复杂场景。

你可以在 Fluent API 中使用 `OnDelete()` 方法来配置：

```C#
.OnDelete(DeleteBehavior.Restrict); // 或 SetNull, Cascade, NoAction
```

### 索引和约束

#### 默认约定

**主键**：EF Core 会自动为主键创建**聚集索引**（通常，如果数据库支持且没有明确指定其他聚集索引）。聚集索引决定了数据在磁盘上的物理存储顺序。

**外键**：EF Core 默认会为关系中的**外键**创建**非聚集索引**。这是因为外键经常用于连接操作，索引可以提高连接性能。

#### 手动配置

当默认约定不满足需求时，你可以使用**数据注解**或 **Fluent API** 来显式配置索引。

##### 数据注解

使用 `[Index]` 特性来创建索引。

- 单个列索引

  ```C#
  using Microsoft.EntityFrameworkCore; // 需要引用这个命名空间
  
  [Index(nameof(Email))] // 为 Email 列创建索引
  public class User
  {
      public int Id { get; set; }
      public string Username { get; set; } = string.Empty;
      public string Email { get; set; } = string.Empty;
  }
  ```

- 唯一索引

  ```C#
  [Index(nameof(Email), IsUnique = true)] // 为 Email 列创建唯一索引
  public class User
  {
      public int Id { get; set; }
      public string Username { get; set; } = string.Empty;
      public string Email { get; set; } = string.Empty; // 邮箱不能重复
  }
  ```

- 复合索引

  ```C#
  [Index(nameof(FirstName), nameof(LastName))] // 为 FirstName 和 LastName 创建复合索引
  public class Employee
  {
      public int Id { get; set; }
      public string FirstName { get; set; } = string.Empty;
      public string LastName { get; set; } = string.Empty;
  }
  ```

- 命名索引

  ```C#
  [Index(nameof(Code), Name = "IX_Product_Code")] // 为索引指定一个名称
  public class Product
  {
      public int Id { get; set; }
      public string Code { get; set; } = string.Empty;
  }
  ```

##### Fluent API

在 `DbContext` 的 `OnModelCreating` 方法中使用 `HasIndex()` 方法来配置索引。Fluent API 允许你配置更复杂的索引，例如包含列、过滤器等。

- 单个列索引

  ```C#
  modelBuilder.Entity<User>(entity =>
  {
      entity.HasIndex(u => u.Email); // 为 Email 列创建索引
  });
  ```

- 唯一索引

  ```C#
  modelBuilder.Entity<User>(entity =>
  {
      entity.HasIndex(u => u.Email)
            .IsUnique(); // 为 Email 列创建唯一索引
  });
  ```

- 复合索引

  ```C#
  modelBuilder.Entity<Employee>(entity =>
  {
      entity.HasIndex(e => new { e.FirstName, e.LastName }); // 为 FirstName 和 LastName 创建复合索引
  });
  ```

- 命名索引

  ```C#
  modelBuilder.Entity<Product>(entity =>
  {
      entity.HasIndex(p => p.Code)
            .HasName("IX_Product_Code"); // 为索引指定一个名称
  });
  ```

#### 约束

除了主键和外键约束（在“键”和“关系”章节中已讨论），EF Core 还允许你配置其他类型的数据库约束，以确保数据完整性。

**检查约束**

用于强制列中的值满足特定条件。例如，年龄必须大于 0，价格必须大于或等于 0。

- **配置方式 (只能通过 Fluent API)**：使用 `HasCheckConstraint()` 方法。

DEMO:价格必须大于0

```C#
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
}

public class ApplicationDbContext : DbContext
{
    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity =>
        {
            // 定义一个检查约束，确保 Price 大于 0
            entity.HasCheckConstraint("CK_Product_PricePositive", "[Price] > 0");
            // 也可以给约束命名
            // entity.HasCheckConstraint("CK_Product_PricePositive", "[Price] > 0", "ProductPriceCheck");
        });
    }
}
```

> `[Price] > 0` 是原始 SQL 表达式，所以你需要根据你使用的数据库（SQL Server、MySQL 等）的语法来编写。

**默认值**

**配置方式**：

- **Fluent API `HasDefaultValue(value)`**：指定 C# 值。
- **Fluent API `HasDefaultValueSql("SQL_EXPRESSION")`**：指定原始 SQL 表达式。

```C#
modelBuilder.Entity<Product>()
    .Property(p => p.IsActive)
    .HasDefaultValue(true); // 如果不提供 IsActive，默认为 true

modelBuilder.Entity<Product>()
    .Property(p => p.CreatedDate)
    .HasDefaultValueSql("CURRENT_TIMESTAMP()"); // MySQL 语法，默认当前时间
```



### 继承

#### 概览

当你的 C# 代码中存在继承层次结构（例如 `Person` 是基类，`Student` 和 `Instructor` 是派生类），EF Core 允许你将这些相关的实体映射到数据库中，而不是为每个类都创建独立的、不相关的表。

EF Core 目前主要支持以下三种继承映射策略（重点支持第 1 种）：

| 策略名称           | 英文缩写                      | 支持情况            | 说明                             |
| ------------------ | ----------------------------- | ------------------- | -------------------------------- |
| 1. 表-每个层次结构 | TPH (Table per Hierarchy)     | ✅ 默认支持          | 所有类用 **一个表** 存储         |
| 2. 表-每个类型     | TPT (Table per Type)          | ✅ EF Core 5.0+ 支持 | 每个类用 **一个独立的表**        |
| 3. 表-每个具体类型 | TPC (Table per Concrete Type) | ✅ EF Core 7.0+ 支持 | 每个具体类一个表，**不共享字段** |

| 特性       | TPH（默认）     | TPT                  | TPC                  |
| ---------- | --------------- | -------------------- | -------------------- |
| 表结构     | 一个表存所有类  | 每类一个表，主键连接 | 每类一个表，字段重复 |
| 鉴别字段   | ✅ 有            | ❌ 无                 | ❌ 无                 |
| 查询性能   | ✅ 好（无 JOIN） | 较差（JOIN）         | ✅ 非常好（无 JOIN）  |
| 存储冗余   | 少              | 少                   | ✅ 多（字段重复）     |
| 配置复杂度 | 简单（默认）    | 需要显式配置         | 需要 EF Core 7+ 配置 |
| 推荐场景   | 默认推荐        | 数据范式要求高的场景 | 高并发高性能查询     |

#### TPH

这是 EF Core 的默认策略，**所有子类的数据都存在同一个表中**，并通过一个“鉴别列（Discriminator）”区分不同类型。

```C#
public abstract class Animal
{
    public int Id { get; set; }
    public string Name { get; set; }
}

public class Cat : Animal
{
    public int LivesLeft { get; set; }
}

public class Dog : Animal
{
    public bool IsGoodBoy { get; set; }
}
```

生成的表结构如下：

| Id   | Name | LivesLeft | IsGoodBoy | Discriminator |
| ---- | ---- | --------- | --------- | ------------- |
| 1    | 喵喵 | 7         | NULL      | Cat           |
| 2    | 汪汪 | NULL      | true      | Dog           |

##### 鉴别器列的配置

- 配置名称

  ```C#
  modelBuilder.Entity<Person>()
      .HasDiscriminator<string>("PersonType") // 鉴别器列名为 "PersonType"
      .HasValue<Student>("Student")          // Student 类型的鉴别器值为 "Student"
      .HasValue<Instructor>("Instructor");   // Instructor 类型的鉴别器值为 "Instructor"
  ```

- 配置类型：鉴别器列可以是 `string`, `int`, `Guid` 等类型。

- 默认值：如果未配置 `HasValue`，EF Core 会使用类型全名作为鉴别器值。

#### TPT

TPT 会为每个类单独建表，并通过主键关联。

**配置方式**

```C#
public class ApplicationDbContext : DbContext
{
    public DbSet<Animal> Animals { get; set; } // 通常只暴露基类的 DbSet
    public DbSet<Cat> Cats { get; set; } // 也可以暴露派生类的 DbSet
    public DbSet<Dog> Dogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cat>().ToTable("Cats");
        modelBuilder.Entity<Dog>().ToTable("Dogs");
        // 基类 Animal 默认会映射到 Animals 表
    }
}
```



#### TPC

继承层次结构中的**每个具体（非抽象）类**都映射到**独立的数据库表**中。这些表包含基类和其自身的所有属性。基类不对应数据库中的任何表。

**配置方式**

```C#
modelBuilder.Entity<Cat>().UseTpcMappingStrategy();
modelBuilder.Entity<Dog>().UseTpcMappingStrategy();
```

### 序列

| 数据库       | 是否支持序列 | 说明                     |
| ------------ | ------------ | ------------------------ |
| ✅ SQL Server | 支持         | 有内建的 `SEQUENCE` 对象 |
| ✅ PostgreSQL | 支持         | 使用 `nextval('...')`    |
| ❌ MySQL      | 不支持       | 没有原生 `SEQUENCE` 对象 |
| ✅ Oracle     | 支持         | 有 `SEQUENCE` 概念       |

### 支持字段

#### 定义

“支持字段”允许你将数据库列映射到 C# 实体类中的**字段 (field)**，而不是通常的**属性 (property)**

在 C# 中，一个**属性 (Property)** 通常由一个公共的 `get` 和 `set` 访问器组成，它们内部操作的是一个私有的**字段 (Field)**。

```C#
public class Product
{
    private string _name; // 这是私有字段

    public string Name // 这是公共属性
    {
        get { return _name; }
        set { _name = value; }
    }
}
```

默认情况下，EF Core 会将你的**属性**映射到数据库列。但“支持字段”的特性允许你告诉 EF Core：**“嘿，这个属性背后的数据其实是存储在这个私有字段里的，你直接读写这个字段就行了。”**

#### 作用

支持字段的主要使用场景是为了更好地实现**封装 (Encapsulation)** 和**不变性 (Immutability)**，同时还能让 EF Core 正确地将数据持久化到数据库。

1. **封装业务逻辑**：你可能希望通过**方法**来控制属性的修改，而不是直接暴露公共的 `set` 访问器。

```C#
public class Order
{
    private OrderStatus _status; // 私有字段

    public OrderStatus Status // 只读属性
    {
        get => _status;
    }

    public void ShipOrder() // 通过方法修改状态
    {
        if (_status == OrderStatus.Pending)
        {
            _status = OrderStatus.Shipped;
        }
        // ... 其他业务逻辑
    }
}
```

在这种情况下，`Status` 属性没有公共 `set`，EF Core 默认无法将其映射。但通过支持字段，EF Core 可以直接访问和更新 `_status` 字段。

2. **强制不可变性 (Immutable Objects)**：你可能希望对象在创建后某些属性就不能再被修改，但 EF Core 仍然需要从数据库加载这些值。

```C#
public class Address
{
    private string _street;
    public string Street => _street; // 只读属性 (表达式体)

    public Address(string street) // 构造函数初始化字段
    {
        _street = street;
    }
    // EF Core 仍然需要一种方式来设置 _street
}
```

3. **隐藏复杂的内部实现**：有些属性的 getter/setter 可能包含复杂的逻辑，但你只希望数据库直接读写其底层数据。

4. **优化构造函数**：EF Core 可以在加载实体时，通过调用构造函数并传入支持字段的值来初始化对象，而不是依赖属性的公共 setter。

#### 默认支持字段规则

EF Core 能够通过约定来自动发现支持字段。它会查找与属性名匹配的私有或受保护字段。

EF Core 查找支持字段的约定优先级顺序（如果属性没有公共 setter）：

1. `_<propertyName>` (例如 `_name` 支持 `Name` 属性)
2. `<propertyName>` (例如 `name` 支持 `Name` 属性)
3. `m_<propertyName>`
4. `_` + `<propertyName>` (小写开头)

#### 手动配置

**注解**

使用 `[BackingField]` 特性来指定一个属性应该使用哪个字段作为其支持字段。

```C#
using Microsoft.EntityFrameworkCore; // 需要引用此命名空间

public class Blog
{
    public int Id { get; set; }

    private string _title; // 这是一个私有字段

    [BackingField(nameof(_title))] // 告诉 EF Core，Title 属性使用 _title 字段
    public string Title // 这个属性没有公共 setter
    {
        get => _title;
        // set { _title = value; } // 可以有私有 setter 或没有 setter
    }

    public void ChangeTitle(string newTitle)
    {
        if (string.IsNullOrWhiteSpace(newTitle))
        {
            throw new ArgumentException("Title cannot be empty.", nameof(newTitle));
        }
        _title = newTitle; // 只能通过方法修改
    }
}	
```

> `nameof(_title)` 确保了字段名称的类型安全。

**Fluent API**

在 `DbContext` 的 `OnModelCreating` 方法中使用 `HasField()` 方法来指定支持字段。

```C#
public class ApplicationDbContext : DbContext
{
    public DbSet<Blog> Blogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Blog>()
            .Property(b => b.Title) // 配置 Title 属性
            .HasField("_title");    // 明确指定使用 _title 字段作为支持字段
    }
}
```

#### 访问模式

除了指定支持字段外，可以配置 EF Core 在读写数据时是使用属性的访问器还是直接访问支持字段。这通过`UsePropertyAccessMode()` 方法完成。

`UsePropertyAccessMode()` 方法可以应用于整个模型、某个实体类型或某个特定属性。

**可用的访问模式：**

- **`PropertyAccessMode.PreferField` (默认值，如果发现支持字段)**：如果找到支持字段，优先使用字段。否则，使用属性访问器。这是最常见的行为。
- **`PropertyAccessMode.PreferProperty`**：如果属性具有可访问的 getter/setter，优先使用属性。否则，使用字段。
- **`PropertyAccessMode.Field`**：**始终使用字段**，即使属性有公共 getter/setter。如果属性没有支持字段，EF Core 将无法使用此模式。
- **`PropertyAccessMode.Property`**：**始终使用属性访问器**，即使有支持字段。如果属性没有可访问的 getter/setter，EF Core 将无法使用此模式。
- **`PropertyAccessMode.Mixed`**：对于读取（getter），使用属性；对于写入（setter），使用字段。
- **`PropertyAccessMode.NoField`**：不使用任何支持字段。

**配置访问模式：**

- 全局配置（针对实体类型和属性）

  ```C#
  protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
  {
      optionsBuilder.UseSqlServer("...")
                    .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
                    .UsePropertyAccessMode(PropertyAccessMode.Field); // 全局强制使用字段
  }
  ```

- 针对特定实体类型

  ```C#
  modelBuilder.Entity<Blog>()
      .UsePropertyAccessMode(PropertyAccessMode.Field); // Blog 实体强制使用字段
  ```

- 针对特定属性

  ```C#
  modelBuilder.Entity<Blog>()
      .Property(b => b.Title)
      .HasField("_title") // 指定支持字段
      .UsePropertyAccessMode(PropertyAccessMode.Field); // 强制 Title 属性使用字段访问
  ```

**选择策略**

- **默认 (`PreferField`) 够用**：对于大多数情况，你不需要显式配置 `UsePropertyAccessMode()`，因为 EF Core 的默认行为 (`PreferField`) 已经足够智能，可以自动处理。
- **需要严格封装**：如果你希望属性始终通过私有字段来持久化，即使属性有公共 setter，可以使用 `PropertyAccessMode.Field`。
- **确保属性逻辑被执行**：如果你希望在读取或写入数据时，属性的 getter/setter 逻辑（例如验证、转换）**始终**被执行，那么可以使用 `PropertyAccessMode.Property`。

### 值转换

值转换允许你在 C# 实体属性的类型和数据库列的类型之间进行**自定义的转换**。这意味着你可以用一个方便的 C# 类型来处理数据，而 EF Core 会在保存到数据库和从数据库加载时，自动将其转换为数据库支持的类型。

通常，EF Core 会自动将 C# 类型映射到兼容的数据库类型（例如，`string` 到 `NVARCHAR`，`int` 到 `INT`）。但有些情况下，这种默认映射不满足需求：

- **数据库不支持 C# 类型**：例如，你可能想在 C# 中使用枚举 (`enum`)，但数据库只存储整数或字符串。
- **希望以不同方式存储数据**：你可能想将 C# 中的一个复杂对象序列化为 JSON 字符串存储在一个 `NVARCHAR` 列中。
- **数据格式转换**：例如，始终将 `DateTime` 存储为 UTC 时间，或将 IP 地址存储为 `long`。
- **值对象**：如果你在 C# 中定义了值对象（Value Object），你可能希望它们被映射到数据库的单个或多个基本类型列。

**值转换**就是定义了如何在 C# 属性值（`ModelClrType`）和数据库列值（`ProviderClrType`）之间进行转换的逻辑。

#### 使用场景

- **处理枚举**：将 C# 枚举存储为数据库中的整数或字符串。
- **值对象**：如果你有表示单一概念的值对象（例如 `Money`、`Address`），但希望它们映射到数据库的原始列，而不是单独的复杂类型或拥有的实体。
- **日期/时间格式化**：确保 `DateTime` 始终以 UTC 格式存储在数据库中。
- **JSON 序列化**：将 C# 中的列表、字典或复杂对象序列化为 JSON 字符串存储在单个数据库列中（EF Core 7.0+ `ToJson()` 更方便）。
- **IP 地址/URL 存储**：将 `IPAddress` 或 `Uri` 对象转换为字符串或 `byte[]` 存储。
- **自定义数据类型**：将自定义的 C# 类型映射到数据库中可支持的原始类型。

#### 配置方式

##### `HasConversion<TConverter>()`

这是最常用的方法，你只需提供一个继承自 `ValueConverter` 的自定义转换器类，或者使用 EF Core 内置的转换器。

示例：假设你有一个 `OrderStatus` 枚举，但希望在数据库中以字符串形式存储：

```C#
public enum OrderStatus
{
    Pending,
    Processing,
    Shipped,
    Delivered,
    Cancelled
}

public class Order
{
    public int Id { get; set; }
    public OrderStatus Status { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class ApplicationDbContext : DbContext
{
    public DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>()
            .Property(o => o.Status)
            // 告诉 EF Core，将 OrderStatus 枚举转换为字符串存储在数据库中
            .HasConversion<string>(); // EF Core 知道如何将枚举与字符串互相转换
            // 数据库中会存储 "Pending", "Processing" 等字符串
    }
}
```

##### `HasConversion(ValueConverter converter)`

可以直接传入一个 `ValueConverter` 实例。这通常用于更复杂的转换，或者当没有合适的内置转换器时。

`ValueConverter` 的构造函数需要两个 `Expression`：一个从模型类型到提供者类型，另一个从提供者类型到模型类型。

示例：在 C# 中使用 `DateTimeOffset`，但只想在数据库中存储 UTC `DateTime`：

```C#
public class Event
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTimeOffset EventDateTime { get; set; } // C# 使用 DateTimeOffset
}

public class ApplicationDbContext : DbContext
{
    public DbSet<Event> Events { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // 定义一个从 DateTimeOffset 到 DateTime (UTC) 的转换器
        var dateTimeOffsetConverter = new ValueConverter<DateTimeOffset, DateTime>(
            v => v.ToUniversalTime().DateTime, // 模型到提供者：DateTimeOffset 转 UTC DateTime
            v => new DateTimeOffset(v, TimeSpan.Zero) // 提供者到模型：UTC DateTime 转 DateTimeOffset
        );

        modelBuilder.Entity<Event>()
            .Property(e => e.EventDateTime)
            .HasConversion(dateTimeOffsetConverter);
    }
}
```

##### `HasConversion(Expression modelToProvider, Expression providerToModel)`

直接在 Fluent API 中定义转换表达式。这对于简单的转换非常方便，无需单独创建 `ValueConverter` 实例。

示例：将 `List<string>` 存储为数据库中的一个逗号分隔字符串：

```C#
public class TaggedArticle
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new List<string>(); // C# 是 List<string>
}

public class ApplicationDbContext : DbContext
{
    public DbSet<TaggedArticle> TaggedArticles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TaggedArticle>()
            .Property(a => a.Tags)
            .HasConversion(
                // 模型到提供者：List<string> 转 string
                v => string.Join(",", v),
                // 提供者到模型：string 转 List<string>
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
            );
    }
}
```

##### 集合类型的序列化

从 EF Core 7.0 开始，对于像 `List<string>` 这样的集合类型，你可以使用 `ToJson()` 方法将其自动序列化为 JSON 字符串存储在数据库中，这比手动编写 `HasConversion` 更方便。

```C#
public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = new List<string>(); // List<string>

    public Dictionary<string, string> Settings { get; set; } = new Dictionary<string, string>(); // Dictionary<string, string>
}

public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .Property(u => u.Roles)
            .ToJson(); // 自动序列化为 JSON 字符串

        modelBuilder.Entity<User>()
            .Property(u => u.Settings)
            .ToJson(); // 自动序列化为 JSON 字符串
    }
}
```

#### 内置转换器

EF Core 提供了一些常用的内置 `ValueConverter` 类，你可以在 `Microsoft.EntityFrameworkCore.Storage.ValueConversion` 命名空间中找到它们。例如：

- `EnumToStringConverter<TEnum>`：将枚举转换为字符串。
- `DateTimeOffsetToBinaryConverter`：将 `DateTimeOffset` 转换为 `long`。
- `BoolToZeroOneConverter<T>`：将 `bool` 转换为 0/1。

你可以通过 `HasConversion<TConverter>()` 来使用它们，或者自己创建实例。

### 值比较器

#### 语法

```
ValueComparer<T>(Func<T, T, bool> equals, Func<T, int> hashCode, Func<T, T> snapshot)
```

- `equals`：一个 `Func`，用于比较两个 `T` 类型的实例是否相等。
- `hashCode`：一个 `Func`，用于为 `T` 类型的实例生成哈希码。
- `snapshot`：一个 `Func`，用于创建 `T` 类型的实例的快照（深拷贝），以便 EF Core 进行变更跟踪。

```C#
new ValueComparer<int[]>(
    (a, b) => a.SequenceEqual(b),          // 是否相等
    a => a.Aggregate(0, (x, y) => x ^ y),  // 生成哈希
    a => a.ToArray()                       // 克隆副本
)
```

| 参数位置 | 用途说明                                           |
| -------- | -------------------------------------------------- |
| 第 1 个  | `Equals(a, b)`：判断值是否相等                     |
| 第 2 个  | `GetHashCode(a)`：生成哈希值，用于字典、变更检测等 |
| 第 3 个  | `Snapshot(a)`：创建副本，避免引用共享造成误判      |

#### 使用方法

##### `HasConversion(ValueConverter)` 和 `ValueComparer` 

通常，**值转换器 (ValueConverter)** 和 **值比较器 (ValueComparer)** 会一起使用。当你使用 `ValueConverter` 将复杂类型转换为基本类型存储时，你可能还需要提供一个 `ValueComparer` 来处理 C# 端复杂类型的比较。

示例：List<string>属性的比较

在“值转换”章节中，我们把 `List<string>` 转换成了逗号分隔的字符串。但如果你在 C# 代码中修改了 `List<string>` 内部的元素，EF Core 默认可能无法跟踪到这个变化。

```C#
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore.ChangeTracking;

public class TaggedArticle
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new List<string>();
}

public class ApplicationDbContext : DbContext
{
    public DbSet<TaggedArticle> TaggedArticles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TaggedArticle>()
            .Property(a => a.Tags)
            .HasConversion(
                // 值转换器：List<string> -> string (逗号分隔)
                v => string.Join(",", v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
            )
            // 2. 值比较器：如何比较 List<string>
            .Metadata.SetValueComparer(new ValueComparer<List<string>>(
                // 相等性比较：检查两个列表的元素是否相同（忽略顺序）
                (c1, c2) => c1!.SequenceEqual(c2!), // 或 c1.OrderBy(x=>x).SequenceEqual(c2.OrderBy(x=>x)) 如果顺序不重要
                // 哈希码生成：基于列表中所有元素的哈希
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                // 克隆：创建一个新的 List<string> 副本
                c => c.ToList()
            ));
    }
}
```

##### 针对值对象/不可变类型

如果你有一个重写了 `Equals` 和 `GetHashCode` 的**值对象**，EF Core 通常能够通过约定发现这些方法并使用它们进行比较。然而，对于快照（克隆），你可能仍需提供一个值比较器，尤其当你的值对象是引用类型时，你需要确保在快照时进行深拷贝。

示例：`Address`值对象的比较和快照

```C#
// Address 类如前面所述，重写了 Equals 和 GetHashCode

public class Customer
{
    public int Id { get; set; }
    public Address ShippingAddress { get; set; } = new Address();
}

public class ApplicationDbContext : DbContext
{
    public DbSet<Customer> Customers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Customer>()
            .Property(c => c.ShippingAddress)
            .HasConversion(
                // 假设 Address 是作为 JSON 存储在数据库中的
                v => JsonSerializer.Serialize(v, typeof(Address), new JsonSerializerOptions()),
                v => JsonSerializer.Deserialize<Address>(v, new JsonSerializerOptions())!
            )
            .Metadata.SetValueComparer(new ValueComparer<Address>(
                (c1, c2) => c1!.Equals(c2), // 使用 Address 类自己的 Equals 方法
                c => c.GetHashCode(),     // 使用 Address 类自己的 GetHashCode 方法
                c => new Address(c.Street, c.City) // 提供一个自定义的克隆方法，确保深拷贝
            ));
    }
}
```

##### 针对集合属性的内置 `ValueComparer` 

从 EF Core 7.0 开始，当你使用 `ToJson()` 配置集合类型属性时，EF Core 会自动为你处理值转换和值比较器，无需你手动编写。它会使用一个内置的比较器，比较 JSON 字符串的相等性。

```C#
modelBuilder.Entity<User>()
    .Property(u => u.Roles)
    .ToJson(); // EF Core 自动处理了转换和比较
```

### 数据种子设定

EF Core 支持在模型配置阶段通过 Fluent API 指定实体的种子数据，EF 会在执行 `migration` 和 `update-database` 时将这些数据插入数据库。

#### 执行流程

1. EF Core 在执行 `Add-Migration` 时，会将种子数据作为 `InsertData()` 写入迁移文件中
2. 执行 `Update-Database` 时，EF Core 会插入这些数据（如果不存在）
3. EF 会根据主键进行比对，不会重复插入（不会执行 DELETE 或 UPDATE）

> EF Core 的种子数据是**不可变的**。如果你更改了种子数据中的某条记录，EF Core 会尝试先删除旧记录再插入新记录，这有可能失败（比如存在外键约束）。

#### 使用方法

数据种子设定是通过重写 `DbContext` 中的 `OnModelCreating` 方法来完成。你使用 `HasData()` 方法来指定要插入的数据。

##### 基础的`HashData()`

`HasData()` 方法应用于你的实体类型配置上，它接受实体实例的集合。

示例：为`Category`和`Product`实体添加种子数据

```C#
public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int CategoryId { get; set; } // 外键
}

public class ApplicationDbContext : DbContext
{
    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // 1. 为 Category 实体添加种子数据
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Electronics" },
            new Category { Id = 2, Name = "Books" }
        );

        // 2. 为 Product 实体添加种子数据
        // 注意：这里需要指定外键值，以关联到上面的 Category
        modelBuilder.Entity<Product>().HasData(
            new Product { Id = 1, Name = "Laptop", Price = 1200.00m, CategoryId = 1 },
            new Product { Id = 2, Name = "Smartphone", Price = 800.00m, CategoryId = 1 },
            new Product { Id = 3, Name = "C# Programming", Price = 50.00m, CategoryId = 2 }
        );
    }
}
```

##### 包含关系的数据种子设定

当实体之间存在关系时，种子数据也必须反映这些关系。你需要确保外键属性被正确赋值，以匹配主体实体的主键值。

在上面的例子中，`Product` 的 `CategoryId` 被设置为 1 或 2，以匹配 `Category` 实体中的 `Id`。

##### 匿名类型与`HasData()`

为了简洁，你可以使用匿名类型来为 `HasData()` 提供数据，前提是所有必需的属性都被包含

```C#
modelBuilder.Entity<Category>().HasData(
    new { Id = 1, Name = "Electronics" }, // 使用匿名类型
    new { Id = 2, Name = "Books" }
);
```

#### 主键值处理

> [!important]
>
> 为种子数据提供的**主键值**（例如 `Id = 1`, `Id = 2`）必须是**唯一的**，并且在每次迁移中都**保持不变**。
>
> - EF Core 使用这些主键值来识别种子数据行。
> - 当你在未来的迁移中修改种子数据时，EF Core 会根据主键来判断是更新现有行还是插入新行。
> - 如果种子数据的 ID 与真实数据冲突，EF Core 会抛出错误或产生意想不到的行为。

如果你的实体主键是**自增**的（例如 `int Id` 默认的 `Identity`），并且你希望数据库自动生成这些 ID，那么在种子数据中**不应该**指定主键值。然而，这会带来一个问题：**EF Core 无法追踪和更新这些种子数据，因为它不知道它们的标识。**

**解决方案：**

1. **手动指定主键 (推荐用于种子数据)**：对于种子数据，即使主键在数据库中是自增的，也**强烈建议你手动为种子数据指定主键值**。这样 EF Core 才能在后续的迁移中识别和更新这些种子数据。

   在迁移脚本中，EF Core 会显式地为这些插入的行指定主键值，绕过数据库的自增机制。

2. **避免在种子数据中使用自增主键**：如果你的主键必须由数据库自增，并且你不想手动指定，那么不适合使用 `HasData()`。你可能需要考虑在应用程序启动时，使用 `DbContext.Database.EnsureCreated()` 后的代码或自定义初始化脚本来填充数据。

3. **使用 Guid 主键并在代码中生成 Guid**：对于 `Guid` 主键，你可以简单地在种子数据中生成 `Guid.NewGuid()`。

#### 逻辑删除与并发令牌

**软删除**：如果你的实体有软删除机制（例如 `IsDeleted` 属性），请确保在种子数据中也正确设置此属性。

**并发令牌 (RowVersion/Timestamp)**：种子数据中的并发令牌属性通常应该设置为默认值或 `null`（对于 `byte[]`），让数据库在插入时自动生成。EF Core 会忽略你在种子数据中为并发令牌指定的值，并让数据库负责生成。

#### 外部文件或配置中的种子数据

对于大量或复杂的数据，将所有种子数据直接写在 `OnModelCreating` 方法中可能会导致代码臃肿。你可以考虑：

- **从 JSON/XML 文件加载数据**：在 `OnModelCreating` 中读取这些文件并反序列化为实体对象，然后传递给 `HasData()`。
- **从其他配置源加载数据**：例如，从 `appsettings.json` 或环境变量中读取配置数据。

#### 迁移与数据种子设定

当你添加或修改了 `HasData()` 中的内容后：

1. **添加迁移**：运行 `Add-Migration <MigrationName>` 命令。EF Core 会检测到 `HasData()` 方法的变化，并生成相应的 `InsertData()`, `UpdateData()`, `DeleteData()` 调用到迁移文件中。
2. **更新数据库**：运行 `Update-Database` 命令。EF Core 会执行迁移脚本，将种子数据插入或更新到数据库中。

> [!important]
>
> 每次修改 `HasData()`，都应该创建一个新的迁移。
>
> `HasData()` 会生成 `INSERT`, `UPDATE`, `DELETE` 语句到迁移脚本中。这意味着如果你修改了某个种子数据行，下一次迁移会生成一个 `UPDATE` 语句来修改它。如果你删除了一个种子数据行，它会生成一个 `DELETE` 语句来删除它。

### 实体类型构造函数

EF Core 中，实体类型是普通的 C# 类。当你从数据库加载实体或者创建新实体时，EF Core 需要能够创建这些类的实例。这就涉及到实体类型的**构造函数**。

#### 使用时机

EF Core 使用构造函数来：

1. **加载实体 (Materialization)**：当你执行查询（例如 `_context.Products.ToList()`）时，EF Core 从数据库获取数据，然后需要将这些数据转换成 C# 实体类的实例。这时，EF Core 会调用实体类的构造函数来创建对象。
2. **创建新实体 (Instantiation)**：当你通过 `new Product()` 在代码中创建实体，然后将其添加到 `DbContext` (`_context.Products.Add(newProduct)`) 时，EF Core 也会与你的构造函数交互。

#### 要求和约定

##### 无参构造函数

**默认和推荐**：如果你的实体类有一个**公共的无参构造函数**，EF Core 将默认使用它来创建实体实例。这是最简单、最常见的情况。

```C#
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }

    // EF Core 默认使用这个构造函数
    public Product()
    {
        // 可以在这里进行一些默认初始化
        Console.WriteLine("Product parameterless constructor called.");
    }
}
```

##### 带参构造函数

###### EF Core如何选择带参构造函数

1. **单个构造函数**：如果实体类只有一个构造函数，EF Core 将尝试使用它，无论是无参还是带参。
2. **多个构造函数时的约定**：如果实体类有多个构造函数，EF Core 会优先选择：
   - **带参数的构造函数**，其参数可以被 EF Core 模型中的**属性**（包括支持字段和阴影属性）或**服务**（例如 `ILogger`）填充。
   - **最重要的：所有参数都必须能被 EF Core 解析**。如果一个参数不能映射到数据库列，也不能作为服务注入，那么 EF Core 将无法使用该构造函数。

###### 构造函数参数与属性的匹配

EF Core 会尝试将构造函数的参数名与实体类型的属性名（包括支持字段和阴影属性）进行匹配（不区分大小写）。

示例：使用带参构造函数初始化属性

```C#
public class Order
{
    public int Id { get; set; }
    public DateTime OrderDate { get; private set; } // 私有 set
    public decimal TotalAmount { get; private set; } // 私有 set

    // EF Core 可以使用这个构造函数来加载数据
    public Order(DateTime orderDate, decimal totalAmount)
    {
        OrderDate = orderDate;
        TotalAmount = totalAmount;
        Console.WriteLine("Order parameterized constructor called.");
    }

    // 如果不希望公开无参构造函数，EF Core 2.1+ 可以支持此模式
    // 但如果你有其他公开的无参构造函数，EF Core 仍然会优先选择它
    private Order() // 私有无参构造函数，用于外部创建实例
    {
        Console.WriteLine("Order private parameterless constructor called.");
    }
}
```

当 EF Core 加载一个 `Order` 实体时，它会从数据库中读取 `OrderDate` 和 `TotalAmount` 的值，然后将这些值作为参数传递给 `Order(DateTime orderDate, decimal totalAmount)` 构造函数来创建实例。

###### 构造函数参数与支持字段的匹配

如果你在实体中使用了支持字段，构造函数参数也可以直接匹配这些字段。

```C#
public class User
{
    public int Id { get; set; }

    private string _username; // 支持字段

    public string Username => _username; // 只读属性

    // EF Core 可以通过此构造函数填充 _username 字段
    public User(string username)
    {
        _username = username;
        Console.WriteLine("User parameterized constructor called with username.");
    }

    private User() { } // 私有无参构造函数，如果需要
}
```

为了让 EF Core 知道 `Username` 属性的底层是 `_username` 字段，你可能还需要在 `OnModelCreating` 中进行配置：

```C#
modelBuilder.Entity<User>()
    .Property(u => u.Username)
    .HasField("_username");
```

###### 构造函数参数与服务注入

构造函数参数也可以接收通过 EF Core **服务提供程序**解析的服务。这对于在实体创建时注入日志记录器或其他依赖项很有用。

```C#
using Microsoft.Extensions.Logging;

public class AuditEntry
{
    public int Id { get; set; }
    public DateTime Timestamp { get; set; }
    public string Message { get; set; } = string.Empty;

    // EF Core 可以注入 ILogger 实例
    public AuditEntry(ILogger<AuditEntry> logger)
    {
        logger.LogInformation("AuditEntry instance created.");
        Timestamp = DateTime.UtcNow; // 构造函数中初始化
    }

    // 如果你想在代码中手动创建实例，可能需要无参构造函数或不同的构造函数
    public AuditEntry(string message) : this(new LoggerFactory().CreateLogger<AuditEntry>())
    {
        Message = message;
    }

    private AuditEntry() { } // EF Core 也可能需要这个来处理某些查询
}
```

> 这种服务注入仅限于 EF Core 内部的实体实例化过程。如果你在代码中直接 `new AuditEntry("...")`，则需要确保你手动处理 `ILogger` 的创建或传递。

##### 私有或受保护的构造函数

EF Core 也可以使用**私有或受保护的构造函数**。这对于那些你希望在外部强制通过工厂方法或特定方法创建，但仍然让 EF Core 能够加载的实体非常有用。

```C#
public class Report
{
    public int Id { get; set; }
    public string Title { get; private set; } // 私有 set

    // 私有构造函数，EF Core 仍然可以使用它
    private Report(string title)
    {
        Title = title;
    }

    // 工厂方法，用于在应用程序代码中创建 Report 实例
    public static Report Create(string title)
    {
        // 可以在这里添加业务规则
        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException("Title cannot be empty.", nameof(title));
        }
        return new Report(title);
    }
}
```

EF Core 会尝试找到最合适的构造函数，包括非公共的构造函数。如果你有多个构造函数，并且 EF Core 无法根据参数类型和名称明确选择一个，那么你可能需要显式地告诉 EF Core 使用哪个构造函数。

##### 手动指定构造函数

可以使用 `HasAnnotation()` 或 `UseConstructor()` 来明确指定要使用的构造函数。

```C#
// 实体类有多个构造函数
public class ComplexEntity
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Age { get; set; }

    public ComplexEntity() { } // 公开无参

    public ComplexEntity(string name) { Name = name; } // 公开带一个参数

    public ComplexEntity(int id, string name, int age) // 公开带所有参数
    {
        Id = id;
        Name = name;
        Age = age;
    }
}

// 在 OnModelCreating 中显式指定
modelBuilder.Entity<ComplexEntity>()
    .HasAnnotation(
        RelationalAnnotationNames.ConstructorBinding,
        ConstructorBinding.Create<ComplexEntity>(
            typeof(int), typeof(string), typeof(int) // 参数类型
        )
    );

// 或者更简洁的 UseConstructor (EF Core 6.0+)
modelBuilder.Entity<ComplexEntity>()
    .UseConstructor(typeof(int), typeof(string), typeof(int)); // 指定使用带 id, name, age 的构造函数
```

### 高级表映射

#### 多个实体类型映射到同一张表

**表拆分 (Table Splitting)**通常指的是**垂直拆分实体**，即将一个实体的数据存储在多张表中，这里我们指的是*多个实体共享一张表*。

这种场景通常发生在以下情况：

- **继承映射 (Inheritance Mapping)**：我们已经在“继承”章节中详细讨论了 TPH (Table-per-Hierarchy) 策略，它就是将整个继承层次结构映射到一张表中。
- **拥有实体类型 (Owned Entity Types)**：当你有一个值对象（Value Object）或聚合根的一部分，并且你希望它与拥有它的实体一起存储在同一张表中，而不是单独的表。

##### 拥有实体类型

拥有实体类型（在 EF Core 2.0 引入）允许你在模型中包含复杂对象，并将它们的属性映射到拥有实体的主表中，而不是单独的表。它们没有自己的主键，也不能被 `DbSet` 直接访问，它们的存在依赖于拥有它们的实体。

**场景**：`Order` 实体包含一个 `ShippingAddress`，你希望 `ShippingAddress` 的所有属性（`Street`, `City`, `PostalCode`）都作为 `Order` 表的列，而不是一个单独的 `Addresses` 表。

**配置方式**：使用 **Fluent API `OwnsOne()`** (用于一对一拥有) 或 **`OwnsMany()`** (用于一对多拥有)

**示例：一对一拥有实体**

```C#
public class Order
{
    public int Id { get; set; }
    public decimal TotalAmount { get; set; }
    public OrderAddress ShippingAddress { get; set; } = null!; // 拥有实体属性
}

// OrderAddress 类没有 Id 属性，它是一个值对象
public class OrderAddress
{
    public string Street { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
}

public class ApplicationDbContext : DbContext
{
    public DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>(entity =>
        {
            entity.OwnsOne(o => o.ShippingAddress, address =>
            {
                address.Property(a => a.Street).HasColumnName("ShippingStreet");
                address.Property(a => a.City).HasColumnName("ShippingCity");
                address.Property(a => a.PostalCode).HasColumnName("ShippingPostalCode");
                // 也可以进一步配置 ShippingAddress 的属性
            });
        });
    }
}
```

##### 共享相同数据库表

虽然不常见，但理论上可以将两个不相关的实体类型映射到**完全相同的表**。这需要你非常小心，并确保两个实体类型的主键和列集是兼容的。通常通过 `ToTable()` 和 `HasKey()` 配合实现。

#### 一个实体类型映射到多张表

**表拆分 (Table Splitting)** 指的是将**一个 C# 实体类型**的数据分散存储在**多张数据库表**中。每张表都共享相同的主键，从而通过主键关联这些拆分的表。

- **场景**：当一个实体包含大量属性，并且某些属性不经常使用时，你可以将其拆分到单独的表中，从而提高常用属性的查询性能。
- **配置方式**：使用 **Fluent API `ToTable()`** 结合 `HasOne().WithOne().HasForeignKey()` 来建立两个实体类型之间的“假”一对一关系，并让它们共享相同的主键。

**示例：将 `Blog` 实体拆分为 `Blogs` 和 `BlogDetails` 表**

```C#
public class Blog
{
    public int Id { get; set; } // 主键
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty; // 主要内容

    // 导航属性指向 BlogDetails 实体
    public BlogDetails Details { get; set; } = null!;
}

public class BlogDetails
{
    // BlogDetails 的主键同时也是外键，引用 Blog 的 Id
    public int Id { get; set; }
    public string HeaderImage { get; set; } = string.Empty;
    public string AuthorNotes { get; set; } = string.Empty;
    public int ViewsCount { get; set; }

    // 导航属性指向 Blog 实体
    public Blog Blog { get; set; } = null!;
}

public class ApplicationDbContext : DbContext
{
    public DbSet<Blog> Blogs { get; set; }
    // 注意：通常你不需要为 BlogDetails 定义 DbSet，因为它只是 Blog 的一部分
    // public DbSet<BlogDetails> BlogDetails { get; set; } // 这样做也可以，但不是标准模式

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Blog>(entity =>
        {
            // Blog 映射到 Blogs 表
            entity.ToTable("Blogs");
        });

        modelBuilder.Entity<BlogDetails>(entity =>
        {
            // BlogDetails 也映射到 Blogs 表 (默认)，或者可以指定另一个表
            entity.ToTable("BlogDetails"); // 确保 BlogDetails 映射到自己的表

            // 建立 Blog 和 BlogDetails 之间的关系
            entity.HasOne(d => d.Blog)          // BlogDetails 有一个 Blog
                  .WithOne(b => b.Details)      // Blog 也有一个 Details
                  .HasForeignKey<BlogDetails>(d => d.Id); // BlogDetails 的 Id 既是主键也是外键

            // 确保 Id 属性不会被认为是从数据库生成的，因为它是共享的主键
            entity.Property(d => d.Id).ValueGeneratedNever();
        });
    }
}
```

**使用方式：**当你查询 `Blog` 实体时，EF Core 会自动 `JOIN` `Blogs` 和 `BlogDetails` 表来填充 `Blog` 及其 `Details` 属性。

#### 无键实体类型

**概念**：一种没有定义**主键**的实体类型。EF Core 不会跟踪其变化，也不会执行插入、更新或删除操作。它主要用于**读取数据**。

**场景**：

- **数据库视图 (Database Views)**：将一个实体映射到数据库视图，用于复杂的只读查询结果。
- **存储过程结果**：映射存储过程的返回结果。
- **自定义 SQL 查询结果**：映射 `FromSqlRaw()` 或 `FromSqlInterpolated()` 查询的结果。
- **没有主键的表**：有些遗留数据库可能存在没有主键的表（尽管这通常不是好的数据库设计）。

**配置方式**：

- **数据注解**：在类上使用 `[Keyless]` 特性。
- **Fluent API**：使用 `HasNoKey()` 方法。
- 需要一个 `DbSet` 属性来表示它。

**示例：映射到数据库视图**

假设你的数据库中有一个名为 `ProductSalesView` 的视图：

```SQL
CREATE VIEW ProductSalesView AS
SELECT
    p.Id AS ProductId,
    p.Name AS ProductName,
    SUM(oi.Quantity * oi.UnitPrice) AS TotalSales,
    COUNT(DISTINCT o.Id) AS OrderCount
FROM Products AS p
JOIN OrderItems AS oi ON p.Id = oi.ProductId
JOIN Orders AS o ON oi.OrderId = o.Id
GROUP BY p.Id, p.Name;
```

在C#中定义一个对应的无键实体类型：

```C#
using Microsoft.EntityFrameworkCore; // 需要引用此命名空间

[Keyless] // 标记为无键实体类型
public class ProductSalesView
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal TotalSales { get; set; }
    public int OrderCount { get; set; }
}

public class ApplicationDbContext : DbContext
{
    // 必须有 DbSet 来表示无键实体类型
    public DbSet<ProductSalesView> ProductSales { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ProductSalesView>()
            .ToView("ProductSalesView"); // 映射到数据库视图
            // 或者 .ToFunction("GetProductSales") 映射到存储过程
            // 或者不指定，直接用于 FromSqlRaw/Interpolated
            // .HasNoKey(); // 如果不使用 [Keyless] 特性，可以在这里配置
    }
}
```

**使用方式：**

```C#
// 查询无键实体类型
var salesData = await _context.ProductSales.ToListAsync();

// 也可以用于自定义 SQL 查询
var customSalesData = await _context.ProductSales
    .FromSqlRaw("SELECT ProductId, ProductName, TotalSales, OrderCount FROM ProductSalesView WHERE ProductId = {0}", 1)
    .ToListAsync();
```

**重要限制**：

- **只读**：不能对无键实体类型执行 `Add()`, `Update()`, `Remove()` 操作。
- **无变更跟踪**：EF Core 不会跟踪其变化。
- **无主键**：不能用作关系中的主体端。

### 从属实体类型

#### 定义

从属实体类型是一种特殊类型的实体，它的核心特征是：

1. **没有自己的主键**：它没有自己的主键属性，其主键由拥有它的实体的主键（或其一部分）构成。
2. **生命周期依赖**：它不能独立存在于数据库中。当拥有它的主体实体被添加、更新或删除时，从属实体的数据也会随之被处理。
3. **不通过 `DbSet` 暴露**：你通常不会为从属实体类型创建 `DbSet<T>` 属性。你通过拥有它的主体实体来访问和操作从属实体的数据。
4. **映射到同一张表或单独的表**：从属实体可以映射到拥有它的主体实体所在的同一张表（默认行为），也可以映射到一张单独的表。

从属实体类型主要用于以下场景：

- **值对象 (Value Objects)**：当你的领域模型中存在值对象时，这些对象通常没有独立的标识，其相等性基于其属性的值。例如，一个 `Address` 对象，它只作为 `Customer` 的一部分存在，没有独立的 `AddressId`。
- **复杂类型 (Complex Types)**：当你希望将 C# 中的复杂对象作为某个实体的一部分进行持久化，而不想为它创建单独的表关系时。
- **更好的封装和领域驱动设计 (DDD)**：允许你更好地建模聚合，将相关的数据和行为封装在一起，同时保持数据库的规范化或反规范化。

#### 配置方式

从属实体类型主要通过 **Fluent API** 来配置。EF Core 会识别两种主要的拥有关系：**一对一拥有** 和 **一对多拥有**。

##### 一对一拥有

这是最常见的从属实体场景，一个主体实体拥有一个从属实体。从属实体的属性将默认映射到主体实体的同一张表中。

**配置方式**：在主体实体类型配置上使用 `OwnsOne()` 方法。

示例：`Order` 拥有 `ShippingAddress`

```C#
public class Order
{
    public int Id { get; set; }
    public decimal TotalAmount { get; set; }

    // 导航属性指向从属实体
    public OrderAddress ShippingAddress { get; set; } = null!; // 注意：通常是非空的
}

// OrderAddress 是一个值对象，没有自己的 Id
public class OrderAddress
{
    public string Street { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
}

public class ApplicationDbContext : DbContext
{
    public DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>(entity =>
        {
            // 配置 Order 实体拥有 OrderAddress
            entity.OwnsOne(o => o.ShippingAddress, address =>
            {
                // 默认情况下，OrderAddress 的属性会直接映射到 Order 表的列
                // 你也可以显式指定列名，避免冲突或使名称更清晰
                address.Property(a => a.Street).HasColumnName("ShippingStreet");
                address.Property(a => a.City).HasColumnName("ShippingCity");
                address.Property(a => a.PostalCode).HasColumnName("ShippingPostalCode");

                // 如果 OrderAddress 是可选的，可以配置为可空
                // address.WithOwner().IsRequired(false);
            });
        });
    }
}
```

##### 一对多拥有

一个主体实体可以拥有多个从属实体。这种情况下，从属实体的数据会映射到一张**单独的表**，该表的外键指向主体实体。

**配置方式**：在主体实体类型配置上使用 `OwnsMany()` 方法。

示例：`Customer` 拥有多个 `Contact` (电话号码/邮箱)

```CS
public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    // 导航属性指向从属实体集合
    public List<Contact> Contacts { get; set; } = new List<Contact>();
}

// Contact 是一个值对象，它没有自己的 Id，它的唯一性由 CustomerId 和 ContactType 决定
public class Contact
{
    public string Type { get; set; } = string.Empty; // e.g., "Phone", "Email"
    public string Value { get; set; } = string.Empty; // e.g., "123-456-7890", "test@example.com"
}

public class ApplicationDbContext : DbContext
{
    public DbSet<Customer> Customers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Customer>(entity =>
        {
            // 配置 Customer 拥有 Contact 集合
            entity.OwnsMany(c => c.Contacts, contact =>
            {
                // 从属实体将映射到单独的表 "Contact"
                contact.ToTable("CustomerContacts");

                // 默认情况下，EF Core 会为从属实体创建一个影子主键
                // 如果你需要自定义键，特别是复合键，可以这样配置：
                contact.HasKey("Id"); // 这是一个影子属性 Id，作为 Contact 表的主键
                // 或者使用复合主键，如果 Type 和 Value 在 Customer 内是唯一的
                // contact.HasKey(c => new { c.CustomerId, c.Type }); // CustomerId 是外键，Type 是 Contact 自身的属性
                // 对于 OwnedMany，通常会有一个自动生成的影子主键，或你可以自定义复合键

                // 可以在这里配置 Contact 属性的映射
                contact.Property(p => p.Type).HasMaxLength(50);
                contact.Property(p => p.Value).HasMaxLength(255);
            });
        });
    }
}
```

#### 特性与行为

**主键**：从属实体没有自己的主键属性。对于一对一拥有，其主键由拥有实体的主键决定。对于一对多拥有，EF Core 会为从属实体自动创建一个影子主键（通常是一个隐藏的 `int` 或 `Guid`），并使用它与拥有实体的主键（外键）共同构成从属表的唯一标识。你也可以在 `OwnsMany` 配置中自定义从属实体的主键（例如，使用复合键）。

**外键**：从属实体（如果映射到单独的表）会有一个外键，指向拥有实体的主键。

**不作为独立实体访问**：你不能直接通过 `_context.OrderAddresses` 访问 `OrderAddress`，只能通过 `_context.Orders.Select(o => o.ShippingAddress)` 或 `_context.Orders.Include(o => o.ShippingAddress)`。

**级联删除**：当拥有实体被删除时，其关联的从属实体数据也会被自动删除。

**查询**：从属实体的数据会作为拥有实体的一部分被加载。你可以使用 `Include()` 来显式加载它们。

**`null` 值处理**：

- **一对一拥有**：如果从属导航属性是可空的 (`OrderAddress? ShippingAddress`) 并且你没有配置为 `IsRequired() = true`，那么当从属实体所有列都为 `NULL` 时，EF Core 会将其视为 `null`。
- **一对多拥有**：从属集合可以是空的。

### 无键实体类型

#### 定义

**无键实体类型**，顾名思义，就是**没有主键**的实体类型。在 EF Core 中，这意味着：

1. **没有主键**：EF Core 不会为它生成主键，也不会在数据库中强制执行主键约束。
2. **只读**：EF Core 不会跟踪其状态变化。你不能使用 `Add()`, `Update()`, `Remove()` 方法对无键实体进行操作，也不能通过 `SaveChanges()` 将其持久化回数据库。
3. **不参与关系**：由于没有主键，无键实体类型不能作为关系中的“主体”端（即不能被其他实体通过外键引用）。它当然可以包含对其他实体类型（有键）的引用，但不能是其他实体类型依赖的主体。
4. **通常映射到非表数据源**：它们最常用于映射到数据库**视图 (Views)**、**存储过程 (Stored Procedures)** 的返回结果，或者**直接的 SQL 查询结果**。在某些罕见情况下，也可以映射到没有主键的数据库表。

**为什么需要该类型**

在传统的 ORM 中，每个实体通常都假定有一个主键并对应一个可读写的表。但现实世界中存在多种只读数据源，它们没有传统意义上的主键，或者你只关心查询它们的数据而不需要修改。无键实体类型就是为这些场景设计的：

- **数据库视图**：你可能创建了一个复杂的数据库视图来聚合或转换数据，你希望在应用程序中将其视为一个 C# 对象集合来查询。
- **存储过程的结果集**：有些存储过程返回结果集，你希望将其映射为 C# 对象。
- **原始 SQL 查询结果**：当你使用 `FromSqlRaw()` 或 `FromSqlInterpolated()` 方法执行自定义 SQL 查询时，返回的结果集可能不对应任何具有主键的表。
- **反范式化数据**：在某些性能优化的场景下，数据库表可能故意设计为没有主键，或者你只需要查询其部分数据。
- **报表和仪表板**：当你只需要显示数据，而不涉及修改时，无键实体类型非常合适。

#### 配置方法

无键实体类型可以通过 **数据注解** 或 **Fluent API** 来配置。它们必须通过一个 `DbSet` 属性暴露在 `DbContext` 中，以便 EF Core 能够发现它们。

**数据注解**

在实体类上使用 `[Keyless]` 特性。

```C#
using Microsoft.EntityFrameworkCore; // 需要引用此命名空间

// 假设你的数据库中有一个视图名为 ProductSalesSummaryView
[Keyless] // 标记这个类是一个无键实体类型
public class ProductSalesSummary
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = null!;
    public decimal TotalSales { get; set; }
    public int OrderCount { get; set; }
}

public class ApplicationDbContext : DbContext
{
    // 必须通过 DbSet 暴露无键实体类型
    public DbSet<ProductSalesSummary> ProductSalesSummaries { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // 可选：如果无键实体映射到特定的视图或函数，可以在这里指定
        modelBuilder.Entity<ProductSalesSummary>()
            .ToView("ProductSalesSummaryView"); // 映射到名为 ProductSalesSummaryView 的视图
            // 或者 .ToFunction("GetProductSalesSummary"); // 映射到存储函数
            // 如果用于 FromSqlRaw/Interpolated，可以不指定 ToView/ToFunction
    }
}
```

**Fluent API**

在 `DbContext` 的 `OnModelCreating` 方法中使用 `HasNoKey()` 方法。这提供了更灵活的配置，例如映射到视图或函数。

```C#
public class ProductSalesSummary
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = null!;
    public decimal TotalSales { get; set; }
    public int OrderCount { get; set; }
}

public class ApplicationDbContext : DbContext
{
    public DbSet<ProductSalesSummary> ProductSalesSummaries { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ProductSalesSummary>(entity =>
        {
            entity.HasNoKey(); // 明确声明此实体没有主键

            // 映射到数据库视图 (常用)
            entity.ToView("ProductSalesSummaryView");

            // 或者映射到数据库函数 (常用)
            // entity.ToFunction("GetProductSalesSummary");

            // 或者映射到没有主键的表 (不常见且不推荐)
            // entity.ToTable("MyLegacyTableWithoutPK");
        });
    }
}
```

**映射到特定数据库对象**

- **`ToView("ViewName")`**：将无键实体映射到数据库中的一个**视图**。EF Core 会生成对该视图的 `SELECT` 查询。
- **`ToFunction("FunctionName")`**：将无键实体映射到数据库中的一个**函数**（通常是表值函数）。EF Core 会生成对该函数的 `SELECT` 查询。
- **`ToTable("TableName")`**：也可以映射到没有主键的表。

#### 使用无键实体类型进行查询

一旦配置好无键实体类型，你就可以像查询普通实体一样查询它们，但请记住它们是只读的。

```C#
public async Task<List<ProductSalesSummary>> GetProductSalesSummaries()
{
    // 直接查询 DbSet
    var summaries = await _context.ProductSalesSummaries.ToListAsync();
    return summaries;
}

public async Task<List<ProductSalesSummary>> GetProductSalesByProduct(int productId)
{
    // 在 LINQ 查询中使用，EF Core 会将其转换为 SQL
    var summary = await _context.ProductSalesSummaries
        .Where(s => s.ProductId == productId)
        .ToListAsync();
    return summary;
}

// 结合 FromSqlRaw/FromSqlInterpolated 使用
public async Task<List<ProductSalesSummary>> GetCustomSalesData(int minSales)
{
    // 如果没有 ToView/ToFunction 映射，或者需要自定义 SQL，则使用 FromSqlRaw
    var customData = await _context.ProductSalesSummaries
        .FromSqlRaw("SELECT ProductId, ProductName, TotalSales, OrderCount FROM ProductSalesSummaryView WHERE TotalSales > {0}", minSales)
        .ToListAsync();
    return customData;
}
```

**注意事项**

- **没有变更跟踪**：对 `ProductSalesSummary` 实例进行的任何更改都不会被 EF Core 跟踪，也不会保存到数据库。
- **没有主键，所以不能 `Find()`**：你不能使用 `_context.ProductSalesSummaries.Find(id)` 方法，因为它需要主键。
- **LINQ 查询限制**：虽然你可以对无键实体类型执行 LINQ 查询，但某些操作（如 `Include()`、`ThenInclude()`）可能不适用，因为它们通常依赖于关系和变更跟踪。

#### 与有键实体的区别

| 特性         | 有键实体类型 (Entity Types)                  | 无键实体类型 (Keyless Entity Types)                  |
| ------------ | -------------------------------------------- | ---------------------------------------------------- |
| 主键         | 必须有主键                                   | 没有主键                                             |
| 读写         | 可读写 (CRUD 操作)                           | 只读 (只能查询)                                      |
| 变更跟踪     | EF Core 会跟踪状态变化                       | EF Core 不跟踪状态变化                               |
| 映射到       | 通常映射到表                                 | 通常映射到视图、函数或没有主键的表                   |
| DbSet        | 必须通过 DbSet<T> 暴露                       | 必须通过 DbSet<T> 暴露                               |
| Find() 方法  | 支持通过主键查找                             | 不支持                                               |
| 关系中的主体 | 可以作为关系中的主体（被外键引用）           | 不能作为关系中的主体                                 |
| 迁移生成     | EF Core 会在迁移中生成表创建、修改、删除语句 | EF Core 不会在迁移中管理其底层数据库对象 (视图/函数) |

#### 与从属实体类型的区别

| 特性             | 从属实体（Owned） | 无键实体（Keyless）         |
| ---------------- | ----------------- | --------------------------- |
| 是否有主键       | ❌（由主实体决定） | ❌（显式声明 `.HasNoKey()`） |
| 是否有独立表     | ❌（默认共用主表） | ✅/❌（通常映射到视图或表）   |
| 生命周期是否独立 | ❌                 | ✅（数据可独立于主表）       |
| 是否参与迁移     | ✅                 | ❌（不参与）                 |
| 是否可写入数据库 | ✅                 | ❌ 只读                      |
| 是否支持导航属性 | ✅（仅从属使用）   | ❌                           |
| 使用场景         | 值对象、嵌套结构  | 报表、视图、SQL结果集       |

### 空间数据

#### 定义

空间数据通常指的是几何对象，例如：

- **点 (Point)**：表示一个单一的位置，如一个商店的经纬度。
- **线 (LineString)**：表示一系列连接点的线段，如一条道路或河流。
- **多边形 (Polygon)**：表示一个封闭的区域，如一个国家的边界或一块土地。
- **多点 (MultiPoint)**：多个点的集合。
- **多线 (MultiLineString)**：多条线的集合。
- **多多边形 (MultiPolygon)**：多个多边形的集合。
- **几何集合 (GeometryCollection)**：包含任意几何对象的集合。

这些几何对象可以通过它们的坐标（通常是经度和纬度）来定义。

#### 空间数据类型和提供程序

EF Core 通过集成第三方库来支持空间数据：

1. **`NetTopologySuite` (NTS)**：这是 .NET 中处理几何对象的标准库。EF Core 的空间扩展会使用 NTS 类型来表示 C# 实体中的几何数据。例如，NTS 中的 `Point`、`LineString`、`Polygon` 等。
2. **数据库空间扩展包**：你需要为你使用的数据库安装相应的 EF Core 空间数据提供程序包。这些包负责将 NTS 类型转换为数据库的原生空间类型，并将数据库的空间类型转换回 NTS 类型。
   - **SQL Server**：`Microsoft.EntityFrameworkCore.SqlServer.NetTopologySuite`
   - **PostgreSQL (Npgsql)**：`Npgsql.EntityFrameworkCore.PostgreSQL.NetTopologySuite`
   - **SQLite**：`Microsoft.EntityFrameworkCore.Sqlite.NetTopologySuite`
   - **MySQL (Pomelo.EntityFrameworkCore.MySql)**：`Pomelo.EntityFrameworkCore.MySql.NetTopologySuite`

**安装必要的 NuGet 包**:

在使用空间数据之前，你需要安装核心 EF Core 包以及对应数据库的空间扩展包。

```BASH
# 核心 EF Core
dotnet add package Microsoft.EntityFrameworkCore.SqlServer # 或 Npgsql, Sqlite, MySql

# SQL Server 空间数据扩展
dotnet add package Microsoft.EntityFrameworkCore.SqlServer.NetTopologySuite

# 或者 PostgreSQL
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL.NetTopologySuite

# 或者 SQLite
dotnet add package Microsoft.EntityFrameworkCore.Sqlite.NetTopologySuite
```

#### 配置空间数据

一旦安装了必要的包，你需要在 `DbContext` 中配置数据库提供程序使用 NTS

```cs
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries; // NTS 几何类型命名空间

public class Location
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Point? GeoLocation { get; set; } // 使用 NTS 的 Point 类型
    public Polygon? Area { get; set; }     // 使用 NTS 的 Polygon 类型
}

public class ApplicationDbContext : DbContext
{
    public DbSet<Location> Locations { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // 告诉 EF Core 几何属性映射到 SQL Server 的 geography 类型
        // 如果是 PostGIS，通常会映射到 geometry 类型
        modelBuilder.Entity<Location>()
            .Property(l => l.GeoLocation)
            .HasColumnType("geography"); // SQL Server 通常使用 geography 或 geometry

        modelBuilder.Entity<Location>()
            .Property(l => l.Area)
            .HasColumnType("geography");
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // 关键一步：在配置数据库提供程序时，启用空间数据支持
        // 对于 SQL Server
        optionsBuilder.UseSqlServer("Data Source=.;Initial Catalog=SpatialDb;Integrated Security=True;TrustServerCertificate=True",
            x => x.UseNetTopologySuite()); // 启用 NTS 支持

        // 对于 PostgreSQL
        // optionsBuilder.UseNpgsql("Host=localhost;Database=SpatialDb;Username=postgres;Password=your_password",
        //    x => x.UseNetTopologySuite());

        // 对于 SQLite
        // optionsBuilder.UseSqlite("Data Source=spatial.db",
        //    x => x.UseNetTopologySuite());
    }
}
```

**`HasColumnType("geography")` 或 `HasColumnType("geometry")`**：

- **`geography`**：适用于经纬度坐标，通常用于表示地球表面的数据，考虑了地球的曲率。
- **`geometry`**：适用于平面坐标系统，通常用于表示相对较小的区域或在二维平面上的数据。
- 具体选择哪个取决于你的数据源和数据库提供程序的需求。

#### 空间数据的操作和查询

##### 创建和保存

使用 `NetTopologySuite.Geometries.GeometryFactory` 来创建几何对象实例

```C#
using NetTopologySuite.Geometries;

// 创建一个 GeometryFactory 实例，用于创建几何对象
// 参数 1：SRID (Spatial Reference ID)，默认为 0，表示未指定或通用
// 对于地理坐标系 (WGS84)，SRID 通常是 4326
// 对于大多数数据库，你可以在 HasColumnType("geography") 时省略 SRID，或者在几何对象创建时指定
var geometryFactory = new GeometryFactory(new PrecisionModel(), 4326); // SRID 4326 for WGS84

public async Task AddLocation()
{
    var newLocation = new Location
    {
        Name = "Eiffel Tower",
        // 创建一个点：经度 2.2945, 纬度 48.8584
        GeoLocation = geometryFactory.CreatePoint(new Coordinate(2.2945, 48.8584))
    };

    _context.Locations.Add(newLocation);
    await _context.SaveChangesAsync();
}
```

##### 查询

EF Core 允许你在 LINQ 查询中使用 NTS 几何对象的方法，EF Core 会将其转换为相应的数据库空间函数。

**常用空间函数示例 (NTS 方法名 -> 数据库函数名)**：

- `.Distance(otherGeometry)`：计算两个几何对象之间的距离。
- `.Intersects(otherGeometry)`：检查两个几何对象是否相交。
- `.Contains(otherGeometry)`：检查一个几何对象是否包含另一个几何对象。
- `.Within(otherGeometry)`：检查一个几何对象是否在另一个几何对象内部。
- `.Buffer(distance)`：创建一个几何对象周围的缓冲区（多边形）。
- `.Area`：计算多边形的面积。
- `.Length`：计算线串的长度。

示例：查询特定距离内的地点

```C#
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;

public async Task<List<Location>> GetNearbyLocations(double latitude, double longitude, double distanceInMeters)
{
    var geometryFactory = new GeometryFactory(new PrecisionModel(), 4326); // SRID 4326
    var searchPoint = geometryFactory.CreatePoint(new Coordinate(longitude, latitude));

    // 查询距离搜索点指定距离内的所有地点
    var nearbyLocations = await _context.Locations
        .Where(l => l.GeoLocation != null && l.GeoLocation.Distance(searchPoint) <= distanceInMeters)
        .ToListAsync();

    return nearbyLocations;
}
```

示例：查询指定区域内的地点

```C#
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;

public async Task<List<Location>> GetLocationsInPolygon(Polygon searchArea)
{
    // 查询 GeoLocation 位于给定多边形区域内的所有地点
    var locationsInArea = await _context.Locations
        .Where(l => l.GeoLocation != null && searchArea.Contains(l.GeoLocation))
        .ToListAsync();

    return locationsInArea;
}
```

##### 查询注意事项

- **投影查询**：当你需要执行空间操作时，通常需要将几何列包含在你的查询中。
- **SRID 匹配**：确保你在创建几何对象时使用的 SRID 与数据库列的 SRID 匹配，否则可能会导致错误或不正确的结果。对于 `geography` 类型，通常是 4326。
- **数据库函数支持**：并非所有 NTS 方法都能被 EF Core 转换为所有数据库提供程序的 SQL 函数。如果 EF Core 无法转换，你可能需要回退到 `FromSqlRaw()` 或 `FromSqlInterpolated()` 并手动编写 SQL。
- **性能**：空间查询通常涉及复杂的计算。确保你的数据库有合适的**空间索引**，以优化查询性能。

#### 空间索引

为了优化空间查询的性能，你需要在数据库中为你的空间列创建**空间索引**。EF Core 迁移无法自动创建空间索引，你通常需要：

1. **手动在数据库中创建索引**。
2. **在迁移中编写自定义 SQL 来创建索引**。

### 批量配置

批量配置是指通过编写代码来自动化模型中重复的配置任务。它不像 `HasData()` 那样是插入数据，而是**定义模型构建时的默认行为或应用特定规则**。

#### 实现方式

##### 模型构建拦截器

创建实现 `IModelFinalizingInterceptor` 接口的类，并在 `OnModelFinalizing` 方法中对模型进行最终的配置调整。

示例：批量设置所有`string`属性的最大长度为255

1. 创建自定义拦截器类

```C#
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Metadata;

// 1. 定义一个实现 IModelFinalizingInterceptor 接口的类
public class StringLengthConventionInterceptor : IModelFinalizingInterceptor
{
    // OnModelFinalizing 在模型构建的最后阶段被调用，此时所有实体、属性等都已发现
    public void ModelFinalizing(IModel model, ModelEventData eventData, InterceptionResult result)
    {
        // 遍历模型中的所有实体类型
        foreach (IMutableEntityType entityType in model.GetEntityTypes())
        {
            // 遍历当前实体类型中的所有属性
            foreach (IMutableProperty property in entityType.GetProperties())
            {
                // 检查属性是否是字符串类型，并且没有被显式设置过最大长度
                // HasMaxLength() 检查是否已设置最大长度
                if (property.ClrType == typeof(string) && property.GetMaxLength() == null)
                {
                    // 设置默认最大长度
                    property.SetMaxLength(255);
                    Console.WriteLine($"Configured '{entityType.DisplayName}.{property.Name}' to MaxLength 255");
                }
            }
        }
    }
}
```

2. 在`DbContext`种注册拦截器

```C#
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics; // For IModelFinalizingInterceptor

public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Product> Products { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("Data Source=.;Initial Catalog=BatchConfigDb;Integrated Security=True;TrustServerCertificate=True;TrustServerCertificate=True")
            .AddInterceptors(new StringLengthConventionInterceptor()); // 注册自定义拦截器
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // 你也可以在这里继续进行具体的 Fluent API 配置，
        // 它们会优先于拦截器中的通用约定
        modelBuilder.Entity<User>().Property(u => u.Email).HasMaxLength(500); // 显式设置的会覆盖默认 255
    }
}

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty; // 会被设置为 255
    public string Email { get; set; } = string.Empty;    // 会被设置为 500 (优先级高)
}

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;     // 会被设置为 255
    public string Description { get; set; } = string.Empty; // 会被设置为 255
    public decimal Price { get; set; }
}
```

当模型构建完成后，`StringLengthConventionInterceptor` 的 `ModelFinalizing` 方法会被调用，遍历所有字符串属性并应用 `MaxLength(255)`。

##### 模型构建器扩展方法

这种方法不如拦截器灵活，因为它只允许你封装**已知的、重复的配置模式**，而不是动态地检查所有实体和属性。但对于特定的配置块，它能提供更好的代码组织。

示例：为所有实体添加审计属性

1. 创建扩展方法

```C#
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public static class ModelBuilderExtensions
{
    public static void ApplyAuditProperties(this ModelBuilder modelBuilder)
    {
        // 找到所有实现了 IAuditable 接口的实体
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(IAuditable).IsAssignableFrom(entityType.ClrType))
            {
                // 为这些实体添加 CreatedDate 和 LastModifiedDate 属性
                entityType.Property<DateTime>("CreatedDate")
                    .HasDefaultValueSql("GETDATE()"); // SQL Server 语法
                entityType.Property<DateTime>("LastModifiedDate")
                    .IsRequired(false); // 可选
            }
        }
    }
}

public interface IAuditable
{
    // 实体可以实现此接口，以指示它们应该有审计属性
}

public class BlogPost : IAuditable
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    // CreatedDate 和 LastModifiedDate 将作为影子属性添加
}
```

2. 在`DbContext`种调用扩展方法

```C#
public class ApplicationDbContext : DbContext
{
    public DbSet<BlogPost> BlogPosts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyAuditProperties(); // 调用扩展方法应用批量配置
    }
}
```

这种方式需要你明确知道要配置哪些实体，并通过接口或其他方式来过滤它们。

#### 优先级

1. **数据注解 (Data Annotations)**：优先级最低。
2. **约定 (Conventions)**：包括 EF Core 内置的约定和你的自定义约定（通过拦截器或自定义约定 API）。
3. **Fluent API**：优先级最高。任何通过 `OnModelCreating` 中的 Fluent API 显式配置的规则，都会**覆盖**约定和数据注解。

这意味着，如果你在拦截器中设置了所有字符串的 `MaxLength(255)`，但你在 `OnModelCreating` 中对某个属性显式设置了 `HasMaxLength(500)`，那么该属性最终将是 `500`。

### 具有相同DbContext的交替模型

通常一个 `DbContext` 类会映射到一个单一且固定的**模型 (Model)**。这个模型包含了所有实体类型、它们之间的关系、属性的配置以及数据库映射等信息。然而，在某些高级或特定场景下，你可能希望**同一个 `DbContext` 实例能够基于不同的条件使用不同的模型**。

#### 实现方式

1. `DbContextOptions` 和 `OnConfiguring`

`DbContext` 的配置（包括它使用的模型）是通过 `DbContextOptions` 对象传递的。当你创建 `DbContext` 实例时，可以传入这些选项。

```C#
public class MyDbContext : DbContext
{
    // 构造函数接收 DbContextOptions
    public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }

    // OnModelCreating 通常用于定义模型，但如果模型是动态的，这里可能只包含共享配置
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // 共享的或通用的模型配置
    }
}
```

2. 预构建模型或使用 `OnModelCreating` 参数

   要实现交替模型，你需要：

   1. **在 `DbContext` 外部预先构建多个模型**：将模型构建逻辑封装起来，根据条件返回不同的 `IModel` 实例。
   2. **将构建好的模型传递给 `DbContextOptions`**：使用 `UseModel()` 方法。



**示例：多租户，每个租户使用不同的Schema**

假设你有 `Product` 实体，并且希望不同租户的数据存储在不同的 Schema 中（例如 `TenantA.Products`, `TenantB.Products`）。

1. 定义实体类

```C#
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
}
```

2. **创建模型缓存或工厂**：你需要一个机制来根据租户 ID 返回不同的模型。为了效率，可以缓存已构建的模型。

```C#
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using System.Collections.Concurrent;

public class TenantModelCache
{
    private static readonly ConcurrentDictionary<string, IModel> _models = new();

    public static IModel GetModelForTenant(string tenantId)
    {
        // 尝试从缓存获取，如果不存在则构建
        return _models.GetOrAdd(tenantId, id => BuildModelForTenant(id));
    }

    private static IModel BuildModelForTenant(string tenantId)
    {
        var modelBuilder = new ModelBuilder();

        // 为 Product 实体配置共享结构
        modelBuilder.Entity<Product>(b =>
        {
            b.HasKey(p => p.Id);
            b.Property(p => p.Name).HasMaxLength(100);
            b.Property(p => p.Price).HasPrecision(18, 2);
        });

        // 根据租户 ID 动态配置 Schema
        // 这里是关键！
        modelBuilder.Entity<Product>().ToTable("Products", schema: tenantId);

        // 返回构建好的模型
        return modelBuilder.FinalizeModel(); // 确保模型已最终确定
    }
}
```

3. **修改 `DbContext` 的 `OnConfiguring` 方法**：让它在构建选项时使用预构建的模型。

```C#
public class TenantDbContext : DbContext
{
    private readonly string _tenantId;

    // 构造函数除了接收 options，还需要接收租户 ID
    public TenantDbContext(DbContextOptions<TenantDbContext> options, string tenantId)
        : base(options)
    {
        _tenantId = tenantId;
    }

    public DbSet<Product> Products { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // 确保基类的 OnConfiguring 已经被调用，如果它有其他配置
        base.OnConfiguring(optionsBuilder);

        // 如果当前 DbContextOptions 中没有模型，或者模型不是我们预期的租户模型，
        // 则从缓存中获取并使用针对当前租户的模型。
        // 注意：当 DbContext 是通过依赖注入注册时，通常模型是已经构建并传递进来的，
        // 这里的 OnConfiguring 可能是冗余的，但在手动创建 DbContext 时很有用。
        if (!optionsBuilder.IsConfigured || optionsBuilder.Options.Model == null)
        {
             // 从预构建的缓存中获取模型
            optionsBuilder.UseModel(TenantModelCache.GetModelForTenant(_tenantId));
        }
    }

    // 通常，当使用 UseModel() 时，OnModelCreating 不会再次执行，
    // 所以这里可以空着或只包含不依赖租户的通用配置。
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // base.OnModelCreating(modelBuilder); // 确保基类配置被执行
        // 此方法在此方案中可能不会被调用，因为模型是在外部通过 UseModel() 传递的
    }
}
```

4. **在应用程序启动时或请求生命周期中注册 `DbContext` 和提供租户 ID**：

```C#
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http; // For HttpContextAccessor

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddHttpContextAccessor(); // 允许访问 HttpContext 来获取租户 ID

        // 注册 DbContext 并动态提供模型和租户 ID
        services.AddDbContext<TenantDbContext>((serviceProvider, options) =>
        {
            var httpContextAccessor = serviceProvider.GetRequiredService<IHttpContextAccessor>();
            // 从 HttpContext (例如请求头、URL) 获取租户 ID
            var tenantId = httpContextAccessor.HttpContext?.Request.Headers["X-Tenant-Id"].FirstOrDefault() ?? "DefaultTenant";

            options.UseSqlServer("YourConnectionString"); // 连接字符串可以共享
            options.UseModel(TenantModelCache.GetModelForTenant(tenantId)); // 传递预构建的模型
        });

        // ... 其他服务
    }
}
```

#### 注意事项

- **模型构建成本**：构建 EF Core 模型是一个相对耗时的操作。因此，**强烈建议缓存预构建的模型**（如 `TenantModelCache` 所示），而不是每次都重新构建。
- **`modelBuilder.FinalizeModel()`**：在 `ModelBuilder` 上调用 `FinalizeModel()` 会返回一个不可变的 `IModel` 实例。这个模型可以被缓存和重复使用。
- **迁移 (Migrations)**：当使用交替模型时，数据库迁移变得更加复杂。EF Core 迁移工具通常会期望一个单一、固定的模型。
  - 你可能需要为每个租户 Schema 维护一套独立的迁移。
  - 或者，如果你只改变 Schema 名称，而实体结构不变，那么迁移可能只需要针对一个“模板”Schema 运行，然后手动或通过脚本将更改应用到所有实际的租户 Schema。
  - 通常，这种多租户架构在迁移时需要自定义脚本，而不是完全依赖 EF Core 的自动迁移。
- **查询性能**：使用交替模型本身对查询性能影响不大，因为最终还是使用了优化的 `IModel`。
- **复杂性**：这种模式增加了应用程序的复杂性。只有在你确实需要根据运行时条件动态改变数据库 Schema 或实体映射时才考虑使用。对于简单的多租户，可能通过数据过滤或在 `OnModelCreating` 中基于运行时上下文进行简单配置更合适。
- **共享与独立配置**：确保你的模型构建逻辑清晰地区分哪些配置是**共享的**（例如，所有租户的 `Product` 都有 `Name` 和 `Price`），哪些是**特定于租户的**（例如，`ToTable("Products", schema: tenantId)`）。

## 管理数据库架构

### 迁移

#### 概述

**迁移**允许你**增量地管理数据库架构的更改**，以使其与你的 EF Core 模型保持同步。简单来说，每当你的 C# 实体类（你的模型）发生变化时，迁移工具可以自动生成代码来更新数据库架构，而不会丢失现有数据。

场景：你正在开发一个应用程序。

- **初始阶段**：你创建了一些 C# 实体类，比如 `Blog` 和 `Post`。当你第一次运行应用程序时，EF Core 迁移可以帮助你**创建**相应的 `Blogs` 和 `Posts` 表及其关系。
- **开发中途**：你决定给 `Blog` 实体添加一个 `Rating` 属性。如果你手动去数据库添加列，很麻烦。更糟糕的是，如果其他团队成员也修改了模型，大家的代码和数据库会变得不一致。
- **迁移的解决方案**：当你修改了 C# 模型后，运行 EF Core 迁移命令，它会：
  1. **比较**当前模型和上次迁移时的模型。
  2. **生成**一个新的迁移文件（C# 代码），其中包含了将数据库架构从旧状态更新到新状态所需的 SQL 语句（例如，`ALTER TABLE Add Column Rating`）。
  3. 当你部署应用程序或执行 `Update-Database` 命令时，这些迁移文件会**应用**到数据库，从而更新你的数据库架构。

**迁移的工作流程：**

1. **修改 EF Core 模型**：在你的 C# 项目中添加、修改或删除实体、属性或关系。

```C#
// 示例：给 Blog 实体添加 Rating 属性
public class Blog
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Rating { get; set; } // 新增属性
}
```

2. **添加新的迁移**：在项目的根目录下，使用 .NET CLI 或 NuGet 包管理器控制台命令：

```C#
# .NET CLI
dotnet ef migrations add AddBlogRating

# NuGet 包管理器控制台
Add-Migration AddBlogRating
```

EF Core 会分析你的模型变化，并在 `Migrations` 文件夹下生成一个新的 C# 迁移文件（例如 `20230714103000_AddBlogRating.cs`）。这个文件包含 `Up()` 和 `Down()` 方法。

- `Up()` 方法包含将数据库更新到新架构所需的逻辑（例如 `migrationBuilder.AddColumn(...)`）。
- `Down()` 方法包含撤销该迁移所需的逻辑（例如 `migrationBuilder.DropColumn(...)`）。

3. **检查生成的迁移文件**：**强烈建议**在应用迁移之前检查生成的 C# 迁移文件。确保它包含了你期望的数据库操作，并且没有意外的更改。

4. **应用迁移到数据库**：使用以下命令将迁移应用到你的目标数据库：

```BASH
# .NET CLI
dotnet ef database update

# NuGet 包管理器控制台
Update-Database
```

EF Core 会连接到数据库，查找已应用的迁移，然后执行所有尚未应用的迁移文件中的 `Up()` 方法。它还会维护一个名为 `__EFMigrationsHistory` 的特殊表，用于记录哪些迁移已经成功应用。

5. **回滚/撤销迁移（可选）**：如果需要回滚到之前的数据库状态，你可以指定要回滚到的迁移名称或 ID：

```BASH
# .NET CLI
dotnet ef database update InitialCreate # 回滚到名为 InitialCreate 的迁移
# 或 dotnet ef database update 0 # 回滚到没有任何迁移的状态

# NuGet 包管理器控制台
Update-Database InitialCreate
```

EF Core 会执行相应迁移的 `Down()` 方法。

#### 管理

EF Core 迁移主要通过两个工具来管理：

- **.NET CLI (命令行接口)**：推荐使用，跨平台，易于集成到脚本中。
- **NuGet 包管理器控制台 (PMC)**：仅限于 Visual Studio。

无论使用哪个工具，命令的参数和功能都是相似的。以下是核心命令：

1. **`Add-Migration` / `dotnet ef migrations add`：创建新的迁移文件**

这个命令用于**创建**一个新的迁移文件，它会捕捉你当前 EF Core 模型与上次迁移（或初始状态）之间的所有差异，并生成相应的 C# 代码。

```BASH
# .NET CLI
dotnet ef migrations add <MigrationName> -p <ProjectName> -s <StartupProjectName>

# NuGet 包管理器控制台
Add-Migration <MigrationName> -Project <ProjectName> -StartupProject <StartupProjectName>
```

- `<MigrationName>`：为你的迁移提供一个**有意义的名称**，反映这次模型变化的内容（例如 `AddProductRating`, `RenameUserTable`, `InitialCreate`）。
- `-p <ProjectName>` / `-Project <ProjectName>`：指定包含 `DbContext` 和实体模型的项目（如果不是当前目录）。
- `-s <StartupProjectName>` / `-StartupProject <StartupProjectName>`：指定启动项目，该项目包含 `DbContext` 的配置和连接字符串，通常是 Web 项目或控制台项目。

**执行过程**：

1. EF Core 会读取你项目中的 `DbContext` 定义和所有实体类。
2. 它会加载数据库中 `__EFMigrationsHistory` 表的记录，以了解当前数据库应用的迁移状态。
3. EF Core 会比较**当前代码模型**和**数据库中已应用的最新迁移所代表的模型**之间的差异。
4. 基于这些差异，生成一个带有时间戳前缀的 C# 文件，例如 `20230715100000_AddProductRating.cs`。这个文件包含：
   - `Up(MigrationBuilder migrationBuilder)` 方法：用于将数据库更新到新模型状态的操作。
   - `Down(MigrationBuilder migrationBuilder)` 方法：用于回滚此迁移的操作。
   - `BuildTargetModel(ModelBuilder modelBuilder)` 方法：用于表示此迁移完成后的模型快照。

---

**2. `Update-Database` / `dotnet ef database update`：应用迁移到数据库**

这个命令用于将尚未应用于数据库的迁移**应用**到数据库，从而更新数据库架构。

```BASH
# .NET CLI
dotnet ef database update <TargetMigration> -p <ProjectName> -s <StartupProjectName>

# NuGet 包管理器控制台
Update-Database -TargetMigration <TargetMigration> -Project <ProjectName> -StartupProject <StartupProjectName>
```

`<TargetMigration>`（可选）：指定要更新到的**目标迁移**。

- 如果省略，则 EF Core 会应用所有尚未应用的迁移，将数据库更新到最新的模型状态。
- 可以指定一个迁移名称（例如 `InitialCreate`），EF Core 会回滚或前进到那个迁移状态。
- 可以指定 `0`（或 `"$Initial"`），这将回滚所有迁移，使数据库回到初始状态（所有表被删除）。

**执行过程：**

1. EF Core 会连接到目标数据库。
2. 检查 `__EFMigrationsHistory` 表，确定数据库当前已应用了哪些迁移。
3. 根据 `<TargetMigration>` 参数，EF Core 会决定是执行哪些迁移的 `Up()` 方法（前进）还是 `Down()` 方法（回滚）。
4. 执行完每个迁移的相应方法后，会在 `__EFMigrationsHistory` 表中记录或删除该迁移的条目。

---

3. **`Remove-Migration` / `dotnet ef migrations remove`：删除上次的迁移**

这个命令用于**删除上次添加的迁移文件**，并回滚上次 `Add-Migration` 命令对模型快照所做的更改。

```BASH
# .NET CLI
dotnet ef migrations remove -p <ProjectName> -s <StartupProjectName>

# NuGet 包管理器控制台
Remove-Migration -Project <ProjectName> -StartupProject <StartupProjectName>
```

- **重要**：这个命令**只能删除尚未应用到任何数据库的最新迁移**。如果迁移已经被应用到数据库，则不能直接删除，需要先回滚数据库到该迁移之前。
- 通常用于在你发现最新生成的迁移有问题，但尚未将其应用到任何数据库时，进行清理。

---

4. **`Script-Migration` / `dotnet ef migrations script`：生成 SQL 脚本**

这个命令用于**生成 SQL 脚本**，而不是直接应用迁移。这在以下场景中非常有用：

- **部署到生产环境**：你可能没有权限在生产服务器上直接运行 `Update-Database` 命令，或者希望 DBA 手动审查和执行 SQL 脚本。
- **版本控制 SQL 脚本**：将 SQL 脚本作为项目的一部分进行版本控制。
- **比较不同数据库版本间的差异**：生成两个迁移之间的 SQL 脚本。

```BASH
# 生成所有尚未应用的迁移的 SQL 脚本
# .NET CLI
dotnet ef migrations script -p <ProjectName> -s <StartupProjectName> -o output.sql

# NuGet 包管理器控制台
Script-Migration -Output output.sql -Project <ProjectName> -StartupProject <StartupProjectName>
```

```BASH
# 生成从特定迁移到另一个特定迁移的 SQL 脚本
# .NET CLI
dotnet ef migrations script <FromMigration> <ToMigration> -o output.sql

# NuGet 包管理器控制台
Script-Migration -From <FromMigration> -To <ToMigration> -Output output.sql
```

- `-o output.sql` / `-Output output.sql`：指定输出 SQL 脚本的文件名。
- `<FromMigration>` / `-From <FromMigration>`：可选，指定生成脚本的起始迁移（或 `0` 表示从头开始）。
- `<ToMigration>` / `-To <ToMigration>`：可选，指定生成脚本的结束迁移（如果省略，则为最新迁移）。
- `--idempotent` / `-idempotent`：生成一个幂等脚本。这意味着脚本可以安全地在已应用或未应用相同迁移的数据库上运行，而不会失败。它会在执行前检查 `__EFMigrationsHistory` 表。

### 创建和删除API

| 特性         | EnsureCreatedAsync()                                | EnsureDeletedAsync()                   | 迁移 (Migrations)                             |
| ------------ | --------------------------------------------------- | -------------------------------------- | --------------------------------------------- |
| 创建方式     | 基于当前 EF Core 模型一次性创建所有表               | N/A (用于删除)                         | 基于模型差异生成增量 SQL 脚本                 |
| 更新能力     | 无增量更新能力，不会更新现有表                      | N/A                                    | 支持增量更新，逐步演进数据库架构              |
| 数据保留     | 仅在创建新数据库时有效，不处理现有数据，不保留数据  | 会删除所有数据                         | 尽可能保留数据，专注于架构变更                |
| 历史追踪     | 不使用 __EFMigrationsHistory 表（如果存在则不工作） | N/A                                    | 使用 __EFMigrationsHistory 表跟踪已应用的迁移 |
| 生产环境适用 | 不适用                                              | 极度谨慎使用 (通常仅用于测试/开发清理) | 推荐用于生产环境的数据库架构管理              |
| 使用场景     | 测试、原型、简单应用                                | 测试环境清理、开发环境重置             | 长期项目、团队协作、CI/CD 部署、生产环境      |

#### `EnsureCreatedAsync`

`EnsureCreatedAsync()` 是一个异步方法，它会**确保数据库存在且与当前的 EF Core 模型兼容**。

**工作原理**

- **检查数据库是否存在**：如果数据库不存在，它会根据当前 `DbContext` 的模型**创建数据库及其所有表、索引、外键等**。
- **检查模型兼容性**：
  - 如果数据库已存在，它会检查数据库架构是否与当前的 EF Core 模型**兼容**。
  - 如果数据库中**不存在任何迁移历史**（即 `__EFMigrationsHistory` 表），并且数据库架构与模型不匹配，它会尝试创建缺少的对象。
  - **如果数据库中存在迁移历史**（即 `__EFMigrationsHistory` 表存在），并且模型与已应用的迁移不匹配，`EnsureCreatedAsync()` **不会执行任何操作来更新数据库**。它会认为数据库是由迁移管理的，因此不会干扰已存在的迁移历史。

**主要用途**

- **测试环境 (Unit/Integration Tests)**：在测试开始时快速创建一个干净的数据库，用于运行测试用例。
- **原型开发/快速启动**：在项目初期，你可能不想每次都使用迁移，只想快速运行并看到数据库效果。
- **非常简单的应用程序**：对于那些数据库架构极少变化，或者数据丢失不重要的应用。
- **在没有迁移时填充数据**：如果你没有使用迁移，并且需要一个数据库来开始，`EnsureCreatedAsync()` 可以帮你快速创建。

**缺点和限制**

- **不支持增量更新**：这是最主要的缺点。`EnsureCreatedAsync()` **不会生成迁移来增量更新数据库架构**。如果你修改了模型，再次运行 `EnsureCreatedAsync()` **不会**更新数据库以反映这些更改。它只会创建缺失的表，而不会修改现有表。
- **不适用于生产环境**：由于不支持增量更新，它不适用于需要平稳升级数据库架构的生产环境。在生产环境中，你几乎总是需要使用迁移来管理数据库变更。
- **无法回滚**：没有内置的机制来回滚特定的架构更改。
- **不处理数据迁移**：它只处理架构，不会帮你迁移或保留现有数据。

**示例：**

```C#
public class MyDbContext : DbContext
{
    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=MyTestDb;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False");
    }
}

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
}

public async Task CreateDatabaseWithEnsureCreated()
{
    using (var context = new MyDbContext())
    {
        // 如果 MyTestDb 不存在，它会被创建，Products 和 Orders 表也会被创建
        // 如果 MyTestDb 存在且没有 __EFMigrationsHistory 表，它会尝试创建缺失的表
        // 如果 MyTestDb 存在且有 __EFMigrationsHistory 表，它什么也不做
        var created = await context.Database.EnsureCreatedAsync();
        if (created)
        {
            Console.WriteLine("Database and schema ensured created.");
        }
        else
        {
            Console.WriteLine("Database and schema already exist.");
        }
    }
}
```

#### `EnsureDeletedAsync()`

`EnsureDeletedAsync()` 是一个异步方法，它会**删除数据库**。

**工作原理**

- 这个方法会删除与 `DbContext` 配置的连接字符串对应的**整个数据库**（包括所有表、数据、视图、存储过程等）。
- 它会执行 `DROP DATABASE` 命令。

**主要用途**

- **测试环境清理**：在每次测试运行后清理数据库，确保下一次测试在一个干净的环境中开始。
- **开发环境重置**：在开发过程中，当你需要彻底重置数据库到初始状态时。

**缺点和风险**

- **数据丢失**：删除数据库会导致**所有数据永久丢失**。在生产环境或任何包含重要数据的环境中使用时，必须极其谨慎。
- **权限要求**：执行此操作需要数据库用户具有 `DROP DATABASE` 的权限。

**示例：**

```C#
public async Task DeleteDatabaseWithEnsureDeleted()
{
    using (var context = new MyDbContext())
    {
        // 删除 MyTestDb 数据库
        var deleted = await context.Database.EnsureDeletedAsync();
        if (deleted)
        {
            Console.WriteLine("Database deleted.");
        }
        else
        {
            Console.WriteLine("Database did not exist or could not be deleted.");
        }
    }
}
```

### 逆向工程（基架）

**逆向工程**在 EF Core 中指的是根据**已有的数据库**来自动生成对应的 **EF Core 模型**（包括 `DbContext` 类和实体类）

#### 使用方式

1. **安装必要的工具和包**

   1. EF Core工具包

   ```BASH
   # 如果是 .NET CLI
   dotnet tool install --global dotnet-ef
   
   # 如果是 NuGet 包管理器控制台，则在你的项目上安装
   Install-Package Microsoft.EntityFrameworkCore.Tools
   ```

   2. 数据库程序提供包

      - SQL SERVER

      ```BASH
      dotnet add package Microsoft.EntityFrameworkCore.SqlServer
      dotnet add package Microsoft.EntityFrameworkCore.Design
      ```

      - PostgreSQL

      ```BASH
      dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
      dotnet add package Microsoft.EntityFrameworkCore.Design
      ```

      - SQLite

      ```BASH
      dotnet add package Microsoft.EntityFrameworkCore.Sqlite
      dotnet add package Microsoft.EntityFrameworkCore.Design
      ```

      - MySQL

      ```BASH
      dotnet add package Pomelo.EntityFrameworkCore.MySql
      dotnet add package Microsoft.EntityFrameworkCore.Design
      ```

2. **核心命令：`Scaffold-DbContext` / `dotnet ef dbcontext scaffold`**

```BASH
# .NET CLI
dotnet ef dbcontext scaffold "<ConnectionString>" <DatabaseProvider> -o <OutputDirectory> -c <DbContextName> -f --no-onconfiguring -t <TableName1> -t <TableName2> -p <ProjectName> -s <StartupProjectName>

# NuGet 包管理器控制台
Scaffold-DbContext "<ConnectionString>" <DatabaseProvider> -OutputDir <OutputDirectory> -Context <DbContextName> -Force -NoOnConfiguring -Tables <TableName1>,<TableName2> -Project <ProjectName> -StartupProject <StartupProjectName>
```

- **`"<ConnectionString>"`**：
  - **必需**。这是连接到你的数据库的连接字符串。**务必用引号括起来**，特别是当它包含空格或其他特殊字符时。
  - 示例 (SQL Server)：`"Server=(localdb)\\mssqllocaldb;Database=MyExistingDb;Trusted_Connection=True;"`
- **`<DatabaseProvider>`**：
  - **必需**。指定要使用的 EF Core 数据库提供程序。
  - 示例：`Microsoft.EntityFrameworkCore.SqlServer`, `Npgsql.EntityFrameworkCore.PostgreSQL`, `Microsoft.EntityFrameworkCore.Sqlite`, `Pomelo.EntityFrameworkCore.MySql`。
- **`-o <OutputDirectory>` / `-OutputDir <OutputDirectory>`**：
  - **可选**。指定生成 C# 文件（实体类和 DbContext）的输出目录。如果目录不存在，会自动创建。
  - 例如：`-o Models`
- **`-c <DbContextName>` / `-Context <DbContextName>`**：
  - **可选**。指定生成的 `DbContext` 类的名称。如果省略，EF Core 会根据数据库名称生成一个默认名称（例如 `MyExistingDbContext`）。
- **`-f` / `-Force`**：
  - **可选**。如果输出目录中已存在生成的文件，则**强制覆盖**它们。**谨慎使用**，因为它会覆盖你可能对生成的代码所做的任何手动更改。
- **`--no-onconfiguring` / `-NoOnConfiguring`**：
  - **可选**。默认情况下，EF Core 会在生成的 `DbContext` 类的 `OnConfiguring` 方法中包含你的连接字符串。这通常不是最佳实践，因为它将连接字符串硬编码到代码中。使用此选项可以阻止这种行为，让你可以在应用程序的启动配置中（例如 `Program.cs` 或 `Startup.cs` 中的依赖注入）管理连接字符串。**强烈推荐使用此选项。**
- **`-t <TableName1> -t <TableName2>` / `-Tables <TableName1>,<TableName2>`**：
  - **可选**。指定要逆向工程的特定表。如果你只想生成部分表的模型，可以使用此选项。可以重复 `-t` 参数来指定多个表。
  - 例如：`-t Products -t Orders`
- **`--schema <SchemaName>` / `-Schemas <SchemaName>`**：
  - **可选**。指定要逆向工程的特定数据库 Schema。可以重复 `--schema` 参数。
- **`-p <ProjectName>` / `-Project <ProjectName>`**：
  - **可选**。指定包含你的 `DbContext` 的项目。
- **`-s <StartupProjectName>` / `-StartupProject <StartupProjectName>`**：
  - **可选**。指定启动项目，该项目是应用程序的入口点（例如 Web 项目）。

#### 结果示例

逆向工程 SQL Server 数据库：

```BASH
# .NET CLI 示例
dotnet ef dbcontext scaffold "Server=(localdb)\\mssqllocaldb;Database=Northwind;Trusted_Connection=True;" Microsoft.EntityFrameworkCore.SqlServer -o Models -c NorthwindContext -f --no-onconfiguring -t Customers -t Orders
```

**生成的代码结构**

```BASH
YourProject/
├── Models/
│   ├── NorthwindContext.cs  // DbContext 类
│   ├── Customer.cs          // 客户实体类
│   ├── Order.cs             // 订单实体类
│   └── ... (其他实体类)
└── ...
```

生成的 `DbContext` 文件 (例如 `NorthwindContext.cs`)：

```C#
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

#nullable disable

namespace YourNamespace.Models
{
    public partial class NorthwindContext : DbContext
    {
        public NorthwindContext()
        {
        }

        public NorthwindContext(DbContextOptions<NorthwindContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Customer> Customers { get; set; }
        public virtual DbSet<Order> Orders { get; set; }
        // ... 其他 DbSet

        // 如果你使用了 --no-onconfiguring，这个方法会留空或被省略
        // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        // {
        //     if (!optionsBuilder.IsConfigured)
        //     {
        //         optionsBuilder.UseSqlServer("YourHardcodedConnectionString"); // 避免硬编码
        //     }
        // }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            // 为每个表生成 Fluent API 配置
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(e => e.CustomerId);
                entity.Property(e => e.CustomerId).HasMaxLength(5);
                entity.Property(e => e.CompanyName).HasMaxLength(40);
                // ... 其他属性配置
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.OrderId);
                entity.Property(e => e.CustomerId).HasMaxLength(5);
                // ... 其他属性配置和关系配置
                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.Orders)
                    .HasForeignKey(d => d.CustomerId)
                    .HasConstraintName("FK_Orders_Customers");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
```

生成的实体类文件（例如`Customers.cs`）

```C#
using System;
using System.Collections.Generic;

#nullable disable

namespace YourNamespace.Models
{
    public partial class Customer
    {
        public Customer()
        {
            Orders = new HashSet<Order>(); // 集合导航属性的初始化
        }

        public string CustomerId { get; set; } = null!;
        public string CompanyName { get; set; } = null!;
        public string? ContactName { get; set; } // 可空属性
        // ... 其他属性

        public virtual ICollection<Order> Orders { get; set; } // 导航属性
    }
}
```

#### 逆向工程后的管理

一些后续的调整和维护：

- **移除 `OnConfiguring` 中的连接字符串**：如果你没有使用 `--no-onconfiguring`，请务必将其删除，并在应用程序的配置中（例如 `appsettings.json` 或依赖注入）管理连接字符串。
- **重命名属性和类**：生成的属性名和类名可能不符合你的 C# 命名约定。你可以安全地重命名它们，EF Core 会通过 Fluent API 配置来正确映射。
- **添加业务逻辑**：生成的实体是 POCO (Plain Old CLR Objects)，你需要添加验证、计算属性、方法等业务逻辑。
- **优化 Fluent API 配置**：EF Core 可能会生成非常详细的 Fluent API 配置。你可以审查并简化那些符合 EF Core 默认约定的配置。
- **主键和索引**：EF Core 会尽可能地识别主键和唯一索引。对于非唯一索引，你可能需要在 `OnModelCreating` 中手动添加配置。
- **管理模型演变**：**一旦你对逆向工程生成的模型进行了修改，你就应该切换到使用 EF Core 迁移来管理后续的数据库架构变化。** 不要再次运行 `Scaffold-DbContext -Force`，除非你明确想覆盖所有手动更改。

## 查询数据

### 跟踪/不跟踪查询

| 场景                  | 推荐选择        | 原因                                                  |
| --------------------- | --------------- | ----------------------------------------------------- |
| 需要修改并保存数据    | 跟踪查询 (默认) | DbContext 自动检测变更并生成 UPDATE 语句。            |
| 只读操作 (显示、报告) | 不跟踪查询      | 提升性能，减少内存和 CPU 开销，因为无需变更检测。     |
| 加载大量数据          | 不跟踪查询      | 显著减少内存消耗和变更检测的性能负担。                |
| 查询性能至关重要      | 不跟踪查询      | 绕过变更跟踪机制，减少开销。                          |
| 避免内存中重复对象    | 跟踪查询        | DbContext 会确保同一主键的实体只存在一个 C# 实例。    |
| 手动管理实体生命周期  | 不跟踪查询      | 允许你完全控制实体的创建和状态，而无需 EF Core 干预。 |

| 对比点         | 跟踪查询               | 不跟踪查询                              |
| -------------- | ---------------------- | --------------------------------------- |
| 是否默认开启   | ✅ 是                   | ❌ 否，需要 `.AsNoTracking()`            |
| 是否记录状态   | ✅ 会记录               | ❌ 不记录                                |
| 是否能更新实体 | ✅ `SaveChanges()` 有效 | ❌ 无效，需手动 `Attach()`               |
| 内存性能       | 🚨 高                   | ✅ 低，推荐大数据量使用                  |
| 导航属性重复   | ✅ 自动去重             | ❌ 可能重复（用 WithIdentityResolution） |

#### 跟踪

在 EF Core 中，当你执行一个查询并加载实体时，这些实体通常会被 **`DbContext` 实例跟踪 (Tracked)**。这意味着：

- **状态管理**：`DbContext` 会为每个加载的实体维护一个内部状态，比如 `Unchanged`（未更改）、`Modified`（已修改）、`Added`（已添加）或 `Deleted`（已删除）。
- **变更检测**：`DbContext` 会监控这些被跟踪实体属性的任何更改。
- **同步数据库**：当你调用 `SaveChanges()` 或 `SaveChangesAsync()` 时，`DbContext` 会利用这些被跟踪实体的状态信息，自动生成相应的 `INSERT`、`UPDATE` 或 `DELETE` 语句来同步数据库。

简而言之，被跟踪的实体就像是 `DbContext` 的“受控对象”，`DbContext` 知道它们是谁，它们从数据库加载时的原始值是什么，以及它们当前被修改成了什么样子。

示例：

```C#
public class MyDbContext : DbContext
{
    public DbSet<Product> Products { get; set; }
    // ... 其他 DbSet
}

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
}

public async Task UpdateProductName(int productId, string newName)
{
    using (var context = new MyDbContext())
    {
        // 这是一个跟踪查询：Product 实体会被 DbContext 跟踪
        var product = await context.Products.FirstOrDefaultAsync(p => p.Id == productId);

        if (product != null)
        {
            // 修改 Name 属性
            product.Name = newName;

            // DbContext 检测到 product.Name 的变化，并将其标记为 Modified
            // SaveChanges() 会生成 UPDATE 语句更新数据库
            await context.SaveChangesAsync();
            Console.WriteLine($"Product {productId} name updated to {newName}");
        }
    }
}
```

#### 不跟踪

**不跟踪查询 (No-Tracking Queries)** 意味着 EF Core 在加载实体后**不会**将它们添加到 `DbContext` 的变更跟踪器中。

通过调用 LINQ 查询的 `.AsNoTracking()` 扩展方法来明确指定一个查询为不跟踪查询。

```C#
using Microsoft.EntityFrameworkCore; // 需要此命名空间来使用 AsNoTracking()

public async Task GetProductsAsNoTracking()
{
    using (var context = new MyDbContext())
    {
        // 这是一个不跟踪查询：加载的 Product 实体不会被 DbContext 跟踪
        var products = await context.Products.AsNoTracking().ToListAsync();

        Console.WriteLine("No-Tracking Products:");
        foreach (var product in products)
        {
            Console.WriteLine($"Id: {product.Id}, Name: {product.Name}");
            // 尝试修改 product.Name = "New Name"; 然后调用 SaveChanges() 将无效，
            // 因为 product 不受跟踪。
        }
    }
}
```

默认的 `.AsNoTracking()` 不会尝试去重，因此可能导致导航属性或引用重复。

使用 `.AsNoTrackingWithIdentityResolution()` 可以保证即使不跟踪，返回的对象依然不会重复引用相同实体。

```C#
var blogs = dbContext.Blogs
    .Include(b => b.Posts)
    .AsNoTrackingWithIdentityResolution()
    .ToList();

```



如果你通过不跟踪查询获取了一个实体，但后来决定需要修改并保存它，你可以使用 `DbContext` 的 `Attach()` 方法将其添加到跟踪器中。

```C#
public async Task AttachAndSaveProduct(int productId, string newName)
{
    using (var context = new MyDbContext())
    {
        // 1. 获取一个不跟踪的 Product 实例（可能来自其他层或缓存）
        var productToUpdate = new Product { Id = productId, Name = "Old Name", Price = 10.00m };

        // 2. 将此实体附加到 DbContext 的跟踪器中，并标记为 Modified
        // 如果实体已存在于数据库，Attach() 会将其设置为 Unchanged 状态
        // 然后你需要手动将状态设置为 Modified
        context.Attach(productToUpdate).State = EntityState.Modified;

        // 3. 修改属性
        productToUpdate.Name = newName; // 此时 DbContext 已经知道它被修改

        // 4. 保存更改
        await context.SaveChangesAsync();
        Console.WriteLine($"Product {productId} name updated to {newName} via attaching.");
    }
}
```

### 加载相关数据

**相关数据 (Related Data)** 指的是通过导航属性连接的实体。例如：

- **一对多 (One-to-Many)**：一个 `Blog` 有一个 `ICollection<Post>` 导航属性（`Posts`），而 `Post` 有一个 `Blog` 导航属性。
- **一对一 (One-to-One)**：一个 `Product` 可能有一个 `ProductDetails` 导航属性，而 `ProductDetails` 也有一个 `Product` 导航属性。
- **多对多 (Many-to-Many)**：一个 `Author` 可以有多本 `Book`，一本 `Book` 可以有多个 `Author`。

默认情况下，当你查询一个实体时，EF Core **不会自动加载其相关的实体**。这意味着如果你查询一个 `Blog`，它的 `Posts` 集合（导航属性）将是空的或者 `null`。你需要明确告诉 EF Core 何时以及如何加载这些相关数据。

---

EF Core 提供了三种主要的策略来加载相关数据：

1. **预先加载 (Eager Loading)**：在查询主实体时，立即加载其相关实体。
2. **显式加载 (Explicit Loading)**：在查询主实体后，根据需要单独加载其相关实体。
3. **延迟加载 (Lazy Loading)**：在访问导航属性时，按需自动加载相关实体。

| 策略                | 优点                             | 缺点                                          | 适用场景                                          |
| ------------------- | -------------------------------- | --------------------------------------------- | ------------------------------------------------- |
| 预先加载 (Eager)    | 减少数据库往返次数，通常最高效。 | 可能加载过多不需要的数据。                    | 提前知道所需相关数据，且数据量适中。              |
| 显式加载 (Explicit) | 按需加载，避免不必要的加载。     | 可能导致 N+1 查询问题；需要手动编写加载代码。 | 主实体已加载，但相关数据仅在特定条件下才需要。    |
| 延迟加载 (Lazy)     | 简化代码，自动按需加载。         | 最易导致 N+1 查询问题；隐藏数据库访问。       | 仅在极少数情况下访问相关数据，或快速原型。 慎用！ |

#### 预先加载

预先加载是指在使用 `Include()` 和 `ThenInclude()` 扩展方法时，在**执行主查询时就一并加载相关数据**。这是最常用和推荐的策略，因为它通常能生成最优的 SQL 查询（通常是一个 `JOIN` 语句），从而减少数据库往返次数。

- **使用场景**：你确切知道你需要哪些相关数据，并且这些数据是主查询结果的每个实体都需要或很可能需要时。
- **优点**：减少数据库查询次数（N+1 问题）。
- **缺点**：如果加载了太多不必要的相关数据，可能会导致查询结果集过大，降低性能。

**`Include`示例：**

```C#
using Microsoft.EntityFrameworkCore;

public class Blog
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public ICollection<Post> Posts { get; set; } = new List<Post>(); // 导航属性
}

public class Post
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int BlogId { get; set; } // 外键
    public Blog Blog { get; set; } = null!; // 导航属性
}

public class MyDbContext : DbContext
{
    public DbSet<Blog> Blogs { get; set; }
    public DbSet<Post> Posts { get; set; }
    // ...
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("YourConnectionString");
    }
}

public async Task GetBlogsWithPosts()
{
    using (var context = new MyDbContext())
    {
        // 加载所有 Blog，同时加载每个 Blog 的所有相关 Post
        var blogs = await context.Blogs
            .Include(b => b.Posts) // 预先加载 Posts 集合
            .ToListAsync();

        foreach (var blog in blogs)
        {
            Console.WriteLine($"Blog: {blog.Title}");
            foreach (var post in blog.Posts)
            {
                Console.WriteLine($"  Post: {post.Title}");
            }
        }
    }
}
```

**加载多级关系，`ThenInclude`示例**：

```C#
public class Order
{
    public int Id { get; set; }
    public DateTime OrderDate { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}

public class OrderItem
{
    public int Id { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!; // 产品信息
}

public async Task GetOrdersWithItemsAndProducts()
{
    using (var context = new MyDbContext())
    {
        // 加载所有 Order，同时加载每个 Order 的 OrderItem，再同时加载每个 OrderItem 的 Product
        var orders = await context.Orders
            .Include(o => o.OrderItems)          // 加载 OrderItem 集合
                .ThenInclude(oi => oi.Product)   // 接着加载 OrderItem 的 Product
            .ToListAsync();

        foreach (var order in orders)
        {
            Console.WriteLine($"Order: {order.Id} on {order.OrderDate}");
            foreach (var item in order.OrderItems)
            {
                Console.WriteLine($"  Item: {item.Quantity} x {item.Product.Name} at {item.UnitPrice}");
            }
        }
    }
}
```

**预先加载过滤：`Include().Where()` 或 `ThenInclude().Where()`**

```C#
public async Task GetBlogsWithPublishedPosts()
{
    using (var context = new MyDbContext())
    {
        // 加载所有 Blog，但只加载其 Published = true 的 Post
        var blogs = await context.Blogs
            .Include(b => b.Posts.Where(p => p.IsPublished)) // EF Core 7.0+
            .ToListAsync();

        // SQL 会在 JOIN 后面添加 ON p.IsPublished = 1
    }
}
```

#### 显示加载

显式加载是指**先加载主实体，然后在需要时才单独发出查询来加载其相关实体**。

- **使用场景**：你最初不需要相关数据，但在某些条件下（例如，用户点击了一个“查看详情”按钮），才需要加载它们。或者当你只需要加载一个特定实体的一小部分相关数据时。
- **优点**：只有在真正需要时才查询相关数据，避免不必要的加载。
- **缺点**：可能会导致“N+1 查询问题”——如果你遍历一个集合并为每个元素显式加载相关数据，那么会发出 N+1 次查询（1 次主查询 + N 次相关数据查询）。

示例：显式加载单个相关实体 (`Reference`)

```C#
public async Task GetPostAndThenItsBlog(int postId)
{
    using (var context = new MyDbContext())
    {
        var post = await context.Posts.FirstOrDefaultAsync(p => p.Id == postId);

        if (post != null)
        {
            // 如果 Blog 导航属性为 null (默认未加载)
            // 显式加载 Post 所属的 Blog
            await context.Entry(post).Reference(p => p.Blog).LoadAsync();

            Console.WriteLine($"Post: {post.Title}, Blog: {post.Blog?.Title}");
        }
    }
}
```

示例：显式加载相关集合 (`Collection`)

```C#
public async Task GetBlogAndThenItsPosts(int blogId)
{
    using (var context = new MyDbContext())
    {
        var blog = await context.Blogs.FirstOrDefaultAsync(b => b.Id == blogId);

        if (blog != null)
        {
            // 如果 Posts 集合为空 (默认未加载)
            // 显式加载 Blog 的所有 Post
            await context.Entry(blog).Collection(b => b.Posts).LoadAsync();

            Console.WriteLine($"Blog: {blog.Title}");
            foreach (var post in blog.Posts)
            {
                Console.WriteLine($"  Post: {post.Title}");
            }
        }
    }
}
```

---

可以使用 `Query()` 方法来在显式加载时进行过滤或排序：

```C#
public async Task GetBlogAndSpecificPosts(int blogId)
{
    using (var context = new MyDbContext())
    {
        var blog = await context.Blogs.FirstOrDefaultAsync(b => b.Id == blogId);

        if (blog != null)
        {
            // 显式加载 Blog 的所有 Post，但只包含标题中含有 "EF" 的
            await context.Entry(blog)
                .Collection(b => b.Posts)
                .Query() // 返回一个 IQueryable<Post>
                .Where(p => p.Title.Contains("EF"))
                .LoadAsync();

            // 此时 blog.Posts 集合中只会包含标题中含有 "EF" 的 Post
        }
    }
}
```

#### 延迟加载

延迟加载是指当你**第一次访问导航属性时，EF Core 会自动从数据库加载相关数据**。它提供了一种“按需加载”的便利性，但如果不小心使用，可能会导致严重的性能问题（N+1 查询问题）。

- **使用场景**：在开发初期为了快速原型开发，或者在非常明确知道某个导航属性只在极少数情况下被访问时。
- **优点**：简化代码，无需手动 `Include` 或 `Load`。
- **缺点**：**最容易导致 N+1 查询问题**，每次访问未加载的导航属性都会触发一次新的数据库查询。可能导致性能瓶颈和过多的数据库往返。
- **实现方式**：需要安装 `Microsoft.EntityFrameworkCore.Proxies` NuGet 包，并在 `DbContext` 配置中启用代理，并且导航属性必须是 `virtual`。

**使用方式：**

1. **安装 NuGet 包**：`Microsoft.EntityFrameworkCore.Proxies`
2. **配置 `DbContext`**：

```C#
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    optionsBuilder.UseSqlServer("YourConnectionString")
        .UseLazyLoadingProxies(); // 启用延迟加载代理
}
```

3. **导航属性标记为`virtual`**

```C#
public class Blog
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public virtual ICollection<Post> Posts { get; set; } = new List<Post>(); // 必须是 virtual
}

public class Post
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int BlogId { get; set; }
    public virtual Blog Blog { get; set; } = null!; // 必须是 virtual
}
```

示例：延迟加载

```C#
public async Task GetBlogsWithLazyLoadedPosts()
{
    using (var context = new MyDbContext())
    {
        // 第一次查询：只加载 Blog 实体，不加载 Post
        var blogs = await context.Blogs.ToListAsync();

        Console.WriteLine("Lazy-Loaded Blogs:");
        foreach (var blog in blogs)
        {
            Console.WriteLine($"Blog: {blog.Title}");
            // **第一次访问 blog.Posts 时，会触发一个新的数据库查询来加载这些 Post**
            foreach (var post in blog.Posts) // 这里会触发数据库查询
            {
                Console.WriteLine($"  Post: {post.Title}");
            }
        }
    }
}
```

> 性能陷阱：如果 `blogs` 集合中有 N 个 `Blog`，那么上面的代码会产生 N+1 次数据库查询（1 次加载所有 Blog + N 次每次访问 `blog.Posts` 触发的查询）。这在处理大量数据时是灾难性的。

### 拆分查询

#### 定义

当你使用 **预先加载 (`.Include()` 和 `.ThenInclude()`)** 来加载相关数据时，EF Core 默认会生成一个**单一的 SQL 查询**。这个查询通常使用 `JOIN` 语句来将主实体和所有相关实体的数据连接起来。这被称为 **“单查询 (Single Query)”** 模式。

然而，当你的查询涉及到**多个 `Include()` 调用**，或者相关的集合数据量非常大时，这种单一查询可能会变得：

- **非常复杂**：导致生成的 SQL 语句冗长且难以阅读。
- **性能低下**：由于 `JOIN` 操作的性质，结果集中会包含大量的重复数据。例如，一个 `Blog` 有 100 篇 `Post`，加载 `Blog` 和 `Post` 会导致 `Blog` 的信息重复 100 次。这种数据膨胀会增加网络传输和内存处理的负担。

**拆分查询 (Split Queries)** 允许 EF Core 将一个复杂的预先加载查询**拆分成多个独立的 SQL 查询**。每个查询负责加载一部分实体及其相关数据，然后 EF Core 会在内存中将这些查询结果**合并**起来，构建完整的对象图。

| 特性 / 场景 | 单查询 (Single Query)                                 | 拆分查询 (Split Query)                           |
| ----------- | ----------------------------------------------------- | ------------------------------------------------ |
| 查询复杂性  | 复杂 JOIN 链，可能导致 SQL 语句庞大复杂               | 生成多个简单查询，每个查询相对独立               |
| 数据冗余    | 结果集中数据冗余高，尤其在多级 Include 时             | 显著减少数据冗余，降低网络传输和内存消耗         |
| 数据库往返  | 只需要一次数据库往返                                  | 增加数据库往返次数                               |
| 数据一致性  | 强一致性，所有数据在单个事务中获取                    | 如果不使用事务，可能存在数据不一致性风险         |
| 性能瓶颈    | CPU 密集型 (数据库和客户端处理重复数据)；网络带宽限制 | 网络延迟敏感型 (多次往返)                        |
| 适用场景    | 相关数据量较小；对数据一致性要求极高；网络延迟高      | 相关数据量大；数据冗余是主要性能瓶颈；网络延迟低 |
| 默认行为    | EF Core 的默认行为                                    | EF Core 5.0+ 可选                                |

#### 解决的问题

拆分查询主要为了解决单查询模式在特定场景下的**性能问题和数据膨胀问题**。

**单查询 (Single Query) 的问题：**

考虑以下查询，它加载 `Blogs` 及其 `Posts` 和每个 `Post` 的 `Tags`：

```C#
var blogs = await context.Blogs
    .Include(b => b.Posts)
        .ThenInclude(p => p.Tags)
    .ToListAsync();
```

如果一个 `Blog` 有 N 篇 `Post`，每篇 `Post` 有 M 个 `Tag`：

**SQL `JOIN` 结果集**：生成的 SQL 会像这样：

```SQL
SELECT b.*, p.*, t.*
FROM Blogs AS b
LEFT JOIN Posts AS p ON b.Id = p.BlogId
LEFT JOIN PostTags AS pt ON p.Id = pt.PostId
LEFT JOIN Tags AS t ON pt.TagId = t.Id
```

这个查询返回的行数将是 `SUM(N * M)`。每一行都会重复 `Blog` 和 `Post` 的数据。如果 `N` 和 `M` 都很大，结果集会非常庞大，导致：

- **数据库服务器压力**：需要处理更多的数据。
- **网络传输开销**：传输大量重复数据到应用程序。
- **内存消耗**：应用程序需要更多内存来接收和处理这些数据。

通过将上述查询拆分为多个查询，可以显著减少数据重复：

- 查询1：加载`Blogs`

```SQL
SELECT b.* FROM Blogs AS b
```

- 查询2：加载`Posts`,过滤出与查询1结果相关的`Posts`

```SQL
SELECT p.* FROM Posts AS p WHERE p.BlogId IN (<ids from query 1>)
```

- 查询3：加载`Tags`,过滤出与查询2结果相关的`Tags`

```SQL
SELECT t.* FROM Tags AS t JOIN PostTags AS pt ON t.Id = pt.TagId WHERE pt.PostId IN (<ids from query 2>)
```

在应用程序内存中，EF Core 会根据主键/外键关系将这三个查询的结果**智能地组合**起来，形成完整的对象图。

**优缺点**

**优点**：

- **减少数据冗余**：显著减少通过网络传输的数据量和客户端内存中重复数据的量。
- **提高性能**：在处理大量相关数据时，通常比单查询更高效。
- **更简单的 SQL**：生成的每个独立查询都比一个巨大的 `JOIN` 链更简单，有利于数据库优化器。

**缺点**：

- **增加数据库往返次数**：需要执行多个查询，而不是一个。这在网络延迟较高的情况下可能成为性能瓶颈。
- **结果一致性问题**：如果多个查询之间数据库发生变化，可能会导致获取到不一致的数据快照（例如，第一个查询执行后，第二个查询执行前，数据被修改了）。在事务中执行可以缓解此问题，但会增加事务开销。

#### 使用方式

##### 针对单个查询启用`.AsSplitQuery()`

可以在任何 LINQ 查询上使用 `.AsSplitQuery()` 扩展方法来将其转换为拆分查询。

```CS
using Microsoft.EntityFrameworkCore;

public class Blog
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public ICollection<Post> Posts { get; set; } = new List<Post>();
}

public class Post
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int BlogId { get; set; }
    public Blog Blog { get; set; } = null!;
    public ICollection<Tag> Tags { get; set; } = new List<Tag>(); // 多对多关系简化
}

public class Tag
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public ICollection<Post> Posts { get; set; } = new List<Post>();
}

public class MyDbContext : DbContext
{
    public DbSet<Blog> Blogs { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<Tag> Tags { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // 配置多对多关系 (简化，实际需要连接表)
        modelBuilder.Entity<Post>()
            .HasMany(p => p.Tags)
            .WithMany(t => t.Posts)
            .UsingEntity(j => j.ToTable("PostTags"));
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("YourConnectionString");
    }
}

public async Task GetBlogsWithPostsAndTags_SplitQuery()
{
    using (var context = new MyDbContext())
    {
        var blogs = await context.Blogs
            .Include(b => b.Posts)
                .ThenInclude(p => p.Tags)
            .AsSplitQuery() // 在这里启用拆分查询
            .ToListAsync();

        foreach (var blog in blogs)
        {
            Console.WriteLine($"Blog: {blog.Title}");
            foreach (var post in blog.Posts)
            {
                Console.WriteLine($"  Post: {post.Title}");
                foreach (var tag in post.Tags)
                {
                    Console.WriteLine($"    Tag: {tag.Name}");
                }
            }
        }
    }
}
```

##### 全局启用拆分查询（默认行为）

通过 `DbContextOptionsBuilder` 配置，将所有涉及多个 `Include()` 的查询**默认**设置为拆分查询。

```CS
using Microsoft.EntityFrameworkCore;

public class MyDbContext : DbContext
{
    // ... DbSet 和 OnModelCreating 配置 ...

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("YourConnectionString")
            // 默认情况下，将所有具有多个 Include() 的查询拆分
            .UseQueryTrackingBehavior(QueryTrackingBehavior.TrackAll) // 保持默认跟踪行为
            .UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery); // 设置默认查询拆分行为
    }
}
```

**`UseQuerySplittingBehavior` 参数：**

- **`QuerySplittingBehavior.SingleQuery` (默认)**：所有相关数据都在一个查询中加载（传统的 `JOIN` 方式）。
- **`QuerySplittingBehavior.SplitQuery`**：所有相关数据都被拆分成多个查询。

**优先级**：如果在 `DbContext` 级别设置了全局行为，并且在单个查询上使用了 `.AsSingleQuery()` 或 `.AsSplitQuery()`，那么**单个查询上的方法具有更高的优先级**。例如，如果全局设置为 `SplitQuery`，但你在某个查询上使用了 `.AsSingleQuery()`，那么该查询将作为单个查询执行。

### 复杂查询运算符

| 类别     | 运算符                                             |
| -------- | -------------------------------------------------- |
| 聚合     | `GroupBy`、`Sum`、`Count`、`Average`、`Min`、`Max` |
| 集合运算 | `Union`、`Intersect`、`Except`、`Distinct`         |
| 连接     | `Join`、`GroupJoin`                                |
| 多表展平 | `SelectMany`                                       |
| 子查询   | `Any`、`All`、`Contains`、`First/Single` in LINQ   |
| 分页     | `Skip`、`Take`                                     |
| 判断     | `DefaultIfEmpty()`（左外连接）                     |
| 条件     | `Where()` 中嵌套表达式                             |

#### 聚合

聚合运算符用于对数据集合执行计算，并返回一个单一的值。

- **`Count()` / `LongCount()`**: 计算序列中的元素数量。
- **`Sum()`**: 计算序列中数值的总和。
- **`Min()`**: 获取序列中的最小值。
- **`Max()`**: 获取序列中的最大值。
- **`Average()`**: 计算序列中数值的平均值。

```CS
using Microsoft.EntityFrameworkCore;
using System.Linq; // 确保引用此命名空间

public async Task PerformAggregations()
{
    using (var context = new MyDbContext())
    {
        // 统计产品总数
        var productCount = await context.Products.CountAsync();
        Console.WriteLine($"Total Products: {productCount}");

        // 计算所有产品的总价格
        var totalProductPrice = await context.Products.SumAsync(p => p.Price);
        Console.WriteLine($"Total Product Price: {totalProductPrice:C}");

        // 获取最贵产品的价格
        var maxPrice = await context.Products.MaxAsync(p => p.Price);
        Console.WriteLine($"Max Product Price: {maxPrice:C}");

        // 获取最便宜产品的价格
        var minPrice = await context.Products.MinAsync(p => p.Price);
        Console.WriteLine($"Min Product Price: {minPrice:C}");

        // 计算产品平均价格
        var averagePrice = await context.Products.AverageAsync(p => p.Price);
        Console.WriteLine($"Average Product Price: {averagePrice:C}");
    }
}
```

这些聚合操作通常会被翻译成 SQL 中的 `COUNT()`, `SUM()`, `MIN()`, `MAX()`, `AVG()` 函数。

#### 分组

**`GroupBy()`**: 将序列中的元素按照一个或多个键进行分组。这在 SQL 中对应 `GROUP BY` 子句。

示例：按类别分组产品

```CS
public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public ICollection<Product> Products { get; set; } = new List<Product>();
}

// Product 类中添加 CategoryId 和 Category 导航属性
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
}

public async Task GroupProductsByCategory()
{
    using (var context = new MyDbContext())
    {
        // 按产品类别名称分组，并计算每个类别的产品数量和平均价格
        var categorySummaries = await context.Products
            .GroupBy(p => p.Category.Name) // 按 Category Name 分组
            .Select(g => new
            {
                CategoryName = g.Key,
                ProductCount = g.Count(),
                AveragePrice = g.Average(p => p.Price)
            })
            .ToListAsync();

        Console.WriteLine("Product Summaries by Category:");
        foreach (var summary in categorySummaries)
        {
            Console.WriteLine($"- Category: {summary.CategoryName}, Products: {summary.ProductCount}, Avg Price: {summary.AveragePrice:C}");
        }
    }
}
```

#### 连接

连接运算符用于将来自不同数据源的元素组合起来，基于它们之间的匹配键。

- **`Join()`**: 执行内部连接 (Inner Join)。
- **`GroupJoin()`**: 执行分组连接 (Group Join)，类似左连接，但结果是外部集合和匹配内部集合的组。
- **隐式连接**：在 LINQ to Entities 中，通过**导航属性**访问相关实体通常会自动转换为数据库 `JOIN`，这是最常见和推荐的连接方式。

示例：使用导航属性进行隐式连接 (推荐)

这是最常用和直观的连接方式，EF Core 会自动将其翻译为 `JOIN`。

```CS
public async Task GetProductsWithCategoryNames()
{
    using (var context = new MyDbContext())
    {
        // 隐式连接：通过导航属性 Product.Category 访问 Category.Name
        var productsWithCategories = await context.Products
            .Select(p => new
            {
                ProductName = p.Name,
                CategoryName = p.Category.Name // 直接访问导航属性
            })
            .ToListAsync();

        foreach (var item in productsWithCategories)
        {
            Console.WriteLine($"Product: {item.ProductName}, Category: {item.CategoryName}");
        }
    }
}
```

示例：使用`Join()`(显示内部连接)

```CS
public async Task JoinProductsAndCategoriesExplicitly()
{
    using (var context = new MyDbContext())
    {
        var productsAndCategories = await context.Products
            .Join(
                context.Categories, // 要连接的第二个集合
                product => product.CategoryId, // Products 集合的连接键
                category => category.Id,       // Categories 集合的连接键
                (product, category) => new // 结果选择器
                {
                    ProductName = product.Name,
                    CategoryName = category.Name
                }
            )
            .ToListAsync();

        foreach (var item in productsAndCategories)
        {
            Console.WriteLine($"Product: {item.ProductName}, Category: {item.CategoryName}");
        }
    }
}
```

`Join()` 显式连接在某些复杂场景下很有用，但在能够使用导航属性的情况下，通常推荐使用导航属性的隐式连接，因为它更简洁且易于维护。

#### 集合

集合运算符用于组合或比较两个序列。

- **`Concat()`**: 将两个序列连接起来（保留所有重复项）。
- **`Union()`**: 返回两个序列的并集（去除重复项）。
- **`Intersect()`**: 返回两个序列的交集（只包含在两个序列中都存在的元素）。
- **`Except()`**: 返回在第一个序列中存在但不在第二个序列中存在的元素。

```CS
public async Task PerformSetOperations()
{
    using (var context = new MyDbContext())
    {
        var productsUnder50 = context.Products.Where(p => p.Price < 50);
        var productsOver70 = context.Products.Where(p => p.Price > 70);
        var productsInTechCategory = context.Products.Where(p => p.Category.Name == "Electronics");

        Console.WriteLine("\nSet Operations:");

        // Concat: 合并两个结果集，保留所有元素，包括重复
        var allCheapAndExpensiveProducts = await productsUnder50.Concat(productsOver70).ToListAsync();
        Console.WriteLine($"Concat Count: {allCheapAndExpensiveProducts.Count}");

        // Union: 合并两个结果集，去除重复项
        var unionProducts = await productsUnder50.Union(productsInTechCategory).ToListAsync();
        Console.WriteLine($"Union Count (Price < 50 OR Category = Electronics): {unionProducts.Count}");

        // Intersect: 获取同时在两个结果集中的元素
        var cheapElectronics = await productsUnder50.Intersect(productsInTechCategory).ToListAsync();
        Console.WriteLine($"Intersect Count (Price < 50 AND Category = Electronics): {cheapElectronics.Count}");

        // Except: 获取在第一个结果集但不在第二个结果集中的元素
        var cheapButNotElectronics = await productsUnder50.Except(productsInTechCategory).ToListAsync();
        Console.WriteLine($"Except Count (Price < 50 AND NOT Category = Electronics): {cheapButNotElectronics.Count}");
    }
}
```

这些操作会被翻译成 SQL 中的 `UNION ALL`, `UNION`, `INTERSECT`, `EXCEPT` (或 `NOT IN` 子查询)。

#### 分页

分页用于从结果集中获取特定范围的元素。

- **`Skip()`**: 跳过指定数量的元素。
- **`Take()`**: 获取指定数量的元素。

```CS
public async Task GetPagedProducts(int pageNumber, int pageSize)
{
    using (var context = new MyDbContext())
    {
        // 获取指定页码的产品列表，并按名称排序
        var pagedProducts = await context.Products
            .OrderBy(p => p.Name)
            .Skip((pageNumber - 1) * pageSize) // 计算要跳过的数量
            .Take(pageSize)                     // 获取指定数量
            .ToListAsync();

        Console.WriteLine($"\nPage {pageNumber} of Products (Page Size: {pageSize}):");
        foreach (var product in pagedProducts)
        {
            Console.WriteLine($"- {product.Name} ({product.Price:C})");
        }
    }
}
```

#### 其他

- **`All()`**: 检查序列中的所有元素是否都满足某个条件。
- **`Any()`**: 检查序列中是否有任何元素满足某个条件。
- **`Contains()`**: 检查序列是否包含指定元素。
- **`FirstOrDefault()` / `SingleOrDefault()`**: 获取序列的第一个/唯一元素，如果不存在则返回默认值。
- **`GroupBy()` 的两次使用**：第一次分组，第二次聚合。
- **投影 `Select()`**：创建匿名对象或自定义 DTO (Data Transfer Objects) 来只查询所需的数据，而不是整个实体。这可以显著提升性能。

示例：Any()和All()

```CS
public async Task CheckProductExistenceAndConditions()
{
    using (var context = new MyDbContext())
    {
        // 检查是否有任何产品价格低于 10
        var anyCheapProducts = await context.Products.AnyAsync(p => p.Price < 10);
        Console.WriteLine($"Any products cheaper than $10: {anyCheapProducts}");

        // 检查所有产品价格是否都高于 1
        var allExpensiveProducts = await context.Products.AllAsync(p => p.Price > 1);
        Console.WriteLine($"All products more expensive than $1: {allExpensiveProducts}");
    }
}
```

### SQL查询

尽管 EF Core 提供了强大的 LINQ 查询能力，将 C# 代码翻译成 SQL 语句，但在某些情况下，你可能需要**直接编写和执行原始 SQL 查询**。这在处理特别复杂的、性能敏感的、或者 EF Core 尚不支持的数据库特定功能时尤为有用。

#### 原始SQL使用方法

##### 查询实体(`FromSqlRaw()`和`FromSqlInterpolated`)

这两个方法允许你直接编写 SQL 查询，并将结果映射到 EF Core 跟踪的实体类型。它们是 `DbSet<TEntity>` 上的扩展方法。

`FromSqlRaw()`：使用参数占位符

- **特点**：接受一个字符串形式的 SQL 查询和可选的参数数组。参数使用数据库特定的占位符（例如 SQL Server 的 `{0}`，PostgreSQL 的 `$0`，SQLite 的 `?`）。
- **优点**：可以明确控制 SQL 字符串，适用于动态构建 SQL 的场景（但要注意 SQL 注入风险）。
- **缺点**：需要手动处理参数化，不当使用可能导致 SQL 注入。

```CS
using Microsoft.EntityFrameworkCore;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
}

public class MyDbContext : DbContext
{
    public DbSet<Product> Products { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("YourConnectionString");
    }
}

public async Task GetProductsFromRawSql(string searchTerm)
{
    using (var context = new MyDbContext())
    {
        // SQL Server 参数占位符为 {0}, {1}, ...
        // SQLite 和 MySQL 是 ?
        // PostgreSQL 是 $0, $1, ...
        var products = await context.Products
            .FromSqlRaw("SELECT Id, Name, Price FROM Products WHERE Name LIKE {0}", $"%{searchTerm}%")
            .ToListAsync();

        Console.WriteLine($"Products matching '{searchTerm}':");
        foreach (var product in products)
        {
            Console.WriteLine($"- {product.Name} (Price: {product.Price:C})");
        }
    }
}
```

`FromSqlInterpolated()`：使用 C# 字符串插值

- **特点**：接受一个使用 C# 字符串插值语法的 SQL 查询。EF Core 会自动将插值参数转换为安全的数据库参数，从而**有效防止 SQL 注入攻击**。
- **优点**：更简洁、安全，且易于阅读。**推荐使用此方法**。
- **缺点**：不能直接使用非参数化的 SQL 字符串。

```CS
public async Task GetProductsFromInterpolatedSql(string searchTerm)
{
    using (var context = new MyDbContext())
    {
        // 自动将 searchTerm 转换为安全的数据库参数
        var products = await context.Products
            .FromSqlInterpolated($"SELECT Id, Name, Price FROM Products WHERE Name LIKE {"%" + searchTerm + "%"}")
            .ToListAsync();

        // 与 FromSqlRaw() 类似的结果
        Console.WriteLine($"Products matching '{searchTerm}' (Interpolated):");
        foreach (var product in products)
        {
            Console.WriteLine($"- {product.Name} (Price: {product.Price:C})");
        }
    }
}
```

使用 `FromSqlRaw()` / `FromSqlInterpolated()` 的重要限制和考虑：

- **SQL 必须与实体形状匹配**：查询返回的列名和数据类型必须与 EF Core 映射的实体类型（`TEntity`）的属性完全匹配，或者可以隐式转换。
- **查询必须是可组合的**：`FromSqlRaw()` 和 `FromSqlInterpolated()` 返回的是 `IQueryable<TEntity>`，这意味着你可以在其后追加 LINQ 查询运算符（如 `Where()`, `OrderBy()`, `Include()` 等）。EF Core 会尝试将这些 LINQ 操作组合到原始 SQL 语句中（通常作为子查询或 CTE）。

```CS
var products = await context.Products
    .FromSqlInterpolated($"SELECT Id, Name, Price FROM Products")
    .Where(p => p.Price > 50) // 这个 Where 会被添加到 SQL 中
    .OrderBy(p => p.Name)     // OrderBy 也会被添加到 SQL 中
    .ToListAsync();
```

- **限制**：不是所有原始 SQL 都可以被后续 LINQ 操作组合。例如，如果原始 SQL 查询涉及复杂的联接或聚合，后续的 LINQ 操作可能无法正确翻译或导致效率低下。通常，使用 `FromSql...` 仅用于**提供基础的 SELECT 语句**。
- **跟踪行为**：默认情况下，`FromSqlRaw()` 和 `FromSqlInterpolated()` 返回的实体是**被跟踪的**，你可以像普通查询一样修改它们并保存更改。如果不需要跟踪，可以使用 `.AsNoTracking()`。

##### 不返回实体的任意SQL(`ExecuteSqlRaw()` 和 `ExecuteSqlInterpolated()`)

这些方法在 `Database` 属性上提供，用于执行不返回结果集（例如 `INSERT`, `UPDATE`, `DELETE`）或返回单个标量值的 SQL 命令。它们返回受影响的行数。

`ExecuteSqlRaw()`：使用参数占位符

```CS
public async Task UpdateProductNameRaw(int productId, string newName)
{
    using (var context = new MyDbContext())
    {
        var affectedRows = await context.Database.ExecuteSqlRawAsync(
            "UPDATE Products SET Name = {0} WHERE Id = {1}",
            newName, productId
        );
        Console.WriteLine($"{affectedRows} row(s) updated using raw SQL.");
    }
}
```

`ExecuteSqlInterpolated()`：使用 C# 字符串插值

```CS
public async Task UpdateProductNameInterpolated(int productId, string newName)
{
    using (var context = new MyDbContext())
    {
        var affectedRows = await context.Database.ExecuteSqlInterpolatedAsync(
            $"UPDATE Products SET Name = {newName} WHERE Id = {productId}"
        );
        Console.WriteLine($"{affectedRows} row(s) updated using interpolated SQL.");
    }
}
```

使用 `ExecuteSqlRaw()` / `ExecuteSqlInterpolated()` 的特点：

- **事务**：这些命令不会自动启动事务。如果你需要它们在事务中执行，你需要手动创建和管理事务（例如 `context.Database.BeginTransactionAsync()`）。
- **不影响变更跟踪器**：这些操作直接作用于数据库，不会更新 `DbContext` 的变更跟踪器。如果你在执行 `UPDATE` 或 `DELETE` 后还想继续使用被跟踪的实体，可能需要重新加载它们以确保数据一致性。
- **返回受影响的行数**：方法的返回值是执行 SQL 命令所影响的行数。

#### 从原始SQL中获取标量结果或无键实体

##### 获取标量结果 (`DbConnection.ExecuteScalarAsync()`)

如果你只需要从 SQL 查询中获取单个值（例如 `COUNT(*)`，`MAX(Price)`），你可以直接访问底层的 `DbConnection`。

```CS
using System.Data.Common; // For DbConnection

public async Task GetScalarValueFromSql()
{
    using (var context = new MyDbContext())
    {
        var connection = context.Database.GetDbConnection();
        await connection.OpenAsync(); // 确保连接已打开

        using (var command = connection.CreateCommand())
        {
            command.CommandText = "SELECT COUNT(*) FROM Products;";
            var count = (int?)(await command.ExecuteScalarAsync());
            Console.WriteLine($"Total products count from scalar query: {count}");
        }
    }
}
```

##### 查询无键实体

如果你的 SQL 查询返回的数据结构不对应你的任何主键实体，或者你希望查询一个数据库视图，你可以定义一个**无键实体类型**。

1. 定义无键实体类

```CS
public class ProductSummary
{
    public string CategoryName { get; set; } = string.Empty;
    public int ProductCount { get; set; }
    public decimal AveragePrice { get; set; }
}
```

2. 在 `DbContext` 中配置为无键实体

```CS
public class MyDbContext : DbContext
{
    public DbSet<ProductSummary> ProductSummaries { get; set; } = null!; // 定义为 DbSet

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // 配置 ProductSummary 为无键实体
        modelBuilder.Entity<ProductSummary>().HasNoKey();

        // 如果 ProductSummary 对应数据库视图，也可以这样映射：
        // modelBuilder.Entity<ProductSummary>().HasNoKey().ToView("V_ProductSummary");
    }
}
```

3. 使用 `FromSqlRaw()` / `FromSqlInterpolated()` 查询

```CS
public async Task GetProductSummariesFromSql()
{
    using (var context = new MyDbContext())
    {
        var summaries = await context.ProductSummaries
            .FromSqlRaw(@"
                SELECT c.Name AS CategoryName, COUNT(p.Id) AS ProductCount, AVG(p.Price) AS AveragePrice
                FROM Products AS p
                JOIN Categories AS c ON p.CategoryId = c.Id
                GROUP BY c.Name
            ")
            .ToListAsync();

        Console.WriteLine("\nProduct Summaries from Raw SQL:");
        foreach (var summary in summaries)
        {
            Console.WriteLine($"- Category: {summary.CategoryName}, Products: {summary.ProductCount}, Avg Price: {summary.AveragePrice:C}");
        }
    }
}
```

> 无键实体不能被修改或保存。它们是只读的。

### 查询标记

查询标记是通过 LINQ 查询的 `.TagWith()` 扩展方法添加的任意字符串。当 EF Core 将这个 LINQ 查询翻译成 SQL 时，它会把这个标记作为 **SQL 注释**嵌入到生成的 SQL 语句的**开头**。

#### 使用方法

在任何 `IQueryable` 后面链式调用 `.TagWith()` 方法即可。

示例：假设有一个获取用户订单的查询

```C#
using Microsoft.EntityFrameworkCore;
using System.Linq; // 确保引用此命名空间

public class Order
{
    public int Id { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public int CustomerId { get; set; }
    // ... 其他属性
}

public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}

public class MyDbContext : DbContext
{
    public DbSet<Order> Orders { get; set; }
    public DbSet<Customer> Customers { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("YourConnectionString")
            // 启用敏感数据日志，以便在控制台看到参数值
            .EnableSensitiveDataLogging();
            // 如果你想看更详细的 SQL，可以启用以下选项：
            // .LogTo(Console.WriteLine, new[] { DbLoggerCategory.Database.Command.Name }, LogLevel.Information);
    }
}

public async Task GetCustomerOrdersWithTag(int customerId)
{
    using (var context = new MyDbContext())
    {
        var customerOrders = await context.Orders
            .Where(o => o.CustomerId == customerId)
            .OrderByDescending(o => o.OrderDate)
            .TagWith("GetCustomerOrdersByCustomerId") // 添加查询标记
            .ToListAsync();

        Console.WriteLine($"\nOrders for Customer {customerId}:");
        foreach (var order in customerOrders)
        {
            Console.WriteLine($"- Order {order.Id} on {order.OrderDate.ToShortDateString()}, Total: {order.TotalAmount:C}");
        }
    }
}
```

生成的SQL示例：

当你运行上述代码并捕获 EF Core 生成的 SQL 时，你会在 SQL 语句的顶部看到类似这样的注释：

```SQL
-- GetCustomerOrdersByCustomerId
SELECT [o].[Id], [o].[OrderDate], [o].[TotalAmount], [o].[CustomerId]
FROM [Orders] AS [o]
WHERE [o].[CustomerId] = @__customerId_0
ORDER BY [o].[OrderDate] DESC;
```

**链式调用多个标记**

可以链式调用多个 `TagWith()` 方法。EF Core 会将它们连接起来，通常用换行符分隔。

```C#
var customerOrders = await context.Orders
    .Where(o => o.CustomerId == customerId)
    .TagWith("Query for Customer Orders")
    .TagWith("Called from OrderService.GetCustomerOrdersAsync")
    .ToListAsync();
```

生成的SQL

```SQL
-- Query for Customer Orders
-- Called from OrderService.GetCustomerOrdersAsync
SELECT [o].[Id], [o].[OrderDate], [o].[TotalAmount], [o].[CustomerId]
FROM [Orders] AS [o]
WHERE [o].[CustomerId] = @__customerId_0
ORDER BY [o].[OrderDate] DESC;
```

### NULL值的比较

在 SQL 中：

- `NULL != NULL`（`NULL` 被认为是未知，不等于任何值）
- `NULL = NULL` 会返回 `false`
- 所以：你不能用 `=` 或 `!=` 来比较两个 NULL 是否相等，必须用 `IS NULL` / `IS NOT NULL`

EF Core 会自动将 LINQ 中的 null 比较翻译为 SQL 的 `IS NULL` / `IS NOT NULL`，但**在某些特殊表达式中仍需注意写法**。

#### 基本NULL判断

示例1：字段等于NULL

```C#
var users = dbContext.Users
    .Where(u => u.Nickname == null)
    .ToList();
```

生成sql：

```SQL
SELECT * FROM Users WHERE Nickname IS NULL
```

---

示例2：字段不等于NULL

```C#
var users = dbContext.Users
    .Where(u => u.Nickname != null)
    .ToList();
```

```SQL
SELECT * FROM Users WHERE Nickname IS NOT NULL
```

EF Core 会**自动将这些 null 比较转换为 SQL 的 `IS NULL` / `IS NOT NULL`**

#### 比较2个可能为NULL的字段

比如你想找出两个字段相等的记录：

```C#
var orders = dbContext.Orders
    .Where(o => o.ShippingAddress == o.BillingAddress)
    .ToList();
```

问题：

- 如果两个字段都为 null，上面这句在 C# 中会返回 `true`
- 但在 SQL 中，`NULL = NULL` 会返回 `false`
- 结果会 **漏掉两个字段都为 null 的行**

正确写法：

```C#
var orders = dbContext.Orders
    .Where(o =>
        o.ShippingAddress == o.BillingAddress ||
        (o.ShippingAddress == null && o.BillingAddress == null)
    )
    .ToList();
```

这样才等价于 “值相等 或者 两个都是 NULL”。

#### `object.Equals()`

> [!TIP]
>
> 推荐使用 `object.Equals(a, b)` 来比较可能包含 null 的字段。

使用 `Equals()` 方法，EF Core 会将其翻译为 SQL 中正确的逻辑，包括 NULL 判断

```C#
var orders = dbContext.Orders
    .Where(o => object.Equals(o.ShippingAddress, o.BillingAddress))
    .ToList();
```

EF Core会将其转为：

```SQL
WHERE (ShippingAddress = BillingAddress)
   OR (ShippingAddress IS NULL AND BillingAddress IS NULL)
```

#### 使用`??`和`GetValueOrDefault()`处理空值

```C#
.Where(u => (u.Age ?? 0) > 18)
```

```C#
.Where(u => u.IsActive.GetValueOrDefault())
```

这类空值处理逻辑在 C# 中很好用，EF Core 也能翻译成 SQL 中的 `ISNULL()`、`COALESCE()` 等语法

#### 总结

| 操作                         | 推荐方式                | SQL 等价                             |
| ---------------------------- | ----------------------- | ------------------------------------ |
| 判断某字段是否为 null        | `x == null`             | `IS NULL`                            |
| 判断某字段不为 null          | `x != null`             | `IS NOT NULL`                        |
| 比较两个字段可能为 null 的值 | `object.Equals(x, y)`   | `x = y OR (x IS NULL AND y IS NULL)` |
| 空值处理                     | `x ?? 替代值`           | `ISNULL(x, 替代值)`                  |
| 布尔类型 null 安全访问       | `x.GetValueOrDefault()` | `ISNULL(x, 0)`                       |

## 保存数据



## 更改跟踪

在 EF Core 中，`DbContext` 内部有一个名为**更改跟踪器 (Change Tracker)** 的机制。这个跟踪器的工作就是监控你加载的实体实例以及你添加到 `DbContext` 中的新实体实例。

- 当实体被加载到内存中时，更改跟踪器会存储这些实体的**原始值**。
- 当你修改这些实体实例的属性时，更改跟踪器会检测到这些变化。
- 当你调用 `SaveChanges()` 时，更改跟踪器会比较当前实体的值与其原始值，找出所有已更改、已添加或已删除的实体，然后生成并执行相应的 `UPDATE`、`INSERT` 或 `DELETE` SQL 语句。

#### 实体状态

在更改跟踪器中，每个被跟踪的实体都有一个特定的**状态 (EntityState)**

`Microsoft.EntityFrameworkCore.EntityState` 枚举定义了以下几种状态：

- **`Detached` (分离)**：
  - 实体实例存在于内存中，但**不被任何 `DbContext` 实例跟踪**。
  - 这是实体实例的初始状态，例如，当你使用 `new` 关键字创建一个实体时。
  - `DbContext` 不知道它的存在，也不会对其进行任何操作。
- **`Unchanged` (未更改)**：
  - 实体被 `DbContext` 实例**跟踪**，并且它的当前值与数据库中的原始值**相同**。
  - 这通常是实体从数据库加载时的默认状态。
  - 调用 `SaveChanges()` 时，EF Core 不会为此实体生成任何 SQL。
- **`Added` (已添加)**：
  - 实体被 `DbContext` 实例**跟踪**，但它是一个**全新的实体**，尚未存在于数据库中。
  - 当你调用 `DbContext.Add()` 或 `DbSet.Add()` 时，实体会进入此状态。
  - 调用 `SaveChanges()` 时，EF Core 会为此实体生成 `INSERT` SQL 语句。
- **`Modified` (已修改)**：
  - 实体被 `DbContext` 实例**跟踪**，并且它的一个或多个属性的当前值与从数据库加载时的**原始值不同**。
  - 当你修改一个 `Unchanged` 状态的实体属性时，EF Core 会自动将其状态变为 `Modified`。
  - 调用 `SaveChanges()` 时，EF Core 会为此实体生成 `UPDATE` SQL 语句。
- **`Deleted` (已删除)**：
  - 实体被 `DbContext` 实例**跟踪**，并且已被标记为从数据库中**删除**。
  - 当你调用 `DbContext.Remove()` 或 `DbSet.Remove()` 时，实体会进入此状态。
  - 调用 `SaveChanges()` 时，EF Core 会为此实体生成 `DELETE` SQL 语句。

## 日志记录、事件和诊断









