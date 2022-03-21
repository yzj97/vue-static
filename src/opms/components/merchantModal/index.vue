<!-- 商家名称模态框 -->
<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('common_choose_please')"
      width="960px"
      @open="init" >
      <section>
        <el-form ref="form" :inline="true">
          <el-form-item :label="$t('common_merchant_code')">
            <el-input v-model="searchForm.merchantCode" name="searchForm_merchantCode" />
          </el-form-item>
          <el-form-item :label="$t('common_merchant_name')">
            <el-input v-model="searchForm.merchantName" name="searchForm_merchantName"/>
          </el-form-item>
          <el-form-item>
            <el-button name="handleSearchSubmit" size="small" type="primary" @click="handleSearchSubmit">{{ $t('common_search') }}</el-button>
            <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
          </el-form-item>
        </el-form>
        <ody-list-table-area>
          <div slot="table" style="max-height: 580px;overflow-y: auto;">
            <el-table
              :data="list"
              name="list781"
              highlight-current-row
              @current-change="handleSelectionChange">
              <el-table-column :label="$t('common_merchant_code')" align="center" prop="merchantCode" />
              <el-table-column :label="$t('common_merchant_name')" align="center" prop="merchantName" />
              <el-table-column :label="$t('common_merchant_merchantType')" align="center" prop="merchantTypeName" />
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
    merchantCode: vue.searchForm.merchantCode,
    merchantName: vue.searchForm.merchantName
  }
  const common = vue.$opms.$api.common
  const result = await common.queryPlatformAuthMerchantPage(param)
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
