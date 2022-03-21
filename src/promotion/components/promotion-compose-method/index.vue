<template>
  <el-form ref="composeMethodform" :model="form" :rules="formRules">
    <el-radio-group
      v-model="form.promotionMethod"
      name="form_promotionMethod"
      @change="updatedParentData"
    >
      <el-radio v-for="item in typeList" :label="item.id" :key="item.id">{{
        item.text
      }}</el-radio>
    </el-radio-group>
    <el-row v-show="form.promotionMethod === 12">
      <el-col :span="5" class="no-wrap">
        <el-form-item prop="favourableContent" name="favourableContent">
          <span>{{ $t("付") }}</span>
          <ody-input-number
            v-model="form.favourableContent"
            :min="0.01"
            :max="9999999"
            :decimal="2"
            name="form_favourableContent"
            @change="updatedParentData"
          />
          <span>{{ $t("元") }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="6" class="no-wrap">
        <el-form-item prop="favourableCondition" name="favourableCondition" class="no-wrap">
          <span>{{ $t("任选") }}</span>
          <ody-input-number
            v-model="form.favourableCondition"
            :min="1"
            name="form_favourableCondition"
            @change="updatedParentData"
          />
          <span>{{ $t("件") }}</span>
          <el-tooltip class="item" effect="dark" placement="top">
            <div slot="content">
              N元任选M件例如：99元3件，包邮。如果订单中仅购买3件符合活动商品范围的商品，该订单用户支付99元；
              <br >
              如果订单中购买4件符合活动商品范围的商品，4件中平台价最便宜的商品价格为40元，该订单用户支付99+40=139元
            </div>
            <i class="el-icon-question" />
          </el-tooltip>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-show="form.promotionMethod === 13" class="marL">
      <el-col :span="6" class="no-wrap">
        <el-form-item prop="maxItem" name="maxItem">
          <span>{{ $t("任选") }}</span>
          <ody-input-number
            v-model="form.maxItem"
            :min="2"
            name="form_maxItem"
            @change="updatedParentData"
          />
          <span>{{ $t("件") }}</span>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item prop="minItem" name="minItem">
          <span>{{ $t("付") }}</span>
          <ody-input-number
            v-model="form.minItem"
            :min="1"
            :max="form.maxItem - 1"
            name="form_minItem"
            @change="updatedParentData"
          />
          <span>{{ $t("件") }}</span>
          <el-tooltip class="item" effect="dark" placement="top">
            <div slot="content">
              任选M件付N件例如，任选3件付2件，包邮，如果订单中仅购买3件符合活动商品范围的商品，商品价格分别为70元、60元、50元，该订单用户支付130元；
              <br >如果订单中购买4件符合活动商品范围的商品，商品价格分别为70元、60元、50元，40元，4件中平台价最便宜的商品价格为40元，该订单用户支付130+40=170元
            </div>
            <i class="el-icon-question" />
          </el-tooltip>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import constants from '@/utils/constants'
export default {
  props: {
    composePromotion: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data() {
    return {
      typeList: constants.composeMethod,
      form: {
        promotionMethod: 12, // 默认类型
        favourableCondition: '', // 钱付 任选多少件
        favourableContent: '', // 多少元

        maxItem: '', // 任选多少件
        minItem: '' // 付多少件
      },
      formRules: {
        favourableCondition: [
          { validator: this.favourableCondition, trigger: 'blur' }
        ],
        favourableContent: [
          { validator: this.favourableContent, trigger: 'blur' }
        ],
        maxItem: [{ validator: this.maxItem, trigger: 'blur' }],
        minItem: [{ validator: this.minItem, trigger: 'blur' }]
      }
    }
  },
  watch: {
    'form.maxItem': {
      handler(value) {
        if (+value <= +this.form.minItem) {
          this.form.minItem = ''
        }
      }
    }
  },
  mounted() {
    this.intData()
  },
  methods: {
    intData() {
      this.form.promotionMethod = this.composePromotion.promotionMethod
      if (this.form.promotionMethod === 12) {
        if (
          this.composePromotion.favourableList[0].favourableCondition !== ''
        ) {
          this.form.favourableCondition =
            this.composePromotion.favourableList[0].favourableCondition
        }
        if (this.composePromotion.favourableList[0].favourableContent !== '') {
          this.form.favourableContent =
            this.composePromotion.favourableList[0].favourableContent / 100
        }
      }
      if (this.form.promotionMethod === 13) {
        if (this.composePromotion.favourableList[0].favourableContent) {
          this.form.minItem =
            this.composePromotion.favourableList[0].favourableContent
        }
        if (this.composePromotion.favourableList[0].favourableCondition) {
          this.form.maxItem =
            this.composePromotion.favourableList[0].favourableCondition
        }
      }
    },
    favourableCondition(rule, value, callback) {
      if (this.form.promotionMethod === 12) {
        if (value === '') {
          callback(new Error('请输入件数'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    favourableContent(rule, value, callback) {
      if (this.form.promotionMethod === 12) {
        if (value === '') {
          callback(new Error('请输入金额'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    maxItem(rule, value, callback) {
      if (this.form.promotionMethod === 13) {
        if (value === '') {
          callback(new Error('请输入件数'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    minItem(rule, value, callback) {
      if (this.form.promotionMethod === 13) {
        if (value === '') {
          callback(new Error('请输入件数'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    updatedParentData() {
      this.$emit('updatedData', this.form)
    }
  }
}
</script>

<style lang="scss" scoped>
.marL {
  margin-left: 130px;
}
.no-wrap {
  display: flex;
  flex-wrap: no-wrap;
  align-items: center;
  min-width: 320px;
}
/deep/ .el-form-item__content {
  display: flex;
  align-items: center;
}
</style>
