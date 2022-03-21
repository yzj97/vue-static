/* soSplitRule */
export default {
  /* 订单拆单规则 */
  soSplitRuleAdd: {
    url: 'oms-web/soSplitRule/add',
    method: 'post'
  },
  soSplitRuleListPage: {
    url: 'oms-web/soSplitRule/listPage',
    method: 'post'
  },
  soSplitRuleGet: {
    url: 'oms-web/soSplitRule/get',
    method: 'post'
  },
  soSplitRuleUpdate: {
    url: 'oms-web/soSplitRule/update',
    method: 'post'
  },
  soSplitRuleBatchDsiable: {
    url: 'oms-web/soSplitRule/batchDisable',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  soSplitRuleDelete: {
    url: 'oms-web/soSplitRule/delete',
    method: 'post'
  },
  soSplitRuleCreateCode: {
    url: 'oms-web/soSplitRule/createCode',
    method: 'get'
  }
}
