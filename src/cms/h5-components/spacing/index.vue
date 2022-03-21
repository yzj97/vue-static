<template>
  <div class="cp-cms-spacing">
    <div :style="{height: model.height + 'px', background: model.bgColor }"/>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-cms-spacing {
  position: relative;
  z-index: 1;
}
</style>

