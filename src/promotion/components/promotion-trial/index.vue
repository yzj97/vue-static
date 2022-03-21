<template>
  <div class="pg-single-promotion">
    <ody-box :title="$route.path.indexOf('edit') > 0 ? $t('编辑试用活动') : $t('创建试用活动')">
      <div v-if="steps <= 2">
        <el-steps :space="700" :active="steps" finish-status="success" align-center>
          <el-step :title="$t('设置促销规则')" />
          <el-step :title="$t('设置促销商家及店铺')" />
          <el-step :title="$t('设置促销商品')" />
        </el-steps>

        <trial-management-step1
          v-if="steps === 0"
          ref="singlePromotionStep1"
          :prom-type="promotionType"
          :promotion-id="promotionId"
        />
        <promotion-set-merchant-store
          v-if="steps === 1"
          ref="promotionSetMerchantStore"
          :prom-type="promotionType"
          :promotion-id="promotionId"
        />
        <trial-management-product
          v-if="steps === 2"
          ref="trialManagementProduct"
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
        name="handleNext"
        type="primary"
        code="button015"
        @click="handleNext"
      >{{ $t('下一步') }}</ody-button>
      <ody-button
        v-if="steps === 2"
        name="handleComplete"
        type="primary"
        code="button016"
        @click="handleComplete"
      >{{ $t('完成') }}</ody-button>
    </ody-fixed>
  </div>
</template>

<script>
import TrialManagementStep1 from '@/components/trial-management-step1'
import PromotionSetMerchantStore from '@/components/promotion-set-merchant-store'
import TrialManagementProduct from '@/components/trial-management-product'
import PromotionCreatedSuccess from '@/components/promotion-created-success'

export default {
  components: {
    TrialManagementStep1,
    PromotionSetMerchantStore,
    TrialManagementProduct,
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
      steps: 0,
      promotionType: '',
      promotionAPI: null,
      promotionId: ''
    }
  },
  created() {
    this.promotionType = this.$route.params.promotionType
    this.promotionId = this.$route.params.promotionId
    this.promotionAPI = this.$promotion.$api.promotion
  },
  mounted() {},
  methods: {
    handleCom() {
      console.log('singlePromotion', this.singlePromotion)
    },
    handleBack() {
      this.steps = --this.steps
    },
    async handleComplete() {
      const res = await this.$refs.trialManagementProduct.isCanSave()
      if (res.data.flag) {
        this.steps = ++this.steps
      } else {
        this.$message({
          type: 'warning',
          message: res.data.errorMessage
        })
      }
    },
    handleNext() {
      const vue = this

      if (this.$refs.singlePromotionStep1) {
        this.$refs.singlePromotionStep1.$refs.singlePromotion.validate(
          (valid, object) => {
            if (valid) {
              const {
                createTime: [createTimeStart, createTimeEnd],
                ...params
              } = vue.$refs.singlePromotionStep1.singlePromotion
              params.fromDate = createTimeStart
              params.endDate = createTimeEnd

              if (this.promotionId === '' || this.promotionId === undefined) {
                this.promotionAPI.getAddPromotionUrl(params).then(res => {
                  if (res && res.code === '0') {
                    this.promotionId = res.data
                    this.steps = ++this.steps
                  }
                })
              } else {
                this.promotionAPI.getUpdatePromotionUrl(params).then(res => {
                  if (res && res.code === '0') {
                    this.steps = ++this.steps
                  }
                })
              }
            } else {
              this.scrollToView(this, object)
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
      } else if (this.$refs.trialManagementProduct) {
        if (this.$refs.trialManagementProduct.mpTable.data.length) {
          this.steps = ++this.steps
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('请选择商品')
          })
        }
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
