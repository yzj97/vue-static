<template>
  <div class="pg-coupon-theme-list">
    <ody-box
      :title="
        $route.path.indexOf('edit') > 0 ? $t('编辑优惠券') : $t('创建优惠券')
      "
    >
      <div v-if="steps <= 4">
        <!-- {{ applicationScope }} - {{ couponDeductionType }} -->
        <el-steps
          v-if="applicationScope === 11"
          :space="700"
          :active="steps"
          finish-status="success"
          align-center
        >
          <el-step :title="$t('设置活动规则')" />
          <el-step :title="$t('设置活动商家及店铺')" />
          <el-step v-if="couponDeductionType !== 1" :title="$t('优惠券设置')" />
          <el-step :title="$t('优惠券活动创建成功')" />
        </el-steps>
        <el-steps
          v-else
          :space="700"
          :active="steps"
          finish-status="success"
          align-center
        >
          <el-step :title="$t('设置活动规则')" />
          <el-step :title="$t('优惠券设置')" />
          <el-step :title="$t('优惠券活动创建成功')" />
        </el-steps>
        <template v-if="steps === 0">
          <coupon-promotion-step1
            ref="couponPromotionStep1"
            :prom-type="promType"
            :promotion-id="promotionId"
            @changeStep="changeStep"
          />
        </template>
        <template v-if="applicationScope === 11">
          <template v-if="steps === 1">
            <promotion-coupon-set-merchant-store
              ref="promotionSetMerchantStore"
              :prom-type="promType"
              :promotion-id="promotionId"
              :getmerchant-id.sync="merchantId"
            />
          </template>
          <template v-if="couponDeductionType !== 1">
            <template v-if="steps === 2">
              <promotion-coupon-themeList-set-product
                ref="promotionSingleSetProduct"
                :prom-type="promType"
                :promotion-id="promotionId"
                :coupon-deduction-type="applicationScope"
                :merchant-id="merchantId"
              />
            </template>
            <template v-if="steps === 3">
              <promotion-created-success
                :prom-type="promType"
                :promotion-id="promotionId"
              />
            </template>
          </template>
          <template v-else>
            <template v-if="steps === 2">
              <promotion-created-success
                :prom-type="promType"
                :promotion-id="promotionId"
              />
            </template>
          </template>
        </template>
        <template v-else>
          <template v-if="steps === 1">
            <promotion-coupon-themeList-set-product
              ref="promotionSingleSetProduct"
              :prom-type="promType"
              :promotion-id="promotionId"
              :coupon-deduction-type="applicationScope"
              :merchant-id="merchantId"
            />
          </template>
          <template v-if="steps === 2">
            <promotion-created-success
              :prom-type="promType"
              :promotion-id="promotionId"
            />
          </template>
        </template>
      </div>
    </ody-box>
    <ody-fixed
      v-if="
        ((applicationScope !== 11 ||
        (applicationScope === 11 && couponDeductionType === 1)) &&
          steps < 2) ||
          (applicationScope === 11 && couponDeductionType !== 1 && steps < 3)
      "
    >
      <template v-if="applicationScope === 11">
        <template v-if="steps === 0">
          <ody-button :disabled="submiting" name="handleNext" type="primary" code="button016" @click="handleNext" >{{ $t('下一步') }}</ody-button>
        </template>
        <template v-if="steps === 1">
          <ody-button name="handleBack" type="default" code="button015" @click="handleBack" >{{ $t('上一步') }}</ody-button>
          <ody-button :disabled="submiting" name="handleNext" type="primary" code="button016" @click="handleNext" >{{ $t('下一步') }}</ody-button>
        </template>
        <template v-if="couponDeductionType !== 1">
          <template v-if="steps === 2">
            <ody-button name="handleBack" type="default" code="button015" @click="handleBack" >{{ $t('上一步') }}</ody-button>
            <ody-button :disabled="submiting" name="handleNext" type="primary" code="button016" @click="handleNext" >{{ $t('下一步') }}</ody-button>
          </template>
        </template>
      </template>
      <template v-else>
        <template v-if="steps === 0">
          <ody-button :disabled="submiting" name="handleNext" type="primary" code="button016" @click="handleNext" >{{ $t('下一步') }}</ody-button>
        </template>
        <template v-if="steps === 1">
          <ody-button name="handleBack" type="default" code="button015" @click="handleBack" >{{ $t('上一步') }}</ody-button>
          <ody-button :disabled="submiting" name="handleNext" type="primary" code="button016" @click="handleNext" >{{ $t('下一步') }}</ody-button>
        </template>
      </template>
    </ody-fixed>
  </div>
</template>

