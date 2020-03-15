<template>
  <div class="theme-con">
    <Dropdown trigger="click" @on-click="setTheme">
      <a href="javascript:void(0)">
        <Icon type="paintbucket" :size="18" :style="iconStyle"></Icon>
        <Icon type="arrow-down-b" style="position: relative;top:2px;"></Icon>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem v-for="(item, index) in themeList" :key="index" :name="item.name">
          <Row type="flex" justify="center" align="middle">
            <span><Icon :size="20" :color="item.menu"></Icon></span>
            <span><Icon :size="20" type="record" :color="item.element"></Icon></span>
          </Row>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script type="text/ecmascript-6">
  import * as CONST from '../../store/types'
 export default {
   computed: {
     iconStyle () {
       let style = {
         'vertical-align': 'middle',
         'color': '#495060'
       }
       return style
     }
   },
   data () {
     return {
       themeList: [
         {
           name: 'black_b',
           menu: '#495060',
           element: '#2d8cf0'
         },
         {
           name: 'black_g',
           menu: '#495060',
           element: '#00a854'
         },
         {
           name: 'black_y',
           menu: '#495060',
           element: '#e96500'
         },
         {
           name: 'black_r',
           menu: '#495060',
           element: '#e43e31'
         },
         {
           name: 'light_b',
           menu: '#495060',
           element: '#2d8cf0'
         },
         {
           name: 'light_g',
           menu: '#495060',
           element: '#00a854'
         },
         {
           name: 'light_y',
           menu: '#495060',
           element: '#e96500'
         },
         {
           name: 'light_r',
           menu: '#495060',
           element: '#e43e31'
         }
       ]
     }
   },
   methods: {
     setTheme (data) {
       /**
        *  substr(index, length) : 在字符串中抽取从 index 下开始的指定长度的字符
        * @type {string | *}
        */
       let menuTheme = data.substr(0, 1) // 提取第一个元素
       let mainTheme = data.substr(-1, 1) // 提取最后一个元素
      //  console.log(menuTheme, mainTheme)
       if (menuTheme === 'b') {
         // 黑色菜单
         this.$store.commit({
           type: CONST.MENUTHEME,
           value: 'dark'
         })
         menuTheme = 'dark'
       } else {
          this.$store.commit({
            type: CONST.MENUTHEME,
            value: 'light'
          })
         menuTheme = 'light'
       }

       let path = './src/components/themeSwitch/theme/'
       let themeLink = document.querySelector('link[name="theme"]')
       let username = this.$store.state.login.userName
      //  console.log(path, themeLink, username)
       if (localStorage.theme) {
         let themeList = JSON.parse(localStorage.theme)
         let index = 0
         let hasUser = themeList.some((item, i) => {
           if (item.userName === username) {
             index = i
             return true
           } else {
             return false
           }
         })

         if (hasUser && themeLink) {
           themeLink[index].mainTheme = mainTheme
           themeLink[index].menuTheme = menuTheme
         } else {
           themeLink && themeLink.push({
             userName: username,
             mainTheme: mainTheme,
             menuTheme: menuTheme
           })
         }
         localStorage.theme = JSON.stringify(themeLink)
       } else {
         localStorage.theme = JSON.stringify([{
           userName: username,
           mainTheme: mainTheme,
           menuTheme: menuTheme
         }])
       }
       // 根据不同的环境加载不同的资源
       // todo
       let stylePath = './src/components/themeSwitch/theme/'

       if (mainTheme !== 'b') {
         path = stylePath + mainTheme + '.css'
       } else {
         path = ''
       }
       themeLink && themeLink.setAttribute('href', path)
     }
   },
   created () {
     // 开发环境和生产环境使用不同的样式
     let path = './src/components/themeSwitch/theme/' // 当前环境下样式
    //  console.log(path)
     // todo

     // 设置当前样式
     let store = this.$store
     let username = store.state.login.userName
     if (localStorage.theme) {
       let theme = JSON.parse(localStorage.theme) || []
       let hasUser = theme.some(item => {
         if (item.userName === username) {
           store.commit({ type: CONST.CHANGEMAINTHEME, value: item.mainTheme })
           store.commit({ type: CONST.CHANGEMENUTHEME, value: item.menuTheme })
           return true
         } else {
           return false
         }
       })

       if (!hasUser) {
         store.commit({ type: CONST.CHANGEMENUTHEME, value: 'dark' })
         store.commit({ type: CONST.CHANGEMAINTHEME, value: 'b' })
       }
     }

     if (store.state.main.themeColor !== 'b') {
       let stylePath = path + store.state.main.themeColor + '.css'
       let themeLink = document.querySelector('link[name="theme"]')
       themeLink && themeLink.setAttribute('href', stylePath)
     }
   }
 }
</script>

<style lang="less">
  .theme-con{
    display: inline-block;
    padding: 0 5px;
  }
  .ivu-dropdown-menu{
    min-width: 50px;
  }
</style>
