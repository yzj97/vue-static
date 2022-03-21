<template>
  <div class="pg-single-promotion">
    <ody-box :title="$route.path.indexOf('edit') > 0 ? $t('编辑促销活动') : $t('创建促销活动')">
      <div v-if="steps <= 2 ">
        <el-steps
          :space="700"
          :active="steps"
          finish-status="success"
          align-center
        >
          <el-step :title="$t('设置活动规则')" />
          <el-step :title="$t('设置活动商家及店铺')" />
          <el-step :title="$t('设置活动商品')" />
        </el-steps>

        <promotion-gift-step1 v-if=" steps === 0 " ref="giftPromotionStep1" :prom-type="promotionType" :promotion-id="promotionId" />
        <promotion-set-merchant-store v-if="steps === 1 " ref="promotionSetMerchantStore" :prom-type="promotionType " :promotion-id="promotionId" />
        <promotion-gift-set-product v-if="steps === 2 " ref="promotionGiftSetProduct" :prom-type=" promotionType " :promotion-id="promotionId"/>
      </div>

      <promotion-created-success v-if="steps > 2 " :prom-type=" promotionType " :promotion-id="promotionId" />

    </ody-box>
    <ody-fixed v-if="steps <= 2 ">
      <ody-button v-if="steps !==0 && steps <= 2 " name="handleBack" type="default" code="button014" @click="handleBack">{{ $t('上一步') }}</ody-button>
      <ody-button v-if="steps >=0 && steps < 2 " :disabled="submiting" name="handleNext" type="primary" code="button015" @click="handleNext">{{ $t('下一步') }}</ody-button>
      <ody-button v-if="steps === 2 " name="handleComplete" type="primary" code="button016" @click="handleComplete">{{ $t('完成') }}</ody-button>
    </ody-fixed>
  </div>
</template>

<script>

import PromotionGiftStep1 from '@/components/promotion-gift-step1'
import PromotionSetMerchantStore from '@/components/promotion-set-merchant-store'
import PromotionGiftSetProduct from '@/components/promotion-gift-set-product'
import PromotionCreatedSuccess from '@/components/promotion-created-success'

export default {
  components: {
    PromotionGiftStep1,
    PromotionSetMerchantStore,
    PromotionGiftSetProduct,
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
      submiting: false
    }
  },
  created() {
    this.promotionType = parseInt(this.$route.params.promotionType, 10)
    this.promotionId = this.$route.params.promotionId !== undefined ? this.$route.params.promotionId : ''
    this.promotionAPI = this.$promotion.$api.promotion
  },
  mounted() {},
  methods: {
    handleCom() {

    },
    handleBack() {
      this.steps = --this.steps
    },
    async handleComplete() {
      const res = await this.$refs.promotionGiftSetProduct.isCanSave()
      if (res) {
        this.steps = ++this.steps
      }
    },
    handleNext() {
      const vue = this
      if (this.$refs.giftPromotionStep1) {
        this.$refs.giftPromotionStep1.$refs.giftPromotion.validate((valid, object) => {
          if (valid) {
            this.submiting = true
            const {
              favourableList,
              createTime: [createTimeStart, createTimeEnd],
              ...params } = vue.$refs.giftPromotionStep1.giftPromotion
            if (+params.conditionType === 2 && +params.giftSameAsProductFlg === 1) {
              const hasError = favourableList.some(x => {
                return !x.favourableCondition || !x.favourableContent
              })
              if (hasError) {
                this.$message.error('请输入完整的优惠设置')
                return false
              }
            }
            params.favourableList = favourableList || []
            params.fromDate = createTimeStart
            params.endDate = createTimeEnd
            // 京东到家
            // 平台类型为自营,则验证京东到家规则
            if (params.activityPlatformType === 0 && params.channelCodes.indexOf('210004') > -1) {
              const nowTime = new Date().getTime() + 60 * 60 * 1000
              const beforeOneTime = this.$portal.parseTime(nowTime, '{y}-{m}-{d} {h}:{i}:{s}')
              // 如果创建时间小于beforeOneTime，则无法创建
              if (params.fromDate < beforeOneTime) {
                this.$message({
                  type: 'error',
                  message: this.$t('京东到家规则：活动开始时间要在当前时间的一个小时后')
                })
                this.submiting = false
                return
              }
            }

            if (this.promotionId === '') {
              this.promotionAPI.getAddPromotionUrl(params).then(res => {
                if (res && res.code === '0') {
                  this.promotionId = res.data
                  this.steps = ++this.steps
                }
                this.submiting = false
              }).catch(() => {
                this.submiting = false
              })
            } else {
              this.promotionAPI.getUpdatePromotionUrl(params).then(res => {
                if (res && res.code === '0') {
                  this.steps = ++this.steps
                }
                this.submiting = false
              }).catch(() => {
                this.submiting = false
              })
            }
          } else {
            this.submiting = false
            this.scrollToView(this, object)
            console.log('error submit!!')
            return false
          }
        })
      } else if (this.$refs.promotionSetMerchantStore) {
        const merchantLength = this.$refs.promotionSetMerchantStore.merchantTable.data.length
        const storeLength = this.$refs.promotionSetMerchantStore.storeTable.data.length

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
      } else {
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
