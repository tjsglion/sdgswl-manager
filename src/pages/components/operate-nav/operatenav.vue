<template>
  <div class="operatenav-wrapper">
    <div class="operate-title">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'operatenav'
}
</script>

<style lang="less" scoped>
  @nav-bg-color: #04a450;
  .operate-title{
    // height: 28px;
    // line-height: 24px;
    border-left: 4px solid @nav-bg-color;
    text-indent: 15px;
    margin-bottom: 10px;
  }
</style>
