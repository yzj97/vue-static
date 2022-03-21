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
    :remote="remote"
    class="cp-select-dict"
    v-on="$listeners"
  >
    <template slot-scope="scope">
      <slot :item="scope.item"/>
    </template>
  </ody-select2>
</template>

<script>
import OdySelect2 from '../select2'

export default {
  components: {
    OdySelect2
  },
  props: {
    type: {
      type: String,
      default: 'select' // oms listByCategorys
    },
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
    itemFilter: {
      type: Function,
      default: (x, index) => {
        return true
      }
    },
    category: {
      type: String,
      default: '',
      required: true
    },
    pool: {
      type: String,
      default: 'oms',
      required: true
    },
    isNumber: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cacheKey: 'dict_' + this.category
    }
  },
  methods: {
    async remote() {
      const { category, pool } = this

      if (this.type === 'listByCategorys') {
        const { data: { [category]: listObj = [] } = {}} = await this.$api
          .code.listByCategorys({
            pool: pool,
            categorys: [category]
          })

        return listObj
      } else if (this.type === 'select') {
        const { data } = await this.$api
          .code.select({
            pool: pool,
            category: category
          })
        const listObj = []
        Object.keys(data).forEach(item => {
          listObj.push({ code: this.isNumber ? Number(item) : item, name: data[item] })
        })
        return listObj
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
