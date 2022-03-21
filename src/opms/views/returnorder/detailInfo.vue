<template>
  <section class="detail-list">
    <ody-list-table-area>
      <div slot="tabs">
        <el-form ref="from" :model="returnOrder" :rules="rules" label-width="240px">
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('purchaseReturnOrder_field_returnCode')">
                <!-- 退货单号 -->
                <span>{{ returnOrder.returnCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('purchaseDiscountOrder_field_operator')">
                <!-- 操作人员 -->
                <span>{{ returnOrder.operatorName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('purchaseOrder_field_createTime')">
                <!-- 创建日期 -->
                <span>{{ dateFormat(returnOrder.createTime, true) }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('purchaseReturnOrder_field_returnDate')">
                <!-- 退货日期 -->
                <!--<span>{{ dateFormat(returnOrder.returnDate) }}</span>-->
                <el-date-picker
                  v-model="returnOrder.returnDate"
                  :placeholder="$t('选择日期')"
                  name="returnOrder_returnDate"
                  type="date" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('purchaseReturnOrder_field_merchant')">
                <!-- 退货商家 -->
                <span>{{ returnOrder.returnMerchantName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('purchaseReturnOrder_field_returnStoreName')">
                <!-- 退货店铺 -->
                <!--<el-input v-model="returnOrder.returnStoreName" name="returnOrder_returnStoreName" :placeholder="$t('请输入内容')" maxlength="100" />-->
                <el-select v-model="returnOrder.returnStoreCode" :placeholder="$t('请选择')" name="returnOrder_returnStoreCode" @change="changeReturnStoreName">
                  <el-option
                    key=""
                    :label="$t('请选择')"
                    value="" />
                  <el-option
                    v-for="item in returnStore"
                    :key="item.storeCode"
                    :label="item.storeName"
                    :value="item.storeCode" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('common_supplier')">
                <!-- 供应商 -->
                <!--<el-input v-model="returnOrder.supplierName" name="returnOrder_supplierName" :placeholder="$t('请输入内容')" maxlength="100" />-->
                <el-select v-model="returnOrder.supplierCode" :placeholder="$t('请选择')" name="returnOrder_supplierCode" @change="changeSupplierName">
                  <el-option
                    key=""
                    :label="$t('请选择')"
                    value="" />
                  <el-option
                    v-for="item in suppliers"
                    :key="item.supplierCode"
                    :label="item.supplierName"
                    :value="item.supplierCode" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('supplier_basic_status')">
                <!-- 状态 -->
                <span>{{ returnOrder.orderStatusText }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('supplier_contactInfo_personName')">
                <!-- 联系人名称 -->
                <!--<el-input v-model="returnOrder.personName" name="returnOrder_personName" :placeholder="$t('请输入内容')" maxlength="100" />-->
                <el-select v-model="returnOrder.supplierContactId" :placeholder="$t('请选择')" name="returnOrder_supplierContactId" @change="changePersonName">
                  <el-option
                    key=""
                    :label="$t('请选择')"
                    value="" />
                  <el-option
                    v-for="item in contactInfos"
                    :key="item.id"
                    :label="item.personName"
                    :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('purchaseOrder_field_deliveryAddress')">
                <!-- 发货地址 -->
                <el-input v-model="returnOrder.deliveryAddress" :placeholder="$t('请输入内容')" name="returnOrder_deliveryAddress" maxlength="100"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('asn_receiveAddress')">
                <!-- 收货地址 -->
                <el-input v-model="returnOrder.receiveAddress" :placeholder="$t('请输入内容')" name="returnOrder_receiveAddress" maxlength="100"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('supplier_product_remark')">
                <!-- 备注信息 -->
                <el-input v-model="returnOrder.remark" :placeholder="$t('请输入内容')" name="returnOrder_remark" maxlength="200"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </ody-list-table-area>
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="activeStatus" name="activeStatus">
          <el-tab-pane :label="$t('details_info')" name="0"/>
          <el-tab-pane :label="$t('common_operationLog')" name="1"/>
        </el-tabs>
      </div>
      <div v-if="activeStatus==='0'" slot="table">
        <div style="margin-top: 10px;margin-bottom: 10px;font-size: 0.8em;">
          <a style="white-space: nowrap;color: dodgerblue;">{{ $t('common_purchaseReceive_choose') }}</a>&nbsp;&nbsp;&nbsp;
          <a style="white-space: nowrap;color: dodgerblue;">{{ $t('common_batch_remove') }}</a>
        </div>
        <ody-table
          :data="list"
          :columns="columns"
          :loading="loading"
          :checked.sync="checked"
          :can-filter="false"
          :multiple="true"
          name="list456"/>
      </div>
      <div v-if="activeStatus==='1'" slot="table">
        <!-- 操作日志 -->
        <ody-table
          :data="logs"
          :columns="logColumns"
          :can-filter="false"
          :multiple="false"
          name="logs836"/>
      </div>
      <div slot="table" style="text-align: center;margin-top: 50px;">
        <ody-button name="saveOrUpdate" type="primary" size="small" style="width: 120px" @click="saveOrUpdate">{{ $t('common_save') }}</ody-button>
        <el-button name="router_back" size="small" style="width: 120px;margin-left: 20px;" @click="$router.back(-1)">{{ $t('common_return') }}</el-button>
      </div>
    </ody-list-table-area>
  </section>
</template>

<script>
import dateUtil from '@/utils/dateUtil'
var returnCode = null

export default {
  name: 'OpmsReturnOrderDetailInfo',
  data() {
    return {
      activeStatus: '0',
      loading: false,
      list: [],
      logs: [],
      returnOrder: { },
      returnStore: [],
      suppliers: [],
      contactInfos: [],
      columns: [
        {
          show: true,
          prop: 'mpCode', // 商品编码
          label: this.$t('plMpResult_mpCode'),
          align: 'center',
          minWidth: 140
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
          minWidth: 80
        },
        {
          show: true,
          prop: 'mpBarcode', // 商品条码
          label: this.$t('purchaseOrderProduct_mpBarcode'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'categoryName', // 类目
          label: this.$t('distributionOrder_mpCategory'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'mpBrandName', // 品牌
          label: this.$t('purchaseOrder_product_brand'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'mpMeasureUnit', // 主计量单位
          label: this.$t('purchaseOrder_product_unit'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'mpConversionRate', // 换算率 => 商品转换率
          label: this.$t('common_mp_conversionRate'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'mpPurchaseUnit', // 采购单位
          label: this.$t('common_mp_purchaseUnit'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'returnWarehouseName', // 退货仓库
          label: this.$t('purchaseReturnOrder_field_returnWarehouseName'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          // prop: 'stockCount', // TODO 可用库存
          label: this.$t('purchaseReturnOrder_product_currentStockCount'),
          align: 'center',
          minWidth: 80,
          formatter: (row, column, cellValue) => {
            // 可用库存 = 入库数量 - 退货数量
            return row.returnCount != null ? row.storageCount - row.returnCount : row.storageCount
          }
        },
        {
          show: true,
          prop: 'stockCount', // 可退数量
          label: this.$t('distributionOrder_sourceOrderCanReturnNum'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'returnCount', // 本次采购退货数量
          label: this.$t('purchaseReturnOrder_product_returnCount'),
          align: 'center',
          minWidth: 140
        },
        {
          show: true,
          prop: 'correctCount', // 更正采购数量
          label: this.$t('changeOrder_product_newNumber'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'currencyCode', // 交易币别
          label: this.$t('common_currency'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'exchangeRate', // 汇率
          label: this.$t('common_exchangeRate'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'costWithTaxUnitAmt', // 含税采购价
          label: this.$t('purchaseOrder_product_costWithTaxUnitAmt'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'costTaxRate', // 税率
          label: this.$t('purchaseReturnOrder_product_costTaxRate'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'costWithoutTaxUnitAmt', // 未税采购价
          label: this.$t('purchaseOrder_product_costWithoutTaxUnitAmt'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'costWithoutTaxBcUnitAmt', // 未税成本价
          label: this.$t('purchaseOrder_product_costWithoutTaxBcUnitAmt'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'costWithTaxBcAmt', // 含税金额
          label: this.$t('purchaseReturnOrder_product_costWithTaxAmt'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'costTaxAmt', // 税额
          label: this.$t('purchaseOrder_product_taxAmt'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'costWithoutTaxBcAmt', // 未税金额
          label: this.$t('purchaseReturnOrder_product_costWithoutTaxAmt'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'costWithoutTaxBcUnitAmt', // 本币未税成本价
          label: this.$t('purchaseReturnOrder_product_costWithoutTaxBcUnitAmt'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'costWithTaxBcUnitAmt', // 本币含税成本价
          label: this.$t('purchaseReturnOrder_product_costWithTaxBcUnitAmt'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'costWithoutTaxBcAmt', // 本币未税金额
          label: this.$t('purchaseReturnOrder_product_costWithoutTaxBcAmt'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'costTaxBcAmt', // 本币税额
          label: this.$t('purchaseReturnOrder_product_costTaxBcAmt'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'costWithTaxBcAmt', // 本币含税金额
          label: this.$t('purchaseReturnOrder_product_costWithTaxBcAmt'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'purchaseCode', // 采购单号
          label: this.$t('purchaseReturnOrder_product_purchaseCode'),
          align: 'center',
          minWidth: 100
        },
        // {
        //   show: true,
        //   prop: 'purchaseOrderLine', // TODO 采购单行
        //   label: this.$t('purchaseReturnOrder_product_purchaseOrderLine'),
        //   align: 'center',
        //   minWidth: 100
        // },
        {
          show: true,
          prop: 'receiveCode', // 收货单号
          label: this.$t('purchaseReturnOrder_product_sourceReceiveCode'),
          align: 'center',
          minWidth: 100
        },
        // {
        //   show: true,
        //   prop: 'receiptLine', // TODO 收货单行
        //   label: this.$t('purchaseReturnOrder_product_receiptLine'),
        //   align: 'center',
        //   minWidth: 100
        // },
        {
          show: true,
          prop: 'contractType', // 合同类型
          label: this.$t('purchaseReturnOrder_product_contractType'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'contractCode', // 合同编码
          label: this.$t('purchaseReturnOrder_product_contractCode'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'contractPropertyText', // 合同属性
          label: this.$t('purchaseReturnOrder_product_contractProperty'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'invoicedCount', // 已开票数量
          label: this.$t('purchaseReturnOrder_product_invoicedCount'),
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
      returnCode = this.$route.query.returnCode
      console.log('returnCode==>' + returnCode)
      this.loadData()
    } catch (ex) {
      console.log('初始化数据失败：' + ex)
    }
  },
  methods: {
    async loadData() {
      // 加载数据
      try {
        const api = this.$opms.$api.returnorder
        this.loading = true
        if (returnCode == null) {
          // 加载空数据
          const res = await api.getNewPurchaseReturnOrder()
          if (res) {
            this.returnOrder = res.data
          }
        } else {
          var vue = this
          await api.selectPurchaseReturnOrderDetailInfo({ returnCode: returnCode }).then((data) => {
            vue.returnOrder = data.data
            vue.$opms.$api.common.findOplogPage({
              currentPage: 1,
              itemsPerPage: 100,
              modelId: vue.returnOrder.id,
              model: 'PurchaseReturnOrder'
            }).then((data) => {
              vue.logs = data.data
            })
            // 店铺
            api.queryStoreOrgPageByParams({ currentPage: 1, itemsPerPage: 100, merchantCode: vue.returnOrder.returnMerchantCode }).then((data) => {
              vue.returnStore = data.data.listObj
            })
            // 供应商
            api.querySupplierList({ currentPage: 1, itemsPerPage: 100, obj: { merchantCode: vue.returnOrder.returnMerchantCode }}).then((data) => {
              vue.suppliers = data.data.listObj
            })
          })
          const res = await api.selectPurchaseReturnOrderProductList({ returnCode: returnCode })
          if (res) {
            this.list = res.data
          }
        }
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    dateFormat(time, re = false) {
      return dateFormatOfTime(time, re)
    },
    changeReturnStoreName(val) {
      var obj = {}
      obj = this.returnStore.find(function(item) {
        return item.storeCode === val
      })
      if (obj) {
        this.returnOrder.returnStoreCode = obj.storeName
      }
    },
    changeSupplierName(val) {
      var obj = {}
      obj = this.suppliers.find(function(item) {
        return item.supplierCode === val
      })
      if (obj) {
        this.returnOrder.supplierName = obj.supplierName
        this.contactInfos = obj.contactInfo
      }
    },
    changePersonName(val) {
      var obj = {}
      obj = this.contactInfos.find(function(item) {
        return item.id === val
      })
      if (obj) {
        // 联系人名称
        this.returnOrder.personName = obj.personName
        console.log('this.returnOrder.personName=====> ' + this.returnOrder.personName)
        // 收货地址
        this.returnOrder.receiveAddress = obj.addressDetail
      }
    },
    saveOrUpdate() {
      // 保存或修改
    }
  }
}

function dateFormatOfTime(time, re = false) {
  if (!time) {
    return ''
  }
  return dateUtil.dateFormatForTime(time, re)
}
</script>

<style scoped>

</style>
