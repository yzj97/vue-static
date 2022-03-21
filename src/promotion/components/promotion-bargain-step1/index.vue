<template>
  <div>
    <el-form
      ref="bargainPromotion"
      :model="bargainPromotion"
      :rules="bargainPromotionRules"
      label-width="240px"
      class="form"
    >
      <ody-title :title="$t('基本信息')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('砍价名称')" prop="activityTitle" name="activityTitle" required>
          <el-input
            v-model="bargainPromotion.activityTitle"
            :placeholder="$t('请输入砍价名称')"
            name="bargainPromotion_activityTitle"
            maxlength="64"
            show-word-limit
          />
        </el-form-item>
        <el-form-item :label="$t('活动时间')" prop="createTime" name="createTime">
          <el-date-picker
            v-model="bargainPromotion.createTime"
            name="bargainPromotion_createTime"
            type="datetimerange"
            range-separator="-"
          />
        </el-form-item>
      </div>

      <ody-title :title="$t('活动规则')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('砍价方式')" required="">
          <template v-if="getDetailFlag">
            <promotion-bargain-type ref="promotionBargainType" :bargain-promotion="bargainPromotion" @updatedData="updatedData"/>
          </template>

        </el-form-item>
        <el-form-item :label="$t('个人砍价限制次数')" prop="individualLimit" name="individualLimit" required>
          <ody-input-number v-model="bargainPromotion.individualLimit" :min="1" :max="999999999" name="bargainPromotion_individualLimit"/>
          <span>{{ $t('次') }}</span>
        </el-form-item>
      </div>

      <ody-title :title="$t('交易规则')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('是否包邮')" prop="freeShipping" name="freeShipping" required>
          <ody-radio2
            v-model="bargainPromotion.freeShipping"
            name="bargainPromotion_freeShipping"
            list-key="promotionFreeShippingList"
          />
        </el-form-item>
      </div>
      <ody-title :title="$t('参与条件')" />
      <div class="single-promotion-content">
        <el-form-item :label="$t('活动渠道')" prop="channelCodes" name="channelCodes" required>
          <promotion-channel-code-checkbox
            v-model="bargainPromotion.channelCodes"
            :is-show-all="true"
            :checked-all="promotionId === ''"
            :prom-type="promType"
            name="bargainPromotion_channelCodes"
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
        <el-form-item :label="$t('新老用户')" prop="userScopeList" name="userScopeList" required>
          <promotion-user-scope-checkbox
            v-model="bargainPromotion.userScopeList"
            :is-show-all="true"
            :checked-all="promotionId === ''"
            name="bargainPromotion_userScopeList"
          />
        </el-form-item>
        <el-form-item :label="$t('备注')" prop="description" name="description">
          <el-input
            v-model="bargainPromotion.description"
            :rows="4"
            :placeholder="$t('100字以内')"
            name="bargainPromotion_description"
            type="textarea"
            maxlength="100"
            show-word-limit
          />
          <!-- <ody-tinymce :show-upload-img="false" :height="300" v-model="bargainPromotion.description" :limit="1000" name="bargainPromotion_description" /> -->
        </el-form-item>
      </div>
    </el-form>

    <!-- <el-button name="handleCom" size="medium" @click="handleCom">{{ $t('确认') }}</el-button> -->
  </div>
</template>

<script>

import PromotionBargainType from '@/components/promotion-bargain-type'
import PromotionChannelCodeCheckbox from '@/components/promotion-channel-code-checkbox'
import PromotionUserScopeCheckbox from '@/components/promotion-user-scope-checkbox'

export default {
  components: {
    PromotionBargainType,
    PromotionChannelCodeCheckbox,
    PromotionUserScopeCheckbox
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
      bargainPromotion: {
        id: this.promotionId,
        activityTitle: '', // 促销活动名称

        firstMoney: '', // 砍价方式的固定金额
        endMoney: '', // 砍价方式的随机金额最后一个值
        totalLimit: '', // 砍价方式的总限制次数
        individualLimit: 1, // 个人砍价限制次数
        type: 0, // 砍价方式

        createTime: [],
        startTime: '',
        endTime: '',
        freeShipping: 0, // 是否包邮
        userScopeList: [], // 新老用户
        channelCodes: [], // 活动渠道
        description: '' // 备注
      },
      bargainPromotionRules: {
        activityTitle: [
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
        individualLimit: [
          { required: true, message: this.$t('请输入个人砍价限制次数'), trigger: ['change', 'blur'] }
        ],
        channelCodes: [
          { required: true, message: this.$t('请选择活动渠道'), trigger: ['change', 'blur'] }
        ],
        userScopeList: [
          { required: true, message: this.$t('请选择新老用户'), trigger: ['change', 'blur'] }
        ]

      },
      memberLevelsSelected: [],
      memberTypesSelected: [],
      promotionAPI: null
    }
  },
  watch: {
    'bargainPromotion.memberTypes': {
      handler: function(val) {
        this.$nextTick(() => {
          if (this.memberTypesSelected.length > 0) {
            this.bargainPromotion.memberLevels = this.memberTypesSelected.reduce((rtv, item) => {
              rtv = [...rtv, ...item.memberLevelList.map(x => x.levelCode)]
              return rtv
            }, [])
          }

          if (val && val.length <= 0) {
            this.bargainPromotion.memberLevels = []
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
    try {
      await this.queryPromotionActivityDetail()
    } catch (e) {
      console.log(e)
    } finally {
      this.getDetailFlag = true
    }
  },
  methods: {
    updatedData(obj) {
      this.bargainPromotion.firstMoney = obj.firstMoney
      this.bargainPromotion.endMoney = obj.endMoney
      this.bargainPromotion.totalLimit = obj.totalLimit
      this.bargainPromotion.type = obj.type
      if (obj.type === 1) {
        this.bargainPromotion.firstMoney = obj.count[0]
        this.bargainPromotion.endMoney = obj.count[1]
      }
    },
    handleMemberLevelsChange(type, isChecked) {
      const beforeIndex = this.bargainPromotion.memberTypes.indexOf(type)
      const beforeTypeIndex = this.memberTypesSelected.findIndex((item) => {
        return item.value === type
      })
      if (isChecked) {
        if (beforeIndex === -1) {
          this.bargainPromotion.memberTypes.push(type)
          this.memberTypesSelected = []
        }
      } else {
        if (beforeIndex >= 0) {
          this.bargainPromotion.memberTypes.splice(beforeIndex, 1)
          this.memberTypesSelected.splice(beforeTypeIndex, 1)
        }
      }
    },
    async queryPromotionActivityDetail() {
      if (this.bargainPromotion.id === '') {
        return
      }

      const { data = {}, data: { startTime = '', endTime = '' }, code } = await this.promotionAPI.queryCutPriceDetail(this.bargainPromotion.id)

      if (code === '0') {
        this.bargainPromotion = data
        this.bargainPromotion.createTime = [startTime, endTime]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
