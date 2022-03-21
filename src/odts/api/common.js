export default {
  // 查询店铺列表
  queryStoreOrgPageByAuth: {
    url: 'ouser-web/api/store/queryStoreOrgPageByAuth.do',
    method: 'post'
  },
  // 查询有权限的商家
  queryPlatformAuthMerchantPage: {
    url: 'ouser-web/api/merchant/queryPlatformAuthMerchantPage.do',
    method: 'post'
  },
  listMerchantProductByPage: {
    url: '/back-product-web2/extra/merchantProduct/listMerchantProductByPage.do',
    method: 'post'
  },
  // get
  getUserInfo: {
    url: 'ouser-web/mobileLogin/getUserInfo.do',
    method: 'get'
  },
  // x-www-form-urlencoded
  userInit: {
    url: 'ouser-web/api/user/init.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  }
}
