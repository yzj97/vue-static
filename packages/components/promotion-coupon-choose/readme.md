# Promotion Coupon Choose

促销表格选择

## 1. 单选

### 1.1 默认样式

:::demo 默认样式。

```html
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 400px">
      <el-form-item label="促销" prop="name">
        <ody-promotion-coupon-choose v-model="ruleForm.name" placeholder="请选择" />
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
          { required: true, message: '请选择促销', trigger: 'change' }
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

### 1.2 默认样式 + 选中item

:::demo 默认样式。

```html
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 400px">
      <el-form-item label="促销" prop="name">
        <ody-promotion-coupon-choose v-model="ruleForm.name" :selected.sync="ruleForm.selected"  placeholder="请选择" />
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
          { required: true, message: '请选择促销', trigger: 'change' }
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

### 1.3 默认样式 + 回显

:::demo 默认样式。

```html
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 400px">
      <el-form-item label="促销" prop="name">
        <ody-promotion-coupon-choose v-model="ruleForm.name" :selected.sync="ruleForm.selected"  placeholder="请选择" />
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
        name: 1911280009917300,
        selected: {title: '其味无穷', activityId: 1911280009917300 }
      },
      rules: {
        name: [
          { required: true, message: '请选择促销', trigger: 'change' }
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

### 1.4 禁用

:::demo 默认样式。

```html
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 400px">
      <el-form-item label="促销" prop="name">
        <ody-promotion-coupon-choose v-model="ruleForm.value" placeholder="请选择" :disabled="true" />
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

## 2. 多选

### 2.1 默认样式

:::demo 默认样式

```html
<template>
  <div>
    <ody-promotion-coupon-choose v-model="ruleForm.ids" :selected.sync="ruleForm.selected" :multiple="true"  placeholder="请选择" />
    <div>ids: {{ruleForm.ids}}</div>
    <div>items: {{ruleForm.selected}}</div>
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

### 2.2 多选回显

:::demo 多选。

```html
<template>
  <div>
    <ody-promotion-coupon-choose v-model="ruleForm.ids" :selected.sync="ruleForm.selected" :multiple="true" value-key="merchantCode"  placeholder="请选择" />
    items: {{ruleForm.selected}}
    <div>ids: {{ruleForm.ids}}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        ids: [1911280009917300],
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

### 2.3 多选不可用

:::demo 多选。

```html
<template>
  <div>
    <ody-promotion-coupon-choose v-model="ruleForm.ids" :selected.sync="ruleForm.selected" :disabled="true" :multiple="true" value-key="merchantCode"  placeholder="请选择" />
    items: {{ruleForm.selected}}
    <div>ids: {{ruleForm.ids}}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        ids: [1911280009917300],
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

## 3. 多选带查看

### 3.1 多选 + 带查看

:::demo 多选 + 带查看。

```html
<template>
  <div>
    <ody-promotion-coupon-choose
      v-model="ruleForm.ids"
      :selected.sync="ruleForm.selected"
      :multiple="true"
      :view="true"
      placeholder="请选择" />
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

### 3.2 多选 + 带查看 + disabled

:::demo 多选 + 带查看。

```html
<template>
  <div>
    <ody-promotion-coupon-choose
      v-model="ruleForm.ids"
      :selected.sync="ruleForm.selected"
      :multiple="true"
      :view="true"
      :disabled="true"
      placeholder="请选择" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        ids: [1912040005836653],
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


### 3.3 多选 + 带查看(只有2个)

:::demo 多选 + 带查看(只有2个)。

```html
<template>
  <div>
    <ody-promotion-coupon-choose
      v-model="ruleForm.ids"
      :selected.sync="ruleForm.selected"
      :search-field="searchField"
      :multiple="true"
      :view="true"
      placeholder="请选择" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchField: ['themeTitle', 'receiveChannelCode'],
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

### Base-Attributes

| 参数      | 说明          | 类型      | 必填 | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| v-model    | 选中的值         | String | false | — | '' |
| selected    | 双绑，选中的item         | Object | false | — | {} |
| valueKey    | 绑定数据value 用于回显数据的时候一定要和selected一起使用  还可以用于多选的时候v-model要想选中的的值    | String | false | — | activityId |
| disabled    | 是否禁用    | Boolean | false | — | false |
| limit | 限制选中的长度 | Number | false | - | Infinity |
| searchField | 限制输入框显示 | Array | false | - | ['themeTitle', 'receiveChannelCode', 'merchantId', 'storeId'] |

### other-Attributes

| 参数      | 说明          | 类型      | 必填 | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| labelKey    | 单选的时候用，绑定数据label        | String | false | — | title |

### Events

| 事件名称    | 说明     | 回调参数 |
| ----------- | -------- | -------- |
| open | 打开 | —        |
| ok     | 确定 | —        |
| cancel     | 取消 | —        |
| clear     | 清空 | —        |