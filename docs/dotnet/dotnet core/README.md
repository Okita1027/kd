---
title: .NET Core
index: false
order: 1
---

.NET CORE README





### 一、基础概念与核心原理

1. 什么是 SignalR？解决什么问题？
2. 实时通信技术对比（WebSocket / SSE / Long Polling）
3. SignalR 的自动传输协议协商机制
4. Hub 模型 vs 传统 HTTP 请求-响应模型

### 二、服务端开发（ASP.NET Core）

1. 创建和配置 Hub
2. 客户端-服务端方法调用（RPC）
3. 连接生命周期管理（OnConnectedAsync / OnDisconnectedAsync）
4. 错误处理与日志记录

### 三、客户端开发（.NET / JavaScript / 其他）

1. .NET 客户端连接与调用
2. JavaScript 客户端（浏览器环境）
3. 其他平台客户端（如 MAUI、WPF、Xamarin）

### 四、消息分发模式

1. 广播（All）
2. 单播（Client / User）
3. 组播（Groups）
4. 流式传输（Streaming）

### 五、安全与认证

1. 集成 ASP.NET Core 身份认证（JWT / Cookie）
2. 基于声明的授权（Authorize 属性）
3. 自定义连接策略（Connection ID 与用户映射）

### 六、高级特性

1. 强类型 Hub（Type-Safe Hubs）
2. 自定义协议（MessagePack 替代 JSON）
3. 依赖注入（DI）在 Hub 中的使用
4. 与后台服务集成（IHostedService + HubContext）

### 七、可扩展性与生产部署

1. 横向扩展（Scale-out）需求分析
2. 使用 Redis 作为背板（Backplane）
3. Azure SignalR Service（托管方案）
4. 性能调优与监控（指标、日志、连接数）

### 八、测试与调试

1. 单元测试 Hub 方法
2. 集成测试（TestServer + HubConnection）
3. 调试技巧（日志级别、Fiddler/Wireshark 分析）

### 九、典型应用场景

1. 聊天应用
2. 实时协作（如协同编辑）
3. 仪表盘与监控系统
4. 游戏状态同步
5. 通知中心（站内信、推送）