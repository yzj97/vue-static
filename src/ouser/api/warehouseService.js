export default {
  listStoreWarehouseByParam: {
    url: '/back-product-web2/back/stock/warehouse/listStoreWarehouseByParam.do',
    method: 'post'
  },
  getStockDetail: {
    url: 'back-product-web/back/stock/storeWarehouse/get.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }
}
