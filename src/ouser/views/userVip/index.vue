<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item :label="$t('VIP卡号：')" prop="vipNo">
              <el-input v-model="searchForm.vipNo" :placeholder="$t('请输入VIP卡号')" name="searchForm_vipNo"/>
            </ody-search-item>
            <ody-search-item :label="$t('手机号：')" prop="mobile">
              <el-input v-model="searchForm.mobile" :placeholder="$t('请输入手机号')" name="searchForm_vipNo"/>
            </ody-search-item>
            <ody-search-item :label="$t('状态')" prop="isAvailable">
              <el-select v-model="searchForm.isAvailable" :placeholder="$t('全部')" name="searchForm_isAvailable">
                <el-option
                  v-for="item in isAvailableList"
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
          <ody-button id="searchVip" name="user_vip_search" code="UserVipQuery" size="small" type="primary" @click="search">{{ $t('查询') }}</ody-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="btn-bottom">
          <ody-button id="UserVipAdd" name="UserVipAdd" code="UserVipAdd" size="mini" type="primary" @click="initEditDialog({})">{{ $t('新增VIP卡') }}</ody-button>
          <ody-button
            name="userVipImport_showUserVipImport"
            size="small"
            style="float:right"
            code="userVipImport"
            @click="showUserVipImport"
          >{{ $t('批量导入VIP卡号') }}</ody-button>
        </div>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="listTable.list"
            :columns="listTable.columns"
            :operates="listTable.operates"
            name="listTable"/>
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
            @size-change="search"
            @current-change="query"/>

        </div>
      </ody-list-table-area>
    </section>
    <ody-dialog :visible.sync="editObj.show" :before-close="cancel" :title="editObj.title">
      <el-form ref="form" :label-position="left" :rules="userVipImportModal.rules" :model="editObj.obj" label-width="120px">
        <el-form-item :label="$t('VIP卡号：')" prop="vipNo">
          <el-input
            id="vipNo"
            v-model="editObj.obj.vipNo"
            :placeholder="$t('请输入VIP卡号')"
            :rules="{
              required: true, message: $t('请输入VIP卡号')
            }"
            name="editObj_obj_vipNo"
            type="text"
            show-word-limit
            maxlength="30"
          />
        </el-form-item>
        <el-form-item :label="$t('VIP客户名称：')" prop="vipName">
          <el-input
            id="vipName"
            v-model="editObj.obj.vipName"
            :placeholder="$t('VIP客户名称')"
            :rules="{
              required: true, message: $t('请输入VIP客户名称')
            }"
            name="editObj_obj_vipName"
            type="text"
            show-word-limit
            maxlength="30"
          />
        </el-form-item>
        <!-- <el-form-item :label="$t('VIP卡状态：')" prop="isAvailable">
          <el-radio v-model="editObj.obj.isAvailable" :label="1" name="form_isAvailable1">{{ $t('启用') }}</el-radio>
          <el-radio v-model="editObj.obj.isAvailable" :label="0" name="form_isAvailable0">{{ $t('停用') }}</el-radio>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="cancel" @click="cancel">{{ $t('取消') }}</el-button>
        <ody-button id="UserVipAdd" name="UserVipAdd_commit" code="UserVipAdd" type="primary" @click="commit">{{ $t('保存') }}</ody-button>
      </div>
    </ody-dialog>
    <!-- VIP导入 -->
    <ody-dialog
      :visible.sync="userVipImportModal.visible"
      :title="$t('导入VIP卡号')"
      width="600px"
      height="405px"
    >
      <el-form
        ref="userVipImportModal"
        :model="userVipImportModal.form"
        :rules="userVipImportModal.rules"
        label-width="80px"
      >
        <el-form-item
          :label="$t('上传文件')"
          :rules="[{ required: true, message: $t('common_please_selectFile') }]"
          class="register"
          required
          prop="fileName"
        >
          <el-input v-model="userVipImportModal.form.fileName" name="userVipImportModal_form_fileName" type="text" disabled="true" />
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
            multiple="false"
          >
            <el-button slot="trigger" size="small">{{ $t('choose_file') }}</el-button>
            <div slot="tip" class="el-upload__tip">
              {{ $t('请选择xlsx格式文件，若无已导出的文件，请') }}
              <a name="downloadUserVipImportTemplate" style="color:#1890FF" @click="downloadUserVipImportTemplate">{{ $t('下载导入模板') }}</a>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <ody-button name="cancelUserVipImport" code="userVipImport" size="small" @click="cancelUserVipImport">{{ $t('cancel') }}</ody-button>
        <ody-button name="submitUserVipImport" code="userVipImport" size="small" type="primary" @click="submitUserVipImport">{{ $t('confirm') }}</ody-button>
      </div>
    </ody-dialog>
  </div>
</template>
<script>
import util from '@/utils/util'
import constants from '@/utils/constants'
import userVipImportTemplate from '@/views/userVip/userVipImport.xlsx'

