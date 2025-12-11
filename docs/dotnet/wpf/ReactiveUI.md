---
title: ReactiveUI
shortTitle: ReactiveUI
description: ReactiveUI
date: 2025-11-05 22:24:33
categories: [.NET, WPF]
tags: [.NET]
header: [1, 5]
author:
  name: Okita
  url: https://zhiyun.space
  email: 2368932388@qq.com
order: 7
---

## 命令

### 命令

#### 创建命令

| 方法名                   | 功能           | 执行模型                   | 常用场景                                |
| ------------------------ | -------------- | -------------------------- | --------------------------------------- |
| `Create()`               | 创建同步命令   | 同步执行                   | 本地简单逻辑（例如：加减、切换状态）    |
| `CreateFromTask()`       | 创建异步命令   | 基于 `Task`                | 网络请求、文件IO等异步操作              |
| `CreateFromObservable()` | 创建响应式命令 | 基于 `IObservable`         | 与数据流交互（比如 SignalR、Rx 数据流） |
| `CreateCombined()`       | 合并多个命令   | 组合多个 `ReactiveCommand` | 多命令合并、联合状态管理                |

| 创建方法                 | 执行类型    | 返回类型          | 是否异步 | 典型场景             | 备注             |
| ------------------------ | ----------- | ----------------- | -------- | -------------------- | ---------------- |
| `Create()`               | 同步        | 立即值（或 Unit） | ❌        | 计数、切换状态       | 简单本地逻辑     |
| `CreateFromTask()`       | 异步 (Task) | `Task<T>`         | ✅        | 网络、IO、数据库     | 最常用           |
| `CreateFromObservable()` | 响应式流    | `IObservable<T>`  | ✅        | 实时流、监控、Rx管道 | 高级用法         |
| `CreateCombined()`       | 多命令组合  | 合并流            | ✅        | 并行加载、复合逻辑   | 管理多个命令状态 |

##### ReactiveCommand.Create()

用于创建**同步命令**（立即执行，不涉及异步或 Observable）

```CS
public ReactiveCommand<Unit, Unit> IncrementCommand { get; }

private int _count;
public int Count
{
    get => _count;
    set => this.RaiseAndSetIfChanged(ref _count, value);
}

public CounterViewModel()
{
    IncrementCommand = ReactiveCommand.Create(() => Count++);
}
```

**特点：**

- 执行立即完成。
- 不支持取消。
- 可用在 UI 控件的命令绑定上（如 Button）。
- 返回 `Unit`（即“无返回值”）。

##### ReactiveCommand.CreateFromTask()

用于创建**异步命令**，内部执行 `Task`

```CS
public ReactiveCommand<Unit, string> LoadDataCommand { get; }

public MainViewModel()
{
    LoadDataCommand = ReactiveCommand.CreateFromTask(async () =>
    {
        await Task.Delay(1000);
        return "数据加载完成";
    });
}

public async Task Run()
{
    var result = await LoadDataCommand.Execute();
    Console.WriteLine(result);
}
```

**特点：**

- 内部封装 `Task`。
- 自动处理异步执行状态（`IsExecuting`）。
- 捕获异常流（`ThrownExceptions`）。
- 是最常用的 ReactiveCommand 类型。

##### ReactiveCommand.CreateFromObservable()

用于创建基于 **IObservable** 的命令。

```CS
public ReactiveCommand<Unit, string> StreamCommand { get; }

public MainViewModel()
{
    StreamCommand = ReactiveCommand.CreateFromObservable(() =>
    {
        // 模拟一个数据流
        return Observable.Interval(TimeSpan.FromSeconds(1))
                         .Take(3)
                         .Select(x => $"数据 {x + 1}");
    });
}

public MainViewModel()
{
    StreamCommand.Subscribe(Console.WriteLine);
}
```

**特点：**

- 执行结果是一个完整的数据流（可以多次发射）。
- 适合流式任务：实时监控、SignalR、Rx 操作链。
- 可与 `.SelectMany()`、`.Merge()` 等 Rx 运算符组合使用。

##### ReactiveCommand.CreateCombined()

用于**合并多个命令**，生成一个新的命令。所有子命令的执行结果会**合并成一个输出流**。

```CS
public ReactiveCommand<Unit, string> LoadUserCommand { get; }
public ReactiveCommand<Unit, string> LoadSettingsCommand { get; }
public ReactiveCommand<Unit, string> CombinedCommand { get; }

public MainViewModel()
{
    LoadUserCommand = ReactiveCommand.CreateFromTask(async () =>
    {
        await Task.Delay(500);
        return "用户信息加载完毕";
    });

    LoadSettingsCommand = ReactiveCommand.CreateFromTask(async () =>
    {
        await Task.Delay(800);
        return "设置加载完毕";
    });

    CombinedCommand = ReactiveCommand.CreateCombined(
        LoadUserCommand,
        LoadSettingsCommand
    );
}

// 订阅合并结果
CombinedCommand.Subscribe(result =>
{
    Console.WriteLine($"结果流: {result}");
});
```

**特点：**

- 合并多个命令的结果流（Reactive 流）。
- 自动跟踪所有子命令的状态。
- 当任一子命令执行时，合并命令也进入执行状态。
- 用于需要多个子命令**并行或顺序执行**的复杂场景。



#### 同步命令



#### 异步命令

三种用于创建异步命令的方法：

- `CreateFromObservable（）` - 使用 `IObservable` 执行逻辑。
- `CreateFromTask（）` - 执行 C# [任务并行库 （TPL）](https://docs.microsoft.com/en-us/dotnet/standard/parallel-programming/task-based-asynchronous-programming) 任务。这也允许使用 C# [async/await](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/async) 运算符。在[此处](https://www.reactiveui.net/docs/handbook/commands/canceling)阅读有关取消命令的更多信息。
- `CreateRunInBackground（）` - 在后台线程上执行允许更新 UI 状态的方法。

`CreateRunInBackground()` 是 `CreateFromTask()` 的一个语法糖，本质上等价于：

```CS
ReactiveCommand.CreateFromTask(async () =>
{
    await Task.Run(() => { /* 后台执行逻辑 */ });
});
```

区别在于：

- `CreateRunInBackground()` 自动帮你用 `Task.Run()` 封装；
- 不需要自己写 `await Task.Run(...)`；
- 更简洁、可读性更好。

使用示例：

1. 无返回值的后台任务

```CS
public ReactiveCommand<Unit, Unit> LoadDataCommand { get; }

public MainViewModel()
{
    LoadDataCommand = ReactiveCommand.CreateRunInBackground(() =>
    {
        // 模拟耗时任务
        Thread.Sleep(3000);
        Console.WriteLine($"后台加载数据完成，线程ID：{Thread.CurrentThread.ManagedThreadId}");
    });

    LoadDataCommand.IsExecuting
        .Subscribe(isRunning => Console.WriteLine(isRunning ? "执行中..." : "完成"));
}
```

2. 有返回值的后台任务

```CS
public ReactiveCommand<Unit, string> ComputeCommand { get; }

public MainViewModel()
{
    ComputeCommand = ReactiveCommand.CreateRunInBackground(() =>
    {
        Thread.Sleep(2000);
        return $"后台计算结果: {DateTime.Now:T}";
    });

    // 订阅结果
    ComputeCommand.Subscribe(result =>
    {
        Console.WriteLine($"主线程收到结果: {result}, 线程ID：{Thread.CurrentThread.ManagedThreadId}");
    });
}
```



