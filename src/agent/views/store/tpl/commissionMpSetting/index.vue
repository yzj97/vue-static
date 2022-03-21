<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('product_name')" prop="mpName">
            <el-input v-model="search.mpName" name="search_mpName"/>
          </ody-search-item>
          <ody-search-item :label="$t('product_code')" prop="mpCode">
            <el-input v-model="search.mpCode" name="search_mpCode"/>
          </ody-search-item>
          <ody-search-item :label="$t('merchant_name')" prop="merchantId">
            <el-select v-model="search.merchantId" name="search_merchantId" @change="selectMerchantChange(search.merchantId)">
              <el-option v-for="item in merchantList" :label="item.merchantName" :key="item.merchantId" :value="item.merchantId" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('shop')" prop="storeId">
            <el-select v-model="search.storeId" name="search_storeId">
              <el-option v-for="item in storeList" v-if="item.isShow" :label="item.storeName" :key="item.storeId" :value="item.storeId"/>
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button name="handleSearchSubmit" size="small" type="primary" @click="handleSearchSubmit">{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="activeState" :before-leave="handleTabLeave" name="activeState" @tab-click="onTabClick" >
          <el-tab-pane v-for="tab in tabs" :label="tab.heading" :key="tab.index" />
        </el-tabs>
        <div slot="btn mgB12">
          <el-button name="onProductModal" size="small" @click="onProductModal()">{{ $t('add_product') }}</el-button>
          <el-button :disabled="checked.length === 0" name="onEffectiveDateSetting" size="small" @click="onEffectiveDateSetting()">{{ $t('effective_date_setting') }}</el-button>
          <el-button :disabled="checked.length === 0" name="onEnable" size="small" @click="onEnable()">{{ $t('batch_enable') }}</el-button>
          <el-button :disabled="checked.length === 0" name="onDisable" size="small" @click="onDisable()">{{ $t('batch_disable') }}</el-button>
        </div>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :multiple="multiple"
          :checked.sync="checked"
          name="list587" />
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

    <!-- 有效期模态框 -->
    <ody-dialog :visible.sync="effectiveDate.showDialog" :title="$t('set_product_effective_time')" width="540px">
      <el-form ref="effectiveDateForm" :model="effectiveDate.form" :rules="effectiveDate.rules" label-width="60px">
        <el-form-item :label="$t('period_of_validity')" :rules="[{ required: true, message: $t('please_set_expiry_date') }]" class="register" required prop="time">
          <el-date-picker
            v-model="effectiveDate.form.time"
            name="effectiveDate_form_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="-"/>
        </el-form-item>
        <el-form-item :label="$t('period_of_validity_note')" class="register" required/>
      </el-form>
      <div slot="footer">
        <el-button name="effectiveDate_showDialog" size="small" @click="effectiveDate.showDialog = false">{{ $t('common_cancel') }}</el-button>
        <el-button name="submitAuditForm" size="small" type="primary" @click="submitAuditForm">{{ $t('common_confirm') }}</el-button>
      </div>
    </ody-dialog>
    <!-- 选择商品模态框 -->
    <ProductModal :visible.sync="showProductModal" :form-data.sync="formData" :collect.sync="collect" @ok="saveProduct" />
  </section>
</template>

<script>
import ProductModal from '@/components/productModal'
export default {
  name: 'AgentStoreCommissionMpSetting',
  components: {
    ProductModal
  },
  data() {
    return {
      tabs: [],
      activeState: 0,
      merchantList: [],
      storeList: [],
      search: {},
      loading: false,
      multiple: true,
      checked: [],
      operates: {
        width: 140,
        fixed: 'right',
        list: [{
          label: this.$t('period_of_validity'),
          method: (index, row) => {
            var vm = this
            vm.effectiveDate.showDialog = true
            vm.effectiveDate.form.id = row.id
          }
        }, {
          label: this.$t('common_disable'),
          hidden: function(index, row) {
            return row.isAvailable === 0
          },
          method: (index, row) => {
            var vm = this
            this.getCommissionMpId(row.id, 0)
            this.$agent.$api.agent.updateCommissionProducts(vm.batchOperateParams).then((res) => {
              this.updateList()
              this.$message({
                message: res.message,
                type: 'success'
              })
            })
          }
        }, {
          label: this.$t('common_enable'),
          hidden: function(index, row) {
            return row.isAvailable === 1
          },
          method: (index, row) => {
            var vm = this
            this.getCommissionMpId(row.id, 1)
            this.$agent.$api.agent.updateCommissionProducts(vm.batchOperateParams).then((res) => {
              this.updateList()
              this.$message({
                message: res.message,
                type: 'success'
              })
            })
          }
        }]
      },
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'mpName',
          label: this.$t('product_name'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'mpCode',
          label: this.$t('product_code'),
          align: 'center',
          minWidth: 160
        },
        {
          show: true,
          prop: 'brandName',
          label: this.$t('brand_name'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('merchant_name'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'storeName',
          label: this.$t('store_name'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'channelName',
          label: this.$t('channel_name'),
          align: 'center',
          minWidth: 140
        },
        {
          show: true,
          prop: 'startTime',
          label: this.$t('effective_start_time'),
          align: 'center',
          minWidth: 160
        },
        {
          show: true,
          prop: 'endTime',
          label: this.$t('effective_end_time'),
          align: 'center',
          minWidth: 160
        },
        {
          show: true,
          label: this.$t('common_state'),
          align: 'center',
          minWidth: 80,
          formatter: (row, column) => {
            return (row.isAvailable === 1 ? this.$t('common_enable') : this.$t('common_disable'))
          }
        }
      ],
      effectiveDate: {
        showDialog: false,
        auditStatusList: [],
        form: {
          time: null,
          id: null
        }
      },
      batchOperateParams: [],
      showProductModal: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async updateList() {
      try {
        this.loading = true
        await loadList(this)
        this.checked = []
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    async handlePageSizeChange() {
      try {
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
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.search = getDefaultSearchForm()
      this.selectMerchantChange(this.search.merchantId)
    },
    selectMerchantChange(merchantId) {
      this.storeList.forEach((item) => {
        if (item.merchantId === merchantId) {
          item.isShow = true
        } else {
          item.isShow = false
        }
      })
    },
    initData() {
      this.$agent.$api.agent.getAuthMerchantList({}).then((res) => {
        this.merchantList = res.data
      })
      this.$agent.$api.agent.getAuthStoreList({}).then((res) => {
        this.storeList = res.data
      })
    },
    init() {
      this.initData()
      this.tabs = [
        { heading: this.$t('common_all'), index: 0, status: null },
        { heading: this.$t('common_enable'), index: 1, status: 1 },
        { heading: this.$t('common_disable'), index: 2, status: 0 }
      ]
      this.updateList()
    },
    submitAuditForm() {
      const vue = this
      this.$refs['effectiveDateForm'].validate((valid) => {
        if (valid) {
          if (this.effectiveDate.form.time) {
            this.effectiveDate.form.startTime = this.effectiveDate.form.time[0]
            this.effectiveDate.form.endTime = this.effectiveDate.form.time[1]
            const date = this.$portal.parseTime(new Date(), '{y}-{m}-{d}')
            if (this.effectiveDate.form.endTime < date) {
              this.$message({
                type: 'warn',
                message: this.$t('end_time_not_less_than_today')
              })
              return
            }
            delete this.effectiveDate.form.time
          }
          var commissionProducts = []
          if (this.effectiveDate.form.id) {
            commissionProducts.push(this.effectiveDate.form)
          } else {
            vue.checked.forEach((item) => {
              var param = {
                id: item.id,
                startTime: this.effectiveDate.form.startTime,
                endTime: this.effectiveDate.form.endTime
              }
              commissionProducts.push(param)
            })
          }
          this.$agent.$api.agent.updateCommissionProducts(commissionProducts).then((res) => {
            this.effectiveDate.showDialog = false
            this.updateList()
            this.$message({
              message: res.message,
              type: 'success'
            })
          })
        }
      })
    },
    getCommissionMpId(id, status) {
      const vue = this
      vue.batchOperateParams = []
      var param = {
        id: id,
        isAvailable: status
      }
      vue.batchOperateParams.push(param)
    },
    getCommissionMpIds(vue, status) {
      vue.batchOperateParams = []
      vue.checked.forEach((item) => {
        var param = {
          id: item.id,
          isAvailable: status
        }
        vue.batchOperateParams.push(param)
      })
    },
    onEffectiveDateSetting() {
      const vue = this
      vue.effectiveDate.showDialog = true
    },
    onDisable() {
      const vue = this
      if (vue.checked) {
        this.getCommissionMpIds(vue, 0)
        this.$agent.$api.agent.updateCommissionProducts(vue.batchOperateParams).then((res) => {
          this.updateList()
          this.$message({
            message: res.message,
            type: 'success'
          })
        })
      }
    },
    onEnable() {
      const vue = this
      if (vue.checked) {
        this.getCommissionMpIds(vue, 1)
        this.$agent.$api.agent.updateCommissionProducts(vue.batchOperateParams).then((res) => {
          this.updateList()
          this.$message({
            message: res.message,
            type: 'success'
          })
        })
      }
    },
    handleTabLeave() {
      return !this.loading
    },
    async onTabClick() {
      var tab = this.tabs[this.activeState]
      this.search.status = tab.status
      this.page.current = 1
      this.updateList()
    },
    onProductModal() {
      this.showProductModal = true
    },
    async saveProduct(itemList) {
      this.$agent.$api.agent.addCommissionProducts(itemList).then((res) => {
        this.updateList()
        this.$message({
          message: res.message,
          type: 'success'
        })
      })
    }
  }
}
async function loadList(vue) {
  const filters = JSON.parse(JSON.stringify(vue.search))
  const param = {
    obj: filters,
    itemsPerPage: vue.page.size,
    currentPage: vue.page.current
  }
  const res = await vue.$agent.$api.agent.queryCommissionProductList(param)
  if (res) {
    const data = res.data
    vue.list = data.listObj || []
    vue.page.total = data.total
  }
}
function getDefaultSearchForm() {
  return Object.assign({}, {
    mpName: null,
    mpCode: null,
    merchantId: null,
    storeId: null,
    isAvailable: null
  })
}
</script>

<style lang="less" scoped>
  .show_dialog {
    margin-top: 15vh;
    width: 530px;
  }
</style>
