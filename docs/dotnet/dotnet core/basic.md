---
title: 基础篇
shortTitle: 基础篇
description: .NET CORE
date: 2025-07-08 17:08:18
categories: [.NET, .NET CORE]
tags: [.NET]
order: 2
---

## 依赖注入

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

> 在使用`builder.Services.AddTransient<IMyService, MyService>()`注册服务后，注入时必须使用`IMyService`，若使用`MyService`则会报错。
>
> **不推荐**的注册方式：可以忽略接口，直接注入实现类`AddScoped<TImplementation>`

### 服务消费

#### 构造函数注入

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

#### 方法注入

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

#### 属性注入

通过公共属性注入依赖项。通常需要手动从容器中解析，或者使用特定的IOC容器扩展。在 .NET 的内置 DI 中不直接支持属性注入，除非手动从 `IServiceProvider` 解析。

```c#
// 不推荐的方式
public class MyClass
{
    public IMyService MyService { get; set; } // 属性
}
// 然后在某处手动解析并赋值
// myClass.MyService = serviceProvider.GetService<IMyService>();
```

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

#### 使用命名服务（第三方库）

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

#### 适用场景

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
   - **`Invoke` 方法：** 包含中间件的核心逻辑。它必须是 `public`、`async`，并返回 `Task`，接收 `HttpContext` 作为参数。

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

   - 方式1：直接使用`UseMiddleware<T>()`

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

##### `UseWhen()` - 基于条件插入中间件（请求可能回到主管道）

`UseWhen()` 类似于 `MapWhen()`，也是基于一个条件。但最大的区别是：如果分支中的中间件调用了 `_next()`，请求会回到主管道，并继续执行 `UseWhen()` 之后的主管道中间件。

- **特点：** 条件灵活，分支结束后可以回到主管道。适用于在特定条件下**插入额外的中间件**，而不是完全替换管道。
- **语法：** `app.UseWhen(context => context.Request.Query.ContainsKey("debug"), builder => { /* 配置分支管道 */ });`
- 示例: 在调试模式下添加额外日志

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

#### 速率限制分区

分区就是将传入的请求流分成多个独立的组，并对每个组应用自己的速率限制计数器。

##### 使用方法

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

##### 限流算法 VS 限流分区

**速率限制算法**定义了**如何**计算和管理请求的额度。它们是数学模型，用来决定在特定时间内允许多少请求通过，以及当超过限制时如何处理（例如，拒绝、排队）。

简而言之：算法是决定“计费方式”和“允许多少流量”的规则。

---

**速率限制分区**定义了**对谁**（或对哪种类型的请求）应用独立的速率限制。它允许您将总的请求流量划分为多个独立的逻辑组，每个组都拥有自己独立的速率限制计数器，并可以应用不同的限流算法。

简而言之：分区是定义“独立账户”的机制，每个“账户”有自己的“流量套餐”。

#### 被限流后的处理方式

##### 默认的处理方式

当请求被速率限制器拒绝时，默认情况下会发生以下情况：

1. **HTTP 状态码 429:** 服务器会返回一个 `HTTP 429 Too Many Requests` 的状态码。这是标准的 HTTP 状态码，明确告诉客户端请求因发送过多而被拒绝。
2. **默认响应体:** 响应体通常是空的，或者包含一个非常简单的文本，例如 "Too Many Requests"。
3. **响应头:** 响应头中可能会包含一些有用的信息，帮助客户端理解限制并知道何时可以重试：
   - `Retry-After`: 这个响应头告诉客户端在多久之后可以安全地重试请求（通常是一个秒数或一个 HTTP 日期）。
   - `RateLimit-Limit`: 指示在当前时间窗口内允许的最大请求数。
   - `RateLimit-Remaining`: 指示当前时间窗口内还剩余多少个请求。
   - `RateLimit-Reset`: 指示当前时间窗口何时重置的时间戳（通常是 Unix 时间戳或 HTTP 日期）。

##### 自定义处理方式

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

#### 启用/禁用的注解

##### [EnableRateLimiting("PolicyName")]

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

##### [DisableRateLimiting]

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

在最小API中的用法

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

### 最小API中的中间件

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

将响应缓存服务添加到 .NET Core 的依赖注入 (DI) 容器中。

```C#
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// 添加响应缓存服务
builder.Services.AddResponseCaching();

// ... 其他服务注册 ...

var app = builder.Build();
// ...
```

`AddResponseCaching()` 默认使用内存缓存来存储响应。你也可以通过重载来配置缓存选项，例如设置默认的缓存大小限制等。

##### 中间件配置

在管道中启用响应缓存中间件。它应该放在 **`UseStaticFiles()` 之后**（静态文件通常由自己的中间件处理），并且在 **`UseRouting()` 之前**（因为缓存逻辑需要在路由匹配之前介入）。

```C#
// Program.cs
// ...
var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();

// 启用响应缓存中间件
app.UseResponseCaching();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

// ... 你的终结点定义 ...

app.Run();
```

##### 配置缓存指令（在何处应用缓存） 

光有中间件还不够，还需要告诉 ASP.NET Core **哪些响应可以被缓存，以及如何缓存**。这通常通过以下方式实现：

###### 使用 `[ResponseCache]` 属性 (针对 MVC/Razor Pages/API 控制器):

```c#
using Microsoft.AspNetCore.Mvc;
using System;

[ApiController]
[Route("[controller]")]
public class ProductsController : ControllerBase
{
    [HttpGet]
    [ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any, NoStore = false)]
    public IActionResult GetAllProducts()
    {
        // 模拟从数据库获取数据
        Console.WriteLine($"Getting all products from DB at {DateTime.Now}");
        return Ok(new { Timestamp = DateTime.Now, Products = new[] { "Product A", "Product B" } });
    }

    [HttpGet("{id}")]
    [ResponseCache(Duration = 30, Location = ResponseCacheLocation.Client)]
    public IActionResult GetProductById(int id)
    {
        // 这个响应只在客户端缓存30秒
        Console.WriteLine($"Getting product {id} from DB at {DateTime.Now}");
        return Ok(new { Timestamp = DateTime.Now, ProductId = id, Name = $"Product {id}" });
    }

    [HttpGet("volatile")]
    [ResponseCache(NoStore = true, Duration = 0)] // 不缓存此响应
    public IActionResult GetVolatileData()
    {
        return Ok(new { Timestamp = DateTime.Now, Data = "This data changes frequently." });
    }
}
```

- **`Duration`**: 缓存的秒数。

- **`Location`**: 响应可以在哪里缓存。

  - `Any` (默认): 可以在客户端和任何共享缓存（如代理服务器）中缓存。

  - `Client`: 只能在客户端（浏览器）中缓存。
  - `None`: 不缓存。

- **`NoStore`**: 设置 `Cache-Control: no-store` 头，表示不应缓存响应的任何部分。

- **`VaryByHeader`**: 如果响应因某个请求头而异（例如 `Accept-Encoding`），则可以在这里指定。

- **`VaryByQueryKeys`**: 如果响应因某个查询字符串参数而异，则可以在这里指定。例如，`VaryByQueryKeys = new string[] { "category" }` 意味着 `/products?category=food` 和 `/products?category=drinks` 会被单独缓存。

###### 使用 `.CacheOutput()` 扩展方法 (针对 Minimal API):

对于 Minimal API，你可以在终结点定义时使用 `CacheOutput()` 扩展方法。

```c#
// Program.cs
// ...
app.UseResponseCaching();
app.UseRouting();
// ...

app.MapGet("/cached-minimal-api", () =>
{
    Console.WriteLine($"Executing minimal API at {DateTime.Now}");
    return Results.Ok(new { Timestamp = DateTime.Now, Message = "This is cached." });
})
.CacheOutput(policy => policy.Expire(TimeSpan.FromSeconds(60))); // 缓存60秒

app.MapGet("/cached-by-query", (string? category) =>
{
    Console.WriteLine($"Executing minimal API with category: {category} at {DateTime.Now}");
    return Results.Ok(new { Timestamp = DateTime.Now, Category = category, Message = "Varies by category." });
})
.CacheOutput(policy => policy.Expire(TimeSpan.FromSeconds(30)).VaryByQuery("category")); // 缓存30秒，并根据 "category" 查询参数变化

app.MapGet("/no-cache", () =>
{
    Console.WriteLine($"Executing no-cache API at {DateTime.Now}");
    return Results.Ok(new { Timestamp = DateTime.Now, Message = "This is never cached." });
})
.CacheOutput(policy => policy.NoCache()); // 不缓存
```

#### 注意点

- **不是所有响应都适合缓存：** 包含敏感用户数据、频繁变化或高度个性化的响应不应被缓存。
- **缓存过期和失效：** 确保你理解缓存的过期机制 (`Duration`)，并有策略来**使缓存失效**（例如，当数据更新时）。直接改变 URL 或在 `ResponseCache` 属性中配置 `VaryByQueryKeys` 是常见的失效策略。
- **认证与授权：** 缓存的响应是针对**所有**客户端的。如果你的响应根据用户身份或权限而不同，那么缓存可能会导致安全问题或不一致的数据。在这种情况下，你需要确保缓存的键包含了所有影响响应的因素（例如，通过 `Vary` 头），或者避免缓存这些响应。
- **动态内容：** 除非你精心管理 `Vary` 头或分区，否则通常不建议缓存依赖于请求头、Cookie 或查询字符串的动态内容。
- **缓存位置：** `ResponseCacheLocation` 决定了响应可以在哪里被缓存。`Any` 最激进，可能被共享代理缓存。`Client` 只在用户浏览器缓存。

### 请求与响应操作

这俩东西框架已经封装好了，一般不需要手动写相关代码。

#### 流



#### 管道



### 请求解压缩中间件

#### 定义

**请求解压缩中间件**是 ASP.NET Core 管道中的一个组件，它负责检测传入 HTTP 请求中是否包含已压缩的请求体。如果请求体被压缩了，中间件会根据 `Content-Encoding` 头部指示的压缩算法（例如 Gzip 或 Brotli）自动对其进行解压缩，然后将解压后的数据流传递给应用程序的后续部分（例如，Minimal API、MVC 控制器）。

这样，应用程序代码就可以直接处理解压后的原始数据，而无需手动编写解压缩逻辑。

#### 使用方法

##### 服务注册 (`Program.cs` 的 `builder.Services` 部分)

将请求解压缩服务添加到 ASP.NET Core 的依赖注入 (DI) 容器中

```c#
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// 添加请求解压缩服务
builder.Services.AddRequestDecompression();

// ... 其他服务注册，例如 AddControllers(), AddEndpointsApiExplorer() ...

var app = builder.Build();
// ...
```

`AddRequestDecompression()` 方法默认支持 **Gzip** 和 **Brotli** 压缩算法。你也可以通过重载来配置支持的压缩算法或添加自定义算法。

DEMO:配置请求解压缩选项

```c#
builder.Services.AddRequestDecompression(options =>
{
    // 默认已启用 Gzip 和 Brotli
    options.Providers.Add<BrotliRequestDecompressionProvider>();
    options.Providers.Add<GzipRequestDecompressionProvider>();

    // 如果你不希望它在压缩失败时抛出异常，可以设置为 false
    options.EnableRequestBodyCompression = true; // 默认为 true
    // options.SkipDecompressionWhenBodyLengthIsZero = true; // 默认为 true
});
```

##### 中间件配置 (`Program.cs` 的 `app` 部分)

在管道中启用请求解压缩中间件。它应该放置在管道中较早的位置，通常在需要读取请求体的中间件之前。

```c#
// Program.cs
// ...
var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();

// 启用请求解压缩中间件
// 应该在任何尝试读取或解析请求体的中间件之前
app.UseRequestDecompression();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

// ... 你的终结点定义 ...

// 示例：一个接受 POST 请求的 Minimal API 终结点
app.MapPost("/data", async (HttpRequest request) =>
{
    // 这里的 request.Body 会自动是解压后的流
    using var reader = new StreamReader(request.Body);
    var content = await reader.ReadToEndAsync();
    Console.WriteLine($"Received decompressed content: {content.Length} chars.");
    return Results.Ok($"Received decompressed content: {content}");
});

app.Run();
```

#### 客户端如何发送压缩请求

客户端需要设置 `Content-Encoding` 请求头，并实际对请求体进行压缩。

