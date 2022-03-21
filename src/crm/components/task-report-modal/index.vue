<template>
  <div class="cp-task-report-modal">
    <ody-dialog
      :visible.sync="visible"
      :title="$t('营销任务统计')"
      width="960px"
      @close="handleClose"
      @open="handleOpen">
      <el-form ref="form" class="form">
        <el-form-item :label="$t('任务名称:')">
          <span class="highlight">
            {{ taskReport.taskName }}
          </span>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('任务开始时间:')">
              <span class="highlight">
                {{ taskReport.taskStartTime | parseTime }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('任务状态:')">
              <span class="highlight">
                {{ taskReport.status | keyVal(getStatusMap) }}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="line"/>
        <el-form-item :label="$t('实时数据:')"/>
        <div class="btn-area">
          <ody-button
            name="exportMktTaskReport_handleExport"
            type="primary"
            code="exportMktTaskReport"
            size="small"
            @click="handleExport"
          >
            {{ $t('导出统计') }}
          </ody-button>
        </div>
      </el-form>
      <el-form ref="form" label-width="180px" class="inner-form">
        <el-row>
          <el-col :span="8">
            <el-form-item label="ROI:">
              {{ taskReport.roi }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('短信花费:')">
              {{ taskReport.smsSendAmount }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('短信应触达人数:')">
              {{ taskReport.smsSendNum }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('短信实际触达人数:')">
              {{ taskReport.smsRealNum }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('短信失败人数:')">
              {{ taskReport.smsFailNum }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('微信应触达人数:')">
              {{ taskReport.wechatSendNum }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('微信实际触达人数:')">
              {{ taskReport.wechatRealNum }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('微信失败人数:')">
              {{ taskReport.wechatFailNum }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('活动产生订单金额:')">
              {{ taskReport.orderAmount }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('活动产生订单数:')">
              {{ taskReport.orderNum }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('活动产生支付单数:')">
              {{ taskReport.payOrderNum }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('活动购买商品数:')">
              {{ taskReport.payOrderMpNum }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('活动参与人数:')">
              {{ taskReport.participateUserNum }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('新客人数:')">
              {{ taskReport.newUserNum }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('老客人数:')">
              {{ taskReport.oldUserNum }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('优惠券发放张数:')">
              {{ taskReport.couponSendNum }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('优惠券使用张数:')">
              {{ taskReport.couponUseNum }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('优惠券领取张数:')">
              {{ taskReport.couponReceiveNum }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('优惠券使用率:')">
              {{ taskReport.couponUseRate }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('等级升级:')">
              {{ taskReport.levelUpNum }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <ody-button name="handleClose" size="small" type="primary" @click="handleClose">{{ $t('知道了') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    task: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      statusList: [
        {
          name: 'all',
          label: this.$t('全部')
        },
        {
          name: '3',
          label: this.$t('进行中')
        },
        {
          name: '4',
          label: this.$t('已结束')
        },
        {
          name: '5',
          label: this.$t('已关闭')
        },
        {
          name: '0',
          label: this.$t('待提交')
        },
        {
          name: '1',
          label: this.$t('待审核')
        },
        {
          name: '2',
          label: this.$t('审核未通过')
        }
      ],
      taskReport: {
        couponReceiveNum: null, // integer($int64) example: 84700 优惠券领取张数

        couponSendNum: null, // integer($int64) example: 84757 优惠券发放张数

        couponUseNum: null, // integer($int64) example: 84700 优惠券使用张数

        couponUseRate: null, // number example: 98 优惠券使用率

        levelUpNum: null, // integer($int64) example: 300 等级升级人数

        newUserNum: null, // integer($int64) example: 1345 新客数

        oldUserNum: null, // integer($int64) example: 1640 老客数

        orderAmount: null, // number example: 12415 活动产生订单金额

        payOrderMpNum: null, // integer($int64) example: 9847 活动购买商品数

        orderNum: null, // integer($int64) example: 12415 活动产生订单数

        participateUserNum: null, // integer($int64) example: 2985 活动参与人数

        payOrderNum: null, // integer($int64) example: 234 活动产生支付单数

        roi: null, // number example: 23 roi
        smsFailNum: null, // integer($int64) example: 1640 短信失败人数

        smsRealNum: null, // integer($int64) example: 1345 短信实际触达人数

        smsSendAmount: null, // number example: 84.76 短信花费

        smsSendNum: null, // integer($int64) example: 2985 短信应触达人数

        wechatFailNum: null, // integer($int64) example: 1640 微信失败人数

        wechatRealNum: null, // integer($int64) example: 1345 微信实际触达人数

        wechatSendNum: null // integer($int64) example: 2985 微信应触达人数
      }
    }
  },
  computed: {
    getStatusMap() {
      return this.statusList.reduce((rtv, item) => {
        rtv[item.name] = item.label
        return rtv
      }, {})
    }
  },
  async mounted() {
    await this.handleOpen()
  },
  methods: {
    async handleExport() {
      const { task: { id: taskId }} = this
      // this.$portal.down
      await this.$portal.downloadFileByGet('/api/obi-web/crm/report/exportMktTaskReport.do', {
        taskId
      }, `营销任务统计${taskId}.xlsx`)
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    async handleOpen() {
      const { task: { id: taskId }} = this

      const { data: taskReport } = await this.$crm.$api.report.mktTaskReport({
        taskId
      })

      this.taskReport = taskReport
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-task-report-modal {
  .highlight {
    color: #EF5351;
  }
  .form {
    position: relative;
    .btn-area {
      position: absolute;
      right: 0;
      bottom: 50px;
    }
  }
  .line {
    height: 2px;
    background-color: #CED4DA;
  }
  .inner-form {
    background:rgba(248,249,250,1);
    padding: 20px;
  }
}

</style>
