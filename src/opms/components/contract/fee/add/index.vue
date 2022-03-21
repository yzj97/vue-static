<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('contract_addFeeBill')"
      width="60%"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-position="right"
        label-width="240px"
      >
        <el-form-item :label="$t('contract_currentFeeType1')" prop="currentFeeType1">
          <el-select v-model="formData.currentFeeType1" name="formData_currentFeeType1" @change="changeFeeType1">
            <el-option value>{{ $t('please_choose') }}</el-option>
            <el-option
              v-for="item in contractFeeTree"
              :key="item.feeTypeCode"
              :label="item.feeTypeName"
              :value="item.feeTypeCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formData.currentFeeType1 && contractFeeTreeChildren"
          :label="$t('contract_currentFeeType2')"
          prop="currentFeeType2"
        >
          <el-select v-model="formData.currentFeeType2" name="formData_currentFeeType2" @change="changeFeeType2">
            <el-option value>{{ $t('please_choose') }}</el-option>
            <el-option
              v-for="item in contractFeeTreeChildren"
              :key="item.feeTypeCode"
              :label="item.feeTypeName"
              :value="item.feeTypeCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('contract_countPeriodText')" prop="countPeriod">
          <el-select v-model="formData.countPeriod" name="formData_countPeriod" @change="changeCountPeriod">
            <el-option value>{{ $t('please_choose') }}</el-option>
            <el-option
              v-for="item in contractFeeCountPeriodList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('contract_countTypeText')" prop="countType">
          <el-select v-model="formData.countType" name="formData_countType" @change="changeCountType">
            <el-option value>{{ $t('please_choose') }}</el-option>
            <el-option
              v-for="item in contractFeeCountTypeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="isFixedCountStandard"
          :label="$t('contract_countStandardText')"
          prop="countStandard"
        >
          <el-select v-model="formData.countStandard" name="formData_countStandard">
            <el-option value>{{ $t('please_choose') }}</el-option>
            <el-option
              v-for="item in contractFeeCountStandardList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('contract_createFeeBillType')" prop="createFeeBillType">
          <el-select v-model="formData.createFeeBillType" name="formData_createFeeBillType">
            <el-option value>{{ $t('please_choose') }}</el-option>
            <el-option
              v-for="item in contractFeeCreateTypeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('contract_auditType')" prop="auditType">
          <el-select v-model="formData.auditType" name="formData_auditType">
            <el-option value>{{ $t('please_choose') }}</el-option>
            <el-option
              v-for="item in contractFeeAuditTypeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="isFixedRatio"
          :label="$t('contract_deductionRate')"
          prop="deductionRate"
        >
          <el-input v-model="formData.deductionRate" name="formData_deductionRate">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="isFixedRatio" :label="$t('contract_guaranteeText')" prop="isGuarantee">
          <el-radio v-model="formData.isGuarantee" name="formData_isGuarantee" label="1">{{ $t('contract_yes') }}</el-radio>
          <el-radio v-model="formData.isGuarantee" name="formData_isGuarantee8" label="0">{{ $t('contract_no') }}</el-radio>
        </el-form-item>
        <el-form-item
          v-if="isFixedRatio && formData.isGuarantee === '1'"
          :label="$t('contract_guaranteeAmount')"
          prop="guaranteeAmount"
        >
          <el-input v-model="formData.guaranteeAmount" name="formData_guaranteeAmount">
            <template slot="append">{{ $t('contract_yuan') }}</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="isFixedAmount" :label="$t('contract_feeAmount')" prop="feeAmount">
          <el-input v-model="formData.feeAmount" name="formData_feeAmount">
            <template slot="append">{{ $t('contract_yuan') }}</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('common_remark')">
          <el-input v-model="formData.remark" name="formData_remark" type="textarea" maxlength="255" show-word-limit />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <ody-button
          name="OpmsJxContractList20_handleOk"
          type="primary"
          code="OpmsJxContractList20"
          @click="handleOk"
        >{{ $t('common_confirm') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    contractId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      isFixedCountStandard: true,
      isFixedRatio: true,
      isFixedAmount: false,
      showFeeAmount: true,
      contractFeeTree: [],
      contractFeeTreeChildren: [],
      contractFeeCountPeriodList: [],
      contractFeeCountTypeList: [],
      contractFeeCountStandardList: [],
      contractFeeCreateTypeList: [],
      contractFeeAuditTypeList: [],
      formData: getDefaultFormData(),
      rules: {
        currentFeeType1: [
          {
            required: true,
            message: this.$t('please_choose'),
            trigger: 'change'
          }
        ],
        currentFeeType2: [
          {
            required: true,
            message: this.$t('please_choose'),
            trigger: 'change'
          }
        ],
        countPeriod: [
          {
            required: true,
            message: this.$t('please_choose'),
            trigger: 'change'
          }
        ],
        countType: [
          {
            required: true,
            message: this.$t('please_choose'),
            trigger: 'change'
          }
        ],
        countStandard: [
          {
            required: true,
            message: this.$t('please_choose'),
            trigger: 'change'
          }
        ],
        createFeeBillType: [
          {
            required: true,
            message: this.$t('please_choose'),
            trigger: 'change'
          }
        ],
        auditType: [
          {
            required: true,
            message: this.$t('please_choose'),
            trigger: 'change'
          }
        ],
        deductionRate: [
          { required: true, message: this.$t('please_enter'), trigger: 'blur' },
          {
            pattern: /^(([1-9]\d*)|0)(.\d*)?$/,
            message: this.$t('please_enter_the_legal_number'),
            trigger: 'blur'
          },
          {
            type: 'number',
            message: this.$t('请输入0.00 ~ 100.00的数字'),
            transform(value) {
              return Number(value)
            },
            min: 0,
            max: 100
          }
        ],
        isGuarantee: [
          {
            required: true,
            message: this.$t('please_choose'),
            trigger: 'change'
          }
        ],
        guaranteeAmount: [
          { required: true, message: this.$t('please_enter'), trigger: 'blur' },
          {
            pattern: /^(([1-9]\d*)|0)(.\d*)?$/,
            message: this.$t('please_enter_the_legal_number'),
            trigger: 'blur'
          }
        ],
        feeAmount: [
          { required: true, message: this.$t('please_enter'), trigger: 'blur' },
          {
            pattern: /^(([1-9]\d*)|0)(.\d*)?$/,
            message: this.$t('please_enter_the_legal_number'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.initCode()
    },
    initCode() {
      const vue = this
      vue.$opms.$api.jxContract.selectFeeTypeJsons().then(res => {
        vue.contractFeeTree = res.data
      })
      vue.$opms.$api.code
        .listMulti({
          categories: [
            'CONTRACT_FEE_COUNT_PERIOD',
            'CONTRACT_FEE_COUNT_TYPE',
            'CONTRACT_FEE_COUNT_STANDARD',
            'CONTRACT_FEE_CREATE_TYPE',
            'CONTRACT_FEE_AUDIT_TYPE'
          ]
        })
        .then(res => {
          vue.contractFeeCountPeriodList = res.data.CONTRACT_FEE_COUNT_PERIOD
          vue.contractFeeCountTypeList = res.data.CONTRACT_FEE_COUNT_TYPE
          vue.contractFeeCountStandardList =
            res.data.CONTRACT_FEE_COUNT_STANDARD
          vue.contractFeeCreateTypeList = res.data.CONTRACT_FEE_CREATE_TYPE
          vue.contractFeeAuditTypeList = res.data.CONTRACT_FEE_AUDIT_TYPE
        })
    },
    changeFeeType1() {
      const vue = this
      vue.formData.currentFeeType1Name = ''
      for (const item of vue.contractFeeTree) {
        if (vue.formData.currentFeeType1 === item.feeTypeCode) {
          vue.contractFeeTreeChildren = item.children
          vue.formData.currentFeeType1Name = item.feeTypeName
          vue.formData.currentFeeType2 = ''
          vue.showFeeAmount = item.isPreset === 1
          break
        }
      }
    },
    changeFeeType2() {
      const vue = this
      vue.formData.currentFeeType2Name = ''
      for (const item of vue.contractFeeTreeChildren) {
        if (vue.formData.currentFeeType2 === item.feeTypeCode) {
          vue.showFeeAmount = item.isPreset === 1
          vue.formData.currentFeeType2Name = item.feeTypeName
          break
        }
      }
    },
    changeCountPeriod() {
      const vue = this
      if (vue.formData.countPeriod === '4') {
        // 一次性费用
        vue.formData.countType = '2'
        vue.isFixedRatio = false
        vue.isFixedCountStandard = false
        vue.isFixedAmount = true
        vue.contractFeeCreateTypeList.forEach(function(item) {
          if (item.code === '1') {
            item.disabled = true
          }
        })
        vue.contractFeeAuditTypeList.forEach(function(item) {
          if (item.code === '1') {
            item.disabled = true
          }
        })
        vue.formData.createFeeBillType = '2'
        vue.formData.auditType = '2'
      } else if (vue.formData.countPeriod === '5') {
        vue.isFixedCountStandard = true
        vue.contractFeeCreateTypeList.forEach(function(item) {
          if (item.code === '1') {
            item.disabled = true
          }
        })
        vue.contractFeeAuditTypeList.forEach(function(item) {
          if (item.code === '1') {
            item.disabled = true
          }
        })
        vue.formData.createFeeBillType = '2'
        vue.formData.auditType = '2'
      } else {
        vue.isFixedCountStandard = true
        vue.contractFeeCreateTypeList.forEach(function(item) {
          item.disabled = false
        })
        vue.contractFeeAuditTypeList.forEach(function(item) {
          item.disabled = false
        })
        vue.formData.createFeeBillType = '1'
        vue.formData.auditType = '1'
      }
    },
    changeCountType() {
      const vue = this
      if (vue.formData.countType === '1') {
        // 固定比例
        vue.isFixedRatio = true
        vue.isFixedCountStandard = true
        vue.isFixedAmount = false
      } else if (vue.formData.countType === '2') {
        // 固定额度
        vue.isFixedRatio = false
        vue.isFixedCountStandard = false
        vue.isFixedAmount = true
      } else if (vue.formData.countType === '3') {
        // 阶梯费用
        vue.isFixedRatio = false
        vue.isFixedAmount = false
        vue.isFixedCountStandard = true
      }
    },
    handleClose() {
      this.formData = getDefaultFormData()
      this.$emit('update:visible', !this.visible)
    },
    handleOk() {
      const vue = this
      vue.$refs['formData'].validate(valid => {
        if (valid) {
          vue.formData.contractId = vue.contractId
          if (vue.formData.currentFeeType2) {
            vue.formData.feeTypeCode = vue.formData.currentFeeType2
            vue.formData.feeTypeName = vue.formData.currentFeeType2Name
          } else {
            vue.formData.feeTypeCode = vue.formData.currentFeeType1
            vue.formData.feeTypeName = vue.formData.currentFeeType1Name
          }
          vue.$opms.$api.jxContract.addFee(vue.formData).then(res => {
            if (res && res.code === '0') {
              vue.$emit('ok', {})
              vue.$emit('update:visible', !this.visible)
              vue.formData = getDefaultFormData()
            }
          })
        } else {
          return false
        }
      })
    }
  }
}

function getDefaultFormData() {
  return {
    countType: '1',
    countPeriod: '1',
    countStandard: '1',
    createFeeBillType: '1',
    auditType: '1',
    isGuarantee: '0',
    currentFeeType1: '',
    currentFeeType1Name: '',
    currentFeeType2: '',
    currentFeeType2Name: ''
  }
}
</script>

<style scoped>
</style>
