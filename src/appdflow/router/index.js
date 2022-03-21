let children = []
const allJs = require.context('./', true, /\.js$/)

allJs.keys().map(key => {
  const [, fileName] = key.match(/\.\/([\w-_]*?)\.js/)
  if (fileName !== 'index') {
    children = [...children, ...allJs(key).default]
  }
})

export default {
  path: '/appdflow',
  name: 'Appdflow',
  meta: {
    title: '审批流'
  },
  children: [
    ...children,
    {
      path: 'afProcess/list',
      component: () => import('@/views/afProcess/list'),
      name: 'AppdflowProcessList',
      meta: {
        title: '审批流管理'
      }
    },
    {
      path: 'afProcess/detail/:id/:readOnly',
      component: () => import('@/views/afProcess/detail'),
      name: 'AppdflowProcessDetail',
      meta: {
        title: '审批流详情'
      },
      hidden: true
    },
    {
      path: 'afTask/list',
      component: () => import('@/views/afTask/list'),
      name: 'AppdflowTaskList',
      meta: {
        title: '审批任务管理'
      }
    },
    {
      path: 'afTask/detail/:taskCode/:auditTaskId',
      component: () => import('@/views/afTask/detail'),
      name: 'AppdflowTaskDetail',
      meta: {
        title: '审批任务详情'
      },
      hidden: true
    }
  ]
}