#### 控制可执行性

##### 基于属性值的控制 (使用 `WhenAnyValue`)

这是最常见和最优雅的方式。你将一个或多个属性的变化组合成一个布尔流。

**需求：** 只有当用户名不为空 **且** 密码长度大于 6 时，登录按钮才可用。

```CS
// 1. 创建一个布尔流，它依赖于两个源属性
var canLogin = this.WhenAnyValue(
    x => x.Username,                  // 监听 Username 属性
    x => x.Password,                  // 监听 Password 属性
    (name, pass) => !string.IsNullOrWhiteSpace(name) && (pass?.Length >= 6) // 组合判断逻辑
);

// 2. 将布尔流传递给命令
LoginCommand = ReactiveCommand.CreateFromTask(
    LoginAsync, 
    canLogin // 传入控制流
);
```

每当 `Username` 或 `Password` 属性发生变化，`canLogin` 流都会产生一个新值，RxUI 会立即使用这个新值更新 `LoginCommand.CanExecute` 状态。

##### 自动控制：基于命令执行状态

所有异步命令（如 `CreateFromTask` 和 `CreateFromObservable`）都会**自动**在它们的 `IsExecuting` 状态上添加一层控制。

- **`IsExecuting` 流**：每个异步命令都会暴露一个 `IsExecuting` 属性（它本身也是一个 `IObservable<bool>`）。
- **自动禁用**：在默认情况下，只要命令的异步任务正在运行 (`IsExecuting` 为 `true`)，命令就会被自动禁用。

```CS
SaveCommand = ReactiveCommand.CreateFromTask(SaveDataAsync); 
// 当 SaveDataAsync 开始执行，SaveCommand.CanExecute 自动变为 false。
// 当 SaveDataAsync 完成，SaveCommand.CanExecute 自动变回 true。
```

#### 处理异常

ReactiveUI 对异常的处理逻辑与传统 `try/catch` 完全不同：

ReactiveCommand 的异常不会抛出，而是通过一个 **Observable 异常流 (`ThrownExceptions`)** 自动传播。

##### 命令级别的异常处理（ReactiveCommand）

基本示例：

```CS
LoginCommand = ReactiveCommand.CreateFromTask(async () =>
{
    // 模拟异常
    await Task.Delay(1000);
    throw new Exception("登录失败：服务器无响应");
});
```

如果这样写，没有任何 try/catch 包裹，程序不会崩溃，但异常会被发送到：`LoginCommand.ThrownExceptions`

**订阅异常流的方式**

1. 在ViewModel中捕获

```CS
LoginCommand.ThrownExceptions
    .Subscribe(ex =>
    {
        // 异常集中处理
        MessageBox.Show(ex.Message, "错误", MessageBoxButton.OK, MessageBoxImage.Error);
    });
```

注意：

- `ThrownExceptions` 是一个 `IObservable<Exception>`
- 你可以用任何 Rx 操作符（如 `.Do()`, `.Catch()`, `.Throttle()`）进行扩展
- 订阅最好放在构造函数中

2. 结合Rx操作符一起处理

如果多个命令都有异常，可以用 `Merge` 聚合它们的异常流：

```CS
Observable.Merge(
    LoginCommand.ThrownExceptions,
    RegisterCommand.ThrownExceptions,
    SaveCommand.ThrownExceptions
)
.Subscribe(ex =>
{
    // 全局错误提示
    ShowErrorDialog(ex.Message);
});
```

**最佳实践：集中处理和记录日志**
在 ViewModel 的构造函数中订阅这个流，并在 UI 线程上处理异常（例如显示一个友好的提示）。

```CS
public class MyViewModel : ReactiveObject
{
    public ReactiveCommand<Unit, Unit> LoginCommand { get; }

    public MyViewModel()
    {
        // ... 初始化命令的 canExecute 逻辑 ...
        
        // 1. 创建命令 (假设 LoginAsync 内部会抛出异常)
        LoginCommand = ReactiveCommand.CreateFromTask(LoginAsync, canExecute);

        // 2. 订阅 ThrownExceptions 流
        LoginCommand.ThrownExceptions
            // 确保回到 UI 线程来显示消息框或更新 UI 错误状态
            .ObserveOn(RxApp.MainThreadScheduler) 
            .Subscribe(ex =>
            {
                // 记录详细异常信息
                // Log.Error($"登录失败: {ex.Message}", ex); 
                
                // 向用户显示友好的错误提示
                ErrorMessage = $"登录失败，请重试: {ex.Message}";
                
                // 确保你已经处理了这个异常流。
            });
    }

    private async Task LoginAsync()
    {
        // 模拟一个可能失败的操作
        if (string.IsNullOrEmpty(Username))
        {
            throw new InvalidOperationException("用户名不能为空。");
        }
        await Task.Delay(1000); // 模拟网络
        // ... 真正的登录逻辑
    }
}
```

> [!NOTE]
>
> **避免在 `Execute` 中使用 `try-catch`:** 对于 `ReactiveCommand`，最佳实践是**不**在 `LoginAsync` 内部使用 `try-catch` 来捕获所有异常。相反，你应该让它抛出异常，然后通过 **`ThrownExceptions`** 集中捕获和处理。这保持了命令的纯粹性，并将副作用（如显示错误）移到了订阅端。

##### Rx流中的异常处理（自定义Observable）

如果处理一个自定义的 `IObservable` 流（例如，使用 `WhenAnyValue` 或 `Observable.FromEvent`），异常的处理方式取决于你的需求：

1. 使用 `Catch` 或 `OnErrorResumeNext` (恢复流)

如果你希望流在发生错误后**不终止**，而是继续运行或用一个默认值代替，可以使用 `Catch` 操作符：

```CS
myObservableStream
    .Select(data => DangerousOperation(data)) // 这一步可能抛出异常
    .Catch<ResultType, Exception>(ex => 
    {
        // 记录异常
        Console.WriteLine($"Error occurred: {ex.Message}");
        
        // 捕获异常后，返回一个包含默认值的 Observable，然后流继续
        return Observable.Return(new ResultType { IsValid = false }); 
    })
    .Subscribe(result => { /* 处理结果 */ });
```

2. 直接在 `Subscribe` 中处理

如果你不需要恢复流，可以直接在 `Subscribe` 方法中提供 `OnError` 回调:

```CS
someApiCallObservable
    .Subscribe(
        onNext: result => Console.WriteLine("Success!"),
        onError: ex => Console.WriteLine($"API Call Failed: {ex.Message}") // 异常处理
    );
```

##### MVVM中的异常反馈

无论异常在哪里被捕获，处理结果都应该通过数据绑定反馈给 UI：

1. **ViewModel 属性**: 在 ViewModel 中设置一个 `ErrorMessage` 属性。
2. **UI 绑定**: 在 XAML 中，将一个 `TextBlock` 绑定到 `ErrorMessage`，当它不为空时显示错误。

```XAML
<TextBlock Text="{Binding ErrorMessage}" 
           Foreground="Red" 
           Visibility="{Binding ErrorMessage, Converter={StaticResource StringToVisibilityConverter}}" />
```

#### 调用命令



#### 在可观察管道中调用命令

ReactiveCommand 不仅是 ICommand，也是一个 **可观察的流 (IObservable)**。

因此：

- UI 可以调用命令
- 代码可以调用命令（Execute）
- **Observable 流也能触发命令（InvokeCommand）**

