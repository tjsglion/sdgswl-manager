<template>
    <Menu ref="sidebarMenu"
      :theme="menuTheme"
      :active-name="$route.name"
      :open-names="openNames"
      width="auto"
      @on-select="changeMenu">
      <template v-for="item in menuList">
        <!-- 当只有一个子菜单时 使用 MenuItem -->
        <MenuItem v-if="item.children.length === 1" :name="item.children[0].name" :key="'menuItem' + item.name">
          <Icon :type="item.children[0].icon || item.icon" :size="item.iconSize || 16" :key="'iconItem' + item.name" style="margin-right: 12px;"></Icon>
          <span class="menu-text" :key="'text' + item.name">{{ itemText(item.children[0]) }}</span>
        </MenuItem>
        <!-- 多个子菜单时 使用 SubMenu-->
        <Submenu v-if="item.children.length > 1" :key="'subItem' + item.name" :name="item.name">
          <template slot="title">
            <Icon :type="item.icon" :size="item.iconSize || 16"></Icon>
            <span class="menu-text">{{ itemText(item) }}</span>
          </template>

          <template v-for="child in item.children">
            <MenuItem :key="'menuItem' + child.name" :name="child.name">
              <Icon :type="child.icon" :size="child.iconSize || 16" :key="'iconItem' + child.name"></Icon>
              <span class="menu-text" :key="'text' + child.name">{{ itemText(child) }}</span>
            </MenuItem>
          </template>
        </Submenu>
      </template>
    </Menu>
</template>

<script type="text/ecmascript-6">
 export default {
   props: {
     menuList: {
       type: Array
     },
     menuTheme: {
       type: String,
       default: 'dark'
     },
     openNames: Array
   },
   methods: {
     changeMenu (active) {
       this.$emit('on-change', active)
     },
     itemText (item) {
       if (typeof item.title === 'object') {
         return item.title
       } else {
         return item.title
       }
     }
   },
   update () {
     this.$nextTick(() => {
       if (this.$refs.sidebarMenu) {
         this.$refs.sidebarMenu.updateOpened() // 调用手动更新展开的目录
       }
     })
   }
 }
</script>

<style lang="less">

</style>
