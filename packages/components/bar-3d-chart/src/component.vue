<template>
  <div
    ref="bar-chart"
    style="width: 100%; height: 100%"
  />
</template>

<script>
import { init as echartsInit } from 'echarts';
import { getTextWidth } from '#/index';

export default {
  name: 'Bar3DChart',
  props: {
    chartOptions: {
      type: Object,
      default: () => ({ title: '柱状图', data: [{ label: '', value: 0 }] })
    }
  },
  watch: {
    chartOptions: {
      deep: true,
      handler() {
        this.initChart();
      }
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      if (!this.chartOptions?.data?.length) {
        return;
      }
      const chartContainer = this.$refs['bar-chart'];
      const containerSize = chartContainer.getBoundingClientRect();
      const chart = echartsInit(chartContainer, {
        width: containerSize.width,
        height: containerSize.height
      });
      // 监听屏幕变化自动缩放图表
      window.addEventListener('resize', function () {
        chart.resize();
      });

      const yData = [];
      const xData = [];

      this.chartOptions.data?.forEach((item) => {
        xData.push(item.label);
        yData.push(item.value);
      });

      const grid = {
        top: '6%',
        bottom: '14%',
        left: '18%',
        right: '3%'
      };

      const gridWidth =
        containerSize.width *
        (1 - (parseFloat(grid.left) + parseFloat(grid.right)) / 100);
      const barWidth = (gridWidth / xData.length) * 0.35;

      const ratio = (barWidth - 16) / 16;

      const allLabelWidth = getTextWidth(xData.join(''), 14);
      let xRotate = 0;
      if (allLabelWidth > gridWidth) {
        xRotate = 40;
        grid.bottom = '24%';
      }

      grid.width = 100 - (parseFloat(grid.left) + parseFloat(grid.right)) + '%';
      grid.height =
        100 - (parseFloat(grid.top) + parseFloat(grid.bottom)) + '%';

      const option = {
        grid,
        xAxis: {
          axisLabel: {
            color: '#ffffff',
            interval: 0,
            rotate: xRotate,
            fontSize: 14
          },
          splitLine: { show: false },
          data: xData
        },
        yAxis: {
          // name: '数量(条)',
          axisLine: {
            show: true
          },
          axisLabel: { color: '#ffffff' },
          splitLine: { show: false }
        },
        tooltip: {
          trigger: 'item'
          // formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          // 因为图形拼接的原因 取消初始动画 animation: false,
          {
            // 顶
            name: this.chartOptions?.title,
            type: 'pictorialBar',
            itemStyle: {
              color: '#0282D3',
              borderColor: '#0282D3'
            },
            symbol: 'path://M6,0H22L16,4H0Z',
            symbolSize: [22 * (1 + ratio), 4 * (1 + ratio)],
            symbolPosition: 'end',
            symbolOffset: [0, -4 * (1 + ratio)],
            symbolRepeat: false,
            animation: false,
            data: yData
          },
          {
            // 右顶
            name: this.chartOptions?.title,
            type: 'pictorialBar',
            itemStyle: {
              color: '#64D4FF'
            },
            symbol: 'path://M6,0V4.1H0V4Z',
            symbolSize: [6 * (1 + ratio), 4.1 * (1 + ratio)],
            symbolPosition: 'end',
            symbolOffset: [8 * (1 + ratio), -4 * (1 + ratio)],
            animation: false,
            data: yData
          },
          {
            // 正视面
            name: this.chartOptions?.title,
            type: 'bar',
            animation: false,
            barWidth: barWidth,
            barGap: 0,
            z: 3,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#16B2FF' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#0B5FFF' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            },
            data: yData
          },
          {
            // 右视面
            name: this.chartOptions?.title,
            type: 'bar',
            animation: false,
            barWidth: 6 * (1 + ratio),
            barGap: 0,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#64D4FF' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#0B9CFF' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            },
            z: 3,
            data: yData
          }
        ]
      };
      chart.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped></style>
