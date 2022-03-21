<template>
  <div class="cp-task-analysis-list">
    <!-- TODO: 根据接口提交表格成组件 -->
    <!-- {{ runNodeStatistics }} -->
    <template v-if="!runNodeStatistics.lastExecTime">
      <el-alert :closable="false" :title="$t('记录为空！')" type="warning" />
    </template>
    <template v-else>
      <template v-if="isDetail" class="detail">
        <el-tabs v-model="activeName" name="activeName" @tab-click="handleClick">
          <template v-if="taskReport.crmModelCode === 'payEndMoney'">
            <el-tab-pane :label="$t('会员明细')" name="first">
              <crm-task-analysis-member-detail-list
                :task-id="taskId"
                :task-status="taskStatus"
                :crm-model-code="taskReport.crmModelCode"
                :page-node-id="nodeInfo.pageNodeId"
              />
            </el-tab-pane>
            <el-tab-pane :label="$t('商品明细')" name="second">
              <crm-task-analysis-product-list
                v-if="activeName === 'second'"
                :task-id="taskId"
                :task-status="taskStatus"
                :crm-model-code="taskReport.crmModelCode"
                :page-node-id="nodeInfo.pageNodeId" />
            </el-tab-pane>
            <el-tab-pane :label="$t('会员属性分析')" name="third">
              <crm-task-analysis-member-prop-list
                v-if="activeName === 'third'"
                :task-id="taskId"
                :task-status="taskStatus"
                :crm-model-code="taskReport.crmModelCode"
                :page-node-id="nodeInfo.pageNodeId"
              />
            </el-tab-pane>
            <el-tab-pane :label="$t('售后明细分析')" name="fourth">
              <crm-task-analysis-after-sale-list
                v-if="activeName === 'fourth'"
                :task-id="taskId"
                :task-status="taskStatus"
                :crm-model-code="taskReport.crmModelCode"
                :page-node-id="nodeInfo.pageNodeId"
              />
            </el-tab-pane>
          </template>
          <template v-else-if="taskReport.crmModelCode === 'growth'">
            <el-tab-pane :label="$t('会员明细')" name="first">
              <crm-task-analysis-member-detail-list
                :task-id="taskId"
                :task-status="taskStatus"
                :crm-model-code="taskReport.crmModelCode"
                :page-node-id="nodeInfo.pageNodeId"
              />
            </el-tab-pane>
          </template>
          <template v-else-if="taskReport.crmModelCode === 'common'">
            <el-tab-pane :label="$t('会员明细')" name="first">
              <crm-task-analysis-member-detail-list
                :task-id="taskId"
                :task-status="taskStatus"
                :crm-model-code="taskReport.crmModelCode"
                :page-node-id="nodeInfo.pageNodeId"
              />
            </el-tab-pane>
            <el-tab-pane :label="$t('商品明细')" name="second">
              <crm-task-analysis-product-list
                v-if="activeName === 'second'"
                :task-id="taskId"
                :task-status="taskStatus"
                :crm-model-code="taskReport.crmModelCode"
                :page-node-id="nodeInfo.pageNodeId" />
            </el-tab-pane>
            <el-tab-pane :label="$t('会员属性分析')" name="third">
              <crm-task-analysis-member-prop-list
                v-if="activeName === 'third'"
                :task-id="taskId"
                :task-status="taskStatus"
                :crm-model-code="taskReport.crmModelCode"
                :page-node-id="nodeInfo.pageNodeId"
              />
            </el-tab-pane>
            <el-tab-pane :label="$t('售后明细分析')" name="fourth">
              <crm-task-analysis-after-sale-list
                v-if="activeName === 'fourth'"
                :task-id="taskId"
                :task-status="taskStatus"
                :crm-model-code="taskReport.crmModelCode"
                :page-node-id="nodeInfo.pageNodeId"
              />
            </el-tab-pane>
          </template>
        </el-tabs>
        <el-button name="handleBack" type="text" size="small" class="detail-back" @click="handleBack">{{ $t('返回') }}</el-button>
      </template>
      <template v-else>
        <crm-task-analysis-form
          :type="type"
          :task-report="taskReport"
          :node-info="nodeInfo"
          :run-node-statistics="runNodeStatistics"
        />
        <template v-if="type === 'analysis'">
          <crm-task-analysis-analysis-list
            :task-report="taskReport"
            :task-id="taskId"
            :task-status="taskStatus"
            :page-node-id="nodeInfo.pageNodeId"
            @detail="handleViewDetail"
          />
        </template>
        <template v-else>
          <crm-task-analysis-member-list
            :task-id="taskId"
            :task-status="taskStatus"
            :page-node-id="nodeInfo.pageNodeId"
          />
        </template>
      </template>
    </template>
  </div>
</template>

<script>
import CrmTaskAnalysisForm from '@/components/task-analysis-form'
import CrmTaskAnalysisMemberList from '@/components/task-analysis-member-list'
import CrmTaskAnalysisMemberDetailList from '@/components/task-analysis-member-detail-list'
import CrmTaskAnalysisAnalysisList from '@/components/task-analysis-analysis-list'
import CrmTaskAnalysisProductList from '@/components/task-analysis-product-list'
import CrmTaskAnalysisMemberPropList from '@/components/task-analysis-member-prop-list'
import CrmTaskAnalysisAfterSaleList from '@/components/task-analysis-after-sale-list'

export default {
  components: {
    CrmTaskAnalysisForm,
    CrmTaskAnalysisMemberList,
    CrmTaskAnalysisMemberDetailList,
    CrmTaskAnalysisAnalysisList,
    CrmTaskAnalysisProductList,
    CrmTaskAnalysisMemberPropList,
    CrmTaskAnalysisAfterSaleList
  },
  props: {
    type: {
      type: String,
      default: 'default'
    },
    taskReport: {
      type: Object,
      default: () => {}
    },
    nodeInfo: {
      type: Object,
      default: () => {}
    },
    taskId: {
      type: String,
      default: null
    },
    taskStatus: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      downloadTaskVisible: false,
      activeName: 'first',
      isDetail: false,
      runNodeStatistics: {}
    }
  },
  async mounted() {
    const { data } = await this.$crm.$api.mktTask.queryRunNodeStatistics({
      'taskId': this.taskId,
      'pageNodeId': this.nodeInfo.pageNodeId
    })

    this.runNodeStatistics = data
  },
  methods: {
    handleBack() {
      this.isDetail = false
    },
    handleViewDetail() {
      this.isDetail = true
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-task-analysis-list {
  .detail {
    position: relative;
    &-back {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>
