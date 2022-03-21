<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="80px" class="form">
          <ody-search-item>
            <span slot="label">
              <el-select
                v-model="search.data.searchKey"
                :clearable="false"
                name="search_data_searchKey"
                @change="onSearchKeyChange">
                <el-option :label="$t('收货任务单号')" value="receiveCode">{{ $t('收货任务单号') }}</el-option>
                <el-option :label="$t('收货人')" value="receiver">{{ $t('收货人') }}</el-option>
                <el-option :label="$t('商品名称')" value="productCname">{{ $t('商品名称') }}</el-option>
              </el-select>
            </span>
            <el-input v-model="search.data.searchValue" name="search_data_searchValue"/>
          </ody-search-item>
          <ody-search-item :label="$t('采购单号')" :space="1">
            <el-input
              v-model="filters.purchaseOrderCode"
              :placeholder="$t('请输入') + $t('采购单号')"
              name="searchForm_filters_purchaseOrderCode"/>
          </ody-search-item>
          <ody-search-item :label="$t('商家')" prop="merchantId">
            <ody-merchant-select
              v-model="filters.merchantId"
              name="search_merchantId"
              value-key="merchantId"
              @change="initWarehouse"/>
          </ody-search-item>
          <ody-search-item :label="$t('收货仓库')" required>
            <el-select v-model="filters.warehouseId" :placeholder="$t('common_all')" name="searchForm_warehouseId">
              <el-option
                v-for="item in warehouseList"
                :label="item.warehouseName"
                :key="item.warehouseId"
                :value="item.warehouseId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item
            :label="$t('供应商')"
            prop="deliverySupplierCode"
          >
            <ody-supplier-choose
              v-model="filters.supplierId"
              :selected.sync="selected"
              name="search_supplerId"
              value-key="orgId"
              placeholder="请选择"/>
          </ody-search-item>
          <ody-search-item :label="$t('收货任务类型')">
            <el-select v-model="filters.receiveType" :placeholder="$t('全部')" name="search_importType">
              <el-option
                v-for="(value, key) in receiveTypeMap"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('商品编码')" :space="1">
            <el-input
              v-model="filters.productCode"
              :placeholder="$t('请输入') + $t('商品编码')"
              name="searchForm_filters_productCode"/>
          </ody-search-item>
          <ody-search-item :label="$t('创建时间')" :space="2">
            <ody-date-range-picker ref="createTimeRange" v-model="createTimeRange" :default="7" name="createTime"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="ReceiveTask_listPage_search"
          code="ReceiveTask_listPage"
          size="small"
          type="primary"
          @click="query"
        >{{ $t('common_select') }}
        </ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="activeState" :before-leave="handleTabLeave" name="activeState" @tab-click="onTabClick">
          <el-tab-pane v-for="tab in tabs" :key="tab.index">
            <span slot="label">{{ tab.heading }} <span v-show="tab.count > 0">({{ tab.count }})</span></span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="btn">
        <ody-button
          name="ReceiveTask_add_name"
          code="ReceiveTask_add"
          size="small"
          type="primary"
          @click="add"
        >{{ $t('新增收货任务') }}
        </ody-button>
        <ody-button
          name="ReceiveTask_batchDelete"
          code="ReceiveTask_batchDelete"
          size="small"
          @click="batchCancel"
        >{{ $t('batch_cancellation') }}
        </ody-button>
        <ody-batch-export-button
          :get-export-data="exportModel.getExportData"
          :export-api="exportModel.exportApi"
          :async="exportModel.async"
          :pool="exportModel.pool"
          :task-type="exportModel.taskType"
          name="ReceiveTask_exportData_name"
          code="ReceiveTask_exportData"
          size="small"
        >{{ $t('导出') }}
        </ody-batch-export-button>
        <el-popover placement="bottom" with="160" trigger="hover">
          <div class="btn-popover">
            <ody-export-task-button
              pool="pms"
              task-type="receiveTaskExport"
              name="ReceiveTask_seeExportTask"
              code="ui"
              size="small"
            >{{ $t('seeExportTask') }}
            </ody-export-task-button>
          </div>
          <el-button slot="reference" size="small">
            {{ $t('seeTask') }}
            <i class="el-icon-arrow-down"/>
          </el-button>
        </el-popover>
      </div>
      <div slot="table">
        <ody-table
          v-loading="loading"
          :checked.sync="checked"
          :multiple="true"
          :data="list"
          :columns="columns"
          :operates="operates"
          :can-filter="true"
          :selectable="checkedSelectable"
          name="receiveTaskTable"/>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.page"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.limit"
          :total.sync="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="query"
          @current-change="query"
        />
      </div>
    </ody-list-table-area>
    <!-- 收货任务模态框 -->
    <ReceiveModal
      ref="receiveModal"
      :visible.sync="showReceiveModal"
      :receive-detail.sync="receiveDetail"
      :receive-code.sync="receiveCode"
      :receive-type.sync="receiveType"
      @ok="query"/>
    <!-- 一键收货模态框 -->
    <OneKeyReceiveModal
      ref="oneKeyReceiveModal"
      :visible.sync="showOneKeyReceiveModal"
      :receive-code.sync="receiveCode"
      @ok="query"/>
  </section>
