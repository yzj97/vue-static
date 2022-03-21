## position-transfer

审批人选择

### 1. 普通选择

:::demo 普通选择

```html
<template>
  <div>
     <ody-audit-add v-model="value" />
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
     <ody-audit-add :selected.sync="selected" />
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

### Events

| 事件名称 | 说明 |  回调参数  |
| -------- | ---- | ---------- |