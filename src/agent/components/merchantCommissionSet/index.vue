<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('commission_merchant_param_set')"
      width="50%"
      @open="init">
      <el-form ref="commission" :model="commission" :rules="rules" label-position="right" label-width="100px">
        <el-form-item v-show="showMerchant" :label="$t('common_merchant_name')" prop="merchantId">
          <el-input :disabled="commissionObj.id" v-model="commission.merchantName" name="commission_merchantName" maxlength="25" readonly="readonly" @focus="showMerchantModal" />
        </el-form-item>
        <el-form-item :label="$t('commission_level_number')" prop="series">
          <el-select v-model="commission.series" name="commission_series">
            <!--<el-option :value="''" :label="$t('common_choose_please')" />-->
            <el-option :value="1" label="1"/>
            <!--目前前台只支持1级分佣-->
            <!--<el-option :value="2" label="2"/>-->
            <!--<el-option :value="3" label="3"/>-->
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common_status')" prop="isAvailable">
          <el-radio v-model="commission.isAvailable" :label="1" name="commission_isAvailable" >{{ $t('common_enable') }}</el-radio>
          <el-radio v-model="commission.isAvailable" :label="0" name="commission_isAvailable3" >{{ $t('common_disable') }}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('commission_calculation')" prop="isAvailable">
          <el-radio v-model="commission.baseType" :label="1" name="commission_baseType" >{{ $t('actual_pay_amount') }}</el-radio>
        </el-form-item>
        <div>
          <el-table
            v-loading="loading"
            :data="commissionTypes"
            name="commissionTypes609"
            width="100%">
            <el-table-column
              :label="$t('commission_priority_set')"
              align="center"
              width="400">
              <template slot-scope="scope">
                <div>
                  <el-button v-permission="'CommissionListSetUpPriority'" v-if="scope.$index !== 0" name="upRow" size="mini" type="primary" @click="upRow(scope)">{{ $t('common_up_priority') }}</el-button>
                  <el-button v-permission="'CommissionListSetDownPriority'" v-if="scope.$index != commissionTypes.length-1" name="downRow" size="mini" type="primary" @click="downRow(scope)">{{ $t('common_down_priority') }}</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('commission_dimension')"
              prop="name"
              align="center"/>
            <el-table-column
              :label="$t('param_set')"
              align="center"
              width="200">
              <template slot-scope="scope">
                <div>
                  <el-button v-permission="'CommissionListSetParam'" v-if="scope.row.id !== 6 && commissionObj.id" name="paramSet" size="mini" type="primary" @click="paramSet(scope)">{{ $t('common_set') }}</el-button>
                  <el-button v-permission="'CommissionListSetCommonParam'" v-if="scope.row.id === 6" name="commonParamSet" size="mini" type="primary" @click="commonParamSet(scope)">{{ $t('common_param_set') }}</el-button>
                </div>
              </template>
            </el-table-column>

          </el-table>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <ody-button name="handleClose" @click="handleClose">{{ $t('common_cancel') }}</ody-button>
        <ody-button v-permission="'CommissionListSave'" name="submitForm" type="primary" @click="submitForm('commission')">{{ $t('commission_save') }}</ody-button>
      </span>
    </ody-dialog>
    <MerchantSelectModal :visible.sync="merchantModalVisible" @ok="selectMerchant" />
    <CommonCommissionSet :visible.sync="showCommonComissionModal" :commission-params.sync="commissionParams" @ok="changeValue"/>
  </div>
