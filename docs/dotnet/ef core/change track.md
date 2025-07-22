---
title: 更改跟踪
shortTitle: 更改跟踪
description: 更改跟踪
date: 2025-07-16 07:54:33
categories: [.NET, EF CORE]
tags: [.NET]
order: 7
---

## 更改跟踪

在 EF Core 中，**更改跟踪器 (Change Tracker)** 是 `DbContext` 内部的一个核心组件，它的主要职责是：

1. **监控 (Monitoring)**：记录通过 `DbContext` 查询加载或明确附加到 `DbContext` 的实体实例的**初始状态和当前状态**。
2. **检测变更 (Detecting Changes)**：比较实体的当前属性值与其加载时（或上次保存时）的原始属性值。
3. **管理实体状态 (Managing Entity States)**：为每个被跟踪的实体维护一个明确的状态（`Added`、`Modified`、`Deleted`、`Unchanged`、`Detached`）。
4. **生成数据库命令 (Generating Database Commands)**：在调用 `SaveChanges()` 时，根据实体的状态和检测到的变更，生成相应的 `INSERT`、`UPDATE` 或 `DELETE` SQL 命令。

简而言之，更改跟踪就是 EF Core 自动知道你对实体做了什么修改，并在你告诉它保存时，将这些修改正确地反映到数据库中的机制。

### 实体状态

每个被 `DbContext` 跟踪的实体都有一个对应的 `EntityState`。理解这些状态是理解更改跟踪的关键：

- **`Added` (已添加)**：实体是新的，尚未存在于数据库中。当调用 `SaveChanges()` 时，EF Core 会生成 `INSERT` 语句。
  - **如何达到**：`DbContext.Add()` 或 `DbSet<TEntity>.Add()`。
- **`Modified` (已修改)**：实体已经存在于数据库中，但其一个或多个属性值已被更改。当调用 `SaveChanges()` 时，EF Core 会生成 `UPDATE` 语句。
  - **如何达到**：通过查询加载实体，然后修改其属性值。
  - 对于未跟踪实体，使用 `DbContext.Update()` 或 `DbContext.Attach()` 后手动设置 `Entry().State = EntityState.Modified`。
- **`Deleted` (已删除)**：实体已经存在于数据库中，但已被标记为要从数据库中删除。当调用 `SaveChanges()` 时，EF Core 会生成 `DELETE` 语句。
  - **如何达到**：`DbContext.Remove()` 或 `DbSet<TEntity>.Remove()`。
- **`Unchanged` (未更改)**：实体存在于数据库中，并且其属性值自加载或上次保存以来没有发生变化。当调用 `SaveChanges()` 时，EF Core 不会为此类实体生成任何 SQL。
  - **如何达到**：通过查询加载实体后未做任何修改；或 `SaveChanges()` 成功提交后，所有被跟踪实体的状态都会重置为 `Unchanged`。
- **`Detached` (分离)**：实体实例未被任何 `DbContext` 实例跟踪。它们是“断开连接的”。EF Core 不会对其进行任何操作。
  - **如何达到**：
    - 使用 `new` 关键字创建的实体，在被 `Add()` 或 `Attach()` 之前。
    - 通过 `AsNoTracking()` 加载的实体。
    - `DbContext` 被 Dispose 后，它曾经跟踪的实体都变为 `Detached`。
    - 调用 `DbContext.Entry(entity).State = EntityState.Detached;`。

示例：实体状态流转

