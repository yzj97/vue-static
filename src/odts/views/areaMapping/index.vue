<template>
  <section class="pg-soPackage-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <!-- 第三方渠道 -->
          <ody-search-item :label="$t('third_channel')" prop="channelCode">
            <el-select v-model="searchForm.channelCode" name="searchForm_channelCode">
              <el-option v-for="item in channelList" :label="item.channelName" :key="item.channelCode" :value="item.channelCode" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('area_code')" prop="areaCode">
            <el-input v-model="searchForm.areaCode" name="searchForm_areaCode"/>
          </ody-search-item>
          <ody-search-item :label="$t('area_name')" prop="areaName">
            <el-input v-model="searchForm.areaName" name="searchForm_areaName"/>
          </ody-search-item>
          <ody-search-item :label="$t('third_area_code')" prop="channelAreaCode">
            <el-input v-model="searchForm.channelAreaCode" name="searchForm_channelAreaCode"/>
          </ody-search-item>
          <ody-search-item :label="$t('third_area_name')" prop="channelAreaName">
            <el-input v-model="searchForm.channelAreaName" name="searchForm_channelAreaName"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button name="OdtsAreaMapping_Query_handleSearchSubmit" code="OdtsAreaMapping_Query" size="small" type="primary" @click="handleSearchSubmit">{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button name="OdtsAreaMapping_Add_addChannelMapping" code="OdtsAreaMapping_Add" size="small" type="primary" @click="addChannelMapping">{{ $t('add') }}</ody-button>
        <ody-button name="OdtsAreaMapping_Delete_onBatchDelete" code="OdtsAreaMapping_Delete" size="small" @click="onBatchDelete">{{ $t('common_batch_delete') }}</ody-button>
        <ody-button name="OdtsAreaMapping_Import_importList" code="OdtsAreaMapping_Import" size="small" @click="importList">{{ $t('common_import') }}</ody-button>
        <ody-button name="OdtsAreaMapping_Export_exportList" code="OdtsAreaMapping_Export" size="small" @click="exportList">{{ $t('common_export') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :can-filter="false"
          :operates="operates"
          :multiple="true"
          :checked.sync="checked"
          :selectable="handleSelectable"
          name="list370"
        />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"/>

      </div>
    </ody-list-table-area>
    <ChannelExportTask
      :visible.sync="visibleOfTask"
      :code="exportCode"
      task-type="7,8"
    />
    <ody-dialog :visible.sync="dialogTableVisible" :title="$t('common_import')">
      <el-form ref="fileUpload" :model="fileUpload" :inline="true" :rules="rules">
        <el-row align="center">
          <el-col align="center">
            <el-form-item :label="$t('common_fileUpload')" prop="fileNames">
              <el-input v-model="fileUpload.fileNames" name="fileUpload_fileNames" type="text" disabled="true"/>
            </el-form-item>
            <el-form-item>
              <el-upload
                ref="upload"
                :on-change="handlePreview"
                :on-success="handleSuccess"
                :auto-upload="false"
                :show-file-list="false"
                :action="doUpload"
                name="fileData"
                multiple="false"
                class="upload-demo"
                accept=".xls,.xlsx">
                <el-button type="primary" size="small">{{ $t('common_chooseFile') }}</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-button name="downLoadTemplate" type="primary" size="small" @click="downLoadTemplate">{{ $t('common_import_fileModel') }}</el-button>
          </el-col>
          <el-col :span="12" align="right">
            <el-button name="cancelSubmit" type="primary" size="small" @click="cancelSubmit">{{ $t('common_cancel') }}</el-button>
            <el-button name="onSubmitUploadFile" type="primary" size="small" @click="onSubmitUploadFile('fileUpload')">{{ $t('common_save') }}</el-button>
          </el-col>
        </el-row>
      </el-form>
    </ody-dialog>
    <ChannelMappingSet :visible.sync="visible" :modal-type.sync="modalType" :selected-item.sync="selectedItem" :channel-list.sync="channelList" @ok="handleOk" />
    <ChannelMappingReturnSet :return-visible.sync="returnVisible" :modal-type.sync="modalType" :selected-item.sync="selectedItem" @ok="handleOk" />
  </section>
</template>

<script>
import ChannelMappingSet from '@/components/areaMappingSet'
import ChannelMappingReturnSet from '@/components/areaMappingSet/return.vue'
import $ from 'jquery'
export default {
  name: 'OdtsAreaMapping',
  components: {
    ChannelMappingSet,
    ChannelMappingReturnSet
  },
  data() {
    const vue = this
    return {
      visible: false,
      returnVisible: false,
      modalType: 'add',
      checked: [],
      loading: false,
      dialogTableVisible: false,
      merchants: [],
      warehouseList: [],
      operaMerchantId: null,
      distributionModeItems: [],
      fileUpload: {
        fileNames: '',
        file: ''
      },
      activeState: '0',
      searchForm: getDefaultSearchForm(),
      doUpload: '/api/odts-web/do/import',
      list: [],
      storeList: [],
      channelList: [],
      channelMap: {},
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      files: null,
      rules: {
        fileNames: [
          { required: true, message: vue.$t('common_please_selectFile'), trigger: 'blur' }
        ]
      },
      columns: [
        {
          show: true,
          prop: 'channelName', // 渠道名称
          label: this.$t('channel_name'),
          align: 'center',
          minWidth: 100,
          formatter: (row, column) => {
            if (!row.channelName) {
              row.channelName = vue.channelMap[row.channelCode]
            }
            return row.channelName
          }
        },
        {
          show: true,
          prop: 'areaCode', // 区域编码
          label: this.$t('area_code'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'areaName', // 区域名称
          label: this.$t('area_name'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'channelAreaCode', // 第三方区域编码
          label: this.$t('third_area_code'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'channelAreaName', // 第三方区域名称
          label: this.$t('third_area_name'),
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          prop: 'createTime', // 创建时间
          label: this.$t('common_create_time'),
          align: 'center',
          minWidth: 150,
          formatter: (row, column) => {
            if (row.createTime) {
              return this.$portal.parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
            return ''
          }
        }
      ],
      operates: {
        fixed: 'right',
        width: 120,
        align: 'center',
        list: [
          {
            label: this.$t('common_edit'),
            method: (index, row) => {
              this.selectedItem = row
              this.openEditDialog(false)
              this.modalType = 'edit'
            },
            code: 'OdtsAreaMapping_Edit'
          },
          {
            label: this.$t('common_delete'),
            method: (index, row) => {
              this.selectedItem = row
              this.deleteItem(row)
            },
            code: 'OdtsAreaMapping_Delete'
          }
        ]
      },
      handleSelectable(row, index) {
        return row.isDeleted === 0
      }
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
    onSubmitUploadFile(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$refs.upload.submit()
          this.dialogTableVisible = false
        } else {
          return false
        }
      })
    },
    onBatchDelete() {
      // 批量删除
      if (this.checked && this.checked.length > 0) {
        this.$confirm(this.$t('whether_to_confirm_the_cancellation') + '?', this.$t('common_batch_cancel'), {
          confirmButtonText: this.$t('ok'),
          cancelButtonText: this.$t('common_cancel'),
          type: 'warning'
        }).then(() => {
          var param = []
          this.checked.map(o => param.push(o.id))
          this.$odts.$api.areaMp.batchDeleteAreaMapping(JSON.stringify(param)).then((data) => {
            if (data) {
              this.checked = []
              this.updateList()
              this.$message(this.$t('promptOperateSuccess'))
            } else {
              this.$message(this.$t('common_request_fail') + data.message)
            }
          })
        })
      } else {
        this.$message({
          type: 'warn',
          message: this.$t('common_please_select_one')
        })
      }
    },
    importList() {
      this.$router.push({
        name: 'OdtsAreaMappingBatch'
      })
    },
    exportList() {
      const exportUrl = 'api/odts-web/areaMapping/exportAreaMapping.do'
      const queryCondition = JSON.stringify(this.searchForm)
      const exportframe = $('<iframe style="display:none"/>')
      var url = encodeURI(encodeURI(exportUrl + '?queryContent=' + queryCondition))
      exportframe.attr({ 'src': url })
      $('body').append(exportframe)
    },
    handleOk() {
      /** 对话框点击确认以后的回调 */
      this.updateList()
    },
    cancelSubmit() {
      this.dialogTableVisible = false
      this.fileUpload.fileNames = ''
    },
    handlePreview(file) {
      this.fileUpload.fileNames = file.name
    },
    deleteItem: function(row) {
      const vue = this
      this.$confirm(this.$t('delete_confirm'), this.$t('prompt'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('common_cancel'),
        type: 'info'
      }).then(() => {
        const deleteUrl = vue.$odts.$api.areaMp.deleteAreaMapping
        deleteUrl(row).then((res) => {
          this.$message({
            type: 'info',
            message: this.$t('common_delete_success')
          })
          this.updateList()
        })
      }).catch(() => {})
    },
    async updateList() {
      try {
        this.loading = true
        await loadList(this)
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
      this.updateList()
    },
    handlePageSizeChange(size) {
      this.handleSearchSubmit()
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    init() {
      this.updateList()
    },
    addChannelMapping: function() {
      this.selectedItem = {}
      this.modalType = 'add'
      this.openFormDialog(true)
    },
    openFormDialog: function(isAdd) {
      this.visible = true
    },
    openEditDialog: function(isAdd) {
      this.returnVisible = true
    }
  }
}
async function loadList(vue) {
  const params = {}
  vue.$odts.$api.odtsMp.supportChannel(params).then(function(res) {
    if (res.code === '0') {
      vue.channelList = res.data || []
      vue.channelMap = vue.channelList.reduce((m, i) => { m[i.channelCode] = i.channelName; return m }, {})
    }
  })
  const param = {
    ...vue.searchForm,
    itemsPerPage: vue.page.size,
    currentPage: vue.page.current
  }
  vue.list = []
  const areaMp = vue.$odts.$api.areaMp
  const result = await areaMp.listAreaMappingPage(param)
  if (result && result.code === '0') {
    const data = result.data.listObj
    vue.list = data || []
    vue.page.total = result.data.total
  }
}
function getDefaultSearchForm() {
  return Object.assign({}, {
    channelCode: null,
    areaCode: null,
    areaName: null,
    channelAreaCode: null,
    channelAreaName: null
  })
}
</script>

<style lang="less" scoped>
  .cp-date-range-picker .data-time-name .el-button{
    line-height: 32px!important;
    height: 32px!important;
  }
  .info_class{
    font-size: 14px;
    height: 20px;
    width: 20px;
    line-height: 20px;
    text-align: center;
    display: inline-block;
    color: #109FFF;
    border: 1px solid #19A3FF;
    border-radius: 12px;
    margin-left: 10px;
    cursor: default;
  }
</style>
