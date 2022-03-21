<template>
  <section class="pg-storePickingCenter-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="searchForm" label-width="100px" class="form">
          <ody-search-item :label="$t('order_ruleCode') + ':'" prop="code">
            <el-input v-model="searchForm.code" name="searchForm_code" maxlength="25" clearable />
          </ody-search-item>
          <ody-search-item :label="$t('order_ruleName') + ':'" prop="name">
            <el-input v-model="searchForm.name" name="searchForm_name" maxlength="25" clearable />
          </ody-search-item>
          <ody-search-item :label="$t('order_ports_type') + ':'" prop="orderType">
            <el-select
              v-model="searchForm.orderType"
              :placeholder="$t('common_all')"
              name="searchForm_orderType"
              maxlength="25"
            >
              <el-option
                v-for="item in orderTypes"
                :label="item.name"
                :key="item.code"
                :value="parseInt(item.code)"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('isDisable')" prop="isDisable">
            <el-select
              v-model="searchForm.isDisable"
              :placeholder="$t('common_all')"
              name="searchForm_isDisable"
              maxlength="25"
              clearable
            >
              <el-option
                v-for="item in disableList"
                :label="item.name"
                :key="item.code"
                :value="parseInt(item.code)"
              />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <ody-button name="OmsOrderTypeMappingRule_Reset_clearData" code="OmsOrderTypeMappingRule_Reset" size="small" @click="clearData">{{ $t('common_reset') }}</ody-button>
        <ody-button name="OmsOrderTypeMappingRule_Query_search" code="OmsOrderTypeMappingRule_Query" size="small" type="primary" @click="search">{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button name="OmsOrderTypeMappingRule_Add_toAdd" code="OmsOrderTypeMappingRule_Add" size="small" type="primary" @click="toAdd">{{ $t('add') }}</ody-button>
        <ody-button :disabled="!checked || checked.length === 0" name="OmsOrderTypeMappingRule_Disabled_batchDisable" code="OmsOrderTypeMappingRule_Disabled" size="small" @click="batchDisable">{{ $t('order_batch_disable') }}</ody-button>
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
          name="data707"
        />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="queryArgs.page"
          :list="data"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="queryArgs.limit"
          :total.sync="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="search"
          @current-change="searchData"
        />
      </div>
    </ody-list-table-area>
  </section>
</template>

<script>
export default {
  name: 'OmsOrderTypeMappingRule',
  data() {
    const vm = this
    return {
      searchForm: vm._formData(),
      orderTypes: [],
      orderTypeMap: {},
      disableList: [],
      disableMap: {},
      queryArgs: {
        page: 1,
        limit: 10
      },
      total: 0,
      data: [],
      checked: [],
      loading: false,
      columns: [
        {
          show: true,
          prop: 'priority',
          label: this.$t('order_priority'),
          align: 'center'
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
          prop: 'orderType',
          label: this.$t('order_ports_type'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            return vm.orderTypeMap[row.orderType]
          }
        },
        {
          show: true,
          prop: 'isDisable',
          label: this.$t('isDisable'),
          align: 'center',
          minWidth: 88,
          formatter: (row, column, cellValue) => {
            return vm.disableMap[row.isDisable + '']
          }
        }
      ],
      operates: {
        fixed: 'right',
        list: [
          {
            label: vm.$t('edit'),
            disabled: false,
            method(index, row) {
              vm.toEdit(index, row)
            },
            code: 'OmsOrderTypeMappingRule_Edit'
          },
          {
            label: vm.$t('delete'),
            disabled: false,
            method(index, row) {
              vm.del(index, row)
            },
            code: 'OmsOrderTypeMappingRule_Deleted'
          }
        ]
      }
    }
  },
  async mounted() {
    try {
      this._init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    toAdd() {
      this.$router.push({
        name: 'OmsOrderTypeMappingRuleCon',
        params: {}
      })
    },
    toEdit(index, row) {
      this.$router.push({
        name: 'OmsOrderTypeMappingRuleCon',
        params: { id: row.id }
      })
    },
    del(index, row) {
      this.$confirm(this.$t('delete_confirm'), this.$t('prompt'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$oms.$api.soTypeMappingRule
          .soTypeMappingRuleDelete({ id: row.id })
          .then(data => {
            if (data.code === '0') {
              this.$message({
                type: 'success',
                message: this.$t('common_delete_success')
              })
              this.searchData()
            }
          })
      })
    },
    batchDisable() {
      /* if (this.checked.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('invoiceInqurity_pleaseselectOne')
        })
        return false
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
      }).then(() => {
        this.$oms.$api.soTypeMappingRule
          .soTypeMappingRuleBatchDsiable({
            ids: this.checked.map(i => i.id),
            isDisabled: 1
          })
          .then(data => {
            if (data.code === '0') {
              this.$message({
                type: 'success',
                message: this.$t('common_update_success')
              })
              this.searchData()
            }
          })
      })
    },
    async search() {
      this.queryArgs.page = 1
      await this.searchData()
    },
    async searchData() {
      this.checked = []
      this.queryArgs.filters = this.searchForm
      if (this.queryArgs.filters.code && this.queryArgs.filters.code === '') {
        this.queryArgs.filters.code = null
      }
      if (this.queryArgs.filters.name && this.queryArgs.filters.name === '') {
        this.queryArgs.filters.name = null
      }
      if (this.queryArgs.filters.orderType && this.queryArgs.filters.orderType === '') {
        this.queryArgs.filters.orderType = null
      }
      if (this.queryArgs.filters.isDisable && this.queryArgs.filters.isDisable === '') {
        this.queryArgs.filters.isDisable = null
      }
      try {
        this.loading = true
        const data = await this.$oms.$api.soTypeMappingRule.soTypeMappingRuleListPage(
          this.queryArgs
        )
        this.data = data.data
        this.total = data.total
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    clearData() {
      this.searchForm = this._formData()
    },
    _formData() {
      return {}
    },
    async _init() {
      await this._listOrderTypes()
      await this._listStatusList()
      this.searchData()
    },
    _listOrderTypes() {
      this.$oms.$api.soType.soTypeList({}).then(data => {
        this.orderTypes = data.data
        this.orderTypeMap = Object.assign({})
        this.orderTypes.forEach(item => {
          this.orderTypeMap[item.code] = item.name
        })
      })
    },
    _listStatusList() {
      this.$oms.$api.common
        .selectCodes({ category: 'is_disable' })
        .then(data => {
          this.disableList = data.data
          this.disableMap = Object.assign({})
          this.disableList.forEach(item => {
            this.disableMap[item.code] = item.name
          })
        })
    }
  }
}
</script>
