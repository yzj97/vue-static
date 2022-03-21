<template>
  <section>
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('选择用户') }}</span>
      </div>
      <el-row>
        <el-col :span="6">
          <el-form ref="info" label-width="130px">
            <el-form-item :label="$t('账号')" required>
              <el-input v-model="identityCardName" :disabled="true" :placeholder="$t('请选择')" name="identityCardName"/>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <el-form ref="info" label-width="130px" style="margin-left:15px;">
            <el-button name="showUserDialog" size="small" type="primary" @click="showUserDialog">{{ $t('选择用户') }}</el-button>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <br>
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('选择关联设备') }}</span>
      </div>

      <ody-table
        :loading="loading"
        :data="deviceList"
        :checked.sync="deviceChecked"
        :multiple="true"
        :columns="deviceColumns"
        :can-filter="false"
        name="deviceList199"
        @selection-change="handleSelectionChange"
      />

      <div slot="page">
        <ody-pagination
          :current-page.sync="userPages.currentPage"
          :list="deviceList"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="userPages.itemsPerPage"
          :total.sync="userPages.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="queryUser"
          @current-change="queryUser"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button name="chooseUser" size="small" type="primary" @click="chooseUser">{{ $t('保存') }}</el-button>
        <el-button name="closeChooseUserDialog" size="small" @click="closeChooseUserDialog">{{ $t('取消') }}</el-button>
      </div>
    </el-card>

    <!--选择用户-->
    <ody-dialog
      :visible.sync="userDialog"
      :before-close="closeChooseUserDialog"
      :title="$t('选择用户')"
      width="50%"
      @close="closeChooseUserDialog"
    >
      <el-row>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item :label="$t('手机号')">
            <el-input v-model="searchForm.mobile" :placeholder="$t('请输入手机号')" name="searchForm_mobile" />
          </el-form-item>
          <el-form-item :label="$t('账号')">
            <el-input v-model="searchForm.userName" :placeholder="$t('请输入账号')" name="searchForm_userName" />
          </el-form-item>
        </el-form>
      </el-row>
      <el-row style="text-align: center">
        <el-button name="queryUser" size="small" type="primary" @click="queryUser">{{ $t('查询') }}</el-button>
        <el-button name="resetChoose" size="small" @click="resetChoose">{{ $t('重置') }}</el-button>
      </el-row>
      <ody-list-table-area style="padding:0px;">
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="userList"
            :checked="checked"
            :highlight-current-row="true"
            :columns="userColumns"
            :can-filter="false"
            name="userList480"
            @selection-change="handleSelectionChange"
          />
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="userPages.currentPage"
            :list="userList"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="userPages.itemsPerPage"
            :total.sync="userPages.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="queryUser"
            @current-change="queryUser"
          />
        </div>
      </ody-list-table-area>
      <div slot="footer" class="dialog-footer">
        <el-button name="closeChooseUserDialog6" size="small" @click="closeChooseUserDialog">{{ $t('取消') }}</el-button>
        <el-button :disabled="checked.length === 0" name="chooseUser5" size="small" type="primary" @click="chooseUser">{{ $t('保存') }}</el-button>
      </div>
    </ody-dialog>

    <ody-fixed>
      <el-button name="returnBack" size="small" @click="returnBack">{{ $t('关闭') }}</el-button>
      <el-button :loading="submitLoading" name="submit" size="small" type="primary" @click="submit">{{ $t('common_save') }}</el-button>
    </ody-fixed>

  </section>

</template>

<script>
export default {
  name: 'CrmGuideDeviceRelAdd',
  components: {
  },
  data() {
    // const vue = this
    return {
      submitLoading: false,
      userDialog: false,
      searchForm: getDefaultSearchForm(),
      userId: null,
      identityCardName: null,
      userPages: {
        total: 0,
        currentPage: 1,
        itemsPerPage: 10
      },
      userList: [],
      checked: [],
      deviceList: [],
      deviceChecked: [],
      devicePages: {
        total: 0,
        currentPage: 1,
        itemsPerPage: 10
      },
      userColumns: [
        {
          show: true,
          prop: 'identityCardName',
          label: this.$t('姓名'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'userName',
          label: this.$t('账号'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'mobile',
          label: this.$t('手机号'),
          align: 'center',
          minWidth: 80
        }
      ],
      deviceColumns: [
        {
          show: true,
          prop: 'alias',
          label: this.$t('微信号'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'deviceNo',
          label: this.$t('设备编号'),
          align: 'center',
          minWidth: 80
        }
      ]
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
    init() {
    },
    showUserDialog() {
      this.searchForm = getDefaultSearchForm()
      this.checked = []
      this.userDialog = true
      this.userPages.currentPage = 1
      this.userPages.itemsPerPage = 10
      this.queryUser()
    },
    closeChooseUserDialog() {
      this.userDialog = false
    },
    openChooseEmployeeDialog() {
      this.userDialog = true
      this.queryUserForDepartment()
    },
    queryUser() {
      const self = this
      this.searchForm.currentPage = this.userPages.currentPage
      this.searchForm.itemsPerPage = this.userPages.itemsPerPage
      // 不排除当前用户
      this.searchForm.excludeUser = false
      this.$crm.$api.guideDeviceRel
        .queryEmployeeForDepartment(
          this.searchForm
        )
        .then(res => {
          self.userPages.total = res.data.total
          self.userList = res.data.listObj
        })
    },
    resetChoose() {
      this.searchForm = getDefaultSearchForm()
    },
    handleSelectionChange(val) {
      this.checked = [val]
    },
    chooseUser() {
      this.identityCardName = this.checked[0].userName
      this.userId = this.checked[0].userId
      this.userDialog = false
      this.selectBindDevice(this.checked[0])
    },
    selectBindDevice(user) { // 查询可绑定的设备
      const self = this
      this.$crm.$api.guideDeviceRel
        .listNoBindDevice(
          {
            page: self.devicePages.currentPage,
            limit: self.devicePages.itemsPerPage,
            filters: {
              userId: user.userId
            }
          }
        )
        .then(res => {
          self.devicePages.total = res.total
          self.deviceList = res.data
        })
    },
    returnBack() {
      this.$portal.delActiveViewAndRefresh()
    },
    submit() {
      const self = this
      self.submitLoading = true
      if (!self.deviceChecked || self.deviceChecked.length === 0) {
        self.$message({
          message: self.$t('请选择数据'),
          type: 'warning'
        })
        self.submitLoading = false
        return
      }

      var ids = self.deviceChecked.map(item => item.id)
      this.$crm.$api.guideDeviceRel
        .add(
          {
            userId: self.userId,
            deviceIds: ids
          }
        )
        .then(res => {
          self.$message({
            message: self.$t('添加成功'),
            type: 'success'
          })
          self.submitLoading = false
          self.returnBack()
        })
    }
  }
}
function getDefaultSearchForm() {
  return Object.assign(
    {
      currentPage: 1,
      itemsPerPage: 10
    }
  )
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

th:nth-child(2) div:before {
  content: '*';
  color: #ff1818;
}

th:nth-child(3) div:before {
  content: '*';
  color: #ff1818;
}

th:nth-child(4) div:before {
  content: '*';
  color: #ff1818;
}

th:nth-child(6) div:before {
  content: '*';
  color: #ff1818;
}
</style>
