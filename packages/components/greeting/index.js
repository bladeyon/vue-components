import Greeting from './src/component.vue';

Greeting.install = function (Vue) {
  Vue.component(Greeting.name, Greeting);
};

export default Greeting;
