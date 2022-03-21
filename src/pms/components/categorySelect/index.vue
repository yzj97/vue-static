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
      switch (action) {
        case 'LOAD_ROOT_OPTIONS':
          await this.loadRootCategory()
          break
        case 'LOAD_CHILDREN_OPTIONS':
          await this.loadChildrenCategory(parentNode)
          break
        default:
      }
    },
    async loadRootCategory() {
      const result = await this.$oms.$api.common.categoryList({ type: 1 })
      if (result.code === '0' && result.data) {
        let datas = result.data
        if (!Array.isArray(datas)) {
          datas = [datas]
        }
        datas.forEach(element => {
          if (element.isLeaves === 2) {
            element.children = null
          }
          this.allData.push(element)
        })
        this.options = datas
      }
    },
    async loadChildrenCategory(parentNode) {
      const result = await this.$oms.$api.common.categoryChildList({ parentId: parentNode.id })
      if (result.code === '0' && result.data) {
        let datas = result.data
        if (!Array.isArray(datas)) {
          datas = [datas]
        }
        datas.forEach(element => {
          if (element.isLeaves === 2) {
            element.children = null
          }
          this.allData.push(element)
        })
        parentNode.children = datas
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
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
