<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('merchantExpressConfig_deliveryCompanyId') + ':'" prop="deliveryCompanyId">
            <el-input v-model="searchForm.deliveryCompanyId" name="searchForm_deliveryCompanyId" maxlength="25"/>
          </ody-search-item>
          <ody-search-item :label="$t('merchantExpressConfig_deliveryCompanyName') + ':'" prop="deliveryCompanyName">
            <el-input v-model="searchForm.deliveryCompanyName" name="searchForm_deliveryCompanyName" maxlength="25"/>
          </ody-search-item>
          <ody-search-item :label="$t('do_merchant_name') + ':'" prop="merchantId">
            <el-select
              v-model="searchForm.merchantId"
              :popper-append-to-body="false"
              :placeholder="$t('common_all')"
              name="searchForm_merchantId">
              <el-option
                v-for="item in merchants"
                :label="item.merchantName"
                :key="item.merchantId"
                :value="item.merchantId"/>
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <ody-button name="OmsMerchantExpressConfig_Reset_handleSearchReset" code="OmsMerchantExpressConfig_Reset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</ody-button>
        <ody-button name="OmsMerchantExpressConfig_Query_handleSearchSubmit" code="OmsMerchantExpressConfig_Query" size="small" type="primary" @click="handleSearchSubmit">{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button name="OmsMerchantExpressConfig_Add_add" code="OmsMerchantExpressConfig_Add" size="small" type="primary" @click="add">{{ $t('add') }}</ody-button>
        <ody-button :disabled="checked.length === 0" name="OmsMerchantExpressConfig_Deleted_discontinue" code="OmsMerchantExpressConfig_Deleted" size="small" @click="discontinue">{{ $t('common_batch_delete') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="data"
          :columns="columns"
          :operates="operates"
          :multiple="true"
          :checked.sync="checked"
          :can-filter="false"
          name="data316"
          @custom-sort-change="hanleCustomSortChange"
          @selection-change="handleSelectionChange"/>
      </div>

      <div slot="page">
        <ody-pagination
          :current-page.sync="page"
          :list="data"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="size"
          :total.sync="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"/>

      </div>
    </ody-list-table-area>
    <ExpressConfigSet :visible.sync="visible" :type.sync="type" :type-name.sync="typeName" :modal-type.sync="modalType" :selected-item.sync="selectedItem" @ok="handleOk" />
  </section>

</template>

<script>
import ExpressConfigSet from '@/components/merchantExpressConfigSet'

export default {
  name: 'OmsMerchantExpressConfig',
  components: {
    ExpressConfigSet
  },
  data() {
    const self = this
    return {
      loading: false,
      visible: false,
      returnVisible: false,
      type: 0,
      typeName: '',
      modalType: 'add',
      checked: [],
      data: [],
      merchantMap: {},
      checkAll: false,
      merchants: [],
      searchForm: getDefaultSearchForm(),
      isDisableList: [],
      merchantTypeList: [],
      page: 1,
      size: 10,
      total: 1,
      columns: [
        {
          show: true,
          prop: 'deliveryCompanyName',
          label: this.$t('merchantExpressConfig_deliveryCompanyName'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'deliveryCompanyId',
          label: this.$t('merchantExpressConfig_deliveryCompanyId'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'merchantId',
          label: this.$t('do_merchant_name'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            if (self.merchantMap && self.merchantMap[row.merchantId]) {
              return self.merchantMap[row.merchantId].merchantName
            }
            return ''
          }
        },
        {
          show: true,
          prop: 'isDisable',
          label: this.$t('isDisable'),
          align: 'center',
          formatter: (row, column, cellValue) => {
            return self.isDisableMap[row.isAvailable]
          }
        },
        {
          show: true,
          prop: 'phone',
          label: this.$t('merchantExpressConfig_phone')
        },
        {
          show: true,
          prop: 'merchantExpressConfig_source',
          label: this.$t('merchantExpressConfig_source'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            return self.merchantTypeMap[row.type]
          }
        }
      ],
      operates: {
        align: 'center',
        list: [
          {
            label: this.$t('edit'),
            disabled: false,
            method(index, row) {
              self.selectedItem = row
              self.openFormDialog(false)
            },
            code: 'OmsMerchantExpressConfig_Edit'
          },
          {
            label: this.$t('delete'),
            method: (index, row) => {
              self.selectedItem = row
              self.deleteItem(row)
            },
            disabled: (index, row) => {
              if (row.type === 1) {
                return true
              } else {
                return false
              }
            },
            code: 'OmsMerchantExpressConfig_Deleted'
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 选中行
    handleSelectionChange(val) {
      // console.log('val:', val)
    },
    // 编辑
    handleEdit(index, row) {
      this.$router.push({
        name: 'merchantExpressConfigDetail',
        params: {
          id: row.id
        }
      })
    },
    handleOk() {
      /** 对话框点击确认以后的回调 */
      this.updateList()
    },
    /**
     * 查询状态 启用/停用
     */
    initCodes() {
      this.$oms.$api.common.listByCategorysForOrder({ 'categorys': ['IS_AVLIABLE'] }).then((data) => {
        this.isDisableList = data.data.IS_AVLIABLE
        this.isDisableMap = data.data.IS_AVLIABLE.reduce((m, i) => { m[i.code] = i.name; return m }, {})
      })
    },
    initExpressConfigs() {
      this.$oms.$api.common.listByCategorysForOrder({ 'categorys': ['MERCHANT_EXPRESS_CONFIG_TYPE'] }).then((data) => {
        this.merchantTypeList = data.data.MERCHANT_EXPRESS_CONFIG_TYPE
        this.merchantTypeMap = data.data.MERCHANT_EXPRESS_CONFIG_TYPE.reduce((m, i) => { m[i.code] = i.name; return m }, {})
      })
    },
    _initMerchants() { // 初始化商家
      const vue = this
      this.$oms.$api.common.merchantList({ 'currentPage': 1, 'itemsPerPage': 1000 }).then((data) => {
        const merchantList = data.data.listObj || []
        vue.merchants = merchantList
        vue.merchantMap = merchantList.reduce((m, i) => { m[i.merchantId] = i; return m }, {})
      })
    },
    async handleSearchSubmit() {
      this.page = 1
      await this.updateList()
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
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
    deleteItem: function(row) {
      const vue = this
      this.$confirm(this.$t('delete_confirm'), this.$t('prompt'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'info'
      }).then(() => {
        const deleteUrl = vue.$oms.$api.merchantExpressConfig.merchantExpressConfigDelete
        deleteUrl(JSON.stringify([row.id])).then((res) => {
          this.$message({
            type: 'info',
            message: this.$t('common_delete_success')
          })
          this.updateList()
        })
      }).catch(() => {})
    },
    async updateList() {
      try {
        this.loading = true
        this.checked = []
        await getList(this)
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    async discontinue() {
      if (this.checked.length === 0) {
        this.$message({
          type: 'warn',
          message: this.$t('common_please_select_one')
        })
        return
      }
      const data = this.data
      this.$confirm(this.$t('common_batch_delete_confirm'), this.$t('prompt'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'info'
      }).then(() => {
        var param = []
        var isReturn = false
        this.checked.forEach(function(i) {
          param.push(i.id)
          data.forEach(function(j) {
            if (i.id === j.id && j.type === 1) {
              isReturn = true
            }
          })
        })
        if (isReturn) {
          this.$message({
            type: 'warning',
            message: this.$t('merchant_express_config_cannot_remove')
          })
          return
        }
        this.$oms.$api.merchantExpressConfig.merchantExpressConfigDelete(JSON.stringify(param)).then((data) => {
          if (data.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('common_save_success')
            })
            this.updateList()
            this.checked = []
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('common_cancel_success')
        })
      })
    },
    add: function() {
      this.selectedItem = null
      this.openFormDialog(true)
    },
    openFormDialog: function(isAdd) {
      if (isAdd) {
        this.modalType = 'add'
      } else {
        this.modalType = 'edit'
      }
      this.visible = true
    },
    init() {
      this.initCodes()
      this.initExpressConfigs()
      this._initMerchants()
      this.updateList()
    }
  }
}
function getDefaultSearchForm() {
  return Object.assign({}, {

  })
}

async function getList(vue) {
  const param = {
    page: vue.page,
    limit: vue.size,
    filters: {
      deliveryCompanyId: vue.searchForm.deliveryCompanyId,
      deliveryCompanyName: vue.searchForm.deliveryCompanyName,
      merchantId: vue.searchForm.merchantId
    }
  }
  const routingWarehouseRuleList = vue.$oms.$api.merchantExpressConfig
  const res = await routingWarehouseRuleList.merchantExpressConfigListPage(param)
  const data = res.data
  vue.data = data
  vue.total = res.total
}
</script>

<style lang="scss" scoped>

</style>
