export default {
  purchaseOrderListPage: {
    url: 'opms-web/purchaseOrder/selectPOList.do',
    method: 'post'
  },
  purchaseOrderDetail: {
    url: 'opms-web/purchaseOrder/myorder/selectPODetail.do',
    method: 'post'
  },
  purchaseOrderProducts: {
    url: 'opms-web/purchaseOrder/myorder/selectProductsByPurchaseOrder.do',
    method: 'post'
    // , headers: {
    //   'Content-Type': 'text/plain;charset=UTF-8'
    // }
  },
  purchaseOrderProductList: {
    url: 'opms-web/purchaseOrder/selectPOProductListByPage.do',
    method: 'post'
  },
  selectFileList: {
    url: 'opms-web/comAttachFile/selectFileList.do',
    method: 'post'
  }
}
