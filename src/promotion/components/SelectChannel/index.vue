<template>
  <!-- <ody-checkbox
    v-if="list.length"
    :list="list"
    :checked.sync="channelCodes"
    :normalizer="normalizer"
    :select-all="true"
    :tips-list="tipsList"
    @change="handleCheckChange"
    @change-select-all="handleCheckAllChange"/> -->
  <div/>
</template>

<script>
import { getChannelCodeByBusinessAndOscConfig } from '../../services/utilService'
import { getMeituanTips, getJDTips } from '../../services/constantService'
export default {
  props: {
    promType: {
      type: Number,
      default: -1
    },
    channelCodes: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      list: [],
      tipsList: [
        {
          channelCode: '210003',
          channelName: this.getTipsByPromType(getMeituanTips())
        },
        {
          channelCode: '210004',
          channelName: this.getTipsByPromType(getJDTips())
        }
      ]
    }
  },
  async mounted() {
    this.promotionAPI = this.$promotionStatic.$api.promotion
    // 此处取渠道
    this.list = await getChannelCodeByBusinessAndOscConfig(this.promType, this.promotionAPI)
    // 全选有异步延迟，页面展示不对，这里手动操作下
    await this.$emit('update:channelCodes', this.list ? this.list.map((item) => {
      return item.channelCode
    }) : [])
  },
  methods: {
    normalizer(node) {
      return {
        id: node.channelCode,
        label: node.channelName
      }
    },
    getTipsByPromType(tipsList) {
      let tips = ''
      const promotionType = this.promType
      tipsList.forEach(function(tip) {
        if (tip.id === promotionType) {
          tips = tip.text
        }
      })
      return this.$t(tips)
    },
    handleCheckAllChange(val) {
      this.$emit('update:channelCodes', val ? this.list.map((item) => {
        return this.normalizer(item).id
      }) : [])
    },
    handleCheckChange(val) {
      this.$emit('update:channelCodes', val)
    }
  }
}
</script>
