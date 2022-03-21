<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item :label="$t('用户账号')" prop="userName">
              <el-input v-model="searchForm.userName" name="searchForm_userName"/>
            </ody-search-item>
            <ody-search-item :label="$t('姓名')" prop="identityCardName">
              <el-input v-model="searchForm.identityCardName" name="searchForm_identityCardName"/>
            </ody-search-item>
            <ody-search-item :label="$t('工号')" prop="employeNum">
              <el-input v-model="searchForm.employeNum" name="searchForm_employeNum"/>
            </ody-search-item>
            <ody-search-item :label="$t('手机号')" prop="mobile">
              <el-input v-model="searchForm.mobile" name="searchForm_mobile"/>
            </ody-search-item>
            <ody-search-item :label="$t('状态')" prop="isAvailable">
              <el-select v-model="searchForm.isAvailable" :placeholder="$t('全部')" name="searchForm_isAvailable">
                <el-option
                  v-for="item in isAvailable"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('部门')" prop="departmentCode">
              <ody-tree-select v-model="searchForm.departmentCode" :append-to-body="true" :multiple="false" :options="org.tree" name="searchForm_departmentCode"/>
            </ody-search-item>
            <ody-search-item :label="$t('岗位')" prop="positionId">
              <el-select v-model="searchForm.positionId" :placeholder="$t('全部')" name="searchForm_positionId">
                <el-option
                  v-for="item in positions"
                  :key="item.id"
                  :label="item.positionName"
                  :value="item.id"/>
              </el-select>
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="initForm" size="small" @click="initForm">{{ $t('重置') }}</el-button>
          <ody-button name="handleQuery" size="small" type="primary" @click="handleQuery">{{ $t('查询') }}</ody-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="btn-bottom">
          <el-button name="initEditDialog" size="small" type="primary" @click="initEditDialog({},false)">{{ $t('添加') }}</el-button>
          <el-button name="batchUpdateEmployeeStatus" size="small" @click="batchUpdateEmployeeStatus(0)">{{ $t('批量停用') }}</el-button>
          <el-button name="batchUpdateEmployeeStatus9" size="small" @click="batchUpdateEmployeeStatus(1)">{{ $t('批量启用') }}</el-button>
        </div>
        <div slot="table">
          <el-table
            v-loading="loading"
            :data="listTable.list"
            :checked.sync="listTable.checkedList"
            :data-key="listTable.dataKey"
            :multiple="true"
            name="listTable_list420">
            <el-table-column
              :label="$t('姓名')"
              prop="identityCardName"
              align="center">
              <template slot-scope="scope">
                <el-button name="initEditDialog5" size="mini" @click="initEditDialog(scope.row, false)">{{ scope.row.identityCardName }}
                </el-button>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('用户账号')"
              prop="userName"
              align="center"/>

            <el-table-column
              :label="$t('手机')"
              prop="mobile"
              align="center"/>

            <el-table-column
              :label="$t('邮箱')"
              prop="email"
              align="center"/>

            <el-table-column
              :label="$t('操作')"
              align="center">
              <template slot-scope="scope">
                <el-button name="addRole" size="mini" @click="addRole(scope.row)">{{ $t('功能权限') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="searchForm.currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="searchForm.itemsPerPage"
            :total.sync="listTable.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="queryEmployeePageByIdentityType"
            @current-change="queryEmployeePageByIdentityType"/>

        </div>
      </ody-list-table-area>
    </section>
    <employee-edit
      v-if="editObj.show"
      :edit-obj="editObj"
      @close="editDialogCancel"/>
  </div>
</template>

<script>
import EmployeeEdit from '@/components/employeeEdit'
import util from '@/utils/util'
import constants from '@/utils/constants'
export default {
  name: 'OuserOperaEmployeeList',
  components: {
    EmployeeEdit
  },
  data() {
    return {
      loading: false,
      // 列表框对象
      listTable: {
        dataKey: 'userId',
        checkedList: [],
        list: [],
        total: 0
      },
      // 搜索框对象
      searchForm: {},
      // 新增编辑弹框对象
      editObj: { show: false, obj: {}, uploadImg: [] },
      // 部门
      org: {
        // 部门平铺数据列表
        list: [],
        // 部门树结构数据
        tree: []
      },
      // 岗位
      positions: [],
      // 状态列表
      isAvailable: [],
      identityType: { identitySubType: 11, identityType: 1 }
    }
  },
  async mounted() {
    this.loading = true
    await this.init()
    this.loading = false
  },
  methods: {
    async handleQuery() {
      this.searchForm.currentPage = 1
      await this.queryEmployeePageByIdentityType()
    },
    async init() {
      // 常量赋值
      this.isAvailable = constants.isAvailable
      // 初始化搜索框对象
      this.initForm()
      try {
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
    addRole(row) {
      window.document.location.href = '#/ouser-web/operaAddRole/' + row.userId + '/-1'
    },
    // 查询列表
    async queryEmployeePageByIdentityType() {
      const employeeService = this.$ouser.$api.employeeService
      this.loading = true
      const res = await employeeService.queryEmployeeForDepartment(this.searchForm)

      this.listTable.total = res.data.total
      this.listTable.list = res.data.listObj
      this.listTable.list.forEach(one => {
        // 转换状态枚举和状态name
        one.isAvailableStr = util.getOnePropByKeyFromArr(this.isAvailable, one.isAvailable)
      })
      this.loading = false
    },
    initEditDialog(obj) {
      this.initDialog()

      this.editObj.show = true
      if (obj.userId) {
        // 编辑
        this.editObj.obj = util.copy(obj)
        this.editObj.uploadImg = [{ url: this.editObj.obj.headPicUrl }]
        this.editObj.add = false
        this.editObj.title = this.$t('编辑员工')
      } else {
        // 新增
        this.editObj.add = true
        this.editObj.title = this.$t('新增员工')
      }
    },
    initDialog() {
      this.editObj = { show: false, obj: {}, uploadImg: [] }
    },
    batchUpdateEmployeeStatus(status) {
      const userIds = []
      if (this.listTable.checkedList.length === 0) {
        this.$message({
          message: '请至少选择一项',
          type: 'error'
        })
        return
      }
      this.listTable.checkedList.forEach(item => { userIds.push(item.userId) })
      this.updateEmployeeStatus(status, userIds)
    },
    updateEmployeeStatus(status, userIds) {
      const employeeService = this.$ouser.$api.employeeService
      const self = this
      employeeService.updateEmployeeStatus({ identitySubTypes: [11], isAvailable: status, userIds: userIds }).then(() => {
        self.$message({
          message: '信息更新成功',
          type: 'success'
        })
        this.queryEmployeePageByIdentityType()
      })
    },
    editDialogCancel() {
      this.initDialog()
      this.queryEmployeePageByIdentityType()
    }
  }
}
</script>
