---
title: FSharp
shortTitle: FSharp
description: F# 完整教程 — 面向 C# 开发者
date: 2026-7-26 15:56:51
categories: [.NET, F#]
tags: [.NET, F#]
---

# F# 完整教程

> 面向 **C# 开发者** 的 F# 系统教程。按微软官方 F# 语言参考章节组织,全程对比 C# 习惯。

## 章节索引

1. [概述](#一-概述overview)
2. [文本(字面量)](#二-文本字面量)
3. [字符串](#三-字符串)
4. [值](#四-值)
5. [`let` 绑定](#五-let-绑定)
6. [Functions](#六-functions)
7. [循环和条件](#七-循环和条件)
8. [模式匹配](#八-模式匹配)
9. [异常处理](#九-异常处理)
10. [类型和推理](#十-类型和推理)
11. [元组、选项、结果](#十一-元组选项结果)
12. [集合](#十二-集合)
13. [记录和联合](#十三-记录和联合)
14. [对象编程](#十四-对象编程)
15. [结构](#十五-结构struct)
16. [计算表达式](#十六-计算表达式)
17. [组织代码](#十七-组织代码)
18. [查询](#十八-查询)
19. [互操作性](#十九-互操作性)
20. [反射与代码引用](#二十-反射与代码引用)
21. [类型提供程序](#二十一-类型提供程序)
22. [速记卡](#二十二-c-开发者速记卡)

---

## 一、概述(Overview)

### 1.1 F# 是什么

F# 是 .NET 平台上的 **强静态类型、多范式** 编程语言,2005 年由 Microsoft Research 发布,2010 年开源。运行在 CLR 之上,与 C# 共享 JIT/GC/BCL。

| 维度 | 说明 |
|---|---|
| 范式 | 函数式为主,融合面向对象、命令式 |
| 类型 | 静态强类型 + 大量类型推断 |
| 默认 | 不可变、表达式、无 null |
| 一等公民 | 函数、值、类型同等地位 |
| 互操作 | 同一进程直接调用 C# |
| 场景 | 金融、量化、ML、数据处理、DSL、领域建模 |

### 1.2 C# vs F# 思维差异

| 概念 | C# | F# |
|---|---|---|
| 默认可变 | 是 | **否**(`mutable` 显式开启) |
| null 引用 | 允许 | 默认禁止,用 `Option<'T>` |
| 类型标注 | 必须或 `var` | 编译器推断 |
| 语句 vs 表达式 | 混合 | **几乎全表达式** |
| 函数 | 一等公民 | 一等公民 + **默认柯里化** |
| 并发 | `Task` + 线程 | `Async` 计算表达式 |
| 数据建模 | class 优先 | record + DU + 模式匹配优先 |

### 1.3 工具链

```bash
dotnet new console -lang F# -o FsHello
cd FsHello && dotnet run
```

IDE:Rider(最佳)、Visual Studio、VS Code + Ionide。浏览器试运行:[Fable REPL](https://fable.io/repl/)。

### 1.4 Hello World

```fsharp
printfn "Hello, world!"
```

> 无 `class Program`、`Main`、`using`、分号、大括号。**缩进即语法**。

---

## 二、文本(字面量)

> MS 原文档章节: **Literals** — 字面量是直接出现在代码中的常量值。

### 2.1 字面量类型与后缀

| F# | C# | 字面量 | 备注 |
|---|---|---|---|
| `int` | `int` | `42` | 32 位有符号 |
| `int64` | `long` | `42L` | 后缀 `L` |
| `uint32` | `uint` | `42u` | 后缀 `u` |
| `float` | `double` | `3.14` | F# `float` = `double` 别名 |
| `float32` | `float` | `3.14f` | 后缀 `f` |
| `decimal` | `decimal` | `3.14m` | 后缀 `m` |
| `bool` | `bool` | `true`/`false` | **小写** |
| `char` | `char` | `'a'` | 单引号 |
| `string` | `string` | `"hi"` | 双引号 |
| `unit` | `void` | `()` | 唯一值 `()` |
| `byte` | `byte` | `97uy` | unsigned,后缀 `uy` |

> F# 类型名 **首字母小写** — 与 C# 习惯相反,函数式惯例。

### 2.2 数字字面量

```fsharp
let a = 176
let b = 4.1
let c = 4.1f
let d = 42L
let e = 42u
let f = 3.14m
let g = 0xFF          // 十六进制 255
let h = 0o77          // 八进制 63
let i = 0b1010        // 二进制 10
```

C# 同样支持后缀,但 `L` 含义微妙(`long`/`Int64` 取决于上下文),F# 的 `L` 一律 `int64`,无歧义。

### 2.3 显式字面量

```fsharp
[<Literal>]
let MaxRetries = 3    // 必须是 const,可用于 attribute、模式匹配
```

`[<Literal>]` 与 C# `const` 概念接近,但 F# 通过 attribute 标注;必须为简单字面量或拼接字面量。

### 2.4 字符串字面量后缀

```fsharp
let ascii: byte[] = "abc"B          // 字节数组
let utf8 = "abc"u8                  // ReadOnlySpan<byte>,F# 6+
```

### 2.5 算术与比较

```fsharp
let r = (10 / 3, 10 % 3)            // (3, 1)
let eq = (1 = 1)                    // true
let ne = (1 <> 2)                   // true, F# 不等号
```

> F# 的 `<>` 是不等号;`!=` 在 F# 是引用不等(C# 的 `!Equals`)。

### 2.6 范围

```fsharp
let a = [1 .. 10]                   // 1..10
let b = [0 .. 2 .. 20]              // 0,2,4,...,20 步长 2
let c = [1.0 .. 0.1 .. 2.0]         // 浮点范围
let d = ['a' .. 'z']
```

C# 需 `Enumerable.Range`。

---

## 三、字符串

### 3.1 三种字面量

```fsharp
let s1 = "Hello"                            // 普通
let s2 = @"C:\Users\Alice"                  // verbatim,忽略 \
let s3 = """He said "hi" and left."""       // 三引号,忽略一切转义
```

> **三引号 `"""`** 是 F# 杀手锏,内嵌引号无需转义。写 JSON/XML/SQL/正则极其顺手。

### 3.2 转义序列

| 字符 | 转义 |
|---|---|
| 换行 | `\n` |
| 制表 | `\t` |
| 回车 | `\r` |
| 反斜杠 | `\\` |
| 双引号 | `\"` |
| Unicode | `\u00E7` |
| 十进制码点 | `\231` (**十进制,非八进制**) |
| 十六进制 | `\xE7` |
| 32 位 Unicode | `\U0001F47D` |

> F# 特有:`\DDD 是十进制,非八进制;C# `\DDD` 是八进制。

### 3.3 插值字符串 (F# 6+)

```fsharp
let name = "Alice"
let age = 30
let s = $"Name: {name}, Age: {age}"
let pi = $"PI = {System.Math.PI:.3f}"
let nested = $"{if age > 18 then "adult" else "minor"}"
```

> 语法与 C# `$""` 一致。F# 还支持原始插值 `$@"..."` 和三引号插值 `$"""..."""`。

### 3.4 拼接

```fsharp
let a = "Hello, " + "world"
let b = String.concat ", " ["a"; "b"; "c"]
```

### 3.5 索引与切片 (F# 6+)

```fsharp
let s = "Hello"
s[0]              // 'H' (char)
s[0..2]           // "Hel"
s[2..]            // "llo"
s[..1]            // "He"
```

老版本(及 F# 5 之前)用 `s.Chars(i)` 和 `s.Substring(...)`。

### 3.6 多行

```fsharp
let s1 = "abc
     def"                            // 保留换行: "abc\n     def"

let s2 = "abc\
     def"                            // 行尾 \ 续行,合并: "abcdef"

let s3 = """
    <order>
        <item>Widget</item>
    </order>
    """                              // 三引号,缩进按首行
```

### 3.7 常用方法

```fsharp
let s = "Hello, World"
s.Length            // 12
s.Contains "World"  // true
s.IndexOf "World"   // 7
s.ToUpper()
s.ToLower()
s.Trim()
s.Replace("World", "F#")
s.Split([|','; ' '|], StringSplitOptions.RemoveEmptyEntries)
```

> F# `string` 就是 `System.String`,BCL 全部成员可用。

### 3.8 `String` 模块

```fsharp
open Microsoft.FSharp.Core
String.concat " | " ["a"; "b"]                // "a | b"
String.collect (fun s -> s.Trim()) [" a ";" b "]
String.replicate 3 "ab"                       // "ababab"
String.forall (fun (s:string) -> s.Length>0) ["x";""]
```

### 3.9 `printfn` / `sprintf` 占位符

| 占位符 | 用途 |
|---|---|
| `%s` | string |
| `%d` | int |
| `%f` | float |
| `%b` | bool |
| `%c` | char |
| `%x` | 十六进制 |
| `%O` | 任意对象,调 `ToString` |
| `%A` | **任意值,美化结构化输出**(调试神器) |
| `%.2f` | 精度控制 |

```fsharp
printfn "%A" [1; 2; 3]    // [1; 2; 3]
printfn "%A" (Some 1)     // Some 1
printfn "%A" {Name="x"}   // { Name = "x" }
```

> `%A` 比 C# `JsonSerializer` 还省事 — 任何 record/DU/list 都能美化输出。

### 3.10 `null` 处理

```fsharp
let s: string = null      // F# 6+ 允许,需配合互操作
let opt = Option.ofObj s  // string option, null -> None
let s2 = Option.toObj opt // string, None -> null
```

---

## 四、值

### 4.1 值的本质

F# 中"值"是 **不可变** 的具名表达式结果。`let` 绑定即"将值绑定到名字":

```fsharp
let x = 42          // x 绑定到 42,无法再变
```

C# 类比:

```csharp
var x = 42;          // 默认可变,需 readonly
```

### 4.2 不可变性是默认

```fsharp
let a = 1
let mutable b = 1
b <- 10
// a <- 10  // 编译错
```

> 设计意图:不可变数据 → 并发安全、推理简单、可缓存。`mutable` 留给真需要的场景(局部累加器、状态机)。

### 4.3 影子(Shadowing)

```fsharp
let x = 1
let x = x + 1        // 新 x 遮蔽旧 x,新作用域
```

> 同一作用域内 `let x` 不会变值,而是引入 **新绑定**。C# 没有等价概念,JavaScript/let 行为更接近。

### 4.4 引用单元(`ref`)

```fsharp
let r = ref 0          // 包装的可变单元
r := !r + 1            // := 赋值, ! 取值
printfn "%d" !r        // 1
```

> `ref` 是函数式传统的可变容器(类似 C 的指针语义)。C# 对应 `Ref<int>` 或装箱 `int`。F# 代码极少用,推荐 `mutable` 或封装 record。

### 4.5 函数式不可变"状态"

```fsharp
let step1 s = { s with X = s.X + 1 }   // record 复制
let step2 s = s :: acc                  // 累积
```

> 推荐风格:**传出新值,不修改旧值**。

---

## 五、`let` 绑定

### 5.1 三种形态

```fsharp
// 值
let pi = 3.14

// 函数
let add a b = a + b

// 带显式参数类型(括号必需)
let add (a: int) (b: int) = a + b
```

### 5.2 递归必须 `rec`

```fsharp
let rec factorial n =
    if n = 0 then 1 else n * factorial (n - 1)
```

> 漏 `rec` 编译报错。C# 静态方法间直接互调,无需关键字。

### 5.3 相互递归 `and`

```fsharp
let rec isEven n = if n = 0 then true else isOdd (n - 1)
and isOdd  n = if n = 0 then false else isEven (n - 1)
```

### 5.4 `let` 的作用域

```fsharp
let f x =
    let y = x * 2     // y 只在 f 内可见
    y + 1
```

类似 C# 块作用域。

### 5.5 私有绑定

```fsharp
module M =
    let internal helper = ...    // 程序集内可见
    let private secret = ...     // 模块内可见
```

### 5.6 `let!` 与计算表达式

```fsharp
async {
    let! result = fetchAsync url
    return result.Length
}
```

> `let!` 是 `let` 在 **计算表达式** 中的特殊形式,见"计算表达式"章节。

---

## 六、Functions

### 6.1 函数即值

```fsharp
let add = fun a b -> a + b    // 显式 lambda
let add a b = a + b            // 语法糖

let negate = fun x -> -x
[1; 2; 3] |> List.map negate    // [-1; -2; -3]
```

C# 对应 `Func<int,int,int>` 或本地函数。

### 6.2 柯里化(Currying)

F# 函数 **默认柯里化** — 多参函数是"返回新函数"的链:

```fsharp
let add a b = a + b            // int -> int -> int
let add5 = add 5               // int -> int,部分应用
add5 10                        // 15

// 等价展开
let add' a = fun b -> a + b
```

> C# 没有原生柯里化,需 `Func<int, Func<int, int>>` 手动包装。柯里化是 F# 函数式编程的基石,管道/部分应用/函数组合都依赖它。

### 6.3 部分应用

```fsharp
let multiply a b c = a * b * c
let doubleThenBy c = multiply 2 3 c    // 等价 (multiply 2 3) c
doubleThenBy 4                         // 24
```

### 6.4 组合(`>>`)

```fsharp
let inc x = x + 1
let dbl x = x * 2
let incDbl = inc >> dbl
incDbl 3                  // 8 = (3+1)*2
```

### 6.5 管道(`|>`)

```fsharp
let result =
    [1..10]
    |> List.filter (fun x -> x % 2 = 0)
    |> List.map (fun x -> x * x)
    |> List.sum
```

> C# 暂无官方管道运算符(草案中),常用 `.Select(...).Where(...)` LINQ 风格。

### 6.6 高阶函数

```fsharp
let apply f x = f x
apply (fun x -> x + 1) 5   // 6
```

### 6.7 递归函数

```fsharp
let rec fact n =
    match n with
    | 0 | 1 -> 1
    | n -> n * fact (n - 1)
```

> F# 编译器对 **尾调用** 自动优化(转循环),不爆栈。

### 6.8 互递归

```fsharp
let rec even n = if n = 0 then true else odd (n - 1)
and odd  n = if n = 0 then false else even (n - 1)
```

### 6.9 函子/成员约束 — `inline` + 数值字面量

```fsharp
let inline add a b = a + b
```

`inline` 把函数体展开到调用处,允许泛型数值操作(类似 C# 泛型 + 约束)。

### 6.10 `function` 简写

```fsharp
let describe = function
    | 0 -> "zero"
    | n when n < 0 -> "negative"
    | n -> sprintf "positive %d" n
```

> `function` = `fun x -> match x with ...`,适合模式匹配为主的 lambda。

### 6.11 命名参数 / 可选参数

```fsharp
type Greeting =
    static member Say (?name, ?greeting) =
        let n = defaultArg name "world"
        let g = defaultArg greeting "Hello"
        $"{g}, {n}!"

Greeting.Say()                       // "Hello, world!"
Greeting.Say(name = "Alice")         // "Hello, Alice!"
Greeting.Say("Alice", "Hi")          // "Hi, Alice!"
```

### 6.12 成员函数

```fsharp
type Counter() =
    let mutable n = 0
    member this.Inc() = n <- n + 1
    member this.Value = n
```

> 详见"对象编程"章节。

---

## 七、循环和条件

### 7.1 条件 `if...then...else`

```fsharp
let sign x =
    if x > 0 then "positive"
    elif x = 0 then "zero"
    else "negative"
```

> **`if` 是表达式,必须 `else`**,不能只写 `if` 当语句。分支类型必须一致(或兼容)。

C# `?:` 三元:

```csharp
var s = x > 0 ? "positive" : "negative";   // 仅二元,F# 无 if-without-else
```

### 7.2 `for...in` 迭代

```fsharp
for x in [1; 2; 3] do
    printfn "%d" x

for x in 1 .. 10 do
    printfn "%d" x

for (k, v) in Map.ofList [("a", 1); ("b", 2)] do
    printfn "%s -> %d" k v
```

### 7.3 `for...to` / `for...downto` 计数

```fsharp
for i = 0 to 9 do
    printfn "%d" i

for i = 9 downto 0 do
    printfn "%d" i
```

### 7.4 `while...do`

```fsharp
let mutable n = 0
while n < 5 do
    printfn "%d" n
    n <- n + 1
```

> F# 风格上 **递归 > 循环 > while**。C# 反过来。

### 7.5 跳出 — `break` / 续接 `continue` 不存在?

F# 没有 `break`/`continue`。做法:

```fsharp
// 用递归代替 break
let rec find pred xs =
    match xs with
    | [] -> None
    | x::_ when pred x -> Some x
    | _::rest -> find pred rest

// 异常跳出
try
    for i in 1..100 do
        if i = 42 then raise (System.Exception("found"))
with _ -> ()
```

### 7.6 `yield` / `yield!` 在循环中

```fsharp
let squares =
    [ for i in 1 .. 10 do
          yield i * i ]
```

> `yield!` 展开子序列:

```fsharp
let all = [ yield! [1; 2]; yield! [3; 4] ]   // [1; 2; 3; 4]
```

---

## 八、模式匹配

### 8.1 基础 `match`

```fsharp
match shape with
| Circle r -> 3.14 * r * r
| Rect (w, h) -> w * h
| Point -> 0.0
```

> **必须穷尽**,漏分支编译器警告。这把运行时错误前置到编译期。

### 8.2 守卫 `when`

```fsharp
match n with
| 0 -> "zero"
| _ when n < 0 -> "neg"
| _ -> "pos"
```

### 8.3 字面量模式

```fsharp
match cmd with
| "start" -> ...
| "stop"  -> ...
| _ -> failwith "unknown"
```

### 8.4 变量绑定

```fsharp
match xs with
| [] -> "empty"
| head :: tail -> sprintf "head=%A" head
```

### 8.5 `as` 别名

```fsharp
match xs with
| (1 | 2 | 3) as small -> sprintf "small %A" small
| _ -> "big"
```

### 8.6 OR 模式 `|`

```fsharp
match n with
| 1 | 2 | 3 -> "small"
| _ -> "big"
```

### 8.7 `if` 模式(Active Patterns)

```fsharp
let (|Even|Odd|) n = if n % 2 = 0 then Even n else Odd n

match 4 with
| Even n -> printfn "even %d" n
| Odd n  -> printfn "odd %d" n
```

### 8.8 Active Patterns(活动模式)

#### 部分活动模式

```fsharp
let (|Integer|_|) (s: string) =
    match System.Int32.TryParse s with
    | (true, n) -> Some n
    | _ -> None

let parseInt s =
    match s with
    | Integer n -> Some n
    | _ -> None
```

#### 完全活动模式

```fsharp
let (|Email|) (s: string) =
    if s.Contains "@" then s else failwith "not email"

let greet (Email e) = $"send to {e}"
```

### 8.9 列表/记录/DU 解构

```fsharp
match person with
| { Name = "Alice"; Age = age } -> printfn "Alice, %d" age
| { Name = name } -> printfn "Other: %s" name
```

```fsharp
match shape with
| Circle r | Ellipse r -> printfn "round r=%f" r
| Rect (w, h) -> printfn "rect %fx%f" w h
```

### 8.10 模式匹配 vs `if...else`

| 场景 | 选 |
|---|---|
| 简单二元 | `if...else` |
| 多种 case | `match` |
| 解构 record/DU/list | `match` |
| Active Pattern | `match` |

---

## 九、异常处理

### 9.1 抛异常

```fsharp
raise (System.Exception "boom")
raise (System.ArgumentException "bad arg")

// 自定义
exception MyError of msg: string
raise (MyError "oops")
```

> `exception` 是 F# 的轻量异常类型定义,等价 C# 自定义 `Exception` 子类。

### 9.2 捕获 `try...with`

```fsharp
try
    let n = System.Int32.Parse "abc"
with
| :? System.FormatException -> -1
| :? System.OverflowException -> -2
| ex -> printfn "other: %s" ex.Message; 0
```

> 模式 `:? T` 是 C# `catch (FormatException)`。必须穷尽,否则警告。

### 9.3 命名异常绑定

```fsharp
try
    risky()
with
| :? System.IO.IOException as ex ->
    printfn "io: %s" ex.Message
    reraise()    // 重抛
```

### 9.4 收尾 `try...finally`

```fsharp
let writeFile path content =
    let stream = System.IO.File.OpenWrite path
    try
        stream.Write(content, 0, content.Length)
    finally
        stream.Close()
```

> C# `try { } finally { }` 等价,但 F# 的 `try...with` 与 `try...finally` 不能合在同一个 `try` 上,要嵌套:

```fsharp
try
    try risky() with Handler
finally cleanup()
```

### 9.5 `use` 关键字

```fsharp
let readFirstLine (path: string) =
    use stream = System.IO.File.OpenText path
    stream.ReadLine()
```

> `use` = `let` + `finally` 调用 `Dispose`。等价 C# `using var`。

### 9.6 断言 `assert`

```fsharp
let divide a b =
    assert (b <> 0)        // 失败抛 AssertionException
    a / b
```

> C# `Debug.Assert` 编译期可剥离;F# `assert` 默认总生效(需 `#define DEBUG` 等可调)。

### 9.7 函数式替代:`Result`

```fsharp
type Result<'T,'E> = Ok of 'T | Error of 'E

let parseInt (s: string) : Result<int, string> =
    match System.Int32.TryParse s with
    | (true, n) -> Ok n
    | _         -> Error $"not int: {s}"

let r = parseInt "42"
match r with
| Ok n  -> printfn "ok %d" n
| Error e -> printfn "err %s" e
```

> F# 鼓励 **用 `Result` 而非异常处理可预期错误**;异常留给真异常(IO 失败、网络断等)。C# 通常抛异常,这是范式差异。

---

## 十、类型和推理

### 10.1 类型推断

```fsharp
let x = 42              // int
let s = "hi"            // string
let f x = x + 1         // 'a -> 'a(自动泛化)
```

> 编译器从右到左推断,左值类型由右值决定。C# `var` 反向。

### 10.2 显式标注

```fsharp
let (x: int) = 42
let f (x: int) (y: int) : int = x + y
```

### 10.3 基本类型

见第二章。

### 10.4 `unit` 类型

```fsharp
let log (msg: string) : unit = printfn "%s" msg
```

> `unit` 是"无有意义返回值"的类型,唯一值 `()`。类似 C# `void`,但 `void` 不是类型,`unit` 是 — 可作泛型参数。

### 10.5 类型缩写

```fsharp
type UserId = int
type Token = string
```

C# `using UserId = System.Int32;`。

### 10.6 自动泛化

```fsharp
let id x = x     // 'a -> 'a,自动泛化
id 1             // int
id "x"           // string
```

> C# 泛型需 `<T>`,F# 默认泛化,只在使用时单态化。

### 10.7 显式泛型

```fsharp
let swap (a, b) = (b, a)    // 推断 'a * 'b -> 'b * 'a
let first (x: 'a) (xs: 'a list) = x
```

### 10.8 度量单位(Units of Measure)

```fsharp
[<Measure>]
type m
[<Measure>]
type s

let d = 100.0<m>
let t = 9.58<s>
let v = d / t          // float<m/s>,编译期检查
```

> 编译期单位,运行时擦除,零开销。F# 独有杀手锏。

### 10.9 转换与强制

```fsharp
let i = int 3.14        // 3
let s = string 42       // "42"
let f = float "3.14"    // 3.14
let b = byte 255        // 255uy
```

C# `(int)3.14` 是 C 风格;F# `int 3.14` 是函数式风格,更一致。

### 10.10 约束

```fsharp
let inline add< 'T when 'T : (static member (+) : 'T -> 'T -> 'T)> (a: 'T) (b: 'T) = a + b
```

> 类似 C# `where T : ...`,但 F# 还能约束静态成员、对比等。

### 10.11 灵活类型 `#`

```fsharp
let parse (s: #string) = s.Length    // 接受 string 或 null(F# 6+)
```

### 10.12 `byref`

```fsharp
let swap (a: byref<int>) (b: byref<int>) =
    let t = a
    a <- b
    b <- t

let mutable x = 1
let mutable y = 2
swap &x &y     // & 表示 byref 传递
```

> C# `ref`。F# 用 `&` 引用,`byref` 标注。

---

## 十一、元组、选项、结果

### 11.1 元组

```fsharp
let pair = (1, "one")
let (n, s) = pair
let triple = 1, 2, 3
```

#### 结构元组 vs struct tuple

```fsharp
let s = struct (1, 2)        // 值类型
let r = (1, 2)               // 引用类型
let (struct (a, b)) = s      // 解构
```

> struct tuple 与 C# 7 ValueTuple 互操作,但不可与 reference tuple 隐式互转。

#### 元组用途

```fsharp
let divide a b =
    if b = 0 then (None, "div by zero")
    else (Some (a / b), "ok")
```

### 11.2 Option

```fsharp
type Option<'T> = Some of 'T | None

let tryFind pred xs = xs |> List.tryFind pred
let v = tryFind (fun x -> x > 5) [1; 3; 7]   // Some 7

match v with
| Some n -> printfn "%d" n
| None   -> printfn "miss"
```

#### `Option` 模块

```fsharp
Some 1 |> Option.map    (fun n -> n + 1)      // Some 2
Some 1 |> Option.bind   (fun n -> Some (n*2)) // Some 2
Some 1 |> Option.defaultValue 0               // 1
None   |> Option.defaultValue 0               // 0
[Some 1; None; Some 2]
    |> List.choose id                        // [1; 2]
```

> F# 消灭 `null` 的核心武器。返回 `Option<T>` 强制调用方处理 `None`。

### 11.3 Result

```fsharp
type Result<'T,'E> = Ok of 'T | Error of 'E

let safeDiv a b : Result<int, string> =
    if b = 0 then Error "div by zero"
    else Ok (a / b)

match safeDiv 10 2 with
| Ok n -> printfn "%d" n
| Error e -> printfn "err: %s" e
```

> 替代异常做错误传递。F# 没有 `?` 运算符,所以 `Result` 是显式分支。

---

## 十二、集合

### 12.1 总览

| 类型 | 描述 | 底层 |
|---|---|---|
| `list<'T>` | 不可变单链表 | `FSharpList` |
| `array<'T>` | 可变定长数组 | `T[]` |
| `seq<'T>` | 惰性序列 | `IEnumerable` |
| `Map<K,V>` | 不可变字典 | AVL 树 |
| `Set<'T>` | 不可变集合 | 树 |
| `ResizeArray<'T>` | 可变动态数组 | `List<T>` |

### 12.2 list

```fsharp
let xs = [1; 2; 3]                // 字面量
let ys = 0 :: xs                  // 头插
let zs = [1 .. 5]
let empty: int list = []

// 操作
xs.Head             // 1
xs.Tail             // [2; 3]
xs.Length           // 3
xs @ [4; 5]         // [1; 2; 3; 4; 5]
List.map    (fun x -> x * 2) xs
List.filter (fun x -> x > 1) xs
List.sum xs
List.fold   (fun acc x -> acc + x) 0 xs
List.exists (fun x -> x = 2) xs
List.find   (fun x -> x = 2) xs    // 抛异常 if miss
List.tryFind(...)                   // Option, 推荐
List.zip    [1;2] ["a";"b"]        // [(1, "a"); (2, "b")]
```

### 12.3 array

```fsharp
let arr = [| 1; 2; 3 |]
arr[0]                              // 1
arr[0] <- 10                        // 可变
Array.length arr
Array.map (fun x -> x * 2) arr
arr |> Array.filter (fun x -> x > 1)
arr |> Array.sum

let even = Array.init 10 (fun i -> i * 2)   // [0; 2; 4; ..., 18]
let slice = arr[0..1]                        // [|10; 2|]
```

> `array` 可变且定长,适合性能热点。

### 12.4 seq

```fsharp
let s = seq { 1 .. 1000 }                  // 惰性
let s = seq { yield 1; yield 2; yield 3 }
let s = seq { for i in 1..10 do yield i * i }

// 操作
s |> Seq.take 5 |> Seq.toList
Seq.initInfinite (fun i -> i * i) |> Seq.take 10 |> Seq.toList
Seq.unfold (fun n -> Some (n, n+1)) 1 |> Seq.take 5
```

> `seq` 是 `IEnumerable`,惰性,大/无限序列必备。

### 12.5 Map

```fsharp
let m = Map.ofList [("a", 1); ("b", 2)]
m.["a"]                          // 1
m.TryFind "a"                    // Some 1
m |> Map.add "c" 3
m |> Map.remove "a"
m |> Map.map (fun _ v -> v * 10)
m |> Map.filter (fun _ v -> v > 1)
```

> `Map` **不可变**;每次"修改"返回新 Map。C# `Dictionary<K,V>` 默认可变,无对应类型。

### 12.6 Set

```fsharp
let s = Set.ofList [1; 2; 3; 2]   // set [1; 2; 3]
Set.contains 2 s
s |> Set.add 4
s |> Set.union (Set.ofList [3; 4])
```

### 12.7 `ResizeArray`

```fsharp
let xs = ResizeArray<int>()
xs.Add 1
xs.Add 2
xs.ToArray()
```

> 等价 C# `List<T>`,通常在性能关键或互操作边界用。

### 12.8 高阶函数族(全部适用 list/array/seq)

| 函数 | 作用 |
|---|---|
| `map` | 逐元素映射 |
| `filter` | 过滤 |
| `fold` | 累加(从左到右) |
| `reduce` | 不带初值的 fold |
| `iter` | 副作用迭代 |
| `exists` | 存在满足 |
| `forall` | 全部满足 |
| `find` / `tryFind` | 查找 |
| `zip` | 配对 |
| `unfold` | 展开生成 |
| `collect` | 扁平 map |
| `partition` | 二分 |
| `groupBy` | 分组 |
| `sort` / `sortBy` | 排序 |
| `distinct` | 去重 |
| `sum` / `sumBy` | 求和 |
| `count` | 计数 |

> 命名一致,跨集合类型通用,记忆负担低。

---

## 十三、记录和联合

### 13.1 记录 (Record)

```fsharp
type Person = { Name: string; Age: int }

let p = { Name = "Alice"; Age = 30 }
let p2 = { p with Age = 31 }              // 复制并更新

// 结构相等
p = p2   // false,Age 不同
```

#### 成员

```fsharp
type Person =
    { Name: string
      Age: int }
    member this.Greet() = $"Hi, I'm {this.Name}"
```

#### 模式匹配

```fsharp
match p with
| { Name = "Alice" } -> "found Alice"
| { Age = age } when age >= 18 -> "adult"
| _ -> "other"
```

### 13.2 匿名记录 (F# 4.6+)

```fsharp
let p = {| Name = "Alice"; Age = 30 |}
let p2 = {| p with Age = 31 |}
```

> 无类型名,适合局部数据传输。

### 13.3 可区分联合 (Discriminated Union, DU)

```fsharp
type Shape =
    | Circle of radius: float
    | Rectangle of width: float * height: float
    | Point

let area s =
    match s with
    | Circle r          -> System.Math.PI * r * r
    | Rectangle (w, h)  -> w * h
    | Point             -> 0.0
```

#### 单例 DU(类型安全包装)

```fsharp
type Email = Email of string
type UserId = UserId of int

let send (Email e) = ...
// 编译器阻止你把 string 误当 Email 传
```

#### 递归 DU(树)

```fsharp
type Tree<'T> =
    | Leaf of 'T
    | Node of Tree<'T> * Tree<'T>

let rec size t =
    match t with
    | Leaf _ -> 1
    | Node (l, r) -> size l + size r
```

### 13.4 枚举 (Enumeration)

```fsharp
type Color = Red = 0 | Green = 1 | Blue = 2
```

> F# 枚举要求显式底层值(C# 默认 int),可指定:

```fsharp
type Status = Pending = 1u | Active = 2u | Closed = 3u
```

---

## 十四、对象编程

> F# 的 OOP 主要服务于 **互操作边界** 与 **少量需要状态/继承** 的场景;领域逻辑优先 record + DU。

### 14.1 类

```fsharp
type Vector2D(dx: double, dy: double) =
    let len = sqrt (dx * dx + dy * dy)         // 私有字段

    member this.DX = dx                        // 属性
    member this.DY = dy
    member this.Length = len

    member this.Scale(k) = Vector2D(k * dx, k * dy)   // 方法
```

> 主构造器在类头 `(...)`,参数直接成为字段;`let` 绑定是私有字段;`member` 公开。

C# 对比:

```csharp
public class Vector2D {
    public double DX { get; }
    public double DY { get; }
    public double Length { get; }
    public Vector2D(double dx, double dy) { DX = dx; DY = dy; Length = ...; }
    public Vector2D Scale(double k) => new(k * DX, k * DY);
}
```

### 14.2 静态成员

```fsharp
type Math =
    static member Pi = 3.14159
    static member Square x = x * x
```

### 14.3 继承

```fsharp
type Animal() =
    abstract member Speak: string
    default this.Speak() = "..."

type Dog() =
    inherit Animal()
    override this.Speak() = "Woof"
```

### 14.4 抽象类

```fsharp
[<AbstractClass>]
type Shape() =
    abstract member Area: float
```

### 14.5 接口

```fsharp
type ILogger =
    abstract member Log: string -> unit

// 实现
type ConsoleLogger() =
    interface ILogger with
        member _.Log msg = printfn "%s" msg
```

### 14.6 对象表达式(匿名实现)

```fsharp
let temp = { new System.IDisposable with
                member _.Dispose() = printfn "disposed" }
```

> C# 没有匿名接口实现,F# 独有,适合一次性小对象。

### 14.7 类型扩展(扩展方法)

```fsharp
type System.String with
    member this.WordCount = this.Split(' ').Length

"hello world".WordCount   // 2
```

> 等价 C# `static class StringExtensions { ... }`,但写在被扩展类型旁更清晰。

### 14.8 委托

```fsharp
type Transformer = delegate of int -> int

let d = Transformer(fun x -> x * 2)
d.Invoke 5   // 10
```

> 多数情况直接用 `int -> int` 函数类型,不必包装 `delegate`。

### 14.9 运算符重载

```fsharp
type Complex(re: float, im: float) =
    member this.Re = re
    member this.Im = im
    static member (+) (a: Complex, b: Complex) =
        Complex(a.Re + b.Re, a.Im + b.Im)
```

### 14.10 成员:属性/方法/索引器/事件

```fsharp
type Collection() =
    let data = ResizeArray<int>()
    member this.Count = data.Count
    member this.Item with get (i) = data.[i]
    member this.Add(x) = data.Add x
    // event ...
```

### 14.11 继承 vs DU

| 场景 | F# 选 |
|---|---|
| 多种 case 数据,需模式匹配 | **DU** |
| 共享字段+行为,需继承 | class |
| 与 C# 互操作 | class (C# 视角自然) |
| 临时多态 | 对象表达式 |

---

## 十五、结构(Struct)

### 15.1 结构记录

```fsharp
[<Struct>]
type Point = { X: float; Y: float }
```

### 15.2 结构 DU

```fsharp
[<Struct>]
type Shape =
    | Circle of float
    | Rect of float * float
```

### 15.3 结构元组

```fsharp
let s = struct (1, 2)        // ValueTuple<int, int>
```

> `struct` 类型 **值语义**,无装箱,栈分配;适合高频小数据。F# 默认引用类型(record/DU/class),C# `record` 也是引用类型(可手动 `record struct`)。

### 15.4 结构约束

```fsharp
let inline zero< 'T when 'T : (new: unit -> 'T) > = new 'T()
```

---

## 十六、计算表达式

> **计算表达式(Computation Expression, CE)** 是 F# 最强大特性之一,允许自定义控制流,把 `let!`、`yield`、`return` 等关键字绑定到任意 monad-like 容器。

### 16.1 内置 CE

| CE | 用途 |
|---|---|
| `seq { ... }` | 惰性序列 |
| `async { ... }` | 异步工作流 |
| `task { ... }` | .NET `Task<T>` |
| `query { ... }` | LINQ 风格查询 |
| `option { ... }` | Option 单子 |
| `result { ... }` | Result 单子 |
| `identity` | 透传 |

### 16.2 `seq` CE

```fsharp
let evens =
    seq {
        for i in 1 .. 100 do
            if i % 2 = 0 then yield i
    }
```

### 16.3 `async` CE

```fsharp
open System.Net.Http

let fetchLength (url: string) =
    async {
        use client = new HttpClient()
        let! body = client.GetStringAsync(url) |> Async.AwaitTask
        return body.Length
    }

let urls = [ "https://a"; "https://b"; "https://c" ]
let lens =
    urls
    |> List.map fetchLength
    |> Async.Parallel          // 并行
    |> Async.RunSynchronously  // 阻塞执行
```

#### 关键字

| 关键字 | 作用 |
|---|---|
| `let!` | 绑定异步值 |
| `do!` | 副作用异步 |
| `return` | 返回值 |
| `return!` | 委托返回 |
| `use!` / `use` | 资源释放 |
| `yield` / `yield!` | 输出序列元素 |
| `if...then...else` | 条件 |

### 16.4 `task` CE

```fsharp
let fetchLengthTask (url: string) =
    task {
        use client = new HttpClient()
        let! body = client.GetStringAsync(url)
        return body.Length
    }
```

> `task` CE 在 F# 6+ 稳定,需 `open System.Threading.Tasks`。

### 16.5 `result` CE

```fsharp
let parsePositive (s: string) =
    result {
        let! n = tryParseInt s
        if n > 0 then return n
        else return! Error "non-positive"
    }
```

> `result` CE 在 `FSharpPlus` 等库提供;标准库无内置 `result` CE。

### 16.6 自定义 CE

```fsharp
type TraceBuilder() =
    member this.Bind(x, f) =
        printfn "before: %A" x
        let r = f x
        printfn "after:  %A" r
        r
    member this.Return(x) =
        printfn "return: %A" x
        x

let trace = TraceBuilder()

let r =
    trace {
        let! a = 1
        let! b = 2
        return a + b
    }
// 输出:
// before: 1
// after:  1
// before: 2
// after:  2
// return: 3
```

> 自定义 CE 需实现 `Bind` 与 `Return`(还有 `Yield`、`Combine`、`Zero`、`For` 等可选)。

---

## 十七、组织代码

### 17.1 命名空间

```fsharp
namespace MyApp.Domain

module Types =
    type User = { Id: int; Name: string }
```

### 17.2 模块

```fsharp
module Math =
    let pi = 3.14
    let square x = x * x
```

#### 嵌套

```fsharp
module Outer =
    module Inner =
        let f x = x + 1
```

#### 隐式模块(整个文件)

```fsharp
module MyApp.Math  // 整个文件 = 这个模块
let pi = 3.14
```

### 17.3 `open` 声明

```fsharp
open System.IO
open System.Collections.Generic
```

> 等价 C# `using`。

#### 别名

```fsharp
open System.Collections.Generic
type Dict = Dictionary<string, int>
```

### 17.4 签名文件 (.fsi)

```fsharp
// Math.fsi — 接口
module Math =
    val pi: float
    val square: x: float -> float
```

```fsharp
// Math.fs — 实现
module Math =
    let pi = 3.14
    let square x = x * x
```

> 签名文件(.fsi)声明模块对外 API,实现(.fs)可隐藏细节。类似 C# `public`/`internal` 边界。

### 17.5 访问控制

| 修饰 | 含义 |
|---|---|
| `let foo` | 默认 public(在模块内) |
| `let internal foo` | 程序集内可见 |
| `let private foo` | 模块/类内可见 |

```fsharp
module M =
    let public x = 1
    let internal y = 2
    let private z = 3
```

### 17.6 XML 文档

```fsharp
/// 加法
/// 参数: a, b
let add a b = a + b

/// <summary>乘法</summary>
/// <param name="a">第一个因子</param>
let mul a b = a * b
```

> `///` 三斜杠,F# 文档生成工具(FsDoc, F# Formatting)可消费。

### 17.7 程序入口

```fsharp
[<EntryPoint>]
let main argv =
    printfn "args: %A" argv
    0   // 退出码
```

> 无 `EntryPoint` 时,编译器把最后一个文件最后一个函数当入口,简单场景不用写。

---

## 十八、查询

### 18.1 `query` CE — LINQ 风格

```fsharp
open System.Linq

let data = [ 1; 2; 3; 4; 5 ]

let q =
    query {
        for n in data do
        where (n > 2)
        sortByDescending n
        select (n * n)
    }
```

> `query` CE 编译到 LINQ,可直接对 SQL/IEnumerable/IQueryable 数据源查询。

### 18.2 多源 join

```fsharp
type Customer = { Id: int; Name: string }
type Order    = { CustomerId: int; Total: decimal }

let customers = [ { Id=1; Name="A" }; { Id=2; Name="B" } ]
let orders    = [ { CustomerId=1; Total=100m }; { CustomerId=2; Total=200m } ]

let q =
    query {
        for c in customers do
        join o in orders on (c.Id = o.CustomerId)
        sortBy o.Total
        select (c.Name, o.Total)
    }
```

### 18.3 与 LINQ 对比

| 场景 | F# | C# LINQ |
|---|---|---|
| from..where..select | `query { for..where..select }` | `from..where..select` |
| 类型推断 | 强 | 部分 |
| 编译目标 | LINQ Expression | LINQ Expression |

> F# `query` 与 C# LINQ 语法相近,但 F# 仍用 `for` 而非 `from` — 风格统一。

---

## 十九、互操作性

### 19.1 调用 C# 库

```fsharp
open System.Text.Json

type Config = { Name: string; Port: int }

let json = """{"Name":"svc","Port":8080}"""
let cfg = JsonSerializer.Deserialize<Config>(json)
```

> 直接 `open` 命名空间,泛型调用与 C# 一致。

### 19.2 暴露 F# 给 C#

```fsharp
module MyFSharp =
    let Add (a: int) (b: int) : int = a + b
```

> C# 调用:

```csharp
using MyFSharp;
int r = MyFSharp.Math.Add(1, 2);
```

### 19.3 `null` 处理

```fsharp
// C# 引用类型默认 null 容忍,F# 默认否
let s: string = null   // F# 6+ 允许,显式标注

// 边界用 Option 包装
let opt: string option = Option.ofObj s
```

### 19.4 C# `out` / `ref`

```fsharp
let mutable n = 0
let ok = System.Int32.TryParse("42", &n)
printfn "%b %d" ok n     // true 42
```

> `&` 传 byref 变量,对应 C# `out int n`。

### 19.5 C# `params` 数组

```csharp
public void Log(params string[] msgs) { ... }
```

F# 调用:

```fsharp
let log = MyClass()
log.Log([| "a"; "b" |])     // 显式数组
log.Log("a", "b")           // F# 6+ 支持变参
```

### 19.6 索引器

```csharp
public string this[int i] => ...;
```

F#:

```fsharp
type MyList() =
    member this.Item with get (i: int) = ...
let xs = MyList()
let v = xs[0]
```

### 19.7 事件

```fsharp
type MyClass() =
    let ev = Event<int>()
    member this.OnChanged = ev.Publish
    member this.Trigger() = ev.Trigger 42

let c = MyClass()
c.OnChanged.Add (fun n -> printfn "got %d" n)
c.Trigger()
```

> C# `event EventHandler<int>` 对应 `Event<int>`。

### 19.8 异步互转

```fsharp
open System.Threading.Tasks

let t: Async<int> = async { return 1 }
let task: Task<int> = Async.StartAsTask t
let t' = task |> Async.AwaitTask
```

### 19.9 指针/不安全

F# 支持固定与原生互操作,但通常用 C#/C++/CLang 包装。F# 主要场景是托管代码。

---

## 二十、反射与代码引用

### 20.1 反射

```fsharp
open System.Reflection

let t = typeof<int>
let fields = t.GetFields()
let props = t.GetProperties()

// 动态调用
let mi = typeof<Math>.GetMethod("Abs")
let r = mi.Invoke(null, [| -5 |])   // 5
```

### 20.2 `typeof<>` 与 `GetType`

```fsharp
let t1 = typeof<int>                  // System.Type
let t2 = (1).GetType()                // System.Int32
let t3 = typedefof<list<int>>         // FSharpList<>
```

### 20.3 属性 (Attributes)

```fsharp
[<Obsolete "use newFunc">]
let oldFunc() = ()

[<EntryPoint>]
let main argv = 0

[<Struct>]
type Point = { X: int; Y: int }

[<Test>]
let ``addition works`` () =
    Assert.Equal(2, 1 + 1)
```

> `[<Name(args)>]` 是 attribute 语法,C# `[Name(args)]` 的 F# 写法。

### 20.4 `nameof`

```fsharp
let varName = nameof(Math.PI)   // "PI"
```

> C# `nameof(Math.PI)` 同样。

### 20.5 调用者信息

```fsharp
open System.Runtime.CompilerServices

let trace ([<CallerMemberName>] member = "",
           [<CallerFilePath>]   path   = "",
           [<CallerLineNumber>] line   = 0) =
    printfn "%s:%d %s" path line member
```

### 20.6 代码引用 (Code Quotations)

```fsharp
open Microsoft.FSharp.Quotations

let expr = <@ 1 + 2 @>
printfn "%A" expr
// (1 + 2)

let f x = x * x
let expr2 = <@ f 5 @>
// (f 5)

// 解构
let pattern =
    match expr with
    | DerivedPatterns.SpecificCall <@ (+) @> (a, b) ->
        printfn "add: %A + %A" a b
    | _ -> printfn "other"
```

> 代码引用把 F# 表达式表示为 **AST**,可被 F# PowerPack、FsCheck、WebSharper 等工具使用。F# 独有。

### 20.7 纯文本格式化(`%A` 背后)

```fsharp
type Person = { Name: string; Age: int }
let p = { Name = "Alice"; Age = 30 }
printfn "%A" p
// { Name = "Alice"
//   Age = 30 }
```

> `%A` 调用 `StructuredFormat` 模块(在 `FSharp.Core` 内部)实现 record/DU/list/seq 的人类可读输出。

---

## 二十一、类型提供程序

> **类型提供程序(Type Providers)** 是 F# 杀手锏:编译器在编译期调用用户代码生成类型,实现 **强类型数据访问** 而无运行时反射。

### 21.1 概念

类型提供程序是一个 .NET 组件,实现 `ITypeProvider` 接口。编译器读取 `T: SomeTypeProvider<...>` 时调用它,把生成的类型嵌入编译产物。

```fsharp
type T = SomeProvider<"data.json">
let v = T.MyField   // 编译期生成的类型,IDE 自动补全
```

### 21.2 内置 / 社区类型提供程序

| 提供程序 | 来源 | 用途 |
|---|---|---|
| `FSharp.Data` (JsonProvider) | 社区 | 读 JSON |
| `FSharp.Data` (XmlProvider) | 社区 | 读 XML |
| `FSharp.Data` (CsvProvider) | 社区 | 读 CSV |
| `SqlClient` (SqlProvider) | 社区 | 强类型 SQL |
| `FsRegEx` | 社区 | 正则 |
| `SwaggerProvider` | 社区 | OpenAPI |

### 21.3 `JsonProvider` 示例

```fsharp
// nuget: FSharp.Data
open FSharp.Data

type GitHub = JsonProvider<"https://api.github.com/repos/dotnet/fsharp">

let repo = GitHub.GetSample()
printfn "Stars: %d" repo.StargazersCount
printfn "Created: %O" repo.CreatedAt
```

> 编译器拉取 JSON 样本,生成 record 类型;后续访问字段无反射、零开销。

### 21.4 `CsvProvider` 示例

```fsharp
open FSharp.Data

type People = CsvProvider<"people.csv">

let p = People.GetSample().Rows |> Seq.head
printfn "%s, %s" p.Name p.Email
```

### 21.5 `SqlProvider` 风格

```fsharp
type Db = SqlDataConnection<"Server=.;Database=test;Integrated Security=true">

let ctx = Db.GetDataContext()
let q = query { for c in ctx.Customers do where (c.Country = "US") select c }
```

### 21.6 自定义类型提供程序

```fsharp
// Erased: 运行时类型擦除,纯编译期帮助
type MyProvider<tag> =
    let __ = ProviderImplementation()

type Sample = MyProvider<"hello">
let v = Sample.Field
```

> 自定义 TP 实现 `ITypeProvider`,提供 `GetTypes`、`GetInvokerExpression` 等,可选 Erased 或 Generated;`Erased` 是主流,编译后类型擦除,不影响运行时。

### 21.7 类型提供程序 vs 代码引用

| | 类型提供程序 | 代码引用 |
|---|---|---|
| 时机 | 编译期 | 编译期 |
| 输出 | 类型 | AST |
| 用途 | 强类型数据源 | 元编程、序列化 |
| 性能 | 零运行时开销 | 解析时开销 |

---

## 二十二、C# 开发者速记卡

| C# 习惯 | F# 等价 |
|---|---|
| `var x = 1;` | `let x = 1` |
| `int Add(int a, int b) => a + b;` | `let add a b = a + b` |
| `==` / `!=` | `=` / `<>` |
| `null` | `None` (Option) |
| `if (x) ... else ...` 表达式 | `if x then ... else ...` (必须 else) |
| `string.Format("{0}", x)` | `sprintf "%O" x` 或 `$"{x}"` |
| `Console.WriteLine(x)` | `printfn "%A" x` |
| `class` 优先 | `type` + record/DU 优先 |
| 异常处理预期错误 | `Result<'T,'E>` 优先 |
| `async Task<T>` | `async { ... }` |
| `using System;` | `open System` |
| `public static class` | `module` |
| `var (a, b) = pair;` | `let (a, b) = pair` |
| `out int n; TryParse(s, out n)` | `&n; TryParse(s, &n)` |
| `using var x = ...` | `use x = ...` |
| `LINQ: from x in xs where x > 0 select x` | `query { for x in xs where (x > 0) select x }` |
| `JsonSerializer.Deserialize<T>` | `JsonProvider<T>.GetSample()` |
| `Expression<Func<T>>` | `<@ expr @>` |
| 单元测试 xUnit | Expecto、xUnit 同样 |

## 推荐资源

- 官方: [Tour of F#](https://learn.microsoft.com/dotnet/fsharp/tour/)
- 官方: [F# Language Reference](https://learn.microsoft.com/dotnet/fsharp/language-reference/)
- 入门: [F# for Fun and Profit](https://fsharpforfunandprofit.com/)
- 领域建模: *Domain Modeling Made Functional*(Scott Wlaschin)
- 类型提供程序: [FsProjects/FSharp.Data](https://fsprojects.github.io/FSharp.Data/)
- 在线练手: [Fable REPL](https://fable.io/repl/) → Samples → Learn → Tour of F#
