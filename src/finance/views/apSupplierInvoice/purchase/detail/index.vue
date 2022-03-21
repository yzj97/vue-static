<template>
  <section class="pg-apSupplierInvoice-list">
    <el-form ref="form" :rules="rules" :model="dataForm" label-width="180px" class="form">
      <ody-list-table-area>
        <div slot="tabs">
          <el-tabs v-model="activeState" name="activeState" @tab-click="handleTabsClick" >
            <el-tab-pane id="baseInfo" :label="$t('invoice_baseInfo')" >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_billing_type')" required>
                    <span>{{ invoiceBillingTypeMap[dataForm.invoiceBillingType] }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_status')" required>
                    <span>{{ statusMap[dataForm.status] }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :space="1" :label="$t('invoice_date')" class="register" prop="invoiceTime">
                    <el-date-picker
                      v-if="!isView"
                      v-model="dataForm.invoiceTime"
                      name="dataForm_invoiceTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"/>
                    <span v-if="isView" >{{ $portal.parseTime(dataForm.invoiceTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item v-show="showMerchant" :label="$t('common_merchant_name')" required>
                    <span>{{ dataForm.merchantName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('common_store_name')">
                    <span>{{ dataForm.storeName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('settle_obj_name')" required>
                    <span>{{ dataForm.settleObjName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_style')" required>
                    <span>{{ invoiceStyleMap[dataForm.invoiceStyle] }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_type')" prop="invoiceType">
                    <el-select v-if="!(isView || isRed)" v-model="dataForm.invoiceType" name="dataForm_invoiceType">
                      <el-option :label="$t('common_choose_please')" />
                      <el-option v-for="item in invoiceTypeList" :label="item.name" :key="item.code" :value="item.code" />
                    </el-select>
                    <span v-if="isView || isRed">{{ invoiceTypeMap[dataForm.invoiceType] }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('tax_treatment')" prop="taxTreatment">
                    <el-select v-if="!(isView || isRed)" v-model="dataForm.taxTreatment" name="dataForm_taxTreatment" @change="changeTaxTreatment">
                      <el-option v-for="(v, k) in taxTreatmentMap" :label="v" :key="k" :value="k" />
                    </el-select>
                    <span v-if="isView || isRed">{{ taxTreatmentMap[dataForm.taxTreatment] }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_code')" :rules="isOpen ? rules['invoiceCode'] : {}" prop="invoiceCode">
                    <el-input v-if="isOpen" v-model="dataForm.invoiceCode" name="dataForm_invoiceCode" maxlength="12" />
                    <span v-if="!isOpen" >{{ dataForm.invoiceCode }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_no')" :rules="isOpen ? rules['invoiceNo'] : {}" prop="invoiceNo" required>
                    <el-input v-if="isOpen" v-model="dataForm.invoiceNo" name="dataForm_invoiceNo" maxlength="8" />
                    <span v-if="!isOpen" >{{ dataForm.invoiceNo }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('validate_no')" :rules="isOpen ? rules['validateNo'] : {}" prop="validateNo">
                    <el-input v-if="isOpen" v-model="dataForm.validateNo" name="dataForm_validateNo" maxlength="20" />
                    <span v-if="!isOpen" >{{ dataForm.validateNo }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="dataForm.taxTreatment == '1' && !isRed">
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_deduction')" prop="deduction">
                    <el-input-number v-if="!isView" v-model="dataForm.deduction" :precision="4" :step="0.1" :min="0" :max="99999999999999" :controls="false" name="dataForm_deduction" style="width: 200px;" />
                    <span v-if="isView" > {{ dataForm.deduction }} </span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="isRed">
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_pro_invoice_code')">
                    <span>{{ dataForm.proInvoiceCode }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_pro_invoice_no')">
                    <span>{{ dataForm.proInvoiceNo }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_red_reason')">
                    <el-input v-model="dataForm.redReason" name="dataForm_redReason" type="textarea" maxlength="200" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane id="saleInfo" :label="$t('invoice_saler_title')">
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_saler_name')" prop="salerName">
                    <el-input v-if="!isView && !isRed" v-model="dataForm.salerName" name="dataForm_salerName" maxlength="25" />
                    <span v-if="isView || isRed">{{ dataForm.salerName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_saler_tax_code')" prop="salerTaxCode">
                    <el-input v-if="!isView && !isRed" v-model="dataForm.salerTaxCode" name="dataForm_salerTaxCode" maxlength="50" />
                    <span v-if="isView || isRed">{{ dataForm.salerTaxCode }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_saler_address')">
                    <el-input v-if="!isView && !isRed" v-model="dataForm.salerAddress" name="dataForm_salerAddress" maxlength="100" />
                    <span v-if="isView || isRed">{{ dataForm.salerAddress }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_saler_telephone')" prop="salerTelephone">
                    <el-input v-if="!isView && !isRed" v-model="dataForm.salerTelephone" name="dataForm_salerTelephone" maxlength="25" />
                    <span v-if="isView || isRed">{{ dataForm.salerTelephone }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_saler_bank_name')">
                    <el-input v-if="!isView && !isRed" v-model="dataForm.salerBankName" name="dataForm_salerBankName" maxlength="100" />
                    <span v-if="isView || isRed">{{ dataForm.salerBankName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_saler_account_no')">
                    <el-input v-if="!isView && !isRed" v-model="dataForm.salerAccountNo" name="dataForm_salerAccountNo" maxlength="100" />
                    <span v-if="isView || isRed">{{ dataForm.salerAccountNo }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_saler_payee')">
                    <el-input v-if="!isView && !isRed" v-model="dataForm.salerPayee" name="dataForm_salerPayee" maxlength="25" />
                    <span v-if="isView || isRed">{{ dataForm.salerPayee }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_saler_checker')">
                    <el-input v-if="!isView && !isRed" v-model="dataForm.salerChecker" name="dataForm_salerChecker" maxlength="100" />
                    <span v-if="isView || isRed">{{ dataForm.salerChecker }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_saler_drawer')">
                    <el-input v-if="!isView && !isRed" v-model="dataForm.salerDrawer" name="dataForm_salerDrawer" maxlength="100" />
                    <span v-if="isView || isRed">{{ dataForm.salerDrawer }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane id="puchaseInfo" :label="$t('invoice_purchaser_title')">
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_purchaser_type')">
                    <span >{{ invoiceDrawerTypeMap[dataForm.purchaserType] }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_purchaser_email')" prop="purchaserEmail">
                    <el-input v-if="!isView && !isRed" v-model="dataForm.purchaserEmail" name="dataForm_purchaserEmail" maxlength="50"/>
                    <span v-if="isView || isRed">{{ dataForm.purchaserEmail }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_purchaser_receiverTel')" prop="purchaserReceiverTel">
                    <el-input v-if="!isView && !isRed" v-model="dataForm.purchaserReceiverTel" name="dataForm_purchaserReceiverTel" maxlength="100"/>
                    <span v-if="isView || isRed">{{ dataForm.purchaserReceiverTel }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_purchaser_name')" prop="purchaserName">
                    <el-input v-if="!isView && !isRed" v-model="dataForm.purchaserName" name="dataForm_purchaserName" maxlength="100" />
                    <span v-if="isView || isRed">{{ dataForm.purchaserName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_purchaser_tax_code')" prop="purchaserTaxCode">
                    <el-input v-if="!isView && !isRed" v-model="dataForm.purchaserTaxCode" name="dataForm_purchaserTaxCode" maxlength="100" />
                    <span v-if="isView || isRed">{{ dataForm.purchaserTaxCode }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_purchaser_address')">
                    <el-input v-if="!isView && !isRed" v-model="dataForm.purchaserAddress" name="dataForm_purchaserAddress" maxlength="100" />
                    <span v-if="isView || isRed">{{ dataForm.purchaserAddress }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_purchaser_bank_name')">
                    <el-input v-if="!isView && !isRed" v-model="dataForm.purchaserBankName" name="dataForm_purchaserBankName" maxlength="100" />
                    <span v-if="isView || isRed">{{ dataForm.purchaserBankName }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_purchaser_account_no')">
                    <el-input v-if="!isView && !isRed" v-model="dataForm.purchaserAccountNo" name="dataForm_purchaserAccountNo" maxlength="100" />
                    <span v-if="isView || isRed">{{ dataForm.purchaserAccountNo }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('invoice_purchaser_mobile')" prop="purchaserTelephone">
                    <el-input v-if="!isView && !isRed" v-model="dataForm.purchaserTelephone" name="dataForm_purchaserTelephone" maxlength="50"/>
                    <span v-if="isView || isRed">{{ dataForm.purchaserTelephone }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div slot="table">
          <el-table
            v-loading="loading"
            :data="dataForm.supplierInvoiceDetail"
            name="dataForm_supplierInvoiceDetail122"
            style="width: 100%">
            <el-table-column
              v-if="dataForm && dataForm.status == 1 && !isView"
              :label="$t('common_operations')"
              align="center"
              width="80">
              <template slot-scope="scope">
                <ody-button
                  name="PurchaseInvoiceDeleteItem_deleteRow"
                  code="PurchaseInvoiceDeleteItem"
                  size="mini"
                  @click="deleteRow(scope.row)">
                  <span>{{ $t('common_delete') }}</span>
                </ody-button>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('common_product_code')"
              prop="itemMpCode"
              align="center"
              width="80"/>
            <el-table-column
              :label="$t('common_product_name')"
              prop="itemMpName"
              align="center"
              width="80"/>
            <el-table-column
              :label="$t('common_mp_spec')"
              prop="itemMpSpec"
              align="center"
              width="80"/>
            <el-table-column
              :label="$t('item_mp_measure_unit')"
              prop="itemMpMeasureUnit"
              align="center"
              width="80"/>
            <el-table-column
              :label="$t('invoice_item_category_code')"
              align="center"
              width="80">
              <template slot-scope="scope">
                <el-form-item
                  v-if="!isView && !isRed"
                  :prop="'supplierInvoiceDetail.' + scope.$index + '.itemCategoryCode'"
                  :rules="!isView && !isRed ? rules['itemCategoryCode'] : {}"
                  label-width="0px"
                >
                  <el-input v-model="scope.row.itemCategoryCode" name="scope_row_itemCategoryCode" maxlength="19" />
                </el-form-item>
                <span v-if="isView || isRed" >{{ scope.row.itemCategoryCode }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('invoice_item_name')"
              align="center"
              width="100">
              <template slot-scope="scope">
                <el-form-item
                  v-if="!isView && !isRed"
                  :prop="'supplierInvoiceDetail.' + scope.$index + '.itemName'"
                  :rules="!isView && !isRed ? rules['itemName'] : {}"
                  label-width="0px"
                >
                  <el-input v-model="scope.row.itemName" name="scope_row_itemName" maxlength="90" />
                </el-form-item>
                <span v-if="isView || isRed" >{{ scope.row.itemName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('item_spec')"
              align="center"
              width="100">
              <template slot-scope="scope">
                <el-form-item
                  v-if="!isView && !isRed"
                  :prop="'supplierInvoiceDetail.' + scope.$index + '.itemSpec'"
                  :rules="!isView && !isRed ? rules['itemSpec'] : {}"
                  label-width="0px"
                >
                  <el-input v-model="scope.row.itemSpec" name="scope_row_itemSpec" maxlength="40" />
                </el-form-item>
                <span v-if="isView || isRed" >{{ scope.row.itemSpec }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('item_unit')"
              align="center"
              width="100">
              <template slot-scope="scope">
                <el-form-item
                  v-if="!isView && !isRed"
                  :prop="'supplierInvoiceDetail.' + scope.$index + '.itemUnit'"
                  :rules="!isView && !isRed ? rules['itemUnit'] : {}"
                  label-width="0px"
                >
                  <el-input v-model="scope.row.itemUnit" name="scope_row_itemUnit" maxlength="20" />
                </el-form-item>
                <span v-if="isView || isRed" >{{ scope.row.itemUnit }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('item_num')"
              align="center"
              width="120">
              <template slot-scope="scope">
                <el-form-item
                  v-if="!isView"
                  :prop="'supplierInvoiceDetail.' + scope.$index + '.itemNum'"
                  :rules="!isView ? rules['itemNum'] : {}"
                  label-width="0px"
                >
                  <el-input v-model="scope.row.itemNum" :precision="4" :step="0.1" :min="scope.row.minItemNum" :max="scope.row.maxItemNum" :controls="false" :disabled="true" name="scope_row_itemNum" style="width: 100px;" @change="modifyItemNum(scope.row)"/>
                </el-form-item>
                <span v-if="isView" >{{ scope.row.itemNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('item_un_taxed_unit_amt')"
              align="center"
              prop="itemUnTaxedUnitAmt"
              width="80" />
            <el-table-column
              :label="$t('item_taxed_unit_amt')"
              align="center"
              width="120">
              <template slot-scope="scope">
                <el-form-item
                  v-if="!isView && !isRed"
                  :prop="'supplierInvoiceDetail.' + scope.$index + '.itemTaxedUnitAmt'"
                  :rules="!isView ? rules['itemTaxedUnitAmt'] : {}"
                  label-width="0px"
                >
                  <el-input v-model="scope.row.itemTaxedUnitAmt" :precision="6" :step="0.1" :min="0.000001" :max="999999999999" :controls="false" :disabled="true" name="scope_row_itemTaxedUnitAmt" style="width: 100px;" @change="modifyItemTaxedUnitAmt(scope.row)" />
                </el-form-item>
                <span v-if="isView || isRed" >{{ scope.row.itemTaxedUnitAmt }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('item_un_taxed_amt')"
              align="center"
              prop="itemUnTaxedAmt"
              width="80" />
            <el-table-column
              :label="$t('item_tax_rate')"
              align="center"
              width="120">
              <template slot-scope="scope">
                <el-form-item
                  v-if="!isView && !isRed"
                  :prop="'supplierInvoiceDetail.' + scope.$index + '.itemTaxRate'"
                  :rules="!isView ? rules['itemTaxRate'] : {}"
                  label-width="0px"
                >
                  <el-select v-model="scope.row.itemTaxRate" :disabled="true" name="scope_row_itemTaxRate" @change="modifyItemTaxRate(scope.row)">
                    <el-option v-for="(v, k) in purchaseTaxRateMap" :label="v" :key="k" :value="k" />
                  </el-select>
                </el-form-item>
                <span v-if="isView || isRed" >{{ purchaseTaxRateMap[scope.row.itemTaxRate] ? purchaseTaxRateMap[scope.row.itemTaxRate] : '0.00%' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('item_tax_amt')"
              prop="itemTaxAmt"
              align="center"
              width="100"/>
            <el-table-column
              :label="$t('item_taxed_amt')"
              align="center"
              width="120">
              <template slot-scope="scope">
                <!-- <el-form-item
                  v-if="!isView && !isRed"
                  :prop="'supplierInvoiceDetail.' + scope.$index + '.itemTaxedAmt'"
                  :rules="!isView ? rules['itemTaxedAmt'] : {}"
                  label-width="0px"
                >
                  <el-input-number v-model="scope.row.itemTaxedAmt" :precision="2" :step="0.1" :min="0.0001" :max="999999999999" :controls="false" name="scope_row_itemTaxedAmt" style="width: 100px;" @change="modifyItemTaxedAmt(scope.row)" />
                </el-form-item> -->
                <!-- <span v-if="isView || isRed" >{{ scope.row.itemTaxedAmt }}</span> -->
                <span>{{ scope.row.itemTaxedAmt }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('receipt_order_code')"
              prop="refOrderCode"
              align="center"
              width="100"/>
            <el-table-column
              :label="$t('chk_order_code')"
              prop="chkOrderCode"
              align="center"
              width="100"/>
          </el-table>
          <el-row align="right">
            <el-col :span="16">
              <el-form-item :label="$t('invoice_total')" />
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <div>{{ $t('item_num') }}:<span>{{ dataForm.itemNum }}</span></div>
                <div>{{ $t('item_un_taxed_amt') }}:<span>{{ dataForm.itemUnTaxedAmt }}</span></div>
                <div>{{ $t('item_tax_amt') }}:<span>{{ dataForm.itemTaxAmt }}</span></div>
                <div>{{ $t('item_taxed_amt') }}:<span>{{ dataForm.itemTaxedAmt }}</span></div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </ody-list-table-area>
      <attachment :editable="!isView" :attachments="attachments" @update:attachments="onUpdateAttachments"/>
      <el-form-item>
        <ody-button v-if="(!isView && dataForm.status == 1) && ((merchantInfo.merchantId == dataForm.merchantId && platform === 1) || platform !== 1)" name="PurchaseInvoiceSave_handleSubmit" code="PurchaseInvoiceSave" size="small" type="primary" @click="handleSubmit">{{ $t('common_save') }}</ody-button>
        <!--  <ody-button v-if="(!isOpen && !isView && dataForm.status == 1) && ((merchantInfo.merchantId == dataForm.merchantId && platform === 1) || platform !== 1)" name="PurchaseInvoiceAudit_showAuditModal" code="PurchaseInvoiceAudit" size="small" type="primary" @click="showAuditModal">{{ $t('common_audit') }}</ody-button>
        <el-button name="handleBack" size="small" @click="handleBack">{{ $t('common_cancel') }}</el-button>-->
      </el-form-item>
    </el-form>
    <AuditModal :visible.sync="auditModalVisible" :id="dataForm.id" @ok="init(true)" />
  </section>
</template>

<script>
import MerchantSelectModal from '@/components/merchantModal'
import StoreSelectModal from '@/components/storeModal'
import AuditModal from '@/components/apSupplierInvoice/auditModal'
import attachment from '@/components/apSupplierInvoice/attachment'

export default {
  name: 'FinanceInvoicePurchaseDetail',
  components: {
    MerchantSelectModal,
    StoreSelectModal,
    AuditModal,
    attachment
  },
  data() {
    return {
      isRed: false, // 是否是红票
      isOpen: false, // 是否是新开
      isView: false, // 是否是查看模式
      auditModalVisible: false,
      dataForm: getDefaultInvoiceDataForm(this),
      showMerchant: true,
      merchantInfo: {},
      invoiceTypeList: [],
      statusList: [],
      openStatusList: [],
      invoiceTypeMap: {},
      invoiceStyleMap: {},
      statusMap: {},
      openStatusMap: {},
      taxTreatmentMap: {},
      invoiceBillingTypeMap: {},
      invoiceDrawerTypeMap: {},
      purchaseTaxRateMap: {},
      selectedItem: null,
      activeState: '0',
      loading: false,
      attachments: [],
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      rules: {
        invoiceTime: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        invoiceType: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        taxTreatment: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        invoiceCode: [
          // { required: true, message: this.$t('required'), trigger: 'change' },
          { validator: this.validateInvoiceCode, trigger: 'blur' }
        ],
        invoiceNo: [
          { required: true, message: this.$t('required'), trigger: 'change' },
          { validator: this.validateInvoiceNo, trigger: 'blur' }
        ],
        validateNo: [
          { validator: this.validateValidateNo, trigger: 'blur' }
        ],
        deduction: [
          { required: true, message: this.$t('required'), trigger: 'blur' }
        ],
        salerTelephone: [
          { validator: this.validatePhone, trigger: 'blur' }
        ],
        purchaserEmail: [
          { validator: this.validateEmail, trigger: 'blur' }
        ],
        purchaserReceiverTel: [
          { validator: this.validatePhone, trigger: 'blur' }
        ],
        purchaserTelephone: [
          { validator: this.validatePhone, trigger: 'blur' }
        ],
        // itemCategoryCode: [
        //   { required: true, message: this.$t('required'), trigger: 'blur' }
        // ],
        // itemName: [
        //   { required: true, message: this.$t('required'), trigger: 'blur' }
        // ],
        // itemSpec: [
        //   { required: true, message: this.$t('required'), trigger: 'blur' }
        // ],
        // itemUnit: [
        //   { required: true, message: this.$t('required'), trigger: 'blur' }
        // ],
        itemNum: [
          { required: true, message: this.$t('required'), trigger: 'blur' }
        ],
        itemTaxedUnitAmt: [
          { required: true, message: this.$t('required'), trigger: 'blur' }
        ],
        itemTaxRate: [
          { required: true, message: this.$t('required'), trigger: 'blur' }
        ],
        itemTaxedAmt: [
          { required: true, message: this.$t('required'), trigger: 'blur' }
        ]
        // ,
        // purchaserTaxCode: [
        //   { required: true, message: this.$t('required'), trigger: 'blur' }
        // ],
        // purchaserName: [
        //   { required: true, message: this.$t('required'), trigger: 'blur' }
        // ],
        // salerTaxCode: [
        //   { required: true, message: this.$t('required'), trigger: 'blur' }
        // ],
        // salerName: [
        //   { required: true, message: this.$t('required'), trigger: 'blur' }
        // ]
      }
    }
  },
  async mounted() {
    try {
      await this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async initMerchantInfo() {
      const vue = this
      const result = await this.$finance.$api.common.queryPlatformAndDefaultMerchant()
      if (result.code === '0') {
        vue.platform = result.data.platformId
        if (vue.platform === 1) {
          if (result.data.defaultMerchant) {
            vue.merchantInfo.merchantId = result.data.defaultMerchant.merchantId
            vue.merchantInfo.merchantCode = result.data.defaultMerchant.merchantCode
          }
        }
      }
    },
    showAuditModal() {
      this.auditModalVisible = true
    },
    onUpdateAttachments(newValue) {
      this.attachments = newValue
    },
    changeTaxTreatment() {
      this.dataForm.deduction = 0
    },
    async loadInvoiceInfo() {
      const vue = this
      const data = await this.$finance.$api.apSupplierInvoice.queryInvoiceWithItem({ id: this.invoiceId })
      if (data.code === '0') {
        if (vue.isOpen) { // 说明是开红票
          vue.proInvoice = data.data
          vue.merchantInfo.merchantName = vue.proInvoice.merchantName
          vue.merchantInfo.merchantId = vue.proInvoice.merchantId
          vue.dataForm.supplierCode = vue.proInvoice.supplierCode
          vue.dataForm.supplierName = vue.proInvoice.supplierName
          vue.dataForm.storeCode = vue.proInvoice.storeCode
          vue.dataForm.storeId = vue.proInvoice.storeId
          vue.dataForm.storeName = vue.proInvoice.storeName
          vue.dataForm.merchantId = vue.proInvoice.merchantId
          vue.dataForm.merchantName = vue.proInvoice.merchantName
          vue.dataForm.merchantCode = vue.proInvoice.merchantCode
          vue.dataForm.invoiceType = vue.proInvoice.invoiceType
          vue.dataForm.salerName = vue.proInvoice.salerName
          vue.dataForm.salerTaxCode = vue.proInvoice.salerTaxCode
          vue.dataForm.salerAddress = vue.proInvoice.salerAddress
          vue.dataForm.salerTelephone = vue.proInvoice.salerTelephone
          vue.dataForm.salerBankName = vue.proInvoice.salerBankName
          vue.dataForm.salerAccountNo = vue.proInvoice.salerAccountNo
          vue.dataForm.salerCertificatePath = vue.proInvoice.salerCertificatePath
          vue.dataForm.salerChecker = vue.proInvoice.salerChecker
          vue.dataForm.salerDrawer = vue.proInvoice.salerDrawer
          vue.dataForm.salerPayee = vue.proInvoice.salerPayee

          vue.dataForm.purchaserName = vue.proInvoice.purchaserName
          vue.dataForm.purchaserTaxCode = vue.proInvoice.purchaserTaxCode
          vue.dataForm.purchaserAddress = vue.proInvoice.purchaserAddress
          vue.dataForm.purchaserTelephone = vue.proInvoice.purchaserTelephone
          vue.dataForm.purchaserBankName = vue.proInvoice.purchaserBankName
          vue.dataForm.purchaserAccountNo = vue.proInvoice.purchaserAccountNo
          vue.dataForm.purchaserCertificatePath = vue.proInvoice.purchaserCertificatePath
          vue.dataForm.purchaserType = vue.proInvoice.purchaserType
          vue.dataForm.purchaserReceiverTel = vue.proInvoice.purchaserReceiverTel
          vue.dataForm.purchaserEmail = vue.proInvoice.purchaserEmail

          vue.dataForm.createSrcType = vue.proInvoice.createSrcType
          vue.dataForm.invoiceStyle = vue.proInvoice.invoiceStyle
          vue.dataForm.customerId = vue.proInvoice.customerId
          vue.dataForm.customerType = vue.proInvoice.customerType
          vue.dataForm.customerCode = vue.proInvoice.customerCode
          vue.dataForm.customerName = vue.proInvoice.customerName
          vue.dataForm.taxTreatment = vue.proInvoice.taxTreatment

          vue.dataForm.settleObjType = vue.proInvoice.settleObjType
          vue.dataForm.settleObjId = vue.proInvoice.settleObjId
          vue.dataForm.settleObjCode = vue.proInvoice.settleObjCode
          vue.dataForm.settleObjName = vue.proInvoice.settleObjName

          if (vue.proInvoice.invoiceStyle + '' === '0') { // 纸质发票
            vue.dataForm.redFlag = 1 // 特殊冲红
          } else {
            vue.dataForm.redFlag = 0 // 正常冲红
          }
          vue.dataForm.invoiceBillingType = 1
          vue.dataForm.proInvoiceId = vue.proInvoice.id
          vue.dataForm.proInvoiceNo = vue.proInvoice.invoiceNo
          vue.dataForm.proInvoiceCode = vue.proInvoice.invoiceCode
        } else {
          vue.dataForm = Object.assign(vue.dataForm, data.data)

          vue.dataForm.invoiceTime = this.$portal.parseTime(vue.dataForm.invoiceTime, '{y}-{m}-{d} {h}:{i}:{s}')
          if (vue.dataForm.status + '' !== '1') { // 不是待审核，只能查看
            vue.isView = true
          }
        }
        vue.dataForm.invoiceType = vue.dataForm.invoiceType + ''
        vue.dataForm.purchaserType = vue.dataForm.purchaserType + '' // 转成字符串，可以使下拉默认选中
        vue.dataForm.invoiceStyle = vue.dataForm.invoiceStyle + '' // 转成字符串，可以使下拉默认选中
        vue.dataForm.taxTreatment = vue.dataForm.taxTreatment + '' // 转成字符串，可以使下拉默认选中

        if (data.data.attachments && data.data.attachments.length > 0 && !vue.isOpen) {
          vue.attachments = []
          data.data.attachments.forEach(function(item) {
            vue.attachments.push({
              name: item.fileName,
              url: item.fileUrl
            })
          })
        }

        vue.dataForm.supplierInvoiceDetail = data.data.supplierInvoiceDetail

        for (let index = 0; index < this.dataForm.supplierInvoiceDetail.length; index++) {
          const item = this.dataForm.supplierInvoiceDetail[index]
          item.maxItemNum = item.itemNum
          if (vue.isOpen) {
            item.id = null
            item.itemNum = null
          }
          item.itemTaxRate = Number(item.itemTaxRate).toFixed(2) + '' // 为了税率能自动选中
        }
      }
    },
    setDefaultInfo() {
      const selectChkSupplierPurchase = this.chkSupplierPurchases[0]
      this.merchantInfo.merchantName = selectChkSupplierPurchase.merchantName
      this.merchantInfo.merchantId = selectChkSupplierPurchase.merchantId
      this.dataForm.merchantId = selectChkSupplierPurchase.merchantId
      this.dataForm.merchantCode = selectChkSupplierPurchase.merchantCode
      this.dataForm.merchantName = selectChkSupplierPurchase.merchantName
      this.dataForm.storeId = selectChkSupplierPurchase.storeId
      this.dataForm.storeCode = selectChkSupplierPurchase.storeCode
      this.dataForm.storeName = selectChkSupplierPurchase.storeName

      this.dataForm.supplierId = selectChkSupplierPurchase.supplierId
      this.dataForm.supplierCode = selectChkSupplierPurchase.supplierCode
      this.dataForm.supplierType = selectChkSupplierPurchase.supplierType
      this.dataForm.supplierName = selectChkSupplierPurchase.supplierName

      // 结算对象类型 结算对象编码 结算对象名称
      this.dataForm.settleObjType = selectChkSupplierPurchase.settleObjType
      this.dataForm.settleObjId = selectChkSupplierPurchase.settleObjId
      this.dataForm.settleObjCode = selectChkSupplierPurchase.settleObjCode
      this.dataForm.settleObjName = selectChkSupplierPurchase.settleObjName
    },
    loadInvoiceConfig() { //  获取发票抬头
      this.loadSaleConfig()
      this.loadPurchanseConifg()
    },
    async loadSaleConfig() { // 获取销售方发票信息
      const settleType = this.dataForm.settleObjType + ''
      if (settleType === '1') { // 如果是总部
        this.loadSettleMerchantConfig()
      } else if (settleType === '2') { // 如果是供应商
        this.loadSupplierInfo()
      }
    },
    async loadSettleMerchantConfig() {
      const storeIsNull = 1
      const params = {
        merchantCode: this.dataForm.settleObjCode,
        storeIsNull: storeIsNull,
        status: 1
      }
      let config = {}
      const result = await this.$finance.$api.invoiceMerchantConfig.queryMerchantConfigWithPage({
        currentPage: 1,
        itemsPerPage: 1,
        obj: params
      })
      if (result.code === '0' && result.data && result.data.listObj && result.data.listObj.length > 0) {
        config = result.data.listObj[0]
      }
      this.dataForm.salerName = config.merchantName
      this.dataForm.salerTaxCode = config.merchantTaxpayerIdentificationCode
      this.dataForm.salerAddress = config.merchantAddress
      this.dataForm.salerTelephone = config.merchantTaxpayerTel
      this.dataForm.salerBankName = config.merchantBankAddress
      this.dataForm.salerAccountNo = config.merchantBankAccount
      // this.dataForm.salerCertificatePath = config.
      this.dataForm.salerChecker = config.merchantChecker
      this.dataForm.salerDrawer = config.merchantDrawer
      this.dataForm.salerPayee = config.merchantPayee
    },
    async loadSupplierInfo() {
      const params = {
        currentPage: 1,
        itemsPerPage: 1,
        obj: {
          supplierCode: this.dataForm.settleObjCode,
          merchantId: this.dataForm.merchantId,
          merchantCode: this.dataForm.merchantCode
        }
      }
      let supplier = {}
      let accountInfo = {}
      const result = await this.$finance.$api.common.querySupplierList(params)
      if (result.code === '0' && result.data) {
        const list = result.data.listObj
        if (list && list.length > 0) {
          supplier = list[0]
          const accountList = supplier.accountInfo
          if (accountList && accountList.length > 0) {
            accountInfo = accountList[0]
          }
        }
      }
      this.dataForm.salerName = supplier.supplierName
      this.dataForm.salerTaxCode = supplier.enterpriseTaxCode
      this.dataForm.salerAddress = supplier.addressDetail
      this.dataForm.salerTelephone = accountInfo.receiverMobile
      this.dataForm.salerBankName = accountInfo.receiverSubBankName ? accountInfo.receiverSubBankName : accountInfo.receiverBankName
      this.dataForm.salerAccountNo = accountInfo.receiverAccountNo
      // this.dataForm.salerCertificatePath = config.
      // this.dataForm.salerChecker = supplier.merchantChecker
      // this.dataForm.salerDrawer = supplier.merchantDrawer
      // this.dataForm.salerPayee = supplier.merchantPayee
    },
    async loadPurchanseConifg() { // 获取购买方发票资质，采购发票，购买方即为商家
      // 客户类型 1经销商 2加盟商 3分销商 4:商家
      // 开票类型： 开票者类型：   1 会员 2 商家 4 经销商  5 分销商 6 加盟商
      const drawerType = 2
      const params = {
        invoiceDrawerCode: this.dataForm.merchantCode,
        drawerType: drawerType
      }
      let config = {}
      const result = await this.$finance.$api.invoiceQualification.queryQualificationList({
        currentPage: 1,
        itemsPerPage: 1,
        obj: params
      })
      if (result.code === '0' && result.data && result.data.listObj && result.data.listObj.length > 0) {
        config = result.data.listObj[0]
      }

      this.dataForm.purchaserType = config.drawerType ? config.drawerType : drawerType
      this.dataForm.purchaserName = config.invoiceDrawerName
      this.dataForm.purchaserTaxCode = config.taxpayerIdentificationCode
      this.dataForm.purchaserAddress = config.registerAddress
      this.dataForm.purchaserTelephone = config.registerPhone
      this.dataForm.purchaserBankName = config.bankDeposit
      this.dataForm.purchaserAccountNo = config.bankAccount
      // this.dataForm.purchaserCertificatePath = config.
      this.dataForm.purchaserReceiverTel = config.invoiceReceiveTel
      this.dataForm.purchaserEmail = config.email
    },
    _initCodes() {
      const vue = this
      this.$finance.$api.common.codeSelectMulti({ 'categories': ['INVOICE_STYLE', 'TAX_TREATMENT', 'INVOICE_BILLING_TYPE', 'INVOICE_DRAWER_TYPE'] }).then((data) => {
        if (data.code === '0') {
          var map = data.data
          if (map.INVOICE_STYLE) {
            vue.invoiceStyleMap = map.INVOICE_STYLE
          }
          if (map.TAX_TREATMENT) {
            vue.taxTreatmentMap = map.TAX_TREATMENT
          }
          if (map.INVOICE_BILLING_TYPE) {
            vue.invoiceBillingTypeMap = map.INVOICE_BILLING_TYPE
          }
          if (map.INVOICE_DRAWER_TYPE) {
            vue.invoiceDrawerTypeMap = map.INVOICE_DRAWER_TYPE
          }
        }
      })

      this.$finance.$api.common.codeSelectDicMulti(JSON.stringify(['ap.invoice.supplier.supInvoiceList.openStatus', 'ap.invoice.supplier.supInvoiceList.invoiceType', 'ap.invoice.supplier.supInvoiceList.status'])).then((result) => {
        if (result.code === '0') {
          if (result.data['ap.invoice.supplier.supInvoiceList.openStatus']) {
            vue.openStatusList = result.data['ap.invoice.supplier.supInvoiceList.openStatus'].reduce((l, i) => {
              l.push({ code: i.id + '', name: i.text })
              return l
            }, [])
            vue.openStatusMap = result.data['ap.invoice.supplier.supInvoiceList.openStatus'].reduce((l, i) => {
              l[i.id] = i.text
              return l
            }, {})
          }
          if (result.data['ap.invoice.supplier.supInvoiceList.invoiceType']) {
            vue.invoiceTypeList = result.data['ap.invoice.supplier.supInvoiceList.invoiceType'].reduce((l, i) => {
              l.push({ code: i.id + '', name: i.text })
              return l
            }, [])
            vue.invoiceTypeMap = result.data['ap.invoice.supplier.supInvoiceList.invoiceType'].reduce((l, i) => {
              l[i.id] = i.text
              return l
            }, {})
          }
          if (result.data['ap.invoice.supplier.supInvoiceList.status']) {
            vue.statusList = result.data['ap.invoice.supplier.supInvoiceList.status'].reduce((l, i) => {
              l.push({ code: i.id + '', name: i.text })
              return l
            }, [])
            vue.statusMap = result.data['ap.invoice.supplier.supInvoiceList.status'].reduce((l, i) => {
              l[i.id] = i.text
              return l
            }, {})
          }
        }
      })

      this.$finance.$api.common.getConfigByKey({ configKey: 'saleTaxRateConfig' }).then(result => {
        if (result.code === '0') {
          vue.purchaseTaxRateMap = JSON.parse(result.data)
        }
      })
    },
    statisticInfo() {
      let totalNum = 0
      let totalUnTaxedAmt = 0
      let totalTaxAmt = 0
      let totalTaxedAmt = 0

      for (let index = 0; index < this.dataForm.supplierInvoiceDetail.length; index++) {
        const item = this.dataForm.supplierInvoiceDetail[index]
        let itemNum = Number(item.itemNum)
        if (isNaN(itemNum)) {
          itemNum = 0
        }
        let itemUnTaxedAmt = Number(item.itemUnTaxedAmt)
        if (isNaN(itemUnTaxedAmt)) {
          itemUnTaxedAmt = 0
        }
        let itemTaxAmt = Number(item.itemTaxAmt)
        if (isNaN(itemTaxAmt)) {
          itemTaxAmt = 0
        }
        let itemTaxedAmt = Number(item.itemTaxedAmt)
        if (isNaN(itemTaxedAmt)) {
          itemTaxedAmt = 0
        }
        totalNum += itemNum
        totalUnTaxedAmt += itemUnTaxedAmt
        totalTaxAmt += itemTaxAmt
        totalTaxedAmt += itemTaxedAmt
      }
      this.dataForm.itemNum = Number(totalNum).toFixed(2)
      this.dataForm.itemUnTaxedAmt = Number(totalUnTaxedAmt).toFixed(2)
      this.dataForm.itemTaxAmt = Number(totalTaxAmt).toFixed(2)
      this.dataForm.itemTaxedAmt = Number(totalTaxedAmt).toFixed(2)
    },
    // 行操作开始
    deleteRow(row) {
      this.dataForm.supplierInvoiceDetail.splice(this.dataForm.supplierInvoiceDetail.indexOf(row), 1)
      this.statisticInfo()
    },
    // 修改含税单价
    modifyItemTaxedUnitAmt(row) {
      let rate = row.itemTaxRate
      if (!rate || isNaN(Number(rate))) {
        rate = 0
      }
      let unitAmt = row.itemTaxedUnitAmt
      if (!unitAmt || isNaN(Number(unitAmt))) {
        unitAmt = 0
      }
      row.itemUnTaxedUnitAmt = Number(unitAmt / (1 + Number(rate))).toFixed(6)

      let num = row.itemNum
      if (!num || isNaN(Number(num))) {
        num = 0
      }
      row.itemTaxedAmt = Number(unitAmt * num).toFixed(2)
      row.itemUnTaxedAmt = Number(row.itemTaxedAmt / (1 + Number(rate))).toFixed(2)

      row.itemTaxAmt = Number(row.itemTaxedAmt - row.itemUnTaxedAmt).toFixed(2)

      this.statisticInfo()
    },
    modifyItemTaxRate(row) { // 修改税率
      let rate = row.itemTaxRate
      if (!rate || isNaN(Number(rate))) {
        rate = 0
      }
      let unitAmt = row.itemTaxedUnitAmt
      if (!unitAmt || isNaN(Number(unitAmt))) {
        unitAmt = 0
      }
      let num = row.itemNum
      if (!num || isNaN(Number(num))) {
        num = 0
      }

      row.itemUnTaxedUnitAmt = Number(unitAmt / (1 + Number(rate))).toFixed(6)
      row.itemTaxedAmt = Number(unitAmt * num).toFixed(2)
      row.itemUnTaxedAmt = Number(row.itemTaxedAmt / (1 + Number(rate))).toFixed(2)

      row.itemTaxAmt = Number(row.itemTaxedAmt - row.itemUnTaxedAmt).toFixed(2)
      this.statisticInfo()
    },
    modifyItemTaxedAmt(row) { // 修改含税金额
      let rate = row.itemTaxRate
      if (!rate || isNaN(Number(rate))) {
        rate = 0
      }
      let itemTaxedAmt = row.itemTaxedAmt
      if (!itemTaxedAmt || isNaN(Number(itemTaxedAmt))) {
        itemTaxedAmt = 0
      }
      row.itemUnTaxedAmt = Number(itemTaxedAmt / (1 + Number(rate))).toFixed(2)
      row.itemTaxAmt = Number(itemTaxedAmt - row.itemUnTaxedAmt).toFixed(2)
      this.statisticInfo()
    },
    modifyItemNum(row) { // 修改数量
      let rate = row.itemTaxRate
      if (!rate || isNaN(Number(rate))) {
        rate = 0
      }
      let unitAmt = row.itemTaxedUnitAmt
      if (!unitAmt || isNaN(Number(unitAmt))) {
        unitAmt = 0
      }

      let num = row.itemNum
      if (!num || isNaN(Number(num))) {
        num = 0
      }
      row.itemTaxedAmt = Number(unitAmt * num).toFixed(2)
      row.itemUnTaxedAmt = Number(row.itemTaxedAmt / (1 + Number(rate))).toFixed(2)

      row.itemTaxAmt = Number(row.itemTaxedAmt - row.itemUnTaxedAmt).toFixed(2)
      this.statisticInfo()
    },
    // 行操作结束

    // 校验方法开始
    validatePhone(rule, value, callback) {
      var pattern = /^((1[345789]\d{9})|((\d{3,4}\-)?\d{7,8}))$/
      if (!value || pattern.test(value)) {
        return callback()
      }
      return callback(new Error(this.$t('invalid_mobile_tip')))
    },
    validateInvoiceCode(rule, value, callback) {
      var pattern = /^\d{12}$/
      if (value === '' || value === null || value === undefined || pattern.test(value)) {
        return callback()
      }
      return callback(new Error(this.$t('invalid_invoice_code')))
    },
    validateInvoiceNo(rule, value, callback) {
      var pattern = /^\d{8}$/
      if (pattern.test(value)) {
        return callback()
      }
      return callback(new Error(this.$t('invalid_invoice_no')))
    },
    validateValidateNo(rule, value, callback) {
      var pattern = /^\d{20}$/
      if (!value || pattern.test(value)) {
        return callback()
      }
      return callback(new Error(this.$t('invalid_validate_no')))
    },
    validateEmail(rule, value, callback) {
      var pattern = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      if (!value || pattern.test(value)) {
        return callback()
      }
      return callback(new Error(this.$t('invalid_email_tip')))
    },
    // 校验方法结束
    handleSubmit() {
      const vue = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!vue.dataForm.supplierInvoiceDetail || vue.dataForm.supplierInvoiceDetail.length === 0) {
            this.$alert(this.$t('invalid_detail_not_empty'), this.$t('prompt'))
            return
          }
          vue.submiting = true

          let promise = vue.$finance.$api.apSupplierInvoice.saveInvoiceNew

          if (!vue.isOpen) {
            promise = vue.$finance.$api.apSupplierInvoice.updateInvoice
          }
          const form = Object.assign({}, vue.dataForm)
          if (form.invoiceTime) {
            const timeStr = form.invoiceTime.replace(/-/g, '/')
            form.invoiceTime = new Date(timeStr)
          } else {
            form.invoiceTime = new Date()
          }

          form.attachments = []
          if (vue.attachments.length > 0) {
            vue.attachments.forEach(function(item) {
              form.attachments.push({
                fileName: item.name,
                fileUrl: item.url
              })
            })
          }

          promise(form).then((res) => {
            if (res.code === '0') {
              if (vue.isOpen) {
                const data = res.data
                if (data.code) {
                  vue.$message({
                    type: 'error',
                    message: data.message
                  })
                  return
                } else {
                  vue.invoiceId = res.data.id
                  vue.invoiceCode = res.data.code
                }
              }
              vue.$message({
                type: 'success',
                message: this.$t('common_success')
              })
              vue.init(true)
            } else {
              vue.$message({
                type: 'error',
                message: res.message
              })
            }
          }).finally(() => {
            vue.submiting = false
          })
        }
      })
    },
    async loadChkSupplierPurchaseItem() {
      const vue = this
      const promise = await this.$finance.$api.chkSupplierPurchase.queryChkSupplierPurchaseDetailListWithoutPage
      for (let i = 0; i < this.chkSupplierPurchases.length; i++) {
        const result = await promise({
          chkOrderCode: this.chkSupplierPurchases[i].chkOrderCode
        })
        if (result.code === '0') {
          const data = result.data
          if (data && data.length > 0) {
            for (let index = 0; index < data.length; index++) {
              const chkItem = Object.assign({}, data[index])
              const row = {
                chkOrderCode: this.chkSupplierPurchases[i].chkOrderCode,
                refOrderCode: this.chkSupplierPurchases[i].refOrderCode,
                itemMpId: chkItem.mpId,
                itemMpCode: chkItem.mpCode,
                itemMpName: chkItem.mpName,
                itemMpSpec: chkItem.mpSpec,
                itemMpMeasureUnit: chkItem.mpMeasureUnit,
                itemThirdMpCode: chkItem.thirdMpCode,
                itemTaxRate: Number(chkItem.costTaxRate).toFixed(2) + '',
                itemUnTaxedUnitAmt: chkItem.costWithoutTaxUnitAmt,
                itemTaxedUnitAmt: chkItem.costWithTaxUnitAmt,
                itemNum: 0.0001, // 需要判断最大能开票数量，默认等于最大开票数量（计算已经开票的）
                maxItemNum: 0.0001
              }
              vue.dataForm.supplierInvoiceDetail.push(row)
              // 计算金额
              vue.modifyItemTaxedUnitAmt(row)
              vue.modifyItemNum(row)
            }
          }
        }
      }
    },
    // 获取最大能修改为的数量
    async loadMaxItemNum() { // 蓝票需要查询 采购对账单
      const form = {
        id: this.dataForm.id,
        invoiceCode: this.dataForm.invoiceCode,
        proInvoiceId: this.dataForm.proInvoiceId,
        proInvoiceCode: this.dataForm.proInvoiceCode,
        createSrcType: this.dataForm.createSrcType,
        invoiceBillingType: this.dataForm.invoiceBillingType
      }
      form.supplierInvoiceDetail = this.dataForm.supplierInvoiceDetail
      const result = await this.$finance.$api.apSupplierInvoice.loadMaxItemNum(form)
      const containList = []
      if (result.code === '0') {
        if (result.data && result.data.length > 0) {
          for (let i = 0; i < result.data.length; i++) {
            const search = result.data[i]
            const row = getDetailFromList(this.dataForm.supplierInvoiceDetail, search)
            if (row) {
              if (search.maxItemNum !== 0) {
                if (this.isOpen) {
                  row.itemNum = search.maxItemNum
                }
                row.maxItemNum = search.maxItemNum
                row.minItemNum = 0.0001

                if (this.isRed) { // 如果是红票，数量应该为负数
                  if (this.isOpen) {
                    row.itemNum = -search.maxItemNum
                  }
                  row.minItemNum = -search.maxItemNum
                  row.maxItemNum = -0.0001
                }
              } else {
                row.maxItemNum = 0
              }
              this.modifyItemNum(row)
              containList.push(row)
            }
          }
        }
      }
      // 获取所有可开票数量为0的明细
      const itemsToRemove = []
      for (let index = 0; index < this.dataForm.supplierInvoiceDetail.length; index++) {
        const item = this.dataForm.supplierInvoiceDetail[index]
        if (item.maxItemNum === 0 || containList.indexOf(item) < 0) {
          itemsToRemove.push(item)
        }
      }
      // 删除部分明细
      for (let ii = 0; ii < itemsToRemove.length; ii++) {
        this.dataForm.supplierInvoiceDetail.splice(this.dataForm.supplierInvoiceDetail.indexOf(itemsToRemove[ii]), 1)
      }

      if (this.dataForm.supplierInvoiceDetail.length === 0) {
        let msgKey = 'finance.invalid_detail_empty'
        if (this.isRed) {
          msgKey = 'finance.invalid_detail_empty_red'
        }

        this.$alert(this.$t(msgKey), this.$t('prompt'), {
          callback: action => {
            this.handleBack()
          }
        })
      }
    },
    handleBack() {
      this.$portal.delActiveView()
    },
    async init(update) {
      this.isOpen = update ? !update : this.$route.query.isOpen
      this.isView = this.$route.query.isView
      this.invoiceId = this.invoiceId ? this.invoiceId : this.$route.query.invoiceId
      this.invoiceCode = this.invoiceCode ? this.invoiceCode : this.$route.query.invoiceCode
      this.chkSupplierPurchases = this.$route.query.chkSupplierPurchases
      if (this.isOpen) { // 开票，如果invoiceCode不为空，说明是开红票，为空是开蓝票
        this.dataForm = Object.assign(this.dataForm, getDefaultInvoiceDataForm(this))
      }

      this._initCodes()
      this.initMerchantInfo()
      if (this.invoiceId) {
        await this.loadInvoiceInfo()
      }
      if (this.chkSupplierPurchases && this.isOpen) { // 开蓝票才需要获取资质信息
        await this.loadChkSupplierPurchaseItem()
        this.setDefaultInfo()
        this.loadInvoiceConfig()
      }
      // 是红票
      this.isRed = this.dataForm.invoiceBillingType + '' === '1'
      if (!this.isView) {
        this.loadMaxItemNum()
      }
      this.statisticInfo()
    }
  }
}
function getDefaultInvoiceDataForm(vue) {
  return Object.assign({}, {
    invoiceBillingType: 0,
    status: 1,
    createSrcType: 2,
    invoiceTime: vue.$portal.parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}'),
    invoiceStyle: '0',
    invoiceType: '1',
    taxTreatment: '0',
    merchantName: null,
    storeName: null,
    settleObjName: null,
    deduction: 0,
    invoiceCode: null,
    invoiceNo: null,
    validateNo: null,
    purchaserTaxCode: null,
    purchaserName: null,
    salerTaxCode: null,
    salerName: null,
    salerAddress: null,
    salerBankName: null,
    salerAccountNo: null,
    salerPayee: null,
    salerChecker: null,
    salerDrawer: null,
    purchaserType: null,
    salerTelephone: null,
    purchaserTelephone: null,
    purchaserReceiverTel: null,
    purchaserEmail: null,
    purchaserAddress: null,
    purchaserBankName: null,
    purchaserAccountNo: null,
    supplierInvoiceDetail: [],
    itemNum: 0,
    itemUnTaxedAmt: 0,
    itemTaxAmt: 0,
    itemTaxedAmt: 0,
    redReason: ''
  })
}
function getDetailFromList(list, search) {
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (item.itemMpCode === search.itemMpCode && item.chkOrderCode === search.chkOrderCode) { // 如果商品编号和对账单号相同，返回该行
      return item
    }
  }
  return null
}
</script>

<style lang="scss" scoped>

</style>
