<template>
  <div class="orderDeatail-html">
    <el-row class="cp-box">
      <div class="detail-header-box">
        <div class="detail-header-small-box">
          <title-info v-if="soDetail.so" :step-info.sync="stepInfo" :order-status="soDetail.so.orderStatus"/>
        </div>
        <div>
          <el-row style="margin-top: 25px" type="flex">
            <el-col :span="6">
              <buttons v-if="soDetail.so" :so-detail="soDetail.so" :button-keys="buttonKeys" :warehouse-type="soDetail.noWarehouse" @onSuccess="onSuccess" @queryOrderRemark="queryOrderRemark"/>
            </el-col>
            <el-col :span="18" style="border-left: 1px solid #EEF5F9;padding-left: 44px;">
              <info v-if="soDetail.so" :so-detail="soDetail.so"/>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-row>
    <el-row class="cp-box mt20">
      <!-- 审批流程进度 -->
      <div v-if="soDetail.so.orderStatus == 1040 && $portal.enableAppdflow('so', soDetail.so.merchantId)">
        <ody-appdflow-progress :biz-code="soDetail.so.orderCode" type-code="so" shadow="never" />
      </div>
    </el-row>
    <el-row v-if="soDetail.so" style="background-color: white;" class="cp-box">
      <package-info v-if="soDetail.so" :order-code="soDetail.so.orderCode"/>
    </el-row>
    <el-row type="flex" style="margin-top: 20px;background-color: white;" class="cp-box">
      <el-col :span="5" style="padding: 20px;border-right: 1px solid #EEF5F9;">
        <delivery-info v-if="soDetail.so" ref="deliveryInfo" :so-detail="soDetail.so"/>
      </el-col>
      <el-col :span="6" style="padding: 20px;border-right: 1px solid #EEF5F9;">
        <schedule-info v-if="soDetail.so && soDetail.so.orderType === 105" :so-detail="soDetail.so"/>
        <distribution-info v-else-if="soDetail.so" :so-detail="soDetail.so"/>
      </el-col>
      <el-col :span="5" style="padding: 20px;border-right: 1px solid #EEF5F9;">
        <pay-info v-if="soDetail.so" :so-detail="soDetail.so"/>
      </el-col>
      <el-col :span="5" style="padding: 20px;border-right: 1px solid #EEF5F9;">
        <invoice-info v-if="soDetail.so" :order-code="soDetail.so.orderCode"/>
      </el-col>
      <el-col :span="4" style="padding: 20px">
        <other-info v-if="soDetail.so" :so-detail="soDetail.so"/>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px" >
      <mp-info
        v-if="soDetail.so"
        :so-detail="soDetail.so"
        :warehouse-type="soDetail.noWarehouse"
        :coupons="soDetail.coupons"
        :promotions="soDetail.promotions"
        @afterClick="init"
        @onSuccess="onSuccess"/>
    </el-row>
  </div>
</template>

<script>
import DeliveryInfo from '@/components/so/deliveryInfo'
import ScheduleInfo from '@/components/so/scheduleInfo'
import DistributionInfo from '@/components/so/distributionInfo'
import PayInfo from '@/components/so/payInfo'
import InvoiceInfo from '@/components/so/invoiceInfo'
import PackageInfo from '@/components/so/packageInfo'
import TitleInfo from '@/components/so/titleInfo'
import MpInfo from '@/components/so/mpInfo'
import Buttons from '@/components/so/buttons'
import Info from '@/components/so/info'
import OtherInfo from '@/components/so/otherInfo'

export default {
  components: {
    DeliveryInfo,
    ScheduleInfo,
    DistributionInfo,
    PayInfo,
    InvoiceInfo,
    PackageInfo,
    TitleInfo,
    MpInfo,
    Buttons,
    Info,
    OtherInfo
  },
  props: {
    soDetail: {
      type: Object,
      default: function() {
        return {}
      }
    },
    buttonKeys: {
      type: Object,
      default: function() {
        return []
      }
    },
    stepInfo: {
      type: Object,
      default: function() {
        return []
      }
    }
  },
  methods: {
    queryOrderRemark() {
      this.$refs['deliveryInfo'].queryOrderRemark()
    },
    onSuccess() {
      this.$emit('onSuccess')
    }
  }
}
</script>
<style scoped>

  /deep/ .detail-header-box{
    padding: 32px 20px 0 20px;
    background: white;
  }
  /deep/ .detail-header-small-box{
           height:110px;
    border-bottom: 1px solid #EEF5F9 ;
         }
  .mt20{
    margin-top: 20px;
  }
</style>

