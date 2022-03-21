<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form label-width="100px" class="form">
          <ody-search-item :label="$t('common_merchant_name')" class="required-star" prop="merchantName">
            <ody-merchant-select
              v-if="pageType=='add'"
              v-model="merchantName"
              :selected.sync="selectedMerchant"
              name="merchantName"
              @change="merchantChange()"
            />
            <ody-merchant-select
              v-if="pageType=='edit' || pageType==='details'"
              :disabled="pageType=='edit' || pageType==='details'"
              v-model="merchantName"
              name="merchantName"
              @change="merchantChange()"
            />
          </ody-search-item>
          <ody-search-item :label="$t('common_warehouse_name')" class="required-star" prop="warehouseName">
            <el-input
              v-model="warehouseName"
              :disabled="pageType=='edit' || pageType==='details'"
              :placeholder="$t('common_choose_please')"
              name="warehouseName"
              readonly="true"
              @click.native="showWarehouse"
            />
          </ody-search-item>
        </el-form>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="btn">
        <ody-button
          v-if="pageType!=='details'"
          name="OpmsStockInitialization08_submitForm"
          size="mini"
          type="primary"
          code="OpmsStockInitialization08"
          @click="submitForm"
        >{{ $t('common_create') }}</ody-button>
        <ody-button
          v-if="pageType!=='details'"
          :disabled="checked.length<=0"
          name="OpmsStockInitialization09_handleSearchDelete"
          size="mini"
          type="primary"
          code="OpmsStockInitialization09"
          @click="handleSearchDelete"
        >{{ $t('common_delete') }}</ody-button>
        <!--<el-button v-if="pageType!='edit'" v-show="!warehouseId" name="isWarehouse" size="mini" type="primary" @click="isWarehouse">{{ $t('common_to_lead') }}</el-button>-->

        <!--导入-->
        <el-upload
          v-if="pageType!=='details'"
          v-show="warehouseId"
          ref="myUpload"
          :limit="1"
          :on-exceed="handleExceed"
          :on-success="handleSuccess"
          :on-error="handleError"
          :file-list="fileList"
          :show-file-list="false"
          :multiple="false"
          :before-upload="beforeAvatarUpload"
          :data="uploadInfo"
          name="uploadData"
          accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          class="upload-demo"
          action="/api/opms-web/warehouseStockInitProduct/import.do"
        >
          <ody-button
            name="OpmsStockInitialization09"
            size="mini"
            type="primary"
            code="OpmsStockInitialization13"
          >{{ $t('common_to_lead') }}</ody-button>
        </el-upload>
        <!-- 导出模板 -->
        <ody-button
          v-if="pageType!=='details'"
          name="OpmsStockInitialization10_downLoadTemplate"
          size="mini"
          type="primary"
          code="OpmsStockInitialization14"
          @click="downLoadTemplate"
        >{{ $t('common_import_template') }}</ody-button>
      </div>
      <!-- 表格 -->
      <div slot="table">
        <el-table
          ref="multipleTable"
          :data="productList"
          name="productList899"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="productSelectionChange"
        >
          <el-table-column :v-if="pageType!=='details'" type="selection" width="55" />
          <el-table-column :label="$t('common_product_code')" prop="mpCode" />
          <el-table-column :label="$t('common_product_name')" prop="mpName" />
          <el-table-column :label="$t('mp_main_unit')" prop="mpMeasureUnit" />
          <el-table-column
            v-if="costAccountingMethod===1"
            :label="$t('common_supplier_code')"
            prop="supplierCode"
          />
          <!--<el-table-column :label="$t('plMpResult_supplierName')" prop="supplierName"/>-->
          <el-table-column
            v-if="costAccountingMethod===1"
            :label="$t('plMpResult_supplierName')"
            label-class-name="required-star"
          >
            <template slot-scope="scope">
              <el-select
                :disabled="pageType==='details'"
                v-model="scope.row.checkedSupplierId"
                name="scope_row_checkedSupplierId"
                @change="changeSupplier(scope.row)"
              >
                <el-option
                  v-for="item in supplierList"
                  :label="item.orgName"
                  :key="item.orgId"
                  :value="item.orgId"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('initial_inventory_quantity')"
            label-class-name="required-star"
          >
            <template slot-scope="scope">
              <el-input-number
                :disabled="pageType==='details'"
                v-model="scope.row.initStockCount"
                :min="0"
                :max="9999999999"
                :precision="6"
                :controls="false"
                name="scope_row_initStockCount"
                style="width: 100%"
                @blur="inputBlur(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('amount_of_initial_cost')"
            prop="initStockCount"
            label-class-name="required-star"
          >
            <template slot-scope="scope">
              <el-input-number
                :disabled="pageType==='details'"
                v-model="scope.row.costWithoutTaxAmt"
                :min="0"
                :max="9999999999"
                :precision="2"
                :controls="false"
                name="scope_row_costWithoutTaxAmt"
                style="width: 100%"
                @blur="inputBlur(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column :label="$t('initial_cost_unit_price')" prop="costWithoutTaxUnitAmt" />
        </el-table>
      </div>
    </ody-list-table-area>
    <div slot="table" style="text-align: center;margin-top: 50px;">
      <ody-button
        v-if="pageType!=='details'"
        name="OpmsStockInitialization11_saveOrUpdate"
        type="primary"
        size="small"
        style="width: 120px"
        code="OpmsStockInitialization11"
        @click="saveOrUpdate"
      >{{ $t('common_save') }}</ody-button>
      <el-button
        name="back"
        size="small"
        style="width: 120px;margin-left: 20px;"
        @click="back()"
      >{{ $t('common_return') }}</el-button>
    </div>

    <!-- 导入成功模态框 -->
    <ody-dialog
      :visible="importSuccessVisible"
      :before-close="confirm"
      :title="$t('purchase_plan_upload_success')"
      width="600px"
      @open="init"
    >
      <section>
        <P style="text-align: center">导入成功！</P>
        <P style="text-align: center">共导入成功 {{ successNumber }}笔</P>
      </section>
      <span slot="footer" class="dialog-footer">
        <!-- 确定 -->
        <el-button name="confirm" size="small" @click="confirm">{{ $t('common_confirm') }}</el-button>
      </span>
    </ody-dialog>

    <!-- 导入失败模态框 -->
    <ody-dialog
      :visible="importFailureVisible"
      :before-close="confirm"
      :title="$t('common_import_failure')"
      width="60%"
      @open="init"
    >
      <section>
        <P style="text-align: center">导入失败！</P>
        <P style="text-align: center">共导入成功{{ successNumber }}笔，导入失败 {{ errorList.length }}笔</P>
        <ody-list-table-area>
          <!-- 表格 -->
          <div slot="table">
            <ody-table
              :loading="loading"
              :data="errorList"
              :columns="columns"
              :operates="operates"
              :multiple="true"
              :checked.sync="checkedModal"
              :can-filter="false"
              name="errorList312"
            />
          </div>
        </ody-list-table-area>
      </section>
      <span slot="footer" class="dialog-footer">
        <!-- 确定 -->
        <el-button name="confirm7" @click="confirm">{{ $t('common_confirm') }}</el-button>
        <!-- 全部导出 -->
        <ody-button
          name="OpmsStockInitialization12_allExport"
          code="OpmsStockInitialization12"
          @click="allExport"
        >{{ $t('common_all_export') }}</ody-button>
      </span>
    </ody-dialog>
    <a id="downlink" />
    <newInventoryModal
      :visible.sync="showNewInventoryModal"
      :merchant-id.sync="selectedMerchant.merchantId"
      :params="{warehouseType:0}"
      @ok="selectNewInventory"
    />
    <WarehouseModel
      :visible.sync="showWarehouseModal"
      :merchant-id.sync="selectedMerchant.merchantId"
      @ok="selectWarehouse"
    />
  </section>
