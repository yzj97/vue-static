<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('addAgent')"
      width="900px"
      @open="init" >
      <section class="pg-userModal-list">
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="50px" class="form">
              <ody-search-item :label="$t('cell-phone_number')" prop="mobile">
                <el-input v-model="searchForm.mobile" name="searchForm_mobile"/>
              </ody-search-item>
            </el-form>
          </div>
          <div slot="btn">
            <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
            <el-button name="handleSearchSubmit" size="small" type="primary" @click="handleSearchSubmit">{{ $t('common_select') }}</el-button>
          </div>
        </ody-list-search-area>
        <ody-list-table-area>
          <div slot="table">
            <ody-table
              :loading="loading"
              :data="list"
              :columns="columns"
              :checked.sync="checked"
              :data-key="'userId'"
              :selectable="checkedSelectable"
              :multiple="true"
              name="list355"/>
          </div>
          <div slot="page">
            <div class="block">
              <ody-pagination
                v-if="list && list.length"
                :current-page.sync="page.current"
                :list="list"
                :page-sizes="[10, 20, 30, 50, 100]"
                :page-size.sync="page.size"
                :total.sync="page.total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handlePageSizeChange"
                @current-change="handlePageCurrentChange"/>
            </div>
          </div>
        </ody-list-table-area>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <el-button :disabled="!checked || checked.length === 0" name="handleOk" size="small" type="primary" @click="handleOk">{{ $t('ok') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const self = this
    return {
      searchForm: getDefaultSearchForm(),
      loading: false,
      checked: [],
      list: [],
      page: getDefaultPage(),

      columns: [
        {
          show: true,
          prop: 'mobile',
          label: self.$t('cell-phone_number'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'innerMember',
          label: self.$t('member_type'),
          align: 'center',
          minWidth: 140,
          formatter: (row, column) => {
            return row.innerMember ? '员工用户' : '普通用户'
          }
        }
      ]
    }
  },
  methods: {
    async updateList() {
      this.checked = []
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
    handleSearchReset() {
      this.page = getDefaultPage()
      this.searchForm = getDefaultSearchForm()
    },
    async handlePageSizeChange(size) {
      try {
        this.$nextTick(function() {
          this.updateList()
        })
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    init() {
      this.checked = []
      this.handleSearchReset()
      this.handleSearchSubmit()
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    handleOk() {
      const vue = this
      if (!this.checked || this.checked.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('errorSelectAtLeastOne')
        })
      } else {
        vue.$emit('update:visible', !vue.visible)
        vue.$emit('ok', vue.checked)
      }
    },
    checkedSelectable(row, index) {
      return !row.existed
    }
  }
}
async function loadList(vue) {
  const param = {
    itemsPerPage: vue.page.size,
    currentPage: vue.page.current,
    isAvailable: 1,
    ...vue.searchForm
  }
  const common = vue.$agent.$api.common
  const result = await common.querySimpleMemberList(param)
  if (result && result.data) {
    const { data } = await vue.$agent.$api.agent.queryAgentListPage({ selectFields: ['userId'], filters: { userId: result.data.listObj.map(it => it.userId) }, page: 1, limit: 100 })
    result.data.listObj.forEach(it => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].userId === it.userId) {
          it.existed = true
          break
        }
      }
    })
    vue.list = result.data.listObj
    vue.page.total = result.data.total
  }
}

function getDefaultSearchForm() {
  return Object.assign({}, { mobile: null })
}
function getDefaultPage() {
  return {
    size: 10,
    current: 1,
    total: 0
  }
}
</script>

<style lang="less" scoped>
  .pg-userModal-list {
    .cp-search-item {
      width: 50%;
    }
  }
</style>
