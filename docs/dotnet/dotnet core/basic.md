---
title: 基础篇
shortTitle: 基础篇
description: .NET CORE
date: 2024-07-08 17:08:18
categories: [.NET, .NET CORE]
tags: [.NET]
---



## 依赖注入

.NET中的DI与Spring中的IOC极其相似

### 服务注册

**常见注册方式：**

- `AddSingleton<TService, TImplementation>()`
  - **生命周期：** 单例。在整个应用程序的生命周期中只创建一次实例。
  - **适用场景：** 无状态服务、配置对象、缓存服务等。
- `AddScoped<TService, TImplementation>()`
  - **生命周期：** 作用域。在每个请求（例如，Web 请求）或每个作用域内只创建一次实例。
  - **适用场景：** 与特定请求相关的服务，如数据库上下文（DbContext）。
- `AddTransient<TService, TImplementation>()`
  - **生命周期：** 瞬时。每次请求该服务时都会创建一个新的实例。
  - **适用场景：** 轻量级、无状态的服务，每次使用都需要新实例的场景。

> **不推荐**的注册方式：可以忽略接口，直接注入实现类`AddScoped<TImplementation>`

### 服务消费

#### **构造函数注入**

这是推荐和最常用的方式。DI 容器会在创建对象时自动解析其构造函数中声明的依赖项。

```c#
//如果是Razor页面，继承的应该是PageModel
public class MyController : Controller
{
    private readonly IMyService _myService;

    public MyController(IMyService myService) // 构造函数注入
    {
        _myService = myService;
    }
}
```

#### **方法注入**

将依赖项作为方法参数传递。适用于某个方法需要特定依赖项，但整个类不需要的情况。

```c#
public class MyClass
{
    public void DoWork(ILogger logger)
    {
        logger.LogInformation("Doing work.");
    }
}
```

#### **属性注入**

通过公共属性注入依赖项。通常需要手动从容器中解析，或者使用特定的 IoC 容器扩展。在 .NET 的内置 DI 中不直接支持属性注入，除非手动从 `IServiceProvider` 解析。

```c#
// 不推荐的方式
public class MyClass
{
    public IMyService MyService { get; set; } // 属性
}
// 然后在某处手动解析并赋值
// myClass.MyService = serviceProvider.GetService<IMyService>();
```

#### 注意点

> 在使用`builder.Services.AddTransient<IMyService, MyService>()`注册服务后
>
> 注入时必须使用IMyService，若使用MyService则会报错

### IServiceProvider

`IServiceProvider` 是 DI 容器的核心接口，它提供了获取服务实例的能力。

- **`GetService<TService>()`：** 获取服务的实例。如果服务未注册或无法解析，则返回 `null`。
- **`GetRequiredService<TService>()`：** 获取服务的实例。如果服务未注册或无法解析，则抛出异常。

通常不建议直接在应用程序代码中频繁使用 `IServiceProvider` 进行服务定位（Service Location），因为这会降低代码的解耦性。它主要用于框架内部、需要动态解析服务的场景，或者在 `Program.cs` (或 `Startup.cs`) 中配置依赖时。

### 处理多个实现类的服务注册

#### 默认注册（后注册的会覆盖先注册的）

如果简单地多次注册同一个接口，**后注册的实现会覆盖先注册的实现。** 在这种情况下，只有最后注册的那个会被解析。

```c#
// Program.cs
builder.Services.AddTransient<IMyService, MyServiceA>(); // MyServiceA 被注册
builder.Services.AddTransient<IMyService, MyServiceB>(); // MyServiceB 覆盖了 MyServiceA
```

这种情况下，任何依赖 `IMyService` 的构造函数都会得到 `MyServiceB` 的实例。

#### 注册所有实现，通过 `IEnumerable<T>` 解析

如果想解析**所有注册的 `IMyService` 实现**，可以将它们全部注册，然后在需要的地方注入 `IEnumerable<IMyService>`。

```c#
// Program.cs
builder.Services.AddTransient<IMyService, MyServiceA>();
builder.Services.AddTransient<IMyService, MyServiceB>();

// ... 然后在消费者类中这样注入：
public class MyConsumer
{
    private readonly IEnumerable<IMyService> _services;

    public MyConsumer(IEnumerable<IMyService> services) // 注入所有实现
    {
        _services = services;
    }

    public void ExecuteAll()
    {
        foreach (var service in _services)
        {
            service.DoSomething(); // 会依次调用 MyServiceA 和 MyServiceB 的 DoSomething
        }
    }
}
```

在有用到 策略模式 的场景，需要根据运行时条件选择执行哪个服务，或者需要对所有注册的服务执行某个操作。

#### 使用工厂方法，根据条件注册特定实例

若希望根据某些条件在运行时决定注入哪个实例，可以使用工厂方法注册。

```c#
// Program.cs
builder.Services.AddTransient<MyServiceA>(); // 注册具体类型
builder.Services.AddTransient<MyServiceB>(); // 注册具体类型

// 通过工厂方法注册 IMyService
builder.Services.AddTransient<IMyService>(serviceProvider =>
{
    // 假设这里根据配置或某些运行时条件来决定
    var config = serviceProvider.GetRequiredService<IConfiguration>();
    var useServiceA = config.GetValue<bool>("UseServiceA");

    if (useServiceA)
    {
        return serviceProvider.GetRequiredService<MyServiceA>();
    }
    else
    {
        return serviceProvider.GetRequiredService<MyServiceB>();
    }
});
```

#### 使用命名服务（第三方库或手动实现）

.NET Core 内置的 DI 容器**不支持开箱即用的“命名服务”注册**（即像 Spring 那样通过名字来区分注入哪个实例）。如果需要这种功能，需要：

1. **使用第三方 DI 容器：** 例如 Autofac、Ninject 等，它们通常提供了命名注册的功能。
2. **手动实现工厂模式：** 注册一个工厂服务，该工厂服务根据传入的名称返回不同的 `IMyService` 实例。

```c#
// 假设您需要一个工厂来提供命名服务
public interface IMyServiceFactory
{
    IMyService GetService(string name);
}

public class MyServiceFactory : IMyServiceFactory
{
    private readonly IServiceProvider _serviceProvider; // 可以注入 IServiceProvider 来手动获取服务

    public MyServiceFactory(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public IMyService GetService(string name)
    {
        return name switch
        {
            "ServiceA" => _serviceProvider.GetRequiredService<MyServiceA>(),
            "ServiceB" => _serviceProvider.GetRequiredService<MyServiceB>(),
            _ => throw new ArgumentException("Unknown service name")
        };
    }
}

// Program.cs
builder.Services.AddTransient<MyServiceA>(); // 先注册具体类型
builder.Services.AddTransient<MyServiceB>();
builder.Services.AddSingleton<IMyServiceFactory, MyServiceFactory>(); // 注册工厂

// ... 然后在消费者类中这样注入和使用：
public class MyConsumerWithNamedService
{
    private readonly IMyServiceFactory _factory;

    public MyConsumerWithNamedService(IMyServiceFactory factory)
    {
        _factory = factory;
    }

    public void UseServiceA()
    {
        _factory.GetService("ServiceA").DoSomething();
    }
}
```



