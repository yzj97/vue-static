<template>
  <section class="myorder-list">
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="activeStatus" name="activeStatus">
          <el-tab-pane :label="$t('contract_baseInfo')" name="0" />
          <el-tab-pane :label="$t('receiveOrder_foreignBasic')" name="1" />
        </el-tabs>
      </div>
      <!-- 基础信息 -->
      <div v-if="activeStatus==='0'" slot="table" class="info_div1">
        <el-form ref="from" :model="purchaseOrder" :rules="rules" label-width="240px">
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('receiveOrder_field_receiveCode') + ':' ">
                <!-- 收货单号 -->
                <span>{{ purchaseOrder.receiveCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('purchaseOrderProduct_orderStatus') + ':' ">
                <!-- 单据状态 -->
                <span>{{ purchaseOrder.orderStatusText }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('purchaser_title') + ':' ">
                <!-- 采购员 -->
                <span>{{ purchaseOrder.purchaserName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('purchaseOrderProduct_supplierName') + ':' ">
                <!-- 供应商名称 -->
                <span>{{ purchaseOrder.supplierName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('supplier_contact_name') + ':' ">
                <!-- 供应商联系人 -->
                <span>{{ purchaseOrder.supplierContactPersonName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('receiveOrder_deliveryDate') + ':' ">
                <!-- 发货日期 -->
                <span>{{ purchaseOrder.deliveryDateText }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('receiveOrder_field_merchantName') + ':' ">
                <!-- 收货商家 -->
                <span>{{ purchaseOrder.receiveMerchantName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('receiveOrder_field_receiveStoreName') + ':' ">
                <!-- 收货店铺 -->
                <span>{{ purchaseOrder.receiveStoreName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('receiveOrder_field_receiveWarehouseName') + ':' ">
                <!-- 收货仓库 -->
                <span>{{ purchaseOrder.receiveWarehouseName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('purchaseOrder_product_currencyCode') + ':' ">
                <!-- 交易币别 -->
                <span>{{ purchaseOrder.currencyCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('purchaseOrder_product_receiveMethod') + ':' ">
                <!-- 收货方式 -->
                <span>{{ purchaseOrder.receiveMethodText }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('receiveOrder_receivedDate') + ':' ">
                <!-- 收货日期 -->
                <span>{{ dateFormat(purchaseOrder.receiveDate) }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('receiveOrder_field_deliveryAddress') + ':' ">
                <!-- 发货地址 -->
                <span>{{ purchaseOrder.deliveryAddress }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('receiveOrder_field_receiveAddress') + ':' ">
                <!-- 收货地址 -->
                <span>{{ purchaseOrder.receiveAddress }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('purchaseOrder_product_remark') + ':' ">
                <!-- 备注信息 -->
                <span>{{ purchaseOrder.remark }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item :label="$t('common_attachment')">
                <ody-upload-attach
                  v-if="receiveCode"
                  v-model="value"
                  :object-type="3"
                  :object-code="receiveCode"
                  name="value"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- 外贸信息 -->
      <div v-if="activeStatus==='1'" slot="table" class="info_div2">
        <el-form ref="from" :model="purchaseOrder" :rules="rules" label-width="240px">
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('purchaseReturnOrder_product_exchangeRate') + ':' ">
                <!-- 汇率 -->
                <span>{{ purchaseOrder.exchangeRate }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('org_trade_tradeMethod') + ':' ">
                <!-- 交易方式 -->
                <span>{{ purchaseOrder.tradeMethodText }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('contract_deliveryMode') + ':' ">
                <!-- 成交方式 -->
                <span>{{ purchaseOrder.deliveryModeText }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('contract_distributionChannel') + ':' ">
                <!-- 运输方式 -->
                <span>{{ purchaseOrder.distributionChannelText }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('purchase_receive_translatePort') + ':' ">
                <!-- 装运港 -->
                <span>{{ purchaseOrder.deliveryPortText }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('contract_receivePort') + ':' ">
                <!-- 抵运港 -->
                <span>{{ purchaseOrder.receivePortText }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </ody-list-table-area>
    <!-- 明细信息 -->
    <div class="info_div_title">
      <span>{{ $t('details_info') }}</span>
    </div>
    <ody-list-table-area>
      <div slot="table">
        <ody-table :data="list" :columns="columns" :loading="loading" name="list273" />
      </div>
      <div slot="table">
        <div class="total_div">
          <!--采购收获数量11-->
          <span>{{ $t('receiveOrder_receiveCount') }}：{{ total.receiveCount }}</span>
          <!--合格品数量-->
          <span>{{ $t('number_of_qualified_products') }}：{{ total.numberOfQualifiedProducts }}</span>
          <!--不合格品数量-->
          <span>{{ $t('number_of_nonconforming_products') }}：{{ total.numberOfNonconformingProducts }}</span>
          <!-- 合计品项数 -->
          <span>{{ $t('purchaseDiscountOrder_product_total_productCount') }}：{{ totalCount() }}</span>
          <!-- 合计含税金额 -->
          <span>{{ $t('purchaseDiscountOrder_product_total_discountWithTaxAmt') }}：{{ total.costWithTaxAmt }}</span>
          <!-- 合计未税金额 -->
          <span>{{ $t('purchaseDiscountOrder_product_total_discountWithoutTaxAmt') }}：{{ total.costWithoutTaxAmt }}</span>
        </div>
      </div>
    </ody-list-table-area>
  </section>
</template>

<script>
import dateUtil from '@/utils/dateUtil'

export default {
  naem: 'OpmsPurchaseReceiveDetailInfo',
  data() {
    return {
      receiveCode: null,
      activeStatus: '0',
      loading: false,
      list: [],
      purchaseOrder: {},
      total: {
        count: 0,
        costWithTaxAmt: 0,
        costWithoutTaxAmt: 0,
        receiveCount: 0,
        numberOfQualifiedProducts: 0,
        numberOfNonconformingProducts: 0
      },
      columns: [
        {
          show: true,
          prop: 'mpCode', // 商品编码
          label: this.$t('plMpResult_mpCode'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'mpName', // 商品名称
          label: this.$t('plMpResult_mpName'),
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          prop: 'mpSpec', // 商品规格
          label: this.$t('purchaseOrderProduct_mpSpec'),
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          prop: 'categoryName', // 商品类目
          label: this.$t('purchaseOrderProduct_categoryName'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'mpBrandName', // 商品品牌
          label: this.$t('purchaseOrderProduct_mpBrandName'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'mpMeasureUnit', // 采购单位
          label: this.$t('common_mp_purchaseUnit'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'receiveCount', // 采购收货数量
          label: this.$t('receiveOrder_receiveCount'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'purchaseCount', // 合格品数量
          label: this.$t('number_of_qualified_products'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'unqualifiedCount', // 不合格品数量
          label: this.$t('number_of_nonconforming_products'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'returnCount', // 退货采购数量
          label: this.$t('common_returnCount'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          // prop: 'costWithTaxUnitAmt', // 含税采购价
          label: this.$t('purchaseOrder_product_costWithTaxUnitAmt'),
          align: 'center',
          minWidth: 100,
          formatter: (row, column, cellValue) => {
            // 未税协议价 != null ? 未税协议价 : 未税采购价
            return row.saleWithTaxUnitAmt != null
              ? row.saleWithTaxUnitAmt
              : row.costWithTaxUnitAmt
          }
        },
        {
          show: true,
          // prop: 'costWithoutTaxUnitAmt', // 未税采购价
          label: this.$t('purchaseOrder_product_costWithoutTaxUnitAmt'),
          align: 'center',
          minWidth: 100,
          formatter: (row, column, cellValue) => {
            // 未税协议价 != null ? 未税协议价 : 未税采购价
            return row.saleWithoutTaxUnitAmt != null
              ? row.saleWithoutTaxUnitAmt
              : row.costWithoutTaxUnitAmt
          }
        },
        {
          show: true,
          prop: 'costTaxRate', // 进项税率
          label: this.$t('supplier_product_costTaxRate') + '（%）',
          align: 'center',
          minWidth: 120,
          formatter: (row, column, cellValue) => {
            return row.costTaxRate != null ? row.costTaxRate * 100 : ''
          }
        },
        {
          show: true,
          // prop: 'costWithoutTaxAmt', // 未税成本金额
          label: this.$t('purchaseOrder_product_costWithoutTaxAmt'),
          align: 'center',
          minWidth: 80,
          formatter: (row, column, cellValue) => {
            // 协议价乘以数量
            return toFixed(
              (row.saleWithoutTaxUnitAmt != null
                ? row.saleWithoutTaxUnitAmt
                : row.costWithoutTaxUnitAmt) *
                (row.purchaseCount != null
                  ? row.purchaseCount
                  : row.receiveCount),
              6
            )
          }
        },
        {
          show: true,
          // prop: 'costTaxBcAmt', // 税额
          label: this.$t('purchaseOrder_product_taxAmt'),
          align: 'center',
          minWidth: 80,
          formatter: (row, column, cellValue) => {
            // 协议价税额
            return toFixed(
              ((row.saleWithTaxUnitAmt != null
                ? row.saleWithTaxUnitAmt
                : row.costWithTaxUnitAmt) -
                (row.saleWithoutTaxUnitAmt != null
                  ? row.saleWithoutTaxUnitAmt
                  : row.costWithoutTaxUnitAmt)) *
                (row.purchaseCount != null
                  ? row.purchaseCount
                  : row.receiveCount),
              6
            )
          }
        },
        {
          show: true,
          // prop: 'costWithTaxAmt', // 含税成本金额
          label: this.$t('purchaseOrder_product_costWithTaxAmt'),
          align: 'center',
          minWidth: 80,
          formatter: (row, column, cellValue) => {
            // 协议价乘以数量
            return toFixed(
              (row.saleWithTaxUnitAmt != null
                ? row.saleWithTaxUnitAmt
                : row.costWithTaxUnitAmt) *
                (row.purchaseCount != null
                  ? row.purchaseCount
                  : row.receiveCount),
              6
            )
          }
        },
        {
          show: true,
          prop: 'remark', // 备注
          label: this.$t('purchaseOrder_product_remark'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'purchaseCode', // 采购单号
          label: this.$t('purchaseReturnOrder_product_purchaseCode'),
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          prop: 'paymentPeriodDay', // 账期
          label: this.$t('payment_period'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'settlementPartyTypeText', // 结算地
          label: this.$t('purchase_plan_filed_settlement_party_type'),
          align: 'center',
          minWidth: 100
        }
      ],
      checked: []
    }
  },
  async mounted() {
    try {
      this.receiveCode = this.$route.query.receiveCode
      await this.loadData()
    } catch (ex) {
      console.log('初始化数据失败：' + ex)
    }
  },
  methods: {
    async loadData() {
      const { receiveCode } = this
      // 加载数据
      try {
        if (receiveCode == null) {
          return
        }
        this.loading = true
        const purchaseReceiveOrder = this.$opms.$api.purchaseReceiveOrder
        const res1 = await purchaseReceiveOrder.queryReceiveOrder({
          receiveCode
        })
        if (res1) {
          this.purchaseOrder = res1.data
        }
        const res2 = await purchaseReceiveOrder.queryReceiveOrderDetailList({
          receiveCode
        })
        if (res2) {
          this.list = res2.data
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    totalCount() {
      var to = {
        receiveCount: 0,
        numberOfQualifiedProducts: 0,
        numberOfNonconformingProducts: 0,
        count: 0,
        costWithTaxAmt: 0,
        costWithoutTaxAmt: 0
      }
      if (this.list != null) {
        for (var i in this.list) {
          to.count++
          if (this.list[i].receiveCount != null) {
            to.receiveCount += this.list[i].receiveCount
          }
          if (this.list[i].purchaseCount != null) {
            to.numberOfQualifiedProducts += this.list[i].purchaseCount
          }
          if (this.list[i].unqualifiedCount != null) {
            to.numberOfNonconformingProducts += this.list[i].unqualifiedCount
          }

          to.costWithTaxAmt +=
            (this.list[i].saleWithTaxUnitAmt != null
              ? this.list[i].saleWithTaxUnitAmt
              : this.list[i].costWithTaxUnitAmt) *
            (this.list[i].purchaseCount != null
              ? this.list[i].purchaseCount
              : this.list[i].receiveCount)
          to.costWithoutTaxAmt +=
            (this.list[i].saleWithoutTaxUnitAmt != null
              ? this.list[i].saleWithoutTaxUnitAmt
              : this.list[i].costWithoutTaxUnitAmt) *
            (this.list[i].purchaseCount != null
              ? this.list[i].purchaseCount
              : this.list[i].receiveCount)
        }
      }
      this.total.count = to.count
      this.total.costWithTaxAmt = toFixed(to.costWithTaxAmt, 6)
      this.total.costWithoutTaxAmt = toFixed(to.costWithoutTaxAmt, 6)
      this.total.receiveCount = to.receiveCount
      this.total.numberOfQualifiedProducts = to.numberOfQualifiedProducts
      this.total.numberOfNonconformingProducts =
        to.numberOfNonconformingProducts
      return this.total.count
    },
    dateFormat(time) {
      return dateFormatOfTime(time)
    }
  }
}

function dateFormatOfTime(time) {
  if (!time) {
    return ''
  }
  return dateUtil.dateFormatForTime(time, false)
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
.info_div1,
.info_div2 {
  width: 100%;
  min-height: 220px;
}
.info_div_title {
  margin-top: 15px;
  margin-bottom: 22px;
  margin-left: 22px;
}
.total_div {
  margin-top: 25px;
  margin-left: 75%;
}
.total_div span {
  display: block;
  font-size: 14px;
  margin-top: 2px;
}
</style>
