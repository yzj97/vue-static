<template>
  <div>
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
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array,
      default: () => []
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
  mounted() {
    // console.log(this.value)
  },
  methods: {
    async getLoadPageConfigUrl() {
      const {
        data = []
      } = await this.$promotion.$api.promotion.queryMemberTypeList({})
      return data || []
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
