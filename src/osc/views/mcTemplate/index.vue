<template>
  <div>
    <section>
      <!--搜索域-->
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item :label="$t('消息编号')" prop="templateCode">
              <el-input v-model="searchForm.templateCode" name="searchForm_templateCode"/>
            </ody-search-item>
            <ody-search-item :label="$t('消息名称')" prop="templateName">
              <el-input v-model="searchForm.templateName" name="searchForm_templateName"/>
            </ody-search-item>
            <ody-search-item :label="$t('审核状态')" prop="mcAuditStatus">
              <el-select v-model="searchForm.mcAuditStatus" name="searchForm_mcAuditStatus">
                <el-option
                  v-for="item in mcAuditStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('短信类型')" prop="smsType">
              <el-select v-model="searchForm.smsType" name="searchForm_smsType">
                <ody-search-item :label="$t('消息类型')" prop="obj.smsType">
                  <el-select v-model="searchForm.obj.smsType" :placeholder="$t('全部')" name="searchForm_obj_smsType">
                    <el-option
                      v-for="item in smsTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"/>
                  </el-select>
                </ody-search-item>
          </el-select></ody-search-item></el-form>
        </div>
        <div slot="btn">
          <el-button name="queryMcTemplateList4Param" size="small" type="primary" @click="queryMcTemplateList4Param(1)">{{ $t('查询') }}</el-button>
          <el-button name="initForm" size="small" @click="initForm">{{ $t('重置') }}</el-button>
        </div>
      </ody-list-search-area>

      <!--table域-->
      <ody-list-table-area>
        <div slot="tabs">
          <el-button name="initAddDialog" size="small" type="primary" @click="initAddDialog">{{ $t('新增') }}</el-button>
        </div>
        <div slot="table">
          <ody-table
            :data="mcTemplateData"
            :columns="mcTemplateColunmns"
            :operates="mcTemplateOperators"
            :multiple="true"
            name="mcTemplateData416"/>
        </div>
        <div slot="page">
          <div class="block">
            <ody-pagination
              :current-page="currentPage4"
              :list="mcTemplateData"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="10"
              :total.sync="mcTemplateDataTotal"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"/>
          </div>
        </div>
      </ody-list-table-area>
    </section>

    <!--新增dialog-->
    <ody-dialog v-if="addMcTemplateDialog.show" :visible.sync="addMcTemplateDialog.show" :title="addMcTemplateDialog.title">
      <el-form ref = "addMcTemplateDialog" :rules="addMcTemplateDialogRules" :model="addMcTemplateDialog.obj" style="margin-left: 70px;" label-width="100px" >
        <el-form-item :label="$t('模板编码')" prop="templateCode">
          <el-input v-model="addMcTemplateDialog.obj.templateCode" :disabled="addMcTemplateDialog.isBrowseType" name="addMcTemplateDialog_obj_templateCode" style="width: 350px; margin-left: 40px;"/>
        </el-form-item>
        <el-form-item :label="$t('模板名称')" prop="templateName">
          <el-input v-model="addMcTemplateDialog.obj.templateName" :disabled="addMcTemplateDialog.isBrowseType" name="addMcTemplateDialog_obj_templateName" style="width: 350px; margin-left: 40px;"/>
        </el-form-item>
        <el-form-item :label="$t('短信类型')" prop="smsType">
          <el-select v-model="addMcTemplateDialog.obj.smsType" :disabled="addMcTemplateDialog.isBrowseType" name="addMcTemplateDialog_obj_smsType" style="margin-left: 40px; width: 350px;" >
            <el-option
              v-for="item in smsTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('签名')" prop="userSignId">
          <el-select v-model="addMcTemplateDialog.obj.userSignId" :disabled="addMcTemplateDialog.isBrowseType" name="addMcTemplateDialog_obj_userSignId" style="margin-left: 40px; width: 350px;" >
            <el-option
              v-for="item in userSignOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('模板内容')" prop="msgContent">
          <el-input v-model="addMcTemplateDialog.obj.msgContent" :disabled="addMcTemplateDialog.isBrowseType" name="addMcTemplateDialog_obj_msgContent" style="width: 350px; margin-left: 40px;"/>
        </el-form-item>
        <el-form-item :label="$t('模板描述')" prop="templateDesc">
          <el-input v-model="addMcTemplateDialog.obj.templateDesc" :disabled="addMcTemplateDialog.isBrowseType" name="addMcTemplateDialog_obj_templateDesc" style="width: 350px; margin-left: 40px;"/>
        </el-form-item>
      </el-form>
      <el-row style="margin-top: 30px; text-align: center;">
        <el-button name="cancelAdd" @click="cancelAdd">{{ $t('取消') }}</el-button>
        <el-button name="addMcTemplate" type="primary" @click="addMcTemplate">{{ $t('保存') }}</el-button>
      </el-row>
    </ody-dialog>

    <!--查看dialog-->
    <ody-dialog v-if="browseMcTemplateDialog.show" :visible.sync="browseMcTemplateDialog.show" :title="browseMcTemplateDialog.title">
      <el-form :model="browseMcTemplateDialog.obj" style="margin-left: 70px;" label-width="100px" >
        <el-form-item :label="$t('模板编码')" prop="templateCode">
          <el-input v-model="browseMcTemplateDialog.obj.templateCode" :disabled="true" name="browseMcTemplateDialog_obj_templateCode" style="width: 350px; margin-left: 40px;"/>
        </el-form-item>
        <el-form-item :label="$t('模板名称')" prop="templateName">
          <el-input v-model="browseMcTemplateDialog.obj.templateName" :disabled="true" name="browseMcTemplateDialog_obj_templateName" style="width: 350px; margin-left: 40px;"/>
        </el-form-item>
        <el-form-item :label="$t('短信类型')" prop="smsType">
          <el-select v-model="browseMcTemplateDialog.obj.smsType" :disabled="true" name="browseMcTemplateDialog_obj_smsType" style="margin-left: 40px; width: 350px;">
            <el-option
              v-for="item in smsTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('签名')" prop="userSignId">
          <el-select v-model="browseMcTemplateDialog.obj.userSignId" :disabled="true" name="browseMcTemplateDialog_obj_userSignId" style="margin-left: 40px; width: 350px;" >
            <el-option
              v-for="item in userSignOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('模板内容')" prop="msgContent">
          <el-input v-model="browseMcTemplateDialog.obj.msgContent" :disabled="true" name="browseMcTemplateDialog_obj_msgContent" style="width: 350px; margin-left: 40px;"/>
        </el-form-item>
        <el-form-item :label="$t('模板描述')" prop="templateDesc">
          <el-input v-model="browseMcTemplateDialog.obj.templateDesc" :disabled="true" name="browseMcTemplateDialog_obj_templateDesc" style="width: 350px; margin-left: 40px;"/>
        </el-form-item>
      </el-form>
      <el-row style="margin-top: 30px; text-align: center;">
        <el-button name="closeBrowseDialog" @click="closeBrowseDialog">{{ $t('关闭') }}</el-button>
      </el-row>
    </ody-dialog>

    <!--删除dialog-->
    <ody-dialog :visible.sync="delTemplateDialog.show" :title="delTemplateDialog.title">
      <labe style="text-align: center;">确定删除吗？</labe>
      <el-row style="margin-top: 30px; text-align: center;">
        <el-button name="delTemplateDialog_show" @click="delTemplateDialog.show = false">{{ $t('取消') }}</el-button>
        <el-button name="delTemplate" type="primary" @click="delTemplate">{{ $t('确定') }}</el-button>
      </el-row>
    </ody-dialog>
  </div>