DEMO: (使用 C# `HttpClient` 发送 Gzip 压缩请求)：

```c#
using System.IO.Compression;
using System.Net.Http.Headers;
using System.Text;

public class MyApiClient
{
    private readonly HttpClient _httpClient;

    public MyApiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task SendCompressedData(string url, string data)
    {
        using var memoryStream = new MemoryStream();
        // 使用 GZipStream 压缩数据
        using (var gzipStream = new GZipStream(memoryStream, CompressionMode.Compress, true))
        using (var writer = new StreamWriter(gzipStream, Encoding.UTF8))
        {
            await writer.WriteAsync(data);
        }

        memoryStream.Position = 0; // 重置流位置到开始

        // 创建 HttpContent
        var content = new StreamContent(memoryStream);
        // 设置 Content-Type
        content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
        // 设置 Content-Encoding 头，告知服务器数据已压缩
        content.Headers.ContentEncoding.Add("gzip");

        // 发送 POST 请求
        var response = await _httpClient.PostAsync(url, content);

        response.EnsureSuccessStatusCode();
        Console.WriteLine($"Compressed request sent. Response: {await response.Content.ReadAsStringAsync()}");
    }
}

// 在 Program.cs 或其他地方调用
// var client = new MyApiClient(new HttpClient());
// await client.SendCompressedData("https://localhost:7199/data", "This is some large data that will be compressed.");
```

### 基于工厂的中间件

中间件通常有两种实现方式：一种是直接在 `InvokeAsync` 方法中注入依赖（称为**约定式中间件**或**请求管道中间件**），另一种就是我们现在要讨论的基于工厂的方式。

基于工厂的中间件允许你通过**依赖注入 (DI)** 来更灵活地管理中间件自身的生命周期和其内部依赖的生命周期。

#### 问题引入

自定义中间件是这样写的：

```c#
public class MyMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IMyService _myService; // 假设 IMyService 是单例或瞬态服务

    // 构造函数注入依赖
    public MyMiddleware(RequestDelegate next, IMyService myService)
    {
        _next = next;
        _myService = myService; // 这个 MyService 实例的生命周期由 DI 容器决定
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // 使用 _myService
        _myService.DoSomething();
        await _next(context);
    }
}
```

这种标准方式非常方便。但它有一个潜在的“陷阱”：**如果 `IMyService` 是一个作用域 (Scoped) 服务，那么每次 HTTP 请求，`MyMiddleware` 都会被实例化一次。** 这通常不是问题，因为中间件本身就是按请求生命周期处理的。

然而，如果你的中间件**自己有一些很重的初始化操作**，或者它需要依赖于**另一个生命周期更长的服务**，比如一个单例服务，你可能不希望每次请求都重新创建中间件实例。

基于工厂的中间件就是为了解决这种场景：它允许你**控制中间件的实例化方式**，并且可以在中间件自身的构造函数中注入**单例服务**，而在 `InvokeAsync` 方法中通过 `HttpContext` 获取**作用域服务**。

#### 实现方法

基于工厂的中间件需要实现 `IMiddleware` 接口。

1. 定义基于工厂的中间类

```c#
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging; // 假设你需要日志

// 1. 定义中间件接口和实现
public interface IMyService
{
    void LogOperation(string message);
}

public class MyScopedService : IMyService
{
    private readonly ILogger<MyScopedService> _logger;
    private readonly Guid _instanceId;

    public MyScopedService(ILogger<MyScopedService> logger)
    {
        _logger = logger;
        _instanceId = Guid.NewGuid();
        _logger.LogInformation($"MyScopedService instance {_instanceId} created.");
    }

    public void LogOperation(string message)
    {
        _logger.LogInformation($"Scoped service {_instanceId}: {message}");
    }
}


// 这是基于工厂的中间件类，实现了 IMiddleware 接口
public class FactoryBasedLoggingMiddleware : IMiddleware
{
    private readonly ILogger<FactoryBasedLoggingMiddleware> _logger;
    private readonly Guid _instanceId;

    // 构造函数：这里只能注入单例服务或自行创建的对象
    // RequestDelegate _next 参数不再在构造函数中，因为它是在 InvokeAsync 中提供的
    public FactoryBasedLoggingMiddleware(ILogger<FactoryBasedLoggingMiddleware> logger)
    {
        _logger = logger;
        _instanceId = Guid.NewGuid(); // 用于观察中间件实例的生命周期
        _logger.LogInformation($"FactoryBasedLoggingMiddleware instance {_instanceId} created (probably once).");
    }

    // InvokeAsync 方法：通过 HttpContext.RequestServices 获取作用域服务
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        // 可以在这里通过 HttpContext 获取作用域（或瞬态）服务
        // 这个 IMyService 是针对当前请求作用域的实例
        var myScopedService = context.RequestServices.GetRequiredService<IMyService>();

        _logger.LogInformation($"Middleware {_instanceId} handling request for {context.Request.Path}.");
        myScopedService.LogOperation("Request started in FactoryBasedLoggingMiddleware.");

        await next(context); // 调用管道中的下一个中间件

        myScopedService.LogOperation("Request finished in FactoryBasedLoggingMiddleware.");
        _logger.LogInformation($"Middleware {_instanceId} finished request for {context.Request.Path}. Status: {context.Response.StatusCode}");
    }
}
```

2. 注册服务和中间件到DI容器

```c#
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// 注册你的 Scoped 服务
builder.Services.AddScoped<IMyService, MyScopedService>();

// 注册基于工厂的中间件本身
// 由于它实现了 IMiddleware，你需要像注册其他服务一样注册它
// 这里我们注册为 Transient，这意味着每次通过 UseMiddleware<T>() 引用它时，都会尝试创建一个新实例。
// 但因为 UseMiddleware<T>() 在内部会缓存 IMiddlewareFactory，
// 实际上这个 IMiddleware 实例的生命周期取决于你是如何添加它的。
builder.Services.AddTransient<FactoryBasedLoggingMiddleware>();

// ... 其他服务注册 ...

var app = builder.Build();

// --- 中间件管道配置 ---

// 使用 UseMiddleware<T>() 添加基于工厂的中间件
// ASP.NET Core 内部会使用 IServiceProvider 来解析 FactoryBasedLoggingMiddleware 实例。
app.UseMiddleware<FactoryBasedLoggingMiddleware>();

app.MapGet("/", () => "Hello World!");

// ... 其他终结点 ...

app.Run();
```

---

#### 基于工厂中间件的生命周期和依赖注入

- **中间件自身的生命周期：** 当你使用 `app.UseMiddleware<T>()` 时，ASP.NET Core 内部会使用 `IMiddlewareFactory`（默认实现是 `MiddlewareFactory`）来创建中间件实例。默认情况下，`IMiddlewareFactory` 会从根服务提供者 (Root Service Provider) 请求中间件的实例。
  - 如果你将 `FactoryBasedLoggingMiddleware` 注册为 `AddSingleton`：那么中间件实例只会被创建一次，并在整个应用程序生命周期中重用。它的构造函数依赖（如 `ILogger`）也会是单例的。
  - 如果你将 `FactoryBasedLoggingMiddleware` 注册为 `AddTransient` 或 `AddScoped`：虽然注册的是 `Transient` 或 `Scoped`，但 `app.UseMiddleware<T>()` 默认情况下会**缓存第一个解析到的实例**并在所有请求中重用这个实例。这意味着即使你注册为 `Transient` 或 `Scoped`，它实际上也可能表现得像一个单例。
    - **例外：** 如果你是在一个分支管道 (`app.Map()`, `app.MapWhen()`, `app.UseWhen()`) 中使用 `app.UseMiddleware<T>()`，并且该分支通过 `app.ApplicationServices.CreateScope()` 创建了新的作用域，那么中间件的生命周期可能更符合你注册的服务生命周期。但通常情况下，它的生命周期是单例的。
- **中间件内部依赖的生命周期：**
  - 通过构造函数注入的依赖 (`ILogger`): 这些依赖的生命周期与中间件实例的生命周期一致。如果中间件是单例的，那么构造函数注入的依赖也必须是单例的，或者能够被单例依赖（即不能注入作用域或瞬态服务）。
  - 通过 `InvokeAsync` 方法注入（通过 `HttpContext.RequestServices.GetRequiredService<T>()` 或作为 `InvokeAsync` 参数）的依赖 (`IMyService`): 这些依赖的生命周期**与当前请求的作用域一致**。这意味着你可以安全地在 `InvokeAsync` 中获取作用域服务（如 `DbContext`），而不用担心生命周期冲突。

---

#### 总结

基于工厂的中间件（实现 `IMiddleware` 接口）提供了一种更灵活的方式来管理中间件本身的依赖注入。

- **优点：**
  - 允许在中间件的**构造函数中注入单例服务**，避免每次请求都创建中间件实例，从而优化性能。
  - 允许在 `InvokeAsync` 方法中**按请求作用域获取服务**（如数据库上下文），而不会引起生命周期冲突。
  - 更清晰地分离了中间件的生命周期管理和其内部依赖的生命周期管理。
- **缺点：**
  - 比传统的约定式中间件稍微复杂一点。

在大多数情况下，传统的约定式中间件（构造函数直接注入 `RequestDelegate next` 和所有依赖）已经足够，因为它更简洁。但当你的中间件有复杂的初始化逻辑，或其依赖的生命周期需要更精细的控制时，基于工厂的中间件就显得非常有用。

### 使用第三方容器的基于工厂的中间件



## 主机

在**最小 API (Minimal API)** 架构中，`WebApplication` 和 `WebApplicationBuilder` 是构建和运行 ASP.NET Core 应用程序的**首选和最简洁**的方式。它们是 ASP.NET Core 团队对泛型主机进行简化和优化的结果，专为 Web 应用设计。

### WebApplicationBuilder

**角色：** 负责**构建** `WebApplication` 实例。它是配置和注册应用程序所有服务和中间件的起点。

**创建方式：** 通过静态方法 `WebApplication.CreateBuilder(args)` 创建。

**功能：**

- **自动配置：** `CreateBuilder` 方法会自动进行大量默认配置，包括：
  - 使用 **Kestrel** 作为默认 Web 服务器。
  - 从 `appsettings.json`、`appsettings.{EnvironmentName}.json`、环境变量和命令行参数加载配置。
  - 配置默认的日志提供程序（如控制台、调试输出、EventSource）。
  - 启用依赖注入 (DI)。
- **`builder.Services`：** 提供一个 `IServiceCollection` 实例，用于向 DI 容器注册应用程序的服务。
- **`builder.Configuration`：** 提供对应用程序配置的访问。
- **`builder.Environment`：** 提供对当前运行环境（如 `Development`、`Production`）的访问。
- **`builder.Logging`：** 配置日志。
- **`builder.WebHost`：** 允许对底层的 Web 主机进行更底层的配置（例如更改 Kestrel 选项、绑定 URL 等），虽然在 `WebApplicationBuilder` 中大部分常用配置已被简化。

### WebApplication

**角色：** 代表了**已构建完成且可运行**的 ASP.NET Core 应用程序实例（也就是**主机**本身）。它包含了配置好的服务容器和请求处理管道。

**创建方式：** 通过 `builder.Build()` 方法从 `WebApplicationBuilder` 创建。

**功能：**

- **中间件管道配置：** 通过一系列 `app.Use...()` 方法来定义 HTTP 请求的管道。
- **终结点路由：** 通过 `app.MapGet()`、`app.MapPost()` 等方法定义 Minimal API 终结点，或通过 `app.MapControllers()`、`app.MapRazorPages()` 映射 MVC/Razor Pages。
- **运行应用程序：** 调用 `app.Run()` 来启动 Web 服务器并开始监听 HTTP 请求。
- **`app.Services`：** 运行时服务提供者（`IServiceProvider`）。
- **`app.Configuration`：** 运行时配置。
- **`app.Lifetime`：** 应用程序生命周期事件。

---

`WebApplication` 和 `WebApplicationBuilder` 是 .NET 6+ 时代 ASP.NET Core Web 应用最推荐的启动方式，它们在简洁性、自动化配置和开发体验上达到了最佳平衡。它在内部封装了泛型主机和 Web 主机的大部分复杂性。

### 泛型主机

**泛型主机 (Generic Host)** 是 .NET Core 2.1 引入的，它是一个**通用且不限于 Web 应用**的宿主模型。它设计的目标是为所有类型的 .NET 应用程序（包括控制台应用、后台服务、ASP.NET Core Web 应用等）提供一个统一的生命周期、配置、DI 和日志管理框架。

**核心概念**

- **`IHost` 接口：** 代表了泛型主机实例。
- **`IHostBuilder` 接口：** 用于构建 `IHost` 实例。

**创建和配置方式**

```c#
// Program.cs (泛型主机，不一定用于Web，但Web应用底层也用它)
using Microsoft.Extensions.Hosting; // 核心命名空间

public class Program
{
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args) // 默认配置，包括配置、日志、DI
            .ConfigureServices((hostContext, services) => // 配置应用程序的服务
            {
                // 注册后台服务
                services.AddHostedService<MyBackgroundService>();
                // 注册其他服务...
            })
            .ConfigureAppConfiguration((hostContext, config) => // 配置应用程序配置
            {
                // config.AddJsonFile(...)
            })
            .ConfigureLogging((hostContext, logging) => // 配置日志
            {
                // logging.AddConsole()
            })
            .ConfigureWebHostDefaults(webBuilder => // 如果要添加Web功能，需要这个扩展
            {
                webBuilder.UseStartup<Startup>(); // 旧版或更复杂的Web配置
                // 或者直接 webBuilder.UseKestrel().UseUrls(...)
            });
}

// Startup.cs (如果使用 UseStartup)
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        // Add Web-specific services
    }

    public void Configure(IApplicationBuilder app)
    {
        // Configure Web-specific middleware pipeline
    }
}
```

**关键特性**

- **通用性：** 可以运行任何基于 .NET Core 的应用，不局限于 Web。
- **统一抽象：** 为配置、日志、DI、生命周期管理等提供了一致的接口。
- **`IHostedService`：** 这是泛型主机的一大亮点，用于运行后台任务和长时间运行的服务，与 Web 请求生命周期解耦。
- **可扩展性：** 通过 `ConfigureServices`, `ConfigureAppConfiguration`, `ConfigureLogging`, `ConfigureWebHostDefaults` 等方法链式配置。

**小结**

泛型主机是 ASP.NET Core 应用程序更底层、更通用的宿主框架。虽然 `WebApplication.CreateBuilder` 在 Web 应用中简化了它的用法，但理解泛型主机有助于深入理解 ASP.NET Core 的架构，尤其是在构建后台服务或非 Web 应用时非常有用。它提供了一个更模块化、可测试的应用程序结构。

### Web主机

**Web 主机 (Web Host)** 是 ASP.NET Core 1.x 和 2.0 时代的**旧版 Web 专用主机模型**。它由 `Microsoft.AspNetCore.WebHost` 类和 `IWebHost` 接口组成。

**创建和配置方式**

```c#
// Program.cs (Web主机 - 旧版)
using Microsoft.AspNetCore.Hosting; // 核心命名空间

public class Program
{
    public static void Main(string[] args)
    {
        CreateWebHostBuilder(args).Build().Run();
    }

    public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
        WebHost.CreateDefaultBuilder(args) // 默认配置Web相关服务
            .UseStartup<Startup>(); // 指定Startup类来配置服务和请求管道
}

// Startup.cs (与泛型主机中的Startup类似，但更紧密耦合于Web)
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        // Add Web-specific services
    }

    public void Configure(IApplicationBuilder app)
    {
        // Configure Web-specific middleware pipeline
    }
}
```

**关键特性**

- **Web 专用：** 只能用于托管 Web 应用程序。
- **`Startup` 类：** 这是 Web 主机（以及早期泛型主机中）配置服务和中间件的核心。`Startup` 类包含 `ConfigureServices` 和 `Configure` 方法。
- **已弃用：** 在 .NET Core 2.1 引入泛型主机后，Web 主机已被标记为**过时 (deprecated)**。尽管它仍然可以工作，但官方推荐使用泛型主机（或其简化形式 `WebApplication`）。

**小结**

Web 主机是 ASP.NET Core 发展早期用于托管 Web 应用的专用宿主。它已被更通用、更强大的**泛型主机**及其在 .NET 6+ 中的简化版本 **`WebApplication`** 所取代。在新的项目中，你几乎不会再手动创建 Web 主机。

### 三者关系

这三者代表了 ASP.NET Core **主机模型** 的演进：

1. **Web 主机 (ASP.NET Core 1.x - 2.0)**：最初的 Web 应用专用宿主。
2. **泛型主机 (ASP.NET Core 2.1+)**：为了提供一个通用的宿主模型，将 Web 主机的功能提取并通用化，使其可以托管任何类型的 .NET 应用，并通过 `ConfigureWebHostDefaults` 扩展来支持 Web 功能。
3. **WebApplication 和 WebApplicationBuilder (ASP.NET Core 6.0+)**：在泛型主机之上，进一步为 Web 应用提供了一个**高度优化和简化的抽象**。它隐藏了 `IHostBuilder` 和 `IHost` 的大部分底层细节，直接在 `Program.cs` 中提供了简洁的配置和启动体验，尤其适合最小 API 和更简单的 Web 应用，但其底层仍然是基于泛型主机构建的。

## 配置

### 配置提供程序

**文件提供程序**：

- `appsettings.json`：默认的主配置文件。
- `appsettings.{EnvironmentName}.json`：环境特定文件（例如 `appsettings.Development.json` 用于开发环境，`appsettings.Production.json` 用于生产环境）。
- 可以通过 `AddXmlFile()` 或 `AddIniFile()` 添加其他格式的文件。

**环境变量提供程序**：

- 从操作系统环境变量中读取配置。这是在生产环境管理敏感信息（如连接字符串、API 密钥）的**推荐方式**，因为环境变量不会被提交到版本控制。键名通常遵循约定，例如 `MySettings__Setting1`。

**命令行参数提供程序**：

- 从应用启动时的命令行参数中读取配置，例如 `dotnet run --Logging:LogLevel:Default Debug`。
  - `dotnet run MyKey="Using =" Position:Title=Cmd Position:Name=Cmd_Rick`
  - `dotnet run /MyKey "Using /" /Position:Title=Cmd /Position:Name=Cmd_Rick`
  - `dotnet run --MyKey "Using --" --Position:Title=Cmd --Position:Name=Cmd_Rick`

**用户秘密提供程序 (User Secrets)**：

- **仅在开发环境**下使用，用于存储敏感信息。这些秘密存储在本地用户配置文件的一个 JSON 文件中，不会被提交到源代码管理。

- **使用方式：**

  - 在 Visual Studio 中，右键点击你的项目 (`.csproj` 文件) -> 选择 "管理用户机密" (Manage User Secrets)。

    Visual Studio 会自动为你的项目创建一个 `UserSecretsId`，并打开一个名为 `secrets.json` 的文件。

  - 在你的项目根目录（包含 `.csproj` 文件的目录）下，运行以下命令：`dotnet user-secrets init`,这个命令会在你的 `.csproj` 文件中添加一个 `<UserSecretsId>` 元素，例如：

    ```XML
    <PropertyGroup>
      <UserSecretsId>your-unique-guid-here</UserSecretsId>
    </PropertyGroup>
    ```

    然后，你可以打开 `secrets.json` 文件进行编辑。要打开它，可以运行：`dotnet user-secrets open`

**Azure Key Vault 提供程序**：

- 在云环境中，用于安全地存储和管理敏感信息。

### 配置加载顺序与覆盖规则

配置提供程序是有优先级的，**后添加或加载的提供程序会覆盖前面提供程序中的相同键的值**。

**`WebApplication.CreateBuilder`（或 `Host.CreateDefaultBuilder`）的默认加载顺序：**

1. `appsettings.json`
2. `appsettings.{EnvironmentName}.json` (例如 `appsettings.Development.json`)
3. 用户秘密 (User Secrets) **（仅在 `Development` 环境中加载）**
4. 环境变量
5. 命令行参数

### 在程序中读取/使用配置

配置系统将所有加载的键值对组织成一个**层次结构**。可以通过 `IConfiguration` 接口访问这些数据。

- **`IConfiguration`**：表示整个配置的根对象。
- **`IConfigurationSection`**：表示配置层次结构中的一个子部分。
- **键名约定**：
  - 使用**冒号 `:`** 分隔层次结构中的部分。例如：`Logging:LogLevel:Default`。
  - 在 JSON 文件中，这对应于嵌套的对象。

配置文件案例`appsettings.json`

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=MyDb;Trusted_Connection=True;"
  },
  "MyCustomSettings": {
    "WelcomeMessage": "Hello from config!",
    "FeatureToggle": true,
    "ApiKeys": {
      "GoogleMaps": "your-google-maps-key",
      "OpenWeather": "your-open-weather-key"
    }
  }
}
```

#### 直接通过`IConfiguration`访问

这是最直接的方式，可以将 `IConfiguration` 服务注入到您的类中，然后通过键名获取值。

##### configuration["key"]

- Web API 写法：

```C#
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration; // 确保引入此命名空间

[ApiController]
[Route("[controller]")]
public class ConfigController : ControllerBase
{
    private readonly IConfiguration _configuration;

    // 构造函数注入 IConfiguration
    public ConfigController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet("direct")]
    public IActionResult GetDirectConfigInfo()
    {
        // 直接通过键名访问配置
        var defaultLogLevel = _configuration["Logging:LogLevel:Default"];
        var connectionString = _configuration.GetConnectionString("DefaultConnection"); // 快捷方法获取连接字符串
        var welcomeMessage = _configuration["MyCustomSettings:WelcomeMessage"];
        var googleMapsKey = _configuration["MyCustomSettings:ApiKeys:GoogleMaps"];

        return Ok(new
        {
            DefaultLogLevel = defaultLogLevel,
            ConnectionString = connectionString,
            WelcomeMessage = welcomeMessage,
            GoogleMapsKey = googleMapsKey
        });
    }
}
```

- 最小 API 写法

```C#
// Program.cs
// ...
var app = builder.Build();
// ...

// 直接通过 IConfiguration 访问
app.MapGet("/config-info-direct", (IConfiguration config) =>
{
    var defaultLogLevel = config["Logging:LogLevel:Default"];
    var connectionString = config.GetConnectionString("DefaultConnection");
    var welcomeMessage = config["MyCustomSettings:WelcomeMessage"];
    var openWeatherKey = config["MyCustomSettings:ApiKeys:OpenWeather"];

    return Results.Ok(new
    {
        DefaultLogLevel = defaultLogLevel,
        ConnectionString = connectionString,
        WelcomeMessage = welcomeMessage,
        OpenWeatherKey = openWeatherKey
    });
});

// ...
app.Run();
```

##### GetValue

语法：`GetValue<T>(string key, T defaultValue = default)`

作用：这是获取单个配置值的**推荐方式**，因为它提供了**类型安全**和**默认值**的功能。

```c#
// 获取字符串值，如果不存在则为 null
string? welcomeMessage = _configuration.GetValue<string>("MyCustomSettings:WelcomeMessage");

// 获取布尔值，如果不存在则为 false
bool featureToggle = _configuration.GetValue<bool>("MyCustomSettings:FeatureToggle");

