<template>
  <div>
    <ody-dialog
      :title="$t('文件任务列表')"
      :visible.sync="visible"
      :append-to-body="true"
      size="small"
      width="960px"
      @close="close"
      @opened="init"
    >
      <ody-table
        ref="table"
        :columns="table.columns"
        :operates="table.operates"
        :can-filter="false"
        request-url="/crm-web/importTask/listPage"
        request-page-type="page"
      />
    </ody-dialog>
  </div>
</template>

<script>
export default {
  name: 'CrmImportTaskDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      table: {
        columns: [
          {
            label: this.$t('任务编号'),
            prop: 'id',
            show: true,
            align: 'center',
            minWidth: 150
          },
          {
            label: this.$t('任务状态'),
            prop: 'statusStr',
            show: true,
            align: 'center',
            minWidth: 120
          },
          {
            label: this.$t('任务开始时间'),
            prop: 'timeStartStr',
            show: true,
            align: 'center',
            minWidth: 160
          },
          {
            label: this.$t('任务结束时间'),
            prop: 'timeEndStr',
            show: true,
            align: 'center',
            minWidth: 160
          },
          {
            label: this.$t('总记录数'),
            prop: 'totalNum',
            show: true,
            align: 'center',
            minWidth: 120
          },
          {
            label: this.$t('成功记录数'),
            prop: 'successNum',
            show: true,
            align: 'center',
            minWidth: 150
          },
          {
            label: this.$t('失败记录数'),
            prop: 'failNum',
            show: true,
            align: 'center',
            minWidth: 150
          }
        ],
        operates: {
          width: 120,
          fixed: 'right',
          align: 'center',
          list: [
            {
              label: this.$t('下载结果'),
              hidden: (index, row) => {
                return row.status === 1 || row.status === 2
              },
              method: (index, row) => {
                this.$portal.downloadFileByGet(row.filePath, {}, this.$t('发卡清单.xlsx'))
              }
            }
          ]
        }
      }
    }
  },
  methods: {
    async init() {
      await this.query()
    },
    query() {
      const params = {
        filters: {
          type: 1
        }
      }

      // 有值才传递
      return this.$refs.table.getList(params)
    },
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>

</style>
