<template>
  <ody-dialog
    :title="$t('新增版本')"
    :visible.sync="visible"
    :before-close="handleBack"
    width="960px"
    @open="init"
  >
    <el-form ref="comment" :model="comment" :rules="rules" label-width="100px" class="form">
      <el-form-item :label="$t('版本号')" prop="versionCode">
        <el-input v-model="comment.versionCode" name="comment_versionCode" maxlength="100" />
      </el-form-item>
      <el-form-item label-width="0px" prop="chooseFlag">
        <el-radio-group v-model="comment.chooseFlag" name="comment_chooseFlag">
          <el-radio :label="2">{{ $t('强制更新') }}</el-radio>
          <el-radio :label="3">{{ $t('提示更新') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="comment.chooseFlag ===2" :label="$t('强制更新')">
        <el-switch
          :active-value="'2'"
          :inactive-value="'0'"
          :active-text="comment.updateType === '2' ? '是' : '否'"
          v-model="comment.updateType"
          name="comment_updateType"
        />
      </el-form-item>
      <el-form-item v-if="comment.chooseFlag ===3" :label="$t('提示更新')">
        <el-switch
          :active-value="'1'"
          :inactive-value="'0'"
          :active-text="comment.promptUpdate === '1' ? '是' : '否'"
          v-model="comment.promptUpdate"
          name="comment_promptUpdate"
        />
      </el-form-item>
      <el-form-item v-if="platformType ===0" label-width="0px">
        <el-radio-group v-model="comment.uploadOrInput" name="comment_uploadOrInput" @change="uploadOrInput">
          <el-radio :label="2">{{ $t('上传APP安装包') }}</el-radio>
          <el-radio :label="3">{{ $t('输入更新链接') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="platformType ===0 && comment.uploadOrInput===3"
        :label="$t('更新链接')"
        prop="updateUrl"
      >
        <el-input v-model="comment.updateUrl" name="comment_updateUrl" maxlength="200" />
      </el-form-item>
      <el-form-item v-if="platformType ===0 && comment.uploadOrInput===2" :label="$t('APP安装包')">
        <el-upload
          ref="upload"
          :limit="1"
          :auto-upload="false"
          :before-upload="beforeUpload"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :file-list.sync="fileList"
          multiple
          class="upload-attachment"
          accept=".apk"
          name="file"
        >
          <el-button
            slot="trigger"
            size="small"
          >{{ fileList.length === 0 ? $t('选择文件') : $t('重新选择文件') }}</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item v-if="platformType ===1" :label="$t('更新链接')" prop="updateUrl">
        <el-input v-model="comment.updateUrl" name="comment_updateUrl3" maxlength="200" />
      </el-form-item>
      <el-form-item>{{ $t('app审核期间请关闭强制更新') }}，{{ $t('避免影响审核结果') }}</el-form-item>
    </el-form>
    <span slot="footer">
      <ody-button
        :disabled="isCanSend|| submitFlag"
        name="SocialAppVersionManageSave_submitForm"
        size="small"
        type="primary"
        code="SocialAppVersionManageSave"
        @click="submitForm('comment')"
      >{{ $t('确定') }}</ody-button>
      <el-button name="handleBack" size="small" type="primary" @click="handleBack">{{ $t('取消') }}</el-button>
    </span>
  </ody-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    platformType: {
      type: Number,
      default: null
    },
    dictId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      fileList: [],
      submitFlag: false,
      limit: 1,
      comment: {
        versionCode: null,
        updateType: 0,
        chooseFlag: 2,
        promptUpdate: 0,
        updateUrl: null,
        uploadOrInput: 3
      },
      rules: {
        updateUrl: [
          {
            required: true,
            message: this.$t('请输入更新链接'),
            trigger: 'change'
          }
        ],
        versionCode: [
          {
            required: true,
            message: this.$t('请输入版本号'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    isCanSend() {
      if (this.comment.uploadOrInput === 2) {
        return this.fileList.length === 0
      } else {
        return false
      }
    }
  },
  methods: {
    handleBack() {
      this.$emit('update:visible', !this.visible)
      // this.$refs['comment'].resetFields()
    },
    async submitForm(comment) {
      const uploadParams = new FormData()
      if (this.platformType === 0) {
        if (this.comment.uploadOrInput === 2) {
          const file = document.getElementsByName('file')[0].files[0]
          if (!this.beforeUpload(file)) {
            return
          }
          uploadParams.append('file', file)
        } else {
          uploadParams.append('file', null)
        }
      }
      await this.$refs['comment'].validate(valid => {
        if (valid) {
          this.submitFlag = true
          uploadParams.append('dictId', this.dictId)
          uploadParams.append('versionCode', this.comment.versionCode)
          uploadParams.append('updateType', this.comment.updateType)
          uploadParams.append('promptUpdate', this.comment.promptUpdate)
          if (this.comment.updateUrl != null) {
            uploadParams.append('updateUrl', this.comment.updateUrl)
          }
          this.$portal
            .post('/social-back-web/appDict/addAppWithForm.do', uploadParams, {
              headers: { Expect: '100-continue' },
              timeout: 3000000
            })
            .then(result => {
              if (result.code === '0') {
                this.$emit('update:visible', !this.visible)
                // this.$refs['comment'].resetFields()
                this.$emit('ok', [])
              } else {
                this.$message({
                  type: 'error',
                  message: result.data
                })
              }
            })
            .finally(() => {
              this.submitFlag = false
            })
        }
      })
    },
    // 文件上传前检测文件类型
    beforeUpload(file) {
      if (
        !(file.name.toLowerCase().lastIndexOf('.apk') === file.name.length - 4)
      ) {
        this.$message({
          type: 'error',
          message: this.$t('上传文件类型错误，请上传apk类型的文件')
        })
        this.flag1 = true
        return false
      }
      return true
    },
    handleChange(file, fileList) {
      if (fileList.length > this.limit) {
        fileList.splice(0, fileList.length - this.limit)
      }
      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    }
  }
}
</script>

<style scoped>
</style>
