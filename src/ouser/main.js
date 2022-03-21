import 'babel-polyfill'
import implementationRouter from './router/implementationRouter'
import adminRouter from './router/adminRouter'
import router from './router'
import api from './api'
import packages from 'packages'
import main from 'packages/utils/main'

const namespace = process.env.POOL_NAME

// console.log(router)
main(namespace, router, api, packages)

// 动态路由，注入到portal下(static目录下)
if (implementationRouter && implementationRouter.length) {
  if (!window.$ody.dynamicRouterList) {
    window.$ody.dynamicRouterList = []
  }
  window.$ody.dynamicRouterList.push({
    title: '实施',
    routerList: implementationRouter
  })

  if (!window.$ody.superRouterList) {
    window.$ody.superRouterList = []
  }

  window.$ody.superRouterList.push({
    namespace,
    path: '/envChecker', // 这个必须是根path
    component: () => import('@/views/envChecker')
  })

  window.$ody.superRouterList.push({
    namespace,
    path: '/auth', // open-api 授权
    component: () => import('@/views/auth/authorization/auth')
  })
}
// 动态路由，注入到portal下(static目录下)
if (adminRouter && adminRouter.length) {
  if (!window.$ody.dynamicRouterList) {
    window.$ody.dynamicRouterList = []
  }
  window.$ody.dynamicRouterList.push({
    title: '辅助工具',
    routerList: adminRouter
  })
}

