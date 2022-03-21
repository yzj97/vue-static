<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('收货任务数量')"
      width="600px"
      @open="init" > <!-- 修改收货数量 -->
      <section class="pg-editRemark">
        <el-form ref="form" :rules="rules" :model="dataForm" label-width="100px" class="form">
          <el-form-item :label="$t('收货任务数量')" >
            <el-col :span="12">
              <ody-input-number v-model="dataForm.receiveNum" :placeholder="$t('请输入收货任务数量')" :min="1" :max="999999" :step-strictly="true" name="dataForm_receiveNum" />
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
        receiveNum: this.product.receiveNum
      }
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    async handleOk(formName) {
      if (isNaN(this.dataForm.receiveNum) || !this.dataForm.receiveNum) {
        return
      }
      this.product.receiveNum = this.dataForm.receiveNum
      this.$emit('update:visible', !this.visible)
      this.$emit('ok')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
