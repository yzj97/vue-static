<template>
  <div class="cp-created-success">
    <img src="./images/icon-sucess.png" alt width="90px" >
    <div class="success-title">抽奖活动创建成功!</div>
    <div class="success-directions">抽奖活动页面链接如下，审核通过后即可生效</div>
    <div class="success-link">
      <!-- <span id="inviteCode">http://admin.2d5d1testback.oudianyun.com</span> -->
      <el-input
        v-model="inputData"
        :disabled="true"
        name="inputData"
        placeholder="Please input"
        style="width:700px;max-width:100%;"
      />
      <ody-button
        v-clipboard:copy="inputData"
        v-clipboard:success="clipboardSuccess"
        size="mini"
        code="button020"
      >{{ $t('复制链接') }}</ody-button>
    </div>
    <div>
      <ody-button name="button017_seeActivityList" code="button017" @click="seeActivityList">{{ $t('查看活动列表') }}</ody-button>
      <ody-button
        v-if="submitVerifyBtnShow"
        name="button018_submitVerifyActivity"
        type="primary"
        size="medium"
        code="button018"
        @click="submitVerifyActivity"
      >{{ $t('提交审核') }}</ody-button>
      <ody-button
        v-if="verifyBtnShow"
        name="button019_openVerifyPop"
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
    }
  },
  data() {
    return {
      promotionAPI: null,
      linkList: [],
      promotionDetailData: {},
      inputData: '',
      isExamine: false,
      isOpenConfirm: true
    }
  },
  computed: {
    submitVerifyBtnShow() {
      //  商家显示平台创建的促销时，不显示改按钮
      if (+this.promotionDetailData.merchantType === 3 && this.platformId === 2) {
        return false
      }
      // 促销活动状态为 0：待提交或3：审核未通过时，提交按钮显示
      return (
        this.promotionDetailData.status === 0 ||
        this.promotionDetailData.status === 3
      )
    },
    verifyBtnShow() {
      // 促销活动状态为 1：待审核时，审核按钮显示
      return this.promotionDetailData.status === 1
    }
  },
  watch: {},
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    await this.queryLotteryTheme()
  },
  methods: {
    // 查看活动列表
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
        16: 'PromotionTrialManagement' // 试用
      }

      if (nameMap[this.promType]) {
        this.$router.push({
          name: nameMap[this.promType]
        })
      } else {
        this.$router.push({
          path: `/back-promotion-web/promotion/member-restrictions/list`
        })
      }

      this.$portal.delActiveViewAndRefresh()
    },
    async queryLotteryTheme() {
      const params = {
        lotteryActivityId: this.promotionId
      }

      const { data = {}, code } = await this.promotionAPI.queryLotteryTheme(
        params
      )

      if (code === '0') {
        this.promotionDetailData = data
        console.log('this.promotionDetailData', this.promotionDetailData)
        this.getPromotionLinks()
      }
    },
    async getPromotionLinks() {
      const params = {
        channelCodes: ['110001'],
        lable: 'h5',
        promType: 5001,
        themeId: this.promotionId
      }
      const { data = [], code } = await this.promotionAPI.getPromotionLinks(
        params
      )

      if (code === '0') {
        this.linkList = data
        this.inputData = data && data[0] && data[0].url
        // console.log('this.linkList', this.linkList)
      }
    },
    // 审核按钮
    openVerifyPop(e) {
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
            this.promotionAPI
              .auditLotteryActivity({
                lotteryThemeId: this.promotionId,
                remark: remark,
                status: 3
              })
              .then(res => {
                if (+res.code === 0) {
                  this.queryLotteryTheme()
                  done()
                }
              })
          } else if (action === 'confirm') {
            this.promotionAPI
              .auditLotteryActivity({
                lotteryThemeId: this.promotionId,
                remark: remark,
                status: 4
              })
              .then(res => {
                if (+res.code === 0) {
                  this.queryLotteryTheme()
                  done()
                }
              })
          }
        }
      })
    },
    // 复制地址
    clipboardSuccess() {
      this.$message({
        message: this.$t('复制成功'),
        type: 'success',
        duration: 1500
      })
    },
    async submitVerifyActivity() {
      const confirm = await this.$confirm(this.$t('确认提交审核') + '？', this.$t('提交审核'))
      if (!confirm) {
        return
      }
      const { code } = await this.promotionAPI.submitLotteryActivity({
        id: this.promotionId
      })
      if (+code === 0) {
        await this.queryLotteryTheme()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-created-success {
  display: flex;
  flex-flow: column;
  align-items: center;
  padding-top: 150px;
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
  .success-directions {
    font-size: 14px;
  }
  .success-link {
    font-size: 14px;
    margin-bottom: 50px;
  }
}
</style>
