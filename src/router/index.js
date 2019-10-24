import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import home from '@/pages/Home'
import login from '../pages/login/login'
import Welcome from "../pages/Welcome";
import user from "../pages/user/user";
import role from "../pages/role/role";
import permission from "../pages/permission/permission";
import menu from "../pages/menu/menu";
import errorinfo from '../pages/err/404'

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'otherRouter',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    //总体布局页面
    {
      path: '/home',
      name: 'home',
      component: home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          name: Welcome,
          component: Welcome
        },
        {
          path: '/role',
          name: role,
          component: role
        },
        {
          path: '/permission',
          name: 'permission',
          component: permission
        },
        {
          path: '/menu',
          name: 'menu',
          component: menu,
        },
      ]
    },
    //后台管理页面路由
    {
      path: '/user',
      name: 'user',
      title: '用户管理',
      component: home,
      children: [
        {
          path: 'manage',
          name: 'manage',
          title: '用户信息',
          component: user
        }
      ]
    },
    //404page
    {
      path: '*',
      name: 'errorinfo',
      component: errorinfo
    }
  ]
});

// router.beforeEach((to, from, next) => {
//   if (to.matched.length === 0) {  //如果未匹配到路由
//     from.path ? next({path: from.path}) : next('/errorinfo');   //如果上级也未匹配到路由则跳转主页面，如果上级能匹配到则转上级路由
//   } else {
//     next();    //如果匹配到正确跳转path
//   }
// });

export default router;
