<template>
  <section>
    <el-card>
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="240px">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('order_ruleCode')">
              <div>{{ editForm.code }}</div>
            </el-form-item>
            <el-form-item :label="$t('order_ruleName')" prop="name">
              <el-input
                v-model="editForm.name"
                :placeholder="$t('please_input')"
                name="editForm_name"
                show-word-limit
                maxlength="20"
              />
            </el-form-item>
            <el-form-item :label="$t('order_priority')" prop="priority">
              <el-input-number
                :precision="0"
                :min="1"
                :max="999"
                v-model="editForm.priority"
                :placeholder="$t('输入1-999的正整数')"
                name="editForm_priority"
              />
            </el-form-item>
            <el-form-item :label="$t('isDisable')" required="true" prop="isDisable">
              <el-radio v-model="editForm.isDisable" :label="0" name="editForm_isDisable">{{ $t('available') }}</el-radio>
              <el-radio v-model="editForm.isDisable" :label="1" name="editForm_isDisable3">{{ $t('Unavailable') }}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('order_validity')" required="true" prop="dateRange">
              <el-date-picker
                v-model="editForm.dateRange"
                name="editForm_dateRange"
                type="daterange"
                align="right"
                format="yyyy-MM-dd"
                unlink-panels
                range-separator="-"
              />
            </el-form-item>
            <el-form-item :label="$t('payment_type_remark')">
              <el-input :rows="2" v-model="editForm.remark" name="editForm_remark" type="textarea" />
            </el-form-item>
            <el-form-item :label="$t('order_ports_type')" prop="orderType">
              <el-select v-model="editForm.orderType" name="editForm_orderType">
                <el-option
                  v-for="item in orderTypes"
                  :label="item.name"
                  :key="item.code"
                  :value="parseInt(item.code)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item :label="$t('order_match_variable')" required="true" prop="conList">
              <ody-list-table-area>
                <div slot="btn">
                  <ody-button
                    name="OmsOrderTypeMappingRuleConditionAdd_openDialogWindow"
                    size="small"
                    type="primary"
                    code="OmsOrderTypeMappingRuleConditionAdd"
                    @click="openDialogWindow(false)"
                  >{{ $t('order_match_variable') }}</ody-button>
                </div>
                <div slot="table">
                  <ody-table
                    :loading="loading"
                    :data="editForm.conList"
                    :columns="columns"
                    :operates="operates"
                    :can-filter="false"
                    name="editForm_conList029"
                  />
                </div>
              </ody-list-table-area>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <ody-fixed>
        <ody-button
          name="OmsOrderTypeMappingRule_Save_save"
          code="OmsOrderTypeMappingRule_Save"
          size="small"
          type="primary"
          @click="save"
        >{{ $t('common_save') }}</ody-button>
        <el-button name="goBack" size="small" @click="goBack">{{ $t('common_back') }}</el-button>
      </ody-fixed>

      <div>
        <ruleWindow
          :dialog-visible="dialogVisible"
          :data="data"
          :row="ruleRow"
          :rule-type="7"
          name="data222"
          @closeDialog="closeDialogWindow"
          @updateRuleData="updateRuleData"
        />
      </div>
    </el-card>
  </section>
</template>

<script>
import ruleWindow from '@/components/ruleWindow'

