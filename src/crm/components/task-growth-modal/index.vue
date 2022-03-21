<template>
  <div class="cp-task-growth-modal">
    <ody-dialog
      :visible.sync="visible"
      :title="$t('成长值')"
      width="600px"
      @close="handleClose"
      @open="handleOpen"
    >
      <el-tabs v-model="activeName" name="activeName" type="card" class="form" @tab-click="handleClick">
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
            <el-form-item :label="$t('执行时间')" prop="execStartTime">
              <el-date-picker
                v-model="innerNodeInfo.execStartTime"
                :picker-options="pickerOptions"
                :placeholder="$t('选择日期时间')"
                name="innerNodeInfo_execStartTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
              />
            </el-form-item>
            <el-form-item :label="$t('成长值设置')">
              <el-radio-group v-model="innerNodeInfo.sendMethod" name="innerNodeInfo_sendMethod">
                <el-radio :label="1">{{ $t('发放') }}</el-radio>
                <el-radio :label="2">{{ $t('扣减') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <div class="inner-form">
                <el-form-item :label="$t('成长值')" class="inner-form-item" prop="growthVal">
                  <ody-input-number v-model="innerNodeInfo.growthVal" :min="1" :max="999999" name="innerNodeInfo_growthVal" />
                </el-form-item>
                <el-form-item :label="$t('渠道')" class="inner-form-item" prop="channelCode">
                  <ody-channel-select
                    ref="channel"
                    v-model="innerNodeInfo.channelCode"
                    :placeholder="$t('请选择')"
                    name="innerNodeInfo_channelCode"
                  />
                </el-form-item>
                <el-form-item :label="$t('理由')" class="inner-form-item" prop="sendReason">
                  <ody-dict-select
                    v-model="innerNodeInfo.sendReason"
                    :placeholder="$t('请选择')"
                    name="innerNodeInfo_sendReason"
                    category="GROWTH_JOB_REASON"
                    type="select"
                    value-key="name"
                    pool="ouser"
                  />
                </el-form-item>
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
            :task-status="taskStatus"
            :node-info="innerNodeInfo"
          />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('关闭') }}</el-button>
        <ody-button
          name="CrmTaskListSaveGrowth_handleSubmit"
          size="small"
          type="primary"
          code="CrmTaskListSaveGrowth"
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
      minHeight: 0,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      activeName: 'node',
      defaultNodeInfo: {
        nodeName: null, // 节点名称
        execStartTime: null, // 执行时间
        sendMethod: 1, // 成长值设置 1: 发放 2:扣减
        growthVal: null, // 成长值
        channelCode: null, // 渠道
        sendReason: null, // 成长值理由
        nodeRemark: null // 节点备注
      },
      innerNodeInfo: {},
      rules: {
        nodeName: [
          {
            required: true,
            message: this.$t('请输入节点名称'),
            trigger: 'change'
          }
        ],
        execStartTime: [
          {
            required: true,
            message: this.$t('请输入执行时间'),
            trigger: 'change'
          }
        ],
        growthVal: [
          {
            required: true,
            message: this.$t('请输入成长值'),
            trigger: 'change'
          }
        ],
        channelCode: [
          { required: true, message: this.$t('请选择渠道'), trigger: 'change' }
        ],
        sendReason: [
          { required: true, message: this.$t('请选择理由'), trigger: 'change' }
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
    handleOpen() {
      this.innerNodeInfo = {
        ...JSON.parse(JSON.stringify(this.defaultNodeInfo)),
        ...this.nodeInfo
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
      const { ...params } = this.innerNodeInfo

      this.$emit('ok', params)
      this.handleClose()
    },
    handleClose() {
      this.activeName = 'node'
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-task-growth-modal {
  .inner-form {
    width: 360px;
    margin-left: -60px;
  }
  .inner-form-item {
    margin-bottom: 20px;
  }
}
</style>
