export default {
  queryPlatformAuthStorePage: {
    url: '/ouser-web/api/store/queryPlatformAuthStorePage.do',
    method: 'post',
    params: {
      'currentPage': 1,
      'itemsPerPage': 1000
    }
  }
}
