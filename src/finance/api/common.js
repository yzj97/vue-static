export default {
  /* 财务线  */
  /* 查询字典表 */
  codeList: {
    url: 'back-finance-web/code/list.do',
    method: 'post'
  },
  /* 批量查询字典表 */
  codeListMulti: {
    url: 'back-finance-web/code/listMulti.do',
    method: 'post'
  },
  /* 查询字典表 */
  codeSelect: {
    url: 'back-finance-web/code/select.do',
    method: 'post'
  },
  /* 批量查询字典表 */
  codeSelectMulti: {
    url: 'back-finance-web/code/selectMulti.do',
    method: 'post'
  },
  /* 查询代码中定义的字典 */
  codeSelectDic: {
    url: 'back-finance-web/code/selectDic.do',
    method: 'post'
  },
  /* 批量查询代码中定义的字典 */
  codeSelectDicMulti: {
    url: 'back-finance-web/code/selectDicMulti.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  queryMerchantList: {
    url: 'ouser-web/api/merchant/queryPlatformAuthMerchantPage.do',
    method: 'post'
  },
  queryStoreList: {
    url: 'ouser-web/api/store/queryPlatformAuthStorePage.do',
    method: 'post'
  },
  /* 用户线  */
  listAllChannels: {
    url: 'ouser-web/api/channel/queryChannelMap.do',
    method: 'get'
  },
  soPickUserList: {
    url: 'ouser-web/api/employee/queryEmployeePage.do',
    method: 'post'
  },
  queryCodeList: {
    url: 'back-finance-web/code/list.do',
    method: 'post'
  },
  findOplogPage: {
    url: 'back-finance-web/public/log/listOperaActionPage.do',
    method: 'post'
  },
  queryPlatformAndDefaultMerchant: {
    url: 'back-finance-web/platform/queryPlatformAndDefaultMerchant.do',
    method: 'post'
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
  merchantManageChannel: {
    url: 'ouser-web/api/merchant/getMerchantChannelList.do',
    method: 'post'
  },
  /* 查询商家下店铺 */
  storeList: {
    url: 'ouser-web/api/store/queryStoreOrgPageByParams.do',
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
  /* 当前账户有权限的商家列表 */
  getAuthMerchantPage: {
    url: 'ouser-web/api/merchant/getAuthMerchantPage.do',
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
  queryCurrencyList: {
    url: 'opms-web/currency/list.do',
    method: 'post'
  },

  /** 采购中心 */
  querySupplierList: {
    url: 'opms-web/api/supplier/querySupplierList.do',
    method: 'post'
  },
  getConfigByKey: {
    url: 'back-finance-web/osc/getConfigByKey.do',
    method: 'get'
  },
  /** 查询仓库列表 */
  queryWarehoueList: {
    url: 'back-finance-web/warehouseRead/queryWarehouseList.do',
    method: 'post'
  },
  soTypeList: {
    url: 'oms-web/soType/list',
    method: 'get'
  }
}
