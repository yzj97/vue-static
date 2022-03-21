export default {
  'add': {
    'url': '/live-web/liveReport/add',
    'method': 'post',
    'params': {}
  },
  'update': {
    'url': '/live-web/liveReport/update',
    'method': 'post',
    'params': {
      'id': ''
    }
  },
  'listPage': {
    'url': '/live-web/liveReport/listPage',
    'method': 'post',
    'params': {}
  },
  'getById': {
    'url': '/live-web/liveReport/getById',
    'method': 'get',
    'params': {
      'id': ''
    }
  },
  'delete': {
    'url': '/live-web/liveReport/delete',
    'method': 'post'
  },
  'downloadTemplate': {
    'url': '/live/excelFile/liveReportTemplate.xlsx',
    'method': 'post',
    'params': {}
  },
  'importData': {
    'url': '/live-web/liveReport/importData',
    'method': 'post',
    'params': {}
  },
  'exportData': {
    'url': '/live-web/liveReport/exportData',
    'method': 'post',
    'params': {}
  }
}
