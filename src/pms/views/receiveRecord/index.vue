<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item prop="data.searchKey">
            <span slot="label">
              <el-select v-model="searchForm.data.searchKey" :clearable="false" name="search_data_searchKey" @change="onSearchKeyChange">
                <el-option :label="$t('收货记录单号')" value="receiveRecordCode">{{ $t('收货记录单号') }}</el-option>
                <el-option :label="$t('收货人')" value="receiver">{{ $t('收货人') }}</el-option>
                <el-option :label="$t('商品名称')" value="productCname">{{ $t('商品名称') }}</el-option>
              </el-select>
            </span>
            <el-input v-model="searchForm.data.searchValue" name="search_data_searchValue"/>
          </ody-search-item>
          <ody-search-item :label="$t('采购单号')" prop="purchaseOrderCode">
            <el-input v-model="filters.purchaseOrderCode" name="purchaseOrderCode" />
          </ody-search-item>
          <ody-search-item :label="$t('收货任务单号')" prop="receiveCode">
            <el-input v-model="filters.receiveCode" name="receiveCode" />
          </ody-search-item>
          <ody-search-item :label="$t('商家')" :space="1">
            <ody-merchant-select ref="merchantId" v-model="filters.merchantId" value-key="merchantId" name="merchantId" @change="changeMerchant"/>
          </ody-search-item>
          <ody-search-item :label="$t('收货仓库')" prop="warehouseId">
            <el-select v-model="filters.warehouseId" name="warehouseName">
              <el-option
                v-for="(item,index) in warehouseList"
                :key="index"
                :label="item.warehouseName"
                :value="item.warehouseId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('供应商')" :space="1">
            <ody-supplier-choose v-model="filters.supplierId" :selected.sync="selected" :placeholder="$t('请选择')" name="supplierId" value-key="orgId" />
          </ody-search-item>
          <ody-search-item :label="$t('商品编码')" prop="productCode">
            <el-input v-model="filters.productCode" name="productCode" />
          </ody-search-item>
          <ody-search-item :space="2" :label="$t('创建时间')" prop="createTime">
            <ody-date-range-picker ref="createTime" v-model="filters.createTime" :default="7" name="createTime" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="ReceiveRecord_listPage_search"
          code="ReceiveRecord_listPage"
          size="small"
          type="primary"
          @click="defaultSearch"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="btn">
        <ody-batch-export-button
          :get-export-data="exportModel.getExportData"
          :export-api="exportModel.exportApi"
          :async="exportModel.async"
          :pool="exportModel.pool"
          :task-type="exportModel.taskType"
          name="ReceiveRecord_exportData"
          code="ReceiveRecord_exportData"
          size="small"
        >{{ $t('common_export') }}</ody-batch-export-button>
        <ody-export-task-button
          pool="pms"
          task-type="receiveRecordExport"
          name="ReceiveRecord_seeExportTask"
          code="ReceiveRecord_exportData"
          size="small"
        >{{ $t('seeTask') }}</ody-export-task-button>
      </div>
      <div slot="table">
        <ody-table
          v-loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :can-filter="true"
          name="receiveRecordTable">
          <template slot="receiveRecordCode" slot-scope="scope">
            <div>
              <span style="color: #1890FF;" @click="handleView(scope.row)">{{ scope.row.receiveRecordCode }}</span>
            </div>
          </template>
        </ody-table>
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
          @size-change="search"
          @current-change="search"
        />
      </div>
    </ody-list-table-area>
  </section>
