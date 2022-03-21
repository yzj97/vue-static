<template>
  <div class="cp-form-show">
    <div v-if="title" class="title">
      {{ this.$t(title) }}
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.cp-form-show {
  .title {
    height:16px;
    font-size:14px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(69,90,100,1);
    line-height:16px;
    margin-bottom: 10px;
  }
}
</style>
