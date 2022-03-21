# Product Store Series Choose

店铺商品带系列品筛选

## 1. 单选

### 1.1 默认样式 + 表单验证

:::demo 默认样式 + 表单验证。

```html
<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width: 400px">
      <el-form-item label="商品" prop="id">
        <ody-product-store-series-choose
          v-model="ruleForm.id"
          placeholder="请选择"
        />
        显示选中的id {{ ruleForm.id }}
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
          id: ''
        },
        rules: {
          id: [
            { required: true, message: '请选择商品', trigger: 'change' }
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
      <el-form-item label="商品" prop="id">
        <ody-product-store-series-choose
          v-model="ruleForm.id"
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
          id: ''
        },
        store: {},
        rules: {
          id: [
            { required: true, message: '请选择商品', trigger: 'change' }
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
      <el-form-item label="商品" prop="id">
        <ody-product-store-series-choose
          v-model="ruleForm.id"
          :disabled="true"
          placeholder="请选择"
        />
        显示选中的id {{ id }}
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
          id: ''
        },
        rules: {
          id: [
            { required: true, message: '请选择商品', trigger: 'change' }
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
      <el-form-item label="商品" prop="id">
        <ody-product-store-series-choose
          v-model="ruleForm.id"
          placeholder="请选择"
        />
        显示选中的id {{ ruleForm.id }}
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
          id: ''
        },
        rules: {
          id: [
            { required: true, message: '请选择商品', trigger: 'change' }
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

### 2.1 选择商品 多选

:::demo 默认样式。

```html
<template>
  <div>
    <ody-product-store-series-choose
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

### 2.2 选择商品 自定义value-key 

:::demo 默认样式。

```html
<template>
  <div>
    <ody-product-store-series-choose
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


### 2.3 选择商品 加入筛选条件

:::demo 默认样式。

```html
<template>
  <div>
    <ody-product-store-series-choose
      v-model="ids"
      :selected.sync="selected"
      :search-field="['channelCode', 'merchantId', 'id', 'storeName']"
      :result-field="['id', 'storeName', 'merchantName', 'mobile', 'contactName']"
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

### 2.4 选择商品 回显

:::demo 默认样式。

```html
<template>
  <div>
    <ody-product-store-series-choose
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

### 2.5 选择商品 不可用

:::demo 默认样式。

```html
<template>
  <div>
    <ody-product-store-series-choose
      :disabled="true"
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

:::

### 2.6 选择商品 加入自定义参数params

:::demo 默认样式。

```html
<template>
  <div>
    <ody-product-store-series-choose
      v-model="ids"
      :selected.sync="selected"
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

### 2.6 选择商品 加入自定义多选按钮

:::demo 默认样式。

```html
<template>
  <div>
    <ody-product-store-series-choose
      v-model="ids"
      :selected.sync="selected"
      placeholder="请选择"
      :multiple="true"
      :params="params"
    >
      <ody-button code="ui" type="primary" size="small">我是自定义多选按钮</ody-button>
    </ody-product-store-series-choose>
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

## 3. 多选 + 查看

### 3.1 默认样式

:::demo 默认样式

```html
<template>
  <div>
    <ody-product-store-series-choose
      v-model="ruleForm.idList"
      :selected.sync="storeList"
      placeholder="请选择"
      :search-field="['channelCode', 'merchantId', 'id', 'storeName']"
      :result-field="['id', 'storeName', 'merchantName', 'mobile', 'contactName']"
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
          idList: []
        },
        storeList: []
      };
    }
  };
</script>
```

:::

### Base-Attributes

|      参数      |                            说明                             |  类型  | 必填  | 可选值 | 默认值 |
| -------------- | ----------------------------------------------------------- | ------ | ----- | ------ | ------ |
| v-model        | 选中的值                                                    | String | false | —      | ''     |
| selected       | 双绑，选中的 item                                           | Object | false | —      | {}     |
| valueKey       | 绑定数据 value 用于回显数据的时候一定要和 selected 一起使用 | String | false | —      | id     |
| labelKey       | 绑定数据 label                                              | String | false | —      | name   |
| params         | 可自定义传入限制参数                                        | Object | false | —      | {}     |
| disabledIdList | 禁用的Id列表                                                | Array  | false | —      | []     |
| limit | 限制选中的长度 | Number | false | - | Infinity |

### Other-Attributes
|   参数   |           说明           |  类型  | 必填  | 可选值 |  默认值   |
| -------- | ------------------------ | ------ | ----- | ------ | --------- |
| labelKey | 单选的时候绑定数据 label | String | false | —      | storeName |

### Events

| 事件名称 |         说明         | 回调参数 |
| -------- | -------------------- | -------- |
| open     | 打开                 | —        |
| ok       | 确定                 | —        |
| cancel   | 取消                 | —        |
| clear    | 清空                 | —        |
| delete   | 带查看的可以删除item | —        |