import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import "normalize.css";
import "@/styles/common.less";
import "@/assets/fonts/iconfont.css";
import 'element-ui/lib/theme-chalk/index.css';
import { Pagination,Form,DatePicker,TimeSelect,Switch,Table,Checkbox,CheckboxGroup } from  'element-ui';
Vue.use(Pagination);
Vue.use(Form);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(Switch);
Vue.use(Table);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);



Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
