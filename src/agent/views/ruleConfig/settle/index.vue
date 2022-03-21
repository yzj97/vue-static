<template>
  <section>
    <el-form ref="form" :model="formData" :rules="rules" :inline="true">
      <h3>{{ $t('佣金结算') }}</h3>
      <el-row>
        <el-col :span="labelColSpan" class="form-label">
          <el-form-item>
            <ody-tip-star :content="$t('提现方式') + ':'"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="cashType">
            <el-checkbox-group v-model="formData.cashType" name="formData_cashType">
              <el-checkbox v-for="(value, key) in cashTypeList" :key="key" :label="parseInt(key)">{{ value }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="labelColSpan" class="form-label">
          <el-form-item>
            <ody-tip-star :content="$t('单笔提现金额') + ':'"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="singleCashLimitStart">
            {{ $t('不低于') }}
            <ody-input-number :controls="false" :decimal="2" :min="1" :max="maxAmount" v-model="formData.singleCashLimitStart" name="formData_singleCashLimitStart"/>
          </el-form-item>
          <el-form-item prop="singleCashLimitEnd">
            {{ $t('不高于') }}
            <ody-input-number :controls="false" :decimal="2" :min="1" :max="maxAmount" v-model="formData.singleCashLimitEnd" name="formData_singleCashLimitEnd"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="labelColSpan" class="form-label">
          <el-form-item>
            <ody-tip-star :content="$t('提现频率') + ':'"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="cashFrequencyType">
            <el-select v-model="formData.cashFrequencyType" :clearable="false" name="formData_cashFrequencyType" @change="onCashFrequencyTypeChange">
              <el-option :label="$t('every_day')" :value="1"/>
              <el-option :label="$t('plRule_frequency_week')" :value="2"/>
              <el-option :label="$t('monthly')" :value="3"/>
            </el-select>
          </el-form-item>
          <el-form-item prop="cashFrequency">
            {{ $t('可提现次数') }}
            <ody-input-number :controls="false" :decimal="0" :min="1" :max="maxAmount" v-model="formData.cashFrequency" name="formData_cashFrequency"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formData.cashFrequencyType !== 1">
        <el-col :span="labelColSpan" class="form-label">
          <el-form-item>
            {{ $t('提现日期') + ':' }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="cashFrequencyDayOn">
            <el-checkbox v-model="formData.cashFrequencyDayOn" :label="$t('指定日期')" name="formData_cashFrequencyDayOn"/>
          </el-form-item>

          <el-form-item prop="cashFrequencyDay">
            <el-select v-if="formData.cashFrequencyType !== 1" :disabled="!formData.cashFrequencyDayOn" v-model="formData.cashFrequencyDay" :clearable="false" name="formData_cashFrequencyDay">
              <el-option v-for="(value, key, index) in dayList" :key="index" :label="value" :value="parseInt(key)"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <h3>{{ $t('佣金抵扣设置') }}</h3>
      <el-row>
        <el-col :span="labelColSpan" class="form-label">
          <el-form-item>
            {{ $t('佣金是否可抵扣') + ':' }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-checkbox v-model="formData.comDiscountOn" :label="$t('open')" name="formData_comDiscountOn"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formData.comDiscountOn">
        <el-col :span="labelColSpan" class="form-label">
          <el-form-item>
            <ody-tip-star :content="$t('每单佣金抵扣上限') + ':'"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="singleDiscountLimitType">
            <el-radio v-model="formData.singleDiscountLimitType" :label="0" name="formData_singleDiscountLimitType">{{ $t('plDistributionRule_distStrategyType_default') }}</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formData.comDiscountOn">
        <el-col :span="5" :offset="labelColSpan">
          <el-form-item prop="singleDiscountLimitType">
            <el-radio v-model="formData.singleDiscountLimitType" :label="1" name="formData_singleDiscountLimitType9">{{ $t('最高可抵扣实付金额') + $t('百分比') }}</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :rules="[{validator: validatePercentPass}]" prop="percent">
            <el-input-number :controls="false" :precision="1" :min="0.1" :max="100" v-model="percent" name="percent"/>%
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formData.comDiscountOn">
        <el-col :span="5" :offset="labelColSpan">
          <el-form-item prop="singleDiscountLimitType">
            <el-radio v-model="formData.singleDiscountLimitType" :label="2" name="formData_singleDiscountLimitType8">{{ $t('最高可抵扣实付金额') }}</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :rules="[{validator: validateAmountPass}]" prop="amount">
            <el-input-number :controls="false" :precision="2" :min="0.01" :max="maxAmount" v-model="amount" name="amount"/>{{ $t('元') }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :offset="6">
          <ody-button v-loading.fullscreen.lock="saving" name="AgentRuleConfig311_save" code="AgentRuleConfig311" type="primary" @click="save()">{{ $t('保存') }}</ody-button>
        </el-col>
      </el-row>
    </el-form>

  </section>
</template>

<script>
import ProductModal from '@/components/productModal'

export default {
  name: 'RuleConfig',
  components: {
    ProductModal
  },
  data() {
    return {
      labelColSpan: 4,
      maxAmount: '200000.00',
      formData: {
        cashType: [],
        singleCashLimitStart: null,
        singleCashLimitEnd: null,
        cashFrequency: null,
        cashFrequencyType: 1,
        cashFrequencyDayOn: false,
        cashFrequencyDay: 0,
        comDiscountOn: false,
        singleDiscountLimitType: 0,
        singleDiscountLimitValue: null
      },
      percent: null,
      amount: null,
      rules: {
        cashType: [{ required: true, message: this.$t('提现方式') + this.$t('as_required') }],
        singleCashLimitStart: [
          { required: true, message: this.$t('提现金额') + this.$t('不低于') + this.$t('as_required') },
          { validator: this.validateSingleCashLimitStartPass }
        ],
        singleCashLimitEnd: [
          { required: true, message: this.$t('提现金额') + this.$t('不高于') + this.$t('as_required') },
          { validator: this.validateSingleCashLimitEndPass }
        ],
        cashFrequency: [{ required: true, message: this.$t('可提现次数') + this.$t('as_required') }]
      },
      loading: false,
      saving: false,
      cashTypeList: [],
      monthDays: {},
      weekDays: {
        1: this.$t('common_week_Monday'),
        2: this.$t('common_week_Tuesday'),
        3: this.$t('common_week_Wednesday'),
        4: this.$t('common_weekday_thursday'),
        5: this.$t('common_week_Friday'),
        6: this.$t('common_weekday_saturday'),
        7: this.$t('common_week_Sunday')
      },
      dayList: {}
    }
  },
  async mounted() {
    this.ruleApi = this.$agent.$api.rule
    this.init()
  },
  methods: {
    validatePercentPass(rule, value, callback) {
      if (this.formData.singleDiscountLimitType === 1 && !this.percent) {
        callback(new Error(this.$t('最高可抵扣实付金额') + this.$t('百分比') + this.$t('内容不正确')))
      } else {
        callback()
      }
    },
    validateAmountPass(rule, value, callback) {
      if ((this.formData.singleDiscountLimitType === 2 && !this.amount) || (this.formData.singleDiscountLimitType === 2 && !/^-?\d+\.?\d{0,2}$/.test(this.amount))) {
        callback(new Error(this.$t('最高可抵扣实付金额') + this.$t('内容不正确')))
      } else {
        callback()
      }
    },
    validateSingleCashLimitStartPass(rule, value, callback) {
      if (value !== null && this.formData.singleCashLimitEnd !== null &&
        value > this.formData.singleCashLimitEnd) {
        callback(new Error(this.$t('不低于') + this.$t('金额') + this.$t('不能大于') + this.$t('不高于') + this.$t('金额')))
      } else {
        callback()
      }
    },
    validateSingleCashLimitEndPass(rule, value, callback) {
      if (this.formData.singleCashLimitStart !== null && value !== null &&
        this.formData.singleCashLimitStart > value) {
        callback(new Error(this.$t('不高于') + this.$t('金额') + this.$t('不能小于') + this.$t('不低于') + this.$t('金额')))
      } else {
        callback()
      }
    },
    async init() {
      for (let i = 1; i <= 31; i++) {
        this.monthDays[i] = i + this.$t('号')
      }
      await this.loadDicts()
      await this.load()
    },
    loadDicts() {
      const dicts = ['cash_type']
      return this.$agent.$api.common.code_listMulti({ categories: dicts }).then(res => {
        this.cashTypeList = res.data['cash_type']
      })
    },
    load() {
      this.loading = true
      this.ruleApi.config_getSettleConfig().then(res => {
        this.loading = false
        for (const p in res.data) {
          const v = res.data[p]
          if (v !== null) {
            this.formData[p] = res.data[p]
          }
        }
        this.onCashFrequencyTypeChange()
        this.initSingleDiscountLimitValue()
      })
    },
    async save() {
      // validate data
      var cashTypeIsAdd = false
      for (var i = 0; i < this.formData.cashType.length; i++) {
        var key = this.formData.cashType[i]
        if (this.cashTypeList[key]) {
          cashTypeIsAdd = true
        }
      }
      if (!cashTypeIsAdd) {
        this.$message.info(this.$t('提现方式') + this.$t('as_required'))
        return
      }
      if (this.formData.comDiscountOn && this.formData.singleDiscountLimitType === null) {
        this.$message.info(this.$t('每单佣金抵扣上限') + this.$t('至少选择一项'))
        return
      }
      this.$refs['form'].validate(async(valid) => {
        if (valid) {
          if (this.formData.singleDiscountLimitType === 1) {
            this.formData.singleDiscountLimitValue = this.percent
          } else if (this.formData.singleDiscountLimitType === 2) {
            this.formData.singleDiscountLimitValue = this.amount
          }
          this.saving = true

          this.ruleApi.config_updateSettleConfig(this.formData).then(res => {
            this.saving = false
            if (res.success) {
              this.$message.success(this.$t('plMpConfig_save_success'))
            } else {
              this.$message.error(res.message)
            }
          }, () => { this.saving = false })
        } else {
          this.$message.info(this.$t('请检查保存数据是否完整'))
          return false
        }
      })
    },
    onCashFrequencyTypeChange() {
      if (this.formData.cashFrequencyType === 2) {
        this.dayList = this.weekDays
        if (this.formData.cashFrequencyDay > 6) {
          this.formData.cashFrequencyDay = 1
        }
      } else if (this.formData.cashFrequencyType === 3) {
        this.dayList = this.monthDays
        if (this.formData.cashFrequencyDay === 0) {
          this.formData.cashFrequencyDay = 1
        }
      }
    },
    initSingleDiscountLimitValue() {
      if (this.formData.singleDiscountLimitType === 1) {
        this.percent = this.formData.singleDiscountLimitValue
      } else if (this.formData.singleDiscountLimitType === 2) {
        this.amount = this.formData.singleDiscountLimitValue
      }
    }
  }
}

</script>
