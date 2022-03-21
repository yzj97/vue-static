<template>
  <div class="pg-supplier-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search">
          <ody-search-item :label="$t('商家:')" class="supplier-input" prop="obj.orgName">
            <ody-merchant-choose
              :selected.sync="search.merchant"
              :placeholder="$t('common_choose_please')"
              :readonly="true"
              @clear="handleMerchantSelected"
              @ok="handleMerchantSelected"
            />
          </ody-search-item>
          <ody-search-item :label="$t('供应商名称:')" prop="orgName">
            <el-input v-model="search.obj.orgName" name="search_obj_orgName" maxlength="100" />
          </ody-search-item>
          <ody-search-item :label="$t('供应商编码:')" prop="obj.orgCode">
            <el-input v-model="search.obj.orgCode" name="search_obj_orgCode" maxlength="100" />
          </ody-search-item>
          <ody-search-item :label="$t('供应商类别:')" prop="obj.supplierClassificationNode">
            <opms-tree-select-supplier
              ref="selectSupplier"
              v-model="search.obj.supplierClassificationNode"
              :merchant-id="search.merchant.merchantId"
              :selected.sync="supplierClassification"
              name="search_obj_supplierClassificationNode"
            />
          </ody-search-item>
          <ody-search-item :label="$t('采购方式:')" prop="obj.bussinessType">
            <ody-select2
              v-model="search.obj.bussinessType"
              :list-key=" operPlatformId ? 'operPlatformPurchaseTypeMapping' : 'merchantPlatformPurchaseTypeMapping' "
              name="search_obj_bussinessType"
            />
          </ody-search-item>
          <ody-search-item :label="$t('状态:')" prop="obj.status">
            <ody-select2
              v-model="search.obj.status"
              name="search_obj_status"
              list-key="purchasingStatusList"
            />
          </ody-search-item>
          <ody-search-item :label="$t('创建时间:')" :space="2" prop="obj.dateRangePicker">
            <ody-date-range-picker
              v-model="search.obj.dateRangePicker"
              :default="7"
              name="search_obj_dateRangePicker"
              type="datetimer"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('重置') }}</el-button>
        <ody-button
          name="OpmsSupplierList01_handleSearchSubmit"
          size="small"
          type="primary"
          code="OpmsSupplierList01"
          @click="handleSearchSubmit"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="OpmsSupplierList02_handleAddSupplier"
          size="small"
          type="primary"
          code="OpmsSupplierList02"
          @click="handleAddSupplier"
        >{{ $t('新增') }}</ody-button>
        <!--        <ody-button
          name="OpmsSupplierList03_exportSupplier"
          size="small"
          code="OpmsSupplierList03"
          @click="exportSupplier"
        >{{ $t('common_export') }}</ody-button>-->
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          :can-filter="false"
          request-url="/ouser-web/registerMerchant/queryDistributionByPageInfo.do"
        >
          <!-- <template slot="orgCode" slot-scope="scope">
            <el-button
              name="handleSupplierView"
              size="small"
              type="text"
              class="width-auto"
              @click="handleSupplierView(scope.row)"
            >{{ scope.row.orgCode }}</el-button>
          </template>-->
          <template
            slot="bussinessTypeStr"
            slot-scope="scope"
          >{{ scope.row.bussinessType | keyVal(getPurchasingMethodMap) }}</template>
          <template
            slot="statusStr"
            slot-scope="scope"
          >{{ scope.row.status | keyVal(getPurchasingStatusMap) }}</template>
          <template
            slot="channelCode"
            slot-scope="scope"
          >{{ scope.row.channelCode | keyVal(getChannelCodeMap) }}</template>
          <template slot="createTime" slot-scope="scope">{{ scope.row.createTime | parseTime }}</template>
        </ody-table>
      </div>
    </ody-list-table-area>
  </div>
</template>

<script>
import PlatformSupplierModal from './PlatformSupplierModal'
import OpmsTreeSelectSupplier from '@/components/tree-select-supplier'
import constants from '@/utils/constants'

import Cookies from 'js-cookie'
// import ss from ''

