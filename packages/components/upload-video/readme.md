## Upload-video

上传视频

:::demo 加载常量

```html
<template>
  <div>
    <div style="display:flex">
      <ody-upload-video v-model="video" />
      <ody-upload-image v-model="video.imagsrc" />
    </div>
    <div>
      <h6>显示上传数据</h6>
      <div>视频: {{ video }}</div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        video: {
          url: "",
          imagsrc: ""
        }
      };
    }
  };
</script>
<style>
  .upload-video-con {
    display: flex;
  }
</style>
```

:::

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
        <ody-upload-image v-model="ruleForm.image"></ody-upload-image>
      </el-form-item>
      <el-form-item label="视频" prop="video">
        <ody-upload-video v-model="ruleForm.video"></ody-upload-video>
      </el-form-item>
      <el-form-item>
        <ody-button code="ui" type="primary" @click="submitForm('ruleForm')"
          >立即创建</ody-button
        >
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
          image: "",
          video: ""
        },
        rules: {
          image: [
            {
              required: true,
              message: "请上传图片",
              trigger: "change"
            }
          ],
          video: [
            {
              required: true,
              message: "请上传视频",
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

### Attributes

| 参数    | 说明                          | 类型   | 必填  | 可选值 | 默认值 |
| ------- | ----------------------------- | ------ | ----- | ------ | ------ |
| v-model | ody-upload-video 绑定视频数据 | Object | false | —      | -      |