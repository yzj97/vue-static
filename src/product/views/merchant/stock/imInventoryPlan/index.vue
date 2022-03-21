<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('盘点单') + ':'" prop="inventoryCode">
            <el-input v-model="queryParam.inventoryCode" name="queryParam_inventoryCode" />
          </ody-search-item>
          <ody-search-item :label="$t('商家') + ':'" prop="merchantId">
            <el-select
              v-model="queryParam.merchantId"
              :placeholder="$t('全部')"
              name="queryParam_merchantId"
              clearable
              @change="getWarehouseByMerchantId(queryParam.merchantId)">
              <el-option
                v-for="item in merchantList"
                :key="item.merchantId"
                :label="item.merchantName"
                :value="item.merchantId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('仓库') + ':'" prop="warehouseId">
            <el-select
              :disabled="!queryParam.merchantId || queryParam.merchantId === ''"
              v-model="queryParam.warehouseId"
              :placeholder="$t('全部')"
              clearable
              name="queryParam_warehouseId">
              <el-option
                v-for="item in warehouseList"
                :key="item.warehouseId"
                :label="item.warehouseName"
                :value="item.warehouseId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('盘点类型') + ':'" prop="inventoryType">
            <el-select v-model="queryParam.inventoryType" :placeholder="$t('全部')" name="queryParam_inventoryType" clearable>
              <el-option
                v-for="item in inventoryTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('盘点状态') + ':'" prop="inventoryStatus">
            <el-select v-model="queryParam.inventoryStatus" :placeholder="$t('全部')" name="queryParam_inventoryStatus" clearable>
              <el-option
                v-for="item in inventoryStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('商品编码') + ':'" prop="productCode">
            <el-input v-model="queryParam.productCode" name="queryParam_productCode" />
          </ody-search-item>
          <ody-search-item :label="$t('SPU编码') + ':'" prop="productSpuCode">
            <el-input v-model="queryParam.productSpuCode" name="queryParam_productSpuCode" />
          </ody-search-item>
          <ody-search-item :label="$t('货号') + ':'" prop="productArtNo">
            <el-input v-model="queryParam.productArtNo" name="queryParam_productArtNo" />
          </ody-search-item>
          <ody-search-item :label="$t('条码') + ':'" prop="productBarCode">
            <el-input v-model="queryParam.productBarCode" name="queryParam_productBarCode" />
          </ody-search-item>
          <ody-search-item :label="$t('创建人') + ':'" prop="createUsername">
            <el-input v-model="queryParam.createUsername" name="queryParam_createUsername" />
          </ody-search-item>
          <ody-search-item :label="$t('创建时间') + ':'" prop="createTime">
            <ody-date-range-picker ref="createTime" v-model="queryParam.createTime" :default="7" name="createTime" type="datetimer" />
          </ody-search-item>
          <ody-search-item :label="$t('盘点时间') + ':'" prop="inventoryTime">
            <ody-date-range-picker ref="inventoryTime" v-model="queryParam.inventoryTime" name="inventoryTime" type="datetimer" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('重置') }}</el-button>
        <el-button
          name="ImInventoryPlanQuery"
          size="small"
          type="primary"
          @click.native="handleQuery"
        >{{ $t('查询') }}</el-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="activeState" name="activeState" class="inventory_tabs" @tab-click="onTabClick">
          <el-tab-pane v-for="tab in tabs" :key="tab.index">
            <span slot="label">{{ tab.heading }} <span v-show="tab.count > 0">({{ tab.count }})</span></span>
          </el-tab-pane>
        </el-tabs>
        <div slot="btn mgB12">
          <ody-button name="ImInventoryPlan_toAdd" size="small" type="primary" code="ImInventoryPlanAdd" @click="goAdd()">{{ $t('新增盘点单') }}</ody-button>
          <ody-button name="ImInventoryPlan_batchCancel" size="small" code="ImInventoryPlanCancel" @click="batchCancel()">{{ $t('common_batch_cancel') }}</ody-button>
        </div>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :checked.sync="checked"
          :multiple="true"
          :columns="columns"
          :operates="operates">
          <template slot="result" slot-scope="scope">
            <div v-if="scope.row.result != null">
              <el-tag v-for="(item, index) in scope.row.result" :key="index" :color="item != null && item > 0 ? '#73D13D' : '#F5222D'" size="mini" style="color:white;margin-left: 4px">
                {{ item != null && item > 0 ? $t('盈') : $t('亏') }}
              </el-tag>
            </div>
          </template>
        </ody-table>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.currentPage"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.itemsPerPage"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="change"
          @current-change="queryList"
        />
      </div>
    </ody-list-table-area>
  </section>
