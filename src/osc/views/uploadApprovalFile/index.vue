<template>
  <div>
    <section>

      <el-upload
        :multiple="false"
        :accept="text/xml"
        :limit="1"
        :on-exceed="handleExceed"
        :before-upload="onBeforeUpload"
        :on-success="handleUploadSucess"
        :on-error="handleUploadError"
        :show-file-list="true"
        class="upload-demo"
        drag
        action="/api/ouser-web/media/fileUploadToKsy">
        <i class="el-icon-upload"/>
        <div class="el-upload__text">将文件拖到此处，或<em>{{ $t('点击上传') }}</em></div>
        <div slot="tip" class="el-upload__tip">只能上传.bmpn20.xml文件</div>
      </el-upload>
      <el-select v-model="approvalType" :placeholder="$t('请选择')" name="approvalType" style="margin-top: 20px;">
        <el-option
          v-for="item in approvalTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <br>
      <el-button name="handleConfirm" style="margin-top: 20px;" size="small" type="primary" @click="handleConfirm">{{ $t('确定上传') }}</el-button>
    </section>
    <ody-dialog :visible.sync="uploadDialog.show" :title="uploadDialog.title" style="width: 50%; margin-left: 25%;">
      <div style="text-align: center;">
        {{ uploadDialog.description }}
        <br>
        <el-button name="uploadDialog_show" style="margin-top: 30px;" type="primary" @click="uploadDialog.show = false">{{ $t('确认') }}</el-button>
      </div>
    </ody-dialog>
  </div>

</template>

<script>
import util from '@/utils/util'
import constants from '@/utils/constants'

export default {
  name: 'OscUploadApprovalFile',
  data() {
    // const self = this
    return {
      uploadFileNum: 0,
      uploadDialog: { show: false, title: '', description: '' },
      uploadUrl: '/api/ouser-web/media/fileUploadToKsy',
      fileList4: [],
      fileUrl: '',
      loadding: {},
      fileName: '',
      approvalTypeOptions: [],
      approvalType: '',
      fileList: [{
        name: 'food.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }, {
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      // 初始化
      const self = this
      self.approvalTypeOptions = constants.typeOptions
      self.uploadFileNum = 0
    },
    handleExceed() {
      this.$message.warning('上传文件限制1个')
    },
    handleUploadSucess(data) {
      // 上传成功处理
      const self = this
      // const approvalService = this.$osc.$api.approvalService
      console.log(data)
      // 将url发送给后台接口
      self.fileUrl = data.data.url
      self.fileName = data.data.name
      self.loadding.close()
    },
    handleUploadError(data) {
      const self = this
      self.$message.warning('文件上传失败')
      self.loadding.close()
    },
    handleConfirm() {
      const self = this
      const approvalService = this.$osc.$api.approvalService
      if (self.fileUrl === null || self.fileUrl === '') {
        self.uploadDialog.show = true
        self.uploadDialog.title = '请先上传文件'
        self.uploadDialog.description = '请先上传文件'
        return
      }
      if (self.approvalType === null || self.approvalType === '') {
        self.$message.warning('请选择类型')
        self.uploadDialog.show = true
        self.uploadDialog.title = '请选择类型'
        self.uploadDialog.description = '请选择类型'
        return
      }

      if (self.uploadFileNum > 0) {
        self.$message.warning('请勿重复操作，若还需上传请刷新页面')
        self.uploadDialog.show = true
        self.uploadDialog.title = '请勿重复操作，若还需上传请刷新页面'
        self.uploadDialog.description = '请勿重复操作，若还需上传请刷新页面'
        return
      }
      self.loadding = self.openLoadding()
      // 将url发送给后台接口
      const addModel = {}
      addModel.fileUrl = self.fileUrl
      addModel.fileName = self.fileName
      addModel.type = self.approvalType
      approvalService.addWorkFlows(util.copy(addModel)).then(res => {
        self.$message({
          message: '文件上传成功',
          type: 'success'
        })
        self.loadding.close()
        self.$message.success('新增审批流成功')
        self.uploadDialog.show = true
        self.uploadDialog.title = '新增审批流成功'
        self.uploadDialog.description = '新增审批流成功'
        self.uploadFileNum = self.uploadFileNum + 1
      }).catch(res => {
        console.log(res)
        self.loadding.close()
      })
    },
    onBeforeUpload(file) {
      const self = this
      const fileName = file.name
      self.loadding = self.openLoadding()
      console.log(fileName)
      if (fileName.indexOf('bpmn20.xml') !== -1) {
        return true
      } else {
        self.$message.warning('文件类型必须是bpmn20.xml')
        self.loadding.close()
        return false
      }
    },
    openLoadding() {
      var loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      return loading
    }
  }
}
</script>
