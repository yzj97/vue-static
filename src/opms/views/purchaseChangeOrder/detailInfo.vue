<template>
  <section class="detail-list">
    <ody-list-table-area>
      <div slot="tabs">
        <el-form ref="from" :model="changeOrder" :rules="rules" label-width="240px">
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('changeOrder_changeCode')">
                <!-- 更正单号 -->
                <span>{{ changeOrder.changeCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('receiveOrder_orderType')">
                <!-- 单据类型 -->
                <span>{{ changeOrder.changeTypeText }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('purchase_request_order_status')">
                <!-- 单据状态 -->
                <span>{{ changeOrder.orderStatusText }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('plMpConfig_merchantName')">
                <!-- 商家名称 -->
                <span>{{ changeOrder.merchantName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('changeOrder_changeType')">
                <!-- 更正类型 -->
                <el-select v-model="changeOrder.correctType" :placeholder="$t('请选择')" name="changeOrder_correctType">
                  <el-option :key="1" :label="$t('changeOrder_changeType_upwardCorrection')" :value="1" />
                  <el-option :key="2" :label="$t('changeOrder_changeType_downwardCorrection')" :value="2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('plMpResult_createTime')">
                <!-- 创建时间 -->
                <span>{{ dateFormat(changeOrder.createTime, true) }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('supplier_product_remark')">
                <!-- 备注信息 -->
                <el-input v-model="changeOrder.remark" :placeholder="$t('请输入内容')" name="changeOrder_remark" maxlength="200" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </ody-list-table-area>
    <ody-dialog
      :visible.sync="dialog.show"
      :before-close="handleDialogClose"
      :title="$t('plRule_detail_confirm_title')"
      width="600px">
      <span>{{ dialog.title }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleDialog" size="small" @click="handleDialog(0)">{{ dialog.but1 }}</el-button>
        <el-button name="handleDialog4" size="small" type="primary" @click="handleDialog(1)">{{ dialog.but2 }}</el-button>
      </span>
    </ody-dialog>
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="activeStatus" name="activeStatus">
          <el-tab-pane :label="$t('details_info')" name="0"/>
          <el-tab-pane :label="$t('common_operationLog')" name="1"/>
        </el-tabs>
      </div>
      <div v-if="activeStatus==='0'" slot="table">
        <div style="margin-top: 10px;margin-bottom: 10px;font-size: 0.8em;">
          <a name="purchaseReceiveChoose" style="white-space: nowrap;color: dodgerblue;" @click="purchaseReceiveChoose">{{ $t('common_purchaseReceive_choose') }}</a>&nbsp;&nbsp;&nbsp;
          <a name="showDialog" style="white-space: nowrap;color: dodgerblue;" @click="showDialog(0, 1, $t('common_msg_confirm_delete'), $t('common_no'), $t('common_delete'))">{{ $t('common_batch_remove') }}</a>
        </div>
        <ody-table
          :data="list"
          :columns="columns"
          :loading="loading"
          :checked.sync="checked"
          :can-filter="false"
          :multiple="true"
          name="list787"/>
      </div>
      <div v-if="activeStatus==='1'" slot="table">
        <!-- 操作日志 -->
        <ody-table
          :data="logs"
          :columns="logColumns"
          :can-filter="false"
          :multiple="false"
          name="logs772"/>
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
var changeCode = null

export default {
  name: 'OpmsPurchaseChangeOrderDetailInfo',
  data() {
    return {
      activeStatus: '0',
      loading: false,
      list: [],
      logs: [],
      changeOrder: {},
      dialog: {
        show: false,
        title: '',
        but1: '',
        but2: '',
        id: 0,
        type: 0 // 1 delete
      },
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
          prop: 'mpBrandName', // 商品品牌
          label: this.$t('plMpConfig_mpBrandName'),
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
          prop: 'mpMeasureUnit', // 采购单位
          label: this.$t('common_mp_purchaseUnit'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'oldCount', // 原单据数量
          label: this.$t('changeOrder_product_oldNumber'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'newCount', // 更正后数量
          label: this.$t('changeOrder_product_changedNumber'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'changeCount', // 更正数量
          label: this.$t('changeOrder_product_changeNumber'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          // prop: '', // 更正库存数量
          label: this.$t('changeOrder_product_receiveNumber'),
          align: 'center',
          minWidth: 120,
          formatter: (row, column, cellValue) => {
            // 更正库存数量 = 更正数量 * 转换率
            return row.mpConversionRate != null ? row.changeCount * row.mpConversionRate : row.changeCount
          }
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
          // prop: 'changeAmountWithTax', // 更正含税金额
          label: this.$t('changeOrder_changeAmountWithTax'),
          align: 'center',
          minWidth: 120,
          formatter: (row, column, cellValue) => {
            // 更正含税金额 = 更正数量 * 含税成本单价（本币）
            return row.costWithTaxBcUnitAmt != null ? row.changeCount * row.costWithTaxBcUnitAmt : row.changeCount
          }
        },
        {
          show: true,
          // prop: 'changeAmountWithoutTax', // 更正未税金额
          label: this.$t('changeOrder_changeAmountWithoutTax'),
          align: 'center',
          minWidth: 120,
          formatter: (row, column, cellValue) => {
            // 更正未税金额 = 更正数量 * 未税成本单价（本币）
            return row.costWithoutTaxBcUnitAmt != null ? row.changeCount * row.costWithoutTaxBcUnitAmt : row.changeCount
          }
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
          prop: 'costTaxRate', // 进项税率
          label: this.$t('supplier_product_costTaxRate'),
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
          prop: 'costWithoutTaxUnitAmt', // 未税成本价
          label: this.$t('purchaseOrder_product_costWithoutTaxBcUnitAmt'),
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
          prop: 'costWithTaxBcAmt', // 本币含税金额
          label: this.$t('purchaseReturnOrder_product_costWithTaxBcAmt'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'costTaxBcAmt', // 本币税额
          label: this.$t('purchaseReturnOrder_product_costTaxBcAmt'),
          align: 'center',
          minWidth: 80
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
          prop: 'warehouseName', // 仓库名称
          label: this.$t('plMpResult_warehouseName'),
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
        // {
        //   show: true,
        //   prop: 'orderTypeText', // 单据类型
        //   label: this.$t('receiveOrder_orderType'),
        //   align: 'center',
        //   minWidth: 100
        // },
        {
          show: true,
          prop: 'receiveCode', // 收货单号
          label: this.$t('purchaseReturnOrder_product_sourceReceiveCode'),
          align: 'center',
          minWidth: 100
        }
        // {
        //   show: true,
        //   prop: 'receiptLine', // TODO 收货单行
        //   label: this.$t('purchaseReturnOrder_product_receiptLine'),
        //   align: 'center',
        //   minWidth: 100
        // }
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
      changeCode = this.$route.query.changeCode
      console.log('changeCode==>' + changeCode)
      this.loadData()
    } catch (ex) {
      console.log('初始化数据失败：' + ex)
    }
  },
  methods: {
    async loadData() {
      // 加载数据
      try {
        const api = this.$opms.$api.purchaseChangeOrder
        this.loading = true
        if (changeCode == null) {
          const changeType = this.$route.query.changeType
          console.log('changeType ==> ' + changeType)
          // 加载空数据
          const res = await api.initPurchaseChangeOrder({ changeType: changeType })
          if (res) {
            this.changeOrder = res.data
          }
        } else {
          var vue = this
          await api.queryPurchaseChangeOrder({ changeCode: changeCode }).then((data) => {
            vue.changeOrder = data.data
            vue.list = data.data.products
            vue.$opms.$api.common.findOplogPage({
              currentPage: 1,
              itemsPerPage: 100,
              modelId: vue.changeOrder.id,
              model: 'PurchaseChangeOrder'
            }).then((data) => {
              vue.logs = data.data
            })
          })
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
    handleDialogClose() {
      this.dialog.show = false
      this.dialog = {
        show: false,
        title: '',
        but1: '',
        but2: '',
        id: 0,
        type: 0 // 1 delete
      }
    },
    handleDialog(status) {
      if (status === 0) {
        this.handleDialogClose()
      } else {
        if (this.dialog.type === 1) {
          this.batchDel()
        }
        this.dialog.show = false
      }
    },
    showDialog(id, type, title, but1, but2) {
      this.dialog.id = id
      this.dialog.type = type
      this.dialog.title = title
      this.dialog.but1 = but1
      this.dialog.but2 = but2
      this.dialog.show = true
    },
    purchaseReceiveChoose() {
      // 选择收货单
    },
    batchDel() { // 批量删除
      if (this.checked != null && this.checked.length > 0) {
        const idList = []
        for (let i = 0; i < this.checked.length; i++) {
          idList.push(this.checked[i].id)
        }
        const vue = this
        this.$opms.$api.purchaseChangeOrder.delPurchaseChangeOrderProducts({ idList: idList }).then((data) => {
          vue.loadData()
        })
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
