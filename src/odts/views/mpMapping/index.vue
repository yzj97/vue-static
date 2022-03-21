<template>
  <section class="pg-soPickDelivery-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="120px" class="form">
          <el-col :span="6" >
            <el-form-item :label="$t('渠道')" required>
              <el-select v-model="searchForm.channelCode" name="searchForm_channelCode" @change="changeChannelCode">
                <el-option v-for="item in channelList" :label="item.channelName" :key="item.channelCode" :value="item.channelCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" >
            <el-form-item :label="$t('商家')">
              <el-select v-model="searchForm.merchantId" name="searchForm_merchantId" @change="loadStoreByMerchant">
                <el-option :label="$t('全部')" />
                <el-option v-for="item in merchants" :label="item.merchantName" :key="item.merchantId" :value="item.merchantId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" >
            <el-form-item v-if="displayStore" :label="$t('店铺')">
              <el-select v-model="searchForm.storeId" name="searchForm_storeId">
                <el-option :label="$t('全部')" />
                <el-option v-for="item in storeList" :label="item.storeName" :key="item.storeId" :value="item.storeId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" >
            <el-form-item :label="$t('商品编码')">
              <el-input v-model="searchForm.productCode" name="searchForm_productCode" maxlength="25"/>
            </el-form-item>
          </el-col>
          <el-col :span="6" >
            <el-form-item :label="$t('渠道商品编码')">
              <el-input v-model="searchForm.itemId" name="searchForm_itemId" maxlength="25"/>
            </el-form-item>
          </el-col>
          <el-col :span="6" >
            <el-form-item :label="$t('匹配状态')">
              <el-select v-model="searchForm.matchStatus" name="searchForm_matchStatus" >
                <el-option :label="$t('全部')" />
                <el-option v-for="(value, key) in matchStatusMap" :label="value" :key="key" :value="key" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ '重置' }}</el-button>
        <ody-button name="OdtsMpMapping_Query_handleSearchSubmit" code="OdtsMpMapping_Query" size="small" type="primary" @click="handleSearchSubmit">{{ '查询' }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :can-filter="false"
          name="list212"
        >
          <template slot="priceAutoPushStatus" slot-scope="props">
            <div>
              <span> {{ pushStatus[props.row.priceAutoPushStatus] }}</span>
              <el-popover
                v-if="props.row.pricePushErrorRemark"
                placement="top"
                width="300"
                trigger="hover">
                <div>
                  <div>
                    <div v-html="props.row.pricePushErrorRemark" />
                  </div>
                </div>
                <i slot="reference" class="el-icon-info"/>
              </el-popover>
            </div>
          </template>
          <template slot="stockAutoPushStatus" slot-scope="props">
            <div>
              <span> {{ pushStatus[props.row.stockAutoPushStatus] }}</span>
              <el-popover
                v-if="props.row.stockPushErrorRemark"
                placement="top"
                width="300"
                trigger="hover">
                <div>
                  <div>
                    <div v-html="props.row.stockPushErrorRemark" />
                  </div>
                </div>
                <i slot="reference" class="el-icon-info"/>
              </el-popover>
            </div>
          </template>
        </ody-table>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="pageParam.page"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="pageParam.limit"
          :total.sync="pageParam.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"/>

      </div>
    </ody-list-table-area>
    <mp-item :visible.sync="matchDialogVisible" :merchant-map.sync="merchantMap" :no-store-channel-codes.sync="noStoreChannelCodes" :store-map.sync="allAuthStoreMap" :product.sync="selectItem" @ok="handleOk" />
    <sku-item :visible.sync="matchSkuDialogVisible" :merchant-map.sync="merchantMap" :store-map.sync="allAuthStoreMap" :main-prod.sync="selectItem" @ok="handleOk" />
  </section>
</template>

<script>
import MpItem from '@/components/mpMapping'
import SkuItem from '@/components/mpMapping/useSku'
export default {
  name: 'OdtsMpMapping',
  components: {
    MpItem,
    SkuItem
  },
  data() {
    const self = this
    return {
      matchStatusMap: {
        1: '未匹配',
        2: '部分匹配',
        3: '已匹配'
      },
      pushStatus: {
        0: '未推送',
        1: '已推送',
        2: '推送失败'
      },
      channelList: [],
      channelMap: {},
      merchants: [],
      merchantMap: {},
      merchantIds: [],
      storeList: [],
      storeMap: {},
      allAuthStoreMap: {},
      searchForm: getDefaultSearchForm(),
      noStoreChannelCodes: [],
      displayStore: true,
      matchDialogVisible: false,
      matchSkuDialogVisible: false,
      selectItem: {},
      selectedChannel: {},
      loading: false,
      list: [],
      pageParam: {
        limit: 10,
        page: 1,
        total: 0
      },
      operates: {
        fixed: 'right',
        align: 'center',
        list: [
          {
            label: this.$t('匹配'),
            method(index, row) {
              self.showMatchDialog(row)
            },
            hidden(index, row) {
              return row.matchStatus === 3
            },
            code: 'OdtsMpMapping_Match'
          }
        ]
      },
      columns: [],
      defaultColumns: [
        {
          show: true,
          prop: 'merchantId',
          label: '商家',
          align: 'center',
          minWidth: 140,
          formatter: (row, column) => {
            if (row.merchantId) {
              const merchant = self.merchantMap[row.merchantId]
              if (merchant) {
                return merchant.merchantName
              }
            }
            return ''
          }
        },
        {
          show: true,
          prop: 'itemId',
          label: '渠道商品编码',
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'itemName',
          label: '渠道商品名称',
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          prop: 'storeId',
          label: '店铺名称',
          align: 'center',
          minWidth: 140,
          formatter: (row, column) => {
            if (row.storeId) {
              const store = self.allAuthStoreMap[row.storeId]
              if (store) {
                return store.storeName
              }
            }
            return ''
          }
        },
        {
          show: true,
          prop: 'productCode',
          label: '内部商品编码',
          align: 'center',
          minWidth: 140
        },
        {
          show: true,
          prop: 'productCname',
          label: '内部商品名称',
          align: 'center',
          minWidth: 140
        },
        {
          show: true,
          prop: 'priceAutoPushStatus',
          label: '价格推送状态',
          align: 'center',
          minWidth: 140,
          slot: 'priceAutoPushStatus'
        },
        {
          show: true,
          prop: 'stockAutoPushStatus',
          label: '库存推送状态',
          align: 'center',
          minWidth: 140,
          slot: 'stockAutoPushStatus'
        },
        {
          show: true,
          prop: 'matchStatus',
          label: '匹配状态',
          align: 'center',
          minWidth: 120,
          formatter: (row, column) => {
            if (row.matchStatus) {
              return self.matchStatusMap[row.matchStatus]
            }
            return self.matchStatusMap[1]
          }
        }
      ]
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    showMatchDialog(row) {
      // 显示匹配商品模态框
      // this.selectedChannel.useSku, 是否弹框商品子品明细
      this.selectItem = row
      this.selectedChannel = this.channelMap[row.channelCode]
      if (this.selectedChannel.useSku) {
        this.matchSkuDialogVisible = true
      } else {
        this.matchDialogVisible = true
      }
    },
    handleOk(item) {
      this.updateList()
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
        this.pageParam.page = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
    },
    async handlePageSizeChange(size) {
      try {
        this.pageParam.page = 1
        await this.updateList()
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
    _initMerchants() {
      const vue = this
      this.$odts.$api.common.queryPlatformAuthMerchantPage({ currentPage: 1, itemsPerPage: 1000 }).then((data) => {
        if (data.code === '0') {
          vue.merchants = data.data.listObj
          vue.merchantMap = vue.merchants.reduce((r, i) => { r[i['merchantId']] = i; return r }, {})
          vue.merchantIds = vue.merchants.reduce((r, i) => { r.push(i.merchantId); return r }, [])
        }
      })
    },
    loadStoreByMerchant() { // 修改商家
      this.storeList = []
      this.storeMap = {}
      this.searchForm.storeId = null
      this.searchForm.channelStoreId = null

      if (!this.searchForm.merchantId) {
        return
      }
      if (this.displayStore) {
        this.loadStore()
      }
    },
    changeChannelCode() { // 修改渠道，变更是否显示店铺
      const before = this.displayStore
      if (this.searchForm.channelCode) {
        if (this.noStoreChannelCodes.indexOf(this.searchForm.channelCode) !== -1) {
          this.displayStore = false
        } else {
          this.displayStore = true
          this.loadStore()
        }
        this.updateList()
      }
      if (before !== this.displayStore) {
        this.changeColumns()
      }
    },
    changeColumns() { // 根据是否有店铺，修改列定义
      this.columns = []
      for (let i = 0; i < this.defaultColumns.length; i++) {
        const item = this.defaultColumns[i]
        if (this.displayStore || (item.prop !== 'storeId')) {
          this.columns.push(item)
        }
      }
    },
    loadStore() { // 获取商家下店铺
      const vue = this
      vue.searchForm.storeId = null
      vue.storeList = []
      if (!vue.searchForm.merchantId) {
        return
      }
      this.$odts.$api.common.queryStoreOrgPageByAuth({ currentPage: 1, itemsPerPage: 1000, merchantId: vue.searchForm.merchantId }).then((data) => {
        if (data.code === '0') {
          vue.storeList = (data.data.listObj || []).filter(i => !vue.searchForm.channelCode || (i.channelCodes && i.channelCodes.indexOf(vue.searchForm.channelCode) >= 0))
          vue.storeMap = vue.storeList.reduce((r, i) => { r[i['storeId']] = i; return r }, {})
        }
      })
    },
    async _initStore() {
      const vue = this
      await this.$odts.$api.common.queryStoreOrgPageByAuth({ currentPage: 1, itemsPerPage: 1000 }).then((data) => {
        if (data.code === '0') {
          vue.allAuthStoreMap = data.data.listObj.reduce((r, i) => { r[i['storeId']] = i; return r }, {})
        }
      })
    },
    _loadSupportChannel() {
      const vue = this
      this.$odts.$api.odtsMp.supportChannel({ }).then((data) => {
        if (data.code === '0') {
          vue.channelList = data.data
          vue.channelMap = vue.channelList.reduce((r, i) => { r[i['channelCode']] = i; return r }, {})
        }
      })
    },
    init() {
      this._loadSupportChannel()
      this._initMerchants()
      this._initStore()
      this.changeColumns()
    }
  }
}
async function loadList(vue) {
  const param = {
    filters: {
      ...vue.searchForm
    },
    sorts: [{ field: 'id', asc: false }],
    limit: vue.pageParam.limit,
    page: vue.pageParam.page
  }
  if (!vue.searchForm.channelCode) {
    vue.$message({
      type: 'warning',
      message: '请选择渠道'
    })
    return
  }
  vue.list = []
  vue.pageParam.total = 0
  const odtsMp = vue.$odts.$api.odtsMp
  const res = await odtsMp.listPage(param)
  if (res && res.code === '0') {
    const data = res.data
    vue.list = data.list || []
    vue.pageParam.total = res.data.total
    vue.pageParam.page = param.page
  }
}

function getDefaultSearchForm() {
  return Object.assign({}, {
    channelCode: null,
    merchantId: null,
    storeId: null,
    productCode: null,
    itemId: null,
    matchStatus: null
  })
}
</script>

<style lang="scss" scoped>

</style>
