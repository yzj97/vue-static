<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('common_audit')"
      width="60%"
      @open="init"
    >
      <el-form
        ref="auditForm"
        :rules="rules"
        :model="auditForm"
        label-position="right"
        label-width="100px"
      >
        <el-form-item :label="$t('findings_of_audit')" prop="status">
          <el-radio-group v-model="auditForm.status" name="auditForm_status">
            <el-radio :label="2">{{ $t('common_audit_pass') }}</el-radio>
            <el-radio :label="3">{{ $t('common_audit_not_pass') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="auditForm.status==3"
          :label="$t('review_of_the_reasons_for_rejection')"
          prop="message"
        >
          <el-input v-model="auditForm.message" name="auditForm_message" type="textarea" maxlength="100" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" @click="handleClose()">{{ $t('cancel') }}</el-button>
        <ody-button
          name="MerchantCategoryAuditInfo_submitForm"
          type="primary"
          code="MerchantCategoryAuditInfo"
          @click="submitForm('auditForm')"
        >{{ $t('common_confirm_search') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    ids: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      rules: {
        status: [
          {
            required: true,
            message: this.$t('please_select_the_audit_status'),
            trigger: 'blur'
          }
        ],
        message: [
          {
            required: true,
            message: this.$t('请输入审核拒绝原因'),
            trigger: 'change'
          }
        ]
      },
      auditForm: {
        categoryApplyIds: [],
        message: '',
        status: 2
      }
    }
  },
  computed: {
    ...mapGetters(['functions'])
  },
  methods: {
    handleClose() {
      this.$refs['auditForm'].resetFields()
      this.$emit('update:visible', !this.visible)
    },
    submitForm(auditForm) {
      this.$refs['auditForm'].validate(valid => {
        if (valid) {
          const merchantCategory = this.$product.$api.mpApi
          merchantCategory.auditCategoryApply(this.auditForm).then(result => {
            if (result && result.code === '0') {
              this.$emit('update:visible', !this.visible)
              this.$refs['auditForm'].resetFields()
              this.$emit('ok', [])
              this.$message({
                type: 'success',
                message: this.$t('common_operate_success')
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    init() {
      this.auditForm.categoryApplyIds = this.ids
    }
  }
}
</script>

<style scoped>
</style>
