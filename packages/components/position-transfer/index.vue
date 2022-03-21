<template>
  <div class="cp-position-transfer">
    <ody-button
      :disabled="disabled"
      code="ui"
      size="small"
      type="default"
      @click="visible = true">{{ label }}</ody-button>
    <template v-if="showCheckedCount">
      已选
      <span class="selected">{{ innerValue.length }}</span> 个
      <el-button type="text" @click="handleClear">清空</el-button>

      <div>
        <el-tag
          v-for="(selected, selectedIndex) in innerSelected"
          :key="selectedIndex"
          type="info"
          size="small"
          closable
          @close="handleClose(selected)"
        >
          {{ selected.positionName }}
        </el-tag>
      </div>
    </template>
    <ody-dialog
      :visible.sync="visible"
      :append-to-body="true"
      title="编辑岗位"
      width="960px"
      @before-close="handleModalClose"
      @open="handleOpen"
    >
      <ody-tree-transfer
        v-loading="loading"
        ref="treeTransfer"
        :data="brandList"
        :checked.sync="innerSelected"
        :limit="limit"
        :source-filter="sourceFilter"
        style="margin-left: 60px;"
        label-key="positionName"
        source-label="待选择岗位"
        target-label="已选择岗位"
        class="tree-transfer"
      >
        <template slot="left-footer">
          <ody-button v-if="showLoadMore" code="ui" type="text" size="small" @click="handleLoadMore">加载更多</ody-button>
        </template>
      </ody-tree-transfer>
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
    value: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array,
      default: () => []
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
      default: '+添加岗位'
    }
  },
  data() {
    return {
      loading: true,
      visible: false,
      brandList: [],
      showLoadMore: false,
      nextPage: 1,
      innerValue: [],
      innerSelected: [],
      sourceFilterText: '',
      sourceFilterTaskList: [],
      sourceFilterIsRunning: false
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
    async confrim() {
      return await this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    updateAndEmit() {
      this.$emit('update:selected', this.innerSelected)
      this.$emit('update:value', this.innerValue)
      this.$emit('ok', this.innerSelected)
    },
    async handleClear() {
      if (!await this.confrim()) {
        return
      }
      this.innerValue = []
      this.innerSelected = []
      this.updateAndEmit()
    },
    async handleClose(selected) {
      if (!await this.confrim()) {
        return
      }

      const { id } = selected
      const innerValueIndex = this.innerValue.findIndex(x => x === id)
      const innerSelectedIndex = this.innerSelected.findIndex(x => x.id === id)

      this.innerValue.splice(innerValueIndex, 1)
      this.innerSelected.splice(innerSelectedIndex, 1)
      this.updateAndEmit()
    },
    async sourceFilter(val) {
      if (this.sourceFilterIsRunning) {
        this.sourceFilterTaskList = [this.sourceFilterTaskList[0], val]
      } else {
        this.sourceFilterTaskList = [val]
        this.sourceFilterRun()
      }
    },
    async handleLoadMore() {
      await this.loadBrandList(this.nextPage)
    },
    handleChecked() {
      const { length: valueLength } = this.value
      const { length: selectedLength } = this.selected

      if (valueLength > 0 && selectedLength === 0) {
        this.innerValue = this.value

        if (this.$refs.treeTransfer) {
          this.$nextTick(() => {
            this.$refs.treeTransfer.handleSourceToTargetByCheckedKeys(
              this.value,
              true
            )
          })
        }
      } else if (selectedLength > 0 && valueLength === 0) {
        this.innerSelected = this.selected

        if (this.$refs.treeTransfer) {
          this.$nextTick(() => {
            const innerValue = this.$refs.treeTransfer.getTargetLastKeys()
            this.innerValue = innerValue
            this.$emit('input', innerValue)
          })
        } else {
          const lastIdList = this.$portal
            .getTreeLastItem(this.selected, 'children')
            .map(x => x.id)

          this.innerValue = [...new Set(lastIdList)]
        }
      } else {
        this.innerSelected = this.selected
        this.innerValue = this.value
      }
    },
    async handleOpen() {
      this.loading = true
      await this.loadBrandList(1)
      this.loading = false

      this.handleChecked()
      this.$emit('open')
    },
    async sourceFilterRun() {
      if (this.sourceFilterTaskList.length > 0) {
        const sourceFilterText = this.sourceFilterTaskList[0]
        this.sourceFilterIsRunning = true
        this.sourceFilterText = sourceFilterText
        await this.loadBrandList(1)
        this.sourceFilterTaskList.shift()
        this.sourceFilterRun()
      } else {
        this.sourceFilterIsRunning = false
        this.sourceFilterTaskList = []
      }
    },
    async loadBrandList(currentPage) {
      this.showLoadMore = false
      const {
        data: { listObj: brandList, total }
      } = await this.$api.position.queryPositionList({
        positionName: this.sourceFilterText,
        currentPage,
        itemsPerPage: 100
      })

      if (currentPage === 1) {
        this.brandList = brandList || []
      } else {
        this.brandList = [...this.brandList, ...brandList]
      }

      if (total && this.brandList.length < total) {
        this.showLoadMore = true
        this.nextPage = currentPage + 1
      } else {
        this.showLoadMore = false
      }
    },
    handleModalClose() {
      this.visible = false
      this.$emit('cancel')
    },
    handleSubmit() {
      const innerValue = this.$refs.treeTransfer.getTargetLastKeys()
      this.innerValue = innerValue
      this.visible = false
      this.updateAndEmit()
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-position-transfer {
  display: inline-block;
  .selected {
    color: red;
  }
}
</style>
