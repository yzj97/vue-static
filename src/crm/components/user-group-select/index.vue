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
    :list="list"
    class="cp-user-group-select"
    name="value"
    v-on="$listeners"
    @change="handleChange"
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
      default: 'id'
    },
    labelKey: {
      type: String,
      default: 'groupName'
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
      list: [],
      cacheKey: ''
    }
  },
  methods: {
    async loadByUserClassifyId(userClassifyId) {
      const { data } = await this.$crm.$api.userGroup.listPage({
        'page': 1,
        'limit': 100,
        'filters': {
          userClassifyId
        }
      })

      this.list = data
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
