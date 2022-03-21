<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="searchForm" label-width="100px" class="form">
          <!-- 商家名称 -->
          <ody-search-item :label="$t('common_merchant_name') + ':'" prop="merchantName">
            <el-input
              v-model="searchForm.merchantName"
              :placeholder="$t('common_choose_please')"
              name="searchForm_merchantName"
              readonly="true"
              @click.native="showMerchantSelectModal"
            />
          </ody-search-item>
          <!-- 合同编码 -->
          <ody-search-item :label="$t('contract_contractCode') + ':'" prop="contractCode">
            <el-input v-model="searchForm.contractCode" name="searchForm_contractCode" />
          </ody-search-item>
          <!-- 供应商编码 -->
          <ody-search-item :label="$t('common_supplier_code') + ':'" prop="supplierCode">
            <el-input v-model="searchForm.supplierCode" name="searchForm_supplierCode" />
          </ody-search-item>
          <!-- 供应商名称 -->
          <ody-search-item :label="$t('common_supplier_name') + ':'" prop="supplierName">
            <el-input v-model="searchForm.supplierName" name="searchForm_supplierName" />
          </ody-search-item>
          <!-- 合同生效日期 -->
          <ody-search-item :label="$t('contract_commencement_date') + ':'" prop="effectiveTime">
            <ody-date-range-picker
              v-model="searchForm.effectiveTime"
              type="date"
              name="searchForm_effectiveTime"
              value-format="yyyy-MM-dd">range-separator=" ~ "/></ody-date-range-picker>
              <!-- <el-date-picker
              v-model="searchForm.effectiveTime"
              name="searchForm_effectiveTime"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator=" ~ "
            /> -->
          </ody-search-item>
          <!-- 合同失效时间 -->
          <ody-search-item :label="$t('contract_contractEndTime') + ':'" prop="expireTime">
            <ody-date-range-picker
              v-model="searchForm.expireTime"
              type="date"
              name="searchForm_effectiveTime"
              value-format="yyyy-MM-dd">range-separator=" ~ "/></ody-date-range-picker>
              <!-- <el-date-picker
              v-model="searchForm.expireTime"
              name="searchForm_expireTime"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator=" ~ "
            /> -->
          </ody-search-item>
          <!-- 审核状态 -->
          <ody-search-item :label="$t('contract_contractStatus') + ':'" prop="contractStatus">
            <el-select v-model="searchForm.contractStatus" name="searchForm_contractStatus">
              <el-option :label="$t('common_status_all')" :value="null" />
              <el-option v-for="(k,v) in contractStatusList" :label="k" :key="v" :value="v" />
            </el-select>
          </ody-search-item>
          <!-- 合同属性 -->
          <ody-search-item :label="$t('purchaseReturnOrder_product_contractProperty') + ':'" prop="contractProperty">
            <el-select v-model="searchForm.contractProperty" name="searchForm_contractProperty">
              <el-option :label="$t('common_status_all')" :value="null" />
              <el-option v-for="(k,v) in contractPropertyList" :label="k" :key="v" :value="v" />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="OpmsJxContractList01_handleSearchSubmit"
          size="small"
          type="primary"
          code="OpmsJxContractList01"
          @click="handleSearchSubmit"
        >{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-dialog
      :visible.sync="dialog.show"
      :before-close="handleDialogClose"
      :title="$t('plRule_detail_confirm_title')"
      width="600px"
    >
      <span>{{ dialog.title }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleDialog" size="small" @click="handleDialog(1)">{{ dialog.but1 }}</el-button>
        <el-button name="handleDialog2" size="small" type="primary" @click="handleDialog(0)">{{ dialog.but2 }}</el-button>
      </span>
    </ody-dialog>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button
          v-if="platformId===1 || platformId===2"
          name="OpmsJxContractList02_createContract"
          type="primary"
          size="small"
          style="margin-bottom: 10px;"
          code="OpmsJxContractList02"
          @click="createContract"
        >{{ $t('contract_addContract') }}</ody-button>
        <ody-button
          name="OpmsJxContractList03_exportData"
          size="small"
          code="OpmsJxContractList03"
          @click="exportData"
        >{{ $t('common_export') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table :loading="loading" :data="list" :columns="columns" :operates="operates" name="list039" />
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
    <ody-dialog
      v-if="auditDialogVisible"
      :visible.sync="auditDialogVisible"
      :title="$t('信息提示')"
      width="600px"
      @hide-dialog="hideAuditDialog"
      @confirm-dialog="confirmDialog1"
    >
      <el-form
        v-if="btnType != 6 && btnType != 7"
        slot="content"
        ref="auditForm"
        label-width="100px"
        class="form"
      >
        <el-form-item :label="$t('审核结果:')">
          <el-select v-model="searchForm.type" name="searchForm_type">
            <el-option :value="1" :label="$t('审核通过')" />
            <el-option :value="2" :label="$t('驳回')" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-if="searchForm.type===2"
            v-model="searchForm.remark"
            :row="2"
            name="searchForm_remark"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <el-form v-if="btnType == 6" slot="content" ref="auditForm" label-width="100px" class="form">
        <el-form-item :label="$t('合同续签开始日期:')">
          <el-date-picker
            v-model="dataForm.effectiveTime"
            :placeholder="$t('选择日期')"
            name="dataForm_effectiveTime"
            type="date"
            style="margin-left: 20px;"
          />
        </el-form-item>
        <el-form-item :label="$t('合同续签结束日期：')">
          <el-date-picker
            v-model="dataForm.expireTime"
            :placeholder="$t('选择日期')"
            name="dataForm_expireTime"
            type="date"
            style="margin-left: 20px;"
          />
        </el-form-item>
      </el-form>
      <el-form v-if="btnType == 7" slot="content" ref="auditForm" label-width="100px" class="form">
        <el-form-item :label="$t('合同将延期至:')">
          <el-date-picker
            v-model="searchForm.delayDate"
            :placeholder="$t('选择日期')"
            name="searchForm_delayDate"
            type="date"
            style="margin-left: 20px;"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="line-top" />
        <el-button name="hideAuditDialog" size="mini" @click="hideAuditDialog">取 消</el-button>
        <ody-button
          name="OpmsJxContractList04_confirmAuditDialog"
          size="mini"
          type="primary"
          code="OpmsJxContractList04"
          @click="confirmAuditDialog"
        >确 定</ody-button>
      </span>
    </ody-dialog>
    <MerchantSelectModal :visible.sync="showMerchantModal" @ok="selectMerchant" />
    <SupplierSelectModal
      :visible.sync="showSupplierModal"
      :platform-id.sync="platformId"
      @ok="selectSupplier"
    />
  </section>
</template>

<script>
import SupplierSelectModal from '@/components/supplierModal'
import MerchantSelectModal from '@/components/merchantModal'
import dateUtil from '@/utils/dateUtil'

export default {
  name: 'OpmsJxContractList',
  components: {
    SupplierSelectModal,
    MerchantSelectModal
  },
  data() {
    const vue = this
    return {
      dataForm: {
        effectiveTime: '',
        expireTime: ''
      },
      searchForm: getDefaultSearchForm(),
      showMerchantModal: false,
      showSupplierModal: false,
      auditDialogVisible: false,
      btnType: null,
      showContractProperty: 0,
      loading: false,
      list: [],
      platformId: null,
      contractStatusList: [],
      contractPropertyList: [],
      contractDetail: {
        contractProperty: null,
        contractType: null,
        currencyCode: null,
        merchantCode: null,
        merchantId: null,
        merchantName: null,
        supplierCode: null,
        supplierName: null
      },
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      dialog: {
        show: false,
        title: '',
        but1: '',
        but2: '',
        id: 0,
        arg1: 0,
        params: {
          remark: null,
          type: null,
          effectiveTime: null,
          expireTime: null
        }
      },
      columns: [
        {
          show: true,
          prop: 'contractCode', // 合同编码
          label: this.$t('contract_contractCode'),
          minWidth: 200,
          align: 'left',
          render: (h, params) => {
            return (
              <a
                on-click={() => {
                  if (this.$portal.hasPermission('OpmsJxContractList24')) {
                    this.forwardToDetail(params.row)
                  }
                }}
              >
                <span style={'color:#1890FF'}>{params.row.contractCode}</span>
              </a>
            )
          }
        },
        {
          show: true,
          prop: 'merchantName', // 商家名称
          label: this.$t('plMpConfig_merchantName'),
          align: 'left'
        },
        {
          show: true,
          prop: 'contractPropertyText', // 合同属性
          label: this.$t('purchaseReturnOrder_product_contractProperty'),
          align: 'left',
          minWidth: 88
        },
        {
          show: true,
          minWidth: 88,
          prop: 'currencyCode', // 交易币别
          label: this.$t('common_currency'),
          align: 'left'
        },
        {
          show: true,
          minWidth: 88,
          prop: 'isValidText', // 是否失效
          label: this.$t('contract_isValid'),
          align: 'left'
        },
        {
          show: true,
          prop: 'supplierCode', // 供应商编码
          label: this.$t('common_supplier_code'),
          minWidth: 200,
          align: 'left'
        },
        {
          show: true,
          prop: 'supplierName', // 供应商名称
          label: this.$t('common_supplier_name'),
          align: 'left'
        },
        {
          show: true,
          prop: 'effectiveTime', // 合同生效时间
          label: this.$t('contract_contractStartTime'),
          align: 'left',
          formatter: (row, column, cellValue) => {
            return dateFormat(row.effectiveTime)
          }
        },
        {
          show: true,
          prop: 'expireTime', // 合同失效时间
          label: this.$t('contract_contractEndTime'),
          align: 'left',
          formatter: (row, column, cellValue) => {
            return dateFormat(row.expireTime)
          }
        },
        /* {
          show: true,
          prop: 'isChangeText', // 合同变更类型
          label: this.$t('contract_contractExchangeType'),
          align: 'left'
        },*/
        {
          show: true,
          prop: 'isPauseText', // 履行状态
          label: this.$t('contract_isPause'),
          align: 'left'
        },
        /* {
          show: true,
          prop: 'oldContractCode', // 原合同编号
          label: this.$t('contract_oldContractCode'),
          align: 'left',
          minWidth: 200
        },*/
        {
          show: true,
          prop: 'createUsername', // 制单人
          label: this.$t('contract_createUsername'),
          align: 'left'
        }
      ],
      operates: {
        fixed: 'right',
        align: 'center',
        width: 260,
        list: [
          {
            label: this.$t('common_audit'),
            disabled: false,
            method(index, row) {
              // 审核1:通过id,remark='',type=1，不通过id,remark='xxx',type=2
              vue.searchForm.id = row.id
              vue.btnType = 1
              vue.auditDialogVisible = true
            },
            hidden(index, row) {
              return row.contractStatus !== 1
            },
            code: 'OpmsJxContractList05'
          },
          {
            label: this.$t('common_confirm'),
            disabled: false,
            method(index, row) {
              // 确认2:id
              vue.showDialog(
                vue.$t('contract_confirmContract'),
                vue.$t('common_cancel'),
                vue.$t('common_submit'),
                row.id,
                2
              )
            },
            hidden(index, row) {
              return row.contractStatus !== 0
            },
            code: 'OpmsJxContractList06'
          },
          {
            label: this.$t('common_delete'),
            disabled: false,
            method(index, row) {
              // 删除
              vue.showDialog(
                vue.$t('common_msg_confirm_delete'),
                vue.$t('common_no'),
                vue.$t('common_delete'),
                row.id,
                3
              )
            },
            hidden(index, row) {
              return row.contractStatus !== 0
            },
            code: 'OpmsJxContractList07'
          },
          {
            label: this.$t('contract_stop'),
            disabled: false,
            method(index, row) {
              // 暂停
              const params = {
                type: 1
              }
              vue.showDialog(
                vue.$t('common_msg_confirm_stop'),
                vue.$t('common_cancel'),
                vue.$t('common_confirm'),
                row.id,
                4,
                params
              )
            },
            hidden(index, row) {
              return !(row.contractStatus === 2 && row.isPause === 0)
            },
            code: 'OpmsJxContractList08'
          },
          {
            label: this.$t('contract_restart'),
            disabled: false,
            method(index, row) {
              // 重启
              const params = {
                type: 2
              }
              vue.showDialog(
                vue.$t('common_msg_confirm_restart'),
                vue.$t('common_cancel'),
                vue.$t('common_confirm'),
                row.id,
                5,
                params
              )
            },
            hidden(index, row) {
              return !(row.contractStatus === 2 && row.isPause === 1)
            },
            code: 'OpmsJxContractList09'
          },
          {
            label: this.$t('contract_renew'),
            disabled: false,
            method(index, row) {
              vue.searchForm.id = row.id
              vue.btnType = 6
              vue.auditDialogVisible = true
            },
            hidden(index, row) {
              return !(row.contractStatus === 2 && row.isPause === 1)
            },
            code: 'OpmsJxContractList10'
          },
          {
            label: this.$t('contract_delay'),
            disabled: false,
            method(index, row) {
              // 延期
              vue.searchForm.id = row.id
              vue.btnType = 7
              vue.auditDialogVisible = true
            },
            hidden(index, row) {
              return !(row.contractStatus === 2 && row.isPause === 1)
            },
            code: 'OpmsJxContractList11'
          }
          /* {
            label: this.$t('contract_exchange'),
            disabled: false,
            method(index, row) {
              // 变更
              const params = {
                type: 1,
                contractCode: row.contractCode
              }
              vue.showDialog(
                vue.$t('contract_message01') + vue.$t('contract_message02'),
                vue.$t('common_cancel'),
                vue.$t('common_confirm'),
                row.id,
                8,
                params
              )
            },
            hidden(index, row) {
              return !(row.contractStatus === 2 && row.isPause === 1)
            },
            code: 'OpmsJxContractList12'
          }*/
        ]
      }
    }
  },
  async mounted() {
    try {
      const vue = this
      await vue.initMerchant(vue)
      await vue.initCodes(vue)
      this.updateList()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async initMerchant(vue) {
      try {
        const result = await vue.$opms.$api.common.getDomainInfo()
        if (result.data && result.code === '0') {
          vue.platformId = result.data.platformId
        }
        if (vue.platformId === 1) {
          vue.showContractProperty = 1
        } else {
          vue.showContractProperty = 0
        }
      } catch (e) {
        console.log(e)
      }
    },
    async initCodes(vue) {
      const res = await vue.$opms.$api.code.selectMulti({
        categories: ['CONTRACT_STATUS', 'CONTRACT_PROPERTY']
      })
      if (res.data.CONTRACT_STATUS) {
        vue.contractStatusList = res.data.CONTRACT_STATUS
      }
      if (res.data.CONTRACT_PROPERTY) {
        vue.contractPropertyList = res.data.CONTRACT_PROPERTY
      }
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
    async exportData() {
      try {
        await exportData(this)
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
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
    handleActiveStatusChange() {
      this.handleSearchSubmit()
    },
    handleDialogClose() {
      const vue = this
      vue.dialog.show = false
      vue.dialog = {
        show: false,
        title: '',
        but1: '',
        but2: '',
        id: 0,
        arg1: 0,
        params: {
          remark: null,
          type: null,
          effectiveTime: null,
          expireTime: null,
          contractCode: null
        }
      }
    },
    async handleDialog(status) {
      const vue = this
      if (status === 0) {
        // 确认2:id
        if (vue.dialog.arg1 === 2) {
          const param = {
            id: vue.dialog.id
          }
          const res = await vue.$opms.$api.jxContract.confirmContractInfo(param)
          if (res.code === '0') {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            vue.updateList()
          }
          vue.dialog.show = false
        }
        // 删除3:id
        if (vue.dialog.arg1 === 3) {
          const param = {
            id: vue.dialog.id
          }
          const res = await vue.$opms.$api.jxContract.deleteContractInfo(param)
          if (res.code === '0') {
            vue.$message({
              type: 'success',
              message: '操作成功'
            })
            vue.updateList()
          }
          vue.dialog.show = false
        }
        // 暂停4:id,type=1；重启5:id,type=2
        if (vue.dialog.arg1 === 4 || vue.dialog.arg1 === 5) {
          const param = {
            id: vue.dialog.id,
            type: vue.dialog.type
          }
          const res = await vue.$opms.$api.jxContract.newPauseContractInfo(param)
          console.info(res)
          if (res.code === '0') {
            console.info(1)
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            vue.updateList()
          }
          vue.dialog.show = false
        }
        // 续签6:id,type=2,effectiveTime,expireTime
        if (vue.dialog.arg1 === 6) {
          const param = {
            id: vue.dialog.id,
            type: 2,
            effectiveTime: vue.dialog.effectiveTime,
            expireTime: vue.dialog.expireTime
          }
          const res = await vue.$opms.$api.jxContract.renewContractInfo(param)
          if (res.code === '0') {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            vue.updateList()
          }
          vue.dialog.show = false
        }
        // 延期7:id,type=1,expireTime
        if (vue.dialog.arg1 === 7) {
          const param = {
            id: vue.dialog.id,
            type: 1,
            expireTime: vue.dialog.expireTime
          }
          const res = await vue.$opms.$api.jxContract.delayContractInfo(param)
          if (res.code === '0') {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            vue.updateList()
          }
          vue.dialog.show = false
        }
        // 变更8:id,type=1
        if (vue.dialog.arg1 === 8) {
          const param = {
            id: vue.dialog.id,
            type: 1
          }
          const res = await vue.$opms.$api.jxContract.exchangeContractInfo(
            param
          )
          if (res.code === '0') {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            vue.updateList()
          }
          vue.dialog.show = false
        }
      } else {
        vue.dialog.show = false
      }
    },
    createContract() {
      const vue = this
      vue.showSupplierModal = true
      if (vue.showContractProperty === 0) {
        vue.contractDetail.contractProperty = 3
      } else {
        vue.contractDetail.contractProperty = null
      }
      vue.contractDetail.contractType = 1
    },
    forwardToDetail(row) {
      let isEdit = false
      if (row.contractStatus === 0) {
        if (
          this.platformId === 1 &&
          (row.contractProperty === '1' || row.contractProperty === '2')
        ) {
          isEdit = true
        } else if (row.contractProperty !== '1') {
          isEdit = true
        }
      }
      this.$router.push({
        name: 'OpmsJxContractDetail',
        params: { id: row.id, isEdit: isEdit }
      })
    },
    async selectSupplier(result) {
      const vue = this
      if (result) {
        vue.contractDetail.supplierCode = result.orgCode
        vue.contractDetail.supplierName = result.orgName
        vue.contractDetail.currencyCode = result.currencyCode
        vue.contractDetail.merchantId = result.merchantId
        vue.contractDetail.merchantCode = result.merchantCode
        vue.contractDetail.merchantName = result.merchantName
      }
      const res = await vue.$opms.$api.jxContract.addContractInfo(
        vue.contractDetail
      )
      if (res.data && res.data.id) {
        vue.$router.push({
          name: 'OpmsJxContractDetail',
          params: { id: res.data.id, isEdit: true }
        })
      }
    },
    showMerchantSelectModal() {
      this.showMerchantModal = true
    },
    selectMerchant(merchant) {
      const vue = this
      vue.searchForm.merchantName = merchant.merchantName
      vue.searchForm.merchantId = merchant.merchantId
      vue.searchForm.merchantCode = merchant.merchantCode
    },
    showDialog(title, but1, but2, id, arg1, params) {
      const vue = this
      vue.dialog.title = title
      vue.dialog.but1 = but1
      vue.dialog.but2 = but2
      vue.dialog.id = id
      vue.dialog.arg1 = arg1
      if (params != null) {
        vue.dialog.type = params.type
        vue.dialog.remark = params.remark
        vue.dialog.effectiveTime = params.effectiveTime
        vue.dialog.expireTime = params.expireTime
      }
      vue.dialog.show = true
    },
    hideAuditDialog() {
      this.auditDialogVisible = false
    },
    async confirmAuditDialog() {
      const vue = this
      if (vue.btnType === 1) {
        const params = {
          id: vue.searchForm.id,
          type: vue.searchForm.type,
          remark: vue.searchForm.remark
        }
        const res = await vue.$opms.$api.jxContract.auditContractInfo(params)
        if (res.code === '0') {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.updateList()
        }
      }
      if (vue.btnType === 6) {
        const params = {
          id: vue.searchForm.id,
          type: vue.searchForm.type,
          effectiveTime: dateFormat(vue.dataForm.effectiveTime),
          expireTime: dateFormat(vue.dataForm.expireTime)
        }
        const res = await vue.$opms.$api.jxContract.renewContractInfo(params)
        if (res.code === '0') {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.updateList()
        }
      }
      if (vue.btnType === 7) {
        const params = {
          id: vue.searchForm.id,
          type: vue.searchForm.type,
          expireTime: dateFormat(vue.searchForm.delayDate)
        }
        const res = await vue.$opms.$api.jxContract.delayContractInfo(params)
        if (res.code === '0') {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.updateList()
        }
      }
      vue.clearParams()
      this.auditDialogVisible = false
    },
    clearParams() {
      const vue = this
      vue.searchForm.id = null
      vue.searchForm.type = 1
      vue.searchForm.remark = null
      vue.searchForm.effectiveTime = []
      vue.searchForm.expireTime = []
      vue.searchForm.delayDate = null
    }
  }
}

async function loadList(vue, isExport = false) {
  const param = {
    currentPage: vue.page.current,
    itemsPerPage: vue.page.size
  }
  if (vue.searchForm.merchantId != null && vue.searchForm.merchantId !== '') {
    param.merchantId = vue.searchForm.merchantId
  }
  if (
    vue.searchForm.contractCode != null &&
    vue.searchForm.contractCode !== ''
  ) {
    param.contractCode = vue.searchForm.contractCode
  }
  if (
    vue.searchForm.supplierCode != null &&
    vue.searchForm.supplierCode !== ''
  ) {
    param.supplierCode = vue.searchForm.supplierCode
  }
  if (
    vue.searchForm.supplierName != null &&
    vue.searchForm.supplierName !== ''
  ) {
    param.supplierName = vue.searchForm.supplierName
  }
  if (vue.searchForm.effectiveTime != null) {
    if (vue.searchForm.effectiveTime.length > 0) {
      param.effectiveTimeStart = vue.searchForm.effectiveTime[0]
    }
    if (vue.searchForm.effectiveTime.length > 1) {
      param.effectiveTimeEnd = vue.searchForm.effectiveTime[1]
    }
  }
  if (vue.searchForm.expireTime != null) {
    if (vue.searchForm.expireTime.length > 0) {
      param.expireTimeStart = vue.searchForm.expireTime[0]
    }
    if (vue.searchForm.expireTime.length > 1) {
      param.expireTimeEnd = vue.searchForm.expireTime[1]
    }
  }
  if (
    vue.searchForm.contractStatus != null &&
    vue.searchForm.contractStatus !== ''
  ) {
    param.contractStatus = vue.searchForm.contractStatus
  }
  if (
    vue.searchForm.contractProperty != null &&
    vue.searchForm.contractProperty !== ''
  ) {
    param.contractProperty = vue.searchForm.contractProperty
  }
  param.contractType = 1
  const api = vue.$opms.$api.jxContract
  if (!isExport) {
    const res = await api.queryContractInfoList(param)
    if (res.data) {
      vue.list = res.data.listObj
      vue.page.total = res.data.total
    }
  } else {
    // 导出exel
    vue.$portal.downloadFileByGet(
      'api/opms-web/contractInfo/exportJXContractInfoList.do',
      { queryContent: JSON.stringify(param) }
    )
  }
}

async function exportData(vue) {
  await loadList(vue, true)
}

function getDefaultSearchForm() {
  return {
    id: null,
    type: 1,
    merchantId: null,
    merchantName: null,
    contractCode: null,
    contractProperty: null,
    contractStatus: null,
    supplierCode: null,
    supplierName: null,
    effectiveTime: null,
    expireTime: null,
    delayDate: null,
    remark: null
  }
}

function dateFormat(time) {
  if (!time) {
    return ''
  }
  return dateUtil.dateFormatForTime(time, false)
}
</script>

<style lang="scss" scoped>
</style>
