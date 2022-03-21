export default {
  listByCategorysForOrder: {
    url: 'oms-web/public/order/code/listByCategorys',
    method: 'post'
  },
  queryBrandList: {
    url: 'agent-web/commodity/brandList.do',
    method: 'post'
  },
  queryUserList: {
    url: 'agent-web/user/list.do',
    method: 'post'
  },
  merchantList: {
    url: '/ouser-web/api/merchant/queryPlatformAuthMerchantPage.do',
    method: 'post'
  },
  queryPlatformAuthMerchantPage: {
    url: '/ouser-web/api/merchant/queryPlatformAuthMerchantPage.do',
    method: 'post'
  },
  getMerchantPage: {
    url: '/ouser-web/api/merchant/getMerchantPage.do',
    method: 'post'
  },
  merchantCategoryList: {
    url: 'agent-web/commodity/merchantCategoryList.do',
    method: 'post'
  },
  listMulti: {
    url: 'agent-web/common/listByCategorys.do',
    method: 'post'
  },
  getPlatformId: {
    url: 'agent-web/common/getPlatformId.do',
    method: 'post'
  },
  /* 商品线  */
  categoryChildList: {
    url: 'back-product-web2/extra/category/listChildrenCategory.do',
    method: 'post'
  },
  categoryList: {
    url: 'back-product-web2/extra/category/listRootCategory.do',
    method: 'post'
  },
  code_listMulti: {
    url: 'agent-web/public/config/listMulti',
    method: 'post'
  },
  querySimpleMemberList: {
    url: 'ouser-web/member/querySimpleMemberList.do',
    method: 'post'
  }
}
