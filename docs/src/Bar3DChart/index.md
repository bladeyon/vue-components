# Bar3DChart

3D 柱状图

## 属性

| 属性         | 说明 | 类型   | 默认值 | 可选值 |
| ------------ | ---- | ------ | ------ | ------ |
| chartOptions | 配置 | object | -      | -      |

### chartOptions 属性

| 属性  | 说明 | 类型   | 默认值                        | 可选值 |
| ----- | ---- | ------ | ----------------------------- | ------ |
| data  | 数据 | array  | \[\{ label: '', value: 0 \}\] | -      |
| title | 标题 | string | '柱状图'                      | -      |

## 示例

```vue
<template>
  <Bar3DChart
    :chart-options="chartOptions"
  />
</template>

<script>
import { Bar3DChart } from 'vue-components';

export default {
  name: 'Bar3DChartUI',
  components: { Bar3DChart },
  data() {
    return {
      chartOptions: {
        title: '销售额',
        data: [
          { label: '周一', value: 100 },
          { label: '周二', value: 120 },
          { label: '周三', value: 140 },
          { label: '周四', value: 160 },
          { label: '周五', value: 180 }
        ]
      }
    }
  }
}
```
