export default {
  addStoreOrgInfo: {
    url: '/ouser-web/storeAction/addStoreOrgInfo.do',
    method: 'post'
  },
  queryStoreInfo: {
    url: '/ouser-web/storeAction/queryStoreInfo.do',
    method: 'post'
  },
  queryStoreOrgChannelPage: {
    url: '/ouser-web/api/store/queryStoreOrgChannelPage.do',
    method: 'post'
  },
  queryStoreTerminalSupplierPage: {
    url: '/ouser-web/storeAction/queryStoreTerminalSupplierPage.do',
    method: 'post'
  },
  getListGrantCategoryByParam: { // all
    url: '/ouser-web/storeBusiness/getListGrantCategoryByParam.do',
    method: 'post'
  },
  listStoreCategory: { // my
    url: '/back-product-web/back/mp/storeCategoryQualification/listStoreCategory.do',
    method: 'post'
  },
  getBrandData: { // all
    url: '/ouser-web/storeBrand/getBrandData.do',
    method: 'post'
  },
  listStoreBrand: { // my
    url: '/back-product-web/back/mp/storeBrandQualification/listStoreBrand.do',
    method: 'post'
  },
  queryStoreOrderSetting: {
    url: '/ouser-web/storeSetting/queryStoreOrderSetting.do',
    method: 'post'
  },
  queryStoreCsSetting: {
    url: '/ouser-web/storeSetting/queryStoreCsSetting.do',
    method: 'post'
  },
  updateStoreCsSetting: {
    url: '/ouser-web/storeSetting/updateStoreCsSetting.do',
    method: 'post'
  },
  updateStoreInfo: {
    url: '/ouser-web/storeAction/updateStoreInfo.do',
    method: 'post',
    code: '0'
  },
  addStoreTerminalSupplier: {
    url: '/ouser-web/storeAction/addStoreTerminalSupplier.do',
    method: 'post'
  },
  deleteStoreTerminalSupplier: {
    url: '/ouser-web/storeAction/deleteStoreTerminalSupplier.do',
    method: 'post'
  },
  updateStoreTerminalSupplier: {
    url: '/ouser-web/storeAction/updateStoreTerminalSupplier.do',
    method: 'post'
  },
  saveStoreCategory: {
    url: '/back-product-web/back/mp/storeCategoryQualification/saveStoreCategory.do',
    method: 'post'
  },
  saveStoreBrand: {
    url: '/back-product-web/back/mp/storeBrandQualification/saveStoreBrand.do',
    method: 'post'
  },
  addStoreOrderSetting: {
    url: '/ouser-web/storeSetting/addStoreOrderSetting.do',
    method: 'post'
  },
  updateStoreCoverageInfo: {
    url: '/ouser-web/storeCoverageAction/updateStoreCoverageInfo.do',
    method: 'post'
  },
  queryStoreCoverageMap: {
    url: '/ouser-web/storeCoverageAction/queryStoreCoverageMap.do',
    method: 'post',
    code: '0'
  },
  queryStoreBusinessTimeInfo: {
    url: '/ouser-web/storeCalendarAction/queryStoreBusinessTimeInfo.do',
    method: 'post'
  },
  updateStoreBusinessTime: {
    url: '/ouser-web/storeCalendarAction/updateStoreBusinessTime.do',
    method: 'post'
  },
  queryStoreDistributionTimeInfo: {
    url: '/ouser-web/storeCalendarAction/queryStoreDistributionTimeInfo.do',
    method: 'post'
  },
  updateStoreDistributionTime: {
    url: '/ouser-web/storeCalendarAction/updateStoreDistributionTime.do',
    method: 'post'
  },
  listStoreWarehouseByParam: {
    url: '/back-product-web2/back/stock/warehouse/listStoreWarehouseByParam.do',
    method: 'post'
  }
}
