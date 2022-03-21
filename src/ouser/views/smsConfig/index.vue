<template>
  <div>
    <el-card>
      <el-form
        ref="form"
        :model="obj"
        :rules="rules"
        label-width="230px"
        label-position="right">
        <el-form-item :label="$t('每日单个手机号最大短信次数:')" required prop="everydayMobileCount">
          <el-input v-model="obj.everydayMobileCount" name="obj_everydayMobileCount" size="mini" type="number"/>
        </el-form-item>
        <el-form-item :label="$t('每日单个ip最大短信次数:')" required prop="everydayIpCount">
          <el-input v-model="obj.everydayIpCount" name="obj_everydayIpCount" size="mini" type="number"/>
        </el-form-item>
        <el-form-item :label="$t('两次发送短信的时间间隔（秒）:')" required prop="continuitySendTime">
          <el-input v-model="obj.continuitySendTime" name="obj_continuitySendTime" size="mini" type="number"/>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button name="commit" size="mini" type="primary" @click="commit">{{ $t('保存') }}</el-button>
        <el-button name="init" size="mini" @click="init">{{ $t('重置') }}</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      obj: {},
      rules: {}
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const self = this
      this.$ouser.$api.pageInfoService.getStringValue({ key: 'captchas' }).then(res => {
        const json = JSON.parse(res.data)
        self.obj = json
      })
    },
    commit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const self = this
          this.$ouser.$api.pageInfoService.updatePageConfig({ captchas: JSON.stringify(this.obj) }).then(res => {
            self.$message({
              message: '保存成功',
              type: 'success'
            })
            self.init()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
