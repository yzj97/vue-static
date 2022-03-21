<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('common_merchant_name') + ':'" prop="merchantName">
            <el-input
              v-model="searchForm.merchantName"
              :placeholder="$t('common_choose_please')"
              name="searchForm_merchantName"
              readonly="true"
              @click.native="showMerchantSelectModal"
            />
          </ody-search-item>
          <ody-search-item :label="$t('purchase_plan_type') + ':'" prop="planType">
            <el-select v-model="searchForm.planType" name="searchForm_planType">
              <el-option :label="$t('common_status_all') + ':'" />
              <el-option
                v-for="item in planTypes"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('purchase_plan_filed_code') + ':'" prop="planCode">
            <el-input v-model="searchForm.planCode" name="searchForm_planCode" />
          </ody-search-item>
          <ody-search-item :label="$t('execution_status') + ':'" prop="executionStatus">
            <el-select v-model="searchForm.executionStatus" name="searchForm_executionStatus">
              <el-option :label="$t('common_status_all') + ':'" />
              <el-option
                v-for="item in executionStatus"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('plan_start_date') + ':'" class="register" prop="planStartDate">
            <ody-date-range-picker
              v-model="searchForm.planStartDate"
              :show-button="false"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              type="datetimer"
              name="searchForm_planStartDate"
              value-format="yyyy-MM-dd"
              range-separator="-"/>
              <!-- <el-date-picker
              v-model="searchForm.planStartDate"
              name="searchForm_planStartDate"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
            /> -->
          </ody-search-item>
          <ody-search-item
            v-if="platformId === 2"
            :label="$t('purchase_plan_filed_merchant_approval_status') + ':'"
            prop="merchantApprovalStatus">
            <el-select
              v-model="searchForm.merchantApprovalStatus"
              name="searchForm_merchantApprovalStatus"
            >
              <el-option :label="$t('common_status_all') + ':'" />
              <el-option
                v-for="item in merchantApprovalStatus"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item
            v-else-if="platformId === 1"
            :label="$t('purchase_plan_filed_platform_approval_status') + ':'"
            prop="platformApprovalStatus">
            <el-select
              v-model="searchForm.platformApprovalStatus"
              name="searchForm_platformApprovalStatus"
            >
              <el-option :label="$t('common_status_all')" />
              <el-option
                v-for="item in platformApprovalStatus"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('plan_end_date') + ':'" class="register" prop="planExpiryDate">
            <ody-date-range-picker
              v-model="searchForm.planExpiryDate"
              :show-button="false"
              type="date"
              name="searchForm_planExpiryDate"
              value-format="yyyy-MM-dd">range-separator="-"/></ody-date-range-picker>
              <!-- <el-date-picker
              v-model="searchForm.planExpiryDate"
              name="searchForm_planExpiryDate"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
            /> -->
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button
          name="handleSearchReset"
          size="small"
          @click="handleSearchReset"
        >{{ $t('common_reset') }}</el-button>
        <ody-button
          name="OpmsPurchasePlanList01_handleSearchSubmit"
          code="OpmsPurchasePlanList01"
          size="small"
          type="primary"
          @click="handleSearchSubmit"
        >{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          v-if="canAdd(platformId)"
          name="OpmsPurchasePlanList03_addPurchasePlan"
          code="OpmsPurchasePlanList03"
          size="small"
          type="primary"
          @click="addPurchasePlan"
        >{{ $t('common_create') }}</ody-button>
        <ody-button
          v-if="canAdd(platformId)"
          name="OpmsPurchasePlanList05_batchDelete"
          code="OpmsPurchasePlanList05"
          size="small"
          @click="batchDelete"
        >{{ $t('批量删除') }}</ody-button>
        <ody-button
          name="OpmsPurchasePlanList02_handleExport"
          code="OpmsPurchasePlanList02"
          size="small"
          @click="handleExport"
        >{{ $t('common_export') }}</ody-button>
      </div>
      <div slot="tabs">
        <el-tabs v-model="activeName" name="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('common_status_all') + ':'" name="-1" />
          <el-tab-pane v-for="tab in tabs" :label="tab.heading" :name="tab.code" :key="tab.index" />
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :multiple="true"
          :checked.sync="checked"
          :selectable="checkedSelectable"
          :can-filter="false"
          name="list734"
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
          @current-change="handlePageCurrentChange"
        />
      </div>
    </ody-list-table-area>

    <MerchantSelectModal :visible.sync="showMerchantModal" @ok="selectMerchant" />
    <AuditModal
      :visible.sync="showAuditModal"
      :merchant-code.sync="selectedItem.id"
      :plan-code.sync="selectedItem.planCode"
      @audit="handleAudit"
    />
    <SureModal
      :sure-modal-visible.sync="showSureModal"
      :merchant-code.sync="selectedItem.id"
      :plan-code.sync="selectedItem.planCode"
      @audit="handleAudit"
    />
    <EnquiryModal
      :visible.sync="showEnquiryModal"
      :plan-code.sync="selectedItem.planCode"
      @ok="passEnquiry"
    />
  </section>
</template>

<script>
import purchasePlanDetail from '@/views/purchasePlan/plan/detail/index.vue'
import MerchantSelectModal from '@/components/merchantModal'
import AuditModal from '@/components/purchase/plan/auditModal'
import SureModal from '@/components/purchase/plan/sureModal'
import EnquiryModal from '@/components/purchase/plan/enquiryModal'
import dateUtil from '@/utils/dateUtil'
import { mapGetters } from 'vuex'

export default {
  name: 'OpmsPurchasePlanList',
  components: {
    purchasePlanDetail,
    MerchantSelectModal,
    AuditModal,
    SureModal,
    EnquiryModal
  },
  data() {
    const self = this
    return {
      activeName: '-1',
      showMerchantModal: false,
      showAuditModal: false,
      showSureModal: false,
      showEnquiryModal: false,
      selectedItem: {},
      searchForm: {},
      loading: false,
      tabs: [],
      planTypes: [],
      executionStatus: [],
      merchantApprovalStatus: [],
      platformApprovalStatus: [],
      platformId: null,
      list: [],
      checked: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('common_merchant_name'),
          align: 'center'
        },
        {
          show: true,
          prop: 'planCode',
          label: this.$t('purchase_plan_filed_code'),
          align: 'center',
          render: (h, params) => {
            return (
              <a
                on-click={() => {
                  if (this.$portal.hasPermission('OpmsPurchasePlanDetail')) {
                    this.forwardToDetail(params.row)
                  }
                }}
              >
                <span style={'color:#1890FF'}>{params.row.planCode}</span>
              </a>
            )
          }
        },
        {
          show: true,
          prop: 'planTypeText',
          label: this.$t('purchase_plan_type'),
          align: 'center'
        },
        {
          show: true,
          prop: 'planStartDate',
          label: this.$t('plan_start_date'),
          align: 'center',
          minWidth: 88,
          formatter: (row, column, cellValue) => {
            return dateUtil.dateFormatForTime(row.planStartDate, false)
          }
        },
        {
          show: true,
          prop: 'planExpiryDate',
          label: this.$t('plan_end_date'),
          align: 'center',
          minWidth: 88,
          formatter: (row, column, cellValue) => {
            return dateUtil.dateFormatForTime(row.planExpiryDate, false)
          }
        },
        {
          show: (index, row) => {
            return self.platformId === 2
          },
          prop: 'merchantApprovalStatusText',
          label: this.$t('purchase_plan_filed_merchant_approval_status'),
          align: 'center'
        },
        {
          show: (index, row) => {
            return self.platformId === 1
          },
          prop: 'platformApprovalStatusText',
          label: this.$t('purchase_plan_filed_platform_approval_status'),
          align: 'center'
        },
        {
          show: true,
          prop: 'executionStatusText',
          label: this.$t('execution_status'),
          align: 'center'
        },
        {
          show: true,
          prop: 'createTimeText',
          label: this.$t('common_createTime'),
          align: 'center'
        },
        {
          show: true,
          prop: 'createUsername',
          label: this.$t('common_time_createUser'),
          align: 'center'
        }
      ],
      operates: {
        fixed: 'right',
        align: 'center',
        minWidth: 200,
        list: [
          {
            label: this.$t('common_edit'),
            code: 'OpmsPurchasePlanList04',
            method(index, row) {
              self.goToDetail(row.id, true)
            },
            hidden(index, row) {
              return self.hiddenEdit(row, self.platformId)
            }
          },
          {
            label: this.$t('plan_sure'),
            code: 'OpmsPurchasePlanList08',
            method(index, row) {
              self.selectedItem = row
              self.showSureModal = true
            },
            disabled: false,
            hidden: (index, row) => {
              if (self.platformId === 1 && row.executionStatus === 2) {
                return false
              }
              return true
            }
          },
          {
            label: this.$t('common_delete'),
            code: 'OpmsPurchasePlanList05',
            method: (index, row) => {
              self.handleDelete([row.id])
            },
            hidden: (index, row) => {
              return self.hiddenDeleteOrSubmit(row, self.platformId)
            }
          },
          {
            label: this.$t('common_submit'),
            code: 'OpmsPurchasePlanList06',
            method: (index, row) => {
              self.handleSubmitPlan(row.id)
            },
            hidden: (index, row) => {
              return self.hiddenDeleteOrSubmit(row, self.platformId)
            }
          },
          {
            label: this.$t('common_audit'),
            code: 'OpmsPurchasePlanList07',
            method: (index, row) => {
              this.selectedItem = row
              this.showAuditModal = true
            },
            disabled: false,
            hidden: (index, row) => {
              if (self.platformId === 1 && row.executionStatus === 4) {
                return !(row.platformApprovalStatus === 1)
              } else if (self.platformId === 2 && row.executionStatus === 1) {
                return !(row.merchantApprovalStatus === 1)
              } else {
                return true
              }
            }
          },
          {
            label: this.$t('purchase_plan_button_enquiry'),
            code: 'OpmsPurchasePlanList09',
            method: (index, row) => {
              self.selectedItem = row
              self.handleEnquiryPlan()
            },
            hidden: (index, row) => {
              return self.hiddenEnquiry(row, self.platformId)
            }
          },
          {
            label: this.$t('supplier_attach_type_qualification'),
            code: 'OpmsPurchasePlanList10',
            method: (index, row) => {
              // 资质证书
              goCertificate(row.id)
            },
            hidden: (index, row) => {
              return self.hiddenEnquiry(row, self.platformId)
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['functions'])
  },
  async mounted() {
    try {
      const vue = this
      vue.initPlatformId().then(() => {
        vue.init()
      })
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    handleClick(tab, event) {
      this.activeName = tab.name
      this.updateList()
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
    },
    handleExport() {
      const filters = this.getFilters()
      this.$portal.downloadFileByPost(
        '/api/opms-web/purchasePlan/export.do',
        filters
      )
    },
    handlePageSizeChange() {
      this.handleSearchSubmit()
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleAudit(result) {
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
    addPurchasePlan() {
      this.$router.push({ name: 'OpmsPurchasePlanAdd' })
    },
    forwardToDetail(row) {
      this.$router.push({
        name: 'OpmsPurchasePlanDetail',
        params: { id: row.id }
      })
    },
    batchDelete() {
      if (this.checked && this.checked.length > 0) {
        const ids = []
        for (let i = 0; i < this.checked.length; i++) {
          const item = this.checked[i]
          if (
            item.merchantApprovalStatus === 0 ||
            item.merchantApprovalStatus === 4
          ) {
            ids.push(item.id)
          } else {
            this.$message({
              type: 'warning',
              message: this.$t('purchase_plan_delete_submited_failed')
            })
            return
          }
        }
        if (ids && ids.length > 0) {
          this.handleDelete(ids)
        }
      } else {
        this.$message.info(this.$t('请选择'))
      }
    },
    handleDelete(ids) {
      this.$confirm(
        this.$t('common_msg_confirm_delete'),
        this.$t('common_msg_delete'),
        {
          confirmButtonText: this.$t('common_confirm'),
          cancelButtonText: this.$t('common_cancel'),
          type: 'warning'
        }
      ).then(() => {
        this.$opms.$api.purchasePlan
          .deletePurchasePlan({ ids: ids })
          .then(result => {
            if (result && result.code === '0') {
              this.$message({
                type: 'success',
                message: this.$t('supplier_classification_delete_success')
              })
              this.updateList()
            }
          })
      })
    },
    handleSubmitPlan(id) {
      this.$opms.$api.purchasePlan
        .submitPurchasePlan({ id: id })
        .then(result => {
          if (result && result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('common_update_success')
            })
            this.updateList()
          }
        })
    },
    handleEnquiryPlan() {
      this.showEnquiryModal = true
    },
    goToDetail(id, isEdit) {
      this.$router.push({
        name: 'OpmsPurchasePlanEdit',
        params: {
          id: id
        }
      })
    },
    hiddenEdit(row, platformId) {
      if (platformId === 1) {
        if (row.executionStatus === 2) {
          return false
        }
        return true
      } else if (platformId === 2) {
        return !(
          row.merchantApprovalStatus === 0 || row.merchantApprovalStatus === 4
        )
      }

      return false
    },
    canAdd(platformId) {
      if (platformId === 2) {
        return true
      }
      return false
    },
    hiddenDeleteOrSubmit(row, platformId) {
      if (platformId === 2) {
        return !(
          row.merchantApprovalStatus === 0 || row.merchantApprovalStatus === 4
        )
      }
      return true
    },
    hiddenEnquiry(row, platformId) {
      if (platformId === 1) {
        return !(row.executionStatus === 3)
      }
      return true
    },
    auditShow(row) {
      return !(row.executionStatus === 1 || row.executionStatus === 4)
    },
    initCodes() {
      const vue = this
      this.$opms.$api.code
        .listMulti({
          categories: [
            'PLAN_TYPE',
            'EXECUTION_STATUS',
            'MERCHANT_APPROVAL_STATUS',
            'PLATFORM_APPROVAL_STATUS'
          ]
        })
        .then(data => {
          if (data.data.PLAN_TYPE) {
            vue.planTypes = data.data.PLAN_TYPE
          }
          if (data.data.EXECUTION_STATUS) {
            const executionStatus = data.data.EXECUTION_STATUS
            if (vue.platformId === 1) {
              for (const index in executionStatus) {
                const item = executionStatus[index]
                if (item.code !== '0' && item.code !== '1') {
                  vue.executionStatus.push(item)
                }
              }
            } else {
              vue.executionStatus = data.data.EXECUTION_STATUS
            }
          }
          if (data.data.MERCHANT_APPROVAL_STATUS) {
            vue.merchantApprovalStatus = data.data.MERCHANT_APPROVAL_STATUS
            if (vue.platformId === 2) {
              for (let i = 0; i < vue.merchantApprovalStatus.length; i++) {
                const item = vue.merchantApprovalStatus[i]
                vue.tabs.push({
                  heading: item.name,
                  index: i,
                  code: item.code
                })
              }
            }
          }
          if (data.data.PLATFORM_APPROVAL_STATUS) {
            vue.platformApprovalStatus = data.data.PLATFORM_APPROVAL_STATUS
            if (vue.platformId === 1) {
              for (let i = 0; i < vue.platformApprovalStatus.length; i++) {
                const item = vue.platformApprovalStatus[i]
                vue.tabs.push({
                  heading: item.name,
                  index: i,
                  code: item.code
                })
              }
            }
          }
        })
    },
    async initPlatformId() {
      const vue = this
      const result = await vue.$opms.$api.common.getDomainInfo()

      if (result.data && result.code === '0') {
        vue.platformId = result.data.platformId
      }

      return Promise.resolve()
    },
    init() {
      this.initCodes()
      this.updateList()
    },
    showMerchantSelectModal() {
      this.showMerchantModal = true
    },
    selectMerchant(result) {
      if (result) {
        this.searchForm.merchantCode = result.merchantCode
        this.searchForm.merchantId = result.merchantId
        this.searchForm.merchantName = result.merchantName
      }
    },
    passEnquiry(result) {
      const selectedItem = this.selectedItem
      this.$opms.$api.purchasePlan
        .enquiryPurchasePlan({
          id: selectedItem.id,
          planCode: selectedItem.planCode,
          remark: result.remark
        })
        .then(result => {
          if (result && result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('common_update_success')
            })
            this.updateList()
          }
        })
    },
    getFilters() {
      const vue = this
      const filters = JSON.parse(JSON.stringify(vue.searchForm))
      if (filters.planStartDate) {
        filters.startPlanStartDate = filters.planStartDate[0]
        filters.endPlanStartDate = filters.planStartDate[1]
        delete filters.planStartDate
      }
      if (filters.planExpiryDate) {
        filters.startPlanExpiryDate = filters.planExpiryDate[0]
        filters.endPlanExpiryDate = filters.planExpiryDate[1]
        delete filters.planExpiryDate
      }
      if (vue.platformId === 2) {
        if (vue.activeName !== '-1') {
          filters.merchantApprovalStatus = vue.activeName
        }
      }
      if (vue.platformId === 1) {
        if (vue.activeName !== '-1') {
          filters.platformApprovalStatus = vue.activeName
        }
        filters.merchantApprovalStatus = 3
      }
      return filters
    },
    checkedSelectable(row, index) {
      return (
        row.merchantApprovalStatus === 0 || row.merchantApprovalStatus === 4
      )
    }
  }
}

async function loadList(vue) {
  const param = {
    filters: vue.getFilters(),
    limit: vue.page.size,
    page: vue.page.current
  }
  const purchasePlan = vue.$opms.$api.purchasePlan

  const res = await purchasePlan.purchasePlanListPage(param)
  if (res) {
    const data = res.data
    vue.list = data
    vue.page.total = res.total
  }
}
function getDefaultSearchForm() {
  return {}
}

function goCertificate(purchasePlanId) {
  // 采购计划资质证书
  location.href =
    '/#/opms-web/purchasePlan/certificate/items?purchasePlanId=' +
    purchasePlanId
}
</script>

<style scoped>
</style>
