---
title: 布局与控件
shortTitle: 组件
description: 布局与控件
date: 2025-07-12 17:36:33
categories: [.NET, WPF]
tags: [.NET]
order: 3
---

[电子书：深入浅出WPF](./深入浅出WPF.pdf)

## 控件父类

### DispatcherObject



### DependencyObject



### Visual



### UIElement



### FrameworkElement





## 布局控件

### Panel基类



### Grid网格



### UniformGrid均分



### StackPanel栈式



### WrapPanel瀑布流



### DockPanel停靠

DockPanel是WPF中的一种布局控件，它允许子元素沿着面板的边缘停靠（停靠布局）。

**基本用法：**

```XAML
<DockPanel>
    <Button DockPanel.Dock="Top">顶部按钮</Button>
    <Button DockPanel.Dock="Bottom">底部按钮</Button>
    <Button DockPanel.Dock="Left">左侧按钮</Button>
    <Button DockPanel.Dock="Right">右侧按钮</Button>
    <Button>中心内容</Button>
</DockPanel>
```

```XAML
<DockPanel>
    <!-- 第一个元素：停靠到顶部，占据整个顶部区域 -->
    <Border DockPanel.Dock="Top" Height="50" Background="Red" />
    
    <!-- 第二个元素：停靠到底部，占据剩余区域的底部 -->
    <Border DockPanel.Dock="Bottom" Height="50" Background="Blue" />
    
    <!-- 第三个元素：停靠到左侧，占据剩余区域的左侧 -->
    <Border DockPanel.Dock="Left" Width="100" Background="Green" />
    
    <!-- 第四个元素：停靠到右侧，占据剩余区域的右侧 -->
    <Border DockPanel.Dock="Right" Width="100" Background="Yellow" />
    
    <!-- 最后一个元素：填充剩余的中心区域 -->
    <Border Background="Purple" />
</DockPanel>
```

**角落由谁决定**：

结论：谁先声明谁决定

```XAML
<DockPanel>
    <Border DockPanel.Dock="Top" Height="50">外层顶部</Border>
    <Border DockPanel.Dock="Left" Width="100">外层左侧</Border>
</DockPanel>
```

```XAML
+---------------------------+
|        顶部区域           |  ← 第一个声明，停靠到顶部
+-----+---------------------+
| 左  |                     |
| 侧  |    剩余内容区域      |
| 区  |                     |
| 域  |                     |
+-----+---------------------+
```

若调换声明的顺序

```XAML
<DockPanel>
    <Border DockPanel.Dock="Left" Width="100">外层左侧</Border>
    <Border DockPanel.Dock="Top" Height="50">外层顶部</Border>
</DockPanel>
```

```XAML
+-----+---------------------+
| 左  |      顶部区域        |  ← 第一个声明，停靠到左侧
| 侧  +---------------------+
| 区  |                     |
| 域  |    剩余内容区域      |
|     |                     |
+-----+---------------------+
```



**相关属性**：

- LastChildFill

```XAML
<DockPanel LastChildFill="True">
    <!-- 默认为True，最后一个子元素填充剩余空间 -->
</DockPanel>
```

- 嵌套Dock

```XAML
<DockPanel>
    <DockPanel DockPanel.Dock="Left" Width="200">
        <!-- 左侧区域可以有自己的停靠布局 -->
        <Button DockPanel.Dock="Top" Height="30">左侧顶部</Button>
        <ListBox>左侧列表</ListBox>
    </DockPanel>
    
    <Button>主内容区域</Button>
</DockPanel>
```





### Canvas绝对



### Border边框


## 内容控件



## 集合控件



## 图形控件



## 数据绑定

