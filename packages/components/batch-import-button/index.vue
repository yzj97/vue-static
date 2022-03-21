<template>
  <div class="cp-batch-import-button">
    <ody-button
      v-bind="$attrs"
      :code="code"
      size="small"
      v-on="$listeners"
      @click="visible = true"
    >
      <slot />
    </ody-button>
    <ody-dialog
      v-show="!importResultVisible"
      :visible.sync="visible"
      :title="title"
      :append-to-body="true"
      class="batch-import-model"
      width="420px"
      @open="handleOpen"
      @close="handleClose">
      <div class="batch-import-model__content">
        <span class="upload_tip">文件上传：</span>
        <el-upload
          ref="upload"
          :file-list="importFileList"
          :show-file-list="true"
          :data="getImportParams"
          :with-credentials="true"
          :on-change="handleChange"
          :on-success="handleImportOnSuccess"
          :on-error="handleImportOnError"
          :before-upload="handleImportBeforeUpload"
          :action="getImportAction"
          :auto-upload="false"
          accept=".xls,.xlsx"
          class="batch-import-model__content__btn"
        >
          <ody-button :type="typeVal" code="ui" size="medium" class="select-btn">{{ selectLabel }}</ody-button>
          <!-- <ody-button :disabled="doing" code="ui" size="small" class="import-btn">{{ importLabel }}{{ doing ? $t("中") : "" }}</ody-button> -->
        </el-upload>

      </div>
      <div class="download-wrap">
        <ody-button
          v-if="downloadShow"
          code="ui"
          size="small"
          type="text"
          class="batch-import-model__content__btn"
          @click="handleDownload">{{ downloadLabel }}</ody-button></div>
      <span slot="footer" class="dialog-footer">
        <ody-button code="ui" size="small" @click="handleClose">{{ $t('取消') }}</ody-button>
        <ody-button style="margin-left: 10px;" code="ui" size="small" type="primary" @click="submitUpload">确认</ody-button>
      </span>
    </ody-dialog>
    <ody-import-task
      v-if="async"
      :append-to-body="true"
      :visible.sync="importResultVisible"
      :pool="pool"
      :task-type="taskType"
      :is-data-task="isDataTask"
      :filter-data-auth="filterDataAuth"
      :task-id="taskId"
      :search="search"
      :handle-filter-data="handleFilterData"
    />
    <ody-dialog
      v-else
      :visible.sync="importResultVisible"
      :append-to-body="true"
      title="提示"
      width="420px"
      class="batch-import-model"
      @close="handleImportResultClose">
      <div>
        <div>总记录数: {{ importResult[totalSizeKey] }}</div>
        <div>
          导入成功: {{ importResult[successSizeKey] }}, 导入失败: {{ importResult[totalSizeKey] - importResult[successSizeKey] }}
          <ody-button
            v-if="importResult[failedUrlKey]"
            code="ui"
            type="text"
            size="small"
            class="batch-import-model__down-parsed"
            @click="handleImportResultDownloadFail">
            {{ $t('下载失败记录') }}
          </ody-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <ody-button code="ui" size="small" type="primary" @click="handleImportResultClose">确 定</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>

