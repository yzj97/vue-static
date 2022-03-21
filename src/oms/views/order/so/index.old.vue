<template>
  <section class="pg-so-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('do_merchant_name')" prop="merchantId">
            <el-select
              v-model="searchForm.merchantId"
              :placeholder="$t('common_all')"
              name="searchForm_merchantId"
              @change="loadWarehouseByMerchant"
            >
              <el-option
                v-for="item in merchants"
                :label="item.merchantName"
                :key="item.merchantId"
                :value="item.merchantId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('manual_order_order_syssource')" prop="sysSource">
            <el-select v-model="searchForm.sysSource" :placeholder="$t('common_all')" name="searchForm_sysSource">
              <el-option
                v-for="item in allChannels"
                :label="item.channelName"
                :key="item.channelCode"
                :value="item.channelCode"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('do_store_name')" prop="storeName">
            <el-input v-model="searchForm.storeName" name="searchForm_storeName" />
          </ody-search-item>
          <ody-search-item :label="$t('order_ports_type')" prop="orderType">
            <el-select v-model="searchForm.orderType" :placeholder="$t('common_all')" name="searchForm_orderType">
              <el-option
                v-for="item in soTypes"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('order_source')" prop="orderSource">
            <el-select v-model="searchForm.orderSource" :placeholder="$t('common_all')" name="searchForm_orderSource">
              <el-option
                v-for="item in codes.ORDER_SOURCE"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :space="2" :label="$t('order_date')" class="register" prop="createTime">
            <el-date-picker
              v-model="searchForm.createTime"
              name="searchForm_createTime"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
            />
          </ody-search-item>
          <ody-search-item :label="$t('order_code') + '/' + $t('order_parent_code')" prop="nodeOrderCode">
            <el-input v-model="searchForm.nodeOrderCode" name="searchForm_nodeOrderCode" />
          </ody-search-item>
          <ody-search-item :label="$t('do_do_code')" prop="doCode">
            <el-input v-model="searchForm.doCode" name="searchForm_doCode" />
          </ody-search-item>
          <ody-search-item :label="$t('outOrderCode')" prop="outOrderCode">
            <el-input v-model="searchForm.outOrderCode" name="searchForm_outOrderCode" />
          </ody-search-item>
          <ody-search-item :label="$t('order_channel')" prop="orderChannel">
            <el-select v-model="searchForm.orderChannel" :placeholder="$t('common_all')" name="searchForm_orderChannel">
              <el-option
                v-for="item in codes.ORDER_CHANNEL"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('order_status')" prop="orderStatus">
            <el-select
              v-model="searchForm.orderStatus"
              :placeholder="$t('common_all')"
              :disabled="Number(activeState) > 0"
              name="searchForm_orderStatus"
            >
              <el-option
                v-for="item in codes.ORDER_STATUS"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('order_sales_code')" prop="returnCode">
            <el-input v-model="searchForm.returnCode" name="searchForm_returnCode" />
          </ody-search-item>
          <ody-search-item :label="$t('orderPromotionStatus')" prop="orderPromotionStatus">
            <el-select v-model="searchForm.orderPromotionStatus" :placeholder="$t('common_all')" name="searchForm_orderPromotionStatus">
              <el-option :label="$t('orderPromotionStatus_join_success')" value="1006" />
              <el-option :label="$t('orderPromotionStatus_collage_success')" value="1002" />
              <el-option :label="$t('orderPromotionStatus_collage_failure')" value="1003" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('orderCreateUsername')" prop="userName">
            <el-input v-model="searchForm.userName" name="searchForm_userName" />
          </ody-search-item>
          <ody-search-item :label="$t('orderNeedInvoice')" prop="orderNeedInvoice">
            <el-select v-model="searchForm.orderNeedInvoice" :placeholder="$t('common_all')" name="searchForm_orderNeedInvoice">
              <el-option :label="$t('common_yes')" value="1" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('paymentWay')" prop="orderPaymentTwoType">
            <el-select v-model="searchForm.orderPaymentTwoType" :placeholder="$t('common_all')" name="searchForm_orderPaymentTwoType">
              <el-option
                v-for="item in codes.ORDER_PAYMENT_GATEWAY_DSC"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('paymentType')" prop="orderPaymentType">
            <el-select v-model="searchForm.orderPaymentType" :placeholder="$t('common_all')" name="searchForm_orderPaymentType">
              <el-option
                v-for="item in codes.PAY_METHOD"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :space="2" :label="$t('do_logistics_time')" class="register" prop="expectDeliverDate">
            <el-date-picker
              v-model="searchForm.expectDeliverDate"
              name="searchForm_expectDeliverDate"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
            />
          </ody-search-item>
          <ody-search-item :space="2" :label="$t('orderAmount')" prop="orderAmountMinStr">
            <el-col :span="10">
              <el-input v-model="searchForm.orderAmountMinStr" name="searchForm_orderAmountMinStr" type="number" />
            </el-col>
            <el-col :span="1" align="center">-</el-col>
            <el-col :span="10">
              <el-input v-model="searchForm.orderAmountMaxStr" name="searchForm_orderAmountMaxStr" type="number" />
            </el-col>
          </ody-search-item>
          <ody-search-item :space="2" :label="$t('orderPaymentConfirmDate')" class="register" prop="orderPaymentConfirmDate">
            <el-date-picker
              v-model="searchForm.orderPaymentConfirmDate"
              name="searchForm_orderPaymentConfirmDate"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
            />
          </ody-search-item>
          <ody-search-item :label="$t('orderLabel')" prop="orderLabel">
            <el-select v-model="searchForm.orderLabel" :placeholder="$t('common_all')" name="searchForm_orderLabel">
              <el-option
                v-for="item in codes.ORDER_LABLE"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('returnExist')" prop="soReturnExist">
            <el-select v-model="searchForm.soReturnExist" :placeholder="$t('common_all')" name="searchForm_soReturnExist">
              <el-option :label="$t('common_yes')" value="1" />
            </el-select>
          </ody-search-item>
          <ody-search-item :space="3" :label="$t('goodReceiverAddress')" prop="goodReceiverProvinceCode">
            <el-select
              id="s_province"
              v-model="searchForm.goodReceiverProvinceCode"
              name="s_province"
              @change="queryAera(searchForm.goodReceiverProvinceCode, 2)"
            >
              <el-option :label="$t('please_choose')" />
              <el-option
                v-for="item in province_list"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
            <el-select
              id="s_city"
              v-model="searchForm.goodReceiverCityCode"
              :disabled="!searchForm.goodReceiverProvinceCode"
              name="s_city"
              @change="queryAera(searchForm.goodReceiverCityCode, 3)"
            >
              <el-option :label="$t('please_choose')" />
              <el-option
                v-for="item in city_list"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
            <el-select
              id="s_area"
              v-model="searchForm.goodReceiverAreaCode"
              :disabled="!searchForm.goodReceiverCityCode"
              name="s_area"
            >
              <el-option :label="$t('please_choose')" />
              <el-option
                v-for="item in area_list"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('so_promotion_ID')" prop="promotionId">
            <el-input v-model="searchForm.promotionId" name="searchForm_promotionId" type="number" />
          </ody-search-item>
          <ody-search-item :label="$t('manual_order_receiver_name')" prop="goodReceiverName">
            <el-input v-model="searchForm.goodReceiverName" name="searchForm_goodReceiverName" />
          </ody-search-item>
          <ody-search-item :label="$t('manual_order_receiver_mobile')" prop="goodReceiverMobile">
            <el-input v-model="searchForm.goodReceiverMobile" name="searchForm_goodReceiverMobile" />
          </ody-search-item>
          <ody-search-item :label="$t('do_warehouse')" prop="warehouseId">
            <el-select v-model="searchForm.warehouseId" :placeholder="$t('common_all')" name="searchForm_warehouseId">
              <el-option
                v-for="item in warehouseList"
                :label="item.warehouseName"
                :key="item.id"
                :value="item.id"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('do_delivery_method')" prop="orderDeliveryMethodId">
            <el-select v-model="searchForm.orderDeliveryMethodId" :placeholder="$t('common_all')" name="searchForm_orderDeliveryMethodId">
              <el-option
                v-for="item in distributionModeItems"
                :label="item.distributionMode"
                :key="item.shippingCode"
                :value="item.shippingCode"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('order_ports_product_code')" prop="productCode">
            <el-input v-model="searchForm.productCode" name="searchForm_productCode" />
          </ody-search-item>
          <ody-search-item :label="$t('order_ports_product_name')" prop="productCname">
            <el-input v-model="searchForm.productCname" name="searchForm_productCname" />
          </ody-search-item>
          <ody-search-item :label="$t('goods_goods_good_category')" prop="wholeCategoryId">
            <CategorySelect
              ref="categorySelect"
              v-model="searchForm.wholeCategoryId"
              :display-full-name="false"
              name="searchForm_wholeCategoryId"
              @clean="cleanSelected"
              @select="selectNode"
            />
          </ody-search-item>
          <ody-search-item :label="$t('goods_goods_good_brand')" prop="brandName">
            <el-input v-model="searchForm.brandName" name="searchForm_brandName" readonly="readonly" @focus="showBrandModal" />
          </ody-search-item>
          <ody-search-item :label="$t('do_art_no')" prop="artNo">
            <el-input v-model="searchForm.artNo" name="searchForm_artNo" />
          </ody-search-item>
          <ody-search-item :label="$t('product_bar_code')" prop="barCode">
            <el-input v-model="searchForm.barCode" name="searchForm_barCode" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchSubmit" size="small" type="primary" @click="handleSearchSubmit">{{ $t('common_select') }}</el-button>
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <el-button name="exportOrder" size="small" type="primary" @click="exportOrder">{{ $t('exportOrder') }}</el-button>
        <el-button name="exportOrderLine" size="small" type="primary" @click="exportOrderLine">{{ $t('exportOrderLine') }}</el-button>
        <el-button name="openOrderTaskList" size="small" type="primary" @click="openOrderTaskList">{{ $t('seeTask') }}</el-button>
        <el-button
          v-if="!platformId || platformId!=4"
          name="artificialOrder"
          size="small"
          type="primary"
          @click="artificialOrder"
        >{{ $t('artificialOrderManagement') }}</el-button>
        <el-button name="importOrder" size="small" type="primary" @click="importOrder">{{ $t('importOrder') }}</el-button>
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
          :multiple="multiple"
          :checked.sync="checked"
          name="list323"
        />
      </div>
      <div slot="page">
        <div class="block">
          <ody-pagination
            :current-page.sync="page.current"
            :list="list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="page.size"
            :total.sync="page.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handlePageSizeChange"
            @current-change="handlePageCurrentChange"
          />
          <font v-bind="hideMIds" color="white" />
        </div>
      </div>
    </ody-list-table-area>
    <BrandModal :visible.sync="visible" @ok="handleBrand" />
    <SoExportTask
      :visible.sync="visibleOfTask"
      :code.sync="taskCode"
      :task-type="taskType"
      :design-columns.sync="taskModalDefine.columns"
      :design-operates.sync="taskModalDefine.operates"
    />
    <DataImportModal :visible.sync="visibleOfImport" :filters="taskFilters" />
    <SoImportModal :visible.sync="visibleOfSoImportModal" @success="handleImportSuccess" />
  </section>
