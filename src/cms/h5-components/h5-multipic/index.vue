<template>
  <div class="cp-cms-h5-multipic">
    <div class="multipic-wrapper" >
      <img
        v-for="(item,itemIndex) in model.images"
        :src="item.src || require('@/img/goods-default.png')"
        :key="itemIndex"
        :style="barStyle"
        alt=""
        width="100%"
        class="multipic-img"
        @click="goLink(item.link)">
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
    operation: { // 传入对于商品 优惠券 的基础操作 比如 请求商品 加入购物车 跳转到详情页面
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
        marginBottom: this.model.margin + 'px'
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
    goLink(linkObj) {
      if (linkObj && !this.baseConfig.isEdit && this.operation.goLink) {
        this.operation.goLink(linkObj)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-cms-h5-multipic {
  position: relative;
  z-index: 1;
}
.multipic-img{
  display: flex;
}
</style>

