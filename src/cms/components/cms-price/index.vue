<template>
  <div class="cms-price">
    <div v-if="pro.pointPrice">
      <div v-if="pro.pointPrice.type === 2" :class="{'point-item--fdc': onePrice}" class="point-item">
        <div class="point-content">
          <span class="point-amount">{{ pro.pointPrice.point }}</span>
          <span class="point-label">{{ $t('积分') }}</span>
          <span class="point-link">+</span>
        </div>
        <div class="template-1">
          <span class="money-type">￥</span>
          <span class="money-int">{{ (pro.pointPrice.amount).toFixed(2).slice(0, -3) }}</span>
          <span class="money-float">{{ (pro.pointPrice.amount).toFixed(2).slice(-3) }}</span>
        </div>
      </div>
      <div v-else :class="{'point-item--fdc': onePrice}" class="point-item">
        <div class="point-content">
          <span class="point-amount">{{ pro.pointPrice.point }}</span>
          <span class="point-label">{{ $t('积分') }}</span>
        </div>
        <div class="template-1">&nbsp;</div>
      </div>
    </div>
    <div v-else>
      <div v-if="pro.promotionId" :class="['cms-price-item', {'flex-direction': flexDirection}]">
        <span ref="onePrice" class="template-1">
          <span class="money-type">￥</span>
          <span ref="onePriceInt" class="money-int">{{ (pro.promotionPrice).toFixed(2).slice(0, -3) }}</span>
          <span class="money-float">{{ (pro.promotionPrice).toFixed(2).slice(-3) }}</span>
        </span>
        <span v-if="pro.membershipPrice > pro.promotionPrice && getShowTwo" class="price-line-through">{{ pro.membershipPrice | currency('¥') }}</span>
      </div>
      <div v-else-if="pro.membershipPrice" :class="['cms-price-item', {'flex-direction': flexDirection}]">
        <span v-if="getShowTwo" class="template-1">
          <span class="money-type">￥</span>
          <span class="money-int">{{ (pro.originalPrice).toFixed(2).slice(0, -3) }}</span>
          <span class="money-float">{{ (pro.originalPrice).toFixed(2).slice(-3) }}</span>
        </span>
        <span class="price-line"><img :src="require('@/img/vip.png')" class="img-vip" alt="">{{ pro.membershipPrice | currency('¥') }}</span>
      </div>
      <div v-else-if="pro.availablePrice" :class="['cms-price-item', {'flex-direction': flexDirection}]">
        <span ref="onePrice" class="template-1">
          <span class="money-type">￥</span>
          <span ref="onePriceInt" class="money-int">{{ (pro.availablePrice).toFixed(2).slice(0, -3) }}</span>
          <span class="money-float">{{ (pro.availablePrice).toFixed(2).slice(-3) }}</span>
        </span>
        <span v-if="pro.originalPrice > pro.availablePrice && getShowTwo" class="price-line-through">{{ pro.originalPrice | currency('¥') }}</span>
      </div>
      <div v-else :class="['cms-price-item', {'flex-direction': flexDirection}]">
        <span class="no-price">{{ $t('暂无价格') }}</span>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    pro: {
      type: Object,
      default: () => {}
    },
    flexDirection: {
      type: Boolean,
      default: false
    },
    onePrice: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fontSize: 0.16
    }
  },
  computed: {
    getShowTwo() {
      if (this.onePrice) {
        return false
      }

      return !(this.pro.promotionPrice >= 1000 || this.pro.membershipPrice >= 1000 || this.pro.availablePrice >= 1000 || this.pro.originalPrice >= 1000)
    }
  },
  watch: {
    pro: {
      handler(newVal) {
        this.$nextTick(() => {
          if (!this.$refs.onePrice) {
            return
          }

          // 修改font-size到显示为止
          while (this.fontSize >= 0.12 && this.$refs.onePrice.clientWidth > this.$refs.onePrice.parentNode.clientWidth) {
            this.fontSize -= 0.01
            this.$refs.onePrice.style.fontSize = this.fontSize + 'rem'
            this.$refs.onePriceInt.style.fontSize = (this.fontSize + 0.03) + 'rem'
          }
        })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    autoFontSize() {

    }
  }
}
</script>

<style lang="less" scoped>
.cms-price {
  .cms-price-item {
    display: flex;
    align-items: baseline;
  }
  .flex-direction {
    flex-direction: column;
  }
  .no-price {
    font-size: .14rem;
    color: #F43142;
    font-weight: bold;
    margin-left: 0.01rem;
  }
  .price-line-through {
    color: #999999;
    font-size: .12rem;
    transform: scale(0.92);
    text-decoration: line-through;
  }
  .price-line {
    color: #999999;
    font-size: .12rem;
    transform: scale(0.92);
    .img-vip {
      display: inline-block;
      width: .12rem;
      height: .12rem;
      margin-right: 0.02rem;
      vertical-align: text-top;
    }
  }
  .template-1 {
    color: #F43142;
    font-size: 0.16rem;
    font-weight: bold;
    margin-right: 0.05rem;
    display: flex;
    align-items: baseline;
    .money-type {
      width: 0.11rem;
      font-size: .12rem;
    }
    .money-int {
      font-size: 0.20rem;
    }
  }
  .point-item {
    display: flex;
    align-items: center;
    color: #F43142;
    &--fdc {
      flex-direction: column;
      align-items: start;
    }
  }
  .point-content {
    display: flex;
    align-items: baseline;
    .point-amount {
      font-size: .2rem;
      font-weight: bold;
    }
    .point-label {
      font-size: .12rem;
      transform: scale(0.83);
    }
  }
  .point-link {
    font-size: .14rem;
    font-weight: 700;
  }
}

</style>
