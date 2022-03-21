export default {
  path: '/ouser-center',
  redirect: '/ouser-center/memberList',
  name: 'OuserCenter',
  meta: {
    title: '会员中心',
    icon: 'table'
  },
  children: [
    {
      path: 'memberManagement',
      component: () => import('@/views/member/index'),
      name: 'OuserCenterMemberManagement',
      meta: { title: '会员管理' },
      children: [
        {
          path: 'memberGrade',
          component: () => import('@/views/member/grade'),
          name: 'OuserCenterMemberGrade',
          meta: { title: '会员等级' }
        },
        {
          path: 'memberType',
          component: () => import('@/views/member/type'),
          name: 'OuserCenterMemberType',
          meta: { title: '会员类型' }
        },
        {
          path: 'memberList',
          component: () => import('@/views/member/list'),
          name: 'OuserCenterMemberList',
          meta: { title: '会员列表' }
        },
        {
          path: 'memberDetail',
          component: () => import('@/views/member/list/detail'),
          name: 'OuserCenterMemberDetail',
          meta: { title: '会员详情' },
          hidden: true
        }
      ]
    },
    {
      path: 'basicConfigManagement',
      component: () => import('@/views/basicConfig/index'),
      name: 'OuserCenterBasicConfigManagement',
      meta: { title: '基础设置' },
      children: [
        {
          path: 'ruleConfig',
          component: () => import('@/views/basicConfig/ruleConfig'),
          name: 'OuserCenterRuleConfig',
          meta: { title: '基础设置' }
        }
      ]
    },
    {
      path: 'growthValueList',
      component: () => import('@/views/growthValueList'),
      name: 'OuserCenterGrowthValueList',
      meta: { title: '成长值规则' }
    },
    {
      path: 'balanceFlowList',
      component: () => import('@/views/balanceFlowList'),
      name: 'OuserCenterBalanceFlowList',
      meta: { title: '成长值流水' }
    },
    {
      path: 'balanceFlowDetail',
      component: () => import('@/views/balanceFlowList/detail'),
      name: 'OuserCenterBalanceFlowDetail',
      meta: { title: '成长值流水详情' },
      hidden: true
    },
    {
      path: 'growthValueOperation',
      component: () => import('@/views/growthValueOperation'),
      name: 'OuserCenterGrowthValueOperation',
      meta: { title: '成长值操作' }
    },
    {
      path: 'pointsManagement/pointsRule',
      component: () => import('@/views/pointsManagement/pointsRule'),
      name: 'OuserCenterPointsManagement',
      meta: { title: '积分规则列表' }
    },
    {
      path: 'pointsManagement/editPointsRule',
      component: () => import('@/components/pointsManagement/ruleSteps'),
      name: 'OuserCenterPointsRuleDetail',
      meta: { title: '积分规则详情' },
      hidden: true
    },
    {
      path: 'pointsManagement/pointsFlow',
      component: () => import('@/views/pointsManagement/pointsFlow'),
      name: 'OuserCenterPointsFlow',
      meta: { title: '积分流水' }
    },
    {
      path: 'pointsManagement/pointsFlow/detail',
      component: () => import('@/views/pointsManagement/pointsFlow/detail'),
      name: 'OuserCenterPointsFlowDetail',
      meta: { title: '积分流水详情' },
      hidden: true
    },
    {
      path: 'pointsManagement/manualOperationList',
      component: () => import('@/views/pointsManagement/manualOperationList'),
      name: 'OuserCenterManualOperationList',
      meta: { title: '积分人工作业' }
    },
    {
      path: 'balenceManualOperationList',
      component: () => import('@/views/balenceManualOperationList'),
      name: 'OuserCenterBalenceManualOperatio',
      meta: { title: '成长值人工作业' }
    },
    {
      path: 'labelGroupManagerment',
      component: () => import('@/views/labelGroupManagerment'),
      name: 'OuserCenterLabelGroupManagerment',
      meta: { title: '标签管理' },
      children: [
        {
          path: 'labelGroupList',
          component: () => import('@/views/labelGroupList'),
          name: 'OuserCenterLabelGroupList',
          meta: { title: '标签分组' }
        },
        {
          path: 'addOrEditLabelGroup/:id',
          component: () => import('@/views/labelGroupList/detail'),
          name: 'OuserCenterAddOrEditLabelGroup',
          hidden: true,
          meta: { title: '标签分组详情',
            nocache: true }
        }
      ]
    }
  ]
}
