<template>
  <div>
    <section>
      <ody-dialog
        :visible="visible"
        :before-close="handleClose"
        :title="$t('common_mp_category')"
        width="35%"
        @open="init"
      >
        <el-tree
          ref="tree"
          :data="data"
          :props="defaultProps"
          :default-checked-keys="checkedKeys"
          name="data428"
          show-checkbox
          default-expand-all
          node-key="id"
          highlight-current
        />
        <el-form ref="editCateForm" :model="editCateForm">
          <el-form-item>
            <ody-button
              name="OpmsPurchaseCertificateList06_onSubmit"
              type="primary"
              code="OpmsPurchaseCertificateList06"
              @click="onSubmit"
            >{{ $t('common_save') }}</ody-button>
            <el-button name="handleClose" @click="handleClose">{{ $t('common_cancel') }}</el-button>
          </el-form-item>
        </el-form>
      </ody-dialog>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    displayFullName: {
      type: Boolean,
      default: true
    },
    modalType: {
      type: String,
      required: true
    },
    selectedCate: {
      type: Object,
      default: null
    }
  },
  data() {
    const self = this
    return {
      editCateForm: {},
      checkedKeys: [],
      options: null,
      model: null,
      data: null,
      normalizer(node) {
        return {
          id: node.id,
          label:
            self.displayFullName && node.fullNamePath
              ? node.fullNamePath
              : node.name,
          name: node.name,
          children: node.children
        }
      }
    }
  },
  methods: {
    init() {
      console.log('子组件中获取的cates：' + JSON.stringify(this.selectedCate))
      if (this.selectedCate !== null) {
        this.data = this.selectedCate.data
        // 根据id查询关系表中是否存在关联关系，
        console.log(
          '已存在的关系：' + JSON.stringify(this.selectedCate.checkedList)
        )
        // 如果存在将对应的结点标记为选中
        if (this.selectedCate.checkedList) {
          this.checkedKeys = this.selectedCate.checkedList
        }
      }
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
      this.visible = false
    },
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
      const result = await this.$opms.$api.purchaseCert.categoryList({
        type: 1
      })
      if (result.code === '0' && result.data) {
        let datas = result.data
        if (!Array.isArray(datas)) {
          datas = [datas]
        }
        datas.forEach(element => {
          if (element.isLeaves === 2) {
            element.children = null
          }
        })
        this.options = datas
      }
    },
    async loadChildrenCategory(parentNode) {
      const result = await this.$opms.$api.purchaseCert.categoryChildList({
        parentId: parentNode.id
      })
      if (result.code === '0' && result.data) {
        let datas = result.data
        if (!Array.isArray(datas)) {
          datas = [datas]
        }
        datas.forEach(element => {
          if (element.isLeaves === 2) {
            element.children = null
          }
        })
        parentNode.children = datas
      }
    },
    select(node) {
      // this.$emit('select', node)
    },
    changeInput() {
      if (!this.model) {
        this.$emit('clean')
      }
    },
    cleanSelected() {
      this.model = null
    },
    async onSubmit() {
      let promise
      if (this.modalType === 'create') {
        console.log(
          '子组件获得的cate数据：' + JSON.stringify(this.selectedCate)
        )
        promise = await this.$opms.$api.purchaseCert.addCate({
          certificateId: this.selectedCate.id,
          categorysId: this.$refs.tree.getCheckedKeys()
        })
      } else {
        // 如果是更新，将原来的数据删除，新增即可
        await this.$opms.$api.purchaseCert
          .delCate(this.selectedCate.id)
          .then(async() => {
            promise = await this.$opms.$api.purchaseCert.addCate({
              certificateId: this.selectedCate.id,
              categorysId: this.$refs.tree.getCheckedKeys()
            })
          })
      }
      if (promise) {
        this.$emit('ok')
        this.handleClose()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
