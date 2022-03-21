<template>
  <div class="pg-single-promotion">
    <ody-box :title="$route.path.indexOf('edit') > 0 ? $t('编辑促销活动') : $t('创建促销活动')">
      <div v-if="steps <= 2">
        <el-steps :space="700" :active="steps" finish-status="success" align-center>
          <el-step :title="$t('设置活动规则')" />
          <el-step :title="$t('设置活动商家及店铺')" />
          <el-step :title="$t('设置活动商品')" />
        </el-steps>

        <promotion-single-step1
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
        <promotion-single-set-product
          v-if="steps === 2"
          ref="promotionSingleSetProduct"
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
import PromotionSingleStep1 from '@/components/promotion-single-step1'
import PromotionSetMerchantStore from '@/components/promotion-set-merchant-store'
import PromotionSingleSetProduct from '@/components/promotion-single-set-product'
import PromotionCreatedSuccess from '@/components/promotion-created-success'

export default {
  components: {
    PromotionSingleStep1,
    PromotionSetMerchantStore,
    PromotionSingleSetProduct,
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
      promotionId: '',
      promotionActivityDetail: {}
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
    handleCom() {
      console.log('singlePromotion', this.singlePromotion)
    },
    handleBack() {
      this.steps = --this.steps
    },
    async handleComplete() {
      this.submiting = true
      try {
        const res = await this.$refs.promotionSingleSetProduct.isCanSave()
        if (res.data.flag) {
          this.steps = ++this.steps
        } else {
          this.$message({
            type: 'warning',
            message: res.data.errorMessage
          })
        }
      } finally {
        this.submiting = false
      }
    },
    // 全渠道选商家门店页面开关
    getMerchantAndStore() {
      return (
        this.promotionActivityDetail.channelCodes != null &&
        this.promotionActivityDetail.channelCodes.length > 0 &&
        this.promotionActivityDetail.activityType !== 2
      )
    },
    singlePromotionValide() {
      return new Promise(resolve => {
        this.$refs.singlePromotionStep1.$refs.singlePromotion.validate((valid, object) => {
          resolve({ valid, object })
        })
      })
    },
    async handleNext() {
      const vue = this
      if (this.$refs.singlePromotionStep1) {
        const validPromise = this.singlePromotionValide()
        validPromise.then((res) => {
          let valid = null
          valid = res.object
          // 如果校验不通过
          if (!res.valid) {
            this.scrollToView(this, res.object)
            return
          }
          if (validPromise) {
            const {
              createTime: [createTimeStart, createTimeEnd],
              ...params
            } = this.$refs.singlePromotionStep1.singlePromotion
            params.fromDate = createTimeStart
            params.endDate = createTimeEnd
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
            if (this.promotionId === '') {
              this.promotionActivityDetail = params
              this.promotionAPI.getAddPromotionUrl(params).then(res => {
                if (res && res.code === '0' && valid) {
                  this.promotionId = res.data
                  if (this.getMerchantAndStore()) {
                    this.steps = ++this.steps
                    vue.submiting = false
                  } else {
                    vue.submiting = false
                    this.steps = 3
                  }
                }
              })
            } else {
              // const res = this.promotionAPI.getUpdatePromotionUrl(params)
              this.promotionAPI.getUpdatePromotionUrl(params).then(res => {
                this.promotionActivityDetail = params
                if (res && res.code === '0' && valid) {
                  vue.submiting = false
                  if (this.getMerchantAndStore()) {
                    this.steps = ++this.steps
                  } else {
                    vue.submiting = false
                    this.steps = 3
                  }
                } else {
                  vue.submiting = false
                }
              })
            }
          } else {
            vue.submiting = false
            console.log('error submit!!')
            return false
          }
        })
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
