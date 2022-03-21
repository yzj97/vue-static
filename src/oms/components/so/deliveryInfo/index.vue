<template>
  <div style="height: 260px;">
    <el-row>
      <slot>
        <el-col :span="24">
          <span class="title"><!--收货信息-->{{ $t('receipt_information') }}</span>
        </el-col>
        <el-col :span="24" style="margin-top: 15px">
          <span class="detail"><!--买家名称-->{{ $t('buyer') }}：</span><span class="f14">{{ soDetail.buyerName }}</span>
        </el-col>
        <el-col :span="24" style="margin-top: 5px">
          <span class="detail"><!--收货人-->{{ $t('consignee') }}：</span><span class="f14">{{ soDetail.goodReceiverName }}</span>
        </el-col>
        <el-col :span="24" class="receive-wrap">
          <span class="detail receive-address"><!--收货地址-->{{ $t('receiving_address') }}：</span>
          <span class="f14 word">{{ (soDetail.goodReceiverProvince ? soDetail.goodReceiverProvince : '') + '' + (soDetail.goodReceiverCity ? soDetail.goodReceiverCity : '') + '' + (soDetail.goodReceiverArea ? soDetail.goodReceiverArea : '') + '' + (soDetail.goodReceiverAddress ? soDetail.goodReceiverAddress : '') }}</span>
        </el-col>
        <el-col :span="24" style="margin-top: 5px">
          <span class="detail">{{ $t('手机号码') }}：</span><span class="f14">{{ soDetail.goodReceiverMobile }}</span>
        </el-col>
      </slot>
    </el-row>
    <el-row>
      <el-col :span="24">
        <!--买家备注-->
        <el-input
          :placeholder="$t('manual_order_customer_remark')"
          v-model="remark.orderRemarkUser"
          name="remark_orderRemarkUser"
          type="textarea"
          disabled
          style="margin-top: 15px;"
      /></el-col>
      <!--卖家备注-->
      <el-col :span="24">
        <el-input
          :placeholder="$t('sellers_notes')"
          v-model="remark.orderRemarkMerchant"
          name="remark_orderRemarkMerchant"
          type="textarea"
          disabled
          style="margin-top: 5px;"
      /></el-col>
    </el-row>
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
      // 买家备注  and   卖家备注
      remark: { orderRemarkUser: this.$t('manual_order_customer_remark'), orderRemarkMerchant: this.$t('sellers_notes') }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    queryOrderRemark() {
      this.init()
    },
    init() {
      const self = this
      this.$oms.$api.so.soAnnexAndRemarksGet({ orderCode: this.soDetail.orderCode }).then(res => {
        if (res.data.orderRemarkMerchant) {
          // 卖家备注
          self.remark.orderRemarkMerchant = this.$t('sellers_notes') + '：' + res.data.orderRemarkMerchant
        } else {
          // 卖家备注
          self.remark.orderRemarkMerchant = this.$t('sellers_notes')
        }
        if (res.data.orderRemarkUser) {
          // 买家备注
          self.remark.orderRemarkUser = this.$t('manual_order_customer_remark') + '：' + res.data.orderRemarkUser
        } else {
          // 买家备注
          self.remark.orderRemarkUser = this.$t('manual_order_customer_remark')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/ .el-textarea__inner{
    border:none;
    resize: none;
  }
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
.receive-wrap{
  margin-top: 5px;
  display: flex;

  .receive-address{
    display: inline-block;
    min-width: 70px;
  }
}
  .word{
    word-break:break-all;
    word-wrap:break-word
  }

</style>
