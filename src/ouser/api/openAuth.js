export default {
  queryPlatformAuthMerchantPage: {
    url: '/ouser-web/api/merchant/queryPlatformAuthMerchantPage.do',
    method: 'post'
  },
  queryPlatformAuthStorePage: {
    url: '/ouser-web/api/store/queryPlatformAuthStorePage.do',
    method: 'post'
  },
  getStringValue: {
    url: '/ouser-web/public/page/getStringValue',
    method: 'get'
  },
  getUserInfo: {
    url: '/ouser-web/mobileLogin/getUserInfo.do',
    method: 'get'
  },
  queryByAppKey: {
    url: '/ouser-web/openAuth/queryByAppKey',
    method: 'get',
    params: {
      'appKey': ''
    }
  },
  authorization: {
    url: '/ouser-web/openAuth/authorization',
    method: 'post'
  },
  'getAuthProjectById': {
    'url': '/ouser-web/openAuth/getAuthProjectById',
    'method': 'get',
    'params': {
      'id': ''
    }
  },
  'saveOrUpdateAuthProject': {
    'url': '/ouser-web/openAuth/saveOrUpdateAuthProject',
    'method': 'post'
  },
  'listAuthProjectPage': {
    'url': '/ouser-web/openAuth/listAuthProjectPage',
    'method': 'post'
  },
  'listAuthorizationPage': {
    'url': '/ouser-web/openAuth/listAuthorizationPage',
    'method': 'post'
  },
  'deleteAuthProject': {
    'url': '/ouser-web/openAuth/deleteAuthProject',
    'method': 'post'
  },
  'deleteAuthorization': {
    'url': '/ouser-web/openAuth/deleteAuthorization',
    'method': 'post'
  }
}
