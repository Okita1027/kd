---
title: SignalR
shortTitle: SignalR
description: SignalR
date: 2025-12-16 11:28:33
categories: [.NET, .NET Core]
tags: [.NET]
header: [1, 5]
author:
  name: Okita
  url: https://zhiyun.space
  email: 2368932388@qq.com
order: 18
---

> [使用 ASP.NET Core SignalR 中的中心 | Microsoft Learn](https://learn.microsoft.com/zh-cn/aspnet/core/signalr/hubs?view=aspnetcore-10.0#configure-signalr-hubs)

## 快速上手

### 定义Hub（服务端）

```CS
// Hubs/ChatHub.cs
public class ChatHub : Hub
{
    public async Task SendMessage(string user, string message)
    {
        // 广播给所有客户端
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }

    public override async Task OnConnectedAsync()
    {
        Console.WriteLine($"Client {Context.ConnectionId} connected");
        await base.OnConnectedAsync();
    }
}
```

### 注册服务&路由（Program.cs）

```CS
builder.Services.AddSignalR();

var app = builder.Build();
app.MapHub<ChatHub>("/chathub"); // ← 客户端连接地址
```

### 客户端

```CS
var connection = new HubConnectionBuilder()
    .WithUrl("http://localhost:5000/chathub")
    .Build();

// 订阅服务端推送
connection.On<string, string>("ReceiveMessage", (user, msg) =>
{
    Console.WriteLine($"{user}: {msg}");
});

await connection.StartAsync();

// 发送消息
await connection.InvokeAsync("SendMessage", "Alice", "Hello!");
```

## 基础概念/核心原理

### 什么是 SignalR？解决什么问题？

**SignalR** 是微软提供的一个 **简化实时 Web 功能开发** 的库。它允许服务器**主动向客户端推送数据**，而无需客户端轮询。

传统 HTTP 是“请求-响应”模式，**客户端必须先问，服务器才能答**。而 SignalR 建立**持久连接**后，服务器可随时“喊话”。

### 实时通信技术对比（WebSocket / SSE / Long Polling）

| 技术                         | 描述                                   | 优点                     | 缺点                  |
| ---------------------------- | -------------------------------------- | ------------------------ | --------------------- |
| **WebSocket**                | 全双工、低延迟、标准协议               | 高效、现代浏览器支持好   | 需要服务器/代理支持   |
| **Server-Sent Events (SSE)** | 服务器 → 客户端单向流                  | 简单、基于 HTTP          | 仅支持单向、IE 不支持 |
| **Long Polling**             | 客户端发请求，服务器 hold 住直到有数据 | 兼容性极好（所有浏览器） | 延迟高、资源消耗大    |

**SignalR 的优势：自动选择最佳可用协议**（优先 WebSocket → SSE → Long Polling），开发者只需写一套代码！

### SignalR 的自动传输协议协商机制

当你创建 `HubConnection` 时，SignalR 会：

1. 先发起一个 `/negotiate` HTTP POST 请求
2. 服务端返回支持的协议列表（如 `["webSockets", "serverSentEvents", "longPolling"]`）
3. 客户端选择**最高优先级且自身支持**的协议建立连接

### Hub 模型 vs 传统 HTTP 请求-响应模型

| 对比项   | 传统 REST API        | SignalR Hub                |
| -------- | -------------------- | -------------------------- |
| 通信方向 | 客户端 → 服务器      | 双向（服务器 ↔ 客户端）    |
| 连接     | 短连接（请求完即断） | 长连接（保持活跃）         |
| 数据推送 | 不可能（需轮询）     | 原生支持                   |
| 编程模型 | 控制器 + Action      | Hub 类 + 方法 + 客户端回调 |

> 💡 **Hub 本质是一个 RPC（远程过程调用）容器**：
>
> - 客户端可调用 Hub 上的 public 方法
> - Hub 可调用客户端注册的 JavaScript/.NET 方法

## 服务端开发

### 创建和配置 Hub

**什么是 Hub？**

- **Hub 是 SignalR 的“通信中枢”**：服务端定义方法，客户端通过它调用或接收消息。
- **本质是 RPC（远程过程调用）**：客户端调用 `hub.SendMessage("Hello")`，服务端执行 `SendMessage` 方法。

**创建 Hub（服务端）：**

~~~cs
// Hubs/ChatHub.cs
public class ChatHub : Hub
{
    // 1. 定义可被客户端调用的方法
    public async Task SendMessage(string user, string message)
    {
        // 广播给所有连接的客户端
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }

    // 2. 连接生命周期方法（下节详解）
    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
        Console.WriteLine($"新连接: {Context.ConnectionId}");
    }
}
~~~

