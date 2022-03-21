<template>
  <div>
    <section>
      <!--新增按钮-->
      <div style="margin-bottom: 30px; margin-top: 20px;">
        <el-button name="initAddPublicDialog" type="primary" size="small" @click="initAddPublicDialog()">{{ $t('新增') }}</el-button>
      </div>

      <!--公众号数据table-->
      <div slot="table">
        <ody-table
          :data="wxPublicTypeData"
          :columns="wxPublicColumns"
          :operates="wxPublicTypeOperations"
          :multiple="true"
          name="wxPublicTypeData491"/>
      </div><div slot="page">
        <div class="block">
          <ody-pagination
            :current-page="currentPage4"
            :list="wxPublicTypeData"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="10"
            :total.sync="wxPublicTypeDataTotal"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"/>
        </div>
      </div>
    </section>
    <!--新增、编辑按钮dialog-->
    <div>
      <ody-dialog :visible.sync="editwxPublicTypeDialog.show" :title="editwxPublicTypeDialog.title">
        <el-form ref = "editwxPublicTypeForm" :rules="editwxPublicTypeFormRules" :model="editwxPublicTypeData.obj" style="margin-left: 70px;" label-width="100px" >
          <!--          <el-form ref="editEmployee" :label-position="left" :rules="rules" :model="editObj.obj"-->
          <!--                   :disabled="editObj.edit === false" label-width="80px">-->
          <el-form-item :label="$t('公众号类型')" prop="wechatTypeId">
            <el-select v-model="editwxPublicTypeData.obj.wechatTypeId" :disabled="editwxPublicTypeData.isEditPublic" :placeholder="$t('请选择公众号类型')" name="editwxPublicTypeData_obj_wechatTypeId" style="margin-left: 40px; width: 350px;">
              <el-option
                v-for="item in wechatTypeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('微信公众号')" prop="wechatAppAccountId">
            <el-select v-model="editwxPublicTypeData.obj.wechatAppAccountId" :placeholder="$t('请选择公众号')" name="editwxPublicTypeData_obj_wechatAppAccountId" style="margin-left: 40px; width: 350px;">
              <el-option
                v-for="item in wechatOptions"
                :key="item.id"
                :label="item.wechatAccountName"
                :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-form>
        <el-row style="margin-top: 30px; text-align: center;">
          <el-button name="cancelEdit" @click="cancelEdit">{{ $t('取消') }}</el-button>
          <el-button name="saveEdit" type="primary" @click="saveEdit">{{ $t('保存') }}</el-button>
        </el-row>
      </ody-dialog>
    </div>
    <div/>
    <!--删除dialog-->
    <ody-dialog :visible.sync="delwxPublicTypeDialog.show" :title="delwxPublicTypeDialog.title">
      <labe style="text-align: center;">确定删除吗？</labe>
      <el-row style="margin-top: 30px; text-align: center;">
        <el-button name="delwxPublicTypeDialog_show" @click="delwxPublicTypeDialog.show = false">{{ $t('取消') }}</el-button>
        <el-button name="delwxPublicType" type="primary" @click="delwxPublicType">{{ $t('确定') }}</el-button>
      </el-row>
    </ody-dialog>
    <div/>
  </div>
</template>

<script>
import util from '@/utils/util'

