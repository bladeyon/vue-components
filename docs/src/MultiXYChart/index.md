# MultiXYChart

多维度图

## 属性

| 属性     | 说明 | 类型   | 默认值 | 可选值 |
| -------- | ---- | ------ | ------ | ------ |
| chartOpt | 配置 | object | -      | -      |

### chartOpt 属性

| 属性    | 说明     | 类型   | 默认值                                                                                                           | 可选值                       |
| ------- | -------- | ------ | ---------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| title   | 标题     | Object | \{ text: '', textStyle: \{ color: '#333',fontWeight: 'bold' \} \}                                                | -                            |
| grid    | 网格布局 | Object | \{ top: 40,bottom: 20,left: 50,right: 50\}                                                                       | -                            |
| tooltip | 提示框   | object | \{ trigger: 'axis',axisPointer: \{type: 'shadow'\},backgroundColor: 'transparent',textStyle: \{color: '#fff'\}\} | -                            |
| color   | 颜色     | array  | []                                                                                                               | -                            |
| series  | 图表     | array  | [\{yAxisIndex: 0,type: 'bar',name: '',itemStyle: \{\},data: [1, 2, 3]\}]                                         | `type` 取 echarts 的图表类型 |
| axis    | 轴       | Object | \{x: [\{ name: '', type: 'category', data: [] \}],y: [\{ name: '', type: 'value' \}]\}                           | -                            |

## 示例

```vue
<template>
  <MultiXYChart
    :chart-options="chartOptions"
  />
</template>

<script>
import { MultiXYChart } from 'vue-components';

export default {
  name: 'MultiXYChartUI',
  components: { MultiXYChart },
  data() {
    return {
      chartOptions: {
        title: {text:'销售额'},
        color: [
          '#5B8FF9',
          '#5AD8A6',
          '#5D7092',
          '#F6BD16',
          '#E8684A',

        ],
        series: [
          {
            yAxisIndex: 0,
            type: 'line',
            name: '销售额',
            itemStyle: {},
            data: [1, 2, 3]
          }
        ],
        axis: {
          x: [{ name: '', type: 'category', data: ['周一', '周二', '周三'] }],
          y: [{ name: '', type: 'value' }]
        }
      }
    }
  }
}
```
