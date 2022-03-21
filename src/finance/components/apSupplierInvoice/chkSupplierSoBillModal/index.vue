<!-- 对账单 -->
<template>
  <div>
    <ody-dialog
      :visible="visible"
      :title="$t('common_choose_please')"
      width="60%"
      @before-close="handleClose"
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
              <ody-search-item :label="$t('settle_obj_type')" prop="settleObjType">
                <el-select
                  v-model="searchForm.settleObjType"
                  :clearable="false"
                  name="searchForm_settleObjType"
                >
                  <el-option v-for="(v, k) in settleObjTypeMap" :label="v" :key="k" :value="k" />
                </el-select>
              </ody-search-item>
              <ody-search-item :label="$t('settle_obj_name')" prop="supplierName">
                <el-input v-model="searchForm.supplierName" name="searchForm_supplierName" />
              </ody-search-item>
              <ody-search-item :label="$t('common_store_name')" prop="storeId">
                <ody-store-select
                  v-model="searchForm.storeId"
                  :placeholder="$t('全部')"
                  name="searchForm_storeId"
                  value-key="storeId"
                />
              </ody-search-item>
              <ody-search-item :label="$t('chk_order_code')" prop="billCode">
                <el-input v-model="searchForm.billCode" name="searchForm_billCode" />
              </ody-search-item>
              <!--              <ody-search-item
                :space="2"
                :label="$t('invoice_ref_order_create_time')"
                class="register"
                prop="refOrderCreateTime">
                <el-date-picker
                  v-model="searchForm.refOrderCreateTime"
                  name="searchForm_refOrderCreateTime"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="-"
                />
              </ody-search-item>-->
            </el-form>
          </div>
          <div slot="btn">
            <el-button
              name="handleSearchSubmit"
              size="small"
              type="primary"
              @click="handleSearchSubmit"
            >{{ $t('common_search') }}</el-button>
            <el-button
              name="handleSearchReset"
              size="small"
              @click="handleSearchReset"
            >{{ $t('common_reset') }}</el-button>
          </div>
        </ody-list-search-area>
        <ody-list-table-area>
          <div slot="table">
            <el-table
              :data="list"
              name="list581"
              highlight-current-row
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column
                :label="$t('common_merchant_name')"
                align="center"
                prop="merchantName"
              />
              <el-table-column :label="$t('common_store_name')" align="center" prop="storeName" />
              <el-table-column :label="$t('settle_obj_type')" align="center">
                <template slot-scope="scope">
                  <span>{{ settleObjTypeMap[scope.row.settleObjType] }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('settle_obj_code')" align="center" prop="supplierCode" />
              <el-table-column :label="$t('settle_obj_name')" align="center" prop="supplierName" />
              <el-table-column :label="$t('chk_order_code')" align="center" prop="billCode" />
              <!--              <el-table-column :label="$t('invoice_ref_order_create_time')" align="center">
                <template slot-scope="scope">
                  <span>{{ $portal.parseTime(scope.row.refOrderCreateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
              </el-table-column>-->
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
        <el-button
          name="handleConfirm"
          size="small"
          type="primary"
          @click="handleConfirm"
        >{{ $t('common_confirm') }}</el-button>
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
import Cookies from 'js-cookie'

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
      settleObjTypeMap: {},
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
            vue.searchForm.merchantCode =
              result.data.defaultMerchant.merchantCode
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
        this.searchForm.merchantCode = merchant.merchantCode
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
      if (Cookies.get('platformId') + '' === '1') {
        this.searchForm.settleObjType = '3'
      } else {
        this.searchForm.settleObjType = '1'
      }
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
        .codeSelectMulti({ categories: ['SETTLE_OBJ_TYPE'] })
        .then(data => {
          if (data.code === '0') {
            var map = data.data
            if (map.SETTLE_OBJ_TYPE) {
              if (Cookies.get('platformId') + '' !== '1') {
                vue.settleObjTypeMap = map.SETTLE_OBJ_TYPE
              } else {
                vue.settleObjTypeMap = {}
                for (const p in map.SETTLE_OBJ_TYPE) {
                  if (p + '' === '3') {
                    vue.settleObjTypeMap[p] = map.SETTLE_OBJ_TYPE[p]
                  }
                }
              }
            }
          }
        })
    },
    async init() {
      await this._initCodes()
      await this.initMerchantInfo()
      if (Cookies.get('platformId') + '' === '1') {
        this.searchForm.settleObjType = '3'
      } else {
        this.searchForm.settleObjType = '1'
      }
      this.handleSearchSubmit()
    },
    handleClose() {
      this.searchForm = getDefaultSearchForm()
      this.merchantInfo = Object.assign({}, {})

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
            item.supplierCode +
            '_' +
            item.customerCode
          if (!uniqueKey) {
            uniqueKey = key
          } else if (key !== uniqueKey) {
            this.$alert(
              this.$t('invalid_not_same_chk_purchase'),
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
    },
    close() {
      console.log('zhixingle1')
    }
  }
}
async function loadList(vue) {
  const searchForm = JSON.parse(JSON.stringify(vue.searchForm))
  if (searchForm.refOrderCreateTime) {
    searchForm.refOrderCreateTimeStart = searchForm.refOrderCreateTime[0]
    searchForm.refOrderCreateTimeEnd = searchForm.refOrderCreateTime[1]
    delete searchForm.refOrderCreateTime
  }
  searchForm.chkOrderType = vue.chkOrderType
  searchForm.chkStatus = vue.chkStatus
  const param = {
    itemsPerPage: vue.page.size,
    currentPage: vue.page.current,
    obj: searchForm
  }
  const chkCustomerSo = vue.$finance.$api.chkSupplierPurchase
  /* const result = await chkCustomerSo.queryChkSupplierPurchaseList(param)*/
  const result = await chkCustomerSo.newQueryChkSupplierPurchaseList(param)
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
      merchantName: '',
      settleObjType: '1',
      invoiceStatusList: [1, 3],
      settleStatusList: [1, 4] // 未结算-未加入结算单，部分结算
    }
  )
}
</script>

<style lang="scss" scoped>
</style>
