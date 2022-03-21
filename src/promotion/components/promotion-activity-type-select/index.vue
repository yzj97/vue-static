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
    :list="activityTypeList"
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
import constant from '@/utils/constants'

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
      default: 'value'
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
    },
    promType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      activityTypeList: constant.activityTypeList
    }
  },
  mounted() {},
  methods: {
    async getChannelCodeByBusinessAndOscConfig(type, API) {
      try {
        // 保存配置渠道信息
        let channelArrByPageConfig = await this.getChannelArrByPageConfig(API)
        // 保存商家渠道信息
        const channelArrByBusiness = await this.getChannelArrByBusiness(API)

        // 取OSC配置渠道信息
        channelArrByPageConfig.forEach(function(item) {
          if (item.promotionType === type) {
            channelArrByPageConfig = item.channelCodes
          }
        })
        // 商家渠道信息和配置的渠道信息code取交集
        return channelArrByPageConfig.map((item) => {
          return channelArrByBusiness[item]
        }).filter(x => x)
      } catch (ex) {
        console.error(ex)
      }
    },
    // 读取配置渠道信息
    async getChannelArrByPageConfig(API) {
      return new Promise((resolve, reject) => {
        API.loadOscConfigUrl('PROMOTION_CHANNEL_CODES').then(response => {
          if (!util.isEmpty(response) && !util.isEmpty(response.data) && !util.isEmpty(response.data.result)) {
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
      const data = await this.getChannelCodeByBusinessAndOscConfig(this.promType, this.$promotion.$api.promotion)
      return data || []
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
