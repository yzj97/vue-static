const baseUrl = 'back-product-web/back/stock'
/**
 * 库存接口
 */
export default {
  aa: {
    url: baseUrl + ''
  },
  // 获取店铺映射的虚拟id
  getStoreWarehouseById: {
    url: baseUrl + '/storeWarehouse/getStoreWarehouseById.do',
    method: 'post',
    params: {
      // "id":"1910090000048227"
    }
  },
  // 保存仓库-门店仓
  saveStoreStoreWarehouse: {
    url: baseUrl + '/storeWarehouse/STORE/saveStoreWarehouse.do',
    method: 'post'
  },
  // 保存仓库-中心仓
  saveStoreCenterWarehouse: {
    url: baseUrl + '/storeWarehouse/CENTER/saveStoreWarehouse.do',
    method: 'post'
  },
  // 保存拟合仓数据
  saveStoreWarehouse: {
    url: baseUrl + '/storeWarehouse/VIRTUAL/saveStoreWarehouse.do',
    method: 'post'
  },
  // 分页查询实体库存
  listImWarehouseRealStockByPage: {
    url: baseUrl + '/stock/listImWarehouseRealStockByPage.do',
    method: 'post'
  },
  // 分页查询店铺库存
  listImVirtualChannelStockByPage: {
    url: baseUrl + '/stock/listImVirtualChannelStockByPage.do',
    method: 'post'
  },
  // 分页查询实体库存流水
  listImWarehouseStockJournalRecordByPage: {
    url: baseUrl + '/stock/listImWarehouseStockJournalRecordByPage.do',
    method: 'post'
  },
  // 分页查询库存领用单列表
  listReceiveUseBillByPage: {
    url: baseUrl + '/imReceiveUseBill/listReceiveUseBillByPage.do',
    method: 'post'
  },
  // 根据入参查询仓库
  listStoreWarehouseByParam: {
    url: baseUrl + '/storeWarehouse/listStoreWarehouseByParam.do',
    method: 'post'
  },
  // 新增领用单
  saveReceiveUseBill: {
    url: baseUrl + '/imReceiveUseBill/saveReceiveUseBill.do',
    method: 'post'
  },
  // 查询领用单明细
  getReceiveUseBillDetail: {
    url: baseUrl + '/imReceiveUseBill/getReceiveUseBillDetail.do',
    method: 'post'
  },
  // 领用单-添加商品分页查询
  listReceiveUseBillMpByPage: {
    url: baseUrl + '/imReceiveUseBill/listReceiveUseBillMpByPage.do',
    method: 'post'
  },
  // 更新领用单
  updateReceiveUseBill: {
    url: baseUrl + '/imReceiveUseBill/updateReceiveUseBill.do',
    method: 'post'
  },
  // 提交审核库存领用单
  submitAudit: {
    url: baseUrl + '/imReceiveUseBill/submitAudit.do',
    method: 'post'
  },
  // 出库
  stockOut: {
    url: baseUrl + '/imReceiveUseBill/stockOut.do',
    method: 'post'
  },
  // 取消(库存解冻)
  cancelReceiveUseBill: {
    url: baseUrl + '/imReceiveUseBill/cancelReceiveUseBill.do',
    method: 'post'
  },
  // 红冲
  redRush: {
    url: baseUrl + '/imReceiveUseBill/redRush.do',
    method: 'post'
  },
  // 分页查询期间汇总报表
  listImReceiveUseBillCycleReportByPage: {
    url:
      baseUrl +
      '/imReceiveUseBillReport/listImReceiveUseBillCycleReportByPage.do',
    method: 'post'
  },
  // 分页查询日汇总报表
  listImReceiveUseBillDailyByPage: {
    url: baseUrl + '/imReceiveUseBillReport/listImReceiveUseBillDailyByPage.do',
    method: 'post'
  },
  // 分页查询库内事务单据
  listImInventoryAdjustmentBillByPage: {
    url: baseUrl + '/stock/listImInventoryAdjustmentBillByPage.do',
    method: 'post'
  },
  // 查询库内事务单据明细
  getInventoryAdjustmentBillDetails: {
    url: baseUrl + '/stock/getImInventoryAdjustmentBillById.do',
    method: 'post'
  },
  // 保存库内事务单据表头
  saveImInventoryAdjustmentBill: {
    url: baseUrl + '/stock/saveImInventoryAdjustmentBill.do',
    method: 'post'
  },
  // 保存库内事务单据行
  saveImInventoryAdjustmentBillItem: {
    url: baseUrl + '/stock/batchSaveImInventoryAdjustmentBillItem.do',
    method: 'post'
  },
  // 保存库内事务明细
  updateImInventoryAdjustmentBill: {
    url: baseUrl + '/stock/updateImInventoryAdjustmentBill.do',
    method: 'post'
  },
  // 完成库内事务
  completeInventoryAdjustmentBill: {
    url: baseUrl + '/stock/updateImInventoryAdjustmentBillForComplete.do',
    method: 'post'
  },
  // 批量删除库内事务明细
  batchDeleteImInventoryAdjustmentBillItem: {
    url: baseUrl + '/stock/batchDeleteImInventoryAdjustmentBillItem.do',
    method: 'post'
  },
  // 查询拟合仓
  listStoreWarehouseWithPage: {
    url: baseUrl + '/storeWarehouse/listStoreWarehouseWithPage.do',
    method: 'post'
  },
  // 查询虚拟仓库库存
  listImVirtualWarehouseStockByPage: {
    url: baseUrl + '/stock/listImVirtualWarehouseStockByPage.do',
    method: 'post'
  },
  // 分页查询盘点列表
  listImInventoryPage: {
    url: baseUrl + '/imInventory/listImInventoryPage.do',
    method: 'post'
  },
  // 盘点确认差异
  imInventoryRealityStock: {
    url: baseUrl + '/imInventory/imInventoryRealityStock.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 批量删除盘点信息
  batchDeleteImInventory: {
    url: baseUrl + '/imInventory/batchDeleteImInventory.do',
    method: 'post'
  },
  // 保存盘点表头
  saveImInventory: {
    url: baseUrl + '/imInventory/saveImInventory.do',
    method: 'post'
  },
  // 批量删除盘点详细列表
  batchDeleteImInventoryDetail: {
    url: baseUrl + '/imInventory/batchDeleteImInventoryDetail.do',
    method: 'post'
  },
  // 查询盘点详细列表
  listImInventoryDetailPage: {
    url: baseUrl + '/imInventory/listImInventoryDetailPage.do',
    method: 'post'
  },
  // 新增盘点详细列表
  batchSaveImInventoryDetail: {
    url: baseUrl + '/imInventory/batchSaveImInventoryDetail.do',
    method: 'post'
  },
  // 查询商家盘点商品
  listInventoryMerchantProductPage: {
    url: baseUrl + '/imInventory/listInventoryMerchantProductPage.do',
    method: 'post'
  },
  // 保存实盘数量
  batchUpdateImInventoryDetail: {
    url: baseUrl + '/imInventory/batchUpdateImInventoryDetail.do',
    method: 'post'
  },
  // 分页查询商品拟合库存同步规则
  listImVirtualWarehouseMpSyncRuleByPage: {
    url:
      baseUrl +
      '/imVirtualWarehouseMpSyncRule/listImVirtualWarehouseMpSyncRuleByPage.do',
    method: 'post'
  },
  // 商品拟合库存同步规则新增或修改
  saveImVirtualWarehouseMpSyncRule: {
    url:
      baseUrl +
      '/imVirtualWarehouseMpSyncRule/saveImVirtualWarehouseMpSyncRule.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 商品拟合库存同步规则删除
  deleteImVirtualWarehouseMpSyncRule: {
    url:
      baseUrl +
      '/imVirtualWarehouseMpSyncRule/deleteImVirtualWarehouseMpSyncRule.do',
    method: 'post'
  },
  // 商品拟合库存同步规则明细获取
  getImVirtualWarehouseMpSyncRule: {
    url:
      baseUrl +
      '/imVirtualWarehouseMpSyncRule/getImVirtualWarehouseMpSyncRule.do',
    method: 'post'
  },
  // 分页查询商品实体库存同步规则
  listImWarehouseMpSyncRuleByPage: {
    url: baseUrl + '/imWarehouseMpSyncRule/listImWarehouseMpSyncRuleByPage.do',
    method: 'post'
  },
  // 商品实体库存同步规则新增或修改
  saveImWarehouseMpSyncRule: {
    url: baseUrl + '/imWarehouseMpSyncRule/saveImWarehouseMpSyncRule.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  // 商品实体库存同步规则删除
  deleteImWarehouseMpSyncRule: {
    url: baseUrl + '/imWarehouseMpSyncRule/deleteImWarehouseMpSyncRule.do',
    method: 'post'
  },
  // 商品实体库存同步规则明细获取
  getImWarehouseMpSyncRule: {
    url: baseUrl + '/imWarehouseMpSyncRule/getImWarehouseMpSyncRule.do',
    method: 'post'
  },
  // 盘点计划列表
  queryInventoryPlanList: {
    url: baseUrl + '/imInventoryPlan/queryInventoryPlanList.do',
    method: 'post'
  },
  queryInventoryStatusCount: {
    url: baseUrl + '/imInventoryPlan/queryInventoryStatusCount.do',
    method: 'post'
  },
  queryInventoryPlanDetailList: {
    url: baseUrl + '/imInventoryPlan/queryInventoryPlanDetailList.do',
    method: 'post'
  },
  queryInventoryPlanById: {
    url: baseUrl + '/imInventoryPlan/getById.do',
    method: 'get',
    params: {
      id: ''
    }
  },
  saveOrUpdateInventoryPlan: {
    url: baseUrl + '/imInventoryPlan/saveOrUpdate.do',
    method: 'post'
  },
  submitInventoryPlan: {
    url: baseUrl + '/imInventoryPlan/submit.do',
    method: 'post'
  },
  cancelInventoryPlan: {
    url: baseUrl + '/imInventoryPlan/batchCancel.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  doneInventoryPlan: {
    url: baseUrl + '/imInventoryPlan/done.do',
    method: 'post'
  },
  imBatchWarehouseRealStock: {
    'url': baseUrl + '/imBatchWarehouseRealStock/listPage.do',
    'method': 'post'
  },
  imWarehouseStockBatchJournalRecord: {
    'url': baseUrl + '/imWarehouseStockBatchJournalRecord/listPage.do',
    'method': 'post'
  },
  imBatchWarehouseRealStockExport: {
    'url': baseUrl + '/imBatchWarehouseRealStock/exportData.do',
    'method': 'post'
  },
  imWarehouseStockBatchJournalRecordExport: {
    'url': baseUrl + '/imWarehouseStockBatchJournalRecord/exportData.do',
    'method': 'post'
  },
  getStockDetail: {
    url: baseUrl + '/storeWarehouse/get.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  inventoryWarningEmail: {
    'url': '/back-product-web',
    'method': 'post'
  },
  inventoryWarningEmailAdd: {
    'url': '/back-product-web/stockWarningEmail/add',
    'method': 'post'
  },
  inventoryWarningEmailEdit: {
    'url': '/back-product-web/stockWarningEmail/update',
    'method': 'post'
  },
  inventoryWarningEmailDel: {
    'url': '/back-product-web/stockWarningEmail/delete',
    'method': 'post'
  },
  inventoryWarningEmailEnable: {
    'url': '/back-product-web/stockWarningEmail/isEable',
    'method': 'post'
  }
}