export default {
  components: {

  },
  props: {
    async: { type: Boolean, default: false },
    pool: { type: String, default: null, required: false },
    code: { type: String, default: 'ui', required: false },
    taskType: { type: String, default: null, required: false },
    isDataTask: { type: Boolean, required: false, default: true },
    filterDataAuth: { type: Boolean, required: false, default: false },
    search: { type: Function, required: false, default: null }, // 接受入参{taskType:"",limitStart:0,limitCount:10},返回Promise
    handleFilterData: { type: Function, required: false, default: null },
    label: {
      type: String,
      default: '批量导入'
    },
    title: {
      type: String,
      default: '批量导入'
    },
    downloadLabel: {
      type: String,
      default: '模板下载'
    },
    importLabel: {
      type: String,
      default: '导入'
    },
    downloadApi: {
      type: Array,
      default: () => []
    },
    importApi: {
      type: Array,
      default: () => []
    },
    downloadLocalFile: {
      type: Array,
      default: () => []
    },
    downloadShow: {
      type: Boolean,
      default: true
    },
    totalSizeKey: {
      type: String,
      default: 'totalSize'
    },
    successSizeKey: {
      type: String,
      default: 'successSize'
    },
    failedUrlKey: {
      type: String,
      default: 'failedUrl'
    },
    selectLabel: {
      type: String,
      default: '选择文件'
    },
    fileData: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      visible: false,
      doing: false,
      importFileList: [],
      importResultVisible: false,
      importResult: {},
      taskId: null,
      hasSelected: false,
      typeVal: ''
    }
  },
  computed: {
    getImportParams() {
      const { 3: params } = this.importApi
      return params
    },
    getImportAction() {
      const [poolName, fileName, methodName] = this.importApi

      return this.getUrl(poolName, fileName, methodName)
    }
  },
  mounted() {

  },
  methods: {
    getUrl(poolName, fileName, methodName) {
      /* const $pool = this['$' + poolName]

      if (!$pool) {
        console.warn(`没有找到批量下载的${poolName}`)
        return ''
      }

      const $poolApi = $pool.$api

      if (!$poolApi) {
        console.warn(`没有找到批量下载的${poolName}.$api`)
        return ''
      }

      const $poolApiFileName = $poolApi[fileName]

      if (!$poolApiFileName) {
        console.warn(`没有找到批量下载的${poolName}.$api[${fileName}]`)
        return ''
      }

      const $poolApiFileNameMethodName = $poolApiFileName[methodName]

      if (!$poolApiFileNameMethodName) {
        console.warn(`没有找到批量下载的${poolName}.$api[${fileName}][${methodName}]`)
        return ''
      }

      return '/api/' + $poolApiFileNameMethodName.url*/
      return '/api/' + poolName + '/' + fileName + '/' + methodName
    },
    handleDownload() {
      if (this.downloadLocalFile && this.downloadLocalFile.length) {
        const [file, downloadFileName] = this.downloadLocalFile

        this.$portal.downloadFileByGet(file, {}, downloadFileName)
      } else {
        const [poolName, fileName, methodName, params] = this.downloadApi
        const url = this.getUrl(poolName, fileName, methodName)

        this.$portal.downloadFileByGet(url, params)
      }
    },
    handleImportBeforeUpload(file) {
      if (this.doing) {
        return false
      }
      this.doing = true
      var isMac = (navigator.platform === 'Mac68K') ||
        (navigator.platform === 'MacPPC') ||
        (navigator.platform === 'Macintosh') ||
        (navigator.platform === 'MacIntel')

      if (isMac) {
        return true
      }

      const checkType = {
        isXls: file.type === 'application/vnd.ms-excel',
        isXlsx: file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }

      this.picType = ['xls', 'xlsx']

      const isType = this.picType.some(key => {
        return checkType[this.$portal.changeCase('is-' + key)]
      })

      if (!isType) {
        this.$message.error(`上传附件只能是 ${this.picType.join(',')} 格式!`)
        return isType
      }

      return isType
    },
    handleImportResultClose() {
      this.importResultVisible = false
      this.handleClose()
    },
    async handleImportResultDownloadFail() {
      await this.$portal.downloadFileByGet(this.importResult[this.failedUrlKey])
    },
    handleOpen() {
      this.doing = false
      this.$emit('open')
    },
    handleChange(file, importFileList) {
      this.hasSelected = false
      if (importFileList.length > 0) {
        this.importFileList = [importFileList[importFileList.length - 1]]
        this.hasSelected = true
      }
      this.selectLabel = this.hasSelected ? '重新选择文件' : '选择文件'
      this.typeVal = this.hasSelected ? 'text' : ''
    },
    submitUpload() {
      this.$refs.upload.submit()
      if (this.importFileList.length === 0) {
        this.visible = false
      }
    },
    handleClose() {
      this.visible = false
      this.hasSelected = false
      this.selectLabel = '选择文件'
      this.typeVal = ''
      this.importFileList = []
      this.$emit('close')
    },
    handleImportOnSuccess(res) {
      if (res.code !== '0') {
        this.handleImportOnError(res)
        return
      }
      this.doing = false
      this.async ? this._doAsyncHandleSuccess(res) : this._doSyncHandleSuccess(res)
    },
    handleImportOnError(res) {
      this.doing = false
      this.async ? this._doAsyncHandleError(res) : this._doSyncHandleError(res)
    },
    _doAsyncHandleSuccess(res) {
      this.taskId = res.data.id || res.data

      this.$alert(this.$t('importPromptInfoSuccess') + this.taskId, this.$t('system_hints'), {
        confirmButtonText: this.$t('common_confirm_search'),
        callback: action => {
          if (action === 'confirm') {
            this.importResultVisible = true
          }
          this.visible = false
        }
      })
    },
    _doAsyncHandleError(res) {
      this.$message.error(res.message || this.$t('common_import_fail'))
    },
    _doSyncHandleSuccess(res) {
      if (res.code === '0') {
        if (this.downloadShow) {
          this.importResult = res.data || {}
          this.importResultVisible = true
        }
        this.visible = false
        this.$emit('ok')
      } else {
        this.$message.error(res.message || res.fullStackTrace)
      }
    },
    _doSyncHandleError(res) {
      this.$message.error(res.message || this.$t('common_import_fail'))
    }
  }
}
</script>
<style lang="scss" scoped>
.batch-import-model {
  &__content {
    text-align: left;
    &__btn {
      display: inline-block;
      margin: 0 5px;
    }
  }
  &__down-parsed{
    color: #1890FF !important;
  }
}
.upload_tip{
  display: inline-block;
  min-width:70px;
}
.batch-import-model__content__btn,
.batch-import-model__content{
  display: flex;
  align-items: center;
}
.el-upload-list{
  order:-1;
  padding-left: 8px;
}
.el-upload-list li{
  width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis
}
.el-upload-list__item-name{
  padding:0px;
}
.el-upload-list__item:hover .el-icon-close,
.el-icon-document,
.el-upload-list__item .el-icon-upload-success{
  display: none;
}
.el-upload-list__item:first-child,
.el-upload-list__item,
.el-upload-list__item-name{
  margin-top:0px;
}
.el-upload-list__item-name{
  color: #333333;
  margin-right: 0px;
}
.download-wrap{
  margin-top: 16px;
  margin-left: 70px;
}
</style>
<style lang="less" scoped>
  .cp-batch-import-button {
    display: inline-block;
    .download-btn {
      width: 50%;
    }
  }
</style>
