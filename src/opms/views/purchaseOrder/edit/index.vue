<template>
  <section id="id-id">
    <ody-box>
      <el-tabs v-model="upActiveName" name="upActiveName">
        <el-tab-pane :label="$t('basicInformation')" name="table1">
          <el-form ref="form" :model="data" :rules="rules" label-width="200px" class="form">
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('common_purchase_order_code')">
                  <el-input v-model="data.purchaseCode" name="data_purchaseCode" readonly />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('purchaseDiscountOrder_field_operator')">
                  <el-input v-model="data.createUsername" name="data_createUsername" readonly />
                </el-form-item>
              </el-col>
              <el-col :span="8" :label="$t('buyer')">
                <el-form-item :label="$t('purchaser_field_purchaserName')">
                  <el-input v-model="data.purchaserName" name="data_purchaserName" readonly />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item
                  :label="$t('purchaseOrder_field_sourceType')"
                  :disabled="!isEdit"
                  prop="sourceCodeType"
                  @change="cleanProductInfo"
                >
                  <el-select
                    v-if="typeof(data.sourceCodeType) == 'string'"
                    v-model="data.sourceCodeType"
                    name="data_sourceCodeType"
                  >
                    <el-option
                      v-for="(value, key) in constants.poSourceTypesForCaigoudan"
                      :key="key"
                      :value="'' + key"
                      :label="value"
                    />
                  </el-select>
                  <el-select
                    v-else-if="typeof(data.sourceCodeType) == 'number'"
                    v-model="data.sourceCodeType"
                    name="data_sourceCodeType9"
                  >
                    <el-option
                      v-for="(value, key) in constants.poSourceTypesForCaigoudan"
                      :key="key"
                      :value="('' + key).trim() == '' ? '' : parseInt(key)"
                      :label="value"
                    />
                  </el-select>
                  <el-select v-else v-model="data.sourceCodeType" name="data_sourceCodeType8">
                    <el-option
                      v-for="(value, key) in constants.poSourceTypesForCaigoudan"
                      :key="key"
                      :value="key"
                      :label="value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('creation_date')">
                  <el-date-picker
                    v-model="data.createTime"
                    :placeholder="$t('选择日期')"
                    name="data_createTime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="date"
                    style="width: 100%;"
                    disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('supplie2')" prop="supplierName">
                  <el-input
                    v-model="data.supplierName"
                    :placeholder="$t('common_choose_please')"
                    name="data_supplierName"
                    readonly="true"
                    @click.native="showSupplier"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <!--<el-col :span="8">
                <el-form-item :label="$t('deliveryContact')">
                  <el-input v-model="data.supplierContactName" :disabled="true" name="data_supplierContactName" readonly="true" @click.native="showSupplierContact"/>
                </el-form-item>
              </el-col>-->
              <el-col :span="8">
                <el-form-item :label="$t('purchaseOrder_field_supplierContactName')">
                  <el-input
                    v-model="data.supplierContactName"
                    :disabled="!isEdit"
                    name="data_supplierContactName1"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('common_currency')">
                  <el-input v-model="data.currencyCode" :disabled="true" name="data_currencyCode" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('采购日期')" prop="purchaseDate">
                  <el-date-picker
                    v-model="data.purchaseDate"
                    :placeholder="$t('选择日期')"
                    name="data_purchaseDate"
                    type="date"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('asn_expectDeliveryTime')" prop="expectReceiveDate">
                  <el-date-picker
                    v-model="data.expectReceiveDate"
                    :placeholder="$t('选择日期')"
                    name="data_expectReceiveDate"
                    type="date"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  :label="$t('purchaseOrder_field_purchaseOrg')"
                  prop="receiveMerchantName"
                >
                  <!--<el-input v-model="data.receiveMerchantName" :placeholder="$t('common_choose_please')" name="data_receiveMerchantName" readonly="true" @click.native="showMerchant"/>-->
                  <el-input
                    v-model="data.receiveMerchantName"
                    name="data_receiveMerchantName3"
                    disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('purchaseOrder_field_purchaseOrgStore')">
                  <el-input
                    v-model="data.receiveStoreName"
                    :placeholder="$t('common_choose_please')"
                    name="data_receiveStoreName"
                    readonly="true"
                    @click.native="showStore"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('收货仓库')">
                  <el-input
                    v-model="data.receiveWarehouseName"
                    :placeholder="$t('common_choose_please')"
                    name="data_receiveWarehouseName"
                    readonly="true"
                    @click.native="showWarehouse"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('purchaseOrder_field_receiveMethod')" prop="receiveMethod">
                  <el-select v-model="data.receiveMethod" name="data_receiveMethod">
                    <el-option :label="'接收-检验-入库'" :value="3" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('distributionMethod')" prop="distributionMode">
                  <el-select v-model="data.distributionMode" name="data_distributionMode">
                    <el-option
                      v-for="obj in distributionModeList"
                      :key="obj.code"
                      :value="obj.code"
                      :label="obj.name"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('common_status')">
                  <el-select v-model="data.orderStatus" :disabled="true" name="data_orderStatus">
                    <el-option
                      v-for="i in [1,2,3,4,5,6,7]"
                      :key="i"
                      :value="i"
                      :label="constants.poStatuses[i]"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('purchaseOrder_field_purchaseStatus')">
                  <el-select
                    v-model="data.purchaseStatus"
                    :disabled="true"
                    name="data_purchaseStatus"
                  >
                    <el-option
                      v-for="(value, key) in constants.poPerformStatuses"
                      :key="key"
                      :value="key"
                      :label="value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('common_remark')">
                  <el-input v-model="data.remark" :disabled="!isEdit" name="data_remark" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('asn_receiveAddress')">
                  <el-select
                    v-model="data.receiveAddressProvinceId"
                    :disabled="!isEdit"
                    name="data_receiveAddressProvinceId"
                    @change="regAddressChangeProvince(data.receiveAddressProvinceId)"
                  >
                    <el-option
                      v-for="(obj) in enterpriseProvinceList"
                      :key="obj.code"
                      :value="obj.code"
                      :label="obj.name"
                    />
                  </el-select>
                  <el-select
                    v-model="data.receiveAddressCityId"
                    :disabled="!isEdit"
                    name="data_receiveAddressCityId"
                    @change="regAddressChangeCity(data.receiveAddressCityId)"
                  >
                    <el-option
                      v-for="(obj) in enterpriseCityList"
                      :key="obj.code"
                      :value="obj.code"
                      :label="obj.name"
                    />
                  </el-select>
                  <el-select
                    v-model="data.receiveAddressRegionId"
                    :disabled="!isEdit"
                    name="data_receiveAddressRegionId"
                    @change="regAddressChangeRegion(data.receiveAddressRegionId)"
                  >
                    <el-option
                      v-for="(obj) in enterpriseRegionList"
                      :key="obj.code"
                      :value="obj.code"
                      :label="obj.name"
                    />
                  </el-select>
                  <el-input
                    v-model="data.receiveAddress"
                    :disabled="!isEdit"
                    :placeholder="$t('请输入收货地址')"
                    name="data_receiveAddress"
                    maxlength="100"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('purchaseOrder_field_deliveryAddress')">
                  <el-select
                    v-model="data.deliveryAddressProvinceId"
                    :disabled="!isEdit"
                    name="data_deliveryAddressProvinceId"
                    @change="changeProvince(data.deliveryAddressProvinceId)"
                  >
                    <el-option
                      v-for="(obj) in provinceList"
                      :key="obj.code"
                      :value="obj.code"
                      :label="obj.name"
                    />
                  </el-select>
                  <el-select
                    v-model="data.deliveryAddressCityId"
                    :disabled="!isEdit"
                    name="data_deliveryAddressCityId"
                    @change="changeCity(data.deliveryAddressCityId)"
                  >
                    <el-option
                      v-for="(obj) in cityList"
                      :key="obj.code"
                      :value="obj.code"
                      :label="obj.name"
                    />
                  </el-select>
                  <el-select
                    v-model="data.deliveryAddressRegionId"
                    :disabled="!isEdit"
                    name="data_deliveryAddressRegionId"
                    @change="changeRegion(data.deliveryAddressRegionId)"
                  >
                    <el-option
                      v-for="(obj) in regionList"
                      :key="obj.code"
                      :value="obj.code"
                      :label="obj.name"
                    />
                  </el-select>
                  <el-input
                    v-model="data.deliveryAddress"
                    :disabled="!isEdit"
                    :placeholder="$t('请输入发货地址')"
                    name="data_deliveryAddress"
                    maxlength="100"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('common_attachment')">
                  <ody-upload-attach
                    v-if="data.purchaseCode&&$portal.hasPermission('OpmsPurchaseOrderList26')"
                    v-model="value"
                    :object-type="1"
                    :object-code="data.purchaseCode"
                    name="value"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </ody-box>
    <ody-box>
      <el-tabs v-model="downActiveName" name="downActiveName" @tab-click="handleClick">
        <el-tab-pane :label="$t('purchaseOrder_tab_product')" name="product">
          <ody-list-table-area>
            <div v-if="isEdit" slot="btn">
              <ody-button
                v-if="!data.orderStatus || data.orderStatus == constants.poStatuses.toBeSubmitted"
                v-show="data.sourceCodeType != 8"
                name="OpmsPurchaseOrderList14_showProductSelectModal"
                size="mini"
                type="primary"
                code="OpmsPurchaseOrderList14"
                @click="showProductSelectModal"
              >{{ $t('common_contractProduct_add') }}</ody-button>
              <ody-button
                v-if="!data.orderStatus || data.orderStatus == constants.poStatuses.toBeSubmitted"
                v-show="data.sourceCodeType == 8"
                name="OpmsPurchaseOrderList15_showCaigou"
                size="mini"
                type="primary"
                code="OpmsPurchaseOrderList15"
                @click="showCaigou"
              >{{ $t('referenceToPurchasingPlan') }}</ody-button>
              <ody-button
                v-if="!data.orderStatus || data.orderStatus == constants.poStatuses.toBeSubmitted"
                name="OpmsPurchaseOrderList16_deleteProduct"
                size="mini"
                type="primary"
                code="OpmsPurchaseOrderList16"
                @click="deleteProduct"
              >{{ $t('delet1') }}</ody-button>
              <ody-button
                v-if="!data.orderStatus || data.orderStatus == constants.poStatuses.toBeSubmitted"
                v-show="data.sourceCodeType != 8"
                name="OpmsPurchaseOrderList17_importProduct"
                size="mini"
                type="primary"
                code="OpmsPurchaseOrderList17"
                @click="importProduct"
              >{{ $t('common_contractProduct_import') }}</ody-button>
              <ody-button
                v-if="!data.orderStatus || data.orderStatus == constants.poStatuses.toBeSubmitted"
                v-show="data.sourceCodeType != 8"
                name="OpmsPurchaseOrderList18_downloadTemplate"
                size="mini"
                type="primary"
                code="OpmsPurchaseOrderList18"
                @click="downloadTemplate"
              >{{ $t('common_download_template') }}</ody-button>
            </div>
            <div slot="table">
              <el-form ref="tableData">
                <el-table
                  :data="data.productList"
                  name="data_productList246"
                  style="width: 100%"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column v-if="isEdit" type="selection" width="55" />
                  <el-table-column
                    :label="$t('commodity_name')"
                    align="center"
                    min-width="120"
                    prop="mpName"
                  />
                  <el-table-column
                    :label="$t('commodity_coding')"
                    align="center"
                    min-width="160"
                    prop="mpCode"
                  />
                  <el-table-column
                    :label="$t('commodity_specification')"
                    align="center"
                    prop="mpSpec"
                  />
                  <el-table-column
                    :label="$t('barcode')"
                    align="center"
                    min-width="150"
                    prop="mpBarcode"
                  />
                  <el-table-column :label="$t('category')" align="center" prop="categoryName" />
                  <el-table-column
                    :label="$t('distributionOrder_mpBrand')"
                    align="center"
                    prop="mpBrandName"
                  />
                  <el-table-column
                    :label="$t('common_mp_brand_mainUnit')"
                    align="center"
                    min-width="100"
                    prop="mpMeasureUnit"
                  />
                  <el-table-column
                    :label="$t('采购数量')"
                    align="center"
                    min-width="100"
                    label-class-name="required-star"
                    prop="purchaseCount"
                  >
                    <template slot-scope="scope">
                      <el-form-item v-if="isEdit && data.sourceCodeType != 8">
                        <el-input
                          v-model="scope.row.purchaseCount"
                          name="scope_row_purchaseCount"
                          type="number"
                          maxlength="8"
                        />
                      </el-form-item>
                      <span v-if="!isEdit || data.sourceCodeType == 8">{{ scope.row.purchaseCount }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column
                    v-show="curreyConfig.status == 1"
                    :label="$t('common_currency')"
                    align="center"
                    min-width="120"
                    prop="currencyCode"
                  />

                  <el-table-column
                    :label="$t('taxRat1')"
                    align="center"
                    min-width="120"
                    prop="costTaxRate"
                    label-class-name="required-star"
                  >
                    <template slot-scope="scope">
                      <el-form-item v-if="isEdit && data.sourceCodeType != 8">
                        <el-select
                          v-if="typeof(scope.row.costTaxRate) == 'string'"
                          v-model="scope.row.costTaxRate"
                          name="scope_row_costTaxRate"
                        >
                          <el-option
                            v-for="(k,v) in costTaxRateList"
                            :label="k"
                            :key="v"
                            :value="'' + v"
                          />
                        </el-select>
                        <el-select
                          v-else-if="typeof(scope.row.costTaxRate) == 'number'"
                          v-model="scope.row.costTaxRate"
                          name="scope_row_costTaxRate8"
                        >
                          <el-option
                            v-for="(k,v) in costTaxRateList"
                            :label="k"
                            :key="v"
                            :value="(('' + v).trim() == '') ? '' : parseFloat(v)"
                          />
                        </el-select>
                        <el-select
                          v-else
                          v-model="scope.row.costTaxRate"
                          name="scope_row_costTaxRate1"
                        >
                          <el-option
                            v-for="(k,v) in costTaxRateList"
                            :label="k"
                            :key="v"
                            :value="v"
                          />
                        </el-select>
                      </el-form-item>
                      <span v-if="!isEdit || data.sourceCodeType == 8">{{ scope.row.costTaxRate * 100 + '%' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('asn_purchasePriceWithTax')"
                    align="center"
                    min-width="120"
                    prop="costWithTaxUnitAmt"
                    label-class-name="required-star"
                  >
                    <template slot-scope="scope">
                      <el-form-item v-if="isEdit && data.sourceCodeType != 8">
                        <el-input
                          v-model="scope.row.costWithTaxUnitAmt"
                          name="scope_row_costWithTaxUnitAmt"
                          type="number"
                          maxlength="8"
                        />
                      </el-form-item>
                      <span v-if="!isEdit || data.sourceCodeType == 8">{{ scope.row.costWithTaxUnitAmt }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('asn_purchasePriceWithoutTax')"
                    align="center"
                    min-width="120"
                    prop="costWithoutTaxUnitAmt"
                  />
                  <el-table-column
                    :label="$t('taxableAmount')"
                    align="center"
                    min-width="100"
                    prop="costWithTaxAmt"
                  />
                  <el-table-column
                    :label="$t('untaxedAmount')"
                    align="center"
                    min-width="100"
                    prop="costWithoutTaxAmt"
                  />

                  <el-table-column
                    v-if="curreyConfig.status == 1"
                    :label="$t('common_costWithoutTaxBcUnitAmt')"
                    align="center"
                    min-width="120"
                    prop="costWithoutTaxBcUnitAmt"
                  />
                  <el-table-column
                    v-if="curreyConfig.status == 1"
                    :label="$t('common_costWithTaxBcUnitAmt')"
                    align="center"
                    min-width="120"
                    prop="costWithTaxBcUnitAmt"
                  />
                  <el-table-column
                    v-if="curreyConfig.status == 1"
                    :label="$t('common_costWithTaxBcAmt')"
                    align="center"
                    min-width="120"
                    prop="costWithTaxBcAmt"
                  />
                  <el-table-column
                    v-if="curreyConfig.status == 1"
                    :label="$t('common_costTaxBcAmt')"
                    align="center"
                    min-width="100"
                    prop="costTaxBcAmt"
                  />
                  <el-table-column
                    v-if="curreyConfig.status == 1"
                    :label="$t('common_costWithoutTaxBcAmt')"
                    align="center"
                    min-width="120"
                    prop="costWithoutTaxBcAmt"
                  />

                  <el-table-column
                    :label="$t('asn_agreedDeliveryDate')"
                    align="center"
                    min-width="160"
                    prop="expectReceiveDate"
                  >
                    <template slot-scope="scope">
                      <el-form-item v-if="isEdit">
                        <el-date-picker
                          v-model="scope.row.expectReceiveDate"
                          name="scope_row_expectReceiveDate"
                          format="yyyy-MM-dd"
                          type="date"
                          style="width:150px"
                        />
                      </el-form-item>
                      <span v-if="!isEdit">{{ scope.row.expectReceiveDate }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('purchaseOrder_product_receiveStore')"
                    align="center"
                    min-width="120"
                    prop="receiveStoreName"
                  />
                  <el-table-column
                    :label="$t('purchaseOrder_field_receiveMethod')"
                    align="center"
                    min-width="150"
                    prop="receiveMethod"
                  >
                    <template slot-scope="scope">
                      <el-form-item v-if="isEdit">
                        <el-select
                          v-if="typeof(scope.row.receiveMethod) == 'string'"
                          v-model="scope.row.receiveMethod"
                          name="scope_row_receiveMethod"
                        >
                          <el-option
                            v-for="(k,v) in constants.poReceiveMethods"
                            :label="k"
                            :key="v"
                            :value="'' + v"
                          />
                        </el-select>
                        <el-select
                          v-else-if="typeof(scope.row.receiveMethod) == 'number'"
                          v-model="scope.row.receiveMethod"
                          name="scope_row_receiveMethod8"
                        >
                          <el-option
                            v-for="(k,v) in constants.poReceiveMethods"
                            :label="k"
                            :key="v"
                            :value="(('' + v).trim() == '') ? '' : parseInt(v)"
                          />
                        </el-select>
                        <el-select
                          v-else
                          v-model="scope.row.receiveMethod"
                          name="scope_row_receiveMethod3"
                        >
                          <el-option
                            v-for="(k,v) in constants.poReceiveMethods"
                            :label="k"
                            :key="v"
                            :value="v"
                          />
                        </el-select>
                      </el-form-item>
                      <span v-if="!isEdit">{{ constants.poReceiveMethods[scope.row.receiveMethod] }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('common_remark')"
                    align="center"
                    min-width="120"
                    prop="remark"
                  >
                    <template slot-scope="scope">
                      <el-form-item v-if="isEdit">
                        <el-input v-model="scope.row.remark" name="scope_row_remark" />
                      </el-form-item>
                      <span v-if="!isEdit">{{ scope.row.remark }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('contractProduct_field_minOrderQuantity')"
                    align="center"
                    prop="minOrderQuantity"
                  />

                  <el-table-column
                    :label="$t('distributionOrder_sourceCode')"
                    align="center"
                    min-width="120"
                    prop="requestCode"
                  />
                  <!--<el-table-column
                    :label="$t('distributionOrder_sourceCode')"
                    align="center"
                  prop="sourceCode"/>-->
                  <el-table-column
                    :label="$t('contractProduct_field_contractType')"
                    align="center"
                    prop="contractType"
                  >
                    <template slot-scope="scope">
                      <span>{{ constants.contractTypeText[scope.row.contractType] }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('contractProduct_field_contractCode')"
                    align="center"
                    min-width="165"
                    prop="contractCode"
                  />
                  <el-table-column
                    :label="$t('purchaseReturnOrder_product_contractProperty')"
                    align="center"
                    min-width="100"
                    prop="contractPropertyText"
                  />
                </el-table>
              </el-form>
            </div>
            <div slot="table">
              <div class="total_div">
                <!-- 合计品项数 -->
                <span>{{ $t('purchaseDiscountOrder_product_total_productCount') }}：{{ total.productCount }}</span>
                <!-- 合计含税金额 -->
                <span>{{ $t('purchaseDiscountOrder_product_total_discountWithTaxAmt') }}：{{ total.costWithTaxAmt }}</span>
                <!-- 合计未税金额 -->
                <span>{{ $t('purchaseDiscountOrder_product_total_discountWithoutTaxAmt') }}：{{ total.costWithoutTaxAmt }}</span>
              </div>
            </div>
          </ody-list-table-area>
        </el-tab-pane>
        <el-tab-pane :label="$t('common_operationLog')" name="log">
          <ody--list-table-area>
            <div slot="table">
              <ody-table
                :data="logs"
                :columns="logColumns"
                :can-filter="false"
                :multiple="false"
                name="logs248"
              />
            </div>
            <div slot="page">
              <div class="block">
                <ody-pagination
                  :current-page.sync="logPage.current"
                  :list="logs"
                  :page-sizes="[10, 20, 30, 50]"
                  :page-size.sync="logPage.size"
                  :total.sync="logPage.total"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleLogPageSizeChange"
                  @current-change="handleLogPageCurrentChange"
                />
              </div>
            </div>
          </ody--list-table-area>
        </el-tab-pane>
      </el-tabs>
    </ody-box>
    <ody-dialog
      :visible.sync="showPurchaseStatus"
      :before-close="handleStatusClose"
      :title="$t('purchaseOrder_action_setPerformStatus')"
      width="200"
    >
      <el-card align="center" shadow="never">
        <span>{{ $t('contract_isPause') }}：</span>
        <el-select
          v-model="data.purchaseStatus"
          name="data_purchaseStatus3"
          style="margin-left: 20px;"
        >
          <el-option
            v-for="(value, key) in constants.poPerformStatuses"
            :key="key"
            :value="key"
            :label="value"
          />
        </el-select>
        <ody-button
          name="OpmsPurchaseOrderList13_doSetPurchaseStatus"
          size="mini"
          type="primary"
          style="margin-left: 30px;"
          code="OpmsPurchaseOrderList12"
          @click="doSetPurchaseStatus"
        >{{ $t('determine') }}</ody-button>
      </el-card>
    </ody-dialog>
    <MerchantSelectModal :visible.sync="showMerchantModal" @ok="selectMerchant" />
    <StoreModal
      :visible.sync="showStoreModal"
      :merchant-readonly="true"
      :merchant-code.sync="data.receiveMerchantCode"
      @ok="selectStore"
    />
    <SupplierModal :visible.sync="showSupplierModal" @ok="selectSupplier" />
    <WarehouseModal
      :visible.sync="showWarehouseModal"
      :merchant-id.sync="data.receiveMerchantId"
      multi-select="false"
      @ok="selectWarehouse"
    />
    <ProductSelectModal
      :visible.sync="showProductModal"
      :supplier-code.sync="data.supplierCode"
      @ok="selectProduct"
    />
    <PurchasePlanModal :visible.sync="showPurchasePlanModal" :supplier-code="data.supplierCode" :supplier-name="data.supplierName" @ok="confirmJihua" />
    <ody-fixed>
      <ody-button
        v-if="!data.orderStatus || data.orderStatus == constants.poStatuses.toBeSubmitted"
        name="OpmsPurchaseOrderList14_save"
        size="mini"
        type="primary"
        code="OpmsPurchaseOrderList13"
        @click="save"
      >{{ $t('保存') }}</ody-button>
      <ody-button
        v-if="data.orderStatus == constants.poStatuses.toBeSubmitted || data.orderStatus == constants.poStatuses.rejected"
        name="OpmsPurchaseOrderList07_submit"
        size="mini"
        type="primary"
        code="OpmsPurchaseOrderList07"
        @click="submit"
      >{{ $t('common_submit') }}</ody-button>
      <ody-button
        v-if="(data.orderStatus == constants.poStatuses.toBeSubmitted || data.orderStatus == constants.poStatuses.rejected) && data.id != null"
        name="OpmsPurchaseOrderList08_cancel"
        size="mini"
        type="primary"
        code="OpmsPurchaseOrderList08"
        @click="cancel"
      >{{ $t('cancel') }}</ody-button>
      <ody-button
        v-if="data.orderStatus == constants.poStatuses.toBeAudited && !$portal.enableAppdflow('purchase_order', data.receiveMerchantId)"
        name="OpmsPurchaseOrderList09_approve"
        size="mini"
        type="primary"
        code="OpmsPurchaseOrderList09"
        @click="approve"
      >{{ $t('branchStatue_2') }}</ody-button>
      <ody-button
        v-if="data.orderStatus == constants.poStatuses.toBeAudited && !$portal.enableAppdflow('purchase_order', data.receiveMerchantId)"
        name="OpmsPurchaseOrderList10_reject"
        size="mini"
        type="primary"
        code="OpmsPurchaseOrderList10"
        @click="reject"
      >{{ $t('contractProductPriceAdjust_noPass') }}</ody-button>
      <ody-button
        v-if="data.orderStatus == constants.poStatuses.passed"
        name="OpmsPurchaseOrderList12_setPerformStatus"
        size="mini"
        type="primary"
        code="OpmsPurchaseOrderList12"
        @click="setPerformStatus"
      >{{ $t('purchaseOrder_action_setPerformStatus') }}</ody-button>

      <ody-button
        v-if="data.id != null"
        name="print"
        size="mini"
        type="primary"
        code="OpmsPurchaseOrderList27"
        @click="print"
      >{{ $t('common_print') }}</ody-button>
      <el-button
        name="returnBack"
        size="mini"
        type="primary"
        @click="returnBack"
      >{{ $t('common_return') }}</el-button>
    </ody-fixed>
  </section>
</template>

<script>
import MerchantSelectModal from '@/components/merchantModal'
import StoreModal from '@/components/storeModal'
import SupplierModal from '@/components/supplierModal'
import WarehouseModal from '@/components/warehouseModal'
import ProductSelectModal from '@/components/purchase/order/productSelectModal'
import PurchasePlanModal from '@/components/purchase/order/purchasePlanModal'
import { mapGetters } from 'vuex'
var vue
export default {
  name: 'OpmsPurchaseOrderEdit',
  components: {
    MerchantSelectModal,
    StoreModal,
    SupplierModal,
    WarehouseModal,
    ProductSelectModal,
    PurchasePlanModal
  },
  data() {
    return {
      isEdit: true,
      canUpload: true,
      showProductModal: false,
      showPurchasePlanModal: false,
      showMerchantModal: false,
      showStoreModal: false,
      showSupplierModal: false,
      showWarehouseModal: false,
      showPurchaseStatus: false,
      showSupplierContactModal: false,
      upActiveName: 'table1',
      downActiveName: 'product',
      data: {},
      rules: {
        sourceCodeType: [{ required: true, message: '请选择来源类型' }],
        supplierName: [{ required: true, message: '请选择供应商' }],
        purchaseDate: [
          { required: true, message: '请选择采购日期', trigger: 'blur' }
        ],
        expectReceiveDate: [
          { required: true, message: '请选择预计到货日期', trigger: 'blur' }
        ],
        receiveMethod: [
          { required: true, message: '请选择收货方式', trigger: 'blur' }
        ],
        distributionMode: [
          { required: true, message: '请选择配送方式', trigger: 'blur' }
        ]
      },
      total: {
        productCount: 0,
        costWithTaxAmt: 0,
        costWithoutTaxAmt: 0
      },
      checked: [],
      portData: [],
      attachments: [],
      tradeMethodData: [],
      distributionModeList: [],
      enterpriseProvinceList: [],
      enterpriseCityList: [],
      enterpriseRegionList: [],
      provinceList: [],
      cityList: [],
      regionList: [],
      curreyConfig: {},
      costTaxRateList: {},
      constants: {
        poSourceTypesForCaigoudan: {
          1: this.$t('manual_entry'),
          7: '要货补货'
          // 8: '采购计划'
        },
        contractTypeText: {
          1: this.$t('contract_jxContract'),
          2: this.$t('contract_dxContract'),
          3: this.$t('contract_lyContract'),
          4: this.$t('contract_zlContract')
        },
        poPerformStatuses: {
          1: this.$t('purchaseInfo_performStatus_0'),
          2: this.$t('partial_performance'),
          3: this.$t('complete_performance')
        },
        poStatuses: {
          1: this.$t('branchStatue_0'),
          2: this.$t('branchStatue_1'),
          3: this.$t('audited'),
          4: this.$t('audit_rejection'),
          5: this.$t('case_closed'),
          6: this.$t('common_status_expired'),
          7: this.$t('purchaseInfo_pmsStatus_7'),
          toBeSubmitted: 1,
          toBeAudited: 2,
          passed: 3,
          rejected: 4,
          finished: 5,
          expired: 6,
          cancelled: 7
        },
        poReceiveMethods: {
          3: this.$t('purchaseOrder_receiveMethod_receiveVerifyCheckIn')
        }
      },
      dealList: {
        exw: this.$t('receiveOrder_deal_exw'),
        fca: this.$t('receiveOrder_deal_fca'),
        fas: this.$t('receiveOrder_deal_fas'),
        fob: this.$t('receiveOrder_deal_fob'),
        cfr: this.$t('receiveOrder_deal_cfr'),
        cif: this.$t('receiveOrder_deal_cif'),
        cpt: this.$t('receiveOrder_deal_cpt'),
        cip: this.$t('receiveOrder_deal_cip'),
        daf: this.$t('receiveOrder_deal_daf'),
        des: this.$t('receiveOrder_deal_des'),
        dep: this.$t('receiveOrder_deal_deq'),
        ddu: this.$t('receiveOrder_deal_ddu'),
        ddp: this.$t('receiveOrder_deal_ddp')
      },
      distributionChannelList: {
        HY: this.$t('receiveOrder_transport_HY'),
        DSLY: this.$t('receiveOrder_transport_DSLY'),
        KY: this.$t('receiveOrder_transport_KY'),
        GL: this.$t('receiveOrder_transport_GL'),
        TL: this.$t('receiveOrder_transport_TL'),
        NH: this.$t('receiveOrder_transport_NH'),
        ZD: this.$t('receiveOrder_transport_ZD')
      },
      tradeList: {
        general: this.$t('receiveOrder_trade_general'),
        free: this.$t('receiveOrder_trade_free'),
        donated: this.$t('receiveOrder_trade_donated'),
        compesation: this.$t('receiveOrder_trade_compesation'),
        processing: this.$t('receiveOrder_trade_processing'),
        incoming: this.$t('receiveOrder_trade_incoming')
      },
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
      logPage: {
        size: 10,
        current: 1,
        total: 0
      },
      uploadUrl: 'opms-web/fileController/uploadFile.do'
    }
  },
  computed: {
    ...mapGetters(['data', 'data.productList'])
  },
  watch: {
    'data.supplierCode': function(newVal, oldVal) {
      if (this.data.productList && this.data.productList.length > 0) {
        this.data.productList = []
      }
    },
    'data.productList': {
      handler: function(newValue, oldValue) {
        var costWithTaxAmt = 0
        var costWithoutTaxAmt = 0
        var productCount = 0
        newValue.forEach(function(item) {
          item['costWithoutTaxUnitAmt'] = vue.getNumForBasePrecision(
            item.costWithTaxUnitAmt / (1 + Number(item.costTaxRate))
          )
          productCount++
          if (item.purchaseCount != null && item.purchaseCount !== '') {
            item['costWithTaxAmt'] = vue.getNumForBasePrecision(
              item['costWithTaxUnitAmt'] * item.purchaseCount
            )
            item['costWithoutTaxAmt'] = vue.getNumForBasePrecision(
              item['costWithoutTaxUnitAmt'] * item.purchaseCount
            )
            costWithTaxAmt += Number(item.costWithTaxAmt)
            costWithoutTaxAmt += Number(item.costWithoutTaxAmt)
          }
        })
        vue.total.productCount = productCount
        vue.total.costWithTaxAmt = costWithTaxAmt.toFixed(2)
        vue.total.costWithoutTaxAmt = costWithoutTaxAmt.toFixed(2)
      },
      deep: true
    }
  },
  mounted() {
    vue = this
    this.init()
    // 获取所有港口
    this.$opms.$api.common.getPortList({ portCode: null }).then(result => {
      this.portData = result.data
    })
    // 获取所有港口信息
    this.$opms.$api.purchaseOrder
      .queryTradeDictionary({ tradeMethodCode: null })
      .then(result => {
        this.tradeMethodData = result.data
      })
  },
  methods: {
    async init() {
      // this.isEdit = this.$route.params.edit
      const purchaseCode = this.$route.query.purchaseCode
      if (purchaseCode) {
        // 查询
        // console.info(purchaseCode)
        this.$opms.$api.purchaseOrder
          .selectPODetail(JSON.stringify(purchaseCode))
          .then(result => {
            if (result && result.code === '0') {
              this.onDataLoaded(result.data)
              this.queryList()
            }
          })
      } else {
        // 初始化
        this.$opms.$api.purchaseOrder.getNewPO().then(result => {
          this.onDataLoaded(result.data)
        })
      }
    },
    updateLog() {
      try {
        findOplogPage(this)
      } catch (ex) {
        console.log(ex)
      }
    },
    showMerchant() {
      this.showMerchantModal = true
    },
    showStore() {
      if (!this.data.receiveMerchantId) {
        this.$message(this.$t('please_choose_the_supplier_first'))
        return
      }
      this.showStoreModal = true
    },
    showSupplier() {
      this.showSupplierModal = true
    },
    showSupplierContact() {
      if (!this.data.supplierCode) {
        // this.$message(this.$t('please_choose_the_supplier_first'))
        return
      }
      this.showSupplierContactModal = true
    },
    showWarehouse() {
      if (!this.data.receiveMerchantId) {
        this.$message(this.$t('please_choose_the_supplier_first'))
        return
      }
      this.showWarehouseModal = true
    },
    showProductSelectModal() {
      if (!this.data.supplierCode) {
        this.$message(this.$t('please_choose_the_supplier_first'))
        return
      }
      this.showProductModal = true
    },
    selectMerchant(result) {
      if (result) {
        // vue.$confirm('变更收货商家将会清空商品明细，确定变更？', '确认提示', {
        //   confirmButtonText: this.$t('确定'),
        //   cancelButtonText: this.$t('取消'),
        //   type: 'warning'
        // }).then(() => {
        //   this.data.productList = []
        // })
        vue.data.receiveMerchantId = result.merchantId
        vue.data.receiveMerchantCode = result.merchantCode
        vue.data.receiveMerchantName = result.merchantName
        // vue.data.receiveStoreId = null
        // vue.data.receiveStoreCode = null
        // vue.data.receiveStoreName = null
        // vue.data.warehouseId = null
        // vue.data.warehouseCode = null
        // vue.data.warehouseName = null
      }
    },
    selectStore(selected) {
      if (selected) {
        if (
          selected.storeCode !== this.data.receiveStoreCode &&
          this.data.productList.length > 0
        ) {
          vue
            .$confirm('变更收货店铺将会清空商品明细，确定变更？', '确认提示', {
              confirmButtonText: this.$t('确定'),
              cancelButtonText: this.$t('取消'),
              type: 'warning'
            })
            .then(() => {
              this.data.receiveStoreId = selected.storeId
              this.data.receiveStoreCode = selected.storeCode
              this.data.receiveStoreName = selected.storeName
              vue.data.productList = []
            })
        } else {
          this.data.receiveStoreId = selected.storeId
          this.data.receiveStoreCode = selected.storeCode
          this.data.receiveStoreName = selected.storeName
        }
      }
    },
    selectSupplier(result) {
      if (result) {
        this.data.supplierCode = result.orgCode
        this.data.supplierName = result.orgName
        this.data.currencyCode = result.currencyCode
        this.data.supplierType = result.isInnerMerchant

        this.data.receiveMerchantId = result.merchantId
        this.data.receiveMerchantCode = result.merchantCode
        this.data.receiveMerchantName = result.merchantName

        this.data.supplierContactName = result.contactName
        this.data.supplierMobile = result.contactMobileNo
        // 带回联系人省市区
        this.data.deliveryAddressProvinceId = result.contactProvinceCode
        this.data.deliveryAddressCityId = result.contactCityCode
        this.data.deliveryAddressRegionId = result.contactRegionCode

        this.data.deliveryAddressProvince = result.contactProvinceName
        this.data.deliveryAddressCity = result.contactCityName
        this.data.deliveryAddressRegion = result.contactRegionName
        this.data.deliveryAddress = result.contactDetailAddress
        if (result.contactProvinceCode) {
          vue.$opms.$api.common
            .queryAreaByParentCode(result.contactProvinceCode)
            .then(result => {
              vue.cityList = result.data
              if (result.cityId) {
                vue.$opms.$api.common
                  .queryAreaByParentCode(result.contactCityCode)
                  .then(result => {
                    vue.regionList = result.data
                  })
              }
            })
        }
      }
    },
    selectWarehouse(warehouse) {
      if (warehouse) {
        this.data.receiveWarehouseId = warehouse.id
        this.data.receiveMerchantId = warehouse.merchantId
        this.data.receiveWarehouseCode = warehouse.warehouseCode
        this.data.receiveWarehouseName = warehouse.warehouseName
        if (!this.data.receiveAddress) {
          this.data.receiveAddress = warehouse.address
        }
      }
    },
    // selectSupplierContact(result) {
    //   if (result) {
    //     vue.data.supplierContactName = result.personName
    //     vue.data.supplierMobile = result.mobile

    //     var pl = vue.provinceList.reduce((m, i) => { m[i.id] = i.code; return m }, {})

    //     var pCode = pl[result.provinceId]

    //     result.provinceId = pCode

    //     // 带回联系人省市区
    //     vue.data.deliveryAddressProvinceId = result.provinceId

    //     vue.data.deliveryAddressProvince = result.provinceName
    //     vue.data.deliveryAddressCity = result.cityName
    //     vue.data.deliveryAddressRegion = result.regionName

    //     vue.data.deliveryAddress = result.addressDetail

    //     if (result.provinceId) {
    //       vue.$opms.$api.common.queryAreaByParentCode(result.provinceId).then((result) => {
    //         vue.cityList = result.data
    //         var cl = vue.cityList.reduce((m, i) => { m[i.id] = i.code; return m }, {})
    //         var cCode = cl[result.cityId]
    //         result.cityId = cCode
    //         vue.data.deliveryAddressCityId = result.cityId

    //         if (result.cityId) {
    //           vue.$opms.$api.common.queryAreaByParentCode(result.cityId).then((result) => {
    //             vue.regionList = result.data
    //             var rl = vue.regionList.reduce((m, i) => { m[i.id] = i.code; return m }, {})
    //             vue.data.deliveryAddressRegionId = rl[result.regionId]
    //           })
    //         }
    //       })
    //     }
    //     this.$message('已将联系人的地址复制于发货地址')
    //   }
    // },
    selectProduct(selectedProducts) {
      var poProductList = []
      var repeatMpCodes = []
      var error = ''

      selectedProducts.forEach(function(item) {
        if (repeatMpCodes.indexOf(item['mpCode']) > -1) {
          return
        }
        if (item.inCatalog) {
          var product = vue.getPOProductByProduct(item)
          poProductList.push(product)
          repeatMpCodes.push(item['mpCode'])
        } else {
          error += '商品' + item.mpName + '未进目录;\n\r'
        }
      })

      if (error) {
        this.$message(error)
      }

      this.addProducts(poProductList, true)
    },
    indexOfProduct(product) {
      for (let i = 0; i < this.data.productList.length; i++) {
        if (product.mpCode === this.data.productList[i].mpCode) {
          return 1
        }
      }
      return -1
    },
    async handleLogPageSizeChange(size) {
      try {
        this.$nextTick(function() {
          vue.updateLog()
        })
      } catch (ex) {
        console.log(ex)
      }
    },
    async handleLogPageCurrentChange() {
      try {
        await this.updateLog()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleClick(tab, event) {
      if (tab.name === 'log') {
        this.updateLog()
      }
    },
    validate() {
      var flag = false
      var error = null
      do {
        if (vue.data.supplierType === 1) {
          // 内部供应商地址必填
          if (
            !vue.data.receiveAddressProvinceId ||
            !vue.data.receiveAddressCityId ||
            !vue.data.receiveAddressRegionId ||
            !vue.data.receiveAddress
          ) {
            error = '收货地址不能为空'
            break
          }
          if (
            !vue.data.deliveryAddressProvinceId ||
            !vue.data.deliveryAddressCityId ||
            !vue.data.deliveryAddressRegionId ||
            !vue.data.deliveryAddress
          ) {
            error = '发货地址不能为空'
            break
          }
        }
        if (vue.data.sourceCodeType === null) {
          error = '请输入来源类型'
          break
        }
        if (!vue.data.supplierCode) {
          error = '请输入供应商'
          break
        }
        // if (!vue.data.supplierContactName) {
        //     error = '请选择供应商联系人'
        //     break
        // }
        if (!vue.data.distributionMode) {
          error = '请选择配送方式'
          break
        }
        if (!vue.isDate(vue.data.purchaseDate)) {
          error = '请输入正确的采购日期'
          break
        }
        if (!vue.isDate(vue.data.expectReceiveDate)) {
          error = '请输入正确的约定到货日期'
          break
        }
        if (!vue.data.receiveMethod) {
          error = '请选择收货方式'
          break
        }
        if (
          vue.data.receiveAddress != null &&
          vue.data.receiveAddress.length > 100
        ) {
          error = '收货地址最多100字符。'
          break
        }
        if (vue.data.remark != null && vue.data.remark.length > 1000) {
          error = '备注最多1000字符。'
          break
        }
        if (vue.data.productList == null || vue.data.productList.length === 0) {
          error = '请添加商品'
          break
        }
        if (vue.data.sourceCodeType === '7') {
          error = '不能选择来源类型是要货补货，由要货单生成的，不能手动创建'
          break
        }

        vue.data.productList.forEach(function(item, index) {
          do {
            var prefix = '商品明细第' + (index + 1) + '行, '
            if (
              !vue.isPositiveNumWithBaseScale(item.purchaseCount) ||
              item.purchaseCount > 9999999999
            ) {
              error = prefix + '请输入正确的采购数量'
              break
            }
            if (item.purchaseCount < item.minOrderQuantity) {
              error = prefix + '采购数量不得低于起订量'
              break
            }
            if (
              !vue.isPositiveNumWithBaseScale(item.costWithTaxUnitAmt) ||
              item.costWithTaxUnitAmt > 9999999999
            ) {
              error = prefix + '请输入正确的含税成本单价'
              break
            }
            if (!item.costWithTaxAmt) {
              item.costWithTaxAmt = vue.getNumForBasePrecision(
                item.costWithTaxUnitAmt * item.purchaseCount
              )
            }
            if (item.costWithTaxAmt > 9999999999) {
              error =
                prefix +
                '含税成本金额超出最大值，请修改采购数量或者含税成本单价'
              break
            }
            if (!vue.isDate(item.expectReceiveDate)) {
              error = prefix + '请输入正确的约定到货日期'
              break
            }
            if (!item.receiveMethod) {
              error = prefix + '请输入收货方式'
              break
            }
            if (item.remark != null && item.remark.length > 1000) {
              error = prefix + '备注最多1000字符'
              break
            }
            flag = false
          } while (flag)
          return error === null
        })
      } while (flag)
      if (error) {
        this.$message(error)
      }
      return error === null
    },
    onBeforeSave() {
      if (!this.validate()) {
        return false
      }
      return true
    },
    async save() {
      // 保存
      if (!this.onBeforeSave()) {
        return
      }
      const saveData = this.getSubmitData()
      const result = await this.$opms.$api.purchaseOrder.savePo(saveData)
      if (result.code === '0') {
        this.data.id = result.data
        this.$message({
          type: 'success',
          message: this.$t('common_save_success')
        })
        this.closeTab()
      }
    },
    getSubmitData() {
      var data = { ...this.data }
      if (data.sourceCode == null || data.sourceCode === '') {
        data.sourceCode = data.productList[0].sourceCode // 从商品拿一下采购计划编号code
      }
      data.productList.forEach(function(item) {
        delete item['checked']
        delete item['contractTypeText']
      })
      return data
    },
    closeTab() {
      this.returnBack()
    },
    async submit() {
      if (!this.onBeforeSave()) {
        return
      }
      // 提交
      const confirm = await this.$confirm('确认提交该采购订单？', '请确认')
      if (confirm) {
        if (this.data.id) {
          const result = await this.$opms.$api.purchaseOrder.submitPO(
            JSON.stringify(this.data.purchaseCode)
          )
          if (result && result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('submission_of_success')
            })
            this.init()
          }
        } else {
          const saveData = this.getSubmitData()
          const result = await this.$opms.$api.purchaseOrder.saveAndSubmitPO(
            saveData
          )
          if (result && result.code === '0') {
            this.$message({
              type: 'success',
              message: vue.$t('submission_of_success')
            })
            this.closeTab()
          }
        }
      }
    },
    async cancel() {
      // 取消
      const confirm = await this.$confirm('确认取消该采购订单？', '请确认')
      if (confirm) {
        const result = await this.$opms.$api.purchaseOrder.cancelPO(
          JSON.stringify(this.data.purchaseCode)
        )
        if (result && result.code === '0') {
          this.$message({
            type: 'success',
            message: vue.$t('common_cancel_success')
          })
          this.closeTab()
        }
      }
    },
    async approve() {
      // 审核通过
      const confirm = await this.$confirm('确认审批通过？', '请确认')
      if (confirm) {
        const result = await this.$opms.$api.purchaseOrder.approvePO(
          JSON.stringify(this.data.purchaseCode)
        )
        if (result && result.code === '0') {
          this.$message({
            type: 'success',
            message: vue.$t('audit_through_success')
          })
          this.closeTab()
        }
      }
    },
    async reject() {
      // 驳回
      const confirm = await this.$confirm('确认驳回？', '请确认')
      if (confirm) {
        const result = await this.$opms.$api.purchaseOrder.rejectPO(
          JSON.stringify(vue.data.purchaseCode)
        )
        if (result && result.code === '0') {
          this.$message({
            type: 'success',
            message: vue.$t('invoice_inqurity_reject_success')
          })
          this.closeTab()
        }
      }
    },
    setPerformStatus() {
      // 设置履行状态
      this.data.purchaseStatus =
        this.data.purchaseStatus != null ? this.data.purchaseStatus + '' : null
      this.showPurchaseStatus = true
    },
    print() {
      // 打印
      window.open(
        '/opms-web/purchaseOrder/printPO.do?purchaseCode=' +
          this.data.purchaseCode
      )
    },
    showCaigou() {
      // 引用采购计划
      if (!this.data.supplierCode) {
        this.$message(this.$t('please_choose_the_supplier_first'))
        return
      }
      this.showPurchasePlanModal = true
    },
    async confirmJihua(selectedJihua) {
      // 确认采购计划
      if (!selectedJihua) {
        this.$message('请选择采购计划')
      }
      // 查询计划的商品
      var param = {
        page: 1,
        limit: 30000,
        filters: {
          purchasePlanId: selectedJihua.id,
          planCode: selectedJihua.planCode,
          purchaseCode: vue.data.purchaseCode
        }
      }
      await this.$portal
        .post('/opms-web/purchasePlanItems/listForPage.do', param)
        .then(result => {
          vue.data.productList = result.data
          var products = []
          vue.data.productList.forEach(function(item) {
            var supcode = vue.data.supplierCode // 用户选择的供应商
            var isupcode = item.defaultSupplierCode // 采购计划商品供应商
            if (supcode != null && supcode !== '') {
              if (supcode !== isupcode) {
                return true
              }
            }

            item.requestProductId = item.id
            item.id = null
            item.requestCode = selectedJihua.planCode // 采购计划编号
            item.purchasePlanId = selectedJihua.id // 采购计划id
            item.sourceCode = selectedJihua.planCode // 采购计划编号
            item.purchaseCount =
              item.approvedPurchaseNum - item.actualPurchaseNum
            if (item.purchaseCount <= 0) {
              return true // 过滤数量为0的
            }
            if (item.receiveMethod == null || item.receiveMethod === '') {
              // 拿采购单上面的
              item.receiveMethod = vue.data.receiveMethod
            }
            item.costTaxRate = item.purchaseTaxRate
            var price = item.purchaseWiTaxPrice
            item.costWithTaxUnitAmt = parseFloat(price.toFixed(4))
            item.mpMeasureUnit = item.mpMeasureUnitName
            var dt = new Date(item.expectReceiveDate)
            item.expectReceiveDate = dateFtt('yyyy-MM-dd', dt)
            products.push(item)
          })
          vue.data.productList = products
          vue.showPurchasePlanModal = false
          if (vue.data.productList.length === 0) {
            vue.$message('该采购计划下没有符合当前供应商的数据，请重新选择！')
          }
        })
    },
    deleteProduct() {
      // 删除
      for (let i = 0; i < this.checked.length; i++) {
        const index = this.data.productList.indexOf(this.checked[i])
        if (index > -1) {
          this.data.productList.splice(index, 1)
        }
      }
    },
    handleSelectionChange(val) {
      this.checked = val
    },
    importProduct() {
      // 导入商品
      if (!this.data.supplierCode) {
        this.$message('请先选择供应商')
        return
      }
      var input = document.createElement('input')
      input.type = 'file'
      input.click()
      input.onchange = function() {
        var file = input.files[0]
        var form = new FormData()
        form.append('file', file)
        form.append('jsonParams', JSON.stringify(vue.data))
        if (file == null) {
          vue.$message('文件不能为空')
          return
        }
        vue.canUpload = false
        vue.$portal
          .post('/opms-web/purchaseOrder/importProduct.do', form)
          .then(data => {
            var errors = data.data.errors
            var productList = data.data.products
            if (errors != null && errors.length > 0) {
              vue.$message(errors.toString())
            }
            if (productList) {
              var poProductList = []
              for (let i = 0; i < productList.length; i++) {
                var product = vue.getPOProductByProduct(productList[i].product)
                product.purchaseCount = productList[i].quantity
                poProductList.push(product)
              }
              vue.addProducts(poProductList, true)
            }
          })
          .catch(res => {
            vue.canUpload = true
            vue.$message(res.message)
          })
      }
    },
    downloadTemplate() {
      // 模板下载
      window.open('/opms-web/template/excel/import/importProduct.xlsx')
    },
    getPOProductByProduct(product) {
      var result = {}
      var copyProperties = [
        'minOrderQuantity',
        'contractProperty',
        'contractPropertyText',
        'minOrderQuantity',
        'distributionChannel',
        'isIncludingDeliveryFee',
        'settlementPartyType',
        'paymentPeriodId',
        'paymentPeriodName',
        'paymentPeriodType',
        'paymentPeriodDay',
        'mpId',
        'mpName',
        'mpCode',
        'mpBarcode',
        'mpSpec',
        'mpBrandName',
        'mpMeasureUnit',
        'mpType',
        'mpBrandCode',
        'mpBrandName',
        'categoryCode',
        'categoryId',
        'categoryName',
        'costTaxRate',
        'costWithTaxUnitAmt',
        'costWithoutTaxUnitAmt',
        'contractCode',
        'contractTypeText',
        'contractType',
        'saleWithTaxUnitAmt',
        'saleWithoutTaxUnitAmt',
        'mpPurchaseUnit'
      ]

      copyProperties.forEach(function(item) {
        result[item] = product[item]
        if (product['mpMeasurementUnit']) {
          result['mpMeasureUnit'] = product['mpMeasurementUnit']
        }
      })

      result.receiveStoreId = this.data.receiveStoreId
      result.receiveStoreCode = this.data.receiveStoreCode
      result.receiveStoreName = this.data.receiveStoreName

      return result
    },
    addProducts(productList, isNewRecord) {
      var existingMpCodes = []
      this.data.productList.forEach(function(item) {
        existingMpCodes.push(item['mpCode'])
      })

      var copyProperties = ['expectReceiveDate', 'receiveMethod']
      var toAppendProductList = []

      productList.forEach(function(item) {
        if (existingMpCodes.indexOf(item['mpCode']) > -1) {
          return
        }

        // item.expectReceiveDate = $filter("date")(item.expectReceiveDate, 'yyyy-MM-dd')
        if (isNewRecord) {
          copyProperties.forEach(function(property) {
            item[property] = vue.data[property]
          })
        }
        item.currencyCode = vue.data.currencyCode
        toAppendProductList.push(item)
      })
      vue.data.productList = vue.data.productList.concat(toAppendProductList)
    },
    doSetPurchaseStatus() {
      if (!this.data.purchaseCode) {
        this.$message('采购单号不能为空')
        return
      }
      if (!this.data.purchaseStatus) {
        this.$message('请选择履行状态')
        return
      }
      this.$opms.$api.purchaseOrder
        .setPerformStatus({
          purchaseCode: this.data.purchaseCode,
          purchaseStatus: this.data.purchaseStatus
        })
        .then(resp => {
          vue.showPurchaseStatus = false
          vue.closeTab()
        })
    },
    regAddressChangeProvince(data) {
      var pr = this.enterpriseProvinceList.reduce((m, i) => {
        m[i.code] = i.name
        return m
      }, {})
      this.data.receiveAddressProvince = pr[data]
      if (!data) {
        this.data.receiveAddressProvince = null
        this.data.receiveAddressCityId = null
        this.data.receiveAddressCity = null
        this.data.receiveAddressRegionId = null
        this.data.receiveAddressRegion = null
        vue.enterpriseCityList = []
        vue.enterpriseRegionList = []
      } else {
        this.queryCity(data, function(result) {
          vue.enterpriseCityList = result
          vue.enterpriseRegionList = []
        })
      }
    },
    regAddressChangeCity(data) {
      var ci = this.enterpriseCityList.reduce((m, i) => {
        m[i.code] = i.name
        return m
      }, {})
      this.data.receiveAddressCity = ci[data]
      if (!data) {
        this.data.receiveAddressCity = null
        this.data.receiveAddressRegionId = null
        this.data.receiveAddressRegion = null
        vue.enterpriseRegionList = []
      } else {
        this.queryRegion(data, function(result) {
          vue.enterpriseRegionList = result
        })
      }
    },
    regAddressChangeRegion(data) {
      var re = this.enterpriseRegionList.reduce((m, i) => {
        m[i.code] = i.name
        return m
      }, {})
      this.data.receiveAddressRegion = re[data]
    },
    changeProvince(data) {
      var pr = this.provinceList.reduce((m, i) => {
        m[i.code] = i.name
        return m
      }, {})
      this.data.deliveryAddressProvince = pr[data]
      if (!data) {
        this.data.deliveryAddressProvince = null
        this.data.deliveryAddressCityId = null
        this.data.deliveryAddressCity = null
        this.data.deliveryAddressRegionId = null
        this.data.deliveryAddressRegion = null
        vue.cityList = []
        vue.regionList = []
      } else {
        this.queryCity(data, function(result) {
          vue.cityList = result
          vue.regionList = []
        })
      }
    },
    changeCity(data) {
      var ci = this.cityList.reduce((m, i) => {
        m[i.code] = i.name
        return m
      }, {})
      this.data.deliveryAddressCity = ci[data]
      if (!data) {
        this.data.deliveryAddressCity = null
        this.data.deliveryAddressRegionId = null
        this.data.deliveryAddressRegion = null
        vue.regionList = []
      } else {
        this.queryRegion(data, function(result) {
          vue.regionList = result
        })
      }
    },
    changeRegion(data) {
      var re = this.regionList.reduce((m, i) => {
        m[i.code] = i.name
        return m
      }, {})
      this.data.deliveryAddressRegion = re[data]
    },
    queryProvince(id, callback) {
      if (id === undefined) {
        id = 100000
      }
      this.$opms.$api.common.queryAreaByParentCode(id).then(result => {
        callback(result.data)
      })
    },
    queryCity(id, callback) {
      if (id === undefined || id == null) {
        return
      }
      this.$opms.$api.common.queryAreaByParentCode(id).then(result => {
        callback(result.data)
      })
    },
    queryRegion(id, callback) {
      if (id === undefined || id == null) {
        return
      }
      this.$opms.$api.common.queryAreaByParentCode(id).then(result => {
        callback(result.data)
      })
    },
    queryList() {
      this.$opms.$api.purchaseOrder
        .selectProductsByPurchaseOrder(JSON.stringify(this.data.purchaseCode))
        .then(result => {
          this.addProducts(result.data, false)
        })
    },
    onDataLoaded(data) {
      this.data = data
      this.convertFromDB()
      this.loadAttachment()
      if (this.data) {
        this.data.purchaseStatus =
          this.data.purchaseStatus != null
            ? this.data.purchaseStatus + ''
            : null
      }
      this.updateLog()
      this.$opms.$api.code
        .select({ category: 'DISTRIBUTION_MODE' })
        .then(result => {
          this.distributionModeList = result.data
        })
      this.$opms.$api.code
        .select({ category: 'DISTRIBUTION_MODE' })
        .then(result => {
          this.distributionModeList = result.data
        })
      this.$portal
        .post('/opms-web/common/getCurreyConfig.do', null)
        .then(res => {
          if (res.code === '0') {
            vue.curreyConfig = res.data
          }
        })
      this.$portal
        .get('/ouser-web/public/page/getStringValue.do', {
          pool: 'opms',
          key: 'saleTaxRateConfig'
        })
        .then(res => {
          if (res.code === '0' && res.data) {
            vue.costTaxRateList = JSON.parse(res.data)
          }
        })
      // 加载用户省市区
      var receiveAddressProvinceId = this.data.receiveAddressProvinceId
      var receiveAddressCityId = this.data.receiveAddressCityId
      // var receiveAddressRegionId = this.data.receiveAddressRegionId
      var deliveryAddressProvinceId = this.data.deliveryAddressProvinceId
      var deliveryAddressCityId = this.data.deliveryAddressCityId
      // var deliveryAddressRegionId = this.data.deliveryAddressRegionId
      this.$opms.$api.common.queryAreaByParentCode(100000).then(result => {
        this.enterpriseProvinceList = result.data
        this.provinceList = result.data
      })
      if (!receiveAddressProvinceId) return
      this.$opms.$api.common
        .queryAreaByParentCode(receiveAddressProvinceId)
        .then(result => {
          this.enterpriseCityList = result.data
        })
      if (!receiveAddressCityId) return
      this.$opms.$api.common
        .queryAreaByParentCode(receiveAddressCityId)
        .then(result => {
          this.enterpriseRegionList = result.data
        })
      if (!deliveryAddressProvinceId) return
      this.$opms.$api.common
        .queryAreaByParentCode(deliveryAddressProvinceId)
        .then(result => {
          this.cityList = result.data
        })
      if (!deliveryAddressCityId) return
      this.$opms.$api.common
        .queryAreaByParentCode(deliveryAddressCityId)
        .then(result => {
          this.regionList = result.data
        })
    },
    convertFromDB() {
      // var dateProperties = ['purchaseDate', 'expectReceiveDate']
      // dateProperties.forEach(function(item) {
      //   vue.data[item] = formatDate('yyyy-MM-dd')
      // })
    },
    handleStatusClose() {
      this.showPurchaseStatus = false
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
        this.updateAttachment()
      }
    },
    handleFileRemove(file, fileList) {
      const index = this.attachments.indexOf(file)
      if (index > -1) {
        this.attachments.splice(index, 1)
      }
      this.updateAttachment()
    },
    cleanProductInfo() {
      this.data.productList = []
    },
    loadAttachment() {
      this.attachments = []
      if (vue.data.attach1Name && vue.data.attach1Path) {
        this.attachments.push({
          url: vue.data.attach1Path,
          name: vue.data.attach1Name
        })
      }
      if (vue.data.attach2Name && vue.data.attach2Path) {
        this.attachments.push({
          url: vue.data.attach2Path,
          name: vue.data.attach2Name
        })
      }
      if (vue.data.attach3Name && vue.data.attach3Path) {
        this.attachments.push({
          url: vue.data.attach3Path,
          name: vue.data.attach3Name
        })
      }
    },
    updateAttachment() {
      if (this.attachments.length >= 3) {
        vue.data.attach3Name = this.attachments[2].name
        vue.data.attach3Path = this.attachments[2].url
      } else {
        vue.data.attach3Name = null
        vue.data.attach3Path = null
      }
      if (this.attachments.length >= 2) {
        vue.data.attach2Name = this.attachments[1].name
        vue.data.attach2Path = this.attachments[1].url
      } else {
        vue.data.attach2Name = null
        vue.data.attach2Path = null
      }
      if (this.attachments.length >= 1) {
        vue.data.attach1Name = this.attachments[0].name
        vue.data.attach1Path = this.attachments[0].url
      } else {
        vue.data.attach1Name = null
        vue.data.attach1Path = null
      }
    },
    isPositiveNumWithBaseScale(value) {
      var reg = new RegExp('^(([1-9]{1}\\d*)|([0]{1}))(\\.(\\d){0,4})?$')
      return reg.test(value)
    },
    getNumForBasePrecision(input, returnFloat) {
      var result = ''
      if (input !== null && input !== undefined && input !== '') {
        var value = Number(input)
        if (!isNaN(value)) {
          result = value.toFixed(4)
        }
      }
      return returnFloat ? parseFloat(result) : result
    },
    isDate(dateString) {
      if (dateString) {
        return true
      } else {
        return false
      }
    },
    returnBack() {
      this.$portal.delActiveViewAndRefresh()
    }
  }
}

function findOplogPage(vue) {
  if (vue.data.id) {
    const param = {
      modelId: vue.data.id,
      model: 'PurchaseOrder',
      limit: vue.logPage.size,
      page: vue.logPage.current
    }
    vue.$opms.$api.common.findOplogPage(param).then(result => {
      if (result && result.code === '0') {
        vue.logs = result.data
        vue.logPage.total = result.total
      }
    })
  }
}

function dateFtt(fmt, date) {
  // author: meizz
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}
</script>

<style lang="scss">
#id-id input::-webkit-outer-spin-button,
#id-id input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
#id-id input[type='number'] {
  -moz-appearance: textfield;
}
#id-id .red {
  color: red;
}
#id-id .total_div {
  margin-top: 25px;
  margin-left: 75%;
}
#id-id .total_div span {
  display: block;
  font-size: 14px;
  margin-top: 2px;
}
#id-id .required-star div::before {
  content: '*';
  color: red;
}
</style>
