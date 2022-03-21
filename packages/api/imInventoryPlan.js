export default {
  /* 2、查询批次盘点数据接口 */
  queryBatchInventory: {
    url: '/back-product-web/back/stock/imInventoryPlan/queryBatchInventory',
    method: 'post',
    params: {
      // inventoryCode: 1, // 盘点单号
      // merchantProductId: 1 // 商品ID
    }
  }
}
