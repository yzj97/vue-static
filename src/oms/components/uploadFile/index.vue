<template>
  <section class="pg-manualOrderBatch-list">
    <el-card>
      <el-form ref="form" :model="formData" :rules="rules" name="form" label-width="240px" >
        <el-col :span="5">
          &nbsp;
        </el-col>
        <el-col :span="19">
          <el-row style="text-align: right">
            <slot name="top-right"/>
          </el-row>
          <el-row class="order-batch-step">
            <el-steps :space="400" :active="active" finish-status="success">
              <el-step :title="$t('上传文件')"/>
              <el-step :title="$t('上传中')"/>
              <el-step :title="$t('上传完成')"/>
            </el-steps>
          </el-row>
          <slot name="form-merchant">
            <el-form-item v-if="checkMerchant" v-show="active < 2" :label="$t('商家')" required>
              <el-col :span="6">
                <ody-merchant-select ref="merchant" v-model="merchantId" :item-disabled="itemDisabled" name="merchantId" value-key="merchantId" />
              </el-col>
            </el-form-item>
          </slot>
          <slot name="form-store">
            <el-form-item v-if="checkStore" v-show="active < 2" :label="$t('店铺')" required>
              <el-col :span="6">
                <ody-store-select
                  v-model="storeCode"
                  :selected.sync="selectedStore"
                  name="storeCode"
                  @change="handleStoreChange"/>
              </el-col>
            </el-form-item>
          </slot>
          <slot :active="active" name="form-items"/>
          <el-form-item v-show="active < 2" :label="$t('上传文件')">
            <el-col :span="6">
              <el-upload
                :auto-upload="false"
                :before-upload="beforeUpload"
                :on-change="handleChange"
                :on-remove="handleRemove"
                :file-list.sync="fileList"
                :accept="type"
                v-bind="$attrs"
                name="file"
                v-on="$listeners">
                <el-button slot="trigger" size="small" type="primary">{{ fileList.length === 0 ? $t('选择文件') : $t('重新选择文件') }}</el-button>
              </el-upload>
              <slot name="upload-right"/>
            </el-col>
          </el-form-item>
          <el-form-item v-if="fileList.length === 0 ">
            <span>{{ $t('请选择')+$t(typeAlias)+$t('格式的文件进行上传，若无已导出的')+$t(title)+$t('模板，请') }}<el-link name="downloadTemplate" type="primary" @click="downloadTemplate" >{{ $t('下载模板') }}</el-link></span>
          </el-form-item>
          <el-form-item v-if="active == 2">
            <div>
              <div v-if="submiting">
                <h3 style="color: #1890FF;">{{ $t('文件上传中...') }}</h3>
                <div>
                  {{ $t(message) }}
                </div>
              </div>
              <h3 v-if="!submiting" style="color: #EF5351">
                {{ $t(message) }}
              </h3>
            </div>
          </el-form-item>
          <el-form-item v-if="active == 3" label-width="200px" >
            <div>
              <h3 v-if="!backProcess" style="display: flex; align-items: center; margin-bottom: 0px;" ><i :style="noSuccess ? 'color: #EF5351; font-size: 40px;' : !hasError ? 'color: #13CE66; font-size: 40px;' : 'color: #FFB12B; font-size: 40px;'" :class="noSuccess ? 'el-icon-error' : !hasError ? 'el-icon-success' : 'el-icon-warning'" />
                <span style="padding-left: 10px;">{{ $t('您的数据上传', { title: $t(title), result: (!showMessageDetail && hasError) ? $t('失败') + (message ? ':' + message : '') : $t('完成') }) }}</span>
              </h3>
              <span v-show="showMessageDetail" style="padding-left: 50px;">{{ $t('成功上传') }}<span>{{ messageParams.successCount }}</span>{{ $t('条，失败') }}<span class="error" >{{ messageParams.failedCount }}</span>{{ $t('条') }}</span><el-link v-show="showMessageDetail" v-if="hasError && task.failFilePath" name="downloadErrorData" type="primary" @click="downloadErrorData" >{{ $t('点此下载失败数据') }}</el-link>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button v-if="active == 0" :disabled="uploadDisabled" name="uploadFile" size="small" type="primary" @click="uploadFile">{{ $t('上传') }}</el-button>
            <el-button v-if="(active == 2 && !submiting) || active === 3" name="uploadFile5" size="small" type="primary" @click="uploadFile">{{ $t('继续上传') }}</el-button>
            <el-button v-if="taskType !== 'soPackageImport' && taskType !== 'redevDoImport'" :disabled="submiting" name="returnBack" size="small" @click="returnBack">{{ $t('返回') }}</el-button>
          </el-form-item>
          <el-row class="batch-file-tip">
            <el-form-item label-width="10px" >
              <slot name="upload-tip">
                <div>
                  <div>{{ $t('温馨提示：') }}</div>
                  <div>{{ $t('1. excel格式必须是或者xlsx或者xls，') }}{{ $t(title) }}{{ $t('条数≤10000条。') }}</div>
                  <div>{{ $t('2. 必填字段不能为空（必填字段名称前面带') }}<span class="error">*</span>{{ $t('），否则将导入失败。') }}</div>
                </div>
              </slot>
            </el-form-item>
          </el-row>
        </el-col>
      </el-form>
      <ImportTaskSimple :filter-data-auth="filterDataAuth" :pool="pool" :task-type="taskType" :visible.sync="historyVisible" @close="closeHistory" />
    </el-card>
  </section>
