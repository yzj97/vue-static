项目名：欧电云vue-static项目，git仓库地址：[gitlab-static](http://git.odianyun.local/baseline/vue-static.git) 。

## 1. 如何运行

> node版本 `8.4.0` 以上，建议11.3.0

### 1.1 开发环境配置

安装好node, 拉取包直接运行，需要确定好host是否配置

* 后端host

### 1.2 开发过程

#### 1.2.1 命令

```sh
# 开发
npm run [poolName]

# 构建poolName
npm run build:[poolName]

# 构建所有项目
npm run build
```

#### 1.2.2 代理配置

`WebPack-Proxy` 代理：

- 修改`src/config.js` 的 `BASE_API`

#### 1.2.3 依赖portal 指的是主工程 portal-static

1. 组件如ody-开头的 由portal提供
2. this.$portal. 提供一些公共的方法
3. 本身的路由，挂载在window.$ody.routerMap下

### 1.3 Jenkins发布

发布到线上的时候, 线上要有portal工程 保证打包后子工程能copy到portal下, 然后子工程打包完毕, 再打portal工程

| 工程名称 | 描述 |
| --- | --- |
| `ones2.9-prod-dev-vue-static-build` | `构建子工程` |


> 发布时的备注nginx 转向 /api/poolName 是需要运维配置处理

### 1.4 错误告警及监控

现在是通过vue的errorHandler, 收集异常存放到状态机

### 1.5 相关人员

| 角色 | 人员 |
| --- | --- |
| 前端开发 | 魏杰 |
| 后台开发 | 待补充 |

## 2. 业务介绍

### 2.1 业务入口

入口地址为 `src/config.js` 的 `WEB_URL`，加载的 `index.html`

1. 全渠道

| 页面目录    | 页面描述             | 页面链接                                                | 参数描述                                          |
| ----------- | -------------------- | ------------------------------------------------------- | ------------------------------------------------- |
| index     | 登录admin后台(开发环境)        | http://adminportal2d9dev.oudianyun.com/ | 站点                                         |
| index     | 登录static后台(开发环境)        | http://adminportal2d9dev.oudianyun.com/?static | 查看组件、配置实施等                                         |
| index | 登录admin后台（测试环境） | http://adminportal.2d9d3.oudianyun.com/ | 站点 |
| index | 登录static后台（测试环境） | http://adminportal.2d9d3.oudianyun.com/?static | 查看组件、配置实施等 |


### 2.2 功能列表

* 开发poolName
* 发布poolName
* 发布全部


## 3. 其他

### 3.1 目录结构

本项目已经为你生成了一个完整的开发框架，提供了涵盖中后台开发的各类功能和坑位，下面是整个项目的目录结构。

```
├── build                      // 构建相关
├── config                     // 配置相关
├── packages                   // 子工程公用组件，公用国际化
│   ├── components             // 组件
│   ├── lang                   // 国际化
├── src                        // 源代码
│   ├── poolName1              // 所有poolName1代码
│   │   ├── api                // 所有请求
│   │   ├── components         // 全局公用组件
│   │   ├── router             // 路由
│   │   ├── views              // views 所有页面
│   │   ├── utils              // 所有公用方法
│   ├── poolName2              // 所有poolName2代码
│   └── config.js              // 通用的base_api和 web_url配置
├── static                     // 第三方不打包资源
│   ├── modules                // 子pool打包的存放地
│   └── Tinymce                // 富文本
├── .babelrc                   // babel-loader 配置
├── .eslintrc.js               // eslint 配置项
├── .gitignore                 // git 忽略项
├── .travis.yml                // 自动化CI配置
└── package.json               // package.json
```

### 3.2 浏览器兼容情况

| 浏览器  | 版本             |
| ------- | ---------------- |
| id/edge | IE10, IE11, Edge |
| Firefox | last 2 versions  |
| Chrome  | last 2 versions  |
| Safari  | last 2 versions  |

### 3.3 配置路由 poolName/router/index.js

```js
alwaysShow: false, // false: 子路由只有一个，就显示子路由, true: 总是显示对应的菜单 (home 默认 false, 其他默认 true)
//当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
hidden: true, // 默认 false
//当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
redirect: "noRedirect",
//设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
name: "RouterName",
meta: {
  title: "title", //设置该路由在侧边栏和面包屑中展示的名字, 默认 ''
  parentTitle: '商品中心', // 有些pool挂在其他菜单下，需要设置对应的parentTitle, 默认 ''
  icon: "svg-name", //设置该路由的图标, 默认 ''
  activeMenu: '/example/list', // 菜单内部的路由需要也选中菜单，可以用activeMenu来控制，默认 ''
  noCache: true, //如果设置为true，则不会被 <keep-alive> 缓存, 默认 false
```

示例：

```js
{
  path: '/permission',
  component: Layout,
  redirect: '/permission/index', //重定向地址，在面包屑中点击会重定向去的地址
  hidden: true, // 不在侧边栏线上
  meta: { }, //你可以在根路由设置权限，这样它下面所以的子路由都继承了这个权限
  children: [{
    path: 'index',
    component: () => import('permission/index'),
    name: 'permission',
    meta: {
      title: 'permission',
      icon: 'lock' //图标
    }
  }]
}
```

### 3.4 安全权限控制

封装了一个指令权限，能简单快速的实现按钮级别的权限判断。 v-permission 

**使用**

```html
<template>
  <!-- Admin can see this -->
  <el-tag v-permission="['admin']">admin</el-tag>

  <!-- Editor can see this -->
  <el-tag v-permission="['editor']">editor</el-tag>

  <!-- Editor can see this -->
  <el-tag v-permission="['admin','editor']">Both admin or editor can see this</el-tag>

  <ody-button code="code1">test</ody-button>
</template>
```

可以在 "指令" => "按钮权限" 查看详情

### 3.5 全局的input， blur的时候trim一下

这个是在portal工程中的App.vue做了特殊的处理

```javascript
 bindInputBlur() {
      $('body').on('blur.input', 'input', (e) => {
        e.target.value = e.target.value.trim()
        e.target.dispatchEvent(new Event('input'))
      })
    },
```

## 4. 其他

* [简单vue学习](docs/简单vue学习.md)
* [代码规范](docs/代码规范.md)
* [项目规范](docs/项目规范.md)
* [Vue代码规范](docs/Vue代码规范.md)
* [2.7到2.8](docs/迁移2.7到2.8.md)
* [公共组件和lang放到packages下](docs/公共组件和lang放到packages下.md)
* [使用lang](docs/使用lang.md)
* [国际化开发说明](docs/国际化开发说明.md)
* [常用编辑器VSCode使用](docs/常用编辑器VSCode使用.md)
* [es6解构](docs/es6解构.md)
* [菜单如何给后端配置](docs/菜单、按钮、接口权限接入指南.md)
* [vue-static和portal的关系](docs/架构文档.pptx)
* [请求接口文档](docs/请求的示例.md)
* [公共业务组件用途](docs/components.md)
* [三级路由如何开启缓存](docs/三级路由缓存.md)

### 4.1 git提交规范

Header部分只有一行，包括三个字段：type（必需）、scope（可选）和subject（必需）。

#### type

用于说明本次commit的类别，只允许使用下面10个标识

* 新增       # 新模块的开发
* 修复       # bug的修复
* 文档       # 只改动了文档相关的内容
* 格式       # 不影响代码含义的改动，例如去掉空格、改变缩进、增删分号
* 重构       # 即不是新增功能，也不是修改bug的代码变动
* 测试       # 完成测试代码
* 工具       # 构造工具的或者外部依赖的改动，例如webpack，npm
* 优化       # 性能优化相关
* 开发中     # 正在开发中
* 已完成     # 开发完成

#### 好的样例

```
新增 商品详情模块
已完成 商品管理新增商品跳转功能
修复 BC-2020会员中心在xxx不显示的bug
```