## Select Dict

字典选择

### 1. 默认样式

:::demo 默认样式。

```html
<template>
  <div>
     <ody-dict-select category="ORDER_LABLE" v-model="value" />
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

### 2. 自定义placeholder

:::demo 自定义placeholder。

```html
<template>
  <div>
     <ody-dict-select category="ORDER_LABLE" v-model="value" placeholder="全部" />
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

### 3. 设置值是Id

:::demo 设置值是Id

```html
<template>
  <div>
     <ody-dict-select category="ORDER_LABLE" v-model="value" value-key="id" />
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

### 4. 获取选中item

:::demo 获取选中item。

```html
<template>
  <div>
     <ody-dict-select category="ORDER_LABLE" v-model="value" :selected.sync="selected" />
     {{ value }} {{ selected }}
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

### 5. 自定义插槽

:::demo 自定义插槽。

```html
<template>
  <div>
     <ody-dict-select category="ORDER_LABLE" v-model="value">
        <template slot-scope="scope">
          <span style="float: left">{{ scope.item.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ scope.item.value }}</span>
        </template>
      </ody-dict-select category="ORDER_LABLE">
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

### 6. 全部disabled

:::demo 全部disabled。

```html
<template>
  <div>
     <ody-dict-select category="ORDER_LABLE" :disabled="true" v-model="value" />
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

### 7. 某项disabled（第一项）

:::demo 某项disabled（第一项）。

```html
<template>
  <div>
     <ody-dict-select category="ORDER_LABLE" :item-disabled="itemDisabled" v-model="value" />
     {{ value }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: ''
    }
  },
  methods: {
    itemDisabled(x, index) {
      return index === 0
    }
  }
}
</script>
```

:::

### 8. change事件

:::demo change事件。

```html
<template>
  <div>
     <ody-dict-select category="ORDER_LABLE" v-model="value" @change="handleChange"/>
     {{ value }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: ''
    }
  },
  methods: {
    handleChange(val) {
      console.log('change', val)
    }
  }
}
</script>
```

:::

### Attributes

| 参数      | 说明          | 类型      | 必填 | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| v-model    | 双绑数据         | String / Number | false | — | - |
| placeholder    |  空值显示        | String / Number | false | — | 请选择 |
| category    |  请求的参数        | String | false | — | - |
| selected.sync    | 双绑item         | Object | false | — | - |
| disabled    | 完全禁用         | Boolean | false | — | - |
| value-key    | code    | String | false | — | — |
| label-key    |  name     | String | false | — | — |
| item-disabled    |  对某项设置disabled        | Function | false | — | — |
| item-filter    |  对某项filter        | Function | true | — | — |
| category    |  请求的分类        | String | false | — | — |

### Events

| 事件名称 | 说明 | 回调参数 |
|---------- |-------- |---------- |
| change | 下拉框改变 | — |
