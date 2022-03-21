## Select2

下拉框加强版

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
     <ody-select2 v-model="value" list-key="storeBigTypeList"/>
     {{ value }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: ''
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
     <ody-select2 v-model="value" list-key="storeBigTypeMap"/>
     {{ value }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: ''
    }
  }
}
</script>
```

:::

### 3. 加载远程（以商家下拉框）

:::demo 加载远程 + 缓存。

```html
<template>
  <ody-select2
    ref="select2"
    v-model="value"
    :selected.sync="selected"
    :clearable="!(selected && selected.disabled)"
    :multiple="false"
    v-bind="$attrs"
    :label-key="labelKey"
    :value-key="valueKey"
    :item-disabled="itemDisabled"
    :remote="remote"
    :cache-key="cacheKey"
    v-on="$listeners"
  >
    <template slot-scope="scope">
      <slot :item="scope.item" />
    </template>
  </ody-select2>
</template>

<script>

export default {
  props: {
    value: {
      type: String,
      default: ''
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
      // 缓存的key，添加后当前生命周期内之后访问一次接口
      cacheKey: 'merchant'
    }
  },
  methods: {
    // 请求远程接口
    async remote() {
      const { data: { listObj = [] } = {}} = await this.$api.merchant.queryPlatformAuthMerchantPage()

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
| item-disabled    |  对某项设置disabled        | Function | false | — | — |
| item-filter    |  对某项filter        | Function | true | — | — |
| remote    |  异步请求，没有list-key时候        | Function | false | — | — |

### Events

| 事件名称 | 说明 | 回调参数 |
|---------- |-------- |---------- |
| change | 下拉框改变 | — |
