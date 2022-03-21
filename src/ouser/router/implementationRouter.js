export default [
  {
    path: 'wechatConfigManage',
    component: () => import('@/views/wechatConfigManage'),
    name: 'OuserWechatConfigManage',
    meta: { title: '微信配置' }
  },
  {
    path: 'omcManage',
    component: () => import('@/views/omcManage'),
    name: 'OuserOmcManage',
    meta: { title: '消息云配置' }
  },
  {
    path: 'web-config',
    component: () => import('@/views/web-config'),
    name: 'OuserWebConfig',
    meta: { title: '网站基础设置' }
  },
  {
    path: 'switcher',
    component: () => import('@/views/switcher'),
    name: 'OuserSwitcher',
    meta: { title: '功能开关' }
  },
  {
    path: 'moduleSwitcher',
    component: () => import('@/views/moduleSwitcher'),
    name: 'OuserModuleSwitcher',
    meta: { title: '模块开关' }
  },
  {
    path: 'codeInfo',
    component: () => import('@/views/codeInfo'),
    name: 'OuserCodeInfo',
    meta: { title: '字典设置' }
  },
  {
    path: 'pageInfo',
    component: () => import('@/views/pageInfo'),
    name: 'OuserPageInfo',
    meta: { title: '配置设置' }
  },
  {
    path: 'smsConfig',
    component: () => import('@/views/smsConfig'),
    name: 'OuserSmsConfig',
    meta: { title: '短信配置' }
  },
  {
    path: 'envChecker',
    component: () => import('@/views/envChecker'),
    name: 'OuserEnvChecker',
    meta: { title: '环境检查' }
  },
  {
    path: 'authProject',
    component: () => import('@/views/auth/authProject/list'),
    name: 'AuthProjectList',
    meta: {
      title: '授权项目'
    }
  },
  {
    path: 'authorizationList',
    component: () => import('@/views/auth/authorization/list'),
    name: 'AuthorizationList',
    meta: {
      title: '授权信息'
    }
  },
  {
    path: 'auth',
    component: () => import('@/views/auth/authorization/auth'),
    name: 'Auth',
    meta: { title: 'open-api授权' },
    hidden: true
  }
]
