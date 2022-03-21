import changeCase from 'packages/utils/change-case'
export default function(namespace, router, api, packages) {
// 打包环境通过这个
  if (!window.$ody) {
    window.$ody = {}
  }

  if (!window.$ody[`$${namespace}`]) {
    window.$ody[`$${namespace}`] = {}
  }

  // 显示所有processEnv, 主要显示构建信息
  window.$ody[`$${namespace}`].processEnv = process.env
  // 开发环境
  window.$ody.isDev = process.env.NODE_ENV === 'development'

  // 子工程包
  if (packages) {
    loadPackage('packages', packages)
  }

  // 路由
  if (router) {
    if (Array.isArray(router)) {
      router.forEach(x => {
        loadRouter(namespace, x)
      })
    } else {
      loadRouter(namespace, router)
    }
  }

  // 接口
  if (api) {
    // api 文件名命名规范“连字符”转换成"小驼峰” 调用，例如 role-abc.js  调用 this.$sample.$api.roleAbc.xxxxx()
    const newApi = Object.keys(api).reduce((prev, key) => {
      prev[changeCase(key)] = api[key]
      return prev
    }, {})

    loadApi(namespace, newApi)
  }
}

function loadApi(namespace, api) {
  if (!window.$ody.apiList) {
    window.$ody.apiList = []
  }
  window.$ody.apiList.push({
    namespace,
    apiMap: api
  })
}

function loadPackage(namespace, packages) {
  if (window.$ody.isDev) {
    window.$ody[namespace] = packages
  } else {
    const beforePackages = window.$ody[namespace] || { BUILD_TIME: '0' }

    if (beforePackages.BUILD_TIME < process.env.BUILD_TIME) {
    // packages 最后构建时间
      packages.BUILD_TIME = process.env.BUILD_TIME
      // packages 最后构建的pool
      packages.BUILD_POOL = namespace
      // packages组件
      window.$ody[namespace] = packages
    }
  }
}

function loadRouter(namespace, router) {
  if (!window.$ody.routerList) {
    window.$ody.routerList = []
  }
  router.namespace = namespace
  window.$ody.routerList.push(router)
}
