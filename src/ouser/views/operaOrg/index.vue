<template>
  <div>
    <section>
      <el-row>
        <div style="float: left; margin-top: 20px ;">
          <el-row>
            <el-input
              v-model="searchContent"
              :placeholder="$t('请输入内容')"
              name="searchContent"
              suffix-icon="el-icon-search"
              style="width: 300px; height: 30px; margin-right: 10px;"/>
            <el-button icon="el-icon-search" circle="cicle" style="width: 40px; height: 25px;" />
          </el-row>

          <el-button type="primary" size="mini" style="width: 120px; margin: 20px 0;">{{ $t('批量编辑') }}</el-button>

          <div>
            <div style="float: left;">
              <el-tree :data="orgTree" :props="defaultProps" name="orgTree547" style="width: 200px;" @node-click="handleNodeClick"/>
            </div>
            <div style="float: right; margin-right: 10px;">
              <el-dropdown trigger="click" size="medium" @command="handleMoreClick">
                <span class="el-dropdown-link">
                  <i class="el-icon-arrow-down el-icon-more"/>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="1" icon="el-icon-plus">{{ $t('新增同级') }}</el-dropdown-item>
                  <el-dropdown-item command="2" icon="el-icon-circle-plus">{{ $t('新增下一级') }}</el-dropdown-item>
                  <el-dropdown-item command="3" icon="el-icon-circle-plus-outline">{{ $t('删除') }}</el-dropdown-item>
                  <el-dropdown-item command="4" icon="el-icon-check">{{ $t('置顶') }}</el-dropdown-item>
                  <el-dropdown-item command="5" icon="el-icon-circle-check-outline">{{ $t('置底') }}</el-dropdown-item>
                  <el-dropdown-item command="6" icon="el-icon-circle-check-outline">{{ $t('编辑') }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>

        </div>
        <div v-if="editObj.show" style="float: left; width: 60%; height: 500px; border-top: 50px; margin-left: 50px; border: 1px solid gray; background-color: white">
          <div style="height: 30%; border: 1px solid gray;">
            <el-button size="small" style="margin-left: 10px; border: 1px solid gray;">{{ $t('部门详情') }}</el-button>
            <hr size="5">

            <label style="margin-left: 30px;">{{ operaObj }}</label>

          </div>
          <div style="height: 70%;">
            <ody-list-table-area style="height: 100%;">
              <div slot="btn">
                <el-button name="initEditDialog" size="mini" type="primary" @click="initEditDialog({},false)">{{ $t('添加员工') }}</el-button>
                <el-button name="batchUpdateEmployeeStatus" size="mini" type="primary" @click="batchUpdateEmployeeStatus()">{{ $t('批量导入') }}</el-button>
                <el-button name="batchEditDialog" size="mini" type="primary" @click="batchEditDialog()">{{ $t('批量编辑') }}</el-button>
                <el-button name="batchUpdateEmployeeStatus4" size="mini" @click="batchUpdateEmployeeStatus(1)">{{ $t('批量删除') }}</el-button>
              </div>
              <div slot="table">
                <ody-table
                  :data="listTable.list"
                  :columns="listTable.columns"
                  :operates="listTable.operates"
                  :checked.sync="listTable.checkedList"
                  :multiple="true"
                  name="listTable_list772"/>
              </div>
            </ody-list-table-area>
          </div>
        </div>
      </el-row>

      <!--批量编辑-->
      <ody-dialog :visible.sync="batchEdit.show" :title="batchEdit.obj.title" width="700px">

        <!--调整职位-->
        <el-button size = "small" style="display: block; margin: 0 auto; margin-bottom: 10px; width: 70%;" @click="handleEditClick(1) ">{{ $t('调整职位') }}</el-button>
        <div v-if="batchEdit.checkShow" style="width: 100%;">
          <div style="text-align: center;">
            <el-checkbox v-model="checked" name="checked" style="margin-bottom: 10px;">{{ $t('管理员') }}</el-checkbox>
          </div>
        </div>

        <!--调整部门-->
        <el-button size = "small" style="display: block; margin: 0 auto; margin-bottom: 10px; width: 70%;" @click="handleEditClick(2)">{{ $t('调整部门') }}</el-button>
        <div v-if="batchEdit.departmentShow" style="width: 100%;">
          <div style="text-align: center;">
            <!--<el-tree :data="orgTree" :props="defaultProps" name="orgTree819" @node-click="handleDepartmentClick" style="width: 200px;">-->
            <el-tree
              ref="departmentTree"
              :data="departmentTree"
              :default-expanded-keys="[2, 3]"
              :default-checked-keys="[5]"
              :props="defaultProps"
              name="departmentTree854"
              show-checkbox
              node-key="id"
              style="width: 200px;"/>
          </div>
        </div>

        <!--调整岗位-->
        <el-button size = "small" style="display: block; margin: 0 auto; margin-bottom: 10px; width: 70%;" @click="handleEditClick(3)">{{ $t('调整岗位') }}</el-button>

        <div style="width: 100%; text-align: center;">
          <el-button name="saveBatchEdit" type="primary" @click="saveBatchEdit">保 存</el-button>
          <el-button name="batchEdit_show" @click="batchEdit.show = false">取 消</el-button>
        </div>
      </ody-dialog>

      <!--新增同级dialog-->
      <ody-dialog :visible.sync="addThisLevelObj.show" :title="addThisLevelObj.obj.title" width="460px">
        <el-form :model="addThisLevelObj.obj" :disabled="addThisLevelObj.edit === false">
          <el-form-item :label="$t('上级部门')">
            <label>{{ lastLevelName }}</label>
          </el-form-item>
          <el-form-item :label="$t('部门名称')">
            <el-input v-model="addThisLevelObj.obj.orgName" name="addThisLevelObj_obj_orgName" style="width: 300px;"/>
          </el-form-item>

          <div style="width: 100%; text-align: center;">
            <el-button name="saveLevel" type="primary" @click="saveLevel">保 存</el-button>
            <el-button name="addThisLevelObj_show" @click="addThisLevelObj.show = false">取 消</el-button>
          </div>
        </el-form>
      </ody-dialog>

    </section>

  </div>
</template>

<script>
import util from '@/utils/util'

export default {
  data() {
    return {
      checked: true,
      eiditType: 1,
      editObj: { show: true, obj: {}},
      operaObj: 'ssss',
      // 新增编辑弹框对象
      addThisLevelObj: { show: false, obj: {}},
      // 批量编辑对象
      batchEdit: { departmentShow: false, checkShow: false, show: false, obj: {}},
      lastLevelName: '北京',
      // 列表框对象
      listTable: {
        checkedList: [],
        list: [],
        total: 0,
        columns: [
          {
            'show': true,
            'prop': 'userName',
            'label': '用户账号',
            'align': 'center',
            'minWidth': 100,
            render: function(h, params) {
              return (
                <el-button size='mini' on-click={() => {
                  self.initEditDialog(params.row, false)
                }}>{params.row.userName}</el-button>
              )
            }
          },
          {
            'show': true,
            'prop': 'identityCardName',
            'label': '姓名',
            'align': 'center',
            'minWidth': 60
          },
          {
            'show': true,
            'prop': 'mobile',
            'label': '手机号',
            'align': 'center',
            'minWidth': 70
          },
          {
            'show': true,
            'prop': 'orgName',
            'label': '部门',
            'align': 'center',
            'minWidth': 60
          },
          {
            'show': true,
            'prop': 'positionName',
            'label': '岗位',
            'align': 'center',
            'minWidth': 60
          },
          {
            'show': true,
            'prop': 'employeNum',
            'label': '工号',
            'align': 'center',
            'minWidth': 60
          },
          {
            'show': true,
            'prop': 'isAvailableStr',
            'label': '状态',
            'align': 'center',
            'minWidth': 60
          }
        ],
        operates: {
          'width': 200,
          'fixed': 'right',
          'list': [
            {
              'label': '编辑',
              show: true,
              'disabled': false,
              method(index, row) {
                self.initEditDialog(row, true)
              }
            },
            {
              'label': '功能权限',
              show: true,
              'disabled': false,
              method(index, row) {
              }
            },
            {
              'label': '数据权限',
              show: true,
              'disabled': false,
              method(index, row) {
              }
            }
          ]
        }
      },
      departmentTree: [{
        id: 1,
        label: '运营平台',
        children: [{
          id: 4,
          label: '运营一部',
          children: [{
            id: 9,
            label: '运营二部'
          }, {
            id: 10,
            label: '运营三部'
          }]
        }]
      }, {
        id: 2,
        label: '商家平台',
        children: [{
          id: 5,
          label: '销售一部'
        }, {
          id: 6,
          label: '销售二部'
        }, {
          id: 7,
          label: '销售三部'
        }]
      }],
      orgTree: [{
        label: '组织架构',
        children: [{
          label: '华北区',
          children: [{
            label: '北京',
            children: [{
              label: '运营一部'
            }, {
              label: '运营二部'
            }, {
              label: '运营三部'
            }]
          }]
        }]
      }],
      searchContent: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化listtable数据
    // async init() {
    //   const userService = this.$ouser.$api.userService
    //   const self = this
    //   self.eiditType;
    // },
    handleNodeClick(data) {
      const self = this
      console.log('click:' + data)
      if (data.children === null) {
        console.log(data.label)
        self.operaObj = data.label
      }
    },
    handleEditClick(type) {
      console.log('进入编辑类型；')
      const self = this

      if (type === 1) {
        console.log('编辑类型' + 1)
        self.eiditType = 1
        self.batchEdit.checkShow = true
        self.batchEdit.departmentShow = false
      } else if (type === 2) {
        self.batchEdit.checkShow = false
        self.batchEdit.departmentShow = true
        self.eiditType = 2
      }
    },
    // 批量编辑保存
    saveBatchEdit(type) {
      const userService = this.$ouser.$api.userService
      const self = this
      console.log('进入批量编辑保存；批量编辑类型：' + self.eiditType)
      if (self.eiditType === 1) {
        var checkedList = self.listTable.checkedList
        userService.batchEditUser(util.copy(checkedList)).then(res => {
          self.$message({
            message: '修改成功',
            type: 'success'
          })
        })
        self.batchEdit.show = false
      }
    },
    batchEditDialog() {
      const self = this
      self.batchEdit.show = true
    },
    saveLevel() {

    },
    addThisLevelDialog(operType) {
      const self = this
      if (operType === 1) {
        self.addThisLevelObj.show = true
        self.addThisLevelObj.obj.title = '新增部门'
      } else if (operType === 2) {
        self.addThisLevelObj.show = true
        self.addThisLevelObj.obj.title = '编辑部门'
      }
    },
    handleMoreClick(item) {
      const self = this
      // 新增同级
      if (item === 1) {
        self.addThisLevelDialog(1)
      } else if (item === 2) {
        // 新增下一级
        self.addThisLevelDialog(1)
      } else if (item === 3) {
        // 删除
        // deleteThisELe()
      } else if (item === 4) {
        // 置顶
        // makeTop()
      } else if (item === 5) {
        // 置底
        // makeBottom()
      } else if (item === 6) {
        // 编辑
        self.addThisLevelDialog(2)
      } else {
        console.log(item)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }
</style>
