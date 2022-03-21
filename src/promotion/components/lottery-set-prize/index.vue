<template>
  <div class="cp-lottery-set-prize">
    <el-row>
      <el-col :span="8" class="left-coupon-detail">
        <div class="rotaryTable">
          <div class="dailyDraw-times-limit">{{ $t('今天还有') }}0{{ $t('次抽奖机会') }}</div>
          <div class="lottery-date">2019.09.10 ~ 2019.11.30</div>
          <!-- {{ lotteryAwardsIconArr }} -->
          <div class="turn-place-wrap">
            <div
              v-for="(data,index) in couponThemeViewContent.lotteryAwardsRuleInstList"
              :key="index"
              class="turn-place">
              <div class="turn-title">
                {{ data.awardsRefName || '奖品名称' }}
              </div>
              <img
                :src="data.awardsPicUrl"
                class="turn-img"
                alt="">

            </div>
          </div>
          <div class="my-scores">
            <span>5{{ $t('积分/每次') }}</span>
            <span>{{ $t('我的积分：') }}100</span>
          </div>
        </div>
      </el-col>
      <el-col :span="14" class="right-coupon-detail">
        <el-form
          ref="couponThemeViewContent"
          :model="couponThemeViewContent"
          :rules="rules"
          label-width="100px"
          class="form">
          <ody-title :title="$t('奖品设置')"/>
          <el-tabs
            v-model="couponThemeViewContent.arr"
            name="couponThemeViewContent_arr"
            @tab-click="handleFilterGroupon"
          >
            <el-tab-pane :label="$t('奖品一')" name="1"/>
            <el-tab-pane :label="$t('奖品二')" name="2"/>
            <el-tab-pane :label="$t('奖品三')" name="3"/>
            <el-tab-pane :label="$t('奖品四')" name="4"/>
            <el-tab-pane :label="$t('奖品五')" name="5"/>
            <el-tab-pane :label="$t('奖品六')" name="6"/>
          </el-tabs>
          <template v-for="(item, key) in couponThemeViewContent.lotteryAwardsRuleInstList" >
            <el-form-item
              v-show="+couponThemeViewContent.arr === key+1"
              :key="key"
              class="prize-selection"
              required>
              <lottery-set-prize-selection
                v-if="isLoaded"
                :ref="'lotterySetPrizeSelection' + (key+1)"
                :index="(key+1)"
                :promotion-id="promotionId"
                :prom-type="promType"
                v-model="couponThemeViewContent.lotteryAwardsRuleInstList[key]"
                :arr-type="couponThemeViewContent.arr"
                :intervene-lottery="interveneLottery"
                :lottery-awards-icon="LOTTERY_AWARDS_ICON"

                name="couponThemeViewContent_lotteryAwardsRuleInstList[key]"/>
            </el-form-item>
          </template>

          <!-- 未中奖说明 -->
          <ody-title :title="$t('未中奖说明')"/>
          <el-form-item
            :label="$t('使用说明')"
            prop="notWinningDesc"
          >
            <el-input
              v-model="couponThemeViewContent.notWinningDesc"
              :disabled="editType === 2 || interveneLottery"
              name="couponThemeViewContent_notWinningDesc"
              type="textarea"
              maxlength="1000"
              rows="6"
              show-word-limit/>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>

