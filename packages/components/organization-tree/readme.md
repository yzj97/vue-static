## DepartmentTree

组织架构tree选择

### 1. 基本

:::demo 基本

```html
<template>
  <div>
     <ody-organization-tree v-model="value"/>
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


### Attributes

| 参数      | 说明          | 类型      | 必填 | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| v-model    | 双绑数据         | String / Number | false | — | - |

### Events

| 事件名称 | 说明 | 回调参数 |
|---------- |-------- |---------- |
| change | 下拉框改变 | — |
