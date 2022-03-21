<template>
  <div>
    <section class="pg-categorySelect" >
      <ody-tree-select
        v-model="model"
        :load-options="loadOptions"
        :disable-branch-nodes="true"
        :auto-load-root-options="false"
        :options="options"
        :normalizer="normalizer"
        :append-to-body="true"
        :z-index="3000"
        name="model"
        @input="changeInput"
        @select="select">
        <label slot="option-label" slot-scope="{ node, labelClassName}" :class="labelClassName" >
          {{ node.raw.name }}
        </label>
      </ody-tree-select>
    </section>
  </div>
</template>

<script>

export default {
  props: {
    model: {
      type: Object,
      default: null
    },
    displayFullName: {
      type: Boolean,
      default: true
    },
    merchantId: {
      type: Number,
      default: null

    }
  },
  data() {
    const self = this
    return {
      options: null,
      allData: [],
      normalizer(node) {
        return {
          id: node.id,
          label: self.displayFullName && node.fullNamePath ? node.fullNamePath : node.name,
          name: node.name,
          children: node.children
        }
      }
    }
  },
  methods: {
    async loadOptions({ action, parentNode, callback }) {
      await this.loadRootCategory()
    },
    async loadRootCategory() {
      if (this.merchantId) {
        const result = await this.$agent.$api.common.merchantCategoryList({ merchantId: this.merchantId })
        if (result.code === '0' && result.data) {
          let datas = result.data
          if (!Array.isArray(datas)) {
            datas = [datas]
          }
          datas.forEach(element => {
            this.allData.push(element)
          })
          this.options = toTree(datas)
        }
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('common_choose_merchant')
        })
        return
      }
    },
    select(node, instanceId) {
      this.$emit('select', node)
    },
    changeInput(value, instanceId) {
      if (!this.model) {
        this.$emit('clean')
      } else {
        for (let i = 0; i < this.allData.length; i++) {
          if (this.allData[i].id === this.model) {
            this.$emit('select', this.allData[i])
            return
          }
        }
      }
    },
    cleanSelected() {
      this.model = null
    },
    cleanOptions() {
      this.options = null
    }
  }
}
function toTree(data) {
  data.forEach(function(item) {
    delete item.children
  })
  var map = {}
  data.forEach(function(item) {
    map[item.id] = item
  })
  var val = []
  data.forEach(function(item) {
    var parent = map[item.parentId]
    item.label = item.name
    if (parent) {
      (parent.children || (parent.children = [])).push(item)
    } else {
      val.push(item)
    }
  })
  return val
}
</script>

<style lang="scss" scoped>

</style>
