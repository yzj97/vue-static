<template>
  <div>
    <el-form
      ref="freePromotion"
      :model="freePromotion"
      :rules="freePromotionRules"
      label-width="240px"
      class="form"
    >
      <ody-title :title="$t('基本信息')" />
      <div class="free-promotion-content">
        <el-form-item :label="$t('促销活动名称')" prop="promTitle" name="promTitle">
          <el-input
            v-model="freePromotion.promTitle"
            :placeholder="$t('限制在64个字符以内')"
            name="freePromotion_promTitle"
            maxlength="64"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="$t('活动时间')" prop="createTime" name="createTime">
          <el-date-picker
            v-model="freePromotion.createTime"
            name="freePromotion_createTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="-"
          />
        </el-form-item>
      </div>

      <ody-title :title="$t('活动规则')" />
      <div class="single-promotion-content">
        <el-form-item
          :label="$t('包邮方式')"
          prop="freeShipping"
          name="freeShipping"
          required
        >
          <promotion-type-radio v-model="freePromotion.freeShipping" name="freePromotion_freeShipping"/>
        </el-form-item>
        <el-form-item :label="$t('包邮设置')" prop="conditionType" name="conditionType" required>
          <promotion-free-setting-radio
            :free-promotion="freePromotion"
            @change="buildFrontPromDesc"
          />
        </el-form-item>
        <el-form-item :label="$t('活动描述(中文)')" prop="ruleDesc" name="ruleDesc">
          <promotion-activity-description-input-chinese
            :rule-desc.sync="freePromotion.ruleDesc"
            :placeholder="ruleChinesePlaceholder"
          />
        </el-form-item>
        <el-form-item :label="$t('活动描述(英文)')" prop="ruleDesc" name="ruleDesc">
          <promotion-activity-description-input-english
            :rule-desc-lan.sync="freePromotion.ruleDescLan2"
            :placeholder="ruleEnglishPlaceholder"
          />
          <promotion-desc-modal />
        </el-form-item>
      </div>

      <ody-title :title="$t('参与条件')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('活动渠道')" prop="channelCodes" name="channelCodes" required>
          <promotion-channel-code-checkbox
            v-model="freePromotion.channelCodes"
            :is-show-all="true"
            :checked-all="promotionId === ''"
            :prom-type="promType"
            name="freePromotion_channelCodes"
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
            v-model="freePromotion.applicablePlatformList"
            :is-show-all="true"
            :checked-all="promotionId === ''"
            name="freePromotion_applicablePlatformList"
          />
        </el-form-item>
        <el-form-item v-show="platformId != 2" :label="$t('新老用户')" prop="userScopeList" name="userScopeList">
          <promotion-user-scope-checkbox
            v-model="freePromotion.userScopeList"
            :is-show-all="true"
            :checked-all="promotionId === ''"
            name="freePromotion_userScopeList"
          />
        </el-form-item>
        <el-form-item v-show="platformId != 2" :label="$t('会员类型')" prop="memberTypes" name="memberTypes">
          <promotion-member-types-checkbox
            v-model="freePromotion.memberTypes"
            :selected.sync="memberTypesSelected"
            :checked-all="promotionId === ''"
            name="freePromotion_memberTypes"
          />
        </el-form-item>
        <el-form-item v-show="platformId != 2" :label="$t('会员等级')" prop="memberLevels" name="memberLevels">
          <promotion-member-levels-checkbox
            v-model="freePromotion.memberLevels"
            :checked-all="promotionId === ''"
            name="freePromotion_memberLevels"
            @change="handleMemberLevelsChange"
          />
        </el-form-item>
        <el-form-item :label="$t('备注')" prop="description" name="description">
          <ody-tinymce :show-upload-img="false" :height="300" v-model="freePromotion.description" :limit="1000" name="freePromotion_description" />
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
      ruleChinesePlaceholder: this.$t('请输入描述'),
      ruleEnglishPlaceholder: this.$t('请输入描述'),
      freePromotion: {
        id: this.promotionId,
        favourableMoney: null,
        favourableNum: null,
        promotionType: this.promType,
        activityChannel: 1,
        activityType: 1,
        conditionType: 1,
        participatMethod: 2,
        activityNumType: 0,
        freeShipping: 1, // 包邮方式
        activityUser: 1,
        merchantTypes: ['1', '2'],
        merchantType: '1',
        priority: 1,
        promTitle: '', // 促销活动名称
        createTime: [],
        fromDate: '',
        endDate: '',
        promotionMethod: 11, //
        newThemeNameList: [],
        themeIdList: [],
        favourableList: [
          {
            favourableCondition: '',
            favourableContent: ''
          }
        ], // 包邮设置
        ruleDesc: '', // 活动描述-中文
        ruleDescLan2: '', // 活动描述-英文
        applicablePlatformList: [], // 活动平台
        userScopeList: [], // 新老用户
        memberTypes: [], // 会员类型
        memberLevels: [], // 会员等级
        channelCodes: [], // 活动渠道
        haveThemeNameList: [],
        isSuperposition: 0,
        description: '', // 备注
        commissionId: null,
        commissionSign: null
      },
      freePromotionRules: {
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
        freeShipping: [
          { required: true, message: this.$t('请选择包邮方式'), trigger: ['change', 'blur'] }
        ],
        conditionType: [
          { required: true, message: this.$t('请选择包邮设置'), trigger: ['change', 'blur'] }
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
    'freePromotion.memberTypes': {
      handler: function(val) {
        this.$nextTick(() => {
          if (this.memberTypesSelected.length > 0) {
            this.freePromotion.memberLevels = this.memberTypesSelected.reduce((rtv, item) => {
              rtv = [...rtv, ...item.memberLevelList.map(x => x.levelCode)]
              return rtv
            }, [])
          }

          if (val && val.length <= 0) {
            this.freePromotion.memberLevels = []
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
  },
  methods: {
    buildFrontPromDesc() {
      var params = {
        conditionType: this.freePromotion.conditionType,
        isSuperposition: this.freePromotion.isSuperposition,
        promotionMethod: this.freePromotion.promotionMethod,
        promotionType: this.promType,
        giftLimit4Multy: (this.freePromotion.giftLimit4Multy + '').replace(/\D/g, '')
      }
      // debugger
      if (params.conditionType === 1) {
        params.favourableList = [{
          favourableCondition: this.freePromotion.favourableMoney && !isNaN(this.freePromotion.favourableMoney) ? this.freePromotion.favourableMoney * 100 : null
        }]
      } else if (params.conditionType === 2) {
        params.favourableList = [{
          favourableCondition: this.freePromotion.favourableNum && !isNaN(this.freePromotion.favourableNum) ? this.freePromotion.favourableNum : null
        }]
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
      const beforeIndex = this.freePromotion.memberTypes.indexOf(type)
      const beforeTypeIndex = this.memberTypesSelected.findIndex((item) => {
        return item.value === type
      })
      if (isChecked) {
        if (beforeIndex === -1) {
          this.freePromotion.memberTypes.push(type)
          this.memberTypesSelected = []
        }
      } else {
        if (beforeIndex >= 0) {
          this.freePromotion.memberTypes.splice(beforeIndex, 1)
          this.memberTypesSelected.splice(beforeTypeIndex, 1)
        }
      }
    },
    async queryPromotionActivityDetail() {
      if (this.freePromotion.id === '') {
        return
      }

      const { data = {}, data: { fromDate = '', endDate = '' }, code } = await this.promotionAPI.getPromotionDetailUrl(this.freePromotion)
      if (code === '0') {
        this.freePromotion = data
        this.freePromotion.description = this.freePromotion.description.replace(/<(?!img).*?>/g, '')
        this.$set(this.freePromotion, 'createTime', [fromDate, endDate])
        this.freePromotion.freeShipping = data.freeShipping

        this.freePromotion.conditionType = +data.conditionType || 2
        const [{ favourableCondition }] = this.freePromotion.favourableList

        if (this.freePromotion.conditionType === 1) {
          this.$set(this.freePromotion, 'favourableMoney', favourableCondition / 100)
        } else if (this.freePromotion.conditionType === 2) {
          this.$set(this.freePromotion, 'favourableNum', favourableCondition)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
