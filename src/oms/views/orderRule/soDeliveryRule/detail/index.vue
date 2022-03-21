<template>
  <section>
    <el-card class="box-card">
      <el-row>
        <el-col :span="12">
          <el-form ref="form" label-width="240px">
            <el-form-item :label="$t('order_ruleName')" required="true">
              <el-input v-model="info.name" name="info_name" maxlength="50" />
            </el-form-item>
            <el-form-item :label="$t('order_ruleMerchant')" required="true">
              <el-select
                v-model="info.merchantId"
                :popper-append-to-body="false"
                name="info_merchantId"
                @change="info.deliveryCompanyId = null"
              >
                <el-option
                  v-for="item in merchantList"
                  :key="item.merchantId"
                  :label="item.merchantName"
                  :value="item.merchantId"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('order_priority')" required="true">
              <el-input-number
                :precision="0"
                :min="1"
                :max="999"
                :placeholder="$t('输入1-999的正整数')"
                v-model="info.priority"
                name="info_priority"
              />
            </el-form-item>
            <el-form-item
              :label="$t('so_pick_delivery_merchant')"
              required="true"
            >
              <el-select
                v-model="info.deliveryCompanyId"
                :popper-append-to-body="false"
                name="info_deliveryCompanyId"
              >
                <el-option
                  v-for="item in filterDeliveryCompanyList"
                  :key="item.deliveryCompanyId"
                  :label="item.deliveryCompanyName"
                  :value="item.deliveryCompanyId"
                />
              </el-select>
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
                    name="OmsSoDeliveryRuleListConditionAdd_addVariable"
                    size="small"
                    type="primary"
                    code="OmsSoDeliveryRuleListConditionAdd"
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
                    name="data457"
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
          :disabled="saveing"
          name="OmsSoDeliveryRuleList_Save_saveDetail"
          code="OmsSoDeliveryRuleList_Save"
          size="small"
          type="primary"
          @click="saveDetail"
        >{{ $t("common_save") }}</ody-button
        >
        <el-button name="returnBack" size="small" @click="returnBack">{{
          $t("common_back")
        }}</el-button>
      </ody-fixed>

      <div>
        <ruleWindow
          :dialog-visible="dialogVisible"
          :merchant-list="merchantList"
          :data="data"
          :row="ruleRow"
          :rule-type="9"
          name="data315"
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
  name: 'OmsSoDeliveryRuleDetail',
  components: {
    ruleWindow
  },
  data() {
    const self = this
    return {
      saveing: false,
      dialogVisible: false,
      info: {
        isDisable: 1,
        deleteIds: [],
        deliveryCompanyId: null,
        name: null,
        merchantId: null,
        priority: null
      },
      data: [],
      ruleRow: {},
      isDisableList: [],
      merchantList: [],
      deliveryCompanyList: [],
      columns: [
        {
          show: true,
          prop: 'variableName',
          label: this.$t('order_variable_name'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'operator',
          label: this.$t('order_operator'),
          align: 'center',
          minWidth: 70
        },
        {
          show: true,
          prop: 'variableValueDesc',
          label: this.$t('order_variable_value'),
          align: 'center',
          minWidth: 360,
          formatter: (row, column, cellValue) => {
            if (row.variableId === 8) {
              return '是'
            }
            var str = row.variableValueDesc
            str = str.replace(/[\"\[\]]/g, '')
            if (str.length >= 33) {
              str = str.substring(0, 30) + '...'
            }
            return str
          }
        }
      ], // 需要展示的列
      operates: {
        width: 180,
        fixed: 'right',
        list: [
          {
            label: this.$t('edit'),
            disabled: false,
            method(index, row) {
              self.handleEdit(index, row)
            },
            code: 'OmsSoDeliveryRuleList_Condition_Edit'
          },
          {
            label: this.$t('delete'),
            disabled: false,
            method(index, row) {
              self.handleDel(index, row)
            },
            code: 'OmsSoDeliveryRuleList_Condition_Delete'
          }
        ]
      }
    }
  },
  computed: {
    filterDeliveryCompanyList: function() {
      if (this.deliveryCompanyList && this.info && this.info.merchantId) {
        return this.deliveryCompanyList.filter(
          (item) => this.info.merchantId === item.merchantId
        )
      }
      return this.deliveryCompanyList
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
    async initDeliveryCompanies() {
      this.$oms.$api.soDeliveryRule
        .merchantExpressConfigListPage({ page: 1, limit: 2000, filters: {}})
        .then((data) => {
          this.deliveryCompanyList = data.data
          this.deliveryCompanyMap = data.data.reduce((m, i) => {
            m[i.deliveryCompanyId] = i.deliveryCompanyName
            return m
          }, {})
        })
    },
    async initMerchants() {
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
    saveDetail() {
      this.info.conList = this.data
      if (
        !this.info.name ||
        !this.info.merchantId ||
        this.info.priority == null ||
        this.info.deliveryCompanyId == null ||
        this.info.deliveryCompanyId === '' ||
        this.info.conList.length <= 0
      ) {
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
      }
      if (this.info.deliveryCompanyId) {
        this.$set(
          this.info,
          'deliveryCompanyName',
          this.deliveryCompanyMap[this.info.deliveryCompanyId]
        )
      }
      this.saveing = true
      if (this.$route.query.id) {
        // update
        this.$oms.$api.soDeliveryRule
          .soDeliveryRuleUpdate(this.info)
          .then((data) => {
            if (data.code === '0') {
              this.$message({
                type: 'success',
                message: this.$t('common_save_success')
              })
              this.returnBack()
            }
          })
          .finally(() => {
            this.saveing = false
          })
      } else {
        // add
        this.$oms.$api.soDeliveryRule
          .soDeliveryRuleAdd(this.info)
          .then((data) => {
            if (data.code === '0') {
              this.$message({
                type: 'success',
                message: this.$t('common_save_success')
              })
              this.returnBack()
            }
          })
          .finally(() => {
            this.saveing = false
          })
      }
    },
    returnBack() {
      // this.$portal.delActiveView()
      this.$portal.delActiveViewAndRefresh('OmsSoDeliveryRuleList')
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
      await this.initDeliveryCompanies()
      await this.initMerchants()
      if (this.$route.query.id) {
        getInfo(this)
      } else {
        createCode(this)
      }
    }
  }
}

function createCode(vue) {
  vue.$oms.$api.mappingWarehouseRule
    .routingWarehouseRuleCreateCode()
    .then((res) => {
      vue.info.code = res.data
    })
}

function getInfo(vue) {
  const param = {
    id: vue.$route.query.id
  }
  vue.$oms.$api.soDeliveryRule.soDeliveryRuleGet(param).then((res) => {
    vue.info = res.data
    vue.data = res.data.conList
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
/deep/ .el-select-dropdown {
  max-height: 300px;
}
/deep/ .el-scrollbar__view{
  max-height: 300px;
}
</style>
