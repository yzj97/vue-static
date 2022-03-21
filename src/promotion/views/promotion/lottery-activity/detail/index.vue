<template>
  <div class="pg-promotion-detail">
    <ody-box :title="$t('抽奖类活动详情')">
      <div class="detail-top">
        <div class="detail-top-titte">{{ $t('活动名称') }}：{{ themeView.activityName }}</div>
        <el-row>
          <el-col :span="10">
            <div class="detail-top-content">
              <span>活动ID：{{ themeView.id }}</span>
              <span class="detail-top-content-item">当前状态：{{ themeView.statusDesc }}</span>
            </div>
          </el-col>
          <el-col :span="3">
            <div>
              <ody-button
                v-show="submitVerifyBtnShow"
                name="submitVerifyActivity"
                type="primary"
                size="small"
                code="button018"
                @click="submitVerifyActivity"
              >{{ $t('提交审核') }}</ody-button>
              <ody-button
                v-show="verifyBtnShow"
                name="openVerifyPop"
                type="primary"
                size="small"
                code="button019"
                @click="openVerifyPop"
              >{{ $t('审核') }}</ody-button>
            </div>
          </el-col>
          <!-- <el-col :span="4">
            <div>
              <el-button v-if="viewBtnShow" name="viewMarketingReport" type="primary" size="small" @click="viewMarketingReport">{{ $t('查看营销报告') }}</el-button>
            </div>
          </el-col> -->
        </el-row>
        <div class="lottery-link-page">
          <span>抽奖活动页面链接如下，审核通过后即可生效</span>
          <div class="lottery-link">
            <span>自建BBC:</span>
            <label id="text">
              {{ copy.url }}
            </label>
            <ody-button
              v-clipboard:copy="copy.url"
              v-clipboard:success="clipboardSuccess"
              size="mini"
              code="button020"
            >{{ $t('复制链接') }}</ody-button>
            <!-- <el-button name="copyLink" type="primary" size="small" @click="copyLink">{{ $t('复制') }}</el-button> -->
          </div>
        </div>
      </div>

      <el-tabs v-model="activeName" name="activeName" @tab-click="handleTabClick">
        <el-tab-pane :label="$t('抽奖规则')" name="first" class="promotion-rules">
          <ody-space :space="4">
            <div class="base-info">
              <div class="header">{{ $t('基本信息') }}</div>
              <div class="item">{{ $t('促销名称') }}：{{ themeView.activityName }}</div>
              <div
                class="item"
              >{{ $t('活动时间') }}：{{ themeView.effStartTimeStr }} — {{ themeView.effEndTimeStr }}</div>
              <div
                class="item"
              >{{ $t('抽奖模板') }}：{{ themeView.lotteryTemplate | keyVal(getLotteryTemplateList) }}</div>
            </div>
            <div class="base-info">
              <div class="header">{{ $t('活动规则') }}</div>
              <div
                class="item"
              >{{ $t('抽奖活动类型') }}：{{ getOrderDrawValue() }}</div>
              <div v-if="behaviorTypeStr && behaviorTypeStr != ''" class="item">{{ $t('行为抽奖') }}：{{ behaviorTypeStr }}</div>
              <div v-if="themeView.lotteryType == 1" class="item">{{ $t('每次抽奖需消耗') }}：{{ themeView.drawPointsPerTime }} 积分</div>
              <div v-if="themeView.lotteryType == 1" class="item">{{ $t('免积分抽奖次数') }}：{{ themeView.costFreeDrawTimes }}</div>
              <div class="item">{{ $t('用户每日抽奖次数上限') }}：{{ themeView.dailyDrawTimesLimit }}</div>
              <div class="item">{{ $t('用户每日中奖次数上限') }}：{{ themeView.dailyWinningTimesLimit }}</div>
            </div>
            <div class="base-info">
              <div class="header">{{ $t('参与条件') }}</div>
              <div
                v-show="themeView.channelCode"
                class="item"
              >{{ $t('活动渠道') }}：{{ themeView.channelCode | getChannelName(channelMap) }}</div>
              <div class="item">
                {{ $t('备注') }}：
                <div class="item-description" v-html="themeView.activityDesc" />
              </div>
            </div>
          </ody-space>
        </el-tab-pane>

        <el-tab-pane :label="$t('奖品设置')" name="second" class="promotion-rules">
          <ody-space :space="4">
            <div
              v-for="item in awardsRuleView.lotteryAwardsRuleInstList"
              :key="item.id"
              class="base-info"
            >
              <div class="item">{{ $t('奖项等级') }}：
                {{ item.awardsName }}
              </div>
              <div class="item">{{ $t('奖品类别') }}：
                {{ item.awardsCategory | keyVal(awardsCategoryMap) }}
              </div>
              <div v-if="item.awardsCategory === 2" class="item">{{ $t('积分') }}：
                {{ item.awardsRefNum }}
              </div>
              <div v-if="item.awardsCategory === 3" class="item">{{ $t('优惠券') }}：
                {{ item.awardsRefName }}
              </div>
              <template v-if="item.awardsCategory > 0">
                <div class="item">{{ $t('奖品名称') }}：
                  {{ item.awardsRefName }}
                </div>

                <div class="item">{{ $t('奖品数量') }}：
                  {{ item.winningNum }}
                </div>
              </template>
              <div class="item">{{ $t('中奖率') }}：{{ item.winningRate }}%</div>
            </div>
          </ody-space>
        </el-tab-pane>

        <el-tab-pane :label="$t('活动统计')" name="third" class="activity-statistics">
          <ody-space :space="4">
            <div class="base-info">
              <div class="item">
                {{ $t('参与人数') }}：
                <span class="activity-number">{{ recordsView.drawUserCount }}</span>
              </div>
            </div>
            <div class="base-info">
              <div class="item">
                {{ $t('参与次数') }}：
                <span class="activity-number">{{ recordsView.drawCount }}</span>
              </div>
            </div>
            <div class="base-info">
              <div class="item">
                {{ $t('中奖人数') }}：
                <span class="activity-number">{{ recordsView.winningUserCount }}</span>
              </div>
            </div>
            <div class="base-info">
              <div class="item">
                <el-button name="exportResult" type="primary" @click="exportResult">{{ $t("导出Excel") }}</el-button>
              </div>
            </div>
          </ody-space>

          <ody-list-table-area>
            <div slot="table">
              <ody-table
                ref="table"
                :can-filter="false"
                :columns="columns"
                :operates="operates"
                :data="recordsView.drawRecords.listObj"
                name="recordsView_drawRecords_listObj150"
              />
              <ody-pagination
                :current-page.sync="recordsView.currentPage"
                :list="recordsView.drawRecords.listObj"
                :page-sizes="[10, 20, 30, 50]"
                :page-size.sync="recordsView.itemsPerPage"
                :total.sync="recordsView.drawRecords.total"
                background
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </ody-list-table-area>
        </el-tab-pane>
      </el-tabs>
    </ody-box>
  </div>
