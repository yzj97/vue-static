## product batch count drawer

商品盘点抽屉

### 1. 无库存

:::demo 默认样式。

```html
<template>
  <div>
    <ody-product-batch-inventory-drawer :product="product" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      product: {
        isEdit: true,
        batchStrategyId: 1, // 批次属性需要传递的值
        inventoryCode: 2011170000000001, // 盘点单号
        merchantProductId: 2010150000000036, // 商家id
        warehouseId: 1, // 仓库ID
        inventoryStockNum: null // 是否盘点过
      }
    }
  },
  methods: {
   
  }
}
</script>
```
:::

### 2. 有库存

:::demo 默认样式。

```html
<template>
  <div>
    <ody-product-batch-inventory-drawer :product="product" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      product: {
        isEdit: true,
        batchStrategyId: 1, // 批次属性需要传递的值
        inventoryCode: 2011170000000001, // 盘点单号
        merchantProductId: 2010150000000036, // 商家id
        warehouseId: 1, // 仓库ID
        inventoryStockNum: 123 // 是否盘点过
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
| product.warehouseId    | 仓库id         | String | false | — | '' |
| product.merchantProductId    | 商家id         | String | false | — | '' |
| product.inventoryStockNum    | 有过盘点库存         | Number | false | — | '' |


### Events

| 事件名称    | 说明     | 回调参数 |
| ----------- | -------- | -------- |
| ok     | 确定 | —        |