```CS
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
}

public class MyDbContext : DbContext
{
    public DbSet<Product> Products { get; set; } = null!;
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =>
        optionsBuilder.UseSqlServer("YourConnectionString");
}

public async Task DemonstrateEntityStates()
{
    using (var context = new MyDbContext())
    {
        // 1. Detached (未跟踪)
        var newProduct = new Product { Name = "New Gadget", Price = 99.99m };
        Console.WriteLine($"State of newProduct (before Add): {context.Entry(newProduct).State}"); // Detached

        // 2. Added (已添加)
        context.Products.Add(newProduct);
        Console.WriteLine($"State of newProduct (after Add): {context.Entry(newProduct).State}"); // Added

        await context.SaveChangesAsync(); // INSERT SQL
        // 此时 newProduct 的 Id 会被填充，并且状态变为 Unchanged
        Console.WriteLine($"State of newProduct (after SaveChanges): {context.Entry(newProduct).State}"); // Unchanged

        // 3. Unchanged (未更改)
        var existingProduct = await context.Products.FirstAsync();
        Console.WriteLine($"State of existingProduct (after load): {context.Entry(existingProduct).State}"); // Unchanged

        // 4. Modified (已修改)
        existingProduct.Price = 105.00m; // 修改属性
        Console.WriteLine($"State of existingProduct (after modification): {context.Entry(existingProduct).State}"); // Modified

        await context.SaveChangesAsync(); // UPDATE SQL
        Console.WriteLine($"State of existingProduct (after SaveChanges again): {context.Entry(existingProduct).State}"); // Unchanged

        // 5. Deleted (已删除)
        context.Products.Remove(existingProduct);
        Console.WriteLine($"State of existingProduct (after Remove): {context.Entry(existingProduct).State}"); // Deleted

        await context.SaveChangesAsync(); // DELETE SQL
        Console.WriteLine($"State of existingProduct (after SaveChanges final): {context.Entry(existingProduct).State}"); // Detached (从数据库和跟踪器中移除)
    }
}
```

### 更改检测

#### 快照更改跟踪

这是 EF Core 的**默认行为**，也是最常用的方式。

**工作原理**：当实体被加载到 `DbContext` 中时，EF Core 会为每个属性的值拍摄一个“快照”（副本）。当调用 `SaveChanges()` 时，EF Core 会将实体的**当前属性值**与这个**快照值**进行比较。如果发现差异，就认为该属性已被修改，并将实体状态标记为 `Modified`。

**优点**：

- **简单易用**：你只需修改实体属性，EF Core 自动处理检测。
- **高效**：对于大多数场景，这种比较是高效的。

**缺点**：

- **内存开销**：需要存储所有属性的快照。对于包含大量属性的实体或大量实体实例，可能会有可观的内存开销。
- **非及时性**：只有在调用 `SaveChanges()` 或手动触发更改检测时，才会检测到更改。

#### 通知更改跟踪

这是一种更高级的模式，适用于需要更精细控制更改检测的场景，通常用于 UI 绑定。

**工作原理**：实体类需要实现 `INotifyPropertyChanged` 接口。当属性值被设置时，它会触发 `PropertyChanged` 事件。EF Core 监听这些事件，当事件触发时，立即更新其内部的变更跟踪状态。

**优点**：

- **即时性**：更改立即被跟踪。
- **更小的内存开销**：不需要存储完整的快照（只需要原始值），因为它通过事件来响应更改。

**缺点**：

- **需要修改实体类**：你的实体类需要实现接口并包含属性设置器中的事件触发逻辑。这增加了代码的复杂性。
- **性能权衡**：尽管内存开销小，但频繁的事件触发也可能带来额外的 CPU 开销。

**使用方式：**

```CS
// 启用通知更改跟踪
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Product>()
        .HasChangeTrackingStrategy(ChangeTrackingStrategy.ChangingAndChangedNotifications);
    // 或者 ChangeTrackingStrategy.ChangingNotifications
}
```

```CS
// 自定义实现INotifyPropertyChanged接口的实体类
using System.ComponentModel;
using System.Runtime.CompilerServices;

public class Product : INotifyPropertyChanged // 实现接口
{
    private int _id;
    private string _name = string.Empty;
    private decimal _price;

    public int Id
    {
        get => _id;
        set
        {
            if (_id != value)
            {
                _id = value;
                OnPropertyChanged(); // 触发事件
            }
        }
    }

    public string Name
    {
        get => _name;
        set
        {
            if (_name != value)
            {
                _name = value;
                OnPropertyChanged();
            }
        }
    }

    public decimal Price
    {
        get => _price;
        set
        {
            if (_price != value)
            {
                _price = value;
                OnPropertyChanged();
            }
        }
    }

    public event PropertyChangedEventHandler? PropertyChanged;

    protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}
```

