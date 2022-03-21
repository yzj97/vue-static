/* soApproveRule */
export default {
  soApproveRuleAdd: {
    url: 'oms-web/soApproveRule/add',
    method: 'post'
  },
  soApproveRuleListPage: {
    url: 'oms-web/soApproveRule/listPage',
    method: 'post'
  },
  soApproveRuleGet: {
    url: 'oms-web/soApproveRule/get',
    method: 'post'
  },
  soApproveRuleUpdate: {
    url: 'oms-web/soApproveRule/update',
    method: 'post'
  },
  soApproveRuleBatchDsiable: {
    url: 'oms-web/soApproveRule/batchDisable',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  soApproveRuleDelete: {
    url: 'oms-web/soApproveRule/delete',
    method: 'post'
  }
}
