<template>
  <div style="height:260px;">
    <el-row>
      <span class="title"><!--配送信息-->{{ $t('distribution_information') }}</span>
    </el-row>
    <el-row style="margin-top: 15px">
      <span class="detail"><!--配送方式-->{{ $t('distribution_mode') }}：</span><span class="f14">{{ orderDeliveryMethod }}</span>
    </el-row>
    <el-row style="margin-top: 8px">
      <span class="detail"><!--运费-->{{ $t('freight') }}：</span><span class="f14">{{ soDetail.orderDeliveryFee.toFixed(2) }}</span>
    </el-row>
    <el-row style="margin-top: 8px">
      <span class="detail"><!--期望配送时间-->{{ $t('期望配送时间') }}：</span><span class="f14">{{ expectDeliverDateStr }}</span>
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
      orderDeliveryMethodId: '',
      orderDeliveryMethod: '',
      expectDeliverDateStr: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const self = this
      if (this.soDetail.expectDeliverDate) {
        this.expectDeliverDateStr = this.soDetail.expectDeliverDate.replace(' 00:00:00', '')
      }
      this.$oms.$api.distributionModeItem.distributionModeItemListForSelect({ }).then(res => {
        res.data.forEach(d => {
          if (self.soDetail.orderDeliveryMethodId === d.shippingCode) {
            self.orderDeliveryMethod = d.distributionMode
            self.orderDeliveryMethodId = self.soDetail.orderDeliveryMethodId
          }
        })
      })
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
