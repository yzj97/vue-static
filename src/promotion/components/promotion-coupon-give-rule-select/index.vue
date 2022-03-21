<template>
  <ody-select2
    ref="select2"
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
  >
    <template slot-scope="scope">
      <slot :item="scope.item"/>
    </template>
  </ody-select2>
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
    }
  },
  data() {
    return {

    }
  },
  mounted() {},
  methods: {
    async remote() {
      const data = await this.getLoadCouponPageConfig()
      return data || []
    },
    async getLoadCouponPageConfig() {
      const { data = {}} = await this.$promotion.$api.promotion.loadCouponPageConfig('COUPON_PAGE_CONFIG', {})
      if (!util.isEmpty(data.COUPON_GIVE_RULE_ALL)) {
        if (data.platformId === 1) {
          this.$emit('platformId', 1)
          return data.COUPON_GIVE_RULE_ALL[1]
        }
        if (data.platformId === 2) {
          this.$emit('platformId', 2)
          return data.COUPON_GIVE_RULE_ALL[2]
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
