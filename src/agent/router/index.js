export default {
  path: '/agent',
  name: 'Agent',
  meta: {
    title: '分销中心',
    icon: 'table'
  },
  children: [
    {
      path: 'agentList',
      component: () => import('@/views/agentList'),
      name: 'AgentList',
      meta: { title: '分销员管理' }
    },
    {
      path: 'agentList/details/:userId',
      component: () => import('@/views/agentList/details'),
      name: 'AgentDetails',
      hidden: true,
      meta: { title: '分销员详情' }
    },
    {
      path: 'agentAuditList',
      component: () => import('@/views/agentAudit/list'),
      name: 'AgentAuditList',
      meta: { title: '分销员申请列表' }
    },
    {
      path: 'ruleConfig',
      component: () => import('@/views/ruleConfig'),
      name: 'AgentRuleConfig',
      meta: { title: '分销规则配置' }
    },
    {
      path: 'distributionProduct',
      name: 'DistributionProduct',
      component: () => import('@/views/distributionProduct'),
      meta: { title: '分销商品管理' }
    }
  ]
}
