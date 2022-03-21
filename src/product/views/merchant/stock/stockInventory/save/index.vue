<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <div class="div_header_class">{{ $t('新增盘点') }}</div>
        <el-form ref="form">
          <ody-search-item :label="$t('商家') + ':'" prop="merchantId">
            <el-select
              v-model="obj.merchantId"
              :placeholder="$t('请选择')"
              :disabled="!inventoryIsNull"
              name="obj_merchantId"
              clearable
              @change="getWarehouseByMerchantId(obj.merchantId)"
            >
              <el-option
                v-for="item in merchantList"
                :key="item.merchantId"
                :label="item.merchantName"
                :value="item.merchantId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('仓库') + ':'" prop="warehouseId">
            <el-select
              v-model="obj.warehouseId"
              :placeholder="$t('请选择')"
              :disabled="!inventoryIsNull"
              name="obj_warehouseId"
              clearable
            >
              <el-option
                v-for="item in warehouseList"
                :key="item.warehouseId"
                :label="item.warehouseName"
                :value="item.warehouseId"
              />
            </el-select>
          </ody-search-item>
          <ody-button
            :disabled="!inventoryIsNull"
            name="StockInventoryListSave_save"
            size="mini"
            type="primary"
            style="margin-left: 30px"
            code="StockInventoryListSave"
            @click="save()"
          >{{ $t('保存') }}</ody-button>
        </el-form>
      </div>
    </ody-list-search-area>
    <el-card v-if="!inventoryIsNull" class="box-card">
      <div class="div_header_class">{{ $t('盘点范围') }}</div>
      <div>
        <div slot="btn" align="left" style="margin-bottom:10px">
          <ody-button
            name="StockInventoryListAddProduct_add"
            size="mini"
            type="primary"
            code="StockInventoryListAddProduct"
            @click="add()"
          >{{ $t('添加') }}</ody-button>
          <ody-button
            name="StockInventoryListDeleteProduct_batchDelete"
            size="mini"
            type="primary"
            code="StockInventoryListDeleteProduct"
            @click="batchDelete()"
          >{{ $t('删除') }}</ody-button>
        </div>
        <el-table
          ref="multipleTable"
          :data="list"
          name="list840"
          tooltip-effect="dark"
          @select-all="selectAll"
          @select="selectRow"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column :label="$t('商品名称')" prop="merchantProductName" />
          <el-table-column :label="$t('商品编码')" prop="merchantProductCode" />
        </el-table>
        <ody-list-table-area>
          <div slot="page">
            <div class="block">
              <ody-pagination
                :current-page.sync="page.currentPage"
                :page-sizes="[10, 20, 30, 50]"
                :page-size.sync="page.itemsPerPage"
                :total.sync="page.total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="change"
                @current-change="queryList"
              />
            </div>
          </div>
        </ody-list-table-area>
        <div align="center" style="margin-top: 10px">
          <el-button name="back" type="primary" size="small" @click="back">{{ $t('返回') }}</el-button>
        </div>
      </div>
      <ody-dialog :visible.sync="showAdd" :before-close="handleClose" :title="$t('添加盘点商品')" width="60%">
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form">
              <ody-search-item :label="$t('商品名称') + ':'" prop="merchantProductName">
                <el-input v-model="mpObj.merchantProductName" name="mpObj_merchantProductName" />
              </ody-search-item>
              <ody-search-item :label="$t('商品编码') + ':'" prop="merchantProductCode">
                <el-input v-model="mpObj.merchantProductCode" name="mpObj_merchantProductCode" />
              </ody-search-item>
              <ody-search-item :label="$t('商品条码') + ':'" prop="merchantProductBarcode">
                <el-input v-model="mpObj.merchantProductBarcode" name="mpObj_merchantProductBarcode" />
              </ody-search-item>
            </el-form>
          </div>
          <div slot="btn">
            <ody-button
              name="StockInventoryListQueryProduct_queryImInventoryMPList"
              size="small"
              type="primary"
              code="StockInventoryListQueryProduct"
              @click="queryImInventoryMPList"
            >{{ $t('查询') }}</ody-button>
            <el-button name="reset" size="small" @click="reset">{{ $t('重置') }}</el-button>
          </div>
        </ody-list-search-area>
        <ody-list-table-area>
          <div slot="table">
            <el-table
              ref="multipleTable"
              :data="mpList"
              name="mpList167"
              tooltip-effect="dark"
              @select-all="mpSelectAll"
              @select="mpSelectRow"
            >
              <el-table-column :selectable="canSelect" type="selection" width="55" />
              <el-table-column :label="$t('商品名称')" prop="merchantProductName" align="center" />
              <el-table-column :label="$t('商品编码')" prop="merchantProductCode" align="center" />
              <el-table-column :label="$t('商品条码')" prop="merchantProductBarcode" align="center" />
            </el-table>
          </div>
          <div slot="page">
            <div class="block">
              <ody-pagination
                :current-page.sync="mpObj.currentPage"
                :page-sizes="[10, 20, 30, 50]"
                :page-size.sync="mpObj.itemsPerPage"
                :total.sync="mpObj.total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="mpChange"
                @current-change="queryImInventoryMPList"
              />
            </div>
          </div>
        </ody-list-table-area>
        <span slot="footer" class="dialog-footer">
          <el-row type="flex" justify="center">
            <el-button name="showAdd" size="small" @click="showAdd = false">{{ $t('取消') }}</el-button>
            <ody-button
              name="StockInventoryListSaveDetail_batchSaveInventoryDetail"
              size="small"
              type="primary"
              code="StockInventoryListSaveDetail"
              @click="batchSaveInventoryDetail"
            >{{ $t('保存') }}</ody-button>
          </el-row>
        </span>
        <!--<el-card align="center" shadow="never">
          <el-button name="showAdd4" type="primary" size="small" @click="showAdd = false">{{$t('取消')}}</el-button>
          <el-button name="batchSaveInventoryDetail" type="primary" size="small" @click="batchSaveInventoryDetail">{{$t('保存')}}</el-button>
        </el-card>-->
      </ody-dialog>
    </el-card>
  </section>
