<template>
  <div class="cp-task-analysis-modal">
    <ody-dialog
      :visible.sync="visible"
      :title="$t('分析')"
      width="960px"
      @close="handleClose"
      @open="handleOpen"
    >
      <el-tabs v-model="activeName" name="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane :label="$t('节点设置')" name="node">
          <el-form
            ref="form"
            :model="innerNodeInfo"
            :rules="rules"
            :disabled="getIsDisabled"
            label-width="130px"
          >
            <el-form-item :label="$t('节点名称')" prop="nodeName">
              <el-input v-model="innerNodeInfo.nodeName" name="innerNodeInfo_nodeName" maxlength="50" show-word-limit />
            </el-form-item>
            <el-form-item :label="$t('执行时间')" prop="execTime">
              <el-date-picker
                v-model="innerNodeInfo.execTime"
                :range-separator="$t('至')"
                :start-placeholder="$t('开始日期')"
                :end-placeholder="$t('结束日期')"
                name="innerNodeInfo_execTime"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 390px;"
              />
            </el-form-item>
            <el-form-item :label="$t('分析模板')" prop="analysisTemp">
              <span class="analysisTemp-tipspan">{{ $t('推荐使用对应分析模版，可以针对性的分析任务数据') }}</span>
              <div>
                <el-radio-group v-model="innerNodeInfo.analysisTemp" name="innerNodeInfo_analysisTemp">
                  <template v-for="item in analysisTemp">
                    <el-radio :key="item.value" :label="item.value">
                      {{ item.label }}
                      <el-link
                        v-if="item.value == innerNodeInfo.analysisTemp"
                        :underline="false"
                        name="templateOpen"
                        type="primary"
                        @click="templateOpen"
                      >{{ $t('查看') }}</el-link>
                    </el-radio>
                  </template>
                </el-radio-group>
              </div>
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
        </el-tab-pane>
        <el-tab-pane :label="$t('分析报告')" :style="{minHeight: minHeight}" name="analysis">
          <crm-task-analysis-list
            v-if="activeName === 'analysis'"
            :task-id="taskId"
            :task-report="taskReport"
            :task-status="taskStatus"
            :node-info="innerNodeInfo"
            type="analysis"
          />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('关闭') }}</el-button>
        <ody-button
          name="CrmTaskListSaveAnalysis_handleSubmit"
          size="small"
          type="primary"
          code="CrmTaskListSaveAnalysis"
          @click="handleSubmit"
        >{{ $t('保存') }}</ody-button>
      </span>
    </ody-dialog>
    <!-- 分析模板弹框 -->
    <crm-task-analysis-analysis-temp-model
      :show-template.sync="showTemplate"
      :temp-code="innerNodeInfo.analysisTemp"
      @templateClose="templateClose"
    />
  </div>
</template>

<script>
import CrmTaskAnalysisList from '@/components/task-analysis-list'
import CrmTaskAnalysisAnalysisTempModel from '@/components/task-analysis-analysis-temp-model'

export default {
  components: {
    CrmTaskAnalysisList,
    CrmTaskAnalysisAnalysisTempModel
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
      minHeight: 0,
      activeName: 'node',
      defaultNodeInfo: {
        nodeName: null, // 节点名称
        execTime: [], // 执行时间
        analysisTemp: null, // 分析模板
        nodeRemark: null // 节点备注
      },
      analysisTemp: [
        { value: 'common', label: this.$t('通用模板') },
        { value: 'payEndMoney', label: this.$t('尾款支付模板') },
        { value: 'growth', label: this.$t('成长值模板') }
      ],
      innerNodeInfo: {},
      taskReport: {
        coverUserNum: null, //  integer($int64) example: 2985 覆盖会员数
        roi: null, // number example: 78.45 roi
        smsCost: null, // number example: 84.76 短信花费
        touchType: null, // integer($int32) example: 78.45 触达方式
        userAnalysisList: [
          /* {
            indicatorName: null, // strle: 意向 指标名称
            indicatorType: null, // integer($int32) example: 1 指标类型
            orderAmount: null, // number example: 3745.5 订单金额
            orderMpNum: null, //  integer($int64) example: 500 商品件数
            orderNum: null, //  integer($int64) example: 123 订单数
            userNum: null // integer($int64) example: 78 会员数
          } */
        ]
      },
      rules: {
        nodeName: [
          {
            required: true,
            message: this.$t('请输入节点名称'),
            trigger: 'blur'
          }
        ],
        execTime: [
          {
            required: true,
            message: this.$t('请输入执行时间'),
            trigger: 'change'
          }
        ]
      },
      showTemplate: false
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
    async handleOpen() {
      this.innerNodeInfo = {
        ...JSON.parse(JSON.stringify(this.defaultNodeInfo)),
        ...this.nodeInfo
      }

      const { taskId } = this
      const { pageNodeId } = this.innerNodeInfo
      const {
        data: taskReport
      } = await this.$crm.$api.report.mktNodeAnalysisReport({
        taskId,
        pageNodeId
      })

      // taskReport.crmModelCode = 'payEndMoney'
      // taskReport.crmModelCode = 'growth'
      // taskReport.crmModelCode = 'common'
      this.taskReport = taskReport
      if (!this.innerNodeInfo.analysisTemp) {
        this.innerNodeInfo.analysisTemp = 'common'
      }
      this.setMinHeiht()
    },
    setMinHeiht() {
      this.$nextTick(() => {
        this.minHeight = this.$refs.form.$el.clientHeight + 16 + 'px'
      })
    },
    async handleSubmit() {
      const [err] = await this.formValidate('form')
      if (err) {
        return false
      }
      const {
        execTime: [execStartTime, execEndTime],
        ...params
      } = this.innerNodeInfo

      params.execStartTime = execStartTime
      params.execEndTime = execEndTime

      this.$emit('ok', params)
      this.handleClose()
    },
    handleClose() {
      this.activeName = 'node'
      this.$emit('update:visible', false)
    },
    templateOpen() {
      this.showTemplate = true
    },
    templateClose() {
      this.showTemplate = false
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-task-analysis-modal {
  .inner-form {
    width: 400px;
  }
  .inner-form-item {
    margin-bottom: 10px;
  }
}
.el-radio {
  display: block !important;
  line-height: 28px;
}
.el-link.el-link--primary {
  padding-left: 10px !important;
}
.analysisTemp-tipspan {
  font-size: 12px;
  font-weight: 400;
  color: rgba(153, 171, 180, 1);
}
</style>
