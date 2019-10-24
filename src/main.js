// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import qs from 'qs'

axios.create({
  timeout: 50000, //配置请求超时时间
  withCredentials: true,
});

Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;

//自定义全局的消息提示
Vue.prototype.$getMessage = function (msg, type) {
  this.$message({
    showClose: true,
    message: msg,
    type: type,
    duration: 2000,//消息显示时间为2秒
  });
};

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
});
