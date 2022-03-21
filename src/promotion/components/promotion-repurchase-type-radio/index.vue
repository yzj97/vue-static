<template>
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
</template>

<script>
import constants from '@/utils/constants'
// import util from '@/utils/util'

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
      platformId: '',
      contentTypeArr: [],
      defaultPromTypeSelected: []
    }
  },
  mounted() {},
  methods: {
    async remote() {
      const data = await this.getLoadPageConfigMethod()
      return data || []
    },
    async getLoadPageConfigMethod() {
      const {
        data = {}
      } = await this.$promotion.$api.promotion.loadPageConfigMethod({})
      this.platformId = data.platformId

      this.contentTypeArr = constants.repurchasePromotionContentType

      return this.contentTypeArr
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
