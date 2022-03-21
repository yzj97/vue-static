<template>
  <section>
    <el-card>
      <el-row>
        <el-col :span="12">
          <el-form ref="info" :model="info" :rules="rules" label-width="240px">
            <!--规则编码-->
            <el-form-item :label="$t('order_ruleCode')">
              <div>{{ info.code }}</div>
            </el-form-item>
            <!--规则名称-->
            <el-form-item :label="$t('order_ruleName')" prop="name">
              <el-input
                v-model="info.name"
                :placeholder="$t('orderRule_placeholder_ruleName')"
                name="info_name"
                maxlength="20"
              />
            </el-form-item>
            <!--规则适用商家-->
            <el-form-item :label="$t('order_ruleMerchant')" prop="merchantId">
              <el-select v-model="info.merchantId" :popper-append-to-body="false" :placeholder="$t('please_choose')" name="info_merchantId">
                <el-option
                  v-for="item in merchantList"
                  :key="item.merchantId"
                  :label="item.merchantName"
                  :value="item.merchantId"
                />
              </el-select>
            </el-form-item>
            <!--规则类型-->
            <el-form-item :label="$t('orderRule_label_type')" prop="type">
              <el-select
                v-model="info.type"
                :placeholder="$t('please_choose')"
                name="info_type"
                @change="changeType"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
            <!--监控结点-->
            <el-form-item :label="$t('orderRule_label_watchNode')" prop="watchNode">
              <el-select v-model="info.watchNode" :placeholder="$t('please_choose')" name="info_watchNode">
                <el-option
                  v-for="item in typeWatchNodeList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
            <!--状态超过-->
            <el-form-item :label="$t('orderRule_label_watchNode_inner')" prop="timeoutMinutes">
              <el-input
                v-model="info.timeoutMinutes"
                :placeholder="$t('请输入1-999999的正整数')"
                name="info_timeoutMinutes"
                style="width:200px;"
              />
              {{ $t('orderRule_label_minutes_info') }}
            </el-form-item>
            <!--规则状态-->
            <el-form-item :label="$t('order_rule_disable')" prop="isDisable">
              <el-radio-group v-model="info.isDisable" name="info_isDisable">
                <el-radio v-for="(value, key) in isDisableMap" :label="key" :key="key">{{ value }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <!--有效期-->
            <el-form-item :label="$t('order_validity')" prop="dateArea">
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
            <!--备注-->
            <el-form-item :label="$t('orderRule_label_remark')">
              <el-input
                :rows="2"
                v-model="info.remark"
                :placeholder="$t('orderRule_placeholder_remark')"
                name="info_remark"
                maxlength="150"
                type="textarea"
              />
            </el-form-item>
            <!--预警通知-->
            <el-form-item :label="$t('orderRule_label_alert')" prop="notifyEmails">
              <el-checkbox
                v-model="checked"
                name="checked"
                @change="changeCheckBox"
              >{{ $t('orderRule_label_mail') }}</el-checkbox>
              <el-input
                v-model="info.notifyEmails"
                :disabled="!checked"
                :placeholder="$t('order_approce_email_placeholder')"
                name="info_notifyEmails"
                style="width: 509px; margin-left: 30px;"
              />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!--匹配条件-->
      <el-row>
        <el-col :span="22">
          <el-form ref="form" label-width="240px">
            <el-form-item :label="$t('order_match_variable')" required="true" prop="variable">
              <ody-list-table-area>
                <div slot="btn">
                  <ody-button
                    name="OmsTimeoutAlertRuleConditionAdd_addVariable"
                    size="small"
                    type="primary"
                    code="OmsTimeoutAlertRuleConditionAdd"
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
                    name="data137"
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
          name="OmsTimeoutAlertRule_Save_handleSubmit"
          code="OmsTimeoutAlertRule_Save"
          size="small"
          type="primary"
          @click="handleSubmit"
        >{{ $t('common_save') }}</ody-button>
        <el-button name="returnBack" size="small" @click="returnBack">{{ $t('common_back') }}</el-button>
      </ody-fixed>
      <div>
        <div>
          <ruleWindow
            :dialog-visible="dialogVisible"
            :data="data"
            :row="ruleRow"
            :rule-type="4"
            name="data836"
            @closeDialog="closeDialogWindow"
            @updateRuleData="updateRuleData"
          />
        </div>
      </div>
    </el-card>
  </section>
</template>

<script>
import ruleWindow from '@/components/ruleWindow'
export default {
  name: 'OmsTimeoutAlertRuleDetail',
  components: {
    ruleWindow,
    expandDom: {
      props: {
        column: {
          required: true
        },
        row: {
          required: true
        }
      },
      render(h) {
        return h('div', {}, [this.column.render(this.row, this.column)])
      }
    }
  },
  data() {
    const self = this
    const sDate = new Date()
    const eDate = new Date(new Date().setDate(sDate.getDate() + 365))
    return {
      checked: true,
      rules: {
        name: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        merchantId: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        type: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        watchNode: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        isDisable: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        dateArea: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        notifyEmails: [
          { validator: this.validateNotifyEmails, trigger: 'blur' }
        ],
        timeoutMinutes: [
          { required: true, message: this.$t('required'), trigger: 'change' },
          { validator: this.checkTimeoutMinutes, trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      info: {
        code: '',
        isDisable: '0',
        dateArea: [sDate, eDate],
        deleteIds: [],
        merchantId: '',
        type: '',
        watchNode: '',
        name: '',
        timeoutMinutes: null,
        remark: '',
        notifyEmails: ''
      },
      data: [],
      merchantList: [],
      searchForm: getDefaultSearchForm(),
      isDisableList: [],
      typeList: [],
      watchNodeList: [],
      typeWatchNodeList: [],
      page: 1,
      size: 10,
      total: 1,
      current: 1,
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
            code: 'OmsTimeoutAlertRule_SaveConditionEdit'
          },
          {
            label: this.$t('delete'),
            disabled: false,
            method(index, row) {
              self.handleDel(index, row)
            },
            code: 'OmsTimeoutAlertRule_SaveConditionDelete'
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    validateNotifyEmails(rule, value, callback) {
      if (value && value.length !== 0) {
        var emailArray = value.split(',')
        for (var i = 0; i < emailArray.length; i++) {
          if (
            !/^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/.test(
              emailArray[i]
            )
          ) {
            return callback(
              new Error(this.$t('order_approce_email_pattern_invaild'))
            )
          }
        }
      } else if (this.checked) {
        return callback(new Error(this.$t('required')))
      }
      return callback()
    },
    checkTimeoutMinutes(rule, value, callback) {
      if (!/^\d{1,6}$/.test(value)) {
        return callback(
          new Error(this.$t('请输入1-999999的正整数'))
        )
      } else {
        var timeoutMinutes = parseInt(value)
        if (timeoutMinutes === 0) {
          return callback(
            new Error(this.$t('请输入1-999999的正整数'))
          )
        }
      }
      return callback()
    },
    closeDialogWindow(data) {
      this.dialogVisible = false
    },
    updateRuleData(data) {
      this.data = data
    },
    async addVariable(isUpdate) {
      if (!isUpdate) {
        this.ruleRow = {}
      }
      this.dialogVisible = true
    },
    async handleSubmit() {
      const vue = this
      this.$refs['info'].validate(valid => {
        if (!valid) {
          return
        }
        vue.info.conList = vue.data
        // console.log('表单数据' + JSON.stringify(this.info.conList))
        if (!vue.info.conList || vue.info.conList.length === 0) {
          vue.$message({
            type: 'warning',
            message: this.$t('rule_not_be_empty')
          })
          return
        }
        vue.info.startDate = formatDateTime(vue.info.dateArea[0])
        vue.info.endDate = formatDateTime(vue.info.dateArea[1])
        if (vue.info.merchantId) {
          vue.$set(
            this.info,
            'merchantName',
            vue.merchantMap[this.info.merchantId]
          )
        }
        let promise = vue.$oms.$api.timeoutAlertRule.timeoutAlertRuleAdd
        if (this.$route.params.id) {
          promise = vue.$oms.$api.timeoutAlertRule.timeoutAlertRuleUpdate
        }
        promise(vue.info).then(data => {
          if (data.code === '0') {
            vue.$message({
              type: 'success',
              message: this.$t('common_save_success')
            })
            this.returnBack()
          } else {
            vue.$message({
              type: 'warn',
              message: data.message
            })
          }
        })
      })
    },
    returnBack() {
      // this.$router.push({ name: 'OmsTimeoutAlertRule' })
      // this.$portal.delActiveView()
      this.$portal.delActiveViewAndRefresh('OmsTimeoutAlertRule')
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
          this.data.splice(index, 1)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common_cancel_success')
          })
        })
    },
    async initCodes() {
      const result = await this.$oms.$api.common.listByCategorysForOrder({
        categorys: ['IS_DISABLE', 'TIMEOUT_ALERT_TYPE', 'TIMEOUT_ALERT_NODE']
      })
      this.isDisableList = result.data.IS_DISABLE
      this.isDisableMap = result.data.IS_DISABLE.reduce((m, i) => {
        m[i.code] = i.name
        return m
      }, {})
      this.typeList = result.data.TIMEOUT_ALERT_TYPE
      // console.log(JSON.stringify(this.typeList))
      // this.typeMap = result.data.TIMEOUT_ALERT_TYPE.reduce((m, i) => { m[i.code] = i.name; return m }, {})
      this.watchNodeList = result.data.TIMEOUT_ALERT_NODE
    },
    changeType(keepNode) {
      const type = this.info.type
      this.typeWatchNodeList = []
      if (keepNode !== true) {
        this.info.watchNode = ''
      }
      if (type) {
        for (let i = 0; i < this.watchNodeList.length; i++) {
          const item = this.watchNodeList[i]
          if (item.parentCode === type) {
            this.typeWatchNodeList.push(item)
          }
        }
      }
    },
    changeCheckBox() {
      if (!this.checked) {
        this.info.notifyEmails = ''
        this.$refs['info'].validate()
      }
    },
    initMerchants() {
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
    async init() {
      await this.initCodes()
      this.initMerchants()

      if (this.$route.params.id) {
        getInfo(this)
      } else {
        createCode(this)
      }
    }
  }
}
function getDefaultSearchForm() {
  return Object.assign({}, {})
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
    id: vue.$route.params.id
  }
  const rule = vue.$oms.$api.timeoutAlertRule
  rule.timeoutAlertRuleGet(param).then(res => {
    vue.info = Object.assign(vue.info, res.data)
    vue.info.isDisable = vue.info.isDisable + ''
    vue.info.type = vue.info.type + ''
    vue.info.watchNode = vue.info.watchNode + ''
    vue.data = res.data.conList
    const dateArea = []
    const sta_str = vue.info.startDate.replace(/-/g, '/')
    const end_str = vue.info.endDate.replace(/-/g, '/')
    dateArea.push(new Date(sta_str))
    dateArea.push(new Date(end_str))
    vue.info.dateArea = dateArea
    vue.info.deleteIds = []
    if (!vue.info.notifyEmails) {
      vue.checked = false
    }
    vue.changeType(true)
  })
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
</script>

<style lang="scss" scoped>
</style>
