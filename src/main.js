import Vue from 'vue';
import App from './App.vue';
import router from "./router";
import store from "./store";
import config from "./config";
import axios from './httpConfig/http.js'
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);

Vue.config.productionTip = false
Vue.prototype.config = config
Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