#### 手动触发更改检测

在某些高级场景中，如果你使用了像 `AsNoTracking()` 这样的方法加载实体，然后又重新附加它们，或者你手动操作了属性值但没有通过 EF Core 默认的跟踪机制，你可能需要手动触发更改检测：

- `context.ChangeTracker.DetectChanges()`：强制 EF Core 立即扫描所有被跟踪实体以查找更改并更新它们的状态。`SaveChanges()` 在内部会自动调用此方法。
- `context.Entry(entity).State = EntityState.Modified;`：直接设置实体状态。

### 访问跟踪器API

`DbContext.ChangeTracker` 属性提供了访问更改跟踪器实例的入口，允许你进行更高级的操作：

- `context.ChangeTracker.Entries()`：获取所有被跟踪实体的 `EntityEntry` 集合，可以检查它们的当前状态、原始值等。
- `context.ChangeTracker.HasChanges()`：检查是否存在任何待保存的变更。
- `context.Entry(entity)`：获取特定实体的 `EntityEntry` 对象，从而检查或修改该实体的状态、访问其属性值（当前值、原始值）、标记特定属性为已修改等。

```CS
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking; // 引入此命名空间

public class Blog
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}

public class MyDbContext : DbContext
{
    public DbSet<Blog> Blogs { get; set; } = null!;
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =>
        optionsBuilder.UseSqlServer("YourConnectionString");
}

public async Task DemonstrateChangeTracker()
{
    using (var context = new MyDbContext())
    {
        // 1. 查询实体：它们将处于 Unchanged 状态
        var blog = await context.Blogs.FirstAsync();
        var newBlog = new Blog { Name = "New Blog", Url = "http://new.blog.com" };

        // 2. 添加新实体：处于 Added 状态
        context.Blogs.Add(newBlog);

        // 3. 修改现有实体：将变成 Modified 状态
        blog.Name = "Updated Blog Name";

        Console.WriteLine("--- Before SaveChanges ---");
        foreach (var entry in context.ChangeTracker.Entries())
        {
            Console.WriteLine($"Entity: {entry.Metadata.DisplayName()}, State: {entry.State}");
            if (entry.Entity is Blog b)
            {
                Console.WriteLine($"  Id: {b.Id}, Name: {b.Name}");

                // 演示获取原始值和当前值
                if (entry.State == EntityState.Modified)
                {
                    Console.WriteLine($"  Original Name: {entry.OriginalValues[nameof(Blog.Name)]}");
                    Console.WriteLine($"  Current Name: {entry.CurrentValues[nameof(Blog.Name)]}");
                }
            }
        }
        // Output (类似):
        // Entity: Blog, State: Modified (for 'blog' instance)
        // Entity: Blog, State: Added (for 'newBlog' instance)

        await context.SaveChangesAsync();

        Console.WriteLine("\n--- After SaveChanges ---");
        foreach (var entry in context.ChangeTracker.Entries())
        {
            Console.WriteLine($"Entity: {entry.Metadata.DisplayName()}, State: {entry.State}");
            // Output (类似):
            // Entity: Blog, State: Unchanged (for both blog and newBlog instances)
        }
    }
}
```

### 标识解析

标识解析是 EF Core **变更跟踪器**的一个关键功能，它确保在任何给定 `DbContext` 实例的生命周期内，对于同一个数据库实体（由其主键唯一标识），**始终只有一个 CLR 对象实例被跟踪**。

假设现在从数据库中查询了 ID 为 1 的 `Product`。然后，在同一个 `DbContext` 实例中，你再次查询了 ID 为 1 的 `Product`：

- **没有标识解析**：如果你得到的是两个独立的 `Product` 对象实例，即使它们都代表数据库中的同一行，但在内存中它们是不同的对象。如果你修改了其中一个，另一个将不会反映这些修改，并且在 `SaveChanges()` 时可能会导致混乱或错误。
- **有了标识解析 (EF Core 的默认行为)**：当你第二次查询 ID 为 1 的 `Product` 时，EF Core 会识别出它已经在内部跟踪器中有了这个实体的实例。它不会再从数据库中创建一个新的实例，而是**返回它已经在跟踪的那个现有实例**。

