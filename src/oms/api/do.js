/* do */
export default {
  /* 交货单设置 */
  transOrdersListListPage: {
    url: 'oms-web/do/listPage',
    method: 'post'
  },
  transOrdersListExport: {
    url: 'oms-web/do/export',
    method: 'post'
  },
  transOrdersListImport: {
    url: 'oms-web/do/import',
    method: 'post'
  },
  transOrdersListGet: {
    url: 'oms-web/do/get',
    method: 'post'
  },
  transOrdersListGetByDoCode: {
    url: 'oms-web/do/getByDoCode',
    method: 'get'
  },
  transOrdersPackageList: {
    url: 'oms-web/do/list',
    method: 'post'
  },
  transOrdersDetailCancel: {
    url: 'oms-web/do/cancelDo',
    method: 'get'
  },
  transOrdersListConfirmDelivery: {
    url: 'oms-web/do/confirmDelivery',
    method: 'post'
  },
  transOrdersListUpdateDoRemark: {
    url: 'oms-web/do/updateRemark',
    method: 'post'
  },
  batchCancelDo: {
    url: 'oms-web/do/batchCancelDo',
    method: 'post'
  }
}
