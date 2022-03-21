<template>
  <ody-select2
    ref="select2"
    v-model="value"
    :selected.sync="selected"
    :clearable="!(selected && selected.disabled)"
    :multiple="false"
    v-bind="$attrs"
    :label-key="labelKey"
    :popper-append-to-body="false"
    :value-key="valueKey"
    :item-disabled="itemDisabled"
    :remote="remote"
    name="value"
    v-on="$listeners"
  >
    <template slot-scope="scope">
      <slot :item="scope.item" />
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
    return {}
  },
  mounted() {},
  methods: {
    async getChannelCodeByBusinessAndOscConfig(type, API) {
      try {
        // 保存配置渠道信息
        let channelArrByPageConfig = await this.getChannelArrByPageConfig(API)
        // 保存商家渠道信息
        const channelArrByBusiness = await this.getChannelArrByBusiness(API)
        let channelCodeArr = []
        // 取OSC配置渠道信息
        channelArrByPageConfig.forEach(function(item) {
          if (item.promotionType === type) {
            channelArrByPageConfig = item.channelCodes
          }
        })
        var arr = []
        // 商家渠道信息和配置的渠道信息code取交集
        channelArrByPageConfig.map(item => {
          if (channelArrByBusiness[item]) {
            channelCodeArr = channelArrByBusiness[item]
            this.$emit('channelCodeArr', channelCodeArr)
            arr.push(channelArrByBusiness[item])
          }
        })
        return arr
      } catch (ex) {
        console.error(ex)
      }
    },
    // 读取配置渠道信息
    async getChannelArrByPageConfig(API) {
      return new Promise((resolve, reject) => {
        API.loadOscConfigUrl('PROMOTION_CHANNEL_CODES').then(response => {
          if (
            !util.isEmpty(response) &&
            !util.isEmpty(response.data) &&
            !util.isEmpty(response.data.result)
          ) {
            resolve(response.data.result)
            return false
          }
          resolve([])
        }, reject)
      })
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
      const data = await this.getChannelCodeByBusinessAndOscConfig(
        this.promType,
        this.$promotion.$api.promotion
      )
      this.$emit('channelCodeArr', data)
      return data || []
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
