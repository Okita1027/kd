---
title: API接口
shortTitle: API接口
description: API接口
date: 2025-07-12 11:08:18
categories: [.NET, .NET CORE]
tags: [.NET]
order: 5
---

## 概述

[API 概述 | Microsoft Learn](https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/apis?view=aspnetcore-8.0)

ASP.NET Core 支持两种创建 API 的方法：基于控制器的方法和最小 API。 API 项目中的控制器是派生自`ControllerBase`的类。 最小 API 在 Lambda 或方法中使用逻辑处理程序定义终结点。 

最小 API 的设计默认隐藏了主机类，并通过将函数作为 Lambda 表达式的扩展方法专注于配置和扩展性。 控制器是可以通过构造函数注入或属性注入采用依赖关系的类，通常遵循面向对象的模式。 最小 API 通过访问服务提供程序等一系列其他方法支持依赖关系注入。

---

示例实体类代码：

```C#
namespace APIWithControllers;

public class WeatherForecast
{
    public DateOnly Date { get; set; }

    public int TemperatureC { get; set; }

    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);

    public string? Summary { get; set; }
}
```

基于控制器的示例代码：
```C#
namespace APIWithControllers;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();
        var app = builder.Build();

        app.UseHttpsRedirection();

        app.MapControllers();

        app.Run();
    }
}
```

```C#
using Microsoft.AspNetCore.Mvc;

namespace APIWithControllers.Controllers;
[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(ILogger<WeatherForecastController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "GetWeatherForecast")]
    public IEnumerable<WeatherForecast> Get()
    {
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        })
        .ToArray();
    }
}
```

最小 API 示例代码：

```C#
namespace MinimalAPI;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var app = builder.Build();

        app.UseHttpsRedirection();

        var summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        app.MapGet("/weatherforecast", (HttpContext httpContext) =>
        {
            var forecast = Enumerable.Range(1, 5).Select(index =>
                new WeatherForecast
                {
                    Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                    TemperatureC = Random.Shared.Next(-20, 55),
                    Summary = summaries[Random.Shared.Next(summaries.Length)]
                })
                .ToArray();
            return forecast;
        });

        app.Run();
    }
}
```

基于控制器的 API 有一些功能还没有被最小 API 所支持或实现。 其中包括:

