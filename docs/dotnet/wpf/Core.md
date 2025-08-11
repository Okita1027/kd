---
title: WPF内部世界
shortTitle: 内部世界
description: WPF内部世界
date: 2025-08-11 11:46:33
categories: [.NET, WPF]
tags: [.NET]
header: [1, 5]
author:
  name: Okita
  url: https://zhiyun.space
  email: 2368932388@qq.com
order: 4
---

# Binding

## 基础

**定义：** Binding 把目标（Target，通常是某个控件的依赖属性）和源（Source，POCO/VM/静态资源/控件等）连接起来，自动把数据从源同步到目标，或双向同步。

**目标必须是依赖属性**（DependencyProperty），源可以是任意对象的普通 CLR 属性（但要想自动更新 UI，源需要实现通知机制，如 `INotifyPropertyChanged`）。

**四要素：**

- **目标（Target）**：要更新的 UI 属性，例如 `TextBox.Text`。目标必须是依赖属性（`DependencyProperty`）。
- **源（Source）**：数据来自哪里（DataContext、ElementName、RelativeSource、显式 Source 等）。
- **路径（Path）**：源对象上的成员路径，例如 `User.Name`、`Orders[0].Price`。
- **模式（Mode）**：数据流向：`OneWay` / `TwoWay` / `OneTime` / `OneWayToSource` / `Default`。

**常用属性**

- `Path`：绑定路径（要取的源属性）
- `Mode`：绑定模式（`OneWay` / `TwoWay` / `OneTime` / `OneWayToSource` / `Default`）
- `UpdateSourceTrigger`：什么时候把目标值更新回源（`PropertyChanged` / `LostFocus` / `Explicit`）
- `Converter` / `ConverterParameter`：值转换器与参数
- `FallbackValue`：当绑定失败时显示的值
- `TargetNullValue`：源为 null 时使用的值
- `IsAsync`：是否异步读取源，避免 UI 阻塞（用于耗时绑定）

## Source与Path

### 绑定源的方式

1. **DataContext（最常用）**

- 在父容器设置 `DataContext = viewModel`，子控件继承，用 `Path` 指定属性。
- 优点：最简洁、配合 MVVM 最自然。

2. **ElementName**

- 绑定到 XAML 中另一个已命名元素的属性。
- 例：`{Binding Text, ElementName=txtInput}`

3. **RelativeSource**

- 绑定到相对元素（`Self`、`TemplatedParent`、`FindAncestor`）。
- 例：`{Binding DataContext.SomeProp, RelativeSource={RelativeSource AncestorType={x:Type Window}}}`

4. **Source**

- 显式指定一个对象作为源（常用于静态对象或单例）。
- 例：`{Binding Path=Title, Source={StaticResource AppInfo}}`

5. **StaticResource / x:Static**

- 绑定到静态资源或静态字段（不是真正 Binding，但常混用）。

### Path语法

- 点语法：`Person.Address.Street`
- 索引器：`Orders[0].Product.Name` 或 `MyDict[Key]`
- 绑定到整个对象：`{Binding}` 或 `{Binding .}`（把对象本身赋给目标）
- 绑定附加属性：`Path=(Canvas.Left)`（注意括号）
- 绑定集合的属性：`ItemsSource="{Binding MyCollection}"`

```XAML
<!-- ElementName -->
<TextBox x:Name="txtA" />
<TextBlock Text="{Binding Text, ElementName=txtA}" />

<!-- RelativeSource: 绑定到上层 Window 的 DataContext.SomeProp -->
<TextBlock Text="{Binding DataContext.SomeProp, RelativeSource={RelativeSource AncestorType={x:Type Window}}}" />

<!-- Source: 显式对象 -->
<Window.Resources>
  <local:AppInfo x:Key="AppInfo" Title="我的应用"/>
</Window.Resources>
<TextBlock Text="{Binding Title, Source={StaticResource AppInfo}}"/>
```

> [!NOTE]
>
> `DataContext` 是继承的（子控件默认继承父控件的 DataContext），但 `ElementName`/`Source`/`RelativeSource` 可覆盖。
>
> 目标必须是 DependencyProperty，否则绑定不会工作（不会报错，但无效）。
>
> 当绑定路径无效或类型不匹配时，会在输出窗口打印绑定错误（调试工具很重要）。

## 对数据的转换和校验

### 值转换

当源与目标类型/显示格式不匹配时，用 `IValueConverter` 做“单值转换”。

```CS
public class BoolToVisibilityConverter : IValueConverter {
  public object Convert(object value, Type targetType, object parameter, CultureInfo culture) {
    return (value is bool b && b) ? Visibility.Visible : Visibility.Collapsed;
  }
  public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture) {
    return value is Visibility v && v == Visibility.Visible;
  }
}
```

XAML 注册并使用：

```XAML
<Window.Resources>
  <local:BoolToVisibilityConverter x:Key="B2V"/>
</Window.Resources>

<TextBlock Visibility="{Binding IsEnabled, Converter={StaticResource B2V}}"/>
```

- `Convert`：源 → 目标；`ConvertBack`：目标 → 源（双向时需要）
- `ConverterParameter` 可传额外参数
- `Culture` 用于区域化格式（数字/时间）

