---
title: XAML
shortTitle: XAML
description: XAML
date: 2025-07-12 17:36:33
categories: [.NET, WPF]
tags: [.NET]
author:
  name: Okita
  url: https://zhiyun.space
  email: 2368932388@qq.com
order: 2
---

| 标识                | 类型     | 作用                              |
| ------------------- | -------- | --------------------------------- |
| `x:Class`           | 指令     | 绑定 XAML 与 code-behind 类       |
| `x:Name`            | 指令     | 注册 Element 的 name 到 namescope |
| `x:Key`             | 指令     | ResourceDictionary 的键           |
| `x:FieldModifier`   | 指令     | 修改生成字段的访问级别            |
| `x:Uid`             | 指令     | 本地化标识                        |
| `{x:Static ...}`    | 标记扩展 | 引用静态成员                      |
| `{x:Type ...}`      | 标记扩展 | 获取 Type 对象                    |
| `{x:Null}`          | 标记扩展 | 表示 null                         |
| `{x:Reference ...}` | 标记扩展 | 引用已命名元素实例                |
| `x:Shared`          | 属性     | 控制资源是否共享实例              |

## 基础语法

XAML 是 **XML 的一种专用变体**，用来描述 **WPF UI 的结构、外观和行为**。

它本质是 **UI 声明语言**，由 .NET 的编译器解析，转化为 C# 对象。

### 元素

每个 XAML 元素对应一个 **.NET 类实例**

标签名 = 类名（必须有无参构造）

```XML
<Button Content="点我" Width="100" Height="30"/>
```

等价于：

```CS
var btn = new Button();
btn.Content = "点我";
btn.Width = 100;
btn.Height = 30;
```

### 嵌套元素

如果属性类型是一个对象，可以用嵌套语法：

```XML
<Button Width="100" Height="40">
    <Button.Background>
        <SolidColorBrush Color="Red"/>
    </Button.Background>
</Button>
```

等价于：

```CS
var btn = new Button();
btn.Width = 100;
btn.Height = 40;
btn.Background = new SolidColorBrush(Colors.Red);
```

### 属性元素

把属性写成子标签，可以写更复杂的值

```XML
<Button>
    <Button.Content>
        <StackPanel Orientation="Horizontal">
            <Image Source="icon.png" Width="16"/>
            <TextBlock Text="登录"/>
        </StackPanel>
    </Button.Content>
</Button>
```

### 命名空间

XAML 文件开头会声明 XML 命名空间

```XML
<Window 
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" 
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">
```

- `xmlns` 默认是 WPF 控件库的命名空间
- `xmlns:x` 是 XAML 语言关键字命名空间（`x:Name`、`x:Key`、`x:Type` 等）

### 标记扩展

用 `{}` 包裹的特殊语法，用于动态赋值

~~~XML
<TextBlock Text="{Binding UserName}"/>
<Button Content="{StaticResource MyButtonStyle}"/>
<Image Source="{Binding ProfileImage, Converter={StaticResource ImageConverter}}"/>
~~~

常见扩展：

- `{Binding}` → 数据绑定
- `{StaticResource}` / `{DynamicResource}` → 资源引用
- `{x:Static}` → 静态字段或属性
- `{x:Type}` → 类型引用

## x名称空间

在 XAML 中 `xmlns` 用来把 XML 前缀（如 `x:`、`local:`）映射到一个命名空间 URI 或 CLR 命名空间，从而告诉 XAML 解析器该前缀下的标签或标记扩展代表什么含义或类型。

最常见的三类命名空间：

- `xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"`
   → WPF 的显示控件/类型（Button、Grid……），通常没有前缀（默认命名空间）。
- `xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"`
   → **XAML 语言命名空间（简称 x:）**，包含 XAML 语言级别的关键字 / 标记扩展（`x:Name` / `x:Class` / `x:Key` / `{x:Static}` 等）。
- `xmlns:local="clr-namespace:MyApp.Views;assembly=MyApp"`
   → 把 `local:` 映射到你的 CLR 命名空间（用于引用你自己写的控件/类）。

---

`x:`

`x:` 命名空间由 URI
 `http://schemas.microsoft.com/winfx/2006/xaml` 表示。
 它不是控件集合，而是 **XAML 语言本身提供的一组关键字和标记扩展**，用于控制类生成、命名、引用静态成员、处理 null、类型对象等。

`x:` 的关键词和标记扩展在所有基于 XAML 的平台（WPF/UWP/MAUI 等）中都非常相似且稳定，是 XAML 语法的核心部分。

## x:指令

### x:Class

