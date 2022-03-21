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
        <el-form ref="form" label-width="100px" class="form" />
      </div>
      <div slot="btn">
        <ody-button name="OmsSoSplitRule_Reset_handleSearchReset" code="OmsSoSplitRule_Reset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</ody-button>
        <ody-button
          name="OmsSoSplitRule_Query_handleSearchSubmit"
          code="OmsSoSplitRule_Query"
          size="small"
          type="primary"
          @click="handleSearchSubmit"
        >{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button name="OmsSoSplitRule_Add_add" code="OmsSoSplitRule_Add" size="small" type="primary" @click="add">{{ $t('add') }}</ody-button>
        <ody-button
          :disabled="checked.length == 0"
          name="OmsSoSplitRule_Disabled_discontinue"
          code="OmsSoSplitRule_Disabled"
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
          name="data945"
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
  name: 'OmsSoSplitRule',
  components: {},
  data() {
    const self = this
    return {
      loading: false,
      checked: [],
      data: [],
      searchForm: getDefaultSearchForm(),
      auditReasonList: [],
      isDisableList: [],
      merchantList: [],
      size: 10,
      total: 1,
      current: 1,
      columns: [
        {
          show: true,
          prop: 'priority',
          label: this.$t('order_priority'),
          align: 'center'
        },
        {
          show: true,
          prop: 'code',
          label: this.$t('order_ruleCode'),
          align: 'center'
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
          prop: 'isDisable',
          label: this.$t('isDisable'),
          align: 'center',
          minWidth: 88,
          formatter: (row, column, cellValue) => {
            return self.isDisableMap[row.isDisable]
          }
        }
      ], // 需要展示的列
      operates: {
        fixed: 'right',
        list: [
          {
            label: this.$t('edit'),
            disabled: false,
            method(index, row) {
              self.handleEdit(index, row)
            },
            code: 'OmsSoSplitRule_Edit'
          },
          {
            label: this.$t('delete'),
            disabled: false,
            method(index, row) {
              self.handleDel(index, row)
            },
            code: 'OmsSoSplitRule_Deleted'
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 编辑
    handleEdit(index, row) {
      this.$router.push({
        name: 'OmsSoSplitRuleDetail',
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
          this.$oms.$api.soSplitRule
            .soSplitRuleDelete({
              id: row.id
            })
            .then(data => {
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
          /* this.$message({
            type: 'info',
            message: this.$t('common_cancel_success')
          })*/
        })
    },
    async initCodes() {
      const res = await this.$oms.$api.common.listByCategorysForOrder({
        categorys: ['IS_DISABLE']
      })
      if (res) {
        this.isDisableList = res.data.IS_DISABLE
        this.isDisableMap = res.data.IS_DISABLE.reduce((m, i) => {
          m[i.code] = i.name
          return m
        }, {})
      }
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
          var param = []
          this.checked.forEach(function(i) {
            param.push(i.id)
          })
          this.$oms.$api.soSplitRule
            .soSplitRuleBatchDsiable(JSON.stringify(param))
            .then(data => {
              if (data.code === '0') {
                this.$message({
                  type: 'success',
                  message: this.$t('common_save_success')
                })
                this.updateList()
              }
            })
        })
        .catch(() => {
          /* this.$message({
            type: 'info',
            message: this.$t('common_cancel_success')
          })*/
        })
    },
    add() {
      this.$router.push({
        name: 'OmsSoSplitRuleDetail'
      })
    },
    async init() {
      await this.initCodes()
      this.updateList()
    }
  }
}

function getDefaultSearchForm() {
  return Object.assign({}, {})
}

async function getList(vue) {
  vue.checked = []
  const param = {
    page: vue.current,
    limit: vue.size,
    filters: vue.searchForm
  }
  const soAudit = vue.$oms.$api.soSplitRule
  const res = await soAudit.soSplitRuleListPage(param)
  const data = res.data
  vue.data = data
  vue.total = res.total
}
</script>

<style lang="scss" scoped>
</style>
