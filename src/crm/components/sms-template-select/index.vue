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
    class="cp-sms-template-select"
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
      default: 'nodeCode'
    },
    labelKey: {
      type: String,
      default: 'label'
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
      cacheKey: ''
    }
  },
  methods: {
    async remote() {
      const { data: { MC_NODE }} = await this.$crm.$api.messageWarnService.configListMulti({ categorys: ['MC_NODE'], pool: 'osc' })
      const { data } = await this.$crm.$api.messageWarnService.smsGetAll({})
      const smsData = data.filter(x => x.type === 1)

      smsData.forEach(x => {
        x.label = MC_NODE[x.nodeCode]
      })

      return smsData
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
