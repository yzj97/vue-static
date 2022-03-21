let children = []
const allJs = require.context('./', true, /\.js$/)

allJs.keys().map(key => {
  const [, fileName] = key.match(/\.\/([\w-_]*?)\.js/)
  if (fileName !== 'index') {
    children = [...children, ...allJs(key).default]
  }
})

export default {
  path: '/ouser-web',
  redirect: '/ouser-web/operaEmployeeList',
  name: 'OuserWeb',
  meta: {
    title: '用户中心',
    icon: 'table'
  },
  children: [
    ...children,
    {
      path: 'backendMessagePublic',
      component: () => import('@/views/backendMessagePublic'),
      name: 'OuserBackendMessagePublic',
      meta: { title: '公告管理' }
    },
    {
      path: 'operaUserInfo',
      component: () => import('@/views/operaUserInfo'),
      name: 'OuserOperaUserInfo',
      meta: { title: '个人信息' }
    },
    {
      path: 'operaAccountInfo',
      component: () => import('@/views/operaAccountInfo'),
      name: 'OuserOperaAccountInfo',
      meta: { title: '账户信息' }
    },
    {
      // use
      path: 'guilderManage',
      component: () => import('@/views/guilderManage'),
      name: 'OuserGuilderManage',
      meta: { title: '员工管理' }
    },
    {
      path: 'salesmanManage',
      component: () => import('@/views/salesman'),
      name: 'SalesmanManage',
      meta: { title: '业务员管理' }
    },
    {
      path: 'operaAddRole/:userId/:departmentId',
      component: () => import('@/views/operaAddRole'),
      name: 'OuserOperaAddRole',
      hidden: true,
      meta: { title: '功能权限' }
    },
    {
      // use
      path: 'departmentManage',
      component: () => import('@/views/departmentManage'),
      name: 'OuserDepartmentManage',
      meta: { title: '组织架构管理' }
    },
    { // use
      path: 'positionList',
      component: () => import('@/views/positionList'),
      name: 'OuserPositionList',
      meta: { title: '岗位管理' }
    },
    {
      // use
      path: 'roleManage',
      component: () => import('@/views/roleManage'),
      name: 'OuserRoleManage',
      meta: { title: '角色管理' }
    },
    {
      path: 'roleEdit/:roleId',
      component: () => import('@/views/roleEdit'),
      name: 'OuserRoleEdit',
      meta: { title: '角色详情' }
    },
    {
      // use
      path: 'backendMessage',
      component: () => import('@/views/backendMessage'),
      name: 'OuserBackendMessage',
      meta: { title: '我的公告' }
    },
    {
      // use
      path: 'userAccount',
      component: () => import('@/views/userAccount'),
      name: 'OuserUserAccount',
      meta: { title: '账户管理' }
    },
    {
      // use
      path: 'userAccountFlow',
      component: () => import('@/views/userAccount/flow'),
      name: 'OuserUserAccountFlow',
      meta: { title: '账户明细管理' }
    },
    // 供应商管理
    {
      path: 'supplier/list',
      name: 'OpmsSupplierList',
      component: () => import('@/views/supplier/supplier-list'),
      meta: { title: '供应商管理', icon: 'table' }
    },
    {
      path: 'supplier/add/:editStatus',
      name: 'OpmsSupplierAdd',
      component: () => import('@/views/supplier/supplier-add'),
      hidden: true,
      meta: { title: '新增供应商' }
    },
    {
      path: 'supplier/detail/:supplierId/:merchant/:editStatus', // 'supplier/edit/:supplierId/:supplierType/:merchant/:editStatus'
      name: 'OpmsSupplierDetail',
      component: () => import('@/views/supplier/supplier-detail'),
      hidden: true,
      meta: { title: '供应商信息' }
    },
    {
      path: 'supplier/supplierBind',
      name: 'OpmsSupplierBind',
      component: () => import('@/views/supplier/SupplierBind'),
      meta: { title: '关联平台供应商', icon: 'table' }
    },
    {
      path: 'supplier/AddSupplier',
      name: 'OpmsAddSupplier',
      component: () => import('@/views/supplier/AddSupplier'),
      meta: { title: '关联平台供应商-新增', icon: 'table' },
      hidden: true
    },
    {
      path: 'userVip',
      name: 'OuserUserVipManage',
      component: () => import('@/views/userVip'),
      meta: { title: '用户VIP卡管理' }
    },
    {
      path: 'shoppingCertification',
      name: 'ShoppingCertification',
      component: () => import('@/views/shoppingCertification'),
      meta: { title: '购物认证设置' }
    },
    {
      path: 'uncertifiedOrderingMember',
      name: 'UncertifiedOrderingMember',
      component: () => import('@/views/uncertifiedOrderingMember'),
      meta: { title: '未认证下单会员' }
    }
  ]
}
