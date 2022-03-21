<template>
  <section class="pg-soError-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('do_order_code') + ':'" prop="orderCode">
            <el-input v-model="searchForm.orderCode" name="searchForm_orderCode" maxlength="25" />
          </ody-search-item>
          <ody-search-item :label="$t('so_error_time') + ':'" :space="2" class="register" prop="errorTime">
            <ody-date-range-picker
              v-model="searchForm.errorTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="searchForm_errorTime"
              value-format="yyyy-MM-dd"
              type="date"
              range-separator="-"
            />
          </ody-search-item>
          <ody-search-item :label="$t('so_error_type') + ':'" prop="type">
            <el-select v-model="searchForm.type" :placeholder="$t('common_all')" name="searchForm_type">
              <el-option
                v-for="item in typeList"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('so_error_status') + ':'" prop="status">
            <el-select v-model="searchForm.status" :placeholder="$t('common_all')" name="searchForm_status">
              <el-option
                v-for="item in statusList"
                :label="$t('' + item.name)"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('do_merchant_name') + ':'" prop="merchantId">
            <el-select v-model="searchForm.merchantId" :popper-append-to-body="false" :placeholder="$t('common_all')" name="searchForm_merchantId">
              <el-option
                v-for="item in merchants"
                :label="item.merchantName"
                :key="item.merchantId"
                :value="item.merchantId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('so_error_remark_time') + ':'" :space="2" class="register" prop="remarkTime">
            <ody-date-range-picker
              v-model="searchForm.remarkTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="searchForm_remarkTime"
              value-format="yyyy-MM-dd"
              type="date"
              range-separator="-"
            />
          </ody-search-item>
          <ody-search-item :label="$t('so_error_order_create_time') + ':'" :space="2" class="register" prop="orderCreateTime">
            <ody-date-range-picker
              v-model="searchForm.orderCreateTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="searchForm_orderCreateTime"
              value-format="yyyy-MM-dd"
              type="date"
              range-separator="-"
            />
          </ody-search-item>
          <ody-search-item :label="$t('do_store_name') + ':'" prop="storeName">
            <el-input v-model="searchForm.storeName" name="searchForm_storeName" maxlength="25" />
          </ody-search-item>
          <ody-search-item :label="$t('so_error_create_username') + ':'" prop="soUserName">
            <el-input v-model="searchForm.soUserName" name="searchForm_soUserName" />
          </ody-search-item>
          <ody-search-item :label="$t('deliveryName') + ':'" prop="goodReceiverName">
            <el-input v-model="searchForm.goodReceiverName" name="searchForm_goodReceiverName" />
          </ody-search-item>
          <ody-search-item :label="$t('deliveryMobile') + ':'" prop="goodReceiverMobile">
            <el-input v-model="searchForm.goodReceiverMobile" name="searchForm_goodReceiverMobile" />
          </ody-search-item>
          <ody-search-item :space="2" :label="$t('goodReceiverAddress') + ':'" prop="goodReceiverProvinceCode">
            <el-col :span="8">
              <el-select
                id="s_province"
                v-model="searchForm.goodReceiverProvinceCode"
                :popper-append-to-body="false"
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
            </el-col>
            <el-col :span="8">
              <el-select
                id="s_city"
                :popper-append-to-body="false"
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
            </el-col>
            <el-col :span="8">
              <el-select
                id="s_area"
                :popper-append-to-body="false"
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
            </el-col>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <ody-button name="OmsSoError_Reset_handleSearchReset" code="OmsSoError_Reset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</ody-button>
        <ody-button
          name="OmsSoError_Query_handleSearchSubmit"
          code="OmsSoError_Query"
          size="small"
          type="primary"
          @click="handleSearchSubmit"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          :disabled="checked.length == 0"
          name="OmsSoError_Handle_addRemark"
          code="OmsSoError_Handle"
          size="small"
          class="btn-right"
          @click="addRemark()"
        >{{ $t('so_error_mark_handled') }}</ody-button>
        <!-- <ody-button name="OmsSoError_Export_exportItem" code="OmsSoError_Export" size="small" @click="exportItem">{{ $t('common_export') }}</ody-button>-->
        <ody-batch-export-button
          :get-export-data="exportModel.getExportData"
          :export-api="exportModel.exportApi"
          :async="exportModel.async"
          :pool="exportModel.pool"
          :task-type="exportModel.taskType"
          name="OmsSoError_Export_exportItem"
          code="OmsSoError_Export"
          size="small"
          class="btn-right"
        >{{ $t('common_export') }}</ody-batch-export-button>
        <ody-export-task-button
          pool="oms"
          task-type="soErrorExport"
          name="OmsSoError_Task_openOrderTaskList"
          code="OmsSoError_Task"
          size="small"
          class="btn-right"
        >{{ $t('seeExportTask') }}</ody-export-task-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :multiple="multiple"
          :checked.sync="checked"
          name="list283"
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
    <MarkHandled :visible.sync="visible" :ids.sync="ids" @ok="handleOk" />
  </section>
