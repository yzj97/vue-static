/* externalRefundReceive */
export default {
  preSoReturnList: {
    url: 'oms-web/preSoReturn/listPage',
    method: 'post'
  },
  batchReHandlePreSoReturn: {
    url: 'oms-web/preSoReturn/batchReHandle',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  reHandlePreSoReturn: {
    url: 'oms-web/preSoReturn/reHandle',
    method: 'post'
  },
  syncRefundOrders: {
    url: 'oms-web/preSoReturn/syncRefundOrders',
    method: 'post'
  }
}
