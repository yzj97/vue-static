## uploadImage

上传图片组件

## 1. 上传一张图

### 1.1 简单例子

:::demo 简单例子

```html
<template>
  <div>
    <ody-upload-image
      :disabled="true"
      :label="$t('更换视频封面')"
      v-model="fileUrl"
      :pic-type="picType"
      :show-tip="true"
    ></ody-upload-image>
    <h3>显示上传的数据</h3>
    <div>
      {{ fileUrl }}
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        fileUrl: "",
        picType: ["png"]
      };
    }
  };
</script>
```

:::

### 1.2 上传一张图 + 默认值

:::demo 上传一张图 + 默认值

```html
<template>
  <div>
    {{ fileUrl }}
    <ody-upload-image
      v-model="fileUrl"
      :pic-type="picType"
      :show-tip="true"
    ></ody-upload-image>
    <h3>显示上传的数据</h3>
    <div>
      {{ fileUrl }}
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        fileUrl:
          "http://cdn.oudianyun.com/trunk/back-cms-web/1572088646146_19.194684404722906_be1cb518-ef9d-47b4-a3c7-cd91b043c151.png@base@tag=imgScale&q=80",
        picType: ["png"]
      };
    }
  };
</script>
```

:::


### 1.2.1 验证pic-size

:::demo 验证pic-size

```html
<template>
  <div>
    <ody-upload-image
      v-model="fileUrl"
      :pic-type="picType"
      :pic-size="5120"
      :show-tip="true"
    ></ody-upload-image>
    <h3>显示上传的数据</h3>
    <div>
      {{ fileUrl }}
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        fileUrl:
          "http://cdn.oudianyun.com/trunk/back-cms-web/1572088646146_19.194684404722906_be1cb518-ef9d-47b4-a3c7-cd91b043c151.png@base@tag=imgScale&q=80",
        picType: ["png"]
      };
    }
  };
</script>
```

:::

### 1.2.2 上传一张图 + 默认值 + disabled

:::demo 上传一张图 + 默认值

```html
<template>
  <div>
    <ody-upload-image
      v-model="fileUrl"
      :disabled="true"
      :pic-type="picType"
      :show-tip="true"
    ></ody-upload-image>
    <h3>显示上传的数据</h3>
    <div>
      {{ fileUrl }}
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        fileUrl:
          "http://cdn.oudianyun.com/trunk/back-cms-web/1572088646146_19.194684404722906_be1cb518-ef9d-47b4-a3c7-cd91b043c151.png@base@tag=imgScale&q=80",
        picType: ["png"]
      };
    }
  };
</script>
```

:::

### 1.3 通过 fileList 显示上传数据

:::demo 只能上传 1 张, 只能上传 png, 显示 tip

```html
<template>
  <div>
    <ody-upload-image
      :file-list.sync="fileList"
      :pic-type="picType"
      :show-tip="true"
    ></ody-upload-image>
    <h3>显示上传的数据</h3>
    <div>
      {{ fileList }}
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        fileList: [],
        picType: ["png"]
      };
    }
  };
</script>
```

:::

### 1.4 上传一张图 + disabled

:::demo 只上传一张图

```html
<template>
  <div>
    <ody-upload-image
      v-model="fileUrl"
      :disabled="true"
      :pic-type="picType"
      :show-tip="true"
    ></ody-upload-image>
    <h3>显示上传的数据</h3>
    <div>
      {{ fileUrl }}
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        fileUrl: "",
        picType: ["png"]
      };
    }
  };
</script>
```

:::

### 1.5 在表单下支持自动 rule 验证

:::demo 和表单一起使用