</template>

<script>
export default {
  name: 'ImInventoryPlan',
  data() {
    const self = this
    return {
      tabs: [],
      loading: false,
      checked: [],
      activeState: '0',
      inventoryTypeList: [
        { label: this.$t('日常盘点'), value: 0 },
        { label: this.$t('任务盘点'), value: 1 }
      ],
      inventoryStatusList: [
        { label: this.$t('待提交'), value: 0 },
        { label: this.$t('盘点中'), value: 1 },
        { label: this.$t('已完成'), value: 2 },
        { label: this.$t('关闭'), value: 3 }
      ],
      inventoryStatusCountList: [],
      queryParam: this.getQueryParams(),
      warehouseList: [],
      list: [],
      merchantList: [],
      merchantNameMap: {},
      page: {
        itemsPerPage: 10,
        currentPage: 1,
        total: 0
      },
      columns: [
        {
          label: '盘点单',
          prop: 'inventoryCode',
          align: 'center',
          show: true,
          minWidth: 150,
          render: (h, params) => {
            const toDetail = self.goEdit
            return (
              <el-link underline='true' type='primary' title={params.row.inventoryCode} on-click={(e) => toDetail(params.row.id)}>{params.row.inventoryCode}</el-link>
            )
          }
        },
        {
          label: '盘点类型',
          prop: 'inventoryType',
          align: 'center',
          show: true,
          minWidth: 100,
          formatter: (row) => this.formatterEnum(this.inventoryTypeList, row.inventoryType)
        },
        {
          label: '盘点状态',
          prop: 'inventoryStatus',
          align: 'center',
          show: true,
          minWidth: 100,
          formatter: (row) => this.formatterEnum(this.inventoryStatusList, row.inventoryStatus)
        },
        {
          label: '商家',
          prop: 'merchantName',
          align: 'center',
          show: true,
          minWidth: 120
        },
        {
          label: '仓库',
          prop: 'warehouseName',
          align: 'center',
          show: true,
          minWidth: 120
        },
        {
          label: '商品个数',
          prop: 'productNum',
          align: 'center',
          show: true,
          minWidth: 100
        },
        {
          label: '盘点结果',
          align: 'center',
          slot: 'result',
          show: true,
          minWidth: 120
        },
        {
          label: '备注',
          prop: 'remark',
          align: 'center',
          show: true,
          minWidth: 120
        },
        {
          label: '创建人',
          prop: 'createUsername',
          align: 'center',
          show: true,
          minWidth: 120
        },
        {
          label: '创建时间',
          prop: 'createTime',
          align: 'center',
          show: true,
          minWidth: 160,
          formatter: (row) => this.dateFormat(row.createTime)
        },
        {
          label: '盘点人',
          prop: 'inventoryUsername',
          align: 'center',
          show: true,
          minWidth: 120
        },
        {
          label: '盘点完成时间',
          prop: 'inventoryTime',
          align: 'center',
          show: true,
          minWidth: 160,
          formatter: (row) => this.dateFormat(row.inventoryTime)
        }
      ],
      operates: {
        width: 120,
        fixed: 'right',
        list: [
          {
            label: '取消',
            hidden: (index, row) => {
              return !(row.inventoryStatus === 0 || row.inventoryStatus === 1)
            },
            method: (index, row) => {
              this.doCancel([row.id])
            },
            code: 'ImInventoryPlanCancel'
          },
          {
            label: '编辑',
            hidden: (index, row) => {
              return row.inventoryStatus !== 0
            },
            method: (index, row) => {
              this.goAdd(row.id)
              // this.goEdit(row.id, true)
            },
            code: 'ImInventoryPlanEdit'
          },
          {
            label: '提交盘点',
            hidden: (index, row) => {
              return row.inventoryStatus !== 0
            },
            method: (index, row) => {
              this.submit(row.id)
            },
            code: 'ImInventoryPlanSubmit'
          },
          {
            label: '盘点',
            hidden: (index, row) => {
              return row.inventoryStatus !== 1
            },
            method: (index, row) => {
              this.goEdit(row.id, true)
            },
            code: 'ImInventoryPlanToDo'
          }
        ]
      }
    }
  },
  async mounted() {
    try {
      this.stockApi = this.$product.$api.stockApi
      this.merchantApi = this.$product.$api.merchantApi
      this.authApi = this.$product.$api.authApi
      this.loading = true
      await this.queryMerchantList()
      await this.queryList()
    } catch (e) {
      this.loading = false
      console.log(e)
    }
  },
  methods: {
    async handleQuery() {
      if (this.queryParam.inventoryStatus == null || this.queryParam.inventoryStatus === '' || this.queryParam.inventoryStatus === undefined) {
        this.activeState = '0'
      } else if (this.queryParam.inventoryStatus !== this.tabs[this.activeState].inventoryStatus) {
        for (let i = 0; i < this.tabs.length; i++) {
          if (this.queryParam.inventoryStatus === this.tabs[i].inventoryStatus) {
            this.activeState = i + ''
            break
          }
        }
      }
      this.page.currentPage = 1
      await this.queryList()
    },
    async queryList() {
      try {
        this.loading = true
        // 分页查询
        const params = this.handQueryParams()
        const res = await this.stockApi.queryInventoryPlanList(params)
        for (const obj of res.data) {
          if (obj.countMap) {
            obj.result = []
            obj.productNum = obj.countMap['count']
            if (obj.countMap['countYing'] > 0) {
              obj.result.push(obj.countMap['countYing'])
            }
            if (obj.countMap['countKui'] > 0) {
              obj.result.push(-obj.countMap['countKui'])
            }
          }
        }
        this.list = res.data
        this.page.total = res.total
        // 查询状态数量
        this.loadInventoryStatusCount()
      } finally {
        this.loading = false
      }
    },
    submit(id) {
      // 提交盘点
      const vue = this
      this.$confirm(this.$t('提交盘点后开始直接开始盘点,确认提交开始盘点吗') + '?', this.$t('提示')).then(() => {
        this.stockApi.submitInventoryPlan({ id: id }).then((res) => {
          if (res) {
            vue.$message.success(vue.$t('提交成功'))
            vue.handleQuery()
          }
        })
      })
    },
    doCancel(ids) {
      if (!(ids && ids.length > 0)) {
        return
      }
      const vue = this
      this.$confirm(this.$t('确认取消盘点单吗') + '?', this.$t('提示')).then(() => {
        // 取消盘点
        vue.stockApi.cancelInventoryPlan(JSON.stringify(ids)).then((res) => {
          if (res) {
            vue.$message.success(vue.$t('取消成功'))
            vue.handleQuery()
          }
        })
      })
    },
    loadInventoryStatusCount() {
      // 查询状态数量
      const params = this.handQueryParams()
      delete params.inventoryStatus
      this.stockApi.queryInventoryStatusCount(params).then((res) => {
        const tabs = [{
          heading: this.$t('全部'),
          index: 0,
          count: 0,
          inventoryStatus: null
        }]
        if (res && res.data) {
          let index = 1
          let totalCount = 0
          for (const obj of this.inventoryStatusList) {
            const count = res.data[obj.value] || 0
            totalCount += count
            tabs.push({
              heading: this.$t(obj.label),
              index: index++,
              count: count,
              inventoryStatus: obj.value
            })
          }
          tabs[0].count = totalCount
        }
        this.tabs = tabs
      })
    },
    async onTabClick() {
      this.queryParam.inventoryStatus = this.tabs[this.activeState].inventoryStatus
      this.handleQuery()
    },
    goAdd(id) {
      this.$router.push({
        name: 'ImInventoryPlanAdd',
        params: { id: id || 0 }
      })
    },
    goEdit(id, isEdit) {
      this.$router.push({
        name: isEdit ? 'ImInventoryPlanEdit' : 'ImInventoryPlanView',
        params: { id: id, isEdit: isEdit === true }
      })
    },
    batchCancel() {
      const isChecked = this.checked && this.checked.length
      if (!isChecked) {
        this.$message('请勾选数据')
        return
      }
      const hasInventory = this.checked.some(item => !(item.inventoryStatus === 0 || item.inventoryStatus === 1))
      if (hasInventory) {
        this.$message('仅可以取消待提交和盘点中状态的盘点单')
        return
      }
      this.doCancel(this.checked.map(item => item.id))
    },
    async queryMerchantList() {
      return this.merchantApi
        .queryPlatformAuthMerchantPage({ currentPage: 1, itemsPerPage: 500 })
        .then(res => {
          this.merchantList = []
          this.merchantNameMap = {}
          const merchantIds = []
          for (const obj of res.data.listObj) {
            if (merchantIds.indexOf(obj.merchantId) === -1) {
              merchantIds.push(obj.merchantId)
              this.merchantList.push({
                merchantId: obj.merchantId,
                merchantCode: obj.merchantCode,
                merchantName: obj.merchantName
              })
              this.merchantNameMap[obj.merchantId] = obj.merchantName
            }
          }
          for (const obj of this.list) {
            if (this.merchantNameMap[obj.merchantId]) {
              obj.merchantName = this.merchantNameMap[obj.merchantId]
            }
          }
        })
    },
    getWarehouseByMerchantId(merchantId) {
      if (!merchantId) {
        this.warehouseList = []
        this.queryParam.warehouseId = null
        return
      }
      this.merchantApi
        .queryPlatformAuthWarehousePage({ currentPage: 1, itemsPerPage: 500 })
        .then(res => {
          this.warehouseList = res.data.listObj.filter(item => {
            return item.merchantId === merchantId
          })
        })
    },
    dateFormat(time) {
      if (time === null) {
        return null
      }
      return this.$portal.parseTime(time, '{y}-{m}-{d} {h}:{i}:{s}')
    },
    formatterEnum(list, value) {
      list = list.filter(item => item.value === value)
      return list && list.length > 0 ? list[0].label : ''
    },
    reset() {
      this.queryParam = this.getQueryParams()
      this.$refs.createTime.setDefault(7)
      this.warehouseList = []
    },
    change(val) {
      this.page.itemsPerPage = val
      this.queryList()
    },
    handQueryParams() {
      const params = {}
      for (const key in this.queryParam) {
        if (this.queryParam[key] || this.queryParam[key] === 0) {
          params[key] = this.queryParam[key]
        }
      }
      if (this.queryParam.inventoryStatus === 0) {
        params.inventoryStatus = 0
      }
      if (params.createTime && params.createTime.length > 1) {
        params.createTimeStart = params.createTime[0]
        params.createTimeEnd = params.createTime[1]
      }
      if (params.inventoryTime && params.inventoryTime.length > 1) {
        params.inventoryTimeStart = params.inventoryTime[0]
        params.inventoryTimeEnd = params.inventoryTime[1]
      }
      delete params.createTime
      delete params.inventoryTime
      params.currentPage = this.page.currentPage
      params.itemsPerPage = this.page.itemsPerPage
      return params
    },
    getQueryParams() {
      return {
        merchantId: null,
        warehouseId: null,
        inventoryCode: '',
        inventoryType: null,
        inventoryStatus: null,
        productCode: '',
        productSpuCode: '',
        productArtNo: '',
        productBarCode: '',
        createUsername: '',
        createTime: [],
        inventoryTime: []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .inventory_tabs .el-tabs__active-bar {
    display: none;
  }
</style>