也就是说，可以把命令当作一个“流的消费者（sink）”。

ReactiveUI 提供了一个专用操作符：`InvokeCommand()`，这是用一条语句就能将 Observable “绑定” 到命令的工具。

**基本示例：**

假设你有一个文本框，当文本变化时，自动触发搜索命令：

```CS
this.WhenAnyValue(x => x.SearchText)
    .Throttle(TimeSpan.FromMilliseconds(500))
    .Where(text => !string.IsNullOrEmpty(text))
    .InvokeCommand(SearchCommand);
```

调用逻辑：

```CS
文字变化 → Throttle → Where → InvokeCommand(SearchCommand) → 执行命令
```

---

**工作机制：**

`InvokeCommand` 会：

1. **监听 Observable 上的值**
2. **将值作为参数传给命令**
3. 如果命令不能执行（CanExecute=false），它会自动忽略
4. 自动订阅执行结果流（不需要你自己 Subscribe）

因此，它非常适合 MVVM 响应式链式调用。

---

**两种调用方式：**

1. `InvokeCommand(命令)`

适用于命令需要参数的情况：

```CS
IObservable<string> searchTextChanged;

searchTextChanged
    .InvokeCommand(ViewModel, vm => vm.SearchCommand);
```

`SearchCommand`的格式：

```CS
public ReactiveCommand<string, SearchResult> SearchCommand { get; }
```

2. `InvokeCommand(ViewModel,命令表达式)`

适合直接在View绑定：

```CS
this.WhenAnyValue(v => v.SearchTextBox.Text)
    .InvokeCommand(ViewModel, vm => vm.SearchCommand);
```

#### 组合命令

**组合命令**指通过某种方式把 **多个 ReactiveCommand** 聚合在一起，使它们成为一个整体，通常出现在以下场景：

1. **一组独立命令的输出需要作为一个整体对外发布**
2. **某些 UI 行为应该触发多个命令一起执行**
3. **需要把多个命令的执行状态(IsExecuting) 合并用于 UI 控制**
4. **多个命令的 CanExecute 需要组合成一个逻辑 CanExecute**

ReactiveUI 为此提供了：

- **CreateCombined**（ReactiveCommand 的静态方法）
- **通过 Rx 组合多个命令的 `IsExecuting`、`ThrownExceptions`、`CanExecute`**

---

##### ReactiveCommand.CreateCombined

```CS
public ReactiveCommand<Unit, Unit> SaveCommand { get; }
public ReactiveCommand<Unit, Unit> LogCommand { get; }
public ReactiveCommand<Unit, Unit> CombinedCommand { get; }

CombinedCommand = ReactiveCommand.CreateCombined(
    new[] { SaveCommand, LogCommand }
);
```

这个 CombinedCommand 会在触发时：

1. 先触发 SaveCommand
2. 再触发 LogCommand
3. 若其中任意命令抛出异常，会聚合到 CombinedCommand 的 ThrownExceptions 中
4. IsExecuting 为所有子命令的 OR
5. CanExecute 为所有子命令的 AND（全部可执行时才可执行）

---

##### 手动组合多个命令

如果不用 `CreateCombined`，也可以通过 Rx 手动组合。

- 多个命令的执行状态合并

~~~CS
var isBusy = SaveCommand.IsExecuting
    .Merge(LogCommand.IsExecuting)
    .StartWith(false)
    .ToProperty(this, x => x.IsBusy);
~~~

- 多个命令的`CanExecute`合并

```CS
var canExecute = SaveCommand.CanExecute
    .CombineLatest(LogCommand.CanExecute, (a, b) => a && b);

CombinedCommand = ReactiveCommand.CreateFromTask(
    async () =>
    {
        await SaveCommand.Execute();
        await LogCommand.Execute();
    },
    canExecute
);
```



#### 调度控制

调度（Scheduler）定义了一个 **任务应该在什么线程、以什么方式执行**。

在 ReactiveUI 中：

- **ReactiveCommand** 默认使用调度器执行任务
- **Observable 管道** 也依赖调度器控制线程
- **Dispatcher/UI 线程调度** 是 WPF 必须处理的问题

ReactiveUI 基于 Rx.NET，所以使用 Rx 的调度器：

| 调度器                      | 描述                 | 应用场景                         |
| --------------------------- | -------------------- | -------------------------------- |
| `RxApp.MainThreadScheduler` | UI线程（Dispatcher） | 更新 ViewModel 属性、UI 绑定对象 |
| `RxApp.TaskpoolScheduler`   | 后台线程池           | 长耗时、I/O、CPU 密集型任务      |
| `Scheduler.Immediate`       | 当前线程立即执行     | 测试用，不推荐用于 UI            |
| `NewThreadScheduler`        | 始终创建新线程       | 特殊情况，不常用                 |
| `EventLoopScheduler`        | 单线程事件循环       | 避免竞态条件、后台消息处理       |

##### 调度机制

1. 任务执行调度（长任务）

默认使用：`RxApp.TaskpoolScheduler`,即 ReactiveCommand 执行任务时默认跑在后台线程。

2. OnExecuted/输出管道调度（结果流）

任务完成后，返回值会在 **MainThreadScheduler** 上输出。

示例：

```CS
var command = ReactiveCommand.CreateFromTask(async () =>
{
    await Task.Delay(1000);
    return 42;
});

command.Subscribe(result => 
{
    // 此处在 UI 线程，可直接更新 UI 绑定属性
    Value = result;
});
```

ReactiveCommand 自动保证订阅者运行在 UI 线程。

##### 控制ReactiveCommand的调度

ReactiveCommand 的 API 提供：

- 控制输入（执行端）的调度：`ObserveOn`
- 控制输出（订阅端）的调度：`ObserveOn` / `SubscribeOn`

1. 强制后台调度

```CS
command = ReactiveCommand.CreateFromTask(
    async () => { ... },
    outputScheduler: RxApp.TaskpoolScheduler
);
```

2. 强制UI线程调度

```CS
command = ReactiveCommand.CreateFromTask(
    async () => { ... },
    outputScheduler: RxApp.MainThreadScheduler
);
```

##### 在Observable管道中控制调度

语法：

```CS
observable
    .SubscribeOn(RxApp.TaskpoolScheduler)   // 指定任务在哪个线程开始
    .ObserveOn(RxApp.MainThreadScheduler)   // 指定结果在哪个线程处理
```

示例：

```CS
var pipeline = Observable
    .Start(() => LoadData(), RxApp.TaskpoolScheduler)
    .ObserveOn(RxApp.MainThreadScheduler)
    .Subscribe(data =>
    {
        Items = data;  // 安全更新 UI
    });
```

#### 绑定



#### 单元测试



### 绑定命令

ReactiveUI（RxUI）的命令绑定是基于 **Rx.NET 流** 和 **WPF/XAML 绑定** 的强大结合。核心是 **`ReactiveCommand<TParam, TResult>`**，它不仅是一个命令，还是一个**可观察序列（Observable）**。

#### 核心概念：`ReactiveCommand`是一个流

在 RxUI 中，当我们调用一个命令时，我们实际上是**订阅**了一个事件流。这个流会推送以下三种信息：

1. **`Execute()`**：命令执行时，流开始。
2. **结果**：命令执行成功后，流推送 **`TResult`** 类型的结果。
3. **异常**：命令执行失败时，流推送异常到 `ThrownExceptions` 属性。

#### 关键绑定机制

