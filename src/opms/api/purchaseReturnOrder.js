export default {
  purchaseReturnOrderListPage: {
    url: 'opms-web/purchaseReturnOrder/selectPurchaseReturnOrderList.do',
    method: 'post'
  },
  purchaseReturnOrderDetail: {
    url: 'opms-web/purchaseReturnOrder/selectPurchaseReturnOrderDetail.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  purchaseReturnProductList: {
    url: 'opms-web/purchaseReturnOrder/selectProductsByPurchaseReturnOrder.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }

}
