---
title: 保存数据
shortTitle: 保存数据
description: 保存数据
date: 2025-07-15 11:27:33
categories: [.NET, EF CORE]
tags: [.NET]
order: 5
---

## 保存数据

### 基本保存

EF Core 使用 **变更追踪器**（Change Tracker）来检测实体的状态变化，然后生成对应的 SQL 语句执行数据操作。

实体的 5 种状态：

| 状态        | 说明                         |
| ----------- | ---------------------------- |
| `Added`     | 新增，`SaveChanges()` 时插入 |
| `Modified`  | 修改，生成 `UPDATE`          |
| `Deleted`   | 删除，生成 `DELETE`          |
| `Unchanged` | 未更改，不执行 SQL           |
| `Detached`  | 未被上下文跟踪               |

#### 添加数据

要将新实体添加到数据库中，你需要：

1. 创建新的实体实例。
2. 将该实体添加到 `DbContext` 的相应 `DbSet` 中。
3. 调用 `SaveChanges()`。

```C#
public class Blog
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}

public class MyDbContext : DbContext
{
    public DbSet<Blog> Blogs { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("YourConnectionString");
    }
}

public async Task AddNewBlog()
{
    using (var context = new MyDbContext())
    {
        // 1. 创建新的 Blog 实例
        var newBlog = new Blog
        {
            Name = "My Awesome Blog",
            Url = "https://www.myawesomeblog.com"
        };

        // 2. 将实体添加到 DbSet。此时，实体状态被标记为 'Added'
        context.Blogs.Add(newBlog);
        // 或者使用 context.Add(newBlog); - 泛型方法，会自动识别 DbSet

        // 3. 调用 SaveChanges() 将变更持久化到数据库
        // EF Core 会生成 INSERT INTO Blogs (...) VALUES (...) SQL
        await context.SaveChangesAsync();

        Console.WriteLine($"New Blog Added with ID: {newBlog.Id}");
        // 实体被保存后，EF Core 会从数据库中填充其生成的主键 (如 Id)
    }
}
```

- `Add()` 方法将实体添加到变更跟踪器中，并将其状态设置为 `Added`。
- `SaveChangesAsync()` 执行数据库操作。如果实体的主键是数据库自动生成的（如自增长 ID），在 `SaveChangesAsync()` 成功执行后，该主键的值会被填充到实体实例中。

#### 修改数据

要修改数据库中的现有实体，你需要：

1. 从数据库中**查询并加载**要修改的实体（这通常会使实体被 `DbContext` 跟踪）。
2. 直接修改该实体的属性。
3. 调用 `SaveChanges()`。

```C#
public async Task UpdateBlogName(int blogId, string newName)
{
    using (var context = new MyDbContext())
    {
        // 1. 查询并加载要修改的 Blog。它现在被 DbContext 跟踪，状态为 'Unchanged'。
        var blogToUpdate = await context.Blogs.FirstOrDefaultAsync(b => b.Id == blogId);

        if (blogToUpdate != null)
        {
            // 2. 修改属性。此时，DbContext 的变更跟踪器会检测到变化，
            // 并将实体状态从 'Unchanged' 变为 'Modified'。
            blogToUpdate.Name = newName;

            // 3. 调用 SaveChanges()
            // EF Core 会生成 UPDATE Blogs SET Name = @newName WHERE Id = @blogId SQL
            await context.SaveChangesAsync();
            Console.WriteLine($"Blog {blogId} name updated to '{newName}'");
        }
        else
        {
            Console.WriteLine($"Blog with ID {blogId} not found.");
        }
    }
}
```

#### 未跟踪实体的修改

如果你有一个实体，它不是通过当前 `DbContext` 实例加载的（例如，从 API 接收，或从另一个 `DbContext` 实例加载并传递过来的），那么它是一个**未跟踪实体 (Disconnected Entity)**。要保存对它的修改，你需要手动将其附加到 `DbContext` 并标记为 `Modified`。

