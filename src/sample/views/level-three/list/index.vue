<template>
  <div class="pg-module-name">
    this is test
  </div>
</template>

<script>
export default {
  name: 'SampleLevelThreeList', // 3级路由-需要标注名称，不然不能缓存
  data() {
    return {}
  },
  activated() {
    console.log('level three is activated')
  },
  mounted() {
    console.log('level three is loaded')
  }
}
</script>

<style lang="scss" scoped>
</style>
