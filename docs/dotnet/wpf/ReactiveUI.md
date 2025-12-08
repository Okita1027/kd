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
order: 5
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



#### 控制调度



#### 绑定



#### 单元测试



### 绑定命令



### 取消





## 数据绑定



## 数据持久性



## 默认异常处理程序



## 依赖注入





## 设计时





## 事件