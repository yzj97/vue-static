<template>
  <div>
    <ody-title :title="$t('员工信息')" />
    <el-row>
      <ody-button
        name="Ouser-DepartmentManage201_initEditEmployeeDialog"
        code="OuserDepartmentManage204"
        size="small"
        type="primary"
        @click="initEditEmployeeDialog({})"
      >{{ $t('添加员工') }}</ody-button>
      <ody-button
        name="Ouser-DepartmentManage202_openChooseEmployeeDialog"
        code="OuserDepartmentManage205"
        size="small"
        @click="openChooseEmployeeDialog"
      >{{ $t('关联员工') }}</ody-button>
      <ody-button
        name="Ouser-DepartmentManage203_openConfirmDeleteEmployee"
        code="OuserDepartmentManage206"
        size="small"
        @click="openConfirmDeleteEmployee"
      >{{ $t('批量删除') }}</ody-button>
      <ody-batch-import-button
        :import-api="importModel.importApi"
        :import-label="importModel.importlabel"
        :download-local-file="importModel.downloadLocalFile"
        :async="importModel.async"
        :pool="importModel.pool"
        :task-type="importModel.taskType"
        name="OuserDepartmentManage310_importUser"
        code="OuserDepartmentManage209"
        size="small"
      >{{ $t('批量导入') }}</ody-batch-import-button>
      <ody-import-task-button
        :pool="importModel.pool"
        :task-type="importModel.taskType"
        name="OuserDepartmentManage311_downloadTaskVisible"
        code="OuserDepartmentManage209"
        size="small"
      >{{ $t('查看任务') }}</ody-import-task-button>
    </el-row>
    <el-row>
      <ody-table
        ref="table"
        :checked.sync="table.checkedList"
        :multiple="true"
        :columns="table.columns"
        :operates="table.operates"
        request-url="/ouser-web/employee/queryEmployeePageByIdentityType.do"
      >
        <template slot="userName" slot-scope="scope">
          <el-button
            :disabled="!$portal.hasPermission('OuserDepartmentManage207')"
            name="initEditEmployeeDialog"
            size="mini"
            @click="initEditEmployeeDialog(scope.row)"
          >
            {{ scope.row.userName }}
          </el-button>
        </template>
        <template slot="isAvailable" slot-scope="scope">
          <el-switch
            :disabled="!$portal.hasPermission('OuserDepartmentManage207')"
            v-model="scope.row.isAvailable"
            :active-value="1"
            :inactive-value="0"
            name="scope_row_isAvailable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeEmployeeStatus(scope.row)"
          />
        </template>
      </ody-table>
    </el-row>
    <employee-edit
      v-if="editDialog.show"
      :user-id="editDialog.userId "
      :department-id="nodeId"
      :show="editDialog.show"
      :add="editDialog.add"
      @close="editDialogCancel"
    />
    <ody-dialog
      v-if="chooseEmployeeDialog.show"
      :visible.sync="chooseEmployeeDialog.show"
      :before-close="closeChooseEmployeeDialog"
      :title="$t('关联员工')"
      width="960px"
      @close="closeChooseEmployeeDialog"
    >
      <choose-employee ref="chooseEmployee" :node-id="nodeId" @onChoose="onChooseEmployeeDialog"/>
    </ody-dialog>
    <ody-dialog-full-right
      v-if="dialogShow"
      :visible.sync="dialogShow"
      :key="selectUserId"
      :title="$t('编辑员工')"
      :before-close="handleBaseInfoClose"
      size="big"
      @close="handleBaseInfoClose">
      <employee-detail ref="employeeDetail" :node-id="nodeId" :user-id="selectUserId"/>
      <div slot="footer">
        <ody-button name="OuserDepartmentManage208_handleBaseInfoClose" code="OuserDepartmentManage208" @click="handleBaseInfoClose">{{ $t('取消') }}</ody-button>
        <ody-button name="OuserDepartmentManage208_saveEmployee" code="OuserDepartmentManage208" type="primary" @click="saveEmployee">{{ $t('保存') }}</ody-button>
      </div>
    </ody-dialog-full-right>
  </div>
</template>

<script>
import EmployeeEdit from '@/components/employeeEdit'
import downloadTask from '@/components/downloadTask'
import ChooseEmployee from '@/views/departmentManage/chooseEmployee'
import EmployeeDetail from '@/views/departmentManage/employeeDetail'

