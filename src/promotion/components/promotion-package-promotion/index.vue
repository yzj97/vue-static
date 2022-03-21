<template>
  <div class="pg-single-promotion">
    <ody-box :title="$route.path.indexOf('edit') > 0 ? $t('编辑套餐活动') : $t('创建套餐活动')">
      <div v-if="steps <= 2">
        <el-steps :space="700" :active="steps" finish-status="success" align-center>
          <el-step :title="$t('设置促销规则')" />
          <el-step :title="$t('设置促销商家及店铺')" />
          <el-step :title="$t('设置促销商品')" />
        </el-steps>

        <package-promotion-step1
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
        <package-promotion-product
          v-if="steps === 2"
          ref="packagePromotionProduct"
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
import PackagePromotionStep1 from '@/components/package-promotion-step1'
import PromotionSetMerchantStore from '@/components/promotion-set-merchant-store'
import PackagePromotionProduct from '@/components/package-promotion-product'
import PromotionCreatedSuccess from '@/components/promotion-created-success'

export default {
  name: 'PromPackagePromotionEdit',
  components: {
    PackagePromotionStep1,
    PromotionSetMerchantStore,
    PackagePromotionProduct,
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
      // console.log(--this.steps,333)
      this.steps = --this.steps
    },
    async handleComplete() {
      this.submiting = true
      try {
        var res = await this.$refs.packagePromotionProduct.isCanSave()
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
      if (this.$refs.singlePromotionStep1) {
        this.$refs.singlePromotionStep1.$refs.singlePromotion.validate(
          (valid, object) => {
            if (valid) {
              const {
                createTime: [fromDate, endDate],
                ...params
              } = vue.$refs.singlePromotionStep1.singlePromotion
              params.fromDate = fromDate
              params.endDate = endDate
              if (params.promotionType === 2) {
                params.favourableList.forEach(f => {
                  f.favourableCondition = f.favourableCondition * 100
                  f.favourableContent = f.favourableContent * 100
                })
              }
              // 京东到家
              if (params.channelCodes.indexOf('210004') > -1) {
                const nowTime = new Date().getTime() + 60 * 60 * 1000
                const beforeOneTime = this.$portal.parseTime(
                  nowTime,
                  '{y}-{m}-{d} {h}:{i}:{s}'
                )
                // 如果创建时间小于beforeOneTime，则无法创建
                if (params.fromDate < beforeOneTime) {
                  this.$message({
                    type: 'error',
                    message: this.$t(
                      '京东到家规则：活动开始时间要在当前时间的一个小时后'
                    )
                  })
                  vue.submiting = false
                  return
                }
              }
              if (this.promotionId === '' || this.promotionId === undefined) {
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
