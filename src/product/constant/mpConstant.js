/**
 * 商品常量
 */
export default {
  MERCHANT_PRODUCT_CAN_SALE: { 0: '否', 1: '是' },
  YES_NO: { 0: '否', 1: '是' },
  ATTRIBUTE_NAME_TYPE: { 1: '商品属性', 2: '销售属性' },
  CATEGORY_TYPE: { 1: '后台类目', 2: '前台类目' },
  MERCHANT_CATEGORY_TYPE: { 4: '商家类目', 6: '店铺类目' },
  ATTRIBUTE_INPUT_TYPE: { 1: '多选', 2: '单选', 3: '手工输入' },
  VISIBLE_TYPE: { 0: '停用', 1: '启用' },
  PRODUCT_TYPE: [
    { code: 1, name: '内贸商品' },
    // { code: 32, name: '餐饮商品' },
    { code: 31, name: '称重商品' }
  ],
  PRODUCT_CUSTOMER: [
    { code: 0, name: '单规格' },
    { code: 3, name: '多规格' }
  ]
}
