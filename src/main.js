// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import qs from 'qs'
import Cookies from 'js-cookie'
import fastdfsUrl from "./fastdfsUrl"
import VueDraggableResizable from 'vue-draggable-resizable'
// 可选择导入选择样式
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
//无限滚动
import infiniteScroll from 'vue-infinite-scroll'
import uuid from "./uuid";

axios.defaults.withCredentials = true
axios.create({
  timeout: 50000, //配置请求超时时间
});

Vue.use(ElementUI);
Vue.use(infiniteScroll);
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
Vue.prototype.uuid = uuid;
//操作cookie
Vue.prototype.$Cookies = Cookies;
Vue.prototype.$fastdfsUrl = fastdfsUrl;
//全局注册拖动组件
Vue.component('vue-draggable-resizable', VueDraggableResizable)

//Axios请求拦截器，这是对token的拦截
axios.interceptors.request.use(config => {
  let token = Cookies.get('token');
  let username = Cookies.get('username');
  //判断是否存在token，如果存在的话，则每个http header都加上token
  if (token && username) {
    config.headers.Authorization ="Bearer " + token;
    config.headers.username = username;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// axios请求，对所有的http以及自定义状态码进行相应
axios.interceptors.response.use(response => {

  //对自定义请求为500的错误进行操作
  if (response.data.code !== 200) {
    //如果是请求pdf，直接走fastdfs路线
    if (response.status === 200 && response.data.type === 'application/pdf') {
      return response;
    }
    ElementUI.Message({
      message: response.data.data,
      showClose: true,
      type: 'error'
    });
    return response;
  }
  return response;
}, error => {
  if (error.response) {
    //从网关响应的
    if (error.response.status === 610) {
      console.log('从response中获取的newtoken---->' + error.response.data);
      Cookies.set('token', error.response.data);
      setTimeout(() => {
        location.reload();
      }, 1000);//刷新当前页面
      return false;
    }

    if (error.response.status === 401 || error.response.status === 402) {
      ElementUI.Message({
        message: error.response.data,
        showClose: true,
        type: 'error'
      });
      setTimeout(() => {
        router.push({path: '/login'});
      }, 1500);
    } else if (error.response.status === 407) {

    } else {
      ElementUI.Message({
        message: '服务器内部出现异常,请稍后再次尝试',
        showClose: true,
        type: 'error'
      });
    }
  }
  return Promise.reject(error.response.data)   // 返回接口返回的错误信息
});


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
