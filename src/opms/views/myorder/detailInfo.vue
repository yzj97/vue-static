<template>
  <section class="myorder-list">
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="activeStatus" name="activeStatus">
          <el-tab-pane :label="$t('contract_baseInfo')" name="0"/>
          <el-tab-pane :label="$t('receiveOrder_foreignBasic')" name="1"/>
        </el-tabs>
      </div>
      <!-- 基础信息 -->
      <div v-if="activeStatus==='0'" slot="table" class="info_div1">
        <el-form ref="from" :model="purchaseOrder" :rules="rules" label-width="240px">
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('common_purchase_order_code')">
                <!-- 采购单号 -->
                <span>{{ purchaseOrder.purchaseCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('purchaseOrder_field_purchaseStatus')">
                <!-- 采购履行状态 -->
                <span>{{ purchaseOrder.purchaseStatusText }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('purchaser_title')">
                <!-- 采购员 -->
                <span>{{ purchaseOrder.purchaserName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('purchaseOrder_field_purchaseOrg')">
                <!-- 收货商家 -->
                <span>{{ purchaseOrder.receiveMerchantName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('purchaseOrder_field_purchaseOrgStore')">
                <!-- 收货店铺 -->
                <span>{{ purchaseOrder.receiveStoreName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('purchase_receive_receiveWarehouse')">
                <!-- 收货仓库 -->
                <span>{{ purchaseOrder.receiveWarehouseName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('purchase_request_order_supplier')">
                <!-- 供应商 -->
                <span>{{ purchaseOrder.supplierName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('asn_saleStore_contactPerson')">
                <!-- 发货联系人 -->
                <span>{{ purchaseOrder.supplierContactName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('purchaseOrder_field_purchaseDate')">
                <!-- 采购日期 -->
                <span>{{ dateFormat(purchaseOrder.purchaseDate) }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('common_currency')">
                <!-- 交易币别 -->
                <span>{{ purchaseOrder.currencyCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('purchaseOrder_field_receiveMethod')">
                <!-- 收货方式 -->
                <span>{{ purchaseOrder.receiveMethodText }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('purchaseOrder_field_expectReceiveDate')">
                <!--  约定到货日期-->
                <span>{{ dateFormat(purchaseOrder.expectReceiveDate) }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('purchaseOrder_field_sourceType')">
                <!-- 来源类型 -->
                <span>{{ purchaseOrder.sourceCodeTypeText }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('common_attachment')">
                <!-- 附件 -->
                <span v-for="file in files" :key="file.id">
                  <a :href="file.url" style="white-space: nowrap;color: dodgerblue;">{{ file.name }}</a><br>
                  <!--
                  <a v-if="purchaseOrder.attach1Path != ''" :href="purchaseOrder.attach1Path" style="white-space: nowrap;color: dodgerblue;">{{ purchaseOrder.attach1Name }}</a>
                  <a v-if="purchaseOrder.attach2Path != ''" :href="purchaseOrder.attach2Path" style="white-space: nowrap;color: dodgerblue;">&nbsp;&nbsp;{{ purchaseOrder.attach2Name }}</a>
                  <a v-if="purchaseOrder.attach3Path != ''" :href="purchaseOrder.attach3Path" style="white-space: nowrap;color: dodgerblue;">&nbsp;&nbsp;{{ purchaseOrder.attach3Name }}</a>
                  -->
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('purchaseOrder_field_deliveryAddress')">
                <!-- 发货地址 -->
                <span :title="$t('发货地址')">{{ join([purchaseOrder.deliveryAddressProvince, purchaseOrder.deliveryAddressCity, purchaseOrder.deliveryAddressRegion, purchaseOrder.deliveryAddress], ' ') }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('purchaseOrder_product_receiveAddress')">
                <!-- 收货地址 -->
                <span :title="$t('收货地址')">{{ join([purchaseOrder.receiveAddressProvince, purchaseOrder.receiveAddressCity, purchaseOrder.receiveAddressRegion, purchaseOrder.receiveAddress], ' ') }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('purchaseOrder_product_remark')">
                <!-- 备注信息 -->
                <span>{{ purchaseOrder.remark }}</span>
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
              <el-form-item :label="$t('purchaseReturnOrder_product_exchangeRate')">
                <!-- 汇率 -->
                <span>{{ purchaseOrder.exchangeRate }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('org_trade_tradeMethod')">
                <!-- 交易方式 -->
                <span>{{ purchaseOrder.tradeMethodText }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('contract_deliveryMode')">
                <!-- 成交方式 -->
                <span>{{ purchaseOrder.deliveryModeText }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('contract_distributionChannel')">
                <!-- 运输方式 -->
                <span>{{ purchaseOrder.distributionChannelText }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('purchase_receive_translatePort')">
                <!-- 装运港 -->
                <span>{{ purchaseOrder.deliveryPortText }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('contract_receivePort')">
                <!-- 抵运港 -->
                <span>{{ purchaseOrder.receivePortText }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </ody-list-table-area>
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="activeStatus2" name="activeStatus2">
          <el-tab-pane :label="$t('details_info')" name="0"/>
          <el-tab-pane :label="$t('common_operationLog')" name="1"/>
        </el-tabs>
      </div>
      <div v-if="activeStatus2==='0'" slot="table">
        <ody-table
          :data="list"
          :columns="columns"
          :loading="loading"
          :checked="checked"
          :can-filter="false"
          :multiple="false"
          name="list467"/>
      </div>
      <div v-if="activeStatus2==='0'" slot="table">
        <div class="total_div">
          <!-- 合计品项数 -->
          <span>{{ $t('purchaseDiscountOrder_product_total_productCount') }}：{{ totalCount() }}</span>
          <!-- 合计含税金额 -->
          <span>{{ $t('purchaseDiscountOrder_product_total_discountWithTaxAmt') }}：{{ total.costWithTaxAmt }}</span>
          <!-- 合计未税金额 -->
          <span>{{ $t('purchaseDiscountOrder_product_total_discountWithoutTaxAmt') }}：{{ total.costWithoutTaxAmt }}</span>
        </div>
      </div>
      <div v-if="activeStatus2==='1'" slot="table">
        <!-- 操作日志 -->
        <ody-table
          :data="logs"
          :columns="logColumns"
          :can-filter="false"
          :multiple="false"
          name="logs018"/>
      </div>
    </ody-list-table-area>
  </section>
</template>

<script>
import dateUtil from '@/utils/dateUtil'
var purchaseCode = null

export default {
  nsmr: 'OpmsMyOrderDetailInfo',
  data() {
    return {
      activeStatus: '0',
      activeStatus2: '0',
      loading: false,
      logs: [],
      list: [],
      files: [],
      purchaseOrder: { },
      total: {
        count: 0,
        costWithTaxAmt: 0,
        costWithoutTaxAmt: 0
      },
      columns: [
        {
          show: true,
          prop: 'mpCode', // 商品编码
          label: this.$t('plMpResult_mpCode'),
          align: 'center',
          minWidth: 120
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
          minWidth: 100
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
          prop: 'mpMeasureUnit', // 采购单位
          label: this.$t('common_mp_purchaseUnit'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'purchaseCount', // 采购数量
          label: this.$t('purchaseOrder_product_quantity'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          // prop: 'saleWithTaxUnitAmt', // 含税采购价(协议价) // costWithTaxUnitAmt
          label: this.$t('purchaseOrder_product_costWithTaxUnitAmt'),
          align: 'center',
          minWidth: 100,
          formatter: (row, column, cellValue) => {
            // 含税协议价 != null ? 含税协议价 : 含税采购价
            return row.saleWithTaxUnitAmt != null ? row.saleWithTaxUnitAmt : row.costWithTaxUnitAmt
          }
        },
        {
          show: true,
          // prop: 'saleWithoutTaxUnitAmt', // 未税采购价（协议价） // costWithoutTaxUnitAmt
          label: this.$t('purchaseOrder_product_costWithoutTaxUnitAmt'),
          align: 'center',
          minWidth: 100,
          formatter: (row, column, cellValue) => {
            // 未税协议价 != null ? 未税协议价 : 未税采购价
            return row.saleWithoutTaxUnitAmt != null ? row.saleWithoutTaxUnitAmt : row.costWithoutTaxUnitAmt
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
          // prop: 'costWithTaxAmt', // 含税成本金额
          label: this.$t('purchaseOrder_product_costWithTaxAmt'),
          align: 'center',
          minWidth: 100,
          formatter: (row, column, cellValue) => {
            // 协议价乘以数量
            return toFixed((row.saleWithTaxUnitAmt != null ? row.saleWithTaxUnitAmt : row.costWithTaxUnitAmt) * row.purchaseCount, 6)
          }
        },
        {
          show: true,
          // prop: 'costTaxAmt', // 税额
          label: this.$t('purchaseOrder_product_taxAmt'),
          align: 'center',
          minWidth: 100,
          formatter: (row, column, cellValue) => {
            // 协议价税额
            return toFixed(((row.saleWithTaxUnitAmt != null ? row.saleWithTaxUnitAmt : row.costWithTaxUnitAmt) - (row.saleWithoutTaxUnitAmt != null ? row.saleWithoutTaxUnitAmt : row.costWithoutTaxUnitAmt)) * row.purchaseCount, 6)
          }
        },
        {
          show: true,
          // prop: 'costWithoutTaxAmt', // 未税成本金额
          label: this.$t('purchaseOrder_product_costWithoutTaxAmt'),
          align: 'center',
          minWidth: 100,
          formatter: (row, column, cellValue) => {
            // 协议价乘以数量
            return toFixed((row.saleWithoutTaxUnitAmt != null ? row.saleWithoutTaxUnitAmt : row.costWithoutTaxUnitAmt) * row.purchaseCount, 6)
          }
        },
        {
          show: true,
          prop: 'expectReceiveDate', // 约定到货日期
          label: this.$t('purchase_expectReceiveDate'),
          align: 'center',
          minWidth: 120,
          formatter: (row, column, cellValue) => {
            return dateFormatOfTime(row.expectReceiveDate)
          }
        },
        {
          show: true,
          prop: 'receiveStoreName', // 收货仓库 receiveStoreName ? receiveWarehouseName ?
          label: this.$t('purchase_receive_receiveWarehouse'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'receiveMethodText', // 收货方式
          label: this.$t('purchaseOrder_field_receiveMethod'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'remark', // 备注
          label: this.$t('purchaseOrder_product_remark'),
          align: 'center',
          minWidth: 100
        }
      ],
      checked: [],
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
          label: this.$t('supplier_basic_remark'),
          align: 'center',
          minWidth: 100
        }
      ]
    }
  },
  async mounted() {
    try {
      purchaseCode = this.$route.query.purchaseCode
      this.loadData()
    } catch (ex) {
      console.log('初始化数据失败：' + ex)
    }
  },
  methods: {
    async loadData() {
      // 加载数据
      try {
        if (purchaseCode == null) {
          return
        }
        const vue = this
        this.loading = true
        const myorder = this.$opms.$api.myorder
        myorder.purchaseOrderDetail({ purchaseCode: purchaseCode }).then((data) => {
          vue.purchaseOrder = data.data
          vue.$opms.$api.common.findOplogPage({
            currentPage: 1,
            itemsPerPage: 100,
            modelId: vue.purchaseOrder.id,
            model: 'PurchaseOrder'
          }).then((data) => {
            vue.logs = data.data
          })
        })
        const res2 = await myorder.purchaseOrderProducts({ purchaseCode: purchaseCode })
        if (res2) {
          this.list = res2.data
          this.checked = res2.data
        }
        const res3 = await myorder.selectFileList({ objectType: 1, objectCode: purchaseCode })
        if (res3) {
          this.files = res3.data
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    totalCount() {
      var to = { count: 0, costWithTaxAmt: 0, costWithoutTaxAmt: 0 }
      if (this.checked != null) {
        for (var i in this.checked) {
          var obj = this.checked[i]
          to.count++
          to.costWithTaxAmt += ((obj.saleWithTaxUnitAmt != null ? obj.saleWithTaxUnitAmt : obj.costWithTaxUnitAmt) * obj.purchaseCount)
          to.costWithoutTaxAmt += ((obj.saleWithoutTaxUnitAmt != null ? obj.saleWithoutTaxUnitAmt : obj.costWithoutTaxUnitAmt) * obj.purchaseCount)
          // if (obj.costWithTaxAmt != null) {
          //   to.costWithTaxAmt += obj.costWithTaxAmt
          // }
          // if (obj.costWithoutTaxAmt != null) {
          //   to.costWithoutTaxAmt += obj.costWithoutTaxAmt
          // }
        }
      }
      this.total.count = to.count
      this.total.costWithTaxAmt = toFixed(to.costWithTaxAmt, 6)
      this.total.costWithoutTaxAmt = toFixed(to.costWithoutTaxAmt, 6)
      return this.total.count
    },
    dateFormat(time) {
      return dateFormatOfTime(time)
    },
    join(arr, split = '') {
      let str = ''
      for (var i in arr) {
        if (arr[i] != null && arr[i] !== '') {
          str += arr[i]
          if (i < arr.length - 1) {
            str += split
          }
        }
      }
      return str
    }
  }
}

function dateFormatOfTime(time, reHHmmss = false) {
  if (!time) {
    return ''
  }
  return dateUtil.dateFormatForTime(time, reHHmmss)
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
  .info_div1, .info_div2 {
    width: 100%;
    min-height: 220px;
  }
  .info_div_title{
    margin-top: 15px;
    margin-bottom: 22px;
    margin-left: 22px;
  }
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
