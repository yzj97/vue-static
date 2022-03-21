<template>
  <div>
    <el-button name="showDialog" type="primary" size="mini" @click="showDialog">{{ $t('审核订单') }}</el-button>
    <ody-dialog :title="$t('审核订单')" :visible.sync="show" class="audit-dialog">
      <el-form ref="form" :rules="rules" :model="form" label-position="right" label-width="100px" class="audit-form">
        <el-form-item :label="$t('审核结果')+'：'" prop="status">
          <el-radio-group v-model="form.status" name="form_status">
            <el-radio
              v-for="item in auditStatus"
              :key="item.code"
              :label="item.code">
              {{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.status == '3' " prop="remark">
          <el-input
            v-model="form.remark"
            :rows="2"
            :placeholder="$t('备注')"
            name="form_remark"
            size="small"
            show-word-limit
            maxlength="100"
            type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button name="cancel" size="small" @click="cancel">{{ $t('取消') }}</el-button>
        <el-button name="commit" size="small" type="primary" @click="commit">{{ $t('确认') }}</el-button>
      </div>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    orderCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      show: false,
      auditStatus: [],
      form: {
        remark: null,
        status: '2'
      },
      rules: {
        status: [
          { required: true, message: this.$t('请选择审核结果'), trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const self = this
      this.$oms.$api.common.listByCategorysForOrder({ categorys: ['AUDIT_STATUS'] }).then(res => {
        self.auditStatus = []
        res.data.AUDIT_STATUS.forEach(i => {
          if (i.code !== '1') {
            self.auditStatus.push(i)
          }
        })
      })
    },
    cancel() {
      this.$refs['form'].resetFields()
      this.show = false
    },
    showDialog() {
      this.show = true
    },
    commit() {
      const self = this
      this.form.orderCodes = [this.orderCode]
      this.$refs['form'].validate((valid) => {
        if (valid) {
          self.$oms.$api.soAudit.orderAuditReview(self.form).then(res => {
            self.$message({
              message: self.$t('操作成功'),
              type: 'success'
            })
            self.onSuccess()
            self.cancel()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onSuccess() {
      this.$emit('onSuccess')
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/ .audit-dialog{
    .audit-form{
      .el-form-item{
        margin-bottom: 10px;
      }
    }
    .footer:before{
      height: 0px;
    }
  }
</style>
