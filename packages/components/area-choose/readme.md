## 选择区域

ody-area-choose

:::demo 选择区域

```html
<template>
  <div>
    <ody-button code="ui" @click="chooseCity(dataList)">点我能选择区域</ody-button>
    <div>{{ dataList }}</div>
    <hr />
    <ody-area-choose
      v-if="visible"
      :visible="visible"
      :set-data="dataList"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        visible: false,
        dataList: [
          {
            "cityCode": "110000", "districtCode": "110100", "id": 2646, "provinceCode": "100000"
          },
          {
            "cityCode": "110000", "districtCode": "110100", "id": 2648, "provinceCode": "100000" 
          }
        ]
      }
    },
    methods: {
      chooseCity(item) {
        this.dataList = item
        this.visible = true
      },
      handleCancel() {
        this.visible = false
      },
      handleOk(data) {
        this.visible = false
        this.dataList = data
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
| cancel | 关闭弹窗 | —        |
| ok     | 得到数据 | —        |