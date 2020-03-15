<template>
  <Breadcrumb>
    <BreadcrumbItem
      v-for="(item, index) in currentPath"
      :to="item.path"
      :key="index">
      {{ itemTitle(item) }}
    </BreadcrumbItem>
  </Breadcrumb>
</template>

<script type="text/ecmascript-6">
 export default {
   props: {
     currentPath: {
       type: [Array],
       default: function () {
         return []
       }
     }
   },
   methods: {
     itemTitle (item) {
       if (typeof item === 'object') {
         return item.title
       } else {
         return item.title
       }
     }
   }
 }
</script>

<style lang="less">

</style>
