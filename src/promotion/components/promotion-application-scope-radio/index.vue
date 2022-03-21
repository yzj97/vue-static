<template>
  <div class="cp-application-scope">
    <ody-radio2
      v-model="value"
      :selected.sync="selected"
      :clearable="!(selected && selected.disabled)"
      :multiple="false"
      v-bind="$attrs"
      :label-key="labelKey"
      :value-key="valueKey"
      :item-disabled="itemDisabled"
      :remote="remote"
      name="value"
      v-on="$listeners"
    />
    <div class="tip">注：选择商家券仅可作用于商家商品,选择平台券则可作用于全平台商品。平台券可与其他商家券叠加使用。</div>
  </div>
</template>

<script>
import constants from '@/utils/constants'
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
    }
  },
  data() {
    return {
      applicationScopeArr: [],
      defaultContentTypeSelected: [],
      couponDeductionTypeList: []
    }
  },
  mounted() {},
  methods: {
    async remote() {
      const data = await this.getLoadOscConfigUrl()
      return data || []
    },
    async getLoadOscConfigUrl() {
      const { data = {}} = await this.$promotion.$api.promotion.loadCouponPageConfig('COUPON_PAGE_CONFIG', {})
      if (!util.isEmpty(data.COUPON_DEDUCTION_TYPE)) {
        this.couponDeductionTypeList = data.COUPON_DEDUCTION_TYPE
      }
      this.applicationScopeArr = constants.applicationScopeList
      // 设置默认值

      if (!util.isEmpty(this.applicationScopeArr)) {
        this.defaultContentTypeSelected = []
        for (var i = 0; i < this.applicationScopeArr.length; i++) {
          this.defaultContentTypeSelected.push(this.applicationScopeArr[i].id)
        }
        if (this.defaultContentTypeSelected.indexOf(this.value) === -1) {
          this.value = this.applicationScopeArr[0].id
        }
      }
      return this.applicationScopeArr
    }
  }
}
</script>

<style lang="scss" scoped>
  .cp-application-scope{
    .tip{
      display: inline-block;
      height:32px;
      font-size:12px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(69,90,100,1);
      line-height:16px;
    }
  }
</style>
