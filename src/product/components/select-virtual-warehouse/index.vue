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
      default: 'id'
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
    merchantId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      cacheKey: 'product.virtualWarehouse' + this.merchantId
    }
  },
  methods: {
    async remote() {
      const { merchantId } = this
      const { data: { listObj = [] }} = await this.$product.$api
        .stockApi.listStoreWarehouseWithPage({
          merchantId,
          'isVirtualWarehouse': 1,
          'itemsPerPage': 100
        })

      return listObj
        .filter(x => x.warehouseType !== 2)
        .map(x => {
          return {
            ...x,
            isAvailable: 1
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