### 使用流程

1. 定义要交给容器管理的接口与实现类

2. 在主启动类中进行注册`builder.Services.Add生命周期<接口，实现类>`

   > 可以忽略接口，直接注入实现类，但不推荐这么做

3. 在要使用注入的类的构造函数中进行声明

### 生命周期

| 生命周期  | 方法                | 含义                                 |
| --------- | ------------------- | ------------------------------------ |
| Singleton | `AddSingleton<T>()` | 全局唯一实例，应用整个生命周期共享   |
| Scoped    | `AddScoped<T>()`    | 每个请求（或组件作用域）创建一个实例 |
| Transient | `AddTransient<T>()` | 每次请求服务时创建新实例             |

## 本机AOT

#### 定义

- 传统：.NET 应用程序发布后包含的是**中间语言 (IL) 代码**。当这些应用在用户电脑上运行时，需要安装 .NET 运行时环境 (CLR)。CLR 中的 **JIT (Just-In-Time) 编译器**会在运行时将 IL 代码动态编译成机器码。
- 本机AOT：在**应用程序发布时**，直接将 .NET 代码（包括您自己的代码和应用程序用到的 .NET 运行时组件）编译成**平台特定的、独立的机器码**。最终产物是一个可以直接在目标操作系统上运行的单一可执行文件。

#### 作用

- **启动速度飞快：** 代码已经预编译成机器码，省去了 JIT 编译的开销，应用程序启动时间大大缩短。这对于**命令行工具、无服务器函数（Serverless Functions）和微服务冷启动**等场景至关重要。
- **内存占用更低：** AOT 编译通常能进行更激进的优化，并移除未使用的框架代码，从而减少运行时内存消耗。这在**资源受限的容器环境**中非常有益。
- **部署包更小：** 尽管可执行文件包含了必要的运行时组件，但因为它去除了 JIT 编译器和许多不必要的框架部分，最终生成的单个文件通常比传统的“自包含”部署方式（包含完整的 JIT 和运行时库）要小。
- **部署更简便：** 只有一个文件，部署和分发变得异常简单。您无需担心目标机器上是否安装了正确版本的 .NET 运行时。
- **更高的安全性：** 不包含 JIT 编译器可以减少某些潜在的攻击面。

#### （不）适用场景

**适用：**

- **对启动速度有严格要求**的应用：如高性能 Web API 的微服务（尤其是在云上，冷启动时间很重要）、Serverless 函数。
- **对内存占用有严格要求**的应用：如部署在 Docker 容器、Kubernetes 集群中的微服务。
- **需要极简部署**的应用：如命令行工具、单个可执行文件的桌面应用。
- **资源受限的环境：** 例如物联网 (IoT) 设备。

**不推荐：**

- **依赖大量运行时动态特性**的应用：

  - **反射：** 如果您的代码或依赖库大量使用反射来动态创建类型、方法调用（如通过 `Activator.CreateInstance` 或动态调用私有成员）。

  - **动态代码生成：** 使用 `System.Reflection.Emit` 命名空间下的功能。
  - **`dynamic` 关键字：** 不支持。
  - **运行时加载外部程序集：** 比如插件系统。
  - **依赖第三方库：** 某些第三方库可能没有完全兼容 AOT，或者其内部使用了 AOT 不支持的动态特性。

- **项目编译时间要求严格**：AOT 编译过程比 JIT 耗时更长。

- **需要调试本机代码**：调试 AOT 编译后的程序比调试 IL 代码要复杂。

- **开发迭代频繁**且**部署环境变化大**：每次针对不同平台发布，都需要重新编译。

#### 使用方法

> 版本：.NET 8.0

1. 配置`.csproj`

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <!-- 添加行 -->
    <PublishAot>true</PublishAot> 
  </PropertyGroup>
