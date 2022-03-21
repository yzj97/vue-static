<template>
  <div>
    <el-form
      ref="singlePromotion"
      :model="singlePromotion"
      :rules="singlePromotionRules"
      label-width="240px"
      class="form"
    >
      <ody-title :title="$t('基础信息设置')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('活动名称')" prop="name" name="name">
          <el-input
            v-model="singlePromotion.name"
            :placeholder="$t('限制在64个字符以内')"
            name="singlePromotion_name"
            maxlength="64"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="$t('活动时间')" prop="createTime" name="createTime">
          <el-date-picker
            v-model="singlePromotion.createTime"
            name="singlePromotion_createTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="-"
          />
        </el-form-item>
        <el-form-item :label="$t('活动渠道')" prop="channelCodes" name="channelCodes" required>
          <promotion-channel-code-checkbox
            v-model="singlePromotion.channelCodes"
            :is-show-all="true"
            :checked-all="promotionId === ''"
            :prom-type="promType"
            name="singlePromotion_channelCodes"
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

        <el-form-item :label="$t('发放对象')">
          <div class="sendObject">
            <el-form-item
              :label="$t('新老用户')"
              style="margin-bottom: 16px;"
              prop="sendObject.userScopes"
              name="sendObject.userScopes">
              <promotion-user-scope-checkbox
                v-model="singlePromotion.sendObject.userScopes"
                :is-show-all="true"
                :checked-all="promotionId === ''"
                name="singlePromotion_sendObject_userScopes"
              />
            </el-form-item>
            <el-form-item
              :label="$t('会员类型')"
              style="margin-bottom: 16px;"
              prop="sendObject.memberTypes"
              name="sendObject.memberTypes">
              <promotion-member-types-checkbox
                v-model="singlePromotion.sendObject.memberTypes"
                :selected.sync="memberTypesSelected"
                :checked-all="promotionId === ''"
                name="singlePromotion_sendObject_memberTypes"
              />
            </el-form-item>
            <el-form-item
              :label="$t('会员等级')"
              style="margin-bottom: 16px;"
              prop="sendObject.memberLevels"
              name="sendObject.memberLevels" >
              <promotion-member-levels-checkbox
                v-model="singlePromotion.sendObject.memberLevels"
                :checked-all="promotionId === ''"
                name="singlePromotion_sendObject_memberLevels"
                @change="handleMemberLevelsChange"
              />
            </el-form-item>
          </div>
        </el-form-item>

        <el-form-item :label="$t('使用对象')">
          <div class="sendObject">
            <el-form-item
              :label="$t('新老用户')"
              style="margin-bottom: 16px;"
              prop="useObject.userScopes"
              name="useObject.userScopes">
              <promotion-user-scope-checkbox
                v-model="singlePromotion.useObject.userScopes"
                :is-show-all="true"
                :checked-all="promotionId === ''"
                name="singlePromotion_useObject_userScopes"
              />
            </el-form-item>
            <el-form-item
              :label="$t('会员类型')"
              style="margin-bottom: 16px;"
              prop="useObject.memberTypes"
              name="useObject.memberTypes">
              <promotion-member-types-checkbox
                v-model="singlePromotion.useObject.memberTypes"
                :selected.sync="memberTypesSelected2"
                :checked-all="promotionId === ''"
                name="singlePromotion_useObject_memberTypes"
              />
            </el-form-item>
            <el-form-item
              :label="$t('会员等级')"
              style="margin-bottom: 16px;"
              prop="useObject.memberLevels"
              name="useObject.memberLevels">
              <promotion-member-levels-checkbox
                v-model="singlePromotion.useObject.memberLevels"
                :checked-all="promotionId === ''"
                name="singlePromotion_useObject_memberLevels"
                @change="handleMemberLevelsChangeUse"
              />
            </el-form-item>
          </div>

        </el-form-item>

        <el-form-item
          :label="$t('是否排斥优惠券')"
          prop="shareWithCoupon"
          name="shareWithCoupon"
          required
        >
          <ody-radio2
            v-model="singlePromotion.shareWithCoupon"
            name="singlePromotion_shareWithCoupon"
            list-key="excludeCoupons"
          />
        </el-form-item>
        <el-form-item
          :label="$t('是否排斥促销活动')"
          prop="shareWithPromotion"
          name="shareWithPromotion"
          required
        >
          <ody-radio2
            v-model="singlePromotion.shareWithPromotion"
            name="singlePromotion_shareWithPromotion"
            list-key="excludePromotionActivities"
          />
        </el-form-item>
        <el-form-item
          :label="$t('推荐码优惠')"
          prop="contentType"
          name="contentType"
          required
        >
          <promotion-recommend-discount-radio
            v-model="singlePromotion.contentType"
            :recommend-list.sync="recommendList"
            name="singlePromotion_contentType"
          />
        </el-form-item>

        <el-form-item
          :label="$t('每个推荐码使用限制')"
          prop="totalLimit"
          name="totalLimit"
          class="useLimit"
          required
        >
          <div class="limit">
            <span>
              <span>{{ $t('总次数限制') }}</span>
              <ody-input-number
                v-model="singlePromotion.totalLimit"
                :empty-tip="false"
                name="singlePromotion_totalLimit"
                class="gift-limit-multy" />
              <span>{{ $t('次') }}</span>
            </span>
            <span class="limitID">
              <span>每个ID次数限制</span>
              <ody-input-number
                v-model="singlePromotion.individualLimit"
                :empty-tip="false"
                name="singlePromotion_individualLimit"
                class="gift-limit-multy" />
              <span>{{ $t('次') }}</span>
            </span>
          </div>
        </el-form-item>
      </div>

      <ody-title :title="$t('返利规则设置')" />
      <el-form-item
        :label="$t('返利类型')"
        prop="rebateType"
        name="rebateType"
        required
      >
        <ody-radio2
          v-model="singlePromotion.rebateType"
          name="singlePromotion_rebateType"
          list-key="rebateTypeList"
        />
      </el-form-item>
      <el-form-item
        :label="$t('设置返利值')"
        prop="rebateModel"
        name="rebateModel"
        class="returnMoney"
        required
      >
        <ody-radio2
          v-model="singlePromotion.rebateModel"
          name="singlePromotion_rebateModel"
          list-key="setRebateValue"
          @change="singlePromotion.rebateValue = ''"
        >
          <span slot="1">
            <el-form-item
              v-show="+singlePromotion.rebateModel === 1"
              :rules="[
                { required: true, message: $t('请设置返利值'), trigger: ['blur', 'change'] }
              ]"
              prop="rebateValue"
              class="limit-item">
              <ody-input-number :decimal="2" :min="0.01" :max="9999999.99" v-model="singlePromotion.rebateValue" name="singlePromotion_rebateValue" size="mini" />
              <span>%，</span>
            </el-form-item>
            <el-form-item v-show="+singlePromotion.rebateModel === 2" class="limit-item">
              <el-input :disabled="true" size="mini"/>
              <span>%，</span>
            </el-form-item>
          </span>
          <span slot="2">
            <el-form-item
              v-show="+singlePromotion.rebateModel ===2"
              :rules="[
                { required: true, message: $t('请设置返利值'), trigger: ['blur', 'change'] }
              ]"
              prop="rebateValue"
              class="limit-item">
              <ody-input-number
                :decimal="2"
                :min="0.01"
                :max="9999999.99"
                v-model="singlePromotion.rebateValue"
                name="singlePromotion_rebateValue5"
                size="mini"/>
            </el-form-item>
            <el-form-item v-show="+singlePromotion.rebateModel === 1" class="limit-item">
              <el-input :disabled="true" size="mini"/>
            </el-form-item>
          </span>
        </ody-radio2>
      </el-form-item>
      <el-form-item
        :label="$t('使用规则(中文):')"
        prop="useRule"
        name="useRule"
        required
      >
        <el-input v-model="singlePromotion.useRule" :placeholder="$t('请输入描述，最多输入150个字')" name="singlePromotion_useRule" type="textarea" maxlength="150"/>
      </el-form-item>
      <el-form-item
        :label="$t('使用规则(英文):')"
        prop="useRuleLan2"
        name="useRuleLan2"
        required
      >
        <el-input v-model="singlePromotion.useRuleLan2" :placeholder="$t('请输入描述，最多输入150个字')" name="singlePromotion_useRuleLan2" type="textarea" maxlength="150"/>
      </el-form-item>
      <el-form-item
        :label="$t('分享标题:')"
        prop="shareVO"
        name="shareVO"
      >
        <el-input v-model="singlePromotion.shareVO.shareTitle" :placeholder="$t('请输入分享标题')" name="singlePromotion_shareVO_shareTitle" maxlength="30"/>
      </el-form-item>
      <el-form-item
        :label="$t('分享描述:')"
        prop="shareVO"
        name="shareVO"
      >
        <el-input v-model="singlePromotion.shareVO.shareDesc" :placeholder="$t('请输入分享描述')" name="singlePromotion_shareVO_shareDesc" maxlength="50"/>
      </el-form-item>
      <el-form-item
        :label="$t('分享图片:')"
      >
        <ody-upload-image
          v-model="singlePromotion.shareVO.shareImgUrl"
          :pic-type="picType"
          :show-tip="false"
          :url="url"
          :label="$t('上传图片')"
          name="singlePromotion_shareVO_shareImgUrl"
        />
      </el-form-item>
      <el-form-item>
        <div>
          <span>建议尺寸100*100，仅限jpg、png格式，小于3M；</span>
          <el-link name="checkImg" type="primary" @click="checkImg">{{ $t('点击查看系统默认图') }}</el-link>
        </div>
      </el-form-item>
      <div class="single-promotion-content"/>
      <div class="single-promotion-content"/>
    </el-form>
    <ody-dialog
      :title="$t('系统默认图')"
      :visible.sync="dialogVisible"
      class="example-dialog"
      width="600px"
    >
      <img :src="imgUrl" alt >
    </ody-dialog>
  </div>