// 获取整数值，如果不存在则为 8080
int appPort = _configuration.GetValue<int>("App:Port", 8080);
```

**对比`configuration["key"]`**

- `_configuration["key"]` 总是返回 `string?` 类型。如果键不存在，它返回 `null`。您需要手动进行类型转换和空值检查。
- `GetValue<T>()` 提供了类型转换和默认值处理，让代码更简洁、更安全。

##### GetSection

**作用：** 获取配置层次结构中的一个**子部分（Section）**。这个子部分本身也是一个 `IConfigurationSection` 接口的实例，而 `IConfigurationSection` 又继承自 `IConfiguration`。这意味着可以像操作整个配置一样操作一个子节点。

**使用方法**

- 提供字节的键，如`MyCustSettings`
- 返回一个`IConfigurationSection`对象，该对象包含指定字节下的配置

**案例**

```c#
// 获取 "MyCustomSettings" 这个配置节
IConfigurationSection mySettingsSection = _configuration.GetSection("MyCustomSettings");

// 现在，您可以通过这个子节访问其内部的键，就像访问根配置一样
string? welcomeMessageFromSection = mySettingsSection["WelcomeMessage"]; // "Hello from config!"
bool featureToggleFromSection = mySettingsSection.GetValue<bool>("FeatureToggle"); // true

// 获取更深层次的子节
IConfigurationSection apiKeysSection = mySettingsSection.GetSection("ApiKeys");
string? googleMapsKey = apiKeysSection["GoogleMaps"]; // "your-google-maps-key"
```

##### GetChildren

**作用：** 获取当前配置节下**所有直接子节**的集合。它返回一个 `IEnumerable<IConfigurationSection>`。

**如何使用：** 在 `IConfiguration` 实例（可以是根配置，也可以是某个 `IConfigurationSection`）上调用。

**案例**:

```json
// appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "...",
    "ReportingConnection": "...",
    "AnalyticsConnection": "..."
  },
  "FeatureToggles": {
    "FeatureA": true,
    "FeatureB": false
  }
}
```

```c#
IConfigurationSection connectionStringsSection = _configuration.GetSection("ConnectionStrings");

// 遍历所有连接字符串
foreach (var connection in connectionStringsSection.GetChildren())
{
    Console.WriteLine($"Connection Name: {connection.Key}, Value: {connection.Value}");
    // Output:
    // Connection Name: DefaultConnection, Value: ...
    // Connection Name: ReportingConnection, Value: ...
    // Connection Name: AnalyticsConnection, Value: ...
}

// 也可以直接在根配置上获取顶级子节
foreach (var topLevelSection in _configuration.GetChildren())
{
    Console.WriteLine($"Top Level Section: {topLevelSection.Key}");
    // Output:
    // Top Level Section: Logging
    // Top Level Section: AllowedHosts
    // Top Level Section: ConnectionStrings
    // Top Level Section: MyCustomSettings
}
```

> **注意：** `GetChildren()` 只返回**直接的子节**，不递归。如果您需要递归遍历整个配置树，需要自己编写递归逻辑。

##### Exists

**作用：** 检查当前的 `IConfigurationSection` 是否**存在**。

**如何使用：** 在 `IConfigurationSection` 实例上调用。

**案例**:

```c#
IConfigurationSection optionalFeatureSection = _configuration.GetSection("OptionalFeatures:FeatureZ");

if (optionalFeatureSection.Exists())
{
    Console.WriteLine("FeatureZ configuration exists.");
    bool featureZEnabled = optionalFeatureSection.GetValue<bool>("IsEnabled");
    // ... 使用 FeatureZ 的其他配置 ...
}
else
{
    Console.WriteLine("FeatureZ configuration does not exist. Using default behavior.");
}
```

**对比`== NULL`**

- `_configuration.GetSection("SomeSection")` 即使 `SomeSection` 不存在，也会返回一个非 `null` 的 `IConfigurationSection` 实例。这个实例的 `Value` 属性会是 `null`，但它本身不是 `null`。
- 所以，直接 `if (_configuration.GetSection("SomeSection") == null)` 是**无效的**。必须使用 `Exists()` 方法来正确检查子节是否存在。

#### 使用选项模式

选项模式是一种更结构化、类型安全且易于维护的配置访问方式。它将配置值绑定到普通的 C# 类上。

1. 定义选项类

```C#
// Models/MyCustomSettings.cs
public class MyCustomSettings
{
    // 定义常量以方便引用配置节的名称，减少硬编码字符串
    public const string SectionName = "MyCustomSettings";

    public string WelcomeMessage { get; set; } = string.Empty;
    public bool FeatureToggle { get; set; }
    public ApiKeys ApiKeys { get; set; } = new ApiKeys(); // 嵌套对象
}

public class ApiKeys
{
    public string GoogleMaps { get; set; } = string.Empty;
    public string OpenWeather { get; set; } = string.Empty;
}
```

2. 在`Program.cs`中绑定配置

```C#
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// ... 其他服务注册 ...

// 绑定 MyCustomSettings 配置节到 MyCustomSettings 类
// IConfiguration.GetSection(SectionName) 获取名为 "MyCustomSettings" 的配置子节
builder.Services.Configure<MyCustomSettings>(builder.Configuration.GetSection(MyCustomSettings.SectionName));

// ...
var app = builder.Build();
// ...
```

3. 在服务或控制器中注入并使用选项

可以通过注入 `IOptions<T>`、`IOptionsSnapshot<T>` 或 `IOptionsMonitor<T>` 来获取配置。

- **`IOptions<T>`**
  - 最常用。它是一个单例服务，提供配置的**快照**。配置在应用启动时加载一次，之后不会改变。
  - 使用场景：简单且不经常变化的配置
- **`IOptionsSnapshot<T>`**
  - 作用域服务。它在**每个请求**中都会创建一个新的 `T` 实例，并会从配置源中重新加载最新的配置值。这对于在请求生命周期内需要最新配置的场景有用（但文件内容变化通常需要重启应用才能生效）。
  - 使用场景：**每个请求需要最新配置**，且无需订阅实时变化的场景
- **`IOptionsMonitor<T>`**
  - 单例服务。允许您获取**最新**的配置值，并且可以**订阅配置更改通知**（例如，如果 `appsettings.json` 文件在运行时发生变化，`IOptionsMonitor` 能够检测到并通知）。适用于需要运行时热重载配置的场景。
  - **需要在运行时监听配置更改并作出响应**的场景

---

Web API 写法：

```C#
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options; // 确保引入此命名空间

[ApiController]
[Route("[controller]")]
public class OptionsConfigController : ControllerBase
{
    private readonly MyCustomSettings _settingsSnapshot; // 使用 IOptionsSnapshot
    private readonly IOptionsMonitor<MyCustomSettings> _settingsMonitor; // 使用 IOptionsMonitor

    // 构造函数注入 IOptionsSnapshot 和 IOptionsMonitor
    public OptionsConfigController(
        IOptionsSnapshot<MyCustomSettings> optionsSnapshot,
        IOptionsMonitor<MyCustomSettings> optionsMonitor)
    {
        _settingsSnapshot = optionsSnapshot.Value; // 获取配置快照
        _settingsMonitor = optionsMonitor;
    }

    [HttpGet("options-snapshot")]
    public IActionResult GetOptionsSnapshotInfo()
    {
        // 每次请求都会获取最新的快照
        var currentSettings = _settingsSnapshot;
        return Ok(new
        {
            currentSettings.WelcomeMessage,
            currentSettings.FeatureToggle,
            GoogleMapsKey = currentSettings.ApiKeys.GoogleMaps,
            Source = "IOptionsSnapshot"
        });
    }

    [HttpGet("options-monitor")]
    public IActionResult GetOptionsMonitorInfo()
    {
        // 可以获取最新的配置值，如果文件在运行时更改，这里会反映出来
        var currentSettings = _settingsMonitor.CurrentValue;
        return Ok(new
        {
            currentSettings.WelcomeMessage,
            currentSettings.FeatureToggle,
            OpenWeatherKey = currentSettings.ApiKeys.OpenWeather,
            Source = "IOptionsMonitor"
        });
    }
}
```

最小API写法：

```C#
// Program.cs
// ...
var app = builder.Build();
// ...

// 使用 IOptionsSnapshot
app.MapGet("/options-info-snapshot", (IOptionsSnapshot<MyCustomSettings> optionsSnapshot) =>
{
    var settings = optionsSnapshot.Value;
    return Results.Ok(new
    {
        settings.WelcomeMessage,
        settings.FeatureToggle,
        GoogleMapsKey = settings.ApiKeys.GoogleMaps,
        Source = "IOptionsSnapshot Minimal API"
    });
});

// 使用 IOptionsMonitor
app.MapGet("/options-info-monitor", (IOptionsMonitor<MyCustomSettings> optionsMonitor) =>
{
    var settings = optionsMonitor.CurrentValue; // 获取当前最新值
    return Results.Ok(new
    {
        settings.WelcomeMessage,
        settings.FeatureToggle,
        OpenWeatherKey = settings.ApiKeys.OpenWeather,
        Source = "IOptionsMonitor Minimal API"
    });
});

// ...
app.Run();
```

#### 通过依赖注入将配置传递给其他组件

如果自定义服务需要直接访问 `IConfiguration` 或配置的某个子节，您可以直接将其注入到服务的构造函数中。

- Web API 写法

```C#
// Services/MyDataService.cs
public class MyDataService
{
    private readonly IConfiguration _configuration;
    private readonly MyCustomSettings _settings; // 也可以注入 IOptions<MyCustomSettings>

    public MyDataService(IConfiguration configuration, IOptions<MyCustomSettings> settings)
    {
        _configuration = configuration;
        _settings = settings.Value;
    }

    public string GetDataBasedOnConfig()
    {
        var dbName = _configuration["ConnectionStrings:DefaultConnection"];
        var welcomeMsg = _settings.WelcomeMessage;
        return $"Using DB: {dbName}, Welcome: {welcomeMsg}";
    }
}

// Program.cs
builder.Services.AddScoped<MyDataService>(); // 注册服务
// ...

// Controllers/DataController.cs
[ApiController]
[Route("[controller]")]
public class DataController : ControllerBase
{
    private readonly MyDataService _dataService;

    public DataController(MyDataService dataService)
    {
        _dataService = dataService;
    }

    [HttpGet("data-from-service")]
    public IActionResult GetServiceData()
    {
        return Ok(_dataService.GetDataBasedOnConfig());
    }
}
```

- 最小API写法

```C#
// Program.cs
// ...
builder.Services.AddScoped<MyDataService>(); // 注册服务 (MyDataService 类如上定义)
// ...

app.MapGet("/data-from-minimal-service", (MyDataService dataService) =>
{
    return Results.Ok(dataService.GetDataBasedOnConfig());
});
// ...
app.Run();
```

### 在Razor Pages访问配置

```c#
// .CSHTML
@page
@model Test5Model
@using Microsoft.Extensions.Configuration
@inject IConfiguration Configuration

Configuration value for 'MyKey': @Configuration["MyKey"]
```

### 在MVC视图文件访问配置

```C#
// .CSHTML
@using Microsoft.Extensions.Configuration
@inject IConfiguration Configuration

Configuration value for 'MyKey': @Configuration["MyKey"]
```

### 在`Program.cs`中访问配置

```JSON
// appsettings.json
{
  ...
  "KeyOne": "Key One Value",
  "KeyTwo": 1999,
  "KeyThree": true
}
```

```c#
//Program.cs
var builder = WebApplication.CreateBuilder(args);

var key1 = builder.Configuration.GetValue<string>("KeyOne");

var app = builder.Build();

app.MapGet("/", () => "Hello World!");

var key2 = app.Configuration.GetValue<int>("KeyTwo");
var key3 = app.Configuration.GetValue<bool>("KeyThree");

app.Logger.LogInformation("KeyOne: {KeyOne}", key1);
app.Logger.LogInformation("KeyTwo: {KeyTwo}", key2);
app.Logger.LogInformation("KeyThree: {KeyThree}", key3);

app.Run();
```

## 选项

### 使用方法

[选项模式](#使用选项模式)

### 选项验证

选项模式还支持对配置值进行验证，确保它们是有效的。这有助于在应用程序启动时捕获错误配置，而不是在运行时。

1. 为选项类添加验证属性

可以使用 `System.ComponentModel.DataAnnotations` 属性。

```C#
using System.ComponentModel.DataAnnotations;

public class EmailSettings
{
    public const string SectionName = "EmailSettings";

    [Required(ErrorMessage = "SMTP Server is required.")]
    [StringLength(100, MinimumLength = 5, ErrorMessage = "SMTP Server must be between 5 and 100 characters.")]
    public string SmtpServer { get; set; } = string.Empty;

    [Range(1, 65535, ErrorMessage = "SMTP Port must be between 1 and 65535.")]
    public int SmtpPort { get; set; }

    [Required(ErrorMessage = "Sender Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid sender email format.")]
    public string SenderEmail { get; set; } = string.Empty;

    public string SenderName { get; set; } = string.Empty;
    public bool EnableSsl { get; set; }
    public Credentials Credentials { get; set; } = new Credentials();
}
// Credentials 类也可以添加验证属性
public class Credentials
{
    [Required(ErrorMessage = "Username is required.")]
    public string Username { get; set; } = string.Empty;
    [Required(ErrorMessage = "Password is required.")]
    public string Password { get; set; } = string.Empty;
}
```

2. 在`Program.cs`中添加验证

使用 `Services.AddOptions<T>().Bind(Configuration.GetSection("SectionName")).ValidateDataAnnotations();`。

```C#
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// ... 其他服务注册 ...

// 绑定 EmailSettings 并添加数据注解验证
builder.Services.AddOptions<EmailSettings>()
    .Bind(builder.Configuration.GetSection(EmailSettings.SectionName))
    .ValidateDataAnnotations(); // 启用数据注解验证

// 你也可以添加自定义的验证逻辑：
// .Validate(options => { /* 自定义验证逻辑 */ return options.SmtpPort != 0; }, "Port cannot be zero.")

// 默认情况下，如果验证失败，应用程序会在启动时抛出异常并终止。
// 你可以通过 .ValidateOnStart() 来明确在启动时进行验证（这通常是默认行为）
// .ValidateOnStart()

// ...
var app = builder.Build();
// ...
```

如果配置不满足验证规则，应用程序将在启动时抛出 `OptionsValidationException` 异常，并显示详细的验证错误信息。

## 环境

### 概述

**环境**是一个字符串值，它表示应用程序当前运行的上下文。框架和您的代码都可以使用这个环境字符串来执行不同的行为或加载不同的配置。

三个主要的环境名称：

1. **Development (开发)**：
   - **特点**：用于应用程序开发阶段。
   - **常见用途**：
     - 启用详细的错误页面（如 `DeveloperExceptionPage`）。
     - 启用热重载和文件更改监视。
     - 使用本地开发数据库。
     - 禁用缓存，方便即时看到更改。
     - 更详细的日志输出（如 `Debug` 或 `Trace` 级别）。
     - 可能跳过 HTTPS 重定向，方便本地调试。
2. **Staging (分阶段/预生产)**：
   - **特点**：用于部署到生产环境之前的测试环境。它应该尽可能地模仿生产环境，但通常用于最终的 QA、性能测试和用户验收测试 (UAT)。
   - **常见用途**：
     - 禁用开发相关的调试功能。
     - 启用生产级别的错误处理（友好的错误页面）。
     - 连接到独立的测试数据库或预生产数据库。
     - 启用缓存。
     - 更简洁的日志输出（如 `Information` 或 `Warning` 级别）。
     - 强制 HTTPS。
3. **Production (生产)**：
   - **特点**：应用程序最终用户使用的真实运行环境。
   - **常见用途**：
     - 启用健壮的错误处理和用户友好的错误页面。
     - 禁用任何可能泄露敏感信息的调试功能。
     - 连接到生产数据库。
     - 优化性能（如启用响应压缩、缓存）。
     - 精简的日志输出（通常是 `Information` 或 `Error` 级别）。
     - 严格的安全措施（如 HSTS、CORS 策略）。

除了这些约定好的环境，您也可以定义自己的自定义环境名称（例如 `QA`、`UAT`、`Testing` 等）。

### 设置环境

#### `launchSettings.json` 

- 仅限开发环境

- 每个启动配置文件 (`profile`) 都可以有自己的 `environmentVariables` 设置。
- **优先级**：**最低**（仅在本地开发工具中使用，部署后无效）。

```JSON
// Properties/launchSettings.json
{
  "profiles": {
    "MyWebApp": {
      "commandName": "Project",
      "launchBrowser": true,
      "applicationUrl": "https://localhost:7001;http://localhost:5001",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development" // 这里设置了开发环境
      },
      "dotnetRunMessages": true
    },
    "StagingProfile": { // 您可以添加自定义配置文件
      "commandName": "Project",
      "launchBrowser": true,
      "applicationUrl": "https://localhost:7002;http://localhost:5002",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Staging" // 这是一个示例，用于本地模拟分阶段环境
      }
    }
  }
}
```

#### 在代码中设置

优先级比`launchSettings.json`中设置要高一级

若要在代码中设置环境，请在创建 [WebApplicationBuilder](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.builder.webapplicationbuilder) 时使用 [WebApplicationOptions.EnvironmentName](https://learn.microsoft.com/zh-cn/dotnet/api/microsoft.aspnetcore.builder.webapplicationoptions.environmentname#microsoft-aspnetcore-builder-webapplicationoptions-environmentname)，如以下示例所示：

```C#
// 在代码中设置环境变量
var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    EnvironmentName = Environments.Staging
}); 

// Add services to the container.
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

