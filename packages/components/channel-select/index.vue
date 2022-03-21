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
    :item-filter="itemFilter"
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
      default: 'channelCode'
    },
    labelKey: {
      type: String,
      default: 'channelName'
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
    departmentId: {
      type: Number,
      default: null
    },
    department: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  watch: {
    departmentId(newVal) {
      this.setOptions()
    }
  },
  async mounted() {
    await this.setOptions()
  },
  methods: {
    async setOptions() {
      const options = await this.remote()
      this.$refs.select2.setOptions(options)
    },
    async remote() {
      if (this.department) {
        if (this.departmentId) {
          const { data: channelListByDepartmentId } = await this.$api.merchant.queryMerchantChannelListByDepartmentId({
            departmentId: this.departmentId
          })
          return channelListByDepartmentId || []
        }

        return []
      }

      const { data: channelList = {}} = await this.$api.channel.queryChannelMap({})

      return Object.keys(channelList || {}).map(x => channelList[x])
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