</template>
<script>
// import constants from '@/utils/constants'
import LotterySetPrizeSelection from '@/components/lottery-set-prize-selection'
export default {
  name: 'PromotionListByType',
  components: {
    LotterySetPrizeSelection
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    itemDisabled: {
      type: Function,
      default: (x, index) => {
        return false
      }
    },
    promType: {
      type: String,
      default: ''
    },
    promotionId: {
      type: String,
      default: ''
    },
    lotteryAwardsIconArr: {
      type: Array,
      default: () => []
    },
    canSave: {
      type: Boolean,
      default: false
    },
    interveneLottery: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLoaded: false,
      LOTTERY_AWARDS_ICON: [],
      visible: false,
      multiple: false,
      selected: [],
      searchParams: {
        merchantType: 1,
        promType: 1,
        promotionId: this.promotionId,
        searchType: 1,
        sellType: 1,
        storeIds: [],
        categoryType: '1',
        brandType: '1'
      },
      tabName: 1,
      couponThemeViewContent: {
        arr: '1',
        notWinningDesc: '',
        activityId: this.promotionId,
        editType: '',
        lotteryAwardsRuleInstList: [
          {
            awardsLevel: '',
            awardsCategory: 0,
            prizeName: '',
            winningNum: '',
            winningRate: '',
            'awardsRefNum': 1,
            'awardsRefName': '谢谢参与',
            'awardsName': '',
            'awardsPicUrl': '',
            prizeContent: {
              product: {},
              coupon: {},
              points: {}
            }
          },
          {
            awardsLevel: '',
            awardsCategory: 0,
            num: '',
            prizeName: '',
            winningNum: '',
            winningRate: '',
            'awardsRefNum': 1,
            'awardsRefName': '谢谢参与',
            'awardsName': '',
            'awardsPicUrl': '',
            prizeContent: {
              product: {},
              coupon: {},
              points: {}
            }
          },
          {
            awardsLevel: '',
            awardsCategory: 0,
            num: '',
            prizeName: '',
            winningNum: '',
            winningRate: '',
            'awardsRefNum': 1,
            'awardsRefName': '谢谢参与',
            'awardsName': '',
            'awardsPicUrl': '',
            prizeContent: {
              product: {},
              coupon: {},
              points: {}
            }
          },
          {
            awardsLevel: '',
            awardsCategory: 0,
            num: '',
            prizeName: '',
            winningNum: '',
            winningRate: '',
            'awardsRefNum': 1,
            'awardsRefName': '谢谢参与',
            'awardsName': '',
            'awardsPicUrl': '',
            prizeContent: {
              product: {},
              coupon: {},
              points: {}
            }
          },
          {
            awardsLevel: '',
            awardsCategory: 0,
            num: '',
            prizeName: '',
            winningNum: '',
            winningRate: '',
            'awardsRefNum': 1,
            'awardsRefName': '谢谢参与',
            'awardsName': '',
            'awardsPicUrl': '',
            prizeContent: {
              product: {},
              coupon: {},
              points: {}
            }
          },
          {
            awardsLevel: '',
            awardsCategory: 0,
            prizeName: '',
            winningNum: '',
            winningRate: '',
            'awardsRefNum': 1,
            'awardsRefName': '谢谢参与',
            'awardsName': '',
            'awardsPicUrl': '',
            prizeContent: {
              product: {},
              coupon: {},
              points: {}
            }
          }
        ]
      },
      rules: {
        notWinningDesc: [
          { required: false, message: this.$t('请输入使用说明'), trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  computed: {
    getLotteryAwardsIconMap() {
      return this.LOTTERY_AWARDS_ICON.reduce((rtv, item) => {
        // console.log(rtv, item, 111)
        rtv[item.awardsCategory] = item
        return rtv
      }, {})
    }
  },
  watch: {

  },
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    await this.queryLoadOscConfigUrl()
    await this.queryLotteryAwards()
    this.isLoaded = true
  },
  destroyed() {
    this.$emit('setPrizeData', {
      lotteryAwardsRuleInstList: this.couponThemeViewContent.lotteryAwardsRuleInstList,
      notWinningDesc: this.couponThemeViewContent.notWinningDesc
    })
  },
  methods: {
    async queryLoadOscConfigUrl() {
      const params = 'LOTTERY_PAGE_CONFIG'
      const {
        data: { LOTTERY_AWARDS_ICON } = {}
      } = await this.promotionAPI.getLoadPageConfigCommonOscUrl(params)

      this.LOTTERY_AWARDS_ICON = LOTTERY_AWARDS_ICON
      // console.log('LOTTERY_AWARDS_ICON', LOTTERY_AWARDS_ICON)
    },
    async queryLotteryAwards() {
      const lotteryActivityId = this.promotionId
      const res = await this.promotionAPI.queryLotteryAwards({ lotteryActivityId })

      if (res.data.notWinningDesc) {
        this.couponThemeViewContent.notWinningDesc = res.data.notWinningDesc
      }

      const defaultX = {
        awardsLevel: '',
        awardsCategory: 0,
        prizeName: '',
        winningNum: '',
        winningRate: '',
        'awardsRefNum': 1,
        'awardsRefName': '谢谢参与',
        'awardsName': '',
        'awardsPicUrl': this.getLotteryAwardsIconMap[0].awardsPicUrl,
        prizeContent: {
          product: {},
          coupon: {},
          points: {}
        }
      }

      if (res.data.lotteryAwardsRuleInstList) {
        this.couponThemeViewContent.lotteryAwardsRuleInstList = res.data.lotteryAwardsRuleInstList
      } else {
        this.couponThemeViewContent.lotteryAwardsRuleInstList = [1, 2, 3, 4, 5, 6].map(item => {
          return {
            ...defaultX
          }
        })
      }

      // console.log('this.couponThemeViewContent.lotteryAwardsRuleInstList', this.couponThemeViewContent.lotteryAwardsRuleInstList)
    },
    cancel() {
      this.visible = false
    },
    ok(val) {
      this.visible = false
    },
    handleFilterGroupon(val) {
      this.couponThemeViewContent.arr = val.name
    },
    // 将传入已有的转盘信息存入
    getPrizeToPage(val) {
      this.$set(this.couponThemeViewContent, 'lotteryAwardsRuleInstList', val.lotteryAwardsRuleInstList)
      this.$set(this.couponThemeViewContent, 'notWinningDesc', val.notWinningDesc)
    }
  }
}
</script>
<style lang="scss" scoped>
.cp-lottery-set-prize {
  .left-coupon-detail {
    margin-top: 40px;
    margin-left: 20px;
    .rotaryTable {
      position: relative;
      width: 320px;
      height: 569px;
      background: url('./images/go.png') no-repeat;
      .turn-place-wrap {
        width: 250px;
        height: 250px;
        position: absolute;
        top: 237px;
        left: 34px;
        // border: 1px solid red;
      }
      .turn-place {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform-origin: 50% 50%;
        text-align: center;
        .turn-title {
          margin-top: 27px;
          font-size: 12px;
          position: relative;
        }
        .turn-img {
          width: 28px;
          img {
            width: 28px;
          }
          .goods {
            width: 28px;
            height: 28px;
          }
          .integral {
            width: 28px;
            height: 28px;
          }
          .coupon {
            width: 28px;
            height: 28px;
          }
          .offline_prizes {
            width: 28px;
            height: 28px;
          }
          .thanks {
            width: 28px;
            height: 28px;
          }
        }
        &:nth-child(1) {
        }
        &:nth-child(2) {
          transform: rotate(60deg);
        }
        &:nth-child(3) {
          transform: rotate(120deg);
        }
        &:nth-child(4) {
          transform: rotate(180deg);
        }
        &:nth-child(5) {
          transform: rotate(240deg);
        }
        &:nth-child(6) {
          transform: rotate(300deg);
        }
      }
    }
    .dailyDraw-times-limit {
      font-size: 14px;
      position: absolute;
      top: 150px;
      left: 90px;
      color: #FEF75B;
    }
    .lottery-date {
      font-size: 12px;
      position: absolute;
      top: 180px;
      left: 97px;
      color: #ADBCE4;
    }
    .my-scores {
      font-size: 12px;
      color: #E1ECF9;
      position: absolute;
      bottom: 54px;
      left: 105px;
    }
  }

  .right-coupon-detail {
    margin-top: 40px;
    .winning-rate {
      .el-form-item.coupon-limit.el-form-item--medium {
        display: inline-block;
      }
      .el-input {
        width: 100px;
        display: inline-block;
      }
    }
    .prize-selection {
      margin-left: -100px;
    }

  }
}
</style>
