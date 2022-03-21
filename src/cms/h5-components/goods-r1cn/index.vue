<template>
  <div class="cp-cms-goods-r1cn">
    <div ref="wrapper" class="wrapper">
      <div v-if="listObj.length > 0" v-cloak :style="{width: getWidth + 'rem'}" class="goods-list">
        <div v-for="pro in listObj" :key="pro.mpId" name="goDetail" class="goods-item" @click="goDetail(pro)">
          <div class="goods-img">
            <img :src="pro.customPic ? pro.customPic : pro.picUrl " class="img" width="100%">
            <div v-if="(pro.liveStatus || pro.status) === 1" class="live-stream-ing">
              <img :src="require('@/img/live-stream-ing.gif')">
              <span>{{ $t('直播中') }}</span>
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
              <cms-price :pro="pro" :flex-direction="true" :one-price="true"/>
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
    </div>
    <div v-if="listObj.length === 0 && baseConfig.isEdit" class="goods-list">
      <div class="goods-item">
        <div class="goods-img">
          <img :src="require('@/img/goods-default.png')" class="img" width="100%">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CmsPrice from '@/components/cms-price'
// import BScroll from 'better-scroll'

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
      pageSize: 10,
      scroller: null,
      scrollX: 0,
      changeCount: []
    }
  },
  computed: {
    getWidth() {
      return this.listObj.length * 1.4
    }
  },
  watch: {
    'model.dataChange': {
      handler(val) {
        this.pageNo = 1
        this.changeCount.push('')
      }
    },
    'changeCount': {
      async handler(val) {
        if (val.length === 1) {
          await this.query()
          if (this.changeCount.length > 1) {
            this.changeCount = []
            await this.query()
          } else {
            this.changeCount = []
          }
        }
      }
    }
  },
  mounted() {
    this.query()
    // 大数据热力图埋点
    if (window.heimdallTrackCmsModule) {
      window.heimdallTrackCmsModule(this.$el, this.itemData.id, this.baseConfig.pageId)
    }
  },

  methods: {
    handler() {
      const offset = 170
      if (this.isBusy) {
        return
      }
      var windowW
      if (this.baseConfig.isEdit) {
        windowW = 375
      } else {
        windowW = window.innerWidth
      }
      if (this.scrollX + windowW > this.getWidth * 100 - offset) {
        if (this.pageNo < this.totalPage) {
          this.isBusy = true
          this.pageNo += 1
          this.query()
        }
      }
    },
    async query() {
      if (this.operation.getGoodsList && this.itemData.id) {
        const params = {
          moduleId: this.itemData.id,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
        const res = await this.operation.getGoodsList(params)
        if (res.data.listObj && res.data.listObj.length === 0 || !res.data.listObj) {
          this.listObj = []
          return
        }
        this.totalPage = res.data.totalPage
        const originData = res.data.listObj
        const mpIds = res.data.listObj.map(item => item.mpId)
        const result = await this.getPriceStockList({ mpIds: mpIds.join(',') })
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
        this.$nextTick(() => {
          if (this.scroller === null) {
            this.scroller = new window.BScroll(this.$refs.wrapper, {
              startX: 0,
              scrollX: true,
              click: true,
              probeType: 3
            })
            this.scroller.on('scroll', (pos) => {
              this.scrollX = Math.abs(Math.round(pos.x))
              this.handler()
            })
          }
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

.cp-cms-goods-r1cn {
  position: relative;
  z-index: 1;
  .wrapper {
    overflow: hidden;
  }
  .goods-list {
    white-space: nowrap;
    .goods-item {
      padding: 0.1rem;
      width: 1.4rem;
      height: 2.43rem;
      display: inline-block;
      vertical-align: middle;
      box-sizing: border-box;
      .goods-img {
        position: relative;
        display: block;
        width: 1.2rem;
        height: 1.2rem;
        .img {
          width: 100%;
          height: 100%;
          border-radius: 0.06rem;
          display: block;
        }
        .live-stream-ing{
          position: absolute;
          z-index: 1;
          top: 0.1rem;
          left: 0.12rem;
          img{
            position: relative;
            width: 0.58rem;
            height: 0.16rem;
          }
          span{
            position: absolute;
            top:0;
            right: 4px;
            z-index: 2;
            font-size: 0.12rem;
            color: #FFFFFF;
            line-height: 0.16rem;
          }
        }
      }
      .goods-info {
        height: 1rem;
        position: relative;
        margin-top: .03rem;
        .mp-name{
          width: 100%;
          font-size: 0.14rem;
          color: #333333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 700;
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
          right: 0;
          overflow: hidden;
        }
      }
    }

  }
}
</style>

