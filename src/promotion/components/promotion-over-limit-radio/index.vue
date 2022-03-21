<template>
  <div class="cp-over-limit">
    <ody-radio2
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
    />
    <div class="tip">{{ $t('single_promotion_text_1') }}</div>
  </div>
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
      const data = await this.getLoadOscConfigUrl()
      return data || []
    },
    async getLoadOscConfigUrl() {
      const { data = {}} = await this.$promotion.$api.promotion.loadOscConfigUrl('overlimitRule', {})
      if (!util.isEmpty(data.result)) {
        return data.result
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .cp-over-limit{
    .tip{
      display: inline-block;
      height:32px;
      font-size:12px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(69,90,100,1);
      line-height:16px;
    }
  }
</style>
