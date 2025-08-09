import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as e,d as a,o as i}from"./app-CN29avzT.js";const l={};function d(c,n){return i(),e("div",null,n[0]||(n[0]=[a(`<h2 id="保存数据" tabindex="-1"><a class="header-anchor" href="#保存数据"><span>保存数据</span></a></h2><h3 id="基本保存" tabindex="-1"><a class="header-anchor" href="#基本保存"><span>基本保存</span></a></h3><p>EF Core 使用 <strong>变更追踪器</strong>（Change Tracker）来检测实体的状态变化，然后生成对应的 SQL 语句执行数据操作。</p><p>实体的 5 种状态：</p><table><thead><tr><th>状态</th><th>说明</th></tr></thead><tbody><tr><td><code>Added</code></td><td>新增，<code>SaveChanges()</code> 时插入</td></tr><tr><td><code>Modified</code></td><td>修改，生成 <code>UPDATE</code></td></tr><tr><td><code>Deleted</code></td><td>删除，生成 <code>DELETE</code></td></tr><tr><td><code>Unchanged</code></td><td>未更改，不执行 SQL</td></tr><tr><td><code>Detached</code></td><td>未被上下文跟踪</td></tr></tbody></table><h4 id="添加数据" tabindex="-1"><a class="header-anchor" href="#添加数据"><span>添加数据</span></a></h4><p>要将新实体添加到数据库中，你需要：</p><ol><li>创建新的实体实例。</li><li>将该实体添加到 <code>DbContext</code> 的相应 <code>DbSet</code> 中。</li><li>调用 <code>SaveChanges()</code>。</li></ol><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public class Blog</span>
<span class="line">{</span>
<span class="line">    public int Id { get; set; }</span>
<span class="line">    public string Name { get; set; } = string.Empty;</span>
<span class="line">    public string Url { get; set; } = string.Empty;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">public class MyDbContext : DbContext</span>
<span class="line">{</span>
<span class="line">    public DbSet&lt;Blog&gt; Blogs { get; set; } = null!;</span>
<span class="line"></span>
<span class="line">    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)</span>
<span class="line">    {</span>
<span class="line">        optionsBuilder.UseSqlServer(&quot;YourConnectionString&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">public async Task AddNewBlog()</span>
<span class="line">{</span>
<span class="line">    using (var context = new MyDbContext())</span>
<span class="line">    {</span>
<span class="line">        // 1. 创建新的 Blog 实例</span>
<span class="line">        var newBlog = new Blog</span>
<span class="line">        {</span>
<span class="line">            Name = &quot;My Awesome Blog&quot;,</span>
<span class="line">            Url = &quot;https://www.myawesomeblog.com&quot;</span>
<span class="line">        };</span>
<span class="line"></span>
<span class="line">        // 2. 将实体添加到 DbSet。此时，实体状态被标记为 &#39;Added&#39;</span>
<span class="line">        context.Blogs.Add(newBlog);</span>
<span class="line">        // 或者使用 context.Add(newBlog); - 泛型方法，会自动识别 DbSet</span>
<span class="line"></span>
<span class="line">        // 3. 调用 SaveChanges() 将变更持久化到数据库</span>
<span class="line">        // EF Core 会生成 INSERT INTO Blogs (...) VALUES (...) SQL</span>
<span class="line">        await context.SaveChangesAsync();</span>
<span class="line"></span>
<span class="line">        Console.WriteLine($&quot;New Blog Added with ID: {newBlog.Id}&quot;);</span>
<span class="line">        // 实体被保存后，EF Core 会从数据库中填充其生成的主键 (如 Id)</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><code>Add()</code> 方法将实体添加到变更跟踪器中，并将其状态设置为 <code>Added</code>。</li><li><code>SaveChangesAsync()</code> 执行数据库操作。如果实体的主键是数据库自动生成的（如自增长 ID），在 <code>SaveChangesAsync()</code> 成功执行后，该主键的值会被填充到实体实例中。</li></ul><h4 id="修改数据" tabindex="-1"><a class="header-anchor" href="#修改数据"><span>修改数据</span></a></h4><p>要修改数据库中的现有实体，你需要：</p><ol><li>从数据库中<strong>查询并加载</strong>要修改的实体（这通常会使实体被 <code>DbContext</code> 跟踪）。</li><li>直接修改该实体的属性。</li><li>调用 <code>SaveChanges()</code>。</li></ol><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public async Task UpdateBlogName(int blogId, string newName)</span>
<span class="line">{</span>
<span class="line">    using (var context = new MyDbContext())</span>
<span class="line">    {</span>
<span class="line">        // 1. 查询并加载要修改的 Blog。它现在被 DbContext 跟踪，状态为 &#39;Unchanged&#39;。</span>
<span class="line">        var blogToUpdate = await context.Blogs.FirstOrDefaultAsync(b =&gt; b.Id == blogId);</span>
<span class="line"></span>
<span class="line">        if (blogToUpdate != null)</span>
<span class="line">        {</span>
<span class="line">            // 2. 修改属性。此时，DbContext 的变更跟踪器会检测到变化，</span>
<span class="line">            // 并将实体状态从 &#39;Unchanged&#39; 变为 &#39;Modified&#39;。</span>
<span class="line">            blogToUpdate.Name = newName;</span>
<span class="line"></span>
<span class="line">            // 3. 调用 SaveChanges()</span>
<span class="line">            // EF Core 会生成 UPDATE Blogs SET Name = @newName WHERE Id = @blogId SQL</span>
<span class="line">            await context.SaveChangesAsync();</span>
<span class="line">            Console.WriteLine($&quot;Blog {blogId} name updated to &#39;{newName}&#39;&quot;);</span>
<span class="line">        }</span>
<span class="line">        else</span>
<span class="line">        {</span>
<span class="line">            Console.WriteLine($&quot;Blog with ID {blogId} not found.&quot;);</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="未跟踪实体的修改" tabindex="-1"><a class="header-anchor" href="#未跟踪实体的修改"><span>未跟踪实体的修改</span></a></h4><p>如果你有一个实体，它不是通过当前 <code>DbContext</code> 实例加载的（例如，从 API 接收，或从另一个 <code>DbContext</code> 实例加载并传递过来的），那么它是一个<strong>未跟踪实体 (Disconnected Entity)</strong>。要保存对它的修改，你需要手动将其附加到 <code>DbContext</code> 并标记为 <code>Modified</code>。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public async Task UpdateDisconnectedBlog(Blog disconnectedBlog)</span>
<span class="line">{</span>
<span class="line">    using (var context = new MyDbContext())</span>
<span class="line">    {</span>
<span class="line">        // 1. 将未跟踪实体附加到 DbContext，并将其状态标记为 &#39;Modified&#39;。</span>
<span class="line">        // EF Core 此时会跟踪这个实体，并认为它的所有属性都可能被修改。</span>
<span class="line">        context.Attach(disconnectedBlog).State = EntityState.Modified;</span>
<span class="line"></span>
<span class="line">        // 如果你只知道部分属性被修改，并且想避免更新所有属性，</span>
<span class="line">        // 可以只标记特定属性为 Modified：</span>
<span class="line">        // context.Entry(disconnectedBlog).Property(b =&gt; b.Name).IsModified = true;</span>
<span class="line">        // context.Entry(disconnectedBlog).Property(b =&gt; b.Url).IsModified = true;</span>
<span class="line"></span>
<span class="line">        // 2. 调用 SaveChanges()</span>
<span class="line">        // EF Core 会根据标记的属性生成 UPDATE SQL。</span>
<span class="line">        await context.SaveChangesAsync();</span>
<span class="line">        Console.WriteLine($&quot;Disconnected Blog {disconnectedBlog.Id} updated.&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><code>Attach()</code> 通常用于将一个已知存在的实体附加到跟踪器中。</li><li><code>Update()</code> 方法（EF Core 3.0+）可以简化未跟踪实体的更新。它会尝试将实体附加到跟踪器，如果已存在相同主键的实体，则更新其属性；否则，将其标记为 <code>Modified</code>。</li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">context.Update(disconnectedBlog); // 更简洁，等同于 Attach(entity).State = Modified;</span>
<span class="line">await context.SaveChangesAsync();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="删除数据" tabindex="-1"><a class="header-anchor" href="#删除数据"><span>删除数据</span></a></h4><p>要从数据库中删除一个实体，你需要：</p><ol><li>从数据库中<strong>查询并加载</strong>要删除的实体。</li><li>将该实体从 <code>DbSet</code> 中移除。</li><li>调用 <code>SaveChanges()</code>。</li></ol><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public async Task DeleteBlog(int blogId)</span>
<span class="line">{</span>
<span class="line">    using (var context = new MyDbContext())</span>
<span class="line">    {</span>
<span class="line">        // 1. 查询并加载要删除的 Blog。它现在被 DbContext 跟踪。</span>
<span class="line">        var blogToDelete = await context.Blogs.FirstOrDefaultAsync(b =&gt; b.Id == blogId);</span>
<span class="line"></span>
<span class="line">        if (blogToDelete != null)</span>
<span class="line">        {</span>
<span class="line">            // 2. 将实体从 DbSet 中移除。此时，实体状态被标记为 &#39;Deleted&#39;。</span>
<span class="line">            context.Blogs.Remove(blogToDelete);</span>
<span class="line">            // 或者使用 context.Remove(blogToDelete); - 泛型方法</span>
<span class="line"></span>
<span class="line">            // 3. 调用 SaveChanges()</span>
<span class="line">            // EF Core 会生成 DELETE FROM Blogs WHERE Id = @blogId SQL</span>
<span class="line">            await context.SaveChangesAsync();</span>
<span class="line">            Console.WriteLine($&quot;Blog {blogId} deleted.&quot;);</span>
<span class="line">        }</span>
<span class="line">        else</span>
<span class="line">        {</span>
<span class="line">            Console.WriteLine($&quot;Blog with ID {blogId} not found.&quot;);</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h4 id="savechanges批量保存" tabindex="-1"><a class="header-anchor" href="#savechanges批量保存"><span><code>SaveChanges</code>批量保存</span></a></h4><p><code>SaveChanges()</code> 的一个强大之处在于，它会<strong>批量处理</strong>所有待定的变更（添加、修改、删除），并尝试在<strong>一个数据库事务</strong>中执行它们。这意味着如果其中任何一个操作失败，整个事务都会回滚，从而保持数据库的一致性。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public async Task PerformMultipleOperations()</span>
<span class="line">{</span>
<span class="line">    using (var context = new MyDbContext())</span>
<span class="line">    {</span>
<span class="line">        // 添加一个新博客</span>
<span class="line">        var newBlog = new Blog { Name = &quot;New Blog&quot;, Url = &quot;https://newblog.com&quot; };</span>
<span class="line">        context.Blogs.Add(newBlog);</span>
<span class="line"></span>
<span class="line">        // 修改一个现有博客</span>
<span class="line">        var existingBlog = await context.Blogs.FirstOrDefaultAsync(b =&gt; b.Name == &quot;My Awesome Blog&quot;);</span>
<span class="line">        if (existingBlog != null)</span>
<span class="line">        {</span>
<span class="line">            existingBlog.Name = &quot;My Updated Awesome Blog&quot;;</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        // 删除一个博客</span>
<span class="line">        var blogToDelete = await context.Blogs.FirstOrDefaultAsync(b =&gt; b.Name == &quot;Blog to Delete&quot;);</span>
<span class="line">        if (blogToDelete != null)</span>
<span class="line">        {</span>
<span class="line">            context.Blogs.Remove(blogToDelete);</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        // 一次性保存所有变更</span>
<span class="line">        // EF Core 会在后台生成多个 INSERT/UPDATE/DELETE 语句，并在一个事务中执行</span>
<span class="line">        await context.SaveChangesAsync();</span>
<span class="line">        Console.WriteLine(&quot;All pending changes saved successfully.&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="小结" tabindex="-1"><a class="header-anchor" href="#小结"><span>小结</span></a></h4><ul><li>所有变更都通过 <strong><code>DbContext</code> 的变更跟踪器</strong>进行管理。</li><li>使用 <strong><code>DbSet.Add()</code></strong> 添加新实体，状态变为 <code>Added</code>。</li><li>通过<strong>加载实体后直接修改属性</strong>来更新数据，状态变为 <code>Modified</code>（或使用 <code>Attach()</code> / <code>Update()</code> 处理未跟踪实体）。</li><li>使用 <strong><code>DbSet.Remove()</code></strong> 删除实体，状态变为 <code>Deleted</code>。</li><li>调用 <strong><code>SaveChanges()</code> 或 <code>SaveChangesAsync()</code></strong> 将所有待定变更一次性持久化到数据库，并在一个事务中执行，确保数据一致性。</li><li>推荐使用 <strong><code>SaveChangesAsync()</code></strong> 进行异步操作，以提高性能。</li></ul><h3 id="相关数据" tabindex="-1"><a class="header-anchor" href="#相关数据"><span>相关数据</span></a></h3><h4 id="同步添加相关实体" tabindex="-1"><a class="header-anchor" href="#同步添加相关实体"><span>同步添加相关实体</span></a></h4><p>在 EF Core 中，一个实体对象不仅是一个孤立的对象，<strong>它可以通过导航属性与其他实体关联形成一个对象图</strong>（Graph）。</p><p>这个图可以包括：</p><ul><li>一个根对象（如 <code>Blog</code>）</li><li>多个子对象（如 <code>Post</code>）</li><li>子对象的子对象（如 <code>Comment</code>）</li></ul><p>这个图的结构就像一棵树，EF Core 会智能识别它的结构。</p><p>如果你构造了一个包含多个<strong>新对象</strong>的图，然后只将其中一个对象添加到上下文中，EF Core 会<strong>自动将这个图中所有新的实体一起标记为“Added”</strong>，并保存到数据库中。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">var blog = new Blog</span>
<span class="line">{</span>
<span class="line">    Name = &quot;EF Core 学习&quot;,</span>
<span class="line">    Posts = new List&lt;Post&gt;</span>
<span class="line">    {</span>
<span class="line">        new Post { Title = &quot;入门&quot;, Content = &quot;...&quot; },</span>
<span class="line">        new Post { Title = &quot;进阶&quot;, Content = &quot;...&quot; }</span>
<span class="line">    }</span>
<span class="line">};</span>
<span class="line"></span>
<span class="line">// 注意：此处的代码只添加了 Blog！</span>
<span class="line">dbContext.Blogs.Add(blog);</span>
<span class="line">dbContext.SaveChanges();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>EF Core 会自动检测到 <code>blog.Posts</code> 中包含两个新的 <code>Post</code> 实体，它们尚未添加到上下文中，但由于它们<strong>挂在 blog 这个图上</strong>，EF Core 会<strong>自动把这两个 Post 也添加进去</strong>。</p><p>所以最终 EF Core 会生成：</p><ol><li>一条 INSERT INTO Blogs</li><li>两条 INSERT INTO Posts（外键指向 blog 的 Id）</li></ol><p><strong>底层机制：</strong></p><p>EF Core 的 <code>Add()</code> 方法实际上会递归遍历实体对象图，将所有状态为 Detached（未追踪）但通过导航属性可访问的实体设置为 <code>EntityState.Added</code>。</p><h4 id="添加相关实体" tabindex="-1"><a class="header-anchor" href="#添加相关实体"><span>添加相关实体</span></a></h4><p>如果从上下文已跟踪的实体的导航属性引用新实体，则会发现该实体并将其插入到数据库中。</p><h4 id="关系变化" tabindex="-1"><a class="header-anchor" href="#关系变化"><span>关系变化</span></a></h4><p>如果更改实体的导航属性，则会对数据库中的外键列进行相应的更改。</p><h4 id="删除关系" tabindex="-1"><a class="header-anchor" href="#删除关系"><span>删除关系</span></a></h4><p>默认情况下，对于必需的关系，将配置级联删除行为，并从数据库中删除子/从属实体。 对于可选关系，默认情况下不会配置级联删除，但外键属性将设置为 null。</p><h3 id="级联删除" tabindex="-1"><a class="header-anchor" href="#级联删除"><span>级联删除</span></a></h3><p>当你删除一个主实体时，EF Core 会自动删除它关联的依赖实体（子实体）。</p><h4 id="使用方式" tabindex="-1"><a class="header-anchor" href="#使用方式"><span>使用方式</span></a></h4><p>EF Core 默认行为是<strong>启用级联删除</strong>（只要外键非可空）。</p><p>你可以使用 Fluent API 显式配置：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">modelBuilder.Entity&lt;Post&gt;()</span>
<span class="line">    .HasOne(p =&gt; p.Blog)</span>
<span class="line">    .WithMany(b =&gt; b.Posts)</span>
<span class="line">    .OnDelete(DeleteBehavior.Cascade); // 启用级联删除</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table><thead><tr><th>枚举值</th><th>含义</th><th>说明</th></tr></thead><tbody><tr><td><code>Cascade</code></td><td>级联删除</td><td>删除主实体时，也删除依赖实体</td></tr><tr><td><code>Restrict</code></td><td>限制</td><td>不允许删除主实体，除非手动先删除依赖实体</td></tr><tr><td><code>SetNull</code></td><td>设置为空</td><td>删除主实体时，将依赖实体的外键设为 null（要求外键可空）</td></tr><tr><td><code>NoAction</code></td><td>无操作</td><td>数据库不做任何处理，完全依赖开发者控制</td></tr><tr><td><code>ClientSetNull</code></td><td>客户端设为空</td><td>EF Core 把外键设为 null，但不发出 UPDATE 或 DELETE（仅限跟踪图时有效）</td></tr></tbody></table><h3 id="并发冲突" tabindex="-1"><a class="header-anchor" href="#并发冲突"><span>并发冲突</span></a></h3><p>EF Core 使用的是<strong>乐观锁并发控制</strong>：</p><ul><li>默认认为不会冲突；</li><li>保存时检查版本字段或条件；</li><li>如果发生冲突就抛出异常，开发者处理。</li></ul><h4 id="使用方式-1" tabindex="-1"><a class="header-anchor" href="#使用方式-1"><span>使用方式</span></a></h4><ul><li>使用 <code>[ConcurrencyCheck]</code> 特性</li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public class Product</span>
<span class="line">{</span>
<span class="line">    public int Id { get; set; }</span>
<span class="line"></span>
<span class="line">    public string Name { get; set; }</span>
<span class="line"></span>
<span class="line">    [ConcurrencyCheck]</span>
<span class="line">    public decimal Price { get; set; }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果 <code>Price</code> 字段在读取后被其他用户改过，你的保存操作就会抛出并发异常。</p><ul><li>【推荐】使用版本字段</li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public class Product</span>
<span class="line">{</span>
<span class="line">    public int Id { get; set; }</span>
<span class="line"></span>
<span class="line">    public string Name { get; set; }</span>
<span class="line"></span>
<span class="line">    [Timestamp] // 或 Fluent API: .IsRowVersion()</span>
<span class="line">    public byte[] RowVersion { get; set; }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>EF Core 会自动在 SQL 语句中添加 RowVersion 条件：</p><div class="language-SQL line-numbers-mode" data-highlighter="prismjs" data-ext="SQL"><pre><code class="language-SQL"><span class="line">UPDATE Products</span>
<span class="line">SET Name = @newName</span>
<span class="line">WHERE Id = @id AND RowVersion = @originalVersion</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果 <code>RowVersion</code> 已变，说明别人在你之后改了，EF Core 会抛出异常！</p><h4 id="捕获异常" tabindex="-1"><a class="header-anchor" href="#捕获异常"><span>捕获异常</span></a></h4><p>当发生并发冲突时，EF Core 会抛出：</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">catch (DbUpdateConcurrencyException ex)</span>
<span class="line">{</span>
<span class="line">    // 获取冲突的实体</span>
<span class="line">    var entry = ex.Entries.Single();</span>
<span class="line"></span>
<span class="line">    // 你原本希望保存的值</span>
<span class="line">    var clientValues = entry.CurrentValues;</span>
<span class="line"></span>
<span class="line">    // 数据库中当前的值（来自服务器）</span>
<span class="line">    var databaseValues = entry.GetDatabaseValues();</span>
<span class="line"></span>
<span class="line">    // 可供你决定：重试、提示冲突、强制覆盖等</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="executeupdate和executedelete" tabindex="-1"><a class="header-anchor" href="#executeupdate和executedelete"><span><code>ExecuteUpdate</code>和<code>ExecuteDelete</code></span></a></h3><h4 id="问题引入" tabindex="-1"><a class="header-anchor" href="#问题引入"><span>问题引入</span></a></h4><p>在 EF Core 7.0 之前，如果你想更新或删除数据库中的多条记录，通常需要：</p><ol><li><strong>加载</strong>所有相关实体到内存中。</li><li>在内存中<strong>修改或标记删除</strong>这些实体。</li><li>调用 <code>SaveChanges()</code>。</li></ol><p>这种方法在处理大量数据时存在明显的<strong>性能瓶颈</strong>：</p><ul><li><strong>高内存消耗</strong>：将所有需要更新/删除的实体加载到应用程序内存中，可能导致内存溢出或垃圾回收压力。</li><li><strong>网络往返开销</strong>：从数据库读取大量数据到应用程序，然后应用程序再发送大量 <code>UPDATE</code> 或 <code>DELETE</code> 命令到数据库。</li><li><strong>单条 SQL 语句效率低</strong>：<code>SaveChanges()</code> 会为每条修改/删除的记录生成一条单独的 <code>UPDATE</code> 或 <code>DELETE</code> 语句（除非使用批量操作插件），效率远低于在数据库层面执行一条语句来更新/删除多条记录。</li></ul><p><code>ExecuteUpdate</code> 和 <code>ExecuteDelete</code> 方法的引入就是为了解决这些问题。它们允许你<strong>直接在数据库服务器上执行更新和删除操作</strong>，而无需将实体加载到内存中。这类似于直接执行 SQL 的 <code>UPDATE</code> 或 <code>DELETE</code> 语句，但仍然可以利用 LINQ 的类型安全和可组合性。</p><h4 id="executeupdate" tabindex="-1"><a class="header-anchor" href="#executeupdate"><span><code>ExecuteUpdate()</code></span></a></h4><p><code>ExecuteUpdate()</code> 方法允许你对一个查询结果集中的所有实体执行批量更新操作，而无需将它们加载到内存中。</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">await context.DbSet&lt;TEntity&gt;()</span>
<span class="line">    .Where(predicate) // 可选：指定要更新的实体范围</span>
<span class="line">    .ExecuteUpdateAsync(setter =&gt; setter</span>
<span class="line">        .SetProperty(e =&gt; e.Property1, value1) // 设置单个属性</span>
<span class="line">        .SetProperty(e =&gt; e.Property2, e.Property2 + value2) // 基于现有值更新属性</span>
<span class="line">        // 可以链式调用多个 SetProperty</span>
<span class="line">    );</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>示例：将所有价格低于 $50 的产品的价格提高 10%。</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">using Microsoft.EntityFrameworkCore;</span>
<span class="line"></span>
<span class="line">public class Product</span>
<span class="line">{</span>
<span class="line">    public int Id { get; set; }</span>
<span class="line">    public string Name { get; set; } = string.Empty;</span>
<span class="line">    public decimal Price { get; set; }</span>
<span class="line">    public bool IsAvailable { get; set; }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">public class MyDbContext : DbContext</span>
<span class="line">{</span>
<span class="line">    public DbSet&lt;Product&gt; Products { get; set; } = null!;</span>
<span class="line"></span>
<span class="line">    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)</span>
<span class="line">    {</span>
<span class="line">        optionsBuilder.UseSqlServer(&quot;YourConnectionString&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">public async Task BatchUpdateProductPrices()</span>
<span class="line">{</span>
<span class="line">    using (var context = new MyDbContext())</span>
<span class="line">    {</span>
<span class="line">        Console.WriteLine(&quot;Before update:&quot;);</span>
<span class="line">        var oldProducts = await context.Products.Where(p =&gt; p.Price &lt; 50).ToListAsync();</span>
<span class="line">        foreach (var p in oldProducts) Console.WriteLine($&quot;- {p.Name}: {p.Price:C}&quot;);</span>
<span class="line"></span>
<span class="line">        // 将所有价格低于 50 的产品的价格提高 10%，并将其设置为可用</span>
<span class="line">        var affectedRows = await context.Products</span>
<span class="line">            .Where(p =&gt; p.Price &lt; 50) // 筛选要更新的记录</span>
<span class="line">            .ExecuteUpdateAsync(setter =&gt; setter // 定义如何更新</span>
<span class="line">                .SetProperty(p =&gt; p.Price, p =&gt; p.Price * 1.10m) // 将价格提高 10%</span>
<span class="line">                .SetProperty(p =&gt; p.IsAvailable, true)           // 设置 IsAvailable 为 true</span>
<span class="line">            );</span>
<span class="line"></span>
<span class="line">        Console.WriteLine($&quot;\\nUpdated {affectedRows} products.&quot;);</span>
<span class="line"></span>
<span class="line">        Console.WriteLine(&quot;After update:&quot;);</span>
<span class="line">        var newProducts = await context.Products.Where(p =&gt; p.Price &lt; 50 * 1.10m).ToListAsync(); // 注意筛选条件变化</span>
<span class="line">        foreach (var p in newProducts) Console.WriteLine($&quot;- {p.Name}: {p.Price:C}, Available: {p.IsAvailable}&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>EF Core 会将上述 LINQ 语句翻译成一条单一的 <code>UPDATE</code> SQL 语句，并在数据库服务器上执行：</p><div class="language-SQL line-numbers-mode" data-highlighter="prismjs" data-ext="SQL"><pre><code class="language-SQL"><span class="line">UPDATE [p]</span>
<span class="line">SET [p].[Price] = [p].[Price] * 1.10,</span>
<span class="line">    [p].[IsAvailable] = CAST(1 AS bit)</span>
<span class="line">FROM [Products] AS [p]</span>
<span class="line">WHERE [p].[Price] &lt; 50.0;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong><code>ExecuteUpdate()</code> 的特点和限制：</strong></p><ul><li><strong>不在内存中加载实体</strong>：这是它性能高效的关键。</li><li><strong>不影响变更跟踪器</strong>：因为实体没有被加载到内存中，所以 <code>DbContext</code> 的变更跟踪器对这些更改是<strong>无感知</strong>的。如果你之后加载了这些实体，它们将反映数据库中的新值，但它们在 <code>ExecuteUpdate()</code> 执行时并没有被跟踪。</li><li><strong>不触发保存事件或拦截器</strong>：由于没有通过 <code>SaveChanges()</code> 流程，因此任何与 <code>SaveChanges()</code> 相关的事件（如 <code>SavingChanges</code>、<code>SavedChanges</code>）或拦截器都不会被触发。</li><li><strong>不支持级联更新</strong>：<code>ExecuteUpdate()</code> 只更新你指定实体集中的属性。它不会自动更新相关实体（例如，它不会像 <code>SaveChanges()</code> 那样处理导航属性的变更）。</li><li><strong>返回受影响行数</strong>：方法返回一个整数，表示受更新影响的行数。</li><li><strong>可以在查询的任何位置使用</strong>：只要它是一个 <code>IQueryable</code>，你就可以在其上调用 <code>ExecuteUpdateAsync()</code>。</li><li><strong>仅支持设置属性</strong>：不能用于添加或删除实体，也不能用于执行复杂的业务逻辑（需要加载实体到内存）。</li><li><strong>事务</strong>：<code>ExecuteUpdateAsync()</code> 本身不会启动事务。如果你需要它在事务中执行，你需要手动管理事务，例如：</li></ul><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">using var transaction = await context.Database.BeginTransactionAsync();</span>
<span class="line">try</span>
<span class="line">{</span>
<span class="line">    await context.Products.Where(...).ExecuteUpdateAsync(...);</span>
<span class="line">    await context.AnotherTable.Where(...).ExecuteUpdateAsync(...);</span>
<span class="line">    await transaction.CommitAsync();</span>
<span class="line">}</span>
<span class="line">catch (Exception)</span>
<span class="line">{</span>
<span class="line">    await transaction.RollbackAsync();</span>
<span class="line">    throw;</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="executedelete" tabindex="-1"><a class="header-anchor" href="#executedelete"><span><code>ExecuteDelete()</code></span></a></h4><p><code>ExecuteDelete()</code> 方法允许你对一个查询结果集中的所有实体执行批量删除操作，而无需将它们加载到内存中。</p><p><strong>语法</strong></p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">await context.DbSet&lt;TEntity&gt;()</span>
<span class="line">    .Where(predicate) // 指定要删除的实体范围</span>
<span class="line">    .ExecuteDeleteAsync();</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>示例：删除所有价格低于 $10 的产品。</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">public async Task BatchDeleteLowPriceProducts()</span>
<span class="line">{</span>
<span class="line">    using (var context = new MyDbContext())</span>
<span class="line">    {</span>
<span class="line">        Console.WriteLine(&quot;Before delete:&quot;);</span>
<span class="line">        var currentProductCount = await context.Products.CountAsync();</span>
<span class="line">        Console.WriteLine($&quot;Current product count: {currentProductCount}&quot;);</span>
<span class="line"></span>
<span class="line">        // 删除所有价格低于 10 的产品</span>
<span class="line">        var affectedRows = await context.Products</span>
<span class="line">            .Where(p =&gt; p.Price &lt; 10) // 筛选要删除的记录</span>
<span class="line">            .ExecuteDeleteAsync();    // 执行删除</span>
<span class="line"></span>
<span class="line">        Console.WriteLine($&quot;\\nDeleted {affectedRows} products.&quot;);</span>
<span class="line"></span>
<span class="line">        Console.WriteLine(&quot;After delete:&quot;);</span>
<span class="line">        var newProductCount = await context.Products.CountAsync();</span>
<span class="line">        Console.WriteLine($&quot;New product count: {newProductCount}&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>EF Core 会将上述 LINQ 语句翻译成一条单一的 <code>DELETE</code> SQL 语句，并在数据库服务器上执行：</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">DELETE FROM [p]</span>
<span class="line">FROM [Products] AS [p]</span>
<span class="line">WHERE [p].[Price] &lt; 10.0;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong><code>ExecuteDelete()</code> 的特点和限制：</strong></p><ul><li><strong>不在内存中加载实体</strong>：性能高效的关键。</li><li><strong>不影响变更跟踪器</strong>：与 <code>ExecuteUpdate()</code> 类似，<code>DbContext</code> 不知道这些删除操作。</li><li><strong>不触发保存事件或拦截器</strong>。</li><li><strong>返回受影响行数</strong>：方法返回一个整数，表示受删除影响的行数。</li><li><strong>支持数据库级联删除</strong>：如果你的数据库中配置了级联删除（<code>ON DELETE CASCADE</code>），当 <code>ExecuteDelete()</code> 删除父实体时，数据库会自动级联删除相关的子实体。但 <strong>EF Core 本身不会模拟客户端级联行为</strong>；它完全依赖于数据库的级联机制。</li><li><strong>不支持客户端级联删除</strong>：这是与 <code>SaveChanges()</code> 的一个重要区别。如果你依赖 EF Core 在客户端模拟的级联删除行为（例如，外键是可选的，且你配置了 <code>DeleteBehavior.ClientSetNull</code>），那么 <code>ExecuteDelete()</code> 不会执行这种客户端逻辑。它只会执行你指定实体的删除，不会自动处理相关实体的外键置空或删除。</li><li><strong>事务</strong>：与 <code>ExecuteUpdateAsync()</code> 类似，<code>ExecuteDeleteAsync()</code> 本身不会启动事务，需要手动管理。</li></ul><h3 id="事务" tabindex="-1"><a class="header-anchor" href="#事务"><span>事务</span></a></h3><h4 id="acid特性" tabindex="-1"><a class="header-anchor" href="#acid特性"><span>ACID特性</span></a></h4><h4 id="隐式事务" tabindex="-1"><a class="header-anchor" href="#隐式事务"><span>隐式事务</span></a></h4><p>当你调用 <code>SaveChanges()</code> 或 <code>SaveChangesAsync()</code> 方法时，EF Core 默认会在<strong>内部创建一个事务</strong>来包含该方法所涉及的所有数据库操作（<code>INSERT</code>、<code>UPDATE</code>、<code>DELETE</code>）。</p><ul><li><strong>优点</strong>：方便，你不需要显式管理事务。</li><li><strong>缺点</strong>：只能包含单个 <code>SaveChanges()</code> 调用中的操作。如果你有多个 <code>SaveChanges()</code> 调用，或者需要执行一些原始 SQL 命令，并且希望它们都原子性地完成，那么隐式事务就不够用了。</li></ul><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">public async Task AddBlogAndPostImplicitly()</span>
<span class="line">{</span>
<span class="line">    using (var context = new MyDbContext())</span>
<span class="line">    {</span>
<span class="line">        var newBlog = new Blog { Name = &quot;Implicit Transaction Blog&quot; };</span>
<span class="line">        var newPost = new Post { Title = &quot;Implicit Post&quot;, Blog = newBlog };</span>
<span class="line"></span>
<span class="line">        context.Blogs.Add(newBlog);</span>
<span class="line">        context.Posts.Add(newPost);</span>
<span class="line"></span>
<span class="line">        // SaveChanges() 会在一个隐式事务中添加 Blog 和 Post</span>
<span class="line">        // 如果其中任何一个失败，整个操作都会回滚。</span>
<span class="line">        await context.SaveChangesAsync();</span>
<span class="line">        Console.WriteLine($&quot;Blog and Post added using implicit transaction. Blog ID: {newBlog.Id}&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="显式事务" tabindex="-1"><a class="header-anchor" href="#显式事务"><span>显式事务</span></a></h4><p>当你需要将多个 <code>SaveChanges()</code> 调用、或者 <code>SaveChanges()</code> 与原始 SQL 命令（如 <code>ExecuteSqlRaw()</code> / <code>ExecuteSqlInterpolated()</code> / 存储过程调用）组合在一个原子操作中时，你需要使用显式事务。</p><p>EF Core 提供了 <code>DbContext.Database.BeginTransaction()</code> / <code>BeginTransactionAsync()</code> 方法来手动管理事务。</p><h5 id="使用方式-2" tabindex="-1"><a class="header-anchor" href="#使用方式-2"><span>使用方式</span></a></h5><ol><li><strong><code>BeginTransaction()</code></strong>：开始一个新的数据库事务。</li><li><strong>执行操作</strong>：在事务内执行你的 EF Core 操作和/或原始 SQL 命令。</li><li><strong><code>Commit()</code></strong>：如果所有操作都成功，提交事务，使更改永久化。</li><li><strong><code>Rollback()</code></strong>：如果发生错误，回滚事务，撤销所有更改。</li><li><strong><code>Dispose()</code></strong>：在 <code>using</code> 块中确保事务对象被正确释放。</li></ol><p>示例：</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">using Microsoft.EntityFrameworkCore;</span>
<span class="line">using Microsoft.EntityFrameworkCore.Storage; // 引入此命名空间</span>
<span class="line"></span>
<span class="line">public async Task TransferPostsBetweenBlogs(int fromBlogId, int toBlogId)</span>
<span class="line">{</span>
<span class="line">    using (var context = new MyDbContext())</span>
<span class="line">    {</span>
<span class="line">        // 1. 开始事务</span>
<span class="line">        using (IDbContextTransaction transaction = await context.Database.BeginTransactionAsync())</span>
<span class="line">        {</span>
<span class="line">            try</span>
<span class="line">            {</span>
<span class="line">                // 确保两个博客都存在</span>
<span class="line">                var fromBlog = await context.Blogs.FindAsync(fromBlogId);</span>
<span class="line">                var toBlog = await context.Blogs.FindAsync(toBlogId);</span>
<span class="line"></span>
<span class="line">                if (fromBlog == null || toBlog == null)</span>
<span class="line">                {</span>
<span class="line">                    Console.WriteLine(&quot;One or both blogs not found. Rolling back.&quot;);</span>
<span class="line">                    await transaction.RollbackAsync();</span>
<span class="line">                    return;</span>
<span class="line">                }</span>
<span class="line"></span>
<span class="line">                // 2. 查找要转移的 Post (例如，假设我们要转移所有 Post)</span>
<span class="line">                var postsToTransfer = await context.Posts</span>
<span class="line">                    .Where(p =&gt; p.BlogId == fromBlogId)</span>
<span class="line">                    .ToListAsync();</span>
<span class="line"></span>
<span class="line">                // 3. 修改这些 Post 的外键</span>
<span class="line">                foreach (var post in postsToTransfer)</span>
<span class="line">                {</span>
<span class="line">                    post.BlogId = toBlogId;</span>
<span class="line">                }</span>
<span class="line"></span>
<span class="line">                // 4. 保存第一个 SaveChanges() 调用</span>
<span class="line">                // 这些更改是事务的一部分，但尚未提交到数据库</span>
<span class="line">                await context.SaveChangesAsync();</span>
<span class="line">                Console.WriteLine($&quot;Transferred {postsToTransfer.Count} posts from Blog {fromBlogId} to Blog {toBlogId}.&quot;);</span>
<span class="line"></span>
<span class="line">                // 5. 额外操作：删除原始博客 (如果需要，并在同一个事务中)</span>
<span class="line">                context.Blogs.Remove(fromBlog);</span>
<span class="line">                await context.SaveChangesAsync(); // 第二个 SaveChanges() 调用，仍然在同一个事务中</span>
<span class="line">                Console.WriteLine($&quot;Blog {fromBlogId} removed.&quot;);</span>
<span class="line"></span>
<span class="line">                // 6. 提交事务</span>
<span class="line">                await transaction.CommitAsync();</span>
<span class="line">                Console.WriteLine(&quot;Transaction committed successfully.&quot;);</span>
<span class="line">            }</span>
<span class="line">            catch (Exception ex)</span>
<span class="line">            {</span>
<span class="line">                // 发生错误时回滚事务</span>
<span class="line">                Console.WriteLine($&quot;Error during transaction: {ex.Message}. Rolling back.&quot;);</span>
<span class="line">                await transaction.RollbackAsync();</span>
<span class="line">            }</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="隔离级别" tabindex="-1"><a class="header-anchor" href="#隔离级别"><span>隔离级别</span></a></h5><p>当你开始一个显式事务时，你还可以指定事务的<strong>隔离级别</strong>。隔离级别定义了并发事务之间相互可见的程度，以平衡数据一致性和并发性能。</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">using System.Data; // for IsolationLevel</span>
<span class="line"></span>
<span class="line">using (IDbContextTransaction transaction = await context.Database.BeginTransactionAsync(IsolationLevel.Serializable))</span>
<span class="line">{</span>
<span class="line">    // ... your operations ...</span>
<span class="line">    await transaction.CommitAsync();</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>常见的隔离级别（从低到高）：</strong></p><ul><li><strong><code>ReadUncommitted</code></strong>：允许读取未提交的数据（脏读）。并发性最高，但数据一致性最差。</li><li><strong><code>ReadCommitted</code></strong> (大多数数据库的默认值)：只允许读取已提交的数据。防止脏读，但可能出现不可重复读和幻读。</li><li><strong><code>RepeatableRead</code></strong>：确保在事务期间多次读取同一行数据时，其值保持不变。防止脏读和不可重复读，但可能出现幻读。</li><li><strong><code>Serializable</code></strong>：最高的隔离级别。确保事务是完全隔离的，就好像它们是串行执行的一样。防止脏读、不可重复读和幻读，但并发性最低，可能导致死锁和性能问题。</li><li><strong><code>Snapshot</code></strong> (SQL Server 特定)：使用行版本控制来避免读写锁。提供 <code>RepeatableRead</code> 的一致性，同时具有更好的并发性。</li></ul><h3 id="断开连接的实体" tabindex="-1"><a class="header-anchor" href="#断开连接的实体"><span>断开连接的实体</span></a></h3><p><strong>连接的实体 (Connected/Tracked Entity)</strong>：如果一个实体实例是通过某个 <code>DbContext</code> 实例从数据库中加载出来的，或者通过 <code>DbContext.Add()</code>、<code>DbContext.Attach()</code> 等方法明确地附加到该 <code>DbContext</code> 实例的变更跟踪器中，那么它就是<strong>连接的</strong>或<strong>被跟踪的</strong>。EF Core 会监控这些实体属性的变化，并在调用 <code>SaveChanges()</code> 时自动生成相应的 <code>UPDATE</code> 或 <code>DELETE</code> 语句。</p><p><strong>断开连接的实体 (Disconnected Entity)</strong>：如果一个实体实例<strong>不是</strong>由当前的 <code>DbContext</code> 实例加载的，也<strong>没有</strong>被附加到它的变更跟踪器中，那么它就是<strong>断开连接的</strong>。</p><p><strong>常见来源</strong>：</p><ul><li>从数据库加载后，<code>DbContext</code> 被释放（例如，在 Web 请求结束时）。</li><li>通过 API 接收的实体（例如，来自客户端的 JSON 数据）。</li><li>从另一个 <code>DbContext</code> 实例加载，然后传递到当前 <code>DbContext</code> 实例的上下文之外。</li><li>通过 <code>new</code> 关键字手动创建，但尚未添加到 <code>DbContext</code>。</li></ul><h4 id="处理方式" tabindex="-1"><a class="header-anchor" href="#处理方式"><span>处理方式</span></a></h4><p>处理断开连接的实体主要涉及告知 <code>DbContext</code> 它们的当前状态，以便 <code>SaveChanges()</code> 能够生成正确的 SQL。这通常通过 <code>DbContext.Entry()</code> 或 <code>DbContext.Add()</code> / <code>DbContext.Update()</code> / <code>DbContext.Remove()</code> 来实现。</p><h5 id="添加一个全新的断开连接实体" tabindex="-1"><a class="header-anchor" href="#添加一个全新的断开连接实体"><span>添加一个全新的断开连接实体</span></a></h5><p>如果你有一个通过 <code>new</code> 操作符创建的实体，并且你希望将其添加到数据库，那么它是一个断开连接的新实体。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public class Blog</span>
<span class="line">{</span>
<span class="line">    public int Id { get; set; } // Id 会在保存后由数据库生成</span>
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
<span class="line">public async Task AddNewDisconnectedBlog(string name, string url)</span>
<span class="line">{</span>
<span class="line">    // 这是一个全新的、未被跟踪的 Blog 实体</span>
<span class="line">    var newBlog = new Blog</span>
<span class="line">    {</span>
<span class="line">        Name = name,</span>
<span class="line">        Url = url</span>
<span class="line">    };</span>
<span class="line"></span>
<span class="line">    using (var context = new MyDbContext())</span>
<span class="line">    {</span>
<span class="line">        // 使用 Add() 方法告诉 DbContext 这是一个新的实体。</span>
<span class="line">        // EF Core 会将其状态标记为 &#39;Added&#39;。</span>
<span class="line">        context.Blogs.Add(newBlog);</span>
<span class="line">        // 或者 context.Add(newBlog); // 泛型 Add 也能工作</span>
<span class="line"></span>
<span class="line">        await context.SaveChangesAsync();</span>
<span class="line">        Console.WriteLine($&quot;New disconnected blog added. ID: {newBlog.Id}&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong><code>Add()</code> 方法的内部机制</strong>： 当你调用 <code>Add()</code> 时，EF Core 会检查实体的主键。如果主键的默认值表示它尚未被设置（例如，<code>int</code> 类型的 <code>0</code>），EF Core 就会假设这是一个新实体，并将其状态标记为 <code>Added</code>。</p><h5 id="更新一个断开连接的实体" tabindex="-1"><a class="header-anchor" href="#更新一个断开连接的实体"><span>更新一个断开连接的实体</span></a></h5><p>这是最常见的场景，也最复杂。你从数据库加载了一个实体，把它发送到客户端（比如 Web 界面），用户修改了它，然后你从客户端接收回这个修改后的实体。此时，这个实体是断开连接的。</p><ul><li><p><code>Update()</code>方法</p><ul><li>如果实体的主键不为默认值（即它已经存在于数据库中），<code>Update()</code> 会尝试将其附加到 <code>DbContext</code>，并将其状态标记为 <code>Modified</code>。</li><li>如果实体的主键是默认值（新实体），它会尝试将其标记为 <code>Added</code>（但通常这种场景用 <code>Add()</code> 更明确）。</li><li><strong>注意</strong>：<code>Update()</code> 会将实体<strong>所有属性</strong>标记为已修改，即使某些属性实际上没有变化。这可能导致不必要的 <code>UPDATE</code> 语句。</li></ul><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public async Task UpdateDisconnectedBlogUsingUpdate(Blog blogToUpdate)</span>
<span class="line">{</span>
<span class="line">    using (var context = new MyDbContext())</span>
<span class="line">    {</span>
<span class="line">        // blogToUpdate 是一个断开连接的实体，它可能包含了用户的修改</span>
<span class="line">        // Update() 方法会根据其主键（blogToUpdate.Id）判断它是否已存在。</span>
<span class="line">        // 如果 Id 有值，它会将其状态标记为 &#39;Modified&#39;。</span>
<span class="line">        context.Blogs.Update(blogToUpdate);</span>
<span class="line"></span>
<span class="line">        await context.SaveChangesAsync();</span>
<span class="line">        Console.WriteLine($&quot;Disconnected blog {blogToUpdate.Id} updated using Update().&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><code>Entry().State = EntityState.Modified</code></p><p>如果你想对哪些属性被修改有更精细的控制，或者你知道只有部分属性发生了变化，可以使用这种方法。</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">using Microsoft.EntityFrameworkCore.ChangeTracking; // For EntityEntry</span>
<span class="line"></span>
<span class="line">public async Task UpdateDisconnectedBlogWithSpecificProperties(Blog blogToUpdate)</span>
<span class="line">{</span>
<span class="line">    using (var context = new MyDbContext())</span>
<span class="line">    {</span>
<span class="line">        // 1. 将实体附加到 DbContext，其状态默认为 &#39;Unchanged&#39;</span>
<span class="line">        EntityEntry&lt;Blog&gt; entry = context.Blogs.Attach(blogToUpdate);</span>
<span class="line"></span>
<span class="line">        // 2. 将实体状态明确设置为 &#39;Modified&#39;。</span>
<span class="line">        // 此时，EF Core 会认为所有属性都已修改。</span>
<span class="line">        entry.State = EntityState.Modified;</span>
<span class="line"></span>
<span class="line">        // 或者，更推荐的方式：只标记特定属性为 Modified</span>
<span class="line">        // 如果你只知道 Name 和 Url 被修改了，而 Id 是主键不变的：</span>
<span class="line">        // entry.Property(b =&gt; b.Name).IsModified = true;</span>
<span class="line">        // entry.Property(b =&gt; b.Url).IsModified = true;</span>
<span class="line">        // 如果你需要比较旧值和新值，你可能需要先加载旧实体：</span>
<span class="line">        // var existingBlog = await context.Blogs.FindAsync(blogToUpdate.Id);</span>
<span class="line">        // context.Entry(existingBlog).CurrentValues.SetValues(blogToUpdate); // 将新值复制到现有跟踪实体</span>
<span class="line"></span>
<span class="line">        await context.SaveChangesAsync();</span>
<span class="line">        Console.WriteLine($&quot;Disconnected blog {blogToUpdate.Id} updated using Entry().State.&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>何时使用</strong>：当你希望 EF Core 只生成包含实际更改属性的 <code>UPDATE</code> 语句时，或者当你需要更复杂的比较逻辑来决定哪些属性被修改时（例如，使用 <code>CurrentValues.SetValues()</code> 来合并更改）。</p></li></ul><h5 id="删除一个断开连接实体" tabindex="-1"><a class="header-anchor" href="#删除一个断开连接实体"><span>删除一个断开连接实体</span></a></h5><p>如果你想删除一个你已经知道其主键的实体（但它当前没有被 <code>DbContext</code> 跟踪），你可以：</p><div class="language-C# line-numbers-mode" data-highlighter="prismjs" data-ext="C#"><pre><code class="language-C#"><span class="line">public async Task DeleteDisconnectedBlog(int blogId)</span>
<span class="line">{</span>
<span class="line">    // 创建一个只包含主键的“存根”实体</span>
<span class="line">    var blogToDelete = new Blog { Id = blogId };</span>
<span class="line"></span>
<span class="line">    using (var context = new MyDbContext())</span>
<span class="line">    {</span>
<span class="line">        // 1. 将存根实体附加到 DbContext。此时，它的状态默认为 &#39;Unchanged&#39;。</span>
<span class="line">        context.Blogs.Attach(blogToDelete);</span>
<span class="line"></span>
<span class="line">        // 2. 将其状态明确设置为 &#39;Deleted&#39;。</span>
<span class="line">        // EF Core 会知道要根据主键生成 DELETE SQL。</span>
<span class="line">        context.Blogs.Remove(blogToDelete); // Remove() 内部会设置状态为 Deleted</span>
<span class="line"></span>
<span class="line">        await context.SaveChangesAsync();</span>
<span class="line">        Console.WriteLine($&quot;Disconnected blog {blogId} deleted.&quot;);</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>你不需要加载整个实体来删除它，只需要一个包含主键的实体实例即可</p></blockquote>`,133)]))}const r=s(l,[["render",d]]),p=JSON.parse('{"path":"/dotnet/ef%20core/save%20data.html","title":"保存数据","lang":"zh-CN","frontmatter":{"title":"保存数据","shortTitle":"保存数据","description":"保存数据","date":"2025-07-15T11:27:33.000Z","categories":[".NET","EF CORE"],"tags":[".NET"],"order":5},"git":{"createdTime":1752572228000,"updatedTime":1753195075000,"contributors":[{"name":"Okita1027","username":"Okita1027","email":"96156298+Okita1027@users.noreply.github.com","commits":6,"url":"https://github.com/Okita1027"}]},"readingTime":{"minutes":20.53,"words":6160},"filePathRelative":"dotnet/ef core/save data.md"}');export{r as comp,p as data};
