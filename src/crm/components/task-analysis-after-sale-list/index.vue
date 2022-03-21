<template>
  <div class="cp-task-analysis-after-sale-list">
    <el-form :inline="true">
      <ody-left-right class="toolbar">
        <div slot="left">&nbsp;</div>
        <div slot="right">
          <el-button
            name="exportMktReturnAnalysisReport_handleExport"
            size="small"
            type="default"
            code="exportMktReturnAnalysisReport"
            @click="handleExport"
          >
            {{ $t('导出报表') }}
          </el-button>
        </div>
      </ody-left-right>
    </el-form>
    <ody-table
      ref="table"
      :can-filter="false"
      :columns="table.columns"
      pagination-style="noborder"
      request-url="/obi-web/crm/report/mktReturnAnalysisReport.do"
    />
  </div>
</template>

<script>
export default {
  props: {
    taskId: {
      type: String,
      default: null
    },
    pageNodeId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      search: {
        pageNodeId: this.pageNodeId,
        taskId: this.taskId
      },
      table: {
        columns: [
          {
            label: this.$t('售后原因'),
            prop: 'returnReason',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('订单数'),
            prop: 'returnNum',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('售后商品件数'),
            prop: 'returnMpNum',
            minWidth: 180,
            show: true
          },
          {
            label: this.$t('售后金额'),
            prop: 'returnAmount',
            minWidth: 80,
            show: true
          },
          {
            label: this.$t('售后原因占比'),
            prop: 'returnReasonRate',
            minWidth: 180,
            show: true
          }
        ]
      }
    }
  },
  async mounted() {
    await this.query()
  },
  methods: {
    async handleExport() {
      const { taskId, pageNodeId } = this
      await this.$portal.downloadFileByGet(
        `/api/obi-web/crm/report/exportMktReturnAnalysisReport.do`,
        {
          taskId,
          pageNodeId
        },
        `售后明细${taskId}-${pageNodeId}.xlsx`
      )
    },
    query() {
      const { ...params } = this.search

      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-task-analysis-after-sale-list {
    padding-bottom: 10px;
    .toolbar {
      .form-select {
        display: inline-block;
        width: 100px;
      }
      margin-bottom: 10px;
    }
  }
</style>
