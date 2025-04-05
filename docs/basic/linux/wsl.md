---
title: WSL
shortTitle: WSL
description: WSL
date: 2024-06-13 12:52:01
categories: [Linux]
tags: [WSL]
---

# Ubuntu

## 基本安装

1. Windows功能中开启`适用于Linux的Windows子系统`+`虚拟机平台`
2. powershell终端输入`wsl.exe --update`更新WSL相关组件
3. 在微软商店安装最新稳定版本 Ubuntu 22.04

**安装基础软件包**

更新系统上的所有软件包

```sh
sudo apt update
sudo apt upgrade -y
```

基本的工具：构建工具、版本控制系统、文本编辑器……

```sh
sudo apt install -y build-essential curl git vim wget
```

增强终端体验：Zsh、Oh My Zsh

```sh
sudo apt install -y zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

在终端中管理多个会话：tmux

```sh
sudo apt install -y tmux
```

监视系统资源使用情况：htop

```sh
sudo apt install -y htop
```

## 迁移到其它盘符

1. `wsl -l -v`查看目前已安装的Linux发行版本
2. `wsl --export Ubuntu-22.04 D:\Ubuntu\init.tar`导出安装好的Ubuntu-22.04为tar文件到D盘的Ubuntu下
3. `wsl --import Ubuntu-22.04 D:\Ubuntu\Ubuntu-22.04 D:\Ubuntu\init.tar --version 2`以WSL2为版本利用tar文件把系统安装在D:\Ubuntu\Ubuntu-22.04文件夹下并以Ubuntu-22.04来命名

## 图形化界面

1. 切换安装源

   备份系统默认源文件

   ```sh
   sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
   ```

   切换为清华源，替换全部文件内容

   ```sh
   vim /etc/apt/sources.list
   ```

   ```sh
   # 默认注释了源码镜像以提高 apt update 速度，如有需要可自行取消注释
   deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy main restricted universe multiverse
   # deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy main restricted universe multiverse
   deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse
   # deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse
   deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse
   # deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse
    
   deb http://security.ubuntu.com/ubuntu/ jammy-security main restricted universe multiverse
   # deb-src http://security.ubuntu.com/ubuntu/ jammy-security main restricted universe multiverse
    
   # 预发布软件源，不建议启用
   # deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-proposed main restricted universe multiverse
   # # deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-proposed main restricted universe multiverse
   ```

   添加 bionic universe 源以正确安装 vnc4server，在文件末尾追加内容

   ```sh
   sudo vim /etc/apt/sources.list
   ```

   ```sh
   deb http://archive.ubuntu.com/ubuntu/ bionic universe
   ```

   安装该仓库的公钥

   ```sh
   sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 3B4FE6ACC0B21F32
   ```

   更新安装源列表

   ```sh
   sudo apt update && sudo apt -y upgrade
   ```

2. 安装所需软件

   安装轻量版Ubuntu图形界面

   ```sh
   sudo apt-get install xfce4
   ```

   安装配置 xfce4 终端

   ```sh
   sudo apt-get install xfce4-terminal
   echo xfce4-session>.xsession
   ```

   安装 xrdp 相关（通过远程桌面来访问图形界面）

   ```sh
   sudo apt-get install vnc4server
   sudo apt-get install xrdp
   ```

   配置 xrdp 启动脚本，在文件开头插入内容，否则会黑屏

   ```sh
   sudo vim /etc/xrdp/startwm.sh
   ```

   ```sh
   unset DBUS_SESSION_BUS_ADDRESS
   unset XDG_RUNTIME_DIR
   . $HOME/.profile
   ```

   重启xrdp

   ```sh
   sudo service xrdp restart
   ```

   查看xrdp的运行状态和监听接口

   ```sh
   sudo service xrdp status
   ```

   - 默认的端口是 3389
   - 远程连接前要关闭xrdp状态，否则会闪退
   - 远程连接前WSL Ubuntu命令行需要打开，否则xrdp服务不会运行

3. 远程桌面连接

   打开Windows的远程桌面连接

   - 计算机名： IP地址:端口号
   - 用户名： 初次进入WSL Ubuntu系统时设置的用户名

## 优化终端体验

教程链接：[zsh 安装与配置，使用 oh-my-zsh 美化终端](https://www.haoyep.com/posts/zsh-config-oh-my-zsh/)

### 主题

1. 安装基本工具

```sh
# 更新软件源
sudo apt update && sudo apt upgrade -y
# 安装 zsh git curl
sudo apt install zsh git curl -y
# 设置默认终端为 zsh（注意：不要使用 sudo）。
chsh -s /bin/zsh
```

2. 安装oh-my-zsh

| Method                                           | Command                                                      |
| :----------------------------------------------- | :----------------------------------------------------------- |
| **curl**                                         | `sh -c "$(curl -fsSL https://install.ohmyz.sh/)"`            |
| **wget**                                         | `sh -c "$(wget -O- https://install.ohmyz.sh/)"`              |
| **fetch**                                        | `sh -c "$(fetch -o - https://install.ohmyz.sh/)"`            |
| 国内curl[镜像](https://gitee.com/pocmon/ohmyzsh) | `sh -c "$(curl -fsSL https://gitee.com/pocmon/ohmyzsh/raw/master/tools/install.sh)"` |
| 国内wget[镜像](https://gitee.com/pocmon/ohmyzsh) | `sh -c "$(wget -O- https://gitee.com/pocmon/ohmyzsh/raw/master/tools/install.sh)"` |

3. 配置主题

```bash
# 查看内置主题
cd ~/.oh-my-zsh/themes && ls
```

```sh
# 下载powerLevel10k主题
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

