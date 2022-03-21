<!-- 仓库模态框 -->
<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('common_choose_please')"
      width="60%"
      @open="init" >
      <section>
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="50px" class="form">
              <ody-search-item :label="$t('common_warehouse_code')" prop="warehouseCode">
                <el-input v-model="searchForm.warehouseCode" name="searchForm_warehouseCode" />
              </ody-search-item>
              <ody-search-item :label="$t('common_warehouse_name')" prop="warehouseName">
                <el-input v-model="searchForm.warehouseName" name="searchForm_warehouseName"/>
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
              name="list963"
              highlight-current-row
              @current-change="handleRowSelectionChange">
              <el-table-column :label="$t('common_warehouse_code')" align="center" prop="warehouseCode" />
              <el-table-column :label="$t('common_warehouse_name')" align="center" prop="warehouseName" />
            </el-table>
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
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
    },
    init() {
      this.handleSearchSubmit()
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    handleRowSelectionChange(val) {
      if (val) {
        const vue = this
        vue.currentRow = val
        vue.$emit('update:visible', !vue.visible)
        vue.$emit('ok', vue.currentRow)
      }
    }
  }
}
async function loadList(vue) {
  const param = {
    merchantId: vue.merchantId,
    ...vue.searchForm
  }
  const common = vue.$opms.$api.common
  const result = await common.queryWarehoueList(param)
  if (result && result.data) {
    vue.list = result.data
  }
}

function getDefaultSearchForm() {
  return Object.assign({}, {})
}
</script>

<style lang="scss" scoped>
</style>
