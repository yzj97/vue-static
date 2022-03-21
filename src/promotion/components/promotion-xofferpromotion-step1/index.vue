<template>
  <div>
    <el-form
      ref="xofferPromotion"
      :model="xofferPromotion"
      :rules="xofferPromotionRules"
      label-width="240px"
      class="form"
    >
      <ody-title :title="$t('基本信息')" />
      <div class="single-promotion-content single-promotion-content-mini" style="width:100%;">
        <el-form-item :label="$t('促销活动名称')" prop="promTitle" name="promTitle">
          <el-input
            v-model="xofferPromotion.promTitle"
            :placeholder="$t('请输入促销活动名称')"
            name="xofferPromotion_promTitle"
            show-word-limit
            maxlength="64"
          />
        </el-form-item>
        <el-form-item :label="$t('活动时间')" prop="createTime" name="createTime">
          <el-date-picker
            v-model="xofferPromotion.createTime"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
            name="xofferPromotion_createTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="-"
          />
        </el-form-item>
      </div>

      <ody-title :title="$t('活动规则')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('选品范围')" prop="selectionRange" name="selectionRange" required>
          <ody-radio2 v-model="xofferPromotion.selectionRange" name="xofferPromotion_selectionRange" list-key="selectionRangeTypeList" />
        </el-form-item>
        <el-form-item :label="$t('促销类型')" prop="promotionMethod" name="promotionMethod" required>
          <!-- {{ xofferPromotion.promotionMethod }} -->
          <ody-radio2
            v-model="xofferPromotion.promotionMethod"
            name="xofferPromotion_promotionMethod"
            list-key="xofferPromotionMethod"
            @change="handlePromotionMethodChange"
          />
        </el-form-item>
        <el-form-item
          :label="$t('是否叠加应用')"
          prop="activityType"
          name="activityType"
          required
          class="isSuperposition-redio"
        >
          <el-radio-group
            v-model="xofferPromotion.isSuperposition"
            name="xofferPromotion_isSuperposition5"
            @blur="handleIsSuperpositionChange"
            @changeSelf="cleanSet">
            <el-radio :label="0">否（超量：按最高层级享受优惠）</el-radio>
            <el-radio :disabled="+xofferPromotion.promotionMethod === 2" :label="1"> 是（倍量：每满一级优惠一次），上限</el-radio>
          </el-radio-group>
          <el-form-item
            :rules="+xofferPromotion.isSuperposition === 0 ? [] : [
              { required: true, message: $t('倍量上限不能为空'), trigger: ['blur'] }
            ]"
            prop="giftLimit4Multy"
            class="gift-limit-multy radioInput">
            <ody-input-number
              v-model="xofferPromotion.giftLimit4Multy"
              :disabled="xofferPromotion.isSuperposition === 0 || xofferPromotion.promotionMethod === 2"
              name="singlePromotion_giftLimit4Multy"
              style="width: 180px;"
              class="gift-limit-multy"
              maxlength="8"
              @blur="handleGiftLimit4MultyChange">
              <template slot="append">{{ $t('次') }}</template>
            </ody-input-number>
          </el-form-item>
        </el-form-item>
        <el-form-item :label="$t('优惠设置')" prop="favourableList" name="favourableList" required>
          <promotion-preferential-setting-table
            ref="favourableList"
            v-model="xofferPromotion.favourableList"
            :promotion-method="xofferPromotion.promotionMethod"
            :is-superposition="xofferPromotion.isSuperposition"
            name="xofferPromotion_favourableList"
            type="2"
          />
        </el-form-item>
        <el-form-item :label="$t('活动描述(中文)')" prop="ruleDesc" name="ruleDesc" style="width:100%;">
          <promotion-activity-description-input-chinese
            :rule-desc.sync="xofferPromotion.ruleDesc"
            :placeholder="ruleChinesePlaceholder"
          />
        </el-form-item>
        <el-form-item :label="$t('活动描述(英文)')" prop="ruleDesc" name="ruleDesc" style="width:100%;">
          <promotion-activity-description-input-english
            :rule-desc-lan.sync="xofferPromotion.ruleDescLan2"
            :placeholder="ruleEnglishPlaceholder"
          />
          <promotion-desc-modal />
        </el-form-item>
      </div>

      <ody-title v-show="platformId != 2" :title="$t('交易规则')" />
      <div v-show="platformId != 2" class="single-promotion-content">
        <el-form-item :label="$t('是否排斥优惠券')" prop="canUseCoupon" name="canUseCoupon" required>
          <ody-radio2 v-model="xofferPromotion.canUseCoupon" name="xofferPromotion_canUseCoupon" list-key="promotionCanUseCouponList" />
        </el-form-item>
        <el-form-item :label="$t('是否包邮')" prop="freeShipping" name="freeShipping" required>
          <ody-radio2 v-model="xofferPromotion.freeShipping" name="xofferPromotion_freeShipping" list-key="promotionFreeShippingList" />
        </el-form-item>
      </div>
      <ody-title :title="$t('参与条件')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('活动渠道')" prop="channelCodes" name="channelCodes" required>
          <promotion-channel-code-checkbox
            v-model="xofferPromotion.channelCodes"
            :is-show-all="true"
            :checked-all="promotionId === ''"
            :prom-type="promType"
            name="xofferPromotion_channelCodes"
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
            v-model="xofferPromotion.applicablePlatformList"
            :is-show-all="true"
            :checked-all="promotionId === ''"
            name="xofferPromotion_applicablePlatformList"
          />
        </el-form-item>
        <el-form-item v-show="platformId != 2" :label="$t('新老用户')" prop="userScopeList" name="userScopeList">
          <promotion-user-scope-checkbox
            v-model="xofferPromotion.userScopeList"
            :is-show-all="true"
            :checked-all="promotionId === ''"
            name="xofferPromotion_userScopeList"
          />
        </el-form-item>
        <el-form-item v-show="platformId != 2" :label="$t('会员类型')" prop="memberTypes" name="memberTypes">
          <!-- required -->
          <promotion-member-types-checkbox
            v-model="xofferPromotion.memberTypes"
            :selected.sync="memberTypesSelected"
            :checked-all="promotionId === ''"
            name="xofferPromotion_memberTypes"
          />
        </el-form-item>
        <el-form-item v-show="platformId != 2" :label="$t('会员等级')" prop="memberLevels" name="memberLevels">
          <!-- required -->
          <promotion-member-levels-checkbox
            v-model="xofferPromotion.memberLevels"
            :checked-all="promotionId === ''"
            name="xofferPromotion_memberLevels"
            @change="handleMemberLevelsChange"
          />
        </el-form-item>
        <el-form-item :label="$t('备注')" prop="description" name="description">
          <ody-tinymce :show-upload-img="false" :height="300" v-model="xofferPromotion.description" :limit="1000" name="xofferPromotion_description" />
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
import PromotionChannelCodeCheckbox from '@/components/promotion-channel-code-checkbox'
import PromotionApplicablePlatformCheckbox from '@/components/promotion-applicable-platform-checkbox'
import PromotionUserScopeCheckbox from '@/components/promotion-user-scope-checkbox'
import PromotionMemberTypesCheckbox from '@/components/promotion-member-types-checkbox'
import PromotionMemberLevelsCheckbox from '@/components/promotion-member-levels-checkbox'
import PromotionIsSuperpositionRadio from '@/components/promotion-is-superposition-radio'
import PromotionPreferentialSettingTable from '@/components/promotion-preferential-setting-table'
import PromotionDescModal from '@/components/desc-modal'

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
    PromotionMemberLevelsCheckbox,
    PromotionIsSuperpositionRadio,
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
      type: Number,
      default: null
    },
    promotionId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      platformId: '',
      dialogVisible: false,
      ruleChinesePlaceholder: this.$t('请输入描述'),
      ruleEnglishPlaceholder: this.$t('请输入描述'),
      xofferPromotion: {
        id: this.promotionId,
        promotionType: this.promType,
        activityChannel: 1,
        participatMethod: 2,
        activityNumType: 0,
        activityUser: 1,
        priority: 1,
        conditionType: 6,
        selectionRange: 2, // 选品范围
        promTitle: '', // 促销活动名称
        favourableList: [
          {
            favourableCondition: '',
            favourableContent: '',
            conditionValueUnit: '',
            favourableContentLimit: ''
          }
        ],
        createTime: [],
        fromDate: '',
        endDate: '',
        promotionMethod: 24, // 促销类型
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
        isSuperposition: 0, // 是否叠加应用
        description: '' // 备注
      },
      xofferPromotionRules: {
        promTitle: [
          {
            required: true,
            message: this.$t('请输入促销活动名称'),
            trigger: 'blur'
          },
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
          {
            required: true,
            message: this.$t('请选择活动渠道'),
            trigger: ['change', 'blur']
          }
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
    'xofferPromotion.favourableList': {
      handler() {
        this.buildFrontPromDesc()
      },
      deep: true
    },
    'xofferPromotion.isSuperposition': {
      handler(newValue, oldValue) {
        if (newValue === 0) {
          this.xofferPromotion.giftLimit4Multy = ''
        }
      }
    },
    'xofferPromotion.memberTypes': {
      handler: function(val) {
        this.$nextTick(() => {
          if (this.memberTypesSelected.length > 0) {
            this.xofferPromotion.memberLevels = this.memberTypesSelected.reduce(
              (rtv, item) => {
                rtv = [...rtv, ...item.memberLevelList.map(x => x.levelCode)]
                return rtv
              },
              []
            )
          }

          if (val && val.length <= 0) {
            this.xofferPromotion.memberLevels = []
          }
        })
      },
      deep: true
    }
  },
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  mounted() {
    this.platformId = +this.$portal.getPlatformId()
    if (this.promotionId !== '') {
      this.queryPromotionActivityDetail()
    }
    this.buildFrontPromDesc()
  },
  methods: {
    handleGiftLimit4MultyChange() {
      this.buildFrontPromDesc()
    },
    handlePromotionMethodChange() {
      if (this.xofferPromotion.promotionMethod === 2) {
        this.xofferPromotion.isSuperposition = 0
      }
      this.cleanSet()
      this.handleIsSuperpositionChange()
    },
    handleIsSuperpositionChange() {
      this.xofferPromotion.favourableList = [{}]
      this.buildFrontPromDesc()
    },
    buildFrontPromDesc() {
      this.xofferPromotion.giftLimit4Multy = this.xofferPromotion.giftLimit4Multy.replace(/^(0+)|[^\d]+/g, '')
      if (!this.xofferPromotion.giftLimit4Multy) {
        return
      }
      var params = {
        conditionType: this.xofferPromotion.conditionType,
        favourableList: this.xofferPromotion.favourableList,
        isSuperposition: +this.xofferPromotion.isSuperposition,
        promotionMethod: this.xofferPromotion.promotionMethod,
        giftLimit4Multy: this.xofferPromotion.giftLimit4Multy,
        promotionType: this.promType
      }

      params.favourableList = params.favourableList.map(item => {
        item.favourableCondition = item.favourableCondition.replace(/^(0+)|[^\d]+/g, '')
        item.favourableContent = item.favourableContent.replace(/^(0+)|[^\d]+/g, '')
        if (item.favourableCondition === '' && item.favourableContent === '') {
          return {}
        }
        return item
      })
      params = this.$portal.deepClone(params)
      if (params.promotionType === 18 && params.promotionMethod === 24) {
        params.favourableList.forEach(f => {
          f.favourableCondition = f.favourableCondition * 1
          f.favourableContent = f.favourableContent * 10
        })
      }
      if (params.promotionType === 18 && params.promotionMethod === 25) {
        params.favourableList.forEach(f => {
          f.favourableCondition = f.favourableCondition * 1
          f.favourableContent = f.favourableContent * 100
        })
      }
      if (params.promotionType === 18 && params.promotionMethod === 2) {
        params.favourableList.forEach(f => {
          f.favourableCondition = f.favourableCondition * 1
          f.favourableContent = f.favourableContent * 10
        })
      }
      this.$promotion.$api.promotion.buildFrontPromDesc(params).then(res => {
        this.ruleChinesePlaceholder = res.data[0].desc
        this.ruleEnglishPlaceholder = res.data[1].desc
        // if (this.xofferPromotion.isSuperposition) {
        //   this.ruleChinesePlaceholder = res.data[0].desc
        //   this.ruleEnglishPlaceholder = res.data[1].desc
        // } else {
        //   console.log(res.data)
        // }
      })
    },
    cleanSet() {
      this.xofferPromotion.favourableList = [
        {
          favourableCondition: '',
          favourableContent: '',
          conditionValueUnit: '',
          favourableContentLimit: ''
        }
      ]
    },
    handleMemberLevelsChange(type, isChecked) {
      const beforeIndex = this.xofferPromotion.memberTypes.indexOf(type)
      const beforeTypeIndex = this.memberTypesSelected.findIndex(item => {
        return item.value === type
      })
      if (isChecked) {
        if (beforeIndex === -1) {
          this.xofferPromotion.memberTypes.push(type)
          this.memberTypesSelected = []
        }
      } else {
        if (beforeIndex >= 0) {
          this.xofferPromotion.memberTypes.splice(beforeIndex, 1)
          this.memberTypesSelected.splice(beforeTypeIndex, 1)
        }
      }
    },
    async queryPromotionActivityDetail() {
      if (this.xofferPromotion.id === '') {
        return
      }

      const {
        data = {},
        data: { fromDate = '', endDate = '' },
        code
      } = await this.promotionAPI.getPromotionDetailUrl(this.xofferPromotion)

      if (code === '0') {
        this.xofferPromotion = data
        this.$set(this.xofferPromotion, 'createTime', [fromDate, endDate])
        data.favourableList.map(item => {
          delete item.id
          delete item.promotionRuleId
          delete item.favourableContentLimit
          delete item.conditionValueUnit
        })
        if (+data.promotionMethod === 25) {
          this.$set(this.xofferPromotion, 'favourableList', data.favourableList.map(x => {
            x.favourableContent /= 100
            return x
          }))
        } else if (+data.promotionMethod === 2 || +data.promotionMethod === 24) {
          this.$set(this.xofferPromotion, 'favourableList', data.favourableList.map(x => {
            x.favourableContent /= 10
            return x
          }))
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.radioInput {
 display: inline-block;
}
.blueBtn {
  color: blue;
  text-decoration: underline;
}
/deep/.cp-is-superposition-radio .el-radio {
  display: inline;
  margin: 0;
}
.single-promotion-content {
  &-mini {
    width: 640px;
  }
}
</style>
