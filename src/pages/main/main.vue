<template>
  <div class="main" :class="{'main-hide-text': isScale}">
    <!-- 头部 -->
    <div class="main-header-con" :style="{paddingLeft:isScale?'60px':'200px'}">
      <div class="main-header">
        <div class="navicon-con">
          <!-- 收缩侧边栏 -->
          <Button :style="{transform: 'rotateZ(' + (this.isScale ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
            <Icon type="navicon" size="32"></Icon>
          </Button>
        </div>
        <!-- 面包屑 -->
        <div class="header-middle-con">
          <div class="main-breadcrumb">
            <BreadCrumbNav :currentPath="currentPath"></BreadCrumbNav>
          </div>
        </div>
        <div class="header-avator-con">
          <!-- 消息 -->
          <!-- <MessageTip></MessageTip> -->
          <!-- 风格 -->
          <!-- <ThemeSwitch></ThemeSwitch> -->
          <!-- 语言 -->
          <!-- 头像及登录信息 -->
          <div class="user-dropdown-menu-con">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
              <Dropdown transfer trigger="click" @on-click="dropdownClick">
                <a href="javascript:void(0)">
                  <span class="main-user-name">{{ userName || '内置管理员'}}</span>
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <!-- 下拉列表 -->
                <DropdownMenu slot="list">
                  <DropdownItem name="userCenter">个人中心</DropdownItem>
                  <DropdownItem name="loginOut">退出</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <!-- 头像 -->
              <Avatar style="background: #619fe7;margin-left: 10px;"></Avatar>
            </Row>
          </div>
        </div>
        <!-- 当前打开的标签页 -->
        <div class="tabs-con">
          <TabPageOpened :pageTabList="pageOpenedList"/>
        </div>
      </div>
    </div>
    <!-- 侧边栏 -->
    <div class="sidebar-menu-con" :style="{width:isScale?'60px':'200px', overflow:isScale?'visible':'auto'}">
      <ScalableMenu
        :menu-list="menuList"
        :open-names="openedSubmenuArr"
        :before-push="beforePush">
        <div slot="top" class="logo-con">
          <img src="../../assets/logo.png" v-show="isScale"/>
          <div v-show="!isScale">
            <img src="../../assets/logo.png" ><span>Vue LOGO</span>
          </div>
        </div>
      </ScalableMenu>
    </div>
    <!-- 内容区域 -->
    <div class="single-page-con" :style="{left:isScale?'60px':'200px'}">
      <div class="single-page">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapState, mapGetters } from 'vuex'
  import utils from '../../commons/utils'
  import * as CONST from '../../store/types' // 引入常量
  import BreadCrumbNav from '../../components/breadCrumbNav' // 设置面包屑
  import MessageTip from '../../components/messageTip' // 设置消息
  import ThemeSwitch from '../../components/themeSwitch/themeSwitch' // 设置主题
  import ScalableMenu from '../../components/scalableMenu/scalableMenu' // 侧边栏菜单
  import TabPageOpened from '../../components/tabPageOpened/tabPageOpened' // 标签页
 export default {
   components: {
     BreadCrumbNav,
     MessageTip,
     ThemeSwitch,
     ScalableMenu,
     TabPageOpened
   },
   computed: {
     // 自定义计算属性
     // todo
     ...mapState({}),
     ...mapGetters({
       userName: 'getUserName',
       currentPath: 'getCurrentPath',
       isScale: 'getScale',
       menuList: 'getMenuList',
       openedSubmenuArr: 'getOpenedSubmenuArr',
       pageOpenedList: 'getPageOpenedList'
     })
   },
   data () {
     return {}
   },
   methods: {
     // 初始化页面时
     init () {
       // 1. 初始化菜单
       this.$store.commit(CONST.UPDATEMENULIST)
       // 2. 设置当前路径 体现在面包屑中
       this.$store.commit(CONST.UPDATEMENULIST)
       // 改变 currentPath 的方式  提交一个commit
       let pathArr = utils.setCurrentPath(this, this.$route.name)
       if (pathArr.length > 2) {
         this.$store.commit(CONST.SETOPENSUBMENU, pathArr[1].name)
       }
     },
     toggleClick () {
       this.$store.commit(CONST.TOGGLESCALE)
     },
     dropdownClick (data) {
       let store = this.$store
       if (data === 'loginOut') { // 退出
         store.commit(CONST.LOGINOUT)
         // 清除当前打开的子菜单
         store.commit(CONST.CLEAROPENEDSUBMENU)
         // 清除token 跳转至登录页面
         this.$router.push({
           name: 'login'
         })
       } else if (data === 'userCenter') {
         // 打开新页面
         utils.openNewPage(this, 'user_center_index')
         this.$router.push({
           name: 'user_center_index'
         })
       }
     },
     beforePush () {
       return true
     }
   },
   watch: {
     '$route' (to) {
       // 当路由变化时 重新渲染的内容： 面包屑 菜单 tab框
       this.$store.commit(CONST.SETCURRENTPAGENAME, to.name) // 设置当前页面的name值
       let pathArr = utils.setCurrentPath(this, to.name) // 设置当前路径 即将路径添加到面包屑中
       // 对菜单进行渲染
       if (pathArr.length > 2) { // 当加载的页面为子菜单时
         this.$store.commit(CONST.SETOPENSUBMENU, pathArr[1].name)
       }
       localStorage.currentPageName = to.name
     }
   },
   created () {
     // 显示打开的页面列表
     this.init()
     this.$store.commit(CONST.SETOPENEDLIST)
   },
   mounted () {
    //  console.log(this.pageOpenedList)
   }
 }
</script>

<style lang="less">
  @import "./main.less";
</style>