```C#
public async Task UpdateDisconnectedBlog(Blog disconnectedBlog)
{
    using (var context = new MyDbContext())
    {
        // 1. 将未跟踪实体附加到 DbContext，并将其状态标记为 'Modified'。
        // EF Core 此时会跟踪这个实体，并认为它的所有属性都可能被修改。
        context.Attach(disconnectedBlog).State = EntityState.Modified;

        // 如果你只知道部分属性被修改，并且想避免更新所有属性，
        // 可以只标记特定属性为 Modified：
        // context.Entry(disconnectedBlog).Property(b => b.Name).IsModified = true;
        // context.Entry(disconnectedBlog).Property(b => b.Url).IsModified = true;

        // 2. 调用 SaveChanges()
        // EF Core 会根据标记的属性生成 UPDATE SQL。
        await context.SaveChangesAsync();
        Console.WriteLine($"Disconnected Blog {disconnectedBlog.Id} updated.");
    }
}
```

- `Attach()` 通常用于将一个已知存在的实体附加到跟踪器中。
- `Update()` 方法（EF Core 3.0+）可以简化未跟踪实体的更新。它会尝试将实体附加到跟踪器，如果已存在相同主键的实体，则更新其属性；否则，将其标记为 `Modified`。

```C#
context.Update(disconnectedBlog); // 更简洁，等同于 Attach(entity).State = Modified;
await context.SaveChangesAsync();
```

#### 删除数据

要从数据库中删除一个实体，你需要：

1. 从数据库中**查询并加载**要删除的实体。
2. 将该实体从 `DbSet` 中移除。
3. 调用 `SaveChanges()`。

```C#
public async Task DeleteBlog(int blogId)
{
    using (var context = new MyDbContext())
    {
        // 1. 查询并加载要删除的 Blog。它现在被 DbContext 跟踪。
        var blogToDelete = await context.Blogs.FirstOrDefaultAsync(b => b.Id == blogId);

        if (blogToDelete != null)
        {
            // 2. 将实体从 DbSet 中移除。此时，实体状态被标记为 'Deleted'。
            context.Blogs.Remove(blogToDelete);
            // 或者使用 context.Remove(blogToDelete); - 泛型方法

            // 3. 调用 SaveChanges()
            // EF Core 会生成 DELETE FROM Blogs WHERE Id = @blogId SQL
            await context.SaveChangesAsync();
            Console.WriteLine($"Blog {blogId} deleted.");
        }
        else
        {
            Console.WriteLine($"Blog with ID {blogId} not found.");
        }
    }
}
```

---

#### `SaveChanges`批量保存

`SaveChanges()` 的一个强大之处在于，它会**批量处理**所有待定的变更（添加、修改、删除），并尝试在**一个数据库事务**中执行它们。这意味着如果其中任何一个操作失败，整个事务都会回滚，从而保持数据库的一致性。

```C#
public async Task PerformMultipleOperations()
{
    using (var context = new MyDbContext())
    {
        // 添加一个新博客
        var newBlog = new Blog { Name = "New Blog", Url = "https://newblog.com" };
        context.Blogs.Add(newBlog);

        // 修改一个现有博客
        var existingBlog = await context.Blogs.FirstOrDefaultAsync(b => b.Name == "My Awesome Blog");
        if (existingBlog != null)
        {
            existingBlog.Name = "My Updated Awesome Blog";
        }

        // 删除一个博客
        var blogToDelete = await context.Blogs.FirstOrDefaultAsync(b => b.Name == "Blog to Delete");
        if (blogToDelete != null)
        {
            context.Blogs.Remove(blogToDelete);
        }

        // 一次性保存所有变更
        // EF Core 会在后台生成多个 INSERT/UPDATE/DELETE 语句，并在一个事务中执行
        await context.SaveChangesAsync();
        Console.WriteLine("All pending changes saved successfully.");
    }
}
```

#### 小结

- 所有变更都通过 **`DbContext` 的变更跟踪器**进行管理。
- 使用 **`DbSet.Add()`** 添加新实体，状态变为 `Added`。
- 通过**加载实体后直接修改属性**来更新数据，状态变为 `Modified`（或使用 `Attach()` / `Update()` 处理未跟踪实体）。
- 使用 **`DbSet.Remove()`** 删除实体，状态变为 `Deleted`。
- 调用 **`SaveChanges()` 或 `SaveChangesAsync()`** 将所有待定变更一次性持久化到数据库，并在一个事务中执行，确保数据一致性。
- 推荐使用 **`SaveChangesAsync()`** 进行异步操作，以提高性能。

