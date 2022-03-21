<template>
  <div style="height: 260px">
    <el-row>
      <span class="title">{{ $t('orderInvoiceInfo_invoice_info') }}</span><!--发票信息-->
    </el-row>
    <el-row v-if="!invoiceInfo.id" style="margin-top: 15px">
      <span class="detail">{{ $t('无发票信息') }}</span>
    </el-row>
    <el-row v-if="invoiceInfo.id" style="margin-top: 15px">
      <span class="detail">{{ $t('发票类型') }}：</span><span class="f14">{{ invoiceInfo.invoiceTypeStr }}</span>&nbsp;&nbsp;<el-link name="showInvoiceDetail" type="primary" @click="showInvoiceDetail">{{ $t('明细') }}</el-link>
      <el-row style="margin-top: 5px">
        <span class="detail">{{ $t('开票状态') }}：</span><span class="f14">{{ invoiceInfo.isInvoiceStr }}</span>
      </el-row>
      <el-row style="margin-top: 5px">
        <span class="detail">{{ $t('发票状态') }}：</span><span class="f14">{{ invoiceInfo.invoiceStatusStr }}</span>
      </el-row>
      <el-row style="margin-top: 5px">
        <span class="detail">{{ $t('发票抬头') }}：</span><span class="f14">{{ invoiceInfo.invoiceTitleContent }}</span>
      </el-row>
      <el-row style="margin-top: 5px">
        <span class="detail">{{ $t('发票内容') }}：</span><span class="f14">{{ invoiceInfo.invoiceContent ? invoiceInfo.invoiceContent : (invoiceInfo.isNeedDetails === 1 ? $t('明细') : '') }}</span>
      </el-row>
    </el-row>
    <ody-dialog v-if="invoiceInfo.id" :visible.sync="dialog.show" :title="$t('发票信息')">
      <el-row>
        <span class="detail">{{ $t('发票类型') }}：</span><span class="f14">{{ invoiceInfo.invoiceTypeStr }}</span>
      </el-row>
      <el-row style="margin-top: 5px">
        <span class="detail">{{ $t('发票内容') }}：</span><span class="f14">{{ invoiceInfo.invoiceContent ? invoiceInfo.invoiceContent : (invoiceInfo.isNeedDetails === 1 ? $t('明细') : '') }}</span>
      </el-row>
      <el-row style="margin-top: 5px">
        <span class="detail">{{ $t('开票形式') }}：</span><span class="f14">{{ invoiceInfo.invoiceModeStr }}</span>
      </el-row>
      <el-row style="margin-top: 5px">
        <span class="detail">{{ $t('发票抬头') }}：</span><span class="f14">{{ invoiceInfo.invoiceTitleContent }}</span>
      </el-row>
      <el-row style="margin-top: 5px">
        <span class="detail">{{ $t('纳税人识别码') }}：</span><span class="f14">{{ invoiceInfo.taxpayerIdentificationCode }}</span>
      </el-row>
      <el-row style="margin-top: 5px">
        <span class="detail">{{ $t('注册地址') }}：</span><span class="f14">{{ invoiceInfo.registerAddress }}</span>
      </el-row>
      <el-row style="margin-top: 5px">
        <span class="detail">{{ $t('注册电话') }}：</span><span class="f14">{{ invoiceInfo.registerPhone }}</span>
      </el-row>
      <el-row style="margin-top: 5px">
        <span class="detail">{{ $t('开户银行') }}：</span><span class="f14">{{ invoiceInfo.bankDeposit }}</span>
      </el-row>
      <el-row style="margin-top: 5px">
        <span class="detail">{{ $t('银行账户') }}：</span><span class="f14">{{ invoiceInfo.bankAccount }}</span>
      </el-row>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    orderCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      invoiceInfo: { },
      dialog: { show: false }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const self = this
      await this.$oms.$api.soInvoice.soInvoiceListWithItem({ filters: { orderCode: this.orderCode }}).then(res => {
        if (res.data && res.data.length > 0) {
          self.invoiceInfo = res.data[0]
        }
      })
    },
    showInvoiceDetail() {
      this.dialog.show = true
    }
  }
}
</script>

<style scoped>
  .f14{
    font-size: 14px;
  }
  .detail {
    font-size: 14px;
    font-weight:400;
    color:rgba(153,171,180,1);
  }
  .title{
    font-size: 14px;
    font-weight:700;
    color:rgba(69,90,100,1)
  }
</style>
