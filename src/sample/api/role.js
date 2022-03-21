export default {
  // post接口
  queryAllRoleDataPage: {
    url: 'ouser-web/role/queryAllRoleDataPage.do',
    method: 'post'
  },
  // post接口并且data是string, 必须指定headers
  loadOscConfigUrl: {
    url: 'back-promotion-web/oscRead/loadOscConfig.action',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // get
  getUserInfo: {
    url: 'ouser-web/mobileLogin/getUserInfo.do',
    method: 'get'
  },
  // x-www-form-urlencoded
  userInit: {
    url: 'ouser-web/api/user/init.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  }
}
