<template>
  <div class="pg-single-promotion">
    <ody-box :title="$route.path.indexOf('edit') > 0 ? $t('编辑秒杀促销活动') : $t('创建秒杀促销活动')">
      <div v-if="steps <= 2">
        <el-steps :space="700" :active="steps" finish-status="success" align-center>
          <el-step :title="$t('设置秒杀规则')" />
          <el-step :title="$t('设置秒杀商家及店铺')" />
          <el-step :title="$t('设置秒杀商品')" />
        </el-steps>

        <spike-activity-promotion-step1
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
        <promotion-spike-set-product
          v-if="steps === 2"
          ref="promotionSpikeSetProduct"
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
import SpikeActivityPromotionStep1 from '@/components/spike-activity-promotion-step1'
import PromotionSetMerchantStore from '@/components/promotion-set-merchant-store'
import PromotionSpikeSetProduct from '@/components/promotion-spike-set-product'
import PromotionCreatedSuccess from '@/components/promotion-created-success'

export default {
  name: 'PromSpikeActivityEdit',
  components: {
    SpikeActivityPromotionStep1,
    PromotionSetMerchantStore,
    PromotionSpikeSetProduct,
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
      scheduleList: [],
      startTimeEnd: []
    }
  },
  created() {
    this.promotionType = this.$route.params.promotionType
    this.promotionId = this.$route.params.promotionId
    this.promotionAPI = this.$promotion.$api.promotion
  },
  mounted() {},
  methods: {
    getRepurchasePromotion(val) {
      this.scheduleList = val
    },
    handleCom() {
      console.log('singlePromotion', this.singlePromotion)
    },
    handleBack() {
      this.steps = --this.steps
    },
    async handleComplete() {
      this.submiting = true
      try {
        const res = await this.$refs.promotionSpikeSetProduct.isCanSave()
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
    handleNext() {
      const vue = this
      vue.submiting = true
      if (this.$refs.singlePromotionStep1) {
        this.startTimeEnd = this.$refs.singlePromotionStep1.singlePromotion.activityScheduleList
        if (this.startTimeEnd) {
          for (let i = 0; i < this.startTimeEnd.length; i++) {
            if (!this.startTimeEnd[i].startTime) {
              vue.submiting = false
              this.$message({
                type: 'error',
                message: this.$t('每日时间段开始时间不能为空')
              })
              return false
            }
            if (!this.startTimeEnd[i].endTime) {
              vue.submiting = false
              this.$message({
                type: 'error',
                message: this.$t('每日时间段结束时间不能为空')
              })
              return false
            }
            var date = new Date()
            var start = this.startTimeEnd[i].startTime.split(':')
            var end = this.startTimeEnd[i].endTime.split(':')
            if (date.setHours(end[0], end[1]) <= date.setHours(start[0], start[1])) {
              vue.submiting = false
              this.$message({
                type: 'error',
                message: this.$t('每日时间段结束时间必须大于开始时间')
              })
              return false
            }
          }
        }
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
                    vue.submiting = false
                  }
                }).catch(() => {
                  vue.submiting = false
                })
              } else {
                this.promotionAPI.getUpdatePromotionUrl(params).then(res => {
                  if (res && res.code === '0') {
                    this.steps = ++this.steps
                    vue.submiting = false
                  }
                }).catch(() => {
                  vue.submiting = false
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
      } else if (this.$refs.promotionSpikeSetProduct) {
        if (
          this.$refs.promotionSpikeSetProduct.mpTable.data.length &&
          this.$refs.promotionSpikeSetProduct.mutexTable.data.length
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
