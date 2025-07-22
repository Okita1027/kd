---
title: C#语法
shortTitle: C#语法
description: C#语法
date: 2025-07-12 18:56:33
categories: [.NET, C#]
tags: [.NET]
---

## 索引器

索引器允许你像访问数组或字典那样，通过索引（或其他键）来访问类或结构体的实例。这使得你的自定义类型能够表现出集合的行为，从而提供更直观、更自然的 API。

简单来说，**索引器让你的对象能够使用方括号 `[]` 语法**。

### 问题引入

考虑一个场景，你有一个表示“学生列表”的类 `StudentList`，或者一个表示“配置参数”的类 `Configuration`。你希望能够通过学生的编号来获取学生对象，或者通过参数名来获取配置值，就像你访问数组元素或字典键值那样：

```C#
// 理想中的使用方式：
StudentList students = new StudentList();
Student s = students[101]; // 获取学号为101的学生

Configuration config = new Configuration();
string dbHost = config["DatabaseHost"]; // 获取名为 "DatabaseHost" 的配置
```

如果没有索引器，你可能需要这样写：

```C#
Student s = students.GetStudentById(101);
string dbHost = config.GetSetting("DatabaseHost");
```

虽然也能实现功能，但使用索引器 `[]` 语法显然更简洁、更符合直觉，尤其当你的类型在概念上代表一个项目的集合时。

### 语法

索引器定义看起来很像属性 (Properties)，但有几个关键的区别：

- **没有显式的名称**：索引器没有显式的名字，它使用关键字 `this`。
- **使用方括号 `[]`**：在 `this` 关键字后面跟着方括号 `[]`，方括号里定义了索引器的参数。
- **参数列表**：索引器可以接受一个或多个参数，这些参数可以是任何类型（`int`, `string`, `Guid` 等）。这是索引器与属性的主要区别，属性不能接受参数。

```C#
public class MyCollection<T>
{
    private T[] _items = new T[10];

    // 声明一个索引器，接受一个 int 类型的索引
    public T this[int index]
    {
        get
        {
            // 在这里实现获取逻辑
            if (index >= 0 && index < _items.Length)
            {
                return _items[index];
            }
            throw new IndexOutOfRangeException("Index is out of range.");
        }
        set
        {
            // 在这里实现设置逻辑
            if (index >= 0 && index < _items.Length)
            {
                _items[index] = value;
            }
            else
            {
                throw new IndexOutOfRangeException("Index is out of range.");
            }
        }
    }
}
```

### `get`和`set`访问器

和属性一样，索引器也有 `get` 和 `set` 访问器，它们定义了如何读取和写入通过索引访问的值。

- **`get` 访问器**：当通过索引读取值时被调用。它必须返回索引器类型的值。
- **`set` 访问器**：当通过索引赋值时被调用。隐式参数 `value` 包含了要赋给索引的值。

示例1：基于整数索引的`StudentCollection`

```C#
public class Student
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class StudentCollection
{
    private List<Student> _students = new List<Student>();

    public StudentCollection()
    {
        _students.Add(new Student { Id = 101, Name = "Alice" });
        _students.Add(new Student { Id = 102, Name = "Bob" });
        _students.Add(new Student { Id = 103, Name = "Charlie" });
    }

    // 索引器：通过学号（Id）获取或设置学生
    public Student? this[int studentId]
    {
        get
        {
            // 查找匹配学号的学生
            return _students.FirstOrDefault(s => s.Id == studentId);
        }
        set
        {
            // 如果要设置（更新）学生，先找到旧的学生
            var existingStudent = _students.FirstOrDefault(s => s.Id == studentId);
            if (existingStudent != null)
            {
                // 找到则移除旧的，添加新的
                _students.Remove(existingStudent);
                if (value != null)
                {
                    _students.Add(value);
                }
            }
            else if (value != null)
            {
                // 找不到旧的，直接添加新的
                _students.Add(value);
            }
            // 如果 value 是 null 且找不到 existingStudent，则不执行任何操作
        }
    }

    // 也可以添加一个只读的索引器，或者只写索引器
    public int this[string studentName] // 重载索引器，通过姓名查找
    {
        get
        {
            return _students.FirstOrDefault(s => s.Name.Equals(studentName, StringComparison.OrdinalIgnoreCase))?.Id ?? -1;
        }
    }
}

// 使用 StudentCollection
public class IndexerExample
{
    public static void Run()
    {
        StudentCollection students = new StudentCollection();

        // 使用索引器获取学生
        Student? student101 = students[101];
        if (student101 != null)
        {
            Console.WriteLine($"Student 101: {student101.Name}"); // Output: Student 101: Alice
        }

        Student? student104 = students[104];
        if (student104 == null)
        {
            Console.WriteLine("Student 104 not found initially."); // Output: Student 104 not found initially.
        }

        // 使用索引器设置（更新/添加）学生
        students[101] = new Student { Id = 101, Name = "Alice Smith" }; // 更新 Alice
        students[104] = new Student { Id = 104, Name = "David" };     // 添加 David

        Console.WriteLine($"Updated Student 101: {students[101]?.Name}"); // Output: Updated Student 101: Alice Smith
        Console.WriteLine($"New Student 104: {students[104]?.Name}");     // Output: New Student 104: David

        // 使用重载的索引器
        int charlieId = students["Charlie"];
        Console.WriteLine($"Charlie's ID: {charlieId}"); // Output: Charlie's ID: 103
    }
}
```

示例2：基于字符串键的 `ConfigurationManager`

```C#
public class ConfigurationManager
{
    private Dictionary<string, string> _settings = new Dictionary<string, string>();

    public ConfigurationManager()
    {
        _settings.Add("DatabaseHost", "localhost");
        _settings.Add("Port", "5432");
        _settings.Add("Username", "admin");
    }

    // 索引器：通过字符串键获取或设置配置值
    public string? this[string key]
    {
        get
        {
            _settings.TryGetValue(key, out string? value);
            return value;
        }
        set
        {
            if (value == null)
            {
                _settings.Remove(key); // 如果设置为 null，则移除
            }
            else
            {
                _settings[key] = value; // 添加或更新
            }
        }
    }
}

// 使用 ConfigurationManager
public class ConfigExample
{
    public static void Run()
    {
        ConfigurationManager config = new ConfigurationManager();

        Console.WriteLine($"DB Host: {config["DatabaseHost"]}"); // Output: DB Host: localhost
        Console.WriteLine($"Port: {config["Port"]}");           // Output: Port: 5432

        config["DatabaseHost"] = "production.db.com"; // 更新
        config["TimeoutSeconds"] = "60";              // 添加新键

        Console.WriteLine($"Updated DB Host: {config["DatabaseHost"]}"); // Output: Updated DB Host: production.db.com
        Console.WriteLine($"Timeout: {config["TimeoutSeconds"]}");      // Output: Timeout: 60

        config["Port"] = null; // 移除 Port 设置
        Console.WriteLine($"Port after removal: {config["Port"] ?? "N/A"}"); // Output: Port after removal: N/A
    }
}
```

### 特点&注意事项

- **可以重载**：你可以为一个类定义多个索引器，只要它们的参数签名（数量、类型和顺序）不同即可。例如，一个类可以同时拥有 `this[int index]` 和 `this[string key]`。
- **不限于整数索引**：索引器的参数可以是任何类型，这使得它比传统数组索引更灵活。
- **参数数量**：索引器可以接受多个参数，形成多维索引器（例如 `this[int row, int col]`，类似于访问二维数组）。
- **访问修饰符**：索引器本身可以有 `public`, `protected`, `internal`, `private` 等访问修饰符。`get` 和 `set` 访问器也可以有更严格的访问修饰符（例如 `public string this[int i] { get; private set; }`）。
- **静态索引器**：索引器不能是静态的。它们是实例成员，与特定对象关联。
- **接口中的索引器**：接口可以声明索引器，以便实现该接口的类必须提供对应的索引器实现。

```C#
public interface IMyCollection<T>
{
    T this[int index] { get; set; }
}
```

- **错误处理**：在索引器的 `get` 和 `set` 访问器中，你应该进行必要的参数验证和错误处理（例如，索引越界检查，如上述示例所示），并抛出适当的异常。
- **与属性的区别**：
  - **名称**：属性有名称 (`Name`、`Age`)；索引器没有，使用 `this[]`。
  - **参数**：属性不能接受参数；索引器必须接受至少一个参数。

## 解构赋值

解构赋值允许你**将一个对象或元组 (tuple) 的属性或元素，一次性地分解 (deconstruct) 到单独的变量中**。

### 语法

解构赋值的语法使用括号 `()` 来包裹你想要接收值的变量列表，然后使用 `=` 运算符将其赋值给要解构的对象。

```C#
(string firstName, string lastName, int age) = person;

// 或者使用 var 关键字进行类型推断 (更常用)
(var firstName, var lastName, var age) = person;

// 甚至更简洁，如果所有变量都是新声明的且类型可以推断
var (firstName, lastName, age) = person;

Console.WriteLine($"Name: {firstName} {lastName}, Age: {age}");
```

### 使用场景

#### 解构元组

**元组 (Tuple)** 是 C# 7.0 引入的另一个特性，它提供了一种轻量级的方式来表示一个具有多个元素的匿名数据结构。解构赋值是与元组结合使用的最常见场景。

```C#
// 定义一个返回元组的方法
public (string name, decimal price) GetProductDetails()
{
    // 假设从数据库或API获取数据
    return ("Laptop", 1200.50m);
}

// 调用方法并解构返回值
var (productName, productPrice) = GetProductDetails();

Console.WriteLine($"Product: {productName}, Price: {productPrice}");

// 你也可以忽略不关心的元素，使用下划线 `_`
var (nameOnly, _) = GetProductDetails(); // 忽略 price
Console.WriteLine($"Product Name: {nameOnly}");
```

#### 结构自定义对象

要使一个自定义类或结构体能够被解构，你需要为它提供一个或多个 **`Deconstruct` 方法**。`Deconstruct` 方法是一个特殊的公共方法，它必须：

- **没有返回值类型**（即 `void`）。
- 接受一系列 **`out` 参数**，这些 `out` 参数的顺序和类型决定了解构赋值时变量的顺序和类型。

示例：为 `Person` 类添加 `Deconstruct` 方法

```C#
public class Person
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public int Age { get; set; }

    public Person(string firstName, string lastName, int age)
    {
        FirstName = firstName;
        LastName = lastName;
        Age = age;
    }

    // Deconstruct 方法：用于解构赋值
    // 注意：方法名必须是 Deconstruct，且所有参数都必须是 out 参数
    public void Deconstruct(out string firstName, out string lastName)
    {
        firstName = FirstName;
        lastName = LastName;
    }

    public void Deconstruct(out string firstName, out string lastName, out int age)
    {
        firstName = FirstName;
        lastName = LastName;
        age = Age;
    }
}

Person person = new Person("Jane", "Doe", 25);

// 使用第一个 Deconstruct 方法 (只解构名和姓)
var (fName, lName) = person;
Console.WriteLine($"Deconstructed: {fName} {lName}");

// 使用第二个 Deconstruct 方法 (解构名、姓和年龄)
var (fName2, lName2, pAge) = person;
Console.WriteLine($"Deconstructed: {fName2} {lName2}, {pAge}");
```

> [!TIP]
>
> 一个类可以定义**多个 `Deconstruct` 方法重载**，允许你以不同的方式解构同一个对象，只需要它们的 `out` 参数签名不同即可。

### `_`忽略元素

当你不关心解构结果中的某个或某些元素时，可以使用下划线 `_` 作为**丢弃变量 (discard variable)** 来忽略它们。

```C#
// GetProductDetails() 返回 (string name, decimal price)
var (productName, _) = GetProductDetails(); // 只需要名字，忽略价格

// 从 Person 对象中只获取年龄
var (_, _, ageOnly) = person; // 忽略 FirstName 和 LastName
Console.WriteLine($"Age Only: {ageOnly}");
```

---

**示例：组合使用（解构+模式匹配）**

```C#
// 假设有一个 Item 元组
public (string type, int quantity, decimal unitPrice) GetItem(int itemId)
{
    if (itemId == 1) return ("Book", 2, 15.00m);
    if (itemId == 2) return ("Pen", 10, 0.50m);
    return ("Unknown", 0, 0m);
}

// 使用 switch 表达式和解构
string itemDescription = GetItem(1) switch
{
    ("Book", var qty, var price) when qty > 1 => $"Multiple books: {qty} @ {price:C}", // C# 8.0+
    ("Book", _, var price) => $"Single book @ {price:C}",
    ("Pen", var qty, _) => $"Pens: {qty}",
    var (type, qty, _) when type == "Unknown" && qty == 0 => "Item not found or invalid.",
    _ => "Other item type."
};

Console.WriteLine(itemDescription); // Output: Multiple books: 2 @ $15.00
```



## LINQ

**LINQ（语言集成查询）** 是 C# 提供的一种统一的数据访问方式，允许你对数组、集合、数据库、XML 等数据源使用 **类似 SQL 的语法** 进行查询和转换。

### 语法形式

#### 查询语法

查询语法是一种更接近 SQL 的声明式语法，它使用一系列关键字（如 `from`、`where`、`select`、`group by`、`join` 等）来构建查询。

结构：

```CS
from <range_variable> in <data_source>
where <condition>
orderby <ordering_expression>
select <result_expression>
```

示例：

```CS
List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// 查找所有偶数，并按降序排序
var evenNumbers = from num in numbers // 从 numbers 集合中迭代每个元素为 num
                  where num % 2 == 0   // 筛选条件：num 是偶数
                  orderby num descending // 排序：按 num 降序
                  select num;         // 投影：选择 num 作为结果

Console.WriteLine("Even numbers (Query Syntax):");
foreach (var n in evenNumbers)
{
    Console.WriteLine(n);
}
// Output: 10, 8, 6, 4, 2
```

#### 方法语法/扩展方法语法

方法语法是 LINQ 更常用的形式，它使用 **扩展方法 (Extension Methods)** 和 **Lambda 表达式 (Lambda Expressions)** 来构建查询。这种语法更加紧凑和灵活，并且所有查询语法最终都会被编译器转换为方法语法。

示例：

```CS
List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// 查找所有奇数，并按升序排序
var oddNumbers = numbers.Where(num => num % 2 != 0) // Where 是扩展方法，num => num % 2 != 0 是 Lambda 表达式
                        .OrderBy(num => num)       // OrderBy 也是扩展方法
                        .ToList();                 // ToList() 将查询结果立即执行并转换为 List

Console.WriteLine("Odd numbers (Method Syntax):");
foreach (var n in oddNumbers)
{
    Console.WriteLine(n);
}
// Output: 1, 3, 5, 7, 9
```

**推荐使用：** 大多数情况下，**方法语法** 更受青睐，因为它更灵活，可读性在复杂链式操作中更好，并且与函数式编程模式更契合。不过，在某些复杂的 `join` 或 `group by` 场景下，查询语法可能会更清晰。

### 基本操作符

LINQ 提供了丰富的操作符来执行各种查询任务。这些操作符都是定义在 `System.Linq.Enumerable` (针对 LINQ to Objects) 或 `System.Linq.Queryable` (针对 LINQ to Entities) 类中的扩展方法。

#### 过滤

**`Where()`**: 根据指定条件筛选元素。

- **查询语法**: `where <condition>`
- **方法语法**: `.Where(item => condition)`

```CS
var usersOlderThan30 = users.Where(u => u.Age > 30);
```

#### 投影

**`Select()`**: 转换元素的形状，选择特定属性或创建新对象。

- **查询语法**: `select <new_object_or_property>`
- **方法语法**: `.Select(item => new { /* new shape */ })`

```CS
// 只选择用户名
var userNames = users.Select(u => u.Name);

// 投影到匿名类型
var userInfos = users.Select(u => new { u.Name, u.Email });
```

#### 排序

**`OrderBy()` / `OrderByDescending()`**: 升序或降序排序。

**`ThenBy()` / `ThenByDescending()`**: 对已排序的结果进行二级排序。

- **查询语法**: `orderby <expression> [ascending/descending]`

```CS
var sortedUsers = users.OrderBy(u => u.Age).ThenByDescending(u => u.Name);
```

#### 分组

**`GroupBy()`**: 根据一个或多个键对元素进行分组。

- **查询语法**: `group <element> by <key_expression>`

```CS
var usersByCity = users.GroupBy(u => u.City);

foreach (var group in usersByCity)
{
    Console.WriteLine($"Users in {group.Key}:");
    foreach (var user in group)
    {
        Console.WriteLine($"  - {user.Name}");
    }
}
```

#### 连接

**`Join()`**: 将两个序列中的元素基于匹配的键进行关联。

- **查询语法**: `join <item_b> in <collection_b> on <key_a> equals <key_b>`

```CS
var orders = new List<Order>(); // 假设 Order 有 UserId
var usersWithOrders = users.Join(orders,
                                 user => user.Id,       // 用户表的键
                                 order => order.UserId, // 订单表的键
                                 (user, order) => new { user.Name, order.OrderId }); // 组合结果
```

#### 分区

**`Take()`**: 获取序列开头的指定数量的元素。

**`Skip()`**: 跳过序列开头的指定数量的元素。

```CS
var firstFiveUsers = users.Take(5);
var usersAfterFirstFive = users.Skip(5);
```

#### 聚合

**`Count()` / `LongCount()`**: 获取元素数量。

**`Sum()`**: 计算数值的总和。

**`Min()`**: 获取最小值。

**`Max()`**: 获取最大值。

**`Average()`**: 计算平均值。

```CS
var totalUsers = users.Count();
var averageAge = users.Average(u => u.Age);
```

#### 元素操作

**`First()` / `FirstOrDefault()`**: 获取序列的第一个元素。`FirstOrDefault()` 在没有找到元素时返回默认值（引用类型为 null，值类型为 0 等）。

**`Single()` / `SingleOrDefault()`**: 获取序列中唯一的元素。如果序列包含多个元素或没有元素，`Single()` 会抛出异常；`SingleOrDefault()` 在没有找到时返回默认值，找到多个时抛异常。

**`Any()`**: 检查序列中是否有任何元素满足条件。

**`All()`**: 检查序列中所有元素是否都满足条件。

```CS
var firstUser = users.FirstOrDefault();
bool hasAdmins = users.Any(u => u.Role == "Admin");
```

### 延迟执行

大多数 LINQ 查询操作符（如 `Where`、`Select`、`OrderBy`、`GroupBy`）都实现了**延迟执行**。这意味着：

- 当你编写一个 LINQ 查询时，它**不会立即执行**。它只是构建了一个查询的定义或**查询表达式树**。
- 查询只有在**实际需要结果时才会被执行**。这通常发生在以下几种情况：
  - **遍历结果时**：例如，使用 `foreach` 循环。
  - **调用聚合方法时**：例如 `Count()`、`Sum()`、`Average()`。
  - **调用转换方法时**：例如 `ToList()`、`ToArray()`、`ToDictionary()`。

**优点：**

- **性能优化**：只有在必要时才执行查询。如果查询结果从未使用，则不会产生开销。
- **链式操作效率**：可以多次追加 LINQ 操作符，所有操作都会在一次执行中合并，而不是每次操作都扫描数据。
- **与数据库的集成**：对于 LINQ to Entities (EF Core)，这意味着查询表达式树会被发送到数据库提供程序，由它**一次性翻译成单个 SQL 查询**并在数据库端执行，而不是分多次从数据库拉取数据到内存再处理。

示例：延迟执行

```CS
List<int> numbers = new List<int> { 1, 2, 3, 4, 5 };

Console.WriteLine("Defining query...");
// 这里只是定义了查询，尚未执行
var query = numbers.Where(n => n > 2).Select(n => n * 10);

Console.WriteLine("Query defined, not executed yet.");

// 第一次执行：遍历
Console.WriteLine("Executing query (first time)...");
foreach (var item in query)
{
    Console.WriteLine(item);
}
// Output: 30, 40, 50

// 在此期间，原始集合被修改
numbers.Add(6);
numbers.Add(7);

// 第二次执行：再次遍历
Console.WriteLine("Executing query (second time, after modification)...");
foreach (var item in query)
{
    Console.WriteLine(item); // 结果会包含 60 和 70
}
// Output: 30, 40, 50, 60, 70 (因为查询是延迟执行的，每次执行都基于当前 numbers 集合)

// 立即执行：使用 ToList()
Console.WriteLine("Executing query immediately with ToList()...");
var immediateResult = numbers.Where(n => n > 2).Select(n => n * 10).ToList();
// 此时查询已经执行并将结果存储在 immediateResult 中

numbers.Add(8); // 此时再添加，不会影响 immediateResult

Console.WriteLine("Immediate result:");
foreach (var item in immediateResult)
{
    Console.WriteLine(item); // 结果不包含 80
}
```

### LINQ与EF Core

当你在 EF Core 中使用 LINQ 时，你使用的是 **LINQ to Entities**。它的工作原理是：

1. 你编写的 LINQ 查询会被 EF Core 转换为一个**表达式树**。
2. EF Core 的查询提供程序会**解析这个表达式树**。
3. 将其**翻译成相应的 SQL 语句**。
4. 将 SQL 语句发送到数据库执行。
5. 从数据库获取结果，并将其**物化 (materialize)** 为 C# 实体对象。

**关键概念**

- **`IEnumerable<T>`**: 代表内存中的可迭代集合。`LINQ to Objects` 使用它。
- **`IQueryable<T>`**: 代表一个可查询的数据源。`LINQ to Entities`（以及其他 LINQ 提供程序，如 LINQ to SQL）使用它。

当你在 EF Core 中通过 `DbContext.DbSet<T>` 启动查询时，例如 `context.Products`，它返回的是一个 **`IQueryable<Product>`**。

当你对 `IQueryable<T>` 应用 LINQ 操作符时（如 `Where()`、`OrderBy()`），它们会继续返回 `IQueryable<T>`，并且**不执行数据库查询**。只有当你执行了会触发查询的操作（如 `ToList()`、`FirstOrDefault()`、`Count()`）时，EF Core 才会生成 SQL 并与数据库交互。

示例:

```CS
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
}

public class MyDbContext : DbContext
{
    public DbSet<Product> Products { get; set; } = null!;
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) =>
        optionsBuilder.UseSqlServer("YourConnectionString");
}

public async Task QueryProductsWithLinqToEntities()
{
    using (var context = new MyDbContext())
    {
        // 这是一个 IQueryable<Product>，此时没有执行数据库查询
        var query = context.Products
                           .Where(p => p.Price > 50)
                           .OrderBy(p => p.Name);

        Console.WriteLine("Query defined for database, not executed yet.");

        // 调用 ToListAsync() 会触发 SQL 查询并从数据库获取数据
        Console.WriteLine("Executing database query...");
        var expensiveProducts = await query.ToListAsync();

        Console.WriteLine("Products fetched from database:");
        foreach (var product in expensiveProducts)
        {
            Console.WriteLine($"- {product.Name} (Price: {product.Price})");
        }
    }
}
```

当上述代码执行时，EF Core 会将 `Where(p => p.Price > 50).OrderBy(p => p.Name)` 翻译成一个 SQL `SELECT` 语句，其中包含 `WHERE Price > 50` 和 `ORDER BY Name` 子句，并在数据库中执行一次。

---

并非所有的 LINQ 操作符或复杂的表达式都能被 EF Core 翻译成 SQL：

- **服务器端求值 (Server-side Evaluation)**：EF Core 尽可能地将查询翻译成 SQL，并在数据库服务器上执行。这是最高效的方式。
- **客户端求值 (Client-side Evaluation)**：如果 EF Core 无法将 LINQ 表达式翻译成 SQL，它会先从数据库中拉取数据到内存，然后**在内存中**执行剩余的 LINQ 操作。

**什么时候会发生客户端求值？**

- 当你使用 C# 特有的方法或逻辑，这些逻辑没有对应的 SQL 函数时（例如，某些复杂的字符串操作、自定义方法）。
- 当你明确调用 `AsEnumerable()` 或 `ToList()` 等方法，强制将数据拉取到内存后。

**客户端求值的危害：**

- **性能问题**：如果在大数据集上发生客户端求值，可能导致从数据库拉取**大量不必要的数据**到应用程序内存，造成网络I/O和内存开销。
- **潜在错误**：有时客户端求值可能导致意外的结果。

**最佳实践**：

- **尽量让查询在服务器端执行**：这意味着尽量使用 EF Core 能够翻译成 SQL 的 LINQ 操作和表达式。
- **监控日志**：通过 EF Core 的日志，你可以看到生成的 SQL。如果发现 SQL 查询没有包含你预期过滤或排序，那可能就是发生了客户端求值。

## 部分类/方法

### 部分类

**部分类**允许你将一个类的定义分散到多个物理文件中。在编译时，这些分散的部分会被编译器合并成一个完整的类。

#### 语法

要定义一个部分类，你需要在类的每个部分定义前面加上 `partial` 关键字。

```C#
// File: MyClass.Part1.cs
public partial class MyClass
{
    public void Method1()
    {
        Console.WriteLine("Method1 from Part1");
    }

    public int Property1 { get; set; }
}

// File: MyClass.Part2.cs
public partial class MyClass
{
    public void Method2()
    {
        Console.WriteLine("Method2 from Part2");
    }

    public string Property2 { get; set; }
}

// File: MyClass.Part3.cs
public partial class MyClass
{
    public MyClass() // 构造函数也可以在任何部分定义
    {
        Console.WriteLine("MyClass instance created.");
    }

    public void CommonMethod()
    {
        Method1();
        Method2();
        Console.WriteLine("CommonMethod from Part3");
    }
}
```

当编译上述代码时，C# 编译器会将所有带有 `partial` 关键字且名称相同的类定义合并成一个单一的 `MyClass` 类。

```C#
// 编译后，MyClass 看起来就像这样 (逻辑上)
public class MyClass
{
    public MyClass()
    {
        Console.WriteLine("MyClass instance created.");
    }

    public void Method1()
    {
        Console.WriteLine("Method1 from Part1");
    }

    public int Property1 { get; set; }

    public void Method2()
    {
        Console.WriteLine("Method2 from Part2");
    }

    public string Property2 { get; set; }

    public void CommonMethod()
    {
        Method1();
        Method2();
        Console.WriteLine("CommonMethod from Part3");
    }
}
```

使用时，与普通类没有区别：

```C#
MyClass obj = new MyClass();
obj.Method1();
obj.Method2();
obj.CommonMethod();
obj.Property1 = 10;
obj.Property2 = "Test";
```

#### 使用场景

##### 多团队并行开发

##### 代码生成器协作

```CS
// 文件1：Form.Designer.cs（自动生成）
public partial class MainForm
{
    private Button button1;
    private void InitializeComponent() { /* 设计器代码 */ }
}

// 文件2：Form.cs（手动编写）
public partial class MainForm
{
    private void button1_Click(object sender, EventArgs e)
    {
        MessageBox.Show("Button clicked!");
    }
}
```



##### 大型类的逻辑分组



#### 注意事项

- **所有部分都必须用 `partial` 关键字标记。**
- **所有部分必须在同一个程序集和命名空间中。**
- **访问修饰符必须一致**：如果一个部分声明为 `public partial class MyClass`，那么所有其他部分也必须声明为 `public partial class MyClass`。
- **基类和接口**：如果一个部分声明了基类或接口，那么其他部分不能声明不同的基类。但是，其他部分可以声明额外的接口。最终的类会实现所有部分声明的接口。

```C#
// File 1
public partial class MyClass : BaseClass, IInterface1 { }
// File 2
public partial class MyClass : IInterface2 { } // OK, 最终 MyClass 继承 BaseClass 并实现 IInterface1, IInterface2
```

- **成员合并**：所有字段、属性、方法、事件和构造函数等成员都会被合并。
- **同一个成员不能在多个部分中定义**：例如，你不能在 `MyClass.Part1.cs` 中定义 `Method1()`，又在 `MyClass.Part2.cs` 中定义一个同名的 `Method1()`。
- **构造函数**：可以定义在任何一个部分。如果定义了多个，它们会根据普通的构造函数重载规则进行合并。
- **泛型参数**：所有部分必须使用相同的泛型参数。

### 部分方法

部分方法允许你在一个部分类中声明一个方法的签名，而在另一个部分类中选择性地提供其实现。

部分方法的主要目的是为了**支持代码生成器**。它们提供了一种**钩子 (hook)** 机制，让自动生成的代码可以调用由开发者手动实现的方法。

- **代码生成器集成**：一个代码生成器可以生成一个调用部分方法的模板。如果开发者提供了该部分的实现，那么代码就会执行；如果没有提供，编译器会**自动移除**对该部分方法的所有调用，从而避免了未实现方法的编译错误和运行时开销。
- **可选的行为**：允许你定义一个方法，它在某些情况下（当有实现时）执行特定逻辑，而在其他情况下（当没有实现时）被完全忽略。

#### 语法

部分方法需要满足以下条件：

- **必须定义在 `partial class` 中。**
- **方法声明必须是 `partial` 关键字。**
- **必须是 `void` 返回类型。** (C# 9.0 之后放宽了此限制，可以有非 `void` 返回类型，但必须有实现)
- **不能有访问修饰符**（隐式为 `private`）。
- **必须是声明 (Declaration) 和实现 (Implementation) 分开。** 声明只有方法签名，实现包含方法体。
- **声明和实现可以在同一个部分类中，但通常在不同的部分类中。**

```C#
// File: MyClass.Generated.cs (由代码生成器生成)
public partial class MyClass
{
    // 部分方法的声明 (没有方法体)
    partial void OnInitialized(); // 必须是 void (C# 9.0之前)

    public void Initialize()
    {
        Console.WriteLine("MyClass.Initialize() called by generated code.");
        // 生成的代码在这里调用部分方法
        OnInitialized(); // 如果没有实现，这行调用在编译时会被移除
        Console.WriteLine("MyClass.Initialize() finished.");
    }
}

// File: MyClass.UserCode.cs (由开发者手动编写)
public partial class MyClass
{
    // 部分方法的实现 (可以有方法体)
    partial void OnInitialized()
    {
        Console.WriteLine("OnInitialized() called from user code.");
        // 这里可以添加自定义的初始化逻辑
    }

    // C# 9.0+ 允许非 void 返回值，但必须有实现
    partial int GetConfigValue(string key);

    // GetConfigValue 的实现
    partial int GetConfigValue(string key)
    {
        if (key == "Timeout") return 1000;
        return 0;
    }
}
```

- **如果部分方法只有声明，没有实现**：编译器会移除所有对该部分方法的调用。这意味着，即使你调用了 `OnInitialized()`，如果它的实现不存在，这行代码也会在编译时被优化掉，不会产生任何运行时开销。
- **如果部分方法有实现**：那么它就是一个普通的私有方法，其调用会正常执行。

#### 使用场景

##### 轻量级事件钩子

```CS
// 文件1：Entity.Generated.cs（工具生成）
public partial class Entity
{
    partial void OnCreated(); // 无实际实现

    public Entity()
    {
        OnCreated(); // 如果开发者未实现，编译器会移除该调用
    }
}

// 文件2：Entity.Extensions.cs（手动扩展）
public partial class Entity
{
    partial void OnCreated()
    {
        Console.WriteLine("Entity created!");
    }
}
```



##### 条件编译扩展

利用**预处理器指令 (Preprocessor Directives)** 来控制源代码在编译时哪些部分被包含或排除。它允许你根据定义的符号 (symbols) 来编译不同的代码块，从而适应不同的构建配置、目标平台或特性集。

```CS
public partial class Logger
{
    partial void LogDebug(string message);

    public void Log(string message)
    {
#if DEBUG
        LogDebug(message); // 仅在DEBUG模式下生效
#endif
    }
}
```



#### 注意事项

- **必须定义在 `partial class` 中。**
- **声明和实现都必须使用 `partial` 关键字。**
- **访问修饰符**：部分方法的声明和实现都不能有访问修饰符。它们隐式是 `private` 的。
- **返回类型**：
  - **C# 9.0 之前**：部分方法必须返回 `void`。
  - **C# 9.0 及以后**：部分方法可以有非 `void` 返回类型，但**如果是非 `void` 返回类型，则它必须有一个实现**。如果没有实现，编译器会报错。
- **参数**：部分方法的参数可以包含 `in`, `ref`, `out` 关键字。声明和实现中的参数签名必须完全匹配。
- **静态/实例**：部分方法可以是静态的，也可以是实例方法。
- **泛型**：部分方法可以是泛型方法。
- **委托**：不能直接将部分方法转换为委托，因为它在没有实现时可能被移除。
- **不能是 `virtual`、`abstract`、`override`、`new`、`extern` 成员。**
