<template>
  <div>
    <ody-dialog-full-right
      :visible.sync="visible"
      title="货架商品"
      @open="handleOpen"
      @close="handleClose">
      <div>
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="100px" class="form">
              <ody-search-item v-if="live.type === 0" :label="$t('商家名称')" :space="1" prop="merchantId">
                <ody-merchant-choose
                  v-model="filters.merchantId"
                  :selected.sync="selectedMerchant"
                  :placeholder="$t('全部')"
                  value-key="merchantId"
                  name="live_product_merchantId"/>
              </ody-search-item>
              <ody-search-item v-if="live.type === 0" :label="$t('店铺名称')" :space="1" prop="storeId">
                <ody-store-choose
                  v-model="filters.storeId"
                  :placeholder="$t('全部')"
                  :params="{ merchantId: filters.merchantId }"
                  value-key="storeId"
                  name="live_product_storeId"/>
              </ody-search-item>
              <ody-search-item :label="$t('商品名称')" :space="1" prop="mpName">
                <el-input v-model="filters.mpName" name="live_product_mpName" />
              </ody-search-item>
              <ody-search-item :label="$t('商品编码')" :space="1" prop="mpCode">
                <el-input v-model="filters.mpCode" name="live_product_mpCode" />
              </ody-search-item>
              <ody-search-item :label="$t('商品类目')" :space="1" prop="categoryId">
                <ody-category-tree-select v-model="filters.categoryId" value-consists-of="LEAF_PRIORITY" name="live_product_categoryId" />
              </ody-search-item>
            </el-form>
          </div>
          <div slot="btn">
            <el-button name="live_product_reset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
            <ody-button
              code="ui"
              name="live_product_search"
              size="small"
              type="primary"
              @click="handleSearch"
            >{{ $t('查询') }}</ody-button>
          </div>
        </ody-list-search-area>
        <ody-list-table-area>
          <div slot="btn">
            <ody-button
              v-if="live.auditStatus === 0 || live.auditStatus === 1 || live.auditStatus === 3"
              code="ui"
              name="live_product_chooseProduct"
              size="small"
              type="primary"
              @click="handleChooseProduct"
            >{{ $t('选择商品') }}</ody-button>
            <ody-button
              v-if="live.status <= 5"
              :disabled="offShelveDisabled"
              code="ui"
              name="live_product_offShelve"
              size="small"
              type="primary"
              @click="handleOffShelve"
            >{{ $t('批量直播室下架') }}</ody-button>
            <ody-button
              v-if="live.status <= 5"
              :disabled="onShelveDisabled"
              code="ui"
              name="live_product_onShelve"
              size="small"
              type="primary"
              @click="handleOnShelve"
            >{{ $t('上架至直播室') }}</ody-button>
          </div>
          <div slot="tabs">
            <el-tabs v-model="activeState" name="activeState" @tab-click="handleSearch">
              <el-tab-pane v-for="tab in tabs" :label="$t(tab.heading)" :key="tab.index" />
            </el-tabs>
          </div>
          <div slot="table">
            <ody-table
              v-loading="loading"
              :data="list"
              :columns="columns"
              :operates="operates"
              :checked.sync="checked"
              :can-filter="false"
              :multiple="true"
              height="360px"
              name="liveProductTable"
              @selection-change="handleSelectionChange">
              <template slot="pictureUrl" slot-scope="scope">
                <div>
                  <el-image :src="scope.row.pictureUrl" :preview-src-list="[scope.row.pictureUrl]" style="width: 120px; height: 120px"/>
                </div>
              </template>
            </ody-table>
          </div>
          <div slot="page">
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
          </div>
        </ody-list-table-area>
      </div>
    </ody-dialog-full-right>
    <live-choose-product-dialog :visible.sync="productChooseDialogVisible" :live.sync="live" @ok="handleSearch"/>
  </div>
</template>