这就是**标识解析**：EF Core 确保它在内存中维护着数据库实体的唯一表示。

#### 工作原理

EF Core 的标识解析主要依赖于实体的主键。

1. **缓存 (Cache)**：`DbContext` 内部维护一个“身份映射”或“缓存”，它存储了每个被跟踪实体的主键与其实例的映射关系。
2. **查询结果处理**：当 EF Core 执行一个查询并将数据从数据库加载到内存时：
   - 它首先检查缓存中是否已经存在一个具有相同主键的实体实例。
   - **如果存在**：EF Core 不会创建新的实例。它会使用缓存中的现有实例，并根据数据库中的最新数据更新该实例的属性（如果存在并发冲突，则按并发处理规则进行）。
   - **如果不存在**：EF Core 会创建一个新的实体实例，并将其添加到缓存和变更跟踪器中。

示例：

```C#
public class Author
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public ICollection<Book> Books { get; set; } = new List<Book>();
}

public class Book
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int AuthorId { get; set; }
    public Author Author { get; set; } = null!;
}

public class MyDbContext : DbContext
{
    public DbSet<Author> Authors { get; set; } = null!;
    public DbSet<Book> Books { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =>
        optionsBuilder.UseSqlServer("YourConnectionString");
}

public async Task DemonstrateIdentityResolution()
{
    using (var context = new MyDbContext())
    {
        // 确保数据库中有 Author (Id=1) 和 Book (Id=1)
        // 假设 Author 1 是 "Author A", Book 1 是 "Book X" 且属于 Author A

        // 第一次查询：加载 Author 1
        var author1_first = await context.Authors.FirstOrDefaultAsync(a => a.Id == 1);
        if (author1_first != null)
        {
            Console.WriteLine($"First loaded Author: {author1_first.Name}"); // Output: Author A
            author1_first.Name = "Updated Author A"; // 修改实体
        }

        // 第二次查询：再次加载 Author 1 (在同一个 DbContext 实例中)
        var author1_second = await context.Authors.FirstOrDefaultAsync(a => a.Id == 1);
        if (author1_second != null)
        {
            // 验证：两个变量是否引用同一个对象实例？
            Console.WriteLine($"Are author1_first and author1_second the same object? {ReferenceEquals(author1_first, author1_second)}");
            // Output: True

            // 验证：第二次查询到的 Name 是否是第一次修改后的值？
            Console.WriteLine($"Second loaded Author's Name: {author1_second.Name}"); // Output: Updated Author A
            // 是的，因为它们是同一个对象，修改在一个地方会反映在另一个地方。
        }

        // 查询 Book 1，同时 Include 它的 Author
        var book1 = await context.Books.Include(b => b.Author).FirstOrDefaultAsync(b => b.Id == 1);
        if (book1 != null)
        {
            Console.WriteLine($"Book's Author Name: {book1.Author.Name}"); // Output: Updated Author A
            // Book.Author 导航属性指向的也是第一次查询并修改过的那个 Author 实例。
            Console.WriteLine($"Is book1.Author the same as author1_first? {ReferenceEquals(book1.Author, author1_first)}");
            // Output: True
        }

        // 如果此时调用 SaveChangesAsync()，只会根据 author1_first 的修改生成一条 UPDATE 语句。
        await context.SaveChangesAsync();
        Console.WriteLine("Changes saved.");
    }
}
```

#### 发生的时机

标识解析发生在以下情况：

- **执行查询并加载实体时**（除了 `AsNoTracking()` 查询）。
- **通过导航属性加载相关实体时**（例如，`Include()` 或延迟加载）。
- **手动附加实体时**（例如 `DbContext.Add()`, `DbContext.Attach()`, `DbContext.Update()`）。如果尝试附加一个主键与现有跟踪实体相同的新实体，EF Core 会抛出异常（除非你先分离旧的，或用 `Update()` 尝试合并）。

### 附加的变更跟踪功能

#### Add与AddAsync

**功能：**在功能上是等效的。它们都将实体标记为 `Added` 状态，以便在调用 `SaveChanges()` 时进行插入。

