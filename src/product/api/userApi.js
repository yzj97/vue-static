const baseUrl = 'ouser-web/api'

/**
 * 用户接口
 */
export default {
  // 获取当前用户信息
  getUserInfo: {
    url: baseUrl + '/employee/getUserPosition.do',
    method: 'post'
  },
  // 获取所有渠道信息
  queryChannelMap: {
    url: baseUrl + '/channel/queryChannelMap.do',
    method: 'get'
  },
  // 查询用户有权限的店铺
  queryStoreOrgChannelPage: {
    url: baseUrl + '/store/queryStoreOrgChannelPage.do',
    method: 'post'
  },
  querySalesAreaByMerchantId: {
    url: baseUrl + '/merchant/querySalesAreaByMerchantId.do',
    method: 'post'
  }
}
