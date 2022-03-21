export default {
  queryPlatformAuthMerchantPage: {
    url: '/ouser-web/api/merchant/queryPlatformAuthMerchantPage.do',
    method: 'post'
  },
  queryDistributorList: {
    url: '/ouser-web/registerMerchant/queryCustomerPageInfo.do',
    method: 'post'
  },
  addDistributionInfo: {
    url: '/ouser-web/registerMerchant/addDistributionInfo.do',
    method: 'post'
  },
  updateDistributionInfo: {
    url: '/ouser-web/registerMerchant/updateDistributionInfo.do',
    method: 'post'
  },
  queryDistributionDetailInfo: {
    url: '/ouser-web/registerMerchant/queryDistributionDetailInfoByOrgId.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  saveMerchantAccount: {
    url: '/back-finance-web/stmMerchantAccountController/saveMerchantAccount.do',
    method: 'post'
  },
  saveQualification: {
    url: '/back-finance-web/invoiceQualificationManage/saveQualification.do',
    method: 'post'
  },
  selectMerchantAccount: {
    url: '/back-finance-web/stmMerchantAccountController/selectMerchantAccount.do',
    method: 'post'
  },
  getInvoiceQualification: {
    url: '/back-finance-web/invoiceQualificationManage/getInvoiceQualification.do',
    method: 'post'
  },
  addEmployee: {
    url: '/ouser-web/employee/addEmployee.do',
    method: 'post'
  },
  updateEmployee: {
    url: '/ouser-web/employee/updateEmployee.do',
    method: 'post'
  },
  queryEmployee: {
    url: '/ouser-web/employee/queryEmployee.do',
    method: 'post'
  },
  updateLoginUser: {
    url: '/ouser-web/registerMerchant/updateLoginUser.do',
    method: 'post'
  },
  updateDistributionStatus: {
    url: '/ouser-web/registerMerchant/updateDistributionStatus.do',
    method: 'post'
  },
  queryMerchantOrgAddressByOrgId: {
    url: '/ouser-web/merchantOrgAddress/queryMerchantOrgAddressByOrgId.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  addMerchantOrgAddress: {
    url: '/ouser-web/merchantOrgAddress/addMerchantOrgAddress.do',
    method: 'post'
  },
  updateMerchantOrgAddressById: {
    url: '/ouser-web/merchantOrgAddress/updateMerchantOrgAddressById.do',
    method: 'post'
  },
  deleteMerchantOrgAddressById: {
    url: '/ouser-web/merchantOrgAddress/deleteMerchantOrgAddressById.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  updateDefaultWithOrgId: {
    url: '/ouser-web/merchantOrgAddress/updateDefaultWithOrgId.do',
    method: 'post'
  }
}