```mathematica
📌 WPF 数据绑定 Data Binding
│
├── 1. 绑定的基本元素
│     ├── 目标（Target）→ UI 控件的属性（TextBox.Text）
│     ├── 源（Source）→ 数据对象（Person.Name）
│     ├── 路径（Path）→ 属性名（"Name"）
│     └── 模式（Mode）
│           ├── OneTime       → 源 → 目标（一次性）
│           ├── OneWay        → 源 → 目标（实时）
│           ├── TwoWay        → 源 ↔ 目标（双向）
│           ├── OneWayToSource→ 目标 → 源
│           └── Default       → 控件默认绑定模式
│
├── 2. 数据源类型（Source）
│     ├── 普通对象（POCO）
│     ├── 集合（ObservableCollection<T>）
│     ├── 另一个控件（ElementName）
│     ├── 静态资源（StaticResource / x:Static）
│     ├── RelativeSource（绑定到父级控件）
│     └── 依赖属性（DependencyProperty）
│
├── 3. 数据更新机制
│     ├── 单个属性更新 → INotifyPropertyChanged
│     └── 集合更新     → ObservableCollection<T>
│
├── 4. 高级绑定技巧
│     ├── 值转换（IValueConverter / IMultiValueConverter）
│     ├── 多重绑定（MultiBinding）
│     ├── 优先级绑定（PriorityBinding）
│     ├── 数据校验（Validation Rules / IDataErrorInfo）
│     └── 异步绑定（IsAsync=True）
│
├── 5. DataContext
│     ├── 控件的 DataContext（决定绑定源是谁）
│     ├── 继承机制（子控件会继承父控件的 DataContext）
│     └── 常用设置方式
│           ├── XAML 静态绑定（StaticResource）
│           └── 代码动态设置（this.DataContext = obj）
│
└── 6. MVVM 模式中的绑定
      ├── ViewModel 作为 DataContext
      ├── 属性更新通知（INotifyPropertyChanged）
      ├── 命令绑定（ICommand + Button.Command）
      └── 集合绑定（ItemsControl.ItemsSource）
```

## 样式

```mathematica
📌 WPF 样式（Style）
│
├── 1. 样式的作用
│     ├── 统一控件外观（替代重复的属性设置）
│     ├── 主题化 UI（暗色 / 浅色主题切换）
│     └── 支持动态切换（DynamicResource）
│
├── 2. 样式的基本结构
│     ├── TargetType（目标控件类型）
│     ├── Setters（属性赋值）
│     └── Triggers（触发器，条件改变样式）
│
├── 3. 样式的分类
│     ├── 显式样式（有 x:Key，手动引用）
│     ├── 隐式样式（无 x:Key，自动应用到指定类型控件）
│     └── 基于样式（BasedOn，样式继承）
│
├── 4. 样式的作用域
│     ├── 控件内部（直接定义在控件.Resources）
│     ├── 窗口级（Window.Resources）
│     ├── 应用级（App.xaml → Application.Resources）
│     └── 外部资源字典（ResourceDictionary）
│
├── 5. 触发器（Triggers）
│     ├── 属性触发器（PropertyTrigger）
│     ├── 数据触发器（DataTrigger）
│     ├── 多条件触发器（MultiTrigger / MultiDataTrigger）
│     └── 事件触发器（EventTrigger）
│
├── 6. 样式与模板
│     ├── ControlTemplate（控件外观重定义）
│     ├── DataTemplate（数据呈现方式）
│     └── ItemTemplate（列表数据项样式）
│
├── 7. 动态样式
│     ├── StaticResource（静态资源，加载时固定）
│     ├── DynamicResource（动态资源，运行时可切换）
│     └── 主题切换（换 ResourceDictionary）
│
└── 8. 高级技巧
      ├── 基于主题的资源字典（Light.xaml / Dark.xaml）
      ├── 样式合并（MergedDictionaries）
      ├── 结合绑定（在 Setter 中用 Binding）
      └── 与附加属性配合（自定义控件扩展样式）
```



## 模板

**WPF 模板（Template）**，它和样式（Style）关系密切，但功能更强，直接决定了控件**长什么样、内部结构怎么组成**。