export default {
  name: 'OpmsSupplierList',
  components: {
    PlatformSupplierModal,
    OpmsTreeSelectSupplier
  },
  data() {
    return {
      supplierClassification: [],
      showSupplierModal: false,
      operPlatformId: Cookies.get('platformId') === '1',
      search: {
        merchantId: '',
        merchant: {
          merchantName: '',
          merchantCode: '',
          merchantId: ''
        },
        obj: {
          orgName: '',
          orgCode: '',
          supplierClassificationNode: null,
          bussinessType: '',
          status: '',
          dateRangePicker: []
        }
      },
      table: {
        operates: {
          width: 150,
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              hidden: (index, item) => {
                return (
                  item.dataSource === '5' && Cookies.get('platformId') === '2'
                )
              },
              method: (index, row) => {
                this.$router.push({
                  name: 'OpmsSupplierDetail',
                  params: {
                    supplierId: row.orgId,
                    // supplierType: row.supplierType,
                    merchant: JSON.stringify({
                      merchantCode: this.search.merchant.merchantCode,
                      merchantId: this.search.merchant.merchantId,
                      merchantName: this.search.merchant.merchantName
                    }),
                    editStatus: 1
                  }
                })
              },
              code: 'OpmsSupplierList04'
            },
            {
              label: this.$t('停用'),
              hidden: (index, item) => {
                return !(
                  item.status === 1 &&
                  !(
                    item.dataSource === '5' && Cookies.get('platformId') === '2'
                  )
                )
              },
              method: async(index, row) => {
                try {
                  await this.$confirm('您确认要停用', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  })
                  await this.$ouser.$api.supplier.updateDistributionStatus({
                    orgId: row.orgId,
                    status: 0
                  })
                  this.$message({
                    type: 'success',
                    message: '停用成功!'
                  })
                  await this.query()
                } catch (ex) {
                  console.log(ex)
                }
              },
              code: 'OpmsSupplierList05'
            },
            {
              label: this.$t('启用'),
              hidden: (index, item) => {
                return !(
                  item.status === 0 &&
                  !(
                    item.dataSource === '5' && Cookies.get('platformId') === '2'
                  )
                )
              },
              method: async(index, row) => {
                try {
                  await this.$confirm('您确认要启用', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  })
                  await this.$ouser.$api.supplier.updateDistributionStatus({
                    orgId: row.orgId,
                    status: 1
                  })
                  this.$message({
                    type: 'success',
                    message: '启用成功!'
                  })
                  await this.query()
                } catch (ex) {
                  console.log(ex)
                }
              },
              code: 'OpmsSupplierList06'
            }
          ]
        },
        columns: [
          {
            label: this.$t('商家名称'),
            prop: 'merchantName',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('供应商类别'),
            prop: 'classificationName',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('供应商编码'),
            prop: 'orgCode',
            align: 'center',
            show: true,
            render: (h, params) => {
              return (
                <a
                  on-click={() => {
                    if (this.$portal.hasPermission('OpmsSupplierList16')) {
                      this.handleSupplierView(params.row)
                    }
                  }}
                >
                  <span style={'color:#1890FF'}>{params.row.orgCode}</span>
                </a>
              )
            }
          },
          {
            label: this.$t('交易币别'),
            prop: 'currencyCode',
            minWidth: 88,
            align: 'center',
            show: true
          },
          {
            label: this.$t('供应商名称'),
            prop: 'orgName',
            minWidth: 200,
            align: 'center',
            show: true
          },
          {
            label: this.$t('公司名称'),
            prop: 'enterpriseName',
            minWidth: 200,
            align: 'center',
            show: true
          },
          {
            label: this.$t('采购方式'),
            prop: 'bussinessTypeStr',
            align: 'center',
            show: true,
            // purchasingMethodList: [
            //   { value: '1', label: '普通采购' },
            //   { value: '2', label: '集团采购' }
            // ],
            formatter: (row, column, cellValue) => {
              if (row.bussinessTypeStr && row.bussinessTypeStr !== '') {
                return row.bussinessTypeStr
              } else if (row.bussinessType === 1 || row.bussinessType === '1') {
                return '普通采购'
              } else if (row.bussinessType === 2 || row.bussinessType === '2') {
                return '集团采购'
              }
            }
          },
          {
            label: this.$t('状态'),
            slot: 'statusStr',
            align: 'center',
            minWidth: 88,
            show: true
          },
          {
            label: this.$t('主营品类'),
            prop: 'businessScope',
            align: 'center',
            minWidth: 200,
            show: true
          },
          {
            label: this.$t('创建时间'),
            prop: 'createTime',
            slot: 'createTime',
            minWidth: 200,
            align: 'center',
            show: true
          },
          {
            label: this.$t('数据来源'),
            prop: 'dataSourceStr',
            align: 'center',
            show: true
          },
          {
            label: this.$t('备注'),
            prop: 'remark',
            align: 'center',
            minWidth: 200,
            show: true
          }
        ],
        data: []
      },
      addStore: {
        visible: false
      }
    }
  },
  computed: {
    getPurchasingMethodMap() {
      return constants.purchasingMethodList.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
    },
    getPurchasingStatusMap() {
      const a = constants.purchasingStatusList.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
      console.log(a)
      return a
    },
    getChannelCodeMap() {
      return this.$refs.channel.$data.channelList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    }
  },
  mounted() {
    this.handleSearchSubmit()
  },
  methods: {
    async handleMerchantSelected() {
      this.$nextTick(async() => {
        this.search.obj.supplierClassificationNode = null
        await this.$refs.selectSupplier.reload()
      })
    },
    handleSupplierView(row) {
      this.$router.push({
        name: 'OpmsSupplierDetail',
        params: {
          supplierId: row.orgId,
          // supplierType: row.supplierType,
          merchant: JSON.stringify({
            merchantCode: this.search.merchant.merchantCode,
            merchantId: this.search.merchant.merchantId,
            merchantName: this.search.merchant.merchantName
          }),
          editStatus: 2
        }
      })
    },
    exportSupplier() {
      const params = {
        merchantId: this.search.merchant.merchantId,
        orgName: this.search.obj.orgName,
        orgCode: this.search.obj.orgCode,
        supplierClassificationNode: this.search.obj.supplierClassificationNode,
        bussinessType: this.search.obj.bussinessType,
        status: this.search.obj.status
      }

      if (this.search.obj.dateRangePicker) {
        if (this.search.obj.dateRangePicker[0]) {
          params.searchTimeStart = this.search.obj.dateRangePicker[0]
        } else {
          params.searchTimeStart = null
        }
        if (this.search.obj.dateRangePicker[1]) {
          params.searchTimeEnd = this.search.obj.dateRangePicker[1]
        } else {
          params.searchTimeEnd = null
        }
      }

      const searchParams = Object.assign({}, params)
      searchParams.orgType = 7

      this.$portal.downloadFileByPost(
        '/api/ouser-web/registerMerchant/exportSupplier.do',
        this.formHasValue(searchParams)
      )
    },
    getFilters() {
      const vue = this
      var searchObj = {
        dateRangePicker: vue.search.obj.dateRangePicker,
        merchantId: vue.search.merchant.merchantId,
        supplierName: vue.search.obj.orgName,
        supplierCode: vue.search.obj.orgCode,
        supplierClassificationNode: vue.search.obj.supplierClassificationNode,
        purchaseType: vue.search.obj.bussinessType,
        status: vue.search.obj.status
      }
      const filters = JSON.parse(JSON.stringify(searchObj))
      if (filters.dateRangePicker) {
        filters.obj = {}
        if (filters.dateRangePicker[0]) {
          filters.obj.searchTimeStart = filters.dateRangePicker[0]
        }
        if ((filters.obj.searchTimeEnd = filters.dateRangePicker[1])) {
          filters.obj.searchTimeEnd = filters.dateRangePicker[1]
        }
        delete filters.dateRangePicker
      }
      if (filters.merchantId <= 0) {
        delete filters.merchantId
      }
      return filters
    },
    async query() {
      // 递归 categoryList， search.categoryName
      const params = {
        merchantId: this.search.merchant.merchantId,
        orgName: this.search.obj.orgName,
        orgCode: this.search.obj.orgCode,
        supplierClassificationNode: this.search.obj.supplierClassificationNode,
        bussinessType: this.search.obj.bussinessType,
        status: this.search.obj.status
      }

      if (this.search.obj.dateRangePicker) {
        if (this.search.obj.dateRangePicker[0]) {
          params.searchTimeStart = this.search.obj.dateRangePicker[0]
        } else {
          params.searchTimeStart = null
        }
        if (this.search.obj.dateRangePicker[1]) {
          params.searchTimeEnd = this.search.obj.dateRangePicker[1]
        } else {
          params.searchTimeEnd = null
        }
      }

      const searchParams = Object.assign({}, params)
      searchParams.orgType = 7

      return this.$refs.table.getList(this.formHasValue(searchParams))
    },
    async handleSearchSubmit() {
      await this.query()
    },
    validateForm(formName) {
      return new Promise((resolve, reject) => {
        this.$refs[formName].validate(valid => {
          if (valid) {
            resolve([null, valid])
          } else {
            resolve([true])
          }
        })
      })
    },
    handleSearchReset() {
      this.search.merchant.merchantName = ''
      this.search.merchant.merchantCode = ''
      this.$refs.search.resetFields()
      this.handleMerchantSelected()
    },
    handleAddSupplier() {
      this.$router.push({
        name: 'OpmsSupplierAdd',
        params: {
          editStatus: 0
        }
      })
    },
    handleStoreAdded() {
      this.addStore.visible = false
      this.query()
    }
  }
}
</script>

<style scoped lang="scss">
</style>
