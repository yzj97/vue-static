<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item :space="2" :label="$t('提交时间:')" class="register" prop="createDateBegin">
              <el-col :span="10">
                <el-date-picker
                  v-model="searchForm.createDateBegin"
                  :placeholder="$t('选择日期')"
                  name="searchForm_createDateBegin"
                  type="date"/>
              </el-col>
              <el-col :span="1">{{ $t('至') }}</el-col>
              <el-col :span="10">
                <el-date-picker
                  v-model="searchForm.createDateEnd"
                  :placeholder="$t('选择日期')"
                  name="searchForm_createDateEnd"
                  type="date"/>
              </el-col>
            </ody-search-item>
            <ody-search-item :label="$t('审批编号：')" prop="procInstId">
              <el-input v-model="searchForm.procInstId" :placeholder="$t('请输入审批编号')" name="searchForm_procInstId"/>
            </ody-search-item>
            <ody-search-item :label="$t('单据号：')" prop="auditCode">
              <el-input v-model="searchForm.auditCode" :placeholder="$t('请输入单据号')" name="searchForm_auditCode"/>
            </ody-search-item>
            <ody-search-item :label="$t('审批状态：')" prop="finalApprovalResult">
              <el-select v-model="searchForm.finalApprovalResult" :placeholder="$t('全部')" name="searchForm_finalApprovalResult">
                <el-option
                  v-for="i in approvalResult"
                  :key="i.value"
                  :label="i.label"
                  :value="i.value"
                />
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('申请人：')" prop="createUsername">
              <el-input v-model="searchForm.createUsername" :placeholder="$t('请输入申请人')" name="searchForm_createUsername"/>
            </ody-search-item>
            <ody-search-item :space="2" :label="$t('审批时间：')" class="register" prop="approvalDateBegin">
              <el-col :span="10">
                <el-date-picker
                  v-model="searchForm.approvalDateBegin"
                  :placeholder="$t('选择日期')"
                  name="searchForm_approvalDateBegin"
                  type="date"/>
              </el-col>
              <el-col :span="1">{{ $t('至') }}</el-col>
              <el-col :span="10">
                <el-date-picker
                  v-model="searchForm.approvalDateEnd"
                  :placeholder="$t('选择日期')"
                  name="searchForm_approvalDateEnd"
                  type="date"/>
              </el-col>
            </ody-search-item>
            <ody-search-item :label="$t('单据类型：')" prop="auditType">
              <el-select v-model="searchForm.auditType" :placeholder="$t('全部')" name="searchForm_auditType">
                <el-option
                  v-for="i in typeOptions"
                  :key="i.value"
                  :label="i.label"
                  :value="i.value"
                />
              </el-select>
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="initForm" size="small" @click="initForm">{{ $t('重置') }}</el-button>
          <el-button name="query" size="small" type="primary" @click="query">{{ $t('查询') }}</el-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="btn">
          <el-button name="batchOpera" size="mini" type="primary" @click="batchOpera(1)">{{ $t('批量审批通过') }}</el-button>
          <el-button name="batchOpera9" size="mini" type="primary" @click="batchOpera(0)">{{ $t('批量审批不通过') }}</el-button>
        </div>
        <div slot="table">
          <ody-table
            :data="listTable.list"
            :columns="listTable.columns"
            :operates="listTable.operates"
            :selectable="handleSelectable"
            :can-filter="false"
            :multiple="true"
            name="listTable_list966"
            @selection-change="handleSelectionChange"/>
        </div>
        <div slot="page">
          <div class="block">
            <ody-pagination
              :current-page.sync="searchForm.currentPage"
              :list="listTable.list"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="searchForm.itemsPerPage"
              :total.sync="listTable.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="query"
              @current-change="query"/>
          </div>
        </div>
      </ody-list-table-area>
    </section>
    <ody-dialog :visible.sync="editObj.show" :before-close="cancel" :title="editObj.title">
      <el-form ref="form" :label-position="left" :rules="rules" :model="editObj.obj" :disabled="editObj.edit === false" label-width="100px">
        <el-form-item :label="$t('审核结果：')" prop="approvalResult">
          <el-radio-group v-model="editObj.obj.approvalResult" name="editObj_obj_approvalResult">
            <el-radio label="1" >{{ $t('通过') }}</el-radio>
            <el-radio label="0">{{ $t('不通过') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('备注：')" prop="remark">
          <el-input
            v-model="editObj.obj.remark"
            :placeholder="$t('请输入备注')"
            name="editObj_obj_remark"
            type="textarea"
            show-word-limit
            maxlength="100"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="cancel" @click="cancel">{{ $t('取消') }}</el-button>
        <el-button name="commit" type="primary" @click="commit">{{ $t('保存') }}</el-button>
      </div>
    </ody-dialog>
  </div>
</template>
<script>
import util from '@/utils/util'
import constants from '@/utils/constants'

export default {
  name: 'OscApprovalManage',
  data() {
    const self = this
    return {
      rules: {
        approvalResult: [
          { required: true, message: '请选择审批结果', trigger: 'change' }
        ],
        remark: [
          { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'change' }
        ]
      },
      org: {
        // 部门平铺数据列表
        list: [],
        // 部门树结构数据
        tree: []
      },
      // 搜索框对象
      searchForm: {},
      approvalResult: [],
      typeOptions: [],
      editObj: { show: false, obj: {}},
      // 列表框对象
      listTable: {
        checkedList: [],
        list: [],
        total: 0,
        columns: [
          {
            'show': true,
            'prop': 'procInstId',
            'label': '审批编号',
            'align': 'center'
          },
          {
            'show': true,
            'prop': 'createTimeStr',
            'label': '提交时间',
            'align': 'center',
            'minWidth': 120
          },
          {
            'show': true,
            'prop': 'createUsername',
            'label': '申请人',
            'align': 'center'
          },
          {
            'show': true,
            'prop': 'auditCode',
            'label': '单据编号',
            'align': 'center',
            'minWidth': 120
          },
          {
            'show': true,
            'prop': 'auditTypeStr',
            'label': '单据类型',
            'align': 'center'
          },
          {
            'show': true,
            'prop': 'approvalResultStr',
            'label': '审批状态',
            'align': 'center'
          }
        ],
        operates: {
          'width': 100,
          'fixed': 'right',
          'list': [
            {
              'label': '审批',
              hidden(index, row) {
                return row.finalApprovalResult !== null
              },
              show: true,
              'disabled': false,
              method(index, row) {
                self.initEditDialog(row)
              }
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
      this.approvalResult = constants.approvalResult
      this.typeOptions = constants.typeOptions
      try {
        await this.query()
      } catch (e) {
        console.log(e)
      }
    },
    query() {
      const self = this
      const approvalService = this.$osc.$api.approvalService
      approvalService.queryUserApproval(this.searchForm).then(res => {
        self.listTable.list = res.data.listObj
        self.listTable.total = res.data.total
        self.listTable.list.forEach(one => {
          one.auditTypeStr = util.getOnePropByKeyFromArr(this.typeOptions, one.auditType)
          if (one.finalApprovalResult === null) {
            one.approvalResultStr = '待审批'
          } else {
            if (one.finalApprovalResult === 1) {
              one.approvalResultStr = '审批通过'
            } else {
              one.approvalResultStr = '审批拒绝'
            }
          }
        })
      })
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
      this.editObj.obj = { procInstId: obj.procInstId, taskId: obj.taskId }
      this.editObj.show = true
      this.editObj.title = '提交审批'
    },
    commit() {
      const self = this
      const approvalService = this.$osc.$api.approvalService
      this.$refs['form'].validate((valid) => {
        if (valid) {
          approvalService.operatorApproval(this.editObj.obj).then(res => {
            self.$message({
              message: '提交成功',
              type: 'success'
            })
            this.$refs['form'].resetFields()
            self.init()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    batchOpera(approvalResult) {
      const self = this
      const approvalService = this.$osc.$api.approvalService
      if (this.listTable.checkedList.length === 0) {
        this.$message({
          message: '请至少选择一项',
          type: 'error'
        })
        return
      }
      const param = []
      this.listTable.checkedList.forEach(item => { param.push({ procInstId: item.procInstId, taskId: item.taskId, approvalResult: approvalResult }) })
      approvalService.bacthOperatorApproval({ listObj: param }).then(res => {
        self.$message({
          message: '提交成功',
          type: 'success'
        })
        self.init()
      })
    },
    handleSelectable(row, index) {
      return row.finalApprovalResult === null
    },
    handleSelectionChange(checkedList) {
      this.listTable.checkedList = checkedList
    }
  }
}
</script>
