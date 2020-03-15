// const prefix = 'http://39.108.5.62:9090'
// const prefix = process.env.NODE_ENV === 'production' ? 'http://www.sdgswl.com' : 'http://10.192.34.31:9090'
// const prefix = process.env.NODE_ENV ? 'http://www.sdgswl.com' : 'http://39.108.5.62:9090'
const prefix = 'http://www.sdgswl.com'
// const prefix = 'http://www.fangart.cn'
// 调用后台 url 配置
export const URLS = {
  BASEURL: prefix,
  UPLOADSERVER: prefix + '/sdhighway/news/uploadFiles',
  LOGIN: prefix + '/sdhighway/users/userLogin',
  GETALLNEWS: prefix + '/sdhighway/news/getAllNews',
  ADDNEWS: prefix + '/sdhighway/news/addNews',
  QUERYNEWSBYID: prefix + '/sdhighway/news/getNewsDetail',
  UPDATENEWS: prefix + '/sdhighway/news/updateUser',
  DELETENEWS: prefix + '/sdhighway/news/deleteNews',
  QUERYPAETYBYTYPE: prefix + '/sdhighway/party/type',
  ADDPARTYBUILD: prefix + '/sdhighway/party/addpartybuild',
  QUERYONEPARTYBUILD: prefix + '/sdhighway/party/partybuild',
  DELETEPARTYBUILD: prefix + '/sdhighway/party/removePartyBuild',
  UPDATEPARTYBUILD: prefix + '/sdhighway/party/updatePartyBuild',
  // 招标
  ADDTENDERS: prefix + '/sdhighway/tenders/addTenders',
  DELETETENDERS: prefix + '/sdhighway/tenders/deleteTenders',
  GETALLTENDERS: prefix + '/sdhighway/tenders/getTenders',
  UPDATETENDERS: prefix + '/sdhighway/tenders/updateTenders',
  SELECTALLPRO: prefix + '/sdhighway/tenders/selectAllPro',
  SELECTCITYBYPRO: prefix + '/sdhighway/tenders/selectCityByPro',
  // 大事件
  ADDEVENTS: prefix + '/sdhighway/events/addEvents',
  UPDATEEVENTS: prefix + '/sdhighway//events/updateTenders',
  DELETEEVENTS: prefix + '/sdhighway/events/deleteEvents',
  GETALLEVENTS: prefix + '/sdhighway/events/getEvents',
  // 联系我们
  ADDCONTACTUS: prefix + '/sdhighway/connectUs/addConnects',
  UPDATECONTACTUS: prefix + '/sdhighway/connectUs/updateTenders',
  DELETECONTACTUS: prefix + '/sdhighway/connectUs/deleteConnects',
  GETALLCONTACTUS: prefix + '/sdhighway/connectUs/getConnects',
  // 车系
  ADDCARSBRAND: prefix + '/sdhighway/car/insertCar',
  UPDATECARSBRAND: prefix + '/sdhighway/car/updateCar',
  DELETECARSBRAND: prefix + '/sdhighway/car/deleteCar',
  GETALLCARSBRAND: prefix + '/sdhighway/car/getCarList',
  ADDCARSTYPE: prefix + '/sdhighway/carType/insertCarType',
  UPDATECARSTYPE: prefix + '/sdhighway/carType/updateCarType',
  DELETECARSTYPE: prefix + '/sdhighway/carType/deleteCarType',
  GETALLCARSTYPE: prefix + '/sdhighway/carType/getCarTypeList',
  ADDCARSDETAIL: prefix + '/sdhighway/carDetail/insertCarDetail',
  UPDATECARSDETAIL: prefix + '/sdhighway/carDetail/updateCarDetail',
  DELETECARSDETAIL: prefix + '/sdhighway/carDetail/deleteCarDetail',
  GETALLCARSDETAIL: prefix + '/sdhighway/carDetail/getCarDetailList',
  // 领域
  ADDBUSINESS: prefix + '/sdhighway/business/add',
  REMOVEBUSINESS: prefix + '/sdhighway/business/remove',
  UPDATEBUSINESS: prefix + '/sdhighway/business/update',
  GETALLBUSINESS: prefix + '/sdhighway/business/businessscopes',
  GETCOMPANYNAME: prefix + '/sdhighway/business/companyname',
  ADDBUSINESSCONTACT: prefix + '/sdhighway/principal/add',
  UPDATEBUSINESSContact: prefix + '/sdhighway/principal/update',
  DELETEBUSINESSContact: prefix + '/sdhighway/principal/remove',
  GETAllBUSINESSContact: prefix + '/sdhighway/principal/companyprincipal',
  GETALLBUSINESSCONTACTS: prefix + '/sdhighway/principal/companyprincipals',
  // 账号
  ADDACCOUNT: prefix + '/sdhighway/users/addUser',
  UPDATEACCOUNT: prefix + '/sdhighway/users/updateUser',
  GETALLACCOUNT: prefix + '/sdhighway/users/getUserList'
}
