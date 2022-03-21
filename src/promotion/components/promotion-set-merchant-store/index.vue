<template>
  <div class="bg-promotion-set-merchant-store">
    <el-tabs v-model="activeName" name="activeName">
      <el-tab-pane :label="$t('商家')" name="merchant">
        <div class="activity-merchant">
          <div>
            <ody-merchant-choose
              v-if="promotionDetailData.channelCodes"
              v-model="merchantSelected"
              :selected.sync="merchantSelectedItem"
              :multiple="true"
              :params="{ channelCodes: promotionDetailData.channelCodes }"
              name="merchantSelected"
              value-key="merchantId"
              class="add-button"
              @ok="handleMerchantChoose"
            >
              <el-button type="primary" size="small">{{ $t('添加商家') }}</el-button>
            </ody-merchant-choose>
            <el-button
              name="deleteMerchantListUrl"
              size="small"
              class="batch-delete"
              @click="deleteMerchantListUrl(merchantTable.checked, 1)"
            >{{ $t('批量删除') }}</el-button>
          </div>

          <div class="search-wrap">
            <el-button
              name="searchMerchantShow"
              size="small"
              class="batch-delete"
              @click="searchMerchantShow = !searchMerchantShow"
            >{{ $t('搜索') }}</el-button>
          </div>
        </div>

        <ody-list-search-area v-if="searchMerchantShow">
          <div slot="content">
            <el-form ref="merchantSearch" :model="merchantSearch" label-width="100px" class="form">
              <ody-search-item :label="$t('商家编码')" prop="merchantCode" name="merchantCode">
                <el-input v-model="merchantSearch.merchantCode" name="merchantSearch_merchantCode" />
              </ody-search-item>
              <ody-search-item :label="$t('商家名称')" prop="merchantName" name="merchantName">
                <el-input v-model="merchantSearch.merchantName" name="merchantSearch_merchantName" />
              </ody-search-item>
            </el-form>
          </div>
          <div slot="btn">
            <el-button
              name="handleMerchantReset"
              size="small"
              @click="handleMerchantReset"
            >{{ $t('重置') }}</el-button>
            <el-button
              size="small"
              type="primary"
              @click.prevent="handleMerchantSubmit(1)"
            >{{ $t('查询') }}</el-button>
          </div>
        </ody-list-search-area>

        <ody-table
          ref="merchantTable"
          :data="merchantTable.data"
          :checked.sync="merchantTable.checked"
          :multiple="true"
          :can-filter="false"
          :columns="merchantTable.columns"
          :operates="merchantTable.operates"
          name="merchantTable_data136"
        />
        <ody-pagination
          :current-page.sync="merchantTable.page.currentPage"
          :list="merchantTable.data"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="merchantTable.page.itemsPerPage"
          :total.sync="merchantTable.page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange(1)"
          @current-change="handleCurrentChange(1)"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('店铺')" name="store">
        <div class="activity-merchant">
          <div>
            <ody-store-choose
              v-if="promotionDetailData.channelCodes"
              v-model="storeSelected"
              :selected.sync="storeSelectedItem"
              :multiple="true"
              :params="{ channelCodes: promotionDetailData.channelCodes }"
              :search-field="['merchantId', 'storeCode', 'storeName']"
              name="storeSelected"
              value-key="storeId"
              class="add-button"
              @ok="handleStoreChoose"
            >
              <el-button type="primary" size="small">{{ $t('添加店铺') }}</el-button>
            </ody-store-choose>
            <el-button
              name="deleteMerchantListUrl4"
              size="small"
              class="batch-delete"
              @click="deleteMerchantListUrl(storeTable.checked, 2)"
            >{{ $t('批量删除') }}</el-button>
          </div>

          <div class="search-wrap">
            <el-button
              name="searchStoreShow"
              size="small"
              class="batch-delete"
              @click="searchStoreShow = !searchStoreShow"
            >{{ $t('搜索') }}</el-button>
          </div>
        </div>

        <ody-list-search-area v-show="searchStoreShow">
          <div slot="content">
            <el-form ref="storeSearch" :model="storeSearch" label-width="100px" class="form">
              <ody-search-item :label="$t('店铺编码')" prop="storeCode" nmae="storeCode">
                <el-input v-model="storeSearch.storeCode" name="storeSearch_storeCode" />
              </ody-search-item>
              <ody-search-item :label="$t('店铺名称')" prop="storeName" name="storeName">
                <el-input v-model="storeSearch.storeName" name="storeSearch_storeName" />
              </ody-search-item>
            </el-form>
          </div>
          <div slot="btn">
            <el-button name="handleStoreReset" size="small" @click="handleStoreReset">{{ $t('重置') }}</el-button>
            <el-button
              size="small"
              type="primary"
              @click.prevent="handleMerchantSubmit(2)"
            >{{ $t('查询') }}</el-button>
          </div>
        </ody-list-search-area>

        <ody-table
          ref="storeTable"
          :data="storeTable.data"
          :checked.sync="storeTable.checked"
          :multiple="true"
          :can-filter="false"
          :columns="storeTable.columns"
          :operates="storeTable.operates"
          name="storeTable_data655"
        />
        <ody-pagination
          :current-page.sync="storeTable.page.currentPage"
          :list="storeTable.data"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="storeTable.page.itemsPerPage"
          :total.sync="storeTable.page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange(2)"
          @current-change="handleCurrentChange(2)"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    value: {
      type: String,
      default: ''
    },
    selected: {
      type: Object,
      default: () => {}
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    labelKey: {
      type: String,
      default: 'text'
    },
    itemDisabled: {
      type: Function,
      default: (x, index) => {
        return false
      }
    },
    promType: {
      type: String,
      default: ''
    },
    promotionId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeName: 'merchant',
      promotionAPI: null,
      promotionDetailData: {},

      allAuthMerchant: [],
      searchMerchantShow: false,
      merchantSearch: {
        merchantCode: undefined,
        merchantName: undefined
      },
      merchantSelected: [],
      merchantSelectedItem: [],
      merchantTable: {
        data: [],
        columns: [
          {
            label: this.$t('商家编码'),
            prop: 'merchantCode',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('商家名称'),
            prop: 'merchantName',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('商家类型'),
            prop: 'merchantTypeName',
            minWidth: 120, show: true
          }
        ],
        operates: {
          width: 150,
          fixed: 'right',
          list: [
            {
              label: this.$t('删除'),
              method: (index, row) => {
                this.deleteMerchantListUrl([row], 1)
              },
              code: 'ui'
            }
          ]
        },
        checked: [],
        page: {
          currentPage: 1,
          itemsPerPage: 10,
          total: 0
        }
      },

      allAuthStore: [],
      searchStoreShow: false,
      storeSearch: {
        storeCode: '',
        storeName: ''
      },
      storeSelected: [],
      storeSelectedItem: [],
      storeTable: {
        data: [],
        columns: [
          {
            label: this.$t('店铺编码'),
            prop: 'storeCode',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('店铺名称'),
            prop: 'storeName',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('店铺类型'),
            prop: 'storeTypeName',
            minWidth: 120, show: true
          }
        ],
        operates: {
          width: 150,
          fixed: 'right',
          list: [
            {
              label: this.$t('删除'),
              method: (index, row) => {
                this.deleteMerchantListUrl([row], 2)
              },
              code: 'ui'
            }
          ]
        },
        checked: [],
        page: {
          currentPage: 1,
          itemsPerPage: 10,
          total: 0
        }
      }
    }
  },
  watch: {},
  async created() {
    this.promotionAPI = this.$promotion.$api.promotion
    await this.queryPromotionActivityDetail()
    await this.handleMerchantSubmit(1)
    await this.handleMerchantSubmit(2)
  },
  mounted() {
    // this.query()
    console.log('promotionId', this.promotionId)
  },
  methods: {
    handleStoreChoose(val) {
      if (val.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择需要添加的店铺！')
        })
        return
      }

      const merchantAddList = val.map(function(x) {
        return {
          id: x.storeId
        }
      })

      this.addMerchantList(merchantAddList, 2)
    },
    handleMerchantChoose(val) {
      if (val.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择需要添加的商家！')
        })
        return
      }

      const merchantAddList = val.map(function(x) {
        return {
          id: x.merchantId
        }
      })
      this.addMerchantList(merchantAddList, 1)
    },
    handleMerchantReset() {
      this.formReset('merchantSearch')
    },
    handleStoreReset() {
      this.formReset('storeSearch')
    },
    async handleMerchantSubmit(merchantType) {
      if (merchantType === 1) {
        await this.queryAuthMerchantPageUrl()
        if (this.allAuthMerchant.length > 0) {
          this.merchantTable.data = await this.querySelectedMerchantUrl(
            merchantType
          )
        } else {
          this.merchantTable.data = []
          this.merchantTable.page.total = 0
        }
      } else {
        await this.queryAuthStorePageUrl()
        if (this.allAuthStore.length > 0) {
          this.storeTable.data = await this.querySelectedMerchantUrl(
            merchantType
          )
        } else {
          this.storeTable.data = []
          this.storeTable.page.total = 0
        }
      }
    },
    async handleSizeChange(merchantType) {
      if (merchantType === 1) {
        this.merchantTable.page.currentPage = 1
      } else {
        this.storeTable.page.currentPage = 1
      }
      await this.handleMerchantSubmit(merchantType)
    },
    async handleCurrentChange(merchantType) {
      await this.handleMerchantSubmit(merchantType)
    },
    async deleteMerchantListUrl(row, merchantType) {
      if (row.length === 0 && merchantType === 1) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择需要删除的商家')
        })
        return
      } else if (row.length === 0 && merchantType === 2) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择需要删除的店铺')
        })
        return
      }

      const res = await this.$confirm(this.$t('确定删除吗?'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })

      if (!res) {
        return
      }

      const merchantAddList = row.map(x => {
        if (merchantType === 1) {
          return {
            id: x.merchantId
          }
        } else {
          return {
            id: x.storeId
          }
        }
      })

      const { code } = await this.promotionAPI.deleteMerchantListUrl({
        promotionId: this.promotionId,
        merchantAddList: merchantAddList
      })

      if (code === '0') {
        await this.handleMerchantSubmit(merchantType)
      }
      this.merchantTable.checked = []
      this.storeTable.checked = []
    },
    async querySelectedMerchantUrl(merchantType) {
      let addIdList = []
      let currentPage = 1
      let itemsPerPage = 10

      if (merchantType === 1) {
        addIdList = this.allAuthMerchant.map(x => {
          return x.merchantId
        })
        currentPage = this.merchantTable.page.currentPage
        itemsPerPage = this.merchantTable.page.itemsPerPage
      } else {
        addIdList = this.allAuthStore.map(x => {
          return x.storeId
        })
        currentPage = this.storeTable.page.currentPage
        itemsPerPage = this.storeTable.page.itemsPerPage
      }

      const {
        data: { listObj = [], total = 0 } = {}
      } = await this.promotionAPI.querySelectedMerchantUrl({
        currentPage: currentPage,
        itemsPerPage: itemsPerPage,
        merchantType: merchantType,
        promotionId: this.promotionId,
        merchantIdList: addIdList
      })

      if (merchantType === 1) {
        this.merchantTable.page.total = total
        const merchantIdList = listObj.map(x => {
          return x.merchantId
        })

        return (
          this.allAuthMerchant.filter(x => {
            return merchantIdList.includes(x.merchantId)
          }) || []
        )
      } else {
        this.storeTable.page.total = total
        const storeIdList = listObj.map(x => {
          return x.merchantId
        })

        return (
          this.allAuthStore.filter(x => {
            return storeIdList.includes(x.storeId)
          }) || []
        )
      }
    },
    async queryAuthStorePageUrl() {
      let params = {
        currentPage: 1,
        itemsPerPage: 30000,
        channelCodes: this.promotionDetailData.channelCodes
      }

      params = Object.assign({}, params, this.storeSearch)

      const {
        data: { listObj = [] } = {}
      } = await this.promotionAPI.queryAuthStorePageUrl(params)

      this.allAuthStore = listObj || []
    },
    async queryAuthMerchantPageUrl() {
      let params = {
        currentPage: 1,
        itemsPerPage: 30000,
        channelCodes: this.promotionDetailData.channelCodes
      }

      params = Object.assign({}, params, this.merchantSearch)

      const {
        data: { listObj = [] } = {}
      } = await this.promotionAPI.queryAuthMerchantPageUrl(params)

      this.allAuthMerchant = listObj || []
    },
    async queryPromotionActivityDetail() {
      const params = {
        id: this.promotionId
      }

      const { data = {}, code } =
        this.promType === 6000
          ? await this.promotionAPI.queryCouponDetailById(params)
          : await this.promotionAPI.getPromotionDetailUrl(params)

      if (code === '0') {
        this.promotionDetailData = data
      }
    },
    async addMerchantList(merchantAddList, merchantType) {
      const params = {
        merchantAddList: merchantAddList,
        merchantType: merchantType,
        promotionId: this.promotionId
      }
      await this.promotionAPI.addMerchantListUrl(params)
      this.merchantSelected = []
      this.storeSelected = []
      if (merchantType === 1) {
        await this.queryAuthMerchantPageUrl()
        await this.handleMerchantSubmit(merchantType)
      } else if (merchantType === 2) {
        await this.queryAuthStorePageUrl()
        await this.handleMerchantSubmit(merchantType)
      }
    },
    query() {
      const {
        createTime: [createTimeBegin, createTimeEnd],
        ...params
      } = this.search

      params.createTimeBegin = createTimeBegin
      params.createTimeEnd = createTimeEnd

      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    }
  }
}
</script>

<style lang="scss" scoped>
.bg-promotion-set-merchant-store {
  padding: 20px 10px 10px 10px;

  .add-button {
    display: inline-block;
  }

  .activity-merchant {
    margin-bottom: 20px;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;

    .search-wrap {
      display: flex;

      .batch-delete {
        margin-left: 10px;
      }

      /deep/ .el-input-group__prepend {
        width: 120px;
        background-color: #fff;
      }

      /deep/ .el-input-group__append {
        padding: 0;
        background-color: #fff;

        /deep/ .el-button--default:hover,
        .el-button--default:focus {
          background: transparent !important;
          border-color: transparent !important;
          box-shadow: none !important;
        }
      }
    }
  }
}
</style>