### 相关数据

#### 同步添加相关实体

在 EF Core 中，一个实体对象不仅是一个孤立的对象，**它可以通过导航属性与其他实体关联形成一个对象图**（Graph）。

这个图可以包括：

- 一个根对象（如 `Blog`）
- 多个子对象（如 `Post`）
- 子对象的子对象（如 `Comment`）

这个图的结构就像一棵树，EF Core 会智能识别它的结构。

如果你构造了一个包含多个**新对象**的图，然后只将其中一个对象添加到上下文中，EF Core 会**自动将这个图中所有新的实体一起标记为“Added”**，并保存到数据库中。

```C#
var blog = new Blog
{
    Name = "EF Core 学习",
    Posts = new List<Post>
    {
        new Post { Title = "入门", Content = "..." },
        new Post { Title = "进阶", Content = "..." }
    }
};

// 注意：此处的代码只添加了 Blog！
dbContext.Blogs.Add(blog);
dbContext.SaveChanges();
```

EF Core 会自动检测到 `blog.Posts` 中包含两个新的 `Post` 实体，它们尚未添加到上下文中，但由于它们**挂在 blog 这个图上**，EF Core 会**自动把这两个 Post 也添加进去**。

所以最终 EF Core 会生成：

1. 一条 INSERT INTO Blogs
2. 两条 INSERT INTO Posts（外键指向 blog 的 Id）

**底层机制：**

EF Core 的 `Add()` 方法实际上会递归遍历实体对象图，将所有状态为 Detached（未追踪）但通过导航属性可访问的实体设置为 `EntityState.Added`。

#### 添加相关实体

如果从上下文已跟踪的实体的导航属性引用新实体，则会发现该实体并将其插入到数据库中。

#### 关系变化

如果更改实体的导航属性，则会对数据库中的外键列进行相应的更改。

#### 删除关系

默认情况下，对于必需的关系，将配置级联删除行为，并从数据库中删除子/从属实体。 对于可选关系，默认情况下不会配置级联删除，但外键属性将设置为 null。

### 级联删除

当你删除一个主实体时，EF Core 会自动删除它关联的依赖实体（子实体）。

#### 使用方式

EF Core 默认行为是**启用级联删除**（只要外键非可空）。

你可以使用 Fluent API 显式配置：

```C#
modelBuilder.Entity<Post>()
    .HasOne(p => p.Blog)
    .WithMany(b => b.Posts)
    .OnDelete(DeleteBehavior.Cascade); // 启用级联删除
```

| 枚举值          | 含义         | 说明                                                         |
| --------------- | ------------ | ------------------------------------------------------------ |
| `Cascade`       | 级联删除     | 删除主实体时，也删除依赖实体                                 |
| `Restrict`      | 限制         | 不允许删除主实体，除非手动先删除依赖实体                     |
| `SetNull`       | 设置为空     | 删除主实体时，将依赖实体的外键设为 null（要求外键可空）      |
| `NoAction`      | 无操作       | 数据库不做任何处理，完全依赖开发者控制                       |
| `ClientSetNull` | 客户端设为空 | EF Core 把外键设为 null，但不发出 UPDATE 或 DELETE（仅限跟踪图时有效） |

### 并发冲突

EF Core 使用的是**乐观锁并发控制**：

- 默认认为不会冲突；
- 保存时检查版本字段或条件；
- 如果发生冲突就抛出异常，开发者处理。

#### 使用方式

- 使用 `[ConcurrencyCheck]` 特性

```C#
public class Product
{
    public int Id { get; set; }

    public string Name { get; set; }

    [ConcurrencyCheck]
    public decimal Price { get; set; }
}
```

如果 `Price` 字段在读取后被其他用户改过，你的保存操作就会抛出并发异常。

- 【推荐】使用版本字段

```C#
public class Product
{
    public int Id { get; set; }

    public string Name { get; set; }

    [Timestamp] // 或 Fluent API: .IsRowVersion()
    public byte[] RowVersion { get; set; }
}
```

EF Core 会自动在 SQL 语句中添加 RowVersion 条件：

