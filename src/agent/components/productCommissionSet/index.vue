<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('common_product_code')" prop="code">
            <el-input v-model="searchForm.code" name="searchForm_code" maxlength="50" />
          </ody-search-item>
          <ody-search-item :label="$t('common_product_name')" prop="name">
            <el-input v-model="searchForm.name" name="searchForm_name" maxlength="50" />
          </ody-search-item>
          <ody-search-item :label="$t('common_product_brand')" prop="brandName">
            <el-input v-model="searchForm.brandName" name="searchForm_brandName" readonly="readonly" @focus="showBrandModal"/>
          </ody-search-item>
          <ody-search-item :label="$t('common_product_category')" prop="categoryNodeId">
            <MerchantCategorySelect ref="merchantCategorySelect" v-model="searchForm.categoryNodeId" :display-full-name="false" :merchant-id="searchForm.merchantId" name="searchForm_categoryNodeId" @clean="cleanSelected" @select="selectNode" />
          </ody-search-item>
          <ody-search-item v-show="showMerchant" :label="$t('common_merchant_name')" prop="merchantName">
            <el-input v-model="searchForm.merchantName" name="searchForm_merchantName" maxlength="25" readonly="readonly" @focus="showMerchantModal"/>
          </ody-search-item>
          <ody-search-item :label="$t('store_name')" prop="storeId">
            <el-select v-model="searchForm.storeId" name="searchForm_storeId">
              <el-option
                v-for="(item,index) in storeList"
                :key="index"
                :label="item.storeName"
                :value="item.storeId"/>
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button v-permission="'PorductCommissionReset'" name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button v-permission="'PorductCommissionQuery'" name="handleSearchSubmit" size="small" type="primary" @click="handleSearchSubmit">{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button v-permission="'PorductCommissionBatchSet'" name="batchCommissionSet" size="small" type="primary" @click="batchCommissionSet">{{ $t('batch_commission_set') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="productList"
          :columns="productColumns"
          :operates="operates"
          :multiple="true"
          :checked.sync="checked"
          name="productList304"
        />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="productList"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"/>

      </div>
    </ody-list-table-area>
    <BrandModal :visible.sync="brandVisible" :merchant-id="searchForm.merchantId" @ok="handleBrand" />
    <MerchantSelectModal :visible.sync="merchantModalVisible" @ok="selectMerchant" />
    <CommissionParam :visible.sync="showComissionParamModal" :commission-params.sync="commissionParams" @clean="clean"/>
  </section>
</template>

<script>
import MerchantCategorySelect from '@/components/merchantCategorySelect'
import BrandModal from '@/components/brandModal'
import MerchantSelectModal from '@/components/merchantModal'
import CommissionParam from '@/components/commissionParam'
import { mapGetters } from 'vuex'
export default {
  components: {
    MerchantSelectModal,
    MerchantCategorySelect,
    BrandModal,
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
      storeList: [],
      brandVisible: false,
      merchantModalVisible: false,
      showComissionParamModal: false,
      showMerchant: true,
      searchForm: getDefaultSearchForm(),
      loading: false,
      multiple: true,
      productList: [],
      categoryTreeData: [],
      checked: [],
      commissionParams: {},
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      productColumns: [
        {
          show: true,
          prop: 'code',
          label: this.$t('common_product_code'),
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          prop: 'chineseName',
          label: this.$t('common_product_name'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'categoryName',
          label: this.$t('common_product_category'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'brandName',
          label: this.$t('common_brand_name'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'statusStr',
          label: this.$t('common_product_status'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'channelName',
          label: this.$t('common_channel_name'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'storeName',
          label: this.$t('store_name'),
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
            label: this.$t('commission_set'),
            method(index, row) {
              self.commissionSet(row)
            },
            hidden(index, row) {
              if (self.functions.indexOf('PorductCommissionSet') >= 0) {
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
        this.$refs['merchantCategorySelect'].cleanOptions()
        this.searchForm.brandId = null
        this.searchForm.brandName = null
        this.searchForm.categoryName = null
        this.searchForm.categoryNodeId = null
        this.$refs['merchantCategorySelect'].cleanSelected()
        this.productList = []
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
        this.changeMerchant()
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
    showBrandModal() {
      this.brandVisible = true
    },
    handleBrand(brands) {
      let brand
      if (Array.isArray(brands)) {
        brand = brands[0]
      } else {
        brand = brands
      }
      if (brand) {
        this.searchForm.brandId = brand.id
        this.searchForm.brandName = brand.name
      }
    },
    selectNode(nodes) {
      this.searchForm.categoryNodeId = null
      this.searchForm.categoryName = null
      let selectedNode = null
      if (Array.isArray(nodes) && nodes.lengt > 0) {
        selectedNode = nodes[0]
      } else {
        selectedNode = nodes
      }
      if (selectedNode) {
        this.searchForm.categoryName = selectedNode.name
        this.searchForm.categoryNodeId = selectedNode.id
      }
    },
    cleanSelected() {
      this.searchForm.categoryName = null
      this.searchForm.categoryNodeId = null
    },
    clean() {
      this.checked = []
      this.updateList()
    },
    async changeMerchant() {
      this.searchForm.storeId = null
      if (this.searchForm.merchantId) {
        const agent = this.$agent.$api.agent
        const res = await agent.queryPlatformAuthStorePage({ merchantId: this.searchForm.merchantId, currentPage: 1, itemsPerPage: 500 })
        if (res) {
          this.storeList = res.data.listObj
        }
      } else {
        this.storeList = []
      }
    },
    async commissionSet(row) {
      const vue = this
      const checkObj = {}
      checkObj.referIds = []
      checkObj.referIds.push(row.id)
      checkObj.commissionType = 2
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
        commissionParams.commissionType = '2'
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
          checkObj.commissionType = 2
          checkObj.merchantId = merchantId
          const agent = vue.$agent.$api.commission
          const result = await agent.getCommissionRule(checkObj)
          if (result) {
            const commissionObj = result.data
            const commissionParams = {}
            commissionParams.referIds = []
            commissionParams.isbatchSet = true
            commissionParams.referIds = itemArray
            commissionParams.commissionType = '2'
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
        if (!this.searchForm.merchantId) {
          this.$message({
            type: 'warning',
            message: this.$t('common_choose_merchant')
          })
          return
        }
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handleSearchReset() {
      this.checked = []
      this.merchantId = null
      this.merchantName = null
      this.searchForm.storeId = null
      this.searchForm.brandId = null
      this.searchForm.brandName = null
      this.searchForm.categoryName = null
      this.searchForm.categoryNodeId = null
      this.searchForm.code = null
      this.searchForm.name = null
      this.$refs['merchantCategorySelect'].cleanSelected()
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
    async init() {
      await this.checkHiddenMerchant()
      await this.updateList()
    }
  }
}
async function loadList(vue) {
  if (vue.searchForm.merchantId) {
    const param = {
      code: vue.searchForm.code,
      name: vue.searchForm.name,
      brandId: vue.searchForm.brandId,
      categoryNodeId: vue.searchForm.categoryNodeId,
      merchantId: vue.searchForm.merchantId,
      storeId: vue.searchForm.storeId,
      pageSize: vue.page.size,
      pageIndex: vue.page.current
    }
    const agent = vue.$agent.$api.agent
    const res = await agent.goodsList(param)
    if (res) {
      vue.productList = res.data
      vue.page.total = res.total
    }
  }
}
function getDefaultSearchForm() {
  return Object.assign({}, { merchantId: null, storeId: null, merchantName: null, code: null, name: null, brandId: null, brandName: null, categoryName: null, categoryNodeId: null })
}
</script>
<style lang="scss" scoped>
</style>
