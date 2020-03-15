import { appRouter, otherRouter } from '../../router/router'
import utils from '../../commons/utils'
import * as CONST from '../types'
const state = {
  // 当前页面的名字
  currentPageName: '',
  // 当前页面路径
  currentPath: [{
    title: '首页',
    name: 'home_index',
    path: ''
  }],
  // 已打开的页面列表
  pageOpenedList: [{
    title: '首页',
    name: 'home_index',
    path: ''
  }],
  themeColor: 'b', //
  // 菜单列表
  menuList: [],
  // 主题样式
  menuTheme: 'dark',
  // 使用语言
  menuLanguage: 'zh-cn',
  // 要展开的菜单列表
  openedSubmenuArr: [],
  // tag列表
  tabList: [...otherRouter.children],
  // 路由信息
  routers: [
    otherRouter,
    ...appRouter
  ]
}
const mutations = {
  [CONST.UPDATEMENULIST] (state) { // 更新菜单列表
    let accessCode = +window.localStorage.getItem('access')
    let menuList = []
    appRouter.map((item, index) => {
      if (item.access !== undefined) {
        let flag = utils.showRouter(item.access, accessCode)
        if (flag) {
          if (item.children.length === 1) {}
          menuList.push(item)
        } else {
          let len = menuList.push(item)
          let childArr = []
          childArr = item.children.filter(child => {
            if (child.access !== undefined) {
              if (child.access === accessCode) {
                return child
              }
            } else {
              return child
            }
          })
          menuList[len - 1].children = childArr
        }
      } else {
        if (item.children.length === 1) {
          menuList.push(item)
        } else {
          menuList.push(item)
          let len = menuList.length
          let childArr = []
          childArr = item.children.filter(child => {
            if (child.access !== undefined) {
              let flag = utils.showRouter(child.access, accessCode)
              if (flag) {
                return child
              }
            } else {
              return child
            }
          })
          if (childArr === undefined || childArr.length === 0) {
            menuList.splice(len - 1, 1)
          } else {
            let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]))
            handledItem.children = childArr
            menuList.splice(len - 1, 1, handledItem)
          }
        }
      }
    })
    state.menuList = menuList
  },
  [CONST.PAGEOPENLIST] (state, data) { // 将打开的菜单添加到 tab 中  并保存至本地缓存
    let openedPage = state.pageOpenedList[data.index]
    if (data.argu) {
      openedPage['argu'] = data.argu
    }
    if (data.query) {
      openedPage['query'] = data.query
    }
    /**
     *  splice() 用法 向数组中删除或添加元素
     *  当只有两个参数时 splice(index, 1) 删除数据中 index 位置的元素 返回被删除的元素
     *  当有三个参数时 splice(index, 1, item) 将指定位置的元素用新元素替换
     */
    state.pageOpenedList.splice(data.index, 1, openedPage)
    window.localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
  },
  [CONST.MENUTHEME] (state, data) {
    state.menuTheme = data.value
  },
  [CONST.CHANGEMENUTHEME] (state, data) { // 改变菜单样式
    state.menuTheme = data.value
  },
  [CONST.CHANGEMAINTHEME] (state, data) { // 改变菜单样式
    state.mainTheme = data.value
  },
  [CONST.CLEAROPENEDSUBMENU] (state) { // 清除 tab 内容
    state.openedSubmenuArr.length = 0
  },
  [CONST.INCREATETAB] (state, data) { // 添加 tab 标签
    state.pageOpenedList = window.localStorage.pageOpenedList ? JSON.parse(window.localStorage.pageOpenedList) : [otherRouter.children[0]]
    let index = -1
    state.pageOpenedList.filter((item, i) => {
      if (item.name === data.name) {
        index = i
      }
    })
    index > -1 ? state.pageOpenedList.splice(index, 1, data) : state.pageOpenedList.push(data)
    window.localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
  },
  [CONST.SETCURRENTPAGENAME] (state, name) { // 设置当前 页面名
    state.currentPageName = name
  },
  [CONST.SETCURRENTPATH] (state, data) { // 设置当前路径
    state.currentPath = data
    window.localStorage.currentPath = JSON.stringify(data)
  },
  [CONST.SETOPENSUBMENU] (state, name) { // 设置打开子菜单
     let hasOpenName = false
     let isEmpty = false
     if (name.length === 0) isEmpty = true
     if (state.openedSubmenuArr.includes(name)) hasOpenName = true
     if (!isEmpty && !hasOpenName) {
       state.openedSubmenuArr.push(name)
     }
  },
  [CONST.SETOPENEDLIST] (state) {
    state.pageOpenedList = window.localStorage.pageOpenedList ? JSON.parse(window.localStorage.pageOpenedList) : [otherRouter.children[0]]
  },
  [CONST.SETTABLIST] (state, tabs) { // 设置标签列表
    state.tabList.push(...tabs)
  },
  [CONST.REMOVETAB] (state, name) { // 移除标签
    state.pageOpenedList.map((item, index) => {
      if (item.name === name) {
        state.pageOpenedList.splice(index, 1)
      }
    })
    window.localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
  },
  // 关闭页面
  [CONST.CLOSEPAGE] (state, name) {}
}
const getters = {
  getCurrentPath: (state) => state.currentPath,
  getMenuList: (state) => state.menuList,
  getOpenedSubmenuArr: (state) => state.openedSubmenuArr,
  getPageOpenedList: (state) => state.pageOpenedList
}
const actions = {}

export default {
  state,
  mutations,
  getters,
  actions
}
