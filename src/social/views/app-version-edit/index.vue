<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <el-row>
            <el-form-item>
              <div>{{ appDict.appName }}</div>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <div>{{ appDict.uniqueCode }}</div>
            </el-form-item>
          </el-row>
          <!-- <el-row>
            <el-form-item>
              <div>{{ $t('最新版本') }}:{{ appDict.appVersion }}</div>
            </el-form-item>
          </el-row>-->
        </el-form>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <el-button name="handleUploadConfig" size="mini" type="primary" @click="handleUploadConfig">{{ $t('新增APP版本') }}</el-button>
      </div>
      <div slot="table">
        <ody-table
          :data="data"
          :columns="columns"
          :loading="loading"
          :operates="operates"
          :can-filter="false"
          name="data670"
        >
          <template slot="updateType" slot-scope="scope">
            <el-switch
              :disabled="scope.row.promptUpdate==1"
              :active-value="2"
              :inactive-value="0"
              :active-text="scope.row.updateType === 2 ? $t('是') : $t('否')"
              v-model="scope.row.updateType"
              name="scope_row_updateType"
              @change="changeUpdateType(scope.row,scope.row.updateType)"
            />
          </template>
          <template slot="promptUpdate" slot-scope="scope">
            <el-switch
              :disabled="scope.row.updateType==2"
              :active-value="1"
              :inactive-value="0"
              :active-text="scope.row.promptUpdate === 1 ? $t('是') : $t('否')"
              v-model="scope.row.promptUpdate"
              name="scope_row_promptUpdate"
              @change="changePromptUpdate(scope.row,scope.row.promptUpdate)"
            />
          </template>
        </ody-table>
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
    <div slot="footer" align="center">
      <el-button name="handleBack" size="small" @click="handleBack">{{ $t('返回') }}</el-button>
    </div>
    <social-app-version-edit-dialog
      v-if="configDialogVisible"
      :visible.sync="configDialogVisible"
      :dict-id.sync="dictId"
      :platform-type.sync="platformType"
      @ok="query"
    />
  </div>
</template>

<script>
import SocialAppVersionEditDialog from '@/components/app-version-edit-dialog'
export default {
  name: 'SocialAppVersionEdit',
  components: {
    SocialAppVersionEditDialog
  },
  data() {
    const self = this
    return {
      configInfo: {},
      configDialogVisible: false,
      dictId: null,
      platformType: null,
      appDict: {},
      data: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'versionCode',
          label: this.$t('版本号'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'obtainUrl',
          label: this.$t('安装包链接'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          slot: 'updateType',
          label: this.$t('是否强制更新'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          slot: 'promptUpdate',
          label: this.$t('是否提示更新'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'updateTimeStr',
          label: this.$t('更新时间'),
          align: 'center',
          minWidth: 120
        }
      ],
      operates: {
        width: 150,
        align: 'center',
        list: [
          // {
          //   label: this.$t('下载'),
          //   disabled: false,
          //   method(index, row) {
          //     self.handleDownload(row.obtainUrl)
          //   }
          // },
          {
            label: this.$t('删除'),
            disabled: false,
            method(index, row) {
              self.handleDelete(row.id)
            },
            code: 'SocialAppVersionManageDelete'
          }
        ]
      },
      loading: false
    }
  },
  async mounted() {
    this.socialApi = this.$social.$api.socialApi
    this.init()
  },
  methods: {
    init() {
      this.query()
    },
    handleBack() {
      this.$portal.delActiveViewAndRefresh('SocialAppVersionManage')
    },
    handleUploadConfig() {
      this.platformType = this.appDict.platformType
      this.dictId = this.$route.query.id
      this.configDialogVisible = true
    },
    // handleDownload(url) {
    //   const param = {}
    //   const filenameArr = url.split('/')
    //   const filename = filenameArr[filenameArr.length - 1]
    //   this.$portal.downloadFileByGet(url, param, filename)
    // },
    handleDelete(id) {
      const param = {
        id: id,
        pageNo: this.page.current,
        pageSize: this.page.size
      }
      this.socialApi.deleteApp(param).then(res => {
        if (res.code === '0') {
          this.$message.success(this.$t('删除成功'))
        } else {
          this.$message.error('删除失败')
        }
        this.page.current = 1
        this.query()
      })
    },
    handlePageSizeChange() {
      this.query()
    },
    handlePageCurrentChange() {
      this.query()
    },
    async changeUpdateType(row, updateType) {
      const submitParams = {}
      submitParams.id = row.id
      submitParams.updateType = updateType
      const result = await this.socialApi.updateAppDetail(submitParams)
      if (result && result.code === '0') {
        this.query()
      }
    },
    async changePromptUpdate(row, promptUpdate) {
      const submitParams = {}
      submitParams.id = row.id
      submitParams.promptUpdate = promptUpdate
      const result = await this.socialApi.updateAppDetail(submitParams)
      if (result && result.code === '0') {
        this.query()
      }
    },
    query() {
      const param = {
        dictId: this.$route.query.id,
        pageNo: this.page.current,
        pageSize: this.page.size
      }
      this.loading = true
      try {
        this.socialApi.queryAppDetailList(param).then(res => {
          if (res.data) {
            if (res.data.appDict) {
              this.appDict = res.data.appDict
            }
            this.page.total = res.data.totalCount
            this.data = res.data.detailList
            this.data.forEach(item => {
              if (item.updateTime) {
                item.updateTimeStr = this.$portal.parseTime(item.updateTime, '{y}-{m}-{d} {h}:{i}:{s}')
              }
            })
          }
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
</style>
