<template>
  <section id="stock-amount-adjust-edit">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="150px" class="form">
          <ody-search-item :label="$t('stockAmountAdjustCode') + ':'" prop="warehouseIndex">
            {{ stockAmountAdjustCode }}
          </ody-search-item>
          <ody-search-item :label="$t('orderStatusText') + ':'">
            {{ approvalStatus }}
          </ody-search-item>
          <ody-search-item :label="$t('common_create_time') + ':'">
            {{ createTime }}
          </ody-search-item>
          <ody-search-item :label="$t('common_merchant_name') + ':'">
            {{ merchantName }}
          </ody-search-item>
          <ody-search-item :label="$t('common_warehouse_name') + ':'" class="required-star">
            <el-select
              v-if="pageType=='add'"
              v-model="warehouseIndex"
              :placeholder="$t('common_choose_please')"
              :disabled="pageType=='edit'"
              name="warehouseIndex"
              @change="changeWarehouse">
              <el-option
                v-for="(item,index) in warehouseList"
                :key="index"
                :label="item.warehouseName"
                :value="index"/>
            </el-select>
            <span v-else>{{ warehouseName }}</span>
          </ody-search-item>
          <ody-search-item :label="$t('common_remark') + ':'" prop="remark">
            <el-popover
              v-if="pageType=='details'"
              :content="remark"
              placement="top-start"
              width="400"
              trigger="hover">
              <div slot="reference" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden;">{{ remark }}</div>
            </el-popover>
            <el-input v-else v-model="remark" :placeholder="$t('common_remark')" name="remark" maxlength="200" show-word-limit/>
          </ody-search-item>
        </el-form>

        <!--调整单号(新增时从后端生成一个),单据状态,创建时间,商家名称,[以上字段编辑或添加时均不可编辑] 仓库名称（下拉,编辑状态禁用），备注信息[]-->
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="activeName" name="activeName">
          <el-tab-pane :label="$t('mp_details')" name="mpInfo">
            <ody-button v-if="pageType=='add'" name="FinanceStockAmountAdjustAdd_addMp" code="FinanceStockAmountAdjustAdd" size="small" type="primary" @click="addMp()">
              {{ $t('common_mp_choose') }}
            </ody-button>
            <ody-button v-if="pageType!=='details'" :disabled="checkedList.length<=0" name="FinanceStockAmountAdjustDelete_deleteMp" code="FinanceStockAmountAdjustDelete" size="small" type="primary" @click="deleteMp()">
              {{ $t('delete') }}
            </ody-button>
            <el-table
              v-loading="loading"
              :data="tableData"
              name="tableData202"
              @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"/>

              <el-table-column :label="$t('common_mp_code')" prop="mpCode" width="150"/>
              <el-table-column :label="$t('common_mp_name')" prop="mpName" width="180"/>
              <el-table-column :label="$t('common_mp_spec')" prop="mpSpec" width="100"/>
              <!--商品条码:category_code  ????-->
              <el-table-column :label="$t('common_mp_categoryName')" prop="categoryName" width="100"/>
              <el-table-column :label="$t('common_mp_brand_name')" prop="brandName" width="160"/>
              <el-table-column :label="$t('common_mp_unit')" prop="mpMeasureUnit" width="100"/>
              <el-table-column :label="$t('common_mp_realStockNum')" prop="currentStockNum" width="100"/>
              <el-table-column :label="$t('unitPriceBeforeAdjust')" prop="unitPriceBeforeAdjust" width="100"/>
              <el-table-column :label="$t('amountBeforeAdjust')" prop="amountBeforeAdjust" width="100"/>
              <el-table-column :label="$t('amountAfterAdjust')" width="100">
                <template slot-scope="scope">
                  <span v-if="pageType=='details'">{{ scope.row.amountAfterAdjust }}</span>
                  <el-input-number
                    v-else
                    v-model="scope.row.amountAfterAdjust"
                    :precision="2"
                    :controls="false"
                    :min="0"
                    :max="99999999.99"
                    name="scope_row_amountAfterAdjust"
                    size="mini"
                    style="width: 100%"
                    @change="changeAmount(scope.row)"/>
                </template>
              </el-table-column>
              <el-table-column :label="$t('unitPriceAfterAdjust')" prop="unitPriceAfterAdjust" width="100"/>
              <el-table-column :label="$t('amountDeviation')" prop="amountDeviation" width="100"/>
              <el-table-column :label="$t('common_remark')" width="180">
                <template slot-scope="scope">
                  <el-popover
                    v-if="pageType=='details'"
                    :content="scope.row.remark"
                    placement="top-start"
                    width="400"
                    trigger="hover">
                    <div slot="reference" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden;">{{ scope.row.remark }}</div>
                  </el-popover>
                  <el-input v-else v-model="scope.row.remark" name="scope_row_remark" maxlength="160" size="mini"/>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="$t('operation_log')" name="log">
            <el-table
              :data="logList"
              name="logList022"
              style="width: 100%">
              <el-table-column :label="$t('operation_people')" prop="userName"/>
              <el-table-column :label="$t('operation_log')" prop="note"/>
              <el-table-column :label="$t('operation_time')" prop="timeStr"/>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </ody-list-table-area>
    <div style="text-align: center;margin-top: 20px">
      <ody-button v-if="pageType!=='details'" name="FinanceStockAmountAdjustSave_save" code="FinanceStockAmountAdjustSave" size="small" type="primary" @click="save()">{{ $t('common_save') }}</ody-button>
      <el-button name="back" size="small" @click="back()">{{ $t('common_back') }}</el-button>
    </div>
    <!--选择商品的弹框-->
    <merchantProductModal
      :visible.sync="productModal"
      :warehouse-id="warehouseId"
      :merchant-id="merchantId"
      @ok="selectProduct"/>
  </section>
