## Province City Region Select

省市区选择

### 1. 默认样式

:::demo 默认样式。

```html
<template>
  <div>
     <ody-province-city-region-select v-model="value" />
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

### 2. 有默认值

:::demo 有默认值。

```html
<template>
  <div>
     <ody-province-city-region-select v-model="value" />
     {{ value }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: [ 140000, 140300, 140303 ]
    }
  }
}
</script>
```

:::

### 3. 表单验证

:::demo 表单验证。

```html
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="省市区" prop="area">
         <ody-province-city-region-select v-model="ruleForm.area" />
      </el-form-item>
      <el-form-item>
        <ody-button code="ui" size="mini" type="primary" @click="submitForm('ruleForm')">立即创建</ody-button>
        <ody-button code="ui" size="mini" @click="resetForm('ruleForm')">重置</ody-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    const validateArea = (rule, value = [], callback) => {
      const len = value.filter(x => x).length
      if (len < 3) {
        callback(new Error('has error'))
      } else {
        callback()
      }
    }

    return {
      ruleForm: {
        area: []
      },
      rules: {
         area: [
          {
            trigger: 'change',
            validator: validateArea,
            required: true,
            message: this.$t('请完整地选择省市区')
          }
        ]
      }
    }
  },
  methods: {
    async submitForm(formName) {
      const [err] = await this.validateForm(formName)

      if (err) {
        return;
      }
      // 通过es6的解构
      const {area: [provinceCode, cityCode, regionCode], ...params} = this.ruleForm

      params.provinceCode = provinceCode
      params.cityCode = cityCode
      params.regionCode = regionCode

      console.log('form 验证通过 开始提交', params)
    },
    validateForm(formName) {
      return new Promise((resolve, reject) => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            resolve([null, valid])
          } else {
            resolve([true])
          }
        });
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>
```

:::

### 4. 完全禁用

:::demo 表单验证。

```html
<template>
  <div>
    <el-form :disabled="true" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="省市区" prop="area">
         <ody-province-city-region-select v-model="ruleForm.area" />
      </el-form-item>
      <el-form-item>
        <ody-button code="ui" size="mini" type="primary" @click="submitForm('ruleForm')">立即创建</ody-button>
        <ody-button code="ui" size="mini" @click="resetForm('ruleForm')">重置</ody-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    const validateArea = (rule, value = [], callback) => {
      const len = value.filter(x => x).length
      if (len < 3) {
        callback(new Error('has error'))
      } else {
        callback()
      }
    }

    return {
      ruleForm: {
        area: []
      },
      rules: {
         area: [
          {
            trigger: 'change',
            validator: validateArea,
            required: true,
            message: this.$t('请完整地选择省市区')
          }
        ]
      }
    }
  },
  methods: {
    async submitForm(formName) {
      const [err] = await this.validateForm(formName)

      if (err) {
        return;
      }
      // 通过es6的解构
      const {area: [provinceCode, cityCode, regionCode], ...params} = this.ruleForm

      params.provinceCode = provinceCode
      params.cityCode = cityCode
      params.regionCode = regionCode

      console.log('form 验证通过 开始提交', params)
    },
    validateForm(formName) {
      return new Promise((resolve, reject) => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            resolve([null, valid])
          } else {
            resolve([true])
          }
        });
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>
```

:::


### 5. 省市区禁用

:::demo 表单验证。

```html
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="省市区" prop="area">
         <ody-province-city-region-select :disabled="true" v-model="ruleForm.area" />
      </el-form-item>
      <el-form-item>
        <ody-button code="ui" size="mini" type="primary" @click="submitForm('ruleForm')">立即创建</ody-button>
        <ody-button code="ui" size="mini" @click="resetForm('ruleForm')">重置</ody-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    const validateArea = (rule, value = [], callback) => {
      const len = value.filter(x => x).length
      if (len < 3) {
        callback(new Error('has error'))
      } else {
        callback()
      }
    }

    return {
      ruleForm: {
        area: []
      },
      rules: {
         area: [
          {
            trigger: 'change',
            validator: validateArea,
            required: true,
            message: this.$t('请完整地选择省市区')
          }
        ]
      }
    }
  },
  methods: {
    async submitForm(formName) {
      const [err] = await this.validateForm(formName)

      if (err) {
        return;
      }
      // 通过es6的解构
      const {area: [provinceCode, cityCode, regionCode], ...params} = this.ruleForm

      params.provinceCode = provinceCode
      params.cityCode = cityCode
      params.regionCode = regionCode

      console.log('form 验证通过 开始提交', params)
    },
    validateForm(formName) {
      return new Promise((resolve, reject) => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            resolve([null, valid])
          } else {
            resolve([true])
          }
        });
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>
```

:::


### 6. 获取选中的item

:::demo 默认样式。

```html
<template>
  <div>
     <ody-province-city-region-select v-model="value" :selected.sync="selected" />
     {{ value }}
     {{ selected }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: [],
      selected: []
    }
  }
}
</script>
```

:::

### 7. 选中的值是id

:::demo 默认样式。

```html
<template>
  <div>
     <ody-province-city-region-select v-model="value" value-key="id"/>
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

### Attributes

| 参数      | 说明          | 类型      | 必填 | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| v-model    | 双绑数据, 传递code的一维数组         |  Number | false | — | - |
| disabled    |  是否禁用        | Boolean | false | — | 选择省市区 |