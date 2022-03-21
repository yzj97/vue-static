# Store Choose

店铺筛选

## 1. 单选

### 1.1 默认样式 + 表单验证

:::demo 默认样式 + 表单验证。

```html
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 400px">
      <el-form-item label="店铺" prop="storeCode">
        <ody-store-choose
          v-model="ruleForm.storeCode"
          placeholder="请选择"
        />
        显示选中的storeCode {{ ruleForm.storeCode }}
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
          storeCode: ''
        },
        rules: {
          storeCode: [
            { required: true, message: '请选择店铺', trigger: 'change' }
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
      <el-form-item label="店铺" prop="storeCode">
        <ody-store-choose
          v-model="ruleForm.storeCode"
          :selected.sync="store"
          placeholder="请选择"
        />
        显示选中的store {{ store }}
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
          storeCode: ''
        },
        store: {},
        rules: {
          storeCode: [
            { required: true, message: '请选择店铺', trigger: 'change' }
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

### 1.3 默认样式 + 表单验证 + 返回storeId

:::demo 默认样式 + 表单验证 + 返回storeId。

```html
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 400px">
      <el-form-item label="店铺" prop="storeId">
        <ody-store-choose
          v-model="ruleForm.storeId"
          value-key="storeId"
          placeholder="请选择"
        />
        显示选中的storeId {{ ruleForm.storeId }}
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
          storeId: ''
        },
        rules: {
          storeId: [
            { required: true, message: '请选择店铺', trigger: 'change' }
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
      <el-form-item label="店铺" prop="storeCode">
        <ody-store-choose
          v-model="ruleForm.storeCode"
          :disabled="true"
          placeholder="请选择"
        />
        显示选中的storeCode {{ storeCode }}
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
          storeCode: ''
        },
        rules: {
          storeCode: [
            { required: true, message: '请选择店铺', trigger: 'change' }
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
      <el-form-item label="店铺" prop="storeCode">
        <ody-store-choose
          v-model="ruleForm.storeCode"
          placeholder="请选择"
        />
        显示选中的storeCode {{ ruleForm.storeCode }}
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
          storeCode: ''
        },
        rules: {
          storeCode: [
            { required: true, message: '请选择店铺', trigger: 'change' }
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

### 1.6 默认样式 + 表单验证 + 自定义fields

:::demo 默认样式 + 表单验证。

```html
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 400px">
      <el-form-item label="店铺" prop="storeCode">
        <ody-store-choose
          v-model="ruleForm.storeCode"
          :search-field="['channelCode', 'merchantId', 'storeCode', 'storeName', 'storeOnlineType']"
          :result-field="['storeCode', 'storeName', 'merchantName', 'storeOnlineTypeName', 'mobile', 'contactName', 'channelCodes']"
          placeholder="请选择"
        />
        显示选中的storeCode {{ ruleForm.storeCode }}
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
          storeCode: ''
        },
        rules: {
          storeCode: [
            { required: true, message: '请选择店铺', trigger: 'change' }
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

### 2.1 选择店铺 多选

:::demo 默认样式。

```html
<template>
  <div>
    <ody-store-choose
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

### 2.2 选择店铺 自定义value-key 

:::demo 默认样式。

```html
<template>
  <div>
    <ody-store-choose
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
        ids: [],
        selected: []
      };
    }
  };
</script>
```

:::


### 2.3 选择店铺 加入筛选条件

:::demo 默认样式。

```html
<template>
  <div>
    <ody-store-choose
      v-model="ids"
      :selected.sync="selected"
      :search-field="['channelCode', 'merchantId', 'storeCode', 'storeName']"
      :result-field="['storeCode', 'storeName', 'merchantName', 'mobile', 'contactName']"
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

### 2.4 选择店铺 回显

:::demo 默认样式。

```html
<template>
  <div>
    <ody-store-choose
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

### 2.5 选择店铺 不可用

:::demo 默认样式。

```html
<template>
  <div>
    <ody-store-choose
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

:::

### 2.6 选择店铺 加入自定义参数params

:::demo 默认样式。

```html
<template>
  <div>
    <ody-store-choose
      v-model="ids"
      :selected.sync="selected"
      value-key="storeId"
      placeholder="请选择"
      :multiple="true"
      :params="params"
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
        selected: [],
        params: {
          test: 123
        }
      };
    }
  };
</script>
```

:::

### 2.6 选择店铺 加入自定义多选按钮

:::demo 默认样式。

```html
<template>
  <div>
    <ody-store-choose
      v-model="ids"
      :selected.sync="selected"
      value-key="storeId"
      placeholder="请选择"
      :multiple="true"
      :params="params"
    >
      <ody-button code="ui" type="primary" size="small">我是自定义多选按钮</ody-button>
    </ody-store-choose>
    <div>ids:{{ ids }}</div>
    <div>selected: {{selected}}</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        ids: [1911140007103315],
        selected: [],
        params: {
          test: 123
        }
      };
    }
  };
