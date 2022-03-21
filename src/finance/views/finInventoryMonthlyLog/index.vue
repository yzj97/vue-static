<template>
  <section>
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="data"
          :columns="columns"
          :operates="operates"
          :checked.sync="checked"
          :can-filter="false"
          name="data718"
          @custom-sort-change="hanleCustomSortChange"
          @selection-change="handleSelectionChange"/>
      </div>

      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="data"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
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
  name: 'FinanceInventoryMonthlyLog',
  data() {
    return {
      data: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      operates: {
        width: 124,
        fixed: 'right',
        list: [
          {
            label: this.$t('re_execute'),
            hidden: (index, row) => {
              return row.status !== 3
            },
            code: 'ui',
            method: (index, row) => {
              this.handleReExecuteSubmit(row.id)
            }
          }
        ]
      },
      columns: [
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('common_merchant_name'),
          align: 'center',
          width: 200
        },
        {
          show: true,
          prop: 'month',
          label: this.$t('cycle_account_period'),
          align: 'center',
          width: 124
        },
        {
          show: true,
          prop: 'statusText',
          label: this.$t('whether_case'),
          align: 'center',
          width: 124
        },
        {
          show: true,
          prop: 'errorMsg',
          label: this.$t('fail_reason'),
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            return (<span>{params.row.errorMsg}</span>)
          }
        }
      ]
    }
  },
  async mounted() {
    await this.updateList()
  },
  methods: {
    async updateList() {
      try {
        this.loading = true
        const param = {
          limit: this.page.size,
          page: this.page.current
        }
        const res = await this.$finance.$api.finInventoryMonthlyLog.finInventoryMonthlyLogListPage(param)
        this.data = res.data
        this.page.total = res.total
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    handleReExecuteSubmit(id) {
      const params = {
        id: id,
        status: 0
      }
      this.$finance.$api.finInventoryMonthlyLog.updateFinInventoryMonthlyLog(params).then((res) => {
        if (res.code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('common_success')
          })
          this.updateList()
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      })
    },
    async handlePageSizeChange(size) {
      try {
        this.$nextTick(function() {
          this.page.size = size
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