</template>

<script>
import merchantProductModal from './product'

export default {
  name: 'FinanceStockAmountAdjustEdit',
  components: {
    merchantProductModal
  },
  props: {
    newMerchantId: {
      type: Number,
      required: false,
      default: null
    },
    detailsPageType: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {
      pageType: 'add',

      stockAmountAdjustCode: null,
      approvalStatus: this.$t('common_wait_commit'),
      createTime: this.$portal.parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
      merchantName: null,
      merchantCode: null,
      merchantId: null,
      remark: null,
      warehouseName: null,
      warehouseIndex: null,
      warehouseList: [],
      warehouseId: null,

      activeName: 'mpInfo',
      loading: false,
      tableData: [],
      checkedList: [],
      waitDeleteIds: [],

      productModal: false,

      stockAmountAdjustId: null,
      logList: []
    }
  },
  created() {
    if (this.$route.params.adjustCode) {
      this.pageType = this.detailsPageType === 'details' ? 'details' : 'edit'
      this.stockAmountAdjustCode = this.$route.params.adjustCode
    } else if (this.newMerchantId) {
      this.pageType = 'add'
      this.merchantId = this.newMerchantId
    }
    this.init()
  },
  methods: {
    async init() {
      if (this.pageType === 'edit' || this.pageType === 'details') {
        const stockAmountAdjust = (await this.stockAmountAdjustByCode(this.stockAmountAdjustCode)).data
        const productList = (await this.productListPageByCode(this.stockAmountAdjustCode)).data
        this.approvalStatus = stockAmountAdjust.approvalStatusStr
        this.createTime = this.$portal.parseTime(stockAmountAdjust.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
        this.merchantName = stockAmountAdjust.merchantName
        this.remark = stockAmountAdjust.remark
        this.warehouseName = stockAmountAdjust.warehouseName
        this.tableData = productList
        this.stockAmountAdjustId = stockAmountAdjust.id
        this.selectLog()
      }
      if (this.pageType === 'add') {
        const newData = (await this.newAdjustCode(this.merchantId)).data
        this.stockAmountAdjustCode = newData.stockAmountAdjustCode
        this.merchantId = newData.merchantId
        this.merchantCode = newData.merchantCode
        this.merchantName = newData.merchantName
        this.warehouseList = (await this.listStoreWarehouse(newData.merchantId)).data
      }
    },

    changeWarehouse() {
      this.tableData = []
      this.checkedList = []
    },
    changeAmount(row) {
      if (row.currentStockNum && row.currentStockNum !== 0) {
        row.unitPriceAfterAdjust = (row.amountAfterAdjust / row.currentStockNum).toFixed(6)
        if (Number.isNaN(row.unitPriceAfterAdjust)) {
          row.unitPriceAfterAdjust = null
        }
      }
      row.amountDeviation = (row.amountAfterAdjust - row.amountBeforeAdjust).toFixed(6)
      if (Number.isNaN(row.amountDeviation)) {
        row.amountDeviation = null
      }
    },
    async selectProduct(val) {
      const addList = []
      val.forEach(v => {
        let flag = false
        this.tableData.forEach(v2 => {
          if (v2.finInventoryMwaCurrentId === v.id) {
            flag = true
          }
        })
        if (!flag) {
          const data = {
            stockAmountAdjustCode: this.stockAmountAdjustCode,
            finInventoryMwaCurrentId: v.id,
            mpId: v.mpId,
            mpCode: v.mpCode, // 商品编码
            mpName: v.mpName, // 商品名称
            mpSpec: v.mpSpec, // 商品规格
            mpBarcode: v.mpBarcode, // 缺失 商品条码,
            categoryCode: v.firstCategoryCode, // 商品类目
            categoryName: v.firstCategoryName, // 商品类目
            brandName: v.mpBrandName, // 商品品牌
            mpMeasureUnit: v.mpMeasureUnit, // 主计量单位
            currentStockNum: v.currentNum, // 库存数量
            unitPriceBeforeAdjust: v.currentCostWithoutTaxUnitBcAmt, // 调前单价
            amountBeforeAdjust: v.currentWithoutTaxBcAmt, // 调前金额
            amountAfterAdjust: null, // 调后金额 只允许输入>=0的2位小数
            unitPriceAfterAdjust: null, // 调后单价，不可编辑 调后单价=调后金额/库存数量，6位小数
            amountDeviation: null, // 差异金额，不可编辑 差异金额=调后金额-调前金额，6位小数
            remark: null // 备注，100字符
          }
          addList.push(data)
        }
      })
      this.tableData.push(...addList)
    },

    addMp() {
      if (this.warehouseIndex == null) {
        this.$message({
          type: 'warning',
          message: this.$t('warehouse_name_cannot_empty')
        })
        return
      }
      if (this.merchantId) {
        this.warehouseId = this.warehouseList[this.warehouseIndex].id
        this.productModal = true
      }
    },
    deleteMp() {
      const ids = this.checkedList.reduce((prev, curr) => {
        prev.push(curr.id)
        return prev
      }, [])
      this.waitDeleteIds.push(...ids)

      this.checkedList.forEach(val => {
        const index = this.tableData.indexOf(val)
        if (index !== -1) {
          this.tableData.splice(index, 1)
        }
      })
    },
    handleSelectionChange(checked) {
      this.checkedList = checked
    },

    async save() {
      if (this.waitDeleteIds.length > 0) {
        await this.$finance.$api.stockAmountAdjust.deleteProductByIds({
          filters: {
            ids: this.waitDeleteIds
          }
        })
        this.waitDeleteIds = []
      }
      if (this.tableData.length > 0) {
        this.tableData.forEach(val => {
          if (val.amountDeviation === 'NaN') {
            val.amountDeviation = null
          }
          if (val.unitPriceAfterAdjust === 'NaN') {
            val.unitPriceAfterAdjust = null
          }
        })

        if (this.pageType === 'add') {
          const data = {
            sArgs: {
              merchantId: this.merchantId,
              merchantCode: this.merchantCode,
              merchantName: this.merchantName,
              warehouseId: this.warehouseList[this.warehouseIndex].id,
              warehouseCode: this.warehouseList[this.warehouseIndex].warehouseCode,
              warehouseName: this.warehouseList[this.warehouseIndex].warehouseName,
              remark: this.remark
            },
            data: this.tableData
          }
          this.$finance.$api.stockAmountAdjust.batchAddProduct(data).then(res => {
            this.$portal.delActiveViewAndRefresh()
          })
        } else {
          const data = {
            sArgs: {
              remark: this.remark
            },
            data: this.tableData
          }
          this.$finance.$api.stockAmountAdjust.batchUpdateProduct(data).then(res => {
            this.$portal.delActiveViewAndRefresh()
          })
        }
      } else {
        this.$portal.delActiveViewAndRefresh()
      }
    },
    back() {
      try {
        top.Vue.prototype.$portal.delActiveView()
      } catch (e) {
        parent.postMessage({
          action: 'financeStockAmountAdjust'
        }, '*')
        console.log(e)
      }
    },

    async selectLog() {
      const logList = (await this.listLog(this.stockAmountAdjustId)).data
      this.logList = logList
    },

    listLog(adjustId) {
      return this.$finance.$api.common.findOplogPage({
        modelId: adjustId,
        model: 'FinStockAmountAdjustOrder',
        currentPage: 1,
        itemsPerPage: 1 << 10
      })
    },

    newAdjustCode(merchantId) {
      return this.$finance.$api.stockAmountAdjust.newAdjustCode({
        filters: {
          merchantId
        }
      })
    },
    listStoreWarehouse(merchantId) {
      return this.$finance.$api.common.listStoreWarehouse({
        merchantId
      })
    },
    stockAmountAdjustByCode(code) {
      return this.$finance.$api.stockAmountAdjust.getByCode({
        filters: {
          stockAmountAdjustCode: code
        }
      })
    },
    productListPageByCode(code) {
      return this.$finance.$api.stockAmountAdjust.productListPageByCode({
        page: 1,
        limit: 10000,
        filters: {
          stockAmountAdjustCode: code
        }
      })
    }
  }
}

</script>

<style scoped>
  .cell.required-star::before{
    content: '*';
    color: red;
  }
  .required-star .el-form-item label::before{
    content: '*';
    color: red;
  }
</style>
