// 展开整个页面的页面单独写 如登录 404 500 401等页面
import LoginComponent from '../pages/login/login'
import MainComponent from '../pages/main/main'
import HomeComponent from '../pages/home/home'
// import MessageComponent from '../pages/message/message'
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: '登录'
  },
  component: LoginComponent
}

/**
 * 作为 Main 组件的子页面但不在左侧菜单显示的路由写在 otherRouter 里
 * 如：个人中心 消息中心等
 * @type {{path: string, name: string, redirect: string, component: string, children: *[]}}
 */
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/home',
  component: MainComponent,
  meta: {
    requireAuth: true
  },
  children: [
    { path: 'home', title: {i18n: '首页'}, name: 'home_index', component: HomeComponent }
    // { path: 'message', title: '消息中心', name: 'message_index', component: MessageComponent }
    // { path: 'userCenter', title: '个人中心', name: 'user_center_index', component: UserCenterComponent }
  ]
}
/**
 * 作为 Main 组件的子页面并在侧边栏中展示时 写在 appRouter中
 * @type {{}}
 */
export const appRouter = [
  {
    path: '/news',
    icon: 'ios-navigate',
    name: 'news',
    title: '新闻',
    meta: {
      requireAuth: true
    },
    component: MainComponent,
    children: [
      { path: '/index', title: '新闻列表', name: 'news_index', component: () => import('@/pages/news/news.vue') }
    ]
  },
  {
    path: '/party',
    icon: 'flag',
    name: 'party',
    title: '党建',
    meta: {
      requireAuth: true
    },
    component: MainComponent,
    children: [
      { path: '/party_index', title: '党建列表', name: 'party_index', component: () => import('@/pages/party/party.vue') }
    ]
  },
  {
    path: '/tender',
    icon: 'ios-book',
    name: 'tender',
    title: '招标',
    meta: {
      requireAuth: true
    },
    component: MainComponent,
    children: [
      { path: '/tender_index', title: '招标列表', name: 'tender_index', component: () => import('@/pages/tender/tender.vue') }
    ]
  },
  {
    path: '/contact',
    icon: 'ios-telephone',
    name: 'contact',
    title: '联系我们',
    meta: {
      requireAuth: true
    },
    component: MainComponent,
    children: [
      { path: '/contact_index', title: '联系我们', name: 'contact_index', component: () => import('@/pages/contact/contact.vue') }
    ]
  },
  {
    path: '/events',
    icon: 'ios-pricetag',
    name: 'event',
    title: '大事件',
    meta: {
      requireAuth: true
    },
    component: MainComponent,
    children: [
      { path: '/event_index', title: '大事件', name: 'event_index', component: () => import('@/pages/events/events.vue') }
    ]
  },
  {
    path: '/cars',
    icon: 'model-s',
    name: 'cars',
    title: '车系',
    meta: {
      requireAuth: true
    },
    component: MainComponent,
    children: [
      { path: '/cars_brand', title: '车品牌', name: 'cars_brand', component: () => import('@/pages/cars/cars.vue') },
      { path: '/cars_type', title: '车类型', name: 'cars_type', component: () => import('@/pages/cars/carsType.vue') },
      { path: '/cars_desc', title: '车描述', name: 'cars_desc', component: () => import('@/pages/cars/carsDesc.vue') }
    ]
  },
  {
    path: '/business',
    icon: 'pie-graph',
    name: 'business',
    title: '业务领域',
    meta: {
      requireAuth: true
    },
    component: MainComponent,
    children: [
      { path: '/business_company', title: '公司信息', name: 'business_company', component: () => import('@/pages/business/company.vue') },
      { path: '/business_contact', title: '公司联系人', name: 'business_contact', component: () => import('@/pages/business/contact.vue') }
    ]
  },
  {
    path: '/account',
    icon: 'person',
    name: 'account',
    title: '账号管理',
    meta: {
      requireAuth: true
    },
    component: MainComponent,
    children: [
      { path: '/account_index', title: '账号管理', name: 'account_index', component: () => import('@/pages/account/account.vue') }
    ]
  }
]
export const routers = [
  loginRouter,
  otherRouter,
  ...appRouter
]
