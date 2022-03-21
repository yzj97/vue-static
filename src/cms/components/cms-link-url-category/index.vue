<template>
  <div>
    <div class="table-wrapper">
      <el-popover
        placement="bottom"
        width="320">
        <div class="elTree">
          <el-tree
            ref="tree"
            :data="treeData"
            :props="defaultProps"
            :load="loadNode"
            :check-strictly="true"
            :highlight-current="true"
            :expand-on-click-node="false"
            :default-checked-keys="defaultCheckedKeys"
            name="treeData144"
            ictly="true"
            show-checkbox
            node-key="id"
            lazy
            @check-change="handleCheckChange"
            @node-click="handleNodeClick"
          />
        </div>
        <el-button slot="reference" class="reference-button" @click= "handleClick">{{ value.name || '' }}</el-button>
      </el-popover>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    channel: {
      type: String,
      default: ''
    },
    pageType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultCheckedKeys: []
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val.data) {
          this.initChecked(val)
        }
      },
      deep: true
    }
  },
  mounted() {
    this.initChecked(this.value)
  },
  methods: {
    handleClick() {
      this.treeData = []
      this.query()
    },
    initChecked(val) {
      if (val.data) {
        const id = val.data.split('categoryId=')[1].split('&')[0]
        const name = val.data.split('categoryName=')[1]
        this.defaultCheckedKeys.push(id)
        this.editCheckId = Number(id)
        this.value = { id: id, name: name }
        this.$emit('input', this.value)
      } else {
        this.value = {}
        this.editCheckId = ''
        this.defaultCheckedKeys = []
      }
    },
    async handleSubmit() {
      await this.query()
    },
    async query() {
      const category = this.$cms.$api.category
      const key = this.pageType === 18 ? '.categorySettings.18' : '.categorySettings.1'
      await category.getCmsConfig({ key: this.channel + key }).then(res => {
        if (res) {
          category.queryCategoryListByParent({ parentId: res.data }).then(res => {
            if (res) {
              this.treeData = res.data
            }
          })
        }
      })
    },
    handleCheckChange(item, node, self) {
      if (node === true) { // 点击未选中复选框
        this.editCheckId = item.id
        this.$refs.tree.setCheckedKeys([item.id])
        this.$emit('input', item)
      } else {
        if (this.editCheckId === item.id) { // 点击已选中复选框，保证至少一个选中
          this.$refs.tree.setCheckedKeys([])
          this.value = []
          this.defaultCheckedKeys = []
          this.$set(this.value, [])
          this.$emit('input', this.value)
        }
      }
    },
    handleNodeClick(item, node, self) {
      if (this.editCheckId === item.id) {
        this.$refs.tree.setCheckedKeys([])
        this.value = []
        this.defaultCheckedKeys = []
        this.$set(this.value, [])
        this.$emit('input', this.value)
      } else {
        this.editCheckId = item.id
        this.$refs.tree.setCheckedKeys([item.id])
        this.$emit('input', item)
      }
    },
    loadNode(node, resolve) {
      var hasChild
      if (node.data.isLeaves <= 1) {
        hasChild = false
      } else {
        hasChild = true
      }
      const category = this.$cms.$api.category
      category.queryCategoryListByParent({ parentId: node.data.id }).then(res => {
        if (res) {
          setTimeout(() => {
            var data
            if (hasChild) {
              data = res.data
            } else {
              data = []
            }
            resolve(data)
          }, 500)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.table-wrapper{
  min-width: 3.2rem;
  padding-bottom: 0.2rem;
}
.reference-button{
  min-width: 3.2rem;
  min-height: 0.36rem;
}
</style>