</template>
<script>
export default {
  name: 'ReceiveRecord',
  data() {
    return {
      checked: [],
      selected: {},
      exportModel: {
        exportApi: ['pms-web', 'receiveRecord', 'exportData.do'],
        pool: 'pms',
        taskType: 'receiveRecordExport',
        async: true,
        getExportData: () => {
          this.handleFilters()
          return { filters: this.filters }
        }
      },
      loading: false,
      list: [],
      columns: [
        {
          label: this.$t('收货记录单号'),
          slot: 'receiveRecordCode',
          show: true,
          align: 'center',
          minWidth: 180
        },
        {
          label: this.$t('商家'),
          prop: 'merchantName',
          show: true,
          align: 'center',
          minWidth: 140
        },
        {
          label: this.$t('收货仓库'),
          prop: 'warehouseName',
          show: true,
          align: 'center',
          minWidth: 140
        },
        {
          label: this.$t('收货信息'),
          show: true,
          align: 'center',
          minWidth: 140,
          tooltip: false,
          render: (h, params) => {
            if (params.row.receiver) {
              var self = this
              return (
                <span>
                  <el-tooltip effect='dark' placement='top'>
                    <div slot='content'>
                      <div>
                        <span>{self.$t('收货人')}：</span>
                        <span>{params.row.receiver}</span>
                        <br />
                        <span>{self.$t('收货电话')}：</span>
                        <span>{params.row.receiverMobile}</span>
                        <br />
                        <span>{self.$t('收货地址')}：</span>
                        <span>{params.row.receiverAddress}</span>
                        <br />
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
          label: this.$t('收货数量'),
          prop: 'receiveNumTotal',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('供应商'),
          prop: 'supplierName',
          show: true,
          align: 'center',
          minWidth: 140
        },
        {
          label: this.$t('采购单号'),
          prop: 'purchaseOrderCode',
          show: true,
          align: 'center',
          minWidth: 180
        },
        {
          label: this.$t('收货任务单号'),
          prop: 'receiveCode',
          show: true,
          align: 'center',
          minWidth: 180
        },
        {
          label: this.$t('备注'),
          prop: 'remark',
          show: true,
          align: 'center',
          minWidth: 200
        },
        {
          label: this.$t('创建时间'),
          prop: 'createTime',
          show: true,
          align: 'center',
          minWidth: 170,
          formatter: (row, column) => {
            return this.$portal.parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
          }
        }
      ],
      filters: {
        warehouseId: null
      },
      page: {
        page: 1,
        limit: 10
      },
      total: 0,
      searchForm: {
        data: {
          searchKey: 'receiveRecordCode',
          searchValue: '',
          lastSearchKey: null
        }
      },
      warehouseList: []
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    this.init()
  },
  methods: {
    async init() {
      this.search()
    },
    changeMerchant() {
      this.filters.warehouseId = null
      if (this.filters.merchantId) {
        this.loadWarehouseList()
      } else {
        this.warehouseList = []
      }
    },
    defaultSearch() {
      this.page.page = 1
      this.search()
    },
    search() {
      this.loading = true
      this.handleFilters()
      const args = { filters: this.filters, ...this.page }
      this.$pms.$api.receiveRecord.listPage(args).then(
        res => {
          this.loading = false
          this.list = res.data
          this.list.forEach(i => {
            i.receiveNumTotal = Number(i.receiveNumTotal)
          })
          this.total = res.total
        },
        () => {
          this.loading = false
        }
      )
    },
    handleFilters() {
      if (this.filters.createTime) {
        this.filters.startCreateTime = this.filters.createTime[0]
        this.filters.endCreateTime = this.filters.createTime[1]
      } else {
        delete this.filters.startCreateTime
        delete this.filters.endCreateTime
      }
      if (this.searchForm.data.searchValue) {
        this.filters[this.searchForm.data.searchKey] = this.searchForm.data.searchValue
        if (!this.searchForm.data.lastSearchKey) {
          this.searchForm.data.lastSearchKey = this.searchForm.data.searchKey
        }
      } else {
        delete this.filters[this.searchForm.data.searchKey]
      }
    },
    reset() {
      this.checked = []
      this.filters = {
        warehouseId: null,
        createTime: []
      }
      this.$refs.createTime.setDefault(7)
      this.searchForm = {
        data: {
          searchKey: 'receiveRecordCode',
          searchValue: '',
          lastSearchKey: null
        }
      }
      this.warehouseList = []
    },
    onSearchKeyChange() {
      this._cleanSearchValue()
      if (this.searchForm.data.lastSearchKey) {
        delete this.filters[this.searchForm.data.lastSearchKey]
      }
      this.searchForm.data.lastSearchKey = this.searchForm.data.searchKey
    },
    _cleanSearchValue() {
      this.searchForm.data.searchValue = ''
    },
    handleView(row) {
      this.$router.push({
        name: 'ReceiveRecordDetail',
        query: {
          id: row.id,
          receiveRecordCode: row.receiveRecordCode
        }
      })
    },
    async loadWarehouseList() {
      const warehouse = await this.$pms.$api.receiveRecord.queryPlatformAuthWarehousePage(
        {
          currentPage: 1,
          itemsPerPage: 500,
          merchantId: this.filters.merchantId
        }
      )
      this.warehouseList = warehouse.data.listObj
    }
  }
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
