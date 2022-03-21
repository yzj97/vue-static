<template>
  <div class="">
    <!-- {{ formatCouponAmount(innerCoupon) }} -->
    <span v-if="coupon.couponDiscountType === 0 && coupon.ruleType === 4"> {{ coupon.couponAmount }}{{ coupon.couponUnit }} 折扣上限{{ coupon.useUpLimit }} </span>
    <span v-if="coupon.couponDiscountType === 0 && coupon.ruleType === 5">{{ coupon.couponAmount }}{{ coupon.couponUnit }}</span>
    <span v-if="coupon.couponDiscountType === 1 && coupon.ruleType === 4"> {{ coupon.couponAmount }}{{ coupon.couponUnit }}, 折扣上限{{ coupon.useUpLimit }}</span>
    <!-- {{ coupon.couponAmount }} -->
  </div>
</template>

<script>
export default {
  props: {
    coupon: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      innerCoupon: {}
    }
  },
  // watch: {
  //   coupon: {
  //     handler(newVal) {
  //       console.log(newVal, 77777)
  //       this.innerCoupon = newVal
  //     },
  //     deep: true,
  //     messageimmediate: true
  //   }
  // },
  created() {
    // console.log(this.coupon, 9999)
  },
  methods: {
    // formatCouponAmount(e) {
    //   // debugger
    //   if (!e.ruleType) {
    //     return ''
    //   }
    //   if (e.couponDiscountType === 0) {
    //     if (e.ruleType === 5) {
    //       return e.couponAmount + this.$t('元')
    //     }
    //     if (e.ruleType === 7) {
    //       return e.couponAmount + this.$t('元') + '~' + e.couponAmountExt1 + this.$t('元')
    //     }
    //   }
    //   if (e.couponDiscountType === 1) {
    //     return e.couponAmount + this.$t('折') + '，' + this.$t('折扣上限') + e.useUpLimit + this.$t('元')
    //   }
    //   return ''
    // }
  }
}
</script>

<style lang="scss" scoped>
</style>
