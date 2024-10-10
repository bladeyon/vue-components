import CRUDPage from './src/component.vue';

CRUDPage.install = function (Vue) {
  Vue.component(CRUDPage.name, CRUDPage);
};

export default CRUDPage;
