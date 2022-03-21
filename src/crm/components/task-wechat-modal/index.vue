<template>
  <div class="cp-task-wechat-modal">
    <ody-dialog
      :visible.sync="visible"
      :title="$t('微信模板')"
      width="960px"
      @close="handleClose"
      @open="handleOpen"
    >
      <el-tabs v-model="activeName" name="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane :label="$t('节点设置')" name="node">
          <el-form ref="form" :model="innerNodeInfo" :rules="rules" :disabled="getIsDisabled" label-width="130px">
            <el-form-item :label="$t('节点名称:')" prop="nodeName">
              <el-input
                v-model="innerNodeInfo.nodeName"
                name="innerNodeInfo_nodeName"
                maxlength="50"
                show-word-limit/>
            </el-form-item>
            <el-form-item :label="$t('执行时间:')" prop="execStartTime">
              <el-date-picker
                v-model="innerNodeInfo.execStartTime"
                :picker-options="pickerOptions"
                :placeholder="$t('选择日期时间')"
                name="innerNodeInfo_execStartTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
              />
            </el-form-item>
            <el-form-item :label="$t('模板选择:')" prop="templateCode">
              <crm-wechat-template-select
                v-model="innerNodeInfo.templateCode"
                :selected.sync="selected"
                name="innerNodeInfo_templateCode"
                @change="handleTemplateChange"
              />
            </el-form-item>
            <el-form-item :label="$t('模板内容:')" prop="templateContent">
              <el-input
                v-model="innerNodeInfo.templateContent"
                :disabled="true"
                :autosize="{ minRows: 3, maxRows: 10}"
                name="innerNodeInfo_templateContent"
                type="textarea"/>
            </el-form-item>
            <el-form-item :label="$t('节点数据选择:')" prop="actionPageNodeId">
              <!-- {{ innerNodeInfo.filterGroupList }} -->
              <template v-if="innerNodeInfo.actionPageNodeList && innerNodeInfo.actionPageNodeList.length">
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
                    :value="item.pageNodeId"/>
                </el-select>
                {{ $t('因该工作流中存在多个营销方式/会员权益节点，为保证短信模板数据准确性，请您选择一个短信模板读取数据的节点') }}
              </template>
              <template v-else>
                <el-alert
                  :closable="false"
                  :title="$t('没有找到节点数据')"
                  type="error"
                />
              </template>
            </el-form-item>
            <el-form-item
              v-if="innerNodeInfo.templateVariableList && innerNodeInfo.templateVariableList.length"
              :label="$t('模板变量更改:')"
              prop="templateVariable">
              <el-row
                v-for="(templateVariable, index) in innerNodeInfo.templateVariableList"
                :key="index"
                style="margin-bottom: 16px;"
              >
                <el-col :span="6" style="margin-right: 12px;">
                  <el-input :value="templateVariable.variableTpl" />
                </el-col>
                <el-col :span="4" style="margin-right: 12px;">
                  <el-form-item>
                    <el-select
                      v-model="templateVariable.select"
                      :clearable="false"
                      :placeholder="$t('请选择')"
                      name="templateVariable_select"
                    >
                      <el-option
                        v-for="item in templateVariableOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="13">
                  <el-form-item
                    v-if="templateVariable.select === 'input'"
                    :prop="'templateVariableList.' + index + '.input'"
                    :rules="inputRules"
                  >
                    <el-input
                      v-model="templateVariable.input"
                      name="templateVariable_input"
                      maxlength="30"
                      show-word-limit />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item :label="$t('模板跳转页面:')" prop="jumpPageType">
              <!-- {{ innerNodeInfo.filterGroupList }} -->
              <el-select
                v-model="innerNodeInfo.jumpPageType"
                :clearable="true"
                :placeholder="$t('请选择')"
                name="innerNodeInfo_jumpPageType"
              >
                <el-option
                  v-for="item in jumpPageTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
              {{ $t('建议选择与任务节点匹配的跳转页面，若无法跳转页面则系统默认跳转至商城首页') }}
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('分析报告')"
          :style="{minHeight: minHeight}"
          name="analysis"
        >
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
        <ody-button name="CrmTaskListSaveWechat_handleSubmit" size="small" type="primary" code="CrmTaskListSaveWechat" @click="handleSubmit">{{ $t('保存') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
import CrmTaskAnalysisList from '@/components/task-analysis-list'
import CrmWechatTemplateSelect from '@/components/wechat-template-select'

export default {
  components: {
    CrmTaskAnalysisList,
    CrmWechatTemplateSelect
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
      inputRules: [
        { required: true, message: this.$t('请输入'), trigger: 'change' }
      ],
      templateVariableList: [],
      templateVariableOptions: [
        {
          label: this.$t('会员名称'),
          value: 'memberName'
        },
        {
          label: this.$t('积分数值'),
          value: 'integral'
        },
        {
          label: this.$t('成长值数值'),
          value: 'growth'
        },
        // {
        //   label: this.$t('优惠券数量'),
        //   value: 'couponNum'
        // },
        {
          label: this.$t('优惠券名称'),
          value: 'couponName'
        },
        {
          label: this.$t('促销名称'),
          value: 'promotionName'
        },
        // {
        //   label: this.$t('定金金额'),
        //   value: 'downpayment'
        // },
        // {
        //   label: this.$t('尾款金额'),
        //   value: 'rest'
        // },
        {
          label: this.$t('输入固定字段'),
          value: 'input'
        }
      ],
      jumpPageTypeOptions: [
        { value: 'homePage', label: this.$t('首页') },
        { value: 'couponListPage', label: this.$t('优惠券列表页') },
        { value: 'pointsPage', label: this.$t('积分页') },
        { value: 'growthPage', label: this.$t('成长值') }
      ],
      activeName: 'node',
      defaultNodeInfo: {
        jumpPageType: null, // 跳转页面类型。首页homePage;优惠券列表页couponList;积分页point;成长值页growth
        actionPageNodeId: null, // 操作节点id
        actionPageNodeList: [], // 操作节点数组
        nodeName: null, // 节点名称
        execStartTime: null, // 执行时间
        templateCode: null, // 模板Code
        templateContent: null, // 模板内容
        templateVariableList: [] // 模板变量
      },
      innerNodeInfo: {},
      selected: {},
      rules: {
        nodeName: [
          { required: true, message: this.$t('请输入节点名称'), trigger: 'change' }
        ],
        execStartTime: [
          { required: true, message: this.$t('请输入执行时间'), trigger: 'change' }
        ],
        templateCode: [
          { required: true, message: this.$t('请选择模板'), trigger: 'change' }
        ],
        actionPageNodeId: [
          { required: true, message: this.$t('请选择节点数据'), trigger: 'change' }
        ],
        jumpPageType: [
          { required: true, message: this.$t('请选择模板跳转页面'), trigger: 'change' }
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
    getTemplateVariableList(content) {
      // const content = this.innerNodeInfo && this.innerNodeInfo.templateContent || ''
      const variableList = content.match(/\{\{.+?\}\}/g) || []
      const [{ value: select }] = this.templateVariableOptions

      return variableList.map(variableTpl => {
        return {
          variableTpl,
          select,
          input: null
        }
      })
    },
    handleTemplateChange(val) {
      if (val) {
        this.innerNodeInfo.templateContent = this.selected.content
      } else {
        this.innerNodeInfo.templateContent = ''
      }

      const templateVariableList = this.getTemplateVariableList(this.innerNodeInfo.templateContent)

      this.$set(this.innerNodeInfo, 'templateVariableList', templateVariableList)
      this.$nextTick(() => {
        this.setMinHeiht()
      })
    },
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
.cp-task-wechat-modal {
  .inner-form {
    width: 400px;
  }
  .inner-form-item {
    margin-bottom: 10px;
  }
}
</style>
