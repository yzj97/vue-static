<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item
              :label="$t('member_cell_phone_number') + ':'"
              class="register"
              prop="mobile"
            >
              <el-input
                v-model="searchForm.mobile"
                name="searchForm_mobile"
                type="text"
              />
            </ody-search-item>
            <ody-search-item :label="$t('可用')" prop="balance">
              <ody-number-range
                v-model="balance"
                :link-string="$t('to')"
                name="balance"
                range="[0,10000)"
                input-width="100"
              />
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button
            name="handleSearchReset"
            size="small"
            @click="handleSearchReset"
          >{{ $t("reset") }}</el-button
          >
          <ody-button
            :code="
              type === 2
                ? 'OuserCenterBalanceFlowListQuery'
                : 'OuserCenterPointsFlowQuery'
            "
            name="handleSearchSubmit"
            size="small"
            type="primary"
            @click="handleSearchSubmit"
          >{{ $t("query") }}</ody-button
          >
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="accountInfoList"
            :columns="columns"
            :operates="operates"
            name="accountInfoList629"
          />
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="page.current"
            :list="accountInfoList"
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
    </section>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    const vue = this
    return {
      accountInfoList: [],
      balance: [],
      searchForm: getDefaultSearchForm(),
      loading: false,
      page: {
        size: 10,
        itemsPerPage: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'userId',
          label: this.$t('user_id'),
          minWidth: 200
        },
        {
          show: true,
          prop: 'mobile',
          label: this.$t('member_cell_phone_number')
        },
        {
          show: true,
          prop: 'totalAmount',
          label: this.$t('可用')
        }
      ],
      operates: {
        fixed: 'right',
        align: 'center',
        minWidth: 124,
        list: [
          {
            label: this.$t('see'),
            disabled: false,
            method(index, row) {
              vue.viewRule(row)
            },
            code:
              this.type === 2
                ? 'OuserCenterBalanceFlowListSee'
                : 'OuserCenterPointsFlowSee'
          }
        ]
      }
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
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
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.balance = []
      this.searchForm = getDefaultSearchForm()
      this.handleSearchSubmit()
    },
    async handlePageSizeChange(size) {
      try {
        this.page.size = size
        await this.updateList()
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
    viewRule(row) {
      sessionStorage.setItem('user_point', JSON.stringify(row))
      sessionStorage.setItem('status', '')
      if (this.type === 2) {
        this.$router.push({
          name: 'OuserCenterBalanceFlowDetail',
          params: {
            entityId: row.entityId
          }
        })
      } else {
        this.$router.push({
          name: 'OuserCenterPointsFlowDetail',
          params: {
            entityId: row.entityId
          }
        })
      }
    },
    init() {
      this.updateList()
    }
  }
}

async function loadList(vue) {
  vue.searchForm.page = vue.page.current
  vue.searchForm.limit = vue.page.size
  if (vue.balance == null) {
    vue.searchForm.balanceAmountStart = null
    vue.searchForm.balanceAmountEnd = null
  } else {
    vue.searchForm.balanceAmountStart = vue.balance[0]
    vue.searchForm.balanceAmountEnd = vue.balance[1]
  }
  let op
  if (vue.type === 2) {
    op = vue.$crm.$api.crmService.listGrowthAccountPage(vue.searchForm)
  } else {
    op = vue.$crm.$api.crmService.listPointAccountPage(vue.searchForm)
  }
  return op.then(res => {
    if (res.code === '0') {
      vue.page.total = res.total
      vue.accountInfoList = res.data
    }
  })
}
function getDefaultSearchForm() {
  return Object.assign(
    {},
    {
      id: null,
      ruleName: null,
      type: null,
      ruleType: null,
      isAvailable: null
    }
  )
}
</script>
