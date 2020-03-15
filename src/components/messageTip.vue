<template>
  <div class="message-con" @click="showMessage">
    <Tooltip :content="value>0?'有'+this.value+'条未读消息':'无未读消息'" placement="bottom">
      <Badge :count="value" dot>
        <Icon type="ios-bell" :size="22"></Icon>
      </Badge>
    </Tooltip>
  </div>
</template>

<script type="text/ecmascript-6">
 import utils from '../commons/utils'
 export default {
   props: {
     value: {
       type: Number,
       default: 3
     }
   },
   methods: {
     // 跳转至消息展示页
     showMessage () {
       utils.openNewPage(this, 'message_index')
       this.$router.push({
         name: 'message_index'
       })
     }
   }
 }
</script>

<style lang="less">

</style>
