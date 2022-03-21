<template>
  <section class="pg-timeoutAlert-list timeoutAlert-html">
    <div slot="tabs" class="tabsss">
      <el-tabs v-model="activeState" name="activeState" @tab-click="handleTabsClick">
        <el-tab-pane v-for="tab in tabList" :label="tab.heading" :key="tab.index">
          <span slot="label">
            {{ tab.heading }}
            <span style="color: red">({{ tab.count }})</span>
          </span>
        </el-tab-pane>
      </el-tabs>
    </div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item v-show="currentTab.index != 2" :label="$t('order_code') + ':'" prop="orderCode">
            <el-input v-model="searchForm.orderCode" name="searchForm_orderCode" />
          </ody-search-item>
          <ody-search-item v-show="currentTab.index == 2" :label="$t('order_sales_code') + ':'" prop="refId">
            <el-input v-model="searchForm.refId" name="searchForm_refId" />
          </ody-search-item>
          <ody-search-item :label="$t('order_ruleMerchant') + ':'" prop="merchantId">
            <el-select
              v-model="searchForm.merchantId"
              :popper-append-to-body="false"
              :placeholder="$t('common_all')"
              name="searchForm_merchantId"
              @change="switchMerchant"
            >
              <el-option
                v-for="item in merchants"
                :label="item.merchantName"
                :key="item.merchantId"
                :value="item.merchantId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('sale_store') + ':'" prop="storeId">
            <el-select v-model="searchForm.storeId" :placeholder="$t('common_all')" name="searchForm_storeId">
              <el-option
                v-for="item in stores"
                :label="item.storeName"
                :key="item.storeId"
                :value="item.storeId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('order_ruleCode') + ':'" prop="ruleCode">
            <el-input v-model="searchForm.ruleCode" name="searchForm_ruleCode" />
          </ody-search-item>
          <ody-search-item :label="$t('order_ruleName') + ':'" prop="ruleName">
            <el-input v-model="searchForm.ruleName" name="searchForm_ruleName" />
          </ody-search-item>
          <ody-search-item :label="$t('orderRule_label_watchNode') + ':'" prop="ruleNode">
            <el-select v-model="searchForm.ruleNode" :placeholder="$t('common_all')" name="searchForm_ruleNode">
              <el-option
                v-for="item in watchNode"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('timeoutAlertTime') + ':'" :space="2" class="register" prop="createTime">
            <ody-date-range-picker
              v-model="searchForm.createTime"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="searchForm_createTime"
              value-format="yyyy-MM-dd"
              type="datetimer"
              range-separator="-"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <ody-button name="OmsTimeoutAlertList_Reset_handleSearchReset" code="OmsTimeoutAlertList_Reset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</ody-button>
        <ody-button
          name="OmsTimeoutAlertList_Query_handleSearchSubmit"
          code="OmsTimeoutAlertList_Query"
          size="small"
          type="primary"
          @click="handleSearchSubmit"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <keep-alive>
      <component
        :is="currentTab.includeFile"
        :current-tab.sync="currentTab"
        :loading="loading"
        @updateList="updateList"
      />
    </keep-alive>
  </section>
</template>

<script>
import orderTableList from '@/components/timeoutAlert/orderAlertTabCon'
import errorTableList from '@/components/timeoutAlert/errorAlertTabCon'
import returnTableList from '@/components/timeoutAlert/returnAlertTabCon'