export default {
  name: 'OmsOrderTypeMappingRuleCon',
  components: {
    ruleWindow
  },
  data() {
    const vm = this
    const sDate = new Date()
    const eDate = new Date(new Date().setDate(sDate.getDate() + 365))
    return {
      rules: {
        priority: [
          { required: true, message: this.$t('请输入优先级'), trigger: 'blur' }
        ],
        code: [
          {
            required: true,
            type: 'string',
            message: this.$t('required'),
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            type: 'string',
            message: this.$t('required'),
            trigger: 'blur'
          }
        ],
        orderType: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        conList: [
          {
            required: true,
            type: 'array',
            message: this.$t('required'),
            trigger: 'change'
          }
        ],
        dateRange: [
          { required: true, type: 'array', message: this.$t('required'), trigger: 'change' }
        ]
      },
      dialogVisible: false,
      code: null,
      isEdit: !!vm.$route.params.id,
      editForm: {
        isDisable: 0,
        name: null,
        code: this.code,
        conList: [],
        dateRange: [sDate, eDate]
      },
      orderTypes: [],
      data: [],
      ruleRow: {},
      columns: [
        {
          show: true,
          prop: 'variableName',
          label: vm.$t('order_variable_name'),
          align: 'center',
          minWidth: 160
        },
        {
          show: true,
          prop: 'operator',
          label: vm.$t('order_operator'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'variableValueDesc',
          label: vm.$t('order_variable_value'),
          align: 'center',
          minWidth: 360,
          formatter: (row, column, cellValue) => {
            var str = row.variableValueDesc
            str = str.replace(/[\"\[\]]/g, '')
            return str
          }
        }
      ], // 需要展示的列
      operates: {
        width: 200,
        fixed: 'right',
        list: [
          {
            label: vm.$t('edit'),
            disabled: false,
            method(index, row) {
              vm.toEdit(index, row)
            },
            code: 'OmsOrderTypeMappingRule_Condition_Edit'
          },
          {
            label: vm.$t('delete'),
            disabled: false,
            method(index, row) {
              vm.del(index, row)
            },
            code: 'OmsOrderTypeMappingRule_Condition_Delete'
          }
        ]
      }
    }
  },
  watch: {
    code: {
      handler(newValue, oldValue) {
        this.editForm.code = newValue
      },
      deep: true
    }
  },
  mounted() {
    this._init()
  },
  methods: {
    save() {
      const vue = this
      // validate
      this.$refs['editForm'].validate(valid => {
        if (!valid) {
          return
        }
        this.editForm.conList = this.data
        if (
          this.editForm.conList == null ||
          this.editForm.conList.length === 0
        ) {
          this.$message({
            type: 'warning',
            message: this.$t('form_invalid')
          })
          return
        }
        // prepare commit
        const requestData = Object.assign({}, this.editForm)
        requestData.startDate = requestData.dateRange[0]
        requestData.endDate = requestData.dateRange[1]
        delete requestData.dateRange

        const request = this.$oms.$api.soTypeMappingRule[
          this.isEdit ? 'soTypeMappingRuleUpdate' : 'soTypeMappingRuleAdd'
        ]
        request(requestData).then(data => {
          if (data.code === '0') {
            vue.$message({
              type: 'success',
              message: this.$t('common_save_success')
            })
            this.goBack()
          }
        })
      })
    },
    goBack() {
      /* this.$portal.delActiveView()
      this.$router.push({ name: 'OmsOrderTypeMappingRuleCon',
        params: {}
      })*/
      this.$portal.delActiveViewAndRefresh('OmsOrderTypeMappingRule')
    },
    toEdit(index, row) {
      this.ruleRow = row
      this.openDialogWindow(true)
    },
    del(index, row) {
      this.editForm.conList.splice(this.data.indexOf(row), 1)
    },
    openDialogWindow(isEdit) {
      this.dialogVisible = true
    },
    closeDialogWindow(data) {
      this.dialogVisible = false
    },
    updateRuleData(data) {
      this.editForm.conList = data
    },
    _init() {
      this._listOrderTypes()
      if (!this.isEdit) {
        this._loadCode()
      } else {
        this._get()
      }
    },
    _get() {
      this.$oms.$api.soTypeMappingRule
        .soTypeMappingRuleGet({ id: this.$route.params.id })
        .then(data => {
          this.editForm = data.data
          this.data = this.editForm.conList
          this.$set(this.editForm, 'dateRange', [new Date(), new Date()])
          this.editForm.dateRange = [
            this.editForm.startDate,
            this.editForm.endDate
          ]
          this.$delete(this.editForm.startDate)
          this.$delete(this.editForm.endDate)
        })
    },
    _listOrderTypes() {
      this.$oms.$api.soType.soTypeList({}).then(data => {
        this.orderTypes = data.data
        this.orderTypeMap = Object.assign({})
        this.orderTypes.forEach(item => {
          this.orderTypeMap[item.code] = item.name
        })
      })
    },
    _loadCode() {
      this.$oms.$api.soTypeMappingRule
        .soTypeMappingRuleCreateCode()
        .then(data => {
          this.code = data.data
        })
    }
  }
}
</script>
