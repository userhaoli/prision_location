import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import "normalize.css";
import "@/styles/common.less"
import { Pagination,Form,DatePicker,TimeSelect} from  'element-ui';
Vue.use(Pagination);
Vue.use(Form);
Vue.use(DatePicker);
Vue.use(TimeSelect);

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
