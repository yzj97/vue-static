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
    promType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {

    }
  },
  mounted() {},
  methods: {
    async getChannelCodeByBusinessAndOscConfig(API) {
      try {
        // 保存商家渠道信息
        const channelArrByBusiness = await this.getChannelArrByBusiness(API)
        const channelArrByBusinessArr = []
        let item
        for (item in channelArrByBusiness) {
          channelArrByBusinessArr.push(channelArrByBusiness[item])
        }
        return channelArrByBusinessArr
      } catch (ex) {
        console.error(ex)
      }
    },
    // 读取商家渠道信息
    async getChannelArrByBusiness(API) {
      return new Promise(resolve => {
        API.queryChannelMap().then(response => {
          if (!util.isEmpty(response.data)) {
            resolve(response.data)
            return false
          }
          response([])
        })
      })
    },
    async remote() {
      const data = await this.getChannelCodeByBusinessAndOscConfig(this.$promotion.$api.promotion)
      return data || []
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