### 多值转换

当目标需要来自多个源时用 `IMultiValueConverter`（见 MultiBinding 部分）。

### 校验

#### `ValidationRule`(自定义规则)

创建验证规则类并在 Binding 中启用：

```CS
public class NotEmptyRule : ValidationRule {
  public override ValidationResult Validate(object value, CultureInfo cultureInfo) {
    if (string.IsNullOrWhiteSpace((value ?? "").ToString())) return new ValidationResult(false, "不能为空");
    return ValidationResult.ValidResult;
  }
}
```

XAML中使用：

```XAML
<TextBox>
  <TextBox.Text>
    <Binding Path="Name" UpdateSourceTrigger="PropertyChanged" ValidatesOnExceptions="True" NotifyOnValidationError="True">
      <Binding.ValidationRules>
        <local:NotEmptyRule />
      </Binding.ValidationRules>
    </Binding>
  </TextBox.Text>
</TextBox>
```

#### `IDataErrorInfo`（同步校验）

在 Model/VM 实现 `IDataErrorInfo`：

```CS
public class Person : IDataErrorInfo, INotifyPropertyChanged {
  public string Name { get => name; set { name=value; OnPropertyChanged(); } }
  public string this[string columnName] {
    get {
      if (columnName=="Name" && string.IsNullOrWhiteSpace(Name)) return "姓名必填";
      return null;
    }
  }
  public string Error => null;
}
```

在XAML中使用：

```XAML
<TextBox Text="{Binding Name, ValidatesOnDataErrors=True, NotifyOnValidationError=True, UpdateSourceTrigger=PropertyChanged}" />
```

#### `INotifyDataErrorInfo`（支持异步、多错误）

实现更灵活的异步/多错误通知，UI 会在 `ErrorsChanged` 时更新。

#### `ExceptionValidationRule`

当源属性 setter 抛异常时用于捕获（`ValidatesOnExceptions=True`）。

#### 展示验证错误（ErrorTemplate）

默认验证时会有红色边框，但你也可以自定义 `Validation.ErrorTemplate`：

```XAML
<Style TargetType="TextBox">
  <Setter Property="Validation.ErrorTemplate">
    <Setter.Value>
      <ControlTemplate>
        <DockPanel>
          <Border BorderBrush="Red" BorderThickness="1">
            <AdornedElementPlaceholder />
          </Border>
          <TextBlock Foreground="Red" Text="{Binding [0].ErrorContent}" Margin="4,0,0,0"/>
        </DockPanel>
      </ControlTemplate>
    </Setter.Value>
  </Setter>
</Style>
```

### 转换与校验的调用顺序

- **从源到目标**：源 -> (Validate? 主要用于更新源时) -> Converter.Convert -> 目标显示
- **从目标到源（TwoWay）**：目标改变 -> (Converter.ConvertBack) -> Validation（ValidationRules / IDataErrorInfo / INotifyDataErrorInfo） -> 源属性写入

## MultiBinding

`MultiBinding` 是一个高级的 `Binding` 类型，它允许你将一个目标属性绑定到**多个数据源**。

**作用**: 当目标属性的值依赖于多个源属性时，`MultiBinding` 就派上用场了。它需要一个 `IMultiValueConverter` 来将多个值组合成一个值。

**示例：** 假设你想将 `TextBlock` 的 `Text` 属性绑定到 `FirstName` 和 `LastName` 两个属性，并将它们组合成一个完整的名字。

1. C#中实现`IMultiValueConverter`

   ```cs
   public class FullNameConverter : IMultiValueConverter
   {
       public object Convert(object[] values, Type targetType, object parameter, CultureInfo culture)
       {
           return $"{values[0]} {values[1]}";
       }
       // ... ConvertBack 略
   }
   ```

2. XAML中使用`IMultiBinding`

   ```xaml
   <TextBlock>
       <TextBlock.Text>
           <MultiBinding Converter="{StaticResource FullNameConverter}">
               <Binding Path="FirstName" />
               <Binding Path="LastName" />
           </MultiBinding>
       </TextBlock.Text>
   </TextBlock>
   ```

如此，`TextBlock` 就会显示出完整的名字。

# Property





| 特性           | CLR 属性  | 依赖属性                 | 附加属性               |
| -------------- | --------- | ------------------------ | ---------------------- |
| 定义位置       | 任意类    | 继承 `DependencyObject`  | 任意类                 |
| 存储方式       | .NET 字段 | WPF 属性系统（稀疏存储） | WPF 属性系统           |
| 支持数据绑定   | ❌         | ✅                        | ✅                      |
| 支持样式与动画 | ❌         | ✅                        | ✅                      |
| 支持属性值继承 | ❌         | ✅                        | ✅（可选）              |
| 是否需要注册   | ❌         | 必须注册                 | 必须注册               |
| 常见场景       | 业务数据  | 控件属性、UI 绑定        | 容器对子元素的布局规则 |

## CLR属性

CLR 属性就是普通的 C# 属性，本质上是字段的封装，具有 `get`/`set` 方法，由编译器生成对应的 IL 代码。

```CS
public class Person
{
    public string Name { get; set; }  // 自动属性
}
```

