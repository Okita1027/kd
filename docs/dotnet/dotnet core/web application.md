---
title: Web应用
shortTitle: Web应用
description: Web应用
date: 2025-07-12 11:08:18
categories: [.NET, .NET CORE]
tags: [.NET]
order: 3
---

## Razor

|      特性      |              Razor Pages               |                    MVC                     |                   Blazor                   |
| :------------: | :------------------------------------: | :----------------------------------------: | :----------------------------------------: |
|    **定义**    |  页面驱动的 Web 框架，使用 Razor 语法  |   控制器驱动的 MVC 架构，使用 Razor 视图   |    组件驱动的 Web 框架，使用 Razor 组件    |
|  **文件类型**  |      `.cshtml` (PageModel + 视图)      |         `.cshtml` (视图) + 控制器          |              `.razor` (组件)               |
|  **开发模型**  |    页面为中心，逻辑在 PageModel 中     | 控制器为中心，分离 Model、View、Controller |      组件为中心，逻辑在 `@code` 块中       |
|  **请求处理**  | `OnGet`, `OnPost` 等方法，`[HttpPost]` |          控制器动作，`[HttpPost]`          | 事件驱动（如 `@onclick`），HTTP 或 SignalR |
|  **适用场景**  |       简单、页面驱动的 CRUD 应用       |       复杂、模块化的 Web 应用或 API        |        交互式、现代 SPA 或实时应用         |
|   **复杂性**   |          简单，适合中小型项目          |            较复杂，适合大型项目            |            中等，适合交互式 UI             |
| **客户端交互** |     依赖 JavaScript（如验证脚本）      |              依赖 JavaScript               |      全 C# 开发，减少 JavaScript 依赖      |
| **XSRF 防护**  |    内置，`@Html.AntiForgeryToken()`    |     内置，`[ValidateAntiForgeryToken]`     |   Blazor Server 内置，WebAssembly 需配置   |
|    **性能**    |          服务器渲染，快速开发          |          服务器渲染，适合复杂逻辑          |    Server 实时，WebAssembly 客户端执行     |

### 概述

**定义**

- **Razor** 是一种标记语法，用于将服务器端 C# 代码嵌入到网页中。它允许您在 HTML 内部编写 C# 代码，以便动态生成网页内容。Razor 语法简洁、易读，旨在提高 Web 开发效率。

**作用**

- **HTML 与 C# 混合：** Razor 最核心的作用就是将 HTML 标记与 C# 代码无缝结合。您可以在同一个文件中编写静态 HTML 结构，并在需要时插入 C# 代码来处理数据、实现逻辑等。
- **动态内容生成：** 用于生成动态的 Web 内容，例如显示来自数据库的数据、根据用户输入改变页面布局、条件性地渲染 HTML 元素等。
- **视图引擎：** 在 ASP.NET Core MVC 和 Razor Pages 中，Razor 充当视图引擎的角色。它负责解析 `.cshtml` 文件，将其中的 C# 代码编译并执行，最终生成发送到客户端的纯 HTML。

### 语法

1. **代码块与表达式**

   - **代码块 (`@{ ... }`)：** 用于编写多行 C# 代码，例如定义变量、循环、条件语句等。代码块中的内容不会直接输出到 HTML 中，除非明确使用 `@` 符号输出。

   ```C#
   @{
       var message = "Hello, Razor!";
       ViewData["Title"] = "我的 Razor 页面";
   }
   <h1>@message</h1>
   ```

   - **显式表达式 (`@(...)`)：** 用于计算并输出单个 C# 表达式的值。

   ```C#
   <p>当前年份: @(DateTime.Now.Year)</p>
   ```

   - **隐式表达式 (`@variableName`)：** *最常见的用法*，直接在 `@` 后面跟一个 C# 变量、属性或方法调用，其结果会被渲染到 HTML 中。

   ```C#
   <p>欢迎，@Model.UserName！</p>
   ```

2. **控制流语句**

   Razor 支持 C# 中的所有标准控制流语句，如 `if/else`、`for`、`foreach`、`while`、`switch` 等，它们通常嵌套在 Razor 代码块中。

   - 条件渲染 (`@if`, `@else`, `@else if`)：

     ```C#
     @if (Model.IsAdmin)
     {
         <p>欢迎管理员！</p>
     }
     else
     {
         <p>欢迎普通用户！</p>
     }
     ```

   - 循环渲染 (`@for`, `@foreach`)：

     ```C#
     <ul>
         @foreach (var item in Model.Items)
         {
             <li>@item.Name</li>
         }
     </ul>
     ```

