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
      default: 'template_id'
    },
    labelKey: {
      type: String,
      default: 'title'
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
      const { data: { template_list }} = await this.$crm.$api.wechat.getPrivateTemplate({ })

      return template_list
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