</template>
<script>
import MerchantSelectModal from '@/components/merchantModal'
import CommonCommissionSet from '@/components/commonCommissionSet'
export default {
  components: {
    MerchantSelectModal,
    CommonCommissionSet
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    commissionObj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      merchantModalVisible: false,
      showCommonComissionModal: false,
      showMerchant: true,
      commission: {
        baseType: null,
        isAvailable: null,
        values: [],
        series: null,
        merchantId: null,
        merchantName: null,
        rule: null,
        dimensionRules: []
      },
      rules: {
        merchantId: [
          { required: true, message: this.$t('common_choose_merchant'), trigger: 'change' }
        ],
        series: [
          { required: true, message: this.$t('common_choose_series'), trigger: 'change' }
        ]
      },
      commissionTypes: [],
      commissionParams: {},
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
    selectMerchant(merchant) {
      if (merchant) {
        this.commission.merchantId = merchant.merchantId
        // this.searchForm.merchantCode = merchant.merchantCode
        this.commission.merchantName = merchant.merchantName
      }
    },
    showMerchantModal() {
      this.merchantModalVisible = true
    },
    async checkHiddenMerchant() { // 如果只有一个商家权限，隐藏商家
      const param = {
        itemsPerPage: 10,
        currentPage: 1,
        obj: {}
      }
      const common = this.$agent.$api.common
      const result = await common.merchantList(param)
      if (result && result.data) {
        const data = result.data
        if (data.total === 1) {
          this.showMerchant = false
          this.selectMerchant(data.listObj[0])
        }
      }
    },
    handleClose() {
      // this.$refs['commission'].resetFields()
      this.$emit('update:visible', !this.visible)
    },
    upRow(scope) {
      // console.log(scope)
      const row = scope.row
      for (let i = 0; i < this.commission.dimensionRules.length; i++) {
        if (row.id === this.commissionTypes[i].id && i !== 0) {
          const temp = this.commissionTypes[i - 1]
          this.$set(this.commission.dimensionRules, i - 1, this.commission.dimensionRules[i])
          this.$set(this.commissionTypes, i - 1, this.commissionTypes[i])
          this.$set(this.commissionTypes, i, temp)
          this.$set(this.commission.dimensionRules, i, temp.id)
          return
        }
      }
    },
    downRow(scope) {
      const row = scope.row
      for (let i = 0; i < this.commissionTypes.length; i++) {
        if (row.id === this.commissionTypes[i].id && i !== this.commissionTypes.length - 1) {
          const temp = this.commissionTypes[i + 1]
          this.$set(this.commission.dimensionRules, i + 1, this.commission.dimensionRules[i])
          this.$set(this.commissionTypes, i + 1, this.commissionTypes[i])
          this.$set(this.commissionTypes, i, temp)
          this.$set(this.commission.dimensionRules, i, temp.id)
          return
        }
      }
    },
    paramSet(scope) {
      this.$router.push({
        name: 'AgentStoreCommissionParameterSet',
        query: {
          commissionId: this.commissionObj.id,
          commissionType: scope.row.id,
          merchantId: this.commission.merchantId,
          merchantName: this.commission.merchantName
        }
      })
    },
    commonParamSet(scope) {
      const commissionParamsObj = {}
      commissionParamsObj.commissionId = this.commissionObj.id
      commissionParamsObj.commissionType = scope.row.id + ''
      commissionParamsObj.rule = this.commission.rule
      commissionParamsObj.values = this.commission.values
      commissionParamsObj.layer = parseInt(this.commission.series)
      this.commissionParams = commissionParamsObj
      // console.log(commissionParamsObj)
      this.showCommonComissionModal = true
    },
    changeValue(commonParam) {
      // console.log(commonParam)
      if (commonParam) {
        this.commission.values = commonParam.values
        this.commission.rule = commonParam.rule
      }
    },
    submitForm(commission) {
      this.$refs[commission].validate((valid) => {
        console.log(valid)
        if (valid) {
          const commissionRequest = this.$agent.$api.commission
          if (this.commissionObj.id) {
            commissionRequest.updateCommission(this.commission).then((result) => {
              if (result && result.code === '0') {
                this.$emit('update:visible', !this.visible)
                this.$emit('clean', [])
                this.$message({
                  type: 'success',
                  message: this.$t('common_operate_success')
                })
              }
            })
          } else {
            commissionRequest.addCommissionInfo(this.commission).then((result) => {
              if (result && result.code === '0') {
                this.$emit('update:visible', !this.visible)
                this.$emit('clean', [])
                this.$message({
                  type: 'success',
                  message: this.$t('common_operate_success')
                })
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    initCodes() {
      const vue = this
      vue.$agent.$api.common.listMulti({ categorys: ['COMMISSION_DIMENSION', 'COMMISSION_RULE'] }).then((data) => {
        if (data.data.COMMISSION_DIMENSION) {
          vue.commissionDimensionList = data.data.COMMISSION_DIMENSION
        }
      })
    },
    async init() {
      if (this.$refs['commission']) {
        this.$refs['commission'].resetFields()
      }
      try {
        this.commission = {
          baseType: null,
          isAvailable: null,
          values: [],
          series: null,
          merchantId: null,
          merchantName: null,
          rule: null,
          dimensionRules: []
        }
        await this.checkHiddenMerchant()
        if (this.commissionObj.id) {
          const agent = this.$agent.$api.commission
          const result = await agent.getCommissionInfo(JSON.stringify(this.commissionObj.id))
          if (result) {
            this.commission = result.data
            const tempDimensionRules = []
            for (let i = 0; i < this.commission.dimensionRules.length; i++) {
              if (this.commission.dimensionRules[i] !== 4) {
                tempDimensionRules.push(this.commission.dimensionRules[i])
              }
            }
            this.commission.dimensionRules = tempDimensionRules
            this.commissionTypes = getCommissionType(this.commission.dimensionRules, this.commissionDimensionList)
          }
        } else {
          this.commission.isAvailable = 1
          this.commission.baseType = 1
          this.commission.dimensionRules = [2, 3, 5, 6]
          this.commissionTypes = getCommissionType(this.commission.dimensionRules, this.commissionDimensionList)
        }
      } catch (ex) {
        console.log(ex)
      }
    }
  }
}
function getCommissionType(dimensionRules, dimensionTypes) {
  const tempTypes = []
  for (let j = 0; j < dimensionRules.length; j++) {
    for (let i = 0; i < dimensionTypes.length; i++) {
      if (dimensionRules[j] === parseInt(dimensionTypes[i].code)) {
        if (parseInt(dimensionTypes[i].code) !== 4) {
          const dimensionType = {}
          dimensionType.id = parseInt(dimensionTypes[i].code)
          dimensionType.name = dimensionTypes[i].name
          tempTypes.push(dimensionType)
        }
      }
    }
  }
  return tempTypes
}

</script>

<style scoped>

</style>
