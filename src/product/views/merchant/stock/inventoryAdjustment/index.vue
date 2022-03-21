<template>
  <transition name="fade" mode="out-in">
    <keep-alive :include="cachedViews">
      <router-view/>
    </keep-alive>
  </transition>
</template>

<script>
export default {
  name: 'InventoryAdjustmentBill',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