export default {
  components: {
    EmployeeEdit,
    downloadTask,
    ChooseEmployee,
    EmployeeDetail
  },
  props: {
    nodeId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      selectUserId: null,
      dialogShow: false,
      chooseSearch: {},
      importModel: {
        importApi: ['ouser-web', 'employee', 'asyncImport.do', {}],
        importLabel: this.$t('批量导入'),
        downloadLocalFile: [require('@/excelfile/departmentUserTemplate.xlsx'), '用户导入模板.xlsx'],
        pool: 'ouser',
        taskType: 'employeeImport',
        async: true
      },
      chooseEmployeeDialog: {
        show: false
      },
      editDialog: {},
      search: {
        departmentIds: []
      },
      table: {
        checkedList: [],
        columns: [

          {
            label: this.$t('账号'),
            slot: 'userName',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('姓名'),
            prop: 'identityCardName',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('手机号'),
            prop: 'mobile',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('邮箱'),
            prop: 'email',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('状态'),
            slot: 'isAvailable',
            show: true,
            minWidth: 120
          }
        ],
        operates: {
          width: 150,
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              method: (index, row) => {
                this.handleBaseInfoOpen(row.userId)
              },
              code: 'OuserDepartmentManage208'
            },
            {
              label: this.$t('删除'),
              method: (index, row) => {
                this.deleteEmployee([row.userId])
              },
              code: 'OuserDepartmentManage206'
            }
          ]
        }
      }
    }
  },
  mounted() {
    this.query()
  },
  methods: {
    query() {
      const {
        ...params
      } = this.search

      params.departmentIds = [this.nodeId]
      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    },
    changeEmployeeStatus(row) {
      const self = this
      this.$confirm(this.$t('是否确认变更员工状态') + '?', this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })
        .then(() => {
          self.$ouser.$api.employeeService
            .updateEmployeeStatus({
              isAvailable: row.isAvailable,
              userIds: [row.userId]
            })
            .then(res => {
              this.$message({
                type: 'success',
                message: this.$t('变更成功')
              })
              self.query(this.nodeId)
            })
            .catch(() => {
              row.isAvailable = row.isAvailable === 1 ? 0 : 1
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('已取消')
          })
          row.isAvailable = row.isAvailable === 1 ? 0 : 1
        })
    },
    initEditEmployeeDialog(obj) {
      this.editDialog = {
        show: false,
        userId: -1,
        uploadImg: [],
        add: false,
        title: null
      }
      this.editDialog.show = true
      if (obj.userId) {
        // 编辑
        this.editDialog.userId = obj.userId
        if (obj.headPicUrl) {
          this.editDialog.uploadImg = [
            { url: obj.headPicUrl }
          ]
        }
        this.editDialog.add = false
        this.editDialog.title = this.$t('编辑员工')
      } else {
        // 新增
        this.editDialog.add = true
        this.editDialog.title = this.$t('新增员工')
      }
    },
    editDialogCancel() {
      this.editDialog = {
        show: false,
        obj: {},
        uploadImg: [],
        add: false,
        title: null
      }
      this.query()
    },
    openChooseEmployeeDialog() {
      this.chooseEmployeeDialog.show = true
    },
    onChooseEmployeeDialog(chooseEmployee) {
      const self = this
      const userIds = []
      chooseEmployee.forEach(i => {
        userIds.push(i.userId)
      })
      this.$ouser.$api.departmentService
        .batchAddDepartmentUser({
          departmentId: this.nodeId,
          userIds: userIds
        })
        .then(res => {
          self.closeChooseEmployeeDialog()
          self.query()
        })
    },
    closeChooseEmployeeDialog() {
      this.chooseEmployeeDialog.show = false
    },
    deleteEmployee(userIds) {
      this.$confirm(
        this.$t('此操作将从该组织节点删除员工') +
        ',' +
        this.$t('是否继续') +
        '?',
        this.$t('提示'),
        {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }
      )
        .then(() => {
          this.$ouser.$api.departmentService
            .batchDeleteDepartmentUser({
              departmentId: this.nodeId,
              userIds: userIds
            })
            .then(res => {
              this.$message({
                type: 'success',
                message: this.$t('删除成功')
              })
              this.query()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('已取消删除')
          })
        })
    },
    openConfirmDeleteEmployee() {
      const userIds = []
      this.table.checkedList.forEach(i => {
        userIds.push(i.userId)
      })
      if (userIds.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('请至少选择一个员工')
        })
        return
      }
      this.deleteEmployee(userIds)
    },
    addRole(row) {
      window.document.location.href =
        '#/ouser-web/operaAddRole/' +
        row.userId +
        '/' +
        this.nodeId
    },
    handleBaseInfoOpen(userId) {
      this.selectUserId = userId
      this.dialogShow = true
    },
    handleBaseInfoClose() {
      this.dialogShow = false
      this.selectUserId = null
    },
    saveEmployee() {
      this.$refs.employeeDetail.updateEmployeeOn()
    }
  }
}
</script>

<style scoped>

</style>