**特点**

- **完全由 C# 管理**，运行时存储在对象实例中。
- **不支持 WPF 高级功能**：样式、动画、数据绑定、依赖属性值继承等。
- 访问速度快，适合普通业务属性（如后台逻辑、非 UI 数据）。

**使用场景**

- 与 UI 无关的数据（如模型层 `Model` 的属性）。
- 不需要 XAML 绑定或样式支持的简单配置。

## 依赖属性

依赖属性是 WPF 的核心属性系统，由 `DependencyObject` 管理，用于支持：

- 数据绑定（Binding）
- 样式（Style）
- 动画（Animation）
- 属性值继承（Value Inheritance）
- 默认值与元数据（PropertyMetadata）

依赖属性是一个 `public static readonly DependencyProperty` 字段 + CLR 包装器组成：

```CS
public class MyButton : Button
{
    // 1. 注册依赖属性
    public static readonly DependencyProperty IsSpinningProperty =
        DependencyProperty.Register(
            "IsSpinning",       // 属性名
            typeof(bool),       // 类型
            typeof(MyButton),   // 拥有者类型
            new PropertyMetadata(false) // 默认值
        );

    // 2. CLR 包装器（让代码像普通属性一样访问）
    public bool IsSpinning
    {
        get => (bool)GetValue(IsSpinningProperty);
        set => SetValue(IsSpinningProperty, value);
    }
}
```

**依赖属性值的来源优先级**（从高到低）：

1. **本地值**（`SetValue`、XAML 直接设置）
2. **动画值**
3. **样式触发器值**
4. **样式 Setter 值**
5. **继承值**（Value Inheritance）
6. **默认值**（PropertyMetadata）

## 附加属性

附加属性是一种特殊的依赖属性，**允许一个对象在另一个对象上存储值**。

**作用**:

- 为非自己类型的对象附加额外信息
- 常用于 **布局容器** 给子元素附加布局规则

**优势**

- 让不同类型的对象间共享属性（解耦）
- 在 XAML 中提供简洁的标记方式
- 适合容器对子元素附加的布局或行为信息

**使用场景**

- 布局（`Grid.Row`, `Canvas.Left`）
- 行为扩展（`ToolTipService.ToolTip`）
- MVVM 附加行为（Blend Behaviors）

**使用方法**

附加属性需要显式定义 `Get`/`Set` 方法：

```CS
public static class CanvasHelper
{
    public static readonly DependencyProperty LeftProperty =
        DependencyProperty.RegisterAttached(
            "Left",         // 属性名
            typeof(double), // 类型
            typeof(CanvasHelper),
            new PropertyMetadata(0.0)
        );

    public static void SetLeft(UIElement element, double value)
    {
        element.SetValue(LeftProperty, value);
    }

    public static double GetLeft(UIElement element)
    {
        return (double)element.GetValue(LeftProperty);
    }
}
```

```XAML
<Canvas>
    <Button Content="OK" Canvas.Left="50" Canvas.Top="30" />
</Canvas>
```

这里的 `Canvas.Left` 就是 **附加属性**，它属于 `Canvas`，但作用在 `Button` 上。





# Event

## WPF树形结构

**逻辑树（Logical Tree）**
 描述“应用的语义结构”——哪些控件包含哪些子项（例如 Window → Grid → Button）。资源查找、`DataContext` 继承、某些属性继承等与逻辑树密切相关。

**视觉树（Visual Tree）**
 描述“实际渲染的视觉元素”——一个控件（比如 Button）可能在视觉树里展开为 Border、ContentPresenter、TextBlock 等子可视元素。视觉树更精细、更接近渲染器。

**路由事件走哪棵树？**
 路由事件沿“元素树（element tree）”传播，具体走哪棵树取决于元素类型：

- 如果元素是 `Visual`/`Visual3D`，事件以 **视觉树** 为路线；
- 如果是 `ContentElement` / `FrameworkContentElement`（不是 Visual），则使用 **逻辑树**。
   也就是说，事件总是沿某个“父子关系链”传递——理解你界面的视觉树与逻辑树对调试事件至关重要。

## 声明周期、产生与传播流程

### 事件产生

用户交互（鼠标、键盘、触摸）由底层输入系统产生相应的事件对象（例如 `MouseButtonEventArgs`、`KeyEventArgs`）。

控件内部逻辑也可以“生成”或“包装”事件（比如 `Button` 会基于鼠标事件决定是否 raise `Click`）。

程序也可以自己 `RaiseEvent(...)` 来触发一个路由事件（常用于自定义控件）。

### 事件对象

大多数路由事件使用 `RoutedEventArgs` 或其子类（如 `MouseButtonEventArgs`）。重要属性：

- `RoutedEvent`：事件标识符
- `Source`：事件当前的源（可能在路由过程中被修改）
- `OriginalSource`：最初发出事件的元素（不会改变）
- `Handled`：布尔，标记事件已被处理（后续默认处理会停止）

### 传播顺序

以鼠标单击某个 Button 为例，完整顺序（简化）：

