<template>
  <div class="cp-created-success">
    <div v-if="promType!=8000" class="success-title">
      <i class="el-icon-success icon-style" />{{ this.$t('促销活动创建成功')+'!' }}
    </div>
    <div v-else class="success-title">
      <i class="el-icon-success icon-style" />{{ this.$t('推荐码活动创建成功')+'!' }}
    </div>
    <div>
      <ody-button name="seeActivityList" code="button017" @click="seeActivityList">{{ $t('查看活动列表') }}</ody-button>
      <ody-button
        v-show="submitVerifyBtnShow"
        name="submitVerifyActivity"
        type="primary"
        size="medium"
        code="button018"
        @click="submitVerifyActivity"
      >{{ $t('提交审核') }}</ody-button>
      <ody-button
        v-show="verifyBtnShow"
        name="openVerifyPop"
        type="primary"
        size="medium"
        code="button019"
        @click="openVerifyPop"
      >{{ $t('审核') }}</ody-button>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    promType: {
      type: String,
      default: ''
    },
    promotionId: {
      type: String,
      default: ''
    },
    getList: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      promotionAPI: null,
      detailData: {}
    }
  },
  computed: {
    submitVerifyBtnShow() {
      if (
        this.promType === 3001 ||
        this.promType === 8000 ||
        this.promType === '2000'
      ) {
        return +this.detailData.status === 0 || +this.detailData.status === 3
      } else if (this.promType === 6000) {
        return (
          +this.detailData.status === 0 ||
          +this.detailData.status === 3 ||
          +this.detailData.status === 4
        )
      } else {
        return (
          +this.detailData.activityStatus === 0 ||
          +this.detailData.activityStatus === 3
        )
      }
    },
    verifyBtnShow() {
      if (
        this.promType === 3001 ||
        this.promType === 8000 ||
        this.promType === '2000' ||
        this.promType === 6000
      ) {
        return +this.detailData.status === 1
      } else {
        return +this.detailData.activityStatus === 1
      }
    }
  },
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  mounted() {
    if (this.promType === 8000 || this.promType === '8000') {
      this.queryReferralCodeActivityDetail()
    } else if (this.promType === '2000') {
      this.queryPatchGrouponThemeDetail()
    } else if (this.getList) {
      this.queryPromotionActivityDetail()
    }
  },
  methods: {
    seeActivityList() {
      const nameMap = {
        8000: 'PromPromotionRecommendationList',
        2000: 'PromGrouponList',
        1: 'PromSinglePromotion', // 单一促销
        2: 'PromFullVolumePromotion', // 满额促销
        3: 'PromFullSalesPromotion', // 满量促销
        4: 'PromGiftPromotion', // 赠送类促销
        11: 'PromRedemption', // 换购
        10: 'PromCombinationPromotion', // 组合促销
        18: 'PromSingleXpieceDiscount', // 单品X件优惠
        15: 'PromPackage', // 套餐
        14: 'PromSpike', // 秒杀
        13: 'PromPresale', // 预售
        9: 'PromShippingPromotion', // 包邮促销
        5001: 'PromLotteryPromotion', // 抽奖类促销
        3001: 'PromCutPrice', // 砍价
        12: 'PromPaymentOffer', // 支付优惠
        16: 'PromotionTrialManagement', // 试用
        6000: 'PromPromotionCouponThemeList' // 优惠券
      }

      if (nameMap[this.promType]) {
        // this.$router.push({
        //   name: nameMap[this.promType]
        // })
        this.$router.push({
          name: nameMap[this.promType],
          query: {}
        })
      } else {
        // this.$router.push({
        //   path: `/back-promotion-web/promotion/member-restrictions/list`
        // })
        this.$router.push({
          name: 'PromMemberRestrictions',
          query: {}
        })
      }

      this.$portal.delActiveViewAndRefresh()
    },
    async queryReferralCodeActivityDetail() {
      const params = {
        id: this.promotionId
      }
      const {
        data,
        code
      } = await this.promotionAPI.queryReferralCodeActivityDetail(params)
      if (+code === 0) {
        this.detailData = data || {}
      }
    },
    async queryPatchGrouponThemeDetail() {
      const params = {
        id: this.promotionId
      }
      const {
        data,
        code
      } = await this.promotionAPI.queryPatchGrouponThemeDetail(params)
      if (+code === 0) {
        this.detailData = data || {}
      }
    },
    async queryPromotionActivityDetail() {
      if (this.promType === 3001) {
        const { data, code } = await this.promotionAPI.queryCutPriceDetail(
          this.promotionId
        )
        if (+code === 0) {
          this.detailData = data || {}
        }
      } else if (this.promType === 6000) {
        const { data, code } = await this.promotionAPI.queryCouponDetailById({
          id: this.promotionId
        })
        if (+code === 0) {
          this.detailData = data || {}
        }
      } else if (this.promType !== 10000) {
        const { data, code } = await this.promotionAPI.getPromotionDetailUrl({
          id: this.promotionId
        })
        if (+code === 0) {
          this.detailData = data || {}
        }
      }
    },
    async submitVerifyActivity() {
      const confirm = await this.$confirm(this.$t('确认提交审核') + '？', this.$t('提交审核'))
      if (!confirm) {
        return
      }
      if (this.promType === 3001) {
        const { code } = await this.promotionAPI.cutPriceActivitySubmitAudit({
          id: this.promotionId,
          status: this.detailData.status
        })
        if (+code === 0) {
          await this.queryPromotionActivityDetail()
        }
      } else if (this.promType === 8000 || this.promType === '8000') {
        this.detailData.status = 1
        const { data } = await this.promotionAPI.recommendSubmitActivity(
          this.detailData
        )
        if (data) {
          await this.queryReferralCodeActivityDetail()
        }
      } else if (this.promType === 6000 || this.promType === '6000') {
        // debugger
        const { data } = await this.promotionAPI.couponActivitySubmitAudit(
          this.detailData
        )
        this.detailData.status = 1
        if (data) {
          await this.queryReferralCodeActivityDetail()
        }
      } else if (this.promType === '2000') {
        const {
          code
        } = await this.promotionAPI.patchGrouponThemeSubmitAuditUrl(
          this.detailData
        )
        if (+code === 0) {
          await this.queryPatchGrouponThemeDetail()
        }
      } else {
        const { code } = await this.promotionAPI.submitActivity({
          id: this.promotionId
        })
        if (+code === 0) {
          await this.queryPromotionActivityDetail()
        }
      }
    },
    openVerifyPop() {
      this.$prompt('管理员备注:', this.$t('提示'), {
        distinguishCancelAndClose: true,
        confirmButtonText: this.$t('通过'),
        cancelButtonText: this.$t('不通过'),
        showClose: true,
        inputType: 'textarea',
        inputPattern: /^.{0,100}$/,
        inputErrorMessage: this.$t('只能输入100字符以内'),
        beforeClose: async(action, instance, done) => {
          const remark = instance.inputValue

          if ((remark === '' || remark === null) && action === 'cancel') {
            this.$message('请填写备注')
            return
          }

          if (action === 'close') {
            done()
            return
          }

          if (instance.editorErrorMessage !== '') {
            return false
          }

          if (action === 'cancel') {
            this.detailData.status = 4
            if (this.promType === 3001) {
              this.promotionAPI
                .cutPriceActivityAuditNotPass({
                  id: this.promotionId,
                  remark: remark,
                  status: 1
                })
                .then(res => {
                  if (+res.code === 0) {
                    this.queryPromotionActivityDetail()
                    done()
                  }
                })
            } else if (this.promType === '2000') {
              this.promotionAPI
                .patchGrouponThemeAuditNotPass({
                  id: this.promotionId,
                  remark: remark,
                  status: 1
                })
                .then(res => {
                  if (+res.code === 0) {
                    this.queryReferralCodeActivityDetail()
                    done()
                  }
                })
            } else if (this.promType === 8000 || this.promType === '8000') {
              this.detailData.remark = remark
              this.detailData.status = 4
              this.promotionAPI
                .codeVerifyActivityNotPass(this.detailData)
                .then(res => {
                  if (+res.code === 0) {
                    this.queryReferralCodeActivityDetail()
                    done()
                  }
                })
            } else if (this.promType === '6000' || this.promType === 6000) {
              const {
                code
              } = await this.promotionAPI.couponActivityAuditNotPass({
                id: this.promotionId,
                status: 1,
                remark: remark
              })
              this.detailData.status = 2
              if (+code === 0) {
                this.promotionAPI.queryCouponDetailById({
                  id: this.promotionId
                })
                done()
              }
            } else {
              this.promotionAPI
                .verifyActivityNotPass({
                  id: this.promotionId,
                  remark: remark
                })
                .then(res => {
                  if (+res.code === 0) {
                    this.queryPromotionActivityDetail()
                    done()
                  }
                })
            }
          } else if (action === 'confirm') {
            if (this.promType === 3001) {
              const {
                code
              } = await this.promotionAPI.cutPriceActivityAuditPass({
                id: this.promotionId,
                status: 1
              })
              if (+code === 0) {
                await this.queryPromotionActivityDetail()
                this.seeActivityList()
                done()
              }
            } else if (this.promType === '2000') {
              this.promotionAPI
                .patchGrouponThemeAuditPass({
                  id: this.promotionId,
                  remark: remark,
                  status: 1
                })
                .then(res => {
                  if (+res.code === 0) {
                    this.queryPatchGrouponThemeDetail()
                    this.seeActivityList()
                    done()
                  }
                })
            } else if (this.promType === '8000' || this.promType === 8000) {
              this.detailData.remark = remark
              this.detailData.status = 4
              const { code } = await this.promotionAPI.codeVerifyActivityPass(
                this.detailData
              )
              if (+code === 0) {
                await this.queryReferralCodeActivityDetail()
                this.seeActivityList()
                done()
              }
            } else if (this.promType === '6000' || this.promType === 6000) {
              const { code } = await this.promotionAPI.couponActivityAuditPass({
                id: this.promotionId,
                status: 1,
                remark: remark
              })
              this.detailData.status = 2
              if (+code === 0) {
                this.promotionAPI.queryCouponDetailById({
                  id: this.promotionId
                })
                done()
              }
            } else {
              const { code } = await this.promotionAPI.verifyActivityPass({
                id: this.promotionId,
                remark: remark
              })
              if (+code === 0) {
                await this.queryPromotionActivityDetail()
                this.seeActivityList()
                done()
              }
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-style {
  font-size: 36px;
  color: #13ce66;
  vertical-align: middle;
  margin: 0 10px 0 0;
}
.cp-created-success {
  display: flex;
  flex-flow: column;
  align-items: center;
  padding-top: 130px;
  padding-bottom: 150px;

  .success-title {
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(69, 90, 100, 1);
    line-height: 22px;
  }
}
</style>
