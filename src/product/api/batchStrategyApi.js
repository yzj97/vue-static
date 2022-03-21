const baseUrl = 'back-product-web/back/stock'

export default {
  'saveOrUpdate': {
    'url': baseUrl + '/batchStrategy/saveOrUpdate',
    'method': 'post',
    'params': {}
  },
  'listPage': {
    'url': baseUrl + '/batchStrategy/list',
    'method': 'post',
    'params': {}
  },
  'get': {
    'url': baseUrl + '/batchStrategy/get',
    'method': 'post',
    'params': {}
  },
  'delete': {
    'url': baseUrl + '/batchStrategy/delete',
    'method': 'post'
  }
}