1. **隧道阶段（Tunneling）**：从根向目标“向下”传递，隧道事件名通常以 `Preview` 为前缀（例如 `Window.PreviewMouseDown` → `StackPanel.PreviewMouseDown` → `Button.PreviewMouseDown`）。
2. **目标元素处理**：到达目标，目标先处理自己的隧道和直接逻辑，目标可能 `RaiseEvent` 其它事件（例如 `Click`）。
3. **冒泡阶段（Bubbling）**：从目标向上回传，父元素、祖先按层次接收冒泡事件（例如 `Button.MouseDown` → `StackPanel.MouseDown` → `Window.MouseDown`）。

> [!note]
>
> 并非所有事件都有隧道/冒泡对（有些是直接事件），并且某些控件会在内部把低级输入事件标记为 `Handled=true`，从而阻止冒泡（例如 `Button` 常常“吃掉”鼠标事件并仅暴露 `Click`）。

### 事件被拦截/停止传播

- 在任何处理器中设置 `e.Handled = true` 会停止后续默认的路由（后面节点不会收到该事件，除非某些 handler 注册时允许接收已处理事件）。
- 如果确实需要“仍然收到已处理的事件”，可以使用 `AddHandler(routedEvent, handler, handledEventsToo: true)` 来注册（`handledEventsToo=true` 即使 `Handled==true` 仍然会调用）。

## 路由事件

### 路由策略

- `RoutingStrategy.Tunnel`（隧道）—— 从根到目标（Preview）
- `RoutingStrategy.Bubble`（冒泡）—— 从目标向上到根
- `RoutingStrategy.Direct`（直接）—— 只在源处触发（像 CLR 事件）

### 绑定/订阅事件

XAML绑定：

```XAML
<Button Click="OnButtonClick" />
```

代码绑定（实例）：

```CS
myButton.Click += OnButtonClick; // 语法糖，内部调用 AddHandler 但 handledEventsToo=false
```

通用 AddHandler（允许接收已处理事件）：

```CS
parent.AddHandler(ButtonBase.ClickEvent, new RoutedEventHandler(Parent_ButtonClick), handledEventsToo: true);
```

## 自定义路由事件（注册、包装、触发）

完整流程示例（在自定义控件中）：

```CS
public class MyControl : Control
{
    // 1. 注册 RoutedEvent（静态字段）
    public static readonly RoutedEvent DingEvent =
        EventManager.RegisterRoutedEvent(
            "Ding",
            RoutingStrategy.Bubble,                 // Bubble / Tunnel / Direct
            typeof(RoutedEventHandler),
            typeof(MyControl)
        );

    // 2. 提供 CLR 事件包装（便于 += / -=）
    public event RoutedEventHandler Ding
    {
        add { AddHandler(DingEvent, value); }
        remove { RemoveHandler(DingEvent, value); }
    }

    // 3. 在合适时机触发事件
    protected void RaiseDing()
    {
        var args = new RoutedEventArgs(DingEvent, this); // 第二参数是 Source（可省）
        RaiseEvent(args);
    }

    // 举例：当某个动作发生时调用 RaiseDing()
}
```

XAML或父级可以订阅：

```XAML
<local:MyControl Ding="MyControl_Ding" />
```

事件处理器签名：

```CS
void MyControl_Ding(object sender, RoutedEventArgs e) { /*...*/ }
```



`OriginalSource` vs `Source`

- `OriginalSource`：事件最初发出的位置（例如 TextBlock 内部的 Run）——**不会变**。
- `Source`：事件当前“发布者”（可以在 `RaiseEvent` 时被指定或在路由时被更改）。
   调试时查看 `e.OriginalSource` 很有帮助，尤其是模板内元素会使 `OriginalSource` 比 `sender` 更“底层”。

## 事件路由与ControlTemplate的交互

因为视觉树包含模板生成的元素，来自模板内子元素的路由事件会按照视觉树路由，父窗口/容器能接收到这些事件（除非被中途处理）。

但注意：模板与资源字典创建独立的 name scope —— 模板内的 `x:Name` 不会生成父窗口字段。

# 命令

## 基本元素与关系

命令系统的参与者与关系：

- **ICommand** — 接口，表示“可执行的操作”（`Execute`、`CanExecute`、`CanExecuteChanged`）
  - 常用实现：`RelayCommand`（ViewModel 中），`RoutedCommand`（WPF 框架提供的路由命令）
- **ICommandSource** — 发起命令的控件（例如 `Button`、`MenuItem`），它有 `Command`、`CommandParameter`、`CommandTarget` 等属性
- **CommandBinding** — 把一个 `RoutedCommand` 和其处理器（`Executed` / `CanExecute`）绑定在某个 `UIElement` 上（或 Window）。命令被执行时会查找 CommandBinding 来调用逻辑
- **CommandManager** — WPF 负责管理 `RequerySuggested`（用于请求重新评估 `CanExecute`），并帮助 UI 根据 `CanExecute` 自动启用/禁用命令源
- **InputBindings**（KeyBinding/MouseBinding）— 可以把键盘/鼠标快捷键绑定到命令（通常与 `RoutedCommand` 配合）

执行流程概述（RoutedCommand）：

