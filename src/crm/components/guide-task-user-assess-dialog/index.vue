<template>
  <ody-dialog
    :title="$t('任务考核')"
    :visible.sync="visible"
    :before-close="handleBack"
    width="600px"
    @open="init">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" class="form">
      <el-form-item :label="$t('任务实际完成情况')" prop="finishNumber">
        <ody-input-number v-model="form.finishNumber" :decimal="2" :min="0" :max="9999999999.99" name="form_finishNumber"/>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button name="handleBack" size="small" @click="handleBack">{{ $t('cancel') }}</el-button>
      <ody-button name="CrmGuideTaskUser03_handleSave" code="CrmGuideTaskUser03" size="small" type="primary" @click="handleSave">{{ $t('save') }}</ody-button>
    </span>
  </ody-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: {
        id: '',
        finishNumber: ''
      },
      rules: {
        finishNumber: [
          { required: true, message: this.$t('请输入任务实际完成情况'), trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.form.id = this.item.id
      this.form.finishNumber = this.item.finishNumber
    },
    handleBack() {
      this.form.id = ''
      this.form.finishNumber = ''
      this.$emit('update:visible', !this.visible)
    },
    handleSave() {
      const vue = this
      vue.$refs['form'].validate((valid) => {
        if (valid) {
          vue.$crm.$api.staticUserGroup.updateGuideTaskUser(vue.form).then(res => {
            if (res.code === '0') {
              vue.$message.success(vue.$t('保存成功'))
              vue.handleBack()
              vue.$emit('ok')
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
