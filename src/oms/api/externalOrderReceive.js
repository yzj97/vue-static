/* externalOrderReceive */
export default {
  preSoList: {
    url: 'oms-web/preSo/listPage',
    method: 'post'
  },
  batchRehandle: {
    url: 'oms-web/preSo/batchRehandle',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  rehandle: {
    url: 'oms-web/preSo/rehandle',
    method: 'post'
  },
  syncOrders: {
    url: 'oms-web/preSo/syncOrders',
    method: 'post'
  },
  updatePreSoDetail: {
    url: 'oms-web/preSo/updatePreSoDetail',
    method: 'post'
  },
  listPreSoItem: {
    url: 'oms-web/preSoItem/list',
    method: 'post'
  }
}