</Project>
```

2. 发布命令

```bash
dotnet publish -c Release -r win-x64 --self-contained true
```

- `-c Release`：指定以 Release 配置发布，以便进行优化。

- `-r <RID>`：指定**目标运行时标识符**。这是最重要的部分，它告诉 .NET 您要为哪个操作系统和 CPU 架构编译。常见的 RID 包括：

  - `win-x64` (Windows 64位)

  - `linux-x64` (Linux 64位)
  - `osx-arm64` (macOS M1/M2 芯片)
  - `linux-arm64` (ARM64 Linux)

- `--self-contained true`：这个标志是必需的，它确保生成的可执行文件包含了所有必要的 .NET 运行时组件，成为一个独立的应用程序。

执行完毕后，可以在项目的 `bin/Release/net8.0/<RID>/publish/` 文件夹下找到编译好的单一可执行文件。

## 中间件

### 概述

**定义：** 中间件是构成 ASP.NET Core 应用程序请求管道的软件组件。

**功能：** 每个中间件都负责处理特定的任务，例如：

- 处理静态文件（CSS、JS、图片）。
- 将 HTTP 请求重定向到 HTTPS。
- 进行用户认证（识别用户是谁）。
- 进行用户授权（判断用户是否有权限）。
- 记录日志。
- 处理错误。
- 路由请求到特定的控制器、Razor Pages 或 Blazor 组件。

**链式处理：** 中间件按照你在 `Program.cs` 中定义的顺序排列成一个链条（或管道）。请求从链条的一端进入，依次经过每个中间件，直到某个中间件处理并生成响应，或者到达终结点（Endpoint）。

---

**工作原理**

想象一个请求从浏览器发出，到达您的 ASP.NET Core 应用：

1. **请求进入：** HTTP 请求首先到达管道中的第一个中间件。
2. **前置处理：** 第一个中间件执行其逻辑（例如，检查请求头）。
3. **传递控制：** 如果这个中间件需要将请求继续传递给下一个中间件，它会调用 `_next(context)`。
4. **循环往复：** 请求会这样依次经过管道中的所有中间件，直到到达一个“终结点中间件”（例如，路由中间件找到一个控制器或 Razor Page，并将其执行）。
5. **生成响应：** 终结点生成响应。
6. **后置处理：** 响应会沿着管道**反向**流回，途经之前请求流经的每个中间件，执行它们在 `_next(context)` **之后**的逻辑（例如，记录响应状态、压缩响应）。
7. **响应返回：** 响应最终返回给客户端。

如果某个中间件决定自己处理并生成响应（例如，`UseExceptionHandler` 捕获到错误并显示错误页面，或者 `UseStaticFiles` 找到了一个静态文件），它就不会调用 `_next(context)`。这会**短路 (Short-Circuit)** 管道，请求不会再往下传递，响应会直接流回。

---

**常见的中间件**

- **`app.UseExceptionHandler("/Error")`：** 捕获应用程序中的未处理异常，并将其重定向到指定的错误处理路径。
- **`app.UseHttpsRedirection()`：** 强制将所有 HTTP 请求重定向到 HTTPS。
- **`app.UseStaticFiles()`：** 启用静态文件服务，允许客户端访问 `wwwroot` 文件夹中的 CSS、JavaScript、图片等文件。
- **`app.UseRouting()`：** 根据定义的路由（如 `MapGet`, `MapControllers`, `MapRazorPages`），将请求路由到正确的处理程序。
- **`app.UseAuthentication()`：** 识别当前请求的用户身份。
- **`app.UseAuthorization()`：** 检查用户是否有权限访问请求的资源。
- **`app.UseAntiforgery()`：** 防止跨站请求伪造 (CSRF) 攻击。

---

### 自定义中间件

1. 创建中间件类

   一个自定义中间件通常是一个公共类，它满足以下条件：

   - **构造函数：** 接收一个 `RequestDelegate` 类型的参数，命名为 `next`。这个 `next` 委托代表了管道中的下一个中间件。
   - **`InvokeAsync` 方法：** 包含中间件的核心逻辑。它必须是 `public`、`async`，并返回 `Task`，接收 `HttpContext` 作为参数。

   ```C#
   public class MyCustomLoggingMiddleware
   {
       private readonly RequestDelegate _next;
       private readonly ILogger<MyCustomLoggingMiddleware> _logger;
   
       public MyCustomLoggingMiddleware(RequestDelegate next, ILogger<MyCustomLoggingMiddleware> logger)
       {
           _next = next;
           _logger = logger;
       }
   
       public async Task InvokeAsync(HttpContext context)
       {
           // --- 请求进入管道时的逻辑 (前置处理) ---
           _logger.LogInformation($"Request START: {context.Request.Method} {context.Request.Path}");
   
           // 将请求传递给管道中的下一个中间件
           await _next(context);
   
           // --- 响应离开管道时的逻辑 (后置处理) ---
           _logger.LogInformation($"Request END: {context.Request.Method} {context.Request.Path} - Status Code: {context.Response.StatusCode}");
       }
   }
   ```

2. 将中间件添加到请求管道

   - 方式1：直接使用UseMiddleware<T>()

   ```C#
   // Program.cs
   // ...
   var app = builder.Build();
   
   // 在这里添加你的自定义中间件
   app.UseMiddleware<MyCustomLoggingMiddleware>();
   
   // ... 其他框架中间件 (如 UseStaticFiles, UseRouting, UseAuthentication, UseAuthorization) ...
   
   app.MapGet("/", () => "Hello World!"); // 终结点
   app.Run();
   ```

   - 方式2：使用扩展方法

     > 为了代码的简洁性和可重用性，通常会为自定义中间件创建一个扩展方法。*推荐此方法*

     ```C#
     // 在一个单独的静态文件 (例如 Extensions/MyMiddlewareExtensions.cs)
     public static class MyMiddlewareExtensions
     {
         public static IApplicationBuilder UseMyCustomLogging(this IApplicationBuilder builder)
         {
             return builder.UseMiddleware<MyCustomLoggingMiddleware>();
         }
     }
     ```

     ```C#
     // Program.cs
     // ...
     var app = builder.Build();
     
     // 使用你的扩展方法添加中间件
     app.UseMyCustomLogging(); // 看起来更简洁
     
     // ... 其他框架中间件 ...
     
     app.MapGet("/", () => "Hello World!");
     app.Run();
     ```


### 管道顺序

中间件的执行是**顺序依赖**的：

1. **功能依赖：** 某些中间件需要其他中间件已经完成工作才能正常运行。比如，**授权 (Authorization)** 中间件必须在 **认证 (Authentication)** 中间件之后，因为它需要知道用户是谁（认证的结果）才能判断用户是否有权限。
2. **效率：** 放在前面的中间件如果能短路请求（比如 `UseStaticFiles`），就能避免后面的复杂逻辑（如路由、控制器执行）被不必要的触发，从而提高效率。
3. **安全性：** 像错误处理、HTTPS 重定向等安全相关的中间件，通常需要放在非常靠前的位置，以便能尽早介入并处理问题。

典型的中间件顺序：

```C#
var builder = WebApplication.CreateBuilder(args);
// 1. 服务注册 (builder.Services.Add...) - 提前完成所有依赖注入的配置
// ...

var app = builder.Build();

// --- HTTP 请求管道开始 ---

// 2. 异常/错误处理 (Error Handling) - 最早介入，捕获所有后续错误
// 必须放在管道的最前面，这样它才能捕获到后面所有中间件的异常。
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage(); // 开发环境显示详细错误页面
    // 或者您之前看到的 app.UseMigrationsEndPoint(); 在开发环境显示迁移UI
}
else
{
    app.UseExceptionHandler("/Error"); // 生产环境显示友好错误页面
    app.UseHsts(); // 强制使用 HTTPS
}

// 3. HTTPS 重定向 (HTTPS Redirection) - 确保安全连接
// 任何 HTTP 请求都会被重定向到 HTTPS。
app.UseHttpsRedirection();

// 4. 静态文件服务 (Static Files) - 快速响应静态资源
// 如果请求的是静态文件（如 .html, .css, .js, 图片），则直接返回并短路管道，无需执行后续复杂逻辑。
app.UseStaticFiles();

// 5. Cookie 策略 (Cookie Policy) - 管理 Cookie 行为 (如果需要)
// app.UseCookiePolicy(); // 示例：处理 GDPR 同意、Cookie 安全属性

// 6. 路由 (Routing) - 决定请求去哪里
// 必须放在认证和授权之前，因为它会解析路由信息，并将终结点信息附加到 HttpContext 上，
// 供后续的认证和授权中间件使用。
app.UseRouting();

// 7. CORS (Cross-Origin Resource Sharing) - 处理跨域请求 (如果需要)
// 必须在 UseAuthentication/UseAuthorization 之前，但在 UseRouting 之后，
// 因为它可能需要知道目标终结点的信息。
// app.UseCors();

// 8. 认证 (Authentication) - 识别用户身份 (Who is the user?)
// 解析用户的身份凭证（如 Cookie、JWT Token），并将用户身份附加到 HttpContext.User 上。
// 它不会拒绝请求，只是设置用户身份。
app.UseAuthentication();

// 9. 授权 (Authorization) - 判断用户权限 (Can the user do this?)
// 根据用户身份和定义好的策略，判断用户是否有权限访问请求的资源。如果无权，则拒绝请求。
app.UseAuthorization();

// 10. 会话 (Session) - 管理用户会话状态 (如果需要)
// app.UseSession();

// 11. 缓存 (Caching) 和压缩 (Compression) - 优化响应 (如果需要)
// 通常在授权之后，因为它们处理的是响应内容。
// app.UseResponseCaching();
// app.UseResponseCompression();

