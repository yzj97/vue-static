<template>
  <section>
    <el-row>
      <el-col :span="24">
        <el-form ref="purchasePlanDetail" :model="formData" :inline="true" label-width="140px">
          <BasicInfo v-loading="!formData.id" :form-data.sync="formData" :is-edit.sync="isEdit" :platform-id.sync="platformId" :attachments.sync="attachments" />

          <ProductInfo
            ref="productInfo"
            :form-data.sync="formData"
            :table-data.sync="tableData"
            :is-edit.sync="isEdit"
            :platform-id.sync="platformId"/>
        </el-form>
      </el-col>
    </el-row>
    <ody-fixed>
      <el-button name="returnBack" size="small" @click="returnBack">{{ $t('common_return') }}</el-button>
    </ody-fixed>
  </section>
</template>

<script>
import BasicInfo from '@/components/purchase/plan/BasicInfo'
import ProductInfo from '@/components/purchase/plan/ProductInfo'
import dateUtil from '@/utils/dateUtil'
import numberUtil from '@/utils/numberUtil'

export default {
  name: 'OpmsPurchasePlanDetail',
  components: {
    BasicInfo,
    ProductInfo
  },
  data() {
    return {
      isEdit: false,
      platformId: null,
      formData: {
        merchantId: '',
        merchantCode: '',
        merchantName: '',
        planCode: '',
        planType: '1',
        planDate: []
      },
      attachments: [],
      tableData: {
        productList: []
      }
    }
  },
  mounted() {
    const vue = this
    vue.initPlatformId().then(() => {
      vue.init()
    })
  },
  methods: {
    async initPlatformId() {
      const vue = this
      const result = await vue.$opms.$api.common.getDomainInfo()
      if (result.data && result.code === '0') {
        this.platformId = result.data.platformId
      }
      return Promise.resolve()
    },
    init() {
      const vue = this

      const params = vue.$route.params
      if (params.id) {
        vue.formData.id = params.id
        vue.$opms.$api.purchasePlan.getPurchasePlan({ id: params.id }).then((result) => {
          if (result.code === '0' && result.data) {
            vue.initPlanInfo(result.data)
            vue.attachments = result.data.attachmentList
            result.data.purchasePlanItemsList.forEach((item, index) => {
              item.suppliers = []
              item.suppliers.push({
                id: item.defaultSupplierId,
                supplierCode: item.defaultSupplierCode,
                supplierName: item.defaultSupplierName
              })
              item.expectReceiveDateText = dateUtil.dateFormatForTime(item.expectReceiveDate, false)
              item.actualPurchaseNum = item.actualPurchaseNum ? item.actualPurchaseNum : 0
              item.unPurchaseNum = numberUtil.sub(item.approvedPurchaseNum, item.actualPurchaseNum)
              item.purchaseTaxRateText = item.purchaseTaxRate ? item.purchaseTaxRate * 100 + '%' : item.purchaseTaxRate
            })
            vue.tableData.productList = result.data.purchasePlanItemsList
          }
        })
      }
    },
    initPlanInfo(purchasePlan) {
      this.formData.planCode = purchasePlan.planCode
      this.formData.merchantId = purchasePlan.merchantId
      this.formData.merchantName = purchasePlan.merchantName
      this.formData.merchantCode = purchasePlan.merchantCode
      this.formData.executionStatus = purchasePlan.executionStatus
      this.formData.executionStatusText = purchasePlan.executionStatusText
      this.formData.merchantApprovalStatus = purchasePlan.merchantApprovalStatus
      this.formData.id = purchasePlan.id
      this.formData.planType = String(purchasePlan.planType)
      this.formData.planTypeText = purchasePlan.planTypeText
      this.formData.planDate = [purchasePlan.planStartDate, purchasePlan.planExpiryDate]
      this.formData.planStartDate = dateUtil.dateFormatForTime(purchasePlan.planStartDate, false)
      this.formData.planExpiryDate = dateUtil.dateFormatForTime(purchasePlan.planExpiryDate, false)
    },
    returnBack() {
      this.$portal.delActiveViewAndRefresh()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
