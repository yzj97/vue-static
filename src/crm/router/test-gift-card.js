export default [
  {
    path: 'test-gift-card/list',
    component: () => import('@/views/test-gift-card/list'),
    name: 'CrmTestGiftCardList',
    meta: {
      title: 'test-gift-card'
    }
  },
  {
    path: 'test-gift-card/create',
    component: () => import('@/views/test-gift-card/create'),
    name: 'CrmTestGiftCardCreate',
    meta: {
      title: 'test-gift-card新建'
    },
    hidden: true
  },
  {
    path: 'test-gift-card/edit/:id',
    component: () => import('@/views/test-gift-card/edit'),
    name: 'CrmTestGiftCardEdit',
    meta: {
      title: 'test-gift-card编辑'
    },
    hidden: true
  },
  {
    path: 'test-gift-card/detail/:id',
    component: () => import('@/views/test-gift-card/detail'),
    name: 'CrmTestGiftCardDetail',
    meta: {
      title: 'test-gift-card详情'
    },
    hidden: true
  }
]

