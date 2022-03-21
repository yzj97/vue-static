<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('common_product_category') + ':'" prop="categoryNameList">
            <!--  <ody-tree-select
              v-model="categoryNameList"
              :multiple="true"
              :append-to-body="true"
              :options="categoryTreeData"
              :placeholder="$t('please_choose_the_category') + ':'"
              name="categoryNameList"
              value-consists-of="LEAF_PRIORITY"
            />-->
            <ody-tree-select
              :normalizer="normalizer"
              :append-to-body="true"
              :z-index="10000"
              v-model="categoryNameList"
              :multiple="true"
              :async="isAsync"
              :options="categoryTreeData"
              :load-options="isAsync ? queryBackedRootCategory : null"
              :default-options="isAsync"
              :default-expand-level="9999"
              no-results-text="未查询出结果"
              no-options-text="没有可用的选项"
              search-prompt-text="请搜索你想选择的商品类目"
              open-on-focus
              name="queryParam_categoryIds"
              value-consists-of="LEAF_PRIORITY"
              @open="treeOpen"
              @search-change="searchChange"
            />

          </ody-search-item>
          <ody-search-item :label="$t('common_merchant_name') + ':'" prop="merchantId">
            <ody-merchant-choose
              v-model="searchForm.merchantId"
              :selected.sync="selected"
              :placeholder="$t('please_choose')"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="searchForm_merchantId"
              value-key="merchantId"
            />
          </ody-search-item>
          <!-- <ody-search-item :label="$t('common_merchant_code')" prop="merchantCode">
            <el-input v-model="searchForm.merchantCode" name="searchForm_merchantCode" />
          </ody-search-item>-->
          <ody-search-item :label="$t('申请时间') + ':'" :space="2" type="text" prop="createTime">
            <ody-date-range-picker
              v-model="searchForm.createTime"
              name="searchForm_createTime"
              value-format="yyyy-MM-dd"
              type="datetimer"
              range-separator="-"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button
          name="handleSearchReset"
          size="small"
          @click="handleSearchReset"
        >{{ $t("重置") }}</el-button
        >
        <ody-button
          name="MerchantCategoryListQuery_handleSearchSubmit"
          size="small"
          type="primary"
          code="MerchantCategoryListQuery"
          @click="handleSearchSubmit"
        >{{ $t("查询") }}</ody-button
        >
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="MerchantCategoryBatchAudit_batchAudit"
          size="small"
          type="primary"
          code="MerchantCategoryBatchAudit"
          @click="batchAudit"
        >{{ $t("batchAudit") }}</ody-button
        >
      </div>
      <div slot="tabs">
        <el-tabs
          v-model="activeState"
          name="activeState"
          @tab-click="onTabClick"
        >
          <el-tab-pane
            v-for="(tab, index) in tabs"
            :label="tab.label"
            :key="index"
          >
            <div slot="label">
              {{ tab.label }} {{ tab.count !== undefined ? '(' + (tab.count || 0) + ')' : "" }}
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :checked.sync="table.checked"
          :multiple="true"
          :columns="table.columns"
          :operates="table.operates"
          :selectable="checkedSelectable"
          request-url="/back-product-web/back/mp/categoryApply/listCategoryAudit.do"
        />
      </div>
    </ody-list-table-area>

    <MerchantCategoryAuditModal
      :visible.sync="showMerchantCategoryModalVisible"
      :ids.sync="categoryApplyIds"
      @ok="updateLabelTable"
    />
  </section>
</template>

<script>
import MerchantCategoryAuditModal from '@/components/merchantCategoryAuditModal'
import { mapGetters } from 'vuex'

