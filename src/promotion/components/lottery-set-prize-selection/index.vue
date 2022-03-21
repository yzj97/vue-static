<template>
  <div class="cp-lottery-set-prize-selection">
    <el-form
      :ref="'ruleInstObj'+ index"
      :model="value"
      :rules="rules"
      label-width="100px"
      class="form">
      <!-- awardsLevel : 1等奖 是 1 -->
      <el-form-item
        :label="$t('奖项等级')"
        class="prize-select"
        prop="awardsLevel"
        name="awardsLevel"
      >
        <ody-select2
          v-model="value.awardsLevel"
          :placeholder="$t('请选择')"
          :disabled="interveneLottery"
          name="value_awardsLevel"
          list-key="awardsLevelType"
          @change="handleAwardsLevelChange"
        />
      </el-form-item>
      <!-- awardsCategory 谢谢参与是0，从商品1，以此+1 -->
      <!-- {{ value.awardsCategory }} -->
      <el-form-item
        :label="$t('奖品类别')"
        class="prize-select"
        prop="awardsCategory"
        name="awardsCategory"
      >
        <ody-select2
          v-model="value.awardsCategory"
          :clearable="false"
          :placeholder="$t('请选择')"
          :disabled="interveneLottery"
          name="value_awardsCategory"
          list-key="prizeTypeList"
          @change="handleAwardsCategoryChange"
        />
      </el-form-item>
      <el-form-item
        v-if="value.awardsCategory === 1"
        :label="$t('添加商品')"
        class="prize-select" >
        <el-button
          :disabled="interveneLottery"
          name="visible"
          type="default"
          size="small"
          @click="promotionGoodsDialog.visible=true">{{ $t('添加商品') }}</el-button>
          <!-- <div v-if="promotionGoodsDialog.selected.length === 0" class="requiredText">{{$t('请选择商品')}}</div> -->
      </el-form-item>

      <!-- 积分 -->
      <el-form-item
        v-if="value.awardsCategory === 2"
        :label="$t('积分')"
        prop="awardsRefNum"
        name="awardsRefNum"
        class="prize-select"
      >
        <el-input
          v-model="value.awardsRefNum"
          :placeholder="$t('抽中后获得的积分数量')"
          :disabled="interveneLottery"
          name="value_awardsRefNum"/>
      </el-form-item>
      <!-- 优惠券 -->
      <el-form-item
        v-if="value.awardsCategory === 3"
        :label="$t('优惠券')"
        class="prize-select"
      >
        <el-button
          :disabled="interveneLottery"
          name="visible9"
          type="default"
          size="small"
          @click="giftCouponChoose.visible=true">{{ $t('添加优惠券') }}</el-button>
      </el-form-item>
      <!-- <div v-if="value.awardsRefName.length === 0" class="requiredText">{{$t('请添加优惠劵')}}</div> -->
      <!-- 线下奖品 -->
      <el-form-item
        v-if="value.awardsCategory > 0"
        :label="$t('奖品名称')"
        class="prize-select"
        prop="awardsRefName"
        name="awardsRefName"
      >
        <el-input
          v-model="value.awardsRefName"
          :disabled="interveneLottery"
          maxlength="6"
          name="value_awardsRefName"
        />
      </el-form-item>
      <el-form-item
        v-if="value.awardsCategory > 0"
        :label="$t('奖品数量')"
        class="prize-select"
        maxlength="9"
        prop="winningNum"
        name="winningNum"
      >
        <el-input
          v-model="value.winningNum"
          name="value_winningNum"
          @click="visible=true"/>
      </el-form-item>
      <!-- 中奖率 -->
      <el-form-item
        :label="$t('中奖率')"
        prop="winningRate"
        name="winningRate"
        class="prize-select winning-rate"
      >
        <el-input
          v-model="value.winningRate"
          name="value_winningRate">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
    </el-form>

    <promotion-goods-dialog-choose
      v-if="promotionGoodsDialog.visible"
      :visible.sync="promotionGoodsDialog.visible"
      :selected.sync="promotionGoodsDialog.selected"
      :multiple="false"
      :params="promotionGoodsDialog.params"
      :prom-type="promType"
      choose-key="mpId"
      @cancel="promotionGoodsDialog.visible = false"
      @ok="handlePromotionGoodsDialogOk" />

    <promotion-coupon-choose
      v-if="giftCouponChoose.visible"
      :visible.sync="giftCouponChoose.visible"
      :multiple="false"
      :params="giftCouponChoose.params"
      choose-key="id"
      @cancel="giftCouponChoose.visible = fasle"
      @ok="handleGiftCouponChooseOk"
    />
  </div>
