// 会员中心积分管理相关service
export default {
  queryPointsRuleList: { // 查询积分规则列表
    url: 'ouser-web/pointsRuleAction/queryPointsRuleList.do',
    method: 'post'
  },
  queryMemberType: { // 查询会员类型列表
    url: 'ouser-web/memberInfoRead/queryMemberType.do',
    method: 'post'
  },
  listByCategorys: {
    url: 'ouser-web/public/config/listMulti.do',
    method: 'post'
  },
  queryPointsFlowAll: { // 查询积分流水
    url: 'ouser-web/pointsAcctAction/getUserPointList.do',
    method: 'post'
  },
  queryUserPointsFlowAll: { // 查询积分流水详情
    url: 'ouser-web/pointsAcctAction/getUserAccountFlow.do',
    method: 'post'
  },
  queryChannelMap: { // 查询渠道
    url: 'ouser-web/api/channel/queryChannelMap.do',
    method: 'get'
  },
  queryPointsRuleDetail: { // 查询积分规则详情
    url: 'ouser-web/pointsRuleAction/queryPointsRuleDetail.do',
    method: 'post'
  },
  addNewRule: { // 新增规则
    url: 'ouser-web/pointsRuleNewAction/addNewRule.do',
    method: 'post'
  },
  savePointsRule: { // 新增积分规则
    url: 'ouser-web/pointsRuleAction/savePointsRule.do',
    method: 'post'
  },
  queryCfgRule: { // 会员消费积分规则查询
    url: 'ouser-web/pointsRuleNewAction/queryCfgRule.do',
    method: 'post'
  },
  updatePointsRuleStatus: { // 更新启用状态
    url: 'ouser-web/pointsRuleAction/updatePointsRuleStatus.do',
    method: 'post'
  },
  queryRoleByType: { // 查询积分规则类型
    url: 'ouser-web/pointsRuleAction/queryRoleByType.do',
    method: 'post'
  },
  queryPointsRuleLog: { // 查询积分规则日志
    url: 'ouser-web/public/log/listOperActionPage.do',
    method: 'post'
  },
  getManualOperationPage: { // 积分人工作业
    url: 'ouser-web/manualOperationAction/getManualOperationPage.do',
    method: 'post'
  },
  searchUserIdentityInfoList: { // 用户查询
    url: '/ouser-web/user/searchUserIdentityInfoList.do',
    method: 'post'
  },
  addManualOperation: { // 添加积分人工作业
    url: '/ouser-web/manualOperationAction/addManualOperation.do',
    method: 'post'
  },
  queryManualOperationAll: { // 成长值人工作业
    url: '/ouser-web/balence/queryManualOperationAll.do',
    method: 'post'
  },
  balenceAddManualOperation: { // 添加成长值人工作业
    url: '/ouser-web/balence/addManualOperation.do',
    method: 'post'
  },
  getAccount: {
    url: '/ouser-web/point/getAccount.do',
    method: 'post'
  }
}