1. 用户点击 `Button`（ICommandSource）或按快捷键（InputBinding）
2. `RoutedCommand.Execute` 被调用（目标可指定 `CommandTarget`，否则通常以聚焦元素为 target）
3. RoutedCommand 按元素树路由，查找 `CommandBinding`（在 target 或其祖先）
4. 找到匹配的 `CommandBinding`，先调用 `CanExecute`（或 `CanExecute` 提供者），若允许再调用 `Executed` 处理器
5. UI（Button、MenuItem）根据 `CanExecute` 自动启用/禁用

## ICommand与RoutedCommand

### ICommand

接口定义：

```CS
public interface ICommand
{
    bool CanExecute(object parameter);
    void Execute(object parameter);
    event EventHandler CanExecuteChanged;
}
```

**用途**：通用命令抽象，适用于任意平台/框架。MVVM 模式下，ViewModel 提供实现（例如 `RelayCommand`）。

**行为**：调用 `CanExecute` 决定是否可以执行；当可执行状态变化时触发 `CanExecuteChanged`，WPF 会监听该事件来刷新控件状态（如禁用/启用按钮）。

简单实例：

```CS
public class MainViewModel
{
    public ICommand SaveCommand { get; }
    public MainViewModel()
    {
        SaveCommand = new RelayCommand(_ => Save(), _ => CanSave());
    }
    void Save() { /* 保存逻辑 */ }
    bool CanSave() => /* 是否可保存 */;
}
```

```XAML
<Button Content="保存" Command="{Binding SaveCommand}" CommandParameter="{Binding SelectedItem}" />
```

### RoutedCommand/RoutedUICommand

`RoutedCommand` 是 WPF 的一个命令实现（实现了 `ICommand`），但它**不在自身持有业务逻辑**。当你调用 `RoutedCommand.Execute(...)` 时，命令通过**元素树路由**来查找与之匹配的 `CommandBinding`（`Executed` / `CanExecute`），把实际执行委托到那些绑定的处理器上。

用途：适合将命令逻辑放在视图层或视图上的某个元素来处理，便于菜单、工具栏与焦点元素共享命令。例如 `ApplicationCommands.Copy`、`EditingCommands.Cut` 等都是 `RoutedCommand` 或 `RoutedUICommand`。

**关键点：**

定义为静态字段（常在 Window 或自定义控件类里声明）：

```CS
public static readonly RoutedUICommand MyCmd = new RoutedUICommand("Do", "Do", typeof(MainWindow),
    new InputGestureCollection { new KeyGesture(Key.D, ModifierKeys.Control) });
```

在 XAML 或代码里为某个元素添加 `CommandBinding`：

```XAML
<Window.CommandBindings>
  <CommandBinding Command="{x:Static local:MainWindow.MyCmd}"
                  Executed="MyCmd_Executed"
                  CanExecute="MyCmd_CanExecute" />
</Window.CommandBindings>
```

可以同时在 `Window.InputBindings` 中添加 `KeyBinding`，实现快捷键：

```XAML
<Window.InputBindings>
  <KeyBinding Command="{x:Static local:MainWindow.MyCmd}" Gesture="Ctrl+D"/>
</Window.InputBindings>
```

---

**对比ICommand和RoutedCommand**

`ICommand`（自定义实现）：

- 逻辑通常直接在命令实现中（例如 RelayCommand 的委托）
- 非路由 —— 调用 `Execute` 立即运行
- 非 UI 依赖 —— 非常适合 MVVM（把命令放在 VM）

`RoutedCommand`：

- 不包含业务逻辑；通过路由找到 `CommandBinding` 来执行
- 支持命令路由（可以由任意元素处理）
- 更适合 UI 层集中处理（菜单、工具栏、控件库）

## 自定义Command

### RelayCommand

目的是把委托封装成 `ICommand`，在 ViewModel 中使用，不依赖视图或路由。

（常见的简洁）实现：

```CS
public class RelayCommand : ICommand
{
    private readonly Action<object> _execute;
    private readonly Predicate<object> _canExecute;
    public RelayCommand(Action<object> execute, Predicate<object> canExecute = null)
    {
        _execute = execute ?? throw new ArgumentNullException(nameof(execute));
        _canExecute = canExecute;
    }

    public bool CanExecute(object parameter) => _canExecute == null || _canExecute(parameter);
    public void Execute(object parameter) => _execute(parameter);

    // 通过 CommandManager.RequerySuggested 自动刷新（适合常见场景）
    public event EventHandler CanExecuteChanged
    {
        add { CommandManager.RequerySuggested += value; }
        remove { CommandManager.RequerySuggested -= value; }
    }

    // 当条件改变并需要手动通知时，调用：
    public void RaiseCanExecuteChanged() => CommandManager.InvalidateRequerySuggested();
}
```

使用（ViewModel）：

~~~CS
public class MainViewModel
{
    public RelayCommand SaveCommand { get; }

    public MainViewModel()
    {
        SaveCommand = new RelayCommand(_ => Save(), _ => CanSave());
    }

    private void Save() { /* 保存 */ }
    private bool CanSave() { return /* 条件 */; }
}
~~~

XAML:

```XAML
<Button Content="保存" Command="{Binding SaveCommand}" />
```

