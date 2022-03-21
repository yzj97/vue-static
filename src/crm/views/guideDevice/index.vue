<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" class="form">
          <ody-search-item :label="this.$t('微信号')" prop="alias">
            <el-input v-model="queryParam.alias" :placeholder="$t('请输入微信号')" name="queryParam_alias" maxlength="50" />
          </ody-search-item>
          <ody-search-item :label="$t('设备编号')" prop="deviceNo">
            <el-input v-model="queryParam.deviceNo" :placeholder="$t('请输入设备编号')" name="queryParam_deviceNo" maxlength="50" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="GuideDeviceListQuery_handleQuery"
          size="small"
          type="primary"
          code="GuideDeviceListQuery"
          @click="handleQuery"
        >{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button
          name="GuideDeviceAdd_addGuideDevice"
          size="small"
          type="primary"
          code="GuideDeviceAdd"
          @click="addGuideDevice"
        >{{ $t('新增导购设备') }}</ody-button>
        <ody-button
          name="GuideDeviceImportTemplate_downLoadGuideDeviceTemplate"
          size="small"
          type="primary"
          code="GuideDeviceImportTemplate"
          @click="downLoadGuideDeviceTemplate"
        >{{ $t('导购设备模板下载') }}</ody-button>
        <ody-button
          :disabled="!canUpload"
          name="GuideDeviceImport_batchImportDeviceTemplate"
          size="small"
          type="primary"
          code="GuideDeviceImport"
          @click="batchImportDeviceTemplate"
        >{{ $t('导购设备导入') }}</ody-button>
        <ody-button
          name="GuideDeviceDelete_batchDelete"
          size="small"
          type="danger"
          code="GuideDeviceDelete"
          @click="batchDelete"
        >{{ $t('common_batch_delete') }}</ody-button>
        <ody-import-task-button
          pool="crm"
          task-type="guideDeviceImport"
          name="GuideDeviceDelete_batchDelete_task"
          code="GuideDeviceImport"
          size="small"
        >{{ $t('seeImportTask') }}</ody-import-task-button>
        <ody-batch-import-button
          :import-api="importModel.importApi"
          :import-label="importModel.importLabel"
          :download-local-file="importModel.downloadLocalFile"
          :async="importModel.async"
          :pool="importModel.pool"
          :task-type="importModel.taskType"
          name="GuideDeviceDelete_batchDelete_button"
          code="GuideDeviceImport"
          size="small"
        >{{ $t('batch_import') }}</ody-batch-import-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :checked.sync="table.checked"
          :multiple="true"
          :columns="table.columns"
          :operates="table.operates"
          :selectable="checkedSelectable"
          :can-filter="false"
          request-url="/crm-web/guideDevice/listPage.do"
          request-page-type="page"
        />
      </div>
    </ody-list-table-area>
    <ody-dialog :visible.sync="importVisible" :title="$t('批量导入导购设备')" @close="handleClose">
      <el-form ref="fileUploadForm" :model="fileUploadForm" :inline="true" :rules="rules">
        <el-form-item
          :label="$t('common_fileUpload')"
          :rules="[{ required: true, message: $t('common_please_selectFile') }]"
          class="register"
          required
          prop="fileName"
        >
          <el-input v-model="fileUploadForm.fileName" name="fileUploadForm_fileName" type="text" disabled="true" />
          <el-upload
            ref="upload"
            :auto-upload="false"
            :before-upload="checkFile"
            :on-change="handlePreview"
            :on-remove="handleRemove"
            :file-list.sync="fileList"
            accept=".xlsx"
            name="file"
            multiple="false"
          >
            <el-button slot="trigger" size="small">{{ $t('choose_file') }}</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <ody-button name="ui_handleClose" code="ui" size="small" @click="handleClose">{{ $t('common_cancel') }}</ody-button>
        <ody-button
          name="ui_submitForm"
          code="ui"
          size="small"
          type="primary"
          @click="submitForm('fileUploadForm')"
        >{{ $t('common_upload') }}</ody-button>
      </span>
    </ody-dialog>

    <Guidevice :visible.sync="addOrEditVisible" @ok="handleQuery" />
  </section>
</template>

<script>
import Guidevice from '@/components/guide-device-model'
import guideDeviceImportResultTemplate from '@/excelFile/guideDeviceImportResultTemplate.xlsx'

export default {
  name: 'GuideDevice',
  components: {
    Guidevice
  },
  data() {
    const self = this
    return {
      importModel: {
        importApi: ['crm-web', 'guideDevice', 'importGuideDevice.do', {}],
        importLabel: this.$t('导购设备导入'),
        downloadLocalFile: [require('@/excelFile/guideDeviceImportResultTemplate.xlsx'), '导购设备导入模板.xlsx'],
        pool: 'crm',
        taskType: 'guideDeviceImport',
        async: true
      },
      canUpload: true,
      importVisible: false,
      addOrEditVisible: false,
      queryParam: {},
      limit: 1,
      fileList: [],
      rules: [],
      fileUploadForm: {
        fileName: null
      },
      table: {
        columns: [
          {
            show: true,
            prop: 'id',
            label: self.$t('设备id'),
            align: 'left',
            minWidth: '150px'
          },
          {
            show: true,
            prop: 'alias',
            tooltip: false,
            label: self.$t('微信号'),
            align: 'left',
            width: '200px'
          },
          {
            show: true,
            prop: 'nickname',
            tooltip: false,
            label: self.$t('微信昵称'),
            align: 'left',
            width: '200px'
          },
          {
            show: true,
            prop: 'deviceNo',
            label: self.$t('设备编号'),
            align: 'left',
            minWidth: '200px'
          },
          {
            show: true,
            prop: 'createTime',
            label: self.$t('创建时间'),
            align: 'left',
            minWidth: '200px',
            formatter: (row, column) => {
              if (row.createTime) {
                return this.$portal.parseTime(
                  row.createTime,
                  '{y}-{m}-{d} {h}:{i}:{s}'
                )
              }
              return ''
            }
          }
        ],
        operates: {
          minWidth: '50px',
          fixed: 'right',
          list: [
            {
              label: this.$t('common_delete'),
              disabled: false,
              method: (index, row) => {
                self.delete(row)
              },
              code: 'GuideDeviceDelete'
            }
          ]
        },
        checked: []
      }
    }
  },
  async mounted() {
    try {
      await this.queryList()
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    async handleQuery() {
      await this.queryList()
    },
    // 商家商品列表查询
    async queryList() {
      this.table.checked = []
      return this.$refs.table.getList({
        filters: this.formHasValue(this.queryParam, false)
      })
    },
    // 重置
    reset() {
      this.table.checked = []
      this.queryParam = getDefaultQueryParam()
    },
    addGuideDevice() {
      this.addOrEditVisible = true
    },
    async delete(row) {
      const confirm = await this.$confirm(
        this.$t('是否删除当前导购设备'),
        this.$t('common_prompt')
      )
      if (confirm) {
        const ids = []
        ids.push(row.id)
        const result = await this.$crm.$api.guideDevice.batchDeleteGuideDevice(
          ids
        )
        if (result && result.code === '0') {
          this.queryList()
          this.$message({
            type: 'success',
            message: this.$t('common_delete_success')
          })
        }
      }
    },
    downLoadGuideDeviceTemplate() {
      this.$portal.downloadFileByGet(
        guideDeviceImportResultTemplate,
        {},
        '导购设备导入模板.xlsx'
      )
    },
    async batchImportDeviceTemplate() {
      this.importVisible = true
    },
    handleRemove(file, fileList) {
      this.fileUploadForm.fileName = ''
    },
    handlePreview(file, fileList) {
      this.fileList = [fileList[fileList.length - 1]]
      this.fileUploadForm.fileName = file.name
    },
    handleClose() {
      this.canUpload = true
      this.fileUploadForm.fileName = ''
      this.fileList = []
      this.importVisible = false
    },
    async submitForm(fileUploadForm) {
      this.$refs[fileUploadForm].validate(valid => {
        if (valid) {
          const file = document.getElementsByName('file')[0].files[0]
          var formData = new FormData()
          formData.append('file', file)
          this.canUpload = false
          const importRequest = this.$crm.$api.guideDevice
          importRequest
            .batchImportGuideDevice(formData)
            .then(result => {
              if (result && result.code === '0') {
                this.canUpload = true
                this.fileUploadForm.fileName = ''
                this.fileList = []
                this.importVisible = false
                this.handleQuery()
                this.$message({
                  type: 'success',
                  message: this.$t('common_import_success')
                })
              } else {
                this.canUpload = true
                console.info(result)
                this.$message({
                  type: 'error',
                  message: result.message
                })
              }
            })
            .catch(() => {
              this.canUpload = true
            })
        }
      })
    },
    async batchDelete() {
      if (this.table.checked.length === 0) {
        return this.$message(this.$t('至少选择一条数据'))
      }
      const confirm = await this.$confirm(
        this.$t('是否删除选中的导购设备信息'),
        this.$t('common_prompt')
      )
      if (confirm) {
        const ids = []
        if (this.table.checked && this.table.checked.length > 0) {
          for (let i = 0; i < this.table.checked.length; i++) {
            const item = this.table.checked[i]
            ids.push(item.id)
          }
          const result = await this.$crm.$api.guideDevice.batchDeleteGuideDevice(
            ids
          )
          if (result && result.code === '0') {
            this.queryList()
            this.$message({
              type: 'success',
              message: this.$t('common_delete_success')
            })
          }
        }
      }
    }
  }
}

function getDefaultQueryParam() {
  return Object.assign(
    {},
    {
      alias: null,
      deviceNo: null
    }
  )
}
</script>
<style lang="scss" scoped>
</style>
