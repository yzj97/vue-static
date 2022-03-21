export default {
  queryPurchaseChangeOrderList: { // 查询列表
    url: 'opms-web/purchaseChangeOrderAction/queryPurchaseChangeOrderList.do',
    method: 'post'
  },
  updateChangeOrderStatus: { // 更新状态
    url: 'opms-web/purchaseChangeOrderAction/updateChangeOrderStatus.do',
    method: 'post'
  },
  initPurchaseChangeOrder: { // 初始化更正单
    url: 'opms-web/purchaseChangeOrderAction/initPurchaseChangeOrder.do',
    method: 'post'
  },
  queryPurchaseChangeOrder: { // 查询更正单详细信息
    url: 'opms-web/purchaseChangeOrderAction/queryPurchaseChangeOrder.do',
    method: 'post'
  },
  delPurchaseChangeOrderProducts: { // 删除更正商品
    url: 'opms-web/purchaseChangeOrderAction/delPurchaseChangeOrderProducts.do',
    method: 'post'
  }
}
