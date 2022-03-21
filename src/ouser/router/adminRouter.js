export default [
  {
    path: 'function',
    component: () => import('@/views/function'),
    name: 'Ouser-Function',
    meta: { title: 'function权限' }
  },
  {
    path: 'urls',
    component: () => import('@/views/urls'),
    name: 'OuserUrls',
    meta: { title: '内部地址跳转' }
  },
  {
    path: '/iframe?url=%2Fopay-web%2Fmanage%2Findex.html%23%2FpaymentChannelManageList',
    meta: { title: '支付网关' }
  },
  {
    path: 'online-table-dev/list',
    component: () => import('@/views/online-table-dev/list'),
    name: 'OuserOnlineTableDev',
    meta: { title: 'Online表单开发' }
  },
  {
    path: 'online-table-dev/help',
    component: () => import('@/views/online-table-dev/help'),
    name: 'OuserOnlineTableHelp',
    hidden: true,
    meta: { title: 'Online表单帮助' }
  },
  {
    path: 'mongo-log',
    component: () => import('@/views/mongoLog'),
    name: 'OuserMongoLog',
    meta: { title: '操作日志' }
  }
]