```mathematica
📌 WPF 模板（Template）
│
├── 1. 模板的作用
│     ├── 重定义控件的外观（UI结构）
│     ├── 将数据与UI分离（可复用）
│     ├── 允许主题/皮肤替换
│
├── 2. 模板类型
│     ├── ControlTemplate —— 控件外观定义
│     │       🎯 改变控件结构和视觉表现（按钮、文本框等）
│     │       📌 常与 Style 配合使用
│     │       📌 关键点：
│     │           - TargetType 指定控件类型
│     │           - VisualTree 定义控件的可视树
│     │           - TemplateBinding 绑定控件属性
│     │           - Triggers 处理状态变化
│     │
│     ├── DataTemplate —— 数据到 UI 的映射
│     │       🎯 定义数据项如何显示
│     │       📌 常用于 ListBox、ListView、ComboBox
│     │       📌 关键点：
│     │           - 绑定到数据属性（{Binding Name}）
│     │           - 可嵌套布局和其他控件
│     │
│     ├── HierarchicalDataTemplate —— 分层数据模板
│     │       🎯 树形结构展示（TreeView）
│     │       📌 ItemsSource 绑定子集合
│     │
│     └── ItemsPanelTemplate —— 定义容器布局
│             🎯 指定 ItemsControl 的内部布局面板
│             📌 例如：ListBox 默认 StackPanel，可改为 WrapPanel/Grid
│
├── 3. 模板关键技术
│     ├── TemplateBinding —— 将模板元素属性绑定到控件属性
│     ├── ContentPresenter —— 占位符，显示控件的 Content
│     ├── ItemsPresenter —— 占位符，显示 ItemsControl 的子项
│     └── PART_xxx 命名约定（自定义控件必备的模板部件）
│
├── 4. 模板与样式的关系
│     ├── 样式（Style）可以包含模板
│     ├── 样式修改外观的简单场景（Setter）
│     └── 模板用于完全重绘控件
│
├── 5. 模板触发器
│     ├── Trigger（属性触发）
│     ├── DataTrigger（绑定数据触发）
│     └── EventTrigger（事件触发）
│
└── 6. 高级用法
      ├── 动态加载模板（DynamicResource）
      ├── 基于主题切换模板
      ├── 多模板切换（DataTemplateSelector）
      └── 自定义控件与默认模板（Generic.xaml）
```

## 命令

**WPF 命令（Command）**，它是 MVVM 模式的核心之一，能把 **用户操作** 和 **执行逻辑** 解耦，让代码更干净。

```mathematica
📌 WPF 命令系统
│
├── 1. 命令的作用
│     ├── 解耦 UI 和业务逻辑（不用在事件里写逻辑）
│     ├── 支持命令状态（能否执行）
│     ├── 支持键盘快捷键、菜单、工具栏统一触发
│     ├── MVVM 模式下 View 和 ViewModel 的桥梁
│
├── 2. 命令的分类
│     ├── 预定义命令（RoutedCommand）
│     │       📌 ApplicationCommands（Copy、Paste、Undo…）
│     │       📌 NavigationCommands（BrowseBack、BrowseForward…）
│     │       📌 MediaCommands（Play、Pause…）
│     │       📌 EditingCommands（Bold、Italic…）
│     │
│     ├── 自定义命令
│     │       📌 RoutedCommand（UI 路由命令）
│     │       📌 ICommand（MVVM 自定义）
│
├── 3. 核心接口
│     ├── ICommand
│     │       - Execute(object parameter)       👉 执行命令
│     │       - CanExecute(object parameter)    👉 命令是否可执行
│     │       - CanExecuteChanged 事件          👉 通知 UI 更新状态
│     │
│     ├── RoutedCommand
│     │       - 有命令路由（冒泡、隧道）
│     │       - 常用于多层 UI 控件间传递
│
├── 4. 命令绑定
│     ├── Command（按钮绑定命令）
│     ├── CommandParameter（传递参数）
│     ├── CommandTarget（指定命令作用对象）
│
├── 5. 常见实现方式
│     ├── 事件绑定命令（CommandBinding）
│     │       - 适用于 Code-behind
│     │
│     ├── MVVM RelayCommand（DelegateCommand）
│     │       - ViewModel 中用委托实现 ICommand
│     │
│     ├── Prism DelegateCommand / ReactiveCommand
│
├── 6. 命令路由机制（RoutedCommand）
│     ├── 事件路由模式（Bubble / Tunnel / Direct）
│     ├── 从触发控件开始向上传递，直到被处理
│
└── 7. 高级技巧
      ├── 动态更新 CanExecute（调用 CommandManager.InvalidateRequerySuggested）
      ├── 命令参数绑定（CommandParameter 绑定 SelectedItem、Text 等）
      ├── 多命令合并执行
      └── 异步命令（防止 UI 卡顿）
```



