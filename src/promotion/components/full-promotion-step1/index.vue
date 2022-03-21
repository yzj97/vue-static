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
      </div>

      <ody-title :title="$t('活动规则')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('选品范围')" prop="selectionRange" name="selectionRange" required>
          <ody-radio2
            v-model="singlePromotion.selectionRange"
            name="singlePromotion_selectionRange"
            list-key="selectionRangeTypeList"/>
        </el-form-item>
        <el-form-item :label="$t('促销类型')" prop="promotionMethod" name="promotionMethod" required>
          <ody-radio2
            v-model="singlePromotion.promotionMethod"
            name="singlePromotion_promotionMethod"
            list-key="promotionMethodList"
            @change="handlePromotionMethodChange"
          />
        </el-form-item>
        <el-form-item :label="$t('是否叠加应用 ')" prop="isSuperposition" name="isSuperposition" class="is-superposition-radio" required>
          <el-radio-group v-model="singlePromotion.isSuperposition" name="singlePromotion_isSuperposition" @change="handleGiftRuleChange">
            <el-radio :label="0">否（超量：按最高层级享受优惠）</el-radio>
            <el-radio :disabled="singlePromotion.promotionMethod === 2" :label="1"> 是（倍量：每满一级优惠一次），上限</el-radio>
          </el-radio-group>
          <el-form-item
            :rules="+singlePromotion.isSuperposition === 0 ? [] : [
              { required: true, message: $t('倍量上限不能为空'), trigger: ['change', 'blur'] }
            ]"
            prop="giftLimit4Multy"
            name="giftLimit4Multy"
            class="gift-limit-multy">
            <ody-input-number
              v-model="singlePromotion.giftLimit4Multy"
              :min="1"
              :max="99999999"
              :disabled="singlePromotion.isSuperposition === 0 || singlePromotion.promotionMethod === 2"
              maxlength="8"
              name="singlePromotion_giftLimit4Multy"
              style="width: 180px;"
              class="gift-limit-multy">
              <template slot="append">{{ $t('次') }}</template>
            </ody-input-number>
          </el-form-item>
        </el-form-item>
        <el-form-item :label="$t('优惠设置')" prop="favourableList" name="favourableList" required>
          <promotion-preferential-setting-table
            ref="promotionPreferentialSettingTable"
            v-model="singlePromotion.favourableList"
            :is-superposition="singlePromotion.isSuperposition"
            :promotion-method="singlePromotion.promotionMethod"
            :prom-type="promType"
            name="singlePromotion_favourableList"
          />
        </el-form-item>
        <el-form-item :label="$t('活动描述(中文)')" prop="ruleDesc" name="ruleDesc">
          <promotion-activity-description-input-chinese
            :rule-desc.sync="singlePromotion.ruleDesc"
            :placeholder="ruleChinesePlaceholder"
            :maxlength="100"
          />
        </el-form-item>
        <el-form-item :label="$t('活动描述(英文)')" prop="ruleDesc" name="ruleDesc">
          <promotion-activity-description-input-english
            :rule-desc-lan.sync="singlePromotion.ruleDescLan2"
            :placeholder="ruleEnglishPlaceholder"
            :maxlength="100"
          />
          <promotion-desc-modal />
        </el-form-item>
      </div>

      <ody-title :title="$t('交易规则')" />
      <div class="single-promotion-content">
        <el-form-item
          :label="$t('是否排斥优惠券')"
          prop="canUseCoupon"
          name="canUseCoupon"
          required>
          <ody-radio2
            v-model="singlePromotion.canUseCoupon"
            name="singlePromotion_canUseCoupon"
            list-key="promotionCanUseCouponList"/>
        </el-form-item>
        <el-form-item :label="$t('是否包邮')" prop="freeShipping" name="freeShipping" required>
          <ody-radio2
            v-model="singlePromotion.freeShipping"
            name="singlePromotion_freeShipping"
            list-key="promotionFreeShippingList"/>
        </el-form-item>
      </div>
      <ody-title :title="$t('参与条件')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('活动渠道')" prop="channelCodes" name="channelCodes" required>
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
        <el-form-item :label="$t('活动平台')" prop="applicablePlatformList" name="applicablePlatformList">
          <promotion-applicable-platform-checkbox
            v-model="singlePromotion.applicablePlatformList"
            :is-show-all="true"
            :checked-all="promotionId === ''"
            name="singlePromotion_applicablePlatformList"/>
        </el-form-item>
        <el-form-item :label="$t('新老用户')" prop="userScopeList" name="userScopeList">
          <promotion-user-scope-checkbox
            v-model="singlePromotion.userScopeList"
            :is-show-all="true"
            :checked-all="promotionId === ''"
            name="singlePromotion_userScopeList"/>
        </el-form-item>
        <el-form-item :label="$t('会员类型')" prop="memberTypes" name="memberTypes">
          <promotion-member-types-checkbox
            v-model="singlePromotion.memberTypes"
            :selected.sync="memberTypesSelected"
            :checked-all="promotionId === ''"
            name="singlePromotion_memberTypes" />
        </el-form-item>
        <el-form-item :label="$t('会员等级')" prop="memberLevels" name="memberLevels" >
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
import PromotionPreferentialSettingTable from '@/components/promotion-preferential-setting-table'
import PromotionDescModal from '@/components/desc-modal'
import util from '@/utils/util'

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
      singlePromotion: {
        id: this.promotionId,
        promotionType: this.promType,
        activityChannel: 1,
        participatMethod: 2,
        activityNumType: 0,
        activityUser: 1,
        priority: 1,
        selectionRange: 2, // 选品范围
        promTitle: '', // 促销活动名称
        favourableList: [
          {
            favourableCondition: '',
            favourableContent: ''
          }
        ],
        createTime: [],
        fromDate: '',
        endDate: '',
        promotionMethod: 3, // 促销类型
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
        giftLimit4Multy: '', // 次
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
    },
    'singlePromotion': {
      handler(newValue, oldValue) {
        if (newValue.promotionMethod !== oldValue.isSuperposition ||
        newValue.giftLimit4Multy !== oldValue.giftLimit4Multy ||
        JSON.stringify(newValue.favourableList) !== JSON.stringify(oldValue.favourableList)) {
          this.buildFrontPromDesc()
        }
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
    } else {
      this.buildFrontPromDesc()
    }
  },
  methods: {
    handlePromotionMethodChange() {
      if (this.singlePromotion.promotionMethod === 2) {
        this.singlePromotion.isSuperposition = 0
        this.singlePromotion.favourableList = [{}]
        this.singlePromotion.giftLimit4Multy = ''
      }
    },
    handleGiftRuleChange(val) {
      this.singlePromotion.favourableList = [{}]
      this.singlePromotion.isSuperposition = val
      this.singlePromotion.giftLimit4Multy = ''
    },
    buildFrontPromDesc() {
      var params = {
        conditionType: 1,
        favourableList: this.singlePromotion.favourableList,
        isSuperposition: this.singlePromotion.isSuperposition,
        promotionMethod: this.singlePromotion.promotionMethod,
        promotionType: this.promType,
        giftLimit4Multy: (this.singlePromotion.giftLimit4Multy + '').replace(/\D/g, '')
      }
      params = this.$portal.deepClone(params)
      params.favourableList = util.setFavourableList(this.singlePromotion, params.favourableList)

      // 兼容处理下，favourableList 为空转成0提交

      this.$promotion.$api.promotion.buildFrontPromDesc(params).then(res => {
        this.ruleChinesePlaceholder = res.data[0].desc
        this.ruleEnglishPlaceholder = res.data[1].desc
      })
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
        // if (data.promotionType === 2) {
        //   const listData = data.favourableList || []
        //   this.singlePromotion.favourableList = this.$portal.deepClone(listData)
        //   listData.forEach(f => {
        //     f.favourableCondition = f.favourableCondition / 100
        //     f.favourableContent = f.favourableContent / 100
        //     delete f.id
        //     delete f.promotionRuleId
        //     delete f.favourableContentLimit
        //     delete f.conditionValueUnit
        //   })
        // }
        this.singlePromotion = data
        this.singlePromotion.favourableList = util.getFavourableList(this.singlePromotion)
        this.$set(this.singlePromotion, 'createTime', [fromDate, endDate])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.is-superposition-radio {
  /deep/ {
    .el-radio {
      display: block;
      margin-bottom: 10px;
    }
    .el-form-item__error {
        width: 100px;
      }
  }
  .gift-limit-box {
    /deep/ {
      .el-input-group__append {
        width: 88px;
      }
    }
  }
  .gift-limit-multy {
    font-size: 14px;
    width: 80px;
    display: inline-block;
    line-height: 32px;
    /deep/ {
      .el-form .el-form-item__error {
        width: 100px;
      }
    }
  }
}
</style>
