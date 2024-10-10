import '~/assets/css/custom.scss';
import '~/element-components';
// 功能类
import QueryForm from '~/components/query-form/index';
import Greeting from '~/components/greeting/index';
import DataTable from '~/components/data-table/index';
import TreeTable from '~/components/tree-table/index';
import FormDialog from '~/components/form-dialog/index';
import ScrollTable from '~/components/scroll-table/index';
import CRUDPage from '~/components/crud-page/index';

const components = [
  QueryForm,
  Greeting,
  DataTable,
  TreeTable,
  FormDialog,
  ScrollTable,
  CRUDPage
];

const install = function (Vue, opts = {}) {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });

  Vue.prototype.$ELEMENT = {
    size: opts.size || '',
    zIndex: opts.zIndex || 2000
  };
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default install;
export {
  QueryForm,
  Greeting,
  DataTable,
  TreeTable,
  FormDialog,
  ScrollTable,
  CRUDPage
};
