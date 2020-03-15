import * as CONST from '../store/types'
let utils = {}

// 判断当前元素是数据中的指定一项
utils.oneOf = function (ele, arr) {
  for (let i = 0, len = arr.length; i < len; i++) {
    if (ele === arr[i]) {
      return true
    }
    return false
  }
}
// 根据权限 是否显示路由
utils.showRouter = function (access, accessCode) {
  if (typeof access === 'object' && Array.isArray(access)) {
    return utils.oneOf(accessCode, access)
  } else {
    return access === accessCode
  }
}
// 根据name 获取路由对象
utils.getRouterByName = function (routers, name) {
  if (!routers || !name || !routers.length) {
    return null
  }
  let routerObj = null
  for (let i = 0, len = routers.length; i < len; i++) {
    let el = routers[i]
    if (el.name === name) {
      return el
    }
    routerObj = utils.getRouterByName(el.children, name)
    if (routerObj) {
      return routerObj
    }
  }
  return null
}
// 设置面包屑中的内容 即当前打开的页面
utils.setCurrentPath = function (vm, name) {
  let title = ''
  let isOtherRouter = false
  // 循环路由 获取当前路由对应的 title
  vm.$store.state.main.routers.forEach(item => {
    if (item.children.length === 1) {
      if (item.children[0].name === name) {
        title = item.title
        if (item.name === 'otherRouter') {
          isOtherRouter = true
        }
      }
    } else {
      item.children.forEach(child => {
        if (child.name === name) {
          title = child.title
          if (item.name === 'otherRouter') {
            isOtherRouter = true
          }
        }
      })
    }
  })
  // 获取当前name 对应的路由数组
  let currentPathArr = []
  if (name === 'home_index') { // 当打开的页面是 首页时  path为'' 即面包屑不可点击
    currentPathArr = [{
      name: 'home_index',
      path: '',
      title: '首页'
    }]
  } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') { // 打开的页面 但当前页面不在侧边栏中显示
    currentPathArr = [{
      name: 'home_index',
      path: '/home',
      title: '首页'
    }, {
      name: name,
      path: '',
      title: title
    }]
  } else { // 打开的页面位于侧边栏中时
    let currentPathObj = vm.$store.state.main.routers.filter((item) => {
      if (item.children.length === 1) { // 侧边栏中菜单列中没有子菜单时
        return item.children[0].name === name
      } else {
        let i = 0
        let childArr = item.children
        let len = childArr.length
        while (i < len) {
          if (childArr[i].name === name) {
            return true
          }
          i++
        }
        return false
      }
    })[0] || []
    if (currentPathObj.children.length === 1 && currentPathObj.name === 'home') {
      currentPathArr = [{
        name: 'home_index',
        path: '',
        title: '首页'
      }]
    } else if (currentPathObj.children.length === 1 && currentPathObj.name !== 'home') {
      currentPathArr = [{
        name: 'home_index',
        path: '/home',
        title: '首页'
      }, {
        name: currentPathObj.name,
        path: '',
        title: currentPathObj.title
      }]
    } else {
      let childObj = currentPathObj.children.filter((child) => { // 处理有下拉列表的菜单 对应的下拉标题不可点击 其下拉列表才可点击
        return child.name === name
      })[0] || []
      currentPathArr = [{
        name: 'home_index',
        path: '/home',
        title: '首页'
      }, {
        name: currentPathObj.name,
        path: '',
        title: currentPathObj.title
      }, {
        name: childObj.name,
        path: currentPathObj.path + '/' + childObj.path,
        title: childObj.title
      }]
    }
  }
  // 设置当前路径
  vm.$store.commit(CONST.SETCURRENTPATH, currentPathArr)
  return currentPathArr
}
/***
 *  打开新页面
 * @param vm  Vue实例
 * @param name  路由的 name
 * @param argu
 * @param query
 * 该方法 只对不在菜单中的 路由有效
 */
utils.openNewPage = function (vm, name, argu, query) {
  // 获取当前已经打开的页面 如果需要打开的页面已在打开的列表中时 将当前页面提取到最上层 如果不存在 则将添加当前需要打开的页面
  let pageOpenedList = vm.$store.state.main.pageOpenedList
  let openedPageLen = pageOpenedList.length
  let i = 0
  let tabHasOpened = false // 页面屑是否打开的标志
  while (i < openedPageLen) {
    if (name === pageOpenedList[i].name) { // 页面已打开
      vm.$store.commit(CONST.PAGEOPENLIST, {
        index: i,
        argu: argu,
        query: query
      })
      tabHasOpened = true
      break
    }
    i++
  }
  if (!tabHasOpened) {
    // filter 函数： 返回满足条件的数组项
    let tab = vm.$store.state.main.tabList.filter((item) => {
      if (item.children) { // 如果当前路由下还有子路由 默认加载第一个
        return name === item.children[0].name
      } else {
        return name === item.name
      }
    })
    tab = tab[0]
    if (tab) {
      tab = tab.children ? tab.children[0] : tab
      if (argu) {
        tab.argu = argu
      }
      if (query) {
        tab.query = query
      }
      vm.$store.commit(CONST.INCREATETAB, tab)
    }
  }
  vm.$store.commit(CONST.SETCURRENTPAGENAME, name)
}

// 跳转至默认页面
utils.toDefaultPage = function (routers, name, route, next) {
  let len = routers.length
  let i = 0
  let flag = true
  while (i < len) {
    let el = routers[i]
    if (el.name === name && el.children && el.children.redirect === undefined) {
      route.replace({
        name: el.children[0].name
      })
      flag = false
      next()
      break
    }
    i++
  }
  if (flag) {
    next()
  }
}
export default utils
