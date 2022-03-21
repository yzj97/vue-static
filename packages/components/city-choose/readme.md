## 选择城市

ody-city-choose

:::demo 代码。

```html
<template>
  <div>
    <div v-for="(item, index) in list" :key="index">
      <ody-button code="ui" @click="choseCity(item.item, index)">点我能选择城市</ody-button>
      <div>{{ item.item }}</div>
      <hr />
    </div>
    <ody-city-choose
      v-if="visible"
      :visible="visible"
      :set-data="tempList"
      @hide-dialog="closeDialog"
      @confirm="getData"
    />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        visible: false,
        list: [{ item: ['驻马店'] }, { item: ['河南'] }],
        tempList: [],
        tempIndex: 0
      }
    },
    methods: {
      choseCity(item, index) {
        this.tempIndex = index
        this.tempList = item
        this.visible = true
      },
      closeDialog() {
        this.visible = false
      },
      getData(data) {
        this.visible = false
        this.list[this.tempIndex].item = data
        console.log(data)
      }
    }
  }
</script>
```

:::

### Attributes

| 参数     | 说明               | 类型   | 必填  | 可选值 | 默认值 |
| -------- | ------------------ | ------ | ----- | ------ | ------ |
| visible  | 控制是否显示和隐藏 | Boolea | true  | —      | —      |
| v-if     | 控制是否显示和隐藏 | Boolea | true  | —      | —      |
| set-data | 需要回显的数据     | Array  | false | —      | —      |

### Events

| 事件名称    | 说明     | 回调参数 |
| ----------- | -------- | -------- |
| hide-dialog | 关闭弹窗 | —        |
| confirm     | 得到数据 | —        |