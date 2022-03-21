<template>
  <div class="cp-coupon-discount-type-radio">
    <ody-radio2
      ref="radio2"
      v-model="value"
      :key="`test${selectType}`"
      :selected.sync="selected"
      :clearable="!(selected && selected.disabled)"
      :multiple="false"
      v-bind="$attrs"
      :label-key="labelKey"
      :value-key="valueKey"
      :item-disabled="itemDisabled"
      :remote="remote"
      name="value"
      v-on="$listeners" />
  </div>
</template>

<script>

import util from '@/utils/util'

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    selected: {
      type: Object,
      default: () => {}
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    labelKey: {
      type: String,
      default: 'text'
    },
    itemDisabled: {
      type: Function,
      default: (x, index) => {
        return false
      }
    },
    promType: {
      type: String,
      default: ''
    },
    selectType: {
      type: Number,
      default: 0
    },
    couponGiveRule: {
      type: Number,
      default: null
    },
    couponDeductionType: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      couponDiscountTypes: []
    }
  },
  mounted() {},
  methods: {
    reload() {
      this.$refs.radio2.reload()
    },
    async remote() {
      const data = await this.getLoadCouponPageConfigUrl()

      if (this.couponGiveRule === 12 || this.couponGiveRule === 102 || this.selectType === 1) {
        return data.filter(x => x.id === 0)
      }

      // console.log('remote-data', data)

      return data || []
    },
    async getLoadCouponPageConfigUrl() {
      const { data = {}} = await this.$promotion.$api.promotion.loadCouponPageConfig('COUPON_PAGE_CONFIG')

      if (!util.isEmpty(data.COUPON_DISCOUNT_TYPE)) {
        return data.COUPON_DISCOUNT_TYPE
      }

      return []
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
