<template>
  <ody-select2
    ref="select2"
    v-model="value"
    :selected.sync="selected"
    :clearable="!(selected && selected.disabled)"
    v-bind="$attrs"
    :label-key="labelKey"
    :value-key="valueKey"
    :item-disabled="itemDisabled"
    :item-filter="itemFilter"
    :remote="remote"
    class="cp-merchant-select"
    v-on="$listeners"
  >
    <template slot-scope="scope">
      <slot :item="scope.item"/>
    </template>
  </ody-select2>
</template>

<script>
import OdySelect2 from '../select2'

export default {
  components: {
    OdySelect2
  },
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
      default: 'nickname'
    },
    itemDisabled: {
      type: Function,
      default: (x, index) => {
        return false
      }
    },
    itemFilter: {
      type: Function,
      default: (x, index) => {
        return true
      }
    }
  },
  data() {
    return {
    }
  },
  methods: {
    async remote() {
      const { data: { listObj = [] } = {}} = await this.$api.user.getUserOnlyByConditionsWithPage()

      return listObj || []
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