**配置服务（Program.cs）：**

```cs
var builder = WebApplication.CreateBuilder(args);

// 1. 添加 SignalR 服务
builder.Services.AddSignalR();

var app = builder.Build();

// 2. 注册 Hub 路由（客户端连接地址：/chathub）
app.MapHub<ChatHub>("/chathub");

app.Run();
```

> 💡 **关键点**：
>
> - `MapHub<T>` 定义了客户端连接的 **URL 路径**（如 `http://localhost:5000/chathub`）
> - Hub 类**必须是 public**，且**继承自 `Hub`**（不是 `HubBase`）

### 客户端——服务端方法调用

**场景：**客户端发送消息 → 服务端处理 → 广播给所有人

**服务端（Hub）：**

```cs
public async Task SendMessage(string user, string message)
{
    // ✅ 重要：使用 Clients.All.SendAsync 向所有客户端推送
    await Clients.All.SendAsync("ReceiveMessage", user, message);
}
```

**客户端（调用服务端方法）：**

```CS
var connection = new HubConnectionBuilder()
    .WithUrl("http://localhost:5000/chathub")
    .Build();

// 1. 连接
await connection.StartAsync();

// 2. 调用服务端方法（触发 SendMessage）
await connection.InvokeAsync("SendMessage", "Alice", "Hello!");
```

**客户端（接受服务端推送）：**

```CS
// 1. 订阅 ReceiveMessage 事件
connection.On<string, string>("ReceiveMessage", (user, msg) =>
{
    Console.WriteLine($"{user}: {msg}"); // 输出: Alice: Hello!
});

// 2. 等待消息（实际中无需手动等待）
```

> ✅ **关键机制**：
>
> - `Clients.All.SendAsync` → 服务端推送
> - `InvokeAsync` → 客户端调用服务端方法
> - **双向通信**：客户端可调用服务端，服务端可推送客户端

### 连接生命周期管理

**作用：**

- 管理**用户会话**（如记录在线用户）
- **清理资源**（避免内存泄漏）
- **处理断线重连**（如网络波动）

```CS
public class ChatHub : Hub
{
    // ✅ 连接建立时触发
    public override async Task OnConnectedAsync()
    {
        // 1. 获取当前连接的用户ID（需提前设置）
        var userId = Context.User?.FindFirst("userId")?.Value;
        
        // 2. 将连接ID加入用户组（用于私信）
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);
        }
        
        // 3. 通知所有用户
        await Clients.Others.SendAsync("UserConnected", userId);
    }

    // ✅ 连接断开时触发
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst("userId")?.Value;
        
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);
        }
        
        await Clients.Others.SendAsync("UserDisconnected", userId);
        
        await base.OnDisconnectedAsync(exception);
    }
}
```

**生命周期流：**客户端连接 → OnConnectedAsync → 服务端处理 → 客户端断开 → OnDisconnectedAsync

## 客户端开发

### 安装SignalR.NET包

- 服务端使用 `Microsoft.AspNetCore.SignalR`，客户端需要 `Microsoft.AspNetCore.SignalR.Client`
- 两者是**独立的库**，客户端需要额外安装

> [!TIP]
>
> 确保客户端和服务器端的 SignalR 版本兼容

### 创建HubConnection并连接到SignalR Hub

**基础连接代码：**

```CS
// 1. 创建连接构建器
var connection = new HubConnectionBuilder()
    .WithUrl("http://localhost:5000/chathub") // 服务端 Hub 路由
    .Build();

// 2. 启动连接
await connection.StartAsync();

Console.WriteLine("Connected to SignalR Hub!");
```