app.Run();
```



#### 操作系统环境变量

- 在部署到服务器（Windows Server、Linux、Azure App Service、Docker 等）时，通常通过设置操作系统的环境变量来指定环境。

- **优先级**：**中等**（会覆盖 `launchSettings.json`）

- Windows (CMD/PowerShell)：

  ```bash
  set ASPNETCORE_ENVIRONMENT=Production
  dotnet run
  ```

- Linux/Mac OS(Bash/Zsh)

  ```bash
  export ASPNETCORE_ENVIRONMENT=Production
  dotnet run
  ```

- Docker:在 `Dockerfile` 或 `docker-compose.yml` 中使用 `ENV` 或 `environment`。

  ```dockerfile
  # Dockerfile
  ENV ASPNETCORE_ENVIRONMENT=Production
  ```

#### 命令行参数

- 可以在启动应用程序时，通过命令行参数直接覆盖环境。
- **优先级**：**最高**（会覆盖所有其他方式）。
- **格式**：`--ASPNETCORE_ENVIRONMENT=Production`

```BASH
dotnet run --ASPNETCORE_ENVIRONMENT=Staging
```

> 环境变量的命名遵循特定的约定：**点号 `:` 被替换为双下划线 `__`。**
>
> 要设置 `Logging:LogLevel:Default`，环境变量名应为 `Logging__LogLevel__Default`。

### 在代码中访问环境

通过注入 `IWebHostEnvironment` (对于 Web 应用) 或 `IHostEnvironment` (对于通用主机) 来访问当前环境信息。

```csharp
// Program.cs
using Microsoft.AspNetCore.Hosting; // 用于 IWebHostEnvironment
using Microsoft.Extensions.Hosting; // 用于 IHostEnvironment 及其扩展方法

var builder = WebApplication.CreateBuilder(args);

// 在 builder 阶段获取环境信息
// builder.Environment 是 IWebHostEnvironment 的实例
Console.WriteLine($"Current environment (builder stage): {builder.Environment.EnvironmentName}");
Console.WriteLine($"Is Development? {builder.Environment.IsDevelopment()}");
Console.WriteLine($"Is Staging? {builder.Environment.IsStaging()}");
Console.WriteLine($"Is Production? {builder.Environment.IsProduction()}");

// ... 服务注册 ...

var app = builder.Build();

// 在 app 阶段获取环境信息
// app.Environment 也是 IWebHostEnvironment 的实例
Console.WriteLine($"Current environment (app stage): {app.Environment.EnvironmentName}");

// ... 中间件管道配置 ...

app.Run();
```

Web API:在控制器或服务中，通过构造函数注入 `IWebHostEnvironment`。

```C#
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting; // 确保引入此命名空间

[ApiController]
[Route("[controller]")]
public class EnvironmentController : ControllerBase
{
    private readonly IWebHostEnvironment _env;

    // 构造函数注入 IWebHostEnvironment
    public EnvironmentController(IWebHostEnvironment env)
    {
        _env = env;
    }

    [HttpGet("info")]
    public IActionResult GetEnvironmentInfo()
    {
        return Ok(new
        {
            EnvironmentName = _env.EnvironmentName,
            IsDevelopment = _env.IsDevelopment(),
            IsStaging = _env.IsStaging(),
            IsProduction = _env.IsProduction(),
            ContentRootPath = _env.ContentRootPath, // 应用程序内容的根目录
            WebRootPath = _env.WebRootPath // 静态文件的根目录 (wwwroot)
        });
    }

    [HttpGet("feature")]
    public IActionResult GetFeatureBasedOnEnvironment()
    {
        if (_env.IsDevelopment())
        {
            return Ok("This is a development-only feature enabled.");
        }
        else if (_env.IsStaging())
        {
            return Ok("This is a staging-specific feature enabled.");
        }
        else if (_env.IsProduction())
        {
            return Ok("This is a production-only feature enabled. Be careful!");
        }
        else
        {
            return Ok($"This is for custom environment: {_env.EnvironmentName}.");
        }
    }
}
```

最小API: 在 Minimal API 终结点中，直接通过方法参数注入 `IWebHostEnvironment`。

```C#
// Program.cs
// ...
var app = builder.Build();
// ...

app.MapGet("/environment-info-minimal", (IWebHostEnvironment env) =>
{
    return Results.Ok(new
    {
        EnvironmentName = env.EnvironmentName,
        IsDevelopment = env.IsDevelopment(),
        IsStaging = env.IsStaging(),
        IsProduction = env.IsProduction(),
        ContentRootPath = env.ContentRootPath,
        WebRootPath = env.WebRootPath
    });
});

app.MapGet("/environment-feature-minimal", (IWebHostEnvironment env) =>
{
    if (env.IsDevelopment())
    {
        return Results.Ok("Minimal API: Development feature is active.");
    }
    else if (env.IsStaging())
    {
        return Results.Ok("Minimal API: Staging feature is active.");
    }
    else if (env.IsProduction())
    {
        return Results.Ok("Minimal API: Production feature is active. Be cautious!");
    }
    else
    {
        return Results.Ok($"Minimal API: Custom environment feature for {env.EnvironmentName}.");
    }
});
// ...
app.Run();
```

## 日志记录与监视

### 日志记录

#### 核心组件

- **ILogger**：日志记录接口，用于写入日志。
- **ILoggerProvider**：日志提供程序，决定日志的输出目标（如控制台、文件、第三方服务）。
- **ILoggerFactory**：工厂类，用于创建 ILogger 实例。

#### 日志类别

##### 概述

**日志类别**是一个字符串，用于**标识日志消息的来源或生成该日志的组件**。可以把它看作是日志的“命名空间”或“标签”，用来给日志消息分组。

**作用：**

- **过滤和控制**：日志系统可以根据日志类别来应用不同的过滤规则和日志级别。比如，你可以设置所有来自 `Microsoft.EntityFrameworkCore` 类别的日志只记录 `Warning` 级别及以上的信息，而你自己的业务逻辑（例如 `MyApp.Services.OrderService` 类别）可以记录更详细的 `Debug` 级别信息。
- **组织和查找**：在大量的日志输出中，日志类别能帮助你快速识别是哪个部分的代码产生了这条日志，方便问题定位和分析。
- **可读性**：日志输出中通常会包含类别信息，让日志本身更容易理解。

##### **确定日志类别的方法**

1. **通过泛型参数 `ILogger<T>` 自动推断 (推荐方式)**： 这是最常见也是推荐的方式。当你通过依赖注入获取 `ILogger<T>` 实例时，`T` 的**完全限定名（包括命名空间和类名）**就会自动成为该 `ILogger` 实例的日志类别。

```C#
// C# 代码中
using Microsoft.Extensions.Logging;

namespace MyWebApp.Services
{
    public class OrderService
    {
        private readonly ILogger<OrderService> _logger; // 这里的 T 是 OrderService

        public OrderService(ILogger<OrderService> logger)
        {
            _logger = logger;
        }

        public void ProcessOrder(int orderId)
        {
            _logger.LogInformation("Processing order {OrderId}", orderId); // 这个日志的类别就是 "MyWebApp.Services.OrderService"
        }
    }
}
```

2. **通过 `ILoggerFactory.CreateLogger(string categoryName)` 手动指定 (较少用)**： 如果你需要更灵活地控制类别名称，或者你的代码不是通过 DI 获取 `ILogger`，你可以直接向 `ILoggerFactory` 提供一个字符串作为类别名称。

```C#
// Program.cs 或某个需要创建日志器的地方
using Microsoft.Extensions.Logging;

public class MyStartupClass
{
    private readonly ILogger _logger;

    public MyStartupClass(ILoggerFactory loggerFactory)
    {
        // 手动指定日志类别为 "MyWebApp.Startup"
        _logger = loggerFactory.CreateLogger("MyWebApp.Startup");
    }

    public void Configure()
    {
        _logger.LogInformation("Application configuration started."); // 这个日志的类别就是 "MyWebApp.Startup"
    }
}
```

#### 匹配规则

配置文件：

```JSON
// appsettings.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",                  // 所有未指定类别的日志
      "Microsoft": "Warning",                    // 所有以 "Microsoft" 开头的类别
      "Microsoft.AspNetCore.Hosting": "Information", // 更具体的 "Microsoft.AspNetCore.Hosting" 类别
      "MyWebApp.Controllers.HomeController": "Debug", // 针对特定的控制器
      "MyWebApp.Services": "Debug"               // 针对整个 MyWebApp.Services 命名空间下的所有类别
    },
    // ... 提供程序配置 ...
  }
}
```

匹配规则：

日志类别匹配是**从最具体到最不具体**的原则。

如果一个日志消息的类别是 `MyWebApp.Services.OrderService`：

- 它会优先尝试匹配 `MyWebApp.Services.OrderService` 的配置。
- 如果没有，会尝试匹配 `MyWebApp.Services` 的配置。
- 再没有，会尝试匹配 `MyWebApp` 的配置。
- 最后，会回退到 `Default` 的配置。

#### 日志级别

按严重程度递增：

- `Trace (0)`：**最详细的日志**，可能包含非常底层的细节，甚至敏感数据。通常只在开发和深度调试时使用，不适合生产环境。
- `Debug (1)`：用于**调试目的**，包含足以诊断问题的详细信息。在开发环境中比较常用。
- `Information (2)`：**跟踪应用程序的常规流**。例如，HTTP 请求进入、服务启动、用户登录成功等事件。这是生产环境中最常见的默认级别。
- `Warning (3)`：表示**非致命错误**或潜在问题。应用程序可以继续运行，但可能存在需要注意的情况，例如数据不一致、某个操作未按预期完成等。
- `Error (4)`：表示**当前操作失败的错误或异常**。例如，数据库连接失败、外部 API 调用失败。这些错误通常需要开发人员介入。
- `Critical (5)`：表示应用程序或托管环境中的**灾难性故障**。通常意味着应用程序无法继续正常运行，需要立即关注，例如内存耗尽、主数据库崩溃。
- `None (6)`：表示**不记录任何日志**。

默认最低级别：*Information*，即只记录 Information 及以上级别的日志。

#### 日志事件ID

##### 概述

**定义：**事件 ID 是一个整数值，用于唯一标识日志记录中的特定事件类型，帮助开发者分类和跟踪日志消息。

**作用：**

- **事件分类**：为日志消息分配一个编号，便于区分不同类型的事件（如用户登录、数据库错误）。
- **日志分析**：在日志分析工具（如 ELK、Serilog）中通过事件 ID 过滤或查询特定事件。
- **调试和监控**：提供标准化方式，快速定位问题。

**类型**：EventId 结构体，包含 Id（整数）和可选的 Name（字符串描述）。

##### 事件ID结构

类定义：

```C#
public struct EventId
{
    public int Id { get; }
    public string Name { get; }
    public EventId(int id, string name = null);
}
```

创建方式：

- 直接使用整数：new EventId(1001)。
- 带名称：new EventId(1001, "UserLogin")。

默认值：如果不指定，EventId 默认值为 0，名称为 null。

##### 使用方法

- 完整方法

```C#
void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter);
```

- 便捷方法(例如LogInfomartion)

```C#
void LogInformation(EventId eventId, string message, params object[] args);
```

案例：
```C#
public class UserController : ControllerBase
{
    private readonly ILogger<UserController> _logger;

    // 定义事件 ID 为常量或枚举，方便管理和避免魔术数字
    public static class EventIds
    {
        public const int UserLoginSuccess = 1001;
        public const int UserLoginFailed = 1002;
        public const int DatabaseError = 2001;
        public const int UserNotFound = 3001;
    }

    public UserController(ILogger<UserController> logger)
    {
        _logger = logger;
    }

    [HttpPost("login")]
    public IActionResult Login(string username, string password)
    {
        // 模拟登录逻辑
        if (username == "admin" && password == "password")
        {
            // 记录日志时使用事件ID
            _logger.LogInformation(EventIds.UserLoginSuccess, "User {Username} logged in successfully.", username);
            return Ok("Login successful!");
        }
        else
        {
            // 记录日志时使用事件ID
            _logger.LogWarning(EventIds.UserLoginFailed, "User {Username} login failed due to invalid credentials.", username);
            return Unauthorized("Invalid credentials.");
        }
    }

    [HttpGet("{id}")]
    public IActionResult GetUser(int id)
    {
        if (id <= 0)
        {
            // 记录日志时使用事件ID
            _logger.LogWarning(EventIds.UserNotFound, "Attempted to retrieve user with invalid ID: {UserId}.", id);
            return BadRequest("Invalid user ID.");
        }
        // ... 数据库操作 ...
        try
        {
            // 模拟数据库异常
            throw new InvalidOperationException("Database connection issue.");
        }
        catch (Exception ex)
        {
            // 记录日志时使用事件ID
            _logger.LogError(EventIds.DatabaseError, ex, "Database error occurred while fetching user {UserId}.", id);
            return StatusCode(500, "Internal server error.");
        }
    }
}
```

#### 配置方式

```JSON
// appsettings.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",        // 默认所有提供程序和所有分类器的最低级别
      "Microsoft": "Warning",          // 所有以 "Microsoft" 开头的分类器（如框架内部日志）设置为 Warning 级别
      "Microsoft.Hosting.Lifetime": "Information", // 专门针对主机生命周期日志，保持 Information 级别
      "System": "Warning",             // 所有以 "System" 开头的分类器设置为 Warning 级别
      "MyWebApp.Services.OrderService": "Debug" // 针对您自己的 OrderService，输出 Debug 级别日志
    },
    // 您也可以为特定的提供程序配置日志级别，这会覆盖上面 LogLevel 下的全局设置
    "Console": {
      "LogLevel": {
        "Default": "Information" // 控制台提供程序默认只输出 Information 及以上
      }
    },
    "Debug": {
      "LogLevel": {
        "Default": "Debug" // 调试窗口提供程序默认输出 Debug 及以上
      }
    }
  },
  "AllowedHosts": "*"
}
```

#### 注册日志服务

在 `Program.cs` 中调用 `WebApplication.CreateBuilder(args)` 时，它会**自动**配置并注册默认的日志提供程序（控制台、调试等），并从 `appsettings.json` 加载日志配置。在大多数情况下，您不需要额外编写代码来注册它们。

如果您需要**自定义**日志行为，例如清除默认提供程序、添加新的提供程序或进行更高级的配置，可以使用 `builder.Logging` 对象：

```C#
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// builder.Logging 允许您进一步配置日志系统
// builder.Logging.ClearProviders(); // 清除所有默认提供程序，如果您想完全自定义
// builder.Logging.AddConsole();    // 重新添加控制台提供程序
// builder.Logging.AddDebug();      // 添加调试提供程序
// builder.Logging.AddEventSourceLogger(); // 添加事件源提供程序

// 您也可以在这里以编程方式配置最低级别，这会覆盖 appsettings.json 中的 Default 级别
// builder.Logging.SetMinimumLevel(LogLevel.Information);

// ... 其他服务注册 ...
```

#### 使用日志

记录日志的方式是通过**依赖注入 `ILogger<T>`**。

Web API案例

```C#
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging; // 确保引入此命名空间

