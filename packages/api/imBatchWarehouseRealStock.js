export default {
  /* 查询商品批次库存接口 */
  queryBatchStockList: {
    url: '/back-product-web/back/stock/imBatchWarehouseRealStock/queryBatchStockList.do',
    method: 'post',
    params: {
      // merchantProductId: 1 // 商品ID
    }
  }
}
