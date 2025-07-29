---
title: Ant Design
shortTitle: Ant Design
description: 
date: 2024-06-16 22:29:35
categories: [前端,React]
tags: []
---



## Ant Design

[组件总览 - Ant Design](https://ant-design.antgroup.com/components/overview-cn)

## Ant Design Mobile

### 主题定制

[主题 - Ant Design Mobile](https://ant-design-mobile.antgroup.com/zh/guide/theming)

![img](https://cdn.jsdelivr.net/gh/Okita1027/knowledge-database-images@main/web/react/202406171508031.png)

```javascript
import {Button} from "antd-mobile";

const Layout = () => {
    return (
        <div>
            {/* 测试样式配置 */}
            <div className="purple-theme">
                // 紫色 
                <Button color={"primary"}>局部测试</Button>	
            </div>
            // 绿色
            <Button color={"primary"}>测试</Button>
        </div>
    )
}

export default Layout;
```

```css
/*全局定制*/
:root:root {
    --adm-color-primary: rgb(105, 174, 120);;
}
/*局部定制*/
.purple-theme {
    --adm-color-primary: purple;
}
```

```javascript
import './theme.css'
```

