<template>
  <div class="bg-promotion-set-merchant-store">
    <el-tab :label="$t('店铺')" name="store">
      <div class="activity-merchant">
        <div>
          <ody-store-choose
            v-model="storeSelected"
            :selected.sync="storeSelectedItem"
            :multiple="true"
            :params="{ merchantId: merchantId }"
            :search-field="['storeCode', 'storeName']"
            :disabled="disabled"
            name="storeSelected"
            value-key="storeId"
            class="add-button"
            @ok="handleStoreChoose"
          >
            <ody-button
              :disabled="disabled"
              name="RegistrationAddStore"
              type="primary"
              size="small"
              code="RegistrationAddStore">{{ $t('添加店铺') }}</ody-button>
          </ody-store-choose>
          <ody-button
            :disabled="disabled"
            name="deleteMerchantListUrl4"
            type="primary"
            size="small"
            class="batch-delete"
            code="RegistrationBatchDelStore"
            @click="deleteMerchantListUrl(storeTable.checked, 2)"
          >{{ $t('批量删除') }}</ody-button>
        </div>

        <div class="search-wrap">
          <ody-button
            name="searchStoreShow"
            size="small"
            class="batch-delete"
            code="RegistrationStoreSearch"
            @click="searchStoreShow = !searchStoreShow"
          >{{ $t('搜索') }}</ody-button>
        </div>
      </div>

      <ody-list-search-area v-show="searchStoreShow">
        <div slot="content">
          <el-form ref="storeSearch" :model="storeSearch" label-width="100px" class="form">
            <ody-search-item :label="$t('店铺编码')" prop="storeCode">
              <el-input v-model="storeSearch.storeCode" name="storeSearch_storeCode" />
            </ody-search-item>
            <ody-search-item :label="$t('店铺名称')" prop="storeName">
              <el-input v-model="storeSearch.storeName" name="storeSearch_storeName" />
            </ody-search-item>
            <ody-search-item :label="$t('店铺类型')" prop="storeTypeName">
              <el-input v-model="storeSearch.storeTypeName" name="storeSearch_storeTypeName" />
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="handleStoreReset" size="small" @click="handleStoreReset">{{ $t('重置') }}</el-button>
          <ody-button
            name="RegistrationStoreQuery"
            size="small"
            type="primary"
            code="RegistrationStoreQuery"
            @click.prevent="querySelectedMerchantStoreList(2)"
          >{{ $t('查询') }}</ody-button>
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
    </el-tab>
  </div>
</template>

