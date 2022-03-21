<template>
  <div class="pg-repurchase-promotion">
    <ody-box :title="$route.path.indexOf('edit') > 0 ? $t('编辑换购促销活动') : $t('创建换购促销活动')">
      <div v-if="steps <= 2">
        <el-steps :space="700" :active="steps" finish-status="success" align-center>
          <el-step :title="$t('设置活动规则')" />
          <el-step :title="$t('设置活动商家及店铺')" />
          <el-step :title="$t('设置活动商品')" />
        </el-steps>

        <promotion-repurchase-step1
          v-if="steps === 0"
          ref="repurchasePromotionStep1"
          :prom-type="promotionType"
          :promotion-id="promotionId"
        />
        <promotion-set-merchant-store
          v-if="steps === 1"
          ref="promotionSetMerchantStore"
          :prom-type="promotionType"
          :promotion-id="promotionId"
        />
        <promotion-repurchase-product
          v-if="steps === 2"
          ref="promotionRepurchaseProduct"
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
import PromotionRepurchaseStep1 from '@/components/promotion-repurchase-step1'
import PromotionSetMerchantStore from '@/components/promotion-set-merchant-store'
import PromotionRepurchaseProduct from '@/components/promotion-repurchase-product'
import PromotionCreatedSuccess from '@/components/promotion-created-success'

export default {
  components: {
    PromotionRepurchaseStep1,
    PromotionSetMerchantStore,
    PromotionRepurchaseProduct,
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
    this.promotionId =
      this.$route.params.promotionId !== undefined
        ? this.$route.params.promotionId
        : ''
    this.promotionAPI = this.$promotion.$api.promotion
  },
  mounted() {},
  methods: {
    handleBack() {
      this.steps = --this.steps
    },
    async handleComplete() {
      this.submiting = true
      try {
        const res = await this.$refs.promotionRepurchaseProduct.isCanSave()
        if (res) {
          this.steps = ++this.steps
        }
      } finally {
        this.submiting = false
      }
    },
    handleNext() {
      const vue = this
      vue.submiting = true
      if (this.$refs.repurchasePromotionStep1) {
        this.$refs.repurchasePromotionStep1.$refs.repurchasePromotion.validate(
          (valid, object) => {
            if (valid) {
              const {
                createTime: [createTimeStart, createTimeEnd],
                ...params
              } = vue.$refs.repurchasePromotionStep1.repurchasePromotion
              params.fromDate = createTimeStart
              params.endDate = createTimeEnd

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
.pg-repurchase-promotion {
  .single-promotion-content {
    width: 800px;
  }
}
</style>