</template>
<script>
import PromotionGoodsDialogChoose from '@/components/promotion-goods-dialog-choose'
import PromotionCouponChoose from '@/components/promotion-coupon-choose'
// import constants from '@/utils/constants'
export default {
  name: 'PromotionListByType',
  components: {
    PromotionGoodsDialogChoose,
    PromotionCouponChoose
  },
  props: {
    index: {
      type: Number,
      default: 1
    },
    value: {
      type: Object,
      default: () => {}
    },
    promType: {
      type: String,
      default: ''
    },
    promotionId: {
      type: String,
      default: ''
    },
    arrType: {
      type: String,
      default: '1'
    },
    canSave: {
      type: Boolean,
      default: false
    },
    lotteryAwardsIcon: {
      type: Array,
      default: () => []
    },
    interveneLottery: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      promotionGoodsDialog: {
        visible: false,
        selected: [],
        params: {
          merchantType: 1,
          promType: 5001,
          promotionId: this.promotionId,
          searchType: 1,
          sellType: 1,
          storeIds: [],
          categoryType: '1',
          brandType: '1'
        }
      },
      giftCouponChoose: {
        visible: false,
        selected: [],
        params: {
          promotionId: this.promotionId
        }
      },
      showPrizeName: false,
      prizeResult1: {},
      multiple: false,
      tabName: 1,
      ruleInstObj: {
        awardsName: '',
        awardsLevel: '', // 等级，从1开始
        awardsCategory: '', // 商品1，积分2， 优惠券3，线下奖品4， 谢谢惠顾 0
        awardsRefNum: null, // 积分
        awardsRefName: '', // 奖品名称
        winningNum: null, // 奖品数量
        winningRate: '' // 中奖率
      },
      rules: {
        awardsRefNum: [
          { required: true, message: this.$t('积分数不能为空'), trigger: ['change', 'blur'] }
        ],
        awardsLevel: [
          { required: true, message: this.$t('请选择奖项等级'), trigger: ['change', 'blur'] }
        ],
        awardsCategory: [
          { required: true, message: this.$t('请选择奖品类别'), trigger: ['change', 'blur'] }
        ],
        awardsRefName: [
          { required: true, message: this.$t('请输入奖品名称'), trigger: ['change', 'blur'] }
        ],
        winningNum: [
          { required: true, message: this.$t('请输入奖品数量'), trigger: ['change', 'blur'] },
          {
            validator(rule, value, callback) {
              if (
                Number.isInteger(Number(value)) &&
                Number(value) > 0 &&
                Number(value) <= 999999999
              ) {
                callback()
              } else {
                callback(new Error('请输入正整数，最多9位'))
              }
            }
          }
        ],
        winningRate: [
          { required: true, message: this.$t('请输入中奖率'), trigger: ['change', 'blur'] },
          {
            // pattern: /^(?!0+$)(?!0*\.0*$)\d{1,2}(\.\d{1,2})?$/,
            pattern: /^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}$|^100(\.0{1,2}){0,1}$/,
            message: '中奖率不能大于100%，且最多支持两位小数',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    getLotteryAwardsIconMap() {
      return this.lotteryAwardsIcon.reduce((rtv, item) => {
        // console.log(rtv, item, 111)
        rtv[item.awardsCategory] = item
        return rtv
      }, {})
    }
  },
  watch: {
    'value.awardsRefNum'(newVal) {
      this.value.prizeContent.points.num = newVal
    },
    arrType(val) {
      this.arrType = val
      this.query()
    }
  },
  created() {
    // this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    if (this.value.awardsCategory === 1) {
      this.promotionGoodsDialog.selected = [{
        mpId: this.value.awardsRefId
      }]
    }

    this.giftCouponChoose.selected = [{
      mpId: this.value.awardsRefId
    }]
    // await this.query()
    // console.log('ruleInstObj', this.ruleInstObj)
  },
  methods: {
    handleAwardsCategoryChange() {
      const val = this.value.awardsCategory
      const { awardsPicUrl } = this.getLotteryAwardsIconMap[val]

      this.showPrizeName = val !== 0
      this.value.awardsPicUrl = awardsPicUrl
      this.value.awardsRefName = val === 0 ? '谢谢参与' : ''
    },
    handleAwardsLevelChange(val) {
      const awardsNameMap = {
        1: '一等奖',
        2: '二等奖',
        3: '三等奖',
        4: '四等奖',
        5: '五等奖',
        6: '六等奖'
      }
      this.value.awardsName = awardsNameMap[val]
    },
    async validPromise() {
      return await this.formValidate('ruleInstObj' + this.index)
    },
    async query(value) {
      if (value === '1') {
        this.$emit('update:value', this.value)
      }
    },
    // 奖品类别更改
    checkCategory(val) {
      this.value.awardsRefName = ''
    },
    handlePromotionGoodsDialogOk([{ mpId: id, mpName: name } = {}]) {
      this.promotionGoodsDialog.visible = false
      // console.log(val)
      this.value.awardsRefId = id
      this.$set(this.value, 'awardsRefName', name.substring(0, 6))
      // this.value.awardsRefName = name
      this.value.prizeContent.product = {
        id,
        name
      }
    },
    handleGiftCouponChooseOk([{ id, themeTitle: name } = {}]) {
      this.giftCouponChoose.visible = false

      this.value.awardsRefId = id
      // this.value.awardsRefName = name
      this.$set(this.value, 'awardsRefName', name.substring(0, 6))
      this.value.prizeContent.coupon = {
        id,
        name
      }
    },
    async updatedParentData() {
      this.$emit('update:value', this.value)
    }
  }
}
</script>
<style lang="scss" scoped>
.cp-lottery-set-prize-selection {
  .prize-select{
    margin-bottom: 15px;
  }
}
.requiredText {
  color: red;
}
</style>
