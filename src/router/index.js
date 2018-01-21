import Vue from 'vue'
import Router from 'vue-router'

const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    meta : `{ role: [0] }`  will control the page role
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: _import('login/index'), hidden: true},
  {path: '/404', component: _import('404'), hidden: true},

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index')
    }]
  },

  {
    path: '/dashboard',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'dashboard',
        component: _import('dashboard/index'),
        meta: {title: '首页', icon: 'dashboard'}
      }
    ]
  }
]

export const asyncRouterMap = [
  {
    path: '/user',
    component: Layout,
    redirect: 'table',
    name: 'User',
    meta: {title: '用户管理', icon: 'peoples', role: [0]},
    children: [
      {
        path: 'table',
        name: 'Table',
        component: _import('user/userTable'),
        meta: {title: '用户列表', icon: 'table', role: [0]}
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

