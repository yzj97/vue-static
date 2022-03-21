<template>
  <section id="order-pay-info">
    <el-card>
      <el-form>
        <el-form-item :label="$t('paymentPayableAmount')+':'"> <!-- 应付金额 -->
          <span>{{ SoPayInfoVO.orderAmount + SoPayInfoVO.orderDeliveryFee + SoPayInfoVO.taxAmount }}</span>
        </el-form-item>
        <el-form-item :label="$t('paymentPaidAmount')+':'"> <!-- 已付金额 -->
          <span>{{ amountPaidTotal }}</span>
        </el-form-item>
        <el-form-item :label="$t('paymentType')+':'"> <!-- 支付类型 -->
          <span>{{ SoPayInfoVO.orderPaymentTypeName }}</span>
        </el-form-item>
        <el-form-item :label="$t('paymentStatus')+':'"> <!-- 支付状态 -->
          <span>{{ SoPayInfoVO.orderPaymentStatusName }}</span>
        </el-form-item>
      </el-form>
    </el-card>

    <ody-list-table-area>
      <div slot="table">
        <el-table v-loading="loading" :data="dataList" name="dataList946" style="width: 100%">
          <el-table-column :label="$t('paymentWay')" prop="paymentChannelStr"/>
          <el-table-column :label="$t('paymentAmount')" >
            <template slot-scope="scope" >
              {{ scope.row.originalAmount ? scope.row.originalAmount : scope.row.amount }}1111
            </template>
          </el-table-column>
          <el-table-column :label="$t('paymentTime')" prop="createTime"/>
          <el-table-column :label="$t('paymentSerialNumber')" prop="paymentNo"/>
        </el-table>
      </div>
    </ody-list-table-area>
  </section>
</template>

<script>
export default {
  props: {
    model: {
      type: String,
      default: null
    },
    orderCode: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      limit: 10,
      page: 1,
      total: 0,
      SoPayInfoVO: {},
      dataList: [],
      soOrderpayFllowVOS: [],
      amountPaidTotal: 0,
      loading: false
    }
  },
  created() {
    this.getPayInfo()
  },
  methods: {
    handleSearchSubmit() {
      this.getPayInfo()
    },
    handleSearchReset() {
    },

    handlePageSizeChange(value) {
      this.limit = value
      this.getPayInfo()
    },
    handlePageCurrentChange(value) {
      this.page = value
      this.getPayInfo()
    },

    getPayInfo() {
      this.loading = true
      const params = {
        orderCode: this.orderCode
      }
      this.$oms.$api.so.soPayInfoGetSoPayInfo(params).then(res => {
        this.total = res.total
        this.SoPayInfoVO = res.data
        this.dataList = res.data.soOrderpayFllowVOS
        this.soOrderpayFllowVOS = this.SoPayInfoVO.soOrderpayFllowVOS
        this.soOrderpayFllowVOS.forEach(item => {
          this.amountPaidTotal = Number(this.amountPaidTotal) + Number(item.originalAmount ? item.originalAmount : item.amount)
        })
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
