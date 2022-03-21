<template>
  <el-form-item :label="$t('上传文件')" :required="required" :rules="[ { required: true, message: this.$t('请选择') + this.$t('上传文件'), trigger: 'change' }]" prop="fileList">
    <el-col :span="6">
      <el-upload
        :auto-upload="false"
        :before-upload="beforeUpload"
        :on-change="handleChange"
        :on-remove="handleRemove"
        :file-list.sync="fileList"
        :accept="acceptFileType"
        :multiple="multiple"
        :disabled="disabled"
        v-bind="$attrs"
        name="file"
        v-on="$listeners">
        <el-button slot="trigger" :disabled="disabled" size="small" type="primary">{{ fileList.length === 0 ? $t('选择文件') : $t('重新选择文件') }}</el-button>
        <div v-show="disabled" slot="tip" class="el-upload__tip red">{{ tipOnDisabled }}</div>
      </el-upload>
      <el-link name="downloadTemplate" type="primary" @click="downloadTemplate" >{{ $t('下载模板') }}</el-link>
    </el-col>
  </el-form-item>
</template>

<script>
export default {
  name: 'SimpleFilUpload',
  props: {
    disabled: {
      type: Boolean,
      default: true
    },
    required: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    tipOnDisabled: {
      type: String,
      default: ''
    },
    templatePath: {
      type: String,
      default: null
    },
    acceptFileType: {
      type: String,
      default: '.xls,.xlsx'
    },
    typeAlias: {
      type: String,
      default: 'xls或xlsx'
    },
    limit: {
      type: Number,
      default: 1
    },
    fileList: {
      type: Array,
      default: () => {
        return []
      }
    },
    fileSizeLimit: {
      type: Number,
      default: 2 * 1024 * 1024
    }
  },
  data() {
    return {
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    init() {

    },
    beforeUpload(file) {
      if (this.disabled && this.tipOnDisabled) {
        this.tipOnDisabled()
        return false
      }
      const fileTypes = this.acceptFileType.split(',')
      const fileExtName = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      let matchesAny = false
      fileTypes.forEach(t => {
        if (fileExtName === t) {
          matchesAny = true
        }
      })
      if (!matchesAny) {
        this.$message({
          type: 'info',
          message: this.$t('只允许上传') + this.type + this.$t('文件！')
        })
        return false
      }
      if (file.size > this.fileSizeLimit) {
        this.$message({
          type: 'info',
          message: this.$t('文件最大只能') + (this.fileSizeLimit / 1024 / 1024) + 'M'
        })
        return false
      }
      return true
    },
    handleChange(file, fileList) {
      if (fileList.length > this.limit) {
        fileList.splice(0, fileList.length - this.limit)
      }
      this.fileList = fileList
      this.$emit('update:fileList', this.fileList)
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
      this.$emit('update:fileList', this.fileList)
    },
    downloadTemplate() {
      this.$emit('downloadTemplate')
    }
  }
}
</script>
