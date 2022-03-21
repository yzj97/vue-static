<template>
  <div class="pc-cms-title">
    <div :style="getHeight" class="cp-cms-img-map">
      <div class="img-map-v1">
        <img :src="model.src" alt >
        <div
          v-for="(zone, index) in model.data"
          :key="index"
          :style="{
            width: getZoneStyle(zone.width),
            height: getZoneStyle(zone.height),
            top: getZoneStyle(zone.top),
            left: getZoneStyle(zone.left),
            border: baseConfig.isEdit ? '0.01rem dashed #eee' : ''
          }"
          class="zone"
          @click="handleZoneClick(zone.link.data)"
        />
      </div>
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
    getHeight() {
      if (this.baseConfig.isEdit) {
        return { minHeight: '1rem' }
      }
    }
  },
  mounted() {
    // 大数据热力图埋点
    if (window.heimdallTrackCmsModule) {
      window.heimdallTrackCmsModule(this.$el, this.itemData.id, this.baseConfig.pageId)
    }
  },
  methods: {
    getZoneStyle(val) {
      return `${(val || 0) * 100}%`
    },
    handleZoneClick(url) {
      if (url && !this.baseConfig.isEdit && this.operation.goLink) {
        this.operation.goLink(url)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-cms-img-map {
  position: relative;
  img{
    width: 100%;
    vertical-align: middle;
  }
  .img-map-v1{
    position: relative;
  }
  .zone{
    position:absolute;
    cursor: pointer;
    // border:0.01rem dashed #eee;
  }
}
</style>

