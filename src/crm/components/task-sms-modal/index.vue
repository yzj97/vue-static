<template>
  <div class="cp-task-sms-modal">
    <ody-dialog
      :visible.sync="visible"
      :title="$t('短信')"
      width="600px"
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
            <el-form-item :label="$t('模板选择')" prop="templateCode">
              <crm-sms-template-select
                v-model="innerNodeInfo.templateCode"
                :selected.sync="selected"
                name="innerNodeInfo_templateCode"
                @change="handleTemplateChange"
              />
              <!-- OscMessageWaren -->
              {{ $t('没有您想要的模板') }} {{ $t('，立即前往') }}
              <el-button name="handleModifyTemplate" size="small" type="text" @click="handleModifyTemplate">{{ $t('修改模板') }}</el-button>
            </el-form-item>
            <el-form-item :label="$t('节点数据选择:')" prop="actionPageNodeId">
              <!-- {{ innerNodeInfo.filterGroupList }} -->
              <template
                v-if="innerNodeInfo.actionPageNodeList && innerNodeInfo.actionPageNodeList.length"
              >
                <el-select
                  v-model="innerNodeInfo.actionPageNodeId"
                  :clearable="true"
                  :placeholder="$t('请选择')"
                  name="innerNodeInfo_actionPageNodeId"
                >
                  <el-option
                    v-for="item in innerNodeInfo.actionPageNodeList"
                    :key="item.pageNodeId"
                    :label="item.nodeName"
                    :value="item.pageNodeId"
                  />
                </el-select>
                {{ $t('因该工作流中存在多个营销方式/会员权益节点，为保证短信模板数据准确性，请您选择一个短信模板读取数据的节点') }}
              </template>
              <template v-else>
                <el-alert :closable="false" :title="$t('没有找到节点数据')" type="error" />
              </template>
            </el-form-item>
            <el-form-item :label="$t('模板内容')" prop="templateContent">
              <el-input
                v-model="innerNodeInfo.templateContent"
                :disabled="true"
                :autosize="{ minRows: 3, maxRows: 10}"
                name="innerNodeInfo_templateContent"
                type="textarea"
              />
            </el-form-item>
            <!-- <el-form-item :label="$t('发送目标')" prop="target">
              <el-radio-group v-model="innerNodeInfo.target" name="innerNodeInfo_target">
                <el-radio :label="1">{{ $t('会员手机号') }}</el-radio>
                <el-radio :label="2">{{ $t('最后一笔订单收货电话') }}</el-radio>
              </el-radio-group>
            </el-form-item>-->
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="$t('分析报告')" :style="{minHeight: minHeight}" name="analysis">
          <crm-task-analysis-list
            v-if="activeName === 'analysis'"
            :task-id="taskId"
            :task-status="taskStatus"
            :node-info="innerNodeInfo"
            type="sendBy"
          />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('关闭') }}</el-button>
        <ody-button
          name="CrmTaskListSaveSms_handleSubmit"
          size="small"
          type="primary"
          code="CrmTaskListSaveSms"
          @click="handleSubmit"
        >{{ $t('保存') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
import CrmTaskAnalysisList from '@/components/task-analysis-list'
import CrmSmsTemplateSelect from '@/components/sms-template-select'

export default {
  components: {
    CrmTaskAnalysisList,
    CrmSmsTemplateSelect
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
        actionPageNodeId: null, // 操作节点id
        actionPageNodeList: [], // 操作节点数组
        nodeName: null, // 节点名称
        execStartTime: null, // 执行时间
        templateCode: null, // 模板Code
        templateContent: null, // 模板内容
        target: 1 // 发送目标 1: 会员手机号  2: 最后一笔订单收货电话
      },
      innerNodeInfo: {},
      selected: {},
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
        templateCode: [
          { required: true, message: this.$t('请选择模板'), trigger: 'change' }
        ],
        actionPageNodeId: [
          {
            required: true,
            message: this.$t('请选择节点数据'),
            trigger: 'change'
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
    handleModifyTemplate() {
      this.$router.push({
        name: 'OscMessageWaren'
      })
    },
    handleTemplateChange(val) {
      if (val) {
        this.innerNodeInfo.templateContent = this.selected.content
      } else {
        this.innerNodeInfo.templateContent = ''
      }
    },
    handleOpen() {
      this.innerNodeInfo = {
        ...JSON.parse(JSON.stringify(this.defaultNodeInfo)),
        ...this.nodeInfo
      }

      if (
        !this.innerNodeInfo.actionPageNodeList.find(
          x => x.pageNodeId === this.innerNodeInfo.actionPageNodeId
        )
      ) {
        this.innerNodeInfo.actionPageNodeId = null
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
.cp-task-sms-modal {
  .inner-form {
    width: 400px;
  }
  .inner-form-item {
    margin-bottom: 10px;
  }
}
</style>