<script>
import LiveChooseProductDialog from '@/components/live-choose-product-dialog'
export default {
  name: 'LiveProductDialog',
  components: { LiveChooseProductDialog },
  props: {
    // visible: {
    //   type: Boolean,
    //   default: flase
    // },
    live: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      visible: false,
      productChooseDialogVisible: false,
      offShelveDisabled: true,
      onShelveDisabled: true,
      selectedProductIds: [],
      selectedProducts: [],
      productParams: {},
      loading: false,
      page: {
        page: 1,
        limit: 10
      },
      total: 0,
      selectedMerchant: {},
      filters: {
        merchantId: null,
        storeId: null,
        mpName: null,
        mpCode: null,
        categoryId: null
      },
      activeState: '0',
      tabs: [
        {
          heading: '全部',
          index: 0,
          statusList: [0, 1, 2]
        },
        {
          heading: '已发布',
          index: 1,
          statusList: [1]
        },
        {
          heading: '未发布',
          index: 2,
          statusList: [0]
        },
        {
          heading: '已直播室下架',
          index: 3,
          statusList: [2]
        }
      ],
      list: [],
      checked: [],
      selected: {},
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
          prop: 'mpName',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('商品编码'),
          prop: 'mpCode',
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
          label: this.$t('商家名称'),
          prop: 'merchantName',
          show: (index, row) => {
            return this.live.type === 0
          },
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
          label: this.$t('库存数量'),
          prop: 'stockNum',
          show: (index, row) => {
            return this.activeState === '0'
          },
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('售价'),
          prop: 'salePriceWithTaxSnapshot',
          show: true,
          align: 'center',
          minWidth: 120
        },
        {
          label: this.$t('状态'),
          prop: 'statusStr',
          show: true,
          align: 'center',
          minWidth: 120
        }
      ],
      operates: {
        fixed: 'right',
        width: 120,
        align: 'center',
        list: [
          {
            label: this.$t('加至货架'),
            code: 'ui',
            hidden: (index, row) => {
              if (this.live.status >= 6) {
                return true
              } else {
                if (row.status === 2) {
                  return false
                }
                return true
              }
            },
            method: (index, row) => {
              this.handleAddShelve(row)
            }
          },
          {
            label: this.$t('上架至直播室'),
            code: 'ui',
            hidden: (index, row) => {
              if (this.live.status >= 6) {
                return true
              } else {
                if (row.status === 1) {
                  return true
                }
                return false
              }
            },
            method: (index, row) => {
              this.handleOnShelveItem(row)
            }
          },
          {
            label: this.$t('下架'),
            code: 'ui',
            hidden: (index, row) => {
              if (this.live.status >= 6) {
                return true
              } else {
                if (row.status === 1) {
                  return false
                }
                return true
              }
            },
            method: (index, row) => {
              this.handleOffShelveItem(row)
            }
          }
        ]
      }
    }
  },
  methods: {
    handleSearch() {
      this.loading = true
      this.checked = []

      this.handleFilters()
      const args = { filters: this.filters, ...this.page }
      this.$live.$api.liveProduct.listPage(args).then(
        res => {
          this.loading = false
          if (res && res.data && res.data.length > 0) {
            res.data.forEach(item => {
              item.stockNum = 0
            })
          }
          this.list = res.data
          this.total = res.total
          this.getStockNum()
        },
        () => {
          this.loading = false
        }
      )
    },
    async getStockNum() {
      if (this.activeState === '0' && this.list && this.list.length > 0) {
        const ids = []
        this.list.forEach(item => {
          ids.push(item.mpId)
        })

        this.$live.$api.product.listVirtualStockNum({ mpIdList: ids }).then(res => {
          if (res && res.data && res.data.length > 0) {
            this.list.forEach(item => {
              for (let i = 0; i < res.data.length; i++) {
                const stock = res.data[i]
                if (item.mpId === stock.itemId) {
                  item.stockNum = stock.virtualStockNum
                  break
                }
              }
            })
          }
        })
      }
    },
    handleReset() {
      this.filters = {
        merchantId: null,
        storeId: null,
        mpName: null,
        mpCode: null,
        categoryId: null
      }
    },
    handleClose() {
      // this.$emit('update:visible', !this.visible)
      this.visible = false
    },
    handleOpen() {
      this.handleReset()
      this.handleSearch()
    },
    handleFilters() {
      const tab = this.tabs[this.activeState]
      if (tab) {
        this.filters.status = tab.statusList
      }
      this.filters.liveId = this.live.id
    },
    handleOffShelve() {
      const params = {
        status: 2,
        ids: []
      }
      this.checked.forEach(item => {
        params.ids.push(item.id)
      })
      this.$live.$api.liveProduct.batchOnOffShelve(params).then(res => {
        this.$message.success(this.$t('下架成功'))
        this.handleSearch()
      })
    },
    handleOffShelveItem(item) {
      const params = {
        status: 2,
        ids: [item.id]
      }
      this.$live.$api.liveProduct.batchOnOffShelve(params).then(res => {
        this.$message.success(this.$t('下架成功'))
        this.handleSearch()
      })
    },
    handleOnShelve() {
      const params = {
        status: 1,
        ids: []
      }
      this.checked.forEach(item => {
        params.ids.push(item.id)
      })
      this.$live.$api.liveProduct.batchOnOffShelve(params).then(res => {
        this.$message.success(this.$t('发布成功'))
        this.handleSearch()
      })
    },
    handleOnShelveItem(item) {
      const params = {
        status: 1,
        ids: [item.id]
      }
      this.$live.$api.liveProduct.batchOnOffShelve(params).then(res => {
        this.$message.success(this.$t('发布成功'))
        this.handleSearch()
      })
    },
    handleAddShelve(row) {
      this.$live.$api.liveProduct.update({ id: row.id, status: 0 }).then(res => {
        this.$message.success(this.$t('添加成功'))
        this.handleSearch()
      })
    },
    handleChooseProduct() {
      this.productChooseDialogVisible = true
    },
    handleSelectionChange(value) {
      this.offShelveDisabled = true
      this.onShelveDisabled = true
      if (value && value.length > 0) {
        let hasOffShelve = false
        let hasOnShelve = false
        value.forEach(item => {
          if (item.status !== 1) {
            hasOffShelve = true
          }
          if (item.status === 1) {
            hasOnShelve = true
          }
        })
        this.offShelveDisabled = hasOffShelve
        this.onShelveDisabled = hasOnShelve
      }
    }
  }
}
</script>

<style scoped>

</style>
