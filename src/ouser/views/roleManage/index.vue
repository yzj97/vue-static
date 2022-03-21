<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item :label="$t('所属商家:')" prop="entityId">
              <ody-merchant-select
                v-model="searchForm.entityId"
                :placeholder="$t('全部')"
                name="searchForm_entityId"
                value-key="merchantId"
              />
            </ody-search-item>
            <ody-search-item :label="$t('角色名称:')" prop="name">
              <el-input v-model="searchForm.name" name="searchForm_name" />
            </ody-search-item>
            <ody-search-item :label="$t('所属平台:')" prop="platformId">
              <el-select v-model="searchForm.platformId" :placeholder="$t('全部')" name="searchForm_platformId">
                <el-option
                  v-for="item in platformList"
                  :key="item.platformId"
                  :label="item.platformName"
                  :value="item.platformId"
                />
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('创建时间:')" :space="2" class="register" prop="createTime">
              <ody-date-range-picker
                v-model="createTime"
                :range-separator="$t('至')"
                :start-placeholder="$t('开始日期')"
                :end-placeholder="$t('结束日期')"
                name="createTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimer"
              />
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="initForm" size="small" @click="initForm">{{ $t('重置') }}</el-button>
          <ody-button name="OuserRoleManageQuery_handleQuery" code="OuserRoleManageQuery" size="small" type="primary" @click="handleQuery">{{ $t('查询') }}</ody-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="btn-bottom">
          <ody-button name="OuserRoleManageAdd_addRole" code="OuserRoleManageAdd" size="small" type="primary" @click="addRole()">{{ $t('添加角色') }}</ody-button>
        </div>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="listTable.list"
            :columns="listTable.columns"
            :operates="listTable.operates"
            name="listTable_list568"
          />
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
            @size-change="queryRoleList"
            @current-change="queryRoleList"
          />

        </div>
      </ody-list-table-area>
    </section>
  </div>
</template>

<script>
import util from '@/utils/util'
import Cookies from 'js-cookie'

export default {
  name: 'OuserRoleManage',
  data() {
    const self = this
    return {
      loading: true,
      createTime: [],
      // 列表框对象
      listTable: {
        checkedList: [],
        list: [],
        total: 0,
        columns: [
          {
            show: true,
            prop: 'name',
            label: this.$t('角色名称'),
            align: 'center',
            minWidth: 88
          },
          {
            show: true,
            prop: 'entityName',
            label: this.$t('所属商家'),
            align: 'center',
            minWidth: 88
          },
          {
            show: true,
            prop: 'platformIdStr',
            label: this.$t('所属平台'),
            align: 'center',
            minWidth: 88
          },
          {
            show: true,
            prop: 'desc',
            label: this.$t('角色描述'),
            align: 'center',
            minWidth: 88
          },
          {
            show: true,
            prop: 'createTimeStr',
            label: this.$t('创建时间'),
            align: 'center',
            minWidth: 88
          }
        ],
        operates: {
          align: 'center',
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              show: true,
              disabled: false,
              method(index, row) {
                self.$router.push({ path: '/ouser-web/roleEdit/' + row.id })
              },
              code: 'ui'
            },
            {
              label: this.$t('删除'),
              show: true,
              disabled: false,
              method(index, row) {
                self.deleteRole(row)
              },
              code: 'ui'
            }
          ]
        }
      },
      // 搜索框对象
      searchForm: {},
      platformList: []
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
      await this.queryRoleList()
    },
    async init() {
      const platformService = this.$ouser.$api.platformService
      const self = this
      this.initForm()
      try {
        await platformService.queryPlatformList({}).then(res => {
          if (Cookies.get('platformId') === '1') {
            self.platformList = res.data
          } else if (Cookies.get('platformId') === '2') {
            res.data.forEach(item => {
              if (item.platformId !== 1) {
                self.platformList.push(item)
              }
            })
          } else {
            res.data.forEach(item => {
              if (item.platformId === Number(Cookies.get('platformId'))) {
                self.platformList.push(item)
              }
            })
          }
        })
        await this.queryRoleList()
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
      this.createTime = []
    },
    async queryRoleList() {
      const self = this
      const roleService = this.$ouser.$api.roleService
      if (this.createTime && this.createTime.length > 0) {
        this.searchForm.createTimeBegin = this.createTime[0]
        this.searchForm.createTimeEnd = this.createTime[1]
      } else {
        this.searchForm.createTimeBegin = null
        this.searchForm.createTimeEnd = null
      }
      this.loading = true
      try {
        console.log(JSON.stringify(self.platformList))
        const res = await roleService.queryAllRoleDataPage(this.searchForm)

        self.listTable.list = res.data.listObj
        util.formatDate(self.listTable.list, 'createTime')
        self.listTable.list.forEach(one => {
          one.platformIdStr = util.getOnePropByKeyFromArr(
            self.platformList,
            one.platformId,
            'platformId',
            'platformName'
          )
        })
        self.listTable.total = res.data.total
      } finally {
        this.loading = false
      }
    },
    addRole() {
      this.$router.push({ path: '/ouser-web/roleEdit/0' })
    },
    deleteRole(role) {
      const self = this
      this.$confirm(this.$t('是否确认删除') + '?', this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })
        .then(() => {
          const roleService = this.$ouser.$api.roleService
          roleService.deleteRole({ id: role.id }).then(res => {
            self.$message({
              message: this.$t('删除成功'),
              type: 'success'
            })
            self.queryRoleList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('已取消')
          })
        })
    }
  }
}
</script>
