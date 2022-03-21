## Choose Supplier

选择供应商

### 1. 默认样式

:::demo 默认样式。

```html
<template>
  <div>
    <ody-supplier-choose v-model="value" placeholder="请选择" selected.sync="selected"/>
    {{ value }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: '',
      selected: {}
    }
  }
}
</script>
```
:::

### 2. 默认样式 + 选中item

:::demo 默认样式。

```html
<template>
  <div>
    <ody-supplier-choose v-model="value" :selected.sync="selected" placeholder="请选择" />
    {{ selected }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: '',
      selected: {}
    }
  }
}
</script>
```
:::

### 3. 选中code

:::demo 默认样式。

```html
<template>
  <div>
    <ody-supplier-choose v-model="value" value-key="orgCode" selected.sync="selected" placeholder="请选择" />
    {{ value }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: '',
      selected: {}
    }
  }
}
</script>
```
:::

### 4. 禁用

:::demo 默认样式。

```html
<template>
  <div>
    <ody-supplier-choose v-model="value" placeholder="请选择" selected.sync="selected" :disabled="true" />
    {{ value }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: '',
      selected: {}
    }
  }
}
</script>
```
:::

### Attributes

| 参数      | 说明          | 类型      | 必填 | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| v-model    | 选中的值         | String | false | — | '' |
| selected    | 双绑，选中的item         | Object | false | — | {} |
| valueKey    | 绑定数据value  用于回显数据的时候一定要和selected一起使用      | String | false | — | orgCode |
| labelKey    | 绑定数据label        | String | false | — | orgName |
| merchantId    | 商家id        | String | false | — | '' |
| limit | 限制选中的长度 | Number | false | - | Infinity |

### Events

| 事件名称    | 说明     | 回调参数 |
| ----------- | -------- | -------- |
| open | 打开 | —        |
| ok     | 确定 | —        |
| cancel     | 取消 | —        |
| clear     | 清空 | —        |