let children = []
const allJs = require.context('./', true, /\.js$/)

allJs.keys().map(key => {
  const [, fileName] = key.match(/\.\/([\w-_]*?)\.js/)
  if (fileName !== 'index') {
    children = [...children, ...allJs(key).default]
  }
})

export default {
  path: '/cms',
  redirect: '/cms/level-three/list',
  name: 'Cms',
  meta: {
    title: 'CMS'
  },
  children: [
    ...children,
    {
      path: 'cms-category',
      component: () => import('@/views/cms-category'),
      name: 'CmsCategoryList',
      meta: { title: '资讯分类' }
    },
    {
      path: 'cms-article',
      component: () => import('@/views/cms-article'),
      name: 'CmsConsultationList',
      meta: { title: '资讯列表' }
    },
    {
      path: 'cms-page',
      component: () => import('@/views/cms-page'),
      name: 'CmsPageList',
      meta: { title: '页面管理' }
    },
    {
      path: 'cmsH5Edit/:templateId?/:type?',
      component: () => import('@/views/h5-edit'),
      name: 'CmsH5Edit',
      meta: { title: '手机端' },
      hidden: true
    },
    {
      path: 'pc-edit/:templateId?/:type?',
      component: () => import('@/views/pc-edit'),
      name: 'CmsPcEdit',
      meta: { title: 'pc端' },
      hidden: true
    },
    {
      path: 'template/list',
      component: () => import('@/views/template/list'),
      name: 'CmsTemplateList',
      meta: { title: '模板列表页' }
    },
    {
      path: 'front-category-setting',
      component: () => import('@/views/front-category-setting'),
      name: 'CmsFrontCategorySetting',
      meta: { title: '前台类目配置' }
    },
    {
      path: 'skin-setting',
      component: () => import('@/views/skin-setting'),
      name: 'CmsSkinSetting',
      meta: { title: '皮肤模板设置' }
    },
    {
      path: 'float-window-setting',
      component: () => import('@/views/float-window-setting'),
      name: 'FloatWindowSetting',
      meta: { title: '浮窗设置' }
    },
    {
      path: 'homePagePup',
      name: 'HomePagePup',
      component: () => import('@/views/homePagePup'),
      meta: { title: '商城首页弹窗设置' }
    }
  ]
}
