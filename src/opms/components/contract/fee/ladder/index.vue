<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('contract_royaltyRate')"
      width="60%"
    >
      <ody-list-table-area>
        <div v-if="isEdit" slot="btn">
          <ody-button
            name="addLadder"
            size="mini"
            type="primary"
            code="OpmsJxContractList36"
            @click="addLadder"
          >{{ $t('common_create') }}</ody-button>
        </div>
        <div slot="table">
          <el-form ref="feeRuleData" :model="feeRuleData" :rules="rules">
            <el-table :data="feeRuleData.ruleList" name="feeRuleData_ruleList575">
              <el-table-column
                :label="this.$t('common_sericalNo')"
                :index="showIndex"
                type="index"
                align="center"
              />
              <el-table-column
                :label="'（>）' + this.$t('contract_beginAmount')"
                align="center"
                prop="beginAmount"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'ruleList.' + scope.$index + '.beginAmount'"
                    :rules="rules.beginAmount"
                  >
                    <el-input
                      v-model="scope.row.beginAmount"
                      :disabled="!isEdit"
                      name="scope_row_beginAmount"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                :label="'（<=）' + this.$t('contract_endAmount')"
                align="center"
                prop="beginAmount"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'ruleList.' + scope.$index + '.endAmount'"
                    :rules="rules.endAmount"
                  >
                    <el-input
                      v-model="scope.row.endAmount"
                      :disabled="!isEdit"
                      name="scope_row_endAmount"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                :label="this.$t('contract_royaltyRate') + '（%）'"
                align="center"
                prop="beginAmount"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'ruleList.' + scope.$index + '.royaltyRate'"
                    :rules="rules.royaltyRate"
                  >
                    <el-input
                      v-model="scope.row.royaltyRate"
                      :disabled="!isEdit"
                      name="scope_row_royaltyRate"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                v-if="isEdit"
                :label="this.$t('common_operation')"
                fixed="right"
                align="center"
              >
                <template slot-scope="scope">
                  <ody-button
                    v-if="scope.$index !== 0"
                    name="OpmsJxContractList32_deleteRow"
                    size="mini"
                    type="primary"
                    code="OpmsJxContractList32"
                    @click="deleteRow(scope.$index, scope.row)"
                  >{{ $t('common_delete') }}</ody-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
      </ody-list-table-area>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <ody-button
          v-if="isEdit"
          name="OpmsJxContractList21_handleOk"
          size="small"
          code="OpmsJxContractList21"
          type="primary"
          @click="handleOk"
        >{{ $t('common_confirm') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    feeRuleData: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
    },
    contractId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      rules: {
        beginAmount: [
          { required: true, message: this.$t('please_enter'), trigger: 'blur' },
          {
            pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/,
            message: this.$t('please_enter_the_legal_number_with_two_digit'),
            trigger: 'blur'
          }
        ],
        endAmount: [
          { required: true, message: this.$t('please_enter'), trigger: 'blur' },
          {
            pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/,
            message: this.$t('please_enter_the_legal_number_with_two_digit'),
            trigger: 'blur'
          }
        ],
        royaltyRate: [
          { required: true, message: this.$t('please_enter'), trigger: 'blur' },
          {
            pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/,
            message: this.$t('please_enter_the_legal_number_with_two_digit'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {},
  methods: {
    addLadder() {
      const vue = this
      const length = vue.feeRuleData.ruleList.length
      const previous = vue.feeRuleData.ruleList[length - 1]
      vue.feeRuleData.ruleList.push({
        beginAmount: previous.endAmount,
        endAmount: 0,
        royaltyRate: 0
      })
    },
    deleteRow(index, row) {
      const vue = this
      vue.feeRuleData.ruleList.splice(index, 1)
    },
    showIndex(index) {
      return index + 1
    },
    handleClose() {
      const vue = this
      vue.$emit('update:visible', !vue.visible)
    },
    handleOk() {
      const vue = this
      vue.$refs['feeRuleData'].validate(valid => {
        if (valid) {
          for (let i = 0; i < vue.feeRuleData.ruleList.length; i++) {
            const item = vue.feeRuleData.ruleList[i]
            if (i > 0) {
              const previousItem = vue.feeRuleData.ruleList[i - 1]

              if (Number(item.beginAmount) !== Number(previousItem.endAmount)) {
                vue.$message.error(
                  '第' + (i + 1) + '行起始金额必须等于上一行的截止金额'
                )
                return false
              }
              if (Number(item.endAmount) <= Number(item.beginAmount)) {
                vue.$message.error(
                  '第' + (i + 1) + '行截止金额必须大于起始金额'
                )
                return false
              }
            }
          }

          const params = {
            id: vue.id,
            feeCalculateRuleList: vue.feeRuleData.ruleList,
            contractId: vue.contractId
          }
          vue.$opms.$api.jxContract.updateFeeTerm(params).then(res => {
            if (res && res.code === '0') {
              vue.$message.success(vue.$t('common_update_success'))
              vue.$emit('ok', {})
              vue.$emit('update:visible', !this.visible)
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
