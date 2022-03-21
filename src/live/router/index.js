export default {
  path: '/live',
  name: 'Live',
  meta: {
    title: 'LIVE'
  },
  children: [
    {
      path: 'live-list',
      component: () => import('@/views/live-list'),
      name: 'LiveList',
      meta: { title: '直播列表' }
    },
    {
      path: 'live-list/add',
      name: 'LiveListAdd',
      component: () => import('@/views/live-list/add'),
      meta: { title: '新建直播' },
      hidden: true
    },
    {
      path: 'live-list/edit',
      name: 'LiveListEdit',
      component: () => import('@/views/live-list/edit'),
      meta: { title: '编辑直播' },
      hidden: true
    },
    {
      path: 'live-list/detail',
      name: 'LiveListDetail',
      component: () => import('@/views/live-list/detail'),
      meta: { title: '直播详情' },
      hidden: true
    },
    {
      path: 'liveReport/list',
      component: () => import('@/views/liveReport/list'),
      name: 'LiveReportList',
      meta: {
        title: '举报管理'
      }
    },
    {
      path: 'liveData/list',
      component: () => import('@/views/live-data'),
      name: 'LiveData',
      meta: {
        title: '数据报告'
      }
    }
  ]
}