**关键配置选项：**

```CS
var connection = new HubConnectionBuilder()
    .WithUrl("http://localhost:5000/chathub", options =>
    {
        // 1. 设置传输方式（可选，自动协商）
        options.Transports = HttpTransportType.WebSockets | HttpTransportType.LongPolling;
        
        // 2. 设置心跳间隔（默认5秒）
        options.KeepAliveInterval = TimeSpan.FromSeconds(10);
        
        // 3. 启用详细错误（开发时使用）
        options.EnableDetailedErrors = true;
        
        // 4. 添加自定义标头（如认证令牌）
        options.Headers.Add("Authorization", "Bearer " + token);
    })
    .Build();
```

> [!TIP]
>
> - 服务端 Hub 路由必须与 `WithUrl` 的 URL 匹配（如 `/chathub`）
> - **WebSocket 不支持自定义 Header**，所以不能用 `Authorization`，需用 URL 参数传递令牌

### 订阅服务端推送（接收消息）

**服务端推送方法（服务端）:**

```CS
public async Task SendMessage(string user, string message)
{
    await Clients.All.SendAsync("ReceiveMessage", user, message);
}
```

**客户端订阅：**

```CS
// 1. 订阅 ReceiveMessage 事件
connection.On<string, string>("ReceiveMessage", (user, message) =>
{
    Console.WriteLine($"{user}: {message}"); // 输出: Alice: Hello!
    
    // 2. 在 UI 线程更新（WPF/MAUI 需要）
    // WPF: Dispatcher.Invoke(...)
    // MAUI: MainThread.BeginInvokeOnMainThread(...)
});

// 3. 启动连接
await connection.StartAsync();
```

> [!NOTE]
>
> - `On<T1, T2>` 方法名必须与服务端 `SendAsync` 的第一个参数匹配
> - 参数类型必须与服务端发送的类型一致

### 调用服务端方法（发送消息）

**服务端方法（服务端）：**

```CS
public async Task SendMessage(string user, string message)
{
    await Clients.All.SendAsync("ReceiveMessage", user, message);
}
```

**客户端调用：**

```CS
// 1. 调用服务端 SendMessage 方法
await connection.InvokeAsync("SendMessage", "Bob", "Hello from .NET Client!");

// 2. 用 async/await 处理异步
try
{
    await connection.InvokeAsync("SendMessage", "Bob", "Hello from .NET Client!");
    Console.WriteLine("Message sent successfully");
}
catch (Exception ex)
{
    Console.WriteLine($"Error sending message: {ex.Message}");
}
```

### 自动重连机制

**默认行为：**

- 连接断开后，自动尝试重连
- 第一次重连：立即
- 第二次重连：5秒后
- 第三次重连：10秒后
- 第四次重连：30秒后
- 之后：每30秒尝试一次

**配置自定义策略：**

```CS
// 自定义重连策略：60秒内随机等待0-10秒
public class RandomRetryPolicy : IRetryPolicy
{
    private readonly Random _random = new Random();
    
    public TimeSpan? NextRetryDelay(RetryContext retryContext)
    {
        // 60秒内随机等待
        if (retryContext.ElapsedTime < TimeSpan.FromSeconds(60))
        {
            return TimeSpan.FromSeconds(_random.NextDouble() * 10);
        }
        else
        {
            // 60秒后停止重连
            return null;
        }
    }
}

// 使用自定义策略
var connection = new HubConnectionBuilder()
    .WithUrl("http://localhost:5000/chathub")
    .WithAutomaticReconnect(new RandomRetryPolicy())
    .Build();
```



## 消息分发模式

| 模式                       | 作用                               | 适用场景                 | 服务端代码示例                                       |
| -------------------------- | ---------------------------------- | ------------------------ | ---------------------------------------------------- |
| **广播（Broadcast）**      | 向**所有**连接的客户端发送消息     | 系统公告、聊天室全员消息 | `Clients.All.SendAsync(...)`                         |
| **单播（Unicast）**        | 向**特定连接ID**的客户端发送消息   | 私信、精准通知           | `Clients.Client(connectionId).SendAsync(...)`        |
| **组播（Multicast）**      | 向**特定组**中的所有客户端发送消息 | 多房间聊天、频道         | `Groups.AddToGroupAsync(...)` + `Clients.Group(...)` |
| **用户定向（User-based）** | 向**特定用户**的所有连接发送消息   | 用户专属通知、私信       | `Clients.User(userId).SendAsync(...)`                |

