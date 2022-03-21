<template>
  <div :style="getHeight" class="cp-cms-cube">
    <div v-if="model.layout == 0 || model.layout == 1 || model.layout == 2 || model.layout == 6" class="cube-v3">
      <div style="width:100%;" class="clearfix">
        <div v-for="(itemCube,index) in model.cdata.children" :key="index" :style="{'width':itemCube.width,'float':itemCube.float}">
          <a href="javascript:void(0)" @click="goLink(itemCube.link)">
            <img :src="itemCube.imgUrl" alt="">
          </a>
        </div>
      </div>
    </div>
    <div v-if="model.layout == 3 || model.layout == 4 || model.layout == 5 || model.layout == 7 || model.layout == 8 || model.layout == 9 || model.layout ==10" class="cube-v5">
      <div class="clearfix" style="width:100%;float:none;">
        <div v-for="(itemCube,index) in model.cdata.children" :key="index" :style="{'width':itemCube.width,'float':itemCube.float}">
          <a v-if="!itemCube.children" href="javascript:void(0)" @click="goLink(itemCube.link)">
            <img :src="itemCube.imgUrl" alt="">
          </a>
          <div v-for="(item,k) in itemCube.children" v-else :key="k" :style="{'width':item.width,'float':item.float}">
            <a href="javascript:void(0)" @click="goLink(item.link)">
              <img :src="item.imgUrl" alt="">
            </a>
          </div>
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
    position: relative;
    z-index: 1;
    img {
      width: 100%;
      display: block;
      vertical-align: middle;
      border: 0;
    }
    a {
      width: 100%;
      height: 100%;
      display: block;
    }
    .clearfix {
      display: flex;
      zoom: 1
    }
  }
</style>

