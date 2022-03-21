<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('contract_contacts')"
      width="60%"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-position="right"
        label-width="240px"
      >
        <el-form-item :label="$t('contract_contacts')" prop="personName">
          <el-input v-model="formData.personName" name="formData_personName" maxlength="50" />
        </el-form-item>
        <el-form-item :label="$t('contract_contactsPosition')" prop="positionName">
          <el-input v-model="formData.positionName" name="formData_positionName" maxlength="50" />
        </el-form-item>
        <el-form-item :label="$t('contract_contactsPhone')" prop="fixedTelephone">
          <el-input v-model="formData.fixedTelephone" name="formData_fixedTelephone" maxlength="20" />
        </el-form-item>
        <el-form-item :label="$t('contract_contactsCellPhone')" prop="mobile">
          <el-input v-model="formData.mobile" name="formData_mobile" maxlength="20" />
        </el-form-item>
        <el-form-item :label="$t('contract_contactsEmail')" prop="email">
          <el-input v-model="formData.email" name="formData_email" maxlength="50" />
        </el-form-item>
        <el-form-item :label="$t('contract_addressDetail')" prop="addressDetail">
          <el-input v-model="formData.addressDetail" name="formData_addressDetail" maxlength="255" />
        </el-form-item>
        <el-form-item :label="$t('common_remark')">
          <el-input v-model="formData.remark" name="formData_remark" type="textarea" maxlength="255" show-word-limit />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <ody-button
          name="OpmsJxContractList14_handleOk"
          type="primary"
          code="OpmsJxContractList14"
          @click="handleOk"
        >{{ $t('common_confirm') }}</ody-button>
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
    contractId: {
      type: Number,
      default: null
    },
    formData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      rules: {
        personName: [
          {
            required: true,
            message: this.$t('please_enter'),
            trigger: 'change'
          }
        ],
        fixedTelephone: [
          {
            required: true,
            message: this.$t('please_enter'),
            trigger: 'change'
          },
          {
            pattern: /^[0-9]*$/,
            message: this.$t('contract_contact_check_fixedTelephone'),
            trigger: 'change'
          }
        ],
        mobile: [
          {
            required: true,
            message: this.$t('please_enter'),
            trigger: 'change'
          },
          {
            pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(1[6|7|8][0-9]))\d{8}$/,
            message: this.$t('contract_contact_check_mobile'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    handleOk() {
      const vue = this
      vue.$refs['formData'].validate(valid => {
        if (valid) {
          if (vue.formData.id) {
            vue.$opms.$api.jxContract.modifyContact(vue.formData).then(res => {
              if (res && res.code === '0') {
                vue.$message.success(vue.$t('save_success'))
                vue.$emit('update:visible', !this.visible)
                vue.$emit('ok', {})
              }
            })
          } else {
            vue.$opms.$api.jxContract.addContact(vue.formData).then(res => {
              if (res && res.code === '0') {
                vue.$message.success(vue.$t('save_success'))
                vue.$emit('update:visible', !this.visible)
                vue.$emit('ok', {})
              }
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
