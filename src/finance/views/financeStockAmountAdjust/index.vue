<template>
  <section id="stock-amount-adjust">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="150px" class="form">
          <!-- <ody-search-item v-if="merchantList.length prop="merchantIndex">1" :label="$t('common_merchant_name') + ':'"> -->
          <!-- <el-select v-model="merchantIndex" :placeholder="$t('common_choose_please')" name="merchantIndex">
              <el-option
                v-for="(item,index) in merchantList"
                :key="index"
                :label="item.merchantName"
                :value="index"/>
            </el-select> -->
          <!-- </ody-search-item> -->
          <ody-search-item :label="$t('common_merchant_name') + ':'" prop="merchantName">
            <el-input v-model="merchantName" name="merchantName" maxlength="25" readonly="readonly" @focus="showMerchantModal"/>
          </ody-search-item>

          <ody-search-item :label="$t('stockAmountAdjustCode') + ':'" prop="stockAmountAdjustCode"><!--调整单号-->
            <el-input v-model="stockAmountAdjustCode" name="stockAmountAdjustCode"/>
          </ody-search-item>
          <ody-search-item :label="$t('approvalStatus') + ':'" prop="approvalStatus"><!--单据状态-->
            <el-select v-model="approvalStatus" :placeholder="$t('common_choose_please')" name="approvalStatus">
              <el-option :label="$t('common_all')" :value="'-1'"/>
              <el-option
                v-for="item in approvalStatusList"
                :key="item.code"
                :label="item.name"
                :value="item.code"/>
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('common_create_time') + ':'" prop="createTimes">
            <ody-date-range-picker
              v-model="createTimes"
              :show-button="false"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="createTimes"
              type="datetimer"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset()">{{ $t('common_reset') }}</el-button>
        <ody-button name="FinanceStockAmountAdjustList_select" code="FinanceStockAmountAdjustList" size="small" type="primary" @click="select()">{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button name="FinanceStockAmountAdjustAdd_addNew" code="FinanceStockAmountAdjustAdd" size="small" type="primary" @click="addNew()">{{ $t('common_create') }}</ody-button>
      </div>
      <div slot="tabs">
        <el-tabs v-model="approvalStatus" name="approvalStatus4" @tab-click="handleTabClick">
          <el-tab-pane :label="$t('common_all')" :name="'-1'"/>
          <el-tab-pane v-for="it in approvalStatusList" :label="it.name" :name="it.code" :key="it.id"/>
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          v-loading="loading"
          :data="tableData"
          :columns="columns"
          :operates="operates"
          :can-filter="false"
          name="tableData243"
          style="width: 100%"/>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="tableData"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          class="pageStyle"
          @size-change="page.handleSizeChange"
          @current-change="page.handleCurrentChange"/>

      </div>
    </ody-list-table-area>
    <ody-dialog
      :visible.sync="auditDialogVisible"
      :title="this.$t('common_review')"
      width="40%">
      <span slot="footer" class="dialog-footer">
        <ody-button name="FinanceStockAmountAdjustAudit_aduitHandle" code="FinanceStockAmountAdjustAudit" @click="aduitHandle('no')">{{ $t('common_audit_not_pass') }}</ody-button>
        <ody-button name="FinanceStockAmountAdjustAudit_aduitHandle4" code="FinanceStockAmountAdjustAudit" type="primary" @click="aduitHandle('yes')">{{ $t('common_audit_pass') }}</ody-button>
      </span>
    </ody-dialog>
    <MerchantSelectModal :visible.sync="merchantModalVisible" @ok="selectMerchant" />
  </section>
</template>

<script>
import MerchantSelectModal from '@/components/merchantModal'
export default {
  name: 'FinanceStockAmountAdjust',
  components: {
    MerchantSelectModal
  },
  data() {
    const Vue = this
    return {
      merchantList: [],
      merchantIndex: null,
      merchantName: null,
      stockAmountAdjustCode: null,
      approvalStatusList: [],
      approvalStatus: '-1',
      createTimes: [],

      auditDialogVisible: false,
      merchantModalVisible: false,
      aduitRemark: '',
      auditRow: null,
      loading: false,
      tableData: [],
      columns: [
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('common_merchant_name'),
          align: 'left',
          minWidth: 124
        },
        {
          show: true,
          prop: 'stockAmountAdjustCode',
          label: this.$t('stockAmountAdjustCode'),
          align: 'left',
          minWidth: 200,
          render: (h, params) => {
            const to = { name: 'FinanceStockAmountAdjustDetails', params: { adjustCode: params.row.stockAmountAdjustCode }}
            return (
              <router-link to={to} class='link-type'>
                <span>{ params.row.stockAmountAdjustCode}</span>
              </router-link>
            )
          }
        },
        {
          show: true,
          prop: 'warehouseName',
          label: this.$t('common_warehouse_name'),
          align: 'left',
          minWidth: 124
        },
        {
          show: true,
          prop: 'approvalStatusStr',
          label: this.$t('orderStatusText'),
          align: 'left',
          minWidth: 88
        },
        {
          show: true,
          prop: 'createUsername',
          label: this.$t('common_create_username'),
          align: 'left',
          minWidth: 88
        },
        {
          show: true,
          prop: 'createTime',
          label: this.$t('common_create_time'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column) => {
            if (row.createTime) {
              return this.$portal.parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
            return ''
          }
        },
        {
          show: true,
          prop: 'auditUsername',
          label: this.$t('common_audit_person'),
          align: 'left',
          minWidth: 88
        },
        {
          show: true,
          prop: 'auditTime',
          label: this.$t('common_audit_time'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column) => {
            if (row.auditTime) {
              return this.$portal.parseTime(row.auditTime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
            return ''
          }
        }
      ],
      operates: {
        fixed: 'right',
        minWidth: 160,
        list: [
          {
            label: this.$t('edit'),
            code: 'FinanceStockAmountAdjustEdit',
            hidden(index, row) { // 待提交状态
              return !(row.approvalStatus === 0 || row.approvalStatus === 4)
            },
            method(index, row) {
              Vue.handleOpera(index, row, 'edit')
            }
          }, {
            label: this.$t('delete'),
            code: 'FinanceStockAmountAdjustDelete',
            hidden(index, row) { // 待提交状态
              return !(row.approvalStatus === 0 || row.approvalStatus === 4)
            },
            method(index, row) {
              Vue.handleOpera(index, row, 'delete')
            }
          }, {
            label: this.$t('common_submit'),
            code: 'FinanceStockAmountAdjustSubmit',
            hidden(index, row) {
              return row.approvalStatus !== 0 && row.approvalStatus !== 4
            },
            method(index, row) {
              Vue.handleOpera(index, row, 'submit')
            }
          }, {
            label: this.$t('common_review'),
            code: 'FinanceStockAmountAdjustAudit',
            hidden(index, row) { // 待提交状态
              return row.approvalStatus !== 1
            },
            disabled(index, row) { // 待审核状态
              return
            },
            method(index, row) {
              Vue.handleOpera(index, row, 'audit')
            }
          }
        ]
      },
      page: {
        current: 1,
        size: 10,
        total: 0,
        handleSizeChange(size) {
          Vue.page.size = size
          Vue.select()
        },
        handleCurrentChange(current) {
          Vue.page.current = current
          Vue.select()
        }
      }
    }
  },
  created() {
    // 商家列表
    // const param = {
    //   currentPage: 1,
    //   itemsPerPage: 10000
    // }
    // this.$finance.$api.common.getAuthMerchantPage(param).then(resp => {
    //   this.merchantList = resp.data.listObj
    // })
    // 单据审核状态枚举项
    this.$finance.$api.common.queryCodeList({
      category: 'ADJUST_APPROVAL_STATUS'
      // categories: ['ADJUST_APPROVAL_STATUS']
    }).then(resp => {
      let index = -1
      for (let i = 0; i < resp.data.length; ++i) {
        if (resp.data[i].code === '2') {
          index = i
        }
      }
      if (index >= 0) {
        resp.data.splice(index, 1)
      }
      this.approvalStatusList = resp.data
    })
    this.select()
  },
  methods: {
    selectMerchant(merchant) {
      if (merchant) {
        this.merchantIndex = merchant.merchantId
        this.merchantName = merchant.merchantName
      }
    },
    showMerchantModal() {
      this.merchantModalVisible = true
    },
    async select() {
      this.page.current = 1
      await this.updateList()
    },
    reset() {
      this.stockAmountAdjustCode = null
      this.approvalStatus = '-1'
      this.createTime = []
      this.merchantIndex = null
      this.merchantName = null
      this.createTimes = []
    },
    addNew() {
      if (this.merchantIndex == null) {
        this.$message({
          message: this.$t('common_please_choose_merchant'),
          type: 'warning'
        })
        return
      }
      const merchantId = this.merchantIndex
      const req = {
        filters: {
          merchantId
        }
      }
      this.$finance.$api.stockAmountAdjust.allowAdd(req).then(res => {
        if (res.data) {
          this.$router.push({
            name: 'FinanceStockAmountAdjustAdd',
            params: {
              newMerchantId: merchantId
            }
          })
        } else {
          this.$message({
            message: this.$t('not_allowed_adjust'), // 国际化:当前核算方式不能做库存金额调整
            type: 'warning'
          })
        }
      })
    },
    handleTabClick() {
      this.page.current = 1
      this.updateList()
    },

    handleOpera(index, row, type) {
      // TODO...
      switch (type) {
        case 'edit':
          this.$router.push({
            name: 'FinanceStockAmountAdjustEdit',
            params: {
              adjustCode: row.stockAmountAdjustCode
            }
          })
          break
        case 'delete':
          this.$finance.$api.stockAmountAdjust.deleteByCode({
            filters: {
              stockAmountAdjustCode: row.stockAmountAdjustCode
            }
          }).then(res => {
            this.select()
          })
          break
        case 'submit':
          this.$finance.$api.stockAmountAdjust.submitByCode({
            filters: {
              stockAmountAdjustCode: row.stockAmountAdjustCode
            }
          }).then(res => {
            this.select()
          })
          break
        case 'audit':
          this.auditDialogVisible = true
          this.auditRow = row
          break
      }
    },

    aduitHandle(type) {
      this.$finance.$api.stockAmountAdjust.aduitByCode({
        filters: {
          stockAmountAdjustCode: this.auditRow.stockAmountAdjustCode,
          pass: type === 'yes'
        }
      }).then(res => {
        this.select()
      }).finally(() => {
        this.aduitRemark = ''
        this.auditDialogVisible = false
      })
    },

    async updateList() {
      const data = {
        stockAmountAdjustCode: this.stockAmountAdjustCode,
        approvalStatus: this.approvalStatus === '-1' ? null : this.approvalStatus
      }

      if (this.createTimes != null && this.createTimes.length >= 2) {
        data.createTimeStart = this.$portal.parseTime(this.createTimes[0], '{y}-{m}-{d} {h}:{i}:{s}')
        data.createTimeEnd = this.$portal.parseTime(this.createTimes[1], '{y}-{m}-{d} {h}:{i}:{s}')
      }
      if (this.merchantIndex) {
        data.merchantId = this.merchantIndex
        // data.merchantCode = this.merchantList[this.merchantIndex].merchantCode
        // data.merchantName = this.merchantList[this.merchantIndex].merchantName
      }
      try {
        this.loading = true
        const res = await this.$finance.$api.stockAmountAdjust.orderListPage({ filters: data })
        this.tableData = res.data
        this.page.total = res.total
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
