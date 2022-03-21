<template>
  <div class="button-box" style="padding-left: 10px;">
    <el-row >
      <span class="detail"><!--订单状态-->{{ $t('orderStatus') }}：</span><span>{{ status }}</span>
      <ody-svg-icon icon-class="more" />
      <el-link name="portal_openWindow" @click="$portal.openWindow('/oms-web/public/flow/chart?flow=SO_' + soDetail.orderType + '&flowCode=' + soDetail.orderCode,'FlowChart-SO-' + soDetail.orderCode)">&nbsp;</el-link>
    </el-row>

    <el-row style="margin-top: 20px;">
      <span v-if="isShowButton('cancel') && $portal.hasPermission('OmsOrderList_Cancel')" class="but">
        <cancel-order v-if="soDetail.orderCode " :order-code="soDetail.orderCode" @onSuccess="onSuccess"/>
      </span>
      <span v-if="isShowButton('edit') && $portal.hasPermission('OmsOrderList_Edit')" class="but">
        <edit v-if="soDetail " :so-detail="soDetail" @onSuccess="onSuccess" @queryOrderRemark="queryOrderRemark"/>
      </span>
      <span v-if="isShowButton('confirm') && $portal.hasPermission('OmsOrderList_Confirm')" class="but">
        <confirm-order v-if="soDetail " :order-id="soDetail.id" @onSuccess="onSuccess"/>
      </span>
      <span v-if="isShowButton('audit') && $portal.hasPermission('OmsOrderList_Audit') && !$portal.enableAppdflow('so', soDetail.merchantId)" class="but">
        <audit-order v-if="soDetail " :order-code="soDetail.orderCode" @onSuccess="onSuccess"/>
      </span>
      <span v-if="isShowButton('sendOut') && $portal.hasPermission('OmsOrderList_Dispatch')" class="but">
        <el-button name="showSendOut" type="primary" size="mini" @click="showSendOut" @onSuccess="onSuccess">{{ $t('发货') }}</el-button>
      </span>
      <span v-if="isShowButton('confirmSendSuccess') && $portal.hasPermission('OmsOrderList_Confirm_Receive')" class="but">
        <confirm-send-success v-if="soDetail " :order-id="soDetail.id" @onSuccess="onSuccess"/>
      </span>
      <span v-if="isShowButton('validateServiceCode') && $portal.hasPermission('OmsOrderList_Validate_Service_Code')" class="but">
        <validate-service-code v-if="soDetail " :order-id="soDetail.id" @onSuccess="onSuccess" @queryOrderRemark="queryOrderRemark"/>
      </span>
      <span v-if="isShowButton('modifyServiceTime') && $portal.hasPermission('OmsOrderList_Modify_Service_Time')" class="but">
        <modify-service-time v-if="soDetail " :order-id="soDetail.id" @onSuccess="onSuccess"/>
      </span>
      <span v-if="showCopyButton && $portal.hasPermission('OmsOrderList_Copy')" class="but">
        <copy-order v-if="soDetail" :order-code="soDetail.orderCode" @onSuccess="onSuccess"/>
      </span>
      <span v-if="isShowButton('offinePaymentVoucher') && $portal.hasPermission('offinePaymentVoucherBut')" class="but">
        <offine-payment-voucher :visible.sync="showOffinePayment" :order-code="soDetail.orderCode" />
        <el-button name="showOffinePaymentVoucher" type="primary" size="mini" @click="showOffinePaymentHandle">{{ $t('上传收款凭证') }}</el-button>
      </span>
    </el-row>
    <ody-dialog-full-right :visible.sync="sendOutShow" :title="$t('order_delivery')" @opened="handleOpen">
      <el-row>
        <!--<product-info v-if="codeMap " :so-info="soDetail" :code-map="codeMap"/>-->
        <delivery-opertion ref="deliveryOperation" :so-info="soDetail" @onSuccess="onSuccess" @ok="cancelSendOut"/>
      </el-row>
      <div slot="footer">
        <el-button name="cancelSendOut" @click="cancelSendOut">{{ $t('返回') }}</el-button>
      </div>
    </ody-dialog-full-right>
  </div>
</template>

