<template>
  <div class="pg-pre-sale-promotion">
    <ody-box :title="$route.path.indexOf('edit') > 0 ? $t('编辑预售促销活动') : $t('创建预售促销活动') ">
      <div v-if="steps <= 2">
        <el-steps :space="700" :active="steps" finish-status="success" align-center>
          <el-step :title="$t('设置活动规则')" />
          <el-step :title="$t('设置活动商家及店铺')" />
          <el-step :title="$t('设置活动商品')" />
        </el-steps>

        <promotion-pre-sale-step1
          v-if="steps === 0"
          ref="PromotionPreSaleStep1"
          :prom-type="promotionType"
          :promotion-id="promotionId"
        />
        <promotion-set-merchant-store
          v-if="steps === 1"
          ref="promotionSetMerchantStore"
          :prom-type="promotionType"
          :promotion-id="promotionId"
        />
        <promotion-presale-set-product
          v-if="steps === 2"
          ref="promotionSetProduct"
          :prom-type="promotionType"
          :promotion-id="promotionId"
        />
      </div>

      <promotion-created-success
        v-if="steps > 2"
        :prom-type="promotionType"
        :promotion-id="promotionId"
      />
    </ody-box>
    <ody-fixed v-if="steps <= 2">
      <ody-button
        v-if="steps !==0 && steps <= 2"
        name="handleBack"
        type="default"
        code="button014"
        @click="handleBack"
      >{{ $t('上一步') }}</ody-button>
      <ody-button
        v-if="steps >=0 && steps < 2"
        :disabled="submiting"
        name="handleNext"
        type="primary"
        code="button015"
        @click="handleNext"
      >{{ $t('下一步') }}</ody-button>
      <ody-button
        v-if="steps === 2"
        :disabled="submiting"
        name="handleComplete"
        type="primary"
        code="button016"
        @click="handleComplete"
      >{{ $t('完成') }}</ody-button>
    </ody-fixed>
  </div>
</template>
<script>
import PromotionPreSaleStep1 from '@/components/promotion-pre-sale-step1'
import PromotionPresaleSetProduct from '@/components/promotion-presale-set-product'
import PromotionSetMerchantStore from '@/components/promotion-set-merchant-store'
import PromotionCreatedSuccess from '@/components/promotion-created-success'

export default {
  name: 'PromPreSaleEdit',
  components: {
    PromotionPreSaleStep1,
    PromotionSetMerchantStore,
    PromotionPresaleSetProduct,
    // PromotionSingleSetProduct,
    PromotionCreatedSuccess
  },
  props: {
    basicInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      submiting: false,
      steps: 0,
      promotionType: '',
      promotionAPI: null,
      promotionId: ''
    }
  },
  created() {
    this.promotionType = parseInt(this.$route.params.promotionType, 10)
    this.promotionId = this.$route.params.promotionId || ''
    this.promotionAPI = this.$promotion.$api.promotion
  },
  mounted() {},
  methods: {
    handleCom() {
      console.log('preSalePromotion', this.preSalePromotion)
    },
    handleBack() {
      this.steps = --this.steps
    },
    async handleComplete() {
      this.submiting = true
      try {
        if (this.$refs.promotionSetProduct &&
          this.$refs.promotionSetProduct.$refs &&
          this.$refs.promotionSetProduct.$refs.mpTable &&
          this.$refs.promotionSetProduct.$refs.mpTable.tableData &&
          this.$refs.promotionSetProduct.$refs.mpTable.tableData.length > 0
        ) {
          let flag = false
          this.$refs.promotionSetProduct.$refs.mpTable.tableData.forEach(element => {
            if (!element.presellTotalPrice || !element.presellDownPrice || !element.presellOffsetPrice) {
              flag = true
            }
          })
          if (flag) {
            this.$message.error('商品的预售价，定金，定金抵扣金额必填')
            this.submiting = false
            return
          }
          const params = {
            id: this.$refs.promotionSetProduct.promotionId,
            isCommonPrice: true,
            promotionMethod: 17
          }
          this.promotionAPI.promotionPriceCheck(params).then(res => {
            if (res && res.code === '0' && res.data.errorMessage === null) {
              this.steps = ++this.steps
            } else {
              this.$message({
                type: 'warning',
                message: res.data.errorMessage
              })
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('促销商品不能为空')
          })
        }
      } finally {
        this.submiting = false
      }
    },
    handleNext() {
      const vue = this
      vue.submiting = true
      if (this.$refs.PromotionPreSaleStep1) {
        this.$refs.PromotionPreSaleStep1.$refs.preSalePromotion.validate(
          (valid, object) => {
            if (valid) {
              const {
                createTime: [createTimeStart, createTimeEnd],
                preSellTime: [preSellTimeStart, preSellEndTime],
                ...params
              } = vue.$refs.PromotionPreSaleStep1.preSalePromotion
              params.fromDate = createTimeStart
              params.endDate = createTimeEnd
              params.preSellStartTime = preSellTimeStart
              params.preSellEndTime = preSellEndTime
              if (this.promotionId === '') {
                this.promotionAPI.getAddPromotionUrl(params).then(res => {
                  if (res && res.code === '0') {
                    this.promotionId = res.data
                    this.steps = ++this.steps
                    vue.submiting = false
                  }
                })
              } else {
                this.promotionAPI.getUpdatePromotionUrl(params).then(res => {
                  if (res && res.code === '0') {
                    this.steps = ++this.steps
                    vue.submiting = false
                  }
                })
              }
            } else {
              this.scrollToView(this, object)
              vue.submiting = false
              console.log('error submit!!')
              return false
            }
          }
        )
      } else if (this.$refs.promotionSetMerchantStore) {
        const merchantLength = this.$refs.promotionSetMerchantStore
          .merchantTable.data.length
        const storeLength = this.$refs.promotionSetMerchantStore.storeTable.data
          .length

        if (merchantLength === 0 && storeLength === 0) {
          this.$message({
            type: 'warning',
            message: this.$t('请选择商家和店铺')
          })
        } else if (merchantLength === 0) {
          this.$message({
            type: 'warning',
            message: this.$t('请选择商家')
          })
        } else if (storeLength === 0) {
          this.$message({
            type: 'warning',
            message: this.$t('请选择店铺')
          })
        } else {
          this.steps = ++this.steps
        }
        vue.submiting = false
      } else {
        vue.submiting = false
        this.steps = ++this.steps
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.pg-single-promotion {
  .single-promotion-content {
    width: 800px;
  }
}
</style>

