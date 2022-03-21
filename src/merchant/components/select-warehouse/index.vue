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

export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
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
      default: 'warehouseCode'
    },
    labelKey: {
      type: String,
      default: 'warehouseName'
    },
    itemDisabled: {
      type: Function,
      default: (x, index) => {
        return false
      }
    },
    warehouseType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      cacheKey: 'merchant.warehouse_' + this.warehouseType
    }
  },
  methods: {
    async remote() {
      const merchantId = await this.getMerchantId()
      const { warehouseType } = this
      const { data = [] } = await this.$merchant.$api
        .warehouseService.listStoreWarehouseByParam({
          merchantId,
          warehouseType
        })

      return data || []
    },
    async getMerchantId() {
      const { orgId, entityType, showTab, channelMode } = this.$route.params
      const { data = {}} = await this.$merchant.$api
        .storeService.queryStoreInfo({
          orgId,
          entityType,
          showTab,
          channelMode
        })

      return data.merchantId
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
