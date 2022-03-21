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
          <el-form-item :label="$t('网站标题:')" required prop="websiteTitle">
            <el-input v-model="obj.websiteTitle" name="obj_websiteTitle" size="mini"/>
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
      this.$ouser.$api.pageInfoService.getStringValue({ key: 'adminSetting' }).then(res => {
        const json = JSON.parse(res.data)
        self.obj = json
        self.obj.websiteFavicon = [{ url: json.websiteFavicon }]
        self.obj.websiteLogo = [{ url: json.websiteLogo }]
        self.obj.websiteLoading = [{ url: json.websiteLoading }]
      })
    },
    async commit() {
      // 修改成promise，等接口返回再提交
      const [err] = await this.formValidate('form')
      if (err) {
        return
      }

      // 通过解构，不破坏原始数据
      const {
        websiteFavicon: [{ url: websiteFavicon }],
        websiteLogo: [{ url: websiteLogo }],
        websiteLoading: [{ url: websiteLoading }],
        ...params
      } = this.obj

      params.websiteFavicon = websiteFavicon || ''
      params.websiteLogo = websiteLogo || ''
      params.websiteLoading = websiteLoading || ''

      const res = await this.$ouser.$api.pageInfoService.updatePageConfig({ adminSetting: params })

      if (res) {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.init()
      }
    }
  }
}
</script>

<style scoped>

</style>
