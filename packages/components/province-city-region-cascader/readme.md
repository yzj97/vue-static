## Province City Region Cascader

省市区选择

### 1. 默认样式

:::demo 默认样式。

```html
<template>
  <div>
     <ody-province-city-region-cascader v-model="value" />
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
     <ody-province-city-region-cascader v-model="value" />
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
         <ody-province-city-region-cascader v-model="ruleForm.area" />
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
         <ody-province-city-region-cascader v-model="ruleForm.area" />
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
         <ody-province-city-region-cascader
          v-model="ruleForm.area"
          :disabled="true"
        />
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
     <ody-province-city-region-cascader v-model="value" :selected.sync="selected" @change="handleChange" />
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
  },
  methods: {
    handleChange(val) {
      console.log('1111', val)
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
     <ody-province-city-region-cascader v-model="value" value-key="id"/>
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

### 8. 单选 + 取消级联

:::demo 默认样式。

```html
<template>
  <div>
     <ody-province-city-region-cascader :check-strictly="true" v-model="value" />
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

### 9. 多选

:::demo 默认样式。

```html
<template>
  <div>
     <ody-province-city-region-cascader
      :multiple="true"
      v-model="value"
    />
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

### 10. 搜素

:::demo 默认样式。

```html
<template>
  <div>
     <ody-province-city-region-cascader
      v-model="value"
      :filterable="true"
    />
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

### 11. 只有省市

:::demo 只有省市

```html
<template>
  <div>
     <ody-province-city-region-cascader v-model="value" :level="2" />
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
| valueKey    |  值key        | String | false | — | code |
| labelKey    |  键key        | String | false | — | name |
| selected    |  选择的数组        | Array | false | — | [] |
| filterable    |  是否可以搜素        | Boolean | false | — | false |
| clearable    |  是否可以删除        | Boolean | false | — | true |
| multiple    |  是否多选        | Boolean | false | — | false |
| checkStrictly    |  是否取消级联        | Boolean | false | — | false |
| level    |  选择层级        | Number | 1,2,3 | — | 3 |



### Events

| 事件名称    | 说明     | 回调参数 |
| ----------- | -------- | -------- |
| change |	当选中节点变化时触发 |	选中节点的值 |
| expand-change |	当展开节点发生变化时触发 | 	各父级选项值组成的数组 | 
| blur | 	当失去焦点时触发 | 	(event: Event) | 
| focus | 	当获得焦点时触发 | 	(event: Event) | 
| visible-change | 	下拉框出现/隐藏时触发 | 	出现则为 true，隐藏则为 false | 
| remove-tag | 	在多选模式下，移除Tag时触发	 | 移除的Tag对应的节点的值 | 