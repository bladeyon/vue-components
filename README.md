# Vue 组件库

Element UI 组件二次封装

## 安装

```sh
npm install vue-components
```

> `vue-components` 依赖 `element-ui@^2.15.7` 等 npm 包，已在 `package.json` 的 `peerDependencies` 中配置，如果没有自动安装依赖，需要手动安装

## vue-components 样式

1. 如果需要修改样式，则必须导入 element-ui 的主题的 scss 文件，并指定 _图标字体路径_，否则外部无法覆盖 element 变量，能覆盖的变量以 element-ui 的 scss 变量为准。

   ```scss
   // 其他样式
   // ...

   $--color-primary: red; // 覆盖主色

   // vue-components 样式 及 依赖样式
   $--font-path: 'element-ui/packages/theme-chalk/src/fonts';
   @import 'element-ui/packages/theme-chalk/src/index.scss';
   @import 'vue-components/lib/style.css';
   ```

2. 如果不需要修改样式，则可以直接导入 element-ui 的主题的 css 文件

   ```scss
   // 其他样式
   // ...

   // vue-components 样式 及 依赖样式
   @import 'element-ui/lib/theme-chalk/index.css';
   @import 'vue-components/lib/style.css';
   ```

**注意**：有时会出现路径获取不到的问题，用相对路径。如：`@import '../../../node_modules/***';`
