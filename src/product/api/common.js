export default {
  dataTask_listPage: {
    url: 'back-product-web/public/data/task/listPage',
    method: 'post'
  },
  dataTask_listPageWithDataAuth: {
    url: 'back-product-web/public/data/task/listPage?filterDataAuth=true',
    method: 'post'
  },
  importTask: {
    url: 'back-product-web/back/import/task/getList.do',
    method: 'post'
  },
  downloadTask: {
    url: 'ouser-web/asyncexport/getAsyncEventList.do',
    method: 'get'
  },
  areaList: {
    url: '/ouser-web/public/area/listTree.do',
    method: 'post'
  },
  listMultiCode: {
    url: 'back-product-web/public/config/listMulti',
    method: 'post'
  },
  querySalesAreaByMerchantId: {
    url: 'ouser-web/api/merchant/querySalesAreaByMerchantId.do',
    method: 'post'
  },
  querySoTypeList: {
    url: '/oms-web/soType/list',
    method: 'get'
  },
  queryStoreLocation: {
    url: 'ouser-web/api/store/pos/queryStoreLocation.do',
    method: 'post'
  },
  queryDistributionByPageInfo: {
    // 供应商查询
    url: '/ouser-web/api/registerMerchant/queryDistributionByPageInfo.do',
    method: 'post'
  }
}
