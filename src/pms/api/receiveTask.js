export default {
  add: {
    'url': '/pms-web/receiveTask/add',
    'method': 'post',
    'params': {}
  },
  update: {
    url: '/pms-web/receiveTask/update',
    method: 'post',
    params: {
      'id': ''
    }
  },
  'listPage': {
    'url': '/pms-web/receiveTask/listPage',
    'method': 'post',
    'params': {}
  },
  getById: {
    url: '/pms-web/receiveTask/getById',
    method: 'get',
    params: {
      id: ''
    }
  },
  'downloadTemplate': {
    'url': '/pms/excelFile/receiveTaskTemplate.xlsx',
    'method': 'post',
    'params': {}
  },
  'importData': {
    'url': '/pms-web/receiveTask/importData',
    'method': 'post',
    'params': {}
  },
  'exportData': {
    'url': '/pms-web/receiveTask/exportData',
    'method': 'post',
    'params': {}
  },
  delete: {
    url: '/pms-web/receiveTask/delete',
    method: 'post'
  },
  listMultiCode: {
    url: 'pms-web/code/listMulti',
    method: 'post'
  },
  batchCancel: {
    url: '/pms-web/receiveTask/batchCancel',
    method: 'post'
  },
  oneKeyAddReceive: {
    url: '/pms-web/receiveRecord/oneKeyAddReceive',
    method: 'post'
  },
  getByReceiveCode: {
    url: '/pms-web/receiveTask/getByReceiveCode',
    method: 'get',
    params: {
      receiveCode: ''
    }
  },
  /* 收货单详情->商品明细 */
  receiveItemListPage: {
    url: 'pms-web/receiveTaskItem/listPage',
    method: 'post'
  },
  confirmReceive: {
    url: '/pms-web/receiveRecord/add',
    method: 'post'
  },
  countByReceiveStatus: {
    url: 'pms-web/receiveTask/countByReceiveStatus',
    method: 'post'
  }
}
