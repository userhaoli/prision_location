import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import "normalize.css";
import "@/styles/common.less";
import "@/assets/fonts/iconfont.css";
import { Pagination,Form,DatePicker,TimeSelect,Switch,Table} from  'element-ui';
Vue.use(Pagination);
Vue.use(Form);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(Switch);
Vue.use(Table);



Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
