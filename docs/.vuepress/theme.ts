import { hopeTheme } from "vuepress-theme-hope";

export default hopeTheme({
  // hostname: "https://vuepress-theme-hope-docs-demo.netlify.app",
  //
  author: {
    name: "Okita",
    url: "https://Okita1027.github.io",
    email: "2368932388@qq.com",
  },
  //
  // iconAssets: "fontawesome-with-brands",
  //
  logo: "/logo.png",
  logoDark: "/logo-dark.png",
  favicon: "/favicon.ico",
  navbarTitle: "沖田さんの知識ベース",

  // 默认为 GitHub. 同时也可以是一个完整的 URL
  repo: "https://github.com/Okita1027/kd/",
  // 自定义仓库链接文字。默认从 `repo` 中自动推断为
  // "GitHub" / "GitLab" / "Gitee" / "Bitbucket" 其中之一，或是 "Source"。
  repoLabel: "GitHub",
  // 是否在导航栏内显示仓库链接，默认为 `true`
  repoDisplay: true,

  // docsDir: "src",

  pageInfo: ["Author", "Date", "Category", "Tag", "ReadingTime", "Word"],

  fullscreen: true,
  darkmode: "toggle",

  lastUpdated: true,

  editLink: true,
  contributors: true,

  // 默认显示4层级
  toc: {
    levels: [2, 6],
  },

  // 导航布局
  navbarLayout: {
    start: ["Brand"],
    center: ["Links"],
    end: ["Outlook", "Repo", "Search"],
  },
  // 导航栏
  navbar: [
    {
      text: "主页",
      link: "/",
      icon: "/home.png",
    },
    {
      text: "基础",
      link: "/basic/",
      icon: "/icon/java.png",
    },
    {
      text: "数据库",
      link: "/database/",
      icon: "/icon/database.svg",
    },
    {
      text: "框架",
      link: "/frame/",
      icon: "/icon/frame.png",
    },
    {
      text: "前端",
      link: "/web/",
      icon: "/icon/web.png",
    },
    {
      text: "",
      link: "/dotnet/",
      icon: "/icon/dotnet.png",
    },
    // {
    // text: "相关链接",
    // link: "#",
    // icon: "/icon/relevant/link.png",
    // children: ["https://Okita1027.github.io"]
    /*             children: [
                {
                    text: "博客站点",
                    link: "https://Okita1027.github.io",
                    icon: "/favicon.ico"
                },
            ] */
    /*             children: [
                {
                    text: "阿萨德",
                    children: ["https://www.baidu.com", "https://yiyan.baidu.com"]
                }
            ] */
    // }
  ],

  // 侧边栏
  sidebar: {
    // "/basic/": [
    //     {
    //         text: "基础",
    //         prefix: "/basic/",
    //         link: "/",
    //         children: [
    //             "JVM.md",
    //             "JUC.md",
    //             "FunctionalProgramming.md",
    //             "JDKNewFeature/"
    //         ]
    //     }
    // ],
    "/basic/": "structure",
    "/database/": "structure",
    "/frame/": "structure",
    "/web/": "structure",
    "/dotnet/": "structure",
  },

  // 页脚
  footer: "Vuepress & theme-hope",
  copyright: "MIT Licensed | Copyright © 2024-present Okita",
  displayFooter: false,

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  hotReload: true,

  markdown: {
    preview: true,
    // 启用图片懒加载
    imgLazyload: true,
    // 启用图片标记
    imgMark: true,
    // 启用图片大小
    imgSize: true,
    // 启用脚注
    footnote: true,
    // 启用标记
    mark: true,
    // 启用任务列表
    tasklist: true,
    mermaid: true,
    highlighter: "prismjs",
    // highlighter: "shiki",
    revealjs: {
      plugins: ["highlight", "math", "search", "notes", "zoom"],
    },
  },

  // 在这里配置主题提供的插件
  plugins: {
    /* docsearch: {
            appId: "AWSKYW5GBL",
            apiKey: "bde9b1a8aa183d5a239eb6c030c8c835",
            indexName: "okita1027io",
        }, */
    /* docsearch: {
            appId: "0251D4S7LW",
            apiKey: "22fdb1ea25ae8f93a0502c85f5b5ff30",
            indexName: "kd_zhiyun_space_0251d4s7lw_pages",
        }, */
    /*         docsearch: {
            appId: "0251D4S7LW",
            apiKey: "9b9b28389ae36cd67cfaf5d486149ab3",
            indexName: "kd clawer",
        }, */

    copyCode: {
      // 在移动端显示复制按钮
      showInMobile: true,
    },

    slimsearch: {
      // 配置项
      indexContent: false,
      suggestion: false,
      queryHistoryCount: 0,
      resultHistoryCount: 0,
      searchDelay: 200,
      sortStrategy: "max",
    },

    copyright: {
      // 当复制的内容长度不小于 30 时，追加版权信息
      triggerLength: 30,
      author: "Zhiyun Qin",
      license: "MIT",
      // 禁用复制
      // disableCopy: true,
      // 禁用选择
      // disableSelection: true,
    },

    feed: {
      rss: true,
    },

    // 如果你需要 PWA。安装 @vuepress/plugin-pwa 并取消下方注释
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cacheImage: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