# 中国用户可以使用 gitee.com 上的官方镜像加速下载
git clone --depth=1 https://gitee.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

```SH
# 进入主题文件
vim ~/.zshrc
# 找到并更改下面这行的内容，然后保存文件
ZSH_THEME="powerlevel10k/powerlevel10k"
```

```SH
# 应用主题，然后根据系统提示进行定制化
source ~/.zshrc
# 如果定制过后不满意，可以重新定制
p10k configure
```

### 插件

#### zsh-autosuggetsion

作用：当你输入命令时，会自动推测你可能需要输入的命令，按下右键可以快速采用建议

```sh
# 把插件下载到本地的 ~/.oh-my-zsh/custom/plugins 目录
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# 中国用户可以使用下面任意一个加速下载
# 加速1
git clone https://github.moeyy.xyz/https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
# 加速2
git clone https://gh.xmly.dev/https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
# 加速3
git clone https://gh.api.99988866.xyz/https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

#### zsh-syntax-highlighting

作用：命令语法校验插件，在输入命令的过程中，若指令不合法，则指令显示为红色，若指令合法就会显示为绿色

```sh
# 把插件下载到本地的 ~/.oh-my-zsh/custom/plugins 目录
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# 中国用户可以使用下面任意一个加速下载
# 加速1
git clone https://github.moeyy.xyz/https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
# 加速2
git clone https://gh.xmly.dev/https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
# 加速3
git clone https://gh.api.99988866.xyz/https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

#### z

`oh-my-zsh` 内置了 `z` 插件。

`z` 是一个文件夹快捷跳转插件，对于曾经跳转过的目录，只需要输入最终目标文件夹名称，就可以快速跳转，避免再输入长串路径，提高切换文件夹的效率

#### extract

`oh-my-zsh` 内置了 `extract` 插件。

`extract` 用于解压任何压缩文件，不必根据压缩文件的后缀名来记忆压缩软件。使用 `x` 命令即可解压文件

#### web-search

`oh-my-zsh` 内置了 `web-search` 插件。

`web-search` 能让我们在命令行中使用搜索引擎进行搜索。使用`搜索引擎关键字+搜索内容` 即可自动打开浏览器进行搜索

#### 启用插件

```sh
# 进入配置文件
vim ~/.zshrc
```

```sh
# 修改配置，然后保存
plugins=(git zsh-autosuggestions zsh-syntax-highlighting z extract web-search)
```

```sh
# 应用配置
source ~/.zshrc
```

### 本地代理

[zsh 安装与配置，使用 oh-my-zsh 美化终端](https://www.haoyep.com/posts/zsh-config-oh-my-zsh/#配置本地代理)