</template>
<script>
import ReceiveModal from '@/components/receiveTask/receiveModal'
import OneKeyReceiveModal from '@/components/receiveTask/oneKeyReceiveModal'

export default {
  name: 'ReceiveTaskList',
  components: {
    ReceiveModal,
    OneKeyReceiveModal
  },
  data() {
    const vue = this
    return {
      warehouseList: [],
      showReceiveModal: false,
      showOneKeyReceiveModal: false,
      receiveDetail: {},
      receiveCode: '',
      receiveType: 1,
      tabs: [],
      sumCount: 0,
      receiveStatusCodes: {},
      activeState: 0,
      search: {
        data: {
          searchKey: 'receiveCode',
          searchValue: '',
          lastSearchKey: null
        },
        receiveStatusList: []
      },
      selected: {},
      checked: [],
      filters: {},
      receiveTypeMap: {},
      receiveStatusMap: {},
      receiveStatusList: [],
      importModel: {
        isDownloadLocal: true,
        importApi: ['pms-web', 'receiveTask', 'importData', {}],
        downloadApi: ['excelFile', 'receiveTask-template.xlsx'],
        importLabel: this.$t('导入收货通知单'),
        pool: 'pms',
        taskType: 'receiveTaskImport',
        async: true
      },
      exportModel: {
        exportApi: ['pms-web', 'receiveTask', 'exportData'],
        pool: 'pms',
        taskType: 'receiveTaskExport',
        async: true,
        getExportData: () => {
          this.handleFilters()
          return { filters: this.filters }
        }
      },
      loading: false,
      list: [],
      createTimeRange: [],
      page: {
        page: 1,
        limit: 10
      },
      total: 0,
      columns: [
        {
          label: this.$t('收货任务单号'),
          show: true,
          align: 'center',
          minWidth: 180,
          render: (h, params) => {
            return (
              <a
                on-click={() => {
                  this.handleView(params.row)
                }}
              >
                <span style='color:#1890FF '>{params.row.receiveCode}</span>
              </a>
            )
          }
        },
        {
          label: this.$t('收货任务类型'),
          prop: 'receiveType',
          show: true,
          align: 'right',
          minWidth: 120,
          formatter(row, column) {
            return vue.receiveTypeMap[row.receiveType + '']
          }
        },
        {
          label: this.$t('收货任务状态'),
          prop: 'receiveStatus',
          show: true,
          align: 'right',
          minWidth: 120,
          formatter(row, column) {
            return vue.receiveStatusMap[row.receiveStatus + '']
          }
        },
        {
          label: this.$t('商家'),
          prop: 'merchantName',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('收货仓库'),
          prop: 'warehouseName',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('收货信息'),
          prop: 'receiver',
          show: true,
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            if (params.row.receiver) {
              var self = this
              return (
                <span>
                  <el-tooltip effect='dark' placement='top'>
                    <div slot='content'>
                      <div>
                        <span>{self.$t('收货人姓名')}：</span>
                        <span>{params.row.receiver}</span>
                        <br/>
                        <span>{self.$t('收货人手机')}：</span>
                        <span>{params.row.receiverMobile}</span>
                        <br/>
                        <span>{self.$t('收货地址')}：</span>
                        <span>{params.row.receiverAddress}</span>
                      </div>
                    </div>
                    <i class='el-icon-user'></i>
                  </el-tooltip>
                  <sapn>{params.row.receiver}</sapn>
                </span>
              )
            } else {
              return ''
            }
          }
        },
        {
          label: this.$t('总收货数量'),
          prop: 'sumProductItemNum',
          show: true,
          align: 'right',
          minWidth: 120
        },
        {
          label: this.$t('已收货数量'),
          prop: 'sumReceiveNum',
          show: true,
          align: 'right',
          minWidth: 120
        },
        {
          label: this.$t('供应商'),
          prop: 'supplierName',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('采购单号'),
          prop: 'purchaseOrderCode',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('备注'),
          prop: 'remark',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          label: this.$t('创建时间'),
          align: 'center',
          minWidth: 160,
          formatter: (row, column) => {
            if (row.createTime) {
              return this.$portal.parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
            return ''
          }
        }
      ],
      operates: {
        fixed: 'right',
        width: 120,
        align: 'center',
        list: [
          {
            label: this.$t('取消'),
            code: 'ReceiveTask_delete',
            hidden: (index, row) => {
              return !(row.receiveStatus === 1)
            },
            method: async(index, row) => {
              const res = await this.$confirm(this.$t('确认取消收货任务吗') + '', this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
                cancelButtonText: this.$t('取消'),
                type: 'warning'
              })

              if (!res) {
                return
              }

              const { ...params } = row
              const ids = [params.id]
              const result = await this.$pms.$api.receiveTask.batchCancel(ids)
              if (result && result.code === '0') {
                this.checked = []
                this.$message({
                  type: 'success',
                  message: this.$t('取消成功')
                })
              }
              this.query()
            }
          },
          {
            label: this.$t('收货'),
            code: 'ReceiveTask_receive',
            hidden: (index, row) => {
              return !(row.receiveStatus === 1 || row.receiveStatus === 2)
            },
            method: (index, row) => {
              this.handleReceive(row)
            }
          }, {
            label: this.$t('一键收货'),
            code: 'ReceiveTask_oneKeyReceive',
            // code: 'ui',
            hidden: (index, row) => {
              return !(row.receiveStatus === 1 && row.isBatch === 0)
              // return !(row.receiveStatus === 1)
            },
            method: (index, row) => {
              this.handleOneKeyReceive(row)
            }
          }
          //   method: async(index, row) => {
          //     const res = await this.$confirm(this.$t('确认一键收货吗？') + '', this.$t('提示'), {
          //       confirmButtonText: this.$t('确定'),
          //       cancelButtonText: this.$t('取消'),
          //       type: 'warning'
          //     })
          //
          //     if (!res) {
          //       return
          //     }
          //     const dto = {
          //       receiveCode: row.receiveCode
          //     }
          //     // const { ...params } = row
          //     // const dto = { 'receiveCode': row.receiveCode }
          //     const result = await this.$pms.$api.receiveTask.oneKeyAddReceive(dto)
          //     if (result && result.code === '0') {
          //       this.checked = []
          //       this.$message({
          //         type: 'success',
          //         message: this.$t('一键收货成功')
          //       })
          //     }
          //     this.query()
          //   }
          // }
        ]
      }
    }
  },
  async mounted() {
    this.tabs = [
      {
        label: this.$t('common_all')
      }
    ]
    this.currentTab = this.tabs[0]
    await this.init()
    await this.query()
  },
  methods: {
    async init() {
      this._listReceiveStatusList(this)
      await this.initCodes()
    },
    onSearchKeyChange() {
      this.cleanSearchValue()
      if (this.search.data.lastSearchKey) {
        delete this.filters[this.search.data.lastSearchKey]
        console.log('delete ' + this.search.data.lastSearchKey, this.filters[this.search.data.lastSearchKey])
      }
      this.search.data.lastSearchKey = this.search.data.searchKey
    },
    cleanSearchValue() {
      this.search.data.searchValue = ''
    },
    handleReceive(row) {
      this.showReceiveModal = true
      this.receiveDetail = row
      this.receiveCode = row.receiveCode
    },
    handleOneKeyReceive(row) {
      this.showOneKeyReceiveModal = true
      this.receiveCode = row.receiveCode
      // this.receiveDetail = row
    },
    async initWarehouse() {
      const warehouse = await this.$pms.$api.common.queryPlatformAuthWarehousePage(
        {
          currentPage: 1,
          itemsPerPage: 500,
          merchantId: this.filters.merchantId
        }
      )
      this.warehouseList = warehouse.data.listObj
    },
    _getExportData() {
      this.handleFilters()
      return this.filters
    },
    async initCodes() {
      const vue = this
      const { data } = await this.$pms.$api.receiveTask.listMultiCode({
        categories: ['RECEIVE_TASK_TYPE', 'RECEIVE_TASK_STATUS']
      })
      vue.receiveTypeMap = data.RECEIVE_TASK_TYPE.reduce((m, i) => {
        m[i.code] = i.name
        return m
      }, {})
      vue.receiveStatusMap = data.RECEIVE_TASK_STATUS.reduce((m, i) => {
        m[i.code] = i.name
        return m
      }, {})
      console.log(JSON.stringify(this.receiveStatusMap))
    },
    async onTabClick() {
      const vue = this
      var tab = this.tabs[this.activeState]
      vue.filters.receiveStatus = tab.receiveStatus
      vue.receiveStatus = tab.receiveStatus
      for (var p in this.btns) {
        if (this.btns[p]) {
          this.btns[p] = false
        }
      }
      this.query()
    },
    async query() {
      const vue = this
      vue.loading = true
      vue.handleFilters()
      if (vue.receiveStatus != null) {
        vue.filters.receiveStatus = vue.receiveStatus
      }
      const args = { filters: { ...vue.filters }, ...vue.page }
      console.log(JSON.stringify(args))
      try {
        vue.$pms.$api.receiveTask.listPage(args).then(
          res => {
            vue.loading = false
            vue.list = res.data
            vue.total = res.total
          },
          () => {
            vue.loading = false
          }
        )
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
        this.checked = []
        var tab = this.tabs[this.activeState]
        if (tab && tab.receiveStatus) {
          tab.count = this.total
        }
      }
      this._listReceiveStatusList(this)
    },
    _listReceiveStatusList(vm, args) {
      const vue = this
      var data = args || vm._getExportData()
      delete data.receiveStatus
      const queryArgs = { filters: data, ...vue.page }
      vm.$pms.$api.receiveTask.countByReceiveStatus(queryArgs).then((result) => {
        vm.search.receiveStatusList = result.data || []
        vm.tabs = [{
          heading: this.$t('common_all'),
          index: 0,
          count: vm.sumCount,
          receiveStatus: null
        }]
        vm.sumCount = 0
        // 按code进行排序
        sortBykey(vm.search.receiveStatusList, 'code')
        vm.search.receiveStatusList.forEach(function(item, index) {
          item.code = parseInt(item.code)
          if (item.count) {
            vm.sumCount += item.count
          }
          var statusName = vm.receiveStatusMap[item.code]
          vm.tabs.push({
            heading: vue.$t(statusName),
            count: item.count,
            receiveStatus: item.code,
            index: index + 2
          })
        })
        vm.tabs[0].count = vm.sumCount
      })
    },
    handleFilters() {
      if (this.createTimeRange && this.createTimeRange.length > 1) {
        this.filters.startCreateTime = this.createTimeRange[0]
        this.filters.endCreateTime = this.createTimeRange[1]
      } else {
        // delete this.filters.startCreateTime
        // delete this.filters.endCreateTime
      }
      if (this.search.data.searchValue) {
        if (this.search.data.searchKey === 'receiveCode') {
          this.filters[this.search.data.searchKey] = []
          this.filters[this.search.data.searchKey].push(this.search.data.searchValue)
        } else {
          this.filters[this.search.data.searchKey] = this.search.data.searchValue
        }
        if (!this.search.data.lastSearchKey) {
          this.search.data.lastSearchKey = this.search.data.searchKey
        }
      } else {
        delete this.filters[this.search.data.searchKey]
      }
    },
    reset() {
      this.checked = []
      this.filters = {}
      this.createTimeRange = []
      this.$refs.createTimeRange.setDefault(7)
      this.search = {
        data: {
          searchKey: 'receiveCode',
          searchValue: '',
          lastSearchKey: null
        }
      }
    },
    add() {
      this.$router.push({
        name: 'ReceiveTaskAdd',
        query: {
          readonly: false
        }
      })
    },
    checkedSelectable(row, index) {
      return (row.receiveStatus === 1)
    },
    handleView(row) {
      this.$router.push({
        name: 'ReceiveTaskDetail',
        params: {
          receiveCode: row.receiveCode
        }
      })
    },
    async batchCancel() {
      if (this.checked.length === 0) {
        return this.$message(this.$t('errorAuditSelectAtLeastOne'))
      }
      const confirm = await this.$confirm(
        this.$t('是否取消选中的') + this.$t('收货任务'),
        this.$t('common_prompt')
      )
      if (confirm) {
        if (this.checked && this.checked.length > 0) {
          const ids = this.checked.map(x => x['id'])
          const result = await this.$pms.$api.receiveTask.batchCancel(ids)
          if (result && result.code === '0') {
            this.checked = []
            this.query()
            this.$message({
              type: 'success',
              message: this.$t('取消成功')
            })
          }
        }
      }
    }
  }
}
function sortBykey(ary, key) {
  return ary.sort(function(a, b) {
    const x = a[key]
    const y = b[key]
    return ((x < y) ? -1 : (x > y) ? 1 : 0)
  })
}
</script>
<style lang="scss" scoped>
.popover-container {
  .popover-input {
    margin-bottom: 10px;
  }
}
.btn-popover {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .el-button {
    margin-bottom: 4px;
  }
}
</style>
