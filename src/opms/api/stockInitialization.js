export default {
  // 查询
  listPage: {
    url: 'opms-web/warehouseStockInitOrder/listPage.do',
    method: 'post'
  },
  // 删除
  delete: {
    url: 'opms-web/warehouseStockInitOrder/delete.do',
    method: 'post'
  },
  // 初始化
  init: {
    url: 'opms-web/warehouseStockInitOrder/init.do',
    method: 'post'
  },
  // 编辑
  listPage2: {
    url: 'opms-web/warehouseStockInitProduct/listPage.do',
    method: 'post'
  },
  // 仓库列表
  stockListInMerchant: {
    url: 'opms-web/warehouseStockInitProduct/stockListInMerchant.do',
    method: 'post'
  },
  // 当前商家
  getMerchantList: {
    url: 'opms-web/merchant/getMerchantList.do',
    method: 'post'
  },
  productList: {
    url: 'opms-web/warehouseStockInitProduct/listPage.do',
    method: 'post'
  },
  deleteProduct: {
    url: 'opms-web/warehouseStockInitProduct/deleteByIds.do',
    method: 'post'
  },

  saveOrUpdate: {
    url: 'opms-web/warehouseStockInitProduct/saveOrUpdate.do',
    method: 'post'
  },
  getByOrderCode: {
    url: 'opms-web/warehouseStockInitOrder/getByOrderCode.do',
    method: 'post'
  },
  productInWarehouse: {
    url: 'opms-web/product/getMerchantProductsByDistribution.do',
    method: 'post'
  },
  // 全部导出
  exportFailData: {
    url: 'opms-web/warehouseStockInitProduct/exportFailData.do',
    method: 'post'
  },
  // 查询商家成本核算方式
  finMerchantCostAccountingConfig: {
    url: 'back-finance-web/finMerchantCostAccountingConfig/list.do',
    method: 'post'
  }

}