export default {
  data() {
    const self = this
    return {
      editwxPublicTypeFormRules: {
        wechatTypeId: [
          { required: true, message: '请选择公众号类型', trigger: 'change' }
          // { pattern: /^[0-9a-zA-Z_]*$/, message: '仅支持字母数字下划线', trigger: 'change' },
          // { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'change' }
        ],
        wechatAppAccountId: [
          { required: true, message: '请选择公众号', trigger: 'change' }
        ] },
      wxPublicColumns: [
        {
          show: true,
          prop: 'wechatTypeIdName',
          label: '公众号类型',
          align: 'left',
          minWidth: 150
        },
        {
          show: true,
          prop: 'wechatAccountName',
          label: '名称',
          align: 'left',
          minWidth: 150
        },
        {
          show: true,
          prop: 'appId',
          label: 'AppID',
          align: 'left',
          minWidth: 150
        },
        {
          show: true,
          prop: 'appSecret',
          label: 'AppSecret',
          align: 'left',
          minWidth: 150
        },
        {
          show: true,
          prop: 'createTimeStr',
          label: '创建时间',
          align: 'left',
          minWidth: 150
        }
      ],
      wxPublicTypeData: [],
      wxPublicTypeOperations: {
        width: 200,
        fixed: 'right',
        list: [
          {
            label: '编辑',
            show: true,
            hidden: false,
            disabled: false,
            method(index, row) {
              self.initEditPublicDialog(index, row)
            }
          },
          {
            label: '删除',
            show: true,
            hidden: false,
            disabled: false,
            method(index, row) {
              self.initDelwxPublicTypeDialog(index, row)
            }
          }]
      },
      currentEditData: {},
      editwxPublicTypeDialog: { show: false, title: '', editType: 0 },
      editwxPublicTypeData: { obj: {}, isEditPublic: false },
      wxPublicTypeDataTotal: 0,
      delwxPublicTypeDialog: { show: false, title: '' },
      wechatTypeOptions: [],
      wechatOptions: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      // 初始化
      const self = this
      const wxPublicService = this.$osc.$api.wxPublicService
      wxPublicService.listAppTypeByPage({ currentPage: 1, itemsPerPage: 10 }).then(res => {
        // 初始化
        wxPublicService.getAppType({}).then(appTypeRes => {
          var appTypeJson = self.initAppTypeJson(appTypeRes.data.appTypeList)
          for (var i = 0; i < res.data.listObj.length; i++) {
            var wxPublicType = res.data.listObj[i]
            wxPublicType['wechatTypeIdName'] = appTypeJson[wxPublicType.wechatTypeId]
            wxPublicType.createTimeStr = util.timestamp2TimeString(wxPublicType.createTime)
          }
          self.wxPublicTypeData = res.data.listObj
          self.wxPublicTypeDataTotal = res.data.listObj.length

          // 初始化下拉列表
          wxPublicService.listAppAccountPage({ currentPage: 1, itemsPerPage: 2147483647 }).then(appAcountRes => {
            self.wechatOptions = appAcountRes.data.listObj
            self.wechatTypeOptions = appTypeRes.data.appTypeList
          })
        })
      })
    },
    initAppTypeJson(appTypeList) {
      var appTypeJson = {}
      for (var i = 0; i < appTypeList.length; i++) {
        var appType = appTypeList[i]
        appTypeJson[appType['id']] = appType['name']
      }
      return appTypeJson
    },
    initAddPublicDialog() {
      const self = this
      self.editwxPublicTypeDialog.show = true
      self.editwxPublicTypeDialog.title = '新增'
      self.editwxPublicTypeDialog.editType = 1
      self.editwxPublicTypeData.isEditPublic = false
      self.editwxPublicTypeData.obj = {}
    },
    initEditPublicDialog(index, row) {
      const self = this
      self.editwxPublicTypeDialog.show = true
      self.editwxPublicTypeData.isEditPublic = true
      self.editwxPublicTypeDialog.title = '编辑'
      self.editwxPublicTypeDialog.editType = 2
      self.currentEditData = row
      self.editwxPublicTypeData.obj = row
    },
    // 取消按钮
    cancelEdit() {
      const self = this
      self.editwxPublicTypeDialog.show = false
    },
    // 保存按钮
    saveEdit() {
      const self = this
      this.$refs['editwxPublicTypeForm'].validate((valid) => {
        if (valid) {
          if (self.editwxPublicTypeDialog.editType === 1) {
            self.addwxPublicTypeManage()
          } else if (self.editwxPublicTypeDialog.editType === 2) {
            self.savewxPublicTypeManage()
          }
          self.editwxPublicTypeDialog.show = false
        }
      })
    },
    // 新增微信公众号类型配置
    addwxPublicTypeManage() {
      const self = this
      const wxPublicService = this.$osc.$api.wxPublicService
      var addData = util.copy(self.editwxPublicTypeData.obj)
      console.log(addData)
      wxPublicService.saveAppType(addData).then(res => {
        self.$message({
          message: '信息更新成功',
          type: 'success'
        })
        self.editwxPublicTypeData.obj = {}
        self.init()
      })
    },
    // 编辑微信公众号类型配置
    savewxPublicTypeManage() {
      const self = this
      const wxPublicService = this.$osc.$api.wxPublicService
      var editData = util.copy(self.editwxPublicTypeData.obj)
      editData.id = self.currentEditData.id
      wxPublicService.updateAppType(editData).then(res => {
        self.$message({
          message: '信息更新成功',
          type: 'success'
        })
        self.editwxPublicTypeData.obj = {}
        self.init()
      })
    },
    initDelwxPublicTypeDialog(index, row) {
      const self = this
      self.currentEditData = row
      self.delwxPublicTypeDialog.show = true
      self.delwxPublicTypeDialog.title = '删除'
    },
    // 删除微信公众号配置
    delwxPublicType() {
      const self = this
      const wxPublicService = this.$osc.$api.wxPublicService
      var delObj = { id: self.currentEditData.id, wechatAppAccountId: self.currentEditData.wechatAppAccountId, wechatTypeId: self.currentEditData.wechatTypeId }
      wxPublicService.deleteAppType(delObj).then(res => {
        self.$message({
          message: '信息更新成功',
          type: 'success'
        })
        self.editwxPublicTypeData.obj = {}
        self.init()
        self.delwxPublicTypeDialog.show = false
      })
    }
  }
}
</script>
