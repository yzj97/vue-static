<template>
  <div>
    <el-row align="left">
      <el-col span="2">
        <el-form-item :label="$t('common_attachment')"/>
      </el-col>
      <el-col span="10">
        <el-form-item>
          <el-upload
            v-if="editable"
            :on-success="handleOnSuccess"
            :on-remove="handleOnRemove"
            :disabled="!editable"
            :with-credentials="true"
            :limit="100"
            :file-list="attachments"
            :action="uploadAction"
            class="upload-demo"
            multiple
          >
            <i v-show="editable" class="el-icon-plus"/>
          </el-upload>
          <div v-if="!editable">
            <div v-for="item in attachments" :key="item.name">
              <el-link type="primary"><a name="download" href="#" @click="download(item)">{{ item.name }}</a></el-link>
            </div>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    editable: {
      type: Boolean,
      default: false
    },
    attachments: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      uploadAction: '/api/back-finance-web/fileUploadController/uploadFile.do'
    }
  },
  methods: {
    download(item) {
      this.$portal.downloadFileByGet(item.url, {}, item.name)
    },
    handleOnSuccess(res, file, fileList) {
      this.attachments.push({
        id: file.uid,
        name: res.data.fileName,
        url: res.data.fileURL
      })
      this.$emit('update:attachments', this.attachments)
    },
    handleOnRemove(file, fileList) {
      this.attachments = fileList
      this.$emit('update:attachments', this.attachments)
    }
  }
}
</script>
