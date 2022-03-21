<template>
  <div class="pg-single-promotion">
    <ody-box :title="$route.path.indexOf('edit') > 0 ? $t('编辑抽奖类促销活动') : $t('创建抽奖类促销活动')">
      <div v-if="steps <= 2 ">
        <el-steps v-if="!interveneLottery" :space="700" :active="steps" finish-status="success" align-center>
          <el-step :title="$t('设置抽奖规则')" />
          <el-step :title="$t('奖品设置')" />
          <el-step :title="$t('抽奖活动创建成功')" />
        </el-steps>

        <lottery-promotion-step1
          v-if="steps === 0"
          ref="lotteryPromotionStep1"
          :prom-type="promotionType"
          :promotion-id="promotionId"
        />
        <lottery-set-prize
          v-if="steps === 1"
          ref="lotterySetPrize"
          :prom-type="promotionType"
          :promotion-id="promotionId"
          :lottery-awards-icon-arr="lotteryAwardsIconArr"
          :intervene-lottery="interveneLottery"
          :can-save="canSave"
          @setPrizeData="savePrizeData"
        />
        <lottery-set-success
          v-if="steps === 2"
          :prom-type="promotionType"
          :promotion-id="promotionId"
        />
      </div>
    </ody-box>
    <ody-fixed v-if="steps <= 1">
      <ody-button
        v-if="(steps !==0 && steps <= 2) && !interveneLottery"
        name="handleBack"
        type="default"
        code="button014"
        @click="handleBack"
      >{{ $t('上一步') }}</ody-button>
      <el-button
        v-if="(steps >=0 && steps < 2) && !interveneLottery"
        :disabled="submiting"
        name="handleNext"
        type="primary"
        code="button015"
        @click="handleNext"
      >{{ $t('下一步') }}</el-button>
      <el-button
        v-if="steps === 2 && !interveneLottery"
        :disabled="submiting"
        name="handleComplete"
        type="primary"
        code="button016"
        @click="handleComplete"
      >{{ $t('完成') }}</el-button>
      <el-button
        v-if="interveneLottery"
        :disabled="submiting"
        name="handleSubmit"
        type="primary"
        code="button017"
        @click="handleSubmit"
      >{{ $t('确认提交') }}</el-button>
    </ody-fixed>
  </div>
</template>

<script>
import LotteryPromotionStep1 from '@/components/lottery-promotion-step1'
import LotterySetPrize from '@/components/lottery-set-prize'
import LotterySetSuccess from '@/components/lottery-set-success'
import PromotionCreatedSuccess from '@/components/promotion-created-success'

