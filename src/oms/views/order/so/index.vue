<template>
  <section class="pg-so-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item prop="data.searchKey">
            <span slot="label">
              <el-select v-model="search.data.searchKey" :clearable="false" name="search_data_searchKey" @change="onSearchKeyChange">
                <el-option :label="$t('orderNumber')" value="orderCode">{{ $t('orderNumber') }}</el-option>
                <el-option :label="$t('order_difference_channel_order_code')" value="outOrderCode">{{ $t('order_difference_channel_order_code') }}</el-option>
                <el-option :label="$t('consignee_name')" value="goodReceiverName">{{ $t('consignee_name') }}</el-option>
                <el-option :label="$t('do_product_code')" value="code">{{ $t('do_product_code') }}</el-option>
              </el-select>
            </span>
            <el-input v-model="search.data.searchValue" name="search_data_searchValue"/>
          </ody-search-item>
          <ody-search-item :label="$t('consignee_cell_phone') + ':'" prop="param.goodReceiverMobile">
            <el-input v-model="search.param.goodReceiverMobile" name="search_param_goodReceiverMobile" />
          </ody-search-item>
          <ody-search-item :label="$t('shop') + ':'" prop="param.storeId">
            <el-select v-model="search.param.storeId" :popper-append-to-body="false" name="search_param_storeId">
              <el-option :value="null" :label="$t('common_status_all')"/>
              <el-option v-for="(key, value) in search.storeList" :label="key" :key="key" :value="value" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('commodity_name') + ':'" prop="param.productCname">
            <el-input v-model="search.param.productCname" name="search_param_productCname"/>
          </ody-search-item>
          <ody-search-item :label="$t('orderCreateTime') + ':'" :space="2" prop="data.orderCreateTime">
            <ody-date-range-picker ref="orderCreateTime" v-model="search.data.orderCreateTime" :default="7" name="search_data_orderCreateTime" type="datetimer"/>
          </ody-search-item>
          <ody-search-item v-if="platformId !== 1" :label="$t('orderInvoiceInfo_customer_name') + ':'" prop="data.customerName">
            <el-input v-model="search.data.customerName" :placeholder="$t('pleaseSelect')" name="search_data_customerName" readonly="true" @click.native="showCustomerModal" />
          </ody-search-item>
          <ody-search-item :label="$t('paymentTime') + ':'" :space="2" prop="data.orderPaymentConfirmDate">
            <ody-date-range-picker ref="orderPaymentConfirmDate" v-model="search.data.orderPaymentConfirmDate" name="search_data_orderPaymentConfirmDate" type="datetimer"/>
          </ody-search-item>
          <ody-search-item :label="$t('订单类型') + ':'" prop="param.orderType">
            <el-select v-model="search.param.orderType" name="search_param_orderType">
              <el-option :value="null" :label="$t('common_status_all')"/>
              <el-option v-for="item in search.orderTypeList" :label="item.name" :key="item.code" :value="item.code" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('manul_order_channel') + ':'" prop="param.orderSource">
            <el-select v-model="search.param.orderSource" :popper-append-to-body="false" name="search_param_orderSource">
              <el-option :value="null" :label="$t('common_status_all')"/>
              <el-option v-for="item in search.orderSourceList" :label="item.name" :key="item.code" :value="item.code" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('state_of_payment') + ':'" prop="param.orderPaymentStatus">
            <el-select v-model="search.param.orderPaymentStatus" name="search_param_orderPaymentStatus">
              <el-option :value="null" :label="$t('common_status_all')"/>
              <el-option v-for="item in search.orderPaymentStatusList" :label="item.name" :key="item.code" :value="item.code" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('distributionMethod') + ':'" prop="param.orderDeliveryMethodId">
            <el-select v-model="search.param.orderDeliveryMethodId" name="search_param_orderDeliveryMethodId">
              <el-option :value="null" :label="$t('common_status_all')"/>
              <el-option v-for="item in search.distributionList" :label="item.distributionMode" :key="item.shippingCode" :value="item.shippingCode" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('渠道') + ':'" prop="param.sysSource">
            <el-select v-model="search.param.sysSource" :popper-append-to-body="false" name="search_param_sysSource">
              <el-option :value="null" :label="$t('common_status_all')"/>
              <el-option v-for="item in search.sysChannelList" :label="item.name" :key="item.code" :value="item.code" />
            </el-select>
          </ody-search-item>
          <ody-search-item prop="data.enableUserRemark + ':'">
            <span slot="label">
              <el-checkbox v-model="search.data.enableUserRemark" name="search_data_enableUserRemark" @change="onRemarkChange($event, 'orderRemarkUser')">{{ $t('买家留言') }}</el-checkbox>
            </span>
            <el-input :disabled="!search.data.enableUserRemark" v-model="search.param.orderRemarkUser" name="search_param_orderRemarkUser"/>
          </ody-search-item>
          <ody-search-item prop="data.enableMerchantRemark + ':'">
            <span slot="label">
              <el-checkbox v-model="search.data.enableMerchantRemark" name="search_data_enableMerchantRemark" @change="onRemarkChange($event, 'orderRemarkMerchant2user')">{{ $t('商家留言') }}</el-checkbox>
            </span>
            <el-input :disabled="!search.data.enableMerchantRemark" v-model="search.param.orderRemarkMerchant2user" name="search_param_orderRemarkMerchant2user"/>
          </ody-search-item>

          <ody-search-item :label="$t('asn_deliveryTime') + ':'" :space="2" prop="data.orderLogisticsTime">
            <ody-date-range-picker
              v-model="search.data.orderLogisticsTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="search_data_orderLogisticsTime"
              type="datetimer"/>
          </ody-search-item>

          <ody-search-item :label="$t('供应商名称') + ':'" prop="param.supplierName">
            <el-input v-model="search.param.supplierName" name="search_data_supplierName"/>
          </ody-search-item>

          <ody-search-item :space="2" prop="param.requireInvoice">
            <el-checkbox v-model="search.param.requireInvoice" name="search_param_requireInvoice">{{ $t('需要开票') }}</el-checkbox>
            <el-checkbox v-model="search.param.existReturn" name="search_param_existReturn">{{ $t('returnExist') }}</el-checkbox>
            <el-checkbox v-model="search.param.stockOut" name="search_param_stockOut">{{ $t('缺货订单') }}</el-checkbox>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <ody-button name="OmsOrderList_Reset_initData" code="OmsOrderList_Reset" size="small" @click="initData">{{ $t('omni_i18n_重置') }}</ody-button>
        <ody-button name="OmsOrderList_Query_query" code="OmsOrderList_Query" size="small" type="primary" @click="query">{{ $t('omni_i18n_查询') }}</ody-button>
        <ody-button name="OmsOrderList_Query_Code_assignCodeModalVisible" code="OmsOrderList_Query_Code" size="small" type="primary" @click="assignCodeModalVisible = true">{{ $t('指定订单查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area v-if="tabs.length > 0">
      <div slot="tabs">
        <el-tabs v-model="activeState" :before-leave="handleTabLeave" name="activeState" @tab-click="onTabClick" >
          <el-tab-pane v-for="tab in tabs" :key="tab.index">
            <span slot="label">{{ tab.heading }} <span v-show="tab.count > 0" class="error">({{ tab.count }})</span></span>
          </el-tab-pane>
        </el-tabs>
        <div slot="btn-bottom">
          <ody-batch-export-button
            v-show="showBatchBtn && btns.showBatchExport"
            :get-export-data="exportModel.getExportData"
            :export-api="exportModel.exportApi"
            :async="exportModel.async"
            :pool="exportModel.pool"
            :task-type="exportModel.taskType"
            name="OmsOrderList_Export_onBatchExport"
            code="OmsOrderList_Export"
            size="small"
            class="btn-right"
          >{{ $t('exportOrder') }}</ody-batch-export-button>
          <ody-batch-export-button
            v-show="showBatchBtn && btns.showBatchExportLine"
            :get-export-data="exportItemModel.getExportData"
            :export-api="exportItemModel.exportApi"
            :async="exportItemModel.async"
            :pool="exportItemModel.pool"
            :task-type="exportItemModel.taskType"
            name="OmsOrderList_Export_Line_onBatchExportLine"
            code="OmsOrderList_Export_Line"
            size="small"
            class="btn-right"
          >{{ $t('exportOrderLine') }}</ody-batch-export-button>
          <ody-button name="OmsOrderList_Import_Order" code="OmsOrderList_Import_Order" size="small" type="primary" class="btn-right" @click="importOrder">{{ $t('importOrder') }}</ody-button>
          <ody-batch-import-button
            :download-label="importModelLogistics.downloadLabel"
            :import-api="importModelLogistics.importApi"
            :import-label="importModelLogistics.importLabel"
            :download-local-file="importModelLogistics.downloadLocalFile"
            :async="importModelLogistics.async"
            :pool="importModelLogistics.pool"
            :task-type="importModelLogistics.taskType"
            name="OmsTransOrdersList_Import_importTransOrderList"
            code="OmsTransOrdersList_Import"
            size="small"
            type="primary"
            class="btn-right"
          >{{ $t('导入批量物流发货') }}</ody-batch-import-button>
          <!-- <ody-button name="okToDo" type="primary" size="small" class="btn-right" code="ui" @click="batchDelivery">导入批量物流发货</ody-button> -->
          <el-popover v-show="btns.showBatchExportTask" placement="bottom" with="160" trigger="hover">
            <div class="btn-popover">
              <ody-import-task-button
                ref="importTaskBtn"
                pool="oms"
                task-type="soImport"
                name="OmsOrderList_viewImportTask"
                code="OmsOrderList_Task"
                size="small"
              >{{ $t('查看导入订单任务') }}</ody-import-task-button>
              <ody-export-task-button
                pool="oms"
                task-type="soExport"
                name="OmsOrderList_viewExportTask"
                code="OmsOrderList_Task"
                size="small"
              >{{ $t('查看导出订单任务') }}</ody-export-task-button>
              <ody-export-task-button
                pool="oms"
                task-type="soItemExport"
                name="OmsOrderList_viewItemExportTask"
                code="OmsOrderList_Task"
                size="small"
              >{{ $t('查看导出订单行任务') }}</ody-export-task-button>
              <ody-import-task-button
                pool="oms"
                task-type="soPackageImport"
                name="OmsOrderList_viewImportTask"
                code="OmsOrderList_Task"
                size="small"
              >{{ $t('查看导入发货物流任务') }}</ody-import-task-button>
            </div>
            <el-button slot="reference" size="small" class="btn-right">
              {{ $t('seeTask') }}
              <i class="el-icon-arrow-down" />
            </el-button>
          </el-popover>
          <ody-button name="OmsOrderList_Export_Order_Item_Online" code="OmsOrderList_Export_Order_Item_Online" size="small" type="primary" class="btn-right" @click="exportOrderAndItem">{{ $t('导出订单与明细') }}</ody-button>
          <ody-button v-show="showBatchBtn && btns.showBatchOrderJoin" :disabled="checked.length === 0" name="OmsOrderList_Join_onBatchOrderJoin" code="OmsOrderList_Join" size="small" class="btn-right" @click="onBatchOrderJoin">{{ $t('批量接单') }}</ody-button>
          <ody-button v-show="showBatchBtn && btns.showBatchOrderDispatch" :disabled="checked.length === 0" name="OmsOrderList_Dispatch_onBatchOrderDispatch" code="OmsOrderList_Dispatch" size="small" class="btn-right" @click="onBatchOrderDispatch">{{ $t('批量发货') }}</ody-button>
          <ody-button v-show="showBatchBtn && btns.showBatchCancel" :disabled="checked.length === 0" name="OmsOrderList_Cancel_onBatchCancel" code="OmsOrderList_Cancel" size="small" class="btn-right" @click="onBatchCancel">{{ $t('批量取消订单') }}</ody-button>
          <ody-button v-show="showBatchBtn && btns.showBatchAuditPass" :disabled="checked.length === 0" name="OmsOrderList_Audit_onBatchAuditPass" code="OmsOrderList_Audit" size="small" class="btn-right" @click="onBatchAuditPass">{{ $t('批量审核通过') }}</ody-button>
          <ody-button v-show="showBatchBtn && btns.showBatchAuditNoPass" :disabled="checked.length === 0" name="OmsOrderList_Audit_onBatchAuditNoPass" code="OmsOrderList_Audit" size="small" class="btn-right" @click="onBatchAuditNoPass">{{ $t('批量审核不通过') }}</ody-button>

          <el-dropdown v-show="showBatchBtn && btns.showMoreOperate" @command="handleCommand">
            <el-button :disabled="checked.length === 0" size="small" class="btn-right">
              更多批量操作<i class="el-icon-arrow-down el-icon--right"/>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="$portal.hasPermission('OmsOrderList_To_Audit')" v-show="btns.showBatchBackToAudit" command="batchBackToAudit">{{ $t('批量返回待审核') }}</el-dropdown-item>
              <el-dropdown-item v-if="$portal.hasPermission('OmsOrderList_Modify_Remark')" v-show="btns.showBatchModifyMerchantRemark" command="batchModifyMerchantRemark">{{ $t('批量修改商家备注') }}</el-dropdown-item>
              <el-dropdown-item v-if="$portal.hasPermission('OmsOrderList_Replace_Product')" v-show="btns.showBatchReplaceProduct" command="batchReplaceProduct">{{ $t('批量替换商品') }}</el-dropdown-item>
              <el-dropdown-item v-if="$portal.hasPermission('OmsOrderList_Add_Given')" v-show="btns.showBatchAddGivenProduct" command="batchAddGivenProduct">{{ $t('批量添加赠品') }}</el-dropdown-item>
              <el-dropdown-item v-if="$portal.hasPermission('OmsOrderList_Delete_Given')" v-show="btns.showBatchDeleteGivenProduct" command="batchDeleteGivenProduct">{{ $t('批量删除赠品') }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :multiple="false"
          :checked.sync="checked"
          :can-filter="false"
          :default-expand-all="false"
          :expand="true"
          name="list767"
          tooltip-effect="dark"
          class="hzf-oder-big-none-border"
          @expand-change="onExpandItems">
          <template slot="expand" slot-scope="props">
            <el-table
              :data="props.row.soItemList"
              :show-header="false"
              :span-method="soItemSpanMethod"
              name="props_row_soItemList727"
              class="hzf-oder-none-border bg-gray"
              style="width: 100%">
              <el-table-column>
                <template slot-scope="scope">
                  <ToOrderDetail v-if="scope.$index === 3" :order-code="props.row.orderCode" :order-source="props.row.orderSource" :sys-source="props.row.sysSource">
                    <span>查看更多商品></span>
                  </ToOrderDetail>
                  <div v-if="scope.$index === 3"/>
                  <div v-else>
                    <el-row
                      class="product-wrap">
                      <el-image
                        :src="scope.row.productPicPath || '/api/favicon.ico'"
                        :fit="cover"
                        style="width: 35px; height: 35px"/>
                      <span class="product-name">{{ scope.row.productCname }}&nbsp;&nbsp;<el-tag v-if="scope.row.productSaleType === 4" type="warning">{{ $t('赠') }}</el-tag></span>
                    </el-row>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="code"
                width="180"/>
              <el-table-column
                prop="standardStr"/>
              <el-table-column>
                <template slot-scope="scope">
                  {{ scope.row.productItemAmount | currency('￥', 2) }}
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  x{{ scope.row.productItemNum }}
                </template>
              </el-table-column>
            </el-table>
          </template>
        </ody-table>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="pageParam.page"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="pageParam.limit"
          :total.sync="pageParam.total"
          :list="list"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="onPageChange"
          @current-change="onPageChange"/>
        <font color="white"/>

      </div>
    </ody-list-table-area>

    <OrderCustomerModal :visible.sync="showCustomer" @ok="selectCustomer" />
    <AssginCodeModal ref="assginCode" :visible.sync="assignCodeModalVisible" @ok="assignQuery" />

    <SoImportModal v-if="visibleOfSoImportModal" :visible.sync="visibleOfSoImportModal" @success="handleImportSuccess" />
    <offine-payment-voucher :visible.sync="offinePaymentModal.show" :order-code="offinePaymentModal.orderCode" />

    <ody-dialog :visible.sync="audit.showDialog" :title="$t('operation')" size="md">
      <el-form ref="auditForm" :model="audit.form" :rules="audit.rules" label-width="100px">
        <el-form-item :label="$t('audit_status')" :rules="[{ required: true, message: $t('please_enter')+$t('audit_status') }]" required prop="status">
          <el-radio-group v-model="audit.form.status" name="audit_form_status">
            <el-radio
              v-for="item in audit.auditStatusList"
              :key="item.code"
              :label="item.code">
              {{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="audit.form.status == '3' " prop="remark">
          <el-input
            :rows="2"
            v-model="audit.form.remark"
            :placeholder="$t('please_enter')"
            name="audit_form_remark"
            type="textarea"
            maxlength="50"/>
        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button name="audit_showDialog" size="small" @click="audit.showDialog = false">{{ $t('cancel') }}</el-button>
        <el-button name="submitAuditForm" size="small" type="primary" @click="submitAuditForm">{{ $t('determine') }}</el-button>
      </div>
    </ody-dialog>

    <!-- 修改商家备注模态框 -->
    <ody-dialog :visible.sync="modifyMerchantRemark.showDialog" :title="$t('batchModifyMerchantRemarkTitle')" size="md">
      <el-form ref="modifyMerchantRemarkForm" :model="modifyMerchantRemark.form" :rules="modifyMerchantRemark.rules" label-width="50px">
        <el-form-item prop="orderRemarkMerchant2user">
          <el-input v-model="modifyMerchantRemark.form.orderRemarkMerchant2user" :placeholder="$t('manual_order_merchant_remark')" name="modifyMerchantRemark_form_orderRemarkMerchant2user" type="textarea" maxlength="150"/>
        </el-form-item>
        <el-form-item>
          <el-col :span="11">
            <span>{{ $t("batchModifyMerchantRemarkAppendTip") }}</span>
          </el-col>
          <el-col :span="2">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <span>{{ $t("batchModifyMerchantRemarkOverwriteTip") }}</span>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button name="modifyMerchantRemark_showDialog" size="small" @click="modifyMerchantRemark.showDialog = false">{{ $t('cancel') }}</el-button>
        <el-button :disabled="modifyMerchantRemark.submiting" name="submitModifyMerchantRemarkForm" size="small" type="primary" @click="submitModifyMerchantRemarkForm(false)">{{ $t('common_append') }}</el-button>
        <el-button :disabled="modifyMerchantRemark.submiting" name="submitModifyMerchantRemarkForm7" size="small" type="primary" @click="submitModifyMerchantRemarkForm(true)">{{ $t('common_overwrite') }}</el-button>
      </div>
    </ody-dialog>
    <!-- 删除赠品模态框 -->
    <ody-dialog :visible.sync="deleteGivenProduct.showDialog" :title="$t('batchDeleteGiveProductTitle')" size="md">
      <el-form ref="deleteGivenProductForm" :model="deleteGivenProduct.form" :rules="deleteGivenProduct.rules" label-width="100px">
        <el-form-item :label="$t('deleteGiveProduct')" prop="code">
          <el-input v-model="deleteGivenProduct.form.code" name="deleteGivenProduct_form_code" @blur="deleteGivenProduct.message = ''" />
          <span class="el-form-item__error">{{ deleteGivenProduct.message }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button name="deleteGivenProduct_showDialog" size="small" @click="deleteGivenProduct.showDialog = false">{{ $t('cancel') }}</el-button>
        <el-button :disabled="deleteGivenProduct.submiting" name="submitDeleteGivenProductForm" size="small" type="primary" @click="submitDeleteGivenProductForm">{{ $t('determine') }}</el-button>
      </div>
    </ody-dialog>
    <!--发货改为统一由订单列表或订单详情页进行发货-->
    <ody-dialog-full-right :visible.sync="sendOutShow" :title="$t('order_delivery')" @opened="handleOpen">
      <el-row>
        <delivery-operation ref="deliveryOperation" :so-info="soDetail" @onSuccess="onSuccess" @ok="cancelSendOut"/>
      </el-row>
      <div slot="footer">
        <el-button name="cancelSendOut" @click="cancelSendOut">{{ $t('返回') }}</el-button>
      </div>
    </ody-dialog-full-right>
    <uploadDeliverGoods v-if="dialogVisible" :dialog-visible.sync="dialogVisible" :data-type="1" @uploadSuccess="uploadSuccess"/>
  </section>
</template>

<script>
import DeliveryOperation from '@/components/deliveryOperation'
import SoExportTask from '@/components/soExportTask'
import OrderCustomerModal from '@/components/orderCustomerModal'
import AssginCodeModal from '@/components/so/assignCodeModal'
import ToOrderDetail from '@/components/so/toDetail'
import SoImportModal from '@/components/so/importModal'
import OffinePaymentVoucher from '@/components/so/offinePaymentVoucher'
import uploadDeliverGoods from '@/components/uploadDeliverGoods'

export default {
  name: 'OmsOrderList',
  components: {
    DeliveryOperation,
    SoExportTask,
    OrderCustomerModal,
    ToOrderDetail,
    AssginCodeModal,
    SoImportModal,
    OffinePaymentVoucher,
    uploadDeliverGoods
  },
  data() {
    const self = this
    return {
      exportModel: {
        exportApi: ['oms-web', 'so', 'exportData'],
        pool: 'oms',
        taskType: 'soExport',
        async: true,
        getExportData: () => {
          return this._getExportData()
        }
      },
      exportItemModel: {
        exportApi: ['oms-web', 'so', 'exportItemData'],
        pool: 'oms',
        taskType: 'soItemExport',
        async: true,
        getExportData: () => {
          return this._getExportData()
        }
      },
      search: {
        data: {
          searchKey: 'orderCode',
          searchValue: '',
          lastSearchKey: null,
          customerName: null,
          enableUserRemark: false,
          enableMerchantRemark: false,
          orderCreateTime: [],
          orderPaymentConfirmDate: null
        },
        param: {},
        storeList: [],
        orderTypeList: [],
        orderStatusList: [],
        orderSourceList: [],
        sysChannelList: [],
        orderPaymentStatusList: [],
        distributionList: []
      },
      batchOperateParams: {
        orderCodes: [],
        batchStatus: null
      },
      btns: {
        showBatchExport: false,
        showBatchExportLine: false,
        showBatchExportTask: false,
        showBatchOrderJoin: false,
        showBatchOrderDispatch: false,
        showBatchCancel: false,
        showBatchAuditPass: false,
        showBatchAuditNoPass: false,
        showMoreOperate: false,
        showBatchAddGivenProduct: false,
        showBatchDeleteGivenProduct: false,
        showBatchModifyMerchantRemark: false,
        showBatchReplaceProduct: false
      },
      showBatchBtn: false,
      pageParam: {
        limit: 10,
        page: 1,
        total: 0
      },
      tabs: [],
      showCustomer: false,
      copyOrderConfigList: [],
      assignCodeModalVisible: false,
      activeState: '0',
      loading: false,
      multiple: true,
      orderLabelMap: {},
      sysSourceMap: {},
      orderStatusCodes: {},
      orderLabelList: [],
      orderLabelMapClass: {
        focusOn: 'success',
        putOnHold: 'info',
        sos: 'danger',
        special: 'primary',
        vip: 'warning',
        changeGoods: 'danger',
        returnGoodsAndMoney: 'danger',
        returnMoney: 'danger'
      },
      checked: [],
      sendOutShow: false,
      soDetail: {},
      operates: {
        width: 120,
        fixed: 'right',
        list: [{
          label: this.$t('common_audit'),
          hidden: function(index, row) {
            return self.$portal.enableAppdflow('so', row.merchantId) || row.orderStatus !== 1040
          },
          method: (index, row) => {
            var vm = this
            vm.audit.form.orderCodes = []
            vm.audit.form.status = '2'
            vm.audit.form.orderCodes.push(row.orderCode)
            if (vm.audit.auditStatusList.length === 0) {
              vm.$oms.$api.common.selectCodes({ category: 'AUDIT_STATUS', '!code': '1' }).then((result) => {
                vm.audit.auditStatusList = result.data
                vm.audit.showDialog = true
              })
            } else {
              vm.audit.showDialog = true
            }
          },
          code: 'OmsOrderList_Audit'
        }, {
          label: this.$t('deliver1'),
          hidden: function(index, row) {
            return row.orderStatus !== 1050
          },
          method: (index, row) => {
            this.soDetail = row
            this.showSendOut()
          },
          code: 'OmsOrderList_Dispatch'
        }, {
          label: this.$t('do_cancel'),
          hidden: function(index, row) {
            return row.orderStatus !== 1010
          },
          method: (index, row) => {
            this.$confirm(this.$t('confirm') + this.$t('operation'), this.$t('prompt'), {
              confirmButtonText: this.$t('ok'),
              cancelButtonText: this.$t('cancel'),
              type: 'warning'
            }).then(() => {
              this.$oms.$api.so.soCancelOrder({ orderCode: row.orderCode, cancelSource: 1 }).then((res) => { // cancelSource为1表示后台取消
                if (res.code === '0') {
                  this.$message({
                    type: 'success',
                    message: this.$t('promptOperateSuccess')
                  })
                  this.listData()
                } else {
                  this.$message({
                    type: 'error',
                    message: res.message
                  })
                }
              })
            })
          },
          code: 'OmsOrderList_Cancel'
        }, {
          label: this.$t('复制'),
          hidden: (index, row) => {
            return this.showCopy(row.orderType, row.sysSource)
          },
          method: (index, row) => {
            this.$router.push({ name: 'OmsOrderCopy', params: { fromOrderCode: row.orderCode }})
          },
          code: 'OmsOrderList_Copy'
        }, {
          label: this.$t('上传收款凭证'),
          hidden: (index, row) => {
            return !((row.orderPaymentType === 2 || row.orderPaymentType === 7) &&
              row.orderPaymentStatus !== 3)
          },
          method: (index, row) => {
            this.offinePaymentModal.orderCode = row.orderCode
            this.offinePaymentModal.show = true
          },
          code: 'offinePaymentVoucherBut'
        }]
      },
      list: [],
      columns: [
        {
          show: true,
          prop: 'orderCode',
          label: this.$t('orderNumber'),
          minWidth: 200,
          render: (h, params) => {
            return (
              <ToOrderDetail orderCode={params.row.orderCode} orderSource={params.row.orderSource} sysSource={params.row.sysSource}>
                <span>{ params.row.orderCode }</span>
              </ToOrderDetail>
            )
          }
        },
        {
          show: true,
          prop: 'outOrderCode',
          label: this.$t('order_difference_channel_order_code'),
          minWidth: 200
        },
        {
          show: true,
          prop: 'orderLabel',
          label: this.$t('label'),
          align: 'center',
          render: (h, params) => {
            let labelArray
            if (params.row.orderLabel) {
              labelArray = params.row.orderLabel.split(',').map((item, index) => {
                const key = self.orderLabelMapClass[item]
                const value = self.orderLabelMap[item]
                return (
                  <el-tag type={key} size='mini'>
                    {value}
                  </el-tag>
                )
              })
              labelArray = <div>{ labelArray }</div>
            }

            return (
              <div>
                { labelArray }
              </div>
            )
          }
        },
        {
          show: true,
          prop: 'orderTypeStr',
          label: this.$t('订单类型'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'orderStatusStr',
          label: this.$t('order_status'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('Merchant'),
          align: 'center'
        },
        {
          show: true,
          prop: 'storeName',
          label: this.$t('Shop'),
          align: 'center'
        },
        {
          show: true,
          prop: 'buyerName',
          label: this.$t('buyer'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          label: this.$t('receipt_information'),
          align: 'center',
          tooltip: false,
          render: (h, params) => {
            if (params.row.goodReceiverName) {
              const nameLabel = params.row.customerId ? this.$t('经销商ID') : this.$t('会员ID')
              const id = params.row.customerId || params.row.userId
              const idInfo = (id) ? nameLabel + '：' + id : ''
              var self = this
              return (
                <span>
                  <el-tooltip effect='dark' placement='top'>
                    <div slot='content'>
                      <div>
                        <div>{ idInfo }</div>
                        <span>{ self.$t('consignee')}：</span>
                        <span>{params.row.goodReceiverName}</span>
                        <br />
                        <span>{ self.$t('cell_phone_number') }：</span>
                        <span>{params.row.goodReceiverMobile}</span>
                        <br />
                        <span>{ self.$t('common_addAddress') }：</span>
                        <span>{params.row.goodReceiverAddressAll}</span>
                      </div>
                    </div>
                    <i class='el-icon-user'></i>
                  </el-tooltip>
                  <sapn>{params.row.goodReceiverName}</sapn>
                </span>
              )
            } else {
              return ''
            }
          }

        },
        {
          show: true,
          prop: 'sysChannel',
          label: this.$t('渠道'),
          align: 'center',
          formatter: (row, column) => {
            return self.sysSourceMap[row.sysSource]
          }
        },

        {
          show: true,
          prop: 'orderRemarkUser',
          label: this.$t('manual_order_customer_remark'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'orderRemarkMerchant2user',
          label: this.$t('manual_order_merchant_remark'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          label: this.$t('orderAmount'),
          align: 'center',
          minWidth: 88,
          formatter: (row, column) => {
            const orderTotalAmount = (row.orderAmount || 0) + (row.taxAmount || 0) + (row.orderDeliveryFee || 0)
            return this.$options.filters['currency'](orderTotalAmount, '￥', 2)
          }
        },
        {
          show: true,
          label: this.$t('orderCreateTime'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column) => {
            if (row.orderCreateTime) {
              return this.$portal.parseTime(row.orderCreateTime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
            return ''
          }
        },
        {
          show: true,
          prop: 'errorRemark',
          label: this.$t('abnormal'),
          align: 'center',
          minWidth: 88
        }
      ],
      offinePaymentModal: {
        show: false,
        orderCode: null
      },
      visibleOfSoImportModal: false,
      audit: {
        showDialog: false,
        auditStatusList: [],
        form: {
          orderCodes: [],
          status: null,
          remark: null
        }
      },
      // 批量操作模态框
      backToAudit: {
        showDialog: false,
        form: {

        }
      },
      modifyMerchantRemark: {
        showDialog: false,
        submiting: false,
        form: {
          orderRemarkMerchant2user: null
        },
        rules: {
          orderRemarkMerchant2user: [{ required: true, message: this.$t('required'), trigger: 'change' }]
        }
      },
      replaceProduct: {
        showDialog: false,
        form: {

        }
      },
      addGivenProduct: {
        showDialog: false,
        form: {

        }
      },
      deleteGivenProduct: {
        showDialog: false,
        submiting: false,
        form: {
          code: null
        },
        message: null,
        rules: {
          code: [{ validator: this.validateProductCode, trigger: 'change' }]
        }
      },
      dialogVisible: false,
      importModelLogistics: {
        importApi: ['oms-web', 'redevImportPackage', 'importData', { type: 1 }],
        importLabel: this.$t('导入批量物流发货'),
        downloadLocalFile: [require('@/excelFile/importPackageTemplate.xlsx'), '无仓商品发货导入模板.xlsx'],
        pool: 'oms',
        taskType: 'soPackageImport',
        async: true
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.initData()
      this.initBtns()
      this._initOperaMerchant(this)
      this._listOrderTypeList(this)
      await this.initCodes()
      await this._listOrderStatusList(this)
      this._listDistribution(this)
      this.listData()
    },
    // 显示发货弹窗
    async showSendOut() {
      if (this.soDetail.orderType === 101 || this.soDetail.orderType === 106) {
        const result = await this.$oms.$api.so.allToDo({
          orderCode: this.soDetail.orderCode
        })
        if (result.data) {
          this.$alert(this.$t('订单商品已全部生成发货任务，请前往发货任务管理查看详细发货情况'), this.$t('promptSystemTips'))
          return
        }
      }
      this.sendOutShow = true
    },
    async onSuccess() {
      this.sendOutShow = false
      this.query()
    },
    cancelSendOut() {
      this.$refs.deliveryOperation.reset()
      this.soDetail = {}
      this.sendOutShow = false
    },
    handleOpen() {
      this.$refs.deliveryOperation.init()
    },
    soItemSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 3) {
        if (columnIndex === 0) {
          return [1, 5]
        } else {
          return [0, 0]
        }
      }
    },
    _getExportData() {
      return this._getQueryData()
    },
    _getQueryData() {
      if (this.search.data.orderCreateTime) {
        this.search.param.startOrderCreateTime = this.search.data.orderCreateTime[0]
        this.search.param.endOrderCreateTime = this.search.data.orderCreateTime[1]
      } else {
        delete this.search.param.startOrderCreateTime
        delete this.search.param.endOrderCreateTime
      }
      if (this.search.data.orderPaymentConfirmDate) {
        this.search.param.startOrderPaymentConfirmDate = this.search.data.orderPaymentConfirmDate[0]
        this.search.param.endOrderPaymentConfirmDate = this.search.data.orderPaymentConfirmDate[1]
      } else {
        delete this.search.param.startOrderPaymentConfirmDate
        delete this.search.param.endOrderPaymentConfirmDate
      }
      if (this.search.data.orderLogisticsTime) {
        this.search.param.startOrderLogisticsTime = this.search.data.orderLogisticsTime[0]
        this.search.param.endOrderLogisticsTime = this.search.data.orderLogisticsTime[1]
      } else {
        delete this.search.param.startOrderLogisticsTime
        delete this.search.param.endOrderLogisticsTime
      }

      if (this.search.data.searchValue) {
        if (this.search.data.searchKey === 'orderCode' || this.search.data.searchKey === 'outOrderCode') {
          this.search.param[this.search.data.searchKey] = []
          this.search.param[this.search.data.searchKey].push(this.search.data.searchValue)
        } else {
          this.search.param[this.search.data.searchKey] = this.search.data.searchValue
        }
        if (!this.search.data.lastSearchKey) {
          this.search.data.lastSearchKey = this.search.data.searchKey
        }
      } else {
        delete this.search.param[this.search.data.searchKey]
      }

      if (this.searchAssignOrderCode.length > 0) {
        if (!this.search.param['orderCode']) {
          this.search.param['orderCode'] = []
        }
        this.search.param['orderCode'] = this.search.param['orderCode'].concat(this.searchAssignOrderCode)
      }

      if (this.searchAssignOutOrderCode.length > 0) {
        if (!this.search.param['outOrderCode']) {
          this.search.param['outOrderCode'] = []
        }
        this.search.param['outOrderCode'] = this.search.param['outOrderCode'].concat(this.searchAssignOutOrderCode)
      }

      var queryArgs = {
        joinFields: ['errorRemark'],
        selectFields: [
          'id', 'orderCode', 'outOrderCode', 'orderType', 'merchantId', 'merchantName', 'storeId', 'storeName', 'userId', 'customerId', 'customerName', 'customerType',
          'goodReceiverName', 'goodReceiverMobile', 'goodReceiverCountry', 'goodReceiverProvince', 'goodReceiverCity', 'goodReceiverCounty', 'goodReceiverArea', 'goodReceiverAddress', 'orderPaymentType', 'orderPaymentStatus',
          'orderRemarkUser', 'orderRemarkMerchant2user', 'orderAmount', 'taxAmount', 'orderDeliveryFee', 'orderStatus', 'orderCreateTime', 'orderSource', 'sysSource', 'orderLabel', 'userName', 'userId', 'orderPromotionDiscount', 'orderPaidByCoupon'
        ]
      }
      queryArgs.filters = Object.assign({}, this.search.param)
      if (!this.search.data.enableUserRemark) {
        delete queryArgs.filters.orderRemarkUser
      }
      if (!this.search.data.enableMerchantRemark) {
        delete queryArgs.filters.orderRemarkMerchant2user
      }
      queryArgs.filters.isLeaf = 1
      return queryArgs
    },
    importOrder() {
      // 导入订单模态框
      this.visibleOfSoImportModal = true
    },
    handleImportSuccess(taskCode) {
      this.$alert(
        this.$t('importPromptInfoSuccess') +
          taskCode +
          this.$t('importPromptInfoConfirm'),
        this.$t('common_import'),
        {
          confirmButtonText: this.$t('common_confirm_search'),
          callback: action => {
            this.openOrderTaskList(taskCode)
          }
        }
      )
    },
    openOrderTaskList(taskCode) {
      this.$refs.importTaskBtn.openTask(taskCode)
    },
    submitAuditForm() {
      this.$refs['auditForm'].validate((valid) => {
        if (valid) {
          this.$oms.$api.soAudit.orderAuditByOrderCodesReview(this.audit.form).then((item) => {
            this.audit.showDialog = false
            this.listData()
          })
        }
      })
    },
    onBatchOrderJoin() {
      const vue = this
      if (vue.checked) {
        this.getOrderCodes(vue)
        vue.batchOperateParams.batchStatus = '0'
        this.$oms.$api.so.soBatchUpdate(vue.batchOperateParams).then((res) => {
          this.listData()
        })
      }
    },
    onBatchOrderDispatch() {

    },
    onBatchCancel() {
      const vue = this
      if (vue.checked) {
        this.getOrderCodes(vue)
        vue.batchOperateParams.batchStatus = '2'
        this.$oms.$api.so.soBatchUpdate(vue.batchOperateParams).then((res) => {
          this.listData()
        })
      }
    },
    onBatchAuditPass() {
      const vue = this
      if (vue.checked) {
        this.getOrderCodes(vue)
        vue.batchOperateParams.batchStatus = '3'
        this.$oms.$api.so.soBatchUpdate(vue.batchOperateParams).then((res) => {
          this.listData()
        })
      }
    },
    onBatchAuditNoPass() {
      const vue = this
      if (vue.checked) {
        this.getOrderCodes(vue)
        vue.batchOperateParams.batchStatus = '4'
        this.$oms.$api.so.soBatchUpdate(vue.batchOperateParams).then((res) => {
          this.listData()
        })
      }
    },
    onExpandItems(row) {
      if (!row.soItemList) {
        this.$oms.$api.soItem.orderSoItemListPage({
          page: 1,
          limit: 4,
          selectFields: [
            'id', 'productPicPath', 'productCname', 'productSaleType', 'productItemAmount', 'productItemNum', 'standard', 'extInfo', 'code'
          ],
          filters: {
            orderCode: row.orderCode
          }
        }).then((res) => {
          row.soItemList = res.data
        })
      }
    },
    getOrderCodes(vue) {
      vue.batchOperateParams.orderCodes = []
      for (let i = 0; i < vue.checked.length; i++) {
        vue.batchOperateParams.orderCodes.push(vue.checked[i].orderCode)
      }
    },
    handleTabLeave() {
      return !this.loading
    },
    async onTabClick() {
      var tab = this.tabs[this.activeState]
      this.search.param.orderStatus = tab.orderStatus
      for (var p in this.btns) {
        if (this.btns[p]) {
          this.btns[p] = false
        }
      }

      this.initBtns()
      this.listData()
    },
    onPageChange() {
      this.listData()
    },
    onSearchKeyChange() {
      this._cleanSearchValue()
      if (this.search.data.lastSearchKey) {
        delete this.search.param[this.search.data.lastSearchKey]
        console.log('delete ' + this.search.data.lastSearchKey, this.search.param[this.search.data.lastSearchKey])
      }
      this.search.data.lastSearchKey = this.search.data.searchKey
    },
    onRemarkChange(checked, key) {
      if (!checked) {
        this.search.param[key] = ''
      } else {
        if (!this.search.param[key]) {
          this.search.param[key] = ''
        }
      }
    },
    async query() {
      this.pageParam.page = 1
      await this.listData()
      await this._listOrderStatusList(this)
    },
    async exportOrderAndItem() {
      this.pageParam.page = 1
      var pageQueryArgs = Object.assign(this._getQueryData(), this.pageParam)
      // 是否查询全部带备注的订单
      if (this.search.data.enableUserRemark && pageQueryArgs.filters.orderRemarkUser === '') {
        pageQueryArgs.filters.orderRemarkUser = ' '
      }

      if (this.search.data.enableMerchantRemark && pageQueryArgs.filters.orderRemarkMerchant2user === '') {
        pageQueryArgs.filters.orderRemarkMerchant2user = ' '
      }
      this.$portal.downloadFileByPost(
        '/oms-web/order/exportDataOnline',
        { filters: JSON.stringify(pageQueryArgs.filters) }
      )
    },
    async assignQuery(queryParam) {
      const vue = this

      const queryArgs = vue._getQueryData()
      queryArgs.filters = {}
      queryArgs.filters.isLeaf = 1
      if (queryParam.type === '1') {
        if (queryParam.orderCodes) {
          queryArgs.filters.orderCode = queryParam.orderCodes
          vue.searchAssignOrderCode = queryParam.orderCodes
        } else {
          return
        }
      } else {
        if (queryParam.outOrderCodes) {
          queryArgs.filters.outOrderCode = queryParam.outOrderCodes
          vue.searchAssignOutOrderCode = queryParam.outOrderCodes
        } else {
          return
        }
      }
      this.pageParam.page = 1
      var pageQueryArgs = Object.assign(queryArgs, this.pageParam)

      // 指定订单查询，切回全部的tab
      this.activeState = '0'
      this.search.param.orderStatus = null
      for (var p in this.btns) {
        if (this.btns[p]) {
          this.btns[p] = false
        }
      }
      this.initBtns()

      await this.listData(pageQueryArgs)
      await this._listOrderStatusList(this, queryArgs)
    },
    async listData(args) {
      var pageQueryArgs = args || Object.assign(this._getQueryData(), this.pageParam)
      // 是否查询全部带备注的订单
      if (this.search.data.enableUserRemark && pageQueryArgs.filters.orderRemarkUser === '') {
        pageQueryArgs.filters.orderRemarkUser = ' '
      }

      if (this.search.data.enableMerchantRemark && pageQueryArgs.filters.orderRemarkMerchant2user === '') {
        pageQueryArgs.filters.orderRemarkMerchant2user = ' '
      }

      try {
        this.loading = true
        const result = await this.$oms.$api.so.listSoPage(pageQueryArgs)
        this.list = result.data || []
        this.list.forEach((item) => {
          item.orderStatus = parseInt(item.orderStatus)
          item.goodReceiverAddressAll = item.goodReceiverProvince + item.goodReceiverCity +
              item.goodReceiverArea + item.goodReceiverAddress
        })
        this.pageParam.total = result.total
        this.showBatchBtn = this.list.length > 0
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
        this.checked = []
        var tab = this.tabs[this.activeState]
        if (tab && tab.orderStatus) {
          tab.count = this.pageParam.total
        }
      }
      this.listLabel()
    },
    listLabel() {
      const vue = this
      if (vue.list) {
        const orderCodes = []
        vue.list.forEach(function(item) {
          orderCodes.push(item.orderCode)
        })

        if (orderCodes && orderCodes.length > 0) {
          vue.$oms.$api.soReturn.listReturnTypeWithoutClose({ orderCodes: orderCodes }).then(res => {
            if (res && res.code === '0') {
              if (res.data) {
                vue.list.forEach(function(item) {
                  const returnTypes = res.data[item.orderCode]
                  if (returnTypes && returnTypes.length > 0) {
                    returnTypes.forEach(function(returnType) {
                      if (returnType === 3) {
                        if (item.orderLabel) {
                          if (item.orderLabel.indexOf('returnGoodsAndMoney') < 0) {
                            item.orderLabel = item.orderLabel + ',' + 'returnGoodsAndMoney'
                          }
                        } else {
                          item.orderLabel = 'returnGoodsAndMoney'
                        }
                      } else if (returnType === 1 || returnType === 2) {
                        if (item.orderLabel) {
                          if (item.orderLabel.indexOf('returnMoney') < 0) {
                            item.orderLabel = item.orderLabel + ',' + 'returnMoney'
                          }
                        } else {
                          item.orderLabel = 'returnMoney'
                        }
                      } else if (returnType === 4) {
                        if (item.orderLabel) {
                          if (item.orderLabel.indexOf('changeGoods') < 0) {
                            item.orderLabel = item.orderLabel + ',' + 'changeGoods'
                          }
                        } else {
                          item.orderLabel = 'changeGoods'
                        }
                      }
                    })
                  }
                })
              }
            }
          })
        }
      }
    },
    initData() {
      this.search.param = {
        storeId: null,
        orderType: null,
        orderStatus: this.search.param.orderStatus,
        orderSource: null,
        customerId: null,
        orderPaymentStatus: null,
        orderDeliveryMethodId: null,
        requireInvoice: false,
        existReturn: false,
        stockOut: false,
        orderRemarkUser: '',
        orderRemarkMerchant2user: '',
        supplierName: null
      }
      this.search.data = {
        searchKey: 'orderCode',
        searchValue: '',
        lastSearchKey: null,
        customerName: null,
        enableUserRemark: false,
        enableMerchantRemark: false,
        orderCreateTime: [],
        orderPaymentConfirmDate: null
      }
      this.$refs.orderCreateTime.setDefault(7)
      // this.$refs.orderPaymentConfirmDate.setDefault(7)
      this.searchAssignOrderCode = []
      this.searchAssignOutOrderCode = []
      if (this.$refs['assginCode']) {
        this.$refs['assginCode'].handleClear()
      }
      this.$oms.$api.common.getStringValue({ key: 'copyOrderConfig', pool: 'oms' }).then(res => {
        this.copyOrderConfigList = JSON.parse(res.data)
      })
    },
    showCopy(orderType, sysSource) {
      if (this.copyOrderConfigList.length > 0) {
        const soTypes = this.copyOrderConfigList[0].soTypes
        const channelCodes = this.copyOrderConfigList[0].channelCodes
        if (soTypes.indexOf(orderType) > -1 && channelCodes.indexOf(sysSource) > -1) {
          return false
        } else {
          return true
        }
      }
    },
    initBtns() {
      this.showBatchBtn = false
      this.btns.showMoreOperate = false
      if (this.search.param.orderStatus === 1010) {
        this.btns.showBatchCancel = true
      } else if (this.search.param.orderStatus === 1030) {
        this.btns.showBatchOrderJoin = true
      } else if (this.search.param.orderStatus === 1040) {
        this.btns.showBatchAuditPass = true
        this.btns.showBatchAuditNoPass = true
      } else if (this.search.param.orderStatus === 1050) {
        // 功能尚未实现先隐藏
        // this.btns.showBatchOrderDispatch = true

      }
      this.btns.showBatchExport = true
      this.btns.showBatchExportLine = true
      this.btns.showBatchExportTask = true

      if (this.search.param.orderStatus === 1050) { // 待发货
        // 更多操作
        // 功能尚未实现先隐藏
        // this.btns.showMoreOperate = true
        // this.btns.showBatchBackToAudit = true
      }

      if (this.search.param.orderStatus && this.search.param.orderStatus <= 1040) { // 小于等于待审核
        // 功能尚未实现先隐藏
        this.btns.showBatchModifyMerchantRemark = true
        // this.btns.showBatchReplaceProduct = true
        // this.btns.showBatchAddGivenProduct = true
        this.btns.showBatchDeleteGivenProduct = true
        if (this.btns.showBatchModifyMerchantRemark || this.btns.showBatchDeleteGivenProduct) {
          this.btns.showMoreOperate = true
        }
      }
    },
    initCodes() {
      const vue = this
      vue.$oms.$api.common.listByCategorysForOrder({ categorys: ['ORDER_LABLE', 'ORDER_SOURCE', 'ORDER_PAYMENT_STATUS', 'ORDER_STATUS', 'SYS_CHANNEL'] }).then(res => {
        vue.orderLabelList = res.data.ORDER_LABLE
        vue.orderLabelList.push({
          'category': 'ORDER_LABLE',
          'code': 'returnGoodsAndMoney',
          'name': '退'
        })
        vue.orderLabelList.push({
          'category': 'ORDER_LABLE',
          'code': 'returnMoney',
          'name': '款'
        })
        vue.orderLabelList.push({
          'category': 'ORDER_LABLE',
          'code': 'changeGoods',
          'name': '换'
        })
        vue.search.orderSourceList = res.data.ORDER_SOURCE
        vue.search.sysChannelList = res.data.SYS_CHANNEL
        vue.sysSourceMap = vue.search.sysChannelList.reduce((m, i) => { m[i.code] = i.name; return m }, {})
        vue.search.orderPaymentStatusList = res.data.ORDER_PAYMENT_STATUS
        vue.orderLabelMap = vue.orderLabelList.reduce((m, i) => { m[i.code] = i.name; return m }, {})
        vue.orderStatusCodes = res.data.ORDER_STATUS.reduce((m, i) => { m[i.code] = i.name; return m }, {})
      })
    },
    _cleanSearchValue() {
      this.search.data.searchValue = ''
    },
    _initOperaMerchant() {
      this.$oms.$api.common.getUserMerchantInfo().then((res) => {
        this.platformId = res.data.platformId
        this.search.storeList = res.data.storeIds
      })
    },
    _listOrderTypeList(vm) {
      vm.$oms.$api.soType.soTypeList({}).then((result) => {
        vm.search.orderTypeList = result.data
      })
    },
    async _listOrderStatusList(vm, args) {
      var data = args || vm._getQueryData()
      delete data.filters.orderStatus
      return vm.$oms.$api.so.countByOrderStatus(data).then((result) => {
        vm.search.orderStatusList = result.data || []
        var arr = [{
          heading: this.$t('全部'),
          index: 0,
          orderStatus: null
        }]

        vm.search.orderStatusList.forEach((item, index) => {
          // item.code = parseInt(item.code)
          var statusName = vm.orderStatusCodes[item.code]
          arr.push({
            heading: statusName,
            count: item.count,
            orderStatus: item.code,
            index: index + 2
          })
        })
        vm.tabs = arr
      })
    },
    _listDistribution(vm) {
      vm.$oms.$api.distributionModeItem.distributionModeItemListForSelect({}).then((result) => {
        vm.search.distributionList = result.data
      })
    },
    showCustomerModal() {
      this.showCustomer = true
    },
    selectCustomer(data) {
      if (data) {
        this.search.param.customerId = data.customerId
        this.search.data.customerName = data.customerName
      }
    },
    handleCommand(command) {
      this[command]()
    },
    batchBackToAudit() {
      console.info('批量返回待审核模态框显示')
    },
    batchModifyMerchantRemark() {
      this.modifyMerchantRemark.form.orderRemarkMerchant2user = null
      this.modifyMerchantRemark.showDialog = true
      if (this.$refs['modifyMerchantRemarkForm']) {
        this.$refs['modifyMerchantRemarkForm'].resetFields()
      }
    },
    submitModifyMerchantRemarkForm(overwrite) {
      const vue = this
      this.$refs['modifyMerchantRemarkForm'].validate(valid => {
        vue.modifyMerchantRemark.submiting = true
        if (valid) {
          vue.getOrderCodes(vue)
          vue.batchOperateParams.batchStatus = overwrite ? '6' : '7'
          vue.batchOperateParams.orderRemarkMerchant2user = vue.modifyMerchantRemark.form.orderRemarkMerchant2user

          this.$oms.$api.so.soBatchUpdate(vue.batchOperateParams).then((res) => {
            if (res.data.success) {
              vue.modifyMerchantRemark.showDialog = false
              vue.$alert(vue.$t('batch_update_message', { totalCount: vue.batchOperateParams.orderCodes.length, successCount: res.data.successCount }), vue.$t('common_prompt'),
                {
                  confirmButtonText: vue.$t('common_close'),
                  type: 'success'
                })
              vue.listData()
            } else {
              vue.$message({
                type: 'error',
                message: res.data.message
              })
            }
          }).catch(result => {
            // vue.$message({
            //   type: 'error',
            //   message: result.message
            // })
          }).finally(res => {
            vue.modifyMerchantRemark.submiting = false
          })
        } else {
          vue.modifyMerchantRemark.submiting = false
        }
      })
    },
    batchReplaceProduct() {
      console.info('批量替换商品模态框显示')
    },
    batchAddGivenProduct() {
      console.info('批量添加赠品模态框显示')
    },
    batchDeleteGivenProduct() {
      this.deleteGivenProduct.form.code = null
      this.deleteGivenProduct.showDialog = true
      this.deleteGivenProduct.message = ''
      if (this.$refs['deleteGivenProductForm']) {
        this.$refs['deleteGivenProductForm'].resetFields()
      }
    },
    validateProductCode(rule, value, callback) {
      this.deleteGivenProduct.message = ''
      if (value) {
        return callback()
      }
      return callback(new Error(this.$t('required')))
    },
    submitDeleteGivenProductForm() {
      const vue = this
      this.deleteGivenProduct.message = ''
      this.$refs['deleteGivenProductForm'].validate(valid => {
        vue.deleteGivenProduct.submiting = true
        if (valid) {
          vue.getOrderCodes(vue)
          vue.batchOperateParams.batchStatus = '5'
          vue.batchOperateParams.productCode = vue.deleteGivenProduct.form.code

          this.$oms.$api.so.soBatchUpdate(vue.batchOperateParams).then((res) => {
            if (res.data.success) {
              vue.deleteGivenProduct.showDialog = false
              vue.$alert(vue.$t('batch_update_message', { totalCount: vue.batchOperateParams.orderCodes.length, successCount: res.data.successCount }), vue.$t('common_prompt'),
                {
                  confirmButtonText: vue.$t('common_close'),
                  type: 'success'
                })
              vue.listData()
            } else {
              vue.deleteGivenProduct.message = res.data.message
            }
          }).catch(result => {
            // vue.$message({
            //   type: 'error',
            //   message: result.message
            // })
          }).finally(res => {
            vue.deleteGivenProduct.submiting = false
          })
        } else {
          vue.deleteGivenProduct.submiting = false
        }
      })
    },
    uploadSuccess() {
      this.init()
    },
    batchDelivery() {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
  .product-name {
    width: 300px;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  /deep/ .bg-gray{
    tr, td{
      background-color: #f8f9fa;
      border-bottom: 0px;
    }
  }

  /deep/ .bg-gray::before{
    height: 0px;
  }

  .product-wrap{
    display: flex;
    align-items: center;
  }

  .hzf-oder-none-border td{
    border:none;
  }
  .hzf-oder-none-border {
    border: none;
  }
  .cp-list-table-area .table-wrap{
    margin-top: 14px;
  }
  .info_class{
    font-size: 14px;
    height: 20px;
    width: 20px;
    line-height: 20px;
    text-align: center;
    display: inline-block;
    color: #109FFF;
    border: 1px solid #19A3FF;
    border-radius: 12px;
    margin-left: 10px;
    cursor: default;
  }
  .cp-date-range-picker .data-time-name .el-button{
    line-height: 32px;
    height: 32px;
  }
  .mgB12{
    margin-bottom: 12px;
  }
  .red {
    color: red
  }
  .btn-right{
    margin-right: 14px;
  }
</style>
