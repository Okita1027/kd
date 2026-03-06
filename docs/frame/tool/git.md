---
title: git
shortTitle: git
description: git
date: 2026-2-1 16:21:51
categories: [.NET, C#]
tags: [.NET]
---

## Git提交规范

一个标准的提交消息应该包含三个部分：**Header** (标题), **Body** (正文) 和 **Footer** (页脚)。

```BASH
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Header

这是最关键的部分，限定在 50 个字符以内。

- **Type**: 行为类型（见下表）。
- **Scope**: 影响范围（可选）。例如 `Identity`, `OrderService`, `Common.Logging`。
- **Subject**: 简短描述。建议动词开头，不用句号。

#### Type（必须）

本次提交的性质

| **类型 (Type)** | **说明** | **场景示例**                             |
| --------------- | -------- | ---------------------------------------- |
| **feat**        | 新功能   | 增加微信支付接口                         |
| **fix**         | 修补 Bug | 修复内存泄漏、空引用异常                 |
| **docs**        | 文档变更 | 更新 Swagger 注释、README                |
| **style**       | 格式变动 | 调整缩进、删除多余空格（不影响代码逻辑） |
| **refactor**    | 重构     | 代码优化，既非修复也非新功能             |
| **perf**        | 性能优化 | 提高 LINQ 查询效率、增加缓存             |
| **test**        | 测试相关 | 增加单元测试、集成测试                   |
| **chore**       | 琐事     | 更新 NuGet 包、修改 `.gitignore`         |
| **ci**          | 持续集成 | 修改 GitHub Actions 或 Jenkins 配置      |

**常用**：`feat / fix / refactor / chore`

#### Scope（推荐）

影响范围/模块

```BASH
feat(auth): 添加JWT登录
fix(order): 修复订单金额计算错误
refactor(api): 拆分Controller职责
```

常见 scope：

- 模块：`user` `order` `product`
- 层级：`api` `service` `repository`
- 技术：`efcore` `signalr` `wpf`
- 项目名：`WebApi` `Admin` `Common`

#### Subject（必须）

一句话概括做了什么

规范要求：

- 使用 **祈使句**
- 不以大写字母开头
- 不以句号结尾
- ≤ 50 字符（中文可稍宽）

### Body（可选）

对本次 Commit 的详细描述。说明**为什么要改**以及**改了什么**。如果是破坏性改动（Breaking Change），必须在此说明。

推荐结构：

1. 修改背景
2. 解决方案
3. 影响范围

示例：

```CS
fix(order): 修复订单金额精度问题

原因：
使用 double 计算金额导致精度丢失

解决：
统一改为 decimal 并增加单元测试

影响：
订单模块金额计算逻辑
```



### Footer（可选）

用于关联 Issue 或标注破坏性改动。

- **Breaking Change**: 以 `BREAKING CHANGE:` 开头，后面跟描述。
- **Issue / BUG 关联**: `Closes #123`, `Fixes #456`。