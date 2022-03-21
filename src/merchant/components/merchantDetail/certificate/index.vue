<template>
  <div>
    <el-form ref="certificate" :model="certificate" :rules="rules" label-position="left" label-width="auto">
      <ody-top-title :title="$t('资质证书')" />
      <el-card v-for="(item,index) in certificate.list" :key ="index" style="margin-top: 5px">
        <ody-button v-if="index !== 0" name="MerchantManageDeleteCertificate_delCertificate" size="mini" icon="el-icon-delete" style="float: right;" code="MerchantManageDeleteCertificate" @click="delCertificate(item, index)"/>
        <el-col :span="10" :offset="6">
          <el-form-item :prop="'list.'+index+'.certificateName'" :rules="rules.certificateName" :label="$t('证书名称：')">
            <el-input
              :disabled="onlyRead"
              v-model="item.certificateName"
              :placeholder="$t('请输入证书名称')"
              name="item_certificateName"
              type="text"
              show-word-limit
              maxlength="20"/>
          </el-form-item>
          <el-form-item :prop="'list.'+index+'.periodDate'" :rules="rules.periodDate" :label="$t('证书有效期：')" >
            <el-date-picker
              :disabled="onlyRead"
              v-model="item.periodDate"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              :range-separator="$t('至')"
              name="item_periodDate"
              type="daterange"/>
          </el-form-item>
          <el-form-item :prop="'list.'+index+'.img'" :rules="rules.fileList" :label="$t('资质证书图片：')">
            <ody-upload-image v-model="item.img" :disabled="onlyRead" :file-list.sync="item.fileList" :multiple="true" :limit="10" name="item_img"/>
            <el-input v-model="item.img" name="certifucateImg" type="text" style="z-index:-99999;width:10px;" />
          </el-form-item>
          <el-form-item :label="$t('备注：')">
            <el-input
              :disabled="onlyRead"
              v-model="item.description"
              :placeholder="$t('请输入备注')"
              name="item_description"
              type="textarea"
              show-word-limit
              maxlength="100"/>
          </el-form-item>
        </el-col>
      </el-card>

      <div v-if="!onlyRead" style="text-align: center; margin-top: 10px">
        <ody-button v-show="certificate.list.length < 5" name="MerchantManageCertificateAdd_addCertificate" code="MerchantManageCertificateAdd" size="small" type="primary" @click="addCertificate">{{ $t('继续添加资质证书') }}</ody-button>
        <ody-button name="MerchantManageCertificateSave_saveCertificate" code="MerchantManageCertificateSave" size="small" type="primary" @click="saveCertificate">{{ $t('保存') }}</ody-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    orgId: {
      type: Number,
      default: null
    },
    onlyRead: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      image: null,
      certificate: {
        list: [
        ]
      },
      rules: {
        certificateName: [
          { required: true, message: '请输入证书名称', trigger: 'change' }
        ],
        periodDate: [
          { required: true, message: '请选择证书有效期', trigger: 'change' }
        ],
        fileList: [
          { required: true, message: '请选择资质证书图片', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.queryCertificate()
    },
    queryCertificate() {
      const vue = this
      const merchantService = vue.$merchant.$api.merchantService
      merchantService.queryMerchantOrgCertificateByOrgId(vue.orgId).then(res => {
        if (res && res.code === '0') {
          if (res.data.listObj && res.data.listObj.length > 0) {
            for (const index in res.data.listObj) {
              const item = res.data.listObj[index]
              vue.certificate.list.push({
                id: item.id,
                certificateName: item.certificateName,
                periodDate: [
                  vue.$portal.parseTime(item.periodBegin, '{y}-{m}-{d}'),
                  vue.$portal.parseTime(item.periodEnd, '{y}-{m}-{d}')
                ],
                fileList: [{ 'url': item.fileUrl }],
                description: item.description,
                img: item.fileUrl
              })
            }
          } else {
            vue.certificate.list.push({})
          }
        }
      })
    },
    addCertificate() {
      if (this.certificate.list.length <= 4) {
        this.certificate.list.push({})
      }
    },
    saveCertificate() {
      const vue = this
      vue.$refs['certificate'].validate((valid) => {
        if (valid) {
          const params = []
          for (const index in vue.certificate.list) {
            const item = vue.certificate.list[index]
            params.push({
              id: item.id,
              orgId: vue.orgId,
              certificateName: item.certificateName,
              fileUrl: item.fileList[0].url,
              periodBegin: item.periodDate[0],
              periodEnd: item.periodDate[1],
              description: item.description
            })
          }

          const merchantService = vue.$merchant.$api.merchantService
          var param = JSON.stringify(params)
          merchantService.batchEditMerchantOrgCertificate(param).then(res => {
            if (res && res.code === '0') {
              vue.$message.success('保存成功')
              vue.certificate.list = []
              vue.queryCertificate()
            }
          })
        }
      })
    },
    async delCertificate(item, index) {
      if (item.id) {
        await this.$merchant.$api.merchantService.deleteMerchantOrgCertificateById(item.id)
      }
      this.certificate.list.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>
