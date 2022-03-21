export default {
  addOrUpdateCommissionParams: {
    url: 'agent-web/commissionParam/addOrUpdateCommissionParams.do',
    method: 'post'
  },
  validateDimensionWeakly: {
    url: 'agent-web/commissionParam/validateDimensionWeakly.do',
    method: 'post'
  },
  getCommissionRule: {
    url: 'agent-web/commissionParam/getCommissionRule.do',
    method: 'post'
  },
  queryCommissionPage: {
    url: 'agent-web/commission/listPage.do',
    method: 'post'
  },
  updateCommission: {
    url: 'agent-web/commission/updateInfo.do',
    method: 'post'
  },
  getCommissionInfo: {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    url: 'agent-web/commission/info.do',
    method: 'post'
  },
  addCommissionInfo: {
    url: 'agent-web/commission/add.do',
    method: 'post'
  },
  getCommissionAccount: {
    url: '/ouser-web/userAccount/getCommissionAccount.do',
    method: 'post'
  }

}
