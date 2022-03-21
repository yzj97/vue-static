<template>
  <ody-checkbox2
    ref="ody-checkbox2"
    v-model="value"
    :selected.sync="selected"
    :clearable="!(selected && selected.disabled)"
    :multiple="false"
    v-bind="$attrs"
    :label-key="labelKey"
    :value-key="valueKey"
    :item-disabled="itemDisabled"
    :remote="remote"
    :is-show-all="isShowAll"
    :checked-all="checkedAll"
    name="value"
    v-on="$listeners"
  >
    <template slot-scope="scope">
      <slot :item="scope.item" />
    </template>
  </ody-checkbox2>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
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
      type: Number,
      default: 0
    },
    isShowAll: {
      type: Boolean,
      default: false
    },
    checkedAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    async getLoadPageConfigUrl() {
      const {
        data = {}
      } = await this.$promotion.$api.promotion.loadPageConfigMethod({})
      return data.userScope || []
    },
    async remote() {
      const data = await this.getLoadPageConfigUrl(
        this.$promotion.$api.promotion
      )
      return data || []
    }
  }
}
</script>

<style lang="scss" scoped></style>
