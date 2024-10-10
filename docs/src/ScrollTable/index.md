# ScrollTable

滚动列表。

## 属性

| 属性         | 说明       | 类型   | 默认值 |
| ------------ | ---------- | ------ | ------ |
| data         | 列表数据   | array  | -      |
| colOptions   | 列配置     | array  | -      |
| scrollParams | 滚动参数   | object | -      |
| stripeColor  | 斑马纹颜色 | string | -      |

### colOptions 属性

| 属性  | 说明     | 类型             | 默认值 |
| ----- | -------- | ---------------- | ------ |
| label | 列标题   | string           | -      |
| field | 列属性名 | string           | -      |
| style | 列样式   | string/CSSObject | -      |

### scrollParams 属性

| 属性         | 说明                     | 类型    | 默认值 | 可选值                      |
| ------------ | ------------------------ | ------- | ------ | --------------------------- |
| step         | 滚动速度                 | number  | 1      | -                           |
| limitMoveNum | 超过几行数据开始滚动     | number  | 3      | -                           |
| hoverStop    | 是否开启鼠标悬停 stop    | boolean | true   |                             |
| direction    | 方向                     | number  | 1      | 0:向下,1:向上,2:向左,3:向右 |
| openWatch    | 开启数据实时监控刷新 dom | number  | true   |                             |
| singleHeight | 单步运动停止的高度       | number  | 0      | 只对方向 0 和 1 有效        |
| singleWidth  | 单步运动停止的宽度       | number  | 0      | 只对方向 2 和 3 有效        |
| waitTime     | 单步运动停止的时间(ms)   | number  | 1000   |                             |

## 示例

```vue
<template>
  <ScrollTable
    style="height: 200px"
    :data="data"
    :col-options="colOptions"
    :scroll-params="scrollParams"
    stripe-color="#ccc"
  />
</template>

<script>
import { ScrollTable } from 'vue-components';
import { fetchData } from './api';

export default {
  name: 'ScrollTableUI',
  components: { ScrollTable },
  data() {
    return {
      data: [],
      scrollParams: {
        direction: 0,
        limitMoveNum: 3
      },
      colOptions: [
        { label: '名称', field: 'name' },
        { label: '开始时间', field: 'startDate' },
        {
          label: '进度(%)',
          field: 'progress',
          componentProps: { type: 'number' }
        },
        { label: '结束时间', field: 'endDate' }
      ]
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      const res = await fetchData();
      this.data = res.data;
    }
  }
};
</script>
```
