<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item :label="$t('品牌名称') + ':'" prop="brandName">
            <el-input v-model="search.brandName" name="search_brandName" />
          </ody-search-item>
          <ody-search-item :label="$t('商家名称') + ':'" prop="merchantId">
            <ody-merchant-choose
              v-model="search.merchantId"
              :selected.sync="selected"
              :placeholder="$t('please_choose')"
              name="search_merchantId"
              value-key="merchantId"
            />
          </ody-search-item>
          <ody-search-item :label="$t('申请时间') + ':'" :space="2" prop="createTime">
            <ody-date-range-picker
              v-model="search.createTime"
              :start-placeholder="$t('开始时间')"
              :end-placeholder="$t('结束时间')"
              name="search_createTime"
              range-separator="-"
              type="datetimer"
              value-format="yyyy-MM-dd"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{
          $t("重置")
        }}</el-button>
        <ody-button
          name="MerchantBrandyListQuery"
          size="small"
          type="primary"
          code="MerchantBrandyListQuery"
          @click.prevent="handleSubmit"
        >{{ $t("查询") }}</ody-button
        >
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          :disabled="table.checked.length == 0"
          name="MerchantBrandBatchAudit_batchAudit"
          size="small"
          type="primary"
          code="MerchantBrandBatchAudit"
          @click="batchAudit"
        >{{ $t("批量审核") }}</ody-button
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
          :can-filter="false"
          request-url="/back-product-web/back/mp/merchantBrand/listMerchantBrand.do"
          @getTableList="handleGetTableList"
        >
          <template slot="createTime" slot-scope="scope">{{
            scope.row.createTime | parseTime
          }}</template>
          <template slot="merchantName" slot-scope="scope">{{
            scope.row.merchantId | keyVal(merchantMap, "merchantName")
          }}</template>
          <template slot="merchantCode" slot-scope="scope">{{
            scope.row.merchantId | keyVal(merchantMap, "merchantCode")
          }}</template>
          <template slot="statusName" slot-scope="scope">{{
            scope.row.status | keyVal(auditStatus)
          }}</template>
        </ody-table>
      </div>
    </ody-list-table-area>
    <ody-dialog :visible.sync="dialogVisible" :title="$t('审核')" width="600px">
      <el-form
        ref="dialogData"
        :model="dialogData"
        :rules="rules2"
        label-width="160px"
        class="form"
      >
        <el-form-item :label="$t('审核结果')" prop="status">
          <el-radio-group v-model="dialogData.status" name="dialogData_status">
            <el-radio :label="2">{{ $t("审核通过") }}</el-radio>
            <el-radio :label="3">{{ $t("审核拒绝") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <br >
        <el-row v-if="dialogData.status == 3" class="row_class">
          <el-form-item :label="$t('拒绝原因')" prop="remark">
            <el-input
              v-model="dialogData.remark"
              name="dialogData_remark"
              type="textarea"
              placeholder
              maxlength="200"
              rows="6"
            />
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer">
        <div class="line-top" />
        <el-button name="hideDialog" size="small" @click="hideDialog">{{
          $t("取消")
        }}</el-button>
        <ody-button
          name="MerchantBrandAuditInfo_confirmDialog"
          size="small"
          type="primary"
          code="MerchantBrandAuditInfo"
          @click="confirmDialog('dialogData')"
        >{{ $t("确定") }}</ody-button
        >
      </span>
    </ody-dialog>
  </div>
</template>
<script>
export default {
  name: 'ProductMerchantBrandManage',
  data() {
    return {
      search: {
        brandName: '',
        merchantId: '',
        merchantCode: '',
        status: null,
        createTime: []
      },
      dialogData: {
        status: '',
        remark: '',
        ids: []
      },
      merchantMap: {},
      auditStatus: {},
      tabs: [],
      currentTab: null,
      countWaitAudit: 0,
      rules2: {
        remark: [
          {
            required: true,
            message: this.$t('拒绝原因不能为空'),
            trigger: 'blur'
          }
        ]
      },
      dialogVisible: false,
      message: '',
      table: {
        columns: [
          {
            label: this.$t('品牌名称'),
            prop: 'brandName',
            show: true,
            render: (h, params) => {
              return (
                <a
                  on-click={() => {
                    if (this.$portal.hasPermission('MerchantBrandView')) {
                      this.forwardToDetail(params.row)
                    }
                  }}
                >
                  <span style='color:#1890FF'>{params.row.brandName}</span>
                </a>
              )
            }
          },
          {
            label: this.$t('品牌名称(第二语言)'),
            show: true,
            minWidth: 200,
            prop: 'nameLan2'
          },
          {
            label: this.$t('商家名称'),
            slot: 'merchantName',
            minWidth: 200,
            show: true
          },
          {
            label: this.$t('商家编码'),
            slot: 'merchantCode',
            minWidth: 200,
            show: true
          },
          {
            label: this.$t('申请时间'),
            slot: 'createTime',
            minWidth: 200,
            show: true
          },
          {
            label: this.$t('审核状态'),
            prop: 'statusName',
            show: true,
            tooltip: false,
            render: (h, params) => {
              // alert(params.row.status)
              if (params.row.status === 3) {
                const nameLabel = this.$t('审核账号')
                const updateUsername = params.row.updateUsername
                const auditInfo = updateUsername
                  ? nameLabel + '：' + updateUsername
                  : ''
                var self = this
                return (
                  <span>
                    <sapn style='color:red'>{params.row.statusName}</sapn>
                    <el-tooltip effect='dark' placement='top'>
                      <div slot='content'>
                        <div>
                          <div>{auditInfo}</div>
                          <span>{self.$t('审核时间')}：</span>
                          <span>{params.row.updateTime}</span>
                          <br />
                          <span>{self.$t('拒绝原因')}：</span>
                          <span>{params.row.remark}</span>
                        </div>
                      </div>
                      <i class='el-icon-question' />
                    </el-tooltip>
                  </span>
                )
              } else {
                return <sapn>{params.row.statusName}</sapn>
              }
            }
          }
        ],
        operates: {
          fixed: 'right',
          list: [
            {
              label: this.$t('审核'),
              hidden(index, row) {
                // 待提交状态
                return row.status !== 1
              },
              method: (index, row) => {
                this.batchAudit(row)
              },
              code: 'MerchantBrandAudit'
            }
          ]
        },
        checked: []
      }
    }
  },
  computed: {},
  async mounted() {
    this.tabs = [
      {
        label: this.$t('全部')
      }
    ]
    this.currentTab = this.tabs[0]
    await this._initCodes()
    await this.queryMerchantList()
    await this.query()
    this.queryCount()
  },
  methods: {
    async handleGetTableList(list) {
      if (list === null || list.length === 0) {
        return
      }
      this.countWaitAudit = list[0].countWaitAudit
    },
    handleReset() {
      this.search = {}
      this.search.createTime = []
      // this.formReset('search')
    },
    onTabClick() {
      for (var i = 0; i < this.tabs.length; i++) {
        if (i.toString() === this.activeState) {
          this.currentTab = this.tabs[i]
          break
        }
      }
      this.query()
    },
    async handleSubmit() {
      const [err] = await this.formValidate('search')

      if (err) {
        return
      }
      await this.query()
      this.queryCount()
    },
    forwardToDetail(row) {
      /** 跳转到详情页面 */
      this.$router.push({
        name: 'ProductMerchantBrandListDetail',
        params: { id: row.id }
      })
    },
    _initCodes() {
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
        createTime: [createTimeBegin, createTimeEnd],
        ...params
      } = this.search
      if (createTimeBegin && createTimeEnd) {
        params.createTimeStart = createTimeBegin + ' 00:00:00'
        params.createTimeEnd = createTimeEnd + ' 23:59:59'
      }
      params.status = null
      const data = await this.$product.$api.mpApi.countBrandAuditByStatus(
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
    },
    checkedSelectable(row, index) {
      return row.status === 1
    },
    // 查询当前登录用户有权限的商家
    async queryMerchantList() {
      return this.$product.$api.merchantApi
        .queryPlatformAuthMerchantPage({ currentPage: 1, itemsPerPage: 1000 })
        .then(res => {
          this.merchantMap = res.data.listObj.reduce((rtv, item) => {
            rtv[item.merchantId] = item
            return rtv
          }, {})
        })
    },
    query() {
      const {
        createTime: [createTimeBegin, createTimeEnd],
        ...params
      } = this.search
      if (createTimeBegin && createTimeEnd) {
        params.createTimeStart = createTimeBegin + ' 00:00:00'
        params.createTimeEnd = createTimeEnd + ' 23:59:59'
      }
      params.status = this.currentTab.status
      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    },
    batchAudit(row) {
      this.dialogData.ids = []
      this.dialogData.remark = ''
      this.dialogData.status = 2 // 默认审核通过
      if (row.id) {
        this.dialogData.ids.push(row.id)
      } else if (this.table.checked) {
        for (let i = 0; i < this.table.checked.length; i++) {
          if (this.table.checked[i].status !== 1) {
            this.$message({
              type: 'warning',
              message: this.$t('errorAuditData')
            })
            return
          }
          this.dialogData.ids.push(this.table.checked[i].id)
        }
      }
      this.dialogVisible = true
    },
    hideDialog() {
      this.dialogVisible = false
    },
    confirmDialog(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var param = Object.assign({}, this.dialogData)
          this.message = this.$t('操作成功')
          return this.$product.$api.mpApi
            .updateMerchantBrandStatusByIds(param)
            .then(res => {
              if (res.code === '0') {
                this.$message({
                  showClose: true,
                  message: this.message,
                  type: 'success'
                })
                this.dialogVisible = false
                this.table.checked = []
                this.query()
              } else {
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: 'error'
                })
              }
            })
        }
      })
    }
  }
}
</script>