[ApiController]
[Route("[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ILogger<ProductsController> _logger; // 注入 ILogger<ProductsController>

    public ProductsController(ILogger<ProductsController> logger)
    {
        _logger = logger;
    }

    [HttpGet("{id}")]
    public IActionResult GetProduct(int id)
    {
        // 记录不同级别的日志，只有当前配置允许的级别才会被输出
        _logger.LogTrace($"Trace: Getting product with ID {id}"); // 通常只在 Trace 级别启用时才记录
        _logger.LogDebug($"Debug: Fetching product {id} from database."); // 通常只在 Debug 级别启用时才记录

        if (id <= 0)
        {
            _logger.LogWarning("Warning: Invalid product ID received: {ProductId}. Must be positive.", id); // 使用结构化日志
            return BadRequest("Invalid product ID.");
        }

        // 模拟获取产品
        var product = new { Id = id, Name = $"Product {id}", Price = 99.99 };
        if (product == null)
        {
            _logger.LogError("Error: Product with ID {ProductId} not found.", id); // 记录错误
            return NotFound();
        }

        _logger.LogInformation("Information: Successfully retrieved product {ProductId}.", id);
        return Ok(product);
    }

    [HttpPost]
    public IActionResult CreateProduct([FromBody] object newProduct)
    {
        try
        {
            // 模拟产品创建失败，并抛出异常
            throw new InvalidOperationException("Simulated product creation failure.");
            // _logger.LogInformation("Product created successfully.");
            // return CreatedAtAction(nameof(GetProduct), new { id = 1 }, newProduct);
        }
        catch (Exception ex)
        {
            // 记录 Critical 级别日志，并传入异常对象，日志提供程序会格式化异常信息
            _logger.LogCritical(ex, "Critical: An unhandled exception occurred during product creation for product {ProductData}.", newProduct);
            return StatusCode(500, "An internal server error occurred.");
        }
    }
}
```

最小API案例

```C#
// Program.cs
// ...
var app = builder.Build();
// ...

app.MapGet("/items/{id}", (int id, ILogger<Program> logger) => // 注入 ILogger<Program>
{
    logger.LogDebug("Minimal API Debug: Attempting to get item {ItemId}.", id);

    if (id <= 0)
    {
        logger.LogWarning("Minimal API Warning: Invalid item ID {ItemId} received.", id);
        return Results.BadRequest("Invalid item ID.");
    }

    // 模拟获取数据
    var item = new { Id = id, Name = $"Item {id}", Description = "A sample item." };
    if (item == null)
    {
        logger.LogError("Minimal API Error: Item with ID {ItemId} not found.", id);
        return Results.NotFound();
    }

    logger.LogInformation("Minimal API Information: Item {ItemId} retrieved successfully.", id);
    return Results.Ok(item);
});

app.MapPost("/items", (ILogger<Program> logger) =>
{
    try
    {
        throw new Exception("Minimal API: Simulated item creation error.");
    }
    catch (Exception ex)
    {
        logger.LogCritical(ex, "Minimal API Critical: Failed to create item.");
        return Results.StatusCode(500); // Internal Server Error
    }
});

// ...
app.Run();
```

#### 第三方日志记录提供程序
##### Serilog



##### NLog




### HTTP日志记录

#### 概述

HTTP 日志记录是一种中间件，用于记录传入 HTTP 请求和 HTTP 响应的相关信息。 HTTP 日志记录可以记录：

- HTTP 请求信息
- 公共属性
- 标头
- 正文
- HTTP 响应信息

HTTP 日志记录可以：

- 记录所有请求和响应，或者仅记录满足特定条件的请求和响应。
- 选择要记录请求和响应的哪些部分。
- 允许您从日志中删除敏感信息。

> HTTP 日志记录 ***会降低应用的性能***，尤其是在记录请求和响应正文时。 在选择要记录的字段时请考虑性能影响。 测试所选日志记录属性的性能影响。

#### 使用方法

1. 添加HTTP日志服务（AddHttpLogging）

需要在应用程序的服务集合中注册 HTTP 日志服务。这是配置日志记录行为的地方。

```C#
// Program.cs
using Microsoft.AspNetCore.HttpLogging; // 确保引入此命名空间

var builder = WebApplication.CreateBuilder(args);

// 添加 HTTP 日志服务并进行配置
builder.Services.AddHttpLogging(logging =>
{
    // 1. 配置要记录哪些字段
    // HttpLoggingFields 枚举允许您选择要记录的HTTP数据类型。
    // 您可以使用 | 运算符组合多个字段。
    logging.LoggingFields = HttpLoggingFields.RequestHeaders | // 记录请求头
                            HttpLoggingFields.RequestBody |    // 记录请求体
                            HttpLoggingFields.ResponseBody |   // 记录响应体
                            HttpLoggingFields.RequestPath |    // 记录请求路径
                            HttpLoggingFields.RequestQuery |   // 记录查询字符串
                            HttpLoggingFields.ResponseStatusCode; // 记录响应状态码

    // 如果要记录所有字段（非常详细，慎用！），可以使用 HttpLoggingFields.All
    // logging.LoggingFields = HttpLoggingFields.All;

    // 2. 配置敏感信息隐藏 (非常重要！推荐！)
    // 防止敏感信息（如认证令牌、密码）泄露到日志中。
    // 指定请求头或响应头名称，这些头的值将不会被记录。
    logging.RequestHeaders.Add("Authorization"); // 隐藏 Authorization 请求头的值
    logging.RequestHeaders.Add("Cookie");       // 隐藏 Cookie 请求头的值
    logging.ResponseHeaders.Add("Set-Cookie");  // 隐藏 Set-Cookie 响应头的值
    logging.ResponseHeaders.Add("X-Api-Key");   // 如果您有自定义的API密钥头，也要隐藏

    // 3. 限制请求体/响应体的大小 (推荐！)
    // 防止因为请求或响应体过大而导致日志文件剧增或性能问题。
    // 超过此大小的部分将被截断。设置为 -1 表示不限制（慎用）。
    logging.RequestBodyLogLimit = 4096; // 限制请求体最大记录 4KB (4 * 1024 字节)
    logging.ResponseBodyLogLimit = 4096; // 限制响应体最大记录 4KB

    // 4. 配置要跳过日志记录的路径 (可选)
    // 例如，跳过健康检查或静态文件的日志
    // logging.MediaTypeOptions.AddText("text/plain"); // 可以添加更多要作为文本记录的MediaType
});

// ... 其他服务注册，如 AddControllers(), AddSwaggerGen() 等 ...

var app = builder.Build();
```

2. 添加HTTP日志中间件

服务注册完成后，您需要在应用程序的请求处理管道中添加 HTTP 日志中间件。这个中间件应该放置在管道的**早期位置**，以便它能捕获到所有后续中间件处理的请求和响应。

**最佳实践：** 通常放在 `UseDeveloperExceptionPage()` 或 `UseExceptionHandler()` 之后，但要在 `UseRouting()` 和 `UseStaticFiles()` 等其他处理请求的中间件之前。

```C#
// Program.cs
// ...
var app = builder.Build();

// 开发环境的异常处理页
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler("/Error"); // 生产环境友好的错误页面
    app.UseHsts();
}

app.UseHttpsRedirection();

// **关键步骤：添加 HTTP 日志中间件**
// 通常放在 UseHttpsRedirection() 之后，但要早于处理路由、认证等的中间件
app.UseHttpLogging();

app.UseStaticFiles(); // 处理静态文件
app.UseRouting();     // 路由匹配

app.UseAuthorization(); // 认证和授权

app.MapControllers();   // 映射控制器路由
app.MapRazorPages();    // 映射 Razor Pages 路由
app.MapDefaultControllerRoute(); // 如果是MVC

app.Run();
```

#### 日志输出的目的地

HTTP 日志记录中间件会将捕获到的日志发送到应用程序配置的 **`ILogger` 提供程序**。这意味着，如果您配置了控制台日志提供程序、调试窗口日志提供程序或集成了 Serilog/NLog，HTTP 日志就会出现在这些目标的输出中。

**示例输出（取决于ILogger配置和格式化器）**

在控制台中，可能会看到类似这样的日志（通常以 `Microsoft.AspNetCore.HttpLogging.HttpLoggingMiddleware` 作为分类器）：

```LOG
info: Microsoft.AspNetCore.HttpLogging.HttpLoggingMiddleware[1]
      Request:
        Method: POST
        Path: /api/products
        Query: ?source=web
        Headers:
          Accept: [application/json]
          Content-Type: [application/json]
          Authorization: [***REDACTED***] // 被隐藏的敏感头
        Body: {"name":"New Product","price":19.99}

info: Microsoft.AspNetCore.HttpLogging.HttpLoggingMiddleware[2]
      Response:
        StatusCode: 201
        Headers:
          Content-Type: [application/json; charset=utf-8]
          Date: [Thu, 10 Jul 2025 12:00:00 GMT]
        Body: {"id":101,"name":"New Product","price":19.99}
```

#### 注意事项&最佳实践

**敏感数据处理 (Data Redaction)**：

- **极其重要！** HTTP 日志非常容易泄露敏感数据，如用户凭据、会话令牌、信用卡信息等。
- **务必使用 `logging.RequestHeaders.Add("HeaderName")` 和 `logging.ResponseHeaders.Add("HeaderName")` 来隐藏这些头的值。**
- 对于请求体和响应体中的敏感数据，您需要自行处理，例如在记录日志之前进行脱敏，或者在生产环境中限制记录体的大小并仅记录必要的头部信息。
- 默认情况下，`Authorization`、`Cookie`、`Proxy-Authorization`、`WWW-Authenticate`、`Set-Cookie` 头的值会被自动隐藏。但您应该根据您的应用自定义额外的敏感头。

**性能影响 (Performance Impact)**：

- 记录请求体和响应体（特别是大型体）会产生显著的性能开销，因为它涉及读取整个流并将其缓冲到内存中。
- 在**生产环境**中，请**谨慎启用** `HttpLoggingFields.RequestBody` 和 `HttpLoggingFields.ResponseBody`。通常，您可能只需要记录头部、路径和状态码。
- 使用 `RequestBodyLogLimit` 和 `ResponseBodyLogLimit` 来限制记录体的大小，可以减轻部分性能影响。

**日志量控制**：

- 在高流量应用程序中，HTTP 日志会产生大量的日志数据，这可能迅速填满磁盘、增加日志管理成本。
- 通过调整 `HttpLoggingFields` 来限制记录的详细程度。
- 结合 `ILogger` 的日志级别过滤功能，例如，可以将 `Microsoft.AspNetCore.HttpLogging.HttpLoggingMiddleware` 类别的日志级别在生产环境中设置为 `Warning` 或 `Error`，只记录异常的 HTTP 流量。

**放置位置**：

- `UseHttpLogging()` 应该放在请求管道的早期，以便捕获到尽可能多的请求和响应信息。
- 通常放在异常处理中间件（`UseDeveloperExceptionPage()` 或 `UseExceptionHandler()`）之后，这样 HTTP 日志不会因为处理异常而中断，也能记录到异常导致的状态码。
- 放在认证/授权中间件之前，可以记录未认证/未授权的请求。

**与自定义日志的互补**：

- HTTP 日志记录提供了网络层面的视图。您仍然需要在业务逻辑层使用 `ILogger<T>` 来记录应用程序内部的详细操作和业务事件。两者是互补的。

### W3C记录器

#### 概述

W3CLogger 是一个以 [W3C 标准格式](https://www.w3.org/TR/WD-logfile.html)写入日志文件的中间件。 相关日志包含有关 HTTP 请求和 HTTP 响应的信息。 W3CLogger 提供以下内容的日志：

- HTTP 请求信息
- 公共属性
- 标头
- HTTP 响应信息
- 有关请求/响应对的元数据（开始日期/时间，所用时间）

在以下几种方案中，W3CLogger 很有价值：

- 记录传入请求和响应的相关信息。
- 筛选请求和响应的哪些部分被记录。
- 筛选要记录的头。

> W3CLogger 可能会降低应用的性能。 在选择要记录的字段时考虑性能影响 - 记录的属性越多，性能降低越多。 测试所选日志记录属性的性能影响。

**文件格式：**

W3C 扩展日志文件格式是一种文本格式，用于记录 Web 服务器的活动。它的特点是：

- **结构化**：日志文件通常以 `#Fields:` 行开头，明确列出后面数据行中每个字段的名称。例如：

  ```LOG
  #Fields: date time s-ip cs-method cs-uri-stem cs-uri-query s-port cs-username c-ip cs(User-Agent) sc-status time-taken
  ```

- **可扩展**：您可以定义自己的字段。
- **易于解析**：由于其结构化特性，各种日志分析工具（如 Log Parser、ELK Stack、Splunk）可以轻松地解析和处理 W3C 格式的日志。

日志示例：

```LOG
#Fields: date time s-ip cs-method cs-uri-stem cs-uri-query s-port cs-username c-ip cs(User-Agent) sc-status time-taken
2025-07-10 17:30:00 127.0.0.1 GET /api/products - 443 - 127.0.0.1 Mozilla/5.0+(Windows+NT+10.0)+... 200 15
2025-07-10 17:30:01 127.0.0.1 POST /api/orders - 443 - 127.0.0.1 curl/7.81.0 201 250
```

#### 使用方法

1. 添加W3C日志服务

```c#
// Program.cs
using Microsoft.AspNetCore.HttpLogging; // W3CLogger也在此命名空间下

var builder = WebApplication.CreateBuilder(args);

// 添加 W3C 日志服务并进行配置
builder.Services.AddW3CLogging(logging =>
{
    // 1. 配置要记录哪些字段
    // W3CLoggingFields 枚举允许您选择要记录的字段。
    // 您可以使用 | 运算符组合多个字段。
    logging.LoggingFields = W3CLoggingFields.All; // 记录所有标准 W3C 字段

    // 也可以选择性记录，例如：
    // logging.LoggingFields = W3CLoggingFields.Date |
    //                         W3CLoggingFields.Time |
    //                         W3CLoggingFields.ClientIpAddress |
    //                         W3CLoggingFields.Method |
    //                         W3CLoggingFields.UriStem |
    //                         W3CLoggingFields.UriQuery |
    //                         W3CLoggingFields.ServerPort |
    //                         W3CLoggingFields.UserAgent |
    //                         W3CLoggingFields.StatusCode |
    //                         W3CLoggingFields.TimeTaken;


    // 2. 配置日志文件管理
    logging.FileSizeLimit = 10 * 1024 * 1024; // 每个日志文件最大 10 MB (10 * 1024 * 1024 bytes)
    logging.RetainedFileCountLimit = 50;      // 最多保留 50 个日志文件
    logging.FileName = "my-app-access-";     // 日志文件名前缀，例如：my-app-access-20250710.log
    logging.LogDirectory = Path.Combine(AppContext.BaseDirectory, "logs", "w3c"); // 日志存储目录
                                                                                 // AppContext.BaseDirectory 是应用程序的根目录

    // 3. 配置日志刷新间隔
    logging.FlushInterval = TimeSpan.FromSeconds(2); // 每 2 秒刷新一次日志到磁盘，防止数据丢失（但也增加I/O）

    // 4. 是否跳过静态文件的日志 (可选，通常推荐)
    // 默认为 false，这意味着静态文件请求也会被记录。
    // 如果设置为 true，则对静态文件（如 .css, .js, .png）的请求将不会被记录。
    logging.SkipSuccessfulStaticFileRequests = true;

    // 5. 配置要忽略的请求路径 (可选)
    // logging.IgnorePaths.Add("/healthz"); // 忽略健康检查路径的日志
});

// ... 其他服务注册 ...

var app = builder.Build();
```

2. 添加W3C日志中间件

服务注册完成后，您需要在应用程序的请求处理管道中添加 W3C 日志中间件。**这个中间件必须放置在管道的早期位置，才能捕获到尽可能多的请求信息，特别是要在 `UseStaticFiles()` 和 `UseRouting()` 之前。**

```c#
// Program.cs
// ...
var app = builder.Build();

// 开发环境的异常处理页
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

// **关键步骤：添加 W3C 日志中间件**
// W3CLogger 必须放在 UseStaticFiles() 和 UseRouting() 之前，
// 这样才能记录所有进入应用程序的请求，包括静态文件和未路由的请求。
app.UseW3CLogging();

app.UseStaticFiles(); // 处理静态文件
app.UseRouting();     // 路由匹配

app.UseAuthorization();
app.MapControllers();
app.MapRazorPages();

app.Run();
```

#### W3C VS HTTP

| 特性         | HTTP 日志记录 (HttpLoggingMiddleware)                        | W3C 记录器 (W3CLoggingMiddleware)                            |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 日志格式     | 输出到标准的 ILogger，格式由所选的 ILogger 提供程序（如 Console, Serilog）决定。通常是结构化 JSON 或自定义文本。 | W3C 扩展日志文件格式（纯文本，带有 #Fields 头部）。          |
| 输出目的地   | 应用程序配置的 ILogger 提供程序（控制台、调试窗口、文件、数据库、云日志等）。 | 专门的文件系统路径（通过 LogDirectory 配置）。               |
| 记录内容     | 可配置记录请求头/体、响应头/体、路径、查询字符串、状态码等。对请求体和响应体支持更细致的控制和截断。 | 主要记录 HTTP 请求的元数据：日期、时间、IP、方法、URI、状态码、处理时间、用户代理等。通常不记录请求/响应体。 |
| 性能/资源    | 记录请求/响应体时可能产生较大性能开销。                      | 通常性能开销较小，因为它主要记录元数据，不缓存整个体。       |
| 适用场景     | 开发调试、问题诊断、需要查看请求/响应体内容的场景。可以与现有日志聚合工具无缝集成。 | 兼容现有 W3C 日志分析工具、需要与传统 Web 服务器日志统一、专注于 Web 访问分析和审计的场景。 |
| 敏感数据处理 | 通过 RequestHeaders.Add 等方法对头进行 ***REDACTED*** 处理。对体需手动处理或限制大小。 | 记录的字段不包含请求/响应体，敏感数据风险相对较小。          |
| 中间件顺序   | 放在异常处理之后，路由之前。                                 | 必须放在 UseStaticFiles() 和 UseRouting() 之前，以确保捕获所有进入应用的请求。 |

#### 注意事项&最佳实践

- **文件存储和清理**：W3C 记录器将日志写入本地文件。在生产环境中，请确保您有适当的策略来：
  - **监控磁盘空间**：防止日志文件填满磁盘。
  - **定期归档和删除旧文件**：`RetainedFileCountLimit` 可以帮助自动管理，但对于长期存储，您可能需要将它们传输到对象存储或日志聚合系统。
- **性能**：虽然 W3C 记录器本身的开销比记录完整请求体/响应体的 HTTP 日志记录要小，但频繁的磁盘 I/O 仍然会产生一定影响。`FlushInterval` 的设置会影响写入频率和潜在的数据丢失风险。
- **日志分析**：为了充分利用 W3C 格式日志，您需要使用能够解析这种格式的工具（如 Log Parser、自定义脚本或集成到 ELK Stack 等日志聚合平台）。
- **与 `ILogger` 分离**：W3C 记录器不会将日志输出到您常规的 `ILogger` 提供程序。它们是独立的日志流。这意味着应用程序内部的业务逻辑日志和 Web 访问日志是分开管理的。
- **不记录请求/响应体**：请记住，W3C 记录器通常不记录请求或响应的实际内容。如果需要这些内容进行调试，应该使用前面讲过的 **HTTP 日志记录中间件**。

### 健康检查

#### 健康状态等级

| 类型          | 说明                   | 典型应用                     |
| ------------- | ---------------------- | ---------------------------- |
| ✅ `Healthy`   | 一切正常               | 默认健康检查返回             |
| ⚠️ `Degraded`  | 可用但性能或稳定性下降 | 比如响应慢、空间快满         |
| ❌ `Unhealthy` | 无法使用或严重问题     | 连接失败、崩溃、依赖项不可用 |

**状态码映射**

- `HealthStatus.Healthy` -> HTTP 200 OK
- `HealthStatus.Degraded` -> HTTP 200 OK (但通常监控系统会将其视为警告)
- `HealthStatus.Unhealthy` -> HTTP 503 Service Unavailable

#### 健康检查类型

| 类型                                  | 说明                                                 |
| ------------------------------------- | ---------------------------------------------------- |
| 一般健康检查（General health checks） | 检查应用基本运行状态，例如 Redis、数据库等           |
| 活跃性检查（Liveness probe）          | 检查应用是否存活，通常用于判断是否重启容器           |
| 就绪性检查（Readiness probe）         | 检查应用是否准备好接收流量，常用于服务注册或负载均衡 |

