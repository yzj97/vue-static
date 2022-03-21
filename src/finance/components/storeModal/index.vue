<!-- 商家名称模态框 -->
<template>
  <div>
    <ody-dialog
      ref="multipleTable"
      :visible="visible"
      :before-close="handleClose"
      :title="$t('common_choose_please')"
      width="60%"
      @open="init" >
      <section>
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="50px" class="form">
              <ody-search-item :label="$t('common_store_code')" prop="storeCode">
                <el-input v-model="searchForm.storeCode" name="searchForm_storeCode" />
              </ody-search-item>
              <ody-search-item :label="$t('common_store_name')" prop="storeName">
                <el-input v-model="searchForm.storeName" name="searchForm_storeName"/>
              </ody-search-item>
            </el-form>
          </div>
          <div slot="btn">
            <el-button name="handleSearchSubmit" size="small" type="primary" @click="handleSearchSubmit">{{ $t('common_search') }}</el-button>
            <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
          </div>
        </ody-list-search-area>
        <ody-list-table-area>
          <div slot="table">
            <el-table
              :data="list"
              name="list231"
              highlight-current-row
              @current-change="handleRowSelectionChange">
              <el-table-column :label="$t('common_store_code')" align="center" prop="storeCode" />
              <el-table-column :label="$t('common_store_name')" align="center" prop="storeName" />
              <el-table-column :label="$t('common_store_type')" align="center" prop="storeTypeName" />
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
                @current-change="handlePageCurrentChange"/>
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
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    merchantId: {
      type: Number,
      default: null
    },
    merchantCode: {
      type: String,
      default: ''
    },
    needMerchant: {
      type: Boolean,
      default: true
    },
    multiSelect: {
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
      if (this.needMerchant && !this.merchantId && !this.merchantCode) {
        this.$message({
          type: 'warn',
          message: this.$t('common_please_choose_merchant')
        })
        return
      }

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
      this.$emit('update:visible', !this.visible)
    },
    handleRowSelectionChange(row) {
      const vue = this
      if (row) {
        vue.currentRow = row
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
    merchantId: vue.merchantId
  }
  if (vue.merchantCode) {
    param.merchantCode = vue.merchantCode
  }
  if (vue.searchForm.storeCode) {
    param.storeCode = vue.searchForm.storeCode
  }
  if (vue.searchForm.storeName) {
    param.storeName = vue.searchForm.storeName
  }
  const common = vue.$finance.$api.common
  const result = await common.queryStoreList(param)
  if (result && result.data) {
    const data = result.data
    vue.list = data.listObj
    vue.page.total = data.total
  }
}

function getDefaultSearchForm() {
  return Object.assign({}, {})
}
</script>

<style lang="scss" scoped>

</style>
