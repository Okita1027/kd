---
title: ReactiveX
shortTitle: ReactiveX
description: ReactiveX
date: 2025-12-11 11:33:33
categories: [.NET, WPF]
tags: [.NET]
header: [1, 5]
author:
  name: Okita
  url: https://zhiyun.space
  email: 2368932388@qq.com
order: 6
---

> [ReactiveX文档中文翻译](https://mcxiaoke.gitbooks.io/rxdocs/content/)

## Observable

### `Observable<T>`

`IObservable<T>` 是一个**泛型接口**，表示一个可以被观察的数据源。它不主动执行任何逻辑，直到有观察者订阅它。

```CS
public interface IObservable<out T>
{
    IDisposable Subscribe(IObserver<T> observer);
}
```

- **`T`**：流中推送的数据类型（如 `string`、`int`、`User`）
- **`Subscribe`**：启动流的“开关”，返回 `IDisposable` 用于取消订阅

> 💡 类比：
>
> - `IEnumerable<T>`：**拉取式**集合（你主动 `foreach`）
> - `IObservable<T>`：**推送式**集合（数据主动推给你）

### 观察者`IObservable<T>`

观察者定义了如何响应流中的三种信号：

```CS
public interface IObserver<in T>
{
    void OnNext(T value);      // 接收到一个数据项
    void OnError(Exception error); // 流发生错误（终止）
    void OnCompleted();        // 流正常结束（终止）
}
```

> **关键规则**：
>
> 1. 一个流**只能调用一次 `OnError` 或 `OnCompleted`**
> 2. 调用 `OnError`/`OnCompleted` 后，**不能再调用 `OnNext`**
> 3. 流**必须终止**（要么成功完成，要么出错）

### Observable的冷与热

| 特性         | 冷 Observable（Cold）                      | 热 Observable（Hot）               |
| ------------ | ------------------------------------------ | ---------------------------------- |
| **执行时机** | 每次订阅时**重新开始**                     | **共享**同一个数据源               |
| **副作用**   | 多次订阅 → 多次执行（如多次 HTTP 请求）    | 多次订阅 → 共享结果                |
| **典型来源** | `Observable.Return`, `FromAsync`, `Create` | `Subject<T>`, UI 事件, `Publish()` |
| **适用场景** | 一次性操作（API 调用）                     | 广播事件（鼠标移动、传感器数据）   |

❄️ 冷流：每次订阅都重新执行

```CS
var cold = Observable.Create<int>(obs =>
{
    Console.WriteLine("Executing...");
    obs.OnNext(42);
    obs.OnCompleted();
    return Disposable.Empty;
});

cold.Subscribe(x => Console.WriteLine($"A: {x}"));
cold.Subscribe(x => Console.WriteLine($"B: {x}"));

// 输出：
// Executing...
// A: 42
// Executing...
// B: 42
```

🔥 热流：共享执行结果

```CS
var hot = cold.Publish().RefCount(); // 转为热流

hot.Subscribe(x => Console.WriteLine($"A: {x}"));
hot.Subscribe(x => Console.WriteLine($"B: {x}"));

// 输出：
// Executing...
// A: 42
// B: 42
```





## Single



## Subject



## Scheduler



## Operators Categories

### Creating创建

| 操作符          | 是否冷流 | 是否完成     | 是否无限 | 典型用途      |
| --------------- | -------- | ------------ | -------- | ------------- |
| `Create`        | ✅        | 取决于实现   | 可能     | 自定义源      |
| `Defer`         | ✅        | 取决于内部流 | 可能     | 延迟评估      |
| `Empty`         | ✅        | ✅            | ❌        | 空流占位      |
| `Never`         | ✅        | ❌            | ✅        | 永不结束      |
| `Throw`         | ✅        | ✅（错误）    | ❌        | 错误模拟      |
| `FromAsync`     | ✅        | ✅            | ❌        | 异步转流      |
| `Interval`      | ❌（热）  | ❌            | ✅        | 定时器        |
| `Return` (Just) | ✅        | ✅            | ❌        | 单值流        |
| `Range`         | ✅        | ✅            | ❌        | 整数序列      |
| `Repeat`        | ✅        | 取决于次数   | 可能     | 重复值        |
| `Start`         | ✅        | ✅            | ❌        | 后台计算      |
| `Timer`         | ❌（热）  | 取决于重载   | 可能     | 延迟/周期任务 |

**注意事项**

1. 冷流VS热流陷阱

```CS
// ❌ 危险：每次订阅都发起新 HTTP 请求！
var apiCall = Observable.FromAsync(FetchData);
apiCall.Subscribe(...); // 请求1
apiCall.Subscribe(...); // 请求2 ← 可能不是你想要的！

// ✅ 安全：转为热流共享结果
var sharedApiCall = apiCall.Publish().RefCount();
```

2. 线程问题

- `Interval`/`Timer` 默认不在 UI 线程
- 更新 UI 必须用 `ObserveOn(RxApp.MainThreadScheduler)`

3. 资源泄露

- 无限流（`Interval`, `Never`）必须手动 `Dispose`
- 在 ReactiveUI 中用 `WhenActivated` + `DisposeWith`

#### Create

**作用：** 从头开始创建一个自定义的 Observable 序列。

**原理：** 允许您手动定义当有人订阅时，Observable 应该如何推送 `OnNext`、`OnError` 和 `OnCompleted` 通知，并返回一个 `IDisposable` 来处理取消订阅时的清理工作。

**特点：** 这是最灵活但也是最底层的方法。通常用于将不支持 Rx 的传统 API（如自定义事件）包装成 Rx 流。

```CS
Observable.Create<int>(observer =>
{
    observer.OnNext(1);
    observer.OnCompleted();
    return Disposable.Empty; // 返回清理资源的对象
});
```

#### Defer

**作用：** 延迟 Observable 的创建，直到有 Observer 订阅时才创建。

**原理：** 每次订阅时，它都会调用一个工厂函数来创建一个**新的** Observable 序列。

**特点：** 保证了每个订阅者都能够接收到一个“新鲜”的、最新的数据序列。这对于执行昂贵的初始化操作或希望在订阅时使用最新上下文（例如当前时间）非常有用。

```CS
// 每次订阅都会重新创建一个 Observable，并使用当时的时间
var deferred = Observable.Defer(() => 
    Observable.Just(DateTime.Now) 
);
```

#### Empty/Never/Throw

| **操作符**  | **行为**                 | **描述**                                       | **应用场景**                             |
| ----------- | ------------------------ | ---------------------------------------------- | ---------------------------------------- |
| **`Empty`** | 立即发送 `OnCompleted`。 | 流中不发送任何数据。                           | 作为某些操作符的输入，用于表示“无操作”。 |
| **`Never`** | 永远不发送任何通知。     | 流永远不会终止，也不会发送数据。               | 占位符或用于测试永不完成的场景。         |
| **`Throw`** | 立即发送 `OnError`。     | 流中不发送数据，而是立即抛出指定的异常并终止。 | 模拟失败或错误条件。                     |

```CS
using System;
using System.Reactive.Linq;

class Program
{
    public static void Main()
    {
        // Empty 示例
        var emptyObservable = Observable.Empty<int>();
        emptyObservable.Subscribe(
            value => Console.WriteLine($"Received: {value}"),
            error => Console.WriteLine($"Error: {error.Message}"),
            () => Console.WriteLine("Completed!")  // 会立即输出“Completed！”
        );

        // Never 示例
        var neverObservable = Observable.Never<int>();
        neverObservable.Subscribe(
            value => Console.WriteLine($"Received: {value}"),
            error => Console.WriteLine($"Error: {error.Message}"),
            () => Console.WriteLine("Completed!")  // 不会输出任何内容
        );

        // Throw 示例
        var throwObservable = Observable.Throw<int>(new Exception("An error occurred"));
        throwObservable.Subscribe(
            value => Console.WriteLine($"Received: {value}"),
            error => Console.WriteLine($"Error: {error.Message}")  // 会输出错误信息
        );
    }
}
```

#### From

**作用：** 将其他类型的数据结构或异步操作转换为 Observable 序列。

**原理：** Rx.NET 中的 `From` 通常是各种转换方法的别名或重载，例如：

- **`From<IEnumerable<T>>`：** 遍历集合，将每个元素作为 `OnNext` 发送，然后发送 `OnCompleted`。
- **`FromAsync<Task<T>>`：** 运行 Task，在 Task 完成后发送单个值，然后发送 `OnCompleted`（或在 Task 失败时发送 `OnError`）。

```CS
using System;
using System.Reactive.Linq;

class Program
{
    public static void Main()
    {
        // 从数组创建 Observable
        var observable = Observable.FromArray(new[] { 1, 2, 3, 4, 5 });
        observable.Subscribe(value => Console.WriteLine($"Received: {value}"));

        // 从集合创建 Observable
        var list = new System.Collections.Generic.List<int> { 10, 20, 30 };
        var listObservable = Observable.FromEnumerable(list);
        listObservable.Subscribe(value => Console.WriteLine($"Received: {value}"));
    }
}

```

#### Interval

**作用：** 创建一个周期性发送递增整数的 Observable 序列。

**原理：** 按照指定的时间间隔，从 0 开始，每隔一段时间发送 `OnNext(n)`。流会持续无限期运行（除非被取消订阅）。

**特点：** 用于实现计时器、周期性轮询等功能。

```CS
// 每隔 1 秒发送 0, 1, 2, 3...
var timer = Observable.Interval(TimeSpan.FromSeconds(1));
```

#### Just

**作用：** 创建一个只发射一个特定值的 Observable 序列。

**原理：** 发送一个 `OnNext(value)` 通知，然后立即发送 `OnCompleted` 通知并终止。

**特点：** 是创建单值流的最简单方法。

```CS
// 发送字符串 "Hello" 一次，然后完成
var singleValue = Observable.Just("Hello");
```

#### Range

**作用：** 创建一个发射一系列连续整数的 Observable 序列。

**原理：** 指定起始值和总数，按顺序发送这些整数，然后发送 `OnCompleted`。

**特点：** 类似于循环，但以响应式流的形式呈现。

```CS
// 发送整数 5, 6, 7, 8, 9 (从 5 开始，共 5 个数)
var rangeStream = Observable.Range(5, 5);
```

#### Repeat

**作用：** 创建一个重复发射特定序列的 Observable 序列。

**原理：** 接受一个数据源 Observable，并按需重复订阅和发射其值。可以指定重复的次数，或者无限重复。

```CS
// 重复发送 "Go" 字符串 3 次
var repeated = Observable.Repeat("Go", 3); // 序列: Go, Go, Go (然后完成)
```

#### Start

**作用：** 将一个同步方法转换为一个 Observable 序列。

**原理：** 在后台线程（默认使用 `Scheduler.Default`）上执行指定的同步方法，方法返回后，将结果作为 `OnNext` 发送，然后发送 `OnCompleted`。

**特点：** 简化了将耗时的、无返回值的同步操作转移到后台的操作。

```CS
// 在后台线程执行同步方法，完成后发送结果 42
var backgroundTask = Observable.Start(() =>
{
    Thread.Sleep(2000);
    return 42; 
});
```

#### Timer

**作用：** 创建一个在指定时间后发送单个值或周期性发送值的 Observable 序列。

**原理：**

- **单次延迟：** 指定一个延迟时间，在该时间过后发送 `OnNext(0)`，然后发送 `OnCompleted`。
- **周期性：** 指定一个初始延迟和一个周期性间隔，在初始延迟后发送 `OnNext(0)`，之后每隔一个间隔时间发送 `OnNext(1), OnNext(2)...`。

**特点：** 实现延时操作或周期性任务。

```CS
// 延迟 5 秒后发送单个 0，然后完成
var delayed = Observable.Timer(TimeSpan.FromSeconds(5));
```

### Transforming变换

> [!NOTE]
>
> **“变换操作符不是改变数据，而是改变你观察数据的方式。”**

| 操作符                 | 输入 → 输出                           | 是否改变流结构 | 典型用途 |
| ---------------------- | ------------------------------------- | -------------- | -------- |
| `Select` (Map)         | `T → R`                               | ❌（1:1）       | 数据转换 |
| `SelectMany` (FlatMap) | `T → IObservable<R>` → `R`            | ✅（打平）      | 嵌套异步 |
| `Scan`                 | `(Acc, T) → Acc`                      | ❌（1:1）       | 累积状态 |
| `Buffer`               | `T → IList<T>`                        | ✅（批量）      | 批处理   |
| `Window`               | `T → IObservable<T>`                  | ✅（分段流）    | 分段处理 |
| `GroupBy`              | `T → (Key, T)` → `IGroupedObservable` | ✅（分组流）    | 分类处理 |

#### Map/Select

**作用：** 对源 Observable 发射的每一个数据项应用一个函数，并返回一个发射转换后数据项的 Observable。

**原理：** 类似于 LINQ 中的 `Select` 语句或 JavaScript 数组中的 `map()` 方法。它执行一对一的转换。

**特点：** 不改变流的结构，只改变流中元素的类型或值。

**示例：** 将一个整数流转换为一个字符串流。

```CS
Observable.Range(1, 3) // 序列: 1, 2, 3
    .Select(x => $"Item {x}") 
    // 结果序列: "Item 1", "Item 2", "Item 3"
```

#### FlatMap/SelectAny

**作用：** 将源 Observable 发射的每个数据项转换成一个**新的 Observable**，然后将这些新的 Observable 的发射物**合并**（Flatten）到最终的单个 Observable 中。

**原理：** 类似于 LINQ 中的 `SelectMany`。它处理“Observable 的 Observable”问题，是处理异步操作序列（如发起多个 API 调用）的首选操作符。

**特点：**

- **展开结构：** 可以将一个数据项展开成零个、一个或多个数据项。
- **处理异步：** 保证了异步操作的执行顺序和并发性。

**示例：** 监听用户点击，每次点击触发一个异步的网络请求流，并将所有请求的结果合并到一个流中。

```CS
clicks.SelectMany(click => ApiClient.FetchDataAsync()) 
// 结果流是所有 FetchDataAsync 返回数据的扁平序列。
```

#### Buffer

**作用：** 周期性地将源 Observable 的发射物收集到缓存（Buffer）中，然后将这些缓存作为列表（`IList<T>`）发射出去。

**原理：** 将多个单独的数据项“打包”成批。

**特点：** 主要用于批量处理数据、限速或网络批处理。

```CS
using System;
using System.Reactive.Linq;

class Program
{
    public static void Main()
    {
        var observable = Observable.Range(1, 10);

        // 使用 Buffer 操作符，按每 3 个元素为一组进行分组
        observable.Buffer(3).Subscribe(
            group => {
                Console.WriteLine("New Group:");
                foreach (var item in group)
                {
                    Console.WriteLine(item);
                }
            }
        );
    }
}
```

```CS
New Group:
1
2
3
New Group:
4
5
6
New Group:
7
8
9
New Group:
10
```

**`Buffer`** 将输入流中的数据分组，每组最多包含 `3` 个元素。当输入流结束时，剩余的数据也会以一个缓冲区的形式发送。

#### GroupBy

```CS
using System;
using System.Reactive.Linq;

class Program
{
    public static void Main()
    {
        var observable = Observable.Range(1, 10);

        // 使用 GroupBy 按照数值的奇偶性进行分组
        observable.GroupBy(x => x % 2 == 0 ? "Even" : "Odd").Subscribe(
            group => {
                Console.WriteLine($"Group: {group.Key}");
                group.Subscribe(value => Console.WriteLine($"  {value}"));
            }
        );
    }
}

```

> - 每个分组是一个**热流**（一旦创建就开始发射）
> - 需要主动订阅每个分组，否则数据会丢失！

#### Scan

**作用：** 连续地对 Observable 发射的每一个数据项应用一个函数，然后将函数的结果作为下一次调用的**累积值（Accumulator）**。

**原理：** 类似于函数式编程中的 `Reduce` 或 `Fold` 操作，但 `Scan` 的独特之处在于它会**立即**发射每次累积的结果。

**特点：** 非常适合计算运行总计、历史记录或维护随时间演变的状态。

**示例：** 计算一个数字流的运行总和。

```CS
Observable.Range(1, 5) // 序列: 1, 2, 3, 4, 5
    .Scan(0, (acc, next) => acc + next) 
    // 结果序列: 1, 3, 6, 10, 15
```

#### Window

**作用：** 类似于 `Buffer`，但它发射的是 **Observable 的 Observable**，而不是 `IList<T>` 列表。

**原理：** 周期性地打开一个“窗口”（新的 Observable），将源 Observable 的数据项放入该窗口，当窗口关闭时，发射该窗口（即内部 Observable）。

**特点：** 更适用于复杂的、流中流的操作。例如，你需要对一个时间窗口内的数据执行聚合操作（如求和、计数），而不需要等待整个列表收集完成。

**示例：** 每 1 秒创建一个新的 Observable 窗口，然后你可以订阅这个内部窗口来处理该秒内的数据。

```CS
dataStream.Window(TimeSpan.FromSeconds(1))
    .SelectMany(window => window.Count()) // 对每个窗口内的元素进行计数
    .Subscribe(count => Console.WriteLine($"Last second had {count} items"));
```

### Filtering过滤

| 操作符                | 行为       | 是否需要流结束 | 内存影响         | 典型用途         |
| --------------------- | ---------- | -------------- | ---------------- | ---------------- |
| `Where`               | 条件过滤   | ❌              | 低               | 数据筛选         |
| `Throttle` (Debounce) | 防抖       | ❌              | 低               | 搜索、防连点     |
| `Distinct`            | 去重       | ❌              | 中（需缓存历史） | 避免重复         |
| `ElementAt`           | 取第N项    | ✅（若不足）    | 低               | 精确索引         |
| `First`/`Last`        | 取首/尾    | `Last` 需要    | `Last` 高        | 初始化/收尾      |
| `IgnoreElements`      | 丢弃数据   | ❌              | 极低             | 副作用信号       |
| `Sample`              | 定期采样   | ❌              | 低               | 降频更新         |
| `Skip`/`Take`         | 跳过/取前N | ❌              | 低               | 分页、跳过初始值 |
| `SkipLast`/`TakeLast` | 跳过/取后N | ✅              | 高（缓存全部）   | 日志尾部         |

#### Debounce/Throttle

**作用：** 仅发射在一个指定时间段内没有紧跟其他发射的数据项。

**原理：** 在源 Observable 发射一个值后，它会等待一段指定的时间。如果在这段时间内没有新的值发射，它就发射这个值；如果新的值发射了，它就丢弃前一个值并重新计时。

**特点：** 是处理**快速输入**和**限流**的首选操作符。例如，在用户停止输入时才触发搜索，而不是每次按键都触发。

**示例：** 在用户停止输入 500 毫秒后才处理搜索词。

```CS
inputKeyStream.Throttle(TimeSpan.FromMilliseconds(500))
```

#### Distinct/DistinctUntilChanged

**作用：** 抑制（Supress）源 Observable 中发射的**重复**数据项。

**原理：** Rx 中更常用的是 `DistinctUntilChanged`，它只在当前数据项与前一个发射的数据项不同时才允许通过。

**特点：** 对于处理用户界面事件（如防止属性的连续相同赋值）非常有用。

**示例：** 只有当新的 `SearchTerm` 与上一次的不同时才进行搜索。

```CS
searchTermStream.DistinctUntilChanged()
```

#### Filter/Where

**作用：** 仅发射源 Observable 中满足指定条件的元素。

**原理：** 类似于 LINQ 中的 `Where` 语句。它接收一个谓词函数（返回 `bool`），只允许返回 `true` 的数据通过。

**示例：** 仅接收大于 10 的整数。

```CS
dataStream.Where(x => x > 10)
```

#### 元素定位

| **操作符**      | **作用**                                                     | **行为**                                      | **失败时行为**                             |
| --------------- | ------------------------------------------------------------ | --------------------------------------------- | ------------------------------------------ |
| **`First`**     | 仅发射源 Observable 发射的**第一个**数据项（或满足条件的第一个）。 | 找到后立即发送 `OnNext`，然后 `OnCompleted`。 | 如果源序列完成但没有找到元素，会抛出异常。 |
| **`Last`**      | 仅发射源 Observable 发射的**最后一个**数据项。               | 必须等待流 `OnCompleted` 后才发射。           | 如果源序列完成但为空，会抛出异常。         |
| **`ElementAt`** | 仅发射源 Observable 在指定**索引**（从 0 开始）处的数据项。  | 找到后发送 `OnNext`，然后 `OnCompleted`。     | 如果源序列在到达索引前完成，会抛出异常。   |

##### First

发出第一个符合条件的元素，没有则抛异常。

| 方法                             | 行为               |
| -------------------------------- | ------------------ |
| `FirstAsync()`                   | 发射第一个值后完成 |
| `FirstOrDefaultAsync(T default)` | 若无值，返回默认值 |

```CS
// 获取首个匹配用户
users.Where(u => u.Age > 18)
     .FirstAsync()
     .Subscribe(u => Console.WriteLine(u.Name));

// 安全获取（可能为空）
users.FirstOrDefaultAsync(null)
     .Subscribe(u => { if (u != null) ... });
```

##### Last

| 方法                            | 行为                       |
| ------------------------------- | -------------------------- |
| `LastAsync()`                   | 等待流结束后发射最后一个值 |
| `LastOrDefaultAsync(T default)` | 若无值，返回默认值         |

##### ElementAt

只发射第 N 个元素（从 0 开始）

```CS
// 获取第 3 个用户（索引=2）
users.ElementAt(2)
      .Subscribe(user => Console.WriteLine(user.Name));
```

> - 如果流在到达索引前结束 → 抛出 `ArgumentOutOfRangeException`
> - 如果发生错误 → 传递错误

#### IgnoreELements

**作用：** 抑制源 Observable 发射的所有数据项，但允许其 `OnError` 和 `OnCompleted` 通知通过。

**原理：** 只关心流是否成功或失败地完成，不关心中间值。

```CS
dataStream.IgnoreElements()
    .Subscribe(
        onNext: x => {}, // 永远不会被调用
        onCompleted: () => Console.WriteLine("Stream Finished")
    );
```

#### Sample

**作用：** 周期性地查看源 Observable，并发射自从上次取样以来它所发射的**最新**数据项。

**原理：** 类似于定时器。它在指定的时间间隔内只取最新的数据。

**特点：** 用于降低数据流的频率，但与 `Throttle` 不同，它不关心输入流是否平静，而是严格按时间取样。

**示例：**

```CS
mouseMoveStream // 鼠标移动事件非常频繁
    .Sample(TimeSpan.FromMilliseconds(100))
    // 每 100 毫秒只发射一次最新的鼠标位置
```

#### Skip

**作用：** 抑制源 Observable 发射的**前 N 个**数据项，然后发射所有后续数据项。

**原理：** 跳过序列开头的指定数量的元素。

**示例：**

```CS
Observable.Range(1, 5) // 序列: 1, 2, 3, 4, 5
    .Skip(2)
    // 结果序列: 3, 4, 5
```

#### SkipLast

**作用：** 抑制源 Observable 发射的**末尾 N 个**数据项。

**原理：** 需要等待源 Observable 完成（`OnCompleted`）后才能开始发射数据。

**特点：** 仅适用于**有限序列**。

**示例：**

```CS
Observable.Range(1, 5) // 序列: 1, 2, 3, 4, 5 (然后完成)
    .SkipLast(2)
    // 结果序列: 1, 2, 3
```

#### Take

**作用：** 仅发射源 Observable 发射的**前 N 个**数据项，然后立即终止流（发送 `OnCompleted`）。

**原理：** 限制序列的最大长度。

**示例：**

```CS
Observable.Interval(TimeSpan.FromSeconds(1)) // 无限序列: 0, 1, 2, 3, ...
    .Take(3)
    // 结果序列: 0, 1, 2 (然后完成)
```

#### TakeLast

**作用：** 仅发射源 Observable 发射的**末尾 N 个**数据项。

**原理：** 与 `SkipLast` 类似，需要等待源 Observable 完成后才能开始发射数据。

**特点：** 仅适用于**有限序列**。

**示例：**

```CS
Observable.Range(1, 5) // 序列: 1, 2, 3, 4, 5 (然后完成)
    .TakeLast(2)
    // 结果序列: 4, 5
```

### Combining结合

| 操作符          | 合并策略     | 顺序保证      | 适用场景       |
| --------------- | ------------ | ------------- | -------------- |
| `Merge`         | 并发打平     | ❌             | 多事件源监听   |
| `Concat`        | 串行拼接     | ✅             | 顺序任务       |
| `Switch`        | 取最新流     | ✅（最新）     | 动态数据源切换 |
| `Zip`           | 严格配对     | ✅             | 同步数据组合   |
| `CombineLatest` | 最新值组合   | ❌（但数据新） | 实时联动计算   |
| `StartWith`     | 前置初始值   | ✅             | 默认状态注入   |
| `Join`          | 时间窗口连接 | —             | 复杂事件模式   |

#### CombineLatest

**作用：** 每当**任一**源 Observable 发射新的数据项时，它都会将该流的最新值与**所有其他源流的最新值**组合起来，并发射组合后的结果。

**原理：** 类似于 Excel 表格中的公式。只要任何一个输入单元格发生变化，输出单元格就会使用所有输入单元格的最新值重新计算。

**特点：** 适用于依赖多个输入的状态计算（例如，表单验证：当用户名或密码任何一个变化时，都要检查两者是否都有效）。

**示例：**

```CS
// 假设这些是 ViewModel 属性的流
var usernameValid = this.WhenAnyValue(vm => vm.UsernameIsValid);
var passwordValid = this.WhenAnyValue(vm => vm.PasswordIsValid);

Observable.CombineLatest(usernameValid, passwordValid, (uValid, pValid) => uValid && pValid)
    .Subscribe(canSubmit => this.CanSubmit = canSubmit);
// 结果流在任何一个子流更新后都会立即重新计算并发送布尔值。
```

#### Join

**作用：** 基于时间窗口，将两个 Observable 的数据项进行组合。

**原理：** `Join` 依赖于为每个源流发射的元素定义一个“生命周期”（一个 Observable）。当第一个流的一个元素处于其生命周期内，同时第二个流发射了一个新的元素，且两者满足特定的条件函数时，这两个元素会被组合。

**特点：** 比 `Zip` 更复杂，适用于基于时间匹配的复杂关系合并，类似于关系数据库中的连接（Join）。

> [!note]
>
> API 复杂，多数场景可用 `Buffer`/`Window` 替代

#### Merge

**作用：** 将多个源 Observable 的发射物扁平化（Flatten）为一个单一的 Observable。

**原理：** `Merge` 会并发地监听所有源流。无论哪个源流先发射数据，`Merge` 都会立即将其发射出去。它不会尝试按顺序排列元素。

**特点：** 适用于将多个相同类型的数据源（如多个 API 调用、多个按钮点击事件）汇集到一个管道中。

**示例：**

```CS
var streamA = Observable.Interval(TimeSpan.FromSeconds(1)); // 0, 1, 2, ...
var streamB = Observable.Interval(TimeSpan.FromSeconds(1.5)); // 0, 1, 2, ...

// Merge 会交错地发射 A 和 B 的数据
Observable.Merge(streamA, streamB)
    .Subscribe(x => Console.WriteLine(x)); 
// 结果序列可能为: A0, B0, A1, A2, B1, ...
```

#### StartsWith

**作用：** 在源 Observable 开始发射数据之前，先发射一个指定的序列。

**原理：** 简单地在流的开头插入一些预设的值。

**特点：** 适用于在数据加载完成之前，立即提供一个默认值或缓存值，以改善用户体验。

**示例：**

```CS
var cachedData = GetFromCache(); 
var liveData = ApiClient.FetchDataAsync();

liveData.StartsWith(cachedData)
    .Subscribe(data => Display(data));
// 结果序列: [Cache data], [Live data] (当 Live data 到达时)
```

#### Switch

**作用：** 订阅一个发射 **Observable** 的 Observable（称为“源 Observable”或“元 Observable”），并总是只发射**最近**那个内部 Observable 的数据。

**原理：** 每当源 Observable 发射一个新的内部 Observable 时，`Switch` 就会自动**取消订阅**前一个内部 Observable，并**切换**到新的内部 Observable。底层由`SelectMany` + 自动取消旧订阅 实现

**特点：** 极其适用于处理竞态条件（Race Conditions），例如搜索框输入。当用户输入新字符时，之前的慢速搜索请求（内部 Observable）应该被取消，以保证用户只看到最新搜索请求的结果。

**示例：**

```CS
// 搜索框：每次新输入取消旧请求
searchText
    .Select(text => api.SearchAsync(text)) // 返回 IObservable<Results>
    .Switch() // 只保留最新请求的结果
    .Subscribe(results => UpdateUI(results));
```

#### Zip

**作用：** 将多个源 Observable **配对（Pair）** 发射，然后应用一个函数来组合这些配对的值，并将其作为单个数据项发射出去。

**原理：** `Zip` 严格要求一对一的对应。它会等待所有源流都发射了一个新值后，才将它们组合并发射。如果某个流的速度比其他流快，多余的值会被缓存，直到所有其他流都跟上。

**特点：** 适用于需要同时依赖于多个流的同步数据。流的长度由最短的流决定。

**示例：** 将用户 ID 流和用户姓名流配对。

```CS
var ids = Observable.From(new [] { 1, 2, 3 });
var names = Observable.From(new [] { "Alice", "Bob", "Charlie" });

Observable.Zip(ids, names, (id, name) => new { Id = id, Name = name })
    .Subscribe(user => Console.WriteLine(user));
// 结果序列: {Id: 1, Name: "Alice"}, {Id: 2, Name: "Bob"}, {Id: 3, Name: "Charlie"}
```

### Error Handling错误处理

- 当 `Observable` 调用 `OnError(exception)`
  - 流**立即终止**
  - 不再发射任何 `OnNext`
  - **无法继续订阅该流**
- 错误会**向下游传播**，除非被拦截
- **“错误是流的一部分，必须被显式处理，否则会导致静默失败。”**

| **特性**     | **Catch**                           | **Retry**                                   |
| ------------ | ----------------------------------- | ------------------------------------------- |
| **错误处理** | **捕获**错误，并用新流**替换**      | **捕获**错误，并**重新订阅**原流            |
| **流的执行** | 切换到新流后，原流**不会**再被执行  | 重新从头执行原流中的所有逻辑                |
| **用途**     | 提供备用/默认数据，防止错误向下传递 | 处理瞬时错误，尝试恢复执行                  |
| **错误传递** | 通常阻止 `OnError` 向下游传递       | 只要重试成功，就不会将 `OnError` 向下游传递 |

#### Catch

**作用：** 捕获源 Observable 抛出的 `OnError` 通知，然后**用一个替代的 Observable 序列替换**原来的流，并继续运行。

**原理：** `Catch` 是一个**终端**操作符，意味着一旦它捕获了错误并成功地切换到替代流，原始流的错误就不会向下传递。替代流完成或抛出错误时，整个序列才会终止。

**特点：** 用于**一次性恢复**或**提供默认值**。

- **提供默认值：** 捕获错误，然后返回一个包含默认值的 Observable（通常是 `Observable.Return()`）。
- **切换到备份源：** 捕获错误，然后切换到另一个数据源（例如从 API 切换到本地缓存）。

**示例：**提供默认值（捕获并终止）

```CS
var badStream = Observable.Throw<int>(new Exception("网络错误"));

badStream
    .Catch((Exception ex) => 
    {
        Console.WriteLine($"捕获到错误：{ex.Message}，切换到默认值。");
        // 遇到错误后，返回包含单个值 0 的新流，然后完成
        return Observable.Return(0); 
    })
    .Subscribe(
        x => Console.WriteLine($"接收数据：{x}"), // 输出: 接收数据：0
        ex => Console.WriteLine("流终止于错误！"), // 不会被调用
        () => Console.WriteLine("流完成") // 输出: 流完成
    );
```

#### Retry

**作用：** 捕获源 Observable 抛出的 `OnError` 通知，然后**重新订阅**源 Observable，尝试再次执行整个序列。

**原理：** `Retry` 会将错误信号转换为重新订阅的指令。只要流抛出错误，它就会从头开始尝试执行，而不会将错误传递给下游。

**特点：** 用于处理**瞬时错误**（如网络抖动、数据库临时锁定）。

- **无限重试：** 简单调用 `Retry()` 会无限重试，直到成功。
- **有限重试：** 传递一个整数参数 `Retry(n)`，指定最大重试次数。
- **带条件重试 (`RetryWhen`)：** 允许您定义复杂的重试逻辑，例如延迟重试（指数退避）。

**示例：**假设 `AttemptApiCall()` 方法在第一次和第二次调用时失败，但在第三次调用时成功。

```CS
int attemptCount = 0;

IObservable<string> AttemptApiCall()
{
    attemptCount++;
    if (attemptCount < 3)
    {
        Console.WriteLine($"尝试调用 API ({attemptCount})... 失败！");
        return Observable.Throw<string>(new InvalidOperationException());
    }
    else
    {
        Console.WriteLine($"尝试调用 API ({attemptCount})... 成功！");
        return Observable.Return("API 数据");
    }
}

AttemptApiCall()
    .Retry(3) // 最多重试 3 次 (总共执行 4 次：初始 + 3 次重试)
    .Subscribe(
        x => Console.WriteLine($"成功接收数据：{x}"), // 输出: 成功接收数据：API 数据
        ex => Console.WriteLine("最终失败！"), // 不会被调用
        () => Console.WriteLine("流完成")
    );
```

**更高级的重试：`RetryWhen` (延迟重试/指数退避)**

`RetryWhen` 接收一个流，这个流决定了何时以及如何重试。

```CS
source.RetryWhen(exceptions => 
    exceptions.Delay(TimeSpan.FromSeconds(5)) // 捕获到错误后，延迟 5 秒再重试
);
```

### Utility辅助

在 **Rx.NET** 中，**Utility 辅助操作符**（Utility Operators）用于处理与 Observable 生命周期、调度、执行顺序等相关的操作。它们可以帮助你控制数据流的时序、调度和其他辅助功能。

| 操作符         | 主要用途     | 线程相关 | 资源管理              |
| -------------- | ------------ | -------- | --------------------- |
| `Delay`        | 延迟发射     | ✅        | ❌                     |
| `Do`           | 副作用/调试  | ❌        | ❌                     |
| `Materialize`  | 信号对象化   | ❌        | ❌                     |
| `ObserveOn`    | 指定观察线程 | ✅        | ❌                     |
| `SubscribeOn`  | 指定订阅线程 | ✅        | ❌                     |
| `Serialize`    | 串行化事件   | ✅        | ❌                     |
| `Subscribe`    | 启动流       | ❌        | ✅（返回 IDisposable） |
| `TimeInterval` | 相对时间标注 | ❌        | ❌                     |
| `Timeout`      | 超时控制     | ✅        | ❌                     |
| `Timestamp`    | 绝对时间标注 | ❌        | ❌                     |
| `Using`        | 自动资源释放 | ❌        | ✅                     |

#### Delay

**作用：** 延迟源 Observable 发射的每一个数据项的时间，但不改变它们之间的相对时间间隔。

**原理：** 在将 `OnNext` 通知发送给下游订阅者之前，会等待指定的延迟时间。

**特点：** 延迟整个序列的发射，常用于创建平滑的 UI 动画或模拟网络延迟。

```CS
clicks.Delay(TimeSpan.FromSeconds(2)) // 所有点击事件都延迟 2 秒才向下游发送
    .Subscribe(...);
```

#### Do

**作用：** 允许您在流的生命周期中的特定事件发生时执行**副作用（Side Effects）**，而不会修改流中的数据或通知。

**原理：** `Do` 操作符在将通知传递给下游订阅者之前，会拦截通知并执行您的回调逻辑。

**特点：** 主要用于**调试、日志记录或执行不影响数据流的监控操作**。它有多个重载，可以针对 `OnNext`、`OnError` 和 `OnCompleted` 通知执行不同的逻辑。

```CS
dataStream
    .Do(
        onNext: x => Console.WriteLine($"[LOG] Received: {x}"),
        onError: ex => Console.WriteLine($"[LOG] Error: {ex.Message}"),
        onCompleted: () => Console.WriteLine("[LOG] Stream finished.")
    )
    .Subscribe(x => { /* 实际处理数据 */ });
```

#### Materialize/Dematerialize

| **操作符**          | **作用**                                                     | **描述**                                                     |
| ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **`Materialize`**   | 将流中的所有通知（`OnNext`, `OnError`, `OnCompleted`）都转换成普通的 `Notification<T>` 数据项。 | 将流的元数据（如错误和完成）带入流中进行处理。流本身将永不终止（直到被取消订阅）。 |
| **`Dematerialize`** | `Materialize` 的反向操作。将 `Notification<T>` 数据项流转换回标准的 Observable 序列（即重新激活 `OnNext`, `OnError`, `OnCompleted` 行为）。 | 通常用于在处理完流中的元数据后，恢复正常的流行为。           |

```CS
using System;
using System.Reactive.Linq;

class Program
{
    public static void Main()
    {
        var observable = Observable.Range(1, 3);

        observable
            .Materialize()
            .Subscribe(notification => 
                Console.WriteLine($"Notification: {notification.Kind}, Value: {notification.Value}"));
    }
}
```

```CS
// 运行结果
Notification: OnNext, Value: 1
Notification: OnNext, Value: 2
Notification: OnNext, Value: 3
Notification: OnCompleted, Value:
```

- `Materialize` 可以帮助你查看每个通知的类型及其相关的数据。
- `Dematerialize` 可以将 `Notification` 对象转换回正常的 Observable 流。

#### 调度控制

SubscribeOn 决定 谁启动，ObserveOn 决定谁接收。

| **操作符**        | **作用**                                                     | **影响范围**                 |
| ----------------- | ------------------------------------------------------------ | ---------------------------- |
| **`ObserveOn`**   | **切换观察者线程**。控制下游操作符和最终 `Subscribe` 的回调函数在哪个线程上执行。 | **下游**所有操作和副作用。   |
| **`SubscribeOn`** | **切换订阅线程**。控制 Observable 的**订阅（Subscription）以及数据生成逻辑**在哪个线程上执行。 | **上游**的资源创建和数据源。 |

##### ObserveOn

**指定观察者（Observer）在哪个线程执行**

- **作用**：控制 `OnNext`/`OnError`/`OnCompleted` 回调的执行上下文
- **关键**：**只影响下游操作符和订阅回调**

```CS
// 在后台计算，在 UI 线程更新
dataStream
    .Select(HeavyComputation)           // 在当前线程（可能是后台）
    .ObserveOn(RxApp.MainThreadScheduler) // 切换到 UI 线程
    .Subscribe(result => label.Text = result.ToString());
```

##### SubscribeOn

**指定订阅（Subscription）在哪个线程执行**

- **作用**：控制 `Observable.Create` 或 `FromAsync` 中代码的执行线程
- **关键**：**只影响上游源头的激活**

```CS
Observable.FromAsync(async () =>
{
    // 此代码在 TaskPool 中执行
    await Task.Delay(1000);
    return "Result";
})
.SubscribeOn(TaskPoolScheduler.Default) // ← 实际上 FromAsync 默认已在后台
.ObserveOn(RxApp.MainThreadScheduler)
.Subscribe(...);
```



#### Serialize

**作用：** 强制一个多线程的 Observable 序列以串行（Serial）的方式向观察者发射通知。

**原理：** 加锁或队列化事件确保观察者在任何时候都只接收一个通知（即防止 `OnNext`、`OnError`、`OnCompleted` 之间的并发调用）。

**特点：** 用于解决某些 Observable 在底层并行发射通知，导致下游观察者出现线程安全问题的情况。通过 `Serialize`，可以保证通知的顺序性。

#### Subscribe

**作用：** 启动 Observable 序列的执行，并注册观察者（Observer）以接收通知。

**原理：** 这是 Rx 流的**最终动作**。当 `Subscribe` 被调用时，`Observable` 开始发射数据（如果它是**冷流**）。

**特点：** `Subscribe` 方法有多个重载，允许以 Lambda 表达式的形式定义 `onNext`、`onError` 和 `onCompleted` 的行为。它返回一个 `IDisposable` 对象，用于取消订阅。



#### Timeout

**作用：** 如果源 Observable 在指定的时间内未能发射下一个数据项，则终止流并发出 `OnError` 通知。

**原理：** 启动一个计时器，如果在计时器到期之前没有收到新的 `OnNext` 通知，则抛出 `TimeoutException`。

**特点：** 可选地提供一个备用的 Observable，在超时时切换到该备用流。

```CS
longRunningApiCall
    .Timeout(TimeSpan.FromSeconds(10)) // 10秒内未收到响应则超时
    .Catch(Observable.Return(DefaultResult)) // 超时后切换到默认结果
    .Subscribe(...);
```

#### Timestamp/TimeInterval

| **操作符**         | **作用**                                                     | **输出类型**                   |
| ------------------ | ------------------------------------------------------------ | ------------------------------ |
| **`Timestamp`**    | 将源 Observable 发射的每一个数据项都配上它发射时的时间戳。   | `IObservable<Timestamped<T>>`  |
| **`TimeInterval`** | 将源 Observable 发射的每一个数据项都配上它与前一个数据项之间的时间间隔。 | `IObservable<TimeInterval<T>>` |

```CS
sensor.Readings
      .Timestamp()
      .Subscribe(ts => 
          Console.WriteLine($"{ts.Value} at {ts.Timestamp}"));
```

```CS
var clicks = button.Clicks();
var timedClicks = clicks.TimeInterval();

timedClicks.Subscribe(ti => 
    Console.WriteLine($"{ti.Value} after {ti.Interval.TotalSeconds}s"));
```



#### Using

**作用：** 创建一个需要在 Observable 流的生命周期内使用的资源，并在流终止（无论是通过 `OnCompleted`、`OnError` 还是取消订阅）时自动释放该资源。

**原理：** 类似于 C# 的 `using` 语句，但适用于异步的、基于流的资源。它确保了资源在流的整个生命周期内都可用，并在流结束时调用 `Dispose()`。

```CS
Observable.Using(
    resourceFactory: () => new DatabaseConnection(), // 资源创建
    observableFactory: connection => connection.FetchDataStream() // 使用资源的流
)
.Subscribe(...); // 无论流发生什么，DatabaseConnection 都会被 Dispose
```



### Conditional条件和布尔







### Mathermatical算术和聚合









### Async异步





### Connect连接







### Convert转换





### Blocking阻塞





### String字符串





