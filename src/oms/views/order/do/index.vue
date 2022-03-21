<template>
  <section class="pg-soPackage-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <!-- 综合搜索下拉框 -->
          <ody-search-item prop="searchName">
            <span slot="label">
              <el-select
                v-model="searchName"
                :clearable="false"
                name="searchName"
                @change="searchForm.searchValue = null"
              >
                <el-option
                  :label="$t('delivery_list_no') + ':'"
                  value="doCode"
                >{{ $t('delivery_list_no') }}</el-option>
                <el-option :label="$t('orderNumber')" value="orderCode">{{ $t('orderNumber') }}</el-option>
                <el-option
                  :label="$t('channelOrderCode')"
                  value="outOrderCode"
                >{{ $t('channelOrderCode') }}</el-option>
                <el-option
                  :label="$t('consignee_name')"
                  value="goodReceiverName"
                >{{ $t('consignee_name') }}</el-option>
              </el-select>
            </span>
            <el-input v-model="searchForm.searchValue" name="searchForm_searchValue" />
          </ody-search-item>
          <!-- 手机号 -->
          <ody-search-item :label="$t('cell_phone_number') + ':'" prop="goodReceiverMobile">
            <el-input v-model="searchForm.goodReceiverMobile" name="searchForm_goodReceiverMobile" />
          </ody-search-item>
          <!-- 发货仓库 -->
          <ody-search-item :label="$t('do_warehouse') + ':'" prop="warehouseId">
            <el-select v-model="searchForm.warehouseId" :popper-append-to-body="false" :placeholder="$t('common_all')" name="searchForm_warehouseId">
              <el-option
                v-for="item in warehouseList"
                :label="item.warehouseName"
                :key="item.warehouseId"
                :value="item.warehouseId"
              />
            </el-select>
          </ody-search-item>
          <!-- 店铺 -->
          <ody-search-item :label="$t('order_shop') + ':'" prop="storeId">
            <el-select v-model="searchForm.storeId" :popper-append-to-body="false" :placeholder="$t('common_all')" name="searchForm_storeId">
              <el-option
                v-for="item in storeList"
                :label="item.storeName"
                :key="item.storeId"
                :value="item.storeId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('do_do_status') + ':'" prop="status">
            <el-select v-model="searchForm.status" :placeholder="$t('common_all')" name="searchForm_status">
              <el-option
                v-for="item in doStatusList"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <!-- 交货单创建时间 -->
          <ody-search-item :label="$t('do_create_time') + ':'" :space="2" prop="createTime">
            <ody-date-range-picker
              v-model="searchForm.createTime"
              :default="7"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="searchForm_createTime"
              type="datetimer"/>
          </ody-search-item>
          <!--预计发货时间-->
          <ody-search-item :label="$t('do_logistics_time') + ':'" :space="2" prop="doLogisticsTime">
            <ody-date-range-picker
              v-model="searchForm.doLogisticsTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="searchForm_doLogisticsTime"
              type="datetimer"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <ody-button name="OmsTransOrdersList_Reset_handleSearchReset" code="OmsTransOrdersList_Reset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</ody-button>
        <ody-button
          name="OmsTransOrdersList_Query_handleSearchSubmit"
          code="OmsTransOrdersList_Query"
          size="small"
          type="primary"
          @click="handleSearchSubmit"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button name="OmsTransOrdersList_Cancel_onBatchCancel" code="OmsTransOrdersList_Cancel" size="small" class="btn-right" @click="onBatchCancel">{{ $t('common_batch_cancel') }}</ody-button>
        <!-- <ody-button name="OmsTransOrdersList_Export_exportTransOrderList" code="OmsTransOrdersList_Export" size="small" @click="exportTransOrderList">{{ $t('exportDeliveryList') }}</ody-button>
        <ody-button name="OmsTransOrdersList_Import_importTransOrderList" code="OmsTransOrdersList_Import" size="small" @click="importTransOrderList">{{ $t('do_import_result') }}</ody-button>
        <ody-button name="OmsTransOrdersList_Task_seeTask" code="OmsTransOrdersList_Task" size="small" @click="seeTask">{{ $t('seeTask') }}</ody-button> -->
        <ody-batch-export-button
          :get-export-data="exportModel.getExportData"
          :export-api="exportModel.exportApi"
          :async="exportModel.async"
          :pool="exportModel.pool"
          :task-type="exportModel.taskType"
          name="OmsTransOrdersList_Export_exportTransOrderList"
          code="OmsTransOrdersList_Export"
          size="small"
          class="btn-right"
        >{{ $t('exportDeliveryList') }}</ody-batch-export-button>
        <ody-batch-import-button
          :download-label="importModel.downloadLabel"
          :import-api="importModel.importApi"
          :import-label="importModel.importLabel"
          :download-local-file="importModel.downloadLocalFile"
          :async="importModel.async"
          :pool="importModel.pool"
          :task-type="importModel.taskType"
          name="OmsTransOrdersList_Import_importTransOrderList"
          code="OmsTransOrdersList_Import"
          size="small"
          class="btn-right"
        >{{ $t('do_import_result') }}</ody-batch-import-button>
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
          class="btn-right"
        >{{ $t('导入批量物流发货') }}</ody-batch-import-button>
        <!-- <el-button name="doDelivery" size="small" class="btn-right" @click="batchDelivery">{{ $t('导入批量物流发货') }}</el-button> -->
        <el-popover placement="bottom" with="160" trigger="hover" class="btn-right">
          <div class="btn-popover">
            <ody-import-task-button
              pool="oms"
              task-type="doImport"
              name="Do_seeImportTask"
              code="OmsTransOrdersList_Task"
              size="small"
            >{{ $t('seeImportTask') }}</ody-import-task-button>
            <ody-export-task-button
              pool="oms"
              task-type="doExport"
              name="Do_seeExportTask"
              code="OmsTransOrdersList_Task"
              size="small"
            >{{ $t('seeExportTask') }}</ody-export-task-button>
            <ody-import-task-button
              pool="oms"
              task-type="redevDoImport"
              name="Do_seeImportTask"
              code="OmsTransOrdersList_Task"
              size="small"
            >{{ $t('查看导入发货物流任务') }}</ody-import-task-button>
          </div>
          <ody-button slot="reference" name="OmsTransOrdersList_Task" code="OmsTransOrdersList_Task" size="small" class="btn-right">
            {{ $t('seeTask') }}
            <i class="el-icon-arrow-down" />
          </ody-button>
        </el-popover>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :can-filter="false"
          :operates="operates"
          :multiple="true"
          :checked.sync="checked"
          :selectable="handleSelectable"
          name="list681"
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
    <soExportTask :visible.sync="visibleOfTask" :code="exportCode" task-type="7,8" />
    <ody-dialog :visible.sync="dialogTableVisible" :title="$t('do_import_result')">
      <el-form ref="fileUpload" :model="fileUpload" :inline="true" :rules="rules">
        <el-row align="center">
          <el-col align="center">
            <el-form-item :label="$t('common_fileUpload')" prop="fileNames">
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
                <el-button type="primary" size="small">{{ $t('common_chooseFile') }}</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-button
              name="downLoadTemplate"
              type="primary"
              size="small"
              @click="downLoadTemplate"
            >{{ $t('common_import_fileModel') }}</el-button>
          </el-col>
          <el-col :span="12" align="right">
            <el-button name="cancelSubmit" type="primary" size="small" @click="cancelSubmit">{{ $t('cancel') }}</el-button>
            <el-button
              name="onSubmitUploadFile"
              type="primary"
              size="small"
              @click="onSubmitUploadFile('fileUpload')"
            >{{ $t('common_save') }}</el-button>
          </el-col>
        </el-row>
      </el-form>
    </ody-dialog>
    <uploadDeliverGoods v-if="dialogVisible" :dialog-visible.sync="dialogVisible" :data-type="2" @uploadSuccess="uploadSuccess"/>
  </section>
