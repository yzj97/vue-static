<template>
  <div class="orderDeatail-html">
    <el-row class="cp-box">
      <div class="detail-header-box">
        <div>
          <el-row style="margin-top: 25px" type="flex">
            <el-col :span="6">
              <buttons v-if="receiveDetail" :receive-detail.sync="receiveDetail" :button-keys="buttonKeys" @onSuccess="onSuccess"/>
            </el-col>
            <el-col :span="18" style="border-left: 1px solid #EEF5F9;padding-left: 44px;">
              <info v-if="receiveDetail" :receive-detail="receiveDetail"/>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-row>
    <el-row type="flex" style="margin-top: 20px;background-color: white;" class="cp-box">
      <el-col :span="6" style="padding: 20px;border-right: 1px solid #EEF5F9;">
        <delivery-info v-if="receiveDetail" ref="deliveryInfo" :receive-detail="receiveDetail"/>
      </el-col>
      <el-col :span="6" style="padding: 20px;border-right: 1px solid #EEF5F9;">
        <supplier-info v-if="receiveDetail" :receive-detail="receiveDetail"/>
      </el-col>
      <el-col :span="6" style="padding: 20px;border-right: 1px solid #EEF5F9;">
        <other-info v-if="receiveDetail" :receive-detail="receiveDetail"/>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px" >
      <mp-info
        v-if="receiveDetail"
        :receive-code.sync="receiveCode"
        @afterClick="init"
        @onSuccess="onSuccess"/>
    </el-row>
  </div>
</template>

<script>
import DeliveryInfo from '@/components/receiveTask/deliveryInfo'
import SupplierInfo from '@/components/receiveTask/supplierInfo'
import OtherInfo from '@/components/receiveTask/otherInfo'
import MpInfo from '@/components/receiveTask/mpInfo'
import Buttons from '@/components/receiveTask/buttons'
import Info from '@/components/receiveTask/info'

export default {
  components: {
    DeliveryInfo,
    OtherInfo,
    SupplierInfo,
    MpInfo,
    Buttons,
    Info
  },
  props: {
    receiveDetail: {
      type: Object,
      default: function() {
        return {}
      }
    },
    receiveCode: {
      type: String,
      default: null
    },
    buttonKeys: {
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