// 12. 终结点映射 (Endpoint Mapping) - 实际执行业务逻辑
// 这是管道的“末端”，请求到达这里后，会被路由到控制器、Razor Pages、Minimal API 或 Blazor 组件，
// 从而执行具体的业务逻辑并生成响应。
app.MapRazorPages();
app.MapControllers(); // 或 app.MapDefaultControllerRoute();
app.MapGet("/api/hello", () => "Hello from API!");
app.MapRazorComponents<App>(); // 如果有 Blazor

// 13. 防伪造 (Anti-forgery) - 保护表单/交互式组件 (如果有表单或 Blazor Server)
// 必须在终结点映射之后，因为它需要访问 HttpContext.GetEndpoint() 来判断是否需要应用防伪造令牌。
app.UseAntiforgery();

// --- HTTP 请求管道结束 ---

// 启动应用程序
app.Run();
```

**简化的记忆方式：**

1. **安全 & 诊断 (Early)**：错误处理、HTTPS 重定向、HSTS。
2. **静态资源 (Quick Exit)**：静态文件服务。
3. **核心功能前置 (Setup)**：Cookie 策略、路由、CORS。
4. **身份 & 权限 (Who & What)**：认证、授权。
5. **业务逻辑 & 终结点 (Core Logic)**：Map Razor Pages/Controllers/Minimal APIs。
6. **安全后置 (Late Security)**：防伪造。

> 中间件的顺序错误可能会导致应用程序行为异常，甚至出现安全漏洞

### 管道分支

#### 概述

在某些场景下，您可能不希望所有请求都经过整个主中间件管道。例如：

- **API 路径与 UI 路径：** 您的应用程序可能同时提供 Web UI（Razor Pages/MVC）和 RESTful API。API 请求可能需要认证、授权和速率限制，但不需要像 `UseStaticFiles` 或 `UseAntiforgery` 这样的 UI 相关中间件。
- **管理后台与普通用户端：** 管理后台路径可能需要更严格的 IP 限制或不同的认证方案。
- **健康检查终结点：** 某些 `/health` 或 `/status` 路径的请求可能只需要极简的响应，无需经过完整的认证、授权或日志记录中间件，以提高效率。
- **特定文件类型：** 针对特定的文件下载请求，可能只需要极少的中间件处理。

通过分支，您可以为满足特定条件的请求创建一条**定制的、更高效的管道**，避免不必要的中间件执行。

#### 使用方式

##### `Map()` - 基于请求路径的分支

`Map()` 方法根据请求的**完整路径**（或路径的开头部分）来匹配请求，如果匹配成功，则执行分支中的中间件。匹配的路径**不**会被传递给分支中的中间件，即分支内部的路由是基于分支的根路径。

- **特点：** 路径精确匹配（或匹配前缀），一旦匹配成功，请求就不会再回到主管道。
- **语法：** `app.Map("/path", branch => { /* 配置分支管道 */ });`
- DEMO: 为/api路径创建独立管道

```C#
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// 注册服务
builder.Services.AddAuthentication(); // 主管道和分支可能都用到的认证服务
builder.Services.AddAuthorization();
builder.Services.AddControllers(); // 如果API使用控制器

var app = builder.Build();

// --- 主管道中间件 ---
app.UseHttpsRedirection();
app.UseStaticFiles(); // 静态文件，API请求通常不需要
app.UseRouting(); // 主路由必须在 Map() 之前，才能让 Map() 捕捉到路径

// --- 分支管道：针对 /api 路径 ---
app.Map("/api", apiApp =>
{
    // apiApp 是一个新的 IApplicationBuilder 实例，用于配置此分支的管道
    Console.WriteLine("Request mapped to /api branch.");

    // 1. 先进行认证（可能与主管道不同）
    apiApp.UseAuthentication();
    // 2. 再进行授权
    apiApp.UseAuthorization();
    // 3. 配置API路由
    apiApp.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers(); // 映射 API 控制器
        endpoints.MapGet("/api/status", () => "API is healthy!"); // 映射一个API Minimal Endpoint
    });

    // 注意：这里的中间件只会在 /api 路径下执行
});
// --- /api 路径的请求，一旦进入分支，就不会再回到这里及后面的主管道中间件 ---


// --- 主管道剩余中间件（只处理未被分支截获的请求）---
app.UseAuthentication(); // 主管道的认证
app.UseAuthorization();  // 主管道的授权
app.MapRazorPages();     // 主管道的 Razor Pages
app.MapControllers();    // 主管道的 MVC 控制器
app.MapGet("/", () => "Hello from Main App!");

app.Run();
```

在这个例子中，访问 `/api/products` 的请求会进入 `apiApp.Map("/api", ...)` 定义的分支，执行其中的认证、授权和 API 路由，而不会执行主管道中的 `MapRazorPages` 等。

##### `MapWhen()` - 基于任意条件的分支

`MapWhen()` 方法允许您根据一个任意的 `Predicate<HttpContext>`（一个返回布尔值的函数）来匹配请求。如果条件为 `true`，则请求进入分支；否则，请求继续在主管道中流动。

- **特点：** 条件非常灵活，可以是任何请求属性（路径、查询参数、请求头等）。一旦匹配成功，请求不会再回到主管道。
- **语法：** `app.MapWhen(context => context.Request.Query.ContainsKey("admin"), branch => { /* 配置分支管道 */ });`
- DEMO：基于查询参数`admin=true`的分支

```C#
// Program.cs
// ...
var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// --- 分支管道：当查询参数包含 "admin=true" 时 ---
app.MapWhen(context => context.Request.Query.ContainsKey("admin") && context.Request.Query["admin"] == "true", adminApp =>
{
    Console.WriteLine("Request mapped to admin branch.");

    // 管理员专用中间件，例如：
    adminApp.Use(async (context, next) =>
    {
        // 模拟一个简单的 IP 检查
        if (context.Connection.RemoteIpAddress?.ToString() != "127.0.0.1")
        {
            context.Response.StatusCode = 403; // Forbidden
            await context.Response.WriteAsync("Access Denied for Admin Interface!");
            return; // 短路，不调用 next
        }
        await next();
    });
    // 假设管理分支有自己的认证/授权或特定的路由
    adminApp.UseAuthentication();
    adminApp.UseAuthorization();
    adminApp.MapGet("/admin", () => "Welcome to the Admin Panel!");
    // 注意：此处的 /admin 路径是基于主管道的 /admin，而不是分支的根
});
// --- 如果条件不满足，请求会继续通过下面的主管道中间件 ---

app.UseAuthentication(); // 主管道认证
app.UseAuthorization();  // 主管道授权
app.MapRazorPages();
app.MapGet("/", () => "Hello from Main App!");

