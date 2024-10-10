import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const routes = [
  { path: '/table-page', component: () => import('../views/TablePage.vue') }
];

const router = new VueRouter({
  routes
});

export default router;
