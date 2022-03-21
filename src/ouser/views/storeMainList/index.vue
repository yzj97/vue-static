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
            <ody-search-item :label="$t('岗位')" prop="positionId">
              <el-select v-model="searchForm.positionId" :placeholder="$t('全部')" name="searchForm_positionId">
                <el-option
                  v-for="item in positions"
                  :key="item.id"
                  :label="item.positionName"
                  :value="item.id"/>
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('所属店铺')" prop="entityId">
              <el-select v-model="searchForm.entityId" :placeholder="$t('全部')" name="searchForm_entityId">
                <el-option
                  v-for="item in storeList"
                  :key="item.storeId"
                  :label="item.storeName"
                  :value="item.storeId"/>
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
        <div slot="btn">
          <el-button name="initEditDialog" size="small" type="primary" @click="initEditDialog({},false)">{{ $t('添加') }}</el-button>
          <el-button name="batchUpdateEmployeeStatus" size="small" @click="batchUpdateEmployeeStatus(0)">{{ $t('批量停用') }}</el-button>
          <el-button name="batchUpdateEmployeeStatus0" size="small" @click="batchUpdateEmployeeStatus(1)">{{ $t('批量启用') }}</el-button>
        </div>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="listTable.list"
            :columns="listTable.columns"
            :operates="listTable.operates"
            :checked.sync="listTable.checkedList"
            :data-key="listTable.dataKey"
            :multiple="true"
            name="listTable_list781"/>
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
            @size-change="queryEmployeePageByIdentityType"
            @current-change="queryEmployeePageByIdentityType"/>

        </div>
      </ody-list-table-area>
    </section>
    <employee-edit
      :edit-obj="editObj"
      :positions="positions"
      :identity-type="identityType"
      @close="editDialogCancel">
      <el-form-item :label="$t('所属店铺')" prop="entityId">
        <el-select v-model="editObj.obj.entityId" :disabled="editObj.obj.userId" :placeholder="$t('全部')" name="editObj_obj_entityId">
          <el-option
            v-for="item in storeList"
            :key="item.storeId"
            :label="item.storeName"
            :value="item.storeId"/>
        </el-select>
      </el-form-item>
    </employee-edit>
  </div>
</template>

<script>
import util from '@/utils/util'
import constants from '@/utils/constants'
import EmployeeEdit from '@/components/employeeEdit'
export default {
  name: 'OuserStoreMainList',
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
        total: 0,
        columns: [
          {
            'show': true,
            'prop': 'userName',
            'label': '用户账号',
            'align': 'center',
            'minWidth': 200,
            render: function(h, params) {
              return (
                <el-button size='mini' on-click={() => {
                  this.initEditDialog(params.row, false)
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
            'prop': 'entityStr',
            'label': '所属店铺',
            'align': 'center',
            'minWidth': 120
          },
          {
            'show': true,
            'prop': 'mobile',
            'label': '手机号',
            'align': 'center',
            'minWidth': 180
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
          'width': 180,
          'fixed': 'right',
          'list': [
            {
              'label': '编辑',
              show: true,
              'disabled': false,
              method: (index, row) => {
                this.initEditDialog(row, true)
              }
            },
            {
              'label': '功能权限',
              show: true,
              'disabled': false,
              method: (index, row) => {
                window.document.location.href = '#/ouser-web/operaAddRole/' + row.userId + '/21'
              }
            }
          ]
        }
      },
      // 搜索框对象
      searchForm: {},
      // 新增编辑弹框对象
      editObj: { show: false, obj: {}, uploadImg: [] },
      // 岗位
      positions: [],
      // 状态列表
      isAvailable: [],
      // 商家列表
      merchantInfo: {},
      storeList: [],
      identityType: { identitySubType: 30, identityType: 3 }
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
      const merchantService = this.$ouser.$api.merchantService
      const userService = this.$ouser.$api.userService
      const StoreorgpageinfoService = this.$ouser.$api.StoreorgpageinfoService
      const self = this
      // 常量赋值
      this.isAvailable = constants.isAvailable
      this.sex = constants.sex
      this.datePickerOptions = constants.datePickerOptions
      // 初始化搜索框对象
      this.initForm()
      try {
        await merchantService.getOperaMerchant({}).then(res => {
          self.merchantInfo = res.data
        })
        await StoreorgpageinfoService.queryPlatformAuthStorePage({ merchantIds: [this.merchantInfo.merchantId] }).then(res => {
          self.storeList = res.data.listObj
        })
        // 查询岗位列表
        await userService.queryPositionList({ 'entityType': 2, 'currentPage': 1, 'itemsPerPage': 500, 'entityIds': [this.merchantInfo.merchantId] }).then((res) => {
          self.positions = res.data
        })
        // 查询员工列表
        await this.queryEmployeePageByIdentityType()
      } catch (e) {
        console.log(e)
      }
    },
    // 初始化搜索对象
    initForm() {
      this.searchForm = {
        identitySubType: 30,
        currentPage: 1,
        itemsPerPage: 10
      }
    },
    // 查询列表
    async queryEmployeePageByIdentityType() {
      const employeeService = this.$ouser.$api.employeeService
      const self = this
      // 转换部门id和orgId
      this.loading = true
      const res = await employeeService.queryEmployeePageByIdentityType(this.searchForm)

      self.listTable.total = res.data.total
      self.listTable.list = res.data.listObj
      self.listTable.list.forEach(one => {
        one.positionId = one.positions && one.positions[0] || ''
        // 转换岗位id和岗位name
        one.positionName = util.getOnePropByKeyFromArr(self.positions, one.positionId, 'id', 'positionName')
        // 转换状态枚举和状态name
        one.isAvailableStr = util.getOnePropByKeyFromArr(self.isAvailable, one.isAvailable)
        // 店铺名称
        one.entityStr = util.getOnePropByKeyFromArr(self.storeList, one.entityId, 'storeId', 'storeName')
      })

      this.loading = false
    },
    initEditDialog(obj, edit) {
      this.initDialog()
      this.editObj.show = true
      if (obj.userId) {
        // 编辑
        this.editObj.obj = util.copy(obj)
        this.editObj.uploadImg = [{ url: this.editObj.obj.headPicUrl }]
        this.editObj.add = false
        this.editObj.edit = edit
        this.editObj.title = edit ? '编辑员工' : '查看员工'
      } else {
        // 新增
        this.editObj.add = true
        this.editObj.title = '新增员工'
      }
    },
    editDialogCancel() {
      this.initDialog()
      this.queryEmployeePageByIdentityType()
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
      employeeService.updateEmployeeStatus({ identitySubTypes: [30], isAvailable: status, userIds: userIds }).then(() => {
        self.$message({
          message: '信息更新成功',
          type: 'success'
        })
        this.queryEmployeePageByIdentityType()
      })
    }
  }
}
</script>
