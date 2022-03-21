<template>
  <div class="cp-task-analysis-analysis-list">
    <el-form :inline="true">
      <ody-left-right class="toolbar">
        <div slot="left" />
        <div slot="right">
          <ody-button
            name="viewNodeAnalysisDetail_handleViewDetail"
            size="small"
            type="primary"
            code="viewNodeAnalysisDetail"
            @click="handleViewDetail"
          >
            {{ $t('查看明细') }}
          </ody-button>
          <ody-button
            name="exportMktUserAnalysisReport_handleExportOrder"
            size="small"
            type="default"
            code="exportMktUserAnalysisReport"
            @click="handleExportOrder"
          >
            {{ $t('导出订单') }}
          </ody-button>
        </div>
      </ody-left-right>
    </el-form>
    <template v-if="taskReport.crmModelCode === 'payEndMoney'">
      <ody-table
        :can-filter="false"
        :columns="payEndMoneyTable.columns"
        :data="taskReport.userAnalysisList"
        name="taskReport_userAnalysisList245"/>
    </template>
    <template v-else-if="taskReport.crmModelCode === 'growth'">
      <ody-table
        :can-filter="false"
        :columns="growthTable.columns"
        :data="taskReport.userAnalysisList"
        name="taskReport_userAnalysisList856"/>
    </template>
    <template v-else-if="taskReport.crmModelCode === 'common'">
      <ody-table
        :can-filter="false"
        :columns="commonTable.columns"
        :data="taskReport.userAnalysisList"
        name="taskReport_userAnalysisList137"/>
    </template>

    <!-- 展示 图表 需要指定width -->
    <ody-chart :options="taskReport.options" height="300px" style="width: 880px;"/>
  </div>
</template>

<script>
export default {
  props: {
    taskReport: {
      type: Object,
      default: () => {}
    },
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
      payEndMoneyTable: {
        columns: [
          {
            label: this.$t('指标分析'),
            prop: 'indicatorName',
            show: true,
            minWidth: 80
          },
          {
            label: this.$t('会员数'),
            prop: 'userNum',
            show: true,
            minWidth: 100
          },
          {
            label: this.$t('订单金额'),
            prop: 'orderAmount',
            minWidth: 80,
            show: true
          },
          {
            label: this.$t('订单数'),
            prop: 'orderNum',
            minWidth: 80,
            show: true
          },
          {
            label: this.$t('商品件数'),
            prop: 'orderMpNum',
            minWidth: 80,
            show: true
          }
        ]
      },
      growthTable: {
        columns: [
          {
            label: this.$t('指标分析'),
            prop: 'indicatorName',
            show: true,
            minWidth: 80
          },
          {
            label: this.$t('会员数'),
            prop: 'userNum',
            show: true,
            minWidth: 100
          }
        ]
      },
      commonTable: {
        columns: [
          {
            label: this.$t('指标分析'),
            prop: 'indicatorName',
            show: true,
            minWidth: 80
          },
          {
            label: this.$t('会员数'),
            prop: 'userNum',
            show: true,
            minWidth: 100
          },
          {
            label: this.$t('订单金额'),
            prop: 'orderAmount',
            minWidth: 80,
            show: true
          },
          {
            label: this.$t('订单数'),
            prop: 'orderNum',
            minWidth: 80,
            show: true
          },
          {
            label: this.$t('商品件数'),
            prop: 'orderMpNum',
            minWidth: 80,
            show: true
          }
        ]
      }
    }
  },
  methods: {
    async handleExportOrder() {
      const { taskId, pageNodeId } = this
      await this.$portal.downloadFileByGet(`/api/obi-web/crm/report/exportAnalysisNodeOrder.do`, {
        taskId,
        pageNodeId
      })
    },
    handleViewDetail() {
      this.$emit('detail')
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-task-analysis-analysis-list {
  .toolbar {
    margin-bottom: 10px;
  }
}
</style>
