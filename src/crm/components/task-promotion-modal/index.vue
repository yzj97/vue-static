<template>
  <div class="cp-task-promotion-modal">
    <ody-dialog
      :visible.sync="visible"
      :title="$t('促销活动')"
      width="600px"
      @close="handleClose"
      @open="handleOpen"
    >
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
        <el-form-item :label="$t('促销活动')" prop="promotionId">
          <ody-promotion-choose
            v-model="innerNodeInfo.promotionId"
            :selected.sync="innerNodeInfo.selectedPromotion"
            name="innerNodeInfo_promotionId"
          />
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
          name="CrmTaskListSavePromotion_handleSubmit"
          size="small"
          type="primary"
          code="CrmTaskListSavePromotion"
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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      defaultNodeInfo: {
        nodeName: null, // 节点名称
        execStartTime: null, // 执行时间
        promotionId: null, // 促销活动
        promotionName: null, // 促销名称
        selectedPromotion: {}, // 促销
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
        promotionId: [
          { required: true, message: this.$t('请选择促销'), trigger: 'change' }
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
      const innerNodeInfo = {
        ...JSON.parse(JSON.stringify(this.defaultNodeInfo)),
        ...this.nodeInfo
      }

      const {
        promotionId: activityId,
        promotionName: title,
        ...nodeInfo
      } = innerNodeInfo

      nodeInfo.promotionId = activityId
      nodeInfo.selectedPromotion = {
        activityId,
        title
      }

      this.innerNodeInfo = nodeInfo
    },
    async handleSubmit() {
      const [err] = await this.formValidate('form')
      if (err) {
        return false
      }
      const {
        selectedPromotion: { activityId: promotionId, title: promotionName },
        ...params
      } = this.innerNodeInfo

      params.promotionId = promotionId
      params.promotionName = promotionName

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
.cp-task-promotion-modal {
  .inner-form {
    width: 400px;
  }
  .inner-form-item {
    margin-bottom: 16px;
  }
}
</style>
