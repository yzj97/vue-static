// 商家平台-库存中心
export default {
  path: '/back-product-static/merchant/stock',
  name: 'merchant-stock',
  meta: {
    title: '库存中心',
    icon: 'table'
  },
  children: [
    {
      path: 'store-warehouse-manage-mapping/:warehouseId/:merchantId/:warehouseType/:warehouseName/:warehouseCode', // status 0 = add, 1 = edit, 2 = view
      name: 'StoreWarehouseManageMapping',
      component: () => import('@/views/merchant/stock/store-warehouse-manage/mapping'),
      hidden: true,
      meta: { title: '库存同步' }
    },
    {
      path: 'store-warehouse-manage-edit/:id/:merchantId/:warehouseType/:status', // status 0 = add, 1 = edit, 2 = view
      name: 'StoreWarehouseManageEdit',
      component: () => import('@/views/merchant/stock/store-warehouse-manage/edit'),
      hidden: true,
      meta: { title: '仓库编辑' }
    },
    {
      path: 'store-warehouse-manage-add/:status', // status 0 = add, 1 = edit, 2 = view
      name: 'StoreWarehouseManageAdd',
      component: () => import('@/views/merchant/stock/store-warehouse-manage/edit'),
      hidden: true,
      meta: { title: '仓库新增' }
    },
    {
      path: 'store-warehouse-manage-list',
      name: 'StoreWarehouseManageList',
      component: () => import('@/views/merchant/stock/store-warehouse-manage/list'),
      meta: { title: '仓库管理' }
    },
    {
      path: 'fittingHouseManage',
      name: 'StockFittingHouseManage',
      redirect: '/back-product-static/merchant/stock/fittingHouseManage/list',
      component: () => import('@/views/blank'),
      meta: { title: '拟合仓管理' },
      children: [
        {
          path: 'list',
          component: () =>
            import('@/views/merchant/stock/fittingHouseManage/list'),
          name: 'StockFittingHouseManageList',
          meta: { title: '拟合仓列表' }
        }
      ]
    },
    {
      path: 'receiveUseBill',
      name: 'Stock2001',
      redirect: '/back-product-static/merchant/stock/receiveUseBill/list',
      component: () => import('@/views/merchant/stock/receiveUseBill'),
      meta: { title: '领用单' },
      children: [
        {
          path: 'list',
          component: () => import('@/views/merchant/stock/receiveUseBill/list'),
          name: 'Stock200101',
          meta: { title: '领用单列表' }
        },
        {
          path: 'edit',
          component: () => import('@/views/merchant/stock/receiveUseBill/edit'),
          name: 'Stock200102',
          meta: { title: '领用单详情' },
          hidden: true
        }
      ]
    },
    {
      path: 'receiveUseBillReport',
      name: 'Stock2002',
      redirect: '/back-product-static/merchant/stock/receiveUseBillReport/list',
      component: () => import('@/views/blank'),
      meta: {
        title: '商品领用查询'
      },
      children: [
        {
          path: 'list',
          component: () =>
            import('@/views/merchant/stock/receiveUseBillReport/list'),
          name: 'Stock200201',
          meta: {
            title: '商品领用查询列表'
          }
        }
      ]
    },
    {
      path: '',
      name: 'InventoryAdjustmentBill',
      component: () => import('@/views/merchant/stock/inventoryAdjustment'),
      meta: { title: '库内事务单据', icon: 'table' },
      children: [
        {
          path: 'merchant/stock/inventoryAdjustment/list',
          component: () =>
            import('@/views/merchant/stock/inventoryAdjustment/list'),
          name: 'InventoryAdjustmentBillList',
          meta: { title: '库内事务单据', icon: 'table' }
        },
        {
          path: 'merchant/stock/inventoryAdjustment/edit/:id/:viewStatus',
          component: () =>
            import('@/views/merchant/stock/inventoryAdjustment/edit'),
          name: 'InventoryAdjustmentBillEdit',
          meta: { title: '库内事务单据', icon: 'table' },
          hidden: true
        }
      ]
    },
    {
      path: 'imVirtualChannelStockManage',
      name: 'ImVirtualChannelStockManage',
      component: () =>
        import('@/views/merchant/stock/imVirtualChannelStockManage'),
      meta: { title: '店铺库存管理' }
    },
    {
      path: 'imWarehouseRealStockManage',
      name: 'ImWarehouseRealStockManage',
      component: () =>
        import('@/views/merchant/stock/imWarehouseRealStockManage'),
      meta: { title: '仓库库存管理' }
    },
    {
      path: 'stockTurnoverManage',
      name: 'StockTurnoverManage',
      component: () => import('@/views/merchant/stock/stockTurnoverManage'),
      meta: { title: '仓库库存异动明细' }
    },
    {
      path: 'virtualWarehouseStock',
      name: 'VirtualWarehouseStockList',
      component: () => import('@/views/merchant/stock/virtualWarehouseStock'),
      meta: { title: '拟合库存管理' }
    },
    {
      path: '',
      name: 'StockInventory',
      hidden: true, // 隐藏老的盘点菜单
      component: () => import('@/views/merchant/stock/stockInventory'),
      meta: { title: '盘点', icon: 'table' },
      children: [
        {
          path: 'merchant/stock/stockInventory/list',
          component: () => import('@/views/merchant/stock/stockInventory/list'),
          name: 'StockInventoryList',
          meta: { title: '盘点', icon: 'table' }
        },
        {
          path: 'merchant/stock/stockInventory/edit/:id',
          component: () => import('@/views/merchant/stock/stockInventory/edit'),
          name: 'StockInventoryEdit',
          meta: { title: '盘点详情', icon: 'table' },
          hidden: true
        },
        {
          path: 'merchant/stock/stockInventory/save',
          component: () => import('@/views/merchant/stock/stockInventory/save'),
          name: 'StockInventorySave',
          meta: { title: '盘点新增', icon: 'table' },
          hidden: true
        }
      ]
    },
    {
      path: 'Stock2003',
      component: () => import('@/views/merchant/stock/virWhMpSyncRule/list'),
      name: 'Stock2003',
      meta: {
        title: '商品拟合库存同步'
      }
    },
    {
      path: 'virWhMpSyncRuleEdit/:merchantId/:virtualWarehouseId/:mpId/:edit',
      component: () => import('@/views/merchant/stock/virWhMpSyncRule/edit'),
      name: 'virWhMpSyncRuleEdit',
      meta: {
        title: '商品拟合库存同步规则编辑'
      },
      hidden: true
    },
    {
      path: 'virWhMpSyncRuleNew',
      component: () => import('@/views/merchant/stock/virWhMpSyncRule/edit'),
      name: 'virWhMpSyncRuleNew',
      meta: {
        title: '商品拟合库存同步规则新增'
      },
      hidden: true
    },
    {
      path: 'Stock2004',
      component: () => import('@/views/merchant/stock/whMpSyncRule/list'),
      name: 'Stock2004',
      meta: {
        title: '商品实体库存同步'
      }
    },
    {
      path: 'whMpSyncRuleEdit/:edit/:merchantId/:warehouseId/:mpId/:warehouseType/:virtualWarehouseId',
      component: () => import('@/views/merchant/stock/whMpSyncRule/edit'),
      name: 'whMpSyncRuleEdit',
      meta: {
        title: '商品实体库存同步规则编辑'
      },
      hidden: true
    },
    {
      path: 'whMpSyncRuleNew',
      component: () => import('@/views/merchant/stock/whMpSyncRule/edit'),
      name: 'whMpSyncRuleNew',
      meta: {
        title: '商品实体库存同步规则新增'
      },
      hidden: true
    },
    {
      path: 'merchant/stock/imInventoryPlan',
      component: () => import('@/views/merchant/stock/imInventoryPlan'),
      name: 'ImInventoryPlan',
      meta: {
        title: '盘点'
      }
    },
    {
      path: 'merchant/stock/imInventoryPlan/add/:id',
      component: () => import('@/views/merchant/stock/imInventoryPlan/add'),
      name: 'ImInventoryPlanAdd',
      meta: {
        title: '盘点新增/编辑'
      },
      hidden: true
    },
    {
      path: 'merchant/stock/imInventoryPlan/edit/:id/:isEdit',
      component: () => import('@/views/merchant/stock/imInventoryPlan/edit'),
      name: 'ImInventoryPlanEdit',
      meta: {
        title: '盘点'
      },
      hidden: true
    },
    {
      path: 'merchant/stock/imInventoryPlan/edit/:id/:isEdit',
      component: () => import('@/views/merchant/stock/imInventoryPlan/edit'),
      name: 'ImInventoryPlanView',
      meta: {
        title: '查看盘点'
      },
      hidden: true
    },
    {
      path: 'merchant/stock/imBatchWarehouseRealStock/list',
      component: () => import('@/views/merchant/stock/imBatchWarehouseRealStock/list'),
      name: 'ImBatchWarehouseRealStockList',
      meta: {
        title: '商品批次库存管理'
      }
    },
    {
      path: 'merchant/stock/imWarehouseStockBatchJournalRecord/list',
      component: () => import('@/views/merchant/stock/imWarehouseStockBatchJournalRecord/list'),
      name: 'ImWarehouseStockBatchJournalRecordList',
      meta: {
        title: '商品批次库存异动明细'
      }
    },
    {
      path: 'batchStrategy/list',
      component: () => import('@/views/merchant/stock/batchStrategy/list'),
      name: 'BatchStrategyList',
      meta: {
        title: '批次策略管理'
      }
    },
    {
      path: 'batchStrategy/:operate',
      name: 'BatchStrategyAdd',
      component: () => import('@/views/merchant/stock/batchStrategy/add'),
      meta: {
        title: '新增批次策略'
      },
      hidden: true
    },
    {
      path: 'batchStrategy/:operate/:id',
      name: 'BatchStrategyEdit',
      component: () => import('@/views/merchant/stock/batchStrategy/edit'),
      meta: {
        title: '编辑批次策略'
      },
      hidden: true
    },
    {
      path: 'batchStrategy/:operate/:id',
      name: 'BatchStrategyDetail',
      component: () => import('@/views/merchant/stock/batchStrategy/edit'),
      meta: {
        title: '查看批次策略'
      },
      hidden: true
    },
    {
      path: 'inventoryWarningEmail',
      name: 'InventoryWarningEmail',
      component: () => import('@/views/merchant/stock/inventoryWarningEmail/index'),
      meta: {
        title: '库存预警邮箱配置'
      },
      hidden: false
    }
  ]
}
