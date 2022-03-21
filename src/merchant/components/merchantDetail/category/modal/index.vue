<template>
  <div>
    <ody-dialog :visible="visible" :before-close="closeModal" :title="$t('类目选择')" width="800px" @open="init">
      <div >
        <el-tree
          v-if="visible"
          ref="tree"
          :load="loadNode"
          check-strictly="true"
          node-key="id"
          lazy
          show-checkbox
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button name="closeModal" @click="closeModal">{{ $t('取消') }}</el-button>
        <ody-button v-if="!onlyRead" id="saveCategory" :disabled="submiting" name="MerchantManageCategorySave_saveCategory" code="MerchantManageCategorySave" type="primary" @click="saveCategory">{{ '保存' }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orgId: {
      type: Number,
      default: null
    },
    categoryIds: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      categoryList: {},
      submiting: false
    }
  },
  methods: {
    init: function() {
    },
    async loadNode(node, resolve) {
      if (node.level === 0) {
        const list = await this.getCategoryList()
        resolve(list)
      } else {
        const list = await this.loadCategory(node)
        resolve(list)
      }
    },
    async loadCategory(parentNode) {
      const {
        data: listObj
      } = await this.$merchant.$api.productService.queryCategoryListByParent({
        parentId: parentNode.data.id
      })
      if (!listObj) {
        return []
      }
      const disabled = parentNode.level !== 1

      const children = []
      listObj.forEach(x => {
        this.$set(this.categoryList, x.id, x)
        const rtv = {
          id: x.id,
          label: x.name
        }
        if (disabled) {
          rtv.disabled = true
        }
        // 已经有的不能添加
        if (this.categoryIds && this.categoryIds.indexOf(x.id) !== -1) {
          rtv.disabled = true
          return
        }
        if (x.isLeaves === 2) {
          rtv.children = null
        } else {
          rtv.isLeaf = true
        }
        children.push(rtv)
      })
      return children
    },
    async getCategoryList() {
      try {
        const {
          data: listObj
        } = await this.$merchant.$api.productService.getBackgroundDetailUrl()

        if (!listObj) {
          return []
        }
        const categoryList = [
          {
            id: listObj.id,
            label: listObj.name,
            disabled: true,
            children: null
          }
        ]
        this.$set(this.categoryList, listObj.id, listObj)
        return categoryList
      } catch (ex) {
        console.log(ex)
      }
    },
    getCheckedNodes() {
      const keys = this.$refs.tree.getCheckedKeys()
      const checkedNodes = []
      if (keys.length > 0) {
        keys.forEach(item => {
          if (this.categoryList[item]) {
            checkedNodes.push(this.categoryList[item])
          }
        })
      }
      return checkedNodes
    },
    closeModal() {
      const self = this
      self.$emit('update:visible', !self.visible)
    },
    saveCategory() {
      const self = this
      const checkedNodes = this.getCheckedNodes()
      if (checkedNodes.length === 0) {
        self.$message({
          type: 'warning',
          message: '请选择节点'
        })
        return
      }
      checkedNodes.forEach(item => {
        item.merchantId = self.orgId
      })
      self.submiting = true
      self.$merchant.$api.productService.applyCategory(checkedNodes).then(res => {
        if (res.code === '0') {
          self.$emit('update:visible', !self.visible)
          self.$emit('ok')
        }
      }).finally(res => {
        self.submiting = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
