## Choose Store Product

选择店铺商品

### 1. 默认样式

:::demo 默认样式。

```html
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 400px">
      <el-form-item label="商品" prop="name">
        <ody-product-store-choose v-model="ruleForm.name" placeholder="请选择" />
        {{ ruleForm.name }}
      </el-form-item>
      <el-form-item>
        <ody-button code="ui" size="small" type="primary" @click="handleSubmit">立即创建</ody-button>
        <ody-button code="ui" size="small" @click="handleRest">重置</ody-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请选择商品', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    async handleSubmit() {
      const [err] = await this.formValidate('ruleForm')
      if (err) {
        return false;
      }
      this.$message.success('验证成功，提交数据' + JSON.stringify(this.ruleForm))
    },
    async handleRest() {
      this.formReset('ruleForm')
      this.ruleForm.selected={}
    }
  }
}
</script>
```
:::

### 2. 默认样式 + 选中item

:::demo 默认样式。

```html
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 400px">
      <el-form-item label="商品" prop="name">
        <ody-product-store-choose v-model="ruleForm.name" :selected.sync="ruleForm.selected"  placeholder="请选择" />
        {{ ruleForm.name }}
        {{ ruleForm.selected }}
      </el-form-item>
      <el-form-item>
        <ody-button code="ui" size="small" type="primary" @click="handleSubmit">立即创建</ody-button>
        <ody-button code="ui" size="small" @click="handleRest">重置</ody-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        selected: {}
      },
      rules: {
        name: [
          { required: true, message: '请选择商品', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    async handleSubmit() {
      const [err] = await this.formValidate('ruleForm')
      if (err) {
        return false;
      }
      this.$message.success('验证成功，提交数据' + JSON.stringify(this.ruleForm))
    },
    async handleRest() {
      this.formReset('ruleForm')
    }
  }
}
</script>
```

:::

### 3. 默认样式 + 回显

:::demo 默认样式。

```html
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 400px">
      <el-form-item label="商品" prop="name">
        <ody-product-store-choose v-model="ruleForm.name" :selected.sync="ruleForm.selected"  placeholder="请选择" />
      </el-form-item>
      <el-form-item>
        <ody-button code="ui" size="small" type="primary" @click="handleSubmit">立即创建</ody-button>
        <ody-button code="ui" size="small" @click="handleRest">重置</ody-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        name: '默认商品',
        selected: {merchantCode: 'defaultMerchant', merchantName: '默认商品'}
      },
      rules: {
        name: [
          { required: true, message: '请选择商品', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    async handleSubmit() {
      const [err] = await this.formValidate('ruleForm')
      if (err) {
        return false;
      }
      this.$message.success('验证成功，提交数据' + JSON.stringify(this.ruleForm))
    },
    async handleRest() {
      this.formReset('ruleForm')
    }
  }
}
</script>
```
:::

### 4. 选择id

:::demo 默认样式。

```html
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 400px">
      <el-form-item label="商品" prop="id">
        <ody-product-store-choose v-model="ruleForm.id" :selected.sync="ruleForm.selected" value-key="id" placeholder="请选择" />
        {{ ruleForm.id }}
      </el-form-item>
      <el-form-item>
        <ody-button code="ui" size="small" type="primary" @click="handleSubmit">立即创建</ody-button>
        <ody-button code="ui" size="small" @click="handleRest">重置</ody-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        id: '',
        selected: {},
      }
    }
  }
}
</script>
```
:::

### 5. 禁用

:::demo 默认样式。

```html
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 400px">
      <el-form-item label="商品" prop="name">
        <ody-product-store-choose v-model="ruleForm.value" placeholder="请选择" :disabled="true" />
      </el-form-item>
      <el-form-item>
        <ody-button code="ui" size="small" type="primary" @click="handleSubmit">立即创建</ody-button>
        <ody-button code="ui" size="small" @click="handleRest">重置</ody-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        value: ''
      }
    }
  }
}
</script>
```
:::

### 6. 多选

