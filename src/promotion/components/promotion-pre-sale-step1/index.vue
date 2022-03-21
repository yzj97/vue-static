<template>
  <div>
    <el-form
      ref="preSalePromotion"
      :model="preSalePromotion"
      :rules="singlePromotionRules"
      label-width="240px"
      class="form"
    >
      <ody-title :title="$t('基本信息')" />
      <div class="presale-promotion-content">
        <el-form-item :label="$t('促销活动名称')" prop="promTitle" name="promTitle">
          <el-input
            v-model="preSalePromotion.promTitle"
            :placeholder="$t('限制在64个字符以内')"
            name="preSalePromotion_promTitle"
            maxlength="64"
            show-word-limit
          />
        </el-form-item>
      </div>
      <ody-title :title="$t('活动规则')" />
      <div class="single-promotion-content">
        <el-form-item
          :label="$t('预售类型')"
          prop="promotionMethod"
          name="promotionMethod"
          required
        >
          <ody-radio2
            v-model="preSalePromotion.promotionMethod"
            name="preSalePromotion_promotionMethod"
            list-key="promotionActivityPreType"
          />
        </el-form-item>
        <el-form-item
          :label="$t('预售价模式')"
          prop="presellPriceMode"
          name="presellPriceMode"
          required
        >
          <ody-radio2
            v-model="preSalePromotion.presellPriceMode"
            name="preSalePromotion_presellPriceMode"
            list-key="promotionActivityOneMoney"
          />
        </el-form-item>
        <el-form-item :label="$t('定金支付时间')" prop="createTime" name="createTime" required>
          <el-date-picker
            v-model="preSalePromotion.createTime"
            :start-placeholder="$t('定金支付开始日期')"
            :end-placeholder="$t('定金支付结束日期')"
            name="preSalePromotion_createTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="-"
          />
        </el-form-item>
        <el-form-item :label="$t('尾款支付时间')" prop="preSellTime" name="preSellTime">
          <el-date-picker
            v-model="preSalePromotion.preSellTime"
            :start-placeholder="$t('尾款支付开始日期')"
            :end-placeholder="$t('尾款支付结束日期')"
            name="preSalePromotion_preSellTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="-"
          />
        </el-form-item>
        <el-form-item :label="$t('开始发货时间')" prop="deliveryTimeString" name="deliveryTimeString">
          <el-date-picker
            v-model="preSalePromotion.deliveryTimeString"
            :picker-options="pickerOptions"
            :default-value="defaultValueTime"
            :placeholder="$t('开始发货时间')"
            name="preSalePromotion_deliveryTimeString"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="handleChange"
          />
          <span> 请认真填写，如未按约定时间发货，可能引起投诉和退款</span>
        </el-form-item>
        <el-form-item
          :label="$t('定金是否可退')"
          prop="canReturnPremoney"
          name="canReturnPremoney"
          required
        >
          <ody-radio2
            v-model="preSalePromotion.canReturnPremoney"
            name="preSalePromotion_canReturnPremoney"
            list-key="promotionActivityMoneyReturn"
          />
        </el-form-item>
        <el-form-item :label="$t('活动描述(中文)')" prop="ruleDesc" name="ruleDesc">
          <promotion-activity-description-input-chinese
            :rule-desc.sync="preSalePromotion.ruleDesc"
            :placeholder="ruleChinesePlaceholder"
          />
        </el-form-item>
        <el-form-item :label="$t('活动描述(英文)')" prop="ruleDesc" name="ruleDesc">
          <promotion-activity-description-input-english
            :rule-desc-lan.sync="preSalePromotion.ruleDescLan2"
            :placeholder="ruleEnglishPlaceholder"
          />
          <promotion-desc-modal />
        </el-form-item>
      </div>
      <ody-title v-show="platformId != 2" :title="$t('交易规则')" />
      <div v-show="platformId != 2" class="single-promotion-content">
        <el-form-item
          :label="$t('是否包邮')"
          prop="freeShipping"
          name="freeShipping"
          required
        >
          <ody-radio2
            v-model="preSalePromotion.freeShipping"
            name="preSalePromotion_freeShipping"
            list-key="promotionFreeShippingList"
          />
        </el-form-item>
      </div>
      <ody-title :title="$t('参与条件')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('活动渠道')" prop="channelCodes" name="channelCodes" required>
          <promotion-channel-code-checkbox
            v-model="preSalePromotion.channelCodes"
            :is-show-all="true"
            :checked-all="promotionId === ''"
            :prom-type="promType"
            name="preSalePromotion_channelCodes"
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
            v-model="preSalePromotion.applicablePlatformList"
            :is-show-all="true"
            :checked-all="promotionId === ''"
            name="preSalePromotion_applicablePlatformList"
          />
        </el-form-item>
        <el-form-item v-show="platformId != 2" :label="$t('新老用户')" prop="userScopeList" name="userScopeList">
          <promotion-user-scope-checkbox
            v-model="preSalePromotion.userScopeList"
            :is-show-all="true"
            :checked-all="promotionId === ''"
            name="preSalePromotion_userScopeList"
          />
        </el-form-item>
        <el-form-item v-show="platformId != 2" :label="$t('会员类型')" prop="memberTypes" name="memberTypes">
          <promotion-member-types-checkbox
            v-model="preSalePromotion.memberTypes"
            :selected.sync="memberTypesSelected"
            :checked-all="promotionId === ''"
            name="preSalePromotion_memberTypes"
          />
        </el-form-item>
        <el-form-item v-show="platformId != 2" :label="$t('会员等级')" prop="memberLevels" name="memberLevels">
          <promotion-member-levels-checkbox
            v-model="preSalePromotion.memberLevels"
            :checked-all="promotionId === ''"
            name="preSalePromotion_memberLevels"
            @change="handleMemberLevelsChange"
          />
        </el-form-item>
        <el-form-item :label="$t('备注')" prop="description" name="description">
          <ody-tinymce :show-upload-img="false" :height="300" v-model="preSalePromotion.description" :limit="1000" name="preSalePromotion_description" />
        </el-form-item>
      </div>
    </el-form>

    <!-- <el-button name="handleCom" size="medium" @click="handleCom">{{ $t('确认') }}</el-button> -->
  </div>
