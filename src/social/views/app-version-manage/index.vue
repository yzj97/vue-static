<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('APP名称') + ':'" prop="appName">
            <el-input v-model="searchForm.appName" name="searchForm_appName"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button name="SocialAppVersionManageListQuery_handleSearchQuery" size="small" type="primary" code="SocialAppVersionManageListQuery" @click="handleSearchQuery">{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <!-- <div slot="btn">
        <el-form ref="fileUpload" :model="fileUpload">
          <el-upload
            ref="upload"
            :limit="1"
            :on-change="handlePreview"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :auto-upload="false"
            :show-file-list="true"
            :action="doUpload"
            :disabled="!isAvailable"
            :file-list.sync="fileList"
            multiple
            class="upload-attachment"
            accept=".apk,.ipa"
          >
            <el-button :disabled="!isAvailable" size="small" type="primary">{{ $t('上传APP') }}</el-button>
          </el-upload>
        </el-form>
      </div>-->
      <div slot="table">
        <ody-table
          :data="data"
          :columns="columns"
          :loading="loading"
          :operates="operates"
          :can-filter="false"
          name="data265"/>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="data"
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
  </div>
</template>

<script>
export default {
  name: 'SocialAppVersionManage',
  data() {
    const self = this
    return {
      // doUpload: '/api/social-back-web/appDict/uploadApp',
      searchForm: {
        appName: ''
      },
      flag: false,
      flag1: false,
      isAvailable: true,
      fileUpload: {
        fileNames: '',
        file: ''
      },
      fileList: [],
      loading: false,
      data: [],
      columns: [
        {
          show: true,
          prop: 'appName',
          label: this.$t('APP名称'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'platformType',
          label: this.$t('平台类型'),
          align: 'center',
          minWidth: 120,
          formatter: (row, column) => {
            const text = row.platformType === 0 ? 'Android' : 'IOS'
            return (text)
          }
        },
        // {
        //   show: true,
        //   prop: 'appChannel',
        //   label: this.$t('渠道类型'),
        //   align: 'center',
        //   minWidth: 120
        // },
        // {
        //   show: true,
        //   prop: 'appVersion',
        //   label: this.$t('版本号'),
        //   align: 'center',
        //   minWidth: 120
        // },
        {
          show: true,
          prop: 'updateTimeStr',
          label: this.$t('更新时间'),
          align: 'center',
          minWidth: 130
        }
      ],
      operates: {
        width: 100,
        align: 'center',
        list: [
          {
            label: this.$t('编辑'),
            disabled: false,
            method(index, row) {
              self.handleEdit(row.id)
            },
            code: 'SocialAppVersionManageEdit'
          }
        ]
      },
      page: {
        size: 10,
        current: 1,
        total: 0
      }
    }
  },
  async mounted() {
    try {
      this.socialApi = this.$social.$api.socialApi
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    handleReset() {
      this.page = {
        size: 10,
        current: 1,
        total: 0
      }
      this.searchForm.appName = ''
      this.handleQuery()
    },
    init() {
      this.handleQuery()
    },
    handleEdit(id) {
      this.$router.push({
        path: '/social-back-web/app-version-edit',
        query: {
          id: id
        }
      })
    },
    async handleSearchQuery() {
      this.page.current = 1
      this.handleQuery()
    },
    handleQuery() {
      const param = Object.assign({}, this.searchForm)
      param.pageNo = this.page.current
      param.pageSize = this.page.size
      this.loading = true
      try {
        this.socialApi.queryAllAppDict(param).then(res => {
          if (res.data && res.data.listObj) {
            this.data = res.data.listObj
            this.data.forEach(item => { item.updateTimeStr = this.$portal.parseTime(item.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') })
          }
          this.page.total = res.data.total
        })
      } finally {
        this.loading = false
      }
    },
    handlePageSizeChange() {
      this.handleQuery()
    },
    handlePageCurrentChange() {
      this.handleQuery()
    }
  }
}
</script>

<style scoped>

</style>
