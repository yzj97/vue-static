# GuideUser Choose

导购员筛选

## 1. 单选

### 1.1 默认样式 + 表单验证

:::demo 默认样式 + 表单验证。

```html
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 400px">
      <el-form-item label="导购员" prop="guideUserId">
        <ody-guide-user-choose
          v-model="ruleForm.guideUserId"
          placeholder="请选择"
        />
        显示选中的guideUserId {{ ruleForm.guideUserId }}
      </el-form-item>
      <el-form-item>
        <ody-button code="ui" size="small" @click="handleReset">重置</ody-button>
        <ody-button code="ui" size="small" type="primary" @click="handleSubmit">立即创建</ody-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        ruleForm: {
          guideUserId: ''
        },
        rules: {
          guideUserId: [
            { required: true, message: '请选择导购员', trigger: 'change' }
          ]
        }
      };
    },
    methods: {
      async handleSubmit() {
        const [err] = this.formValidate('ruleForm')

        if (err) {
          return ;
        }

        this.$message({
          message: '恭喜你，这是一条成功消息',
          type: 'success'
        });
      },
      handleReset() {
        this.formReset('ruleForm')
      }
    }
  };
</script>
```

:::

### 1.2 默认样式 + 表单验证 + 选中的item

:::demo 默认样式 + 表单验证 + 选中的item。

```html
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 400px">
      <el-form-item label="导购员" prop="guideUserId">
        <ody-guide-user-choose
          v-model="ruleForm.guideUserId"
          :selected.sync="guideUser"
          placeholder="请选择"
        />
        显示选中的guideUser {{ guideUser }}
      </el-form-item>
      <el-form-item>
        <ody-button code="ui" size="small" @click="handleReset">重置</ody-button>
        <ody-button code="ui" size="small" type="primary" @click="handleSubmit">立即创建</ody-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        ruleForm: {
          guideUserId: ''
        },
        store: {},
        rules: {
          guideUserId: [
            { required: true, message: '请选择导购员', trigger: 'change' }
          ]
        }
      };
    },
    methods: {
      async handleSubmit() {
        const [err] = this.formValidate('ruleForm')

        if (err) {
          return ;
        }

        this.$message({
          message: '恭喜你，这是一条成功消息',
          type: 'success'
        });
      },
      handleReset() {
        this.formReset('ruleForm')
      }
    }
  };
</script>
```

:::


### 1.4 默认样式 + 表单验证 + 禁用

:::demo 默认样式 + 表单验证 + 禁用。

```html
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 400px">
      <el-form-item label="导购员" prop="guideUserId">
        <ody-guide-user-choose
          v-model="ruleForm.guideUserId"
          :disabled="true"
          placeholder="请选择"
        />
        显示选中的guideUserId {{ guideUserId }}
      </el-form-item>
      <el-form-item>
        <ody-button code="ui" size="small" @click="handleReset">重置</ody-button>
        <ody-button code="ui" size="small" type="primary" @click="handleSubmit">立即创建</ody-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        ruleForm: {
          guideUserId: ''
        },
        rules: {
          guideUserId: [
            { required: true, message: '请选择导购员', trigger: 'change' }
          ]
        }
      };
    },
    methods: {
      async handleSubmit() {
        const [err] = this.formValidate('ruleForm')

        if (err) {
          return ;
        }

        this.$message({
          message: '恭喜你，这是一条成功消息',
          type: 'success'
        });
      },
      handleReset() {
        this.formReset('ruleForm')
      }
    }
  };
</script>
```

:::

### 1.5 默认样式 + 表单验证 + 完全禁用

:::demo 默认样式 + 表单验证 + 禁用。

