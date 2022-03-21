export default [
  {
    path: 'receiveTask/add',
    name: 'ReceiveTaskAdd',
    component: () => import('@/views/receiveTask/add'),
    meta: {
      title: '收货任务新建'
    },
    hidden: true
  }
]