RxUI 的命令绑定主要通过以下两个方面实现：

##### 在XAML中绑定

与标准 WPF 相同，你将控件的 `Command` 属性绑定到 ViewModel 中的 `ReactiveCommand` 属性。

```XAML
<Button Content="登录" 
        Command="{Binding LoginCommand}" 
        CommandParameter="{Binding ElementName=UsernameTextBox, Path=Text}" />
```

##### 在C#中创建和连接（响应式绑定）

这是 RxUI 优于传统命令的地方。命令的创建和状态管理都是**声明式**的，依赖于数据流。

1. 可执行性（`CanExecute`）的自动控制

RxUI 通过一个 `IObservable<bool>` 流来控制命令的 `CanExecute` 状态。当流中的布尔值改变时，UI 控件（如按钮）的启用/禁用状态会自动更新。

```CS
// 1. 定义一个控制流：只有用户名和密码都不为空时，流才推送 true
var canLogin = this.WhenAnyValue(
    x => x.Username, 
    x => x.Password, 
    (name, pass) => !string.IsNullOrWhiteSpace(name) && !string.IsNullOrWhiteSpace(pass)
);

// 2. 创建命令，并将控制流传入作为第二个参数
LoginCommand = ReactiveCommand.CreateFromTask(LoginAsync, canLogin);
```

2. 自动处理执行状态（`IsExecuting`）

对于异步命令（如 `CreateFromTask`），RxUI 会自动生成一个 `IsExecuting` 流。

- 当命令开始执行时 (`IsExecuting` 为 `true`)，它会自动禁用按钮，防止并发点击。
- 当异步任务完成后 (`IsExecuting` 为 `false`)，按钮会自动启用。

3. 绑定命令的输入和输出

`ReactiveCommand` 支持输入和输出类型。

- **输入 (`TParam`)**: 对应 XAML 中的 `CommandParameter`，它被传递给命令的执行方法。
  - **示例**：`ReactiveCommand<string, Unit>` 中的 `string`。
- **输出 (`TResult`)**: 命令执行完成后产生的结果，你可以通过订阅来处理它。

```CS
// 命令执行完成后，订阅结果流
LoginCommand.Execute()
    .Subscribe(result => 
    {
        // 登录成功后，处理结果，例如导航到主页
        this.HostScreen.Router.Navigate.Execute(new HomeViewModel());
    });
```

### 取消命令执行

#### 基本取消

最基本、最标准的取消命令执行的方法，是利用 .NET 任务并行库（TPL）的 **`CancellationToken`**。

当你使用 `ReactiveCommand.CreateFromTask` 或 `CreateFromObservable` 时，RxUI 会自动为你生成一个 `CancellationToken`，并在以下两种情况下触发取消：

1. **并发阻止 (Default)：** 当命令正在执行时，如果你尝试再次执行该命令，新的执行会被阻止，并且 RxUI 会自动触发 **前一个任务** 的取消。
2. **手动取消：** 通过 `Cancel()` 方法。

**实现步骤：**

1. **修改命令定义**：确保你的命令执行方法接受一个 `CancellationToken` 参数。

2. **在耗时任务中使用 `CancellationToken`**：在异步任务内部，检查 `cancellationToken.IsCancellationRequested` 状态，或将其传递给支持取消的 API（如 `HttpClient` 或 `Stream.CopyToAsync`）。

**示例：**

```CS
// 1. 命令接受 CancellationToken
public ReactiveCommand<Unit, Unit> LongRunningCommand { get; }

public MyViewModel()
{
    // 2. 使用 CreateFromTask 的重载，该重载会自动提供 CancellationToken
    LongRunningCommand = ReactiveCommand.CreateFromTask(ExecuteLongTaskAsync);
}

private async Task ExecuteLongTaskAsync(CancellationToken cancellationToken)
{
    try
    {
        Console.WriteLine("任务开始执行...");
        
        // 3. 在耗时操作中检查取消状态
        for (int i = 0; i < 10; i++)
        {
            cancellationToken.ThrowIfCancellationRequested(); // 检查是否请求取消，如果是，抛出 OperationCanceledException
            await Task.Delay(500, cancellationToken); // Task.Delay 本身支持取消
        }

        Console.WriteLine("任务完成。");
    }
    catch (OperationCanceledException)
    {
        // 捕获取消异常，进行清理
        Console.WriteLine("任务被取消！");
    }
}

// 触发取消：
// 当 LongRunningCommand.IsExecuting 为 true 时，调用 LongRunningCommand.Cancel().Execute().Subscribe();
```



#### 通过另一个可观测量抵消

Rx.NET 中一个非常强大的操作符是 **`TakeUntil`**，它允许一个主数据流持续推送数据，直到一个**信号流（`other` Observable）** 发出任何通知（`OnNext` 或 `OnCompleted`）。

在取消命令的场景中，你可以用 `TakeUntil` 来管理任何 `IObservable` 的生命周期，让它在某个条件（比如 ViewModel 被去激活、另一个命令执行）发生时自动停止订阅。

**应用场景**：在命令执行过程中，监听一个布尔属性的变化（例如，用户点击了一个“停止”按钮）来停止当前流。

**示例：**

```CS
public ReactiveCommand<Unit, Unit> StartProcessingCommand { get; }
public ReactiveCommand<Unit, Unit> StopProcessingCommand { get; }

public MyViewModel()
{
    // ...

    // 1. 定义一个信号流：当 StopProcessingCommand 被执行时，它会推送一个值
    var stopSignal = StopProcessingCommand.Execute();

    StartProcessingCommand = ReactiveCommand.CreateFromObservable(() => 
    {
        // 2. 创建一个长时流（例如，每秒生成一个数据）
        return Observable.Interval(TimeSpan.FromSeconds(1)) 
            .Select(i => $"Processing data {i}")
            .Do(Console.WriteLine)
            
            // 3. 使用 TakeUntil：当 stopSignal 流发出通知时，主流终止
            .TakeUntil(stopSignal) 
            
            // 4. 确保流在 UI 线程上开始，但 Execute 逻辑在后台
            .SubscribeOn(RxApp.TaskpoolScheduler) 
            
            // 5. 确保最终结果回到 UI 线程
            .ObserveOn(RxApp.MainThreadScheduler); 
    });
}
```



#### 与TPL的联动取消

`ReactiveCommand` 自身集成了一个方便的 `Cancel` 方法，用于与 TPL 的取消机制进行集成。

`command.Cancel().Execute().Subscribe()`

这是在 ReactiveUI 中**手动取消**正在执行的命令的标准模式：

- **`command.Cancel()`**：这不是立即取消操作，而是返回一个特殊的 `ReactiveCommand` 实例，它的作用就是触发命令的取消信号。
- **`.Execute()`**：执行这个特殊的“取消命令”，它会向原始命令正在执行的任务发送一个取消信号。
- **`.Subscribe()`**：订阅执行，触发取消。

**示例：**

```CS
public ReactiveCommand<Unit, Unit> DownloadFileCommand { get; }
public ReactiveCommand<Unit, Unit> CancelDownloadCommand { get; }

public MyViewModel()
{
    // 假设 DownloadFileCommand 已经实例化
    
    // 创建一个取消命令，用于在 XAML 中绑定到一个“取消”按钮
    CancelDownloadCommand = ReactiveCommand.CreateFromTask(async () =>
    {
        // 唯一要做的事就是执行 DownloadFileCommand 的 Cancel 信号
        await DownloadFileCommand.Cancel().Execute(); 
    });
    
    // 或者在另一个命令完成后自动取消
    SomeOtherCommand.Execute()
        .SelectMany(_ => DownloadFileCommand.Cancel().Execute())
        .Subscribe();
}
```

