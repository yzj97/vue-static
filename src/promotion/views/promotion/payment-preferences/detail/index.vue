<template>
  <div class="pg-promotion-detail">
    <ody-box :title="$t('促销活动详情')">
      <div class="detail-top">
        <div class="detail-top-titte">{{ $t('活动名称') }}：{{ detailData.promTitle }}</div>
        <el-row>
          <el-col :span="10">
            <div class="detail-top-content">
              <span>{{ $t('活动ID') }}：{{ detailData.id }}</span>
              <span
                class="detail-top-content-item"
              >{{ $t('当前状态') }}：{{ detailData.activityStatus | keyVal(getActivityStatus) }}</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div>
              <ody-button
                v-show="submitVerifyBtnShow"
                name="submitVerifyActivity"
                type="primary"
                size="small"
                code="button018"
                @click="submitVerifyActivity"
              >{{ $t('提交审核') }}</ody-button>
              <el-button
                v-show="verifyBtnShow"
                name="openVerifyPop"
                type="primary"
                size="small"
                code="button019"
                @click="openVerifyPop"
              >{{ $t('审核') }}</el-button>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-tabs v-model="activeName" name="activeName" @tab-click="handleTabClick">
        <el-tab-pane :label="$t('促销规则')" name="first" class="promotion-rules">
          <ody-space :space="4">
            <div class="base-info">
              <div class="header">{{ $t('基本信息') }}</div>
              <div class="item">
                <label>{{ $t('促销名称') }}：</label>
                {{ detailData.promTitle }}
              </div>
              <div class="item">
                <label>{{ $t('活动时间') }}：</label>
                {{ detailData.fromDate }} — {{ detailData.endDate }}
              </div>
              <div class="item">
                <label>{{ $t('循环时间') }}：</label>
                {{ detailData.cycleTimeWeekList | getCycleTimeWeekList(cycleTimeWeekListData) }}
              </div>
            </div>
            <div class="base-info">
              <div class="header">{{ $t('活动规则') }}</div>
              <div class="item">
                <label>{{ $t('活动类型') }}：</label> {{ $t('支付优惠') }}
              </div>
              <div class="item">
                <label>{{ $t('优惠标签') }}：</label>
                {{ detailData.promLabel }}
              </div>
              <div class="item">
                <label>{{ $t('每个用户优惠次数上限') }}：</label>
                {{ detailData.promLimitRule && detailData.promLimitRule.individualLimit }}
                {{ $t('次') }}
              </div>
              <div class="item">
                <label>{{ $t('优惠总金额上限') }}：</label>
                {{ detailData.promLimitRule && detailData.promLimitRule.totalLimitAmount }}
                元
              </div>
              <div class="item">
                <label>{{ $t('优惠设置') }}：</label>
                <!-- {{ detailData }} -->
                <promotion-favourable-list :detail-data="detailData" />
              </div>
            </div>
            <div class="base-info">
              <div class="header">{{ $t('交易规则') }}</div>
              <div class="item">
                <label>{{ $t('支付渠道') }}：</label>
                {{ detailData.payType | keyVal(getPayStatus) }}
              </div>
            </div>
            <div class="base-info">
              <div class="header">{{ $t('参与条件') }}</div>
              <div v-show="detailData.channelCodes" class="item">
                <label>{{ $t('活动渠道') }}：</label>
                {{ detailData.channelCodes | getChannelName(channelMap) }}
              </div>
              <div v-show="detailData.applicablePlatformList" class="item">
                <label>{{ $t('活动平台') }}：</label>
                {{ detailData.applicablePlatformList | getApplicablePlatform(applicableMap) }}
              </div>
              <div v-show="detailData.userScopeList" class="item">
                <label>{{ $t('新老用户') }}：</label>
                {{ detailData.userScopeList | getUserScopeList(userScopeListMap) }}
              </div>
            </div>
          </ody-space>
        </el-tab-pane>
      </el-tabs>
    </ody-box>
  </div>
</template>

<script>
import constants from '@/utils/constants'
import PromotionFavourableList from '@/components/favourable-list'

