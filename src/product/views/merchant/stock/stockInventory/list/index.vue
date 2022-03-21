<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form">
          <ody-search-item :label="$t('商家') + ':'" prop="merchantId">
            <el-select
              v-model="queryParam.merchantId"
              :placeholder="$t('全部')"
              name="queryParam_merchantId"
              clearable
              @change="getWarehouseByMerchantId(queryParam.merchantId)"
            >
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
              name="queryParam_warehouseId"
              clearable
            >
              <el-option
                v-for="item in warehouseList"
                :key="item.warehouseId"
                :label="item.warehouseName"
                :value="item.warehouseId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('盘点单号') + ':'" prop="inventoryCode">
            <el-input v-model="queryParam.inventoryCode" name="queryParam_inventoryCode" />
          </ody-search-item>
          <ody-search-item :label="$t('盘点状态') + ':'" prop="inventoryStatus">
            <el-select v-model="queryParam.inventoryStatus" :placeholder="$t('全部')" name="queryParam_inventoryStatus" clearable>
              <el-option
                v-for="item in inventoryStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('创建人') + ':'" prop="createUsername">
            <el-input v-model="queryParam.createUsername" name="queryParam_createUsername" />
          </ody-search-item>
          <ody-search-item :space="2" :label="$t('创建日期') + ':'" prop="createBeginDate">
            <el-date-picker
              v-model="queryParam.createBeginDate"
              :placeholder="$t('选择日期')"
              name="queryParam_createBeginDate"
              type="date"
              value-format="yyyy-MM-dd"
            />-
            <el-date-picker
              v-model="queryParam.createEndDate"
              :placeholder="$t('选择日期')"
              name="queryParam_createEndDate"
              type="date"
              value-format="yyyy-MM-dd"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('重置') }}</el-button>
        <ody-button
          name="StockInventoryListQuery"
          size="small"
          type="primary"
          code="StockInventoryListQuery"
          @click.native="handleQuery"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button name="StockInventoryListAdd_toAdd" size="small" type="primary" code="StockInventoryListAdd" @click="toAdd()">{{ $t('新增') }}</ody-button>
        <ody-button name="StockInventoryListDelete_batchDelete" size="small" code="StockInventoryListDelete" @click="batchDelete()">{{ $t('删除') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :checked.sync="checked"
          :multiple="true"
          :columns="columns"
          :operates="operates"
          name="list947"
        />
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
  name: 'StockInventoryList',
  data() {
    return {
      loading: false,
      checked: [],
      inventoryStatus: [
        {
          label: this.$t('创建'),
          value: 0
        },
        {
          label: this.$t('盘点中'),
          value: 1
        },
        {
          label: this.$t('关闭'),
          value: 2
        }
      ],
      queryParam: {
        merchantId: null,
        warehouseId: null,
        inventoryCode: '',
        inventoryStatus: null,
        createUsername: '',
        createBeginDate: null,
        createEndDate: null
      },
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
          label: '商家',
          prop: 'merchantName',
          show: true,
          minWidth: 200
        },
        {
          label: '仓库名称',
          prop: 'warehouseName',
          show: true,
          minWidth: 180
        },
        {
          label: '盘点单号',
          prop: 'inventoryCode',
          show: true,
          minWidth: 200
        },
        {
          label: '盘点状态',
          prop: 'inventoryStatus',
          show: true,
          minWidth: 180,
          formatter: this.formatterInventoryStatus
        },
        {
          label: '创建人',
          prop: 'createUsername',
          show: true,
          minWidth: 200
        },
        {
          label: '创建时间',
          prop: 'createTime',
          show: true,
          minWidth: 200,
          formatter: this.formatterCreateTime
        },
        {
          label: '盘点完成时间',
          prop: 'updateTime',
          show: true,
          minWidth: 180,
          formatter: this.formatterUpdateTime
        }
      ],
      operates: {
        width: 200,
        fixed: 'right',
        list: [
          {
            label: '查看',
            method: (index, row) => {
              this.go({
                id: row.id,
                status: row.inventoryStatus,
                isEdit: false
              })
            },
            code: 'StockInventoryListView'
          },
          {
            label: '编辑',
            hidden: (index, row) => {
              const hasPermission = true
              const show = row.inventoryStatus !== 2

              return !(hasPermission && show)
            },
            method: (index, row) => {
              this.go({ id: row.id, status: row.inventoryStatus, isEdit: true })
            },
            code: 'StockInventoryListEdit'
          },
          {
            label: '确认差异',
            hidden: (index, row) => {
              const hasPermission = true
              const show = row.inventoryStatus === 1

              return !(hasPermission && show)
            },
            method: (index, row) => {
              this.confirmStock(row.id)
            },
            code: 'StockInventoryListConfirm'
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
      console.log(e)
    }
  },
  methods: {
    async handleQuery() {
      this.page.currentPage = 1

      await this.queryList()
    },
    // 分页查询
    async queryList(obj) {
      if (
        this.queryParam.createBeginDate &&
        this.queryParam.createEndDate &&
        this.queryParam.createBeginDate > this.queryParam.createEndDate
      ) {
        this.$message('创建日期起始值不能大于结束值')
        return
      }
      var names = ['inventoryCode', 'createUsername']
      names.forEach(name => {
        if (!this.queryParam[name]) {
          delete this.queryParam[name]
        }
      })
      var param = Object.assign({}, this.queryParam, this.page, obj)
      if (!this.queryParam.merchantId && this.merchantList) {
        param.merchantIds = []
        this.merchantList.forEach(item => {
          param.merchantIds.push(item.merchantId)
        })
      }
      this.loading = true
      try {
        const res = await this.stockApi.listImInventoryPage(param)

        this.list = res.data.listObj
        this.page.total = res.data.total
        for (var p of this.list) {
          if (this.merchantNameMap[p.merchantId]) {
            p.merchantName = this.merchantNameMap[p.merchantId]
          }
        }
      } finally {
        this.loading = false
      }
    },
    // 查询当前登录用户有权限的商家
    async queryMerchantList() {
      return this.merchantApi
        .queryPlatformAuthMerchantPage({ currentPage: 1, itemsPerPage: 500 })
        .then(res => {
          this.merchantList = []
          this.merchantNameMap = {}
          const merchantIds = []
          for (const warehouse of res.data.listObj) {
            if (merchantIds.indexOf(warehouse.merchantId) === -1) {
              merchantIds.push(warehouse.merchantId)
              this.merchantList.push({
                merchantId: warehouse.merchantId,
                merchantCode: warehouse.merchantCode,
                merchantName: warehouse.merchantName
              })
              this.merchantNameMap[warehouse.merchantId] =
                warehouse.merchantName
            }
          }
          for (var obj of this.list) {
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
    toAdd() {
      this.$router.push({
        name: 'StockInventorySave',
        params: {}
      })
    },
    go(param) {
      this.$router.push({
        name: 'StockInventoryEdit',
        params: param
      })
    },
    batchDelete() {
      const isChecked = this.checked && this.checked.length

      if (!isChecked) {
        this.$message('请勾选删除')
        return
      }

      const hasInventory = this.checked.some(item => item.inventoryStatus > 0)

      if (hasInventory) {
        this.$message('仅可以删除创建状态的盘点单')
        return
      }
      this.$confirm(this.$t('是否确认删除') + '?', this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        // const ids = this.list.filter(item => item.checked).map(item => item.id)
        const ids = this.checked.map(item => item.id)

        if (ids.length > 0) {
          this.stockApi.batchDeleteImInventory({ ids: ids }).then(res => {
            if (res.code === '0') {
              this.$message('操作成功')
            }
            this.queryList()
          })
        }
      })
    },
    confirmStock(id) {
      this.stockApi
        .imInventoryRealityStock(id)
        .then(res => {
          if (res.code === '0') {
            this.$message('操作成功')
          }
          this.queryList()
        })
        .catch(res => {
          this.$message(res.message)
        })
    },
    dateFormat(time) {
      if (time === null) {
        return null
      }
      var date = new Date(time)
      var year = date.getFullYear()
      var month =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      var minutes =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      var seconds =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      // 拼接
      return (
        year +
        '-' +
        month +
        '-' +
        day +
        ' ' +
        hours +
        ':' +
        minutes +
        ':' +
        seconds
      )
    },
    formatterInventoryStatus(row) {
      return this.inventoryStatus.filter(
        item => item.value === row.inventoryStatus
      )[0].label
    },
    formatterCreateTime(row) {
      return this.dateFormat(row.createTime)
    },
    formatterUpdateTime(row) {
      return this.dateFormat(row.updateTime)
    },
    // 重置
    reset() {
      this.queryParam = {
        merchantId: null,
        warehouseId: null,
        inventoryCode: '',
        inventoryStatus: null,
        createUsername: '',
        createBeginDate: null,
        createEndDate: null
      }
      this.warehouseList = []
    },
    change(val) {
      this.page.itemsPerPage = val
      this.queryList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
