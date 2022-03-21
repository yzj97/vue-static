<template>
  <div class="cp-cms-goods-recommend">
    <div v-if="model.displayType == 0" >
      <cms-goods :model="model" v-bind="$attrs" is-recommend v-on="$listeners"/>
    </div>
    <div v-else-if="model.displayType == 1" >
      <cms-goods-r1c1s :model="model" v-bind="$attrs" is-recommend v-on="$listeners"/>
    </div>
    <div v-else-if="model.displayType == 2">
      <cms-goods-r1c1b :model="model" v-bind="$attrs" is-recommend v-on="$listeners"/>
    </div>
  </div>
</template>

<script>
import CmsGoodsR1c1b from '@/h5-components/goods-r1c1b' // 单列大图
import CmsGoodsR1c1s from '@/h5-components/goods-r1c1s' // 单列小图
import CmsGoods from '@/h5-components/goods' // 一行两列

export default {
  components: {
    CmsGoodsR1c1b,
    CmsGoodsR1c1s,
    CmsGoods
  },
  props: {
    model: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-cms-goods-recommend {
  width: 100%;
  position: relative;
  z-index: 1;
}
</style>
