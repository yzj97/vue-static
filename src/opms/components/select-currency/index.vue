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
      <slot :item="scope.item" />
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
    selected: {
      type: Object,
      default: () => {}
    },
    // 键
    valueKey: {
      type: String,
      default: 'currencyCode'
    },
    // 值
    labelKey: {
      type: String,
      default: 'currencyCode'
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
      // 缓存的key，添加后当前生命周期内之后访问一次接口
      cacheKey: 'opms.currency'
    }
  },
  methods: {
    // 请求远程接口
    async remote() {
      const { data = [] } = await this.$opms.$api.common.queryCurrencyList()

      return data || []
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