**执行方式**：

- `Add()` 是**同步**的，会阻塞调用线程。
- `AddAsync()` 是**异步**的，不会阻塞调用线程，更适合 I/O 密集型或并发高的场景。

#### AddRange、UpdateRange、AttachRange、RemoveRange

##### AddRange

`AddRange()` 方法用于将**一个集合中所有新的实体实例**添加到 `DbContext` 的变更跟踪器中。每个实体都会被标记为 `Added` 状态，以便在下次调用 `SaveChanges()` 时被插入到数据库中。

**语法：**

```C#
public virtual void AddRange (params object[] entities); // 接受可变参数
public virtual void AddRange (IEnumerable<object> entities); // 接受 IEnumerable<T>
// 也可以在 DbSet<TEntity> 上调用，类型更安全
public virtual void AddRange (params TEntity[] entities);
public virtual void AddRange (IEnumerable<TEntity> entities);
```

**示例：**

```C#
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

public class MyEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class MyDbContext : DbContext
{
    public DbSet<MyEntity> MyEntities { get; set; } = null!;
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =>
        optionsBuilder.UseSqlServer("YourConnectionString");
}

public async Task AddMultipleEntities()
{
    using (var context = new MyDbContext())
    {
        var entitiesToAdd = new List<MyEntity>
        {
            new MyEntity { Name = "Entity 1" },
            new MyEntity { Name = "Entity 2" },
            new MyEntity { Name = "Entity 3" }
        };

        // 批量添加实体
        context.MyEntities.AddRange(entitiesToAdd);

        // 此时所有实体都处于 'Added' 状态
        foreach (var entity in entitiesToAdd)
        {
            Console.WriteLine($"Entity '{entity.Name}' state: {context.Entry(entity).State}");
        }

        await context.SaveChangesAsync();
        Console.WriteLine($"{entitiesToAdd.Count} entities added to database.");
    }
}
```

> `AddRange()` 会为集合中的每个实体执行 `Add()` 相同的逻辑，即根据主键的默认值判断是否为新实体。
>
> 与 `Add()` 一样，`AddRange()` 本身不直接与数据库交互，只是更新内存中的实体状态。

---

与 `Add()` 和 `AddAsync()` 的关系类似，EF Core 也为 `AddRange` 提供了异步版本：`AddRangeAsync()`。

**`AddRangeAsync()`**：用于异步地将多个实体添加到变更跟踪器中。与 `AddRange()` 相比，它在底层可能涉及一些异步 I/O 优化，但核心功能是将实体标记为 `Added`。在现代异步编程模型中，如果你的代码需要异步地添加大量实体，或者你在并发环境中操作，推荐使用此版本。

目前，EF Core 没有 `UpdateRangeAsync`、`AttachRangeAsync` 和 `RemoveRangeAsync`。这是因为 `UpdateRange`、`AttachRange` 和 `RemoveRange` 这些操作主要是在**内存中**对变更跟踪器进行操作，它们本身不涉及直接的数据库 I/O（真正的 I/O 发生在 `SaveChanges()` / `SaveChangesAsync()` 时）。因此，这些方法通常不需要异步版本。

##### UpdateRange

`UpdateRange()` 方法用于将**一个集合中的多个实体实例**附加到 `DbContext` 中，并尝试推断它们的生命周期状态。它会递归遍历实体图（如果导航属性已加载），并尝试将实体标记为 `Added` 或 `Modified`。

**语法：**

```C#
public virtual void UpdateRange (params object[] entities);
public virtual void UpdateRange (IEnumerable<object> entities);
// 也可以在 DbSet<TEntity> 上调用
public virtual void UpdateRange (params TEntity[] entities);
public virtual void UpdateRange (IEnumerable<TEntity> entities);
```

**示例：**