```SQL
UPDATE Products
SET Name = @newName
WHERE Id = @id AND RowVersion = @originalVersion
```

如果 `RowVersion` 已变，说明别人在你之后改了，EF Core 会抛出异常！

#### 捕获异常

当发生并发冲突时，EF Core 会抛出：

```CS
catch (DbUpdateConcurrencyException ex)
{
    // 获取冲突的实体
    var entry = ex.Entries.Single();

    // 你原本希望保存的值
    var clientValues = entry.CurrentValues;

    // 数据库中当前的值（来自服务器）
    var databaseValues = entry.GetDatabaseValues();

    // 可供你决定：重试、提示冲突、强制覆盖等
}
```

### `ExecuteUpdate`和`ExecuteDelete`

#### 问题引入

在 EF Core 7.0 之前，如果你想更新或删除数据库中的多条记录，通常需要：

1. **加载**所有相关实体到内存中。
2. 在内存中**修改或标记删除**这些实体。
3. 调用 `SaveChanges()`。

这种方法在处理大量数据时存在明显的**性能瓶颈**：

- **高内存消耗**：将所有需要更新/删除的实体加载到应用程序内存中，可能导致内存溢出或垃圾回收压力。
- **网络往返开销**：从数据库读取大量数据到应用程序，然后应用程序再发送大量 `UPDATE` 或 `DELETE` 命令到数据库。
- **单条 SQL 语句效率低**：`SaveChanges()` 会为每条修改/删除的记录生成一条单独的 `UPDATE` 或 `DELETE` 语句（除非使用批量操作插件），效率远低于在数据库层面执行一条语句来更新/删除多条记录。

`ExecuteUpdate` 和 `ExecuteDelete` 方法的引入就是为了解决这些问题。它们允许你**直接在数据库服务器上执行更新和删除操作**，而无需将实体加载到内存中。这类似于直接执行 SQL 的 `UPDATE` 或 `DELETE` 语句，但仍然可以利用 LINQ 的类型安全和可组合性。

#### `ExecuteUpdate()`

`ExecuteUpdate()` 方法允许你对一个查询结果集中的所有实体执行批量更新操作，而无需将它们加载到内存中。

```CS
await context.DbSet<TEntity>()
    .Where(predicate) // 可选：指定要更新的实体范围
    .ExecuteUpdateAsync(setter => setter
        .SetProperty(e => e.Property1, value1) // 设置单个属性
        .SetProperty(e => e.Property2, e.Property2 + value2) // 基于现有值更新属性
        // 可以链式调用多个 SetProperty
    );
```

示例：将所有价格低于 $50 的产品的价格提高 10%。

```CS
using Microsoft.EntityFrameworkCore;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public bool IsAvailable { get; set; }
}

public class MyDbContext : DbContext
{
    public DbSet<Product> Products { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("YourConnectionString");
    }
}

public async Task BatchUpdateProductPrices()
{
    using (var context = new MyDbContext())
    {
        Console.WriteLine("Before update:");
        var oldProducts = await context.Products.Where(p => p.Price < 50).ToListAsync();
        foreach (var p in oldProducts) Console.WriteLine($"- {p.Name}: {p.Price:C}");

        // 将所有价格低于 50 的产品的价格提高 10%，并将其设置为可用
        var affectedRows = await context.Products
            .Where(p => p.Price < 50) // 筛选要更新的记录
            .ExecuteUpdateAsync(setter => setter // 定义如何更新
                .SetProperty(p => p.Price, p => p.Price * 1.10m) // 将价格提高 10%
                .SetProperty(p => p.IsAvailable, true)           // 设置 IsAvailable 为 true
            );

        Console.WriteLine($"\nUpdated {affectedRows} products.");

        Console.WriteLine("After update:");
        var newProducts = await context.Products.Where(p => p.Price < 50 * 1.10m).ToListAsync(); // 注意筛选条件变化
        foreach (var p in newProducts) Console.WriteLine($"- {p.Name}: {p.Price:C}, Available: {p.IsAvailable}");
    }
}
```

EF Core 会将上述 LINQ 语句翻译成一条单一的 `UPDATE` SQL 语句，并在数据库服务器上执行：

