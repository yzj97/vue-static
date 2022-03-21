<template>
  <div class="cp-lottery-promotion-step1">
    <el-form
      ref="lotteryThemeViewContent"
      :model="lotteryThemeViewContent"
      :rules="lotteryThemeViewContentRules"
      label-width="240px"
      class="form"
    >
      <ody-title :title="$t('基本信息')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('活动名称')" prop="activityName" name="activityName" required>
          <el-input
            v-model="lotteryThemeViewContent.activityName"
            :placeholder="$t('请输入促销名称,最大64字符')"
            name="lotteryThemeViewContent_activityName"
            maxlength="64"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="$t('活动时间')" prop="createTime" name="createTime">
          <el-date-picker
            v-model="lotteryThemeViewContent.createTime"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
            name="lotteryThemeViewContent_createTime"
            type="datetimerange"
            range-separator="-"
          />
        </el-form-item>
      </div>
      <ody-title :title="$t('活动规则')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('抽奖模板')" prop="lotteryTemplate" name="lotteryTemplate" required>
          <ody-select2
            v-model="lotteryThemeViewContent.lotteryTemplate"
            name="lotteryThemeViewContent_lotteryTemplate"
            list-key="lotteryType"
          />
        </el-form-item>
        <el-form-item :label="$t('抽奖活动类型')" prop="lotteryType" name="lotteryType" required>
          <el-radio-group
            v-model="lotteryThemeViewContent.lotteryType"
            name="lotteryThemeViewContent_lotteryType"
            @change="selectLotteryBehavior"
          >
            <el-radio :label="1">{{ $t('无订单抽奖') }}</el-radio>
            <el-radio :label="2">{{ $t('订单抽奖') }}</el-radio>
          </el-radio-group>
          <el-checkbox
            v-if="lotteryThemeViewContent.lotteryType === 1"
            v-model="needSelectLotteryBehavior"
            name="type"
            class="lottery-behavior"
            @change="selectLotteryBehavior"
          >{{ $t('行为抽奖') }}</el-checkbox>
          <el-checkbox
            v-if="lotteryThemeViewContent.lotteryType === 2"
            v-model="needSelectLotteryBehavior"
            name="type"
            class="lottery-behavior"
            @change="selectLotteryBehavior"
          >{{ $t('仅支付已完成订单可参与抽奖') }}</el-checkbox>
          <br >
          <el-radio-group v-if="lotteryThemeViewContent.lotteryType === 2" v-model="lotteryThemeViewContent.orderDrawType" name="lotteryThemeViewContent_orderDrawType" @change="changeLotteryType">
            <el-radio :label="1">
              单次消费订单金额
              <component
                :is="lotteryThemeViewContent.orderDrawType === 1 ? 'el-form-item': 'div'"
                :rules="[{required: true, message: '订单金额不能为空', trigger: 'blur'}]"
                prop="orderDrawAmount1"
                name="orderDrawAmount1"
                class="el-form-item--inline">
                <ody-input-number
                  :decimal="2"
                  v-model="lotteryThemeViewContent.orderDrawAmount1"
                  :disabled="+lotteryThemeViewContent.orderDrawType !== 1"
                  name="orderDrawObj_orderDrawAmount1"
                  class="gift-limit-multy"
                  @change="lotteryThemeViewContent.orderDrawAmount = lotteryThemeViewContent.orderDrawAmount1"
                />
                <span>{{ $t('元') }}</span>
              </component>
              <span>{{ $t('每个订单抽奖次数') }}</span>
              <component
                :is="lotteryThemeViewContent.orderDrawType === 1 ? 'el-form-item': 'div'"
                :rules="[{required: true, message: '抽奖次数不能为空', trigger: 'blur'}]"
                prop="drawTimesPerOrder1"
                class="el-form-item--inline">
                <ody-input-number
                  v-model="lotteryThemeViewContent.drawTimesPerOrder1"
                  :disabled="+lotteryThemeViewContent.orderDrawType !== 1"
                  name="orderDrawObj_drawTimesPerOrder1"
                  class="gift-limit-multy"
                  @change="lotteryThemeViewContent.drawTimesPerOrder = lotteryThemeViewContent.drawTimesPerOrder1"
                />
                <span>{{ $t('次') }}</span>
              </component>
            </el-radio>
            <br >
            <el-radio :label="2">
              消费订单金额
              <component
                :is="lotteryThemeViewContent.orderDrawType === 2 ? 'el-form-item': 'div'"
                :rules="[{required: true, message: '订单金额不能为空', trigger: 'blur'}]"
                prop="orderDrawAmount2"
                name="orderDrawAmount2"
                class="el-form-item--inline">
                <ody-input-number
                  :decimal="2"
                  v-model="lotteryThemeViewContent.orderDrawAmount2"
                  :disabled="+lotteryThemeViewContent.orderDrawType !== 2"
                  name="orderDrawObj_orderDrawAmount2"
                  class="gift-limit-multy"
                  @change="lotteryThemeViewContent.orderDrawAmount = lotteryThemeViewContent.orderDrawAmount2"
                />
                <span>{{ $t('元') }}</span>
              </component>
              <span>{{ $t('可获得抽奖次数') }}</span>
              <component
                :is="lotteryThemeViewContent.orderDrawType === 2 ? 'el-form-item': 'div'"
                :rules="[{required: true, message: '抽奖次数不能为空', trigger: 'blur'}]"
                prop="drawTimesPerOrder2"
                class="el-form-item--inline">
                <ody-input-number
                  v-model="lotteryThemeViewContent.drawTimesPerOrder2"
                  :disabled="+lotteryThemeViewContent.orderDrawType !== 2"
                  name="orderDrawObj_drawTimesPerOrder2"
                  class="gift-limit-multy"
                  @change="lotteryThemeViewContent.drawTimesPerOrder = lotteryThemeViewContent.drawTimesPerOrder2"
                />
                <span>{{ $t('次') }}</span>
              </component>
            </el-radio>
            <br >
            <el-radio :label="3">
              累计消费订单
              <component
                :is="lotteryThemeViewContent.orderDrawType === 3 ? 'el-form-item': 'div'"
                :rules="[{required: true, message: '订单金额不能为空', trigger: 'blur'}]"
                prop="orderDrawAmount3"
                name="orderDrawAmount3"
                class="el-form-item--inline">
                <ody-input-number
                  :decimal="2"
                  v-model="lotteryThemeViewContent.orderDrawAmount3"
                  :disabled="+lotteryThemeViewContent.orderDrawType !== 3"
                  name="orderDrawObj_orderDrawAmount3"
                  class="gift-limit-multy"
                  @change="lotteryThemeViewContent.orderDrawAmount = lotteryThemeViewContent.orderDrawAmount3"
                />
              </component>
              <span>{{ $t('元') }}</span>
              <span>{{ $t('可获得抽奖次数') }}</span>
              <component
                :is="lotteryThemeViewContent.orderDrawType === 3 ? 'el-form-item': 'div'"
                :rules="[{required: true, message: '抽奖次数不能为空', trigger: 'blur'}]"
                prop="drawTimesPerOrder3"
                class="el-form-item--inline">
                <ody-input-number
                  v-model="lotteryThemeViewContent.drawTimesPerOrder3"
                  :disabled="+lotteryThemeViewContent.orderDrawType !== 3"
                  name="orderDrawObj_drawTimesPerOrder3"
                  class="gift-limit-multy"
                  @change="lotteryThemeViewContent.drawTimesPerOrder = lotteryThemeViewContent.drawTimesPerOrder3"
                />
              </component>
              <span>{{ $t('次') }}</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="canShowLotteryBehavior && needSelectLotteryBehavior && lotteryThemeViewContent.lotteryType === 1"
          :label="$t('可增加抽奖次数的行为')"
          prop="lotteryBehaviorScopeList"
          name="lotteryBehaviorScopeList"
        >
          <promotion-lottery-behavior-checkbox
            v-if="lotteryBehaviorRefresh"
            v-model="lotteryThemeViewContent.lotteryBehaviorScopeList"
            :is-show-all="true"
            :checked-all="lotteryBehaviorAll"
            name="lotteryThemeViewContent_lotteryBehaviorScopeList"
          />
        </el-form-item>
        <el-form-item
          v-if="lotteryThemeViewContent.lotteryType === 1"
          :label="$t('每次抽奖需消耗')"
          prop="drawPointsPerTime"
          name="drawPointsPerTime"
          class="draw-points-per-time"
          required
        >
          <el-input-number v-model="lotteryThemeViewContent.drawPointsPerTime" :precision="0" :controls="false" :min="1" :max="2147483647" name="lotteryThemeViewContent_drawPointsPerTime" style="width:100px"/>
          <span>{{ $t('积分') }}</span>
        </el-form-item>
        <el-form-item
          v-if="lotteryThemeViewContent.lotteryType === 1"
          :label="$t('免积分抽奖次数')"
          prop="costFreeDrawTimes"
          name="costFreeDrawTimes"
          class="draw-points-per-time"
          required
        >
          <el-input-number v-model="lotteryThemeViewContent.costFreeDrawTimes" :precision="0" :controls="false" :min="0" :max="2147483647" name="lotteryThemeViewContent_costFreeDrawTimes" style="width:100px"/>
          <span>{{ $t('次') }}</span>
        </el-form-item>
        <el-form-item
          :label="$t('用户每日抽奖次数上限')"
          prop="dailyDrawTimesLimit"
          name="dailyDrawTimesLimit"
          class="draw-points-per-time"
          required
        >
          <ody-input-number v-model="lotteryThemeViewContent.dailyDrawTimesLimit" :precision="0" :controls="false" :min="1" :max="9999" name="lotteryThemeViewContent_dailyDrawTimesLimit" style="width:100px"/>
        </el-form-item>
        <el-form-item
          :label="$t('用户每日中奖次数上限')"
          prop="dailyWinningTimesLimit"
          name="dailyWinningTimesLimit"
          class="draw-points-per-time"
          required
        >
          <ody-input-number v-model="lotteryThemeViewContent.dailyWinningTimesLimit" :precision="0" :controls="false" :min="1" :max="9999" name="lotteryThemeViewContent_dailyWinningTimesLimit" style="width:100px"/>
        </el-form-item>
        <el-form-item :label="$t('活动描述')" prop="activityDesc" name="activityDesc">
          <ody-tinymce
            :show-upload-img="false"
            :height="300"
            v-model="lotteryThemeViewContent.activityDesc"
            :limit="150"
            name="lotteryThemeViewContent_activityDesc"
          />
        </el-form-item>
      </div>
      <ody-title :title="$t('参与条件')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('活动渠道')" prop="channelCode" name="channelCode" required>
          <promotion-lottery-channel-code-radio
            v-model="lotteryThemeViewContent.channelCode"
            name="lotteryThemeViewContent_channelCode"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import PromotionLotteryTypeRadio from '@/components/promotion-lottery-type-radio'
