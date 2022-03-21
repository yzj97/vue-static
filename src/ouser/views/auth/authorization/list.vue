<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('项目名称:')" :space="1" prop="authProjectName">
            <el-input v-model="filters.authProjectName" :placeholder="$t('请输入') + $t('项目名称')" name="searchForm_filters_authProjectName" />
          </ody-search-item>
          <ody-search-item :label="$t('商家名称:')" :space="1" prop="merchantName">
            <el-input v-model="filters.merchantName" :placeholder="$t('请输入') + $t('商家名称')" name="searchForm_filters_merchantName" />
          </ody-search-item>
          <ody-search-item :label="$t('店铺名称:')" :space="1" prop="storeName">
            <el-input v-model="filters.storeName" :placeholder="$t('请输入') + $t('店铺名称')" name="searchForm_filters_storeName" />
          </ody-search-item>
          <ody-search-item :label="$t('授权code:')" :space="1" prop="authCode">
            <el-input v-model="filters.authCode" :placeholder="$t('请输入') + $t('授权code')" name="searchForm_filters_authCode" />
          </ody-search-item>
          <ody-search-item :label="$t('访问令牌:')" :space="1" prop="accessToken">
            <el-input v-model="filters.accessToken" :placeholder="$t('请输入') + $t('访问令牌')" name="searchForm_filters_accessToken" />
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
        <ody-button name="ui_toAuth" code="ui" size="small" type="primary" @click="toAuth">{{ $t('授权') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          v-loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :can-filter="false"
          name="authorizationTable"
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
    <ody-dialog
      :visible.sync="visible"
      :title="$t('授权')"
      :before-close="closeDialog"
      width="460px">
      <div>
        <el-form ref="auth" :model="auth" label-width="100px">
          <el-form-item label="appKey" clearable required>
            <el-input v-model="auth.appKey" name="auth_appKey"/>
          </el-form-item>
          <el-form-item label="redirectUrl" clearable required>
            <el-input v-model="auth.redirectUrl" name="auth_redirectUrl"/>
          </el-form-item>
          <el-form-item label="授权链接">
            {{ computedAuthUrl }}
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <!--<el-button v-clipboard:copy="authUrl" v-clipboard:success="copyUrlSuccess" size="small" type="primary">复制链接</el-button>-->
        <el-button v-clipboard:copy="authUrl" name="doAuth" size="small" type="primary" @click="doAuth">跳转授权</el-button>
      </span>
    </ody-dialog>
  </section>
</template>
<script>
export default {
  name: 'AuthorizationList',
  data() {
    return {
      visible: false,
      loading: false,
      list: [],
      auth: {
        appKey: '',
        redirectUrl: ''
      },
      authUrl: null,
      authPath: '/auth?appKey={appKey}&redirectUrl={redirectUrl}',
      authUri: '{baseUrl}/#/auth?appKey={appKey}&redirectUrl={redirectUrl}',
      authTypeList: [
        { key: 1, value: this.$t('用户所有权限') },
        { key: 2, value: this.$t('商家权限') },
        { key: 3, value: this.$t('店铺权限') }
      ],
      columns: [
        {
          label: this.$t('项目名称'),
          prop: 'authProjectName',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('授权类型'),
          prop: 'authType',
          show: true,
          align: 'center',
          formatter: (row, column, cellValue) => {
            if (row.authType) {
              const array = this.authTypeList.filter(k => k.key === row.authType)
              return array && array.length > 0 ? array[0].value : this.$t('未知')
            }
          }
        },
        {
          label: this.$t('授权用户'),
          prop: 'userName',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('授权商家'),
          prop: 'merchantName',
          show: true,
          align: 'center',
          formatter: (row, column, cellValue) => {
            if (row.authType === 1) {
              return this.$t('全部')
            }
            return row.merchantName
          }
        },
        {
          label: this.$t('授权店铺'),
          prop: 'storeName',
          show: true,
          align: 'center',
          formatter: (row, column, cellValue) => {
            if (row.authType === 1 || row.authType === 2) {
              return this.$t('全部')
            }
            return row.storeName
          }
        },
        {
          label: this.$t('授权code'),
          prop: 'authCode',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('授权时间'),
          prop: 'authTime',
          show: true,
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            if (row.authTime) {
              return this.$portal.parseTime(
                row.authTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
          }
        },
        {
          label: this.$t('授权过期时间'),
          prop: 'authExpireTime',
          show: true,
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            if (row.authExpireTime) {
              return this.$portal.parseTime(
                row.authExpireTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
          }
        },
        {
          label: this.$t('访问令牌'),
          prop: 'accessToken',
          show: true,
          align: 'center'
        },
        {
          label: this.$t('令牌过期时间'),
          prop: 'tokenExpireTime',
          show: true,
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            if (row.tokenExpireTime) {
              return this.$portal.parseTime(
                row.tokenExpireTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
          }
        },
        {
          label: this.$t('令牌时长'),
          prop: 'tokenExpiresIn',
          show: true,
          align: 'right',
          minWidth: 88
        },
        {
          label: this.$t('令牌更新时间'),
          prop: 'tokenUpdateTime',
          show: true,
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            if (row.tokenUpdateTime) {
              return this.$portal.parseTime(
                row.tokenUpdateTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            }
          }
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
        align: 'center',
        list: [
          {
            code: 'ui',
            label: this.$t('删除'),
            method: (index, row) => {
              this.delete(row)
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
  computed: {
    computedAuthUrl() {
      return this.getAuthUrl()
    }
  },
  mounted() {
    this.init()
    if (this.$route.query.auth) {
      const vue = this
      const _appKey = this.$route.query.appKey
      const _redirectUrl = this.$route.query.redirectUrl
      setTimeout(function() {
        vue.auth.appKey = _appKey
        vue.auth.redirectUrl = _redirectUrl
        vue.visible = true
      }, 500)
    }
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
      this.$ouser.$api.openAuth.listAuthorizationPage(args).then(
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
    toAuth() {
      this.authUrl = ''
      this.auth.appKey = ''
      this.auth.redirectUrl = ''
      this.visible = true
    },
    copyUrlSuccess() {
      this.$message({
        message: 'Copy successfully',
        type: 'success',
        duration: 1000
      })
    },
    closeDialog() {
      this.visible = false
      if (this.$route.query.auth) {
        const vue = this
        this.$portal.delActiveView()
        setTimeout(function() {
          vue.$router.push({ name: 'AuthorizationList' })
        }, 200)
      }
    },
    doAuth() {
      if (!this.auth.appKey) {
        this.$message('appKey不能为空')
        return
      }
      if (!this.auth.redirectUrl) {
        this.$message('重定向URL不能为空')
        return
      }
      // location.href = this.authUrl
      const path = this.authPath.replace('{appKey}', this.auth.appKey).replace('{redirectUrl}', this.auth.redirectUrl)
      this.$router.push({ path: path })
    },
    getAuthUrl() {
      return (this.authUrl = this.authUri.replace('{baseUrl}', location.origin).replace('{appKey}', this.auth.appKey).replace('{redirectUrl}', this.auth.redirectUrl))
    },
    async delete(row) {
      const confirm = await this.$confirm(
        this.$t('是否删除当前') + this.$t('授权信息'),
        this.$t('common_prompt')
      )
      if (confirm) {
        const ids = []
        ids.push(row.id)
        const result = await this.$ouser.$api.openAuth.deleteAuthorization(
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
