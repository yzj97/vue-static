<template>
  <div class="pg-free-promotion">
    <ody-box :title="$route.path.indexOf('edit') > 0 ? $t('编辑包邮促销活动') : $t('创建包邮促销活动')">
      <div v-if="steps <= 2">
        <el-steps :space="700" :active="steps" finish-status="success" align-center>
          <el-step :title="$t('设置活动规则')" />
          <el-step :title="$t('设置活动商家及店铺')" />
          <el-step :title="$t('设置活动商品')" />
        </el-steps>

        <free-promotion-step1
          v-if="steps === 0"
          ref="freePromotionStep1"
          :prom-type="promotionType"
          :promotion-id="promotionId"
        />
        <promotion-set-merchant-store
          v-if="steps === 1"
          ref="promotionSetMerchantStore"
          :prom-type="promotionType"
          :promotion-id="promotionId"
        />
        <free-promotion-set-product
          v-if="steps === 2"
          ref="freePromotionSetProduct"
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
import FreePromotionStep1 from '@/components/free-promotion-step1'
import FreePromotionSetProduct from '@/components/free-promotion-set-product'
import PromotionSetMerchantStore from '@/components/promotion-set-merchant-store'
import PromotionCreatedSuccess from '@/components/promotion-created-success'

export default {
  name: 'PromFreeShippingActivityEdit',
  components: {
    FreePromotionStep1,
    PromotionSetMerchantStore,
    FreePromotionSetProduct,
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
      console.log('freePromoton', this.freePromotion)
    },
    handleBack() {
      this.steps = --this.steps
    },
    async handleComplete() {
      this.submiting = true
      try {
        var res = await this.$refs.freePromotionSetProduct.isCanSave()
        if (res.data.listObj && res.data.listObj.length > 0) {
          this.steps = ++this.steps
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
      if (this.$refs.freePromotionStep1) {
        this.$refs.freePromotionStep1.$refs.freePromotion.validate((valid, object) => {
          if (valid) {
            var {
              createTime: [createTimeStart, createTimeEnd],
              favourableMoney,
              favourableNum,
              favourableList,
              ...params
            } = vue.$refs.freePromotionStep1.freePromotion
            params.fromDate = createTimeStart
            params.endDate = createTimeEnd
            params = this.$portal.deepClone(params)
            if (params.conditionType === 1) {
              params.favourableList = [{
                ...favourableList[0],
                favourableCondition: favourableMoney * 100
              }]
            } else if (params.conditionType === 2) {
              params.favourableList = [{
                ...favourableList[0],
                favourableCondition: favourableNum
              }]
            }
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

