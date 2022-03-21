
/**
 * 商品新建接口
 */
export default {
  // 查询属性
  queryBarcodePriceList: {
    url: '/back-product-web/back/mp/product/queryBarcodePriceList',
    method: 'post'
  },
  queryCategoryAttribute: {
    url: '/back-product-web/back/mp/product/queryCategoryAttribute',
    method: 'post'
  },
  getStringValue: {
    url: '/ouser-web/public/page/getStringValue',
    method: 'get'
  },
  getBooleanSwitcher: {
    url: '/ouser-web/public/switcher/getBoolean.do',
    method: 'get'
  },
  listCategories: {
    url: '/back-product-web/public/config/listMulti',
    method: 'post',
    params: { 'categorys': ['OUTBOUND_STRATEGY'] }
  }
}
