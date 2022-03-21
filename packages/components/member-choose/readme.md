## Member Choose

会员表格选择

### 1. 默认样式

:::demo 默认样式。

```html
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 400px">
      <el-form-item label="会员" prop="name">
        <ody-member-choose v-model="ruleForm.name" placeholder="请选择" />
        {{ ruleForm.name }}
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="handleSubmit">立即创建</el-button>
        <el-button size="small" @click="handleRest">重置</el-button>
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
          { required: true, message: '请选择会员', trigger: 'change' }
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
      <el-form-item label="会员" prop="name">
        <ody-member-choose v-model="ruleForm.name" :selected.sync="ruleForm.selected"  placeholder="请选择" />
        {{ ruleForm.name }}
        {{ ruleForm.selected }}
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="handleSubmit">立即创建</el-button>
        <el-button size="small" @click="handleRest">重置</el-button>
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
          { required: true, message: '请选择会员', trigger: 'change' }
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
      <el-form-item label="会员" prop="name">
        <ody-member-choose v-model="ruleForm.name" :selected.sync="ruleForm.selected"  placeholder="请选择" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="handleSubmit">立即创建</el-button>
        <el-button size="small" @click="handleRest">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        name: '默认会员',
        selected: {memberCode: 'defaultmember', memberName: '默认会员'}
      },
      rules: {
        name: [
          { required: true, message: '请选择会员', trigger: 'change' }
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

### 4. 选中memberId

:::demo 默认样式。

```html
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 400px">
      <el-form-item label="会员" prop="memberId">
        <ody-member-choose v-model="ruleForm.memberId" :selected.sync="ruleForm.selected" value-key="memberId" placeholder="请选择" />
        {{ ruleForm.memberId }}
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="handleSubmit">立即创建</el-button>
        <el-button size="small" @click="handleRest">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        memberId: '',
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
      <el-form-item label="会员" prop="name">
        <ody-member-choose v-model="ruleForm.value" placeholder="请选择" :disabled="true" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="handleSubmit">立即创建</el-button>
        <el-button size="small" @click="handleRest">重置</el-button>
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
    <ody-member-choose v-model="ruleForm.ids" :selected.sync="ruleForm.selected" :multiple="true"  placeholder="请选择" />
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
    <ody-member-choose v-model="ruleForm.ids" :selected.sync="ruleForm.selected" :multiple="true" placeholder="请选择" />
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
    <ody-member-choose v-model="ruleForm.ids" :selected.sync="ruleForm.selected" :multiple="true" placeholder="请选择" />
    items: {{ruleForm.selected}}
    <div>ids: {{ruleForm.ids}}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        ids: [2006050000000057],
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
    <ody-member-choose v-model="ruleForm.ids" :selected.sync="ruleForm.selected" :disabled="true" :multiple="true" placeholder="请选择" />
    items: {{ruleForm.selected}}
    <div>ids: {{ruleForm.ids}}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        ids: [2006050000000057],
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
    <ody-member-choose v-model="ruleForm.ids" :selected.sync="ruleForm.selected" :params="ruleForm.searchParams"  :multiple="true" placeholder="请选择" />
    items: {{ruleForm.selected}}
    <div>ids: {{ruleForm.ids}}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        ids: [2006050000000057],
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
### 10. 自定义多选按钮

:::demo 多选。

```html
<template>
  <div>
    <ody-member-choose v-model="ruleForm.ids" :selected.sync="ruleForm.selected"  :multiple="true" placeholder="请选择" >
      <el-button type="primary" size="small">我是自定义多选按钮</el-button>
    </ody-member-choose>
    items: {{ruleForm.selected}}
    <div>ids: {{ruleForm.ids}}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        ids: [2006050000000057],
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
### 10. 自定义多选按钮

:::demo 初始化查询，可以用来做回显。受后端查询条件限制，目前只支持单选情况

```html
<template>
  <div>
    <ody-member-choose ref="memberChoose"  v-model="ruleForm.id" :selected.sync="ruleForm.selected" placeholder="请选择" disabled>
    </ody-member-choose>
    <el-button type="primary" size="small" @click="init">初始化查询</el-button>
    items: {{ruleForm.selected}}
    <div>id: {{ruleForm.id}}</div>

  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        id: [2006050000000057],
        selected: [],
        searchParams: {
          test: 123
        }
      }
    }
  },
  methods: {
    init() {
        this.$refs.memberChoose.initSelected()
    }
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
| valueKey    | 绑定数据value 用于回显数据的时候一定要和selected一起使用  还可以用于多选的时候v-model要想选中的的值    | String | false | — | id |
| params    | 可自定义传入限制参数   | Object | false | — | {} |
| limit | 限制选中的长度 | Number | false | - | Infinity |

### Other-Attributes

| 参数      | 说明          | 类型      | 必填 | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| labelKey    | 单选的时候用，绑定数据label        | String | false | — | nickname |

### Events

| 事件名称    | 说明     | 回调参数 |
| ----------- | -------- | -------- |
| open | 打开 | —        |
| ok     | 确定 | —        |
| cancel     | 取消 | —        |
| clear     | 清空 | —        |
