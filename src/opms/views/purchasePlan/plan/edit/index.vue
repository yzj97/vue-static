<template>
  <section>
    <el-row>
      <el-col :span="24">
        <el-form ref="purchasePlanDetail" :inline="true" :model="formData" :rules="rules">
          <BasicInfo
            :form-data.sync="formData"
            :is-edit.sync="isEdit"
            :platform-id.sync="platformId"
            :attachments.sync="attachments"
          />

          <ProductInfo
            ref="productInfo"
            :form-data.sync="formData"
            :table-data.sync="tableData"
            :is-edit.sync="isEdit"
            :platform-id.sync="platformId"
          />
        </el-form>
      </el-col>
    </el-row>
    <ody-fixed>
      <ody-button
        name="OpmsPurchasePlanSave_handleSubmit"
        size="small"
        type="primary"
        code="OpmsPurchasePlanSave"
        @click="handleSubmit"
      >{{ $t('common_save') }}</ody-button>
      <el-button name="returnBack" size="small" @click="returnBack">{{ $t('common_return') }}</el-button>
    </ody-fixed>
  </section>
</template>

<script>
import BasicInfo from '@/components/purchase/plan/BasicInfo'
import ProductInfo from '@/components/purchase/plan/ProductInfo'
import dateUtil from '@/utils/dateUtil'

export default {
  name: 'OpmsPurchasePlanEdit',
  components: {
    BasicInfo,
    ProductInfo
  },
  data() {
    return {
      isEdit: true,
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
      },
      rules: {
        planDate: [
          {
            required: true,
            message: this.$t('common_choose_date'),
            trigger: 'change'
          },
          {
            required: true,
            message: this.$t('common_choose_date'),
            trigger: 'blur'
          }
        ]
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
        vue.platformId = result.data.platformId
      }
      return Promise.resolve()
    },
    init() {
      const vue = this

      const params = vue.$route.params
      if (params.id) {
        vue.formData.id = params.id
        vue.$opms.$api.purchasePlan
          .getPurchasePlan({ id: params.id })
          .then(result => {
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
                item.expectReceiveDateText = dateUtil.dateFormatForTime(
                  item.expectReceiveDate,
                  false
                )
                item.purchaseTaxRateText = item.purchaseTaxRate
                  ? item.purchaseTaxRate * 100
                  : item.purchaseTaxRate
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
      this.formData.planDate = [
        purchasePlan.planStartDate,
        purchasePlan.planExpiryDate
      ]
      this.formData.planStartDate = dateUtil.dateFormatForTime(
        purchasePlan.planStartDate,
        false
      )
      this.formData.planExpiryDate = dateUtil.dateFormatForTime(
        purchasePlan.planExpiryDate,
        false
      )
    },
    handleSubmit() {
      const vue = this
      if (!vue.tableData.productList || vue.tableData.productList.length <= 0) {
        vue.$message({
          type: 'warning',
          message: this.$t('purchase_request_template_check_product')
        })
        return
      }

      vue.$refs['purchasePlanDetail'].validate(valid => {
        if (valid) {
          vue.$refs.productInfo.validateProduct(function() {
            if (vue.platformId === 1) {
              const params = { purchasePlanItemsList: [] }
              for (const index in vue.tableData.productList) {
                const item = vue.tableData.productList[index]
                if (item.minOrderQuantity) {
                  if (item.approvedPurchaseNum < item.minOrderQuantity) {
                    vue.$message({
                      type: 'error',
                      message:
                        vue.$t('changeOrder_order_product_on') +
                        (Number(index) + 1) +
                        vue.$t('purchase_plan_check_min_approved_num')
                    })
                    return
                  }
                }

                params.purchasePlanItemsList.push({
                  id: item.id,
                  approvedPurchaseNum: item.approvedPurchaseNum
                })
              }
              vue.$opms.$api.purchasePlan.updateItems(params).then(result => {
                if (result && result.code === '0') {
                  vue.$message({
                    type: 'success',
                    message: vue.$t('common_update_success')
                  })
                  vue.returnBack()
                }
              })
            } else {
              for (const index in vue.tableData.productList) {
                const item = vue.tableData.productList[index]
                if (item.minOrderQuantity) {
                  if (item.applyPurchaseNum < item.minOrderQuantity) {
                    vue.$message({
                      type: 'error',
                      message:
                        vue.$t('changeOrder_order_product_on') +
                        (Number(index) + 1) +
                        vue.$t('purchase_plan_check_min_purchase_num')
                    })
                    return
                  }
                }
              }

              const params = {}
              params.purchasePlanItemsList = []
              params.attachmentList = []
              Object.assign(params, vue.formData)
              Object.assign(
                params.purchasePlanItemsList,
                vue.tableData.productList
              )
              Object.assign(params.attachmentList, vue.attachments)
              params.purchasePlanItemsList.forEach((item, index) => {
                delete item.suppliers
                item.id = null
              })
              params.planStartDate = params.planDate[0]
              params.planExpiryDate = params.planDate[1]
              delete params.planDate

              const updatePurchasePlan =
                vue.$opms.$api.purchasePlan.updatePurchasePlan
              updatePurchasePlan(params).then(result => {
                if (result && result.code === '0') {
                  vue.$message({
                    type: 'success',
                    message: vue.$t('common_update_success')
                  })
                  vue.returnBack()
                }
              })
            }
          })
        } else {
          return false
        }
      })
    },
    returnBack() {
      this.$portal.delActiveViewAndRefresh()
    }
  }
}
</script>

<style lang="scss" scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
