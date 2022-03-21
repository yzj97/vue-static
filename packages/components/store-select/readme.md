## Select Store

选择有权限的店铺

### 1. 默认样式

:::demo 默认样式。

```html
<template>
  <div>
     <ody-store-select v-model="value" />
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
     <ody-store-select v-model="value" placeholder="全部" />
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
     <ody-store-select v-model="value" value-key="storeId" />
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
     <ody-store-select v-model="value" :selected.sync="selected" />
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
     <ody-store-select v-model="value">
        <template slot-scope="scope">
          <span style="float: left">{{ scope.item.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ scope.item.value }}</span>
        </template>
      </ody-store-select>
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
     <ody-store-select :disabled="true" v-model="value" />
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
     <ody-store-select :item-disabled="itemDisabled" v-model="value" />
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
     <ody-store-select v-model="value" @change="handleChange"/>
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
| selected.sync    | 双绑item         | Object | false | — | - |
| disabled    | 完全禁用         | Boolean | false | — | - |
| value-key    | storeCode    | String | false | — | — |
| label-key    |  storeName     | String | false | — | — |
| item-disabled    |  对某项设置disabled        | Function | false | — | — |
| item-filter    |  对某项filter        | Function | true | — | — |
|  defaultChoose   |  默认有选项 且选择第一个       | Boolean | false | — | false |