#### 使用方法

1. 安装NuGet包

对于基本的健康检查，您不需要额外的 NuGet 包，因为核心功能已包含在 `Microsoft.AspNetCore.App` 元包中。 如果您需要检查 SQL Server、Redis 等特定依赖项，则可能需要安装相应的扩展包，例如：

- `Microsoft.Extensions.Diagnostics.HealthChecks.SqlServer`
- `Microsoft.Extensions.Diagnostics.HealthChecks.Redis`
- `AspNetCore.HealthChecks.UI` (用于健康检查仪表板)
- `AspNetCore.HealthChecks.Publisher.Prometheus` (用于 Prometheus 集成)

2. 在 `Program.cs` 中注册健康检查服务

使用 `AddHealthChecks()` 扩展方法注册健康检查服务，并定义要执行的检查项。

```c#
// Program.cs
using Microsoft.Extensions.Diagnostics.HealthChecks; // 确保引入此命名空间

var builder = WebApplication.CreateBuilder(args);

// 关键步骤：注册健康检查服务
builder.Services.AddHealthChecks()
    // 1. 添加一个简单的存活检查 (Liveness Check)
    // 这是一个最基本的检查，只返回 HealthStatus.Healthy
    .AddCheck("liveness", () => HealthCheckResult.Healthy("A simple liveness check."), new[] { "live" })

    // 2. 添加一个依赖项检查 - 数据库连接
    // 需要安装 Microsoft.Extensions.Diagnostics.HealthChecks.SqlServer NuGet 包
    .AddSqlServer(
        connectionString: builder.Configuration.GetConnectionString("DefaultConnection")!,
        healthQuery: "SELECT 1;", // 用于检查连接的SQL查询
        name: "SQL Server DB",    // 检查项的名称
        failureStatus: HealthStatus.Degraded, // 失败时返回 Degraded 而不是 Unhealthy
        tags: new[] { "db", "ready" }) // 标签，用于分组和过滤检查

    // 3. 添加一个自定义的健康检查,自定义逻辑请看下一个小节
    // 实现 IHealthCheck 接口或使用 lambda 表达式
    .AddCheck<MyCustomHealthCheck>("My Custom Service", tags: new[] { "custom", "ready" })

    // 4. 添加一个外部 API 检查 (例如，检查某个外部服务的可达性)
    // 可以使用 AddUrlGroup 或 AddCheck 来实现
    .AddUrlGroup(
        uri: new Uri("https://api.example.com/health"), // 外部API的健康检查端点
        name: "External API",
        failureStatus: HealthStatus.Unhealthy,
        tags: new[] { "external" });

// 注册自定义健康检查类 (如果使用 AddCheck<T> 方式)
builder.Services.AddSingleton<MyCustomHealthCheck>();

// ... 其他服务注册 ...

var app = builder.Build();
```

3.  在 `Program.cs` 中映射健康检查终结点

注册服务后，您需要通过 `MapHealthChecks()` 扩展方法将健康检查暴露为 HTTP 终结点。

```c#
// Program.cs
// ...
var app = builder.Build();

// ... 中间件管道配置 ...

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// **关键步骤：映射健康检查终结点**

// 1. 映射一个基本的健康检查终结点
// 默认返回所有注册的健康检查的状态
app.MapHealthChecks("/healthz");

// 2. 映射一个更详细的健康检查终结点，包含具体组件的状态
// 可以使用 Predicate 过滤要显示的检查项 (基于标签)
app.MapHealthChecks("/healthz/ready", new HealthCheckOptions
{
    Predicate = healthCheck => healthCheck.Tags.Contains("ready"), // 只显示带有 "ready" 标签的检查
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse // 使用 HealthChecks.UI 的响应写入器
});

// 3. 映射一个只显示 Liveness 检查的终结点
app.MapHealthChecks("/healthz/live", new HealthCheckOptions
{
    Predicate = healthCheck => healthCheck.Tags.Contains("live")
});

app.Run();
```

#### 自定义健康检查逻辑

可以创建一个类，实现 `IHealthCheck` 接口，编写自己的健康检查逻辑。

```c#
// MyCustomHealthCheck.cs
using Microsoft.Extensions.Diagnostics.HealthChecks;

public class MyCustomHealthCheck : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        // 模拟一个随机的健康检查结果
        var isHealthy = Random.Shared.Next(0, 2) == 0; // 50% 概率健康

        if (isHealthy)
        {
            return Task.FromResult(HealthCheckResult.Healthy("My custom service is healthy."));
        }

        // 可以返回 Unhealthy 或 Degraded
        // Unhealthy: 服务无法正常工作，需要立即关注或重启
        // Degraded: 服务功能受限，但仍可部分工作
        return Task.FromResult(
            HealthCheckResult.Unhealthy("My custom service is unhealthy. Simulated failure."));
    }
}
```

#### 响应格式

当您访问健康检查终结点时，默认会返回一个简单的 JSON 响应，指示应用程序的总体健康状态。

- 简单响应示例 (`/healthz`):

```json
{
  "status": "Healthy" // 或 "Unhealthy", "Degraded"
}
```

- 详细响应示例（`/healthz/ready` 使用 `UIResponseWriter`）

```json
{
  "status": "Degraded", // 总体状态
  "totalDuration": "00:00:00.0150000",
  "entries": {
    "liveness": {
      "status": "Healthy",
      "description": "A simple liveness check.",
      "duration": "00:00:00.0001000"
    },
    "SQL Server DB": {
      "status": "Healthy",
      "description": "SQL Server DB is healthy.",
      "duration": "00:00:00.0050000"
    },
    "My Custom Service": {
      "status": "Unhealthy", // 模拟失败
      "description": "My custom service is unhealthy. Simulated failure.",
      "duration": "00:00:00.0005000"
    },
    "External API": {
      "status": "Healthy",
      "description": "External API is healthy.",
      "duration": "00:00:00.0020000"
    }
  }
}
```

#### 注意事项&最佳实践

1. **轻量级和快速**：健康检查应该尽可能地轻量级和快速。避免在健康检查中执行耗时的操作，如复杂的数据库查询或长时间的外部 API 调用。如果检查项很慢，可能会导致监控系统误判服务不健康。

2. **区分 Liveness 和 Readiness**：

   - **Liveness Probe** 应该只检查应用程序本身是否活着（例如，Web 服务器是否响应）。不要在 Liveness Probe 中检查外部依赖项，因为如果依赖项暂时不可用，您不希望应用程序被无谓地重启。

   - **Readiness Probe** 应该检查应用程序是否已准备好接收流量，包括其依赖项的可达性。

3. **标签 (Tags)**：充分利用 `tags` 来对健康检查进行分类。这允许您创建多个健康检查终结点，每个终结点只报告特定类型的检查（例如，`/healthz/live` 用于 Liveness，`/healthz/ready` 用于 Readiness）。

4. **响应写入器**：默认的健康检查响应非常简洁。对于人工查看或更高级的监控系统，考虑使用 `UIResponseWriter` 或自定义响应写入器来提供更详细的信息。

5. **安全性**：健康检查终结点通常是公开的。确保它们不暴露任何敏感信息。如果需要，可以通过网络策略、API 网关或认证来保护它们。

6. **外部依赖项**：当检查外部依赖项时，考虑其瞬时故障的可能性。如果一个依赖项只是暂时不可用，您可能希望返回 `Degraded` 而不是 `Unhealthy`，以避免不必要的服务重启。

7. **与监控系统集成**：将健康检查终结点配置到您的容器编排平台（Kubernetes 的 `livenessProbe` 和 `readinessProbe`）、负载均衡器或云监控服务中。

### 指标



## HttpContext

**定义**：HttpContext 是 ASP.NET Core 中的核心类，封装了 HTTP 请求和响应的上下文信息，包含请求、响应、会话、用户身份等数据。

**作用**：

- 提供对当前 HTTP 请求和响应的访问。
- 存储请求生命周期内的上下文数据（如认证信息、会话状态）。
- 在中间件、控制器、Razor Pages 等中用于处理请求和生成响应。

**生命周期**：每个 HTTP 请求创建一个新的 HttpContext 实例，请求结束后销毁。

### HttpRequest

通过`HttpContext.Request`，可以访问和读取所有关于传入请求的信息。

**主要属性：**

- **`Method`**：获取请求的 HTTP 方法，例如 "GET", "POST", "PUT", "DELETE" 等。

- **`Path`**：获取请求的 URL 路径，不包括域名和查询字符串。

- **`Query`**：获取请求的**查询字符串参数集合** (`IQueryCollection`)。您可以按键访问参数值。

  ```C#
  string productId = HttpContext.Request.Query["productId"]; // 获取 "?productId=123" 中的 "123"
  ```

- **`Headers`**：获取请求的**头部信息集合** (`IHeaderDictionary`)。您可以按键访问头部值。

  ```C#
  string userAgent = HttpContext.Request.Headers["User-Agent"].ToString();
  ```

- **`Body`**：获取请求体的**输入流** (`Stream`)。当客户端发送 POST 或 PUT 请求，并且请求体中包含数据（如 JSON、表单数据、文件）时，您需要从这个流中读取。

  读取 `Body` 是一个异步操作。通常会使用 `StreamReader` 或特定的模型绑定器来处理。

  ```C#
  // 读取请求体为字符串（慎用大请求体）
  using var reader = new StreamReader(HttpContext.Request.Body);
  string requestBody = await reader.ReadToEndAsync();
  ```

- **`ContentLength`**：获取请求体内容的长度（以字节为单位）。
- **`ContentType`**：获取请求体的 MIME 类型，例如 "application/json", "application/x-www-form-urlencoded" 等。
- **`IsHttps`**：指示请求是否通过 HTTPS 安全连接发送。
- **`Host`**：获取请求的主机名（域名和端口）。

### HttpResponse

通过`HttpResponse`，您可以写入响应内容、设置状态码和头部信息。

- **`StatusCode`**：设置 HTTP 响应状态码，例如 200 (OK), 404 (Not Found), 500 (Internal Server Error) 等。

  ```C#
  HttpContext.Response.StatusCode = 200;
  ```

- **`Headers`**：获取响应的**头部信息集合** (`IHeaderDictionary`)。您可以设置自定义响应头。

  ```C#
  HttpContext.Response.Headers.Add("X-Custom-Header", "MyValue");
  ```

- **`Body`**：获取响应体的**输出流** (`Stream`)。您将数据写入此流以发送给客户端。

  写入 `Body` 是一个异步操作。通常会使用 `StreamWriter` 或通过 `ControllerBase` 提供的 `Ok()`, `Json()` 等方法来间接写入。

  ```C#
  // 直接写入字符串到响应体
  await HttpContext.Response.WriteAsync("Hello, World!");
  ```

- **`ContentType`**：设置响应体的 MIME 类型，例如 "application/json", "text/plain", "text/html" 等。

  ```C#
  HttpContext.Response.ContentType = "application/json";
  ```

- **`ContentLength`**：设置响应体的长度（以字节为单位）。通常在写入 `Body` 后由框架自动计算。

- **`Redirect()`**：执行 HTTP 重定向，将客户端引导到另一个 URL。

  ```C#
  HttpContext.Response.Redirect("/login");
  ```

### RequestAborted

`HttpContext.RequestAborted` 是一个 `CancellationToken`（取消令牌）。它表示**客户端取消了请求**（例如，用户关闭了浏览器标签页，或者网络连接中断）。

**用途**：在执行长时间运行的异步操作时，您应该**监听这个令牌**。如果令牌被取消，意味着客户端不再等待响应，您可以安全地终止当前操作，释放资源，避免不必要的计算。这对于服务器资源管理和性能优化至关重要。

```C#
public async Task<IActionResult> DownloadLargeFile()
{
    // 假设这是一个耗时的文件生成或下载操作
    for (int i = 0; i < 100; i++)
    {
        // 检查客户端是否已取消请求
        if (HttpContext.RequestAborted.IsCancellationRequested)
        {
            _logger.LogWarning("Client cancelled download for large file.");
            return new EmptyResult(); // 返回空结果或适当的错误
        }
        await Task.Delay(100, HttpContext.RequestAborted); // 模拟耗时操作，并传递取消令牌
        // 写入部分数据到响应流
        await HttpContext.Response.WriteAsync($"Part {i}\n");
        await HttpContext.Response.Body.FlushAsync(); // 刷新缓冲区
    }
    return Ok("File downloaded successfully.");
}
```

在上面的例子中，`Task.Delay` 和 `HttpContext.Response.WriteAsync` 等异步操作通常会接受 `CancellationToken` 参数。当 `RequestAborted` 被触发时，这些操作就会抛出 `OperationCanceledException`，您可以捕获它来处理取消逻辑。

### Abort

`HttpContext.Abort()` 方法用于**立即终止当前 HTTP 请求的处理**。

当处于某种异常或不可恢复的状态，需要立即关闭连接并停止处理请求时使用。它会阻止进一步的中间件或终结点执行。

**注意**

- 这是一个**非常粗暴**的操作，因为它会直接关闭底层 TCP 连接，可能导致客户端收到不完整的响应或连接错误。
- 通常情况下，您应该优先通过设置 `HttpContext.Response.StatusCode` 并返回一个 `IActionResult` 来优雅地结束请求（例如 `BadRequest()`, `NotFound()`, `StatusCode(500)`），而不是使用 `Abort()`。
- `Abort()` 在某些极端的错误场景下才会被考虑使用，例如，当检测到恶意请求或服务器资源耗尽，需要紧急切断连接时。

```C#
public IActionResult UnsafeOperation()
{
    if (Environment.IsProduction() && HttpContext.Request.IsLocal()) // 假设只允许本地访问
    {
        _logger.LogError("Unauthorized access attempt detected from non-local IP. Aborting request.");
        HttpContext.Abort(); // 立即终止连接
        // 后续代码将不会执行
        return Content("Should not reach here");
    }
    return Ok("Allowed access.");
}
```

大多数情况下，使用 `return Unauthorized()` 或 `return Forbid()` 来处理访问控制，它们会发送一个标准的 HTTP 响应，而不是粗暴地终止连接。

### User

`HttpContext.User` 属性是一个 `ClaimsPrincipal` 对象，它代表了**当前 HTTP 请求的用户的身份信息**。它是 .NET Core **认证和授权机制的核心**。

**用途**：

- **身份识别**：获取当前用户的用户名、ID 或其他标识信息。
- **角色检查**：判断用户是否属于某个角色。
- **权限检查**：根据用户的声明（Claims）判断用户是否有权执行某个操作。

**组成**：
- **`ClaimsPrincipal`**：可以包含一个或多个 `ClaimsIdentity`。
- **`ClaimsIdentity`**：代表一个身份，包含一组与该身份相关的**声明 (Claims)**。
- **`Claim`**：一个键值对，表示用户的一个属性或事实，例如用户的姓名、电子邮件、角色、权限等。

```C#
using System.Security.Claims; // 确保引入此命名空间

public IActionResult GetUserProfile()
{
    // 检查用户是否已认证
    if (HttpContext.User.Identity?.IsAuthenticated ?? false)
    {
        string userName = HttpContext.User.Identity.Name; // 获取用户名
        // 获取用户ID声明（假设在登录时添加了 ClaimTypes.NameIdentifier）
        string userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        // 检查用户是否在 "Admin" 角色中
        bool isAdmin = HttpContext.User.IsInRole("Admin");

        // 获取自定义声明（如果存在）
        string department = HttpContext.User.FindFirst("Department")?.Value;

        return Ok($"User: {userName}, ID: {userId}, IsAdmin: {isAdmin}, Department: {department}");
    }
    else
    {
        return Unauthorized("User not authenticated.");
    }
}
```

### Features

`HttpContext.Features` 是一个 `IFeatureCollection`，它是一个**低级别的、键值对集合**，用于**访问和操作当前请求的特定功能和能力**。

**作用：**

- .NET Core 的许多底层功能（如请求/响应处理、连接信息、认证状态）都是通过“特性”（Feature）来实现的。
- `Features` 提供了一种灵活的机制来扩展和定制请求管道的行为，而无需修改 `HttpContext` 的核心接口。
- 它允许中间件和低层组件在请求处理过程中**暴露和发现特定功能**。

**使用方式：**

使用泛型方法 `Get<TFeature>()` 来获取特定类型的特性接口。

- **`IHttpRequestFeature`**：提供对请求方法、路径、协议等基本信息的访问。
- **`IHttpResponseFeature`**：提供对响应状态码、头部等基本信息的访问。
- **`IHttpConnectionFeature`**：提供连接信息，如本地和远程 IP 地址。
- **`IExceptionHandlerFeature`**：在异常处理中间件中获取异常信息。

```C#
using Microsoft.AspNetCore.Http.Features; // 确保引入此命名空间

public IActionResult GetConnectionInfo()
{
    // 获取连接特性
    var connectionFeature = HttpContext.Features.Get<IHttpConnectionFeature>();

    if (connectionFeature != null)
    {
        string remoteIp = connectionFeature.RemoteIpAddress?.ToString() ?? "N/A";
        int remotePort = connectionFeature.RemotePort;
        string localIp = connectionFeature.LocalIpAddress?.ToString() ?? "N/A";
        int localPort = connectionFeature.LocalPort;

        return Ok($"Client IP: {remoteIp}:{remotePort}, Server IP: {localIp}:{localPort}");
    }
    else
    {
        return StatusCode(500, "Connection feature not available.");
    }
}
```

在大多数高层应用代码中，可能不会直接与 `Features` 交互，而是通过 `HttpContext.Request`、`HttpContext.Response` 等更高级别的属性来访问信息，因为这些属性已经封装了对底层特性的访问。然而，在编写自定义中间件或深度定制框架行为时，`Features` 变得非常有用。

### 线程不安全性

