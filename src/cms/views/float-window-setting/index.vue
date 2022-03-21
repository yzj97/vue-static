<template>
  <section class="main-content">
    <el-form ref="form" :rules="rules" :model="form" label-width="180px">
      <el-form-item label="浮窗图片设置" prop="floatPic">
        <ody-upload-image
          v-model="form.floatPic"
          :pic-type="['jpg', 'jpeg', 'png']"
          :pic-size="4096"
          :show-tip="false"
        />
        <div class="tip">{{ $t('建议尺寸120*120PX，支持JPG、JPEG、PNG格式') }}</div>
      </el-form-item>
      <el-form-item label="跳转链接设置" prop="linkUrl">
        <el-input v-model="form.linkUrl" maxlength="500" show-word-limit />
      </el-form-item>
      <el-form-item label="展示位置" prop="showPosition">
        <el-radio-group v-model="form.showPosition">
          <el-radio v-for="item in positionArr" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
        <div class="tip">{{ $t('展示位置分别可以在商城首页手机屏幕的四个位置，只能选择一项') }}</div>
      </el-form-item>
      <el-form-item label="展示开关" prop="showSwitch">
        <el-radio-group v-model="form.showSwitch">
          <el-radio v-for="item in switchStatusArr" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
        <div class="tip">{{ $t('选择关闭后前端商城页浮窗消失') }}</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveHandle">保存</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
export default {
  name: 'FloatWindowSetting',
  data() {
    return {
      form: {
        floatPic: '',
        linkUrl: '',
        showPosition: 'leftTop',
        showSwitch: 1
      },
      positionArr: [{
        label: '左上',
        value: 'leftTop'
      }, {
        label: '左下',
        value: 'leftDown'
      }, {
        label: '右上',
        value: 'rightTop'
      }, {
        label: '右下',
        value: 'rightDown'
      }],
      switchStatusArr: [
        {
          label: '开',
          value: 1
        }, {
          label: '关',
          value: 0
        }
      ],
      rules: {
        floatPic: [{ required: true, message: '请设置浮窗图片', trigger: 'blur' }],
        linkUrl: [{ required: true, message: '请设置跳转链接', trigger: 'blur' }],
        showPosition: [{ required: true, message: '请选择展示位置', trigger: 'blur' }],
        showSwitch: [{ required: true, message: '请选择展示状态', trigger: 'blur' }]
      }
    }
  },
  created() {
    const vm = this
    vm.getInfo()
  },
  methods: {
    saveHandle() {
      const vm = this
      const params = vm.form
      vm.$refs['form'].validate((valid) => {
        if (valid) {
          console.log('continue')
          vm.$cms.$api.floatWindowSetting.updateLiveFloatWindow(params).then(res => {
            const { code, message } = res || {}
            if (code === '0') {
              vm.$message.success(vm.$t('提交成功'))
            } else {
              vm.$message.error(message)
            }
          })
        }
      })
    },
    getInfo() {
      const vm = this
      this.$cms.$api.floatWindowSetting.getLiveFloatWindow().then(res => {
        const { code, data } = res || {}
        if (code === '0' && data) {
          vm.form = data
        }
      })
    }
  }
}
</script>

<style scoped>
.main-content{
  width:600px;
}
  .tip{
   color: #ccc
  }
</style>
