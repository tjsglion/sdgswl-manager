<template>
  <div class="sidebarmenu-scale-con">
    <template v-for="(item, index) in menuList">
      <div style="text-align: center;" :key="index">
        <!-- 只有一个菜单列表时 -->
        <Dropdown transfer v-if="item.children.length === 1"
                  placement="right-start"
                  :key="index"
                  @on-click="changeMenu">
          <Button @click="changeMenu(item.children[0].name)" type="text" class="icon-btn">
            <Icon :type="item.children[0].icon || item.icon" :size="20" :color="iconColor"/>
          </Button>
          <DropdownMenu slot="list">
              <DropdownItem :name="item.children[0].name" :key="'menu' + index">
                <Icon :type="item.children[0].icon || item.icon" :size="16" class="icon-style"></Icon>
                <span>{{ itemText(item) }}</span>
              </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Dropdown transfer v-else
                  placement="right-start"
                  :key="index"
                  @on-click="changeMenu">
          <Button type="text" class="icon-btn">
            <Icon :type="item.icon" :size="20" :color="iconColor"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <template v-for="(child, i) in item.children">
              <DropdownItem :name="child.name" :key="'menu' + i">
                <Icon :type="child.icon" :size="16" class="icon-style"></Icon>
                <span>{{ itemText(child) }}</span>
              </DropdownItem>
            </template>
          </DropdownMenu>
        </Dropdown>
      </div>
    </template>
  </div>
</template>

<script type="text/ecmascript-6">
 export default {
   props: {
     menuTheme: {
       type: String,
       default: 'dark'
     },
     menuList: Array,
     iconColor: {
       type: String,
       default: 'white'
     }
   },
   methods: {
     changeMenu (active) {
       this.$emit('on-change', active)
     },
     itemText (item) {
       if (typeof item.title === 'object') { // 国际化操作
         return item.title
       } else {
         return item.title
       }
     }
   }
 }
</script>

<style lang="less">
  .icon-style{
    position: relative;
    top: 1px;
  }
  .icon-btn{
    width: 60px;
    margin-right: 5px;

  }
</style>