export default {
  name: 'OmsTimeoutAlertList',
  components: {
    orderTableList,
    errorTableList,
    returnTableList
  },
  data() {
    return {
      // view:'orderTableList',
      visible: false,
      selectedItem: null,
      merchants: [],
      stores: [],
      // allChannels: {},
      timeoutAlertNodeMap: [],
      subCodeMap: {},
      watchNode: [],
      // area_list: [],
      // activeState: '1',
      currentTab: {},
      searchForm: getDefaultSearchForm(),
      loading: false,
      tabList: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      }
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
    async handleTabsClick() {
      try {
        this.currentTab = this.tabList[this.activeState]
        this.ruleType = this.currentTab.index
        await this.switchType(this.ruleType)
        await this.reCountByType(this.currentTab)
        this.searchForm = getDefaultSearchForm()
        this.page = {
          size: 10,
          current: 1,
          total: 0
        }
        await this.updateList(this.page)
      } catch (ex) {
        console.log(ex)
      }
    },
    async switchType(ruleType) {
      if (ruleType) {
        this.watchNode = this.subCodeMap[ruleType]
      } else {
        this.watchNode = []
      }
      console.log(ruleType)
    },
    async updateList(page) {
      try {
        this.loading = true
        if (page) {
          this.page = page
        }
        await loadList(this)
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
      this.stores = []
    },
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    _initMerchants() {
      this.$oms.$api.common
        .merchantList({ currentPage: 1, itemsPerPage: 1000 })
        .then(data => {
          this.merchants = data.data.listObj
        })
    },
    switchMerchant() {
      if (this.searchForm.merchantId) {
        this.$oms.$api.common
          .merchantStoreList({ merchantId: this.searchForm.merchantId })
          .then(data => {
            if (data.data && data.data.listObj) {
              this.stores = data.data.listObj
            } else {
              this.stores = []
            }
          })
      } else {
        this.stores = []
      }
    },
    _initCodes() {
      this.$oms.$api.common
        .listByCategorysForOrder({
          categorys: [
            'timeout_alert_type',
            'timeout_alert_node',
            'return_type',
            'so_error_error_type',
            'so_error_type',
            'so_error_reason',
            'order_status'
          ]
        })
        .then(data => {
          this.timeoutAlertNodeMap = data.data.timeout_alert_node.reduce(
            (m, i) => {
              m[i.code] = i.name
              return m
            },
            {}
          )
          this.orderStatusDicts = data.data.order_status.reduce((m, i) => {
            m[i.code] = i.name
            return m
          }, {})
          this.returnTypeDicts = data.data.return_type.reduce((m, i) => {
            m[i.code] = i.name
            return m
          }, {})
          this.soErrorErrorTypeDicts = data.data.so_error_error_type.reduce(
            (m, i) => {
              m[i.code] = i.name
              return m
            },
            {}
          )
          this.soErrorTypeDicts = data.data.so_error_type.reduce((m, i) => {
            m[i.code] = i.name
            return m
          }, {})
          this.soErrorReasonDicts = data.data.so_error_reason.reduce((m, i) => {
            m[i.code] = i.name
            return m
          }, {})
          return data.data.timeout_alert_node.forEach(item => {
            if (item.parentCode) {
              let subItems = this.subCodeMap[item.parentCode]
              if (!subItems) {
                subItems = []
                this.subCodeMap[item.parentCode] = subItems
              }
              subItems.push(item)
            }
          })
        })
        .then(data => {
          this.switchType(1)
        })
    },
    reCountByType(tab) {
      const lastWeekDate = formatDateTime(
        new Date(new Date().setDate(new Date().getDate() - 7))
      )
      this.$oms.$api.timeoutAlert
        .timeoutAlertCountByType({
          ruleType: tab.index,
          startCreateTime: lastWeekDate
        })
        .then(data => {
          if (data.data) {
            tab.count = data.data
          } else {
            tab.count = 0
          }
        })
    },
    _initTabAlertCount() {
      this.tabList.forEach(item => {
        this.reCountByType(item)
      })
    },
    _initTabList() {
      this.tabList = [
        {
          index: 1,
          heading: this.$t('订单超时预警'),
          count: 0,
          includeFile: 'orderTableList',
          list: []
        },
        {
          index: 2,
          heading: this.$t('售后超时预警'),
          count: 0,
          includeFile: 'returnTableList',
          list: []
        },
        {
          index: 3,
          heading: this.$t('异常事件超时预警'),
          count: 0,
          includeFile: 'errorTableList',
          list: []
        }
      ]
      this.currentTab = this.tabList[0]
    },
    init() {
      this._initTabList()
      this._initTabAlertCount()
      this._initCodes()
      this._initMerchants()
      this.updateList()
    }
  }
}

async function loadList(vue) {
  const filters = JSON.parse(JSON.stringify(vue.searchForm))
  if (filters.createTime) {
    filters.startCreateTime = filters.createTime[0]
    filters.endCreateTime = filters.createTime[1]
    delete filters.createTime
  }
  filters.ruleType = vue.currentTab.index
  const param = {
    filters: filters,
    limit: vue.page.size,
    page: vue.page.current
  }
  const timeoutAlert = vue.$oms.$api.timeoutAlert

  const res = await timeoutAlert.timeoutAlertListPage(param)
  if (res) {
    let data = []
    if (res.data) {
      data = res.data
    }
    vue.currentTab.list = data
    vue.currentTab.list.forEach(item => {
      if (item.createTime) {
        const createTime = new Date(item.createTime)
        const dateTime = new Date().getTime() - createTime.getTime() // 时间差的毫秒数
        // 计算出相差分钟数
        const times = Math.floor(dateTime / (60 * 1000))
        item.timeout = times + vue.$t('orderRule_label_minutes')
      }
      if (item.extInfo) {
        item.extInfo = JSON.parse(item.extInfo)
      }
      if (item.ruleNode) {
        item.ruleNodeStr = vue.timeoutAlertNodeMap[item.ruleNode]
      }
      if (item.extInfo.orderStatus) {
        item.orderStatusStr = vue.orderStatusDicts[item.extInfo.orderStatus]
      }
      if (item.extInfo.errorObject) {
        item.soErrorTypeStr = vue.soErrorTypeDicts[item.extInfo.errorObject]
      }
      if (item.extInfo.errorType) {
        item.errorTypeStr = vue.soErrorErrorTypeDicts[item.extInfo.errorType]
      }
      if (item.extInfo.errorReason) {
        item.errorReasonStr = vue.soErrorReasonDicts[item.extInfo.errorReason]
      }
      if (item.extInfo.returnType) {
        item.returnTypeStr = vue.returnTypeDicts[item.extInfo.returnType]
      }
    })
    vue.currentTab.total = res.total
  }
}

function getDefaultSearchForm() {
  return Object.assign(
    {},
    {
      createTime: [
        formatDateTime(new Date(new Date().setDate(new Date().getDate() - 7))),
        formatDateTime(new Date())
      ]
    }
  )
}
// 格式化日期
function formatDateTime(date) {
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  var d = date.getDate()
  d = d < 10 ? '0' + d : d
  return y + '-' + m + '-' + d
}
</script>

<style lang="scss" scoped>
.timeoutAlert-html .cp-box {
  box-shadow: none;
}
.el-tabs__header {
  margin-bottom: 0px !important;
}
.el-tabs .el-tabs__active-bar {
  margin-right: 30px;
}
.tabsss {
  background-color: #fff;
  padding-top: 5px;
  padding-left: 15px;
  padding-right: 15px;
}
</style>
