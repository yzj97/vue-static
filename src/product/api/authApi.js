const baseUrl = 'back-product-web/back/user'

export default {
  // 获取用户有权限的仓库列表
  listAuthWarehouse: {
    url: baseUrl + '/auth/listAuthWarehouse.do',
    method: 'post'
  }
}
