<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('deliveryMode_list') + ':'" prop="distributionMode">
            <el-input v-model="searchForm.distributionMode" name="searchForm_distributionMode" maxlength="25"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <ody-button name="OmsDeliveryMode_Reset_handleSearchReset" code="OmsDeliveryMode_Reset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</ody-button>
        <ody-button name="OmsDeliveryMode_Query_handleSearchSubmit" code="OmsDeliveryMode_Query" size="small" type="primary" @click="handleSearchSubmit">{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="data"
          :columns="columns"
          :operates="operates"
          :can-filter="false"
          name="data532"
          @custom-sort-change="hanleCustomSortChange"
          @selection-change="handleSelectionChange"/>
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
          @current-change="handlePageCurrentChange"/>

      </div>
    </ody-list-table-area>
  </section>
</template>

<script>

export default {
  name: 'OmsDeliveryMode',
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
        return h('div', {}, ([this.column.render(this.row, this.column)]))
      }
    }
  },
  data() {
    const self = this
    return {
      loading: false,
      data: [],
      searchForm: getDefaultSearchForm(),
      size: 10,
      total: 1,
      current: 1,
      columns: [
        {
          show: true,
          prop: 'shippingCode',
          label: this.$t('deliveryMode_code')
        },
        {
          show: true,
          prop: 'isAvailableStr',
          label: this.$t('isDisable')
        },
        {
          show: true,
          prop: 'distributionMode',
          label: this.$t('deliveryMode_list'),
          align: 'center',
          minWidth: 200
        }
      ], // 需要展示的列
      operates: {
        fixed: 'right',
        list: [
          {
            label: this.$t('enableBtn'),
            disabled: (index, row) => {
              if (row.isAvailable === 0) {
                return false
              } else {
                return true
              }
            },
            method(index, row) {
              // 设置启用
              self.changeIsAvailable(index, row, 1)
            },
            code: 'OmsDeliveryMode_Edit'
          },
          {
            label: this.$t('disableBtn'),
            disabled: (index, row) => {
              if (row.isAvailable === 1) {
                return false
              } else {
                return true
              }
            },
            method(index, row) {
              // 设置禁用
              self.changeIsAvailable(index, row, 0)
            },
            code: 'OmsDeliveryMode_Edit'
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 禁用启用
    changeIsAvailable(index, row, isAvailable) {
      const vue = this
      var lan = ''
      if (isAvailable === 0) {
        lan = this.$t('confirm_disable')
      } else {
        lan = this.$t('confirm_enable')
      }

      this.$confirm(lan, this.$t('prompt'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        row.isAvailable = isAvailable
        this.$oms.$api.distributionModeItem.deliveryModeUpdate(row).then((data) => {
          if (data.code === '0') {
            vue.$message({
              type: 'success',
              message: vue.$t('common_save_success')
            })
            getList(vue)
          }
        })
      }).catch(() => {
        vue.$message({
          type: 'info',
          message: vue.$t('common_cancel_success')
        })
      })
    },
    // 排序
    hanleCustomSortChange({ column, prop, order }) {
      // 这里调用接口重新更新data
      this.data = order === 'ascending' ? this.data : [].concat(this.data).reverse()
    },
    async handleSearchSubmit() {
      this.current = 1
      await getList(this)
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
    },
    handlePageSizeChange() {
      this.handleSearchSubmit()
    },
    async handlePageCurrentChange() {
      try {
        await getList(this)
      } catch (ex) {
        console.log(ex)
      }
    },
    init() {
      getList(this)
    }
  }
}
function getDefaultSearchForm() {
  return Object.assign({}, {

  })
}

async function getList(vue) {
  const param = {
    page: vue.current,
    limit: vue.size,
    filters: vue.searchForm
  }
  const distributionModeItem = vue.$oms.$api.distributionModeItem
  try {
    vue.loading = true
    const res = await distributionModeItem.deliveryModeListPage(param)
    const data = res.data
    vue.data = data
    vue.total = res.total
  } catch (e) {
    console.log(e)
  } finally {
    vue.loading = false
  }
}

</script>

<style lang="scss" scoped>

</style>
