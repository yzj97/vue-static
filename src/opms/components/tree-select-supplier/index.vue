<template>
  <ody-tree-select
    ref="treeSelect"
    :value="value"
    :load-options="loadOptions"
    :options="options"
    :auto-load-root-options="false"
    :normalizer="normalizer"
    :placeholder="placeholder"
    v-bind="$attrs"
    @input="handleInput"
    @select="handleSelect"
    v-on="$listeners"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: [Array, String, Number],
      default: null
    },
    selected: {
      type: Object,
      default: () => {}
    },
    merchantId: {
      type: Number,
      default: null
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    labelKey: {
      type: String,
      default: 'name'
    },
    childrenKey: {
      type: String,
      default: 'children'
    }
  },
  data() {
    return {
      options: null,
      placeholder: '选择供应商类别'
    }
  },
  async mounted() {
    if (this.value) {
      await this.reload()
    }
  },
  methods: {
    async reload() {
      this.options = await this.remote()
    },
    handleInput(newVal) {
      this.$emit('input', newVal)

      if (!newVal) {
        this.$emit('update:selected', {})
      }
    },
    handleSelect(node) {
      this.$emit('update:selected', node)
    },
    normalizer(node) {
      return {
        id: node[this.valueKey],
        label: node[this.labelKey],
        children: node[this.childrenKey]
      }
    },
    async loadOptions({ action }) {
      if (action === 'LOAD_ROOT_OPTIONS') {
        this.options = await this.remote()
      }
    },
    async remote() {
      const { merchantId } = this
      const status = 1

      const {
        data
      } = await this.$opms.$api.supplier.querySupplierClassificationTree({
        merchantId,
        status
      })

      return this.remoteChildrenNull(data)
    },
    remoteChildrenNull(data = []) {
      data.forEach(item => {
        if (item.children === null) {
          delete item.children
        } else {
          item.children = this.remoteChildrenNull(item.children)
        }
      })
      return data
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
