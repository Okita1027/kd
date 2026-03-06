---
title: Paket
shortTitle: Paket
description: Paket
date: 2025-2-1 15:51:33
categories: [.NET, C#]
tags: [.NET]
---

Paket 是在 NuGet 之上的一层“包装”。它依然从 NuGet.org 下载包，但它改变了**管理依赖的方式**。

在传统的 NuGet 流程中，每个项目（`.csproj`）独立管理自己的包。而 Paket 采用**集中式管理**：你先在一个全局文件中定义“我需要什么”，然后由 Paket 决定版本，并分发到各个子项目中。

## 核心文件

### paket.dependencies

整个解决方案的依赖策略

```cs
source https://api.nuget.org/v3/index.json

nuget Newtonsoft.Json
nuget NLog
nuget SqlSugarCore
```

- 使用哪个 NuGet 源
- 允许使用哪些包

### paket.references

某个项目实际使用哪些包

```cs
Newtonsoft.Json
NLog
```

> 无需声明版本

### paket.lock

最终解析后的精确版本

```cs
Newtonsoft.Json (13.0.3)
NLog (5.2.0)
```

类似`packages.lock.json`



## 使用方法

如果你接手了一个已有项目，你通常不需要手动编辑这些文件，而是使用 Paket 的命令行工具：

### 还原包

 当你刚拉下代码时，运行以下命令（取决于你是全局安装还是本地安装）：

```BASH
dotnet paket restore
```

### 添加新包

如果你想给某个项目添加 `Newtonsoft.Json`：

```BASH
dotnet paket add Newtonsoft.Json --project 路径/到/你的项目.csproj
```

这会自动更新 `paket.dependencies` 和对应的 `paket.references`。

### 升级版本

#### 升级特定的包到指定版本

这是最常用的方式，建议通过命令行操作，因为它会自动处理依赖关系并更新 `paket.lock` 文件。

```BASH
dotnet paket update nuget <包名> --version <新版本号>
```

例如：`dotnet paket update nuget Newtonsoft.Json --version 13.0.3`

- Paket 会修改根目录的 `paket.dependencies` 文件，将该包的版本号更新。
- Paket 会重新计算依赖树，更新 `paket.lock` 文件。
- 它**不会**改动你的 `paket.references` 文件（除非该包是新添加的）。

#### 升级到符合规则的最新版本

如果你在 `paket.dependencies` 中定义的是一个范围（例如 `nuget Newtonsoft.Json ~> 12.0`），你想安装 12.x 系列的最新的稳定版：

```BASH
dotnet paket update nuget <包名>
```

Paket 会去检查 NuGet 仓库，如果发现有更高的 12.x 版本，就会更新 `paket.lock`。

#### 全量升级

如果你想让整个项目所有的包都升级到 `paket.dependencies` 允许的最新版本：

```BASH
dotnet paket update
```

#### 手动修改文件

不使用命令行，手动完成操作：

1. 修改 `paket.dependencies`：找到对应的行，手动改掉版本号。

   ```BASH
   // 修改前
   nuget Newtonsoft.Json 12.0.1
   // 修改后
   nuget Newtonsoft.Json 13.0.3
   ```

2. 刷新锁定文件：手动修改后，必须运行以下命令同步：

   ```BASH
   dotnet paket install
   ```

   