<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('账号')" prop="userName">
            <el-input v-model="searchForm.userName" :placeholder="$t('请输入账号')" name="searchForm_userName"/>
          </ody-search-item>
          <ody-search-item :label="$t('姓名')" prop="identityCardName">
            <el-input v-model="searchForm.identityCardName" :placeholder="$t('请输入姓名')" name="searchForm_identityCardName"/>
          </ody-search-item>
          <ody-search-item :label="$t('微信号')" prop="alias">
            <el-input v-model="searchForm.alias" :placeholder="$t('请输入微信号')" name="searchForm_alias"/>
          </ody-search-item>
          <ody-search-item :label="$t('设备编号')" prop="deviceNo">
            <el-input v-model="searchForm.deviceNo" :placeholder="$t('请输入设备编号')" name="searchForm_deviceNo"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button name="GuideDeviceRelListQuery_handlePageCurrentChange" code="GuideDeviceRelListQuery" size="small" type="primary" @click="handlePageCurrentChange">{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button name="GuideDeviceRelAdd_add" code="GuideDeviceRelAdd" size="small" type="primary" @click="add">{{ $t('新增') }}</ody-button>
        <ody-button name="GuideDeviceRelImportTemplate_downloadStaticGroupTemplate" code="GuideDeviceRelImportTemplate" size="small" type="primary" @click="downloadStaticGroupTemplate">{{ $t('导入模板下载') }}</ody-button>
        <ody-button name="GuideDeviceRelImport_importList" code="GuideDeviceRelImport" size="small" type="primary" @click="importList">{{ $t('批量导入') }}</ody-button>
        <!--<ody-button name="downloadTaskVisible" size="small" @click="downloadTaskVisible=true">{{ $t('查看任务') }}</el-button>-->
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :can-filter="false"
          :operates="operates"
          name="list247"
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

    <ody-dialog :visible.sync="addOperationForm.showDialog" :title="$t('导入')" width="600px" height="405px">
      <el-form ref="addOperationForm" :model="addOperationForm.form" label-width="80px">
        <el-form-item :label="$t('上传文件')" :rules="[{ required: true, message: $t('请选择文件') }]" class="register" required prop="fileName">
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
            <el-button slot="trigger" size="small">{{ $t('选择文件') }}</el-button>
            <!--<div slot="tip" class="el-upload__tip">请选择xlsx格式文件，若无已导出的文件，请<a name="downloadStaticGroupTemplate" style="color:#1890FF" @click="downloadStaticGroupTemplate">{{$t('下载模板')}}</a></div>-->
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <ody-button name="ui_cancelForm" code="ui" size="small" @click="cancelForm">{{ $t('close') }}</ody-button>
        <ody-button name="ui_submitForm" code="ui" size="small" type="primary" @click="submitForm">{{ $t('save') }}</ody-button>
      </div>
    </ody-dialog>

    <downloadTask :task-type="'guideDeviceRelImport'" :model-type="'export'" :visible.sync="downloadTaskVisible"/>
  </section>
</template>

<script>

import downloadTask from '@/components/downloadTask'
import guideDeviceRelTemplate from '@/views/guideDeviceRel/guideDeviceRelImportTemplate.xlsx'

export default {
  name: 'CrmGuideDeviceRel',
  components: {
    downloadTask
  },
  data() {
    // const vue = this
    return {
      addOperationForm: getDefaultOperation(),
      fileList: [],
      list: [],
      downloadTaskVisible: false,
      searchForm: getDefaultSearchForm(this),
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'userName',
          label: this.$t('账号'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'identityCardName',
          label: this.$t('姓名'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'alias',
          label: this.$t('微信号'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'deviceNo',
          label: this.$t('设备编号'),
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          prop: 'createTime',
          label: this.$t('创建时间'),
          align: 'center',
          minWidth: 150,
          formatter: (row, column, cellValue) => {
            return this.$portal.parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
          }
        }
      ],
      operates: {
        fixed: 'right',
        width: 300,
        align: 'center',
        list: [
          {
            label: this.$t('删除'),
            method: (index, row) => {
              this.$confirm(this.$t('确认删除吗'), this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
                cancelButtonText: this.$t('取消'),
                type: 'warning'
              }).then(() => {
                this.deleted(row)
              })
            },
            code: 'GuideDeviceRelDelete'
          }
        ]
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
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm(this)
    },
    handlePageSizeChange() {
      this.handleSearchSubmit()
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
        this.$forceUpdate()
      } catch (ex) {
        console.log(ex)
      }
    },
    async updateList() {
      try {
        await loadList(this)
        this.$forceUpdate()
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    importList() {
      this.cancelForm()
      this.addOperationForm.showDialog = true
    },
    cancelForm() {
      this.addOperationForm = getDefaultOperation()
      this.fileList = []
    },
    handleRemove(file, fileList) {
      this.addOperationForm.form.fileName = ''
    },
    handlePreview(file) {
      this.addOperationForm.form.fileName = file.name
    },
    add() {
      this.$router.push({ name: 'CrmGuideDeviceRelAdd',
        params: { }
      })
    },
    deleted(row) {
      const self = this
      this.$crm.$api.guideDeviceRel
        .delete(
          {
            delIds: [row.id]
          }
        )
        .then(res => {
          self.$message({
            message: '删除成功',
            type: 'success'
          })
          this.updateList()
        })
    },
    downloadStaticGroupTemplate() {
      this.$portal.downloadFileByGet(guideDeviceRelTemplate, {}, '导入模板.xlsx')
    },
    async submitForm() {
      const params = new FormData()

      Object.keys(this.addOperationForm.form).forEach(key => {
        params.append(key, this.addOperationForm.form[key])
      })

      const file = document.getElementsByName('fileData')[0].files[0]
      params.append('fileData', file)
      try {
        await this.$crm.$api.guideDeviceRel.asyncImport(params)
        this.cancelForm()
        this.$message({
          message: '成功',
          type: 'success'
        })
      } catch (ex) {
        console.error(ex)
      }
    },
    init() {
      this.updateList()
    }
  }
}
function getDefaultSearchForm(vue) {
  return Object.assign(
    {
      page: 1,
      limit: 10
    }
  )
}

// async function imports(vue) {
//   const guideDeviceRel = vue.$crm.$api.guideDeviceRel

//   const res = await guideDeviceRel.asyncImport(vue.searchForm)
//   if (res) {
//     vue.$message({
//       message: vue.$t('导出成功请查看任务列表'),
//       type: 'success'
//     })
//   }
// }

async function loadList(vue) {
  const guideDeviceRel = vue.$crm.$api.guideDeviceRel
  vue.searchForm.page = vue.page.current
  vue.searchForm.limit = vue.page.size

  const res = await guideDeviceRel.listPage(vue.searchForm)
  if (res) {
    const data = res.data
    vue.list = data
    vue.page.total = res.total
  }
}

function getDefaultOperation() {
  var a = Object.assign(
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
  return a
}

</script>

<style lang="less" scoped>
.cp-date-range-picker .data-time-name .el-button {
  line-height: 32px !important;
  height: 32px !important;
}
.info_class {
  font-size: 14px;
  height: 20px;
  width: 20px;
  line-height: 20px;
  text-align: center;
  display: inline-block;
  color: #109fff;
  border: 1px solid #19a3ff;
  border-radius: 12px;
  margin-left: 10px;
  cursor: default;
}
</style>
