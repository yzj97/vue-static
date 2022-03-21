<template>
  <div class="cp-position-add">
    <ody-button
      :disabled="disabled"
      code="ui"
      size="small"
      type="primary"
      @click="visible = true"
    >{{ label }}</ody-button
    >
    <template v-if="showCheckedCount">
      <span
        class="add-num"
      >已添加<span class="selected">{{ innerSelected.length }}</span
      >个</span
      >
      <el-button type="text" @click="handleClear">清空</el-button>

      <div class="tag">
        <el-tag
          v-for="(selected, selectedIndex) in innerSelected"
          :key="selectedIndex"
          type="info"
          size="small"
          closable
          @close="handleClose(selected)"
        >
          {{ selected.actorName }}
        </el-tag>
      </div>
    </template>
    <ody-dialog
      :visible.sync="visible"
      :append-to-body="true"
      title="编辑岗位"
      width="960px"
      @before-close="handleModalClose"
      @close="handleModalClose"
      @open="handleOpen"
    >
      <ody-choose-tree
        v-loading="loading"
        v-if="visible"
        ref="chooseTree"
        :props="props"
        v-model="innerSelected"
        :load="load"
        style="margin-left: 60px;"
        value-key="actorId"
        label-key="actorName"
        source-label="选择"
        target-label="已选"
        class="tree-transfer"
        @loadSearch="loadSearch"
      >
        <template slot="left-footer">
          <ody-button
            v-if="showLoadMore"
            code="ui"
            type="text"
            size="small"
            @click="handleLoadMore"
          >加载更多</ody-button
          >
        </template>
      </ody-choose-tree>
      <span slot="footer">
        <ody-button
          code="ui"
          size="small"
          @click="handleModalClose"
        >取消</ody-button
        >
        <ody-button
          code="ui"
          size="small"
          type="primary"
          @click="handleSubmit"
        >确定</ody-button
        >
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    value: {
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
      default: '添加岗位'
    }
  },
  data() {
    return {
      loading: true,
      visible: false,
      showLoadMore: false,
      nextPage: 1,
      innerSelected: [],
      sourceFilterText: '',
      sourceFilterTaskList: [],
      sourceFilterIsRunning: false,
      props: {
        label: 'actorName',
        children: 'children',
        isLeaf: 'leaf'
      }
    }
  },
  computed: {},
  mounted() {
    this.innerSelected = this.value
  },
  methods: {
    async load(node, resolve) {
      // 查询岗位列表
      if (node.level === 0) {
        const { data } = await this.$api.position.queryPositionList({
          entityType: 2,
          currentPage: 1,
          itemsPerPage: 500
        })
        return resolve(
          data.listObj.map(x => {
            return {
              ...x,
              actorId: x.id,
              actorName: x.positionName
            }
          })
        )
      }

      return resolve([])
    },
    async loadSearch(sourceFilterText, resolve) {
      // 搜索岗位列表
      const {
        data: { listObj: data }
      } = await this.$api.position.queryPositionList({
        currentPage: 1,
        itemsPerPage: 10,
        entityType: '1',
        createTimeStart: null,
        createTimeEnd: null,
        positionName: sourceFilterText.sourceFilterText
      })
      return resolve(
        data.map(x => {
          return {
            ...x,
            actorId: x.id,
            actorName: x.positionName
          }
        })
      )
    },
    async confrim() {
      return await this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    updateAndEmit() {
      this.$emit('input', this.innerSelected)
      this.$emit('ok', this.innerSelected)
    },
    async handleClear() {
      if (!(await this.confrim())) {
        return
      }
      this.innerSelected = []
      this.updateAndEmit()
    },
    async handleClose(selected) {
      if (!(await this.confrim())) {
        return
      }

      const { id } = selected
      const innerSelectedIndex = this.innerSelected.findIndex(x => x.id === id)

      this.innerSelected.splice(innerSelectedIndex, 1)
      this.updateAndEmit()
    },
    async handleOpen() {
      this.loading = false
      this.handleChecked()
      this.$emit('open')
    },
    async sourceFilterRun() {
      if (this.sourceFilterTaskList.length > 0) {
        const sourceFilterText = this.sourceFilterTaskList[0]
        this.sourceFilterIsRunning = true
        this.sourceFilterText = sourceFilterText
        this.sourceFilterTaskList.shift()
        this.sourceFilterRun()
      } else {
        this.sourceFilterIsRunning = false
        this.sourceFilterTaskList = []
      }
    },
    handleChecked() {
      this.innerSelected = this.$portal.deepClone(this.value)
    },
    handleModalClose() {
      this.visible = false
      const oldValue = this.$portal.deepClone(this.value)
      this.$emit('input', oldValue)
      this.innerSelected = oldValue
      this.$emit('cancel')
    },
    handleSubmit() {
      this.visible = false
      this.updateAndEmit()
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-position-add {
  display: inline-block;
  margin-top: 20px;
  .selected {
    color: #1890ff;
    margin: 0px 5px;
    font-size: 14px;
  }
  /deep/.el-tree-node__expand-icon {
    display: none;
  }
  .tag {
    /deep/ .el-tag {
      color: #1890ff;
      background: rgba(24, 144, 255, 0.1);
      margin-right: 8px;
      margin-top: 8px;
      /deep/ .el-tag__close {
        color: #b8dafb;
      }
    }
  }
}
</style>
