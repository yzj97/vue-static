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
            <el-form ref="form" class="form">
              <ody-search-item :label="'采购计划单号'" prop="planCode">
                <el-input v-model="planCode" name="planCode" />
              </ody-search-item>
              <ody-search-item :label="'供应商'" prop="supplierName">
                {{ supplierName }}
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
              name="list012"
              highlight-current-row
              @current-change="handleSelectionChange">
              <el-table-column :label="'计划类型'" align="center" prop="planTypeText" />
              <el-table-column :label="'计划单号'" align="center" prop="planCode" />
              <el-table-column :label="'计划开始日'" align="center" prop="planStartDate" />
              <el-table-column :label="'计划截止日'" align="center" prop="planExpiryDate" />
              <el-table-column :label="'创建人'" align="center" prop="createUsername" />
              <el-table-column :label="'创建时间'" align="center" prop="createTime" />
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
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_return') }}</el-button>
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
    supplierCode: {
      type: String,
      default: null
    },
    supplierName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentRow: {},
      list: [],
      planCode: null,
      page: {
        size: 10,
        current: 1,
        total: 0
      }
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
      this.planCode = ''
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
      this.checked = []
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
    page: vue.page.current,
    limit: vue.page.size,
    filters: {
      planCode: vue.planCode ? vue.planCode : null,
      defaultSupplierCode: vue.supplierCode
    }
  }
  await vue.$portal.post('/opms-web/purchasePlan/listPageFilterStatus.do', param).then(result => {
    if (result && result.data) {
      vue.list = result.data
      vue.page.total = result.total
    }
  })
}
</script>

<style lang="scss" scoped>

</style>
