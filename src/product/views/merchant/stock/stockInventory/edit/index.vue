<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <div class="div_header_class">{{ $t('信息查询') }}</div>
        <el-form ref="form">
          <ody-search-item :label="$t('商品名称') + ':'" prop="merchantProductName">
            <el-input v-model="mpObj.merchantProductName" name="mpObj_merchantProductName" />
          </ody-search-item>
          <ody-search-item :label="$t('商品编码') + ':'" prop="merchantProductCode">
            <el-input v-model="mpObj.merchantProductCode" name="mpObj_merchantProductCode" />
          </ody-search-item>
          <ody-button
            name="StockInventoryListDetailQuery_queryList"
            size="mini"
            type="primary"
            style="margin-left: 30px"
            code="StockInventoryListDetailQuery"
            @click="queryList"
          >{{ $t('查询') }}</ody-button>
          <el-button name="reset" size="mini" type="primary" style="margin-left: 30px" @click="reset">{{ $t('重置') }}</el-button>
        </el-form>
      </div>
    </ody-list-search-area>
    <el-card class="box-card">
      <div>
        <div v-if="isEdit" slot="btn" align="left" style="margin-bottom:10px">
          <ody-button
            name="StockInventoryListDetailExport_transExportExcel"
            size="mini"
            type="primary"
            code="StockInventoryListDetailExport"
            @click="transExportExcel()"
          >{{ $t('导出') }}</ody-button>
          <ody-button
            name="StockInventoryListDetailViewTask_asyncList"
            size="mini"
            type="primary"
            code="StockInventoryListDetailViewTask"
            @click="asyncList()"
          >{{ $t('查看任务') }}</ody-button>
          <ody-button
            name="StockInventoryListDetailImportResult_toImport"
            size="mini"
            type="primary"
            code="StockInventoryListDetailImportResult"
            @click="toImport()"
          >{{ $t('导入盘点结果') }}</ody-button>
        </div>
        <el-table :data="list" name="list538" tooltip-effect="dark">
          <el-table-column :label="$t('商品名称')" prop="merchantProductName" />
          <el-table-column :label="$t('商品编码')" prop="merchantProductCode" />
          <el-table-column :label="$t('系统库存')" prop="stockNum" />
          <el-table-column :label="$t('实盘数量')" prop="inventoryStockNum">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.inventoryStockNum"
                :disabled="!isEdit"
                name="scope_row_inventoryStockNum"
                maxlength="8"
                @input="changeInventoryStockNum(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column :label="$t('差异数量')" prop="quantityVariance">
            <template slot-scope="scope">
              <span
                v-show="scope.row.inventoryStockNum === '0' || scope.row.inventoryStockNum === 0 || scope.row.inventoryStockNum"
              >{{ scope.row.quantityVariance }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('单位')" prop="measurementUnit" />
        </el-table>
        <ody-list-table-area>
          <div slot="page">
            <div class="block">
              <ody-pagination
                :current-page.sync="mpObj.currentPage"
                :page-sizes="[10, 20, 30, 50]"
                :page-size.sync="mpObj.itemsPerPage"
                :total.sync="mpObj.total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="change"
                @current-change="queryList"
              />
            </div>
          </div>
        </ody-list-table-area>
        <div align="center" style="margin-top: 10px">
          <ody-button
            v-if="isEdit"
            name="StockInventoryListSaveDetail_save"
            type="primary"
            code="StockInventoryListSaveDetail"
            size="small"
            @click="save"
          >{{ $t('确定') }}</ody-button>
          <el-button name="back" type="primary" size="small" @click="back">{{ $t('返回') }}</el-button>
        </div>
      </div>
      <downloadTask :visible.sync="downloadTask" task-type="imInventoryDetailExport" />
      <ody-dialog :visible.sync="showImport" :before-close="handleClose" :title="$t('导入盘点结果')" width="50%">
        <el-card shadow="never">
          <div>
            <span>{{ $t('选择导入') }}：</span>
            <input id="fileUpload" type="file" >
            <ody-button
              :disabled="!canUpload"
              name="StockInventoryListDetailUpload_upload"
              type="primary"
              size="mini"
              code="StockInventoryListDetailUpload"
              @click="upload()"
            >{{ $t('上传') }}</ody-button>
          </div>
          <div style="margin-top: 20px">
            <span>{{ $t('文件') }}：</span>
            <a name="downloadTemplate" href="#" style="margin-left: 15px;color: blue" @click="downloadTemplate">{{ $t('模板下载') }}</a>
          </div>
        </el-card>
        <el-card align="center" shadow="never">
          <el-button name="handleClose" size="mini" @click="handleClose">{{ $t('返回') }}</el-button>
        </el-card>
      </ody-dialog>
    </el-card>
  </section>
</template>

<script>
import downloadTask from '@/components/downloadTask'
import listImInventoryExcel from '@/excelFile/listImInventory.xlsx'
export default {
  name: 'StockInventoryEdit',
  components: { downloadTask },
  data() {
    return {
      isEdit: false,
      showImport: false,
      canUpload: true,
      downloadTask: false,
      mpObj: {
        inventoryId: null,
        merchantProductName: null,
        merchantProductCode: null,
        currentPage: 1,
        itemsPerPage: 10,
        total: 0
      },
      list: []
      // downloadUrl: '/back-product-static/盘点模板.xlsx'
    }
  },
  async mounted() {
    try {
      this.stockApi = this.$product.$api.stockApi
      this.mpApi = this.$product.$api.mpApi
      this.mpObj.inventoryId = this.$route.params.id
      this.isEdit = this.$route.params.isEdit
      await this.queryList()
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    async queryList() {
      if (!this.mpObj.merchantProductName) {
        delete this.mpObj.merchantProductName
      }
      if (!this.mpObj.merchantProductCode) {
        delete this.mpObj.merchantProductCode
      }
      this.stockApi.listImInventoryDetailPage(this.mpObj).then(res => {
        this.list = res.data.listObj
        this.mpObj.total = res.data.total
        if (this.list) {
          this.list.forEach(item => {
            this.caculation(item)
          })
        }
      })
    },
    save() {
      // 保存
      for (var inventoryDetail of this.list) {
        if (
          inventoryDetail.inventoryStockNum == null ||
          inventoryDetail.inventoryStockNum === undefined ||
          inventoryDetail.inventoryStockNum === ''
        ) {
          this.$message('实盘数量大于等于0且最多2位小数')
          return
        }
      }
      // this.stockApi.batchUpdateImInventoryDetail(this.list).then(res => {
      //   if (res.code === '0') {
      //     this.$message('操作成功')
      //   }
      //   this.queryList()
      // })
      this.$portal
        .post(
          '/back-product-web/back/stock/imInventory/batchUpdateImInventoryDetail.do',
          this.list
        )
        .then(res => {
          if (res.code === '0') {
            this.$message('操作成功')
          }
          this.queryList()
        })
    },
    toImport() {
      // 导入
      this.showImport = true
    },
    upload() {
      // 上传
      var form = new FormData()
      var file = document.getElementById('fileUpload').files[0]
      form.append('file', file)
      form.append('inventoryId', this.mpObj.inventoryId)
      if (file == null) {
        this.$message('文件不能为空')
        return
      }
      if (file.size / 1024 / 1024 > 4) {
        this.$message('上传文件不能大于4M!')
        return
      }
      var index = file.name.lastIndexOf('.')
      var suffix = file.name.substr(index + 1)
      if (suffix !== 'xls' && suffix !== 'xlsx') {
        this.$message('上传文件的格式非xls|xlsx')
        return
      }
      this.canUpload = false
      this.$portal
        .post(
          '/back-product-web/back/stock/imInventory/importImInventoryDetailFile.do',
          form
        )
        .then(res => {
          this.canUpload = true
          if (res.code === '0') {
            this.$message('添加成功')
            this.handleClose()
          } else {
            this.$message(res.message)
          }
          this.queryList()
        })
        .catch(res => {
          this.canUpload = true
          this.$message(res.message)
        })
    },
    transExportExcel() {
      this.mpApi
        .asyncEvent({
          templateCode: 'imInventoryDetailExport',
          jsonTxt: JSON.stringify(this.mpObj)
        })
        .then(res => {
          if (res.code === '0') {
            this.$message({
              showClose: true,
              message: this.$t('创建导出任务成功！'),
              type: 'info'
            })
          } else {
            this.$message({
              showClose: true,
              message: this.$t('创建导出任务失败！'),
              type: 'error'
            })
          }
        })
    },
    asyncList() {
      // 查看任务
      this.downloadTask = true
    },
    caculation(item) {
      if (item.inventoryStockNum === 0 || item.inventoryStockNum) {
        item.quantityVariance = item.inventoryStockNum - item.stockNum
      }
    },
    changeInventoryStockNum(row) {
      if (isNaN(row.inventoryStockNum)) {
        row.inventoryStockNum = null
      } else {
        row.inventoryStockNum = Number(row.inventoryStockNum)
      }
      this.caculation(row)
    },
    change(val) {
      this.mpObj.itemsPerPage = val
      this.queryList()
    },
    handleClose() {
      this.showImport = false
    },
    reset() {
      this.mpObj.currentPage = 1
      this.mpObj.merchantProductName = null
      this.mpObj.merchantProductCode = null
    },
    back() {
      this.$router.push({ name: 'StockInventoryList' })
      this.$portal.delActiveViewAndRefresh()
    },
    downloadTemplate() {
      this.$portal.downloadFileByGet(
        listImInventoryExcel,
        {},
        this.$t('盘点模板') + '.xlsx'
      )
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