## 绑定

| 特性             | WPF Binding              | ReactiveUI Binding        |
| ---------------- | ------------------------ | ------------------------- |
| 写法             | XAML                     | C# 强类型                 |
| 类型安全         | 无                       | 有，编译期检查            |
| 生命周期         | 无需显式管理，但可能泄漏 | WhenActivated 自动释放    |
| 调试性           | 普通                     | 非常强                    |
| 绑定依赖多个属性 | 麻烦（MultiBinding）     | WhenAnyValue              |
| 转换器           | IValueConverter          | 任意 Lambda               |
| 命令绑定         | 标准 ICommand            | ReactiveCommand（更强大） |
| 异步/取消        | 不支持                   | 天然支持                  |

**常见绑定模式**

```CS
// 简单绑定
this.Bind(ViewModel, vm => vm.Text, v => v.TextBox.Text);

// 单向绑定
this.OneWayBind(ViewModel, vm => vm.Count, v => v.Label.Content);

// 带转换绑定
this.OneWayBind(ViewModel, vm => vm.Count, v => v.Label.Content, c => $"共 {c} 条数据");

// 命令绑定
this.BindCommand(ViewModel, vm => vm.RefreshCommand, v => v.RefreshButton);

// 动态判断绑定可用性
var canLogin = this.WhenAnyValue(
    x => x.UserName,
    x => x.Password,
    (u, p) => !string.IsNullOrEmpty(u) && !string.IsNullOrEmpty(p));

LoginCommand = ReactiveCommand.CreateFromTask(LoginAsync, canLogin);

// 列表绑定
this.OneWayBind(ViewModel, vm => vm.Items, v => v.ListView.ItemsSource);
```



### 数据绑定

ReactiveUI 的 Binding 是：

- 基于 **Rx 观察者模型（IObservable<T>）**
- 用代码显式声明
- 带有生命周期（IDisposable）
- 强类型（编译期安全）
- 与 View 激活（IActivatableViewModel）深度融合

ReactiveUI 绑定是“代码绑定”，而不是写在 XAML 中。

示例（最典型写法）：

```CS
this.WhenActivated(disposables =>
{
    this.Bind(ViewModel, vm => vm.Name, v => v.NameTextBox.Text)
        .DisposeWith(disposables);

    this.OneWayBind(ViewModel, vm => vm.Age, v => v.AgeTextBlock.Text)
        .DisposeWith(disposables);

    this.BindCommand(ViewModel, vm => vm.SubmitCommand, v => v.SubmitButton)
        .DisposeWith(disposables);
});
```

#### OneWayBind（单向绑定）

用于“View ← ViewModel”方向的绑定。

```CS
// 语法
this.OneWayBind(ViewModel,
    vm => vm.Property,
    v => v.Control.Property);
// 示例
this.OneWayBind(ViewModel, 
    vm => vm.UserName, 
    v => v.UserNameTextBlock.Text);
```

等价于WPF:

```XAML
<TextBlock Text="{Binding UserName}" />
```

更多复杂场景：

```CS
// 值转换
this.OneWayBind(ViewModel,
    vm => vm.Age,
    v  => v.AgeTextBlock.Text,
    vmAge => $"年龄：{vmAge}");

// 绑定列表到ItemSource
this.OneWayBind(ViewModel,
    vm => vm.Users,
    v  => v.UserListView.ItemsSource);
```

#### Bind（双向绑定）

用于 View 与 ViewModel 双向同步：

```CS
// 语法
this.Bind(ViewModel,
    vm => vm.Name,
    v => v.UserNameTextBox.Text);
```

功能：

- TextBox 修改 → vm.Name 修改
- vm.Name 修改 → TextBox 更新

ReactiveUI 会自动处理：

- TextChanged
- PropertyChanged
- 类型转换（必要时抛异常）

```CS
// 复杂转换示例
this.Bind(ViewModel,
    vm => vm.Count,
    v => v.CountTextBox.Text,
    vmToView: x => x.ToString(),
    viewToVM: text => int.Parse(text));
```

#### BindCommand（命令绑定）

```CS
this.BindCommand(ViewModel,
    vm => vm.SubmitCommand,
    v => v.SubmitButton);

// 若命令带参数
this.BindCommand(ViewModel,
    vm => vm.OpenCommand,
    v => v.OpenButton,
    x => SelectedItem);
```

### WhenAny/WhenAnyValue(驱动绑定)

**WhenAnyValue:属性变化流**

```CS
ViewModel.WhenAnyValue(x => x.Name)
    .Subscribe(name => Console.WriteLine(name));
```

**WhenAny:从多个属性组成可观察流**

```CS
ViewModel.WhenAnyValue(x => x.Age, x => x.IsVip)
    .Select(tuple => tuple.Age > 18 && tuple.IsVip)
    .Subscribe(canBuy => ... );
```

### 数据绑定生命周期（DisposeWith）

ReactiveUI 的绑定会生成 IDisposable; View 被销毁时必须解绑，否则会发生内存泄漏,所以要释放：

```CS
this.Bind(...).DisposeWith(disposables);
```

### WhenActivated托管绑定生命周期

最推荐写法（用于 Window/UserControl/Page）：

~~~CS
this.WhenActivated(disposables =>
{
    this.Bind(...).DisposeWith(disposables);
    this.OneWayBind(...).DisposeWith(disposables);
    this.BindCommand(...).DisposeWith(disposables);
});
~~~

WhenActivated 在：

- 页面加载时执行
- 页面卸载时自动 Dispose

### Hack命令绑定

ReactiveUI 的 `BindCommand` 默认只支持控件的 **默认事件**（如 `Button.Click`）。但很多场景下：

- 控件没有 `Command` 属性（如 `ListView`、`Image`）
- 需要绑定到非默认事件（如 `TextBox.KeyDown`、`Slider.ValueChanged`）
- 自定义控件或第三方库控件事件命名不规范
- 需要传递复杂参数（如当前行数据、鼠标位置）

此时，标准 `BindCommand` 不够用，就需要“Hack”。

#### 绑定到任意事件

这是最常用、也是 **官方支持** 的“Hack”方式。

```CS
this.BindCommand(
    ViewModel,
    vm => vm.DeleteCommand,
    v => v.ListView,        // 目标控件
    "SelectionChanged"      // 事件名称（字符串）
).DisposeWith(disposables);
```

> [!NOTE]
>
> 事件名是字符串，无编译时检查，需确保拼写正确。

**进阶：传递事件参数**

默认传递 `EventArgs`，但通常我们想要的是 **选中的项**。可通过 `ViewModel` 属性间接传递：

```CS
// 在 SelectionChanged 时更新 SelectedItem
this.WhenAnyValue(x => x.ListView.SelectedItem)
    .Where(item => item != null)
    .Subscribe(item => ViewModel.SelectedItem = item);

// 命令绑定到按钮（而非 ListView）
this.BindCommand(ViewModel, vm => vm.DeleteCommand, v => v.DeleteButton);
```

或者使用 `InvokeCommand`

#### 使用`InvokeCommand`手动触发命令

当事件无法直接绑定时，可手动在事件处理中调用命令。

