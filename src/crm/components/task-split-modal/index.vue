<template>
  <div class="cp-task-split-modal">
    <ody-dialog
      :visible.sync="visible"
      :title="$t('拆分')"
      width="600px"
      @close="handleClose"
      @open="handleOpen"
    >
      <el-form
        ref="form"
        :model="innerNodeInfo"
        :rules="rules"
        :disabled="getIsDisabled"
        label-width="100px"
      >
        <el-form-item :label="$t('节点名称')" prop="nodeName">
          <el-input v-model="innerNodeInfo.nodeName" name="innerNodeInfo_nodeName" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item :label="$t('拆分方式')">
          <ody-table
            :data="innerNodeInfo.splitList"
            :can-filter="false"
            :index="true"
            :columns="table.columns"
            :operates="table.operates"
            name="innerNodeInfo_splitList639"
          >
            <template slot="bit" slot-scope="scope">
              <ody-input-number v-model="scope.row.val" :min="0" :max="100" name="scope_row_val">
                <template slot="append">%</template>
              </ody-input-number>
            </template>
          </ody-table>
        </el-form-item>
        <el-form-item :label="$t('节点备注')" prop="nodeRemark">
          <el-input
            v-model="innerNodeInfo.nodeRemark"
            name="innerNodeInfo_nodeRemark"
            type="textarea"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('关闭') }}</el-button>
        <ody-button
          name="CrmTaskListSaveSplit_handleSubmit"
          size="small"
          type="primary"
          code="CrmTaskListSaveSplit"
          @click="handleSubmit"
        >{{ $t('保存') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
import CrmTaskAnalysisList from '@/components/task-analysis-list'

export default {
  components: {
    CrmTaskAnalysisList
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    nodeInfo: {
      type: Object,
      default: () => {}
    },
    taskId: {
      type: String,
      default: null
    },
    taskStatus: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      table: {
        columns: [
          {
            label: this.$t('分组名'),
            prop: 'nodeName',
            show: true,
            minWidth: 100
          },
          {
            label: this.$t('占比'),
            slot: 'bit',
            show: true,
            minWidth: 120
          }
        ],
        operates: {
          width: 120,
          fixed: 'right',
          list: [
            {
              label: this.$t('新增'),
              method: (index, row) => {
                const maxId = this.getMaxId()
                if (this.innerNodeInfo.splitList.length >= 99) {
                  this.$message.error(this.$t('分组数量超过99'))
                  return false
                }
                const maxStringId = (maxId + '').padStart(2, '0')
                const leftArr = this.innerNodeInfo.splitList.slice(0, index + 1)
                const rightArr = this.innerNodeInfo.splitList.slice(index + 1)
                this.innerNodeInfo.splitList = [
                  ...leftArr,
                  {
                    pageNodeId: `${this.nodeInfo.pageNodeId}${maxStringId}`,
                    nodeName: `子分组${maxId}`,
                    val: '0'
                  },
                  ...rightArr
                ]
              },
              code: 'ui'
            },
            {
              label: this.$t('删除'),
              disabled: (index, row) => {
                return this.innerNodeInfo.splitList.length <= 1
              },
              method: async(index, row) => {
                const msg = await this.$confirm(this.$t('是否删除'), this.$t('提示'), {
                  confirmButtonText: this.$t('确定'),
                  cancelButtonText: this.$t('取消'),
                  type: 'warning'
                })

                if (!msg) {
                  return false
                }
                this.innerNodeInfo.splitList.splice(index, 1)
              },
              code: 'ui'
            }
          ]
        }
      },
      innerNodeInfo: {},
      rules: {
        nodeName: [
          {
            required: true,
            message: this.$t('请输入节点名称'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    getIsDisabled() {
      // const map = {
      //   3: 'isDoing',
      //   4: 'isEnded',
      //   5: 'isClosed',
      //   0: 'isWaitSumbit',
      //   1: 'isWaitAudit',
      //   2: 'isAuditFail'
      // }

      return !['isWaitSumbit', 'isAuditFail'].includes(this.taskStatus)
    }
  },
  methods: {
    getDefaultNodeInfo() {
      return {
        nodeName: null, // 节点名称
        splitList: [
          // 拆分列表
          {
            pageNodeId: `${this.nodeInfo.pageNodeId}01`,
            nodeName: this.$t('子分组1'),
            val: '50'
          },
          {
            pageNodeId: `${this.nodeInfo.pageNodeId}02`,
            nodeName: this.$t('子分组2'),
            val: '50'
          }
        ],
        nodeRemark: null // 节点备注
      }
    },
    getMaxId() {
      const idList = this.innerNodeInfo.splitList.map(
        x => +(x.pageNodeId + '').slice(-2)
      )
      return Math.max(...idList) + 1
    },
    handleOpen() {
      this.innerNodeInfo = {
        ...JSON.parse(JSON.stringify(this.getDefaultNodeInfo())),
        ...this.nodeInfo
      }
    },
    async handleSubmit() {
      const [err] = await this.formValidate('form')
      if (err) {
        return false
      }
      const { ...params } = this.innerNodeInfo
      const splitList = this.innerNodeInfo.splitList

      if (!(splitList.length >= 2 && splitList.length <= 100)) {
        this.$message.error(this.$t('设置拆分的分组才2~100范围内'))
        return false
      }

      const all = splitList
        .map(x => +x.val)
        .reduce((rtv, item) => {
          rtv += item
          return rtv
        }, 0)

      if (all !== 100) {
        this.$message.error(this.$t('设置的百分比总和必须100%'))
        return false
      }

      this.$emit('ok', params)
      this.handleClose()
    },
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
