<template>
  <div>
    <el-button name="commit" type="primary" size="mini" @click="commit">{{ $t('同步发货记录') }}</el-button>
  </div>
</template>

<script>
export default {
  props: {
    orderCode: {
      type: String,
      default: null
    }
  },
  methods: {
    commit() {
      const self = this
      this.$confirm(this.$t('promptConfirmOperate'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        self.$oms.$api.so.soConfirmReceive({ id: this.orderId }).then(res => {
          self.$message({
            message: self.$t('promptOperateSuccess'),
            type: 'success'
          })
          self.onSuccess()
        })
      })
    },
    onSuccess() {
      this.$emit('onSuccess')
    }
  }
}
</script>

<style scoped>

</style>
