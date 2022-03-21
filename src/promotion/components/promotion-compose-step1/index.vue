<template>
  <div>
    <el-form
      ref="composePromotion"
      :model="composePromotion"
      :rules="composePromotionRules"
      label-width="240px"
      class="form"
    >
      <ody-title :title="$t('基本信息')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('促销活动名称')" prop="promTitle" name="promTitle">
          <el-input
            v-model="composePromotion.promTitle"
            :placeholder="$t('请输入促销活动名称')"
            name="composePromotion_promTitle"
            maxlength="64"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="$t('活动时间')" prop="createTime" name="createTime">
          <el-date-picker
            v-model="composePromotion.createTime"
            name="composePromotion_createTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="-"
          />
        </el-form-item>
      </div>

      <ody-title :title="$t('活动规则')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('优惠设置')" required>
          <template v-if="getDetailFlag">
            <promotion-compose-method ref="promotionComposeMethod" :compose-promotion="composePromotion" @updatedData="updatedData"/>
          </template>
        </el-form-item>
        <el-form-item :label="$t('活动描述(中文)')" prop="ruleDesc" name="ruleDesc">
          <promotion-activity-description-input-chinese
            :rule-desc.sync="composePromotion.ruleDesc"
            :placeholder="ruleChinesePlaceholder"
          />
        </el-form-item>
        <el-form-item :label="$t('活动描述(英文)')" prop="ruleDesc" name="ruleDesc">
          <promotion-activity-description-input-english
            :rule-desc-lan.sync="composePromotion.ruleDescLan2"
            :placeholder="ruleEnglishPlaceholder"
          />
          <promotion-desc-modal />
        </el-form-item>
      </div>

      <ody-title v-show="platformId != 2" :title="$t('交易规则')" />
      <div v-show="platformId != 2" class="single-promotion-content">
        <el-form-item
          :label="$t('是否排斥优惠券')"
          prop="canUseCoupon"
          name="canUseCoupon"
          required
        >
          <ody-radio2
            v-model="composePromotion.canUseCoupon"
            name="composePromotion_canUseCoupon"
            list-key="promotionCanUseCouponList"
          />
        </el-form-item>
        <el-form-item :label="$t('是否包邮')" prop="freeShipping" name="freeShipping" required>
          <ody-radio2
            v-model="composePromotion.freeShipping"
            name="composePromotion_freeShipping"
            list-key="promotionFreeShippingList"
          />
        </el-form-item>

      </div>
      <ody-title :title="$t('参与条件')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('活动渠道')" prop="channelCodes" name="channelCodes" required>
          <promotion-channel-code-checkbox
            v-model="composePromotion.channelCodes"
            :is-show-all="true"
            :checked-all="promotionId === ''"
            :prom-type="promType"
            name="composePromotion_channelCodes"
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
            v-model="composePromotion.applicablePlatformList"
            :is-show-all="true"
            :checked-all="promotionId === ''"
            name="composePromotion_applicablePlatformList"
          />
        </el-form-item>
        <el-form-item v-show="platformId != 2" :label="$t('新老用户')" prop="userScopeList" name="userScopeList">
          <promotion-user-scope-checkbox
            v-model="composePromotion.userScopeList"
            :is-show-all="true"
            :checked-all="promotionId === ''"
            name="composePromotion_userScopeList"
          />
        </el-form-item>
        <el-form-item v-show="platformId != 2" :label="$t('会员类型')" prop="memberTypes" name="memberTypes">
          <promotion-member-types-checkbox
            v-model="composePromotion.memberTypes"
            :selected.sync="memberTypesSelected"
            :checked-all="promotionId === ''"
            name="composePromotion_memberTypes"
          />
        </el-form-item>
        <el-form-item v-show="platformId != 2" :label="$t('会员等级')" prop="memberLevels" name="memberLevels">
          <promotion-member-levels-checkbox
            v-model="composePromotion.memberLevels"
            :checked-all="promotionId === ''"
            name="composePromotion_memberLevels"
            @change="handleMemberLevelsChange"
          />
        </el-form-item>
        <el-form-item :label="$t('备注')" prop="description" name="description">
          <ody-tinymce :show-upload-img="false" :height="300" v-model="composePromotion.description" :limit="1000" name="composePromotion_description" />
        </el-form-item>
      </div>
    </el-form>

    <!-- <el-button name="handleCom" size="medium" @click="handleCom">{{ $t('确认') }}</el-button> -->
  </div>
</template>

<script>

