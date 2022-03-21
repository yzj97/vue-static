/* soReturnConfig */
export default {
  /* 售后有效期设置 */
  soReturnConfigAdd: {
    url: 'oms-web/soReturnConfig/add',
    method: 'post'
  },
  soReturnConfigDelete: {
    url: 'oms-web/soReturnConfig/delete',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  soReturnConfigListPage: {
    url: 'oms-web/soReturnConfig/listPage',
    method: 'post'
  },
  soReturnConfigUpdate: {
    url: 'oms-web/soReturnConfig/update',
    method: 'post'
  }
}
