<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('so_error_mark_handled')"
      width="600px"
      @open="init" >
      <section class="pg-soErrorMarkHandled-list">
        <el-form ref="form" :rules="rules" :model="dataForm" label-width="100px" class="form">
          <el-form-item :label="$t('so_error_handle_remark')" prop="remark">
            <el-input v-model="dataForm.remark" name="dataForm_remark" type="textarea" />
          </el-form-item>
        </el-form>

      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <el-button :disabled="submiting" name="handleOk" size="small" type="primary" @click="handleOk('form')">{{ $t('ok') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    ids: {
      type: Array,
      default: null
    },
    remark: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      submiting: false,
      dataForm: {},
      rules: {
        remark: [
          { required: true, type: 'string', message: this.$t('required'), trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init() {
      this.dataForm = {
        remark: this.remark,
        ids: this.ids
      }
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    async handleOk(formName) {
      const vue = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          vue.submiting = true
          const promise = vue.$oms.$api.soError.soErrorHandle
          const form = Object.assign({}, vue.dataForm)
          promise(form).then((res) => {
            if (res.code === '0') {
              vue.$message({
                type: 'success',
                message: this.$t('so_error_mark_success')
              })
              vue.$emit('update:visible', !this.visible)
              vue.$emit('ok')
            } else {
              vue.$message({
                type: 'error',
                message: res.message
              })
            }
          }).finally(() => {
            vue.submiting = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
