/* category */
export default {
  listPage: {
    url: 'cms-web/cmsCategory/listPage',
    method: 'post'
  },
  listTree: {
    url: 'cms-web/cmsCategory/listTree',
    method: 'post'
  },
  saveOrUpdateCategory: {
    url: 'cms-web/cmsCategory/saveOrUpdateCategory.do',
    method: 'post'
  },
  updateAvailable: {
    url: 'cms-web/cmsCategory/updateAvailable.do',
    method: 'post'
  },
  deleteCmsCategory: {
    url: 'cms-web/cmsCategory/deleteCmsCategory.do',
    method: 'get'
  },
  getCmsConfig: {
    url: '/cms-web/api/config/get',
    method: 'get'
  },
  queryCategoryListByParent: {
    url: '/back-product-web/back/mp/category/queryCategoryListByParent.do',
    method: 'post'
  }
}
