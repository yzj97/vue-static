<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('appKey:')" :space="1" prop="appKey">
            <el-input ref="appKey" v-model="filters.appKey" name="appKey" />
          </ody-search-item>
          <ody-search-item :label="$t('项目名称:')" :space="1" prop="projectName">
            <el-input ref="projectName" v-model="filters.projectName" name="projectName" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('common_reset') }}</el-button>
        <el-button
          name="search"
          size="small"
          type="primary"
          @click="search"
        >{{ $t('common_select') }}</el-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <div slot="btn-bottom">
        <el-button
          name="AuthProject_add_add"
          size="small"
          type="primary"
          code="AuthProject_add"
          @click="add"
        >{{ $t('newly_added') }}</el-button>
      </div>
      <div slot="table">
        <ody-table
          v-loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :can-filter="false"
          name="authProjectTable"
        />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.page"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.limit"
          :total.sync="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="search"
          @current-change="search"
        />
      </div>
    </ody-list-table-area>
    <ody-dialog :visible.sync="dialogVisible" :title="dialogAdd ? '新增' : '修改'" width="600px">
      <el-form ref="form" :model="obj" label-width="80px">
        <el-form-item :label="$t('项目名称')">
          <el-input ref="projectName" v-model="obj.projectName" :disabled="!dialogAdd" name="projectName" />
        </el-form-item>
        <el-form-item :label="$t('项目域名')">
          <el-input ref="projectDomain" v-model="obj.projectDomain" name="projectDomain" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button name="ui_submit" code="ui" size="small" type="primary" @click="addAuthProject">{{ $t('确定') }}</el-button>
        <el-button name="ui_closeDialog" code="ui" size="small" @click="dialogVisible = false">{{ $t('取消') }}</el-button>
      </span>
    </ody-dialog>
  </section>
</template>
<script>
export default {
  name: 'AuthProjectList',
  data() {
    return {
      obj: {},
      loading: false,
      dialogAdd: true,
      dialogVisible: false,
      list: [],
      columns: [
        {
          label: this.$t('appKey'),
          prop: 'appKey',
          show: true,
          align: 'center',
          minWidth: 200
        },
        {
          label: this.$t('appSecret'),
          prop: 'appSecret',
          show: true,
          align: 'center',
          minWidth: 200
        },
        {
          label: this.$t('项目名称'),
          prop: 'projectName',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('项目域名'),
          prop: 'projectDomain',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('创建时间'),
          prop: 'createTime',
          show: true,
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            if (row.createTime) {
              return this.$portal.parseTime(
                row.createTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
          }
        }
      ],
      operates: {
        fixed: 'right',
        width: 124,
        align: 'center',
        list: [
          {
            code: 'ui',
            label: this.$t('编辑'),
            method: (index, row) => {
              this.obj = row
              this.dialogAdd = false
              this.dialogVisible = true
            }
          },
          {
            code: 'ui',
            label: this.$t('删除'),
            method: (index, row) => {
              this.delete(row)
            }
          },
          {
            code: 'ui',
            label: this.$t('去授权'),
            method: (index, row) => {
              this.$router.push({ name: 'AuthorizationList', query: { auth: true, appKey: row.appKey, redirectUrl: row.projectDomain }})
            }
          }
        ]
      },
      filters: {},
      page: {
        page: 1,
        limit: 10
      },
      total: 0
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    this.init()
  },
  methods: {
    async init() {
      this.search()
    },
    search() {
      this.loading = true
      const args = { currentPage: this.page.page, itemsPerPage: this.page.limit, ...this.filters }
      this.$ouser.$api.openAuth.listAuthProjectPage(args).then(
        res => {
          this.loading = false
          this.list = res.data.listObj
          this.total = res.data.total
        },
        () => {
          this.loading = false
        }
      )
    },
    reset() {
      this.filters = {}
    },
    add() {
      this.obj = {}
      this.dialogAdd = true
      this.dialogVisible = true
    },
    addAuthProject() {
      if (!this.obj.projectName) {
        this.$message(this.$t('项目名称不能为空'))
        return
      }
      this.$ouser.$api.openAuth.saveOrUpdateAuthProject(this.obj).then(res => {
        this.search()
        this.dialogVisible = false
      })
    },
    async delete(row) {
      const confirm = await this.$confirm(
        this.$t('是否删除当前') + this.$t('授权项目'),
        this.$t('common_prompt')
      )
      if (confirm) {
        const ids = []
        ids.push(row.id)
        const result = await this.$ouser.$api.openAuth.deleteAuthProject(
          ids
        )
        if (result && result.code === '0') {
          this.search()
          this.$message({
            type: 'success',
            message: this.$t('common_delete_success')
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
