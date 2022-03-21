## Radio2

单选框加强版

### 1. 加载常量-array

数据来源 `packages/utils/constant.js`
```
storeBigTypeList: [
    { value: '0', label: '线上店铺' },
    { value: '1', label: '线下店铺' }
  ]
```

:::demo 加载常量

```html
<template>
  <div>
     <ody-radio2 v-model="value" list-key="storeBigTypeList"/>
     {{ value }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: '0'
    }
  }
}
</script>
```

:::

### 2. 加载常量-object

数据来源 `packages/utils/constant.js`
```
storeBigTypeMap: {
    '0': '线上店铺',
    '1': '线下店铺'
  },
```

:::demo 加载常量

```html
<template>
  <div>
     <ody-radio2 v-model="value" list-key="storeBigTypeMap"/>
     {{ value }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: '1'
    }
  }
}
</script>
```

:::

### 3. 加载远程，TODO: 需要补充

### Base-Attributes

| 参数      | 说明          | 类型      | 必填 | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| v-model    | 双绑数据         | String / Number | false | — | - |
| placeholder    |  空值显示        | String | false | — | 请选择 |
| selected.sync    | 双绑item         | Object | false | — | - |
| disabled    | 完全禁用         | Boolean | false | — | - |
| list-key    |  静态列表key     | String | false | — | — |
| item-disabled    |  对某项设置disabled        | Function | false | — | — |
| item-filter    |  对某项filter        | Function | true | — | — |

### 远程加载-Attributes

| 参数      | 说明          | 类型      | 必填 | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| value-key    | 值key    | String | false | — | value |
| label-key    |  文本key     | String | false | — | label |
| remote    |  异步请求，没有list-key时候        | Function | false | — | — |

### Events

| 事件名称 | 说明 | 回调参数 |
|---------- |-------- |---------- |
| change | 下拉框改变 | — |
