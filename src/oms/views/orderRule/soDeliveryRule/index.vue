<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('order_ruleName') + ':'" prop="name">
            <el-input
              v-model="searchForm.name"
              name="searchForm_name"
              maxlength="25"
            />
          </ody-search-item>

          <ody-search-item
            :label="$t('order_ruleMerchant') + ':'"
            prop="merchantId"
          >
            <el-select
              :popper-append-to-body="false"
              v-model="searchForm.merchantId"
              :placeholder="$t('common_all')"
              name="searchForm_merchantId"
              @change="loadWarehouseByMerchant"
            >
              <el-option
                v-for="item in merchantList"
                :label="item.merchantName"
                :key="item.merchantId"
                :value="item.merchantId"
              />
            </el-select>
          </ody-search-item>
          <!--<ody-search-item :label="$t('storeName')" prop="storeId">
            <el-select v-model="searchForm.storeId" :placeholder="$t('common_all')" name="searchForm_storeId">
              <el-option v-for="item in storeList" :label="item.storeName" :key="item.storeId" :value="item.storeId"/>
            </el-select>
          </ody-search-item>-->
        </el-form>
        <el-form ref="form" label-width="100px" class="form" />
      </div>
      <div slot="btn">
        <ody-button
          name="OmsSoDeliveryRuleList_Reset_handleSearchReset"
          code="OmsSoDeliveryRuleList_Reset"
          size="small"
          @click="handleSearchReset"
        >{{ $t("common_reset") }}</ody-button
        >
        <ody-button
          name="OmsSoDeliveryRuleList_Query_handleSearchSubmit"
          code="OmsSoDeliveryRuleList_Query"
          size="small"
          type="primary"
          @click="handleSearchSubmit"
        >{{ $t("common_select") }}</ody-button
        >
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="OmsSoDeliveryRuleList_Add_add"
          code="OmsSoDeliveryRuleList_Add"
          size="small"
          type="primary"
          @click="add"
        >{{ $t("add") }}</ody-button
        >
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="data"
          :columns="columns"
          :operates="operates"
          :multiple="false"
          :checked.sync="checked"
          :can-filter="false"
          name="data061"
          @selection-change="handleSelectionChange"
        />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="current"
          :list="data"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="size"
          :total.sync="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
        />
      </div>
    </ody-list-table-area>
  </section>
</template>

<script>
export default {
  name: 'OmsSoDeliveryRuleList',
  data() {
    const self = this
    return {
      loading: false,
      checked: [],
      data: [],
      searchForm: getDefaultSearchForm(),
      auditReasonList: [],
      isDisableList: [],
      merchantList: [],
      size: 10,
      total: 1,
      current: 1,
      columns: [
        {
          show: true,
          prop: 'name',
          label: this.$t('order_ruleName'),
          align: 'center'
        },
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('order_ruleMerchant'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            if (row.merchantName) {
              return row.merchantName
            } else {
              return this.$t('no_exist')
            }
          }
        },
        {
          show: true,
          prop: 'priority',
          label: this.$t('order_priority')
        },
        {
          show: true,
          prop: 'deliveryCompanyName',
          label: this.$t('so_pick_delivery_merchant')
        }
      ], // 需要展示的列
      operates: {
        fixed: 'right',
        list: [
          {
            label: this.$t('edit'),
            disabled: false,
            method(index, row) {
              self.handleEdit(index, row)
            },
            code: 'OmsSoDeliveryRuleList_Edit'
          },
          {
            label: this.$t('delete'),
            disabled: false,
            method(index, row) {
              self.handleDel(index, row)
            },
            code: 'OmsSoDeliveryRuleList_Deleted'
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
      console.log(' index:', index)
      console.log(' row:', row)
      this.$router.push({
        path: '/oms-web/setting/orderRule/soDeliveryRule/detail',
        query: { id: row.id }
      })
    },
    // 删除
    handleDel(index, row) {
      console.log(' index:', index)
      console.log(' row:', row)
      this.$confirm(this.$t('delete_confirm'), this.$t('prompt'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$oms.$api.soDeliveryRule
            .soDeliveryRuleDelete({ id: row.id })
            .then((data) => {
              if (data.code === '0') {
                this.$message({
                  type: 'success',
                  message: this.$t('common_delete_success')
                })
                getList(this)
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common_cancel_success')
          })
        })
    },
    initMerchants() {
      this.$oms.$api.common
        .merchantList({ currentPage: 1, itemsPerPage: 1000 })
        .then((data) => {
          data.data.listObj.forEach(function(item) {
            item.merchantId = item.merchantId + '' // 转为字符串，不然会报错
          })
          this.merchantList = data.data.listObj
          this.merchantMap = data.data.listObj.reduce((m, i) => {
            m[i.merchantId] = i.merchantName
            return m
          }, {})
        })
    },
    initStoreList() {
      const vue = this
      this.$oms.$api.common.storeList({}).then((result) => {
        vue.storeList = result.data.listObj
      })
    },
    async handleSearchSubmit() {
      this.current = 1
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
    async updateList() {
      try {
        this.loading = true
        await getList(this)
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    add() {
      this.$router.push({
        path: '/oms-web/setting/orderRule/soDeliveryRule/detail',
        query: { id: null }
      })
    },
    init() {
      this.initMerchants()
      this.initStoreList()
      getList(this)
    }
  }
}
function getDefaultSearchForm() {
  return Object.assign({}, {})
}

async function getList(vue) {
  const param = {
    page: vue.current,
    limit: vue.size,
    name: vue.searchForm.name,
    merchantId: vue.searchForm.merchantId,
    storeId: vue.searchForm.storeId
  }
  const soAudit = vue.$oms.$api.soDeliveryRule
  const res = await soAudit.soDeliveryRuleListPage(param)
  const data = res.data
  vue.data = data
  vue.total = res.total
}
</script>
<style lang="scss" scoped>
/deep/ .cp-search-item {
  overflow: unset !important
}
/deep/ .cp-list-search-area .box{
  overflow: unset;
}
/deep/ .cp-list-search-area .inner{
  overflow: unset;
}
/deep/ .el-select-dropdown {
  max-height: 300px;
}
/deep/ .el-scrollbar__view{
  max-height: 300px;
}
</style>
