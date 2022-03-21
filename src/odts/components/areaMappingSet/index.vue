<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t(''+ modalType)"
      @open="init" >
      <section class="pg-expressConfigSet-list">
        <el-form ref="ruleForm2" :model="ruleForm2" :rules="rules2" label-width="120px">
          <el-form-item :label="$t('third_channel')" prop="channelCode">
            <el-select v-model="ruleForm2.channelCode" :placeholder="$t('请选择')" name="ruleForm2_channelCode">
              <el-option v-for="item in channelList" :label="item.channelName" :key="item.channelCode" :value="item.channelCode" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('area_code')" prop="areaCode">
            <el-input v-model="ruleForm2.areaCode" name="ruleForm2_areaCode" type="text"/>
          </el-form-item>
          <el-form-item :label="$t('third_area_code')">
            <el-input v-model="ruleForm2.channelAreaCode" name="ruleForm2_channelAreaCode" type="text" />
          </el-form-item>
          <el-form-item :label="$t('third_area_name')">
            <el-input v-model="ruleForm2.channelAreaName" name="ruleForm2_channelAreaName" type="text" />
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <ody-button :disabled="submiting" name="OdtsAreaMapping_Save_handleOk" code="OdtsAreaMapping_Save" type="primary" @click="handleOk('ruleForm2')">{{ $t('common_save') }}</ody-button>
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
    modalType: {
      type: String,
      default: 'add'
    },
    channelList: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      ruleForm2: {
        channelCode: '', // 渠道编码
        channelName: '', // 渠道名称
        areaCode: '', // 区域编码
        channelAreaCode: '', // 第三方区域编码
        channelAreaName: '' // 第三方区域名称
      },
      rules2: {
        channelCode: [
          { required: true, message: this.$t('please_choose_channel'), trigger: 'blur' }
        ],
        areaCode: [
          { required: true, message: this.$t('please_write_area_code'), trigger: 'blur' }
        ],
        channelAreaCode: [
          { required: true, message: this.$t('please_write_channel_area_code'), trigger: 'blur' }
        ]
      },
      applicationAuthList: []
    }
  },
  methods: {
    async init() {
      this.initVariable(this)
    },
    initVariable(vue) {
      const params = {}
      vue.$odts.$api.areaMp.queryAuthConfigList(params).then(function(res) {
        if (res && res.code === '0') {
          vue.applicationAuthList = res.data
        }
      })
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
          vue.channelList.forEach(item => {
            if (item.channelCode === vue.ruleForm2.channelCode) {
              vue.ruleForm2.channelName = item.channelName
              return
            }
          })
          const form = {
            areaCode: vue.ruleForm2.areaCode,
            channelCode: vue.ruleForm2.channelCode,
            channelAreaCode: vue.ruleForm2.channelAreaCode,
            channelAreaName: vue.ruleForm2.channelAreaName,
            channelName: vue.ruleForm2.channelName
          }
          promise(form).then((res) => {
            console.log(JSON.stringify(res))
            if (res && res.code === '0') {
              vue.$message({
                type: 'success',
                message: this.$t('promptOperateSuccess')
              })
              vue.$emit('update:visible', !this.visible)
              this.$refs[formName].resetFields()
              vue.$emit('ok')
            }
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
      this.$emit('update:visible', !this.visible)
      this.$refs['ruleForm2'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