</template>

<script>
export default {
  name: 'StockInventorySave',
  data() {
    return {
      showAdd: false,
      inventoryIsNull: true,
      obj: {
        merchantId: null,
        warehouseId: null
      },
      mpObj: {
        merchantId: null,
        warehouseId: null,
        currentPage: 1,
        itemsPerPage: 10,
        total: 0
      },
      list: [],
      productIds: {},
      mpList: [],
      warehouseList: [],
      merchantList: [],
      page: {
        currentPage: 1,
        itemsPerPage: 10,
        total: 0
      }
    }
  },
  async mounted() {
    try {
      this.stockApi = this.$product.$api.stockApi
      this.merchantApi = this.$product.$api.merchantApi
      this.authApi = this.$product.$api.authApi
      this.inventoryIsNull = true
      await this.queryMerchantList()
      await this.queryList()
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    // 分页查询
    async queryList() {
      if (this.obj.id) {
        this.inventoryIsNull = false
        var param = {
          inventoryId: this.obj.id,
          currentPage: this.page.currentPage,
          itemsPerPage: this.page.itemsPerPage
        }
        this.stockApi.listImInventoryDetailPage(param).then(res => {
          this.list = res.data.listObj
          this.page.total = res.data.total
          this.queryImInventoryMPList()
        })
      }
    },
    async queryImInventoryMPList() {
      this.mpObj.merchantId = this.obj.merchantId
      this.mpObj.warehouseId = this.obj.warehouseId
      if (!this.mpObj.merchantProductName) {
        delete this.mpObj.merchantProductName
      }
      if (!this.mpObj.merchantProductCode) {
        delete this.mpObj.merchantProductCode
      }
      if (!this.mpObj.merchantProductBarcode) {
        delete this.mpObj.merchantProductBarcode
      }
      this.stockApi.listInventoryMerchantProductPage(this.mpObj).then(res => {
        this.mpList = res.data.listObj
        this.mpObj.total = res.data.total
        if (this.list && this.list.length > 0) {
          for (var i in this.list) {
            this.productIds[this.list[i].merchantProductId] = true
          }
          for (var j in this.mpList) {
            if (this.productIds[this.mpList[j].merchantProductId]) {
              this.mpList[j].selected = true
            }
          }
        }
      })
    },
    // 查询当前登录用户有权限的商家
    async queryMerchantList() {
      return this.merchantApi
        .queryPlatformAuthMerchantPage({ currentPage: 1, itemsPerPage: 500 })
        .then(res => {
          this.merchantList = []
          const merchantIds = []
          for (const warehouse of res.data.listObj) {
            if (merchantIds.indexOf(warehouse.merchantId) === -1) {
              merchantIds.push(warehouse.merchantId)
              this.merchantList.push({
                merchantId: warehouse.merchantId,
                merchantCode: warehouse.merchantCode,
                merchantName: warehouse.merchantName
              })
            }
          }
        })
    },
    getWarehouseByMerchantId(merchantId) {
      if (!merchantId) {
        this.warehouseList = []
        this.obj.warehouseId = null
        return
      }
      this.merchantApi
        .queryPlatformAuthWarehousePage({ currentPage: 1, itemsPerPage: 500 })
        .then(res => {
          this.warehouseList = res.data.listObj.filter(item => {
            return item.merchantId === merchantId
          })
        })
    },
    add() {
      this.showAdd = true
      this.queryList()
    },
    save() {
      if (!this.obj.merchantId) {
        this.$message('请选择商家')
        return
      }
      if (!this.obj.warehouseId) {
        this.$message('请选择仓库')
        return
      }
      this.inventoryIsNull = true
      this.stockApi.saveImInventory(this.obj).then(res => {
        if (res.code === '0') {
          this.obj = res.data
          this.$message('保存成功')
          this.inventoryIsNull = false
        } else {
          this.$message(res.message)
          this.inventoryIsNull = true
        }
      })
    },
    batchDelete() {
      const index = this.list.findIndex(item => {
        return item.checked
      })
      if (index === -1) {
        this.$message('请勾选删除')
        return
      }
      this.$confirm(this.$t('是否确认删除') + '?', this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        const ids = this.list
          .filter(item => item.checked)
          .map(item => {
            this.productIds[item.merchantProductId] = false
            return item.id
          })
        if (ids.length > 0) {
          this.stockApi.batchDeleteImInventoryDetail({ ids: ids }).then(res => {
            if (res.code === '0') {
              this.$message('操作成功')
            }
            this.queryList()
          })
        }
      })
    },
    batchSaveInventoryDetail() {
      var saveInventoryDetailList = []
      for (var i = 0; i < this.mpList.length; i++) {
        if (this.mpList[i].checked) {
          if (
            this.obj.id &&
            this.mpList[i].merchantProductId &&
            !this.mpList[i].selected
          ) {
            this.productIds[this.mpList[i].merchantProductId] = true
            saveInventoryDetailList.push({
              inventoryId: this.obj.id,
              merchantProductId: this.mpList[i].merchantProductId,
              stockNum: this.mpList[i].stockNum
            })
          }
        }
      }
      if (saveInventoryDetailList.length > 0) {
        // this.stockApi.batchSaveImInventoryDetail(saveInventoryDetailList).then(res => {
        //   if (res.code === '0') {
        //     this.$message('操作成功')
        //   }
        //   this.queryList()
        // })
        this.$portal
          .post(
            '/back-product-web/back/stock/imInventory/batchSaveImInventoryDetail.do',
            saveInventoryDetailList
          )
          .then(res => {
            if (res.code === '0') {
              this.$message('操作成功')
              this.showAdd = false
            }
            this.queryList()
          })
      } else {
        this.$message('数据不能为空，请选择')
      }
    },
    change(val) {
      this.page.itemsPerPage = val
      this.queryList()
    },
    mpChange(val) {
      this.mpObj.itemsPerPage = val
      this.queryImInventoryMPList()
    },
    selectAll(selection) {
      if (selection.length === 0) {
        // 取消全选
        this.list.map(item => {
          item.checked = false
        })
      } else {
        // 全选
        selection.map(item => {
          item.checked = true
        })
      }
    },
    selectRow(selection, row) {
      row.checked = !row.checked
    },
    mpSelectRow(selection, row) {
      row.checked = !row.checked
    },
    mpSelectAll(selection) {
      if (selection.length === 0) {
        // 取消全选
        this.mpList.map(item => {
          item.checked = false
        })
      } else {
        // 全选
        selection.map(item => {
          item.checked = true
        })
      }
    },
    canSelect(row) {
      return !row.selected
    },
    handleClose() {
      this.showAdd = false
    },
    reset() {
      this.mpObj.merchantProductName = null
      this.mpObj.merchantProductCode = null
      this.mpObj.merchantProductBarcode = null
    },
    back() {
      this.$router.push({ name: 'StockInventoryList' })
      this.$portal.delActiveViewAndRefresh()
    }
  }
}
</script>

<style lang="scss" scoped>
.div_header_class {
  font-size: 14px;
  color: #6666;
  margin-bottom: 20px;
}
</style>
