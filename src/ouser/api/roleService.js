export default {
  queryRoleToOperate: {
    url: '/ouser-web/user/queryRoleToOperate.do',
    method: 'post'
  },
  getAllUserFunctionByRoleIds: {
    url: '/ouser-web/function/getAllUserFunctionByRoleIds.do',
    method: 'post'
  },
  batchUpdateUserRole: {
    url: '/ouser-web/userRole/batchUpdateUserRole.do',
    method: 'post'
  },
  getRoleById: {
    url: '/ouser-web/role/getRoleById.do',
    method: 'post'
  },
  getAllRoleFunctionByPlatformAndRoleId: {
    url: '/ouser-web/function/getAllRoleFunctionByPlatformAndRoleId.do',
    method: 'post'
  },
  updateRoleAndFunction: {
    url: '/ouser-web/role/updateRoleAndFunction.do',
    method: 'post'
  },
  saveRole: {
    url: '/ouser-web/role/saveRole.do',
    method: 'post'
  },
  queryAllRoleDataPage: {
    url: '/ouser-web/role/queryAllRoleDataPage.do',
    method: 'post'
  },
  deleteRole: {
    url: '/ouser-web/role/deleteRole.do',
    method: 'post'
  }

}
