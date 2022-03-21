export default {
  getNewPO: {
    url: 'opms-web/purchaseOrder/getNewPO.do',
    method: 'post'
  },
  selectPOList: {
    url: 'opms-web/purchaseOrder/selectPOList.do',
    method: 'post'
  },
  selectPODetail: {
    url: 'opms-web/purchaseOrder/selectPODetail.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  selectProductsByPurchaseOrder: {
    url: 'opms-web/purchaseOrder/selectProductsByPurchaseOrder.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  savePo: {
    url: 'opms-web/purchaseOrder/savePO.do',
    method: 'post'
  },
  saveAndSubmitPO: {
    url: 'opms-web/purchaseOrder/saveAndSubmitPO.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  submitPO: {
    url: 'opms-web/purchaseOrder/submitPO.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  cancelPO: {
    url: 'opms-web/purchaseOrder/cancelPO.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  approvePO: {
    url: 'opms-web/purchaseOrder/approvePO.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  rejectPO: {
    url: 'opms-web/purchaseOrder/rejectPO.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  setPerformStatus: {
    url: 'opms-web/purchaseOrder/setPerformStatus.do',
    method: 'post'
  },
  queryPurchaseProductList: {
    url: 'opms-web/supplierProductAction/queryPurchaseProductList.do',
    method: 'post'
  },
  queryTradeDictionary: {
    url: 'opms-web/tradeDictionary/queryList.do',
    method: 'post'
  },
  getSupplierContact: {
    url: 'opms-web/supplier/getSupplierContact.do',
    method: 'post'
  }
}