```CS
// View.xaml.cs
private void Image_MouseDown(object sender, MouseButtonEventArgs e)
{
    ViewModel?.ClickImageCommand.Execute().Subscribe();
}
```

更好的方式是 **响应式地监听事件**：

```CS
this.Events().MouseDown // 假设使用 ReactiveUI.Events（需安装 ReactiveUI.Events.WPF 等）
    .InvokeCommand(this, x => x.ViewModel.ClickImageCommand)
    .DisposeWith(disposables);
```

> 🔌 需要安装对应平台的 **ReactiveUI.Events** 包：
>
> - `ReactiveUI.Events.WPF`
> - `ReactiveUI.Events.WinUI`
> - `ReactiveUI.Events.Avalonia`

#### 通过`Interaction`实现复杂交互

> [!tip]
>
> 推荐用于Dialog/Navigation

对于弹窗、导航等场景，ReactiveUI 提供了更优雅的 `Interaction<TInput, TOutput>`，但这不是“Hack”，而是 **最佳实践**。

```CS
// ViewModel
public Interaction<string, bool> ConfirmDialog { get; } = new();

// View
ViewModel.ConfirmDialog.RegisterHandler(async interaction =>
{
    var result = MessageBox.Show(interaction.Input, "确认？", MessageBoxButton.YesNo);
    interaction.SetOutput(result == MessageBoxResult.Yes);
});
```

#### 绑定到手势或键盘事件

示例：按ENTER提交表单

```CS
// 使用 ReactiveUI.Events.WPF
this.Events().KeyUp
    .Where(e => e.Key == Key.Enter)
    .InvokeCommand(this, x => x.ViewModel.SubmitCommand)
    .DisposeWith(disposables);
```

或不用 Events 包，手动订阅：

```CS
var keyUp = Observable.FromEventPattern<KeyEventHandler, KeyEventArgs>(
    h => textBox.KeyUp += h,
    h => textBox.KeyUp -= h)
    .Where(e => e.EventArgs.Key == Key.Enter);

keyUp.InvokeCommand(ViewModel.SubmitCommand)
     .DisposeWith(disposables);
```

> [!NOTE]
>
> 手动 `FromEventPattern` 较繁琐，推荐优先使用 `ReactiveUI.Events`。

#### 伪绑定：通过属性变更间接触发命令

适用于无法获取事件的场景（如某些第三方控件）。

```CS
// 假设第三方控件暴露一个 IsChecked 属性（但无 Checked 事件）
this.WhenAnyValue(x => x.ThirdPartyControl.IsChecked)
    .Where(isChecked => isChecked)
    .InvokeCommand(ViewModel.ToggleCommand)
    .DisposeWith(disposables);
```

> 本质：把属性变化当作“事件”来用。

### BindTo和Subscribe

**`BindTo`** 主要用于 **双向绑定**，特别是在 **ViewModel** 和 **UI 控件** 之间。它非常适用于 **UI 更新** 和 **自动同步**。

**`Subscribe`** 适用于 **响应式编程**，它用于 **响应数据流** 或 **属性变化**，通常用于执行特定的副作用操作，如日志记录、通知、执行异步任务等。

| 特性     | **`BindTo`**                                          | **`Subscribe`**                                      |
| -------- | ----------------------------------------------------- | ---------------------------------------------------- |
| 用途     | 将 ViewModel 的属性绑定到 UI 控件上，实现 UI 自动更新 | 订阅某个数据流或属性变化，并响应数据变化             |
| 适用场景 | 数据绑定，特别是 ViewModel 和 View 之间的绑定         | 响应数据变化，执行操作（如日志记录、异步任务、通知） |
| 绑定方式 | 双向绑定：UI 和 ViewModel 中的属性保持同步            | 单向订阅：响应数据变化时执行操作                     |
| 更新方式 | UI 控件会自动更新                                     | 需要显式地在订阅时定义操作                           |

#### BindTo

`BindTo` 是用于将 **属性** 或 **值** 绑定到 **UI 控件** 的方法。它是一个非常简洁的绑定方式，通常在 **ReactiveUI** 中和 **视图层（View）** 配合使用，来实现 **数据的自动更新**。

```CS
public class MyViewModel : ReactiveObject
{
    private string _name;
    public string Name
    {
        get => _name;
        set => this.RaiseAndSetIfChanged(ref _name, value);
    }
}
```

视图层绑定（XAML）:

```XAML
<TextBox Text="{Binding Name}" />
```

代码绑定（ReactiveUI）:

```csharp
public class MyView : ReactiveUserControl<MyViewModel>
{
    public MyView()
    {
        this.WhenActivated(disposables =>
        {
            this.BindTo(ViewModel, vm => vm.Name, v => v.NameTextBox.Text)
                .DisposeWith(disposables); // 绑定视图和 ViewModel 的 Name 属性
        });
    }
}
```

#### Subscribe

`Subscribe` 用于 **订阅数据流** 或 **观察某个属性的变化**，在 **ReactiveUI** 中，它用于 **响应数据变化**，并进行相应的操作。与 `BindTo` 不同，`Subscribe` 更加灵活，适用于需要 **处理事件** 或 **异步操作** 的场景。

```CS
public class MyViewModel : ReactiveObject
{
    private string _name;
    public string Name
    {
        get => _name;
        set => this.RaiseAndSetIfChanged(ref _name, value);
    }

    public MyViewModel()
    {
        // 订阅 Name 属性的变化
        this.WhenAnyValue(x => x.Name)
            .Subscribe(name => Console.WriteLine($"Name changed to: {name}"));
    }
}

```

#### 综合示例

假设我们需要在 `Name` 发生变化时，更新一个 `Label` 控件，并记录日志。这里我们既用到 `BindTo` 来更新 UI，也用到 `Subscribe` 来执行一些操作。

```CS
public class MyViewModel : ReactiveObject
{
    private string _name;
    public string Name
    {
        get => _name;
        set => this.RaiseAndSetIfChanged(ref _name, value);
    }

    public MyViewModel()
    {
        // 订阅 Name 属性变化，并执行操作（例如记录日志）
        this.WhenAnyValue(x => x.Name)
            .Subscribe(name => Console.WriteLine($"Name changed to: {name}"));
    }
}
```

XAML绑定：

```XAML
<TextBox Text="{Binding Name}" />
<TextBlock Text="{Binding Name}" />
```

视图层（Reactive UI）:

```CS
public class MyView : ReactiveUserControl<MyViewModel>
{
    public MyView()
    {
        this.WhenActivated(disposables =>
        {
            // 绑定 Name 到 TextBox 和 TextBlock
            this.BindTo(ViewModel, vm => vm.Name, v => v.NameTextBox.Text)
                .DisposeWith(disposables);
            this.BindTo(ViewModel, vm => vm.Name, v => v.NameTextBlock.Text)
                .DisposeWith(disposables);

            // 订阅 Name 属性变化并执行操作
            this.WhenAnyValue(vm => vm.Name)
                .Subscribe(name => Console.WriteLine($"Name changed: {name}"))
                .DisposeWith(disposables);
        });
    }
}
```

- `BindTo` 用于将 `ViewModel.Name` 和 `TextBox`、`TextBlock` 的 `Text` 属性绑定在一起，确保当 `Name` 发生变化时，UI 会自动更新。
- `Subscribe` 订阅 `Name` 属性的变化并执行 `Console.WriteLine`，这是用于响应式操作的方式。

## 数据持久性





