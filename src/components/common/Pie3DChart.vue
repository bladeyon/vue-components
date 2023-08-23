<template>
  <div style="width: 100%; height: 100%; position: relative"></div>
</template>

<script>
import { merge } from 'lodash';
import Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';

Highcharts3D(Highcharts);

export default {
  name: 'Pie3D',
  props: {
    chartOpt: Object,
    default() {
      return {
        series: [
          {
            data: [
              { name: '水位标高', y: 720, color: '#ee3f4d' },
              { name: '涌水量', y: 500, color: '#d6a01d' },
              { name: '水质', y: 360, color: '#2177b8' },
              { name: '压力', y: 240, color: '#45b787' },
              { name: '微震', y: 200, color: '#813c85' }
            ]
          }
        ]
      };
    }
  },
  watch: {
    chartOpt: {
      deep: true,
      handler(n) {
        this.init();
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let options = {
        chart: {
          backgroundColor: 'transparent',
          type: 'pie',
          options3d: {
            enabled: true,
            alpha: 50
          }
        },
        title: {
          text: ''
        },
        credits: { enabled: false },
        tooltip: {
          shape: 'rect',
          followPointer: true,
          shadow: false,
          // borderColor: '#f03f9c',
          borderWidth: 1.5,
          backgroundColor: '#000000ee',
          useHTML: true,
          // formatter: function () {
          //   // prettier-ignore
          //   return `<i style="display:inline-block;background-color: ${ this.color }; border-radius:50%;padding:5px;"></i>
          //     ${this.key}: <span style="margin: 0 5px;">${ this.y }</span><b>${this.percentage.toFixed(1)}%</b>`;
          // },
          style: {
            color: '#eee'
          }
        },
        plotOptions: {
          pie: {
            // showInLegend: true,
            stickyTracking: true,
            minSize: 90,
            depth: 35,
            // innerSize: '60%',
            startAngle: 135,
            dataLabels: {
              enabled: true,
              // align: 'left',
              verticalAlign: 'middle',
              // format: '<b>{point.name}</b>', // ({point.y})
              color: '#fff', // (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
              allowOverlap: false
            },
            opacity: 1,
            center: ['50%', '50%']
          }
        },
        series: []
      };

      options = merge(options, this.chartOpt);
      const chart = Highcharts.chart(this.$el, options);

      // 3d 饼图没有legend 自己生成
      if (this.chartOpt.legend?.enabled) {
        // const chart = Highcharts.charts[0];
        // if (!chart) {
        //   return;
        // }
        const legendPosition = this.chartOpt.legend;
        const legendContainer = document.createElement('ul');
        // prettier-ignore
        legendContainer.style.cssText = `position: absolute;
                                         top:${legendPosition.top ?? 'auto'};
                                         bottom:${legendPosition.bottom ?? 'auto' };
                                         left:${legendPosition.left ?? 'auto'};
                                         right:${legendPosition.right ?? 'auto'};
                                         display: flex;
                                         flex-direction: ${legendPosition.layout === 'vertical' ? 'column' : 'row'};`;

        !!chart.series?.length &&
          chart.series[0]?.data.forEach(function (point) {
            const legendItem = document.createElement('li');
            legendItem.style.cssText =
              'margin-bottom: 5px;display: flex;align-items: center;';
            const icon = document.createElement('i');
            icon.style.cssText = `display:inline-block;width: 12px;height: 12px;margin-right:5px;background-color:${point.color};`;
            const label = document.createElement('span');
            label.style.cssText = `color:${point.color};`;
            label.textContent = `${point.name} ${point.subName}`;
            legendItem.appendChild(icon);
            legendItem.appendChild(label);
            legendContainer.appendChild(legendItem);
          });

        this.$el.appendChild(legendContainer);
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
