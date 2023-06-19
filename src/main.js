// import Vue from 'vue'
const Vue = require("vue")



import App from './App'
import router, { resetRouter } from './router'
import http from '@/util/http'
import serviceAPI from '@/service/index'
import '@/vendor/directives3'
import { constantRoutes, asyncRoutes } from "@/router/config"
import { filterAsyncRoutes, whiteList } from "@/util/permission"
import '../node_modules/echarts/map/js/world.js'
import { Message } from 'element-ui'
import DcStore from '@/store'
import DcUtils from '@/utils'
// 引入公共插件
import '@/plugins'

import '@/assets/icon/iconfont.css'
import '@/assets/custom.css'
import '@/assets/reset.css'
import '@/assets/styles/common.less'
//预览图片
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer)
Vue.config.devtools = true

Viewer.setDefaults({
  zIndex :9999,
  'inline': false, //启用inline模式
  'button': true, //显示右上角关闭按钮
  'navbar': true, //显示缩略图导航
  'title': false, //显示当前图片的标题
  'toolbar': false, //显示工具栏
  'tooltip': true, //显示缩略百分比
  'movable': true, //图片是否可移动
  'zoomable': true, //图片是否可缩放
  'rotatable': true, //图片是否可旋转
  'scalable': true, //图片是否可反转
  'transition': true, //使用css3过度
  'fullscreen': false, //播放时是否全屏
  'keyboard': true, //
})
Vue.config.productionTip = false
Vue.prototype.$message = Message
Vue.prototype.$service = serviceAPI
Vue.prototype.inputMax = 50
Vue.prototype.imgUrl = ''
// Vue.prototype.$confirm = MessageBox.confirm
//判断是否登录
router.beforeEach(async function (to, from, next) {
  DcStore.commit('SET_AUTH_FIELDS', JSON.parse(sessionStorage.getItem('authFields')))
  if (whiteList.includes(to.path)) {
    try {
      await DcUtils.loginFormMobile(to)
    } catch (error) { }
    //从cookie中获取用户信息，判断是否已登录
    var tokenId = sessionStorage.getItem('tokenId')
    // console.log(UserID)
    if (tokenId) {
      DcStore.dispatch("getCurrencyTypes");
      DcStore.dispatch("getMenuCountInfo");
      if (router.options.routes.length > 3) {
        next()
      } else {
        /******权限******/
        const noAuthCodes = JSON.parse(sessionStorage.getItem('noAuthCodes')) || []
        let currentRoutes = []
        currentRoutes = filterAsyncRoutes(asyncRoutes, noAuthCodes)
        router.options.routes = constantRoutes.concat([...currentRoutes])  // menu
        resetRouter()
        router.addRoutes([...currentRoutes])
        // if(roleName == '客服-罗新'){
        //   next('/workOrder/serviceWorkOrder'+this.$route.query.id?`?id=${this.$route.query.id}`:'')
        // }
        /******权限******/
        // else {
        next({ ...to });
        // }
      }
    } else {
      //未登录
      //next可以传递一个路由对象作为参数 表示需要跳转到的页面
      router.replace({
        path: '/',
        query: { redirect: to.fullPath }
      })
    }

  } else {
    if (to.path === "/" || to.path === "/login") {
      sessionStorage.clear()
      router.options.routes = constantRoutes
    }
    next()
  }
});




Vue.use(http)

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store: DcStore,
})