```SQL
UPDATE [p]
SET [p].[Price] = [p].[Price] * 1.10,
    [p].[IsAvailable] = CAST(1 AS bit)
FROM [Products] AS [p]
WHERE [p].[Price] < 50.0;
```

**`ExecuteUpdate()` 的特点和限制：**

- **不在内存中加载实体**：这是它性能高效的关键。
- **不影响变更跟踪器**：因为实体没有被加载到内存中，所以 `DbContext` 的变更跟踪器对这些更改是**无感知**的。如果你之后加载了这些实体，它们将反映数据库中的新值，但它们在 `ExecuteUpdate()` 执行时并没有被跟踪。
- **不触发保存事件或拦截器**：由于没有通过 `SaveChanges()` 流程，因此任何与 `SaveChanges()` 相关的事件（如 `SavingChanges`、`SavedChanges`）或拦截器都不会被触发。
- **不支持级联更新**：`ExecuteUpdate()` 只更新你指定实体集中的属性。它不会自动更新相关实体（例如，它不会像 `SaveChanges()` 那样处理导航属性的变更）。
- **返回受影响行数**：方法返回一个整数，表示受更新影响的行数。
- **可以在查询的任何位置使用**：只要它是一个 `IQueryable`，你就可以在其上调用 `ExecuteUpdateAsync()`。
- **仅支持设置属性**：不能用于添加或删除实体，也不能用于执行复杂的业务逻辑（需要加载实体到内存）。
- **事务**：`ExecuteUpdateAsync()` 本身不会启动事务。如果你需要它在事务中执行，你需要手动管理事务，例如：

```CS
using var transaction = await context.Database.BeginTransactionAsync();
try
{
    await context.Products.Where(...).ExecuteUpdateAsync(...);
    await context.AnotherTable.Where(...).ExecuteUpdateAsync(...);
    await transaction.CommitAsync();
}
catch (Exception)
{
    await transaction.RollbackAsync();
    throw;
}
```

#### `ExecuteDelete()`

`ExecuteDelete()` 方法允许你对一个查询结果集中的所有实体执行批量删除操作，而无需将它们加载到内存中。

**语法**

```CS
await context.DbSet<TEntity>()
    .Where(predicate) // 指定要删除的实体范围
    .ExecuteDeleteAsync();
```

示例：删除所有价格低于 $10 的产品。

```CS
public async Task BatchDeleteLowPriceProducts()
{
    using (var context = new MyDbContext())
    {
        Console.WriteLine("Before delete:");
        var currentProductCount = await context.Products.CountAsync();
        Console.WriteLine($"Current product count: {currentProductCount}");

        // 删除所有价格低于 10 的产品
        var affectedRows = await context.Products
            .Where(p => p.Price < 10) // 筛选要删除的记录
            .ExecuteDeleteAsync();    // 执行删除

        Console.WriteLine($"\nDeleted {affectedRows} products.");

        Console.WriteLine("After delete:");
        var newProductCount = await context.Products.CountAsync();
        Console.WriteLine($"New product count: {newProductCount}");
    }
}
```

EF Core 会将上述 LINQ 语句翻译成一条单一的 `DELETE` SQL 语句，并在数据库服务器上执行：

```CS
DELETE FROM [p]
FROM [Products] AS [p]
WHERE [p].[Price] < 10.0;
```

**`ExecuteDelete()` 的特点和限制：**

- **不在内存中加载实体**：性能高效的关键。
- **不影响变更跟踪器**：与 `ExecuteUpdate()` 类似，`DbContext` 不知道这些删除操作。
- **不触发保存事件或拦截器**。
- **返回受影响行数**：方法返回一个整数，表示受删除影响的行数。
- **支持数据库级联删除**：如果你的数据库中配置了级联删除（`ON DELETE CASCADE`），当 `ExecuteDelete()` 删除父实体时，数据库会自动级联删除相关的子实体。但 **EF Core 本身不会模拟客户端级联行为**；它完全依赖于数据库的级联机制。
- **不支持客户端级联删除**：这是与 `SaveChanges()` 的一个重要区别。如果你依赖 EF Core 在客户端模拟的级联删除行为（例如，外键是可选的，且你配置了 `DeleteBehavior.ClientSetNull`），那么 `ExecuteDelete()` 不会执行这种客户端逻辑。它只会执行你指定实体的删除，不会自动处理相关实体的外键置空或删除。
- **事务**：与 `ExecuteUpdateAsync()` 类似，`ExecuteDeleteAsync()` 本身不会启动事务，需要手动管理。

