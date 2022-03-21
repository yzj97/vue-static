# Category-transfer

类目选择

## 后台类目树

### 1. 普通选择 + 全部加载

:::demo 普通选择

```html
<template>
  <div>
     <ody-category-tree-select v-model="value" />
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

### 2. 普通选择 + 全部加载 + 自动返回最后节点数据

:::demo 普通选择

```html
<template>
  <div>
     <ody-category-tree-select v-model="value" value-consists-of="LEAF_PRIORITY"/>
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

### 3. 普通选择 + 按需加载

:::demo 普通选择

```html
<template>
  <div>
     <ody-category-tree-select v-model="value" type="need"/>
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

### 4. 普通选择 + 按需加载 + 获取最后节点数据

:::demo 普通选择

```html
<template>
  <div>
     <ody-category-tree-select ref="category" v-model="value" @select="handleSelect" type="need"/>
     {{ value }}
     {{ lastIds }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: [],
      lastIds: []
    }
  },
  methods: {
    async handleSelect() {
      this.$nextTick(async () => {
        this.lastIds = await this.$refs.category.getLastIds()
      })
    }
  }
}
</script>
```

:::


### 5. 普通选择 + 子加载一级

:::demo 普通选择

```html
<template>
  <div>
     <ody-category-tree-select v-model="value" type="one"/>
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