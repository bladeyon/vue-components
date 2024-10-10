# CRUDPage

简易的增删改查页面

## 属性

| 属性名     | 说明                                                       | 类型   | 默认值 | 可选值 |
| ---------- | ---------------------------------------------------------- | ------ | ------ | ------ |
| primaryKey | 业务主键                                                   | string | "id"   | -      |
| apiFn      | 接口函数                                                   | Object | null   | -      |
| queryOpts  | 查询配置。详见 [_QueryForm 配置_](../QueryForm/index.md)   | Object | null   | -      |
| formOpts   | 表单配置。详见 [_FormDialog 配置_](../FormDialog/index.md) | Object | null   | -      |
| tableOpts  | 表格配置。详见 [_DataTable 配置_](../DataTable/index.md)   | Object | null   | -      |

### apiFn 接口函数对象

| 属性名     | 说明 | 类型                                                                 |
| ---------- | ---- | -------------------------------------------------------------------- |
| getPage    | 查询 | function(params): Promise<{data: array, total: number, msg: string}> |
| post       | 新增 | function(data): Promise<{data: boolean, msg: string}>                |
| put        | 修改 | function(data): Promise<{data: boolean, msg: string}>                |
| deleteById | 删除 | function(id): Promise<{data: boolean, msg: string}>                  |

## 示例

```vue
<template>
  <CRUDPage
    :api-fn="apiFn"
    :query-opts="queryOpts"
    :table-opts="tableOpts"
    :form-opts="formOpts"
  ></CRUDPage>
</template>

<script>
import { CRUDPage } from 'vue-components';
import { fetchData, postData, putData, deleteData } from './api';

const typeOptions = [
  { label: '业务级', value: 1 },
  { label: '系统级', value: 2 }
];
const typeMap = new Map(typeOptions.map((item) => [item.value, item.label]));
const columns = [
  { label: '任务名称', field: 'name' },
  {
    label: '类型',
    field: 'type',
    default: 1,
    component: 'select',
    componentProps: {
      options: typeOptions
    },
    formatter(value) {
      return value && typeMap.get(+value);
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
];
export default {
  name: 'CRUDPageUI',
  components: { CRUDPage },
  data() {
    return {
      apiFn: {
        getPage: fetchData,
        post: postData,
        put: putData,
        deleteById: deleteData
      },
      queryOpts: {
        form: [{ label: '任务名称', field: 'name' }]
      },
      tableOpts: {
        height: 300,
        cols: columns
      },
      formOpts: {
        dialogProps: { width: '60%' },
        formProps: { labelWidth: '100px' },
        formRules: { name: true },
        formItems: columns
      }
    };
  }
};
</script>
```

```js static
// api.js
const data = [
  {
    endDate: '2024-10-01',
    id: 1,
    isFinish: 0,
    isTimeout: 0,
    name: '数据清洗程序',
    progress: 60,
    remark: null,
    startDate: '2024-01-01',
    type: 2
  },
  {
    endDate: '2025-05-01',
    id: 2,
    isFinish: 0,
    isTimeout: 0,
    name: '矿井数据标准化',
    progress: 60,
    remark: null,
    startDate: '2024-01-01',
    type: 1
  }
];

export const fetchData = (params) =>
  new Promise((resolve) => setTimeout(resolve, 200)).then(() => {
    const { page = 1, pageSize = 10, name } = params;
    let filterData = [...data];
    if (name) {
      filterData = filterData.filter((item) =>
        item.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    filterData = filterData.slice((page - 1) * pageSize, page * pageSize);
    return { code: 0, msg: null, status: 'ok', data: filterData };
  });

export const postData = (formData) =>
  new Promise((resolve) => setTimeout(resolve, 200)).then(() => {
    data.push({ ...formData, id: Math.random().toString(16).slice(2, 10) });
    return {
      code: 0,
      msg: '添加成功',
      status: 'ok',
      data: true
    };
  });
export const putData = (formData) =>
  new Promise((resolve) => setTimeout(resolve, 200)).then(() => {
    const pos = data.findIndex((item) => item.id === formData.id);
    data.splice(pos, 1, formData);
    return {
      code: 0,
      msg: '修改成功',
      status: 'ok',
      data: true
    };
  });

export const deleteData = (id) =>
  new Promise((resolve) => setTimeout(resolve, 200)).then(() => {
    const pos = data.findIndex((item) => item.id === id);
    data.splice(pos, 1);
    return {
      code: 0,
      msg: '删除成功',
      status: 'ok',
      data: true
    };
  });
```