</template>

<script>
import util from '@/utils/util'
import constants from '@/utils/constants'

export default {
  name: 'OscMcTemplate',
  data() {
    const self = this
    return {
      mcAuditStatusOptions: [],
      smsTypeOptions: [],
      searchForm: {},
      mcTemplateData: [],
      mcTemplateDataTotal: 0,
      userSignOptions: [],
      mcTemplateColunmns: [
        {
          show: true,
          prop: 'templateCode',
          label: '模板编码',
          align: 'left',
          minWidth: 50
        },
        {
          show: true,
          prop: 'templateName',
          label: '模板名称',
          align: 'left',
          minWidth: 50
        },
        {
          show: true,
          prop: 'smsTypeText',
          label: '短信类型',
          align: 'left',
          minWidth: 50
        },
        {
          show: true,
          prop: 'signName',
          label: '签名',
          align: 'left',
          minWidth: 50
        },
        {
          show: true,
          prop: 'createTimeString',
          label: '创建时间',
          align: 'left',
          minWidth: 80
        },
        {
          show: true,
          prop: 'mcAuditStatusText',
          label: '运营审核状态',
          align: 'left',
          minWidth: 50
        },
        {
          show: true,
          prop: 'templateDesc',
          label: '模板描述',
          align: 'left',
          minWidth: 50
        }],
      mcTemplateOperators: {
        width: 400,
        fixed: 'right',
        list: [
          {
            label: '查看',
            show: true,
            hidden: false,
            disabled: false,
            method(index, row) {
              self.initBrowseDialog(index, row)
            }
          },
          {
            label: '编辑',
            show: true,
            hidden: false,
            disabled: false,
            method(index, row) {
              self.initEditDialog(index, row)
            }
          },
          {
            label: '删除',
            show: true,
            hidden: false,
            disabled: false,
            method(index, row) {
              self.initDelTemplateDialog(index, row)
            }
          }]
      },
      addMcTemplateDialog: { show: false, title: '', obj: {}, isBrowseType: false, isAddType: true },
      browseMcTemplateDialog: { show: false, title: '', obj: {}},
      addMcTemplateDialogRules: {
        templateCode: [
          { required: true, message: '请输入模板编号', trigger: 'change' }
        ],
        templateName: [
          { required: true, message: '请输入模板名称', trigger: 'change' }
        ],
        smsType: [
          { required: true, message: '请选择短信类型', trigger: 'change' }
        ],
        userSignId: [
          { required: true, message: '请选择签名类型', trigger: 'change' }
        ],
        msgContent: [
          { required: true, message: '请输入模板内容', trigger: 'change' }
        ],
        templateDesc: [
          { required: true, message: '请输入模板描述', trigger: 'change' }
        ]
      },
      delTemplateDialog: { show: false, title: '' },
      currentEditObj: {}
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const self = this
      const mcTemplateService = this.$osc.$api.mcTemplateService
      // 初始化下拉菜单
      self.mcAuditStatusOptions = constants.mcAuditStatusOptions
      self.smsTypeOptions = constants.smsTypeOptions
      // 初始化列表框
      self.queryMcTemplateList4Param(1)

      mcTemplateService.queryMcUserSignList({ currentPage: 1, itemsPerPage: 65536, obj: {}}).then(res => {
        self.userSignOptions = res.data.listObj
      })
    },
    queryMcTemplateList4Param(currentPage) {
      const self = this
      const mcTemplateService = this.$osc.$api.mcTemplateService

      var requestModel = { currentPage: currentPage, itemsPerPage: 10, obj: util.copy(self.searchForm) }
      mcTemplateService.queryMcTemplateList(requestModel).then(res => {
        for (var i = 0; i < res.data.listObj.length; i++) {
          var mcTemplateObj = res.data.listObj[i]
          mcTemplateObj.createTimeString = util.timestamp2TimeString(mcTemplateObj.createTime)
        }
        self.mcTemplateData = res.data.listObj
        self.mcTemplateDataTotal = res.data.total
      })
    },
    addMcTemplate() {
      const self = this
      const mcTemplateService = this.$osc.$api.mcTemplateService
      // 新增
      if (self.addMcTemplateDialog.isAddType) {
        self.$refs['addMcTemplateDialog'].validate((valid) => {
          if (valid) {
            mcTemplateService.insertMcTemplate(util.copy(self.addMcTemplateDialog.obj)).then(res => {
              self.$message({
                message: '新增成功',
                type: 'success'
              })
              self.init()
            })
            self.addMcTemplateDialog.show = false
          }
        })
      } else {
        // 保存修改
        mcTemplateService.updateMcTemplate(self.addMcTemplateDialog.obj).then(res => {
          self.$message({
            message: '修改成功',
            type: 'success'
          })
          self.init()
        })
        self.addMcTemplateDialog.show = false
      }
    },
    cancelAdd() {
      const self = this
      self.addMcTemplateDialog.show = false
    },
    initAddDialog() {
      const self = this
      self.addMcTemplateDialog.show = true
      self.addMcTemplateDialog.title = '新增'
      self.addMcTemplateDialog.isBrowseType = false
      self.addMcTemplateDialog.isAddType = true
      self.addMcTemplateDialog.obj = {}
    },
    initEditDialog(index, row) {
      const self = this
      self.addMcTemplateDialog.show = true
      self.addMcTemplateDialog.title = '编辑'
      self.addMcTemplateDialog.isBrowseType = false
      self.addMcTemplateDialog.isAddType = false

      self.addMcTemplateDialog.obj = row
    },
    initBrowseDialog(index, row) {
      const self = this
      self.browseMcTemplateDialog.show = true
      self.browseMcTemplateDialog.isBrowseType = true
      self.browseMcTemplateDialog.title = '查看'
      self.browseMcTemplateDialog.obj = row
    },
    closeBrowseDialog() {
      const self = this
      self.browseMcTemplateDialog.show = false
    },
    initForm() {
      const self = this
      self.searchForm = {}
    },
    initDelTemplateDialog(index, row) {
      const self = this
      self.delTemplateDialog.show = true
      self.delTemplateDialog.title = '删除'
      self.currentEditObj = row
    },
    delTemplate() {
      const self = this
      const mcTemplateService = this.$osc.$api.mcTemplateService
      mcTemplateService.deleteMcTemplate(self.currentEditObj).then(res => {
        self.$message({
          message: '删除成功',
          type: 'success'
        })
        self.init()
      })
      self.delTemplateDialog.show = false
    },
    handlePageChange(index) {
      const self = this
      self.queryMcTemplateList4Param(index)
    }
  }
}
</script>
