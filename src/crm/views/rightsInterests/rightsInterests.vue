<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <!-- 编号 -->
          <ody-search-item :label="$t('权益组编号:')" prop="filters.id">
            <el-input v-model="searchForm.filters.id" :placeholder="$t('请输入权益组编号')" name="searchForm_filters_id"/>
          </ody-search-item>
          <!-- 权益组名称 -->
          <ody-search-item :label="$t('权益组名称:')" prop="filters.name">
            <el-input v-model="searchForm.filters.name" :placeholder="$t('请输入权益组名称')" name="searchForm_filters_name"/>
          </ody-search-item>
          <!-- 编辑人 -->
          <ody-search-item :label="$t('编辑人:')" prop="filters.createUsername">
            <el-input v-model="searchForm.filters.createUsername" :placeholder="$t('请输入编辑人')" name="searchForm_filters_createUsername"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button name="CrmRightsInterestsList_handlePageCurrentChange" code="CrmRightsInterestsList" size="small" type="primary" @click="handlePageCurrentChange">{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <!--新增-->
        <el-button name="CrmRightsInterestsAdd_add" code="CrmRightsInterestsAdd" size="small" type="primary" @click="add">{{ $t('newly_added') }}</el-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :can-filter="false"
          :operates="operates"
          name="list756"
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

    <!--关联对象弹框-->
    <ody-dialog :visible.sync="dialogTableVisible" :title="$t('关联对象')" width="600px">
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="info" :model="info" label-width="300px" style="width:350px;">
            <ody-search-item :label="$t('对象类型')" style="width:300px;" prop="filters.entityType">
              <el-select v-model="searchRelForm.filters.entityType" :placeholder="$t('全部')" name="searchRelForm_filters_entityType" style="width:150px;">
                <el-option
                  v-for="item in options"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"/>
              </el-select>
            </ody-search-item>
          </el-form>
          <el-form ref="info" :model="info" label-width="130px" style="width:400px;">
            <ody-search-item :label="$t('number')" style="width:400px;" prop="filters.entityId">
              <el-input v-model="searchRelForm.filters.entityId" :placeholder="$t('请输入编号')" name="searchRelForm_filters_entityId" style="width:250px;"/>
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="handleRelSearchReset" size="small" @click="handleRelSearchReset">{{ $t('common_reset') }}</el-button>
          <ody-button name="CrmRightsInterestsObjList_handleRelSearchSubmit" code="CrmRightsInterestsObjList" size="small" type="primary" @click="handleRelSearchSubmit">{{ $t('common_select') }}</ody-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="relList"
            :columns="relationColumns"
            :can-filter="false"
            name="relList501"
          />
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="relPage.current"
            :list="relList"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="relPage.size"
            :total.sync="relPage.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleRelSearchSubmit"
            @current-change="handleRelPageCurrentChange"
          />

        </div>
      </ody-list-table-area>
      <div slot="footer" class="dialog-footer">
        <el-button name="dialogTableVisible" type="primary" @click="dialogTableVisible = false">{{ $t('关闭') }}</el-button>
      </div>
    </ody-dialog>

  </section>
</template>

<script>

export default {
  name: 'CrmRightsInterestsDetial',
  list: [],
  relList: [],
  components: {
  },
  data() {
    // const vue = this
    return {
      dialogTableVisible: false,
      relationGroupId: null,
      searchRelForm: getDefaultSearchForm(),
      options: [{ code: 1, name: this.$t('权益卡') }, { code: 2, name: this.$t('会员等级') }],
      relPage: {
        size: 10,
        current: 1,
        total: 0
      },
      relationColumns: [
        {
          show: true,
          prop: 'entityTypeStr',
          label: this.$t('对象类型'),
          align: 'center',
          minWidth: 88
        }, {
          show: true,
          prop: 'entityId',
          label: this.$t('number'),
          align: 'center',
          minWidth: 200
        }, {
          show: true,
          prop: 'entityName',
          label: this.$t('对象名称'),
          align: 'center',
          minWidth: 124
        }
      ],
      searchForm: getDefaultSearchForm(),
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'id',
          label: this.$t('权益组编号'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'name',
          label: this.$t('权益组名称'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'createTimeStr',
          label: this.$t('编辑时间'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            if (row.updateTime) {
              return this.$portal.parseTime(row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')
            } else {
              return this.$portal.parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
          }
        },
        {
          show: true,
          prop: 'createUsername',
          label: this.$t('编辑人'), // 编辑人
          align: 'center',
          minWidth: 88,
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
        width: 300,
        align: 'center',
        list: [
          {
            label: this.$t('设置'),
            code: 'CrmRightsInterestsSet',
            method: (index, row) => {
              this.$router.push({
                name: 'CrmRightsInterestsDetial',
                params: {
                  id: row.id,
                  isEdit: 1
                }
              })
            }
          },
          {
            label: this.$t('查看'),
            code: 'CrmRightsInterestsGet',
            method: (index, row) => {
              this.$router.push({
                name: 'CrmRightsInterestsDetial',
                params: {
                  id: row.id,
                  isEdit: 0
                }
              })
            }
          },
          {
            label: this.$t('关联对象'),
            code: 'CrmRightsInterestsRelateObj',
            method: (index, row) => {
              this.dialogTableVisible = true
              this.searchRelForm.filters.entityType = null
              this.relationGroupId = row.id
              this.listRel()
              this.$forceUpdate()
            }
          },
          {
            label: this.$t('删除'),
            code: 'CrmRightsInterestsDelete',
            method: (index, row) => {
              this.$confirm(this.$t('确认删除吗'), this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
                cancelButtonText: this.$t('取消'),
                type: 'warning'
              }).then(() => {
                this.deleted(row)
              })
            }
          }
        ]
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
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handleRelSearchSubmit() {
      try {
        this.relPage.current = 1
        await this.listRel()
        this.$forceUpdate()
      } catch (ex) {
        console.log(ex)
      }
    },
    add() {
      this.$router.push({ name: 'CrmRightsInterestsDetialAdd',
        params: { isAdd: true }
      })
    },
    async deleted(row) {
      await delObj(this, row.id)
      await this.updateList()
    },
    async listRel() {
      await queryRel(this)
      this.$forceUpdate()
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
      this.handleSearchSubmit()
    },
    handleRelSearchReset() {
      this.searchRelForm = getDefaultSearchForm()
      this.handleRelSearchSubmit()
    },
    handlePageSizeChange() {
      this.handleSearchSubmit()
    },
    handleRelPageSizeChange() {
      this.handleRelSearchSubmit()
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handleRelPageCurrentChange() {
      try {
        await this.listRel()
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
      // this.loadCodes()
      this.updateList()
    }
    // loadCodes() {
    //   // options
    //   const common = vue.$crm.$api.common
    //   var cateArr = ["GROWTH_RULE_TYPE"]
    //   var param = {"categorys":cateArr,"pool":"crm"}

    //   const res = common.codeListMulti(param)
    //   if (res) {
    //     const data = res.data
    //     this.options = data.GROWTH_RULE_TYPE
    //   }
    // }
  }
}
function getDefaultSearchForm() {
  return Object.assign(
    {
      page: 1,
      limit: 10,
      filters: { entityType: null }
    }
  )
}

async function loadList(vue) {
  const rightsInterests = vue.$crm.$api.rightsInterests
  vue.searchForm.page = vue.page.current
  vue.searchForm.limit = vue.page.size
  const res = await rightsInterests.listInterestsGroup(vue.searchForm)
  if (res) {
    const data = res.data
    vue.list = data
    vue.page.total = res.total
  }
}

async function queryRel(vue) {
  const rightsInterests = vue.$crm.$api.rightsInterests
  vue.searchRelForm.page = vue.relPage.current
  vue.searchRelForm.limit = vue.relPage.size
  vue.searchRelForm.filters.interestsGroupId = vue.relationGroupId
  const res = await rightsInterests.listInterestsGroupRel(vue.searchRelForm)
  if (res) {
    const data = res.data
    vue.relList = data
    vue.relPage.total = res.total
    vue.$forceUpdate()
  }
}

async function delObj(vue, id) {
  const rightsInterests = vue.$crm.$api.rightsInterests
  const res = await rightsInterests.deleteInterestsGroup({ id: id })
  if (res) {
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