</script>
```

:::


### 2.7 选择店铺 + select 展现形式

:::demo 默认样式。

```html
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 400px">
      <el-form-item label="店铺" prop="storeCode">
        <ody-store-choose
          v-model="ids"
          :selected.sync="selected"
          placeholder="请选择"
          :multiple="true"
          type="select"
        />
        <div>ids:{{ ids }}</div>
        <div>selected: {{selected}}</div>
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
        ids: [],
        selected: []
      };
    }
  };
</script>
```

:::


### 2.8 选择店铺 + select 展现形式 带折叠

:::demo 默认样式。

```html
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 400px">
      <el-form-item label="店铺" prop="storeCode">
        <ody-store-choose
          v-model="ids"
          :selected.sync="selected"
          placeholder="请选择"
          :multiple="true"
          :collapse-tags="true"
          type="select"
        />
        <div>ids:{{ ids }}</div>
        <div>selected: {{selected}}</div>
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
        ids: [],
        selected: []
      };
    }
  };
</script>
```

:::

### 2.9 多选 + 表单验证

:::demo 多选 + 表单验证。

```html
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 400px">
      <el-form-item label="店铺" prop="storeCode">
        <ody-store-choose
          v-model="ruleForm.storeCode"
          :multiple="true"
          :collapse-tags="true"
          type="select"
          :selected.sync="selected"
          placeholder="请选择"
        />
        显示选中的storeCode {{ ruleForm.storeCode }}
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
        selected: [],
        ruleForm: {
          storeCode: []
        },
        rules: {
          storeCode: [
            { required: true, message: '请选择店铺', trigger: 'change' }
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

## 3. 多选 + 查看

### 3.1 默认样式

:::demo 默认样式

```html
<template>
  <div>
    <ody-store-choose
      v-model="ruleForm.storeCodeList"
      :selected.sync="storeList"
      placeholder="请选择"
      :search-field="['channelCode', 'merchantId', 'storeCode', 'storeName']"
      :result-field="['storeCode', 'storeName', 'merchantName', 'mobile', 'contactName']"
      :multiple="true"
      value-key="storeId"
      :view="true"
    />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        ruleForm: {
          storeCodeList: []
        },
        storeList: []
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
| valueKey    | 绑定数据 value 用于回显数据的时候一定要和 selected 一起使用 | String | false | —      | storeCode                  |
| labelKey    | 绑定数据 label                                              | String | false | —      | storeName                  |
| searchField | 搜索数据可以展示的                                          | Array  | false | —      | ['storeCode', 'storeName'] |
| resultField | 表格中的数据可以展示的                                      | Array  | false | —      | ['storeCode', 'storeName'] |
| params    | 可自定义传入限制参数                                          | Object | false | —      | {}                          |
| limit | 限制选中的长度 | Number | false | - | Infinity |
| type | 展现形式(目前只对多选有效) | String | false | button/select | button |

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
| delete    | 删除 | —        |