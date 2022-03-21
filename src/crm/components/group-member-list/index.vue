<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('member_cell_phone_number')" prop="filters.mobile">
            <el-input v-model="searchForm.filters.mobile" name="searchForm_filters_mobile" />
          </ody-search-item>
          <ody-search-item :label="$t('member_nickname')" prop="filters.nickname">
            <el-input v-model="searchForm.filters.nickname" name="searchForm_filters_nickname" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button name="staticUserGroupListPage_handlePageCurrentChange" code="staticUserGroupListPage" size="small" type="primary" @click="handlePageCurrentChange">{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button :disabled="checkedList.length === 0 || + groupType === 0" name="staticUserGroupDelete_batchDelete" code="staticUserGroupDelete" size="small" type="primary" @click="batchDelete">{{ $t('删除') }}</ody-button>
        <ody-button :disabled="+ groupType === 1" name="userGroupUpdate_handleOpenEditGroup" code="userGroupUpdate" size="small" @click="handleOpenEditGroup">{{ $t('编辑分组') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :checked.sync="checkedList"
          :operates="operates"
          :multiple="true"
          name="list310"
        />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
        />

      </div>
    </ody-list-table-area>
    <crm-group-edit-modal
      :visible.sync="modal.group.visible"
      :status-type="modal.group.statusType"
      :id="userGroupId"
      @ok="handleModalOk"
    />
  </section>
</template>

<script>
import CrmGroupEditModal from '@/components/group-edit-modal'

export default {
  components: {
    CrmGroupEditModal
  },
  props: {
    userGroupId: {
      type: Number,
      default: null
    },
    groupType: {
      type: Number,
      default: null
    },
    conditionValue: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      searchForm: getDefaultSearchForm(),
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      checkedList: [],
      columns: [
        {
          show: true,
          prop: 'mobile',
          label: this.$t('membership_account'),
          align: 'center',
          minWidth: 120/*,
          render: (h, params) => {
            const todetail = self.todetail
            return (
              <el-link underline='true' type='primary' on-click={(e) => todetail(params.row.userId)}>{params.row.mobile}</el-link>
            )
          }*/
        },
        {
          show: true,
          prop: 'nickname',
          label: this.$t('member_nickname'),
          align: 'center',
          minWidth: 140
        },
        {
          show: true,
          prop: 'mobile',
          label: this.$t('cell_phone_number'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'typeName',
          label: this.$t('member_type'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'levelName',
          label: this.$t('membership_grade'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          label: this.$t('sales_assistant'),
          align: 'center',
          minWidth: 140,
          tooltip: false,
          render: (h, params) => {
            if (params.row.guideIdentityCardName) {
              var self = this
              return (
                <span>
                  <sapn>{params.row.guideIdentityCardName}</sapn>
                  <el-tooltip effect='dark' placement='top'>
                    <div slot='content'>
                      <div>
                        <span>{self.$t('guide')}：</span>
                        <span>{params.row.guideIdentityCardName}</span>
                        <br />
                        <span>{self.$t('guide')}ID：</span>
                        <span>{params.row.uEmployeeId}</span>
                        <br />
                      </div>
                    </div>
                    <i class='el-icon-user'></i>
                  </el-tooltip>
                </span>
              )
            } else {
              return (
                <span>--</span>
              )
            }
          }
        },
        {
          show: true,
          prop: 'registrationDateTime',
          label: this.$t('registration_time'),
          align: 'center',
          minWidth: 160
        }
      ],
      modal: {
        group: {
          visible: false,
          statusType: 'edit'
        }
      }
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
    handleOpenEditGroup() {
      this.modal.group.visible = true
    },
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
      this.searchForm.filters.userGroupId = this.userGroupId
      this.handleSearchSubmit()
    },
    handlePageSizeChange() {
      this.handleSearchSubmit()
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async updateList() {
      try {
        this.loading = true
        await loadList(this)
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    todetail(userId) {
      this.$router.push({
        name: 'OuserCenterMemberDetail',
        query: {
          userId: userId,
          showOrEdit: false
        }
      })
    },
    batchDelete() {
      this.$confirm(this.$t('确认删除吗'), this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        const ids = []
        if (this.checkedList.length === 0) {
          this.$message({
            message: this.$t('please_choose_at_least_one_item'),
            type: 'error'
          })
          return
        }
        this.checkedList.forEach(item => { ids.push(item.id) })
        const staticUserGroup = this.$crm.$api.staticUserGroup
        staticUserGroup.delete({ 'ids': ids, 'userGroupId': this.searchForm.filters.userGroupId }).then((res) => {
          this.$message({
            message: this.$t('common.deleteSuccess'),
            type: 'success'
          })
          this.checkedList = []
          this.handleSearchSubmit()
        })
      })
    },
    init() {
      this.searchForm.filters.userGroupId = this.userGroupId
      this.updateList()
    }
  }
}
function getDefaultSearchForm() {
  return Object.assign(
    {
      page: 1,
      limit: 10,
      filters: {
      }
    }
  )
}

async function loadList(vue) {
  const staticUserGroup = vue.$crm.$api.staticUserGroup
  vue.searchForm.page = vue.page.current
  vue.searchForm.limit = vue.page.size
  const res = await staticUserGroup.listPage(vue.searchForm)
  if (res) {
    const data = res.data
    if (data !== null && data.length > 0) {
      var userIds = []
      data.forEach(item => {
        userIds.push(item.userId)
      })
      const guideRes = await staticUserGroup.queryUserGuideInfoList({ userIds: userIds })
      if (guideRes.data.length > 0) {
        guideRes.data.forEach(guidItem => {
          data.forEach(item => {
            if (guidItem.userId === item.userId) {
              item.uEmployeeId = guidItem.uEmployeeId
              item.guideIdentityCardName = guidItem.guideIdentityCardName
            }
          })
        })
      }
    }
    vue.list = data
    vue.page.total = res.total
  }
}
</script>
