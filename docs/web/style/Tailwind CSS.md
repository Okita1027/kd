---
title: Tailwind CSS
shortTitle: Tailwind CSS
description: Tailwind CSS
date: 2025-08-05 16:21:35
categories: [前端,样式]
tags: []
---
> [ Tailwind CSS 中文文档 ](https://www.tailwindcss.cn/)
>
> [TailWind CSS V4 官方文档](https://tailwindcss.com/docs/installation/using-vite)

> 学习策略:不要死记类名,只记**它有多少功能块 / 每个块能干什么 / 什么时候用**。具体类名查官方文档即可,本文档以"导航地图 + 经验教训"为主。


## 快速上手

### 安装

v4 把"装包 + 接进构建工具"做了彻底重构,选一个最贴合项目的入口。

- **Vite 插件(首选)**:装 `@tailwindcss/vite`,挂到 `vite.config.ts`,CSS 里写 `@import "tailwindcss";` 一行就够。
- **PostCSS**:装 `@tailwindcss/postcss`(不再用旧的 `tailwindcss` PostCSS 插件),不再需要 `autoprefixer` 和 `postcss-import`。
- **CLI**:`@tailwindcss/cli` 单独包,适合纯 HTML 静态站或不想走构建管道的项目。
- **框架指南**:Next/Nuxt/SvelteKit/Astro/Laravel 等都有官方脚手架说明。
- **Play CDN**:`@tailwindcss/browser@4` 浏览器内运行,只在**开发调试**用,禁止上生产。

### 编辑器设置

让 IDE 给你补全类名 + 标错类名,等于给 Tailwind 加了个类型系统。

- VS Code 装 **Tailwind CSS IntelliSense** 插件:补全、悬浮预览、Lint。
- WebStorm / JetBrains 系列内置支持。
- 可选装 **Prettier 插件** 让 `class` 属性自动排序,代码风格更稳。

### 兼容性

v4 不再向下兼容老 CSS 引擎,装之前先确认目标。

- 浏览器基线:**Safari 16.4+ / Chrome 111+ / Firefox 128+**,否则要手动 polyfill。
- v4 **不再兼容 Sass / Less / Stylus 预处理器**——必须用原生 CSS,或者只在 `@apply` 里使用变量。
- 第三方组件库里想用 `@apply` 又不想全量引入 Tailwind,用 `@reference` 指令按需引用,避免样式重复打包。
- Vue SFC / Svelte / CSS Modules 里也能用,但要写 `@reference` 才能让 `@apply` 工作。

### 升级指南

从 v3 升 v4 不是"改个版本号"的事,有几个**会让人卡半天**的破坏性变更。

- 自动升级工具:`npx @tailwindcss/upgrade`,会改 CSS 文件 + 删 `tailwind.config.js`。
- 配置文件从 `tailwind.config.js` 移到 CSS 里的 `@theme {}` 块,JS 配置不再被自动读取(可以用 `@config` 后向兼容)。
- `corePlugins` / `safelist` / `separator` 这几个 JS 配置项**直接没了**。
- Sass / Less / Stylus 不能再混用。

## V4 核心变化速查

这一节先扫一眼,后面每个功能块里遇到具体类名时再回头查。

### 新增
- CSS-first 配置:`@theme {}` 设计 token 自动生成工具类。
- Vite 插件 `@tailwindcss/vite`(首选,比 PostCSS 更快)。
- `bg-linear-*` / `bg-radial-*` / `bg-conic-*` 新渐变命名(旧 `bg-gradient-to-*` 仍可用)。
- `inset-shadow-*` 内阴影、`text-shadow-*` 文字阴影。
- `field-sizing-*`(表单输入框自适应高度)。
- `not-*` 否定变体、`open:` 详情/对话框打开状态变体。
- 容器查询:`@sm:` / `@md:` / `@lg:`(前面带 `@` 的是容器查询,不带的是视口查询)。
- 渐入渐出:`@starting-style` + `transition-discrete` / `transition-behavior-allow-discrete`。
- 缩放新工具:`zoom-*`(走 CSS 原生 `zoom` 属性,不是 `transform: scale`)。
- 滚动条占位:`scrollbar-gutter-stable` 防止出现滚动条时布局抖动。
- 个性变换属性:`translate-*` / `rotate-*` / `scale-*` 现在用各自的 CSS 属性(可单独过渡)。
- `@utility` 指令:在 CSS 里写自定义工具类,自动套用响应式 / 状态变体。

### 重命名
| v3 | v4 |
|---|---|
| `shadow-sm` | `shadow-xs` |
| `shadow` | `shadow-sm` |
| `drop-shadow-sm` | `drop-shadow-xs` |
| `drop-shadow` | `drop-shadow-sm` |
| `blur-sm` | `blur-xs` |
| `blur` | `blur-sm` |
| `rounded-sm` | `rounded-xs` |
| `rounded` | `rounded-sm` |
| `outline-none`(强制隐藏) | `outline-hidden` |
| `outline-none`(真无) | `outline-none`(行为变化,见边框) |
| `overflow-ellipsis` | `text-ellipsis` |
| `flex-shrink-*` | `shrink-*` |
| `flex-grow-*` | `grow-*` |
| `ring` 默认 3px | `ring-3`,默认 1px |
| 前缀 `!important` | 后缀 `!important`(`!flex` 而非 `!flex` 旧用法)|
| 前缀 `tw-` | 变体式 `tw:flex` |

### 移除
- `bg-opacity-*` / `text-opacity-*` / `border-opacity-*` / `ring-opacity-*` 等独立透明度类 → 一律用斜杠 `bg-black/50`。
- `@tailwind base/components/utilities` 三个老指令 → 一行 `@import "tailwindcss";`。
- `theme()` 函数 → 用 CSS 变量 `var(--color-*)`。
- 旧的 `*-opacity-*` 全部并入 `color-mix(in oklab, ...)`。

### 默认值变化
- 边框默认颜色:`gray-200` → `currentColor`(更易做主题切换)。
- 占位符颜色:`gray-400` → 当前文字色的 50%。
- 按钮鼠标:`pointer` → `default`(避免误以为是链接)。
- `space-*` 选中器:`> :not([hidden]) ~ :not([hidden])` → `> :not(:last-child)`,实现从 margin-top 改为 margin-bottom,后面元素不会再"多一像素"。
- 变体栈顺序反转:v3 是右到左,v4 是左到右,更符合 CSS 阅读习惯。
- `hover:` 变体在移动端现在包在 `@media (hover: hover)` 里,真机不会误触。

## 核心概念

理解这五个概念,Tailwind 的 80% 用法就通了。

### Utility 优先

> Utility-first = 把每个 CSS 属性变成一个类名,在 HTML 里堆叠组合。

- 哲学:HTML 即样式表,所见即所得,不用命名、不用上下文切换。
- 优势:删元素 = 删样式,死代码自动消失;没有 CSS 命名冲突;响应式 / 状态 / 主题切换写在前缀上。
- 代价:同一组合用 3+ 次就该抽组件,否则 HTML 臃肿,改一处要同步多份。
- 抽组件的方式:**在组件层抽**(React/Vue 组件,函数封装,模板继承),不要回到写 CSS 类的老路。
- 任意值逃生口:`p-[13px]` / `bg-[#bada55]` / `top-[var(--header-h)]`,遇到没现成类的情况不用回头改 CSS。
- 重要后缀:任何一个类都可以加 `!` 后缀变 `!important`,比 `!important` 选择器更明确。
- 顺序建议:布局 → 间距 → 尺寸 → 排版 → 视觉 → 交互,Prettier 插件会自动帮你排序。

### 状态与变体

> 在工具类前面拼前缀,让该类只在某个状态下生效。

- 基础伪类:`hover:` / `focus:` / `active:` / `visited:` / `focus-visible:` / `disabled:` / `checked:` / `first:` / `last:` / `odd:` / `even:` / `only:` / `empty:`。
- 关系变体(关键!):
  - `group-hover:` 当父元素 `.group` 被 hover 时,当前元素响应——做菜单、卡片浮起必备。
  - `group-focus:` / `group-active:` 同理,跟其他 group 状态配套。
  - `peer-*`:兄弟元素 `.peer` 的状态驱动当前元素,典型如密码强度提示:输入框 `peer` 旁边文字 `peer-invalid:visible`。
  - 关系变体**命名要自己起**:`<div class="group">` 任意名字,子元素写 `group-hover:...`。
- 子变体:`*:` 把样式应用到所有直接子元素,例:`*:mt-4` 给每个子项加 margin-top,比 `space-y-4` 更直观(但少了 `:not(:last-child)` 优化)。
- 否定变体(v4 新):`not-first:` / `not-last:` 排除某位置,常用于"列表除最后一项外的下边框"`not-last:border-b`。
- 打开状态变体(v4 新):`open:` 配合 `<details>` / `<dialog>`,展开时显示关闭图标,收起时显示展开图标。
- 任意变体:`[&_p]:mt-2` 表示"当前元素内所有 p 标签",`[@media(min-width:900px)]:flex` 自定义媒体查询。
- 变体栈顺序(**v4 反转**):v3 是右到左,v4 是左到右——`hover:focus:bg-red-500` 现在的语义是"hover 后再 focus 时变红",跟 CSS 习惯一致。
- 响应式里套状态:`md:hover:bg-red-500` 表示"在中等视口下,hover 时变红"。

### 响应式与容器查询

> 让样式跟着"视口宽度"或"父容器宽度"变化。

- 视口断点(默认 5 档):`sm:` 640 / `md:` 768 / `lg:` 1024 / `xl:` 1280 / `2xl:` 1536。
- **移动优先**:不写前缀 = 移动端样式,`md:` 起追加更大屏,**别**反过来用 `max-md:`(v4 仍支持但不推荐)。
- 任意视口断点:`min-[600px]:flex` 或自定义 `--breakpoint-3xl: 1920px;` 后 `3xl:flex`。
- 容器查询(前面带 `@`):`@md:` 表示"父容器 ≥ 中等宽度"时生效,**做可复用组件必备**。
- 容器声明:`@container` / `@container-normal` 把父元素变成容器,断点才能匹配;`@container` 默认断点,`@container-large` 走大断点表。
- 命名容器:`@container/sidebar` 允许在同一个父里定义多个容器,`@md/sidebar:` 匹配特定容器。
- 选择原则:
  - 页面级布局(导航 / 主体宽度 / 全屏 hero)→ 视口查询。
  - 组件级自适应(卡片在窄列 / 宽列 / 侧栏表现不同)→ 容器查询。
  - 不要把组件绑死在视口宽度上,否则组件挪地方就破。
- 性能陷阱:容器查询每个容器会触发 ResizeObserver,几百个并发容器可能掉帧,需要懒加载或分页。

### 深色模式

> 用 `dark:` 前缀写深色样式,触发策略可选。

- 默认策略:`@media (prefers-color-scheme: dark)`,跟随系统设置,无需任何 JS。
- 手动切换(更常用,用户期望):
  - 在 CSS 顶部写 `@custom-variant dark (&:where(.dark, .dark *));`
  - 在 `<html>` 或 `<body>` 上加 / 删 `.dark` 类。
  - 配合 `localStorage` + 一段切换 JS 就能做主题开关。
- 整站深色时,推荐改 `@theme` 里的 `--color-*: initial;` 然后重定义,比逐条 `dark:bg-...` 维护成本低。
- 防 FOUC:页面加载完成前先用脚本读 localStorage 给 `<html>` 加 `.dark`,避免主题切换瞬间白闪。
- `prefers-color-scheme` 媒体查询不受 v4 的 hover 包裹逻辑影响,放心用。

### Theme 变量(v4 核心)

> v4 的灵魂:把"颜色 / 间距 / 字体 / 圆角"全部写成 CSS 变量,工具类由这些变量自动生成。

- 写法:`@theme { --color-brand: #06b6d4; --spacing: 0.25rem; }`,之后自动出现 `bg-brand` / `p-4` 等类。
- 命名空间(不同前缀生成不同类族):
  - `--color-*` → `bg-*` / `text-*` / `border-*` / `ring-*` / `fill-*` / `stroke-*` / `accent-*` / `caret-*` / `divide-*` / `outline-*` / `decoration-*` / `placeholder-*` / `from-*` / `via-*` / `to-*`
  - `--font-*` → `font-*`
  - `--text-*` → `text-*`(字号,跟 `font-*` 区分)
  - `--font-weight-*` → `font-*`(字重)
  - `--tracking-*` → `tracking-*`(字距)
  - `--leading-*` → `leading-*`(行高)
  - `--spacing` → 所有间距和尺寸的倍率(没有 `*-` 前缀,单个值)
  - `--radius-*` → `rounded-*`
  - `--shadow-*` → `shadow-*`
  - `--inset-shadow-*` → `inset-shadow-*`(v4 新)
  - `--text-shadow-*` → `text-shadow-*`(v4 新)
  - `--drop-shadow-*` → `drop-shadow-*`
  - `--breakpoint-*` → 视口断点
  - `--container-*` → 容器查询断点
  - `--animate-*` → `animate-*`(配 `@keyframes`)
  - `--ease-*` → `ease-*`
  - `--blur-*` / `--brightness-*` / `--contrast-*` / ... → 滤镜类
- 想覆盖默认:`@theme { --color-blue-500: #...; }` 即可,**只改你要的,其他保留**。
- 想完全重置:`@theme { --color-*: initial; }` 只保留你定义的——做品牌主题常用。
- `@theme inline`:工具类直接用变量值,不包 `var(--ref)`,减少 CSS 体积,但**失去主题切换能力**。
- `@theme static`:即使没人用也输出所有 CSS 变量,适合做主题切换备用池。
- 主题嵌套:用 `:root` 选择器(默认)就是全局,用 `.dark` 限定作用域就实现切换:`@theme { --color-*: initial; }` 在 `.dark` 下覆盖,自动多套主题。
- 引用变量:在自定义 CSS 里写 `color: var(--color-blue-500);`,配合 `var()` 函数即可。

### 颜色体系

> Tailwind 自带 22 个色族 × 11 个色阶 + 黑白,所有颜色都可以挂透明度。

- 22 个色族:`slate` / `gray` / `zinc` / `neutral` / `stone` / `red` / `orange` / `amber` / `yellow` / `lime` / `green` / `emerald` / `teal` / `cyan` / `sky` / `blue` / `indigo` / `violet` / `purple` / `fuchsia` / `pink` / `rose`,每个 50–950。
- 透明度用斜杠:`bg-blue-500/50` = 50% 透明,内部用 `color-mix(in oklab, var(--color-blue-500) 50%, transparent)`。
- 计算规则:透明度用 `oklab` 色彩空间,在屏幕上看起来更"自然",不会因为背景色不同而变色。
- 自定义颜色:在 `@theme` 加 `--color-mybrand: #...`,立刻能用 `bg-mybrand` / `text-mybrand` / `border-mybrand`。
- 颜色别名: `--color-primary: var(--color-blue-500);` 可以做语义化命名,改一处全站变色。
- 透明 / 继承:`bg-transparent` / `bg-current`(用当前文字色)/ `bg-inherit`(继承父级)。
- 占位符颜色:`placeholder-{color}-{shade}` + `placeholder:opacity-{n}`(v4 默认是当前文字色的 50%,以前是 `gray-400`)。
- 警告:不要用 `bg-opacity-{n}` 旧语法,v4 已删,`bg-blue-500/{n}` 是唯一写法。

### 扩展自定义样式

> 当工具类满足不了你,有四条路可以走,从轻到重。

1. **任意值**(最轻,99% 场景够用):`w-[137px]` / `bg-[#bada55]` / `top-[var(--header-h)]` 写在方括号里。
2. **任意属性**:`[mask-type:luminance]` / `[--my-var:10px]` 给任意 CSS 属性 / 自定义属性加类,常用于 CSS 变量。
3. **任意变体**:`[&_p]:` / `[&:hover]:` / `[@media(any-hover:none)]:` 任意 CSS 选择器 / 媒体查询。
4. **`@utility` 指令**(v4 新,做可复用自定义工具):在 CSS 里写 `@utility scrollbar-hide { &::-webkit-scrollbar { display: none; } }`,自动出现 `scrollbar-hide` 类,**自动支持响应式 / 状态变体**——这是 v3 没有的能力。
5. **`@utility name-*`**(函数式工具):`@utility tab-* { tab-size: --value(integer); }` → 自动出现 `tab-4` / `tab-8` 等,支持 `tab-[13]` 任意值。
6. **`@custom-variant`**(自定义变体):`@custom-variant theme-midnight (&:where([data-theme="midnight"] *));` → 立刻出现 `theme-midnight:bg-black`。
7. **`@layer base/components/utilities`**(分层组织):
   - `base` 层是 Preflight 之后,工具类之前,放"全局元素默认样式"。
   - `components` 层放"用 `@apply` 拼出来的组件类",**只在不想抽组件时用**。
   - `utilities` 层放"用 `@apply` 拼出来的工具类",v4 主要靠 `@utility` 替代。
8. **`@apply`**:在 CSS 规则里引用工具类,`@apply hover:bg-red-500;`,**优先用组件层封装,少用 `@apply`**。

### 源码扫描

> Tailwind 是怎么知道你写了哪些类名的?它会扫你的源文件做文本匹配。

- 默认扫所有非 `node_modules` / 非 `.gitignore` 文件,内容用正则匹配"看起来像类名"的字符串。
- 动态类名扫不到:
  - `bg-${color}-500` ❌
  - `colors.map(c => 'bg-' + c + '-500')` ❌
  - `['bg-red-500', 'bg-blue-500'][1]` ✅(字面量出现在源码)
- 解决方案:
  1. 改用对象映射:`{ red: 'bg-red-500', blue: 'bg-blue-500' }`,Tailwind 能扫到 key/value 字面量。
  2. safelist:在 CSS 写 `@source inline("container mx-auto px-4");` 显式声明。
  3. 完全关掉自动扫描:`@import "tailwindcss" source(none);` 然后手动 `@source` 每个文件——SSR / 大仓库 / monorepo 必备。
- 排除目录:`@source not "src/legacy/**";` 或 `node_modules` 默认已经排除。
- 路径别名:Tailwind 默认不识别 `tsconfig.json` 的 `paths`,要在 `@source` 写相对路径,或加 `--config` 指向 TS 配置。
- Brace 展开:`@source inline("grid-cols-{1,2,3,4,5,6,7,8,9,10,11,12}");` 一次性 safelist 12 个类。
- SSR 注意:服务端渲染时如果有"用户输入拼类名"的场景,必须 safelist,否则客户端 hydration 时丢失样式。

### 函数与指令速查

> v4 把 v3 的 JS 配置基本搬到了 CSS 指令,这是完整的指令清单。

- `@import "tailwindcss"` —— 入口,只写一次。`@import "tailwindcss/utilities"` 可只引工具类(不引 preflight)。
- `@theme { ... }` / `@theme inline { ... }` / `@theme static { ... }` —— 声明设计 token。
- `@source "..."` / `@source not "..."` / `@source inline("...")` —— 源码扫描控制。
- `@utility name { ... }` / `@utility name-* { ... }` —— 自定义工具类(支持 `--value(integer)` / `--value(ratio)` / `--value(color)` / `--modifier("...")` 等取值函数)。
- `@variant dark (...)` —— 一次性使用某变体,例:`@variant dark (&:where(.dark, .dark *));` 后,某规则内 `& { @apply dark:bg-black; }` 才生效(其实 `dark:bg-black` 直接用更简单)。
- `@custom-variant name (...)` —— 定义新变体全局可用。
- `@apply ...` —— 把工具类塞进另一条 CSS 规则,可在 CSS 变量、嵌套规则、Sass 风格里用。
- `@reference` —— 在组件作用域(CSS Modules / Vue SFC / Svelte)里引用 Tailwind,**不输出重复 CSS**。
- `@plugin "..."` —— 加载 v3 时代的 JS 插件(后向兼容,如 `@plugin "daisyui";`)。
- `@config "..."` —— 加载 v3 时代的 `tailwind.config.js`(后向兼容)。
- `--alpha(var(--color-x) / 50%)` —— 透明度函数,生成 `color-mix()`。
- `--spacing(4)` —— 等价 `calc(var(--spacing) * 4)`,在 `@theme` 定义的全局值上算。
- `--length(--my-num)` —— 自定义函数,可以用 `@theme` 的 `--my-num` 做任意尺寸。
- 兼容性提示:`@import` 必须放在文件最前面,`@theme` 必须放在 `@import` 之后,其他规则可以乱序。

## 基础样式

### Preflight

> Tailwind 自带的一套"现代化 CSS reset",开箱即用,不需要额外引入 normalize.css。

- 来源:[modern-normalize](https://github.com/sindresorhus/modern-normalize),消除浏览器默认样式差异。
- 关键动作:
  - `*, ::before, ::after` 加 `border-style: solid`,这样只写 `border` 就有线,不用每次写 `border-style`。
  - `h1-h6` 重置为同等字号 + 同样加粗,避免默认大小差。
  - 列表 `ol / ul` 去掉内边距,`<button>` 默认 cursor 改回 `default`。
  - `<dialog>` 去掉外边距,`<img>` / `<video>` 改 `display: block`,行内对齐问题消失。
  - `hidden` 属性优先级最高,**别用 `display: none` 手动覆盖**。
  - 链接默认带下划线 → 去掉,需要再写 `underline`。
- 改 Preflight 的两种方式:
  - **覆盖**:在 `@layer base { h1 { font-size: var(--text-2xl); } }` 加自己的默认,**不会**被工具类特异性压住(因为 base 层工具类之下)。
  - **关掉**:`@import "tailwindcss/preflight";` 不导入,然后自己写 reset。
- 推荐:别全关 Preflight,在 base 层加业务默认,工具类接管样式,二者协作。

## 布局

> 控制元素**如何参与排版**——显示方式 / 定位 / 溢出 / 可见性 / 比例。

### 显示模式
- `block` / `inline-block` / `inline` / `hidden`(display: none)/ `contents`(元素消失,子元素保留)/ `flow-root`(建立 BFC)/ `list-item`。
- `flex` / `inline-flex` / `grid` / `inline-grid`——四个最常用,**做布局之前先选一个**。
- `table` / `table-row` / `table-cell`——给非 table 元素套表格行为,做"行内对齐"快速方案。
- 响应式切换:`md:flex md:hidden` 等组合,移动端隐藏,桌面端显示。

### 定位与偏移
- `static` / `fixed` / `absolute` / `relative` / `sticky`——五选一,sticky 滚动吸顶最常用。
- `inset-0` = 上下左右全 0,`inset-x-0` = 左右 0,`top-4` / `right-2` 等单边偏移。
- 负值: `-top-2` / `-left-full` 把元素推到容器外,做"假阴影"、指示器。
- 任意值:`top-[calc(100%+8px)]` / `inset-[10%]`,做精确定位。
- 居中套路:`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2` 是经典。
- `z-0` 到 `z-50`,`z-auto`,`z-[999]`,**z-index 只在 `position` 非 `static` 时生效**。

### 溢出与可见性
- `overflow-auto`(滚动条按需)/ `overflow-hidden`(裁切)/ `overflow-clip`(裁切但无滚动容器)/ `overflow-visible` / `overflow-scroll`(强制滚动)。
- 单轴:`overflow-x-auto` / `overflow-y-hidden`,常做横向滚动列表。
- `overscroll-behavior-auto`(链式滚动)/ `contain`(到边界停)/ `none`(整页滚动)——移动端防止"穿透滚动"。
- `visibility-visible` / `invisible`(保留占位)/ `collapse`(对表格行特殊处理)。

### 比例与多列
- `aspect-auto` / `aspect-square`(1:1)/ `aspect-video`(16:9)/ `aspect-[4/3]` 任意比例。
- 多列报纸式排版:`columns-2` / `columns-3` / `columns-12`,`columns-{3xs..7xl}` 宽度阈值,`columns-auto` 按容器均分。
- 配合 `break-inside-avoid` 防止段落被截断。

### 浮动与隔离
- `float-start` / `float-end` / `float-right` / `float-left` / `float-none`——文字环绕图片老套路,现代布局基本不用。
- `clear-start` / `clear-end` / `clear-left` / `clear-right` / `clear-both` / `clear-none`。
- `isolation-auto` / `isolation-isolate`——为该元素及其后代建独立合成层,`mix-blend-mode` / `z-index` 不会污染整页。
- `box-decoration-break-clone` / `slice`——多行 / 多列背景,文字装饰如何拼接。
- `box-border` / `box-content`——控制 width/height 包含 box 哪些部分,全局一般用 `border-box`。

## FlexBox 与网格

> 两种主流的二维 / 一维布局系统,选其一,别混。Flexbox 一维,Grid 二维。

### Flex 容器
- 方向:`flex-row` / `flex-row-reverse` / `flex-col` / `flex-col-reverse`。
- 换行:`flex-wrap` / `flex-nowrap` / `flex-wrap-reverse`,多行时常用 `flex-wrap`。
- 主轴对齐(`justify-*`):`start` / `end` / `center` / `between`(两端,中间均分)/ `around`(四周等距)/ `evenly`(完全等距)/ `stretch` / `normal`。
- 交叉轴对齐(`items-*`):`start` / `end` / `center` / `baseline`(基线对齐)/ `stretch`(默认,拉满高度)。
- 多行交叉轴对齐(`content-*`):`start` / `end` / `center` / `between` / `around` / `evenly` / `stretch` / `normal` / `baseline`。
- 简写:`place-content-*` = `content-*` + `justify-*`,`place-items-*` = `items-*` + `justify-items-*`。

### Flex 子项
- 缩放:`flex-1`(`flex: 1 1 0%`,等分剩余空间)/ `flex-auto`(`flex: 1 1 auto`)/ `flex-initial`(`flex: 0 1 auto`)/ `flex-none`(`flex: none`)。
- 细粒度:`grow` / `grow-0` / `shrink` / `shrink-0`,v3 叫 `flex-grow-*` / `flex-shrink-*`,v4 重命名。
- 排序:`order-1` 到 `order-12`,`order-first` / `order-last` / `order-none`。
- 单项交叉轴对齐(`self-*`):`auto` / `start` / `end` / `center` / `baseline` / `stretch`,覆盖父级 `items-*`。
- 单项主轴对齐(Grid 才有,Flex 没有):`justify-self-*` / `place-self-*`。

### Grid 模板与轨道
- 显式列:`grid-cols-1` 到 `grid-cols-12`,`grid-cols-none`,`grid-cols-subgrid`(继承父级网格)。
- 显式行:`grid-rows-1` 到 `grid-rows-12`,`grid-rows-none`,`grid-rows-subgrid`。
- 隐式轨道:`grid-flow-row` / `grid-flow-col` / `grid-flow-dense` / `grid-flow-row-dense` / `grid-flow-col-dense`,dense 会自动填补空洞。
- 隐式尺寸:`auto-cols-auto` / `auto-cols-min` / `auto-cols-max` / `auto-cols-fr`,`auto-rows-*` 同理。
- 任意模板:`grid-cols-[200px_1fr_200px]` / `grid-rows-[auto_1fr_auto]`。
- 命名:`grid-cols-[sidebar_main]` + `col-start-sidebar` 引用,做语义化布局。

### Grid 子项
- 跨列:`col-span-1` 到 `col-span-12`,`col-span-full`(占满所有列)。
- 跨行:`row-span-1` 到 `row-span-6`,`row-span-full`。
- 显式起止:`col-start-1` / `col-end-3` / `row-start-1` / `row-end-2`,精细控制位置。
- 自动定位:`col-auto` / `row-auto`,跟随隐式流。

### 间隙
- `gap-{0..96}`、`gap-x-*` / `gap-y-*`,Grid 和 Flex **都**支持,别再用 `space-x-*` 模拟。
- 任意值:`gap-[20px]` / `gap-[var(--card-gap)]`。

## 间隔

> 内边距 / 外边距,撑开元素自身 / 元素之间的距离。

### 内边距 (Padding)
- `p-{n}` 四周,`px-{n}` / `py-{n}` 水平 / 垂直,`pt/r/b/l-{n}` 单边。
- 逻辑属性:`ps-{n}` (padding-inline-start) / `pe-{n}` (padding-inline-end),**做 RTL 布局必备**。
- 任意值:`p-[7px]` / `py-[var(--header-h)]`。
- 百分比:`p-1/2` = 50% 父宽,`pt-[25%]` 配合 aspect-ratio 做响应式图片。

### 外边距 (Margin)
- 同 padding 命名,前缀 `m-`,`m-auto` 居中(配合 `mx-auto`)经典。
- 负值:`-mt-4` / `-mx-2` / `-translate-` 配合 push 元素,**注意溢出要配 `overflow-hidden`**。
- 垂直居中:`mx-auto` + 父级 `flex justify-center`。
- `mt-auto` / `mb-auto` 在 flex 容器内"挤到一端"。

### 间距快捷 (space / divide)
- `space-x-{n}` / `space-y-{n}`:给子元素之间加等距,适合**所有**列表项都要等距的简单场景。
- v4 行为变化:选中的不是 `> :not([hidden]) ~ :not([hidden])`(隐藏项也参与),而是 `> :not(:last-child)`(最后一项不加)。
- `divide-x` / `divide-y`:在子元素之间画 1px 分割线,`divide-{color}` 颜色,`divide-{style}` 样式。
- `divide-x-reverse` / `divide-y-reverse`:RTL 场景反转方向。

## 尺寸

> 控制元素**宽 / 高 / 最小 / 最大**尺寸,以及视口单位。

### 宽高
- 固定值:`w-{0..96}` / `h-{0..96}`,基于 `--spacing` 倍率(默认 0.25rem = 4px)。
- 关键字:`w-auto` / `w-full`(100% 父宽)/ `w-screen`(100vw)/ `w-min` / `w-max` / `w-fit`。
- 分数:`w-1/2` / `w-2/3` / `w-1/3` / `w-1/4` / `w-1/5` / `w-1/6` / `w-1/12` 常用。
- 同时设宽高:`size-{n}` 简写,`size-full` = `w-full h-full`。
- 任意值:`w-[137px]` / `h-[calc(100vh-64px)]` / `w-[var(--container-w)]`。

### 上下限
- `min-w-0` / `min-w-full` / `min-w-min` / `min-w-max` / `min-w-fit`。
- `max-w-{0..96}` / `max-w-none` / `max-w-full` / `max-w-min` / `max-w-max` / `max-w-fit`。
- 排版断点:`max-w-prose`(65ch)/ `max-w-screen-sm/md/lg/xl/2xl` 视口绑定。
- 容器:`max-w-{3xs..7xl}` 走 `--container-*` 主题,`max-w-(--container-sm)` 引用变量。
- 关键点:**`min-w-0` 是 flex 子项允许缩小的关键**,不写就溢出。

### 视口单位(v4 强化)
- 静态:`vw` / `vh` / `vmin` / `vmax`,缩放浏览器时不变——老问题,iOS 100vh 包含地址栏。
- 动态(v4 推荐):`dvw` / `dvh` / `dvmin` / `dvmax`,会随移动端地址栏收起 / 展开变化,**移动端 hero / 登录页首选**。
- 大小:`svh` / `svh` / `svmin` / `svmax` / `lvh` / `lvw` / `lvim` / `lvmax`——区分"最小可能视口"和"最大可能视口",防止横竖屏切换闪烁。

### 逻辑属性
- `inline-size-*` 替代 `width-*`,`block-size-*` 替代 `height-*`,RTL 友好。
- 配合 `min-inline-size` / `max-inline-size` / `min-block-size` / `max-block-size`。

## 排版

> 所有**文字相关**的工具类——字体 / 字号 / 行高 / 颜色 / 装饰 / 列表 / 换行,样式系统里最大块。

### 字体
- 字体族:`font-sans`(系统无衬线)/ `font-serif`(系统衬线)/ `font-mono`(等宽)。
- 自定义:`@theme { --font-display: "Playfair Display", serif; }` → `font-display` 可用。
- 加载策略:在 `@theme` 里用 `@font-face` 定义,或链接 `<link>` Google Fonts,但要避免 FOIT/FOUT。
- 字重:`font-thin`(100)/ `font-extralight`(200)/ `font-light`(300)/ `font-normal`(400)/ `font-medium`(500)/ `font-semibold`(600)/ `font-bold`(700)/ `font-extrabold`(800)/ `font-black`(900)。
- 斜体:`italic` / `not-italic`。
- 字距:`tracking-tighter`(-0.05em)/ `tracking-tight`(-0.025em)/ `tracking-normal` / `tracking-wide`(0.025em)/ `tracking-wider`(0.05em)/ `tracking-widest`(0.1em),大字号标题用 tight,小字号正文用 normal。
- 字体拉伸(v4 新):`font-stretch-condensed` / `font-stretch-expanded`,需要字体本身支持。

### 字号与行高
- 预设:`text-xs`(0.75rem)/ `text-sm`(0.875)/ `text-base`(1rem)/ `text-lg`(1.125)/ `text-xl`(1.25)/ `text-2xl`(1.5)/ `text-3xl`(1.875)/ `text-4xl`(2.25)/ `text-5xl`(3)/ `text-6xl`(3.75)/ `text-7xl`(4.5)/ `text-8xl`(6)/ `text-9xl`(8)。
- 每个字号配一个默认行高(`text-base` 配 `leading-6`,`text-3xl` 配 `leading-9`),改字号行高一般不用动。
- 显式行高:`leading-{3..10}` 数字,`leading-none`(1)/ `leading-tight`(1.25)/ `leading-snug`(1.375)/ `leading-normal`(1.5)/ `leading-relaxed`(1.625)/ `leading-loose`(2)。
- 任意字号:`text-[14px]` / `text-[length:var(--my-size)]`,**避免用 px,优先 rem**。

### 颜色与装饰
- 文字色:`text-{color}-{shade}` + `text-white/80` 透明度,`text-current` 用父级 color,`text-transparent` 配合 `bg-clip-text` 做渐变文字。
- 装饰线:`underline` / `overline` / `line-through` / `no-underline`,可组合。
- 装饰颜色:`decoration-{color}-{shade}` + 透明度。
- 装饰样式:`decoration-solid` / `dotted` / `dashed` / `wavy` / `double`,`wavy` 做错误下划线好看。
- 装饰粗细:`decoration-auto` / `decoration-from-font` / `decoration-0` 到 `decoration-8`。
- 装饰偏移:`underline-offset-auto` / `underline-offset-{0..8}`,可负值。
- 大小写:`uppercase` / `lowercase` / `capitalize` / `normal-case`。
- 文字阴影(v4 新):`text-shadow-2xs` / `xs` / `sm` / `md` / `lg`,配 `--text-shadow-*` 主题。

### 列表
- 类型:`list-none` / `list-disc` / `list-decimal`,`list-[upper-roman]` 任意。
- 位置:`list-inside` / `list-outside`,缩进相关。
- 标记图:`list-image-[url(...)]` / `list-image-none`,用 SVG 自定义项目符号。

### 数字与对齐
- 数字形态:`tabular-nums`(等宽)/ `lining-nums`(现代)/ `oldstyle-nums`(衬线)/ `proportional-nums` / `slashed-zero`(区分 0 和 O)/ `stacked-fractions` / `diagonal-fractions`——做表格 / 账单 / 数据列表必加 `tabular-nums`。
- 对齐:`text-left` / `text-center` / `text-right` / `text-justify` / `text-start` / `text-end`。
- 缩进:`indent-{0..96}` / `-indent-{n}`(悬挂缩进)。

### 换行与截断
- 换行策略:`text-wrap`(默认换行)/ `text-nowrap`(不换行)/ `text-balance`(标题均匀分词)/ `text-pretty`(段落避免末行单词孤立)——v4 新,**做标题首选 `text-balance`**。
- 单行截断:`truncate` = `text-ellipsis` + `overflow-hidden` + `whitespace-nowrap` 一条龙。
- 多行截断:`line-clamp-1` 到 `line-clamp-6`,超 6 行用 `line-clamp-[10]`,**`line-clamp-none` 解除**。
- 空白处理:`whitespace-normal` / `nowrap` / `pre` / `pre-line` / `pre-wrap` / `break-spaces`,`<code>` 用 `pre-wrap`。
- 断词:`break-normal` / `break-words`(长英文单词允许中间断)/ `break-all`(任意位置断)/ `break-keep`(中日韩不断)。
- 溢出换行:`overflow-wrap-normal` / `overflow-wrap-anywhere`,长 URL 必备 `break-all overflow-wrap-anywhere`。
- 连字符:`hyphens-none` / `manual`(默认,只在 `-` 处断)/ `auto`(自动按音节断),英文段落 `auto` 效果好。
- 垂直对齐:`align-baseline` / `align-top` / `align-middle` / `align-bottom` / `align-text-top` / `align-text-bottom` / `align-sub` / `align-super`,`<sub>` / `<sup>` 用 `align-sub` / `align-super`。
- 缩进:`indent-{n}` / `-indent-{n}`,**段落首行缩进**中文里 `indent-8` = 2em。

## 背景

> 元素**底色 / 渐变 / 图片**控制,以及混合 / 蒙版。

### 底色
- `bg-{color}-{shade}` + 透明度,`bg-transparent` / `bg-current` / `bg-inherit`。
- 透明度:`bg-black/50` = 50% 透明,`bg-{color}/{0..100}`,**走 `color-mix(in oklab)`**。
- 任意值:`bg-[#bada55]` / `bg-[var(--my-color)]`。
- 渐变中间色:`from-{color}-{shade}` / `via-{color}-{shade}` / `to-{color}-{shade}`,必须配渐变方向使用。
- 渐变中停止:`from-{n}%` / `via-{n}%` / `to-{n}%`,控制色块位置。

### 渐变
- 线性渐变(新写法):`bg-linear-to-r` / `bg-linear-to-br`(右下)/ `bg-linear-to-tr`(右上)/ `bg-linear-to-bl` / `bg-linear-to-t` / `bg-linear-to-l` / `bg-linear-to-b`。
- 兼容写法:`bg-gradient-to-r` 仍可用,新代码优先用 `bg-linear-*`。
- 径向渐变:`bg-radial` / `bg-radial-[at_50%_50%]`(任意值)/ `bg-radial-at-tl`(左上角)。
- 锥形渐变:`bg-conic` / `bg-conic-[from_45deg]` / `bg-conic-at-top`。
- 中间色:`from-blue-500 via-purple-500 to-pink-500` 三段式。
- 任意角度:`bg-linear-[45deg]` 任意角度线性。

### 图片与重复
- 图片:`bg-[url(...)]` 任意 URL,`bg-none`。
- 重复:`bg-repeat` / `bg-no-repeat` / `bg-repeat-x` / `bg-repeat-y` / `bg-round`(平铺 + 缩放填满)/ `bg-space`(平铺 + 等距)。
- 位置:`bg-center` / `bg-top` / `bg-bottom` / `bg-left` / `bg-right` / `bg-top-left` 等。
- 尺寸:`bg-auto` / `bg-cover`(填满,可能裁切)/ `bg-contain`(完整显示,可能留白)。
- 滚动行为:`bg-fixed`(视口固定,Parallax 效果)/ `bg-local`(随容器滚动)/ `bg-scroll`(随元素滚动,默认)。

### 裁切 / 起源 / 颜色模式
- 裁切:`bg-clip-border` / `bg-clip-padding`(默认)/ `bg-clip-content` / `bg-clip-text`(文字渐变关键)。
- 起源:`bg-origin-border` / `bg-origin-padding`(默认)/ `bg-origin-content`。
- 颜色模式:`color-scheme-light` / `color-scheme-dark` / `color-scheme-normal`,决定浏览器给该元素的默认 UI 渲染(滚动条、表单)。

### 混合与蒙版
- 混合模式(对元素和背景):`mix-blend-normal` / `multiply`(正片叠底)/ `screen`(滤色)/ `overlay` / `darken` / `lighten` / `color-dodge` / `color-burn` / `hard-light` / `soft-light` / `difference` / `exclusion` / `hue` / `saturation` / `color` / `luminosity`。
- 背景混合(对多背景图):`bg-blend-*` 同上列表。
- 蒙版(v4 强化,完整 CSS mask 控制):
  - `mask-image-*`:`mask-image-[url(...)]` / `mask-image-none` / `mask-image-linear-gradient(...)`。
  - `mask-mode-*`:`mask-mode-alpha`(按 alpha 通道)/ `mask-mode-luminance`(按亮度)/ `mask-mode-match`。
  - `mask-repeat-*` / `mask-size-*` / `mask-position-*` / `mask-origin-*` / `mask-clip-*`:同 background 系列。
  - `mask-type-*`:`mask-type-alpha` / `mask-type-luminance`,SVG `<mask>` 必备。
  - `mask-composite-*`:`add` / `subtract` / `intersect` / `exclude`,多蒙版组合。
  - 任意值全开:`mask-[url(star.svg)] mask-[center/contain/no-repeat]`。

## 边框

> 元素**描边 / 圆角 / 轮廓**的视觉边界,容易和 outline / ring 搞混,注意区分。

### 圆角
- 预设:`rounded-none` / `rounded-xs`(v4,原 `rounded-sm`)/ `rounded-sm`(v4,原 `rounded`)/ `rounded` / `rounded-md` / `rounded-lg` / `rounded-xl` / `rounded-2xl` / `rounded-3xl` / `rounded-4xl` / `rounded-full`(胶囊)。
- 命名映射记忆:每个尺寸比 v3 名字小一档,需要的话查 v3/v4 对照表。
- 单角:`rounded-t-lg` / `rounded-tr-full` / `rounded-tl-md` / `rounded-b-sm` 等。
- 逻辑属性:`rounded-s-*` / `rounded-e-*` / `rounded-ss-*` / `rounded-se-*`(RTL 友好)。
- 任意值:`rounded-[10px]` / `rounded-[20%]`(百分比对椭圆特别有效)。

### 描边
- 宽度:`border` 默认 1px(v4,以前 0),`border-0` / `border-2` 到 `border-8`。
- 分方向:`border-x-{n}` / `border-y-{n}` / `border-s` / `border-e` / `border-t` / `border-r` / `border-b` / `border-l`。
- 颜色:`border-{color}-{shade}` + 透明度,**v4 默认 `currentColor`**(以前是 gray-200),主题切换更简单。
- 样式:`border-solid` / `border-dashed` / `border-dotted` / `border-double` / `border-hidden` / `border-none`。
- `border-hidden` = 1px transparent 边框,占位用,等显式加颜色或样式。
- 任意值:`border-[3px]` / `border-[length:var(--b-w)]`。

### 轮廓 (Outline)
- 区别于 border:**outline 不占空间,跨元素边界也能画**。
- 宽度:`outline` 默认 1px(v4,以前 3px),`outline-0` / `outline-{1..8}`。
- 颜色:`outline-{color}` + 透明度。
- 样式:`outline-solid` / `outline-dashed` / `outline-dotted` / `outline-double`。
- 关键命名变化(v4):
  - `outline-none` = 真·无 outline(以前是 "无但键盘可见",v4 把这个行为给了 `outline-hidden`)。
  - `outline-hidden` = 视觉无轮廓但键盘焦点强制显示(无障碍推荐)。
- 偏移:`outline-offset-{0..8}`,可负值。
- 配合:`focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500` 是无障碍键盘导航标准组合。

### 分割与环 (Divide / Ring)
- 分割线:`divide-x` / `divide-y`(子元素之间画 1px 边框,不是外边距),`divide-{color}` 颜色,`divide-{style}` 样式,`divide-{n}` 宽度。
- `divide-x-reverse` / `divide-y-reverse`:RTL 场景。
- 环 (Ring,本质是 box-shadow):
  - `ring` 默认 1px(v4,以前 3px 蓝),`ring-0` / `ring-{1..8}`。
  - `ring-{color}` + 透明度,默认 `currentColor`。
  - `ring-inset`:内环,常见表单 focus 态。
  - `ring-offset-{n}`:偏移,**配合 `ring-offset-{color}` 留出空隙**,在彩色背景上更明显。
  - 推荐组合:`focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`。

## 效果

> 阴影 / 透明度 / 混合模式,让元素"立体"或"扁平"。

### 阴影 (Shadow)
- v4 命名映射:`shadow-2xs` (新最小) / `shadow-xs` (v3 的 `shadow-sm`) / `shadow-sm` (v3 的 `shadow`) / `shadow` (v3 的 `shadow-md`) / `shadow-md` (v3 的 `shadow-lg`) / `shadow-lg` / `shadow-xl` / `shadow-2xl`。
- 记忆:每个尺寸比 v3 名字小一档,视觉差不多,但叫法不同。
- 颜色:`shadow-{color}-{shade}` + 透明度,默认 `rgb(0 0 0 / 0.1)`,做彩色阴影用 `shadow-blue-500/50`。
- 任意值:`shadow-[0_4px_12px_rgba(0,0,0,0.15)]` 精细控制。
- 内阴影 (v4 新):`inset-shadow-xs` / `inset-shadow-sm` / `inset-shadow-md` / `inset-shadow-lg` / `inset-shadow-xl` / `inset-shadow-2xl`,配 `--inset-shadow-*` 主题。
- 文字阴影 (v4 新):`text-shadow-2xs` / `text-shadow-xs` / `text-shadow-sm` / `text-shadow-md` / `text-shadow-lg`,配 `--text-shadow-*` 主题,适合标题 / Logo / Hero。
- 投影 (Drop Shadow,见"过滤器"章节,作用于元素**真实轮廓**而非 box)。

### 透明度
- `opacity-0` 到 `opacity-100`,**作用整个元素**(包括文字、子元素)。
- 对比颜色透明度:`opacity-50` 影响整体,`bg-black/50` 只影响背景,`text-black/50` 只影响文字。
- 触发事件:`hover:opacity-100 opacity-0` 是经典淡入。

### 混合模式
- 元素和背景之间:`mix-blend-*`(见背景),影响该元素 + 后面所有元素。
- 多背景图之间:`bg-blend-*`,只影响该元素的多背景图层。
- 使用前提:父级 `isolation-isolate` 避免污染整页,或 `mix-blend-difference` 配合深色背景做"反色"效果。

## 过滤器

> 实时图像处理类,类似 Photoshop 滤镜,常用于图片 / 视频 / 玻璃拟态。

### 启用
- v4 行为:写任一滤镜类自动启用 `filter`,不需要显式 `filter`。
- 显式开关:`filter`(启用,默认)/ `filter-none`(关闭,清空所有 filter)。
- 父级 + 子级:`filter` 在父级,`backdrop-filter` 在父级但影响**子级后面的内容**(背景滤镜)。

### 图像滤镜
- 模糊:`blur-{xs..3xl}` + `blur-none`,v4 重命名:`blur-xs`(原 `blur-sm`)/ `blur-sm`(原 `blur`)。
- 亮度:`brightness-{0,50,75,90,95,100,105,110,125,150,200}`,`brightness-50` 变暗,`brightness-150` 变亮。
- 对比度:`contrast-{0,50,75,100,125,150,200}`。
- 饱和度:`saturate-{0,50,100,150,200}`,`saturate-0` 灰度化(可代替 `grayscale`)。
- 色相旋转:`hue-rotate-{0,15,30,60,90,180,270}`,`hue-rotate-180` 互补色。
- 灰度:`grayscale` = `grayscale-100`,`grayscale-0` 关闭。
- 反色:`invert` = `invert-100`,`invert-0` 关闭。
- 复古:`sepia` = `sepia-100`,`sepia-0` 关闭。
- 组合:写在一行,顺序生效,`filter blur-md brightness-110 contrast-125`。

### 投影 (Drop Shadow)
- 与 `shadow` 区别:`shadow` 沿 box 模型投影(矩形/圆角矩形),`drop-shadow` 沿元素**真实轮廓**投影。
- PNG 透明图 / SVG / 不规则形状 → `drop-shadow-*` 才有效果。
- 命名同 box-shadow:`drop-shadow-{xs..2xl}`,v4 重命名:`drop-shadow-xs`(原 `drop-shadow-sm`)/ `drop-shadow-sm`(原 `drop-shadow`)。

### 背景滤镜 (Backdrop Filter)
- `backdrop-blur-*` / `backdrop-brightness-*` / `backdrop-contrast-*` / `backdrop-grayscale` / `backdrop-hue-rotate-*` / `backdrop-invert` / `backdrop-opacity-*` / `backdrop-saturate-*` / `backdrop-sepia`,命名同 filter 系列。
- 经典玻璃拟态:`bg-white/30 backdrop-blur-md backdrop-saturate-150`。
- 性能警告:大范围 backdrop-filter 极其吃 GPU,移动端慎用,或缩小范围(只对导航 / 弹窗用)。
- 父级需要非透明背景才有效果。

## 表格

> `<table>` 系列专用工具,大多数现代项目用不到,做数据后台 / 邮件模板时用。

### 边框模型
- `border-collapse`(合并相邻单元格边框)/ `border-separate`(分离,默认)。
- 边框间距:`border-spacing-{0..8}` / `border-spacing-x-*` / `border-spacing-y-*`,只在 `border-separate` 时生效。
- 配合 `border` 工具类画表格网格。

### 布局
- `table-auto`(列宽由内容决定,默认)/ `table-fixed`(等宽列,提速大表格渲染)。
- 性能:大表格 (>1000 行) 用 `table-fixed` 显著提速。

### 标题
- `caption-top` / `caption-bottom` 放 `<caption>` 在表格上方或下方。
- 配合 `caption-{color}` 设置标题样式。

## 过渡与动画

> 让状态变化"动起来",避免生硬切换,**性能与体验的关键环节**。

### 过渡 (Transition)
- 启用:`transition`(默认过渡 color/background-color/border-color/opacity/box-shadow/transform/filter 等)/ `transition-all` / `transition-colors` / `transition-opacity` / `transition-shadow` / `transition-transform` / `transition-none`。
- 选择原则:**只过渡真正变化的属性**(`transition-transform` 比 `transition-all` 性能好),不确定用 `transition` 默认。
- 时长:`duration-0` / `75` / `100` / `150` / `200` / `300` / `500` / `700` / `1000`,自定义 `--duration-*`。
- 缓动:`ease-linear` / `ease-in`(进入慢,常用 modal 入场)/ `ease-out`(退出慢,常用 hover)/ `ease-in-out`(两侧慢)/ `ease-initial`。
- 延迟:`delay-{0..1000}`,用得少,主要做"错落动画"。
- 实战:按钮 hover `transition-colors duration-150 ease-out`。

### 离散过渡 (v4 新)
- `transition-discrete`:允许过渡 `display` / `visibility` / `content` 等离散属性,以前无法动画。
- `transition-behavior-allow-discrete`:全局允许离散过渡,通常配合 `transition-[all,_allow-discrete]` 一次性设置。
- 典型场景:模态框 `display: none → flex` 时配合 `@starting-style` 做入场动画。
- 配合 `transition-discrete` 的还有 `transition-normal`,跟 `transition` 同义但显式声明"标准过渡"。

### 动画 (Animation)
- 内置:`animate-none` / `animate-spin`(360° 旋转)/ `animate-ping`(扩散)/ `animate-pulse`(呼吸)/ `animate-bounce`(弹跳)。
- 自定义:`@theme { --animate-wiggle: wiggle 1s ease-in-out infinite; }` + `@keyframes wiggle { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }` → `animate-wiggle` 可用。
- 性能:**避免对 `width` / `height` / `top` / `left` 做连续动画**,改用 `transform: translate/scale/rotate`。
- 减弱动效:在 `@media (prefers-reduced-motion: reduce)` 里把 `animate-*` 和 `transition-*` 设为 `none`,**无障碍必备**。
- 加载占位:`animate-pulse` 做骨架屏背景闪烁。

## 转换

> 元素的**位移 / 旋转 / 缩放 / 倾斜**,以及 3D 透视。

v4 重要变化:每个变换用**独立 CSS 属性**(`translate` / `rotate` / `scale`),不再都塞进 `transform`,可以**独立过渡**,性能更好。

### 移动旋转缩放
- 移动:`translate-x-{n}` / `translate-y-{n}` / `translate-z-{n}`,负值反向,`translate-1/2` 是 50% 自身。
- 完整位移:`translate-{n}` = `translate-x-{n} translate-y-{n}`(组合任意两个方向,前提是共用同一个 scale)。
- 旋转:`rotate-{0..90}` / `rotate-180`,3D 方向 `rotate-x-{n}` / `rotate-y-{n}` / `rotate-z-{n}`。
- 缩放:`scale-{0..150}` / `scale-x-{n}` / `scale-y-{n}`,`scale-50` 是 50%,`scale-110` 微微放大。
- 倾斜:`skew-x-{n}` / `skew-y-{n}`,用得少,做"动感"用。
- v4 关键:这些属性**可以单独过渡**,例如只让 `scale` 缓动,`rotate` 瞬间。
- 任意值:`translate-[20%]` / `rotate-[45deg]` / `scale-[1.07]`。

### 透视 (v4 强化)
- `perspective-dramatic` / `perspective-near` / `perspective-normal` / `perspective-midrange` / `perspective-distant`,基于 CSS `perspective` 属性(单值,非 matrix)。
- 父级加 `perspective-*`,子级 `rotate-x-*` / `rotate-y-*` 才有 3D 效果。
- 透视原点:`perspective-origin-center` / `top` / `bottom-left` 等,决定观察者位置。
- 卡片翻转必备:`perspective-1000 rotate-y-180`。

### 原点与背面
- 变换原点:`origin-center`(默认)/ `origin-top` / `origin-top-right` / `origin-bottom` / `origin-bottom-left` 等,旋转 / 缩放围绕哪点。
- 任意值:`origin-[10%_20%]` / `origin-[top_left]`。
- 3D 风格:`transform-3d` / `transform-flat` / `transform-preserve-3d`,`preserve-3d` 让子元素真正处于 3D 空间(不被父级压平)。
- 背面:`backface-visible` / `backface-hidden`,卡片翻转时隐藏背面,默认是 visible。

### 缩放 (Zoom, v4 新)
- `zoom-{n}` 走 CSS `zoom` 属性,只对**布局尺寸**生效。
- 与 `scale` 区别:`scale` 走 transform,不影响布局(`position: absolute` 时),`zoom` 影响布局尺寸(和 `width` 改变等效)。
- 适用:文本浏览器缩放、网页预览缩放,谨慎使用,跨浏览器支持还在完善。

### 性能与关闭
- `transform-gpu` 强制 GPU 加速(`transform: translateZ(0)`),`transform-cpu` 关掉,`transform-pixel` 走像素渲染。
- `transform-none` 关闭变换,清空所有 transform。
- 性能:动画期间加 `will-change-transform` 提示浏览器优化,结束移除。

## 交互

> 鼠标 / 键盘 / 触屏 / 滚动 / 焦点 / 选区相关,控制"用户能怎么操作"。

### 鼠标与表单
- 鼠标:`cursor-auto` / `cursor-pointer`(可点击)/ `cursor-wait`(加载中)/ `cursor-text`(可选文字)/ `cursor-move`(可拖拽)/ `cursor-grab` / `cursor-grabbing` / `cursor-not-allowed`(禁用)/ `cursor-zoom-in` / `cursor-zoom-out` / `cursor-crosshair` / `cursor-col-resize` 等。
- 表单色彩:`accent-{color}` 给 `<input type="checkbox/radio/range">` 着色,`caret-{color}` 给输入光标着色。
- 颜色模式:`color-scheme-light` / `color-scheme-dark` / `color-scheme-normal`,适配系统滚动条 / 表单控件(深色模式下自动给 `<input>` 加暗背景)。
- 外观:`appearance-none`(剥掉浏览器默认样式,如 `<select>` 自定义箭头)/ `appearance-auto`。
- 调整:`resize-none` / `resize` / `resize-x` / `resize-y`,给 `<textarea>`。
- 输入框自适应(v4 新):`field-sizing-fixed`(固定)/ `field-sizing-content`(随内容撑高),后者让 `<input>` / `<textarea>` 随内容撑高(评论区场景)。
- 表单禁用:`disabled:opacity-50 disabled:cursor-not-allowed` 是经典组合。

### 选区与指针
- 选区:`select-none`(不可选)/ `select-text`(可选)/ `select-all`(点击全选)/ `select-auto`(跟随用户行为)。
- 富文本编辑器:`select-text`,按钮文字:`select-none`。
- 指针穿透:`pointer-events-none`(鼠标穿透,配合 `cursor-default`)/ `pointer-events-auto`。

### 滚动
- 行为:`scroll-auto`(瞬时跳)/ `scroll-smooth`(平滑滚,锚点跳转必备)。
- 滚动条:`scrollbar` / `scrollbar-thin` / `scrollbar-none` 跨浏览器定制,`scrollbar-{color}` 改颜色。
- 滚动条占位(v4 新):`scrollbar-gutter-auto` / `scrollbar-gutter-stable` / `scrollbar-gutter-stable-both-edges`,防止动态滚动条导致布局抖动。
- 偏移:`scroll-m-{n}` / `scroll-p-{n}`,锚点定位时避开固定头(`scroll-mt-16` 跳过 64px)。
- 滚到元素:`scroll-into-view` 行为由 CSS 控制(浏览器默认),Tailwind 主要配 `scroll-m-*` 留出偏移。

### 滚动吸附
- 容器:`snap-x` / `snap-y` / `snap-both` / `snap-mandatory`(强制吸附)/ `snap-proximity`(松散吸附)。
- 子项:`snap-start`(对齐开始)/ `snap-center`(对齐中心)/ `snap-end`(对齐结束)/ `snap-align-none`。
- 中断:`snap-normal` / `snap-always`(强制每项都停)。
- 实战:轮播图 / 时间线 / 横向卡片列表。

### 触摸与性能
- 触摸:`touch-auto` / `touch-none`(禁止所有手势)/ `touch-pan-x` / `touch-pan-y`(只允许平移)/ `touch-pinch-zoom`(允许缩放)/ `touch-manipulation`(禁用双击缩放和双指平移,移动端按钮必备,消除 300ms 延迟)。
- 性能:`will-change-auto` / `will-change-scroll` / `will-change-contents` / `will-change-transform`,提示浏览器提前优化,**不要乱加**,加多了反而慢。

## SVG

> 给内联 SVG 元素填色和描边,关键类只有三个。

### 填充
- `fill-{color}-{shade}` / `fill-none` / `fill-current`(跟父级 `text-*` 走)/ `fill-transparent`。
- 关键:SVG 里写 `fill="currentColor"` 后,父级 `text-blue-500` 就控制图标颜色,**做主题色图标必备**。

### 描边
- `stroke-{color}-{shade}` / `stroke-none` / `stroke-current`。
- 描边粗细:`stroke-0` / `stroke-1` / `stroke-2` / `stroke-[1.5]`,要更细只能 `stroke-[1.5]`。
- 描边端点 / 拐角:`stroke-linecap-round` / `stroke-linejoin-round`(写属性选择器,不在 Tailwind 工具类里),常用 SVG 自身属性。

### 关键模式
- 主题色图标:`<svg fill="currentColor">` + 父 `text-blue-500 hover:text-blue-600`。
- 双色图标:固定色用 `fill="blue-500"`,hover 变化用 `currentColor`。
- 继承颜色 + 描边:`<svg fill="none" stroke="currentColor">`,做线性图标必备。
- 任意值:`fill-[#bada55]` / `stroke-[var(--my-color)]`。
- 性能:大 SVG 用 `<symbol>` + `<use>` 复用,避免重复定义。

## 可访问性

> 不是单独一个"块",而是一组跨类别的无障碍最佳实践,常被忽视。

### 屏幕阅读器
- `sr-only` / `not-sr-only`:把元素**仅暴露给屏幕阅读器**或反向。
- 经典用法(图标按钮):`<button><Icon /><span class="sr-only">关闭</span></button>`,屏幕阅读器念"关闭",视觉只看到图标。
- 跳过链接:`<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 ...">跳到主要内容</a>`,键盘用户必备。

### 焦点
- `focus-visible:` 变体只对键盘焦点生效,鼠标点击不触发(避免鼠标用户看到焦点环)。
- 标准组合:`focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`。
- 不要用 `focus:`(鼠标也会触发),**用 `focus-visible:`**。
- 触摸设备:focus-visible 不触发,不用特殊处理。

### 强制色与触摸
- `forced-color-adjust-auto`(尊重系统高对比度模式)/ `forced-color-adjust-none`(关闭,自己保证对比度)。
- 触摸目标:按钮 / 链接至少 44×44px,移动端 `min-h-11 min-w-11`,Apple HIG 是 44pt,Material 是 48dp。
- `touch-manipulation` 消除移动端 300ms 延迟,必备。

### 颜色对比
- WCAG AA 标准:正文 4.5:1,大字体 3:1;AAA:正文 7:1。
- 不要只靠颜色传达信息(红绿区分),加图标 / 文字配合,例:`text-red-500` 配 `<ExclamationIcon />`。
- 占位符颜色不能太浅(以前 `placeholder-gray-400` 不达标),v4 默认 50% 当前文字色更合理。
- 错误状态:`aria-invalid="true"` + `aria-describedby` 指向错误说明文本。

### 减弱动效
- 强制规则:`@media (prefers-reduced-motion: reduce) { *, ::before, ::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }`,或者用 Tailwind 的 `motion-reduce:` / `motion-safe:` 变体。
- 完整无障碍:动效 / 对比 / 键盘 / 屏幕阅读器 / 触摸目标 / 减少动作 六大维度,**至少保证前 4 项**。

### 其他
- 装饰图:`<img alt="">` / `<svg aria-hidden="true">`,屏幕阅读器跳过。
- 表单 label:`<label for="x">` 关联 `<input id="x">`,别用 `<div>` 假装 label。
- 语言:`<html lang="zh-CN">`,Tailwind 默认就设置。
- 标题层级:`h1 → h2 → h3` 别跳级,SEO 和无障碍都受影响。
