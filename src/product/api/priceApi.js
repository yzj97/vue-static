const baseUrl = 'back-product-web/back/price'
/**
 * 价格接口
 */
export default {
  batchUpdateAuditStatusWithTx: {
    url: baseUrl + '/mpPriceAudit/batchUpdateAuditStatusWithTx.do',
    method: 'post'
  },
  batchUpdateStoreStatusWithTx: {
    url: baseUrl + '/mpPriceAudit/batchUpdateStoreStatusWithTx.do',
    method: 'post'
  },
  listMerchantProductPriceAuditDetailByPriceAuditId: {
    url: baseUrl + '/mpPriceAudit/listMerchantProductPriceAuditDetailByPriceAuditId.do',
    method: 'post'
  },
  // 分组获取商家价格审核列表状态的数量
  countMpAuditMap: {
    url: baseUrl + '/mpPriceAudit/countMpAuditMap.do',
    method: 'post'
  },
  // 分组获取店铺价格审核列表状态的数量
  countStoreMpAuditMap: {
    url: baseUrl + '/mpPriceAudit/countStoreMpAuditMap.do',
    method: 'post'
  },
  generatingAlgorithmWhenAdd: {
    url: baseUrl + '/merchantProductPrice/generatingAlgorithmWhenAdd.do',
    method: 'post'
  },
  savePriceSheet: {
    url: baseUrl + '/merchantProductPrice/savePriceSheet.do',
    method: 'post'
  },
  updatePriceSheet: {
    url: baseUrl + '/merchantProductPrice/updatePriceSheet.do',
    method: 'post'
  },
  queryPriceSheetForEdit: {
    url: baseUrl + '/merchantProductPrice/queryPriceSheetForEdit.do',
    method: 'post'
  },
  queryPriceSheetStrategyForEdit: {
    url: baseUrl + '/merchantProductPrice/queryPriceSheetStrategyForEdit.do',
    method: 'post'
  },
  queryMerchantProductPriceInfo: {
    url: baseUrl + '/merchantProductPrice/queryMerchantProductPriceInfo.do',
    method: 'post'
  },
  batchUpdatePlatformProductPriceById: {
    url: baseUrl + '/platformMpPrice/batchUpdatePriceById.do',
    method: 'post'
  },
  updateMerchantProductPrice: {
    url: baseUrl + '/merchantProductPrice/updateMerchantProductPrice.do',
    method: 'post'
  }
}
