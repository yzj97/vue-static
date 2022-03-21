<template>
  <div class="pg-single-promotion">
    <ody-box :title="$route.path.indexOf('edit') > 0 ? $t('编辑推荐码活动') : $t('创建推荐码活动')">
      <div v-if="steps <= 1">
        <el-steps :space="700" :active="steps" finish-status="success" align-center>
          <el-step :title="$t('设置活动规则')" />
          <el-step :title="$t('推荐码活动创建成功')" />
        </el-steps>
        <promotion-recommend-code-step1
          v-if="steps === 0"
          ref="recommendCodePromotionStep1"
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
    <ody-fixed v-if="steps === 0">
      <ody-button
        v-if="steps ===0 "
        name="handleNext"
        type="primary"
        code="button015"
        @click="handleNext"
      >{{ $t('下一步') }}</ody-button>
      <ody-button
        v-if="steps != 0 && steps > 0"
        name="handleComplete"
        type="primary"
        code="button016"
        @click="handleComplete"
      >{{ $t('完成') }}</ody-button>
    </ody-fixed>
  </div>
</template>

<script>
import PromotionRecommendCodeStep1 from '@/components/promotion-recommend-code-step1'
import PromotionCreatedSuccess from '@/components/promotion-created-success'

export default {
  components: {
    PromotionRecommendCodeStep1,
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
      activityObjects: [],
      list: [
        {
          title: this.$t('1、设置活动规则')
        }
      ],
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
    handleCom() {
      console.log('recommendCodePromotionStep1', this.singlePromotion)
    },
    handleBack() {
      this.steps = --this.steps
    },
    handleComplete() {
      this.steps = ++this.steps
    },
    handleNext() {
      const vue = this

      if (this.$refs.recommendCodePromotionStep1) {
        this.$refs.recommendCodePromotionStep1.$refs.singlePromotion.validate(
          (valid, object) => {
            if (valid) {
              const {
                createTime: [createTimeStart, createTimeEnd],
                ...params
              } = vue.$refs.recommendCodePromotionStep1.singlePromotion

              if (new Date(createTimeStart) * 1 >= new Date(createTimeEnd) * 1) {
                this.$message.error(this.$t('活动结束时间必须大于活动开始时间'))
                return false
              }

              params.startTime = createTimeStart
              params.endTime = createTimeEnd
              vue.activityObjects[0] = params.sendObject
              vue.activityObjects[1] = params.useObject
              params.activityObjects = vue.activityObjects
              if (this.promotionId === '') {
                this.promotionAPI.recommendAddUrl(params).then(res => {
                  if (res && res.code === '0') {
                    this.promotionId = res.data
                    this.steps = ++this.steps
                  }
                })
              } else {
                this.promotionAPI.updateReferralCodeWrite(params).then(res => {
                  if (res && res.code === '0') {
                    this.steps = ++this.steps
                  }
                })
              }
            } else {
              this.scrollToView(this, object)
              console.log('error submit!!')
              return false
            }
          }
        )
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
