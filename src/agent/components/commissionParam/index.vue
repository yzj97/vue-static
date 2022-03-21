<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="titleName"
      width="600px"
      @open="init">
      <el-form ref="commissionInfoForm" :model="form" label-position="right" label-width="80px">
        <el-form-item
          :label="$t('commission_type')"
          :rules="{
            required: true, message: $t('common_choose_dimension'), trigger: 'blur'
          }"
          prop="commissionRule">
          <el-select v-model="form.commissionRule" name="form_commissionRule" @change="changeCommissionRule(form.commissionRule)" >
            <el-option :label="$t('common_choose_please')" />
            <el-option v-for="item in commissionRuleList" :label="item.name" :key="item.code" :value="item.code" />
          </el-select>
        </el-form-item>
        <div>
          <el-table
            v-loading="loading"
            :data="form.commissionParams"
            name="form_commissionParams106"
            width="100%">
            <el-table-column
              :label="$t('commission_level')"
              prop="level"
              align="center"
              width="200">
              <template slot-scope="scope">
                {{ $t('common_ospf') + scope.row.level + $t('commission_level') }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="form.commissionRule === '1'"
              :label="$t('commission_amount')"
              align="center">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'commissionParams.' + scope.$index + '.ruleValue'"
                  :rules="{
                    required: true, message: $t('common_input_amonut'), trigger: 'blur'
                  }"
                  label-width="0px">
                  <ody-input-number v-model="scope.row.ruleValue" :decimal="2" :min="0.01" :max="99999" :placeholder="$t('commission_input_float')" name="scope_row_ruleValue"/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              v-if="form.commissionRule === '2'"
              :label="$t('commission_proportion')"
              align="center">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'commissionParams.' + scope.$index + '.ruleValue'"
                  :rules="{
                    required: true, message: $t('common_input_proportion'), trigger: 'blur'
                  }"
                  label-width="0px">
                  <ody-input-number v-model="scope.row.ruleValue" :min="0" :max="100" :placeholder="$t('commission_input_integer')" name="scope_row_ruleValue1" />
                  <span>%</span>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <ody-button name="handleClose" @click="handleClose">{{ $t('common_cancel') }}</ody-button>
        <ody-button name="handleSave" type="primary" @click="handleSave('commissionInfoForm')">{{ $t('commission_save') }}</ody-button>
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
    commissionParams: {
      type: Object,
      default: null
    },
    titleName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      form: {
        commissionParams: [],
        commissionRule: null
      },
      savedRuleParamMap: {},
      commissionRuleList: [],
      commissionDimensionList: []
    }
  },
  async mounted() {
    try {
      this.initCodes()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    handleSave(commissionInfoForm) {
      const vue = this
      this.$refs[commissionInfoForm].validate((valid) => {
        // console.log(valid)
        if (valid) {
          if (vue.form.commissionRule === '2') {
            let sumValue = 0.0
            vue.form.commissionParams.forEach(item => {
              sumValue += parseFloat(item.ruleValue)
            })
            if (sumValue > 100) {
              vue.$message({
                type: 'warning',
                message: this.$t('commission_scale_sum_tip')
              })
              return
            }
          }
          const commission = vue.$agent.$api.commission
          commission.addOrUpdateCommissionParams(vue.form).then((result) => {
            if (result && result.code === '0') {
              vue.$emit('update:visible', !vue.visible)
              vue.$emit('clean', [])
              vue.$message({
                type: 'success',
                message: vue.$t('common_operate_success')
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changeCommissionRule(commissionRule) {
      const layer = this.commissionParams.layer
      let ruleValues = this.savedRuleParamMap[commissionRule]
      console.log(ruleValues)
      if (!isNaN(layer) && layer > 0) {
        if (ruleValues) {
          this.savedRuleParamMap[commissionRule] = ruleValues
          this.form.commissionParams = ruleValues
        } else {
          ruleValues = fixRuleValues(layer, [])
          this.form.commissionParams = ruleValues
          this.savedRuleParamMap[commissionRule] = ruleValues
        }
      }
    },
    initCodes() {
      const vue = this
      this.$agent.$api.common.listMulti({ categorys: ['COMMISSION_DIMENSION', 'COMMISSION_RULE'] }).then((data) => {
        if (data.data.COMMISSION_RULE) {
          vue.commissionRuleList = data.data.COMMISSION_RULE
        }
        if (data.data.COMMISSION_DIMENSION) {
          vue.commissionDimensionList = data.data.COMMISSION_DIMENSION
        }
      })
    },
    async init() {
      try {
        if (this.$refs['commissionInfoForm']) {
          this.$refs['commissionInfoForm'].resetFields()
        }
        this.savedRuleParamMap = {}
        if (this.commissionParams != null) {
          // console.log(this.commissionParams.dimensionRules)
          this.form.referIds = this.commissionParams.referIds
          this.form.commissionType = this.commissionParams.commissionType
          this.form.commissionId = this.commissionParams.commissionId
          this.form.layer = this.commissionParams.layer
          let commissionRule1 = 0
          if (this.commissionParams.dimensionRules.length > 0) {
            const dimensionRule = this.commissionParams.dimensionRules[0]
            commissionRule1 = dimensionRule.commissionRule
            this.savedRuleParamMap[commissionRule1] = fixRuleValues(this.commissionParams.layer, dimensionRule.ruleValues)
          } else {
            commissionRule1 = 2
          }
          this.form.commissionRule = commissionRule1 + ''
          let ruleValues = []
          ruleValues = this.savedRuleParamMap[commissionRule1]
          // console.log(ruleValues)
          const layer = this.commissionParams.layer
          if (!isNaN(layer) && layer > 0) {
            if (!ruleValues) {
              ruleValues = fixRuleValues(layer, [])
              this.savedRuleParamMap[commissionRule1] = ruleValues
            }
          }
          let titleStr = ''
          // console.log(this.commissionParams.commissionType)
          this.commissionDimensionList.forEach(item => {
            if (this.commissionParams.commissionType === item.code) {
              titleStr = item.name
            }
          })
          if (this.commissionParams.isbatchSet) {
            titleStr = titleStr + this.$t('commission_set_param') + this.$t('commission_set_param')
          } else {
            titleStr = titleStr + this.$t('commission_set_param')
          }
          this.titleName = titleStr
          // console.log(ruleValues)
          this.form.commissionParams = ruleValues
        }
      } catch (ex) {
        console.log(ex)
      }
    }
  }
}
function fixRuleValues(layer, ruleValues) {
  if (!isNaN(layer) && layer > 0) {
    if (ruleValues.length > 0) {
      const length = ruleValues.length
      if (ruleValues.length > layer) {
        ruleValues = ruleValues.slice(0, layer)
      } else {
        for (let i = length; i < layer; i++) {
          const ruleValue = {}
          ruleValue.id = null
          ruleValue.level = i + 1
          ruleValue.ruleValue = null
          ruleValues.push(ruleValue)
        }
      }
      return ruleValues
    } else {
      const defaultCommissionParams = []
      for (let i = 0; i < layer; i++) {
        const commissionParam = {}
        commissionParam.id = null
        commissionParam.level = i + 1
        commissionParam.ruleValue = null
        defaultCommissionParams.push(commissionParam)
      }
      return defaultCommissionParams
    }
  } else {
    return []
  }
}
</script>

<style scoped>

</style>
