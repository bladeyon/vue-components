import Vue from 'vue';
import App from './src/App.vue';
import router from './src/router';
import '@/style/index.scss';
// import VueCpts from '~/index';
import VueCpts from 'lib/vue2components.es.js';
// console.log(VueCpts);
Vue.use(VueCpts, { size: 'small' });

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
