<template>
  <div>
    <detail :so-detail="soDetail" :button-keys="buttonKeys" :step-info.sync="stepInfo" @onSuccess="init"/>
  </div>
</template>

<script>
import Detail from '@/components/so/detail'

export default {
  name: 'OmsOrderB2cTuanGou',
  components: {
    Detail
  },
  data() {
    return {
      soDetail: {},
      buttonKeys: [],
      stepInfo: [],
      detailInfo: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    async  init() {
      const self = this
      let activeStep = 0
      let isServiceOrder = false
      // this.buttonKeys = ['cancel', 'edit', 'copy', 'confirm', 'audit']
      await this.$oms.$api.so.soDetailGet({ orderCode: this.$route.params.orderCode }).then(res => {
        self.soDetail = res.data
        // 待支付
        const so = self.soDetail.so
        isServiceOrder = so.orderType === 105
        let buttonKeys = []
        if (so.orderPaymentStatus === 0 && so.orderStatus < 1030) {
          activeStep = 0
          buttonKeys = ['cancel', 'edit']
        } else if (so.orderPaymentStatus === 3 && so.orderStatus < 1030) {
          activeStep = 1
          buttonKeys = ['edit']
        } else if (so.orderStatus === 1030) {
          activeStep = 1
          buttonKeys = ['edit', 'confirm']
        } else if (so.orderStatus === 1031) {
          activeStep = 1
          buttonKeys = ['edit']
        } else if (so.orderStatus === 1040) {
          activeStep = 1
          buttonKeys = ['edit', 'audit']
        } else if (so.orderStatus === 1050) {
          activeStep = 2
          buttonKeys = ['edit', 'sendOut']
          if (isServiceOrder) {
            self.buttonKeys = ['edit']
          }
        } else if (so.orderStatus === 1060) {
          activeStep = 3
          buttonKeys = ['confirmSendSuccess']
          if (isServiceOrder) {
            self.buttonKeys = ['validateServiceCode']
          }
        } else if (so.orderStatus === 1070) {
          activeStep = 4
          buttonKeys = []
        } else {
          activeStep = 5
          buttonKeys = []
        }
        if (so.orderPaymentType === 2 && so.orderPaymentStatus !== 3) {
          buttonKeys.push('offinePaymentVoucher')
        }
        if (isServiceOrder && so.orderStatus <= 1060) {
          buttonKeys.push('modifyServiceTime')
        }
        self.buttonKeys = buttonKeys
      })
      const params = {
        currentPage: 1,
        itemsPerPage: 10,
        obj: {
          grouponInstId: this.soDetail.so.sourceCode
        }
      }
      await this.$oms.$api.so.queryGrouponInstList(params).then(res => {
        this.soDetail.so.completedTime = this.$portal.parseTime(res.data.listObj[0].completedTime, '{y}-{m}-{d} {h}:{i}:{s}')
      })
      this.stepInfo = [
        { title: this.$t('提交订单'), desc: self.soDetail.so.orderCreateTime, active: false },
        { title: this.$t('支付完成'), desc: self.soDetail.so.orderPaymentConfirmDate, active: false },
        { title: this.$t('拼团成功'), desc: self.soDetail.so.completedTime, active: false },
        { title: this.$t('商家发货'), desc: self.soDetail.so.orderLogisticsTime, active: false },
        { title: this.$t(isServiceOrder ? '服务完成' : '完成收货'), desc: self.soDetail.so.orderReceiveDate, active: false },
        { title: this.$t('订单完成'), desc: (self.soDetail.so.orderStatus !== 9000 ? self.soDetail.so.orderCompleteDate : self.soDetail.so.orderCancelDate), active: false }
      ]
      this.stepInfo[activeStep].active = true
    }
  }
}
</script>

