import axios from 'axios'
import iView from 'iview'
// import qs from 'qs'
import store from '../store'
import { router } from '../router'
import * as CONST from '../store/types'
import { URLS } from './url'

// 设置请求超时时长
axios.defaults.timeout = 500000
// 表单提交 post 方式
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.headers.post['Content-Type'] = 'application/json'
// 提交 url
axios.defaults.baseUrl = URLS.BASEURL

// 定义请求拦截器
axios.interceptors.request.use((config) => {
  // post 提交时 将请求数据 序列化
  if (config.method.toLowerCase() === 'post') {
    // config.data = qs.stringify(config.data)
  }
  // 判断是否存在 token 存在的话 则每个 http header 都加上 token
  // todo
  if (store.state.login.token) {
    // config.headers.Authorization = `token ${store.state.login.token}`
  }
  return config
}, (error) => { // 失败时
  return Promise.reject(error)
})

// 定义响应拦截器
axios.interceptors.response.use((res) => {
  // 返回 状态 判断  res.data.success
  // todo
  // console.log('response============', res)
  // if (res.data.head.errcode === '991004') { // 无效 token 时 跳转至登录页面
  //  store.commit(CONST.LOGINOUT)
  //  router.replace({
  //    path: '/login',
  //    query: {
  //      redirect: router.currentRoute.fullPath
  //    }
  //  })
  // } else {
  //  return res
  // }
  return res
}, (error) => {
  // 当返回 401时 跳转至登录
  if (error.response) {
    switch (error.response.status) {
      case 401: // 未授权时
        store.commit(CONST.LOGINOUT)
        router.replace({
          path: '/login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
    }
  }
  return Promise.resolve(error)
})

// 统一 post 接口调用
export function fetch (url, params) {
  iView.LoadingBar.start()
  return new Promise((resolve, reject) => {
    let handleResponse = function (resolve, response) {
      // const _head = response.headers
      // let _head = response.data.head
      //   let _body = response.data.body
      //   if (_head.errcode === '991004' || !_body) {
      //     store.commit(CONST.LOGINOUT)
      //     router.replace({
      //       path: '/login',
      //       query: {
      //         redirect: router.currentRoute.fullPath
      //       }
      //     })
      //   } else {
      //     console.log(`调用${url}返回的数据:`, response)
      //     let result = response.data
      //     if (+result.head.errcode === 0) {
      //       resolve(result)
      //     } else if (result.head.errcode === '991004') { // token 失效
      //       reject(result.head)
      //     } else {
      //       reject(result.head)
      //     }
      //   }
      const _body = response.data
      const _status = response.status
      if (_status !== 200) {
        store.commit(CONST.LOGINOUT)
        router.replace({
          path: '/login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
      } else {
        // console.log(`调用${url}返回的数据:`, response)
        resolve(_body)
      }
    }
    if (!params) {
      axios.get(url)
      .then(response => {
        iView.LoadingBar.finish()
        handleResponse(resolve, response)
      }, err => {
        iView.LoadingBar.error()
        // console.log(`调用${url}错误:`, err)
        reject(err)
      }).catch((error) => {
        iView.LoadingBar.error()
        // console.log(`调用${url}异常:`, error)
        reject(error)
    })
    } else {
      axios.post(url, params)
      .then(response => {
        iView.LoadingBar.finish()
        // 调用接口返回的数据
        handleResponse(resolve, response)
      }, err => {
        iView.LoadingBar.error()
        // console.log(`调用${url}错误:`, err)
        reject(err)
      }).catch((error) => {
        iView.LoadingBar.error()
        // console.log(`调用${url}异常:`, error)
        reject(error)
    })
    }
  })
}

// 封装请求参数
export function paramsFun (params) {
  let _params = {}
  // 获取token
  // let _login = store.state.login
  // let token = _login.token
  // let userName = _login.userName
  for (let item in params) {
    _params[item] = params[item]
  }
  // _params['token'] = token
  // _params['uid'] = userName
  return _params
}

// 请求方法
export default {
  /***
   *  用户登录
   */
  Login (params) {
    return fetch(URLS.LOGIN, params)
  },
  // 获取所有新闻
  GetAllNews ({pageNo, pageSize}) {
    let urls = `${URLS.GETALLNEWS}?pageNo=${pageNo}&pageSize=${pageSize}`
    return fetch(urls)
  },
  // 增加新闻
  AddNews (params) {
    return fetch(URLS.ADDNEWS, params)
  },
  // 修改新闻
  UpdateNews (params) {
    return fetch(URLS.UPDATENEWS, params)
  },
  // 删除新闻
  DeleteNews (params) {
    let urls = `${URLS.DELETENEWS}?id=${params.id}`
    return fetch(urls, {})
  },
  // 根据ID号查找新闻
  QueryNewsById ({id}) {
    let urls = `${URLS.QUERYNEWSBYID}?id=${id}`
    return fetch(urls)
  },
  // 查找所有党建
  GetAllParty ({pageNumber, pageSize, partyBuildType}) {
    let urls = `${URLS.QUERYPAETYBYTYPE}?pageNumber=${pageNumber}&pageSize=${pageSize}&partyBuildType=${partyBuildType}`
    return fetch(urls)
  },
  // 增加党建
  AddParty (params) {
    return fetch(URLS.ADDPARTYBUILD, params)
  },
  // 更新党建
  UpdateParty (params) {
    return fetch(URLS.UPDATEPARTYBUILD, params)
  },
  // 删除党建
  DeleteParty (params) {
    let urls = `${URLS.DELETEPARTYBUILD}?partyBuildId=${params.id}`
    return fetch(urls)
  },
  // 根据类型查找党建
  QueryPartyById (params) {
    let urls = `${URLS.QUERYONEPARTYBUILD}?partyBuildId=${params.id}`
    return fetch(urls)
  },
  // 分页获取
  GetAllTender ({pageNo, pageSize, cityId}) {
    let urls = `${URLS.GETALLTENDERS}?pageNo=${pageNo}&pageSize=${pageSize}&cityId=${cityId}`
    return fetch(urls)
  },
  // 更新或修改
  AddOrEditTender (params, type) {
    let urls = type === 'add' ? URLS.ADDTENDERS : URLS.UPDATETENDERS
    return fetch(urls, params)
  },
  // 删除招标
  DeleteTender ({id}) {
    let urls = `${URLS.DELETETENDERS}?id=${id}`
    return fetch(urls, {})
  },
  // 加载省份信息
  QueryAllPro () {
    return fetch(URLS.SELECTALLPRO)
  },
  QueryCityByPro ({pid}) {
    let urls = `${URLS.SELECTCITYBYPRO}?pid=${pid}`
    return fetch(urls)
  },
  // 更新/修改事件
  AddOrEditEvents (params, type) {
    let urls = type === 'add' ? URLS.ADDEVENTS : URLS.UPDATEEVENTS
    return fetch(urls, params)
  },
  DeleteEvents ({id}) {
    let urls = `${URLS.DELETEEVENTS}?id=${id}`
    return fetch(urls, {})
  },
  // 根据年查找所有事件
  GetAllEvents ({pageNo, pageSize, year}) {
    let urls = year ? `${URLS.GETALLEVENTS}?pageNo=${pageNo}&pageSize=${pageSize}&year=${year}` : `${URLS.GETALLEVENTS}?pageNo=${pageNo}&pageSize=${pageSize}`
    return fetch(urls)
  },
  // 联系我们
  AddOrEditContact (params, type) {
    let urls = type === 'add' ? URLS.ADDCONTACTUS : URLS.UPDATECONTACTUS
    return fetch(urls, params)
  },
  DeleteContact ({id}) {
    let urls = `${URLS.DELETECONTACTUS}?id=${id}`
    return fetch(urls, {})
  },
  GetAllContact ({pageNo, pageSize}) {
    let urls = `${URLS.GETALLCONTACTUS}?pageNo=${pageNo}&pageSize=${pageSize}`
    return fetch(urls)
  },
  // 车系
  AddOrEditCars (params, type) {
    let urls = type === 'add' ? URLS.ADDCARSBRAND : URLS.UPDATECARSBRAND
    return fetch(urls, params)
  },
  DeleteCars ({id}) {
    let urls = `${URLS.DELETECARSBRAND}?id=${id}`
    return fetch(urls, {})
  },
  GetAllCars ({pageNo, pageSize, companyId}) {
    let urls = companyId ? `${URLS.GETALLCARSBRAND}?pageNo=${pageNo}&pageSize=${pageSize}&companyId=${companyId}` : `${URLS.GETALLCARSBRAND}?pageNo=${pageNo}&pageSize=${pageSize}`
    return fetch(urls)
  },
  AddOrEditCarsType (params, type) {
    let urls = type === 'add' ? URLS.ADDCARSTYPE : URLS.UPDATECARSTYPE
    return fetch(urls, params)
  },
  DeleteCarsType ({id}) {
    let urls = `${URLS.DELETECARSTYPE}?id=${id}`
    return fetch(urls, {})
  },
  GetAllCarsType ({pageNo, pageSize, carId}) {
    let urls = `${URLS.GETALLCARSTYPE}?pageNo=${pageNo}&pageSize=${pageSize}&carId=${carId}`
    return fetch(urls)
  },
  AddOrEditCarsDesc (params, type) {
    let urls = type === 'add' ? URLS.ADDCARSDETAIL : URLS.UPDATECARSDETAIL
    return fetch(urls, params)
  },
  DeleteCarsDesc ({id}) {
    let urls = `${URLS.DELETECARSDETAIL}?id=${id}`
    return fetch(urls, {})
  },
  GetAllCarsDesc ({pageNo, pageSize, typeId}) {
    let urls = `${URLS.GETALLCARSDETAIL}?pageNo=${pageNo}&pageSize=${pageSize}&typeId=${typeId}`
    return fetch(urls)
  },
  // 领域
  GetAllBusiness ({pageNumber, pageSize, companyType}) {
    let urls = companyType ? `${URLS.GETALLBUSINESS}?pageNumber=${pageNumber}&pageSize=${pageSize}&companyType=${companyType}` : `${URLS.GETALLBUSINESS}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    return fetch(urls)
  },
  GetAllCompanyName ({companyName}) {
    let urls = companyName ? `${URLS.GETCOMPANYNAME}?companyName=${companyName}` : `${URLS.GETCOMPANYNAME}`
    return fetch(urls)
  },
  AddOrEditBusiness (params, type) {
    let urls = type === 'add' ? URLS.ADDBUSINESS : URLS.UPDATEBUSINESS
    return fetch(urls, params)
  },
  DeleteBusiness ({id}) {
    let urls = `${URLS.REMOVEBUSINESS}?businessScopeId=${id}`
    return fetch(urls)
  },
  GetAllBusinessContact () {},
  // 分页获取所有联系人
  GETALLBUSINESSCONTACTS ({pageSize, pageNumber}) {
    let urls = `${URLS.GETALLBUSINESSCONTACTS}?pageSize=${pageSize}&pageNumber=${pageNumber}`
    return fetch(urls)
  },
  AddOrEditBusinessContact (params, type) {
    // debugger
    let urls = type === 'add' ? URLS.ADDBUSINESSCONTACT : URLS.UPDATEBUSINESSContact
    return fetch(urls, params)
  },
  DeleteBusinessContact ({id}) {
    let urls = `${URLS.DELETEBUSINESSContact}?id=${id}`
    return fetch(urls)
  },
  AddOrEditAccount (params, type) {
    let urls = type === 'add' ? URLS.ADDACCOUNT : URLS.UPDATEACCOUNT
    return fetch(urls, params)
  },
  GetAllAccount ({pageSize, pageNo}) {
    let urls = `${URLS.GETALLACCOUNT}?pageSize=${pageSize}&pageNo=${pageNo}`
    return fetch(urls)
  }
}