```html
<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="图片" prop="image">
        <ody-upload-image
          v-model="ruleForm.image"
          :pic-type="['png']"
          :show-tip="true"
        ></ody-upload-image>
      </el-form-item>
      <el-form-item>
        <ody-button
          code="ui"
          type="primary"
          @click="submitForm('ruleForm')"
        >
          立即创建
        </ody-button>
        <ody-button code="ui" @click="resetForm('ruleForm')">重置</ody-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        ruleForm: {
          image: ""
        },
        rules: {
          image: [
            {
              required: true,
              message: "请上传图片",
              trigger: "change"
            }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            alert("submit!");
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>
```

:::

## 2. 上传 3 张图

### 2.1 简单例子

:::demo 简单例子

```html
<template>
  <div>
    <ody-upload-image
      v-model="fileUrl"
      :limit="3"
      :pic-type="picType"
      :show-tip="true"
    ></ody-upload-image>
    <h3>显示上传的数据</h3>
    <div>
      {{ fileUrl }}
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        fileUrl: [],
        picType: ["png"]
      };
    }
  };
</script>
```

:::

### 2.2 上传一张图 + 默认值

:::demo 上传一张图 + 默认值

```html
<template>
  <div>
    <ody-upload-image
      v-model="fileUrl"
      :limit="3"
      :pic-type="picType"
      :show-tip="true"
    ></ody-upload-image>
    <h3>显示上传的数据2.2</h3>
    <div>
      {{ fileUrl }}
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        fileUrl: [
          "http://cdn.oudianyun.com/trunk/back-cms-web/1572088646146_19.194684404722906_be1cb518-ef9d-47b4-a3c7-cd91b043c151.png@base@tag=imgScale&q=80"
        ],
        picType: ["png"]
      };
    }
  };
</script>
```

:::

### 2.2.1 上传可以拖动的图片 draggable

:::demo 上传十张图 + draggable

```html
<template>
  <div>
    <ody-upload-image
      v-model="fileUrl"
      :draggable="true"
      :limit="10"
      :pic-type="picType"
      :show-tip="true"
      :show-mian-mark="true"
    ></ody-upload-image>
    <h3>显示上传的数据</h3>
    <div>
      {{ fileUrl }}
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        fileUrl: [],
        picType: ["png"]
      };
    }
  };
</script>
```

:::



### 2.2.2 上传一张图 + 默认值 + disabled

:::demo 上传一张图 + 默认值

```html
<template>
  <div>
    <ody-upload-image
      v-model="fileUrl"
      :limit="3"
      :disabled="true"
      :pic-type="picType"
      :show-tip="true"
    ></ody-upload-image>
    <h3>显示上传的数据2.2</h3>
    <div>
      {{ fileUrl }}
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        fileUrl: [
          "http://cdn.oudianyun.com/trunk/back-cms-web/1572088646146_19.194684404722906_be1cb518-ef9d-47b4-a3c7-cd91b043c151.png@base@tag=imgScale&q=80"
        ],
        picType: ["png"]
      };
    }
  };
</script>
```

:::

### 2.3 通过 fileList 显示上传数据

:::demo 只能上传 1 张, 只能上传 png, 显示 tip

```html
<template>
  <div>
    <ody-upload-image
      :file-list.sync="fileList"
      :limit="3"
      :pic-type="picType"
      :show-tip="true"
    ></ody-upload-image>
    <h3>显示上传的数据</h3>
    <div>
      {{ fileList }}
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        fileList: [],
        picType: ["png"]
      };
    }
  };
</script>
```

:::

### 2.4 上传一张图 + disabled

:::demo 只上传一张图

```html
<template>
  <div>
    <ody-upload-image
      v-model="fileUrl"
      :limit="3"
      :disabled="true"
      :pic-type="picType"
      :show-tip="true"
    ></ody-upload-image>
    <h3>显示上传的数据</h3>
    <div>
      {{ fileUrl }}
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        fileUrl: [],
        picType: ["png"]
      };
    }
  };
</script>
```

:::

### 2.5 在表单下支持自动 rule 验证

:::demo 和表单一起使用