3. **指令与模型绑定数据访问**

   - **`@page`:** 该指令将文件转换为一个 MVC 操作，这意味着它可以处理请求。 `@page` 必须是页面上的第一个 Razor 指令。

   - **`@model`：** 在 Razor 视图文件的顶部，使用 `@model` 指令声明视图所使用的模型类型。这样您就可以在视图中强类型地访问模型数据。

     ```C#
     @model MyWebApp.Models.Product
     
     <h1>产品名称: @Model.Name</h1>
     <p>价格: @Model.Price.ToString("C")</p>
     ```

   - **`ViewData` 和 `ViewBag`：** 用于在控制器和视图之间传递少量非强类型数据。

     - **`ViewData`：** 基于字典的强类型集合。
     - **`ViewBag`：** 动态类型，是 `ViewData` 的一个包装。

     ```C#
     @{
         var pageTitle = ViewData["Title"];
     }
     <h2>@pageTitle</h2>
     ```

4. **布局页面 (`_Layout.cshtml`)**

   - **作用：** 布局页面定义了网站的通用结构（如头部、导航栏、页脚）。所有视图都可以引用一个布局页面，以避免重复编写通用 HTML。
   - **`@RenderBody()`：** 布局页面中的占位符，表示子视图内容的渲染位置。
   - **`@RenderSection("SectionName", required: false)`：** 用于定义可选或必需的内容节。子视图可以使用 `@section SectionName { ... }` 来填充这些节。

5. **分部视图 (`_PartialView.cshtml`)**

   - **作用：** 分部视图是可重用的 Razor 标记块，用于在多个视图中包含通用 UI 组件，例如评论列表、产品卡片等。
   - **渲染方式：**
     - `@Html.Partial("_PartialViewName", model)`
     - `@await Html.PartialAsync("_PartialViewName", model)` (推荐异步版本)
     - `@await Component.InvokeAsync("ComponentName", arguments)` (推荐用于更复杂的、带有逻辑的分部视图，称为 View Component)

6. **Tag Helpers**

**Tag Helpers** 是 .NET Core 中引入的一项强大功能，它允许服务器端代码以 HTML 元素的属性形式参与到 Razor 文件中，使 Razor 标记更接近于纯 HTML，提高可读性。

- **优势：**

  - 增强了 HTML 元素的行为。
  - 与 HTML 语法更自然地融合。
  - IDE 支持更好（IntelliSense）。

- **常见 Tag Helpers：**

  - **表单 (`asp-for`, `asp-validation-for`, `asp-summary`, `asp-action`, `asp-controller`)：** 简化表单的创建和验证。
  - **图像 (`asp-append-version`)：** 用于缓存破坏。
  - **链接 (`asp-area`, `asp-controller`, `asp-action`, `asp-route-\*`)：** 帮助生成正确的 URL。
  - **环境 (`asp-environment`)：** 根据环境条件渲染内容。
  - **脚本和样式 (`asp-src-include`, `asp-src-exclude`, `asp-append-version`)：** 方便管理静态文件。

  ```C#
  <form asp-controller="Home" asp-action="Submit">
      <label asp-for="Name"></label>
      <input asp-for="Name" class="form-control" />
      <span asp-validation-for="Name" class="text-danger"></span>
      <button type="submit">提交</button>
  </form>
  ```

7. **View Components**

**View Components** 是一种更强大的分部视图替代方案，特别适合具有独立逻辑和数据的可重用 UI 块。它们类似于迷你版的 MVC 控制器和视图的组合。

- **特点：**
  - 独立于控制器，拥有自己的逻辑。
  - 可以接受参数。
  - 支持异步操作。
- **使用场景：** 购物车摘要、最近发布的文章列表、动态导航菜单等。

### Razor Pages 与 MVC 中的 Razor

**MVC：** Razor 主要用作视图层，与控制器和模型协同工作，遵循 `M-V-C` 模式。每个视图通常对应一个控制器动作。

**Razor Pages：** Razor Pages 是一种更简单的、页面为中心的开发模型，特别适合较小的、不那么复杂的 Web 应用程序。每个 `.cshtml` 文件通常都有一个对应的 `.cshtml.cs` 后端代码文件（称为 "code-behind"），其中包含页面逻辑。Razor Pages 简化了文件组织和路由。

## MVC



## Blazor



## 客户端开发



## 会话和状态管理



## 布局



## Razor语法



## Razor类库



## 标记帮助程序



## 高级

