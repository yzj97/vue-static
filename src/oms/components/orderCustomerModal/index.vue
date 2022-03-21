<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('please_choose')"
      width="960px"
      @open="init"
    >
      <section class="pg-customerModal-list">
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="50px" class="form">
              <ody-search-item :label="$t('客户编码')" prop="customerCode">
                <el-input v-model="searchForm.customerCode" name="searchForm_customerCode" />
              </ody-search-item>
              <ody-search-item :label="$t('客户名称')" prop="customerName">
                <el-input v-model="searchForm.customerName" name="searchForm_customerName" />
              </ody-search-item>
              <ody-search-item :label="$t('客户类型')" prop="customerType">
                <el-select v-model="searchForm.customerType" :placeholder="$t('common_all')" name="searchForm_customerType">
                  <el-option
                    v-for="(value, key) in customerTypeMap"
                    :key="key"
                    :value="key"
                    :label="value"
                  />
                </el-select>
              </ody-search-item>
            </el-form>
          </div>
          <div slot="btn">
            <el-button
              name="handleSearchSubmit"
              size="small"
              type="primary"
              @click="handleSearchSubmit"
            >{{ $t('common_select') }}</el-button>
            <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
          </div>
        </ody-list-search-area>
        <ody-list-table-area>
          <div slot="table">
            <ody-table
              :loading="loading"
              :data="list"
              :columns="columns"
              :highlight-current-row="true"
              :checked.sync="checked"
              :data-key="dataKey"
              name="list040"
              @selection-change="handleSelectionChange"
            />
          </div>
          <div slot="page">
            <div class="block">
              <ody-pagination
                v-if="list && list.length"
                :current-page.sync="page.current"
                :list="list"
                :page-sizes="[10, 20, 30, 50]"
                :page-size.sync="page.size"
                :total.sync="page.total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handlePageSizeChange"
                @current-change="handlePageCurrentChange"
              />
            </div>
          </div>
        </ody-list-table-area>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <el-button
          :disabled="checked.length !== 1"
          name="handleOk"
          size="small"
          type="primary"
          @click="handleOk"
        >{{ $t('ok') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchForm: getDefaultSearchForm(),
      loading: false,
      checked: [],
      list: [],
      dataKey: 'customerId',
      page: getDefaultPage(),
      customerTypeMap: {
        '4': '经销商',
        '5': '分销商',
        '6': '加盟商'
      },
      columns: [
        {
          show: true,
          prop: 'customerId',
          label: this.$t('客户ID'),
          align: 'center',
          minWidth: 130
        },
        {
          show: true,
          prop: 'customerCode',
          label: this.$t('客户编码'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'customerName',
          label: this.$t('客户名称'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'customerType',
          label: this.$t('客户类型'),
          align: 'center',
          minWidth: 120,
          formatter: (row, column, cellValue) => {
            return this.customerTypeMap['' + row.customerType]
          }
        },
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('商家名称'),
          align: 'center',
          minWidth: 120
        }
      ]
    }
  },
  watch: {
    visible(newValue, oldValue) {
      if (newValue) {
        this.checked = []
      }
    }
  },
  methods: {
    async updateList() {
      try {
        this.loading = true
        await this.loadList(this)
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    async loadList(vue) {
      if (vue.searchForm) {
        if (!vue.searchForm.customerCode) {
          delete vue.searchForm.customerCode
        }
        if (!vue.searchForm.customerName) {
          delete vue.searchForm.customerName
        }
        if (!vue.searchForm.customerType) {
          delete vue.searchForm.customerType
        }
      }
      const param = {
        itemsPerPage: vue.page.size,
        currentPage: vue.page.current,
        customerInDTO: vue.searchForm
      }
      const common = vue.$oms.$api.common
      const result = await common.queryCustomerList(param)
      if (result && result.data) {
        const data = result.data
        vue.list = data.listObj
        vue.page.total = data.total
      }
    },
    handleSelectionChange(val) {
      this.checked = [val]
    },
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.page = getDefaultPage()
      this.searchForm = getDefaultSearchForm()
    },
    async handlePageSizeChange(size) {
      try {
        this.$nextTick(function() {
          this.updateList()
        })
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    init() {
      this.page = getDefaultPage()
      this.handleSearchSubmit()
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    handleOk() {
      const vue = this
      console.log(vue.checked)
      if (this.checked.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('errorSelectAtLeastOne')
        })
      } else if (this.checked.length > 1) {
        this.$message({
          type: 'warning',
          message: this.$t('errorSelectMoreThanOne')
        })
      } else {
        vue.$emit('update:visible', !vue.visible)
        vue.$emit('ok', vue.checked[0])
      }
    }
  }
}

function getDefaultSearchForm() {
  return Object.assign({}, {})
}
function getDefaultPage() {
  return {
    size: 10,
    current: 1,
    total: 0
  }
}
</script>

<style lang="scss" scoped>
</style>
