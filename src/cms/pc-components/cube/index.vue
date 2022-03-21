<template>
  <div :style="{'width':model.cdata.width,'float':none,'height':getHeight}" class="cp-cms-cube">
    <div v-for="(itemCube,index) in model.cdata.children" :key="index" :style="{'width':itemCube.width,'height':itemCube.height,'float':itemCube.float,'margin-right':itemCube.marginRight,'margin-bottom':itemCube.marginBottom}">
      <img :src="itemCube.imgUrl" :style="{'float':itemCube.float}" alt="" @click="goLink(itemCube.link.data)">
      <div :v-if="itemCube.children" :style="{'width':itemCube.width,'float':itemCube.float}" class="have-cube-children">
        <div v-for="(item,k) in itemCube.children" :key="k" :style="{'width':item.width,'height':item.height,'float':item.float,'margin-right':item.marginRight,'margin-bottom':item.marginBottom}">
          <img :src="item.imgUrl" :style="{'float':item.float}" name="goLink" @click="goLink(item.link.data)">
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
    baseConfig: { // 传入对于商品 优惠券 组件的基础config
      type: Object,
      default: () => {}
    },
    itemData: {
      type: Object,
      default: () => {}
    },
    operation: { // 传入对于商品 优惠券 的基础操作 比如 请求商品 加入购物车 跳转到详情页面
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
    goLink(url) {
      if (url && !this.baseConfig.isEdit && this.operation.goLink) {
        this.operation.goLink(url)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .cp-cms-cube {
    overflow: hidden;
  }
</style>

