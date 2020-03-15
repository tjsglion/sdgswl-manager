<template>
  <!-- 添加滚轮事件 mousewheel firefox 下使用 DOMMouseScroll -->
  <div ref="scrollCon" @DOMMouseScroll="handleScroll" @mousewheel="handleScroll" class="tabs-outer-scroll-con">
    <!-- 关闭其它标签 -->
    <!-- 标签列表 -->
    <div ref="scrollBody" class="tabs-inner-scroll-body" :style="{left: tabLeft + 'px'}">
      <transition-group name="tablist-moving-animation-move">
        <Tag
             ref="openedTab"
             type="dot"
             v-for="(item, index) in pageTabList"
             :key="index"
             :name="item.name"
             :closable="item.name==='home_index'?false:true"
             :color="item.children?(item.children[0].name===currentPageName?'blue':'default'):(item.name===currentPageName?'blue':'default')"
             @on-close="closeTab"
             @click.native="linkTo(item)"
        >{{ itemTitle(item) }}</Tag>
      </transition-group>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapState } from 'vuex'
  import * as CONST from '../../store/types'
 export default {
   props: {
     pageTabList: { // 标签列表
       type: Array
     }
   },
   computed: {
     // todo
     ...mapState({
       tabList: (state) => state.main.pageOpenedList
     })
   },
   data () {
     return {
       currentPageName: this.$route.name, // 当前标签页
       tabLeft: 0,
       refsTab: [], // 页面中已经打开的标签
       tabCount: 1
     }
   },
   methods: {
     itemTitle (item) {
       if (typeof item.title === 'object') {
         return item.title.i18n
       } else {
         return item.title
       }
     },
     handleScroll (e) { // 处理滚轮事件 针对不同的浏览器 主要是 firefox
       let type = e.type
       let delta = 0 // 滚动距离
       if (type === 'DOMMouseScroll' || type === 'mousewheel') { // 滚动一下时 移动120
         delta = (e.wheelDelta ? e.wheelDelta / 3 : -(e.detail || 0)) * 40
       }
       let left = 0
       if (delta > 0) { // 滚动条向左走
         left = Math.min(0, this.tabLeft + delta)
       } else {
         if (this.$refs.scrollCon.offsetWidth - 100 < this.$refs.scrollBody.offsetWidth) { // 当滚动区域 小于 内容区域时 可滚动
           if (this.tabLeft < -(this.$refs.scrollBody.offsetWidth - this.$refs.scrollCon.offsetWidth + 100)) {
             left = this.tabLeft
           } else {
             left = Math.max(this.tabLeft + delta, this.$refs.scrollCon.offsetWidth - this.$refs.scrollBody.offsetWidth - 100)
           }
         } else {
           left = 0
         }
       }
       this.tabLeft = left
     },
     closeTab (e, name) {
       let pageOpenedList = this.$store.state.main.pageOpenedList
       // 获取首页标签
       let lastTabObj = pageOpenedList[0]
       if (this.currentPageName === name) { // 当要关闭的标签刚好为当前打开的标签时
         let len = pageOpenedList.length
         for (let i = 0; i < len; i++) {
           let el = pageOpenedList[i]
           if (el.name === name) {
             if (i < (len - 1)) {
               lastTabObj = pageOpenedList[i + 1]
             } else {
               lastTabObj = pageOpenedList[i - 1]
             }
             break
           }
         }
       } else {
         // 获取 tab 宽度
         let tabWidth = e.currentTarget.parentNode.offsetWidth
         // Math.min(x, y) 返回 x, y 两个数据中最小的那个数
         this.tabLeft = Math.min(this.tabLeft + tabWidth, 0)
       }
       // 移除 tab 标签
       this.$store.commit(CONST.REMOVETAB, name)
       // 关闭当前页
       this.$store.commit(CONST.CLOSEPAGE, name)
       this.$router.push(lastTabObj)
     },
     linkTo (item) { // 跳转至指定页面
       let routerObj = {}
       routerObj.name = item.name
       if (item.args) routerObj.args = item.args
       if (item.query) routerObj.args = item.args
       this.$router.push(routerObj)
     },
     moveToView (tab) {
       // 当前标签在可视区左侧
       if (tab.offsetLeft < -this.tabLeft) {
         this.tabLeft = -tab.offsetLeft + 10
       } else if (tab.offsetLeft + 10 > -this.tabLeft &&
         tab.offsetLeft + tab.offsetWidth < -this.tabLeft + this.$refs.scrollCon.offsetWidth - 100) { // 当前标签在可视区内
         this.tabLeft = Math.min(0, this.$refs.scrollCon.offsetWidth - 100 - tab.offsetWidth - tab.offsetLeft - 20)
       } else { // 当前标签在可视区右侧
         this.tabLeft = -(tab.offsetLeft - (this.$refs.scrollCon.offsetWidth - 100 - tab.offsetWidth) + 20)
       }
     }
   },
   created () {},
   mounted () {
     // 获取当前页面中所有打开的标签 并移动到当前页面对应的标签
     this.refsTab = this.$refs.openedTab
     let that = this
     setTimeout(() => {
       that.refsTab.map((item, index) => {
         if (item.name === this.$route.name) {
           let tab = this.refsTab[index].$el
           that.moveToView(tab)
         }
       })
     }, 1)
     this.tabCount = this.tabList.length
   },
   watch: {
     '$route' (to) {
       this.currentPageName = to.name
       let that = this
       this.$nextTick(() => {
        this.refsTab.map((item, index) => {
          if (item.name === to.name) {
            let tab = that.refsTab[index].$el
            // 移动 tab 标签
            // console.log(tab)
            that.moveToView(tab)
          }
        })
       })
       this.tabCount = this.tabList.length
     }
   }
 }
</script>

<style lang="less">
 @import "./tabPageOpened.less";
</style>