```html
<template>
  <div>
    <el-form :model="ruleForm" :disabled="true" :rules="rules" ref="ruleForm" label-width="100px" style="width: 400px">
      <el-form-item label="导购员" prop="guideUserId">
        <ody-guide-user-choose
          v-model="ruleForm.guideUserId"
          placeholder="请选择"
        />
        显示选中的guideUserId {{ ruleForm.guideUserId }}
      </el-form-item>
      <el-form-item>
        <ody-button code="ui" size="small" @click="handleReset">重置</ody-button>
        <ody-button code="ui" size="small" type="primary" @click="handleSubmit">立即创建</ody-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        ruleForm: {
          guideUserId: ''
        },
        rules: {
          guideUserId: [
            { required: true, message: '请选择导购员', trigger: 'change' }
          ]
        }
      };
    },
    methods: {
      async handleSubmit() {
        const [err] = this.formValidate('ruleForm')

        if (err) {
          return ;
        }

        this.$message({
          message: '恭喜你，这是一条成功消息',
          type: 'success'
        });
      },
      handleReset() {
        this.formReset('ruleForm')
      }
    }
  };
</script>
```

:::

## 2 多选

### 2.1 选择导购员 多选

:::demo 默认样式。

```html
<template>
  <div>
    <ody-guide-user-choose
      v-model="ids"
      :selected.sync="selected"
      placeholder="请选择"
      :multiple="true"
    />
    <div>ids:{{ ids }}</div>
    <div>selected: {{selected}}</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        ids: [],
        selected: []
      };
    }
  };
</script>
```

:::

### 2.4 选择导购员 回显

:::demo 默认样式。

```html
<template>
  <div>
    <ody-guide-user-choose
      v-model="ids"
      :selected.sync="selected"
      placeholder="请选择"
      :multiple="true"
    />
    <div>ids:{{ ids }}</div>
    <div>selected: {{selected}}</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        ids: [1911140007103315],
        selected: []
      };
    }
  };
</script>
```

:::

### 2.5 选择导购员 不可用

:::demo 默认样式。

```html
<template>
  <div>
    <ody-guide-user-choose
      :disabled="true"
      v-model="ids"
      :selected.sync="selected"
      value-key="storeId"
      placeholder="请选择"
      :multiple="true"
    />
    <div>ids:{{ ids }}</div>
    <div>selected: {{selected}}</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        ids: [1911140007103315],
        selected: []
      };
    }
  };
</script>
```

:::


## 3. 多选 + 查看

### 3.1 默认样式

:::demo 默认样式

```html
<template>
  <div>
    <ody-guide-user-choose
      v-model="ruleForm.guideUserIdList"
      :selected.sync="guideUserList"
      placeholder="请选择"
      :multiple="true"
      :view="true"
    />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        ruleForm: {
          guideUserIdList: []
        },
        guideUserList: []
      };
    }
  };
</script>
```

:::

### Base-Attributes

| 参数        | 说明                                                        | 类型   | 必填  | 可选值 | 默认值                     |
| ----------- | ----------------------------------------------------------- | ------ | ----- | ------ | -------------------------- |
| v-model     | 选中的值                                                    | String | false | —      | ''                         |
| selected    | 双绑，选中的 item                                           | Object | false | —      | {}                         |
| valueKey    | 绑定数据 value 用于回显数据的时候一定要和 selected 一起使用 | String | false | —      | guideUserId                  |
| labelKey    | 绑定数据 label                                              | String | false | —      | storeName                  |
| limit | 限制选中的长度 | Number | false | - | Infinity |

### Other-Attributes
| 参数        | 说明                                                        | 类型   | 必填  | 可选值 | 默认值                     |
| ----------- | ----------------------------------------------------------- | ------ | ----- | ------ | -------------------------- |
| labelKey    | 单选的时候绑定数据 label                                              | String | false | —      | storeName                  |

### Events

| 事件名称 | 说明 | 回调参数 |
| -------- | ---- | -------- |
| open     | 打开 | —        |
| ok       | 确定 | —        |
| cancel   | 取消 | —        |
| clear    | 清空 | —        |