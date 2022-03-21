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
  queryStoreInfoList: { // 店铺查询
    url: '/ouser-web/storeAction/queryStoreInfoList.do',
    method: 'post'
  },
  getUserConsumeInfo: { // 查询会员交易信息
    url: '/search/guideUser/getUserConsumeInfo.do',
    method: 'get'
  },
  getUserLabels: { // 获取会员标签
    url: '/obi-web/group/getUserLabels.do',
    method: 'post'
  },
  getUserPreference: { // 查询会员偏好信息
    url: '/search/guideUser/getUserPreference.do',
    method: 'post'
  },
  queryCouponTypePG: { // 查询用户优惠劵
    url: '/back-promotion-web/couponRead/queryCouponTypePG.do',
    method: 'post'
  },
  queryPersonalCouponCount: { // 查询用户可用优惠劵张数
    url: '/back-promotion-web/couponRead/queryPersonalCouponCount.do',
    method: 'post'
  },
  listUcLabelInfo: { // 获取标签列表
    url: '/ouser-web/ucLabelController/listUcLabelInfo.do',
    method: 'post'
  },
  listUcUserLabel: { // 获取用户标签列表
    url: '/ouser-web/ucUserLabelAction/listUcUserLabel.do',
    method: 'post'
  },
  deleteUcUserLabelById: { // 删除用户标签关系数据
    url: '/ouser-web/ucUserLabelAction/deleteUcUserLabelById.do',
    method: 'post'
  },
  updateUcUserLabel: { // 删除用户标签关系数据
    url: '/ouser-web/ucUserLabelAction/updateUcUserLabel.do',
    method: 'post'
  },
  listMulti: { // 字典查询
    url: '/ouser-web/code/listMulti',
    method: 'post'
  },
  configListMulti: { // 字典查询
    url: '/ouser-web/public/config/listMulti',
    method: 'post'
  },
  queryDistributionByPageInfo: { // 供应商查询
    url: '/ouser-web/registerMerchant/queryDistributionByPageInfo.do',
    method: 'post'
  },
  revokeUnion: {
    url: '/ouser-web/api/union/revokeUnion.do',
    method: 'post'
  },
  queryArtificialImportLabelList: { // 查询手工标签
    url: '/obi-web/labelFactory/queryArtificialImportLabelList.do',
    method: 'post'
  },
  operationMemberLabelRelation: { // 绑定手工标签
    url: '/obi-web/labelFactory/operationMemberLabelRelation.do',
    method: 'post'
  },
  listUserLabel: { // 用户标签列表 包含：系统、组合、手工
    url: '/search/userProfile/listUserLabel.do',
    method: 'post'
  },
  deletedMemberLabel: { // 删除标签
    url: '/obi-web/labelFactory/deletedMemberLabel.do',
    method: 'post'
  },
  listSoPage: {
    url: 'oms-web/so/listSoPage',
    method: 'post'
  }
}
