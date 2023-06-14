import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Awesome Project",
  description: "A VitePress Site",
  srcDir: "./",
  lang: "zh_CN",
  head: [["link", { rel: "icon", href: "/favicon.png" }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/examples/markdown-examples" },
      { text: "docs", link: "/docs/index" }
    ],

    outline: "deep",
    sidebar: {
      "/examples/": [
        {
          text: "Examples",
          items: [
            { text: "Markdown Examples", link: "/examples/markdown-examples" },
            { text: "Runtime API Examples", link: "/examples/api-examples" }
          ]
        }
      ],
      "/docs/": [
        {
          text: "Docs",
          items: [{ text: "Getting Started", link: "/docs/project-construction" }]
        }
      ]
    },

    socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }]
  }
});
