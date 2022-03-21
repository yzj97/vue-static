<template>
  <div class="cp-task-coupon-modal">
    <ody-dialog
      :visible.sync="visible"
      :title="$t('优惠券')"
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
            <el-form-item :label="$t('优惠券')" class="inner-form-item" prop="couponThemeId">
              <ody-promotion-coupon-choose
                v-model="innerNodeInfo.couponThemeId"
                :selected.sync="innerNodeInfo.selectedCoupon"
                name="innerNodeInfo_couponThemeId"
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
          name="CrmTaskListSaveCoupon_handleSubmit"
          size="small"
          type="primary"
          code="CrmTaskListSaveCoupon"
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
        couponThemeId: null, // 优惠券Id
        couponThemeName: null, // 优惠券Name
        nodeRemark: null // 节点备注
      },
      innerNodeInfo: {},
      rules: {
        nodeName: [
          {
            required: true,
            message: this.$t('请输入节点名称'),
            trigger: 'blur'
          }
        ],
        execStartTime: [
          {
            required: true,
            message: this.$t('请输入执行时间'),
            trigger: 'change'
          }
        ],
        couponThemeId: [
          {
            required: true,
            message: this.$t('请选择优惠券'),
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
    handleOpen() {
      const innerNodeInfo = {
        ...JSON.parse(JSON.stringify(this.defaultNodeInfo)),
        ...this.nodeInfo
      }

      const {
        couponThemeId: id,
        couponThemeName: themeTitle,
        ...nodeInfo
      } = innerNodeInfo

      nodeInfo.couponThemeId = id
      nodeInfo.selectedCoupon = {
        id,
        themeTitle
      }

      this.innerNodeInfo = nodeInfo
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
        selectedCoupon: { id: couponThemeId, themeTitle: couponThemeName },
        ...params
      } = this.innerNodeInfo

      params.couponThemeId = couponThemeId
      params.couponThemeName = couponThemeName

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
.cp-task-coupon-modal {
  .inner-form {
    width: 400px;
  }
  .inner-form-item {
    margin-bottom: 16px;
  }
}
</style>
