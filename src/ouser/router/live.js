export default [
  {
    path: 'live/list',
    component: () => import('@/views/live/list'),
    name: 'live',
    meta: {
      title: '直播Demo'
    }
  },
  {
    path: 'live/add',
    name: 'LiveAdd',
    component: () => import('@/views/live/detail'),
    meta: {
      title: '直播测试新建'
    },
    hidden: true
  },
  {
    path: 'live/edit/:id',
    name: 'LiveEdit',
    component: () => import('@/views/live/detail'),
    meta: {
      title: '直播测试编辑'
    },
    hidden: true
  },
  {
    path: 'live/detail/:id',
    name: 'LiveDetail',
    component: () => import('@/views/live/detail'),
    meta: {
      title: '直播测试详情'
    },
    hidden: true
  }
]
