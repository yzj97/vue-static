<!-- 对账单 -->
<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('common_choose_please')"
      width="60%"
      @open="init"
    >
      <section>
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="50px" class="form">
              <ody-search-item v-show="showMerchant" :label="$t('common_merchant_name')" prop="merchantName">
                <el-input
                  v-model="searchForm.merchantName"
                  name="searchForm_merchantName"
                  maxlength="25"
                  readonly="readonly"
                  @focus="showMerchantModal"
                />
              </ody-search-item>
              <ody-search-item :label="$t('invoice_customer_type')" prop="customerType">
                <el-select v-model="searchForm.customerType" :clearable="false" name="searchForm_customerType">
                  <el-option v-for="(v, k) in customerTypeMap" :label="v" :key="k" :value="k" />
                </el-select>
              </ody-search-item>
              <ody-search-item :label="$t('invoice_customer_name')" prop="customerName">
                <el-input v-model="searchForm.customerName" name="searchForm_customerName" />
              </ody-search-item>
              <ody-search-item :label="$t('common_store_name')" prop="storeId">
                <ody-store-select
                  v-model="searchForm.storeId"
                  :placeholder="$t('全部')"
                  name="searchForm_storeId"
                  value-key="storeId"
                />
              </ody-search-item>
              <ody-search-item :label="$t('chk_order_code')" prop="chkOrderCode">
                <el-input v-model="searchForm.chkOrderCode" name="searchForm_chkOrderCode" />
              </ody-search-item>
              <ody-search-item :space="2" :label="$t('invoice_order_create_time')" class="register" prop="orderCreateTime">
                <el-date-picker
                  v-model="searchForm.orderCreateTime"
                  name="searchForm_orderCreateTime"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="-"
                />
              </ody-search-item>
            </el-form>
          </div>
          <div slot="btn">
            <el-button
              name="handleSearchSubmit"
              size="small"
              type="primary"
              @click="handleSearchSubmit"
            >{{ $t('common_search') }}</el-button>
            <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
          </div>
        </ody-list-search-area>
        <ody-list-table-area>
          <div slot="table">
            <el-table :data="list" name="list253" highlight-current-row @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" />
              <el-table-column
                :label="$t('common_merchant_name')"
                align="center"
                prop="merchantName"
              />
              <el-table-column :label="$t('common_store_name')" align="center" prop="storeName" />
              <el-table-column :label="$t('invoice_customer_type')" align="center">
                <template slot-scope="scope">
                  <span>{{ customerTypeMap[scope.row.customerType] }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('invoice_customer_code')"
                align="center"
                prop="customerCode"
              />
              <el-table-column
                :label="$t('invoice_customer_name')"
                align="center"
                prop="customerName"
              />
              <el-table-column :label="$t('chk_order_code')" align="center" prop="chkOrderCode" />
              <el-table-column :label="$t('invoice_order_create_time')" align="center">
                <template slot-scope="scope">
                  <span>{{ $portal.parseTime(scope.row.orderCreateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div slot="page">
            <div class="block">
              <ody-pagination
                :current-page.sync="page.current"
                :page-sizes="[10, 20, 30, 50]"
                :page-size.sync="page.size"
                :total.sync="page.total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handlePageSizeChange"
                @current-change="handlePageCurrentChange"
              />
            </div>
          </div>
        </ody-list-table-area>
      </section>
      <span slot="footer" class="dialog-footer">
        <ody-button name="handleConfirm" code="SaleInvoiceAdd" size="small" type="primary" @click="handleConfirm">{{ $t('common_confirm') }}</ody-button>
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_cancel') }}</el-button>
      </span>
    </ody-dialog>
    <MerchantSelectModal :visible.sync="merchantModalVisible" @ok="selectMerchant" />
    <StoreSelectModal
      :visible.sync="storeModalVisible"
      :merchant-id.sync="merchantInfo.merchantId"
      :merchant-code.sync="merchantInfo.merchantCode"
      need-merchant="false"
      multi-select="false"
      @ok="selectStore"
    />
  </div>
</template>

<script>
import MerchantSelectModal from '@/components/merchantModal'
import StoreSelectModal from '@/components/storeModal'
export default {
  components: {
    MerchantSelectModal,
    StoreSelectModal
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    chkOrderType: {
      type: Number,
      default: null
    },
    chkStatus: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      searchForm: getDefaultSearchForm(),
      loading: false,
      storeModalVisible: false,
      platform: null,
      showMerchant: false,
      merchantModalVisible: false,
      merchantInfo: {
        merchantId: null,
        merchantCode: null
      },
      customerTypeMap: {},
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      multipleSelection: []
    }
  },
  methods: {
    async initMerchantInfo() {
      const vue = this
      const result = await this.$finance.$api.common.queryPlatformAndDefaultMerchant()
      if (result.code === '0') {
        vue.platform = result.data.platformId
        if (vue.platform === 1) {
          if (result.data.defaultMerchant) {
            vue.merchantInfo.merchantId = result.data.defaultMerchant.merchantId
            vue.merchantInfo.merchantCode =
              result.data.defaultMerchant.merchantCode
            vue.searchForm.merchantId = result.data.defaultMerchant.merchantId
          } else {
            this.$alert(
              this.$t('default_merchant_has_no_auth'),
              this.$t('prompt')
            )
            return
          }
        } else {
          vue.showMerchant = true
        }
      }
    },
    showMerchantModal() {
      this.merchantModalVisible = true
    },
    showStoreModal() {
      this.storeModalVisible = true
    },
    selectMerchant(merchant) {
      if (merchant) {
        console.info(merchant)
        this.merchantInfo.merchantId = merchant.merchantId
        this.merchantInfo.merchantCode = merchant.merchantCode
        this.searchForm.merchantName = merchant.merchantName
        this.searchForm.merchantId = merchant.merchantId
        this.clearStoreInfo()
      }
    },
    selectStore(stores) {
      let store
      if (Array.isArray(stores)) {
        store = stores[0]
      } else {
        store = stores
      }
      if (store) {
        this.searchForm.storeId = store.storeId
        this.searchForm.storeCode = store.storeCode
        this.searchForm.storeName = store.storeName
      }
    },
    clearStoreInfo() {
      this.searchForm.storeId = null
      this.searchForm.storeCode = null
      this.searchForm.storeName = null
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
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
      this.initMerchantInfo()
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
    _initCodes() {
      const vue = this
      this.$finance.$api.common
        .codeSelectMulti({ categories: ['CUSTOMER_TYPE'] })
        .then(data => {
          if (data.code === '0') {
            var map = data.data
            if (map.CUSTOMER_TYPE) {
              vue.customerTypeMap = {}
              for (const p in map.CUSTOMER_TYPE) {
                if (p + '' === '4') {
                  vue.customerTypeMap[p] = map.CUSTOMER_TYPE[p]
                }
              }
            }
          }
        })
    },
    async init() {
      await this._initCodes()
      await this.initMerchantInfo()
      this.handleSearchSubmit()
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    handleSelectionChange(val) {
      if (Array.isArray(val)) {
        this.multipleSelection = val
      } else if (val) {
        this.multipleSelection = [val]
      }
    },
    handleConfirm() {
      if (!this.multipleSelection || this.multipleSelection.length > 0) {
        let uniqueKey
        for (let i = 0; i < this.multipleSelection.length; i++) {
          const item = this.multipleSelection[i]
          const key =
            item.merchantCode +
            '_' +
            item.storeCode +
            '_' +
            item.customerType +
            '_' +
            item.customerCode
          if (!uniqueKey) {
            uniqueKey = key
          } else if (key !== uniqueKey) {
            this.$alert(
              this.$t('invalid_not_same_chk_customer'),
              this.$t('prompt')
            )
            return
          }
        }
        this.$emit('update:visible', !this.visible)
        this.$emit('ok', this.multipleSelection)
      } else {
        this.$alert(this.$t('invalid_empty_chk'), this.$t('prompt'))
      }
    }
  }
}
async function loadList(vue) {
  const searchForm = JSON.parse(JSON.stringify(vue.searchForm))
  if (searchForm.orderCreateTime) {
    searchForm.orderCreateTimeStart = searchForm.orderCreateTime[0]
    searchForm.orderCreateTimeEnd = searchForm.orderCreateTime[1]
    delete searchForm.orderCreateTime
  }
  searchForm.chkOrderType = vue.chkOrderType
  searchForm.chkStatus = vue.chkStatus
  const param = {
    itemsPerPage: vue.page.size,
    currentPage: vue.page.current,
    obj: searchForm
  }
  const chkCustomerSo = vue.$finance.$api.chkCustomerSo
  const result = await chkCustomerSo.queryChkCustomerSoList(param)
  if (result && result.data) {
    const data = result.data
    vue.list = data.listObj
    vue.page.total = data.total
  }
}

function getDefaultSearchForm() {
  return Object.assign(
    {},
    {
      customerType: '4',
      invoiceStatusList: [1, 3],
      settleStatusList: [1, 4] // 未结算-未加入结算单，部分结算
    }
  )
}
</script>

<style lang="scss" scoped>
</style>