```C#
public async Task UpdateMultipleEntities()
{
    using (var context = new MyDbContext())
    {
        // 假设数据库中已有 MyEntity 101, 102
        // 创建一个包含修改的现有实体和新实体的列表
        var entitiesToProcess = new List<MyEntity>
        {
            new MyEntity { Id = 101, Name = "Updated Entity 101" }, // 现有实体，被修改
            new MyEntity { Id = 102, Name = "Updated Entity 102" }, // 现有实体，被修改
            new MyEntity { Name = "New Entity 4" } // 全新实体
        };

        // 批量更新或添加实体
        // 对于 Id > 0 的实体，EF Core 会尝试将其标记为 Modified
        // 对于 Id = 0 的实体，EF Core 会将其标记为 Added
        context.MyEntities.UpdateRange(entitiesToProcess);

        foreach (var entity in entitiesToProcess)
        {
            Console.WriteLine($"Entity '{entity.Name}' (Id: {entity.Id}) state: {context.Entry(entity).State}");
        }
        // Output:
        // Entity 'Updated Entity 101' (Id: 101) state: Modified
        // Entity 'Updated Entity 102' (Id: 102) state: Modified
        // Entity 'New Entity 4' (Id: 0) state: Added

        await context.SaveChangesAsync();
        Console.WriteLine($"{entitiesToProcess.Count} entities processed (updated/added).");
    }
}
```

> **`UpdateRange()` 的行为与 `Update()` 类似**：它会尝试推断实体是 `Added` 还是 `Modified`。如果实体的主键有非默认值，它会被标记为 `Modified`；如果主键是默认值（通常是 `0`），它会被标记为 `Added`。
>
> **所有属性标记为修改**：与 `Update()` 一样，如果实体被标记为 `Modified`，那么它的所有属性都将被标记为已修改，即使它们实际上没有变化。这可能导致生成包含所有列的 `UPDATE` 语句。
>
> **处理断开连接的图**：`UpdateRange()` 可以递归地处理导航属性中的相关实体（如果这些实体也已加载并包含在图中）。它会根据主键自动推断这些相关子实体的状态。
>
> **不会自动处理删除**：`UpdateRange()` 不会自动检测并删除那些在传入集合中不存在，但在数据库中仍然存在的子实体。你需要手动处理这类删除操作（例如，加载旧的图并进行比较）。

##### AttachRange

`AttachRange()` 方法用于将**一个集合中的多个实体实例**附加到 `DbContext` 的变更跟踪器中。默认情况下，这些实体会被标记为 **`Unchanged`** 状态。

**语法**

```C#
public virtual void AttachRange (params object[] entities);
public virtual void void AttachRange (IEnumerable<object> entities);
// 也可以在 DbSet<TEntity> 上调用
public virtual void AttachRange (params TEntity[] entities);
public virtual void AttachRange (IEnumerable<TEntity> entities);
```

**示例**

```C#
public async Task AttachMultipleEntities()
{
    using (var context = new MyDbContext())
    {
        // 假设从外部源（如缓存、API）获取了这些实体，它们是断开连接的
        var disconnectedEntities = new List<MyEntity>
        {
            new MyEntity { Id = 103, Name = "Existing Entity 103" },
            new MyEntity { Id = 104, Name = "Existing Entity 104" }
        };

        // 批量附加实体。它们都会被标记为 'Unchanged'。
        context.MyEntities.AttachRange(disconnectedEntities);

        foreach (var entity in disconnectedEntities)
        {
            Console.WriteLine($"Entity '{entity.Name}' (Id: {entity.Id}) state: {context.Entry(entity).State}");
        }
        // Output:
        // Entity 'Existing Entity 103' (Id: 103) state: Unchanged
        // Entity 'Existing Entity 104' (Id: 104) state: Unchanged

        // 如果你随后修改了这些实体的属性，它们的状??态会变为 'Modified'
        disconnectedEntities[0].Name = "Modified Entity 103";
        context.ChangeTracker.DetectChanges(); // 手动检测，或在 SaveChanges() 时自动检测
        Console.WriteLine($"Entity '{disconnectedEntities[0].Name}' state after modification: {context.Entry(disconnectedEntities[0]).State}"); // Modified

        await context.SaveChangesAsync();
        Console.WriteLine($"{disconnectedEntities.Count} entities attached and processed (if modified).");
    }
}
```

**使用场景：**

