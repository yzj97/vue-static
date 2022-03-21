<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('order_ruleCode') + ':'" prop="code">
            <el-input v-model="searchForm.code" name="searchForm_code" maxlength="25" />
          </ody-search-item>
          <ody-search-item :label="$t('order_ruleName') + ':'" prop="name">
            <el-input v-model="searchForm.name" name="searchForm_name" maxlength="25" />
          </ody-search-item>
          <ody-search-item :label="$t('orderRule_label_type') + ':'" prop="type">
            <el-select
              v-model="searchForm.type"
              :placeholder="$t('common_all')"
              name="searchForm_type"
              @change="changeType"
            >
              <el-option
                v-for="item in typeList"
                :label="item.name"
                :key="item.name"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('orderRule_label_watchNode') + ':'" prop="watchNode">
            <el-select :placeholder="$t('common_all')" v-model="searchForm.watchNode" name="searchForm_watchNode">
              <el-option
                v-for="item in typeWatchNodeList"
                :label="item.name"
                :key="item.name"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('order_ruleMerchant') + ':'" prop="merchantId">
            <el-select v-model="searchForm.merchantId" :popper-append-to-body="false" :placeholder="$t('common_all')" name="searchForm_merchantId">
              <el-option
                v-for="item in merchantList"
                :label="item.merchantName"
                :key="item.merchantId"
                :value="item.merchantId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('isDisable') + ':'" prop="isDisable">
            <el-select v-model="searchForm.isDisable" :placeholder="$t('common_all')" name="searchForm_isDisable">
              <el-option
                v-for="item in isDisableList"
                :label="item.name"
                :key="item.code"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <ody-button name="OmsTimeoutAlertRule_Reset_handleSearchReset" code="OmsTimeoutAlertRule_Reset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</ody-button>
        <ody-button
          name="OmsTimeoutAlertRule_Query_handleSearchSubmit"
          code="OmsTimeoutAlertRule_Query"
          size="small"
          type="primary"
          @click="handleSearchSubmit"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button name="OmsTimeoutAlertRule_Add_add" code="OmsTimeoutAlertRule_Add" size="small" type="primary" @click="add">{{ $t('add') }}</ody-button>
        <ody-button
          :disabled="!checked || checked.length === 0"
          name="OmsTimeoutAlertRule_Disabled_discontinue"
          code="OmsTimeoutAlertRule_Disabled"
          size="small"
          @click="discontinue"
        >{{ $t('order_batch_disable') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="data"
          :columns="columns"
          :operates="operates"
          :multiple="true"
          :checked.sync="checked"
          :can-filter="false"
          name="data265"
          @custom-sort-change="hanleCustomSortChange"
          @selection-change="handleSelectionChange"
        />
      </div>

      <div slot="page">
        <ody-pagination
          :current-page.sync="current"
          :list="data"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="size"
          :total.sync="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
        />
      </div>
    </ody-list-table-area>
  </section>
</template>

<script>

export default {
  name: 'OmsTimeoutAlertRule',
  components: {
  },
  data() {
    const self = this
    return {
      loading: false,
      checked: [],
      data: [],
      merchantList: [],
      checkAll: false,
      searchForm: getDefaultSearchForm(),
      isDisableList: [],
      typeList: [],
      watchNodeList: [],
      typeWatchNodeList: [],
      merchantTypeList: [],
      size: 10,
      total: 1,
      current: 1,
      columns: [
        {
          show: true,
          prop: 'code',
          label: this.$t('order_ruleCode'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'name',
          label: this.$t('order_ruleName'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'type',
          label: this.$t('orderRule_label_type'),
          align: 'center',
          minWidth: 200,
          formatter: row => {
            return self.typeMap[row.type]
          }
        },
        {
          show: true,
          prop: 'watchNode',
          label: this.$t('orderRule_label_watchNode'),
          align: 'center',
          formatter: row => {
            return self.watchNodeMap[row.watchNode]
          }
        },
        {
          show: true,
          prop: 'merchantName',
          label: this.$t('order_ruleMerchant'),
          align: 'center'
        },
        {
          show: true,
          prop: 'timeoutMinutes',
          label: this.$t('orderRule_label_timeoutMinutes'),
          align: 'center',
          minWidth: 200,
          formatter: row => {
            return row.timeoutMinutes + this.$t('orderRule_label_minutes')
          }
        },
        {
          show: true,
          prop: 'endDate',
          label: this.$t('order_validity'),
          align: 'center',
          minWidth: 200,
          formatter: row => {
            return (
              this.$portal.parseTime(row.startDate, '{y}-{m}-{d}') +
              ' ' +
              this.$t('order_to') +
              ' ' +
              this.$portal.parseTime(row.endDate, '{y}-{m}-{d}')
            )
          }
        },
        {
          show: true,
          prop: 'isDisable',
          label: this.$t('isDisable'),
          align: 'center',
          minWidth: 88,
          formatter: row => {
            return self.isDisableMap[row.isDisable]
          }
        }
      ],
      operates: {
        align: 'center',
        list: [
          {
            label: this.$t('edit'),
            disabled: false,
            method(index, row) {
              self.handleEdit(index, row)
            },
            code: 'OmsTimeoutAlertRule_Edit'
          },
          {
            label: this.$t('delete'),
            method: (index, row) => {
              self.handleDel(index, row)
            },
            code: 'OmsTimeoutAlertRule_Deleted'
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 选中行
    handleSelectionChange(val) {
      // console.log('val:', val)
    },
    // 编辑
    handleEdit(index, row) {
      this.$router.push({
        name: 'OmsTimeoutAlertRuleDetail',
        params: {
          id: row.id
        }
      })
    },
    // 删除
    handleDel(index, row) {
      this.$confirm(this.$t('delete_confirm'), this.$t('prompt'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          // console.log('删除的id=>' + row.id)
          const param = []
          param.push(row.id)
          // console.log('id参数' + param)
          this.$oms.$api.timeoutAlertRule
            .timeoutAlertRuleDelete(JSON.stringify(param))
            .then(data => {
              // console.log('操作完成')
              if (data.code === '0') {
                this.$message({
                  type: 'success',
                  message: this.$t('common_delete_success')
                })
                this.updateList()
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common_cancel_success')
          })
        })
    },
    /**
     * 查询状态 启用/停用
     * 监控结点
     * 规则类型
     */
    initCodes() {
      this.$oms.$api.common
        .listByCategorysForOrder({
          categorys: ['IS_DISABLE', 'TIMEOUT_ALERT_TYPE', 'TIMEOUT_ALERT_NODE']
        })
        .then(data => {
          this.isDisableList = data.data.IS_DISABLE
          this.typeList = data.data.TIMEOUT_ALERT_TYPE
          this.typeMap = data.data.TIMEOUT_ALERT_TYPE.reduce((m, i) => {
            m[i.code] = i.name
            return m
          }, {})
          this.watchNodeList = data.data.TIMEOUT_ALERT_NODE
          this.watchNodeMap = data.data.TIMEOUT_ALERT_NODE.reduce((m, i) => {
            m[i.code] = i.name
            return m
          }, {})
          this.isDisableMap = data.data.IS_DISABLE.reduce((m, i) => {
            m[i.code] = i.name
            return m
          }, {})
          // this.validityMap = []
        })
    },
    initMerchants() {
      this.$oms.$api.common
        .merchantList({ currentPage: 1, itemsPerPage: 1000 })
        .then(data => {
          this.merchantList = data.data.listObj
          this.merchantMap = data.data.listObj.reduce((m, i) => {
            m[i.merchantId] = i.merchantName
            return m
          }, {})
        })
    },
    async handleSearchSubmit() {
      this.current = 1
      await this.updateList()
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
    deleteItem: function(row) {
      const vue = this
      this.$confirm(this.$t('delete_confirm'), this.$t('prompt'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'info'
      })
        .then(() => {
          const deleteUrl =
            vue.$oms.$api.merchantExpressConfig.merchantExpressConfigDelete
          deleteUrl(JSON.stringify([row.id])).then(data => {
            if (data.code === '0') {
              this.$message({
                type: 'success',
                message: this.$t('common_delete_success')
              })
              this.updateList()
            }
          })
        })
        .catch(() => {})
    },
    async updateList() {
      try {
        this.loading = true
        await getList(this)
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    async discontinue() {
      /* if (this.checked === [] || this.checked === '' || this.checked.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('please_choose')
        })
        return
      }*/
      for (let i = 0; i < this.checked.length; i++) {
        if (this.checked[i].isDisable === 1) {
          this.$message({
            type: 'warning',
            message: this.$t('order_can_not_disable_disabled_data')
          })
          return
        }
      }
      this.$confirm(this.$t('confirm_disable'), this.$t('prompt'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          const param = []
          this.checked.forEach(function(i) {
            param.push(i.id)
          })
          this.$oms.$api.timeoutAlertRule
            .timeoutAlertRuleBatchDsiable(JSON.stringify(param))
            .then(data => {
              if (data.code === '0') {
                this.$message({
                  type: 'success',
                  message: this.$t('common_update_success')
                })
                this.updateList()
              }
            })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: this.$t('common_cancel_success')
          // })
        })
    },
    add() {
      this.$router.push({ name: 'OmsTimeoutAlertRuleDetail', params: {}})
    },
    changeType() {
      const type = this.searchForm.type
      this.typeWatchNodeList = []
      this.searchForm.watchNode = ''
      if (type) {
        for (let i = 0; i < this.watchNodeList.length; i++) {
          const item = this.watchNodeList[i]
          if (item.parentCode === type) {
            this.typeWatchNodeList.push(item)
          }
        }
      }
    },
    init() {
      this.initCodes()
      this.initMerchants()
      this.updateList()
    }
  }
}
function getDefaultSearchForm() {
  return Object.assign(
    {},
    {
      type: '',
      watchNode: '',
      code: '',
      name: '',
      merchantId: '',
      isDisable: ''
    }
  )
}

async function getList(vue) {
  vue.checked = []
  const param = {
    page: vue.current,
    limit: vue.size,
    filters: {
      code: vue.searchForm.code,
      name: vue.searchForm.name,
      type: vue.searchForm.type,
      watchNode: vue.searchForm.watchNode,
      merchantId: vue.searchForm.merchantId,
      isDisable: vue.searchForm.isDisable
    }
  }
  const timeoutAlertRuleList = vue.$oms.$api.timeoutAlertRule
  // console.log('查询参数' + JSON.stringify(param))
  const res = await timeoutAlertRuleList.timeoutAlertRuleListPage(param)
  const data = res.data
  vue.data = data
  vue.total = res.total
}
</script>

<style lang="scss" scoped>
</style>
