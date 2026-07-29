---
title: CommunityToolkit
shortTitle: CommunityToolkit
description: CommunityToolkit.MVVM 教程
date: 2026-07-29 10:12:21
categories: [.NET, WPF]
tags: [.NET]
header: [1, 5]
author:
  name: Okita
  url: https://zhiyun.space
  email: 2368932388@qq.com
order: 5
---
> [CommunityToolkit 民间教程](https://mvvm.coldwind.top/ "CommunityToolkit 民间教程")
> [官方文档](https://learn.microsoft.com/zh-cn/dotnet/communitytoolkit/mvvm/ "MVVM 工具包简介")

# CommunityToolkit.Mvvm

CommunityToolkit.Mvvm（又名 MVVM 工具包，前身为 `Microsoft.Toolkit.Mvvm`）是一个现代、快速、模块化的 MVVM 库，由 Microsoft 维护并属于 .NET Foundation 的一部分。它基于 .NET Standard 2.0，可在 WPF、UWP、WinForms、MAUI、Uno、Avalonia 等任何 .NET 平台上使用。

工具包的核心设计理念是 **源生成器（Source Generator）驱动**——通过 Roslyn 编译器在编译时自动生成属性变更通知、命令包装等样板代码，让开发者只需关注业务逻辑。

## 1. 快速上手

### 环境准备与 NuGet 包安装

在 Visual Studio 的解决方案管理器中右键项目，选择「管理 NuGet 包」，搜索并安装 `CommunityToolkit.Mvvm`。或通过命令行安装：

```bash
dotnet add package CommunityToolkit.Mvvm
```

安装完成后，在代码中引入命名空间：

```CS
using CommunityToolkit.Mvvm.ComponentModel;  // ObservableObject 等基类与特性
using CommunityToolkit.Mvvm.Input;           // RelayCommand 等命令相关
using CommunityToolkit.Mvvm.Messaging;       // IMessenger 消息系统
using CommunityToolkit.Mvvm.DependencyInjection; // Ioc 依赖注入
```

### 第一个 ViewModel

从最简单的场景开始——定义一个带属性变更通知的 ViewModel：

```CS
// 继承 ObservableObject，获得 INotifyPropertyChanged 实现
public partial class MainViewModel : ObservableObject
{
    // [ObservableProperty] 标注字段，源生成器自动生成公开属性
    [ObservableProperty]
    private string _name = string.Empty;

    // [RelayCommand] 标注方法，源生成器自动生成 ICommand 属性
    [RelayCommand]
    private void Greet()
    {
        Console.WriteLine($"Hello, {Name}!");
    }
}
```

源生成器会为上述代码自动生成以下内容（可在 `obj/Generated` 目录下的 `.g.cs` 文件中查看）：

- 从 `_name` 字段生成 `Name` 公开属性，内部调用 `SetProperty` 触发 `PropertyChanged`
- 从 `Greet` 方法生成 `GreetCommand` 命令属性，类型为 `IRelayCommand`

对应的 XAML 绑定：

```XAML
<StackPanel>
    <TextBox Text="{Binding Name, UpdateSourceTrigger=PropertyChanged}" />
    <Button Content="Greet" Command="{Binding GreetCommand}" />
</StackPanel>
```

### 了解源生成器的作用

传统 MVVM 开发中，每个属性都需要手写 `get/set` + `SetProperty` + `OnPropertyChanged`，每个命令都需要手写 `ICommand` 属性 + 委托包装。源生成器在编译时读取特性标注（如 `[ObservableProperty]`、`[RelayCommand]`），自动生成这些样板代码。

源生成器的关键约束：

- 标注了源生成器特性的类必须声明为 `partial`，因为生成的代码位于另一个分部定义中
- 如果类型有嵌套，所有外层类型也必须声明为 `partial`
- 生成的代码可以在项目的 `obj/Generated` 目录下查看（需要在 Visual Studio 中勾选「显示所有文件」）

### 属性命名约定

`[ObservableProperty]` 标注的字段名称会经过转换生成属性名。生成器支持以下三种前缀风格：

| 字段命名风格 | 示例字段 | 生成的属性名 |
|---|---|---|
| `lowerCamel` | `name` | `Name` |
| `_lowerCamel` | `_name` | `Name` |
| `m_lowerCamel` | `m_name` | `Name` |

生成器会去除前缀（`_` 或 `m_`），然后将首字母大写。无论字段使用什么访问修饰符（推荐 `private`），生成的属性始终为 `public`。

## 2. 组件模型

### ObservableObject

#### 核心基类的作用

`ObservableObject` 是工具包中所有可观察类型的基类，实现了 `INotifyPropertyChanged` 和 `INotifyPropertyChanging` 接口。它提供了属性变更通知的基础设施，是 ViewModel 的首选基类。

```CS
public class MyViewModel : ObservableObject
{
    private int _count;
    public int Count
    {
        get => _count;
        set => SetProperty(ref _count, value);
    }
}
```

#### SetProperty 方法详解

`SetProperty` 是 `ObservableObject` 提供的核心方法，用于设置属性值并触发变更通知。它有以下常用重载：

```CS
// 基本用法：比较值，不同则设置并触发通知
protected bool SetProperty<T>(ref T field, T newValue, [CallerMemberName] string propertyName = null);

// 带回调：值变更后执行额外逻辑
protected bool SetProperty<T>(ref T field, T newValue, Action<T> onChanged, [CallerMemberName] string propertyName = null);

// 带比较器：自定义相等比较逻辑
protected bool SetProperty<T>(ref T field, T newValue, IEqualityComparer<T> comparer, [CallerMemberName] string propertyName = null);
```

`SetProperty` 的返回值为 `bool`：当值实际发生改变时返回 `true`，未改变时返回 `false`。可以利用返回值决定是否执行后续逻辑：

```CS
public class OrderViewModel : ObservableObject
{
    private decimal _totalPrice;
    public decimal TotalPrice
    {
        get => _totalPrice;
        set
        {
            if (SetProperty(ref _totalPrice, value))
            {
                // 仅在值实际改变时执行
                RecalculateDiscount();
            }
        }
    }

    private void RecalculateDiscount() { /* ... */ }
}
```

#### OnPropertyChanged 方法详解

`OnPropertyChanged` 用于手动触发属性变更通知。当某个属性依赖于另一个属性时，需要手动通知：

```CS
public class UserViewModel : ObservableObject
{
    private string _firstName = string.Empty;
    public string FirstName
    {
        get => _firstName;
        set
        {
            SetProperty(ref _firstName, value);
            // 手动通知依赖属性
            OnPropertyChanged(nameof(FullName));
        }
    }

    private string _lastName = string.Empty;
    public string LastName
    {
        get => _lastName;
        set
        {
            SetProperty(ref _lastName, value);
            OnPropertyChanged(nameof(FullName));
        }
    }

    // 只读计算属性
    public string FullName => $"{FirstName} {LastName}";
}
```

> [!NOTE]
> 在实际开发中，推荐使用 `[NotifyPropertyChangedFor]` 特性替代手动 `OnPropertyChanged` 调用，详见源生成器章节。

### ObservableValidator

#### 数据校验基类

`ObservableValidator` 继承自 `ObservableObject`，同时实现了 `INotifyDataErrorInfo` 接口，提供数据验证能力。它集成 `System.ComponentModel.DataAnnotations` 命名空间下的验证特性。

```CS
public partial class LoginFormViewModel : ObservableValidator
{
    [ObservableProperty]
    [NotifyDataErrorInfo]
    [Required(ErrorMessage = "用户名不能为空")]
    [MinLength(3, ErrorMessage = "用户名至少 3 个字符")]
    private string _username = string.Empty;

    [ObservableProperty]
    [NotifyDataErrorInfo]
    [Required(ErrorMessage = "邮箱不能为空")]
    [EmailAddress(ErrorMessage = "邮箱格式不正确")]
    private string _email = string.Empty;
}
```

#### 集成 DataAnnotations 进行属性验证

`ObservableValidator` 内部维护一个 `Dictionary<string, List<ValidationResult>>` 来存储各属性的验证错误。当属性值改变时（配合 `[NotifyDataErrorInfo]` 特性），自动触发验证并更新错误集合。

XAML 中通过 `INotifyDataErrorInfo` 绑定显示错误：

```XAML
<TextBox Text="{Binding Username, UpdateSourceTrigger=PropertyChanged}">
    <Validation.ErrorTemplate>
        <ControlTemplate>
            <StackPanel>
                <AdornedElementPlaceholder />
                <ItemsControl ItemsSource="{Binding Path=Errors}" />
            </StackPanel>
        </ControlTemplate>
    </Validation.ErrorTemplate>
</TextBox>
```

#### 自定义验证逻辑

除了使用 DataAnnotations 特性，还可以通过 `ValidateProperty` 方法手动触发验证，或通过 `ValidateAllProperties` 方法一次性验证所有属性：

```CS
public partial class RegistrationViewModel : ObservableValidator
{
    [ObservableProperty]
    [NotifyDataErrorInfo]
    [Required]
    [StringLength(20, MinimumLength = 6)]
    private string _password = string.Empty;

    [RelayCommand]
    private void Submit()
    {
        // 手动验证所有属性
        ValidateAllProperties();

        if (HasErrors)
        {
            // 存在验证错误，不执行提交
            return;
        }

        // 验证通过，执行提交逻辑
        SubmitRegistration();
    }

    // 自定义验证方法
    private void ValidatePassword(string value)
    {
        ClearErrors(nameof(Password));

        if (!value.Any(char.IsDigit))
        {
            AddError(nameof(Password), "密码必须包含至少一个数字");
        }

        if (!value.Any(char.IsUpper))
        {
            AddError(nameof(Password), "密码必须包含至少一个大写字母");
        }
    }
}
```

#### 错误信息的展示

`ObservableValidator` 通过 `INotifyDataErrorInfo` 接口暴露验证错误：

```CS
// 获取指定属性的所有错误
public IEnumerable<string> GetErrors(string propertyName)
{
    return GetErrors(nameof(Username))
        .Select(e => e.ErrorMessage);
}

// 是否存在验证错误
public bool HasErrors { get; }
```

`ErrorsChanged` 事件在验证状态改变时触发，UI 框架通过监听此事件自动更新错误显示。

### ObservableRecipient

#### 接收消息的 ViewModel 基类

`ObservableRecipient` 继承自 `ObservableObject`，集成了消息接收能力。它通过 `IMessenger` 实现 ViewModel 间的松耦合通信。

```CS
public partial class ReceiverViewModel : ObservableRecipient
{
    // 当 IsActive 设为 true 时自动注册消息监听
    // 当 IsActive 设为 false 时自动注销
}
```

#### IsActive 属性的生命周期管理

`ObservableRecipient` 通过 `IsActive` 属性控制消息监听的激活状态。当设为 `true` 时，自动注册所有 `IRecipient<TMessage>` 实现；设为 `false` 时自动注销。

```CS
public partial class MainViewModel : ObservableRecipient
{
    public MainViewModel()
    {
        // 手动激活（不推荐，建议在 View 加载时设置）
        IsActive = true;
    }
}
```

在 WPF 中，通常在 View 的 `Loaded` / `Unloaded` 事件中控制：

```CS
public partial class MainView : Window
{
    public MainView()
    {
        InitializeComponent();
        Loaded += (s, e) => ((MainViewModel)DataContext).IsActive = true;
        Unloaded += (s, e) => ((MainViewModel)DataContext).IsActive = false;
    }
}
```

#### Broadcast 方法与消息广播

`ObservableRecipient` 提供了 `Broadcast` 方法，用于在属性变更时向其他 ViewModel 广播消息。这与 `[NotifyPropertyChangedRecipients]` 特性配合使用：

```CS
public partial class EditorViewModel : ObservableRecipient
{
    [ObservableProperty]
    [NotifyPropertyChangedRecipients]
    private string _documentTitle = "Untitled";

    // 等效于以下手动写法：
    // private string _documentTitle = "Untitled";
    // public string DocumentTitle
    // {
    //     get => _documentTitle;
    //     set
    //     {
    //         string? oldValue = _documentTitle;
    //         if (SetProperty(ref _documentTitle, value))
    //         {
    //             Broadcast(oldValue, value);
    //         }
    //     }
    // }
}
```

`Broadcast` 方法会通过当前 `Messenger` 实例发送 `PropertyChangedMessage<T>` 消息，其他注册了该消息类型的接收者可以响应。

#### 自动注册/注销消息监听

当 `IsActive` 为 `true` 时，`ObservableRecipient` 会自动扫描类中所有 `IRecipient<TMessage>` 接口实现并注册到 `Messenger`：

```CS
public partial class StatusViewModel : ObservableRecipient,
    IRecipient<StatusChangedMessage>
{
    public void Receive(StatusChangedMessage message)
    {
        // 处理接收到的消息
        CurrentStatus = message.NewStatus;
    }

    [ObservableProperty]
    private string _currentStatus = "Idle";
}
```

## 3. 源生成器

### 核心概念

#### 为什么需要 partial 类

源生成器的工作原理是在编译时生成额外的 C# 代码，并将其作为另一个分部定义（partial declaration）合并到同一类型中。因此，使用源生成器特性的类必须声明为 `partial`：

```CS
// ❌ 错误：缺少 partial 修饰符
public class MyViewModel : ObservableObject
{
    [ObservableProperty]
    private string _name;
}

// ✅ 正确：声明为 partial
public partial class MyViewModel : ObservableObject
{
    [ObservableProperty]
    private string _name;
}
```

如果类型有嵌套，所有外层类型也必须声明为 `partial`：

```CS
public partial class OuterClass
{
    public partial class InnerViewModel : ObservableObject
    {
        [ObservableProperty]
        private int _value;
    }
}
```

#### 如何查看生成的代码

源生成器生成的代码保存在编译输出的 `obj` 目录中。在 Visual Studio 中：

1. 在解决方案资源管理器中展开项目
2. 点击「显示所有文件」按钮
3. 导航到 `obj/Debug/net8.0/Generated/CommunityToolkit.Mvvm.SourceGenerators/MvvmToolkitSourceGenerators/`
4. 查找以 `.g.cs` 结尾的文件

这些文件包含了所有自动生成的属性、命令和辅助方法，是理解工具包行为的最直接方式。

### 适用于字段的特性

#### [ObservableProperty]

`[ObservableProperty]` 是使用频率最高的源生成器特性，它从字段标注自动生成公开的可观察属性。

**基本用法：**

```CS
public partial class UserViewModel : ObservableObject
{
    [ObservableProperty]
    private string _name = string.Empty;

    [ObservableProperty]
    private int _age;

    [ObservableProperty]
    private bool _isActive;
}
```

生成器会为每个字段生成对应的公开属性，内部使用 `SetProperty` 实现变更通知：

```CS
// 生成器生成的代码（简化版）
public string Name
{
    get => _name;
    set => SetProperty(ref _name, value);
}
```

**部分方法钩子：**

源生成器还会为每个属性生成 `partial void` 方法，允许开发者注入自定义逻辑到属性变更的不同阶段：

```CS
public partial class UserViewModel : ObservableObject
{
    [ObservableProperty]
    private string _name = string.Empty;
}

// 在另一个 partial 文件或同一文件中实现
public partial class UserViewModel
{
    // 属性即将改变前（仅新值）
    partial void OnNameChanging(string value)
    {
        Console.WriteLine($"Name 即将变为: {value}");
    }

    // 属性已改变后（仅新值）
    partial void OnNameChanged(string value)
    {
        Console.WriteLine($"Name 已变为: {value}");
    }

    // 属性即将改变前（旧值 + 新值）
    partial void OnNameChanging(string oldValue, string newValue)
    {
        Console.WriteLine($"Name 从 {oldValue} 变为 {newValue}");
    }

    // 属性已改变后（旧值 + 新值）
    partial void OnNameChanged(string oldValue, string newValue)
    {
        Logger.Log($"Name changed: {oldValue} -> {newValue}");
    }
}
```

四个方法都是可选的——只实现需要的那几个即可，未实现的方法会被编译器移除，不产生任何性能开销。

> [!NOTE]
> `partial void` 方法不能显式指定访问修饰符（如 `public` 或 `private`），它们始终隐式为 `private`。

#### [NotifyPropertyChangedFor]

当属性 A 的改变需要同时通知依赖属性 B 时，使用 `[NotifyPropertyChangedFor]`：

```CS
public partial class UserViewModel : ObservableObject
{
    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(FullName))]
    private string _firstName = string.Empty;

    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(FullName))]
    private string _lastName = string.Empty;

    public string FullName => $"{FirstName} {LastName}";
}
```

生成的属性会在值变更后额外触发 `OnPropertyChanged(nameof(FullName))`，无需手动调用。

可以一次通知多个依赖属性：

```CS
[ObservableProperty]
[NotifyPropertyChangedFor(nameof(FullName))]
[NotifyPropertyChangedFor(nameof(Initials))]
[NotifyPropertyChangedFor(nameof(DisplayName))]
private string _firstName = string.Empty;
```

#### [NotifyCanExecuteChangedFor]

当属性改变时需要刷新关联命令的可执行状态时使用。生成的属性会在值变更后调用命令的 `NotifyCanExecuteChanged()` 方法：

```CS
public partial class LoginViewModel : ObservableObject
{
    [ObservableProperty]
    [NotifyCanExecuteChangedFor(nameof(LoginCommand))]
    private string _username = string.Empty;

    [ObservableProperty]
    [NotifyCanExecuteChangedFor(nameof(LoginCommand))]
    private string _password = string.Empty;

    [RelayCommand(CanExecute = nameof(CanLogin))]
    private void Login()
    {
        // 登录逻辑
    }

    private bool CanLogin()
    {
        return !string.IsNullOrWhiteSpace(Username)
            && !string.IsNullOrWhiteSpace(Password);
    }
}
```

当 `Username` 或 `Password` 改变时，`LoginCommand` 的可执行状态会自动重新计算，绑定到该命令的 Button 会自动启用或禁用。

#### [NotifyDataErrorInfo]

在继承 `ObservableValidator` 的类型中，使用 `[NotifyDataErrorInfo]` 让生成的属性在值变更时自动触发验证：

```CS
public partial class RegistrationViewModel : ObservableValidator
{
    [ObservableProperty]
    [NotifyDataErrorInfo]
    [Required(ErrorMessage = "用户名不能为空")]
    [StringLength(20, MinimumLength = 3)]
    private string _username = string.Empty;

    [ObservableProperty]
    [NotifyDataErrorInfo]
    [Required]
    [EmailAddress]
    private string _email = string.Empty;
}
```

生成的属性会在 `SetProperty` 成功后调用 `ValidateProperty(value, nameof(Username))`，验证结果通过 `INotifyDataErrorInfo` 接口暴露给 UI。

> [!NOTE]
> 只有继承自 `ValidationAttribute` 的特性会被转发到生成的属性上。其他自定义特性不会被转发，除非使用 `[property: ]` 语法显式指定。

#### [NotifyPropertyChangedRecipients]

在继承 `ObservableRecipient` 的类型中，使用 `[NotifyPropertyChangedRecipients]` 让属性变更时自动广播 `PropertyChangedMessage<T>` 消息：

```CS
public partial class DocumentViewModel : ObservableRecipient
{
    [ObservableProperty]
    [NotifyPropertyChangedRecipients]
    private string _title = "Untitled";

    [ObservableProperty]
    [NotifyPropertyChangedRecipients]
    private bool _isModified;
}
```

生成的属性在值变更后会调用 `Broadcast(oldValue, newValue)`，通过 `IMessenger` 发送 `PropertyChangedMessage<T>` 消息。其他注册了该消息类型的接收者可以响应：

```CS
public partial class StatusBarViewModel : IRecipient<PropertyChangedMessage<string>>
{
    public void Receive(PropertyChangedMessage<string> message)
    {
        if (message.PropertyName == nameof(DocumentViewModel.Title))
        {
            StatusText = $"文档标题已改为: {message.NewValue}";
        }
    }
}
```

#### 自定义属性转发

使用 `[property: ]` 语法可以将字段上的特性转发到生成的属性上。这在序列化等场景中非常实用：

```CS
public partial class UserViewModel : ObservableObject
{
    [ObservableProperty]
    [property: JsonRequired]
    [property: JsonPropertyName("user_name")]
    private string _username = string.Empty;
}
```

生成的 `Username` 属性会携带 `[JsonRequired]` 和 `[JsonPropertyName("user_name")]` 特性。

### 适用于方法的特性

#### [RelayCommand]

`[RelayCommand]` 从方法标注自动生成 `ICommand` 属性，消除命令包装的样板代码。

**命令命名约定：**

生成器根据方法名推导命令属性名，遵循以下规则：

| 方法名 | 生成的命令名 | 说明 |
|---|---|---|
| `Greet` | `GreetCommand` | 追加 "Command" |
| `OnGreet` | `GreetCommand` | 去除 "On" 前缀后追加 "Command" |
| `LoadDataAsync` | `LoadDataCommand` | 去除 "Async" 后缀后追加 "Command" |
| `OnLoadDataAsync` | `LoadDataCommand` | 同时去除 "On" 前缀和 "Async" 后缀 |

**同步命令：**

```CS
public partial class CounterViewModel : ObservableObject
{
    [ObservableProperty]
    private int _count;

    [RelayCommand]
    private void Increment()
    {
        Count++;
    }
}
```

生成器生成：

```CS
private RelayCommand? incrementCommand;

public IRelayCommand IncrementCommand => incrementCommand ??= new RelayCommand(Increment);
```

**带参数的命令：**

```CS
[RelayCommand]
private void GreetUser(User user)
{
    Console.WriteLine($"Hello, {user.Name}!");
}
```

生成的命令类型为 `IRelayCommand<User>`，自动使用方法参数类型作为泛型参数。

#### CanExecute 逻辑关联

通过 `CanExecute` 属性指定一个返回 `bool` 的方法名，命令会调用该方法判断是否可执行：

```CS
public partial class EditorViewModel : ObservableObject
{
    [ObservableProperty]
    [NotifyCanExecuteChangedFor(nameof(SaveCommand))]
    private bool _hasUnsavedChanges;

    [RelayCommand(CanExecute = nameof(CanSave))]
    private void Save()
    {
        // 保存逻辑
        HasUnsavedChanges = false;
    }

    private bool CanSave() => HasUnsavedChanges;
}
```

> [!WARNING]
> 命令不会自动感知 `CanExecute` 方法返回值的变化。必须通过 `NotifyCanExecuteChangedFor` 特性或手动调用 `SaveCommand.NotifyCanExecuteChanged()` 来刷新命令状态。

#### [RelayCommand(AllowConcurrentExecutions = true)]

对于异步命令，默认禁止并发执行——命令在执行期间会处于禁用状态。如果需要允许同时多次调用，设置 `AllowConcurrentExecutions = true`：

```CS
public partial class UploadViewModel : ObservableObject
{
    // 允许多个上传同时进行
    [RelayCommand(AllowConcurrentExecutions = true)]
    private async Task UploadFileAsync(FileInfo file, CancellationToken token)
    {
        await FileService.UploadAsync(file.FullName, token);
    }
}
```

#### [RelayCommand(IncludeCancelCommand = true)]

为异步命令自动生成配套的取消命令。生成的取消命令属性名为 `方法名 + CancelCommand`：

```CS
public partial class DownloadViewModel : ObservableObject
{
    [RelayCommand(IncludeCancelCommand = true)]
    private async Task DownloadAsync(CancellationToken token)
    {
        // 长时间运行的操作
        var data = await DownloadService.DownloadLargeFileAsync(token);
        ProcessData(data);
    }
}
```

生成的属性：
- `DownloadCommand`：`IAsyncRelayCommand`，执行下载
- `DownloadCancelCommand`：`ICommand`，调用时触发 `CancellationToken` 取消

```XAML
<Button Content="Download" Command="{Binding DownloadCommand}" />
<Button Content="Cancel" Command="{Binding DownloadCancelCommand}" />
```

#### [RelayCommand(FlowExceptionsToTaskScheduler = true)]

默认情况下，异步命令中的异常会在等待时重新抛出，可能导致应用崩溃。设置 `FlowExceptionsToTaskScheduler = true` 后，异常会通过 `IAsyncRelayCommand.ExecutionTask` 暴露，并传播到 `TaskScheduler.UnobservedTaskException`，不会导致崩溃：

```CS
[RelayCommand(FlowExceptionsToTaskScheduler = true)]
private async Task FetchDataAsync()
{
    // 即使这里抛出异常，应用也不会崩溃
    var data = await ApiService.FetchAsync();
    // 异常可通过 FetchDataCommand.ExecutionTask 检查
}
```

| 异常处理模式 | 行为 | 适用场景 |
|---|---|---|
| 等待并重新抛出（默认） | 异常在同步上下文中重新抛出 | 需要让调用方处理异常的场景 |
| 流式传送到任务调度器 | 异常通过 `ExecutionTask` 暴露，不崩溃 | 需要绑定任务状态到 UI 的场景 |

#### 自定义属性转发

与 `[ObservableProperty]` 一样，`[RelayCommand]` 也支持 `[property: ]` 语法将特性转发到生成的命令属性：

```CS
[RelayCommand]
[property: JsonIgnore]
private void Refresh()
{
    // ...
}
```

### 适用于类的特性

#### [INotifyPropertyChanged]

当不想继承 `ObservableObject` 基类时，可以使用 `[INotifyPropertyChanged]` 特性让源生成器直接为类实现 `INotifyPropertyChanged` 接口：

```CS
[INotifyPropertyChanged]
public partial class CustomModel
{
    [ObservableProperty]
    private string _name = string.Empty;
}
```

这种方式适用于 Model 层或不能改变继承结构的场景。

#### [ObservableObject]

`[ObservableObject]` 特性让源生成器直接生成 `ObservableObject` 的全部实现，等效于继承 `ObservableObject`，但不需要手动继承：

```CS
[ObservableObject]
public partial class SettingsModel
{
    [ObservableProperty]
    private bool _darkMode;

    [ObservableProperty]
    private string _language = "zh-CN";
}
```

与继承的区别在于：当类已经继承了其他基类时，无法再继承 `ObservableObject`，此时使用特性是唯一的方案。

#### [ObservableRecipient]（类级别）

类级别的 `[ObservableRecipient]` 特性让源生成器生成消息接收的完整实现，等效于继承 `ObservableRecipient`：

```CS
[ObservableRecipient]
public partial class ListenerViewModel
{
    [ObservableProperty]
    [NotifyPropertyChangedRecipients]
    private string _status = "Ready";
}
```

#### [ObservableProperty]（类级别，批量生成）

CommunityToolkit.Mvvm 8.2+ 支持 `[ObservableProperty]` 应用于类级别，为所有带特定特性的字段批量生成属性。这是一个较新的特性，适用于字段较多的场景。

## 4. 中继指令

中继指令是 CommunityToolkit.Mvvm 对 `ICommand` 接口的实现。源生成器特性 `[RelayCommand]` 负责生成命令属性的包装代码（详见第 3 章），而本章侧重命令类型本身的 API 和使用模式。

### RelayCommand

#### 同步命令的实现

`RelayCommand` 是同步命令的实现，封装一个 `Action` 作为执行逻辑。虽然通常通过 `[RelayCommand]` 特性自动生成，也可以手动创建：

```CS
public class ManualCommandViewModel : ObservableObject
{
    public IRelayCommand SubmitCommand { get; }

    public ManualCommandViewModel()
    {
        // 手动创建 RelayCommand
        SubmitCommand = new RelayCommand(ExecuteSubmit, CanExecuteSubmit);
    }

    private void ExecuteSubmit()
    {
        Console.WriteLine("提交成功");
    }

    private bool CanExecuteSubmit()
    {
        return true;
    }
}
```

使用 `[RelayCommand]` 特性时，以上代码简化为：

```CS
public partial class AutoCommandViewModel : ObservableObject
{
    [RelayCommand(CanExecute = nameof(CanSubmit))]
    private void Submit()
    {
        Console.WriteLine("提交成功");
    }

    private bool CanSubmit() => true;
}
```

#### CanExecute 参数详解

`CanExecute` 方法可以带参数，与命令参数保持一致：

```CS
public partial class ItemViewModel : ObservableObject
{
    [ObservableProperty]
    [NotifyCanExecuteChangedFor(nameof(DeleteCommand))]
    private bool _hasSelection;

    [ObservableProperty]
    [NotifyCanExecuteChangedFor(nameof(DeleteCommand))]
    private Item? _selectedItem;

    // CanExecute 方法接收与命令相同的参数类型
    [RelayCommand(CanExecute = nameof(CanDelete))]
    private void Delete(Item item)
    {
        Items.Remove(item);
    }

    private bool CanDelete(Item item)
    {
        return item is not null && HasSelection;
    }
}
```

XAML 绑定时，`CommandParameter` 会同时传递给 `Execute` 和 `CanExecute`：

```XAML
<Button Content="Delete"
        Command="{Binding DeleteCommand}"
        CommandParameter="{Binding SelectedItem}" />
```

#### NotifyCanExecuteChanged 手动刷新

当 `CanExecute` 方法的返回值依赖的状态发生变化时，需要手动通知命令重新评估：

```CS
public partial class EditorViewModel : ObservableObject
{
    private bool _isLoggedIn;

    [RelayCommand(CanExecute = nameof(CanSave))]
    private void Save()
    {
        // 保存逻辑
    }

    private bool CanSave() => _isLoggedIn;

    public void Login()
    {
        _isLoggedIn = true;
        // 手动通知命令重新评估 CanExecute
        SaveCommand.NotifyCanExecuteChanged();
    }
}
```

在实际开发中，如果 `_isLoggedIn` 是通过 `[ObservableProperty]` 生成的属性，可以使用 `[NotifyCanExecuteChangedFor(nameof(SaveCommand))]` 自动完成这一操作，无需手动调用。

### AsyncRelayCommand

#### 异步命令的实现

`AsyncRelayCommand` 封装 `Func<Task>` 作为异步执行逻辑。当方法返回 `Task` 时，`[RelayCommand]` 自动生成 `AsyncRelayCommand`：

```CS
public partial class DataViewModel : ObservableObject
{
    [ObservableProperty]
    private string _result = string.Empty;

    [RelayCommand]
    private async Task LoadDataAsync()
    {
        Result = await ApiService.FetchDataAsync();
    }
}
```

生成的命令类型为 `IAsyncRelayCommand`，它扩展了 `ICommand` 并提供异步相关属性：

| 属性/方法 | 类型 | 说明 |
|---|---|---|
| `ExecutionTask` | `Task?` | 当前执行的任务，可用于绑定 UI 状态 |
| `IsRunning` | `bool` | 命令是否正在执行 |
| `Cancel()` | `void` | 取消正在执行的异步操作（需配合 CancellationToken） |
| `NotifyCanExecuteChanged()` | `void` | 手动触发可执行状态刷新 |

可以在 XAML 中绑定 `IsRunning` 显示加载状态：

```XAML
<Button Content="Load"
        Command="{Binding LoadDataCommand}"
        IsEnabled="{Binding LoadDataCommand.IsRunning, Converter={StaticResource InverseBoolConverter}}" />
```

#### 异步操作中的并发控制

默认情况下，异步命令在执行期间会自动禁用（`IsRunning` 为 `true` 时 `CanExecute` 返回 `false`），防止重复执行。如果需要允许多次并发调用：

```CS
[RelayCommand(AllowConcurrentExecutions = true)]
private async Task UploadAsync()
{
    // 可以同时执行多个上传
    await FileService.UploadAsync();
}
```

| 配置 | 并发行为 | 命令状态 |
|---|---|---|
| `AllowConcurrentExecutions = false`（默认） | 执行期间禁用，完成后恢复 | 禁用 |
| `AllowConcurrentExecutions = true` | 允许多次并发调用 | 始终可用 |

#### CancellationToken 取消异步操作

当方法签名包含 `CancellationToken` 参数时，`[RelayCommand]` 会自动将其与命令的取消机制关联：

```CS
[RelayCommand(IncludeCancelCommand = true)]
private async Task SearchAsync(string keyword, CancellationToken token)
{
    try
    {
        Results = await SearchService.SearchAsync(keyword, token);
    }
    catch (OperationCanceledException)
    {
        // 用户取消搜索，正常退出
    }
}
```

调用 `SearchCommand.Cancel()` 或触发 `SearchCancelCommand` 会向 `CancellationToken` 发出取消信号，方法内部的 `token` 会收到取消通知。

#### 处理异步中的异常

异步命令有两种异常处理模式：

```CS
// 模式一：默认行为——异常重新抛出，可能导致应用崩溃
[RelayCommand]
private async Task RiskyOperationAsync()
{
    throw new InvalidOperationException("操作失败");
    // 异常会在等待时重新抛出
}

// 模式二：流式传送——异常不会崩溃，通过 ExecutionTask 暴露
[RelayCommand(FlowExceptionsToTaskScheduler = true)]
private async Task SafeOperationAsync()
{
    throw new InvalidOperationException("操作失败");
    // 异常被捕获，可通过 SafeOperationCommand.ExecutionTask.Exception 检查
}
```

绑定任务状态到 UI 的示例：

```CS
// 在 View 中监听任务完成
private async void OnSafeOperation()
{
    viewModel.SafeOperationCommand.Execute(null);

    await viewModel.SafeOperationCommand.ExecutionTask!;

    if (viewModel.SafeOperationCommand.ExecutionTask.IsFaulted)
    {
        var exception = viewModel.SafeOperationCommand.ExecutionTask.Exception;
        ShowError(exception.InnerException.Message);
    }
}
```

#### ExecutionTask 的绑定与监控

`IAsyncRelayCommand.ExecutionTask` 暴露了当前执行的任务，可以用于高级场景：

```CS
public partial class UploadViewModel : ObservableObject
{
    [RelayCommand(FlowExceptionsToTaskScheduler = true)]
    private async Task UploadAsync()
    {
        // 长时间运行的上传操作
    }

    // 监听任务状态变化
    public UploadViewModel()
    {
        UploadCommand.PropertyChanged += (s, e) =>
        {
            if (e.PropertyName == nameof(UploadCommand.ExecutionTask))
            {
                // 任务启动或完成
            }
        };
    }
}
```

## 5. 消息中继

消息中继（Messenger）是 CommunityToolkit.Mvvm 提供的发布/订阅消息系统，用于 ViewModel 之间的松耦合通信。发送方和接收方不需要互相引用，通过消息类型建立通信契约。

### 核心接口与实现

#### IMessenger 接口定义

`IMessenger` 是消息系统的核心接口，定义了消息注册、发送和注销的契约：

```CS
public interface IMessenger
{
    // 注册接收者
    void Register<TRecipient, TMessage>(TRecipient recipient, MessageHandler<TRecipient, TMessage> handler)
        where TRecipient : class
        where TMessage : class;

    // 注册带 Token 的接收者
    void Register<TRecipient, TMessage, TToken>(TRecipient recipient, TToken token, MessageHandler<TRecipient, TMessage> handler)
        where TRecipient : class
        where TMessage : class
        where TToken : IEquatable<TToken>;

    // 发送消息
    TMessage Send<TMessage>(TMessage message)
        where TMessage : class;

    // 发送带 Token 的消息
    TMessage Send<TMessage, TToken>(TMessage message, TToken token)
        where TMessage : class
        where TToken : IEquatable<TToken>;

    // 注销接收者
    void UnregisterAll(object recipient);

    void Unregister<TMessage>(object recipient)
        where TMessage : class;
}
```

#### WeakReferenceMessenger（默认推荐）

`WeakReferenceMessenger` 使用弱引用持有接收者引用，当接收者被 GC 回收时自动清理注册，避免内存泄漏：

```CS
// 获取默认实例
IMessenger messenger = WeakReferenceMessenger.Default;

// 发送消息
messenger.Send(new UserLoggedInMessage("alice"));

// 注册消息（非 ObservableRecipient 的手动注册方式）
messenger.Register<MainWindow, UserLoggedInMessage>(this, (recipient, message) =>
{
    recipient.ShowNotification($"欢迎回来, {message.Username}");
});
```

> [!NOTE]
> 在大多数场景下，推荐使用 `WeakReferenceMessenger.Default`。它通过弱引用机制避免内存泄漏，是工具包的默认选择。

#### StrongReferenceMessenger（特定场景使用）

`StrongReferenceMessenger` 使用强引用持有接收者，性能略高于弱引用版本，但要求开发者手动注销，否则会导致内存泄漏：

```CS
// 使用强引用 Messenger
IMessenger messenger = StrongReferenceMessenger.Default;

// 注册后必须手动注销
messenger.Register<MyViewModel, DataChangedMessage>(this, (r, m) => r.HandleDataChange(m));

// 在 ViewModel 销毁时注销
public void Cleanup()
{
    messenger.UnregisterAll(this);
}
```

| 特性 | WeakReferenceMessenger | StrongReferenceMessenger |
|---|---|---|
| 引用类型 | 弱引用 | 强引用 |
| 内存泄漏风险 | 低（自动清理） | 高（需手动注销） |
| 性能 | 标准性能 | 略高 |
| 推荐场景 | 通用场景（默认选择） | 高频消息、性能敏感场景 |

### Messages（消息）

#### 定义消息类

消息是普通的 C# 类，用于在发送方和接收方之间传递数据：

```CS
// 基础消息
public class UserLoggedInMessage
{
    public string Username { get; }

    public UserLoggedInMessage(string username)
    {
        Username = username;
    }
}
```

#### ValueChangedMessage\<T>（简单值传递）

`ValueChangedMessage<T>` 封装一个值的变更通知，是最简单的消息类型：

```CS
// 定义
public class CountChangedMessage : ValueChangedMessage<int>
{
    public CountChangedMessage(int value) : base(value)
    {
    }
}

// 发送
WeakReferenceMessenger.Default.Send(new CountChangedMessage(42));

// 接收
public void Receive(CountChangedMessage message)
{
    Console.WriteLine($"计数变为: {message.Value}");
}
```

#### PropertyChangedMessage\<T>（属性变更通知）

`PropertyChangedMessage<T>` 封装属性变更的详细信息，与 `ObservableRecipient.Broadcast` 方法和 `[NotifyPropertyChangedRecipients]` 特性配合使用：

```CS
// 由 Broadcast 方法自动发送
// 也可以手动发送
WeakReferenceMessenger.Default.Send(
    new PropertyChangedMessage<string>(
        sender: this,
        propertyName: nameof(Name),
        oldValue: "old",
        newValue: "new"));

// 接收
public void Receive(PropertyChangedMessage<string> message)
{
    Console.WriteLine($"属性 {message.PropertyName} 从 {message.OldValue} 变为 {message.NewValue}");
}
```

#### RequestMessage\<T>（请求/响应模式）

`RequestMessage<T>` 用于向其他 ViewModel 请求数据并获取响应。接收者设置 `Reply` 属性返回结果：

```CS
// 定义请求消息
public class GetCurrentUserNameMessage : RequestMessage<string>
{
}

// 发送请求并获取响应
string username = WeakReferenceMessenger.Default.Send(new GetCurrentUserNameMessage());

// 接收并响应
public void Receive(GetCurrentUserNameMessage message)
{
    message.Reply("Alice"); // 设置响应值
}
```

`Send` 方法返回的消息对象中包含 `Response` 属性，可直接获取响应结果。

#### AsyncRequestMessage\<T>（异步请求）

`AsyncRequestMessage<T>` 用于异步请求数据：

```CS
// 定义异步请求消息
public class LoadUserDataMessage : AsyncRequestMessage<User>
{
}

// 发送异步请求
Task<User> task = WeakReferenceMessenger.Default.Send(new LoadUserDataMessage()).Response;

// 接收并异步响应
public async void Receive(LoadUserDataMessage message)
{
    message.Reply(LoadUserFromDatabaseAsync());
}
```

#### CollectionRequestMessage\<T> / AsyncCollectionRequestMessage\<T>

这两种消息类型用于向多个接收者请求数据集合，所有接收者的响应会被聚合：

```CS
// 定义集合请求
public class GetActiveUsersMessage : CollectionRequestMessage<User>
{
}

// 发送
var allUsers = WeakReferenceMessenger.Default
    .Send(new GetActiveUsersMessage())
    .Responses;  // 返回 IEnumerable<User>

// 多个接收者各自回复部分数据
public void Receive(GetActiveUsersMessage message)
{
    message.Reply(this.LocalActiveUsers);
}
```

`AsyncCollectionRequestMessage<T>` 是其异步版本，接收者可以回复 `Task<T>`：

```CS
public async void Receive(GetRemoteDataMessage message)
{
    message.Reply(FetchDataFromApiAsync());
}
```

### Token（令牌）

#### 使用 Token 进行通道隔离

当多个同类型的消息需要区分来源或通道时，使用 Token 进行隔离。Token 可以是任何实现了 `IEquatable<T>` 的类型，通常使用 `string` 或枚举：

```CS
// 使用字符串作为 Token
WeakReferenceMessenger.Default.Register<MainViewModel, NotificationMessage, string>(
    this,
    "error_channel",
    (r, m) => r.ShowError(m.Content));

WeakReferenceMessenger.Default.Register<MainViewModel, NotificationMessage, string>(
    this,
    "info_channel",
    (r, m) => r.ShowInfo(m.Content));

// 发送到指定通道
WeakReferenceMessenger.Default.Send(new NotificationMessage("发生错误"), "error_channel");
WeakReferenceMessenger.Default.Send(new NotificationMessage("操作完成"), "info_channel");
```

#### 避免不同模块间的消息冲突

使用枚举作为 Token 可以获得更好的类型安全和可读性：

```CS
public enum MessengerChannels
{
    UserModule,
    OrderModule,
    SettingsModule
}

// 注册
WeakReferenceMessenger.Default.Register<UserViewModel, DataMessage, MessengerChannels>(
    this,
    MessengerChannels.UserModule,
    (r, m) => r.HandleUserData(m));

// 发送
WeakReferenceMessenger.Default.Send(
    new DataMessage(userData),
    MessengerChannels.UserModule);
```

### IRecipient（接收者）

#### 实现 IRecipient\<TMessage> 接口

`IRecipient<TMessage>` 是一个简洁的接口，定义了 `Receive` 方法。实现此接口的类可以被 `ObservableRecipient` 自动注册：

```CS
// 定义消息
public class LogoutMessage
{
}

// 实现接收者
public partial class HeaderViewModel : ObservableRecipient, IRecipient<LogoutMessage>
{
    public void Receive(LogoutMessage message)
    {
        // 清理用户数据
        UserName = string.Empty;
        Avatar = null;
    }

    [ObservableProperty]
    private string _userName = string.Empty;

    [ObservableProperty]
    private byte[]? _avatar;
}
```

#### Receive 方法处理逻辑

`Receive` 方法是同步的。如果需要执行异步操作，可以使用 `async void` 或在其中启动后台任务：

```CS
public async void Receive(DataSyncMessage message)
{
    // async void 在 Receive 中是安全的
    // 因为消息系统不需要等待其完成
    await SyncDataAsync(message.Data);
}
```

#### 在 ObservableRecipient 中的自动激活

`ObservableRecipient` 在 `IsActive` 设为 `true` 时，会自动扫描所有 `IRecipient<TMessage>` 实现并注册到 `Messenger`。设为 `false` 时自动注销：

```CS
public partial class MainViewModel : ObservableRecipient,
    IRecipient<UserLoggedInMessage>,
    IRecipient<UserLoggedOutMessage>
{
    public void Receive(UserLoggedInMessage message)
    {
        IsUserLoggedIn = true;
    }

    public void Receive(UserLoggedOutMessage message)
    {
        IsUserLoggedIn = false;
    }

    [ObservableProperty]
    private bool _isLoggedIn;

    // 在 View 中设置 IsActive = true 后自动注册两个消息
}
```

也可以不实现 `IRecipient<TMessage>` 接口，而是通过 `Messenger` 手动注册：

```CS
public partial class ManualViewModel : ObservableRecipient
{
    public ManualViewModel()
    {
        // 手动注册消息处理器
        Messenger.Register<ManualViewModel, SettingsChangedMessage>(this, (r, m) =>
        {
            r.ApplySettings(m.NewSettings);
        });
    }
}
```

手动注册时，`ObservableRecipient` 会在 `IsActive` 设为 `false` 时自动注销所有通过 `Messenger.Register` 注册的处理器。

## 6. 辅助工具与进阶

### Ioc（依赖注入）

#### 服务容器的基本使用

`Ioc` 是 CommunityToolkit.Mvvm 提供的轻量级依赖注入容器。它内部包装了一个 `IServiceProvider`，通过 `Ioc.Default` 单例访问：

```CS
using CommunityToolkit.Mvvm.DependencyInjection;

// 注册服务
Ioc.Default.ConfigureServices(
    new ServiceCollection()
        .AddSingleton<IDataService, DataService>()
        .AddSingleton<ILogger, ConsoleLogger>()
        .AddTransient<IFileDialogService, FileDialogService>()
        .BuildServiceProvider());

// 解析服务
var dataService = Ioc.Default.GetRequiredService<IDataService>();
var logger = Ioc.Default.GetService<ILogger>(); // 可能为 null
```

#### 服务注册与解析（Ioc.Default）

`Ioc.Default` 是一个全局单例，应用启动时配置一次即可：

```CS
// App.xaml.cs
public partial class App : Application
{
    protected override void OnStartup(StartupEventArgs e)
    {
        // 配置 DI 容器
        Ioc.Default.ConfigureServices(
            new ServiceCollection()
                .AddSingleton<IUserService, UserService>()
                .AddSingleton<IDialogService, DialogService>()
                .AddSingleton<MainViewModel>()
                .BuildServiceProvider());

        base.OnStartup(e);
    }
}
```

在 ViewModel 中通过构造函数注入服务：

```CS
public partial class UserListViewModel : ObservableObject
{
    private readonly IUserService _userService;

    public UserListViewModel()
    {
        // 通过 Ioc 获取服务
        _userService = Ioc.Default.GetRequiredService<IUserService>();
    }

    [RelayCommand]
    private async Task LoadUsersAsync()
    {
        Users = await _userService.GetAllUsersAsync();
    }
}
```

> [!WARNING]
> `Ioc.Default` 作为全局单例，在单元测试中难以替换。如果需要良好的可测试性，建议使用构造函数注入而非服务定位器模式。

#### 与 Microsoft.Extensions.DependencyInjection 的集成

`Ioc` 本质上是 `Microsoft.Extensions.DependencyInjection` 的薄包装。`ConfigureServices` 方法直接接收一个 `IServiceProvider`：

```CS
// 使用 .NET 通用主机配置
var host = Host.CreateDefaultBuilder(args)
    .ConfigureServices(services =>
    {
        services.AddSingleton<IUserService, UserService>();
        services.AddSingleton<MainViewModel>();
    })
    .Build();

// 将主机的 ServiceProvider 交给 Ioc
Ioc.Default.ConfigureServices(host.Services);
```

这种集成方式在 MAUI、WPF with .NET Generic Host 等现代 .NET 项目模板中尤为常见。

### TaskExtensions

#### SafeFireAndForget（静默执行后台任务）

`SafeFireAndForget()` 是一个扩展方法，用于启动"发射后不管"（fire-and-forget）的后台任务。它捕获异常并避免未观察的 `Task` 异常：

```CS
using CommunityToolkit.Mvvm.Input;

public partial class NotificationViewModel : ObservableObject
{
    [ObservableProperty]
    private string _lastNotification = string.Empty;

    public void ShowNotification(string message)
    {
        // 不阻塞调用线程
        DisplayNotificationAsync(message).SafeFireAndForget();
    }

    private async Task DisplayNotificationAsync(string message)
    {
        await Task.Delay(100); // 模拟 UI 延迟
        LastNotification = message;
    }
}
```

`SafeFireAndForget` 可以接收一个 `Action<Exception>` 回调来处理异常：

```CS
BackgroundWorkAsync().SafeFireAndForget(ex =>
{
    Logger.Error(ex, "后台任务执行失败");
});
```

| 特性 | 说明 |
|---|---|
| 默认行为 | 捕获异常，避免 `UnobservedTaskException` |
| 异常回调 | 可选的 `Action<Exception>` 参数 |
| 适用场景 | 日志记录、UI 通知、非关键后台操作 |
| 不适用场景 | 需要知道任务结果或需要重试的场景 |

### 从 MVVMLight 迁移

CommunityToolkit.Mvvm 的前身是 `Microsoft.Toolkit.Mvvm`，再之前是流行的 MVVMLight 库。以下是 MVVMLight 到 CommunityToolkit.Mvvm 的主要 API 对应关系：

| MVVMLight | CommunityToolkit.Mvvm | 说明 |
|---|---|---|
| `ViewModelBase` | `ObservableObject` | 基类更名 |
| `ObservableObject.Set(ref, value)` | `SetProperty(ref, value)` | 方法更名 |
| `RelayCommand` | `[RelayCommand]` 特性 | 改为源生成器驱动 |
| `RelayCommand<T>` | `[RelayCommand]` (带参数方法) | 泛型参数自动推断 |
| `Messenger.Default` | `WeakReferenceMessenger.Default` | 更名 |
| `IMessenger.Send<T>()` | `IMessenger.Send<T>(message)` | API 基本一致 |
| ` GalaSoft.MvvmLight.Command.RelayCommand` | `CommunityToolkit.Mvvm.Input.RelayCommand` | 命名空间变更 |
| `IOC` | `Ioc` | 大小写调整 |
| `ViewModelLocator` | 使用 `Ioc.Default` 或 DI 容器 | 不再需要 Locator |

常见迁移陷阱：

1. **命名空间变更**：从 `GalaSoft.MvvmLight` 变为 `CommunityToolkit.Mvvm`，需要全局替换 `using`
2. **命令定义方式**：MVVMLight 需要手写 `ICommand` 属性，CommunityToolkit 使用 `[RelayCommand]` 特性自动生成
3. **属性定义方式**：MVVMLight 需要手写 `get/set + Set()`，CommunityToolkit 使用 `[ObservableProperty]` 自动生成
4. **Messenger 单例**：`Messenger.Default` → `WeakReferenceMessenger.Default`，且默认使用弱引用
5. **IOC 大小写**：`IOC.Default` → `Ioc.Default`

## 7. 最佳实践与集成

### 属性、命令、消息的组合使用场景

一个完整的登录功能示例，综合运用属性通知、命令联动、数据验证和消息广播：

```CS
// 消息定义
public class LoginResultMessage : ValueChangedMessage<bool>
{
    public LoginResultMessage(bool isSuccess) : base(isSuccess) { }
}

// ViewModel
public partial class LoginViewModel : ObservableValidator
{
    private readonly IUserService _userService;

    public LoginViewModel(IUserService userService)
    {
        _userService = userService;
    }

    [ObservableProperty]
    [NotifyDataErrorInfo]
    [NotifyCanExecuteChangedFor(nameof(LoginCommand))]
    [Required(ErrorMessage = "用户名不能为空")]
    private string _username = string.Empty;

    [ObservableProperty]
    [NotifyDataErrorInfo]
    [NotifyCanExecuteChangedFor(nameof(LoginCommand))]
    [Required(ErrorMessage = "密码不能为空")]
    [StringLength(20, MinimumLength = 6, ErrorMessage = "密码至少 6 位")]
    private string _password = string.Empty;

    [ObservableProperty]
    private bool _isLoggingIn;

    [RelayCommand(CanExecute = nameof(CanLogin))]
    private async Task LoginAsync()
    {
        IsLoggingIn = true;

        try
        {
            var success = await _userService.LoginAsync(Username, Password);
            WeakReferenceMessenger.Default.Send(new LoginResultMessage(success));
        }
        finally
        {
            IsLoggingIn = false;
        }
    }

    private bool CanLogin()
    {
        return !HasErrors && !IsLoggingIn
            && !string.IsNullOrWhiteSpace(Username)
            && !string.IsNullOrWhiteSpace(Password);
    }
}
```

```XAML
<StackPanel Margin="20">
    <TextBox Text="{Binding Username, UpdateSourceTrigger=PropertyChanged}" />
    <PasswordBox x:Name="PasswordBox" />
    <Button Content="Login"
            Command="{Binding LoginCommand}"
            IsEnabled="{Binding LoginCommand.CanExecute}" />
    <ProgressBar IsIndeterminate="{Binding IsLoggingIn}"
                Visibility="{Binding IsLoggingIn, Converter={StaticResource BoolToVisibilityConverter}}" />
</StackPanel>
```

### 与 Avalonia/WPF/MAUI 的具体集成方式

#### WPF 集成

```CS
// App.xaml.cs
public partial class App : Application
{
    protected override void OnStartup(StartupEventArgs e)
    {
        Ioc.Default.ConfigureServices(
            new ServiceCollection()
                .AddSingleton<MainViewModel>()
                .AddSingleton<IDataService, DataService>()
                .BuildServiceProvider());

        var mainWindow = new MainWindow
        {
            DataContext = Ioc.Default.GetRequiredService<MainViewModel>()
        };
        mainWindow.Show();
    }
}
```

#### Avalonia 集成

```CS
// Program.cs
public static void Main(string[] args)
{
    Ioc.Default.ConfigureServices(
        new ServiceCollection()
            .AddSingleton<MainViewModel>()
            .BuildServiceProvider());

    BuildAvaloniaApp().StartWithClassicDesktopLifetime(args);
}
```

#### MAUI 集成

```CS
// MauiProgram.cs
public static MauiApp CreateMauiApp()
{
    var builder = MauiApp.CreateBuilder();
    builder.UseMauiApp<App>();

    // 配置 DI
    builder.Services.AddSingleton<MainViewModel>();
    builder.Services.AddSingleton<IDataService, DataService>();

    // 交给 Ioc
    var app = builder.Build();
    Ioc.Default.ConfigureServices(app.Services);

    return app;
}
```

在 MAUI 中，ViewModel 通常通过页面注册解析：

```CS
// 在页面中注入 ViewModel
public partial class MainPage : ContentPage
{
    public MainPage(MainViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}

// MauiProgram.cs 中注册页面与 ViewModel 的映射
builder.Services.AddTransient<MainPage>();
builder.Services.AddTransient<MainViewModel>();
```

### 内存管理与常见泄漏排查

#### WeakReferenceMessenger 的弱引用机制

`WeakReferenceMessenger` 使用 `WeakReference<T>` 持有接收者引用，当接收者被 GC 回收时，Messenger 中的注册条目会在下次消息发送时被清理。这是防止消息系统导致内存泄漏的核心机制。

但仍需注意以下泄漏场景：

| 泄漏场景 | 原因 | 解决方案 |
|---|---|---|
| `StrongReferenceMessenger` 未注销 | 强引用阻止 GC | 使用 `UnregisterAll(this)` 或改用 `WeakReferenceMessenger` |
| 事件订阅未取消 | C# 事件是强引用 | 在 `Unloaded` 或 `Dispose` 中取消订阅 |
| `Messenger.Register` 中的闭包捕获 `this` | 闭包持有 `this` 引用 | 使用 `(r, m) => r.Handle(m)` 模式，让 Messenger 持有弱引用 |
| 静态 Messenger 中的 Token 引用 | Token 可能间接持有大对象 | 使用值类型 Token（如枚举、int） |

#### ViewModel 生命周期管理

```CS
public partial class MyViewModel : ObservableRecipient, IDisposable
{
    public MyViewModel()
    {
        // IsActive = true 时自动注册
        IsActive = true;
    }

    public void Dispose()
    {
        IsActive = false;  // 自动注销所有消息

        // 取消所有外部事件订阅
        _externalService.DataChanged -= OnDataChanged;

        // 其他清理逻辑
    }
}
```

#### 检查内存泄漏的方法

1. **使用 WeakReference 检测**：创建 ViewModel 的 `WeakReference`，触发 GC 后检查是否被回收
2. **使用诊断工具**：Visual Studio 的「诊断工具」或 dotMemory 可以分析对象引用链
3. **常见排查步骤**：
   - 检查是否使用了 `StrongReferenceMessenger` 且未注销
   - 检查是否有 `event` 订阅未在页面卸载时取消
   - 检查 `Messenger.Register` 的闭包是否捕获了 `this`
   - 检查静态字段或单例是否持有 ViewModel 引用

```CS
// 调试用：检测 ViewModel 是否被 GC 回持
var weakRef = new WeakReference(viewModel);
viewModel = null;

GC.Collect();
GC.WaitForPendingFinalizers();
GC.Collect();

if (weakRef.IsAlive)
{
    // ViewModel 仍然存活，可能存在泄漏
    Debug.WriteLine("可能存在内存泄漏！");
}
```
