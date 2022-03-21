<template>
  <div>
    <el-col :span="12" :offset="6">
      <el-card>
        <el-form ref="form" :model="omcInfo" label-position="left" label-width="130px">
          <el-form-item :label="$t('消息云url：')" required prop="omcUrl">
            <el-row>
              <el-col :span="5">
                <el-select v-model="httpType" name="httpType" value="">
                  <el-option value="http://" label="http://"/>
                  <el-option value="https://" label="https://"/>
                </el-select>
              </el-col>
              <el-col :span="12" :offset="1">
                <el-input v-model="omcInfo.omcUrl" name="omcInfo_omcUrl" />
              </el-col>
              <el-col :span="5" :offset="1">
                <el-input value="/open-api/" disabled/>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item :label="$t('消息云appId：')" required prop="appId">
            <el-input v-model="omcInfo.appId" name="omcInfo_appId"/>
          </el-form-item>
          <el-form-item :label="$t('消息云appSecret：')" required prop="appSecret">
            <el-input v-model="omcInfo.appSecret" name="omcInfo_appSecret"/>
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <el-button name="commit" type="primary" size="mini" @click="commit">{{ $t('保存') }}</el-button>
          <el-button name="reset" size="mini" @click="reset">{{ $t('重置') }}</el-button>
        </div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
export default {
  data() {
    return {
      omcInfo: {
        omcUrl: null,
        appId: null,
        appSecret: null
      },
      httpType: 'http://'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.omcInfo = {
        omcUrl: null,
        appId: null,
        appSecret: null
      }
      const self = this
      this.$ouser.$api.pageInfoService.getStringValue({ key: 'omcUrl' }).then(res => {
        if (res.data) {
          self.omcInfo.omcUrl = res.data.match(/\/\/.*?(?=\/)/)[0].replace('//', '')
        }
      })
      this.$ouser.$api.pageInfoService.getStringValue({ key: 'omcInfo' }).then(res => {
        const json = JSON.parse(res.data)
        self.omcInfo.appId = json.appId
        self.omcInfo.appSecret = json.appSecret
      })
    },
    reset() {
      this.init()
    },
    commit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const self = this
          const param = {
            omcUrl: this.httpType + this.omcInfo.omcUrl + '/open-api/',
            omcInfo: {
              appId: this.omcInfo.appId,
              appSecret: this.omcInfo.appSecret
            }
          }
          this.$ouser.$api.pageInfoService.updatePageConfig(param).then(res => {
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
