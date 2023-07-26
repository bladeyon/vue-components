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
import { BarChart, LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
require('echarts/theme/macarons'); // echarts theme
import resize from '@/util/resize';

/**
 * 计算文本在屏幕上所占的宽度
 * @param {String} text - 文本
 * @param {Number} fontSize - 字体大小
 * @returns {Number}
 */
function computeTextWidth(text, fontSize = 12) {
  // const canvas = document.createElement('canvas');
  // const context = canvas.getContext('2d');
  // context.font = fontSize + 'px';
  // return context.measureText(text).width;
  const div = document.createElement('div');
  div.innerText = text;
  div;
  div.style.cssText = `font-size:${fontSize}px;display:inline-block;`;
  document.body.appendChild(div);
  const maxWidth = parseFloat(window.getComputedStyle(div).width);
  document.body.removeChild(div);
  return maxWidth;
}

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
        series: [{ yIndex: 0, type: 'bar', name: '', itemStyle: {}, data: [] }],
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
      chart: null,
      option: {
        title: {
          text: '',
          textStyle: {
            color: '#333',
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          backgroundColor: '#fff',
          textStyle: {
            color: '#000'
          }
        },
        // color: ["#ffb900", "#1ab13c", "#00b294", "#dff6dd"],
        legend: {
          type: 'scroll',
          // orient: 'vertical',
          top: 20,
          // bottom: 20,
          // right: 5,
          textStyle: {
            color: '#000',
            fontSize: 12
          }
        },
        grid: {
          left: '3%',
          right: '6%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0, // 标签间隔数：0 显示所有标签
            color: '#000',
            fontSize: 16,
            rotate: 0
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#009bff'
            }
          },
          boundaryGap: true,
          axisTick: {
            alignWithLabel: true // 刻度与标签对齐 boundaryGap 为 true 的时候有效
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#006c9d'
              // opacity: 0.5,
            }
          }
        },
        yAxis: [],
        series: []
      }
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
    this.chart = echarts.init(this.$el, 'macarons');
    this.chartOpt.series?.length && this.drawChart();
  },
  beforeDestroy() {
    this.chart.dispose();
  },
  methods: {
    clear() {
      this.chart.clear();
    },
    drawChart() {
      this.clear();

      const option = cloneDeep(this.option);
      const len = this.chartOpt.series?.length;
      if (!len) {
        this.$message.info('暂无数据');
        this.clear();
        return;
      }

      option.title = merge(option.title, this.chartOpt?.title);
      option.legend = merge(option.legend, this.chartOpt?.legend);
      option.grid = merge(option.grid, this.chartOpt?.grid);

      if (this.chartOpt?.color) {
        option.color = this.chartOpt.color;
      }

      // 多轴
      if (Array.isArray(this.chartOpt.axis?.x)) {
        const xAxis = [];
        this.chartOpt.axis.x.forEach((x) => {
          xAxis.push(merge(option.xAxis, x));
        });
        option.xAxis = xAxis;
      } else {
        option.xAxis = merge(option.xAxis, this.chartOpt.axis.x);
      }

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
      console.log(option);
      this.chart.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped></style>