export default {
  name: 'PromLotteryActivity',
  components: {
    LotteryPromotionStep1,
    LotterySetPrize,
    LotterySetSuccess,
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
      lotteryAwardsIconArr: [],
      interveneLottery: false, // 抽奖干预
      lotteryInfo: {} // 转盘信息
    }
  },
  created() {
    this.promotionType = parseInt(this.$route.params.promotionType, 10)
    this.promotionAPI = this.$promotion.$api.promotion
    this.promotionId = this.$route.params.promotionId
    this.steps = this.$route.params.steps || this.steps
    this.interveneLottery = this.$route.params.interveneLottery || this.interveneLottery // 抽奖干预
  },
  mounted() {},
  methods: {
    handleCom() {},
    handleBack() {
      this.steps = --this.steps
    },
    handleComplete() {
      this.submiting = true
      this.steps = ++this.steps
      this.submiting = false
    },
    async handleSubmit() {
      this.submiting = true
      const [
        valid1
      ] = await this.$refs.lotterySetPrize.$refs.lotterySetPrizeSelection1[0].validPromise()
      const [
        valid2
      ] = await this.$refs.lotterySetPrize.$refs.lotterySetPrizeSelection2[0].validPromise()
      const [
        valid3
      ] = await this.$refs.lotterySetPrize.$refs.lotterySetPrizeSelection3[0].validPromise()
      const [
        valid4
      ] = await this.$refs.lotterySetPrize.$refs.lotterySetPrizeSelection4[0].validPromise()
      const [
        valid5
      ] = await this.$refs.lotterySetPrize.$refs.lotterySetPrizeSelection5[0].validPromise()
      const [
        valid6
      ] = await this.$refs.lotterySetPrize.$refs.lotterySetPrizeSelection6[0].validPromise()
      this.$refs.lotterySetPrize.$refs.couponThemeViewContent.validate(
        valid => {
          // 各奖品中奖率之和不能大于100%
          const sum = this.$refs.lotterySetPrize.couponThemeViewContent.lotteryAwardsRuleInstList.reduce((rtv, item) => rtv + (+item.winningRate), 0)
          // console.log('this.$refs.lotterySetPrize.couponThemeViewContent.lotteryAwardsRuleInstList', this.$refs.lotterySetPrize.couponThemeViewContent.lotteryAwardsRuleInstList)
          if (sum > 100) {
            this.$alert(this.$t('中奖率之和不能大于') + '100%', this.$t('系统提示'), {
              confirmButtonText: this.$t('确定'),
              callback: action => {
                this.$message({
                  type: 'info',
                  message: this.$t('请重新填写中奖率')
                })
              }
            })
            this.submiting = false
            return
          }
          if (
            valid &&
              !valid1 &&
              !valid2 &&
              !valid3 &&
              !valid4 &&
              !valid5 &&
              !valid6
          ) {
            const params = this.$refs.lotterySetPrize.couponThemeViewContent
            params.editType = 2
            params.lotteryAwardsRuleInstList.forEach(i => {
              if (i.prizeContent === undefined) {
                i.prizeContent = {}
              }
              i.prizeContent.product = {}
              i.prizeContent.coupon = {}
              i.prizeContent.points = {}
              const contentDto = {}
              contentDto.id = i.awardsRefId
              contentDto.name = i.awardsRefName
              contentDto.num = i.awardsRefNum
              if (i.awardsCategory === 1) {
                i.prizeContent.product = contentDto
              } else if (i.awardsCategory === 2) {
                i.prizeContent.points = contentDto
              } else if (i.awardsCategory === 3) {
                i.prizeContent.coupon = contentDto
              }
            })
            this.promotionAPI.createLotteryAwardsRule(params).then(res => {
              if (res && res.code === '0') {
                this.$message({
                  message: this.$t('提交成功'),
                  type: 'success',
                  duration: 1500
                })
              }
            })
            this.submiting = false
          } else {
            this.$message({
              type: 'warning',
              message: this.$t('请选择必填项')
            })
            this.submiting = false
          }
        }
      )
    },
    async handleNext() {
      const vue = this
      vue.submiting = true
      if (this.$refs.lotteryPromotionStep1) {
        this.$refs.lotteryPromotionStep1.$refs.lotteryThemeViewContent.validate(
          (valid, object) => {
            if (valid) {
              const {
                createTime: [effStartTimeStr, effEndTimeStr],
                ...params
              } = vue.$refs.lotteryPromotionStep1.lotteryThemeViewContent
              // console.log('aaaa', this.$moment(effStartTimeStr).toISOString())
              params.effStartTime = this.$moment(effStartTimeStr).toISOString()
              params.effEndTime = this.$moment(effEndTimeStr).toISOString()
              if (params.status > 0) {
                this.$message({
                  type: 'warning',
                  message: this.$t('促销活动已经提交审核，不能编辑')
                })
                vue.submiting = false
              } else {
                this.promotionAPI.addLotteryTheme(params).then(res => {
                  if (res && res.code === '0') {
                    this.promotionId = res.data
                    this.promotionAPI
                      .getLoadPageConfigCommonOscUrl('LOTTERY_PAGE_CONFIG')
                      .then(res => {
                        if (res && res.code === '0') {
                          this.lotteryAwardsIconArr = res.data.LOTTERY_AWARDS_ICON
                          this.steps = ++this.steps
                          if (this.steps === 1) {
                            if (JSON.stringify(vue.lotteryInfo) !== '{}') {
                              vue.$nextTick(function() {
                                vue.$refs.lotterySetPrize.getPrizeToPage(this.lotteryInfo)
                              })
                            }
                          }
                        }
                      })
                  }
                  vue.submiting = false
                })
              }
            } else {
              vue.submiting = false
              this.scrollToView(this, object)
              return false
            }
          }
        )
      } else if (this.$refs.lotterySetPrize) {
        const [
          valid1
        ] = await this.$refs.lotterySetPrize.$refs.lotterySetPrizeSelection1[0].validPromise()
        const [
          valid2
        ] = await this.$refs.lotterySetPrize.$refs.lotterySetPrizeSelection2[0].validPromise()
        const [
          valid3
        ] = await this.$refs.lotterySetPrize.$refs.lotterySetPrizeSelection3[0].validPromise()
        const [
          valid4
        ] = await this.$refs.lotterySetPrize.$refs.lotterySetPrizeSelection4[0].validPromise()
        const [
          valid5
        ] = await this.$refs.lotterySetPrize.$refs.lotterySetPrizeSelection5[0].validPromise()
        const [
          valid6
        ] = await this.$refs.lotterySetPrize.$refs.lotterySetPrizeSelection6[0].validPromise()

        this.$refs.lotterySetPrize.$refs.couponThemeViewContent.validate(
          valid => {
            // 各奖品中奖率之和不能大于100%
            const sum = this.$refs.lotterySetPrize.couponThemeViewContent.lotteryAwardsRuleInstList.reduce((rtv, item) => rtv + (+item.winningRate), 0)
            if (sum > 100) {
              this.$alert(this.$t('中奖率之和不能大于') + '100%', this.$t('系统提示'), {
                confirmButtonText: this.$t('确定'),
                callback: action => {
                  this.$message({
                    type: 'info',
                    message: this.$t('请重新填写中奖率')
                  })
                }
              })
              vue.submiting = false
              return
            }

            if (
              valid &&
              !valid1 &&
              !valid2 &&
              !valid3 &&
              !valid4 &&
              !valid5 &&
              !valid6
            ) {
              const params = vue.$refs.lotterySetPrize.couponThemeViewContent
              params.lotteryAwardsRuleInstList.forEach(i => {
                if (i.prizeContent === undefined) {
                  i.prizeContent = {}
                }
                i.prizeContent.product = {}
                i.prizeContent.coupon = {}
                i.prizeContent.points = {}
                const contentDto = {}
                contentDto.id = i.awardsRefId
                contentDto.name = i.awardsRefName
                contentDto.num = i.awardsRefNum
                if (i.awardsCategory === 1) {
                  i.prizeContent.product = contentDto
                } else if (i.awardsCategory === 2) {
                  i.prizeContent.points = contentDto
                } else if (i.awardsCategory === 3) {
                  i.prizeContent.coupon = contentDto
                }
              })
              this.promotionAPI.createLotteryAwardsRule(params).then(res => {
                if (res && res.code === '0') {
                  this.steps = ++this.steps
                  vue.submiting = false
                } else {
                  vue.submiting = false
                }
              }).finally(() => {
                vue.submiting = false
              })
            } else {
              this.$message({
                type: 'warning',
                message: this.$t('请选择必填项')
              })
              vue.submiting = false
            }
          }
        )
      }
    },
    // getLoadPageConfigCommonOscUrl
    getLoadPageConfigCommonOscUrl() {
      this.promotionAPI
        .getLoadPageConfigCommonOscUrl('PAGE_CONFIG_NOT_SAME')
        .then(res => {
          if (res && res.code === '0') {
            // this.lotteryAwardsIconArr = res.data.LOTTERY_AWARDS_ICON
            console.log('PAGE_CONFIG_NOT_SAME')
          }
        })
    },
    // constructBackTree
    constructBackTree() {
      this.promotionAPI.getLoadPageConfigCommonOscUrl().then(res => {
        if (res && res.code === '0') {
          // this.lotteryAwardsIconArr = res.data.LOTTERY_AWARDS_ICON
          console.log('后台类目')
        }
      })
    },
    // 保存设置的转盘信息
    savePrizeData(data) {
      this.lotteryInfo = data
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
