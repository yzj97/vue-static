# windows 下变量说明

## 打包信息 window.$ody.$[namespace].processEnv

|                     key                      |  type  |      desc      |
|----------------------------------------------|--------|----------------|
| window.$ody.$agent.processEnv                | Object | 打包公用的信息 |
| window.$ody.$agent.processEnv.BUILD_TIME     | String | 最后构建时间   |
| window.$ody.$agent.processEnv.COMMIT_DETAIL  | String | 构建详细信息   |
| window.$ody.$agent.processEnv.COMMIT_ID      | String | commitID       |
| window.$ody.$agent.processEnv.CURRENT_BRANCH | String | 分支           |
| window.$ody.$agent.processEnv.NODE_ENV       | String | 开发 / 生产    |
| window.$ody.$agent.processEnv.POOL_NAME      | String | 当前pool名     |

## 动态路由信息 window.$ody.dynamicRouterList

|                     key                      |  type  |      desc      |
|----------------------------------------------|--------|----------------|
| window.$ody.dynamicRouterList                | Array<Object> | 动态路由，现在portal有静态路由 + 动态路由 + 业务路由 |
| window.$ody.dynamicRouterList[0].title | String | 路由显示标题 |
| window.$ody.dynamicRouterList[0].routerList | Array<Object> | 路由集合 |
| window.$ody.dynamicRouterList[0].routerList[0].component | Function | 加载的组件 |
| window.$ody.dynamicRouterList[0].routerList[0].meta | Object | 路由meta信息 |
| window.$ody.dynamicRouterList[0].routerList[0].meta.title | String | 显示的子标题 |
| window.$ody.dynamicRouterList[0].routerList[0].name | String | 路由名称 |
| window.$ody.dynamicRouterList[0].routerList[0].path | String | 路由路径 |

## 超级路由，一级路由 window.$ody.superRouterList

| key  | type | desc |
| ---- | ---- | ---- |
|  window.$ody.superRouterList  | Array |   超级路由，成一级路由   |
| window.$ody.superRouterList[0].namespace | String | poolName |
| window.$ody.superRouterList[0].path | String | 路由路径 |
| window.$ody.superRouterList[0].redirect | String | 路由跳转路径 |
| window.$ody.superRouterList[0].name | String | 路由名称 |
| window.$ody.superRouterList[0].meta | Object | 路由meta信息 |
| window.$ody.superRouterList[0].children | Array | 路由集合 |
| window.$ody.superRouterList[0].hidden | Boolean | 是否隐藏 |



## 子pool开发环境  window.$ody.isDev

|                     key                      |  type  |      desc      |
|----------------------------------------------|--------|----------------|
| window.$ody.isDev | Boolean | true 为 是， false为否 |

## 子packages集合 window.$ody.packages

|                     key                      |  type  |      desc      |
|----------------------------------------------|--------|----------------|
| window.$ody.packages.BUILD_POOL | String | 最后打包的pool |
| window.$ody.packages.BUILD_TIME | String | 最后打包的pool的时间 |
| window.$ody.packages.components | Object | 子公用组件 |
| window.$ody.packages.lang | Object | 国际化 |
| window.$ody.packages.api | Object | api集合，获取方式 this.$api.fileName.methodName |

## 子router集合 window.$ody.routerMap

|                     key                      |  type  |      desc      |
|----------------------------------------------|--------|----------------|
| window.$ody.routerMap | Object | 子工程的路由集合 |
| window.$ody.routerMap.Agent | Object | 以Agent为例 |
| window.$ody.routerMap.Agent.children | Array | 路由集合 |
| window.$ody.routerMap.Agent.meta | Object | 路由meta信息 |
| window.$ody.routerMap.Agent.name | String | 路由名称 |
| window.$ody.routerMap.Agent.namespace | String | 显示pool，为了动态加载路由控制，现没用 |
| window.$ody.routerMap.Agent.parent | Array | 父路由集合 |
| window.$ody.routerMap.Agent.path | String | 路由路径 |
| window.$ody.routerMap.Agent.redirect | String | 路由跳转路径 |
| window.$ody.routerMap.Agent.hidden | Boolean | 是否隐藏 |

## 子router集合 window.$ody.routerList, 处理完毕会转换成 window.$ody.routerMap

|                     key                      |  type  |      desc      |
|----------------------------------------------|--------|----------------|
| window.$ody.routerList | Array<Object> | 子pool的router列表 |
| window.$ody.routerList[0].namespace | String | poolName |
| window.$ody.routerList[0].path | String | 路由路径 |
| window.$ody.routerList[0].redirect | String | 路由跳转路径 |
| window.$ody.routerList[0].name | String | 路由名称 |
| window.$ody.routerList[0].meta | Object | 路由meta信息 |
| window.$ody.routerList[0].children | Array | 路由集合 |
| window.$ody.routerList[0].hidden | Boolean | 是否隐藏 |
|  |  |  |


## 子api集合 window.$ody.apiList

|                     key                      |  type  |      desc      |
|----------------------------------------------|--------|----------------|
| window.$ody.apiList | Array<Object> | 子pool的api列表 |
| window.$ody.apiList[0].namespace | String | poolName |
| window.$ody.apiList[0].apiMap | Object | 导出定义的api列表，注入成后，通过 this.$namespace.$api.fileName.methodName 调用 |

## 子store集合 window.$ody.storeList

|                     key                      |  type  |      desc      |
|----------------------------------------------|--------|----------------|
| window.$ody.storeList | Array<Object> | 子pool的状态机列表 |
|window.$ody.storeList[0].cms | Object | 状态机集合 |


## ~~子lang集合 window.$ody.langList，package已经国际化了，这个需要废弃~~

|                     key                      |  type  |      desc      |
|----------------------------------------------|--------|----------------|
| window.$ody.langList | Array<Object> | 子pool的lang列表 |
| window.$ody.langList[0].namespace | String | poolName |
| window.$ody.langList[0].en_US | Object | 英文|
| window.$ody.langList[0].zh_CN | Object | 中文 |

## 父 table-id window.$odyTableIndex

|                     key                      |  type  |      desc      |
|----------------------------------------------|--------|----------------|
| window.$odyTableIndex | Number | id不一样，为filer使用 |