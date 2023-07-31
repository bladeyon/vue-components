<template>
  <div style="width: 100%; height: 100%"></div>
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
        legend: {
          enabled: true,
          layout: 'vertical',
          width: 100,
          align: 'right',
          verticalAlign: 'middle'
        },
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
              allowOverlap: false,

            },
            opacity: 1,
            center: ['50%', '50%']
          }
        },
        series: []
      };

      options = merge(options, this.chartOpt);
      console.log(options);
      Highcharts.chart(this.$el, options);
    }
  }
};
</script>

<style lang="scss" scoped></style>
