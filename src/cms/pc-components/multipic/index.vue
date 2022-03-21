<template>
  <div class="pc-cms-multipic">
    <div :style="getStyle" class="multipic-column-wraper">
      <img :src="model.images.src" width="100%">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    itemData: {
      type: Object,
      default: () => {}
    },
    baseConfig: {
      type: Object,
      default: () => {}
    },
    operation: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    getStyle() {
      return {
        // padding: this.model.column === 1 ? '0 0.35rem' : 0,
        height: (this.model.images.oriHeight / 100) + 'rem'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pc-cms-multipic{
  min-height: 0.35rem;
  overflow: hidden;
  .multipic-column-wraper{
    width: 100%;
    min-height: 0.35rem;
    background: #E7F3FF;
  }
}
</style>

