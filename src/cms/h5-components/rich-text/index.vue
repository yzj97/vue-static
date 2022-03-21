<template>
  <div :style="contentStyle" class="cp-cms-rich-text">
    <!-- {{ model }} -->
    <div class="content" v-html="model.content"/>
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
    }
  },
  computed: {
    contentStyle() {
      return {
        backgroundColor: this.model.bgColor
      }
    }
  },
  mounted() {
    // 大数据热力图埋点
    if (window.heimdallTrackCmsModule) {
      window.heimdallTrackCmsModule(this.$el, this.itemData.id, this.baseConfig.pageId)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ p {
  margin-block-start: 0 !important;
  margin-block-end: 0 !important;
}
/deep/ img{
  max-width: 100%;
}
.cp-cms-rich-text {
  position: relative;
  z-index: 1;
  .content {
    min-height: .16rem;
  }
}
</style>