<script>
import DeliveryOpertion from '@/components/deliveryOperation'
import Edit from '@/components/so/edit'
import CancelOrder from '@/components/so/cancelOrder'
import CopyOrder from '@/components/so/copyOrder'
import ConfirmOrder from '@/components/so/confirmOrder'
import AuditOrder from '@/components/so/auditOrder'
import ProductInfo from '@/components/productInfo'
import ConfirmSendSuccess from '@/components/so/confirmSendSuccess'
import SyncPackageDelivery from '@/components/so/syncPackageDelivery'
import ValidateServiceCode from '@/components/so/validateServiceCode'
import ModifyServiceTime from '@/components/so/modifyServiceTime'
import OffinePaymentVoucher from '@/components/so/offinePaymentVoucher'

export default {
  components: {
    DeliveryOpertion,
    Edit,
    CancelOrder,
    CopyOrder,
    ConfirmOrder,
    AuditOrder,
    ProductInfo,
    ConfirmSendSuccess,
    SyncPackageDelivery,
    ValidateServiceCode,
    ModifyServiceTime,
    OffinePaymentVoucher
  },
  props: {
    buttonKeys: {
      type: Object,
      default: function() {
        return []
      }
    },
    soDetail: {
      type: String,
      default: function() {
        return {}
      }
    },
    warehouseType: {
      type: Object,
      default: function() {
        return null
      }
    }
  },
  data() {
    return {
      status: null,
      sendOutShow: false,
      codeMap: {},
      copyOrderConfig: [],
      showCopyButton: false,
      showOffinePayment: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    queryOrderRemark() {
      this.$emit('queryOrderRemark')
    },
    async init() {
      const [resp1, resp2] = await Promise.all([
        this.$oms.$api.common.listByCategorysForOrder({ categorys: ['ORDER_STATUS', 'ITEM_STATUS'] }),
        this.$oms.$api.common.getStringValue({ key: 'copyOrderConfig', pool: 'oms' })
      ])
      this.codeMap = resp1.data
      this.status = this.getNameFromCodeMap(this.soDetail.orderStatus, resp1.data.ORDER_STATUS)
      this.copyOrderConfig = JSON.parse(resp2.data)
      this.initShowCopyButton()
    },
    initShowCopyButton() {
      const soTypes = this.copyOrderConfig[0].soTypes
      const channelCodes = this.copyOrderConfig[0].channelCodes
      if (soTypes.indexOf(this.soDetail.orderType) > -1 && channelCodes.indexOf(this.soDetail.sysSource) > -1) {
        this.showCopyButton = true
      } else {
        this.showCopyButton = false
      }
    },
    getNameFromCodeMap(code, codeMap) {
      let name = null
      if (codeMap) {
        codeMap.forEach(c => {
          if (c.code === code.toString()) {
            name = c.name
          }
        })
      }
      return name
    },
    isShowButton(key) {
      return this.buttonKeys.indexOf(key) >= 0
    },
    async showSendOut() {
      if (this.soDetail.orderType === 101 || this.soDetail.orderType === 106) {
        const result = await this.$oms.$api.so.allToDo({
          orderCode: this.soDetail.orderCode
        })
        if (result.data) {
          this.$alert(this.$t('订单商品已全部生成发货任务，请前往发货任务管理查看详细发货情况'), this.$t('promptSystemTips'))
          return
        }
      }
      this.sendOutShow = true
    },
    cancelSendOut() {
      this.onSuccess
      this.sendOutShow = false
    },
    handleOpen() {
      this.$refs.deliveryOperation.init()
    },
    async onSuccess() {
      this.sendOutShow = false
      await this.$oms.$api.so.soDetailGet({ orderCode: this.soDetail.orderCode }).then(res => {
        this.soDetail.orderStatus = res.data.so.orderStatus
        this.init()
      })
      this.$emit('onSuccess')
    },
    showOffinePaymentHandle() {
      const vm = this
      const { orderCode } = vm.soDetail || {}
      this.$oms.$api.soPayment.queryArOffineOrderList({
        currentPage: 1,
        itemsPerPage: 1,
        obj: {
          orderCode: orderCode
        }
      }).then(res => {
        if (res.code === '0') {
          const { total } = res.data || {}
          if (total > 0) {
            this.showOffinePayment = true
          } else {
            this.$message.error(this.$t('暂无线下销售数据，正在同步，请稍后') + '...')
          }
        }
      })
    }
  }
}
</script>

<style scoped>
  .detail {
    font-size: 14px;
    font-weight:400;
    color:rgba(153,171,180,1);
  }
  .but{
    display: inline-block;
    margin-bottom: 10px;
    margin-right: 4px;
  }
</style>
