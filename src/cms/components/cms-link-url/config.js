export default{
  tabOptions: [
    { label: '自定义', name: 'custom', link: {}},
    { label: '商品', name: 'product', link: {}},
    { label: '搜索页', name: 'search', link: {}},
    { label: '站内页', name: 'station', link: {}},
    { label: '类目', name: 'category', link: {}},
    { label: '页面', name: 'promotion', link: {}}
  ],
  options: [
    { label: '商城首页', value: '/index.html' },
    { label: '购物车', value: '/cart.html' },
    { label: '个人中心', value: '/my/home.html' },
    { label: '注册', value: '/regis.html' },
    { label: '登录', value: '/login.html' },
    { label: '砍价', value: '/cut/index.html' },
    { label: '砍价单', value: '/cut/my-bargain.html' },
    { label: '拼团', value: '/group/index.html' },
    { label: '我的团', value: '/group/my-group.html' },
    { label: '秒杀', value: '/seckill.html' },
    { label: '抽奖', value: '/my/my-awards.html' },
    { label: '分类页', value: '/category.html' },
    { label: '领券中心', value: '/coupons-list.html' },
    { label: '社区', value: '/find/post-list.html' },
    { label: '积分商城', value: '/pointShop.html' },
    { label: '直播专区', value: '/live-stream/live-broadcasting-zone.html' }
  ],
  channel: [
    {
      label: '渠道：BBC',
      type: 'BBC',
      code: '110001',
      link: {}
    },
    {
      label: '渠道：B2B',
      type: 'B2B',
      code: '110002',
      link: {}
    },
    {
      label: '渠道：O2O',
      type: 'O2O',
      code: '110003',
      link: {}
    }
  ]
}
