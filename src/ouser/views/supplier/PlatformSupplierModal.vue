<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('common_choose_please')"
      width="60%"
      @open="init"
    >
      <section>
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="50px" class="form">
              <ody-search-item :label="$t('common_supplier_code')" prop="orgCode">
                <el-input v-model="searchForm.orgCode" name="searchForm_orgCode" maxlength="50" />
              </ody-search-item>
              <ody-search-item :label="$t('common_supplier_name')" prop="orgName">
                <el-input v-model="searchForm.orgName" name="searchForm_orgName" maxlength="100" />
              </ody-search-item>
            </el-form>
          </div>
          <div slot="btn">
            <el-button
              name="handleSearchSubmit"
              size="small"
              type="primary"
              @click="handleSearchSubmit"
            >{{ $t('common_search') }}</el-button>
            <el-button
              name="handleSearchReset"
              size="small"
              @click="handleSearchReset"
            >{{ $t('common_reset') }}</el-button>
          </div>
        </ody-list-search-area>
        <ody-list-table-area>
          <div slot="table">
            <el-table
              :data="list"
              name="list355"
              highlight-current-row
              @current-change="handleSelectionChange"
            >
              <el-table-column :label="$t('common_supplier_code')" align="center" prop="orgCode" />
              <el-table-column :label="$t('common_supplier_name')" align="center" prop="orgName" />
            </el-table>
          </div>
          <div slot="page">
            <div class="block">
              <ody-pagination
                :current-page.sync="page.current"
                :page-sizes="[10, 20, 30, 50]"
                :page-size.sync="page.size"
                :total.sync="page.total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handlePageSizeChange"
                @current-change="handlePageCurrentChange"
              />
            </div>
          </div>
        </ody-list-table-area>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_cancel') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  name: 'PlatformSupplierModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchForm: getDefaultSearchForm(),
      loading: false,
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      currentRow: {}
    }
  },
  methods: {
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
    handleSearchReset() {
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
      this.handleSearchSubmit()
    },
    handleClose() {
      this.handleSearchReset()
      this.$emit('update:visible', !this.visible)
    },
    handleSelectionChange(val) {
      if (val) {
        const vue = this
        vue.currentRow = val
        this.handleSearchReset()
        vue.$emit('update:visible', !vue.visible)
        vue.$emit('ok', vue.currentRow)
      }
    }
  }
}
async function loadList(vue) {
  const param = {
    itemsPerPage: vue.page.size,
    currentPage: vue.page.current,
    status: 1, // 查询启用的供应商
    orgType: 7,
    bussinessType: 2, // 查询集采的供应商
    isPlatformSupplier: 0
  }

  if (vue.searchForm.orgCode) {
    param.orgCode = vue.searchForm.orgCode
  }
  if (vue.searchForm.orgName) {
    param.orgName = vue.searchForm.orgName
  }

  vue.$ouser.$api.supplier.queryDistributionByPageInfo(param).then(resp => {
    vue.list = resp.data.listObj
    vue.page.total = resp.data.total
  })
}

function getDefaultSearchForm() {
  return Object.assign({}, {})
}
</script>

<style scoped>
</style>