**用途**：声明 XAML 对应的生成类（把 XAML 与 code-behind 关联）。

**位置**：通常写在根元素 `<Window>` / `<UserControl>` 的属性中。

```XML
<Window x:Class="MyApp.MainWindow"
        ...>
```

> `x:Class` 会让编译器生成部分类（partial class），其命名空间/类名须与后台 `.xaml.cs` 中一致。

### x:Name

**用途**：给元素在 XAML 中命名，注册到 NameScope，可在后台代码通过字段/变量直接访问；也可作为 `{Binding ElementName=...}` 的目标。

```XML
<TextBox x:Name="txtUser" />
```

> [!NOTE]
>
> 与 `Name` 属性的区别：很多控件也有 `Name`（CLR/DP 属性），`x:Name` 更通用（可用于不拥有 `Name` 属性的对象），且明确注册到 XAML 的 namescope。
>
> 在模板 / DataTemplate / ResourceDictionary 中，`x:Name` 的 namescope 不在窗体的 namescope 下（会导致 `FindName` 不一定找到），这是常见陷阱。

### x:Key

**用途**：给资源字典里的资源指定键（用于 `{StaticResource x:Key}`）。

```XML
<Window.Resources>
    <Style x:Key="PrimaryButtonStyle" TargetType="Button">...</Style>
</Window.Resources>
```

> `x:Key` 与 `x:Name`不同：`x:Key` 是资源字典的标识符，而不是 UI 命名。

### x:FieldModifier

**用途**：控制由 XAML 生成的字段的可见性（默认是 `private`）。

```XML
<Button x:Name="btnSave" x:FieldModifier="public" />
```

> [!TIP]
>
> 谨慎使用（改变访问级别会影响封装），仅在需要从其他类直接访问该字段时改用 `internal`/`public`。

### x:Uid

**用途**：辅助本地化 / L10N：用于生成 Uid->资源键，便于使用 LocBAML 或其它本地化工具。

```XML
<TextBlock x:Uid="MainWindow_Welcome" Text="Hello" />
```

### x:shared

**用途**：用于资源字典，控制资源是单实例共享（`True`，默认）还是每次请求都新建（`False`）。

```XML
<BitmapImage x:Key="MyImg" x:Shared="False" ... />
```

> [!note]
>
> `x:Shared="False"` 会在每次 `StaticResource`/`DynamicResource` 请求时创建一个新实例（对不可重用、不可冻结的对象有用）。
>
> 并非所有 XAML 平台/上下文都支持 `x:Shared`，但 WPF 的资源字典支持。

## 标记扩展

### x:Array

**常见用途：**

1. **给 ItemsControl（如 ListBox、ComboBox）提供静态数据源**
2. **作为资源存储一组默认值**（如默认颜色、坐标集）
3. **构造不可变的数据集合**（因为数组长度固定）

**注意事项：**

1. **数组是固定长度**，不能像 `ObservableCollection` 一样动态增删项。
2. `Type` 必须是**可在 XAML 中创建的类型**（必须有无参构造，值类型例外）。
3. `x:Array` 只能创建 **一维数组**。

#### 基本用法

**用途：**在 XAML 这种标记语言里，数组本身不是天然可表示的，但 `x:Array` 提供了一个桥梁，让你能在布局或资源里声明一段数组数据。

```XML
<Window x:Class="WpfApp.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="x:Array 示例" Height="200" Width="300">

    <Window.Resources>
        <!-- 声明一个 string 类型的数组 -->
        <x:Array x:Key="CityList" Type="{x:Type sys:String}"
                 xmlns:sys="clr-namespace:System;assembly=mscorlib">
            <sys:String>上海</sys:String>
            <sys:String>北京</sys:String>
            <sys:String>广州</sys:String>
            <sys:String>深圳</sys:String>
        </x:Array>
    </Window.Resources>

    <StackPanel>
        <ListBox ItemsSource="{StaticResource CityList}" />
    </StackPanel>
</Window>

```

1. `x:Array` 表示这是一个数组容器。
2. `Type="{x:Type sys:String}"` 表示数组的元素类型（必须指定）。
3. `xmlns:sys="clr-namespace:System;assembly=mscorlib"` 是为了访问 `System.String` 类型所在的命名空间。
4. 数组中的每个元素用对应类型的标签（如 `sys:String`）来定义。

#### 复杂类型

`x:Array` 不止能存储字符串，还能存储自定义类对象。例如存储 `Point` 数组：

