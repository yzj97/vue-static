export default {
  listPage: {
    'url': '/pms-web/receiveRecord/listPage.do',
    'method': 'post'
  },
  // 查询当前登录用户有权限的仓库列表
  queryPlatformAuthWarehousePage: {
    url: '/ouser-web/api/warehouse/queryPlatformAuthWarehousePage.do',
    method: 'post'
  },
  getById: {
    'url': '/pms-web/receiveRecord/getById.do',
    'method': 'get'
  }
}
