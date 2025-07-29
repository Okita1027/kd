---
title: Router
shortTitle: Router
description: 
date: 2024-06-16 22:29:35
categories: [前端,React]
tags: []
---

## Router

[React Router6 中文文档 | React Router6 中文文档](https://baimingxuan.github.io/react-router6-doc/)
[ReactRouter6快速上手.md](https://www.yuque.com/attachments/yuque/0/2024/md/32600948/1714046226329-0b3e1e2c-76da-49c4-bd1d-88fbcc1cf93e.md?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2024%2Fmd%2F32600948%2F1714046226329-0b3e1e2c-76da-49c4-bd1d-88fbcc1cf93e.md%22%2C%22name%22%3A%22ReactRouter6%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B.md%22%2C%22size%22%3A11636%2C%22ext%22%3A%22md%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22udb2f3c03-821e-4c7d-a6bb-81c99a082fd%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22%22%2C%22__spacing%22%3A%22both%22%2C%22id%22%3A%22ue682333f%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)

### 环境准备

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

### 快速上手

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

### 路由懒加载

#### router/index.jsx

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

#### main.jsx

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

### 路由导航

路由系统中的多个路由之间需要进行路由跳转，并且在跳转的同时有可能需要传递参数进行通信

![img](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/react/202406171506558.png)

#### 声明式导航

声明式导航是指通过在模版中通过 `<Link/>` 组件描述出要跳转到哪里去，比如后台管理系统的左侧菜单通常使用这种方式进行

`<Link to="/article">文章</Link>`
语法说明：通过给组件的to属性指定要跳转到路由path，组件会被渲染为浏览器支持的a链接，如果需要传参直接通过字符串拼接的方式拼接参数即可

#### 编程式导航

编程式导航是指通过 `useNavigate` 钩子得到导航方法，然后通过调用方法以命令式的形式进行路由跳转，比如想在登录请求完毕之后跳转就可以选择这种方式，更加灵活

![img](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/react/202406171507297.png)

语法说明：通过调用`navigate`方法传入地址path实现跳转

#### 导航传参

 ![img](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/react/202406171507570.png)

##### searchParams传参

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

##### params传参

```jsx
import { useNavigate } from "react-router-dom";

const Login = () => {
	const navigate = useNavigate();
	return (
		<div>
			<button onClick={() => navigate('/article/1002/Marry')}>跳转到“文章”页(params传参)</button>
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

### 嵌套路由

#### 概念

在一级路由中又内嵌了其他路由，这种关系就叫做嵌套路由，嵌套至一级路由内的路由又称作二级路由

![img](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/react/202406171508067.png)

#### 嵌套路由配置

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

#### 默认二级路由

当访问的是一级路由时，默认的二级路由组件可以得到渲染，只需要在二级路由的位置去掉`path`，设置`index`属性为`true`

![img](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/react/202406171508338.png)

#### 404路由配置

场景：当浏览器输入url的路径在整个路由配置中都找不到对应的 `path`，为了用户体验，可以配置兜底组件渲染
实现步骤：

1. 准备一个NotFound组件
2. 在路由表数组的末尾，以`*`号作为路由`path`配置路由

![img](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/react/202406171508873.png)

#### 2种路由模式

各个主流框架的路由常用的路由模式有俩种，history模式和hash模式, ReactRouter分别由 `createBrowerRouter` 和 `createHashRouter` 函数负责创建

| 路由模式 | url表现     | 底层原理                    | 是否需要后端支持 |
| -------- | ----------- | --------------------------- | ---------------- |
| history  | url/login   | history对象 + pushState事件 | 需要             |
| hash     | url/#/login | 监听hashChange事件          | 不需要           |

## 
