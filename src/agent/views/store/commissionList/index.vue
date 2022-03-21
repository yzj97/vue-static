<template>
  <section>
    <ody-list-search-area v-show="showMerchant">

      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item v-show="showMerchant" :label="$t('common_merchant_name')" prop="merchantName">
            <el-input v-model="searchForm.merchantName" name="searchForm_merchantName" maxlength="25" readonly="readonly" @focus="showMerchantModal" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button v-permission="'CommissionListReset'" v-show="showMerchant" name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button v-permission="'CommissionListQuery'" v-show="showMerchant" name="handleSearchSubmit" size="small" type="primary" @click="handleSearchSubmit">{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button v-permission="'CommissionListAdd'" name="commissionAdd" size="small" type="primary" @click="commissionAdd">{{ $t('add') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="commissionList"
          :columns="commissionColumns"
          :operates="operates"
          name="commissionList478"
        />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="commissionList"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"/>

      </div>
    </ody-list-table-area>
    <MerchantSelectModal :visible.sync="merchantModalVisible" @ok="selectMerchant" />
    <MerchantCommissionSet :visible.sync="showMerchantComissionParamModal" :commission-obj.sync="commissionObj" @clean="clean"/>
  </section>
</template>

<script>
import MerchantSelectModal from '@/components/merchantModal'
import MerchantCommissionSet from '@/components/merchantCommissionSet'
import { mapGetters } from 'vuex'

export default {
  name: 'AgentStoreCommissionList',
  components: {
    MerchantSelectModal,
    MerchantCommissionSet
  },
  data() {
    const self = this
    return {
      merchantModalVisible: false,
      showMerchant: true,
      searchForm: getDefaultSearchForm(),
      loading: false,
      multiple: true,
      showMerchantComissionParamModal: false,
      commissionObj: {},
      commissionList: [],
      platFormId: null,
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      commissionColumns: [
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('common_merchant_name'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'series',
          label: this.$t('distribution_level'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'statusName',
          label: this.$t('common_status'),
          align: 'center',
          minWidth: 120
        }
      ],
      operates: {
        fixed: 'right',
        align: 'center',
        minWidth: 150,
        list: [
          {
            label: this.$t('common_edit'),
            method(index, row) {
              self.edit(row)
            },
            hidden(index, row) {
              if (self.functions.indexOf('CommissionListEdit') >= 0) {
                return false
              } else {
                return true
              }
            }
          },
          {
            label: this.$t('common_enable'),
            method(index, row) {
              self.enable(row)
            },
            hidden(index, row) {
              if (self.functions.indexOf('CommissionListEnable') >= 0) {
                if (row.isAvailable === 0) {
                  return false
                } else {
                  return true
                }
              } else {
                return true
              }
            }
          },
          {
            label: this.$t('common_disable'),
            method(index, row) {
              self.disable(row)
            },
            hidden(index, row) {
              if (self.functions.indexOf('CommissionListDisable') >= 0) {
                if (row.isAvailable === 1) {
                  return false
                } else {
                  return true
                }
              } else {
                return true
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'functions'
    ])
  },
  watch: {
    'searchForm.merchantId': function(val, oldVal) {
      if (val) {
        this.commissionList = []
        this.page.total = 0
      }
    },
    deep: true
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    selectMerchant(merchant) {
      if (merchant) {
        this.searchForm.merchantId = merchant.merchantId
        // this.searchForm.merchantCode = merchant.merchantCode
        this.searchForm.merchantName = merchant.merchantName
      }
    },
    showMerchantModal() {
      this.merchantModalVisible = true
    },
    async checkHiddenMerchant() { // 如果只有一个商家权限，隐藏商家
      const param = {
        itemsPerPage: 10,
        currentPage: 1,
        obj: {}
      }
      const common = this.$agent.$api.common
      const result = await common.merchantList(param)
      if (result && result.data) {
        const data = result.data
        if (data.total === 1) {
          this.showMerchant = false
          this.selectMerchant(data.listObj[0])
        }
      }
    },
    edit(row) {
      this.commissionObj = row
      this.showMerchantComissionParamModal = true
    },
    commissionAdd() {
      this.commissionObj = {}
      this.showMerchantComissionParamModal = true
    },
    async enable(row) {
      const vue = this
      const updateObj = {}
      updateObj.id = row.id
      updateObj.isAvailable = 1
      const commission = vue.$agent.$api.commission
      const result = await commission.updateCommission(updateObj)
      if (result) {
        if (result.code === '0') {
          this.updateList()
          this.$message({
            type: 'success',
            message: this.$t('common_operate_success')
          })
        }
      }
    },
    async disable(row) {
      // const vue = this
      const vue = this
      const updateObj = {}
      updateObj.id = row.id
      updateObj.isAvailable = 0
      const commission = vue.$agent.$api.commission
      const result = await commission.updateCommission(updateObj)
      if (result) {
        if (result.code === '0') {
          this.updateList()
          this.$message({
            type: 'success',
            message: this.$t('common_operate_success')
          })
        }
      }
    },
    clean() {
      this.updateList()
    },
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
      await this.checkHiddenMerchant()
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
    async getPlatformId() {
      try {
        const common = this.$agent.$api.common
        const result = await common.getPlatformId()
        if (result.data) {
          this.platFormId = result.data
        }
      } catch (ex) {
        console.log(ex)
      }
    },
    async init() {
      await this.checkHiddenMerchant()
      await this.getPlatformId()
      await this.updateList()
    }
  }
}
async function loadList(vue) {
  const param = {
    merchantId: vue.searchForm.merchantId,
    limit: vue.page.size,
    page: vue.page.current
  }
  const commission = vue.$agent.$api.commission
  const res = await commission.queryCommissionPage(param)
  if (res.data) {
    vue.commissionList = res.data.listObj
    vue.page.total = res.data.total
  }
}
function getDefaultSearchForm() {
  return Object.assign({}, { merchantId: null })
}
</script>
<style lang="scss" scoped>
</style>
