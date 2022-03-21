<template>
  <UploadFile
    :title="title"
    :import-type="importType"
    :task-type="taskType"
    :file-size-limit="fileSizeLimit"
    :history-visible.sync="historyVisible"
    :check-merchant="false"
    :upload-path="uploadPath"
    :is-data-task="true"
    @beforeUpload="beforeUpload"
    @downloadTemplate="downloadTemplate">
    <template slot="top-right">
      <el-link name="showUploadHistory" type="primary" @click="showUploadHistory">{{ $t('属性上传历史') }}</el-link>
    </template>
    <template slot="upload-tip">
      <div>
        <div>{{ $t('温馨提示：') }}</div>
        <div>{{ $t('1. excel格式必须是或者xlsx或者xls，属性条数≤10000条。') }}</div>
        <div>{{ $t('2. 必填字段不能为空（必填字段名称前面带') }}<span class="error">*</span>）{{ $t('，否则将导入失败。') }}</div>
        <div>{{ $t('3. 从“属性类型”到“允许商家自定义属性值”填写属性项的基本信息；从“属性值编码”到“属性名称（第二语言）”填写属性值信息。如果同一个属性项有多个属性值，每行填写一个属性值信息。') }}</div>
      </div>
    </template>
  </UploadFile>
</template>

<script>

import UploadFile from '@/components/uploadFile'
import attributeTemplate from '@/excelFile/attributeTemplate.xlsx'
import mpApi from '@/api/mpApi.js'
export default {
  name: 'ProductAttributeBatch',
  components: {
    UploadFile
  },
  data() {
    return {
      title: this.$t('属性'),
      importType: 2,
      taskType: 'attributeImport',
      uploadPath: mpApi.importAttribute.url,
      fileSizeLimit: 4 * 1024 * 1024,
      historyVisible: false
    }
  },
  async mounted() {
  },
  methods: {
    showUploadHistory() {
      this.historyVisible = true
    },
    beforeUpload(uploadParam) {
    },
    downloadTemplate() {
      this.$portal.downloadFileByGet(attributeTemplate, {}, this.title + this.$t('导入模板') + '.xlsx')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
