<template>
  <div class="cp-task-analysis-form">
    <el-form ref="form" :model="form" class="form">
      <el-form-item :label="$t('节点名称:')">{{ nodeInfo.nodeName }}</el-form-item>
      <el-row>
        <template v-if="type === 'sendBy'">
          <el-col :span="8">
            <el-form-item
              :label="$t('提交会员数:')"
            >{{ runNodeStatistics.totalCount | empty('0') | currency("", 0) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="$t('发送成功会员数:')"
            >{{ runNodeStatistics.successCount | empty('0') | currency("", 0) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="$t('发送失败会员数:')"
            >{{ runNodeStatistics.failCount | empty('0') | currency("", 0) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('发送成功率:')">{{ runNodeStatistics.successRate }} %</el-form-item>
          </el-col>
        </template>
        <template v-if="type === 'analysis'">
          <template v-if="taskReport.crmModelCode === 'payEndMoney'">
            <el-col :span="8">
              <el-form-item :label="$t('触达方式:')">{{ taskReport.touchTypeStr }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('营短信成本:')">{{ taskReport.smsCost | currency('¥', 2) }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('覆盖会员数:')">{{ taskReport.coverUserNum }} {{ $t('人') }}</el-form-item>
            </el-col>
          </template>
          <template v-else-if="taskReport.crmModelCode === 'growth'">
            <el-col :span="8">
              <el-form-item :label="$t('触达方式:')">{{ taskReport.touchTypeStr }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('营短信成本:')">{{ taskReport.smsCost | currency('¥', 2) }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('覆盖会员数:')">
                {{ taskReport.coverUserNum }}
                {{ $t('人') }}
              </el-form-item>
            </el-col>
          </template>
          <template v-if="taskReport.crmModelCode === 'common'">
            <el-col :span="8">
              <el-form-item :label="$t('投入产出比:')">{{ taskReport.roi }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('触达方式:')">{{ taskReport.touchTypeStr }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('营短信成本:')">{{ taskReport.smsCost | currency('¥', 2) }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('覆盖会员数:')">{{ taskReport.coverUserNum }} {{ $t('人') }}</el-form-item>
            </el-col>
          </template>
        </template>
        <template v-else>
          <el-col :span="24">
            <el-form-item :label="$t('数据统计时间:')">{{ runNodeStatistics.lastExecTime | parseTime }}</el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
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
    runNodeStatistics: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      options: [
        {
          value: '0',
          label: this.$t('全部')
        },
        {
          value: '1',
          label: this.$t('发送成功')
        },
        {
          value: '2',
          label: this.$t('发送失败')
        }
      ]
    }
  },

  methods: {}
}
</script>

<style lang="scss" scoped>
.cp-task-analysis-form {
  .form {
    position: relative;
    &-select {
      float: left;
    }
  }
}
</style>
