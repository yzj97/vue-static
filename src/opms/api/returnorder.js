export default {
  purchaseReturnOrderListPage: { // 查询列表
    url: 'opms-web/purchaseReturnOrder/selectPurchaseReturnOrderList.do',
    method: 'post'
  },
  getNewPurchaseReturnOrder: { // 获得新的退货单
    url: 'opms-web/purchaseReturnOrder/getNewPurchaseReturnOrder.do',
    method: 'post'
  },
  savePurchaseReturnOrder: { // 保存退货单
    url: 'opms-web/purchaseReturnOrder/savePurchaseReturnOrder.do',
    method: 'post'
  },
  updateReturnOrderStatus: { // 修改状态
    url: 'opms-web/purchaseReturnOrder/updateReturnOrderStatus.do',
    method: 'post'
  },
  selectPurchaseReturnOrderDetailInfo: { // 查询退货单详情信息
    url: 'opms-web/purchaseReturnOrder/selectPurchaseReturnOrderDetailInfo.do',
    method: 'post'
  },
  selectPurchaseReturnOrderProductList: { // 查询退货单商品明细
    url: 'opms-web/purchaseReturnOrder/selectPurchaseReturnOrderProductList.do',
    method: 'post'
  },
  queryStoreOrgPageByParams: { // 查询店铺列表
    url: 'ouser-web/api/store/queryStoreOrgPageByParams.do',
    method: 'post'
  },
  querySupplierList: { // 查询供应商列表
    url: 'opms-web/api/supplier/querySupplierList.do',
    method: 'post'
  }
}
