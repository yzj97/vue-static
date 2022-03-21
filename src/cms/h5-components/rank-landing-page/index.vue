<template>
  <div class="cp-cms-rank-landing-page">
    <div v-if="listObj.length > 0" v-cloak class="goods-list">
      <div v-for="(pro, index) in listObj" :key="pro.mpId" name="goDetail" class="goods-item" @click="goDetail(pro)">
        <div class="goods-img">
          <img :src="pro.customPic ? pro.customPic : pro.picUrl " class="img" width="100%">
          <div class="top-area">
            <span class="top">Top</span>
            <span class="top-num">{{ index + 1 }}</span>
          </div>
        </div>
        <div class="goods-info">
          <div class="mp-name">
            {{ pro.customName ? pro.customName : pro.mpName }}
          </div>
          <div class="icon-list">
            <span v-for="(proIcon, pIdx) in pro.promotionIcon" :key="pIdx" class="icon-item">{{ proIcon.iconText }}</span>
          </div>
          <div class="price">
            <cms-price :pro="pro"/>
          </div>
          <!-- 礼品卡不显示购买按钮 -->
          <div v-if="model.displayBuyBtn && !(pro.mpType === 33 || pro.mpType ===34 || pro.mpType === 35 || pro.mpType === 36)" class="cart">
            <img :src="require('@/img/cart.png')" name="addItemInCart" class="cart-img" @click="addItemInCart(pro, $event)">
          </div>
          <div v-if="model.displayEvaluate" class="rating-area">
            <div v-if="pro.ratingCount && pro.ratingCount > 0">
              <span>{{ pro.ratingCount }}</span>{{ $t('条评论') }} {{ $t('好评') }}
              <span>{{ pro.positiveRate + '%' }}</span>
            </div>
            <div v-if="!pro.ratingCount || pro.ratingCount == 0">
              {{ $t('暂无评论') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="listObj.length === 0 && baseConfig.isEdit" class="goods-list">
      <div class="goods-item">
        <div class="goods-img">
          <img :src="require('@/img/goods-default.png')" class="img" width="100%">
        </div>
      </div>
    </div>
    <div v-if="!isLast && total > pageSize" class="load-more">
      <a :href="baseConfig.isEdit ? 'javascript:void(0)' : '/search.html?cmsModuleId=' + itemData.id" class="load-more__btn">
        <span class="load-more__title">{{ $t('查看更多') }}</span>
        <span class="load-more__icon"/>
      </a>
    </div>
  </div>
</template>

<script>
import CmsPrice from '@/components/cms-price'
export default {
  components: {
    CmsPrice
  },
  props: {
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
      pageSize: 12
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
        return
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
      if (this.operation.getGoodsList && this.itemData.id) {
        const params = {
          moduleId: this.itemData.id,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
        this.operation.getGoodsList(params).then(res => {
          if (res.data.listObj && res.data.listObj.length === 0 || !res.data.listObj) {
            this.listObj = []
            return
          }
          this.totalPage = res.data.totalPage
          this.total = res.data.total
          const originData = res.data.listObj
          const mpIds = res.data.listObj.map(item => item.mpId)
          this.getPriceStockList({ mpIds: mpIds.join(',') }).then(result => {
            const newData = originData.map(item => {
              const index = result.data.plist.findIndex(row => row.mpId === item.mpId)

              return { ...item, ...result.data.plist[index] }
            })
            if (this.pageNo === 1) {
              this.listObj = newData
            } else {
              this.listObj = [...this.listObj, ...newData]
            }
            this.isBusy = false
          })
        })
      }
    },
    getPriceStockList(params) {
      if (this.operation.getPriceStockList) {
        return this.operation.getPriceStockList(params)
      }
    },
    goDetail(pro) {
      if (this.operation.goGoodsDetail) {
        this.operation.goGoodsDetail(pro)
      }
    },
    addItemInCart(item, e) {
      if (this.operation.addItemInCart) {
        this.operation.addItemInCart(item, e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.cp-cms-rank-landing-page {
  position: relative;
  z-index: 1;
  .goods-list {
    .goods-item {
      display: flex;
      padding: 0.15rem .15rem .1rem .15rem;
      box-sizing: border-box;
      .goods-img {
        display: block;
        width: 1.3rem;
        height: 1.3rem;
        margin-right: .12rem;
        position: relative;
        .img {
          width: 100%;
          height: 100%;
          border-radius: 0.06rem;
          display: block;
        }
        .top-area {
          position: absolute;
          width: .3rem;
          height: .36rem;
          background: url('../../img/top.png') no-repeat center center;
          background-size: 100%;
          top: 0;
          left: 0.08rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #FFFFFF;
          font-weight: bold;
          .top {
            font-size: .12rem;
            transform: scale(0.83);
          }
          .top-num {
            font-size: .16rem;
          }
        }
      }
       .goods-info {
         flex: 1;
          position: relative;
        .mp-name{
          font-size: 0.14rem;
          color: #333333;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          font-weight: bold;
        }
        .icon-list {
          display: flex;
          margin-top: .05rem;
          margin-left: -.01rem;
          .icon-item {
            color: #FF2300;
            font-size: .12rem;
            padding: 0rem 0.02rem;
            transform: scale(0.83);
            position: relative;
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
        }
        .cart {
          position: absolute;
          bottom: 0.17rem;
          right: 0;
          .cart-img {
            display: block;
            width: 0.28rem;
            height: 0.28rem;
          }
        }
        .rating-area {
          position: absolute;
          bottom: 0rem;
          left: -.03rem;
          color: #B7B7B7;
          font-size: .12rem;
          transform: scale(0.83);
        }
        .price {
          position: absolute;
          bottom: 0.18rem;
          left: -0.01rem;
        }
      }
    }

  }
  .load-more {
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

