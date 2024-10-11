import MultiXYChart from './src/component.vue';

MultiXYChart.install = function (app) {
  app.component(MultiXYChart.name, MultiXYChart);
};

export default MultiXYChart;
