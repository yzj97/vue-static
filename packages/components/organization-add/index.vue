<template>
  <div class="cp-organization-add">
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

      <div class="add-item">
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
      title="指定部门"
      width="960px"
      @before-close="handleModalClose"
      @open="handleOpen"
    >
      <ody-roles-choose
        v-loading="loading"
        v-if="visible"
        ref="chooseRoles"
        :props="props"
        v-model="innerSelected"
        :load="load"
        :list="list"
        :brand-index="brandIndex"
        style="margin-left: 60px;"
        value-key="actorId"
        label-key="actorName"
        source-label="选择："
        target-label="已选："
        class="tree-transfer"
        @categoryed="categoryed"
        @brandClick="brandClick"
        @loadSearch="loadSearch"
        @loadSearchCategoryed="loadSearchCategoryed"
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
      </ody-roles-choose>
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
      default: '添加部门'
    }
  },
  data() {
    return {
      loading: true,
      visible: false,
      showLoadMore: false,
      innerSelected: [],
      sourceFilterText: '',
      sourceFilterTaskList: [],
      sourceFilterIsRunning: false,
      props: {
        label: 'actorName',
        children: 'children',
        isLeaf: 'leaf'
      },
      list: [],
      brandIndex: 0,
      initflag: true,
      currentPage: 1,
      itemsPerPage: 15
    }
  },
  computed: {},
  mounted() {
    this.list[this.brandIndex] = Object.assign(
      {},
      {
        req: {
          currentPage: this.currentPage,
          itemsPerPage: this.itemsPerPage
        },
        res: [],
        name: '',
        code: '',
        infiniteScrollDisabled: false
      }
    )
    this.innerSelected = this.value
  },
  methods: {
    async load() {
      this.list[this.brandIndex].infiniteScrollDisabled = true

      if (this.brandIndex === 0) {
        //  查询组织列表
        const { data } = await this.$api.department.listUserDepartment({})
        const list = data.map(x => {
          return {
            ...x,
            actorId: x.code,
            actorName: x.name,
            showCheckbox: 'true'
          }
        })
        const res = {}
        res.name = '公司'
        res.code = list[0].code
        res.res = list
        res.infiniteScrollDisabled = true
        this.$set(this.list, this.brandIndex, res)
      } else {
        const { data } = await this.$api.department.listByParentCode({
          parentCode: this.list[this.brandIndex].code,
          currentPage: this.list[this.brandIndex].req.currentPage,
          itemsPerPage: this.list[this.brandIndex].req.itemsPerPage
        })

        const list = data.map(x => {
          return {
            ...x,
            actorId: x.code,
            actorName: x.name,
            showCheckbox: 'true'
          }
        })

        this.list[this.brandIndex].res = [
          ...this.list[this.brandIndex].res,
          ...list
        ]
        this.list[this.brandIndex].req.currentPage++
        this.list[this.brandIndex].infiniteScrollDisabled = false
        if (list.length < this.list[this.brandIndex].req.itemsPerPage) {
          this.list[this.brandIndex].infiniteScrollDisabled = true
        }
        this.$set(this.list, this.brandIndex, this.list[this.brandIndex])
      }
    },
    categoryed(param) {
      this.brandIndex++
      this.list[this.brandIndex] = Object.assign(
        {},
        {
          req: {
            currentPage: this.currentPage,
            itemsPerPage: this.itemsPerPage
          },
          res: [],
          name: param.name,
          code: param.code,
          infiniteScrollDisabled: false
        }
      )
      this.load()
    },
    brandClick(param) {
      this.brandIndex = param
      this.list = this.list.splice(0, this.brandIndex + 1)
      const obj = this.list[this.brandIndex]
      obj.req = {
        currentPage: this.currentPage,
        itemsPerPage: this.itemsPerPage
      }
      obj.infiniteScrollDisabled = false
      obj.res = []
      this.$set(this.list, this.brandIndex, obj)
      this.load()
    },
    async loadSearch(sourceFilterText, resolve) {
      // 搜索组织列表
      let { data } = await this.$api.department.search({
        name: sourceFilterText.sourceFilterText
      })
      data = data.filter(x => {
        if (x.finded === 1) {
          return x
        }
      })
      return resolve(
        data.map(x => {
          return {
            ...x,
            actorId: x.code,
            actorName: x.name
          }
        })
      )
    },
    async loadSearchCategoryed(param, resolve) {
      const { data } = await this.$api.department.listByParentCode({
        parentCode: param.id
      })

      return resolve(
        data.map(x => {
          return {
            ...x,
            actorId: x.code,
            actorName: x.name
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
.cp-organization-add {
  display: inline-block;
  margin-top: 20px;
  .el-button {
    margin-top: 16px;
    margin-bottom: 8px;
  }
  .selected {
    color: #1890ff;
    margin: 0px 5px;
    font-size: 14px;
  }
  .add-item {
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
