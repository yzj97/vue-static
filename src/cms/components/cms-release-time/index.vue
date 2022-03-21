<template>
  <div class="cms-release-time">
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('定时发布设置')"
      width="460px">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-form-item :label="$t('定时发布时间')" prop="date">
          <el-date-picker
            v-model="ruleForm.date"
            :placeholder="$t('选择时间')"
            name="ruleForm_date"
            style="width: 100%;"
            type="datetime"/>
        </el-form-item>

      </el-form>
      <span slot="footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('关闭') }}</el-button>
        <el-button name="handleConfirm" size="small" type="primary" @click="handleConfirm">{{ $t('确定') }}</el-button>
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
    pageId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      cmsApi: this.$cms.$api.cmsEdit,
      ruleForm: {
        date: ''
      },
      rules: {
        date: [
          { type: 'date', required: true, message: this.$t('请选择日期'), trigger: 'change' }
        ]
      }

    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleConfirm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const params = {
            id: this.pageId,
            isTimingRelease: 1,
            releaseDate: this.ruleForm.date
          }
          this.cmsApi.timedRelease(params).then(res => {
            this.$message.success(this.$t('定时发布成功'))
            this.handleClose()
            this.$emit('ok', this.ruleForm.date)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
