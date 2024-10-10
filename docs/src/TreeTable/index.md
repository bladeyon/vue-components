# TreeTable

树形表格。

### tableOpts 属性

| 属性        | 说明                                                                         | 类型     | 默认值 | 可选值 |
| ----------- | ---------------------------------------------------------------------------- | -------- | ------ | ------ |
| height      | 表格最大高度                                                                 | number   | 500    | -      |
| primaryKey  | 数据主键                                                                     | string   | 'id'   | -      |
| multiSelect | 是否显示行多选框                                                             | boolean  | false  | -      |
| rowNum      | 是否显示行号                                                                 | boolean  | false  | -      |
| data        | 表格数据                                                                     | array    | -      | -      |
| cols        | 列配置。详见 [_DataTable 的 cols 列配置_](../DataTable/index.md#cols-列配置) | array    | -      | -      |
| isLazy      | 是否为懒加载                                                                 | boolean  | false  | -      |
| params      | 懒加载时获取数据的参数                                                       | object   | -      | -      |
| getDataApi  | 懒加载时获取数据的接口                                                       | function | -      | -      |

## 示例

### 普通用法

```vue
<template>
  <TreeTable :table-opts="tableOpts" />
</template>
<script>
import { TreeTable } from 'vue-components';
import { fetchData } from './api';
export default {
  name: 'TreeTableUI',
  components: { TreeTable },
  data() {
    return {
      tableOpts: {
        height: 300,
        data: [], // 数据
        cols: [
          { label: '地区', field: 'location', align: 'left' },
          { label: '活动数量', field: 'count' }
        ]
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      // 请求数据
      const res = await fetchData();
      this.tableOpts.data = res.data.data;
    }
  }
};
</script>
```

```js static
// api.js
const data = [
  {
    id: 1,
    location: 'A 区',
    count: 22,
    children: [
      { id: 11, location: 'A 区1', count: 12 },
      {
        id: 12,
        location: 'A 区2',
        count: 10,
        children: [
          { id: 121, location: 'A 区2-1', count: 3 },
          { id: 122, location: 'A 区2-2', count: 7 }
        ]
      }
    ]
  },
  { id: 2, location: 'B 区', count: 14 }
];

export const fetchData = () =>
  new Promise((resolve) => setTimeout(resolve, 500)).then(() => ({
    data: { code: 0, msg: null, status: 'ok', data }
  }));
```

### 懒加载用法

```vue
<template>
  <TreeTable :table-opts="tableOpts" />
</template>
<script>
import { TreeTable } from 'vue-components';
import { fetchDataById } from './api';
export default {
  name: 'TreeTableUI',
  components: { TreeTable },
  data() {
    return {
      tableOpts: {
        height: 300,
        rowNum: true,
        isLazy: true,
        getDataApi: fetchDataById,
        cols: [
          { label: '地区', field: 'location', align: 'left' },
          { label: '活动数量', field: 'count' }
        ]
      }
    };
  }
};
</script>
```

```js static
// api.js
const dataLazy = [
  { id: 1, location: 'A 区', count: 22, parentId: -1 },
  { id: 2, location: 'B 区', count: 14, parentId: -1 },
  { id: 11, location: 'A 区1', count: 12, parentId: 1 },
  { id: 12, location: 'A 区2', count: 10, parentId: 1 },
  { id: 121, location: 'A 区2-1', count: 3, parentId: 12 },
  { id: 122, location: 'A 区2-2', count: 7, parentId: 12 }
];

export const fetchDataById = ({ id = -1 }) =>
  new Promise((resolve) => setTimeout(resolve, 500)).then(() => ({
    data: {
      code: 0,
      msg: null,
      status: 'ok',
      data: dataLazy.filter((item) => item.parentId === id)
    }
  }));
```
