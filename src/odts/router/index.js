export default {
  path: '/odts-web',
  name: 'OdtsWeb',
  meta: {
    title: '开放平台',
    icon: 'table'
  },
  children: [
    {
      path: 'mpMapping',
      component: () => import('@/views/mpMapping'),
      name: 'OdtsMpMapping',
      meta: {
        title: '商品映射'
      }
    },
    {
      path: 'authConfig',
      component: () => import('@/views/authConfig'),
      name: 'OdtsAuthConfig',
      meta: {
        title: '授权管理'
      }
    },
    {
      path: 'toAuth/:authType/:authCode',
      component: () => import('@/views/authConfig'),
      name: 'OdtsToAuthConfig',
      meta: { title: '授权管理' },
      hidden: true
    },
    {
      path: 'areaMapping',
      component: () => import('@/views/areaMapping'),
      name: 'OdtsAreaMapping',
      meta: {
        title: '渠道区域映射'
      }
    },
    {
      path: 'odts/areaMappingrBatch',
      component: () => import('@/views/areaMapping/batch'),
      name: 'OdtsAreaMappingBatch',
      meta: { title: '批量导入', icon: 'table' },
      hidden: true
    }
  ]
}
