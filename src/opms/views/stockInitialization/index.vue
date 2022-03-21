<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('common_merchant_name') + ':'" prop="merchantId">
            <ody-merchant-select v-model="searchForm.merchantId" name="searchForm_merchantId" value-key="merchantId" />
          </ody-search-item>
          <ody-search-item :label="$t('common_warehouse_name') + ':'" prop="warehouseName">
            <el-input
              v-model="warehouseName"
              :placeholder="$t('common_choose_please')"
              name="searchForm_warehouseName"
              readonly="true"
              @click.native="showWarehouse"
            />
          </ody-search-item>
          <!-- 商品编码 -->
          <ody-search-item :label="$t('common_mp_code') + ':'" prop="mpCode">
            <el-input v-model="searchForm.mpCode" name="searchForm_mpCode" />
          </ody-search-item>
          <!-- 商品名称 -->
          <ody-search-item :label="$t('distributionOrder_goodName') + ':'" prop="mpName">
            <el-input v-model="searchForm.mpName" name="searchForm_mpName" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="OpmsStockInitialization01_handleSearchSubmit"
          size="small"
          type="primary"
          code="OpmsStockInitialization01"
          @click="handleSearchSubmit"
        >{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <!-- 按钮 -->
      <div slot="btn">
        <ody-button
          name="OpmsStockInitialization02_addCommodity"
          size="mini"
          type="primary"
          code="OpmsStockInitialization02"
          @click="addCommodity"
        >{{ $t('common_create') }}</ody-button>
        <!-- 批量初始化 -->
        <ody-button
          :disabled="checked.length<=0"
          name="OpmsStockInitialization03_completeInitialization"
          size="mini"
          code="OpmsStockInitialization03"
          @click="completeInitialization"
        >{{ $t('batch_initialization ') }}</ody-button>
      </div>
      <!-- 表格 -->
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :multiple="true"
          :checked.sync="checked"
          name="list432"
        />
      </div>
      <!-- 分页 -->
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
    <WarehouseModel
      :visible.sync="showWarehouseModal"
      :merchant-id="searchForm.merchantId"
      @ok="selectWarehouse"
    />
  </section>
</template>

<script>
import dateUtil from '@/utils/dateUtil'
import WarehouseModel from './WarehouseModal'
export default {
  name: 'OpmsStockInitialization',
  components: {
    WarehouseModel
  },
  data() {
    const self = this
    return {
      showWarehouseModal: false,
      editDataList: '',
      selectedItem: {},
      warehouseName: null,
      searchForm: {},
      loading: false,
      platformId: null,
      list: [], // 数据
      checked: [], // 选中
      page: {
        // 分页
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('common_merchant_name'),
          align: 'center'
        },
        {
          show: true,
          prop: 'warehouseName',
          label: this.$t('common_warehouse_name'),
          align: 'center',
          render: (h, params) => {
            return (
              <a
                on-click={() => {
                  if (this.$portal.hasPermission('OpmsStockInitialization04')) {
                    this.forwardToDetail(params.row)
                  }
                }}
              >
                <span style={'color:#1890FF'}>{params.row.warehouseName}</span>
              </a>
            )
          }
        },
        {
          show: true,
          prop: 'stockInitStatusStr', // 初始化状态
          label: this.$t('initial_state'),
          align: 'center'
        },
        {
          show: true,
          prop: 'createUsername', // 创建人
          label: this.$t('common_time_createUser'),
          align: 'center'
        },
        {
          show: true,
          prop: 'createTime', // 创建时间
          label: this.$t('common_createTime'),
          align: 'center',
          formatter: (row, column, cellValue) => {
            return dateFormat(row.createTime)
          }
        },
        {
          show: true,
          prop: 'initUserName',
          label: this.$t('common_initialize_the_people'),
          align: 'center'
        },
        {
          show: true,
          prop: 'initTime',
          label: this.$t('common_initialization_time'),
          align: 'center',
          formatter: (row, column, cellValue) => {
            return dateFormat(row.initTime)
          }
        }
      ],
      operates: {
        fixed: 'right',
        align: 'center',
        minWidth: 200,
        list: [
          {
            label: this.$t('common_edit'), // 编辑
            method(index, row) {
              self.goToDetail(row, true)
            },
            disabled(index, row) {
              return !(row && row.stockInitStatus === 1)
            },
            code: 'OpmsStockInitialization05'
          },
          {
            label: this.$t('common_delete'), // 删除
            method(index, row) {
              self.goToDelete(row.id, true)
            },
            disabled(index, row) {
              return !(row.isDeleted === 0 && row.stockInitStatus === 1)
            },
            code: 'OpmsStockInitialization06'
          },
          {
            label: this.$t('commom_initialize'), // 初始化
            method: (index, row) => {
              self.initialize(row.id)
              this.selectedItem = row
            },
            disabled(index, row) {
              return !(row && row.stockInitStatus === 1)
            },
            code: 'OpmsStockInitialization07'
          }
        ]
      }
    }
  },
  async created() {},
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },

  async activated() {
    this.updateList()
  },
  methods: {
    showWarehouse() {
      if (!this.searchForm.merchantId) {
        this.$message({
          type: 'warning',
          message: this.$t('common_please_choose_merchant')
        })
        return
      }
      this.showWarehouseModal = true
    },
    selectWarehouse(result) {
      if (result) {
        this.warehouseName = result.warehouseName
        this.searchForm.warehouseId = result.id
      }
    },
    // 新增
    addCommodity() {
      location.href = '/#/opms-web/stockInitialization/newGoods'
    },
    forwardToDetail(row) {
      this.$router.push({
        name: 'OpmsNewstockInitializationDetails',
        params: { orderCode: row.orderCode }
      })
    },
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },

    // 重置
    handleSearchReset() {
      this.warehouseName = null
      this.searchForm = getDefaultSearchForm()
    },

    // 一页显示多少条数据
    handlePageSizeChange() {
      this.handleSearchSubmit()
    },

    // 分页
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },

    // 加载
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

    // 是否删除模态框
    handleDelete(id) {
      this.$confirm(
        this.$t('common_msg_confirm_delete'),
        this.$t('common_msg_delete'),
        {
          confirmButtonText: this.$t('common_confirm'),
          cancelButtonText: this.$t('common_cancel'),
          type: 'warning'
        }
      ).then(() => {
        this.$opms.$api.stockInitialization
          .delete({ filters: { ids: id }})
          .then(result => {
            if (result && result.code === '0') {
              this.$message({
                type: 'success',
                message: this.$t('supplier_classification_delete_success')
              })
              this.updateList()
            }
          })
      })
    },

    // 编辑
    goToDetail(row, isEdit) {
      this.$router.push({
        name: 'OpmsNewstockInitializationEditGoods',
        params: {
          orderCode: row.orderCode
        }
      })
    },

    // 删除
    goToDelete(id, isEdit) {
      id = [id]
      this.handleDelete(id)
    },

    // 初始化
    initialize(id) {
      if (typeof id === 'number') {
        id = [id]
      }
      this.$opms.$api.stockInitialization
        .init({ filters: { ids: id }})
        .then(result => {
          if (result && result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('initialization_successful')
            })
            this.updateList()
          }
        })
    },

    // 批量初始化
    completeInitialization() {
      const ids = []
      if (this.checked.length <= 0) {
        this.$message({
          type: 'warning',
          message: this.$t('commom_initialize_no_null')
        })
        return
      } else {
        this.checked.filter(item => {
          if (item.id) {
            ids.push(item.id)
          }
        })
        this.initialize(ids)
      }
    },

    init() {
      this.updateList()
    }
  }
}

// 获取数据
async function loadList(vue) {
  const param = {
    limit: vue.page.size,
    page: vue.page.current,
    filters: vue.searchForm
  }
  const stockInitialization = vue.$opms.$api.stockInitialization
  const res = await stockInitialization.listPage(param)
  if (res) {
    if (res.data && res.code === '0') {
      res.data.map(item => {
        switch (item.stockInitStatus) {
          case 1:
            item.stockInitStatusStr = vue.$t('wait_commit')
            break
          case 2:
            item.stockInitStatusStr = vue.$t('wait_init')
            break
          case 3:
            item.stockInitStatusStr = vue.$t('init_done')
            break
          case 4:
            item.stockInitStatusStr = vue.$t('init_fail')
            break
          case 5:
            item.stockInitStatusStr = vue.$t('cancel_init')
            break
        }
      })
      vue.list = res.data
    }
    vue.page.total = res.total
  }
}

// 格式化时间
function dateFormat(time) {
  if (!time) {
    return ''
  }
  return dateUtil.dateFormatForTime(time, true)
}

// 重置
function getDefaultSearchForm() {
  return {}
}
</script>
<style scoped>
</style>