import PromotionTypeRadio from '@/components/promotion-type-radio'
import PromotionActivityDescriptionInputChinese from '@/components/promotion-activity-description-input-chinese'
import PromotionActivityDescriptionInputEnglish from '@/components/promotion-activity-description-input-english'
import PromotionOverLimitRadio from '@/components/promotion-over-limit-radio'
import PromotionChannelCodeCheckbox from '@/components/promotion-channel-code-checkbox'
import PromotionApplicablePlatformCheckbox from '@/components/promotion-applicable-platform-checkbox'
import PromotionUserScopeCheckbox from '@/components/promotion-user-scope-checkbox'
import PromotionMemberTypesCheckbox from '@/components/promotion-member-types-checkbox'
import PromotionMemberLevelsCheckbox from '@/components/promotion-member-levels-checkbox'
import PromotionComposeMethod from '@/components/promotion-compose-method'
import PromotionDescModal from '@/components/desc-modal'
// import util from '@/utils/util'

export default {
  components: {
    PromotionTypeRadio,
    PromotionActivityDescriptionInputChinese,
    PromotionActivityDescriptionInputEnglish,
    PromotionOverLimitRadio,
    PromotionChannelCodeCheckbox,
    PromotionApplicablePlatformCheckbox,
    PromotionUserScopeCheckbox,
    PromotionMemberTypesCheckbox,
    PromotionMemberLevelsCheckbox,
    PromotionComposeMethod,
    PromotionDescModal
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
      getDetailFlag: false,
      composePromotion: {
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

        commissionId: null,
        commissionSign: null,
        conditionType: 2,

        promotionMethod: 12, // 促销类型
        favourableList: [
          { favourableCondition: '',
            favourableContent: ''
          }
        ],

        activityType: 1, // 参与方式
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
      composePromotionRules: {
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
  watch: {
    'composePromotion.memberTypes': {
      handler: function(val) {
        this.$nextTick(() => {
          if (this.memberTypesSelected.length > 0) {
            this.composePromotion.memberLevels = this.memberTypesSelected.reduce((rtv, item) => {
              rtv = [...rtv, ...item.memberLevelList.map(x => x.levelCode)]
              return rtv
            }, [])
          }

          if (val && val.length <= 0) {
            this.composePromotion.memberLevels = []
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
      await this.queryPromotionActivityDetail()
    } else {
      await this.buildFrontPromDesc()
    }
    this.getDetailFlag = true
  },
  methods: {
    buildFrontPromDesc() {
      var params = {
        conditionType: this.composePromotion.conditionType,
        favourableList: this.composePromotion.favourableList,
        isSuperposition: this.composePromotion.isSuperposition,
        promotionMethod: this.composePromotion.promotionMethod,
        promotionType: this.promType,
        giftLimit4Multy: (this.composePromotion.giftLimit4Multy + '').replace(/\D/g, '')
      }
      params = this.$portal.deepClone(params)
      // params.favourableList = util.setFavourableList(this.composePromotion, params.favourableList)

      // 兼容处理下，favourableList 为空转成0提交

      this.$promotion.$api.promotion.buildFrontPromDesc(params).then(res => {
        this.ruleChinesePlaceholder = res.data[0].desc
        this.ruleEnglishPlaceholder = res.data[1].desc
      })
    },
    handleMemberLevelsChange(type, isChecked) {
      const beforeIndex = this.composePromotion.memberTypes.indexOf(type)
      const beforeTypeIndex = this.memberTypesSelected.findIndex((item) => {
        return item.value === type
      })
      if (isChecked) {
        if (beforeIndex === -1) {
          this.composePromotion.memberTypes.push(type)
          this.memberTypesSelected = []
        }
      } else {
        if (beforeIndex >= 0) {
          this.composePromotion.memberTypes.splice(beforeIndex, 1)
          this.memberTypesSelected.splice(beforeTypeIndex, 1)
        }
      }
    },
    async queryPromotionActivityDetail() {
      if (this.composePromotion.id === '') {
        return
      }

      const { data = {}, data: { fromDate = '', endDate = '' }, code } = await this.promotionAPI.getPromotionDetailUrl(this.composePromotion)

      if (code === '0') {
        this.composePromotion = data
        this.$set(this.composePromotion, 'createTime', [fromDate, endDate])
      }
    },
    updatedData(form) {
      if (form.promotionMethod !== this.composePromotion.promotionMethod) {
        this.composePromotion.favourableList = [
          { favourableCondition: '',
            favourableContent: ''
          }
        ]
      }
      this.composePromotion.promotionMethod = form.promotionMethod

      if (form.promotionMethod === 12) {
        this.composePromotion.favourableList[0].favourableCondition = form.favourableCondition
        this.composePromotion.favourableList[0].favourableContent = form.favourableContent * 100
      }
      if (form.promotionMethod === 13) {
        this.composePromotion.favourableList[0].favourableCondition = form.maxItem
        this.composePromotion.favourableList[0].favourableContent = form.minItem
      }

      this.buildFrontPromDesc()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
