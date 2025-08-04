---
title: React Router
shortTitle: React Router
description: React Router
date: 2024-06-16 22:29:35
categories: [前端,React]
tags: []
---

# Router（旧）

Old:

[React Router6 中文文档 | React Router6 中文文档](https://baimingxuan.github.io/react-router6-doc/)
[ReactRouter6快速上手.md](https://www.yuque.com/attachments/yuque/0/2024/md/32600948/1714046226329-0b3e1e2c-76da-49c4-bd1d-88fbcc1cf93e.md?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2024%2Fmd%2F32600948%2F1714046226329-0b3e1e2c-76da-49c4-bd1d-88fbcc1cf93e.md%22%2C%22name%22%3A%22ReactRouter6%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B.md%22%2C%22size%22%3A11636%2C%22ext%22%3A%22md%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22udb2f3c03-821e-4c7d-a6bb-81c99a082fd%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22%22%2C%22__spacing%22%3A%22both%22%2C%22id%22%3A%22ue682333f%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)

New:

[React Router 首页 | React Router - React Router 路由库](https://reactrouter.remix.org.cn/home)

## 环境准备

```shell
npm create vite@latest
【键入工程名】
【选择react项目】
【选择语言模板】
```

```powershell
npm i
npm i react-router-dom
```

```shell
npm run dev
```

## 快速上手

![需求说明](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/react/202406171506418.png "需求说明")

![文件目录结构](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/react/202406171506485.png "文件目录结构")

```jsx
const Article = () => {
    return <div>我是文章页</div>;
};

export default Article;
```

```jsx
const Login = () => {
    return <div>我是登录页</div>;
};

export default Login;
```

```jsx
import Login from "../page/Login";
import Article from "../page/Article";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/article",
        element: <Article />,
    },
]);

export default router;
```

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
// 1.创建router实例对象并配置路由对应关系
import router from "./router";
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        {/* 2.路由绑定 */}
        <RouterProvider router={router}></RouterProvider>
    </React.StrictMode>
);
```

## 路由懒加载

1. `router/index.jsx`

```jsx
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
```

```jsx
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

```jsx
const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <Home />
                    </Suspense>
                ),
            },
            {
                path: 'about',
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <About />
                    </Suspense>
                ),
            },
            {
                path: 'dashboard',
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <Dashboard />
                    </Suspense>
                ),
            },
        ],
    },
]);
```

2. `main.jsx`

```jsx
import { Fragment } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
// 1.创建router实例对象并配置路由对应关系
import router from "./router";
ReactDOM.createRoot(document.getElementById("root")).render(
    // RouterProvider标签外面必须包一层东西
    // Fragment作用是替换空标签<></>
    <Fragment>
        {/* 2.路由绑定 */}
        <RouterProvider router={router}></RouterProvider>
    </Fragment>
);
```

## 路由导航

路由系统中的多个路由之间需要进行路由跳转，并且在跳转的同时有可能需要传递参数进行通信

![img](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/react/202406171506558.png)

### 声明式导航

声明式导航是指通过在模版中通过 `<Link/>` 组件描述出要跳转到哪里去，比如后台管理系统的左侧菜单通常使用这种方式进行

`<Link to="/article">文章</Link>`

语法说明：通过给组件的to属性指定要跳转到路由path，组件会被渲染为浏览器支持的a链接，如果需要传参直接通过字符串拼接的方式拼接参数即可

### 编程式导航

编程式导航是指通过 `useNavigate` 钩子得到导航方法，然后通过调用方法以命令式的形式进行路由跳转，比如想在登录请求完毕之后跳转就可以选择这种方式，更加灵活

![img](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/react/202406171507297.png)

语法说明：通过调用`navigate`方法传入地址path实现跳转

### 导航传参

 ![img](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/react/202406171507570.png)

#### searchParams传参

```jsx
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    return (
        <div>
            <button onClick={() => navigate('/article?id=1001&name=jack')}>跳转到“文章”页(searchParams传参)</button>
        </div>
    )
};

export default Login;
```

```jsx
import Login from "../page/Login";
import Article from "../page/Article";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/article",
        element: <Article />,
    },
]);

export default router;
```

```jsx
import { useSearchParams } from "react-router-dom";

const Article = () => {
    const [params] = useSearchParams();
    let id = params.get('id')
    let name = params.get('name')
    return (
        <div>我是文章页{id}-{name}</div>
    )
};

export default Article;
```

#### params传参

```jsx
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    return (
        <div>
            <button onClick={() => navigate('/article/1002/Marry')}>
                跳转到“文章”页(params传参)
            </button>
        </div>
    )
};

export default Login;
```

```jsx
import Login from "../page/Login";
import Article from "../page/Article";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/article/:id/:name",
        element: <Article />,
    },
]);

export default router;
```

```jsx
import { useParams } from "react-router-dom";

const Article = () => {
    const params = useParams();
    let id = params.id;
    let name = params.name;
    return (
        <div>我是文章页{id}-{name}</div>
    )
};

export default Article;
```

## 嵌套路由

### 概念

在一级路由中又内嵌了其他路由，这种关系就叫做嵌套路由，嵌套至一级路由内的路由又称作二级路由

![img](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/react/202406171508067.png)

### 嵌套路由配置

实现步骤

1. 使用`children`属性配置路由嵌套关系  
2. 使用`<Outlet/>`组件配置二级路由渲染位置

![img](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/react/202406171508913.png)

```jsx
import { Link, Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div>
            我是Layout页面(一级)
            <Link to="/board">面板(二级)</Link>
            <Link to="/about">关于(二级)</Link>

            {/* 二级路由出口 */}
            <Outlet />
        </div>
    );
};

export default Layout;
```

```jsx
import Layout from "../page/Layout";
import Board from "../page/Board";
import About from "../page/About";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: 'board',
                element: <Board />
            },
            {
                path: 'about',
                element: <About />
            }
        ]
    }
]);

export default router;
```

### 默认二级路由

当访问的是一级路由时，默认的二级路由组件可以得到渲染，只需要在二级路由的位置去掉`path`，设置`index`属性为`true`

![img](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/react/202406171508338.png)

### 404路由配置

场景：当浏览器输入url的路径在整个路由配置中都找不到对应的 `path`，为了用户体验，可以配置兜底组件渲染
实现步骤：

1. 准备一个NotFound组件
2. 在路由表数组的末尾，以`*`号作为路由`path`配置路由

![img](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/react/202406171508873.png)

### 2种路由模式

各个主流框架的路由常用的路由模式有俩种，history模式和hash模式, ReactRouter分别由 `createBrowerRouter` 和 `createHashRouter` 函数负责创建

| 路由模式 | url表现     | 底层原理                    | 是否需要后端支持 |
| -------- | ----------- | --------------------------- | ---------------- |
| history  | url/login   | history对象 + pushState事件 | 需要             |
| hash     | url/#/login | 监听hashChange事件          | 不需要           |



# Router（新）

[React Router 首页 | React Router - React Router 路由库](https://reactrouter.remix.org.cn/home)

## 基础篇


### 路由

#### 配置路由

```TSX
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

<RouterProvider router={router} />
```

| 配置项                               | 说明                                                         |
| ------------------------------------ | ------------------------------------------------------------ |
| `createBrowserRouter([...])`         | 创建一个基于浏览器的完整路由配置。参数是一个“路由对象数组”。 |
| `path`                               | URL路径                                                      |
| `element`                            | 当路径匹配时，渲染的 React 元素                              |
| `children`                           | 嵌套路由配置，表示父路径之下的子路径                         |
| `<RouterProvider router={router} />` | 使用你配置好的 router 来渲染应用。相当于应用的根组件。       |

路由结构可视化：

```TSX
/             -> <Root>
  /dashboard  -> <Dashboard>
  /settings   -> <Settings>
```

- 如果访问 `/dashboard`，会先渲染 `<Root>`，然后 `<Outlet />` 的地方会渲染 `<Dashboard>`
- 所以 `<Root>` 中**必须包含 `<Outlet />`**，用于展示子路由

#### 路由模块

路由模块（Route Modules）**是将每一个路由页面的逻辑（页面组件、加载数据、错误处理等）封装在一个文件中，然后在路由配置中导入这些模块**

页面模块示例：

```TSX
// routes/dashboard.tsx
import { LoaderFunction } from "react-router-dom";
import { useLoaderData } from "react-router-dom";

// loader是固定名称
export const loader: LoaderFunction = async () => {
  const data = await fetch("/api/dashboard").then(res => res.json());
  return data;
};

export default function Dashboard() {
  const data = useLoaderData();
  return <h1>欢迎来到仪表盘, 数据: {JSON.stringify(data)}</h1>;
}
```

在路由配置中使用模块：

```TSX
// main.tsx 或 app.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./routes/error-page";
import Dashboard, { loader as dashboardLoader } from "./routes/dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
        loader: dashboardLoader,		
      },
    ],
  },
]);

<RouterProvider router={router} />
```

`loader()` 是 **React Router v7 框架模式中配置在路由上的一个函数**，用于在页面组件渲染前加载数据。

**执行时机**

- 每次**导航到该路由之前**
- React Router 会自动调用对应的 loader
- 返回的数据会传给组件，组件内用 `useLoaderData()` 读取

**返回值**

| 类型           | 说明                                |
| -------------- | ----------------------------------- |
| 普通对象       | 页面需要用到的数据                  |
| `defer({...})` | 渐进式加载，配合 `<Await>` 使用     |
| 抛出 Response  | 可以触发跳转 / 错误页（比如重定向） |

#### 嵌套路由

嵌套路由就是将一个页面嵌套在另一个页面中，使页面拥有“父子层级关系”，并且共享 UI（比如侧边栏、导航栏等）。在 React Router 中通过配置 `children` 属性实现。

| 概念         | 说明                             |
| ------------ | -------------------------------- |
| `children`   | 子路由数组，嵌套在父路径下       |
| `<Outlet />` | 子路由的内容渲染位置             |
| 层级路径     | 子路由路径是相对路径，不用加 `/` |
| 多层嵌套     | 可以多层嵌套，不限深度           |

1. 路由配置

```TSX
// main.tsx
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root from "./routes/root";
import Dashboard from "./routes/dashboard";
import Settings from "./routes/settings";
import ErrorPage from "./routes/error-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

<RouterProvider router={router} />
```

2. 父路由组件：

```TSX
// Root.tsx
import { Outlet, Link } from "react-router-dom";

export default function Root() {
  return (
    <div>
      <h1>主页面（Root）</h1>
      <nav>
        <Link to="dashboard">Dashboard</Link> |{" "}
        <Link to="settings">Settings</Link>
      </nav>
      {/* 子路由的内容会渲染在这里 */}
      <Outlet />
    </div>
  );
}
```

3. 子路由组件

```TSX
// routes/dashboard.tsx
export default function Dashboard() {
  return <h2>仪表盘页面</h2>;
}

// routes/settings.tsx
export default function Settings() {
  return <h2>设置页面</h2>;
}
```

> [!IMPORTANT]
>
> 在父组件中，必须使用 `<Outlet />` 指定“嵌套路由显示的位置”。如果没有 `<Outlet />`，子页面组件不会被渲染！

#### 根路由

根路由是是整个应用的入口！是路由树的最顶层节点，所有其他页面都在它之下作为子路由。

#### 布局路由

布局路由是一个不负责展示具体页面内容的中间父路由，只用来提供页面结构和 UI 布局。

它的作用是：提供一个页面的“外壳”——比如公共头部、导航栏、侧边栏、统一的布局样式，并通过 `<Outlet />` 将子页面插入进去。

1. 布局路由配置

这是一个典型的“仪表盘布局”。左侧是菜单栏，右侧是子页面区域。

```TSX
// routes/dashboard/layout.tsx
import { Outlet, NavLink } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div style={{ display: "flex" }}>
      <aside>
        <nav>
          <NavLink to="overview">概览</NavLink>
          <NavLink to="reports">报表</NavLink>
        </nav>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

2. 在路由中配置布局路由

```TSX
import DashboardLayout from "./routes/dashboard/layout";
import Overview from "./routes/dashboard/overview";
import Reports from "./routes/dashboard/reports";

{
  path: "dashboard",
  element: <DashboardLayout />,  // 布局路由组件
  children: [
    {
      path: "overview",
      element: <Overview />,
    },
    {
      path: "reports",
      element: <Reports />,
    },
  ],
}
```

3. 最终效果：页面外壳一致，只是右侧 `<Outlet />` 渲染的页面不一样。

```TXT
/dashboard/overview   → 渲染 DashboardLayout + Overview
/dashboard/reports    → 渲染 DashboardLayout + Reports
```



最佳实践：每个大模块一个文件夹，一个布局 + 多个子页面。

```TXT
src/
├── routes/
│   ├── root.tsx                # 根路由，顶部导航
│   ├── dashboard/
│   │   ├── layout.tsx         # Dashboard 布局
│   │   ├── overview.tsx       # 子页面
│   │   └── reports.tsx
```



#### 索引路由

**索引路由是某个父路由的“默认子路由”**，当访问父路由路径时，索引路由会被自动渲染。类似于HTML中的`index.html`

在配置路由时，通过 `index: true` 来定义：

```tsx
{
  path: "/dashboard",
  element: <DashboardLayout />,
  children: [
    {
      index: true,              // 索引路由
      element: <DashboardHome />
    },
    {
      path: "reports",
      element: <DashboardReports />
    }
  ]
}
```

最终效果：

| 访问路径             | 渲染内容                                   |
| -------------------- | ------------------------------------------ |
| `/dashboard`         | `<DashboardLayout>` + `<DashboardHome>`    |
| `/dashboard/reports` | `<DashboardLayout>` + `<DashboardReports>` |

#### 路由前缀

子路由的 `path` 会自动拼接到父路由的 `path` 之后，形成完整的嵌套路由路径。

```TSX
{
  path: "/dashboard",
  element: <DashboardLayout />,
  children: [
    {
      path: "reports", // 注意：不是 "/reports"
      element: <Reports />
    },
    {
      path: "settings",
      element: <Settings />
    }
  ]
}
```

最终访问的路径是：

| 子路由 path  | 实际路径              |
| ------------ | --------------------- |
| `"reports"`  | `/dashboard/reports`  |
| `"settings"` | `/dashboard/settings` |

> 不用加斜杠 `/`，React Router 会自动拼接前缀。

#### 动态片段

**动态片段**就是你在路由路径中使用 `:参数名` 的语法来表示**可变的 URL 参数**。

```tsx
{
  path: "users/:userId",
  element: <UserProfile />
}
```

效果：当访问 `/users/42`、`/users/abc123` 等路径时，`userId` 是一个动态参数，值分别是 `42`、`abc123`。

#### 可选片段

可选片段指的是：**某段路径参数可以有，也可以没有**，比如同时支持 `/profile` 和 `/profile/settings`。

#### 通配符片段

**通配符片段**使用 `"*"` 来匹配 **任意路径的剩余部分**

1. 配置

```tsx
{
  path: "docs",
  element: <DocsLayout />,
  children: [
    {
      path: "*",
      element: <DocViewer />
    }
  ]
}
```

2. 效果

| 路径                          | 匹配        |
| ----------------------------- | ----------- |
| `/docs/intro`                 | ✅ `/docs/*` |
| `/docs/guide/getting-started` | ✅ `/docs/*` |

> [!IMPORTANT]
>
> 通配符只能出现在**最后一段**!不能写成 `/a/*/b`，只能 `/a/*`

#### 组件式路由

**组件式路由**是指通过 React 组件方式配置路由，而不是用纯 JSON 对象配置。

- 对象式：

```tsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
    ]
  }
]);
```

- 组件式

```tsx
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route path="about" element={<AboutPage />} />
      <Route path="contact" element={<ContactPage />} />
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
```

### 路由模块



### 渲染策略

**CSR**

- 网页初始只返回一个空的 HTML + JavaScript 包
- 浏览器执行 JS，React 挂载组件并请求数据

**SSR**

- 用户请求页面时，服务器运行 React 组件并加载数据，生成完整 HTML 再发给浏览器

**SSG**

- 在构建阶段，把所有页面都预生成成 HTML 文件
- 用户访问时是静态页面，不需要服务端计算

| 渲染策略         | 页面生成时机         | 适合场景           | 推荐框架           | 使用方式说明             |
| ---------------- | -------------------- | ------------------ | ------------------ | ------------------------ |
| 客户端渲染 CSR   | **浏览器加载时**     | 注重交互、前端为主 | Vite / CRA + React | 默认使用 React Router    |
| 服务器端渲染 SSR | **请求时服务端渲染** | SEO 要求高、首屏快 | Remix、Next.js     | 配合 loader、server 渲染 |
| 静态预渲染 SSG   | **构建时预先生成**   | 内容固定的页面     | Gatsby / Next.js   | 静态生成 HTML + hydrate  |

| 特性           | CSR              | SSR           | SSG                |
| -------------- | ---------------- | ------------- | ------------------ |
| 首屏速度       | 慢               | 快            | 非常快             |
| SEO 支持       | 差               | 优            | 非常优             |
| 是否依赖服务端 | 否               | 是            | 否                 |
| 更新频率支持   | 最佳             | 好            | 差                 |
| 构建难度       | 简单             | 一般          | 中等               |
| 最适合场景     | 后台、应用类网站 | 首屏展示、SEO | 博客、文档、营销页 |

React Router 自身是 UI 层的路由库，不强制某种渲染策略。你可以：

| 方案                | 是否支持 React Router  |
| ------------------- | ---------------------- |
| Create React App    | ✅ 客户端渲染           |
| Vite + React Router | ✅ 客户端渲染           |
| Remix               | ✅ 原生支持 SSR、SSG    |
| Next.js + React     | ❌（用它自带的 Router） |

React Router v7（框架模式）就是为 **Remix 的 SSR 架构** 提供的支持：

- `loader()`、`action()`：天然适配 SSR 或 SSG
- `defer()`、`<Await>`：支持数据流式加载
- `Hydration`：服务端和客户端协同渲染

### 数据加载

| 数据加载方式 | 渲染模式 | 示例框架         | 使用方式           | 加载时机       | 首屏性能 | SEO 支持 | 数据是否动态 |
| ------------ | -------- | ---------------- | ------------------ | -------------- | -------- | -------- | ------------ |
| 客户端加载   | CSR      | Vite + React     | `useEffect()`      | 用户进入页面后 | 慢       | 差       | ✅            |
| 服务端加载   | SSR      | Remix            | `loader()`         | 在渲染组件前   | 快       | 好       | ✅            |
| 静态加载     | SSG      | Next.js / Gatsby | `getStaticProps()` | 构建阶段       | 快       | 好       | ❌（构建时）  |

#### 客户端加载

```TSX
import { useEffect, useState } from "react";

function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/api/posts").then(res => res.json()).then(setPosts);
  }, []);

  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

- 使用 `useEffect` 是传统 React SPA 加载数据的方式。
- 缺点是首次渲染时没有数据，用户看到的是“加载中”。

#### 服务端加载

使用 `loader()` 函数提前加载数据，React Router 会 **在组件渲染之前执行 loader**

```TSX
// routes/blog.jsx
export async function loader() {
  const res = await fetch("/api/posts");
  return res.json();
}

export default function Blog() {
  const posts = useLoaderData(); // 从 loader 获取数据
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

```TSX
import { createBrowserRouter } from "react-router-dom";
import Blog, { loader as blogLoader } from "./routes/blog";

const router = createBrowserRouter([
  {
    path: "/blog",
    element: <Blog />,
    loader: blogLoader,
  },
]);
```

- 能在服务端执行（Remix / SSR）
- 数据支持缓存、流式加载
- 没有“闪一下空白”的问题

#### 渐进式加载

**`defer()`** 和 **`<Await>`** 允许你实现渐进式数据加载，页面可以先渲染结构，数据慢慢加载并渲染。

```TSX
// routes/dashboard.jsx
import { defer, useLoaderData } from "react-router-dom";
import { Suspense } from "react";

// loader 中的 defer
export function loader() {
  return defer({
    user: fetch("/api/user"),  // 渐进式加载
    stats: fetch("/api/stats"),
  });
}

export default function Dashboard() {
  const { user, stats } = useLoaderData(); // 获取数据

  return (
    <div>
      <h1>控制面板</h1>
      <Suspense fallback={<p>用户数据加载中...</p>}>
        <Await resolve={user}>
          {(userData) => <p>欢迎，{userData.name}</p>}
        </Await>
      </Suspense>
      
      <Suspense fallback={<p>统计数据加载中...</p>}>
        <Await resolve={stats}>
          {(statsData) => <p>文章数：{statsData.articles}</p>}
        </Await>
      </Suspense>
    </div>
  );
}
```

```TSX
import { createBrowserRouter } from "react-router-dom";
import Dashboard, { loader as dashboardLoader } from "./routes/dashboard";

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Dashboard />,
    loader: dashboardLoader,
  },
]);
```

#### 静态加载

对于 **React Router v7** 和 **Remix** 框架，通常会结合 `loader()` 和 `defer()` 来执行静态加载。

但如果你在用 **Next.js** 或其他静态生成框架，可以使用类似 `getStaticProps()` 这样的 API 来进行静态数据加载。

**在 Next.js 中使用 `getStaticProps`**：

```TSX
// pages/blog.jsx
import { useState, useEffect } from "react";

export async function getStaticProps() {
  const res = await fetch("https://api.example.com/posts");
  const posts = await res.json();

  return {
    props: {
      posts, // 将静态数据传给页面
    },
  };
}

export default function Blog({ posts }) {
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

- **`getStaticProps()`**：Next.js 中用于静态数据加载，它会在构建时执行。`getStaticProps()` 通过返回数据让组件在构建时静态化。

- 组件渲染时直接使用静态数据，不再需要客户端请求。

### Action

`action` 是配合表单提交而设计的**数据处理函数**，主要用于**处理表单提交后的副作用**，例如：创建、更新、删除数据。

**配置位置**

可以在路由对象中定义 `action`，当表单通过 `<Form>` 提交时，React Router 会自动调用这个 `action` 函数:

```tsx
// routes/tasks.tsx
export async function action({ request }) {
  const formData = await request.formData()
  const task = formData.get("task")
  await createTask(task)
  return redirect("/tasks")
}
```

```tsx
// router.ts
createBrowserRouter([
  {
    path: "/tasks",
    element: <TaskPage />,
    action: taskAction
  }
])
```

**搭配`<Form>`使用**

React Router 提供了一个增强的 `<Form>` 组件，可以自动处理表单提交逻辑并调用对应的 `action`：

```tsx
import { Form } from "react-router-dom"

export default function TaskPage() {
  return (
    <Form method="post">
      <input name="task" placeholder="New task" />
      <button type="submit">Add</button>
    </Form>
  )
}
```

效果：只要你用了 `<Form method="post">`，点击按钮就会自动触发 `action()` 函数。

**`action`的参数和返回值**

```ts
action({ request, params }): Promise<Response | any>
```

参数：

- `request`:包含提交的表单数据。可用 `request.formData()` 解析。
- `params`:URL 路径中的动态片段，如 `/posts/:id` 中的 `id`。

可返回：

- `Response` 对象，例如 `redirect("/home")`
- 普通数据，例如 `{ success: true }`
- 抛出错误（会被 `<ErrorBoundary>` 捕捉）

---

**示例：删除一条记录**

```TSX
// 删除 action
export async function action({ params }) {
  await deleteTask(params.taskId)
  return redirect("/tasks")
}

// 路由配置
{
  path: "/tasks/:taskId/delete",
  action: deleteAction
}
```

```TSX
// 触发表单
<Form method="post" action={`/tasks/${task.id}/delete`}>
  <button type="submit">Delete</button>
</Form>
```

### 导航

| 导航方式        | 特点               | 适用场景         |
| --------------- | ------------------ | ---------------- |
| `<Link>`        | 最基本导航方式     | 页面跳转         |
| `<NavLink>`     | 自动识别激活状态   | 顶部菜单、侧边栏 |
| `useNavigate()` | 代码逻辑中控制跳转 | 登录后跳转       |
| `redirect()`    | 表单提交后的跳转   | 提交数据后跳转   |

#### 声明式导航`<Link>`

```TSX
import { Link } from "react-router-dom"

<Link to="/about">关于我们</Link>
```

- `to` 是目标路径
- 渲染为 `<a href="/about">`

#### 带激活状态的导航`<NavLink>`

```TSX
<NavLink to="/about">关于我们</NavLink>
```

当链接匹配当前 URL 时，`<NavLink>` 会自动添加一个 `active` 类名：

```CSS
/* 默认的active类名样式 */
.active {
  font-weight: bold;
  color: red;
}
```

可以通过 `activeClassName` 属性指定自定义类名：

```TSX
<NavLink to="/about" activeClassName="selected">
  关于
</NavLink>
```

通过 `activeStyle` 可以直接内联设置活动状态样式：

```TSX
<NavLink 
  to="/contact"
  activeStyle={{
    fontWeight: "bold",
    color: "blue"
  }}
>
  联系我们
</NavLink>
```

`isActive` 回调函数可以自定义活动状态逻辑：

```TSX
<NavLink
  to="/profile"
  isActive={(match, location) => {
    // 自定义逻辑
    return match && location.search.includes('user');
  }}
>
  个人资料
</NavLink>
```

`exact` 属性确保路径必须**完全匹配**才会激活 NavLink 的状态:

```TSX
<NavLink to="/" exact>
  首页
</NavLink>
```

| 当前URL  | exact=true | exact=false |
| :------- | :--------- | :---------- |
| `/`      | ✅ 匹配     | ✅ 匹配      |
| `/about` | ❌ 不匹配   | ✅ 匹配      |
| `/user`  | ❌ 不匹配   | ✅ 匹配      |

`strict` 属性会**考虑URL末尾的斜杠**进行匹配:

```TSX
<NavLink to="/events/" strict>
  活动
</NavLink>
```

| 当前URL     | strict=true | strict=false |
| :---------- | :---------- | :----------- |
| `/events`   | ❌ 不匹配    | ✅ 匹配       |
| `/events/`  | ✅ 匹配      | ✅ 匹配       |
| `/events/1` | ❌ 不匹配    | ✅ 匹配       |

#### 编程式导航`useNavigate()`

```TSX
import { useNavigate } from "react-router-dom"

function Home() {
  const navigate = useNavigate()

  return (
    <button onClick={() => navigate("/dashboard")}>去仪表盘</button>
  )
}
```

`navigate(to, options)`

- `to`: 路径或 `-1` 表示返回上一页

- `options`: 

  - `replace: boolean`决定了导航是会替换当前历史记录栈中的条目，还是会在历史记录栈中添加一个新的条目,默认`false`。

  - `state: any`允许你在导航时**传递任意的 JavaScript 值**到目标路由。这个值不会显示在 URL 中，而是作为历史记录状态的一部分,默认值为`undefined`。

  - `preventScrollReset: boolean`控制导航后页面是否会滚动到顶部,默认`false`:会滚动到顶部。

  - ``relative: "route" | "path"`定义了 `to` 路径是如何相对于当前 URL 解析的

    - `"path"`: 相对于当前 URL 的完整路径名。
    - `"route"`: 相对于当前匹配的路由路径。这在当你处于一个匹配了部分 URL 的父路由中，并且希望导航到其子路由时非常有用，而不需要关心父路由的完整动态部分。

    假设当前 URL 是 `/users/123/profile`，并且你的路由配置是这样的：

    ```TSX
    // 路由配置
    <Route path="users/:userId" element={<UserLayout />}>
      <Route path="profile" element={<UserProfile />} />
      <Route path="settings" element={<UserSettings />} />
    </Route>
    ```

    现在，你在 `UserProfile` 组件中想跳转到 `UserSettings`:

    ```TSX
    import { useNavigate } from 'react-router-dom';
    
    function UserProfile() {
      const navigate = useNavigate();
    
      // 如果当前在 /users/123/profile
    
      // 1. 默认行为 (relative: "path")：
      // navigate('../settings');  // 结果：/users/123/settings （基于 /users/123/profile）
    
      // 2. 明确使用 relative: "path"
      // navigate('settings', { relative: 'path' }); // 结果：/users/123/profile/settings （错误，因为它相对于当前完整路径）
      // 这种情况下你需要 '../settings' 才能正确地回到同级
    
      // 3. 使用 relative: "route" (推荐用于嵌套路由中的兄弟导航)
      // 这会从匹配的路由路径 /users/:userId 开始解析相对路径
      // 使得 'settings' 总是指向 /users/:userId/settings
      const goToSettings = () => {
        navigate('settings', { relative: 'route' }); // 结果：/users/123/settings (无论当前是 /users/123/profile 还是 /users/123/posts)
      };
    
      return (
        <div>
          <h3>用户个人资料</h3>
          <button onClick={goToSettings}>前往设置</button>
        </div>
      );
    }
    ```

#### 表单自动导航（配置`action`）

使用 `<Form method="post" />` 后，如果 `action()` 函数返回 `redirect("/目标路径")`，会自动跳转。

```TSX
return redirect("/tasks")
```

### Pending UI

React Router 提供了内建的机制用于展示“待处理 UI”——**通过 `useNavigation()` 结合 `<Suspense>` 与 `defer()` 数据加载方式**来实现。

`useNavigation()` 可以让你**检测当前导航状态**（比如是否正在加载中或提交中）。

| 状态名         | 含义                       |
| -------------- | -------------------------- |
| `"idle"`       | 没有进行任何导航或提交     |
| `"loading"`    | 正在加载数据（页面跳转中） |
| `"submitting"` | 正在提交表单数据           |

```TSX
import { Form, useNavigation } from "react-router-dom"

function ContactForm() {
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  return (
    <Form method="post">
      <input name="email" />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "提交中..." : "提交"}
      </button>
    </Form>
  )
}
```



## API