- 不提供对模型绑定的内置支持（[IModelBinderProvider](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.mvc.modelbinding.imodelbinderprovider)、[IModelBinder](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.mvc.modelbinding.imodelbinder)）。 可以使用自定义绑定填充码添加支持。
- 不提供对验证的内置支持 ([IModelValidator](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.mvc.modelbinding.validation.imodelvalidator))。
- 不支持[应用程序部件](https://learn.microsoft.com/zh-cn/aspnet/core/mvc/advanced/app-parts?view=aspnetcore-8.0)或[应用程序模型](https://learn.microsoft.com/zh-cn/aspnet/core/mvc/controllers/application-model?view=aspnetcore-8.0)。 无法应用或生成自己的约定。
- 没有内置视图呈现支持。 我们建议使用 [Razor Pages](https://learn.microsoft.com/zh-cn/aspnet/core/tutorials/razor-pages/razor-pages-start?view=aspnetcore-8.0) 来呈现视图。
- 不支持 [JsonPatch](https://www.nuget.org/packages/Microsoft.AspNetCore.JsonPatch/)
- 不支持 [OData](https://www.nuget.org/packages/Microsoft.AspNetCore.OData/)

## 基于控制器的API

### 操作返回类型

ASP.NET Core 提供以下 Web API 控制器操作返回类型选项：

- [特定类型](https://learn.microsoft.com/zh-cn/aspnet/core/web-api/action-return-types?view=aspnetcore-8.0#specific-type)
- [IActionResult](https://learn.microsoft.com/zh-cn/aspnet/core/web-api/action-return-types?view=aspnetcore-8.0#iactionresult-type)
- [ActionResult](https://learn.microsoft.com/zh-cn/aspnet/core/web-api/action-return-types?view=aspnetcore-8.0#actionresultt-type)
- [HttpResults](https://learn.microsoft.com/zh-cn/aspnet/core/web-api/action-return-types?view=aspnetcore-8.0#httpresults-type)

| 类型                              | 适用场景                      | 示例                          |
| --------------------------------- | ----------------------------- | ----------------------------- |
| `IActionResult`                   | ✅ 最通用，返回多种响应类型    | `return Ok(obj);`             |
| `ActionResult<T>`                 | ✅ 推荐用于 Web API            | `return obj;` 或 `NotFound()` |
| 具体实现类（如 `OkResult`）       | 返回具体 HTTP 状态码          | `return new OkResult();`      |
| 实体对象（T）                     | 简单 API 返回对象（隐式 200） | `return user;`                |
| `Task<T>` / `Task<IActionResult>` | 异步方法返回类型              | `async Task<IActionResult>`   |
| `void`（不推荐）                  | 无返回值动作（如日志）        | `void DoSomething()`          |

#### `IActionResult`

**用途**：这是一个**接口**，表示一个抽象的动作结果。它提供了最大的灵活性，允许你返回各种 HTTP 响应类型，包括不同的状态码、JSON、文件、重定向等。

**行为**：你需要实例化一个实现了 `IActionResult` 的具体类（例如 `OkResult`, `NotFoundResult`, `JsonResult`, `StatusCodeResult` 等），并从方法中返回它。

**适用场景**：当你需要根据业务逻辑返回多种不同的 HTTP 状态码或内容类型时，这是**最灵活也是最常用的返回类型**。

**控制器基类提供的辅助方法**：`ControllerBase` 和 `Controller` 提供了许多便利的辅助方法来创建 `IActionResult` 实例，例如：

| 返回方法 / 类                                        | 状态码 | 说明                        |
| ---------------------------------------------------- | ------ | --------------------------- |
| `Ok()` / `Ok(object)`                                | 200    | 成功，带或不带数据          |
| `Created()` / `CreatedAtAction()`/`CreatedAtRoute()` | 201    | 创建成功，并附带位置头部    |
| `NoContent()`                                        | 204    | 操作成功但无内容返回        |
| `BadRequest()`                                       | 400    | 客户端请求错误              |
| `Unauthorized()`                                     | 401    | 未授权                      |
| `Forbid()`                                           | 403    | 权限不足                    |
| `NotFound()`                                         | 404    | 资源未找到                  |
| `Conflict()`                                         | 409    | 冲突（如资源已存在）        |
| `StatusCode(500)`                                    | 任意   | 返回自定义状态码            |
| `File()`                                             | 200    | 返回文件内容                |
| `Redirect()`                                         | 302    | 重定向到其他 URL            |
| `Content()`                                          | 200    | 返回纯文本                  |
| `Json()`                                             | 200    | 返回 JSON（Razor 页面专用） |

#### `ActionResult<T>`

**用途**：结合了 `IActionResult` 的灵活性和直接返回数据类型 `T` 的简洁性。

**行为**：可以直接返回类型 `T` 的实例，此时它会被序列化为 JSON 并返回 200 OK。也可以返回任何 `IActionResult` 类型，实现灵活的状态码和内容。

**适用场景**：当你的 API 通常返回**特定类型的数据**，但偶尔也需要返回像 404 Not Found、400 Bad Request 这样的**状态码结果**时，这是**最推荐的返回类型**。

示例：

```C#
[HttpGet("{id}")]
public ActionResult<Product> GetProduct(int id) // 返回 Product 或 IActionResult
{
    var product = _productService.GetProductById(id);

    if (product == null)
    {
        return NotFound(); // 返回 404 Not Found，这里隐式转换为 ActionResult<Product>
    }
    return product; // 直接返回 Product 对象，会返回 200 OK 和产品 JSON
}
```

**对比 `IActionResult`**:

- `IActionResult` 只能返回 `IActionResult` 对象。
- `ActionResult<T>` **既可以返回 `T` 对象，也可以返回 `IActionResult` 对象**。当返回 `T` 对象时，它会自动包装成 `OkObjectResult`（返回 200 OK）。

#### 异步返回类型

> [!NOTE]
>
> 对于任何涉及 I/O 操作（数据库、网络请求）的动作方法，都应使用异步模式，以避免阻塞线程池并提高应用程序的吞吐量。

`Task<T>`、`Task<IActionResult>`、`Task<ActionResult<T>>`

**用途**：当你的动作方法执行异步操作（例如，数据库访问、调用外部 API）时，应使用这些异步返回类型。

**行为**：与同步版本类似，但它们返回一个表示异步操作的任务。

**适用场景**：几乎所有的 Web API 动作方法都应是异步的，以提高服务器的并发处理能力。

```C#
[HttpGet("{id}")]
public async Task<ActionResult<Product>> GetProductAsync(int id)
{
    var product = await _productService.GetProductByIdAsync(id);
    if (product == null)
    {
        return NotFound();
    }
    return product;
}

[HttpPost]
public async Task<IActionResult> CreateProductAsync([FromBody] Product product)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }
    await _productService.AddProductAsync(product);
    return CreatedAtAction(nameof(GetProductAsync), new { id = product.Id }, product);
}
```

#### 特定类型

最基本的操作返回基元或复杂数据类型（例如`string`或自定义对象）

```C#
[HttpGet]
public Task<List<Product>> Get() =>
    _productContext.Products.OrderBy(p => p.Name).ToListAsync();
```

**自定义状态码与响应**

```C#
return StatusCode(418, new
{
    code = 418,
    message = "I'm a teapot ☕"
});
```

**文件、下载内容**

```C#
public IActionResult Download()
{
    var fileBytes = System.IO.File.ReadAllBytes("report.pdf");
    return File(fileBytes, "application/pdf", "report.pdf");
}
```

**链接位置（201 Created）**

```C#
return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
```

```txt
// 响应头中包含：
Location: /api/user/123
```

**统一封装格式（自定义Result）**

```JSON
// 常见的响应格式
{
  "code": 0,
  "message": "成功",
  "data": { ... }
}
```

```C#
// 响应类定义
public class ApiResponse<T>
{
    public int Code { get; set; } = 0;
    public string Message { get; set; } = "成功";
    public T Data { get; set; }
}
```

```CS
// 最终返回结果
return Ok(new ApiResponse<User> { Data = user });
```

### 处理JSON Patch请求

[ASP.NET Core Web API 中的 JSON 修补程序 | Microsoft Learn](https://learn.microsoft.com/zh-cn/aspnet/core/web-api/jsonpatch?view=aspnetcore-8.0)

#### 包安装

JSON Patch基于 `Newtonsoft.Json`，并且需要 [`Microsoft.AspNetCore.Mvc.NewtonsoftJson`](https://www.nuget.org/packages/Microsoft.AspNetCore.Mvc.NewtonsoftJson/) NuGet 包。

- 安装 [`Microsoft.AspNetCore.Mvc.NewtonsoftJson`](https://www.nuget.org/packages/Microsoft.AspNetCore.Mvc.NewtonsoftJson/) NuGet 包。

  ```BASH
  dotnet add package Microsoft.AspNetCore.JsonPatch
  dotnet add package Microsoft.AspNetCore.Mvc.NewtonsoftJson # 如果你依赖 Newtonsoft.Json 或遇到问题
  ```

- 调用 [AddNewtonsoftJson](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.extensions.dependencyinjection.newtonsoftjsonmvcbuilderextensions.addnewtonsoftjson)、配置 JSON Patch :

  ```CS
  // Program.cs
  var builder = WebApplication.CreateBuilder(args);
  
  // 如果使用 Controllers
  builder.Services.AddControllers()
      .AddNewtonsoftJson(); // 添加 Newtonsoft.Json 支持，这对 JsonPatchDocument 绑定是必需的
  
  // 如果使用 Minimal APIs
  // Minimal APIs 通常默认支持 System.Text.Json，JsonPatchDocument 应该可以直接绑定。
  // 但如果你在 Minimal APIs 中也引入了 Newtonsoft.Json，并希望其处理 Json Patch，
  // 可能需要更复杂的设置，或直接使用 System.Text.Json。
  // 对于 System.Text.Json，确保你有 Microsoft.AspNetCore.JsonPatch 包即可，通常无需额外 AddJson()。
  
  var app = builder.Build();
  // ...
  app.Run();
  ```

> [!important]
>
> 对于默认使用 `System.Text.Json` 的 .NET 6+ 应用，通常**只需要安装 `Microsoft.AspNetCore.JsonPatch` 包即可**，`AddNewtonsoftJson()` 只有当你明确想要使用 `Newtonsoft.Json` 进行所有 JSON 处理时才需要。`Microsoft.AspNetCore.JsonPatch` 内部会自动适配 `System.Text.Json`。

> JsonPatch 要求将 `Content-Type` 标头设置为 `application/json-patch+json`。

#### 处理JSON Patch

1. 定义DTO或者实体类

这个类代表了你想要部分修改的资源。`JsonPatchDocument<T>` 中的 `T` 必须是这个类型。

```CS
// Models/Product.cs
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsAvailable { get; set; }
}
```

2. 创建一个 `HttpPatch` 动作方法

这个方法将接收一个 `JsonPatchDocument<T>` 作为请求体。

```CS
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    // 模拟数据存储
    private static List<Product> _products = new List<Product>
    {
        new Product { Id = 1, Name = "Laptop", Price = 1200.00m, Description = "Powerful machine", IsAvailable = true },
        new Product { Id = 2, Name = "Mouse", Price = 25.00m, Description = "Wireless mouse", IsAvailable = false }
    };

    // GET /api/products/{id}
    [HttpGet("{id}")]
    public ActionResult<Product> GetProduct(int id)
    {
        var product = _products.FirstOrDefault(p => p.Id == id);
        if (product == null) return NotFound();
        return Ok(product);
    }

    // PATCH /api/products/{id}
    // Content-Type 必须是 application/json-patch+json
    [HttpPatch("{id}")]
    public IActionResult PatchProduct(int id, [FromBody] JsonPatchDocument<Product> patchDoc)
    {
        // 1. 从数据存储中获取要更新的原始对象
        var productToUpdate = _products.FirstOrDefault(p => p.Id == id);
        if (productToUpdate == null)
        {
            return NotFound();
        }

        // 2. 将 JsonPatchDocument 应用到原始对象
        // ApplyTo 方法会根据 patchDoc 中描述的操作，修改 productToUpdate 对象。
        // ModelState 是用于捕获应用操作时可能产生的验证错误。
        patchDoc.ApplyTo(productToUpdate, ModelState);

        // 3. 检查模型状态 (Model State)
        // 如果 JsonPatch 操作本身（例如，尝试修改不存在的路径）导致验证错误，
        // 或者应用补丁后，更新后的对象违反了数据注解验证规则，ModelState.IsValid 会是 false。
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState); // [ApiController] 会将此格式化为 ProblemDetails
        }

        // 4. (可选) 重新验证整个对象
        // 如果你的对象有更复杂的验证逻辑（例如，跨字段的验证），
        // 建议在应用补丁后再次手动触发验证。
        TryValidateModel(productToUpdate);
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // 5. 保存更新后的对象到数据存储
        // 模拟保存，实际中可能是 _dbContext.SaveChanges() 或更新 repository
        // _products.RemoveAll(p => p.Id == id);
        // _products.Add(productToUpdate);

        // 6. 返回成功响应
        return NoContent(); // 204 No Content 是 PATCH 成功的常见响应
        // 如果你希望返回更新后的资源，也可以返回 Ok(productToUpdate);
    }
}
```

3. 客户端发送JSON Patch请求

客户端发送 `PATCH` 请求，并且 `Content-Type` 头必须设置为 **`application/json-patch+json`**。请求体是一个 JSON 数组，每个元素都是一个操作对象。

JSON Patch 操作类型 (RFC 6902)：

| 操作 (op) | 描述                           | 必需字段    | 示例                                                         |
| --------- | ------------------------------ | ----------- | ------------------------------------------------------------ |
| add       | 添加值到数组末尾或对象属性     | path, value | { "op": "add", "path": "/tags/-", "value": "new" }           |
| remove    | 移除值或属性                   | path        | { "op": "remove", "path": "/price" }                         |
| replace   | 替换值或属性                   | path, value | { "op": "replace", "path": "/name", "value": "Updated Product" } |
| copy      | 从一个路径复制值到另一个路径   | from, path  | { "op": "copy", "from": "/oldName", "path": "/newName" }     |
| move      | 从一个路径移动值到另一个路径   | from, path  | { "op": "move", "from": "/oldProp", "path": "/newProp" }     |
| test      | 测试路径中的值是否与给定值相等 | path, value | { "op": "test", "path": "/status", "value": "active" }       |

客户端请求示例：

假设要更新 `id` 为 1 的产品：

1. 将 `Name` 从 "Laptop" 修改为 "Super Laptop"。
2. 将 `Price` 修改为 `1300.00`。
3. 将 `IsAvailable` 设置为 `true`。

```HTTP
PATCH /api/products/1 HTTP/1.1
Content-Type: application/json-patch+json
Host: localhost:5000

[
  { "op": "replace", "path": "/name", "value": "Super Laptop" },
  { "op": "replace", "path": "/price", "value": 1300.00 },
  { "op": "replace", "path": "/isAvailable", "value": true }
]
```

更多示例：

- 添加新属性 (如果 `Product` 类支持动态属性)：

  ```JSON
  [
    { "op": "add", "path": "/color", "value": "red" }
  ]
  ```

- 移除属性

  ```JSON
  [
    { "op": "remove", "path": "/description" }
  ]
  ```

- 添加到数组（假设 `Product` 有个 `Tags` 属性是 `List<string>`）、插入到指定索引

  ```JSON
  [
    { "op": "add", "path": "/tags/-", "value": "electronics" }, // "-" 表示添加到数组末尾
    { "op": "add", "path": "/tags/0", "value": "new_tag_at_start" }
  ]
  ```

- 测试操作（如果`test`失败，整个Patch都会失败）

  ```json
  [
    { "op": "test", "path": "/isAvailable", "value": false }, // 只有当 isAvailable 为 false 时才继续
    { "op": "replace", "path": "/name", "value": "Unavailable Item" }
  ]
  ```

### 格式化响应数据

| 格式   | MIME 类型            | 默认支持 | 常用格式化器                              |
| ------ | -------------------- | -------- | ----------------------------------------- |
| JSON   | `application/json`   | ✅        | `System.Text.Json` 或 `Newtonsoft.Json`   |
| XML    | `application/xml`    | ❌        | 需手动添加 `XmlSerializerOutputFormatter` |
| 纯文本 | `text/plain`         | ✅        | `StringOutputFormatter`                   |
| HTML   | `text/html`（Razor） | ✅        | 视图引擎自动处理                          |

#### 如何支持XML格式

1. 安装NuGet包

   ```BASH
   dotnet add package Microsoft.AspNetCore.Mvc.Formatters.Xml
   ```

2. 配置XML格式化器

   ```CS
   // Program.cs
   var builder = WebApplication.CreateBuilder(args);
   
   builder.Services.AddControllers(options =>
   {
       // 添加 XmlSerializerInputFormatter 用于处理 XML 请求体
       options.InputFormatters.Add(new XmlSerializerInputFormatter(options));
       // 添加 XmlSerializerOutputFormatter 用于生成 XML 响应
       options.OutputFormatters.Add(new XmlSerializerOutputFormatter());
   });
   
   var app = builder.Build();
   // ...
   app.Run();
   ```

现在，当客户端发送 `Accept: application/xml` 请求头时，如果动作方法返回一个对象，ASP.NET Core 会尝试将其序列化为 XML。

### 自定义格式化程序

**自定义格式化程序**允许你将控制器返回的数据对象，**序列化为除默认 JSON/XML 外的其他格式**，例如：

- CSV
- Markdown
- YAML
- Excel
- 自定义 MIME 类型（如 `application/vnd.company+json`）等

**实现方法：**

1. 继承 `TextOutputFormatter` 或 `OutputFormatter`
2. 重写关键方法：`CanWriteResult()` 和 `WriteResponseBodyAsync()`
3. 设置支持的内容类型和编码
4. 注册到 `MvcOptions.OutputFormatters` 中

### 分析器

| 类型                    | 说明                                     | 示例                                 |
| ----------------------- | ---------------------------------------- | ------------------------------------ |
| **编译器分析器**        | Roslyn 提供的内置 C# 编译器分析器        | 空变量警告、未使用的 `using`         |
| **.NET SDK 分析器**     | 微软官方提供的代码质量分析器（默认启用） | `CA` 系列警告，如 `CA2007`           |
| **ASP.NET Core 分析器** | 对 ASP.NET 使用习惯的特定检查            | JSON 序列化、Controller 注解等问题   |
| **第三方分析器**        | 社区或公司自定义规范检查                 | StyleCop、SonarAnalyzer、ReSharper   |
| **源生成器 + 分析器**   | 分析源代码并生成代码                     | Swashbuckle、Mapster、EF Core 生成器 |

#### 禁用分析器

在代码中使用 `#pragma warning`：

```CS
#pragma warning disable CA2007
await DoSomethingAsync();
#pragma warning restore CA2007
```

在 `.editorconfig` 中禁用：

```CS
dotnet_diagnostic.CA2007.severity = none
```

#### 定制分析器

1. **`GlobalUsings` 文件**：在解决方案资源管理器中右键点击项目 -> “属性” -> “代码分析” -> “通用” 或 “规则集”，可以配置哪些规则集应用于项目。

2. **`.editorconfig` 文件**：这是最推荐的方式，因为它可以在团队中共享编码风格和分析器规则，并且对 IDE 具有很好的支持。你可以在 `.editorconfig` 文件中针对特定的规则 ID 配置其严重级别（`error`, `warning`, `suggestion`, `info`, `silent` 或 `none`）。

   **示例 `.editorconfig` 条目**：

   ```INI
   # 强制将所有 CS8019 警告提升为错误
   dotnet_diagnostic.CS8019.severity = error
   
   # 禁用 SA1600 (Missing XML comment for publicly visible type or member)
   dotnet_diagnostic.SA1600.severity = none
   ```

3. **项目文件 (`.csproj`)**：你也可以在 `.csproj` 文件中通过 `<NoWarn>` 或 `<WarningsAsErrors>` 属性来抑制或提升某些警告。但这通常不如 `.editorconfig` 灵活和推荐。

   ```XML
   <Project Sdk="Microsoft.NET.Sdk.Web">
     <PropertyGroup>
       <TargetFramework>net8.0</TargetFramework>
       <ImplicitUsings>enable</ImplicitUsings>
       <WarningsAsErrors>$(WarningsAsErrors);CS0618</WarningsAsErrors>
       <NoWarn>$(NoWarn);CA1000</NoWarn>
     </PropertyGroup>
     </Project>
   ```


### HttpRepl

`HttpRepl` 是一个微软提供的 **命令行工具**，用于探索和调试 ASP.NET Core Web API。全称是 **HTTP REPL（Read-Eval-Print-Loop）**。

它像是 Web API 的“命令行浏览器”，你可以：

- 连接到 Web API 端点
- 浏览控制器和操作
- 发起 GET、POST、PUT、DELETE 请求
- 自动提示路由、参数、可用 HTTP 动作
- 用交互方式测试接口，而不需要 Postman、curl 或 Swagger

## 最小API



## OpenAPI

