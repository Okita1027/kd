---
title: C#版本新特性
shortTitle: 版本特性
description: C#版本新特性
date: 2025-09-07 14:41:33
categories: [.NET, C#]
tags: [.NET]
---




| C# 版本   | 特性               | 旧写法                                                       | 新写法                                                      |
| --------- | ------------------ | ------------------------------------------------------------ | ----------------------------------------------------------- |
| **C# 10** | 全局 using         | 每个文件都要写：`using System;`                              | 在任意文件声明：`global using System;`                      |
|           | 文件范围命名空间   | `csharp<br>namespace MyApp {<br>  class A {}<br>}<br>`       | `csharp<br>namespace MyApp;<br>class A {}<br>`              |
|           | 记录结构体         | 只能写 record class                                          | `public record struct Point(int X, int Y);`                 |
|           | 常量插值字符串     | 不能作为常量                                                 | `const string Info = $"Ver {Version}";`                     |
| **C# 11** | 原始字符串字面量   | `"C:\\path\\file.txt"`                                       | `"""C:\path\file.txt"""`                                    |
|           | 多行插值原始字符串 | 复杂转义：`"{ \"name\": \"" + name + "\" }"`                 | `csharp<br>string msg = $$"""{ "name": "{{name}}" }""";`    |
|           | UTF-8 字符串       | `Encoding.UTF8.GetBytes("Hi")`                               | `"Hi"u8`                                                    |
|           | 列表模式匹配       | `if (arr.Length==3 && arr[0]==1...)`                         | `if (arr is [1,2,3])`                                       |
|           | 必需成员           | 手动检查 null                                                | `public required string Name {get; init;}`                  |
| **C# 12** | 主构造函数         | `csharp<br>class User {<br>  public User(string n){Name=n;}<br>}<br>` | `class User(string Name)`                                   |
|           | 集合表达式         | `var list = new List<int>{1,2,3};`                           | `var list = [1,2,3];`                                       |
|           | using 别名增强     | 仅类/命名空间                                                | `using MyList = List<int>;`                                 |
|           | Lambda 默认参数    | `x=> $"Hi {x}"`，不能有默认值                                | `(string name="world") => $"Hi {name}"`                     |
|           | 内联数组           | 只能用 `fixed` 或 Span                                       | `csharp<br>[InlineArray(3)]<br>struct Buffer<T>{T e0;}<br>` |



## C#12

### 主要构造函数



### 集合表达式



### 内联数组



### Lambda表达式中的可选参数



### ref readonly参数



### 任何类型的别名



### 实验属性



### 拦截器





## C#13

### 增强的`params`参数

在以前，`params` 关键字只能修饰**数组**。 现在，`params` 可以修饰几乎任何常见的集合类型，包括 `IEnumerable<T>`、`List<T>`、`Span<T>` 和 `ReadOnlySpan<T>`。

- **性能优化**：如果你使用 `ReadOnlySpan<T>`，编译器可以减少内存分配（堆分配），提升高性能场景下的效率。

```cs
// 现在可以直接这样写
void PrintNames(params IEnumerable<string> names) 
{
    foreach (var name in names) Console.WriteLine(name);
}

PrintNames("Alice", "Bob", "Charlie"); // 自动识别
```

### 全新的`System.Threading.Lock`对象

在 C# 13 之前，我们通常使用 `object` 来实现 `lock` 锁。现在，.NET 9 引入了一个专门的 `System.Threading.Lock` 类型。

- **为什么要用它？** 当编译器检测到你锁定的对象是 `System.Threading.Lock` 类型时，它会生成更高效的机器码，而不是传统的 `Monitor` 进入/退出代码。

~~~CS
private readonly System.Threading.Lock _syncLock = new();

public void DoWork()
{
    lock (_syncLock) // 使用新类型的锁，性能更好
    {
        // 临界区代码
    }
}
~~~

### 新的转义序列`\e`

现在可以直接使用 `\e` 来表示 ASCII 转义字符 `ESC`（十六进制 `0x1B`），而不需要再写 `\x1b` 或 `\u001b`。

### 方法组自然类型

在 C# 中，方法组（如 `Console.WriteLine`）在重载解析过程中，编译器会尝试为所有候选方法构建完整的候选集。这可能导致在某些情况下，编译器无法正确推断"自然类型"（即方法组的类型）。

C# 13 优化了重载解析算法：

1. **作用域内削减**：在每个作用域内，编译器会移除不适用的候选方法（如泛型方法元数错误或约束未满足）
2. **延迟到外层作用域**：仅当当前作用域内找不到合适候选方法时，才会继续检查外层作用域

```CS
public class Example
{
    public void Method(int x) { }
    public void Method(string s) { }
    
    public void Test()
    {
        // 以前：编译器会尝试所有重载，可能需要更多上下文
        // 现在：编译器在当前作用域内过滤掉不适用的方法
        var action = Method; // 编译器能更准确地推断为 Action<int> 或 Action<string>
    }
}
```

### 隐式索引访问

可以在对象初始化器中使用“从末尾开始索引”的操作符 `^`。

```CS
var buffer = new MyBuffer
{
    [0] = 1,
    [^1] = 10 // 以前不支持在初始化器里写 ^1（倒数第一个元素）
};
```

### 迭代器和ref方法中的unsafe和async

在 C# 13 之前：

- 迭代器 (`yield return`) 和 `async` 方法中 **不能声明 `ref` 局部或 `ref struct` 变量**
- 也不能使用 `unsafe`

C# 13 取消了这些限制：

- 你可以在异步方法或迭代器中声明 `ref` 局部变量
- 也可以声明 `ref struct` 类型的局部变量
- `unsafe` 代码也可以出现在这些方法中
   但不能跨越 `await` 或 `yield` 边界访问。

### 泛型支持`ref struct`

在以前，`ref struct`（如 `Span<T>`）不能作为泛型参数使用。

C# 13 引入了 `where T : allows ref struct`。这告诉编译器：这个泛型方法允许接收 `ref struct` 类型，从而让 `Span` 等类型能走进更多的泛型逻辑。

```cs
public class C<T> where T : allows ref struct { … }
```

### `ref struct`类型实现接口

C# 13 允许 `ref struct`（例如 `Span<T>` 之类的栈类型）实现接口。**但这些类型仍然不能被装箱为接口引用**，这避免了安全问题。

~~~cs
ref struct MyRefStruct : IMyInterface { … }
~~~

### `partial`属性/索引

这之前 C# 只支持部分方法，**C# 13 允许把属性/索引器分拆到多个文件**：

```cs
public partial class C
{
    public partial string Name { get; set; }
}
```

```cs
public partial class C
{
    public partial string Name
    {
        get => _name;
        set => _name = value;
    }
}
```

### 重载解析优先顺序

C#13引入了一个新属性：`OverloadResolutionPriorityAttribute`

让库作者指定某个重载应优先于其他重载，这对 API 设计、库演化非常有用。例如：

- 你添加了更优的重载
- 但又不想破坏旧代码
- 就可以通过这个属性优先选择新重载

### `field`关键字

预览特性：`field` 关键字（上下文关键字），用于访问编译器自动生成的 backing field。这让你写自定义访问器体时无需声明显式字段。

```CS
public string Name
{
    get => field;
    set => field = value;
}
```

因为是预览功能，需要在项目文件中启用预览编译。

## C#14

### 扩展成员

 `extension`块语法，允许你为现有类型添加**属性、操作符和静态成员**。

**基本语法：**

```CS
public static class MyExtensions
{
    // 扩展实例成员（作用于类型的实例）
    extension(this TargetType instance)
    {
        // 在这里定义属性、索引器、方法等
    }

    // 扩展静态成员（作用于类型本身）
    extension(TargetType)
    {
        // 在这里定义静态属性、字段、方法等
    }
}
```

**示例：扩展属性**

```CS
public static class StringExtensions
{
    extension(this string s)
    {
        public bool IsEmpty => string.IsNullOrEmpty(s);
        public bool IsWhiteSpace => string.IsNullOrWhiteSpace(s);
    }
}

// 使用
string name = "";
Console.WriteLine(name.IsEmpty);      // true
Console.WriteLine(name.IsWhiteSpace); // true
```

**示例：扩展索引器**

为 `Span<T>` 添加安全索引（带默认值）

```CS
public static class SpanExtensions
{
    extension(this Span<int> span)
    {
        public int this[int index, int defaultValue = 0]
        {
            get => (uint)index < (uint)span.Length ? span[index] : defaultValue;
        }
    }
}

// 使用
Span<int> numbers = [1, 2, 3];
Console.WriteLine(numbers[5, -1]); // 输出: -1（越界返回默认值）
```

> [!NOTE]
>
> 索引器参数必须有默认值（因调用时可能不提供）。

**示例：扩展静态成员**

为`Guid`添加常用常量

```CS
public static class GuidExtensions
{
    extension(Guid)
    {
        public static readonly Guid Empty = new(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        public static Guid NewSequential() => GenerateSequentialGuid(); // 自定义逻辑
    }
}

// 使用
Guid id = Guid.Empty;           // 替代 Guid.Empty（但这是示例）
Guid seq = Guid.NewSequential(); // 全新 API！
```

**示例：扩展方法（兼容旧语法）**

仍然可以写传统扩展方法，但 `extension` 块更统一：

```CS
extension(this string s)
{
    // 新语法
    public bool ContainsIgnoreCase(string value)
        => s.IndexOf(value, StringComparison.OrdinalIgnoreCase) >= 0;
}

// 等价于旧语法
public static bool ContainsIgnoreCase(this string s, string value) { ... }
```

### 空条件赋值

`?.` 运算符现在可以放在赋值或复合赋值的左侧，使 null 安全赋值更简洁。

老的写法：

```CS
if (customer is not null)
    customer.Order = GetCurrentOrder();
```

新的写法：

```CS
customer?.Order = GetCurrentOrder();
```

如果 `customer` 为 null，则不会做赋值，也不会执行右侧表达式。

### `nameof`支持未绑定泛型类型

在 C# 14 之前，`nameof` 不能接受未绑定泛型，例如 `List<>`；只能写成 `List<int>`

~~~CS
Console.WriteLine(nameof(List<>)); // 输出 "List"
~~~

### 隐式跨度转换

