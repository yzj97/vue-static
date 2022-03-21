<template>
  <div class="pg-single-promotion">
    <ody-box :title="$t('创建满额促销活动')">
      <div v-if="steps <= 2">
        <el-steps :space="700" :active="steps" finish-status="success" align-center>
          <el-step :title="$t('设置促销规则')" />
          <el-step :title="$t('设置促销商家及店铺')" />
          <el-step :title="$t('设置促销商品')" />
        </el-steps>

        <full-promotion-step1
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
        <promotion-full-set-product
          v-if="steps === 2"
          ref="promotionFullSetProduct"
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
import FullPromotionStep1 from '@/components/full-promotion-step1'
import PromotionSetMerchantStore from '@/components/promotion-set-merchant-store'
import PromotionFullSetProduct from '@/components/promotion-full-set-product'
import PromotionCreatedSuccess from '@/components/promotion-created-success'
import util from '@/utils/util'

export default {
  name: 'PromFullPromotionCreate',
  components: {
    FullPromotionStep1,
    PromotionSetMerchantStore,
    PromotionFullSetProduct,
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
      this.steps = --this.steps
    },
    handleComplete() {
      this.submiting = true
      if (
        (this.$refs.promotionFullSetProduct.mpTable.data &&
          this.$refs.promotionFullSetProduct.mpTable.data.length > 0) ||
        (this.$refs.promotionFullSetProduct.mutexTable.data &&
          this.$refs.promotionFullSetProduct.mutexTable.data.length > 0)
      ) {
        this.steps = ++this.steps
        this.submiting = false
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('请选择商品')
        })
        this.submiting = false
      }
    },
    handleNext() {
      const vue = this
      vue.submiting = true
      if (this.$refs.singlePromotionStep1) {
        var canSave = false
        this.$refs.singlePromotionStep1.$refs.promotionPreferentialSettingTable.$refs.dynamicValidateForm.validate(
          (valid, object) => {
            if (valid) {
              canSave = true
              this.$refs.singlePromotionStep1.$refs.promotionPreferentialSettingTable.updatedParentData()
            } else {
              this.scrollToView(this, object)
            }
          }
        )
        this.$refs.singlePromotionStep1.$refs.singlePromotion.validate(
          (valid, object) => {
            if (valid && canSave) {
              var {
                createTime: [createTimeStart, createTimeEnd],
                ...params
              } = vue.$refs.singlePromotionStep1.singlePromotion
              params.fromDate = createTimeStart
              params.endDate = createTimeEnd
              params = this.$portal.deepClone(params)
              params.favourableList = util.setFavourableList(params, params.favourableList)
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
              vue.submiting = false
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
        vue.submiting = false
      } else if (this.$refs.promotionFullSetProduct) {
        if (
          this.$refs.promotionFullSetProduct.mpTable.data.length &&
          this.$refs.promotionFullSetProduct.mutexTable.data.length
        ) {
          this.steps = ++this.steps
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('请选择商品')
          })
        }
        vue.submiting = false
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
