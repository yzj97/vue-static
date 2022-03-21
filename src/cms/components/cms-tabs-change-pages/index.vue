<template>
  <div class="cp-tabs-change-pages">
    <div>
      <el-radio-group v-model="value" name="value">
        <el-radio :label="1">{{ $t('同页面') }}</el-radio>
        <el-radio :label="2">{{ $t('分页面') }}</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Number,
      default: 1
    }
  },
  watch: {
    value: {
      handler(val, oldValue) {
        this.$emit('input', val)
        // const that = this
        // const h = this.$createElement
        // this.$msgbox({
        //   title: '',
        //   message: h('p', null, [
        //     h('div', null, window.location.host + this.$t('显示')),
        //     h('div', { style: 'color: teal' }, '切换页签模式会丢失页签链接数据')
        //   ]),
        //   showCancelButton: true,
        //   confirmButtonText: this.$t('确定'),
        //   cancelButtonText: this.$t('取消'),
        //   beforeClose: (action, instance, done) => {
        //     if (action === 'confirm') {
        //       debugger
        //       instance.confirmButtonLoading = true
        //       instance.confirmButtonText = this.$t('执行中...')
        //       setTimeout(() => {
        //         that.$emit('input', val)
        //         done()
        //         setTimeout(() => {
        //           instance.confirmButtonLoading = false
        //           this.$emit('input', val)
        //         }, 300)
        //       }, 3000)
        //     } else {
        //       debugger
        //       done()
        //       that.$emit('input', oldValue)
        //     }
        //   }
        // }).then(action => {
        //   this.$message({
        //     type: 'info',
        //     message: 'action: ' + action
        //   })
        // })
      }
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.cp-tabs-change-pages {
  position: relative;
  z-index: 1;
}
</style>
