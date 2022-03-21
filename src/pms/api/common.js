export default {
  /* 订单线 通用  */
  /* 订单线  */
  login: {
    url: 'oms-web/login',
    method: 'post'
  },
  logout: {
    url: 'oms-web/logout',
    method: 'post'
  },
  /* 左边菜单栏 */
  leftTree: {
    url: 'oms-web/public/user/listUserMenuForPc',
    method: 'get'
  },
  permissionBtnCodeList: {
    url: 'oms-web/public/user/listUserOpsForPc',
    method: 'get'
  },
  /* 获取所有的select框值 */
  listByCategoryForOrder: {
    url: 'oms-web/public/order/code/listByCategory',
    method: 'get'
  },
  listByCategorysForOrder: {
    url: 'oms-web/public/order/code/listByCategorys',
    method: 'post'
  },
  listTreeByCategoryForOrder: {
    url: 'oms-web/public/order/code/listTreeByCategory',
    method: 'post'
  },
  selectCodes: {
    url: 'oms-web/public/order/code/select',
    method: 'get'
  },
  listActionLogPage: {
    url: 'oms-web/public/log/listActionLogPage',
    method: 'post'
  },
  listOperActionPage: {
    url: 'oms-web/public/log/listOperActionPage',
    method: 'post'
  },
  /* 上传图片 */
  imageUpload: {
    url: 'oms-web/public/upload/imageUpload',
    method: 'post'
  },
  /* 上传文件 */
  fileUpload: {
    url: 'oms-web/public/upload/uploadFile',
    method: 'post'
  },
  /* 省市区 */
  getAreaListNoPaging: {
    url: 'oms-web/public/area/list',
    method: 'get'
  },
  getAreaListTree: {
    url: 'oms-web/public/area/listTree',
    method: 'post'
  },
  getAreaListByKey: {
    url: 'oms-web/public/area/select',
    method: 'get'
  },
  /* 获得当前的platformId */
  platformGetPlatformId: {
    url: 'oms-web/public/platform/getPlatformId',
    method: 'post'
  },
  /* 查询当前登录用户所属商家 */
  getUserMerchantInfo: {
    url: 'oms-web/public/merchant/getUserMerchantInfo',
    method: 'get'
  },

  /* 财务线  */
  /* 查询线下订单支付详情 */
  queryVoucherDetail: {
    url: 'back-finance-web/api/arOffineOrder/queryVoucherDetail.do',
    method: 'post'
  },
  /* 获取币种、汇率 */
  getCurrencies: {
    url: 'back-finance-web/api/exchangeRate/queryExchangeRateList.do',
    method: 'post'
  },
  /* 获取币种 */
  queryCurrencyTypeList: {
    url: 'back-finance-web/api/currencyType/queryCurrencyTypeList.do',
    method: 'post'
  },

  /* 用户线  */
  listAllChannels: {
    url: 'ouser-web/api/channel/queryChannelMap.do',
    method: 'get'
  },
  soPickUserList: {
    url: 'ouser-web/employee/queryEmployeePage.do',
    method: 'post'
  },
  queryStoreSetting: {
    url: 'ouser-web/api/store/queryStoreOrderSetting.do',
    method: 'post'
  },
  queryMerchantOrgAddressByOrgId: {
    url: 'ouser-web/merchantOrgAddress/queryMerchantOrgAddressByOrgId',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },

  /* 商家线  */
  /* backMerchantWebPath */
  backMerchantWebQueryInventory: {
    url: 'ouser-web/inventoryAction/queryInventoryInfoList.do',
    method: 'post'
  },
  /* 查询商家下拉框 */
  merchantList: {
    url: '/ouser-web/api/merchant/queryPlatformAuthMerchantPage.do',
    method: 'post'
  },
  /* 获取经销商的商家列表 */
  merchantCistributionList: {
    url: '/ouser-web/api/merchant/getMerchantDistributionById.do',
    method: 'post'
  },
  /* 获取经销商列表 */
  distributorList: {
    url: '/ouser-web/api/merchant/queryPlatformAuthMerchantPage.do',
    method: 'post'
  },
  /* 获取经销商列表，拥有权限的 */
  disOrgInfoList: {
    url: '/ouser-web/api/merchant/queryPlatformAuthDisOrgInfoPage.do',
    method: 'post'
  },
  merchantManageChannel: {
    url: 'ouser-web/api/merchant/getMerchantChannelList.do',
    method: 'post'
  },
  /* 查询商家下店铺 */
  storeList: {
    url: 'ouser-web/api/store/queryStoreOrgChannelPage.do',
    method: 'post'
  },
  /* 经销商 - 分页根据条件查询所有经销商列表 */
  distributorOrgList: {
    url: 'ouser-web/api/merchant/queryDistributionInfoPage.do',
    method: 'post'
  },
  /* 分销商 - 分页根据条件查询所有分销商列表 */
  dealerOrgList: {
    url: 'ouser-web/api/merchant/queryDealerInfoPage.do',
    method: 'post'
  },
  /* 加盟商 - 分页根据条件查询所有加盟商列表 */
  franchiseeOrgList: {
    url: 'ouser-web/api/merchant/queryFranchiseeInfoPage.do',
    method: 'post'
  },
  /* 获得商家渠道对应的店铺列表 */
  merchantStoreList: {
    url: 'ouser-web/api/store/queryStoreOrgChannelPage.do',
    method: 'post'
  },
  /* 获取客户列表，拥有权限的 */
  queryCustomerList: {
    url: 'ouser-web/api/merchant/queryPlatformAuthCustomerPage.do',
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
  merchantProductList: {
    url: '/back-product-web2/extra/merchantProduct/listMerchantProductByPage.do',
    method: 'post'
  },
  merchantProductPriceList: {
    url: 'back-product-web2/extra/price/listMerchantProductPriceByChannelCode.do',
    method: 'post'
  },
  merchantBrandList: {
    url: '/back-product-web2/extra/brand/listBrandByPage.do',
    method: 'post'
  },
  getAdvancePriceByParam: {
    url: 'back-product-web2/extra/price/getAdvancePriceByParam.do',
    method: 'post'
  },
  getPriceSheetDetailByParam: {
    url: 'back-product-web2/extra/price/getPriceSheetDetailByParam.do',
    method: 'post'
  },
  /* 获取品牌列表 */
  brandList: {
    url: 'back-product-web2/extra/brand/listBrandByPage.do',
    method: 'post'
  },
  /* 获取仓库列表 */
  listStoreWarehouse: {
    url: 'back-product-web2/back/stock/warehouse/listStoreWarehouseByParam.do',
    method: 'post'
  },
  /* 获取系列子品 */
  getSerialProductByParam: {
    url: 'back-product-web2/extra/merchantProduct/getSerialProductByParam.do',
    method: 'post'
  },
  /* 根据storeId查询店铺退货发货地址 */
  queryStoreAddressList: {
    url: 'ouser-web/api/store/queryStoreAddressList.do',
    method: 'post'
  },
  /* 查询用户列表 */
  userList: {
    url: 'ouser-web/api/user/getUserOnlyByConditionsWithPage.do',
    method: 'post'
  },
  /**
   * 查询仓库的地址
   *
   */
  queryWarehouseAddress: {
    url: 'back-product-web/back/stock/storeWarehouse/listStoreWarehouseWithPage.do',
    method: 'post'
  },
  dataexTransOrdersDetailCancel: {
    url: 'oms-dataex/wms/cancelShipment',
    method: 'get'
  },
  getStringValue: {
    url: '/ouser-web/public/page/getStringValue',
    method: 'get'
  },
  /* 查询仓库列表 */
  queryWarehouseList: {
    url: 'opms-web/warehouse/queryWarehouseList.do',
    method: 'post'
  },
  areaList: {
    url: '/ouser-web/public/area/listTree.do',
    method: 'post'
  },
  // 查询当前登录用户有权限的仓库列表
  queryPlatformAuthWarehousePage: {
    url: 'ouser-web/api/warehouse/queryPlatformAuthWarehousePage.do',
    method: 'post'
  }
}
