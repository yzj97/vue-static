<template>
  <div>
    <el-card style="min-width: 800px;">
      <el-row style="margin-top: 8px" type="flex">
        <el-col :span="5">
          <div style="text-align: center">
            <div style="color: #666">{{ $t('状态') }}</div>
            <div style="margin-top: 18px;margin-bottom: 15px;font-size: 1.2em">{{ statusStr(task.auditStatus) }}</div>
            <div v-if="task.status === 1 && task.auditStatus === 1">
              <ody-button code="ui" size="small" type="primary" @click="audit">{{ $t('审批') }}</ody-button>
            </div>
          </div>
        </el-col>
        <el-col :span="19" style="border-left: 1px solid #EEF5F9;padding-left: 30px;">
          <div>
            <span style="font-weight: bold;font-size: 1.1em">{{ $t('审批任务单号') }}: {{ task.auditTaskId }}</span>
            &nbsp;
            <i v-clipboard:copy="task.auditTaskId" v-clipboard:success="clipboardSuccess" class="el-icon-document-copy" size="mini" type="primary" icon="document"/>
          </div>
          <el-row style="margin-top: 15px">
            <el-col :span="5" class="row_col">
              <div>
                <span>{{ $t('商家') }}：</span>
                <span>{{ task.merchantName }}</span>
              </div>
              <div>
                <span>{{ $t('申请人') }}：</span>
                <span>{{ task.applyUsername }}</span>
              </div>
            </el-col>
            <el-col :span="5" class="row_col">
              <div>
                <span>{{ $t('审批单据') }}：</span>
                <span>{{ task.typeName }}</span>
              </div>
              <div>
                <span>{{ $t('申请时间') }}：</span>
                <!--<span>{{ task.applyTime }}</span>-->
                <span>{{ task.applyTime ? $portal.parseTime(task.applyTime, '{y}-{m}-{d} {h}:{i}:{s}') : '' }}</span>
              </div>
            </el-col>
            <el-col :span="8" class="row_col">
              <div>
                <span>{{ $t('单据编号') }}：</span>
                <span style="color: #0099FF;">{{ task.bizCode }}</span>
                <i v-clipboard:copy="task.bizCode" v-clipboard:success="clipboardSuccess" class="el-icon-document-copy" style="margin-left: 10px" size="mini" type="primary" icon="document"/>
                <span class="el-button--primary span_status">{{ statusStr(task.status) }}</span>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <!-- 审批流程进度 -->
    <ody-appdflow-progress ref="progress" :task-code="taskCode"/>
    <!-- 审核弹窗 -->
    <audit-dialog :visible.sync="auditDialogVisible" :audit-id-list="auditDialogTaskIdList" @ok="auditOk()"/>
  </div>
</template>

<script>
import AuditDialog from '@/components/EditorAuditDialog/AuditDialog'

export default {
  name: 'AppdflowTaskDetail',
  components: {
    AuditDialog
  },
  data() {
    return {
      taskCode: null,
      auditTaskId: null,
      auditDialogVisible: false,
      auditDialogTaskIdList: null,
      task: {},
      statusMap: {
        0: this.$t('放弃'),
        1: this.$t('待审批'),
        // 1: this.$t('审批中'),
        2: this.$t('审批通过'),
        3: this.$t('审批不通过'),
        4: this.$t('审批异常')
      }
    }
  },
  async mounted() {
    this.taskCode = this.$route.params.taskCode
    this.auditTaskId = this.$route.params.auditTaskId
    if (this.taskCode || this.auditTaskId) {
      try {
        await this.init()
      } catch (e) {
        console.log('init error', e)
      }
    } else {
      console.log('taskCode / auditTaskId param is null')
    }
  },
  methods: {
    async init(update) {
      const res = await this.$appdflow.$api.afTask.listPage({
        page: 1,
        limit: 1,
        filters: { code: this.taskCode, auditTaskId: this.auditTaskId }
      })
      this.task = (res.data && res.data.length > 0 ? res.data[0] : null) || {}
      if (update) {
        this.$refs.progress.reload()
      }
    },
    auditOk() {
      const vue = this
      setTimeout(function() {
        vue.init(true)
      }, 200)
    },
    statusStr(status) {
      return this.statusMap[status] || this.$t('未知')
    },
    clipboardSuccess() {
      this.$message({
        message: this.$t('复制成功'),
        type: 'success',
        duration: 1000
      })
    },
    audit() {
      this.auditDialogVisible = true
      this.auditDialogTaskIdList = [this.auditTaskId]
    }
  }
}
</script>
<style scoped>
  .row_col {
    margin-left: 10px;
    margin-bottom: 5px;
  }
  .row_col div {
    margin-top: 10px;
  }
  .span_status {
    margin-left: 10px;
    border-radius: 3px;
    padding: 5px 5px;
    font-size: 12px;
    vertical-align: middle;
    text-align: center;
    cursor: default;
  }
</style>