> 💡 **类比**：
>
> - 广播 = 公告栏贴通知
> - 单播 = 门牌号发信件
> - 组播 = 电梯间发通知
> - 用户定向 = 个人信箱投递

### 广播

**服务端**

```CS
public async Task BroadcastMessage(string user, string message)
{
    // ✅ 向所有客户端发送消息
    await Clients.All.SendAsync("ReceiveMessage", user, message);
    
    // ✅ 也可以用 InvokeAsync（不常用，因为不需要客户端响应）
    // await Clients.All.InvokeAsync("ReceiveMessage", user, message);
}
```

**客户端**

```CS
connection.On<string, string>("ReceiveMessage", (user, msg) =>
{
    Console.WriteLine($"广播消息: {user}: {msg}");
});
```

> [!NOTE]
>
> `Clients.All` 会发送给**所有**客户端，包括发送者自己。如果不想自己收到，用 `Clients.Others`。

### 组播

SignalR 还支持将多个客户端加入同一组，服务器可以向组内所有客户端发送消息。每个客户端可以加入多个组。

**服务端（添加/移除组）：**

```CS
public async Task JoinRoom(string roomName)
{
    // 1. 将当前连接加入指定组
    await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
    
    // 2. 通知组内成员
    await Clients.Group(roomName).SendAsync("RoomMessage", "System", $"{Context.ConnectionId} joined {roomName}");
}

public async Task SendMessageToRoom(string roomName, string user, string message)
{
    // 3. 向指定组发送消息
    await Clients.Group(roomName).SendAsync("RoomMessage", user, message);
}
```

**客户端：**

```CS
// 1. 连接后加入房间
await connection.StartAsync();
await connection.InvokeAsync("JoinRoom", "room1");

// 2. 发送消息到房间
await connection.InvokeAsync("SendMessageToRoom", "room1", "Alice", "Hello from room1!");
```

> [!note]
>
> 在 `OnDisconnectedAsync` 中要移除连接组：
>
> ```CS
> public override async Task OnDisconnectedAsync(Exception? exception)
> {
>     await Groups.RemoveFromGroupAsync(Context.ConnectionId, "room1");
>     await base.OnDisconnectedAsync(exception);
> }
> ```

### 单播

点对点模式允许服务器将消息发送给特定的客户端。可以通过客户端的连接 ID 来指定发送对象。

**服务端：**

```CS
// 获取所有连接ID（示例，实际中应存储在数据库）
private static Dictionary<string, string> _connections = new Dictionary<string, string>();

public async Task SendToClient(string connectionId, string message)
{
    // 1. 向特定连接ID发送消息
    await Clients.Client(connectionId).SendAsync("DirectMessage", "System", message);
}
```

**客户端获取连接ID：**

```CS
// 1. 连接后获取连接ID
var connectionId = connection.ConnectionId;
Console.WriteLine($"我的连接ID: {connectionId}");

// 2. 将连接ID发送到服务端（用于后续单播）
await connection.InvokeAsync("RegisterConnectionId", connectionId);
```

**服务端注册连接ID：**

```CS
public async Task RegisterConnectionId(string connectionId)
{
    // 1. 存储连接ID与用户ID的映射
    _connections[connectionId] = Context.User?.FindFirst("userId")?.Value;
}
```

> [!NOTE]
>
> - **连接ID是临时的**：每次重新连接都会变化
> - **不要**在客户端存储连接ID用于长期推送
> - **推荐使用 Groups/User 代替单播**，因为连接ID不稳定

### 用户定向

#### Qwen3-MAX

服务端向**已认证的特定用户**的所有客户端发送消息。

