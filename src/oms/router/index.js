export default {
  path: '/oms-web',
  name: 'OmsWeb',
  meta: {
    title: '订单中心',
    icon: 'table'
  },
  children: [
    {
      path: 'order/soPick',
      component: () => import('@/views/order/soPick'),
      name: 'OmsSoPick',
      meta: { title: '门店拣货中心' }
    },
    {
      path: 'order/soPickDelivery',
      component: () => import('@/views/order/soPickDelivery'),
      name: 'OmsSoPickDelivery',
      meta: { title: '订单发货管理' }
    },
    {
      path: 'order/soPickDelivery/detail',
      component: () => import('@/views/order/soPickDelivery/detail'),
      name: 'OmsSoPickDeliveryDetail',
      meta: { title: '发货确认' },
      hidden: true
    },
    {
      path: 'order/auditList',
      component: () => import('@/views/order/auditList'),
      name: 'OmsSoAuditList',
      meta: { title: '订单审核列表' }
    },
    {
      path: 'setting',
      component: () => import('@/views/orderRule'),
      name: 'OmsSetting',
      meta: { title: '设置' },
      children: [
        {
          path: 'orderRule/soInvoiceConfig',
          component: () => import('@/views/orderRule/soInvoiceConfig'),
          name: 'OmsSoInvoiceConfig',
          meta: { title: '申请开票节点设置' }
        }, {
          path: 'orderRule/autoConfirmRule',
          component: () => import('@/views/orderRule/autoConfirmRule'),
          name: 'OmsAutoConfirmRule',
          meta: { title: '接单配置' }
        }, {
          path: 'order/orderRule/autoConfirmRule/detail',
          component: () => import('@/views/orderRule/autoConfirmRule/detail'),
          name: 'OmsAutoConfirmRuleDetail',
          meta: { title: '接单配置详情' },
          hidden: true
        }, {
          path: 'orderRule/routingWarehouseRule',
          component: () => import('@/views/orderRule/routingWarehouseRule'),
          name: 'OmsRoutingWarehouseRule',
          meta: { title: '路由分仓规则' }
        }, {
          path: 'orderRule/routingWarehouseRule/detail',
          component: () => import('@/views/orderRule/routingWarehouseRule/detail'),
          name: 'OmsRoutingWarehouseRuleDetail',
          meta: { title: '路由分仓规则详情' },
          hidden: true
        }, {
          path: 'orderRule/orderAuditRule',
          component: () => import('@/views/orderRule/orderAuditRule/'),
          name: 'OmsOrderAuditRule',
          meta: { title: '订单审核规则' }
        }, {
          path: 'orderRule/orderAuditRule/detail',
          component: () => import('@/views/orderRule/orderAuditRule/detail'),
          name: 'OmsOrderAuditRuleDetail',
          meta: { title: '订单审核规则详情' },
          hidden: true
        }, {
          path: 'orderRule/soDeliveryRule',
          component: () => import('@/views/orderRule/soDeliveryRule/'),
          name: 'OmsSoDeliveryRuleList',
          meta: { title: '物流商匹配' }
        }, {
          path: 'orderRule/soDeliveryRule/detail',
          component: () => import('@/views/orderRule/soDeliveryRule/detail'),
          name: 'OmsSoDeliveryRuleDetail',
          meta: { title: '物流商匹配详情' },
          hidden: true
        }, {
          path: 'orderRule/deliveryMode',
          component: () => import('@/views/orderRule/deliveryMode/'),
          name: 'OmsDeliveryMode',
          meta: { title: '配送方式管理' }
        }, {
          path: 'orderRule/soAutoConfig',
          component: () => import('@/views/orderRule/soAutoConfig/'),
          name: 'OmsSoAutoConfig',
          meta: { title: '订单时效性设置' }
        }, {
          path: 'orderRule/soTypeMappingRule',
          component: () => import('@/views/orderRule/soTypeMappingRule/'),
          name: 'OmsOrderTypeMappingRule',
          meta: { title: '订单类型匹配规则' }
        }, {
          path: 'orderRule/soTypeMappingRule/detail',
          component: () => import('@/views/orderRule/soTypeMappingRule/detail/'),
          name: 'OmsOrderTypeMappingRuleCon',
          meta: { title: '订单类型匹配规则详情' },
          hidden: true
        }, {
          path: 'orderRule/soSplitRule',
          component: () => import('@/views/orderRule/soSplitRule/'),
          name: 'OmsSoSplitRule',
          meta: { title: '订单拆单规则' }
        }, {
          path: 'orderRule/soSplitRule/detail',
          component: () => import('@/views/orderRule/soSplitRule/detail'),
          name: 'OmsSoSplitRuleDetail',
          meta: { title: '订单拆单规则详情' },
          hidden: true
        }, {
          path: 'orderRule/merchantExpressConfig',
          component: () => import('@/views/orderRule/merchantExpressConfig/'),
          name: 'OmsMerchantExpressConfig',
          meta: { title: '配送公司设置' }
        }, {
          path: 'orderRule/soReturnConfig',
          component: () => import('@/views/orderRule/orderReturnConfigManagement/'),
          name: 'OmsSoReturnConfig',
          meta: { title: '售后有效期设置' }
        }, {
          path: 'orderRule/timeoutAlertRule',
          component: () => import('@/views/orderRule/timeoutAlertRule/'),
          name: 'OmsTimeoutAlertRule',
          meta: { title: '超时预警设置' }
        }, {
          path: 'order/orderRule/timeoutAlertRule/detail',
          component: () => import('@/views/orderRule/timeoutAlertRule/detail'),
          name: 'OmsTimeoutAlertRuleDetail',
          meta: { title: '超时预警设置详情' },
          hidden: true
        }
      ]
    },
    {
      path: 'order/so',
      component: () => import('@/views/order/so'),
      name: 'OmsOrderList',
      meta: { title: '订单列表' }
    },
    {
      path: 'order/externalOrderReceive',
      component: () => import('@/views/order/externalOrderReceive'),
      name: 'OmsExternalOrderReceiveList',
      meta: { title: '外部订单接收列表' }
    },
    {
      path: 'order/refundOrderReceive',
      component: () => import('@/views/order/refundOrderReceive'),
      name: 'OmsRefundOrderReceiveList',
      meta: { title: '外部售后单接收列表' }
    },
    {
      path: 'order/so/b2cNormal/:orderCode',
      component: () => import('@/views/order/so/b2cNormal'),
      name: 'OmsOrderB2cNormal',
      meta: { title: '订单详情' },
      hidden: true
    },
    {
      path: 'order/so/b2cTuanGou/:orderCode',
      component: () => import('@/views/order/so/b2cTuanGou'),
      name: 'OmsOrderB2cTuanGou',
      meta: { title: '订单详情' },
      hidden: true
    },
    {
      path: 'order/so/b2cYuShou/:orderCode',
      component: () => import('@/views/order/so/b2cYuShou'),
      name: 'OmsOrderB2cYuShou',
      meta: { title: '订单详情' },
      hidden: true
    },
    {
      path: 'order/so/o2oNormal/:orderCode',
      component: () => import('@/views/order/so/o2oNormal'),
      name: 'OmsOrderO2oNormal',
      meta: { title: '订单详情' },
      hidden: true
    },
    {
      path: 'order/so/posFood/:orderCode',
      component: () => import('@/views/order/so/posFood'),
      name: 'OmsOrderPosFood',
      meta: { title: '订单详情' },
      hidden: true
    },
    {
      path: 'order/so/posShop/:orderCode',
      component: () => import('@/views/order/so/posShop'),
      name: 'OmsOrderPosShop',
      meta: { title: '订单详情' },
      hidden: true
    },
    {
      path: 'order/soReturn',
      component: () => import('@/views/order/soReturn'),
      name: 'OmsOrderSalesListManagement',
      meta: { title: '售后单管理' }
    },
    {
      path: 'order/soReturn/detail/:id?/1/:returnCode?',
      component: () => import('@/views/order/soReturn/detail'),
      name: 'OmsOrderSalesListManagementDetail',
      meta: { title: '售后单详情' },
      hidden: true
    },
    {
      path: 'order/soError',
      component: () => import('@/views/order/soError'),
      name: 'OmsSoError',
      meta: { title: '异常事件列表' }
    },
    // {
    //   path: 'order/soErrorWithCode/:orderCode',
    //   component: () => import('@/views/order/soError'),
    //   name: 'OmsSoErrorWithCode',
    //   meta: { title: '异常事件列表' },
    //   hidden: true
    // },
    {
      path: 'order/timeoutAlert',
      component: () => import('@/views/order/timeoutAlert'),
      name: 'OmsTimeoutAlertList',
      meta: { title: '预警监控' }
    },
    {
      path: 'order/manualOrder',
      component: () => import('@/views/order/manualOrder'),
      name: 'OmsManualOrder',
      meta: { title: '人工下单' }
    },
    {
      path: 'order/manualOrderCustomer',
      component: () => import('@/views/order/manualOrder/customer'),
      name: 'OmsManualOrderCustomer',
      meta: { title: '人工下单(客户)' }
    },
    {
      path: 'order/manualOrderBatch/:menuName/:merchantId/:merchantName/:forCustomer?',
      component: () => import('@/views/order/manualOrder/batch'),
      name: 'OmsManualOrderBatch',
      meta: { title: '批量下单' },
      hidden: true
    },
    {
      path: 'order/copy/:fromOrderCode',
      component: () => import('@/views/order/manualOrder/copy'),
      name: 'OmsOrderCopy',
      meta: { title: '订单复制' },
      hidden: true
    },
    {
      path: 'order/manualOrderSuccess',
      component: () => import('@/views/order/manualOrder/success.vue'),
      name: 'OmsManualOrderSuccess',
      meta: { title: '人工下单成功' },
      hidden: true
    },
    {
      path: 'order/manualOrderDistributor',
      component: () => import('@/views/order/manualOrder/distributor'),
      name: 'OmsManualOrderDistributor',
      meta: { title: '经销商下单' },
      hidden: true
    },
    {
      path: 'order/soPackage',
      component: () => import('@/views/order/soPackage'),
      name: 'OmsParcelList',
      meta: { title: '发货记录管理' }
    },
    {
      path: 'order/soPackage/detail/:id/:packageCode',
      component: () => import('@/views/order/soPackage/detail'),
      name: 'OmsParcelListDetail',
      meta: { title: '发货记录明细' },
      hidden: true
    },
    {
      path: 'order/soPackage/print/:id/:packageCode',
      component: () => import('@/views/order/soPackage/print'),
      name: 'OmsParcelListPrint',
      meta: { title: '发货记录明细打印' },
      hidden: true
    },
    {
      path: 'order/do',
      component: () => import('@/views/order/do'),
      name: 'OmsTransOrdersList',
      meta: { title: '发货任务管理' }
    }, {
      path: 'order/do/detail/:id',
      component: () => import('@/views/order/do/detail'),
      name: 'OmsTransOrderListDetail',
      meta: { title: '发货任务详情' },
      hidden: true
    }, {
      path: 'order/do/edit/:id',
      component: () => import('@/views/order/do/edit'),
      name: 'OmsTransOrderListEdit',
      meta: { title: '发运确认' },
      hidden: true
    }, {
      path: 'order/stockOrder',
      component: () => import('@/views/order/stockOrder'),
      name: 'OmsStockOrderList',
      meta: { title: '缺货订单列表' }
    }, {
      path: 'order/freightTemplate',
      component: () => import('@/views/order/freightTemplate'),
      name: 'OmsFreightTemplateList',
      meta: { title: '运费模板列表' }
    }, {
      path: 'order/freightTemplate/modify/:freightTemplateId?',
      component: () => import('@/views/order/freightTemplate/modify'),
      name: 'OmsFreightTemplateModify',
      meta: { title: '运费模板' },
      hidden: true
    },
    {
      path: 'order/invoice',
      component: () => import('@/views/order/invoice'),
      name: 'OmsInvoiceList',
      meta: { title: '订单发票管理' }
    }
  ]
}
