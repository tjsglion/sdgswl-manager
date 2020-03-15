import Vue from 'vue'
import iView from 'iview'
import Router from 'vue-router'
import store from '../store'
import { routers } from './router'
import * as CONST from '../store/types'
import qs from 'qs'
import utils from '.././commons/utils'
Vue.use(Router)

export const router = new Router({
  routes: routers
})

// 页面刷新时 设置token
if (window.localStorage.getItem('token')) {
  store.commit({
    type: CONST.LOGININ,
    token: window.localStorage.getItem('token')
  })
}
// 设置用户信息
if (window.localStorage.getItem('userInfo')) {
  store.commit({
    type: CONST.SETUSERINFO,
    operinfo: qs.parse(window.localStorage.getItem('userInfo'))
  })
}
// 添加token 验证
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (store.state.login.token) { // 如果token存在 跳过
      next()
    } else { // token 不存在时, 跳转至登录
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
     // const curRouterObj = utils.getRouterByName(routers, to.name)
    // console.log(curRouterObj)
    // 需要授权的页面在下边编写  默认访问 access的值 由后台返回具体值
    // todo
    // 没有权限说明的 走下边
     utils.toDefaultPage(routers, to.name, router, next)
  }
})

router.afterEach(to => {
  utils.openNewPage(router.app, to.name, to.params, to.query)
  iView.LoadingBar.finish()
  window.scroll(0, 0) // 滚动到顶部
})
