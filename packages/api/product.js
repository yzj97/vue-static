export default {
  queryPlatformAuthMerchantPage: {
    url: '/ouser-web/api/merchant/queryPlatformAuthMerchantPage.do',
    method: 'post',
    params: {
      'currentPage': 1,
      'itemsPerPage': 1000
    }
  },
  listBrand: {
    url: '/back-product-web/back/mp/brand/listBrand.do',
    method: 'post'
  },
  listBackCategoryTree: {
    url: '/back-product-web/back/mp/category/listBackCategoryTree.do',
    method: 'post'
  },
  queryPlatformAuthStorePage: {
    url: '/ouser-web/api/store/queryPlatformAuthStorePage.do',
    method: 'post',
    params: {
      'currentPage': 1,
      'itemsPerPage': 1000
    }
  }
}
