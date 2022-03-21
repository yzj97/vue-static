<template>
  <section class="pg-authConfig-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="120px" class="form">
          <el-col :span="6" >
            <el-form-item :label="$t('渠道')">
              <el-select v-model="searchForm.channelCode" name="searchForm_channelCode" @change="changeChannelCode">
                <el-option :label="$t('全部')" />
                <el-option v-for="item in channelList" :label="item.channelName" :key="item.channelCode" :value="item.channelCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" >
            <el-form-item :label="$t('应用')">
              <el-select v-model="applicationId" name="applicationId">
                <el-option :label="$t('全部')" />
                <el-option v-for="item in applicationList" :label="item.envName" :key="item.id" :value="item.id" />
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
            <el-form-item :label="$t('授权编码')">
              <el-input v-model="searchForm.authCode" name="searchForm_authCode" />
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ '重置' }}</el-button>
        <ody-button name="OdtsAuthConfig_Query_handleSearchSubmit" code="OdtsAuthConfig_Query" size="small" type="primary" @click="handleSearchSubmit">{{ '查询' }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button name="OdtsAuthConfig_Add_showAuthConfigDialog" code="OdtsAuthConfig_Add" size="small" type="primary" @click="showAuthConfigDialog()">{{ '新增' }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :can-filter="false"
          name="list039"
        />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"/>

      </div>
    </ody-list-table-area>
    <auth-config :visible.sync="addAuthConfigVisible" :auth-config.sync="selectedItem" :no-store-channel-codes.sync="noStoreChannelCodes" @ok="handleOk" />
  </section>
</template>

<script>
import AuthConfig from '@/components/authConfig'
export default {
  name: 'OdtsAuthConfig',
  components: {
    AuthConfig
  },
  data() {
    const self = this
    return {
      channelList: [],
      applicationId: null,
      applicationList: [],
      applicationMap: {},
      applicationChannelAppKeyMap: null,
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
      addAuthConfigVisible: false,
      selectedItem: null,
      loading: false,
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      operates: {
        fixed: 'right',
        align: 'center',
        width: 120,
        list: [
          {
            label: this.$t('修改'),
            method(index, row) {
              self.showAuthConfigDialog(row)
            },
            hidden(index, row) {
              return false
            },
            code: 'OdtsAuthConfig_Edit'
          },
          {
            label: this.$t('删除'),
            method(index, row) {
              self.deleteAuthConfig(row)
            },
            code: 'OdtsAuthConfig_Delete'
          }
        ]
      },
      columns: [],
      defaultColumns: [
        {
          show: true,
          prop: 'channelCode',
          label: '渠道编码',
          align: 'center',
          minWidth: 140
        },
        {
          show: true,
          prop: 'channelCode',
          label: '渠道',
          align: 'center',
          minWidth: 140,
          formatter: (row, column) => {
            if (row.channelCode) {
              const channel = self.channelMap[row.channelCode]
              if (channel) {
                return channel.channelName
              }
            }
            return ''
          }
        },
        {
          show: true,
          prop: 'appKey',
          label: '应用',
          align: 'center',
          minWidth: 140,
          formatter: (row, column) => {
            if (row.channelCode && self.applicationChannelAppKeyMap) {
              const application = self.applicationChannelAppKeyMap[(row.appKey ? row.appKey : '') + '_' + row.channelCode]
              if (application) {
                return application.envName
              }
            }
            return row.appKey
          }

        },
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
          prop: 'storeName',
          label: '店铺',
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
          prop: 'authCode',
          label: '授权编码',
          align: 'center',
          minWidth: 140
        },
        {
          show: true,
          prop: 'accessToken',
          label: '授权Token',
          align: 'center',
          minWidth: 140
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
    showAuthConfigDialog(row) {
      this.selectedItem = row
      this.addAuthConfigVisible = true
    },
    async deleteAuthConfig(row) {
      const vue = this
      const confirm = await this.$confirm('删除授权可能会导致订单无法进入中台，确认删除？', this.$t('提示'))
      if (!confirm) {
        return
      }
      vue.$odts.$api.authConfig.deleteAuthConfig(row).then(data => {
        if (data.code === '0') {
          vue.$message({
            type: 'success',
            message: '删除成功'
          })
          loadList(vue)
        }
      })
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
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
      this.applicationId = null
      this.loadApplication()
      this.loadStoreByMerchant()
    },
    async handlePageSizeChange(size) {
      try {
        this.$nextTick(function() {
          this.page.current = 1
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
      }
      if (before !== this.displayStore) {
        this.changeColumns()
      }
      this.applicationId = null
      this.loadApplication()
    },
    changeColumns() { // 根据是否有店铺，修改列定义
      this.columns = []
      for (let i = 0; i < this.defaultColumns.length; i++) {
        const item = this.defaultColumns[i]
        if (this.displayStore || (item.prop !== 'storeName')) {
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
    async loadApplication() {
      this.applicationList = []
      this.applicationMap = {}
      const vue = this
      await this.$odts.$api.application.queryApplicationInfoList({ channelCode: this.searchForm.channelCode }).then((data) => {
        if (data.code === '0') {
          vue.applicationList = data.data.listObj || []
          vue.applicationMap = vue.applicationList.reduce((r, i) => { r[i.id] = i; return r }, {})
          if (!vue.applicationChannelAppKeyMap && !this.searchForm.channelCode) {
            vue.applicationChannelAppKeyMap = vue.applicationList.reduce((r, i) => { r[i.appKey + '_' + i.channelCode] = i; return r }, {})
          }
        }
      })
    },
    _initStore() {
      const vue = this
      this.$odts.$api.common.queryStoreOrgPageByAuth({ currentPage: 1, itemsPerPage: 1000 }).then((data) => {
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
    async init() {
      await this._loadSupportChannel()
      await this._initMerchants()
      await this._initStore()
      await this.changeColumns()
      await this.loadApplication()
      if (this.$route.params.authType === 'pdd') {
        this.searchForm.channelCode = '210010'
      }
      await loadList(this)
      if (this.$route.params.authType === 'pdd') {
        this.showAuthConfigDialog({ channelCode: '210010', authCode: this.$route.params.authCode || '' })
        this.$message(this.$t('请选择商家店铺进行授权绑定'))
      }
    }
  }
}
async function loadList(vue) {
  const filters = Object.assign({}, vue.searchForm)
  if (vue.applicationId && vue.applicationMap && vue.applicationMap[vue.applicationId]) {
    filters.appKey = vue.applicationMap[vue.applicationId].appKey
    filters.channelCode = vue.applicationMap[vue.applicationId].channelCode
  }
  const param = {
    filters: filters,
    limit: vue.page.size,
    page: vue.page.current
  }

  vue.list = []
  vue.page.total = 0
  const authConfig = vue.$odts.$api.authConfig
  const res = await authConfig.listPage(param)
  if (res && res.code === '0') {
    const data = res.data
    vue.list = data.list || []
    vue.page.total = res.data.total
  }
}

function getDefaultSearchForm() {
  return Object.assign({}, {
    channelCode: null,
    merchantId: null,
    storeId: null,
    appKey: null,
    authCode: null
  })
}
</script>

<style lang="scss" scoped>

</style>
