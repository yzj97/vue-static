## Select Organization

组织架构选择

### 1. 默认样式

:::demo 默认样式。

```html
<template>
  <div>
     <ody-organization-select v-model="value" />
     {{ value }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: null
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
     <ody-organization-select v-model="value" placeholder="全部" />
     {{ value }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: null
    }
  }
}
</script>
```

:::

### 3. 全部disabled

:::demo 全部disabled。

```html
<template>
  <div>
     <ody-organization-select :disabled="true" v-model="value" />
     {{ value }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: null
    }
  }
}
</script>
```

:::

### 4. change事件

:::demo change事件。

```html
<template>
  <div>
     <ody-organization-select v-model="value" @select="handleSelect"/>
     {{ value }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: null
    }
  },
  methods: {
    handleSelect(val) {
      console.log('select', val)
    }
  }
}
</script>
```

:::

### 5. 多选

:::demo 多选。

```html
<template>
  <div>
     <ody-organization-select v-model="value" :multiple="true" />
     {{ value }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: null
    }
  }
}
</script>
```

:::

### 6. 默认样式 + 支持value-key

:::demo 默认样式 + 支持value-key。

```html
<template>
  <div>
     <ody-organization-select v-model="value" value-key="code" />
     {{ value }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: null
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
| disabled    | 完全禁用         | Boolean | false | — | - |
| valueKey    | 显示value对应的映射         | String | false | — | 'id' |
| labelKey    | 显示label对应的映射         | String | false | — | 'name' |

### Events

| 事件名称 | 说明 | 回调参数 |
|---------- |-------- |---------- |
|open |	(instanceId) |	Emitted when the menu opens.|
|close |	(value, instanceId) |	Emitted when the menu closes.|
|input |	(value, instanceId) |	Emitted after value changes.|
|select |	(node, instanceId) |	Emitted after selecting an option.|
|deselect |	(node, instanceId) |	Emitted after deselecting an option.|
|search-change |	(searchQuery, instanceId) |	Emitted after the search query changes.|
