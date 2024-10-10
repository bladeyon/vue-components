# QueryForm

查询表头。由输入框、选择器、单选框、多选框等表单控件组成，用于生成查询条件。

## 属性

| 属性  | 说明     | 类型   | 默认值 | 可选值 |
| ----- | -------- | ------ | ------ | ------ |
| query | 查询配置 | object | {}     | -      |

### query 属性

| 属性 | 说明                                                         | 类型  | 默认值 | 可选值 |
| ---- | ------------------------------------------------------------ | ----- | ------ | ------ |
| form | 表单项配置，详见 [**表单项配置**](../FormDialog#formelement) | array | -      | -      |
| btns | 按钮配置                                                     | array | -      | -      |

#### btns 按钮的可配置属性

| 属性   | 说明         | 类型    | 默认值  | 可选值                                           |
| ------ | ------------ | ------- | ------- | ------------------------------------------------ |
| isShow | 是否显示     | boolean | true    | true, false                                      |
| text   | 按钮文本     | string  | -       | -                                                |
| icon   | 按钮图标类名 | string  | -       | -                                                |
| type   | 按钮类型     | string  | primary | default, primary, danger, warning, info, success |
| event  | 事件名       | string  | -       | -                                                |

## 事件

在 btns 中给每个按钮配置的事件名 `event` 的值为 QueryForm 的事件，如 `search`、`add` 等

## 示例

通过配置生成 select 和 input 的查询表单

```vue
<template>
  <QueryForm :query="queryCfg" @search="handleSearch" @add="handleAdd" />
</template>
<script>
// import { QueryForm } from 'vue-components';
export default {
  name: 'QueryFormUI',
  components: {
    QueryForm
  },
  data() {
    return {
      queryCfg: {
        form: [
          {
            label: '任务',
            field: 'remand',
            default: '2',
            component: 'select',
            componentProps: {
              options: [
                { label: 'zk', value: '1' },
                { label: 'zk2', value: '2' }
              ]
            }
          },
          {
            label: '类型',
            field: 'type',
            default: '运维'
          }
        ],
        btns: [
          { text: '查询', type: 'primary', event: 'search' },
          { text: '新增', type: 'success', event: 'add' }
        ]
      }
    };
  },
  methods: {
    handleSearch(data) {
      console.log(data);
    },
    handleAdd() {
      console.log('打开新增表单弹窗');
    }
  }
};
</script>
```
