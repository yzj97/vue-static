let children = []
const allJs = require.context('./', true, /\.js$/)

allJs.keys().map(key => {
  const [, fileName] = key.match(/\.\/([\w-_]*?)\.js/)
  if (fileName !== 'index') {
    children = [...children, ...allJs(key).default]
  }
})

export default {
  path: '/pms-web',
  name: 'PmsWeb',
  meta: {
    title: '采购中心',
    icon: 'table'
  },
  children: [
    ...children,
    {
      path: 'receiveTask/list',
      component: () => import('@/views/receiveTask/list'),
      name: 'ReceiveTaskList',
      meta: {
        title: '收货通知单'
      }
    },
    {
      path: 'receiveTask/add',
      name: 'ReceiveTaskAdd',
      component: () => import('@/views/receiveTask/detail'),
      meta: {
        title: '收货任务新建'
      },
      hidden: true
    },
    {
      path: 'receiveTask/detail/:receiveCode',
      name: 'ReceiveTaskDetail',
      component: () => import('@/views/receiveTask/detail'),
      meta: {
        title: '收货任务详情'
      },
      hidden: true
    },
    {
      path: 'receiveTask/addReceiveTaskSuccess',
      component: () => import('@/views/receiveTask/success.vue'),
      name: 'AddReceiveTaskSuccess',
      meta: { title: '新增收货任务单成功' },
      hidden: true
    },
    {
      path: 'receiveRecord',
      component: () => import('@/views/receiveRecord'),
      name: 'ReceiveRecord',
      meta: { title: '收货记录', icon: 'table' }
    },
    {
      path: 'receiveRecordDetail',
      component: () => import('@/views/receiveRecord/detail'),
      name: 'ReceiveRecordDetail',
      meta: { title: '收货记录详情', icon: 'table' },
      hidden: true,
      query: {
        id: null,
        receiveRecordCode: null
      }
    }
  ]
}
