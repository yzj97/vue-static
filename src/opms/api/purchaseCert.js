export default {
  certList: {
    url: 'opms-web/purchaseCertificateConfig/listPage.do',
    method: 'post'
  },
  addCert: {
    url: 'opms-web/purchaseCertificateConfig/add.do',
    method: 'post'
  },
  updateCert: {
    url: 'opms-web/purchaseCertificateConfig/update.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  categoryList: {
    url: 'back-product-web2/extra/category/listRootCategory.do',
    method: 'post'
  },
  // categoryChildList: {
  //   url: 'opms-web/productCategory/getProductCategoryTreeByFullPathId.do',
  //   method: 'post'
  // },
  categoryChildList: {
    url: 'back-product-web2/extra/category/listChildrenCategory.do',
    method: 'post'
  },
  // cateList: {
  //   url: 'opms-web/purchaseCertificateCategory/list.do',
  //   method: 'post'
  // },
  cateList: {
    url: 'opms-web/purchaseCertificateCategory/listNodes.do',
    method: 'get'
  },
  getCates: {
    url: 'opms-web/purchaseCertificateCategory/list.do',
    method: 'post'
  },
  addCate: {
    url: 'opms-web/purchaseCertificateCategory/add.do',
    method: 'post'
  },
  delCate: {
    url: 'opms-web/purchaseCertificateCategory/delete.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  updateCate: {
    url: 'opms-web/purchaseCertificateCategory/update.do',
    method: 'post'
  }
}
