<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('common_brand_name')" prop="name">
            <el-input v-model="searchForm.name" name="searchForm_name" maxlength="50" />
          </ody-search-item>
          <ody-search-item v-show="showMerchant" :label="$t('common_merchant_name')" prop="merchantName">
            <el-input v-model="searchForm.merchantName" name="searchForm_merchantName" maxlength="25" readonly="readonly" @focus="showMerchantModal" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button v-permission="'BrandCommissionReset'" name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button v-permission="'BrandCommissionQuery'" name="handleSearchSubmit" size="small" type="primary" @click="handleSearchSubmit">{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button v-permission="'BrandCommissionBatchSet'" name="batchCommissionSet" size="small" type="primary" @click="batchCommissionSet">{{ $t('batch_commission_set') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="brandList"
          :columns="brandColumns"
          :operates="operates"
          :multiple="true"
          :checked.sync="checked"
          name="brandList554"
        />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="brandList"
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
    <CommissionParam :visible.sync="showComissionParamModal" :commission-params.sync="commissionParams" @clean="clean"/>
  </section>
</template>

<script>
import MerchantSelectModal from '@/components/merchantModal'
import CommissionParam from '@/components/commissionParam'
import { mapGetters } from 'vuex'
export default {
  components: {
    MerchantSelectModal,
    CommissionParam
  },
  props: {
    merchantId: {
      type: Number,
      default: null
    },
    merchantName: {
      type: String,
      default: null
    }
  },
  data() {
    const self = this
    return {
      merchantModalVisible: false,
      showMerchant: true,
      searchForm: getDefaultSearchForm(),
      loading: false,
      multiple: true,
      brandList: [],
      checked: [],
      showComissionParamModal: false,
      commissionParams: {},
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      brandColumns: [
        {
          show: true,
          prop: 'name',
          label: this.$t('common_brand_name'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'englishName',
          label: this.$t('common_brand_english_name'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'alias',
          label: this.$t('common_brand_alias_name'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'trademarkUrl',
          label: this.$t('brand_logo'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'introduction',
          label: this.$t('brand_introduction'),
          align: 'center',
          minWidth: 80
        }
      ],
      operates: {
        fixed: 'right',
        align: 'center',
        minWidth: 150,
        list: [
          {
            label: this.$t('commission_set'),
            method(index, row) {
              self.commissionSet(row)
            },
            hidden(index, row) {
              if (self.functions.indexOf('OpmsPurchasePlanList04') >= 0) {
                return false
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
        this.merchantId = null
        this.merchantName = null
        this.searchForm.name = null
        this.brandList = []
        this.page.total = 0
        this.checked = []
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
        } else {
          this.searchForm.merchantId = this.merchantId
          this.searchForm.merchantName = this.merchantName
        }
      }
    },
    async commissionSet(row) {
      const vue = this
      const checkObj = {}
      checkObj.referIds = []
      checkObj.referIds.push(row.id)
      checkObj.commissionType = 3
      checkObj.merchantId = row.merchantId
      const agent = vue.$agent.$api.commission
      const result = await agent.getCommissionRule(checkObj)
      if (result) {
        const commissionObj = result.data
        const commissionParams = {}
        const commissionParamsObj = {}
        commissionParams.referIds = []
        commissionParams.isbatchSet = false
        commissionParamsObj.referId = row.id
        commissionParamsObj.merchantId = row.merchantId
        commissionParams.referIds.push(commissionParamsObj)
        commissionParams.commissionType = '3'
        commissionParams.commissionId = commissionObj.commissionId
        commissionParams.layer = commissionObj.layer
        commissionParams.dimensionRules = commissionObj.dimensionRules
        this.commissionParams = commissionParams
        // console.log(commissionObj.dimensionRules)
        this.showComissionParamModal = true
      }
    },
    async batchCommissionSet() {
      if (this.checked && this.checked.length > 0) {
        const ids = []
        const itemArray = []
        let merchantId = null
        for (let i = 0; i < this.checked.length; i++) {
          const item = this.checked[i]
          ids.push(item.id)
          itemArray.push({ referId: item.id, merchantId: item.merchantId })
          merchantId = item.merchantId
        }
        if (ids.length > 0) {
          const vue = this
          const checkObj = {}
          checkObj.referIds = ids
          checkObj.commissionType = 3
          checkObj.merchantId = merchantId
          const agent = vue.$agent.$api.commission
          const result = await agent.getCommissionRule(checkObj)
          if (result) {
            const commissionObj = result.data
            const commissionParams = {}
            commissionParams.referIds = []
            commissionParams.isbatchSet = true
            commissionParams.referIds = itemArray
            commissionParams.commissionType = '3'
            commissionParams.commissionId = commissionObj.commissionId
            commissionParams.layer = commissionObj.layer
            commissionParams.dimensionRules = commissionObj.dimensionRules
            this.commissionParams = commissionParams
            // console.log(commissionObj.dimensionRules)
            this.showComissionParamModal = true
          }
        }
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('common_choose_one')
        })
        return
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
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        if (!this.searchForm.merchantId) {
          this.$message({
            type: 'warning',
            message: this.$t('common_choose_merchant')
          })
          return
        }
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handleSearchReset() {
      this.merchantId = null
      this.merchantName = null
      this.checked = []
      this.searchForm.name = null
      await this.checkHiddenMerchant()
    },
    async handlePageSizeChange(size) {
      try {
        if (!this.searchForm.merchantId) {
          this.$message({
            type: 'warning',
            message: this.$t('common_choose_merchant')
          })
          return
        }
        this.$nextTick(function() {
          this.updateList()
        })
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        if (!this.searchForm.merchantId) {
          this.$message({
            type: 'warning',
            message: this.$t('common_choose_merchant')
          })
          return
        }
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    clean() {
      this.checked = []
      this.updateList()
    },
    async init() {
      await this.checkHiddenMerchant()
      await this.updateList()
    }
  }
}
async function loadList(vue) {
  if (vue.searchForm.merchantId) {
    const param = {
      merchantId: vue.searchForm.merchantId,
      name: vue.searchForm.name,
      limit: vue.page.size,
      page: vue.page.current
    }
    const agent = vue.$agent.$api.agent
    const res = await agent.brandList(param)
    if (res) {
      vue.brandList = res.data
      vue.page.total = res.total
    }
  }
}
function getDefaultSearchForm() {
  return Object.assign({}, { merchantId: null, merchantName: null, name: null })
}
</script>
<style lang="scss" scoped>
</style>
