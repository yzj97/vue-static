<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('新增导购设备')"
      width="50%"
      @open="init"
    >
      <el-form
        ref="guideDeviceForm"
        :model="guideDeviceForm"
        :rules="rules"
        label-position="right"
        label-width="80px"
      >
        <el-form-item :label="$t('微信号')" prop="alias">
          <el-input v-model="guideDeviceForm.alias" :placeholder="$t('请输入微信号')" name="guideDeviceForm_alias" maxlength="50" />
        </el-form-item>
        <el-form-item :label="$t('设备编号')" prop="deviceNo">
          <el-input v-model="guideDeviceForm.deviceNo" :placeholder="$t('请输入设备编号')" name="guideDeviceForm_deviceNo" maxlength="50" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <ody-button name="ui_handleClose" code="ui" @click="handleClose()">{{ $t('common_back') }}</ody-button>
        <ody-button name="ui_submitForm" code="ui" type="primary" @click="submitForm('guideDeviceForm')">{{ $t('common_save') }}</ody-button>
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
      guideDeviceForm: {
        wechatId: null,
        deviceNo: null
      },
      rules: {
        alias: [
          {
            required: true,
            message: this.$t('请输入微信号'),
            trigger: 'change'
          }
        ],
        deviceNo: [
          {
            required: true,
            message: this.$t('请输入设备编号'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    handleClose() {
      this.$refs['guideDeviceForm'].resetFields()
      this.$emit('update:visible', !this.visible)
    },
    submitForm(guideDeviceForm) {
      this.$refs[guideDeviceForm].validate(valid => {
        if (valid) {
          const guideDeviceRequest = this.$crm.$api.guideDevice
          guideDeviceRequest
            .addGuideDevice(this.guideDeviceForm)
            .then(result => {
              if (result && result.code === '0') {
                this.$emit('update:visible', !this.visible)
                this.$emit('ok', [])
                this.$refs[guideDeviceForm].resetFields()
                this.$message({
                  type: 'success',
                  message: this.$t('common_save_success')
                })
              }
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async init() {
      try {
        this.guideDeviceForm = {
          alias: null,
          deviceNo: null
        }
      } catch (ex) {
        console.log(ex)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