</template>

<script>
import MarkHandled from '@/components/soError'
import ToOrderDetail from '@/components/so/toDetail'

export default {
  name: 'OmsSoError',
  components: {
    MarkHandled,
    ToOrderDetail
  },
  data() {
    const self = this
    return {
      exportModel: {
        exportApi: ['oms-web', 'soError', 'exportData'],
        pool: 'oms',
        taskType: 'soErrorExport',
        async: true,
        getExportData: () => {
          return { filters: getFilters(self) }
        }
      },
      visible: false,
      selectedItem: null,
      ids: [],
      checked: [],
      merchants: [],
      statusList: [
        { code: 0, name: 'so_error_need_handle' },
        { code: 1, name: 'so_error_handled' }
      ],
      typeList: [],
      province_list: [],
      city_list: [],
      area_list: [],
      searchForm: getDefaultSearchForm(self),
      loading: false,
      multiple: true,
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      operates: {
        width: 150,
        fixed: 'right',
        list: [
          {
            label: this.$t('so_error_mark_handled'),
            hidden: (index, row) => {
              return row.status !== 0
            },
            method: (index, row) => {
              this.addRemark(row)
            },
            code: 'OmsSoError_Handle'
          },
          {
            label: this.$t('so_error_mark_unhandled'),
            hidden: (index, row) => {
              return row.status === 0
            },
            method: (index, row) => {
              this.unhandled(row)
            },
            code: 'OmsSoError_Handle'
          }
        ]
      },
      columns: [
        {
          show: true,
          prop: 'orderCode',
          label: this.$t('orderCode'),
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            return (
              <ToOrderDetail
                orderCode={params.row.orderCode}
                orderSource={params.row.orderSource}
                sysSource={params.row.sysSource}
              >
                <span>{params.row.orderCode}</span>
              </ToOrderDetail>
            )
          }
        },
        {
          show: true,
          prop: 'soTypeStr',
          label: this.$t('order_ports_type'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'soUserName',
          label: this.$t('so_error_userAccount'),
          align: 'center'
        },
        {
          show: true,
          prop: 'goodReceiverName',
          label: this.$t('deliveryName'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'goodReceiverMobile',
          label: this.$t('deliveryMobile'),
          align: 'center'
        },
        {
          show: true,
          prop: 'goodReceiverAddressStr',
          label: this.$t('goodReceiverAddress'),
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            if (params.row.goodReceiverAddressStr) {
              const goodReceiverAddressStr = params.row.goodReceiverAddressStr
                .split('\n')
                .map(item => {
                  return <div>{item}</div>
                })
              return <span>{goodReceiverAddressStr}</span>
            }
            return ''
          }
        },
        {
          show: true,
          prop: 'orderCreateTime',
          label: this.$t('so_error_order_create_time'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'errorTypeStr',
          label: this.$t('errorType'),
          align: 'center'
        },
        {
          show: true,
          prop: 'typeStr',
          label: this.$t('so_error_type'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'errorReasonStr',
          label: this.$t('errorReason'),
          align: 'center',
          render: (h, params) => {
            return (
              <el-link on-click={() => {
                this.$portal.openWindow('/oms-web/public/flow/chart?flow=' + params.row.flow + '&flowCode=' + params.row.flowCode,
                  'FlowChart-' + params.row.flow + '-' + params.row.flowCode)
              }}>{params.row.errorReasonStr}</el-link>
            )
          }
        },
        {
          show: true,
          prop: 'errorRemark',
          label: this.$t('errorRemark'),
          align: 'center'
        },
        {
          show: true,
          prop: 'statusStr',
          label: this.$t('so_error_status'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'remarkTime',
          label: this.$t('so_error_remark_time'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'remark',
          label: this.$t('errorProcessingContents'),
          align: 'center'
        },
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('do_merchant_name'),
          align: 'center'
        },
        {
          show: true,
          prop: 'storeName',
          label: this.$t('do_store_name')
        }
      ]
    }
  },
  async mounted() {
    try {
      if (this.$route.params.code) {
        this.initWithCode(this.$route.params.code)
      } else {
        this.init()
      }
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    addRemark(row) {
      this.ids = []
      if (row) {
        this.ids.push(row.id)
      } else if (this.checked) {
        for (let i = 0; i < this.checked.length; i++) {
          if (this.checked[i].status === 1) {
            this.$message({
              type: 'warning',
              message: this.$t('so_error_existing_wrong_order')
            })
            return
          }
          this.ids.push(this.checked[i].id)
        }
      }
      this.visible = true
    },
    exportItem() {
      const filters = getFilters(this)
      const formMap = {}
      for (const p in filters) {
        if (filters[p]) {
          formMap['map[' + p + ']'] = filters[p]
        }
      }
      this.$portal.downloadFileByPost('/api/oms-web/soError/export', formMap)
    },
    async unhandled(row) {
      const params = {
        id: row.id
      }
      const res = await this.$oms.$api.soError.soErrorUnhandle(params)
      if (res.code === '0') {
        this.$message({
          type: 'success',
          message: this.$t('so_error_unhandled_update_success')
        })
      } else {
        this.$message({
          type: 'error',
          message: res.message
        })
      }
      this.updateList()
    },
    handleOk() {
      this.checked = []
      this.updateList()
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
      this.page.current = 1
      await this.updateList()
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm(this)
    },
    async handlePageSizeChange(size) {
      this.handleSearchSubmit()
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
    _initMerchants() {
      const vue = this
      this.$oms.$api.common
        .merchantList({ currentPage: 1, itemsPerPage: 1000 })
        .then(data => {
          vue.merchants = data.data.listObj
        })
    },
    _initCodes() {
      const vue = this
      this.$oms.$api.common
        .listByCategorysForOrder({ categorys: ['so_error_type'] })
        .then(data => {
          if (data.code === '0') {
            vue.typeList = data.data.so_error_type
          }
        })
    },
    _initDefault() {
      this._initCodes()
      this._initMerchants()
      this.queryAera('100000', 1)
    },
    init() {
      this._initDefault()
      this.updateList()
    },
    initWithCode(code) {
      this._initDefault()
      this.searchForm.orderCode = code
      this.searchForm.errorTime = null
      this.searchForm.orderCreateTime = null
      this.updateList()
    }
  }
}
function getFilters(vue) {
  const filters = JSON.parse(JSON.stringify(vue.searchForm))
  if (filters.errorTime) {
    filters.errorTimeStart = filters.errorTime[0]
    filters.errorTimeEnd = filters.errorTime[1]
    delete filters.errorTime
  }
  if (filters.remarkTime) {
    filters.remarkTimeStart = filters.remarkTime[0]
    filters.remarkTimeEnd = filters.remarkTime[1]
    delete filters.remarkTime
  }
  if (filters.orderCreateTime) {
    filters.orderCreateTimeStart = filters.orderCreateTime[0]
    filters.orderCreateTimeEnd = filters.orderCreateTime[1]
    delete filters.orderCreateTime
  }
  return filters
}

async function loadList(vue) {
  const param = {
    filters: getFilters(vue),
    limit: vue.page.size,
    page: vue.page.current
  }
  const soError = vue.$oms.$api.soError

  const res = await soError.soErrorListPage(param)
  if (res) {
    const data = res.data
    vue.list = data
    vue.page.total = res.total
  }
}

function getDefaultSearchForm(vue) {
  const currentDate = new Date()
  const lastTwoWeek = new Date()
  lastTwoWeek.setDate(lastTwoWeek.getDate() - 14)

  return Object.assign(
    {},
    {
      goodReceiverProvinceCode: null,
      goodReceiverCityCode: null,
      goodReceiverAreaCode: null,
      errorTime: [
        vue.$portal.parseTime(lastTwoWeek, '{y}-{m}-{d}'),
        vue.$portal.parseTime(currentDate, '{y}-{m}-{d}')
      ],
      orderCreateTime: [
        vue.$portal.parseTime(lastTwoWeek, '{y}-{m}-{d}'),
        vue.$portal.parseTime(currentDate, '{y}-{m}-{d}')
      ]
    }
  )
}
</script>

<style lang="scss" scoped>
.btn-right{
  margin-right: 16px;
}
</style>
