## Brand-transfer

品牌穿梭选择

### 1. 普通选择

:::demo 普通选择

```html
<template>
  <div>
     <ody-brand-transfer v-model="value" />
     {{ value }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: []
    }
  }
}
</script>
```

:::


### 2. 选中item

:::demo 普通选择

```html
<template>
  <div>
     <ody-brand-transfer :selected.sync="selected" />
     {{ selected }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      selected: []
    }
  }
}
</script>
```

:::

### Attributes

|       参数       |       说明        |  类型   | 必填  |          可选值          |   默认值   |
| ---------------- | ----------------- | ------- | ----- | ------------------------ | ---------- |
| v-model          | 选中的Id（lastId) | Array   | false | —                        | []         |
| selected         | 选中的item（tree) | Array   | false | —                        | []         |
| label            | 按钮显示的文字    | String  | false | —                        | + 添加标签 |
| showCheckedCount | 显示“已选 xx”     | Boolean | false | true/false        a      | true       |
| disabled         | 是否禁用          | Boolean | false | true/false               | false      |
| limit | 限制选中的长度 | Number | false | - | Infinity |

### Events

| 事件名称 | 说明 |  回调参数  |
| -------- | ---- | ---------- |
| open     | 打开 | —          |
| ok       | 确定 | targetTree |
| cancel   | 取消 | —          |