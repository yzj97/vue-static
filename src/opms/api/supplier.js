export default {
  queryPlatformSupplierList: {
    url: 'opms-web/supplier/queryPlatformSupplierList.do',
    method: 'post'
  },
  queryMerchatWithOutSupplierList: {
    url: 'opms-web/supplier/queryMerchatWithOutSupplierList.do',
    method: 'post'
  },
  queryPlatformBindSupplierList: {
    url: 'opms-web/supplier/queryPlatformBindSupplierList.do',
    method: 'post'
  },
  exportPlatformBindSupplierList: {
    url: 'opms-web/supplier/exportPlatformBindSupplierList.do',
    method: 'get'
  },
  deletePlatformBindSupplierList: {
    url: 'opms-web/supplier/deletePlatformBindSupplierList.do',
    method: 'post'
  },
  bindPlatformSupplier: {
    url: '/ouser-web/registerMerchant/addPlatformSupplier.do',
    method: 'post'
  },
  saveOrUpdateDistribution: {
    url: '/ouser-web/registerMerchant/saveOrUpdateDistribution.do',
    method: 'post'
  },
  getMerchantList: {
    url: 'opms-web/merchant/getMerchantList.do',
    method: 'post'
  },

  querySupplierList: {
    url: 'opms-web/supplier/querySupplierList.do',
    method: 'post'
  },
  queryMerchantList: {
    url: 'opms-web/merchantRead/queryMerchantList.do'
  },
  querySupplierClassificationTree: {
    url: '/ouser-web/supplierClassification/querySupplierClassificationTree.do',
    method: 'post'
  },
  // 供应商管理-编辑联系人
  saveOrUpdateMerchantOrgContact: {
    url: '/ouser-web/merchantOrgContact/saveOrUpdateMerchantOrgContact.do',
    method: 'post'
  },
  deleteMerchantOrgCertificateById: {
    url: '/ouser-web/merchantOrgCertificate/deleteMerchantOrgCertificateById.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },

  addMerchantOrgCertificate: {
    url: '/ouser-web/merchantOrgCertificate/addMerchantOrgCertificate.do',
    method: 'post'
  },
  updateMerchantOrgCertificateById: {
    url: '/ouser-web/merchantOrgCertificate/updateMerchantOrgCertificateById.do',
    method: 'post'
  },
  // 获取供应商详情
  queryDistributionDetailInfoByOrgId: {
    url: '/ouser-web/registerMerchant/queryDistributionDetailInfoByOrgId.do',
    method: 'post'
  },
  // 供应商-发货地址信息
  queryMerchantOrgAddressByOrgId: {
    url: '/ouser-web/merchantOrgAddress/queryMerchantOrgAddressByOrgId.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 供应商-收款信息
  selectMerchantAccount: {
    url: '/back-finance-web/stmMerchantAccountController/selectMerchantAccount.do',
    method: 'post',
    params: {
      // 'merchantId': '1910140000083829'
    }
  },
  // 保存
  saveMerchantAccount: {
    url: 'back-finance-web/stmMerchantAccountController/saveMerchantAccount.do',
    method: 'post'
  },
  queryDistributionByPageInfo: {
    // 供应商查询
    url: '/ouser-web/api/registerMerchant/queryDistributionByPageInfo.do',
    method: 'post'
  },
  // 禁用供应商
  updateDistributionStatus: {
    url: '/ouser-web/registerMerchant/updateDistributionStatus.do',
    method: 'post'
  },
  // 导出供应商
  exportSupplier: {
    url: '/ouser-web/registerMerchant/exportSupplier.do',
    method: 'post'
  },
  listOperActionPage: {
    url: '/ouser-web/public/log/listOperActionPage',
    method: 'post'
  },
  // 供应商管理-删除联系人
  deleteOrgContactById: {
    url: '/ouser-web/merchantOrgContact/deleteOrgContactById.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 查询有权限关联平台商家列表
  queryNotExistSupplierAuthMerchantPage: {
    url: 'ouser-web/api/merchant/queryNotExistSupplierAuthMerchantPage.do',
    method: 'post'
  }
}
