<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item v-show="showMerchant" :label="$t('common_merchant_name')" prop="merchantName">
            <el-input v-model="searchForm.merchantName" name="searchForm_merchantName" maxlength="25" readonly="readonly" @focus="showMerchantModal" />
          </ody-search-item>
          <ody-search-item :label="$t('common_product_category')" prop="categoryNodeId">
            <MerchantCategorySelect ref="merchantCategorySelect" v-model="searchForm.categoryNodeId" :display-full-name="false" :merchant-id="searchForm.merchantId" name="searchForm_categoryNodeId" @clean="cleanSelected" @select="selectNode" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button v-permission="'CategoryCommissionReset'" v-show="showMerchant" name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
      </div>
    </ody-list-search-area>
    <MerchantSelectModal :visible.sync="merchantModalVisible" @ok="selectMerchant" />
    <CommissionParam :visible.sync="showComissionParamModal" :commission-params.sync="commissionParams" />
  </section>
</template>

<script>
import MerchantSelectModal from '@/components/merchantModal'
import MerchantCategorySelect from '@/components/merchantCategorySelect'
import CommissionParam from '@/components/commissionParam'
export default {
  components: {
    MerchantSelectModal,
    MerchantCategorySelect,
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
    return {
      merchantModalVisible: false,
      showMerchant: true,
      searchForm: getDefaultSearchForm(),
      commissionParams: {},
      showComissionParamModal: false,
      loading: false
    }
  },
  watch: {
    'searchForm.merchantId': function(val, oldVal) {
      if (val) {
        this.merchantId = null
        this.merchantName = null
        this.$refs['merchantCategorySelect'].cleanOptions()
        this.$refs['merchantCategorySelect'].cleanSelected()
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
    async handleSearchReset() {
      this.merchantId = null
      this.merchantName = null
      this.searchForm = getDefaultSearchForm()
      this.$refs['merchantCategorySelect'].cleanSelected()
      await this.checkHiddenMerchant()
    },
    async init() {
      await this.checkHiddenMerchant()
    },
    async selectNode(nodes) {
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
        const vue = this
        const checkObj = {}
        checkObj.referIds = []
        checkObj.referIds.push(this.searchForm.categoryNodeId)
        checkObj.commissionType = 5
        checkObj.merchantId = this.searchForm.merchantId
        const agent = vue.$agent.$api.commission
        const result = await agent.getCommissionRule(checkObj)
        if (result) {
          const commissionObj = result.data
          const commissionParams = {}
          const commissionParamsObj = {}
          commissionParams.referIds = []
          commissionParams.isbatchSet = false
          commissionParamsObj.referId = this.searchForm.categoryNodeId
          commissionParamsObj.merchantId = this.searchForm.merchantId
          commissionParams.referIds.push(commissionParamsObj)
          commissionParams.commissionType = '5'
          commissionParams.commissionId = commissionObj.commissionId
          commissionParams.layer = commissionObj.layer
          commissionParams.dimensionRules = commissionObj.dimensionRules
          this.commissionParams = commissionParams
          // console.log(commissionObj.dimensionRules)
          this.showComissionParamModal = true
        }
      }
    },
    cleanSelected() {
      this.searchForm.categoryName = null
      this.searchForm.categoryNodeId = null
    }
  }
}
function getDefaultSearchForm() {
  return Object.assign({}, { merchantId: null })
}
</script>
<style lang="scss" scoped>
</style>
