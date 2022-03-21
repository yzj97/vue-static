<template>
  <div class="cms-release-success">
    <el-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('温馨提示')"
      width="460px">
      <div>
        <div class="tip">{{ $t('cms-release-success-text') }}</div>
        <div>该页面将于 <span>{{ pageReleaseTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span> 发布。</div>
      </div>
      <span slot="footer">
        <el-button name="handleCancel" size="small" @click="handleCancel">{{ $t('返回') }}</el-button>
        <el-button name="handleConfirm" size="small" type="primary" @click="handleConfirm">{{ $t('取消发布') }}</el-button>
      </span>
    </el-dialog>
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
    },
    pageReleaseTime: {
      type: String,
      default: ''
    }

  },
  methods: {
    handleClose() {
      this.$message(this.$t('你可以选择返回或者取消发布'))
    },
    handleCancel() {
      this.$emit('cancel')
    },
    handleConfirm() {
      this.$emit('ok')
    }
  }
}
</script>

<style lang="less" scoped>
.tip {
  height: 36px;
  line-height: 36px;
}
</style>
