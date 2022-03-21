export default {
  listPage: {
    url: 'ouser-web/userVip/listPage',
    method: 'post'
  },
  add: {
    url: 'ouser-web/userVip/add',
    method: 'post'
  },
  enable: {
    url: 'ouser-web/userVip/enable',
    method: 'post'
  },
  aysnImport: {
    url: 'ouser-web/userVip/asynImport',
    method: 'post'
  },
  // 查询未授权的用户
  getNoAuthenticationUser: {
    url: 'ouser-web/userVip/getNoAuthenticationUser.do',
    method: 'post'
  },
  // 确定绑定
  employeeCertification: {
    url: 'ouser-web/userVip/employeeCertification.do',
    method: 'post'
  },
  getUserBaseInfoById: { // 查询会员基本信息
    url: 'ouser-web/userInfoAction/getUserBaseInfoById.do',
    method: 'post'
  }

}