</template>

<script>
import PromotionTypeRadio from '@/components/free-promotion-type-radio'
import PromotionFreeSettingRadio from '@/components/free-setting-promotion-radio'
import PromotionActivityDescriptionInputChinese from '@/components/promotion-activity-description-input-chinese'
import PromotionActivityDescriptionInputEnglish from '@/components/promotion-activity-description-input-english'
import PromotionOverLimitRadio from '@/components/promotion-over-limit-radio'
import PromotionChannelCodeCheckbox from '@/components/promotion-channel-code-checkbox'
import PromotionApplicablePlatformCheckbox from '@/components/promotion-applicable-platform-checkbox'
import PromotionUserScopeCheckbox from '@/components/promotion-user-scope-checkbox'
import PromotionMemberTypesCheckbox from '@/components/promotion-member-types-checkbox'
import PromotionMemberLevelsCheckbox from '@/components/promotion-member-levels-checkbox'
import PromotionDescModal from '@/components/desc-modal'
// import util from '@/utils/util'

export default {
  components: {
    PromotionDescModal,
    PromotionTypeRadio,
    PromotionFreeSettingRadio,
    PromotionActivityDescriptionInputChinese,
    PromotionActivityDescriptionInputEnglish,
    PromotionOverLimitRadio,
    PromotionChannelCodeCheckbox,
    PromotionApplicablePlatformCheckbox,
    PromotionUserScopeCheckbox,
    PromotionMemberTypesCheckbox,
    PromotionMemberLevelsCheckbox
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
      platformId: '',
      defaultValueTime: null,
      ruleChinesePlaceholder: '',
      ruleEnglishPlaceholder: '',
      preSalePromotion: {
        id: this.promotionId, // presellContentType:1,预售类型   预售价模式：(presellContentType == 2 && e.id !=2) || presellContentType == 1
        promotionType: this.promType,
        activityChannel: 1,
        conditionType: 1,
        activityType: 1,
        participatMethod: 2,
        activityNumType: 0,
        freeShipping: 0, // 包邮方式 是：2，否：0
        activityUser: 1,
        canUseCoupon: 0,
        canReturnPremoney: 1, // 0否，1是  定金是否可退
        merchantTypes: ['1', '2'],
        merchantType: '1',
        priority: 1,
        isSeckill: 0, // 不动
        promTitle: '', // 促销活动名称
        deliveryTime: [], // 开始发货时间单独时间
        deliveryTimeString: '', // 开始发货时间单独时间
        createTime: [], // 预售定金支付时间fromDate-endDate
        fromDate: '', // 定金支付开始时间
        endDate: '', // 定金支付结束时间
        preSellTime: [], // 预售尾款支付时间
        preSellStartTime: '', // 预售尾款支付开始时间
        preSellEndTime: '', // 预售尾款支付结束时间
        presellPriceMode: null, // 预售价模式
        promotionMethod: 17, // 预售类型
        newThemeNameList: [],
        themeIdList: [],
        favourableList: [], // 包邮设置
        ruleDesc: '', // 活动描述-中文
        ruleDescLan2: '', // 活动描述-英文
        applicablePlatformList: [], // 活动平台
        userScopeList: [], // 新老用户
        memberTypes: [], // 会员类型
        memberLevels: [], // 会员等级
        channelCodes: [], // 活动渠道
        description: '', // 备注
        commissionId: null,
        commissionSign: null
      },
      pickerOptions: {
        disabledDate: this.disabledDate
      },
      singlePromotionRules: {
        promTitle: [
          { required: true, message: this.$t('请输入促销活动名称'), trigger: 'blur' },
          { min: 1, max: 64, message: this.$t('长度在 1 到 64 个字符'), trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: this.$t('请选择定金支付时间'), trigger: ['change', 'blur'] }
        ],
        preSellTime: [
          { required: true, message: this.$t('请选择尾款支付时间'), trigger: ['change', 'blur'] },
          {
            validator: this.validatePreSellTime, trigger: 'blur'
          }
        ],
        deliveryTimeString: [
          { required: true, message: this.$t('发货时间不能为空'), trigger: ['change', 'blur'] },
          {
            validator: this.validateDeliveryTimeString, trigger: 'blur'
          }
        ],
        freeShipping: [
          { required: true, message: this.$t('请选择包邮方式'), trigger: ['change', 'blur'] }
        ],
        channelCodes: [
          { required: true, message: this.$t('请选择活动渠道'), trigger: ['change', 'blur'] }
        ],
        applicablePlatformList: [
          { type: 'array', required: true, message: this.$t('请选择活动平台'), trigger: 'change' }
        ],
        userScopeList: [
          { type: 'array', required: true, message: this.$t('请选择新老用户'), trigger: 'change' }
        ],
        memberLevels: [
          { type: 'array', required: true, message: this.$t('请选择会员等级'), trigger: 'change' }
        ],
        memberTypes: [
          { type: 'array', required: true, message: this.$t('请选择会员类型'), trigger: 'change' }
        ]
      },
      memberLevelsSelected: [],
      memberTypesSelected: [],
      promotionAPI: null
    }
  },

  watch: {
    'preSalePromotion.preSellTime': {
      handler: function(newVal) {
        var date = newVal[1]
        this.aaa = date
        this.defaultValueTime = new Date(date.replace(/-/g, '/'))
      },
      deep: true
    },
    'preSalePromotion': {
      handler(newValue, oldValue) {
        if (newValue.conditionType !== oldValue.conditionType ||
          JSON.stringify(newValue.favourableList) !== JSON.stringify(oldValue.favourableList)
        ) {
          this.buildFrontPromDesc()
        }
      },
      deep: true
    },
    'preSalePromotion.memberTypes': {
      handler: function(val) {
        this.$nextTick(() => {
          if (this.memberTypesSelected.length > 0) {
            this.preSalePromotion.memberLevels = this.memberTypesSelected.reduce((rtv, item) => {
              rtv = [...rtv, ...item.memberLevelList.map(x => x.levelCode)]
              return rtv
            }, [])
          }

          if (val && val.length <= 0) {
            this.preSalePromotion.memberLevels = []
          }
        })
      },
      deep: true
    }
  },
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    this.platformId = +this.$portal.getPlatformId()
    await this.getLoadPageConfigCommonOscUrl()
    if (this.promotionId !== '') {
      this.queryPromotionActivityDetail()
    }
    this.buildFrontPromDesc()
  },
  methods: {
    validateDeliveryTimeString(rule, value, callback) {
      const deliveryTimeString = value
      const { 1: preSellTimeEnd } = this.preSalePromotion.preSellTime || []

      if (deliveryTimeString && preSellTimeEnd && this.$moment(deliveryTimeString).valueOf() < this.$moment(preSellTimeEnd).valueOf()) {
        callback(new Error('开始发货必须大于尾款支付结束时间'))
      } else {
        callback()
      }
    },
    validatePreSellTime(rule, value, callback) {
      const [createTimeStart, createTimeEnd] = this.preSalePromotion.createTime || [] // 定金
      const [preSellTimeStart, preSellTimeEnd] = value || [] // 尾款

      if (preSellTimeStart && createTimeStart && this.$moment(preSellTimeStart).valueOf() < this.$moment(createTimeStart).valueOf()) {
        callback(new Error('尾款支付开始时间必须大于定金支付开始时间'))
      } else if (preSellTimeEnd && createTimeEnd && this.$moment(preSellTimeEnd).valueOf() < this.$moment(createTimeEnd).valueOf()) {
        callback(new Error('尾款支付结束时间必须大于定金支付结束时间'))
      } else {
        callback()
      }
    },
    // 设置开始发货禁用时间
    disabledDate(time) {
      const times = new Date(this.aaa).getTime()
      return time.getTime() < times + 1
    },

    // 预售中文与英文文案
    buildFrontPromDesc() {
      var params = {
        conditionType: this.preSalePromotion.conditionType,
        favourableList: this.preSalePromotion.favourableList,
        promotionMethod: this.preSalePromotion.promotionMethod,
        promotionType: this.promType
      }
      this.$promotion.$api.promotion.buildFrontPromDesc(params).then(res => {
        this.ruleChinesePlaceholder = res.data[0].desc
        this.ruleEnglishPlaceholder = res.data[1].desc
        console.log(this.ruleChinesePlaceholder, this.ruleEnglishPlaceholder)
      })
    },
    async getLoadPageConfigCommonOscUrl() {
      const { data = {}, code } = await this.promotionAPI.getLoadPageConfigCommonOscUrl('PRESELL_PAGE_CONFIG')
      if (+code !== 0) {
        return
      }
      if (data.PRESELL_CONTENT_TYPE && data.PRESELL_CONTENT_TYPE.length > 0) {
        if (data.PRESELL_CONTENT_TYPE[0].id === 1) {
          this.preSalePromotion.promotionMethod = 17 // 定金预售
        } else {
          this.preSalePromotion.promotionMethod = 19 // 全款预售
        }
      }
      if (data.PRESELL_PRICE_MODE && data.PRESELL_PRICE_MODE.length > 0) {
        this.preSalePromotion.presellPriceMode = data.PRESELL_PRICE_MODE[0].id // 预售价模式
      }
    },
    // 开发发货时间判断
    handleChange() {
      if (this.preSalePromotion.deliveryTimeString && this.preSalePromotion.preSellTime.length > 0) {
        var Date1 = new Date(this.preSalePromotion.deliveryTimeString).getTime()
        var Date2 = new Date(this.preSalePromotion.preSellTime[1]).getTime()
        var day = Math.floor(Date1 - Date2) / 1000 / 60 / 60 / 24
        if (day < 3) {
          // this.preSalePromotion.deliveryTimeString = ''
          this.$alert(this.$t('建议开始发货时间在尾款支付开始时间后3天以上') + '！', this.$t('系统提示'), {
            confirmButtonText: this.$t('确定')
          })
        }
      }
    },
    handleMemberLevelsChange(type, isChecked) {
      const beforeIndex = this.preSalePromotion.memberTypes.indexOf(type)
      const beforeTypeIndex = this.memberTypesSelected.findIndex((item) => {
        return item.value === type
      })
      if (isChecked) {
        if (beforeIndex === -1) {
          this.preSalePromotion.memberTypes.push(type)
          this.memberTypesSelected = []
        }
      } else {
        if (beforeIndex >= 0) {
          this.preSalePromotion.memberTypes.splice(beforeIndex, 1)
          this.memberTypesSelected.splice(beforeTypeIndex, 1)
        }
      }
    },
    async queryPromotionActivityDetail() {
      if (this.preSalePromotion.id === '') {
        return
      }

      const { data = {}, data: { fromDate = '', endDate = '', preSellStartTime = '', preSellEndTime = '' }, code } = await this.promotionAPI.getPromotionDetailUrl(this.preSalePromotion)
      if (code === '0') {
        this.preSalePromotion = data
        this.$set(this.preSalePromotion, 'preSellTime', [preSellStartTime, preSellEndTime])
        this.$set(this.preSalePromotion, 'createTime', [fromDate, endDate])
        this.preSalePromotion.freeShipping = data.freeShipping
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
