<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form">
          <ody-search-item :label="$t('商家') + ':'" prop="merchantId">
            <el-select
              v-model="queryParam.merchantId"
              :placeholder="$t('请选择')"
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
          <ody-search-item :label="$t('拟合仓名称') + ':'" prop="virtualWarehouseId">
            <el-select v-model="queryParam.virtualWarehouseId" :placeholder="$t('请选择')" name="queryParam_virtualWarehouseId" clearable>
              <el-option
                v-for="item in warehouseList"
                :key="item.id"
                :label="item.warehouseName"
                :value="item.id"
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
          name="Stock2003Query_handleQuery"
          size="small"
          type="primary"
          code="Stock2003Query"
          @click="handleQuery"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <!-- <router-link :to="{ name: 'virWhMpSyncRuleNew'}">
          <ody-button name="Stock2003Add" size="small" code="Stock2003Add" type="primary">{{$t('新增')}}</ody-button>
        </router-link>-->
        <ody-button name="Stock2003Add_openAdd" size="small" type="primary" code="Stock2003Add" @click="openAdd">{{ $t('新增') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table :loading="loading" :data="list" :columns="columns" :operates="operates" name="list421" />
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
  name: 'Stock2003',
  data() {
    return {
      loading: false,
      queryParam: getDefaultSearchForm(),
      warehouseList: [],
      list: [],
      merchantList: [],
      bill: {},
      page: {
        itemsPerPage: 10,
        currentPage: 1,
        total: 10
      },
      columns: [
        {
          show: true,
          prop: 'warehouseCode',
          label: '拟合仓编码',
          align: 'center'
        },
        {
          show: true,
          prop: 'warehouseName',
          label: '拟合仓名称',
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
            disabled: false,
            method: (index, row) => {
              this.handleTableEdit(index, row)
            },
            code: 'Stock2003Edit'
          },
          {
            label: '删除',
            disabled: false,
            method: (index, row) => {
              this.handleTableDelete(index, row)
            },
            code: 'Stock2003Delete'
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
    handleTableEdit(index, row) {
      this.$router.push({
        name: 'virWhMpSyncRuleEdit',
        params: {
          merchantId: row.merchantId,
          virtualWarehouseId: row.virtualWarehouseId,
          mpId: row.mpId,
          edit: true
        }
      })
    },
    openAdd() {
      this.$router.push({
        name: 'virWhMpSyncRuleNew'
      })
    },
    handleSearchReset() {
      this.queryParam = getDefaultSearchForm()
      this.warehouseList = []
    },
    handleAdd() {
      this.$router.push({
        name: 'virWhMpSyncRuleEdit'
      })
    },
    handleTableDelete(index, row) {
      this.$confirm(this.$t('确认删除选中的数据?'), this.$t('删除'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        var param = Object.assign({}, row)
        return this.stockApi
          .deleteImVirtualWarehouseMpSyncRule(param)
          .then(res => {
            this.queryList()
            this.$message({
              type: 'success',
              message: this.$t('删除完成')
            })
          })
      })
    },
    // 分页查询
    async queryList(obj) {
      var param = Object.assign({}, this.queryParam)
      param.currentPage = this.page.currentPage
      param.itemsPerPage = this.page.itemsPerPage
      this.loading = true
      try {
        const res = await this.stockApi.listImVirtualWarehouseMpSyncRuleByPage(
          param
        )
        this.list = res.data.listObj
        this.page.total = res.data.total
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
      this.queryParam.virtualWarehouseId = null
      // 只查询拟合仓的数据
      this.stockApi
        .listStoreWarehouseWithPage({
          itemsPerPage: 500,
          merchantId: merchantId,
          isVirtualWarehouse: 1
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
      virtualWarehouseId: null
    }
  )
}
</script>

<style lang="scss" scoped>
</style>
