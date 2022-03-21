<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :modal-append-to-body="false"
      width="50%"
      @open="init"
    >
      <section>
        <el-form
          ref="editNameForm"
          :model="editNameForm"
          :rules="rules"
          label-width="120px"
          class="form"
        >
          <el-form-item :label="this.$t('product_name')" prop="chineseName">
            <el-input v-model="editNameForm.chineseName" name="editNameForm_chineseName" maxlength="100" />
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('cancel') }}</el-button>
        <ody-button
          v-if="dataType===1"
          name="PlatformMerchantProductUpdateName_submitForm"
          size="small"
          type="primary"
          code="PlatformMerchantProductUpdateName"
          @click="submitForm('editNameForm')"
        >{{ $t('common_confirm_search') }}</ody-button>
        <ody-button
          v-if="dataType===2"
          name="MerchantProductManageUpdateName_submitForm"
          size="small"
          type="primary"
          code="MerchantProductManageUpdateName"
          @click="submitForm('editNameForm')"
        >{{ $t('common_confirm_search') }}</ody-button>
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
    name: {
      type: String,
      default: null
    },
    id: {
      type: Number,
      default: null
    },
    dataType: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      editNameForm: {
        id: null,
        chineseName: null
      },
      rules: {
        chineseName: [
          {
            required: true,
            message: this.$t('请输入商品名称'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', !this.visible)
      this.$refs['editNameForm'].resetFields()
    },
    init() {
      this.editNameForm.id = this.id
      this.editNameForm.chineseName = this.name
    },
    submitForm(editNameForm) {
      this.$refs['editNameForm'].validate(valid => {
        if (valid) {
          if (this.dataType === 1) {
            this.$product.$api.mpApi
              .updatePlatformMpNameById(this.editNameForm)
              .then(result => {
                if (result && result.code === '0') {
                  this.$emit('update:visible', !this.visible)
                  this.$refs['editNameForm'].resetFields()
                  this.$emit('ok', [])
                }
              })
          } else {
            this.$product.$api.mpApi
              .updateMerchantProductNameById(this.editNameForm)
              .then(result => {
                if (result && result.code === '0') {
                  this.$emit('update:visible', !this.visible)
                  this.$refs['editNameForm'].resetFields()
                  this.$emit('ok', [])
                }
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
