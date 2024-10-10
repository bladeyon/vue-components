# FormDialog

表单维护对话框

## FormDialog 属性

| 属性        | 说明                                                                                  | 类型   | 默认值                | 可选值 |
| ----------- | ------------------------------------------------------------------------------------- | ------ | --------------------- | ------ |
| title       | 标题。如果设置了 `primaryKey`，则根据 `formData.primaryKey`是否有值赋为‘编辑’或‘新增’ | string | ""                    | -      |
| primaryKey  | 表单主键                                                                              | string | "id"                  | -      |
| dialogProps | 对话框配置，详见 [dialogProps](#dialogprops-属性)                                     | object | \{width: '800px'\}      | -      |
| formProps   | 表单配置，详见 [formProps](#formprops-属性)                                           | object | \{labelWidth: '140px'\} | -      |
| formRules   | 表单校验规则                                                                          | object | -                     | -      |
| formData    | 表单数据                                                                              | object | {}                    | -      |
| formItems   | 表单项配置项数组， 详见 [`FormElement.eleOpt`](#eleopt-属性)                          | array  | -                     | -      |

### dialogProps 属性

| 属性       | 说明                   | 类型   | 默认值  | 可选值 |
| ---------- | ---------------------- | ------ | ------- | ------ |
| width      | 对话框宽度             | string | '800px' | -      |
| footerBtns | 对话框 Footer 按钮配置 | array  | -       | -      |

#### footerBtns 按钮的可配置属性

| 属性    | 说明                                         | 类型    | 默认值  | 可选值                                           |
| ------- | -------------------------------------------- | ------- | ------- | ------------------------------------------------ |
| text    | 按钮文本                                     | string  | -       | -                                                |
| icon    | 按钮图标类名                                 | string  | -       | -                                                |
| type    | 按钮类型                                     | string  | primary | default, primary, danger, warning, info, success |
| event   | 事件名                                       | string  | -       | -                                                |
| isValid | 是否校验（触发事件时，是否需要进行表单校验） | boolean | false   | true, false                                      |

### formProps 属性

| 属性       | 说明           | 类型   | 默认值  | 可选值 |
| ---------- | -------------- | ------ | ------- | ------ |
| labelWidth | 表单项标签宽度 | string | '140px' | -      |

### formRules 说明

1. 简单的配置方式，属性值为 `boolean`：\{ name: true, count: true \}，这种写法只校验必填。其中 `name` 、`count` 为 `formData` 的属性名
2. 属性值为 `array`，详见
   <a href="https://element.eleme.cn/#/zh-CN/component/form#zi-ding-yi-xiao-yan-gui-ze" target="_blank">_ElementUI 的 Form 自定义校验规则_</a>

## FormElement

表单项。通常配合 [_`QueryForm`_](../QueryForm/index.md)、`FormDialog` 等组件使用。

## FormElement 属性

| 属性      | 说明           | 类型   | 默认值 | 可选值 |
| --------- | -------------- | ------ | ------ | ------ |
| eleOpt    | 表单项配置     | object | -      | -      |
| formItems | 表单所有项配置 | array  | -      | -      |
| dataForm  | 表单项样式     | object | -      | -      |

### eleOpt 属性

| 属性           | 说明                                                                         | 类型               | 默认值 | 可选值                                                                                |
| -------------- | ---------------------------------------------------------------------------- | ------------------ | ------ | ------------------------------------------------------------------------------------- |
| label          | 表单项显示名称                                                               | string             | -      | -                                                                                     |
| field          | 表单项属性名                                                                 | string             | -      | -                                                                                     |
| style          | 表单项样式                                                                   | string / CSSObject | -      | -                                                                                     |
| labelWidth     | 标签宽度（优先级最高）                                                       | string             | ''     | -                                                                                     |
| default        | 表单项默认值                                                                 | any                | -      | -                                                                                     |
| canEdit        | 是否允许编辑                                                                 | boolean            | true   | -                                                                                     |
| component      | 表单项组件名                                                                 | string             | input  | input, textarea, select, selectTree, datepicker, radioGroup, switch, cascader, upload |
| componentProps | 表单项组件配置，具体参数请查看 [componentProps](#componentprops-属性) 的说明 | object             | -      | -                                                                                     |

#### componentProps 属性

主要分两部分：与组件相关的配置项和事件

1. 与组件相关的通用配置项

| 属性     | 说明     | 类型    | 默认值 | 可选值 |
| -------- | -------- | ------- | ------ | ------ |
| readonly | 是否只读 | boolean | false  | -      |
| disabled | 是否禁用 | boolean | false  | -      |

2. 与组件相关的特殊配置项

   - textarea

     | 属性 | 说明 | 类型   | 默认值 | 可选值 |
     | ---- | ---- | ------ | ------ | ------ |
     | rows | 行数 | number | 3      | -      |

   - select

     | 属性         | 说明                      | 类型     | 默认值 | 可选值 |
     | ------------ | ------------------------- | -------- | ------ | ------ |
     | options      | 选项                      | array    | -      | -      |
     | remote       | 是否远程加载选项          | boolean  | false  | -      |
     | remoteMethod | 远程请求方法              | function | -      |        |
     | multiple     | 是否多选                  | boolean  | false  | -      |
     | isShowMulBtn | 是否显示多选按钮          | boolean  | false  | -      |
     | allowCreate  | 是否允许创建新选项        | boolean  | false  | -      |
     | hasLaTeX     | 是否支持 LaTeX 语法的公式 | boolean  | false  | -      |

     > 注意：
     >
     > - options 的数据结构为 `[{label: string, value: string}]`
     > - 当 `remote` 为 `true` 时，`remoteMethod` 为必填项。remoteMethod 的参数为 `(formItem: object, dataForm: object)`，elConfig 为当前表单项配置项，dataForm 为表单数据对象
     > - hasLaTeX 为 `true` 时，支持 LaTeX 行表达式。公式内容用 $$...$ 包裹，如：$$a^2+b^2=c^2$。

   - selectTree

     | 属性         | 说明                                                                                                     | 类型    | 默认值                                   | 可选值 |
     | ------------ | -------------------------------------------------------------------------------------------------------- | ------- | ---------------------------------------- | ------ |
     | data         | 树结构数据                                                                                               | array   | -                                        | -      |
     | nodeKey      | key                                                                                                      | string  | 'id'                                     | -      |
     | props        | 节点数据属性映射，详见 [_ElementUI 的 Tree 配置_](https://element.eleme.cn/#/zh-CN/component/tree#props) | object  | \{ label: 'label', children: 'children' \} |        |
     | showCheckbox | 是否显示复选框                                                                                           | boolean | false                                    | -      |
     | accordion    | 是否每次只打开一个同级树节点展开                                                                         | boolean | true                                     | -      |

   - datepicker

     | 属性        | 说明     | 类型   | 默认值       | 可选值                                           |
     | ----------- | -------- | ------ | ------------ | ------------------------------------------------ |
     | valueFormat | 日期格式 | string | 'yyyy-MM-dd' | -                                                |
     | format      | 日期格式 | string | 'yyyy-MM-dd' | -                                                |
     | type        | 日期类型 | string | 'date'       | 'date', 'datetime', 'datetimerange', 'daterange' |

   - radioGroup

     | 属性    | 说明 | 类型  | 默认值 | 可选值 |
     | ------- | ---- | ----- | ------ | ------ |
     | options | 选项 | array | -      | -      |

   - switch

     | 属性          | 说明           | 类型                  | 默认值  | 可选值 |
     | ------------- | -------------- | --------------------- | ------- | ------ |
     | active        | 打开时的值     | string/number/boolean | 1       | -      |
     | activeColor   | 打开时的背景色 | string                | #409EFF | -      |
     | inactive      | 关闭时的值     | string/number/boolean | 0       | -      |
     | inactiveColor | 关闭时的背景色 | string                | #C0CCDA | -      |

   - cascader

     | 属性          | 说明                                                                                                     | 类型    | 默认值 | 可选值 |
     | ------------- | -------------------------------------------------------------------------------------------------------- | ------- | ------ | ------ |
     | options       | 选项                                                                                                     | array   | -      | -      |
     | showAllLevels | 是否显示全路径                                                                                           | boolean | false  | -      |
     | props         | 节点属性，详见 [_ElementUI 的 Cascader 配置_](https://element.eleme.cn/#/zh-CN/component/cascader#props) | object  | -      | -      |

   - upload

     | 属性           | 说明                             | 类型                                        | 默认值 | 可选值 |
     | -------------- | -------------------------------- | ------------------------------------------- | ------ | ------ |
     | httpRequest    | 上传接口                         | function                                    | -      | -      |
     | action         | 上传地址                         | string                                      | -      | -      |
     | autoUpload     | 是否自动上传                     | boolean                                     | true   | -      |
     | multiple       | 多文件上传                       | boolean                                     | -      | -      |
     | limit          | 最大允许上传个数                 | number                                      | -      | -      |
     | showFileList   | 是否显示文件列表                 | boolean                                     | true   | -      |
     | accept         | 上传文件类型                     | string                                      | -      | -      |
     | onBeforeRemove | 删除前回调                       | function(file, fileList, dataForm)          | -      | -      |
     | onRemove       | 文件列表移除文件时回调           | function(file, fileList, dataForm)          | -      | -      |
     | onChange       | 文件状态改变时回调（成功或失败） | function(file, fileList, dataForm)          | -      | -      |
     | onSuccess      | 文件上传成功时回调               | function(response,file, fileList, dataForm) | -      | -      |

#### FormElement 事件

| 事件类型 | 说明                           | 参数                                                                                        |
| -------- | ------------------------------ | ------------------------------------------------------------------------------------------- |
| input    | 输入值后触发，只对 `input`有效 | (value: string, field: string, dataForm: object, formItems:object, formEl: HTMLFormElement) |
| focus    | 只对 `input`、`select` 有效    | 同上                                                                                        |
| change   | 值修改后触发                   | 同上                                                                                        |

> 参数说明：
>
> - value: 当前值
> - field: 表单项属性名
> - dataForm: 表单数据对象
> - formItems: 表单项配置对象
> - formEl: 当前表单元素。是表单，不是表单项

### formItems

表单项配置项数组，类型为：`Array<eleOpt>`

### dataForm

表单响应数据

## 示例

通过配置生成表单弹窗。表单中，“任务名称”设置成必填项，其中“进度”和“是否完成”组成联动，会随“进度”的值变化而触发 `change` 事件，在事件回调中更新“是否完成”的值。

```vue
<template>
  <div>
    <el-button type="primary" @click="handleOpen">新增</el-button>
    <FormDialog
      ref="form-dialog"
      :dialog-props="formOpts.dialogProps"
      :form-props="formOpts.formProps"
      :primary-key="primaryKey"
      :form-items="formOpts.formItems"
      :form-data="formData"
      :form-rules="formOpts.formRules"
      @success="handleSuccess"
    />
  </div>
</template>

<script>
import { FormDialog } from 'vue-components';

export default {
  name: 'FormDialogUI',
  components: { FormDialog },
  data() {
    return {
      primaryKey: 'id',
      formData: {},
      formOpts: {
        dialogProps: { width: '60%' },
        formProps: { labelWidth: '100px' },
        formRules: { name: true },
        formItems: [
          { label: '任务名称', field: 'name' },
          {
            label: '类型',
            field: 'type',
            component: 'select',
            componentProps: {
              options: [
                { label: '业务级', value: '1' },
                { label: '系统级', value: '2' }
              ]
            }
          },
          { label: '开始时间', field: 'startDate', component: 'datepicker' },
          { label: '结束时间', field: 'endDate', component: 'datepicker' },
          {
            label: '进度(%)',
            field: 'progress',
            componentProps: {
              type: 'number',
              change: (val, field, dataForm, formItems, formElement) => {
                // 如果进度超过 100，是否完成 更新为 是
                if (val >= 100) {
                  dataForm.isFinish = 1;
                } else {
                  dataForm.isFinish = 0;
                }
              }
            }
          },
          {
            label: '是否完成',
            field: 'isFinish',
            default: 0, // 默认值为 0
            component: 'radioGroup',
            componentProps: {
              disabled: true, // 禁用
              options: [
                { label: '是', value: 1 },
                { label: '否', value: 0 }
              ]
            }
          },
          {
            label: '预计是否超时',
            field: 'isTimeout',
            default: false,
            component: 'switch'
          },
          { label: '备注', field: 'remark', component: 'textarea' }
        ]
      }
    };
  },
  methods: {
    handleOpen() {
      this.$refs['form-dialog'].open();
    },
    handleSuccess(data) {
      console.log(data);
      this.$refs['form-dialog'].close();
    }
  }
};
</script>
```
