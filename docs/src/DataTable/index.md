# DataTable

数据表格

## 属性

| 属性      | 说明 | 类型   | 默认值 | 可选值 |
| --------- | ---- | ------ | ------ | ------ |
| tableOpts | 配置 | object | -      | -      |

### tableOpts 属性

| 属性         | 说明                                       | 类型                                                  | 默认值                                                                                    | 可选值 |
| ------------ | ------------------------------------------ | ----------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ |
| height       | 表格最大高度                               | number                                                | 500                                                                                       | -      |
| fontSize     | 字体大小                                   | string                                                | '12px'                                                                                    | -      |
| options      | 选项                                       | object                                                | \{ rowNum: false, multiSelect: false, showPagination: true, highlightCurrentRow: false \} | -      |
| cellStyle    | 表格单元格样式                             | Function({row, column, rowIndex, columnIndex})/Object | -                                                                                         | -      |
| rowClassName | 行样式名                                   | Function({row, rowIndex})/String                      | -                                                                                         | -      |
| data         | 表格数据                                   | array                                                 | -                                                                                         | -      |
| cols         | 列配置。详见 [_cols 列配置_](#cols-列配置) | array                                                 | -                                                                                         | -      |
| total        | 总数                                       | number                                                | -                                                                                         | -      |
| pages        | 分页                                       | object                                                | \{current: 1, size: 10\}                                                                  | -      |

> options 说明：
>
> - rowNum: 是否显示行号
> - multiSelect: 是否显示行多选框
> - showPagination: 是否显示分页
> - highlightCurrentRow: 是否高亮当前行
> - expand: 是否可展开行

#### cols 列配置

| 属性           | 说明         | 类型                 | 默认值   | 可选值                    |
| -------------- | ------------ | -------------------- | -------- | ------------------------- |
| isShow         | 是否显示     | boolean              | true     | -                         |
| label          | 列名称       | string               | -        | -                         |
| field          | 列属性名     | string               | -        | -                         |
| width          | 列宽         | number               | -        | -                         |
| minWidth       | 最小列宽     | string               | '80px'   | -                         |
| align          | 对齐方式     | string               | 'center' | 'left', 'center', 'right' |
| sort           | 是否排序     | boolean              | false    | true, false               |
| fixed          | 是否固定     | boolean/string       | false    | 'left', 'right', false    |
| operateBtns    | 操作按钮     | array                | -        | -                         |
| children       | 子列配置     | array                | -        | -                         |
| columnEditable | 列是否可编辑 | boolean              | false    | true, false               |
| formatter      | 格式化函数   | function(value, row) | -        | -                         |

#### operateBtns 操作按钮

| 属性      | 说明                |          类型           | 默认值 | 可选值   |
| --------- | ------------------- | :---------------------: | :----: | -------- |
| label     | 按钮文本            |         string          |   ""   | -        |
| icon      | 图标类名            |         string          |   -    | -        |
| style     | 按钮样式            |   string / CSSObject    |   -    | -        |
| type      | 操作类型            |         string          | "text" | 按钮类型 |
| tips      | 鼠标 hover 提示信息 |         string          |   -    | -        |
| premCheck | 权限校验            | function(row) / boolean |  true  | -        |
| handler   | 按钮点击事件        |      function(row)      |   -    | -        |

## 事件

| 事件名       | 说明           | 回调函数参数               |
| ------------ | -------------- | -------------------------- |
| cellClick    | 单元格点击事件 | (row, column, cell, event) |
| rowSelection | 选中行         | (row)                      |
| expandRow    | 展开行         | (row, expended)            |
| changePage   | 页码变化       | (pages)                    |

## slot

| 插槽名        | 说明       |
| ------------- | ---------- |
| expandContent | 展开行内容 |

## 示例

```vue
<template>
  <DataTable :table-opts="tableOpts" @changePage="handlePageChange" />
</template>

<script>
import { DataTable } from 'vue-components';
import { fetchData } from './api'; // 模拟接口

export default {
  name: 'DataTableUI',
  components: { DataTable },
  data() {
    return {
      tableOpts: {
        options: {
          tableHeight: 200,
          rowNum: true,
          showPagination: true,
          multiSelect: false,
          highlightCurrentRow: false
        },
        data: [], // 数据
        cols: [
          { label: '任务名称', field: 'name' },
          {
            label: '类型',
            field: 'type',
            formatter(val, row) {
              return row.typeName;
            }
          },
          { label: '开始时间', field: 'startDate' },
          { label: '结束时间', field: 'endDate' },
          { label: '进度(%)', field: 'progress' },
          {
            label: '是否完成',
            field: 'isFinish',
            formatter(val) {
              return val === 1 ? '是' : '否';
            }
          },
          {
            label: '预计是否超时',
            field: 'isTimeout',
            formatter(val) {
              return val === 1 ? '是' : '否';
            }
          },
          { label: '备注', field: 'remark', minWidth: 200 },
          {
            label: '操作',
            field: 'action',
            width: 100,
            operateBtns: [
              { tips: '删除', icon: 'el-icon-delete', style: 'color:red' },
              {
                tips: '编辑',
                icon: 'el-icon-edit',
                style: 'color:blue'
              }
            ]
          }
        ],
        total: 0,
        pages: {
          current: 1,
          size: 10
        }
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
      this.tableOpts.data = res.data;
    },
    handlePageChange(pages) {
      this.tableOpts.pages = pages;
    }
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
    type: 2,
    typeName: '系统级'
  }
  // ...
];

export const fetchData = () =>
  new Promise((resolve) => setTimeout(resolve, 500)).then(() => ({ data }));
```