### 事务

#### ACID特性

#### 隐式事务

当你调用 `SaveChanges()` 或 `SaveChangesAsync()` 方法时，EF Core 默认会在**内部创建一个事务**来包含该方法所涉及的所有数据库操作（`INSERT`、`UPDATE`、`DELETE`）。

- **优点**：方便，你不需要显式管理事务。
- **缺点**：只能包含单个 `SaveChanges()` 调用中的操作。如果你有多个 `SaveChanges()` 调用，或者需要执行一些原始 SQL 命令，并且希望它们都原子性地完成，那么隐式事务就不够用了。

```CS
public async Task AddBlogAndPostImplicitly()
{
    using (var context = new MyDbContext())
    {
        var newBlog = new Blog { Name = "Implicit Transaction Blog" };
        var newPost = new Post { Title = "Implicit Post", Blog = newBlog };

        context.Blogs.Add(newBlog);
        context.Posts.Add(newPost);

        // SaveChanges() 会在一个隐式事务中添加 Blog 和 Post
        // 如果其中任何一个失败，整个操作都会回滚。
        await context.SaveChangesAsync();
        Console.WriteLine($"Blog and Post added using implicit transaction. Blog ID: {newBlog.Id}");
    }
}
```

#### 显式事务

当你需要将多个 `SaveChanges()` 调用、或者 `SaveChanges()` 与原始 SQL 命令（如 `ExecuteSqlRaw()` / `ExecuteSqlInterpolated()` / 存储过程调用）组合在一个原子操作中时，你需要使用显式事务。

EF Core 提供了 `DbContext.Database.BeginTransaction()` / `BeginTransactionAsync()` 方法来手动管理事务。

##### 使用方式

1. **`BeginTransaction()`**：开始一个新的数据库事务。
2. **执行操作**：在事务内执行你的 EF Core 操作和/或原始 SQL 命令。
3. **`Commit()`**：如果所有操作都成功，提交事务，使更改永久化。
4. **`Rollback()`**：如果发生错误，回滚事务，撤销所有更改。
5. **`Dispose()`**：在 `using` 块中确保事务对象被正确释放。

示例：

```CS
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage; // 引入此命名空间

public async Task TransferPostsBetweenBlogs(int fromBlogId, int toBlogId)
{
    using (var context = new MyDbContext())
    {
        // 1. 开始事务
        using (IDbContextTransaction transaction = await context.Database.BeginTransactionAsync())
        {
            try
            {
                // 确保两个博客都存在
                var fromBlog = await context.Blogs.FindAsync(fromBlogId);
                var toBlog = await context.Blogs.FindAsync(toBlogId);

                if (fromBlog == null || toBlog == null)
                {
                    Console.WriteLine("One or both blogs not found. Rolling back.");
                    await transaction.RollbackAsync();
                    return;
                }

                // 2. 查找要转移的 Post (例如，假设我们要转移所有 Post)
                var postsToTransfer = await context.Posts
                    .Where(p => p.BlogId == fromBlogId)
                    .ToListAsync();

                // 3. 修改这些 Post 的外键
                foreach (var post in postsToTransfer)
                {
                    post.BlogId = toBlogId;
                }

                // 4. 保存第一个 SaveChanges() 调用
                // 这些更改是事务的一部分，但尚未提交到数据库
                await context.SaveChangesAsync();
                Console.WriteLine($"Transferred {postsToTransfer.Count} posts from Blog {fromBlogId} to Blog {toBlogId}.");

                // 5. 额外操作：删除原始博客 (如果需要，并在同一个事务中)
                context.Blogs.Remove(fromBlog);
                await context.SaveChangesAsync(); // 第二个 SaveChanges() 调用，仍然在同一个事务中
                Console.WriteLine($"Blog {fromBlogId} removed.");

                // 6. 提交事务
                await transaction.CommitAsync();
                Console.WriteLine("Transaction committed successfully.");
            }
            catch (Exception ex)
            {
                // 发生错误时回滚事务
                Console.WriteLine($"Error during transaction: {ex.Message}. Rolling back.");
                await transaction.RollbackAsync();
            }
        }
    }
}
```