```XML
<Window.Resources>
    <x:Array x:Key="PointsArray" Type="{x:Type sys:Point}"
             xmlns:sys="clr-namespace:System;assembly=WindowsBase">
        <sys:Point X="0" Y="0"/>
        <sys:Point X="50" Y="50"/>
        <sys:Point X="100" Y="100"/>
    </x:Array>
</Window.Resources>
```



### x:Static

**用途**：在 XAML 中引用静态字段或静态属性（类常量、静态资源键、系统颜色键等）。

```XML
<TextBlock Text="{x:Static local:MyConsts.WelcomeText}" />
<Button Background="{x:Static SystemColors.ControlBrush}" />
```

> `{x:Static}` 在 XAML 中返回那个静态值本身（不是字符串化）。

### x:Type

**用途**：在 XAML 中获取 `System.Type` 对象（常用于 DataTemplate/DataTrigger、类型比较等）。

```XML
<DataTemplate DataType="{x:Type local:MyViewModel}">
  ...
</DataTemplate>
```

### x:Null

**用途**：在 XAML 中显式表示 `null`（例如把某属性设置为 null）。

```XML
<Setter Property="SomeProperty" Value="{x:Null}" />
```

### x:Reference

**用途**：引用另一个已命名元素的实例（与 `ElementName` 绑定不同，`x:Reference` 不是绑定表达式，而是直接取得引用）。

```XML
<Button x:Name="btnA" Content="A" />
<TextBlock Text="{Binding Source={x:Reference btnA}, Path=Content}" />
```

> [!note]
>
> `ElementName` 是绑定（可以更新），而 `x:Reference` 在解析时返回元素实例（某些情况下更直接，但在解析顺序上需注意）。
>
> `x:Reference` 在解析顺序上有局限，可能会出现目标尚未创建的情况导致失败。

## 声明CLR命名空间（引用自定义类型）

当你要在 XAML 中使用自己写的控件/类，需要在根元素声明 `clr-namespace`：

```XML
xmlns:local="clr-namespace:MyApp.Controls"
<!-- 或引用外部程序集 -->
xmlns:ctrl="clr-namespace:ThirdParty.Controls;assembly=ThirdParty"
```

然后可以 `<local:MyControl />` 直接使用。如果省略`assembly=`，则默认当前程序集。

## 设计时命名空间(mc/d)

不是 `x:`，但几乎每个 XAML 都会出现

```XML
xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
mc:Ignorable="d"
```

- `mc:Ignorable="d"` 表示设计器相关命名空间可以被忽略（不会影响运行时）。
- `d:DesignHeight`、`d:DataContext` 等仅用于设计时显示，不参与运行时逻辑。

## NameScope

XAML 中的 `x:Name` / `Name` 注册到**当前的 NameScope**。NameScope 有层级：

- Window 有独立的 namescope
- DataTemplate、ControlTemplate、ResourceDictionary 会创建自己的 namescope（模板内的 x:Name 在模板实例内部可用，但不会成为 Window 的字段）

常见问题：

- 在 DataTemplate 里用 `x:Name="xxx"` 后，在 Window 后台直接访问 `xxx` 会找不到 —— 这是因为模板的 namescope 与窗体不同。
- `FindName` 只能在对应的 namescope 中查找。

## FAQ & 最佳实践

Q：`Name` 和 `x:Name` 哪个用？
A：如果控件类定义了 `Name` 属性（大多数控件都定义），写 `Name="..."` 就可以；但 `x:Name` 更通用，也可用于非 UI 元素（例如动画 storyboard 的 target）。在 code-behind 生成字段时两者通常等效。



Q：什么时候用 `x:Key`？什么时候用 `x:Name`？
A：资源字典里的资源用 `x:Key` 做标识（`StaticResource`/`DynamicResource`），UI 元素用 `x:Name`/`Name` 注册 namescope。



Q：`{x:Static}` 与 `{StaticResource}` 区别？
A：`{x:Static}` 引用静态字段/属性（编译时获得值），`{StaticResource}` 从资源字典中按键查找资源（运行时解析资源字典层次）。

---

- 在顶层窗体或 UserControl 使用 `x:Class` 且与 code-behind 保持一致。
- 给需要后台访问的控件使用 `x:Name`（或 `Name`）。
- 资源使用 `x:Key`，并尽量把全局资源放到 `App.xaml` 或独立的 `ResourceDictionary`。
- 使用 `{x:Static}` 引用常量或系统键；使用 `{StaticResource}`/`{DynamicResource}` 引用资源。
- 注意 templates/data templates 的 namescope：不要期望模板内的 `x:Name` 会变成顶层字段。
- 仅在确实需要时使用 `x:FieldModifier` 或 `x:Shared="False"`。