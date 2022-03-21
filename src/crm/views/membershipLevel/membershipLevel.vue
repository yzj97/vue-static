<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <!-- 等级编号 -->
          <ody-search-item :label="$t('等级编号:')" prop="filters.id">
            <el-input
              v-model="searchForm.filters.id"
              :placeholder="$t('请输入等级编号')"
              name="searchForm_filters_id"
            />
          </ody-search-item>
          <!-- 等级名称 -->
          <ody-search-item :label="$t('等级名称:')" prop="filters.levelName">
            <el-input
              v-model="searchForm.filters.levelName"
              :placeholder="$t('请输入等级名称')"
              name="searchForm_filters_levelName"
            />
          </ody-search-item>
          <!-- 等级排序 -->
          <ody-search-item :label="$t('等级排序:')" prop="filters.sort">
            <el-select
              v-model="searchForm.filters.sort"
              :placeholder="$t('请选择')"
              name="searchForm_filters_sort"
            >
              <el-option
                v-for="item in levelOption"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </ody-search-item>
          <!-- 编辑人 -->
          <ody-search-item :label="$t('编辑人:')" prop="filters.createUsername">
            <el-input
              v-model="searchForm.filters.createUsername"
              :placeholder="$t('请输入编辑人')"
              name="searchForm_filters_createUsername"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button
          name="handleSearchReset"
          size="small"
          @click="handleSearchReset"
        >{{ $t("common_reset") }}</el-button
        >
        <ody-button
          name="CrmMembershipLevelList_handlePageCurrentChange"
          code="CrmMembershipLevelList"
          size="small"
          type="primary"
          @click="handlePageCurrentChange"
        >{{ $t("common_select") }}</ody-button
        >
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <!--新增-->
        <el-button
          name="CrmMembershipLevelAdd_add"
          code="CrmMembershipLevelAdd"
          size="small"
          type="primary"
          @click="add"
        >{{ $t("newly_added") }}</el-button
        >
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :can-filter="false"
          :operates="operates"
          name="list874"
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
  </section>
</template>

<script>
export default {
  name: 'CrmMembershipLevel',
  list: [],
  components: {},
  data() {
    // const vue = this
    return {
      searchForm: getDefaultSearchForm(),
      levelOption: [
        { code: 1, name: this.$t('创建时间新至旧排序') },
        { code: 2, name: this.$t('成长值递增排序') }
      ],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'id',
          label: this.$t('等级编号'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'levelName',
          label: this.$t('等级名称'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'memberTypeStr',
          label: this.$t('会员类型'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'growthValue',
          label: this.$t('所需成长值'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'createTime',
          label: this.$t('编辑时间'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            if (row.updateTime) {
              return this.$portal.parseTime(
                row.updateTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            } else {
              return this.$portal.parseTime(
                row.createTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
          }
        },
        {
          show: true,
          prop: 'createUsername',
          label: this.$t('编辑人'),
          align: 'center',
          minWidth: 124,
          formatter: (row, column, cellValue) => {
            if (row.updateUsername) {
              return row.updateUsername
            } else {
              return row.createUsername
            }
          }
        }
      ],
      operates: {
        fixed: 'right',
        minWidth: 200,
        align: 'center',
        list: [
          {
            label: this.$t('设置'),
            code: 'CrmMembershipLevelSet',
            method: (index, row) => {
              this.$router.push({
                name: 'CrmMembershipLevelDetail',
                params: {
                  id: row.id,
                  isEdit: 1
                }
              })
            }
          },
          {
            label: this.$t('查看'),
            code: 'CrmMembershipLevelGet',
            method: (index, row) => {
              this.$router.push({
                name: 'CrmMembershipLevelDetail',
                params: {
                  id: row.id,
                  isEdit: 0
                }
              })
            }
          },
          {
            label: this.$t('删除'),
            code: 'CrmMembershipLevelDelete',
            method: (index, row) => {
              this.$confirm('确认删除吗？', this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
                cancelButtonText: this.$t('取消'),
                type: 'warning'
              }).then(() => {
                this.deleted(row)
              })
            },
            hidden: (index, row) => {
              if (row.isDefault && row.isDefault === 1) {
                return true
              } else {
                return false
              }
            }
          }
        ]
      }
    }
  },
  async mounted() {
    try {
      this.$on('editMemberLevel', this.updateList)
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    add() {
      this.$router.push({
        name: 'CrmMembershipLevelDetail',
        params: {
          id: 0,
          isEdit: -1
        }
      })
    },
    async deleted(row) {
      await delObj(this, row.id)
      await this.updateList()
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
      this.handleSearchSubmit()
    },
    handlePageSizeChange() {
      this.handleSearchSubmit()
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
        this.$forceUpdate()
      } catch (ex) {
        console.log(ex)
      }
    },
    async updateList() {
      try {
        await loadList(this)
        this.$forceUpdate()
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    init() {
      this.updateList()
    }
  }
}
function getDefaultSearchForm() {
  return Object.assign({
    page: 1,
    limit: 10,
    filters: { sort: 1 }
  })
}

async function loadList(vue) {
  const rightsInterests = vue.$crm.$api.ucMembershipLevel
  vue.searchForm.page = vue.page.current
  vue.searchForm.limit = vue.page.size
  if (vue.searchForm.filters.sort === '') {
    vue.searchForm.filters.sort = null
  }
  const res = await rightsInterests.getUcMembershipLevelList(vue.searchForm)
  if (res) {
    vue.list = res.data || []
    for (let i = 0; i < vue.list.length; i++) {
      if (vue.list[i].memberType === 1) {
        vue.list[i].memberTypeStr = '普通会员'
      }
    }
    vue.page.total = res.total || 0
  } else {
    vue.list = []
    vue.page.total = 0
  }
}

async function delObj(vue, id) {
  const rightsInterests = vue.$crm.$api.ucMembershipLevel
  const res = await rightsInterests.deleteUcMembershipLevel({ id: id })
  if (res) {
    if (res.code === '0') {
      vue.$message({
        type: 'success',
        message: vue.$t('删除成功')
      })
    } else {
      vue.$message({
        type: 'info',
        message: vue.$t('删除失败')
      })
    }
    return
  }
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
</style>
