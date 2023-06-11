# Markdown Extension Examples

This page demonstrates some of the built-in markdown extensions provided by VitePress.

## Syntax Highlighting

VitePress provides Syntax Highlighting powered by [Shiki](https://github.com/shikijs/shiki), with additional features like line-highlighting:

**Input**

````
```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```
````

**Output**

```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

## Custom Containers

**Input**

```md
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::
```

**Output**

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

## More

Check out the documentation for the [full list of markdown extensions](https://vitepress.dev/guide/markdown).


```
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    // 'subject-case': [0, 'never'],
    "type-enum": [
      2, //代表必须输入
      "always",
      [
        "docs", // Adds or alters documentation. 仅仅修改了文档，比如README, CHANGELOG, CONTRIBUTE等等
        "chore", // Other changes that don't modify src or test files. 改变构建流程、或者增加依赖库、工具等
        "feat", // Adds a new feature. 新增feature
        "fix", // Solves a bug. 修复bug
        "merge", // 仅进行分支合并.
        "improvement", // 用于对当前实现进行改进而没有添加新功能或修复错误的提交.
        "perf", // Improves performance. 优化相关，比如提升性能、体验
        "refactor", // Rewrites code without feature, performance or bug changes. 代码重构，没有加新功能或者修复bug
        "revert", // Reverts a previous commit. 回滚到上一个版本
        "style", // Improves formatting, white-space. 仅仅修改了空格、格式缩进、逗号等等，不改变代码逻辑
        "test", // Adds or modifies tests. 测试用例，包括单元测试、集成测试等
        "ci", //主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交
        "build",  //主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
        "develop" // 主要目的是开发相关的提交
      ]
    ]
  }
}

```