> [!NOTE]
>
> 把 `EventHandler CanExecuteChanged` 钩到 `CommandManager.RequerySuggested` 是常用技巧，它会在 WPF 认为应该重新询问可执行状态时触发（如焦点变化）。
>
> 如果你的 `CanExecute` 条件依赖于后台数据改变，最好在条件改变时显式调用 `RaiseCanExecuteChanged()`（或 CommandManager.InvalidateRequerySuggested）。

### RelayCommand泛型版本

```CS
public class RelayCommand<T> : ICommand
{
    private readonly Action<T> _execute;
    private readonly Predicate<T> _canExecute;
    public RelayCommand(Action<T> execute, Predicate<T> canExecute = null) { ... }
    public bool CanExecute(object parameter) => _canExecute == null || _canExecute((T)parameter);
    public void Execute(object parameter) => _execute((T)parameter);
    public event EventHandler CanExecuteChanged { add{ CommandManager.RequerySuggested += value; } remove{ ... } }
}
```



### 异步命令(IAsyncCommand/AsyncRelayCommand)

如果命令需要做异步 I/O（避免阻塞 UI），不要直接把 `async void` 放在 Execute，推荐以下模式：

简单 AsyncRelayCommand：

```CS
public class AsyncRelayCommand : ICommand
{
    private readonly Func<Task> _execute;
    private readonly Func<bool> _canExecute;
    private bool _isExecuting;
    public AsyncRelayCommand(Func<Task> execute, Func<bool> canExecute = null) { ... }

    public bool CanExecute(object parameter) => !_isExecuting && (_canExecute?.Invoke() ?? true);
    public async void Execute(object parameter)
    {
        _isExecuting = true; RaiseCanExecuteChanged();
        try { await _execute(); }
        finally { _isExecuting = false; RaiseCanExecuteChanged(); }
    }
    public event EventHandler CanExecuteChanged;
    public void RaiseCanExecuteChanged() => CanExecuteChanged?.Invoke(this, EventArgs.Empty);
}
```

使用时可以在 UI 上显示执行状态（比如禁用按钮或显示 Loading）。

# 资源

资源是你把可复用对象（Brush、Style、ControlTemplate、图片、数据等）放到一个 `ResourceDictionary` 里并用一个键（Key）标识，便于在应用内复用与统一管理。

## 资源作用域

- **元素级（Element.Resources）**：只对该元素与其子元素可见

```XML
<StackPanel>
  <StackPanel.Resources>
    <SolidColorBrush x:Key="Accent" Color="SkyBlue"/>
  </StackPanel.Resources>
</StackPanel>
```

- **窗口/页面级（Window.Resources / Page.Resources）**：该窗口及其子元素可见。
- **应用级（App.xaml / Application.Current.Resources）**：整个应用可见。
- **外部 ResourceDictionary 文件**（通常放 `ResourceDictionary` 文件并通过 `MergedDictionaries` 引入）。
- **主题/控件库级**（`Themes/Generic.xaml`，用于控件默认样式）。

## 资源查找顺序

当你用 `{StaticResource Key}` 或 `{DynamicResource Key}` 请求一个资源时，WPF 会按固定顺序查找，直到找到为止（越近的作用域优先）：

1. 当前元素的 `Resources`
2. 沿逻辑树向上逐级查找父元素的 `Resources`（直到根）
3. 如果目标在模板内部，查找 `TemplatedParent` 或模板相关的资源（取决于上下文）
4. `Window` / `Page` 的 `Resources`
5. `Application.Current.Resources`（App.xaml）
6. 已合并的 `ResourceDictionary.MergedDictionaries`（按顺序）
7. 系统主题资源 / 框架默认资源（Theme 和 System level）

> [!tip]
>
> 如果多个级别都定义了同一键，**最近（最具体）那个胜出**。

## 静态/动态资源

- 静态（`StaticResource`）：**颜色、样式、模板等只会在启动/初始化确定**，并且在性能敏感处使用。
- 动态（`DynamicResource`）：**需要运行时改变（用户换主题）或可能被替换的资源**。

### `{StaticResource Key}`

- **解析时机**：在 XAML 被加载/解析时（编译时/初始化时）解析一次。
- **优点**：解析快、性能好（没有运行时查找开销）；适合不需要在运行时替换的资源。
- **限制**：请求的资源必须在 XAML 解析之前已存在于查找路径中（必须先声明）。如果资源在后面才定义，会导致 XAML 解析错误或找不到（XAML 加载时会报错）。

```XAML
<!-- 必须先定义资源 -->
<Window.Resources>
  <SolidColorBrush x:Key="Accent" Color="Blue"/>
</Window.Resources>

<Button Background="{StaticResource Accent}" />
```

### `{DynamicResource Key}`

- **解析时机**：运行时查找，并会 *保持引用*，当资源字典中该键的值改变时，所有使用 `DynamicResource` 的属性会自动更新。
- **优点**：适合主题切换、运行时替换资源、资源动态加载的场景。
- **代价**：运行时查找与资源监听有额外开销，访问略慢。

```XAML
<Button Background="{DynamicResource Accent}" />
```

```CS
Application.Current.Resources["Accent"] = new SolidColorBrush(Colors.Red);
// 所有使用 DynamicResource Accent 的 UI 会随之更新
```

