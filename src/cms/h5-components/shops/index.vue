<template>
  <div class="cp-cms-shops">
    <div v-if="listObj.length > 0" v-cloak class="shops-list">
      <div v-for="pro in listObj" :key="pro.mpId" name="goDetail" class="cp-cms-shops__items" @click="goDetail(pro)">
        <img :src="pro.logoUrl" class="cp-cms-shops__pic" >
        <div class="cp-cms-shops__content">
          <div class="cp-cms-shops__title">{{ pro.storeName }}</div>
          <div class="cp-cms-shops__label">
            <div class="cp-cms-shops__rate">
              <!-- 二开重新写这个 -->
              <!-- xxx <span class="cp-cms-shops__rate__num">4.92</span>分 33人 -->
            </div>
            <div class="cp-cms-shops__pos">
              <img :src="require('@/img/pos.png')" width="12">
              {{ pro.distance }}{{ pro.unit }}
            </div>
          </div>
          <div class="cp-cms-shops__tags">
            <span v-for="(proIcon, pIdx) in pro.promotionIconList" :key="pIdx" class="cp-cms-shops__tag">{{ proIcon.iconText }}</span>
          </div>
          <div class="cp-cms-shops__desc">
            {{ pro.detailAddressAll }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isLast && total > pageSize" class="load-more">
      <a :href="'/search.html?cmsModuleId=' + itemData.id" class="load-more__btn">
        <span class="load-more__title">加载更多</span>
        <span class="load-more__icon"/>
      </a>
    </div>
    <div v-if="listObj.length === 0 && baseConfig.isEdit" class="shops-list">
      <div v-for="item in 1" :key="item" class="shops-item">
        <div class="shops-img">
          <img :src="require('@/img/shops-default.png')" class="img" width="100%">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  props: {
    isLast: {
      type: Boolean,
      default: false
    },
    model: {
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
    },
    baseConfig: { // 传入对于商品 优惠券 组件的基础config
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      listObj: [],
      isBusy: false,
      pageNo: 1,
      totalPage: 1,
      total: 0,
      pageSize: 12,
      chooseCateIndex: 0,
      categoryId: '',
      navCategoryList: [],
      scrollerNav: null
    }
  },
  watch: {
    'model.dataChange': {
      handler(val) {
        this.pageNo = 1
        this.query()
      }
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handler, true)
    // console.log(this.$el.getBoundingClientRect())
    this.query()
    // 大数据热力图埋点
    if (window.heimdallTrackCmsModule) {
      window.heimdallTrackCmsModule(this.$el, this.itemData.id, this.baseConfig.pageId)
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.handler, true)
  },
  methods: {
    handler() {
      if (!this.isLast) {
        return false
      }

      const offset = 100
      if (this.isBusy) {
        return
      }
      const boundRectObj = this.$el.getBoundingClientRect()
      var windowH
      if (this.baseConfig.isEdit) {
        windowH = 667
      } else {
        windowH = window.innerHeight
      }
      // console.log(boundRectObj.bottom >= (0 - offset) && boundRectObj.bottom <= windowH + offset)
      if (boundRectObj.bottom >= (0 - offset) && boundRectObj.bottom <= windowH + offset) {
        if (this.pageNo < this.totalPage) {
          this.isBusy = true
          this.pageNo += 1
          this.query()
        }
      }
    },
    query() {
      if (this.operation.getShopsList && this.itemData.id) {
        const params = {
          moduleId: this.itemData.id,
          preview: 1,
          page: this.pageNo,
          limit: this.pageSize
        }
        this.operation.getShopsList(params).then(res => {
          if (res.data.listObj && res.data.listObj.length === 0 || !res.data.listObj) {
            this.listObj = []
            return
          }
          this.listObj = res.data.listObj
          this.totalPage = res.data.totalPages
          this.total = res.data.total
        })
      }
    },
    goDetail(pro) {
      if (this.operation.goGoodsDetail) {
        this.operation.goGoodsDetail(pro)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.cp-cms-shops {
  position: relative;
  z-index: 1;
  &__items {
    padding: 0.16rem;
    display: flex;
    position: relative;
    justify-content: space-between;
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0.16rem;
      right: 0.16rem;
      height: 1px;
      background: #DFDFDF;
      transform: scaleY(0.5);
    }
  }
  &__pic {
    width: 0.9rem;
    height: 0.9rem;
    margin-right: 0.12rem;
  }
  &__content {
    width: 2.4rem;
  }
  &__title {
    font-size: 0.16rem;
    font-weight: 600;
    color: #333333;
    line-height: 0.2rem;
    margin-bottom: 0.06rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &__label {
    height: 0.24rem;
    display: flex;
    justify-content: space-between;
  }
  &__rate {
    color: #151515;
    &__num {
      color: #FF5555;
    }
  }
  &__pos {
    color: #666;
  }
  &__tags {
    height: 0.22rem;
  }
  &__tag {
    color: #FF2300;
    font-size: .12rem;
    padding: 0rem 0.02rem;
    transform: scale(0.83);
    position: relative;
    margin-right: 0.1rem;
    &::before {
      content: '';
      top: 0;
      left: 0;
      position: absolute;
      border-radius: 0.04rem;
      border: 2px solid #FF2300;
      width: 200%;
      height: 200%;
      transform: scale(.5);
      transform-origin: 0 0;
    }
  }
  &__desc {
    font-size: 0.12rem;
    color: #999999;
    line-height: 0.16rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .load-more {
    margin: 0.15rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .load-more__btn {
      display: inline-block;
      width: .94rem;
      height: .28rem;
      border: 1px solid #D8D8D8;
      border-radius: .14rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .load-more__title {
      font-size: .14rem;
      color: #666666;
    }
    .load-more__icon {
      width: .12rem;
      height: .12rem;
      background: url('../../img/arrow_more.png') no-repeat center center;
      background-size: 100%;
    }
  }
}
</style>

