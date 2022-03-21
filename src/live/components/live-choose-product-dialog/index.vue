<template>
  <div>
    <ody-dialog
      :visible.sync="visible"
      :title="$t('选择商品')"
      width="65%"
      @open="handleOpen"
      @close="handleClose">
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item v-if="live.type === 0" :label="$t('商家名称')" :space="1" prop="merchantId">
              <ody-merchant-choose
                v-model="filters.merchantId"
                :selected.sync="selectedMerchant"
                :placeholder="$t('请选择')"
                value-key="merchantId"
                name="live_choose_product_merchantId"/>
            </ody-search-item>
            <ody-search-item :label="$t('店铺名称')" :space="1" prop="storeId">
              <ody-store-choose
                v-model="filters.storeId"
                :selected.sync="selectedStore"
                :placeholder="$t('请选择')"
                :params="{ merchantId: filters.merchantId }"
                :disabled="live.type === 1"
                value-key="storeId"
                name="live_choose_product_storeId"/>
            </ody-search-item>
            <ody-search-item :label="$t('商品名称')" :space="1" prop="chineseName">
              <el-input v-model="filters.chineseName" name="live_choose_product_chineseName" />
            </ody-search-item>
            <ody-search-item :label="$t('商品编码')" :space="1" prop="code">
              <el-input v-model="filters.code" name="live_choose_product_code" />
            </ody-search-item>
            <ody-search-item :label="$t('商品类目')" :space="1" prop="categoryIds">
              <ody-category-tree-select v-model="filters.categoryIds" value-consists-of="LEAF_PRIORITY" name="live_choose_product_categoryIds" />
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="live_choose_product_reset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
          <ody-button
            code="ui"
            name="live_choose_product_search"
            size="small"
            type="primary"
            @click="handleSearch"
          >{{ $t('查询') }}</ody-button>
        </div>
      </ody-list-search-area>
      <div >
        <ody-button
          :disabled="!checked || checked.length <= 0"
          code="ui"
          name="live_choose_product_save"
          size="small"
          type="primary"
          @click="handleSaveProduct(0)"
        >{{ $t('保存至货架') }}</ody-button>
        <ody-button
          :disabled="!checked || checked.length <= 0"
          code="ui"
          name="live_choose_product_onshevle"
          size="small"
          @click="handleSaveProduct(1)"
        >{{ $t('直接发布') }}</ody-button>
      </div>
      <ody-table
        v-loading="loading"
        :data="list"
        :columns="columns"
        :checked.sync="checked"
        :can-filter="false"
        :multiple="true"
        height="460px"
        name="liveChooseProductTable">
        <template slot="pictureUrl" slot-scope="scope">
          <div>
            <el-image :src="scope.row.pictureUrl" :preview-src-list="[scope.row.pictureUrl]" style="width: 80px; height: 80px"/>
          </div>
        </template>
      </ody-table>
      <ody-pagination
        :current-page.sync="page.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size.sync="page.limit"
        :total.sync="total"
        :list="list"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSearch"
        @current-change="handleSearch"
      />
    </ody-dialog>
  </div>
</template>

<script>
export default {
  name: 'LiveChooseProductDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    live: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      selectedMerchant: {},
      selectedStore: {},
      filters: {
        merchantId: null,
        storeId: null,
        mpName: null,
        code: null,
        categoryIds: null
      },
      loading: false,
      list: [],
      checked: [],
      columns: [
        {
          label: this.$t('商品图片'),
          slot: 'pictureUrl',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('商品名称'),
          prop: 'chineseName',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('商品编码'),
          prop: 'code',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('商品类目'),
          prop: 'categoryName',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('商品品牌'),
          prop: 'brandName',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('店铺名称'),
          prop: 'storeName',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('商家名称'),
          prop: 'merchantName',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('售价'),
          prop: 'salePriceWithTax',
          show: true,
          align: 'center',
          minWidth: 120
        }
      ],
      page: {
        page: 1,
        limit: 10
      },
      total: 0
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleOpen() {
      this.handleReset()
      this.handleFilters()
      this.handleSearch()
    },
    handleFilters() {
      this.filters.storeCanSale = 1
      this.filters.merchantCanSale = 1
      this.filters.typeOfProductList = [0, 3]
      if (this.live) {
        this.filters.channelCode = this.live.channelCode
        if (this.live.type === 1) {
          this.filters.storeId = this.live.storeId
          this.selectedStore = {
            storeId: this.live.storeId,
            storeName: this.live.name
          }
        }
      }
    },
    handleReset() {
      this.filters = {
        merchantId: null,
        storeId: null,
        mpName: null,
        code: null,
        categoryIds: null
      }
      this.handleFilters()
    },
    handleSearch() {
      this.loading = true

      const args = { filters: this.filters, ...this.page }
      this.$live.$api.product.listStoreProductPage(args).then(
        res => {
          this.loading = false
          this.list = res.data
          this.total = res.total
        },
        () => {
          this.loading = false
        }
      )
    },
    handleSaveProduct(status) {
      const params = []
      this.checked.forEach(item => {
        params.push({
          liveId: this.live.id,
          mpId: item.id,
          mpCode: item.code,
          mpName: item.chineseName,
          pictureUrl: item.pictureUrl,
          storeId: item.storeId,
          type: item.type,
          storeName: item.storeName,
          merchantId: item.merchantId,
          merchantName: item.merchantName,
          categoryId: item.categoryId,
          categoryName: item.categoryName,
          brandId: item.brandId,
          brandName: item.brandName,
          salePriceWithTaxSnapshot: item.salePriceWithTax,
          status: status
        })
      })
      this.$live.$api.liveProduct.batchAdd(params).then(
        res => {
          this.$message.success(this.$t('保存成功'))
          this.$emit('update:visible', false)
          this.$emit('ok')
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
