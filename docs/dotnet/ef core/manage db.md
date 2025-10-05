---
title: 管理数据库架构
shortTitle: 管理数据库架构
description: 管理数据库架构
date: 2025-07-15 11:27:33
categories: [.NET, EF CORE]
tags: [.NET]
order: 3
---

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