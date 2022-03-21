<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('分组名称:')" prop="filters.groupName">
            <el-input v-model="searchForm.filters.groupName" name="searchForm_filters_groupName" />
          </ody-search-item>
          <ody-search-item :label="$t('分组类型:')" prop="filters.groupType">
            <el-select v-model="searchForm.filters.groupType" :placeholder="$t('请选择')" name="searchForm_filters_groupType">
              <el-option
                v-for="item in groupTypeList"
                :key="item.code"
                :label="item.name"
                :value="item.code"/>
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('会员人数:')" prop="memberNumArray">
            <ody-number-range
              v-model="memberNumArray"
              name="memberNumArray"
              link-string="-"
              range="[0, 999999999)"/>
          </ody-search-item>
          <ody-search-item :label="$t('选择分类:')" prop="filters.userClassifyId">
            <el-select v-model="searchForm.filters.userClassifyId" :placeholder="$t('请选择')" name="searchForm_filters_userClassifyId">
              <el-option
                v-for="item in userClassifyList"
                :key="item.id"
                :label="item.classifyName"
                :value="item.id"/>
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button name="userGroupListPage_handlePageCurrentChange" code="userGroupListPage" size="small" type="primary" @click="handlePageCurrentChange">{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button name="userGroupAdd_handleAdd" code="userGroupAdd" size="small" type="primary" @click="handleAdd">{{ $t('新增分组') }}</ody-button>
        <ody-button name="userGroupAsyncImport_importStaticGroup" class="import-static" code="userGroupAsyncImport" size="small" @click="importStaticGroup">{{ $t('导入静态分组') }}</ody-button>
        <ody-import-task-button
          pool="crm"
          task-type="userGroupImport"
          name="userGroupSeeTask_downloadTaskVisible"
          code="userGroupSeeTask"
          size="small"
        >{{ $t('seeImportTask') }}</ody-import-task-button>
        <!--<ody-button name="userGroupSeeTask_downloadTaskVisible" code="userGroupSeeTask" size="small" @click="downloadTaskVisible=true">{{ $t('common_see_task') }}</ody-button>-->
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :can-filter="true"
          :operates="operates"
          name="list407"
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
          @current-change="handlePageCurrentChange"
        />

      </div>
    </ody-list-table-area>

    <crm-group-edit-modal
      :visible.sync="modal.group.visible"
      :status-type="modal.group.statusType"
      :id="modal.group.id"
      @ok="handleModalOk"
    />

    <ody-dialog :visible.sync="addOperationForm.showDialog" :title="$t('导入静态分组')" width="600px" height="405px">
      <el-form ref="addOperationForm" :model="addOperationForm.form" :rules="addOperationForm.rules" label-width="100px">
        <el-form-item :label="$t('分组名称:')" :rules="[{ required: true, message: $t('请输入分组名称') }]" class="register" required prop="groupName">
          <el-input v-model="addOperationForm.form.groupName" name="addOperationForm_form_groupName" maxlength="20"/>
        </el-form-item>
        <el-form-item :label="$t('选择分类:')" :rules="[{ required: true, message: $t('请选择分类') }]" class="register" required prop="userClassifyId">
          <el-select v-model="addOperationForm.form.userClassifyId" name="addOperationForm_form_userClassifyId">
            <el-option
              v-for="item in userClassifyList"
              :key="item.id"
              :label="item.classifyName"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('分组类型:')" required>
          <el-select v-model="addOperationForm.groupType" :disabled="true" name="addOperationForm_groupType">
            <el-option
              v-for="item in groupTypeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('上传文件:')" :rules="[{ required: true, message: $t('common_please_selectFile') }]" class="register" required prop="fileName">
          <el-input v-model="addOperationForm.form.fileName" name="addOperationForm_form_fileName" type="text" disabled="true" />
          <el-upload
            ref="upload"
            :action="uploadUrl"
            :before-upload="checkFile"
            :on-change="handlePreview"
            :on-remove="handleRemove"
            :show-file-list="false"
            :auto-upload="false"
            name="fileData"
            class="upload-demo"
            accept=".xlsx"
            multiple="false">
            <el-button slot="trigger" size="small">{{ $t('choose_file') }}</el-button>
            <div slot="tip" class="el-upload__tip">{{ $t('请选择xlsx格式文件，若无已导出的文件，请') }}<a name="downloadStaticGroupTemplate" style="color:#1890FF" @click="downloadStaticGroupTemplate">{{ $t('download_template') }}</a></div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <ody-button name="cancelForm" size="small" @click="cancelForm">{{ $t('cancel') }}</ody-button>
        <ody-button name="userGroupAsyncImport_submitForm" code="userGroupAsyncImport" size="small" type="primary" @click="submitForm">{{ $t('confirm') }}</ody-button>
      </div>
    </ody-dialog>

  </section>
</template>

<script>
import CrmGroupEditModal from '@/components/group-edit-modal'
import staticGroupImportTemplate from '@/views/userGroup/staticGroupImportTemplate.xlsx'
export default {
  name: 'CrmUserGroup',
  list: [],
  components: {
    CrmGroupEditModal
  },
  data() {
    const self = this
    return {
      loading: false,
      uploadUrl: '/crm-web/ouserGroup/asyncImport',
      fileList: [],
      addOperationForm: getDefaultOperation(),
      createTypeList: [],
      groupTypeList: [],
      userClassifyList: [],
      searchForm: getDefaultSearchForm(),
      memberNumArray: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'groupName',
          label: this.$t('分组名称'),
          align: 'center',
          minWidth: 124,
          render: (h, params) => {
            const toUserList = self.toUserList
            return (
              <el-link underline='true' type='primary' on-click={(e) => toUserList(params.row)}>{params.row.groupName}</el-link>
            )
          }
        },
        {
          show: true,
          prop: 'memberNum',
          label: this.$t('会员数'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'createType',
          label: this.$t('创建方式'),
          align: 'center',
          minWidth: 124,
          formatter: (row, column, cellValue) => {
            return this.createTypeMap[row.createType]
          }
        },
        {
          show: true,
          prop: 'groupType',
          label: this.$t('分组类型'),
          align: 'center',
          minWidth: 124,
          formatter: (row, column, cellValue) => {
            return this.groupTypeMap[row.groupType]
          }
        },
        {
          show: true,
          prop: 'updateTime',
          label: this.$t('更新时间'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column) => {
            if (row.updateTime) {
              return this.$portal.parseTime(row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
            return this.$portal.parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
          }
        }
      ],
      operates: {
        fixed: 'right',
        width: 160,
        align: 'center',
        list: [
          {
            label: this.$t('刷新'),
            code: 'userGroupRefresh',
            hidden: (index, row) => {
              return row.groupType !== 0
            },
            method: (index, row) => {
              this.$confirm(this.$t('确认刷新吗'), this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
                cancelButtonText: this.$t('取消'),
                type: 'warning'
              }).then(() => {
                this.refresh(row)
              })
            }
          },
          {
            label: this.$t('删除'),
            code: 'userGroupDelete',
            method: async(index, row) => {
              if (await this.validDeleted(row)) {
                this.$confirm(this.$t('无法删除该分组，该分组在某个主动营销任务中使用'), this.$t('提示'), {
                  showConfirmButton: false,
                  cancelButtonText: this.$t('知道了'),
                  type: 'warning'
                })
              } else {
                this.$confirm(this.$t('确认删除吗'), this.$t('提示'), {
                  confirmButtonText: this.$t('确定'),
                  cancelButtonText: this.$t('取消'),
                  type: 'warning'
                }).then(() => {
                  this.deleted(row)
                })
              }
            }
          }
        ]
      },
      modal: {
        group: {
          statusType: 'add',
          id: -1,
          visible: false
        }
      }
    }
  },
  computed: {
    createTypeMap() {
      return this.createTypeList.reduce((rtv, item) => {
        rtv[item.code] = this.$t(item.name)
        return rtv
      }, {})
    },
    groupTypeMap() {
      return this.groupTypeList.reduce((rtv, item) => {
        rtv[item.code] = this.$t(item.name)
        return rtv
      }, {})
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
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async validDeleted(row) {
      const res = await this.$crm.$api.userGroupMktRelation.list({ 'filters': { 'userGroupId': row.id }})
      if (res.data !== null && res.data.length > 0) {
        return true
      }
      return false
    },
    async refresh(row) {
      const res = await this.$crm.$api.userGroup.refresh({ 'id': row.id })
      if (res.code !== '0') {
        this.$message({
          message: res.message,
          type: 'error'
        })
      } else {
        await this.handleSearchSubmit()
        this.$message({
          message: this.$t('刷新成功'),
          type: 'success'
        })
      }
    },
    async deleted(row) {
      const res = await this.$crm.$api.userGroup.delete([row.id])
      if (res.code !== '0') {
        this.$message({
          message: res.message,
          type: 'error'
        })
      } else {
        await this.handleSearchSubmit()
        this.$message({
          message: this.$t('common.deleteSuccess'),
          type: 'success'
        })
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
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
    async listUserClassify() {
      this.$crm.$api.userClassify.list({ filters: {}}).then((res) => {
        this.userClassifyList = res.data
      })
    },
    async configListMulti() {
      const vue = this
      this.$crm.$api.userGroup.configListMulti({ categorys: ['user_group_type', 'user_group_create_type'], pool: 'crm' }).then(resp => {
        for (const i in resp.data['user_group_type']) {
          vue.groupTypeList.push({ code: +i, name: resp.data['user_group_type'][i] })
        }
        for (const i in resp.data['user_group_create_type']) {
          vue.createTypeList.push({ code: +i, name: resp.data['user_group_create_type'][i] })
        }
      })
    },
    handleModalOk() {
      this.updateList()
    },
    handleAdd() {
      this.modal.group.visible = true
      this.modal.group.id = -1
      this.modal.group.statusType = 'add'
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
      this.memberNumArray = []
      this.handleSearchSubmit()
    },
    handlePageSizeChange() {
      this.handleSearchSubmit()
    },
    toUserList(row) {
      var userClassifyName = null
      this.userClassifyList.forEach(item => {
        if (item.id === row.userClassifyId) {
          userClassifyName = item.classifyName
          return
        }
      })
      this.$router.push({
        name: 'CrmUserList',
        query: {
          id: row.id,
          groupName: row.groupName,
          memberNum: row.memberNum,
          userClassifyName: userClassifyName,
          groupType: row.groupType
        }
      })
    },
    importStaticGroup() {
      this.cancelForm()
      this.addOperationForm.showDialog = true
    },
    cancelForm() {
      this.addOperationForm = getDefaultOperation()
      this.fileList = []
    },
    async submitForm() {
      const [err] = await this.formValidate('addOperationForm')

      if (err) {
        return
      }

      const params = new FormData()

      Object.keys(this.addOperationForm.form).forEach(key => {
        params.append(key, this.addOperationForm.form[key])
      })

      const file = document.getElementsByName('fileData')[0].files[0]
      params.append('fileData', file)
      try {
        await this.$crm.$api.userGroup.asyncImport(params)
        this.cancelForm()
        this.$message({
          message: this.$t('成功'),
          type: 'success'
        })
      } catch (ex) {
        console.error(ex)
      }
    },
    downloadStaticGroupTemplate() {
      this.$portal.downloadFileByGet(staticGroupImportTemplate, {}, '静态分组导入模板.xlsx')
    },
    handleRemove(file, fileList) {
      this.addOperationForm.form.fileName = ''
    },
    handlePreview(file) {
      this.addOperationForm.form.fileName = file.name
    },
    init() {
      this.configListMulti()
      this.updateList()
      this.listUserClassify()
    }
  }
}
function getDefaultSearchForm() {
  return Object.assign(
    {
      page: 1,
      limit: 10,
      filters: {
      }
    }
  )
}

function getDefaultOperation() {
  return Object.assign(
    {
      rules: [],
      showDialog: false,
      groupType: 1,
      form: {
        groupName: null,
        userClassifyId: null,
        fileName: null
      }
    }
  )
}

async function loadList(vue) {
  const userGroup = vue.$crm.$api.userGroup
  vue.searchForm.page = vue.page.current
  vue.searchForm.limit = vue.page.size
  if (vue.memberNumArray) {
    vue.searchForm.filters.memberNumStart = vue.memberNumArray[0]
    vue.searchForm.filters.memberNumEnd = vue.memberNumArray[1]
  }
  const res = await userGroup.listPage(vue.searchForm)
  if (res) {
    const data = res.data
    vue.list = data
    vue.page.total = res.total
  }
}
</script>
<style scoped>
.import-static{
  margin-right:16px;
}
</style>
