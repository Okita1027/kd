import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as e,d as a,o as i}from"./app-CN29avzT.js";const l={};function d(t,n){return i(),e("div",null,n[0]||(n[0]=[a(`<h2 id="更改跟踪" tabindex="-1"><a class="header-anchor" href="#更改跟踪"><span>更改跟踪</span></a></h2><p>在 EF Core 中，<strong>更改跟踪器 (Change Tracker)</strong> 是 <code>DbContext</code> 内部的一个核心组件，它的主要职责是：</p><ol><li><strong>监控 (Monitoring)</strong>：记录通过 <code>DbContext</code> 查询加载或明确附加到 <code>DbContext</code> 的实体实例的<strong>初始状态和当前状态</strong>。</li><li><strong>检测变更 (Detecting Changes)</strong>：比较实体的当前属性值与其加载时（或上次保存时）的原始属性值。</li><li><strong>管理实体状态 (Managing Entity States)</strong>：为每个被跟踪的实体维护一个明确的状态（<code>Added</code>、<code>Modified</code>、<code>Deleted</code>、<code>Unchanged</code>、<code>Detached</code>）。</li><li><strong>生成数据库命令 (Generating Database Commands)</strong>：在调用 <code>SaveChanges()</code> 时，根据实体的状态和检测到的变更，生成相应的 <code>INSERT</code>、<code>UPDATE</code> 或 <code>DELETE</code> SQL 命令。</li></ol><p>简而言之，更改跟踪就是 EF Core 自动知道你对实体做了什么修改，并在你告诉它保存时，将这些修改正确地反映到数据库中的机制。</p><h3 id="实体状态" tabindex="-1"><a class="header-anchor" href="#实体状态"><span>实体状态</span></a></h3><p>每个被 <code>DbContext</code> 跟踪的实体都有一个对应的 <code>EntityState</code>。理解这些状态是理解更改跟踪的关键：</p><ul><li><strong><code>Added</code> (已添加)</strong>：实体是新的，尚未存在于数据库中。当调用 <code>SaveChanges()</code> 时，EF Core 会生成 <code>INSERT</code> 语句。 <ul><li><strong>如何达到</strong>：<code>DbContext.Add()</code> 或 <code>DbSet&lt;TEntity&gt;.Add()</code>。</li></ul></li><li><strong><code>Modified</code> (已修改)</strong>：实体已经存在于数据库中，但其一个或多个属性值已被更改。当调用 <code>SaveChanges()</code> 时，EF Core 会生成 <code>UPDATE</code> 语句。 <ul><li><strong>如何达到</strong>：通过查询加载实体，然后修改其属性值。</li><li>对于未跟踪实体，使用 <code>DbContext.Update()</code> 或 <code>DbContext.Attach()</code> 后手动设置 <code>Entry().State = EntityState.Modified</code>。</li></ul></li><li><strong><code>Deleted</code> (已删除)</strong>：实体已经存在于数据库中，但已被标记为要从数据库中删除。当调用 <code>SaveChanges()</code> 时，EF Core 会生成 <code>DELETE</code> 语句。 <ul><li><strong>如何达到</strong>：<code>DbContext.Remove()</code> 或 <code>DbSet&lt;TEntity&gt;.Remove()</code>。</li></ul></li><li><strong><code>Unchanged</code> (未更改)</strong>：实体存在于数据库中，并且其属性值自加载或上次保存以来没有发生变化。当调用 <code>SaveChanges()</code> 时，EF Core 不会为此类实体生成任何 SQL。 <ul><li><strong>如何达到</strong>：通过查询加载实体后未做任何修改；或 <code>SaveChanges()</code> 成功提交后，所有被跟踪实体的状态都会重置为 <code>Unchanged</code>。</li></ul></li><li><strong><code>Detached</code> (分离)</strong>：实体实例未被任何 <code>DbContext</code> 实例跟踪。它们是“断开连接的”。EF Core 不会对其进行任何操作。 <ul><li><strong>如何达到</strong>： <ul><li>使用 <code>new</code> 关键字创建的实体，在被 <code>Add()</code> 或 <code>Attach()</code> 之前。</li><li>通过 <code>AsNoTracking()</code> 加载的实体。</li><li><code>DbContext</code> 被 Dispose 后，它曾经跟踪的实体都变为 <code>Detached</code>。</li><li>调用 <code>DbContext.Entry(entity).State = EntityState.Detached;</code>。</li></ul></li></ul></li></ul><p>示例：实体状态流转</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">public class Product</span>
<span class="line">{</span>
<span class="line">    public int Id { get; set; }</span>
<span class="line">    public string Name { get; set; } = string.Empty;</span>
<span class="line">    public decimal Price { get; set; }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">public class MyDbContext : DbContext</span>
<span class="line">{</span>
<span class="line">    public DbSet&lt;Product&gt; Products { get; set; } = null!;</span>
<span class="line">    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =&gt;</span>
<span class="line">        optionsBuilder.UseSqlServer(&quot;YourConnectionString&quot;);</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">public async Task DemonstrateEntityStates()</span>
<span class="line">{</span>
<span class="line">    using (var context = new MyDbContext())</span>
<span class="line">    {</span>
<span class="line">        // 1. Detached (未跟踪)</span>
<span class="line">        var newProduct = new Product { Name = &quot;New Gadget&quot;, Price = 99.99m };</span>
<span class="line">        Console.WriteLine($&quot;State of newProduct (before Add): {context.Entry(newProduct).State}&quot;); // Detached</span>
<span class="line"></span>
<span class="line">        // 2. Added (已添加)</span>
<span class="line">        context.Products.Add(newProduct);</span>
<span class="line">        Console.WriteLine($&quot;State of newProduct (after Add): {context.Entry(newProduct).State}&quot;); // Added</span>
<span class="line"></span>
<span class="line">        await context.SaveChangesAsync(); // INSERT SQL</span>
<span class="line">        // 此时 newProduct 的 Id 会被填充，并且状态变为 Unchanged</span>
<span class="line">        Console.WriteLine($&quot;State of newProduct (after SaveChanges): {context.Entry(newProduct).State}&quot;); // Unchanged</span>
<span class="line"></span>
<span class="line">        // 3. Unchanged (未更改)</span>
<span class="line">        var existingProduct = await context.Products.FirstAsync();</span>
<span class="line">        Console.WriteLine($&quot;State of existingProduct (after load): {context.Entry(existingProduct).State}&quot;); // Unchanged</span>
<span class="line"></span>
<span class="line">        // 4. Modified (已修改)</span>
<span class="line">        existingProduct.Price = 105.00m; // 修改属性</span>
<span class="line">        Console.WriteLine($&quot;State of existingProduct (after modification): {context.Entry(existingProduct).State}&quot;); // Modified</span>
<span class="line"></span>
<span class="line">        await context.SaveChangesAsync(); // UPDATE SQL</span>
<span class="line">        Console.WriteLine($&quot;State of existingProduct (after SaveChanges again): {context.Entry(existingProduct).State}&quot;); // Unchanged</span>
<span class="line"></span>
<span class="line">        // 5. Deleted (已删除)</span>
<span class="line">        context.Products.Remove(existingProduct);</span>
<span class="line">        Console.WriteLine($&quot;State of existingProduct (after Remove): {context.Entry(existingProduct).State}&quot;); // Deleted</span>
<span class="line"></span>
<span class="line">        await context.SaveChangesAsync(); // DELETE SQL</span>
<span class="line">        Console.WriteLine($&quot;State of existingProduct (after SaveChanges final): {context.Entry(existingProduct).State}&quot;); // Detached (从数据库和跟踪器中移除)</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="更改检测" tabindex="-1"><a class="header-anchor" href="#更改检测"><span>更改检测</span></a></h3><h4 id="快照更改跟踪" tabindex="-1"><a class="header-anchor" href="#快照更改跟踪"><span>快照更改跟踪</span></a></h4><p>这是 EF Core 的<strong>默认行为</strong>，也是最常用的方式。</p><p><strong>工作原理</strong>：当实体被加载到 <code>DbContext</code> 中时，EF Core 会为每个属性的值拍摄一个“快照”（副本）。当调用 <code>SaveChanges()</code> 时，EF Core 会将实体的<strong>当前属性值</strong>与这个<strong>快照值</strong>进行比较。如果发现差异，就认为该属性已被修改，并将实体状态标记为 <code>Modified</code>。</p><p><strong>优点</strong>：</p><ul><li><strong>简单易用</strong>：你只需修改实体属性，EF Core 自动处理检测。</li><li><strong>高效</strong>：对于大多数场景，这种比较是高效的。</li></ul><p><strong>缺点</strong>：</p><ul><li><strong>内存开销</strong>：需要存储所有属性的快照。对于包含大量属性的实体或大量实体实例，可能会有可观的内存开销。</li><li><strong>非及时性</strong>：只有在调用 <code>SaveChanges()</code> 或手动触发更改检测时，才会检测到更改。</li></ul><h4 id="通知更改跟踪" tabindex="-1"><a class="header-anchor" href="#通知更改跟踪"><span>通知更改跟踪</span></a></h4><p>这是一种更高级的模式，适用于需要更精细控制更改检测的场景，通常用于 UI 绑定。</p><p><strong>工作原理</strong>：实体类需要实现 <code>INotifyPropertyChanged</code> 接口。当属性值被设置时，它会触发 <code>PropertyChanged</code> 事件。EF Core 监听这些事件，当事件触发时，立即更新其内部的变更跟踪状态。</p><p><strong>优点</strong>：</p><ul><li><strong>即时性</strong>：更改立即被跟踪。</li><li><strong>更小的内存开销</strong>：不需要存储完整的快照（只需要原始值），因为它通过事件来响应更改。</li></ul><p><strong>缺点</strong>：</p><ul><li><strong>需要修改实体类</strong>：你的实体类需要实现接口并包含属性设置器中的事件触发逻辑。这增加了代码的复杂性。</li><li><strong>性能权衡</strong>：尽管内存开销小，但频繁的事件触发也可能带来额外的 CPU 开销。</li></ul><p><strong>使用方式：</strong></p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">// 启用通知更改跟踪</span>
<span class="line">protected override void OnModelCreating(ModelBuilder modelBuilder)</span>
<span class="line">{</span>
<span class="line">    modelBuilder.Entity&lt;Product&gt;()</span>
<span class="line">        .HasChangeTrackingStrategy(ChangeTrackingStrategy.ChangingAndChangedNotifications);</span>
<span class="line">    // 或者 ChangeTrackingStrategy.ChangingNotifications</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">// 自定义实现INotifyPropertyChanged接口的实体类</span>
<span class="line">using System.ComponentModel;</span>
<span class="line">using System.Runtime.CompilerServices;</span>
<span class="line"></span>
<span class="line">public class Product : INotifyPropertyChanged // 实现接口</span>
<span class="line">{</span>
<span class="line">    private int _id;</span>
<span class="line">    private string _name = string.Empty;</span>
<span class="line">    private decimal _price;</span>
<span class="line"></span>
<span class="line">    public int Id</span>
<span class="line">    {</span>
<span class="line">        get =&gt; _id;</span>
<span class="line">        set</span>
<span class="line">        {</span>
<span class="line">            if (_id != value)</span>
<span class="line">            {</span>
<span class="line">                _id = value;</span>
<span class="line">                OnPropertyChanged(); // 触发事件</span>
<span class="line">            }</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public string Name</span>
<span class="line">    {</span>
<span class="line">        get =&gt; _name;</span>
<span class="line">        set</span>
<span class="line">        {</span>
<span class="line">            if (_name != value)</span>
<span class="line">            {</span>
<span class="line">                _name = value;</span>
<span class="line">                OnPropertyChanged();</span>
<span class="line">            }</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public decimal Price</span>
<span class="line">    {</span>
<span class="line">        get =&gt; _price;</span>
<span class="line">        set</span>
<span class="line">        {</span>
<span class="line">            if (_price != value)</span>
<span class="line">            {</span>
<span class="line">                _price = value;</span>
<span class="line">                OnPropertyChanged();</span>
<span class="line">            }</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    public event PropertyChangedEventHandler? PropertyChanged;</span>
<span class="line"></span>
<span class="line">    protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)</span>
<span class="line">    {</span>
<span class="line">        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="手动触发更改检测" tabindex="-1"><a class="header-anchor" href="#手动触发更改检测"><span>手动触发更改检测</span></a></h4><p>在某些高级场景中，如果你使用了像 <code>AsNoTracking()</code> 这样的方法加载实体，然后又重新附加它们，或者你手动操作了属性值但没有通过 EF Core 默认的跟踪机制，你可能需要手动触发更改检测：</p><ul><li><code>context.ChangeTracker.DetectChanges()</code>：强制 EF Core 立即扫描所有被跟踪实体以查找更改并更新它们的状态。<code>SaveChanges()</code> 在内部会自动调用此方法。</li><li><code>context.Entry(entity).State = EntityState.Modified;</code>：直接设置实体状态。</li></ul><h3 id="访问跟踪器api" tabindex="-1"><a class="header-anchor" href="#访问跟踪器api"><span>访问跟踪器API</span></a></h3><p><code>DbContext.ChangeTracker</code> 属性提供了访问更改跟踪器实例的入口，允许你进行更高级的操作：</p><ul><li><code>context.ChangeTracker.Entries()</code>：获取所有被跟踪实体的 <code>EntityEntry</code> 集合，可以检查它们的当前状态、原始值等。</li><li><code>context.ChangeTracker.HasChanges()</code>：检查是否存在任何待保存的变更。</li><li><code>context.Entry(entity)</code>：获取特定实体的 <code>EntityEntry</code> 对象，从而检查或修改该实体的状态、访问其属性值（当前值、原始值）、标记特定属性为已修改等。</li></ul><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">using Microsoft.EntityFrameworkCore;</span>
<span class="line">using Microsoft.EntityFrameworkCore.ChangeTracking; // 引入此命名空间</span>
<span class="line"></span>
<span class="line">public class Blog</span>
<span class="line">{</span>
<span class="line">    public int Id { get; set; }</span>
<span class="line">    public string Name { get; set; } = string.Empty;</span>
<span class="line">    public string Url { get; set; } = string.Empty;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">public class MyDbContext : DbContext</span>
<span class="line">{</span>
<span class="line">    public DbSet&lt;Blog&gt; Blogs { get; set; } = null!;</span>
<span class="line">    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =&gt;</span>
<span class="line">        optionsBuilder.UseSqlServer(&quot;YourConnectionString&quot;);</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">public async Task DemonstrateChangeTracker()</span>
<span class="line">{</span>
<span class="line">    using (var context = new MyDbContext())</span>
<span class="line">    {</span>
<span class="line">        // 1. 查询实体：它们将处于 Unchanged 状态</span>
<span class="line">        var blog = await context.Blogs.FirstAsync();</span>
<span class="line">        var newBlog = new Blog { Name = &quot;New Blog&quot;, Url = &quot;http://new.blog.com&quot; };</span>
<span class="line"></span>
<span class="line">        // 2. 添加新实体：处于 Added 状态</span>
<span class="line">        context.Blogs.Add(newBlog);</span>
<span class="line"></span>
<span class="line">        // 3. 修改现有实体：将变成 Modified 状态</span>
<span class="line">        blog.Name = &quot;Updated Blog Name&quot;;</span>
<span class="line"></span>
<span class="line">        Console.WriteLine(&quot;--- Before SaveChanges ---&quot;);</span>
<span class="line">        foreach (var entry in context.ChangeTracker.Entries())</span>
<span class="line">        {</span>
<span class="line">            Console.WriteLine($&quot;Entity: {entry.Metadata.DisplayName()}, State: {entry.State}&quot;);</span>
<span class="line">            if (entry.Entity is Blog b)</span>
<span class="line">            {</span>
<span class="line">                Console.WriteLine($&quot;  Id: {b.Id}, Name: {b.Name}&quot;);</span>
<span class="line"></span>
<span class="line">                // 演示获取原始值和当前值</span>
<span class="line">                if (entry.State == EntityState.Modified)</span>
<span class="line">                {</span>
<span class="line">                    Console.WriteLine($&quot;  Original Name: {entry.OriginalValues[nameof(Blog.Name)]}&quot;);</span>
<span class="line">                    Console.WriteLine($&quot;  Current Name: {entry.CurrentValues[nameof(Blog.Name)]}&quot;);</span>
<span class="line">                }</span>
<span class="line">            }</span>
<span class="line">        }</span>
<span class="line">        // Output (类似):</span>
<span class="line">        // Entity: Blog, State: Modified (for &#39;blog&#39; instance)</span>
<span class="line">        // Entity: Blog, State: Added (for &#39;newBlog&#39; instance)</span>
<span class="line"></span>
<span class="line">        await context.SaveChangesAsync();</span>
<span class="line"></span>
<span class="line">        Console.WriteLine(&quot;\\n--- After SaveChanges ---&quot;);</span>
<span class="line">        foreach (var entry in context.ChangeTracker.Entries())</span>
<span class="line">        {</span>
<span class="line">            Console.WriteLine($&quot;Entity: {entry.Metadata.DisplayName()}, State: {entry.State}&quot;);</span>
<span class="line">            // Output (类似):</span>
<span class="line">            // Entity: Blog, State: Unchanged (for both blog and newBlog instances)</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="标识解析" tabindex="-1"><a class="header-anchor" href="#标识解析"><span>标识解析</span></a></h3><p>标识解析是 EF Core <strong>变更跟踪器</strong>的一个关键功能，它确保在任何给定 <code>DbContext</code> 实例的生命周期内，对于同一个数据库实体（由其主键唯一标识），<strong>始终只有一个 CLR 对象实例被跟踪</strong>。</p><p>假设现在从数据库中查询了 ID 为 1 的 <code>Product</code>。然后，在同一个 <code>DbContext</code> 实例中，你再次查询了 ID 为 1 的 <code>Product</code>：</p><ul><li><strong>没有标识解析</strong>：如果你得到的是两个独立的 <code>Product</code> 对象实例，即使它们都代表数据库中的同一行，但在内存中它们是不同的对象。如果你修改了其中一个，另一个将不会反映这些修改，并且在 <code>SaveChanges()</code> 时可能会导致混乱或错误。</li><li><strong>有了标识解析 (EF Core 的默认行为)</strong>：当你第二次查询 ID 为 1 的 <code>Product</code> 时，EF Core 会识别出它已经在内部跟踪器中有了这个实体的实例。它不会再从数据库中创建一个新的实例，而是<strong>返回它已经在跟踪的那个现有实例</strong>。</li></ul><p>这就是<strong>标识解析</strong>：EF Core 确保它在内存中维护着数据库实体的唯一表示。</p><h4 id="工作原理" tabindex="-1"><a class="header-anchor" href="#工作原理"><span>工作原理</span></a></h4><p>EF Core 的标识解析主要依赖于实体的主键。</p><ol><li><strong>缓存 (Cache)</strong>：<code>DbContext</code> 内部维护一个“身份映射”或“缓存”，它存储了每个被跟踪实体的主键与其实例的映射关系。</li><li><strong>查询结果处理</strong>：当 EF Core 执行一个查询并将数据从数据库加载到内存时： <ul><li>它首先检查缓存中是否已经存在一个具有相同主键的实体实例。</li><li><strong>如果存在</strong>：EF Core 不会创建新的实例。它会使用缓存中的现有实例，并根据数据库中的最新数据更新该实例的属性（如果存在并发冲突，则按并发处理规则进行）。</li><li><strong>如果不存在</strong>：EF Core 会创建一个新的实体实例，并将其添加到缓存和变更跟踪器中。</li></ul></li></ol><p>示例：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public class Author</span>
<span class="line">{</span>
<span class="line">    public int Id { get; set; }</span>
<span class="line">    public string Name { get; set; } = string.Empty;</span>
<span class="line">    public ICollection&lt;Book&gt; Books { get; set; } = new List&lt;Book&gt;();</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">public class Book</span>
<span class="line">{</span>
<span class="line">    public int Id { get; set; }</span>
<span class="line">    public string Title { get; set; } = string.Empty;</span>
<span class="line">    public int AuthorId { get; set; }</span>
<span class="line">    public Author Author { get; set; } = null!;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">public class MyDbContext : DbContext</span>
<span class="line">{</span>
<span class="line">    public DbSet&lt;Author&gt; Authors { get; set; } = null!;</span>
<span class="line">    public DbSet&lt;Book&gt; Books { get; set; } = null!;</span>
<span class="line"></span>
<span class="line">    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =&gt;</span>
<span class="line">        optionsBuilder.UseSqlServer(&quot;YourConnectionString&quot;);</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">public async Task DemonstrateIdentityResolution()</span>
<span class="line">{</span>
<span class="line">    using (var context = new MyDbContext())</span>
<span class="line">    {</span>
<span class="line">        // 确保数据库中有 Author (Id=1) 和 Book (Id=1)</span>
<span class="line">        // 假设 Author 1 是 &quot;Author A&quot;, Book 1 是 &quot;Book X&quot; 且属于 Author A</span>
<span class="line"></span>
<span class="line">        // 第一次查询：加载 Author 1</span>
<span class="line">        var author1_first = await context.Authors.FirstOrDefaultAsync(a =&gt; a.Id == 1);</span>
<span class="line">        if (author1_first != null)</span>
<span class="line">        {</span>
<span class="line">            Console.WriteLine($&quot;First loaded Author: {author1_first.Name}&quot;); // Output: Author A</span>
<span class="line">            author1_first.Name = &quot;Updated Author A&quot;; // 修改实体</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        // 第二次查询：再次加载 Author 1 (在同一个 DbContext 实例中)</span>
<span class="line">        var author1_second = await context.Authors.FirstOrDefaultAsync(a =&gt; a.Id == 1);</span>
<span class="line">        if (author1_second != null)</span>
<span class="line">        {</span>
<span class="line">            // 验证：两个变量是否引用同一个对象实例？</span>
<span class="line">            Console.WriteLine($&quot;Are author1_first and author1_second the same object? {ReferenceEquals(author1_first, author1_second)}&quot;);</span>
<span class="line">            // Output: True</span>
<span class="line"></span>
<span class="line">            // 验证：第二次查询到的 Name 是否是第一次修改后的值？</span>
<span class="line">            Console.WriteLine($&quot;Second loaded Author&#39;s Name: {author1_second.Name}&quot;); // Output: Updated Author A</span>
<span class="line">            // 是的，因为它们是同一个对象，修改在一个地方会反映在另一个地方。</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        // 查询 Book 1，同时 Include 它的 Author</span>
<span class="line">        var book1 = await context.Books.Include(b =&gt; b.Author).FirstOrDefaultAsync(b =&gt; b.Id == 1);</span>
<span class="line">        if (book1 != null)</span>
<span class="line">        {</span>
<span class="line">            Console.WriteLine($&quot;Book&#39;s Author Name: {book1.Author.Name}&quot;); // Output: Updated Author A</span>
<span class="line">            // Book.Author 导航属性指向的也是第一次查询并修改过的那个 Author 实例。</span>
<span class="line">            Console.WriteLine($&quot;Is book1.Author the same as author1_first? {ReferenceEquals(book1.Author, author1_first)}&quot;);</span>
<span class="line">            // Output: True</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        // 如果此时调用 SaveChangesAsync()，只会根据 author1_first 的修改生成一条 UPDATE 语句。</span>
<span class="line">        await context.SaveChangesAsync();</span>
<span class="line">        Console.WriteLine(&quot;Changes saved.&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="发生的时机" tabindex="-1"><a class="header-anchor" href="#发生的时机"><span>发生的时机</span></a></h4><p>标识解析发生在以下情况：</p><ul><li><strong>执行查询并加载实体时</strong>（除了 <code>AsNoTracking()</code> 查询）。</li><li><strong>通过导航属性加载相关实体时</strong>（例如，<code>Include()</code> 或延迟加载）。</li><li><strong>手动附加实体时</strong>（例如 <code>DbContext.Add()</code>, <code>DbContext.Attach()</code>, <code>DbContext.Update()</code>）。如果尝试附加一个主键与现有跟踪实体相同的新实体，EF Core 会抛出异常（除非你先分离旧的，或用 <code>Update()</code> 尝试合并）。</li></ul><h3 id="附加的变更跟踪功能" tabindex="-1"><a class="header-anchor" href="#附加的变更跟踪功能"><span>附加的变更跟踪功能</span></a></h3><h4 id="add与addasync" tabindex="-1"><a class="header-anchor" href="#add与addasync"><span>Add与AddAsync</span></a></h4><p>**功能：**在功能上是等效的。它们都将实体标记为 <code>Added</code> 状态，以便在调用 <code>SaveChanges()</code> 时进行插入。</p><p><strong>执行方式</strong>：</p><ul><li><code>Add()</code> 是<strong>同步</strong>的，会阻塞调用线程。</li><li><code>AddAsync()</code> 是<strong>异步</strong>的，不会阻塞调用线程，更适合 I/O 密集型或并发高的场景。</li></ul><h4 id="addrange、updaterange、attachrange、removerange" tabindex="-1"><a class="header-anchor" href="#addrange、updaterange、attachrange、removerange"><span>AddRange、UpdateRange、AttachRange、RemoveRange</span></a></h4><h5 id="addrange" tabindex="-1"><a class="header-anchor" href="#addrange"><span>AddRange</span></a></h5><p><code>AddRange()</code> 方法用于将<strong>一个集合中所有新的实体实例</strong>添加到 <code>DbContext</code> 的变更跟踪器中。每个实体都会被标记为 <code>Added</code> 状态，以便在下次调用 <code>SaveChanges()</code> 时被插入到数据库中。</p><p><strong>语法：</strong></p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public virtual void AddRange (params object[] entities); // 接受可变参数</span>
<span class="line">public virtual void AddRange (IEnumerable&lt;object&gt; entities); // 接受 IEnumerable&lt;T&gt;</span>
<span class="line">// 也可以在 DbSet&lt;TEntity&gt; 上调用，类型更安全</span>
<span class="line">public virtual void AddRange (params TEntity[] entities);</span>
<span class="line">public virtual void AddRange (IEnumerable&lt;TEntity&gt; entities);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>示例：</strong></p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">using Microsoft.EntityFrameworkCore;</span>
<span class="line">using System.Collections.Generic;</span>
<span class="line"></span>
<span class="line">public class MyEntity</span>
<span class="line">{</span>
<span class="line">    public int Id { get; set; }</span>
<span class="line">    public string Name { get; set; } = string.Empty;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">public class MyDbContext : DbContext</span>
<span class="line">{</span>
<span class="line">    public DbSet&lt;MyEntity&gt; MyEntities { get; set; } = null!;</span>
<span class="line">    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =&gt;</span>
<span class="line">        optionsBuilder.UseSqlServer(&quot;YourConnectionString&quot;);</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">public async Task AddMultipleEntities()</span>
<span class="line">{</span>
<span class="line">    using (var context = new MyDbContext())</span>
<span class="line">    {</span>
<span class="line">        var entitiesToAdd = new List&lt;MyEntity&gt;</span>
<span class="line">        {</span>
<span class="line">            new MyEntity { Name = &quot;Entity 1&quot; },</span>
<span class="line">            new MyEntity { Name = &quot;Entity 2&quot; },</span>
<span class="line">            new MyEntity { Name = &quot;Entity 3&quot; }</span>
<span class="line">        };</span>
<span class="line"></span>
<span class="line">        // 批量添加实体</span>
<span class="line">        context.MyEntities.AddRange(entitiesToAdd);</span>
<span class="line"></span>
<span class="line">        // 此时所有实体都处于 &#39;Added&#39; 状态</span>
<span class="line">        foreach (var entity in entitiesToAdd)</span>
<span class="line">        {</span>
<span class="line">            Console.WriteLine($&quot;Entity &#39;{entity.Name}&#39; state: {context.Entry(entity).State}&quot;);</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        await context.SaveChangesAsync();</span>
<span class="line">        Console.WriteLine($&quot;{entitiesToAdd.Count} entities added to database.&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p><code>AddRange()</code> 会为集合中的每个实体执行 <code>Add()</code> 相同的逻辑，即根据主键的默认值判断是否为新实体。</p><p>与 <code>Add()</code> 一样，<code>AddRange()</code> 本身不直接与数据库交互，只是更新内存中的实体状态。</p></blockquote><hr><p>与 <code>Add()</code> 和 <code>AddAsync()</code> 的关系类似，EF Core 也为 <code>AddRange</code> 提供了异步版本：<code>AddRangeAsync()</code>。</p><p><strong><code>AddRangeAsync()</code></strong>：用于异步地将多个实体添加到变更跟踪器中。与 <code>AddRange()</code> 相比，它在底层可能涉及一些异步 I/O 优化，但核心功能是将实体标记为 <code>Added</code>。在现代异步编程模型中，如果你的代码需要异步地添加大量实体，或者你在并发环境中操作，推荐使用此版本。</p><p>目前，EF Core 没有 <code>UpdateRangeAsync</code>、<code>AttachRangeAsync</code> 和 <code>RemoveRangeAsync</code>。这是因为 <code>UpdateRange</code>、<code>AttachRange</code> 和 <code>RemoveRange</code> 这些操作主要是在<strong>内存中</strong>对变更跟踪器进行操作，它们本身不涉及直接的数据库 I/O（真正的 I/O 发生在 <code>SaveChanges()</code> / <code>SaveChangesAsync()</code> 时）。因此，这些方法通常不需要异步版本。</p><h5 id="updaterange" tabindex="-1"><a class="header-anchor" href="#updaterange"><span>UpdateRange</span></a></h5><p><code>UpdateRange()</code> 方法用于将<strong>一个集合中的多个实体实例</strong>附加到 <code>DbContext</code> 中，并尝试推断它们的生命周期状态。它会递归遍历实体图（如果导航属性已加载），并尝试将实体标记为 <code>Added</code> 或 <code>Modified</code>。</p><p><strong>语法：</strong></p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public virtual void UpdateRange (params object[] entities);</span>
<span class="line">public virtual void UpdateRange (IEnumerable&lt;object&gt; entities);</span>
<span class="line">// 也可以在 DbSet&lt;TEntity&gt; 上调用</span>
<span class="line">public virtual void UpdateRange (params TEntity[] entities);</span>
<span class="line">public virtual void UpdateRange (IEnumerable&lt;TEntity&gt; entities);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>示例：</strong></p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public async Task UpdateMultipleEntities()</span>
<span class="line">{</span>
<span class="line">    using (var context = new MyDbContext())</span>
<span class="line">    {</span>
<span class="line">        // 假设数据库中已有 MyEntity 101, 102</span>
<span class="line">        // 创建一个包含修改的现有实体和新实体的列表</span>
<span class="line">        var entitiesToProcess = new List&lt;MyEntity&gt;</span>
<span class="line">        {</span>
<span class="line">            new MyEntity { Id = 101, Name = &quot;Updated Entity 101&quot; }, // 现有实体，被修改</span>
<span class="line">            new MyEntity { Id = 102, Name = &quot;Updated Entity 102&quot; }, // 现有实体，被修改</span>
<span class="line">            new MyEntity { Name = &quot;New Entity 4&quot; } // 全新实体</span>
<span class="line">        };</span>
<span class="line"></span>
<span class="line">        // 批量更新或添加实体</span>
<span class="line">        // 对于 Id &gt; 0 的实体，EF Core 会尝试将其标记为 Modified</span>
<span class="line">        // 对于 Id = 0 的实体，EF Core 会将其标记为 Added</span>
<span class="line">        context.MyEntities.UpdateRange(entitiesToProcess);</span>
<span class="line"></span>
<span class="line">        foreach (var entity in entitiesToProcess)</span>
<span class="line">        {</span>
<span class="line">            Console.WriteLine($&quot;Entity &#39;{entity.Name}&#39; (Id: {entity.Id}) state: {context.Entry(entity).State}&quot;);</span>
<span class="line">        }</span>
<span class="line">        // Output:</span>
<span class="line">        // Entity &#39;Updated Entity 101&#39; (Id: 101) state: Modified</span>
<span class="line">        // Entity &#39;Updated Entity 102&#39; (Id: 102) state: Modified</span>
<span class="line">        // Entity &#39;New Entity 4&#39; (Id: 0) state: Added</span>
<span class="line"></span>
<span class="line">        await context.SaveChangesAsync();</span>
<span class="line">        Console.WriteLine($&quot;{entitiesToProcess.Count} entities processed (updated/added).&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p><strong><code>UpdateRange()</code> 的行为与 <code>Update()</code> 类似</strong>：它会尝试推断实体是 <code>Added</code> 还是 <code>Modified</code>。如果实体的主键有非默认值，它会被标记为 <code>Modified</code>；如果主键是默认值（通常是 <code>0</code>），它会被标记为 <code>Added</code>。</p><p><strong>所有属性标记为修改</strong>：与 <code>Update()</code> 一样，如果实体被标记为 <code>Modified</code>，那么它的所有属性都将被标记为已修改，即使它们实际上没有变化。这可能导致生成包含所有列的 <code>UPDATE</code> 语句。</p><p><strong>处理断开连接的图</strong>：<code>UpdateRange()</code> 可以递归地处理导航属性中的相关实体（如果这些实体也已加载并包含在图中）。它会根据主键自动推断这些相关子实体的状态。</p><p><strong>不会自动处理删除</strong>：<code>UpdateRange()</code> 不会自动检测并删除那些在传入集合中不存在，但在数据库中仍然存在的子实体。你需要手动处理这类删除操作（例如，加载旧的图并进行比较）。</p></blockquote><h5 id="attachrange" tabindex="-1"><a class="header-anchor" href="#attachrange"><span>AttachRange</span></a></h5><p><code>AttachRange()</code> 方法用于将<strong>一个集合中的多个实体实例</strong>附加到 <code>DbContext</code> 的变更跟踪器中。默认情况下，这些实体会被标记为 <strong><code>Unchanged</code></strong> 状态。</p><p><strong>语法</strong></p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public virtual void AttachRange (params object[] entities);</span>
<span class="line">public virtual void void AttachRange (IEnumerable&lt;object&gt; entities);</span>
<span class="line">// 也可以在 DbSet&lt;TEntity&gt; 上调用</span>
<span class="line">public virtual void AttachRange (params TEntity[] entities);</span>
<span class="line">public virtual void AttachRange (IEnumerable&lt;TEntity&gt; entities);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>示例</strong></p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public async Task AttachMultipleEntities()</span>
<span class="line">{</span>
<span class="line">    using (var context = new MyDbContext())</span>
<span class="line">    {</span>
<span class="line">        // 假设从外部源（如缓存、API）获取了这些实体，它们是断开连接的</span>
<span class="line">        var disconnectedEntities = new List&lt;MyEntity&gt;</span>
<span class="line">        {</span>
<span class="line">            new MyEntity { Id = 103, Name = &quot;Existing Entity 103&quot; },</span>
<span class="line">            new MyEntity { Id = 104, Name = &quot;Existing Entity 104&quot; }</span>
<span class="line">        };</span>
<span class="line"></span>
<span class="line">        // 批量附加实体。它们都会被标记为 &#39;Unchanged&#39;。</span>
<span class="line">        context.MyEntities.AttachRange(disconnectedEntities);</span>
<span class="line"></span>
<span class="line">        foreach (var entity in disconnectedEntities)</span>
<span class="line">        {</span>
<span class="line">            Console.WriteLine($&quot;Entity &#39;{entity.Name}&#39; (Id: {entity.Id}) state: {context.Entry(entity).State}&quot;);</span>
<span class="line">        }</span>
<span class="line">        // Output:</span>
<span class="line">        // Entity &#39;Existing Entity 103&#39; (Id: 103) state: Unchanged</span>
<span class="line">        // Entity &#39;Existing Entity 104&#39; (Id: 104) state: Unchanged</span>
<span class="line"></span>
<span class="line">        // 如果你随后修改了这些实体的属性，它们的状??态会变为 &#39;Modified&#39;</span>
<span class="line">        disconnectedEntities[0].Name = &quot;Modified Entity 103&quot;;</span>
<span class="line">        context.ChangeTracker.DetectChanges(); // 手动检测，或在 SaveChanges() 时自动检测</span>
<span class="line">        Console.WriteLine($&quot;Entity &#39;{disconnectedEntities[0].Name}&#39; state after modification: {context.Entry(disconnectedEntities[0]).State}&quot;); // Modified</span>
<span class="line"></span>
<span class="line">        await context.SaveChangesAsync();</span>
<span class="line">        Console.WriteLine($&quot;{disconnectedEntities.Count} entities attached and processed (if modified).&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>使用场景：</strong></p><ul><li><strong>重新附加现有实体</strong>：当你有一个或多个从 <code>DbContext</code> 外部获取的实体，并且你知道它们已经存在于数据库中，并且你希望它们被跟踪（通常是为了后续修改或删除）。</li><li><strong>手动控制状态</strong>：<code>AttachRange()</code> 是设置实体状态的基础。附加后，你可以通过 <code>Entry(entity).State = EntityState.Modified/Deleted</code> 来手动设置它们的状态。</li></ul><h5 id="removerange" tabindex="-1"><a class="header-anchor" href="#removerange"><span>RemoveRange</span></a></h5><p>该方法用于将<strong>一个集合中的所有实体实例</strong>标记为 <code>Deleted</code> 状态，以便在下次调用 <code>SaveChanges()</code> 时从数据库中删除它们。</p><p><strong>语法：</strong></p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public virtual void RemoveRange (params object[] entities);</span>
<span class="line">public virtual void void RemoveRange (IEnumerable&lt;object&gt; entities);</span>
<span class="line">// 也可以在 DbSet&lt;TEntity&gt; 上调用</span>
<span class="line">public virtual void RemoveRange (params TEntity[] entities);</span>
<span class="line">public virtual void RemoveRange (IEnumerable&lt;TEntity&gt; entities);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>示例：</strong></p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public async Task RemoveMultipleEntities()</span>
<span class="line">{</span>
<span class="line">    using (var context = new MyDbContext())</span>
<span class="line">    {</span>
<span class="line">        // 假设我们想删除 Id 为 105 和 106 的实体</span>
<span class="line">        // 我们可以创建只包含 Id 的存根实体</span>
<span class="line">        var entitiesToRemove = new List&lt;MyEntity&gt;</span>
<span class="line">        {</span>
<span class="line">            new MyEntity { Id = 105 },</span>
<span class="line">            new MyEntity { Id = 106 }</span>
<span class="line">        };</span>
<span class="line"></span>
<span class="line">        // 批量移除实体。它们会被标记为 &#39;Deleted&#39;。</span>
<span class="line">        // 对于这些没有被跟踪的实体，RemoveRange 内部会先 Attach() 它们，然后标记为 Deleted。</span>
<span class="line">        context.MyEntities.RemoveRange(entitiesToRemove);</span>
<span class="line"></span>
<span class="line">        foreach (var entity in entitiesToRemove)</span>
<span class="line">        {</span>
<span class="line">            Console.WriteLine($&quot;Entity with Id {entity.Id} state: {context.Entry(entity).State}&quot;);</span>
<span class="line">        }</span>
<span class="line">        // Output:</span>
<span class="line">        // Entity with Id 105 state: Deleted</span>
<span class="line">        // Entity with Id 106 state: Deleted</span>
<span class="line"></span>
<span class="line">        await context.SaveChangesAsync();</span>
<span class="line">        Console.WriteLine($&quot;{entitiesToRemove.Count} entities deleted from database.&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p><strong>级联删除</strong>：<code>RemoveRange()</code> 会触发在 EF Core 模型中配置的级联删除行为（例如 <code>DeleteBehavior.Cascade</code>）。</p><p><strong>无需加载整个实体</strong>：与 <code>Remove()</code> 类似，你不需要加载整个实体才能删除它。提供一个只包含主键的实体实例即可。</p></blockquote><h3 id="跟踪查询vs不跟踪查询" tabindex="-1"><a class="header-anchor" href="#跟踪查询vs不跟踪查询"><span>跟踪查询VS不跟踪查询</span></a></h3><p><strong>跟踪查询 (Tracking Queries)</strong>：默认行为。当你使用 <code>context.DbSet.Where(...).ToList()</code> 等方法时，EF Core 会将查询结果加载到内存中，并将其附加到 <code>DbContext</code> 的变更跟踪器中。这些实体是<strong>被跟踪的</strong>，你可以修改它们并调用 <code>SaveChanges()</code> 来持久化更改。</p><p><strong>无跟踪查询 (No-Tracking Queries)</strong>：使用 <code>.AsNoTracking()</code> 扩展方法。EF Core 不会将查询结果附加到变更跟踪器中。这些实体是<strong>分离的 (<code>Detached</code>)</strong>。</p><ul><li><strong>优点</strong>：性能更高，内存消耗更少，因为不需要创建快照和管理状态。</li><li><strong>缺点</strong>：你不能直接修改这些实体并调用 <code>SaveChanges()</code> 来保存更改。如果你需要保存更改，必须手动将它们附加或更新到 <code>DbContext</code>。</li><li><strong>适用场景</strong>：只读操作（例如，显示数据、生成报告），或者当你处理断开连接实体时（先加载为无跟踪，再手动附加/更新）。</li></ul><p>示例：AsNoTracking()</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public async Task DemonstrateNoTracking()</span>
<span class="line">{</span>
<span class="line">    using (var context = new MyDbContext())</span>
<span class="line">    {</span>
<span class="line">        // 跟踪查询 (默认)</span>
<span class="line">        var trackedProduct = await context.Products.FirstAsync();</span>
<span class="line">        trackedProduct.Name = &quot;Updated Tracked Product&quot;; // 这个修改会被跟踪</span>
<span class="line"></span>
<span class="line">        // 无跟踪查询</span>
<span class="line">        var noTrackedProduct = await context.Products.AsNoTracking().FirstOrDefaultAsync();</span>
<span class="line">        if (noTrackedProduct != null)</span>
<span class="line">        {</span>
<span class="line">            noTrackedProduct.Name = &quot;Updated No-Tracked Product&quot;; // 这个修改不会被跟踪</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        Console.WriteLine($&quot;HasChanges after modification: {context.ChangeTracker.HasChanges()}&quot;); // True (只因为 trackedProduct 的修改)</span>
<span class="line">        await context.SaveChangesAsync(); // 只会保存 trackedProduct 的修改</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,92)]))}const o=s(l,[["render",d]]),p=JSON.parse('{"path":"/dotnet/ef%20core/change%20track.html","title":"更改跟踪","lang":"zh-CN","frontmatter":{"title":"更改跟踪","shortTitle":"更改跟踪","description":"更改跟踪","date":"2025-07-16T07:54:33.000Z","categories":[".NET","EF CORE"],"tags":[".NET"],"order":7},"git":{"createdTime":1752623814000,"updatedTime":1753195075000,"contributors":[{"name":"Okita1027","username":"Okita1027","email":"96156298+Okita1027@users.noreply.github.com","commits":5,"url":"https://github.com/Okita1027"}]},"readingTime":{"minutes":17.04,"words":5112},"filePathRelative":"dotnet/ef core/change track.md"}');export{o as comp,p as data};
