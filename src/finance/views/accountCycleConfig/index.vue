<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('common_merchant_name') + ':'" prop="merchantName">
            <el-input v-model="searchForm.merchantName" :placeholder="$t('common_choose_please')" name="searchForm_merchantName" readonly="true" @click.native="showMerchantSelectModal"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button name="FinanceAccountCycleConfigList_handleSearchSubmit" code="FinanceAccountCycleConfigList" size="small" type="primary" @click="handleSearchSubmit">{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button name="FinanceAccountCycleConfigAdd_handleSearchAdd" code="FinanceAccountCycleConfigAdd" type="primary" size="small" @click="handleSearchAdd">{{ $t('common_add') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data.sync="data"
          :columns="columns"
          :operates="operates"
          :checked.sync="checked"
          :can-filter="false"
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
    <MerchantSelectModal :visible.sync="showMerchantModal" @ok="selectMerchant" />
  </section>
</template>

<script>
import MerchantSelectModal from '@/components/merchantModal'

export default {
  name: 'FinanceAccountCycleConfig',
  components: {
    MerchantSelectModal
  },
  data() {
    return {
      loading: false,
      checked: [],
      data: [],
      createTime: null,
      cycleType: null,
      showMerchantModal: false,
      searchForm: {},
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      operates: {
        width: 150,
        fixed: 'right',
        list: [
          {
            label: this.$t('common_edit'),
            code: 'FinanceAccountCycleConfigUpdate',
            method: (index, row) => {
              this.$router.push({
                name: 'FinanceAccountCycleConfigEdit',
                query: {
                  row: row,
                  type: 'edit'
                }
              })
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
          minWidth: 200,
          render: (h, params) => {
            const p = {
              name: 'FinanceAccountCycleConfigEdit',
              query: {
                row: params.row,
                type: 'view'
              }
            }
            return (
              <router-link to={p} class='link-type'>
                <span>{ params.row.merchantName}</span>
              </router-link>
            )
          }
        },
        {
          show: true,
          prop: 'cycleType',
          label: this.$t('cycle_type'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column) => {
            if (row.cycleType === 1) {
              return this.$t('cycle_calendar_month')
            } else {
              return this.$t('cycle_non_calendar_month')
            }
          }
        },
        {
          show: true,
          prop: 'createUsername',
          label: this.$t('common_creator'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'createTime',
          label: this.$t('common_date'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column) => {
            if (row.createTime) {
              return this.$portal.parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
            return ''
          }
        }
      ]
    }
  },
  async mounted() {
    await this.init()
  },
  methods: {
    async init() {
      await this.getList()
    },
    selectMerchant(result) {
      if (result) {
        this.searchForm.merchantCode = result.merchantCode
        this.searchForm.merchantId = result.merchantId
        this.searchForm.merchantName = result.merchantName
      }
    },
    showMerchantSelectModal() {
      this.showMerchantModal = true
    },
    async getList() {
      const params = {
        filters: {
          merchantId: this.searchForm.merchantId
        },
        limit: this.page.size,
        page: this.page.current
      }
      try {
        this.loading = true
        const res = await this.$finance.$api.accountCycle.accountCycleListPage(params)
        this.data = res.data
        this.page.total = res.total
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    async handleSearchSubmit() {
      this.page.current = 1
      await this.getList()
    },
    handleSearchReset() {
      this.searchForm = {}
    },
    handleSearchAdd() {
      this.$router.push({ name: 'FinanceAccountCycleConfigEdit', query: { row: null }})
    },
    handlePageSizeChange(size) {
      this.handleSearchSubmit()
    },
    handlePageCurrentChange() {
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
