export default {
  getStringValue: {
    url: '/ouser-web/public/page/getStringValue',
    method: 'get'
  },
  getCurrentOrg: {
    url: '/ouser-web/org/getCurrentOrg.do',
    method: 'post',
    timeout: 10000
  },
  queryPositionList: {
    url: '/ouser-web/position/queryPositionList.do',
    method: 'post',
    timeout: 10000
  },
  batchEditUser: {
    url: '/ouser-web/departmentUser/batchEditUser.do',
    method: 'post',
    timeout: 10000
  },
  getUserInfo: {
    url: '/ouser-web/userManage/getUserInfo.do',
    method: 'post',
    timeout: 10000
  },
  saveUserInfo: {
    url: '/ouser-web/userManage/saveUserInfo.do',
    method: 'post',
    timeout: 10000
  },
  modifyPasswordOnline: {
    url: '/ouser-web/mobileRegister/modifyPasswordOnline.do',
    method: 'post',
    timeout: 10000
  },
  saveEmail: {
    url: '/ouser-web/userManage/saveEmail.do',
    method: 'post',
    timeout: 10000
  },
  sendMobileCaptchas: {
    url: '/ouser-web/userManage/sendMobileCaptchas.do',
    method: 'post',
    timeout: 10000
  },
  saveMobile: {
    url: '/ouser-web/userManage/saveMobile.do',
    method: 'post',
    timeout: 10000
  },
  getPrivateTemplate: {
    url: '/crm-web/api/wechat/getPrivateTemplate',
    method: 'post',
    timeout: 10000
  }

}