- **重新附加现有实体**：当你有一个或多个从 `DbContext` 外部获取的实体，并且你知道它们已经存在于数据库中，并且你希望它们被跟踪（通常是为了后续修改或删除）。
- **手动控制状态**：`AttachRange()` 是设置实体状态的基础。附加后，你可以通过 `Entry(entity).State = EntityState.Modified/Deleted` 来手动设置它们的状态。

##### RemoveRange

该方法用于将**一个集合中的所有实体实例**标记为 `Deleted` 状态，以便在下次调用 `SaveChanges()` 时从数据库中删除它们。

**语法：**

```C#
public virtual void RemoveRange (params object[] entities);
public virtual void void RemoveRange (IEnumerable<object> entities);
// 也可以在 DbSet<TEntity> 上调用
public virtual void RemoveRange (params TEntity[] entities);
public virtual void RemoveRange (IEnumerable<TEntity> entities);
```

**示例：**

```C#
public async Task RemoveMultipleEntities()
{
    using (var context = new MyDbContext())
    {
        // 假设我们想删除 Id 为 105 和 106 的实体
        // 我们可以创建只包含 Id 的存根实体
        var entitiesToRemove = new List<MyEntity>
        {
            new MyEntity { Id = 105 },
            new MyEntity { Id = 106 }
        };

        // 批量移除实体。它们会被标记为 'Deleted'。
        // 对于这些没有被跟踪的实体，RemoveRange 内部会先 Attach() 它们，然后标记为 Deleted。
        context.MyEntities.RemoveRange(entitiesToRemove);

        foreach (var entity in entitiesToRemove)
        {
            Console.WriteLine($"Entity with Id {entity.Id} state: {context.Entry(entity).State}");
        }
        // Output:
        // Entity with Id 105 state: Deleted
        // Entity with Id 106 state: Deleted

        await context.SaveChangesAsync();
        Console.WriteLine($"{entitiesToRemove.Count} entities deleted from database.");
    }
}
```

> **级联删除**：`RemoveRange()` 会触发在 EF Core 模型中配置的级联删除行为（例如 `DeleteBehavior.Cascade`）。
>
> **无需加载整个实体**：与 `Remove()` 类似，你不需要加载整个实体才能删除它。提供一个只包含主键的实体实例即可。

### 跟踪查询VS不跟踪查询

**跟踪查询 (Tracking Queries)**：默认行为。当你使用 `context.DbSet.Where(...).ToList()` 等方法时，EF Core 会将查询结果加载到内存中，并将其附加到 `DbContext` 的变更跟踪器中。这些实体是**被跟踪的**，你可以修改它们并调用 `SaveChanges()` 来持久化更改。

**无跟踪查询 (No-Tracking Queries)**：使用 `.AsNoTracking()` 扩展方法。EF Core 不会将查询结果附加到变更跟踪器中。这些实体是**分离的 (`Detached`)**。

- **优点**：性能更高，内存消耗更少，因为不需要创建快照和管理状态。
- **缺点**：你不能直接修改这些实体并调用 `SaveChanges()` 来保存更改。如果你需要保存更改，必须手动将它们附加或更新到 `DbContext`。
- **适用场景**：只读操作（例如，显示数据、生成报告），或者当你处理断开连接实体时（先加载为无跟踪，再手动附加/更新）。

示例：AsNoTracking()

```C#
public async Task DemonstrateNoTracking()
{
    using (var context = new MyDbContext())
    {
        // 跟踪查询 (默认)
        var trackedProduct = await context.Products.FirstAsync();
        trackedProduct.Name = "Updated Tracked Product"; // 这个修改会被跟踪

        // 无跟踪查询
        var noTrackedProduct = await context.Products.AsNoTracking().FirstOrDefaultAsync();
        if (noTrackedProduct != null)
        {
            noTrackedProduct.Name = "Updated No-Tracked Product"; // 这个修改不会被跟踪
        }

        Console.WriteLine($"HasChanges after modification: {context.ChangeTracker.HasChanges()}"); // True (只因为 trackedProduct 的修改)
        await context.SaveChangesAsync(); // 只会保存 trackedProduct 的修改
    }
}
```

