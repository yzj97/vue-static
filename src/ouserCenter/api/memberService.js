export default {
  queryMemberType: { // 查询会员类型
    url: 'ouser-web/memberType/queryMemberTypeAndMemberShipLevel.do',
    method: 'post'
  },
  queryMemberInfoList: { // 查询会员列表
    url: 'ouser-web/member/queryMemberList.do',
    method: 'post'
  },
  updateStatus: { // 修改状态
    url: 'ouser-web/userInfoAction/updateUserStatus.do',
    method: 'post'
  },
  saveMemberInfo: { // 新增会员
    url: 'ouser-web/user/addOneUser.do',
    method: 'post'
  },
  updateGuideByUserId: { // 会员换绑
    url: 'ouser-web/employeeCustomer/updateGuideByUserIdWithTx.do',
    method: 'post'
  },
  queryUserCountByGuideUserId: { // 根据id查询导购员
    url: 'ouser-web/employeeCustomer/queryUserCountByGuideUserId.do',
    method: 'post'
  },
  checkNewGuideStatus: { // 判断新导购员状态
    url: 'ouser-web/employeeCustomer/checkNewGuideStatus.do',
    method: 'post'
  },
  updateGuideByGuideUserIdWithTx: { // 导购员换绑
    url: 'ouser-web/employeeCustomer/updateGuideByGuideUserIdWithTx.do',
    method: 'post'
  },
  finduUnionLogin: { // 查询会员账户信息
    url: 'ouser-web/userInfoAction/getAccountInfoById.do',
    method: 'post'
  },
  getUserBaseInfoById: { // 查询会员基本信息
    url: 'ouser-web/userInfoAction/getUserBaseInfoById.do',
    method: 'post'
  },
  updateUserInfo: { // 修改会员信息
    url: 'ouser-web/userInfoAction/updateUserInfo.do',
    method: 'post'
  },
  queryPointDetail: { // 查询会员积分
    url: 'ouser-web/pointsAcctAction/queryPointDetail.do',
    method: 'post'
  },
  findDeviceAll: {
    url: 'ouser-web/DeviceAction/FindDeviceAll.do',
    method: 'post'
  },
  findDevicePage: {
    url: 'ouser-web/DeviceAction/findDevicePage.do',
    method: 'post'
  },
  queryMemberGradeList: {
    url: 'ouser-web/memberGrade/queryMemberGradeList.do',
    method: 'post'
  },
  queryMemberTypeList: {
    url: 'ouser-web/memberType/queryMemberTypeList.do',
    method: 'post'
  },
  updateMemberShipInfo: {
    url: 'ouser-web/memberInfoRead/updateMemberShipInfo.do',
    method: 'post'
  },
  addMemberShipInfo: {
    url: 'ouser-web/memberInfoRead/addMemberShipInfo.do',
    method: 'post'
  },
  modifyMemberType: {
    url: 'ouser-web/memberInfoRead/modifyMemberType.do',
    method: 'post'
  },
  addMemberType: {
    url: 'ouser-web/memberInfoRead/addMemberType.do',
    method: 'post'
  },
  registerForce: {
    url: 'ouser-web/mobileRegister/registerForce.do',
    method: 'post'
  },
  queryUserGuideInfoList: {
    url: 'ouser-web/employeeCustomer/queryUserGuideInfoList.do',
    method: 'post'
  },
  memberAsyncImport: {
    url: 'ouser-web/member/asyncImport.do',
    method: 'post'
  },
  memberAsyncExport: {
    url: 'ouser-web/member/asyncExport.do',
    method: 'post'
  },
  downloadTask: {
    url: 'ouser-web/asyncexport/getAsyncEventList.do',
    method: 'get'
  }
}
