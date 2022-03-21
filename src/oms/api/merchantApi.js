const baseUrl = 'ouser-web/api'

/**
 * 商家接口
 */
export default {
  // 查询当前登录用户有权限的商家列表
  queryPlatformAuthMerchantPage: {
    url: baseUrl + '/merchant/queryPlatformAuthMerchantPage.do',
    method: 'post'
  },
  // 查询当前登录用户有权限的仓库列表
  queryPlatformAuthWarehousePage: {
    url: baseUrl + '/warehouse/queryPlatformAuthWarehousePage.do',
    method: 'post'
  },
  // 查询有权限的店铺，可以传参merchantId
  queryPlatformAuthStorePage: {
    url: baseUrl + '/store/queryPlatformAuthStorePage.do',
    method: 'post'
  }
}
