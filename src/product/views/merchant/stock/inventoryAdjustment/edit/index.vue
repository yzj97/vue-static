/* eslint-disable vue/valid-v-model */
<template>
  <section>
    <div>
      <el-form inline="true" label-position="right" label-width="120px">
        <el-form-item>
          <span slot="label">
            <ody-tip-star :content="$t('商家') + ':'" />
          </span>
          <el-select
            v-model="bill.merchantId"
            :disabled="viewStatus !== 1"
            :placeholder="$t('请选择')"
            :popper-append-to-body="false"
            name="bill_merchantId"
            @change="changeMerchant"
          >
            <el-option
              v-for="item in merchantList"
              :key="item.merchantId"
              :label="item.merchantName"
              :value="item.merchantId"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <ody-tip-star :content="$t('仓库') + ':'" />
          </span>
          <el-select
            v-model="bill.warehouseId"
            :disabled="viewStatus !== 1"
            :placeholder="$t('请选择')"
            name="bill_warehouseId"
            @change="changeWarehouse"
          >
            <el-option
              v-for="item in warehouseList"
              :key="item.warehouseId"
              :label="item.warehouseName"
              :value="item.warehouseId"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <ody-tip-star :content="$t('动作') + ':'" />
          </span>
          <el-radio
            v-model="bill.stockProcessType"
            :label="4"
            :disabled="viewStatus !== 1"
            name="stockProcessType"
          >{{ $t('入库') }}</el-radio>
          <el-radio
            v-model="bill.stockProcessType"
            :label="5"
            :disabled="viewStatus !== 1"
            name="stockProcessType"
          >{{ $t('出库') }}</el-radio>
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <ody-tip-star :content="$t('单据类型') + ':'" />
          </span>
          <el-select
            v-model="bill.billType"
            :disabled="true"
            name="bill_billType"
            @change="$forceUpdate()"
          >
            <el-option
              v-for="(value, key) in billTypeMap"
              :key="key"
              :label="$t(value)"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('单据编号') + ':'">
          <el-input v-model="bill.billCode" :disabled="viewStatus !== 1" name="bill_billCode" />
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <ody-tip-star :content="$t('单据状态') + ':'" />
          </span>
          <el-input :value="$t(billStatusMap[bill.billStatus])" disabled="true" />
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <ody-tip-star :content="$t('创建人') + ':'" />
          </span>
          <el-input v-model="bill.createUsername" :disabled="true" name="bill_createUsername" />
        </el-form-item>
        <el-form-item :label="$t('备注') + ':'">
          <el-input
            v-model="bill.billRemark"
            :disabled="status >= 4 || viewStatus == 3"
            name="bill_billRemark"
            maxlength="100"
          />
        </el-form-item>
        <el-form-item :label="$t('创建日期') + ':'">
          <el-date-picker
            v-model="bill.createTime"
            name="bill_createTime"
            type="date"
            format="yyyy-MM-dd HH:mm:ss"
            disabled="true"
          />
        </el-form-item>
        <el-form-item :label="$t('完成日期') + ':'">
          <el-date-picker
            v-if="bill.billStatus==2"
            v-model="bill.updateTime"
            name="bill_updateTime"
            type="date"
            format="yyyy-MM-dd HH:mm:ss"
            disabled="true"
          />
        </el-form-item>
        <div v-if="viewStatus == 2" style="margin-bottom: 10px">
          <ody-button
            v-if="status <= 2"
            name="InventoryAdjustmentBillListDeleteProduct_batchDelete"
            type="primary"
            size="small"
            code="InventoryAdjustmentBillListDeleteProduct"
            @click="batchDelete"
          >{{ $t('批量删除') }}</ody-button>
          <ody-button
            v-if="status <= 2 "
            name="InventoryAdjustmentBillListAddProduct_openMpModal"
            type="primary"
            size="small"
            code="InventoryAdjustmentBillListAddProduct"
            @click="openMpModal"
          >{{ $t('添加商品') }}</ody-button>
        </div>
      </el-form>
    </div>
    <div>
      <el-table
        v-if="viewStatus != 1"
        ref="multipleTable"
        :data="bill.imInventoryAdjustmentBillItemVOS"
        name="bill_imInventoryAdjustmentBillItemVOS418"
        tooltip-effect="dark"
        @select-all="selectAll"
        @select="selectRow"
      >
        <div v-if="status <=2 && viewStatus!==3">
          <el-table-column :label="$t('操作')" width="120">
            <template slot-scope="scope">
              <ody-button
                v-if="status <=2 "
                name="InventoryAdjustmentBillListDeleteProduct_deleteRow"
                code="InventoryAdjustmentBillListDeleteProduct"
                size="mini"
                @click="deleteRow(scope.$index, scope.row)"
              >{{ $t('删除') }}</ody-button>
            </template>
          </el-table-column>
        </div>
        <div v-if="viewStatus !== 3">
          <el-table-column type="selection" width="55" />
        </div>
        <el-table-column :label="$t('商品编码')" prop="code" width="150" />
        <el-table-column :label="$t('商品名称')" prop="chineseName" width="150" />
        <el-table-column :label="$t('规格属性')">
          <template slot-scope="scope">
            <span v-for="(p, index) in scope.row.attList" :key="index">{{ p }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('货号')" prop="artNo" />
        <el-table-column :label="$t('主条码')" prop="barCode" />
        <el-table-column :label="$t('主计量单位')" prop="mainUnitName" />
        <el-table-column :label="$t('申请数量')" :prop="billStockNum">
          <template slot-scope="scope">
            <!-- <el-input
              v-model="scope.row.billStockNum"
              :disabled="status != 1 || viewStatus === 3"
              name="scope_row_billStockNum"
            />-->
            <ody-input-number
              v-model="scope.row.billStockNum"
              :disabled="status != 1 || viewStatus === 3"
              :min="0.01"
              :max="999999.99"
              :decimal="2"
              :empty-tip="false"
              name="scope_row_billStockNum"
            />
          </template>
        </el-table-column>
        <el-table-column :label="$t('实际处理数量')" :prop="stockNum">
          <template slot-scope="scope">
            <!-- <el-input
              v-model="scope.row.stockNum"
              :disabled="status != 2 || viewStatus === 3"
              name="scope_row_stockNum"
            />-->
            <ody-input-number
              v-model="scope.row.stockNum"
              :disabled="status != 2 || viewStatus === 3"
              :min="0"
              :max="999999.99"
              :decimal="2"
              :empty-tip="false"
              name="scope_row_stockNum"
            />
          </template>
        </el-table-column>
      </el-table>
      <div align="center" style="margin-top: 10px">
        <ody-button
          v-if="status == 0 && viewStatus === 1"
          :loading="loading"
          name="InventoryAdjustmentBillListSave_saveBillHead"
          type="primary"
          size="small"
          code="InventoryAdjustmentBillListSave"
          @click="saveBillHead()"
        >{{ $t('保存表头') }}</ody-button>
        <ody-button
          v-if="status == 1 && viewStatus !== 3"
          :loading="loading"
          name="InventoryAdjustmentBillListSaveDetail_saveBillItem"
          type="primary"
          size="small"
          code="InventoryAdjustmentBillListSaveDetail"
          @click="saveBillItem()"
        >{{ $t('保存单据行') }}</ody-button>
        <ody-button
          v-if="status == 2 && viewStatus !== 3"
          :loading="loading"
          name="InventoryAdjustmentBillListConfirm_confirmBill"
          type="primary"
          size="small"
          code="InventoryAdjustmentBillListConfirm"
          @click="confirmBill()"
        >{{ $t('确认单据') }}</ody-button>
        <ody-button
          v-if="status == 3 && viewStatus !== 3"
          :loading="loading"
          name="InventoryAdjustmentBillListComplete_completeBill"
          type="primary"
          size="small"
          code="InventoryAdjustmentBillListComplete"
          @click="completeBill()"
        >{{ $t('完成单据') }}</ody-button>
        <ody-button
          v-if="status > 0 && bill.billStatus != 2 && viewStatus !== 3"
          :loading="loading"
          name="InventoryAdjustmentBillListCancel_cancelBill"
          type="primary"
          size="small"
          code="InventoryAdjustmentBillListCancel"
          @click="cancelBill()"
        >{{ $t('取消单据') }}</ody-button>
        <el-button
          :loading="loading"
          name="back"
          type="primary"
          size="small"
          @click="back"
        >{{ $t('返回') }}</el-button>
      </div>
    </div>
    <merchantProductModal
      v-if="modalVisible"
      :visible.sync="modalVisible"
      :ids="mpIds"
      :warehouse-id="bill.warehouseId"
      :warehouse-type-view="true"
      :merchant-id="bill.merchantId"
      @ok="closeMpModal"
    />
  </section>
</template>

<script>
import merchantProductModal from '@/components/merchantProductModal'
import stockConstant from '@/constant/stockConstant.js'
export default {
  // name: 'InventoryAdjustmentBillEdit',
  components: { merchantProductModal },
  data() {
    return {
      status: 0,
      viewStatus: null,
      merchantList: [],
      warehouseList: [],
      bill: { warehouseId: null, imInventoryAdjustmentBillItemVOS: [] },
      billTypeMap: stockConstant.INVENTORY_ADJUSTMENT_BILL_TYPE,
      billStatusMap: stockConstant.INVENTORY_ADJUSTMENT_BILL_STATUS,
      modalVisible: false,
      mpIds: [],
      loading: false,
      temp: null
    }
  },
  watch: {
    'bill.merchantId': function(newVal, oldVal) {
      this.temp = oldVal
    },
    'bill.warehouseId': function(newVal, oldVal) {
      this.temp = oldVal
    },
    status() {
      this.$forceUpdate()
    },
    viewStatus() {
      this.$forceUpdate()
    }
  },
  mounted() {
    this.merchantApi = this.$product.$api.merchantApi
    this.stockApi = this.$product.$api.stockApi
    this.userApi = this.$product.$api.userApi
    this.authApi = this.$product.$api.authApi
    this.status = 0
    this.bill.id = this.$route.params.id
    this.viewStatus = this.$route.params.viewStatus
    // 由于每次新增都得新开tab项，这边随机一个数字，但不能影响编辑/查看操作
    if (this.bill.id !== null && this.bill.id.toString().length <= 3) {
      this.bill.id = null
    }
    // 这里拿到的数据必须对应配置url参数，且注意类型，避免页面对"1"和1判断出现不一样结果
    if (this.viewStatus) {
      this.viewStatus = parseInt(this.viewStatus)
    }
    this.initData()
  },
  methods: {
    initData() {
      if (!this.bill.id) {
        // 新增
        this.bill.billType = 'MOI'
        this.bill.billStatus = 0
        this.userApi.getUserInfo().then(res => {
          this.bill.createUsername = res.data.userName
        })
      } else {
        const vue = this
        // 查看和编辑
        this.stockApi
          .getInventoryAdjustmentBillDetails({ id: this.bill.id })
          .then(res => {
            vue.bill = res.data
            // 未保存表头-0，保存了表头未保存表行-1，保存了表行未确认表行-2，确认了表行未完成表单-3，完成了表单-4,取消了表单-5
            if (
              vue.bill.imInventoryAdjustmentBillItemVOS == null ||
              vue.bill.imInventoryAdjustmentBillItemVOS.length === 0
            ) {
              vue.status = 1
            } else {
              vue.status = 2
            }
            if (vue.bill.billStatus === 1) {
              vue.status = 3
            } else if (vue.bill.billStatus === 2) {
              vue.status = 4
            } else if (vue.bill.billStatus === 3) {
              vue.status = 5
            }
            vue.getWarehouseByMerchantId(vue.bill.merchantId, true)
          })
      }
      this.queryMerchantList()
    },
    changeMerchant() {
      if (this.bill.imInventoryAdjustmentBillItemVOS.length === 0) {
        this.getWarehouseByMerchantId(this.bill.merchantId)
      } else {
        this.$confirm(
          this.$t('切换商家会清空已经添加的商品，是否继续?'),
          this.$t('提示'),
          {
            confirmButtonText: this.$t('确定'),
            cancelButtonText: this.$t('取消'),
            type: 'warning'
          }
        )
          .then(() => {
            this.bill.imInventoryAdjustmentBillItemVOS = []
            this.$forceUpdate()
          })
          .catch(() => {
            this.bill.merchantId = this.temp
          })
      }
    },
    changeWarehouse() {
      if (this.bill.imInventoryAdjustmentBillItemVOS.length > 0) {
        this.$confirm(
          this.$t('切换仓库会清空已经添加的商品，是否继续?'),
          this.$t('提示'),
          {
            confirmButtonText: this.$t('确定'),
            cancelButtonText: this.$t('取消'),
            type: 'warning'
          }
        )
          .then(() => {
            this.bill.imInventoryAdjustmentBillItemVOS = []
            this.$forceUpdate()
          })
          .catch(() => {
            this.bill.warehouseId = this.temp
          })
      }
    },
    queryMerchantList() {
      return this.merchantApi
        .queryPlatformAuthMerchantPage({ currentPage: 1, itemsPerPage: 500 })
        .then(res => {
          this.merchantList = res.data.listObj || []
        })
    },
    getWarehouseByMerchantId(merchantId, keep) {
      const vue = this
      this.merchantApi
        .queryPlatformAuthWarehousePage({
          currentPage: 1,
          itemsPerPage: 500,
          merchantId: merchantId
        })
        .then(res => {
          if (!keep) {
            vue.bill.warehouseId = null
          }
          vue.warehouseList = res.data.listObj.filter(item => {
            return item.merchantId === merchantId
          })
        })
    },
    openMpModal() {
      if (!this.bill.warehouseId) {
        this.$alert(this.$t('请选择仓库'), this.$t('提示'), {
          confirmButtonText: this.$t('确定')
        })
        return
      }
      // 2. 组装当前列表页存在的mpId集合
      this.mpIds = []
      this.bill.imInventoryAdjustmentBillItemVOS.forEach(item => {
        this.mpIds.push(item.merchantProductId)
      })
      // 3. 打开模态框
      this.modalVisible = true
    },
    closeMpModal(mpList) {
      mpList.forEach((item, index) => {
        const billItem = {}
        billItem.id = null
        billItem.sortValue = index
        billItem.code = item.code
        billItem.chineseName = item.chineseName
        billItem.attList = item.attList
        billItem.artNo = item.artNo
        billItem.barCode = item.barCode
        billItem.mainUnitName = item.mainUnitName
        billItem.availableStockNum = item.availableStockNum
        // billItem.billStockNum = 1
        // billItem.stockNum = 1
        billItem.merchantProductId = item.id
        this.bill.imInventoryAdjustmentBillItemVOS.push(billItem)
      })
    },
    deleteRow(index, row) {
      this.$confirm(this.$t('是否确认删除') + '?', this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        if (row.id) {
          // 数据库中存在记录的
          this.batchRemoveBillItem([row.id])
        } else {
          this.bill.imInventoryAdjustmentBillItemVOS.splice(index, 1)
        }
      })
    },
    batchDelete() {
      const index = this.bill.imInventoryAdjustmentBillItemVOS.findIndex(
        item => {
          return item.checked
        }
      )
      if (index === -1) {
        this.$alert(
          this.$t('please_choose_the_goods_to_be_deleted'),
          this.$t('提示'),
          {
            confirmButtonText: this.$t('确定')
          }
        )
        return
      }
      const vue = this
      this.$confirm(this.$t('是否确认删除') + '?', this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        var ids = [] // 保存单据行之后，批量删除，用于删除记录
        var data = [] // 未保存单据行，批量删除，用于保存剩下的记录
        var num = 0
        for (const item of vue.bill.imInventoryAdjustmentBillItemVOS) {
          if (item.checked) {
            // 删除
            if (item.id) {
              // 数据库中存在记录的
              ids.push(item.id)
            }
            num++
          } else {
            // 保留
            data.push(item)
          }
        }
        if (num === 0) {
          vue.$message('请勾选删除')
          return
        }
        if (ids.length > 0) {
          vue.batchRemoveBillItem(ids)
        }
        vue.bill.imInventoryAdjustmentBillItemVOS = data
      })
    },
    batchRemoveBillItem(ids) {
      this.loading = true
      var deleteParam = {
        id: this.bill.id,
        imInventoryAdjustmentBillItemVOS: []
      }
      for (const id of ids) {
        deleteParam.imInventoryAdjustmentBillItemVOS.push({ id: id })
      }
      this.stockApi
        .batchDeleteImInventoryAdjustmentBillItem(deleteParam)
        .then(res => {
          this.loading = false
          if (res.code === '0') {
            this.initData()
          } else {
            this.$message(res.message)
          }
        })
        .catch(() => {
          this.loading = false
          this.$message('操作失败')
        })
    },
    saveBillHead() {
      for (const warehouse of this.warehouseList) {
        if (warehouse.id === this.bill.warehouseId) {
          this.bill.warehouseCode = warehouse.warehouseCode
          this.bill.warehouseName = warehouse.warehouseName
        }
      }
      if (!this.bill.merchantId) {
        this.$message(this.$t('请选择商家'))
        return false
      }
      if (!this.bill.warehouseId) {
        this.$message(this.$t('请选择仓库'))
        return false
      }
      if (!this.bill.stockProcessType) {
        this.$message(this.$t('请选择出库或入库动作类型'))
        return false
      }
      if (!this.bill.createUsername) {
        this.$message(this.$t('创建人不能为空'))
        return false
      }
      this.bill.billType = 'MOI'
      this.loading = true
      this.stockApi
        .saveImInventoryAdjustmentBill(this.bill)
        .then(res => {
          this.loading = false
          if (res.code === '0') {
            this.bill = res.data
            this.$message('保存成功')
            this.status = 1
            this.viewStatus = 2
            this.initData()
          } else {
            this.$message(res.message)
          }
        })
        .catch(() => {
          this.loading = false
          this.$message('操作失败')
        })
    },
    saveBillItem() {
      for (const item of this.bill.imInventoryAdjustmentBillItemVOS) {
        if (isNaN(item.billStockNum) || item.billStockNum <= 0) {
          this.$message(this.$t('申请数量必须是正整数'))
          return false
        }
        item.billId = this.bill.id
        if (!item.stockNum) {
          item.stockNum = item.billStockNum
        }
      }
      this.loading = true
      this.stockApi
        .saveImInventoryAdjustmentBillItem({
          id: this.bill.id,
          billRemark: this.bill.billRemark,
          imInventoryAdjustmentBillItemVOS: this.bill
            .imInventoryAdjustmentBillItemVOS
        })
        .then(res => {
          this.loading = false
          if (res.code === '0') {
            this.$message('保存成功')
            this.initData()
          } else {
            this.$message(res.message)
          }
        })
        .catch(() => {
          this.loading = false
          this.$message('操作失败')
        })
    },
    confirmBill() {
      for (const item of this.bill.imInventoryAdjustmentBillItemVOS) {
        if (isNaN(item.stockNum) || item.stockNum <= 0) {
          this.$message(this.$t('实际处理数量必须是正整数'))
          return false
        }
      }
      this.loading = true
      this.bill.billStatus = 1
      this.stockApi
        .updateImInventoryAdjustmentBill(this.bill)
        .then(res => {
          this.loading = false
          if (res.code === '0') {
            this.$message('保存成功')
            this.initData()
          } else {
            this.$message(res.message)
          }
        })
        .catch(() => {
          this.loading = false
          this.$message('操作失败')
        })
    },
    async completeBill() {
      this.loading = true
      const bill = Object.assign({}, this.bill)
      bill.billStatus = 2
      if (bill.imInventoryAdjustmentBillItemVOS) {
        bill.imInventoryAdjustmentBillItemVOS.forEach((item, index) => {
          if (item.sortValue === undefined || item.sortValue === null) {
            item.sortValue = index
          }
        })
      }
      try {
        await this.stockApi.completeInventoryAdjustmentBill(bill)
        this.$message('保存成功')
        this.initData()
      } finally {
        this.loading = false
      }
    },
    cancelBill() {
      this.$confirm(this.$t('是否确认取消') + '？', this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          const tempStatus = this.bill.billStatus
          this.bill.billStatus = 3
          this.stockApi.updateImInventoryAdjustmentBill(this.bill).then(res => {
            if (res.code === '0') {
              this.back()
            } else {
              this.$message(res.message)
              this.bill.billStatus = tempStatus
            }
            this.loading = false
          })
        })
        .catch(() => {})
    },
    back() {
      this.$router.push({ name: 'InventoryAdjustmentBillList' })
      this.$portal.delActiveViewAndRefresh()
    },
    selectRow(selection, row) {
      row.checked = !row.checked
    },
    selectAll(selection) {
      if (selection.length === 0) {
        // 取消全选
        this.bill.imInventoryAdjustmentBillItemVOS.map(item => {
          item.checked = false
        })
      } else {
        // 全选
        selection.map(item => {
          item.checked = true
        })
      }
    }
  }
}
</script>
