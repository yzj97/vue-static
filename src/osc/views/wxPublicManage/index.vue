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
          :operates="wxPublicOperations"
          :multiple="true"
          name="wxPublicTypeData079"/>
      </div><div slot="page">
        <div class="block">
          <ody-pagination
            :current-page="currentPage4"
            :list="wxPublicTypeData"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="10"
            :total.sync="wxPublicDataTotal"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"/>
        </div>
      </div>
    </section>
    <!--新增、编辑按钮dialog-->
    <div>
      <ody-dialog :visible.sync="editWxPublicDialog.show" :title="editWxPublicDialog.title">
        <el-form ref = "editWxPublicForm" :rules="editWxPublicFormRules" :model="editWxPublicData.obj" style="margin-left: 70px;" label-width="80px" >
          <!--          <el-form ref="editEmployee" :label-position="left" :rules="rules" :model="editObj.obj"-->
          <!--                   :disabled="editObj.edit === false" label-width="80px">-->
          <el-form-item :label="$t('名称')" prop="wechatAccountName">
            <el-input v-model="editWxPublicData.obj.wechatAccountName" :disabled="editWxPublicData.isEditPublic" name="editWxPublicData_obj_wechatAccountName" style="margin-left: 40px; width: 350px;"/>
          </el-form-item>
          <el-form-item label="appId" prop="appId">
            <el-input v-model="editWxPublicData.obj.appId" name="editWxPublicData_obj_appId" style="margin-left: 40px; width: 350px;"/>
          </el-form-item>
          <el-form-item label="appSecret" prop="appSecret">
            <el-input v-model="editWxPublicData.obj.appSecret" name="editWxPublicData_obj_appSecret" style="margin-left: 40px; width: 350px;"/>
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
    <ody-dialog :visible.sync="delWxPublicDialog.show" :title="delWxPublicDialog.title">
      <labe style="text-align: center;">确定删除吗？</labe>
      <el-row style="margin-top: 30px; text-align: center;">
        <el-button name="delWxPublicDialog_show" @click="delWxPublicDialog.show = false">{{ $t('取消') }}</el-button>
        <el-button name="delWxPublic" type="primary" @click="delWxPublic">{{ $t('确定') }}</el-button>
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
      editWxPublicFormRules: {
        wechatAccountName: [
          { required: true, message: '请输入用户账号', trigger: 'change' }
          // { pattern: /^[0-9a-zA-Z_]*$/, message: '仅支持字母数字下划线', trigger: 'change' },
          // { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'change' }
        ],
        appId: [
          { required: true, message: '请输入真实姓名', trigger: 'change' }
        ],
        appSecret: [
          { required: true, message: '请输入用户账号', trigger: 'change' }
        ] },
      wxPublicColumns: [
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
          minWidth: 250
        },
        {
          show: true,
          prop: 'appSecret',
          label: 'AppSecret',
          align: 'left',
          minWidth: 250
        },
        {
          show: true,
          prop: 'createTimeStr',
          label: '创建时间',
          align: 'left',
          minWidth: 150
        },
        {
          show: true,
          prop: 'companyId',
          label: 'companyId',
          align: 'left',
          minWidth: 100
        }
      ],
      wxPublicTypeData: [],
      wxPublicOperations: {
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
              self.initDelWxPublicDialog(index, row)
            }
          }]
      },
      currentEditData: {},
      editWxPublicDialog: { show: false, title: '', editType: 0 },
      editWxPublicData: { obj: {}, isEditPublic: false },
      wxPublicDataTotal: 0,
      delWxPublicDialog: { show: false, title: '' }
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
      wxPublicService.listAppAccountPage({ currentPage: 1, itemsPerPage: 10 }).then(res => {
        for (var i = 0; i < res.data.listObj.length; i++) {
          var obj = res.data.listObj[i]
          obj.createTimeStr = util.timestamp2TimeString(obj.createTime)
        }
        self.wxPublicTypeData = res.data.listObj
        self.wxPublicDataTotal = res.data.listObj.length
      })
    },
    initAddPublicDialog() {
      const self = this
      self.editWxPublicDialog.show = true
      self.editWxPublicDialog.title = '新增'
      self.editWxPublicDialog.editType = 1
      self.editWxPublicData.isEditPublic = false
      self.editWxPublicData.obj = {}
    },
    initEditPublicDialog(index, row) {
      const self = this
      self.editWxPublicDialog.show = true
      self.editWxPublicData.isEditPublic = true
      self.editWxPublicDialog.title = '编辑'
      self.editWxPublicDialog.editType = 2
      self.currentEditData = row
      self.editWxPublicData.obj = row
    },
    // 取消按钮
    cancelEdit() {
      const self = this
      self.editWxPublicDialog.show = false
    },
    // 保存按钮
    saveEdit() {
      const self = this
      this.$refs['editWxPublicForm'].validate((valid) => {
        if (valid) {
          if (self.editWxPublicDialog.editType === 1) {
            self.addWxPublicManage()
          } else if (self.editWxPublicDialog.editType === 2) {
            self.saveWxpublicManage()
          }
          self.editWxPublicDialog.show = false
        }
      })
    },
    // 新增微信公众号配置
    addWxPublicManage() {
      const self = this
      const wxPublicService = this.$osc.$api.wxPublicService
      var addData = util.copy(self.editWxPublicData.obj)
      console.log(addData)
      wxPublicService.saveAppAccount(addData).then(res => {
        self.$message({
          message: '信息更新成功',
          type: 'success'
        })
        self.editWxPublicData.obj = {}
        self.init()
      })
    },
    // 编辑微信公众号配置
    saveWxpublicManage() {
      const self = this
      const wxPublicService = this.$osc.$api.wxPublicService
      var editData = util.copy(self.editWxPublicData.obj)
      editData.id = self.currentEditData.id
      wxPublicService.updateAppAccount(editData).then(res => {
        self.$message({
          message: '信息更新成功',
          type: 'success'
        })
        self.editWxPublicData.obj = {}
        self.init()
      })
    },
    initDelWxPublicDialog(index, row) {
      const self = this
      self.currentEditData = row
      self.delWxPublicDialog.show = true
      self.delWxPublicDialog.title = '删除'
    },
    // 删除微信公众号配置
    delWxPublic() {
      const self = this
      const wxPublicService = this.$osc.$api.wxPublicService
      var delObj = { id: self.currentEditData.id }
      wxPublicService.deleteAppAccount(delObj).then(res => {
        self.$message({
          message: '信息更新成功',
          type: 'success'
        })
        self.editWxPublicData.obj = {}
        self.init()
        self.delWxPublicDialog.show = false
      })
    }
  }
}
</script>
