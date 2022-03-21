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
  },
  // 查询当前用户所有的有权限的商家列表 包括停用等
  queryAllPlatformAuthMerchantPage: {
    url: baseUrl + '/merchant/queryAllPlatformAuthMerchantPage.do',
    method: 'post'
  },
  // 根据ID查询商家信息
  queryMerchantOrgBaseInfoByOrgId: {
    url: 'ouser-web/merchantOrgInfo/queryMerchantOrgBaseInfoByOrgId.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }
}
