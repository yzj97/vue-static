<template>
  <div class="cp-cms-search">
    <div class="search-bar">
      <div name="searchLink" class="search-bar__wrapper" @click="searchLink">
        <img :src="require('./images/search.png')" alt="" class="search-bar__icon">
        <label class="search-bar__placeholder">{{ $t('请输入您想搜索的商品') }}</label>
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
    itemData: {
      type: Object,
      default: () => {}
    },
    operation: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    // 大数据热力图埋点
    if (window.heimdallTrackCmsModule) {
      window.heimdallTrackCmsModule(this.$el, this.itemData.id, this.baseConfig.pageId)
    }
  },
  methods: {
    searchLink() {
      if (!this.baseConfig.isEdit && this.operation.goSearch) {
        // location.href = '/search.html'
        this.operation.goSearch()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-cms-search {
  position: relative;
  z-index: 1;
}
.search-bar{
  padding: 0.06rem 0.12rem;
  background-color: #fff;
}
.search-bar__wrapper{
  background-color: #f4f4f4;
  border-radius: 0.36rem;
  padding: 0 0.1rem;
  line-height: 0.36rem;
}
.search-bar__icon{
  width: 0.16rem;
  height: 0.16rem;
  vertical-align: middle;
}
.search-bar__placeholder{
  font-size: 0.13rem;
  color: #ccc;
  font-weight: 400;
}
</style>

