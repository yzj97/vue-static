<template>
  <div class="pg-merchant-store-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search">
          <ody-search-item :label="$t('店铺分类:')" prop="storeOnlineType">
            <ody-select2
              ref="storeBigType"
              v-model="search.storeOnlineType"
              name="search_storeOnlineType"
              list-key="storeBigTypeList"
            />
          </ody-search-item>
          <ody-search-item :label="$t('所属商家:')" prop="merchantId">
            <ody-merchant-select v-model="search.merchantId" name="search_merchantId" value-key="merchantId" />
          </ody-search-item>
          <ody-search-item :label="$t('销售渠道:')" prop="channelCode">
            <ody-channel-select ref="channel" v-model="search.channelCode" :placeholder="$t('全部')" name="search_channelCode" />
          </ody-search-item>
          <ody-search-item :label="$t('店铺编码:')" prop="orgCode">
            <el-input v-model="search.orgCode" name="search_orgCode" />
          </ody-search-item>
          <ody-search-item :label="$t('店铺名称:')" prop="orgName">
            <el-input v-model="search.orgName" name="search_orgName" />
          </ody-search-item>
          <ody-search-item :label="$t('店铺联系人:')" prop="contactName">
            <el-input v-model="search.contactName" name="search_contactName" />
          </ody-search-item>
          <ody-search-item :label="$t('联系人手机:')" prop="mobileNo">
            <el-input v-model="search.mobileNo" name="search_mobileNo" />
          </ody-search-item>
          <ody-search-item :label="$t('注册时间:')" :space="2" prop="createTime">
            <ody-date-range-picker
              v-model="search.createTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="search_createTime"
              value-format="yyyy-MM-dd"
              type="datetimer"
              range-separator="-"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('重置') }}</el-button>
        <ody-button
          name="MerchantStoreListQuery_handleSearchSubmit"
          code="MerchantStoreListQuery"
          size="small"
          type="primary"
          @click="handleSearchSubmit"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          id="addStore"
          name="MerchantStoreListAdd_handleAddStoreOpen"
          code="MerchantStoreListAdd"
          size="mini"
          type="primary"
          @click="handleAddStoreOpen"
        >{{ $t('添加店铺') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          :can-filter="false"
          request-url="/ouser-web/storeAction/queryStoreInfoList.do"
        >
          <template
            slot="storeOnlineType"
            slot-scope="scope"
          >{{ scope.row.storeOnlineType | keyVal(getStoreBigTypeMap) }}</template>
          <template
            slot="channelCode"
            slot-scope="scope"
          >{{ scope.row.channelCode | keyVal(getChannelCodeMap) }}</template>
          <template slot="createDate" slot-scope="scope">{{ scope.row.createDate | parseTime }}</template>
        </ody-table>
      </div>
    </ody-list-table-area>
    <merchant-modal-add-store
      v-if="addStore.visible"
      :visible.sync="addStore.visible"
      @ok="handleStoreAdded"
    />
  </div>
</template>

<script>
import MerchantModalAddStore from '@/components/modal-add-store'

export default {
  name: 'MerchantStoreList',
  components: {
    MerchantModalAddStore
  },
  data() {
    return {
      search: {
        orgType: 2,
        storeBigType: '',
        merchantId: '',
        channelCode: '',
        orgCode: '',
        orgName: '',
        contactName: '',
        mobileNo: '',
        createTime: []
      },
      table: {
        operates: {
          width: 120,
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              method: (index, row) => {
                this.$router.push({
                  name: 'MerchantStoreEdit',
                  params: {
                    orgId: row.id,
                    entityType: 3,
                    showTab: this.showTab(row),
                    channelMode: row.channelMode,
                    status: 1
                  }
                })
              },
              code: 'MerchantStoreListEdit'
            }
          ]
        },
        columns: [
          {
            label: this.$t('店铺编码'),
            prop: 'orgCode',
            show: true,
            minWidth: 180,
            render: (h, params) => {
              return (
                <a
                  on-click={() => {
                    if (this.$portal.hasPermission('MerchantStoreListSee')) {
                      this.handleTableView(params.row)
                    }
                  }}
                >
                  <span style={'color:#1890FF'}>{params.row.orgCode}</span>
                </a>
              )
            }
          },
          {
            label: this.$t('店铺名称'),
            prop: 'orgName',
            show: true,
            minWidth: 200
          },
          {
            label: this.$t('组织架构'),
            prop: 'departmentName',
            minWidth: 200,
            show: true
          },
          {
            label: this.$t('所属商家'),
            prop: 'parentOrgName',
            minWidth: 200,
            show: true
          },
          {
            label: this.$t('店铺分类'),
            slot: 'storeOnlineType',
            minWidth: 200,
            show: true
          },
          {
            label: this.$t('销售渠道'),
            slot: 'channelCode',
            minWidth: 200,
            show: true
          },
          {
            label: this.$t('店铺地址'),
            prop: 'detailAddress',
            minWidth: 200,
            show: true
          },
          {
            label: this.$t('店铺联系人'),
            prop: 'contactName',
            minWidth: 200,
            show: true
          },
          {
            label: this.$t('联系人手机'),
            prop: 'mobileNo',
            minWidth: 200,
            show: true
          },
          {
            label: this.$t('注册时间'),
            slot: 'createDate', // format store.createDate | date:'yyyy-MM-dd HH:mm:ss'
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
    getStoreBigTypeMap() {
      return this.$refs.storeBigType.options.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
    },
    getChannelCodeMap() {
      return this.$refs.channel.$refs.select2.options.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    }
  },
  async mounted() {
    await this.query()
  },
  methods: {
    showTab(data) {
      var interfaceFlag
      if (data.channelMode === 'O+O') {
        interfaceFlag = '111111101'
      }
      if (['BBC', 'B2C', 'S2B', 'B2B'].includes(data.channelMode)) {
        interfaceFlag = '100001101'
      }
      if (data.channelMode === 'POS') {
        interfaceFlag = '110101111'
      }
      return interfaceFlag
    },
    handleTableView(row) {
      this.$router.push({
        name: 'MerchantStoreEdit',
        params: {
          orgId: row.id,
          entityType: 3,
          showTab: this.showTab(row),
          channelMode: row.channelMode,
          status: 2
        }
      })
    },
    async query() {
      // debugger
      // 递归 categoryList， search.categoryName
      const { ...params } = this.search

      if (this.search.createTime && this.search.createTime.length) {
        params.createTimeStart = this.search.createTime[0]
        params.createTimeEnd = this.search.createTime[1]
      }

      params.orgType = 2

      return this.$refs.table.getList(this.formHasValue(params))
    },
    async handleSearchSubmit() {
      // debugger
      const [err] = await this.formValidate('search')

      if (err) {
        console.error('error submit!!')
        return false
      }
      this.currentPage = 1
      await this.query()
    },
    handleSearchReset() {
      this.formReset('search')
    },
    handleAddStoreOpen() {
      this.addStore.visible = true
    },
    handleStoreAdded() {
      this.addStore.visible = false
      this.query()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