### ResourceDictionary与MergedDictionaries

单个 `ResourceDictionary` 存放键值对；可把大的样式集合拆分多个 XAML 文件，并在 App.xaml 或控件中合并：

```xaml
<Application.Resources>
  <ResourceDictionary>
    <ResourceDictionary.MergedDictionaries>
      <ResourceDictionary Source="/Themes/Colors.xaml"/>
      <ResourceDictionary Source="/Themes/Controls.xaml"/>
    </ResourceDictionary.MergedDictionaries>
    <!-- 也可以放些默认资源 -->
  </ResourceDictionary>
</Application.Resources>
```

`Source` 支持 Pack URI（见下节），也支持跨程序集引用：`/OtherAssembly;component/Path/Res.xaml`。

## 添加二进制资源

当你在 Visual Studio 中添加文件时，常见三种 Build Action：

1. **Resource（WPF Resource）**
   - 文件会被打包进程序集的资源表（不是 .NET 嵌入式资源的 Manifest 形式，而是 WPF 的资源流），可以用 Pack URI `pack://application:,,,/…` 或 `"/AssemblyName;component/..."` 访问。
   - 适合：被 XAML 直接引用的图片、XAML 资源字典、字体、二进制数据被打包进程序集场景。
2. **Content**
   - 文件会被复制到输出目录（或随 ClickOnce 部署），不是嵌入到程序集。可通过**站点来源（site-of-origin）** 的 Pack URI 访问（pack://siteoforigin:,,,/...），或通过常规文件 I/O（相对路径）访问。
   - 适合：可更新或外部部署时会被替换的文件（例如外部数据文件）。
3. **Embedded Resource**（.NET Manifest Resource）
   - 以传统 .NET 嵌入资源方式存入程序集 manifest。不能直接用 WPF 的 Pack URI（要用 `Assembly.GetManifestResourceStream(...)`）。
   - 适合：你要以流形式在代码里读取而不是让 WPF 引擎处理（或兼容非 WPF 代码库）。

**推荐（常用）**：大多数 UI 图片/资源选 `Resource`（WPF Resource）。要发布独立可替换文件选 `Content`。需要被第三方库通过反射读取时选 `Embedded Resource`。

## 访问二进制资源

Pack URI 是 WPF 访问“打包/站点”资源的标准 URI 方案。常见格式如下（都以 `Uri` 字符串形式）：

**同程序集内的资源（最常见，Build Action = Resource）**

- XAML中常用的相对路径

```XAML
<Image Source="Images/logo.png" />  
<!-- 相对路径：当资源为 Resource 且与 XAML 在同一程序集时可以这样写 -->
```

- 绝对pack URI（等价）

```perl
pack://application:,,,/Images/logo.png
```

- 指定程序集（当资源在另一个已引用的程序集时）：

```PERL
pack://application:,,,/OtherAssembly;component/Images/logo.png
```

- 简短形式：

```XAML
/OtherAssembly;component/Images/logo.png
```

示例：

```XAML
<!-- Images/logo.png: Build Action = Resource -->
<Image Width="120" Source="Images/logo.png" />
<!-- 或显式 -->
<Image Source="pack://application:,,,/Images/logo.png" />
```

---

**引用另一个程序集的资源（Resource）**

XAML示例：

```XAML
<Image Source="/ControlsLib;component/Images/icon.png" />
```

C#示例：

```CS
var uri = new Uri("pack://application:,,,/ControlsLib;component/Images/icon.png", UriKind.Absolute);
var bmp = new BitmapImage(uri);
```

---

**站点来源Content文件（Build Action = Content）**

当你把文件设为 `Content`（Copy to Output），使用 site-of-origin：

~~~perl
pack://siteoforigin:,,,/External/config.json
~~~

适合 ClickOnce 或运行目录下外部可替换文件。

---

**读取嵌入资源**

WPF Pack URI 不直接用于 `Embedded Resource`（.NET manifest resource），要用：

```CS
var asm = Assembly.GetExecutingAssembly();
using var stream = asm.GetManifestResourceStream("MyNamespace.Files.data.bin");
```

（`Embedded Resource` 的命名通常是 `DefaultNamespace.SubFolder.Filename`）

# 模板

**模板**就是对控件或数据展示的“外观定义”。它不改变内容本身，只改变“如何呈现”。

| 类型              | 作用                            | 常见绑定目标         |
| ----------------- | ------------------------------- | -------------------- |
| `DataTemplate`    | 数据的外衣 → 数据如何展示       | 列表项、内容控件等   |
| `ControlTemplate` | 控件的外衣 → 控件整体的 UI 结构 | 按钮、文本框、滑块等 |

- `DataTemplate` 让你的**数据看得更舒服**；
- `ControlTemplate` 让你的**控件穿上新衣裳**；
- `Style` 让**模板批量应用，行为视觉统一化**。

## DataTemplate

`DataTemplate` 用于定义**数据对象如何呈现**，常用于 `ItemsControl`（如 `ListBox`、`ComboBox`、`DataGrid`）中的每一项。

**示例：**假设有一个类绑定了一个ListBox

```CS
public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
}
```

