<template>
  <div class="pg-gift-promotion-step1">
    <el-form
      ref="giftPromotion"
      :model="giftPromotion"
      :rules="singlePromotionRules"
      label-width="240px"
      class="form"
    >
      <ody-title :title="$t('基本信息')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('促销活动名称')" prop="promTitle" name="promTitle">
          <el-input
            v-model="giftPromotion.promTitle"
            :placeholder="$t('请输入促销活动名称')"
            name="giftPromotion_promTitle"
            maxlength="64"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="$t('活动时间')" prop="createTime" name="createTime">
          <el-date-picker
            v-model="giftPromotion.createTime"
            name="giftPromotion_createTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="-"
          />
        </el-form-item>
      </div>

      <ody-title :title="$t('活动规则')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('平台类型')" prop="activityPlatformType" name="activityPlatformType" required>
          <ody-radio2
            key="activityPlatformType"
            v-model="giftPromotion.activityPlatformType"
            name="giftPromotion_activityPlatformType"
            list-key="activityPlatformTypeList"
          />
        </el-form-item>
        <el-form-item prop="conditionType" name="conditionType" required>
          <template slot="label">
            {{ $t('促销类型') }}
            <el-tooltip
              :content="$t('POS渠道：仅支持满商品赠优惠券，买商品赠商品（主赠相同）及赠优惠券')"
              class="item"
              effect="dark"
              placement="top-start">
              <i class="el-icon-warning"/>
            </el-tooltip>
          </template>
          <ody-radio2
            key="conditionType"
            v-model="giftPromotion.conditionType"
            name="giftPromotion_conditionType"
            list-key="conditionTypeList"
            @change="handleConditionTypeChange"
          />
        </el-form-item>
        <el-form-item v-if="giftSameAsProductFlgShow" :label="$t('主赠相同')" prop="giftSameAsProductFlg" name="giftSameAsProductFlg" required>
          <ody-radio2
            key="giftSameAsProductFlg"
            v-model="giftPromotion.giftSameAsProductFlg"
            name="giftPromotion_giftSameAsProductFlg"
            list-key="giftSameAsProductFlgList"
            @change="handleGiftSameAsProductFlgChange"
          />
        </el-form-item>
        <el-form-item :label="$t('是否叠加应用')" prop="promotionGiftRule" required>
          <ody-radio2
            key="promotionGiftRule"
            v-model="giftPromotion.promotionGiftRule"
            name="giftPromotion_promotionGiftRule"
            list-key="overlayApplicationList"
            @change="handleGiftRuleChange">
            <span slot="2" class="gift-limit-multy">
              <el-form-item
                :rules="+giftPromotion.promotionGiftRule === 1 ? [] : [
                  { required: true, message: $t('倍量上限不能为空'), trigger: ['change', 'blur'] }
                ]"
                prop="giftLimit4Multy"
                name="giftLimit4Multy"
                class="gift-limit-multy">
                <ody-input-number
                  :empty-tip="false"
                  v-model="giftPromotion.giftLimit4Multy"
                  :disabled="+giftPromotion.promotionGiftRule === 1"
                  name="giftPromotion_giftLimit4Multy"
                  class="gift-limit-multy"
                  maxlength="8"
                >
                  <template slot="append">{{ $t('次') }}</template>
                </ody-input-number>
              </el-form-item>
            </span>
          </ody-radio2>
        </el-form-item>
        <el-form-item v-if="giftSameTypeShow" :label="$t('优惠设置')" prop="favourableList" name="favourableList" required>
          <promotion-preferential-setting-table
            v-model="giftPromotion.favourableList"
            :is-superposition="giftPromotion.promotionGiftRule !== 1"
            :promotion-method="giftPromotion.promotionMethod"
            :prom-type="promType"
            name="giftPromotion_favourableList"
          />
        </el-form-item>
        <el-form-item v-if="getThirdPartyPlatformShow" :label="$t('赠送方式')" prop="givingType" name="givingType" required>
          <ody-radio2
            key="givingType"
            v-model="giftPromotion.givingType"
            name="giftPromotion_givingType"
            list-key="givingTypeList"
          />
        </el-form-item>
        <el-form-item v-if="giftPromotion.giftSameAsProductFlg === 2" :label="$t('赠品类型')" prop="giftType" name="giftType" required>
          <ody-radio2
            key="giftType"
            v-model="giftPromotion.giftType"
            name="giftPromotion_giftType"
            list-key="giftTypeList"
          />
        </el-form-item>
        <el-form-item :label="$t('活动描述(中文)')" prop="ruleDesc" name="ruleDesc">
          <promotion-activity-description-input-chinese
            :rule-desc.sync="giftPromotion.ruleDesc"
            :placeholder="ruleChinesePlaceholder"
          />
        </el-form-item>
        <el-form-item :label="$t('活动描述(英文)')" prop="ruleDesc" name="ruleDesc">
          <promotion-activity-description-input-english
            :rule-desc-lan.sync="giftPromotion.ruleDescLan2"
            :placeholder="ruleEnglishPlaceholder"
          />
          <promotion-desc-modal />
        </el-form-item>
      </div>

      <ody-title v-show="getAutarkyPlatformShow && platformId != 2" :title="$t('交易规则')" />
      <div v-show="getAutarkyPlatformShow && platformId != 2" class="single-promotion-content">
        <el-form-item
          :label="$t('是否排斥优惠券')"
          prop="canUseCoupon"
          name="canUseCoupon"
          required
        >
          <ody-radio2
            key="canUseCoupon"
            v-model="giftPromotion.canUseCoupon"
            name="giftPromotion_canUseCoupon"
            list-key="promotionCanUseCouponList"
          />
        </el-form-item>
        <el-form-item :label="$t('是否包邮')" prop="freeShipping" name="freeShipping" required>
          <ody-radio2
            key="freeShipping"
            v-model="giftPromotion.freeShipping"
            name="giftPromotion_freeShipping"
            list-key="promotionFreeShippingList"
          />
        </el-form-item>
      </div>
      <ody-title :title="getAutarkyPlatformShow ? $t('参与条件') : $t('订单规则')" />
      <div class="single-promotion-content">
        <div v-if="getAutarkyPlatformShow">
          <el-form-item :label="$t('活动渠道')" prop="channelCodes" name="channelCodes" required>
            <promotion-channel-code-checkbox
              v-model="giftPromotion.channelCodes"
              :is-show-all="true"
              :checked-all="promotionId === ''"
              :prom-type="promType"
              name="giftPromotion_channelCodes"
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
          <el-form-item :label="$t('活动平台')" prop="applicablePlatformList" name="applicablePlatformList">
            <promotion-applicable-platform-checkbox
              v-model="giftPromotion.applicablePlatformList"
              :is-show-all="true"
              :checked-all="promotionId === ''"
              name="giftPromotion_applicablePlatformList"
            />
          </el-form-item>
          <el-form-item v-show="platformId != 2" :label="$t('新老用户')" prop="userScopeList" name="userScopeList">
            <promotion-user-scope-checkbox
              v-model="giftPromotion.userScopeList"
              :is-show-all="true"
              :checked-all="promotionId === ''"
              name="giftPromotion_userScopeList"
            />
          </el-form-item>
          <el-form-item v-show="platformId != 2" :label="$t('会员类型')" prop="memberTypes" name="memberTypes">
            <promotion-member-types-checkbox
              v-model="giftPromotion.memberTypes"
              :selected.sync="memberTypesSelected"
              :checked-all="promotionId === ''"
              name="giftPromotion_memberTypes"
            />
          </el-form-item>
          <el-form-item v-show="platformId != 2" :label="$t('会员等级')" prop="memberLevels" name="memberLevels">
            <promotion-member-levels-checkbox
              v-model="giftPromotion.memberLevels"
              :checked-all="promotionId === ''"
              name="giftPromotion_memberLevels"
              @change="handleMemberLevelsChange"
            />
          </el-form-item>
        </div>
      </div>
      <div v-if="getThirdPartyPlatformShow">
        <el-form-item :label="$t('订单类型')" prop="orderType" name="orderType" required>
          <promotion-order-type-radio v-model="giftPromotion.orderType" name="giftPromotion_orderType"/>
        </el-form-item>
        <el-form-item :label="$t('订单日期')" prop="orderDateType" name="orderDateType" required>
          <ody-radio2
            key="orderDateType"
            v-model="giftPromotion.orderDateType"
            name="giftPromotion_orderDateType"
            list-key="orderDateTypeList"
          />
        </el-form-item>
      </div>
      <el-form-item :label="$t('备注')" prop="description" name="description">
        <ody-tinymce :show-upload-img="false" :height="300" v-model="giftPromotion.description" :limit="1000" name="giftPromotion_description" />
      </el-form-item>
    </el-form>

    <!-- <el-button name="handleCom" size="medium" @click="handleCom">{{ $t('确认') }}</el-button> -->
  </div>
