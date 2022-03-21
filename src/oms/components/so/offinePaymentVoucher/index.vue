<template>
  <ody-dialog
    :visible="visible"
    :before-close="handleClose"
    :title="$t('上传收款凭证')"
    width="700px"
    @open="init">
    <div style="border-bottom: 1px solid #ccc;">
      <el-form label-width="100px">
        <el-row>
          <el-col :span="16">
            <el-form-item :label="$t('orderNumber') + '：'">
              <span>{{ orderPaymentInfo.orderCode }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('orderAmount') + '：'">
              <span>{{ orderPaymentInfo.orderPayableAmount }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('商家名称') + '：'">
              <span>{{ orderPaymentInfo.merchantName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('店铺名称') + '：'">
              <span>{{ orderPaymentInfo.storeName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('settlementCurrencyCode') + '：'">
              <span>{{ orderPaymentInfo.currencyCode || $t('人民币') }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="margin-top: 5px">
      <el-form ref="form" :rules="rules" :model="uploadVoucherObj" label-position="top">
        <el-form-item>
          <span>{{ $t('待结算金额') }}&nbsp;&nbsp;</span><span style="color: red">{{ orderPaymentInfo.payableAmount }}</span>
        </el-form-item>
        <el-form-item :label="$t('本次支付金额') + '：'" prop="paymentAmount">
          <el-input v-model="uploadVoucherObj.paymentAmount" :placeholder="$t('please_enter_the_amount_of_money')" name="paymentAmount" type="number" maxlength="10" @change="changePaymentAmount"/>
        </el-form-item>
        <el-form-item :label="$t('支付方式') + '：'" prop="receiverAccountType">
          <el-select v-model="uploadVoucherObj.receiverAccountType" :placeholder="$t('请选择')" name="receiverAccountType">
            <el-option v-for="item in receiverAccountTypeList" :key="item.code" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('转账流水') + '：'" prop="payerTransOrderNo">
          <el-input v-model="uploadVoucherObj.payerTransOrderNo" :placeholder="$t('请输入转账流水')" name="payerTransOrderNo" maxlength="20"/>
        </el-form-item>
        <el-form-item :label="$t('备注') + '：'" prop="remark">
          <el-input v-model="uploadVoucherObj.remark" name="remark" type="textarea" maxlength="100"/>
        </el-form-item>
        <el-form-item :label="$t('附件') + '：'" required>
          <el-upload
            :limit="3"
            :file-list="files"
            :before-remove="beforeFileRemove"
            :on-remove="handleFileRemove"
            :http-request="uploadFileFile"
            accept=".jpg,.png,.pdf"
            action="#">
            <!--:on-preview="handlePreview"-->
            <el-button v-if="uploadVoucherObj.paymentVoucherCode" size="small" type="primary">{{ $t('点击上传') }}</el-button>
            <div slot="tip" class="el-upload__tip">{{ $t('支持扩展名') }}：.jpg,.png,.pdf{{ $t('最多3个') }}</div>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <ody-dialog
      :visible="imgVisible"
      :title="$t('预览')"
      width="500px">
      <div style="width: 100%">
        <img :src="imgUrl" style="width: 100%">
      </div>
    </ody-dialog>
    <span slot="footer">
      <ody-button :disabled="!uploadVoucherObj.paymentVoucherCode" name="ui_submit" code="ui" size="small" type="primary" @click="doSubmit">{{ $t('确定') }}</ody-button>
      <ody-button name="ui_closeDialog" code="ui" size="small" @click="handleClose">{{ $t('取消') }}</ody-button>
    </span>
  </ody-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderCode: {
      type: String,
      required: true
    }
  },
  data() {
    const vue = this
    var validatePaymentAmount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(vue.$t('支付金额') + vue.$t('不能为空')))
      } else if (value <= 0 || value > this.orderPaymentInfo.payableAmount) {
        callback(new Error('支付金额必须大于0并且小于等于待结算金额'))
      } else {
        callback()
      }
    }
    return {
      files: [],
      loading: false,
      imgUrl: null,
      canSubmit: true,
      imgVisible: false,
      orderPaymentInfo: {},
      merchantAccountInfoParam: {},
      uploadVoucherObj: {},
      searchForm: getDefaultSearchForm(),
      receiverAccountTypeList: [
        { code: 1, name: this.$t('支付宝') },
        { code: 2, name: this.$t('微信') },
        { code: 3, name: this.$t('银行') }
      ],
      rules: {
        paymentAmount: [
          { required: true, message: this.$t('本次支付金额') + this.$t('不能为空'), trigger: 'blur' },
          { validator: validatePaymentAmount, trigger: 'blur' }
        ],
        receiverAccountType: [
          { required: true, message: this.$t('请选择') + this.$t('支付方式'), trigger: 'blur' }
        ],
        payerTransOrderNo: [
          { required: true, message: this.$t('支付流水') + this.$t('不能为空'), trigger: 'blur' }
        ]
      }
    }
  },
  async mounted() {
    try {
      if (this.visible) {
        await this.init()
      }
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async init() {
      this.files = []
      this.orderPaymentInfo = {}
      this.uploadVoucherObj = {}
      this.merchantAccountInfoParam = {}
      const res = await this.$oms.$api.soPayment.queryArOffineOrderList({
        currentPage: 1,
        itemsPerPage: 1,
        obj: {
          orderCode: this.orderCode
        }
      })
      if (res && res.data && res.data.listObj && res.data.listObj.length > 0) {
        this.orderPaymentInfo = res.data.listObj[0]
      } else {
        this.$message.error(this.$t('暂无线下销售数据，正在同步，请稍后') + '...')
        return
      }
      this.merchantAccountInfoParam = {
        businessOrderCode: this.orderPaymentInfo.orderCode,
        merchantId: this.orderPaymentInfo.merchantId,
        merchantName: this.orderPaymentInfo.merchantName,
        orderPayableAmount: this.orderPaymentInfo.orderPayableAmount,
        payableAmount: this.orderPaymentInfo.payableAmount,
        storeName: this.orderPaymentInfo.storeName,
        currencyCode: this.orderPaymentInfo.currencyCode,
        customerName: this.orderPaymentInfo.customerName
      }
      const accountInfo = await this.$oms.$api.soPayment.queryMerchantAccountInfo(this.merchantAccountInfoParam)
      if (accountInfo && accountInfo.data) {
        this.uploadVoucherObj = accountInfo.data
      }
      this.selectAttachList()
    },
    uploadFileFile(params) {
      const vue = this
      const form = new FormData()
      form.append('file', params.file)
      form.append('jsonParams', '{ attachmentType: 1, businessOrderCode: "' + this.uploadVoucherObj.paymentVoucherCode + '" }')
      this.$oms.$api.soPayment.uploadAttachFile(form).then(res => {
        vue.selectAttachList()
      })
    },
    handlePreview(file) {
      this.imgUrl = file.url
      this.imgVisible = true
    },
    selectAttachList() {
      if (!this.uploadVoucherObj.paymentVoucherCode) {
        return
      }
      const vue = this
      this.$oms.$api.soPayment.selectAttachList({ attachmentType: 1, businessOrderCode: this.uploadVoucherObj.paymentVoucherCode }).then(res => {
        if (res && res.data) {
          const fileList = []
          res.data.forEach((item, index) => {
            fileList.push({ id: item.id, name: item.attachmentName, url: item.attachmentUrl })
          })
          vue.files = fileList
        }
      })
    },
    handleFileRemove(file) {
      if (file == null || file.id == null) {
        return
      }
      const vue = this
      this.$oms.$api.soPayment.deleteAttach({ ids: [file.id] }).then(res => {
        vue.selectAttachList()
      })
    },
    doSubmit() {
      const vue = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!(vue.files != null && vue.files.length > 0)) {
            vue.$message(this.$t('附件不能为空'))
            return false
          }
          vue.submit()
        } else {
          return false
        }
      })
    },
    async submit() {
      if (!this.canSubmit) {
        return
      }
      const params = {
        autoAudit: true,
        businessOrderCode: this.uploadVoucherObj.businessOrderCode,
        paymentVoucherCode: this.uploadVoucherObj.paymentVoucherCode,
        paymentAmount: this.uploadVoucherObj.paymentAmount,
        payableAmount: this.uploadVoucherObj.payableAmount,
        receiverAccountType: this.uploadVoucherObj.receiverAccountType,
        receiverAccountNo: this.uploadVoucherObj.receiverAccountNo,
        receiverEnterpriseName: this.uploadVoucherObj.receiverEnterpriseName,
        receiverBankName: this.uploadVoucherObj.receiverBankName,
        receiverSubBankName: this.uploadVoucherObj.receiverSubBankName,
        payerTransOrderNo: this.uploadVoucherObj.payerTransOrderNo,
        remark: this.uploadVoucherObj.remark
      }
      this.canSubmit = false
      try {
        const res = await this.$oms.$api.soPayment.insertArPaymentVoucher(params)
        if (res) {
          // this.init()
          this.handleClose()
        }
      } finally {
        this.canSubmit = true
      }
    },
    beforeFileRemove(file) {
      return this.$confirm(this.$t('确定移除吗') + file.name + '？')
    },
    handleClose() {
      this.visible = false
      this.$emit('update:visible', false)
    },
    changePaymentAmount(val) {
      if (val) {
        // 保留两位小数
        const index = (val + '').indexOf('.')
        if (index > 0 && (val + '').length > index + 3) {
          this.uploadVoucherObj.paymentAmount = parseFloat((val + '').substring(0, index + 3))
        }
      }
    }
  }
}
function getDefaultSearchForm() {
  return {}
}
</script>

<style scoped>

</style>
