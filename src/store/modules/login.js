import * as CONST from '../types'
import qs from 'qs'
const state = {
  token: null,
  userInfo: qs.stringify(window.localStorage.getItem('userInfo')) || {},
  realName: qs.stringify(window.localStorage.getItem('realName')) || '', // 用户名
  userName: qs.stringify(window.localStorage.getItem('userName')) || ''
}

const mutations = {
  [CONST.LOGININ] (state, data) {
    // 设置token
    state.token = data.token
    window.localStorage.setItem('token', data.token)
  },
  [CONST.LOGINOUT] (state, data) {
    // 退出 清空token
    state.token = null
    window.localStorage.removeItem('token')
  },
  [CONST.SETUSERINFO] (state, data) {
    // 保存用户信息
    state.userInfo = data.operinfo
    // state.realName = data.operinfo.realname
    state.userName = data.operinfo.userName
    // window.localStorage.setItem('userName', state.userName)
    window.localStorage.setItem('userInfo', qs.stringify(data.operinfo))
  }
}

const actions = {
  [CONST.LOCATIONTOKEN] ({ commit }, data) {
    commit(CONST.LOGININ, data)
  },
  [CONST.SETUSERINFO] ({commit}, data) {
    commit(CONST.SETUSERINFO, data)
  }
}

const getters = {
  getToken: (state) => state.token,
  getUserName: (state) => state.userName
}

export default {
  state,
  mutations,
  actions,
  getters
}
