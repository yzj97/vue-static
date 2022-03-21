<template>
  <div class="cp-category-transfer">

    <ody-button
      :disabled="disabled"
      :type="buttonType"
      code="ui"
      size="small"
      @click="visible = true">
      {{ label }}
    </ody-button>
    <template v-if="showCheckedCount">
      已选 <span class="selected"> {{ innerValue.length }} </span> 个
    </template>

    <ody-dialog
      :visible.sync="visible"
      :append-to-body="true"
      title="编辑品类"
      width="960px"
      @close="handleModalClose"
      @open="handleOpen"
    >
      <ody-tree-transfer
        v-loading="loading"
        ref="treeTransfer"
        :data="categoryList"
        :checked.sync="innerSelected"
        :limit="limit"
        :parent-key="categoryType === 8 ? 'parentId': 'pId'"
        style="margin-left: 60px;"
        label-key="name"
        source-label="待选择品类"
        target-label="已选择品类"
        class="tree-transfer"
      />
      <span slot="footer">
        <ody-button code="ui" size="small" @click="handleModalClose">取消</ody-button>
        <ody-button code="ui" size="small" type="primary" @click="handleSubmit">确定</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    limit: {
      type: Number,
      default: Infinity
    },
    disabledIdList: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array,
      default: () => []
    },
    categoryType: {
      type: Number,
      default: 1 // 1后台 2 前台 4商家 6店铺 8优惠券
    },
    params: {
      type: Object,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showCheckedCount: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: '+ 添加品类'
    },
    buttonType: {
      type: String,
      default: 'default'
    },
    valueCheck: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: true,
      visible: false,
      categoryList: [
      ],
      innerValue: [],
      innerSelected: []
    }
  },
  computed: {
    valueMap() {
      return this.value.reduce((rtv, item) => {
        rtv[item] = true
        return rtv
      }, {})
    }
  },
  mounted() {
    this.handleChecked()
  },
  methods: {
    handleChecked() {
      const { length: valueLength } = this.value
      const { length: selectedLength } = this.selected

      if (valueLength > 0 && selectedLength === 0) {
        this.innerValue = this.value

        if (this.$refs.treeTransfer) {
          this.$nextTick(() => {
            this.$refs.treeTransfer.handleSourceToTargetByCheckedKeys(this.value, true)
          })
        }
      } else if (selectedLength > 0 && valueLength === 0) {
        this.innerSelected = this.selected

        if (this.$refs.treeTransfer) {
          this.$nextTick(() => {
            const innerValue = this.$refs.treeTransfer.getTargetLastKeys()
            const nodes = this.$refs.treeTransfer.getTargetLastNodes()
            this.innerValue = innerValue
            this.$emit('input', innerValue)
            this.$emit('update:nodes', nodes)
          })
        } else {
          const lastIdList = this.$portal.getTreeLastItem(this.selected, 'children')
            .map(x => x.id)

          this.innerValue = [... new Set(lastIdList)]
        }
      } else {
        this.innerSelected = this.selected
        this.innerValue = this.value
      }
    },
    async handleOpen() {
      this.loading = true
      let categoryList = []
      let categoryTreeList = []

      if (this.categoryType === 1) {
        const { data: { categorys: categoryMap }} = await this.$api
          .groupManagement
          .getBackCategoryTree(this.params)

        categoryList = Object.keys(categoryMap).reduce((rtv, key) => {
          rtv.push(categoryMap[key])
          return rtv
        }, [])
        categoryTreeList.forEach(x => {
          x.disabled = this.disabledIdList.includes(x.id)
        })
        categoryTreeList = this.$portal.arr2tree(categoryList, 'id', 'children', 'pId', '0')
      } else if (this.categoryType === 4) {
        const { data: merchantCategory } = await this.$api
          .category
          .listCategoryTree(this.params)

        categoryTreeList = this.$portal.tree2arr([merchantCategory])
        categoryTreeList.forEach(x => {
          x.disabled = this.disabledIdList.includes(x.id)
        })
        categoryTreeList = this.$portal.arr2tree(categoryTreeList)
      } else if (this.categoryType === 8) {
        const { data } = await this.$api.groupManagement.constructBackTree(this.params)
        categoryTreeList = [data]
      }

      this.categoryList = categoryTreeList
      this.loading = false

      this.handleChecked()
      this.$emit('open')
    },
    handleModalClose() {
      this.$refs.treeTransfer.$refs.source.setCheckedKeys([])
      this.visible = false
      this.$emit('cancel')
    },
    handleSubmit() {
      const innerValue = this.$refs.treeTransfer.getTargetLastKeys()
      const nodes = this.$refs.treeTransfer.getTargetLastNodes()

      if (this.valueCheck && innerValue.length === 0) {
        this.$message.error(this.$t('请选择需要添加的类目'))
        return
      }

      this.$emit('update:selected', this.innerSelected)
      this.innerValue = innerValue
      this.$emit('input', innerValue)
      this.$emit('update:nodes', nodes)
      this.visible = false
      this.$emit('ok', this.innerSelected)
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-category-transfer {
  display: inline-block;
  .selected {
    color: red;
  }
}
</style>