</template>

<script>

import PromotionActivityDescriptionInputChinese from '@/components/promotion-activity-description-input-chinese'
import PromotionActivityDescriptionInputEnglish from '@/components/promotion-activity-description-input-english'
import PromotionChannelCodeCheckbox from '@/components/promotion-channel-code-checkbox'
import PromotionApplicablePlatformCheckbox from '@/components/promotion-applicable-platform-checkbox'
import PromotionUserScopeCheckbox from '@/components/promotion-user-scope-checkbox'
import PromotionMemberTypesCheckbox from '@/components/promotion-member-types-checkbox'
import PromotionMemberLevelsCheckbox from '@/components/promotion-member-levels-checkbox'
import PromotionOrderTypeRadio from '@/components/promotion-order-type-radio'
import PromotionPreferentialSettingTable from '@/components/promotion-preferential-setting-table'
import PromotionDescModal from '@/components/desc-modal'

import util from '@/utils/util'

export default {
  components: {
    PromotionDescModal,
    PromotionActivityDescriptionInputChinese,
    PromotionActivityDescriptionInputEnglish,
    PromotionChannelCodeCheckbox,
    PromotionApplicablePlatformCheckbox,
    PromotionUserScopeCheckbox,
    PromotionMemberTypesCheckbox,
    PromotionMemberLevelsCheckbox,
    PromotionOrderTypeRadio,
    PromotionPreferentialSettingTable
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
      ruleChinesePlaceholder: this.$t('请输入描述'),
      ruleEnglishPlaceholder: this.$t('请输入描述'),
      giftPromotion: {
        giftLimit4Multy: '',
        promotionMethod: 4,
        commissionSign: 0,
        id: this.promotionId,
        promotionType: this.promType,
        activityChannel: 1,
        participatMethod: 2,
        activityNumType: 0,
        activityUser: 1,
        priority: 1,
        promTitle: '', // 促销活动名称
        activityPlatformType: 0, // 平台类型
        conditionType: 1, // 促销类型
        promotionGiftRule: 1, // 是否叠加应用
        activityType: '', // 活动类型
        merchantType: '', // 商家类型
        givingType: 0, // 赠送方式
        orderType: '0', // 订单类型
        orderDateType: 0, // 订单日期
        giftType: 1, // 赠品类型
        favourableList: [
          {
            favourableCondition: '',
            favourableContent: '',
            conditionValueUnit: '',
            favourableContentLimit: ''
          }
        ], // 优惠设置
        giftSameAsProductFlg: 2, // 主赠相同
        createTime: [],
        fromDate: '',
        endDate: '',
        ruleDesc: '', // 活动描述-中文
        ruleDescLan2: '', // 活动描述-英文
        canUseCoupon: 0, // 是否排斥优惠券
        freeShipping: 0, // 是否包邮
        applicablePlatformList: [], // 活动平台
        userScopeList: [], // 新老用户
        memberTypes: [], // 会员类型
        memberLevels: [], // 会员等级
        channelCodes: [], // 活动渠道
        description: '' // 备注
      },
      singlePromotionRules: {
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
  computed: {
    getAutarkyPlatformShow() {
      return +this.giftPromotion.activityPlatformType === 0
    },
    getThirdPartyPlatformShow() {
      return +this.giftPromotion.activityPlatformType === 1
    },
    giftSameAsProductFlgShow() {
      return +this.giftPromotion.conditionType === 2 && +this.giftPromotion.activityPlatformType === 0
    },
    giftSameTypeShow() {
      return +this.giftPromotion.conditionType === 2 && +this.giftPromotion.giftSameAsProductFlg === 1
    }
  },
  watch: {
    'giftPromotion.giftSameAsProductFlg': {
      handler: function(val) {
        console.log('val', val)
        // if (val === 2) {

        // }
      }
    },
    'giftPromotion.memberTypes': {
      handler: function(val) {
        this.$nextTick(() => {
          if (this.memberTypesSelected.length > 0) {
            this.giftPromotion.memberLevels = this.memberTypesSelected.reduce((rtv, item) => {
              rtv = [...rtv, ...item.memberLevelList.map(x => x.levelCode)]
              return rtv
            }, [])
          }

          if (val && val.length <= 0) {
            this.giftPromotion.memberLevels = []
          }
        })
      },
      deep: true
    },
    'giftPromotion': {
      handler(newValue, oldValue) {
        if (newValue.conditionType !== oldValue.conditionType ||
          newValue.giftType !== oldValue.giftType ||
          newValue.promotionGiftRule !== oldValue.promotionMethod ||
          newValue.giftLimit4Multy !== oldValue.giftLimit4Multy ||
          JSON.stringify(newValue.favourableList) !== JSON.stringify(oldValue.favourableList)
        ) {
          // if (newValue.giftLimit4Multy !== '' && (/^[1-9][0-9]{0,3}$/.test(newValue.giftLimit4Multy))) {
          //   this.buildFrontPromDesc()
          // }
          console.log(newValue)
          if (newValue.favourableList && newValue.favourableList.some((x) => {
            return typeof favourableCondition !== 'number' || typeof favourableContent !== 'number'
          })) {
            return
          }
          // favourableCondition favourableContent
          this.buildFrontPromDesc()
        }
      },
      deep: true
    }
  },
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    // console.log('promType', this.promType)
    // console.log('giftPromotion', this.giftPromotion)
    this.platformId = +this.$portal.getPlatformId()
    await this.queryPromotionActivityDetail()
    await this.getLoadPageConfigCommonOscUrl()
    this.buildFrontPromDesc()
  },
  methods: {
    // giftTypeShow() {
    //   if (this.giftPromotion.giftSameAsProductFlg === 2) {
    //     if()
    //   }
    // },
    buildFrontPromDesc() {
      var params = {
        conditionType: this.giftPromotion.conditionType,
        favourableList: this.giftPromotion.favourableList,
        giftType: this.giftPromotion.giftType,
        isSuperposition: +this.giftPromotion.promotionGiftRule === 1 ? 0 : 1,
        promotionMethod: this.giftPromotion.promotionMethod,
        giftLimit4Multy: this.giftPromotion.giftLimit4Multy,
        promotionType: this.promType
      }
      this.$promotion.$api.promotion.buildFrontPromDesc(params).then(res => {
        this.ruleChinesePlaceholder = res.data[0].desc
        this.ruleEnglishPlaceholder = res.data[1].desc
      })
    },
    async getLoadPageConfigCommonOscUrl() {
      const { data = {}, code } = await this.promotionAPI.getLoadPageConfigCommonOscUrl('PAGE_CONFIG_NOT_SAME')
      if (+code !== 0) {
        return
      }

      const promotionCreateType = +data.promotionCreateType
      const merchantType = +data.merchantType
      if (util.isEmpty(this.giftPromotion.id)) {
        if (promotionCreateType !== 0) {
          this.giftPromotion.activityType = promotionCreateType
        } else {
          this.giftPromotion.activityType = 1
        }

        if (merchantType !== 0) {
          this.giftPromotion.merchantType = merchantType
        } else {
          this.giftPromotion.merchantType = 1
        }
      }
    },
    handleGiftSameAsProductFlgChange(val) {
      this.giftPromotion.giftSameAsProductFlg = val
      if (+val === 1) {
        this.giftPromotion.promotionMethod = 5 // 买一赠一
      } else {
        this.giftPromotion.promotionMethod = 4 // 买一赠一
      }
    },
    handleConditionTypeChange(val) {
      // 促销类型为1：满金额赠时，主赠相同设为否
      if (+val === 1) {
        this.giftPromotion.giftSameAsProductFlg = 2
        this.giftPromotion.promotionMethod = 4
      } else {
        if (+this.giftPromotion.giftSameAsProductFlg === 1) {
          this.giftPromotion.promotionMethod = 5 // 买一赠一
        }
      }
    },
    handleGiftRuleChange(val) {
      if (val === 1) {
        this.giftPromotion.giftLimit4Multy = null
      } else if (val === 2) {
        this.giftPromotion.favourableList = this.giftPromotion.favourableList.slice(0, 1)
      }
    },
    handleMemberLevelsChange(type, isChecked) {
      const beforeIndex = this.giftPromotion.memberTypes.indexOf(type)
      const beforeTypeIndex = this.memberTypesSelected.findIndex((item) => {
        return item.value === type
      })
      if (isChecked) {
        if (beforeIndex === -1) {
          this.giftPromotion.memberTypes.push(type)
          this.memberTypesSelected = []
        }
      } else {
        if (beforeIndex >= 0) {
          this.giftPromotion.memberTypes.splice(beforeIndex, 1)
          this.memberTypesSelected.splice(beforeTypeIndex, 1)
        }
      }
    },
    async queryPromotionActivityDetail() {
      if (this.giftPromotion.id === '') {
        return
      }
      const { data = {}, data: { fromDate = '', endDate = '' }, code } = await this.promotionAPI.getPromotionDetailUrl(this.giftPromotion)

      if (code === '0') {
        this.giftPromotion = data

        if (this.giftPromotion.givingType === null) {
          this.giftPromotion.givingType = 0
        }

        if (this.giftPromotion.orderType === null) {
          this.giftPromotion.orderType = '0'
        }

        if (this.giftPromotion.orderDateType === null) {
          this.giftPromotion.orderDateType = 0
        }

        // 判断是否是买一赠一
        if (+this.giftPromotion.promotionMethod === 5) { // 增商品   买一赠一
          // 促销类型为2：买商品赠
          this.giftPromotion.conditionType = 2
          // 主赠相同为1：是
          this.$set(this.giftPromotion, 'giftSameAsProductFlg', 1)
        } else if (+this.giftPromotion.promotionMethod === 4) { // 增商品-或者赠优惠券
          // 主赠相同为2：否
          this.$set(this.giftPromotion, 'giftSameAsProductFlg', 2)
        }

        this.$set(this.giftPromotion, 'createTime', [fromDate, endDate])
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pg-gift-promotion-step1{
  .gift-limit-multy{
    font-size: 14px;
    width: 135px;
    display: inline-block;
    line-height: 32px;
  }

  /deep/ .el-form-item{
    margin-bottom: 16px;
  }
}
</style>
