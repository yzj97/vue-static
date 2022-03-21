<template>
  <div>
    <detail :so-detail="soDetail" :button-keys="buttonKeys" :step-info.sync="stepInfo" @onSuccess="init"/>
  </div>
</template>

<script>
import Detail from '@/components/so/detail'

export default {
  name: 'OmsOrderPosShop',
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
      // this.buttonKeys = ['cancel', 'edit', 'copy', 'confirm', 'audit']
      await this.$oms.$api.so.soDetailGet({ orderCode: this.$route.params.orderCode }).then(res => {
        self.soDetail = res.data
        // 待支付
        const so = self.soDetail.so
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
          activeStep = 1
          buttonKeys = ['edit', 'sendOut']
        } else if (so.orderStatus === 1060) {
          activeStep = 1
          buttonKeys = ['confirmSendSuccess']
        } else if (so.orderStatus === 1070) {
          activeStep = 1
          buttonKeys = []
        } else {
          activeStep = 2
          buttonKeys = []
        }
        if (so.orderPaymentType === 2 && so.orderPaymentStatus !== 3) {
          buttonKeys.push('offinePaymentVoucher')
        }
        self.buttonKeys = buttonKeys
      })
      this.stepInfo = [
        { title: this.$t('提交订单'), desc: self.soDetail.so.orderCreateTime, active: false },
        { title: this.$t('支付完成'), desc: self.soDetail.so.orderPaymentConfirmDate, active: false },
        { title: this.$t('订单完成'), desc: (self.soDetail.so.orderStatus !== 9000 ? self.soDetail.so.orderCompleteDate : self.soDetail.so.orderCancelDate), active: false }
      ]
      this.stepInfo[activeStep].active = true
    }
  }
}
</script>

