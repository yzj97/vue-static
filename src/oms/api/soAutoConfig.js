/* soAutoConfig */
export default {
  /* 订单自动配置 */
  soAutoConfigListPage: {
    url: 'oms-web/soAutoConfig/listPage',
    method: 'post'
  },
  soAutoConfigAdd: {
    url: 'oms-web/soAutoConfig/add',
    method: 'post'
  },
  soAutoConfigUpdate: {
    url: 'oms-web/soAutoConfig/update',
    method: 'post'
  },
  soAutoConfigDelete: {
    url: 'oms-web/soAutoConfig/delete',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }
}
