<template>
  <ody-tree-select
    v-model="value"
    :show-count="true"
    :options="options"
    v-bind="$attrs"
    :normalizer="normalizer"
    :append-to-body="true"
    :z-index="3000"
    class="cp-select-organization"
    v-on="$listeners"
  />
</template>

<script>
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    value: {
      type: String,
      default: null
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
      default: 'name'
    }
  },
  data() {
    return {
      options: [
      ]
    }
  },
  async mounted() {
    this.options = await this.remote()
  },
  methods: {
    normalizer(node) {
      return {
        id: node[this.valueKey],
        label: node[this.labelKey],
        children: node.children
      }
    },
    async remote() {
      const { data = [] } = await this.$api.department.list()
      const options = this.$portal.arr2tree(data, 'code', 'children', 'parentCode', '0')

      return options
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
