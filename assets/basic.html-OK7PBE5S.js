import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,d as e,o as i}from"./app-CN29avzT.js";const l={};function p(d,n){return i(),a("div",null,n[0]||(n[0]=[e(`<p><a href="./%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAWPF.pdf">电子书：深入浅出WPF</a></p><h2 id="控件父类" tabindex="-1"><a class="header-anchor" href="#控件父类"><span>控件父类</span></a></h2><h3 id="dispatcherobject" tabindex="-1"><a class="header-anchor" href="#dispatcherobject"><span>DispatcherObject</span></a></h3><h3 id="dependencyobject" tabindex="-1"><a class="header-anchor" href="#dependencyobject"><span>DependencyObject</span></a></h3><h3 id="visual" tabindex="-1"><a class="header-anchor" href="#visual"><span>Visual</span></a></h3><h3 id="uielement" tabindex="-1"><a class="header-anchor" href="#uielement"><span>UIElement</span></a></h3><h3 id="frameworkelement" tabindex="-1"><a class="header-anchor" href="#frameworkelement"><span>FrameworkElement</span></a></h3><h2 id="布局控件" tabindex="-1"><a class="header-anchor" href="#布局控件"><span>布局控件</span></a></h2><h3 id="panel基类" tabindex="-1"><a class="header-anchor" href="#panel基类"><span>Panel基类</span></a></h3><h3 id="grid网格" tabindex="-1"><a class="header-anchor" href="#grid网格"><span>Grid网格</span></a></h3><h3 id="uniformgrid均分" tabindex="-1"><a class="header-anchor" href="#uniformgrid均分"><span>UniformGrid均分</span></a></h3><h3 id="stackpanel栈式" tabindex="-1"><a class="header-anchor" href="#stackpanel栈式"><span>StackPanel栈式</span></a></h3><h3 id="wrappanel瀑布流" tabindex="-1"><a class="header-anchor" href="#wrappanel瀑布流"><span>WrapPanel瀑布流</span></a></h3><h3 id="dockpanel停靠" tabindex="-1"><a class="header-anchor" href="#dockpanel停靠"><span>DockPanel停靠</span></a></h3><h3 id="canvas绝对" tabindex="-1"><a class="header-anchor" href="#canvas绝对"><span>Canvas绝对</span></a></h3><h3 id="border边框" tabindex="-1"><a class="header-anchor" href="#border边框"><span>Border边框</span></a></h3><h2 id="内容控件" tabindex="-1"><a class="header-anchor" href="#内容控件"><span>内容控件</span></a></h2><h2 id="集合控件" tabindex="-1"><a class="header-anchor" href="#集合控件"><span>集合控件</span></a></h2><h2 id="图形控件" tabindex="-1"><a class="header-anchor" href="#图形控件"><span>图形控件</span></a></h2><h2 id="数据绑定" tabindex="-1"><a class="header-anchor" href="#数据绑定"><span>数据绑定</span></a></h2><div class="language-mathematica line-numbers-mode" data-highlighter="prismjs" data-ext="mathematica"><pre><code class="language-mathematica"><span class="line">📌 WPF 数据绑定 Data Binding</span>
<span class="line">│</span>
<span class="line">├── <span class="token number">1</span><span class="token punctuation">.</span> 绑定的基本元素</span>
<span class="line">│     ├── 目标（Target）→ UI 控件的属性（TextBox<span class="token punctuation">.</span>Text）</span>
<span class="line">│     ├── 源（Source）→ 数据对象（Person<span class="token punctuation">.</span>Name）</span>
<span class="line">│     ├── 路径（Path）→ 属性名（<span class="token string">&quot;Name&quot;</span>）</span>
<span class="line">│     └── 模式（Mode）</span>
<span class="line">│           ├── OneTime       → 源 → 目标（一次性）</span>
<span class="line">│           ├── OneWay        → 源 → 目标（实时）</span>
<span class="line">│           ├── TwoWay        → 源 ↔ 目标（双向）</span>
<span class="line">│           ├── OneWayToSource→ 目标 → 源</span>
<span class="line">│           └── Default       → 控件默认绑定模式</span>
<span class="line">│</span>
<span class="line">├── <span class="token number">2</span><span class="token punctuation">.</span> 数据源类型（Source）</span>
<span class="line">│     ├── 普通对象（POCO）</span>
<span class="line">│     ├── 集合（ObservableCollection<span class="token operator">&lt;</span>T<span class="token operator">&gt;</span>）</span>
<span class="line">│     ├── 另一个控件（ElementName）</span>
<span class="line">│     ├── 静态资源（StaticResource <span class="token operator">/</span> x<span class="token punctuation">:</span>Static）</span>
<span class="line">│     ├── RelativeSource（绑定到父级控件）</span>
<span class="line">│     └── 依赖属性（DependencyProperty）</span>
<span class="line">│</span>
<span class="line">├── <span class="token number">3</span><span class="token punctuation">.</span> 数据更新机制</span>
<span class="line">│     ├── 单个属性更新 → INotifyPropertyChanged</span>
<span class="line">│     └── 集合更新     → ObservableCollection<span class="token operator">&lt;</span>T<span class="token operator">&gt;</span></span>
<span class="line">│</span>
<span class="line">├── <span class="token number">4</span><span class="token punctuation">.</span> 高级绑定技巧</span>
<span class="line">│     ├── 值转换（IValueConverter <span class="token operator">/</span> IMultiValueConverter）</span>
<span class="line">│     ├── 多重绑定（MultiBinding）</span>
<span class="line">│     ├── 优先级绑定（PriorityBinding）</span>
<span class="line">│     ├── 数据校验（Validation Rules <span class="token operator">/</span> IDataErrorInfo）</span>
<span class="line">│     └── 异步绑定（IsAsync<span class="token operator">=</span><span class="token boolean">True</span>）</span>
<span class="line">│</span>
<span class="line">├── <span class="token number">5</span><span class="token punctuation">.</span> DataContext</span>
<span class="line">│     ├── 控件的 DataContext（决定绑定源是谁）</span>
<span class="line">│     ├── 继承机制（子控件会继承父控件的 DataContext）</span>
<span class="line">│     └── 常用设置方式</span>
<span class="line">│           ├── XAML 静态绑定（StaticResource）</span>
<span class="line">│           └── 代码动态设置（this<span class="token punctuation">.</span>DataContext <span class="token operator">=</span> obj）</span>
<span class="line">│</span>
<span class="line">└── <span class="token number">6</span><span class="token punctuation">.</span> MVVM 模式中的绑定</span>
<span class="line">      ├── ViewModel 作为 DataContext</span>
<span class="line">      ├── 属性更新通知（INotifyPropertyChanged）</span>
<span class="line">      ├── 命令绑定（ICommand <span class="token operator">+</span> Button<span class="token punctuation">.</span>Command）</span>
<span class="line">      └── 集合绑定（ItemsControl<span class="token punctuation">.</span>ItemsSource）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="样式" tabindex="-1"><a class="header-anchor" href="#样式"><span>样式</span></a></h2><div class="language-mathematica line-numbers-mode" data-highlighter="prismjs" data-ext="mathematica"><pre><code class="language-mathematica"><span class="line">📌 WPF 样式（Style）</span>
<span class="line">│</span>
<span class="line">├── <span class="token number">1</span><span class="token punctuation">.</span> 样式的作用</span>
<span class="line">│     ├── 统一控件外观（替代重复的属性设置）</span>
<span class="line">│     ├── 主题化 UI（暗色 <span class="token operator">/</span> 浅色主题切换）</span>
<span class="line">│     └── 支持动态切换（DynamicResource）</span>
<span class="line">│</span>
<span class="line">├── <span class="token number">2</span><span class="token punctuation">.</span> 样式的基本结构</span>
<span class="line">│     ├── TargetType（目标控件类型）</span>
<span class="line">│     ├── Setters（属性赋值）</span>
<span class="line">│     └── Triggers（触发器，条件改变样式）</span>
<span class="line">│</span>
<span class="line">├── <span class="token number">3</span><span class="token punctuation">.</span> 样式的分类</span>
<span class="line">│     ├── 显式样式（有 x<span class="token punctuation">:</span>Key，手动引用）</span>
<span class="line">│     ├── 隐式样式（无 x<span class="token punctuation">:</span>Key，自动应用到指定类型控件）</span>
<span class="line">│     └── 基于样式（BasedOn，样式继承）</span>
<span class="line">│</span>
<span class="line">├── <span class="token number">4</span><span class="token punctuation">.</span> 样式的作用域</span>
<span class="line">│     ├── 控件内部（直接定义在控件<span class="token punctuation">.</span>Resources）</span>
<span class="line">│     ├── 窗口级（Window<span class="token punctuation">.</span>Resources）</span>
<span class="line">│     ├── 应用级（App<span class="token punctuation">.</span>xaml → Application<span class="token punctuation">.</span>Resources）</span>
<span class="line">│     └── 外部资源字典（ResourceDictionary）</span>
<span class="line">│</span>
<span class="line">├── <span class="token number">5</span><span class="token punctuation">.</span> 触发器（Triggers）</span>
<span class="line">│     ├── 属性触发器（PropertyTrigger）</span>
<span class="line">│     ├── 数据触发器（DataTrigger）</span>
<span class="line">│     ├── 多条件触发器（MultiTrigger <span class="token operator">/</span> MultiDataTrigger）</span>
<span class="line">│     └── 事件触发器（EventTrigger）</span>
<span class="line">│</span>
<span class="line">├── <span class="token number">6</span><span class="token punctuation">.</span> 样式与模板</span>
<span class="line">│     ├── ControlTemplate（控件外观重定义）</span>
<span class="line">│     ├── DataTemplate（数据呈现方式）</span>
<span class="line">│     └── ItemTemplate（列表数据项样式）</span>
<span class="line">│</span>
<span class="line">├── <span class="token number">7</span><span class="token punctuation">.</span> 动态样式</span>
<span class="line">│     ├── StaticResource（静态资源，加载时固定）</span>
<span class="line">│     ├── DynamicResource（动态资源，运行时可切换）</span>
<span class="line">│     └── 主题切换（换 ResourceDictionary）</span>
<span class="line">│</span>
<span class="line">└── <span class="token number">8</span><span class="token punctuation">.</span> 高级技巧</span>
<span class="line">      ├── 基于主题的资源字典（Light<span class="token punctuation">.</span>xaml <span class="token operator">/</span> Dark<span class="token punctuation">.</span>xaml）</span>
<span class="line">      ├── 样式合并（MergedDictionaries）</span>
<span class="line">      ├── 结合绑定（在 Setter 中用 Binding）</span>
<span class="line">      └── 与附加属性配合（自定义控件扩展样式）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="模板" tabindex="-1"><a class="header-anchor" href="#模板"><span>模板</span></a></h2><p><strong>WPF 模板（Template）</strong>，它和样式（Style）关系密切，但功能更强，直接决定了控件<strong>长什么样、内部结构怎么组成</strong>。</p><div class="language-mathematica line-numbers-mode" data-highlighter="prismjs" data-ext="mathematica"><pre><code class="language-mathematica"><span class="line">📌 WPF 模板（Template）</span>
<span class="line">│</span>
<span class="line">├── <span class="token number">1</span><span class="token punctuation">.</span> 模板的作用</span>
<span class="line">│     ├── 重定义控件的外观（UI结构）</span>
<span class="line">│     ├── 将数据与UI分离（可复用）</span>
<span class="line">│     ├── 允许主题<span class="token operator">/</span>皮肤替换</span>
<span class="line">│</span>
<span class="line">├── <span class="token number">2</span><span class="token punctuation">.</span> 模板类型</span>
<span class="line">│     ├── ControlTemplate —— 控件外观定义</span>
<span class="line">│     │       🎯 改变控件结构和视觉表现（按钮、文本框等）</span>
<span class="line">│     │       📌 常与 Style 配合使用</span>
<span class="line">│     │       📌 关键点：</span>
<span class="line">│     │           <span class="token operator">-</span> TargetType 指定控件类型</span>
<span class="line">│     │           <span class="token operator">-</span> VisualTree 定义控件的可视树</span>
<span class="line">│     │           <span class="token operator">-</span> TemplateBinding 绑定控件属性</span>
<span class="line">│     │           <span class="token operator">-</span> Triggers 处理状态变化</span>
<span class="line">│     │</span>
<span class="line">│     ├── DataTemplate —— 数据到 UI 的映射</span>
<span class="line">│     │       🎯 定义数据项如何显示</span>
<span class="line">│     │       📌 常用于 ListBox、ListView、ComboBox</span>
<span class="line">│     │       📌 关键点：</span>
<span class="line">│     │           <span class="token operator">-</span> 绑定到数据属性（<span class="token punctuation">{</span>Binding Name<span class="token punctuation">}</span>）</span>
<span class="line">│     │           <span class="token operator">-</span> 可嵌套布局和其他控件</span>
<span class="line">│     │</span>
<span class="line">│     ├── HierarchicalDataTemplate —— 分层数据模板</span>
<span class="line">│     │       🎯 树形结构展示（TreeView）</span>
<span class="line">│     │       📌 ItemsSource 绑定子集合</span>
<span class="line">│     │</span>
<span class="line">│     └── ItemsPanelTemplate —— 定义容器布局</span>
<span class="line">│             🎯 指定 ItemsControl 的内部布局面板</span>
<span class="line">│             📌 例如：ListBox 默认 StackPanel，可改为 WrapPanel<span class="token operator">/</span>Grid</span>
<span class="line">│</span>
<span class="line">├── <span class="token number">3</span><span class="token punctuation">.</span> 模板关键技术</span>
<span class="line">│     ├── TemplateBinding —— 将模板元素属性绑定到控件属性</span>
<span class="line">│     ├── ContentPresenter —— 占位符，显示控件的 Content</span>
<span class="line">│     ├── ItemsPresenter —— 占位符，显示 ItemsControl 的子项</span>
<span class="line">│     └── PART_xxx 命名约定（自定义控件必备的模板部件）</span>
<span class="line">│</span>
<span class="line">├── <span class="token number">4</span><span class="token punctuation">.</span> 模板与样式的关系</span>
<span class="line">│     ├── 样式（Style）可以包含模板</span>
<span class="line">│     ├── 样式修改外观的简单场景（Setter）</span>
<span class="line">│     └── 模板用于完全重绘控件</span>
<span class="line">│</span>
<span class="line">├── <span class="token number">5</span><span class="token punctuation">.</span> 模板触发器</span>
<span class="line">│     ├── Trigger（属性触发）</span>
<span class="line">│     ├── DataTrigger（绑定数据触发）</span>
<span class="line">│     └── EventTrigger（事件触发）</span>
<span class="line">│</span>
<span class="line">└── <span class="token number">6</span><span class="token punctuation">.</span> 高级用法</span>
<span class="line">      ├── 动态加载模板（DynamicResource）</span>
<span class="line">      ├── 基于主题切换模板</span>
<span class="line">      ├── 多模板切换（DataTemplateSelector）</span>
<span class="line">      └── 自定义控件与默认模板（Generic<span class="token punctuation">.</span>xaml）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="命令" tabindex="-1"><a class="header-anchor" href="#命令"><span>命令</span></a></h2><p><strong>WPF 命令（Command）</strong>，它是 MVVM 模式的核心之一，能把 <strong>用户操作</strong> 和 <strong>执行逻辑</strong> 解耦，让代码更干净。</p><div class="language-mathematica line-numbers-mode" data-highlighter="prismjs" data-ext="mathematica"><pre><code class="language-mathematica"><span class="line">📌 WPF 命令系统</span>
<span class="line">│</span>
<span class="line">├── <span class="token number">1</span><span class="token punctuation">.</span> 命令的作用</span>
<span class="line">│     ├── 解耦 UI 和业务逻辑（不用在事件里写逻辑）</span>
<span class="line">│     ├── 支持命令状态（能否执行）</span>
<span class="line">│     ├── 支持键盘快捷键、菜单、工具栏统一触发</span>
<span class="line">│     ├── MVVM 模式下 View 和 ViewModel 的桥梁</span>
<span class="line">│</span>
<span class="line">├── <span class="token number">2</span><span class="token punctuation">.</span> 命令的分类</span>
<span class="line">│     ├── 预定义命令（RoutedCommand）</span>
<span class="line">│     │       📌 ApplicationCommands（Copy、Paste、Undo…）</span>
<span class="line">│     │       📌 NavigationCommands（BrowseBack、BrowseForward…）</span>
<span class="line">│     │       📌 MediaCommands（Play、Pause…）</span>
<span class="line">│     │       📌 EditingCommands（Bold、Italic…）</span>
<span class="line">│     │</span>
<span class="line">│     ├── 自定义命令</span>
<span class="line">│     │       📌 RoutedCommand（UI 路由命令）</span>
<span class="line">│     │       📌 ICommand（MVVM 自定义）</span>
<span class="line">│</span>
<span class="line">├── <span class="token number">3</span><span class="token punctuation">.</span> 核心接口</span>
<span class="line">│     ├── ICommand</span>
<span class="line">│     │       <span class="token operator">-</span> Execute<span class="token punctuation">(</span>object parameter<span class="token punctuation">)</span>       👉 执行命令</span>
<span class="line">│     │       <span class="token operator">-</span> CanExecute<span class="token punctuation">(</span>object parameter<span class="token punctuation">)</span>    👉 命令是否可执行</span>
<span class="line">│     │       <span class="token operator">-</span> CanExecuteChanged 事件          👉 通知 UI 更新状态</span>
<span class="line">│     │</span>
<span class="line">│     ├── RoutedCommand</span>
<span class="line">│     │       <span class="token operator">-</span> 有命令路由（冒泡、隧道）</span>
<span class="line">│     │       <span class="token operator">-</span> 常用于多层 UI 控件间传递</span>
<span class="line">│</span>
<span class="line">├── <span class="token number">4</span><span class="token punctuation">.</span> 命令绑定</span>
<span class="line">│     ├── Command（按钮绑定命令）</span>
<span class="line">│     ├── CommandParameter（传递参数）</span>
<span class="line">│     ├── CommandTarget（指定命令作用对象）</span>
<span class="line">│</span>
<span class="line">├── <span class="token number">5</span><span class="token punctuation">.</span> 常见实现方式</span>
<span class="line">│     ├── 事件绑定命令（CommandBinding）</span>
<span class="line">│     │       <span class="token operator">-</span> 适用于 Code<span class="token operator">-</span>behind</span>
<span class="line">│     │</span>
<span class="line">│     ├── MVVM RelayCommand（DelegateCommand）</span>
<span class="line">│     │       <span class="token operator">-</span> ViewModel 中用委托实现 ICommand</span>
<span class="line">│     │</span>
<span class="line">│     ├── Prism DelegateCommand <span class="token operator">/</span> ReactiveCommand</span>
<span class="line">│</span>
<span class="line">├── <span class="token number">6</span><span class="token punctuation">.</span> 命令路由机制（RoutedCommand）</span>
<span class="line">│     ├── 事件路由模式（Bubble <span class="token operator">/</span> Tunnel <span class="token operator">/</span> Direct）</span>
<span class="line">│     ├── 从触发控件开始向上传递，直到被处理</span>
<span class="line">│</span>
<span class="line">└── <span class="token number">7</span><span class="token punctuation">.</span> 高级技巧</span>
<span class="line">      ├── 动态更新 CanExecute（调用 CommandManager<span class="token punctuation">.</span>InvalidateRequerySuggested）</span>
<span class="line">      ├── 命令参数绑定（CommandParameter 绑定 SelectedItem、Text 等）</span>
<span class="line">      ├── 多命令合并执行</span>
<span class="line">      └── 异步命令（防止 UI 卡顿）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="依赖属性" tabindex="-1"><a class="header-anchor" href="#依赖属性"><span>依赖属性</span></a></h2><p><strong>依赖属性</strong> 是继承自 <code>DependencyObject</code> 的类通过 WPF 属性系统注册的特殊属性， 它比普通 .NET 属性（CLR 属性）多了很多“附加能力”：</p><ul><li>🔄 <strong>支持数据绑定</strong>（Binding）</li><li>🎨 <strong>支持样式（Style）和模板（Template）自动应用值</strong></li><li>🎬 <strong>支持动画（Animation）</strong></li><li>🛠 <strong>支持属性值继承（Property Value Inheritance）</strong></li><li>🚀 <strong>支持高性能的属性存储（内部用稀疏存储，节省内存）</strong></li><li>📝 <strong>支持验证、回调、强制 Coerce 值</strong></li></ul><p>依赖属性不是普通字段存储的值，而是存储在 <strong>WPF 属性系统的依赖属性存储表</strong> 中。 它有一个全局唯一的 <strong>DependencyProperty 标识符</strong>（<code>xxxProperty</code>），WPF 用它来查找和设置值。</p><table><thead><tr><th>特性</th><th>CLR 属性</th><th>依赖属性</th></tr></thead><tbody><tr><td>数据绑定</td><td>❌ 不支持</td><td>✅ 支持</td></tr><tr><td>样式/动画</td><td>❌ 不支持</td><td>✅ 支持</td></tr><tr><td>属性值继承</td><td>❌ 不支持</td><td>✅ 支持</td></tr><tr><td>内存占用</td><td>固定字段</td><td>稀疏存储（节省内存）</td></tr><tr><td>值验证/回调</td><td>手动实现</td><td>元数据内置支持</td></tr></tbody></table><h3 id="基本使用" tabindex="-1"><a class="header-anchor" href="#基本使用"><span>基本使用</span></a></h3><h4 id="定义dependencyproperty标识符" tabindex="-1"><a class="header-anchor" href="#定义dependencyproperty标识符"><span>定义DependencyProperty标识符</span></a></h4><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">public static readonly DependencyProperty TitleProperty =</span>
<span class="line">    DependencyProperty.Register(</span>
<span class="line">        &quot;Title&quot;,                      // 属性名</span>
<span class="line">        typeof(string),                // 属性类型</span>
<span class="line">        typeof(MainWindow),            // 所属类型</span>
<span class="line">        new PropertyMetadata(          // 元数据（默认值、回调等）</span>
<span class="line">            &quot;默认标题&quot;,                 // 默认值</span>
<span class="line">            OnTitleChanged,            // 属性值变化回调</span>
<span class="line">            CoerceTitle                // 强制值回调（可选）</span>
<span class="line">        )</span>
<span class="line">    );</span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="定义clr包装器" tabindex="-1"><a class="header-anchor" href="#定义clr包装器"><span>定义CLR包装器</span></a></h4><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">public string Title</span>
<span class="line">{</span>
<span class="line">    get =&gt; (string)GetValue(TitleProperty);</span>
<span class="line">    set =&gt; SetValue(TitleProperty, value);</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="可选回调方法" tabindex="-1"><a class="header-anchor" href="#可选回调方法"><span>可选回调方法</span></a></h4><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">private static void OnTitleChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)</span>
<span class="line">{</span>
<span class="line">    var win = (MainWindow)d;</span>
<span class="line">    Console.WriteLine($&quot;Title 改变: {e.OldValue} → {e.NewValue}&quot;);</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">private static object CoerceTitle(DependencyObject d, object baseValue)</span>
<span class="line">{</span>
<span class="line">    // 强制修正值，比如限制长度</span>
<span class="line">    string value = baseValue as string;</span>
<span class="line">    return string.IsNullOrWhiteSpace(value) ? &quot;默认标题&quot; : value;</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="值来源的优先级" tabindex="-1"><a class="header-anchor" href="#值来源的优先级"><span>值来源的优先级</span></a></h3><p>WPF 会根据以下 <strong>优先级</strong> 决定最终显示的值（高 → 低）：</p><ol><li><strong>动画值</strong>（如果有动画应用）</li><li><strong>本地值</strong>（直接 <code>SetValue</code> 或 XAML 属性赋值）</li><li><strong>样式触发器（Style Trigger）</strong></li><li><strong>模板触发器（Template Trigger）</strong></li><li><strong>样式 Setter</strong></li><li><strong>继承值</strong>（Property Value Inheritance）</li><li><strong>默认值</strong>（PropertyMetadata 里定义的）</li></ol><h3 id="附加属性" tabindex="-1"><a class="header-anchor" href="#附加属性"><span>附加属性</span></a></h3><p>附加属性是 <strong>定义在一个类上，但用在其他类上的依赖属性</strong>。 典型例子：<code>Grid.Row=&quot;1&quot;</code>。</p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">public static readonly DependencyProperty RowProperty =</span>
<span class="line">    DependencyProperty.RegisterAttached(</span>
<span class="line">        &quot;Row&quot;, typeof(int), typeof(Grid), new PropertyMetadata(0));</span>
<span class="line"></span>
<span class="line">public static void SetRow(UIElement element, int value) =&gt; element.SetValue(RowProperty, value);</span>
<span class="line">public static int GetRow(UIElement element) =&gt; (int)element.GetValue(RowProperty);</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="路由事件" tabindex="-1"><a class="header-anchor" href="#路由事件"><span>路由事件</span></a></h2><p>普通 .NET 事件（CLR Event）只会在 <strong>声明它的对象上触发</strong>， 而 <strong>路由事件</strong> 可以沿着 WPF 的 <strong>元素树</strong> 在多个元素之间传递。</p><p>这让你可以：</p><ul><li>在父控件监听子控件的事件</li><li>集中处理多个控件的事件</li><li>在控件模板中处理外部事件</li></ul><table><thead><tr><th>特性</th><th>CLR 事件</th><th>路由事件</th></tr></thead><tbody><tr><td>传播</td><td>只在当前对象</td><td>可沿元素树传播（冒泡/隧道/直接）</td></tr><tr><td>绑定位置</td><td>必须在触发对象上</td><td>可在父级统一处理</td></tr><tr><td>常见场景</td><td>普通业务逻辑</td><td>输入、鼠标、键盘、点击等 UI 事件</td></tr></tbody></table><h3 id="策略" tabindex="-1"><a class="header-anchor" href="#策略"><span>策略</span></a></h3><table><thead><tr><th>策略</th><th>传播方向</th><th>典型场景</th></tr></thead><tbody><tr><td><strong>冒泡（Bubble）</strong></td><td>从触发事件的元素 → 向上传递到根元素</td><td><code>Button.Click</code>、<code>MouseDown</code></td></tr><tr><td><strong>隧道（Tunnel）</strong></td><td>从根元素 → 向下传递到触发事件的元素</td><td>预处理事件，例如 <code>PreviewMouseDown</code></td></tr><tr><td><strong>直接（Direct）</strong></td><td>只在当前元素触发，不路由</td><td>类似 CLR 事件，例如 <code>Loaded</code></td></tr></tbody></table><p><strong>命名规律</strong></p><ul><li>冒泡事件：正常名称（如 <code>MouseDown</code>）</li><li>隧道事件：前面加 <code>Preview</code>（如 <code>PreviewMouseDown</code>）</li></ul><p><strong>路由事件传播过程</strong></p><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">Window</span>
<span class="line"> └── StackPanel</span>
<span class="line">      └── Button</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>点击 <code>Button</code> 时：</p><ol><li><strong>隧道事件</strong>：<code>Window.PreviewMouseDown</code> → <code>StackPanel.PreviewMouseDown</code> → <code>Button.PreviewMouseDown</code></li><li><strong>冒泡事件</strong>：<code>Button.MouseDown</code> → <code>StackPanel.MouseDown</code> → <code>Window.MouseDown</code></li></ol><h3 id="基本使用-1" tabindex="-1"><a class="header-anchor" href="#基本使用-1"><span>基本使用</span></a></h3><h4 id="定义一个路由事件" tabindex="-1"><a class="header-anchor" href="#定义一个路由事件"><span>定义一个路由事件</span></a></h4><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">public class MyControl : Button</span>
<span class="line">{</span>
<span class="line">    // 1. 注册路由事件</span>
<span class="line">    public static readonly RoutedEvent MyClickEvent =</span>
<span class="line">        EventManager.RegisterRoutedEvent(</span>
<span class="line">            &quot;MyClick&quot;,                // 事件名</span>
<span class="line">            RoutingStrategy.Bubble,   // 路由策略</span>
<span class="line">            typeof(RoutedEventHandler), // 事件处理委托类型</span>
<span class="line">            typeof(MyControl)         // 拥有事件的类型</span>
<span class="line">        );</span>
<span class="line"></span>
<span class="line">    // 2. CLR 事件包装器</span>
<span class="line">    public event RoutedEventHandler MyClick</span>
<span class="line">    {</span>
<span class="line">        add { AddHandler(MyClickEvent, value); }</span>
<span class="line">        remove { RemoveHandler(MyClickEvent, value); }</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    // 3. 触发事件</span>
<span class="line">    protected override void OnClick()</span>
<span class="line">    {</span>
<span class="line">        base.OnClick();</span>
<span class="line">        RaiseEvent(new RoutedEventArgs(MyClickEvent, this));</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="订阅路由事件" tabindex="-1"><a class="header-anchor" href="#订阅路由事件"><span>订阅路由事件</span></a></h4><ul><li>XAML方式：</li></ul><div class="language-XAML line-numbers-mode" data-highlighter="prismjs" data-ext="XAML"><pre><code class="language-XAML"><span class="line">&lt;local:MyControl MyClick=&quot;MyControl_MyClick&quot; /&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><ul><li>代码方式：</li></ul><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">myControl.AddHandler(MyControl.MyClickEvent, new RoutedEventHandler(MyControl_MyClick));</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="事件参数-routeeventargs" tabindex="-1"><a class="header-anchor" href="#事件参数-routeeventargs"><span>事件参数（<code>RouteEventArgs</code>）</span></a></h3><ul><li><strong><code>Source</code></strong>：原始触发事件的元素（可能是子元素）</li><li><strong><code>OriginalSource</code></strong>：最底层触发的对象</li><li><strong><code>Handled</code></strong>：如果设为 <code>true</code>，事件不会继续路由</li></ul><div class="language-CS line-numbers-mode" data-highlighter="prismjs" data-ext="CS"><pre><code class="language-CS"><span class="line">private void MyControl_MyClick(object sender, RoutedEventArgs e)</span>
<span class="line">{</span>
<span class="line">    Console.WriteLine(e.OriginalSource); // 打印最底层的控件</span>
<span class="line">    e.Handled = true; // 阻止事件继续冒泡</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="转换" tabindex="-1"><a class="header-anchor" href="#转换"><span>转换</span></a></h2><h2 id="画刷" tabindex="-1"><a class="header-anchor" href="#画刷"><span>画刷</span></a></h2><h2 id="特效" tabindex="-1"><a class="header-anchor" href="#特效"><span>特效</span></a></h2><h2 id="动画" tabindex="-1"><a class="header-anchor" href="#动画"><span>动画</span></a></h2><h2 id="行为" tabindex="-1"><a class="header-anchor" href="#行为"><span>行为</span></a></h2><h2 id="页面与导航" tabindex="-1"><a class="header-anchor" href="#页面与导航"><span>页面与导航</span></a></h2>`,77)]))}const r=s(l,[["render",p]]),o=JSON.parse('{"path":"/dotnet/wpf/basic.html","title":"基础篇","lang":"zh-CN","frontmatter":{"title":"基础篇","shortTitle":"基础篇","description":"WPF","date":"2025-07-12T17:36:33.000Z","categories":[".NET","WPF"],"tags":[".NET"]},"git":{"createdTime":1752018223000,"updatedTime":1754645138000,"contributors":[{"name":"Okita1027","username":"Okita1027","email":"96156298+Okita1027@users.noreply.github.com","commits":6,"url":"https://github.com/Okita1027"}]},"readingTime":{"minutes":8.1,"words":2430},"filePathRelative":"dotnet/wpf/basic.md"}');export{r as comp,o as data};