export default {
  name: 'MerchantCategory',
  components: {
    MerchantCategoryAuditModal
  },
  data() {
    const self = this
    return {
      searchForm: {
        merchantId: null,
        createTime: [],
        status: null,
        categoryIds: []
      },
      activeName: '-1',
      loading: false,
      showMerchantCategoryModalVisible: false,
      tabs: [],
      currentTab: null,
      list: [],
      auditStatus: [],
      categoryTreeData: [],
      categoryNameList: [],
      categoryApplyIds: [],
      isAsync: false,
      categorySearchKey: '',
      table: {
        columns: [
          {
            show: true,
            prop: 'fullNamePath',
            label: this.$t('common_product_category'),
            align: 'left',
            minWidth: 200,
            render: (h, params) => {
              return (
                <a
                  on-click={() => {
                    if (this.$portal.hasPermission('MerchantCategoryView')) {
                      this.forwardToDetail(params.row)
                    }
                  }}
                >
                  <span style={'color:#1890FF'}>{params.row.fullNamePath}</span>
                </a>
              )
            }
          },
          {
            show: true,
            prop: 'merchantName',
            label: this.$t('common_merchant_name'),
            align: 'left',
            minWidth: 200
          },
          {
            show: true,
            prop: 'merchantCode',
            label: this.$t('common_merchant_code'),
            align: 'left',
            minWidth: 200
          },
          {
            show: true,
            prop: 'createTimeStr',
            label: this.$t('申请时间'),
            align: 'left',
            minWidth: 200
          },
          {
            show: true,
            prop: 'auditStatusText',
            label: this.$t('common_audit_status'),
            align: 'left',
            render: (h, params) => {
              if (params.row.status === 3) {
                const nameLabel = this.$t('审核账号')
                const updateUsername = params.row.updateUsername
                const auditInfo = updateUsername
                  ? nameLabel + '：' + updateUsername
                  : ''
                var self = this
                return (
                  <span>
                    <sapn style={'color:red'}>
                      {params.row.auditStatusText}
                    </sapn>
                    <el-tooltip effect={'dark'} placement={'top'}>
                      <div slot={'content'}>
                        <div>
                          <div>{auditInfo}</div>
                          <span>{self.$t('审核时间')}：</span>
                          <span>{params.row.updateTimeStr}</span>
                          <br />
                          <span>{self.$t('拒绝原因')}：</span>
                          <span>{params.row.message}</span>
                        </div>
                      </div>
                      <i class={'el-icon-question'} />
                    </el-tooltip>
                  </span>
                )
              } else {
                return <sapn>{params.row.auditStatusText}</sapn>
              }
            }
          }
        ],
        operates: {
          fixed: 'right',
          align: 'left',
          list: [
            {
              label: this.$t('commonReview'),
              method(index, row) {
                self.auditInfo(row.id)
              },
              hidden(index, row) {
                // 待提交状态
                return row.status !== 1
              },
              code: 'MerchantCategoryAudit'
            }
          ]
        },
        checked: []
      }
    }
  },
  computed: {
    ...mapGetters(['functions'])
  },
  async mounted() {
    this.tabs = [
      {
        label: this.$t('全部')
      }
    ]
    this.currentTab = this.tabs[0]
    await this._initCodes()
    await this.getQueryBackedRootCategory()
    await this.updateList()
    this.queryCount()
  },
  methods: {
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    checkedSelectable(row, index) {
      return row.status === 1
    },
    onTabClick() {
      for (var i = 0; i < this.tabs.length; i++) {
        if (i.toString() === this.activeState) {
          this.currentTab = this.tabs[i]
          break
        }
      }
      this.updateList()
    },
    async handleSearchSubmit() {
      await this.updateList()
      this.queryCount()
    },
    handleSearchReset() {
      this.categoryNameList = []
      this.searchForm = {
        merchantId: null,
        createTime: [],
        status: null,
        categoryIds: []
      }
    },
    async updateList() {
      const {
        createTime: [createTimeStart, createTimeEnd],
        ...params
      } = this.searchForm
      if (this.categoryNameList.length > 0) {
        params.categoryIds = this.categoryNameList
      }
      params.status = this.currentTab.status
      params.createTimeStart = createTimeStart
      params.createTimeEnd = createTimeEnd
      this.table.checked = []
      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    },
    auditInfo(id) {
      this.categoryApplyIds = []
      this.categoryApplyIds.push(id)
      this.showMerchantCategoryModalVisible = true
    },
    batchAudit() {
      this.categoryApplyIds = []
      if (this.table.checked && this.table.checked.length > 0) {
        const ids = []
        for (let i = 0; i < this.table.checked.length; i++) {
          const item = this.table.checked[i]
          console.info(item)
          if (item.status === 1) {
            ids.push(item.id)
          } else {
            this.$message({
              type: 'warning',
              message: this.$t('商家类目状态不正确')
            })
            return
          }
        }
        if (ids && ids.length > 0) {
          this.categoryApplyIds = ids
          this.showMerchantCategoryModalVisible = true
        }
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('back_web_please_choose_record')
        })
        return
      }
    },
    // 查询后台类目树根节点
    async queryBackedRootCategory({ searchQuery: name, callback }) {
      return this.$product.$api.mpApi.listBackCategoryTree({ name }).then(async(res) => {
        let newData = []
        if (res.data !== null) {
          newData = await this.remoteChildrenNull([res.data])
        }
        callback(null, newData)
      })
    },

    async getQueryBackedRootCategory() {
      return this.$product.$api.mpApi.listBackCategoryTree({ name: this.categorySearchKey }).then(async(res) => {
        let newData = []
        if (res.data !== null) {
          newData = await this.remoteChildrenNull([res.data])
        }

        this.categoryTreeData = newData
      })
    },

    remoteChildrenNull(data = []) {
      data.forEach(item => {
        if (item.children === null) {
          delete item.children
        } else {
          if (item.children && item.children.length) {
            item.children = this.remoteChildrenNull(item.children)
          } else {
            delete item.children
          }
        }
      })

      return data
    },
    treeOpen() {
      this.isAsync = true
    },
    searchChange(searchQuery) {
      this.categorySearchKey = searchQuery
      this.getQueryBackedRootCategory()
    },
    forwardToDetail(row) {
      this.$router.push({
        name: 'MerchantCategoryDetail',
        params: { id: row.id }
      })
    },
    async updateLabelTable() {
      await this.updateList()
      this.queryCount()
    },
    async _initCodes() {
      const vue = this
      this.$product.$api.common
        .listMultiCode({ categorys: ['AUDIT_STATUS'] })
        .then(data => {
          if (data.code === '0') {
            vue.auditStatus = data.data.AUDIT_STATUS
            for (var i in vue.auditStatus) {
              if (typeof vue.auditStatus[i] === 'string') {
                vue.tabs.push({
                  status: i,
                  label: vue.auditStatus[i],
                  count: null
                })
              }
            }
          }
        })
    },
    async queryCount() {
      const {
        createTime: [createTimeStart, createTimeEnd],
        ...params
      } = this.searchForm
      if (this.categoryNameList.length > 0) {
        params.categoryIds = this.categoryNameList
      }
      params.createTimeStart = createTimeStart
      params.createTimeEnd = createTimeEnd
      params.status = null
      const data = await this.$product.$api.mpApi.countCategoryAuditByStatus(
        params
      )
      const counts = data.data.reduce((r, i) => {
        r[i.status] = i.count
        return r
      }, {})
      this.tabs.forEach(element => {
        if (element.status !== undefined) {
          element.count = counts[element.status] || 0
        }
      })
    }
  }
}

/* function toTree(data) {
  data.forEach(function(item) {
    delete item.children
  })
  var map = {}
  data.forEach(function(item) {
    map[item.id] = item
  })
  var val = []
  data.forEach(function(item) {
    var parent = map[item.parentId]
    item.label = item.name
    if (parent) {
      if (parent.children) {
        parent.children.push(item)
      } else {
        parent.children = [item]
      }
    } else {
      val.push(item)
    }
  })
  return val
}*/
</script>

<style scoped>
</style>
