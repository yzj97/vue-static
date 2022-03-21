## Brand-transfer

品牌穿梭选择

### 1.下拉框选择

:::demo 下拉框选择 + 支持输入筛选

```html
<template>
  <div>
    <ody-brand-select v-model="value" />
    {{ value }}
  </div>
</template>
<script>
  export default {
    data() {
      return {
        value: {}
      };
    }
  };
</script>
```

:::

### Attributes

| 参数    | 说明             | 类型          | 必填  | 可选值 | 默认值 |
| ------- | ---------------- | ------------- | ----- | ------ | ------ |
| v-model | 选中的 Id (双绑) | String/Object | false | —      | []     |


