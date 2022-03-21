export default {
  getAuthMerchantList: {
    url: 'agent-web/merchant/getAuthMerchantList.do',
    method: 'post'
  },
  listByPage: {
    url: 'agent-web/saleCommissionAction/listByPage.do',
    method: 'post'
  },
  listByCategorysForOrder: {
    url: 'agent-web/common/listByCategorys',
    method: 'post'
  },
  createCommisson: {
    url: 'agent-web/saleCommissionAction/create.do',
    method: 'post'
  },
  batchUpdate: {
    url: 'agent-web/saleCommissionAction/batchUpdate.do',
    method: 'post'
  },
  getAuthStoreList: {
    url: 'agent-web/merchant/getAuthStoreList.do',
    method: 'post'
  },
  queryCommissionProductList: {
    url: 'agent-web/commission/queryCommissionProductList.do',
    method: 'post'
  },
  updateCommissionProducts: {
    url: 'agent-web/commission/updateCommissionProducts.do',
    method: 'post'
  },
  categoryList: {
    url: 'back-product-web2/extra/category/listRootCategory.do',
    method: 'post'
  },
  categoryChildList: {
    url: 'back-product-web2/extra/category/listChildrenCategory.do',
    method: 'post'
  },
  getSerialProductByParam: {
    url: 'back-product-web2/extra/merchantProduct/getSerialProductByParam.do',
    method: 'post'
  },
  merchantProductList: {
    url: '/back-product-web2/extra/merchantProduct/listMerchantProductByPage.do',
    method: 'post'
  },
  merchantBrandList: {
    url: '/back-product-web2/extra/brand/listBrandByPage.do',
    method: 'post'
  },
  verificationProducts: {
    url: 'agent-web/commission/verificationProducts.do',
    method: 'post'
  },
  addCommissionProducts: {
    url: 'agent-web/commission/addCommissionProducts.do',
    method: 'post'
  },
  goodsList: {
    url: 'agent-web/commodity/goodsList.do',
    method: 'post'
  },
  brandList: {
    url: 'agent-web/commodity/brandList.do',
    method: 'post'
  },
  // 查询有权限的店铺，可以传参merchantId
  queryPlatformAuthStorePage: {
    url: 'ouser-web/api/store/queryPlatformAuthStorePage.do',
    method: 'post'
  },
  // 查询分销员列表
  queryAgentListPage: {
    url: 'agent-web/agent/listPage.do',
    method: 'post'
  },
  batchAudit: {
    url: 'agent-web/agent/batchAudit.do',
    method: 'post'
  },
  update: {
    url: 'agent-web/agent/update.do',
    method: 'post'
  },
  addAll: {
    url: 'agent-web/agent/addAll.do',
    method: 'post'
  },
  get: {
    url: 'agent-web/agent/get.do',
    method: 'get'
  },
  getByUserId: {
    url: 'agent-web/agent/getByUserId.do',
    method: 'get'
  },
  countCustomerAndInvite: {
    url: 'agent-web/agent/countCustomerAndInvite.do',
    method: 'post'
  },
  listCustomerPage: {
    url: 'agent-web/agent/listCustomerPage.do',
    method: 'post'
  },
  importData: {
    url: 'agent-web/agent/importData.do',
    method: 'post'
  }
}
