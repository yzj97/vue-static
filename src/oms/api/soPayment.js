/* soPayment */
export default {
  /* 订单管理 ->订单列表->订单详情->支付信息 */
  orderSoPaymentList: {
    url: 'oms-web/soPayment/list',
    method: 'post'
  },
  // 查询支付数据
  queryArOffineOrderList: {
    url: 'back-finance-web/arOffinePaymentVoucher/queryArOffineOrderList.do',
    method: 'post'
  },
  // 查询账户信息
  queryMerchantAccountInfo: {
    url: 'back-finance-web/arOffinePaymentVoucher/queryMerchantAccountInfo.do',
    method: 'post'
  },
  // 上传支付凭证
  insertArPaymentVoucher: {
    url: 'back-finance-web/arOffinePaymentVoucher/insertArPaymentVoucher.do',
    method: 'post'
  },
  // 上传附件
  uploadAttachFile: {
    url: 'back-finance-web/baseAttachFile/createFile.do',
    method: 'post'
  },
  // 查询附件
  selectAttachList: {
    url: 'back-finance-web/baseAttachFile/selectFileList.do',
    method: 'post'
  },
  // 删除附件
  deleteAttach: {
    url: 'back-finance-web/baseAttachFile/deleteFile.do',
    method: 'post'
  }
}
