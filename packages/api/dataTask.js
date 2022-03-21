export default {
  dataTask_listPage: {
    url: 'back-product-web/public/data/task/listPage',
    method: 'post'
  },
  dataTask_listPageWithDataAuth: {
    url: 'back-product-web/public/data/task/listPage?filterDataAuth=true',
    method: 'post'
  },
  asyncImportTask: {
    url: 'back-product-web/back/import/task/getList.do',
    method: 'post'
  },
  asyncExportTask: {
    url: 'ouser-web/asyncexport/getAsyncEventList.do',
    method: 'get'
  }
}