##### 隔离级别

当你开始一个显式事务时，你还可以指定事务的**隔离级别**。隔离级别定义了并发事务之间相互可见的程度，以平衡数据一致性和并发性能。

```CS
using System.Data; // for IsolationLevel

using (IDbContextTransaction transaction = await context.Database.BeginTransactionAsync(IsolationLevel.Serializable))
{
    // ... your operations ...
    await transaction.CommitAsync();
}
```

**常见的隔离级别（从低到高）：**

- **`ReadUncommitted`**：允许读取未提交的数据（脏读）。并发性最高，但数据一致性最差。
- **`ReadCommitted`** (大多数数据库的默认值)：只允许读取已提交的数据。防止脏读，但可能出现不可重复读和幻读。
- **`RepeatableRead`**：确保在事务期间多次读取同一行数据时，其值保持不变。防止脏读和不可重复读，但可能出现幻读。
- **`Serializable`**：最高的隔离级别。确保事务是完全隔离的，就好像它们是串行执行的一样。防止脏读、不可重复读和幻读，但并发性最低，可能导致死锁和性能问题。
- **`Snapshot`** (SQL Server 特定)：使用行版本控制来避免读写锁。提供 `RepeatableRead` 的一致性，同时具有更好的并发性。

### 断开连接的实体

**连接的实体 (Connected/Tracked Entity)**：如果一个实体实例是通过某个 `DbContext` 实例从数据库中加载出来的，或者通过 `DbContext.Add()`、`DbContext.Attach()` 等方法明确地附加到该 `DbContext` 实例的变更跟踪器中，那么它就是**连接的**或**被跟踪的**。EF Core 会监控这些实体属性的变化，并在调用 `SaveChanges()` 时自动生成相应的 `UPDATE` 或 `DELETE` 语句。

**断开连接的实体 (Disconnected Entity)**：如果一个实体实例**不是**由当前的 `DbContext` 实例加载的，也**没有**被附加到它的变更跟踪器中，那么它就是**断开连接的**。

**常见来源**：

- 从数据库加载后，`DbContext` 被释放（例如，在 Web 请求结束时）。
- 通过 API 接收的实体（例如，来自客户端的 JSON 数据）。
- 从另一个 `DbContext` 实例加载，然后传递到当前 `DbContext` 实例的上下文之外。
- 通过 `new` 关键字手动创建，但尚未添加到 `DbContext`。

#### 处理方式

处理断开连接的实体主要涉及告知 `DbContext` 它们的当前状态，以便 `SaveChanges()` 能够生成正确的 SQL。这通常通过 `DbContext.Entry()` 或 `DbContext.Add()` / `DbContext.Update()` / `DbContext.Remove()` 来实现。

##### 添加一个全新的断开连接实体

如果你有一个通过 `new` 操作符创建的实体，并且你希望将其添加到数据库，那么它是一个断开连接的新实体。

```C#
public class Blog
{
    public int Id { get; set; } // Id 会在保存后由数据库生成
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}

public class MyDbContext : DbContext
{
    public DbSet<Blog> Blogs { get; set; } = null!;
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =>
        optionsBuilder.UseSqlServer("YourConnectionString");
}

public async Task AddNewDisconnectedBlog(string name, string url)
{
    // 这是一个全新的、未被跟踪的 Blog 实体
    var newBlog = new Blog
    {
        Name = name,
        Url = url
    };

    using (var context = new MyDbContext())
    {
        // 使用 Add() 方法告诉 DbContext 这是一个新的实体。
        // EF Core 会将其状态标记为 'Added'。
        context.Blogs.Add(newBlog);
        // 或者 context.Add(newBlog); // 泛型 Add 也能工作

        await context.SaveChangesAsync();
        Console.WriteLine($"New disconnected blog added. ID: {newBlog.Id}");
    }
}
```

**`Add()` 方法的内部机制**： 当你调用 `Add()` 时，EF Core 会检查实体的主键。如果主键的默认值表示它尚未被设置（例如，`int` 类型的 `0`），EF Core 就会假设这是一个新实体，并将其状态标记为 `Added`。

