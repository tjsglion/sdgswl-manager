<template>
  <div class="sidebar-con" style="width: 100%; height: 100%;" :style="{backgroundColor: bgColor}">
    <slot name="top"></slot>
    <sidebar-menu
      v-show="!isScale"
      :menu-theme="menuTheme"
      :menu-list="menuList"
      :open-names="openNames"
      @on-change="handleChange"
    />
    <sidebar-menu-scale
      v-show="isScale"
      :menu-list="menuList"
      :menu-theme="menuTheme"
    ></sidebar-menu-scale>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapState, mapGetters} from 'vuex'
  import utils from '../../commons/utils'
  import sidebarMenu from './component/sidebarMenu'
  import sidebarMenuScale from './component/sidebarMenuScale'
  export default {
    props: {
      menuTheme: {
        type: String,
        default: 'dark',
        validator (val) {
          return utils.oneOf('dark', ['dark', 'light'])
        }
      },
      menuList: {
        type: Array,
        default: function () {
          return []
        }
      },
      openNames: {
        type: Array
      },
      beforePush: {
        type: Function
      }
    },
    components: {
      sidebarMenu,
      sidebarMenuScale
    },
    computed: {
      // 自定义属性
      // todo
      bgColor () {
        return this.menuTheme === 'dark' ? '#495060' : '#fff'
      },
      ...mapState({
      //  isScale: (state) => state.scaleSidebar.isScale
      }),
      ...mapGetters({
        isScale: 'getScale'
      })
    },
    data () {
      return {}
    },
    methods: {
      handleChange (name) {
        let willPush = true
        if (this.beforePush !== undefined) {
          if (!this.beforePush(name)) {
            willPush = false
          }
        }
        if (willPush) {
          this.$router.push({
            name
          })
        }
        this.$emit('on-change', name)
      }
    }
  }
</script>

<style lang="less">

</style>
