---
title: 查询数据
shortTitle: 查询数据
description: 查询数据
date: 2025-07-15 11:27:33
categories: [.NET, EF CORE]
tags: [.NET]
order: 6
---

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

#### 问题引入

当你使用 **预先加载 (`.Include()` 和 `.ThenInclude()`)** 来加载相关数据时，EF Core 默认会生成一个**单一的 SQL 查询**。这个查询通常使用 `JOIN` 语句来将主实体和所有相关实体的数据连接起来。这被称为 **“单查询 (Single Query)”** 模式。

然而，当查询涉及到**多个 `Include()` 调用**，或者相关的集合数据量非常大时，这种单一查询可能会变得：

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

#### 使用场景

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

### 查询运算符

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

#### 从原始SQL获取标量结果或无键实体

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
using System.Linq;

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







