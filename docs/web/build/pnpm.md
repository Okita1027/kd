---
title: pnpm
shortTitle: pnpm
description: pnpm
date: 2025-08-10 22:29:35
categories: [前端,pnpm]
tags: []
---



| 差异点            | npm/yarn | pnpm                            |
| ----------------- | -------- | ------------------------------- |
| node_modules 结构 | 扁平     | 严格隔离（不允许幽灵依赖）      |
| 硬盘使用          | 重复冗余 | 节省空间（全局缓存 + 硬链接）   |
| 性能              | 一般     | 🚀 很快                          |
| 安装方式          | 常用     | `pnpm` 更推荐大型项目、monorepo |



| 特性              | 说明                                           |
| ----------------- | ---------------------------------------------- |
| 🏎️ 极速安装        | 比 `npm` 和 `yarn` 更快，因为用了缓存 + 硬链接 |
| 💾 节省磁盘空间    | 依赖复用，不重复安装                           |
| 🔒 更严格的隔离    | 不允许包之间偷偷访问（防止幽灵依赖）           |
| 📦 完全兼容 npm 包 | 用法基本一致，可无缝替换 npm/yarn              |



| 场景          | 命令                       | 说明                           |
| ------------- | -------------------------- | ------------------------------ |
| 初始化项目    | `pnpm init`                | 创建 `package.json`            |
| 安装依赖      | `pnpm install` 或 `pnpm i` | 读取 `package.json` 安装依赖   |
| 安装新包      | `pnpm add axios`           | 和 `npm install` 相同          |
| 安装 dev 依赖 | `pnpm add -D vite`         | `-D` 是 `--save-dev` 的简写    |
| 移除依赖      | `pnpm remove lodash`       | 删除依赖                       |
| 更新依赖      | `pnpm update`              | 升级 package.json 中的依赖版本 |
| 运行脚本      | `pnpm run dev`             | 和 npm/yarn 一样               |
| 全局安装工具  | `pnpm add -g eslint`       | 类似 `npm install -g`          |



| 命令              | 说明                                             |
| ----------------- | ------------------------------------------------ |
| `pnpm dlx`        | 临时执行包命令，比如 `pnpm dlx create-react-app` |
| `pnpm why axios`  | 查看某个包是被谁引入的                           |
| `pnpm store path` | 查看全局缓存位置                                 |
| `pnpm config set` | 设置 config，比如设置 registry                   |

