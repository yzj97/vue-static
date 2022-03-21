<template>
  <section>
    <el-form ref="form" label-width="100px" class="form">
      <el-card shadow="never">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('purchaseReturnOrder_field_returnCode')">
              <span>{{ formData.returnCode }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('purchaseReturnOrder_returnStatus')">
              <span>{{ formData.returnStatusText }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('purchaseOrder_field_createTime')">
              <span>{{ formData.createTimeText }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('common_supplier_name')">
              <span>{{ formData.supplierName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('supplier_contact_name')">
              <span>{{ formData.supplierContactPersonName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('purchaseReturnOrder_field_returnDate')" >
              <span>{{ formData.returnDateText }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('purchaseReturnOrder_field_merchant')">
              <span>{{ formData.returnMerchantName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('purchaseReturnOrder_field_returnStoreName')">
              <span>{{ formData.returnStoreName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('returned_operator')">
              <span>{{ formData.operatorName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('receiveOrder_field_deliveryAddress')">
              <span>{{ formData.deliveryAddress }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('purchaseOrder_field_receiveAddress')">
              <span>{{ formData.receiveAddress }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('remark_info')">
              <span>{{ formData.remark }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="activeState" name="activeState" @tab-click="handleTabsClick">
          <el-tab-pane v-for="tab in tabs" :label="tab.heading" :key="tab.index"/>
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :can-filter="false"
          name="list825"
        />
      </div>
      <div v-if="activeState==='0'" slot="table">
        <div class="total_div">
          <!-- 合计品项数 -->
          <span>{{ $t('purchaseDiscountOrder_product_total_productCount') }}：{{ totalCount() }}</span>
          <!-- 合计含税金额 -->
          <span>{{ $t('purchaseDiscountOrder_product_total_discountWithTaxAmt') }}：{{ total.costWithTaxAmt }}</span>
          <!-- 合计未税金额 -->
          <span>{{ $t('purchaseDiscountOrder_product_total_discountWithoutTaxAmt') }}：{{ total.costWithoutTaxAmt }}</span>
        </div>
      </div>
    </ody-list-table-area>
    <ody-fixed>
      <el-button name="returnBack" size="small" @click="returnBack">{{ $t('common_return') }}</el-button>
    </ody-fixed>
  </section>
</template>

<script>
import dateUtil from '@/utils/dateUtil'
export default {
  name: 'OpmsPurchaseReturnOrderDetail',
  components: {

  },
  data() {
    return {
      activeState: '0',
      formData: {},
      loading: false,
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      total: {
        count: 0,
        costWithTaxAmt: 0,
        costWithoutTaxAmt: 0
      }
    }
  },
  mounted() {
    this.tabs = [
      {
        heading: '明细信息',
        index: 0
      }, {
        heading: '操作日志',
        index: 1
      }
    ]
    this.handleTabsClick()
    this.loadData()
  },
  methods: {
    async handleTabsClick() {
      try {
        this.switchTab(this.activeState)
        this.page.current = 1
        await this.updateList(this.activeState)
      } catch (ex) {
        console.log(ex)
      }
    },
    switchTab(type) {
      this.type = Number(type)
      if (this.type === 1) {
        this._buildLogList()
      } else {
        this._buildList()
      }
    },
    _buildLogList() {
      this.columns = [
        {
          show: true,
          prop: 'operatorUserId',
          label: this.$t('common_operationUserId'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'userName',
          label: this.$t('common_operationUser'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'timeStr',
          label: this.$t('common_operationTime'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'operatorType',
          label: this.$t('common_operation'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'note',
          label: this.$t('common_remark'),
          align: 'center',
          minWidth: 80
        }
      ]
    },
    _buildList() {
      this.columns = [
        {
          show: true,
          prop: 'mpCode',
          label: this.$t('common_product_code'),
          align: 'center',
          minWidth: 180
        },
        {
          show: true,
          prop: 'mpName',
          label: this.$t('common_product_name'),
          align: 'center',
          minWidth: 180
        },
        {
          show: true,
          prop: 'mpSpec',
          label: this.$t('common_mp_spec'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'mpBarcode',
          label: this.$t('common_mp_barcode'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'categoryName',
          label: this.$t('distributionOrder_mpCategory'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'mpBrandName',
          label: this.$t('distributionOrder_mpBrand'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'mpPurchaseUnit',
          label: this.$t('common_mp_purchaseUnit'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'returnWarehouseName',
          label: this.$t('purchaseReturnOrder_field_returnWarehouseName'),
          align: 'center',
          minWidth: 180
        },
        {
          show: true,
          prop: 'returnCount',
          label: this.$t('purchaseReturnOrder_product_returnCount'),
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          prop: 'currencyCode',
          label: this.$t('common_currency'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'exchangeRate',
          label: this.$t('common_exchangeRate'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          // prop: 'costWithTaxUnitAmt',
          label: this.$t('asn_purchasePriceWithTax'),
          align: 'center',
          minWidth: 100,
          formatter: (row, column, cellValue) => {
            // 未税协议价 != null ? 未税协议价 : 未税采购价
            return row.saleWithTaxUnitAmt != null ? row.saleWithTaxUnitAmt : row.costWithTaxUnitAmt
          }
        },
        {
          show: true,
          prop: 'costTaxRate',
          label: this.$t('purchaseOrder_product_tax'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          // prop: 'costWithoutTaxUnitAmt',
          label: this.$t('asn_purchasePriceWithoutTax'),
          align: 'center',
          minWidth: 100,
          formatter: (row, column, cellValue) => {
            // 未税协议价 != null ? 未税协议价 : 未税采购价
            return row.saleWithoutTaxUnitAmt != null ? row.saleWithoutTaxUnitAmt : row.costWithoutTaxUnitAmt
          }
        },
        {
          show: true,
          // prop: 'costWithTaxAmt',
          label: this.$t('purchaseOrder_field_costWithTaxAmt'),
          align: 'center',
          minWidth: 100,
          formatter: (row, column, cellValue) => {
            // 协议价乘以数量
            return toFixed((row.saleWithTaxUnitAmt != null ? row.saleWithTaxUnitAmt : row.costWithTaxUnitAmt) * row.returnCount, 6)
          }
        },
        {
          show: true,
          // prop: 'costTaxAmt',
          label: this.$t('purchase_query_order_costTaxAmt'),
          align: 'center',
          minWidth: 100,
          formatter: (row, column, cellValue) => {
            // 协议价税额
            return toFixed(((row.saleWithTaxUnitAmt != null ? row.saleWithTaxUnitAmt : row.costWithTaxUnitAmt) - (row.saleWithoutTaxUnitAmt != null ? row.saleWithoutTaxUnitAmt : row.costWithoutTaxUnitAmt)) * row.returnCount, 6)
          }
        }, {
          show: true,
          prop: 'costWithoutTaxAmt',
          label: this.$t('purchaseOrder_field_amountWithoutTax'),
          align: 'center',
          minWidth: 100,
          formatter: (row, column, cellValue) => {
            // 协议价乘以数量
            return toFixed((row.saleWithoutTaxUnitAmt != null ? row.saleWithoutTaxUnitAmt : row.costWithoutTaxUnitAmt) * row.returnCount, 6)
          }
        },
        {
          show: true,
          prop: 'purchaseCode',
          label: this.$t('common_purchase_order_code'),
          align: 'center',
          minWidth: 180
        },
        {
          show: true,
          prop: 'receiveCode',
          label: this.$t('purchaseOrder_field_receiveCode'),
          align: 'center',
          minWidth: 180
        },
        {
          show: true,
          prop: 'settlementPartyTypeText',
          label: this.$t('purchase_plan_filed_settlement_party_type'),
          align: 'center',
          minWidth: 80
        }
      ]
    },
    async loadData() {
      // 加载数据
      try {
        this.loading = true
        const purchaseReturnOrder = this.$opms.$api.purchaseReturnOrder
        const res = await purchaseReturnOrder.purchaseReturnOrderDetail(JSON.stringify(this.$route.params.returnCode))
        if (res) {
          this.formData = res.data
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    async loadListData() {
      // 加载数据
      try {
        this.loading = true
        const purchaseReturnOrder = this.$opms.$api.purchaseReturnOrder
        const res = await purchaseReturnOrder.purchaseReturnProductList(JSON.stringify(this.$route.params.returnCode))
        if (res) {
          this.list = res.data
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    async loadLogListData() {
      try {
        this.loading = true
        const param = {
          currentPage: 1,
          itemsPerPage: 30,
          modelId: this.formData.id,
          model: 'PurchaseReturnOrder'
        }
        const common = this.$opms.$api.common
        const res = await common.findOplogPage(JSON.stringify(param))
        if (res) {
          this.list = res.data
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    async updateList() {
      try {
        this.loading = true
        if (this.type === 1) {
          await this.loadLogListData()
        } else {
          await this.loadListData()
        }
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    returnBack() {
      this.$portal.delActiveView()
      this.$router.push({ name: 'OpmsPurchaseReturnOrderList',
        params: {}
      })
    },
    dateFormat(time) {
      if (!time) {
        return ''
      }
      return dateUtil.dateFormatForTime(time, true)
    },
    totalCount() {
      var to = { count: 0, costWithTaxAmt: 0, costWithoutTaxAmt: 0 }
      if (this.list != null) {
        for (var i in this.list) {
          to.count++
          to.costWithTaxAmt += ((this.list[i].saleWithTaxUnitAmt != null ? this.list[i].saleWithTaxUnitAmt : this.list[i].costWithTaxUnitAmt) * this.list[i].returnCount)
          to.costWithoutTaxAmt += ((this.list[i].saleWithoutTaxUnitAmt != null ? this.list[i].saleWithoutTaxUnitAmt : this.list[i].costWithoutTaxUnitAmt) * this.list[i].returnCount)
        }
      }
      this.total.count = to.count
      this.total.costWithTaxAmt = toFixed(to.costWithTaxAmt, 6)
      this.total.costWithoutTaxAmt = toFixed(to.costWithoutTaxAmt, 6)
      return this.total.count
    }
  }
}
function toFixed(number, count) {
  if (number != null && (number + '').indexOf('.') > -1) {
    return number.toFixed(count)
  } else {
    return number
  }
}
</script>

<style scoped>

  .total_div{
    margin-top: 25px;
    margin-left: 75%;
  }
  .total_div span{
    display: block;
    font-size: 14px;
    margin-top: 2px;
  }
</style>
