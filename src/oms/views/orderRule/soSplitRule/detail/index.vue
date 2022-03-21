<template>
  <section>
    <el-card>
      <el-form ref="form" :rules="rules" :model="info" label-width="240px">
        <el-row>
          <el-col :span="18">
            <el-form-item :label="$t('order_priority')" prop="priority">
              <el-input v-model="info.priority" name="info_priority" />
            </el-form-item>
            <el-form-item :label="$t('order_ruleCode')" prop="code">
              <div>{{ info.code }}</div>
            </el-form-item>
            <el-form-item :label="$t('order_ruleName')" prop="name">
              <el-input v-model="info.name" name="info_name" />
            </el-form-item>
            <el-form-item :label="$t('order_rule_disable')">
              <el-radio-group v-model="info.isDisable" name="info_isDisable">
                <el-radio
                  v-for="item in isDisableList"
                  :key="item.code"
                  :label="item.code"
                >{{ item.name }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('order_validity')" prop="dateArea">
              <el-date-picker
                v-model="info.dateArea"
                name="info_dateArea"
                type="daterange"
                align="right"
                format="yyyy-MM-dd"
                unlink-panels
                range-separator="-"
                @change="handleDateChange"
              />
            </el-form-item>
            <el-form-item :label="$t('payment_type_remark')">
              <el-input :rows="2" v-model="info.remark" name="info_remark" type="textarea" />
            </el-form-item>
            <el-form-item :label="$t('split_type')" prop="dimension">
              <el-checkbox-group v-model="info.dimension" name="info_dimension" @change="handleDimensionChange">
                <el-checkbox
                  v-for="item in splitRuleList"
                  :key="item.code"
                  :label="item.code"
                >{{ item.name }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item :label="$t('order_match_variable')" prop="conList">
              <ody-list-table-area>
                <div slot="btn">
                  <ody-button
                    name="OmsSoSplitRuleConditionAdd_addVariable"
                    size="small"
                    type="primary"
                    code="OmsSoSplitRuleConditionAdd"
                    @click="addVariable(false)"
                  >{{ $t('order_match_variable') }}</ody-button>
                </div>
                <div slot="table">
                  <ody-table
                    :loading="loading"
                    :data="data"
                    :columns="columns"
                    :operates="operates"
                    :can-filter="false"
                    name="data621"
                  />
                </div>
              </ody-list-table-area>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <ody-fixed>
        <ody-button
          :disabled="submiting"
          name="OmsSoSplitRule_Save_saveDetail"
          code="OmsSoSplitRule_Save"
          size="small"
          type="primary"
          @click="saveDetail"
        >{{ $t('common_save') }}</ody-button>
        <el-button name="returnBack" size="small" @click="returnBack">{{ $t('common_back') }}</el-button>
      </ody-fixed>

      <div>
        <ruleWindow
          :dialog-visible="dialogVisible"
          :data="data"
          :row="ruleRow"
          :rule-type="6"
          name="data243"
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
  name: 'OmsSoSplitRuleDetail',
  components: {
    ruleWindow
  },
  data() {
    const self = this
    return {
      dialogVisible: false,
      submiting: false,
      info: getDefalutInfo(),
      data: [],
      dimensionValueArr: [],
      ruleRow: {},
      auditReasonList: [],
      isDisableList: [],
      splitRuleList: [],
      columns: [
        {
          show: true,
          prop: 'variableName',
          label: this.$t('order_variable_name'),
          align: 'center',
          minWidth: 160
        },
        {
          show: true,
          prop: 'operator',
          label: this.$t('order_operator'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'variableValueDesc',
          label: this.$t('order_variable_value'),
          align: 'center',
          minWidth: 360,
          render: (h, params) => {
            const row = params.row
            let item = []
            const variableValueDesc = JSON.parse(row.variableValueDesc)
            const variableValue = JSON.parse(row.variableValue)
            if (variableValueDesc) {
              item = variableValueDesc
            } else if (variableValue) {
              item = variableValue
            }
            const str = item.join(',')
            let commonYes
            if (!variableValue) {
              commonYes = <span>{this.$t('common_yes')}</span>
            }
            return (
              <span>
                {commonYes}
                {str}{' '}
              </span>
            )
          }
        }
      ], // 需要展示的列
      operates: {
        width: 200,
        fixed: 'right',
        list: [
          {
            label: this.$t('edit'),
            disabled: false,
            method(index, row) {
              self.handleEdit(index, row)
            },
            code: 'OmsSoSplitRule_Condition_Edit'
          },
          {
            label: this.$t('delete'),
            disabled: false,
            method(index, row) {
              self.handleDel(index, row)
            },
            code: 'OmsSoSplitRule_Condition_Delete'
          }
        ]
      },
      rules: {
        priority: [
          { required: true, message: this.$t('required'), trigger: 'blur' },
          { validator: this.validatePriority, trigger: 'blur' }
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
        dateArea: [
          {
            required: true,
            type: 'array',
            message: this.$t('required'),
            trigger: 'change'
          }
        ],
        dimension: [
          {
            required: true,
            type: 'array',
            message: this.$t('required'),
            trigger: 'change'
          }
        ],
        conList: [
          {
            required: true,
            type: 'array',
            message: this.$t('required'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    validatePriority(rule, value, callback) {
      var pattern = /^\d{1,9}$/
      if (pattern.test(value)) {
        return callback()
      }
      return callback(new Error(this.$t('order_priority_pattern_invaild')))
    },
    handleDimensionChange(val) {
      if (val && val.length > 0) {
        this.info.splitDimension = val.join(',')
      } else {
        delete this.info.splitDimension
      }
    },
    handleDateChange(val) {
      if (val && val.length > 0) {
        this.info.startDate = formatDateTime(this.info.dateArea[0])
        this.info.endDate = formatDateTime(this.info.dateArea[1])
      } else {
        delete this.info.startDate
        delete this.info.endDate
      }
    },
    closeDialogWindow(data) {
      this.dialogVisible = false
    },
    updateRuleData(data) {
      this.data = data
      this.info.conList = data
    },
    async initCodes() {
      const vue = this
      const res = await this.$oms.$api.common.listByCategorysForOrder({
        categorys: ['IS_DISABLE', 'SPLIT_RULE']
      })
      if (res) {
        this.isDisableList = res.data.IS_DISABLE
        if (!vue.$route.params.id) {
          vue.info.isDisable = this.isDisableList[0].code
        }
        vue.splitRuleList = res.data.SPLIT_RULE
        if (vue.splitRuleList) {
          vue.splitRuleList.forEach(element => {
            vue.dimensionValueArr.push(element.code)
          })
        }
      }
    },
    async saveDetail() {
      const vue = this
      this.$refs['form'].validate(valid => {
        if (valid) {
          vue.submiting = true

          if (!vue.info.name || !vue.info.dateArea) {
            vue.$message({
              type: 'warning',
              message: vue.$t('form_invalid')
            })
            vue.submiting = false
            return
          }
          if (!vue.info.conList || vue.info.conList.length === 0) {
            vue.$message({
              type: 'warning',
              message: vue.$t('rule_not_be_empty')
            })
            vue.submiting = false
            return
          }

          let promise = vue.$oms.$api.soSplitRule.soSplitRuleAdd
          if (vue.$route.params.id) {
            promise = vue.$oms.$api.soSplitRule.soSplitRuleUpdate
          }
          promise(vue.info)
            .then(res => {
              if (res.code === '0') {
                vue.$message({
                  type: 'success',
                  message: vue.$t('common_save_success')
                })
                vue.returnBack()
              } else {
                vue.$message({
                  type: 'error',
                  message: res.message
                })
              }
            })
            .finally(() => {
              vue.submiting = false
            })
        } else {
          console.info('no validate')
        }
      })
    },
    returnBack() {
      // this.$portal.delActiveView()
      this.$portal.delActiveViewAndRefresh('OmsSoSplitRule')
    },
    async addVariable(isUpdate) {
      if (!isUpdate) {
        this.ruleRow = {}
      }
      this.dialogVisible = true
    },
    async handleEdit(index, row) {
      this.ruleRow = row
      this.$set(this.ruleRow, 'index', this.data.indexOf(row))
      await this.addVariable(true)
    },
    async handleDel(index, row) {
      const vue = this
      this.$confirm(this.$t('delete_confirm'), this.$t('prompt'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: this.$t('promptOperateSuccess')
          })
          var delIds = vue.info.deleteIds
          delIds.push(row.id)
          vue.data.splice(vue.data.indexOf(row), 1)
          vue.info.conList = vue.data
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common_cancel_success')
          })
        })
    },
    async init() {
      await this.initCodes()
      if (this.$route.params.id) {
        getInfo(this)
      } else {
        createCode(this)
      }
    }
  }
}

// 格式化日期
function formatDateTime(date) {
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  var d = date.getDate()
  d = d < 10 ? '0' + d : d
  return y + '-' + m + '-' + d
}

function createCode(vue) {
  vue.$oms.$api.soSplitRule.soSplitRuleCreateCode().then(res => {
    if (res.code === '0') {
      vue.info.code = res.data
    } else {
      vue.$message({
        type: 'error',
        message: res.message
      })
    }
  })
}

function getInfo(vue) {
  const param = {
    id: vue.$route.params.id
  }
  const rule = vue.$oms.$api.soSplitRule
  rule.soSplitRuleGet(param).then(res => {
    if (res.code === '0') {
      vue.info = Object.assign(getDefalutInfo(), res.data)
      vue.info.isDisable = vue.info.isDisable + ''
      vue.data = res.data.conList
      var dateArea = []
      var sta_str = vue.info.startDate.replace(/-/g, '/')
      var end_str = vue.info.endDate.replace(/-/g, '/')
      dateArea.push(new Date(sta_str))
      dateArea.push(new Date(end_str))
      vue.info.dateArea = dateArea
      vue.info.deleteIds = []
      if (vue.info.splitDimension) {
        vue.info.dimension = []
        const arr = vue.info.splitDimension.split(',')
        arr.forEach(item => {
          vue.info.dimension.push(item)
        })
      }
    } else {
      vue.$message({
        type: 'error',
        message: res.message
      })
    }
  })
}
function getDefalutInfo() {
  const sDate = new Date()
  const eDate = new Date(new Date().setDate(sDate.getDate() + 365))
  return {
    deleteIds: [],
    dateArea: [sDate, eDate],
    startDate: formatDateTime(sDate),
    endDate: formatDateTime(eDate),
    dimension: [],
    conList: [],
    splitDimension: null,
    isDisable: '0',
    code: ''
  }
}
</script>

<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
