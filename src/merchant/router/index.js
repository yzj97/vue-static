
export default {
  path: '/merchant',
  redirect: '/merchant/channelList',
  name: 'MerchantWeb',
  meta: {
    title: '商家中心',
    icon: 'table'
  },
  children: [
    {
      path: 'channelList',
      component: () => import('@/views/channelList'),
      name: 'MerchantChannelList',
      meta: { title: '渠道管理' }
    },
    {
      path: 'entryTermsList',
      component: () => import('@/views/entryTermsList'),
      name: 'MerchantEntryTermsList',
      meta: { title: '入驻条款' }
    },
    {
      path: 'merchantFlagList',
      component: () => import('@/views/merchantFlagList'),
      name: 'MerchantMerchantFlagList',
      meta: { title: '店铺标签' }
    },
    {
      path: 'accountUnit',
      component: () => import('@/views/accountUnit'),
      name: 'MerchantAccountUnit',
      meta: { title: '核算组织' }
    },
    {
      path: 'merchantEdit/:orgId',
      component: () => import('@/views/merchantEdit'),
      name: 'MerchantEdit',
      meta: { title: '编辑商家' },
      hidden: true
    },
    {
      path: 'merchantRead/:orgId/',
      component: () => import('@/views/merchantRead'),
      name: 'MerchantRead',
      meta: { title: '商家详情' },
      hidden: true
    },
    {
      path: 'merchantManage',
      component: () => import('@/views/merchantManage'),
      name: 'MerchantManage',
      meta: { title: '商家管理' }
    },
    {
      path: 'merchantOrgManage',
      component: () => import('@/views/merchantOrgManage'),
      name: 'MerchantOrgManage',
      meta: { title: '组织层级' }
    },
    {
      path: 'merchant-store-list',
      component: () => import('@/views/merchant-store/list'),
      name: 'MerchantStoreList',
      meta: { title: '店铺管理' }
    },
    {
      path: 'merchant-store-edit/:orgId/:entityType/:showTab/:channelMode/:status', // status 0 = add, 1 edit, 2 = view
      component: () => import('@/views/merchant-store/edit'),
      name: 'MerchantStoreEdit',
      hidden: true,
      meta: { title: '店铺编辑' }
    },
    {
      path: 'customerManage',
      name: 'MerchantCustomerManage',
      meta: { title: '客户管理' },
      component: () => import('@/views/customerManage/list/list.vue')
    },
    {
      path: 'customerManage/:id/:isEdit',
      component: () => import('@/views/customerManage/edit/edit.vue'),
      name: 'MerchantCustomerManageEdit',
      hidden: true,
      meta: { title: '客户详情' }
    },
    {
      path: 'saleArea',
      component: () => import('@/views/saleArea'),
      name: 'MerchantSaleArea',
      meta: { title: '销售区域' }
    },
    {
      path: 'shopArea',
      component: () => import('@/views/shopArea'),
      name: 'MerchantShopArea',
      meta: { title: '店铺区域管理' }
    }
  ]
}
