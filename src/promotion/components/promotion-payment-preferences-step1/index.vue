<template>
  <div>
    <el-form
      ref="paymentPreferences"
      :model="paymentPreferences"
      :rules="paymentPreferencesRules"
      label-width="240px"
      class="form"
    >
      <ody-title :title="$t('基本信息')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('促销活动名称')" prop="promTitle" name="promTitle">
          <el-input
            v-model="paymentPreferences.promTitle"
            :placeholder="$t('请输入促销活动名称')"
            name="paymentPreferences_promTitle"
            maxlength="64"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="$t('活动时间')" prop="createTime" name="createTime">
          <el-date-picker
            v-model="paymentPreferences.createTime"
            name="paymentPreferences_createTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="-"
          />
        </el-form-item>
        <el-form-item :label="$t('循环时间')" prop="cycleTimeWeekList" name="cycleTimeWeekList">
          <ody-checkbox2 v-model="paymentPreferences.cycleTimeWeekList" :list="cycleTimeWeekListData" name="paymentPreferences_cycleTimeWeekList"/>
        </el-form-item>
      </div>

      <ody-title :title="$t('活动规则')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('优惠标签')" prop="promLabel" name="promLabel" required>
          <el-input v-model="paymentPreferences.promLabel" :placeholder="$t('限制12个字符以内')" name="paymentPreferences_promLabel" maxlength="12"/>
        </el-form-item>
        <el-form-item
          :label="$t('每个用户优惠次数上限')"
          :rules="{
            required: true, message: $t('每个用户优惠次数上限'), trigger: ['change', 'blur']
          }"
          prop="promLimitRule.individualLimit"
          name="promLimitRule.individualLimit"
          required>
          <ody-input-number v-model="paymentPreferences.promLimitRule.individualLimit" name="paymentPreferences_promLimitRule_individualLimit"/>
          <span>{{ $t('次') }}</span>
        </el-form-item>
        <el-form-item
          :label="$t('优惠总金额上限')"
          :rules="{
            required: true, message: $t('优惠总金额上限'), trigger: ['change', 'blur']
          }"
          prop="promLimitRule.totalLimitAmount"
          name="promLimitRule.totalLimitAmount">
          <ody-input-number v-model="paymentPreferences.promLimitRule.totalLimitAmount" :decimal="2" :max="10000" name="paymentPreferences_promLimitRule_totalLimitAmount"/>
          <span>{{ $t('元') }}</span>
        </el-form-item>
        <el-form-item :label="$t('优惠方式')" required>
          <template v-if="getDetailFlag">
            <promotion-payment-preferences-method ref="paymentPreferenesMethod" :payment-preferences="paymentPreferences" @updatedData="updatedData"/>
          </template>
        </el-form-item>
      </div>

      <ody-title :title="$t('交易规则')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('支付渠道')" prop="payType" name="payType" required>
          <el-select v-model="paymentPreferences.payType" :placeholder="$t('请选择')" name="paymentPreferences_payType">
            <el-option
              v-for="item in payTypeList"
              :key="item.channelCode"
              :label="item.channelName"
              :value="item.channelCode"/>
          </el-select>
        </el-form-item>
      </div>
      <ody-title :title="$t('参与条件')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('活动渠道')" prop="channelCodes" name="channelCodes" required>
          <promotion-channel-code-checkbox
            v-model="paymentPreferences.channelCodes"
            :is-show-all="true"
            :checked-all="promotionId === ''"
            :prom-type="promType"
            name="paymentPreferences_channelCodes"
          >
            <template slot-scope="scope">
              <!-- 美团 -->
              <el-tooltip
                v-if="scope.item.value == 210003"
                class="item"
                effect="dark"
                placement="top"
              >
                <div slot="content">
                  不支持会员类型、等级、及新老用户筛选；生效时间段默认为全天；同一活动内最多有5个阶梯；
                  <br >生效周期默认为周一到周日；参与商品仅限选品的前200个；仅支持特价、折扣
                </div>
                <i class="el-icon-question" />
              </el-tooltip>
              <!-- 京东 -->
              <el-tooltip
                v-if="scope.item.value == 210004"
                class="item"
                effect="dark"
                placement="top"
              >
                <div slot="content">
                  不支持会员类型、等级、及新老用户筛选；活动描述仅同步前5个字；
                  <br >叠加优惠仅同步第1个阶梯；仅支持特价、直降
                </div>
                <i class="el-icon-question" />
              </el-tooltip>
            </template>
          </promotion-channel-code-checkbox>
        </el-form-item>
        <el-form-item
          :label="$t('活动平台')"
          prop="applicablePlatformList"
          name="applicablePlatformList"
        >
          <promotion-applicable-platform-checkbox
            v-model="paymentPreferences.applicablePlatformList"
            :is-show-all="true"
            :checked-all="promotionId === ''"
            name="paymentPreferences_applicablePlatformList"
          />
        </el-form-item>
        <el-form-item :label="$t('新老用户')" prop="userScopeList" name="userScopeList">
          <promotion-user-scope-checkbox
            v-model="paymentPreferences.userScopeList"
            :is-show-all="true"
            :checked-all="promotionId === ''"
            name="paymentPreferences_userScopeList"
          />
        </el-form-item>

      </div>
    </el-form>

    <!-- <el-button name="handleCom" size="medium" @click="handleCom">{{ $t('确认') }}</el-button> -->
  </div>
