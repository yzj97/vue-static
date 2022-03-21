<template>
  <div class="pg-level-two">
    this is 二级路由
    <h3>
      显示国际化
    </h3>
    {{ $t('module_name_test') }}
  </div>
</template>

<script>
export default {
  name: 'SampleLevelTwoList', // 2级路由-需要标注名称，不然不能缓存
  data() {
    return {}
  },
  activated() {
    console.log('level two is activated')
  },
  mounted() {
    console.log('level two is loaded')
  }
}
</script>

<style lang="scss" scoped>
</style>
