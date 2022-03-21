<template>
  <section>
    <el-col>
      <label class="col-md-3 control-label" style="text-align: right">{{ $t('please_select_the_import_file') }}：</label>
      <el-input id="fileName" class="form-control" type="text" disabled="true" style="width: 300px"/><br>
    </el-col>
    <br><br><br>
    <el-col>
      <input id="fileUpload" type="file" @change="change">
      <ody-button :disabled="state" name="OdtsAreaMapping_Import_upload" code="OdtsAreaMapping_Import" type="primary" size="small" @click="upload" >{{ $t('file_upload') }}</ody-button>
      <ody-button name="OdtsAreaMapping_DownloadTemplate_downLoadTemplate" code="OdtsAreaMapping_DownloadTemplate" type="primary" size="small" @click="downLoadTemplate">{{ $t('common_import_fileModel') }}</ody-button>
    </el-col>
    <div class="text-center">
      <el-button v-if="!add" :disabled="state" name="back" type="button" class="btn btn-default" @click="back" >
        {{ $t('go_back') }}
      </el-button>
    </div>

  </section>
</template>
<script>
import channelImportResultTemplate from '@/excelFile/areaMappingImportTemplate.xlsx'
export default {
  components: {
    channelImportResultTemplate
  },
  data() {
    return {
      state: false
    }
  },
  methods: {
    downLoadTemplate() {
      this.$portal.downloadFileByGet(channelImportResultTemplate, {}, '第三方渠道导入模板.xlsx')
    },
    cancelSubmit() {
      this.dialogTableVisible = false
      this.fileUpload.fileNames = ''
    },
    handlePreview(file) {
      this.fileUpload.fileNames = file.name
    },
    back() {
      this.$router.push({
        name: 'OdtsAreaMapping'
      })
    },
    change() {
      document.getElementById('fileName').value = document.getElementById('fileUpload').value
    },
    upload: function() {
      this.state = true
      var form = new FormData()
      var file = document.getElementById('fileUpload').files[0]
      form.append('file', file)
      if (file == null) {
        this.$message({
          type: 'warn',
          message: this.$t('upload_file_not_empty')
        })
        this.state = false
        return
      }
      if (file.size / 1024 / 1024 > 4) {
        this.$message({
          type: 'warn',
          message: this.$t('files_cannot_be_larger_than' + '4M')
        })
        this.state = false
        return
      }
      var index = file.name.lastIndexOf('.')
      var suffix = file.name.substr(index + 1)
      if (suffix !== 'xls' && suffix !== 'xlsx') {
        this.$message({
          type: 'warn',
          message: this.$t('file_format_error')
        })
        this.state = false
        return
      }
      this.$odts.$api.areaMp.batchImportAreaMapping(form).then((res) => {
        if (res && res.code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('common_import_success')
          })
        }
        this.state = false
      }).catch((res) => {
        this.$message({
          type: 'error',
          message: res.data
        })
        this.state = false
      }).finally(() => {
      })
    }
  }
}
</script>
