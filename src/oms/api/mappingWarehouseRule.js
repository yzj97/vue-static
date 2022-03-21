/* mappingWarehouseRule */
export default {
  routingWarehouseRuleAdd: {
    url: 'oms-web/mappingWarehouseRule/add',
    method: 'post'
  },
  routingWarehouseRuleListPage: {
    url: 'oms-web/mappingWarehouseRule/listPage',
    method: 'post'
  },
  routingWarehouseRuleGet: {
    url: 'oms-web/mappingWarehouseRule/get',
    method: 'post'
  },
  routingWarehouseRuleUpdate: {
    url: 'oms-web/mappingWarehouseRule/update',
    method: 'post'
  },
  routingWarehouseRuleBatchDisable: {
    url: 'oms-web/mappingWarehouseRule/batchDisable',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  routingWarehouseRuleDelete: {
    url: 'oms-web/mappingWarehouseRule/delete',
    method: 'post'
  },
  routingWarehouseRuleCreateCode: {
    url: 'oms-web/mappingWarehouseRule/createCode',
    method: 'get'
  }
}