import PromotionLotteryChannelCodeRadio from '@/components/promotion-lottery-channel-code-radio'
import PromotionLotteryBehaviorCheckbox from '@/components/promotion-lottery-behavior-checkbox'
import PromotionActivityDescriptionInputChinese from '@/components/promotion-activity-description-input-chinese'
import util from '@/utils/util'

export default {
  name: 'PromLotteryActivityCreate',
  components: {
    PromotionLotteryTypeRadio,
    PromotionLotteryChannelCodeRadio,
    PromotionLotteryBehaviorCheckbox,
    PromotionActivityDescriptionInputChinese
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    selected: {
      type: Object,
      default: () => {}
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    labelKey: {
      type: String,
      default: 'text'
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
    }
  },
  data() {
    return {
      canShowLotteryBehavior: false,
      lotteryBehaviorAll: false,
      lotteryBehaviorRefresh: true,
      orderDraw: {
        orderDrawAmount1: '',
        drawTimesPerOrder1: '',
        orderDrawAmount2: '',
        drawTimesPerOrder2: '',
        orderDrawAmount3: '',
        drawTimesPerOrder3: '',
        orderDrawType: ''
      },
      lotteryThemeViewContent: {
        isPaidOrderOnly: false,
        orderDrawType: 1,
        id: this.promotionId,
        promotionType: this.promType,
        activityName: '', // 促销活动名称
        createTime: [],
        lotteryBehaviorScopeList: [], // 可增加抽奖次数的行为
        lotteryTemplate: 1, // 抽奖模板
        activityDesc: '', // 活动描述
        lotteryType: 1, // 抽奖活动类型
        drawTimesPerOrder: null, // 每次抽奖需消耗
        costFreeDrawTimes: null, // 免积分抽奖次数
        dailyDrawTimesLimit: null, // 用户每日抽奖次数上限
        dailyWinningTimesLimit: null, // 用户每日中奖次数上限
        channelCode: '110001', // 活动渠道
        effStartTime: '',
        effEndTime: '',

        drawPointsPerTime: '',

        orderDrawAmount1: '',
        drawTimesPerOrder1: '',
        orderDrawAmount2: '',
        drawTimesPerOrder2: '',
        orderDrawAmount3: '',
        drawTimesPerOrder3: '',
        orderDrawAmount: '',

        memberTypes: [], // 会员类型
        memberLevels: [], // 会员等级
        themeIdList: []
      },
      lotteryThemeViewContentRules: {
        activityName: [
          {
            required: true,
            message: this.$t('请输入促销名称,最大64字符'),
            max: 64,
            trigger: ['change', 'blur']
          }
        ],
        createTime: [
          { required: true, message: this.$t('请选择活动时间'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              const [startTime, endTime] = value
              if (startTime && endTime && new Date(startTime) * 1 >= new Date(endTime) * 1) {
                callback(new Error(this.$t('活动结束时间必须大于开始时间')))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        lotteryTemplate: [
          {
            required: true,
            message: this.$t('请选择抽奖模板'),
            trigger: ['change', 'blur']
          }
        ],
        lotteryType: [
          {
            required: true,
            message: this.$t('请选择抽奖活动类型'),
            trigger: ['change', 'blur']
          }
        ],
        channelCode: [
          {
            required: true,
            message: this.$t('请选择活动渠道'),
            trigger: ['change', 'blur']
          }
        ],
        drawTimesPerOrder: [
          {
            required: true,
            message: this.$t('请输入每次抽奖需消耗积分'),
            trigger: ['change', 'blur']
          }
        ],
        costFreeDrawTimes: [
          {
            required: true,
            message: this.$t('请输入免积分抽奖次数'),
            trigger: ['change', 'blur']
          }
        ],
        dailyDrawTimesLimit: [
          {
            required: true,
            message: this.$t('请输入用户每日抽奖次数上限'),
            trigger: ['change', 'blur']
          }
        ],
        dailyWinningTimesLimit: [
          {
            required: true,
            message: this.$t('请输入用户每日中奖次数上限'),
            trigger: ['change', 'blur']
          }
        ],
        activityDesc: [
          {
            required: true,
            message: this.$t('请输入描述，最大150个字符'),
            trigger: ['change', 'blur']
          }
        ],
        drawPointsPerTime: [
          {
            required: true,
            message: this.$t('请输入每次抽奖需消耗积分'),
            trigger: ['change', 'blur']
          }
        ]
      },
      memberLevelsSelected: [],
      memberTypesSelected: [],
      needSelectLotteryBehavior: false, // 需要选择行为抽奖行为类型
      lotteryBehaviorSelected: [] // 已选择的抽奖行为
    }
  },
  watch: {
    needSelectLotteryBehavior: function(val) {
      let lotteryBehaviorChange = false
      if (val === true) {
        this.needSelectLotteryBehavior = true
        if (this.lotteryThemeViewContent.lotteryType === 1) {
          this.canShowLotteryBehavior = true
          if (!this.lotteryBehaviorAll) {
            lotteryBehaviorChange = true
          }
          if (this.lotteryThemeViewContent.lotteryBehaviorScopeList.length === 0) {
            this.lotteryBehaviorAll = true
          }
        }
      } else {
        this.needSelectLotteryBehavior = false
        if (this.lotteryBehaviorAll) {
          lotteryBehaviorChange = true
        }
        this.lotteryBehaviorAll = false
        this.lotteryThemeViewContent.lotteryBehaviorScopeList = []
      }
      if (lotteryBehaviorChange) {
        this.lotteryBehaviorRefresh = false
        this.$nextTick(() => {
          this.lotteryBehaviorRefresh = true
        })
      }
    },
    'lotteryThemeViewContent.lotteryType': function(val, oldVal) {
      if (val === 2) {
        if (this.lotteryThemeViewContent.paidOrderOnly === undefined) {
          this.needSelectLotteryBehavior = true
          this.lotteryThemeViewContent.isPaidOrderOnly = true
        }
      } else if (oldVal === 2 && val === 1 && this.needSelectLotteryBehavior) {
        this.needSelectLotteryBehavior = false
        this.lotteryThemeViewContent.isPaidOrderOnly = false
      }
    }
  },
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    if (
      this.lotteryThemeViewContent.createTime &&
      this.lotteryThemeViewContent.createTime.length > 0
    ) {
      this.lotteryThemeViewContent.effStartTime = this.lotteryThemeViewContent.createTime[0]
      this.lotteryThemeViewContent.effEndTime = this.lotteryThemeViewContent.createTime[1]
    }
    if (this.promotionId !== '') {
      this.queryPromotionActivityDetail()
    } else {
      await this.getLoadPageConfigMethod()
    }
    await this.queryLoadOscConfigUrl()
  },
  methods: {
    async getLoadPageConfigMethod() {
      const { data = {}} = await this.promotionAPI.loadPageConfigMethod({})
      if (!util.isEmpty(data.applicablePlatform)) {
        if (this.lotteryThemeViewContent.applicablePlatformList === undefined) {
          this.lotteryThemeViewContent.applicablePlatformList = []
        }
        data.applicablePlatform.forEach(i => {
          this.lotteryThemeViewContent.applicablePlatformList.push(i.id)
        })
      }
      if (!util.isEmpty(data.userScope)) {
        if (this.lotteryThemeViewContent.participantTypeList === undefined) {
          this.lotteryThemeViewContent.participantTypeList = []
        }
        data.userScope.forEach(i => {
          this.lotteryThemeViewContent.participantTypeList.push(i.id)
        })
      }
    },
    async queryPromotionActivityDetail() {
      if (this.lotteryThemeViewContent.id === '') {
        return
      }
      const params = {
        lotteryActivityId: this.lotteryThemeViewContent.id
      }

      const {
        data = {},
        data: { effStartTime = '', effEndTime = '' },
        code
      } = await this.promotionAPI.queryLotteryTheme(params)
      data.orderDrawType = data.orderDrawType || 1
      if (data.orderDrawType === 1) {
        data.orderDrawAmount1 = data.orderDrawAmount
        data.drawTimesPerOrder1 = data.drawTimesPerOrder
      }
      if (data.orderDrawType === 2) {
        data.orderDrawAmount2 = data.orderDrawAmount
        data.drawTimesPerOrder2 = data.drawTimesPerOrder
      }
      if (data.orderDrawType === 3) {
        data.orderDrawAmount3 = data.orderDrawAmount
        data.drawTimesPerOrder3 = data.drawTimesPerOrder
      }

      if (code === '0') {
        this.lotteryThemeViewContent = { ...this.lotteryThemeViewContent, ...data }
        this.$set(this.lotteryThemeViewContent, 'createTime', [
          effStartTime,
          effEndTime
        ])
        this.orderDraw.orderDrawType = this.lotteryThemeViewContent.orderDrawType
        if (this.lotteryThemeViewContent.orderDrawType === 1) {
          this.orderDraw.orderDrawAmount1 = this.lotteryThemeViewContent.orderDrawAmount
          this.orderDraw.drawTimesPerOrder1 = this.lotteryThemeViewContent.drawTimesPerOrder
        }
        if (this.lotteryThemeViewContent.orderDrawType === 2) {
          this.orderDraw.orderDrawAmount2 = this.lotteryThemeViewContent.orderDrawAmount
          this.orderDraw.drawTimesPerOrder2 = this.lotteryThemeViewContent.drawTimesPerOrder
        }
        if (this.lotteryThemeViewContent.orderDrawType === 3) {
          this.orderDraw.orderDrawAmount3 = this.lotteryThemeViewContent.orderDrawAmount
          this.orderDraw.drawTimesPerOrder3 = this.lotteryThemeViewContent.drawTimesPerOrder
        }
        if (this.lotteryThemeViewContent.lotteryType === 1) {
          if (this.lotteryThemeViewContent.lotteryBehaviorScopeList.length > 0) {
            this.needSelectLotteryBehavior = true
          } else {
            this.needSelectLotteryBehavior = false
          }
        } else {
          this.needSelectLotteryBehavior = this.lotteryThemeViewContent.paidOrderOnly
        }
      }
    },
    async queryLoadOscConfigUrl() {
      const params = 'PAGE_CONFIG_NOT_SAME'
      const {
        data = {}
      } = await this.promotionAPI.getLoadPageConfigCommonOscUrl(params)

      if (data.code === '0') {
        // this.promotionDetailData = data
        console.log(1111111111)
      }
    },
    getOrderDrawObj(val) {
      this.lotteryThemeViewContent.orderDrawType = val.orderDrawType
      if (val.orderDrawType === 1) {
        this.lotteryThemeViewContent.orderDrawAmount = val.orderDrawAmount1
        this.lotteryThemeViewContent.drawTimesPerOrder = val.drawTimesPerOrder1
      }
      if (val.orderDrawType === 2) {
        this.lotteryThemeViewContent.orderDrawAmount = val.orderDrawAmount2
        this.lotteryThemeViewContent.drawTimesPerOrder = val.drawTimesPerOrder2
      }
      if (val.orderDrawType === 3) {
        this.lotteryThemeViewContent.orderDrawAmount = val.orderDrawAmount3
        this.lotteryThemeViewContent.drawTimesPerOrder = val.drawTimesPerOrder3
      }
    },
    selectLotteryBehavior() {
      if (this.lotteryThemeViewContent.lotteryType === 2) {
        this.lotteryThemeViewContent.lotteryBehaviorScopeList = []
      }
      this.lotteryThemeViewContent.paidOrderOnly = this.needSelectLotteryBehavior
      this.lotteryThemeViewContent.isPaidOrderOnly = this.needSelectLotteryBehavior
      if (!this.needSelectLotteryBehavior) {
        this.lotteryBehaviorSelected = []
      }
    },
    // 每次切换选项后清空之前的值
    changeLotteryType() {
      if (this.lotteryThemeViewContent.orderDrawType === 1) {
        // this.lotteryThemeViewContent.orderDrawAmount2 = null
        // this.lotteryThemeViewContent.drawTimesPerOrder2 = null
        // this.lotteryThemeViewContent.orderDrawAmount3 = null
        // this.lotteryThemeViewContent.drawTimesPerOrder3 = null
        this.$set(this.lotteryThemeViewContent, 'orderDrawAmount2', null)
        this.$set(this.lotteryThemeViewContent, 'drawTimesPerOrder2', null)
        this.$set(this.lotteryThemeViewContent, 'orderDrawAmount3', null)
        this.$set(this.lotteryThemeViewContent, 'drawTimesPerOrder3', null)
      } else if (this.lotteryThemeViewContent.orderDrawType === 2) {
        // this.lotteryThemeViewContent.orderDrawAmount1 = null
        // this.lotteryThemeViewContent.drawTimesPerOrder1 = null
        // this.lotteryThemeViewContent.orderDrawAmount3 = null
        // this.lotteryThemeViewContent.drawTimesPerOrder3 = null
        this.$set(this.lotteryThemeViewContent, 'orderDrawAmount1', null)
        this.$set(this.lotteryThemeViewContent, 'drawTimesPerOrder1', null)
        this.$set(this.lotteryThemeViewContent, 'orderDrawAmount3', null)
        this.$set(this.lotteryThemeViewContent, 'drawTimesPerOrder3', null)
      } else if (this.lotteryThemeViewContent.orderDrawType === 3) {
        // this.lotteryThemeViewContent.orderDrawAmount1 = null
        // this.lotteryThemeViewContent.drawTimesPerOrder1 = null
        // this.lotteryThemeViewContent.orderDrawAmount2 = null
        // this.lotteryThemeViewContent.drawTimesPerOrder2 = null
        this.$set(this.lotteryThemeViewContent, 'orderDrawAmount1', null)
        this.$set(this.lotteryThemeViewContent, 'drawTimesPerOrder1', null)
        this.$set(this.lotteryThemeViewContent, 'orderDrawAmount2', null)
        this.$set(this.lotteryThemeViewContent, 'drawTimesPerOrder2', null)
      }
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-lottery-promotion-step1 {
  .order-draw-type {
    margin-top: 10px;
  }
  .lottery-behavior {
    margin-left: 20px;
  }
  .draw-points-per-time {
    /deep/ {
      .el-form-item.coupon-limit.el-form-item--medium {
        display: inline-block;
      }
      .el-input {
        width: 100px;
        display: inline-block;
      }
    }
  }
  .el-form-item {
    &--inline {
      display: inline-block;
      padding-bottom: 16px;
    }
  }
}
</style>