```html
<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="图片" prop="image">
        <ody-upload-image
          v-model="ruleForm.image"
          :limit="3"
          :pic-type="['png']"
          :show-tip="true"
        ></ody-upload-image>
      </el-form-item>
      <el-form-item>
        <ody-button 
          code="ui" 
          type="primary" 
          @click="submitForm('ruleForm')"
        >
          立即创建
        </ody-button>
        <ody-button code="ui" @click="resetForm('ruleForm')">重置</ody-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        ruleForm: {
          image: []
        },
        rules: {
          image: [
            {
              required: true,
              message: "请上传图片",
              trigger: "change"
            }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            alert("submit!");
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>
```

:::

### 3 自定义参数

:::demo 和表单一起使用

```html
<template>
  <div>
    <ody-upload-image
      v-model="fileUrl"
      :pic-type="picType"
      :show-tip="true"
      :url="url"
      :params="params"
    />
    {{ fileUrl }}
  </div>
</template>
<script>
  export default {
    data() {
      return {
        fileUrl: "",
        picType: ["png"],
        url: "/opms-web/omAttachFile/createFile.do",
        params: {
          file: "file",
          jsonParams: JSON.stringify({
            objectType: "3",
            objectCode: "SH1911040000151475"
          })
        }
      };
    }
  };
</script>
```

:::

## 4. 上传一张图

### 1.1 更换展示文字

:::demo 简单例子

```html
<template>
  <div>
    <ody-upload-image
      v-model="fileUrl"
      :pic-type="picType"
      :show-tip="true"
      label="更换封面"
    >
    </ody-upload-image>
    <h3>显示上传的数据</h3>
    <div>
      {{ fileUrl }}
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        fileUrl: "",
        picType: ["png"]
      };
    }
  };
</script>
```

:::

## 5. 上传一张图支持ico

### 5.1 更换展示文字

:::demo 简单例子

```html
<template>
  <div>
    <ody-upload-image
      v-model="fileUrl"
      :pic-type="picType"
      :show-tip="true"
    >
    </ody-upload-image>
    <h3>显示上传的数据</h3>
    <div>
      {{ fileUrl }}
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        fileUrl: "",
        picType: ["png", 'ico']
      };
    }
  };
</script>
```

:::

### Attributes

| 参数         | 说明                             | 类型         | 必填  | 可选值           | 默认值                                   |
| ------------ | -------------------------------- | ------------ | ----- | ---------------- | ---------------------------------------- |
| value(model) | 选中的 url                       | String/Array | false | —                | '' / limit = 1 默认 '' limit > 1 默认 [] |
| multiple     | 是否支持多选                     | Boolean      | false | —                | true                                     |
| limit        | 最大上传个数                     | Number       | false | —                | 1                                        |
| url          | 后台接口路径                     | String       | false | —                | '/api/cms-web/file/uploadFile.do'            |
| params       | 后台接口入参                     | String       | false | —                | 'Filedata'                               |
| fileList     | 上传图片列表                     | Array        | false | —                | []                                       |
| picType      | 图片格式                         | Array        | false | —                | ['png','jpg','bmp','gif', 'ico']                |
| picSize      | 图片大小（单位 kb）              | Number       | false | —                | 500                                      |
| listType     | 展示格式                         | String       | false | picture / button | 'picture'                                |
| disabled     | 是否禁用                         | boolean      | false | true / false     | false                                    |
| label        | 显示的文字,设置了则不显示 '+' 号 | String       | false | -                | ''                                       |
| draggable        | 上传图片多张支持拖拽 | Boolean       | false | -                | false                                      |
| showMianMark        | draggable为true时候使用 默认第一张为主图的提示 | Boolean       | false | -                | true                                      |

### Events

| 事件名称 | 说明             | 回调参数 |
| -------- | ---------------- | -------- |
| success  | 图片上传成功回调 |          |
| error    | 图片上传失败回调 |          |
| change   | 改变的时候回调   |          |
