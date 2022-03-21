<template>
  <div>
    <el-button name="validate" type="primary" size="mini" @click="visible = true">{{ $t('修改服务时间') }}</el-button>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('修改上门服务时间')"
      width="800px"
      @open="init" > <!-- 修改服务时间 -->
      <section class="pg-editserviceDateTime">
        <el-form ref="form" :rules="rules" :model="dataForm" class="form">
          <el-row>
            <el-form-item :label="$t('上门服务时间：')" label-width="120px" required>
              <el-col :span="9">
                <el-form-item :rules="rules.serviceDate" prop="serviceDate"> <!-- 服务时间 -->
                  <el-date-picker
                    v-model="dataForm.serviceDate"
                    :placeholder="$t('please_choose')"
                    name="dataForm_serviceDate"
                    size="small"
                    type="date"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :rules="rules.serviceTime" prop="serviceTime">
                  <el-time-picker
                    v-model="dataForm.serviceTime"
                    :range-separator="$t('至')"
                    :start-placeholder="$t('开始时间')"
                    :end-placeholder="$t('结束时间')"
                    name="dataForm_serviceTime"
                    value-format="HH:mm:00"
                    format="HH:mm"
                  />
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-row>
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
    orderId: {
      type: Number,
      default: null
    }
  },
  data: function() {
    const self = this
    const validateDateTime = (rule, value, callback) => {
      if (self.dataForm.serviceDate && self.dataForm.serviceTime) {
        var datetime = new Date(self.dataForm.serviceDate + ' ' + self.dataForm.serviceTime)
        if (new Date() > datetime) {
          callback(new Error(self.$t('输入的时间需大于当前时间')))
          return
        }
      }
      callback()
    }
    return {
      submiting: false,
      visible: false,
      dataForm: {
        serviceDate: null,
        serviceTime: null
      },
      rules: {
        serviceDate: [
          { required: true, message: this.$t('required'), trigger: 'change' },
          { required: true, validator: validateDateTime, trigger: 'change' }
        ],
        serviceTime: [
          { required: true, message: this.$t('required'), trigger: 'change' },
          { required: true, validator: validateDateTime, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init() {
      this.dataForm = {
        serviceDate: null,
        serviceTime: null
      }
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    handleClose() {
      this.visible = !this.visible
    },
    async handleOk(formName) {
      const self = this
      this.submiting = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          self.$oms.$api.so.modifyServiceTime({
            id: self.orderId,
            serviceDate: self.dataForm.serviceDate,
            serviceTimeStart: self.dataForm.serviceTime
          }).then(res => {
            self.$message({
              message: self.$t('修改成功'),
              type: 'success'
            })
            self.onSuccess()
            self.handleClose()
          }).finally((res) => {
            self.submiting = false
          })
        } else {
          self.submiting = false
        }
      })
    },
    onSuccess() {
      this.$emit('onSuccess')
    }
  }
}
</script>

<style scoped>

</style>
