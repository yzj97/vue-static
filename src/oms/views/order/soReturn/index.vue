<template>
  <section id="orderSalesList">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="demo-form-inline">
          <ody-search-item prop="data.searchKey">
            <span slot="label">
              <el-select v-model="search.data.searchKey" :clearable="false" name="search_data_searchKey" @change="onSearchKeyChange">
                <el-option :label="$t('order_sales_code')" value="returnCode">{{ $t('order_sales_code') }}</el-option>
                <el-option :label="$t('order_code')" value="orderCode">{{ $t('order_code') }}</el-option>
                <el-option :label="$t('outOrderCode')" value="outOrderCode">{{ $t('outOrderCode') }}</el-option>
                <el-option :label="$t('manual_order_receiver_name')" value="goodReceiverName">{{ $t('manual_order_receiver_name') }}</el-option>
                <el-option :label="$t('outReturnCode')" value="outReturnCode">{{ $t('outReturnCode') }}</el-option>
              </el-select>
            </span>
            <el-input v-model="search.data.searchValue" name="search_data_searchValue"/>
          </ody-search-item>

          <ody-search-item :label="$t('so_return_type') + ':'" prop="param.type">
            <el-select v-model="search.param.type" name="search_param_type">
              <el-option :value="null" :label="$t('common_all')"/>
              <el-option v-for="item in enumTypes.RETURN_TYPE" :label="item.name" :key="item.code" :value="item.code" />
            </el-select>
          </ody-search-item>

          <ody-search-item :label="$t('cell_phone_number_of_the_consignee') + ':'" prop="param.goodReceiverMobile">
            <el-input v-model="search.param.goodReceiverMobile" name="search_param_goodReceiverMobile" />
          </ody-search-item>

          <ody-search-item :label="$t('apply_create_time') + ':'" :space="2" prop="createTime">
            <ody-date-range-picker
              ref="createTime"
              v-model="createTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              :default="7"
              name="createTime"
              type="datetimer"/>
          </ody-search-item>

          <ody-search-item :label="$t('shop') + ':'" prop="param.storeId">
            <el-select v-model="search.param.storeId" :popper-append-to-body="false" name="search_param_storeId">
              <el-option :value="null" :label="$t('common_all')"/>
              <el-option v-for="(key, value) in search.data.storeList" :label="key" :key="key" :value="value" />
            </el-select>
          </ody-search-item>

          <ody-search-item :label="$t('return_status') + ':'" prop="param.sendBackStatus">
            <el-select v-model="search.param.sendBackStatus" :placeholder="$t('common_all')" name="search_param_sendBackStatus">
              <el-option :value="null" :label="$t('common_all')"/>
              <el-option v-for="item in enumTypes.SEND_BACK_STATUS" :label="item.name" :key="item.code" :value="item.code" />
            </el-select>
          </ody-search-item>

          <ody-search-item :label="$t('return_logistics_num') + ':'" prop="param.courierNumber">
            <el-input v-model="search.param.courierNumber" name="search_param_courierNumber" maxlength="25"/>
          </ody-search-item>

          <ody-search-item :label="$t('customerName') + ':'" prop="data.customerName">
            <el-input v-model="search.data.customerName" :placeholder="$t('pleaseSelect')" name="search_data_customerName" readonly="true" @click.native="showCustomerModal" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <ody-button name="OmsOrderSalesList_Reset_handleSearchReset" code="OmsOrderSalesList_Reset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</ody-button>
        <ody-button name="OmsOrderSalesList_Query_handleSearchSubmit" code="OmsOrderSalesList_Query" size="small" type="primary" @click="handleSearchSubmit">{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="activeState" name="activeState" @tab-click="onTabClick" >
          <el-tab-pane v-for="tab in tabs" :key="tab.index">
            <span slot="label">{{ tab.heading }} <span v-show="tab.count > 0" class="error">({{ tab.count }})</span></span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="table">
        <div slot="btn-bottom" style="margin-bottom:20px;">
          <el-row>
            <ody-button v-show="showBatchBtn && btns.showBatchAuditPass" :disabled="checked.length === 0" name="OmsOrderSalesList_Audit_onBatchAudit" code="OmsOrderSalesList_Audit" size="small" class="btn-right" @click="onBatchAudit(1)">{{ $t('batch_agree') }}</ody-button>
            <ody-button v-show="showBatchBtn && btns.showBatchAuditNoPass" :disabled="checked.length === 0" name="OmsOrderSalesList_Audit_onBatchAudit6" code="OmsOrderSalesList_Audit" size="small" class="btn-right" @click="onBatchAudit(2)">{{ $t('batch_refuse') }}</ody-button>
            <ody-button v-show="showBatchBtn && btns.showBatchCheckGoodsPass" :disabled="checked.length === 0" name="OmsOrderSalesList_Check_Goods_onBatchCheckGoods" code="OmsOrderSalesList_Check_Goods" size="small" class="btn-right" @click="onBatchCheckGoods(1)">{{ $t('batch_agree') }}</ody-button>
            <ody-button v-show="showBatchBtn && btns.showBatchCheckGoodsNoPass" :disabled="checked.length === 0" name="OmsOrderSalesList_Check_Goods_onBatchCheckGoods6" code="OmsOrderSalesList_Check_Goods" size="small" class="btn-right" @click="onBatchCheckGoods(2)">{{ $t('batch_refuse') }}</ody-button>
            <!-- <ody-button name="OmsOrderSalesList_Export_exportReturnList" code="OmsOrderSalesList_Export" size="small" @click="exportReturnList">{{ $t('exportReturnList') }}</ody-button>
            <ody-button name="OmsOrderSalesList_Task_seeTask" code="OmsOrderSalesList_Task" size="small" @click="seeTask">{{ $t('seeTask') }}</ody-button>-->
            <ody-batch-export-button
              :get-export-data="exportModel.getExportData"
              :export-api="exportModel.exportApi"
              :async="exportModel.async"
              :pool="exportModel.pool"
              :task-type="exportModel.taskType"
              name="OmsOrderSalesList_Export_exportReturnList"
              code="OmsOrderSalesList_Export"
              size="small"
              class="btn-right"
            >{{ $t('exportReturnList') }}</ody-batch-export-button>
            <ody-export-task-button
              pool="oms"
              task-type="soReturnExport"
              name="OmsOrderSalesList_Task_seeTask"
              code="OmsOrderSalesList_Task"
              size="small"
              class="btn-right"
            >{{ $t('seeTask') }}</ody-export-task-button>
          </el-row>
        </div>
        <ody-table
          :loading="loading"
          :data="dataList"
          :columns="columns"
          :operates="operates"
          :multiple="multiple"
          :checked.sync="checked"
          :default-expand-all="false"
          :expand="true"
          name="dataList570"
          @expand-change="onExpandItems">
          <template slot="expand" slot-scope="props">
            <el-table
              :data="props.row.soReturnItemList"
              :show-header="false"
              :span-method="soReturnItemSpanMethod"
              name="props_row_soReturnItemList964"
              class="bg-gray"
              style="width: 60%">
              <el-table-column>
                <template slot-scope="scope">
                  <router-link v-if="scope.$index === 3" :to="{name: 'OmsOrderSalesListManagementDetail', params: {id:scope.row.id}}" class="link-type">
                    <span>{{ $t('see_more_product') }}</span>
                  </router-link>
                  <div v-else>
                    <el-row>
                      <el-image
                        :src="scope.row.productPicPath"
                        :fit="cover"
                        style="width: 70px; height: 70px; vertical-align: middle;"/>
                      <span>{{ scope.row.productCname }}</span>
                    </el-row>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="code"
                width="180"/>
              <el-table-column
                prop="extInfoStr"/>
              <el-table-column>
                <template slot-scope="scope">
                  {{ scope.row.applyReturnAmount === null ? 0.00 : scope.row.applyReturnAmount | currency('',2) }}
                </template>
              </el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  x{{ scope.row.returnProductItemNum }}
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template slot="applyReturnAmount" slot-scope="scope">
            {{ scope.row.applyReturnAmount | currency }}
          </template>
          <template slot="actualReturnAmount" slot-scope="scope">
            {{ getActualReturnAmount(scope.row) | currency }}
          </template>
        </ody-table>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="pageParam.page"
          :list="dataList"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="pageParam.limit"
          :total.sync="pageParam.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSearchSubmit"
          @current-change="onPageChange"/>

      </div>
    </ody-list-table-area>
    <OrderCustomerModal :visible.sync="showCustomer" @ok="selectCustomer" />
    <soExportTask
      :visible.sync="visibleOfTask"
      :code="exportCode"
      task-type="4"
      @close="closeExportTask"/>

    <!-- 弹出框，审核/验货 -->
    <ody-dialog
      v-if="dialogData.visible"
      :title="dialogData.title"
      :visible.sync="dialogData.visible"
      :width="(dialogData.returnType == 3 || dialogData.returnType == 4) && dialogData.isAgreed && dialogData.type == 1 ? '50%' : '500px'"
      lock-scroll="true"
      center
      @close="handleHideDialg"
      @confirm-dialog="dialogData.visible = false">
      <div slot="content">
        <el-row v-if="dialogData.isAgreed && dialogData.type == 1 && (dialogData.returnType == 3 || dialogData.returnType == 4)">
          <el-col :span="6" align="right">
            <ody-tip-star :content="$t('is_need_return_goods')" />
          </el-col>
          <el-radio-group v-model="dialogData.isPickUp" name="dialogData_isPickUp">
            <el-radio :label="1">{{ $t('yes') }}</el-radio>
            <el-radio :label="0">{{ $t('no') }}</el-radio>
          </el-radio-group>
        </el-row>
        <br>
        <!--- 仅退款已发货，收货地址 -->
        <el-row v-if="(dialogData.returnType == 3 || dialogData.returnType == 4) && dialogData.isAgreed && dialogData.type == 1 && dialogData.isPickUp === 1" class="row_class">
          <el-card v-loading="dialogData.addreLoading" shadow="never" style="margin: auto">
            <el-row v-if="showWarehouse && (warehouseList != null && warehouseList.length > 0)" class="row_class">
              <el-col :span="6" align="right">
                <ody-tip-star :content="$t('退货仓库：')" />
              </el-col>
              <el-col :span="14">
                <el-select v-model="consigneeWarehouseId" :clearable="false" :placeholder="$t('请选择')" name="consigneeWarehouseId" @change="changeWarehouseAddress()">
                  <el-option
                    v-for="item in warehouseList"
                    :key="item.id"
                    :label="item.warehouseName"
                    :value="item.id"/>
                </el-select>
              </el-col>
            </el-row>
            <el-row class="row_class">
              <el-col :span="6" align="right"><ody-tip-star :content="$t('收货人：')" /></el-col>
              <el-col :span="14">
                <el-input v-model="dialogData.addreObj.consigneeName" name="dialogData_addreObj_consigneeName" />
              </el-col>
            </el-row>
            <el-row class="row_class">
              <el-col :span="6" align="right"><ody-tip-star :content="$t('收货人手机：')" /></el-col>
              <el-col :span="14">
                <el-input v-model="dialogData.addreObj.consigneeMobile" name="dialogData_addreObj_consigneeMobile" />
              </el-col>
            </el-row>
            <el-row class="row_class">
              <el-col :span="6" align="right"><ody-tip-star :content="$t('退货地址：')" /></el-col>
              <el-col :span="14">
                <el-row>
                  <el-col :span="7">
                    <el-select id="s_province" v-model="dialogData.addreObj.provinceCode" name="s_province" @change="queryAera(dialogData.addreObj.provinceCode, 2)" >
                      <el-option :label="$t('please_choose')" />
                      <el-option v-for="item in provinces" :label="item.name" :key="item.code" :value="item.code" />
                    </el-select>
                  </el-col>
                  <el-col :span="7">
                    <el-select id="s_city" v-model="dialogData.addreObj.cityCode" name="s_city" @change="queryAera(dialogData.addreObj.cityCode, 3)" >
                      <el-option :label="$t('please_choose')" />
                      <el-option v-for="item in citys" :label="item.name" :key="item.code" :value="item.code" />
                    </el-select>
                  </el-col>
                  <el-col :span="7">
                    <el-select id="s_area" v-model="dialogData.addreObj.regionCode" name="s_area" >
                      <el-option :label="$t('please_choose')" />
                      <el-option v-for="item in regions" :label="item.name" :key="item.code" :value="item.code" />
                    </el-select>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row class="row_class">
              <el-col :span="6" align="right"><ody-tip-star :content="$t('详细地址：')" /></el-col>
              <el-col :span="14">
                <el-input v-model="dialogData.addreObj.detailAddress" name="dialogData_addreObj_detailAddress" />
              </el-col>
            </el-row>
          </el-card>
        </el-row>
        <el-row v-if="dialogData.isAgreed && dialogData.type == 1 &&(dialogData.returnType == 3 || dialogData.returnType == 2)">
          <el-col :span="6" align="right">
            <ody-tip-star :content="$t('return_freight')" />
          </el-col>
          <el-radio-group v-model="dialogData.isReturnFreight" name="dialogData_isReturnFreight">
            <el-radio :label="1">{{ $t('yes') }}</el-radio>
            <el-radio :label="0" >{{ $t('no') }}</el-radio>
          </el-radio-group>
        </el-row>
        <br>
        <el-row v-if="dialogData.isAgreed && (dialogData.type == 1 || dialogData.type == 2) && dialogData.returnType != 4" class="row_class">
          <el-col :span="6" align="right">申请退款金额：</el-col>
          <el-col :span="14">
            <span>¥{{ dialogData.sumApplyReturnAmount | currency }}</span>
          </el-col>
        </el-row>
        <!--- 仅退款已发货 / 退货退款 / 换货，补偿金额 -->
        <el-row v-if="(dialogData.returnType == 2 || dialogData.returnType == 3 || dialogData.returnType == 4) && dialogData.isAgreed && dialogData.type == 1" class="row_class">
          <el-col :span="6" align="right">补偿金额：</el-col>
          <el-col :span="14">
            <ody-input-number
              :decimal="2"
              v-model="dialogData.compensatoryAmount"
              :min="0"
              :empty-tip="false"
              name="dialogData_compensatoryAmount"
              @input="compensatoryAmountChange"/>
          </el-col>
        </el-row>
        <el-row v-if="dialogData.isAgreed && (dialogData.type == 1 || dialogData.type == 2) && dialogData.returnType != 4" class="row_class">
          <el-col :span="6" align="right">退款金额合计：</el-col>
          <el-col :span="14">
            <span>¥{{ returnCount | currency }}</span>
          </el-col>
        </el-row>
        <!--<el-row v-if="!dialogData.isAgreed && dialogData.type == 2" class="row_class">
          <el-col :span="8" align="right">拒绝原因：</el-col>
          <el-col :span="16">
            <select>
              <option>{{$t('验货不通过')}}</option>
            </select>
          </el-col>
        </el-row>-->
        <!-- 拼多多验货，需要物流 --->
        <el-row v-if="dialogData.type === 2 && dialogData.sysSource === '210010'" class="row_class">
          <el-col :span="6" align="right">
            <ody-tip-star content="物流单号：" />
          </el-col>
          <el-col :span="14">
            <el-input v-model="dialogData.courierNumber" name="dialogData_courierNumber" placeholder="物流/快递单号"/>
          </el-col>
        </el-row>
        <!-- 拼多多验货，需要物流 --->
        <el-row v-if="dialogData.type === 2 && dialogData.sysSource === '210010'" class="row_class">
          <el-col :span="6" align="right">
            <ody-tip-star content="物流公司：" />
          </el-col>
          <el-col :span="14">
            <el-select v-model="dialogData.logisticsCompanyId" name="dialogData_logisticsCompanyId">
              <el-option
                v-for="item in pddLogisticsCompanies"
                :key="item.id"
                :label="item.logisticsCompany"
                :value="item.id"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row v-if="dialogData.type === 1 || dialogData.type === 2" class="row_class">
          <el-col :span="6" align="right">
            <ody-tip-star :content="$t('备注：')" />
          </el-col>
          <el-col :span="14">
            <el-input v-model="dialogData.remake" :placeholder="$t('必填，最高200字')" name="dialogData_remake" type="textarea" maxlength="200" rows="2"/>
          </el-col>
        </el-row>
        <el-row v-if="dialogData.type === 3" class="row_class">
          <el-col :span="6" align="right">
            <ody-tip-star :content="$t('天猫验证码：')" />
          </el-col>
          <el-col :span="14">
            <el-input v-model="dialogData.tmallCode" :placeholder="$t('必填，最高10字')" name="dialogData_tmallCode" type="input" maxlength="10"/>
          </el-col>
        </el-row>
        <el-row v-if="dialogData.type === 1 || dialogData.type === 2" class="row_class">
          <el-col :span="6" align="right">附件：</el-col>
          <el-col :span="14">
            <ody-upload-image :limit="3" :file-list.sync="dialogData.files" :pic-type="['png','jpg','gif']" />
          </el-col>
        </el-row>
      </div>
      <div slot="footer">
        <el-button name="handleHideDialg" size="small" @click="handleHideDialg">{{ $t('取消') }}</el-button>
        <ody-button name="OmsOrderSalesListConfirm_doConfirm" type="primary" size="small" code="OmsOrderSalesListConfirm" @click="doConfirm">{{ $t('确认') }}</ody-button>
      </div>
    </ody-dialog>
  </section>
</template>

<script>
import soExportTask from '@/components/soExportTask'
import OrderCustomerModal from '@/components/orderCustomerModal'
import soUtils from '@/utils/soUtils'

export default {
  name: 'OmsOrderSalesListManagement',
  components: {
    soExportTask,
    OrderCustomerModal
  },
  data() {
    const vue = this
    return {
      exportModel: {
        exportApi: ['oms-web', 'soReturn', 'exportData'],
        pool: 'oms',
        taskType: 'soReturnExport',
        async: true,
        getExportData: () => {
          return { filters: vue.getQueryArgs().filters }
        }
      },
      visibleOfTask: false,
      exportCode: null,
      storeAddressList: [],
      provinces: [],
      warehouseList: [],
      storeSettings: [],
      citys: [],
      regions: [],
      storeAddressData: [],
      showWarehouse: true,
      showCustomer: false,
      enumTypes: {},
      platformMerchantList: [],
      search: {
        data: {
          searchKey: 'returnCode',
          searchValue: '',
          storeList: [],
          tabList: []
        },
        param: {}
      },
      pddLogisticsCompanies: [],
      dialogData: this.getDialogData(),
      searchForm: {
        courierNumber: null,
        goods_return_type: '',
        returnStatus: '',
        sendBackStatus: '',
        createTime: null,
        type: '',
        storeId: null,
        sort: 'desc'
      },
      batchOperateParams: {
        returnStatus: null,
        soReturnDTOS: []
      },
      btns: {
        showBatchAuditPass: false,
        showBatchAuditNoPass: false,
        showBatchCheckGoodsPass: false,
        showBatchCheckGoodsNoPass: false
      },
      showBatchBtn: false,
      pageParam: {
        limit: 10,
        page: 1,
        total: 0
      },
      tabs: [{
        heading: this.$t('common_all'),
        index: 0,
        returnStatus: null
      }],
      multiple: true,
      activeState: '0',
      createTime: null,
      dataList: [],
      checked: [],
      loading: false,
      soReturnItemList: [],
      columns: [
        {
          show: true,
          prop: 'returnCode',
          label: this.$t('order_sales_code'),
          align: 'left',
          minWidth: 200,
          render: (h, item) => {
            return h('a', {
              style: {
                color: '#1890FF'
              },
              attrs: {
                'data-rowId': item.row.id,
                'data-id': item.row.id
              },
              on: {
                click: this.seeReturnOrder
              },
              domProps: {
                innerHTML: item.row.returnCode
              }
            })
          }
        }, {
          show: true,
          prop: 'typeStr',
          label: this.$t('so_return_type'),
          align: 'left'
        }, {
          show: true,
          slot: 'applyReturnAmount',
          label: this.$t('after_sale_amount'), // 售后金额
          align: 'right'
        }, {
          show: true,
          prop: 'returnStatusStr',
          label: this.$t('order_sales_status'),
          align: 'left'
        }, {
          show: true,
          prop: 'triggerAfterMinutes',
          label: this.$t('order_sales_countdown'),
          render: (h, res) => {
            return (
              <span style='color:red;'>{ this.countDown(res.row) }</span>
            )
          },
          minWidth: 200
        }, {
          show: true,
          // sort: true,
          prop: 'createTime',
          label: this.$t('apply_create_time'),
          align: 'center',
          minWidth: 200
        }, {
          show: true,
          prop: 'auditTime',
          label: this.$t('orderAuditTime'),
          align: 'center',
          minWidth: 200
        }, {
          show: true,
          slot: 'actualReturnAmount',
          label: this.$t('actual_refund_amount')
        }, {
          show: true,
          prop: 'refundStatus', // 退款状态
          label: this.$t('refund_status'),
          align: 'center',
          minWidth: 150,
          formatter: (row, column, cellValue) => {
            if (vue.enumTypes && vue.enumTypes.REFUND_STATUS) {
              const l = vue.enumTypes.REFUND_STATUS.filter(i => i.code === '' + row.refundStatus)
              if (l && l.length > 0) {
                return l[0].name
              }
            }
            return ''
          }
        }, {
          show: true,
          prop: 'refundTime', // 退款时间
          label: this.$t('refundTime')
        }, {
          show: true,
          prop: 'orderCode',
          label: this.$t('order_code'),
          align: 'left',
          minWidth: 200,
          render: (h, item) => {
            return h('a', {
              style: {
                color: '#1890FF'
              },
              attrs: {
                'data-rowId': item.row.id,
                'data-order-code': item.row.orderCode
              },
              on: {
                click: () => { this.seeOrder(h, item) }
              },
              domProps: {
                innerHTML: item.row.orderCode
              }
            })
          }
        }, {
          show: true,
          prop: 'outOrderCode',
          label: this.$t('outOrderCode'),
          minWidth: 200
        },
        {
          show: true,
          prop: 'outReturnCode',
          label: this.$t('outReturnCode'),
          minWidth: 200
        }, {
          show: true,
          prop: 'storeName',
          label: this.$t('order_shop'),
          align: 'left'
        }, {
          show: true,
          prop: 'buyerName',
          label: this.$t('buyer')
        }, {
          show: true,
          prop: 'goodReceiverName',
          label: this.$t('receipt_information'),
          tooltip: false,
          render: (h, params) => {
            if (params.row.goodReceiverName) {
              var showFields = ['goodReceiverCountry', 'goodReceiverProvince', 'goodReceiverCity', 'goodReceiverCounty', 'goodReceiverArea', 'goodReceiverAddress']
              let txt = ''
              showFields.forEach(function(item) {
                if (params.row[item]) {
                  txt += params.row[item]
                }
              })
              return (
                <span>
                  <el-tooltip placement='top' class='item' effect='dark'>
                    <div slot='content'>
                      {params.row.goodReceiverName}<br/>
                      {params.row.goodReceiverMobile}<br/>
                      {txt}
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
          prop: 'serviceDesc',
          label: this.$t('备注')
        }
      ],
      operates: {
        fixed: 'right',
        list: [
          {
            label: this.$t('agree'), // 同意
            method(index, row) {
              vue.showDialogData('同意', row.type, true, row.soReturnItemList, row.storeId, row.merchantId, row.id, row.orderCode, row.actualReturnAmount, 1, row.applyReturnAmount, row.serviceDesc)
            },
            hidden: (index, row) => {
              if (row.returnStatus === 4000 && !row.outReturnCode) {
                return false
              } else {
                return true
              }
            },
            code: 'OmsOrderSalesList_Audit'
          }, {
            label: this.$t('audit_refuse'), // 拒绝
            method(index, row) {
              vue.showDialogData('拒绝', row.type, false, row.soReturnItemList, row.storeId, row.merchantId, row.id, row.orderCode, row.actualReturnAmount, 1, null, row.serviceDesc)
            },
            hidden: (index, row) => {
              if (row.returnStatus === 4000 && !row.outReturnCode) {
                return false
              } else {
                return true
              }
            },
            code: 'OmsOrderSalesList_Audit'
          }, {
            label: this.$t('inspectionPass'), // 验货通过并退款 oms.check_pass_and_refund
            method(index, row) {
              vue.dialogData.sysSource = row.sysSource
              vue.showDialogData((row.type === 4 ? '验货通过' : '验货通过并退款'), row.type, true, row.soReturnItemList, row.storeId, row.merchantId, row.id, row.orderCode, null, 2, row.applyReturnAmount, row.serviceDesc)
            },
            hidden: (index, row) => {
              if ((row.type === 3 || row.type === 4) && row.returnStatus === 4030 && !row.outReturnCode) {
                return false
              } else {
                return true
              }
            },
            code: 'OmsOrderSalesList_Check_Goods'
          }, {
            label: this.$t('inspectionFailed'), // 拒绝退款 oms.refusal_of_refund
            method(index, row) {
              vue.showDialogData((row.type === 4 ? '验货不通过' : '拒绝退款'), row.type, false, row.soReturnItemList, row.storeId, row.merchantId, row.id, row.orderCode, null, 2, null, row.serviceDesc)
            },
            hidden: (index, row) => {
              if ((row.type === 3 || row.type === 4) && row.returnStatus === 4030 && !row.outReturnCode) {
                return false
              } else {
                return true
              }
            },
            code: 'OmsOrderSalesList_Check_Goods'
          }, {
            label: this.$t('tmallRefundCode'), // 天猫退款验证码 oms.tmallRefund
            method(index, row) {
              vue.showDialogData('天猫验证码', row.type, false, row.soReturnItemList, row.storeId, row.merchantId, row.id, row.orderCode, null, 3, row.serviceDesc)
            },
            hidden: (index, row) => {
              if (row.sysSource === '210001' && (row.returnStatus === 4010 || row.returnStatus === 4040 || row.returnStatus === 4099) && !row.outReturnCode) {
                return false
              } else {
                return true
              }
            },
            code: 'OmsOrderSalesList_Audit'
          },
          {
            label: this.$t('拼多多验货'),
            method(index, row) {
              vue.loadLogisticsCompanies(row.id)
              vue.dialogData.sysSource = row.sysSource
              vue.showDialogData('拼多多验货', row.type, true, row.soReturnItemList, row.storeId, row.merchantId, row.id, row.orderCode, null, 2, row.applyReturnAmount, row.serviceDesc)
            },
            hidden: (index, row) => {
              if (row.sysSource === '210010' && row.type === 3 && (row.returnStatus === 4000 || row.returnStatus === 4010 || row.returnStatus === 4030)) {
                return false
              } else {
                return true
              }
            },
            code: 'OmsOrderSalesList_Check_Goods'
          }
        ]
      },
      current: 1,
      size: 10,
      tatal: 0
    }
  },
  computed: {
    returnCount() {
      return Number(this.dialogData.sumApplyReturnAmount) + Number(this.dialogData.compensatoryAmount)
    }
  },
  created() {
    this.initStartCreateTime()
    this.init()
  },
  methods: {
    getActualReturnAmount(row) {
      return Number(row.actualReturnAmount) + Number(row.freight)
    },
    getDialogData() {
      return {
        title: '', // 标题
        type: 1, // 1 审核，2验收
        returnType: 0,
        visible: false,
        addreVisible: false,
        editVisible: false,
        isAgreed: false, // 同意/拒绝
        files: [], // 附件
        compensatoryAmount: null, // 补偿金额
        sumApplyReturnAmount: null, // 退款金额
        remake: null, // 备注
        addreObj: {
          provinceCode: null,
          cityCode: null,
          regionCode: null,
          consigneeName: null,
          consigneeMobile: null,
          detailAddress: null
        },
        sysSource: null,
        courierNumber: null,
        logisticsCompanyId: null,
        addreLoading: false,
        consigneeName: null, // 商家收件人
        consigneeMobile: null, // 联系人手机
        consigneeAddress: null, // 商家收件地址
        consigneeWarehouseId: null,
        isPickUp: null,
        isReturnFreight: 0, // 默认不退运费
        id: null, // 售后编号
        orderCode: null, // 订单编号
        serviceDesc: null // 备注信息
      }
    },
    showDialogData(title, returnType, isAgreed, soReturnItemList, storeId, merchantId, id, orderCode, actualReturnAmount, dialogType, applyReturnAmount, serviceDesc) {
      this.dialogData.title = title
      this.dialogData.returnType = returnType
      this.dialogData.type = dialogType
      this.dialogData.isAgreed = isAgreed
      this.dialogData.visible = true
      this.dialogData.id = id
      this.dialogData.orderCode = orderCode
      this.dialogData.actualReturnAmount = actualReturnAmount
      this.dialogData.sumApplyReturnAmount = applyReturnAmount
      this.dialogData.serviceDesc = serviceDesc
      if (returnType === 3 || returnType === 4) {
        this.consigneeWarehouseId = null
        this.dialogData.isPickUp = 1 // 退货退款默认退回商品
        this.initStoreAddressList(storeId)
        // eslint-disable-next-line no-unused-vars
        const storeaddress = this.$oms.$api.common.queryStoreSetting({
          orgId: storeId
        })
        // eslint-disable-next-line no-unused-vars
        const stroeWarehouse = this.$oms.$api.common.listStoreWarehouse({
          merchantId: merchantId
        })
        Promise.all([storeaddress, stroeWarehouse]).then(resp => {
          this.storeSettings = resp[0].data
          this.warehouseList = resp[1].data
          if (resp[0].data != null) {
            const resultData = resp[0].data
            if (resultData.warehouseId && this.warehouseList) {
              const list = this.warehouseList.filter(w => w.warehouseCode === resultData.warehouseId)
              this.consigneeWarehouseId = list && list.length > 0 ? list[0].id : null
            }
            if (resultData.backFlag === 1) {
              // 按地址退回
              this.showWarehouse = false
              if (resultData.orgId != null) {
                this.$oms.$api.common.queryStoreAddressList({
                  storeId: resultData.orgId
                }).then(resp => {
                  if (resp.data != null && resp.data.length > 0) {
                    this.storeAddressData = resp.data
                    this.dialogData.addreObj.provinceCode = this.storeAddressData[0].provinceCode
                    this.dialogData.addreObj.cityCode = this.storeAddressData[0].cityCode
                    this.dialogData.addreObj.regionCode = this.storeAddressData[0].regionCode
                    this.dialogData.addreObj.consigneeName = this.storeAddressData[0].contactPerson
                    this.dialogData.addreObj.consigneeMobile = this.storeAddressData[0].contactTelephone
                    this.dialogData.addreObj.detailAddress = this.storeAddressData[0].detailAddress
                    this.getAddressData(this.dialogData.addreObj.provinceCode, this.dialogData.addreObj.cityCode, this.dialogData.addreObj.regionCode)
                  }
                })
              }
            } else {
              // 按仓库退回
              this.showWarehouse = true
              this.changeWarehouseAddress()
            }
          }
        })
        this.initReturnAddress()
      }
    },
    initStoreAddressList(storeId) {
      if (storeId != null) {
        this.$oms.$api.common.queryStoreAddressList({
          storeId: storeId
        }).then(resp => {
          if (resp.data && resp.data.length > 0) {
            for (var i in resp.data) {
              if (resp.data[i].addressType === 1) {
                this.storeAddressList.push(resp.data[i])
              }
            }
          }
        })
      }
    },
    changeWarehouseAddress: function() {
      var warehouseCode = null
      if (this.warehouseList && this.consigneeWarehouseId) {
        var list = this.warehouseList.filter(item => item.id === this.consigneeWarehouseId)
        if (list != null && list.length > 0) {
          warehouseCode = list[0].warehouseCode
        }
      }
      this.$oms.$api.common.queryWarehouseAddress({
        currentPage: 1,
        itemsPerPage: 100,
        warehouseCodes: [warehouseCode]
      }).then(resp => {
        if (resp.data.listObj.length > 0) {
          var result = resp.data.listObj[0]
          this.dialogData.addreObj.provinceCode = result.provinceCode
          this.dialogData.addreObj.cityCode = result.cityCode
          this.dialogData.addreObj.regionCode = result.districtCode
          this.dialogData.addreObj.consigneeName = result.warehouseContacter
          this.dialogData.addreObj.consigneeMobile = result.warehouseContacterMobile
          this.dialogData.addreObj.detailAddress = result.address
          this.getAddressData(this.dialogData.addreObj.provinceCode, this.dialogData.addreObj.cityCode, this.dialogData.addreObj.regionCode)
        }
      })
    },
    getAddressData(provinceCode, cityCode, regionCode) {
      this.$oms.$api.common.getAreaListNoPaging({ filters: { code: provinceCode, level: 1 }}).then((data) => {
        this.provinces = data.data
      })

      this.$oms.$api.common.getAreaListNoPaging({ filters: { code: cityCode, level: 2 }}).then((data) => {
        this.citys = data.data
      })

      this.$oms.$api.common.getAreaListNoPaging({ filters: { code: regionCode, level: 3 }}).then((data) => {
        this.regions = data.data
      })
    },
    getSumApplyReturnAmount(soReturnItemList) {
      var sumApplyReturnAmount = 0
      this.soReturnItemList = soReturnItemList
      const items = this.soReturnItemList
      if (items && items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          sumApplyReturnAmount += Number(items[i].originalApplyReturnAmount)
        }
      }
      return sumApplyReturnAmount
    },
    onSearchKeyChange() {
      delete this.search.param[this.search.data.lastSearchKey]
      this.search.data.searchValue = ''
    },
    soReturnItemSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 3) {
        if (columnIndex === 0) {
          return [1, 5]
        } else {
          return [0, 0]
        }
      }
    },
    initReturnAddress() {
      if ((this.dialogData.returnType === 3 || this.dialogData.returnType === 4) && this.dialogData.isAgreed && this.dialogData.type === 1 && this.provinces.length === 0) {
        this.queryAera(100000, 1)
      }
    },
    async onTabClick() {
      this.checked = []
      var tab = this.tabs[this.activeState]
      this.search.param.tabReturnStatus = tab.returnStatus
      for (var p in this.btns) {
        if (this.btns[p]) {
          this.btns[p] = false
        }
      }
      this.showBatchBtn = false
      if (this.search.param.tabReturnStatus === '4000') {
        this.btns.showBatchAuditPass = true
        this.btns.showBatchAuditNoPass = true
      }
      if (this.search.param.tabReturnStatus === '4030') {
        this.btns.showBatchCheckGoodsPass = true
        this.btns.showBatchCheckGoodsNoPass = true
      }
      this.search.param.returnStatus = tab.returnStatus
      this._listSoReturnTabsMsg(this)
      this.pageParam.page = 1
      this.listData()
    },
    onPageChange() {
      this.listData()
    },
    closeExportTask() {
      this.exportCode = ''
      this.listData()
    },
    async handleSearchSubmit() {
      this.pageParam.page = 1
      this.activeState = '0'
      this.search.param.tabReturnStatus = null
      this.checked = []
      this._listSoReturnTabsMsg(this)
      await this.listData()
    },
    queryAera(code, level) {
      const filtersForAera = {
        parentCode: code,
        level: level
      }

      const vue = this
      if (!code) {
        if (level === 1) {
          vue.provinces = []
          vue.citys = []
          vue.regions = []
        } else if (level === 2) {
          vue.citys = []
          vue.regions = []
        } else {
          vue.regions = []
        }
        return
      }
      this.$oms.$api.common.getAreaListNoPaging({ filters: filtersForAera }).then((data) => {
        if (level === 1) {
          vue.provinces = data.data
        }
        if (level === 2) {
          vue.dialogData.addreObj.cityCode = null
          vue.dialogData.addreObj.regionCode = null
          vue.citys = data.data
        }
        if (level === 3) {
          vue.dialogData.addreObj.regionCode = null
          vue.regions = data.data
        }
      })
    },
    handleSearchReset() {
      this.$refs.createTime.setDefault(7)
      this.search.data.customerName = null
      this.search.data.searchKey = 'returnCode'
      this.search.data.searchValue = ''
      this.search.param = {
        courierNumber: null,
        customerId: null,
        goods_return_type: '',
        returnStatus: '',
        sendBackStatus: '',
        createTime: null,
        type: ''
      }
      this.initStartCreateTime()
    },

    exportReturnList() {
      this.search.data.lastSearchKey = this.search.data.searchKey
      this.search.param[this.search.data.lastSearchKey] = this.search.data.searchValue
      if (this.createTime == null) {
        this.search.param.startCreateTime = null
        this.search.param.endCreateTime = null
      } else {
        this.search.param.startCreateTime = this.$portal.parseTime(this.createTime[0], '{y}-{m}-{d} {h}:{i}:{s}')
        this.search.param.endCreateTime = this.$portal.parseTime(this.createTime[1], '{y}-{m}-{d} {h}:{i}:{s}')
      }
      var queryArgs = Object.assign({
        selectFields: [
          'id', 'orderCode', 'returnCode', 'merchantId', 'type', 'returnStatus', 'createTime', 'deadlineTime', 'storeId', 'storeName', 'refundStatus', 'refundTime',
          'applyReturnAmount', 'auditTime', 'isPickUp', 'sendBackStatus', 'actualReturnAmount', 'outOrderCode', 'userName', 'sysSource'
        ]
      }, this.pageParam)
      queryArgs.filters = this.search.param
      this.$oms.$api.soReturn.soReturnListExport(queryArgs).then(resp => {
        if (resp.success) {
          this.$confirm(this.$t('exportPromptInfoSuccess') + resp.data + this.$t('exportPromptInfoConfirm'), this.$t('exportPrompt'), {
            confirmButtonText: this.$t('common_confirm'),
            type: 'info',
            showCancelButton: false
          }).then(() => {
            this.exportCode = resp.data
            this.seeTask()
          })
        }
      })
    },
    seeTask() {
      this.visibleOfTask = true
    },
    checkOutRefund() {
      for (let i = 0; i < this.checked.length; i++) {
        if (this.checked[i].outReturnCode) {
          return false
        }
      }
      return true
    },
    getAuditParams(vue) {
      for (let i = 0; i < vue.checked.length; i++) {
        if (vue.checked[i].type === 3 || vue.checked[i].type === 4) {
          return false
        }
      }
      for (let i = 0; i < vue.checked.length; i++) {
        if (vue.checked[i].type !== 3 || vue.checked[i].type !== 4) {
          vue.batchOperateParams.soReturnDTOS.push({
            id: vue.checked[i].id,
            actualReturnAmount: vue.checked[i].applyReturnAmount
          })
        }
      }
      return true
    },
    getCheckGoodsParams(vue) {
      for (let i = 0; i < vue.checked.length; i++) {
        vue.batchOperateParams.soReturnDTOS.push({
          id: vue.checked[i].id,
          actualReturnAmount: vue.checked[i].actualReturnAmount === null ? 0 : vue.checked[i].actualReturnAmount
        })
      }
    },
    onBatchAudit(type) {
      const vue = this
      vue.batchOperateParams.soReturnDTOS = []
      if (vue.checked) {
        if (!this.checkOutRefund()) {
          vue.$message({
            type: 'error',
            message: vue.$t('外部渠道售后单不支持批量同意或拒绝')
          })
          return false
        }
        if (!this.getAuditParams(vue)) {
          vue.$message({
            type: 'error',
            message: vue.$t('退款退货/换货类型不支持批量同意或拒绝')
          })
          return false
        }
        var msg
        if (type === 1) {
          vue.batchOperateParams.returnStatus = '4010'
          msg = this.$t('batch_agree')
        } else if (type === 2) {
          vue.batchOperateParams.returnStatus = '4020'
          msg = this.$t('batch_refuse')
        }
        this.$confirm(this.$t('common_confirm') + msg + '?', this.$t('tips'), {
          confirmButtonText: this.$t('common_confirm'),
          cancelButtonText: this.$t('common_cancel'),
          type: 'warning'
        }).then(() => {
          vue.$oms.$api.soReturn.soReturnBatchUpdateReturnStatus(vue.batchOperateParams).then((result) => {
            if (result && result.code === '0') {
              vue.$message({
                type: 'success',
                message: vue.$t('common_deal_success')
              })
              this.activeState = '0'
              this.onTabClick()
              this.checked = []
            }
          })
        })
      }
    },
    onBatchCheckGoods(type) {
      const vue = this
      vue.batchOperateParams.soReturnDTOS = []
      if (vue.checked) {
        this.getCheckGoodsParams(vue)
        var msg
        if (type === 1) {
          vue.batchOperateParams.returnStatus = '4040' // 验货通过
          msg = this.$t('batch_agree')
        } else if (type === 2) {
          vue.batchOperateParams.returnStatus = '4041' // 验货不通过
          msg = this.$t('batch_refuse')
        }
        this.$confirm(this.$t('common_confirm') + msg + '?', this.$t('tips'), {
          confirmButtonText: this.$t('common_confirm'),
          cancelButtonText: this.$t('common_cancel'),
          type: 'warning'
        }).then(() => {
          this.$oms.$api.soReturn.soReturnBatchUpdateReturnStatus(vue.batchOperateParams).then((result) => {
            if (result && result.code === '0') {
              vue.$message({
                type: 'success',
                message: vue.$t('common_deal_success')
              })
              this.activeState = '0'
              this.onTabClick()
              this.checked = []
            }
          })
        })
      }
    },
    seeOrder(h, params) {
      soUtils.toOrderDetail(this, params.row.orderCode, params.row.orderSource, params.row.sysCode)
    },
    // 查看售后单详情
    seeReturnOrder() {
      this.$router.push({
        name: 'OmsOrderSalesListManagementDetail',
        params: {
          id: event.target.dataset.id
        }
      })
    },
    onExpandItems(row) {
      if (!row.soReturnItemList) {
        this.$oms.$api.soReturnItem.soReturnItemListPage({
          page: 1,
          limit: 4,
          selectFields: [
            'id', 'productPicPath', 'productCname', 'extInfo', 'applyReturnAmount', 'returnProductItemNum'
          ],
          filters: {
            returnId: row.id
          }
        }).then((res) => {
          row.soReturnItemList = res.data
        })
      }
    },
    listData() {
      var pageQueryArgs = Object.assign(this.getQueryArgs(), this.pageParam)
      this.loading = true
      return this.$oms.$api.soReturn.listSoReturnPage(pageQueryArgs).then((result) => {
        this.loading = false
        this.dataList = result.data
        this.dataList.forEach((item) => {
          item.returnStatus = parseInt(item.returnStatus)
        })
        this.pageParam.total = result.total
        this.showBatchBtn = this.dataList.length > 0
      })
    },
    _listStoreList(vm) {
      return this.$oms.$api.common.getUserMerchantInfo().then((res) => {
        this.search.data.storeList = res.data.storeIds
      })
    },
    _listSoReturnTabsMsg(vm) {
      var queryArgs = vm.getQueryArgs()
      var data = {}
      data.filters = Object.assign({}, queryArgs.filters)
      delete data.filters.returnStatus
      delete data.filters.tabReturnStatus
      return vm.$oms.$api.soReturn.countByReturnStatus(data).then((result) => {
        vm.search.orderStatusList = result.data || []
        vm.tabs = [{
          heading: this.$t('全部'),
          index: 0,
          returnStatus: null
        }]
        vm.search.orderStatusList.forEach(function(item, index) {
          item.code = parseInt(item.code)
          vm.tabs.push({
            heading: item.name,
            count: item.count,
            returnStatus: item.code + '',
            index: index + 2
          })
        })
      })
    },
    getQueryArgs() {
      this.search.data.lastSearchKey = this.search.data.searchKey
      this.search.param[this.search.data.lastSearchKey] = this.search.data.searchValue
      if (this.createTime == null) {
        this.search.param.startCreateTime = null
        this.search.param.endCreateTime = null
      } else {
        this.search.param.startCreateTime = this.$portal.parseTime(this.createTime[0], '{y}-{m}-{d} {h}:{i}:{s}')
        this.search.param.endCreateTime = this.$portal.parseTime(this.createTime[1], '{y}-{m}-{d} {h}:{i}:{s}')
      }
      var queryArgs = {
        selectFields: [
          'id', 'orderCode', 'freight', 'returnCode', 'merchantId', 'type', 'returnStatus', 'createTime', 'deadlineTime', 'storeId', 'storeName', 'refundStatus', 'refundTime',
          'applyReturnAmount', 'auditTime', 'isPickUp', 'isReturnFreight', 'sendBackStatus', 'actualReturnAmount', 'outOrderCode', 'userName', 'sysSource', 'outReturnCode'
        ]
      }
      queryArgs.filters = this.search.param
      return queryArgs
    },
    async init() {
      this.search.data.customerName = null
      // 销售商家
      this.$oms.$api.common.merchantList({
        currentPage: 1, itemsPerPage: 1000
      }).then(resp => {
        this.platformMerchantList = resp.data.listObj
      })

      this.$oms.$api.common.listByCategorysForOrder({
        categorys: ['SO_RETURN_STATUS', 'RETURN_TYPE', 'SEND_BACK_STATUS', 'GOODS_RETURN_TYPE', 'EXPRESS_CONFIG', 'REFUND_STATUS']
      }).then(resp => {
        this.enumTypes = resp.data
      })
      await this._listStoreList(this)
      await this._listSoReturnTabsMsg(this)
      await this.listData()
    },
    initStartCreateTime() {
      /* const lastWeek = new Date()
      this.searchForm.endCreateTime = this.$portal.parseTime(lastWeek, '{y}-{m}-{d}')

      lastWeek.setDate(lastWeek.getDate() - 7)
      this.searchForm.startCreateTime = this.$portal.parseTime(lastWeek, '{y}-{m}-{d}')

      this.createTime = [lastWeek, new Date()]*/
    },
    countDown(row) {
      let countDownStr = ''
      const endTime = new Date(row.deadlineTime)
      let runTime = parseInt((endTime - new Date().getTime()) / 1000)
      const day = Math.floor(runTime / 86400) > 0 ? Math.floor(runTime / 86400) : ''
      if (day !== '') {
        countDownStr = countDownStr + day + 'd'
      }
      runTime = runTime % 86400
      const hour = Math.floor(runTime / 3600) > 0 ? Math.floor(runTime / 3600) : ''
      if (hour !== '') {
        countDownStr = countDownStr + hour + 'h'
      }
      runTime = runTime % 3600
      const minute = Math.floor(runTime / 60) > 0 ? Math.floor(runTime / 60) : ''
      if (minute !== '') {
        countDownStr = countDownStr + minute + 'm'
      }
      if (countDownStr === '') {
        countDownStr = '0m'
      }
      return countDownStr
    },
    getAddressAll() {
      const provinceName = this.provinces.filter(item => item.code === this.dialogData.addreObj.provinceCode)[0].name
      const cityName = this.citys.filter(item => item.code === this.dialogData.addreObj.cityCode)[0].name
      const regionName = this.regions.filter(item => item.code === this.dialogData.addreObj.regionCode)[0].name
      return [provinceName, cityName, regionName, this.dialogData.addreObj.detailAddress].filter(item => item != null).join(' ').trim()
    },
    async getAddressByCode(provinceCode, cityCode, regionCode) {
      var result = await this.$oms.$api.common.getAreaListNoPaging({ filters: { parentCode: 0 }})
      const country = result.data[0]
      result = await this.$oms.$api.common.getAreaListNoPaging({ filters: { parentCode: country.code }})
      const province = result.data.filter(item => item.code === provinceCode)[0]
      result = await this.$oms.$api.common.getAreaListNoPaging({ filters: { parentCode: province.code }})
      const city = result.data.filter(item => item.code === cityCode)[0]
      result = await this.$oms.$api.common.getAreaListNoPaging({ filters: { parentCode: city.code }})
      const region = result.data.filter(item => item.code === regionCode)[0]
      return {
        provinceName: province.name,
        cityName: city.name,
        regionName: region.name
      }
    },
    async getAddressInfo(provinceCode, cityCode, regionCode, detailAddress) {
      const obj = await this.getAddressByCode(provinceCode, cityCode, regionCode)
      return [obj.provinceName, obj.cityName, obj.regionName, detailAddress].filter(item => item != null).join(' ')
    },
    handleHideDialg() {
      this.dialogData = this.getDialogData()
      this.$forceUpdate()
    },
    async doConfirm(confirm) {
      const addre = this.dialogData.addreObj
      if (this.dialogData.type === 1 && (this.dialogData.returnType === 3 || this.dialogData.returnType === 4) && this.dialogData.isAgreed && this.dialogData.isPickUp === 1) {
        if (!addre.consigneeName) {
          this.$message({ type: 'error', message: '收货人不能为空' })
          return
        }
        if (!addre.consigneeMobile) {
          this.$message({ type: 'error', message: '收货人手机号' })
          return
        } else if (!/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(1[6|7|8][0-9]))\d{8}$/.test(addre.consigneeMobile)) {
          this.$message({ type: 'error', message: '请填写正确的手机号' })
          return
        }
        if (!addre.regionCode) {
          this.$message({ type: 'error', message: '请选择完整的退货地址' })
          return
        }
        if (!addre.detailAddress) {
          this.$message({ type: 'error', message: '详细地址不能为空' })
          return
        }
        if (this.dialogData.isPickUp === null) {
          this.$message({ type: 'error', message: 'is_need_return_goods_required' })
          return
        }
        if (this.dialogData.isReturnFreight === null) {
          this.$message({ type: 'error', message: 'return_freight_required' })
          return
        }
        this.dialogData.consigneeName = addre.consigneeName
        this.dialogData.consigneeMobile = addre.consigneeMobile
        this.dialogData.consigneeAddress = this.getAddressAll()
        // this.dialogData.consigneeAddress = await this.getAddressInfo(addre.provinceCode, addre.cityCode, addre.regionCode, addre.detailAddress)
      }
      const returnId = this.dialogData.id
      var returnPicDTOList = null
      var returnAttachmentVOList = null
      if (this.dialogData.files && this.dialogData.files.length > 0) {
        returnPicDTOList = []
        returnAttachmentVOList = []
        for (let i = 0; i < this.dialogData.files.length; i++) {
          returnAttachmentVOList.push({ name: this.dialogData.files[i].fileName, path: this.dialogData.files[i].url })
          returnPicDTOList.push({ returnId: returnId, orderCode: this.dialogData.orderCode, picUrl: this.dialogData.files[i].url, type: 2 })
        }
      }
      if (this.dialogData.type === 3) {
        if (!this.dialogData.tmallCode) {
          this.$message({ type: 'error', message: '天猫验证码不能为空' })
          return
        }
      } else {
        if (!this.dialogData.remake) {
          this.$message({ type: 'error', message: '备注不能为空' })
          return
        }
        if (this.dialogData.remake.length > 200) {
          this.$message({ type: 'error', message: '备注字符不能大于200' })
          return
        }
      }
      var result = null
      if (this.dialogData.type === 2 && this.dialogData.sysSource === '210010') {
        // 拼多多验货
        if (!this.dialogData.courierNumber || !this.dialogData.logisticsCompanyId) {
          this.$message({ type: 'error', message: '拼多多验货物流信息不能为空' })
          return
        }
        result = await this.$oms.$api.soReturn.pddRefundCheckGoods({
          returnId: returnId,
          warehouseStatus: this.dialogData.isAgreed ? 1 : 2,
          orderCode: this.dialogData.orderCode,
          courierNumber: this.dialogData.courierNumber,
          logisticsCompanyId: this.dialogData.logisticsCompanyId
        })
      } else if (this.dialogData.type === 3) {
        result = await this.$oms.$api.soReturn.sendTmallRefundCode({
          returnId: returnId,
          tmallCode: this.dialogData.tmallCode
        })
      } else if (this.dialogData.isAgreed) {
        if (this.dialogData.type === 1) {
          // 审核通过
          const param = {
            returnId: returnId,
            auditReason: this.dialogData.remake, // 原因
            returnAttachmentVOList: returnAttachmentVOList, // 附件
            compensatoryAmount: this.dialogData.compensatoryAmount, // 补偿金额
            actualReturnAmount: this.dialogData.sumApplyReturnAmount, // 实际退款金额
            actualReturnItemAmount: this.dialogData.sumApplyReturnAmount, // 申请的商品实退金额，不含运费
            isPickUp: this.dialogData.isPickUp, // 是否取货：0 否  1 是
            isReturnFreight: this.dialogData.isReturnFreight // 是否退运费 0:否  1:是
            // serviceReturnReason: '' // 客服选择的退货原因
          }
          if ((this.dialogData.returnType === 3 || this.dialogData.returnType === 4) && this.dialogData.isPickUp === 1) {
            // 退货退款
            param.consigneeName = this.dialogData.consigneeName
            param.consigneeMobile = this.dialogData.consigneeMobile
            param.consigneeAddress = this.dialogData.consigneeAddress
            param.goodsReturnType = 0 // 寄回方式：0 快递寄回 1 上门取件
            param.consigneeWarehouseId = this.consigneeWarehouseId
            if (!param.consigneeAddress) {
              this.$message({ type: 'error', message: '收货地址不能为空' })
              return
            }
          } else if (this.dialogData.returnType === 2) {
            // 审核同意时仅退款已发货需要选择是否退运费
            if (this.dialogData.isReturnFreight === null) {
              this.$message({ type: 'error', message: 'return_freight_required' })
              return
            }
          }
          result = await this.$oms.$api.soReturn.soReturnAuditPass(param)
        } else {
          // 验货通过
          result = await this.$oms.$api.soReturn.soReturnCheckGoodsPassed({
            id: returnId,
            orderCode: this.dialogData.orderCode,
            actualReturnAmount: this.dialogData.sumApplyReturnAmount,
            serviceReturnReason: this.dialogData.remake,
            inspectionDesc: this.dialogData.remake, // 验货描述
            inspectionDate: new Date(), // 验货日期
            inspectionResult: 1, // 验货结果，1 通过，0 不通过
            returnPicDTOList: returnPicDTOList, // 收货图片
            courierNumber: this.dialogData.courierNumber,
            logisticsCompanyId: this.dialogData.logisticsCompanyId
            // actualReturnAmount: actualReturnAmount, // 实际退款金额
            // compensatoryAmount: null, // 补偿金额
            // serviceReturnReason: '' // 客服选择的退货原因
          })
        }
      } else {
        // 拒绝
        if (this.dialogData.type === 1) {
          if (this.dialogData.serviceDesc != null && this.dialogData.serviceDesc === '京东仓出货单取消成功') {
            this.$message({ type: 'error', message: '京东仓出库单取消成功的售后单不允许审核拒绝' })
            return
          }
          // 审核不通过
          result = await this.$oms.$api.soReturn.soReturnAuditNotPass({
            returnId: returnId,
            auditReason: this.dialogData.remake,
            returnAttachmentVOList: returnAttachmentVOList
          })
        } else {
          // 验货不通过
          result = await this.$oms.$api.soReturn.soReturnCheckGoodsNotPassed({
            id: returnId,
            orderCode: addre.orderCode,
            serviceReturnReason: this.dialogData.remake,
            inspectionDesc: this.dialogData.remake, // 验货描述
            inspectionDate: new Date(), // 验货日期
            inspectionResult: 0, // 验货结果，1 通过，0 不通过
            returnPicDTOList: returnPicDTOList // 收货图片
            // actualReturnAmount: null, // 实际退款金额
            // compensatoryAmount: null, // 补偿金额
            // serviceReturnReason: '' // 客服选择的退货原因
          })
        }
      }
      if (result) {
        this.$message({ type: 'success', message: result.message })
        this.dialogData.visible = false
        this.dialogData = this.getDialogData()
        await this.init()
      }
      this.$forceUpdate()
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
    async loadLogisticsCompanies(returnId) {
      await this.$oms.$api.soReturn.logisticsCompanies({ returnId: returnId }).then(data => {
        this.pddLogisticsCompanies = data.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .bg-gray tr, .bg-gray td{
    background-color: #f8f9fa;
    border-bottom: 0px;
  }

  .bg-gray::before{
    height: 0px;
  }
  .el-date-editor .el-range-input {
    width: 50%;
  }

  .el-date-editor .el-range-separator {
    padding: 0 !important;
  }
  .el-table--medium td, .el-table--medium th {
    padding: 6px 0!important;
    }
  .el-tabs__header{
    margin: 0 0 5px 0!important;
  }
  .el-tabs__header {
    margin: 0 0 8px 0!important;
  }
  .el-table .cell {
    line-height: 24px!important;
  }
  .more-button{
    position: relative;
    top: 5px;
  }
  .row_class{
    margin-bottom: 16px;
  }
  .btn-right {
    margin-right: 14px;
  }
</style>
