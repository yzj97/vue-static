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
          <el-form-item :label="$t('公司名称:')" prop="companyName">
            <el-input v-model="obj.companyName" name="obj_companyName" size="mini"/>
          </el-form-item>
          <el-form-item :label="$t('公司全称:')" prop="fullCompanyName">
            <el-input v-model="obj.fullCompanyName" name="obj_fullCompanyName" size="mini"/>
          </el-form-item>
          <el-form-item :label="$t('公司logo:')" prop="logo">
            <ody-upload-image :file-list.sync="obj.logo" :pic-type="['png']" :show-tip="true"/>
          </el-form-item>
          <el-form-item :label="$t('公司简称:')" prop="shortCompanyName">
            <el-input v-model="obj.shortCompanyName" name="obj_shortCompanyName" size="mini"/>
          </el-form-item>
          <el-form-item :label="$t('客服电话:')" prop="contact">
            <el-input v-model="obj.contact" name="obj_contact" size="mini"/>
          </el-form-item>
          <el-form-item :label="$t('客服电话 2:')" prop="contactWithDash">
            <el-input v-model="obj.contactWithDash" name="obj_contactWithDash" size="mini"/>
          </el-form-item>
          <el-form-item :label="$t('客服分机:')" prop="contactExt">
            <el-input v-model="obj.contactExt" name="obj_contactExt" size="mini"/>
          </el-form-item>
          <el-form-item :label="$t('工作时间:')" prop="workingHours">
            <el-input v-model="obj.workingHours" name="obj_workingHours" size="mini"/>
          </el-form-item>
          <el-form-item :label="$t('服务热线:')" prop="hotline">
            <el-input v-model="obj.hotline" name="obj_hotline" size="mini"/>
          </el-form-item>
          <el-form-item :label="$t('联系电话:')" prop="contactToDial">
            <el-input v-model="obj.contactToDial" name="obj_contactToDial" size="mini"/>
          </el-form-item>
          <el-form-item :label="$t('版本信息:')" prop="copyright">
            <el-input v-model="obj.copyright" name="obj_copyright" size="mini"/>
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
      rules: {
        companyName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        fullCompanyName: [
          { required: true, message: '请输入公司全称', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '请输入公司logo', trigger: 'blur' }
        ],
        shortCompanyName: [
          { required: true, message: '请输入公司简称', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const self = this
      this.$ouser.$api.pageInfoService.getStringValue({ key: 'h5Setting' }).then(res => {
        const json = JSON.parse(res.data)
        self.obj = json
        self.obj.logo = [{ url: json.logo }]
      })
    },
    commit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const self = this
          this.obj.logo = this.obj.logo[0].url
          this.$ouser.$api.pageInfoService.updatePageConfig({ h5Setting: JSON.stringify(this.obj) }).then(res => {
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
