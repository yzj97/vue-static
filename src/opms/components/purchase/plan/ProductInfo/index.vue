<template>
  <section>
    <el-card>
      <el-tabs v-model="activeName" name="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('details_info')" name="product">
          <ody-list-table-area>
            <div v-if="isEdit && platformId === 2" slot="btn">
              <ody-button
                name="OpmsPurchasePlanList12_showProductSelectModal"
                size="mini"
                type="primary"
                code="OpmsPurchasePlanList12"
                @click="showProductSelectModal"
              >{{ $t('contract_addContractGoods') }}</ody-button>
              <ody-button
                name="OpmsPurchasePlanList13_deleteProduct"
                size="mini"
                type="primary"
                code="OpmsPurchasePlanList13"
                @click="deleteProduct"
              >{{ $t('common_delete') }}</ody-button>
              <ody-button
                name="OpmsPurchasePlanList14_showPurchasePlanTemplate"
                size="mini"
                type="primary"
                code="OpmsPurchasePlanList14"
                @click="showPurchasePlanTemplate"
              >{{ $t('purchase_plan_add_from_template') }}</ody-button>
              <el-upload
                :show-file-list="false"
                :on-success="importTemplateSuccess"
                :action="'api/opms-web/contractProductPrice/importProductTemplate.do?merchantId='+formData.merchantId"
                accept=".xls, .xlsx"
                style="display: inline-block;"
              >
                <ody-button
                  name="OpmsPurchasePlanList15"
                  size="mini"
                  type="primary"
                  code="OpmsPurchasePlanList15"
                  @click="importProduct"
                >{{ $t('common_import') }}</ody-button>
              </el-upload>
              <ody-button
                name="OpmsPurchasePlanList16_templateDownload"
                size="mini"
                type="primary"
                code="OpmsPurchasePlanList16"
                @click="templateDownload(1)"
              >{{ $t('contract_modelDownLoad') }}</ody-button>
            </div>
            <div v-if="isEdit && platformId === 1" slot="btn">
              {{ $t('common_mp_code') }}
              <el-input v-model="mpCodeFilter" name="mpCodeFilter" style="width: 200px; margin-left: 20px" />
              <el-upload
                :show-file-list="false"
                :on-success="importApprovedPurchaseNumTemplateSuccess"
                accept=".xls, .xlsx"
                action="api/opms-web/contractProductPrice/importApprovedPurchaseNumTemplate.do"
                style="display: inline-block;"
              >
                <ody-button
                  name="OpmsPurchasePlanList17"
                  size="mini"
                  type="primary"
                  code="OpmsPurchasePlanList17"
                >{{ $t('common_import') }}</ody-button>
              </el-upload>
              <ody-button
                name="OpmsPurchasePlanList18_templateDownload"
                size="mini"
                type="primary"
                code="OpmsPurchasePlanList18"
                @click="templateDownload(2)"
              >{{ $t('contract_countModelDownLoad') }}</ody-button>
            </div>
            <div slot="table">
              <el-form ref="tableData" :model="tableData" :rules="tableRules">
                <el-table
                  :data="tableData.productList.filter(data => !mpCodeFilter || data.mpCode.includes(mpCodeFilter))"
                  :summary-method="getSummaries"
                  name="tableData_productList_filter(data => !mpCodeFilter || data_mpCode_includes(mpCodeFilter))752"
                  show-summary
                  style="width: 100%"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column v-if="platformId === 2 && isEdit" type="selection" width="55" />
                  <el-table-column
                    :label="this.$t('common_sericalNo')"
                    :index="showIndex"
                    type="index"
                    align="center"
                  />
                  <el-table-column
                    :label="this.$t('common_mp_code')"
                    align="center"
                    min-width="160"
                    prop="mpCode"
                  />
                  <el-table-column
                    :label="this.$t('common_mp_name')"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160"
                    prop="mpName"
                  />
                  <el-table-column
                    :label="this.$t('common_mp_spec')"
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="160"
                    prop="mpSpec"
                  />
                  <el-table-column
                    :label="this.$t('common_mp_unit')"
                    min-width="140"
                    align="center"
                    prop="mpMeasureUnitName"
                  />
                  <el-table-column
                    :label="this.$t('purchase_plan_filed_settlement_party_type')"
                    align="center"
                    prop="settlementPartyTypeText"
                  />
                  <el-table-column
                    :label="this.$t('purchase_plan_filed_real_stock_sum')"
                    align="center"
                    prop="availableStockSum"
                  />
                  <el-table-column
                    :label="this.$t('purchase_plan_filed_apply_purchase_num')"
                    align="center"
                    min-width="180"
                    prop="applyPurchaseNum"
                  >
                    <template slot-scope="scope">
                      <el-form-item
                        v-show="isEdit && platformId === 2"
                        :prop="'productList.' + scope.$index + '.applyPurchaseNum'"
                        :rules="tableRules.applyPurchaseNum"
                      >
                        <el-input v-model="scope.row.applyPurchaseNum" name="scope_row_applyPurchaseNum" type="number" />
                      </el-form-item>
                      <span v-show="!isEdit || platformId === 1">{{ scope.row.applyPurchaseNum }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-show="formData.executionStatus > 0"
                    :label="this.$t('purchase_plan_filed_approved_purchase_num')"
                    align="center"
                    min-width="180"
                    prop="approvedPurchaseNum"
                  >
                    <template slot-scope="scope">
                      <el-form-item
                        v-if="isEdit"
                        :prop="'productList.' + scope.$index + '.approvedPurchaseNum'"
                        :rules="tableRules.approvedPurchaseNum"
                      >
                        <el-input v-model="scope.row.approvedPurchaseNum" name="scope_row_approvedPurchaseNum" type="number" />
                      </el-form-item>
                      <span v-show="!isEdit">{{ scope.row.approvedPurchaseNum }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="this.$t('expect_receive_date')"
                    align="center"
                    min-width="230"
                    prop="expectReceiveDate"
                  >
                    <template slot-scope="scope">
                      <el-form-item
                        v-show="isEdit && platformId === 2"
                        :prop="'productList.' + scope.$index + '.expectReceiveDate'"
                        :rules="tableRules.expectReceiveDate"
                      >
                        <el-date-picker
                          v-model="scope.row.expectReceiveDate"
                          :picker-options="pickerOptions"
                          name="scope_row_expectReceiveDate"
                          type="date"
                        />
                      </el-form-item>
                      <span v-show="!isEdit || platformId === 1">{{ scope.row.expectReceiveDate }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="this.$t('purchase_plan_filed_suggest_supplier')"
                    align="center"
                    min-width="150"
                    prop="defaultSupplierId">
                    <template slot-scope="scope">
                      <el-form-item
                        v-show="isEdit && platformId === 2"
                        :prop="'productList.' + scope.$index + '.defaultSupplierId'">
                        <el-select
                          v-model="scope.row.defaultSupplierId"
                          :placeholder="$t('common_choose_please')"
                          name="scope_row_defaultSupplierId"
                          @visible-change="showSupplier($event, scope.row)"
                          @change="supplierChange($event, scope.row)">
                          <el-option value>{{ $t('common_choose_please') }}</el-option>
                          <el-option
                            v-for="item in scope.row.suppliers"
                            :label="item.supplierName"
                            :key="item.id"
                            :value="item.id"/>
                        </el-select>
                      </el-form-item>

                      <span v-show="!isEdit || platformId === 1">{{ scope.row.defaultSupplierName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="this.$t('purchase_request_order_costTaxRate')"
                    align="center"
                    min-width="100"
                    prop="purchaseTaxRateText"
                  />
                  <el-table-column
                    v-if="platformId===1"
                    :label="this.$t('price_wi_tax')"
                    align="center"
                    prop="saleWithTaxUnitAmt"
                  />
                  <el-table-column
                    v-if="platformId===1"
                    :label="this.$t('price_wo_tax')"
                    align="center"
                    prop="saleWithoutTaxUnitAmt"
                  />
                  <el-table-column
                    :label="this.$t('asn_purchasePriceWithTax')"
                    min-width="120"
                    align="center"
                    prop="purchaseWiTaxPrice"
                  />
                  <el-table-column
                    :label="this.$t('asn_purchasePriceWithoutTax')"
                    align="center"
                    min-width="120"
                    prop="purchaseWoTaxPrice"
                  />
                  <el-table-column
                    :label="this.$t('including_shipping_fee')"
                    align="center"
                    min-width="120"
                    prop="isIncludingDeliveryFeeText"
                  />
                  <el-table-column
                    :label="this.$t('purchase_receive_deliveryType')"
                    align="center"
                    prop="deliveryMethondText"
                  />
                  <el-table-column
                    :label="this.$t('purchaseOrder_product_minCount')"
                    align="center"
                    prop="minOrderQuantity"
                  />
                  <el-table-column
                    :label="this.$t('payment_period')"
                    align="center"
                    prop="paymentPeriodName"
                  />
                  <el-table-column
                    v-if="platformId === 2 && formData.executionStatus > 0"
                    :label="this.$t('purchase_plan_filed_actual_purchase_num')"
                    align="center"
                    prop="actualPurchaseNum"
                  />
                  <el-table-column
                    v-if="platformId === 2 && formData.executionStatus > 0"
                    :label="this.$t('purchase_plan_filed_un_purchase_num')"
                    align="center"
                    prop="unPurchaseNum"
                  />
                  <el-table-column
                    :label="this.$t('common_remark')"
                    align="center"
                    min-width="200"
                    prop="remark"
                  >
                    <template slot-scope="scope">
                      <el-form-item
                        v-if="isEdit && platformId === 2"
                        :prop="'productList.' + scope.$index + '.remark'"
                      >
                        <el-input v-model="scope.row.remark" name="scope_row_remark" type="textarea" maxlength="100" />
                      </el-form-item>
                      <span v-if="!isEdit || platformId === 1">{{ scope.row.remark }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </div>
          </ody-list-table-area>
        </el-tab-pane>
        <el-tab-pane :label="$t('common_operationLog')" name="log">
          <ody--list-table-area>
            <div slot="table">
              <ody-table :data="logs" :columns="logColumns" :can-filter="false" :multiple="false" name="logs632" />
            </div>
            <div slot="page">
              <div class="block">
                <ody-pagination
                  :current-page.sync="page.current"
                  :list="logs"
                  :page-sizes="[10, 20, 30, 50]"
                  :page-size.sync="page.size"
                  :total.sync="page.total"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handlePageSizeChange"
                  @current-change="handlePageCurrentChange"
                />
              </div>
            </div>
          </ody--list-table-area>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <ProductSelectModal
      :visible.sync="showProductModal"
      :merchant-code.sync="formData.merchantCode"
      :merchant-id.sync="formData.merchantId"
      @ok="selectProduct"
    />
    <PurchasePlanTemplateSelectModal
      :visible.sync="showPurchasePlanTemplateModal"
      :merchant-code.sync="formData.merchantCode"
      @ok="selectPurchasePlanTemplate"
    />
  </section>
</template>

<script>
import ProductSelectModal from '@/components/purchase/plan/productSelectModal'
import PurchasePlanTemplateSelectModal from '@/components/purchase/plan/PurchasePlanTemplateSelectModal'
import numberUtil from '@/utils/numberUtil'

export default {
  components: {
    ProductSelectModal,
    PurchasePlanTemplateSelectModal
  },
  props: {
    formData: {
      type: Object,
      default: null
    },
    tableData: {
      type: Object,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    platformId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      showProductModal: false,
      showPurchasePlanTemplateModal: false,
      mpCodeFilter: null,
      activeName: 'product',
      tableRules: {
        applyPurchaseNum: [
          {
            required: true,
            message: this.$t('purchase_plan_need_apply_purchase_num'),
            trigger: 'blur'
          },
          { validator: this.validateNumber, trigger: 'blur' }
        ],
        approvedPurchaseNum: [
          {
            required: true,
            message: this.$t('purchase_plan_need_approval_purchase_num'),
            trigger: 'blur'
          },
          { validator: this.validateNumber, trigger: 'blur' }
        ],
        expectReceiveDate: [
          {
            required: true,
            message: this.$t('common_choose_date'),
            trigger: 'change'
          }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      },
      checked: [],
      logs: [],
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
      ],
      page: {
        size: 10,
        current: 1,
        total: 0
      }
    }
  },
  methods: {
    showProductSelectModal() {
      if (!this.formData.merchantId) {
        this.$message({
          type: 'warn',
          message: this.$t('common_please_choose_merchant')
        })
        return
      }
      this.showProductModal = true
    },
    importProduct(event) {
      if (!this.formData.merchantId) {
        this.$message({
          type: 'warn',
          message: this.$t('common_please_choose_merchant')
        })
        event.preventDefault()
        event.stopPropagation()
        event.cancelBubble = true
        return
      }
    },
    handleClick(tab, event) {
      if (tab.name === 'log') {
        this.updateList()
      }
    },
    validateNumber(rule, value, callback) {
      const num = value ? Number(value).toFixed(0) : 0
      const inRang = num >= 0 && num <= 999999999999
      const digitPattern = /^\d+(\.\d{1,6})?$/
      if (digitPattern.test(value) && inRang && Number(value) > 0) {
        return callback()
      }
      let message = this.$t('purchase_plan_check_apply_purchase_num')
      if (rule.field.indexOf('approvedPurchaseNum') !== -1) {
        message = this.$t('purchase_plan_check_approval_purchase_num')
      }
      return callback(new Error(message))
    },
    getSummaries(param) {
      const vue = this
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = vue.$t('common_total')
          return
        }
        if (
          column.property === 'applyPurchaseNum' ||
          column.property === 'approvedPurchaseNum'
        ) {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return numberUtil.sum([prev + '', curr + ''], 6)
              } else {
                return prev
              }
            }, 0)
          } else {
            sums[index] = ''
          }
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    downloadFile(file) {
      window.open(file.url)
    },
    handleFileUploadSuccess(response, file, fileList) {
      if (response && response.code === '0') {
        this.attachments.push({
          url: response.data.fileURL,
          name: response.data.fileName
        })
      }
    },
    handleFileRemove(file, fileList) {
      const index = this.attachments.indexOf(file)
      if (index > -1) {
        this.attachments.splice(index, 1)
      }
    },
    showPurchasePlanTemplate() {
      this.showPurchasePlanTemplateModal = true
    },
    importApprovedPurchaseNumTemplateSuccess(res, file) {
      if (res.data) {
        const productList = this.tableData.productList
        for (let i = 0; i < productList.length; i++) {
          var approvedPurchaseNum = res.data[productList[i].mpCode]
          if (approvedPurchaseNum != null && approvedPurchaseNum !== '') {
            var index = -1
            if ((index = approvedPurchaseNum.indexOf('.')) !== -1) {
              // 最多保留 6 位小数
              if (approvedPurchaseNum.length - index > 7) {
                approvedPurchaseNum = approvedPurchaseNum.substring(
                  0,
                  index + 7
                )
              }
            }
            productList[i].approvedPurchaseNum = approvedPurchaseNum
            delete res.data[productList[i].mpCode]
          }
        }
        const keys = Object.keys(res.data)
        if (keys && keys.length > 0) {
          alert('以下商品编号不存在：' + keys)
        }
      }
    },
    importTemplateSuccess(res, file) {
      // 导入模板
      if (res.data && res.data.importProducts) {
        const importProducts = res.data.importProducts
        const selectProducts = res.data.resp
        if (importProducts && res.data.unknowns.length > 0) {
          // TODO alert replace
          alert('以下商品编码不存在：' + res.data.unknowns)
        }
        for (let i = 0; i < selectProducts.length; i++) {
          const p = importProducts[selectProducts[i].mpCode]
          if (p) {
            try {
              if (p.expectReceiveDate != null) {
                if (p['expectReceiveDate'] > this.$portal.parseTime(new Date(949334400000), '{y}-{m}-{d} {h}:{i}:{s}') &&
                  p['expectReceiveDate'] < this.$portal.parseTime(new Date(new Date().getTime() + 315619200000), '{y}-{m}-{d} {h}:{i}:{s}')) {
                  selectProducts[i]['expectReceiveDate'] = this.$portal.parseTime(p['expectReceiveDate'], '{y}-{m}-{d}')
                } else {
                  selectProducts[i]['expectReceiveDate'] = this.$portal.parseTime(new Date(), '{y}-{m}-{d}')
                }
              } else {
                selectProducts[i]['expectReceiveDate'] = this.$portal.parseTime(new Date(), '{y}-{m}-{d}')
              }
              selectProducts[i]['applyPurchaseNum'] = p['applyPurchaseNum']
              selectProducts[i]['suggestSupplierName'] = p['defaultSupplierName']
              selectProducts[i]['defaultSupplierName'] = p['defaultSupplierName']
              selectProducts[i]['importRemark'] = p['remark']
            } catch (e) {
              console.error('发生错误：' + e)
            }
          }
        }
        if (selectProducts) {
          const products = {}
          selectProducts.forEach((item, index) => {
            for (let i = this.tableData.productList.length - 1; i >= 0; i--) {
              if (item.mpCode === this.tableData.productList[i].mpCode) {
                // 移除已经存在的
                this.tableData.productList.splice(i, 1)
                break
              }
            }
            products[item.mpCode] = item
          })
          // 去重添加
          this.selectProduct(Object.values(products))
          this.loadSupplier()
        }
      }
    },
    templateDownload(flag) {
      this.$portal.downloadFileByPost(
        'api/opms-web/contractProductPrice/exportProductTemplate.do',
        { flag: flag }
      )
    },
    deleteProduct() {
      for (let i = 0; i < this.checked.length; i++) {
        const index = this.tableData.productList.indexOf(this.checked[i])
        if (index > -1) {
          this.tableData.productList.splice(index, 1)
        }
      }
    },
    selectProduct(selectProducts) {
      const vue = this
      if (selectProducts) {
        selectProducts.forEach((item, index) => {
          if (vue.indexOfProduct(item) === -1) {
            if (item.isMainSupplier === 1 && item.contractProperty === 1) {
              vue.tableData.productList.push(vue.getProductDetail(item))
            } else {
              item.suppliers = []
              vue.clearProductPrice(item)
              if (item['importRemark']) {
                item['remark'] = item['importRemark']
              }
              item.mpMeasureUnitName = item.mpMeasurementUnit
              vue.tableData.productList.push(item)
            }
          }
        })
      }
    },
    selectPurchasePlanTemplate(selectPurchasePlanTemplates) {
      const vue = this
      const templateIds = []
      selectPurchasePlanTemplates.forEach((item, index) => {
        templateIds.push(item.id)
        vue.formData.planType = item.planType + ''
      })
      this.$opms.$api.purchasePlanTemplate
        .listItems({ filters: { purchasePlanTemplateId: templateIds }})
        .then(result => {
          if (result && result.code === '0') {
            const planTemplateItems = result.data
            const mpCodes = []
            const templateItemMap = new Map()
            planTemplateItems.forEach((item, index) => {
              if (vue.indexOfProduct(item) === -1) {
                mpCodes.push(item.mpCode)
                templateItemMap.set(item.mpCode, item)
              }
            })

            if (mpCodes.length > 0) {
              const contractProductPrice = vue.$opms.$api.contractProductPrice
              let contractProducts = []
              contractProductPrice
                .selectContractProductListForPurchasePlan({
                  mpCodeList: mpCodes,
                  merchantCode: vue.formData.merchantCode,
                  merchantId: vue.formData.merchantId
                })
                .then(result => {
                  if (result && result.data) {
                    contractProducts = result.data
                    const contractProductMap = new Map()
                    for (let i = 0; i < contractProducts.length; i++) {
                      const item = contractProducts[i]
                      contractProductMap.set(item.mpCode, item)
                    }

                    for (const mpCode of templateItemMap.keys()) {
                      const templateItem = templateItemMap.get(mpCode)
                      const contractProduct = contractProductMap.get(mpCode)
                      if (contractProduct) {
                        contractProduct.applyPurchaseNum =
                          templateItem.applyPurchaseNum
                        contractProduct.remark = templateItem.remark
                        if (
                          contractProduct.isMainSupplier === 1 &&
                          (contractProduct.contractProperty === 1 ||
                            contractProduct.contractProperty === 2)
                        ) {
                          vue.tableData.productList.push(
                            vue.getProductDetail(contractProduct)
                          )
                        } else {
                          contractProduct.suppliers = []
                          vue.clearProductPrice(contractProduct)
                          contractProduct.mpMeasureUnitName =
                            contractProduct.mpMeasurementUnit
                          vue.tableData.productList.push(contractProduct)
                        }
                      } else {
                        const item = {
                          mpId: templateItem.mpId,
                          mpCode: templateItem.mpCode,
                          mpName: templateItem.mpName,
                          mpSpec: templateItem.mpSpec,
                          mpMeasureUnitName: templateItem.mpMeasureUnitName,
                          mpPurchaseUnit: templateItem.mpMeasureUnitName,
                          applyPurchaseNum: templateItem.applyPurchaseNum,
                          remark: templateItem.remark
                        }
                        vue.tableData.productList.push(item)
                      }
                    }
                  }
                })
            }
          }
        })
    },
    getProductDetail(product) {
      return {
        mpId: product.mpId,
        mpCode: product.mpCode,
        mpName: product.mpName,
        mpBarcode: product.mpBarcode,
        mpSpec: product.mpSpec,
        categoryId: product.categoryId,
        categoryCode: product.categoryCode,
        categoryName: product.categoryName,
        availableStockSum: product.availableStockSum,
        mpMeasureUnitName: product.mpMeasurementUnit,
        mpPurchaseUnit: product.mpPurchaseUnit,
        settlementPartyType: product.settlementPartyType,
        settlementPartyTypeText: product.settlementPartyTypeText,
        contractCode: product.contractCode,
        contractType: product.contractType,
        contractProperty: product.contractProperty,
        defaultSupplierId: product.id,
        defaultSupplierCode: product.supplierCode,
        defaultSupplierName: product.supplierName,
        suppliers: [
          {
            id: product.id,
            supplierCode: product.supplierCode,
            supplierName: product.supplierName
          }
        ],
        saleWithTaxUnitAmt: product.saleWithTaxUnitAmt,
        saleWithoutTaxUnitAmt: product.saleWithoutTaxUnitAmt,
        purchaseTaxRate: product.costTaxRate,
        purchaseTaxRateText: product.costTaxRate
          ? product.costTaxRate * 100 + '%'
          : product.costTaxRate,
        purchaseWiTaxPrice: product.costWithTaxUnitAmt,
        purchaseWoTaxPrice: product.costWithoutTaxUnitAmt,
        isIncludingDeliveryFee: product.isIncludingDeliveryFee,
        isIncludingDeliveryFeeText: product.isIncludingDeliveryFeeText,
        deliveryMethond: product.distributionChannel,
        deliveryMethondText: product.distributionChannelText,
        paymentPeriodId: product.paymentPeriodId,
        paymentPeriodName: product.paymentPeriodName,
        paymentPeriodType: product.paymentPeriodId
          ? product.paymentPeriodType
          : '',
        paymentPeriodTypeText: product.paymentPeriodId
          ? product.paymentPeriodTypeText
          : '',
        paymentPeriodDay: product.paymentPeriodDay,
        minOrderQuantity: product.minOrderQuantity,
        invoiceType: product.invoiceType,
        serviceFee: product.serviceFee,
        serviceFeeType: product.serviceFeeType,
        serviceFeeValue: product.serviceFeeValue,
        expectReceiveDate: product.expectReceiveDate,
        applyPurchaseNum: product.applyPurchaseNum,
        remark: product.importRemark,
        suggestSupplierName: product.suggestSupplierName
      }
    },
    indexOfProduct(product) {
      for (let i = 0; i < this.tableData.productList.length; i++) {
        if (product.mpCode === this.tableData.productList[i].mpCode) {
          return 1
        }
      }
      return -1
    },
    handleSelectionChange(val) {
      this.checked = val
    },
    showIndex(index) {
      return index + 1
    },
    showSupplier(show, row) {
      if (show) {
        const params = {
          merchantCode: this.formData.merchantCode,
          mpCode: row.mpCode
        }
        const contractProductPrice = this.$opms.$api.contractProductPrice
        contractProductPrice
          .selectPurchasePlanProductSupplier(params)
          .then(result => {
            if (result && result.data) {
              row.suppliers = result.data
            }
          })
      }
    },
    loadSupplier() {
      const vue = this
      const ps = this.tableData.productList
      if (ps) {
        const mpCodeList = []
        for (var i in ps) {
          if (ps[i]['suggestSupplierName']) {
            mpCodeList.push(ps[i].mpCode)
          }
        }
        if (mpCodeList.length > 0) {
          const params = {
            merchantCode: this.formData.merchantCode,
            merchantId: this.formData.merchantId,
            mpCodeList: mpCodeList
          }
          const contractProductPrice = this.$opms.$api.contractProductPrice
          contractProductPrice
            .selectContractProductListForPurchasePlan(params)
            .then(result => {
              if (result && result.data) {
                const mpCodeMap = {}
                for (var i in result.data) {
                  var mpCode = result.data[i].mpCode
                  if (mpCodeMap[mpCode]) {
                    mpCodeMap[mpCode].push(result.data[i])
                  } else {
                    mpCodeMap[mpCode] = [result.data[i]]
                  }
                }
                for (var j in vue.tableData.productList) {
                  const suggestSupplierName =
                    vue.tableData.productList[j]['suggestSupplierName']
                  if (suggestSupplierName) {
                    const suppliers =
                      mpCodeMap[vue.tableData.productList[j].mpCode]
                    vue.tableData.productList[j].suppliers = suppliers
                    const defaultSupplierId = vue.findSupplierId(
                      suppliers,
                      suggestSupplierName
                    )
                    vue.tableData.productList[
                      j
                    ].defaultSupplierId = defaultSupplierId
                    if (defaultSupplierId) {
                      vue.supplierChange(
                        defaultSupplierId,
                        vue.tableData.productList[j]
                      )
                    }
                  }
                }
              }
            })
        }
      }
    },
    findSupplierId(suppliers, supplierName) {
      if (supplierName && suppliers != null && suppliers.length > 0) {
        for (let j = 0; j < suppliers.length; j++) {
          if (suppliers[j].supplierName === supplierName) {
            return suppliers[j].id
          }
        }
      }
      return null
    },
    clearProductPrice(product) {
      product.contractCode = null
      product.contractType = null
      product.contractProperty = null
      product.defaultSupplierId = null
      product.defaultSupplierCode = null
      product.id = null
      product.settlementPartyType = null
      product.settlementPartyTypeText = null
      product.supplierCode = null
      product.supplierName = null
      product.costTaxRate = null
      product.costWithTaxUnitAmt = null
      product.costWithoutTaxUnitAmt = null
      product.saleWithTaxUnitAmt = null
      product.saleWithoutTaxUnitAmt = null
      product.purchaseTaxRate = null
      product.purchaseTaxRateText = null
      product.purchaseWiTaxPrice = null
      product.purchaseWoTaxPrice = null
      product.isIncludingDeliveryFee = null
      product.isIncludingDeliveryFeeText = null
      product.distributionChannel = null
      product.distributionChannelText = null
      product.deliveryMethond = null
      product.deliveryMethondText = null
      product.paymentPeriodId = null
      product.paymentPeriodName = null
      product.paymentPeriodType = null
      product.paymentPeriodTypeText = null
      product.paymentPeriodDay = null
      product.minOrderQuantity = null
      product.invoiceType = null
      product.serviceFee = null
      product.serviceFeeType = null
      product.serviceFeeValue = null
    },
    supplierChange(current, row) {
      if (!current) {
        this.clearProductPrice(row)
        return
      }

      for (let i = 0; i < row.suppliers.length; i++) {
        const item = row.suppliers[i]
        if (item.id === current) {
          row.contractCode = item.contractCode
          row.contractType = item.contractType
          row.contractProperty = item.contractProperty
          row.defaultSupplierId = item.id
          row.settlementPartyType = item.settlementPartyType
          row.settlementPartyTypeText = item.settlementPartyTypeText
          row.defaultSupplierCode = item.supplierCode
          row.defaultSupplierName = item.supplierName
          row.saleWithTaxUnitAmt = item.saleWithTaxUnitAmt
          row.saleWithoutTaxUnitAmt = item.saleWithoutTaxUnitAmt
          row.purchaseTaxRate = item.costTaxRate
          row.purchaseTaxRateText = item.costTaxRate
            ? item.costTaxRate * 100 + '%'
            : item.costTaxRate
          row.purchaseWiTaxPrice = item.costWithTaxUnitAmt
          row.purchaseWoTaxPrice = item.costWithoutTaxUnitAmt
          row.isIncludingDeliveryFee = item.isIncludingDeliveryFee
          row.isIncludingDeliveryFeeText = item.isIncludingDeliveryFeeText
          row.deliveryMethond = item.distributionChannel
          row.deliveryMethondText = item.distributionChannelText
          row.paymentPeriodId = item.paymentPeriodId
          row.paymentPeriodName = item.paymentPeriodName
          row.paymentPeriodType = item.paymentPeriodId
            ? item.paymentPeriodType
            : ''
          row.paymentPeriodTypeText = item.paymentPeriodId
            ? item.paymentPeriodTypeText
            : ''
          row.paymentPeriodDay = item.paymentPeriodDay
          row.minOrderQuantity = item.minOrderQuantity
          row.invoiceType = item.invoiceType
          row.serviceFee = item.serviceFee
          row.serviceFeeType = item.serviceFeeType
          row.serviceFeeValue = item.serviceFeeValue
          return
        }
      }
    },
    async handlePageSizeChange(size) {
      try {
        this.$nextTick(function() {
          this.updateList()
        })
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async updateList() {
      try {
        await loadList(this)
      } catch (ex) {
        console.log(ex)
      }
    },
    validateProduct(success) {
      const vue = this
      vue.$refs['tableData'].validate(tableValid => {
        if (tableValid) {
          success()
        }
      })
    }
  }
}

async function loadList(vue) {
  if (vue.formData.id) {
    const param = {
      modelId: vue.formData.id,
      model: 'PurchasePlan',
      itemsPerPage: vue.page.size,
      currentPage: vue.page.current
    }
    const common = vue.$opms.$api.common

    common.findOplogPage(param).then(result => {
      if (result && result.code === '0') {
        vue.logs = result.data
        vue.page.total = result.total
      }
    })
  }
}
</script>

<style scoped>
</style>
