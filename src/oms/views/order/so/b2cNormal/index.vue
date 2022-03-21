<template>
  <div>
    <detail :so-detail="soDetail" :button-keys="buttonKeys" :step-info.sync="stepInfo" @onSuccess="init"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Detail from '@/components/so/detail'

export default {
  name: 'OmsOrderB2cNormal',
  components: {
    Detail
  },
  data() {
    return {
      soDetail: {},
      buttonKeys: [],
      stepInfo: [],
      tempRoute: {}
    }
  },
  computed: {
    ...mapGetters([
      'language'
    ])
  },
  watch: {
    language() {
      // this.setTagsViewTitle()
    }
  },
  created() {
    this.init()
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
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
          activeStep = 1
          buttonKeys = ['edit', 'sendOut']
          if (isServiceOrder) {
            buttonKeys = ['edit']
          }
        } else if (so.orderStatus === 1060) {
          activeStep = 2
          buttonKeys = ['confirmSendSuccess', 'syncPackageDelivery']
          if (isServiceOrder) {
            buttonKeys = ['validateServiceCode']
          }
        } else if (so.orderStatus === 1070) {
          activeStep = 3
          buttonKeys = ['syncPackageDelivery']
        } else {
          activeStep = 4
          buttonKeys = []
        }
        if (isServiceOrder && so.orderStatus <= 1060) {
          buttonKeys.push('modifyServiceTime')
        }

        if (so.orderPaymentType === 2 && so.orderPaymentStatus !== 3) {
          buttonKeys.push('offinePaymentVoucher')
        }
        self.buttonKeys = buttonKeys
        // self.setTagsViewTitle()
      })
      this.stepInfo = [
        { title: this.$t('manual_order_submit'), desc: self.soDetail.so.orderCreateTime, active: false },
        { title: this.$t('payment_completion'), desc: self.soDetail.so.orderPaymentConfirmDate, active: false },
        { title: this.$t('商家发货'), desc: self.soDetail.so.orderLogisticsTime, active: false },
        { title: this.$t(isServiceOrder ? '服务完成' : '完成收货'), desc: self.soDetail.so.orderReceiveDate, active: false },
        { title: this.$t('order_completion'), desc: (self.soDetail.so.orderStatus !== 9000 ? self.soDetail.so.orderCompleteDate : self.soDetail.so.orderCancelDate), active: false }
      ]
      this.stepInfo[activeStep].active = true
    },
    setTagsViewTitle() {
      const title = this.$t('订单详情')
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.$route.params.orderCode}` })
      this.$store.dispatch('updateVisitedView', route)
    }
  }
}
</script>

