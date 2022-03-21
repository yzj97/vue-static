<template>
  <div style="height: 260px">
    <el-row>
      <span class="title">{{ $t('订单金额信息') }}</span>
    </el-row>
    <el-row style="margin-top: 15px">
      <span class="detail">{{ $t('state_of_payment') }}：</span><span class="f14">{{ payInfo.orderPaymentStatusName }}</span>&nbsp;&nbsp;<el-link name="showPayDetail" type="primary" @click="showPayDetail"><!--明细-->{{ $t('detailed') }}</el-link>
    </el-row>
    <el-row style="margin-top: 15px">
      <span class="detail">{{ $t('付款类型') }}：</span><span class="f14">{{ payInfo.orderPaymentTypeName }}</span>
    </el-row>
    <el-row v-if="payInfo.paymentChannelStr" style="margin-top: 5px">
      <span class="detail"><!--支付方式-->{{ $t('payment_method') }}：</span><span class="f14">{{ payInfo.paymentChannelStr }}</span>
    </el-row>
    <el-row v-if="payInfo.createTime" style="margin-top: 5px">
      <span class="detail"><!--支付时间-->{{ $t('paymentTime') }}：</span><span class="f14">{{ payInfo.createTime }}</span>
    </el-row>
    <ody-dialog :visible.sync="dialog.show" :title="$t('payment_details') + (isParent ? $t('（父订单）') : '')" width="1000px"><!--支付明细-->
      <el-row class="pay-detail">
        <el-col :span="10">
          <span class="detail"><!--应付金额-->{{ $t('costWithTaxAmt') }}：</span><span class="f14">{{ (payInfo.orderAmount + payInfo.orderDeliveryFee + payInfo.taxAmount).toFixed(2) }}</span>
        </el-col>
        <el-col span="10" style="margin-top: 5px">
          <span class="detail"><!--已付金额-->{{ $t('jx_paidAmt') }}：</span><span class="f14">{{ payInfo.amountPaidTotal.toFixed(2) }}</span>
        </el-col>
        <el-col span="10" style="margin-top: 5px">
          <span class="detail">{{ $t('付款类型') }}：</span><span class="f14">{{ payInfo.orderPaymentTypeName }}</span>
        </el-col>
        <el-col span="10" style="margin-top: 5px">
          <span class="detail"><!--支付状态-->{{ $t('state_of_payment') }}：</span><span class="f14">{{ payInfo.orderPaymentStatusName }}</span>
        </el-col>
      </el-row>
      <el-row>
        <ody-table
          :data="payInfo.soOrderpayFllowVOS"
          :columns="dialog.columns"
          :multiple="false"
          name="payInfo_soOrderpayFllowVOS805"
        />
      </el-row>
      <span slot="footer">
        <el-button name="hidePayDialog" size="small" @click="hidePayDialog">{{ $t('关闭') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>
<script>
export default {
  props: {
    soDetail: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      isParent: false,
      dialog: {
        show: false,
        columns: [
          {
            label: this.$t('payment_method'), // 支付方式
            prop: 'paymentChannelStr',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('amount_of_payment'), // 支付金额
            prop: 'amount',
            show: true,
            align: 'center',
            formatter(row, column) {
              if (row.originalAmount) {
                return row.originalAmount
              }
              return row.amount
            }
          },
          {
            label: this.$t('paymentTime'), // 支付时间
            prop: 'createTime',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('paymentSerialNumber'), // 支付流水号
            prop: 'paymentNo',
            show: true,
            align: 'center'
          }
        ]
      },
      payInfo: { soOrderpayFllowVOS: [], amountPaidTotal: 0 }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const self = this
      // 有父订单则根据父订单查询支付流水，没有则查询当前支付流水
      this.isParent = this.soDetail.parentOrderCode && this.soDetail.parentOrderCode !== '0'
      const orderCode = this.isParent ? this.soDetail.parentOrderCode : this.soDetail.orderCode
      this.$oms.$api.so.soPayInfoGetSoPayInfo({ orderCode: orderCode }).then(res => {
        self.payInfo = res.data
        self.payInfo.amountPaidTotal = 0
        if (self.payInfo.soOrderpayFllowVOS && self.payInfo.soOrderpayFllowVOS.length > 0) {
          self.payInfo.soOrderpayFllowVOS.forEach(i => {
            self.payInfo.amountPaidTotal += (i.originalAmount ? i.originalAmount : i.amount)
          })
          self.payInfo.paymentChannelStr = self.payInfo.soOrderpayFllowVOS[0].paymentChannelStr
          self.payInfo.createTime = self.payInfo.soOrderpayFllowVOS[0].createTime
        }
      })
    },
    showPayDetail() {
      this.dialog.show = true
    },
    hidePayDialog() {
      this.dialog.show = false
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
  .pay-detail{
    text-indent: 20px;
    margin-bottom: 20px
  }

</style>
