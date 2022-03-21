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

import constants from '@/utils/constants'
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
      cacheKey: 'promotion.type_' + this.promType,
      promotionDictionary: '',
      persellPromotionType: 13 // 预售类型
    }
  },
  mounted() {},
  methods: {
    async initSearchCondition(dictionary) {
      if (this.promType === this.persellPromotionType) {
        const { data = [] } = await this.$promotion.$api.promotion.loadOscConfigUrl('PRESELL_CONTENT_TYPE')
        this.title = this.$t('advance_sale_promotion')
        this.frontPromTypeArr = data.result
        const tempCode = 1
        const tempText = this.$t('deposit_in_advance')
        const promMoneyCode = 1022
        for (let i = 0; i < this.frontPromTypeArr.length; i++) {
          if (this.frontPromTypeArr[i].id === tempCode) {
            this.frontPromTypeArr[i].id = promMoneyCode
            this.frontPromTypeArr[i].text = tempText
          }
        }
      } else {
        if (dictionary) {
          for (let i = 0; i < dictionary.length; i++) {
            if (dictionary[i]['id'] === this.promType) {
              this.title = dictionary[i]['text']
              this.frontPromTypeArr = dictionary[i]['children']
              // 如果是单拼，需要删除第二个：多拼，反之删除第一个，目前这个是写死的
              if (this.promType === 2000 && this.patchGroupModel === 0) {
                this.frontPromTypeArr.splice(1, 1)
              } else if (this.promType === 2000 && this.patchGroupModel === 2) {
                this.frontPromTypeArr.splice(0, 1)
              }
              break
            }
          }
        }
      }

      return this.frontPromTypeArr
    },
    async remote() {
      const data = await this.getLoadPageConfigMethod()
      return data || []
    },
    async getLoadPageConfigMethod() {
      const { data = {}} = await this.$promotion.$api.promotion.loadPageConfigMethod({})

      if (!util.isEmpty(data.allPromotionTypes)) {
        this.promotionDictionary = data.allPromotionTypes
      } else {
        this.promotionDictionary = constants.allPromotionTypes
      }
      return this.initSearchCondition(this.promotionDictionary)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
