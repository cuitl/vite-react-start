# vite-react-start

基于 vite 的 react 项目初始化, 初始化内容包括：

- vite + react + typescript

- eslint + prettier 格式化代码

- 基于 [yorkie](https://github.com/yyx990803/yorkie) + [lint-staged](https://github.com/okonet/lint-staged) 控制 git 提交过程中的代码格式化

- [windicss](https://windicss.org/) surpport

- 添加简单的 React 状态管理库

  - [hookstate](https://hookstate.js.org/)
  - [hox state](https://github.com/umijs/hox/blob/v1/README.md)

- 基于 [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages) 的文件路由支持

- 基于 [formatjs:react-intl](https://formatjs.io/docs/react-intl)的多语言支持的简单实现。

## eslint & prettier on save

- vscode setting

  ```json
  {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": false,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true,
      "source.fixAll.prettier": true
    }
  }
  ```
