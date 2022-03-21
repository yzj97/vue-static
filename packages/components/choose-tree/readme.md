## position-transfer

选择树

### 1. 普通选择

:::demo 普通选择

```html
<template>
  <div>
    <ody-choose-tree v-model="value" />
    {{ value }}
  </div>
</template>
<script>
  export default {
    data() {
      return {
        value: []
      };
    }
  };
</script>
```

:::

### 2. 选中 item

:::demo 普通选择

```html
<template>
  <div>
    <ody-choose-tree :selected.sync="selected" />
    {{ selected }}
  </div>
</template>
<script>
  export default {
    data() {
      return {
        selected: []
      };
    }
  };
</script>
```

:::

### Attributes

| 参数        | 说明           | 类型     | 必填 | 可选值 | 默认值 |
| ----------- | -------------- | -------- | ---- | ------ | ------ |
| v-model     | 选中数据       | Object   | true | —      | []     |
| sourceLabel | 左侧展示 title | String   | true | —      | []     |
| targetLabel | 右侧展示 title | String   | true | —      | []     |
| loadNode    | 展示数据       | function | true | —      | []     |


### Events

| 事件名称 | 说明 | 回调参数 |
| -------- | ---- | -------- |
| search   | 查询 | --       |
| add      | 添加 | —        |
| delete   | 删除 | —        |
