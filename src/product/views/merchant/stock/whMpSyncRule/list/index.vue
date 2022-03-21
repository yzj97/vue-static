<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form">
          <ody-search-item :label="$t('商家') + ':'" prop="merchantId">
            <el-select
              v-model="queryParam.merchantId"
              :placeholder="$t('全部')"
              :popper-append-to-body="false"
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
          <ody-search-item :label="$t('仓库名称') + ':'" prop="warehouseId">
            <el-select
              v-model="queryParam.warehouseId"
              :placeholder="$t('全部')"
              name="queryParam_warehouseId"
              clearable
              @change="changeWarehouseType(queryParam.warehouseId)"
            >
              <el-option
                v-for="item in warehouseList"
                :key="item.id"
                :label="item.warehouseName"
                :value="item.id"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('仓库类型') + ':'" prop="warehouseType">
            <el-select v-model="queryParam.warehouseType" :placeholder="$t('全部')" name="queryParam_warehouseType" clearable>
              <el-option
                v-for="item in warehouseTypeList"
                :key="item.type"
                :label="item.name"
                :value="item.type"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('商品编码') + ':'" prop="mpCode">
            <el-input v-model="queryParam.mpCode" name="queryParam_mpCode" />
          </ody-search-item>
          <ody-search-item :label="$t('商品名称') + ':'" prop="mpName">
            <el-input v-model="queryParam.mpName" name="queryParam_mpName" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('重置') }}</el-button>
        <ody-button
          name="Stock2004Query_handleQuery"
          size="small"
          type="primary"
          code="Stock2004Query"
          @click="handleQuery"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <!-- <router-link :to="{ name: 'whMpSyncRuleNew'}">
          <ody-button name="Stock2004Add" size="small" type="primary" code="Stock2004Add">{{$t('新增')}}</ody-button>
        </router-link>-->
        <ody-button name="Stock2004Add_openAdd" size="small" type="primary" code="Stock2004Add" @click="openAdd">{{ $t('新增') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table :loading="loading" :data="list" :columns="columns" :operates="operates" name="list066" />
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
          @size-change="queryList"
          @current-change="queryList"
        />
      </div>
    </ody-list-table-area>
  </section>
</template>
<script>
export default {
  name: 'Stock2004',
  data() {
    return {
      loading: false,
      queryParam: getDefaultSearchForm(),
      warehouseList: [],
      list: [],
      merchantList: [],
      bill: {},
      warehouseTypeList: [
        { type: 1, name: '中心仓' },
        { type: 2, name: '门店仓' }
      ],
      page: {
        itemsPerPage: 10,
        currentPage: 1,
        total: 10
      },
      columns: [
        {
          show: true,
          prop: 'warehouseCode',
          label: '仓库编码',
          align: 'center'
        },
        {
          show: true,
          prop: 'warehouseName',
          label: '仓库名称',
          align: 'center'
        },
        {
          show: true,
          prop: 'warehouseTypeStr',
          label: '仓库类型',
          align: 'center'
        },
        {
          show: true,
          prop: 'merchantName',
          label: '商家',
          align: 'center'
        },
        {
          show: true,
          prop: 'mpCode',
          label: '商品编码',
          align: 'center'
        },
        {
          show: true,
          prop: 'mpName',
          label: '商品名称',
          align: 'center'
        }
      ],
      operates: {
        fixed: 'right',
        list: [
          {
            label: '编辑',
            method: (index, row) => {
              this.handleTableEdit(index, row)
            },
            code: 'Stock2004Edit'
          },
          {
            label: '删除',
            method: (index, row) => {
              this.handleTableDelete(index, row)
            },
            code: 'Stock2004Delete'
          }
        ]
      }
    }
  },
  async mounted() {
    try {
      this.stockApi = this.$product.$api.stockApi
      this.merchantApi = this.$product.$api.merchantApi
      this.loading = true
      await this.queryList()
      await this.queryMerchantList()
    } catch (e) {
      console.log(e)
    } finally {
      this.loading = false
    }
  },
  methods: {
    async handleQuery() {
      this.page.currentPage = 1
      await this.queryList()
    },
    changeWarehouseType(warehouseId) {
      for (const warehouse of this.warehouseList) {
        if (warehouseId === warehouse.id) {
          this.queryParam.warehouseType = warehouse.warehouseType
        }
      }
    },
    openAdd() {
      this.$router.push({
        name: 'whMpSyncRuleNew'
      })
    },
    handleTableEdit(index, row) {
      this.$router.push({
        name: 'whMpSyncRuleEdit',
        params: {
          id: row.id,
          merchantId: row.merchantId,
          warehouseId: row.warehouseId,
          mpId: row.mpId,
          warehouseType: row.warehouseType,
          virtualWarehouseId: row.virtualWarehouseId,
          edit: true
        }
      })
    },
    handleSearchReset() {
      this.queryParam = getDefaultSearchForm()
      this.warehouseList = []
    },
    handleAdd() {
      this.$router.push({
        name: 'whMpSyncRuleEdit'
      })
    },
    handleTableDelete(index, row) {
      this.$confirm(this.$t('确认删除选中的数据?'), this.$t('删除'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        var param = Object.assign({}, row)
        if (param.warehouseType === 1) {
          return this.stockApi.deleteImWarehouseMpSyncRule(param).then(res => {
            this.queryList()
            this.$message({
              type: 'success',
              message: this.$t('删除完成')
            })
          })
        } else {
          return this.stockApi
            .deleteImVirtualWarehouseMpSyncRule(param)
            .then(res => {
              this.queryList()
              this.$message({
                type: 'success',
                message: this.$t('删除完成')
              })
            })
        }
      })
    },
    // 分页查询
    async queryList(obj) {
      var param = Object.assign({}, this.queryParam)
      param.currentPage = this.page.currentPage
      param.itemsPerPage = this.page.itemsPerPage
      this.loading = true

      try {
        const res = await this.stockApi.listImWarehouseMpSyncRuleByPage(param)
        this.list = res.data.listObj
        this.page.total = res.data.total
        if (this.list) {
          for (const rule of this.list) {
            for (const type of this.warehouseTypeList) {
              if (rule.warehouseType === type.type) {
                rule.warehouseTypeStr = type.name
              }
            }
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
          this.merchantList = res.data.listObj
        })
    },
    getWarehouseByMerchantId(merchantId) {
      if (!merchantId) {
        return
      }
      this.warehouseList = []
      this.queryParam.warehouseId = null
      this.queryParam.warehouseType = null

      // 只查询实体仓的数据
      this.stockApi
        .listStoreWarehouseWithPage({
          itemsPerPage: 500,
          merchantId: merchantId,
          isVirtualWarehouse: 0
        })
        .then(res => {
          this.warehouseList = res.data.listObj
        })
    },
    // 重置
    reset() {
      this.queryParam = getDefaultSearchForm()
      this.warehouseList = []
    }
  }
}
function getDefaultSearchForm() {
  return Object.assign(
    {},
    {
      warehouseId: null,
      warehouseType: null
    }
  )
}
</script>

<style lang="scss" scoped>
</style>