## 默认异常处理程序

 如果一个异常在 `IObservable` 序列中被抛出，并且没有在流的末端（例如 `Subscribe` 的 `onError` 回调或 `ReactiveCommand.ThrownExceptions`）被捕获，这个异常通常会导致应用程序崩溃（取决于运行时环境）。

#### `RxApp.DefaultExceptionHandler`(全局兜底)

这是 ReactiveUI 提供的**全局未处理异常处理器**，用于捕获那些“逃逸”出响应式流的异常（如绑定错误、激活错误等）。

**设置方式（通常在`App.xaml.cs`或启动类中）**:

```CS
// Avalonia / WPF / MAUI 通用
RxApp.DefaultExceptionHandler = ex =>
{
    // 记录日志
    Console.WriteLine($"[Global Error] {ex}");

    // 显示用户友好提示（需调度到 UI 线程）
    Dispatcher.UIThread.InvokeAsync(() =>
    {
        MessageBox.Show($"发生错误：{ex.Message}", "错误");
    });

    // 返回 true 表示已处理；false 会 rethrow（可能导致崩溃）
    return true;
};
```

> > 📌 **适用场景**：
> >
> > - 绑定表达式错误（如属性路径不存在）
> > - `WhenActivated` 中的异常
> > - 自定义绑定转换器抛出异常
> >
> > ❗ 注意：**它不会捕获 Observable 流内部的异常**（那些应由 `Subscribe` 或 `ThrownExceptions` 处理）。

#### `ReactiveCommand.ThrownExceptions`（命令异常专用）

所有 `ReactiveCommand` 都暴露一个 `IObservable<Exception>` 属性 `ThrownExceptions`，用于监听执行过程中抛出的异常

示例：

```CS
public class MainViewModel : ReactiveObject
{
    public ReactiveCommand<Unit, string> LoadDataCommand { get; }

    public MainViewModel()
    {
        LoadDataCommand = ReactiveCommand.CreateFromTask(async () =>
        {
            // 模拟网络请求失败
            await Task.Delay(100);
            throw new InvalidOperationException("服务器无响应");
        });

        // 订阅异常（必须！）
        LoadDataCommand.ThrownExceptions
            .ObserveOn(RxApp.MainThreadScheduler)
            .Subscribe(ex =>
            {
                ErrorMessage = $"加载失败: {ex.Message}";
            });
    }

    private string _errorMessage;
    public string ErrorMessage
    {
        get => _errorMessage;
        set => this.RaiseAndSetIfChanged(ref _errorMessage, value);
    }
}
```

> [!TIP]
>
> - **每个 `ReactiveCommand` 都应订阅 `ThrownExceptions`**
> - 否则异常会被吞掉，用户不知道操作失败

#### `Subscribe(onError: ...)`（通用 Observable 异常处理）

对于任意 `IObservable<T>`，你可以在 `Subscribe` 时提供 `onError` 回调：

```CS
someObservable
    .ObserveOn(RxApp.MainThreadScheduler)
    .Subscribe(
        onNext: value => UpdateUI(value),
        onError: ex => HandleError(ex) // ← 关键！
    )
    .DisposeWith(disposables);
```

或者使用 `Catch` 操作符进行恢复：

```CS
someObservable
    .Catch(Observable.Return(default(T))) // 出错时返回默认值
    .Subscribe(value => ...);
```

### 常见异常场景与解决方案

| 场景                   | 异常来源                    | 推荐处理方式                                |
| ---------------------- | --------------------------- | ------------------------------------------- |
| **命令执行失败**       | `ReactiveCommand` 内部      | 订阅 `ThrownExceptions`                     |
| **绑定表达式错误**     | `OneWayBind` / `Bind`       | 全局 `RxApp.DefaultExceptionHandler`        |
| **异步流错误**         | `SelectMany`, `Merge`, etc. | `Subscribe(onError)` 或 `Catch`             |
| **ViewModel 激活错误** | `WhenActivated`             | `RxApp.DefaultExceptionHandler`             |
| **UI 线程外更新控件**  | 跨线程访问                  | 使用 `ObserveOn(RxApp.MainThreadScheduler)` |

### 最佳实践

#### 始终设置全局异常处理器

```CS
// Program.cs 或 App.xaml.cs
public override void OnFrameworkInitializationCompleted()
{
    // 设置全局异常处理器
    RxApp.DefaultExceptionHandler = ex =>
    {
        Log.Error(ex, "Unhandled exception in ReactiveUI");
        
        // 可选：上报 Sentry/AppCenter
        // Telemetry.TrackException(ex);

        // 用户提示（谨慎：避免频繁弹窗）
        if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
        {
            // 显示一次错误提示
        }

        return true; // 阻止 rethrow
    };

    // ... 初始化主窗口
}
```

#### 为所有命令订阅 ThrownExceptions

```CS
// 可封装为扩展方法
public static class CommandExtensions
{
    public static void LogThrownExceptions(this ReactiveCommandBase command, string commandName)
    {
        command.ThrownExceptions.Subscribe(ex =>
        {
            Log.Error(ex, "Command failed: {Command}", commandName);
            // 可触发全局通知
        });
    }
}

// 使用
LoadDataCommand.LogThrownExceptions(nameof(LoadDataCommand));
```

#### 避免在流中抛出异常（优先返回 Result/Option）

```CS
// 更函数式的做法：不抛异常，返回错误信息
var result = await TryLoadData();
if (result.IsSuccess)
    Data = result.Value;
else
    ErrorMessage = result.Error;
```



## 依赖注入

ReactiveUI支持的DI容器:

| 容器                                                 | 特点                        | 推荐场景                                     |
| ---------------------------------------------------- | --------------------------- | -------------------------------------------- |
| **Microsoft.Extensions.DependencyInjection (MS.DI)** | .NET 官方、轻量、跨平台     | ✅ **首选**（Avalonia/WPF/MAUI/ASP.NET Core） |
| **Splat**                                            | ReactiveUI 内置（旧版默认） | 小型项目或遗留代码                           |
| **Autofac**                                          | 功能强大、模块化            | 大型复杂应用                                 |
| **DryIoc / Ninject**                                 | 第三方，性能好              | 特定需求                                     |

### Splat

**Splat** 是 ReactiveUI 推荐使用的默认 DI/服务定位器库。它的设计目标是提供一个轻量级、跨平台的通用抽象层，让你可以在任何 .NET DI 容器上运行 ReactiveUI。

Splat 的核心接口是 `IMutableDependencyResolver`，它负责服务的注册和解析。

#### 注册服务

使用 `Splat.Locator.CurrentMutable` 来注册你的 ViewModel、Service 或其他接口的实现。

| **注册方法**                                                 | **描述**                                         | **对应的 DI 生命周期** |
| ------------------------------------------------------------ | ------------------------------------------------ | ---------------------- |
| **`RegisterLazySingleton<TContract, TImplementation>()`**    | 注册为单例。第一次请求时创建实例，之后重复使用。 | Singleton (单例)       |
| **`Register<TContract, TImplementation>()`**                 | 注册为每次请求都创建新实例。                     | Transient (瞬时)       |
| **`RegisterLazySingleton<TContract>(Func<TContract> func)`** | 使用工厂函数进行懒加载单例注册。                 | Singleton (单例)       |

示例：

