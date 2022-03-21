<template>
  <div class="cp-cms-slide-show">
    <!-- {{ model }} -->
    <div ref="wrapper" class="wrapper" style="font-size: 0">
      <div :style="{width: getWidth + 'rem'}" class="cms-slide">
        <div v-for="(item,itemIndex) in model.items" :key="itemIndex" :style="barStyle" class="slideshow-wrapper">
          <img :src="item.src || require('@/img/goods-default.png')" name="goLink" width="100%" alt="" class="img" @click="goLink(item.link)">
        </div>
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
    baseConfig: {
      type: Object,
      default: () => {}
    },
    operation: {
      type: Object,
      default: () => {}
    },
    itemData: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    barStyle() {
      return {
        width: this.model.imgWidth * 3.75 / 100 + 'rem'
      }
    },
    getWidth() {
      return this.model.items.length * this.model.imgWidth * 3.75 / 100
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initScroll()
    })
    // 大数据热力图埋点
    if (window.heimdallTrackCmsModule) {
      window.heimdallTrackCmsModule(this.$el, this.itemData.id, this.baseConfig.pageId)
    }
  },
  methods: {
    initScroll() {
      new window.BScroll(this.$refs.wrapper, {
        startX: 0,
        scrollX: true,
        click: true,
        probeType: 3
      })
    },
    goLink(linkObj) {
      if (linkObj && !this.baseConfig.isEdit && this.operation.goLink) {
        this.operation.goLink(linkObj)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-cms-slide-show {
  position: relative;
  z-index: 1;
}
.wrapper {
    overflow: hidden;
  }
.cms-slide{
  white-space: nowrap;
}
.slideshow-wrapper{
  display: inline-block;
}
.img {
  display: block;
}
</style>

