export default {
  'add': {
    'url': '/social-back-web/live/add',
    'method': 'post',
    'params': {}
  },
  'update': {
    'url': '/social-back-web/live/update',
    'method': 'post',
    'params': {
      'id': ''
    }
  },
  'listPage': {
    'url': '/social-back-web/live/listPage',
    'method': 'post',
    'params': {}
  },
  'getById': {
    'url': '/social-back-web/live/getById',
    'method': 'get',
    'params': {
      'id': ''
    }
  },
  'downloadTemplate': {
    'url': '/ouser/excelFile/liveTemplate.xlsx',
    'method': 'post',
    'params': {}
  },
  'importData': {
    'url': '/social-back-web/live/importData',
    'method': 'post',
    'params': {}
  },
  'exportData': {
    'url': '/social-back-web/live/exportData',
    'method': 'post',
    'params': {}
  },
  'delete': {
    'url': '/social-back-web/live/delete',
    'method': 'post'
  }
}
