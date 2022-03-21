<template>
  <UploadFile
    :title="title"
    :type="type"
    :type-alias="typeAlias"
    :platform-type="dataType"
    :template-path="templatePath"
    :upload-path="uploadPath"
    :import-type="importType"
    :task-type="taskType"
    :is-data-task="true"
    :show-message-detail="false"
    :check-merchant="checkMerchant"
    :file-size-limit="200 * 1024 * 1024"
    @beforeUpload="beforeUpload"
    @downloadTemplate="downloadTemplate">
    <template slot="upload-right">
      <el-checkbox v-model="override" :label="$t('是否覆盖已存在的商品图片')" name="override" @change="onChange"/>
    </template>
    <template slot="upload-tip">
      <div>
        <div>{{ $t('温馨提示：') }}</div>
        <div>{{ $t('1. 上传时，如果选择覆盖已存在的商品图片，则将已有图片全部清除，并更新本次上传图片；如果不覆盖，则跳过已经上传的商品图片。') }}</div>
        <div>{{ $t('2. 压缩文件命名没有要求，里面包含的文件夹必须以SPU编码命名；如果要上传多规格商品下的SKU主图，则在该文件夹下面创建子文件夹，子文件夹必须以SKU编码命名。') }}</div>
        <div>{{ $t('3. 商品上传时，如果当前商品没有主图，则以SPU编码命名的图片设置为商品主图；若未找到，则以文件名升序后的第一张为默认为主图。') }}</div>
        <div>{{ $t('4. 父级文件夹下面的子文件夹‘H5商详图’和‘PC商详图’，分别用于上传图片到H5端和PC端的商品详情页，文件夹下支持上传多个图片，用于更新SPU的商品详情页图片。如果上传方式是覆盖，则将已有商详内容（包括图片、文字等）全部清除，并按照图片文件名升序的顺序进行上传；如果是不覆盖，则跳过已有商详内容的商品进行上传。') }}</div>
        <div>{{ $t('注意：如果商详图文件夹不存在，或者商详图文件夹下面没有图片，不更新商品描述（即商品详情信息）。') }}</div>
        <div>{{ $t('5. 每个SPU最多支持上传10张图片，每个SKU只能上传一张图片；图片格式支持JPG、JPEG、PNG、GIF格式。') }}</div>
        <div>{{ $t('6. 单张图片小于或者等于2M。') }}</div>
      </div>
    </template>
  </UploadFile>
</template>

<script>

import UploadFile from '@/components/uploadFile'
import imgImport from '@/excelFile/imageImport.zip'

export default {
  name: 'ImgBatch',
  components: {
    UploadFile
  },
  data() {
    return {
      title: this.$t('图片'),
      dataType: 1,
      importType: -1,
      taskType: 'imgImport',
      type: '.zip',
      typeAlias: 'zip',
      uploadPath: '/back-product-web/back/mp/batchCreateProduct/importMpImg.do',
      override: false,
      checkMerchant: false
    }
  },
  async mounted() {
    this.dataType = this.$route.query.dataType
    this.checkMerchant = this.dataType > 1
  },
  methods: {
    beforeUpload(uploadParam) {
      uploadParam.append('override', this.override)
      uploadParam.append('taskType', this.taskType)
    },
    downloadTemplate() {
      this.$portal.downloadFileByGet(imgImport, {}, this.title + this.$t('导入模板') + '.zip')
    },
    onChange() {
      console.log(this.override)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
