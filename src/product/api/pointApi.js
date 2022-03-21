const baseUrl = 'back-product-web/back'
/**
 * 积分接口
 */
export default {
  getProductPointByMpId: {
    url: baseUrl + '/merchantProductPricePoint/getProductPointByMpId.do',
    method: 'post'
  },
  saveOrUpdateProductPoint: {
    url: baseUrl + '/merchantProductPricePoint/saveOrUpdateProductPoint.do',
    method: 'post'
  },
  deleteProductPoint: {
    url: baseUrl + '/merchantProductPricePoint/deleteProductPoint.do',
    method: 'post'
  }
}