## 依赖属性

**依赖属性** 是继承自 `DependencyObject` 的类通过 WPF 属性系统注册的特殊属性，
 它比普通 .NET 属性（CLR 属性）多了很多“附加能力”：

- 🔄 **支持数据绑定**（Binding）
- 🎨 **支持样式（Style）和模板（Template）自动应用值**
- 🎬 **支持动画（Animation）**
- 🛠 **支持属性值继承（Property Value Inheritance）**
- 🚀 **支持高性能的属性存储（内部用稀疏存储，节省内存）**
- 📝 **支持验证、回调、强制 Coerce 值**

依赖属性不是普通字段存储的值，而是存储在 **WPF 属性系统的依赖属性存储表** 中。
 它有一个全局唯一的 **DependencyProperty 标识符**（`xxxProperty`），WPF 用它来查找和设置值。

| 特性        | CLR 属性 | 依赖属性             |
| ----------- | -------- | -------------------- |
| 数据绑定    | ❌ 不支持 | ✅ 支持               |
| 样式/动画   | ❌ 不支持 | ✅ 支持               |
| 属性值继承  | ❌ 不支持 | ✅ 支持               |
| 内存占用    | 固定字段 | 稀疏存储（节省内存） |
| 值验证/回调 | 手动实现 | 元数据内置支持       |

### 基本使用

#### 定义DependencyProperty标识符

```CS
public static readonly DependencyProperty TitleProperty =
    DependencyProperty.Register(
        "Title",                      // 属性名
        typeof(string),                // 属性类型
        typeof(MainWindow),            // 所属类型
        new PropertyMetadata(          // 元数据（默认值、回调等）
            "默认标题",                 // 默认值
            OnTitleChanged,            // 属性值变化回调
            CoerceTitle                // 强制值回调（可选）
        )
    );

```

#### 定义CLR包装器

```CS
public string Title
{
    get => (string)GetValue(TitleProperty);
    set => SetValue(TitleProperty, value);
}
```

#### 可选回调方法

```CS
private static void OnTitleChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
{
    var win = (MainWindow)d;
    Console.WriteLine($"Title 改变: {e.OldValue} → {e.NewValue}");
}

private static object CoerceTitle(DependencyObject d, object baseValue)
{
    // 强制修正值，比如限制长度
    string value = baseValue as string;
    return string.IsNullOrWhiteSpace(value) ? "默认标题" : value;
}
```

### 值来源的优先级

WPF 会根据以下 **优先级** 决定最终显示的值（高 → 低）：

1. **动画值**（如果有动画应用）
2. **本地值**（直接 `SetValue` 或 XAML 属性赋值）
3. **样式触发器（Style Trigger）**
4. **模板触发器（Template Trigger）**
5. **样式 Setter**
6. **继承值**（Property Value Inheritance）
7. **默认值**（PropertyMetadata 里定义的）

### 附加属性

