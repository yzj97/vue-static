<template>
  <div class="pg-spike-activity-promotion">
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
            :placeholder="$t('限制在64个字符以内')"
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
        <el-form-item :label="$t('每日时间段')" prop="activityScheduleList" name="activityScheduleList" required>
          <promotion-spike-timeSchedule
            v-if="singlePromotion.activityScheduleList"
            v-model="singlePromotion.activityScheduleList"
            :activity-schedule-list="singlePromotion.activityScheduleList"
            name="singlePromotion_activityScheduleList"
            @timeScheduleList="getTimeScheduleList"
          />
        </el-form-item>
        <el-form-item :label="$t('活动描述(中文)')" prop="ruleDesc" name="ruleDesc">
          <promotion-activity-description-input-chinese
            :rule-desc.sync="singlePromotion.ruleDesc"
            :maxlength="100"
          />
        </el-form-item>
        <el-form-item :label="$t('活动描述(英文)')" prop="ruleDesc" name="ruleDesc">
          <promotion-activity-description-input-english
            :rule-desc-lan.sync="singlePromotion.ruleDescLan2"
            :maxlength="100"
          />
          <promotion-desc-modal />
        </el-form-item>
        <el-form-item
          :label="$t('预热时间')">
          <el-checkbox v-model="singlePromotion.checked" name="checked" @change="changeSchPreheatingTime">
            <span>{{ $t('开启活动预热') }}</span>
          </el-checkbox>
          <el-form-item
            v-if="singlePromotion.checked"
            :rules="[
              { required: singlePromotion.checked, message: '开启活动预热后预热时间不能为空', trigger: 'blur' }
            ]"
            prop="schPreheatingTime"
            name="schPreheatingTime"
            style="display: inline-block; width: 200px;"
          >
            <ody-input-number
              v-model="singlePromotion.schPreheatingTime"
              :precision="0"
              :min="1"
              :max="240"
              :controls="false"
              name="singlePromotion_schPreheatingTime"
              class="input-time"/>
            <span>{{ $t('小时') }}</span>
          </el-form-item>
          <div style="margin-top: 5px;">
            <span class="tip">
              {{ $t('提示：') }}{{ $t('活动开始前会在商品详情页展示活动信息。') }}
              <span
                name="handleLookExample"
                class="example"
                @click="handleLookExample"
              >{{ $t('查看示例') }}</span>
            </span>
          </div>
          <ody-dialog
            :title="$t('示例')"
            :visible.sync="dialogVisible"
            class="example-dialog"
            width="600px">
            <img src="./images/seckillRule.png" alt >
          </ody-dialog>
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
        <el-form-item :label="$t('超限规则')" prop="overlimitType" name="overlimitType" required>
          <promotion-over-limit-radio
            v-model="singlePromotion.overlimitType"
            name="singlePromotion_overlimitType"
          />
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
          <!-- required -->
          <promotion-member-types-checkbox
            v-model="singlePromotion.memberTypes"
            :selected.sync="memberTypesSelected"
            :checked-all="promotionId === ''"
            name="singlePromotion_memberTypes" />
        </el-form-item>
        <el-form-item :label="$t('会员等级')" prop="memberLevels" name="memberLevels" >
          <!-- required -->
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
import PromotionSpikeTimeSchedule from '@/components/promotion-spike-timeSchedule'
import PromotionOverLimitRadio from '@/components/promotion-over-limit-radio'
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
    PromotionSpikeTimeSchedule,
    PromotionOverLimitRadio
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
      dialogVisible: false,
      singlePromotion: {
        checked: false,
        activityScheduleList: [],
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
            favourableContent: '',
            conditionValueUnit: '',
            favourableContentLimit: ''
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
        ],
        activityScheduleList: [
          { required: true, validator: this.validatePass, trigger: ['change', 'blur'] }
        ]
        // memberLevels: [
        //   { required: true, message: this.$t('请选择会员等级'), trigger: ['change', 'blur'] }
        // ]
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
    }
  },
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    if (this.promotionId !== '') {
      await this.queryPromotionActivityDetail()
    }
  },
  methods: {
    validatePass(rule, value, callback) {
      const requiredFlag = value && value.length
      if (!requiredFlag) {
        callback(this.$t('请选择每日时间段'))
      } else {
        let maxFlag = true
        let length = value.length
        //  先对value 转成时间戳 再进行排序
        const newValue = this.$portal.deepClone(value)
        newValue.map(item => {
          item.startTime = this.$moment(item.startTime, 'HH:mm:ss') * 1
          item.endTime = this.$moment(item.endTime, 'HH:mm:ss') * 1
        })
        newValue.sort((a, b) => {
          return a.startTime - b.startTime
        })
        while (length > 1) {
          length--

          const endTime = newValue[length - 1]['endTime']
          const startTime = newValue[length]['startTime']

          if (startTime < endTime) {
            maxFlag = false
          }
          if (!maxFlag) {
            break
          }
        }
        if (maxFlag) {
          callback()
        } else {
          callback(this.$t('时间范围不能交叉'))
        }
      }
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
    getTimeScheduleList(val) {
      this.singlePromotion.activityScheduleList = val
    },
    handleLookExample() {
      this.dialogVisible = true
    },
    changeSchPreheatingTime(checked) {
      if (!checked) {
        this.singlePromotion.schPreheatingTime = null
      }
    },
    async queryPromotionActivityDetail() {
      if (this.singlePromotion.id === '') {
        return
      }

      const { data = {}, data: { fromDate = '', endDate = '' }, code } = await this.promotionAPI.getPromotionDetailUrl(this.singlePromotion)
      if (code === '0') {
        data.schPreheatingTime = data.schPreheatingTime != null ? Number.parseFloat(data.schPreheatingTime) : null
        data.checked = data.schPreheatingTime != null
        this.singlePromotion = data
        if (data.activityScheduleList.length > 0) {
          this.singlePromotion.activityScheduleList = data.activityScheduleList
        }
        this.$set(this.singlePromotion, 'createTime', [fromDate, endDate])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pg-spike-activity-promotion {
  .tip {
    display: inline-block;
    height: 32px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(69, 90, 100, 1);
    line-height: 16px;

    .example {
      color: #1890ff;
      cursor: pointer;
    }
  }

  .input-time {
    width: 100px;
  }

  .example-dialog {
    img {
      display: inline-block;
      width: 100%;
    }
  }
}

</style>
