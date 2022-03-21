<!--
 * @Author: your name
 * @Date: 2021-08-10 19:14:59
 * @LastEditTime: 2021-08-19 22:16:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-static/packages/components/promotion-type-select/index.vue
-->
<template>
  <ody-select2
    ref="select2"
    v-model="value"
    :selected.sync="selected"
    :clearable="!(selected && selected.disabled)"
    :multiple="false"
    :popper-append-to-body="false"
    v-bind="$attrs"
    :label-key="labelKey"
    :value-key="valueKey"
    :item-disabled="itemDisabled"
    :item-filter="itemFilter"
    :remote="remote"
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
    itemFilter: {
      type: Function,
      default: (x, index) => {
        return true
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
      const data = await this.getOptions()
      return data || []
    },
    async getOptions() {
      const { data = {}} = await this.$api.promotion.loadOscConfigUrl('promTypeList', {})
      if (data.result) {
        return data.result
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
