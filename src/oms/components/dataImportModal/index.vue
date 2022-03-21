<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('data_import_failed_list')"
      @open="init" >
      <section class="pg-dataImportModal-list">
        <ody-list-table-area>
          <div slot="table">
            <ody-table
              :loading="loading"
              :data="list"
              :columns="columns"
              name="list908"
            />
          </div>
          <div slot="page">
            <div class="block">
              <ody-pagination
                :current-page.sync="page.current"
                :list="list"
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
        <el-button name="handleClose" @click="handleClose">{{ $t('common_cancel') }}</el-button>
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
    filters: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },

      columns: [
        {
          show: true,
          prop: 'line',
          label: this.$t('data_import_line'),
          align: 'center',
          minWidth: 40
        },
        {
          show: true,
          prop: 'failedReason',
          label: this.$t('data_import_failed_reason'),
          minWidth: 300
        }
      ]
    }
  },
  watch: {

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
      this.updateList()
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    }
  }
}
async function loadList(vue) {
  const param = {
    limit: vue.page.size,
    page: vue.page.current,
    filters: vue.filters,
    sorts: [
      {
        field: 'line',
        asc: true
      }
    ]
  }
  const dataImport = vue.$oms.$api.dataImport
  const result = await dataImport.queryDataImportListPage(param)
  vue.list = result.data
  vue.page.total = result.total
}

</script>

<style lang="scss" scoped>

</style>
