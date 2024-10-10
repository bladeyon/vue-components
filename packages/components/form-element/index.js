import FormElement from './src/component.vue';

FormElement.install = function (Vue) {
  Vue.component(FormElement.name, FormElement);
};

export default FormElement;
