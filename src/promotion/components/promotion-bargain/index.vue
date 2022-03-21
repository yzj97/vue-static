<template>
  <div class="pg-bargain-promotion">
    <ody-box :title="$route.path.indexOf('edit') > 0 ? $t('编辑砍价促销活动') : $t('创建砍价促销活动')">
      <div v-if="steps <= 1">
        <el-steps :space="700" :active="steps" finish-status="success" align-center>
          <el-step :title="$t('设置砍价规则')" />
          <el-step :title="$t('设置活动商品')" />
        </el-steps>

        <promotion-bargain-step1
          v-if="steps === 0"
          ref="promotionBargainStep1"
          :prom-type="promotionType"
          :promotion-id="promotionId"
        />
        <promotion-bargain-product
          v-if="steps === 1"
          ref="promotionBargainProduct"
          :prom-type="promotionType"
          :promotion-id="promotionId"
        />
      </div>

      <promotion-created-success
        v-if="steps > 1"
        :prom-type="promotionType"
        :promotion-id="promotionId"
      />
    </ody-box>
    <ody-fixed v-if="steps <= 1">
      <ody-button
        v-if="steps !==0 && steps <= 1"
        name="handleBack"
        type="default"
        code="button014"
        @click="handleBack"
      >{{ $t('上一步') }}</ody-button>
      <ody-button
        v-if="steps >=0 && steps < 1"
        :disabled="submiting"
        name="handleNext"
        type="primary"
        code="button015"
        @click="handleNext"
      >{{ $t('下一步') }}</ody-button>
      <ody-button
        v-if="steps === 1"
        name="handleComplete"
        type="primary"
        code="button016"
        @click="handleComplete"
      >{{ $t('完成') }}</ody-button>
    </ody-fixed>
  </div>
</template>

<script>
import PromotionBargainStep1 from '@/components/promotion-bargain-step1'
import PromotionBargainProduct from '@/components/promotion-bargain-product'
import PromotionCreatedSuccess from '@/components/promotion-created-success'

export default {
  components: {
    PromotionBargainStep1,
    PromotionBargainProduct,
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
      const result = await this.$refs.promotionBargainProduct.comfirm()
      if (result) {
        this.steps = ++this.steps
      }
    },
    handleNext() {
      const vue = this
      vue.submiting = true
      if (this.$refs.promotionBargainStep1) {
        var canSave = false
        this.$refs.promotionBargainStep1.$refs.promotionBargainType.$refs.bargainPromotionTypeform.validate(
          valid => {
            if (valid) {
              canSave = true
              this.$refs.promotionBargainStep1.$refs.promotionBargainType.updatedParentData()
            }
          }
        )
        this.$refs.promotionBargainStep1.$refs.bargainPromotion.validate(
          (valid, object) => {
            if (valid && canSave) {
              const {
                createTime: [createTimeStart, createTimeEnd],
                ...params
              } = vue.$refs.promotionBargainStep1.bargainPromotion
              params.startTime = createTimeStart
              params.endTime = createTimeEnd

              if (this.promotionId === '') {
                params.haveThemeNameList = []
                params.newThemeNameList = []
                params.themeIdList = []
                this.promotionAPI
                  .addCutPriceActivity(this.formHasValue(params, false))
                  .then(res => {
                    if (res && res.code === '0') {
                      this.promotionId = res.data
                      this.steps = ++this.steps
                      vue.submiting = false
                    }
                  })
              } else {
                this.promotionAPI.saveCutPriceActivity(params).then(res => {
                  if (res && res.code === '0') {
                    this.steps = ++this.steps
                    vue.submiting = false
                  }
                })
              }
            } else {
              this.scrollToView(this, object)
              console.log('error submit!!')
              vue.submiting = false
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
          vue.submiting = false
        }
      } else {
        this.steps = ++this.steps
        vue.submiting = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pg-bargain-promotion {
  .single-promotion-content {
    width: 800px;
  }
}
</style>