app.Run();
```

在本例中：访问 `/?admin=true` 会进入管理员分支，而访问 `/` 则不会。

##### `UseWhen()` - 基于条件**插入**中间件（请求可能回到主管道）

`UseWhen()` 类似于 `MapWhen()`，也是基于一个条件。但最大的区别是：**如果分支中的中间件调用了 `_next()`，请求会回到主管道，并继续执行 `UseWhen()` 之后的主管道中间件。**

- **特点：** 条件灵活，分支结束后可以回到主管道。适用于在特定条件下**插入额外的中间件**，而不是完全替换管道。
- **语法：** `app.UseWhen(context => context.Request.Query.ContainsKey("debug"), builder => { /* 配置分支管道 */ });`
- DEMO: 在调试模式下添加额外日志

```C#
// Program.cs
// ...
var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();

// --- 在请求包含 "debug=true" 时，插入额外的日志中间件 ---
app.UseWhen(context => context.Request.Query.ContainsKey("debug") && context.Request.Query["debug"] == "true", debugApp =>
{
    Console.WriteLine("Request entering debug logging branch.");
    debugApp.Use(async (context, next) =>
    {
        // 这是一个简单的自定义日志中间件
        Console.WriteLine($"[DEBUG LOG]: Request Path: {context.Request.Path}");
        await next(); // 调用下一个中间件，请求会回到主管道
        Console.WriteLine($"[DEBUG LOG]: Response Status: {context.Response.StatusCode}");
    });
    // 可以在这里添加其他只在调试时启用的中间件
});
// --- 无论是否进入 debug 分支，请求都会继续执行下面的主管道中间件 ---

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapRazorPages();
app.MapGet("/", () => "Hello from Main App!");

app.Run();
```

在本例中：访问 `/?debug=true` 会看到额外的调试日志，然后继续完成请求；访问 `/` 则不会。

##### 小结

**`Map()`：** 当希望**完全隔离**基于**固定路径前缀**的请求时，使用 `Map()`。一旦匹配，请求就只在该分支中处理，不会回到主管道。

**`MapWhen()`：** 当希望**完全隔离**基于**任意条件**的请求时，使用 `MapWhen()`。一旦匹配，请求就只在该分支中处理，不会回到主管道。

**`UseWhen()`：** 当希望在特定条件下**插入额外的中间件逻辑**，但随后请求**仍然需要继续通过主管道**时，使用 `UseWhen()`。

### 速率限制中间件

**定义**

根据预定义的规则，**限制客户端在特定时间段内向服务器发送请求的次数**。如果客户端的请求频率超过了限制，中间件就会阻止这些请求，通常返回 HTTP 状态码 `429 Too Many Requests`。

#### 限流算法

- **固定窗口 (Fixed Window):** 在固定的时间窗口内（例如，每分钟）允许一定数量的请求。一旦窗口开始，它会持续到时间结束，然后重置计数器。
- **滑动窗口 (Sliding Window):** 类似于固定窗口，但窗口会随着时间滑动，而不是固定。通常通过在窗口内维护多个固定大小的子窗口来实现。
- **令牌桶 (Token Bucket):** 应用程序以固定速率填充“令牌桶”，每个请求消耗一个令牌。如果桶中没有令牌，请求就会被拒绝。
- **并发限制 (Concurrency Limit):** 限制同时处理的请求数量，而不是每秒的请求数量。

#### 使用步骤

##### 服务注册 (`Program.cs` 的 `builder.Services` 部分)

需要在 DI 容器中注册速率限制服务，并定义一个或多个**策略 (Policies)**。策略是命名规则，定义了限制的类型和参数。

```C#
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// 注册速率限制服务
builder.Services.AddRateLimiter(rateLimiterOptions =>
{
    // 定义一个名为 "fixed" 的全局固定窗口策略
    rateLimiterOptions.AddFixedWindowLimiter("fixed", options =>
    {
        options.PermitLimit = 5; // 在每个窗口内允许5个请求
        options.Window = TimeSpan.FromSeconds(10); // 窗口大小为10秒
        options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst; // 队列处理顺序
        options.QueueLimit = 0; // 队列大小为0，即不排队，直接拒绝
    });

    // 定义一个名为 "sliding" 的滑动窗口策略
    rateLimiterOptions.AddSlidingWindowLimiter("sliding", options =>
    {
        options.PermitLimit = 10; // 在每个窗口内允许10个请求
        options.Window = TimeSpan.FromSeconds(15); // 窗口大小为15秒
        options.SegmentsPerWindow = 3; // 每个窗口分3段
        options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        options.QueueLimit = 2; // 队列大小为2，即允许2个请求排队等待
    });

    // 定义一个名为 "token" 的令牌桶策略
    rateLimiterOptions.AddTokenBucketLimiter("token", options =>
    {
        options.TokenLimit = 20; // 令牌桶最大容量
        options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        options.QueueLimit = 5; // 队列大小
        options.ReplenishmentPeriod = TimeSpan.FromSeconds(1); // 每秒补充令牌
        options.TokensPerPeriod = 2; // 每秒补充2个令牌
        options.AutoReplenishment = true; // 自动补充
    });

    // 定义一个名为 "concurrency" 的并发策略
    rateLimiterOptions.AddConcurrencyLimiter("concurrency", options =>
    {
        options.PermitLimit = 3; // 允许同时处理3个请求
        options.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        options.QueueLimit = 1; // 队列大小为1
    });

    // 还可以设置全局拒绝策略 (Fallback Policy)
    rateLimiterOptions.RejectionStatusCode = 429; // 当请求被拒绝时返回 429 状态码
});

// ... 其他服务注册 ...
```

##### 中间件配置 (`Program.cs` 的 `app` 部分)

注册策略后，需要在 HTTP 请求管道中启用速率限制中间件。可以将其应用于整个应用程序，或者应用于特定的终结点。

```C#
// Program.cs
// ...
var app = builder.Build();

// --- 启用速率限制中间件 ---
// 通常放在 UseRouting() 之后，UseAuthentication/UseAuthorization 之前或之后，取决于你的需求。
// 如果你想限制未认证的请求，可以放在认证中间件之前。
app.UseRateLimiter(); // 启用速率限制中间件

// ... 其他中间件配置 (UseAuthentication, UseAuthorization 等) ...

// --- 应用速率限制策略到终结点 ---

// 1. 应用全局策略（如果定义了默认策略）
// rateLimiterOptions.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
//     RateLimitPartition.GetFixedWindowLimiter(
//         partitionKey: httpContext.User.Identity?.Name ?? httpContext.Request.Headers.Host.ToString(),
//         factory: partition => new FixedWindowRateLimiterOptions
//         {
//             PermitLimit = 5,
//             Window = TimeSpan.FromSeconds(10)
//         }));

// 2. 应用命名策略到特定的 Minimal API 终结点
app.MapGet("/limited-fixed", () => "Fixed window limited!").RequireRateLimiting("fixed");
app.MapGet("/limited-sliding", () => "Sliding window limited!").RequireRateLimiting("sliding");
app.MapGet("/limited-token", () => "Token bucket limited!").RequireRateLimiting("token");
app.MapGet("/limited-concurrency", () => "Concurrency limited!").RequireRateLimiting("concurrency");