</template>

<script>
import newInventoryModal from '@/components/newInventoryModal'
import WarehouseModel from '../WarehouseModal'
import downloadExl from './download.js'

export default {
  name: 'OpmsNewstockInitializationEditGoods',
  components: {
    newInventoryModal,
    WarehouseModel
  },
  props: {
    detailsPageType: {
      type: String,
      default: '',
      required: false
    }
  },
  data() {
    return {
      showWarehouseModal: false,
      pageType: 'add',
      merchantName: '',
      costAccountingMethod: null,
      warehouse: null,
      warehouseId: null,
      warehouseName: null,
      productList: [], // 编辑，新增用，使用id区分新增

      loading: false,
      list: [], // 数据
      checked: [], // 选中
      selectedData: '', // 子组件选中的数据
      checkedModal: [], // 导入失败模态框选中
      supplierList: [],

      editDataList: '',
      showNewInventoryModal: false, // 模态框
      importSuccessVisible: false, // 导入成功模态框
      importFailureVisible: false, // 导入失败模态框
      selectedItem: {},
      selectedMerchant: {
        merchantId: '',
        merchantCode: '',
        merchantName: ''
      },
      searchForm: {},

      warehouseCode: [],
      platformId: null, // 平台id
      page: {
        // 分页
        size: 10,
        current: 1,
        total: 0
      },
      // 导入失败配置
      columns: [
        {
          show: true,
          prop: 'mpCode', // 商品编码
          label: this.$t('common_product_code'),
          align: 'center'
        },
        {
          show: true,
          prop: 'mpName', // 商品名称
          label: this.$t('common_product_name'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'mpMeasureUnit', // 计量单位
          label: this.$t('mp_main_unit'),
          align: 'center'
        },
        {
          prop: 'supplierCode', // 供应商编码
          label: this.$t('common_supplier_code'),
          align: 'center'
        },
        {
          prop: 'supplierName', // 供应商名称
          label: this.$t('common_supplier_name'),
          align: 'center'
        },
        {
          show: true,
          prop: 'initStockCount', // 期初库存数量
          label: this.$t('initial_inventory_quantity'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'costWithoutTaxAmt', // 期初成本金额
          label: this.$t('amount_of_initial_cost'),
          align: 'center'
        },
        {
          show: true,
          prop: 'costWithoutTaxUnitAmt', // 期初成本单价
          label: this.$t('initial_cost_unit_price'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'failReason', // 导入失败原因/
          label: this.$t('cause_of_import_failure'),
          align: 'center',
          minWidth: 100
        }
      ],
      // 导入文件
      fileList: [],
      fileName: 'inventoryExportTemplate.xlsx',
      templateUrl: '/api/opms-web/warehouseStockInitProduct/exportTemplate.do',
      importData: '', // 导入成功
      uploadInfo: {
        warehouseId: null,
        warehouseCode: null,
        warehouseName: '',
        orderCode: null,
        costAccountingMethod: null,
        merchantId: null,
        merchantName: null,
        merchantCode: null
      },
      errorList: [], // 导入失败
      failNumber: 0, // 失败个数
      successNumber: 0, // 成功个数
      waitDeleteIds: [],
      merchantId: ''
    }
  },
  async created() {},
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },

  methods: {
    merchantChange() {
      // 商家的成本核算方式
      if (this.selectedMerchant.merchantId) {
        this.$opms.$api.stockInitialization
          .finMerchantCostAccountingConfig({
            filters: { merchantId: this.selectedMerchant.merchantId }
          })
          .then(resp => {
            if (resp.data && resp.data.length > 0) {
              if (resp.data[0].costAccountingMethod) {
                this.costAccountingMethod = resp.data[0].costAccountingMethod
                this.uploadInfo.costAccountingMethod = this.costAccountingMethod
                if (this.costAccountingMethod === 1) {
                  // 供应商列表
                  this.$opms.$api.supplier
                    .queryDistributionByPageInfo({
                      currentPage: 1,
                      itemsPerPage: 1 << 20,
                      merchantId: this.selectedMerchant.merchantId,
                      status: 1, // 查询启用的供应商
                      orgType: 7
                    })
                    .then(resp => {
                      this.supplierList = resp.data.listObj
                    })
                }
              } else {
                this.costAccountingMethod = null
                this.uploadInfo.costAccountingMethod = this.costAccountingMethod
              }
            }
          })
        console.log(this.selectedMerchant)
        this.merchantId = this.selectedMerchant.merchantId
        this.uploadInfo.merchantId = this.selectedMerchant.merchantId
        this.uploadInfo.merchantName = this.selectedMerchant.merchantName
        this.uploadInfo.merchantCode = this.selectedMerchant.merchantCode
        this.productList = []
        this.checked = []
        this.warehouse = {}
        this.warehouseId = null
        this.warehouseName = null
        this.uploadInfo.warehouseId = null
        this.uploadInfo.warehouseCode = null
        this.uploadInfo.warehouseName = null
      } else {
        this.productList = []
        this.checked = []
        this.warehouse = {}
        this.warehouseId = null
        this.warehouseName = null
        this.uploadInfo.warehouseId = null
        this.uploadInfo.warehouseCode = null
        this.uploadInfo.warehouseName = null
        this.uploadInfo.merchantId = null
        this.uploadInfo.merchantName = null
        this.uploadInfo.merchantCode = null
      }
    },
    showWarehouse() {
      if (!this.selectedMerchant.merchantId) {
        this.$message({
          type: 'warning',
          message: this.$t('common_please_choose_merchant')
        })
        return
      }
      if (this.pageType !== 'edit' && this.pageType !== 'details') {
        this.showWarehouseModal = true
      }
    },
    selectWarehouse(result) {
      if (result && this.pageType === 'add') {
        if (result.id !== this.warehouseId) {
          this.productList = []
          this.warehouse = result
          this.warehouseId = result.id
          this.warehouseName = result.warehouseName
          this.uploadInfo.warehouseId = result.id
          this.uploadInfo.warehouseCode = result.warehouseCode
          this.uploadInfo.warehouseName = result.warehouseName
        }
      }
    },
    // 动态计算期初成本单价
    inputBlur(row, index) {
      if (row.initStockCount + 0 !== 0) {
        row.costWithoutTaxUnitAmt = (
          row.costWithoutTaxAmt / row.initStockCount
        ).toFixed(6)
      } else {
        row.costWithoutTaxUnitAmt = null
      }
    },
    // 切换供应商
    changeSupplier(row) {
      this.supplierList.forEach(value => {
        console.info(row.checkedSupplierId)
        console.info(value.orgId)
        if (value.orgId === row.checkedSupplierId) {
          row.supplierCode = value.orgCode
          row.supplierId = value.orgId
          row.supplierName = value.orgName
        }
      })
    },
    // 多选选中
    productSelectionChange(rows) {
      this.checked = rows
    },
    // 删除
    handleSearchDelete() {
      const ids = []
      this.checked.forEach(val => {
        this.productList.splice(this.productList.indexOf(val), 1)
        if (val.id) {
          ids.push(val.id)
        }
      })
      this.waitDeleteIds = ids
    },

    // 保存或者修改
    saveOrUpdate() {
      if (!this.warehouseId) {
        this.$message({
          type: 'warning',
          message: this.$t('warehouse_name_cannot_empty')
        })
        return
      }
      if (this.productList.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('please_choose_goods')
        })
        return
      }
      if (this.costAccountingMethod === 1) {
        // 批次个别计价法，必填供应商
        let flag = false
        this.productList.forEach(val => {
          if (val.supplierCode == null) {
            flag = true
            this.$message({
              type: 'warning',
              message: this.$t('asn_order_check_supplier')
            })
          }
        })
        if (flag) {
          return
        }
      }

      var duplicate = false
      const keys = []
      this.productList.forEach(item => {
        const key = item.mpId + '_' + item.supplierId
        if (keys.indexOf(key) >= 0) {
          duplicate = true
        } else {
          keys.push(key)
        }
      })
      if (duplicate) {
        this.$message({
          type: 'warning',
          message: this.$t('duplicate_mp')
        })
        return
      }

      let stockCount = false
      let costAmt = false
      this.productList.forEach(item => {
        if (item.initStockCount == null || item.initStockCount <= 0) {
          stockCount = true
        }
        if (item.costWithoutTaxAmt == null) {
          costAmt = true
        }
      })
      if (stockCount) {
        this.$message({
          type: 'warning',
          message: this.$t('initial_stockNum_cannot_empty')
        })
        return
      }
      if (costAmt) {
        this.$message({
          type: 'warning',
          message: this.$t('initial_costAmount_cannot_empty')
        })
        return
      }
      if (this.waitDeleteIds.length > 0) {
        this.$opms.$api.stockInitialization
          .deleteProduct({ obj: this.waitDeleteIds })
          .then(resp => {
            // 提示吧
          })
          .finally(() => {
            this.saveOrUpdate2()
          })
      } else {
        this.saveOrUpdate2()
      }
    },
    // 添加商品
    submitForm() {
      if (!this.warehouseId) {
        this.$message({
          type: 'warning',
          message: this.$t('warehouse_name_cannot_empty')
        })
        return
      }
      this.showNewInventoryModal = true
    },

    // 模态框中返回的数据
    selectNewInventory(result) {
      result = JSON.parse(JSON.stringify(result))
      console.info(result)
      result.forEach((item, index) => {
        item.supplierCode = null
        item.id = null
        item.checkedSupplierId = null
        item.initStockCount = 0
        item.costWithoutTaxAmt = 0
        item.costWithoutTaxUnitAmt = 0
        item.mpMeasureUnit = item.mpUnit
      })
      this.productList = this.productList.concat(result)
    },
    back() {
      try {
        top.Vue.prototype.$portal.delActiveView()
      } catch (e) {
        console.log(e)
      }
    },

    confirm() {
      this.importSuccessVisible = false
      this.importFailureVisible = false
      this.loading = true
      if (this.pageType === 'add') {
        this.back()
        return
      }
      this.$opms.$api.stockInitialization
        .productList({
          limit: 1 << 10,
          page: 1,
          filters: {
            orderCode: this.$route.params.orderCode
          }
        })
        .then(resp => {
          resp.data.forEach(val => {
            val.checkedSupplierId = val.supplierId
          })
          this.productList = resp.data
          this.waitDeleteIds = []
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 判断是否选择仓库
    isWarehouse() {
      if (!this.warehouseId) {
        this.$message({
          type: 'warning',
          message: this.$t('warehouse_name_cannot_empty')
        })
        return
      }
    },
    // 导入文件成功
    handleSuccess(files, fileList) {
      if (fileList.response.code !== '0') {
        this.$message.error(fileList.response.message)
        this.$refs['myUpload'].clearFiles()
        return
      }
      const message = JSON.parse(fileList.response.message)
      if (fileList.response.data && fileList.response.data.length > 0) {
        // 导入失败
        this.importFailureVisible = true
        this.errorList = fileList.response.data
        this.successNumber = message.success
        this.failNumber = message.fail
      } else {
        // 导入成功
        this.importSuccessVisible = true
        this.importData = fileList.response.data
        this.successNumber = message.success
      }
      this.$refs['myUpload'].clearFiles()
    },
    // 导入文件失败
    handleError(files, fileList) {
      this.$message.error(this.$t('file_upload_failed'))
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    // 限制上传文件格式
    beforeAvatarUpload(file) {
      var isXLS = false
      if (
        file.type === 'application/vnd.ms-excel' ||
        file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        isXLS = true
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isXLS) {
        this.$message.error(this.$t('limit_type'))
      }
      if (!isLt2M) {
        this.$message.error(this.$t('limit_the_size'))
      }
      return isXLS && isLt2M
    },

    // 导出模板
    downLoadTemplate() {
      this.$portal.downloadFileByGet(this.templateUrl, {}, this.fileName)
    },
    // 全部导出
    allExport() {
      const nameMap = {
        failReason: '导入失败原因',
        mpCode: '商品编码',
        mpName: '商品名称',
        mpMeasureUnit: '计量单位',
        initStockCount: '期初库存数量',
        costWithoutTaxAmt: '期初成本金额',
        costWithoutTaxUnitAmt: '期初成本单价',
        supplierCode: '供应商编码',
        supplierName: '供应商名称'
      }
      const exportList = []
      this.errorList.forEach(item => {
        const it = {}
        for (var k in nameMap) {
          it[k] = item[k] == null ? '' : item[k]
        }
        exportList.push(it)
      })

      let data = [{}]
      for (const k1 in exportList[0]) {
        data[0][k1] = nameMap[k1]
      }
      data = data.concat(exportList)
      downloadExl(
        data,
        '库存初始化导入错误',
        document.getElementById('downlink')
      )
      this.importFailureVisible = false
    },
    saveOrUpdate2() {
      if (this.productList.length <= 0) {
        return
      }
      const warehouse = this.warehouse
      const merchant = this.selectedMerchant
      console.log(this.selectedMerchant)
      this.productList.forEach(item => {
        item.warehouseName = warehouse.warehouseName
        item.warehouseCode = warehouse.warehouseCode
        item.warehouseId = warehouse.id
        item.merchantId = merchant.merchantId
        item.merchantName = merchant.merchantName
        item.merchantCode = merchant.merchantCode
        item.costWithoutTaxUnitAmt = parseFloat(item.costWithoutTaxUnitAmt)
      })
      this.$opms.$api.stockInitialization
        .saveOrUpdate({
          obj: this.productList
        })
        .then(resp => {
          this.back()
        })
    },
    async init() {
      // 编辑状态下回显列表数据
      if (this.$route.params.orderCode) {
        this.uploadInfo.orderCode = this.$route.params.orderCode
        this.loading = true
        this.pageType = this.detailsPageType === 'details' ? 'details' : 'edit'
        this.$opms.$api.stockInitialization
          .productList({
            limit: 1 << 10,
            page: 1,
            filters: {
              orderCode: this.$route.params.orderCode
            }
          })
          .then(resp => {
            resp.data.forEach(val => {
              val.checkedSupplierId = val.supplierId
            })
            this.productList = resp.data
            this.waitDeleteIds = []
          })
          .finally(() => {
            this.loading = false
          })
        this.$opms.$api.stockInitialization
          .getByOrderCode({
            filters: { orderCode: this.$route.params.orderCode }
          })
          .then(resp => {
            this.merchantName = resp.data.merchantName
            this.warehouseId = resp.data.warehouseId
            this.warehouseName = resp.data.warehouseName
            this.uploadInfo.warehouseId = resp.data.warehouseId
            this.uploadInfo.warehouseCode = resp.data.warehouseCode
            this.uploadInfo.warehouseName = resp.data.warehouseName
            this.uploadInfo.merchantId = resp.data.merchantId
            this.uploadInfo.merchantName = resp.data.merchantName
            this.uploadInfo.merchantCode = resp.data.merchantCode
            this.warehouse = {
              id: resp.data.warehouseId,
              warehouseCode: resp.data.warehouseCode,
              warehouseName: resp.data.warehouseName
            }
            this.merchantId = resp.data.merchantId
            this.selectedMerchant.merchantId = resp.data.merchantId
            this.selectedMerchant.merchantCode = resp.data.merchantCode
            this.selectedMerchant.merchantName = resp.data.merchantName
            console.log(this.selectedMerchant)
            const self = this
            this.$opms.$api.stockInitialization
              .finMerchantCostAccountingConfig({
                filters: { merchantId: this.selectedMerchant.merchantId }
              })
              .then(resp => {
                if (resp.data && resp.data.length > 0) {
                  if (resp.data[0].costAccountingMethod) {
                    this.costAccountingMethod =
                      resp.data[0].costAccountingMethod
                    this.uploadInfo.costAccountingMethod = this.costAccountingMethod
                    if (this.costAccountingMethod === 1) {
                      // 供应商列表
                      console.log(self.selectedMerchant)
                      this.$opms.$api.supplier
                        .queryDistributionByPageInfo({
                          currentPage: 1,
                          itemsPerPage: 1 << 20,
                          merchantId: this.selectedMerchant.merchantId,
                          status: 1, // 查询启用的供应商
                          orgType: 7
                        })
                        .then(resp => {
                          this.supplierList = resp.data.listObj
                        })
                    }
                  } else {
                    this.costAccountingMethod = null
                    this.uploadInfo.costAccountingMethod = this.costAccountingMethod
                  }
                }
              })
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cell.required-star::before {
  content: '*';
  color: red;
}
.required-star .el-form-item label::before {
  content: '*';
  color: red;
}
.el-dialog__footer {
  text-align: center !important;
}
.upload-demo {
  display: inline-block;
}
</style>