</template>

<script>
import CategorySelect from '@/components/categorySelect'
import BrandModal from '@/components/brandModal'
import SoExportTask from '@/components/soExportTask'
import DataImportModal from '@/components/dataImportModal'
import SoImportModal from '@/components/so/importModal'

export default {
  name: 'OmsOrderOldList',
  components: {
    CategorySelect,
    BrandModal,
    SoExportTask,
    DataImportModal,
    SoImportModal
  },
  data() {
    const self = this
    return {
      allChannels: [],
      allChannelsMap: {},
      merchants: [],
      soTypes: [],
      soTypeMap: {},
      codes: {
        ORDER_SOURCE: [],
        ORDER_CHANNEL: [],
        ORDER_STATUS: [],
        ORDER_PAYMENT_GATEWAY_DSC: [],
        PAY_METHOD: [],
        ORDER_LABLE: [],
        CUSTOMER_TYPE: [],
        ORDER_PAYMENT_STATUS: []
      },
      paymentStatusMap: {},
      paymentMethodMap: {},
      orderStatusMap: {},
      mealTypeMap: {},
      orderLableMap: {},
      activeState: '0',
      warehouseList: [],
      distributionModeItems: [],
      visible: false,
      checked: [],
      province_list: [],
      city_list: [],
      area_list: [],
      searchForm: getDefaultSearchForm(),
      loading: false,
      multiple: true,
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      orderLabelMapClass: {
        focusOn: 'success',
        putOnHold: 'info',
        sos: 'danger',
        special: 'primary',
        vip: 'warning'
      },
      hideMIds: null,
      visibleOfTask: false,
      taskType: '1',
      taskCode: null,
      visibleOfImport: false,
      taskFilters: null,
      visibleOfSoImportModal: false,
      columns: [
        {
          show: true,
          label: this.$t('common_operations'),
          minWidth: 100,
          render: (h, params) => {
            return (
              <el-button
                size='mini'
                on-click={() => {
                  this.$router.push({
                    name: 'OrderListDetail',
                    params: {
                      orderCode: params.row.orderCode
                    }
                  })
                }}
              >
                <span>{this.$t('view')}</span>
              </el-button>
            )
          }
        },
        {
          show: true,
          prop: 'orderCodeAndLabels',
          label: this.$t('order_code'),
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            let labelArray
            if (params.row.orderLabel) {
              labelArray = params.row.orderLabel
                .split(',')
                .map((item, index) => {
                  return (
                    <el-tag type={this.orderLabelMapClass[item]} size='mini'>
                      {this.orderLableMap[item]}
                    </el-tag>
                  )
                })
              labelArray = <div>{labelArray}</div>
            }

            let parentCode
            if (params.row.parentCode) {
              parentCode = (
                <div>
                  {' '}
                  {this.$t('order_parent_code')}: {params.row.parentCode}{' '}
                </div>
              )
            }

            return (
              <div>
                <div>{params.row.orderCode}</div>
                {parentCode}
                {labelArray}
              </div>
            )
          }
        },
        {
          show: true,
          prop: 'orderTypeStr',
          label: this.$t('order_ports_type'),
          align: 'center',
          minWidth: 80,
          formatter: (row, column) => {
            if (this.soTypeMap) {
              return this.soTypeMap[row.orderType]
            }
            return ''
          }
        },
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('do_merchant_name'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'storeName',
          label: this.$t('sale_store'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'sysSourceStr',
          label: this.$t('manual_order_order_syssource'),
          align: 'center',
          minWidth: 80,
          formatter: (row, column) => {
            if (this.allChannelsMap) {
              return this.allChannelsMap[row.sysSource]
            }
            return ''
          }
        },
        {
          show: true,
          prop: 'orderCreateTime',
          label: this.$t('order_date'),
          align: 'center',
          minWidth: 140,
          fromatter: (row, column) => {
            if (row.orderCreateTime) {
              return this.$portal.parseTime(
                row.orderCreateTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
            return ''
          }
        },
        {
          show: true,
          prop: 'userName',
          label: this.$t('so_error_create_username'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'orderTotalAmount',
          label: this.$t('orderAmount'),
          align: 'center',
          minWidth: 80,
          formatter: (row, column) => {
            const orderTotalAmount =
              (row.orderAmount || 0) +
              (row.taxAmount || 0) +
              (row.orderDeliveryFee || 0)
            return Number(orderTotalAmount).toFixed(2)
          }
        },
        {
          show: true,
          prop: 'currency',
          label: this.$t('currencyType'),
          align: 'center',
          minWidth: 70
        },
        {
          show: true,
          prop: 'currencyName',
          label: this.$t('currencyName'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'currencyRate',
          label: this.$t('currencyRate'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'orderPaymentStatusStr',
          label: this.$t('paymentStatus'),
          align: 'center',
          minWidth: 80,
          formatter: (row, column) => {
            if (this.paymentStatusMap) {
              return this.paymentStatusMap[row.orderPaymentStatus]
            }
            return ''
          }
        },
        {
          show: true,
          prop: 'orderStatusStr',
          label: this.$t('orderStatus'),
          align: 'center',
          minWidth: 80,
          formatter: (row, column) => {
            if (this.orderStatusMap) {
              return this.orderStatusMap[row.orderStatus]
            }
            return ''
          }
        },
        {
          show: true,
          prop: 'orderPaymentTypeStr',
          label: this.$t('paymentType'),
          align: 'center',
          minWidth: 80,
          formatter: (row, column) => {
            if (this.paymentMethodMap) {
              return this.paymentMethodMap[row.orderPaymentType]
            }
            return ''
          }
        },
        {
          show: true,
          prop: 'cashier',
          label: this.$t('cashier'),
          align: 'center',
          minWidth: 70
        },
        {
          show: true,
          prop: 'tableNo',
          label: this.$t('table_no'),
          align: 'center',
          minWidth: 70
        },
        {
          show: true,
          prop: 'mealsNum',
          label: this.$t('mealsNum'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'mealTypeStr',
          label: this.$t('mealType'),
          align: 'center',
          minWidth: 80,
          formatter: (row, column) => {
            if (this.mealTypeMap) {
              return this.mealTypeMap[row.mealType]
            }
            return ''
          }
        },
        {
          show: true,
          prop: 'createTime',
          label: this.$t('common_createTime'),
          align: 'center',
          minWidth: 140,
          fromatter: (row, column) => {
            if (row.createTime) {
              return this.$portal.parseTime(
                row.createTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
            return ''
          }
        }
      ],
      taskModalDefine: {
        columns: [
          {
            show: true,
            prop: 'id',
            label: this.$t('taskCode'),
            align: 'left',
            minWidth: 120
          },
          {
            show: true,
            prop: 'taskTypeStr',
            label: this.$t('taskType'),
            align: 'left',
            minWidth: 80
          },
          {
            show: true,
            prop: 'createUsername',
            label: this.$t('operation_people'),
            align: 'left',
            minWidth: 100
          },
          {
            show: true,
            prop: 'taskActionTypeStr', // taskActionType,taskType
            label: this.$t('operation_type'),
            align: 'left',
            minWidth: 80
          },
          {
            show: true,
            prop: 'taskStatusStr', // taskStatus,...isDeleted: 0
            label: this.$t('taskStatus'),
            align: 'left',
            minWidth: 80
          },
          {
            show: true,
            prop: 'startTime',
            label: this.$t('taskStartTime'),
            align: 'left',
            minWidth: 140
          },
          {
            show: true,
            prop: 'finishTime',
            label: this.$t('taskFinishTime'),
            align: 'left',
            minWidth: 140
          },
          {
            show: true,
            prop: 'count',
            label: this.$t('taskCount'),
            align: 'left',
            minWidth: 150,
            formatter: (row, column) => {
              if (row.taskActionType === 1) {
                if (
                  typeof row.successCount !== 'undefined' &&
                  row.successCount !== null &&
                  typeof row.failedCount !== 'undefined' &&
                  row.failedCount !== null &&
                  typeof row.totalCount !== 'undefined' &&
                  row.totalCount !== null
                ) {
                  return (
                    row.totalCount +
                    ' / ' +
                    row.successCount +
                    ' / ' +
                    row.failedCount
                  )
                }
              }
            }
          },
          {
            show: true,
            prop: 'failedReason',
            label: this.$t('data_import_failed_reason'),
            align: 'left',
            minWidth: 200
          }
        ],
        operates: {
          width: 120,
          align: 'right',
          list: [
            {
              label: this.$t('common_export'),
              hidden(index, row) {
                return !(row.taskActionType === 2 && row.taskStatus === 4)
              },
              method(index, row) {
                self.$portal.downloadFileByGet(row.filePath)
              }
            },
            {
              label: this.$t('view'),
              hidden(index, row) {
                return !(
                  row.taskActionType === 1 &&
                  row.failedCount &&
                  row.failedCount > 0
                )
              },
              method(index, row) {
                self.handleView(row)
              }
            }
          ]
        }
      }
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
    showExportMessage(taskCode) {
      this.$alert(
        this.$t('exportPromptInfoSuccess') +
          taskCode +
          this.$t('exportPromptInfoConfirm'),
        this.$t('exportPrompt'),
        {
          confirmButtonText: this.$t('common_confirm_search'),
          callback: action => {
            this.openOrderTaskList({ taskCode: taskCode })
          }
        }
      )
    },
    async exportOrder() {
      // 导出订单
      const filters = getFilters(this)
      const result = await this.$oms.$api.so.soListExport(filters)
      if (result.data) {
        this.showExportMessage(result.data)
      }
    },
    async exportOrderLine() {
      // 导出订单行
      const filters = getFilters(this)
      const result = await this.$oms.$api.so.soListLineExport(filters)
      if (result.data) {
        this.showExportMessage(result.data)
      }
    },
    openOrderTaskList({ taskCode }) {
      // 显示task
      this.taskCode = taskCode
      this.visibleOfTask = true
    },
    artificialOrder() {
      // 人工下单
      this.$router.push({
        name: 'OmsManualOrder'
      })
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
            this.openOrderTaskList({ taskCode: taskCode })
          }
        }
      )
    },
    handleView(row) {
      this.taskFilters = {
        taskId: row.id,
        isFailed: 1
      }
      this.visibleOfImport = true
    },
    showBrandModal() {
      this.visible = true
    },
    handleBrand(selectedBrand) {
      console.info('选中品牌' + JSON.stringify(selectedBrand))
      this.searchForm.brandName = selectedBrand.name
      this.searchForm.brandId = selectedBrand.id
    },
    loadWarehouseByMerchant() {
      const vue = this
      if (!vue.searchForm.merchantId) {
        vue.warehouseList = []
      } else {
        this.$oms.$api.common
          .listStoreWarehouse({
            isVirtualWarehouse: 0,
            merchantId: vue.searchForm.merchantId
          })
          .then(data => {
            vue.warehouseList = data.data
          })
      }
    },
    async handleTabsClick() {
      try {
        this.currentTab = this.tabs[Number(this.activeState)]
        this.searchForm.orderStatus = this.currentTab.orderStatus
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
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
      this.searchForm.orderStatus = this.currentTab.orderStatus
      this.$refs['categorySelect'].cleanSelected()
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
    queryAera(code, level) {
      const filtersForAera = {
        parentCode: code,
        level: level
      }
      const vue = this
      this.$oms.$api.common
        .getAreaListNoPaging({ filters: filtersForAera })
        .then(data => {
          if (level === 1) {
            if (code) {
              vue.province_list = data.data
            } else {
              vue.province_list = []
              vue.city_list = []
              vue.area_list = []
            }
          }
          if (level === 2) {
            vue.searchForm.goodReceiverCityCode = null
            vue.searchForm.goodReceiverAreaCode = null
            if (code) {
              vue.city_list = data.data
            } else {
              vue.city_list = []
              vue.area_list = []
            }
          }
          if (level === 3) {
            vue.searchForm.goodReceiverAreaCode = null
            if (code) {
              vue.area_list = data.data
            } else {
              vue.area_list = []
            }
          }
        })
    },
    async _initAllChannels() {
      const result = await this.$oms.$api.common.listAllChannels({})
      if (result.data) {
        for (const p in result.data) {
          const item = result.data[p]
          if (this.platformId === 4) {
            if (Number(item.channelCode) === 110004) {
              this.allChannels.push({
                channelCode: item.channelCode,
                channelName: item.channelName
              })
            }
          } else {
            this.allChannels.push({
              channelCode: item.channelCode,
              channelName: item.channelName
            })
          }
        }
        this.allChannelsMap = this.allChannels.reduce((m, i) => {
          m[i['channelCode']] = i['channelName']
          return m
        }, {})
      }
    },
    _initMerchants() {
      const vue = this
      this.$oms.$api.common
        .merchantList({ currentPage: 1, itemsPerPage: 1000 })
        .then(data => {
          vue.merchants = data.data.listObj
        })
    },
    _initDistributionModeItem() {
      const vue = this
      this.$oms.$api.distributionModeItem
        .distributionModeItemListForSelect({})
        .then(data => {
          vue.distributionModeItems = data.data
        })
    },
    async _initSoTypesAndLoad() {
      const result = await this.$oms.$api.soType.soTypeList({
        currentPage: 1,
        itemsPerPage: 1000
      })
      this.soTypes = result.data
      this.soTypeMap = this.soTypes.reduce((m, i) => {
        m[i['code']] = i['name']
        return m
      }, {})
    },
    async _initCodes() {
      const params = {
        categorys: [
          'ORDER_SOURCE',
          'ORDER_CHANNEL',
          'ORDER_STATUS',
          'ORDER_PAYMENT_GATEWAY_DSC',
          'PAY_METHOD',
          'ORDER_LABLE',
          'CUSTOMER_TYPE',
          'ORDER_PAYMENT_STATUS'
        ]
      }
      const result = await this.$oms.$api.common.listByCategorysForOrder(params)
      this.codes = result.data
      if (this.codes.ORDER_PAYMENT_STATUS) {
        this.paymentStatusMap = this.codes.ORDER_PAYMENT_STATUS.reduce(
          (m, i) => {
            m[i['code']] = i['name']
            return m
          },
          {}
        )
      }
      if (this.codes.MEAL_TYPE) {
        this.mealTypeMap = this.codes.MEAL_TYPE.reduce((m, i) => {
          m[i['code']] = i['name']
          return m
        }, {})
      }
      if (this.codes.PAY_METHOD) {
        this.paymentMethodMap = this.codes.PAY_METHOD.reduce((m, i) => {
          m[i['code']] = i['name']
          return m
        }, {})
      }
      if (this.codes.ORDER_STATUS) {
        this.codes.ORDER_STATUS.forEach((code, index) => {
          this.tabs.push({
            heading: code.name,
            index: index + 2,
            orderStatus: code.code
          })
        })
        this.orderStatusMap = this.codes.ORDER_STATUS.reduce((m, i) => {
          m[i['code']] = i['name']
          return m
        }, {})
      }

      if (this.codes.ORDER_LABLE) {
        this.orderLableMap = this.codes.ORDER_LABLE.reduce((m, i) => {
          m[i['code']] = i['name']
          return m
        }, {})
      }
    },
    async _initPlatform() {
      const result = await this.$oms.$api.common.platformGetPlatformId({})
      this.platformId = result.data
      if (this.platformId === 4) {
        this.columns.splice(7, 0, {
          field: 'distributorName',
          label: 'distributor_name',
          align: 'center',
          minWidth: 40,
          formatter: (row, column) => {
            return row.customerName
          }
        })
      }
    },
    async init() {
      this.tabs = [
        {
          heading: this.$t('allDefaultAWeek'),
          index: 1
        }
      ]
      await this._initPlatform()
      await this._initCodes()
      this._initMerchants()
      await this._initAllChannels()
      this._initSoTypesAndLoad()
      this._initDistributionModeItem()

      this.queryAera('100000', 1)
      this.updateList()
    },
    selectNode(nodes) {
      this.searchForm.wholeCategoryId = null
      this.searchForm.categoryName = null
      let selectedNode = null
      if (Array.isArray(nodes) && nodes.lengt > 0) {
        selectedNode = nodes[0]
      } else {
        selectedNode = nodes
      }

      if (selectedNode) {
        this.searchForm.categoryName = selectedNode.name
        this.searchForm.wholeCategoryId = selectedNode.id
      }
    },
    cleanSelected() {
      this.searchForm.categoryName = null
      this.searchForm.wholeCategoryId = null
    }
  }
}
function getFilters(vue) {
  const filters = JSON.parse(JSON.stringify(vue.searchForm))
  if (filters.createTime) {
    filters.createTimeMinStr = vue.$portal.parseTime(
      filters.createTime[0],
      '{y}-{m}-{d}'
    )
    filters.createTimeMaxStr = vue.$portal.parseTime(
      filters.createTime[1],
      '{y}-{m}-{d}'
    )
    delete filters.createTime
  }
  if (filters.expectDeliverDate) {
    filters.expectDeliverDateMinStr = vue.$portal.parseTime(
      filters.expectDeliverDate[0],
      '{y}-{m}-{d}'
    )
    filters.expectDeliverDateMaxStr = vue.$portal.parseTime(
      filters.expectDeliverDate[1],
      '{y}-{m}-{d}'
    )
    delete filters.expectDeliverDate
  }
  if (filters.orderPaymentConfirmDate) {
    filters.orderPaymentConfirmDateMinStr = vue.$portal.parseTime(
      filters.orderPaymentConfirmDate[0],
      '{y}-{m}-{d}'
    )
    filters.orderPaymentConfirmDateMaxStr = vue.$portal.parseTime(
      filters.orderPaymentConfirmDate[1],
      '{y}-{m}-{d}'
    )
    delete filters.orderPaymentConfirmDate
  }
  return filters
}

async function loadList(vue) {
  const param = {
    limit: vue.page.size,
    page: vue.page.current,
    ...getFilters(vue)
  }
  const so = vue.$oms.$api.so

  const res = await so.soListPage(param)
  if (res) {
    vue.list = res.data
    vue.page.total = res.total
    vue.hideMIds = res.message
  }
}

function getDefaultSearchForm() {
  const currentDate = new Date()
  const lastTwoWeek = new Date()
  lastTwoWeek.setDate(lastTwoWeek.getDate() - 14)

  return Object.assign(
    {},
    {
      goodReceiverProvinceCode: null,
      goodReceiverCityCode: null,
      goodReceiverAreaCode: null,
      createTime: [lastTwoWeek, currentDate]
    }
  )
}
</script>

<style lang="scss" scoped>
</style>