```CS
using Splat;

public static class Locator
{
    public static void RegisterServices()
    {
        // 注册服务（单例模式）
        Locator.CurrentMutable.RegisterLazySingleton<IUserService>(() => new UserService());

        // 注册 ViewModel（每次请求都创建新实例）
        Locator.CurrentMutable.Register<LoginViewModel>();

        // 注册 View 和 ViewModel 之间的接口，供路由系统使用
        Locator.CurrentMutable.Register(() => new LoginView(), typeof(IViewFor<LoginViewModel>));
    }
}
```

#### 解析服务

使用 `Splat.Locator.Current` 或直接使用 **构造函数注入** 来获取服务实例。

示例：

```CS
using Splat;
// 构造函数注入 (推荐)
public class LoginViewModel : ReactiveObject
{
    private readonly IUserService _userService;

    // Splat/DI 容器会自动提供 IUserService 的实例
    public LoginViewModel(IUserService userService)
    {
        _userService = userService;
        // ...
    }
}

// 服务定位器 (不推荐，但可用)
public void SomeMethod()
{
    var userService = Locator.Current.GetService<IUserService>();
}
```



## 事件

ReactiveUI 中，处理 UI 控件的 **事件（Events）** 并不像传统 MVVM 那样通过 `ICommand` 绑定所有交互（因为不是所有事件都有 Command 属性），而是借助 **Reactive Extensions (Rx)** 将 .NET 事件转换为 **`IObservable<T>` 流**，从而以响应式、声明式的方式处理用户交互。

**核心思想：事件->Observable**

传统方式（不推荐）：

```CS
button.Click += (s, e) => ViewModel.DoSomething();
```

ReactiveUI方法（推荐）：

```CS
this.Events().Click
    .InvokeCommand(this, x => x.ViewModel.MyCommand);
// 或
this.Events().Click
    .Subscribe(_ => DoSomething());
```

> **优势**：
>
> - 自动生命周期管理（配合 `WhenActivated` + `DisposeWith`）
> - 可组合（`Throttle`, `Merge`, `Switch` 等 Rx 操作符）
> - 类型安全（无 `EventArgs` 强转）

**安装平台对应的事件包**

| 平台         | NuGet 包                     |
| ------------ | ---------------------------- |
| **Avalonia** | `ReactiveUI.Events.Avalonia` |
| **WPF**      | `ReactiveUI.Events.WPF`      |
| **WinForms** | `ReactiveUI.Events.WinForms` |
| **MAUI**     | `ReactiveUI.Events.Maui`     |

```BASH
# Avalonia 示例
dotnet add package ReactiveUI.Events.Avalonia
```

**基本用法（Avalonia）**

1. 在View中启用事件流

```CS
public partial class MainWindow : ReactiveWindow<MainViewModel>
{
    public MainWindow()
    {
        InitializeComponent();

        this.WhenActivated(disposables =>
        {
            // 方法 1：触发命令（推荐）
            this.Events().PointerPressed
                .InvokeCommand(this, x => x.ViewModel.PointerPressedCommand)
                .DisposeWith(disposables);

            // 方法 2：直接订阅（适合非命令逻辑）
            this.Events().KeyDown
                .Where(e => e.Key == Key.F5)
                .Subscribe(_ => ViewModel.Refresh())
                .DisposeWith(disposables);

            // 方法 3：获取事件参数
            MyTextBox.Events().TextChanged
                .Select(e => e.Text)
                .Throttle(TimeSpan.FromMilliseconds(300))
                .ObserveOn(RxApp.MainThreadScheduler)
                .Subscribe(text => ViewModel.SearchQuery = text)
                .DisposeWith(disposables);
        });
    }
}
```

2. 常见事件映射表（Avalonia）

| 控件事件                   | ReactiveUI 事件属性 | 发射值类型                 |
| -------------------------- | ------------------- | -------------------------- |
| `Button.Click`             | `.Click`            | `Unit`                     |
| `TextBox.TextChanged`      | `.TextChanged`      | `string`（已提取 `.Text`） |
| `Slider.ValueChanged`      | `.ValueChanged`     | `double`                   |
| `Window.Closing`           | `.Closing`          | `WindowClosingEventArgs`   |
| `ListBox.SelectionChanged` | `.SelectionChanged` | `IList<object>`            |

> 💡 ReactiveUI 会**自动提取有用数据**（如 `TextChanged` 直接返回 `string`，而非 `TextChangedEventArgs`）。

**高级用法示例：**

1. 组合多个事件

```CS
// 按下 Ctrl+S 保存
this.Events().KeyDown
    .Where(e => e.Key == Key.S && e.Modifiers.HasFlag(KeyModifiers.Control))
    .InvokeCommand(this, x => x.ViewModel.SaveCommand)
    .DisposeWith(disposables);
```

2. 防抖搜索(基于TextChanged)

```CS
SearchBox.Events().TextChanged
    .Throttle(TimeSpan.FromMilliseconds(400), RxApp.MainThreadScheduler)
    .Select(text => text?.Trim())
    .DistinctUntilChanged()
    .Where(text => !string.IsNullOrEmpty(text))
    .InvokeCommand(this, x => x.ViewModel.SearchCommand)
    .DisposeWith(disposables);
```

3. 窗口关闭确认

```CS
this.Events().Closing
    .Subscribe(async e =>
    {
        if (ViewModel.HasUnsavedChanges)
        {
            var result = await MessageBox.Show("有未保存更改，确定退出？", "确认", MessageBoxType.YesNo);
            if (result != MessageBoxResult.Yes)
                e.Cancel = true; // 取消关闭
        }
    })
    .DisposeWith(disposables);
```

> [!NOTE]
>
> `Closing` 事件需在 UI 线程处理，且不能异步 `await` 后再设 `e.Cancel`（Avalonia/WPF 限制）。
> 解决方案：使用同步对话框，或提前监听内容变化设置 `HasUnsavedChanges`。

**自定义控件事件支持**

如果你的控件有自定义事件，可手动创建 Observable：

```CS
public static class MyControlEvents
{
    public static IObservable<Unit> CustomEvent(this MyControl control) =>
        Observable.FromEventPattern(control, nameof(MyControl.CustomEvent))
                  .Select(_ => Unit.Default);
}

// 使用
myControl.CustomEvent()
    .Subscribe(_ => Console.WriteLine("Custom event fired!"));
```

**对比ICommand**

| 方式                             | 适用场景                                                     | 优点                | 缺点             |
| -------------------------------- | ------------------------------------------------------------ | ------------------- | ---------------- |
| **`BindCommand`**                | `Button.Command`、`MenuItem.Command` 等原生支持 Command 的控件 | 简洁、自动启用/禁用 | 仅限特定控件     |
| **`Events().XXX.InvokeCommand`** | 所有事件（双击、拖拽、键盘等）                               | 灵活、全事件覆盖    | 需额外 NuGet 包  |
| **`Events().XXX.Subscribe`**     | 非命令逻辑（如日志、状态更新）                               | 完全控制            | 需手动管理副作用 |

> 🎯 **原则**：
>
> - 能用 `BindCommand` 就用（语义清晰）
> - 其他事件用 `Events().XXX`

**生命周期管理**

所有事件订阅必须放在 `WhenActivated` 中，并调用 `.DisposeWith(disposables)`，否则会导致：

- 内存泄漏（View 无法释放）
- 重复订阅（多次激活后事件触发多次）

```CS
this.WhenActivated(disposables =>
{
    this.Events().Click
        .Subscribe(...)
        .DisposeWith(disposables); // ← 必须！
});
```



























































