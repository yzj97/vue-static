<template>
  <div>
    <ody-dialog
      :visible="returnVisible"
      :before-close="handleClose"
      :title="$t(''+ modalType)"
      @open="init" >
      <section class="pg-expressConfigSet-list">
        <el-form ref="ruleForm2" :model="ruleForm2" :rules="rules2" label-width="120px">
          <el-form-item :label="$t('third_channel')" prop="channelName">
            <el-input v-model="ruleForm2.channelName" name="ruleForm2_channelName" disabled="true" type="text"/>
          </el-form-item>
          <el-form-item :label="$t('area_code')" prop="areaCode">
            <el-input v-model="ruleForm2.areaCode" name="ruleForm2_areaCode" type="text"/>
          </el-form-item>
          <el-form-item :label="$t('third_area_code')">
            <el-input v-model="ruleForm2.channelAreaCode" name="ruleForm2_channelAreaCode" disabled="true" type="text" />
          </el-form-item>
          <el-form-item :label="$t('third_area_name')">
            <el-input v-model="ruleForm2.channelAreaName" name="ruleForm2_channelAreaName" disabled="true" type="text" />
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <el-button :disabled="submiting" name="OdtsAreaMapping_Save_handleOk" code="OdtsAreaMapping_Save" ype="primary" @click="handleOk('ruleForm2')">{{ $t('common_save') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>

export default {
  props: {
    returnVisible: {
      type: Boolean,
      default: false
    },
    selectedItem: {
      type: Object,
      default: null
    },
    modalType: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      ruleForm2: {
      },
      rules2: {
        channelCode: [
          { required: true, message: this.$t('please_choose_channel'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async init() {
      this.ruleForm2 = Object.assign({
        channelName: '', // 渠道名称
        channelCode: '', // 渠道编码
        areaCode: '', // 区域编码
        channelAreaCode: '', // 第三方区域编码
        channelAreaName: '' // 第三方区域名称
      }, this.selectedItem)
    },
    async handleOk(formName) {
      const vue = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          vue.submiting = true
          let promise = vue.$odts.$api.areaMp.areaMappingUpdate
          if (vue.modalType === 'add') {
            promise = vue.$odts.$api.areaMp.areaMappingAdd
          }
          const form = Object.assign({}, vue.ruleForm2)
          promise(form).then((res) => {
            vue.$message({
              type: 'success',
              message: this.$t('promptOperateSuccess')
            })
            vue.$emit('update:returnVisible', !this.returnVisible)
            this.$refs[formName].resetFields()
            vue.$emit('ok')
          }).catch((res) => {
            vue.$message({
              type: 'error',
              message: res.data
            })
          }).finally(() => {
            vue.submiting = false
          })
        }
      })
    },
    handleClose() {
      this.$emit('update:returnVisible', !this.returnVisible)
      this.$refs['ruleForm2'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
