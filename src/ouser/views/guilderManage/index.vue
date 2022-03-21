<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item :label="$t('用户账号:')" prop="username">
              <el-input v-model="searchForm.username" name="searchForm_username" />
            </ody-search-item>
            <ody-search-item :label="$t('姓名:')" prop="identityCardName">
              <el-input v-model="searchForm.identityCardName" name="searchForm_identityCardName" />
            </ody-search-item>
            <ody-search-item :label="$t('手机号:')" prop="mobile">
              <el-input v-model="searchForm.mobile" name="searchForm_mobile" />
            </ody-search-item>
            <ody-search-item :label="$t('组织架构')+':'" prop="departmentId">
              <ody-organization-select v-model="searchForm.departmentId" placeholder="全部" />
            </ody-search-item>
            <ody-search-item :label="$t('状态:')" prop="isAvailable">
              <el-select v-model="searchForm.isAvailable" :placeholder="$t('全部')" name="searchForm_isAvailable">
                <el-option
                  v-for="item in isAvailable"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="initForm" size="small" @click="initForm">{{ $t('重置') }}</el-button>
          <ody-button name="OuserGuilderManageQuery_query" code="OuserGuilderManageQuery" size="small" type="primary" @click="query">{{ $t('查询') }}</ody-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="btn-bottom">
          <ody-button
            :disabled="!canUpload"
            name="importGuideStoreConf"
            size="small"
            code="OuserGuilderManage401"
            type="primary"
            @click="showImportGuideDialog"
          >{{ $t('批量设置佣金比例') }}</ody-button>
        </div>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="listTable.list"
            :columns="listTable.columns"
            :operates="listTable.operates"
            :data-key="listTable.dataKey"
            :checked.sync="listTable.checkedList"
            name="listTable_list215"
          />
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="searchForm.currentPage"
            :list="listTable.list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="searchForm.itemsPerPage"
            :total.sync="listTable.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="queryEmployeePageByIdentityType"
            @current-change="queryEmployeePageByIdentityType"
          />

        </div>
      </ody-list-table-area>

      <ody-dialog
        :visible.sync="showGuideCommissionConfig"
        :append-to-body="true"
        :title="$t('设置佣金比例')"
        width="700px">
        <div slot="content">
          <el-form ref="guideAuthInfo" :model="guideAuthInfo" label-position="right" label-width="80px">
            <el-form-item :label="$t('账号')" prop="mpCode">
              <span>{{ guideAuthInfo.username }}</span>
            </el-form-item>
            <el-form-item :label="$t('姓名')" prop="mpName">
              <span>{{ guideAuthInfo.identityCardName }}</span>
            </el-form-item>
            <el-form-item :label="$t('手机号')" prop="merchantName">
              <span>{{ guideAuthInfo.mobile }}</span>
            </el-form-item>
            <el-form-item :label="$t('邮箱')" prop="email">
              <span>{{ guideAuthInfo.email }}</span>
            </el-form-item>
            <el-row type="flex" justify="end">
              <el-button
                name="fillCommissionRate"
                size="mini"
                code="ui"
                type="primary"
                @click="fillCommissionRate">{{ $t('批量填充') }}</el-button>
            </el-row>
            <el-table
              :data="guideAuthStoreList"
              :span-method="spanMethod"
              name="guideAuthStoreList"
              max-height="550"
              border
              style="width: 100%; margin-top: 10px">
              <el-table-column prop="storeName" align="center">
                <template slot="header" slot-scope="scope">
                  <span>{{ $t('店铺名称') }}</span>
                </template>
                <template slot-scope="scope">
                  {{ scope.row['storeName'] }}
                </template>
              </el-table-column>
              <el-table-column prop="merchantName" align="center">
                <template slot="header" slot-scope="scope">
                  <span>{{ $t('所属商家') }}</span>
                </template>
                <template slot-scope="scope">
                  {{ scope.row['merchantName'] }}
                </template>
              </el-table-column>
              <el-table-column prop="channelName" align="center">
                <template slot="header" slot-scope="scope">
                  <span>{{ $t('销售渠道') }}</span>
                </template>
                <template slot-scope="scope">
                  {{ scope.row['channelInfoList'][0]['channelName'] }}
                </template>
              </el-table-column>
              <el-table-column prop="commissionRate" align="center" width="200">
                <template slot="header" slot-scope="scope">
                  <ody-input-number v-model="guideAuthInfo.commissionRate" :decimal="2" :placeholder="$t('提成比例')+'（%）'" min="0" max="50.00" name="default_commissionRate" clearable/>
                </template>
                <template slot-scope="scope">
                  <ody-input-number v-model="scope.row.commissionRate" :decimal="2" min="0" max="50.00" name="row_commissionRate" class="require" clearable/>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <ody-button
            name="showGuideCommissionConfigOk"
            size="small"
            type="primary"
            code="ui"
            @click="saveCommissionRate()"
          >{{ $t('common.save') }}</ody-button>
          <ody-button
            name="showGuideCommissionConfigCancel"
            size="small"
            type="danger"
            code="ui"
            @click="closeCommissionDialog()"
          >{{ $t('common.cancel') }}</ody-button>
        </span>
      </ody-dialog>
      <ody-dialog :visible.sync="importVisible" :title="$t('批量设置佣金比例')" @close="closeImportGuideDialog">
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
            <el-form-item>
              <span>{{ $t('请选择xlsx格式文件，若无导入的文件，请') }}</span>
              <el-button name="ui_downloadGuideStoreConfTemplate" size="small" code="ui" @click="downloadGuideStoreConfTemplate">{{ $t('下载导入模板') }}</el-button>
            </el-form-item>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <ody-button name="handleClose" size="small" code="ui" @click="closeImportGuideDialog">{{ $t('common_cancel') }}</ody-button>
          <ody-button
            name="submitImportGuideForm"
            size="small"
            type="primary"
            code="OuserGuilderManage401"
            @click="submitImportGuideForm('fileUploadForm')"
          >{{ $t('common_upload') }}</ody-button>
        </span>
      </ody-dialog>
    </section>
  </div>
