<template>
  <div>
    <el-form
      ref="singlePromotion"
      :model="singlePromotion"
      :rules="singlePromotionRules"
      label-width="240px"
      class="form">
      <ody-title :title="$t('基本信息')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('促销活动名称')" prop="promTitle" name="promTitle">
          <el-input
            v-model="singlePromotion.promTitle"
            :placeholder="$t('请输入促销活动名称')"
            name="singlePromotion_promTitle"
            maxlength="64"
            show-word-limit/>
        </el-form-item>
        <el-form-item :label="$t('活动时间')" prop="createTime" name="createTime">
          <el-date-picker
            v-model="singlePromotion.createTime"
            name="singlePromotion_createTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="-"/>
        </el-form-item>
        <el-form-item :label="$t('活动描述(中文)')" prop="ruleDesc" name="ruleDesc">
          <promotion-activity-description-input-chinese
            :placeholder="ruleChinesePlaceholder"
            :rule-desc.sync="singlePromotion.ruleDesc"
          />
        </el-form-item>
        <el-form-item :label="$t('活动描述(英文)')" prop="ruleDescLan2" name="ruleDescLan2">
          <promotion-activity-description-input-english
            :placeholder="ruleEnglishPlaceholder"
            :rule-desc-lan.sync="singlePromotion.ruleDescLan2"
          />
          <promotion-desc-modal />
        </el-form-item>
      </div>

      <ody-title v-show="platformId != 2" :title="$t('交易规则')" />
      <div v-show="platformId != 2" class="single-promotion-content">
        <el-form-item
          v-if="canShowMerchantNotSupport(3)"
          :label="$t('是否排斥优惠券')"
          prop="canUseCoupon"
          name="canUseCoupon"
          required>
          <ody-radio2
            v-model="singlePromotion.canUseCoupon"
            name="singlePromotion_canUseCoupon"
            list-key="promotionCanUseCouponList"/>
        </el-form-item>
        <el-form-item
          v-if="canShowMerchantNotSupport(2) && freeShipShowFlg != 0"
          :label="$t('是否包邮')"
          prop="freeShipping"
          name="freeShipping"
          required>
          <ody-radio2
            v-model="singlePromotion.freeShipping"
            name="singlePromotion_freeShipping"
            list-key="promotionFreeShippingList"/>
        </el-form-item>
      </div>
      <ody-title :title="$t('参与条件')" />
      <div class="single-promotion-content">
        <el-form-item
          v-if="singlePromotion.promotionType != 6000"
          :label="$t('活动渠道')"
          prop="channelCodes"
          name="channelCodes"
          required>
          <promotion-channel-code-checkbox
            v-model="singlePromotion.channelCodes"
            :is-show-all="true"
            :checked-all="promotionId === ''"
            :prom-type="promType"
            name="singlePromotion_channelCodes">
            <template slot-scope="scope">
              <!-- 美团 -->
              <el-tooltip
                v-if="scope.item.value == 210003"
                class="item"
                effect="dark"
                placement="top">
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
                placement="top">
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
          v-if="canShowActivityPlatformLimitShow()"
          :label="$t('活动平台')"
          prop="applicablePlatformList"
          name="applicablePlatformList"
        >
          <promotion-applicable-platform-checkbox
            v-model="singlePromotion.applicablePlatformList"
            :is-show-all="true"
            :checked-all="promotionId === ''"
            name="singlePromotion_applicablePlatformList"/>
        </el-form-item>
        <el-form-item
          v-show="canShowMemberLevel() && platformId != 2"
          :label="$t('新老用户')"
          prop="userScopeList"
          name="userScopeList"
        >
          <promotion-user-scope-checkbox
            v-model="singlePromotion.userScopeList"
            :is-show-all="true"
            :checked-all="promotionId === ''"
            name="singlePromotion_userScopeList"/>
        </el-form-item>
        <el-form-item
          v-show="canShowMemberLevel() && platformId != 2"
          :label="$t('会员类型')"
          prop="memberTypes"
          name="memberTypes">
          <promotion-member-types-checkbox
            v-model="singlePromotion.memberTypes"
            :selected.sync="memberTypesSelected"
            :checked-all="promotionId === ''"
            name="singlePromotion_memberTypes" />
        </el-form-item>
        <el-form-item v-show="platformId != 2" :label="$t('会员等级')" prop="memberLevels" name="memberLevels" >
          <promotion-member-levels-checkbox
            v-model="singlePromotion.memberLevels"
            :checked-all="promotionId === ''"
            name="singlePromotion_memberLevels"
            @change="handleMemberLevelsChange" />
        </el-form-item>
        <el-form-item :label="$t('备注')" prop="description" name="description">
          <ody-tinymce :show-upload-img="false" :height="300" v-model="singlePromotion.description" :limit="1000" name="singlePromotion_description" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>

