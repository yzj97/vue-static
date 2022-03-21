<template>
  <section>
    <el-form ref="editCertForm" :model="editCertForm" :rules="rules">
      <ody-dialog
        :visible="visible"
        :before-close="handleClose"
        :title="$t('common_' + modalType)"
        width="35%"
        @open="init"
      >
        <div style="margin-left: 15%">
          <el-form-item :label="$t('purchaseCertificate_type')" prop="name">
            <el-input v-model="editCertForm.name" name="editCertForm_name" style="width: 230px" maxlength="50" />
          </el-form-item>
          <el-form-item :label="$t('purchaseCertificate_txt')" prop="needCert">
            <el-radio-group v-model="editCertForm.needCert" name="editCertForm_needCert">
              <el-radio label="1">{{ $t('common_required_upload') }}</el-radio>
              <el-radio label="0">{{ $t('common_unrequired_upload') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('purchaseCertificate_valid_date')" prop="needExpiryDate">
            <el-radio-group v-model="editCertForm.needExpiryDate" name="editCertForm_needExpiryDate">
              <el-radio label="1">{{ $t('common_required') }}</el-radio>
              <el-radio label="0">{{ $t('common_unrequired') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('common_explain')" prop="descr">
            <el-input v-model="editCertForm.descr" :rows="2" name="editCertForm_descr" type="textarea" maxlength="20" />
          </el-form-item>
          <div style="margin-left: 20%">
            <el-form-item>
              <ody-button
                name="OpmsPurchaseCertificateList05_onSubmit"
                type="primary"
                code="OpmsPurchaseCertificateList05"
                @click="onSubmit"
              >{{ $t('common_save') }}</ody-button>
              <el-button name="handleClose" @click="handleClose">{{ $t('common_cancel') }}</el-button>
            </el-form-item>
          </div>
        </div>
      </ody-dialog>
    </el-form>
  </section>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    modalType: {
      type: String,
      required: true
    },
    selectedItem: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      editCertForm: {
        name: null,
        needCert: '0',
        needExpiryDate: '0',
        descr: null
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('purchaseCertificate_please_add'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    init() {
      if (this.modalType === 'edit') {
        this.editCertForm = {}
        this.selectedItem.needCert = this.selectedItem.needCert + ''
        this.selectedItem.needExpiryDate = this.selectedItem.needExpiryDate + ''
        this.editCertForm = Object.assign({}, this.selectedItem)
      } else {
        this.editCertForm.name = ''
        this.editCertForm.needCert = '0'
        this.editCertForm.needExpiryDate = '0'
        this.editCertForm.descr = ''
      }
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
      this.visible = false
    },
    async onSubmit() {
      let promise
      if (this.modalType === 'create') {
        this.editCertForm.isDisable = 0
        promise = await this.$opms.$api.purchaseCert.addCert(this.editCertForm)
      } else {
        promise = await this.$opms.$api.purchaseCert.updateCert(
          this.editCertForm
        )
      }
      if (promise) {
        this.$emit('ok')
        this.handleClose()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
