<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item :label="$t('商品名称') + ':'" prop="chineseName">
            <el-input v-model="search.chineseName" :placeholder="$t('请输入商品名称')" name="search_chineseName" />
          </ody-search-item>
          <ody-search-item :label="$t('商品编码') + ':'" prop="code">
            <el-input v-model="search.code" :placeholder="$t('请输入商品编码')" name="search_code" />
          </ody-search-item>
          <ody-search-item :label="$t('申请时间') + ':'" :space="2" prop="createTime">
            <ody-date-range-picker
              v-model="search.createTime"
              :show-button="false"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="search_createTime"
              type="datetimer" />
          </ody-search-item>
          <ody-search-item :label="$t('商家') + ':'" prop="merchantId">
            <ody-merchant-select ref="merchant" v-model="search.merchantId" name="search_merchantId" value-key="merchantId" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button
          name="PriceAuditMerchantMpAudit_btn"
          code="PriceAuditMerchantMpAudit_btn"
          size="small"
          type="primary"
          @click.prevent="handleSubmit"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          :disabled="!table.checked || table.checked.length === 0"
          name="PriceAuditMerchantAduit_btn_showAuditDialog"
          type="primary"
          code="PriceAuditMerchantAduit_btn"
          size="small"
          @click="showAuditDialog()"
        >{{ $t('批量审核') }}</ody-button>
      </div>
      <div slot="tabs">
        <el-tabs v-model="activeState" name="activeState" @tab-click="onTabClick">
          <el-tab-pane v-for="(tab, index) in tabs" :label="tab.label" :key="index">
            <div
              slot="label"
            >{{ tab.label }} {{ tab.count !== undefined ? '(' + tab.count + ')' : '' }}</div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          :multiple="true"
          :checked.sync="table.checked"
          :selectable="selectable"
          request-url="/back-product-web/back/price/mpPriceAudit/listMpAudit.do"
        >
          <template slot="viewPrice" slot-scope="scope">
            <ody-button
              name="PriceAuditMerchantAduitDetail_btn_showAuditDialog"
              code="PriceAuditMerchantAduitDetail_btn"
              type="text"
              @click="showAuditDialog(scope.row, true)"
            >
              <el-link type="primary">{{ $t('查看') }}</el-link>
            </ody-button>
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
    <ody-dialog
      ref="dialog"
      :visible="audit.visible"
      :before-close="handleClose"
      :title="audit.queryDetail ? $t('查看价格变更明细') : $t('审核')"
      width="40%"
      @opened="initDialog"
    >
      <el-card v-if="audit.queryDetail" shadow="never">
        <ody-table
          ref="detailTable"
          :data="audit.table.detailData"
          :columns="audit.table.columns"
          :can-filter="false"
          name="audit_table_detailData344"
          height="200px"
        />
      </el-card>
      <el-form
        v-if="!checkedItem || checkedItem.status === 0"
        ref="detailForm"
        :model="audit"
        :rules="audit.rules"
        label-width="100px"
      >
        <el-form-item :label="$t('审核结果')" prop="form.status">
          <el-radio-group v-model="audit.form.status" name="audit_form_status">
            <el-radio :label="1">{{ $t('审核通过') }}</el-radio>
            <el-radio :label="2">{{ $t('审核拒绝') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="audit.form.status === 2" :label="$t('拒绝原因')" prop="form.refusalCause">
          <el-input v-model="audit.form.refusalCause" name="audit_form_refusalCause" type="textarea" maxlength="120" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-row v-if="!checkedItem || checkedItem.status === 0" type="flex" justify="end">
          <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
          <ody-button
            :loading="updateStatusLoading"
            name="PriceAuditMerchantAduit_btn_handleOk"
            code="PriceAuditMerchantAduit_btn"
            size="small"
            type="primary"
            @click="handleOk"
          >{{ $t('确定') }}</ody-button>
        </el-row>
        <el-row v-if="checkedItem && checkedItem.status !== 0" type="flex" justify="end">
          <el-button name="handleClose3" size="small" type="primary" @click="handleClose">{{ $t('确定') }}</el-button>
        </el-row>
      </span>
    </ody-dialog>
  </div>
</template>
<script>
export default {
  name: 'PriceAuditMerchant',
  data() {
    const vue = this
    return {
      status: [
        {
          status: '0',
          label: vue.$t('待审核')
        },
        {
          status: '1',
          label: vue.$t('审核通过')
        },
        {
          status: '2',
          label: vue.$t('审核拒绝')
        }
      ],
      updateStatusLoading: false,
      tabs: [],
      currentTab: null,
      search: getDefaultForm(),
      activeState: '0',
      merchantMap: {},
      table: {
        checked: [],
        columns: [
          {
            label: vue.$t('商品名称'),
            prop: 'chineseName',
            show: true,
            minWidth: 200
          },
          {
            label: vue.$t('商品编码'),
            prop: 'code',
            show: true,
            minWidth: 200
          },
          {
            label: vue.$t('计量单位'),
            prop: 'measurementUnit',
            show: true
          },
          {
            label: vue.$t('商家'),
            prop: 'merchantId',
            show: true,
            minWidth: 200,
            render: (h, params) => {
              return (
                <div>
                  {vue.merchantMap[params.row.merchantId]
                    ? vue.merchantMap[params.row.merchantId].merchantName
                    : ''}
                </div>
              )
            }
          },
          {
            label: vue.$t('价格变更明细'),
            prop: 'view',
            show: true,
            slot: 'viewPrice'
          },
          {
            label: vue.$t('提交人'),
            prop: 'userName',
            show: true
          },
          {
            label: vue.$t('申请时间'),
            prop: 'applicationTime',
            show: true,
            minWidth: 200,
            formatter: (row, column) => {
              if (row.applicationTime) {
                return vue.$portal.parseTime(row.applicationTime)
              }
              return ''
            }
          },
          {
            label: vue.$t('审核状态'),
            prop: 'status',
            show: true,
            render: (h, params) => {
              const map = vue.status.reduce((r, i) => {
                r[i.status] = i.label
                return r
              }, {})
              let message
              if (params.row.status === 2) {
                message = (
                  <el-popover placement='top' width='300' trigger='hover'>
                    <div>
                      <div>
                        {vue.$t('审核账号')}: <span>{params.row.userName}</span>
                      </div>
                      <div>
                        {vue.$t('审核时间')}:{' '}
                        <span>
                          {vue.$portal.parseTime(params.row.auditTime)}
                        </span>
                      </div>
                      <div>
                        {vue.$t('拒绝原因')}:{' '}
                        <span>{params.row.refusalCause}</span>
                      </div>
                    </div>
                    <i slot='reference' class='el-icon-question' />
                  </el-popover>
                )
              }
              return (
                <div class={params.row.status === 2 ? 'error' : ''}>
                  {map[params.row.status]}
                  {message}
                </div>
              )
            }
          }
        ],
        operates: {
          fixed: 'right',
          list: [
            {
              label: vue.$t('审核'),
              hidden: (index, row) => {
                return row.status !== 0
              },
              method: (index, row) => {
                this.showAuditDialog(row)
              },
              code: 'PriceAuditMerchantAduit_btn'
            }
          ]
        }
      },
      modifyType: {
        1: vue.$t('零售价'),
        2: vue.$t('结算价'),
        3: vue.$t('组合价'),
        4: vue.$t('价格层级'),
        5: vue.$t('所需积分'),
        6: vue.$t('采购价'),
        7: vue.$t('划线价')
      },
      priceLevelType: {
        2: vue.$t('渠道店铺层'),
        3: vue.$t('商家层')
      },
      checkedItem: null,
      audit: {
        queryDetail: true,
        visible: false,
        form: {
          status: 1,
          refusalCause: null
        },
        rules: {
          'form.status': [
            { required: true, message: this.$t('required'), trigger: 'change' }
          ],
          'form.refusalCause': [
            { required: true, message: this.$t('required'), trigger: 'change' }
          ]
        },
        table: {
          detailData: [],
          columns: [
            {
              label: vue.$t('修改类型'),
              prop: 'modifyType',
              show: true,
              minWidth: 120,
              formatter: (row, column) => {
                if (row.modifyType) {
                  return vue.modifyType[row.modifyType]
                }
                return ''
              }
            },
            {
              label: vue.$t('修改前数值'),
              prop: 'beforeValue',
              show: true,
              minWidth: 100,
              render: (h, params) => {
                const row = params.row
                return (
                  <div>
                    {row.modifyType === 4
                      ? vue.priceLevelType[row.beforeValue]
                      : row.beforeValue}
                  </div>
                )
              }
            },
            {
              label: vue.$t('修改后数值'),
              prop: 'afterValue',
              show: true,
              minWidth: 100,
              render: (h, params) => {
                const row = params.row
                return (
                  <div>
                    {row.modifyType === 4
                      ? vue.priceLevelType[row.afterValue]
                      : row.afterValue}
                  </div>
                )
              }
            }
          ]
        }
      }
    }
  },
  async mounted() {
    this.initTabs()
    await this.initMerchant()
    await this.query()
  },
  methods: {
    initTabs() {
      this.tabs = [
        {
          label: this.$t('全部')
        }
      ]
      this.status.forEach(element => {
        this.tabs.push({
          status: element.status,
          label: element.label,
          count: 0
        })
      })
      this.currentTab = this.tabs[0]
    },
    async initMerchant() {
      const {
        data
      } = await this.$product.$api.merchantApi.queryPlatformAuthMerchantPage({
        currentPage: 1,
        itemsPerPage: 500
      })
      if (data && data.listObj) {
        data.listObj.forEach(element => {
          this.merchantMap[element.merchantId] = element
        })
      }
    },
    handleReset() {
      this.search = getDefaultForm()
    },
    selectable(row, index) {
      return row.status === 0
    },
    async handleSubmit() {
      const [err] = await this.formValidate('search')

      if (err) {
        return
      }
      await this.query()
    },
    onTabClick() {
      for (var i = 0; i < this.tabs.length; i++) {
        if (i.toString() === this.activeState) {
          this.currentTab = this.tabs[i]
          break
        }
      }
      this.queryList()
    },
    queryList() {
      const {
        createTime: [createTimeBegin, createTimeEnd],
        ...params
      } = this.search
      params.status = this.currentTab.status
      params.createTimeStart = createTimeBegin
        ? createTimeBegin + ' 00:00:00'
        : createTimeBegin
      params.createTimeEnd = createTimeEnd
        ? createTimeEnd + ' 23:59:59'
        : createTimeEnd
      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    },
    async queryDetail() {
      this.audit.table.detailData = []
      const params = {
        priceAuditId: this.checkedItem.id
      }
      const {
        data
      } = await this.$product.$api.priceApi.listMerchantProductPriceAuditDetailByPriceAuditId(
        params
      )
      this.audit.table.detailData = data || []
    },
    async query() {
      await this.queryList()
      this.queryCount()
    },
    async queryCount() {
      const {
        createTime: [createTimeBegin, createTimeEnd],
        ...params
      } = this.search

      params.createTimeStart = createTimeBegin
        ? createTimeBegin + ' 00:00:00'
        : createTimeBegin
      params.createTimeEnd = createTimeEnd
        ? createTimeEnd + ' 23:59:59'
        : createTimeEnd
      params.status = null
      const { data } = await this.$product.$api.priceApi.countMpAuditMap(params)
      const counts = data.reduce((r, i) => {
        r[i.status] = i.count
        return r
      }, {})
      this.tabs.forEach(element => {
        if (element.status !== undefined) {
          element.count = counts[element.status] || 0
        }
      })
    },
    showAuditDialog(row, showDetail) {
      this.audit.visible = true
      this.audit.queryDetail = showDetail
      if (row) {
        this.checkedItem = row
      }
    },
    initDialog() {
      if (this.checkedItem && this.audit.queryDetail) {
        this.queryDetail()
      }
    },
    handleOk() {
      const vue = this
      this.updateStatusLoading = true
      this.$refs.detailForm.validate(validate => {
        if (validate) {
          let ids
          let mpIds
          if (vue.checkedItem) {
            ids = [vue.checkedItem.id]
            mpIds = [vue.checkedItem.mpId]
          }
          if (vue.table.checked && vue.table.checked.length > 0) {
            ids = vue.table.checked.map(i => i.id)
            mpIds = vue.table.checked.map(i => i.mpId)
          }
          const params = {
            ids: ids,
            mpIds: mpIds,
            refusalCause: vue.audit.form.refusalCause,
            status: vue.audit.form.status
          }
          vue.$product.$api.priceApi
            .batchUpdateAuditStatusWithTx(params)
            .then(res => {
              vue.handleClose()
              vue.query()
            })
            .finally(() => {
              this.updateStatusLoading = false
            })
        } else {
          this.updateStatusLoading = false
        }
      })
    },
    handleClose() {
      this.audit.visible = false
      this.audit.queryDetail = false
      this.audit.form.status = 1
      this.audit.form.refusalCause = null
      this.table.checked = []
      this.checkedItem = null
    }
  }
}
function getDefaultForm() {
  return Object.assign(
    {},
    {
      chineseName: null,
      code: null,
      createTime: [],
      merchantId: null
    }
  )
}
</script>
<style lang="less" scoped>
</style>