// 3. 应用策略到控制器或 Razor Pages
// [EnableRateLimiting("fixed")]
// public class MyController : ControllerBase { ... }
// 或
// endpoints.MapControllers().RequireRateLimiting("fixed");

app.MapGet("/", () => "Hello World!");

app.Run();
```

#### 速率限制的生效位置

**全局：** 如果你在 `AddRateLimiter` 中配置了 `rateLimiterOptions.GlobalLimiter`，那么所有未明确指定策略的请求都会受此限制。

**按命名策略：** 通过 `RequireRateLimiting("YourPolicyName")` 应用到特定的 Minimal API 终结点、Controller 或 Action。

**按自定义分区：** 你可以基于请求的特征（如用户 ID、IP 地址、API Key 等）来创建动态的限制分区。

#### 客户端如何知道被限流

当请求被速率限制中间件拒绝时，默认会返回 `429 Too Many Requests` HTTP 状态码。此外，响应头中可能包含以下信息：

- `Retry-After`: 告诉客户端多久之后可以重试。
- `RateLimit-Limit`: 当前窗口允许的最大请求数。
- `RateLimit-Remaining`: 当前窗口剩余的请求数。
- `RateLimit-Reset`: 当前窗口何时重置的时间戳。

### 速率限制分区

分区就是将传入的请求流分成多个独立的组，并对每个组应用自己的速率限制计数器。

#### 使用方法

通过 `PartitionedRateLimiter.Create<TResource, TPartitionKey>()` 方法来创建基于分区的速率限制器。这个方法接受两个主要的参数：

1. **`TResource`**: 通常是 `HttpContext`，表示您要限制的资源。
2. **`TPartitionKey`**: 这是定义分区的键的类型。例如，如果您想按用户名分区，`TPartitionKey` 可以是 `string`。
3. **`Func<TResource, TPartitionKey> keyProducer`**: 一个委托，用于从资源（`HttpContext`）中提取分区键。
4. **`Func<TPartitionKey, RateLimitPartition<TPartitionKey>> partitionFactory`**: 一个工厂函数，根据生成的分区键来创建或获取一个 `RateLimitPartition`。这个 `RateLimitPartition` 定义了具体的分区策略（例如，固定窗口、滑动窗口等）。

**核心思想：**对于每个传入的请求，您提供一个函数来**识别**这个请求属于哪个“组”（分区键），然后根据这个“组”来**应用**预先定义的速率限制策略。

DEMO:按用户（或 IP 地址）进行分区

根据用户的身份（如果已登录）或其 IP 地址来限制请求。

```C#
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// 1. 注册认证服务（以便我们可以获取用户身份）
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = "Bearer"; // 假设使用 Bearer token 认证
}).AddJwtBearer("Bearer", options =>
{
    // 配置 JWT Bearer 选项，例如 Authority, Audience 等
    options.Authority = builder.Configuration["Jwt:Authority"];
    options.Audience = builder.Configuration["Jwt:Audience"];
});
builder.Services.AddAuthorization();


// 2. 注册速率限制服务并定义分区策略
builder.Services.AddRateLimiter(rateLimiterOptions =>
{
    // 定义一个名为 "UserOrIpPolicy" 的分区速率限制策略
    rateLimiterOptions.AddPolicy("UserOrIpPolicy", httpContext =>
    {
        // 从 HttpContext 中提取分区键
        // 优先使用用户的唯一标识（如果已认证），否则使用 IP 地址
        string partitionKey = httpContext.User.Identity?.IsAuthenticated == true
                              ? httpContext.User.Identity.Name! // 如果用户已认证，使用其用户名作为分区键
                              : httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown_ip"; // 否则使用IP地址

        Console.WriteLine($"Request from partition: {partitionKey}"); // 调试输出

        // 根据分区键返回一个具体的速率限制策略
        // 假设每个用户或IP地址在10秒内最多允许5个请求
        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: partitionKey, // 传入当前请求的分区键
            factory: partition => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,           // 每个分区允许5个请求
                Window = TimeSpan.FromSeconds(10), // 窗口大小10秒
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0             // 不排队，直接拒绝
            });
    });

    // 定义一个默认的拒绝状态码
    rateLimiterOptions.RejectionStatusCode = 429; // Too Many Requests
});


var app = builder.Build();

// --- 中间件管道配置 ---
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication(); // 确保认证中间件在速率限制之前，以便可以获取用户身份
app.UseAuthorization();

app.UseRateLimiter(); // 启用速率限制中间件

// 3. 将策略应用到终结点
app.MapGet("/api/data", () => "Here's your data!").RequireRateLimiting("UserOrIpPolicy");
app.MapGet("/", () => "Hello from Main App!");

app.Run();
```

#### 限流算法 VS 限流分区

**速率限制算法**定义了**如何**计算和管理请求的额度。它们是数学模型，用来决定在特定时间内允许多少请求通过，以及当超过限制时如何处理（例如，拒绝、排队）。

简而言之：算法是决定“计费方式”和“允许多少流量”的规则。

---

**速率限制分区**定义了**对谁**（或对哪种类型的请求）应用独立的速率限制。它允许您将总的请求流量划分为多个独立的逻辑组，每个组都拥有自己独立的速率限制计数器，并可以应用不同的限流算法。

简而言之：分区是定义“独立账户”的机制，每个“账户”有自己的“流量套餐”。

### 被限流后的处理方式

#### 默认的处理方式

当请求被速率限制器拒绝时，默认情况下会发生以下情况：

1. **HTTP 状态码 429:** 服务器会返回一个 `HTTP 429 Too Many Requests` 的状态码。这是标准的 HTTP 状态码，明确告诉客户端请求因发送过多而被拒绝。
2. **默认响应体:** 响应体通常是空的，或者包含一个非常简单的文本，例如 "Too Many Requests"。
3. **响应头:** 响应头中可能会包含一些有用的信息，帮助客户端理解限制并知道何时可以重试：
   - `Retry-After`: 这个响应头告诉客户端在多久之后可以安全地重试请求（通常是一个秒数或一个 HTTP 日期）。
   - `RateLimit-Limit`: 指示在当前时间窗口内允许的最大请求数。
   - `RateLimit-Remaining`: 指示当前时间窗口内还剩余多少个请求。
   - `RateLimit-Reset`: 指示当前时间窗口何时重置的时间戳（通常是 Unix 时间戳或 HTTP 日期）。

#### 自定义处理方式

速率限制中间件允许你通过配置 `RateLimiterOptions.RejectionStatusCode` 和 `RateLimiterOptions.OnRejected` 回调来定制被拒绝请求的处理方式。

1. 自定义拒绝状态码（`RejectionStatusCode`）

可以设置当请求被拒绝时返回的 HTTP 状态码。虽然 `429` 是标准且推荐的，但如果你有特殊需求，可以更改它。

```C#
// Program.cs
builder.Services.AddRateLimiter(rateLimiterOptions =>
{
    // ... 你的限流策略定义 ...

    // 设置全局的拒绝状态码
    rateLimiterOptions.RejectionStatusCode = StatusCodes.Status429TooManyRequests; // 默认就是 429
    // 如果你非要用别的，例如：
    // rateLimiterOptions.RejectionStatusCode = StatusCodes.Status503ServiceUnavailable;
});
```

2. 自定义拒绝行为（`OnRejected`回调）

`OnRejected` 是一个异步回调函数，它会在请求被限流器拒绝时执行。你可以在这里完全控制发送给客户端的响应。

可以做的事情包括：

- **发送自定义的 JSON 错误信息:** 而不是空的响应体。
- **记录详细日志:** 记录是哪个请求、哪个 IP、哪个用户因为限流而被拒绝了。
- **发送通知:** 例如，向管理员发送邮件或通知，表明某个 IP 或用户正在触发大量的限流。
- **重定向:** 将用户重定向到另一个页面（虽然对于 429 响应不太常见）。

DEMO:发送自定义 JSON 错误信息和记录日志

```C#
// Program.cs
using System.Text.Json;
using Microsoft.AspNetCore.Http; // 确保引用此命名空间获取 StatusCodes