</template>

<script>
import constants from '@/utils/constants'
import PromotionMerchantSelect from '@/components/promotion-merchant-select'
export default {
  name: 'PromLotteryActivityDetail',
  components: {
    PromotionMerchantSelect
  },
  filters: {
    getChannelName(channelCode, channelMap) {
      if (channelCode) {
        return channelMap[channelCode].channelName
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
      copy: {
        channel: null,
        url: null
      },
      awardsCategoryMap: {
        0: '谢谢参与',
        1: '商品',
        2: '积分',
        3: '优惠券',
        4: '线下奖品'
        // 商品1，积分2， 优惠券3，线下奖品4， 谢谢惠顾 0
      },
      themeView: {},
      awardsRuleView: {
        lotteryAwardsRuleInstList: []
      },
      recordsView: {
        currentPage: 1,
        itemsPerPage: 10,
        drawRecords: {
          listObj: [],
          total: 0
        },
        drawUserCount: 0,
        drawCount: 0,
        winningUserCount: 0
      },
      obj: {},
      currentPage: 1,
      itemsPerPage: 10,
      columns: [
        {
          label: this.$t('用户昵称'),
          prop: 'userName',
          show: true,
          minWidth: 120
        },
        {
          label: this.$t('奖项等级'),
          prop: 'awardsName',
          show: true,
          minWidth: 120
        },
        {
          label: this.$t('中奖奖品'),
          prop: 'awardsRefName',
          minWidth: 120, show: true
        },
        {
          label: this.$t('中奖时间'),
          prop: 'winningTime',
          minWidth: 120, show: true
        },
        {
          label: this.$t('收货人姓名'),
          prop: 'receiveName',
          minWidth: 120, show: true
        },
        {
          label: this.$t('联系电话'),
          prop: 'receiveMobile',
          minWidth: 120, show: true
        },
        {
          label: this.$t('收货地址'),
          prop: 'receiveAddress',
          minWidth: 120, show: true
        }
      ],
      isCanSave: false,
      status: '',
      channelMap: {},
      activeName: 'first',
      promotionId: '',
      promotionAPI: '',
      behaviorTypeStr: ''
    }
  },
  computed: {
    submitVerifyBtnShow() {
      //  商家显示平台创建的促销时，不显示改按钮
      if (+this.themeView.merchantTyp === 3 && this.platformId === 2) {
        return false
      }
      return +this.themeView.status === 0 || +this.themeView.status === 3
    },
    verifyBtnShow() {
      return +this.themeView.status === 1
    },
    viewBtnShow() {
      var isShow = false
      if (
        this.themeView.status === 4 ||
        this.themeView.status === 5 ||
        this.themeView.status === 6
      ) {
        isShow = true
      }
      return isShow
    },
    getLotteryTemplateList() {
      return constants.lotteryTemplateMap.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getLotteryTypeList() {
      return constants.lotteryTypeMap.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getActivityStatus() {
      return constants.activityStatus.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    }
  },
  created() {
    this.promotionId = this.$route.params.promotionId
    this.status = this.$route.params.status
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    await this.queryLotteryActivityDetail()
    await this.getChannelArrByBusiness()
    await this.query('effect')
    await this.query('mutex')
    await this.getPromotionLinks()
    await this.getBehaviorTypeStr()
  },
  methods: {
    exportResult() {
      const params = { params: this.promotionId }
      var url = '/api/back-promotion-web/lotteryThemeRead/exportLotteryResult.do'// 导出抽奖结果
      this.$portal.downloadFileByGet(url, params, '活动统计.xls')
    },
    async getBehaviorTypeStr() {
      if (this.themeView.lotteryBehaviorScopeList) {
        const {
          data = {}
        } = await this.$promotion.$api.promotion.getLoadPageConfigCommonOscUrl('LOTTERY_PAGE_CONFIG', {})

        var arr = data.LOTTERY_BEHAVIOR
        var str = ''
        for (var i = 0; i < arr.length; i++) {
          for (var y = 0; y < this.themeView.lotteryBehaviorScopeList.length; y++) {
            if (arr[i].id === this.themeView.lotteryBehaviorScopeList[y]) {
              str = str + arr[i].text + ' '
            }
          }
        }
        this.behaviorTypeStr = str
      }
    },
    getOrderDrawValue() {
      if (this.themeView.lotteryType === 1) {
        return '无订单抽奖'
      } else {
        var s = ''
        if (!this.themeView.paidOrderOnly) {
          s = '任意订单抽奖'
        } else {
          s = '支付订单抽奖'
        }
        if (this.themeView.orderDrawType === 1) {
          s = s + '，' + '单次消费订单金额' + this.themeView.orderDrawAmount +
                    '元' + '，' + '每个订单抽奖次数' +
                    this.themeView.drawTimesPerOrder + '次'
        } else if (this.themeView.orderDrawType === 2) {
          s = s + '，' + '消费订单金额每满' + this.themeView.orderDrawAmount +
                    '元' + '，' + '可获得抽奖次数' +
                    this.themeView.drawTimesPerOrder + '次'
        } else if (this.themeView.orderDrawType === 3) {
          s = s + '，' + '累计消费订单金额' + this.themeView.orderDrawAmount +
                    '元' + '，' + '可获得抽奖次数' +
                    this.themeView.drawTimesPerOrder + '次'
        }
        return s
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
        this.copy.url = data && data[0] && data[0].url
        // console.log('this.linkList', this.linkList)
      }
    },
    async queryLotteryActivityDetail() {
      const params = {
        lotteryActivityId: this.promotionId,
        currentPage: this.recordsView.currentPage,
        itemsPerPage: this.recordsView.itemsPerPage,
        obj: {}
      }
      const { data = {}} = await this.promotionAPI.queryLotteryActivityDetail(
        params
      )
      // console.log(data.recordsView.drawRecords.listObj, 9999)
      this.themeView = data.themeView
      this.awardsRuleView = data.awardsRuleView
      this.recordsView.drawCount = data.recordsView.drawCount
      this.recordsView.drawUserCount = data.recordsView.drawUserCount
      this.recordsView.winningUserCount = data.recordsView.winningUserCount
      this.recordsView.drawRecords.listObj = data.recordsView.drawRecords.listObj
      this.recordsView.drawRecords.total = data.recordsView.drawRecords.total
    },

    // viewMarketingReport() {
    //   this.$router.push({
    //     name: 'ObiShowActivityEffectReport',
    //     query: { id: this.promotionId }
    //   })
    // },
    async submitVerifyActivity() {
      const confirm = await this.$confirm(this.$t('确认提交审核') + '？', this.$t('提交审核'))
      if (!confirm) {
        return
      }
      const { code } = await this.promotionAPI.submitLotteryActivity({
        id: this.promotionId
      })
      if (+code === 0) {
        await this.queryLotteryActivityDetail()
      }
    },
    openVerifyPop() {
      var vue = this
      this.$prompt('管理员备注:', this.$t('提示'), {
        distinguishCancelAndClose: true,
        confirmButtonText: this.$t('通过'),
        cancelButtonText: this.$t('不通过'),
        showClose: false,
        inputType: 'textarea',
        inputPattern: /^.{0,100}$/,
        inputErrorMessage: this.$t('只能输入100字符以内'),
        beforeClose: (action, instance, done) => {
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
                  this.queryLotteryActivityDetail()
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
                  vue.queryLotteryActivityDetail()
                  done()
                }
              })
          }
        }
      })
    },
    async query(type) {
      if (this.recordsView.currentPage <= 0) {
        this.recordsView.currentPage = 1
      }
      await this.queryLotteryActivityDetail()
    },
    async handleSizeChange(val) {
      this.recordsView.currentPage = 1
      this.recordsView.itemsPerPage = val
      this.query()
    },
    async handleCurrentChange(val) {
      this.recordsView.currentPage = val
      this.query()
    },
    async querySelectedMerchantUrl(merchantType) {
      let addIdList = []
      let currentPage = 1
      let itemsPerPage = 10

      if (merchantType === 1) {
        addIdList = this.allAuthMerchant.map(x => {
          return x.merchantId
        })
        currentPage = this.merchantTable.page.currentPage
        itemsPerPage = this.merchantTable.page.itemsPerPage
      } else {
        addIdList = this.allAuthStore.map(x => {
          return x.storeId
        })
        currentPage = this.storeTable.page.currentPage
        itemsPerPage = this.storeTable.page.itemsPerPage
      }

      const {
        data: { listObj = [], total = 0 } = {}} = await this.promotionAPI.querySelectedMerchantUrl({
        currentPage: currentPage,
        itemsPerPage: itemsPerPage,
        merchantType: merchantType,
        promotionId: this.promotionId,
        merchantIdList: addIdList
      })
      if (merchantType === 1) {
        this.merchantTable.page.total = total
        const merchantIdList = listObj.map(x => {
          return x.merchantId
        })

        return (
          this.allAuthMerchant.filter(x => {
            return merchantIdList.includes(x.merchantId)
          }) || []
        )
      } else {
        this.storeTable.page.total = total
        const storeIdList = listObj.map(x => {
          return x.merchantId
        })

        return (
          this.allAuthStore.filter(x => {
            return storeIdList.includes(x.storeId)
          }) || []
        )
      }
    },
    handleTabClick(tab, event) {
      console.log(tab, event)
    },
    // 读取商家渠道信息
    async getChannelArrByBusiness() {
      const { data } = await this.promotionAPI.queryChannelMap({})
      this.channelMap = data
    },
    // 复制地址
    clipboardSuccess() {
      this.$message({
        message: this.$t('复制成功'),
        type: 'success',
        duration: 1500
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bottom10 {
  margin-bottom: 10px;
}
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
      line-height: 20px;

      &-item {
        margin-left: 20px;
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
    .item-description {
      display: inline-block;
    }
  }
  .lottery-link-page {
    font-size: 14px;
    margin-top: 20px;
    .lottery-link {
      margin-top: 20px;
    }
  }
  .activity-statistics {
    padding-top: 15px;
    font-size: 14px;
    text-align: center;
    .activity-number {
      color: #ef504d;
    }
  }
}
</style>
