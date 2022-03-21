/* autoConfirmRule */
export default {
  /* 自动接单 */
  autoConfirmRuleList: {
    url: 'oms-web/autoConfirmRule/listPage',
    method: 'post'
  },
  autoConfirmRuleDelete: {
    url: 'oms-web/autoConfirmRule/delete',
    method: 'post'
  },
  autoConfirmRuleCreateCode: {
    url: 'oms-web/autoConfirmRule/createCode',
    method: 'get'
  },
  autoConfirmRuleAdd: {
    url: 'oms-web/autoConfirmRule/add',
    method: 'post'
  },
  autoConfirmRuleUpdate: {
    url: 'oms-web/autoConfirmRule/update',
    method: 'post'
  },
  autoConfirmRuleGet: {
    url: 'oms-web/autoConfirmRule/get',
    method: 'post'
  },
  autoConfirmRuleBatchDisable: {
    url: 'oms-web/autoConfirmRule/batchDisable',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }
}
