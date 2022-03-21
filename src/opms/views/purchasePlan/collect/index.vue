<template>
  <section class="pg-purchasePlanCollect-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('common_merchant_name') + ':'" prop="merchantName">
            <el-input
              v-model="searchForm.merchantName"
              :placeholder="$t('common_status_all')"
              name="searchForm_merchantName"
              readonly="true"
              @click.native="showMerchantSelectModal"
            />
          </ody-search-item>
          <ody-search-item :label="$t('purchase_plan_type') + ':'" prop="planType">
            <el-select v-model="searchForm.planType" name="searchForm_planType">
              <el-option :label="$t('common_status_all')" />
              <el-option v-for="(k,v) in planTypes" :label="k" :key="v" :value="v" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('purchase_plan_code') + ':'" prop="planCode">
            <el-input v-model="searchForm.planCode" name="searchForm_planCode" />
          </ody-search-item>
          <ody-search-item :label="$t('execution_status') + ':'" prop="executionStatus">
            <el-select v-model="searchForm.executionStatus" name="searchForm_executionStatus">
              <el-option :label="$t('common_status_all')" />
              <el-option v-for="(k,v) in executionStatus" :label="k" :key="v" :value="v" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('plan_start_date') + ':'" class="register" prop="planStartDate">
            <ody-date-range-picker
              v-model="searchForm.planStartDate"
              :show-button="false"
              type="date"
              name="searchForm_planStartDate"
              value-format="yyyy-MM-dd">range-separator="-"/></ody-date-range-picker>

              <!-- <el-date-picker
              v-model="searchForm.planStartDate"
              name="searchForm_planStartDate"
              value-format="yyyy-MM-dd"
              type="daterange"
            >range-separator="-"/>     </el-date-picker> -->
          </ody-search-item>
          <ody-search-item
            slot="btn"
            :label="$t('plan_end_date') + ':'"
            class="register"
            prop="planExpiryDate">
            <ody-date-range-picker
              v-model="searchForm.planExpiryDate"
              :show-button="false"
              type="date"
              name="searchForm_planExpiryDate"
              value-format="yyyy-MM-dd">range-separator="-"/></ody-date-range-picker>

              <!-- <el-date-picker
              v-model="searchForm.planExpiryDate"
              name="searchForm_planExpiryDate"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
            /> -->
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" class="reset" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="Opms-PurchasePlanCollectList01_handleSearchSubmit"
          size="small"
          type="primary"
          code="Opms-PurchasePlanCollectList01"
          @click="handleSearchSubmit"
        >{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="Opms-PurchasePlanCollectList02_exportData"
          size="small"
          type="primary"
          code="Opms-PurchasePlanCollectList02"
          @click="exportData"
        >{{ $t('common_export') }}</ody-button>
        <!--<ody-button name="batchHandle" size="small" type="primary" @click="batchHandle">{{ $t('purchase_batch_handle') }}</ody-button>-->
        <ody-button
          name="Opms-PurchasePlanCollectList03_batchEnquiryConfirm"
          size="small"
          type="primary"
          code="Opms-PurchasePlanCollectList03"
          @click="batchEnquiryConfirm"
        >{{ $t('enquiry_confirm') }}</ody-button>
        <el-upload
          :on-success="handleSuccess"
          :show-file-list="false"
          :action="doUpload"
          multiple="false"
          accept=".xls, .xlsx"
          style="display: inline-block;margin: 0 16px;"
        >
          <ody-button name="Opms-PurchasePlanCollectList04" class="import" size="small" code="Opms-PurchasePlanCollectList04">{{ $t('common_import') }}</ody-button>
        </el-upload>
        <ody-button
          name="Opms-PurchasePlanCollectList06_downLoadTemplate"
          size="small"
          code="Opms-PurchasePlanCollectList06"
          class="importdown"
          @click="downLoadTemplate"
        >{{ $t('purchase_plan_downLoadTemp') }}</ody-button>
        <el-select
          v-model="batchSetType"
          name="batchSetType"
          class="batch-select"
          @change="queryBatchValue()"
        >
          <el-option :label="$t('assign_supplier_name')" value="defaultSupplierId" />
          <!-- <el-option :label="$t('purchaseOrder_product_quantity')" value="applyPurchaseNum" />-->
          <el-option :label="$t('purchase_wi_tax_price')" value="saleWithTaxUnitAmt" />
          <el-option :label="$t('service_fee_value')" value="serviceFeeValue" />
          <el-option :label="$t('service_fee_type')" value="serviceFeeType" />
          <el-option :label="$t('including_shipping_fee')" value="isIncludingDeliveryFee" />
          <el-option :label="$t('contract_distributionChannel')" value="deliveryMethond" />
        </el-select>
        <el-select
          v-show="selectDisabledValue"
          v-model="batchSelectSetValue"
          name="batchSelectSetValue"
          style="width: 180px; display: inline-block;margin: 0 16px;"
          filterable
        >
          <el-option v-for="(k,v) in batchValues" :label="k" :key="v" :value="v" />
        </el-select>
        <el-input
          v-show="supplierValue"
          v-model="supplierName"
          :placeholder="$t('common_choose_please')"
          name="supplierName"
          readonly="true"
          style="width:180px;inline-block;"
          @click.native="showSupplier"
        />
        <ody-input-number
          v-show="disabledValue"
          :decimal="6"
          v-model="batchSetValue"
          :max="999999999"
          name="batchSetValue"
          style="width:120px"
        />
        <ody-button
          name="Opms-PurchasePlanCollectList05_batchHandle"
          type="primary"
          size="small"
          code="Opms-PurchasePlanCollectList05"
          class="batchHandle"
          @click="batch-handle"
        >{{ $t('purchase_plan_batch_option') }}</ody-button>
      </div>
      <div slot="tabs">
        <el-tabs v-model="activeState" name="activeState" @tab-click="handleTabsClick">
          <el-tab-pane v-for="tab in tabs" :label="tab.heading" :key="tab.index" />
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :multiple="true"
          :checked.sync="checked"
          name="list123"
        />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
        />
      </div>
    </ody-list-table-area>
    <ody-dialog :visible.sync="dialogTableVisible" :title="$t('common_import')">
      <el-form ref="fileUpload" :model="fileUpload" :inline="true" :rules="rules">
        <el-row align="center">
          <el-col align="center">
            <el-form-item :label="$t('common_upload_attachment')" prop="fileNames">
              <el-input v-model="fileUpload.fileNames" name="fileUpload_fileNames" type="text" disabled="true" />
            </el-form-item>
            <el-form-item>
              <el-upload
                ref="upload"
                :on-change="handlePreview"
                :on-success="handleSuccess"
                :auto-upload="false"
                :show-file-list="false"
                :action="doUpload"
                name="fileData"
                multiple="false"
                class="upload-demo"
                accept=".xls, .xlsx"
              >
                <el-button type="primary">{{ $t('common_import_selectFile') }}</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" align="right">
            <el-button name="cancelSubmit" type="primary" @click="cancelSubmit">{{ $t('common_cancel') }}</el-button>
            <ody-button
              name="Opms-PurchasePlanCollectList04_onSubmitUploadFile"
              type="primary"
              code="Opms-PurchasePlanCollectList04"
              @click="onSubmitUploadFile('fileUpload')"
            >{{ $t('common_save') }}</ody-button>
          </el-col>
        </el-row>
      </el-form>
    </ody-dialog>
    <!--商家选择模态框-->
    <MerchantSelectModal :visible.sync="showMerchantModal" @ok="selectMerchant" />
    <!--批量拆分模态框
    <PurchasePlanSplit
      ref="purchasePlanSplit"
      :visible.sync="visible"
      :form-data.sync="formData"
      :plan-list.sync="list"
      @ok="handleOk"
    />-->
    <DefaultSupplierModal :visible.sync="showSupplierModal" @ok="selectSupplier" />
  </section>
</template>

<script>
import dateUtil from '@/utils/dateUtil'
import MerchantSelectModal from '@/components/merchantModal'
// import PurchasePlanSplit from '@/components/purchasePlanSplit'
import DefaultSupplierModal from '@/components/defaultSupplierModal'

export default {
  name: 'OpmsPurchasePlanCollectList',
  components: {
    MerchantSelectModal,
    // PurchasePlanSplit,
    DefaultSupplierModal
  },
  data() {
    return {
      batchSetType: '',
      showMerchantModal: false,
      dialogTableVisible: false,
      visible: false,
      planTypes: [],
      includingDeliveryFees: [],
      distrbutionChannels: [],
      defaultSupplierIds: [],
      serviceFeeTypes: [],
      defaultSupplierCode: null,
      selectedItem: null,
      merchants: [],
      searchForm: getDefaultSearchForm(),
      loading: false,
      batchSelectSetValue: null,
      supplierName: null,
      batchSetValue: null,
      batchValue: null,
      batchValues: [],
      disabledValue: false,
      supplierValue: false,
      selectDisabledValue: false,
      showSupplierModal: false,
      fileUpload: {
        fileNames: '',
        file: ''
      },
      fileList: [],
      checked: [],
      list: [],
      fileName: 'purchasePlanItemsTemplate.xlsx',
      templateUrl: '/api/opms-web/purchasePlanCollect/exportTemplate.do',
      doUpload: '/api/opms-web/purchasePlanCollect/import.do',
      executionStatus: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      rules: {
        fileNames: [
          {
            required: true,
            message: this.$t('common_please_selectFile'),
            trigger: 'blur'
          }
        ]
      },
      columns: [
        {
          show: true,
          prop: 'lineNo',
          label: this.$t('exportTask_field_id'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'mpCode',
          label: this.$t('common_product_code'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'mpName',
          label: this.$t('common_product_name'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'mpSpec',
          label: this.$t('common_product_model'),
          align: 'center',
          minWidth: 200,
          formatter: row => {
            return row.mpSpec != null ? row.mpSpec.replace(/\n/g, '<br/>') : ''
          }
        },
        {
          show: true,
          prop: 'mpMeasureUnitName',
          label: this.$t('common_mp_unit'),
          align: 'center'
        },
        {
          show: true,
          prop: 'planTypeStr',
          label: this.$t('purchase_plan_type'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'planStartDate',
          label: this.$t('plan_start_date'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            return dateFormatOfTime(row.planStartDate)
          }
        },
        {
          show: true,
          prop: 'planExpiryDate',
          label: this.$t('plan_end_date'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            return dateFormatOfTime(row.planExpiryDate)
          }
        },
        {
          show: true,
          prop: 'collectPurchaseNum',
          label: this.$t('collect_purchase_num'),
          align: 'center'
        },
        {
          show: true,
          prop: 'settlementPartyTypeStr', // 结算地
          label: this.$t('settlement_party'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('purchase_plan_filed_merchant_name'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'approvedPurchaseNum', // 核准数量
          label: this.$t('approval_purchase_num'),
          align: 'center'
        },
        {
          show: true,
          prop: 'expectReceiveDate',
          label: this.$t('expect_receive_date'),
          align: 'center',
          formatter: (row, column, cellValue) => {
            return dateFormatOfTime(row.expectReceiveDate)
          }
        },
        {
          show: true,
          prop: 'defaultSupplierName',
          label: this.$t('assign_supplier_name'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'minOrderQuantity', // 起订量
          label: this.$t('purchaseOrder_product_minCount'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'purchaseTaxRate',
          label: this.$t('purchase_request_order_costTaxRate'),
          align: 'center',
          minWidth: 88,
          formatter: (row, column) => {
            const rate = row.purchaseTaxRate
            if (!isNaN(Number(rate))) {
              return Number(rate * 100).toFixed(0) + '%'
            } else {
              return '0%'
            }
          }
        },
        {
          show: true,
          prop: 'saleWithTaxUnitAmt', // 含税协议价 改为含税采购价
          label: this.$t('purchase_wi_tax_price'),
          align: 'center',
          formatter: (row, column) => {
            const saleWithTaxUnitAmt = row.saleWithTaxUnitAmt
            if (!isNaN(Number(saleWithTaxUnitAmt))) {
              return Number(saleWithTaxUnitAmt).toFixed(6)
            } else {
              return 0
            }
          }
        },
        {
          show: true,
          prop: 'saleWithoutTaxUnitAmt', // 未税协议价 改为未税采购价
          label: this.$t('purchase_wo_tax_price'),
          align: 'center',
          formatter: (row, column) => {
            const saleWithoutTaxUnitAmt = row.saleWithoutTaxUnitAmt
            if (!isNaN(Number(saleWithoutTaxUnitAmt))) {
              return Number(saleWithoutTaxUnitAmt).toFixed(6)
            } else {
              return 0
            }
          }
        },
        {
          show: true,
          prop: 'serviceFeeTypeStr', //  加价方式
          label: this.$t('service_fee_type'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'serviceFeeValue', //  加价数值
          label: this.$t('service_fee_value'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'purchaseWiTaxPrice',
          label: this.$t('sale_price_wi_tax'), // 含税采购价 改为含税售价
          align: 'center',
          formatter: (row, column) => {
            const purchaseWiTaxPrice = row.purchaseWiTaxPrice
            if (!isNaN(Number(purchaseWiTaxPrice))) {
              return Number(purchaseWiTaxPrice).toFixed(6)
            } else {
              return 0
            }
          }
        },
        {
          show: true,
          prop: 'purchaseWoTaxPrice',
          label: this.$t('sale_price_wo_tax'), // 未税采购价 改为未税售价
          align: 'center',
          formatter: (row, column) => {
            const purchaseWoTaxPrice = row.purchaseWoTaxPrice
            if (!isNaN(Number(purchaseWoTaxPrice))) {
              return Number(purchaseWoTaxPrice).toFixed(6)
            } else {
              return 0
            }
          }
        },
        {
          show: true,
          prop: 'includingShippingFeeStr', // 是否含运费
          label: this.$t('including_shipping_fee'),
          align: 'center'
        },
        {
          show: true,
          prop: 'deliveryMethondStr',
          label: this.$t('contract_modeTransport'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'planCode',
          label: this.$t('purchase_plan_code'),
          align: 'center',
          width: 200
        },
        {
          show: true,
          prop: 'executionStatusStr',
          label: this.$t('execution_status'),
          align: 'center'
        }
      ]
    }
  },
  computed: {
    checkedMap() {
      return this.checked.reduce((rtv, item) => {
        rtv[item.id] = true
        return rtv
      }, {})
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    handleSelectionChange(val) {
      // this.checked.push(val)
    },
    onSubmitUploadFile(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$refs.upload.submit()
          this.dialogTableVisible = false
        } else {
          return false
        }
      })
    },
    queryBatchValue() {
      const vue = this
      vue.selectDisabledValue = false
      vue.batchSelectSetValue = null
      vue.batchSetValue = null
      vue.defaultSupplierCode = null
      const batchType = this.batchSetType
      if (batchType === 'defaultSupplierId') {
        // vue.batchValues = Object.assign({}, Object.assign({}, vue.defaultSupplierIds))
        // for (var key in vue.batchValues) {
        //   vue.batchSelectSetValue = key
        //   break
        // }
        vue.disabledValue = false
        vue.supplierValue = true
      } else if (batchType === 'isIncludingDeliveryFee') {
        vue.batchValues = Object.assign(
          {},
          Object.assign({}, vue.includingDeliveryFees)
        )
        // 按需求设置默认选中的值
        vue.batchSelectSetValue = '1'
        vue.disabledValue = false
        vue.supplierValue = false
        vue.selectDisabledValue = true
      } else if (batchType === 'deliveryMethond') {
        vue.batchValues = Object.assign(
          {},
          Object.assign({}, vue.distrbutionChannels)
        )
        vue.batchSelectSetValue = '1'
        vue.disabledValue = false
        vue.supplierValue = false
        vue.selectDisabledValue = true
      } else if (batchType === 'serviceFeeType') {
        vue.batchValues = Object.assign(
          {},
          Object.assign({}, vue.serviceFeeTypes)
        )
        vue.batchSelectSetValue = '1'
        vue.disabledValue = false
        vue.supplierValue = false
        vue.selectDisabledValue = true
      } else {
        vue.batchValues = []
        vue.disabledValue = true
        vue.selectDisabledValue = false
        vue.supplierValue = false
      }
    },
    batchHandle() {
      if (this.checked && this.checked.length > 0) {
        const editData = []
        const batchType = this.batchSetType
        if (batchType === undefined) {
          this.$message({
            type: 'error',
            message: this.$t('error_at_least_select_one_option')
          })
          return
        }
        if (
          batchType === 'applyPurchaseNum' ||
          batchType === 'saleWithTaxUnitAmt' ||
          batchType === 'serviceFeeValue'
        ) {
          this.batchValue = this.batchSetValue
        } else {
          this.batchValue = this.batchSelectSetValue
        }
        // 只有 待平台询价 的数据才能进行批量设置操作
        const removes = []
        for (let i = this.checked.length - 1; i >= 0; i--) {
          const item = this.checked[i]
          if (item.executionStatus !== 3) {
            removes.push(item.lineNo)
          }
        }
        if (removes.length > 0) {
          this.$message({
            type: 'error',
            message:
              this.$t('error_at_enquiry_confirm_execution_status') + removes
          })
          return
        }
        for (let i = 0; i < this.checked.length; i++) {
          const item = this.checked[i]
          const itemMsg = {}
          itemMsg.mpId = item.mpId
          itemMsg.mpCode = item.mpCode
          itemMsg.minOrderQuantity = item.minOrderQuantity
          itemMsg.purchasePlanCode = item.purchasePlanCode
          itemMsg[batchType] = this.batchValue
          itemMsg.handleType = batchType
          itemMsg.approvedPurchaseNum = item.approvedPurchaseNum
          itemMsg.merchantId = item.merchantId
          itemMsg.lineNo = item.lineNo
          // console.info(itemMsg)
          if (batchType === 'saleWithTaxUnitAmt') {
            // 含税协议价
            itemMsg.serviceFeeType = item.serviceFeeType
            itemMsg.serviceFeeValue = item.serviceFeeValue
            var numReg = /^(\-|\+)?\d+(\.\d+)?$/
            var numRe = new RegExp(numReg)
            if (
              itemMsg.saleWithTaxUnitAmt == null ||
              !numRe.test(itemMsg.saleWithTaxUnitAmt)
            ) {
              this.$message({
                type: 'error',
                message: this.$t('supplier_product_check_costWithTaxUnitAmt')
              })
              return
            }
          }
          if (batchType === 'serviceFeeType') {
            // 加价方式
            itemMsg.saleWithTaxUnitAmt = item.saleWithTaxUnitAmt
            itemMsg.serviceFeeValue = this.batchSetValue
          }
          if (batchType === 'serviceFeeValue') {
            // 加价数值
            itemMsg.serviceFeeType = item.serviceFeeType
            itemMsg.saleWithTaxUnitAmt = item.saleWithTaxUnitAmt
          }
          if (batchType === 'isIncludingDeliveryFee') {
            // 是否含运费
            itemMsg.isIncludingDeliveryFee = this.batchSelectSetValue
          }
          if (batchType === 'deliveryMethond') {
            // 运输方式
            itemMsg.deliveryMethond = this.batchSelectSetValue
          }
          if (batchType === 'defaultSupplierId') {
            // 供应商
            itemMsg.defaultSupplierCode = this.defaultSupplierCode
          }
          itemMsg.purchaseTaxRate = item.purchaseTaxRate
          editData.push(itemMsg)
        }
        this.handleBatchMsg(editData)
      } else {
        this.$message({
          type: 'error',
          message: this.$t('error_at_least_select_one_inventory')
        })
      }
    },
    handleBatchMsg(editData) {
      const vue = this
      this.$confirm(
        this.$t('common_batch_plan_items_confirm'),
        this.$t('commom_msg_plan_items_confirm'),
        {
          confirmButtonText: this.$t('common_confirm'),
          cancelButtonText: this.$t('common_cancel'),
          type: 'warning'
        }
      ).then(() => {
        vue.$opms.$api.purchasePlan
          .purchasePlanBatchHandle({ purchasePlanItemsList: editData })
          .then(result => {
            if (result && result.code === '0') {
              if (result.data != null && result.data.length > 0) {
                this.$message({
                  type: 'error',
                  message:
                    this.$t('exportTask_field_id') +
                    result.data +
                    this.$t(
                      'merchant_commodities_do_not_sign_purchase_price_with_current_supplier'
                    )
                })
              } else {
                vue.$message({
                  type: 'success',
                  message: vue.$t('common_batch_plan_items_confirm_success')
                })
              }
              vue.updateList()
              this.checked = []
            }
          })
      })
    },
    batchEnquiryConfirm() {
      if (this.checked && this.checked.length > 0) {
        const editData = []
        for (let i = 0; i < this.checked.length; i++) {
          const item = this.checked[i]
          const itemMsg = {}
          itemMsg.id = item.itemsId
          itemMsg.purchasePlanCode = item.purchasePlanCode
          itemMsg.executionStatus = 4 // 询价确认将执行状态改为待平台审核
          editData.push(itemMsg)
        }
        // 只有 待平台询价 的数据才能进行操作
        const removes = []
        for (let i = this.checked.length - 1; i >= 0; i--) {
          const item = this.checked[i]
          if (item.executionStatus !== 3) {
            removes.push(item.lineNo)
          }
        }
        if (removes.length > 0) {
          this.$message({
            type: 'error',
            message:
              this.$t('error_at_enquiry_confirm_execution_status') + removes
          })
          return
        }
        this.handleEnquiryConfirm(editData)
      } else {
        this.$message({
          type: 'error',
          message: this.$t('error_at_least_select_one_inventory')
        })
      }
    },
    handleEnquiryConfirm(editData) {
      const vue = this
      this.$confirm(
        this.$t('common_batch_enquiry_confirm'),
        this.$t('commom_msg_enquiry_confirm'),
        {
          confirmButtonText: this.$t('common_confirm'),
          cancelButtonText: this.$t('common_cancel'),
          type: 'warning'
        }
      ).then(() => {
        vue.$opms.$api.purchasePlan
          .purchasePlanEnquiryConfirm({ purchasePlanItemsList: editData })
          .then(result => {
            if (result && result.code === '0') {
              vue.$message({
                type: 'success',
                message: vue.$t('common_batch_enquiry_confirm_success')
              })
              vue.updateList()
            }
          })
      })
    },
    downLoadTemplate() {
      this.$portal.downloadFileByGet(this.templateUrl, {}, this.fileName)
    },
    cancelSubmit() {
      this.dialogTableVisible = false
      this.fileUpload.fileNames = ''
    },
    handlePreview(file) {
      this.fileUpload.fileNames = file.name
    },
    handleSuccess(response, file, fileList) {
      if (response.data != null) {
        if (response.data.successMessage != null) {
          this.$message({
            type: 'success',
            message: this.$t(response.data.successMessage)
          })
        }
        if (response.data.errors != null && response.data.errors.length > 0) {
          this.$message({
            type: 'error',
            message: this.$t(response.data.errors)
          })
        }
        this.dialogTableVisible = false
        loadList(this)
      }
    },
    async handleTabsClick() {
      try {
        this.currentTab = this.tabs[this.activeState]
        this.searchForm.pickStatus = this.currentTab.pickStatus
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async updateList() {
      try {
        this.loading = true
        await loadList(this)
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
        this.checked = []
      } catch (ex) {
        console.log(ex)
      }
    },
    async exportData() {
      try {
        await exportData(this)
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
    },
    handlePageSizeChange() {
      this.handleSearchSubmit()
    },
    showSupplier() {
      this.showSupplierModal = true
    },
    selectSupplier(result) {
      if (result) {
        this.batchSelectSetValue = result.orgId
        this.defaultSupplierCode = result.orgCode
        this.supplierName = result.orgName
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    _initCodes() {
      const vue = this
      this.$opms.$api.code
        .selectMulti({
          categories: [
            'PLAN_TYPE',
            'EXECUTION_STATUS',
            'DISTRIBUTION_CHANNEL',
            'IS_INCLUDING_DELIVERY_FEE',
            'SERVICE_FEE_TYPE'
          ]
        })
        .then(data => {
          if (data.data.PLAN_TYPE) {
            vue.planTypes = data.data.PLAN_TYPE
          }
          if (data.data.EXECUTION_STATUS) {
            for (var prop in data.data.EXECUTION_STATUS) {
              if (prop <= 2) {
                delete data.data.EXECUTION_STATUS[prop]
              }
            }
            vue.executionStatus = data.data.EXECUTION_STATUS
          }

          if (data.data.DISTRIBUTION_CHANNEL) {
            vue.distrbutionChannels = data.data.DISTRIBUTION_CHANNEL
          }
          if (data.data.IS_INCLUDING_DELIVERY_FEE) {
            vue.includingDeliveryFees = data.data.IS_INCLUDING_DELIVERY_FEE
          }
          if (data.data.SERVICE_FEE_TYPE) {
            vue.serviceFeeTypes = data.data.SERVICE_FEE_TYPE
          }
        })
    },
    init() {
      this._initCodes()
      this.updateList()
    },
    showMerchantSelectModal() {
      this.showMerchantModal = true
    },
    selectMerchant(result) {
      if (result) {
        this.searchForm.merchantCode = result.merchantCode
        this.searchForm.merchantId = result.merchantId
        this.searchForm.merchantName = result.merchantName
      }
    }
  }
}
async function exportData(vue) {
  await loadList(vue, true)
}

async function loadList(vue, isExport = false) {
  const filters = JSON.parse(JSON.stringify(vue.searchForm))
  if (filters.planStartDate) {
    filters.planStartDateStart = filters.planStartDate[0]
    filters.planStartDateEnd = filters.planStartDate[1]
    delete filters.planStartDate
  }
  if (filters.planExpiryDate) {
    filters.planExpiryDateStart = filters.planExpiryDate[0]
    filters.planExpiryDateEnd = filters.planExpiryDate[1]
    delete filters.planExpiryDate
  }
  const param = {
    obj: filters,
    currentPage: vue.page.current,
    itemsPerPage: vue.page.size
  }
  const purchasePlan = vue.$opms.$api.purchasePlan
  if (!isExport) {
    const res = await purchasePlan.purchasePlanCollectListPage(param)
    if (res) {
      const data = res.data
      vue.list = data.listObj || []
      if (vue.list && vue.list.length > 0) {
        for (let i = 0; i <= vue.list.length - 1; i++) {
          vue.list[i].lineNo = i + 1
        }
      }
      vue.page.total = res.data.total
    }
  } else {
    // 导出excel
    vue.$portal.downloadFileByGet(
      'api/opms-web/purchasePlanCollect/exportPurchasePlanCollectList.do',
      { queryParams: JSON.stringify({ obj: param.obj }) },
      '采购计划汇总.xlsx'
    )
  }
}

function dateFormatOfTime(time) {
  if (!time) {
    return ''
  }
  return dateUtil.dateFormatForTime(time, false)
}
function getDefaultSearchForm() {
  const currentDate = new Date()
  const currentEndDate = new Date()
  currentEndDate.setDate(currentEndDate.getDate() + 90)

  return Object.assign(
    {},
    {
      goodReceiverProvinceCode: null,
      goodReceiverCityCode: null,
      goodReceiverAreaCode: null,
      planStartDate: [
        dateFormatOfTime(currentDate),
        dateFormatOfTime(currentEndDate)
      ],
      pickStatus: null,
      visible: false
    }
  )
}
</script>

<style lang="scss" scoped>
.importdown{
margin-right: 16px;
}
.batch-select{
  width: 120px;
  margin-right:16px;
}
</style>
