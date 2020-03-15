import * as CONST from '../types'
/**
 *  点击 header 图标 收缩或展开侧边栏
 */
// 状态
const state = {
  isScale: false // 是否收缩  true 收缩 false 展开
}
// 处理事件
const mutations = {
  [CONST.TOGGLESCALE] () {
    state.isScale = !state.isScale
  }
}
// 获得值
const getters = {
  getScale: (state) => state.isScale
}
export default {
  state,
  mutations,
  getters
}