```XAML
<ListBox ItemsSource="{Binding People}">
    <ListBox.ItemTemplate>
        <DataTemplate>
            <StackPanel Orientation="Horizontal">
                <TextBlock Text="{Binding Name}" Margin="5"/>
                <TextBlock Text="{Binding Age}" Margin="5"/>
            </StackPanel>
        </DataTemplate>
    </ListBox.ItemTemplate>
</ListBox>
```

**使用方式：**

- 局部：写在控件内 `ItemTemplate` 中
- 全局：写到资源里，通过 `x:Key` 引用
- 自动选择：通过 `DataType` + 隐式 DataTemplate

```XAML
<DataTemplate DataType="{x:Type local:Person}">
    <StackPanel>...</StackPanel>
</DataTemplate>
```

## ControlTemplate

`ControlTemplate` 定义控件的完整视觉结构 —— 你可以完全重写 `Button`、`TextBox` 的样式、结构、视觉反馈等。

- 使用 `TemplateBinding` 绑定控件本身的属性
- 使用 `Triggers` 定义状态切换（例如鼠标悬停）
- 必须保留 `PART_*` 元素来支持某些控件的功能

**示例：重绘一个按钮**

```XAML
<Button Content="Click Me">
    <Button.Template>
        <ControlTemplate TargetType="Button">
            <Border Background="{TemplateBinding Background}"
                    BorderBrush="{TemplateBinding BorderBrush}"
                    BorderThickness="{TemplateBinding BorderThickness}">
                <ContentPresenter HorizontalAlignment="Center"
                                  VerticalAlignment="Center"/>
            </Border>
        </ControlTemplate>
    </Button.Template>
</Button>
```

加入视觉状态的触发器：

```XAML
<ControlTemplate.Triggers>
    <Trigger Property="IsMouseOver" Value="True">
        <Setter TargetName="border" Property="Background" Value="LightBlue"/>
    </Trigger>
</ControlTemplate.Triggers>
```

---

| 对比点               | DataTemplate                | ControlTemplate                     |
| -------------------- | --------------------------- | ----------------------------------- |
| 应用对象             | 数据模型 → 显示             | 控件 → 自定义外观与交互             |
| 是否影响交互性       | 否（仅视觉）                | 是（可完全替换控件行为与结构）      |
| 常用于               | ListBox、DataGrid、TreeView | Button、TextBox、Slider、TabControl |
| 是否需要继承控件行为 | 否                          | 是（涉及模板部件、交互逻辑）        |

## Style

Style 是模板的容器，可以为控件批量设置属性、绑定模板、定义触发器等，统一界面风格。

```XAML
<Style TargetType="Button">
    <Setter Property="Background" Value="LightGray"/>
    <Setter Property="FontSize" Value="14"/>
    <Setter Property="Template">
        <Setter.Value>
            <ControlTemplate TargetType="Button">
                <Border Background="{TemplateBinding Background}" ... />
            </ControlTemplate>
        </Setter.Value>
    </Setter>
</Style>
```

Style 和 Template 密切结合，可实现：

- 控件皮肤更换
- 状态响应式样式（比如悬浮、点击）
- 控件视觉一致性控制

**模板重用方式：**

- 使用 `StaticResource` 或 `DynamicResource` 调用模板
- 使用资源字典集中管理样式与模板
- 使用 `BasedOn` 继承已有 Style

# 绘画和动画

## WPF绘图

WPF 的绘图是基于 **矢量图形（Vector Graphics）** 和 **DirectX 渲染** 实现的，拥有强大的可组合性和硬件加速能力。

| 类名             | 功能描述                      |
| ---------------- | ----------------------------- |
| `Shape`          | 所有图形控件基类              |
| `Line`           | 线条                          |
| `Rectangle`      | 矩形                          |
| `Ellipse`        | 圆形/椭圆                     |
| `Polygon`        | 多边形                        |
| `Path`           | 任意矢量路径，可绘制复杂图形  |
| `Geometry`       | 抽象的几何结构（可用于 Path） |
| `DrawingContext` | 用于低级绘图（更自由）        |

```XAML title="绘制一个红色圆形"
<Ellipse Width="100" Height="100" Fill="Red" Stroke="Black" StrokeThickness="2"/>
```

```XAML title="复杂Path"
<Path Stroke="Black" StrokeThickness="1" Fill="LightBlue">
    <Path.Data>
        <GeometryGroup>
            <EllipseGeometry Center="50,50" RadiusX="40" RadiusY="20"/>
            <RectangleGeometry Rect="10,10,30,30"/>
        </GeometryGroup>
    </Path.Data>
</Path>
```



## 图形的效果与滤镜

| 滤镜                   | 说明                 |
| ---------------------- | -------------------- |
| `DropShadowEffect`     | 阴影                 |
| `BlurEffect`           | 模糊                 |
| `BitmapEffect`（过时） | 老旧效果系统，已废弃 |

示例：阴影+模糊

```XAML
<Rectangle Width="100" Height="100" Fill="Blue">
    <Rectangle.Effect>
        <DropShadowEffect Color="Black" Direction="320" ShadowDepth="10" BlurRadius="8"/>
    </Rectangle.Effect>
</Rectangle>
```



## 图形的变形





## 动画