</template>

<script>
import soExportTask from '@/components/soExportTask'
import soUtils from '@/utils/soUtils'
import doImportResultTemplate from '@/excelFile/doImportResultTemplate.xlsx'
import uploadDeliverGoods from '@/components/uploadDeliverGoods'
export default {
  name: 'OmsTransOrdersList',
  components: {
    soExportTask,
    uploadDeliverGoods
  },
  data() {
    const vue = this
    return {
      importModel: {
        importApi: ['oms-web', 'do', 'importData', {}],
        importLabel: this.$t('导入发货结果'),
        downloadLocalFile: [require('@/excelFile/doImportResultTemplate.xlsx'), '交货单导入模板.xlsx'],
        pool: 'oms',
        taskType: 'doImport',
        async: true
      },
      importModelLogistics: {
        importApi: ['oms-web', 'redevImportPackage', 'importData', { type: 2 }],
        importLabel: this.$t('导入批量物流发货'),
        downloadLocalFile: [require('@/excelFile/importDoTemplate.xlsx'), '有仓商品发货导入模板.xlsx'],
        pool: 'oms',
        taskType: 'redevDoImport',
        async: true
      },
      exportModel: {
        exportApi: ['oms-web', 'do', 'exportData'],
        pool: 'oms',
        taskType: 'doExport',
        async: true,
        getExportData: () => {
          return { filters: this.getFilters() }
        }
      },
      checked: [],
      dialogTableVisible: false,
      visibleOfTask: false,
      merchants: [],
      warehouseList: [],
      doStatusList: [],
      operaMerchantId: null,
      distributionModeItems: [],
      fileUpload: {
        fileNames: '',
        file: ''
      },
      fileList: [],
      soTypeList: [],
      province_list: [],
      packageStatus: [],
      city_list: [],
      area_list: [],
      activeState: '0',
      searchForm: getDefaultSearchForm(),
      searchName: 'doCode',
      loading: false,
      doUpload: '/api/oms-web/do/import',
      list: [],
      storeList: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      dialogVisible: false,
      files: null,
      goodReceiverAddressAll: '',
      rules: {
        fileNames: [
          {
            required: true,
            message: vue.$t('common_please_selectFile'),
            trigger: 'blur'
          }
        ]
      },
      timeButtons: [
        {
          label: this.$t('today'),
          type: '',
          start: 0,
          end: 0
        },
        {
          label: this.$t('yesterday'),
          type: '',
          start: -1,
          end: -1
        },
        {
          label: this.$t('nearly7Days'),
          type: '',
          start: -7,
          end: 0
        },
        {
          label: this.$t('nearly30Days'),
          type: '',
          start: -30,
          end: 0
        }
      ],
      columns: [
        {
          show: true,
          prop: 'doCode',
          label: this.$t('do_do_code'),
          align: 'center',
          render: (h, params) => {
            return (
              <a
                on-click={() => {
                  this.$router.push({
                    name: 'OmsTransOrderListDetail',
                    params: { id: params.row.doCode, status: params.row.status }
                  })
                }}
              >
                <span style='color:#1890FF'>{params.row.doCode}</span>
              </a>
            )
          }
        },
        {
          show: true,
          prop: 'statusStr',
          label: this.$t('do_do_status'),
          align: 'center',
          formatter: (row, column, cellValue) => {
            return this.doStautsMap[row.status]
          }
        },
        {
          show: true,
          prop: 'warehouseName',
          label: this.$t('do_warehouse'),
          align: 'center'
        },
        {
          show: true,
          prop: 'storeName',
          label: this.$t('order_shop'),
          align: 'center'
        },
        {
          show: true,
          prop: 'orderCode',
          label: this.$t('do_order_code'),
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
                click: () => {
                  this.seeOrder(h, item)
                }
              },
              domProps: {
                innerHTML: item.row.orderCode
              }
            })
          }
        },
        {
          show: true,
          prop: 'goodReceiverName',
          label: this.$t('receipt_information'),
          align: 'center',
          tooltip: false,
          render: (h, params) => {
            if (params.row.goodReceiverName) {
              return (
                <span>
                  <el-tooltip effect='dark' placement='top'>
                    <div slot='content'>
                      <div>
                        <span>收货人：</span>
                        <span>{params.row.goodReceiverName}</span>
                        <br />
                        <span>手机号：</span>
                        <span>{params.row.goodReceiverMobile}</span>
                        <br />
                        <span>地址：</span>
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
          prop: 'createTime',
          label: this.$t('common_createTime')
        }
      ],
      operates: {
        fixed: 'right',
        align: 'center',
        list: [
          {
            label: this.$t('cancel'),
            method: (index, row) => {
              this.cancelDeliverOrder(row)
            },
            hidden: (index, row) => {
              return !(row.status < 2030 && row.deliveredNum <= 0)
            },
            code: 'OmsTransOrdersList_Cancel'
          },
          {
            label: this.$t('deliver1'),
            method: (index, row) => {
              vue.$router.push({
                name: 'OmsTransOrderListDetail',
                params: {
                  id: row.doCode,
                  status: row.status,
                  show: true
                }
              })
            },
            hidden: (index, row) => {
              // row.wmsSwitch === 0
              return !(row.status < 2030) || row.wmsSwitch !== 0
            },
            code: 'OmsTransOrdersList_Dispatch'
          }
        ]
      },
      handleSelectable(row, index) {
        return row.status < 2030 && row.deliveredNum <= 0
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
  activated() {
    this.updateList()
  },
  methods: {
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
    onBatchCancel() {
      // 批量取消
      if (this.checked && this.checked.length > 0) {
        this.$confirm(
          this.$t('whether_to_confirm_the_cancellation') + '?',
          this.$t('common_batch_cancel'),
          {
            confirmButtonText: this.$t('common_confirm'),
            cancelButtonText: this.$t('common_cancel'),
            type: 'warning'
          }
        ).then(() => {
          const doCodeList = this.checked.map(o => o.doCode)
          this.$oms.$api.do
            .batchCancelDo({
              doCodeList: doCodeList
            })
            .then(data => {
              if (data) {
                this.checked = []
                this.updateList()
                this.$message(this.$t('promptOperateSuccess'))
              } else {
                this.$message(this.$t('common_request_fail') + data.message)
              }
            })
        })
      }
    },
    getFilters() {
      const filters = JSON.parse(JSON.stringify(this.searchForm))
      if (filters.createTime) {
        filters.startCreateTime = filters.createTime[0]
        filters.endCreateTime = filters.createTime[1]
        delete filters.createTime
      }
      if (filters.doLogisticsTime) {
        filters.startDoLogisticsTime = filters.doLogisticsTime[0]
        filters.endDoLogisticsTime = filters.doLogisticsTime[1]
        delete filters.doLogisticsTime
      }
      if (filters.searchValue) {
        filters[this.searchName] = filters.searchValue
        delete filters.searchValue
      }
      return filters
    },
    exportTransOrderList() {
      const filters = JSON.parse(JSON.stringify(this.searchForm))
      if (filters.createTime) {
        filters.startCreateTime = filters.createTime[0]
        filters.endCreateTime = filters.createTime[1]
        delete filters.createTime
      }
      if (filters.doLogisticsTime) {
        filters.startDoLogisticsTime = filters.doLogisticsTime[0]
        filters.endDoLogisticsTime = filters.doLogisticsTime[1]
        delete filters.doLogisticsTime
      }
      if (filters.searchValue) {
        filters[this.searchName] = filters.searchValue
        delete filters.searchValue
      }
      this.$oms.$api.do
        .transOrdersListExport({
          filters: filters,
          limit: this.page.size,
          page: this.page.current,
          sorts: [
            {
              field: 'createTime'
            }
          ]
        })
        .then(resp => {
          if (resp.success) {
            this.$confirm(
              this.$t('exportPromptInfoSuccess') +
                resp.data +
                this.$t('exportPromptInfoConfirm'),
              this.$t('exportPrompt'),
              {
                confirmButtonText: this.$t('common_confirm'),
                type: 'info',
                showCancelButton: false
              }
            ).then(() => {
              this.seeTask()
            })
          }
        })
    },
    seeTask() {
      // 查看任务列表
      this.visibleOfTask = true
    },
    importTransOrderList() {
      this.dialogTableVisible = true
      this.fileUpload.fileNames = ''
    },
    downLoadTemplate() {
      // this.$portal.downloadFileByGet('/oms-static/excelFile/doImportResultTemplate.xlsx', {}, '交货单导入模板.xlsx')
      // this.$portal.downloadFileByGet('/static/oms/excelFile/doImportResultTemplate.xlsx', {}, '交货单导入模板.xlsx')
      this.$portal.downloadFileByGet(
        doImportResultTemplate,
        {},
        '交货单导入模板.xlsx'
      )
    },
    cancelSubmit() {
      this.dialogTableVisible = false
      this.fileUpload.fileNames = ''
    },
    handlePreview(file) {
      this.fileUpload.fileNames = file.name
    },
    handleSuccess(response, file, fileList) {
      let result = ''
      if (response.data != null) {
        result = response.data
      }
      this.$confirm(
        this.$t('importPromptInfoSuccess') +
          result +
          this.$t('importPromptInfoConfirm'),
        this.$t('importPrompt'),
        {
          confirmButtonText: this.$t('common_confirm'),
          type: 'info',
          showCancelButton: false
        }
      ).then(() => {
        this.dialogTableVisible = false
        this.seeTask()
      })
      loadList(this)
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
      this.searchName = 'doCode'
      this.searchForm = getDefaultSearchForm()
      this.handleSearchSubmit()
    },
    handlePageSizeChange() {
      this.handleSearchSubmit()
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    cancelDeliverOrder(row) {
      this.$confirm(this.$t('确认取消发货任务吗') + '？', this.$t('提示'), {
        confirmButtonText: this.$t('common_confirm'),
        type: 'info',
        showCancelButton: true
      }).then(() => {
        if (row.wmsSwitch === 1 && row.status === 2010) {
          this.$oms.$api.common
            .dataexTransOrdersDetailCancel({
              doCode: row.doCode,
              warehouseCode: row.warehouseCode
            })
            .then(data => {
              if (data) {
                this.updateList()
                this.$message(this.$t('promptOperateSuccess'))
              } else {
                this.$message(this.$t('common_request_fail') + data.message)
              }
            })
        } else {
          this.$oms.$api.do
            .transOrdersDetailCancel({
              doCode: row.doCode,
              warehouseCode: row.warehouseCode
            })
            .then(data => {
              if (data) {
                this.updateList()
                this.$message(this.$t('promptOperateSuccess'))
              } else {
                this.$message(this.$t('common_request_fail') + data.message)
              }
            })
        }
      })
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
    _listStoreList() {
      const vue = this
      // this.$oms.$api.common.storeList({}).then((result) => {
      //   vue.storeList = result.data.listObj
      // })
      this.$oms.$api.merchantApi
        .queryPlatformAuthStorePage({ currentPage: 1, itemsPerPage: 500 })
        .then(res => {
          vue.storeList = res.data.listObj
        })
    },
    _initMerchants() {
      const vue = this
      // this.$oms.$api.common.merchantList({ 'currentPage': 1, 'itemsPerPage': 1000 }).then((data) => {
      //   vue.merchants = data.data.listObj
      // })
      this.$oms.$api.merchantApi
        .queryPlatformAuthMerchantPage({ currentPage: 1, itemsPerPage: 500 })
        .then(data => {
          vue.merchants = data.data.listObj
        })
    },
    _initTypeList() {
      const vue = this
      this.$oms.$api.soType.soTypeList({}).then(data => {
        vue.soTypeList = data.data
      })
    },
    _initDistributionModeItem() {
      this.$oms.$api.common
        .listByCategorysForOrder({ categorys: ['DO_STATUS'] })
        .then(data => {
          this.doStatusList = data.data.DO_STATUS
          this.doStautsMap = data.data.DO_STATUS.reduce((m, i) => {
            m[i.code] = i.name
            return m
          }, {})
        })
      this.$oms.$api.distributionModeItem
        .distributionModeItemListForSelect({})
        .then(data => {
          this.distributionModeItems = data.data
          this.distributionModeItemsMap = data.data.reduce((m, i) => {
            m[i.shippingCode] = i.distributionMode
            return m
          }, {})
        })
    },
    _initOperaMerchant() {
      this.$oms.$api.common.getUserMerchantInfo().then(data => {
        this.operaMerchantId = data.data.operaMerchant.merchantId
        this.loadWarehouseByMerchant(this.operaMerchantId)
      })
    },
    loadWarehouseByMerchant(merchantId) {
      const vue = this
      vue.warehouseList = []
      // const warehouse = this.$oms.$api.common.listStoreWarehouse({ 'isVirtualWarehouse': 0, 'merchantId': merchantId == null ? vue.searchForm.merchantId : merchantId }).then((data) => {
      //   vue.warehouseList = data.data
      // })
      // this.warehouseList = warehouse.data.listObj
      this.$oms.$api.merchantApi
        .queryPlatformAuthWarehousePage({
          currentPage: 1,
          itemsPerPage: 500,
          isVirtualWarehouse: 0,
          merchantId:
            merchantId == null ? vue.searchForm.merchantId : merchantId
        })
        .then(data => {
          vue.warehouseList = data.data.listObj
        })
    },
    init() {
      this._listStoreList()
      this._initMerchants()
      this._initTypeList()
      this._initDistributionModeItem()
      this.loadWarehouseByMerchant()
      this.queryAera('100000', 1)
      this.updateList()
      this._initOperaMerchant()
    },
    seeOrder(h, params) {
      soUtils.toOrderDetail(
        this,
        params.row.orderCode,
        params.row.orderSource,
        params.row.sysCode
      )
    },
    resetTimeButtons() {
      this.timeButtons.forEach(item => {
        item.type = ''
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
async function loadList(vue) {
  const filters = JSON.parse(JSON.stringify(vue.searchForm))
  if (filters.createTime) {
    filters.startCreateTime = filters.createTime[0]
    filters.endCreateTime = filters.createTime[1]
    delete filters.createTime
  }
  if (filters.doLogisticsTime) {
    filters.startDoLogisticsTime = filters.doLogisticsTime[0]
    filters.endDoLogisticsTime = filters.doLogisticsTime[1]
    delete filters.doLogisticsTime
  }
  if (filters.searchValue) {
    filters[vue.searchName] = filters.searchValue
    delete filters.searchValue
  }
  const param = {
    filters: filters,
    limit: vue.page.size,
    page: vue.page.current,
    sorts: [
      {
        field: 'createTime'
      }
    ]
  }
  const orderList = vue.$oms.$api.do
  const res = await orderList.transOrdersListListPage(param)
  if (res) {
    const data = res.data
    data.forEach(item => {
      /* 收货信息 */
      item.goodReceiverAddressAll =
        item.goodReceiverProvince +
        item.goodReceiverCity +
        item.goodReceiverArea +
        item.goodReceiverAddress
    })
    vue.list = data
    vue.page.total = res.total
  }
}

function getDefaultSearchForm() {
  return Object.assign(
    {},
    {
      searchValue: null,
      createTime: [],
      doLogisticsTime: []
    }
  )
}
</script>

<style lang="less" scoped>
.cp-date-range-picker .data-time-name .el-button {
  line-height: 32px !important;
  height: 32px !important;
}
.info_class {
  font-size: 14px;
  height: 20px;
  width: 20px;
  line-height: 20px;
  text-align: center;
  display: inline-block;
  color: #109fff;
  border: 1px solid #19a3ff;
  border-radius: 12px;
  margin-left: 10px;
  cursor: default;
}
.btn-right{
  margin-right: 14px;
}
</style>
