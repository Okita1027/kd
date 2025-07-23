---
title: 创建模型
shortTitle: 创建模型
description: 创建模型
date: 2025-07-12 17:37:33
categories: [.NET, EF CORE]
tags: [.NET]
order: 2
---

## 创建模型

### 概述

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

### 使用方式

#### 默认约定

这是最基础也是最“隐式”的方式。当你什么都不做时，EF Core 会根据一组**默认约定**来推断你的 C# 类和属性的映射关系。

- **约定是如何工作的？** EF Core 会扫描你的 `DbContext` 中的 `DbSet<TEntity>` 属性。对于每个 `TEntity`，它会假设：
  - `TEntity` 类对应一个同名的数据库表（例如，`DbSet<Product>` 对应 `Products` 表）。
  - 类的公共属性对应表的列。
  - 名为 `Id` 或 `<ClassName>Id` 的整数属性会被认为是**主键**。
  - 一个实体类中包含另一个实体类的导航属性（例如 `Order` 类包含 `Customer Customer` 属性），并且有对应的外键属性（例如 `CustomerId`），EF Core 会尝试推断**关系**。
- **优点**：简单、快速，无需额外配置，适合简单的实体映射。
- **缺点**：灵活性有限，对于不符合约定的场景无能为力。

---

#### 数据注解

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

#### Fluent API

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

#### 三者的结合使用

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

EF Core 能够发现没有公共 getter 或 setter 的字段，并将它们映射到数据库列。这在实现**封装**或**值对象**模式时非常有用。

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

#### 主键类型与值生成

主键的类型会影响其值的生成方式。

##### 整数类型

- **整数类型 (`int`, `long`，`short`)**：

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

##### GUID/UUID

定义：数据库可以生成 GUID。例如 SQL Server 的 NEWID() 或 NEWSEQUENTIALID()。

EF Core 配置：

数据注解：`[DatabaseGenerated(DatabaseGeneratedOption.Identity)]` （与整数 Identity 语法相同，但行为不同）。

Fluent API：`builder.Property(b => b.Id).ValueGeneratedOnAdd();`

SQL Server：EF Core 默认会映射 Guid 主键到 uniqueidentifier 类型，并使用 NEWSEQUENTIALID() 作为默认值（如果你不提供值），这比 NEWID() 对聚集索引更友好。如果你希望使用 NEWID()，可能需要显式配置 HasDefaultValueSql("NEWID()")。

##### 字符串、复合主键
非整数类型必须在应用程序中手动生成主键值

##### 值生成模式

| `Never`         | 从不自动生成，必须由代码提供         |
| --------------- | ------------------------------------ |
| `OnAdd`         | 插入时自动生成（如 Identity、NEWID） |
| `OnUpdate`      | 更新时自动生成（如 LastModified）    |
| `OnAddOrUpdate` | 插入或更新时都自动生成               |

##### 序列

**序列**是一个独立的数据库对象，它被设计用来生成一系列唯一的数字值。它独立于任何特定的表，这意味着多个表或多个应用程序实例可以共用同一个序列来生成主键或任何其他需要唯一数字的列值。

| 数据库       | 是否支持序列 | 说明                     |
| ------------ | ------------ | ------------------------ |
| ✅ SQL Server | 支持         | 有内建的 `SEQUENCE` 对象 |
| ✅ PostgreSQL | 支持         | 使用 `nextval('...')`    |
| ❌ MySQL      | 不支持       | 没有原生 `SEQUENCE` 对象 |
| ✅ Oracle     | 支持         | 有 `SEQUENCE` 概念       |

#### 替代键

除了主键之外，你还可以定义**替代键 (Alternate Keys)**。替代键是一个或一组属性，它们的值也**必须是唯一的**，但它们**不是主键**。在数据库中，替代键通常通过**唯一索引 (Unique Index)** 来实现。

替代键主要用于：

- **强制唯一性**：确保某个列或某些列的组合是唯一的。
- **作为外键的目标**：有时候，外键可能不是指向另一个表的主键，而是指向其替代键。

