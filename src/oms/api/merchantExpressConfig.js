/* merchantExpressConfig */
export default {
  /* 配送公司设置 */
  merchantExpressConfigAdd: {
    url: 'oms-web/merchantExpressConfig/add',
    method: 'post'
  },
  merchantExpressConfigDelete: {
    url: 'oms-web/merchantExpressConfig/delete',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  merchantExpressConfigGet: {
    url: 'oms-web/merchantExpressConfig/get',
    method: 'post'
  },
  merchantExpressConfigListPage: {
    url: 'oms-web/merchantExpressConfig/listPage',
    method: 'post'
  },
  merchantExpressConfigUpdate: {
    url: 'oms-web/merchantExpressConfig/update',
    method: 'post'
  },
  merchantExpressConfigListForSelect: {
    url: 'oms-web/merchantExpressConfig/list',
    method: 'post'
  }
}
