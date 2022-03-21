export default {
  // 普通弹框
  alert(context, self) {
    self.$alert(context, self.$t('prompt'), {
      confirmButtonText: self.$t('determine')
      // ,
      // callback: action => {
      //   self.$message({
      //     type: 'info',
      //     message: `action: ${action}`
      //   })
      // }
    })
  }
}
