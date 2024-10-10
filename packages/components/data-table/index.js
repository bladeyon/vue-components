import DataTable from './src/component.vue';

DataTable.install = function (Vue) {
  Vue.component(DataTable.name, DataTable);
};

export default DataTable;
