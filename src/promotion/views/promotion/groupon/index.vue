<template>
  <transition name="fade" mode="out-in">
    <keep-alive :include="cachedViews">
      <router-view/>
    </keep-alive>
  </transition>
</template>

<script>
export default {
  name: 'PromGroupon', // 3级路由-需要标注名称，不然不能缓存
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
