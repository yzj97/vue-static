/* so */
export default {
  getForDetailRouter: {
    url: 'oms-web/public/so/getForDetailRouter',
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  },
  /* 订单管理 ->订单列表 */
  soListPage: {
    url: 'oms-web/so/listPage',
    method: 'post'
  },
  listSoPage: {
    url: 'oms-web/so/listSoPage',
    method: 'post'
  },
  exportDataOnline: {
    url: 'oms-web/order/exportDataOnline',
    method: 'post'
  },
  copyOrder: {
    url: 'oms-web/so/copyOrder',
    method: 'post'
  },
  soCloneOrder: {
    url: 'oms-web/so/clone',
    method: 'post'
  },
  soConfirmDelivered: {
    url: 'oms-web/so/confirmDelivered',
    method: 'post'
  },
  soGet: {
    url: 'oms-web/so/get',
    method: 'post'
  },
  soGetByCode: {
    url: 'oms-web/so/code',
    method: 'post'
  },
  /* 更新订单标签 */
  updateLabel: {
    url: 'oms-web/so/updateLabel',
    method: 'post'
  },
  soImport: {
    url: 'oms-web/so/import',
    method: 'post'
  },
  soExport: {
    url: 'oms-web/so/export',
    method: 'post'
  },
  soVirtualDelivery: {
    url: 'oms-web/so/virtualDelivery',
    method: 'post'
  },
  soUpdateFields: {
    url: 'oms-web/so/updateFields',
    method: 'post'
  },
  soCancelOrder: {
    url: 'oms-web/so/cancel',
    method: 'post'
  },
  soRevokeCancel: {
    url: 'oms-web/so/revokeCancel',
    method: 'post'
  },
  soOrderTotalAmount: {
    url: 'oms-web/so/totalAmount',
    method: 'post'
  },
  soOrderedAmount: {
    url: 'oms-web/so/orderedAmount',
    method: 'post'
  },
  soCalcProfit: {
    url: 'oms-web/so/calcProfit',
    method: 'post'
  },
  soNotifyMail: {
    url: 'oms-web/so/notifyMail',
    method: 'post'
  },
  /* 订单详情基本信息 */
  soDetailGet: {
    url: 'oms-web/so/getSoDetail',
    method: 'post'
  },
  soUpdateStatus: {
    url: 'oms-web/so/updateStatus',
    method: 'post'
  },
  /* 订单列表 -> 确认签收 */
  soConfirmReceive: {
    url: 'oms-web/so/confirmReceive',
    method: 'post'
  },
  /*  同步包裹状态 */
  soSyncPackageDelivery: {
    url: 'odts-web/order/syncOrderDelivery.do',
    method: 'post'
  },
  /* 订单列表 -> 更新预计发货时间 */
  updateExpectDeliverDate: {
    url: 'oms-web/so/updateExpectDeliverDate',
    method: 'post'
  },
  /* 订单列表 -> 修改运费 */
  modifyFreightPrice: {
    url: 'oms-web/so/modifyFreightPrice',
    method: 'post'
  },
  /* 订单取消 */
  cancelOrder: {
    url: 'oms-web/so/cancel',
    method: 'post'
  },
  /* 订单导出 */
  soListExport: {
    url: 'oms-web/so/export',
    method: 'post'
  },
  soListLineExport: {
    url: 'oms-web/so/exportLine',
    method: 'post'
  },
  soListImport: {
    url: 'oms-web/so/import',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  },
  /* 订单附件及备注 */
  soAnnexAndRemarksGet: {
    url: 'oms-web/so/getSoAnnexAndRemarks',
    method: 'post'
  },
  soAnnexAndRemarksUpdate: {
    url: 'oms-web/so/updateSoAnnexAndRemarks',
    method: 'post'
  },
  /* 获取订单查询详情 */
  soPayInfoGetSoPayInfo: {
    url: 'oms-web/so/getSoPayInfo',
    method: 'post'
  },
  soBatchUpdate: {
    url: 'oms-web/so/batchUpdate',
    method: 'post'
  },
  soUpdate: {
    url: 'oms-web/so/update',
    method: 'post'
  },
  editGiveProduct: {
    url: 'oms-web/so/editGiveProduct',
    method: 'post'
  },
  countByOrderStatus: {
    url: 'oms-web/so/countByOrderStatus',
    method: 'post'
  },
  validateServiceCode: {
    url: 'oms-web/so/validateServiceCode',
    method: 'post'
  },
  modifyServiceTime: {
    url: 'oms-web/so/modifyServiceTime',
    method: 'post'
  },
  /* 判断订单是否已全部转do */
  allToDo: {
    url: 'oms-web/soPackage/allToDo',
    method: 'post'
  },
  /* 查询拼团订单拼团成功的时间 */
  queryGrouponInstList: {
    url: 'back-promotion-web/patchGrouponRead/queryGrouponInstList.do',
    method: 'post'
  }
}
