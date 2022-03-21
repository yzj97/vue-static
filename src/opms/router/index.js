export default {
  path: '/opms-web',
  name: 'OpmsWeb',
  meta: {
    title: '采购中心',
    icon: 'table'
  },
  children: [
    // 动态路由
    {
      path: 'purchasePlan/collect',
      component: () => import('@/views/purchasePlan/collect'),
      name: 'OpmsPurchasePlanCollectList',
      meta: { title: '采购计划汇总列表', icon: 'table' }
    },
    {
      path: 'purchasePlan/plan',
      component: () => import('@/views/purchasePlan/plan'),
      name: 'OpmsPurchasePlanList',
      meta: { title: '采购计划', icon: 'table' }
    },
    {
      path: 'purchasePlan/template',
      component: () => import('@/views/purchasePlanTemplate'),
      name: 'OpmsPurchasePlanTemplate',
      meta: { title: '采购计划申请模板', icon: 'table' }
    },
    {
      path: 'purchasePlan/plan/detail',
      component: () => import('@/views/purchasePlan/plan/detail'),
      name: 'OpmsPurchasePlanDetail',
      meta: { title: '采购计划详情', icon: 'table' },
      hidden: true
    },
    {
      path: 'purchasePlan/plan/edit',
      component: () => import('@/views/purchasePlan/plan/edit'),
      name: 'OpmsPurchasePlanEdit',
      meta: { title: '编辑采购计划', icon: 'table' },
      hidden: true
    },
    {
      path: 'purchasePlan/plan/add',
      component: () => import('@/views/purchasePlan/plan/add'),
      name: 'OpmsPurchasePlanAdd',
      meta: { title: '新增采购计划', icon: 'table' },
      hidden: true
    },
    {
      path: 'purchasePlan/certificate/items',
      component: () => import('@/views/purchasePlan/certificate/items'),
      name: 'OpmsPurchasePlanCertificate',
      hidden: true,
      meta: { title: '采购计划-资质证书', icon: 'table' },
      query: {
        purchasePlanId: null
      }
    },
    {
      path: 'myorder',
      component: () => import('@/views/myorder'),
      name: 'OpmsMyOrder',
      meta: { title: '我的订单', icon: 'table' }
    },
    {
      path: 'myorder/detailInfo',
      component: () => import('@/views/myorder/detailInfo'),
      name: 'OpmsMyOrderDetailInfo',
      meta: { title: '我的订单-详细信息', icon: 'table' },
      hidden: true
    },
    {
      path: 'purchasePlan/certificate/order',
      component: () => import('@/views/purchasePlan/certificate/order'),
      name: 'OpmsPurchaseOrderProductCertificate',
      meta: { title: '采购单-资质证书', icon: 'table' },
      hidden: true,
      query: {
        purchaseOrderId: null
      }
    },
    {
      path: 'myorder/orderProductList',
      component: () => import('@/views/myorder/orderProductList'),
      name: 'OpmsPurchaseOrderProductList',
      meta: { title: '供应商商品销售明细查询', icon: 'table' }
    },
    {
      path: 'returnorder',
      component: () => import('@/views/returnorder'),
      name: 'OpmsReturnOrderList',
      meta: { title: '退货单', icon: 'table' }
    },
    {
      path: 'returnorder/detailInfo',
      component: () => import('@/views/returnorder/detailInfo'),
      name: 'OpmsReturnOrderDetailInfo',
      meta: { title: '退货单-详细信息', icon: 'table' },
      hidden: true,
      query: {
        returnCode: null
      }
    },
    {
      path: 'purchaseChangeOrder',
      component: () => import('@/views/purchaseChangeOrder'),
      name: 'OpmsPurchaseChangeOrderList',
      meta: { title: '更正单', icon: 'table' }
    },
    {
      path: 'purchaseChangeOrder/detailInfo',
      component: () => import('@/views/purchaseChangeOrder/detailInfo'),
      name: 'OpmsPurchaseChangeOrderDetailInfo',
      meta: { title: '更正单-详细信息', icon: 'table' },
      hidden: true,
      query: {
        changeCode: null,
        changeType: 1
      }
    },
    {
      path: 'stockInitialization',
      component: () => import('@/views/stockInitialization'),
      name: 'OpmsStockInitialization',
      meta: { title: '库存初始化', icon: 'table' }
    }, {
      path: 'stockInitialization/newGoods',
      component: () => import('@/views/stockInitialization/newGoods/add'),
      name: 'OpmsNewstockInitializationNewGoods',
      meta: { title: '库存初始化-新增', icon: 'table' },
      hidden: true
    }, {
      path: 'stockInitialization/details/:orderCode',
      component: () => import('@/views/stockInitialization/details'),
      name: 'OpmsNewstockInitializationDetails',
      meta: { title: '库存初始化-详情', icon: 'table' },
      hidden: true
    }, {
      path: 'stockInitialization/editGoods/:orderCode',
      component: () => import('@/views/stockInitialization/newGoods'),
      name: 'OpmsNewstockInitializationEditGoods',
      meta: { title: '库存初始化-编辑', icon: 'table' },
      hidden: true
    }, {
      path: 'purchaseReturnOrder/returnOrderList',
      component: () => import('@/views/purchaseReturnOrder'),
      name: 'OpmsPurchaseReturnOrderList',
      meta: { title: '退货单', icon: 'table' }
    },
    {
      path: 'purchaseReturnOrder/returnOrder/detail/:returnCode',
      component: () => import('@/views/purchaseReturnOrder/detail'),
      name: 'OpmsPurchaseReturnOrderDetail',
      hidden: true,
      meta: { title: '退货单详情', icon: 'table' }
    },
    // 商品资质证书类型管理
    {
      path: 'purchaseCertificate/queryCertificateList',
      component: () => import('@/views/purchaseCertificate/list'),
      name: 'OpmsPurchaseCertificateList',
      meta: { title: '商品资质证书管理', icon: 'table' }
    },
    {
      path: 'contractProductPriceView',
      component: () => import('@/views/contractProductPriceView'),
      name: 'OpmsContractProductPriceView',
      meta: { title: '供应商商品查看', icon: 'table' }
    },
    {
      path: 'purchaseReceiveOrder',
      component: () => import('@/views/purchaseReceiveOrder'),
      name: 'OpmsPurchaseReceiveOrder',
      meta: { title: '采购收货单查询', icon: 'table' }
    },
    {
      path: 'purchaseReceiveOrder/detailInfo',
      component: () => import('@/views/purchaseReceiveOrder/detailInfo'),
      name: 'OpmsPurchaseReceiveDetailInfo',
      meta: { title: '采购收货单-详细信息', icon: 'table' },
      hidden: true
    },
    {
      path: 'purchasePlan/certificate/receiveOrder',
      component: () => import('@/views//purchasePlan/certificate/receiveOrder'),
      name: 'OpmsPurchaseReceiveOrderProductCertificate',
      meta: { title: '采购收货单-资质证书', icon: 'table' },
      hidden: true,
      query: {
        purchaseOrderId: null
      }
    },
    {
      path: 'purchasePlanAnalysis',
      component: () => import('@/views/purchasePlanAnalysis'),
      name: 'OpmsPurchasePlanAnalysis',
      meta: { title: '采购计划分析', icon: 'table' }
    },
    {
      path: 'contract/jxContract',
      component: () => import('@/views/contract/jxContract'),
      name: 'OpmsJxContractList',
      meta: { title: '经销合同管理', icon: 'table' }
    },
    {
      path: 'contract/jxContract/detail/:id/:isEdit',
      component: () => import('@/views/contract/jxContract/detail'),
      name: 'OpmsJxContractDetail',
      meta: { title: '经销合同详情', icon: 'table' },
      hidden: true
    },
    {
      path: 'purchaseOrder/list',
      component: () => import('@/views/purchaseOrder/list'),
      name: 'OpmsPurchaseOrderList',
      meta: { title: '采购单', icon: 'table' }
    },
    {
      path: 'purchaseOrder/edit',
      component: () => import('@/views/purchaseOrder/edit'),
      name: 'OpmsPurchaseOrderEdit',
      meta: { title: '采购单详情', icon: 'table' },
      hidden: true
    },
    {
      path: 'purchaseOrder/certificate',
      component: () => import('@/views/purchaseOrder/certificate'),
      name: 'OpmsPurchaseOrderCertificate',
      meta: { title: '采购单资质证书', icon: 'table' },
      hidden: true,
      query: {
        purchaseOrderId: null
      }
    }
  ]
}
