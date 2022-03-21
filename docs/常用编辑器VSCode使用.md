
# 编辑器常用配置 Vscode

## 安装插件

| 插件名                         | 作用                |
| ------------------------------ | ------------------- |
| auto close tag                 | 自动关闭结束标签    |
| auto rename tag                | 自动重命名结束标签  |
| Prettier - Code formatter      | 代码格式化          |
| bracket pair colorizer         | 高亮括号            |
| chinese（Simplified）Language  | 汉化                |
| eslint                         | eslint 代码格式检测 |
| gitlens                        | git 辅助工具        |
| git history                    | git 辅助工具        |
| JavaScript（ES6）code snippets | es6 提示            |
| Vetur                          | vue 支持            |

## 默认配置

```js
{
  "emmet.includeLanguages": {
      "wxml": "html",
      "javascript": "javascriptreact",
      "vue-html": "html",
      "plaintext": "jade"
  },
  "files.autoSave": "afterDelay",
  "files.associations": {
      "*.cjson": "jsonc",
      "*.wxss": "css",
      "*.wxs": "javascript"
  },
  "editor.tabSize": 2,
  "editor.renderWhitespace": "all",
  "editor.wordSeparators": "`~!@#$%^&*()=+[{]}\\|;:'\",.<>/?",
  "eslint.options": {
    "plugins": [
      "html"
    ]
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "html",
    "vue",
    {
      "language": "html",
      "autoFix": true
    },
    {
      "language": "vue",
      "autoFix": true
    }
  ],
  "eslint.autoFixOnSave": true,
  "editor.formatOnSave": true,
  "vetur.format.defaultFormatterOptions": {
    "prettier": {
      "semi": false,
      "singleQuote": true,
      "eslintIntegration": true
    }
  },
  //使用单引号
  "prettier.singleQuote": true,
  //结尾不加分号
  "prettier.semi": false,
}

```
