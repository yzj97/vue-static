/* timeoutAlertRule */
export default {
  /* 超时预警设置 */
  timeoutAlertRuleAdd: {
    url: 'oms-web/timeoutAlertRule/add',
    method: 'post'
  },
  timeoutAlertRuleListPage: {
    url: 'oms-web/timeoutAlertRule/listPage',
    method: 'post'
  },
  timeoutAlertRuleGet: {
    url: 'oms-web/timeoutAlertRule/get',
    method: 'post'
  },
  timeoutAlertRuleUpdate: {
    url: 'oms-web/timeoutAlertRule/update',
    method: 'post'
  },
  timeoutAlertRuleBatchDsiable: {
    url: 'oms-web/timeoutAlertRule/batchDisable',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  timeoutAlertRuleDelete: {
    url: 'oms-web/timeoutAlertRule/delete',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }
}
