<template>
  <div>
    <ody-list-search-area>
      <div slot="content" class="link-product">
        <el-form ref="search" :model="search" label-width="80px" class="form">
          <ody-search-item v-if="dataType === 2" :label="$t('商家名称')" style="width:50%" prop="merchantId" label-width="80px">
            <el-select
              v-model="search.merchantId"
              :popper-append-to-body="false"
              :placeholder="$t('请选择')"
              name="search_merchantId"
              clearable>
              <el-option
                v-for="item in merchantList"
                :key="item.merchantId"
                :label="item.merchantName"
                :value="item.merchantId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item v-if="dataType === 3" :label="$t('店铺名称')" style="width:50%" prop="storeId">
            <el-select v-model="search.storeId" :placeholder="$t('请选择')" name="search_storeId" clearable>
              <el-option
                v-for="item in storeList"
                :key="item.storeId"
                :label="item.storeName"
                :value="item.storeId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('商品名称')" style="width:50%" prop="title">
            <el-input v-model="search.title" name="search_title" />
          </ody-search-item>
          <ody-search-item :label="$t('商品编码')" style="width:50%" prop="code">
            <el-input v-model="search.code" name="search_code" />
          </ody-search-item>
          <ody-search-item :label="$t('商品品牌')" style="width:50%" prop="brandName">
            <el-input
              v-model="search.brandName"
              :placeholder="$t('common_choose_please')"
              name="search_brandName"
              readonly="true"
              @click.native="openBrandModal"
            />
          </ody-search-item>
          <ody-search-item :label="$t('商品类目')" :space="2" style="width:100%" prop="categoryIds">
            <ody-tree-select
              :normalizer="normalizer"
              :append-to-body="true"
              :z-index="10000"
              v-model="search.categoryIds"
              :multiple="true"
              :options="categoryTreeData"
              name="search_categoryIds"
              value-consists-of="LEAF_PRIORITY"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <el-button size="small" type="primary" @click.prevent="handleSubmit">{{ $t('查询') }}</el-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div v-if="isEdit" slot="btn">
        <ody-product-merchant-choose
          v-if="dataType === 2"
          v-model="merchant.ids"
          :multiple="true"
          :disabled-id-list="currentProductIdList"
          :placeholder="$t('请选择')"
          name="merchant_ids"
          class="my-choose-btn"
          value-key="id"
          @ok="saveLinkedGoods"
        />
        <ody-product-store-choose
          v-if="dataType === 3"
          v-model="merchant.ids"
          :multiple="true"
          :disabled-id-list="currentProductIdList"
          :placeholder="$t('请选择')"
          name="merchant_ids2"
          class="my-choose-btn"
          value-key="id"
          @ok="saveLinkedGoods"
        />
        <el-button name="delMultilProduct" size="small" @click="delMultilProduct()">{{ $t('批量删除') }}</el-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :checked.sync="checked"
          :multiple="true"
          :columns="table.columns"
          :data="list"
          :operates="table.operates"
          :can-filter="false"
          name="list569"
          request-url="/back-product-web/back/mp/category/listQueryAggregationMerchantProduct.do"
        >
          <template
            slot="merchantName"
            slot-scope="scope"
          >{{ scope.row.merchantId | keyVal(getMerchantName) }}</template>
          <template
            slot="storeName"
            slot-scope="scope"
          >{{ scope.row.storeId | keyVal(getStoreName) }}</template>
          <template
            slot="categoryType"
            slot-scope="scope"
          >{{ scope.row.categoryType | keyVal(getCategoryOptions) }}</template>
        </ody-table>
      </div>
    </ody-list-table-area>
    <!-- 品牌模态框组件 --->
    <brand-modal-component :visible.sync="brandVisible" @ok="closeBrandModal" />
  </div>