<script>
import CouponPromotionStep1 from '@/components/coupon-promotion-step1'
import PromotionCouponSetMerchantStore from '@/components/promotion-coupon-set-merchant-store'
import PromotionCouponThemeListSetProduct from '@/components/promotion-coupon-themeList-set-product'
import PromotionCreatedSuccess from '@/components/promotion-created-success'
export default {
  components: {
    CouponPromotionStep1,
    PromotionCouponSetMerchantStore,
    PromotionCouponThemeListSetProduct,
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
      promType: 6000,
      promotionAPI: null,
      couponDeductionType: null,
      promotionId: '',
      applicationScope: null,
      merchantId: '',
      submiting: false
    }
  },
  created() {
    // this.promType = this.$route.params.promotionType
    this.promotionId = this.$route.params.promotionId
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
  /*  const { clean } = this.$route.params*/
    if (this.promotionId) {
      await this.queryPromotionActivityDetail()
    }
    /* else {
      if (clean && clean === true) {
        console.log('Clean data')
        this.$refs.couponPromotionStep1.$refs.couponThemeViewContent.resetFields()
      }
    }*/
  },
  methods: {
    async queryPromotionActivityDetail() {
      const { data } = await this.promotionAPI.queryCouponDetailById({
        id: this.promotionId
      })

      // console.log('data', data)
      this.applicationScope = +data.applicationScope
      this.couponDeductionType = +data.couponDeductionType
    },
    handleCom() {
      // console.log('couponThemeViewContent', this.couponThemeViewContent)
    },
    handleBack() {
      this.steps = --this.steps
    },
    async handleComplete() {
      this.steps = ++this.steps
    },
    changeStep(val) {
      this.applicationScope = val
    },
    handleNext() {
      const vue = this
      this.submiting = true
      if (this.$refs.couponPromotionStep1) {
        this.$refs.couponPromotionStep1.$refs.couponThemeViewContent.validate(
          async(valid, object) => {
            if (valid) {
              const { ...params } = this.$portal.deepClone(
                vue.$refs.couponPromotionStep1.couponThemeViewContent
              )
              this.applicationScope = +params.applicationScope
              // debugger
              this.couponDeductionType = +params.couponDeductionType
              if (params.couponDiscountType === 1) {
                var couponDiscount = params.couponDiscount
                couponDiscount = couponDiscount * 10
                params.couponDiscount = couponDiscount

                if (params.couponDiscount < 10) {
                  try {
                    const couponDisountConfirm = await this.$confirm(
                      '折扣小于1折，确定设置？',
                      this.$t('提示'),
                      {
                        confirmButtonText: this.$t('确定'),
                        cancelButtonText: this.$t('取消'),
                        type: 'warning'
                      }
                    )

                    if (!couponDisountConfirm) {
                      this.submiting = false
                      return false
                    }
                  } catch (err) {
                    if (err === 'cancel') {
                      this.submiting = false
                      return false
                    }
                  }
                }

                if (params.couponAmount > 500) {
                  try {
                    const couponAmountConfirm = await this.$confirm(
                      '折扣上限超500元，确定要设置？',
                      this.$t('提示'),
                      {
                        confirmButtonText: this.$t('确定'),
                        cancelButtonText: this.$t('取消'),
                        type: 'warning'
                      }
                    )

                    if (!couponAmountConfirm) {
                      this.submiting = false
                      return false
                    }
                  } catch (err) {
                    if (err === 'cancel') {
                      this.submiting = false
                      return false
                    }
                  }
                }
              }

              // 随机面值
              if (
                params.couponGiveRule === 12 &&
                params.couponFaceValueType === 1
              ) {
                if (params.couponAmount >= params.couponAmountExt) {
                  this.$message.error('随机面值最小面额必须小于最大面额')
                  this.submiting = false
                  return false
                }
              }

              if (this.promotionId === '' || this.promotionId === undefined) {
                params.startTimeConfig = params.startTime
                params.endTimeConfig = params.endTime
                this.promotionAPI.saveCouponActivity(params).then((res) => {
                  if (res && res.code === '0') {
                    this.promotionId = res.data
                    this.steps = ++this.steps
                    this.submiting = false
                  }
                }).finally(() => {
                  vue.submiting = false
                })
              } else {
                if (
                  (params.startTime && params.endTime) ||
                  (params.endTimeConfig && params.startTimeConfig)
                ) {
                  params.startTime = this.$moment(
                    params.startTime
                  ).toISOString()
                  params.endTime = this.$moment(params.endTime).toISOString()
                  params.startTimeConfig = this.$moment(
                    params.startTimeConfig
                  ).toISOString()
                  params.endTimeConfig = this.$moment(
                    params.endTimeConfig
                  ).toISOString()
                }
                this.promotionAPI.updateCouponActivity(params).then((res) => {
                  if (res && res.code === '0') {
                    this.steps = ++this.steps
                    this.submiting = false
                  } else {
                    this.submiting = false
                  }
                }).finally(() => {
                  vue.submiting = false
                })
              }
            } else {
              this.submiting = false
              this.scrollToView(this, object)
              // const {
              //   couponThemeViewContent,
              //   requiredList,
              //   canShowEveryDayLimit
              // } = this.$refs.couponPromotionStep1
              // let requiredListCopy = requiredList
              // if (!canShowEveryDayLimit()) {
              //   requiredListCopy = requiredListCopy.filter((x) => {
              //     return x.value !== 'everyDayLimit'
              //   })
              // }
              // if (couponThemeViewContent.couponGiveRule !== 12) {
              //   requiredListCopy = requiredListCopy.filter(x => {
              //     console.log(x.value !== 'shareNumLimit')
              //     return x.value !== 'shareNumLimit'
              //   })
              // }
              // if (couponThemeViewContent.couponDiscountType !== 1) {
              //   requiredListCopy = requiredListCopy.filter(x => {
              //     return x.value !== 'couponDiscount'
              //   })
              // }
              // const errorList = requiredListCopy.find((item) => {
              //   return (
              //     couponThemeViewContent[item.value] === '' ||
              //         !couponThemeViewContent[item.value] ||
              //         couponThemeViewContent[item.value] === null
              //   )
              // })
              // if (errorList) {
              //   this.$message.error(errorList.label)
              // }
              return false
            }
          }
        )
      } else if (this.$refs.promotionSetMerchantStore) {
        if (
          this.$refs.promotionSetMerchantStore.merchantTable.data.length &&
          this.$refs.promotionSetMerchantStore.storeTable.data.length
        ) {
          this.steps = ++this.steps
          this.submiting = false
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('请选择商家和店铺')
          })
          this.submiting = false
        }
      } else {
        this.steps = ++this.steps
        this.submiting = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pg-coupon-theme-list {
  .single-promotion-content {
    width: 800px;
  }
}
</style>
