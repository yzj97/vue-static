export default {
  queryPlatformAuthMerchantPage: {
    url: '/ouser-web/api/merchant/queryPlatformAuthMerchantPage.do',
    method: 'post',
    params: {
      'currentPage': 1,
      'itemsPerPage': 5000
    }
  },
  queryMerchantChannelListByDepartmentId: {
    url: 'ouser-web/api/merchant/queryMerchantChannelListByDepartmentId.do',
    method: 'post'
  }
}
