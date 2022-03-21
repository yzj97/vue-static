/* thirdData */
export default {
  userList: {
    url: 'oms-web/thirdData/userList',
    method: 'post'
  },
  /* 查询虚拟库存 */
  merchantProductVirtualStore: {
    url: 'oms-web/thirdData/merchantProductVirtualStore',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  /* 获取合同、账期 */
  getContract: {
    url: 'oms-web/thirdData/queryContractByParam',
    method: 'post'
  },
  /* 获取用户默认收货地址 */
  queryDefaultAddress: {
    url: 'oms-web/thirdData/queryDefaultAddress',
    method: 'post'
  },
  /* 获取用户收货地址列表 */
  queryAddressList: {
    url: 'oms-web/thirdData/queryAddressList',
    method: 'post'
  }
}