</template>

<script>

import PromotionOverLimitRadio from '@/components/promotion-over-limit-radio'
import PromotionChannelCodeCheckbox from '@/components/promotion-channel-code-checkbox'
import PromotionApplicablePlatformCheckbox from '@/components/promotion-applicable-platform-checkbox'
import PromotionUserScopeCheckbox from '@/components/promotion-user-scope-checkbox'

import PromotionPaymentPreferencesMethod from '@/components/promotion-payment-preferences-method'

import constant from '@/utils/constants'

export default {
  components: {
    PromotionOverLimitRadio,
    PromotionChannelCodeCheckbox,
    PromotionApplicablePlatformCheckbox,
    PromotionUserScopeCheckbox,
    PromotionPaymentPreferencesMethod
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
      getDetailFlag: false,
      paymentPreferences: {
        id: this.promotionId,
        promotionType: this.promType,
        activityChannel: 1,
        participatMethod: 2,
        activityNumType: 0,
        activityUser: 1,
        priority: 1,
        promTitle: '', // 促销活动名称
        createTime: [],
        fromDate: '',
        endDate: '',
        conditionType: 1,

        applicablePlatformList: [], // 活动平台
        userScopeList: [], // 新老用户
        channelCodes: [], // 活动渠道

        cycleTimeWeekList: [1, 2, 3, 4, 5, 6, 7], // 循环时间
        promLabel: '', // 优惠标签

        // 这个是promLimitRule下的
        promLimitRule: {
          individualLimit: '', // 每个用户优惠次数上限
          totalLimitAmount: '' // 优惠总金额
        },

        payType: '', // 支付渠道

        promotionMethod: 15, // 优惠方式
        favourableList: [
          {
            favourableCondition: '',
            favourableContent: ''
          }
        ]

      },
      paymentPreferencesRules: {
        promTitle: [
          { required: true, message: this.$t('请输入促销活动名称'), trigger: 'blur' },
          { min: 1, max: 64, message: this.$t('长度在 1 到 64 个字符'), trigger: 'blur' }
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
        cycleTimeWeekList: [
          { required: true, message: this.$t('请选择循环时间'), trigger: 'blur' }
        ],
        promLabel: [
          { required: true, message: this.$t('请输入优惠标签'), trigger: ['change', 'blur'] }
        ],
        // 'promLimitRule.individualLimit': [
        //   { required: true, message: this.$t('请输入每个用户优惠次数上限'), trigger: ['change', 'blur'] }
        // ],
        // 'promLimitRule.totalLimitAmount': [
        //   { required: true, message: this.$t('请输入优惠总金额上限'), trigger: ['change', 'blur'] }
        // ],
        payType: [
          { required: true, message: this.$t('请选择支付渠道'), trigger: ['change', 'blur'] }
        ],

        channelCodes: [
          { required: true, message: this.$t('请选择活动渠道'), trigger: ['change', 'blur'] }
        ],
        applicablePlatformList: [
          { type: 'array', required: true, message: this.$t('请选择活动平台'), trigger: 'change' }
        ],
        userScopeList: [
          { type: 'array', required: true, message: this.$t('请选择新老用户'), trigger: 'change' }
        ]
      },

      promotionAPI: null,
      cycleTimeWeekListData: constant.cycleTimeWeekListData,
      payTypeList: []
    }
  },

  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    this.queryPayChannel()
    try {
      await this.queryPromotionActivityDetail()
    } catch (e) {
      console.log(e)
    } finally {
      this.getDetailFlag = true
    }
  },
  methods: {
    queryPayChannel() {
      this.promotionAPI.queryPayChannel({}).then(res => {
        this.payTypeList = res.data
      })
    },

    async queryPromotionActivityDetail() {
      if (this.paymentPreferences.id === '') {
        return
      }

      const { data = {}, data: { fromDate = '', endDate = '' }, code } = await this.promotionAPI.getPromotionDetailUrl(this.paymentPreferences)

      if (code === '0') {
        this.paymentPreferences = data
        this.$set(this.paymentPreferences, 'createTime', [fromDate, endDate])
      }
    },
    updatedData(form) {
      if (form.promotionMethod === 15) {
        this.paymentPreferences.promotionMethod = form.promotionMethod
        this.paymentPreferences.favourableList = [
          {
            favourableCondition: form.favourableCondition * 100,
            favourableContent: form.favourableContent * 100
          }
        ]
      }
      if (form.promotionMethod === 16) {
        this.paymentPreferences.promotionMethod = form.promotionMethod
        var params = {
          favourableContent: form.discount * 10
        }
        if (form.favourableContentLimit) {
          params.favourableContentLimit = form.favourableContentLimit * 100
        }
        this.paymentPreferences.favourableList = [params]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
