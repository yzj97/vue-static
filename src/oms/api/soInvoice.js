/* soInvoice */
export default {
  /* 发票信息 */
  orderInvoiceInfoListListPage: {
    url: 'oms-web/soInvoice/listPage',
    method: 'post'
  },
  orderInvoiceInfoListUpdateFields: {
    url: 'oms-web/soInvoice/updateFields',
    method: 'post'
  },
  orderInvoiceInfoListExport: {
    url: 'oms-web/soInvoice/export',
    method: 'post'
  },
  orderInvoiceInfoListImport: {
    url: 'oms-web/soInvoice/import',
    method: 'post'
  },
  orderInvoiceInfoListGet: {
    url: 'oms-web/soInvoice/get',
    method: 'post'
  },
  orderInvoiceInfoDetailGet: {
    url: 'oms-web/soInvoice/getByOrder',
    method: 'post'
  },
  orderInvoiceInfoListUpdateListFields: {
    url: 'oms-web/soInvoice/updateListFields',
    method: 'post'
  },
  /* 订单管理 ->订单列表->订单详情->发票信息 */
  soInvoiceListWithItem: {
    url: 'oms-web/soInvoice/listWithItem',
    method: 'post'
  }
}
