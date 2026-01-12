---
title: Prism
shortTitle: Prism
description: Prism
date: 2025-12-23 8:31:53
categories: [.NET, WPF]
tags: [.NET]
header: [1, 5]
author:
  name: Okita
  url: https://zhiyun.space
  email: 2368932388@qq.com
order: 8
---

> [Prism 中文文档](https://coreylyn.github.io/Prism-Documentation-zh/#/)

## 命令

### 命令操作

#### 创建Delegate Command

Prism 提供 `DelegateCommand` 和 `DelegateCommand<T>`，它们都是 Prism 对 `ICommand` 的封装，实现 MVVM 中常用的命令模式。

##### 不带参数的命令

```CS
public class MainWindowViewModel : BindableBase
{
    // 定义命令
    public DelegateCommand SubmitCommand { get; private set; }

    public MainWindowViewModel()
    {
        // 初始化：第一个参数是执行逻辑，第二个参数是判断能否执行
        SubmitCommand = new DelegateCommand(ExecuteSubmit, CanExecuteSubmit);
    }

    private void ExecuteSubmit()
    {
        // 点击按钮后的逻辑
    }

    private bool CanExecuteSubmit()
    {
        // 返回 true 按钮可用，返回 false 按钮禁用
        return true; 
    }
}
```

##### 带参数的命令

```CS
// 泛型定义，假设参数是 string
public DelegateCommand<string> ClickMeCommand { get; private set; }

public MainWindowViewModel()
{
    // 这里的参数类型变为 string
    ClickMeCommand = new DelegateCommand<string>(ExecuteClick);
}

private void ExecuteClick(string parameter)
{
    // parameter 就是 XAML 传过来的值
}
```

> [!NOTE]
>
> **`DelegateCommand<T>` 不支持值类型**（如 `int`, `bool`）
> 因为 XAML 初始化时会调用 `CanExecute(null)`，若 `T` 是值类型会导致异常。

#### 在View中调用命令

Prism 中的命令通常与 WPF 控件的 `Command` 属性绑定：

```XAML
<Button Content="Submit"
        Command="{Binding SubmitCommand}"
        CommandParameter="OrderId" />
```

该绑定会将按钮的点击事件自动关联到 ViewModel 中的命令，同时传递命令参数（可选）。当命令的 `CanExecute` 返回 `false` 时，该按钮自动禁用；当返回 `true` 时按钮可用。

#### 通知UI命令状态变化

Prism 提供了多种方式，使得当 ViewModel 内部状态变化时，自动通知 UI 对命令的可执行状态（CanExecute）做出响应：

##### RaiseCanExecuteChanged

手动触发命令状态刷新。

当 ViewModel 内部某些状态改变后，需要让命令自动重新评估是否可执行，可调用`SubmitCommand.RaiseCanExecuteChanged();`

```CS
private string _name;
public string Name
{
    get { return _name; }
    set
    {
        SetProperty(ref _name, value);
        // 手动告诉命令：状态变了，请重新检查 CanExecute
        SubmitCommand.RaiseCanExecuteChanged();
    }
}
```

这种手动触发方式适用于逻辑复杂或多条件影响命令可用性时。

##### ObservesProperty

如果命令是否可执行取决于一个或多个 ViewModel 属性，可使用 `ObservesProperty` 注册这些属性，这样 setter 里就不需要写 RaiseCanExecuteChanged 了，Prism 会自动处理：

```CS
public class ArticleViewModel : BindableBase
{
    private bool _isEnabled;
    public bool IsEnabled
    {
        get { return _isEnabled; }
        set { SetProperty(ref _isEnabled, value); }
    }

    public DelegateCommand SubmitCommand { get; private set; }

    public ArticleViewModel()
    {
        SubmitCommand = new DelegateCommand(Submit, CanSubmit)
            .ObservesProperty(() => IsEnabled);
    }

    void Submit() { /* 实现逻辑 */ }

    bool CanSubmit() { return IsEnabled; }
}
```

##### ObservesCanExecute

这是 `ObservesProperty` 的简化版，适用于更简单的场景。

- **场景：** 你的 ViewModel 中已经有一个 `bool IsEnabled` 属性来控制按钮状态。
- **方法：** `.ObservesCanExecute(() => IsEnabled)`
- **特点：** 不需要再写 `CanExecuteSubmit` 这个方法了，Prism 会直接使用 `IsEnabled` 的值作为命令是否可用的依据。

```CS
public class ArticleViewModel : BindableBase
{
    private bool _isEnabled;
    public bool IsEnabled
    {
        get { return _isEnabled; }
        set { SetProperty(ref _isEnabled, value); }
    }

    public DelegateCommand SubmitCommand { get; private set; }

    public ArticleViewModel()
    {
        // 不需要第二个参数，直接绑定到IsEnabled
        SubmitCommand = new DelegateCommand(Submit)
            .ObservesCanExecute(() => IsEnabled);
    }

    void Submit() { /* 实现逻辑 */ }
}
```

> [!NOTE]
>
> 不要链式调用多个 `ObservesCanExecute`，只能注册一个属性。

#### 基于`Task`的命令

WPF 的命令（`ICommand`）本身是同步模型，它的 `Execute` 和 `CanExecute` 方法签名不能返回 `Task`。

因此 Prism 的官方建议是：

- 将异步逻辑放在命令的执行委托中，而命令本身仍然是同步的
- 使用 `async void` 或在委托中包裹异步操作

##### 方式1：async void执行异步方法

```CS
public class ArticleViewModel
{
    public DelegateCommand SubmitCommand { get; private set; }

    public ArticleViewModel()
    {
        SubmitCommand = new DelegateCommand(Submit);
    }

    async void Submit()
    {
        await SomeAsyncMethod();
    }
}
```

这种写法最简洁，但要注意 `async void` 不适合有返回值的场景，仅适合作为事件处理。

##### 方式2：构造函数中使用异步lambda

```CS
public class ArticleViewModel
{
    public DelegateCommand SubmitCommand { get; private set; }

    public ArticleViewModel()
    {
        SubmitCommand = new DelegateCommand(async ()=> await Submit());
    }

    Task Submit()
    {
        return SomeAsyncMethod();
    }
}
```

这种写法可以使用标准 `Task` 方法，并且保持命令执行逻辑更清晰。

### 复合命令

**定义**：

- 复合命令（CompositeCommand）是一个全局可用的命令，它内部聚合了多个子命令（child commands）。
- 当执行复合命令时，它会顺序执行所有已注册的子命令。
- 当查询 CanExecute 时，只有**所有**子命令的 CanExecute 都返回 true 时，复合命令才返回 true。

**作用**：

- 实现跨多个 ViewModel 的共享命令逻辑。
- 典型场景：全局“保存”命令（SaveAll），它会调用所有活动模块的保存操作。
- 允许不同模块独立注册自己的命令实现，而无需相互依赖。

#### 创建Composite Command

```CS
public class ApplicationCommands
{
    // 可以定义为静态单例，便于全局访问
    public static CompositeCommand SaveAllCommand = new CompositeCommand();
}
```

**构造函数选项**：

- `CompositeCommand()`：默认行为（所有子命令 `CanExecute` 为 true 时才可用）。
- `CompositeCommand(bool monitorCommandActivity)`：如果传入 true，会监控子命令的 `CanExecuteChanged` 事件。

#### 使复合命令全局可用

> [!TIP]
>
> 推荐使用**依赖注入**实现，以提高代码的可维护性。

##### 依赖注入

1. 创建接口

   ```CS
   public interface IApplicationCommands
   {
       CompositeCommand SaveCommand { get; }
   }
   ```

2. 创建实现接口的类

   ```CS
   public class ApplicationCommands : IApplicationCommands
   {
       private CompositeCommand _saveCommand = new CompositeCommand();
       public CompositeCommand SaveCommand
       {
           get =>_saveCommand;
       }
   }
   ```

3. 定义 ApplicationCommands 类后，必须将其注册为容器中的单一实例。

   ```CS
   public partial class App : PrismApplication
   {
       protected override void RegisterTypes(IContainerRegistry containerRegistry)
       {
           containerRegistry.RegisterSingleton<IApplicationCommands, ApplicationCommands>();
       }
   }
   ```

4. 在 ViewModel 构造函数中请求 `IApplicationCommands` 接口。拥有该 `ApplicationCommands` 类的实例后，现在可以将 DelegateCommands 注册到相应的 CompositeCommand。

   ```CS
   public DelegateCommand UpdateCommand { get; private set; }
   
   public TabViewModel(IApplicationCommands applicationCommands)
   {
       UpdateCommand = new DelegateCommand(Update);
       applicationCommands.SaveCommand.RegisterCommand(UpdateCommand);
   }
   ```

##### 静态类

1. 创建一个表示 CompositeCommands 的静态类

   ```CS
   public static class ApplicationCommands
   {
       public static CompositeCommand SaveCommand = new CompositeCommand();
   }
   ```

2. 在 ViewModel 中，将子命令关联到静态 `ApplicationCommands` 类。

   ```CS
   public DelegateCommand UpdateCommand { get; private set; }
   
   public TabViewModel()
   {
       UpdateCommand = new DelegateCommand(Update);
       ApplicationCommands.SaveCommand.RegisterCommand(UpdateCommand);
   }
   ```

#### 绑定到全局可用的命令

创建 CompositeCommands 后，现在必须将它们绑定到 UI 元素才能调用这些命令。

##### 依赖注入

在使用依赖注入（DI）时，您必须暴露 `IApplicationCommands` 以便于在视图上进行绑定。在视图的ViewModel中，需要在构造器中请求 `IApplicationCommands` ，并将一个类型为 `IApplicationCommands` 的属性设置为该实例。

```CS
public class MainWindowViewModel : BindableBase
{
    private IApplicationCommands _applicationCommands;
    public IApplicationCommands ApplicationCommands
    {
        get => _applicationCommands;
        set => SetProperty(ref _applicationCommands, value);
    }

    public MainWindowViewModel(IApplicationCommands applicationCommands)
    {
        ApplicationCommands = applicationCommands;
    }
}

```

在视图中，将按钮绑定到 `ApplicationCommands.SaveCommand` 属性。 `SaveCommand` 是在 `ApplicationCommands` 类上定义的属性。

```XAML
<Button Content="Save" Command="{Binding ApplicationCommands.SaveCommand}"/>
```

##### 静态类

如果使用的是静态类方法，下面的代码示例演示如何将按钮绑定到 WPF 中的静态 `ApplicationCommands` 类。

```XAML
<Button Content="Save" Command="{x:Static local:ApplicationCommands.SaveCommand}" />
```

#### 注销命令

使用 `UnregisterCommand` 在对象销毁时注销，避免内存泄漏。

```CS
public void Destroy()
{
    _applicationCommands.UnregisterCommand(UpdateCommand);
}
```

#### 在活动视图上执行命令

**CompositeCommand** 默认会执行所有已注册的子命令。

在多视图场景（如 TabControl、多个 Region）中，可能只想在当前活跃的视图上执行命令（例如“保存”只保存当前 Tab 的内容）。

Prism 通过 **IActiveAware** 接口解决这个问题：只有 IsActive == true 的子命令才参与执行和 CanExecute 判断。

> **自动管理**：当使用 Prism 的 Region 导航（IRegionManager.RequestNavigate）时，Prism 会自动设置视图的 IsActive 状态，无需手动处理。
>
> **手动管理**：如果不是通过 Region 导航（如自定义 TabControl），需要手动设置 command.IsActive = true/false 并触发 IsActiveChanged。

##### IActiveAware接口

**定义：**

```CS
public interface IActiveAware
{
    bool IsActive { get; set; }
    event EventHandler IsActiveChanged;
}
```

**作用：**

- IsActive 属性表示命令是否处于活跃状态。
- IsActiveChanged 事件通知 CompositeCommand 状态变化，触发 CanExecute 重新评估。

##### 实现IactiveAware的DelegateCommand

Prism 的 `DelegateCommand` 已经实现了 `IActiveAware`，因此可以直接使用。

示例：创建一个可感知活跃状态的命令

```CS
public class SaveCommand : DelegateCommand
{
    public SaveCommand() : base(Save, CanSave)
    {
    }

    private void Save()
    {
        // 保存当前视图的数据
    }

    private bool CanSave()
    {
        return true; // 或根据当前视图状态判断
    }
}
```

`DelegateCommand` 自动实现 `IActiveAware`，Prism 的 Region 导航会自动设置 IsActive（当视图激活时设为 true，停用时设为 false）。

##### 在ViewModel中使用

通常在实现 `INavigationAware` 或 `IConfirmNavigationRequest` 的 ViewModel 中，命令会自动感知活跃状态。

示例：Tab页面的ViewModel

```CS
public class CustomerViewModel : BindableBase, INavigationAware
{
    public DelegateCommand SaveCommand { get; }

    public CustomerViewModel()
    {
        SaveCommand = new DelegateCommand(Save, CanSave);
        // Prism 会自动管理 SaveCommand.IsActive
    }

    private void Save()
    {
        // 只在当前 Tab 活跃时执行
    }

    private bool CanSave()
    {
        return true;
    }

    // INavigationAware 方法中 Prism 会自动设置 IsActive
    public void OnNavigatedTo(NavigationContext navigationContext)
    {
        // 视图激活时触发
    }

    public void OnNavigatedFrom(NavigationContext navigationContext)
    {
        // 视图停用时触发
    }
}
```

##### 复合命令的行为

当注册实现 IActiveAware 的命令时：

- **Execute**：只执行 IsActive == true 的子命令。
- **CanExecute**：只考虑活跃子命令的状态（所有活跃子命令都可执行时返回 true）。

示例：全局SaveAll命令

```CS
public class ShellViewModel
{
    public CompositeCommand SaveAllCommand { get; }

    public ShellViewModel()
    {
        SaveAllCommand = new CompositeCommand();

        // 注册多个 Tab 的 Save 命令
        SaveAllCommand.RegisterCommand(CustomerViewModel.SaveCommand);
        SaveAllCommand.RegisterCommand(OrderViewModel.SaveCommand);
        SaveAllCommand.RegisterCommand(ProductViewModel.SaveCommand);
    }
}
```

当用户点击“全部保存”按钮：

- 只执行当前活跃 Tab 的 Save 命令（其他非活跃的被忽略）。
- 如果当前活跃 Tab 的命令不可执行，整个 SaveAll 按钮会被禁用。

##### XAML绑定

与普通命令相同：

```XAML
<Button Content="Save All" Command="{Binding SaveAllCommand}" />
```

按钮会根据活跃视图的命令状态自动启用/禁用。

### 异步命令

Prism 在 9.0 版本引入了原生支持异步命令的类型 **`AsyncDelegateCommand`** 和 **`AsyncDelegateCommand<T>`**，用于更自然地处理基于 `Task` 的异步操作，而不是使用同步 `ICommand` 包裹异步逻辑。

在 .NET MVVM 模式中，`ICommand` 本质上是一个事件处理机制，它的 `Execute` 和 `CanExecute` 方法都是同步定义的（来自 `ICommand`）。由于这种设计，异步操作如果直接放入 `Execute` 或使用 `async void`，会带来执行控制与错误处理方面的局限性。

为了更好支持 `async/await` 模式，Prism 设计了 `AsyncDelegateCommand`，并定义了如下接口：

```CS
public interface IAsyncCommand : ICommand
{
    Task ExecuteAsync(object? parameter);
    Task ExecuteAsync(object? parameter, CancellationToken cancellationToken);
}
```

这个接口在 Prism 中被实现为 `AsyncDelegateCommand` 和 `AsyncDelegateCommand<T>`。这样的命令允许编写真正的异步逻辑，同时仍然可以与 WPF 或其他 XAML 平台的数据绑定命令系统配合使用

#### 创建异步命令

在ViewModel中定义异步命令通常如下：

```CS
public AsyncDelegateCommand LoadDataCommand { get; }

public YourViewModel()
{
    LoadDataCommand = new AsyncDelegateCommand(LoadDataAsync);
}

private async Task LoadDataAsync()
{
    // 异步操作，例如从 API 加载数据
}
```

如果需要传参的异步命令，可以使用泛型版本 `AsyncDelegateCommand<T>`：

```CS
public AsyncDelegateCommand<int> DeleteItemCommand { get; }

public YourViewModel()
{
    DeleteItemCommand = new AsyncDelegateCommand<int>(DeleteItemAsync);
}

private async Task DeleteItemAsync(int id)
{
    // 删除项的异步逻辑
}
```

这样写的好处是命令执行会返回 `Task`，可以结合 `await` 或后续的状态处理代码。

#### 执行AsyncDelegateCommand

**执行行为**：

- 调用 Execute 时，命令启动异步任务。
- 任务运行期间，IsExecuting 为 true。
- 任务完成后，IsExecuting 恢复为 false。

**XAML绑定：**

```XAML
<Button Content="Submit" 
        Command="{Binding SubmitCommand}"
        IsEnabled="{Binding SubmitCommand.IsNotExecuting}" />
```

或者使用加载指示器：

```XAML
<Button Content="Submit">
    <Button.Style>
        <Style TargetType="Button">
            <Setter Property="Content" Value="Submit"/>
            <Style.Triggers>
                <DataTrigger Binding="{Binding SubmitCommand.IsExecuting}" Value="True">
                    <Setter Property="Content" Value="Submitting..."/>
                </DataTrigger>
            </Style.Triggers>
        </Style>
    </Button.Style>
</Button>
```

**IsExecuting属性**

- **IsExecuting**：
  - 只读布尔属性，表示命令是否正在执行异步任务。
  - 可绑定到 UI（如禁用按钮、显示加载动画）。
- **IsNotExecuting**：
  - IsExecuting 的反转，便于绑定 IsEnabled。

```XAML
<Button Content="Save" 
        Command="{Binding SaveCommand}"
        IsEnabled="{Binding SaveCommand.IsNotExecuting}"/>
<ProgressBar IsIndeterminate="{Binding SaveCommand.IsExecuting}"/>
```

#### 并行执行

默认情况下：

- **异步命令不允许并行执行**。

- Prism 会在命令还未完成前将 `CanExecute` 返回为 false，从而阻止重复触发。

- 如果你希望命令能够允许多次同时执行（即并行执行），可以调用：

  ```CS
  yourAsyncCommand.EnableParallelExecution();
  ```

启用并行执行后：

- 每次触发命令都会创建新的任务；
- 此前正在执行的任务不会阻止新的命令触发。

#### CancellationTokenSource配置

Prism 提供对命令执行期间 CancellationToken 的配置支持，用于在异步命令执行过程中实现取消操作。你可以通过两种方式进行配置：

##### 设置超时时间

当你希望命令在一段时间后自动取消时，可以提供一个超时：

~~~CS
var cmd = new AsyncDelegateCommand(SomeAsyncMethod)
    .WithCancellationAfter(TimeSpan.FromSeconds(10));
~~~

##### 自定义CancellationToken

如果你希望使用自定义的 `CancellationToken`，例如 ViewModel 中已有的取消逻辑：

```CS
var cmd = new AsyncDelegateCommand(SomeAsyncMethod)
    .WithCancellationToken(() => yourCancellationTokenSource.Token);
```

#### 对比传统`DelegateCommand`

传统的 `DelegateCommand` 可以通过 `async void` 或 `async Task` 包装来执行异步逻辑（Prism 旧文档也提过这种方式），**但不建议在 Execute 中直接使用 `async void`**，因为：

- 无法捕捉异常；
- 不利于命令执行状态控制；
- 与 `CanExecute` 逻辑分离。

### 错误处理

Prism 9 为 **所有命令类型**（包括 `DelegateCommand`、`AsyncDelegateCommand` 等）引入了更强的错误处理支持，其目标是：

1. **减少在每个命令中执行 try/catch 的需求；**
2. **允许根据异常类型提供不同处理逻辑；**
3. **便于在多个命令间共享错误处理逻辑。**

#### 命令链上配置错误处理

在使用 Prism 的命令时，你可以链式调用错误处理逻辑：

```CS
new DelegateCommand(() => { /* 业务逻辑 */ })
    .Catch<NullReferenceException>(ex =>
    {
        // 针对 NullReferenceException 的处理逻辑
    })
    .Catch(ex =>
    {
        // catch 其他所有异常
    });
```

- 如果命令执行过程中抛出 `NullReferenceException`，则优先执行特定处理器。
- 如果抛出其他异常，则执行通用处理器。

## 依赖注入

#### 生命周期

##### Transient

- 每次从容器解析都会创建一个 **新的实例**。
- 适用于无状态服务、视图模型等不需要保持跨界状态的类型。

```CS
// 若只传入一个类型，则默认行为是自身实现（无需接口）
containerRegistry.Register<FooService>();
containerRegistry.Register<IBarService, BarService>();
```

##### Singleton

- 整个应用生命周期内只创建一个实例，并在后续每次请求时复用该实例。
- 适用于资源管理服务、跨模块共享状态服务等。

```CS
containerRegistry.RegisterSingleton<FooService>();
containerRegistry.RegisterSingleton<IBarService, BarService>();
```

> [!NOTE]
>
> 单例服务直到第一次解析时才会真正实例化，有助于延迟资源占用。

##### Scoped

- 在 Prism 大多数平台上**默认不启用**（除 MAUI 中每个 Page Scope）。
- 当你希望在某个逻辑作用域内共享同一个实例，但在作用域结束后释放，可使用 Scoped。
- 在 MAUI 中，Prism 已将导航生生命周期（Page 显示周期）视为一个作用域。

#### 注册已存在的服务实例

在某些情况下，你已经实例化了某个对象 **并希望把它作为服务提供给 DI 容器**，可以直接通过实例注册，例如集成第三方库对象

```CS
containerRegistry.RegisterInstance<IFoo>(new FooImplementation());
containerRegistry.RegisterInstance<IBarrel>(Barrel.Current);
```

这种注册同样默认为Singleton。

#### 检查服务是否已注册

有时候在模块或插件初始化时，需要判断某个服务是否已被注册，这可用来实现 **默认实现或条件注册**。

```CS
if (containerRegistry.IsRegistered<ISomeService>())
{
    // 按需处理
}
```

> [!NOTE]
>
> 对于 Prisma 模块而言，如果某个服务是必需的，应该通过构造函数注入，这样缺少注册会在初始化阶段直接抛异常，而不是延迟判断。

#### 懒加载

为了优化性能或节省内存，Prism 支持在注入构造函数中使用 **`Func<T>` 或 `Lazy<T>`** 来实现懒加载。

```CS
public class ViewAViewModel
{
    public ViewAViewModel(Func<IFoo> fooFactory, Lazy<IBar> lazyBar)
    {
    }
}
```

这种方式会延迟服务实例化直到你真正需要使用它。

> 对单例服务使用这种方式往往意义不大，因为单例本身就只有一个实例。

#### 多实现注册与批量解析

在某些场景下，你可能会为同一个接口注册多个不同的实现，典型用于插件或模块扩展点。这时可以注入 `IEnumerable<T>` 来获取所有实现类型。

```CS
public class SomeService
{
    public SomeService(IEnumerable<IFoo> fooCollection)
    {
    }
}
```

这让你可以一次性处理所有实现，而无需手动逐一解析。

> 当前该特性主要在 DryIoc 中可用，Unity 容器的支持可能随着版本改进而增强

### 关于 `IServiceCollection` 的支持

Prism 的依赖注入体系主要围绕 **Prism 自己的抽象接口（`IContainerRegistry` / `IContainerProvider`）** 实现，而并 **不直接采用 `Microsoft.Extensions.DependencyInjection` 的默认 DI 容器**。这是 Prism 设计上的一个重要决定，与 Web 平台 DI 有明显区分。

#### 为什么需要与`IServiceCollection`协同

在 .NET 生态中，特别是 ASP.NET Core / .NET MAUI 等框架中，`Microsoft.Extensions.DependencyInjection`（以下简称 **Ms DI**）是一个行业标准 DI 注册机制：

- 它通过 `IServiceCollection` 注册服务；
- 由 `IServiceProvider` 提供解析；
- 支持三种生命周期（Scoped、Singleton、Transient）。

在某些场景下，例如在 MAUI 应用中：

- 你可能想使用官方库带的扩展方法（如 `HttpClientFactory`、Entity Framework Core 等）；
- 这些扩展方法规范化地基于 `IServiceCollection`；
- 如果 Prism 无法识别这些注册扩展，则无法与 Prism 容器共享服务。

为了扩大兼容性，Prism 在 9.0 版本中做了增强，允许你**将 Ms DI 的服务注册扩展与 Prism DI 容器集成**。

#### Prism 为什么仍坚持使用自己的 DI 抽象而不是 Ms DI

Prism 强依赖 **可变容器**，即在应用生命周期中服务注册可被修改（例如模块加载时注册服务）。而 Ms DI 容器一旦构建就变为不可变（Immutable）：

- Ms DI 的设计适合 Web 请求生命周期；
- 对于桌面或移动应用，这限制了动态注册的能力（Prism 模块化、视图注册等需要动态行为）。

#### 如何让Prism支持`IServiceCollection`扩展注册

Prism 支持将 **Ms DI 的 `IServiceCollection` 与 Prism 自身容器兼容**，方式通常是：

1. 在创建 Prism 容器之前构建一个 `ServiceCollection`；
2. 使用适配器（针对具体容器实现，比如 DryIoc）将 `ServiceCollection` 的服务合并到 Prism 容器；
3. 返回基于该集成后的容器作为应用 DI 容器。

```CS
var services = new ServiceCollection();

// 使用 Ms DI 扩展注册服务，例如 AddHttpClient、AddLogging 等
services.AddHttpClient();
services.AddSingleton<ISomeService, SomeService>();

// 将其适配到 Prism 支持的容器（例如 DryIoc）
var container = new DryIoc.Container();

// 这里 WithDependencyInjectionAdapter 方法把 Ms DI 注册加入 DryIoc
container.WithDependencyInjectionAdapter(services);

// 将容器包装为 Prism 的 IContainerExtension 并返回
return new DryIocContainerExtension(container);

```

- 使用 Ms DI 的扩展方法注册服务；
- Prism 的 DI 容器仍然负责最终解析依赖。

### 平台特定服务



### 异常处理

Prism 8 及以上版本对 **依赖注入解析错误** 提供了专门的机制。当 DI 容器在运行时尝试解析类型时，可能因为各种原因失败，比如：

- 未注册服务；
- 试图解析抽象类型；
- 循环依赖；
- XAML 视图解析时发生异常。

为了帮助你更快定位问题，Prism 将底层容器异常捕获并重新抛出为 **`ContainerResolutionException`**，它包含更多诊断信息。

#### 为什么需要处理解析错误

在大型 Prism 应用中，依赖注入是在启动、模块加载、导航解析 View/VM 的过程中广泛使用的。如果某个类型在容器中 **未注册或者无法创建**，框架需要：

- 提供**清晰有用的错误信息**；
- 允许你在应用层捕获错误并处理。

特别是在模块初始化或页面导航时，这类错误很常见且难调试，因此官方增强了错误反馈机制。

#### ContainerResolutionException

当发生解析错误时，Prism 容器扩展统一抛出 **`ContainerResolutionException`**：

~~~CS
throw new ContainerResolutionException(...);
~~~

该异常包含以下关键特性：

- **常量消息**：比如 “`MissingRegistration`”（未注册）、“`CannotResolveAbstractType`”（无法解析抽象类型）、“`CyclicalDependency`”（循环依赖）等；
- **属性信息**：包含正在解析的 **ServiceType**（或名称）；
- **GetErrors() 方法**：返回一组错误元组，用于逐项检查具体失败原因。

#### 在模块加载阶段捕获解析错误

Prism 的模块管理器（`IModuleManager`）可以在模块加载完成事件中捕获这个异常并分析错误细节。处理典型流程如下：

```CS
protected override void InitializeModules()
{
    var manager = Container.Resolve<IModuleManager>();
    manager.LoadModuleCompleted += LoadModuleCompleted;
    manager.Run();
}

private void LoadModuleCompleted(object sender, LoadModuleCompletedEventArgs e)
{
    if (e.Error != null)
    {
        // 进行错误处理
        HandleModuleLoadError(e.Error);
    }
}
```

在回调中，你可以检查是否是 **ContainerResolutionException** 并调用其 `GetErrors()`：

```CS
void HandleModuleLoadError(Exception error)
{
    if (error is ContainerResolutionException cre)
    {
        var errors = cre.GetErrors();
        foreach (var (type, ex) in errors)
        {
            Console.WriteLine($"Error with: {type.FullName}");
            Console.WriteLine($"{ex.GetType().Name}: {ex.Message}");
        }
    }
}
```

输出可能类似：

```SQL
Error with: MyProject.Services.IServiceIForgotToRegister  
ContainerResolutionException: No Registration was found in the container for the specified type
```

这样你就可以定位是哪个类型解析失败并迅速修复注册问题。

### 容器定位器

在 Prism 9/8 的 DI 模型中，**`ContainerLocator`** 是一个静态辅助类，用于集中管理当前 Prism DI 容器实例（`IContainerExtension` / `IContainerProvider`）。它主要用于解决以下几个场景：[Prism Library](https://docs.prismlibrary.com/docs/dependency-injection/container-locator.html?utm_source=chatgpt.com)

- 在 **XAML 标记扩展（Markup Extensions）** 或静态上下文中访问容器解析服务。
- 在 **应用启动之前提前配置或共享容器**（例如与第三方库框架集成）。
- 在 **单元测试或跨模块插件场景** 中临时设置/重置容器。

#### 为什么需要`ContainerLocator`

Prism 原本依赖 `CommonServiceLocator` 在内部访问容器以支持旧的 service locator 行为，但 Prism 从 **8.0 版本起移除对它的依赖**。取而代之的是由 Prism 提供的更清晰的静态容器访问点：`ContainerLocator`。

这种做法主要为了解决几个关键问题：

1. **在 XAML 扩展中访问容器**
   有些标记扩展需要在 XAML 执行阶段解析服务类型，而此时 ViewModel/应用尚未初始化。`ContainerLocator` 允许静态访问注册好的 DI 容器。

2. **提前构建和共享容器**

   当你需要在 PrismApplication 创建之前构建容器（例如集成 Shiny、第三方 DI 方案、或提前注入 Ms DI 服务集合）时，`ContainerLocator` 提供可延迟设置容器的方法。

3. **测试场景的容器重置**
   在单元测试过程中为了确保状态隔离，你可以重置容器，使其在每个测试间清空。

#### 使用方法

Prism 提供两个主要静态入口：

##### 设置容器的创建逻辑（惰性延迟）

```CS
var createContainerExtension = () => new DryIocContainerExtension();
ContainerLocator.SetContainerExtension(createContainerExtension);
```

这段代码将一个容器创建函数注册给 `ContainerLocator`：

- DI 容器 **不会立即创建**；
- 容器会在你第一次访问 `ContainerLocator.Container` 时才真正实例化

> [!NOTE]
>
> 如果没有调用 `ContainerLocator.Container` 访问它，随后再次调用 `SetContainerExtension` 会覆盖之前设置的创建委托。也就是说不要忘记触发容器初始化。

##### 访问当前容器

```CS
var container = ContainerLocator.Container;
```

该属性返回当前 Prism DI 容器的 **`IContainerExtension`** 实例：

- 你可以使用它执行注册（在启动前）；
- 或者直接在静态上下文中解析服务。

> [!NOTE]
>
> Prism 应用在启动过程中通常内部已经设置好容器，因此在正常应用启动下你通常不需要显式 `SetContainer`。只有在需要特殊场景才用。

#### 在XAML标记扩展中访问服务

有时候你会在 XAML 扩展内部想要解析服务，例如获取全局的 `IEventAggregator`：

```CS
private static readonly Lazy<IEventAggregator> _lazyEventAggregator =
    new Lazy<IEventAggregator>(() => ContainerLocator.Container.Resolve<IEventAggregator>());
```

这样在 MarkupExtension 的执行期间就能访问 Prism 注册的服务了，而不用依赖当前 ViewModel 环境。

#### 重置容器

当你在单元测试中重复使用容器可能导致状态污染（singleton、注册冲突等），可以调用：

```CS
ContainerLocator.ResetContainer();
```

该方法会：

- 清空当前容器实例；
- 清除创建委托；
- 容器本身会被释放。

### Prism容器扩展

#### 背景

Prism 默认提供了基本的 DI 注册与解析能力，通常已经能满足大多数场景：

- 单例与瞬态注册；
- 标准服务与页面/导航注册；
- 构造函数注入等。

但在某些复杂场景下，你可能需要：

- **利用工厂方法注册服务**；
- 为一个类型同时注册多个接口；
- 在不同接口解析时保证使用 **同一个实例**；
- 或者要与一些第三方库本身设计的 DI 体系配合。

这时 Prism 官方提供了 **容器扩展包（Prism.Container.Extensions）** 作为可选补充。

#### 何时使用Prism容器扩展

##### 使用工厂方法注册服务

Prism 默认的注册方法基本是：

```CS
containerRegistry.Register<IMyService, MyService>();
```

如果你希望通过工厂方法来创建服务实例（例如需要根据运行时逻辑创建对象），则可利用扩展 API 支持注册：

```CS
containerRegistry.RegisterInstance<IMyService>(() => new MyService(...));
```

> 实际 API 名称依据扩展包不同可能略有差异，但扩展包本质上提供了更灵活的注册方式。

##### 为一个实现类同时注册多个服务接口

假设你有一个实现类 `MyService` 同时实现了多个接口：

```CS
containerRegistry.Register<IMyService, MyService>();
containerRegistry.Register<IYourService, MyService>();
```

普通 Prism 注册时需要写两行代码，而扩展包往往允许你写成更简洁的一行，并且可以控制是否共享同一个实例，这对于一些复杂容器场景非常方便

### 自定义容器





## 对话服务

Prism 提供了一个 **跨平台的对话框服务抽象 (`IDialogService`)**，用于在应用程序中显示可自定义的对话框（Dialog）。这种服务遵循 MVVM 模式，可让你使用 Prism 的 DI、数据绑定和 ViewModel 生命周期管理特性。

对话框可用于展示消息、确认操作、输入表单等场景，并利用 Prism 的机制支持参数传递与结果回调。

#### 设计目标

Prism Dialog Service 的设计理念是：

- 使用你的自定义 View/XAML 作为对话框内容；
- 让显示、参数传递、事件回调都遵循 **MVVM 模式**；
- 与 Prism 的依赖注入机制无缝协作，使对话框 ViewModel 通过构造函数注入服务。

Prism 9.0 对 `IDialogService` 做了改进，重点是引入了 **DialogCallback** 类型，让调用者在对话框关闭时可以更灵活地处理回调逻辑（支持同步或异步处理）。

#### DialogCallback回调机制

在新版 Prism 中，为了增强对话结果的处理能力，引入了 `DialogCallback` 类：

**基本Close回调**

```CS
new DialogCallback()
    .OnClose(() => Console.WriteLine("The Dialog Closed"));

// 或获取对话框返回值：
new DialogCallback()
    .OnClose(result => Console.WriteLine($"Dialog result: {result.Result}"));
```

支持**异步回调**：

```CS
new DialogCallback()
    .OnCloseAsync(() => Task.CompletedTask);

// 也可以异步获取结果：
new DialogCallback()
    .OnCloseAsync(result => Task.CompletedTask);
```

#### 错误处理回调

可以为对话框回调配置错误处理逻辑，仅在执行过程中发生异常时触发：

##### 通常异常处理

```CS
new DialogCallback()
    .OnError(() => Console.WriteLine("Whoops... something bad happened!"));

// 或获取异常实例：
new DialogCallback()
    .OnError(exception => Console.WriteLine(exception));
```

##### 特定异常处理

```CS
new DialogCallback()
    .OnError<NullReferenceException>(nre =>
    {
        Console.WriteLine("NullReferenceException occurred.");
    });

// 并且可以结合对话结果一起处理：
new DialogCallback()
    .OnError<NullReferenceException>((nre, result) =>
    {
        Console.WriteLine($"Result: {result.Result}");
        Console.WriteLine(nre);
    });

// 对于错误处理同样支持异步版本方法：
new DialogCallback()
    .OnErrorAsync(exception => Task.CompletedTask);
```

#### 对话框服务核心流程

> 下述流程适用于大多数支持 `IDialogService` 的平台，例如 WPF，以及 Prism.Forms 时代的 Xamarin.Forms；MAUI 平台也提供类似机制或扩展插件支持。

##### 创建对话框View

对话框通常是一个单独的 View（WPF 的 UserControl 或 Xamarin.Forms/MAUI 的 ContentView），并由 ViewModel 管理。对话框 ViewModel 必须实现 `IDialogAware` 接口才能使用 DialogService：

```CS
public interface IDialogAware
{
    string Title { get; set; }
    event Action<IDialogResult> RequestClose;

    bool CanCloseDialog();
    void OnDialogOpened(IDialogParameters parameters);
    void OnDialogClosed();
}
```

##### 对话框ViewModel

对话框 ViewModel 在需要关闭时触发 `RequestClose` 事件，并传递 `IDialogResult` 以告知调用者对话框的按钮结果或参数：

```CS
public class NotificationDialogViewModel : IDialogAware
{
    public event Action<IDialogResult> RequestClose;
    
    public void CloseDialog(ButtonResult result)
        => RequestClose?.Invoke(new DialogResult(result));
}
```

##### 注册对话框

需要在 Prism 容器注册对话框及其 ViewModel：

```CS
containerRegistry.RegisterDialog<NotificationDialog, NotificationDialogViewModel>();
```

也可以提供**自定义名称**：

```CS
containerRegistry.RegisterDialog<NotificationDialog, NotificationDialogViewModel>("notifyDialog");
```

##### 调用对话框

在 ViewModel 中注入 `IDialogService` 并调用：

```CS
_dialogService.ShowDialog("notifyDialog", new DialogParameters($"message={message}"), callback);
```

`DialogParameters` 支持传入键值对，以参数形式传递给对话框 ViewModel。

#### 自定义对话框宿主窗口

在 WPF（或 Uno 平台）中，你可以定制对话框 **宿主窗口（Dialog Window）**：

- 定义一个继承自 Window 且实现 `IDialogWindow` 的窗口；
- 注册该窗口类型：

```CS
containerRegistry.RegisterDialogWindow<MyCustomDialogWindow>();
```

若有多个窗口，可使用名称注册并在调用时指定名称。

### Dialog-Aware

在 Prism 的对话框服务中，**对话框 ViewModel 必须实现接口 `IDialogAware`**。这是对话框生命周期管理和交互的基础，它让对话框服务知道何时关闭、何时打开以及它的标题等信息。

#### IDialogAware接口

`IDialogAware` 是对话框 ViewModel 必须实现的接口，它定义了以下成员：

```CS
public interface IDialogAware
{
    bool CanCloseDialog();
    void OnDialogClosed();
    void OnDialogOpened(IDialogParameters parameters);
    DialogCloseListener RequestClose { get; }
}
```

##### CanCloseDialog()

用于决定对话框是否可以被关闭。

- 在关闭对话框之前调用此方法。
- 如果返回 `false`，则对话框不会被关闭（Prism 不会执行关闭操作）。
- 常用于需要校验用户输入的场景，比如内容未填写完整时阻止关闭。

```CS
public bool CanCloseDialog()
{
    // 当 Name 为空时阻止关闭对话框
    return !string.IsNullOrEmpty(Name);
}
```

##### OnDialogOpened(IDialogParameters parameters)

当对话框打开时被调用，通常用于：

- 从参数中提取数据；
- 初始化 ViewModel 属性；
- 触发第一次显示逻辑。

```CS
public void OnDialogOpened(IDialogParameters parameters)
{
    var message = parameters.GetValue<string>("message");
    Message = message;
}
```

##### OnDialogClosed()

对话框关闭后执行的清理逻辑，常用于：

- 清除临时状态；
- 停止定时器/取消异步任务；
- 其他资源释放。

```CS
public void OnDialogClosed()
{
    // 清理逻辑
}
```

#### 对话框关闭通知

`RequestClose`属性

这是一个由对话框服务设置的监听器，你在 ViewModel 中使用该属性通知 Prism 关闭对话框。**不要自己为此属性赋值**，而应该调用 `.Invoke()` 触发关闭逻辑

```CS
public DialogCloseListener RequestClose { get; }
```

**调用方式：**

通过 `Invoke` 传递不同参数来关闭对话框并返回结果或参数：

```CS
// 0. 无参数关闭
RequestClose.Invoke();

// 1. 传递参数
RequestClose.Invoke(new DialogParameters { { "Key", value } });

// 2. 传递按钮结果
RequestClose.Invoke(ButtonResult.OK);

// 3. 传递参数和结果
RequestClose.Invoke(new DialogParameters { { "Key", value } }, ButtonResult.OK);

// 4. 使用完整结果对象
var result = new DialogResult
{
    Parameters = new DialogParameters { { "Key", value } },
    Result = ButtonResult.OK
};
RequestClose.Invoke(result);
```

> 这些调用都将触发对话框关闭，并将数据传回给触发对话框的调用者（例如通过 `IDialogService.ShowDialog`）

## 事件聚合器

事件聚合器是一种 **发布/订阅模式** 的实现，它允许应用中不同组件（例如 ViewModel、服务模块等）通过事件进行通信，而无需彼此引用，从而保持松耦合架构。

在 MVVM 和模块化应用中：

- 各组件可能需要互相发送消息（例如从 A 模块通知 B 执行某逻辑）；
- 但不希望模块间存在直接依赖；
- Event Aggregator 正是为这种跨模块消息设计的中介。

Prism 提供了强类型、可订阅/发布的机制：

- **发布者（Publisher）** 发布事件；
- **订阅者（Subscriber）** 注册事件回调；
- **没有引用依赖**，只依赖事件类型。

#### `IEventAggregator`

这是事件聚合器的服务接口，通常通过依赖注入获取。它负责：

- 管理事件的生命周期；
- 找到或创建事件实例。

```CS
public class SomeViewModel
{
    private readonly IEventAggregator _eventAggregator;

    public SomeViewModel(IEventAggregator eventAggregator)
    {
        _eventAggregator = eventAggregator;
    }
}
```

获取事件：

```CS
var myEvent = _eventAggregator.GetEvent<MyCustomEvent>();
```

Prism 会在第一次访问时创建事件对象，无需手动初始化。

#### `PubSubEvent<TPayload>`

这是 Prism 提供的事件基类，用于表示某种带负载（payload）的事件：

- `TPayload` 是事件数据的类型；
- 多个发布者可以发布同一个事件；
- 多个订阅者可以响应。

```CS
public class TickerSymbolSelectedEvent : PubSubEvent<string> { }
```

#### 发布事件

```CS
_eventAggregator.GetEvent<TickerSymbolSelectedEvent>().Publish("STOCK0");
```

- `GetEvent` 获取事件实例；
- `Publish` 触发事件，并将 payload 传递给所有订阅者。

#### 订阅事件

订阅者使用事件实例的 `Subscribe` 方法注册回调：

```CS
_eventAggregator.GetEvent<TickerSymbolSelectedEvent>()
                .Subscribe(OnTickerSelected);
```

其中 `OnTickerSelected(string symbol)` 是回调方法

**订阅时可以指定线程调度：**

- **`PublisherThread`**：在发布者线程上回调（默认行为）；
- **`UIThread`**：确保回调在 UI 线程执行（适用于更新 UI）；
- **`BackgroundThread`**：在线程池线程异步接收事件。

```CS
// 在UI线程调度
eventAggregator.GetEvent<TickerSymbolSelectedEvent>()
               .Subscribe(OnTickerSelected, ThreadOption.UIThread);
```

#### 过滤订阅

若仅想处理特定 payload，可使用过滤条件：

```CS
eventAggregator.GetEvent<TickerSymbolSelectedEvent>()
               .Subscribe(OnTickerSelected,
                          ThreadOption.UIThread,
                          filter: symbol => symbol == "STOCK0");
```

只有满足过滤条件的事件才会回调。

#### 引用方式

默认情况下 Prism 使用 **弱引用** 保存订阅者方法：

- 如果订阅者对象没有其他引用，则垃圾回收可以释放它；
- 订阅者自动取消订阅，减少内存泄漏风险。

若需要保持强引用以提高性能（例如大量事件频繁发布）或确保对象长时间订阅，则设置:

```CS
tickerEvent.Subscribe(OnTickerSelected, ThreadOption.UIThread, keepSubscriberReferenceAlive: true);
```

此时订阅者必须 **手动取消订阅**，否则可能导致对象不会释放

#### 取消订阅

Prism 支持两种取消方式：

1. 使用方法引用取消：

   ```CS
   tickerEvent.Unsubscribe(OnTickerSelected);
   ```

2. 使用订阅令牌取消：

   ```CS
   var token = tickerEvent.Subscribe(OnTickerSelected);
   tickerEvent.Unsubscribe(token);
   ```

   订阅令牌对使用匿名方法或 lambda 时尤为有用

## MVVM

### BindableBase

ViewModel 通常需要让 View 层对属性的改变做出响应。为了实现这一点，需要实现 `INotifyPropertyChanged` 接口。Prism 为此提供了一个基类 **`BindableBase`**，它封装了常见的实现细节并简化了开发流程。

> 虽然 Prism 推荐使用 `BindableBase`，但你不**必须**使用它；你也可以选择其他实现（例如 .NET 自身实现、CommunityToolkit 的 MVVM 功能等）

#### 为什么需要BindableBase

在 MVVM 中，ViewModel 的属性通常绑定到 View 上：

```XAML
<TextBlock Text="{Binding Message}" />
```

要确保当 ViewModel 中的 `Message` 改变时 View 层自动刷新，就必须通知 UI 属性已更改。这就是 `INotifyPropertyChanged` 的用途。

手写实现 `INotifyPropertyChanged` 是重复且容易出错的。Prism 的 `BindableBase`：

- 实现了 `INotifyPropertyChanged`；
- 提供了简化属性 setter 的辅助方法；
- 自动处理多次设置相同值时避免不必要的事件触发。

#### 可通知的属性

##### 创建方式

要使用 `BindableBase`，你可以按如下方式定义 ViewModel：

```CS
public class ViewAViewModel : BindableBase
{
    private string _message;
    public string Message
    {
        get => _message;
        set => SetProperty(ref _message, value);
    }
}
```

- `SetProperty` 会比较旧值与新值；
- 如果相同则不触发事件；
- 如果不同，它会设置值并引发 `PropertyChanged`。

##### 为什么是`SetProperty`而不是手动触发

你当然可以自己写：

```CS
_message = value;
RaisePropertyChanged();
```

但这种写法的问题包括：

- 每次设置相同值时都会触发 UI 更新；
- 代码较冗长、易出错；
- 需要手动传入属性名或依赖 CallerMemberName。

`SetProperty` 自动处理：

- 值对比；
- 事件触发；
- 属性名称推断（基于 CallerMemberName）。

#### 属性变更时执行额外逻辑

有时候你不只需要通知 UI，还希望在属性变更时执行某段逻辑。`SetProperty` 支持传入一个回调：

```CS
private bool _isActive;
public bool IsActive
{
    get => _isActive;
    set => SetProperty(ref _isActive, value, () =>
    {
        if (value)
            OnIsActive();
        else
            OnIsNotActive();
    });
}

protected virtual void OnIsActive() { }
protected virtual void OnIsNotActive() { }
```

这种写法让你在属性变更时执行额外操作，而不必重复写 `RaisePropertyChanged`。

### ViewModel定位器

在 Prism 的 MVVM 模式中，**视图（View）与其视图模型（ViewModel）之间的绑定是自动完成的**，而无需在代码里手动设置 DataContext。Prism 通过一个叫做 **ViewModel Locator** 的机制实现这点，使得开发更简洁、符合 MVVM 约定。

#### 自动绑定机制

`ViewModelLocator` 是 Prism 的一个组件，它通过 **附加属性与约定** 自动将 View 与对应的 ViewModel 实例关联起来。

核心是 Prism 的附加属性：

```XAML
prism:ViewModelLocator.AutoWireViewModel="True"
```

当这个属性设置为 `True` 时：

1. Prism 会调用内部的 `ViewModelLocationProvider` 逻辑；
2. 根据 **约定规则** 或 **自定义映射** 来定位 ViewModel；
3. 使用 Prism 的 DI 容器创建 ViewModel 实例；
4. 将该实例设置为 View 的 DataContext。

默认行为是开启自动绑定（AutoWireViewModel）

#### 默认约定规则

Prism 默认通过一个 **命名约定** 来推断 ViewModel 类型：

在没有显式注册映射的情况下：

- **ViewModel 与 View 必须位于同一程序集**；
- View 位于 `*.Views` 命名空间；
- ViewModel 位于 `*.ViewModels` 命名空间；
- ViewModel 名称必须是 View 名称加上 `ViewModel` 后缀。

**举例：**

| 视图类型               | 预期的 ViewModel 类型                |
| ---------------------- | ------------------------------------ |
| `MyApp.Views.MainPage` | `MyApp.ViewModels.MainPageViewModel` |

#### 自定义ViewModel映射

如果不遵循默认约定，或者 ViewModel 名称/命名空间不同，可以用`ViewModelLocationProvider.Register` **显式映射**

**通过类型映射注册：**

```CS
ViewModelLocationProvider.Register(typeof(MainWindow).ToString(), typeof(CustomViewModel));
```

**泛型方式：**

```CS
ViewModelLocationProvider.Register<MainWindow, CustomViewModel>();
```

##### 使用工厂创建ViewModel：

如果你想手动控制如何创建 ViewModel 实例，也可以注册工厂：

```CS
ViewModelLocationProvider.Register(typeof(MainWindow).ToString(),
    () => Container.Resolve<CustomViewModel>());
```

#### 自定义默认命名规范

如果你希望使用不同于默认约定的规则来推断 ViewModel 类型，可以 **覆盖 Prism 默认的规则**：

在 `App.xaml.cs` 中重写 `ConfigureViewModelLocator`：

```CS
protected override void ConfigureViewModelLocator()
{
    base.ConfigureViewModelLocator();

    ViewModelLocationProvider.SetDefaultViewTypeToViewModelTypeResolver((viewType) =>
    {
        // 自定义规则：根据 viewType 计算 viewModel 类型
        var viewName = viewType.FullName.Replace(".Views.", ".CustomVMs.");
        var viewModelName = $"{viewName}VM, {viewType.GetTypeInfo().Assembly.FullName}";
        return Type.GetType(viewModelName);
    });
}
```

#### 自定义ViewModel创建方法

默认情况下，当定位到 ViewModel 类型后，Prism 会使用 **DI 容器** 去解析该 ViewModel 的实例。如果你想自定义实例化逻辑，例如使用另一个容器或初始化参数，可以修改默认工厂：

```CS
ViewModelLocationProvider.SetDefaultViewModelFactory((viewModelType) =>
{
    return MyCustomContainer.Resolve(viewModelType);
});
```

或者基于 View 的类型做更复杂处理：

```CS
ViewModelLocationProvider.SetDefaultViewModelFactory((view, viewModelType) =>
{
    if (view is SomeSpecialView)
        return MyCustomResolver.ResolveSpecial(viewModelType);
    return Container.Resolve(viewModelType);
});
```

## 模块化

模块化是一种将大型应用拆分成多个独立功能单元（模块）的设计思路。每个模块都可以单独开发、测试、部署，同时被动态集成到主应用中。Prism 的模块化支持这种架构，并提供模块的生命周期管理、动态加载、依赖排序等能力。

一个 **模块（Module）** 是能够封装某一功能区域或服务逻辑的最小单元，它通常包含：

- 相关的视图（Views）、视图模型（ViewModels）；
- 必要的服务、业务逻辑；
- 初始化与注册逻辑。

模块化架构优点包括：

- **独立开发与测试**：团队可将不同功能划分给不同开发者；
- **简化维护**：模块边界清晰，便于定位问题；
- **可扩展/可插拔**：支持按需加载、后台加载和插件式部署。

### 模块实现：`IModule`

在 Prism 中，每个模块都由一个实现了 `IModule` 接口的类表示。该接口定义了两个生命周期方法：

```CS
public interface IModule
{
    void RegisterTypes(IContainerRegistry containerRegistry);
    void OnInitialized(IContainerProvider containerProvider);
}
```

- **`RegisterTypes`**：在模块加载前调用，用于在 DI 容器中注册模块内部服务、类型或功能接口。
- **`OnInitialized`**：在所有类型注册完毕之后调用，可在此做视图注册、导航注册或其它初始化逻辑。

**示例：**

```CS
public class MyModule : IModule
{
    public void RegisterTypes(IContainerRegistry containerRegistry)
    {
        containerRegistry.Register<ISomeService, SomeService>();
    }

    public void OnInitialized(IContainerProvider containerProvider)
    {
        var regionManager = containerProvider.Resolve<IRegionManager>();
        regionManager.RegisterViewWithRegion("MainRegion", typeof(MyView));
    }
}
```

### 模块加载生命周期

Prism 模块加载分为四个阶段：

1. **发现模块（Discovery）**
    分析模块目录或 Catalog 定义文件以查找可用模块信息。
2. **加载模块程序集（Loading）**
    将包含模块的程序集加载到应用程序进程中。
3. **创建模块实例（Instantiation）**
    通过 Prism DI 容器创建模块类实例。
4. **执行模块逻辑（Initialization）**
    依次执行 `RegisterTypes` 和 `OnInitialized` 方法。

### 模块目录

**模块目录（Module Catalog）** 用于描述哪些模块可用、加载顺序、依赖关系等信息。它包含多个 **ModuleInfo** 项，每个项描述一个模块。

#### 代码注册

在 `PrismApplication` 中重写 `ConfigureModuleCatalog`：

```CS
protected override void ConfigureModuleCatalog()
{
    ModuleCatalog.AddModule(new ModuleInfo
    {
        ModuleName = "OrdersModule",
        ModuleType = typeof(OrdersModule).AssemblyQualifiedName
    });
}
```

> （可指定初始化模式、依赖等）

#### XAML注册

在 XAML 文件中声明模块：

```XAML
<Modularity:ModuleCatalog xmlns:Modularity="clr-namespace:Prism.Modularity;assembly=Prism.Core">
    <Modularity:ModuleInfo ModuleName="CustomerModule"
                             ModuleType="MyApp.Modules.Customer.CustomerModule, MyApp.Modules.Customer" />
</Modularity:ModuleCatalog>
```

> （通过 `CreateFromXaml()` 方法加载）

#### 配置文件注册

在 `App.config / Web.config` 中定义模块列表和依赖关系，然后在 `CreateModuleCatalog` 中返回 `ConfigurationModuleCatalog`。

#### 目录扫描注册

通过 `DirectoryModuleCatalog` 指定某个目录路径，Prism 会扫描该目录下所有程序集并自动寻找模块实现类。

### 模块加载控制

模块的加载时机可以通过初始化模式控制：

- WhenAvailable（默认）：应用启动时自动加载

- OnDemand（按需加载）：直到程序明确调用才加载

  ```CS
  ModuleCatalog.AddModule(new ModuleInfo
  {
      ModuleName = "SalesModule",
      ModuleType = typeof(SalesModule).AssemblyQualifiedName,
      InitializationMode = InitializationMode.OnDemand
  });
  ```

  > （主程序可在需要时调用 `IModuleManager.LoadModule("SalesModule")`）

### 模块间依赖

Prism 允许声明模块依赖关系，以保证加载顺序和初始化顺序。你可以使用属性：

```CS
[Module(ModuleName = "ModuleA")]
[ModuleDependency("ModuleD")]
public class ModuleA : IModule { … }
```

（表示 ModuleA 依赖于 ModuleD， Prism 会在 ModuleD 初始化后再初始化 ModuleA）

这种依赖机制确保了不同模块按照正确逻辑顺序载入。

### 动态按需加载模块

- **显式请求加载**

  使用 `IModuleManager` 进行按需加载：

  ```CS
  moduleManager.LoadModule("ModuleName");
  ```

  （当出现特定业务需求时再加载模块）

- **加载完成事件监听**

  ```CS
  moduleManager.LoadModuleCompleted += (s, e) =>
  {
      // 处理加载结果或错误
  };
  ```

  （可获取错误状态、日志等信息）

## 导航

### 导航参数

Prism 的导航服务支持通过 **参数对象** 在页面之间传递数据。无论是基于 Region 导航还是基于 `INavigationService` 的页面导航，都可以使用导航参数机制统一处理。

导航参数由 **`INavigationParameters` / `NavigationParameters`** 表示，它是一个键值对集合，类似于字典，但更适用于导航场景。

#### 创建导航参数

##### 使用NavigationParameters对象

这是最常见且明确的方式。你创建一个 `NavigationParameters` 实例，然后通过 `Add` 添加键值对：

```CS
var parameters = new NavigationParameters();
parameters.Add("ID", 123);
parameters.Add("User", new User { Name = "Gemini" });

// 发起导航
_regionManager.RequestNavigate("ContentRegion", "UserDetailsView", parameters);
```

##### 使用查询字符串

可以在 URI 字符串中嵌入参数：

```CS
// 直接拼接在路径后面
_regionManager.RequestNavigate("ContentRegion", "UserDetailsView?ID=123&Mode=Edit");
```

Prism 会解析这些参数并构建内部的 `NavigationParameters`。

##### 混合使用参数对象和查询字符串

既可以在 URI 中定义一些参数，又通过 `NavigationParameters` 对象传入其他参数：

```CS
var parameters = new NavigationParameters { { "extra", extraData } };

_navigationService.NavigateAsync("DetailPage?id=42", parameters);
```

Prism 会将两者合并传递。

#### 访问导航参数

##### `GetValue<T>`

若要从导航参数中访问单个值，应使用如下 `GetValue` 方法：

```CS
Title = parameters.GetValue<string>("Title");
```

##### `TryGetValue<T>`

若要仅在键存在时访问值，可以使用如下 `TryGetValue` 方法：

```CS
if (parameters.TryGetValue<string>("Title", out var title))
{
    Title = title;
}
```

##### `GetValues<T>`

若要访问多个值，可以使用该 `GetValues` 方法。如果未提供任何值，这将返回一个空列表。

```CS
var colors = parameters.GetValues<Color>("SelectedColors");
```

#### 在目标ViewModel中接收参数

要获取导航参数，你的 ViewModel 可以实现接口：

- `INavigationAware`
   定义方法 `OnNavigatedTo(INavigationParameters parameters)`，当导航进入此 ViewModel 时调用。
- `IInitialize` / `IInitializeAsync`
   Prism 还支持在导航之前进行初始化处理并传递参数。

```CS
public class UserDetailsViewModel : BindableBase, INavigationAware
{
    public void OnNavigatedTo(NavigationContext navigationContext)
    {
        // 1. 从 Parameters 字典中获取 (支持强类型获取)
        if (navigationContext.Parameters.ContainsKey("ID"))
        {
            var id = navigationContext.Parameters.GetValue<int>("ID");
        }

        // 2. 获取复杂对象
        var user = navigationContext.Parameters.GetValue<User>("User");
    }

    public bool IsNavigationTarget(NavigationContext navigationContext) => true;
    public void OnNavigatedFrom(NavigationContext navigationContext) { }
}
```

#### 支持的参数类型

Prism 的导航参数值不局限于基本类型。你可以传递：

- 字符串、数值等基础类型；
- 自定义对象（如业务模型）；
- 数组或集合类型。

因为 `NavigationParameters` 实现了类似 `IEnumerable<KeyValuePair<string, object>>` 的结构，并且可以在内部将多个值绑定到同一键名。

#### 在不同生命周期钩子中读取参数

##### 在`OnNavigateTo`中读取

这是最主要的读取位置，当导航完成后会触发:

```CS
public void OnNavigatedTo(INavigationParameters parameters)
{
    var id = parameters.GetValue<int>("id");
}
```

##### 在`IInitialize`/`IInitializeAsync`中读取

如果你的 ViewModel 要在导航完成前初始化数据，特别是需要异步工作：

```CS
public void Initialize(INavigationParameters parameters) { … }
// 或
public Task InitializeAsync(INavigationParameters parameters) { … }
```

这两种方式适合于对读到的参数执行逻辑初始化（如异步加载 API 数据）**并影响导航结果**。

#### 获取原始NavigationContext

在基于 Region 的导航中，你可以访问 `NavigationContext`（如 `OnNavigatedFrom`, `IsNavigationTarget` 等回调参数中），从其 `NavigationParameters` 属性读取数据

```CS
public void OnNavigatedTo(NavigationContext context)
{
    var id = context.Parameters["id"];
}
```

这种方式更底层，适合需要同时访问 URI 和参数的场景

### 区域导航

在 Prism 中，“区域（Region）”是一个 **逻辑占位符**，你可以在 UI 布局中定义它，然后将多个视图动态地注入到这些区域中，从而实现应用的视图切换与导航。区域导航抽象了 UI 的组织方式，使得：

- 视图内容可以根据用户操作或业务状态动态变化；
- 各模块可以 **松耦合地** 将自己的视图插入到主界面不同位置；
- UI 结构与导航逻辑解耦，符合 MVVM 和模块化架构。

#### 区域

##### 声明区域

要声明一个区域，你只需在 XAML 控件上设置一个附加属性：

```XAML
<ContentControl prism:RegionManager.RegionName="MainRegion" />
```

这表示该 `ContentControl` 成为一个名为 `"MainRegion"` 的 Prism 区域。之后你就可以通过 Prism 管理器向这个区域导航或注入视图

> 在 Prism 9.0 以后，相关 Region API 移动到了 Prism.Navigation.Regions 命名空间（例如 `using Prism.Navigation.Regions;`）。这不同于旧版 Prism 的 `Prism.Regions`。

##### 区域与RegionManager

Prism 提供了一个中央服务 **`IRegionManager`** 负责管理所有定义的区域：

- 注册区域；
- 注册视图与区域的关系；
- 执行区域导航。

你可以通过 DI 注入 RegionManager 实例到 ViewModel、服务或模块初始化类。

##### 向区域显示Views

###### View注入

向区域手动注入一个 View 实例：

```CS
var region = regionManager.Regions["MainRegion"];
var view = container.Resolve<SomeView>();
region.Add(view);
```

该方式称为 **视图注入（View Injection）**，允许你手动完全控制实例创建与添加逻辑。

###### 视图发现

用 RegionManager 注册 View 与区域名称：

```CS
regionManager.RegisterViewWithRegion("MainRegion", typeof(SomeView));
```

当区域首次显示时 Prism 会自行创建该 View 并加入区域。这称为 **视图发现（View Discovery）**，适用于静态内容。

##### 区域导航

在 Prism 中导航是指通过 **URI** 控制区域内视图的切换。Prism 的区域导航支持：

- **视图切换**：将指定的 View 导航到区域；
- **伪异步**：导航过程可能允许确认或取消等逻辑。

###### 执行导航

可以调用 RegionManager 的 RequestNavigate 方法：

```CS
regionManager.RequestNavigate("MainRegion", "InboxView");
```

或者：

```CS
regionManager.RequestNavigate("MainRegion", new Uri("InboxView", UriKind.Relative));
```

Prism 会：

1. 在容器中解析指定 View；
2. 创建 View 和其 ViewModel；
3. 注入到区域对应位置；
4. 激活该 View。

###### 导航回调

RequestNavigate 允许你附加回调函数以处理导航结束：

```CS
regionManager.RequestNavigate("MainRegion", "InboxView", result =>
{
    if (result.Result == true) { /* 成功 */ }
});
```

通过 `NavigationResult` 你可以判断成功/失败并读取错误等信息。

##### Region Navigation的生命周期参与

为了让 View/ViewModel 能参与或响应导航，Prism 定义了若干接口：

###### `INavigationAware`

- `IsNavigationTarget`: 表示当前 View 是否可以复用；
- `OnNavigatedFrom`: 导航离开时调用；
- `OnNavigatedTo`: 导航到该 View 时调用。

###### ViewModel与View的参与

Prism 会先检查 View 是否实现该接口；如果没有，再检查 View 的 DataContext。这样你的 ViewModel 也能参与导航事件。

##### 多视图、活动状态与生命周期

区域可以容纳多个 View 实例（例如 TabControl）：

- **Active Views**：表示当前显示的视图；
- **非 Active Views**：当前未显示但仍存在于区域中。

如果你希望在导航后让旧视图被移除而非只是 deactivate，可以通过 `IRegionMemberLifetime` 接口控制：

```CS
// 这让 Prism 在导航后清理该 View。
public bool KeepAlive => false;
```

##### 导航历史

区域导航有类似浏览器的历史记录：

- `GoBack`、`GoForward` 等方法；
- `CanGoBack`、`CanGoForward` 属性；
- 当前记录也可访问用于自定义操作。

#### 基本区域导航

##### 发起区域导航

导航是在 **IRegion 或 IRegionManager** 之上进行调用的，有两个主要入口：

###### Region实例上的导航

```CS
IRegion mainRegion = …;
mainRegion.RequestNavigate(new Uri("InboxView", UriKind.Relative));
// 或者更简洁的写法
mainRegion.RequestNavigate("InboxView");
```

这里 `"InboxView"` 就是要加载的视图名称（它应该已注册到容器中）。

###### RegionMapper上的导航

更常用的是通过 RegionManager：

```CS
// 1. 注入 IRegionManager
public class MainWindowViewModel
{
    private readonly IRegionManager _regionManager;

    public MainWindowViewModel(IRegionManager regionManager)
    {
        _regionManager = regionManager;
    }

    private void Navigate()
    {
        // 2. 调用导航：参数1是 Region 名，参数2是 View 的注册名
        _regionManager.RequestNavigate("ContentRegion", "ViewA");
    }
}
```

##### 导航URI定义视图

默认情况下，URI 指向的是要创建视图的注册名称。也就是说 Prism 会在容器中查找这一名称对应的视图类型并创建它。其对应的 ViewModel 若使用 ViewModelLocator 机制会自动注入。

Prism 同时支持 **视图优先（View-First）** 和 **视图模型优先（ViewModel-First）** 导航：

- *View-First*：URI 指向视图名称，容器先创建视图和相关 ViewModel；
- *ViewModel-First*：URI 指向 ViewModel 名称，如果你将 View 与 ViewModel 的映射注册到容器，则 Prism 会先创建 ViewModel，并通过数据模板绑定 View。

##### 导航完成回调

你可以在调用 RequestNavigate 时指定一个 **回调委托**，用于接收导航完成的结果：

```CS
regionManager.RequestNavigate("MainRegion", "InboxView", NavigationCompleted);

private void NavigationCompleted(NavigationResult result)
{
    if (result.Result)
    {
        // 导航成功
    }
    else
    {
        // 导航失败，可从 result.Error 获取异常信息
    }
}
```

`NavigationResult` 提供以下关键信息：

- **Result**：是否成功；
- **Error**：失败时的异常信息；
- **Context**：包含导航 URI 和参数；
- **NavigationService**：执行导航的服务实例。

##### 导航工作流

当你调用 `RequestNavigate` 时，Prism 后台会执行以下步骤：

1. **查找区域**：在 `RegionManager` 中寻找名为 "ContentRegion" 的区域。
2. **解析视图**：从容器中获取 "ViewA" 的实例。
3. **解析 ViewModel**：如果开启了 `ViewModelLocator`，自动创建对应的 ViewModel 并绑定到 View 的 `DataContext`。
4. **添加到区域**：将 View 添加到 Region 的视图集合中。
5. **激活视图**：调用 Region 的 `Activate` 方法将 View 显示出来（此时旧视图会被 `Deactivate`）。

##### 导航日志

这是 Prism 9.0 非常强大的功能。每个 Region 都拥有一个 **Journal (日志)**，类似于浏览器的前进/后退历史记录。

**如何获取**：通过 `NavigationContext` 获取 `IRegionNavigationJournal`。

**常用操作**：

- `journal.GoBack()`: 返回上一个页面。
- `journal.GoForward()`: 前进到下一个页面。
- `journal.CanGoBack`: 判断是否可以回退。

```CS
// 在 ViewModel 中实现 INavigationAware 后，可以拿到上下文
public void OnNavigatedTo(NavigationContext navigationContext)
{
    _journal = navigationContext.NavigationService.Journal;
}

private void GoBack()
{
    if (_journal.CanGoBack) _journal.GoBack();
}
```

##### 视图的重用

默认情况下，当你多次请求导航到 "ViewA" 时，Prism 会检查当前的 View 是否可以重用。

- 这是通过实现 `INavigationAware.IsNavigationTarget` 来控制的。
- 如果返回 `true`：Prism 会重用已存在的 View 实例，只调用它的 `OnNavigatedTo`。
- 如果返回 `false`：Prism 会销毁旧的，重新创建一个全新的 View 实例。

##### 区域导航与视图发现/视图注入的关系

在旧 Prism 模式中：

- **视图注入（View Injection）**：你通过 RegionManager 直接注入视图实例；
- **视图发现（View Discovery）**：自动在首次显示区域时向区域注入注册视图。

Prism 现在把这些都归纳为区域导航的基础概念，并在此基础上扩展了更通用、URI 驱动的导航 API，使导航更统一、可扩展。

##### “伪异步”导航

Prism 的 `INavigateAsync` 接口包含 `RequestNavigate` 方法：

```CS
interface INavigateAsync
{
    void RequestNavigate(...);
}
```

它可能表现得像**异步导航**（调用后导航可能仍在处理，因为可能触发用户确认等逻辑），但它不表示真正的后台线程异步行为，而是支持异步交互逻辑，例如允许导航确认。

这使得你可以使用回调继续导航流程，而无需自己实现异步机制。

#### 视图与视图模型参与导航

##### `INavigationAware`：参与导航生命周期

最核心的接口是 **`INavigationAware`**。任意视图或其 ViewModel 实现此接口，就能在导航时参与下面的过程（Prism 会自动检测）：

- 视图自身是否实现了 `INavigationAware`；
- 否则检查视图的 DataContext（通常是 ViewModel）是否实现。

```CS
public interface INavigationAware
{
    bool IsNavigationTarget(NavigationContext navigationContext);
    void OnNavigatedTo(NavigationContext navigationContext);
    void OnNavigatedFrom(NavigationContext navigationContext);
}
```

###### `IsNavigationTarget`(确定目标重用)

当导航请求发生时，Prism 会询问当前 Region 中已有的视图：“你能处理这个请求吗？”

- **返回 `true`**：重用当前实例（只触发 `OnNavigatedTo`）。
- **返回 `false`**：Prism 会创建一个该视图的新实例。
- **典型用途**：如果你正在查看用户 ID 为 1 的页面，新的导航请求也是 ID 为 1，则重用；如果新请求是 ID 为 2，则可能需要返回 `false` 来创建新页面（取决于你的业务逻辑）。

###### `OnNavigatedTo`（导航到达）

在导航离开当前视图之前调用。可以用于：

- 保存 UI 或业务状态；
- 取消未完成操作；
- 在导航前执行清理。

例如保存用户输入未提交的数据。

###### `OnNavigatedFrom`（导航离开）

当导航完成并且当前视图变为活动视图后调用。用于：

- 接收导航参数；
- 初始化视图或加载数据；
- 根据导航上下文调整状态。

##### 参与者优先级

当导航发生时，Prism 会按以下顺序查找并调用接口方法：

1. **视图 (View)**：首先检查 View 是否实现了 `INavigationAware`。
2. **视图模型 (ViewModel)**：接着检查 View 的 `DataContext`（即 ViewModel）是否实现了该接口。

如果两者都实现了，**两者的方法都会被调用**。这允许你在 View 中处理 UI 相关的逻辑（如聚焦），同时在 ViewModel 中处理业务逻辑。

##### `IConfirmNavigationRequest`接口

有时候，你不希望用户直接离开（例如：表单还没填完）。这时需要实现 `IConfirmNavigationRequest`，它继承自 `INavigationAware`。

- **新增方法**：`ConfirmNavigationRequest(navigationContext, continuationCallback)`。
- **工作原理**：
  1. Prism 会暂停导航。
  2. 你可以弹出一个对话框询问用户：“确定离开吗？”
  3. 根据用户的选择，调用 `continuationCallback(true)` 允许导航，或调用 `continuationCallback(false)` **拦截并取消**导航。

##### 方法执行顺序

当从 `ViewA` 导航到 `ViewB` 时，执行链如下：

1. **ViewA / VMA**: 调用 `ConfirmNavigationRequest` (如果实现了)。
2. **ViewA / VMA**: 调用 `OnNavigatedFrom`。
3. **ViewB / VMB**: 调用 `IsNavigationTarget` (确定是否重用旧的 ViewB)。
4. **ViewB / VMB**: 调用 `OnNavigatedTo`。

##### 控制视图生命周期

接口 **`IRegionMemberLifetime`**，用于控制导航后视图是否保留在区域内：

```CS
public class EmployeeDetailsViewModel : IRegionMemberLifetime
{
    public bool KeepAlive => false;
}
```

当 `KeepAlive == false` 时，视图将从区域中完全移除，而不是简单 deactivate，这有助于释放资源。

#### 导航到已有视图

在很多 UI 场景下，当你导航到某个视图时，**并不总是希望创建该视图的新实例**。例如：

1. 相同类型视图但内容不同
   用户当前正在编辑客户 ID 123 的详情页，如果他要编辑客户 ID 456，你可以重用同一个视图实例，更新数据并展示。
2. 多个实例存在于 UI 中
   应用允许同时打开多个编辑窗口／Tab，例如同时显示客户 123 和客户 456 的详情页，在这种情况下针对不同数据应显示已有实例。

Prism 的导航机制支持这类情景，让你能够 **判断是否复用已有视图或创建新实例**，从而提高性能和用户体验，同时避免重复创建相同视图。

##### `IsNavigationTarget`方法

Prism 使用 **`INavigationAware` 接口中的 `IsNavigationTarget` 方法** 来决定 “导航目标是否可以复用现有视图”。

```CS
public interface INavigationAware
{
    bool IsNavigationTarget(NavigationContext navigationContext);
    void OnNavigatedTo(NavigationContext navigationContext);
    void OnNavigatedFrom(NavigationContext navigationContext);
}
```

- 当发起导航时，Prism 会检查区域中已有与目标视图类型匹配的所有实例。
- 对每个匹配的实例调用 `IsNavigationTarget`。
- 如果某个视图返回 `true`，Prism 将 **复用该实例**，并不会创建新视图。
- 如果所有实例都返回 `false`（或者没有已有实例），Prism 会创建新的视图实例。

##### 默认匹配行为

Prism 默认认为 **导航 URI 中的资源名称即是视图的类型名**。

```CS
regionManager.RequestNavigate("MainRegion", "EmployeeDetailsView");
```

Prism 会假设这代表了类型名为 `EmployeeDetailsView` 的视图类别，并用这个名称去查找现有视图实例。
 视图类名与导航 URI 名必须一致，否则 Prism 无法正确调用 `IsNavigationTarget`

##### 在`IsNavigationTarget`中判断复用逻辑

可以基于导航参数判断实例是否适合作为导航目标。例如有一个客户详情页，当视图当前显示的是同一个客户时可以复用，否则新建视图：

```CS
public class EmployeeDetailsViewModel : BindableBase, INavigationAware
{
    public bool IsNavigationTarget(NavigationContext navigationContext)
    {
        string id = navigationContext.Parameters["ID"];
        return _currentCustomer.Id.Equals(id);
    }

    public void OnNavigatedTo(NavigationContext navigationContext) { … }
    public void OnNavigatedFrom(NavigationContext navigationContext) { … }
}
```

在这个例子中：

- 如果当前实例的客户 ID 与导航参数中的 ID 相同，返回 `true` → Prism 会复用该视图。
- 否则 Prism 会创建新的视图实例。

##### 若总是复用视图

如果你希望在该区域中始终只保留一个视图（即不管参数不同都复用同一个实例），可以让 `IsNavigationTarget` **无条件返回 true**：

```CS
public bool IsNavigationTarget(NavigationContext navigationContext) => true;
```

这种写法会确保每次导航都定位到存在的视图，而不是实例化更多视图。

#### 传递参数

在实际应用中，导航到新视图时往往不仅需要指定目标名称，还需要传递数据给目标视图/视图模型。例如，从列表页面传递当前选中项的 ID 给详情页或传递复杂对象等。

`NavigationParameters` 是 Prism 提供的一个参数容器，它本质类似于一组 **键值对（key-value pairs）**，用于在导航过程中携带数据。Prism 会自动将它与导航上下文 `NavigationContext` 关联，使目标视图/视图模型可以在导航完成后读取这些参数。

##### 创建并传递参数

###### 使用NavigationParameters实例传参

这是最常见的做法：先构造一个 `NavigationParameters` 对象，然后通过 `RequestNavigate` 的重载将它作为参数传入：

```CS
var parameters = new NavigationParameters();
parameters.Add("ID", employee.Id);
parameters.Add("myObjectParam", someObject);

regionManager.RequestNavigate("MainRegion", "EmployeeDetailsView", parameters);
```

- `ID` 是一个基础类型参数；
- `myObjectParam` 是任意对象参数；

Prism 会在导航过程将其携带给目标视图/视图模型。

###### 拼接到URI字符串中传参

Prism 允许你把参数以查询字符串形式拼接到导航 URI 中：

```CS
var uri = "EmployeeDetailsView?id=42&name=John";
regionManager.RequestNavigate("MainRegion", uri);
```

Prism 会自动解析 URL 查询部分为参数，并且也支持把 `NavigationParameters.ToString()` 追加到 URI：

```CS
var p = new NavigationParameters { { "ID", 42 } };
regionManager.RequestNavigate("MainRegion", $"EmployeeDetailsView{p.ToString()}");
```

这种方式适用于简单字符串/数值参数场景。

##### 在目标ViewModel中接收参数

Prism 在导航完成后会触发相关视图或视图模型的导航回调，例如 `OnNavigatedTo`、`OnNavigatedFrom`，并将参数通过 `NavigationContext.Parameters` 传递。

###### 强类型获取的便捷方法

Prism 为 `NavigationParameters` 提供了一系列好用的扩展方法：

| **方法**                             | **说明**                                                   |
| ------------------------------------ | ---------------------------------------------------------- |
| **`GetValue<T>(key)`**               | 直接获取指定类型的参数，如果类型不匹配或不存在可能抛异常。 |
| **`TryGetValue<T>(key, out value)`** | 安全获取，返回布尔值表示是否成功。                         |
| **`GetValues<T>(key)`**              | 如果参数中有多个同名的键，获取它们的集合（IEnumerable）。  |

###### 在`OnNavigatedTo`中读取

当目标视图/视图模型实现了 `INavigationAware` 接口，你可以在 `OnNavigatedTo` 里通过参数访问：

```CS
public void OnNavigatedTo(NavigationContext navigationContext)
{
    var id = navigationContext.Parameters["ID"];
    var objParam = navigationContext.Parameters["myObjectParam"];
}
```

或者使用类型安全的`GetValue<T>`方法：

```CS
public void OnNavigatedTo(NavigationContext navigationContext)
{
    var id = navigationContext.Parameters.GetValue<int>("ID");
    var myObj = navigationContext.Parameters.GetValue<MyObject>("myObjectParam");
}
```

##### 多值与合并参数

`NavigationParameters` 同时支持同一个键对应多个值的场景（类似字典的多值集合），以及同时使用 URI 查询参数和 `NavigationParameters` 实例的合并机制：

```CS
// URI 查询和 NavigationParameters 混合传参
var extraParams = new NavigationParameters { { "foo", "bar" } };
_navigationService.NavigateAsync("ViewA?id=3", extraParams);
```

##### 全局参数与局部参数

在 Prism 9.0 中，你需要注意 `NavigationParameters` 的作用域：

- **局部参数**：仅针对当前的 `RequestNavigate` 有效。
- **持久化**：如果启用了导航日志（Journal），当你通过“后退”回到该页面时，之前的参数默认会被保留并重新传递给 `OnNavigatedTo`。

#### 确认导航

在许多应用程序场景中，当用户尝试从当前视图导航到另一个视图时，我们希望**在导航真正发生之前**让用户确认是否继续，例如：

- 用户正在编辑未保存的数据；
- 当前视图有未完成流程；
- 导航可能导致丢失更改或状态等。

Prism 的导航确认机制基于以下流程：

1. 调用 `RequestNavigate` 发起导航请求；
2. Prism 在执行导航之前检查当前视图（View）或其 ViewModel 是否实现了确认接口；
3. 如果实现了确认接口，Prism 会调用相应方法，**请求调用方确认是否继续导航**；
4. 在确认完成后：
   - 如果用户同意，则继续导航；
   - 如果用户取消，则终止导航。

这个流程允许你在导航发生前进行用户交互，如弹出对话框提示用户是否保存、更改或放弃当前内容。

##### `IConfirmNavigationRequest`接口

要启用导航确认，你可以让当前视图的 View 或 ViewModel 实现 **`IConfirmNavigationRequest`** 接口。该接口继承自 `INavigationAware`，并增加了用于确认的回调方法。

```CS
void ConfirmNavigationRequest(
    NavigationContext navigationContext,
    Action<bool> continuationCallback);
```

- **navigationContext** 提供当前导航上下文（包括目标 URI、参数等）；

- **continuationCallback(bool)** 必须在确认完成后调用：

  - 传入 `true` → Prism 继续执行导航；

  - 传入 `false` → Prism **取消导航**。

**示例：实现导航确认**

```CS
public class ViewAViewModel : BindableBase, IConfirmNavigationRequest
{
    public void ConfirmNavigationRequest(
        NavigationContext navigationContext,
        Action<bool> continuationCallback)
    {
        bool result = true;

        // 使用消息框提示用户（仅演示，实际推荐使用 DialogService）
        if (MessageBox.Show("Do you want to navigate?", 
            "Navigate?", MessageBoxButton.YesNo) == MessageBoxResult.No)
        {
            result = false;
        }

        continuationCallback(result);
    }

    public bool IsNavigationTarget(NavigationContext navigationContext) => true;
    public void OnNavigatedFrom(NavigationContext navigationContext) {}
    public void OnNavigatedTo(NavigationContext navigationContext) {}
}
```

- 当 Prism 发现当前激活视图或 ViewModel 实现了 `IConfirmNavigationRequest` 时，会在导航前调用 `ConfirmNavigationRequest`；
- 视图模型可以显示 UI（例如消息框、对话框等）来获取用户选择；
- 根据用户响应通过 `continuationCallback` 通知 Prism 是否继续导航。

> 直接在 ViewModel 中使用（例如 `MessageBox`）弱耦合性不高。通常推荐使用 Prism 的 **DialogService**（即 `IDialogService`）来弹出 MVVM 友好的确认对话框

##### 异步确认与IDialogServie

由于 `ConfirmNavigationRequest` 使用了回调模式（Callback），它天然支持**异步操作**。你可以在这个方法里弹出窗口，等待用户操作，而不会阻塞 UI 线程。

```CS
public class EditUserViewModel : BindableBase, IConfirmNavigationRequest
{
    private readonly IDialogService _dialogService;
    public bool IsDirty { get; set; } // 标记是否有未保存的更改

    public EditUserViewModel(IDialogService dialogService) 
    {
        _dialogService = dialogService;
    }

    public void ConfirmNavigationRequest(NavigationContext navigationContext, Action<bool> continuationCallback)
    {
        if (IsDirty)
        {
            // 弹出对话框询问用户
            _dialogService.ShowDialog("ConfirmationDialog", new DialogParameters { { "message", "您有未保存的更改，确定要离开吗？" } }, result =>
            {
                // 根据用户点击按钮的结果决定是否继续导航
                if (result.Result == ButtonResult.OK)
                    continuationCallback(true);
                else
                    continuationCallback(false);
            });
        }
        else
        {
            // 没有更改，直接允许通过
            continuationCallback(true);
        }
    }

    // INavigationAware 的其他方法
    public void OnNavigatedTo(NavigationContext navigationContext) { }
    public bool IsNavigationTarget(NavigationContext navigationContext) => true;
    public void OnNavigatedFrom(NavigationContext navigationContext) { }
}
```

##### 确认导航执行顺序

在一个完整的导航流程中，确认逻辑的执行位置如下：

1. **发起导航**：`RequestNavigate`。
2. **确认拦截 (Confirming)**：调用当前页面的 `ConfirmNavigationRequest`。
3. **允许通过**：用户确认离开。
4. **离开通知 (From)**：调用当前页面的 `OnNavigatedFrom`。
5. **到达通知 (To)**：调用目标页面的 `OnNavigatedTo`。

#### 控制视图生命周期

在区域导航中，当你导航至新视图时：

1. Prism 会创建新的视图实例；
2. 将它添加到指定的 Region；
3. 将该视图激活；
4. 并将前一个（旧的）视图 **停用**（不是立即移除）。

默认行为是 *停用旧视图但保留它在 Region 中*，这意味着：

- 停用的视图仍然存在于内存中；
- 它仍保留在 Region 的 Views 或 ActiveViews 集合中（如果适用）；
- 可能在后续的导航中被重新激活。

但在某些场景下，你**不希望停用的视图被长期保留**，比如：

- 该视图占用大量资源；
- 你希望“每次导航都是全新视图”；
- 你不需要返回旧视图（没有历史栈要求）。

Prism 允许你通过一个简单的机制来控制这一行为：**`IRegionMemberLifetime`**。

##### `IRegionMemberLifetime`接口

```CS
public interface IRegionMemberLifetime
{
    bool KeepAlive { get; }
}
```

它只有一个只读属性：

- **`KeepAlive`** — 当视图被停用（Deactivate）时是否应当 **继续保留在 Region 中**。
  - `true`：**保留视图实例**（默认行为）
  - `false`：**移除视图实例**，释放其在 Region 中的引用，从而使其可被垃圾回收。

##### 使用方式

###### 实现接口

可以在 **视图类（View）** 或 **视图模型（ViewModel）** 上实现这个接口：

```CS
public class EmployeeDetailsViewModel : BindableBase, IRegionMemberLifetime
{
    public bool KeepAlive => true; // 视图停用后仍保留
}
```

或者如果你希望停用时 **移除该视图**：

```CS
public class EmployeeDetailsViewModel : BindableBase, IRegionMemberLifetime
{
    public bool KeepAlive => false;
}
```

当 KeepAlive 返回 `false` 时，Prism 会在导航至其他视图且当前视图停用时：

- 从 Region 的 Views 集合中移除该视图；
- 不保留对它的引用；
- 因此该视图栈不再包含它，旧视图不会被重新激活。

###### 注解标识

除了在类上实现接口，你还可以使用 Prism 提供的 **`RegionMemberLifetimeAttribute`** 标注类来实现相同效果：

```CS
[RegionMemberLifetime(KeepAlive = true)]
public class EmployeeDetailViewModel : BindableBase
{
}
```

#### 导航日志

在 Prism 的区域导航中，框架不仅支持把视图动态加载到指定区域，还提供了一个 **导航历史管理机制**（Navigation Journal），用于跟踪导航流并支持用户在同一区域内“后退/前进”操作。

导航日志的功能类似浏览器历史记录：

- 跟踪用户在同一区域进行的导航；
- 允许执行 **GoBack（回退）** 和 **GoForward（前进）**；
- 可查询是否可以进行前进/后退操作；
- 可自定义行为或清理历史记录。

##### 日志来源：`IRegionNavigationServie`

当 Prism 执行基于 **区域导航** 时，会通过 **区域导航服务 (`IRegionNavigationService`)** 来协调整个过程。这个服务除了处理导航请求、确认导航、执行视图激活外，还暴露了一个 **日志接口 (`Journal`)**：

```CS
public interface IRegionNavigationService : INavigateAsync
{
    IRegion Region { get; }
    IRegionNavigationJournal Journal { get; }
    event EventHandler<RegionNavigationEventArgs> Navigating;
    event EventHandler<RegionNavigationEventArgs> Navigated;
    event EventHandler<RegionNavigationFailedEventArgs> NavigationFailed;
}
```

- `NavigationService.Journal` 即当前区域的导航日志；
- 该服务在执行 `RequestNavigate(...)` 操作时自动更新历史记录（如果日志允许）。

##### 核心API:`IRegionNavigationJournal`

导航日志通过接口 `IRegionNavigationJournal` 来提供历史管理功能。它支持如下操作：

```CS
public interface IRegionNavigationJournal
{
    bool CanGoBack { get; }
    bool CanGoForward { get; }
    // 当前历史项，可用于显示导航标题、当前 URI 或参数等
    IRegionNavigationJournalEntry CurrentEntry { get; }
    // 指定或确认当前的导航目标服务实例
    INavigateAsync NavigationTarget { get; set; }
    void Clear();
    void GoBack();
    void GoForward();
    void RecordNavigation(IRegionNavigationJournalEntry entry);
}
```

##### 在ViewModel中使用Navigation Journal

```CS
public class EmployeeDetailsViewModel : INavigationAware
{
    private IRegionNavigationService navigationService;

    public void OnNavigatedTo(NavigationContext navigationContext)
    {
        // 存储导航服务
        navigationService = navigationContext.NavigationService;
    }

    public DelegateCommand GoBackCommand { get; }
    public DelegateCommand GoForwardCommand { get; }

    public EmployeeDetailsViewModel()
    {
        GoBackCommand = new DelegateCommand(GoBack, () =>
            navigationService?.Journal.CanGoBack == true);

        GoForwardCommand = new DelegateCommand(GoForward, () =>
            navigationService?.Journal.CanGoForward == true);
    }

    private void GoBack() => navigationService.Journal.GoBack();
    private void GoForward() => navigationService.Journal.GoForward();
}
```

- 在 `OnNavigatedTo` 中获取当前区域的导航服务；
- 在 UI 上绑定 `GoBackCommand` / `GoForwardCommand`；
- 使用日志提供的 `GoBack()` / `GoForward()` 执行历史导航。

##### 日志默认行为

Prism 默认提供一个基于 **栈结构** 的导航日志：

- 每次区域导航成功后会记录一条历史；
- `GoBack()` 会退回到上一条并重新激活对应视图；
- `GoForward()` 在执行 `GoBack()` 后可用于前进（类似浏览器）。

这是在正常执行基于 `RequestNavigate` 的导航时自动启用的

> 如果不是通过标准的导航机制（如直接使用视图注入 `Add()` 或视图发现注册）进行视图切换，导航日志可能不会更新，因此后退/前进不会生效

##### 排除不想记录的导航项

在某些场景中你可能不希望某些视图被加入历史记录，例如：

- 中间加载页面；
- 警告或提示视图；
- 不需要在后退时访问的临时 UI。

Prism 支持通过实现 **`IJournalAware` 接口** 在视图或视图模型上控制这一行为：

```CS
public interface IJournalAware
{
    bool PersistInHistory();
}
```

若某个页面返回 `false`，则该视图实例不会被加入导航日志，从而不会在执行 `GoBack()` 或 `GoForward()` 时显示：

```CS
public class IntermediaryPage : IJournalAware
{
    public bool PersistInHistory() => false;
}
```

此机制常用于临时屏幕、加载遮罩或特定提示页，这些视图应该 **跳过导航历史**

## 平台

### .NET MAUI



### Uno Platform



### WPF

#### 对话服务

Prism 在 WPF 中提供了一个 MVVM 友好的对话框服务（**`IDialogService`**），用于显示**自定义对话窗口**（modal/dialog）并与 ViewModel 进行交互，而无需直接在 View 层操作窗口或弹窗逻辑。

这个服务的核心是：

- 不直接使用 WPF 原生的 `Window.ShowDialog()`；
- 使用 Prism DI 容器来创建对话框视图与对应 ViewModel；
- 通过参数传递与结果回调来实现数据交互。

##### 对话框View

对话框首先是一个WPF **UserControl**，你可以按 UI 需要自由设计。唯一要求是它的 DataContext 需要关联一个实现了 **`IDialogAware`** 的 ViewModel。Prism 推荐使用 ViewModelLocator 自动注入 ViewModel。

```XAML
<UserControl x:Class="HelloWorld.Dialogs.NotificationDialog"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             xmlns:prism="http://prismlibrary.com/"
             prism:ViewModelLocator.AutoWireViewModel="True"
             Width="300" Height="150">
    <!-- 自定义布局 -->
</UserControl>
```

##### 对话框ViewModel

Prism 规定对话框的 ViewModel 必须实现 **`IDialogAware`** 接口，它定义了对话框的生命周期和结果通知机制。

接口包括：

- **`Title`** — 对话框标题；
- **`CanCloseDialog()`** — 控制是否允许关闭；
- **`OnDialogOpened(IDialogParameters)`** — 对话框打开时的参数接收；
- **`OnDialogClosed()`** — 对话框关闭后清理或逻辑；
- **`RequestClose` 事件** — 通过该事件通知 Prism 关闭对话框。

```CS
public class NotificationDialogViewModel : BindableBase, IDialogAware
{
    public event Action<IDialogResult> RequestClose;

    public bool CanCloseDialog() => true;

    public void OnDialogOpened(IDialogParameters parameters)
    {
        Message = parameters.GetValue<string>("message");
    }

    public void OnDialogClosed() { }

    public string Title { get; set; }

    public DelegateCommand<string> CloseDialogCommand =>
        new DelegateCommand<string>(p =>
        {
            var result = p == "true" ? ButtonResult.OK : ButtonResult.Cancel;
            RequestClose?.Invoke(new DialogResult(result));
        });

    private string _message;
    public string Message
    {
        get => _message;
        set => SetProperty(ref _message, value);
    }
}
```

##### 注册对话框

在 Prism 应用的 `RegisterTypes` 方法中通过容器注册对话框：

```CS
protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.RegisterDialog<NotificationDialog, NotificationDialogViewModel>();
}
```

- 泛型参数指对话框 View 和 ViewModel；
- 也可以指定一个 **自定义名称**（字符串）作为对话框标识。

##### 使用Dialog Service

在需要显示对话框的 ViewModel 中注入 `IDialogService`：

```cs
public MainWindowViewModel(IDialogService dialogService)
{
    _dialogService = dialogService;
}
```

调用对话框：

```CS
_dialogService.ShowDialog(
    "NotificationDialog",
    new DialogParameters($"message={message}"),
    r =>
    {
        if (r.Result == ButtonResult.OK) { /* 处理 OK */ }
        else if (r.Result == ButtonResult.Cancel) { /* 处理 Cancel */ }
    });
```

- 第一个参数是对话框注册名称；
- 第二个参数是传递给对话框的参数；
- 第三个是回调，用于处理对话框返回的结果（`IDialogResult`）。

##### 自定义对话框宿主窗体Window

默认 Prism 会创建标准的 WPF `Window` 承载你的对话框内容。如果你使用第三方控件或需要不同的 Window 类型，可以：

1. 创建一个实现了 `IDialogWindow` 接口的自定义 Window 类型；
2. 通过容器注册该对话框宿主：

```CS
containerRegistry.RegisterDialogWindow<MyCustomDialogWindow>();
```

或者带名称：

```CS
containerRegistry.RegisterDialogWindow<MyCustomDialogWindow>("notifyWindow");
```

如果使用了命名 Window，在调用 `ShowDialog` 时要将该 window 名称传入：

```CS
_dialogService.ShowDialog(
    "NotificationDialog",
    parameters,
    callback,
    "notifyWindow");
```

##### 控制对话框Window样式

可以通过 Prism 提供的附加属性在对话框视图上声明对话窗口样式，例如设置启动位置、尺寸模式、是否显示任务栏等：

```XAML
<prism:Dialog.WindowStyle>
    <Style TargetType="Window">
        <Setter Property="prism:Dialog.WindowStartupLocation" Value="CenterScreen" />
        <Setter Property="ResizeMode" Value="NoResize"/>
        <Setter Property="ShowInTaskbar" Value="False"/>
        <Setter Property="SizeToContent" Value="WidthAndHeight" />
    </Style>
</prism:Dialog.WindowStyle>
```

这种方式让你可以在 XAML 里直接控制对话框宿主 Window 的属性，而无需硬编码

##### 简化对话框调用API(可选)

Prism 对话服务的原始 API 需要书写调用逻辑，如果应用内有很多类似的对话框，可以通过扩展方法封装常用对话调用模式：

```CS
public static class DialogServiceExtensions
{
    public static void ShowNotification(
        this IDialogService dialogService,
        string message,
        Action<IDialogResult> callback)
    {
        dialogService.ShowDialog(
            "NotificationDialog",
            new DialogParameters($"message={message}"),
            callback,
            "notificationWindow");
    }
}
```

这样可以在 ViewModel 中调用更简洁的对话框 API

#### 快速上手

##### 安装Nuget包：

创建一个新的 WPF 项目后，需要选择一个依赖注入容器并安装对应 Prism 包：

| NuGet 包       | 所用容器    |
| -------------- | ----------- |
| `Prism.Unity`  | Unity 容器  |
| `Prism.DryIoc` | DryIoc 容器 |

> 安装其中一个即可，它会自动带上 Prism 核心库和容器支持包

##### 继承PrismApplication

默认 WPF 应用继承 `Application`，Prism 需要你改成继承 `PrismApplication`，这样 Prism 能在启动时初始化容器并处理依赖注入等机制：

```xaml
<!-- App.xaml -->
<prism:PrismApplication
    x:Class="MyPrismApp.App"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:prism="http://prismlibrary.com/">
    <Application.Resources/>
</prism:PrismApplication>
```

> 删掉 PrismApplication 中原来的 `StartupUri`，避免运行期创建重复窗口实例

对应后台代码：

```CS
public partial class App : PrismApplication
{
}
```

##### 实现2个核心抽象方法

PrismApplication 强制你实现以下两个方法：

###### `RegisterTypes`（注册依赖服务）

用于向 Prism 容器注册服务或对象依赖，例如：

```CS
protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.Register<Services.ICustomerStore, Services.DbCustomerStore>();
}
```

这里注册了一个数据存储接口及其实现，后续 ViewModel 可以通过依赖注入获得。

Prism 的容器支持多种注册方式，比如：

- `Register`：每次解析新实例
- `RegisterSingleton`：单例
- `RegisterInstance`：注册现有实例
   容器也能解析**具体类型**而无需提前注册。

###### `CreateShell`(创建主窗口)

Prism 应用的“入口窗口”由此方法返回：

```CS
protected override Window CreateShell()
{
    return Container.Resolve<MainWindow>();
}
```

Prism 会通过 DI 容器实例化 MainWindow 及其依赖，并将其作为应用主窗口显示

##### 构建View和ViewModel

为了演示 MVVM 绑定和 Prism 的支持：

###### UI(MainWindow.xaml)

为主窗口添加一些 UI，例如：

```xaml
<Grid>
    <Grid.RowDefinitions>
        <RowDefinition Height="*" />
        <RowDefinition Height="Auto" />
    </Grid.RowDefinitions>

    <ListView ItemsSource="{Binding Customers}" SelectedItem="{Binding SelectedCustomer}" />
    <Button Grid.Row="1"
            Command="{Binding CommandLoad}"
            Content="LOAD" />
</Grid>
```

这是典型的数据绑定场景：列表 + 按钮触发命令

###### ViewModel(MainWindowViewModel)

在项目根创建 `ViewModels` 文件夹，并创建同名 ViewModel：

```CS
public class MainWindowViewModel : BindableBase
{
    private readonly ICustomerStore _customerStore;

    public MainWindowViewModel(ICustomerStore customerStore)
    {
        _customerStore = customerStore;
    }

    public ObservableCollection<string> Customers { get; } = new ObservableCollection<string>();

    private string _selectedCustomer;
    public string SelectedCustomer
    {
        get => _selectedCustomer;
        set => SetProperty(ref _selectedCustomer, value);
    }

    private DelegateCommand _commandLoad;
    public DelegateCommand CommandLoad =>
        _commandLoad ??= new DelegateCommand(ExecuteLoad);

    private void ExecuteLoad()
    {
        Customers.Clear();
        foreach (var customer in _customerStore.GetAll())
            Customers.Add(customer);
    }
}
```

- ViewModel 继承自 Prism 的 `BindableBase` 提供属性变更通知支持；
- 使用 Prism 的 `DelegateCommand` 简化 `ICommand` 实现；
- 通过构造函数依赖注入获得服务。

##### View和ViewModel自动关联

Prism 内置了 ViewModelLocator，默认约定如下命名规则：

```CS
Views.MainWindow → ViewModels.MainWindowViewModel
```

只要在 XAML 中启用自动绑定：

```XAML
Window ...
    xmlns:prism="http://prismlibrary.com/"
    prism:ViewModelLocator.AutoWireViewModel="True"
```

Prism 就会：

- 使用容器解析 ViewModel；
- 将其设置为 View 的 DataContext。

##### 执行应用与效果

完成以上步骤后：

1. PrismApplication 会初始化 DI 容器；
2. CreateShell 返回 MainWindow；
3. ViewModelLocator 自动创建 ViewModel；
4. 点击按钮触发 `CommandLoad` 填充列表。

#### 视图组合

**视图组合（View Composition）** 是 Prism 在 WPF 上构建大型、模块化应用的一项核心机制。它允许你通过定义 *可插拔的视图位置（regions）* 和不同策略，将多个松耦合视图动态组合成最终的用户界面（UI）。

这种方式适用于：

- 模块化架构中不同模块在运行时向 UI 插入内容；
- 不同视图来源于不同程序集或功能块；
- 需要让 UI 在运行时根据状态动态呈现内容。

##### 组成UI的核心元素

###### Shell(外壳)

- Shell 是应用程序的根 UI 容器，在 WPF 中通常是一个 `Window`；
- 它定义了 UI 的主要结构，例如菜单、工具栏、主内容区等；
- 对于组合式 UI，Shell 提供 *一个或多个命名区域（regions）*，为视图动态注入提供位置。

###### Views(视图)

视图是 UI 中的 *功能单元*，通常定义为：

- `UserControl`
- `Page`
- `DataTemplate`
- 甚至自定义控件。

每个视图负责一个特定 UI 部分，例如：

- 一个客户列表；
- 一个订单详情；
- 一个统计面板。

视图可以静态组合（设计时放在 Shell 内），也可以运行时动态插入。

###### Regions(区域)

**区域** 是 Prism 的核心概念，是 *用于插入视图的位置标记*。一个 Region 通常绑定到 Shell 或某个视图的容器控件，例如：

- `ContentControl`
- `ItemsControl`
- `TabControl` 等。

通过在 XAML 中使用附加属性：

```XAML
<ContentControl prism:RegionManager.RegionName="MainRegion" />
```

你就定义了一个名为 `MainRegion` 的区域，后续可以向它动态加载视图。

##### 视图加载策略

Prism 提供了两种主要方式将视图加入到 Region 中：

###### View Discovery(视图发现)

这种方式是在应用启动或模块初始化时，通过注册映射关系让 Prism 自动将视图放入指定区域：

```CS
regionManager.RegisterViewWithRegion("MainRegion", typeof(CustomerListView));
```

- 自动创建和注入视图；
- 不需要你在代码中主动调用；
- 适合静态视图、只需单实例的场景。

在视图发现模式中，Prism 会在 Region 被创建后自动实例化所有关联的视图类型并显示它们

###### View Injection(视图注入)

这种方式需要你手动获取 Region 并向其中添加视图实例。典型用法如下：

```CS
var region = regionManager.Regions["MainRegion"];
var view = container.Resolve<OrderDetailView>();
region.Add(view);
region.Activate(view);
```

- 你可以控制 *何时创建视图*；
- 能添加多个实例（例如多个订单详情视图）；
- 可按需移除或激活特定实例。

这种方式适用于需要动态、可控的视图注入场景。

---

| 策略                           | 适用场景                                                     |
| ------------------------------ | ------------------------------------------------------------ |
| **视图发现（View Discovery）** | 自动加载视图且无需程序控制时；单实例视图或设计时定义界面时   |
| **视图注入（View Injection）** | 需要控制视图创建/销毁；需要多个视图实例；需要按业务逻辑动态视图插入时 |

##### 与导航（Navigation）的关系

Prism 在视图注入的基础上抽象了导航 API。区域导航本质上是：

- 告诉 Prism “将 *某个 URI 对应的视图* 加入 Region”；
- Prism 自动解析视图类型；
- 将视图创建、插入、激活。

这使得导航成为一种通用注入模式，并支持 *导航历史（Journal）*、参数传递等高级功能。

##### RegionManager、RegionAdapter与Behaviors

Prism 内部机制较为灵活：

- **RegionManager** 管理所有 Region，并协调视图与 Region 的关系；
- **RegionAdapter** 是针对特定 WPF 控件适配 Region 行为（例如 `ContentControlRegionAdapter` 让 `ContentControl` 成为 Region）；
- **Behaviors**（如 `RegionActiveAwareBehavior`、`RegionMemberLifetimeBehavior`）用于控制 Region 内视图的激活状态和生命周期；

这些机制通常无需手动编写，但是 Prism 支持组合式 UI 的重要内部组件。

#### 交互

##### 将事件绑定到命令

在 WPF 的 MVVM 模式中，很多控件事件本身并不直接支持命令（`ICommand`）属性。Prism 提供了一个辅助触发行为类 **`InvokeCommandAction`**，可以把这些事件直接“桥接”到 ViewModel 中的命令，从而避免写代码后置。

在 MVVM 架构里：

- **ViewModel 定义状态和行为（通过命令）**
- **View 通过数据绑定把 UI 操作映射到命令上**

对于像按钮这种自带 `Command` 属性的控件，这很自然地支持；但对没有 `Command` 属性的事件（例如 `ListBox.SelectionChanged`、`TextBox.TextChanged` 等），需要一种方式让事件触发命令。Prism 的 `InvokeCommandAction` 就是用于解决这个问题的 XAML 支持。

###### `InvokeCommandAction`使用方式

1. 引入命名空间

   ```XAML
   xmlns:i="http://schemas.microsoft.com/xaml/behaviors"
   xmlns:prism="http://prismlibrary.com/"
   ```

   `i` 是 WPF 自带的 **行为/触发器** 命名空间（Interaction Triggers）；

   `prism` 是 Prism 的命名空间，在这里用来引用 `InvokeCommandAction`。

2. 编写事件到命名的绑定

   ```XAML
   <ListBox ItemsSource="{Binding Items}" SelectionMode="Single">
     <i:Interaction.Triggers>
       <i:EventTrigger EventName="SelectionChanged">
         <prism:InvokeCommandAction
             Command="{Binding SelectedCommand}"
             CommandParameter="{Binding SomeParameter}" />
       </i:EventTrigger>
     </i:Interaction.Triggers>
   </ListBox>
   ```

   当 `SelectionChanged` 事件发生时，Prism 的 `InvokeCommandAction` 会调用 **ViewModel 中绑定的命令** `SelectedCommand`；

   可以通过 `CommandParameter` 显式传递 ViewModel 所需的参数。

###### 常用属性

`Command`——必须属性

指定要执行的命令：

```XAML
Command="{Binding SomeViewModelCommand}"
```

如果未设置，行为不会工作。

---

`CommandParameter`——可选参数

用于显式向命令传递固定值或绑定值：

```XAML
CommandParameter="{Binding MyParameter}"
```

若同时未设置，并且未设置 `TriggerParameterPath`，该行为会把事件参数（EventArgs）本身作为参数传递给命令（这在某些场景中也有用）。

---

`TriggerParameterPath`——从事件参数提取子属性

WPF 事件通常有复杂的 EventArgs 类型。如果希望只传递 EventArgs 对象的某个属性给命令，可以指定路径。例如在 `SelectionChanged` 事件中，可能只需 `AddedItems`：

```XAML
<prism:InvokeCommandAction
    Command="{Binding SelectedCommand}"
    TriggerParameterPath="AddedItems" />
```

Prism 会从事件参数的 `AddedItems` 属性读取值并传给命令。此特性让你从事件数据中提取 ViewModel 更关心的部分。

---

`AutoEnable`——根据`CanExecute`自动启用/禁用控件

默认值为 `True`，Prism 会根据命令的 `CanExecute` 返回值自动启用或禁用关联的 UI 元素：

```XAML
AutoEnable="true"
```

