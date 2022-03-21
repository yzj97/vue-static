let children = []
const allJs = require.context('./', true, /\.js$/)

allJs.keys().map(key => {
  const [, fileName] = key.match(/\.\/([\w-_]*?)\.js/)
  if (fileName !== 'index') {
    children = [...children, ...allJs(key).default]
  }
})

export default {
  path: '/sample',
  redirect: '/sample/level-three/list',
  name: 'Sample',
  meta: {
    title: '示例'
  },
  children: [
    ...children,
    {
      path: 'level-three',
      component: () => import('@/views/level-three'),
      redirect: '/sample/level-three/list',
      name: 'SampleLevelThree', // 3级路由-需要标注名称，不然不能缓存
      meta: {
        title: '3级路由模块'
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/level-three/list'),
          name: 'SampleLevelThreeList', // 3级路由-需要标注名称，不然不能缓存
          meta: { title: '3级路由模块列表' }
        }
      ]
    },
    {
      path: 'level-two/list',
      component: () => import('@/views/level-two/list'),
      name: 'SampleLevelTwoList', // 2级路由-需要标注名称，不然不能缓存
      meta: {
        title: '2级路由模块'
      }
    },
    {
      path: 'level-two/detail',
      component: () => import('@/views/level-two/detail'),
      name: 'SampleLevelTwoDetail', // 2级路由-需要标注名称，不然不能缓存
      meta: {
        title: '2级路由模块详情'
      }
    }
  ]
}
