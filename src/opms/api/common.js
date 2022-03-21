export default {
  queryMerchantList: {
    url: 'opms-web/merchantRead/queryMerchantList.do',
    method: 'post'
  },
  queryCurrencyList: {
    url: 'opms-web/currency/list.do',
    method: 'post'
  },
  queryStoreList: { // 查询店铺列表
    url: 'ouser-web/api/store/queryStoreOrgPageByParams.do',
    method: 'post'
  },
  querySupplierList: { // 查询供应商列表
    url: 'opms-web/api/supplier/querySupplierList.do',
    method: 'post'
  },
  getDomainInfo: {
    url: 'opms-web/common/getDomainInfo.do',
    method: 'post'
  },
  findOplogPage: { // 查询操作日志
    url: '/opms-web/public/log/listOperaActionPage.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  queryWarehoueList: {
    url: 'opms-web/warehouse/queryWarehouseList.do',
    method: 'post'
  },
  queryAreaByParentCode: {
    url: 'opms-web/region/queryAreaByParentCode.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  listByCategorysForOrder: {
    url: 'oms-web/public/order/code/listByCategorys',
    method: 'post'
  },
  selectComSettlePeriodList: {
    url: 'back-finance-web/settlePeriod/selectComSettlePeriodList.do',
    method: 'post'
  },
  categoryList: {
    url: 'opms-web/productCategory/queryFirLevelCategoryList.do',
    method: 'post'
  },
  getPortList: {
    url: 'opms-web/ComDicPort/getPortList.do',
    method: 'post'
  },
  initMerchantRootClassification: {
    url: 'ouser-web/supplierClassification/initMerchantRootClassification.do',
    method: 'post'
  },
  // 查询当前登录用户有权限的商家列表
  queryPlatformAuthMerchantPage: {
    url: 'ouser-web/api/merchant/queryPlatformAuthMerchantPage.do',
    method: 'post'
  },
  // 查询当前登录用户有权限的商家列表
  getUserPlatformAndMerchant: {
    url: 'opms-web/common/getUserPlatformAndMerchant.do',
    method: 'post'
  }

}