**含义**

`HttpContext` 对象是**为单个 HTTP 请求而创建的**，它的设计目的是在**单线程的请求处理管道中**使用。不应该在多个线程之间共享同一个 `HttpContext` 实例，也不应该在异步操作中跨越 `await` 边界后继续直接使用它，除非您了解其限制并采取了适当的措施。

**为什么线程不安全？**

`HttpContext` 内部包含许多可变状态（如 `Request`、`Response` 等），这些状态在请求处理过程中可能会被修改。如果在多个线程同时修改或读取这些状态，就会导致数据损坏、竞态条件或不可预测的行为。

**常见问题场景**：

1. **后台任务**：在 ASP.NET Core 请求处理结束后的后台任务中，直接引用从请求中捕获的 `HttpContext` 是一个错误。此时 `HttpContext` 可能已经被销毁或重用了。

2. **异步操作中的 `await` 陷阱**：在 `async` 方法中，如果 `HttpContext` 在 `await` 之前被访问，并且 `await` 之后又被访问，由于上下文切换，`HttpContext` 可能不再是同一个实例，或者其内部状态已经发生变化。

   ```C#
   public async Task<IActionResult> MyAsyncAction()
   {
       string originalPath = HttpContext.Request.Path; // 第一次访问
   
       await Task.Delay(1000); // 模拟耗时操作，可能导致上下文切换
   
       // 警告：这里的 HttpContext.Request.Path 可能不再是原始请求的路径，
       // 如果在await期间请求被取消或上下文被重用
       string currentPath = HttpContext.Request.Path; // 第二次访问，风险点
   
       return Ok();
   }
   ```

**正确的手法**

1. **在 `await` 前捕获所需数据**：如果在`await`之后需要`HttpContext`中的特定数据，请在`await`之前将其复制到局部变量中。

   ```C#
   public async Task<IActionResult> MyAsyncAction()
   {
       string pathAtStart = HttpContext.Request.Path; // 捕获数据
       string traceId = HttpContext.TraceIdentifier; // 捕获数据
   
       await Task.Delay(1000); // 模拟耗时操作
   
       // 安全地使用已捕获的数据
       _logger.LogInformation("Path at start: {Path}, Trace ID: {TraceId}", pathAtStart, traceId);
   
       return Ok();
   }
   ```

2. **避免在后台任务中直接引用 `HttpContext`**：如果需要在后台任务中使用请求数据，请将所需的数据作为参数传递给后台任务，而不是传递 `HttpContext` 本身。
3. **使用 `IHttpContextAccessor` 的注意事项**：`IHttpContextAccessor` 虽然允许在服务层访问 `HttpContext`，但它也存在同样的线程安全限制。在后台任务中 `IHttpContextAccessor.HttpContext` 将会是 `null`。
4. **将操作包装在同步代码中**：如果操作是同步的，或者您能确保 `await` 不会导致上下文切换，那么风险较小。但通常，最好遵循上述捕获数据的原则。

## 路由

### 约定式路由

> [!CAUTION]
>
> 若在控制类上标记了[ApiController]，则该类不会匹配约定式路由

默认的路由匹配格式：`{controller=Home}/{action=Index}/{id?}`

#### 基础使用

```C#
// Program.cs
app.UseEndpoints(endpoints =>
{
    // 定义一个名为 "default" 的约定式路由
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}"); // 路由模板

    // 如果有其他约定式路由，可以继续添加，顺序很重要
    // endpoints.MapControllerRoute(
    //     name: "blog",
    //     pattern: "blog/{year}/{month?}/{slug?}");

    // 如果有 Razor Pages，也需要映射，它们默认也使用约定路由
    endpoints.MapRazorPages();
});
```

#### 复杂配置

```C#
// ========== 复杂约定式路由模式 ==========
// 1. 多层嵌套路由
app.MapControllerRoute(
    name: "nested_resource",
    pattern: "{controller}/{id:int}/{subController}/{subId:int?}",
    defaults: new { action = "Index" });

// 2. 文件路径路由
app.MapControllerRoute(
    name: "file_path",
    pattern: "files/{*filePath}",
    defaults: new { controller = "Files", action = "Get" });

// 3. 多语言路由
app.MapControllerRoute(
    name: "localized",
    pattern: "{culture:regex(^[a-z]{{2}}-[A-Z]{{2}}$)}/{controller=Home}/{action=Index}/{id?}");

// 4. 子域名路由
app.MapControllerRoute(
    name: "subdomain",
    pattern: "{controller=Home}/{action=Index}/{id?}",
    defaults: new { subdomain = "api" });

// 5. 日期路由
app.MapControllerRoute(
    name: "date_route",
    pattern: "archive/{year:int:min(2000):max(2030)}/{month:int:min(1):max(12)}/{day:int:min(1):max(31)}/{controller=Archive}/{action=Index}");

// 6. 分页路由
app.MapControllerRoute(
    name: "paging",
    pattern: "{controller}/page/{page:int:min(1)}/{action=Index}");

// 7. 默认路由（最后定义）
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
```

#### 自定义路由约定

1. 自定义约定类

```C#
// 1:API控制器约定
public class ApiControllerConvention : IControllerModelConvention
{
    public void Apply(ControllerModel controller)
    {
        // 为所有以Api结尾的控制器添加api/前缀
        if (controller.ControllerName.EndsWith("Api"))
        {
            controller.Selectors.Add(new SelectorModel
            {
                AttributeRouteModel = new AttributeRouteModel
                {
                    Template = $"api/{controller.ControllerName[..^3].ToLower()}"
                }
            });
        }
    }
}

// 2:CRUD操作约定
public class CrudActionConvention : IActionModelConvention
{
    public void Apply(ActionModel action)
    {
        var controllerName = action.Controller.ControllerName.ToLower();
        var actionName = action.ActionName.ToLower();

        // 为CRUD操作定义标准路由
        switch (actionName)
        {
            case "index":
            case "list":
            case "getall":
                action.Selectors.Add(CreateSelector($"{controllerName}", "GET"));
                break;
            case "details":
            case "get":
            case "getbyid":
                action.Selectors.Add(CreateSelector($"{controllerName}/{{id}}", "GET"));
                break;
            case "create":
            case "add":
                action.Selectors.Add(CreateSelector($"{controllerName}", "POST"));
                break;
            case "update":
            case "edit":
                action.Selectors.Add(CreateSelector($"{controllerName}/{{id}}", "PUT"));
                break;
            case "delete":
            case "remove":
                action.Selectors.Add(CreateSelector($"{controllerName}/{{id}}", "DELETE"));
                break;
        }
    }

    private SelectorModel CreateSelector(string template, string httpMethod)
    {
        return new SelectorModel
        {
            AttributeRouteModel = new AttributeRouteModel { Template = template },
            ActionConstraints = { new HttpMethodActionConstraint(new[] { httpMethod }) }
        };
    }
}

// 3. 版本化控制器约定
public class VersionedControllerConvention : IControllerModelConvention
{
    public void Apply(ControllerModel controller)
    {
        var controllerName = controller.ControllerName;
        
        // 检查控制器名称是否包含版本信息
        var versionMatch = System.Text.RegularExpressions.Regex.Match(controllerName, @"V(\d+)$");
        if (versionMatch.Success)
        {
            var version = versionMatch.Groups[1].Value;
            var baseName = controllerName.Substring(0, controllerName.Length - versionMatch.Length);
            
            controller.Selectors.Add(new SelectorModel
            {
                AttributeRouteModel = new AttributeRouteModel
                {
                    Template = $"api/v{version}/{baseName.ToLower()}"
                }
            });
        }
    }
}
```

2. 添加服务

```C#
// Program.cs 添加服务
builder.Services.AddControllers(options =>
{
    // 自定义约定
    options.Conventions.Add(new ApiControllerConvention());
    options.Conventions.Add(new CrudActionConvention());
    options.Conventions.Add(new VersionedControllerConvention());
});
```

### 特性路由

#### 类注解

[Route] 

可以用在方法上

- 如果模板以 `/` 开头**：表示这是一个**完整且独立的路径**，会忽略控制器级别的 `[Route]`。

- 如果模板不以 `/` 开头：表示这是一个**相对路径**，会追加到控制器级别的 `[Route]` 之后。

可以定义多个 `[Route]` 特性，使一个动作方法响应多个 URL。

```C#
[Route("products")]
[Route("items")]
public IActionResult GetAllProducts() { /* ... */ } // 可响应 /products 或 /items
```

#### 方法注解

**[HttpGet]、[HttpPost]、[HttpPut]、[HttpDelete]**

```C#
[HttpGet] // 继承控制器路由
public IActionResult Get() { /* GET /api/products */ }

[HttpGet("popular")] // 追加到控制器路由后
public IActionResult GetPopular() { /* GET /api/products/popular */ }

[HttpGet("/latest-products")] // 独立路由
public IActionResult GetLatest() { /* GET /latest-products */ }
```

---

**PUT VS PATCH**

| 特性       | `[HttpPut]`                | `[HttpPatch]`                          |
| ---------- | -------------------------- | -------------------------------------- |
| 语义       | 替换整个资源（完整更新）   | 局部更新资源的一部分字段（部分更新）   |
| 使用场景   | 客户端发送整个对象进行覆盖 | 客户端只发送部分字段进行更新           |
| 请求方法   | `PUT`                      | `PATCH`                                |
| 请求体格式 | 通常为完整 JSON 对象       | 通常为 JSON Patch 格式或部分 JSON 对象 |

---

`[AcceptVerbs(...)]`支持多种请求方式，如：`[AcceptVerbs("GET", "Post")]`

#### 方法参数注解

[FromRoute] [FromQuery]

```C#
[HttpGet("{id}")]
public IActionResult GetProduct([FromRoute] int id) { /* ... */ } // 'id' 从路由模板中的 {id} 获取
[HttpGet("search")]
public IActionResult SearchProducts([FromQuery] string name, [FromQuery] int minPrice) { /* ... */ } // 匹配 /search?name=abc&minPrice=100
```

[FromBody]

在一个动作方法中，**只能有一个参数**被标记为 `[FromBody]`。

```C#
[HttpPost]
public IActionResult CreateProduct([FromBody] Product product) { /* ... */ } // 'product' 对象从请求体中反序列化
```

[FromForm]

指定参数值从 **HTML 表单数据**中获取（`application/x-www-form-urlencoded` 或 `multipart/form-data`）。

```C#
[HttpPost("upload")]
public IActionResult UploadFile([FromForm] IFormFile file, [FromForm] string description) { /* ... */ }
```

[FromHeader]

```C#
[HttpGet("status")]
public IActionResult GetStatus([FromHeader(Name = "X-My-Custom-Header")] string customHeader) { /* ... */ }
```

[FromServices]

即使在 `AddControllers` 时没有明确配置，这也是默认行为之一，但显式使用可以增加代码可读性。

```C#
[HttpGet]
public IActionResult Get([FromServices] ILogger<MyController> logger) { /* ... */ } // 从DI容器获取日志服务
```

### 路由模板

一个路由模板由一个或多个段组成，这些段由 `/` 分隔。每个段可以是：

1. 字面量段

字面量段是 URL 中必须**精确匹配**的固定字符串。

**示例**：

- 模板：`api/products`
- 匹配的 URL：`/api/products`
- 不匹配的 URL：`/api/items`

2. 参数段

参数段用大括号 `{}` 包裹，表示 URL 中这部分是一个**可变的值**。路由系统会捕获这个值，并将其作为路由数据传递给你的终结点代码

**基本参数**：

- 模板：`products/{id}`
- 匹配的 URL：`/products/123` (捕获 `id = "123"`)
- 匹配的 URL：`/products/abc` (捕获 `id = "abc"`)

**可选参数**：通过在参数名后添加问号 `?` 来表示。如果 URL 中没有提供这个参数，它将是 `null` 或其默认值。

- 模板：`products/{id?}`
- 匹配的 URL：`/products/123` (捕获 `id = "123"`)
- 匹配的 URL：`/products` (捕获 `id = null`)

**带默认值的参数**：通过在参数名后添加 `=` 来指定一个默认值。这也会使参数变为可选。

- 模板：`{controller=Home}/{action=Index}/{id?}`
- 匹配的 URL：`/` (匹配 `controller = "Home"`, `action = "Index"`, `id = null`)
- 匹配的 URL：`/Products` (匹配 `controller = "Products"`, `action = "Index"`, `id = null`)
- 匹配的 URL：`/Products/Detail` (匹配 `controller = "Products"`, `action = "Detail"`, `id = null`)

### 路由约束

**常用的内置约束**：

- **`int`**：只匹配整数。
  - 模板：`products/{id:int}`
  - 匹配：`/products/123`
  - 不匹配：`/products/abc`
- `double`: 匹配浮点数
- **`guid`**：只匹配 GUID 格式的字符串。
  - 模板：`items/{itemId:guid}`
  - 匹配：`/items/a1b2c3d4-e5f6-7890-1234-567890abcdef`
- **`bool`**：只匹配布尔值 (`true`, `false`)。
- **`datetime`**：只匹配日期时间格式的字符串。
- **`alpha`**：只匹配字母字符。
  - 模板：`users/{username:alpha}`
  - 匹配：`/users/john`
  - 不匹配：`/users/john123`
- **`minlength(length)` / `maxlength(length)` / `length(min, max)`**：限制字符串长度。
  - 模板：`codes/{code:length(5)}` (精确长度为5)
- **`min(value)` / `max(value)` / `range(min, max)`**：限制数字范围。
- **`regex(pattern)`**：使用正则表达式进行匹配。
  - 模板：`articles/{year:regex(^\\d{{4}}$)}` (匹配4位数字的年份)
  - **注意**：在 C# 字符串中，正则表达式中的 `\` 和 `{}` 需要转义。

**组合约束**：你可以为同一个参数应用多个约束，用 `:` 分隔。

- 模板：`posts/{year:int:min(2000)}/{month:int:range(1,12)}`

### 特殊路由段

**控制器类**

**`[controller]`**：在特性路由中，它是一个占位符，在运行时会被替换为控制器类名（不带 "Controller" 后缀）。

如果 `ProductsController` 定义了 `[Route("api/[controller]")]`，则其基路由是 `/api/products`。

**`[action]`**：在特性路由中，它是一个占位符，在运行时会被替换为动作方法的名称。

如果 `ProductsController` 中的 `GetById()` 方法定义了 `[HttpGet("[action]/{id}")]`，则其路由可能是 `/api/products/GetById/{id}`。

---

**通配符**

作用：用于匹配 URL 路径的剩余部分。

**`{\*param}`**：捕获所有剩余的路径段，但不包括路径分隔符 `/`。

- 模板：`files/{*path}`
- 匹配：`/files/documents/report.pdf` (捕获 `path = "documents/report.pdf"`)
- 如果 URL 是 `/files/documents/sub/report.pdf`，`path` 仍为 `"documents/sub/report.pdf"`。

**`{\**param}`**：捕获所有剩余的路径段，**包括路径分隔符 `/`**。这在代理或处理文件路径时非常有用。

- 模板：`catchall/{**filepath}`
- 匹配：`/catchall/folder/subfolder/file.txt` (捕获 `filepath = "folder/subfolder/file.txt"`)



---

### URL生成
URL 生成允许你在代码（控制器、视图、Razor Pages）中动态地构建指向应用程序内部资源的 URL。这与路由匹配（将传入 URL 映射到代码）是相反的过程。
URL 生成主要通过 `Microsoft.AspNetCore.Mvc.IUrlHelper` 接口及其实现类来完成。在控制器、视图和 Razor Pages 中，你可以通过不同的方式访问到这个功能。
#### Controller中使用

在继承 `Controller` 或 `ControllerBase` 的控制器中，你可以直接通过 `Url` 属性访问 `IUrlHelper` 接口的方法。



`Url.Action()`

- **用途**：生成指向另一个**控制器动作方法**的 URL。
- **参数**：
  - `actionName` (string)：目标动作方法的名称。
  - `controllerName` (string, optional)：目标控制器的名称。如果省略，默认为当前控制器。
  - `routeValues` (object, optional)：一个匿名对象，包含作为路由参数或查询字符串的附加数据。
  - `protocol` (string, optional)：例如 "http" 或 "https"。
  - `host` (string, optional)：主机名。
  - `fragment` (string, optional)：URL 片段（`#` 后面的部分）。

- 示例：

```C#
public class ProductsController : Controller
{
    public IActionResult GetProduct(int id)
    {
        // 生成指向 ProductController 的 Details 动作的 URL
        // 假设 Details 动作路由是 /Products/Details/{id}
        string productDetailsUrl = Url.Action("Details", "Products", new { id = 123 });
        // 结果可能为: /Products/Details/123

        // 生成指向当前控制器的另一个动作（例如 Index）的 URL
        string indexUrl = Url.Action("Index");
        // 结果可能为: /Products/Index

        // 生成带有协议和主机的完整 URL
        string absoluteUrl = Url.Action("Details", "Products", new { id = 456 }, protocol: Request.Scheme, host: Request.Host.Host);
        // 结果可能为: https://localhost:5001/Products/Details/456

        return View();
    }

    public IActionResult Details(int id) { return View(); }
    public IActionResult Index() { return View(); }
}
```

---

`Url.RouteUrl()`

**用途**：生成指向一个**命名路由 (Named Route)** 的 URL。命名路由是在 `Program.cs` 的 `MapControllerRoute` 或 `MapRazorPages` 中通过 `name` 参数定义的路由。

**参数**：与 `Url.Action()` 类似，但第一个参数是路由名称。

示例：

```C#
// Program.cs中定义了一个路由
endpoints.MapControllerRoute(
    name: "productDetailsRoute",
    pattern: "products-info/{id}",
    defaults: new { controller = "Products", action = "Details" });
```