**服务端(`ChatHub.cs`）：**

```CS
public async Task SendMessageToUser(string userId, string message)
{
    // 1. 向特定用户发送消息（所有该用户的连接）
    await Clients.User(userId).SendAsync("PrivateMessage", "System", message);
}

public async Task SendMessageToUsers(List<string> userIds, string message)
{
    // 2. 向多个用户发送消息
    await Clients.Users(userIds).SendAsync("PrivateMessage", "System", message);
}
```

**客户端（认证）：**

```CS
// 1. 服务端验证 JWT 并设置用户ID
public override async Task OnConnectedAsync()
{
    var token = Context.GetHttpContext().Request.Query["access_token"];
    var userId = ValidateToken(token); // 验证并返回用户ID
    
    // 2. 将连接ID与用户ID关联（用于后续定向推送）
    await Groups.AddToGroupAsync(Context.ConnectionId, userId);
    
    // 3. 通知用户上线
    await Clients.User(userId).SendAsync("UserOnline", userId);
}
```

**客户端（发送通信）：**

```CS
// 1. 连接时传递用户ID（通过URL参数）
var urlWithToken = $"http://localhost:5000/chathub?access_token={token}&userId={userId}";

// 2. 发送私信
await connection.InvokeAsync("SendMessageToUser", "user2", "Hello private message!");
```

#### Gemini3.0

在 SignalR 中，**用户定向模式 (User Addressing / User Targeting)** 指的是系统如何将一个逻辑上的“用户身份”（User Identity）映射到其当前所有活动的物理连接（Connections）上。

这使开发者可以简单地调用 `Clients.User("张三")`，而 SignalR 会自动找到“张三”的手机、电脑和平板，并向这三台设备同时发送消息。

##### 核心逻辑

在 SignalR 内部，维护着一种映射关系：

- **逻辑用户 (User ID):** 也就是你的业务系统中的主键（如 `Alice` 或 `10086`）。
- **物理连接 (Connection ID):** SignalR 自动生成的临时 ID（如 `xH_jL...`）。

**用户定向模式的工作流：**

1. **连接时：** 当客户端连接上来，SignalR 会问：“你是谁？”（提取 UserID）。
2. **存储：** SignalR 在内存中记录：`Alice` -> `[Connection_Phone, Connection_PC]`。
3. **发送时：** 当你调用 `Clients.User("Alice")`。
4. **路由：** SignalR 查找映射表，找到那两个 ConnectionID，然后并发发送。

##### 默认行为：基于Claims

SignalR 默认**高度依赖 ASP.NET Core 的身份验证系统**。

默认情况下，SignalR 使用 `IUserIdProvider` 接口来提取用户 ID。它的默认实现逻辑是：从用户的 **Claims (声明)** 中查找 `ClaimTypes.NameIdentifier`。

如果你使用标准的 ASP.NET Core Identity 或常见的 JWT 认证，通常 `NameIdentifier` (即 JWT 中的 `sub` 字段) 已经包含了用户 ID，**你不需要做任何配置，直接能用。**

##### 自定义定向逻辑`IUserIdProvider`

如果你的 JWT 中存放 ID 的字段不是标准的 `NameIdentifier`，而是叫 `EmployeeId` 或者 `Email`，或者你的系统逻辑比较特殊，你就需要**自定义用户提取逻辑**。

1. 实现接口：创建自己的Provider

   ```CS
   using Microsoft.AspNetCore.SignalR;
   
   public class EmailBasedUserIdProvider : IUserIdProvider
   {
       public string GetUserId(HubConnectionContext connection)
       {
           // 这里的 connection.User 就是 HttpContext.User
           // 假设我们想用 Email 作为发送消息的凭证
           return connection.User?.FindFirst(ClaimTypes.Email)?.Value;
       }
   }
   ```

2. 注册服务：在`Program.cs`中覆盖默认实现

   ```CS
   // 注意：必须是 Singleton
   builder.Services.AddSingleton<IUserIdProvider, EmailBasedUserIdProvider>();
   
   builder.Services.AddSignalR();
   ```

3. 使用

   现在，当调用 `Clients.User("boss@company.com")` 时，SignalR 就会根据 Email 找到对应的连接。

##### 发送API

用户定向模式提供了两种主要的发送方式：

1. 发送给单个用户

   ```CS
   // 自动推送到该用户的所有设备
   await Clients.User("user_123").SendAsync("Alert", "你的订单已发货");
   ```

2. 发送给多个用户（列表）

   如果你需要给一个特定的名单发消息（比如“项目组A的所有人”），但又不想创建一个 SignalR Group：

   ~~~CS
   var managers = new List<string> { "manager_01", "manager_02", "ceo" };
   
   // 性能优化：这是一次性发送，比循环调用 User() 效率高
   await Clients.Users(managers).SendAsync("Notice", "会议开始");
   ~~~

> [!note]
>
> 1. **必须先认证 (Authentication)：** 如果用户没有登录（是匿名用户），`Context.User` 为空，`GetUserId` 返回 null，那么 `Clients.User(...)` 对该用户将**无效**。
> 2. **大小写敏感：** 默认情况下，User ID 是区分大小写的。`Alice` 和 `alice` 被视为两个不同的人。
> 3. **不验证 ID 存在性：** 当你调用 `Clients.User("NonExistentID")` 时，SignalR **不会报错**，它只是默默地发现找不到对应的连接，然后什么都不做。

| **模式**     | **核心标识**       | **维护成本**                | **适用场景**                     |
| ------------ | ------------------ | --------------------------- | -------------------------------- |
| **用户定向** | `UserId` (持久)    | **低** (自动提取，自动映射) | 私信、个人通知、多端同步         |
| **分组定向** | `GroupName` (临时) | **中** (需手动 Add/Remove)  | 聊天室、即时游戏大厅、多租户广播 |

### HubContext发送到特定客户端

`HubContext` 允许你在 **Hub** 类之外向客户端发送消息。通过 `HubContext`，你可以在控制器、后台任务、或任何其他服务中向连接的客户端发送消息。

```CS
public class NotificationService
{
    private readonly IHubContext<ChatHub> _hubContext;

    public NotificationService(IHubContext<ChatHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendNotification(string connectionId, string message)
    {
        await _hubContext.Clients.Client(connectionId).SendAsync("ReceiveMessage", message);
    }
}
```

## 高级特性

### 强类型Hub

**问题背景：**

```CS
Clients.All.SendAsync("ReceiveMessage", user, msg);
```

- 方法名是字符串 → **编译期不检查**
- 参数不匹配 → **运行期才炸**
- 重构困难（改名不会报错）

**解决方案：**

> **用接口代替字符串协议**

- 服务端：声明“我能调用客户端哪些方法”
- 客户端：实现这些方法

1. 定义客户端接口

   ```CS
   public interface IChatClient
   {
       Task ReceiveMessage(string user, string message);
       Task UserJoined(string user);
   }
   ```

2. 继承Hub`<TClient>`

   ```CS
   public class ChatHub : Hub<IChatClient>
   {
       public async Task SendMessage(string user, string message)
       {
           await Clients.All.ReceiveMessage(user, message);
       }
   }
   ```

### 自定义协议:MessagePack

默认情况下，SignalR 使用 **JSON** 传输数据。JSON 易读，但体积大（文本格式）。 **MessagePack** 是一种高效的二进制序列化格式。

**适用场景：**

- 高频实时数据（如股票行情、鼠标移动轨迹、游戏状态）。
- 带宽敏感环境（移动网络）。

**使用方法：**

1. 安装Nuget包

   - Server: `Microsoft.AspNetCore.SignalR.Protocols.MessagePack`
   - Client (.NET): `Microsoft.AspNetCore.SignalR.Client.Protocols.MessagePack`

2. 服务器配置

   ```CS
   builder.Services.AddSignalR(hubOptions =>
   {
       hubOptions.EnableDetailedErrors = true;
   })
   .AddMessagePackProtocol(options =>
   {
       options.SerializerOptions = MessagePackSerializerOptions.Standard;
   });
   ```

3. 客户端配置

   ```CS
   var connection = new HubConnectionBuilder()
       .WithUrl("http://localhost:5000/chathub")
       .AddMessagePackProtocol() // ✅ 替换 JSON 为 MessagePack
       .Build();
   ```

**消息示例对比：**

```JSON
// JSON
{
  "type": 1,
  "target": "ReceiveMessage",
  "arguments": ["Alice", "Hello!"]
}
```

```MsgPack
// MessagePack 二进制（十六进制表示）
FC 64 74 79 70 65 C3 65 74 61 72 67 65 74 CA 52 65 63 65 69 76 65 4D 65 73 73 61 67 65 61 72 67 75 6D 65 6E 74 73 92 81 64 41 6C 69 63 65 86 48 65 6C 6C 6F 21
```

### 依赖注入在Hub中的使用

SignalR Hub 与 ASP.NET Core 的 Controller 一样，完全支持依赖注入。

**原理：** 每次客户端调用 Hub 方法时，SignalR 都会创建一个**新的 Hub 实例**，调用结束后销毁。因此，你可以在构造函数中注入服务。

| 服务生命周期  | 特性             | 适用场景       |
| ------------- | ---------------- | -------------- |
| **Transient** | 每次请求新实例   | 无状态服务     |
| **Scoped**    | 每个连接一个实例 | 需要访问数据库 |
| **Singleton** | 全局单例         | 缓存、静态数据 |

**服务注册(`Program.cs`)**

```CS
builder.Services.AddTransient<IMessageLogger, DatabaseMessageLogger>();
builder.Services.AddScoped<IDatabaseContext, SqliteDatabaseContext>();
builder.Services.AddSingleton<ICacheService, RedisCacheService>();
```

**Hub中使用DI**

~~~CS
[Authorize]
public class ChatHub : Hub
{
    private readonly IMessageLogger _messageLogger;
    private readonly ICacheService _cacheService;

    // 1. 构造函数注入
    public ChatHub(IMessageLogger logger, ICacheService cache)
    {
        _messageLogger = logger;
        _cacheService = cache;
    }

    public async Task SendPublicMessage(string user, string message)
    {
        // 2. 使用注入的服务
        await _messageLogger.LogAsync(user, message);
        await _cacheService.SetAsync($"last_message:{user}", message, TimeSpan.FromMinutes(5));
        
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}
~~~

> [!note]
>
> - **不要在 Hub 中直接 new 服务**（违反 DI 原则）
> - **避免使用 Singleton 服务持有 Hub 引用**（可能导致内存泄漏）
> - **作用域服务需在 Hub 内部创建作用域**（见下一节）

### 后台服务集成（IHostService+IHubContext）

这是 SignalR 最常见的架构模式之一。

**场景：** 你有一个后台定时任务（`BackgroundService`），每秒生成一次股票价格。你希望把这个价格推送到所有连接的客户端。 **问题：** `BackgroundService` 不是 `Hub`，它没有 `Clients` 属性，怎么推？

**解决方案：** 注入 `IHubContext<THub>`。它是 SignalR 提供的通向 Hub 外部世界的“传送门”。

```CS
// 一个简单的后台定时任务
public class StockTickerWorker : BackgroundService
{
    // 注入 IHubContext，指定对应的 Hub 类型
    // 如果是强类型 Hub，注入 IHubContext<StrongHub, IChatClient>
    private readonly IHubContext<StrongHub, IChatClient> _hubContext;

    public StockTickerWorker(IHubContext<StrongHub, IChatClient> hubContext)
    {
        _hubContext = hubContext;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            // 模拟生成价格
            var price = GenerateRandomPrice();

            // 🔥 关键：在 Hub 外部调用客户端
            // 注意：这里没有 Context.ConnectionId，因为是后台触发的，没有“当前用户”
            await _hubContext.Clients.All.ReceiveAlert($"当前股价: {price}");

            await Task.Delay(1000, stoppingToken);
        }
    }
}
```

注册服务（`Program.cs`）：

```CS
builder.Services.AddHostedService<StockTickerWorker>();
```

> **`IHubContext` 的限制：**
>
> - 它只能**发送**消息。
> - 它无法访问 `Context`（没有 `Context.User`，没有 `Context.ConnectionId`），因为它不是由客户端请求触发的。
> - 如果你需要给特定用户发，必须知道该用户的 ID (`_hubContext.Clients.User(userId)`)。









