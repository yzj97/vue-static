## product batch receive drawer

商品收货抽屉

### 1. 有库存

:::demo 默认样式。

```html
<template>
  <div>
    <ody-product-batch-receive-drawer :product="product" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      product: {
        batchStrategyId: 1, // 批次属性需要传递的值
        id: 2011170000000856, // 盘点单号
        isRecord: true, // ture表示收货记录明细，只能查看。null/false表示新增
        receiveNum: 123, // 商品所有批次汇总数，新建收货记录时为null
        productCode: "DEMO_CODE",
        productCname: "DEMO_NAME",
        productUnit: "DEMO_UNIT"
      }
    }
  },
  methods: {
   
  }
}
</script>
```
:::

### 2. 无库存

:::demo 默认样式。

```html
<template>
  <div>
    <ody-product-batch-receive-drawer :product="product" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      product: {
        batchStrategyId: 1, // 批次属性需要传递的值
        id: -1, // isRecord为false时不需要
        isRecord: false, // ture表示收货记录明细，只能查看。null/false表示新增
        receiveNum: null, // 商品所有批次汇总数，新建收货记录时为null
        productCode: "DEMO_CODE",
        productCname: "DEMO_NAME",
        productUnit: "DEMO_UNIT"
      }
    }
  },
  methods: {
   
  }
}
</script>
```
:::

### Base-Attributes

| 参数      | 说明          | 类型      | 必填 | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| product    | 传入的对象         | Object | false | — | {} |
| product.batchStrategyId    | 批次属性需要传递的值         | String | false | — | '' |
| product.inventoryCode    | 盘点单号         | String | false | — | '' |
| product.merchantProductId    | 商家id         | String | false | — | '' |
| product.inventoryStockNum    | 有过盘点库存         | Number | false | — | '' |


### Events

| 事件名称    | 说明     | 回调参数 |
| ----------- | -------- | -------- |
| ok     | 确定 | —        |