</template>
<script>
import brandModalComponent from '@/components/brandModal'
export default {
  components: {
    brandModalComponent
  },
  props: {
    dataType: {
      type: Number,
      default: 2
    },
    categoryId: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      service: this.$product.$api.mpApi,
      checked: [],
      merchantList: [],
      merchantMap: {},
      storeList: [],
      categoryTreeData: [],
      brandList: [],
      search: this.defaultParams(),
      currentProductIdList: [],
      brandVisible: false,
      table: {
        columns: [
          {
            label: this.$t('商家名称'),
            slot: 'merchantName',
            show: true
          },
          {
            label: this.$t('店铺'),
            slot: 'storeName',
            show: this.dataType === 3
          },
          {
            label: this.$t('商品名称'),
            prop: 'chineseName',
            show: true
          },
          {
            label: this.$t('商品编码'),
            prop: 'code',
            show: true
          },
          {
            label: this.$t('商品类目'),
            prop: 'categoryName',
            show: true
          },
          {
            label: this.$t('商品品牌'),
            prop: 'brandName',
            show: true
          }
        ]
      },
      merchant: {
        id: [],
        selected: []
      }
    }
  },
  computed: {
    getMerchantName() {
      return this.merchantList.reduce((rtv, item) => {
        rtv[item.merchantId] = item.merchantName
        return rtv
      }, {})
    },
    getStoreName() {
      return this.storeList.reduce((rtv, item) => {
        rtv[item.storeId] = item.storeName
        return rtv
      }, {})
    }
  },
  mounted() {
    this.getListBackCategoryTree()
    this.getMerchantList()
    this.getStoreList()
    this.queryPlatformAuthStorePage()
    this.query()
  },
  methods: {
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    delMultilProduct() {
      var treeProducts = []
      this.checked.map(item => {
        treeProducts.push(item.id)
      })
      this.service
        .batchDelAggregationProduct({
          categoryTreeNodeProductIds: treeProducts
        })
        .then(res => {
          this.query()
        })
    },
    async handleSubmit() {
      this.query()
    },
    async query(obj = {}) {
      this.checked = []
      this.search.categoryTreeNodeRelationId = this.categoryId
      return this.$refs.table.getList(this.formHasValue(this.search))
    },
    handleReset() {
      this.search = this.defaultParams()
    },
    defaultParams() {
      return {
        merchantId: '',
        storeId: '',
        title: '',
        code: '',
        categoryIds: [],
        brandId: '',
        brandName: ''
      }
    },
    getMerchantList() {
      this.$product.$api.merchantApi
        .queryPlatformAuthMerchantPage({
          currentPage: 1,
          itemsPerPage: 500
        })
        .then(res => {
          this.merchantList = res.data.listObj
          this.merchantList.map(item => {
            this.merchantMap[item.merchantId] = item
          })
        })
    },
    getStoreList() {
      this.$product.$api.merchantApi
        .queryPlatformAuthStorePage({
          currentPage: 1,
          itemsPerPage: 500
        })
        .then(res => {
          this.storeList = res.data.listObj
          this.storeList.map(item => {
            this.storeMap[item.storeId] = item
          })
        })
    },
    // 打开品牌模态框
    openBrandModal() {
      this.brandVisible = !this.brandVisible
      console.log(this.brandVisible)
    },
    // 关闭品牌模态框
    closeBrandModal(selectVal) {
      // 返回模态框返回的对象
      this.search.brandId = selectVal.id
      this.search.brandName = selectVal.name
    },
    getListBackCategoryTree() {
      this.service.listBackCategoryTree({}).then(res => {
        this.categoryTreeData = [res.data]
      })
    },
    queryPlatformAuthStorePage() {
      this.$product.$api.merchantApi
        .queryPlatformAuthStorePage({
          currentPage: 1,
          itemsPerPage: 500
        })
        .then(res => {
          this.storeList = res.data.listObj
        })
    },
    saveLinkedGoods() {
      var treeProducts = []
      this.merchant.ids.map(item => {
        treeProducts.push({
          dataType: this.dataType,
          categoryTreeNodeRelationId: this.categoryId,
          merchantProductId: item
        })
      })
      this.service.saveAggreationMp(treeProducts).then(res => {
        this.merchant.ids = []
        this.query()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.my-choose-btn {
  display: inline-block;
}
/deep/ .cp-search-item {
  overflow: unset !important
}
/deep/ .cp-list-search-area .box{
  overflow: unset;
}
/deep/ .cp-list-search-area .inner{
  overflow: unset;
}
/deep/ .el-select-dropdown {
  max-height: 300px;
}
/deep/ .el-scrollbar__view{
  max-height: 300px;
}
.link-product{
  /deep/ .el-form-item__content{
      margin-left: 80px !important;
  }
}
</style>