```C#
// 在控制器中生成 URL：
public class ProductsController : Controller
{
    public IActionResult SomeAction()
    {
        string namedRouteUrl = Url.RouteUrl("productDetailsRoute", new { id = 789 });
        // 结果可能为: /products-info/789
        return View();
    }
}
```

---

`Url.Page()`

**用途**：生成指向 **Razor Pages** 的 URL。

**参数**：

- `pageName` (string)：Razor Page 的路径（不带 `.cshtml` 扩展名），例如 `/Products/Details`。如果页面在区域中，需要加上 `/AreaName/PageName`。
- `routeValues` (object, optional)：路由值。
- `protocol`, `host`, `fragment`：同 `Url.Action()`。
- `handler` (string, optional)：指定 Razor Page 中的处理程序方法（例如 `OnGet`、`OnPost` 对应的命名处理程序）。

```C#
public class MyController : Controller
{
    public IActionResult SomePageAction()
    {
        // 生成指向 Pages/About.cshtml 的 URL
        string aboutPageUrl = Url.Page("/About");
        // 结果可能为: /About

        // 生成指向 Pages/Products/Details.cshtml 并带参数的 URL
        string productPageUrl = Url.Page("/Products/Details", new { id = 10 });
        // 结果可能为: /Products/Details/10

        // 生成指向 Admin 区域的 Pages/Dashboard.cshtml 的 URL
        string adminDashboardUrl = Url.Page("/Dashboard", new { area = "Admin" });
        // 结果可能为: /Admin/Dashboard

        return View();
    }
}
```

#### Razor Pages中使用

`Url` Helper 属性

与控制器中类似，视图中也直接暴露了 `Url` 属性，你可以使用 `Url.Action()`, `Url.RouteUrl()`, `Url.Page()` 等方法。

```C#
<a href="@Url.Action("Details", "Products", new { id = 1 })">View Product 1</a>
<a href="@Url.Page("/Contact")">Contact Us</a>
```

**Tag Helpers**

Tag Helpers 是一种更推荐、更 HTML 友好的方式来生成 URL。它们将服务器端代码注入到 HTML 标签中，使 HTML 保持整洁。

- **`asp-action`, `asp-controller`, `asp-route-\*`**：用于生成指向控制器动作的 URL。

  ```C#
  <a asp-action="Details" asp-controller="Products" asp-route-id="123">View Product</a>
  <a asp-action="Index" asp-route-page="2">Go to Page 2</a>
  ```

- **`asp-page`, `asp-page-handler`, `asp-route-\*`**：用于生成指向 Razor Pages 的 URL。

  ```C#
  <a asp-page="/About">About Us</a>
  <a asp-page="/Products/Details" asp-route-id="456">Product Page</a>
  <a asp-area="Admin" asp-page="/Dashboard">Admin Dashboard</a>
  ```

- **`asp-route`**：用于生成指向命名路由的 URL。

  ```C#
  <a asp-route="productDetailsRoute" asp-route-id="789">Product Info (Named Route)</a>
  ```

#### URL 生成时的路由值优先级

1. **匹配路由模板的参数**：如果提供的路由值名称与当前匹配的路由模板中的参数名一致（例如 `{id}`），那么它会被作为路由参数包含在 URL 路径中。
2. **剩余作为查询字符串**：如果提供的路由值名称**不**匹配路由模板中的任何参数名，那么它将作为**查询字符串参数**添加到 URL 的末尾。
3. **默认值**：如果路由模板中的某个参数有默认值，并且你没有在 `routeValues` 中为它提供值，那么它将使用默认值。

示例：假设路由模板是 `products/{id}`

```C#
// Url.Action("Details", "Products", new { id = 10, category = "Electronics" });
// 结果: /products/10?category=Electronics
// 'id' 匹配路由参数，'category' 不匹配，成为查询字符串。
```

#### 注意事项

- **区域 (Areas)**：如果你在区域内部工作或需要生成指向区域内资源的 URL，记住要显式地在 `routeValues` 中包含 `area` 参数，例如 `new { area = "Admin" }`。
- **当前路由值**：默认情况下，URL 生成方法会继承当前请求的路由值。例如，如果你在 `/Products/Details/123` 页面中调用 `Url.Action("Edit")`，它可能会尝试生成 `/Products/Edit/123`。如果你不希望继承某些路由值，可以明确地将其设置为 `null` 或一个空字符串。
- **协议和主机**：默认生成的 URL 是相对路径。如果需要生成绝对 URL（包含 `http://` 或 `https://` 和域名），你需要提供 `protocol` 和 `host` 参数。通常从 `Request.Scheme` 和 `Request.Host.Value` 获取。
- **HTTPS 重定向**：在生产环境中，通常会强制使用 HTTPS。生成的 URL 也应该反映这一点。
- **最小 API 的 URL 生成**：对于最小 API，通常会给终结点命名，然后通过 `LinkGenerator` 服务来生成 URL。

```C#
// Program.cs
app.MapGet("/users/{id}", (int id) => Results.Ok($"User {id}"))
   .WithName("GetUserById"); // 给终结点命名

// 在其他地方注入 LinkGenerator
app.MapGet("/generate-link", (LinkGenerator linker) =>
{
    var url = linker.GetPathByName("GetUserById", new { id = 5 });
    return Results.Ok($"Link to user 5: {url}"); // 结果可能为 /users/5
});
```



### 参数转换器

#### 自定义参数转换器



#### 模型绑定器



### 区域路由



---

### 路由组

> .NET 7.0及以上版本开始生效

#### 问题引入

```C#
// 没有路由组之前的重复配置
app.MapGet("/users", () => "List all users")
   .RequireAuthorization("AdminPolicy")
   .WithOpenApi();

app.MapGet("/users/{id}", (int id) => $"Get user {id}")
   .RequireAuthorization("AdminPolicy")
   .WithOpenApi();

app.MapPost("/users", () => "Create a new user")
   .RequireAuthorization("AdminPolicy")
   .WithOpenApi();
```

`RequireAuthorization("AdminPolicy")` 和 `WithOpenApi()` 被重复应用了三次。如果配置项更多，这种重复会非常严重。

路由组提供了一种**链式调用 (Fluent API)** 的方式，将这些共同的配置应用到整个组。

主要用于**最小 API (Minimal APIs)**。它允许你将一组相关的终结点（Endpoint）组织在一起，并对它们统一应用配置，例如：

- **共同的前缀 (Prefix)**
- **共同的中间件 (Middleware)**
- **共同的元数据 (Metadata)**（如 `[Authorize]`, `[Produces]` 等）
- **共同的命名约定 (Name Convention)**
- **共同的 OpenAPI/Swagger 文档标签 (Tags)**

#### 使用方法

路由组的核心是 `app.MapGroup()` 方法。

示例1：基本使用

```C#
// Program.cs
var app = WebApplication.CreateBuilder(args).Build();

// 创建一个路由组，并指定一个共同的前缀
var usersApi = app.MapGroup("/users"); // "/users" 是这个组所有终结点的共同前缀

// 在组内定义终结点，它们的路由会自动加上 "/users" 前缀
usersApi.MapGet("/", () => "List all users"); // 路由: GET /users
usersApi.MapGet("/{id}", (int id) => $"Get user {id}"); // 路由: GET /users/{id}
usersApi.MapPost("/", () => "Create a new user"); // 路由: POST /users

app.Run();
```

在本例中：`usersApi` 组下的所有 `MapGet` 和 `MapPost` 终结点都会自动以 `/users` 为前缀。

---

示例2：将常用的 `RequireAuthorization()`, `WithTags()`, `WithOpenApi()` 等方法应用到整个路由组

```C#
// Program.cs
var app = WebApplication.CreateBuilder(args).Build();

// 启用授权
app.UseAuthorization();
app.UseAuthentication(); // 认证也通常是必需的

// 为组添加认证和授权策略
app.MapGroup("/users")
   .RequireAuthorization("AdminPolicy") // 要求所有 /users 相关的 API 都需要 AdminPolicy 授权
   .WithTags("Users API")             // 将所有 /users 相关的 API 在 Swagger 中归类到 "Users API" 标签下
   .WithOpenApi()                     // 为组内所有 API 生成 OpenAPI 规范
   .MapGet("/", () => "List all users")
   .MapGet("/{id}", (int id) => $"Get user {id}")
   .MapPost("/", () => "Create a new user");

// 示例：另一个不需要授权的公共 API
app.MapGet("/products", () => "List all products");

app.Run();
```

现在，`"/users"` 组内的所有终结点都继承了 `RequireAuthorization("AdminPolicy")` 和 `WithTags("Users API")` 等配置，大大减少了重复代码。

---

示例3：路由组可以嵌套，这使得组织更复杂的 API 结构成为可能

```C#
var adminApi = app.MapGroup("/admin")
                   .RequireAuthorization("AdminRole"); // 管理员通用授权

var userManagement = adminApi.MapGroup("/users")
                             .WithTags("Admin Users"); // 管理员用户接口

userManagement.MapGet("/", () => "Admin: Get all users");
userManagement.MapDelete("/{id}", (int id) => $"Admin: Delete user {id}");

var productManagement = adminApi.MapGroup("/products")
                               .WithTags("Admin Products"); // 管理员产品接口

productManagement.MapPost("/", () => "Admin: Create product");
productManagement.MapPut("/{id}", (int id) => $"Admin: Update product {id}");
```

- `GET /admin/users` 将需要 `AdminRole` 授权，并带有 "Admin Users" 标签。
- `POST /admin/products` 将需要 `AdminRole` 授权，并带有 "Admin Products" 标签。

---

示例4：将控制器添加到路由组

虽然路由组主要用于最小 API，但你也可以将控制器映射到路由组中，并利用路由组的共同配置。

```C#
// Program.cs
var app = WebApplication.CreateBuilder(args).Build();
builder.Services.AddControllers(); // 添加控制器支持

var apiGroup = app.MapGroup("/api")
                  .WithTags("API Endpoints")
                  .RequireAuthorization(); // 所有 /api 下的控制器都需要授权

// 映射控制器到路由组
apiGroup.MapControllers(); // 这会将所有控制器映射到 /api/ 前缀下，并继承组的配置

app.Run();

// Controllers/MyController.cs
[ApiController]
[Route("[controller]")] // 注意这里是相对路由，会继承组的 /api 前缀
public class MyController : ControllerBase
{
    // GET /api/my
    [HttpGet]
    public string Get() => "Hello from MyController!";
}
```

通过 `apiGroup.MapControllers()`，`MyController` 的路由 `[controller]`（即 `my`）会组合到 `api` 组的前缀下，形成 `/api/my`。同时，`MyController` 下的所有动作方法也会继承 `apiGroup` 上配置的 `WithTags("API Endpoints")` 和 `RequireAuthorization()`。

---

**中间件顺序**：在路由组上添加的中间件（例如 `RequireAuthorization()`）只对组内的终结点生效，并且在这些终结点被匹配之后执行。它们是在 **终结点管道 (Endpoint Pipeline)** 中执行的，而不是全局请求管道（`app.Use...`）的一部分。

## 异常处理

| 方式                         | 场景                   | 特点                                        |
| ---------------------------- | ---------------------- | ------------------------------------------- |
| `UseExceptionHandler` 中间件 | **全局统一处理异常**   | ✅ 推荐方式，返回标准 JSON（ProblemDetails） |
| `UseDeveloperExceptionPage`  | **开发调试使用**       | 展示详细错误堆栈，仅限开发环境              |
| 控制器中 `try-catch`         | 局部业务逻辑处理       | 对于可预见异常可局部处理                    |
| 实现 `IExceptionFilter`      | 控制器层的统一异常过滤 | 可返回自定义格式 JSON                       |
| 自定义中间件处理异常         | 深度定制               | 高自由度，需自行编写逻辑                    |

### `UseExceptionHandler`中间件

1. `Program.cs`注册

   ```C#
   if (!app.Environment.IsDevelopment())
   {
       app.UseExceptionHandler("/error");
   }
   ```

2. 创建统一错误控制器

   ```C#
   [ApiController]
   public class ErrorController : ControllerBase
   {
       [Route("/error")]
       public IActionResult Error()
       {
           var feature = HttpContext.Features.Get<IExceptionHandlerFeature>();
           var exception = feature?.Error;
   
           // 可记录日志
           // _logger.LogError(exception, "未处理异常");
   
           return Problem(
               detail: exception?.Message,
               statusCode: 500,
               title: "服务器内部错误"
           );
       }
   }
   ```

3. 响应数据格式参考

   ```JSON
   {
     "type": "about:blank",
     "title": "服务器内部错误",
     "status": 500,
     "detail": "对象引用未设置到对象的实例。",
     "instance": "/api/product/5"
   }
   
   {
     "status": 500,
     "error": "服务器错误",
     "detail": "数据库连接失败",
     "path": "/api/user/1"
   }
   ```

#### `UseDeveloperExceptionPage`

仅开发时使用

会输出完整堆栈、异常类型、请求详情

```C#
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage(); // 仅在开发环境使用
}
```

### 局部`try-catch`



### 异常过滤器



### 自定义异常处理中间件



## 发出HTTP请求

### `HttpClient`



### `IHttpClientFactory`



## 静态文件

### 默认配置
`wwwroot`是默认的静态文件根目录,结构如下：

```C#
MyProject/
├── wwwroot/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── Program.cs
```

在`Program.cs`中启用中间件

```CS
var app = builder.Build();

app.UseStaticFiles(); // 启用静态文件功能
```

请求示例：

| 请求路径         | 实际访问文件路径        |
| ---------------- | ----------------------- |
| `/index.html`    | `wwwroot/index.html`    |
| `/css/style.css` | `wwwroot/css/style.css` |
| `/js/app.js`     | `wwwroot/js/app.js`     |

### 自定义静态文件目录

```CS
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "MyStaticFiles")),
    RequestPath = "/files"
});
```

假设存在目录：`MyStaticFiles/image.png`

请求路径为：`/files/image.png`

### 配置默认首页

默认情况下，访问 `/` 并不会自动返回 `index.html`，需要启用默认文件中间件：

```CS
app.UseDefaultFiles();  // 匹配 index.html、default.html 等
app.UseStaticFiles();   // 提供静态文件服务
```

- `/` → 自动返回 `/index.html`（如果存在）

- > [!important]
  >
  > 必须先 UseDefaultFiles 再 UseStaticFiles。

### 配置目录浏览

```C#
app.UseDirectoryBrowser(new DirectoryBrowserOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "MyStaticFiles")),
    RequestPath = "/browse"
});

```
访问 /browse/ 会展示该目录下的所有文件链接。

> [!WARNING]
>
> 不要用于生产环境

### 客户端缓存优化
```C#
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
    	// max-age=604800 表示缓存 7 天（单位：秒）
        ctx.Context.Response.Headers.Append("Cache-Control", "public,max-age=604800");
    }
});
```
### 限制访问文件类型
配置 StaticFileOptions 中间件来自定义访问控制，例如限制 `.config`、`.cs` 文件：
```C#
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        var path = ctx.File.Name;
        if (path.EndsWith(".cs") || path.EndsWith(".json"))
        {
            ctx.Context.Response.StatusCode = StatusCodes.Status403Forbidden;
            ctx.Context.Response.ContentLength = 0;
            ctx.Context.Response.Body = Stream.Null;
        }
    }
});
```
### 非标准文件类型的处理

通过配置 `StaticFileOptions` 的 `ContentTypeProvider` 属性来 添加或覆盖 MIME 类型映射:

需要创建一个 `FileExtensionContentTypeProvider` 实例，并向其 `Mappings` 字典添加自定义的扩展名到 MIME 类型的映射。

案例：假设有以下非标准文件类型

- `wwwroot/data/mydata.custom`，你希望它以 `text/plain` 格式提供。
- `wwwroot/assets/model.gltf`，你希望它以 `model/gltf+json` 格式提供。

```C#
// Program.cs
using Microsoft.AspNetCore.StaticFiles; // 确保引用此命名空间

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// 创建一个内容类型提供者
var contentTypeProvider = new FileExtensionContentTypeProvider();

// 添加或覆盖 MIME 类型映射
// 对于 .custom 文件，映射到 text/plain
contentTypeProvider.Mappings[".custom"] = "text/plain";
// 对于 .gltf 文件，映射到 model/gltf+json (如果默认没有，或想覆盖)
contentTypeProvider.Mappings[".gltf"] = "model/gltf+json";
// 对于 .wasm 文件，通常是默认支持的，但你也可以明确添加
contentTypeProvider.Mappings[".wasm"] = "application/wasm";
// 对于 .webp 图片
contentTypeProvider.Mappings[".webp"] = "image/webp";
// 移除某个默认的映射 (例如，如果你不希望 .js 文件以 text/javascript 提供，可以移除它)
// contentTypeProvider.Mappings.Remove(".js");

// 将自定义的 ContentTypeProvider 传递给 UseStaticFiles
app.UseStaticFiles(new StaticFileOptions
{
    ContentTypeProvider = contentTypeProvider
});

// 其他中间件和路由映射
app.UseRouting();
app.UseAuthorization();
app.MapControllers(); // 或 MapRazorPages() 等

app.Run();
```
---

**`FileExtensionContentTypeProvider`工作原理**

- `FileExtensionContentTypeProvider` 内部维护了一个字典，将文件扩展名（不含点，例如 "txt"）映射到相应的 MIME 类型字符串。
- 当你通过 `contentTypeProvider.Mappings[".extension"] = "mime/type";` 添加映射时，它会自动处理扩展名开头的点，并将其添加到内部字典。
- 当静态文件中间件需要确定一个文件的 `Content-Type` 时，它会查询这个 `ContentTypeProvider`。如果找到匹配的扩展名，就使用对应的 MIME 类型。如果没有找到，它会回退到默认行为（通常是 `application/octet-stream`）。



