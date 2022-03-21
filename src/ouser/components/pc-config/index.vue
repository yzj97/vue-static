<template>
  <div>
    <el-col :span="10" :offset="8">
      <el-card>
        <el-form
          ref="form"
          :model="obj"
          :rules="rules"
          label-width="140px"
          label-position="right">
          <el-form-item :label="$t('网站域名:')" required prop="websiteDomain">
            <el-input v-model="obj.websiteDomain" name="obj_websiteDomain" size="mini"/>
          </el-form-item>
          <el-form-item :label="$t('网站名称:')" required prop="websiteName">
            <el-input v-model="obj.websiteName" name="obj_websiteName" size="mini"/>
          </el-form-item>
          <el-form-item :label="$t('网站标题:')" required prop="websiteTitle">
            <el-input v-model="obj.websiteTitle" name="obj_websiteTitle" size="mini"/>
          </el-form-item>
          <el-form-item :label="$t('工作时间显示名称:')" required prop="footerWorktimeName">
            <el-input v-model="obj.footerWorktimeName" name="obj_footerWorktimeName" size="mini"/>
          </el-form-item>
          <el-form-item :label="$t('工作时间:')" required prop="footerWorktime">
            <el-input v-model="obj.footerWorktime" name="obj_footerWorktime" size="mini"/>
          </el-form-item>
          <el-form-item :label="$t('联系电话显示名称:')" required prop="footerPhoneName">
            <el-input v-model="obj.footerPhoneName" name="obj_footerPhoneName" size="mini"/>
          </el-form-item>
          <el-form-item :label="$t('联系电话:')" required prop="footerPhoneArray">
            <el-input v-model="obj.footerPhoneArray" name="obj_footerPhoneArray" size="mini"/>
          </el-form-item>
          <el-form-item label="CopyRight:" required prop="websiteRight">
            <el-input
              v-model="obj.websiteRight"
              name="obj_websiteRight"
              size="mini"
              type="textarea"
            />
          </el-form-item>
          <el-form-item :label="$t('网站favicon:')" required prop="websiteFavicon">
            <ody-upload-image :file-list.sync="obj.websiteFavicon" :pic-type="['png']" :show-tip="true"/>
          </el-form-item>
          <el-form-item :label="$t('网站logo:')" required prop="websiteLogo">
            <ody-upload-image :file-list.sync="obj.websiteLogo" :pic-type="['png']" :show-tip="true"/>
          </el-form-item>
          <el-form-item :label="$t('个人中心logo:')" required prop="personPageLogo">
            <ody-upload-image :file-list.sync="obj.personPageLogo" :pic-type="['png']" :show-tip="true"/>
          </el-form-item>
          <el-form-item :label="$t('loading图标:')" required prop="websiteLoading">
            <ody-upload-image :file-list.sync="obj.websiteLoading" :pic-type="['gif']" :show-tip="true"/>
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <el-button name="commit" size="mini" type="primary" @click="commit">{{ $t('保存') }}</el-button>
          <el-button name="init" size="mini" @click="init">{{ $t('重置') }}</el-button>
        </div>
      </el-card>
    </el-col>
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
      this.$ouser.$api.pageInfoService.getStringValue({ key: 'frontBasicSetting' }).then(res => {
        const json = JSON.parse(res.data)
        self.obj = json
        self.obj.websiteFavicon = [{ url: json.websiteFavicon }]
        self.obj.websiteLogo = [{ url: json.websiteLogo }]
        self.obj.personPageLogo = [{ url: json.personPageLogo }]
        self.obj.websiteLoading = [{ url: json.websiteLoading }]
        if (json.footerPhoneArray && json.footerPhoneArray.length > 0) {
          self.obj.footerPhoneArray = json.footerPhoneArray[0]
        }
      })
    },
    commit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const self = this
          this.obj.websiteFavicon = this.obj.websiteFavicon[0].url
          this.obj.websiteLogo = this.obj.websiteLogo[0].url
          this.obj.personPageLogo = this.obj.personPageLogo[0].url
          this.obj.websiteLoading = this.obj.websiteLoading[0].url
          this.obj.footerPhoneArray = [this.obj.footerPhoneArray]
          this.$ouser.$api.pageInfoService.updatePageConfig({ frontBasicSetting: JSON.stringify(this.obj) }).then(res => {
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
