<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('edit')"
      width="600px"
      @open="init" > <!-- 修改备注 -->
      <section class="pg-editRemark">
        <el-form ref="form" :rules="rules" :model="dataForm" label-width="100px" class="form">
          <el-form-item :label="$t('common_remark')" > <!-- 输入备注 -->
            <el-col :span="12">
              <el-input v-model="dataForm.remark" name="dataForm_remark" type="textarea" max-length="1000" />
            </el-col>
          </el-form-item>
        </el-form>

      </section>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="submiting" name="handleOk" size="small" type="primary" @click="handleOk('form')">{{ $t('ok') }}</el-button>
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_cancel') }}</el-button>
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
    product: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      submiting: false,
      dataForm: { }
    }
  },
  methods: {
    init() {
      this.dataForm = {
        remark: this.product.remark
      }
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    async handleOk(formName) {
      this.product.remark = this.dataForm.remark
      this.$emit('update:visible', !this.visible)
      this.$emit('ok')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
