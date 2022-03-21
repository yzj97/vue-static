<template>
  <section>
    <el-card class="box-card">
      <el-row>
        <el-col :span="12">
          <el-form ref="form" label-width="240px">
            <el-form-item :label="$t('order_ruleCode')">
              <div>{{ info.code }}</div>
            </el-form-item>
            <el-form-item :label="$t('order_ruleName')" required="true">
              <el-input v-model="info.name" name="info_name" />
            </el-form-item>
            <el-form-item :label="$t('order_priority')" required="true">
              <!-- :placeholder="$t('orderRule_placeholder_timeoutMinutes_invalid')" -->
              <el-input-number :precision="0" :min="1" :max="999" v-model="info.priority" name="info_priority" />
            </el-form-item>
            <el-form-item :label="$t('order_ruleMerchant')">
              <el-select v-model="info.merchantId" :popper-append-to-body="false" :placeholder="$t('no_exist')" name="info_merchantId">
                <el-option :label="$t('no_exist')" value />
                <el-option
                  v-for="item in merchantList"
                  :key="item.merchantId"
                  :label="item.merchantName"
                  :value="item.merchantId"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('order_rule_disable')">
              <el-radio v-model="info.isDisable" :label="0" name="info_isDisable">{{ $t('enableBtn') }}</el-radio>
              <el-radio v-model="info.isDisable" :label="1" name="info_isDisable8">{{ $t('disableBtn') }}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('order_validity')" required="true">
              <el-date-picker
                v-model="info.dateArea"
                name="info_dateArea"
                type="daterange"
                align="right"
                format="yyyy-MM-dd"
                unlink-panels
                range-separator="-"
              />
            </el-form-item>
            <el-form-item :label="$t('payment_type_remark')">
              <el-input :rows="2" v-model="info.remark" name="info_remark" type="textarea" />
            </el-form-item>
            <el-form-item :label="$t('order_approve_rule_reason_type')" required="true">
              <el-select v-model="info.reasonType" :placeholder="$t('please_choose')" name="info_reasonType">
                <el-option
                  v-for="item in auditTypeList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('order_approve_rule_reason')" required="true">
              <el-select v-model="info.reason" :placeholder="$t('please_choose')" name="info_reason">
                <el-option
                  v-for="item in auditReasonList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('order_approce_email')">
              <el-input v-model="info.notifyEmails" name="info_notifyEmails" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form ref="form" label-width="240px">
            <el-form-item :label="$t('order_match_variable')" required="true">
              <ody-list-table-area>
                <div slot="btn">
                  <ody-button
                    name="OmsOrderAuditRuleConditionAdd_addVariable"
                    size="small"
                    type="primary"
                    code="OmsOrderAuditRuleConditionAdd"
                    @click="addVariable(false)"
                  >{{ $t('order_match_variable') }}</ody-button>
                </div>
                <div slot="table">
                  <ody-table
                    :loading="loading"
                    :data="data"
                    :columns="columns"
                    :operates="operates"
                    :checked.sync="checked"
                    :can-filter="false"
                    name="data695"
                    @custom-sort-change="hanleCustomSortChange"
                    @selection-change="handleSelectionChange"
                  />
                </div>
              </ody-list-table-area>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <ody-fixed>
        <ody-button
          name="OmsOrderAuditRule_Save_saveDetail"
          code="OmsOrderAuditRule_Save"
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
          :rule-type="2"
          name="data777"
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
  components: {
    ruleWindow
  },
  data() {
    const self = this
    const sDate = new Date()
    const eDate = new Date(new Date().setDate(sDate.getDate() + 365))
    return {
      dialogVisible: false,
      info: { isDisable: 1, dateArea: [sDate, eDate], deleteIds: [] },
      data: [],
      ruleRow: {},
      auditReasonList: [],
      isDisableList: [],
      merchantList: [],
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
          formatter: (row, column, cellValue) => {
            if (row.variableId === 8) {
              // 订单备注
              return '是'
            }
            if (row.operator === 'is not null' || row.operator === 'is null') {
              return '是'
            }
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
            label: this.$t('edit'),
            disabled: false,
            method(index, row) {
              self.handleEdit(index, row)
            },
            code: 'OmsOrderAuditRule_Condition_Edit'
          },
          {
            label: this.$t('delete'),
            disabled: false,
            method(index, row) {
              self.handleDel(index, row)
            },
            code: 'OmsOrderAuditRule_Condition_Delete'
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    closeDialogWindow(data) {
      this.dialogVisible = false
    },
    updateRuleData(data) {
      console.log(data)
      this.data = data
    },
    async initCodes() {
      this.$oms.$api.common
        .listByCategorysForOrder({
          categorys: ['IS_DISABLE', 'AUDIT_REASON', 'AUDIT_TYPE']
        })
        .then(data => {
          this.isDisableList = data.data.IS_DISABLE
          this.isDisableMap = data.data.IS_DISABLE.reduce((m, i) => {
            m[i.code] = i.name
            return m
          }, {})
          this.auditReasonList = data.data.AUDIT_REASON
          this.auditReasonMap = data.data.AUDIT_REASON.reduce((m, i) => {
            m[i.code] = i.name
            return m
          }, {})
          this.auditTypeList = data.data.AUDIT_TYPE
          this.auditTypeMap = data.data.AUDIT_TYPE.reduce((m, i) => {
            m[i.code] = i.name
            return m
          }, {})
        })
    },
    async initMerchants() {
      this.$oms.$api.common
        .merchantList({ currentPage: 1, itemsPerPage: 1000 })
        .then(data => {
          this.merchantList = data.data.listObj
          this.merchantMap = data.data.listObj.reduce((m, i) => {
            m[i.merchantId] = i.merchantName
            return m
          }, {})
        })
    },
    saveDetail() {
      this.info.startDate = formatDateTime(this.info.dateArea[0])
      this.info.endDate = formatDateTime(this.info.dateArea[1])
      this.info.conList = this.data

      if (
        this.info.name === '' ||
        this.info.dateArea === '' ||
        this.info.reasonType === '' ||
        this.info.reason === '' ||
        this.info.conList === '' ||
        this.info.conList.length === 0
      ) {
        this.$message({
          type: 'warning',
          message: this.$t('form_invalid')
        })
        return
      }
      if (!this.info.priority || this.info.priority < 0) {
        this.$message({
          type: 'warning',
          message: this.$t('form_invalid')
        })
        return
      }
      if (this.info.merchantId) {
        this.$set(
          this.info,
          'merchantName',
          this.merchantMap[this.info.merchantId]
        )
      } else {
        this.info.merchantName = null
      }
      if (this.$route.query.id) {
        // update
        this.$oms.$api.soApproveRule
          .soApproveRuleUpdate(this.info)
          .then(data => {
            if (data.code === '0') {
              this.$message({
                type: 'success',
                message: this.$t('common_save_success')
              })
              this.returnBack()
            }
          })
      } else {
        // add
        this.$oms.$api.soApproveRule.soApproveRuleAdd(this.info).then(data => {
          if (data.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('common_save_success')
            })
            this.returnBack()
          }
        })
      }
    },
    returnBack() {
      // history.back(-1)
      this.$portal.delActiveViewAndRefresh('OmsOrderAuditRule')
    },
    async addVariable(isUpdate) {
      if (!isUpdate) {
        // this.$delete(this.ruleRow.ruleInfo,"index")
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
          var delIds = this.info.deleteIds
          delIds.push(row.id)
          this.data.splice(this.data.indexOf(row), 1)
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
      await this.initMerchants()
      if (this.$route.query.id) {
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
  vue.$oms.$api.mappingWarehouseRule
    .routingWarehouseRuleCreateCode()
    .then(res => {
      vue.info.code = res.data
    })
}

function getInfo(vue) {
  const param = {
    id: vue.$route.query.id
  }
  const rule = vue.$oms.$api.soApproveRule
  rule.soApproveRuleGet(param).then(res => {
    vue.info = res.data
    vue.data = res.data.conList
    var dateArea = []
    var sta_str = vue.info.startDate.replace(/-/g, '/')
    var end_str = vue.info.endDate.replace(/-/g, '/')
    dateArea.push(new Date(sta_str))
    dateArea.push(new Date(end_str))
    vue.$set(vue.info, 'dateArea', dateArea)
    vue.info.deleteIds = []
  })
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
