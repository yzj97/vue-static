export default {
  getCurrentOrg: {
    url: '/ouser-web/org/getCurrentOrg.do',
    method: 'post'
  },
  queryPositionList: {
    url: '/ouser-web/position/queryPositionList.do',
    method: 'post'
  },
  batchEditUser: {
    url: '/ouser-web/departmentUser/batchEditUser.do',
    method: 'post'
  },
  getEmployeeOn: {
    url: '/ouser-web/user/getEmployeeOn',
    method: 'post'
  },
  updateEmployeeOn: {
    url: '/ouser-web/user/updateEmployeeOn',
    method: 'post'
  },
  batchUpdateUserAuth: {
    url: '/ouser-web/user/batchUpdateUserAuth',
    method: 'post'
  },
  getUserInfo: {
    url: '/ouser-web/userManage/getUserInfo.do',
    method: 'post'
  },
  saveUserInfo: {
    url: '/ouser-web/userManage/saveUserInfo.do',
    method: 'post'
  },
  modifyPasswordOnline: {
    url: '/ouser-web/mobileRegister/modifyPasswordOnline.do',
    method: 'post'
  },
  modifyEmployeePasswordOnline: {
    url: '/ouser-web/employee/modifyPasswordOnline.do',
    method: 'post'
  },
  saveEmail: {
    url: '/ouser-web/userManage/saveEmail.do',
    method: 'post'
  },
  sendMobileCaptchas: {
    url: '/ouser-web/userManage/sendMobileCaptchas.do',
    method: 'post'
  },
  saveMobile: {
    url: '/ouser-web/userManage/saveMobile.do',
    method: 'post'
  },
  listByCategorys: {
    url: '/ouser-web/public/config/listMulti',
    method: 'post'
  },
  listCodeByCategorys: {
    url: '/ouser-web/public/config/listMultiCode',
    method: 'post'
  },
  getUserPosition: {
    url: '/ouser-web/api/employee/getUserPosition.do',
    method: 'post'
  }

}
