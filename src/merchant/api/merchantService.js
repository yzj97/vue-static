export default {
  queryMerchantOrgBaseInfoByOrgId: {
    url: 'ouser-web/merchantOrgInfo/queryMerchantOrgBaseInfoByOrgId.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  addMerchantOrgBaseInfo: {
    url: 'ouser-web/merchantOrgInfo/addMerchantOrgBaseInfo',
    method: 'post'
  },
  updateMerchantOrgBaseInfoById: {
    url: 'ouser-web/merchantOrgInfo/updateMerchantOrgBaseInfoById.do',
    method: 'post'
  },
  queryAllPlatformAuthMerchantPage: {
    url: 'ouser-web/api/merchant/queryAllPlatformAuthMerchantPage.do',
    method: 'post'
  },
  addRegisterMerchantInfo: {
    url: 'ouser-web/registerMerchant/addRegisterMerchantInfo.do',
    method: 'post'
  },
  updateBusinessStatusRegisterMerchantInfo: {
    url: 'ouser-web/registerMerchant/updateBusinessStatusRegisterMerchantInfo.do',
    method: 'post'
  },
  queryRegisterMerchantPageInfo: {
    url: 'ouser-web/registerMerchant/queryRegisterMerchantPageInfo.do',
    method: 'post'
  },
  queryMerchantOrgCertificateByOrgId: {
    url: 'ouser-web/merchantOrgContact/queryMerchantOrgCertificateByOrgId.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  batchEditMerchantOrgCertificate: {
    url: 'ouser-web/merchantOrgContact/batchEditMerchantOrgCertificate.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  deleteMerchantOrgCertificateById: {
    url: '/ouser-web/merchantOrgContact/deleteMerchantOrgCertificateById.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  updateMerchantOrgChannelStatusById: {
    url: 'ouser-web/merchantOrgChannel/updateMerchantOrgChannelStatusById.do',
    method: 'post'
  },
  queryMerchantOrgChannelByOrgId: {
    url: 'ouser-web/merchantOrgChannel/queryMerchantOrgChannelByOrgId.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  batchAddMerchantOrgChannel: {
    url: 'ouser-web/merchantOrgChannel/batchAddMerchantOrgChannel.do',
    method: 'post'
  },
  /* 当前账户有权限的商家列表 */
  getAuthMerchantPage: {
    url: 'ouser-web/api/merchant/getAuthMerchantPage.do',
    method: 'post'
  }
}
