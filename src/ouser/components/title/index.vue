<template>
  <h3 class="cp-title">
    <slot/>
  </h3>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.cp-title {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #455A64;
  letter-spacing: 0;
  line-height: 18px;
  padding-bottom: 10px;
  margin-top: 10px;
  border-bottom: 1px solid #EEF5F9;
  margin-bottom: 20px;
}
</style>
