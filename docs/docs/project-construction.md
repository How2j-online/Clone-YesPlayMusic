# Project Construction

## add commitizen

用于git commit message的规范化，使用commitizen工具，可以通过命令行的方式，生成符合格式的commit message。

#### 安装 commitizen cz-customizable

```bash
yarn add commitizen  cz-customizable -D
```

[commitizen](http://commitizen.github.io/cz-cli/) 是一个撰写合格 Commit message 的工具，它会根据你的输入，生成符合格式的 Commit message。  
[cz-customizable](https://github.com/leoforfree/cz-customizable) 是一个 commitizen 的插件，它可以自定义 commit message 的格式。  


#### 配置 commitizen cz-customizable

在项目根目录下创建 `.cz-config.json` 文件，内容如下：

```json
{
  "types": [
    {
      "value": ":sparkles: feat",
      "name": "✨  feat: 新功能"
    },
    {
      "value": ":bug: fix",
      "name": "🐛 fix: 修复"
    },
    {
      "value": ":memo: docs",
      "name": "📝 docs: 文档变更"
    },
    {
      "value": ":lipstick: style",
      "name": "💄 style: 代码格式(不影响代码运行的变动)"
    },
    {
      "value": ":recycle: refactor",
      "name": "♻️ refactor: 重构 (既不增加feature, 也不是修复bug)"
    },
    {
      "value": ":zap: perf",
      "name": "⚡️ perf: 性能优化"
    },
    {
      "value": ":white_check_mark: test",
      "name": "✅  test: 增加测试"
    },
    {
      "value": ":wrench: chore",
      "name": "🔧 chore: 构建过程或辅助工具的变动"
    },
    {
      "value": ":rewind: revert",
      "name": "⏪  revert: 回退"
    },
    {
      "value": ":rocket: build",
      "name": "🚀 build: 打包"
    },
    {
      "value": ":construction_worker: develop",
      "name": "💪 develop: 开发中的提交"
    }

  ],
  "messages": {
    "type": "请选择提交的类型：",
    "customScope": "情输入修改的范围(可选)",
    "subject": "请简要描述提交(必填)",
    "body": "请输入详细描述(可选)",
    "footer": "请输入要关闭的issues(可选)",
    "confirmCommit": "确认要使用以上信息提交？(y/n)"
  },
  "subjectLimit": 72
}

```

在 `package.json` 中添加如下代码：

```json
{
    "config": {
        "commitizen": {
          "path": "node_modules/cz-customizable"
        },
        "cz-customizable": {
          "config": ".cz-config.json"
        }
      }
}
 ```
 
## add commitlint

[commitlint](https://commitlint.js.org/#/)用于效验git commit message 是否符合规范

#### 安装 commitlint

```bash
yarn add @commitlint/cli @commitlint/config-conventional -D
```

使用[commitlint-config-cz](https://github.com/whizark/commitlint-config-cz)对自定义的git提交说明进行校验。

```bash
yarn add commitlint-config-cz -D
```

#### 配置 commitlint

在项目根目录下创建 `.commitlintrc.json` 文件，内容如下：

```json
{
  "extends": [
    "@commitlint/config-conventional",
    "cz"
  ],  
  "rules": {
        "type-empty": [0, "never"],
        "subject-empty": [0, "never"],
        "type-enum": [
          2,
          "always",
          [
            "docs",
            "chore",
            "feat",
            "fix",
            "merge",
            "improvement",
            "perf",
            "refactor",
            "revert",
            "style",
            "test",
            "ci",
            "build",
            "develop"
          ]
        ]
      }

}
```

## add husky

[husky](https://typicode.github.io/husky/)是一个Git hooks 工具,内置了许多钩子处理命令，我们在git commit的时候需要校验commit信息是否符合规范，所以我们需要在commit之前执行commitlint校验，husky可以帮助我们在git commit之前执行命令。

#### 安装 husky

```bash
// installl
yarn add husky -D

// active
yarn husky install
```

#### 配置 husky 添加 hooks

在 `package.json` 中添加如下代码：

```json
{
    "husky": {
        "hooks": {
          "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
        }
      }
}
```

或者命令行执行：

```bash
npx husky add .husky/commit-msg  'npx --no -- commitlint --edit ${1}'
```

#### 测试

查看最近一次提交的commit message是否符合规范

```bash
npx commitlint --from HEAD~1 --to HEAD --verbose
```

参考  
* [commitlint](https://juejin.cn/post/6887391877801672711)\
* [husky](https://juejin.cn/post/6974301879731748900)