export default {
  name: 'OuserUserVipManage',
  data() {
    const self = this
    return {
      loading: false,
      rules: {},
      userVipImportModal: {
        visible: false,
        form: {
          fileName: null
        }
      },
      uploadUrl: '/ouser-web/userVip/asynImport',
      // 搜索框对象
      searchForm: {},
      editObj: { show: false, obj: {}},
      createTime: [],
      isAvailableList: [
        {
          value: '1',
          label: this.$t('启用')
        },
        {
          value: '0',
          label: this.$t('停用')
        }
      ],
      releaseChannelCodeList: [
        {
          value: '1',
          label: this.$t('嗨享小程序')
        }
      ],
      // 列表框对象
      listTable: {
        checkedList: [],
        list: [],
        total: 0,
        columns: [
          {
            'show': true,
            'prop': 'vipNo',
            'label': this.$t('VIP卡号'),
            'align': 'center'
          },
          {
            'show': true,
            'prop': 'vipName',
            'label': this.$t('VIP客户名称'),
            'align': 'center'
          },
          {
            'show': true,
            'prop': 'mobile',
            'label': this.$t('手机号'),
            'align': 'center'
          },
          {
            'show': true,
            'prop': 'createUsername',
            'label': this.$t('创建人'),
            'align': 'center'
          },
          {
            'show': true,
            'prop': 'createTimeStr',
            'label': this.$t('创建时间'),
            'align': 'center'
          },
          {
            'show': true,
            'prop': 'isCertified',
            'label': this.$t('是否认证'),
            'align': 'center',
            formatter: (row, column) => {
              return row.isCertified === 1 ? '是' : '否'
            }
          },
          {
            'show': true,
            'prop': 'isAvailable',
            'label': this.$t('卡状态'),
            'align': 'center',
            formatter: (row, column) => {
              return row.isAvailable === 1 ? '启用' : '停用'
            }
          }
        ],
        operates: {
          'width': 100,
          'fixed': 'right',
          'list': [
            {
              'label': this.$t('关闭'),
              show: true,
              'disabled': false,
              hidden: (index, row) => {
                return row.isAvailable === 0
              },
              method(index, row) {
                self.closeVip(row)
              },
              code: 'UserVipEnable'
            }
          ]
        }}

    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.initForm()
      this.initEditObj()
      // 常量赋值
      this.isAvailable = constants.isAvailable
      try {
        await this.query()
      } catch (e) {
        console.log(e)
      }
    },
    async search() {
      this.searchForm.currentPage = 1
      await this.query()
    },
    async query() {
      const self = this
      const userVip = this.$ouser.$api.userVip
      if (this.searchForm.mobile === '') {
        delete this.searchForm.mobile
      }
      if (this.searchForm.isAvailable === '') {
        delete this.searchForm.isAvailable
      }
      try {
        const params = {
          filters: this.searchForm,
          page: this.searchForm.currentPage,
          limit: this.searchForm.itemsPerPage
        }
        this.loading = true
        const res = await userVip.listPage(params)
        self.listTable.list = res.data
        self.listTable.total = res.total
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    handleRemove(file, fileList) {
      this.userVipImportModal.form.fileName = ''
    },
    handlePreview(file) {
      this.userVipImportModal.form.fileName = file.name
    },
    showUserVipImport() {
      this.userVipImportModal.visible = true
    },
    downloadUserVipImportTemplate() {
      this.$portal.downloadFileByGet(
        userVipImportTemplate,
        {},
        'VIP导入模板.xlsx'
      )
    },
    cancelUserVipImport() {
      this.userVipImportModal = {
        visible: false,
        form: {
          fileName: null
        }
      }
    },
    async submitUserVipImport() {
      const [err] = await this.formValidate('userVipImportModal')
      if (err) {
        return
      }
      const params = new FormData()
      Object.keys(this.userVipImportModal.form).forEach(key => {
        params.append(key, this.userVipImportModal.form[key])
      })
      const file = document.getElementsByName('fileData')[0].files[0]
      params.append('fileData', file)
      try {
        await this.$ouser.$api.userVip.aysnImport(params)
        this.cancelUserVipImport()
        this.$message({
          message: this.$t('成功'),
          type: 'success'
        })
        await this.query()
      } catch (ex) {
        console.error(ex)
      }
    },
    cancel() {
      this.$refs['form'].resetFields()
      this.initEditObj()
    },
    // 初始化搜索对象
    initForm() {
      this.searchForm = {
        currentPage: 1,
        itemsPerPage: 10
      }
    },
    initEditObj() {
      this.editObj = { show: false, obj: {}}
    },
    initEditDialog(obj) {
      this.initEditObj()
      this.editObj.obj = util.copy(obj)
      this.editObj.show = true
      if (this.editObj.obj.id) {
        this.editObj.title = this.$t('编辑VIP卡')
      } else {
        this.editObj.title = this.$t('新增VIP卡')
      }
    },
    commit() {
      const self = this
      const userVip = this.$ouser.$api.userVip
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.editObj.obj.isAvailable = 1
          if (this.editObj.obj.id) {
            userVip.update(this.editObj.obj).then(res => {
              self.$message({
                message: this.$t('修改成功'),
                type: 'success'
              })
              this.$refs['form'].resetFields()
              self.init()
            })
          } else {
            userVip.add(this.editObj.obj).then(res => {
              self.$message({
                message: this.$t('添加成功'),
                type: 'success'
              })
              this.$refs['form'].resetFields()
              self.init()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeVip(row) {
      const self = this
      this.$confirm(this.$t('关闭后当前VIP卡失效，确认关闭吗？') + '?', this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })
        .then(() => {
          const userVip = this.$ouser.$api.userVip
          userVip.enable({ vipNo: row.vipNo }).then(res => {
            self.$message({
              message: this.$t('关闭成功'),
              type: 'success'
            })
            self.query()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('取消关闭')
          })
        })
    }
  }
}
</script>
