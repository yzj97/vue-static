<template>
  <div class="cp-application-scope">
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
  </div>
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
      default: 'code'
    },
    labelKey: {
      type: String,
      default: 'name'
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
      applicationScopeArr: [],
      defaultContentTypeSelected: [],
      couponDeductionTypeList: []
    }
  },
  mounted() {},
  methods: {
    async remote() {
      const data = await this.getPublicCodeSelect()
      data.forEach(i => {
        i.code = +i.code
      })
      return data
    },
    async getPublicCodeSelect() {
      const { data } = await this.$promotion.$api.promotion.getPublicCodeSelect({
        category: 'ORDER_SOURCE'
      })
      return data || []
    }
  }
}
</script>

<style lang="scss" scoped>
  .cp-application-scope{
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
