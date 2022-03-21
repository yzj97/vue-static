'use strict'

const utils = {
  toOrderDetail: function(vm, orderCode, orderSource, sysSource) {
    if ((typeof (orderSource) === 'undefined' || orderSource > -1) &&
        (typeof (sysSource) === 'undefined' || sysSource == null)) {
      vm.$oms.$api.so.getForDetailRouter({ orderCode: orderCode }).then((res) => {
        const router = this.getOrderDetailRouter(res.data.orderCode, res.data.orderSource, res.data.sysSource)
        vm.$router.push({
          name: router,
          params: {
            orderCode: orderCode
          }
        })
      })
    } else {
      const router = this.getOrderDetailRouter(orderCode, orderSource, sysSource)
      vm.$router.push({
        name: router,
        params: {
          orderCode: orderCode
        }
      })
    }
  },
  getOrderDetailRouter: function(orderCode, orderSource, sysSource) {
    let router = 'OmsOrderB2cNormal'
    if (orderSource === 1) {
      router = 'OmsOrderB2cTuanGou'
    } else if (orderSource === 9) {
      router = 'OmsOrderB2cYuShou'
    } else if (orderSource === 13) {
      router = 'OmsOrderPosFood'
    } else if (orderSource === 7) {
      router = 'OmsOrderPosShop'
    }
    if (router === 'OmsOrderB2cNormal' && sysSource === '110003') {
      router = 'OmsOrderO2oNormal'
    }
    return router
  }
}

export default utils
