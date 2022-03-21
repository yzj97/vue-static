
export default {
  path: '/osc-web',
  redirect: '/osc-web/approvalManage',
  name: 'OscWeb',
  meta: {
    title: '系统设置',
    icon: 'table'
  },
  children: [
    {
      path: 'messageWarn',
      component: () => import('@/views/messageWarn'),
      name: 'OscMessageWaren',
      meta: { title: '消息事件' }
    },
    {
      path: 'template',
      component: () => import('@/views/messageWarn/template'),
      name: 'OscTemplate',
      meta: { title: '微信模板列表' }
    }
  ]
}
