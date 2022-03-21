<template>
  <div>
    <ody-dialog :visible.sync="visible" :title="$t('审核')" width="600px" @close="handleCancel" @open="init">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="160px"
        class="form"
      >
        <el-form-item :label="$t('审核结果')" prop="status">
          <el-radio-group v-model="form.status" name="dialogData_status">
            <el-radio :label="1">{{ $t('审核通过') }}</el-radio>
            <el-radio :label="2">{{ $t('审核不通过') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row v-if="form.status=== 2" class="row_class">
          <el-form-item prop="remark">
            <el-input
              v-model="form.remark"
              name="form_remark"
              type="textarea"
              placeholder
              maxlength="100"
              show-word-limit
              rows="3"
            />
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer">
        <div class="line-top" />
        <el-button name="AuditDialog_cancel" size="small" @click="handleCancel">{{ $t('取消') }}</el-button>
        <ody-button
          name="AuditDialog_confirm"
          size="small"
          type="primary"
          code="ui"
          @click="handleSubmit"
        >{{ $t('确定') }}</ody-button>
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
    }
  },
  data() {
    return {
      form: {
        status: 1,
        remark: ''
      },
      rules: {
        status: [{ required: true, message: '请选择审核结果', trigger: ['blur', 'change'] }],
        remark: [{ required: true, message: '请输入审核不通过原因', trigger: ['blur', 'change'] }]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.form.status = 1
      this.form.remark = ''
    },
    handleCancel() {
      this.visible = false
      this.$emit('update:visible', this.visible)
    },
    async handleSubmit() {
      if (this.form.status === 2) {
        if (!this.form.remark) {
          this.$message.warning(this.$t('请输入审核不通过原因'))
          return
        }
      }
      this.$emit('update:visible', !this.visible)
      this.$emit('ok', this.form)
    }
  }
}
</script>

<style scoped>

</style>
