export default {
  queryRuleList: { // 查询规则列表
    url: 'ouser-web/growthRule/list.do',
    method: 'post'
  },
  updateRuleStatus: { // 修改规则状态
    url: 'ouser-web/growthRule/update.do',
    method: 'post'
  },
  queryChannelMap: { // 修改规则状态
    url: 'ouser-web/api/channel/queryChannelMap.do',
    method: 'get'
  },
  growthRuleAdd: { // 成长值新增
    url: 'ouser-web/growthRule/add.do',
    method: 'post'
  },
  growthRuleEnable: { // 启用规则
    url: 'ouser-web/growthRule/enable.do',
    method: 'post'
  },
  growthRuleUpdate: { // 修改规则
    url: 'ouser-web/growthRule/update.do',
    method: 'post'
  },
  growthRuleInfo: { // 修改规则
    url: 'ouser-web/growthRule/info.do',
    method: 'post'
  }
}
