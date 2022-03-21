<template>
  <section>
    <el-card>
      <el-row>
        <el-col :span="12">
          <el-form ref="info" :model="info" :rules="rules" label-width="240px">
            <el-form-item
              v-show="$route.params.id"
              :label="$t('order_rule_id')"
              required="true"
            >
              <div>{{ info.id }}</div>
            </el-form-item>
            <el-form-item :label="$t('order_priority')" prop="priority">
              <el-input-number
                :precision="0"
                :min="1"
                :max="999"
                v-model="info.priority"
                :placeholder="$t('输入1-999的正整数')"
                name="info_priority"
              />
            </el-form-item>
            <el-form-item :label="$t('order_ruleCode')">
              <div>{{ info.code }}</div>
            </el-form-item>
            <el-form-item
              :label="$t('order_ruleName')"
              required="true"
              prop="name"
            >
              <el-input v-model="info.name" name="info_name" />
            </el-form-item>
            <el-form-item :label="$t('order_ruleMerchant')">
              <el-select
                v-model="info.merchantId"
                :popper-append-to-body="false"
                :placeholder="$t('please_choose')"
                name="info_merchantId"
                @change="changeRule()"
              >
                <el-option
                  v-for="item in merchantList"
                  :key="item.merchantId"
                  :label="item.merchantName"
                  :value="item.merchantId"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('order_rule_disable')"
              required="true"
              prop="isDisable"
            >
              <el-radio
                v-model="info.isDisable"
                :label="0"
                name="info_isDisable"
              >{{ $t("available") }}</el-radio
              >
              <el-radio
                v-model="info.isDisable"
                :label="1"
                name="info_isDisable4"
              >{{ $t("Unavailable") }}</el-radio
              >
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
              <el-input
                :rows="2"
                v-model="info.remark"
                name="info_remark"
                type="textarea"
              />
            </el-form-item>
            <el-form-item :label="$t('order_rule_disable')" required="true">
              <el-radio-group
                v-model="info.strategyType"
                name="info_strategyType"
              >
                <el-radio
                  v-for="item in routingRuleList"
                  :label="item.code"
                  :key="item.id"
                  @change="changeRule()"
                >{{ item.name }}</el-radio
                >
              </el-radio-group>
              <!--<el-radio v-model="info.strategyType" :label="1" name="info_strategyType2">{{ $t('order_receiving_frequency') }}</el-radio>
              <el-radio v-model="info.strategyType" :label="2" name="info_strategyType7">{{ $t('order_receiving_inventory') }}</el-radio>-->
            </el-form-item>
            <el-form-item
              v-if="info.strategyType === 3"
              :label="$t('选择仓库')"
              required="true"
            >
              <el-select
                v-model="info.assignWarehouseId"
                :placeholder="$t('please_choose')"
                name="info_assignWarehouseId"
              >
                <el-option
                  v-for="item in warehouseList"
                  :key="item.id"
                  :label="item.warehouseName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form ref="form" label-width="240px">
            <el-form-item
              :label="$t('order_match_variable')"
              required="true"
              prop="variable"
            >
              <ody-list-table-area>
                <div slot="btn">
                  <ody-button
                    name="OmsRoutingWarehouseRuleConditionAdd_addVariable"
                    size="small"
                    type="primary"
                    code="OmsRoutingWarehouseRuleConditionAdd"
                    @click="addVariable(false)"
                  >{{ $t("order_match_variable") }}</ody-button
                  >
                </div>
                <div slot="table">
                  <ody-table
                    :loading="loading"
                    :data="data"
                    :columns="columns"
                    :operates="operates"
                    :checked.sync="checked"
                    :can-filter="false"
                    name="data146"
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
          name="OmsRoutingWarehouseRule_Save_handleSubmit"
          code="OmsRoutingWarehouseRule_Save"
          size="small"
          type="primary"
          @click="handleSubmit"
        >{{ $t("common_save") }}</ody-button
        >
        <el-button name="returnBack" size="small" @click="returnBack">{{
          $t("common_back")
        }}</el-button>
      </ody-fixed>
      <div>
        <div>
          <ruleWindow
            :dialog-visible="dialogVisible"
            :data="data"
            :row="ruleRow"
            :rule-type="1"
            name="data211"
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
      rules: {
        priority: [
          { required: true, message: this.$t('请输入优先级'), trigger: 'blur' }
        ],
        name: [
          {
            required: true,
            type: 'string',
            message: this.$t('required'),
            trigger: 'blur'
          },
          {
            required: true,
            type: 'string',
            message: this.$t('required'),
            trigger: 'change'
          }
        ]
      },
      dialogVisible: false,
      info: {
        isDisable: 1,
        dateArea: [sDate, eDate],
        deleteIds: [],
        assignWarehouseId: null
      },
      data: [],
      merchantList: [],
      searchForm: getDefaultSearchForm(),
      isDisableList: [],
      routingRuleList: [],
      warehouseList: [],
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
            code: 'OmsRoutingWarehouseRule_Condition_Edit'
          },
          {
            label: this.$t('delete'),
            disabled: false,
            method(index, row) {
              self.handleDel(index, row)
            },
            code: 'OmsRoutingWarehouseRule_Condition_Delete'
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
      this.data = data
    },
    async addVariable(isUpdate) {
      if (!isUpdate) {
        this.ruleRow = {}
      }
      this.dialogVisible = true
    },
    handleSubmit() {
      this.$refs['info'].validate((valid) => {
        if (!valid) {
          return
        }
        this.info.conList = this.data
        if (!this.info.conList || this.info.conList.length === 0) {
          this.$message({
            type: 'warning',
            message: this.$t('rule_not_be_empty')
          })
          return
        }
        if (this.info.strategyType === 3) {
          if (!this.info.assignWarehouseId) {
            this.$message({
              type: 'error',
              message: this.$t('请选择指定仓库！')
            })
            return
          }
          this.warehouseList.forEach((warehouse) => {
            if (this.info.assignWarehouseId === warehouse.id) {
              this.info.assignWarehouseName = warehouse.warehouseName
              this.info.assignWarehouseCode = warehouse.warehouseCode
              this.info.assignWarehouseWmsSwitch = warehouse.wmsSwitch
            }
          })
        }
        this.info.startDate = formatDateTime(this.info.dateArea[0])
        this.info.endDate = formatDateTime(this.info.dateArea[1])
        if (this.info.merchantId) {
          this.$set(
            this.info,
            'merchantName',
            this.merchantMap[this.info.merchantId]
          )
        }
        if (this.$route.params.id) {
          // update
          this.$oms.$api.mappingWarehouseRule
            .routingWarehouseRuleUpdate(this.info)
            .then((data) => {
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
          this.$oms.$api.mappingWarehouseRule
            .routingWarehouseRuleAdd(this.info)
            .then((data) => {
              if (data.code === '0') {
                this.$message({
                  type: 'success',
                  message: this.$t('common_save_success')
                })
                this.returnBack()
              }
            })
        }
      })
    },
    returnBack() {
      /* this.$portal.delActiveView()
      this.$router.push({
        name: 'OmsRoutingWarehouseRule',
        params: {}
      })*/
      this.$portal.delActiveViewAndRefresh('OmsRoutingWarehouseRule')
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
    initCodes() {
      this.$oms.$api.common
        .listByCategorysForOrder({
          categorys: ['IS_DISABLE', 'ROUTING_WAREHOUSING_RULES']
        })
        .then((data) => {
          this.isDisableList = data.data.IS_DISABLE
          this.isDisableMap = data.data.IS_DISABLE.reduce((m, i) => {
            m[i.code] = i.name
            return m
          }, {})
          this.routingRuleList = data.data.ROUTING_WAREHOUSING_RULES
          for (var i = 0; i < this.routingRuleList.length; i++) {
            this.routingRuleList[i].code = parseInt(
              this.routingRuleList[i].code
            )
          }
        })
    },
    initMerchants() {
      this.$oms.$api.common
        .merchantList({ currentPage: 1, itemsPerPage: 1000 })
        .then((data) => {
          this.merchantList = data.data.listObj
          this.merchantMap = data.data.listObj.reduce((m, i) => {
            m[i.merchantId] = i.merchantName
            return m
          }, {})
        })
    },
    init() {
      this.initCodes()
      this.initMerchants()

      if (this.$route.params.id) {
        getInfo(this)
      } else {
        createCode(this)
      }
    },
    getNumber(obj, key, float) {
      var val = obj[key]
      if (isNaN(val)) {
        val = (val + '').replace(/[^\d]/g, '')
      } else if (val === '' || (float && (val + '').endsWith('.'))) {
        val = (val + '').trim()
      } else {
        val = Number(val)
      }
      obj[key] = val
      // this.$forceUpdate()
    },
    changeRule() {
      this.info.assignWarehouseId = null
      this.getWarehouseListByMerchant()
    },
    getWarehouseListByMerchant() {
      if (this.info.strategyType === 3) {
        if (!this.info.merchantId) {
          this.$message({
            type: 'error',
            message: this.$t('请先选择一个规则适用商家！')
          })
        } else {
          this.getWarehouseList(this.info.merchantId)
        }
      }
    },
    getWarehouseList(merchantIdParam) {
      this.$oms.$api.common
        .queryWarehouseAddress({
          currentPage: 1,
          itemsPerPage: 500,
          merchantId: merchantIdParam,
          isVirtualWarehouse: 0
        })
        .then((data) => {
          this.warehouseList = data.data.listObj
        })
    }
  }
}
function getDefaultSearchForm() {
  return Object.assign({}, {})
}

function createCode(vue) {
  vue.$oms.$api.mappingWarehouseRule
    .routingWarehouseRuleCreateCode()
    .then((res) => {
      vue.$set(vue.info, 'code', res.data)
      vue.$set(vue.info, 'isDisable', 0)
      vue.$set(vue.info, 'strategyType', 1)
    })
}

function getInfo(vue) {
  const param = {
    id: vue.$route.params.id
  }
  const rule = vue.$oms.$api.mappingWarehouseRule
  rule.routingWarehouseRuleGet(param).then((res) => {
    vue.info = res.data
    vue.data = res.data.conList
    var dateArea = []
    var sta_str = vue.info.startDate.replace(/-/g, '/')
    var end_str = vue.info.endDate.replace(/-/g, '/')
    dateArea.push(new Date(sta_str))
    dateArea.push(new Date(end_str))
    vue.$set(vue.info, 'dateArea', dateArea)
    vue.info.deleteIds = []
    if (res.data.strategyType === 3) {
      vue.getWarehouseList(res.data.merchantId)
    }
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
.el-select-dropdown {
  max-height: 300px;
}
</style>
