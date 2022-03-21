## Checkbox2

复选框加强版

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
     <ody-checkbox2 v-model="value" list-key="storeBigTypeList"/>
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
     <ody-checkbox2 v-model="value" list-key="storeBigTypeMap"/>
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

### 2. 加载list



:::demo 加载list

```html
<template>
  <div>
     <ody-checkbox2
        v-model="value"
        :selected.sync="selected"
        label-key="label"
        value-key="value"
        :is-show-all="true"
        :list="list"
      />
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: [],
      list: [{
          value: 0,
          label: '顺序'
        },
        {
          value: 1,
          label: '随机'
        }
      ]
    }
  },
  mounted() {
    setTimeout(()=> {
      this.list = [{
          value: 2,
          label: '顺序1'
        },
        {
          value: 3,
          label: '随机1'
        }
      ]
    },4000)
  }
}
</script>
```

:::

### 3. 加载远程（以商家复选框）

:::demo 加载远程

```html
<template>
  {{ value }}
  <ody-checkbox2
    ref="checkbox2"
    v-model="value"
    :selected.sync="selected"
    :label-key="labelKey"
    :value-key="valueKey"
    :is-show-all="true"
    :remote="remote"
  >
    <template slot-scope="scope">
      <slot :item="scope.item" />
    </template>
  </ody-checkbox2>
</template>

<script>

export default {
  props: {
    value: {
      type: Array,
      default: []
    },
    selected: {
      type: Object,
      default: () => {}
    },
    // 键
    valueKey: {
      type: String,
      default: 'merchantCode'
    },
    // 值
    labelKey: {
      type: String,
      default: 'merchantName'
    },
    itemDisabled: {
      type: Function,
      default: (x, index) => {
        return false
      }
    }
  },
  data() {
    return {

    }
  },
  methods: {
    // 请求远程接口
    async remote() {
      const { data: { listObj = [] } = {}} = await this.$api.merchant.queryPlatformAuthMerchantPage()

      console.log('listObj', listObj)

      return listObj || []
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

```

:::

### Attributes

| 参数      | 说明          | 类型      | 必填 | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| v-model    | 双绑数据         | String / Number | false | — | - |
| placeholder    |  空值显示        | String / Number | false | — | 请选择 |
| selected.sync    | 双绑item         | Object | false | — | - |
| disabled    | 完全禁用         | Boolean | false | — | - |
| value-key    | 值key    | String | false | — | value |
| label-key    |  文本key     | String | false | — | label |
| list-key    |  静态列表key     | String | false | — | — |
| is-show-all    |  是否显示全部     | Boolean | false | — | false |
| item-disabled    |  对某项设置disabled        | Function | false | — | — |
| item-filter    |  对某项filter        | Function | true | — | — |
| remote    |  异步请求，没有list-key时候        | Function | false | — | — |

### Events

| 事件名称 | 说明 | 回调参数 |
|---------- |-------- |---------- |
| change | 下拉框改变 | — |