import PromotionTypeRadio from '@/components/promotion-type-radio'
import PromotionActivityDescriptionInputChinese from '@/components/promotion-activity-description-input-chinese'
import PromotionActivityDescriptionInputEnglish from '@/components/promotion-activity-description-input-english'
import PromotionChannelCodeCheckbox from '@/components/promotion-channel-code-checkbox'
import PromotionApplicablePlatformCheckbox from '@/components/promotion-applicable-platform-checkbox'
import PromotionUserScopeCheckbox from '@/components/promotion-user-scope-checkbox'
import PromotionMemberTypesCheckbox from '@/components/promotion-member-types-checkbox'
import PromotionMemberLevelsCheckbox from '@/components/promotion-member-levels-checkbox'
import PromotionDescModal from '@/components/desc-modal'
import * as utilService from '@/services/utilService'

export default {
  components: {
    PromotionDescModal,
    PromotionTypeRadio,
    PromotionActivityDescriptionInputChinese,
    PromotionActivityDescriptionInputEnglish,
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
      // platformId: '',
      ruleChinesePlaceholder: this.$t('选择主商品和搭配商品,可享套餐优惠'),
      ruleEnglishPlaceholder: this.$t('选择主商品和搭配商品,可享套餐优惠'),
      singlePromotion: {
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
        promotionMethod: 20, // 促销类型
        conditionType: 20,
        activityType: 1, // 参与方式
        ruleDesc: '', // 活动描述-中文
        ruleDescLan2: '', // 活动描述-英文
        canUseCoupon: 0, // 是否排斥优惠券
        freeShipping: 0, // 是否包邮
        overlimitType: 1, // 超限规则
        applicablePlatformList: [], // 活动平台
        userScopeList: [], // 新老用户
        memberTypes: [], // 会员类型
        memberLevels: [], // 会员等级
        channelCodes: [], // 活动渠道
        description: '', // 备注
        merchantType: '1',
        themeIdList: [],
        commissionId: null,
        commissionSign: null
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
      promotionAPI: null,
      userScopeArr: [], // 活动对象
      applicablePlatformArr: [], // 活动平台
      freeShipShowFlg: [], // 是否包邮
      commissionSign: [], // 是否重设分佣,
      applyActivityTypeArr: [], // 未知
      notRealizeMerchantFunction: [4], //  商家未实现功能  1：新老用户  2：是否包邮  3：是否排斥券 [1,2,3]表示均为支持
      getPackagePromotionContentType: [{ 'id': 20, 'text': 'special_price_for_a_set_meal' }],
      platformId: null, // 平台id
      needMemberTypeConfig: {
        value: null
      },
      needMemberLevelConfig: {
        value: null
      },
      pageViewConfig: {
        needPlatMemberTypeConfig: null,
        needPlatMemberLevelConfig: null,
        needPlatformConfig: null,
        needUserTypeConfig: null
      },
      contentTypeArr: [] // 未知
    }
  },
  watch: {
    'singlePromotion.memberTypes': {
      handler: function(val) {
        this.$nextTick(() => {
          if (this.memberTypesSelected.length > 0) {
            this.singlePromotion.memberLevels = this.memberTypesSelected.reduce((rtv, item) => {
              rtv = [...rtv, ...item.memberLevelList.map(x => x.levelCode)]
              return rtv
            }, [])
          }

          if (val && val.length <= 0) {
            this.singlePromotion.memberLevels = []
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
    if (this.promotionId !== '') {
      this.queryPromotionActivityDetail()
    }
    await this.loadPageConfigMethod()
    await this.queryLoadOscConfigUrl()
  },
  methods: {
    canShowMemberLevel() {
      return this.pageViewConfig.needUserTypeConfig === '1' && this.canShowMerchantNotSupport(1)
    },
    async queryLoadOscConfigUrl() {
      const params = 'PAGE_CONFIG_NOT_SAME'
      const { data = {}} = await this.promotionAPI.getLoadPageConfigCommonOscUrl(params)

      // this.promotionDetailData = data
      // console.log(1111111111, data)
      // this.pageViewConfig.needPlatformConfig = data.NEED_PLATFORM_CONFIG
      // this.pageViewConfig.needUserTypeConfig = data.NEED_USER_TYPE_CONFIG
      this.needMemberTypeConfig.value = data.NEED_MEMBER_TYPE_CONFIG
      this.platformId = data.platformId
      this.needMemberLevelConfig.value = data.NEED_MEMBER_LEVEL_CONFIG
      this.pageViewConfig.needPlatMemberTypeConfig = data.NEED_MEMBER_TYPE_CONFIG
      this.pageViewConfig.needPlatMemberLevelConfig = data.NEED_MEMBER_LEVEL_CONFIG
      this.pageViewConfig.needPlatformConfig = data.NEED_PLATFORM_CONFIG
      this.pageViewConfig.needUserTypeConfig = data.NEED_USER_TYPE_CONFIG
    },
    canShowActivityPlatformLimitShow() {
      return this.pageViewConfig.needPlatformConfig === '1'
    },
    /** 判断是否展示代理商**/
    canShow() {
      if (this.userScopeArr != null) {
        for (var i = 0; i < this.userScopeArr.length; i++) {
          if (this.userScopeArr[i].id === 3) {
            return true
          }
        }
      }
      return false
    },
    // 活动对象多选
    userScopeSelectAll() {
      this.userScopeAllSelected = !this.userScopeAllSelected
      this.userScopeSelected = []
      this.userScopeArr.forEach(data => {
        data.checked = this.userScopeAllSelected
        if (this.userScopeAllSelected) {
          this.userScopeSelected.push(data.id)
        }
      })
    },
    // 活动平台多选
    // 全选
    applicablePlatformSelectAll() {
      this.applicablePlatformAllSelected = !this.applicablePlatformAllSelected
      this.applicablePlatformSelected = []
      this.applicablePlatformArr.forEach(data => {
        data.checked = this.applicablePlatformAllSelected
        if (this.applicablePlatformAllSelected) {
          this.applicablePlatformSelected.push(data.id)
        }
      })
    },
    async loadPageConfigMethod() {
      const result = await this.promotionAPI.loadPageConfigMethod({})

      console.log(result)
      // 活动对象
      this.userScopeArr = result.data.userScope
      // if (this.canShow()) {
      //   this.initAgentModelList()
      // }
      // 活动平台
      this.applicablePlatformArr = result.data.applicablePlatform
      // 是否包邮
      this.freeShipShowFlg = result.data.freeShipShowFlg
      // 是否重设分佣
      this.commissionSign = result.data.resetCommission
      if (!this.promotionId) {
        this.userScopeSelectAll()
        this.applicablePlatformSelectAll()
      }
      this.applyActivityTypeArr = result.data.applyActivityTypeList
      // 商家未实现功能  1：新老用户  2：是否包邮  3：是否排斥券 [1,2,3]表示均为支持
      this.notRealizeMerchantFunction = result.data.notRealizeMerchantFunction
      // 平台id， 1：运营平台  2：商家平台
      this.platformId = result.data.platformId
      if (!utilService.isEmpty(result.data.scopeType)) {
        if (this.platformId === 1) { // 平台
          if (!utilService.isEmpty(result.data.scopeType.platform)) {
            this.singlePromotion.scopeType = result.data.scopeType.platform
          }
        } else if (this.platformId === 2) { // 商家
          if (!utilService.isEmpty(result.data.scopeType.merchant)) {
            this.singlePromotion.scopeType = result.data.scopeType.merchant
          }
        }
      }
      if (utilService.isEmpty(result.data.packagePromType)) {
        this.contentTypeArr = this.getPackagePromotionContentType
      } else {
        if (this.platformId === 1) { // 平台
          this.contentTypeArr = result.data.packagePromType.platform
        } else if (this.platformId === 2) { // 商家
          this.contentTypeArr = result.data.packagePromType.merchant
        } else { // 其他
          this.contentTypeArr = this.getPackagePromotionContentType
        }
        // 设置默认值
        if (!utilService.isEmpty(this.contentTypeArr)) {
          this.defaultPromTypeSelected = []
          for (var i = 0; i < this.contentTypeArr.length; i++) {
            this.defaultPromTypeSelected.push(this.contentTypeArr[i].id)
          }
          if (this.defaultPromTypeSelected.indexOf(this.singlePromotion.promotionMethod) === -1 && utilService.isEmpty(this.promotionId)) {
            this.singlePromotion.promotionMethod = this.contentTypeArr[0].id
          }
        }
      }
    },
    canShowMerchantNotSupport(id) {
      if (this.platformId === 1) {
        return true
      }
      if (this.notRealizeMerchantFunction.indexOf(id) > -1) {
        if (id === 3) {
          this.singlePromotion.canUseCoupon = 1
        }
        return false
      }
      return true
    },
    getPromotionActivityDetail(val) {
      this.singlePromotion.isSuperposition = val.isSuperposition - 1
      this.singlePromotion.giftLimit4Multy = val.giftLimit4Multy
    },
    handleMemberLevelsChange(type, isChecked) {
      const beforeIndex = this.singlePromotion.memberTypes.indexOf(type)
      const beforeTypeIndex = this.memberTypesSelected.findIndex((item) => {
        return item.value === type
      })
      if (isChecked) {
        if (beforeIndex === -1) {
          this.singlePromotion.memberTypes.push(type)
          this.memberTypesSelected = []
        }
      } else {
        if (beforeIndex >= 0) {
          this.singlePromotion.memberTypes.splice(beforeIndex, 1)
          this.memberTypesSelected.splice(beforeTypeIndex, 1)
        }
      }
    },
    async queryPromotionActivityDetail() {
      if (this.singlePromotion.id === '') {
        return
      }

      const { data = {}, data: { fromDate = '', endDate = '' }, code } = await this.promotionAPI.getPromotionDetailUrl(this.singlePromotion)

      if (code === '0') {
        if (data.promotionType === 2) {
          data.favourableList.forEach(f => {
            f.favourableCondition = f.favourableCondition / 100
            f.favourableContent = f.favourableContent / 100
          })
        }
        this.singlePromotion = data
        this.$set(this.singlePromotion, 'createTime', [fromDate, endDate])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
