
export default {
  path: '/crm',
  name: 'CrmWeb',
  meta: {
    title: 'CRM',
    icon: 'table'
  },
  children: [
    {
      path: 'task/list',
      component: () => import('@/views/task/list'),
      name: 'CrmTaskList',
      meta: { title: '任务管理' }
    },
    {
      path: 'task/edit-flow/:id',
      component: () => import('@/views/task/edit-flow'),
      name: 'CrmTaskEditFlow',
      meta: { title: '创建任务流' }
    },
    {
      path: 'rightsInterests/rightsInterests',
      component: () => import('@/views/rightsInterests/rightsInterests'),
      name: 'CrmRightsInterests',
      meta: { title: '权益管理' }
    },
    {
      path: 'rightsInterests/interestsDetail/interestsDetail/:id,:isEdit',
      component: () => import('@/views/rightsInterests/interestsDetail/interestsDetail'),
      name: 'CrmRightsInterestsDetial',
      meta: { title: '权益管理详情' },
      hidden: true
    },
    {
      path: 'rightsInterests/interestsDetail/interestsDetailAdd/:isAdd',
      component: () => import('@/views/rightsInterests/interestsDetail/interestsDetail'),
      name: 'CrmRightsInterestsDetialAdd',
      meta: { title: '权益管理新增' },
      hidden: true
    },
    {
      path: 'membershipLevel/membershipLevel',
      component: () => import('@/views/membershipLevel/membershipLevel'),
      name: 'CrmMembershipLevel',
      meta: { title: '会员等级管理' }
    },
    {
      path: 'membershipLeve/membershipLevelDetail/membershipLevelDetail:id,:isEdit',
      component: () => import('@/views/membershipLevel/membershipLevelDetail/membershipLevelDetail'),
      name: 'CrmMembershipLevelDetail',
      meta: { title: '会员等级管理详情' },
      hidden: true
    },
    {
      path: 'interestsCard/interestsCard',
      component: () => import('@/views/interestsCard/interestsCard'),
      name: 'CrmInterestsCard',
      meta: { title: '权益卡管理' }
    },
    {
      path: 'interestsCard/interestsCardDetail/interestsCardDetail:id,:isEdit',
      component: () => import('@/views/interestsCard/interestsCardDetail/interestsCardDetail'),
      name: 'CrmInterestsCardDetail',
      meta: { title: '权益卡管理详情' },
      hidden: true
    },
    {
      path: 'userInterestsCard/userInterestsCard',
      component: () => import('@/views/userInterestsCard/userInterestsCard'),
      name: 'CrmUserInterestsCard',
      meta: { title: '领卡日志' }
    },
    {
      path: 'userClassify/userClassify',
      component: () => import('@/views/userClassify/userClassify'),
      name: 'CrmUserClassify',
      meta: { title: '分组分类管理' }
    },
    {
      path: 'userGroup/userGroup',
      component: () => import('@/views/userGroup/userGroup'),
      name: 'CrmUserGroup',
      meta: { title: '分组管理' }
    },
    {
      path: 'userGroup/userList',
      component: () => import('@/views/userGroup/userList'),
      name: 'CrmUserList',
      meta: { title: '查看会员分组' },
      hidden: true
    },
    {
      path: 'card/cardList',
      component: () => import('@/views/card/cardList'),
      name: 'CrmGiftCard',
      meta: { title: '卡管理', parentTitle: '商品中心' }
    },
    {
      path: 'card/listReceiveCardLog',
      component: () => import('@/views/card/receiveGiftCardLog'),
      name: 'GiftCardReceivLog',
      meta: { title: '卡转赠记录', parentTitle: '商品中心' },
      hidden: true
    },
    {
      path: 'card/artificial-send-card',
      component: () => import('@/views/card/artificial-send-card'),
      name: 'CrmArtificialSendCard',
      meta: { title: '人工发卡', parentTitle: '商品中心' },
      hidden: true
    },
    {
      path: 'card/cardMake',
      component: () => import('@/views/card/cardMake'),
      name: 'CrmGiftCardMake',
      meta: { title: '制作实体卡', parentTitle: '商品中心' },
      hidden: true
    },
    {
      path: 'card/cardMakeList',
      component: () => import('@/views/card/cardMake/list'),
      name: 'CrmGiftCardMakeList',
      meta: { title: '制卡清单', parentTitle: '商品中心' }
    },
    {
      path: 'card/cardMakeDetail',
      component: () => import('@/views/card/cardMake/detail'),
      name: 'CrmGiftCardMakeDetail',
      meta: { title: '制卡详情', parentTitle: '商品中心' },
      hidden: true
    },
    {
      path: 'card/basicConfig',
      component: () => import('@/views/card/basicConfig'),
      name: 'GiftCardBasicConfig',
      meta: { title: '卡基础设置', parentTitle: '系统设置' }
    },
    {
      path: 'memberManagement',
      component: () => import('@/views/member/index'),
      name: 'OuserCenterMemberManagement',
      meta: { title: '会员管理' },
      children: [
        {
          path: 'memberType',
          component: () => import('@/views/member/type'),
          name: 'OuserCenterMemberType',
          meta: { title: '会员类型', parentTitle: '会员中心' }
        },
        {
          path: 'memberList',
          component: () => import('@/views/member/list/merchant'),
          name: 'OuserCenterMemberList',
          meta: { title: '会员列表', parentTitle: '会员中心' }
        },
        {
          path: 'memberListStore',
          component: () => import('@/views/member/list/store'),
          name: 'OuserCenterMemberListStore',
          meta: { title: '门店会员列表', parentTitle: '会员中心' }
        },
        {
          path: 'memberDetail',
          // webpack 生成的文件oFL/.aaaa.js nginx不支持，所以自定义chunkName
          component: () => import(/* webpackChunkName: "member-detail" */ '@/views/member/list/detail'),
          name: 'OuserCenterMemberDetail',
          meta: { title: '会员详情', parentTitle: '会员中心' },
          hidden: true
        },
        {
          path: 'memberDetailStore',
          component: () => import('@/views/member/list/detail/store'),
          name: 'OuserCenterMemberDetailStore',
          meta: { title: '会员详情', parentTitle: '会员中心' },
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
      path: 'balanceFlowDetail/:entityId',
      component: () => import('@/views/balanceFlowList/detail'),
      name: 'OuserCenterBalanceFlowDetail',
      meta: { title: '成长值流水详情' },
      hidden: true
    },
    {
      path: 'growthValueOperation',
      component: () => import('@/views/growthValueOperation'),
      name: 'OuserCenterGrowthValueOperation',
      meta: { title: '成长值操作' },
      hidden: true
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
      path: 'pointsManagement/pointsFlow/detail/:entityId',
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
    }
  ]
}
