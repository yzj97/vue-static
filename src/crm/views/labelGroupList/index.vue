<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item :label="$t('label_group_name')" type="text" prop="param.name">
              <el-input v-model="searchForm.param.name" name="searchForm_param_name" maxlength="50"/>
            </ody-search-item>
            <ody-search-item :label="$t('common_create_username')" class="register" prop="param.createUsername">
              <el-input v-model="searchForm.param.createUsername" name="searchForm_param_createUsername" type="text" maxlength="50"/>
            </ody-search-item>
            <ody-search-item :space="2" :label="$t('common_createTime')" type="text" prop="data">
              <ody-date-range-picker v-model="searchForm.data" name="searchForm_data" type="datetimer"/>
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button v-permission="'LabelGroupListReset'" name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('reset') }}</el-button>
          <ody-button v-permission="'LabelGroupListQuery'" name="handleSearchSubmit" size="small" type="primary" @click="handleSearchSubmit">{{ $t('query') }}</ody-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="tabs">
          <div slot="btn mgB12">
            <el-button v-permission="'LabelGroupListAdd'" name="addLabelGroup" size="small" type="primary" @click="addLabelGroup">{{ $t('add_label_group') }}</el-button>
          </div>
        </div>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="labelGroupList"
            :columns="columns"
            :operates="operates"
            name="labelGroupList870"/>
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="page.current"
            :list="labelGroupList"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="page.size"
            :total.sync="page.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handlePageSizeChange"
            @current-change="handlePageCurrentChange"/>

        </div>
      </ody-list-table-area>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'OuserCenterLabelGroupList',
  data() {
    const self = this
    return {
      loading: false,
      labelGroupList: [],
      searchForm: {
        data: [],
        param: {
          createUsername: null,
          name: null }
      },
      page: {
        size: 10,
        itemsPerPage: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'name',
          label: this.$t('label_group_name'),
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            const p = {
              name: 'OuserCenterAddOrEditLabelGroup',
              params: {
                id: params.row.id
              }
            }
            return (
              <router-link to={p} class='link-type'>
                <span>{ params.row.name}</span>
              </router-link>
            )
          }
        }, {
          show: true,
          prop: 'createTime',
          label: this.$t('common_createTime'),
          align: 'center',
          minWidth: 160,
          formatter(row, column) {
            if (row.createTime) {
              return self.$portal.parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
            return ''
          }
        }, {
          show: true,
          prop: 'updateTime',
          label: this.$t('common_update_time'),
          align: 'center',
          minWidth: 160,
          formatter(row, column) {
            if (row.updateTime) {
              return self.$portal.parseTime(row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')
            }
            return ''
          }
        }, {
          show: true,
          prop: 'labelNum',
          label: this.$t('label_num'),
          align: 'center',
          minWidth: 160
        }, {
          show: true,
          prop: 'createUsername',
          label: this.$t('common_create_username'),
          align: 'center',
          minWidth: 160
        }, {
          show: true,
          prop: 'groupStatus',
          label: this.$t('label_group_status'),
          align: 'center',
          minWidth: 160,
          render: function(h, params) {
            const changeStatus = self.changeStatus
            return (
              <div on-click={(e) => changeStatus(e, params.row)}><el-switch value={params.row.groupStatus === 1 } active-text={ params.row.groupStatus === 1 ? '启用' : '停用' }></el-switch></div>
            )
          }
        }
      ],
      operates: {
        fixed: 'right',
        align: 'center',
        minWidth: 100,
        list: [
          {
            label: this.$t('common_delete'),
            method(index, row) {
              self.delete(row)
            },
            hidden(index, row) {
              if (self.functions.indexOf('LabelGroupListDelete') > 0) {
                return false
              } else {
                return true
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'functions'
    ])
  },
  async mounted() {
    try {
      this.loading = true
      await this.init()
    } catch (ex) {
      console.log(ex)
    } finally {
      this.loading = false
    }
  },
  activated() {
    this.$portal.delViewByName('OuserCenterAddOrEditLabelGroup')
  },
  methods: {
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
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.searchForm = {
        data: [],
        param: {
          createUsername: null,
          name: null
        }
      }
    },
    async handlePageSizeChange(size) {
      try {
        this.page.size = size
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    addLabelGroup() {
      this.$router.push({
        name: 'OuserCenterAddOrEditLabelGroup'
      })
    },
    delete(row) {
      const vue = this
      vue.$confirm(vue.$t('confirm_delete_label_group'), vue.$t('whether_delete_label_group'), {
        confirmButtonText: vue.$t('common_delete'),
        cancelButtonText: vue.$t('common_cancel')
      }).then(() => {
        const labelGroup = vue.$crm.$api.labelGroup
        labelGroup.deleteLabelGroup({ id: row.id }).then((result) => {
          vue.$message({
            type: 'success',
            message: vue.$t('common_delete_success')
          })
          vue.updateList()
        }).catch(() => {
          vue.updateList()
        })
      }, () => {})
    },
    changeStatus(e, row) {
      const vue = this
      e.preventDefault()
      var updatePara = {}
      updatePara.id = row.id
      updatePara.groupStatus = row.groupStatus === 0 ? 1 : 0
      const labelGroup = this.$crm.$api.labelGroup
      labelGroup.updateLabelGroupStatus(updatePara).then(res => {
        vue.$message({
          type: 'success',
          message: vue.$t('common_update_status_success')
        })
        vue.updateList()
      })
    },
    async init() {
      await this.updateList()
    }
  }
}
async function loadList(vue) {
  if (vue.searchForm.data) {
    vue.searchForm.param.startCreateTime = vue.searchForm.data[0]
    vue.searchForm.param.endCreateTime = vue.searchForm.data[1]
  } else {
    delete this.search.param.startCreateTime
    delete this.search.param.endCreateTime
  }
  const filters = JSON.parse(JSON.stringify(vue.searchForm.param))
  const param = {
    filters: filters,
    limit: vue.page.size,
    page: vue.page.current
  }
  return vue.$crm.$api.labelGroup.queryLabelGroupPage(param).then((res) => {
    if (res.code === '0') {
      vue.page.total = res.total
      vue.labelGroupList = res.data
    }
  })
}

</script>
