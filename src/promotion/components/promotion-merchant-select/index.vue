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
    class="cp-select-merchant"
    name="value"
    v-on="$listeners"
  >
    <template slot-scope="scope">
      <slot :item="scope.item"/>
    </template>
  </ody-select2>
</template>

<script>

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    search: {
      type: Object,
      default: () => {}
    },
    selected: {
      type: Object,
      default: () => {}
    },
    valueKey: {
      type: String,
      default: 'merchantId'
    },
    labelKey: {
      type: String,
      default: 'merchantName'
    },
    itemDisabled: {
      type: Function,
      default: (x, index) => {
        return false
      }
    }
  },
  data() {
    return {
      cacheKey: 'merchant'
    }
  },
  methods: {
    async remote() {
      if (!this.search) {
        this.search = {}
      }

      const allAuthMerchant = await this.queryAuthMerchantPageUrl()
      const merchantArr = []
      const { data: { listObj = [] } = {}} = await this.$promotion.$api.promotion.querySelectedMerchantUrl(this.search)

      listObj.forEach((x) => {
        allAuthMerchant.forEach((item) => {
          if (x.merchantId === item.merchantId) {
            var merchantObj = {
              'merchantId': item.merchantId,
              'merchantName': item.merchantName
            }
            merchantArr.push(merchantObj)
          }
        })
      })

      return merchantArr || []
    },
    async queryAuthMerchantPageUrl() {
      const { data: { listObj = [] } = {}} = await this.$promotion.$api.promotion.queryAuthMerchantPageUrl({
        currentPage: 1,
        itemsPerPage: 30000
      })
      return listObj || []
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
