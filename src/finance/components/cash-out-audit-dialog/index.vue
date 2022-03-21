<template>
  <section>
    <ody-dialog
      :title="$t('审核')"
      :visible.sync="visible"
      :before-close="handleBack"
      width="65%"
      @open="init">
      <el-form ref="form" :model="form" label-width="100px" class="form" >
        <el-form-item :label="$t('审核结果')" prop="auditStatus">
          <el-radio-group v-model="form.auditStatus" name="form_auditStatus" @change="handleRadioClick">
            <el-radio label="1">{{ $t('审核通过') }}</el-radio>
            <el-radio label="2">{{ $t('审核不通过') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('备注')" prop="remark">
          <el-input v-model="form.remark" name="form_remark" type="textarea" maxlength="200" show-word-limit/>
        </el-form-item>
        <div v-for="(site, index) in items" :key="index">
          <el-form-item v-if="form.auditStatus === '1'" :label="$t('转账流水号')" required>
            <el-input v-model="site.serialNumber" :placeholder="$t('请输入流水号')" name="site_serialNumber" maxlength="50" show-word-limit>
              <template slot="prepend">{{ $t('收款人账号') }}：{{ site.accountNo }}</template>
            </el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer">
        <ody-button name="FinanceCashOut02_handleSave" code="FinanceCashOut02" size="small" type="primary" @click="handleSave">{{ $t('确认') }}</ody-button>
        <el-button name="handleBack" size="small" @click="handleBack">{{ $t('取消') }}</el-button>
      </span>
    </ody-dialog>
  </section>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    items: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: {
        auditStatus: '1',
        remark: ''
      }
    }
  },
  methods: {
    init() {
    },
    handleBack() {
      this.form = {
        auditStatus: '1',
        remark: ''
      }
      this.$emit('update:visible', !this.visible)
    },
    handleRadioClick() {
      this.form.remark = ''
    },
    async handleSave() {
      const vue = this
      const reArr = []
      for (let ii = 0; ii < vue.items.length; ii++) {
        const thisItem = vue.items[ii]
        if (vue.form.auditStatus === '1' && !thisItem.serialNumber) {
          vue.$message({
            dangerouslyUseHTMLString: true,
            showClose: true,
            type: 'error',
            message: vue.$t('提现必须填写流水号')
          })
          return
        }
        reArr.push({
          id: thisItem.id,
          cashOutCode: thisItem.cashOutCode,
          auditStatus: vue.form.auditStatus,
          remark: vue.form.remark,
          receiptType: thisItem.receiptType,
          serialNumber: thisItem.serialNumber
        })
      }
      const reParam = { items: reArr }
      const res = await vue.$finance.$api.cashOut.audits(reParam)
      if (res.data && res.data.length > 0) {
        let successMessage = ''
        let failureMessage = ''
        res.data.map(item => {
          item.cashOutCode = item.cashOutCode ? item.cashOutCode : ''
          if (item.success === 1) {
            successMessage = successMessage + item.cashOutCode + '</br>'
          } else {
            failureMessage = failureMessage + item.cashOutCode + item.remark + '</br>'
          }
        })

        if (successMessage) {
          vue.$message({
            dangerouslyUseHTMLString: true,
            showClose: true,
            type: 'success',
            message: successMessage + vue.$t('操作成功')
          })
        }
        if (failureMessage) {
          vue.$message({
            dangerouslyUseHTMLString: true,
            showClose: true,
            type: 'error',
            message: failureMessage
          })
        }

        vue.form = {
          auditStatus: '1',
          remark: ''
        }
        vue.$emit('update:visible', !vue.visible)
        vue.$emit('ok')
      }
    }
  }
}
</script>

<style scoped>

</style>