</template>

<script>
import util from '@/utils/util'
import constants from '@/utils/constants'
import guideStoreConfTemplate from '@/excelfile/guideStoreConfTemplate.xlsx'

export default {
  name: 'OuserGuilderManage',
  components: { guideStoreConfTemplate },
  data() {
    return {
      loading: false,
      showGuideCommissionConfig: false,
      // 列表框对象
      listTable: {
        dataKey: 'userId',
        checkedList: [],
        list: [],
        total: 0,
        columns: [
          {
            show: true,
            prop: 'username',
            label: this.$t('账号'),
            align: 'center'
          },
          {
            show: true,
            prop: 'identityCardName',
            label: this.$t('姓名'),
            align: 'center'
          },
          {
            show: true,
            prop: 'mobile',
            label: this.$t('手机号'),
            align: 'center'
          },
          {
            show: true,
            prop: 'departmentNameStr',
            label: this.$t('所在组织节点'),
            align: 'center'
          },
          {
            show: true,
            prop: 'email',
            label: this.$t('邮箱'),
            align: 'center'
          },
          {
            show: true,
            prop: 'isAvailableStr',
            label: this.$t('状态'),
            align: 'center',
            minWidth: 88
          }
        ],
        operates: {
          fixed: 'right',
          align: 'center',
          list: [
            {
              label: this.$t('设置佣金比例'),
              method: (index, row) => {
                this.showCommissionDialog(row)
              },
              code: 'editGuideStoreConf'
            }
          ]
        }
      },
      // 搜索框对象
      searchForm: {},
      // 岗位
      positions: [],
      // 状态列表
      isAvailable: [],
      // 性别列表
      sex: [],
      // 生日日期选择器设置
      datePickerOptions: [],
      identitySubTypes: [],
      // 用户的权限门店
      guideAuthStoreList: [],
      guideAuthInfo: {},
      fileUploadForm: { fileName: null },
      importVisible: false,
      fileList: [],
      canUpload: true
    }
  },
  async mounted() {
    try {
      this.loading = true
      await this.init()
    } finally {
      this.loading = false
    }
  },
  methods: {
    async init() {
      const userService = this.$ouser.$api.userService
      const self = this
      // 常量赋值
      this.isAvailable = constants.isAvailable
      this.identitySubTypes = constants.identitySubTypes
      // 初始化搜索框对象
      this.initForm()
      try {
        // 查询岗位列表
        await userService
          .queryPositionList({
            entityType: 2,
            currentPage: 1,
            itemsPerPage: 500,
            entityIds: []
          })
          .then(res => {
            self.positions = res.data
          })
        // 查询员工列表
        await this.queryEmployeePageByIdentityType()
      } catch (e) {
        console.log(e)
      }
    },
    // 初始化搜索对象
    initForm() {
      this.searchForm = {
        currentPage: 1,
        itemsPerPage: 10
      }
    },
    async query() {
      this.searchForm.currentPage = 1
      await this.queryEmployeePageByIdentityType()
    },
    // 查询列表
    async queryEmployeePageByIdentityType() {
      const employeeService = this.$ouser.$api.employeeService
      const self = this
      // 转换部门id和orgId
      this.loading = true

      const userIds = []
      if (this.searchForm.userId !== undefined && this.searchForm.userId !== null && this.searchForm.userId !== '') {
        userIds.push(this.searchForm.userId)
      }
      this.searchForm.userIds = userIds

      try {
        const res = await employeeService.queryGuideUserPage(this.searchForm)
        self.listTable.total = res.data.total
        self.listTable.list = res.data.listObj
        self.listTable.list.forEach(one => {
          // 转换岗位id和岗位name
          one.positionName = util.getOnePropByKeyFromArr(
            self.positions,
            one.positionId,
            'id',
            'positionName'
          )
          // 转换状态枚举和状态name
          one.isAvailableStr = util.getOnePropByKeyFromArr(
            self.isAvailable,
            one.isAvailable
          )
          one.identitySubTypeStr = util.getOnePropByKeyFromArr(
            self.identitySubTypes,
            one.identitySubType
          )
        })
      } finally {
        this.loading = false
      }
    },
    async showCommissionDialog(row) {
      const storeAuthService = this.$ouser.$api.storeorgpageinfoService
      // const self = this
      const res = await storeAuthService.queryPlatformAuthStorePage({ 'currentPage': 1, 'itemsPerPage': 500, 'userId': row.userId })
      const storeIds = []
      for (const row of res.data.listObj) {
        storeIds.push(row.storeId)
      }
      this.guideAuthInfo = row
      const existingConfs = {}
      if (storeIds.length) {
        const agentService = this.$ouser.$api.agentService
        const crs = await agentService.listGuideStoreConf({ 'page': 1, 'limit': 500, 'filters': { 'userId': row.userId, 'storeId': storeIds }})
        console.log(crs)
        for (const ec of crs.data) {
          existingConfs[ec.storeId] = ec.commissionRate
        }
      }
      for (const s of res.data.listObj) {
        s.channelCode = s.channelInfoList[0].channelCode
        s.channelName = s.channelInfoList[0].channelName
        s.commissionRate = existingConfs[s.storeId] || 0
        s.userId = row.userId
      }
      this.guideAuthStoreList = res.data.listObj
      this.showGuideCommissionConfig = true
    },
    async saveCommissionRate() {
      const agentService = this.$ouser.$api.agentService
      await agentService.updateGuideStoreConf(this.guideAuthStoreList)
      this.showGuideCommissionConfig = false
    },
    closeCommissionDialog() {
      this.showGuideCommissionConfig = false
    },
    fillCommissionRate() {
      if (this.guideAuthInfo.commissionRate) {
        for (const row of this.guideAuthStoreList) {
          row.commissionRate = this.guideAuthInfo.commissionRate
        }
        this.guideAuthInfo.commissionRate = null
        this.$forceUpdate()
      }
    },
    showImportGuideDialog() {
      this.importVisible = true
    },
    closeImportGuideDialog() {
      this.canUpload = true
      this.fileUploadForm.fileName = ''
      this.fileList = []
      this.importVisible = false
    },
    handleRemove(file, fileList) {
      this.fileUploadForm.fileName = ''
    },
    handlePreview(file, fileList) {
      this.fileList = [fileList[fileList.length - 1]]
      this.fileUploadForm.fileName = file.name
    },
    downloadGuideStoreConfTemplate() {
      this.$portal.downloadFileByGet(
        guideStoreConfTemplate,
        {},
        '批量设置佣金比例.xlsx'
      )
    },
    async submitImportGuideForm(fileUploadForm) {
      this.$refs[fileUploadForm].validate(valid => {
        if (valid) {
          const file = document.getElementsByName('file')[0].files[0]
          var formData = new FormData()
          formData.append('file', file)
          this.canUpload = false
          const importRequest = this.$ouser.$api.agentService
          importRequest
            .importGuideStoreConf(formData)
            .then(result => {
              if (result && result.code === '0') {
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
    initEditDialog(obj, edit) {
      this.initDialog()
      this.editObj.show = true
      if (obj.userId) {
        // 编辑
        this.editObj.obj = util.copy(obj)
        this.editObj.uploadImg = [{ url: this.editObj.obj.headPicUrl }]
        this.editObj.add = false
        this.editObj.edit = edit
        this.editObj.title = edit ? this.$t('编辑员工') : this.$t('查看员工')
      } else {
        // 新增
        this.editObj.add = true
        this.editObj.title = this.$t('新增员工')
      }
    },
    editDialogCommit() {
      this.$refs['editEmployee'].validate(valid => {
        if (valid) {
          const employeeService = this.$ouser.$api.employeeService
          const self = this
          if (this.editObj.uploadImg.length > 0) {
            this.editObj.obj.headPicUrl = this.editObj.uploadImg[0].url
          }
          if (this.editObj.add) {
            this.editObj.obj.identitySubType = 21
            this.editObj.obj.identityType = 2
            employeeService.addEmployee(this.editObj.obj).then(() => {
              self.$message({
                message: this.$t('添加成功'),
                type: 'success'
              })
              self.editDialogCancel()
            })
          } else {
            employeeService.updateEmployee(this.editObj.obj).then(() => {
              self.$message({
                message: this.$t('信息更新成功'),
                type: 'success'
              })
              self.editDialogCancel()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    editDialogCancel() {
      this.initDialog()
      this.queryEmployeePageByIdentityType()
    },
    initDialog() {
      this.editObj = { show: false, obj: {}, uploadImg: [] }
    },
    resetPassword() {
      const employeeService = this.$ouser.$api.employeeService
      const self = this
      employeeService.resetPassword(this.editObj.obj).then(() => {
        self.$message({
          message: this.$t('信息更新成功'),
          type: 'success'
        })
      })
    },
    batchUpdateEmployeeStatus(status) {
      const userIds = []
      if (this.listTable.checkedList.length === 0) {
        this.$message({
          message: this.$t('请至少选择一项'),
          type: 'error'
        })
        return
      }
      this.listTable.checkedList.forEach(item => {
        userIds.push(item.userId)
      })
      this.updateEmployeeStatus(status, userIds)
    },
    updateEmployeeStatus(status, userIds) {
      const employeeService = this.$ouser.$api.employeeService
      const self = this
      employeeService
        .updateEmployeeStatus({
          identitySubTypes: [21],
          isAvailable: status,
          userIds: userIds
        })
        .then(() => {
          self.$message({
            message: this.$t('信息更新成功'),
            type: 'success'
          })
          this.queryEmployeePageByIdentityType()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
</style>