:::demo 多选。

```html
<template>
  <div>
    <ody-product-store-choose v-model="ruleForm.ids" :selected.sync="ruleForm.selected" :multiple="true"  placeholder="请选择" />
    items: {{ruleForm.selected}}
    <div>ids: {{ruleForm.ids}}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        ids: [],
        selected: []
      }
    }
  },
  methods: {
   
  }
}
</script>
```
:::

### 7. 多选 自定义value-key

:::demo 多选 自定义选中的v-model中的值,

```html
<template>
  <div>
    <ody-product-store-choose v-model="ruleForm.ids" :selected.sync="ruleForm.selected" :multiple="true" value-key="id" placeholder="请选择" />
    items: {{ruleForm.selected}}
    <div>ids: {{ruleForm.ids}}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        ids: [],
        selected: []
      }
    }
  },
  methods: {
   
  }
}
</script>
```
:::

### 8. 多选回显

:::demo 多选。

```html
<template>
  <div>
    <ody-product-store-choose v-model="ruleForm.ids" :selected.sync="ruleForm.selected" :multiple="true" value-key="id"  placeholder="请选择" />
    items: {{ruleForm.selected}}
    <div>ids: {{ruleForm.ids}}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        ids: ['1912090004997431'],
        selected: []
      }
    }
  },
  methods: {
   
  }
}
</script>
```
:::
### 9. 多选不可用

:::demo 多选。

```html
<template>
  <div>
    <ody-product-store-choose v-model="ruleForm.ids" :selected.sync="ruleForm.selected" :disabled="true" :multiple="true" value-key="id"  placeholder="请选择" />
    items: {{ruleForm.selected}}
    <div>ids: {{ruleForm.ids}}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        ids: ['1912090004997431'],
        selected: []
      }
    }
  },
  methods: {
   
  }
}
</script>
```
:::

:::
### 10. 可以加入其它请求参数

:::demo 多选。

```html
<template>
  <div>
    <ody-product-store-choose v-model="ruleForm.ids" :selected.sync="ruleForm.selected" :params="ruleForm.searchParams"  :multiple="true" value-key="id"  placeholder="请选择" />
    items: {{ruleForm.selected}}
    <div>ids: {{ruleForm.ids}}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        ids: ['1912090004997431'],
        selected: [],
        searchParams: {
          test: 123
        }
      }
    }
  },
  methods: {
   
  }
}
</script>
```
:::

:::
### 11. 自定义多选按钮

:::demo 多选。

```html
<template>
  <div>
    <ody-product-store-choose v-model="ruleForm.ids" :selected.sync="ruleForm.selected"  :multiple="true" value-key="id"  placeholder="请选择" >
      <ody-button code="ui" type="primary" size="small">我是自定义多选按钮</ody-button>
    </ody-product-store-choose>
    items: {{ruleForm.selected}}
    <div>ids: {{ruleForm.ids}}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        ids: ['1912090004997431'],
        selected: [],
        searchParams: {
          test: 123
        }
      }
    }
  },
  methods: {
   
  }
}
</script>
```
:::


### Base-Attributes

| 参数      | 说明          | 类型      | 必填 | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| v-model    | 选中的值         | String | false | — | '' |
| selected    | 双绑，选中的item         | Object | false | — | {} |
| valueKey    | 绑定数据value 用于回显数据的时候一定要和selected一起使用  还可以用于多选的时候v-model要想选中的的值    | String | false | — | merchantCode |
| params    | 可自定义传入限制参数   | Object | false | — | {} |
| limit | 限制选中的长度 | Number | false | - | Infinity |

### Other-Attributes

| 参数      | 说明          | 类型      | 必填 | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| labelKey    | 单选的时候用，绑定数据label        | String | false | — | merchantName |

### Events

| 事件名称    | 说明     | 回调参数 |
| ----------- | -------- | -------- |
| open | 打开 | —        |
| ok     | 确定 | —        |
| cancel     | 取消 | —        |
| clear     | 清空 | —        |