<template>
  <section>
    <ody-list-table-area>
      <div slot="tabs">
        <el-form ref="form" :model="params" :rules="rules" label-width="240px">
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('paymentCode')">
                {{ params.paymentCode }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('paymentStatus')">
                {{ params.statusText }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('paymentCreateTime')">
                <span>{{ dateFormat(params.createTime) }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('common_supplier_name')">
                {{ params.payeeSupplierName }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('common_merchant_name')">
                {{ params.payerMerchantName }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('paymentCurrency')">
                {{ params.currencyCode }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('payableAmt')">
                {{ params.payableAmt }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('advancePayAmt')">
                {{ params.advancePayAmt ==null? 0 :params.advancePayAmt }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('offlinePayAmt')">
                {{ params.offlinePayAmt }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('remarkText')">
                {{ params.remark }}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </ody-list-table-area>
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="activeState" name="activeState" type="card">
          <el-tab-pane :label="$t('detailsInfo')" name="0">
            <el-table :data="settlementDetailDTOs" name="settlementDetailDTOs356" style="width: 100%">
              <el-table-column :label="$t('settlementCode')" prop="settlementCode"/>
              <el-table-column :label="$t('costWithTaxAmt')" prop="settleWithTaxAmt"/>
              <el-table-column :label="$t('dx_paidAmt')" prop="paidAmt"/>
              <el-table-column :label="$t('dx_payAmt')" prop="payAmt"/>
            </el-table>
          </el-tab-pane>
          <el-tab-pane v-if="params.status == 5" :label="$t('paymentRecords')" name="2">
            <el-table :data="paymentOrderDetails" name="paymentOrderDetails329" style="width: 100%">
              <el-table-column :label="$t('paymentMethodText')" prop="paymentMethodText"/>
              <el-table-column :label="$t('payerAccountTypeText')" prop="payerAccountTypeText"/>
              <el-table-column :label="$t('payerAccountNo')" prop="payerAccountNo"/>
              <el-table-column :label="$t('paymentSerial')" prop="paymentSerial"/>
              <el-table-column :label="$t('paymentCompelteTime')" prop="paymentCompelteTime" min-width="120">
                <template slot-scope="scope">
                  <span>{{ dateFormat(scope.row.paymentCompelteTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('paymentCurrency')" prop="currencyCode"/>
              <el-table-column :label="$t('offlinePayAmt')" prop="offlinePayAmt">
                <template slot-scope="scope">
                  <span>{{ scope.row.offlinePayAmt ==null? 0 :scope.row.offlinePayAmt }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('advancePayAmt')" prop="advancePayAmt" min-width="120">
                <template slot-scope="scope">
                  <span>{{ scope.row.advancePayAmt ==null? 0 :scope.row.advancePayAmt }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('paymentExpectTime')" prop="paymentCompelteTime" min-width="120">
                <template slot-scope="scope">
                  <span>{{ dateFormat1(scope.row.paymentCompelteTime) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="$t('common_operationLog')" name="3">
            <el-table :data="logs" name="logs529" style="width: 100%">
              <el-table-column :label="$t('common_operationUserId')" prop="operatorUserId" />
              <el-table-column :label="$t('common_operationUser')" prop="userName"/>
              <el-table-column :label="$t('common_operationTime')" prop="timeStr" min-width="120"/>
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
  name: 'FinanceStmSupplierDxDeatil',
  data() {
    return {
      params: this.$route.query,
      result: null,
      logs: [],
      settlementDetailDTOs: [],
      paymentOrderDetails: []
    }
  },
  mounted() {
    this.updateList()
  },
  methods: {
    async updateList() {
      this.paymentOrderDetails = [this.$route.query]
      const paymentCode = this.$route.query.paymentCode
      const api = this.$finance.$api.stmSupplier
      // 查询明细
      var res = await api.queryApSupplierPaymentDetailWithStm({
        paymentCode: paymentCode,
        refOrderType: 1
      })
      if (res) {
        this.settlementDetailDTOs = []
        const data = res.data
        for (var i in res.data) {
          data[i].stmSupplier.payAmt = data[i].payAmt
          this.settlementDetailDTOs.push(data[i].stmSupplier)
        }
      }
      // 操作日志
      this.$finance.$api.common.findOplogPage({
        currentPage: 1,
        itemsPerPage: 100,
        modelId: this.$route.query.id,
        model: 'ApSupplierPayment'
      }).then((data) => {
        this.logs = data.data
      })
    },
    dateFormat(time) {
      if (!time) {
        return ''
      }
      return this.$portal.parseTime(time, '{y}-{m}-{d}')
    },
    dateFormat1(time) {
      if (!time) {
        return ''
      }
      return this.$portal.parseTime(time, '{h}:{i}:{s}')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