</template>

<script>
import PromotionRecommendDiscountRadio from '@/components/promotion-recommend-discount-radio'
import PromotionTypeRadio from '@/components/promotion-type-radio'
import PromotionOverLimitRadio from '@/components/promotion-over-limit-radio'
import PromotionChannelCodeCheckbox from '@/components/promotion-channel-code-checkbox'
import PromotionApplicablePlatformCheckbox from '@/components/promotion-applicable-platform-checkbox'
import PromotionUserScopeCheckbox from '@/components/promotion-user-scope-checkbox'
import PromotionMemberTypesCheckbox from '@/components/promotion-member-types-checkbox'
import PromotionMemberLevelsCheckbox from '@/components/promotion-member-levels-checkbox'

export default {
  components: {
    PromotionRecommendDiscountRadio,
    PromotionTypeRadio,
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
      dialogVisible: false,
      imgUrl: '',
      fileUrl: '',
      url: 'back-promotion-web/file/uploadImg.do',
      picType: ['png', 'jpg'],
      singlePromotion: {
        id: this.promotionId,
        frontPromotionType: this.promType, // 推荐码id
        canRebate: 1, // 是否支持返利
        totalLimit: '', // 每个推荐码使用限制- 总次数限制
        individualLimit: '', // 每个推荐码使用限制- 每ID次数限制
        shareVO: {
          shareImgUrl: '', // 分享的图片
          shareTitle: '', // 分享标题
          shareDesc: '' // 分享内容
        }, // 分享内容
        conditionValue: '', // 推荐码优惠 --订单金额满多少元
        contentValue: '', // 推荐码优惠 --订单金额满多少元-减多少元  或者折扣打几折
        discountLimit: '', // 折扣上限
        conditionType: 1, // 默认1
        contentType: 1, //  推荐码优惠-1：订单金额满多少减多少   2：订单金额满多少打折:
        rebateValue: '', // 设置返利值 --订单实付商品金额百分比  --固定值
        rebateType: 1, // 返利类型：佣金 默认都是1
        activityObjects: [], // 存放发放对象objectType:1   和   使用对象objectType:2
        shareWithCoupon: 0, // 是否排斥优惠券   1：否  0：是    默认是0
        shareWithPromotion: 1, // 是否排斥促销活动   1：否  0：是   默认是1
        rebateModel: 1, // 设置返利值  1：订单实付商品金额百分比    2：或者固定值多少元
        name: '', // 活动名称
        createTime: [], // 活动开始时间
        startTime: '', // 活动开始时间
        endTime: '', // 活动结束时间
        useRule: '', // 活动描述-中文
        useRuleLan2: '', // 活动描述-英文
        channelCodes: [], // 活动渠道
        // 发放对象
        sendObject: {
          userScopes: [], // 新老用户
          memberTypes: [], // 会员类型
          memberLevels: [], // 会员等级
          objectType: 1
        },
        // 使用对象
        useObject: {
          userScopes: [], // 新老用户
          memberTypes: [], // 会员类型
          memberLevels: [], // 会员等级
          objectType: 2
        }
      },
      // 优惠码推荐
      recommendList: {
        conditionValue1: '',
        conditionValue2: '',
        contentValue1: '',
        contentValue2: '',
        discountLimit: ''
      },
      singlePromotionRules: {
        name: [
          { required: true, message: this.$t('请输入促销活动名称'), trigger: ['change', 'blur'] },
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
        useRule: [
          { required: true, message: this.$t('请输入中文使用规则'), trigger: ['change', 'blur'] }
        ],
        useRuleLan2: [
          { required: true, message: this.$t('请输入英文使用规则'), trigger: ['change', 'blur'] }
        ],
        'sendObject.userScopes': [
          { type: 'array', required: true, message: this.$t('发放对象新老用户必须选择'), trigger: 'change' }
        ],
        'sendObject.memberTypes': [
          { type: 'array', required: true, message: this.$t('发放对象会员类型必须选择'), trigger: 'change' }
        ],
        'sendObject.memberLevels': [
          { type: 'array', required: true, message: this.$t('发放对象会员等级必须选择'), trigger: 'change' }
        ],
        'useObject.userScopes': [
          { type: 'array', required: true, message: this.$t('使用对象新老用户必须选择'), trigger: 'change' }
        ],
        'useObject.memberTypes': [
          { type: 'array', required: true, message: this.$t('使用对象会员类型必须选择'), trigger: 'change' }
        ],
        'useObject.memberLevels': [
          { type: 'array', required: true, message: this.$t('使用对象会员等级必须选择'), trigger: 'change' }
        ],
        totalLimit: [
          { required: true, validator: this.validatePassLimit, trigger: ['change', 'blur'] }
        ],
        contentType: [
          { required: true, validator: this.validateContentType, trigger: ['change', 'blur'] }
        ]

      },
      memberLevelsSelected: [],
      memberTypesSelected: [], // 发放对象
      memberTypesSelected2: [], // 使用对象
      promotionAPI: null
    }
  },
  watch: {
    'singlePromotion.sendObject.memberTypes': {
      handler: function(val) {
        this.$nextTick(() => {
          if (this.memberTypesSelected.length > 0) {
            this.singlePromotion.sendObject.memberLevels = this.memberTypesSelected.reduce((rtv, item) => {
              rtv = [...rtv, ...item.memberLevelList.map(x => x.levelCode)]
              return rtv
            }, [])
          }

          if (val && val.length <= 0) {
            this.singlePromotion.sendObject.memberLevels = []
          }
        })
      },
      deep: true
    },
    // 使用对象
    'singlePromotion.useObject.memberTypes': {
      handler: function(val) {
        this.$nextTick(() => {
          if (this.memberTypesSelected2.length > 0) {
            this.singlePromotion.useObject.memberLevels = this.memberTypesSelected2.reduce((rtv, item) => {
              rtv = [...rtv, ...item.memberLevelList.map(x => x.levelCode)]
              return rtv
            }, [])
          }

          if (val && val.length <= 0) {
            this.singlePromotion.useObject.memberLevels = []
          }
        })
      },
      deep: true
    },
    'recommendList': {
      handler: function(val) {
        if (this.singlePromotion.contentType === 1) {
          this.singlePromotion.conditionValue = val.conditionValue1
          this.singlePromotion.contentValue = val.contentValue1
        } else {
          this.singlePromotion.conditionValue = val.conditionValue2
          this.singlePromotion.contentValue = val.contentValue2
          this.singlePromotion.discountLimit = val.discountLimit
        }
      },
      deep: true,
      async: true
    }
    // 'singlePromotion.activityObjects': {
    //   handler: function(val) {
    //     this.singlePromotion.activityObjects = []
    //     this.singlePromotion.activityObjects.push(this.singlePromotion.sendObject)
    //     this.singlePromotion.activityObjects.push(this.singlePromotion.useObject)
    //     console.log('现金', this.singlePromotion.activityObjects)
    //   },
    //   deep: true
    // //   immediate: true
    // }

  },
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
    // this.promotionId = this.$route.params.promotionId
    this.promType = this.$route.params.promotionType
  },
  mounted() {
    console.log(this.promotionId)
    if (this.undefined !== 'undefined' || this.promotionId !== '') {
      this.queryReferralCodeActivityDetail()
    }
  },
  methods: {
    checkImg() {
      this.promotionAPI.loadOscConfig('DEFAULT_SHARE_PIC').then(res => {
        this.imgUrl = res.data.result
        this.dialogVisible = true
      })
    },
    validateContentType(rule, value, callback) {
      if (value === 1) {
        if (!this.recommendList.conditionValue1 || !this.recommendList.contentValue1) {
          callback(new Error('必填字段不可为空'))
        } else {
          callback()
        }
      } else {
        if (!this.recommendList.conditionValue2 || !this.recommendList.contentValue2 || !this.recommendList.discountLimit) {
          callback(new Error('必填字段不可为空'))
        } else {
          callback()
        }
      }
    },
    validatePassLimit(rule, value, callback) {
      if (value === '' || this.singlePromotion.individualLimit === '') {
        callback(new Error('个人次数限制必须小于总次数限制'))
      } else if (+this.singlePromotion.individualLimit >= +value) {
        callback(new Error('个人次数限制必须小于总次数限制'))
      } else {
        callback()
      }
    },
    // 发放对象
    handleMemberLevelsChange(type, isChecked) {
      const beforeIndex = this.singlePromotion.sendObject.memberTypes.indexOf(type)
      const beforeTypeIndex = this.memberTypesSelected.findIndex((item) => {
        return item.value === type
      })
      if (isChecked) {
        if (beforeIndex === -1) {
          this.singlePromotion.sendObject.memberTypes.push(type)
          this.memberTypesSelected = []
        }
      } else {
        if (beforeIndex >= 0) {
          this.singlePromotion.sendObject.memberTypes.splice(beforeIndex, 1)
          this.memberTypesSelected.splice(beforeTypeIndex, 1)
        }
      }
    },
    // 使用对象
    handleMemberLevelsChangeUse(type, isChecked) {
      const beforeIndex = this.singlePromotion.useObject.memberTypes.indexOf(type)
      const beforeTypeIndex = this.memberTypesSelected2.findIndex((item) => {
        return item.value === type
      })
      if (isChecked) {
        if (beforeIndex === -1) {
          this.singlePromotion.useObject.memberTypes.push(type)
          this.memberTypesSelected2 = []
        }
      } else {
        if (beforeIndex >= 0) {
          this.singlePromotion.useObject.memberTypes.splice(beforeIndex, 1)
          this.memberTypesSelected2.splice(beforeTypeIndex, 1)
        }
      }
    },
    async queryReferralCodeActivityDetail() {
      if (this.promotionId === '') {
        return
      }
      const params = {
        id: this.promotionId
      }
      const { data = {}, data: { startTime = '', endTime = '' }, code } = await this.promotionAPI.queryReferralCodeActivityDetail(params)

      if (code === '0') {
        this.singlePromotion = data
        if (+this.singlePromotion.status !== 0) {
          this.$portal.delActiveViewAndRefresh('PromPromotionRecommendationList')
          this.$message.error('非待提交状态下的活动不允许编辑基本信息')
          return
        }
        this.$set(this.singlePromotion, 'createTime', [startTime, endTime])
        this.$set(this.singlePromotion, 'sendObject', data.activityObjects[0])
        this.$set(this.singlePromotion.sendObject, 'userScopes', data.activityObjects[0].userScopes.map(item => +item))
        this.$set(this.singlePromotion, 'useObject', data.activityObjects[1])
        this.$set(this.singlePromotion.useObject, 'userScopes', data.activityObjects[1].userScopes.map(item => +item))
        if (data.contentType === 1) {
          this.recommendList.conditionValue1 = data.conditionValue
          this.recommendList.contentValue1 = data.contentValue
        } else {
          this.recommendList.conditionValue2 = data.conditionValue
          this.recommendList.contentValue2 = data.contentValue
          this.recommendList.discountLimit = data.discountLimit
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.returnMoney{
    /deep/ {
        .el-radio{
            display:flex;
            align-items:center;
        }
    }
}
.returnMoney{
    /deep/ {
        .el-radio__label{
            display:flex;
            align-items:center;
            .el-form-item--medium{
                margin-left:0.4rem;
            }
        }
    }
}
.returnMoney{
    /deep/ {
        .el-radio-group{
            display:flex;
        }
    }
}
.useLimit{
    .limitID{
        margin-left: 1rem;
    }
}
.sendObject{
    /deep/ {
        .el-form-item__label {
            width:88px !important;
        }
    }
}
.sendObject{
    /deep/ {
        .el-form-item__content {
            margin-left:15px !important;
        }
    }
}
</style>
