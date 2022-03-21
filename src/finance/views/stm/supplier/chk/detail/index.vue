<template>
  <section class="detail-list">
    <ody-list-table-area>
      <div slot="tabs">
        <el-form ref="form" :model="params" :rules="rules" label-width="240px">
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('receipt_name')">
                <span>{{ params.chkOrderTypeText }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('chkOrderCode')">
                <span>{{ params.chkOrderCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('chkStatusText')">
                <span>{{ params.chkStatusText }}</span>
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
              <el-form-item :label="$t('common_store_name')">
                <span>{{ params.storeName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <!-- 账期名称 -->
              <el-form-item :label="$t('chkTimeName')">
                <span>{{ params.ruleName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('refOrderCode')">
                <span>{{ params.refOrderCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('refOrderCreateTime')">
                <span>{{ dateFormat(params.refOrderCreateTime, false) }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('payPlanDate')">
                <span>{{ dateFormat(params.payPlanDate, false) }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('accountExpireDate')">
                <span>{{ dateFormat(params.accountExpireDate, false) }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('common_currency')">
                <span>{{ params.currencyName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('common_exchangeRate')">
                <span>{{ params.exchangeRate }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </ody-list-table-area>
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="activeStatus" name="activeStatus">
          <el-tab-pane :label="$t('cheDetailsText')" name="0"/>
          <el-tab-pane :label="$t('common_operationLog')" name="1"/>
        </el-tabs>
      </div>
      <div v-if="activeStatus==='0'" slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :can-filter="false"
          name="list772"
        />
      </div>
      <div v-if="activeStatus==='0'" slot="page">
        <div class="block">
          <ody-pagination
            :current-page.sync="queryContent.currentPage"
            :list="list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="queryContent.itemsPerPage"
            :total.sync="queryContent.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handlePageSizeChange"
            @current-change="handlePageCurrentChange"/>
        </div>
      </div>
      <div v-if="activeStatus==='1'" slot="table">
        <!-- 操作日志 -->
        <ody-table
          :data="logs"
          :columns="logColumns"
          :can-filter="false"
          :multiple="false"
          name="logs337"/>
      </div>
    </ody-list-table-area>
  </section>
</template>

<script>
export default {
  name: 'FinanceStmSupplierChkDeatil',
  data() {
    return {
      activeStatus: '0',
      params: this.$route.query,
      activeState: '-1',
      loading: false,
      list: [],
      logs: [],
      queryContent: {
        itemsPerPage: 10,
        currentPage: 1,
        total: 0,
        obj: {
          chkOrderCode: this.$route.query.chkOrderCode
        }
      },
      columns: [
        { 'show': true, 'prop': 'mpCode', 'label': this.$t('common_product_code'), 'align': 'center', 'minWidth': 150 },
        { 'show': true, 'prop': 'mpName', 'label': this.$t('common_product_name'), 'align': 'center', 'minWidth': 150 },
        { 'show': true, 'prop': 'mpSpec', 'label': this.$t('common_mp_spec'), 'align': 'center' },
        { 'show': true, 'prop': 'mpMeasureUnit', 'label': this.$t('mpMeasureUnit'), 'align': 'center' },
        { 'show': true, 'prop': 'chkNum', 'label': this.$t('chkNum'), 'align': 'center' },
        { 'show': true, 'prop': 'costWithoutTaxUnitAmt', 'label': this.$t('costWithoutTaxUnitAmt'), 'align': 'center' },
        { 'show': true, 'prop': 'costTaxRate', 'label': this.$t('che_product_tax'), 'align': 'center' },
        { 'show': true, 'prop': 'costWithTaxUnitAmt', 'label': this.$t('costWithTaxUnitAmt'), 'align': 'center' },
        { 'show': true, 'prop': 'costWithoutTaxAmt', 'label': this.$t('costWithoutTaxAmt'), 'align': 'center' },
        { 'show': true, 'prop': 'costTaxAmt', 'label': this.$t('costTaxAmt'), 'align': 'center' },
        { 'show': true, 'prop': 'costWithTaxAmt', 'label': this.$t('costWithTaxAmt'), 'align': 'center' },
        { 'show': true, 'prop': 'contractTypeText', 'label': this.$t('contractType'), 'align': 'center' },
        { 'show': true, 'prop': 'contractCode', 'label': this.$t('contractCode'), 'align': 'center', 'minWidth': 160 },
        { 'show': true, 'prop': 'invoiceNum', 'label': this.$t('cheOpenNum'), 'align': 'center' } // 开票数量
      ],
      logColumns: [
        {
          show: true,
          prop: 'operatorUserId', // 操作用户ID
          label: this.$t('common_operationUserId'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'userName', // 操作人
          label: this.$t('common_operationUser'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'timeStr', // 操作时间
          label: this.$t('common_operationTime'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'operatorType', // 操作
          label: this.$t('common_operation'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'note', // 备注
          label: this.$t('common_remark'),
          align: 'center',
          minWidth: 100
        }
      ]
    }
  },
  async mounted() {
    await this.updateList()
  },
  methods: {
    async updateList() {
      try {
        this.loading = true
        // 数据
        this.$finance.$api.stmSupplier.queryChkSupplierPurchaseDetailList(this.queryContent).then((res) => {
          this.list = res.data.listObj
          this.queryContent.total = res.data.total
          // 合计
          if (this.list != null && this.list.length > 0) {
            var total = { mpCode: '合计：    ', costWithoutTaxAmt: 0, costTaxAmt: 0, costWithTaxAmt: 0 }
            for (var i in this.list) {
              total.costWithoutTaxAmt += this.list[i].costWithoutTaxAmt ? this.list[i].costWithoutTaxAmt : 0
              total.costTaxAmt += this.list[i].costTaxAmt ? this.list[i].costTaxAmt : 0
              total.costWithTaxAmt += this.list[i].costWithTaxAmt ? this.list[i].costWithTaxAmt : 0
            }
            this.list.push(total)
          }
        })
        this.logs = []
        // // 操作日志
        this.$finance.$api.common.findOplogPage({
          currentPage: 1,
          itemsPerPage: 100,
          modelId: this.queryContent.obj.chkOrderCode,
          model: 'ChkSupplierPurchase'
        }).then((data) => {
          this.logs = data.data
        })
        this.loading = false
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageSizeChange() {
      await this.updateList()
    },
    async handlePageCurrentChange() {
      await this.updateList()
    },
    dateFormat(time, reHHmmss = false) {
      if (time) {
        return this.$portal.parseTime(time, '{y}-{m}-{d}')
      }
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