builder.Services.AddRateLimiter(rateLimiterOptions =>
{
    rateLimiterOptions.AddFixedWindowLimiter("myFixedPolicy", options =>
    {
        options.PermitLimit = 5;
        options.Window = TimeSpan.FromSeconds(10);
        options.QueueLimit = 0;
    });

    rateLimiterOptions.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    // 定义自定义拒绝行为
    rateLimiterOptions.OnRejected = async (context, cancellationToken) =>
    {
        // 1. 记录日志
        var logger = context.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>()
                           .CreateLogger("RateLimiting");
        logger.LogWarning($"Request rejected by rate limiter for {context.Lease.PartitionKey?.ToString()} " +
                          $"Path: {context.HttpContext.Request.Path}, " +
                          $"IP: {context.HttpContext.Connection.RemoteIpAddress}");

        // 2. 自定义响应体
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        context.HttpContext.Response.ContentType = "application/json";

        var responseContent = new
        {
            Status = StatusCodes.Status429TooManyRequests,
            Message = "Too Many Requests. Please try again later.",
            RetryAfterSeconds = (int)context.Lease.RetryAfter.TotalSeconds // 如果可用，提供重试时间
        };

        await context.HttpContext.Response.WriteAsync(JsonSerializer.Serialize(responseContent), cancellationToken);

        // 你也可以手动设置 Retry-After 响应头
        context.HttpContext.Response.Headers.RetryAfter = context.Lease.RetryAfter.TotalSeconds.ToString();
    };
});

// ... 其他服务和中间件配置 ...

var app = builder.Build();

app.UseRateLimiter(); // 启用速率限制中间件

app.MapGet("/limited-endpoint", () => "You got through!").RequireRateLimiting("myFixedPolicy");

app.MapGet("/", () => "Hello World!");

app.Run();
```

### 启用/禁用的注解

#### [EnableRateLimiting("PolicyName")]

`EnableRateLimiting` 属性用于在控制器或 Action 方法上**启用**速率限制，并指定要使用的**命名策略 (Named Policy)**。

- **作用：** 将之前在 `AddRateLimiter` 中定义的某个命名策略应用到这个控制器或 Action 上。
- **应用位置：**
  - **控制器类级别：** 如果应用在整个控制器类上，那么该控制器下的所有 Action 方法都会默认应用此速率限制策略。
  - **Action 方法级别：** 如果应用在某个特定的 Action 方法上，那么只有该方法会应用此策略。方法上的属性会覆盖控制器类上的属性。

DEMO:假设`Program.cs` 中定义了一个名为 "myFixedPolicy" 的速率限制策略：

```C#
// Program.cs
builder.Services.AddRateLimiter(rateLimiterOptions =>
{
    rateLimiterOptions.AddFixedWindowLimiter("myFixedPolicy", options =>
    {
        options.PermitLimit = 5;
        options.Window = TimeSpan.FromSeconds(10);
        options.QueueLimit = 0;
    });
    rateLimiterOptions.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});
// ...
app.UseRateLimiter(); // 启用中间件
// ...
```

现在，可以在控制器中使用 `[EnableRateLimiting("myFixedPolicy")]`：

```C#
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting; // 引入命名空间

[ApiController]
[Route("[controller]")]
// 在控制器级别应用 "myFixedPolicy"
[EnableRateLimiting("myFixedPolicy")]
public class ProductsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetProducts()
    {
        // 这个方法会受到 "myFixedPolicy" 的限制
        return Ok("List of products.");
    }

    [HttpGet("{id}")]
    // 这个方法也会受到 "myFixedPolicy" 的限制，因为它继承了控制器级别的设置
    public IActionResult GetProductById(int id)
    {
        return Ok($"Product with ID {id}.");
    }

    [HttpGet("popular")]
    // 如果您想在这个特定 Action 上使用不同的策略，可以再次应用属性：
    // [EnableRateLimiting("anotherPolicy")]
    public IActionResult GetPopularProducts()
    {
        return Ok("List of popular products.");
    }
}
```

#### [DisableRateLimiting]

`DisableRateLimiting` 属性用于在控制器或 Action 方法上**禁用**速率限制。

- **作用：** 明确表示该控制器或 Action 不受任何速率限制策略的影响，即使在父级（控制器级别或全局）已经应用了速率限制。
- **应用位置：**
  - **控制器类级别：** 如果应用在整个控制器类上，则该控制器下的所有 Action 方法都不会受到速率限制。
  - **Action 方法级别：** 如果应用在某个特定的 Action 方法上，则只有该方法会禁用速率限制。方法上的属性会覆盖控制器类或全局的设置。

DEMO:承接上面(EnableRateLimiting)的例子，如果不希望 `GetProductById` 方法受到速率限制：

```C#
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

[ApiController]
[Route("[controller]")]
[EnableRateLimiting("myFixedPolicy")] // 整个控制器应用 "myFixedPolicy"
public class ProductsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetProducts()
    {
        return Ok("List of products.");
    }

    [HttpGet("{id}")]
    // 在 Action 级别禁用速率限制，覆盖了控制器级别的 "myFixedPolicy"
    [DisableRateLimiting]
    public IActionResult GetProductById(int id)
    {
        // 这个方法不会受到任何速率限制
        return Ok($"Product with ID {id}.");
    }

    [HttpGet("popular")]
    public IActionResult GetPopularProducts()
    {
        return Ok("List of popular products.");
    }
}
```

#### 在最小API中的用法

`EnableRateLimiting` 和 `DisableRateLimiting` 也可以用于 Minimal API 终结点：

```C#
// Program.cs
// ...
app.UseRateLimiter(); // 启用中间件

// 为 Minimal API 终结点应用命名策略
app.MapGet("/api/data", () => "Data for you!")
    .RequireRateLimiting("myFixedPolicy");

