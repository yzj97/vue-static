export default {
  path: '/finance-web',
  name: 'FinanceWeb',
  meta: {
    title: '结算中心',
    icon: 'table'
  },
  children: [
    {
      path: 'sale/list',
      component: () => import('@/views/apSupplierInvoice/sale'),
      name: 'FinanceInvoiceSaleList',
      meta: { title: '销售发票', icon: 'table' }
    },
    {
      path: 'sale/detail',
      component: () => import('@/views/apSupplierInvoice/sale/detail'),
      name: 'FinanceInvoiceSaleDetail',
      hidden: true,
      meta: { title: '销售发票详情', icon: 'table' }
    },
    {
      path: 'purchase',
      component: () => import('@/views/apSupplierInvoice/purchase'),
      name: 'FinanceInvoicePurchase',
      meta: { title: '采购发票管理', icon: 'table' },
      children: [
        {
          path: 'purchase/list',
          component: () => import('@/views/apSupplierInvoice/purchase/list'),
          name: 'FinanceInvoicePurchaseList',
          meta: { title: '采购发票', icon: 'table' }
        },
        {
          path: 'purchase/detail',
          component: () => import('@/views/apSupplierInvoice/purchase/detail'),
          name: 'FinanceInvoicePurchaseDetail',
          hidden: true,
          meta: { title: '采购发票详情', icon: 'table' }
        }
      ]
    },
    {
      path: '',
      component: () => import('@/views/stm/supplier'),
      name: 'FinanceStmSupplier',
      meta: { title: '供应商结算管理', icon: 'table' },
      children: [
        {
          path: 'stm/supplier/chk/list',
          component: () => import('@/views/stm/supplier/chk/list'),
          name: 'FinanceStmSupplierChkList',
          meta: { title: '收货对账', icon: 'table' }
        },
        {
          path: 'stm/supplier/chk/detail',
          hidden: true,
          component: () => import('@/views/stm/supplier/chk/detail'),
          name: 'FinanceStmSupplierChkDeatil',
          meta: { title: '对账单详情', icon: 'table' }
        },
        {
          path: 'stm/supplier/jx/list',
          component: () => import('@/views/stm/supplier/jx/list'),
          name: 'FinanceStmSupplierJxList',
          meta: { title: '经销结算', icon: 'table' }
        },
        {
          path: 'stm/supplier/jx/detail',
          hidden: true,
          component: () => import('@/views/stm/supplier/jx/detail'),
          name: 'FinanceStmSupplierJxDeatil',
          meta: { title: '结算单详情', icon: 'table' }
        },
        {
          path: 'stm/supplier/dx/list',
          component: () => import('@/views/stm/supplier/dx/list'),
          name: 'FinanceStmSupplierDxList',
          meta: { title: '付款申请单', icon: 'table' }
        },
        {
          path: 'stm/supplier/dx/detail',
          component: () => import('@/views/stm/supplier/dx/detail'),
          name: 'FinanceStmSupplierDxDeatil',
          meta: { title: '付款申请单详情', icon: 'table' },
          hidden: true
        }
      ]
    },
    {
      path: 'accountCycleConfig',
      component: () => import('@/views/accountCycleConfig'),
      name: 'FinanceAccountCycleConfig',
      meta: { title: '会计期间设置', icon: 'table' }
    },
    {
      path: 'accountCycleConfig/edit',
      component: () => import('@/views/accountCycleConfig/edit'),
      name: 'FinanceAccountCycleConfigEdit',
      meta: { title: '会计期间设置变更', icon: 'table' },
      hidden: true
    },
    { // 成本核算方式设置
      path: 'costAccountingConfig',
      component: () => import('@/views/costAccountingConfig'),
      name: 'FinanceCostAccountingConfig',
      meta: { title: '成本核算方式设置', icon: 'table' }
    },
    {
      path: 'financeStockAmountAdjust',
      component: () => import('@/views/financeStockAmountAdjust'),
      name: 'FinanceStockAmountAdjust',
      meta: { title: '库存金额调整单', icon: 'table' }
    },
    {
      path: 'financeStockAmountAdjustAdd/:newMerchantId',
      component: () => import('@/views/financeStockAmountAdjust/add'),
      name: 'FinanceStockAmountAdjustAdd',
      meta: { title: '库存金额调整单-新增', icon: 'table' },
      hidden: true
    },
    {
      path: 'financeStockAmountAdjustDetails/:adjustCode',
      component: () => import('@/views/financeStockAmountAdjust/details'),
      name: 'FinanceStockAmountAdjustDetails',
      meta: { title: '库存金额调整单-详情', icon: 'table' },
      hidden: true
    },
    {
      path: 'financeStockAmountAdjustEdit/:adjustCode',
      component: () => import('@/views/financeStockAmountAdjust/edit'),
      name: 'FinanceStockAmountAdjustEdit',
      meta: { title: '库存金额调整单-编辑', icon: 'table' },
      hidden: true
    },
    {
      path: 'apSupplierInvoice/supplier',
      component: () => import('@/views/apSupplierInvoice/supplier'),
      name: 'FinanceApSupplierInvoice',
      meta: { title: '供应商发票管理', icon: 'table' }
    },
    {
      path: 'apSupplierInvoice/supplier/detail',
      component: () => import('@/views/apSupplierInvoice/supplier/detail'),
      name: 'FinanceApSupplierInvoiceDetail',
      meta: { title: '供应商发票管理详情', icon: 'table' },
      hidden: true
    },
    {
      path: 'finInventoryMwaCost',
      component: () => import('@/views/finInventoryMwaCost'),
      name: 'FinInventoryMwaCost',
      meta: { title: '库存成本异动查询', icon: 'table' }
    },
    {
      path: 'finInventoryMwaCostSummary',
      component: () => import('@/views/finInventoryMwaCostSummary'),
      name: 'FinInventoryMwaCostSummary',
      meta: { title: '库存成本查询', icon: 'table' }
    },
    {
      path: 'finInventoryMonthlyLog',
      component: () => import('@/views/finInventoryMonthlyLog'),
      name: 'FinanceInventoryMonthlyLog',
      meta: { title: '期末月结执行情况', icon: 'table' }
    },
    {
      path: 'payment-method',
      component: () => import('@/views/payment-method'),
      name: 'FinancePaymentMethod',
      meta: { title: '支付方式设置', icon: 'table' }
    },
    {
      path: 'cash-out',
      component: () => import('@/views/cash-out'),
      name: 'FinanceCashOut',
      meta: { title: '提现管理', icon: 'table' }
    },
    {
      path: 'cash-out-records',
      component: () => import('@/views/cash-out-records'),
      name: 'FinanceCashOutRecords',
      meta: { title: '付款记录', icon: 'table' }
    },
    {
      path: 'arPaymentVoucher/list',
      component: () => import('@/views/arPaymentVoucher/list'),
      name: 'ArPaymentVoucherList',
      meta: {
        title: '收款单'
      }
    },
    {
      path: 'arPaymentVoucher/detail/:id',
      name: 'ArPaymentVoucherDetail',
      component: () => import('@/views/arPaymentVoucher/detail'),
      meta: {
        title: '收款单详情'
      },
      hidden: true
    },
    {
      path: 'finSo/list',
      component: () => import('@/views/finSo/list'),
      name: 'FinSoList',
      meta: {
        title: '销售报表'
      }
    },
    {
      path: 'finSoItem/list',
      component: () => import('@/views/finSoItem/list'),
      name: 'FinSoItemList',
      meta: {
        title: '销售明细报表'
      }
    },
    {
      path: 'soSummary',
      component: () => import('@/views/soSummary'),
      name: 'SoSummary',
      meta: { title: '销售单汇总', icon: 'table' }
    },
    {
      path: 'soSummary/flow',
      component: () => import('@/views/soSummary/flow'),
      name: 'SoSummaryFlow',
      meta: { title: '销售单汇总明细', icon: 'table' }
    },
    {
      path: 'consignment/list',
      component: () => import('@/views/apSupplierInvoice/consignment/list'),
      name: 'FinanceInvoiceSoBillList',
      meta: { title: '代销发票', icon: 'table' }
    },
    {
      path: 'consignment/detail',
      component: () => import('@/views/apSupplierInvoice/consignment/detail'),
      name: 'FinanceInvoiceSoBillDetail',
      hidden: true,
      meta: { title: '代销发票详情', icon: 'table' }
    }
  ]
}