</template>
<script>
import ImportTaskSimple from '@/components/import-task-simple'

export default {
  name: 'UploadFile',
  components: {
    ImportTaskSimple
  },
  props: {
    pool: { type: String, default: 'oms-web', reqrequireduired: false },
    taskType: { type: String, default: null, required: false },
    filterDataAuth: { type: Boolean, required: false, default: true },
    title: {
      type: String,
      default: null
    },
    templatePath: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: '.xls,.xlsx'
    },
    typeAlias: {
      type: String,
      default: 'xls或xlsx'
    },
    fileList: {
      type: Array,
      default: () => {
        return []
      }
    },
    historyVisible: {
      type: Boolean,
      default: false
    },
    uploadPath: {
      type: String,
      default: null
    },
    fileSizeLimit: {
      type: Number,
      default: 2 * 1024 * 1024
    },
    platformType: {
      type: Number,
      default: 1 // 运营平台，商家平台
    },
    showMessageDetail: {
      type: Boolean,
      default: true
    },
    checkMerchant: { // 校验商家
      type: Boolean,
      default: false
    },
    checkStore: { // 校验店铺
      type: Boolean,
      default: false
    },
    sendPlatformType: { // 是否发送platformType到服务端
      type: Boolean,
      default: false
    },
    inputValidated: { // 额外校验
      type: Boolean,
      default: true
    },
    search: { type: Function, required: false, default: null } // 接受入参{taskType:"",limitStart:0,limitCount:10},返回Promise
  },
  data() {
    return {
      selectedStore: [],
      merchantId: null,
      storeId: null,
      submiting: false,
      active: 0,
      formData: { },
      limit: 1,
      hasError: true, // 有错误数据
      noSuccess: false, //  没有正确数据
      task: {},
      taskId: null,
      message: null,
      backProcess: false,
      showModalTask: false,
      showCheckTaskStatus: true,
      executeTimeout: false,
      messageParams: {
        successCount: 0,
        failedCount: 0
      }
    }
  },
  computed: {
    uploadDisabled() {
      return this.fileList.length === 0 || (!this.merchantId && this.checkMerchant) || (!this.storeId && this.checkStore) || !this.inputValidated
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
    itemDisabled(row, index) {
      if (row.merchantCode === 'defaultMerchant' && this.platformType === 1) {
        this.merchantId = row.merchantId
      }
      return false
    },
    closeHistory() {
      this.historyVisible = false
      this.$emit('update:historyVisible', false)
    },
    returnBack() {
      if (this.active === 2) {
        this.active = 0
        this.fileList = []
        this.task = {}
        this.taskId = null
      } else if (this.active === 0 || this.active === 3) { // 第1,3步返回，关闭页面
        this.$portal.delActiveView()
      }
    },
    downloadTemplate() {
      this.$emit('downloadTemplate')
    },
    handleStoreChange() {
      this.merchantId = this.selectedStore.merchantId
      this.storeId = this.selectedStore.storeId
    },
    beforeUpload(file) { // 文件上传前检测文件类型
      const fileTypes = this.type.split(',')
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
          message: this.$t('文件最大只能2M')
        })
        return false
      }
      return true
    },
    async uploadFile() {
      if (this.active === 3) { // 上传成功点击继续上传
        this.active = 0
        this.fileList = []
        this.task = {}
        this.taskId = {}
        this.message = ''
        return
      }
      if (this.active === 2) { // 上传出错继续上传
        let confirm = true
        if (this.taskId) { // 提示
          confirm = await this.$confirm(this.$t('文件已经上传'), this.$t('prompt'))
        } else {
          this.returnBack()
          return
        }
        if (!confirm) {
          return
        }
      }
      const file = document.getElementsByName('file')[0].files[0]
      if (!this.beforeUpload(file)) {
        return
      }

      this.active = 2
      this.message = this.$t('文件正在上传中，请耐心等待')
      this.submiting = true
      this.hasError = false
      this.showCheckTaskStatus = true
      this.task = null
      this.taskId = null
      this.executeTimeout = true
      this.backProcess = false
      const uploadParams = new FormData()
      uploadParams.append('fileData', file)
      if (this.checkMerchant || this.checkStore) {
        uploadParams.append('merchantId', this.merchantId)
      }
      if (this.taskType === 'soPackageImport') {
        uploadParams.append('file', file)
      }
      if (this.taskType === 'redevDoImport') {
        uploadParams.append('file', file)
      }
      if (this.checkStore) {
        uploadParams.append('storeId', this.storeId)
      }
      if (this.sendPlatformType) {
        uploadParams.append('platformType', this.platformType)
      }

      this.$emit('beforeUpload', uploadParams)
      const vue = this
      const netWorkErrorMessage = this.$t('网络异常，上传失败!')

      setTimeout(function() {
        if (!vue.taskId && vue.executeTimeout) {
          vue.message = netWorkErrorMessage
          vue.submiting = false
          vue.showCheckTaskStatus = false
          return
        }
      }, 300 * 1000) // 等待5分钟，如果还没有返回，返回网络问题
      const processTimeMessage = this.$t('文件上传后台处理中')
      setTimeout(function() {
        if (vue.taskId && vue.submiting && vue.executeTimeout) {
          vue.message = processTimeMessage
          vue.submiting = false
          vue.showCheckTaskStatus = false
          vue.active = 3
          vue.backProcess = true
        }
      }, 20000) // 如果20秒还未处理成功，取消等待

      this.$portal.post(this.uploadPath, uploadParams).then(result => {
        if (result.code === '0') {
          // this.message = ''
          vue.taskId = result.data
          setTimeout(vue.checkTaskStatus, 5000)
          this.$emit('success')
        } else {
          vue.taskId = result.data
          vue.message = netWorkErrorMessage
          vue.submiting = false
          vue.executeTimeout = false
        }
      }, result => {
        vue.taskId = result.data
        vue.message = result.message
        vue.submiting = false
        vue.executeTimeout = false
      })
    },
    async checkTaskStatus() { // 循环判断任务状态
      if (!this.showCheckTaskStatus) {
        return
      }
      this._loadDataTask()
    },
    async _loadDataTask() {
      const data = {
        filters: { taskType: this.taskType, id: this.taskId },
        sorts: [{ field: 'startTime', asc: false }],
        limit: 1,
        page: 1
      }
      const result = this.search ? await this.search(data)
        : await this.$portal.post('/' + this.pool + '/public/data/task/listPage', data)
      this.task = result.data[0]
      if (this.task.status >= 2) {
        const successCount = this.task.successCount || 0
        const failedCount = this.task.failedCount || 0
        if (this.showMessageDetail) {
          if (failedCount > 0) {
            this.hasError = true
          } else {
            this.hasError = false
          }
          if (successCount > 0) {
            this.noSuccess = false
          } else {
            this.noSuccess = true
          }
        } else {
          this.hasError = this.noSuccess = this.task.status === 3
        }
        this.task.failFilePath = this.task.failedFilePath
        this.task.failFileName = this.task.fileName
        this.messageParams = { successCount: successCount, failedCount: failedCount }
        if (this.task.failedMessage) {
          this.message = this.task.failedMessage
        } else {
          this.message = ''
        }
        this.active = 3
        this.submiting = false
      } else if (this.task.status < 2) {
        setTimeout(this.checkTaskStatus, 3000) // 每3秒检测一次任务状态
      } else {
        this.submiting = false
      }
    },
    downloadErrorData() { // 下载错误数据
      if (this.task && this.task.failFilePath) {
        this.$portal.downloadFileByGet(this.task.failFilePath, {}, this.task.failFileName)
      } else {
        this.$message({
          type: 'warn',
          message: this.$t('后台错误，文件不存在')
        })
      }
    },
    handleChange(file, fileList) {
      if (fileList.length > this.limit) {
        fileList.splice(0, fileList.length - this.limit)
      }
      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    init() {
      if (this.$route.query.platformType) {
        this.platformType = Number(this.$route.query.platformType)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .order-batch-step{
    margin-bottom: 40px;
  }
  .batch-file-tip{
    margin-top: 50px;
  }
</style>
