<template>
  <ody-dialog :visible.sync="visible" :title="$t(title)" :close-on-click-modal="false" width="600px" @close="close" @open="open">
    <el-form ref="task" label-width="160px" class="form">
      <el-form-item :label="$t('审核结果')">
        <el-radio-group v-model="task.auditStatus">
          <el-radio :label="2">审核通过</el-radio>
          <el-radio :label="3">审核不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('备注')">
        <el-input v-model="task.auditRemark" :rows="2" type="textarea" maxlength="100"/>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <div class="line-top"/>
      <el-button size="small" @click="close">{{ $t('取消') }}</el-button>
      <el-button size="small" type="primary" @click="audit">{{ $t('确认') }}</el-button>
    </span>
  </ody-dialog>
</template>
<script>
export default {
  props: {
    title: { type: String, required: false, default: '审批' },
    visible: { type: Boolean, required: true, default: false },
    auditIdList: { type: Array, required: true, default: null },
    auditStatus: { type: Number, required: false, default: null }
  },
  data() {
    return {
      task: {
        auditIdList: [],
        auditStatus: null,
        auditRemark: null
      }
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.init()
      }
    }
  },
  methods: {
    async init() {
      this.task.auditIdList = this.auditIdList
      if (!this.task.auditIdList || this.task.auditIdList.length <= 0) {
        this.$message(this.$t('至少选择一条数据'))
        this.close()
      }
      this.task.auditStatus = this.auditStatus ? this.auditStatus : 2
      this.task.auditRemark = null
    },
    open() {},
    close() {
      this.$emit('update:visible', false)
      this.$forceUpdate()
    },
    ok() {
      this.$emit('ok')
    },
    async audit() {
      const result = await this.$appdflow.$api.afTask.audit(this.task)
      if (result && result.code === '0') {
        this.$message({
          type: 'success',
          message: this.$t('审批成功')
        })
      } else {
        this.$message({
          type: 'error',
          message: this.$t('审批失败')
        })
      }
      this.close()
      this.ok()
    }
  }
}
</script>