// 为 Minimal API 终结点禁用速率限制
app.MapGet("/api/health", () => "I'm healthy!")
    .DisableRateLimiting(); // 即使有全局策略，这个终结点也不会被限速

// ...
```

### 速率限制的指标



### 最小API应用程序中的中间件

#### 执行流程

最小 API 应用程序同样通过 `app.Use...()` 方法来构建其中间件管道。当一个 HTTP 请求到达时，它会从管道的开始处（通常是 `Program.cs` 中 `app.Build()` 之后的第一行 `app.Use...()`）开始，依次经过每个配置的中间件。

每个中间件在处理完自己的逻辑后，会调用 `await _next(context);` 将控制权传递给管道中的下一个中间件。最终，请求会到达一个 **终结点 (Endpoint)**（也就是你用 `app.MapGet()`、`app.MapPost()` 等定义的回调函数），终结点处理完请求并生成响应后，响应会沿管道反向流回，途经那些在 `_next(context)` 之后有逻辑的中间件，直到返回给客户端。

#### 使用方法

在最小 API 应用程序中添加中间件非常直接，只需在 `Program.cs` 文件中，`var app = builder.Build();` 之后，在你的 `app.Map...()` 终结点定义之前，调用相应的 `app.Use...()` 方法。

```c#
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// --- 1. 服务注册阶段 (builder.Services.Add...) ---
// 在这里注册你的服务和DI配置
builder.Services.AddAuthentication(); // 例如，注册认证服务
builder.Services.AddAuthorization();
builder.Services.AddRateLimiter(options => { /* ... */ }); // 注册速率限制策略
builder.Services.AddProblemDetails(); // 注册 ProblemDetails 服务，用于规范化错误响应

var app = builder.Build();

// --- 2. 中间件管道配置阶段 (app.Use...) ---

// 异常处理 (通常在最前面)
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage(); // 开发环境显示详细错误
}
else
{
    // 在生产环境使用 ProblemDetails 中间件来处理异常
    // 它会捕获异常并生成符合 RFC 7807 规范的 JSON 错误响应
    app.UseExceptionHandler(); // 需要 ProblemDetails 服务支持
    // 或 app.UseExceptionHandler("/Error"); // 如果使用传统的错误页面
    app.UseHsts();
}

// HTTPS 重定向
app.UseHttpsRedirection();

// 静态文件服务
app.UseStaticFiles();

// 速率限制 (如果在认证之前需要，就在这里；如果限制认证用户，可能在认证之后)
app.UseRateLimiter(); // 启用速率限制中间件

// 路由 (必须在认证/授权之前)
app.UseRouting();

// 认证 (Who is the user?)
app.UseAuthentication();

// 授权 (Can the user do this?)
app.UseAuthorization();

// --- 3. 终结点定义阶段 (app.Map...) ---
// 在这里定义你的最小 API 终结点
app.MapGet("/", () => "Hello Minimal API World!");

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            Summary[Random.Shared.Next(Summary.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi()
.RequireAuthorization(); // 这个终结点需要授权

app.MapGet("/limited-data", () => "Limited data here!")
    .RequireRateLimiting("myFixedPolicy"); // 应用速率限制策略

// --- 4. 运行应用程序 ---
app.Run();


// --- 其他定义 (例如 WeatherForecast 记录) ---
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
static readonly string[] Summary = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};
```

#### 注意事项

**顺序至关重要：** 和所有 ASP.NET Core 应用程序一样，中间件的顺序决定了它们的执行顺序。例如，`app.UseRouting()` 必须在 `app.UseAuthentication()` 和 `app.UseAuthorization()` 之前。

**终结点特有的中间件：** 最小 API 允许你通过链式调用`.Use()` 来为**特定终结点**添加中间件。这些中间件只会在请求匹配到该终结点时执行。

```c#
app.MapGet("/specific-path", () => "Specific endpoint!")
    .Use(async (context, next) =>
    {
        Console.WriteLine("This middleware only runs for /specific-path");
        await next(context);
    });
```

这与全局 `app.Use()` 不同，后者应用于所有请求。

**内联中间件：** 你可以在 `Program.cs` 中直接使用 `app.Use()` 来定义匿名（内联）中间件，而无需创建单独的中间件类。这对于简单的日志、自定义头部添加等非常方便。

```C#
app.Use(async (context, next) =>
{
    Console.WriteLine($"Request received: {context.Request.Path}");
    await next(context);
    Console.WriteLine($"Response sent: {context.Response.StatusCode}");
});
```

**服务解析：** 在内联中间件或终结点处理程序中，你可以直接通过方法参数来接收 DI 容器中注册的服务：

```C#
app.MapGet("/myservice", (IMyService myService) =>
{
    myService.DoSomething();
    return "Service called!";
});
```

或者在内联中间件中通过 `context.RequestServices.GetService<T>()` 来手动解析。

### 响应缓存中间件

#### 定义

**响应缓存中间件**是一个内置的中间件，它允许你的应用程序**缓存服务器的 HTTP 响应**。当客户端再次请求相同的资源时，如果缓存有效，服务器可以直接从缓存中返回响应，而不需要重新执行完整的业务逻辑（如数据库查询、计算等）。

#### 工作原理

响应缓存中间件的工作原理主要基于 **HTTP 缓存头**，特别是 `Cache-Control` 和 `Vary` 头部。

1. **第一次请求：**
   - 客户端发送请求到服务器。
   - 请求经过响应缓存中间件。
   - 中间件将请求传递给管道的后续部分（例如，控制器或 Minimal API 终结点）。
   - 终结点生成响应。
   - 响应在返回给客户端之前再次经过响应缓存中间件。
   - 如果响应包含适当的缓存指令（例如 `Cache-Control: public,max-age=60`），中间件会将其**存储在服务器的内存缓存中**。
   - 响应返回给客户端。
2. **后续请求（缓存有效）：**
   - 客户端再次发送相同请求。
   - 请求到达响应缓存中间件。
   - 中间件检查内部缓存。
   - 如果找到一个有效的、匹配的缓存响应，中间件会**直接从缓存中取出响应并返回给客户端**，而不会将请求传递给管道的后续部分。
   - **短路：** 这样就“短路”了后续的认证、授权、路由、业务逻辑执行等环节，大大提高了效率。
3. **缓存失效：**
   - 当缓存时间过期（`max-age` 到期）或者服务器端数据发生变化（需要通过其他机制使缓存失效，例如通过改变 URL 或手动清除缓存）时，缓存将失效。
   - 下次请求时，将重新执行完整的流程，生成新的响应并更新缓存。

#### 使用方式

##### 服务注册



##### 中间件配置



##### 配置缓存指令（在何处应用缓存） 

## 主机



## 配置



## 选项



## 环境



## 日志记录与监视



## HttpContext



## 路由



## 异常处理



## 发出HTTP请求



## 静态文件



## .NET基架遥测
