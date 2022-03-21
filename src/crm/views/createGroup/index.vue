<template>
  <section>
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('新建群组') }}</span>
      </div>
      <el-form ref="info" :model="info" label-width="130px">
        <!--<el-row>
          <el-col :span="12">
            <el-form-item :label="$t('头像')">
              <el-image
                :src="userAvatar"
                style="width: 60px; height: 60px; border-radius:100px"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('当前用户')" >
              <i class="el-icon-user"> {{ identityCardName }}</i>
            </el-form-item>
          </el-col>
        </el-row>
        -->
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('微信号')" required>
              <el-select v-model="addForm.ownerInfoId" :placeholder="$t('请选择')" name="addForm_ownerInfoId" style="width:300px" @change="changeAlias">
                <el-option
                  v-for="item in wechatNoList"
                  :key="item.id"
                  :label="item.alias"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('群组名称')" required>
              <el-input v-model="addForm.nickname" name="addForm_nickname" type="text" style="width:400px" maxlength="50" show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('群公告')">
              <el-input v-model="addForm.groupNotice" name="addForm_groupNotice" type="textarea" style="width:400px" maxlength="200" show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="">
              <el-tag type="info" class="el-icon-message-solid"> {{ $t('新增公告贴士') }}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('群成员')" required>
              <el-button name="showUserDialog" size="small" type="primary" @click="showUserDialog">{{ $t('选择成员') }}</el-button>
              <el-tag type="info" class="el-icon-user-solid" style="margin-left:10px">    {{ $t('已选择') }} {{ chooseNum }} {{ $t('人') }}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('备注')">
              <el-input v-model="addForm.remark" name="addForm_remark" type="textarea" style="width:400px" maxlength="100" show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="">
              <el-tag type="info" class="el-icon-message-solid"> {{ $t('新增群贴士') }}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!--选择用户-->
    <ody-dialog
      :visible.sync="userDialog"
      :title="$t('选择用户')"
      width="50%"
      @close="closeChooseUserDialog"
    >
      <el-row>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item :label="$t('好友姓名')">
            <el-input v-model="searchForm.filters.nickname" :placeholder="$t('请输入好友姓名')" name="searchForm_filters_nickname"/>
          </el-form-item>
          <el-form-item :label="$t('微信号')">
            <el-input v-model="searchForm.filters.alias" :placeholder="$t('请输入微信号')" name="searchForm_filters_alias"/>
          </el-form-item>
          <el-form-item :label="$t('性别')">
            <el-select v-model="searchForm.filters.gender" :placeholder="$t('全部')" name="searchForm_filters_gender">
              <el-option :label="$t('全部')" value=""/>
              <el-option :label="$t('未知')" value="0"/>
              <el-option :label="$t('男')" value="1"/>
              <el-option :label="$t('女')" value="2"/>
            </el-select>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row style="text-align: center">
        <el-button name="resetChoose" size="small" @click="resetChoose">{{ $t('重置') }}</el-button>
        <el-button name="queryUser" size="small" type="primary" @click="queryUser">{{ $t('查询') }}</el-button>
      </el-row>
      <ody-list-table-area style="padding:0px;">
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="userList"
            :checked.sync="userChecked"
            :multiple="true"
            :columns="userColumns"
            :can-filter="false"
            name="userList220"
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
        <el-button name="closeChooseUserDialog" size="small" @click="closeChooseUserDialog">{{ $t('取消') }}</el-button>
        <el-button name="chooseUser" size="small" type="primary" @click="chooseUser">{{ $t('保存') }}</el-button>
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
  name: 'CrmCreateGroup',
  components: {
  },
  data() {
    // const vue = this
    return {
      loading: false,
      userAvatar: null,
      identityCardName: null,
      userId: null,
      chooseNum: 0,
      submitLoading: false,
      userDialog: false,
      searchForm: getDefaultSearchForm(),
      addForm: {},
      userPages: {
        total: 0,
        currentPage: 1,
        itemsPerPage: 10
      },
      wechatNoList: [],
      userList: [],
      userChecked: [],
      userColumns: [
        {
          show: true,
          prop: 'avatar',
          label: this.$t('头像'),
          align: 'center',
          minWidth: 80,
          render: (h, params) => {
            return (
              <el-image
                style='width: 50px; height: 50px; border-radius:100px'
                src={params.row.avatar}/>
            )
          }
        },
        {
          show: true,
          prop: 'nickname',
          label: this.$t('好友姓名'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'alias',
          label: this.$t('微信号'),
          align: 'center',
          minWidth: 80,
          formatter: (row, column, cellValue) => {
            if (row.alias) {
              return row.alias
            }
            return '-'
          }
        },
        {
          show: true,
          prop: 'gender',
          label: this.$t('性别'),
          align: 'center',
          minWidth: 80,
          formatter: (row, column, cellValue) => {
            if (row.gender === 2) {
              return this.$t('女')
            } else if (row.gender === 1) {
              return this.$t('男')
            } else if (row.gender === 0) {
              return this.$t('未知')
            }
            return '-'
          }
        }/**
        {
          show: true,
          prop: 'mobile',
          label: this.$t('手机号'),
          align: 'center',
          minWidth: 80
        }**/
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
      this.userId = this.$route.params.userId
      var self = this
      if (!this.userId) {
        // 没有的话调接口拿
        this.$crm.$api.common
          .getUserId()
          .then(res => {
            self.userId = res.data
            getThisUserInfo(self)
            loadList(self)
          })
      } else {
        getThisUserInfo(this)
        loadList(this)
      }

      // if (!this.userId) {
      //   this.$message({
      //     message: self.$t('页面已失效'),
      //     type: 'warning'
      //   })
      // }
    },
    showUserDialog() {
      if (!this.addForm.ownerInfo) {
        this.$message({
          message: this.$t('请选择微信号'),
          type: 'warning'
        })
        return
      }

      this.searchForm = getDefaultSearchForm()
      // this.userChecked = []
      this.userPages.currentPage = 1
      this.userPages.itemsPerPage = 10
      this.queryUser()
      this.userDialog = true
    },
    closeChooseUserDialog() {
      this.userDialog = false
      var leftIds = []
      var rightIds = []
      // 该操作实现确认的话更新选择的项目，不确认的话即使勾选了多选框也会还原到上一次保存的数量,并支持分页多选
      if (this.userChecked.length !== this.addForm.members.length) {
        var newArr = []
        this.userChecked = newArr.concat(this.addForm.members)
      } else {
        for (var v1 = 0; v1 < this.userChecked.length; v1++) {
          var vout = this.userChecked[v1]
          leftIds.push(vout.id)
        }
        for (var v2 = 0; v2 < this.addForm.members.length; v2++) {
          var vinner = this.addForm.members[v2]
          rightIds.push(vinner.id)
        }
        // 交集
        var intersection = leftIds.filter(v => rightIds.includes(v))
        if (intersection.length !== leftIds.length) {
          // 交集和原本的数据长度不相等，元数据改变了
          var newArr2 = []
          this.userChecked = newArr2.concat(this.addForm.members)
        }
      }
    },
    openChooseEmployeeDialog() {
      this.userDialog = true
      this.queryUserForDepartment()
    },
    queryUser() {
      const self = this
      this.loading = true
      this.searchForm.page = this.userPages.currentPage
      this.searchForm.limit = this.userPages.itemsPerPage
      this.searchForm.filters.ownerAlias = this.addForm.ownerInfo.alias
      this.$crm.$api.wechatMember
        .listPage(
          this.searchForm
        )
        .then(res => {
          self.userPages.total = res.total
          self.userList = res.data
          self.loading = false
        })
    },
    resetChoose() {
      this.searchForm = getDefaultSearchForm()
    },
    changeAlias() {
      this.addForm.members = []
      this.addForm.ownerInfo = null
      this.userChecked = []
      this.chooseNum = 0
      for (var i = 0; i < this.wechatNoList.length; i++) {
        if (this.wechatNoList[i].id === this.addForm.ownerInfoId) {
          this.addForm.ownerInfo = this.wechatNoList[i]
          break
        }
      }
    },
    chooseUser() {
      if (this.userChecked.length < 2) {
        this.$message({
          message: this.$t('至少选择两名群成员'),
          type: 'warning'
        })
        return
      }

      this.userDialog = false
      var newArr = []
      this.addForm.members = newArr.concat(this.userChecked)
      this.chooseNum = this.addForm.members.length
    },
    returnBack() {
      this.$portal.delActiveViewAndRefresh()
    },
    submit() {
      const self = this
      self.submitLoading = true

      if (!this.addForm.ownerInfo) {
        self.$message({
          message: self.$t('请选择微信号'),
          type: 'warning'
        })
        self.submitLoading = false
        return
      }

      if (!this.addForm.nickname || this.addForm.nickname === '') {
        self.$message({
          message: self.$t('请填写群名称'),
          type: 'warning'
        })
        self.submitLoading = false
        return
      }

      if (!this.addForm.members || this.addForm.members.length === 0) {
        self.$message({
          message: self.$t('请选择群成员'),
          type: 'warning'
        })
        self.submitLoading = false
        return
      }
      // console.log(this.addForm)
      this.$crm.$api.wechatGroup
        .add(
          this.addForm
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

async function loadList(vue) {
  const guideDeviceRel = vue.$crm.$api.guideDeviceRel
  vue.searchForm.page = 1
  vue.searchForm.limit = 99999
  vue.searchForm.userId = vue.userId

  const res = await guideDeviceRel.listPage(vue.searchForm)
  if (res) {
    const data = res.data
    vue.wechatNoList = data
  }
}

async function getThisUserInfo(vue) {
  const guideDeviceRel = vue.$crm.$api.guideDeviceRel

  const res = await guideDeviceRel.queryEmployeeForDepartment({
    currentPage: 1,
    itemsPerPage: 10,
    userIds: [vue.userId]
  })
  if (res) {
    const data = res.data.listObj
    if (data && data.length > 0) {
      vue.userAvatar = data[0].headPicUrl
      vue.identityCardName = data[0].identityCardName
    }
  }
}

function getDefaultSearchForm() {
  return Object.assign(
    {
      page: 1,
      limit: 10,
      filters: {
        ownerAlias: null
      }
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
