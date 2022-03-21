<template>
  <el-form ref="bargainPromotionTypeform" :model="form" :rules="formRules">
    <el-radio-group v-model="form.type" name="form_type">
      <el-radio v-for="item in typeList" :label="item.id" :key="item.id">{{ item.text }}</el-radio>
    </el-radio-group>
    <el-form-item v-show="form.type === 0" prop="firstMoney">
      <ody-input-number v-model="form.firstMoney" name="form_firstMoney"/>
      <span>{{ $t('元') }}</span>
    </el-form-item >
    <el-form-item v-show="form.type === 1" prop="count" label-width="110px">
      <el-row >
        <el-col :span="10">
          <ody-number-range
            v-model="form.count"
            :decimal="2"
            name="form_count"
            range="[0, 9999999.99]"/>
        </el-col>
        <el-col :span="4">
          <span>{{ $t('元') }}</span>
        </el-col>
      </el-row>
    </el-form-item >
    <el-form-item v-show="form.type === 2" prop="totalLimit" label-width="220px">
      <el-row >
        <el-col :span="4">
          <ody-input-number v-model="form.totalLimit" name="form_totalLimit"/>
        </el-col>
        <el-col :span="8">
          <span>次，金额随机</span>
        </el-col>
      </el-row>
    </el-form-item >
  </el-form>
</template>

<script>
import constants from '@/utils/constants'
export default {
  props: {
    bargainPromotion: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data() {
    return {
      typeList: constants.bargainPromotionType,
      form: {
        count: [],
        firstMoney: '', // 砍价方式的固定金额
        endMoney: '', // 砍价方式的随机金额最后一个值
        totalLimit: '', // 砍价方式的总限制次数
        type: 0 // 砍价方式
      },
      formRules: {
        firstMoney: [
          { validator: this.firstMoneyValidate, trigger: 'blur' }
        ],
        totalLimit: [
          { validator: this.totalLimitValidate, trigger: 'blur' }
        ],
        count: [
          { validator: this.countValidate, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'form.type': {
      handler(value) {
        this.form.count = []
        this.form.firstMoney = ''
        this.form.totalLimit = ''
      },
      sync: true
    }
  },
  mounted() {
    this.intData()
  },
  methods: {
    intData() {
      this.form.type = this.bargainPromotion.type
      if (this.form.type === 0) {
        this.form.firstMoney = this.bargainPromotion.firstMoney
      }
      if (this.form.type === 2) {
        this.form.totalLimit = this.bargainPromotion.totalLimit
      }
      if (this.form.type === 1) {
        this.form.count = [this.bargainPromotion.firstMoney, this.bargainPromotion.endMoney]
      }
    },
    firstMoneyValidate(rule, value, callback) {
      if (this.form.type === 0) {
        if (value === '') {
          callback(new Error('请输入固定金额'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    totalLimitValidate(rule, value, callback) {
      if (this.form.type === 2) {
        if (value === '') {
          callback(new Error('请输入限制次数'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    countValidate(rule, value, callback) {
      if (this.form.type === 1) {
        if (value[0] === '' || value[0] === undefined || value[1] === '' || value[1] === undefined) {
          callback(new Error('请填全随机金额'))
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

</style>