export default {
  name: 'PromPaymentPreferencesDetail',
  components: {
    PromotionFavourableList
  },
  filters: {
    getCycleTimeWeekList(cycleTimeWeekList, cycleTimeWeekListData) {
      if (cycleTimeWeekList) {
        return cycleTimeWeekList
          .map(item => {
            const index = cycleTimeWeekListData.findIndex(
              key => key.value === item
            )
            if (index > -1) {
              return cycleTimeWeekListData[index].label
            }
          })
          .join('、')
      }
      return ''
    },
    getChannelName(channelCodes, channelMap) {
      if (channelCodes) {
        return channelCodes
          .map(item => {
            if (channelMap[item]) {
              return channelMap[item].channelName
            }
          })
          .join('、')
      }
      return ''
    },
    getApplicablePlatform(applicablePlatformList, applicableMap) {
      if (applicablePlatformList) {
        var applicableArr = []
        if (applicableMap && applicableMap.length > 0) {
          applicablePlatformList.map(item => {
            const index = applicableMap.findIndex(key => key.id === item)
            if (applicableMap[index]) {
              applicableArr.push(applicableMap[index].text)
            }
          })
          return applicableArr.join('、')
        }
      }
      return ''
    },
    getUserScopeList(userScopeList, userScopeListMap) {
      if (userScopeList) {
        var userScopeArr = []
        if (userScopeListMap && userScopeListMap.length > 0) {
          userScopeList.map(item => {
            const index = userScopeListMap.findIndex(key => key.id === item)
            if (userScopeListMap[index]) {
              userScopeArr.push(userScopeListMap[index].text)
            }
          })
          return userScopeArr.join('、')
        }
      }
      return ''
    }
  },
  props: {
    basicInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      promType: '',
      overLimitTypeList: [],
      channelMap: {},
      applicableMap: {},
      userScopeListMap: [],
      activeName: 'first',
      promotionId: '',
      promotionAPI: '',
      detailData: {},
      cycleTimeWeekListData: constants.cycleTimeWeekListData,
      payTypeList: []
    }
  },
  computed: {
    getPromotionSet() {
      if (this.detailData.promotionMethod === 15) {
        return `满${this.detailData.favourableList[0].favourableCondition /
          100}元减${this.detailData.favourableList[0].favourableContent /
          100}元`
      } else if (this.detailData.promotionMethod === 16) {
        if (this.detailData.favourableList[0].favourableContentLimit) {
          return `打${this.detailData.favourableList[0].favourableContent /
            10}折 优惠上线是${this.detailData.favourableList[0]
            .favourableContentLimit / 100}元`
        } else {
          return `打${this.detailData.favourableList[0].favourableContent /
            10}折`
        }
      }
    },
    getActivityStatus() {
      return constants.activityStatus.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getPayStatus() {
      return this.payTypeList.reduce((rtv, item) => {
        rtv[item.channelCode] = item.channelName
        return rtv
      }, {})
    },
    submitVerifyBtnShow() {
      //  商家显示平台创建的促销时，不显示改按钮
      if (+this.detailData.merchantTyp === 3 && this.platformId === 2) {
        return false
      }
      return (
        +this.detailData.activityStatus === 0 ||
        +this.detailData.activityStatus === 3
      )
    },
    verifyBtnShow() {
      return +this.detailData.activityStatus === 1
    }
  },
  created() {
    this.promotionId = this.$route.params.promotionId
    this.promType = this.$route.params.promotionType
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    await this.queryPromotionActivityDetail()
    await this.getChannelArrByBusiness()
    await this.getLoadPageConfigUrl()
    await this.getLoadOscConfigUrl()
    this.queryPayChannel()
  },
  methods: {
    async submitVerifyActivity() {
      const confirm = await this.$confirm(this.$t('确认提交审核') + '？', this.$t('提交审核'))
      if (!confirm) {
        return
      }
      const { code } = await this.promotionAPI.submitActivity({
        id: this.promotionId
      })
      if (+code === 0) {
        await this.queryPromotionActivityDetail()
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
          } else if (action === 'confirm') {
            const { code } = await this.promotionAPI.verifyActivityPass({
              id: this.promotionId,
              remark: remark
            })
            if (+code === 0) {
              await this.queryPromotionActivityDetail()
              done()
            }
          }
        }
      })
    },

    queryPayChannel() {
      this.promotionAPI.queryPayChannel({}).then(res => {
        this.payTypeList = res.data
      })
    },
    async getLoadOscConfigUrl() {
      const { data = {}} = await this.promotionAPI.loadOscConfigUrl(
        'overlimitRule',
        {}
      )
      if (data && data.result) {
        this.overLimitTypeList = data.result
      }
    },

    handleTabClick(tab, event) {
      console.log(tab, event)
    },
    async queryPromotionActivityDetail() {
      const params = {
        id: this.promotionId
      }
      const { data = {}, code } = await this.promotionAPI.getPromotionDetailUrl(
        params
      )
      if (code === '0' && data) {
        this.detailData = data
      }
    },
    // 读取商家渠道信息
    async getChannelArrByBusiness() {
      const { data } = await this.promotionAPI.queryChannelMap({})
      this.channelMap = data
    },
    // 活动平台
    async getLoadPageConfigUrl() {
      const { data } = await this.promotionAPI.loadPageConfigMethod({})
      this.applicableMap = data.applicablePlatform
      this.userScopeListMap = data.userScope
    }
  }
}
</script>

<style lang="less" scoped>
.pg-promotion-detail {
  .detail-top {
    margin-bottom: 20px;

    &-titte {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(69, 90, 100, 1);
      line-height: 22px;
      margin-bottom: 10px;
    }

    &-content {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(69, 90, 100, 1);
      line-height: 32px;

      &-item {
        margin-left: 32px;
      }
    }
  }

  .promotion-rules {
    .base-info {
      height: 100px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(69, 90, 100, 1);
      line-height: 17px;
    }

    .header {
      font-size: 14px;
      margin-bottom: 20px;
    }

    .item {
      margin-bottom: 10px;
      word-break: break-all;
    }
  }
}
</style>
