<template>
  <div class="pc-cms-title">
    <div class="pc-cms-title-wrapper">
      <label :style="getStyle" class="title-label">{{ model.titleName }}</label>
      <span v-if="model.titleType === 0" class="right-wrapper">
        <label v-for="(item,index) in model.keyword" :key="index" class="keyword">{{ item.text }}</label>
      </span>
      <span v-if="model.titleType === 1" class=" right-wrapper keyword">{{ $t('更多') }}</span>
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
        color: this.model.color,
        backgroundImage: 'url(' + this.model.iconSrc + ')',
        paddingLeft: this.model.iconSrc ? '0.35rem' : 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pc-cms-title{
  .pc-cms-title-wrapper{
    padding: 0 0.12rem;
    line-height: 0.35rem;
    min-height: 0.35rem;
    overflow: hidden;
    .title-label{
      float: left;
      background-repeat: no-repeat;
      background-position: left center;
      background-size: 0.3rem 0.3rem;
      font-size: 0.21rem;
      font-weight: 400;
    }
    .right-wrapper{
      float: right;
      .keyword{
        padding-left: 0.1rem;
        font-weight: 400;
      }
    }
  }
}
</style>

