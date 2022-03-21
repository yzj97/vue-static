<template>
  <div v-show="listObj.length !== 0 || baseConfig.isEdit" class="cp-cms-multi-coupons">
    <!-- {{ model }} -->
    <div v-if="model.showTitle" class="coupon-header">
      <div class="left">
        <img v-if="model.icon" :src="model.icon" class="left-img">
        <div class="left-content">{{ model.title }}</div>
      </div>
      <div name="goMore" class="right" @click="goMore(model.link)">
        <div class="right-content">{{ model.linkTitle }}</div>
        <div class="right-arrow"/>
      </div>
    </div>
    <div v-if="model.displayType === 1" class="coupon-list">
      <div v-for="item in listObj" :key="item.id" :class="['coupon-item', item.couponDeductionType === 1 ? 'coupon-blue' : 'coupon-red']" >
        <div class="left">
          <div v-if="item.couponDiscountType === 0" class="coupon-money">
            <span class="money-type">￥</span>
            <span class="money-num">{{ item.couponAmount }}</span>
          </div>
          <div v-if="item.couponDiscountType === 1" class="coupon-money">
            <span class="money-num">{{ item.couponAmount }}</span>
            <span class="money-type">{{ $t('折') }}</span>
          </div>
          <div class="coupon-type">{{ item.couponDeductionType === 1 ? '运费券' : '优惠券' }}</div>
        </div>
        <div class="center">
          <div class="coupon-name">{{ item.themeTitle }}</div>
          <div class="coupon-limt">{{ item.useRuleDesc }}</div>
        </div>
        <div class="right">
          <div :class="['use-btn', item.couponDeductionType === 1 ? 'use-blue' : 'use-red']" name="getCoupon" @click="getCoupon(item)">
            {{ (!baseConfig.isEdit && baseConfig.isLogin && (item.userDayOverFlg === 1||item.userOverFlg === 1))?$t('已领取'):$t('立即领取') }}
          </div>
        </div>
      </div>
    </div>
    <div v-else class="coupon-list2">
      <div v-for="item in listObj" :key="item.id" :class="['coupon-item', item.couponDeductionType === 1 ? 'coupon-blue' : 'coupon-red']">
        <div class="left">
          <div v-if="item.couponDiscountType === 0" class="coupon-money">
            <span class="money-type">￥</span>
            <span class="money-num">{{ item.couponAmount }}</span>
          </div>
          <div v-if="item.couponDiscountType === 1" class="coupon-money">
            <span class="money-num">{{ item.couponAmount }}</span>
            <span class="money-type">{{ $t('折') }}</span>
          </div>
        </div>
        <div class="center">
          <div class="coupon-limt">{{ item.useRuleDesc }}</div>
        </div>
        <div class="right">
          <div :class="['use-btn', item.couponDeductionType === 1 ? 'use-blue' : 'use-red']" name="getCoupon2" @click="getCoupon(item)">
            {{ (!baseConfig.isEdit && baseConfig.isLogin && (item.userDayOverFlg === 1||item.userOverFlg === 1))?$t('已领取'):$t('立即领取') }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isLast && total > pageSize && pageNo < totalPage" class="load-more">
      <a href="javascript:void(0)" class="load-more__btn" @click="loadNext()">
        <span class="load-more__title">{{ $t('加载更多') }}</span>
        <span class="load-more__icon"/>
      </a>
    </div>
    <div v-if="model.displayType === 1 && listObj.length === 0 && baseConfig.isEdit" class="coupon-list">
      <div class="coupon-item"/>
    </div>
    <div v-if="model.displayType === 2 && listObj.length === 0 && baseConfig.isEdit" class="coupon-list2">
      <div v-for="item in 3" :key="item" class="coupon-item" />
    </div>
  </div>
</template>

<script>
export default {
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
      pageSize: this.model.displayType === 1 ? 3 : 9 // 首屏显示3个，超过3个显示更多
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

      this.loadNext()
    },
    loadNext() {
      const offset = 140
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
      if (this.operation.getCouponList && this.itemData.id) {
        const params = {
          moduleId: this.itemData.id,
          page: this.pageNo,
          limit: this.pageSize
        }
        this.operation.getCouponList(params).then(res => {
          if (res.data.listObj && res.data.listObj.length === 0 || !res.data.listObj) {
            this.listObj = []
            return
          }
          this.totalPage = res.data.totalPage
          this.total = res.data.total
          if (this.pageNo === 1) {
            this.listObj = res.data.listObj
          } else {
            this.listObj = [...this.listObj, ...res.data.listObj]
          }
          this.isBusy = false
        })
      }
    },
    goMore(url) {
      if (url && !this.baseConfig.isEdit && this.operation.goLink) {
        this.operation.goLink(url)
      }
    },
    getCoupon(item) {
      if (this.operation.getCoupon) {
        this.operation.getCoupon(item)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-cms-multi-coupons {
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  .coupon-header {
    height: .4rem;
    line-height: .4rem;
    display: flex;
    justify-content: space-between;
    padding: 0 0.12rem;
    color: #333333;
    font-size: .12rem;
    border-bottom: 1px solid #EEF5F9;
    .left {
      display: flex;
      align-items: center;
      .left-img {
        width: .2rem;
        height: .2rem;
        margin-right: 0.1rem;
      }
    }
    .right {
      display: flex;
      align-items: center;
      .right-arrow {
        width: 0.2rem;
        height: 0.2rem;
        background: url('./../../img/arrow.png') no-repeat center center;
        background-size: 100%;
      }
    }
  }
  .coupon-list {
    display: flex;
    flex-direction: column;
    padding: .12rem;
    .coupon-red {
      background: url('../../img/coupon1.png') no-repeat center center;
      background-size: 100%;
    }
    .coupon-blue {
      background: url('../../img/couponBlue1.png') no-repeat center center;
      background-size: 100%;
    }
    .coupon-item {
      margin-bottom: .1rem;
      height: 0.86rem;

      display: flex;
      .left {
        width: 1.17rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        .coupon-money {
          display: flex;
          align-items: baseline;
          .money-type {
            font-size: .12rem;
          }
          .money-num {
            font-size: .26rem;
            font-weight: bold;
          }
        }
        .coupon-type {
          font-size: .12rem;
        }
      }
      .center {
        width: 1.3rem;
        color: #ffffff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .coupon-name {
          font-size: .14rem;
          margin-bottom: .1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: bold;
        }
        .coupon-limt {
          font-size: .12rem;
        }
      }
      .right {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        color: #ffffff;
        font-size: .12rem;
        .use-red {
          color: #E60012;
        }
        .use-blue {
          color: #6367FE;
        }
        .use-btn {
          width: .74rem;
          height: .24rem;
          line-height: .24rem;
          border-radius: .24rem;

          background: #ffffff;
          text-align: center;
        }
      }
    }
  }
  .coupon-list2 {
    display: flex;
    flex-flow: wrap;
    padding: .12rem 0 .12rem .12rem;
    .coupon-red {
       background: url('../../img/coupon2.png') no-repeat center center;
      background-size: 100%;
    }
    .coupon-blue {
      background: url('../../img/couponBlue2.png') no-repeat center center;
      background-size: 100%;
    }
    .coupon-item {
      width: 1.09rem;
      height: 1.09rem;

      margin-bottom: 0.1rem;
      margin-right: .10rem;
      .left {
        height: .46rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        .coupon-money {
          display: flex;
          align-items: baseline;
          .money-type {
            font-size: .12rem;
          }
          .money-num {
            font-size: .26rem;
            font-weight: bold;
          }
        }
      }
      .center {
        color: #ffffff;
        .coupon-limt {
          font-size: .12rem;
          margin: 0.04rem 0 .1rem 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
        }
      }
      .right {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        color: #ffffff;
        font-size: .12rem;
        .use-red {
          color: #E60012;
        }
        .use-blue {
          color: #6367FE;
        }
        .use-btn {
          width: .8rem;
          height: .24rem;
          line-height: .24rem;
          border-radius: .24rem;
          background: #ffffff;
          text-align: center;
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