附加属性是 **定义在一个类上，但用在其他类上的依赖属性**。
典型例子：`Grid.Row="1"`。

```CS
public static readonly DependencyProperty RowProperty =
    DependencyProperty.RegisterAttached(
        "Row", typeof(int), typeof(Grid), new PropertyMetadata(0));

public static void SetRow(UIElement element, int value) => element.SetValue(RowProperty, value);
public static int GetRow(UIElement element) => (int)element.GetValue(RowProperty);
```



## 路由事件

普通 .NET 事件（CLR Event）只会在 **声明它的对象上触发**，
 而 **路由事件** 可以沿着 WPF 的 **元素树** 在多个元素之间传递。

这让你可以：

- 在父控件监听子控件的事件
- 集中处理多个控件的事件
- 在控件模板中处理外部事件

| 特性     | CLR 事件         | 路由事件                         |
| -------- | ---------------- | -------------------------------- |
| 传播     | 只在当前对象     | 可沿元素树传播（冒泡/隧道/直接） |
| 绑定位置 | 必须在触发对象上 | 可在父级统一处理                 |
| 常见场景 | 普通业务逻辑     | 输入、鼠标、键盘、点击等 UI 事件 |

### 策略

| 策略               | 传播方向                            | 典型场景                            |
| ------------------ | ----------------------------------- | ----------------------------------- |
| **冒泡（Bubble）** | 从触发事件的元素 → 向上传递到根元素 | `Button.Click`、`MouseDown`         |
| **隧道（Tunnel）** | 从根元素 → 向下传递到触发事件的元素 | 预处理事件，例如 `PreviewMouseDown` |
| **直接（Direct）** | 只在当前元素触发，不路由            | 类似 CLR 事件，例如 `Loaded`        |

**命名规律**

- 冒泡事件：正常名称（如 `MouseDown`）
- 隧道事件：前面加 `Preview`（如 `PreviewMouseDown`）

**路由事件传播过程**

```CS
Window
 └── StackPanel
      └── Button
```

点击 `Button` 时：

1. **隧道事件**：`Window.PreviewMouseDown` → `StackPanel.PreviewMouseDown` → `Button.PreviewMouseDown`
2. **冒泡事件**：`Button.MouseDown` → `StackPanel.MouseDown` → `Window.MouseDown`

### 基本使用

#### 定义一个路由事件

```CS
public class MyControl : Button
{
    // 1. 注册路由事件
    public static readonly RoutedEvent MyClickEvent =
        EventManager.RegisterRoutedEvent(
            "MyClick",                // 事件名
            RoutingStrategy.Bubble,   // 路由策略
            typeof(RoutedEventHandler), // 事件处理委托类型
            typeof(MyControl)         // 拥有事件的类型
        );

    // 2. CLR 事件包装器
    public event RoutedEventHandler MyClick
    {
        add { AddHandler(MyClickEvent, value); }
        remove { RemoveHandler(MyClickEvent, value); }
    }

    // 3. 触发事件
    protected override void OnClick()
    {
        base.OnClick();
        RaiseEvent(new RoutedEventArgs(MyClickEvent, this));
    }
}
```

#### 订阅路由事件

- XAML方式：

```XAML
<local:MyControl MyClick="MyControl_MyClick" />
```

- 代码方式：

```CS
myControl.AddHandler(MyControl.MyClickEvent, new RoutedEventHandler(MyControl_MyClick));
```

### 事件参数（`RouteEventArgs`）

- **`Source`**：原始触发事件的元素（可能是子元素）
- **`OriginalSource`**：最底层触发的对象
- **`Handled`**：如果设为 `true`，事件不会继续路由

```CS
private void MyControl_MyClick(object sender, RoutedEventArgs e)
{
    Console.WriteLine(e.OriginalSource); // 打印最底层的控件
    e.Handled = true; // 阻止事件继续冒泡
}
```



## 转换



## 画刷



## 特效



## 动画



## 行为



## 页面与导航

