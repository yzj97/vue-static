/**
 * 库存常量
 */
export default {
  // 单据审核状态:0-待提交;1-待审核;2-审核通过;3-审核不通过;
  IM_RECEIVE_USE_BILL_BILL_AUDIT_STATUS: { 0: '待提交', 1: '待审核', 2: '审核通过', 3: '审核不通过' },
  // 单据状态:0-待确认;1-待处理;2-已完成;3-已取消;4-已冲红;
  IM_RECEIVE_USE_BILL_BILL_STATUS: { 0: '待确认', 1: '待处理', 2: '已完成', 3: '已取消', 4: '已冲红' },
  // 单据类型:JHLYO-计划领用;LXLYO-零星领用;
  IM_RECEIVE_USE_BILL_BILL_TYPE: { 'JHLYO': '计划领用', 'LXLYO': '零星领用' },
  // 库内事务单据
  INVENTORY_ADJUSTMENT_BILL_TYPE: { 'MOI': '杂项出入', 'CAOI': 'WMS盘点', 'SKOI': 'WMS库存调整', 'PDOI': '盘点' },
  INVENTORY_ADJUSTMENT_BILL_STATUS: { 0: '待确认', 1: '待处理', 2: '已完成', 3: '已取消' },
  INVENTORY_ADJUSTMENT_STOCK_PROCESS_TYPE: { 0: '期初', 3: '成本更新', 4: '入库', 5: '出库' }
}
