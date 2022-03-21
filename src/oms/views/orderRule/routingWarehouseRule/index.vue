<template>
  <section class="pg-routingWarehouseRule-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('order_ruleCode') + ':'" prop="code">
            <el-input v-model="searchForm.code" name="searchForm_code" maxlength="25" />
          </ody-search-item>
          <ody-search-item :label="$t('order_ruleName') + ':'" prop="name">
            <el-input v-model="searchForm.name" name="searchForm_name" maxlength="25" />
          </ody-search-item>
          <ody-search-item :label="$t('isDisable') + ':'" prop="isDisable">
            <el-select
              v-model="searchForm.isDisable"
              :popper-append-to-body="false"
              :placeholder="$t('common_all')"
              name="searchForm_isDisable"
              @change="loadWarehouseByMerchant"
            >
              <el-option
                v-for="item in isDisableList"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('order_ruleMerchant') + ':'" prop="merchantId">
            <el-select
              v-model="searchForm.merchantId"
              :popper-append-to-body="false"
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
        </el-form>
        <el-form ref="form" label-width="100px" class="form" />
      </div>
      <div slot="btn">
        <ody-button name="OmsRoutingWarehouseRule_Reset_handleSearchReset" code="OmsRoutingWarehouseRule_Reset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</ody-button>
        <ody-button
          name="OmsRoutingWarehouseRule_Query_handleSearchSubmit"
          code="OmsRoutingWarehouseRule_Query"
          size="small"
          type="primary"
          @click="handleSearchSubmit"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button name="OmsRoutingWarehouseRule_Add_add" code="OmsRoutingWarehouseRule_Add" size="small" type="primary" @click="add">{{ $t('add') }}</ody-button>
        <ody-button :disabled="!checked || checked.length === 0" name="OmsRoutingWarehouseRule_Disabled_discontinue" code="OmsRoutingWarehouseRule_Disabled" size="small" @click="discontinue">{{ $t('order_batch_disable') }}</ody-button>
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
          name="data003"
          @custom-sort-change="hanleCustomSortChange"
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
  name: 'OmsRoutingWarehouseRule',
  components: {
    expandDom: {
      props: {
        column: {
          required: true
        },
        row: {
          required: true
        }
      },
      render(h) {
        return h('div', {}, [this.column.render(this.row, this.column)])
      }
    }
  },
  data() {
    const self = this
    return {
      loading: false,
      checked: [],
      data: [],
      merchantList: [],
      checkAll: false,
      searchForm: getDefaultSearchForm(),
      isDisableList: [],
      page: 1,
      size: 10,
      total: 1,
      current: 1,
      columns: [
        {
          show: true,
          prop: 'priority',
          label: this.$t('order_priority'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'code',
          label: this.$t('order_ruleCode'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'name',
          label: this.$t('order_ruleName'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('order_ruleMerchant'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'isDisable',
          label: this.$t('isDisable'),
          align: 'center',
          formatter: (row, column, cellValue) => {
            return self.isDisableMap[row.isDisable]
          }
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
            code: 'OmsRoutingWarehouseRule_Edit'
          },
          {
            label: this.$t('delete'),
            disabled: false,
            method(index, row) {
              self.handleDel(index, row)
            },
            code: 'OmsRoutingWarehouseRule_Deleted'
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
        name: 'OmsRoutingWarehouseRuleDetail',
        params: {
          id: row.id
        }
      })
    },
    // 删除
    handleDel(index, row) {
      this.$confirm(this.$t('delete_confirm'), this.$t('prompt'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$oms.$api.mappingWarehouseRule
            .routingWarehouseRuleDelete({ id: row.id })
            .then(data => {
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
          /* this.$message({
            type: 'info',
            message: this.$t('common_cancel_success')
          })*/
        })
    },
    initCodes() {
      this.$oms.$api.common
        .listByCategorysForOrder({ categorys: ['IS_DISABLE'] })
        .then(data => {
          this.isDisableList = data.data.IS_DISABLE
          this.isDisableMap = data.data.IS_DISABLE.reduce((m, i) => {
            m[i.code] = i.name
            return m
          }, {})
        })
    },
    initMerchants() {
      this.$oms.$api.common
        .merchantList({ currentPage: 1, itemsPerPage: 1000 })
        .then(data => {
          this.merchantList = data.data.listObj
          this.merchantMap = data.data.listObj.reduce((m, i) => {
            m[i.merchantId] = i.merchantName
            return m
          }, {})
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
    async discontinue() {
      /* if (this.checked === [] || this.checked === '') {
        this.$message({
          type: 'warning',
          message: this.$t('please_choose')
        })
        return
      }*/
      for (let i = 0; i < this.checked.length; i++) {
        if (this.checked[i].isDisable === 1) {
          this.$message({
            type: 'warning',
            message: this.$t('order_can_not_disable_disabled_data')
          })
          return
        }
      }
      this.$confirm(this.$t('confirm_disable'), this.$t('prompt'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          const param = []
          this.checked.forEach(function(i) {
            param.push(i.id)
          })
          this.$oms.$api.mappingWarehouseRule
            .routingWarehouseRuleBatchDisable(JSON.stringify(param))
            .then(data => {
              if (data.code === '0') {
                this.$message({
                  type: 'success',
                  message: this.$t('common_update_success')
                })
                this.updateList()
              }
            })
        })
        .catch(() => {
          /* this.$message({
            type: 'info',
            message: this.$t('common_cancel_success')
          })*/
        })
    },
    add() {
      this.$router.push({ name: 'OmsRoutingWarehouseRuleDetail', params: {}})
    },
    init() {
      this.initCodes()
      this.initMerchants()
      getList(this)
    }
  }
}
function getDefaultSearchForm() {
  return Object.assign({}, {})
}

async function getList(vue) {
  console.log(vue.searchForm.merchantId)
  vue.checked = []
  const param = {
    page: vue.current,
    limit: vue.size,
    filters: {
      code: vue.searchForm.code,
      name: vue.searchForm.name,
      merchantId: vue.searchForm.merchantId ? vue.searchForm.merchantId + '' : null,
      isDisable: vue.searchForm.isDisable
    }
  }
  const routingWarehouseRuleList = vue.$oms.$api.mappingWarehouseRule
  const res = await routingWarehouseRuleList.routingWarehouseRuleListPage(param)
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