##### 更新一个断开连接的实体

这是最常见的场景，也最复杂。你从数据库加载了一个实体，把它发送到客户端（比如 Web 界面），用户修改了它，然后你从客户端接收回这个修改后的实体。此时，这个实体是断开连接的。

- `Update()`方法

  - 如果实体的主键不为默认值（即它已经存在于数据库中），`Update()` 会尝试将其附加到 `DbContext`，并将其状态标记为 `Modified`。
  - 如果实体的主键是默认值（新实体），它会尝试将其标记为 `Added`（但通常这种场景用 `Add()` 更明确）。
  - **注意**：`Update()` 会将实体**所有属性**标记为已修改，即使某些属性实际上没有变化。这可能导致不必要的 `UPDATE` 语句。

  ```C#
  public async Task UpdateDisconnectedBlogUsingUpdate(Blog blogToUpdate)
  {
      using (var context = new MyDbContext())
      {
          // blogToUpdate 是一个断开连接的实体，它可能包含了用户的修改
          // Update() 方法会根据其主键（blogToUpdate.Id）判断它是否已存在。
          // 如果 Id 有值，它会将其状态标记为 'Modified'。
          context.Blogs.Update(blogToUpdate);
  
          await context.SaveChangesAsync();
          Console.WriteLine($"Disconnected blog {blogToUpdate.Id} updated using Update().");
      }
  }
  ```

- `Entry().State = EntityState.Modified`

  如果你想对哪些属性被修改有更精细的控制，或者你知道只有部分属性发生了变化，可以使用这种方法。

  ```C#
  using Microsoft.EntityFrameworkCore.ChangeTracking; // For EntityEntry
  
  public async Task UpdateDisconnectedBlogWithSpecificProperties(Blog blogToUpdate)
  {
      using (var context = new MyDbContext())
      {
          // 1. 将实体附加到 DbContext，其状态默认为 'Unchanged'
          EntityEntry<Blog> entry = context.Blogs.Attach(blogToUpdate);
  
          // 2. 将实体状态明确设置为 'Modified'。
          // 此时，EF Core 会认为所有属性都已修改。
          entry.State = EntityState.Modified;
  
          // 或者，更推荐的方式：只标记特定属性为 Modified
          // 如果你只知道 Name 和 Url 被修改了，而 Id 是主键不变的：
          // entry.Property(b => b.Name).IsModified = true;
          // entry.Property(b => b.Url).IsModified = true;
          // 如果你需要比较旧值和新值，你可能需要先加载旧实体：
          // var existingBlog = await context.Blogs.FindAsync(blogToUpdate.Id);
          // context.Entry(existingBlog).CurrentValues.SetValues(blogToUpdate); // 将新值复制到现有跟踪实体
  
          await context.SaveChangesAsync();
          Console.WriteLine($"Disconnected blog {blogToUpdate.Id} updated using Entry().State.");
      }
  }
  ```

  **何时使用**：当你希望 EF Core 只生成包含实际更改属性的 `UPDATE` 语句时，或者当你需要更复杂的比较逻辑来决定哪些属性被修改时（例如，使用 `CurrentValues.SetValues()` 来合并更改）。

##### 删除一个断开连接实体

如果你想删除一个你已经知道其主键的实体（但它当前没有被 `DbContext` 跟踪），你可以：

```C#
public async Task DeleteDisconnectedBlog(int blogId)
{
    // 创建一个只包含主键的“存根”实体
    var blogToDelete = new Blog { Id = blogId };

    using (var context = new MyDbContext())
    {
        // 1. 将存根实体附加到 DbContext。此时，它的状态默认为 'Unchanged'。
        context.Blogs.Attach(blogToDelete);

        // 2. 将其状态明确设置为 'Deleted'。
        // EF Core 会知道要根据主键生成 DELETE SQL。
        context.Blogs.Remove(blogToDelete); // Remove() 内部会设置状态为 Deleted

        await context.SaveChangesAsync();
        Console.WriteLine($"Disconnected blog {blogId} deleted.");
    }
}
```

> 你不需要加载整个实体来删除它，只需要一个包含主键的实体实例即可
