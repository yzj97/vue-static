<template>
  <el-form ref="paymentPreferencesMethodform" :model="form" :rules="formRules">
    <el-radio-group v-model="form.promotionMethod" name="form_promotionMethod">
      <el-radio v-for="item in typeList" :label="item.id" :key="item.id">{{ item.text }}</el-radio>
    </el-radio-group>
    <el-row v-show="form.promotionMethod === 15">
      <el-col :span="7">
        <el-form-item prop="favourableCondition" name="favourableCondition">
          <ody-input-number
            v-model="form.favourableCondition"
            :min="0.01"
            :max="9999999"
            :decimal="2"
            name="form_favourableCondition"
          >
            <template slot="prepend">{{ $t('满') }}</template>
            <template slot="append">{{ $t('元') }}</template>
          </ody-input-number>
        </el-form-item >
      </el-col>
      <el-col :span="7">
        <el-form-item prop="favourableContent" name="favourableContent">
          <ody-input-number
            :disabled="form.favourableCondition === ''"
            :key="`input-favourableContent-` + form.favourableCondition"
            v-model="form.favourableContent"
            :max="form.favourableCondition - 0.01"
            :decimal="2"
            name="form_favourableContent">
            <template slot="prepend">{{ $t('减') }}</template>
            <template slot="append">{{ $t('元') }}</template>
          </ody-input-number>
        </el-form-item >
      </el-col>
    </el-row>
    <el-row v-show="form.promotionMethod === 16" class="marL">
      <el-col :span="7">
        <el-form-item prop="discount" name="discount">
          <ody-input-number
            v-model="form.discount"
            :min="0.1"
            :max="9.9"
            :decimal="1"
            name="form_discount">
            <template slot="prepend">{{ $t('打') }}</template>
            <template slot="append">{{ $t('折') }}</template>
          </ody-input-number>
        </el-form-item >
      </el-col>
      <el-col :span="8">
        <el-form-item>
          <ody-input-number
            v-model="form.favourableContentLimit"
            :min="0.01"
            :max="9999999"
            :decimal="2"
            name="form_favourableContentLimit">
            <template slot="prepend">{{ $t('优惠上限') }}</template>
            <template slot="append">{{ $t('元') }}</template>
          </ody-input-number>
        </el-form-item >
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import constants from '@/utils/constants'
export default {
  props: {
    paymentPreferences: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data() {
    return {
      typeList: constants.paymentPreferencesMethod,
      form: {
        promotionMethod: 15, // 默认类型
        favourableCondition: '', // 满多少
        favourableContent: '', // 减多少
        discount: '', // 折扣
        favourableContentLimit: '' // 优惠上限
      },
      formRules: {
        favourableCondition: [
          { validator: this.favourableCondition, trigger: 'blur' }
        ],
        favourableContent: [
          { validator: this.favourableContent, trigger: 'blur' }
        ],
        discount: [
          { validator: this.discount, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'form.favourableCondition': {
      handler(value) {
        if (+value <= +this.form.favourableContent) {
          this.form.favourableContent = ''
        }
      }
    }
  },
  mounted() {
    this.intData()
  },
  methods: {
    intData() {
      this.form.promotionMethod = this.paymentPreferences.promotionMethod
      if (this.form.promotionMethod === 15) {
        if (this.paymentPreferences.favourableList[0].favourableCondition !== '') {
          this.form.favourableCondition = this.paymentPreferences.favourableList[0].favourableCondition / 100
        }
        if (this.paymentPreferences.favourableList[0].favourableContent !== '') {
          this.form.favourableContent = this.paymentPreferences.favourableList[0].favourableContent / 100
        }
      }
      if (this.form.promotionMethod === 16) {
        this.form.discount = this.paymentPreferences.favourableList[0].favourableContent / 10

        if (this.paymentPreferences.favourableList[0].favourableContentLimit) {
          this.form.favourableContentLimit = this.paymentPreferences.favourableList[0].favourableContentLimit / 100
        }
      }
    },
    favourableCondition(rule, value, callback) {
      if (this.form.promotionMethod === 15) {
        if (value === '') {
          callback(new Error('请输入金额'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    favourableContent(rule, value, callback) {
      if (this.form.promotionMethod === 15) {
        if (value === '') {
          callback(new Error('请输入金额'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    discount(rule, value, callback) {
      if (this.form.promotionMethod === 16) {
        if (value === '') {
          callback(new Error('请输入折扣'))
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
  margin-left: 85px;
}
</style>
