<template>
  <section>
    <ody-list-table-area>
      <div slot="tabs">
        <el-form ref="form" :model="params" :rules="rules" label-width="240px">
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('settleOrderCode')">
                <span>{{ params.settlementCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('orderStatusText')">
                <span>{{ params.statusText }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('paymentCreateTime')">
                <span>{{ dateFormat(params.createTime, true) }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('common_supplier_name')">
                <span>{{ params.supplierName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('common_merchant_name')">
                <span>{{ params.merchantName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('settlementCurrency')">
                <span>{{ params.currencyCode }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('chkBillWithTaxAmt')">
                <span>{{ params.chkBillWithTaxAmt }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('feeReceiptAmt')">
                <span>{{ params.feeReceiptAmt }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('feePaymentAmt')">
                <span>{{ params.feePaymentAmt }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('settleWithTaxAmt')">
                <span>{{ params.settleWithTaxAmt }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('jx_paidAmt')">
                <span>{{ params.paidAmt }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('jx_settleWithTaxAmt')">
                <span>{{ params.settleWithTaxAmt - params.paidAmt }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </ody-list-table-area>
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="activeState" name="activeState" type="card">
          <el-tab-pane :label="$t('storeInfo')" name="0">
            <el-table :data="data.storeList" name="data_storeList188" style="width: 100%">
              <el-table-column :label="$t('common_storeOrg_code')" prop="storeCode"/>
              <el-table-column :label="$t('common_store_name')" prop="storeName"/>
              <el-table-column :label="$t('storeTypeText')" prop="storeTypeName"/>
              <el-table-column :label="$t('common_store_address')" prop="detailAddress" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="$t('cheDetailsText')" name="1">
            <el-table :data="data.purchaseList" name="data_purchaseList481" style="width: 100%">
              <el-table-column :label="$t('common_store_code')" prop="storeCode"/>
              <el-table-column :label="$t('common_store_name')" prop="storeName"/>
              <el-table-column :label="$t('chkOrderCode')" prop="chkOrderCode"/>
              <el-table-column :label="$t('chkOrderType')" prop="chkOrderTypeText"/>
              <el-table-column :label="$t('refOrderCreateTime')" prop="refOrderCreateTime" min-width="120">
                <template slot-scope="scope">
                  <span>{{ dateFormat(scope.row.refOrderCreateTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('receipt_name')" prop="refOrderName"/>
              <el-table-column :label="$t('refOrderCode')" prop="refOrderCode" min-width="120"/>
              <el-table-column :label="$t('commonCurrency')" prop="currencyCode"/>
              <el-table-column :label="$t('common_exchangeRate')" prop="exchangeRate"/>
              <el-table-column :label="$t('costWithTaxAmt')" prop="payableAmt"/>
              <el-table-column :label="$t('costWithTaxBcAmt')" prop="payableBcAmt"/>
              <el-table-column :label="$t('payPlanDate')" prop="payPlanDate" min-width="120">
                <template slot-scope="scope">
                  <span>{{ dateFormat(scope.row.payPlanDate) }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('accountExpireDate')" prop="accountExpireDate" min-width="120">
                <template slot-scope="scope">
                  <span>{{ dateFormat(scope.row.accountExpireDate) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="$t('invoiceInfo')" name="2">
            <el-table :data="data.invoiceList" name="data_invoiceList257" style="width: 100%">
              <el-table-column :label="$t('invoiceNo')" prop="invoiceNo"/>
              <el-table-column :label="$t('invoiceCode')" prop="invoiceCode"/>
              <el-table-column :label="$t('invoiceTime')" prop="invoiceTime" min-width="120">
                <template slot-scope="scope">
                  <span>{{ dateFormat(scope.row.invoiceTime, true) }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('invoiceTaxedAmt')" prop="invoiceTaxedAmt"/>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="$t('common_operationLog')" name="3">
            <el-table :data="logs" name="logs861" style="width: 100%">
              <el-table-column :label="$t('common_operationUserId')" prop="operatorUserId" />
              <el-table-column :label="$t('common_operationUser')" prop="userName"/>
              <el-table-column :label="$t('common_operationTime')" prop="timeStr" min-width="120" />
              <el-table-column :label="$t('common_operation')" prop="operatorType" />
              <el-table-column :label="$t('common_remark')" prop="note" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </ody-list-table-area>
  </section>
</template>

<script>
export default {
  name: 'FinanceStmSupplierJxDeatil',
  data() {
    return {
      params: this.$route.query,
      result: null,
      logs: [],
      data: {
        storeList: [],
        purchaseList: [],
        feeList: [],
        invoiceList: []
      }
    }
  },
  mounted() {
    this.updateList()
  },
  methods: {
    async updateList() {
      const vue = this
      // 查询详情信息
      this.$finance.$api.stmSupplier.queryStmSupplierSettlementDetail({ settlementCode: this.params.settlementCode }).then((res) => {
        // res
        vue.result = res.data
        vue.data.storeList = vue.result.storeList
        const relationList = vue.result.relationList
        if (relationList) {
          for (var i in relationList) {
            const item = relationList[i]
            if (item.relationType === 1) {
              // 收退货单
              var purchase = item.purchase
              // purchase.relationId = item.relationId
              // purchase.id = item.id
              vue.data.purchaseList.push(purchase)
            } else if (item.relationType === 4) {
              // 发票
              var invoice = item.invoice
              // invoice.relationId = item.relationId
              // invoice.id = item.id
              vue.data.invoiceList.push(invoice)
            } else if (item.relationType === 5) {
              // 费用单
              var fee = item.feeBill
              // fee.relationId = item.relationId
              // fee.id = item.id
              vue.data.feeList.push(fee)
            }
          }
        }
      })
      this.logs = []
      // 操作日志
      this.$finance.$api.common.findOplogPage({
        currentPage: 1,
        itemsPerPage: 100,
        modelId: this.params.settlementCode,
        model: 'StmSupplierSettlement'
      }).then((data) => {
        this.logs = data.data
      })
    },
    dateFormat(time) {
      if (!time) {
        return ''
      }
      return this.$portal.parseTime(time, '{y}-{m}-{d}')
    }
  }
}

</script>

<style lang="scss" scoped>
</style>
