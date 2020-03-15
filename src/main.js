// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { router } from './router'
import { appRouter } from './router/router'
import store from './store'
import iView from 'iview'
import * as CONST from './store/types'
import 'iview/dist/styles/iview.css'
import uploader from 'vue-simple-uploader'

Vue.config.productionTip = false
Vue.use(iView)
Vue.use(uploader)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    let tabList = []
    appRouter.map((item) => {
      if (item.children.length === 1) {
        tabList.push(item.children[0])
      } else {
        tabList.push(...item.children)
      }
    })
    this.$store.commit(CONST.SETTABLIST, tabList)
  },
  mounted () {
    this.$store.commit(CONST.SETOPENEDLIST)
    this.$store.commit(CONST.UPDATEMENULIST)
  }
})
