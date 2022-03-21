
export default {
  path: '/wechat-guide',
  name: 'wechat',
  meta: {
    title: '微信导购',
    icon: 'table'
  },
  children: [
    {
      path: 'guideDevice',
      component: () => import('@/views/guideDevice'),
      name: 'GuideDevice',
      meta: { title: '导购设备管理' }
    },
    {
      path: 'guideDeviceRel',
      component: () => import('@/views/guideDeviceRel'),
      name: 'CrmGuideDeviceRel',
      meta: { title: '导购设备权限设置' }
    },
    {
      path: 'guideDeviceRel/add/index',
      component: () => import('@/views/guideDeviceRel/add/index'),
      name: 'CrmGuideDeviceRelAdd',
      meta: { title: '导购设备权限设置新增' },
      hidden: true
    },
    {
      path: 'createGroup/index:userId?',
      component: () => import('@/views/createGroup/index'),
      name: 'CrmCreateGroup',
      meta: { title: '新建群组' },
      hidden: true
    },
    {
      path: 'guide-task-user',
      component: () => import('@/views/guide-task-user'),
      name: 'CrmGuideTaskUser',
      meta: { title: '任务列表' }
    },
    {
      path: 'guide-task-user/add',
      component: () => import('@/views/guide-task-user/add'),
      name: 'CrmGuideTaskUserAdd',
      hidden: true,
      meta: { title: '新建任务' }
    },
    {
      path: 'privateFlowMgt',
      name: 'PrivateFlowMgt',
      meta: { title: '私域流量管理' },
      component: () => import('@/views/privateFlowMgt'),
      children: [
        {
          path: 'group-send-message',
          name: 'GroupSendMessage',
          meta: { title: '群发消息' },
          component: () => import('@/views/privateFlowMgt/group-send-message')
        },
        {
          path: 'chat-group-manage',
          name: 'ChatGroupManage',
          meta: { title: '微信群管理' },
          component: () => import('@/views/privateFlowMgt/chat-group-manage')
        },
        {
          path: 'guideTalkSkill',
          name: 'GuideTalkSkill',
          meta: { title: '系统话术管理' },
          component: () => import('@/views/privateFlowMgt/guideTalkSkill')
        },
        {
          path: 'guideTalkSkillAdd',
          name: 'GuideTalkSkillAdd',
          hidden: true,
          meta: { title: '系统话术新增' },
          component: () => import('@/views/privateFlowMgt/guideTalkSkill/detail')
        },
        {
          path: 'guideTalkSkillEdit',
          name: 'GuideTalkSkillEdit',
          hidden: true,
          meta: { title: '系统话术编辑' },
          component: () => import('@/views/privateFlowMgt/guideTalkSkill/detail')
        }
      ]
    },
    {
      path: 'test-gift-card/list',
      component: () => import('@/views/test-gift-card/list'),
      name: 'CrmTestGiftCardList',
      meta: {
        title: 'test-gift-card'
      }
    },
    {
      path: 'test-gift-card/create',
      component: () => import('@/views/test-gift-card/create'),
      name: 'CrmTestGiftCardCreate',
      meta: {
        title: 'test-gift-card新建'
      },
      hidden: true
    },
    {
      path: 'test-gift-card/edit/:id',
      component: () => import('@/views/test-gift-card/edit'),
      name: 'CrmTestGiftCardEdit',
      meta: {
        title: 'test-gift-card编辑'
      },
      hidden: true
    },
    {
      path: 'test-gift-card/detail/:id',
      component: () => import('@/views/test-gift-card/detail'),
      name: 'CrmTestGiftCardDetail',
      meta: {
        title: 'test-gift-card详情'
      },
      hidden: true
    }
  ]
}