**配置方式1：Fluent API**

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
**配置方式2：数据注解**
```CS
[Index(nameof(Username), IsUnique = true)]
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

##### 工作原理

1. 当一个实体被从数据库读取时，其并发令牌的值也会被读取。
2. 当尝试更新或删除该实体时，EF Core 会在 WHERE 子句中包含并发令牌的原始值。
3. 如果更新成功，数据库会为并发令牌生成一个新值。
4. 如果并发令牌的原始值与数据库中的当前值不匹配（说明在读取后有其他用户修改了数据），更新或删除操作将失败，并抛出 `DbUpdateConcurrencyException` 异常。应用程序可以捕获此异常并处理冲突。

##### 配置方式

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

> [!tip]
>
> 可以在[C#语法 | 沖田さんの知識ベース](https://kd.zhiyun.space/dotnet/C_/basic.html#索引器)查看相关知识

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

从 EF Core 5.0 开始，不再需要显式定义联结实体类和 `DbSet`。你可以在两个实体类型中各有一个 `ICollection<T>` 导航属性。

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
      [Required] // 可选注解：如果希望 Product 必须有 Category
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

示例：`List<string>`属性的比较

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

#### 执行时机

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

---

**无键实体类型**

**概念**：一种没有定义**主键**的实体类型。EF Core 不会跟踪其变化，也不会执行插入、更新或删除操作。它主要用于**读取数据**。

**使用场景**：

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

从属实体类型允许你**将一个实体类型映射为另一个实体类型（其所有者）的一部分**，而不需要在数据库中为从属实体单独创建一张表。

**核心特征：**

1. **没有自己的主键**：它没有自己的主键属性，其主键由拥有它的实体的主键（或其一部分）构成。
2. **生命周期依赖**：它不能独立存在于数据库中。当拥有它的主体实体被添加、更新或删除时，从属实体的数据也会随之被处理。
3. **不通过 `DbSet` 暴露**：你通常不会为从属实体类型创建 `DbSet<T>` 属性。你通过拥有它的主体实体来访问和操作从属实体的数据。
4. **映射到同一张表或单独的表**：从属实体可以映射到拥有它的主体实体所在的同一张表（默认行为），也可以映射到一张单独的表。

**使用场景：**

- **值对象 (Value Objects)**：当你的领域模型中存在值对象时，这些对象通常没有独立的标识，其相等性基于其属性的值。例如，一个 `Address` 对象，它只作为 `Customer` 的一部分存在，没有独立的 `AddressId`。
- **复杂类型 (Complex Types)**：当你希望将 C# 中的复杂对象作为某个实体的一部分进行持久化，而不想为它创建单独的表关系时。
- **更好的封装和领域驱动设计 (DDD)**：允许你更好地建模聚合，将相关的数据和行为封装在一起，同时保持数据库的规范化或反规范化。

#### 使用场景===============

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

#### 对比有键/从属实体类型

| 特性         | 有键实体类型 (Entity Types)                  | 无键实体类型 (Keyless Entity Types)                  |
| ------------ | -------------------------------------------- | ---------------------------------------------------- |
| 主键         | 必须有主键                                   | 没有主键                                             |
| 读写         | 可读写 (CRUD 操作)                           | 只读 (只能查询)                                      |
| 变更跟踪     | EF Core 会跟踪状态变化                       | EF Core 不跟踪状态变化                               |
| 映射到       | 通常映射到表                                 | 通常映射到视图、函数或没有主键的表                   |
| DbSet        | 必须通过 `DbSet<T>` 暴露                       | 必须通过 `DbSet<T>` 暴露                               |
| Find() 方法  | 支持通过主键查找                             | 不支持                                               |
| 关系中的主体 | 可以作为关系中的主体（被外键引用）           | 不能作为关系中的主体                                 |
| 迁移生成     | EF Core 会在迁移中生成表创建、修改、删除语句 | EF Core 不会在迁移中管理其底层数据库对象 (视图/函数) |

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

