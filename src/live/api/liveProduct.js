export default {
  'add': {
    'url': '/live-web/liveProduct/add',
    'method': 'post',
    'params': {}
  },
  'batchAdd': {
    'url': '/live-web/liveProduct/batchAdd',
    'method': 'post'
  },
  'update': {
    'url': '/live-web/liveProduct/update',
    'method': 'post',
    'params': {
      'id': ''
    }
  },
  'listPage': {
    'url': '/live-web/liveProduct/listPage',
    'method': 'post',
    'params': {}
  },
  'getById': {
    'url': '/live-web/liveProduct/getById',
    'method': 'get',
    'params': {
      'id': ''
    }
  },
  'delete': {
    'url': '/live-web/liveProduct/delete',
    'method': 'post'
  },
  'batchOnOffShelve': {
    'url': '/live-web/liveProduct/batchOnOffShelve',
    'method': 'post'
  },
  countProduct: {
    url: '/live-web/liveProduct/countProduct',
    method: 'get'
  }
}
