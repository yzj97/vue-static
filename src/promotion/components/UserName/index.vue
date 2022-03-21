<template>
  <div>
    <ody-dialog
      :visible="visible"
      :title="$t('提示')"
      width="600px">
      <span>{{ $t('这是一段信息') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">取 消</el-button>
        <el-button name="handleOk" size="small" type="primary" @click="handleOk">确 定</el-button>
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
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    handleOk() {
      this.$emit('update:visible', !this.visible)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
