import Vue from 'vue';
import dialogDrag from './directives/dialog-drag/index';

import {
  Form,
  FormItem,
  Input,
  Select,
  Option,
  Popover,
  Tree,
  DatePicker,
  Radio,
  RadioGroup,
  Switch,
  Cascader,
  Upload,
  Button,
  Checkbox,
  Table,
  TableColumn,
  Pagination,
  Tooltip,
  Dialog,
  Message,
  MessageBox
} from 'element-ui';

// Message 和 MessageBox 都没有 install 方法，而程序中一般都调用当前组件上的，通过原型链找到 Vue 原型上的方法
Message.install = function (Vue) {
  Vue.prototype.$message = Message;
};

MessageBox.install = function (Vue) {
  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
};

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Popover);
Vue.use(Tree);
Vue.use(DatePicker);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Switch);
Vue.use(Cascader);
Vue.use(Upload);
Vue.use(Button);
Vue.use(Checkbox);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Tooltip);
Vue.use(Dialog);
Vue.use(Message);
Vue.use(MessageBox);

Vue.directive('dialog-drag', dialogDrag); // 对话框拖动
