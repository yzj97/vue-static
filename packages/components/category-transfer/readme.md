# Category-transfer

类目选择

## 后台类目树

### 1. 普通选择 + 选中的lastId + 选中的nodes

:::demo 普通选择

```html
<template>
  <div>
     <ody-category-transfer v-model="value" :nodes.sync="nodes" />
     {{ value }}
    {{ nodes }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: [],
      nodes: []
    }
  }
}
</script>
```

:::

### 2. 普通选择 + 选中的lastId + 选中的值

:::demo 普通选择

```html
<template>
  <div>
     <ody-category-transfer v-model="value" />
     {{ value }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: ['1912020007959105']
    }
  }
}
</script>
```

:::


### 3. 普通选择 + 选中的item

:::demo 普通选择

```html
<template>
  <div>
     <ody-category-transfer :selected.sync="selected"/>
     {{ selected }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      selected:  [ ]
    }
  }
}
</script>
```

:::


### 4. 普通选择 + 选中的item + 选中值

:::demo 普通选择

```html
<template>
  <div>
     <ody-category-transfer :selected.sync="selected"/>
     {{ selected }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      selected:  [ { "id": "1911130000093506", "pId": "0", "name": "后台类目", "value": null, "label": null, "children": [ { "id": "1911140009010293", "pId": "1911130000093506", "name": "类目1457335186", "value": null, "label": null, "children": [ { "id": "1911290006589334", "pId": "1911140009010293", "name": "11", "value": null, "label": null, "children": [ { "id": "1911290006592348", "pId": "1911290006589334", "name": "33", "value": null, "label": null, "children": [ { "id": "1912020007959105", "pId": "1911290006592348", "name": "b1031", "value": null, "label": null, "children": null, "_level": 5 } ], "_level": 4 } ], "_level": 3 } ], "_level": 2 } ], "_level": 1 } ]
    }
  }
}
</script>
```

:::

## 商家

### 1. 普通选择 + 选中的item

:::demo 普通选择

```html
<template>
  <div>
     <ody-category-transfer
      :selected.sync="selected"
      :category-type="4"
      :params="{id: 1911250007963405}"
    />
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

### 2. 普通选择 + 选中的item + label自定义 + 不显示已选

:::demo 普通选择

```html
<template>
  <div>
     <ody-category-transfer
      :selected.sync="selected"
      :category-type="4"
      label="编辑类目"
      :show-checked-count="false"
      :params="{id: 1911250007963405}"
    />
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
| v-model          | 选中的Id（lastId) | Array   | false | —                        | []         |
| selected         | 选中的item（tree) | Array   | false | —                        | []         |
| category-type    | 树类型            | String  | false | 1后台 2 前台 4商家 6店铺 | 1          |
| params           | 请求的额外参数    | Object  | false | —                        | {}         |
| label            | 按钮显示的文字    | String  | false | —                        | + 添加品类 |
| showCheckedCount | 显示“已选 xx”     | Boolean | false | true/false        a      | true       |
| disabled         | 是否禁用          | Boolean | false | true/false               | false      |
| disabledIdList   | 禁用Id列表        | Array   | false | —                        | []         |
| limit | 限制选中的长度 | Number | false | - | Infinity |

### Events

| 事件名称 | 说明 |  回调参数  |
| -------- | ---- | ---------- |
| open     | 打开 | —          |
| ok       | 确定 | targetTree |
| cancel   | 取消 | —          |