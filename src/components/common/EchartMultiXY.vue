<template>
  <div style="width: 100%; height: 100%"></div>
</template>

<script>
import { cloneDeep, merge } from 'lodash';
import * as echarts from 'echarts/core';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components';
import { BarChart, LineChart, ScatterChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
require('echarts/theme/macarons'); // echarts theme
import resize from '@/util/resize';
import { computeTextWidth } from '@/util';

echarts.use([
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DataZoomComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  ScatterChart,
  CanvasRenderer,
  UniversalTransition
]);

const animationDuration = 3000;

export default {
  name: 'EchartMultiXY',
  props: {
    // chartHeight: { type: Number, default: 600 },
    chartOpt: {
      type: Object,
      required: true,
      default: {
        title: {}, // 图表标题
        grid: {},
        tooltip: {},
        color: [],
        series: [
          { yIndex: 0, type: 'bar', name: '', itemStyle: {}, data: [1, 2, 3] }
        ],
        axis: {
          // 坐标轴维度 name
          x: [{ name: '', type: 'category', data: [] }],
          y: [{ name: '', type: 'value' }]
        }
      }
    }
  },
  mixins: [resize],
  data() {
    return {
      chart: null
    };
  },
  watch: {
    'chartOpt.series': {
      deep: true,
      handler: function (d) {
        d?.length && this.drawChart();
      }
    }
  },
  mounted() {
    this.chartOpt.series?.length && this.drawChart();
  },
  methods: {
    drawChart() {
      const len = this.chartOpt.series?.length;
      if (!len) {
        this.$message.info('暂无数据');
        this.clear();
        return;
      }

      const option = {
        title: {
          text: '',
          textStyle: {
            color: '#333',
            fontWeight: 'bold'
          }
        },
        grid: {
          top: 40,
          bottom: 20,
          left: 50,
          right: 50
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          backgroundColor: 'transparent',
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          type: 'scroll',
          top: 5,
          textStyle: {
            fontSize: 12
          }
        },
        xAxis: [],
        yAxis: [],
        series: []
      };

      const chartContainer = this.$el;
      const containerSize = chartContainer.getBoundingClientRect();
      const chart = echarts.init(chartContainer, 'macarons', {
        width: containerSize.width,
        height: containerSize.height
      });
      // // 监听屏幕变化自动缩放图表
      // window.addEventListener('resize', function () {
      //   chart.resize();
      // });

      option.title = merge(option.title, this.chartOpt?.title);
      option.legend = merge(option.legend, this.chartOpt?.legend);
      option.tooltip = merge(option.tooltip, this.chartOpt?.tooltip);

      if (this.chartOpt?.color) {
        option.color = this.chartOpt.color;
      }
      if (this.chartOpt?.visualMap) {
        option.visualMap = this.chartOpt.visualMap;
      }

      // 多轴
      const xData = []; // 存 xAxisLabel
      if (Array.isArray(this.chartOpt.axis?.x)) {
        const xAxis = [];
        this.chartOpt.axis.x.forEach((x) => {
          xAxis.push(x);
          x.data && xData.push(x.data);
        });
        option.xAxis = xAxis;
      } else {
        option.xAxis.push(...this.chartOpt.axis.x);
        this.chartOpt.axis.x.data && xData.push(...this.chartOpt.axis.x.data);
      }

      // 计算 chart size
      option.grid = merge(option.grid, this.chartOpt?.grid);
      option.grid.width =
        containerSize.width -
        (parseFloat(option.grid.left) + parseFloat(option.grid.right));

      xData.forEach((xLabelList, idx) => {
        const allLabelWidth = computeTextWidth(
          xLabelList.join(''),
          option.xAxis[idx]?.axisLabel?.fontSize ?? 12
        );
        if (allLabelWidth > option.grid.width) {
          option.xAxis[idx] = merge(option.xAxis[idx], {
            axisLabel: { rotate: 40 }
          });

          option.grid.bottom = 60;
        }
      });

      option.grid.height =
        containerSize.height -
        (parseFloat(option.grid.top) + parseFloat(option.grid.bottom));

      option.yAxis = this.chartOpt.axis.y;

      this.chartOpt.series.forEach((d, idx) => {
        const series = {
          animationDuration
        };
        option.series.push(merge(series, d));
      });

      // // chart 宽度
      // const chartW = this.chart.getWidth();
      // const categoryW = computeTextWidth(
      //   option.xAxis.data.join(),
      //   option.xAxis.axisLabel.fontSize
      // );

      // // 坐标轴长度 chart宽度 - margin 减去横向的 10%
      // const xAxisW = chartW * (1 - 0.1);
      // // 设置 x 轴 label 旋转
      // option.xAxis.axisLabel.rotate = categoryW > xAxisW ? 40 : 0;
      console.log('EchartMultiXY option:', option);
      chart.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped></style>