<script>
import util from '@/utils/util'
export default {
  components: {
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => {}
    },
    selectedMerchantStoreList: {
      type: Object,
      default: () => {}
    },
    storeList: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      activeName: 'store',
      merchantId: '',
      activityAttendId: '',
      refThemeId: '',
      refType: '',
      viewFlag: '',
      selectedMerchantList: {},
      // selectedMerchantStoreList: {},
      activityAttendRecordId: '',
      selectedContent: {},
      promotionAPI: null,
      promotionDetailData: {},
      allAuthStore: [],
      searchStoreShow: false,
      storeSearch: {
        storeCode: null,
        storeName: null,
        storeTypeName: null
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
              hidden: () => this.disabled,
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
    this.merchantId = this.params.merchantId
    this.activityAttendId = this.params.activityAttendId
    this.refThemeId = this.params.refThemeId
    this.viewFlag = this.params.viewFlag
    this.promotionAPI = this.$promotion.$api.promotion
    await this.queryPromotionActivityDetail(2)
  },
  mounted() {
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
    handleStoreReset() {
      this.formReset('storeSearch')
    },
    buttonDisabled() {
      var disabledFlag = false
      disabledFlag = (this.viewFlag === 1)
      return disabledFlag
    },
    handleCancel() {
      this.$router.push({
        name: 'PromotionRegistrationCreate'
      })
    },
    async handleSizeChange(merchantType) {
      if (merchantType === 1) {
        this.merchantTable.page.currentPage = 1
      } else {
        this.storeTable.page.currentPage = 1
      }
      this.querySelectedMerchantStoreList(merchantType)
      // await this.handleMerchantSubmit(merchantType)
    },
    async handleCurrentChange(merchantType) {
      this.querySelectedMerchantStoreList(merchantType)
      // await this.handleMerchantSubmit(merchantType)
    },
    async deleteMerchantListUrl(row, merchantType) {
      console.log(row)
      console.log(merchantType)
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
            id: x.id
          }
        }
      })

      const { code } = await this.promotionAPI.deleteMerchantStoreList({
        merchantAddList: merchantAddList,
        themeRef: this.activityAttendRecordId,
        refType: 9, // 报名规则
        merchantType: merchantType
      })

      if (code === '0') {
        // 查询该商家已选的门店信息
        this.querySelectedMerchantStoreList()
      }
      this.storeTable.checked = []
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
    async queryPromotionActivityDetail(merchantType) {
      const params = {
        activityAttendId: this.activityAttendId,
        merchantId: this.merchantId
      }

      const { data = {}, code } = await this.promotionAPI.queryActiveAttendDetail(params)

      if (code === '0') {
        this.selectedMerchantList.merchantName = data.attendRecord.merchantName
        this.selectedMerchantList.merchantId = data.attendRecord.merchantId
        this.activityAttendRecordId = data.attendRecord.id
        // 查询该商家已选的门店信息
        this.querySelectedMerchantStoreList(merchantType)
      }
    },
    // 查询已选门店
    async querySelectedMerchantStoreList(merchantType) {
      let params = {
        currentPage: 1,
        itemsPerPage: 30000
      }

      params = Object.assign({}, params, this.storeSearch)
      const {
        data: { listObj = [] } = {}
      } = await this.promotionAPI.queryAuthStorePageUrl(params)

      this.allAuthStore = listObj || []
      this.querySelectedMerchantByIds(this.allAuthStore)
    },

    async querySelectedMerchantByIds(list, merchantType) {
      if (util.isEmpty(list)) {
        this.storeTable.data = []
        return
      }
      const selectedMerchantQueryRequest = {}
      selectedMerchantQueryRequest.merchantIds = []
      selectedMerchantQueryRequest.themeRef = this.activityAttendRecordId
      selectedMerchantQueryRequest.refType = 9// mkt_use_rule存放的报名规则
      selectedMerchantQueryRequest.merchantType = merchantType
      selectedMerchantQueryRequest.currentPage = this.storeTable.page.currentPage
      selectedMerchantQueryRequest.itemsPerPage = this.storeTable.page.itemsPerPage
      list.forEach(item => {
        selectedMerchantQueryRequest.merchantIds.push(item.storeId)
      })
      const { data = {}, code } = await this.promotionAPI.queryEnrollSelectedMerchantList(selectedMerchantQueryRequest)
      if (code === '0') {
        this.storeTable.data = []
        this.storeList.length = 0
        if (!util.isEmpty(data.listObj)) {
          const merchantStoreList = data.listObj || []
          merchantStoreList.forEach(item => {
            list.forEach(item1 => {
              let isContainsFalg = true
              if (this.storeSearch.storeCode) {
                if (item1.storeCode.indexOf(this.storeSearch.storeCode) < 0) {
                  isContainsFalg = false
                }
              }
              if (this.storeSearch.storeName) {
                if (item1.storeName.indexOf(this.storeSearch.storeName) < 0) {
                  isContainsFalg = false
                }
              }
              if (this.storeSearch.storeTypeName) {
                if (!item1.storeTypeName) {
                  isContainsFalg = false
                } else {
                  if (item1.storeTypeName.indexOf(this.storeSearch.storeTypeName) < 0) {
                    isContainsFalg = false
                  }
                }
              }
              if (item.id === item1.storeId && isContainsFalg) {
                item.storeCode = item1.storeCode
                item.storeName = item1.storeName
                item.storeTypeName = item1.storeTypeName
                this.storeTable.data.push(item)
                this.storeList.push(item)
              }
            })
          })
        }
        this.storeTable.page.total = this.storeTable.data.length
      }
      console.log(JSON.stringify(this.storeTable.data))
      console.log(JSON.stringify(this.storeList))
    },
    async addMerchantList(merchantAddList, merchantType) {
      const params = {
        merchantAddList: merchantAddList,
        merchantType: merchantType,
        promotionId: this.refThemeId,
        themeRef: this.activityAttendRecordId,
        refType: 9 // 报名规则
      }
      const { code } = await this.promotionAPI.getAddStoreAttendUrl(params)
      if (code === '0') {
        this.storeSelected = []
        if (merchantType === 1) {
          await this.queryAuthMerchantPageUrl()
          await this.handleMerchantSubmit(merchantType)
        } else if (merchantType === 2) {
          await this.querySelectedMerchantStoreList()
          // await this.handleMerchantSubmit(merchantType)
        }
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
