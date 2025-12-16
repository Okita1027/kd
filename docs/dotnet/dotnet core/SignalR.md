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

## 基础概念与核心原理

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



### 客户端-服务端方法调用（RPC）

### 连接生命周期管理（OnConnectedAsync / OnDisconnectedAsync）

### 错误处理与日志记录



















