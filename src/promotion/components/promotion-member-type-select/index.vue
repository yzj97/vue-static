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
      default: 'memberType'
    },
    labelKey: {
      type: String,
      default: 'memberTypeName'
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
      const data = await this.getQueryMemberTypeList()
      return data || []
    },
    async getQueryMemberTypeList() {
      const { data = {}} = await this.$promotion.$api.promotion.queryMemberTypeList({})
      if (!util.isEmpty(data)) {
        return data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
