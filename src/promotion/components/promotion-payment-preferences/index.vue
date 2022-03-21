<template>
  <div class="pg-repurchase-promotion">
    <ody-box :title="$t('创建支付优惠活动')">
      <div v-if="steps <= 0">
        <el-steps :space="700" :active="steps" finish-status="success" align-center>
          <el-step :title="$t('设置活动规则')" />
          <el-step :title="$t('支付优惠促销活动创建成功')" />
        </el-steps>

        <promotion-payment-preferences-step1
          v-if="steps === 0"
          ref="promotionPaymentPreferencesStep1"
          :prom-type="promotionType"
          :promotion-id="promotionId"
        />
      </div>

      <promotion-created-success
        v-if="steps > 0"
        :prom-type="promotionType"
        :promotion-id="promotionId"
      />
    </ody-box>
    <ody-fixed v-if="steps <= 0">
      <ody-button
        :disabled="btnDisable"
        name="handleNext"
        type="primary"
        code="button015"
        @click="handleNext"
      >{{ $t('下一步') }}</ody-button>
    </ody-fixed>
  </div>
</template>

<script>
import PromotionPaymentPreferencesStep1 from '@/components/promotion-payment-preferences-step1'
import PromotionCreatedSuccess from '@/components/promotion-created-success'

export default {
  components: {
    PromotionPaymentPreferencesStep1,
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
      promotionId: '',
      btnDisable: false
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
    handleComplete() {
      this.steps = ++this.steps
    },
    handleNext() {
      const vue = this
      this.btnDisable = true
      try {
        if (this.$refs.promotionPaymentPreferencesStep1) {
          var canSave = false
          this.$refs.promotionPaymentPreferencesStep1.$refs.paymentPreferenesMethod.$refs.paymentPreferencesMethodform.validate(
            (valid, object) => {
              if (valid) {
                canSave = true
                this.$refs.promotionPaymentPreferencesStep1.$refs.paymentPreferenesMethod.updatedParentData()
              } else {
                this.scrollToView(this, object)
                this.btnDisable = false
              }
            }
          )
          this.$refs.promotionPaymentPreferencesStep1.$refs.paymentPreferences.validate(
            (valid, object) => {
              if (valid && canSave) {
                const {
                  createTime: [createTimeStart, createTimeEnd],
                  ...params
                } = vue.$refs.promotionPaymentPreferencesStep1.paymentPreferences
                params.fromDate = createTimeStart
                params.endDate = createTimeEnd

                if (this.promotionId === '') {
                  this.promotionAPI.getAddPromotionUrl(params).then(res => {
                    this.btnDisable = false
                    if (res && res.code === '0') {
                      this.promotionId = res.data
                      this.steps = ++this.steps
                    }
                  }).catch(() => {
                    this.btnDisable = false
                  })
                } else {
                  this.promotionAPI.getUpdatePromotionUrl(params).then(res => {
                    this.btnDisable = false
                    if (res && res.code === '0') {
                      this.steps = ++this.steps
                    }
                  }).catch(() => {
                    this.btnDisable = false
                  })
                }
              } else {
                this.scrollToView(this, object)
                this.btnDisable = false
                console.log('error submit!!')
                return false
              }
            }
          )
        } else {
          this.btnDisable = false
          this.steps = ++this.steps
        }
      } catch (error) {
        this.btnDisable = false
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
